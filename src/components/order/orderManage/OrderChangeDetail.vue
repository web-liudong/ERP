<template>
  <div class="detaillBox">
    <div class="detaillTable" v-if="tableData">
      <addhead headname="基本信息"></addhead>
      <div class="orderInfo">
        <div class="chunk">
          <span>
            <i>*</i>项目名：
          </span>
          <el-input v-model="tableData.projectName" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>客户名称：
          </span>
          <el-input v-model="tableData.customerName" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>客户部门：
          </span>
          <el-input v-model="tableData.customerUserGroupName" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>采购人：
          </span>
          <el-input v-model="tableData.customerUserName" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>采购人联系方式：
          </span>
          <el-input v-model="tableData.customerUserPhone" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>收货人：
          </span>
          <el-input v-model="tableData.recipientName" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>收货人联系方式：
          </span>
          <el-input v-model="tableData.recipientPhone" :disabled="true"></el-input>
        </div>
        <div class="chunk" style="width:50%">
          <span>
            <i>*</i>收货地址：
          </span>
          <el-input v-model="tableData.customerReceiptAddress" readonly :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>业务员：
          </span>
          <el-input v-model="tableData.staffName" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>期望配送日期：
          </span>
          <el-date-picker
            v-model="tableData.expectedDeliveryDate"
            type="date"
            :disabled="true"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>订单类型：
          </span>
          <el-input v-model="tableData.orderType" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>外部订单号：</span>
          <el-input v-model="tableData.customerOrderNo" :disabled="true"></el-input>
        </div>
        <div class="chunk">
          <span>
            <i>*</i>派单员：
          </span>
          <el-input v-model="tableData.assignUserName" :disabled="true"></el-input>
        </div>
      </div>
      <div class="orderInfo">
        <div class="chunk" style="width:40%">
          <span>是否紧急：</span>
          <el-radio-group v-model="tableData.urgent" :disabled="true">
            <el-radio :label="0">紧急</el-radio>
            <el-radio :label="1">不紧急</el-radio>
          </el-radio-group>
        </div>
        <div class="chunk" style="width:60%">
          <span>订单备注：</span>
          <el-input v-model="tableData.orderMemo" :disabled="true"></el-input>
        </div>
        <div class="chunk" style="width:40%">
          <span>包装信息：</span>
          <el-radio-group v-model="tableData.packageType" :disabled="true">
            <el-radio :label="0">单独包装</el-radio>
            <el-radio :label="1">统一包装</el-radio>
          </el-radio-group>
        </div>
        <div class="chunk" style="width:60%">
          <span>打包备注：</span>
          <el-input v-model="tableData.packageMemo" :disabled="true"></el-input>
        </div>
        <div class="chunk" style="width:40%">
          <span>签收信息：</span>
          <el-radio-group v-model="tableData.receiveType" :disabled="true">
            <el-radio :label="0">各自签收</el-radio>
            <el-radio :label="1">统一签收</el-radio>
          </el-radio-group>
        </div>
        <div class="chunk" style="width:60%">
          <span>配送备注：</span>
          <el-input v-model="tableData.deliveryMemo" :disabled="true"></el-input>
        </div>
      </div>
    </div>
    <div class="detaillTable" v-if="skulist">
      <div class="add-head">
        <i class="iconfont icon-jinqi myicon"></i>
        <p class="add-class-text">商品信息</p>
      </div>
      <el-table
        :data="skulist"
        border
        style="width: 100%"
        max-height="400"
        class="table"
        size="small"
      >
        <el-table-column prop="id" label="条目号" align="center"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center" width="200"></el-table-column>
        <el-table-column prop="skuModel" label="规格型号" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="websitePrice" label="官网售价" align="center"></el-table-column>
        <el-table-column prop="websitePrice" label="项目售价" align="center"></el-table-column>
        <el-table-column prop="zkl" label="折扣率(%)" align="center"></el-table-column>
        <el-table-column prop="currentDiscount" label="本次折扣率(%)" align="center"></el-table-column>
        <el-table-column prop="currentPrice" label="本次售价" align="center"></el-table-column>
        <el-table-column prop="itemQty" label="数量" align="center"></el-table-column>
        <el-table-column prop="sellingPrice" label="小计" align="center"></el-table-column>
        <el-table-column prop="itemMemo" label="备注信息" align="center"></el-table-column>
      </el-table>
      <div class="infoTotal">
        <p>商品合计：¥{{skuTotalAmount}}</p>
        <p>应付款：¥{{tableData.orderType == 0 ? skuTotalAmount : 0}}</p>
      </div>
    </div>
    <div class="detaillTable" v-if="tableData">
      <addhead headname="接单信息"></addhead>
      <div class="orderInfo">
        <div class="chunk" style="width:30%;">
          <span>
            <i>*</i>服务方：
          </span>
          <el-input v-model="tableData.firstServerName" :disabled="true"></el-input>
        </div>
        <div class="chunk" style="width:30%;">
          <span>
            <i>*</i>服务方负责人：
          </span>
          <el-input v-model="tableData.firstServerUserName" :disabled="true"></el-input>
        </div>
        <div class="chunk" style="width:30%;">
          <span>
            <i>*</i>接单仓库：
          </span>
          <el-input v-model="tableData.firstServerUserName" :disabled="true"></el-input>
        </div>
        <div class="chunk" style="width:30%;" v-if="isHaveSecond">
          <span>
            <i>*</i>第二服务方：
          </span>
          <el-input v-model="tableData.secondServerName" :disabled="true"></el-input>
        </div>
        <div class="chunk" style="width:30%;" v-if="isHaveSecond">
          <span>
            <i>*</i>第二服务方负责人：
          </span>
          <el-input v-model="tableData.secondServerUserName" :disabled="true"></el-input>
        </div>
      </div>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { getEditRecordInfo } from "@/api/order/orderManage";
