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
          <i class="slice-info-right">{{urgentLevel?'是':'否'}}</i>
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
          <i class="slice-info-right">{{expressDeliveryNo}}</i>
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
        <span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <i style="color:red;">*</i> 到货状态：
        </span>
        <el-select v-model="arrivalType" placeholder="请选择" @change="onchange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-table
        :data="purchaseOrderItemDTOS"
        border
        style="width: 100%"
        max-height="500"
        height="250"
      >
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="purchaseQty" label="采购数量" align="center"></el-table-column>
        <el-table-column label="到货数量" align="center" min-width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.receivedQty"
              clearable
              :disabled="scope.row.profitAndLossStatus==0||scope.row.profitAndLossStatus==2"
              type="number"
              @change="oninput(scope)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="损溢数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.receivedQty-scope.row.purchaseQty}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" label="本次采购价" align="center"></el-table-column>
        <el-table-column prop="buyingPrice" label="采购参考价" align="center"></el-table-column>
        <el-table-column label="税率" align="center" prop="taxRateText"></el-table-column>
        <el-table-column prop="amount" label="总金额" align="center" :formatter="fixMoney"></el-table-column>
        <el-table-column prop="discount" label="折扣率" align="center"></el-table-column>
        <el-table-column prop="previousPurchasePrice" label="最新采购价" align="center"></el-table-column>
        <el-table-column label="库存" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.finishInventoryQty===null?'——':scope.row.finishInventoryQty}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expectedDeliveryDate" label="期望到货日期" align="center"></el-table-column>
        <el-table-column prop="profitAndLossReason" label="损溢原因" align="center"></el-table-column>
        <el-table-column prop="itemMemo" label="采购说明" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="body">
      <div class="head-title2">
        <div>
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>到货凭证</span>
        </div>
        <div class="listBoxRight">
          <el-upload
            multiple
            :action="action"
            :show-file-list="false"
            :data="{id:id}"
            :headers="headerToken"
            :on-success="handleAvatarSuccess"
            :on-error="uploaderror"
            :before-upload="beforeAvatarUpload"
            name="fileName"
            :file-list="cargos"
          >
            <el-button size="small" type="primary">添加</el-button>
          </el-upload>
        </div>
      </div>
      <div class="cargo-list" v-for="(item,index) in cargos" :key="index">
        <span>收货单{{index+1}}</span>:
        <el-button type="text" size="small">{{item.name}}</el-button>
        <el-button type="text" size="small" @click="download2(item.id)">下载</el-button>
        <el-button type="text" size="small" @click="deleteca(item.id)">删除</el-button>
      </div>
    </div>
    <div class="button-box2">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button type="primary" @click="close()">返回</el-button>
    </div>
  </div>
