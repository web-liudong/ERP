<template>
  <div class="PurchaseInvoiceDetail">
    <div class="detailTable1">
      <addhead headname="发票信息"></addhead>
      <table border="1">
        <tr>
          <th>发票申请编号：</th>
          <td>{{tableData.applicationNo}}</td>
          <th>申请时间：</th>
          <td>{{tableData.applyTime}}</td>
        </tr>
        <tr>
          <th>发票类型：</th>
          <td>{{{'VAT_INVOICE':'专票', 'PLAIN_INVOICE':'普票', 'ELECTRONIC_INVOICE':'电子发票'}[tableData.invoiceType]}}</td>
          <th>开票金额：</th>
          <td>￥{{tableData.invoiceAmount}}</td>
        </tr>
        <tr>
          <th>发票申请人：</th>
          <td>{{tableData.creatorName}}</td>
          <th>发票状态：</th>
          <td>{{{'PENDING_DELIVERY':'待邮寄' , 'DELIVERY':'配送中', 'COMPLETED':'已完成'}[tableData.postStatus]}}</td>
        </tr>
        <tr>
          <th>开票方：</th>
          <td>{{tableData.organizationName}}</td>
          <th>伙伴：</th>
          <td>{{tableData.partnerName}}</td>
        </tr>
        <tr>
          <th>税务登记号：</th>
          <td>{{tableData.socialCreditCode}}</td>
          <th>发票抬头：</th>
          <td>{{tableData.invoiceTitle}}</td>
        </tr>
        <tr>
          <th>发票电话：</th>
          <td>{{tableData.phoneOnInvoice}}</td>
          <th>发票地址：</th>
          <td>{{tableData.addressOnInvoice}}</td>
        </tr>
        <tr>
          <th>发票号码：</th>
          <td>{{tableData.invoiceNumber}}</td>
          <th>发票代码：</th>
          <td>{{tableData.invoiceCode}}</td>
        </tr>
        <tr>
          <th>开票时间：</th>
          <td>{{tableData.invoicingTime}}</td>
          <th>发票链接：</th>
          <td>{{tableData.invoiceUrl}}</td>
        </tr>
        <tr>
          <th>作废原因：</th>
          <td>{{tableData.invalidReason}}</td>
          <th>发票备注：</th>
          <td>{{tableData.invoiceMemo}}</td>
        </tr>
        <tr>
          <th>红冲发票号码：</th>
          <td>{{tableData.redWordInvoiceNumber}}</td>
          <th>邮寄信息：</th>
          <td>
            {{tableData.expressCompany}}
            <span v-if="tableData.expressCompany">-</span>
            {{tableData.expressNumber}}
          </td>
        </tr>
        <tr>
          <th>红冲发票代码：</th>
          <td>{{tableData.redWordInvoiceCode}}</td>
          <th></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="detailTable2">
      <addhead headname="结算单信息"></addhead>
      <el-table
        :data="centralPurchaseBillList"
        border
        stripe
        style="width: 90%"
        :header-cell-style="tableStyle"
        max-height="200px"
      >
        <el-table-column prop="billNo" label="结算单编号" align="center"></el-table-column>
        <el-table-column prop="name" label="结算单名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="amountText" label="结算单金额" align="center"></el-table-column>
        <el-table-column prop="creatorName" label="制单人" align="center"></el-table-column>
      </el-table>
      <div class="price">
        <span style="margin-right: 20px;">结算总金额：¥{{billAmount}}</span>
        <span>明细总金额：¥{{productAmount}}</span>
      </div>
    </div>
    <div class="detailTable2">
      <addhead headname="发票明细"></addhead>
      <el-table
        :data="itemDetailLIst"
        border
        stripe
        style="width: 90%"
        :header-cell-style="tableStyle"
        max-height="200px"
      >
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="skuModel" label="型号" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="currentQty" label="数量" align="center"></el-table-column>
        <el-table-column prop="currentTaxRate" label="税率" align="center"></el-table-column>
        <el-table-column prop="amount" label="税价合计" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="taxCode" label="税收分类编码" align="center"></el-table-column>
        <el-table-column prop="taxName" label="简称" align="center"></el-table-column>
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
import { getRecordDetail } from "@/api/finance/collectionInvoice";
import { parseTime, returnFloat } from "@/utils/index";
export default {
  inject: ["close"],
  name: "CollectionInvoiceDetail",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      id: null,
      tableData: {},
      itemDetailLIst: [],
      centralPurchaseBillList: [],
      billAmount: null,
      productAmount: null
    };
  },
  components: {
    addhead
  },
  created() {
    this.id = this.$route.query.id;
    this.getInfo(this.$route.query.id);
  },
  activated() {
    if (this.id !== this.$route.query.id) {
      this.getInfo(this.$route.query.id);
      this.id = this.$route.query.id;
    }
  },
  methods: {
    getInfo(id) {
      getRecordDetail(id).then(res => {
        console.log(res, "9999");
        this.tableData = res.data.centralPurchaseINVRecordInfoDTO;
        this.billAmount = res.data.billAmount; //结算总金额
        this.productAmount = res.data.productAmount; //发票明细总金额
        this.itemDetailLIst = res.data.itemDetailLIst;
        this.centralPurchaseBillList = res.data.centralPurchaseBillList;
      });
    },
    closeed() {
      this.close({
        name: "CollectionInvoiceDetail",
        to: { name: "CollectionInvoice", params: { isUpdate: true } }
      });
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    }
  }
};
</script>

<style lang='less' scoped>
.PurchaseInvoiceDetail {
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
    border-top: none;
    margin: 0 0 -1px 0;
    .el-table {
      margin: 20px auto;
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
      width: 90%;
      margin: 0 auto 20px;
    }
    .price {
      width: 100%;
      font-size: 18px;
      margin: 10px 30px;
    }
  }
}
</style>
