/**
 * author:
 * date: 2018-08-09 17:10:51
 * desc:
 */
import Vue from 'vue';
import App from './App';
import Element from 'element-ui';
import './index.less';
import '../node_modules/element-ui/lib/theme-chalk/index.css';

Vue.use(Element, { size: 'medium' });

let vueapp = new Vue({
  el: '#root',
  template: '<App/>',
  components: { App }
});

window.app = {
  botSetup: params => {
    vueapp.$children[0].botSetup(params);
  }
};
