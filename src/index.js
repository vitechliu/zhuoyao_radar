/**
 * author: galleons.cc@gmail.com
 * date: 2018-08-09 17:10:51
 * desc:
 */
import Vue from 'vue';
import App from './App';
import Element from 'element-ui';
import './index.less';
import '../node_modules/element-ui/lib/theme-chalk/index.css';

Vue.use(Element, { size: 'medium' });

new Vue({
  el: '#root',
  template: '<App/>',
  components: { App }
});
