<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="发票信息"></addhead>
      <table border="1">
        <tr>
          <th>发票申请单编号：</th>
          <td>{{invoiceApplicationDTO.invoiceApplicationNo||invoiceApplicationDTO.applicationNo}}</td>
          <th>申请时间：</th>
          <td>{{invoiceApplicationDTO.createTime}}</td>
        </tr>
        <tr>
          <th>发票类型：</th>
          <td v-if="group">{{invoiceApplicationDTO.invoiceType=='VAT_INVOICE'?'专票':invoiceApplicationDTO.invoiceType=='PLAIN_INVOICE'?'普票':'电子发票'}}</td>
          <td v-else>{{invoiceApplicationDTO.invoiceType==0?'专票':invoiceApplicationDTO.invoiceType==1?'普票':'电子发票'}}</td>
          <th>实际申请金额：</th>
          <td>￥{{invoiceApplicationDTO.billAmount||invoiceApplicationDTO.amount}}</td>
          
        </tr>
        <tr v-if="!group">
          <th>开票金额：</th>
          <td>￥{{invoiceApplicationDTO.invoiceAmount}}</td>
          <th>平台服务费率：</th>
          <td>{{invoiceApplicationDTO.partyCServiceFeeRate*100}}%</td>
        </tr>
        <tr>
          <th>发票申请人：</th>
          <td>{{invoiceApplicationDTO.creatorName}}</td>
          <th>发票抬头：</th>
          <td>{{invoiceApplicationDTO.invoiceTitle}}</td>
        </tr>
        <tr>
          <th>税务登记号：</th>
          <td>{{invoiceApplicationDTO.socialCreditCode}}</td>
          <th>发票地址：</th>
          <td>{{invoiceApplicationDTO.addressOnInvoice}}</td>
        </tr>
        <tr>
          <th>发票电话：</th>
          <td>{{invoiceApplicationDTO.phoneOnInvoice}}</td>
          <th>账号：</th>
          <td>{{invoiceApplicationDTO.accountNo}}</td>
        </tr>
        <tr>
          <th>发票号码：</th>
          <td>{{invoiceApplicationDTO.invoiceNumber}}</td>
          <th>发票代码：</th>
          <td>{{invoiceApplicationDTO.invoiceCode}}</td>
        </tr>
        <tr>
          <th>开户行：</th>
          <td>{{invoiceApplicationDTO.bank}}</td>
          <th>申请状态:</th>
          <td>{{invoiceApplicationDTO.statusText}}</td>
        </tr>
        <!-- <tr v-if="!group">
          <th>简称：</th>
          <td>{{invoiceApplicationDTO.shortName}}</td>
          <th></th>
          <td>
          </td>
        </tr> -->
        <tr>
          <th>发票寄送地址：</th>
          <td colspan="3">{{(group)?(invoiceApplicationDTO.provinceName+invoiceApplicationDTO.cityName+invoiceApplicationDTO.countryName+invoiceApplicationDTO.receiverAddressLine):invoiceApplicationDTO.recipientAddressLineAndNameAndPhone}}</td>
        </tr>
        <tr>
          <th>发票备注：</th>
          <td colspan="3">{{invoiceApplicationDTO.memoOnInvoice||invoiceApplicationDTO.invoiceMemo}}</td>
        </tr>
        <tr>
          <th>申请备注：</th>
          <td colspan="3">{{invoiceApplicationDTO.applicationMemo}}</td>
        </tr>
        <tr>
          <th>备注1：</th>
          <td colspan="3">{{invoiceApplicationDTO.memo1}}</td>
        </tr>
        <tr>
          <th>备注2：</th>
          <td colspan="3">{{invoiceApplicationDTO.memo2}}</td>
        </tr>
        <tr>
          <th>备注3：</th>
          <td colspan="3">{{invoiceApplicationDTO.memo3}}</td>
        </tr>
        <tr>
          <th>备注4：</th>
          <td colspan="3">{{invoiceApplicationDTO.memo4}}</td>
        </tr>
        <tr>
          <th>备注5：</th>
          <td colspan="3">{{invoiceApplicationDTO.memo5}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear" v-if="group">
      <addhead headname="结算单信息"></addhead>
      <el-table
        :data="centralPurchaseBillList"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="billNo"
          label="结算单编号"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="goDetail(scope.row.id)">{{scope.row.billNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="结算单名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amountText"
          label="结算单金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="制单人"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="detaillTable2 clear" v-if="!group">
      <addhead headname="订单信息"></addhead>
      <el-table
        :data="invoiceApplicationOrderDTOS"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="no"
          label="订单编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderStatusText"
          label="订单状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="订单金额"
          align="center" :formatter="format">
        </el-table-column>
        <el-table-column
          prop="alreadyTotal"
          label="已结算金额"
          align="center" :formatter="format">
        </el-table-column>
        <el-table-column
          prop="billAmount"
          label="本次结算金额"
          align="center" :formatter="format">
        </el-table-column>
        <el-table-column
          prop="invoiceAmount"
          label="本次开票金额"
          align="center" :formatter="format">
        </el-table-column>
        <el-table-column
          prop="firstServerFee"
          label="服务商服务费"
          align="center" :formatter="format">
        </el-table-column>
        <el-table-column
          prop="firstServerFeeRate"
          label="服务费率"
          align="center">
        </el-table-column>
        <el-table-column
          prop="partyCServiceFee"
          label="第三方平台费"
          align="center" :formatter="format">
        </el-table-column>
        <el-table-column
          prop="partyCServiceFeeRate"
          label="平台费率"
          align="center">
        </el-table-column>
      </el-table>
      <div class="total-bill">
        结算总金额：￥{{invoiceApplicationDTO.billAmount}}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开票总金额：￥{{invoiceApplicationDTO.invoiceAmount}}
      </div>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="发票明细"></addhead>
      <el-table
        :data="invoiceApplicationOrderItemDTOs"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="skuNo"
          label="商品编号"
          align="center" v-if="!group">
        </el-table-column>
        <el-table-column
          prop="skuNo"
          label="商品编号"
          align="center" v-if="group">
        </el-table-column>
        <el-table-column
          prop="skuName"
          label="商品名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="skuModel"
          label="型号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
          align="center">
        </el-table-column>
        <el-table-column
          prop="currentPrice"
          label="单价"
          align="center" v-if="group" :formatter="TableMoney">
        </el-table-column>
        <el-table-column
          prop="invoicePrice"
          label="单价（含税）"
          align="center" :formatter="TableMoney" v-if="!group">
        </el-table-column>
        <el-table-column
          prop="invoiceAmount"
          label="金额（含税）"
          align="center" :formatter="TableMoney" v-if="!group">
        </el-table-column>
        <el-table-column
          prop="currentQty"
          label="数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="申请总金额"
          align="center" v-if="group" :formatter="TableMoney">
        </el-table-column>
        <el-table-column
          prop="taxRate"
          label="税率"
          align="center" v-if="!group">
        </el-table-column>
        <el-table-column
          prop="invoiceAmount"
          label="价税合计"
          align="center" :formatter="TableMoney" v-if="!group">
        </el-table-column>
        <el-table-column
          prop="taxCode"
          label="税收分类编码"
          align="center">
        </el-table-column>
        <!-- <el-table-column
          prop="shortName"
          label="简称"
          align="center">
        </el-table-column> -->
      </el-table>
      <div class="total-mount" v-if="group">明细总金额：{{invoiceApplicationDTO.totalAmount}}</div>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作记录"></addhead>
      <el-table
        :data="invoiceApplicationOperationLogs"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userInfo.userFullName"
          label="操作者"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationText"
          label="操作描述"
          align="center" v-if="!group">
        </el-table-column>
        <el-table-column
          prop="operationName"
          label="操作描述"
          align="center" v-if="group">
        </el-table-column>
      </el-table>
    </div>
    <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {InvoicDetail} from "@/api/finance/invoice";
  import {groupDetail} from "@/api/finance/invoiceGroup"
  export default {
    inject:['reload','close','TableMoney'],
    name:'Invoiceapplydetail',
    data(){
      return {
        id:0,
        invoiceApplicationDTO:{},
        centralPurchaseBillList:[],
        invoiceApplicationOrderDTOS:[],
        invoiceApplicationOrderItemDTOs:[],
        invoiceApplicationOperationLogs:[],
        group:false
      }
    },
    activated(){
      this.id = this.$route.query.id;
       if(this.$route.query.group){
         this.group = this.$route.query.group;
        this.getGroupInfo(this.id);
      }else{
        this.getdata(this.id);
      }
    },
    components:{
      addhead
    },
    methods: {
      getdata(id){
        InvoicDetail(id).then(res=>{
          if(res.code=='000000'){
            this.invoiceApplicationDTO = res.data.invoiceApplicationDTO
            this.invoiceApplicationOrderDTOS = res.data.invoiceApplicationOrderDTOS
            this.invoiceApplicationOrderItemDTOs = res.data.invoiceApplicationOrderItemDTOs
            this.invoiceApplicationOperationLogs = res.data.invoiceApplicationOperationLogs
          }
        })
      },
      getGroupInfo(id){
        groupDetail(id).then(res=>{
          if(res.code=='000000'){
              this.invoiceApplicationDTO = res.data
              this.centralPurchaseBillList = res.data.centralPurchaseBillList
              this.invoiceApplicationOrderItemDTOs = res.data.itemDetailLIst
              this.invoiceApplicationOperationLogs = res.data.opLogList
          }
        })
      },
      goDetail(id){
        this.$router.push({
          name: "CollectPurchaseDetail",
          query:{
            id:id
          }
        });
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
    border:1px solid #d1d1d1;
    .button-box{
      display: flex;
      justify-content: flex-end;
      width: 90%;
      margin:0 auto 20px;
    }
    .detaillTable{
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
      border-top:none;
      .total-bill{
        width: 90%;
        margin:10px auto;
        font-size: 18px;
      }
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .total-mount{
        width: 90%;
        margin:20px auto;
      }
      
    }
  }


</style>

