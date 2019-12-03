<template>
  <el-dialog title="添加备注" :visible.sync="isShow" width="600px" class="dialogWrap">
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>外部订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
        </tr>
      </table>
    </div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>备注详情：
            </el-col>
            <el-col :span="18">
              <el-form-item prop="description">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  resize="none"
                  :rows="5"
                  placeholder="字数长度1~200以内"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createRemarks } from "@/api/order/orderManage";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      tableData: {},
      orderInfo:{},
      form: {
        description: "",
        orderId: "",
        orderStatus: ""
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.orderInfo = row;
      this.form.description == ""
      this.form.orderId = row.id;
      this.form.orderStatus = row.status;
      this.isShow = true;
    },
    submitForm(name) {

      if(this.form.description == ""){
        this.$message({
          type: "warning",
          message: "请填写备注详情!"
        });
        return false;
      }
      if(this.form.description.length > 200){
        this.$message({
          type: "warning",
          message: "字数长度1~200以内"
        });
        return false;
      }
      createRemarks(this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "addRemarks");
      });
    }
  }
};
</script>
<style scoped lang="less">
.tips{
  color: red;
  padding-left: 20px;
}
.list{
  table {
    width: 95%;
    margin: 20px auto;
    td,
    th {
      border: 1px solid #d1d1d1;
      font-size: 12px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    th {
      padding-right: 6px;
      box-sizing: border-box;
      color: #666;
      font-weight: 700;
      font-size: 14px;
      text-align: right;
      width: 15%;
      background-color: #f9fafc;
      i {
        color: red;
      }
    }
    td {
      color: #666666;
      text-align: left;
      padding-left: 10px;
      width: 17%;
      line-height: 20px;
      &:last-child{
        width: 21%;
      }
      span {
        margin-right: 10px;
        display: inline-block;
      }
    }
    .tit {
      text-align: left;
      padding-left: 10px;
    }
  }
}
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-textarea{
  width: 445px;
}
</style>
<style scoped>
.dialogWrap >>> .el-dialog__body {
  height: 30vh;
  overflow: auto;
}
</style>