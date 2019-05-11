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
     * 根据id获取妖灵信息
     */
    getYaolingById: function(id) {
      return this.yaolings.find(item => {
        return item.Id === id;
      });
    },
    /**
     * 根据妖灵信息获取头像
     */
    getHeadImagePath: function(e) {
      var a = this.getYaolingById(e.sprite_id);
      if (a) {
        return `./original/image/head/${a.ImgName}.png`;
      } else {
        return './original/image/default-head.png';
      }
    },
    /**
     * 处理消息
     */
    handleMessage: function(data) {
      var _type = this.messageMap.get(`msg_${data.requestid}`);
      if (_type) {
        this.messageMap.delete(`msg_${data.requestid}`);
      }

      switch (_type) {
        case '10041':
          this.getVersionFileName(data.filename);
          break;
        case '10040':
          //console.log("妖灵等级", n), a.saveBossStartAndEndLevel(n.startlevel, n.endlevel);
          break;
        case '1001':
          console.log(
            '获取到妖灵数量',
            data.sprite_list ? data.sprite_list.length : 0
          );
          if (this.botMode) {
            // 机器人
            this.botAnalyze(data.sprite_list);
          } else {
            this.buildMarkersByData(data.sprite_list);
          }
          break;
        case '1002':
        //this.getLeitaiNearby(data);
      }
    },
    /**
     * 获取最新的妖灵数据库
     */
    getVersionFileName: function(name) {
      if (name != this.currVersion) {
        this.getYaolings(name);
        console.info('有新版本的icon!');
        this.notify('有新版本的妖灵库，请通知作者更新！！');
      } else {
        this.getYaolings(this.currVersion);
      }
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
