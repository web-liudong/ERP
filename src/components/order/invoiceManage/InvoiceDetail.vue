<template>
  <div class="detaillBox" ref="detaillBox">
    <div class="detaillTable" v-if="tableData">
      <addhead headname="发货单信息"></addhead>
      <table border="1">
        <!-- <tr>
          <th>订单编号：</th>
          <td colspan="3">{{tableData.name}}</td>
        </tr>-->
        <tr>
          <th>发货单编号：</th>
          <td>{{tableData.orderDeliveryNo}}</td>
          <th>发货单来源：</th>
          <td>{{tableData.orderDeliverySourceText}}</td>
        </tr>
        <tr>
          <th>发货单金额：</th>
          <td>￥{{tableData.amount}}</td>
          <th>推送至WMS结果：</th>
          <td>{{{0:'未发送',1:'成功',2:'失败'}[tableData.sendToWMS]}}</td>
        </tr>
        <tr>
          <th>发货类型：</th>
          <td>{{tableData.deliveryTypeText}}</td>
          <th>关联订单编号：</th>
          <td>{{tableData.orderNo}}</td>
        </tr>
        <tr>
          <th>配送状态：</th>
          <td>
            {{tableData.deliveryStatusText}}
            <el-button type="text" @click="showDialog('showDeliveryInfo', tableData);">查看配送详情</el-button>
          </td>
          <th>期望配送日期：</th>
          <td>{{tableData.expectedDeliveryDate}}</td>
        </tr>
        <tr>
          <th>到货类型：</th>
          <td>{{tableData.inStoreTypeText}}</td>
          <th>外部订单编号：</th>
          <td>{{tableData.customerOrderNo}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{tableData.projectName}}</td>
          <th>客户：</th>
          <td>{{tableData.customerName}}</td>
        </tr>
        <tr>
          <th>客户部门：</th>
          <td>{{tableData.customerUserGroupName}}</td>
          <th>客户采购人：</th>
          <td>{{tableData.customerUserName}}</td>
        </tr>
        <tr>
          <th>业务员：</th>
          <td>{{tableData.staffName}}</td>
          <th>收货人：</th>
          <td>{{tableData.recipientName}}</td>
        </tr>
        <tr>
          <th>发货仓库：</th>
          <td>{{tableData.warehouseName}}</td>
          <th>收货人联系方式：</th>
          <td>{{tableData.recipientPhone}}</td>
        </tr>
        <tr>
          <th>收货地址：</th>
          <td>{{tableData.recipientAddressLineText}}</td>
          <th>是否使用领先wms系统：</th>
          <td>{{tableData.useWMS == 0 ? '否' : '是'}}</td>
        </tr>
        <tr>
          <th>是否紧急：</th>
          <td :class="tableData.urgentText == '是' ? 'red' : ''">{{tableData.urgentText}}</td>
          <th>配送备注：</th>
          <td colspan="3">{{tableData.deliveryMemo}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="orderDetail" key="orderDetail">
      <addhead headname="订单信息"></addhead>
      <el-table :data="orderDetail" border style="width: 90%" class="table" size="small">
        <el-table-column prop="no" label="订单号" align="center" width="140">
          <template slot-scope="scope">
            <el-button
              @click="oepnWin('OrderDetail',{ id: scope.row.id })"
              type="text"
              size="small"
              v-if="$authorities.OrderDetails"
            >{{scope.row.no}}</el-button>
            <span v-else>{{scope.row.no}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerOrderNo" label="外部订单号" align="center"></el-table-column>
        <el-table-column prop="memoOrderNo" label="备注订单号" align="center"></el-table-column>
        <el-table-column prop="orderSourceName" label="订单来源" align="center"></el-table-column>
        <el-table-column prop="urgentName" label="是否紧急" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目" align="center"></el-table-column>
        <el-table-column prop="customerName" label="客户" align="center"></el-table-column>
        <el-table-column prop="customerUserName" label="客户采购人" align="center"></el-table-column>
        <el-table-column prop="customerUserPhone" label="采购人联系方式" align="center"></el-table-column>
        <el-table-column prop="customerReceiptAddress" label="客户收货地址" align="center"></el-table-column>
        <el-table-column prop="amount" label="订单金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column
          prop="deliveryAmount"
          label="已生成发货单金额"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column prop="deliveryType" label="订单发货类型" align="center">
          <template slot-scope="scope">
            <span>{{{0:'未发货',1:'整单发货',2:'拆单发货',3:'自定义发货'}[scope.row.deliveryType]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="expectedDeliveryDate" label="期望配送日期" align="center"></el-table-column>
        <el-table-column prop="statusName" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="deliveryStatusText" label="配送状态" align="center"></el-table-column>
        <el-table-column prop="evaluated" label="评价状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.evaluated == 0 ? '否' : '是'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="partyBName" label="项目乙方" align="center"></el-table-column>
        <el-table-column prop="customerUserDataAuthorityName" label="乙方客户负责人" align="center"></el-table-column>
        <el-table-column prop="orderServerDTO.firstServerName" label="服务方" align="center"></el-table-column>
        <el-table-column prop="orderServerDTO.firstServerUserName" label="服务方客户负责人" align="center"></el-table-column>
        <el-table-column prop="orderServerDTO.secondServerName" label="第二服务方" align="center"></el-table-column>
        <el-table-column
          prop="orderServerDTO.secondServerUserName"
          label="第二服务方客户负责人"
          align="center"
        ></el-table-column>
        <el-table-column prop="customerGroupUserDataAuthorityName" label="集团客户负责人" align="center"></el-table-column>
        <el-table-column prop="assignUserName" label="派单员" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="detaillTable" v-if="skulist">
      <div class="add-head">
        <p class="add-class-text">发货单商品信息</p>
        <div class="button-head button-head-b" @click="getExcelBefore"><i class="icondaochu iconfont button-head-icon"></i>&nbsp;导出</div>
      </div>
      <el-table :data="skulist" border style="width: 90%" class="table" size="small">
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="currentPrice" label="本次售价" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="itemQty" label="发货数量" align="center"></el-table-column>
        <el-table-column label="应收小计" align="center">
          <template slot-scope="scope">
            <p>{{computePrice(scope.row.amount)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="receiveQty" label="实收数量" align="center"></el-table-column>
        <el-table-column label="实收金额" align="center">
          <template slot-scope="scope">
            <p>{{computePrice(scope.row.receiveQty*scope.row.currentPrice)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="itemMemo" label="备注信息" align="center"></el-table-column>
      </el-table>
      <div class="infoTotal">
        <p>应收合计：{{computePrice(skuTotalAmount)}}</p>
        <p>实收合计：{{computePrice(skuReceiveTotalAmount)}}</p>
      </div>
    </div>
    <div class="detaillTable" v-if="cargoReceiptPicture">
      <addhead headname="客户签收凭证"></addhead>
      <dl>
        <dd>
          <p v-for="(item,index) in cargoReceiptPicture" :key="index">
            <img :src="item.url" @click="showBigFile(item);" />
          </p>
        </dd>
      </dl>
    </div>
    <div class="detaillTable" v-if="deliveryPicture">
      <div class="add-head">
        <i class="iconfont icon-jinqi myicon"></i>
        <p class="add-class-text">送货单</p>
        <div
          class="button-head"
          style="width:200px;"
          @click="oepnWin('OrderDetail',{ id: tableData.orderDetailDTO.id })"
          v-if="tableData && tableData.hasOrderDeliveryPicture"
        >订单已上传送货单，点击查看</div>
      </div>
      <dl>
        <dd>
          <p v-for="(item,index) in deliveryPicture" :key="index">
            <img :src="item.url" @click="showBigFile(item);" />
          </p>
        </dd>
      </dl>
    </div>
    <div class="detaillTable2 clear" style="margin-bottom:35px;" v-if="tableData">
      <addhead headname="操作详情"></addhead>
      <el-table
        :data="tableData.orderDeliveryOperationLogDTOS"
        border
        style="width:90%;"
        size="small"
      >
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationText" label="描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>

    <showImg ref="showImg"></showImg>
    <showDeliveryInfo ref="showDeliveryInfo"></showDeliveryInfo>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <iframe :src="imgurl+dialogPdfUrl" width="100%" height="400px">
              不支持
      </iframe>
    </el-dialog>-->
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { getDeliveryDetail } from "@/api/order/invoiceOrder";
import { getfilelist } from "@/api/purchase/purchase";
import pdf from "../../../../static/img/pdfico.jpg";
import showImg from "../child/show_img";
import showDeliveryInfo from "../child/show_delivery_info";
import { returnFloat, returnFloatFour, addURL } from "@/utils/index";
export default {
  inject: ["imgurl", "close"],
  name: "InvoiceDetail",
  data() {
    return {
      orderId: "",
      tableData: null,
      dialogVisible: false,
      dialogPdfUrl: "",
      deliveryPicture: null,
      cargoReceiptPicture: [],
      skulist: [],
      orderDetail: []
    };
  },
  mounted() {
    this.init();
  },
  activated() {
    if (this.$route.query.id != this.orderId) {
      this.init();
    }
  },
  components: {
    addhead,
    showImg,
    showDeliveryInfo
  },
  computed: {
    skuTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return this.countTotalAmount(sum, item.amount);
      }, 0);
    },
    skuReceiveTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return sum + item.currentPrice * item.receiveQty;
      }, 0);
    }
  },
  methods: {
    init() {
      this.orderId = this.$route.query.id;
      this.deliveryPicture = [];
      this.cargoReceiptPicture = [];
      this.skulist = [];
      this.orderDetail = [];
      this.getdata();
    },
    getdata() {
      getDeliveryDetail(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data;
          if (res.data.orderDetailDTO) {
            res.data.orderDetailDTO["expectedDeliveryDate"] =
              res.data.expectedDeliveryDate;
            res.data.orderDetailDTO["deliveryStatusText"] =
              res.data.deliveryStatusText;
            this.orderDetail = [res.data.orderDetailDTO];
          }
          this.skulist = res.data.orderDeliveryItemDTOS;

          if (
            res.data.cargoReceiptPictureFileIdList &&
            res.data.cargoReceiptPictureFileIdList.length
          ) {
            this.getfilelist("cargoReceiptPictureFileIdList");
          }
          if (
            res.data.deliveryPictureFileIdList &&
            res.data.deliveryPictureFileIdList.length
          ) {
            this.getfilelist("deliveryPictureFileIdList");
          }
        }
      });
    },
    getfilelist(type) {
      getfilelist({
        ids: this.tableData[type],
        pageNum: 1,
        pageSize: this.tableData[type].length
      }).then(res => {
        if (res.code == "000000") {
          res.data.items.forEach(item => {
            item.url = item.name.indexOf(".pdf") > -1 ? pdf : addURL(item.path);
          });
          if (type == "deliveryPictureFileIdList") {
            this.deliveryPicture = res.data.items;
          } else {
            this.cargoReceiptPicture = res.data.items;
          }
        }
      });
    },
    getExcelBefore() {
      if (this.skulist.length) {
        this.getExcel(this.skulist);
      }
    },
    getExcel(res) {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../../static/excel/Export2Excel.js");
        const tHeader = ["商品编号", "商品名称", "单位", "数量", "价格"];
        const filterVal = [
          "skuNo",
          "skuName",
          "unit",
          "itemQty",
          "currentPrice"
        ];
        const list = res;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "商品明细");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    oepnWin(name, query) {
      this.$router.push({ name: name, query: query });
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    formatPrice(row, column, value, index) {
      return "￥" + returnFloatFour(value);
    },
    computePrice(value) {
      return "￥" + returnFloat(value);
    },
    showBigFile(file) {
      if (file.name.indexOf(".pdf") > -1) {
        //this.openPdf(file.path);
        //this.getFileDownload(file.id);
        window.open(addURL(file.path), "_blank");
      } else {
        this.showDialog("showImg", file);
      }
    },
    countTotalAmount(sum, num){
      return sum + parseFloat(returnFloat(num));
    },
    getFileDownload(id) {
      let token = "&access_token=" + this.$auth.token;
      let href = "/api/file-service/file/download?id=" + id + token;
      window.open(href, "blank");
    }
    // openPdf(path){
    //   this.dialogPdfUrl = path;
    //   this.dialogVisible = true;
    // },
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
    .add-head {
      width: 100%;
      height: 40px;
      background-color: #f3f3f3;
      padding-left: 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      .myicon {
        font-size: 23px;
        margin-top: 3px;
      }
      .add-class-text {
        color: #666;
        font: bold 15px/40px "\5FAE\8F6F\96C5\9ED1";
        margin-right: 30px;
      }
      .button-head {
        width: 80px;
        height: 30px;
        margin-right: 10px;
        cursor: pointer;
        line-height: 30px;
        border-radius: 3px;
        display: flex;
        color: #339999;
        justify-content: center;
        align-items: center;
      }
      .button-head:hover {
        color: #339999;
      }
      .button-head-b {
        color: #555;
        border: 1px solid #d1d1d1;
        background-color: #fff;
      }
      .button-head-b:hover {
        color: #399;
        border-color: #c2e0e0;
        background-color: #ebf5f5;
      }
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
.detaillBox >>> .is-finish {
  color: #1abc9c;
}
.detaillBox >>> .is-process {
  color: #c0c4cc;
}
</style>