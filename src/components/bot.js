/*
 * @Date: 2019-05-11 10:34:48
 * @Last Modified time: 2019-05-11 10:34:48
 * @Desc: 告警机器人
 */

module.exports = {
  methods: {
    bot_open: function() {
      this.location = {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      };
      this.botMode = true;
      this.botInterval = setInterval(() => {
        this.botCheck();
      }, 30000);
    },
    botCheck: function() {
      this.getYaolingBot();
      console.log(this.botTime);
      if (this.botTime == 1) {
        //this.ajaxGroupMessage("北邮捉妖扫描系统启动");
      }
    },
    botAnalyze: function(yaolings) {
      for (var i = 0; i < yaolings.length; i++) {
        var ti = yaolings[i];

        if (this.filter_bot.indexOf(ti.sprite_id) === -1) {
          continue;
        }

        var time = new Date() - new Date(ti.gentime * 1000);
        var second = time / 1000;
        var minute = Math.floor(second / 60);
        var second = Math.floor(second % 60);

        var fintime = minute + '分' + second + '秒';

        var yaoling_hash = ti.gentime.toString() + ti.latitude.toString();

        if (this.botChecked.indexOf(yaoling_hash) === -1) {
          continue;
        }

        this.botChecked.push(yaoling_hash);
        var yl = this.getYaoling(ti.sprite_id);

        geocoder = new qq.maps.Geocoder({
          complete: result => {
            var msg =
              '发现一只' +
              yl.Name +
              ',位于' +
              result.detail.address +
              ',剩余时间:' +
              fintime;
            this.ajaxGroupMessage(msg);
          }
        });

        var coord = new qq.maps.LatLng(ti.latitude / 1e6, ti.longtitude / 1e6);

        geocoder.getAddress(coord);

        continue;
      }
    }
    // botMessage:function(monsters) {
    //     for (var i=0;i<monsters.length;i++){
    //         var mi = monsters[i];

    //         var generateMessage = "123123";
    //         this.ajaxGroupMessage(generateMessage);
    //     }
    // },
  }
};
