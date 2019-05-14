import { convertLocation } from './util';

module.exports = {
  methods: {
    initSocketMessage(type, options) {
      let message = null;
      switch (type) {
        case '1001': // 查询妖灵
          message = {
            request_type: '1001',
            longitude: this.location.longitude,
            latitude: this.location.latitude,
            requestid: this.genRequestId('1001'),
            platform: 0
          };
          break;
        case '1002': // 查询擂台
          message = {
            request_type: '1002',
            longitude: this.location.longitude,
            latitude: this.location.latitude,
            requestid: this.genRequestId('1002'),
            platform: 0
          };
          break;
        case '10041': // 查询最新妖灵配置文件
          message = {
            request_type: '1004',
            cfg_type: 1,
            requestid: this.genRequestId('10041'),
            platform: 0
          };
          break;
        case '10040': // 暂未使用
          message = {
            request_type: '1004',
            cfg_type: 0,
            requestid: this.genRequestId('10040'),
            platform: 0
          };
          break;
        default:
          break;
      }
      if (message && options) {
        message = Object.assign({}, message, options);
      }
      
      // 坐标处理
      // longitude -> longtitude
      if (message.latitude && message.longitude) {
        message.latitude = convertLocation(message.latitude);
        message.longtitude = convertLocation(message.longitude);
        delete message.longitude;
      }

      return message;
    }
  }
};
