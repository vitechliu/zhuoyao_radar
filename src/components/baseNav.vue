<template>
  <div class="setting-nav">
    <div class="burger-wrap">
      <div :class="['nav-burger', showMenu ? 'active' : '']">
        <div class="setting-icon" @click.prevent="openMenu">
          <i class="el-icon-setting"></i>
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
          <h4>捉妖雷达-Web</h4>
          <p>{{ version }}</p>
          <p>捉妖雷达高玩交流群：1025673494</p>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=liuzirui1122&repo=zhuoyao_radar&type=star&count=true&size=large"
            frameborder="0"
            scrolling="0"
            width="160px"
            height="30px"
          ></iframe>
        </div>
        <slot></slot>
        <!-- <template v-slot></template> -->
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'base-nav',
  props: {
    version: {
      type: String,
      default: ''
    },
    showMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    openMenu() {
      this.showMenu = !this.showMenu;
    }
  }
};
</script>
<style lang="less">
.side-content {
  .header {
    font-size: 18px;
    padding-left: 10px;
    padding-top: 5px;
  }
}
.setting-nav{
  font-size: 14px;
}
</style>