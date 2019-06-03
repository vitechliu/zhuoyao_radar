/*
 * @Date: 2019-05-11 15:02:18
 * @Last Modified time: 2019-05-11 15:02:18
 * @Desc: mixins
 */

import { setLocalStorage } from '../lib/util';
import {
  MAP_PARAMS,
  WIDE_SEARCH
} from '../lib/config';

module.exports = {
  methods: {
    // exportPosition: function() {
    //   var pos = this.$prompt('请输入标签', '缓存位置', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputValidator: value => {
    //       if (value.length == 0) return '请输入标签';
    //       return true;
    //     }
    //   }).then(({ value }) => {
    //     this.$message({
    //       type: 'success',
    //       message: '你的邮箱是: ' + value
    //     });
    //   });
    // },
    // importPosition: function() {},
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
        zoom: 16 // 地图的中心地理坐标。
      });

      qq.maps.event.addListener(this.map, 'click', this.clickMap);
      qq.maps.event.addListener(
        this.map,
        'center_changed',
        this.mapCenterChanged
      );
    },
    /**
     * 地图点击事件
     */
    clickMap(e) {
      if (this.mode === 'wide' && this.searching) {
        return false;
      }
      if (!this.settings.auto_search) this.notify('位置已重置,请重新筛选');
      this.location.longitude = e.latLng.lng;
      this.location.latitude = e.latLng.lat;
      var icon = new qq.maps.MarkerImage(
        'src/assets/images/notify-arrow.png',
        null,
        null,
        null,
        new qq.maps.Size(40, 40)
      );
      if (this.clickMarker) {
        this.clickMarker.setPosition(
          new qq.maps.LatLng(e.latLng.lat, e.latLng.lng)
        );
      } else {
        this.clickMarker = new qq.maps.Marker({
          position: new qq.maps.LatLng(e.latLng.lat, e.latLng.lng),
          map: this.map
        });
        this.clickMarker.setIcon(icon);
      }

      if (this.settings.auto_search) {
        this.getYaolingInfo();
      }
    },
    /**
     * 根据妖灵信息在地图上打个标记
     */
    addMarkers(yl) {
      let headImage = this.getHeadImagePath(yl);

      var time = new Date((yl.gentime + yl.lifetime) * 1000) - new Date();
      var second = time / 1000;
      var minute = Math.floor(second / 60);
      var second = Math.floor(second % 60);

      var fintime = minute + '分' + second + '秒';

      // new icon
      let icon = new qq.maps.MarkerImage(
        headImage,
        null,
        null,
        null,
        new qq.maps.Size(40, 40)
      );
      let position = new qq.maps.LatLng(yl.latitude / 1e6, yl.longtitude / 1e6);
      let marker = new qq.maps.Marker({
        position: position,
        map: this.map,
        zIndex:20000,
        clickable:false,
      });

      marker.setIcon(icon);
      this.markers.push(marker);

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
        this.markers.push(labelMarker);
      }
    },
    buildSearchboxMarker(lat,lng,showOuter) {
      if (!this.settings.show_box) return;
      
      if (showOuter) {
        let outerPath = [
          new qq.maps.LatLng(lat-WIDE_SEARCH.LAT_RANGE,lng-WIDE_SEARCH.LNG_RANGE),
          new qq.maps.LatLng(lat-WIDE_SEARCH.LAT_RANGE,lng+WIDE_SEARCH.LNG_RANGE),
          new qq.maps.LatLng(lat+WIDE_SEARCH.LAT_RANGE,lng+WIDE_SEARCH.LNG_RANGE),
          new qq.maps.LatLng(lat+WIDE_SEARCH.LAT_RANGE,lng-WIDE_SEARCH.LNG_RANGE),
        ];
        this.searchOutboxMarker = new qq.maps.Polygon({
          map:this.map,
          path:outerPath,
          clickable:false,
          strokeColor:MAP_PARAMS.OUTBOX_STROKE,
          strokeWeight:MAP_PARAMS.OUTBOX_WIDTH,
          fillColor:MAP_PARAMS.OUTBOX_FILL,
          zIndex:7000,
        });
      } else {
        let key = lat.toString()+lng.toString();
        if (this.searchBoxWideSet.has(key)) return;
        this.searchBoxWideSet.add(key);
      }

      let path = [
        new qq.maps.LatLng(lat-WIDE_SEARCH.LAT_RANGE/2,lng-WIDE_SEARCH.LNG_RANGE/2),
        new qq.maps.LatLng(lat-WIDE_SEARCH.LAT_RANGE/2,lng+WIDE_SEARCH.LNG_RANGE/2),
        new qq.maps.LatLng(lat+WIDE_SEARCH.LAT_RANGE/2,lng+WIDE_SEARCH.LNG_RANGE/2),
        new qq.maps.LatLng(lat+WIDE_SEARCH.LAT_RANGE/2,lng-WIDE_SEARCH.LNG_RANGE/2),
      ];
      this.searchBoxMarker.push(new qq.maps.Polygon({
        map:this.map,
        path:path,
        clickable:false,
        strokeColor:MAP_PARAMS.BOX_STROKE,
        strokeWeight:MAP_PARAMS.BOX_WIDTH,
        fillColor:MAP_PARAMS.BOX_FILL,
        zIndex:6000,
      }));

      

      

    },
    /**
     * 清除标记
     */
    clearAllMarkers() {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },
    /**
     * 清除搜索框
     */
    clearAllBox() {
      for (var i = 0; i < this.searchBoxMarker.length; i++) {
        this.searchBoxMarker[i].setMap(null);
      }
      this.searchBoxMarker = [];
      this.searchBoxWideSet.clear();
    },
    /**
     * 搜索框出问题
     */
    boxError() {
      if (this.searchBoxMarker.length == 1) {
        this.searchBoxMarker[0].setOptions({
          fillColor:MAP_PARAMS.ERROR_FILL,
          strokeColor:MAP_PARAMS.ERROR_STROKE,
        });
      }
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
  }
};
