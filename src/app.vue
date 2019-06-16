<template>
  <div id="app">
    <right-nav :version="APP_VERSION" :settings="settings" :show-menu.sync="showMenu" :mode="mode"></right-nav>
    <!-- <normal-nav :version="APP_VERSION" :settings="settings" :show-menu="showMenu"></normal-nav> -->

    <div id="buttons">
      <el-button size="mini" @click="getYaolingInfo">妖灵</el-button>
      <el-button size="mini" @click="filterDialogVisible = true">自定义筛选</el-button>
      <div v-if="mode === 'wide'">
        <div style="font-size: 14px;">
          <div>当前线程数: {{sockets.length}}/{{thread}}</div>
          <template v-for="(socket, index) in sockets" >
            <p :key="index" v-if="socket">线程.{{index+1}} {{socket.task ? `正在执行任务.${socket.task.taskIndex}` : '空闲'}}</p>
          </template>  
          <div v-if="radarTask">任务进度:{{closedTask}}/{{radarTask.tasks.length}}</div>
        </div>
      </div>
    </div>
    <div id="qmap"></div>
    <radar-progress :show="progressShow" :max-range="max_range" :thread="thread" :percent="progressPercent"></radar-progress>
    <el-dialog
    title="自定义筛选"
    :visible.sync="filterDialogVisible"
    class="filter-dialog">
    <div class="check">
      <el-checkbox v-model="settings.use_custom">启用</el-checkbox>
    </div>
    <el-row :gutter="10" class="filter-list">
      <el-col v-for="(yl, index) in settings.custom_filter" :key="index" :xs="12" :sm="8" :md="6" :lg="4" :xl="3">
        <div class="filter-content" :class="{active : yl.on}" @click="yl.on = !yl.on">
          <img :src="'https://hy.gwgo.qq.com/sync/pet/'+yl.img" :alt="yl.name">
          <span :class="{active:up(yl.id)}">{{ yl.name }}</span>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
  </div>
</template>
<script>
import tempdata from './lib/tempdata';
import activities from './lib/activities';
import mixins from './mixins/mixins';
import bot from './mixins/bot';
import map from './mixins/map';
import RightNav from './components/rightNav';
import socket from './mixins/socket';
import RadarProgress from './components/radarProgress';
import RadarTasks from './lib/RadarTasks';

import { getLocalStorage, setLocalStorage } from './lib/util';

import {
  FILTER,
  API_KEY,
  CUR_YAOLING_VERSION,
  APP_VERSION,
  WIDE_SEARCH
} from './lib/config';

