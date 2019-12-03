<template>
  <div class="detaillBox" ref="detaillBox">
    <div class="detaillTable" v-if="tableData">
      <addhead headname="发票信息"></addhead>
      <table border="1">
        <tr>
          <th>作废申请单编号：</th>
          <td>{{tableData.applicationNo}}</td>
          <th>开票时间：</th>
          <td>{{formatTimeDom(tableData.invoicingTime)}}</td>
        </tr>
        <tr>
          <th>发票类型：</th>
          <td>{{tableData.invoiceTypeText}}</td>
          <th>开票金额：</th>
          <td>￥{{tableData.invoiceAmount}}</td>
        </tr>
        <tr>
          <th>作废申请人：</th>
          <td>{{tableData.creatorName}}</td>
          <th>发票状态：</th>
          <td>{{tableData.invoiceRecordStatusText}}</td>
        </tr>
        <tr>
          <th>开票方：</th>
          <td>{{tableData.invoiceOfferName}}</td>
          <th>申请方：</th>
          <td>{{tableData.organizationName}}</td>
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
          <td>{{formatTimeDom(tableData.invoicingTime)}}</td>
          <th>发票链接：</th>
          <td>{{tableData.invoiceUrl}}</td>
        </tr>
        <tr>
          <th>红冲发票代码：</th>
          <td>{{tableData.redWordInvoiceCode}}</td>
          <th>红冲发票号码：</th>
          <td>{{tableData.redWordInvoiceNumber}}</td>
        </tr>

        <tr>
          <th>作废原因：</th>
          <td>{{tableData.invalidReason}}</td>
          <th>承诺退回日期：</th>
          <td>
            <span v-if="tableData.returnTime">{{tableData.returnTime |formatDate}}</span>
            <span v-else>--</span>
          </td>
        </tr>
        <tr>
          <th>状态：</th>
          <td>
            <span v-if="this.tableData.status=='UNDER_APPROVAL'">待审核</span>
            <span v-if="this.tableData.status=='REMAIN_INVOICE'">待作废</span>
            <span v-if="this.tableData.status=='REJECTED'">已驳回</span>
            <span v-if="this.tableData.status=='INVALIDING'">作废中</span>
            <span v-if="this.tableData.status=='INVALID'">已作废</span>
            <span v-if="this.tableData.status=='INVALID_FAILED'">作废失败</span>
          </td>
          <th>申请作废时间：</th>
          <td>{{formatTimeDom(tableData.createTime)}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="skulist">
      <addhead headname="结算单信息"></addhead>
      <el-table
        :data="skulist"
        border
        style="width: 90%"
        class="table"
        size="small"
        max-height="400"
      >
        <el-table-column prop="no" label="订单编号" align="center">
          <!-- <template slot-scope="scope">
            <el-button
              @click="oepnWin('',{ id: scope.row })"
              type="text"
              size="small"
            >{{scope.row}}</el-button>
          </template>-->
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center" width="90px" >
          <template slot-scope="scope">{{formatTimeDom(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column prop="statusText" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="amount" label="订单金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="settledAmount" label="已结算金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column
          prop="currentAmount"
          label="本次结算金额"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column
          prop="invoiceAmount"
          label="本次开票金额"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column
          prop="firstServerFeeAmount"
          label="服务方服务费"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column prop="firstServerFee" label="服务费率" align="center"></el-table-column>
        <el-table-column
          prop="partyCServiceFeeAmount"
          label="第三方平台费"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column prop="partyCServiceFeeRate" label="平台费率" align="center"></el-table-column>
      </el-table>
      <div class="infoTotal">
        <p>结算总金额：¥{{skuTotalBillAmount}}</p>
        <p>明细总金额：¥{{skuTotalAmount}}</p>
      </div>
    </div>
    <div class="detaillTable" v-if="invoicelist">
      <addhead headname="发票明细"></addhead>
      <el-table
        :data="invoicelist"
        border
        style="width: 90%"
        class="table"
        size="small"
        max-height="400"
      >
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="型号" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="currentQty" label="数量" align="center"></el-table-column>
        <el-table-column prop="taxRate" label="税率" align="center"></el-table-column>
        <el-table-column prop="billAmount" label="价税合计" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="taxCode" label="税收分类编码" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detaillTable2 clear" style="margin-bottom:35px;">
      <addhead headname="操作记录"></addhead>
      <el-table :data="tableLog" border style="width:90%;" size="small" max-height="400">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationText" label="操作描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button
          type="primary"
          @click="close({name:'InvoiceInvalidDetail', to: {name:'Invalidapplication'}})"
        >关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getBillAppdetail } from "@/api/finance/invoiceInvalids";
import addhead from "@/components/common/head/head";
import { parseTime, returnFloat } from "@/utils/index";

export default {
  inject: ["close"],
  name: "InvoiceInvalidDetail",
  data() {
    return {
      id: this.$route.query.id,
      tableData: [{ demo: "领先未来" }, { demo: "领先未来" }],
      tableLog: null,
      skulist: [{ demo: "领先未来" }],
      invoicelist: [{ demo: "领先未来" }]
    };
  },
  mounted() {
    this.init();
  },
  activated() {
    if (this.$route.query.id != this.id) {
      this.init();
    }
  },
  components: {
    addhead
  },
  computed: {
    skuTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return sum + item.invoiceAmount;
      }, 0);
    },
    skuTotalBillAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return sum + item.currentAmount;
      }, 0);
    }
  },
  methods: {
    init() {
      this.id = this.$route.query.id;
      this.getdata(this.id);
    },
    getdata(id) {
      getBillAppdetail(id).then(res => {
        console.log(res);
        this.tableData = res.data.invoiceInvalidApplicationDTO;
        this.skulist = res.data.invoiceRecordOrderDetailDTOList;
        this.invoicelist = res.data.invoiceRecordBillOrderDTOList;
        this.tableLog = res.data.logDTOList;
      });
    },
    oepnWin(name, query) {
      this.$router.push({ name: name, query: query });
    },
    formatTime(row, col, cellValue) {
      return parseTime(cellValue);
    },
    formatTimeDom(t) {
      return parseTime(t);
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    }
  },
  filters: {
    //时间截取字符串
    formatDate: function(val) {
      var dateee = new Date(val).toJSON();
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .el-steps {
    margin: 20px 0;
  }
  .detaillTable {
    border: 1px solid #d1d1d1;
    table {
      width: 90%;
      margin: 20px auto;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 12px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        padding-right: 6px;
        box-sizing: border-box;
        color: #666;
        font-weight: 700;
        font-size: 14px;
        text-align: right;
        width: 20%;
        background-color: #f9fafc;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 30%;
        line-height: 20px;
        span {
          margin-right: 10px;
          display: inline-block;
        }
      }
      .tit {
        text-align: left;
        padding-left: 10px;
      }
    }
    dl {
      margin: 30px;
      dt {
        float: left;
        width: 100px;
      }
      dd {
        overflow: hidden;
        p {
          width: 100px;
          height: 100px;
          padding: 10px;
          margin-right: 20px;
          border: 1px solid #eee;
          float: left;
          img {
            width: 100%;
            display: block;
          }
        }
      }
    }
    .table {
      width: 90%;
      margin: 20px auto;
      border: 1px solid #ccc;
      border-right: none;
      h4 {
        padding-left: 10px;
        background-color: #f9fafc;
        line-height: 40px;
        border-right: 1px solid #ccc;
      }
      dl {
        background-color: #f9fafc;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0;
        dt {
          box-sizing: border-box;
          flex: 0 1 25%;
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
          line-height: 40px;
          padding-left: 10px;
        }
        dd {
          box-sizing: border-box;
          flex: 0 1 25%;
          background-color: #fff;
          line-height: 40px;
          padding-left: 10px;
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
      }
    }
    .infoTotal {
      height: 60px;
      width: 95%;
      line-height: 24px;
      text-align: right;
    }
  }
  .detaillTable2 {
    border: 1px solid #d1d1d1;
    border-top: none;
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
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