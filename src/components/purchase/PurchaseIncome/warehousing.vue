<template>
  <div class="wrapper">
    <div class="head">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>基本信息：</span>
      </div>
      <div>
        <span class="slice-info">
          <i class="slice-info-left">采购单编号</i> :
          <i class="slice-info-right">{{purchaseOrderNo}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">紧急程度</i> :
          <i class="slice-info-right">{{urgentLevel?'是':'否'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票类型</i> :
          <i class="slice-info-right">{{invoiceTypeText}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">结款方式</i> :
          <i class="slice-info-right">{{payType?'现金采购':'签单收货'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">是否集采</i> :
          <i class="slice-info-right">{{purchaseType?'是':'否'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">供应商名称</i> :
          <i class="slice-info-right">{{supplierName}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">收货人</i> :
          <i class="slice-info-right">{{recipientName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">收货人联系方式</i> :
          <i class="slice-info-right">{{recipientPhone}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">结算单位</i> :
          <i class="slice-info-right">{{billOrganizationName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">是否含税</i> :
          <i class="slice-info-right">{{includeTaxDescription}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">到货类型</i> :
          <i class="slice-info-right">{{deliveryTypeDescription}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">收货地址</i> :
          <i class="slice-info-right">{{recipientAddressLine}}</i>
        </span>
        <span class="slice-info" v-if="delivername!=1">
          <i class="slice-info-left">是否预约</i> :
          <i class="slice-info-right">{{appointReceive?'是':'否'}}</i>
        </span>
        <span class="slice-info" v-if="delivername!=1">
          <i class="slice-info-left">是否质检</i> :
          <i class="slice-info-right">{{qualityTesting?'是':'否'}}</i>
        </span>

        <span class="slice-info" v-if="delivername!=1">
          <i class="slice-info-left">库房</i> :
          <i class="slice-info-right">{{warehouseName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">是否快递</i> :
          <i class="slice-info-right">{{expressDelivery?'是':'否'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">是否快递</i> :
          <i class="slice-info-right">{{expressDelivery?'是':'否'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">快递单号</i> :
          <i class="slice-info-right">{{expressDeliveryNo}}</i>
        </span>
        <span class="slice-info" v-if="delivername!=1">
          <i class="slice-info-left">最晚入库时间</i> :
          <i class="slice-info-right">{{latestReceiveTime}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">驳回原因</i> :
          <i class="slice-info-right">{{rejectReason}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">采购单位名称</i> :
          <i class="slice-info-right">{{requirementOrganizationName}}</i>
        </span>
      </div>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>未到货商品明细</span>
      </div>
      <el-table
        :data="unfinishedPurchaseOrderItemDTOS"
        border
        style="width: 100%"
        max-height="500"
        height="250"
      >
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
        <el-table-column prop="purchaseQty" label="采购数量" align="center"></el-table-column>
        <el-table-column prop="receivedQty" label="已入库" align="center"></el-table-column>
        <el-table-column prop="profitAndLossAmount" label="损溢数" align="center"></el-table-column>
        <el-table-column prop="buyingPrice" label="采购参考价" align="center"></el-table-column>
        <el-table-column prop="taxRate" label="税率" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.taxRate*100}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="总金额" align="center" :formatter="fixMoney"></el-table-column>
        <el-table-column prop="previousPurchasePrice" label="最新采购价" align="center"></el-table-column>
        <el-table-column label="库存" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.finishInventoryQty===null?'——':scope.row.finishInventoryQty}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemMemo" label="采购说明" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="sure(scope.row,scope.$index)">损益确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>已到货商品明细</span>
      </div>
      <el-table
        :data="finishedPurchaseOrderItemDTOS"
        border
        style="width: 100%"
        max-height="500"
        height="250"
      >
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
        <el-table-column prop="purchaseQty" label="采购数量" align="center"></el-table-column>
        <el-table-column prop="receivedQty" label="已入库" align="center"></el-table-column>
        <el-table-column prop="profitAndLossAmount" label="损溢数" align="center"></el-table-column>
        <el-table-column prop="buyingPrice" label="采购参考价" align="center"></el-table-column>
        <el-table-column prop="taxRate" label="税率" align="center"></el-table-column>
        <el-table-column prop="amount" label="总金额" align="center"></el-table-column>
        <el-table-column prop="previousPurchasePrice" label="最新采购价" align="center"></el-table-column>
        <el-table-column prop="finishInventoryQty" label="库存" align="center"></el-table-column>
        <el-table-column prop="itemMemo" label="采购说明" align="center"></el-table-column>
        <el-table-column prop="profitAndLossReason" label="损益原因" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="submit" v-if="profitReasonDTOS.length!=0">确定</el-button>
      <el-button type="primary" @click="close()">返回</el-button>
    </div>
    <el-dialog title="损益确认" :visible.sync="incomedialog">
      <div class="dialog-box">商品名称：{{current.skuName}}</div>
      <div
        class="dialog-box"
      >采购数量：{{current.purchaseQty}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已入库数量：{{current.receivedQty}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;损益数量：{{current.profitAndLossAmount}}</div>
      <div v-for="(it,index) in profitReasonDTOS" :key="index">
        <div class="dialog-box" v-show="selectindex==index">
          <span>请填写损益原因：</span>
          <el-select v-model="it.deliveryType" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="dialog-box" v-show="it.deliveryType=='自定义'&&selectindex==index">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="it.textarea"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="incomedialog = false">取 消</el-button>
        <el-button type="primary" @click="addprofitReason">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { profitlosslist, confirmincome } from "@/api/purchase/purchase";
export default {
  inject: ["reload", "close"], //注入依赖
  name: "Factoryincome",
  data() {
    return {
      selectindex: 0,
      id: null,
      appointReceive: null,
      rejectReason: null,
      latestReceiveTime: null,
      expressDelivery: null,
      qualityTesting: null,
      expressDeliveryNo: null,
      requirementOrganizationName: null,
      purchaseOrderNo: "",
      billOrganizationName: "",
      recipientPhone: "",
      recipientName: "",
      urgentLevel: "",
      purchaseType: "",
      invoiceTypeText: "",
      payType: "",
      supplierName: "",
      warehouseName: "",
      includeTaxDescription: "",
      deliveryTypeDescription: "",
      unfinishedPurchaseOrderItemDTOS: [],
      finishedPurchaseOrderItemDTOS: [],
      incomedialog: false,
      textarea: "",
      current: {},
      profitReasonDTOS: [],
      recipientAddressLine: "",
      options: [
        {
          value: "商品破损",
          label: "商品破损"
        },
        {
          value: "需求变动",
          label: "需求变动"
        },
        {
          value: "自定义",
          label: "自定义"
        }
      ],
      delivername: null
    };
  },
  activated() {
    this.id = this.$route.query.id;
    this.getInfo(this.id);
    this.profitReasonDTOS = [];
    this.deliveryType = null;
    this.textarea = "";
  },
  methods: {
    fixMoney(row, column, cellValue, index){
      if(cellValue===null){
        return "——";
      }else{
        return "￥" + cellValue.toFixed(2);
      }
    },
    addprofitReason() {
      var item = this.profitReasonDTOS[this.selectindex];
      if (!item.deliveryType) {
        this.$message({
          message: "损益原因必填",
          type: "error"
        });
        return false;
      } else if (item.deliveryType == "自定义" && !item.textarea) {
        this.$message({
          message: "请填写自定义原因",
          type: "error"
        });
        return false;
      }
      if (this.profitReasonDTOS[this.selectindex].deliveryType == "自定义") {
        this.profitReasonDTOS[
          this.selectindex
        ].description = this.profitReasonDTOS[this.selectindex].textarea;
      } else {
        this.profitReasonDTOS[
          this.selectindex
        ].description = this.profitReasonDTOS[this.selectindex].deliveryType;
      }
      this.incomedialog = false;
      this.current = {};
      this.$message({
        message: "保存成功，点击下方确认按钮最终确认",
        type: "success"
      });
    },
    submit() {
      this.profitReasonDTOS.forEach((item, index) => {
        if (item.purchaseOrderItemId) {
          delete item.textarea;
          delete item.deliveryType;
        } else {
          this.profitReasonDTOS.splice(index, 1);
        }
      });
      if (this.profitReasonDTOS.length) {
        confirmincome({
          purchaseOrderId: this.id,
          profitReasonDTOS: this.profitReasonDTOS
        }).then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "确认成功",
              type: "success"
            });
            this.reload();
          }
        });
      } else {
        this.$message({
          message: "损益商品不能为空",
          type: "error"
        });
      }
    },
    getInfo(id) {
      profitlosslist(id).then(res => {
        if (res.code == "000000") {
          this.purchaseOrderNo = res.data.purchaseOrderNo;
          this.requirementOrganizationName =
            res.data.requirementOrganizationName;
          this.rejectReason = res.data.rejectReason;
          this.latestReceiveTime = res.data.latestReceiveTime;
          this.expressDeliveryNo = res.data.expressDeliveryNo;
          this.expressDelivery = res.data.expressDelivery;
          this.qualityTesting = res.data.qualityTesting;
          this.appointReceive = res.data.appointReceive;
          this.billOrganizationName = res.data.billOrganizationName;
          this.recipientPhone = res.data.recipientPhone;
          this.recipientName = res.data.recipientName;
          this.purchaseType = res.data.purchaseType;
          this.urgentLevel = res.data.urgentLevel;
          this.invoiceTypeText = res.data.invoiceTypeDescription;
          this.payType = res.data.payType;
          this.supplierName = res.data.supplierName;
          this.warehouseName = res.data.warehouseName;
          this.includeTaxDescription = res.data.includeTaxDescription;
          this.deliveryTypeDescription = res.data.deliveryTypeDescription;
          this.unfinishedPurchaseOrderItemDTOS =
            res.data.unfinishedPurchaseOrderItemDTOS;
          this.finishedPurchaseOrderItemDTOS =
            res.data.finishedPurchaseOrderItemDTOS;
          this.recipientAddressLine = res.data.recipientAddressLine;
          this.delivername = res.data.deliveryType;
          this.profitReasonDTOS = [];
          res.data.unfinishedPurchaseOrderItemDTOS.forEach((item, index) => {
            this.profitReasonDTOS.push({
              purchaseOrderItemId: null,
              deliveryType: null,
              textarea: ""
            });
          });
        }
      });
    },
    sure(row, index) {
      this.incomedialog = true;
      this.current = row;
      this.selectindex = index;
      console.log(this.profitReasonDTOS);
      this.profitReasonDTOS[index].purchaseOrderItemId = row.id;
    }
  }
};
</script>
<style scoped>
.dialog-box {
  width: 500px;
  height: 50px;
}
.wrapper {
  width: 100%;
  padding-top: 20px;
}
.head {
  border: 1px solid #e4e4e4;
  margin-bottom: 20px;
}
.body {
  border: 1px solid #e4e4e4;
  margin-bottom: 20px;
}
.button-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 100px;
}
.head-title {
  width: 100%;
  background-color: #f3f3f3;
  height: 50px;
  padding-left: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e4e4;
}
.myicon {
  font-weight: bold;
  color: #666;
  font-size: 20px;
  line-height: 50px;
}
.slice-info {
  width: 20%;
  display: inline-block;
  padding: 20px 0;
}
.slice-info-left {
  width: 45%;
  color: #666;
  text-align: right;
  display: inline-block;
}
.slice-info-right {
  width: 45%;
  color: #999;
  text-align: left;
  display: inline-block;
  vertical-align: top;
}
.button-box {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
</style>
