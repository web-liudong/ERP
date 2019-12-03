
<template>
  <div class="approvalbox">
    <div class="basicInfobox">
      <div class="title">
        <span>
          <i class="iconfont iconjinridingdanshu aicon"></i>&nbsp;审批：
        </span>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        style="padding-bottom:0  !important"
        label-width="110px"
      >
        <el-form-item label="审批结果：" prop="results">
          <el-radio-group v-model="ruleForm.results" @change="changable">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :model="basicInfo" ref="basicInfo" class="advicebox" v-show="isShow">
        <el-form-item label="审批意见：">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="basicInfo.rejectReason"></el-input>
        </el-form-item>
      </el-form>

      <div class="title">
        <span>
          <i class="iconfont iconjinridingdanshu aicon"></i>&nbsp;基本信息：
        </span>
      </div>
      <el-form ref="basicInfo" :model="basicInfo" class="infobox">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="采购单编号："
              label-width="130px"
              class="forms"
              style="word-wrap: break-word;"
              required
            >{{basicInfo.purchaseOrderNo}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="紧急程度："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.urgentLevel==1?"紧急":"不紧急"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="发票类型："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.invoiceTypeDescription}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="结款方式："
              label-width="130px"
              class="forms"
              required
            >{{basicInfo.paytypeDescription}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否集采："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.purchaseType==1?"是":"否"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="供应商名称："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.supplierName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="收货人："
              label-width="130px"
              class="forms"
              required
            >{{basicInfo.recipientName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="收货人联系方式："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.recipientPhone}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="结算单位："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.billOrganizationName}}</el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="是否含税："
              label-width="130px"
              class="forms"
              required
            >{{basicInfo.includeTaxDescription==1?"是":"否"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="到货类型："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.deliveryTypeDescription}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="收货地址："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.recipientAddressLine}}</el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="是否快递："
              label-width="130px"
              class="forms"
              required
            >{{basicInfo.expressDelivery==1?"是":"否"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="快递单号："
              label-width="135px"
              class="forms"
              style="word-wrap: break-word;"
            >{{basicInfo.expressDeliveryNo}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="采购单位："
              label-width="130px"
              class="forms"
              required
            >{{basicInfo.requirementOrganizationName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="basicInfo.deliveryType==0">
          <el-col :span="8">
            <el-form-item
              label="是否预约："
              label-width="130px"
              class="forms"
              required
            >{{basicInfo.appointReceive==1?"是":"否"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否质检："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.qualityTesting==1?"是":"否"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="库房："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.warehouseName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="basicInfo.deliveryType==0">
          <el-col :span="8">
            <el-form-item
              label="最晚入库时间："
              label-width="135px"
              class="forms"
              required
            >{{basicInfo.latestReceiveTime}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="detailbox">
      <div class="title">
        <span>
          <i class="iconfont iconjinridingdanshu aicon"></i>&nbsp;商品明细：
        </span>
      </div>
      <div>
        <el-table
          :data="basicInfo.purchaseOrderItemDTOS"
          border
          style="width: 100%;"
          max-height="300"
          class="listbox"
          :cell-style="cellstyle"
        >
          <el-table-column prop="skuNo" label="商品编号" width="120" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" width="230" align="center"></el-table-column>
          <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
          <el-table-column prop="purchaseQty" label="本次采购数" align="center" width="120"></el-table-column>
          <el-table-column label="采购单价" align="center" min-width="120">
            <template slot-scope="scope">￥{{retainDecimals(scope.row.purchasePrice)}}</template>
          </el-table-column>
          <el-table-column prop="receivedQty" label="已入库" align="center" type="number"></el-table-column>
          <el-table-column prop="profitAndLossAmount" label="损溢数" align="center" type="number"></el-table-column>
          <el-table-column label="采购参考价" align="center" width="120">
            <template slot-scope="scope">￥{{retainDecimal1(scope.row.buyingPrice)}}</template>
          </el-table-column>
          <el-table-column prop="taxRate" label="税率" align="center" :formatter="tax"></el-table-column>
          <el-table-column  label="总金额" align="center">
             <template slot-scope="scope">{{retainDecimal(scope.row.amount)}}</template>
            </el-table-column>
          <el-table-column prop="discount" label="折扣率" align="center"></el-table-column>
          <el-table-column label="最新采购价" align="center" width="120">
            <template slot-scope="scope">￥{{retainDecimal2(scope.row.previousPurchasePrice)}}</template>
          </el-table-column>
          <el-table-column label="库存" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.finishInventoryQty===null?'——':scope.row.finishInventoryQty}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="expectedDeliveryDate" label="预计到货日期" align="center" width="150"></el-table-column>
          <el-table-column prop="profitAndLossReason" label="损益原因" align="center" width="250"></el-table-column>
          <el-table-column prop="itemMemo" label="采购说明" align="center" width="250"></el-table-column>
        </el-table>
      </div>
      <div class="title">
        <span>
          <i class="iconfont iconjinridingdanshu aicon"></i>&nbsp;操作日志：
        </span>
      </div>
      <div>
        <el-table
          :data="basicInfo.purchaseOrderOperationLogDTOS"
          border
          style="width: 100%"
          max-height="260"
        >
          <el-table-column label="操作者" width="400" align="center">
            <template slot-scope="scope">
              {{scope.row.userInfo.userPosts[0].organizationName}}>
              {{scope.row.userInfo.userPosts[0].departmentName}}>
              {{scope.row.userInfo.realName}}
            </template>
          </el-table-column>
          <el-table-column prop="purchaseStatusDescription" label="订单状态" align="center"></el-table-column>
          <el-table-column prop="oprationDescription" label="操作项" align="center"></el-table-column>
          <el-table-column prop="operationTime" label="操作时间" align="center" :formatter="filterTime"></el-table-column>
        </el-table>
      </div>
    </div>
    <div style="text-align:right;margin:20px 0">
      <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
      <el-button type="primary" style="margin-right:20px;" @click="close();">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getPurchaseOrderDetail,
  passPurchaseApproval,
  rejectPurchaseApproval
} from "@/api/purchaseApproval";
import { parseTime } from "@/utils";
export default {
  inject: ["reload", "close"], //注入依赖
  name: "PurchaseOrderApproval",
  components: {},
  data() {
    return {
      ruleForm: {
        results: ""
      },
      isShow: true,
      basicInfo: {
        purchaseOrderOperationLogDTOS: [
          {
            userInfo: {
              userPosts: [
                {
                  organizationName: "",
                  departmentName: ""
                }
              ]
            }
          }
        ],
        purchaseOrderItemDTOS: []
      },

      rules: {
        results: [
          { required: true, message: "审批结果不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {},
  activated() {
    if (this.id != this.$route.query.id || this.$route.list) {
      this.ruleForm.results = null;
      this.basicInfo.rejectReason = null;
      this.getDetail();
      this.empty();
    }
  },
  methods: {
    cellstyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 6) {
        if (row.purchasePrice > row.buyingPrice) {
          return "color:red";
        }
      }
    },
    empty() {
      this.$refs.ruleForm.resetFields();
    },
    changable(results) {
      if (this.ruleForm.results == 0) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    tax(row, column) {
      let taxRate = "";
      taxRate = row.taxRate;
      return (taxRate = taxRate * 100 + "%");
    },
    retainDecimal(value) {
      let amount = "";
      amount = value.toFixed(2);
      return amount;
    },
    retainDecimals(value) {
      let purchasePrice = "";
      purchasePrice = value.toFixed(4);
      return purchasePrice;
    },
    retainDecimal1(value) {
      let buyingPrice = "";
      buyingPrice = value.toFixed(4);
      return buyingPrice;
    },
    retainDecimal2(value) {
      let previousPurchasePrice = "";
      previousPurchasePrice = value.toFixed(4);
      return previousPurchasePrice;
    },
    // filterTime(row) {
    //  var date=new Date(row.operationTime)
    // var q= date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8)
    //  return q;
    // },
    filterTime(row) {
      return parseTime(row.operationTime);
    },
    getDetail() {
      getPurchaseOrderDetail(this.$route.query.id).then(res => {
        if (res.code == "000000") {
          if (res.data == "") {
            this.basicInfo = {};
          } else {
            this.basicInfo = res.data;
            this.basicInfo.status = res.data.status;
            if (this.basicInfo.status == 0) {
              this.basicInfo.rejectReason = "";
            }
          }
        }
      });
    },

    submit(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let results = this.ruleForm.results;
          if (results == 0) {
            this.pass();
          } else if (results == 1) {
            this.reject();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reject() {
      let data = {
        purchaseOrderId: this.$route.query.id,
        description: this.basicInfo.rejectReason
      };
      rejectPurchaseApproval(data).then(res => {
        if ((res.data = "000000")) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
        } else if (/^98/.test(res.code)) {
          this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.reload();
            }
          });
        }
        this.close({
          name: "PurchaseOrderApproval",
          to: { name: "PurchaseApprovalList", params: { isUpdate: true } }
        });
      });
    },
    pass() {
      passPurchaseApproval(this.$route.query.id).then(res => {
        if ((res.data = "000000")) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
        } else if (/^98/.test(res.code)) {
          this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.reload();
            }
          });
        }
        this.close({
          name: "PurchaseOrderApproval",
          to: { name: "PurchaseApprovalList", params: { isUpdate: true } }
        });
      });
    }
  }
};
</script>

<style scoped lang='less'>
.approvalbox {
  width: 100%;
}
.basicInfobox {
  border: 1px solid #e4e4e4;
  clear: both;
  margin: 20px 0 0 0;
  .el-textarea {
    width: 800px;
  }
  .el-form {
    padding: 20px 0;
  }

  .el-form-item {
    padding: 0 20px;
  }
}
.title {
  height: 50px;
  line-height: 50px;
  background-color: #f3f3f3;
  padding-left: 20px;

  .aicon {
    color: #666;
    font-size: 20px;
    line-height: 50px;
    font-weight: bold;
  }
}
.infobox {
  /deep/.el-form-item__label {
    font-weight: bold !important;
  }
  .el-row {
    margin: 0 0 0 50px;
  }
  .el-col {
    padding-left: 5px;
  }
  /deep/ .el-form-item__content {
    width: 230px !important;
  }
  .el-form-item {
    margin-bottom: 12px !important;
  }
}
.results {
  width: 90%;
  margin: 20px auto;
}
.advicebox {
  margin-left: 28px;
  padding-top: 0 !important;
}
.listbox {
  overflow: inherit;
}
.detailbox {
  border: 1px solid #e4e4e4;
  .el-table-column {
    background: #f3f3f3;
  }
}
</style>