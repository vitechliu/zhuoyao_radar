/*
 * @Date: 2019-05-11 15:02:18
 * @Last Modified time: 2019-05-11 15:02:18
 * @Desc: mixins
 */

import { setLocalStorage } from '../lib/util';
import RadarMapMarker from '../lib/RadarMapMarker';

module.exports = {
  methods: {
    /**
     * 初始化地图
     */
    initMap() {
      this.map = new qq.maps.Map(document.getElementById('qmap'), {
        center: new qq.maps.LatLng(
          this.location.latitude,
          this.location.longitude
        ),
        zoomControl: false,
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        mapTypeControl: false,
        scrollwheel: true,
        draggable: true,
        zoom: this.location.zoom ? this.location.zoom : 16, 
      });
      //qq.maps.event.addListener(this.map, 'click', this.clickMap);
      qq.maps.event.addListener(
        this.map,
        'bounds_changed',
        this.mapChanged
      );
    },
    /**
     * 根据妖灵信息在地图上打个标记
     */
    addMarkers(yl) {
      var key = window.md5(yl.gen_time.toString()+yl.lat.toString()+yl.lng.toString());

      if (this.markers.has(key)) return; //重复妖灵不添加

      let headImage = this.getHeadImagePath(yl);

      var time = new Date((yl.gen_time + yl.life_time) * 1000) - new Date();
      var second = time / 1000;
      var minute = Math.floor(second / 60);
      second = Math.floor(second % 60);

      var fintime = minute + '分' + second + '秒';

      // new icon
      let icon = new qq.maps.MarkerImage(
        headImage,
        null,
        null,
        null,
        new qq.maps.Size(40, 40)
      );
      let position = new qq.maps.LatLng(yl.lat / 1e6, yl.lng / 1e6);
      let marker = new qq.maps.Marker({
        position: position,
        map: this.map,
        zIndex:20000,
        clickable:false,
      });

      marker.setIcon(icon);
      
      let markeropts = {
        marker:marker,
        laberMarker:null,
        time:new Date((yl.gen_time + yl.life_time) * 1000),
      };
      

      // 展示倒计时
      if (this.settings.show_time) {
        let labelMarker = new qq.maps.Label({
          position: position,
          offset: new qq.maps.Size(-20, 5),
          map: this.map,
          content: fintime,
          style: {
            border: 'none',
            backgroundColor: 'rgba(255,255,255,.7)'
          },
          zIndex:22000,
        });
        markeropts.labelMarker = labelMarker;
      }

      this.markers.set(key,new RadarMapMarker(markeropts));
    },
    /**
     * 清除标记
     */
    clearAllMarkers() {
      this.markers.forEach(item => {
        item.clear();
      });
      this.markers.clear();
    },
    /**
     * 地图中心改变
     */
    mapChanged(position) {
      var c = this.map.getCenter();
      var z = this.map.getZoom();
      setLocalStorage('radar_location', {
        longitude: c.lng,
        latitude: c.lat,
        zoom: z
      });
    }
  }
};
