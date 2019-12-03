<template>
  <div class="wrapper">
    <div class="head">
      <div class="head-title">
        <div>
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>基本信息</span>
        </div>
      </div>
      <div>
        <span class="slice-info">
          <i class="slice-info-left">结算单编号</i> :
          <i class="slice-info-right">{{purchaseBillDTO.billNo}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">创建日期</i> :
          <i class="slice-info-right">{{purchaseBillDTO.createTime}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">结算单名称</i> :
          <i class="slice-info-right">{{purchaseBillDTO.name}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">总金额</i> :
          <i class="slice-info-right">{{purchaseBillDTO.amount}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">供应商</i> :
          <i class="slice-info-right">{{purchaseBillDTO.supplierName}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">付款类型</i> :
          <i
            class="slice-info-right"
          >{{purchaseBillDTO.paymentMode=='NO_PAY_IN_ADVANCE'?'非预付':'预付'}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">预付比例</i> :
          <i class="slice-info-right">{{purchaseBillDTO.scale}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">结算单状态</i> :
          <i class="slice-info-right">{{purchaseBillDTO.statusText}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">供应商开户行</i> :
          <i class="slice-info-right">{{purchaseBillDTO.bank}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">开户行账号</i> :
          <i class="slice-info-right">{{purchaseBillDTO.accountNo}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">供应商开户名</i> :
          <i class="slice-info-right">{{purchaseBillDTO.accountName}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">备注</i> :
          <i class="slice-info-right">{{purchaseBillDTO.memo}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">制单员</i> :
          <i class="slice-info-right">{{purchaseBillDTO.creatorName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">驳回原因</i> :
          <i class="slice-info-right">{{purchaseBillDTO.rejectedReason}}</i>
        </span>
      </div>
    </div>
    <div class="body">
      <div class="head-title">
        <div>
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>发票明细</span>
        </div>
        <div>
          <el-button
            icon="el-icon-plus"
            size="mini"
            @click="createInvoice('createInvoice',{'purchaseBillId':id})"
          >添加</el-button>
        </div>
      </div>
    </div>
    <div class="body" v-for="(item,index) in invoiceList" :key="index">
      <div class="head-title">
        <div>
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>发票{{index+1}}</span>
          <span>状态： {{item.statusText}}</span>
        </div>
        <div>
          <el-button
            size="mini"
            @click="createInvoice('editerInvoice',{'invoiceId':item.id,'purchaseBillId':id})"
            v-if="item.statusText!=='通过'"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delInvoice(item.id)"
            v-if="item.statusText!=='通过'"
          >删除</el-button>
        </div>
      </div>
      <div>
        <span class="slice-info">
          <i class="slice-info-left">发票类型</i> :
          <i class="slice-info-right">{{item.invoiceTypeText}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票代码</i> :
          <i class="slice-info-right">{{item.invoiceCode}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票号码</i> :
          <i class="slice-info-right">{{item.invoiceNumber}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">开票日期</i> :
          <i class="slice-info-right">{{item.invoiceDate}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">校验码（后6位）</i> :
          <i class="slice-info-right">{{item.checkCode}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">购买方名称</i> :
          <i class="slice-info-right">{{item.organizationName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">销售方名称</i> :
          <i class="slice-info-right">{{item.supplierName}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">发票税额</i> :
          <i class="slice-info-right">{{item.taxAmount}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票金额</i> :
          <i class="slice-info-right">{{item.amount}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">价税合计</i> :
          <i class="slice-info-right">{{item.pricePlusTaxes}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">制单日期</i> :
          <i class="slice-info-right">{{item.createTime}}</i>
        </span>

        <span class="slice-info">
          <i class="slice-info-left">制单人</i> :
          <i class="slice-info-right">{{item.creatorName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">受理人</i> :
          <i class="slice-info-right">{{item.receiverName}}</i>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">发票附件</i> :
          <el-button type="text" @click="downfile(item.attachment)">发票附件</el-button>
        </span>
        <span class="slice-info">
          <i class="slice-info-left">驳回原因</i> :
          <i class="slice-info-right">{{item.rejectedReason}}</i>
        </span>
      </div>
    </div>
    <div class="button-box">
        <el-button type="primary" @click="close()">关闭</el-button>
    </div>
    <createInvoice ref="createInvoice" @createInvoiceCallback="createInvoiceCallback"></createInvoice>
  </div>
</template>
<script>
  import {purchasebill} from '@/api/purchase/invoice'
  import {deleteInvoiceList} from '@/api/purchase/purchaseBillList.js'
  import createInvoice from '@/components/purchase/purchaseBillList/child/create_invoice'
  import { formatString} from "@/utils";
  export default {
    inject:['reload','close'],//注入依赖
    name:'InvoiceEdit',
    data() {
      return {
        id:null,
        purchaseBillDTO:{},
        invoiceList:[],
      }
    },
    components:{
     createInvoice
    },
    created(){
      this.id = this.$route.query.id;
      this.getInfo(this.id);
    },
    avtivated(){
      if(this.id!=this.$route.query.id){
        this.id = this.$route.query.id;
        this.getInfo(this.id);
      }
    },
    methods: {
      downfile(id){
        let href = formatString(`/api/file-service/file/download?id={id}&access_token={token}`, {id:id, token:this.$auth.token});
        window.open(href,'blank');
      },
      createInvoiceCallback(){
        this.reload();
      },
      createInvoice(name,value){
        this.$refs.createInvoice.init(name,value,this.purchaseBillDTO);
      },
      delInvoice(invoiceid){
        this.$confirm('确定删除发票明细吗', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            deleteInvoiceList(invoiceid,this.id).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message:'删除发票成功',
                  type:'success'
                })
                this.reload();
              }
            })
        });
      },
      getInfo(id){
        purchasebill(id).then(res=>{
          if(res.code=='000000'){
            this.purchaseBillDTO = res.data.purchaseBillDTO
            this.invoiceList = res.data.purchaseInvoiceDTOList
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
      purasebillList(this.purchaseBillNo[name]).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data;
        }
      });
    },
    print() {
      print();
    },
    expor() {
      exportinvoice(this.id).then(res => {
        if (res.code == "000000") {
          this.download(res.data);
        }
      });
    },
    closed() {
      this.close("EditInvoicePur");
    }
  }
};
</script>
<style scoped>
.el-collapse-name {
  text-indent: 20px;
}
.button-box {
  display: flex;
  justify-content: center;
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
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e4e4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.myicon {
  font-weight: bold;
  color: #666;
  font-size: 20px;
  line-height: 50px;
}
.slice-info {
  width: 45%;
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
}
.button-box3 {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
</style>
