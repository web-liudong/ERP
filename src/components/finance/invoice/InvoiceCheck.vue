<template>
  <div class="wrapper">
    <div class="button-top">
      <el-button icon="el-icon-upload2" @click="expor">导出</el-button>
    </div>
    <div class="head">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>基本信息</span>
      </div>
      <div>
        <span class="slice-info">
          <i class="slice-info-left">发票类型</i> :
          <i class="slice-info-right">{{invoiceTypeName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票代码</i> :
          <i class="slice-info-right">{{invoiceCode}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">发票号码</i> :
          <i class="slice-info-right">{{invoiceNumber}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">开票日期</i> :
          <i class="slice-info-right">{{invoiceDate}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">校验码（后6位）</i> :
          <i class="slice-info-right">{{checkCode}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">购买方名称</i> :
          <i class="slice-info-right">{{organizationName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">销售方名称</i> :
          <i class="slice-info-right">{{supplierName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票税额</i> :
          <i class="slice-info-right">{{taxAmount}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票金额</i> :
          <i class="slice-info-right">{{amount}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">价税合计</i> :
          <i class="slice-info-right">{{pricePlusTaxes}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">制单日期</i> :
          <i class="slice-info-right">{{createTime}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">制单人</i> :
          <i class="slice-info-right">{{creatorName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">受理人</i> :
          <i class="slice-info-right">{{receiverName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票附件</i> :
          <el-button type="text" @click="download(attachment)">{{attachmentName}}</el-button>
        </span>
      </div>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>明细信息</span>
      </div>
      <el-collapse v-model="activeName" accordion @change="collapsechange">
        <el-collapse-item :name="index" v-for="(item,index) in purchaseBillNo" :key="index">
          <template slot="title">
            <div class="el-collapse-name">
              <el-checkbox v-model="item.checked" :disabled="item.paymentModeText=='非预付'||item.invoiceBillStatus!=='INVOICE_APPROVAL'"></el-checkbox>
              <span> 结算单：</span> 
              <el-button type="text">{{item.billNo}}</el-button>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;结算单付款类型：{{item.paymentModeText}}</span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;结算单审批状态：{{item.statusText}}</span>
            </div>
          </template> 
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
            <el-table-column prop="purchaseOrderNo" label="采购单号" align="center"></el-table-column>
            <el-table-column prop="skuId" label="商品ID" align="center"></el-table-column>
            <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center"></el-table-column>
            <el-table-column prop="qty" label="发票数量" align="center"></el-table-column>
            <el-table-column prop="currentPrice" label="发票单价" align="center"></el-table-column>
            <el-table-column prop="currentTaxRate" label="发票税率" align="center"></el-table-column>
            <el-table-column prop="amount" label="发票金额（扣税前）" align="center"></el-table-column>
            <el-table-column prop="taxAmount" label="税额" align="center"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="pass">通过</el-button>
      <el-button type="primary" @click="dialogFormVisible=true">驳回</el-button>
    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible" width="500px" @closed="onclose">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="驳回原因" label-width="100px" prop="description">
          <el-input type="textarea" :rows="5" placeholder="1~200字以内" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReject">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  detail,
  purasebillList,
  exportinvoice,
  invoicepass,
  invoicereject
} from "@/api/purchase/invoice";
import { formatString} from "@/utils";
import { setTimeout } from 'timers';
export default {
  inject: ["reload", "close"], //注入依赖
  name:'InvoicePurCheck',
  data() {
    return {
      form: {
        description: ""
      },
      dialogFormVisible: false,
      id: null,
      invoiceTypeName: "",
      invoiceCode: "",
      invoiceNumber: "",
      invoiceDate: "",
      checkCode: "",
      organizationName: "",
      supplierName: "",
      taxAmount: "",
      amount: "",
      pricePlusTaxes: "",
      createTime: "",
      creatorName: "",
      receiverName: "",
      attachmentName: "",
      activeName:null,
      purchaseBillNo: [],
      attachment: null,
      tableData: [],
      rules: {
        description: [
          { required: true, message: "请输入驳回原因", trigger: "blur" },
          { min: 1, max:200, message: "长度在 1 到 200 个字符", trigger: "blur" }
        ]
      }
    };
  },
  activated() {
    this.id = this.$route.query.id;
    this.getInfo(this.id);
  },
  methods: {
    onclose(){
      this.form.description = null;
    },
    cancelReject(){
      this.dialogFormVisible = false;
    },
    pass() {
      var billIds = [];
      this.purchaseBillNo.forEach(i=>{
        if(i.checked){
          billIds.push(i.id);
        }
      })
      if(!billIds.length){
        this.$message.error('请选择结算单');
        return false;
      }
      invoicepass(this.id,{billIds:billIds}).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "发票审核成功"
          });
          this.close({name:'InvoicePurCheck', to: {name:'InvoiceList', params:{isUpdate:true}}});
        }else if(/^98/.test(res.code)){
          this.$alert("发票状态已审核，不允许再次审核", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.reload();
            }
          });
        }
      });
    },
    reject() {
      var that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          invoicereject({
            description: that.form.description,
            invoiceId: that.id
          }).then(res => {
            if (res.code == "000000") {
              this.$message({
                type: "success",
                message: "发票驳回成功"
              });
              this.close({name:'InvoicePurCheck', to: {name:'InvoiceList', params:{isUpdate:true}}});
            }
          });
        }
      });
    },
    getInfo(id) {
      detail(id).then(res => {
        if (res.code == "000000") {
          this.invoiceTypeName = res.data.invoiceTypeName;
          this.invoiceCode = res.data.invoiceCode;
          this.invoiceNumber = res.data.invoiceNumber;
          this.invoiceDate = res.data.invoiceDate;
          this.checkCode = res.data.checkCode;
          this.organizationName = res.data.organizationName;
          this.supplierName = res.data.supplierName;
          this.taxAmount = res.data.taxAmount;
          this.amount = res.data.amount;
          this.pricePlusTaxes = res.data.pricePlusTaxes;
          this.createTime = res.data.createTime;
          this.creatorName = res.data.creatorName;
          this.receiverName = res.data.receiverName;
          this.attachmentName = res.data.attachmentName;
          this.purchaseBillNo = res.data.purchaseBillNo;
          this.attachment = res.data.attachment;
          this.purchaseBillNo.forEach(i=>{
            i.checked = false;
          })
          if(this.purchaseBillNo.length){
            this.collapsechange(0);
            this.activeName = 0;
          }
        }
      });
    },
    download(id) {
      let href = formatString(
        `/api/file-service/file/download?id={id}&access_token={token}`,
        { id: id, token: this.$auth.token }
      );
      window.open(href, "blank");
    },
    collapsechange(name) {
      purasebillList(this.purchaseBillNo[name].billNo).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data;
        }
      });
    },
    expor() {
      exportinvoice(this.id).then(res => {
        if (res.code == "000000") {
          this.download(res.data);
        }
      });
    }
  }
};
</script>
<style scoped>
.button-top {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}
.el-collapse-name {
  text-indent: 5px;
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
  width: 40%;
  color: #666;
  text-align: right;
  display: inline-block;
}
.slice-info-right {
  width: 50%;
  color: #999;
  text-align: left;
  display: inline-block;
}
.button-box3 {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
</style>
