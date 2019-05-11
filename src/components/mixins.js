/*
 * @Date: 2019-05-11 15:02:18 
 * @Last Modified time: 2019-05-11 15:02:18 
 * @Desc: mixins
 */

module.exports = {
  methods: {
    /**
     * toast消息窗口
     */
    notify: function(message) {
      this.$notify({
        message: message,
        showClose: false,
        duration: 2000
      });
    },
    /**
     * 初始化地图
     */
    initMap() {
      this.map = new qq.maps.Map(document.getElementById('qmap'), {
        center: new qq.maps.LatLng(
          this.location.latitude,
          this.location.longitude
        ),
        zoom: 16 // 地图的中心地理坐标。
      });

      qq.maps.event.addListener(this.map, 'click', this.clickMap);
    },
    clickMap: function(e) {
      this.notify('位置已重置,请重新筛选');
      this.location.longitude = e.latLng.lng;
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
     * 清除标记
     */
    clearAllMarkers: function() {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },
    /**
     * 获取用户位置信息
     */
    getLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              resolve({
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
              });
            },
            error => {
              reject(error);
            },
            {
              enableHighAccuracy: true, //是否要求高精度的地理位置信息
              timeout: 10 * 1000, //对地理位置信息的获取操作做超时限制，如果再该事件内未获取到地理位置信息，将返回错误
              maximumAge: 60 * 1000 //设置缓存有效时间，在该时间段内，获取的地理位置信息还是设置此时间段之前的那次获得的信息，超过这段时间缓存的位置信息会被废弃
            }
          );
        } else {
          reject(null);
        }
      });
    }
  }
};
