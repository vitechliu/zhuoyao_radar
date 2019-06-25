<template>
  <div class="setting-nav">
    <div class="burger-wrap">
      <div :class="['nav-burger', showMenu ? 'active' : '']">
        <div class="setting-icon" @click.prevent="openMenu">
          <i v-if="showMenu" class="el-icon-d-arrow-right"></i>
          <i v-else class="el-icon-setting"></i>
        </div>
      </div>
    </div>
    <transition name="black">
      <div
        class="black-screen"
        v-show="showMenu"
        @click.prevent="openMenu"
      ></div>
    </transition>
    <transition name="side">
      <div class="side-nav" v-show="showMenu">
        <div class="side-header">
          <h4>核心雷达 - 北京</h4>
          <p>v1.0</p>
          <p><a href="http://note.youdao.com/noteshare?id=cf93745c828b381275f53e5a730eaf96" target="_blank">捉妖雷达开发贡献指引</a></p>
          <br>
          <p>虚拟定位全家暴毙</p>
          <br/>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=liuzirui1122&repo=zhuoyao_radar&type=star&count=true&size=large"
            frameborder="0"
            scrolling="0"
            width="160px"
            height="30px"
          ></iframe>
        </div>
        <div class="side-content">
          <div class="nav-filter">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="筛选" name="1">
                <ul>
                  <template v-for="item in settings.core">
                    <li :key="item.id">
                      <span class="tag">{{item.name}}</span>
                      <el-switch v-model="item.on"> </el-switch>
                    </li>
                  </template>
                </ul>
              </el-collapse-item>
              <el-collapse-item title="设置" name="2">
                <ul>
                  <li>
                    <span class="tag">显示剩余时间</span>
                    <el-switch v-model="settings.show_time"> </el-switch>
                  </li>
                  <li>
                    <span class="tag">记住上次退出位置</span>
                    <el-switch v-model="settings.position_sync"> </el-switch>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { getLocalStorage } from '../lib/util';

export default {
  name: 'radar-right-nav',
  props: {
    settings: {
      type: Object,
      default: {}
    },
    showMenu: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      activeName: '1',
    };
  },
  methods: {
    openMenu() {
      this.$emit('update:showMenu', !this.showMenu);
    }
  }
};
</script>
<style lang="less">
.setting-nav {
  font-size: 14px;
}
.side-content {
  .header {
    font-size: 16px;
    padding-left: 10px;
    padding-top: 5px;
  }
}
.nav-filter{
  padding: 0 10px;
}
// .el-tabs__item {
//   padding: 0 20px !important;
// }
// .el-tabs__active-bar{
//   display: none !important;
// }
</style>