export default {
  name: 'zhuoyao-radar',
  mixins: [mixins, bot, map, socket],
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
        element: false,
      },
      auto_search: true,
      show_time: true,
      position_sync: false,
      wide: FILTER.FILTER_WIDE,
      custom_filter:FILTER.FILTER_CUSTOM,
      use_custom:false,
      show_box:false,
      version:APP_VERSION,
    };


    let flag = false;
    let ans = [];

    //如果第一次打开网页 则打开菜单
    if (!settings) {
      showMenu = true;
    } else {
      //对于settings.custom_filter
      //在版本更新后availableYaolings发生变动时，custom_filter会保留以前的键
      //因此需要在此处做一个remapping
      
      if (settings.custom_filter) {
        let sc = settings.custom_filter;
        let scMap = [];
        sc.forEach(o => {
          scMap[o.id] = o;
        });
        defaultSettings.custom_filter.forEach((v,i,a) => {
          if (scMap.hasOwnProperty(v.id)) ans.push(scMap[v.id]);
          else ans.push(v);
        });
        flag = true;
      }
    }
    
    settings = Object.assign({}, defaultSettings, settings || {});

    if (flag) {
      settings.custom_filter = ans;
    }

    
    if (!(location && settings.position_sync)) {
      location = {
        longitude: 116.3579177856,
        latitude: 39.9610780334,
        zoom:16,
      };
    }

    let range = Number(this.$parent.range || WIDE_SEARCH.MAX_RANGE);
    let max_range = range * 2 + 1; // 经纬方向单元格最大数
    // 线程数最多6个
    let thread = Math.min(
      Number(this.$parent.thread || WIDE_SEARCH.MAX_SOCKETS),
      6
    );
    if (this.$parent.mode === 'temp') {
      range = 0;
      thread = 1;
    }
    return {
      location,
      settings,
      showMenu,
      APP_VERSION,
      range,
      thread,
      max_range,
      mode: this.$parent.mode,
      sockets: new Array(thread),
      radarTask: null,
      searching: false,
      map: {},
      clickMarker: null, // 点击位置标记
      userMarker: null, // 用户位置标记
      searchBoxMarker: [], //大范围搜索框标记
      searchBoxWideSet: new Set(), //大范围搜索集合
      searchOutboxMarker: null, //外围指引框标记
      currVersion: CUR_YAOLING_VERSION, //190508版本的json 如果有变动手动更新
      yaolings: tempdata.Data,
      upYaolings: activities.Data,
      markers: new Map(), //妖灵markerclass
      messageMap: new Map(), // 缓存请求类型和id
      botMode: false,
      botInterval: null,
      botTime: 0,
      botGroup: '群号',
      botChecked: [],
      botWelcomeInfo: '捉妖扫描机器人2.1启动~有什么问题可以@我哦',
      botLocation: {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      },
      progressShow: false,
      filterDialogVisible:false
    };
  },
  mounted() {
    // 初始化地图组件
    this.initMap();

    // 初始化websocket
    this.initSockets();

    // 获取用户位置
    if (!this.settings.position_sync) {
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
            if (e.code === 3) {
              this.notify('无法获取设备位置信息');
            }
          }
        )
        .catch(b => {});
    }

    if (this.mode === 'wide') {
      this.notify(
        `大范围搜索开启，当前最大搜索单位:${Math.pow(
          this.max_range,
          2
        )}个.线程数:${this.thread}个.`
      );
    }
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
    },
    /**
     * 获取妖灵数据
     */
    getYaolingInfo: function() {
      if (this.botMode) return;

      // 先清除标记
      this.clearAllMarkers();

      if (this.mode === 'normal') {
        if (this.searchOutboxMarker != null) this.searchOutboxMarker.setMap(null);
        if (this.searchBoxMarker.length > 0) {
          this.searchBoxMarker[0].setMap(null);
          this.searchBoxMarker.pop();
        }

        this.buildSearchboxMarker(this.location.latitude,this.location.longitude,true);
        this.sendMessage(this.initSocketMessage('1001'));
      } else {
        if (this.searching) {
          this.notify("请等待此次搜索结束！");
          return false;
        }

        this.clearAllBox();

        this.radarTask = new RadarTasks({
          range: this.range,
          lng: this.location.longitude,
          lat: this.location.latitude
        });

        
        if(this.mode === 'wide') this.progressShow = true;
        this.lng_count = this.lat_count = 0;
        this.searching = true;
        for (let index = 0; index < WIDE_SEARCH.MAX_SOCKETS; index++) {
          let socket = this.sockets[index];
          if (socket) {
            this.startTaskWithSocket(socket);
          }
        }
      }
    },
    /**
     * 获取擂台数据
     */
    getLeitaiInfo: function() {
      this.notify('功能开发中!');
      return;
      if (this.botMode) return;
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
     * 是否为活动up妖灵
     */
    up:function(val) {
      return this.upYaolings.hasOwnProperty(val) && this.upYaolings[val] ;
    }
  },
  computed: {
    fit: function() {
      let ans = [];

      //自定义筛选优先级最高
      if (this.settings.use_custom) {
        return Array.from(new Set(
          this.settings.custom_filter
          .filter(item => item.on)
          .map(item => item.id)
        ));
      }

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
    /**
     * 大范围进度条
     */
    progressPercent: function() {
      let result = 0;
      if (this.radarTask) {
        let tasks = this.radarTask.tasks;
        let _close = tasks.filter(i => {
          return i.status === 'close';
        }).length;
        result = Math.floor(_close / tasks.length * 100);
      }
      // let _open = tasks.length
      return result;
    },
    /**
     * 已完成任务数
     */
    closedTask: function() {
      let result = 0;
      if (this.radarTask) {
        result = this.radarTask.tasks.filter(i => {
          return i.status === 'close';
        }).length;
      }
      return result;
    },
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
#app {
  // padding-left: 200px;
  position: relative;
  height: 100%;
}
</style>

