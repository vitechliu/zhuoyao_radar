/*
 * @Date: 2019-05-11 10:34:48
 * @Last Modified time: 2019-05-11 10:34:48
 * @Desc: 告警机器人
 */

module.exports = {
  methods: {
    botSetup: function(settings) {
      return;
      if (settings.hasOwnProperty('qqGroup')) this.botGroup = settings.qqGroup;
      if (settings.hasOwnProperty('welcome'))
        this.botWelcomeInfo = settings.welcome;
      if (settings.hasOwnProperty('location'))
        this.botLocation = settings.location;

      this.botMode = true;
      this.botCheck();
      this.botInterval = setInterval(() => {
        this.botCheck();
      }, 20000);
    },
    botCheck: function() {
      this.botGetYaoling();
      if (this.botTime == 1 && this.botWelcomeInfo.length > 0) {
        this.botMessage(this.botWelcomeInfo);
      }
    },
    botAnalyze: function(yaolings) {
      for (var i = 0; i < yaolings.length; i++) {
        var ti = yaolings[i];

        const FILTER_BOT = [
          // 告警机器人使用
          2000106, // 风雪虎
          2000313, // 银角小妖
          2000327, // 小蝙蝠
          2000265, // 香玉
          2000238 // 颜如玉
        ];

        if (FILTER_BOT.indexOf(ti.sprite_id) === -1) {
          continue;
        }

        var time = new Date((ti.gentime + ti.lifetime) * 1000) - new Date();
        var second = time / 1000;
        var minute = Math.floor(second / 60);
        var second = Math.floor(second % 60);

        var fintime = minute + '分' + second + '秒';

        var yaoling_hash = ti.gentime.toString() + ti.latitude.toString();

        if (this.botChecked.indexOf(yaoling_hash) >= 0) {
          continue;
        }

        this.botChecked.push(yaoling_hash);
        var yl = this.getYaolingById(ti.sprite_id);

        var geocoder = new qq.maps.Geocoder({
          complete: result => {
            var pois = result.detail.nearPois,
              pos;
            if (pois.length > 0) pos = pois[0].name;
            else pos = result.detail.address;
            var msg =
              '发现一只' + yl.Name + ',位于' + pos + ',剩余时间:' + fintime;
            this.botMessage(msg);
          }
        });

        var coord = new qq.maps.LatLng(ti.latitude / 1e6, ti.longtitude / 1e6);

        geocoder.getAddress(coord);

        continue;
      }
    },
    botGetYaoling: function() {
      // const convertLocation = n => parseInt(1e6 * n.toFixed(6));
      this.botTime++;

      this.sendMessage(
        this.initSocketMessage('1001', {
          longitude: this.botLocation.longitude,
          latitude: this.botLocation.latitude
        })
      );
    },
    botMessage: function(mes) {
      // console.log(this.botWelcomeInfo);
      // return;
      $.post(
        'bot/request.php',
        {
          qq: this.botGroup,
          msg: mes
        },
        function(data) {
          console.log(data);
        }
      );
    }
  }
};
