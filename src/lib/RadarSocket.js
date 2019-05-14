/*
 * @Author:
 * @Date: 2019-05-11 10:33:56
 * @Last Modified time: 2019-05-11 10:34:28
 * @Desc: socket模块，和官方服务端通信
 */
class RadarWebSocket {
  constructor(opts) {
    let defaults = {
      url:
        'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0',
      maxReconnectTime: 5, // 断线重连次数
      reconnectTimeout: 1000, // 断线重连时间
      index: 0, // socket标识
      onopen: () => {},
      onmessage: () => {}
    };

    this.opts = Object.assign({}, defaults, opts);
    this.reconnect_time = 0;

    this.index = this.opts.index;

    // this.connectError = false;

    this.initSocket();
    return this;
  }
  /**
   * 初始化
   */
  initSocket() {
    this.connectError = false;
    this.socket = new WebSocket(this.opts.url);

    // 断线重连
    this.socket.onerror = () => {
      this.connectError = true;
      if (this.reconnect_time < this.opts.maxReconnectTime) {
        setTimeout(() => {
          console.log(
            `ws.${this.index} reconnect from error...${this.reconnect_time}`
          );
          this.initSocket();
        }, this.opts.reconnectTimeout);
        this.reconnect_time++;
      }
    };

    this.socket.onclose = () => {
      if (!this.connectError) {
        console.log(`ws.${this.index} reconnect from close`);
        this.initSocket();
      }
    };

    this.socket.onopen = event => {
      this.connectError = false;
      this.reconnect_time = 0;
      this.opts.onopen(event, this);
    };
    this.socket.onmessage = event => {
      this.opts.onmessage(event, this);
    };
  }
  /**
   * 发送消息
   * @param {*} msg
   */
  send(msg) {
    this.socket && this.socket.send(msg);
  }
  /**
   * 断线重连
   */
  reconnect() {}
}

export default RadarWebSocket;
