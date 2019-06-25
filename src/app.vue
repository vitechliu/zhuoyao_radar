<template>
  <div id="app">
    <div class="header">核心雷达 v1.0</div>
    <right-nav :settings="settings" :show-menu.sync="showMenu"></right-nav>
   
    <div id="buttons">
      <el-button size="mini" @click="getBeijing">获取</el-button>
    </div>
    <div id="qmap"></div>
  </div>
</template>
<script>
import tempdata from './lib/tempdata';
import mixins from './mixins/mixins';
import map from './mixins/map';
import RightNav from './components/rightNav';

import { getLocalStorage, setLocalStorage } from './lib/util';

import {
  FILTER,
  API_KEY,
  CUR_YAOLING_VERSION,
  APP_VERSION
} from './lib/config';

export default {
  name: 'zhuoyao-radar',
  mixins: [mixins, map],
  components: {
    RightNav,
  },
  data() {
    let showMenu = false;
    let location = getLocalStorage('radar_location');
    let settings = getLocalStorage('radar_settings');
    let defaultSettings = {
      show_time: true,
      position_sync: false,
      core: FILTER.FILTER_CORE,
      version:APP_VERSION,
    };

    //如果第一次打开网页 则打开菜单
    if (!settings) {
      showMenu = true;
    }
    
    settings = Object.assign({}, defaultSettings, settings || {});

    if (!(location && settings.position_sync)) {
      location = {
        longitude: 116.3579177856,
        latitude: 39.9610780334,
        zoom:16,
      };
    }

    return {
      location,
      settings,
      showMenu,
      APP_VERSION,
      searching: false,
      map: {},
      userMarker: null, // 用户位置标记
      currVersion: CUR_YAOLING_VERSION, //190508版本的json 如果有变动手动更新
      yaolings: tempdata.Data,
      markers: new Map(), //妖灵markerclass
    };
  },
  mounted() {
    // 初始化地图组件
    this.initMap();

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

  },
  methods: {
    /**
     * 根据查询结果过滤数据，打标记
     */
    buildMarkersByData: function(t) {
      if (t && t.length) {
        t.forEach(item => {
          console.log(item);
          if (
            this.fit[0] === 'special' ||
            this.fit.indexOf(item.real_yaoling) > -1
          ) {
            this.addMarkers(item);
          }
        });
      }
    },
    getBeijing() {
      this.clearAllMarkers();
      var that = this;
      let key = getLocalStorage('radar-key');
      if (!key) {
        key = window.prompt("请输入key");
        setLocalStorage('radar-key',key);
      }
      if (!this.searching) {
        this.searching = true;
        let url = "http://radarapi.vitechliu.com/yaoling";
        //要key的 别指望了 傻逼们
        $.ajax({
          type: "GET",
          url:url,
          contentType:"application/json",
          dataType:"json",
          beforeSend: function(request) {
              request.setRequestHeader("radar-key",key);
          },
          error:function(ajax,info,e) {
            that.searching = false;
            console.log(info,e);
          },
          success:function(res) {
            that.searching = false;

            console.log(res);
            that.buildMarkersByData(res.data);
          },
        });
      }
    },
  },
  computed: {
    fit: function() {
      let _fit = this.settings.core
        .filter(item => item.on)
        .map(item => item.id);
      return Array.from(new Set(_fit));
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

