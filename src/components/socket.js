/*
 * @Author:
 * @Date: 2019-05-11 10:33:56
 * @Last Modified time: 2019-05-11 10:34:28
 * @Desc: socket模块，和官方服务端通信
 */
import { SOCKET } from '../config';

class RadarWebSocket {
  constructor(
    opts = {
      index: 0,
      onopen: () => {},
      onmessage: () => {}
    }
  ) {
    this.opts = opts;
    this.index = opts.index || 0;

    this.initSocket();
    return this;
  }
  // 初始化
  initSocket() {
    this.socket = new WebSocket(SOCKET.URL);

    // 断线重连
    this.socket.onerror = this.socket.onclose = () => {
      setTimeout(() => {
        console.log('websocket reconnect...');
        this.initSocket();
      }, SOCKET.RECONNECT_TIME);
    };

    this.socket.onopen = event => {
      this.opts.onopen(event, this);
    };
    this.socket.onmessage = event => {
      this.opts.onmessage(event, this);
    };
  }
  send(msg) {
    this.socket && this.socket.send(msg);
  }
}

export default RadarWebSocket;
