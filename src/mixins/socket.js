import {
  convertLocation,
  json2buffer,
  utf8ByteToUnicodeStr
} from '../lib/util';
import { SOCKET, WIDE_SEARCH as WD } from '../lib/config';
import RadarWebSocket from '../lib/RadarSocket';

module.exports = {
  methods: {
    /**
     * 初始化socket
     */
    initSockets() {
      // MAX_SOCKETS: this.$parent.mode === 'normal' ? 1 : WIDE_SEARCH.MAX_SOCKETS,

      let max = this.mode === 'normal' ? 1 : this.thread;
      for (let index = 0; index < max; index++) {
        let socket = new RadarWebSocket({
          url: SOCKET.URL,
          maxReconnectTime: SOCKET.MAX_RECONNECT_TIME,
          reconnectTimeout: SOCKET.RECONNECT_TIMEOUT,
          index: index,
          onopen: this.onSocketOpen,
          onmessage: this.onSocketMessage
        });
        this.sockets.push(socket);
      }
    },
    /**
     * 发送消息
     */
    sendMessage: function(message, socketIndex = 0) {
      console.log('sendMessage', message);

      // let message = this.initSocketMessage(type, options);
      if (message.request_type != '1004') {
        this.addStatusWithoutNewline('WSS发送消息：');
        this.addStatus(JSON.stringify(message));
      }

      let socket = this.sockets[socketIndex];
      
      socket.send(json2buffer(message));

      //监听回应
      if (socket.timeout) {
        clearTimeout(socket.timeout);
      }
      socket.timeout = setTimeout(() => {
        this.notify("操作过于频繁，请稍后再查询");
        // console.log(`ws.${socket.index} reconnect due to no response`);
        // socket.initSocket();
      },socket.opts.maxTimeout);
    },
    /**
     * socket开启连接回调
     */
    onSocketOpen: function(event, socket) {
      this.addStatus(`WSS-${socket.index}.连接开启`);
      console.log(`WSS-${socket.index}.连接开启`);
      // 首次连接
      if (this.firstTime) {
        this.firstTime = false;
        this.getSettingFileName();
        this.getBossLevelConfig();
      }
    },
    /**
     * 消息响应回调
     */
    onSocketMessage: function(event, socket) {
      var blob = event.data;

      if (typeof blob !== 'string') {
        var fileReader = new FileReader();
        fileReader.onload = e => {
          var arrayBuffer = e.target.result;
          var n = utf8ByteToUnicodeStr(new Uint8Array(arrayBuffer).slice(4));

          var data = JSON.parse(n);

          console.log(`onSocketMessage${socket.index}`, data);
          this.handleMessage(data, socket);
        };
        fileReader.readAsArrayBuffer(blob);
      }
    },
    /**
     * 根据messageType构建socket消息
     * @param {*}} type
     * @param {*} options
     */
    initSocketMessage(type, options) {
      let message = null;
      switch (type) {
        case '1001': // 查询妖灵
          message = {
            request_type: '1001',
            longitude: this.location.longitude,
            latitude: this.location.latitude,
            requestid: this.genRequestId('1001'),
            platform: 0
          };
          break;
        case '1002': // 查询擂台
          message = {
            request_type: '1002',
            longitude: this.location.longitude,
            latitude: this.location.latitude,
            requestid: this.genRequestId('1002'),
            platform: 0
          };
          break;
        case '10041': // 查询最新妖灵配置文件
          message = {
            request_type: '1004',
            cfg_type: 1,
            requestid: this.genRequestId('10041'),
            platform: 0
          };
          break;
        case '10040': // 暂未使用
          message = {
            request_type: '1004',
            cfg_type: 0,
            requestid: this.genRequestId('10040'),
            platform: 0
          };
          break;
        default:
          break;
      }
      if (message && options) {
        message = Object.assign({}, message, options);
      }

      // 坐标处理
      // longitude -> longtitude
      if (message.latitude && message.longitude) {
        message.latitude = convertLocation(message.latitude);
        message.longtitude = convertLocation(message.longitude);
        delete message.longitude;
      }

      return message;
    }
  }
};
