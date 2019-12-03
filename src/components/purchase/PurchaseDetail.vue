<template>
  <div class="wrapper">
    <div class="head">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>基本信息</span>
      </div>
      <div>
        <span class="slice-info">
          <i class="slice-info-left">采购单编号</i> :
          <i class="slice-info-right">{{purchaseOrderNo}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">紧急程度</i> :
          <i class="slice-info-right">{{urgentLevel?'紧急':'不紧急'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票类型</i> :
          <i class="slice-info-right">{{invoiceTypeDescription}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">结款方式</i> :
          <i class="slice-info-right">{{paytypeDescription}}</i>
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
          <i class="slice-info-right">{{includeTax?'是':'否'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">到货类型</i> :
          <i class="slice-info-right">{{deliveryTypeDescription}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">收货地址</i> :
          <i class="slice-info-right">{{recipientAddressLine}}</i>
        </span>

        <span class="slice-info" v-if="deliveryType!=1">
          <i class="slice-info-left">是否预约</i> :
          <i class="slice-info-right">{{appointReceive?'是':'否'}}</i>
        </span>
        <span class="slice-info" v-if="deliveryType!=1">
          <i class="slice-info-left">是否质检</i> :
          <i class="slice-info-right">{{qualityTesting?'是':'否'}}</i>
        </span>
        <span class="slice-info" v-if="deliveryType!=1">
          <i class="slice-info-left">库房</i> :
          <i class="slice-info-right">{{warehouseName}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">是否快递</i> :
          <i class="slice-info-right">{{expressDelivery?'是':'否'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">快递单号</i> :
          <i class="slice-info-right" style="word-wrap: break-word;">{{expressDeliveryNo}}</i>
        </span>
        <span class="slice-info" v-if="deliveryType!=1">
          <i class="slice-info-left">最晚入库时间</i> :
          <i class="slice-info-right">{{latestReceiveTime}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">驳回原因</i> :
          <i class="slice-info-right">{{rejectReason}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">采购单位</i> :
          <i class="slice-info-right">{{requirementOrganizationName}}</i>
        </span>
      </div>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>商品明细</span>
        <el-button
          plain
          icon="el-icon-upload2"
          size="small"
          class="button-box3"
          @click="exportgoods"
        >导出</el-button>
      </div>
      <el-table
        :data="purchaseOrderItemDTOS"
        border
        style="width: 100%">
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
        <el-table-column label="需求创建时间" align="center">
          <template slot-scope="scope">
            <span>{{createType==0?scope.row.requirementCreateTime:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseQty" label="采购数" align="center"></el-table-column>
        <el-table-column prop="purchasePrice" label="采购单价" align="center" :formatter="TableMoney"></el-table-column>
        <el-table-column prop="amount" label="小计" align="center" :formatter="fixMoney"></el-table-column>
        <el-table-column prop="receivedQty" label="已入库" align="center"></el-table-column>
        <el-table-column prop="profitAndLossAmount" label="损溢数" align="center"></el-table-column>
        <el-table-column prop="buyingPrice" label="采购参考价" align="center" :formatter="TableMoney"></el-table-column>
        <el-table-column prop="taxRate" label="税率" align="center" :formatter="formatRate"></el-table-column>
        <el-table-column prop="amount" label="总金额" align="center" :formatter="fixMoney"></el-table-column>
        <el-table-column prop="discount" label="折扣率" align="center" :formatter="returnFloatFun"></el-table-column>
        <el-table-column
          prop="previousPurchasePrice"
          label="最新采购价"
          align="center"
          :formatter="TableMoney"
        ></el-table-column>
        <el-table-column label="库存" align="center">
           <template slot-scope="scope">
            <span>{{scope.row.finishInventoryQty===null?'——':scope.row.finishInventoryQty}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expectedDeliveryDate" label="预计到货日期" align="center"></el-table-column>
        <el-table-column prop="profitAndLossReason" label="损溢原因" align="center"></el-table-column>
        <el-table-column prop="itemMemo" label="采购说明" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="body" v-if="deliveryTypeDescription==='入仓'">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>质检记录</span>
      </div>
      <el-table
        :data="qulityCheckingOperationLogDTOS"
        border
        style="width: 100%"
      >
        <el-table-column prop="checkName" label="质检员" align="center"></el-table-column>
        <el-table-column prop="skuName" label="质检商品名称" align="center"></el-table-column>
        <el-table-column prop="skuId" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="checkQty" label="数量" align="center"></el-table-column>
        <el-table-column prop="checkType" label="质检类型" align="center"></el-table-column>
        <el-table-column prop="checkTime" label="质检时间" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="body" v-if="deliveryTypeDescription==='厂直'">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>到货凭证</span>
      </div>
      <div v-for="(item,index) in cargoReceiptFileIdArray" :key="index" class="cargoitem">
        <span>收货单{{index+1}}:</span>
        <el-button type="text" @click="downloadp(item.id)">{{item.name}}</el-button>
        <el-button type="text" @click="downloadp(item.id)">下载</el-button>
      </div>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>操作日志</span>
      </div>
      <el-table
        :data="purchaseOrderOperationLogDTOS"
        border
        style="width: 100%">
        <el-table-column prop="userInfo.userFullName" label="操作者" align="center"></el-table-column>
        <el-table-column prop="purchaseStatusDescription" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="oprationDescription" label="操作项" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" align="center" :formatter="filterTime"></el-table-column>
      </el-table>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="close()">返回</el-button>
    </div>
  </div>
</template>
<script>
import { getdetail, itemlistexport,getfilelist} from "@/api/purchase/purchase";
import { parseTime, returnFloat } from "@/utils";
export default {
  inject: ["reload", "close", "TableMoney", "formatRate"], //注入依赖
  name:'PurchaseDetail',
  data() {
    return {
      id: null,
      purchaseOrderNo: "",
      urgentLevel: "",
      invoiceTypeDescription: "",
      paytypeDescription: "",
      supplierName: "",
      purchaseType: "",
      recipientName: "",
      recipientPhone: "",
      billOrganizationName: "",
      includeTax: "",
      deliveryTypeDescription: "",
      recipientAddressLine: "",
      appointReceive: "",
      qualityTesting: "",
      warehouseName: "",
      expressDelivery: "",
      expressDeliveryNo: "",
      latestReceiveTime: "",
      rejectReason: "",
      requirementOrganizationName: "",
      deliveryType: null,
      createType:null,
      purchaseOrderItemDTOS: [],
      purchaseOrderOperationLogDTOS: [],
      qulityCheckingOperationLogDTOS: [],
      cargoReceiptFileIdArray:[],
      recipientAddressLine: ""
    };
  },
  activated() {
    this.id = this.$route.query.id;
    this.getInfo(this.id);
  },
  methods: {
    fixMoney(row, column, cellValue, index){
      if(cellValue===null){
        return "——";
      }else{
        return "￥" + cellValue.toFixed(2);
      }
    },
    downloadp(id){
      let href = `/api/file-service/file/download?id=${id}&access_token=${this.$auth.token}`
      window.open(href,'blank');
    },
    getInfo(id) {
      getdetail(id).then(res => {
        if (res.code == "000000") {
          this.purchaseOrderNo = res.data.purchaseOrderNo;
          this.createType = res.data.createType;
          this.urgentLevel = res.data.urgentLevel;
          this.invoiceTypeDescription = res.data.invoiceTypeDescription;
          this.paytypeDescription = res.data.paytypeDescription;
          this.supplierName = res.data.supplierName;
          this.purchaseType = res.data.purchaseType;
          this.recipientName = res.data.recipientName;
          this.recipientPhone = res.data.recipientPhone;
          this.billOrganizationName = res.data.billOrganizationName;
          this.includeTax = res.data.includeTax;
          this.deliveryTypeDescription = res.data.deliveryTypeDescription;
          this.recipientAddressLine = res.data.recipientAddressLine;
          this.appointReceive = res.data.appointReceive;
          this.qualityTesting = res.data.qualityTesting;
          this.warehouseName = res.data.warehouseName;
          this.expressDelivery = res.data.expressDelivery;
          this.expressDeliveryNo = res.data.expressDeliveryNo;
          this.latestReceiveTime = res.data.latestReceiveTime;
          this.rejectReason = res.data.rejectReason;
          this.requirementOrganizationName =
            res.data.requirementOrganizationName;
          this.purchaseOrderItemDTOS = res.data.purchaseOrderItemDTOS;
          this.purchaseOrderOperationLogDTOS =
            res.data.purchaseOrderOperationLogDTOS;
          this.qulityCheckingOperationLogDTOS =
            res.data.qulityCheckingOperationLogDTOS;
          this.deliveryType = res.data.deliveryType;

          if(res.data.cargoReceiptFileIdArray){
              getfilelist({
              ids:res.data.cargoReceiptFileIdArray,
              pageNum:1,
              pageSize:res.data.cargoReceiptFileIdArray?res.data.cargoReceiptFileIdArray.length:0
            }).then(res=>{
              if(res.code=='000000'){
                this.cargoReceiptFileIdArray = res.data.items;
              }
            });
            }
        }
      });
    },
    filterTime(row) {
      return parseTime(row.operationTime);
    },
    returnFloatFun(row, column, cellValue) {
      debugger;
      return returnFloat(cellValue);
    },
    exportgoods() {
      if (this.purchaseOrderItemDTOS.length) {
        itemlistexport(this.id).then(res => {
           if (!res) {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else if(res.type=='application/json') {
            this.$message({
              message: "无可导出数据",
              type: "error"
            });
          }else{
            this.download(res);
          }
        });
      } else {
        this.$message.error("商品明细不能为空");
      }
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/xls" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "商品明细导出文件.xls");
      document.body.appendChild(link);
      link.click();
    }
  }
};
</script>
<style scoped>
.cargoitem{
  padding-left: 30px;
}
.button-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 100px;
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
  width: 30%;
  display: inline-block;
  padding: 20px 0;
}
.slice-info-left {
  width: 30%;
  color: #666;
  text-align: right;
  display: inline-block;
}
.slice-info-right {
  width: 60%;
  color: #999;
  text-align: left;
  display: inline-block;
  vertical-align: top;
  word-break: break-all;
}
.button-box3 {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
</style>
