<template>
  <div id="app">
    <right-nav :version="APP_VERSION" :settings="settings"></right-nav>
    <div id="status" v-show="debug">
      <div id="info"><br/><span v-html="status"></span></div>
    </div>
    <div id="buttons">
      <el-button size="mini" @click="getYaolingInfo">妖灵</el-button>
      <el-button size="mini" @click="getLeitaiInfo">擂台(未开发)</el-button>
      <el-button size="mini" type="warning" @click="debug = !debug">Debug</el-button>
    </div>
    <div id="qmap"></div>
  </div>
</template>
<script>
import tempdata from './components/tempdata';
import mixins from './components/mixins';
import bot from './components/bot';
import map from './components/map';
import RadarWebSocket from './components/socket';
import RightNav from './components/rightNav';
import {
  getLocalStorage,
  setLocalStorage,
  utf8ByteToUnicodeStr,
  convertLocation,
  json2buffer
} from './components/util';

import {
  FILTER,
  API_KEY,
  CUR_YAOLING_VERSION,
  APP_VERSION,
  BOT
} from './config';

export default {
  name: 'zhuoyao-radar',
  mixins: [mixins, bot, map],
  components: {
    RightNav
  },
  data() {
    let location = getLocalStorage('radar_location');
    if (!location) {
      location = {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      };
    }
    return {
      location,
      APP_VERSION,
      showNav: false, // 左侧菜单栏
      unknownKey: [],
      status: '',
      socket: {},
      map: {},
      debug: false,
      clickMarker: null, // 点击位置标记
      userMarker: null, // 用户位置标记
      firstTime: true, // 首次连接socket标记
      currVersion: CUR_YAOLING_VERSION, //190508版本的json 如果有变动手动更新
      statusOK: false,
      yaolings: tempdata.Data,
      markers: [],
      messageMap: new Map(), // 缓存请求类型和id
      settings: {
        fit: {
          t1: false,
          t2: false,
          all: false,
          nest: false,
          rare: true,
          fish: false,
          feature: false,
          element: false
        },
        auto_search: false
      },
      botMode: false,
      botInterval: null,
      botTime: 0,
      botGroup: '799576270',
      botChecked: [],
      botWelcomeInfo: '捉妖扫描机器人2.1启动~有什么问题可以@我哦',
      botLocation: {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      }
    };
  },
  mounted() {
    let settings = getLocalStorage('radar_settings');
    if (settings) {
      this.settings = settings;
    }

    // 初始化地图组件
    this.initMap();

    // 初始化websocket
    this.socket = new RadarWebSocket({
      onopen: this.onSocketOpen,
      onmessage: this.onSocketMessage
    });

    // 获取用户位置
    this.getLocation()
      .then(
        position => {
          this.location.longitude = position.longitude;
          this.location.latitude = position.latitude;

          var pos = new qq.maps.LatLng(
            this.location.latitude,
            this.location.longitude
          );
          this.map.panTo(pos);
          this.userMarker = new qq.maps.Marker({
            position: pos,
            map: this.map
          });
        },
        e => {
          console.log(e);
        }
      )
      .catch(b => {});

    this.addStatus(`捉妖雷达Web版 <br/>
      版本:${APP_VERSION} <br/>
      更新日志:<br/>
      丰富筛选库，优化界面<br/>
      点击地图自动筛选功能<br/>`);

    this.$on('botSetup', params => {
      this.botSetup(params);
    });
    // window.app = {};
    // window.app.botSetup = this.botSetup;
    //this.addStatus("开发者:ZachXia,Vitech");
    // setTimeout(() => {
    //   this.notify('提示:点击右下角菜单开始筛选！');
    // }, 2000);
  },
  methods: {
    /**
     * 跨域获取最新妖灵数据
     */
    getYaolings: function() {
      // var url = 'https://hy.gwgo.qq.com/sync/pet/config/' + this.currVersion;
      // try {
      //     $.getJSON(url,result => {
      //         console.log(result);
      //         this.statusOK = true;
      //     });
      //     console.log("1");
      // } catch(e) {
      //     console.log(e);
      //     console.log("3");
      // }
      // console.log("2");
      this.statusOK = true;
    },
    /**
     * 缓存响应的类型和id
     */
    genRequestId: function(type) {
      let _time = new Date().getTime() % 1234567;
      this.messageMap.set(`msg_${_time}`, type);
      return _time;
    },
    /**
     * 根据id找到请求的类型
     */
    getRequestTypeFromId: function(id) {
      return this.messageMap.get(id);
    },

    onSocketOpen: function() {
      this.addStatus('WSS连接开启');
      console.log('WSS连接开启');
      // 首次连接
      if (this.firstTime) {
        this.firstTime = false;
        this.getSettingFileName();
        this.getBossLevelConfig();
      }
    },
    /**
     * 消息响应
     */
    onSocketMessage: function(event) {
      var blob = event.data;

      if (typeof blob !== 'string') {
        var fileReader = new FileReader();
        fileReader.onload = e => {
          var arrayBuffer = e.target.result;
          var n = utf8ByteToUnicodeStr(new Uint8Array(arrayBuffer).slice(4));

          var data = JSON.parse(n);

          this.handleMessage(data);
        };
        fileReader.readAsArrayBuffer(blob);
      }
    },

    /**
     * 根据查询结果过滤数据，打标记
     */
    buildMarkersByData: function(t) {
      this.clearAllMarkers();

      t.forEach(item => {
        if (
          this.fit[0] === 'special' ||
          this.fit.indexOf(item.sprite_id) > -1
        ) {
          this.addMarkers(item);
        }
      });
      this.notify('筛选成功!');
    },
    addStatusWithoutNewline: function(str) {
      this.status += str;
    },
    addStatus: function(str) {
      this.status += str + '<br>';
    },
    sendMessage: function(message, requestIndex) {
      if (message.request_type != '1004') {
        this.addStatusWithoutNewline('WSS发送消息：');
        this.addStatus(JSON.stringify(message));
      }
      console.log('sendMessage', message);

      this.socket.send(json2buffer(message));
    },
    /**
     * 获取妖灵数据
     */
    getYaolingInfo: function() {
      if (!this.statusOK || this.botMode) return;
      var e = {
        request_type: '1001',
        longtitude: convertLocation(this.location.longitude),
        latitude: convertLocation(this.location.latitude),
        requestid: this.genRequestId('1001'),
        platform: 0
      };
      this.sendMessage(e, '1001');
    },
    /**
     * 获取擂台数据
     */
    getLeitaiInfo: function() {
      this.addStatus('功能开发中!');
      this.notify('功能开发中!');
      return;
      if (!this.statusOK || this.botMode) return;
      var e = {
        request_type: '1002',
        longtitude: convertLocation(this.location.longitude),
        latitude: convertLocation(this.location.latitude),
        requestid: this.genRequestId('1002'),
        platform: 0
      };
      this.sendMessage(e, '1002');
    },
    getSettingFileName: function() {
      var e = {
        request_type: '1004',
        cfg_type: 1,
        requestid: this.genRequestId('10041'),
        platform: 0
      };
      this.sendMessage(e, '10041');
    },
    getBossLevelConfig: function() {
      return;
      var e = {
        request_type: '1004',
        cfg_type: 0,
        requestid: this.genRequestId('10040'),
        platform: 0
      };
      this.sendMessage(e, '10040');
    },
    /**
     * 地图中心改变
     */
    mapCenterChanged(position) {
      setLocalStorage('radar_location', this.location);
    }
  },
  computed: {
    fit: function() {
      let ans = [];
      let _fit = this.settings.fit;
      if (_fit.all) {
        return ['special'];
      }

      // 根据值把key转换成FILTER_FISH这种，取常量配置中的值
      for (let _f in _fit) {
        if (_fit[_f]) {
          let _arr = FILTER[`FILTER_${_f.toLocaleUpperCase()}`];
          ans = ans.concat(_arr);
        }
      }
      return Array.from(new Set(ans));
    }
  },
  watch: {
    settings: {
      handler: function(newV, oldV) {
        console.log('settings update...');
        setLocalStorage('radar_settings', this.settings);
      },
      deep: true
    }
  }
};
</script>
<style lang='less'>
</style>

