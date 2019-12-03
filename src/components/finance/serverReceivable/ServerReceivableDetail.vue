<template>
  <div class="ReceivableDetailBox">
    <div class="detailTable1">
      <addhead headname="应收账款信息"></addhead>
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{ServerReceiveableListDTO.orderNo}}</td>
          <th>状态：</th>
          <td>{{ServerReceiveableListDTO.statusText}}</td>
        </tr>
        <tr>
          <th>创建时间：</th>
          <td>{{ServerReceiveableListDTO.createTime}}</td>
          <th>付款方：</th>
          <td>{{ServerReceiveableListDTO.organizationName}}</td>
        </tr>
        <tr>
          <th>项目名称：</th>
          <td>{{ServerReceiveableListDTO.projectName}}</td>
          <th>客户名称：</th>
          <td>{{ServerReceiveableListDTO.customerName}}</td>
        </tr>
        <tr>
          <th>服务方：</th>
          <td>{{ServerReceiveableListDTO.serverName}}</td>
          <th>订单金额：</th>
          <td>{{ServerReceiveableListDTO.orderAmountText}}</td>
        </tr>
        <tr>
          <th>结算金额：</th>
          <td>{{ServerReceiveableListDTO.billAmountText}}</td>
          <th>已结算金额：</th>
          <td>{{ServerReceiveableListDTO.settledAmountText}}</td>
        </tr>
        <tr>
          <th>已认总账款：</th>
          <td>{{ServerReceiveableListDTO.amountReceivedText}}</td>
          <th>已收总账款：</th>
          <td>{{ServerReceiveableListDTO.totalAccountReceiveableText}}</td>
          <th></th>
        </tr>
        <tr>
          <th>应收总账款：</th>
          <td>{{ServerReceiveableListDTO.accountReceiveableText}}</td>
          <th></th>
          <td></td>
          <th></th>
        </tr>
      </table>
    </div>
    <div class="detailTable2">
      <addhead headname="订单开票记录"></addhead>
      <el-table
        :data="orderInvoiceRecordDTO"
        border
        stripe
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userInfo" label="发票申请人" align="center" width="230">
          <template slot-scope="scope">
            <span v-if="scope.row.userInfo">{{ scope.row.userInfo&&scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceApplicationNo" label="发票申请号" align="center" width="180"></el-table-column>
        <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码" align="center"></el-table-column>
        <el-table-column prop="invoicingTime" label="开票完成时间" align="center"></el-table-column>
        <el-table-column prop="currentAmountName" label="该订单应收金额" align="center"></el-table-column>
        <el-table-column prop="expectPaidDate" label="预计收款时间" align="center"></el-table-column>
        <el-table-column prop="AccountCreditLine" label="账期收款时间" align="center"></el-table-column>
        <el-table-column prop="statusName" label="状态" align="center" width="80"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="订单认款纪录"></addhead>
      <el-table
        :data="orderPaymentReceivedDTOList"
        border
        stripe
        v-if="orderPaymentReceivedDTOList"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userInfo" label="认款者" align="center" width="230">
          <template slot-scope="scope">{{scope.row.userInfo&&scope.row.userInfo.userFullName}}</template>
        </el-table-column>
        <el-table-column prop="paymentReceivedNo" label="回款信息编号" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" align="center" width="180"></el-table-column>
        <el-table-column prop="receivedAmountName" label="回款金额" align="center"></el-table-column>
        <el-table-column prop="currentAmountName" label="该订单认款金额" align="center"></el-table-column>
        <el-table-column prop="accountNoInfo" label="收款账号信息" align="center"></el-table-column>
        <el-table-column prop="operationName" label="状态" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="服务方收款账号信息汇总"></addhead>
      <el-table
        :data="accountPayableBankDTO"
        border
        stripe
        v-if="accountPayableBankDTO"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="accountInfo" label="服务方收款账号" align="center"></el-table-column>
        <el-table-column prop="payAmountText" label="已认账款" align="center"></el-table-column>
        <el-table-column prop="claimAmount" label="已收账款" align="center"></el-table-column>
        <el-table-column prop="noPayAmountText" label="待收账款" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="订单付款纪录"></addhead>
      <el-table
        :data="accountPayablePaymentRecordDetailDTO"
        border
        stripe
        v-if="accountPayablePaymentRecordDetailDTO"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userInfo" label="操作者" align="center">
          <template slot-scope="scope">{{scope.row.userInfo&&scope.row.userInfo.userFullName}}</template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" align="center"></el-table-column>
        <el-table-column prop= "serverAccountInfo" label="收款账号信息" align="center"></el-table-column>
        <el-table-column prop = "accountPaidText" label="付款" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="closed">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import addhead from "@/components/common/head/head";
import { getReceiveableInfo } from "@/api/finance/serverReceivable";
export default {
  inject:['close'],
  name: "ServerReceivableDetail",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      ServerReceiveableListDTO: [],
      orderInvoiceRecordDTO: [],
      orderPaymentReceivedDTOList: [],
      accountPayableBankDTO: [],
      accountPayablePaymentRecordDetailDTO: [],
    };
  },
  components: {
    addhead
  },
  created() {
    this.id = this.$route.query.id;
    this.getInfo(this.id);
  },
  activated(){
    if (this.id !== this.$route.query.id) {
      this.getInfo(this.$route.query.id);
      this.id = this.$route.query.id
    }
  },
  methods: {
    getInfo(id) {
      getReceiveableInfo(id).then(res => {
        if (res.code == "000000") {
          console.log(res, "89");
          this.orderInvoiceRecordDTO = res.data.orderInvoiceRecordDTO;
          this.ServerReceiveableListDTO = res.data.serverReceiveableListDTO;
          this.orderPaymentReceivedDTOList = res.data.orderPaymentReceivedDTOList;
          this.accountPayableBankDTO = res.data.accountPayableBankDTO;
          this.accountPayablePaymentRecordDetailDTO = res.data.accountPayablePaymentRecordDetailDTO;
        }
      });
    },
    closed() {
      this.close({name:'ServerReceivableDetail',to:{name:"ServerReceivable",params:{isUpdate:true}}});
    }
  }
};
</script>

<style lang='less' scoped>
.ReceivableDetailBox {
  width: 100%;
  padding-top: 10px;
  .detailTable1 {
    border: 1px solid #d1d1d1;
    table {
      width: 90%;
      margin: 20px auto;
      th,
      td {
        border: 1px solid #d1d1d1;
        height: 50px;
      }
      th {
        font-weight: bold;
        background: #f5f7fa;
        text-align: right;
        width: 20%;
      }
      td {
        text-align: left;
        width: 30%;
        padding-left: 10px;
      }
    }
  }
  .detailTable2 {
    border: 1px solid #d1d1d1;
    .el-table {
      margin: 20px auto;
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
      width: 90%;
      margin: 0 auto 20px;
    }
  }
}
</style>
