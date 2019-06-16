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

      //let max = this.mode === 'normal' ? 1 : this.thread;
      let max = this.thread;
      let maxTimeout = this.mode === 'temp' ? 1000 : 3000;
      for (let index = 0; index < max; index++) {
        let socket = new RadarWebSocket({
          url: SOCKET.URL,
          maxReconnectTime: SOCKET.MAX_RECONNECT_TIME,
          reconnectTimeout: SOCKET.RECONNECT_TIMEOUT,
          index: index,
          maxTimeout: maxTimeout,
          onopen: this.onSocketOpen,
          onmessage: this.onSocketMessage,
          onclose: this.onSocketClose
        });
        // this.sockets.push(socket);
      }
    },
    /**
     * 发送消息
     */
    sendMessage: function(message, socket) {
      console.log('sendMessage', message, socket);

      let _socket = socket || this.sockets[0];
      if (_socket) {
        _socket.send(json2buffer(message));
        if (this.mode === "normal") {
          if (_socket.timeout) {
            clearTimeout(_socket.timeout);
          }
          _socket.timeout = setTimeout(() => {
            this.notify("操作过于频繁，请稍后再查询");
            this.boxError();
          },_socket.opts.maxTimeout);
        }
      }
    },
    /**
     * socket开启连接回调
     */
    onSocketOpen: function(event, socket) {
      console.log(`WSS-${socket.index}.连接开启`);
      this.sockets[socket.index] = socket;
      // 首次连接 不再浪费这次请求，以后手动筛查版本
      // if (this.firstTime) {
      //   this.firstTime = false;
      //   this.getSettingFileName();
      //   this.getBossLevelConfig();
      // }
      if (this.searching) {
        // 断线重连时，继续任务
        this.startTaskWithSocket(socket);
      }
    },
    /**
     * 使用指定socket开始任务
     * @param {*} socket
     */
    startTaskWithSocket(socket) {
      if (!socket) {
        return false;
      }
      let _task = this.radarTask.getNextTask(); // 获取队列中第一个任务
      if (_task) {
        socket.task = _task;
        this.sendMessage(
          this.initSocketMessage('1001', {
            longitude: _task.longitude,
            latitude: _task.latitude
          }),
          socket
        );
      } else {
        delete socket.task;
      }
    },
    /**
     * socket 链接断开
     * @param {*} event
     * @param {*} socket
     */
    onSocketClose(event, socket) {
      this.sockets[socket.index] = null;
      console.log('socket close', socket);
      if (socket.task && socket.task.status !== 'close') {
        this.radarTask.reopenTask(socket.task.taskIndex);
      } else {
        delete socket.task;
      }
    },
    /**
     * 消息响应回调
     */
    onSocketMessage: function(event, socket) {
      let blob = event.data;

      if (typeof blob !== 'string') {
        let fileReader = new FileReader();
        fileReader.onload = e => {
          let arrayBuffer = e.target.result;
          let n = utf8ByteToUnicodeStr(new Uint8Array(arrayBuffer).slice(4));

          let data = JSON.parse(n);

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
