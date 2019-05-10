'use strict';
const Service = require('egg').Service;
const WebSocketClient = require('websocket').w3cwebsocket;
const formateData = require('../../util/formateData');
const handleData = require('../../util/handleData');
const genRequestId = require('../../util/genRequestId');
const url =
  'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0';
const defaultdata = {
  request_type: '1002',
  latitude: 32058380,
  longtitude: 118796470,
  requestid: 282682,
  platform: 0,
};
class LeitaiService extends Service {
  // 默认不需要提供构造函数。
  constructor(ctx) {
    super(ctx);
    if (!this.ctx.data) {
      this.ctx.data = defaultdata;
    }
  }
  async getConfig() {
    const post = {
      request_type: '1004',
      cfg_type: 1,
      requestid: genRequestId('10041'),
      platform: 0,
    };
    const config = await new Promise((res, rej) => {
      const ws = new WebSocketClient(url);
      ws.onopen = function() {
        ws.send(
          formateData(post)
        );
      };
      // 接收到服务端响应的数据时，触发事件
      ws.onmessage = evt => {
        const { data } = evt;
        if (typeof data === 'object') {
          const buf = Buffer.from(data);
          const tempresult = buf.toString('utf8', 4);
          ws.close();
          res(tempresult);
        }
      };
      ws.onerror = err => {
        rej(err);
      };
      ws.onclose = () => {
        console.log('关闭');
      };
    });
    return config;
  }
  async getInfo(latitude = 32057380, longtitude = 118796470) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const leitai = await new Promise((res, rej) => {
      const ws = new WebSocketClient(url);
      ws.onopen = function() {
        ws.send(
          formateData({
            request_type: '1002',
            latitude,
            longtitude,
            requestid: genRequestId('1002'),
            platform: 0,
          })
        );
      };
      // 接收到服务端响应的数据时，触发事件
      ws.onmessage = evt => {
        const { data } = evt;
        if (typeof data === 'object') {
          ws.close();
          res(handleData(data));
        } else if (typeof data !== 'string') {
          ws.close();
          res([]);
        }
      };
      ws.onerror = err => {
        rej(err);
      };
      ws.onclose = () => {
        console.log('关闭');
      };
    });
    return leitai;
  }
}
module.exports = LeitaiService;
