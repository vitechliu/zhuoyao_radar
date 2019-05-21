/*
 * @Date: 2019-05-11 15:02:18
 * @Last Modified time: 2019-05-11 15:02:18
 * @Desc: mixins
 */
import { WIDE_SEARCH as WS, SOCKET } from '../lib/config';

module.exports = {
  data() {
    return {
      lng_count: 0,
      lat_count: 0
    };
  },
  methods: {
    /**
     * toast消息窗口
     */
    notify(message) {
      this.$notify({
        message: message,
        showClose: false,
        duration: 2000
      });
    },
    /**
     * 根据id获取妖灵信息
     */
    getYaolingById(id) {
      return this.yaolings.find(item => {
        return item.Id === id;
      });
    },
    /**
     * 获取下一个定位
     */
    getNextPosition() {
      if (this.lat_count < this.max_range) {
        let _lat = (this.lat_count - this.range) * WS.LAT_RANGE;
        let _lng = (this.lng_count - this.range) * WS.LNG_RANGE;

        // 同一纬度下，如果经度没有超过最大值，则经度递增，否则加1单位纬度
        console.log(`${this.lat_count}-${this.lng_count}`);
        this.lng_count++;
        if (this.lng_count >= this.max_range) {
          this.lng_count = 0;
          this.lat_count++;
        }

        return {
          longitude: this.location.longitude + _lng,
          latitude: this.location.latitude + _lat
        };
      } else {
        return null;
      }
    },
    /**
     * 根据妖灵信息获取头像
     */
    getHeadImagePath(e) {
      var a = this.getYaolingById(e.sprite_id);
      if (a) {
        return `https://hy.gwgo.qq.com/sync/pet/small/${a.ImgName}.png`;
      } else {
        return 'src/assets/images/default-head.png';
      }
    },
    /**
     * 缓存响应的类型和id
     */
    genRequestId(type) {
      let _time = new Date().getTime() % 1234567;
      this.messageMap.set(`msg_${_time}`, type);
      return _time;
    },
    /**
     * 根据id找到请求的类型
     */
    getRequestTypeFromId(id) {
      return this.messageMap.get(id);
    },
    /**
     * 处理消息
     */
    handleMessage(data, socket) {
      var msgType = this.messageMap.get(`msg_${data.requestid}`);
      if (msgType) {
        this.messageMap.delete(`msg_${data.requestid}`);
      }

      switch (msgType) {
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

          if (this.mode === 'wide') {
            let _position = this.getNextPosition(); // 获取下一个查询点

            if (_position) {
              setTimeout(() => {
                this.sendMessage(
                  this.initSocketMessage('1001', _position),
                  socket.index
                );
              }, SOCKET.MSG_INTERVAL);
            } else {
              this.progressShow = false;
            }
          } else {
            if (socket.timeout) {
              clearTimeout(socket.timeout);
              socket.timeout = null;
            }
            this.notify('筛选成功!');
          }
          break;
        case '1002':
        //this.getLeitaiNearby(data);
      }
    },
    /**
     * 获取最新的妖灵数据库
     */
    getVersionFileName(name) {
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
