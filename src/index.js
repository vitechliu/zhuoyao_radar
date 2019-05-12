/**
 * author:
 * date: 2018-08-09 17:10:51
 * desc:
 */
import Vue from 'vue';
window.$ = window.jQuery = require('jquery');
import App from './App';
import { Button, Switch, Notification,MessageBox } from 'element-ui';
import './index.less';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/switch.css';
import 'element-ui/lib/theme-chalk/notification.css';
import 'element-ui/lib/theme-chalk/message-box.css';
import 'element-ui/lib/theme-chalk/icon.css';

Vue.prototype.$ELEMENT = { size: 'medium' };
Vue.prototype.$notify = Notification;

Vue.use(Button);
Vue.use(Switch);

let vueapp = new Vue({
  el: '#root',
  template: '<App/>',
  components: { App }
});

window.app = vueapp.$children[0];
