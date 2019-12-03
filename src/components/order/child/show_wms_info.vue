<template>
  <el-dialog title="手动操作详情" :visible.sync="isShow" width="650px">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in tableData"
        :key="index"
        :color="activity.color"
      >{{activity.con}}</el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>
<script>
import { getWmsManualOpa } from "@/api/order/orderManage";
import { parseTime } from "@/utils";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      resData: {},
      tableData: []
    };
  },
  mounted() {},
  computed: {},
  methods: {
    init(row) {
      this.reset();
      this.resData = row;
      this.isShow = true;
      this.getData();
    },
    getData() {
      getWmsManualOpa(this.resData.id).then(res => {
        if (res.data) {
          let len = res.data.length;
          res.data.forEach((item,index) => {
            let obj = {
              con : `${parseTime(item.statusTime)} ${item.descText}`,
              color : index == 0 ? '#0bbd87' : ''
            }
            this.tableData.push(obj);
          });
        }
      });
    },
    reset() {
      this.resData = {};
      this.tableData = [];
    }
  }
};
</script>
<style scoped lang="less">
.el-row {
  line-height: 40px;
  height: 41px;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #d1d1d1;
  border-top: 0;
  background-color: #f9fafc;
  &:first-child {
    border-top: 1px solid #d1d1d1;
  }
}
.el-timeline-item{
  font-size: 12px;
  /deep/ .el-timeline-item__content {
    color: #888;
  }
}
.el-col {
  padding: 0 10px;
  &:last-child {
    background-color: #fff;
    border-left: 1px solid #d1d1d1;
  }
  .grid-con-top {
    height: 39px;
  }
  .grid-con {
    height: 40px;
  }
}
</style>