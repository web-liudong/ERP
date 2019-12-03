<template>
  <div class="demandDetail">
    <div class="topDetail">
      <div class="top">
        <div class="topLeft">
          <i class="iconfont iconsousuo"></i>
          <span>基本信息</span>
        </div>
      </div>
      <div class="bottom">
        <table>
          <tr>
            <th>结算单编号：</th>
            <td>{{billDTO.billNo}}</td>
            <th>创建日期：</th>
            <td>{{billDTO.createTime}}</td>
            <th>结算单名称：</th>
            <td>{{billDTO.name}}</td>
          </tr>
          <tr>
            <th>总金额：</th>
            <td>{{'￥'+billDTO.amount}}</td>
            <th>供应商：</th>
            <td>{{billDTO.supplierName}}</td>
            <th>付款类型：</th>
            <td
              class="td1"
            >{{billDTO.paymentMode=="PAY_IN_ADVANCE"? '预付': billDTO.paymentMode=="NO_PAY_IN_ADVANCE"? '非预付': ''}}</td>
            <th class="th1">预付比例：</th>
            <td>{{billDTO.scale}}</td>
          </tr>
          <tr>
            <th>预付金额：</th>
            <td>{{'￥'+billDTO.prepaidAmount}}</td>
            <th>结算单状态：</th>
            <td>{{billDTO.statusText}}</td>
            <th>供应商开户行：</th>
            <td>{{billDTO.bank}}</td>
          </tr>
          <tr>
            <th>开户行账号：</th>
            <td>{{billDTO.accountNo}}</td>
            <th>供应商开户名：</th>
            <td style="width:200px">{{billDTO.accountName}}</td>
            <th>备注：</th>
            <td>{{billDTO.memo}}</td>
          </tr>
          <tr>
            <th>驳回原因：</th>
            <td>{{billDTO.rejectedReason}}</td>
            <th>制单员：</th>
            <td>{{billDTO.creatorName}}</td>
            <th></th>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="middleDetail">
      <div class="top">
        <i class="iconfont icon-liebiao">数据列表</i>
        <!-- <el-button size="small" @click="exportList()">
          <i class="iconfont icon-export"></i>
          <span>导出</span>
        </el-button>-->
      </div>
      <div class="bottom">
        <div class="dataList" v-for="(item,index) in orderInfoDTOList" :key="index">
          <div class="ListTop">
            <i class="iconfont icon-liebiao"></i>
            <span>数据列表</span>
            <span>采购单编号：{{item.purchaseOrderNo}}</span>
            <span>总金额：￥{{item.amount}}</span>
            <span>是否含税：{{item.includeTaxText}}</span>
            <span>配送方式：{{item.deliveryTypeText}}</span>
            <!-- <span>下载到货凭证</span> -->
            <el-button
              v-if="item.deliveryTypeText=='厂直'&&item.cargoReceiptFileIdList!=null"
              size="small"
              @click="downloadFileWarehouse(item.cargoReceiptFileIdList)"
            >下载到货凭证</el-button>
          </div>
          <el-table
            :data="item.purchaseOrderItemDTOList"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="tableStyle"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
            <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center"></el-table-column>
            <el-table-column prop="currentQty" label="结算数量" align="center"></el-table-column>
            <el-table-column prop="purchasePrice" label="采购单价" align="center">
              <template slot-scope="scope">
                <span>￥</span>
                {{scope.row.purchasePrice}}
              </template>
            </el-table-column>
            <el-table-column prop="currentPrice" label="结算单价" align="center">
              <template slot-scope="scope">
                <span>￥</span>
                {{scope.row.currentPrice}}
              </template>
            </el-table-column>
            <el-table-column prop="taxText" label="税率" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.taxText}}</span>
                <!-- <span>%</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="currentTaxRateText" label="本次结算税率" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.currentTaxRateText}}</span>
                <!-- <span>%</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="taxDifferential" label="税差" align="center"></el-table-column>
            <el-table-column prop="invoiceNo" label="结算发票号码" align="center"></el-table-column>
            <el-table-column prop="amount" label="小计" align="center">
              <template slot-scope="scope">
                <span>￥</span>
                {{scope.row.amount}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomDetail" v-for="item in invoiceDTOList" :key="item.id">
        <div class="top">
          <div class="topLeft">
            <i class="iconfont iconsousuo"></i>
            <span>发票1</span>
            <span>状态： {{item.statusText}}</span>
          </div>
        </div>
        <div class="bottom">
          <table>
            <tr>
              <th>业务类型：</th>
              <td>采购</td>
              <th>发票类型：</th>
              <td>{{item.invoiceType}}</td>
            </tr>
            <tr>
              <th>发票代码：</th>
              <td>{{item.invoiceCode}}</td>
              <th>发票号码：</th>
              <td>{{item.invoiceNumber}}</td>
            </tr>
            <tr>
              <th>开票日期：</th>
              <td>{{item.invoiceDate}}</td>
              <th>校验码（后6位）：</th>
              <td>{{item.checkCode}}</td>
            </tr>
            <tr>
              <th>购买方名称：</th>
              <td>{{item.organizationName}}</td>
              <th>销售方名称：</th>
              <td>{{item.supplierName}}</td>
            </tr>
            <tr>
              <th>发票税额：</th>
              <td>{{item.taxAmount}}</td>
              <th>发票金额：</th>
              <td>{{item.amount}}</td>
            </tr>
            <tr>
              <th>价税合计：</th>
              <td>{{item.pricePlusTaxes}}</td>
              <th>制单日期：</th>
              <td>{{item.createTime}}</td>
            </tr>
            <tr>
              <th>制单人：</th>
              <td>{{item.creatorName}}</td>
              <th>受理人：</th>
              <td>{{item.receiverName}}</td>
            </tr>
            <tr>
              <th>发票附件：</th>
              <!-- <td @click="downLoad(item.attachment)" v-if="item.attachment">{{item.attachmentName}}</td> -->
              <el-button
                size="small"
                @click="downloadFile(item.attachment)"
                v-if="item.attachment"
              >下载发票附件</el-button>
              <th>驳回原因：</th>
              <td>{{item.rejectedReason}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="bottomPay">
        <addhead headname="付款记录"></addhead>
        <el-table
          :data="billDetailPaymentRecordDTOList"
          border
          stripe
          size="small"
          style="width: 90%"
          :header-cell-style="tableStyle"
        >
          <el-table-column prop="id" label="操作者" align="center" width="380">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.userPosts[0].organizationName}}</span>
              <span>></span>
              <span>{{scope.row.userInfo.userPosts[0].departmentName}}</span>
              <span>></span>
              <span>{{scope.row.userInfo.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paymentTime" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="accountPaid" label="付款金额" align="center">
            <template slot-scope="scope">
              <span>￥</span>
              {{scope.row.accountPaid}}
            </template>
          </el-table-column>
          <el-table-column prop="accountNoPaid" label="付款银行账号" align="center"></el-table-column>
          <el-table-column prop="bankSerialNumber" label="银行流水号" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- <div class="bottomPay">
        <addhead headname="操作日志"></addhead>
        <el-table
          :data="billOperationLogDTOList"
          border
          stripe
          size="small"
          style="width: 90%"
          :header-cell-style="tableStyle"
        >
          <el-table-column prop="userInfo" label="操作者" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.userPosts[0].organizationName}}</span>
              <span>></span>
              <span>{{scope.row.userInfo.userPosts[0].departmentName}}</span>
              <span>></span>
              <span>{{scope.row.userInfo.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operationTime" label="操作时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.operationTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="操作描述" align="center"></el-table-column>
        </el-table>
      </div>-->
    </div>
    <div class="button-box">
      <el-button type="primary" @click="passPuchaseBill()">通过</el-button>
      <el-button type="primary" @click="rejectBill()">驳回</el-button>
    </div>
    <rejectPurchaseBill ref="RejectPurchaseBill" @callback="callback()"></rejectPurchaseBill>
  </div>
</template>

<script>
import {
  getPurchaseDetail,
  exportPurchaseDetail,
  submitApprovalList,
  submitApprovalPass
} from "@/api/purchase/purchaseBillList";
import addhead from "@/components/common/head/head";
import rejectPurchaseBill from "./child/reject_purchase_bill";
import { setTimeout } from "timers";
import { downloadFile } from "@/utils/index";
export default {
  inject: ["close"],
  name: "AuditePurchaseBillList",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      id: this.$route.query.id,
      billDTO: {
        accountName: "", //供应商开户名
        accountNo: "", //供应商开户账号
        amount: "", //结算单金额
        bank: "", //供应商开户行
        billNo: "", //采购结算单编号
        createTime: "", //创建时间
        creatorName: "", //制单员名称
        id: "", //结算单id，主键自增
        memo: "", //备注
        name: "", //结算单名称
        paymentMode: "", //结款方式：{1:预付, 2:非预付}
        prepaidAmount: "", //预付金额
        rejectedReason: "", //驳回原因
        scale: "", //预付比例
        status: "", //采购结算单状态：{1:待审批, 2:已通过, 3:已驳回 4:已取消}
        supplierName: "" //供应商名称
      },
      billDetailPaymentRecordDTOList: null, //结算单付款信息
      // billOperationLogDTOList: {}, //日志集合
      invoiceDTOList: null, //结算单发票信息
      orderInfoDTOList: null //结算单商品信息
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getPurchaseDetail(this.id);
  },
  components: {
    rejectPurchaseBill,
    addhead
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
  },
  activated() {
    console.log(this.id,this.$route.query.id);
    if (this.id !== this.$route.query.id) {
      console.log('调用了');
      this.getPurchaseDetail(this.$route.query.id);
      this.id = this.$route.query.id;
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      // console.log(row.invoiceNo,rowIndex,this.billDTO.paymentMode, "99999");
      console.log(this.invoiceDTOList.length,'0000000000000000000000000000');
      if (this.billDTO.paymentMode=="NO_PAY_IN_ADVANCE" && this.invoiceDTOList.length == 0) {
        return "warningrows";
      }
      return "";
    },
    getPurchaseDetail(id) {
      submitApprovalList(id).then(res => {
        if (res.code == "000000") {
          console.log(res, "998");
          this.billDTO = res.data.purchaseBillDTO;
          this.billDetailPaymentRecordDTOList =
            res.data.purchaseBillDetailPaymentRecordDTOList;
          // this.billOperationLogDTOList =
          //   res.data.purchaseBillOperationLogDTOList;
          this.invoiceDTOList = res.data.purchaseInvoiceDTOList;
          this.orderInfoDTOList = res.data.purchaseOrderInfoDTOList;
          console.log(this.orderInfoDTOList, "999");
        }
      });
    },
    exportList() {
      exportPurchaseDetail(this.id).then(res => {
        downloadFile(res);
      });
    },
    downloadFileWarehouse(row) {
      console.log(row, 5555);
      // let aa=row.split(',')
      // console.log(aa,666)
      row.forEach(item => {
        let href = `/api/file-service/file/download?id=${item}&access_token=${this.$auth.token}`;
        window.open(href);
      });
    },
    downloadFile(row) {
      console.log(row, 5555);
      let aa = row.split(",");
      console.log(aa, 666);
      aa.forEach(item => {
        let href = `/api/file-service/file/download?id=${item}&access_token=${this.$auth.token}`;
        window.open(href);
      });
    },
    callback() {
      this.close({
        name: "AuditePurchaseBillList",
        to: { name: "PurchaseManage", params: { isUpdate: true } }
      });
    },
    rejectBill() {
      this.$refs.RejectPurchaseBill.init(this.id);
    },
    passPuchaseBill() {
      if (this.invoiceDTOList.length === 0 && this.billDTO.paymentMode=="NO_PAY_IN_ADVANCE") {
        this.$confirm("该结算单中存在未收到进项票的明细，是否通过？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          submitApprovalPass(this.id).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "该结算通过成功",
                type: "success"
              });
              this.close({
                name: "AuditePurchaseBillList",
                to: { name: "PurchaseManage", params: { isUpdate: true } }
              });
            }
          });
        });
      } else {
        submitApprovalPass(this.id).then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "该结算通过成功",
              type: "success"
            });
            this.close({
              name: "AuditePurchaseBillList",
              to: { name: "PurchaseManage", params: { isUpdate: true } }
            });
          }
        });
      }
    },
    downLoad() {}
  }
};
</script>

