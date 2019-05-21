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
      maxTimeout: 3000, //超时未回复重连时间
      index: 0, // socket标识
      onopen: () => {},
      onmessage: () => {}
    };

    this.opts = Object.assign({}, defaults, opts);
    this.reconnect_time = 0;

    this.index = this.opts.index;

    this.initSocket();

    //超时记录
    this.timeout = null;

    return this;
  }
  /**
   * 初始化
   */
  initSocket() {
    this.socket = new WebSocket(this.opts.url);

    // 断线重连
    this.socket.onclose = () => {
      if (this.reconnect_time < this.opts.maxReconnectTime) {
        setTimeout(() => {
          console.log(`ws.${this.index} reconnect ...${this.reconnect_time}`);
          this.initSocket();
        }, this.opts.reconnectTimeout);
        this.reconnect_time++;
      }
    };

    this.socket.onopen = event => {
      this.reconnect_time = 0; // 连接成功则重置重连次数
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
