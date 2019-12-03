<template>
  <div class="detaillBox">
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
          :icon="step == 2 ? 'el-icon-circle-check-outline' : 'el-icon-time'"
        ></el-step>
        <el-step
          title="已取消"
          :icon="step == 2 ? 'el-icon-circle-check-outline' : 'el-icon-time'"
          v-if="orderStatus.status == 6"
          :description="orderStatus.cancelInfo"
        ></el-step>
      </el-steps>
    </template>
    <el-form inline :model="tableData" ref="orderForm">
      <div class="detaillTable" v-if="tableOldData">
        <addhead headname="旧系统订单基本信息"></addhead>
        <div class="orderInfo">
          <div class="chunk">
            <span>
              订单ID：
            </span>
            <el-form-item>
              <el-input v-model="tableOldData.oldErpOrderId" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              项目：
            </span>
            <el-form-item>
              <el-input v-model="tableOldData.projectName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>客户：</span>
            <el-form-item>
              <el-input v-model="tableOldData.customerName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>部门：</span>
            <el-form-item>
              <el-input v-model="tableOldData.departmentName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              采购人：
            </span>
            <el-form-item>
              <el-input v-model="tableOldData.customerUserName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:50%">
            <span>
              收货地址：
            </span>
            <el-form-item>
              <el-input v-model="tableOldData.customerAddress" readonly :disabled="true"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="detaillTable" v-if="tableData">
        <addhead headname="新系统订单基本信息"><template slot="append"><span style="margin-left:10px;">编号：{{tableData.no}}</span></template></addhead>
        <div class="orderInfo">
          <div class="chunk">
            <span>项目：
            </span>
            <el-form-item prop="projectId">
              <el-input v-model="tableData.projectName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>客户：
            </span>
            <el-form-item prop="customerId">
              <el-input v-model="tableData.customerName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>客户部门：
            </span>
            <el-form-item prop="customerUserGroupId">
              <el-input v-model="tableData.customerUserGroupName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>采购人：</span>
            <el-form-item prop="customerUserId">
              <el-input v-model="tableData.customerUserName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>采购人联系方式：</span>
            <el-form-item prop="customerUserPhone">
              <el-input v-model="tableData.customerUserPhone" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>收货人：
            </span>
            <el-form-item prop="recipientName">
              <el-input v-model="tableData.recipientName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>收货人联系方式：
            </span>
            <el-form-item prop="recipientPhone">
              <el-input v-model="tableData.recipientPhone" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:50%">
            <span>收货地址：
            </span>
            <el-form-item prop="customerReceiptAddress">
              <el-input
                v-model="tableData.customerReceiptAddress"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>业务员：</span>
            <el-form-item prop="staffName">
              <el-input v-model="tableData.staffName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>期望配送日期：</span>
            <el-form-item prop="expectedDeliveryDate">
              <el-date-picker
                v-model="tableData.expectedDeliveryDate"
                type="date"
                :disabled="true"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>订单类型：
            </span>
            <el-form-item prop="orderTypeName">
              <el-input v-model="tableData.orderTypeName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>备注订单号：</span>
            <el-form-item prop="customerOrderNo">
              <el-input v-model="tableData.customerOrderNo" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="orderInfo">
          <div class="chunk" style="width:60%">
            <span>订单备注：</span>
            <el-form-item prop="orderMemo">
              <el-input v-model="tableData.orderMemo" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:40%">
            <span>是否紧急：</span>
            <el-form-item prop="urgent">
              <el-checkbox
                v-model="tableData.urgent"
                :true-label="1"
                :false-label="0"
                :disabled="true"
              ></el-checkbox>
            </el-form-item>
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
          class="table"
          size="small"
          :row-class-name="filterRow"
        >
          <el-table-column prop="id" label="条目号" align="center"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuId" label="旧系统商品ID" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuName" label="旧系统商品名称" align="center" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="oldErpCategoryName" label="归属旧系统一级分类" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center" width="200"></el-table-column>
          <el-table-column prop="skuModel" label="规格型号" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="websitePrice" label="官网售价" align="center" :formatter="formatPrice"></el-table-column>
          <el-table-column
            prop="negotiatedPrice"
            label="项目限价"
            align="center"
            :formatter="formatPrice"
          ></el-table-column>
          <el-table-column prop="negotiatedDiscount" label="折扣率(%)" align="center"></el-table-column>
          <el-table-column prop="currentDiscount" label="本次折扣率(%)" align="center" min-width="115">
            <!-- <template slot-scope="scope">
              <el-input
                type="number"
                size="small"
                v-model="scope.row.currentDiscount"
                @input="changeDiscount(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>-->
          </el-table-column>
          <el-table-column prop="currentPrice" label="本次售价" align="center" min-width="100" :formatter="formatPrice">
            <!-- <template slot-scope="scope">
              <el-input
                type="number"
                size="small"
                v-model="scope.row.currentPrice"
                @input="changePrice(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>-->
          </el-table-column>
          <el-table-column prop="itemQty" label="数量" align="center">
            <!-- <template slot-scope="scope">
              <el-input
                type="number"
                size="small"
                v-model="scope.row.itemQty"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>-->
          </el-table-column>
          <el-table-column prop="sellingPrice" label="小计" align="center">
            <template slot-scope="scope">
              <span>{{formatPriceDom(scope.row.currentPrice*scope.row.itemQty)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="previousPrice" label="上次售价" align="center" :formatter="formatPrice"></el-table-column>
        </el-table>
        <div class="infoTotal">
          <p>商品合计：¥{{filterMoney(skuTotalAmount)}}</p>
          <p>应付款：¥{{tableData.orderType == 0 ? filterMoney(skuTotalAmount) : 0}}</p>
        </div>
        <div class="button-box">
          <el-button type="primary" @click="close()">关 闭</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  getOrderDetailStatus,
  getOrderDetail,
  getOrderDetailItem,
  likeOrderItemList,
  saveAbnormalOrderBase,
  saveAbnormalOrderSku,
  getOldOrderInfo
} from "@/api/order/orderManage";
import { nameList } from "@/api/projectController/projectController";
import { customerNameList, customerUserNameList } from "@/api/order/saleDown";
import { returnFloat, returnFloatFour } from "@/utils/index";
export default {
  inject: ["close"],
  name:'OrderAnomalyDetail',
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入1000以内的数字"));
      }
      callback();
    };
    return {
      orderId: "",
      invalidType: "", //无效类型
      tableOldData: null,
      startTime:null,
      orderStatus: null,
      tableData: {
        customerId: "",
        customerUserId: "",
        id: "",
        projectId: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressLine: "",
        customerReceiptAddress: "",
        recipientAddressProvinceId: ""
      },
      receiptAddress: {}, //收货地址
      remoteLoading: false,
      tableLog: null,
      skulist: null,
      curSelectSkuPos: "", //当前选中商品的索引
      curSelectSku: null, //当前选中的商品
      duplicateSkuList:{},//重复商品集合
      tempskuList: [],
      options3: [],
      customerOptions: [],
      purchaseOptions: [],
      rulesBase: {
        projectId: [
          { validator: check, trigger: "change", message: "请选择项目" }
        ],
        customerId: [
          { validator: check, trigger: "change", message: "请选择客户" }
        ],
        customerReceiptAddress: [
          { validator: check, trigger: "change", message: "收货地址不能为空" }
        ]
        // customerUserId: [
        //   { validator: check, trigger: "change", message: "请选择采购人" }
        // ]
      },
      rulesGood: {}
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.orderId){
      this.init();
    }
  },
  components: {
    addhead
  },
  computed: {
    skuTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    },
    // rules: function() {
    //   return this.invalidType == 1 ? this.rulesGood : this.rulesBase;
    // }
  },
  methods: {
    init(){
      this.startTime = Date.now();
      this.orderId = this.$route.query.id;
      this.invalidType = this.$route.query.type;
      this.getOrderStatus();
      this.getOlddata();
      this.getdata();
      this.getOrderDetailItem();
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
          } if (res.data.status == 5 || res.data.status == 6) {
            this.step = res.data.status == 5 ? 1 : 2;
            if(res.data.cancelAbnormalOrderTime){
              this.step = 3;
              res.data.cancelInfo = res.data.cancelAbnormalOrderTime+ " 操作人：" + (res.data.cancelOperator ? res.data.cancelOperator.realName : '客户');
            }
          } else {
            this.step = res.data.status + 1;
          }
          this.$set(this, "orderStatus", res.data);
        }
      });
    },
    getOlddata() {
      getOldOrderInfo(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableOldData = res.data;
        }
      });
    },
    getdata() {
      getOrderDetail(this.orderId).then(res => {
        if (res.code == "000000") {
          if (res.data.projectId) {
            this.options3 = [
              {
                id: res.data.projectId,
                name: res.data.projectName
              }
            ];
            res.data.isProjectDisable = true;
          } else {
            res.data.projectId === 0 && (res.data.projectId = "");
          }

          if (res.data.customerId) {
            this.customerOptions = [
              {
                id: res.data.customerId,
                name: res.data.customerName
              }
            ];
            res.data.isCustomerDisable = true;
          } else {
            res.data.customerId === 0 && (res.data.customerId = "");
          }

          if (res.data.customerUserId) {
            this.purchaseOptions = [
              {
                userId: res.data.customerUserId,
                name: res.data.customerUserName
              }
            ];
            res.data.isCustomerUserDisable = true;
          } else {
            res.data.customerUserId === 0 && (res.data.customerUserId = "");
          }

          if (res.data.customerReceiptAddress) {
            res.data.isAddressDisable = true;
          } else {
            res.data.customerReceiptAddress = "";
          }

          this.tableData = res.data;
          // this.receiptAddress = {
          //   province: { id: res.data.recipientAddressProvinceId },
          //   city: { id: res.data.recipientAddressCityId },
          //   county: { id: res.data.recipientAddressCountyId },
          //   address: res.data.recipientAddressLine,
          //   receiptAddress: res.data.customerReceiptAddress
          // };
        }
      });
    },
    getOrderDetailItem() {
      getOrderDetailItem(this.orderId).then(res => {
        if (res.code == "000000") {
          res.data.forEach((value, index, arr) => {
            if (value.skuId) {
              arr[index].options = [
                {
                  skuId: value.skuId,
                  skuName: value.skuName
                }
              ];
            } else {
              value.skuId = "";
            }
          });
          this.$set(this, "skulist", res.data);
          this.setDuplicateSkuList();
        }
      });
    },
    setDuplicateSkuList(){
      let tempDuplicateSkuList = {};
      this.duplicateSkuList = {};
      //记录重复出现的商品
      this.skulist.forEach((value, index, arr) => {
        if(tempDuplicateSkuList[value.skuId]){
          this.duplicateSkuList[value.skuId] = value.skuId;
        }else{
          tempDuplicateSkuList[value.skuId] = value.skuId;
        }
      });
    },
    filterRow({ row, rowIndex }) {
      row.index = rowIndex;
      if (this.duplicateSkuList[row.skuId]) {
        return "warning-row";
      }
      return "";
    },
    remoteCustomer(query) {
      if (query !== "") {
        if (this.tableData.projectId) {
          customerNameList({
            customerName: query,
            projectId: this.tableData.projectId
          }).then(res => {
            this.customerOptions = res.data;
          });
        } else {
          this.$message({
            message: "请选择一个项目",
            type: "warning"
          });
        }
      } else {
        this.customerOptions = [];
      }
    },
    remotePurchase(query) {
      if (query !== "") {
        if (this.tableData.customerId) {
          customerUserNameList({
            userName: query,
            customerId: this.tableData.customerId
          }).then(res => {
            this.purchaseOptions = res.data;
          });
        } else {
          this.$message({
            message: "请选择一个客户",
            type: "warning"
          });
        }
      } else {
        this.purchaseOptions = [];
      }
    },
    formatPrice(row, col, cellValue) {
      return cellValue === 0 ? cellValue : '￥'+returnFloat(cellValue);
    },
    filterMoney(num) {
      return returnFloatFour(num);
    },
    formatPriceDom(val) {
      return val === 0 ? val : '￥'+returnFloat(val);
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
      width: 98%;
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin: 0;
        width: 100%;
      }
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
    }

    .setAddr {
      margin-left: 10px;
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
      margin: 20px auto;
      .el-button {
        margin: 0 20px;
      }
    }
  }
  .el-table {
    /deep/.warning-row {
      background: #ffc1c1;
    }
  }
}
</style>
<style scoped>
.orderInfo >>> .el-form-item__content {
  flex: 1;
  width: 100%;
}
.orderInfo >>> .el-form-item__error {
  margin-top: -10px;
  margin-left: 10px;
  padding-top: 1px;
}
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
