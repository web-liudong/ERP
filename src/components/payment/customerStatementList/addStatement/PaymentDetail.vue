<template>
  <div class="detaillBox" ref="detaillBox">
    <div class="detaillTable" v-if="tableData">
      <addhead headname="结算单信息"></addhead>
      <table border="1">
        <tr>
          <th>结算单编号：</th>
          <td>{{tableData.billNo}}</td>
          <th>结算单名称：</th>
          <td>{{tableData.name}}</td>
        </tr>
        <tr>
          <th>创建时间：</th>
          <td>{{tableData.createTime}}</td>
          <th>结算单状态：</th>
          <td>{{tableData.statusName}}</td>
        </tr>
        <tr>
          <th>关联项目：</th>
          <td>{{tableData.projectName}}</td>
          <th>关联客户：</th>
          <td>{{tableData.customerName}}</td>
        </tr>
        <tr>
          <th>制单员：</th>
          <td>{{tableData.makerUserName}}</td>
          <th>结算金额：</th>
          <td>{{formatPrice(0, 0, tableData.amount)}}</td>
        </tr>
        <tr>
          <th>关联服务方：</th>
          <td>{{tableData.serverName}}</td>
          <th>结算单备注：</th>
          <td>{{tableData.memo}}</td>
        </tr>
        <tr>
          <th>驳回原因：</th>
          <td colspan="3">{{tableData.rejectReason}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="skulist">
      <addhead headname="订单信息"></addhead>
      <el-table :data="skulist" border style="width: 90%" class="table" size="small">
        <el-table-column prop="no" label="订单编号" align="center" width="140">
            <template slot-scope="scope">
              <el-button
                @click="oepnWin('OrderDetail',{ id: scope.row.orderId })"
                type="text"
                size="small"
              >{{scope.row.no}}</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="assignTime" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="finishTime" label="完成时间" align="center"></el-table-column>
        <el-table-column prop="deliveryStatusName" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="amount" label="订单金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="alreadyTotal" label="已结算金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="currentAmount" label="本次结算金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="customerUserName" label="下单人" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detaillTable" v-if="invoicelist">
      <addhead headname="开票明细">
        <template slot="append">
          <div class="button-head" @click="exportFile()">
            <i class="el-icon-tickets button-head-icon"></i>导出
          </div>
        </template>
      </addhead>
      <el-table :data="invoicelist" border style="width: 90%" class="table" size="small">
        <el-table-column prop="no" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="currentQty" label="开票数量" align="center"></el-table-column>
        <el-table-column prop="invoicePrice" label="开票单价" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="amount" label="开票总金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="skuModel" label="型号" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="taxCode" label="税收分类编码" align="center"></el-table-column>
      </el-table>
      <div class="infoTotal">
        <p>结算单总金额：¥{{tableData.amount}}</p>
      </div>
    </div>
    <div class="detaillTable2 clear" style="margin-bottom:35px;">
      <addhead headname="结算单流程"></addhead>
      <el-table :data="tableLog" border style="width:90%;" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  getBillDetail,
  getBillItemDetail,
  exportBillDetail
} from "@/api/payment/invoice";
import { returnFloat } from "@/utils/index";

export default {
  inject: ["close"],
  name:"PaymentDetail",
  data() {
    return {
      billId: "",
      step: 1,
      tableData: {},
      query: {
        pageNum: 1,
        pageSize: 1000
      },
      tableLog: null,
      skulist: [],
      invoicelist: []
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.billId){
      this.init();
    }
  },
  components: {
    addhead
  },
  methods: {
    init(){
      this.billId = this.$route.query.id;
      this.getdata();
      this.getDetailItem();
    },
    getdata() {
      getBillDetail(this.billId).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data;
          this.skulist = res.data.orderDetailDTOs;
          this.tableLog = res.data.operationLogs;
        }
      });
    },
    getDetailItem() {
      getBillItemDetail(this.billId, this.query).then(res => {
        if (res.code == "000000") {
          this.invoicelist = res.data;
        }
      });
    },
    oepnWin(name, query) {
      this.$router.push({name : name, query : query});
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    downfile(data) {
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/xls" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "订单信息及开票明细.xls");
      document.body.appendChild(link);
      link.click();
    },
    exportFile() {
      exportBillDetail({"billId":this.billId}).then(res => {
        this.downfile(res);
      });
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
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
    position: relative;
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
    .button-head {
      width: 80px;
      height: 30px;
      margin-right: 10px;
      border: 1px solid #d1d1d1;
      cursor: pointer;
      background-color: #fff;
      line-height: 30px;
      border-radius: 3px;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 0;
      text-align: center;
      .button-head-icon {
        margin-right: 5px;
      }
    }
    .button-head:hover {
      color: #339999;
      border-color: #c2e0e0;
      background-color: #ebf5f5;
    }
  }
  .detaillTable2 {
    border: 1px solid #d1d1d1;
    border-top: none;
    position: relative;
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