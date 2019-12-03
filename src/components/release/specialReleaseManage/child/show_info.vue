<template>
  <el-dialog title="所属导航" :visible.sync="isShow" width="450px" v-if="tableData">
    <div>
      <template v-if="tableData.length">
        <el-row v-for="(item,index) in tableData" :key="index">
          <el-col>{{item.navigationName}}</el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row>
          <el-col>无所属导航</el-col>
        </el-row>
      </template>
    </div>
  </el-dialog>
</template>
<script>
import { queryNavForSku } from "@/api/release/specialProjectManage";
import { setTimeout } from "timers";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      resData: {},
      tableData: null
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.resData = row;
      this.getData();
      this.isShow = true;
    },
    getData() {
      queryNavForSku(this.resData.shoppeId,this.resData.skuId).then(res => {
        this.$set(this, "tableData", res.data);
      });
    }
  }
};
</script>
<style scoped lang="less">
.el-row {
  line-height: 40px;
  font-size: 14px;
  border: 1px solid #d1d1d1;
  border-top: 0;
  background-color: #f9fafc;
  &:first-child {
    border-top: 1px solid #d1d1d1;
  }
}
.el-col {
  padding: 0 10px;
  text-align: center;
}
</style>