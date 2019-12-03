<template>
  <div class="ReceivableDetailBox">
    <div class="detailTable1">
      <addhead headname="应收账款信息"></addhead>
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderNo}}</td>
          <th>状态：</th>
          <td>{{statusText}}</td>
        </tr>
        <tr>
          <th>创建时间：</th>
          <td>{{createTime}}</td>
          <th>所属组织机构：</th>
          <td>{{organizationName}}</td>
        </tr>
        <tr>
          <th>项目名称：</th>
          <td>{{projectName}}</td>
          <th>客户名称：</th>
          <td>{{customerName}}</td>
        </tr>
        <tr>
          <th>服务方：</th>
          <td>{{serverName}}</td>
          <th>订单金额：</th>
          <td>{{orderAmountText}}</td>
        </tr>
        <tr>
          <th>结算金额：</th>
          <td>{{billAmountText}}</td>
          <th>已结算金额：</th>
          <td>{{settledAmountText}}</td>
        </tr>
        <tr>
          <th>已开票金额：</th>
          <td>{{amountInvoicedText}}</td>
          <th>已收总账款：</th>
          <td>{{amountReceivedText}}</td>
        </tr>
        <tr>
          <th>应收总账款：</th>
          <td>{{accountReceiveableText}}</td>
          <th></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="detailTable2">
      <addhead headname="订单开票记录"></addhead>
      <el-table
        :data="tableData1"
        border
        stripe
        v-if="tableData1"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userInfo" label="发票申请人" align="center" width="250">
          <template slot-scope="scope">{{scope.row.userInfo&&scope.row.userInfo.userFullName}}</template>
        </el-table-column>
        <el-table-column prop="invoiceApplicationNo" label="发票申请号" align="center"></el-table-column>
        <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码" align="center"></el-table-column>
        <el-table-column prop="invoicingTime" label="开票时间" align="center" width="180"></el-table-column>
        <el-table-column prop="invoiceAmountName" label="开票金额" align="center"></el-table-column>
        <el-table-column prop="currentAmountName" label="该订单应收金额" align="center"></el-table-column>
        <el-table-column prop="expectPaidDate" label="预计收款时间" align="center"></el-table-column>
        <el-table-column prop="AccountCreditLine" label="账期收款时间" align="center"></el-table-column>
        <el-table-column prop="statusName" label="状态" align="center" width="80"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="订单应收核销纪录"></addhead>
      <el-table
        :data="tableData2"
        border
        stripe
        v-if="tableData2"
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
        <el-table-column prop="accountNoInfo" label="服务方收款账号信息" align="center"></el-table-column>
        <el-table-column prop="operationName" label="状态" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="服务方收款账号认款汇总"></addhead>
      <el-table
        :data="accountNoInfoDTOList"
        border
        stripe
        v-if="accountNoInfoDTOList"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="accountInfo" label="服务方收款账号" align="center"></el-table-column>
        <el-table-column prop="claimAmount" label="账号下已收账款" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="操作"></addhead>
      <el-table
        :data="accountOperationLogDTOList"
        border
        stripe
        v-if="accountOperationLogDTOList"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userInfo" label="操作者" align="center">
          <template slot-scope="scope">{{scope.row.userInfo&&scope.row.userInfo.userFullName}}</template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="operationText" label="操作事项" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="closeed">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import addhead from "@/components/common/head/head";
import { getReceiveableInfo } from "@/api/finance/receivable";
export default {
  inject: ["close"],
  name: "ReceivableDetail",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      tableData1: [],
      tableData2: [],
      accountOperationLogDTOList: [],
      accountNoInfoDTOList: [],
      orderNo: null, //订单号
      accountReceiveableText: "",
      amountInvoicedText: "", //已开票金额
      amountReceivedText: "", //已收账款
      billAmountText: "", //结算金额
      createTime: "", //创建时间
      customerName: "", //客户名称
      orderAmountText: "", //订单总金额
      orderId: "", //订单id
      organizationName: "", //开票方名称
      projectName: "", //项目名称
      serverName: "", //服务方名称
      settledAmountText: "", //已结算金额
      statusText: "",

      accountNoInfoDTOList: []
    };
  },
  components: {
    addhead
  },
  created() {
    this.id = this.$route.query.id;
    // console.log("999999999999999999" + this.id);
    this.getInfo(this.id);
  },
  activated() {
    if (this.id !== this.$route.query.id) {
      this.getInfo(this.$route.query.id);
      this.id = this.$route.query.id
    }
  },
  methods: {
    getInfo(id) {
      getReceiveableInfo(id).then(res => {
        console.log(res);
        if (res.code == "000000") {
          this.accountReceiveableText = res.data.accountReceiveableText;
          this.orderId = res.data.orderId;
          this.orderNo = res.data.orderNo;
          this.createTime = res.data.createTime;
          this.projectName = res.data.projectName;
          this.serverName = res.data.serverName;
          this.customerName = res.data.customerName;
          this.amountInvoicedText = res.data.amountInvoicedText;
          this.amountReceivedText = res.data.amountReceivedText;
          this.statusText = res.data.statusText;
          this.billAmountText = res.data.billAmountText;
          this.orderAmountText = res.data.orderAmountText;
          this.organizationName = res.data.organizationName;
          this.settledAmountText = res.data.settledAmountText;

          this.tableData1 = res.data.orderInvoiceRecordDTOList;
          this.tableData2 = res.data.orderPaymentReceivedDTOList;
          this.accountNoInfoDTOList = res.data.accountNoInfoDTOList;
          this.accountOperationLogDTOList = res.data.accountOperationLogDTOList;
        }
      });
    },
    closeed() {
      this.close({name:'ReceivableDetail',to:{name:'Receivable',params:{isUpdate:true}}});
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
