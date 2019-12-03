<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="开票信息"></addhead>
      <table border="1">
        <tr>
          <th>ID：</th>
          <td>{{invoiceId}}</td>
          <th>状态：</th>
          <td>{{status}}</td>
        </tr>
        <tr>
          <th><i>*</i> 开票抬头：</th>
          <td>{{invoiceTitle}}</td>
          <th><i>*</i> 统一社会信用代码：</th>
          <td>{{socialCreditCode}}</td>
        </tr>
        <tr>
          <th><i v-if="$route.query.type!=='普票'">*</i> 电话：</th>
          <td>{{phoneOnInvoice}}</td>
          <th><i v-if="$route.query.type!=='普票'">*</i> 地址：</th>
          <td>{{addressOnInvoice}}</td>
        </tr>
        <tr>
          <th><i v-if="$route.query.type!=='普票'">*</i> 账号：</th>
          <td>{{accountNo}}</td>
          <th><i v-if="$route.query.type!=='普票'">*</i> 开户行：</th>
          <td>{{bank}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table
        :data="tablelog"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userName"
          label="操作者"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationDescription"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import addhead from '@/components/common/head/head.vue'
  import {invoicedetail,invoicedetaillog} from '@/api/customerManage'
  export default {
    name:'invoicedetail',
    inject:['close'],
    data(){
      return {
        id:null,
        invoiceId:null,
        status:null,
        socialCreditCode:'',
        phoneOnInvoice:'',
        addressOnInvoice:'',
        accountNo:'',
        bank:'',
        invoiceTitle:'',
        tablelog:[],
      }
    },
    activated(){
      this.id = this.$route.query.id;
      this.getdata(this.id);
      this.getLog(this.id);
    },
    components:{
      addhead
    },
    methods: {
      getdata(id){
        invoicedetail(id).then(res=>{
          if(res.code=='000000'){
            this.invoiceId = res.data.id;
            this.status = res.data.status;
            this.socialCreditCode = res.data.socialCreditCode;
            this.phoneOnInvoice = res.data.phoneOnInvoice;
            this.addressOnInvoice = res.data.addressOnInvoice;
            this.accountNo = res.data.accountNo;
            this.bank = res.data.bank;
            this.invoiceTitle = res.data.invoiceTitle;
          }
        })
      },
      getLog(id){
        invoicedetaillog(id).then(
          res=>{
            if(res.code=='000000'){
              this.tablelog = res.data
            }
          }
        )
      },
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
    .detaillTable{
      border: 1px solid #d1d1d1;
      table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          padding-right:6px;
          box-sizing: border-box;
          color:#666;
          font-weight:700;
          font-size: 14px;
          text-align: right;
          width:20%;
          i{
            color:red;
          }
        }
        td{
          color: #666666;
          text-align: left;
          padding-left:10px;
          width:30%;
        }
      }
    }
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .button-box{
        display: flex;
        justify-content: flex-end;
        width: 90%;
        margin:0 auto 20px;
      }
    }
  }


</style>

