/*
 * @Date: 2019-05-11 15:02:18
 * @Last Modified time: 2019-05-11 15:02:18
 * @Desc: mixins
 */
import { WIDE_SEARCH as WS, SOCKET } from '../lib/config';

module.exports = {
  data() {
    return {
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
      console.log(id);
      return this.yaolings.find(item => {
        return item.Id === id;
      });
    },
    /**
     * 根据妖灵信息获取头像
     */
    getHeadImagePath(e) {
      var a = this.getYaolingById(e.real_yaoling);
      if (a) {
        return `https://hy.gwgo.qq.com/sync/pet/small/${a.ImgName}.png`;
      } else {
        return 'src/assets/images/default-head.png';
      }
    },
    importData(data) {  
      let tempfit = [
        2000317, //金
        2000313, //银
        2000422, //兔
        2000106,
        2000327,
        2000265,
        2000238,
      ];
      let url = "http://127.0.0.1:7777/";
      let tempInsert = [];
      let tempDict = [];
      data.forEach(item => {
        let sid = item.sprite_id;
        if (tempDict.hasOwnProperty(sid)) {
          tempDict[sid]++;
        } else {
          tempDict[sid] = 1;
        }
        if (tempfit.indexOf(sid) > -1) {
          tempInsert.push(item);
        }
      });
        
      let tempArr = [];
      tempDict.forEach((v,i,a) => {
        tempArr.push({
          key:i,
          count:v
        });
      })
      let postData = {
        data:tempInsert,
        stat:tempArr,
      };
      $.post(url+"import",postData,res => {
        console.log(res);
      });
    },
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
    },
  }
};
