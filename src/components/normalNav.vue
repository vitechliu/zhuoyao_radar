<template>
  <base-nav>
    <div class="setting-nav">
      <transition name="side">
        <div class="side-nav" v-show="showMenu">
          <div class="side-content">
            <div class="header">筛选</div>
            <ul>
              <template v-for="item in filters">
                <li :key="item.key">
                  <span class="tag">{{item.text}}</span>
                  <el-switch v-model="settings.fit[item.key]"> </el-switch>
                </li>
              </template>
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
        </div>
      </transition>
    </div>
  </base-nav>
</template>
<script>
import BaseNav from './baseNav';

export default {
  name: 'normal-nav',
  components: { BaseNav },
  props: {
    version: {
      type: String,
      default: ''
    },
    settings: {
      type: Object,
      default: {}
    },
    showMenu: {
      type: Boolean
    }
  },
  data() {
    return {
      filters: [
        {
          text: '稀有',
          key: 'rare'
        },
        {
          text: '1觉',
          key: 't1'
        },
        {
          text: '2觉',
          key: 't2'
        },
        {
          text: '巢穴',
          key: 'nest'
        },
        {
          text: '地域',
          key: 'feature'
        },
        {
          text: '鲲鲲',
          key: 'fish'
        },
        {
          text: '元素',
          key: 'element'
        },
        {
          text: '其他所有（慎选）',
          key: 'all'
        }
      ]
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
</style>