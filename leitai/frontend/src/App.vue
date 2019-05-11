<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
        >
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">擂台</span>
          </el-menu-item>
          <el-menu-item :disabled="true" index="/about">
            <i class="el-icon-document"></i>
            <span slot="title">妖灵</span>
          </el-menu-item>
          <el-menu-item :disabled="true" index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">神灵</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

a {
  color: inherit;
  text-decoration: none;
}

a.router-link-exact-active {
  color: inherit;
  text-decoration: none;
}
</style>
<script>
import axios from "axios";
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  created: async () => {
    const { data } = await axios.get("/api/config");
    const { Data, Url } = data;
    localStorage.setItem("pet", JSON.stringify(Data));
    localStorage.setItem("peturl", Url);
  },
};
</script>