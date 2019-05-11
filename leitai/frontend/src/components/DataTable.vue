<template>
  <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    :data="data"
    style="width: 100%"
    :default-sort="{prop: 'sprite_list', order: 'ascending'}"
  >
    <el-table-column prop="winner_name" label="擂主名" width="180"></el-table-column>
    <el-table-column prop="latitude" label="纬度" width="180" :formatter="formatter"></el-table-column>
    <el-table-column prop="longtitude" label="经度" width="180" :formatter="formatter"></el-table-column>
    <el-table-column prop="winner_fightpower" label="擂主战力" sortable width="180"></el-table-column>
    <el-table-column label="上场妖灵">
      <template slot-scope="sprite">
        <div v-for="elm of formatpet(data[sprite.$index].sprite_list)" v-bind:key="elm.$index">
          <img height="50px" :src="getsrc(elm.SmallImgPath)">
          <span>{{elm.Name}}等级:{{elm.level}}战斗力:{{elm.fightpower}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="sprite_list"
      label="上场妖灵战力"
      sortable
      width="180"
      :formatter="formatsprite"
      :sort-method="sort"
    ></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleCopy(scope.$index, scope.row)">复制经纬度</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import serach from "../util/serach";
import copy from 'copy-to-clipboard';

export default {
  props: {
    data: Array,
    loading: Boolean
  },
  methods: {
    formatter(_, __, cellValue) {
      return cellValue / 10e5;
    },
    getsrc(src) {
      const url =
        localStorage.getItem("peturl") || "http://hy.gwgo.qq.com/sync/pet/";
      return url + src;
    },
    formatsprite(_, __, cellValue) {
      return cellValue
        .map(_ => _.fightpower)
        .reduce((sum, current) => {
          return sum + current;
        });
    },
    sort (a,b){
      console.log(this.formatsprite(1,1,a.sprite_list))
       return this.formatsprite(1,1,a.sprite_list)<this.formatsprite(1,1,b.sprite_list)
    },
    handleCopy(_,row){
      const message=`${row.latitude},${row.longtitude}`
      copy(message)
      this.$notify({
          title: '成功复制',
          message: message,
          type: 'success'
        });
    },
    formatpet(cellValue) {
      return cellValue.map(val => {
        return {
          ...val,
          ...serach(val.spriteid)
        };
      });
    }
  }
};
</script>