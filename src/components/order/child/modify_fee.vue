<template>
  <el-dialog title="服务方服务费率修改" :visible.sync="isShow" width="800px" class="dialogWrap">
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
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>选择服务方：
            </el-col>
            <el-col :span="17">
              <el-form-item label>
                <el-input v-model="form.firstServerName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>服务方负责人：
            </el-col>
            <el-col :span="17">
              <el-form-item>
                <el-input v-model="form.firstServerUserName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>服务方服务费率：
            </el-col>
            <el-col :span="7">
              <el-form-item prop="firstServerFee">
                <el-input type="number" v-model="form.firstServerFee" placeholder="服务方服务费率" @blur="formatFee">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;line-height:20px;">
              <i>*</i>修改服务费率原因：
            </el-col>
            <el-col :span="17">
              <el-form-item prop="changeReason">
                <el-input
                  v-model="form.changeReason"
                  type="textarea"
                  rows="5"
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
import {
  getOrganize,
  getOrganizeUser,
  getServerFee,
  getAllocationOrderInfo,
  modifyServiceFee
} from "@/api/order/orderManage";
import { returnFloat } from "@/utils/index";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      remoteLoading: false,
      orderInfo: {},
      form: {
        firstServerFee: "",
        firstServerId: "",
        firstServerName: "",
        firstServerUserId: "",
        firstServerUserName: "",
        serviceFee:"",
        orderId: "",
        status: "", //订单状态
        changeReason: ""
      },
      rules: {
        changeReason: [
          {
            validator: check,
            message: "请填写修改服务费率原因",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.reset();
      this.orderInfo = row;
      this.form.orderId = row.id;
      this.form.status = row.status;
      this.form.firstServerName = row.firstServerName;
      this.form.firstServerUserName = row.firstServerUserName;
      this.initData(row.id);
      this.isShow = true;
    },
    initData(id) {
      getAllocationOrderInfo(id).then(res => {
        if (!res.data) return false;
        Object.assign(this.form, res.data);
      });
    },
    formatFee(){
      this.form.firstServerFee = returnFloat(this.form.firstServerFee)
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.form.serviceFee = this.form.firstServerFee;
          modifyServiceFee(this.form).then(res => {
            this.isShow = false;
            this.$emit("callback", "modifyfee");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reset() {
      this.form = {
        type: 1,
        firstServerFee: "",
        firstServerId: "",
        firstServerName: "",
        firstServerUserId: "",
        firstServerUserName: "",
        orderId: "",
        status: "",
        changeReason: ""
      };
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
    margin: 0px auto 20px;
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
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-autocomplete {
  width: 100%;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
.dialogWrap >>> .el-dialog__body {
  height: 50vh;
  overflow: auto;
}
</style>
