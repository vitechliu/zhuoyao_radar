/**
 * author:
 * date: 2018-08-09 17:10:51
 * desc:
 */

import Vue from 'vue';
window.Vue = Vue;
window.$ = window.jQuery = require('jquery');
import App from './App';
import {
  Button,
  Icon,
  Switch,
  Notification,
  MessageBox,
  Progress
} from 'element-ui';
import './index.less';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/switch.css';
import 'element-ui/lib/theme-chalk/notification.css';
import 'element-ui/lib/theme-chalk/message-box.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/progress.css';

Vue.prototype.$ELEMENT = { size: 'medium' };
Vue.prototype.$notify = Notification;

Vue.use(Button);
Vue.use(Switch);
Vue.use(Icon);
Vue.use(Progress);

let getParameter = (name, loca = window.location.href) => {
  const regexS = `[\\?&]${name}=([^&#]*)`;
  const regex = new RegExp(regexS);
  const results = regex.exec(loca);

  if (results === null) return '';
  return results[1];
};

let range = getParameter('range');
let thread = getParameter('thread');

let mode = location.href.indexOf('wide') > -1 ? 'wide' : 'normal';

let vueapp = new Vue({
  el: '#root',
  data: { mode, range, thread },
  template: '<App/>',
  components: { App }
});

window.app = vueapp.$children[0];
