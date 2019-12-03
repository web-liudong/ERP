<template>
  <div style="margin-right: 10px;">
    <el-popover placement="bottom" width="100" trigger="click">
      <div class="popover-main">
        <!-- <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="inputVal"></el-input> -->
        <el-checkbox-group v-model="checkList" @change="filter">
          <el-checkbox
            style="margin:5px 5px 5px 0;display:block"
            :key="index"
            v-for="(item,index) in tableList"
            :label="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button size="small" slot="reference">
        <i class="el-icon-arrow-down el-icon-menu"></i>
        表头自定义
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: ["labelArr", "tableName"],
  data() {
    return {
      tableList: this.labelArr,
      checkList: [], //筛选列选中的数据列表
      uncheckList: {}, //控制筛选列显示隐藏
      localData: {},
      inputVal: ""
    };
  },
  methods: {
    ...mapMutations(["set_hideList"]),
    // 回显初始化
    init() {
      this.localData = JSON.parse(localStorage.getItem("hideList"));
      if (
        this.localData != null &&
        this.localData.hasOwnProperty(this.tableName)
      ) {
        for (let index in this.tableList) {
          let table = this.tableList[index];
          if (this.localData[this.tableName].hasOwnProperty(table.value)) {
            this.uncheckList[table.value] = this.localData[this.tableName][table.value];
          } else {
            this.uncheckList[table.value] = true;
          }
        }
        for (let index in this.uncheckList) {
          if (this.uncheckList[index] && this.checkList.indexOf(index) == -1) {
            this.checkList.push(index);
          }
        }
      }
    },
    // 多选框change
    filter(val) {
      this.$emit("tableChange");

      if (Object.keys(this.uncheckList).length == 0 && val == undefined) {
        for (let index in this.tableList) {
          let table = this.tableList[index];
          this.checkList.push(table.value);
          this.uncheckList[table.value] = true;
        }
      }

      //数据准备
      for (let item in this.uncheckList) {
        this.uncheckList[item] = false;
      }

      //数据处理
      for (let index in this.checkList) {
        let name = this.checkList[index];
        if (name in this.uncheckList) {
          this.uncheckList[name] = true;
        }
      }

      this.set_hideList({ key: this.tableName, value: this.uncheckList });
    }
  },
  mounted() {
    this.init();
    this.filter();
  }
};
</script>

<style lang="scss" scoped>
.popover-main {
  height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>