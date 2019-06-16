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
      maxReconnectTime: 60, // 断线重连次数
      reconnectTimeout: 1000, // 断线重连时间
      maxTimeout: 3000, //超时未回复重连时间
      index: 0, // socket标识
      onopen: () => {},
      onclose: () => {},
      onmessage: () => {}
    };

    this.opts = Object.assign({}, defaults, opts);
    this.reconnect_time = 0;
    this.manual_close = false; //是否为主动关闭
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
    this.socket.onclose = event => {
      if (this.reconnect_time < this.opts.maxReconnectTime) {
        let reconnectTimeout = this.opts.reconnectTimeout;
        //如果是主动关闭，则无需等待1秒重连
        if (this.manual_close) {
          reconnectTimeout = 1;
          this.manual_close = false;
        }
        setTimeout(() => {
          console.log(`ws.${this.index} reconnect ...${this.reconnect_time}`);
          this.initSocket();
        }, reconnectTimeout);
        this.reconnect_time++;
      }
      this.opts.onclose(event, this);
    };

    this.socket.onopen = event => {
      this.reconnect_time = 0; // 连接成功则重置重连次数
      this.opts.onopen(event, this);
    };
    this.socket.onmessage = event => {
      this.opts.onmessage(event, this);
      if (typeof (event.data) !== 'string')
        this.timer && clearTimeout(this.timer);
    };
  }
  /**
   * 发送消息
   * @param {*} msg
   */
  send(msg) {
    console.log("new send");
    this.socket && this.socket.send(msg);
    this.timer = setTimeout(() => {
      // 3000ms内没响应就主动关闭并重连 
      this.manual_close = true;
      this.socket.close();
    }, this.opts.maxTimeout);
  }
}

export default RadarWebSocket;
