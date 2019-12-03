<template>
  <div class="detaillBox">
    <div class="detailTable">
      <addhead headname="应付账款信息"></addhead>
      <table border="1" v-if="tableData">
        <tr>
          <th>订单号：</th>
          <td>{{tableData.orderNo}}</td>
          <th>创建时间：</th>
          <td>{{tableData.createTime}}</td>
        </tr>
        <tr>
          <th>所属组织机构：</th>
          <td>{{tableData.organizationName}}</td>
          <th>项目名称：</th>
          <td>{{tableData.projectName}}</td>
        </tr>
        <tr>
          <th>客户名称：</th>
          <td>{{tableData.customerName}}</td>
          <th>服务方：</th>
          <td>{{tableData.serverName}}</td>
        </tr>
        <tr>
          <th>订单金额：</th>
          <td>{{tableData.orderAmountText}}</td>
          <th>结算金额：</th>
          <td colspan="3">{{tableData.billAmountText}}</td>
        </tr>
        <tr>
          <th>已结算金额：</th>
          <td>{{tableData.settledAmountText}}</td>
          <th>已开票金额：</th>
          <td>{{tableData.amountInvoicedText}}</td>
        </tr>
        <tr>
          <th>已收账款：</th>
          <td>{{tableData.amountReceivedText}}</td>
          <th>已付账款：</th>
          <td>{{tableData.totalAccountPaidText}}</td>
        </tr>
        <tr>
          <th>应付账款：</th>
          <td>{{tableData.accountPayableText}}</td>
          <th>状态：</th>
          <td>{{tableData.statusText}}</td>
        </tr>
      </table>
    </div>
    <div class="detailTable2">
      <addhead headname="订单开票记录"></addhead>
      <el-table
        :data="orderInvoiceRecordDTO"
        border
        stripe
        v-if="orderInvoiceRecordDTO"
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
        <el-table-column prop="invoicingTime" label="开票完成时间" align="center" width="180"></el-table-column>
        <el-table-column prop="invoiceAmountName" label="开票金额" align="center"></el-table-column>
        <el-table-column prop="currentAmountName" label="该订单应收金额" align="center"></el-table-column>
        <el-table-column prop="expectPaidDate" label="预计收款时间" align="center"></el-table-column>
        <el-table-column prop="AccountCreditLine" label="账期收款时间" align="center"></el-table-column>
        <el-table-column prop="statusName" label="状态" align="center" width="80"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="应付核销记录"></addhead>
      <el-table
        :data="accountPayablePaymentRecordDetailDTO"
        border
        stripe
        v-if="accountPayablePaymentRecordDetailDTO"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userName" label="操作者" style="width: 33%" align="center">
          <template slot-scope="scope">{{ scope.row.userInfo&&scope.row.userInfo.userFullName}}</template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="serverAccountInfo" label="收款账号信息" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="accountPaidText" label="核销金额" style="width: 33%" align="center"></el-table-column>
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
        <el-table-column prop="claimAmount" label="已收账款" align="center"></el-table-column>
        <el-table-column prop="payAmountText" label="已付账款" align="center"></el-table-column>
        <el-table-column prop="noPayAmountText" label="已认款未支付账款" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detailTable2">
      <addhead headname="操作"></addhead>
      <el-table
        :data="accountPayableOperationLogDTO"
        border
        stripe
        v-if="accountPayableOperationLogDTO"
        size="small"
        style="width: 90%"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userFullName" label="操作者" align="center">
          <!-- <template slot-scope="scope">{{scope.row.userInfo&&scope.row.userInfo.userFullName}}</template> -->
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="operationText" label="操作事项" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-back-top>返回顶部</el-button>
        <el-button type="primary" @click="closed">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { getDetail } from "@/api/finance/accountsPayable.js";
import { timeFormat } from "@/utils/index";
export default {
  inject: ["close"],
  name: "AccountsPayableDetail",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      tableData: null,
      accountPayableBankDTO: null,
      accountPayablePaymentRecordDetailDTO: null,
      orderInvoiceRecordDTO: null,
      accountPayableOperationLogDTO: null
    };
  },
  components: {
    addhead
  },
  created() {
    this.id = this.$route.query.id;
    this.findDetail(this.id);
  },
  activated() {
    if (this.id !== this.$route.query.id) {
      this.findDetail(this.$route.query.id);
      this.id = this.$route.query.id;
    }
  },
  methods: {
    findDetail(id) {
      getDetail(id).then(res => {
        this.tableData = res.data.accountPayableListDTO;
        this.orderInvoiceRecordDTO = res.data.orderInvoiceRecordDTO;
        this.accountPayablePaymentRecordDetailDTO = res.data.accountPayablePaymentRecordDetailDTO;
        this.accountPayableBankDTO = res.data.accountPayableBankDTO;
        this.accountPayableOperationLogDTO = res.data.accountPayableOperationLogDTO;
        console.log(this.orderInvoiceRecordDTO,this.accountPayableOperationLogDTO);
      });
    },
    closed() {
      this.close({name:'AccountsPayableDetail',to:{name:"AccountsPayableList",params:{isUpdate:true}}});
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .detailTable {
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


