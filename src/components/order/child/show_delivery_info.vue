<template>
  <el-dialog title="查看配送详情" :visible.sync="isShow" width="650px">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="5">发货单号：</el-col>
        <el-col :span="7">
          <p class="grid-con">{{resData.orderDeliveryNo}}</p>
        </el-col>
        <el-col :span="5">订单号：</el-col>
        <el-col :span="7">
          <p class="grid-con">{{resData.orderNo}}</p>
        </el-col>
      </el-row>
      <el-row class="el-row-add">
        <el-col :span="5" class="el-col-add">发货地址：</el-col>
        <el-col :span="19">
          <p class="grid-con grid-add">{{resData.warehouseFullAddress}}</p>
        </el-col>
      </el-row>
      <el-row class="el-row-add">
        <el-col :span="5"  class="el-col-add">收货地址：</el-col>
        <el-col :span="19">
          <p class="grid-con grid-add">{{resData.recipientAddressLineText}}</p>
        </el-col>
      </el-row>
    </div>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in tableData"
        :key="index"
        :color="activity.color"
      ><strong v-if="activity.isExist">{{activity.time}}</strong><span :class="activity.isExist ? 'desc' : 'descc'">{{activity.con}}</span></el-timeline-item>
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
      let temp = this.resData.orderDeliveryStatusDetailDTOS.reverse();
      let timeObj = {};
      temp.forEach((item, index) => {
        let isExist = false;
        if(timeObj[item.statusDate]){
          isExist = false;
        }else{
          timeObj[item.statusDate] = 1;
          isExist = true;
        }
        let obj = {
          con: item.desc,
          time: item.statusDate,
          isExist: isExist,
          color: index == 0 ? "#0bbd87" : ""
        };
        this.tableData.push(obj);
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
  height: 42px;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #d1d1d1;
  border-top: 0;
  background-color: #f9fafc;
  &:first-child {
    border-top: 1px solid #d1d1d1;
  }
}
.el-row-add{
  height: 50px;
  line-height: 20px;
}
.el-timeline-item {
  font-size: 14px;
  line-height: 20px;
  /deep/ .el-timeline-item__timestamp {
    color: #333;
  }
  /deep/ .el-timeline-item__content {
    color: #888;
  }
  strong{
    font-weight: normal;
    color: #333;
  }
  .desc{
    position: relative;
    left: 20px;
  }
  .descc{
    position: relative;
    left: 100px;
  }
}
.el-col {
  padding: 0 10px;
  border-right: 1px solid #d1d1d1;
  &:nth-child(even) {
    background-color: #fff;
  }
  &:last-child {
    border-right: 0;
  }
  .grid-con-top {
    height: 39px;
  }
  .grid-con {
    height: 40px;
  }
  .grid-add{
    height: 45px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
}
.el-col-add{
  line-height: 50px;
}
</style>