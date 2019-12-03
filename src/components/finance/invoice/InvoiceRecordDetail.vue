<template>
  <div class="detaillBox" ref="detaillBox">
    <div class="detaillTable" v-if="tableData">
      <addhead headname="发票信息"></addhead>
      <table border="1">
        <tr>
          <th>发票申请单编号：</th>
          <td>{{tableData.invoiceApplicationNo}}</td>
          <th>申请时间：</th>
          <td>{{tableData.createTime}}</td>
        </tr>
        <tr>
          <th>发票类型：</th>
          <td>{{{0:'专票',1:'普票',2:'电子发票'}[tableData.invoiceType]}}</td>
          <th>开票金额：</th>
          <td>￥{{tableData.invoiceAmount}}</td>
        </tr>
        <tr>
          <th>发票申请人：</th>
          <td>
            {{tableData.creatorName}}
          </td>
          <th>发票邮寄状态：</th>
          <td>{{tableData.postStatusText}}</td>
        </tr>
        <tr>
          <th>开票方：</th>
          <td>
            {{tableData.invoiceOfferName}}
          </td>
          <th>服务方：</th>
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
          <th>作废原因：</th>
          <td>{{tableData.invalidReason}}</td>
          <th>发票备注：</th>
          <td>{{tableData.memo}}</td>
        </tr>
        <tr>
          <th>红冲发票号码：</th>
          <td>{{tableData.redWordInvoiceNumber}}</td>
          <th>邮寄信息：</th>
          <td>{{tableData.expressCompany}}-{{tableData.expressNumber}}</td>
        </tr>
        <tr>
          <th>红冲发票代码：</th>
          <td colspan="3">{{tableData.redWordInvoiceCode}}</td>
        </tr>
        <tr>
          <th>发票图片：</th>
          <td colspan="3"><img :src="tableData.filePathDTO && tableData.filePathDTO.path"></td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="skulist">
      <addhead headname="订单信息"></addhead>
      <el-table :data="skulist" border style="width: 90%" class="table" size="small">
        <el-table-column prop="no" label="订单编号" align="center">
          <template slot-scope="scope">
            <el-button
              @click="oepnWin('OrderDetail',{ id: scope.row.orderId })"
              type="text"
              size="small"
            >{{scope.row.no}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center" :formatter="formatTime"></el-table-column>
        <el-table-column prop="statusText" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="amount" label="订单金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="settledAmount" label="已结算金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="currentAmount" label="本次结算金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="invoiceAmount" label="本次开票金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="firstServerFeeAmount" label="服务商服务费" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="firstServerFee" label="服务费率" align="center"></el-table-column>
        <el-table-column prop="partyCServiceFeeAmount" label="第三方平台费" align="center"></el-table-column>
        <el-table-column prop="partyCServiceFeeRate" label="平台费率" align="center"></el-table-column>
      </el-table>
      <div class="infoTotal">
        <p>结算总金额：¥{{skuTotalBillAmount}}</p>
        <p>明细总金额：¥{{skuTotalAmount}}</p>
      </div>
    </div>
    <div class="detaillTable detaillTable2" v-if="invoicelist" style="margin-bottom:35px;">
      <addhead headname="发票明细"></addhead>
      <el-table :data="invoicelist" border style="width: 90%" class="table" size="small">
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="型号" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <!-- <el-table-column prop="billPrice" label="单价" align="center"></el-table-column> -->
        <el-table-column prop="currentQty" label="数量" align="center"></el-table-column>
        <el-table-column prop="taxRate" label="税率" align="center"></el-table-column>
        <el-table-column prop="billAmount" label="金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="taxCode" label="税收分类编码" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
    <!-- <div class="detaillTable2 clear" style="margin-bottom:35px;">
      <addhead headname="结算单流程"></addhead>
      <el-table :data="tableLog" border style="width:90%;" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationName" label="操作描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div> -->

  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { parseTime, returnFloat } from "@/utils/index";
import { getInvoiceDetails } from "@/api/payment/invoice";

export default {
  inject: ["close"],
  name:'InvoiceRecordDetail',
  data() {
    return {
      orderId: "",
      step: 1,
      tableData: {
        orderServerDTO:null
      },
      tableLog: null,
      skulist: [],
      invoicelist:[]
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.id){
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
    init(){
      this.id = this.$route.query.id;
      this.getdata();
    },
    getdata() {
      getInvoiceDetails(this.id).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.invoiceRecordDTO;
          this.skulist = res.data.invoiceRecordOrderDetailDTOList;
          this.invoicelist = res.data.invoiceRecordBillOrderDTOList;
          this.tableLog = res.data.invoiceRecordOperationLogDTOList;
        }
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
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
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