<template>
  <div>
    <div class="burger-wrap">
      <div :class="['nav-burger', showMenu ? 'active' : '']">
        <button class="menu-toggle" @click.prevent="openMenu">
          Menu
        </button>
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
          <h2>捉妖雷达 - Web</h2>
          <p>Version: {{ version }}</p>
          <p>捉妖雷达高玩交流群：1025673494</p>
        </div>
        <div class="side-content">
          <div class="header">筛选</div>
          <ul>
            <li>
              <span class="tag">稀有</span>
              <el-switch v-model="settings.fit.rare"> </el-switch>
            </li>
            <li>
              <span class="tag">1觉</span>
              <el-switch v-model="settings.fit.t1"> </el-switch>
            </li>
            <li>
              <span class="tag">2觉</span>
              <el-switch v-model="settings.fit.t2"> </el-switch>
            </li>
            <li>
              <span class="tag">巢穴</span>
              <el-switch v-model="settings.fit.nest"> </el-switch>
            </li>
            <li>
              <span class="tag">地域</span>
              <el-switch v-model="settings.fit.feature"> </el-switch>
            </li>
            <li>
              <span class="tag">鲲鲲</span>
              <el-switch v-model="settings.fit.fish"> </el-switch>
            </li>
            <li>
              <span class="tag">元素</span>
              <el-switch v-model="settings.fit.element"> </el-switch>
            </li>
            <li>
              <span class="tag">其他所有（慎选）</span>
              <el-switch v-model="settings.fit.all"> </el-switch>
            </li>
          </ul>
          <div class="hr"></div>
          <div class="header">设置</div>
          <ul>
            <li>
              <span class="tag">点击地图自动搜索</span>
              <el-switch v-model="settings.auto_search"> </el-switch>
            </li>
          </ul>
        </div>
        <div class="side-footer">
          <iframe
            src="https://ghbtns.com/github-btn.html?user=liuzirui1122&repo=zhuoyao_radar&type=star&count=true&size=large"
            frameborder="0"
            scrolling="0"
            width="160px"
            height="30px"
          ></iframe>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'radar-right-nav',
  props: {
    version: {
      type: String,
      default: ''
    },
    settings: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      showMenu: false
    };
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
</style>