'use strict';

const download = require('download');
const Controller = require('egg').Controller;
const { configurl } = require('../../util/url');
class ConfigController extends Controller {
  async index() {
    const { ctx, service } = this;
    const jsonpath = await service.app.getConfig();
    const data = await download(`${configurl}${JSON.parse(jsonpath).filename}`);
    // const buf = Buffer.from(JSON.parse(data.data));
    // ctx.body = buf.toString('utf8');
    ctx.body = data.toString();
  }
}

module.exports = ConfigController;
