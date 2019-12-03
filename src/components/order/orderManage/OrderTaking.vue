<template>
  <div class="detaillBox">
    <el-form inline :rules="rules" :model="tableData" ref="takingForm">
      <div class="detaillTable" v-if="tableData">
        <addhead headname="基本信息"></addhead>
        <div class="orderInfo">
          <div class="chunk">
            <span>
              <i>*</i>项目名：
            </span>
            <el-form-item prop="projectName">
              <el-input v-model="tableData.projectName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>客户名称：
            </span>
            <el-form-item prop="customerName">
              <el-input v-model="tableData.customerName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>采购人：</span>
            <el-form-item prop="customerUserName">
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
            <span>
              <i>*</i>收货人：
            </span>
            <el-form-item prop="recipientName">
              <el-input
                v-model="tableData.recipientName"
                :disabled="curIdentity == 1 && isHaveSecond"
              ></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>收货人联系方式：
            </span>
            <el-form-item prop="recipientPhone">
              <el-input
                v-model="tableData.recipientPhone"
                :disabled="curIdentity == 1 && isHaveSecond"
              ></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:50%">
            <span>
              <i>*</i>收货地址：
            </span>
            <el-form-item prop="customerReceiptAddress" style="width:100%;">
              <el-input
                v-model="tableData.customerReceiptAddress"
                readonly
                :disabled="curIdentity == 1 && isHaveSecond"
                @focus="showDialog('setAddress',receiptAddress)"
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
                :disabled="curIdentity == 1 && isHaveSecond"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>订单类型：
            </span>
            <el-form-item prop="orderTypeName">
              <el-input v-model="tableData.orderTypeName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>备注订单号：</span>
            <el-form-item prop="memoOrderNo">
              <el-input
                v-model="tableData.memoOrderNo"
                :disabled="curIdentity == 1 && isHaveSecond"
              ></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>派单员：
            </span>
            <el-form-item prop="assignUserName">
              <el-input v-model="tableData.assignUserName" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="orderInfo">
          <div class="chunk" style="width:40%">
            <span>是否紧急：</span>
            <el-form-item prop="urgent">
              <el-radio-group
                v-model="tableData.urgent"
                :disabled="curIdentity == 1 && isHaveSecond"
              >
                <el-radio :label="1">紧急</el-radio>
                <el-radio :label="0">不紧急</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="chunk" style="width:60%">
            <span>订单备注：</span>
            <el-form-item prop="orderMemo">
              <el-input v-model="tableData.orderMemo" :disabled="curIdentity == 1 && isHaveSecond"></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:40%">
            <span>包装信息：</span>
            <el-form-item prop="packageType">
              <el-radio-group
                v-model="tableData.packageType"
                :disabled="curIdentity == 1 && isHaveSecond"
              >
                <el-radio :label="0">单独包装</el-radio>
                <el-radio :label="1">统一包装</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="chunk" style="width:60%">
            <span>打包备注：</span>
            <el-form-item prop="packageMemo">
              <el-input
                v-model="tableData.packageMemo"
                :disabled="curIdentity == 1 && isHaveSecond"
              ></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:40%">
            <span>签收信息：</span>
            <el-form-item prop="receiveType">
              <el-radio-group
                v-model="tableData.receiveType"
                :disabled="curIdentity == 1 && isHaveSecond"
              >
                <el-radio :label="0">各自签收</el-radio>
                <el-radio :label="1">统一签收</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="chunk" style="width:60%">
            <span>配送备注：</span>
            <el-form-item prop="deliveryMemo">
              <el-input
                v-model="tableData.deliveryMemo"
                :disabled="curIdentity == 1 && isHaveSecond"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="detaillTable" v-if="skulist">
        <div class="add-head">
          <i class="iconfont icon-jinqi myicon"></i>
          <p class="add-class-text">商品信息</p>
          <div class="button-head" @click="addGoods" v-if="!(curIdentity == 1 && isHaveSecond)">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加
          </div>
        </div>
        <el-table
          :data="skulist"
          border
          style="width: 100%"
          class="table"
          size="small"
          @cell-click="cellClick"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope" v-if="!(curIdentity == 1 && isHaveSecond)">
              <el-button type="text" size="small" @click="delGoods(scope.row)">删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="showDialog('skuRemarks',{info:scope.row,type:1})"
              >备注</el-button>
            </template>
            <template v-else>
              <span>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="条目号" align="center"></el-table-column>
          <el-table-column prop="skuId" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center" width="200">
            <template slot-scope="scope">
              <el-select
                :disabled="curIdentity == 1 && isHaveSecond"
                v-model="scope.row.skuId"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入"
                :remote-method="querySkuList"
                @change="goodsNamechange($event,scope.row.index,scope.row.options)"
                @focus="curSelectSkuPos=scope.$index"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="item in scope.row.options"
                  :key="item.skuId"
                  :label="item.skuName"
                  :value="item.skuId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
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
            <template slot-scope="scope">
              <el-input
                :disabled="curIdentity == 1 && isHaveSecond"
                type="number"
                size="small"
                v-model="scope.row.currentDiscount"
                @input="changeDiscount(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="currentPrice" label="本次售价" align="center" min-width="100">
            <template slot-scope="scope">
              <el-input
                :disabled="curIdentity == 1 && isHaveSecond"
                type="number"
                size="small"
                v-model="scope.row.currentPrice"
                @input="changePrice(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="itemQty" label="数量" align="center">
            <template slot-scope="scope">
              <el-input
                :disabled="curIdentity == 1 && isHaveSecond"
                type="number"
                size="small"
                v-model="scope.row.itemQty"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="sellingPrice" label="小计" align="center">
            <template slot-scope="scope">
              <span>￥{{filterMoney(scope.row.currentPrice*scope.row.itemQty)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="itemMemo" label="备注信息" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="showDialog('skuRemarks',{info:scope.row,type:0})"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="infoTotal">
          <p>商品合计：¥{{filterMoney(skuTotalAmount)}}</p>
          <p>应付款：¥{{tableData.orderType == 0 ? filterMoney(skuTotalAmount) : 0}}</p>
        </div>
      </div>
      <div class="detaillTable" v-if="tableServerData">
        <addhead headname="接单信息"></addhead>
        <div class="orderInfo">
          <div class="chunk" style="width:30%;">
            <span>
              <i>*</i>服务方：
            </span>
            <el-input v-model="tableServerData.firstServerName" :disabled="true"></el-input>
          </div>
          <div class="chunk" style="width:30%;">
            <span>
              <i>*</i>服务方负责人：
            </span>
            <el-input v-model="tableServerData.firstServerUserName" :disabled="true"></el-input>
          </div>
          <!-- <div class="chunk" style="width:30%;">
            <span>
              <i>*</i>接单仓库：
            </span>
            <el-form-item prop="depotAddress">
              <el-select
                v-model="tableData.depotAddress"
                placeholder="请选择"
                :disabled="curIdentity == 1 && isHaveSecond"
              >
                <el-option
                  v-for="item in depotList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>-->
          <div class="chunk" style="width:30%;" v-if="isHaveSecond">
            <span>
              <i>*</i>第二服务方：
            </span>
            <el-input v-model="tableServerData.secondServerName" :disabled="true"></el-input>
          </div>
          <div class="chunk" style="width:30%;" v-if="isHaveSecond">
            <span>
              <i>*</i>第二服务方负责人：
            </span>
            <el-input v-model="tableServerData.secondServerUserName" :disabled="true"></el-input>
          </div>
        </div>
        <div class="button-box">
          <el-button
            type="primary"
            @click="submitForm('takingForm')"
            v-if="!(curIdentity == 1 && isHaveSecond)"
          >保存并接单</el-button>
          <el-button type="primary" @click="acceptOrder">接 单</el-button>
          <el-button type="primary" @click="close">取 消</el-button>
        </div>
      </div>
    </el-form>
    <setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
    <skuRemarks ref="skuRemarks" @callback="saveRemark"></skuRemarks>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  getOrderDetail,
  getOrderDetailItem,
  getOrderServer,
  acceptOrder,
  saveAndAcceptOrder,
  acceptOrderSecond,
  likeOrderItemList,
  saveAndAcceptOrderSecond
} from "@/api/order/orderManage";
import { close } from "@/api/close";
import setAddress from "../child/set_address";
import skuRemarks from "../child/sku_remarks";
import { returnFloat, returnFloatFour } from "@/utils/index";
export default {
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入1000以内的数字"));
      }
      callback();
    };
    return {
      orderId: "",
      isHaveSecond: false,
      curIdentity: null, //1服务方2第二服务方
      tableData: {},
      tableServerData: {},
      receiptAddress: null, //收货地址
      depotList: [
        {
          value: "仓库1",
          name: "仓库1"
        },
        {
          value: "仓库2",
          name: "仓库2"
        }
      ],
      remoteLoading: false,
      tableLog: null,
      skulist: null,
      curSelectSkuPos: "", //当前选中商品的索引
      curSelectSku: null, //当前选中的商品
      tempskuList: [],
      rules: {
        recipientName: [
          { validator: check, trigger: "blur", message: "选择收货人不能为空" }
        ],
        recipientPhone: [
          {
            validator: check,
            trigger: "blur",
            message: "收货人联系方式不能为空"
          }
        ],
        customerReceiptAddress: [
          { validator: check, trigger: "blur", message: "收货地址不能为空" }
        ]
        // depotAddress: [
        //   { validator: check, trigger: "blur", message: "请选择仓库" }
        // ]
      }
    };
  },
  mounted() {
    this.orderId = this.$route.query.id;
    this.getdata();
    this.getOrderDetailItem();
    this.getServerData();
    //this.getWarehouseData();
  },
  components: {
    addhead,
    skuRemarks,
    setAddress
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
      getOrderDetail(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data;
          this.receiptAddress = {
            province: { id: res.data.recipientAddressProvinceId },
            city: { id: res.data.recipientAddressCityId },
            county: { id: res.data.recipientAddressCountyId },
            address: res.data.recipientAddressLine,
            receiptAddress: res.data.customerReceiptAddress
          };
        }
      });
    },
    getOrderDetailItem() {
      getOrderDetailItem(this.orderId).then(res => {
        if (res.code == "000000") {
          res.data.forEach((value, index, arr) => {
            arr[index].options = [
              {
                skuId: value.skuId,
                skuName: value.skuName
              }
            ];
            // arr[index].negotiatedDiscount = returnFloat(
            //   value.negotiatedDiscount * 100
            // );
            // arr[index].currentDiscount = returnFloat(
            //   value.currentDiscount * 100
            // );
          });
          this.$set(this, "skulist", res.data);
          console.log(this.skulist);
        }
      });
    },
    getServerData() {
      getOrderServer(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableServerData = res.data;
          this.isHaveSecond = Boolean(res.data.secondServerId);
          this.curIdentity =
            this.$auth.user.id == res.data.firstServerUserId
              ? 1
              : this.$auth.user.id == res.data.secondServerUserId
              ? 2
              : 0;
        }
      });
    },
    getWarehouseData() {
      // getWarehouseData(this.orderId).then(res => {
      //   if (res.code == "000000") {
      //     this.depotList = res.data;
      //   }
      // });
    },
    querySkuList(query) {
      if (query !== "") {
        this.remoteLoading = true;
        likeOrderItemList({
          skuName: query,
          customerId: this.tableData.customerId,
          projectId: this.tableData.projectId
        })
          .then(res => {
            if (res.code == "000000") {
              this.skulist[this.curSelectSkuPos].options = res.data;
              this.remoteLoading = false;
            }
          })
          .catch(rej => {
            this.remoteLoading = false;
          });
      } else {
        this.skulist[this.curSelectSkuPos].options = [];
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    cellClick(row, column, cell, event) {
      this.curSelectSkuPos = row.index;
    },
    goodsNamechange(skuId, row, options) {
      if (skuId) {
        let check = this.skulist.some((item, index) => {
          return item.skuId == skuId && row != index;
        });
        if (check) {
          this.$message({
            message: "选择的商品已添加",
            type: "error"
          });
          this.$set(this.skulist, row, {
            name: "",
            currentDiscount: 0,
            currentPrice: 0,
            itemQty: 1
          });
          return false;
        }
        let goods = options.filter((item, index) => {
          return item.skuId == skuId;
        });
        //没有当前数值使用默认数值
        let tempObj = {
          // currentDiscount:
          //   returnFloat(goods[0].currentDiscount*100) || returnFloat(goods[0].negotiatedDiscount*100),
          // negotiatedDiscount:returnFloat(goods[0].negotiatedDiscount*100),
          // currentDiscount:
          //   goods[0].currentDiscount || goods[0].negotiatedDiscount,
          currentDiscount:
            goods[0].currentDiscount || goods[0].negotiatedDiscount,
          currentPrice: goods[0].currentPrice || goods[0].negotiatedPrice,
          itemQty: goods[0].itemQty || 1
        };
        Object.assign(goods[0], tempObj);
        this.$set(this.skulist, row, goods[0]);
      } else {
        this.$set(this.skulist, row, {
          name: "",
          currentDiscount: 0,
          currentPrice: 0,
          itemQty: 1
        });
      }
    },
    changeDiscount(row) {
      row.currentPrice = returnFloatFour(
        (row.currentDiscount / 100) * row.websitePrice
      );
    },
    changePrice(row) {
      row.currentDiscount = returnFloatFour(
        (row.currentPrice / row.websitePrice) * 100
      );
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(res) {
      Object.assign(this.receiptAddress, res);
      this.tableData.customerReceiptAddress = res.receiptAddress;
    },
    addGoods() {
      this.skulist.push({
        name: "",
        currentDiscount: 0,
        currentPrice: 0,
        itemQty: 1
      });
    },
    delGoods(row) {
      this.skulist.splice(row.index, 1);
    },
    saveRemark(memo) {
      this.skulist[this.curSelectSkuPos].itemMemo = memo;
    },
    acceptOrder() {
      if (this.curIdentity == 0) {
        this.$message({
          message: "您不是该订单的服务方负责人不能接单",
          type: "error"
        });
        return false;
      }
      this.$confirm(
        "如当前订单重新编辑，请点击【保存并接单】，【确定接单】则编辑不保存，",
        "提示",
        {
          confirmButtonText: "确定接单",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let fun = this.curIdentity == 1 ? acceptOrder : acceptOrderSecond;
          fun(this.orderId, { version: this.tableData.version }).then(res => {
            this.$alert("接单成功!", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.close();
              }
            });
          });
        })
        .catch(() => {});
    },
    checkSaveAndAccept() {
      //check-验证商品信息正确性
      let result = this.skulist.every(val => {
        return (
          val.itemQty == 0 ||
          val.currentPrice === "" ||
          val.currentDiscount === ""
        );
      });

      if (result) {
        this.$message({
          message: "商品信息不正确，请重新填写",
          type: "error"
        });
        return false;
      }

      //常规订单情况下
      if (this.tableData.orderType == 0 && this.skuTotalAmount == 0) {
        this.$message({
          message: "常规订单总额不能为0",
          type: "error"
        });
        return false;
      }

      let skuPrice = this.skulist.every(val => {
        return val.currentPrice === 0;
      });

      if (skuPrice) {
        this.$confirm(
          "订单中包含0元商品，请确定是否要保存并接单？",
          "提示",
          {
            confirmButtonText: "确定接单",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.saveAndAcceptOrder();
          })
          .catch(() => {});
      } else {
        this.saveAndAcceptOrder();
      }
    },
    saveAndAcceptOrder() {
      let goods = this.skulist.filter((item, index) => {
        return item.skuId;
      });

      let fun =
        this.curIdentity == 1 ? saveAndAcceptOrder : saveAndAcceptOrderSecond;
      this.tableData["itemList"] = goods;
      fun(this.orderId, this.tableData).then(res => {
        this.$alert("保存并接单成功!", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.close();
          }
        });
      });
    },
    submitForm(name) {
      if (this.curIdentity == 0) {
        this.$message({
          message: "您不是该订单的服务方负责人不能接单",
          type: "error"
        });
        return false;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.checkSaveAndAccept();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    filterMoney(num) {
      return returnFloatFour(num);
    },
    close() {
      close();
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
      width: 98%;
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin: 0;
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
      .el-input {
        width: 100%;
        margin: 10px 0 10px 10px;
      }
      .el-select {
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
</style>
