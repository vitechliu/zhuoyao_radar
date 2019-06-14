/**
 * 地图标记
 */
class RadarMapMarker {
    constructor(opts) {
        
      this.marker = opts.marker;
      this.labelMarker = opts.labelMarker;
      this.time = opts.time;
        
      //超时记录
      this.interval = null;
        
      if (this.labelMarker != null) {
          this.initTimer();
      }
      return this;

    }

    initTimer() {
        this.interval = setInterval(() => {
            let time = this.time - new Date();

            if (time <= 0) {
                this.labelMarker.setOptions({
                    content:"已过期",
                });
                clearInterval(this.interval);
                return;
            }
            let second = time / 1000;
            let minute = Math.floor(second / 60);
            second = Math.floor(second % 60);

            let fintime = minute + '分' + second + '秒';
            this.labelMarker.setOptions({
                content:fintime,
            });
        },1000);
    }

    clear() {
        this.marker.setMap(null);
        if (this.labelMarker!=null) this.labelMarker.setMap(null);
    }
}

export default RadarMapMarker;