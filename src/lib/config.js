import tempdata from './tempdata';
import availableYaolings from './availableYaolings';

const CUR_YAOLING_VERSION = 'sprite_18b3306a1d7dda37b41d2d458e00a0a8.json'; // 妖灵数据库版本，如果与官方版本不一致，需要手动更新
//本地妖灵数据库更新时间:"2019-06-14 08:09:00"

const APP_VERSION = 'v1.5.4-614fix'; // 地图版本
const API_KEY = '2LWBZ-FEQK6-KKYS2-M6WR4-PFGS5-RZBP3'; // 地图 api key


const FILTER = {
  FILTER_CORE: [
    {
      id: 2000106,
      name: '风雪虎',
      on: true
    },
    {
      id: 2000313,
      name: '银角小妖',
      on: true
    },
    {
      id: 2000317,
      name: '金角小妖',
      on: true
    },
    {
      id: 2000327,
      name: '小蝙蝠',
      on: true
    },
    {
      id: 2000265,
      name: '香玉',
      on: true
    },
    {
      id: 2000238,
      name: '颜如玉',
      on: true
    }
  ],
};

module.exports = {
  FILTER,
  API_KEY,
  CUR_YAOLING_VERSION,
  APP_VERSION,
};