export default {
  inject: ["close"],
  name:"OrderChangeDetail",
  data() {
    return {
      orderId: "",
      isHaveSecond: false,
      curIdentity: null, //1服务方2第二服务方
      tableData: {},
      receiptAddress: null, //收货地址
      remoteLoading: false,
      tableLog: null,
      skulist: null,
      curSelectSkuPos: "", //当前选中商品的索引
      curSelectSku: null, //当前选中的商品
      tempskuList: []
    };
  },
  mounted() {
    this.orderId = this.$route.query.id;
    this.getdata();
  },
  components: {
    addhead
  },
  computed: {
    skuTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return sum + item.currentPrice * item.itemQty;
      }, 0);
    }
  },
  methods: {
    getdata() {
      getEditRecordInfo(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data;
          this.$set(this, "skulist", res.data.orderItemEditingDTOList);
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
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
      font: bold 16px/40px "\5FAE\8F6F\96C5\9ED1";
      margin-right: 30px;
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
      display: flex;
      justify-content: center;
      align-items: center;
      .button-head-icon {
        margin-right: 5px;
      }
      .icon-add {
        font-size: 12px;
      }
    }
  }
  .button-head:hover {
    color: #339999;
    border-color: #c2e0e0;
    background-color: #ebf5f5;
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
    .orderInfo {
      margin-top: -2px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      span {
        margin: 0 0 0 10px;
        flex: 0 0 120px;
        text-align: right;
        i {
          color: red;
        }
      }
      .chunk {
        width: 25%;
        display: flex;
        align-items: center;
      }
      .el-input,
      .el-select {
        width: 100%;
        margin: 10px 0 10px 10px;
      }
      .el-radio {
        margin-right: 5px;
      }
      .setAddr {
        margin-left: 10px;
      }
    }
    .infoTotal {
      height: 60px;
      padding: 20px;
      line-height: 24px;
      text-align: right;
    }
    .button-box {
      display: flex;
      justify-content: center;
      width: 90%;
      margin: 0 auto 20px;
      .el-button {
        margin: 0 20px;
      }
    }
  }
}
</style>