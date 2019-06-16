/**
 * author:
 * date: 2018-08-09 17:10:51
 * desc:
 */

import Vue from 'vue';
window.Vue = Vue;

window.md5 = require('md5');

window.$ = window.jQuery = require('jquery');
import App from './App';
import {
  Button,
  Icon,
  Switch,
  Notification,
  MessageBox,
  Dialog,
  Row,
  Col,
  Progress,
  Input,
  Collapse,
  Checkbox,
  CollapseItem
} from 'element-ui';
import './index.less';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/switch.css';
import 'element-ui/lib/theme-chalk/notification.css';
import 'element-ui/lib/theme-chalk/message-box.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/progress.css';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/collapse.css';
import 'element-ui/lib/theme-chalk/collapse-item.css';
import 'element-ui/lib/theme-chalk/dialog.css';
import 'element-ui/lib/theme-chalk/row.css';
import 'element-ui/lib/theme-chalk/col.css';
import 'element-ui/lib/theme-chalk/checkbox.css';

Vue.prototype.$ELEMENT = { size: 'medium' };
Vue.prototype.$notify = Notification;

Vue.use(Button);
Vue.use(Switch);
Vue.use(Icon);
Vue.use(Progress);
Vue.use(Input);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Dialog);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);

let getParameter = (name, loca = window.location.href) => {
  const regexS = `[\\?&]${name}=([^&#]*)`;
  const regex = new RegExp(regexS);
  const results = regex.exec(loca);

  if (results === null) return '';
  return results[1];
};

let range = getParameter('range');
let thread = getParameter('thread');

//let mode = location.href.indexOf('wide') > -1 ? 'wide' : 'normal';
//紧急修复
let mode = "temp";
if (location.href.indexOf('wide') > -1) {
  mode = "wide";
} 

let vueapp = new Vue({
  el: '#root',
  data: { mode, range, thread },
  template: '<App/>',
  components: { App }
});

window.app = vueapp.$children[0];
