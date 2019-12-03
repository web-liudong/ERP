<template>
  <el-dialog title="关联订单" :visible.sync="isShow" width="700px" class="relation">
    <div class="info">
      <strong>发货单号：</strong>
      {{deliveryInfo.orderDeliveryNo}}
      <strong>发货单金额：</strong>
      ￥{{deliveryInfo.amount}}
      <strong>创建人：</strong>
      {{deliveryInfo.creatorName || '无'}}
      <br />
      <strong style="margin-left:0;">项目：</strong>
      {{deliveryInfo.projectName || '无'}}
      <strong>客户：</strong>
      {{deliveryInfo.customerName || '无'}}
      <strong>业务员：</strong>
      {{deliveryInfo.staffName || '无'}}
      <!-- <strong>下单人：</strong>{{deliveryInfo.orderDeliveryNo}} -->
    </div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="optionItem" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>关联订单号：
            </el-col>
            <el-col :span="14">
              <el-form-item label prop="orderNo">
                <el-input v-model="optionItem.orderNo" width="100%" clearable></el-input>
              </el-form-item>
              <el-button type="text" class="btn" @click="checkOrder">检验订单</el-button>
            </el-col>
            <!-- <el-popover width="300" trigger="click">
              <p>可关联订单(同时满足以下条件)：</p>
              <div style="text-align: left; margin: 0">
                <p>（1）订单状态为：发货中</p>
                <p>（2）订单的服务方与发货单的服务方一致</p>
                <p>（3）从未生成发货单或者是已经生成过发货单，但是发货类型必须是自定义发货单且未点击（关闭生成发货单）按钮的订单</p>
              </div>
              <el-button
                slot="reference"
                type="text"
                icon="el-icon-question"
                style="font-size:20px;"
              ></el-button>
            </el-popover>-->
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>订单状态：</th>
          <td>{{orderInfo.status}}</td>
        </tr>
        <tr>
          <th>订单金额：</th>
          <td>{{(orderInfo.amount || orderInfo.amount === 0) ? `￥${orderInfo.amount}` : ''}}</td>
          <th>已生成发货单金额：</th>
          <td>{{(orderInfo.deliveryAmount || orderInfo.deliveryAmount === 0) ? `￥${orderInfo.deliveryAmount}` : ''}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
        </tr>
        <tr>
          <th>业务员：</th>
          <td>{{orderInfo.staffName}}</td>
          <th>下单人：</th>
          <td>{{orderInfo.creatorName}}</td>
        </tr>
      </table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  deliveryRelevanceOrder,
  getCheckRelevanceOrder,
  getInvoiceRelationOrder
} from "@/api/order/invoiceOrder";
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
      delivery:{},
      deliveryId:"",
      deliveryInfo: {}, //发货单信息
      orderInfo: {}, //订单信息
      optionItem: {
        orderNo: "",
      },
      rules: {
        orderNo: [
          {
            validator: check,
            message: "关联订单号不能为空",
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
      this.delivery = row;
      this.deliveryId = row.id;
      this.initData();
      this.isShow = true;
    },
    initData(){
      getInvoiceRelationOrder(this.deliveryId).then(res => {
        this.deliveryInfo = res.data;
      });
    },
    checkOrder() {
      if (this.optionItem.orderNo) {
        getCheckRelevanceOrder(this.deliveryId, { orderNo: this.optionItem.orderNo }).then(res => {
          if (res.code == "000000") {
            this.orderInfo = res.data;
          } else {
            this.$message({
              type: "error",
              message: res.message || "当前发货单已关联订单"
            });
          }
        });
      }
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          deliveryRelevanceOrder(
            this.deliveryId,
            this.delivery.deliveryStatus,
            { orderNo: this.optionItem.orderNo }
          ).then(res => {
            if (res.code == "000000") {
              this.$message({
                type: "success",
                message: "关联订单成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.message || "关联订单失败"
              });
            }
            this.isShow = false;
            this.$emit("callback", "relationOrder");
          });
        } else {
          console.log("error submit!!");
        }
      });
    },
    reset() {
      this.optionItem = {
        orderNo: ""
      };
      this.orderInfo = {};
      this.$refs.orderForm && this.$refs.orderForm.resetFields();
    }
  }
};
</script>
<style scoped lang="less">
.info {
  padding-left: 20px;
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 20px;
  strong {
    margin-left: 40px;
    line-height: 30px;
    &:first-child {
      margin-left: 0;
    }
  }
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
.relation {
  span {
    font-size: 20px;
    color: #1abc9c;
  }
  .btn {
    position: absolute;
    top: 35px;
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
}
.el-select {
  width: 350px;
}
.el-textarea {
  width: 445px;
}
</style>
<style scoped>
.relation >>> .el-form-item__content {
  width: 100%;
}
.relation >>> .el-form-item__error {
  left: auto;
  right: 0;
}
</style>
