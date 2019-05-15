<template>
  <div id="radar-progress" v-show="show">
    <div class="progress-bg"></div>
    <div class="progress-content">
      <el-progress :text-inside="true" :stroke-width="16" :percentage="percent"></el-progress>
      大范围搜索速度较慢，请耐心等待...<br/>
      当前线程数{{ thread }},最大搜索范围{{ maxRange }}*{{ maxRange }}个单元。
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    percent: {
      type: Number,
      default: 0
    },
    thread: {
      type: Number,
      default: 0
    },
    maxRange: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style lang="less">
#radar-progress {
  position: fixed;
  z-index: 2000;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .progress-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .progress-content {
    position: absolute;
    width: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 14px;
  }
}
</style>


