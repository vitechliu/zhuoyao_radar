/*
 * @Date: 2019-05-11 15:02:18
 * @Last Modified time: 2019-05-11 15:02:18
 * @Desc: mixins
 */

module.exports = {
  methods: {
    /**
     * 初始化地图
     */
    initMap() {
      this.map = new qq.maps.Map(document.getElementById('qmap'), {
        center: new qq.maps.LatLng(
          this.location.latitude,
          this.location.longtitude
        ),
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
      this.notify('位置已重置,请重新筛选');
      this.location.longtitude = e.latLng.lng;
      this.location.latitude = e.latLng.lat;
      var icon = new qq.maps.MarkerImage(
        'original/image/icon/notify-arrow.png',
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
      // new icon
      let icon = new qq.maps.MarkerImage(
        headImage,
        null,
        null,
        null,
        new qq.maps.Size(40, 40)
      );
      let marker = new qq.maps.Marker({
        position: new qq.maps.LatLng(yl.latitude / 1e6, yl.longtitude / 1e6),
        map: this.map
      });
      marker.setIcon(icon);
      this.markers.push(marker);
    },
    /**
     * 清除标记
     */
    clearAllMarkers() {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    }
  }
};
