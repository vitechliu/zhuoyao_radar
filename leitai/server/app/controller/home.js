'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async leitai() {
    const { ctx, service } = this;
    const query = ctx.query;
    ctx.body = await service.app.getInfo(query.latitude, query.longitude);
  }
}

module.exports = HomeController;