</template>
<script>
import {
  getdetail,
  itemlistexport,
  getfilelist,
  deletecargo,
  confirmation
} from "@/api/purchase/purchase";
import { parseTime, formatString } from "@/utils";
import { setTimeout } from "timers";
export default {
  inject: ["reload", "close"], //注入依赖
  name: "PurchaseConfirm",
  data() {
    return {
      cargos: [],
      action: "",
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
      purchaseOrderItemDTOS: [],
      purchaseOrderOperationLogDTOS: [],
      backupfile: [],
      recipientAddressLine: "",
      options: [
        {
          value: 0,
          label: "全部到货"
        },
        {
          value: 1,
          label: "部分到货"
        }
      ],
      arrivalType: null,
      incomedisable: false,
      imageUrl: "",
      headerToken: { Authorization: "Bearer " + this.$auth.token },
      cargoReceiptFileIdArray: [],
      deliveryType: null
    };
  },
  activated() {
    this.id = this.$route.query.id;
    this.arrivalType = null;
    (this.action =
      "/api/purchase-service/purchase/management/" +
      this.id +
      "/cargo-receipt"),
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
    oninput(scope) {
      if (this.arrivalType === null) {
        this.$message.error("请先选择到货状态");
        scope.row.receivedQty = null;
        return false;
      }
      if (!scope.row.receivedQty) {
        this.$message.error("请填写到货数量");
        scope.row.receivedQty = null;
        return false;
      }
      if (
        scope.row.receivedQty > scope.row.purchaseQty ||
        scope.row.receivedQty < 0
      ) {
        this.$message.error("到货数量不能超过采购数量");
        scope.row.receivedQty = null;
      } else if (
        scope.row.receivedQty < this.backupfile[scope.$index].receivedQty
      ) {
        this.$message.error("到货数量不能小于上一次到货数量");
        scope.row.receivedQty = null;
      }
    },
    confirm() {
      if (this.arrivalType === null) {
        this.$message.error("到货状态必填");
        return false;
      }
      var that = this;
      var flag = true;
      if (this.arrivalType === 0 && !this.cargos) {
        this.$message.error("全部到货必须要上传到货凭证");
        return;
      }
      let purchaseArrivalConfirmations = [];
      this.purchaseOrderItemDTOS.map(function(val, index) {
        if (val.receivedQty === null) {
          that.$message.error("有到货数量异常");
          flag = false;
          return false;
        }
        if (val.receivedQty !== that.backupfile[index].receivedQty) {
          purchaseArrivalConfirmations.push({
            id: val.id,
            receivedQty: val.receivedQty
          });
        }
      });
      if (!flag) {
        return false;
      }
      confirmation(this.id, {
        purchaseArrivalConfirmations: purchaseArrivalConfirmations,
        arrivalType: this.arrivalType - 0
      }).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "确认成功",
            type: "success"
          });
          this.close({
            name: "PurchaseConfirm",
            to: { name: "PurchaseOrder", params: { isUpdate: true } }
          });
        }
      });
    },
    deleteca(id) {
      this.$confirm("确定删除到货凭证吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletecargo(this.id, id).then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            getdetail(this.id).then(res => {
              if (res.code == "000000" && res.data.cargoReceiptFileIdArray) {
                getfilelist({
                  ids: res.data.cargoReceiptFileIdArray,
                  pageNum: 1,
                  pageSize: res.data.cargoReceiptFileIdArray
                    ? res.data.cargoReceiptFileIdArray.length
                    : 0
                }).then(res => {
                  if (res.code == "000000") {
                    this.cargos = res.data.items;
                  }
                });
              } else if (!res.data.cargoReceiptFileIdArray) {
                this.cargos = [];
              }
            });
          }
        });
      });
    },
    download2(id) {
      let href = `/api/file-service/file/download?id=${id}&access_token=${this.$auth.token}`;
      window.open(href, "blank");
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
      }
      return isLt2M;
    },
    uploaderror(res, file) {
      this.$message({
        message: JSON.parse(res.message).message,
        type: "error"
      });
    },
    handleAvatarSuccess(res, file) {
      var that = this;
      if (res.code == "000000") {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$message({
          message: "上传成功",
          type: "success"
        });
        getdetail(this.id).then(res => {
          if (res.code == "000000" && res.data.cargoReceiptFileIdArray) {
            getfilelist({
              ids: res.data.cargoReceiptFileIdArray,
              pageNum: 1,
              pageSize: res.data.cargoReceiptFileIdArray
                ? res.data.cargoReceiptFileIdArray.length
                : 0
            }).then(res => {
              if (res.code == "000000") {
                this.cargos = res.data.items;
              }
            });
          }
        });
      } else {
        this.$message({
          message: "上传失败",
          type: "error"
        });
      }
    },
    onchange(val) {
      var that = this;
      if (val == 0) {
        this.purchaseOrderItemDTOS.map(function(val, index) {
          if (val.profitAndLossStatus !== 0 && val.profitAndLossStatus !== 2) {
            that.$set(val, "receivedQty", val.purchaseQty);
          }
        });
      } else if (val == 1) {
        this.backupfile.map(function(val, index) {
          if (val.profitAndLossStatus !== 0) {
            that.$set(
              that.purchaseOrderItemDTOS[index],
              "receivedQty",
              val.receivedQty
            );
          }
        });
      }
    },
    cloneObjectFn(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    getInfo(id) {
      var that = this;
      getdetail(id).then(res => {
        if (res.code == "000000") {
          this.purchaseOrderNo = res.data.purchaseOrderNo;
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
          this.deliveryType = res.data.deliveryType;
          this.purchaseOrderItemDTOS = res.data.purchaseOrderItemDTOS;

          this.backupfile = this.cloneObjectFn(res.data.purchaseOrderItemDTOS);
          this.cargoReceiptFileIdArray = res.data.cargoReceiptFileIdArray;
          if (res.data.cargoReceiptFileIdArray) {
            getfilelist({
              ids: res.data.cargoReceiptFileIdArray,
              pageNum: 1,
              pageSize: res.data.cargoReceiptFileIdArray
                ? res.data.cargoReceiptFileIdArray.length
                : 0
            }).then(res => {
              if (res.code == "000000") {
                this.cargos = res.data.items;
              }
            });
          } else {
            this.cargos = [];
          }
        }
      });
    },
    filterTime(row) {
      return parseTime(row.operationTime);
    },
    exportgoods() {
      if (this.purchaseOrderItemDTOS.length) {
        itemlistexport({
          purchaseId: this.id
        }).then(res => {
          this.download(res);
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
      link.setAttribute("download", "files.xls");
      document.body.appendChild(link);
      link.click();
    }
  }
};
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 107px;
  height: 107px;
  line-height: 107px;
  text-align: center;
}
.avatar {
  width: 100%;
  display: block;
}
.cargo-list {
  padding-left: 100px;
  display: flex;
  align-items: center;
}
.button-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 100px;
}
.wrapper {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 150px;
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
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e4e4;
  align-items: center;
}
.head-title2 {
  width: 100%;
  background-color: #f3f3f3;
  height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e4e4;
  align-items: center;
  display: flex;
  justify-content: space-between;
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
  word-break: break-all;
}
.button-box2 {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
</style>