<style lang='less' scoped>
.demandDetail {
  width: 100%;
  .topDetail {
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    .top {
      display: flex;
      background: #f3f3f3;
      height: 50px;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
    }
    .bottom {
      table {
        width: 95%;
        margin: 10px auto;
        th,
        td {
          height: 40px;
        }
        th {
          font-weight: 700;
          width: 12%;
          text-align: right;
        }
        td {
          padding-left: 10px;
        }
        .td1 {
          width: 100px;
        }
        .th1 {
          width: 100px;
        }
      }
    }
  }
  .middleDetail {
    border: 1px solid #e4e4e4;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 50px;
      background: #f3f3f3;
    }
    .bottom {
      border-top: 1px solid #e4e4e4;
      .dataList {
        padding: 10px;
        .ListTop {
          height: 50px;
          line-height: 50px;
          background-color: #f3f3f3;
          border: 1px solid #e4e4e4;
          border-bottom: none;
          padding-left: 20px;
          i {
            padding-right: 5px;
          }
          span {
            padding-left: 5px;
          }
        }
      }
    }
    .bottomDetail {
      border: 1px solid #e4e4e4;
      margin: 10px 0;
      .top {
        display: flex;
        background: #f3f3f3;
        height: 50px;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
      }
      .bottom {
        table {
          width: 95%;
          margin: 10px auto;
          th,
          td {
            height: 40px;
          }
          th {
            font-weight: 700;
            width: 25%;
            text-align: right;
          }
          td {
            padding-left: 10px;
          }
        }
      }
    }
    .bottomPay {
      border: 1px solid #d1d1d1;
      margin-top: 10px;
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
  .button-box {
    display: flex;
    justify-content: flex-end;
    width: 90%;
    margin: 20px auto;
  }
}
</style>
<style>
.el-table .warningrows {
  color: red;
  font-weight: 700;
}
</style>