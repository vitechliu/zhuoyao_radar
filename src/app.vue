<template>
  <div id="app">
    <right-nav :version="APP_VERSION" :settings="settings" :show-menu.sync="showMenu" :mode="mode"></right-nav>
    <!-- <normal-nav :version="APP_VERSION" :settings="settings" :show-menu="showMenu"></normal-nav> -->

    <div id="status" v-show="debug">
      <div id="info"><br/><span v-html="status"></span></div>
    </div>
    <div id="buttons">
      <el-button size="mini" @click="getYaolingInfo">妖灵</el-button>
      <!-- <el-button size="mini" @click="exportPosition">导出位置</el-button>
      <el-button size="mini" @click="importPosition">导入位置</el-button> -->
      <el-button size="mini" type="warning" @click="debug = !debug">Debug</el-button>
    </div>
    <div id="qmap"></div>
    <radar-progress :show="progressShow" :percent="progressPercent"></radar-progress>
  </div>
</template>
<script>
import tempdata from './components/tempdata';
import mixins from './components/mixins';
import bot from './components/bot';
import map from './components/map';
import RightNav from './components/rightNav';
import socketMsg from './components/socketMsg';
import RadarProgress from './components/radarProgress';

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
  WIDE_SEARCH,
  BOT
} from './config';

export default {
  name: 'zhuoyao-radar',
  mixins: [mixins, bot, map, socketMsg],
  components: {
    RightNav,
    RadarProgress
  },
  data() {
    let showMenu = false;
    let location = getLocalStorage('radar_location');
    let settings = getLocalStorage('radar_settings');
    let defaultSettings = {
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
      auto_search: false,
      show_time: true,
      position_sync: true,
      wide: FILTER.FILTER_WIDE
    };
    if (!settings) {
      showMenu = true;
    }
    settings = Object.assign({}, defaultSettings, settings || {});

    if (!(location && settings.position_sync)) {
      location = {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      };
    }
    return {
      location,
      settings,
      showMenu,
      APP_VERSION,
      mode: this.$parent.mode,
      MAX_SOCKETS: this.$parent.mode === 'normal' ? 1 : WIDE_SEARCH.MAX_SOCKETS,
      status: '',
      sockets: [],
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
      botMode: false,
      botInterval: null,
      botTime: 0,
      botGroup: '799576270',
      botChecked: [],
      botWelcomeInfo: '捉妖扫描机器人2.1启动~有什么问题可以@我哦',
      botLocation: {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      },
      progressShow: false
    };
  },
  mounted() {
    // 初始化地图组件
    this.initMap();

    this.initSockets();

    // // 初始化websocket
    // this.socket = new RadarWebSocket({
    //   onopen: this.onSocketOpen,
    //   onmessage: this.onSocketMessage
    // });

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
      虚拟定位 全家暴毙`);

    this.$on('botSetup', params => {
      this.botSetup(params);
    });
    // window.app = {};
    // window.app.botSetup = this.botSetup;
    //this.addStatus("开发者:ZachXia,Vitech");
    // setTimeout(() => {
    //   this.notify('提示:点击右下角菜单开始筛选！');
    // }, 2000);

    // for (let index = 0; index < 450; index++) {
    //   let a = this.getNextPosition();
    //   // console.log('getNextPosition', a);

    //   if (a) {
    //     let fn = n => parseInt(1e6 * n.toFixed(6));
    //     this.addMarkers({
    //       gentime: 1557742978,
    //       latitude: fn(a.latitude),
    //       lifetime: 3600,
    //       longtitude: fn(a.longitude),
    //       sprite_id: 2000112
    //     });
    //   }
    // }
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
     * 消息响应
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
     * 根据查询结果过滤数据，打标记
     */
    buildMarkersByData: function(t) {
      if (t && t.length) {
        t.forEach(item => {
          if (
            this.fit[0] === 'special' ||
            this.fit.indexOf(item.sprite_id) > -1
          ) {
            this.addMarkers(item);
          }
        });
      }
      // this.notify('筛选成功!');
    },
    addStatusWithoutNewline: function(str) {
      this.status += str;
    },
    addStatus: function(str) {
      this.status += str + '<br>';
    },
    sendMessage: function(message, socketIndex = 0) {
      console.log('sendMessage', message);

      // let message = this.initSocketMessage(type, options);
      if (message.request_type != '1004') {
        this.addStatusWithoutNewline('WSS发送消息：');
        this.addStatus(JSON.stringify(message));
      }

      this.sockets[socketIndex].send(json2buffer(message));
    },
    /**
     * 获取妖灵数据
     */
    getYaolingInfo: function() {
      if (!this.statusOK || this.botMode) return;

      // 先清除标记
      this.clearAllMarkers();

      if (this.mode === 'normal') {
        this.sendMessage(this.initSocketMessage('1001'));
      } else {
        this.progressShow = true;
        this.lng_count = this.lat_count = 0;
        for (let index = 0; index < WIDE_SEARCH.MAX_SOCKETS; index++) {
          let _position = this.getNextPosition(); // 获取下一个查询点
          this.sendMessage(this.initSocketMessage('1001', _position), index);
        }
      }
    },
    /**
     * 获取擂台数据
     */
    getLeitaiInfo: function() {
      this.addStatus('功能开发中!');
      this.notify('功能开发中!');
      return;
      if (!this.statusOK || this.botMode) return;
      this.sendMessage(this.initSocketMessage('1001'));
    },
    /**
     * 获取官方配置文件
     */
    getSettingFileName: function() {
      this.sendMessage(this.initSocketMessage('10041'));
    },
    /**
     * 暂未使用
     */
    getBossLevelConfig: function() {
      return;
      this.sendMessage(this.initSocketMessage('10040'));
    },
    /**
     * 地图中心改变
     */
    mapCenterChanged(position) {
      var c = this.map.getCenter();
      setLocalStorage('radar_location', {
        longitude: c.lng,
        latitude: c.lat
      });
    }
  },
  computed: {
    fit: function() {
      let ans = [];
      if (this.mode === 'normal') {
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
      } else {
        let _fit = this.settings.wide
          .filter(item => item.on)
          .map(item => item.id);
        return Array.from(new Set(_fit));
      }
    },
    progressPercent: function() {
      let maxInLine = WIDE_SEARCH.MAX_RANGE * 2 + 1;
      let cur = this.lat_count * maxInLine + this.lng_count;
      return Math.floor(cur / Math.pow(maxInLine, 2) * 100);
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

