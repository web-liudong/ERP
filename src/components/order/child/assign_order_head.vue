<template>
  <el-dialog title="指定派单员" :visible.sync="isShow" width="800px">
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>外部订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
          <th>下单时间：</th>
          <td>{{orderInfo.createTime}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
          <th>客户采购人：</th>
          <td>{{orderInfo.customerUserName}}</td>
        </tr>
        <tr>
          <th>订单金额：</th>
          <td>￥{{orderInfo.amount}}</td>
          <th>收货地址：</th>
          <td colspan="3">{{orderInfo.customerReceiptAddress}}</td>
        </tr>
      </table>
    </div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>选择派单员：
            </el-col>
            <el-col :span="18">
              <el-form-item label prop="assignUserId">
                <el-select
                  v-model="form.assignUserId"
                  filterable
                  remote
                  placeholder="请输入派单员名称"
                  :remote-method="querySearch"
                  :loading="remoteLoading"
                  clearable
                >
                  <el-option
                    v-for="(item,index) in remoteList"
                    :key="item.value + index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
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
import {
  getAssignationHead,
  setAssignationHead
} from "@/api/order/orderManage";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      tableData: {},
      assignUserList: [],
      orderInfo: {},
      remoteLoading:false,
      remoteList:null,
      form: {
        name: "",
        organizationId: "", //项目乙方id
        regionId: "", //城市id
        assignUserId: "",
        orderId: "",
        orderStatus: ""
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.form.assignUserId = "";
      this.form.name = "";
      this.orderInfo = row;
      this.form.orderId = row.id;
      this.form.orderStatus = row.status;
      this.form.organizationId = row.partyBId;
      this.form.regionId = row.recipientAddressCountyId;
      this.isShow = true;
    },
    querySearch(query, callback) {
      if (query !== "") {
        this.form.name = query;
        getAssignationHead(this.form).then(res => {
          if(!res.data){
            this.remoteList = [];
            return false;
          }
          this.remoteList = res.data.map((item, index) => {
            return {
              value: item.id,
              label: item.realName
            };
          });
        });
      } else {
        this.remoteList = [];
      }
    },
    submitForm(name) {
      if (this.form.assignUserId == "") {
        this.$message({
          type: "warning",
          message: "请指定派单员!"
        });
        return false;
      }
      setAssignationHead(this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "setAssignationHead");
      });
    }
  }
};
</script>
<style scoped lang="less">
.tips {
  color: red;
  padding-left: 20px;
}
.list {
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
      &:last-child {
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
.el-select,.el-autocomplete {
  width: 445px;
}
</style>