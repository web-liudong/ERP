<template>
  <div class="detaillBox" ref="detaillBox">
    <template v-if="orderStatus">
      <el-steps :active="step" align-center v-if="orderStatus.status < 4">
        <el-step
          title="新建订单"
          icon="el-icon-circle-check-outline"
          :description="orderStatus.createTime"
        ></el-step>
        <el-step
          title="已分派"
          :icon="step >= 2 ? 'el-icon-circle-check-outline' : 'el-icon-time'"
          :description="orderStatus.assignTime"
        ></el-step>
        <el-step
          title="服务方接受"
          :icon="step >= 3 ? 'el-icon-circle-check-outline' : 'el-icon-time'"
          :description="orderStatus.acceptTime"
        ></el-step>
        <el-step
          title="已完成"
          :icon="step == 4 ? 'el-icon-circle-check-outline' : 'el-icon-time'"
          :description="orderStatus.finishTime"
        ></el-step>
      </el-steps>
      <el-steps :active="step" align-center v-else-if="orderStatus.status == 4">
        <el-step
          title="新建订单"
          icon="el-icon-circle-check-outline"
          v-if="orderStatus.createTime"
          :description="orderStatus.createTime"
        ></el-step>
        <el-step
          title="已分派"
          icon="el-icon-circle-check-outline"
          v-if="orderStatus.assignTime"
          :description="orderStatus.assignTime"
        ></el-step>
        <el-step
          title="服务方接受"
          icon="el-icon-circle-check-outline"
          v-if="orderStatus.acceptTime"
          :description="orderStatus.acceptTime"
        ></el-step>
        <el-step
          title="已取消"
          icon="el-icon-circle-check-outline"
          :description="orderStatus.cancelTime"
        ></el-step>
      </el-steps>
      <el-steps :active="step" align-center v-else>
        <el-step
          title="新建订单"
          icon="el-icon-circle-check-outline"
          v-if="orderStatus.createTime"
          :description="orderStatus.createTime"
        ></el-step>
        <el-step
          title="异常待处理"
          icon="el-icon-time"
        ></el-step>
      </el-steps>
    </template>
    <div class="detaillTable" v-if="tableData">
      <addhead headname="订单信息"></addhead>
      <table border="1">
        <!-- <tr>
          <th>订单编号：</th>
          <td colspan="3">{{tableData.name}}</td>
        </tr>-->
        <tr>
          <th>订单编号：</th>
          <td>{{tableData.no}}</td>
          <th>外部订单号：</th>
          <td>{{tableData.customerOrderNo}}</td>
        </tr>
        <tr>
          <th>旧系统订单编号：</th>
          <td>{{tableData.oldErpOrderId}}</td>
          <th>项目：</th>
          <td>{{tableData.projectName}}</td>
        </tr>
        <tr>
          <th>客户：</th>
          <td>{{tableData.customerName}}</td>
          <th>客户部门：</th>
          <td>{{tableData.customerUserGroupName}}</td>
        </tr>
        <tr>
          <th>订单类型：</th>
          <td>{{tableData.orderTypeName}}</td>
          <th>订单状态：</th>
          <td class="red">{{tableData.statusName}}</td>
        </tr>
        <tr>
          <th>订单来源：</th>
          <td>{{tableData.orderSourceName}}</td>
          <th>服务方是否改单：</th>
          <td class="red">{{tableData.serverOrderEditingStatusDesc}}</td>
        </tr>
        <tr>
          <th>客户采购人：</th>
          <td>{{tableData.customerUserName}}</td>
          <th>采购人联系方式：</th>
          <td>{{tableData.customerUserPhone}}</td>
        </tr>
        <tr>
          <th>业务员：</th>
          <td>{{tableData.staffName}}</td>
          <th>期望配送日期：</th>
          <td>{{tableData.expectedDeliveryDate}}</td>
        </tr>
        <tr>
          <th>收货人：</th>
          <td>{{tableData.recipientName}}</td>
          <th>收货人联系方式：</th>
          <td>{{tableData.recipientPhone}}</td>
        </tr>
        <tr>
          <th>收货地址：</th>
          <td>{{tableData.customerReceiptAddress}}</td>
          <th>紧急订单：</th>
          <td :class="tableData.urgent == 1 ? 'red' : ''">{{tableData.urgentName}}</td>
        </tr>
        <tr>
          <th>备注订单号：</th>
          <td>{{tableData.memoOrderNo}}</td>
          <th>制单人：</th>
          <td>{{tableData.creatorName || '客户'}}</td>
        </tr>
        <tr>
          <th>付款方式：</th>
          <td>{{tableData.payTypeDesc}}</td>
          <th>已生成发货单金额：</th>
          <td>￥{{tableData.deliveryAmount || 0}}</td>
        </tr>
        <tr>
          <th>订单备注：</th>
          <td colspan="3">{{tableData.orderMemo}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="skulist">
      <addhead headname="商品信息"></addhead>
      <el-table :data="skulist" border style="width: 90%" class="table" size="small">
        <el-table-column prop="id" label="条目号" align="center"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center">
          <template slot-scope="scope">
          <el-button
            @click="oepnWin('GoodsDetail',{ id: scope.row.skuId })"
            type="text"
            size="small"
            v-if="$authorities.GoodsManageDetailRelevant"
          >{{scope.row.skuNo}}</el-button>
          <span v-else>{{scope.row.skuNo}}</span>
        </template>
        </el-table-column>
        <el-table-column prop="oldErpSkuId" label="旧系统商品ID" align="center"></el-table-column>
        <el-table-column prop="oldErpSkuName" label="旧系统商品名称" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="规格型号" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="websitePrice" label="官网售价" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.websitePrice}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="negotiatedPrice" label="项目限价" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.negotiatedPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="negotiatedDiscount" label="折扣率(%)" align="center"></el-table-column>
        <el-table-column prop="currentDiscount" label="本次折扣率(%)" align="center"></el-table-column>
        <el-table-column prop="currentPrice" label="本次售价" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.currentPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="itemQty" label="数量" align="center"></el-table-column>
        <el-table-column prop="amount" label="小计" align="center">
          <template slot-scope="scope">
            <p>￥{{filterMoney(scope.row.amount)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="snCode" label="序列号" align="center"></el-table-column>
        <el-table-column prop="itemMemo" label="备注信息" align="center"></el-table-column>
      </el-table>
      <div class="infoTotal">
        <p>商品合计：¥{{filterMoney(skuTotalAmount)}}</p>
        <p>应付款：¥{{(tableData.orderType == 0 || tableData.orderType == 3) ? filterMoney(skuTotalAmount) : 0}}</p>
      </div>
    </div>
    <div class="detaillTable" v-if="tableData.orderServerDTO">
      <addhead headname="服务信息"></addhead>
      <table border="1">
        <tr>
          <th>项目乙方：</th>
          <td>{{tableData.partyBName}}</td>
          <th>乙方客户负责人：</th>
          <td>{{tableData.customerUserDataAuthorityName}}</td>
        </tr>
        <tr>
          <th>服务方：</th>
          <td>{{tableData.orderServerDTO.firstServerName}}</td>
          <th>服务方接单人：</th>
          <td>{{tableData.orderServerDTO.firstServerUserName}}</td>
        </tr>
        <tr>
          <th>第二服务方：</th>
          <td>{{tableData.orderServerDTO.secondServerName}}</td>
          <th>第二服务方接单人：</th>
          <td>{{tableData.orderServerDTO.secondServerUserName}}</td>
        </tr>
        <tr>
          <th>集团客户负责人：</th>
          <td>{{tableData.customerGroupUserDataAuthorityName}}</td>
          <th>派单员：</th>
          <td>{{tableData.assignUserName}}</td>
        </tr>
        <tr>
          <th>服务费：</th>
          <td>
            {{tableData.orderServerDTO.firstServerFee}}%
            <el-button
              type="text"
              style="margin-left:10px;"
              @click="showDialog('raterecord',tableData.orderServerDTO.id)"
            >修改记录</el-button>
          </td>
          <th>第二服务方服务费：</th>
          <td>{{tableData.orderServerDTO.secondServerFee}}%</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="bankaccount">
      <addhead headname="服务方收款账号信息"></addhead>
      <table border="1">
        <tr>
          <th>服务方：</th>
          <td>{{bankaccount.organizationName}}</td>
          <th>委托收款方：</th>
          <td>{{bankaccount.payeeName}}</td>
        </tr>
        <tr>
          <th>服务方开户行：</th>
          <td>{{bankaccount.bank}}</td>
          <th>委托收款方开户行：</th>
          <td>{{bankaccount.payeeBank}}</td>
        </tr>
        <tr>
          <th>服务方开户银行编号：</th>
          <td>{{bankaccount.bankNo}}</td>
          <th>委托收款方开户银行编号：</th>
          <td>{{bankaccount.payeeBankNo}}</td>
        </tr>
        <tr>
          <th>服务方开户名：</th>
          <td>{{bankaccount.accountName}}</td>
          <th>委托收款方开户名：</th>
          <td>{{bankaccount.payeeAccountName}}</td>
        </tr>
        <tr>
          <th>服务方开户账号：</th>
          <td>{{bankaccount.accountNo}}</td>
          <th>委托收款方开户账号：</th>
          <td>{{bankaccount.payeeAccountNo}}</td>
        </tr>
        <tr>
          <th>委托收款协议凭证：</th>
          <td colspan="3"><a style="color:#399;cursor: pointer;" v-if="bankaccount.payeeAuthorizationFileIdsList" @click="getFileDownload(bankaccount.payeeAuthorizationFileIdsList[0])">{{bankaccount.payeeAuthorizationFileIdsList[0].name}}</a></td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="deliveryPicture">
      <addhead headname="上传送货单"></addhead>
      <dl>
        <dd>
          <p v-for="(item,index) in deliveryPicture" :key="index">
            <span class="iconfont iconpdf" style="font-size: 95px;" @click="showBigFile(item);" v-if="item.url == 'pdf'"></span>
            <img :src="item.url" @click="showBigFile(item);" v-else>
          </p>
        </dd>
      </dl>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="订单备注"></addhead>
      <el-table :data="orderMemoList" border style="width:90%;" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="description" label="备注" style="width: 33%" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detaillTable2 clear" style="margin-bottom:70px;">
      <addhead headname="操作详情"></addhead>
      <el-table :data="tableLog" border style="width:90%;" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="orderStatusDesc" label="订单状态" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationDesc" label="操作项" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="description" label="备注" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
    <div class="fotter" :style="{width:footerWidth+'px'}">
      <span>相关操作</span>
      <ul>
        <li>
          <el-button type="primary" plain @click="oepnWin('customerStatementList', {orderNo:tableData.no})">查看结算单</el-button>
        </li>
        <li>
          <el-button type="primary" plain @click="oepnWin('returnOrderMange', {orderNo:tableData.no})">查看退货单</el-button>
        </li>
        <li>
          <el-button type="primary" plain @click="oepnWin('InvoiceManage', {orderNo:tableData.no})">查看发货单</el-button>
        </li>
        <li>
          <el-button type="primary" plain  @click="oepnWin('LogisticsDetails', {id:tableData.id})">查看物流详情</el-button>
        </li>
        <li>
          <el-button
            type="primary"
            plain
            @click="oepnWin('OrderModifyRecord', {id:tableData.id})"
          >查看订单修改记录</el-button>
        </li>
        <li>
          <el-button
            type="primary"
            plain
            @click="showDialog('invoiceItem', {id:tableData.id})"
            v-if="$authorities.OrderMyselfInvoice && tableData.needOrderItemForBill"
          >自定义开票明细</el-button>
        </li>
      </ul>
    </div>

    <invoiceItem ref="invoiceItem"></invoiceItem>
    <raterecord ref="raterecord"></raterecord>
    <showImg ref="showImg"></showImg>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  getOrderDetailStatus,
  getOrderDetail,
  getOrderDetailItem,
  getOrderOperationLog,
  getbankaccountList,
  getOrderPayeeInfo
} from "@/api/order/orderManage";
import { getfilelist } from "@/api/purchase/purchase";
import invoiceItem from "../child/invoice_item";
import raterecord from "../child/rate_record";
import showImg from "../child/show_img";
import { returnFloat, returnFloatFour, addURL } from "@/utils/index";
export default {
  inject: ["close"],
  name:'OrderDetail',
  data() {
    return {
      orderId: "",
      step: 1,
      orderStatus: null,
      bankaccount: null,
      tableData: {
        orderServerDTO: null
      },
      deliveryPicture: [],
      tableLog: null,
      skulist: [],
      footerWidth: 850
    };
  },
  mounted() {
    this.init();
    this.footerWidth = this.$refs.detaillBox.clientWidth;
  },
  activated(){
    if(this.$route.query.id && this.$route.query.id != this.orderId){
      this.init();
    }
  },
  components: {
    addhead,
    invoiceItem,
    raterecord,
    showImg
  },
  computed: {
    skuTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return this.countTotalAmount(sum, item.amount);
      }, 0);
    },
    orderMemoList: function() {
      let arr = [];
      if (this.tableLog) {
        arr = this.tableLog.filter(item => {
          return item.operation == 4;
        }, 0);
      }
      return arr;
    }
  },
  methods: {
    init(){
      this.orderId = this.$route.query.id;
      this.getOrderStatus();
      this.getdata();
      this.getOrderDetailItem();
      this.getLog();
    },
    getOrderStatus() {
      getOrderDetailStatus(this.orderId).then(res => {
        if (res.code == "000000") {
          if (res.data.status == 4) {
            if (res.data.acceptTime) {
              this.step = 4;
            } else if (res.data.assignTime) {
              this.step = 3;
            } else {
              this.step = 2;
            }
          } if (res.data.status == 5) {
            this.step = 1;
          } else {
            this.step = res.data.status + 1;
          }
          this.$set(this, "orderStatus", res.data);
        }
      });
    },
    getdata() {
      getOrderDetail(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data;
          if (
            res.data.deliveryPictureFileIdList &&
            res.data.deliveryPictureFileIdList.length
          ) {
            this.getfilelist();
          }
          if(res.data.orderServerDTO){
            this.getBankaccount();
          }
        }
      });
    },
    getfilelist() {
      getfilelist({
        ids: this.tableData.deliveryPictureFileIdList,
        pageNum: 1,
        pageSize: this.tableData.deliveryPictureFileIdList.length
      }).then(res => {
        if (res.code == "000000") {
          res.data.items.forEach(item => {
            if(item.name.indexOf(".pdf") > -1){
              item.url = "pdf";
            }else{
              item.url = addURL(item.path);
            }
          });
          this.deliveryPicture = res.data.items;
        }
      });
    },
    showBigFile(file) {
      if(file.name.indexOf('.pdf') > -1){
        window.open(addURL(file.path), "_blank");
      }else{
        this.showDialog("showImg", file);
      }
    },
    getOrderDetailItem() {
      getOrderDetailItem(this.orderId).then(res => {
        if (res.code == "000000") {
          this.skulist = res.data;
        }
      });
    },
    async getBankaccount() {
      let server = await getbankaccountList([
        this.tableData.orderServerDTO.firstServerId
      ]);
      let payee = await getOrderPayeeInfo(this.orderId);
      this.bankaccount = Object.assign({}, server.data[0], payee.data);
    },
    getLog() {
      getOrderOperationLog(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableLog = res.data;
        }
      });
    },
    oepnWin(name, query) {
      this.$router.push({name : name, query : query});
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    filterMoney(num) {
      return returnFloat(num);
    },
    countTotalAmount(sum, num){
      return sum + parseFloat(returnFloat(num));
    },
    getFileDownload(obj) {
      //let token='&access_token='+this.$auth.token;
      //let href = '/api/file-service/file/download?id='+id + token;
      window.open(addURL(obj.path), "blank");
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
        word-break: break-all;
        span {
          margin-right: 10px;
          display: inline-block;
        }
      }
      .red {
        color: red;
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
  .fotter {
    position: fixed;
    bottom: 10px;
    height: 70px;
    padding: 10px 0;
    line-height: 50px;
    box-sizing: border-box;
    background: #f3f3f3;
    border: 1px solid #ccc;
    white-space: nowrap;
    z-index: 1;
    span {
      font-size: 14px;
      display: inline-block;
      margin: 0 20px;
    }
    ul {
      display: inline-block;
      li {
        display: inline-block;
        margin: 0 10px;
      }
    }
  }
}
</style>
<style scoped>
.detaillBox >>> .is-icon .el-step__icon-inner {
  font-size: 48px;
}
.detaillBox >>> .is-finish {
  color: #1abc9c;
}
.detaillBox >>> .is-process {
  color: #c0c4cc;
}
.detaillBox >>> .is-finish .el-step__line {
  background-color: #1abc9c;
}
</style>