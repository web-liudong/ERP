<template>
  <div class="detaillBox">
    <el-form inline :rules="rules" :model="tableData" ref="invoiceForm">
      <div class="detaillTable">
        <addhead headname="发货信息"></addhead>
        <div class="orderInfo">
          <div class="chunk" style="width:100%;">
            <span>
              <i>*</i>发货类型：
            </span>
            <el-form-item prop="deliveryType">
              <el-radio-group
                v-model="tableData.deliveryType"
                @change="changeDeliveryType"
                :disabled="disabledType"
              >
                <el-radio :label="1">整单发货</el-radio>
                <el-radio :label="2">拆单发货</el-radio>
                <el-radio :label="3" v-if="tableData.orderType == 0">自定义发货</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="chunk" style="width:100%;">
            <span>
              <i>*</i>到货类型：
            </span>
            <el-form-item prop="inStoreType">
              <el-radio-group
                v-model="tableData.inStoreType"
                @change="changeInStoreType"
              >
                <el-radio :label="0">入仓</el-radio>
                <el-radio :label="1">厂直</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="detaillTable" v-if="orderInfo">
        <addhead headname="基本信息"></addhead>
        <table border="1">
          <tr>
            <th>订单编号：</th>
            <td>{{orderInfo.no}}</td>
            <th>旧系统订单号：</th>
            <td>{{orderInfo.oldErpOrderId}}</td>
            <th>外部订单号：</th>
            <td>{{orderInfo.customerOrderNo}}</td>
            <th>下单时间：</th>
            <td>{{orderInfo.createTime}}</td>
          </tr>
          <tr>
            <th>项目：</th>
            <td>{{orderInfo.projectName}}</td>
            <th>客户：</th>
            <td>{{orderInfo.customerName}}</td>
            <th>客户部门：</th>
            <td>{{orderInfo.customerUserGroupName}}</td>
            <th>客户采购人：</th>
            <td>{{orderInfo.customerUserName}}</td>
          </tr>
          <tr>
            <th>业务员：</th>
            <td>{{orderInfo.staffName}}</td>
            <th>订单金额：</th>
            <td>￥{{orderInfo.amount}}</td>
            <th>已生成发货单金额：</th>
            <td class="red">￥{{orderInfo.orderDeliveryAmount || 0}}</td>
            <th>备注订单号：</th>
            <td>{{orderInfo.memoOrderNo}}</td>
          </tr>
        </table>
        <div class="orderInfo">
          <div class="chunk">
            <span>
              <i>*</i>发货仓库：
            </span>
            <el-form-item prop="warehouseId">
              <el-select
                v-model="tableData.warehouseId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in depotList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>期望配送日期：</span>
            <el-form-item prop="expectedDeliveryDate">
              <el-date-picker
                v-model="tableData.expectedDeliveryDate"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>收货人：
            </span>
            <el-form-item prop="recipientName">
              <el-input v-model="tableData.recipientName"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>收货人联系方式：
            </span>
            <el-form-item prop="recipientPhone">
              <el-input v-model="tableData.recipientPhone"></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:35%">
            <span>
              <i>*</i>收货地址：
            </span>
            <el-form-item prop="customerReceiptAddress" style="width:100%;">
              <el-input
                v-model="tableData.customerReceiptAddress"
                readonly
                @focus="showDialog('setAddress',receiptAddress)"
              ></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:40%">
            <span>发货备注：</span>
            <el-form-item prop="deliveryMemo" style="width:100%;">
              <el-input v-model="tableData.deliveryMemo" placeholder="字数长度1-50"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>紧急发货单：</span>
            <el-form-item prop="urgent">
              <el-checkbox v-model="tableData.urgent" :true-label="1" :false-label="0"></el-checkbox>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="detaillTable" v-if="skulist">
        <div class="add-head">
          <i class="iconfont icon-jinqi myicon"></i>
          <p class="add-class-text">商品信息</p>
          <div
            class="button-head"
            style="width:140px;"
            @click="addGoods"
            v-if="tableData.deliveryType == 3"
          >
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加发货商品
          </div>
          <el-checkbox v-model="useCustomerFlag" @change="customerLogChange" v-if="tableData.deliveryType == 3" style="padding: 0px 10px;">按客户购买记录选商品</el-checkbox>
          <div class="button-head" style="width:160px;" @click="getWarehouseData">获取库存和成本</div>
          <!-- <div :class="['button-head', { 'button-head-disabled':tableData.inStoreType == 1 }]" style="width:160px;" @click="getWarehouseData">获取库存和成本</div> -->
        </div>

        
        <el-table
          :data="skulist"
          border
          style="width: 100%"
          class="table"
          size="small"
          v-if="tableData.deliveryType == 1"
          ref="multipleTable1"
          key="multipleTable1"
          @cell-click="cellClick"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            type="selection"
            key="chaifen"
            :selectable="checkboxT"
          ></el-table-column>
          <el-table-column prop="id" label="条目号" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuId" label="旧系统商品ID" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuName" label="旧系统商品名称" align="center"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center"
            width="200"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope">{{scope.row.skuName}}</div>
          </el-table-column>
          <el-table-column prop="skuModel" label="规格型号" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column
            prop="currentPrice"
            label="本次售价"
            align="center"
            min-width="100"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope">{{scope.row.currentPrice}}</div>
          </el-table-column>
          <el-table-column
            prop="buyQty"
            label="购买数量"
            align="center"
            :render-header="tableHeadClassName"
            key="buyQty"
          ></el-table-column>
          <el-table-column
            prop="deliverQty"
            label="可申请发货数量"
            align="center"
            key="deliverQty"
          ></el-table-column>
          <el-table-column
            prop="itemQty"
            label="发货数量"
            align="center"
            width="150px"
            :render-header="tableHeadClassName"
          >
            <div
              slot-scope="scope"
              key="itemQty1"
            >{{scope.row.itemQty}}</div>
          </el-table-column>
          <el-table-column prop="amountVal" label="小计" align="center" width="150"></el-table-column>
          <el-table-column prop="stock" label="可用库存" align="center"></el-table-column>
          <el-table-column prop="cost" label="成本价" align="center"></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100"
            key="opa"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="showDialog('skuRemarks',{info:scope.row,type:1})"
              >备注</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          :data="skulist"
          border
          style="width: 100%"
          class="table"
          size="small"
          ref="multipleTable2"
          key="multipleTable2"
          v-else-if="tableData.deliveryType == 2"
          @cell-click="cellClick"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            type="selection"
            key="chaifen"
            :selectable="checkboxT"
          ></el-table-column>
          <el-table-column prop="id" label="条目号" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuId" label="旧系统商品ID" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuName" label="旧系统商品名称" align="center"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center"
            width="200"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope">{{scope.row.skuName}}</div>
          </el-table-column>
          <el-table-column prop="skuModel" label="规格型号" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column
            prop="currentPrice"
            label="本次售价"
            align="center"
            min-width="100"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope">{{scope.row.currentPrice}}</div>
          </el-table-column>
          <el-table-column
            prop="buyQty"
            label="购买数量"
            align="center"
            :render-header="tableHeadClassName"
            key="buyQty"
          ></el-table-column>
          <el-table-column
            prop="deliverQty"
            label="可申请发货数量"
            align="center"
            key="deliverQty"
          ></el-table-column>
          <el-table-column
            prop="itemQty"
            label="发货数量"
            align="center"
            width="150px"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope" key="itemQty2">
              <el-button icon="el-icon-minus" size="mini" circle @click="reduceNum(scope.row)"></el-button>
              <input class="quantity" type="number" v-model="scope.row.itemQty" @blur="qtyChange(scope.row)" />
              <el-button icon="el-icon-plus" size="mini" circle @click="addNum(scope.row)"></el-button>
            </div>
          </el-table-column>
          <el-table-column prop="amountVal" label="小计" align="center" width="150"></el-table-column>
          <el-table-column prop="stock" label="可用库存" align="center"></el-table-column>
          <el-table-column prop="cost" label="成本价" align="center"></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100"
            key="opa"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="showDialog('skuRemarks',{info:scope.row,type:1})"
              >备注</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          :data="skulist"
          border
          style="width: 100%"
          class="table"
          size="small"
          v-else
          ref="multipleTable3"
          key="multipleTable3"
          @cell-click="cellClick"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            label="操作"
            align="center"
            width="100"
            key="zidingyi"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delGoods(scope.row)">删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="showDialog('skuRemarks',{info:scope.row,type:1})"
              >备注</el-button>
            </template>
          </el-table-column>
          <el-table-column label="条目号" align="center">
            <template slot-scope="scope">
              <span>{{++scope.$index}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center"
            width="200"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope">
              <el-select
                v-model="scope.row.skuId"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入"
                :remote-method="querySkuList"
                @change="goodsNamechange($event,scope.row.index,scope.row.selectList)"
                @focus="curSelectSkuPos=scope.$index"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="(item,index) in scope.row.selectList"
                  :key="item.skuId+index"
                  :label="item.skuName"
                  :value="item.skuId"
                ></el-option>
              </el-select>
            </div>
          </el-table-column>
          <el-table-column prop="skuModel" label="规格型号" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column
            prop="currentPrice"
            label="本次售价"
            align="center"
            min-width="100"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope">
              <el-input
                type="number"
                size="small"
                v-model="scope.row.currentPrice"
                @input="changePrice(scope.row)"
                @change="changePriceBlur(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </div>
          </el-table-column>
          <el-table-column
            prop="itemQty"
            label="发货数量"
            align="center"
            width="150px"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope" key="itemQty3">
              <el-input
                type="number"
                size="small"
                :min="1"
                v-model="scope.row.itemQty"
                @input="changeAmount(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </div>
          </el-table-column>
          <el-table-column prop="amountVal" label="小计" align="center" width="150">
            <template slot-scope="scope">
              <el-input
                type="number"
                size="small"
                :min="1"
                v-model="scope.row.amountVal"
                @input="changeCurrentPrice(scope.row)"
                @change="changeAmountBlur(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="可用库存" align="center"></el-table-column>
          <el-table-column prop="cost" label="成本价" align="center"></el-table-column>
        </el-table>

        <div class="infoTotal">
          <p>发货金额总计：￥{{filterMoneyTwo(skuTotalAmount)}}</p>
        </div>
        <div class="button-box">
          <el-button type="primary" @click="submitForm('invoiceForm')">生成发货单</el-button>
          <el-button type="primary" @click="close()">取 消</el-button>
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
  generateDeliveryOrder,
  getWarehouseList,
  getSkuList,
  getCustomerRecordSkuList,
  getCustomerRecordSkuCheck,
  getWmsSkuStock,
  getCostPrice,
  getDeliveryOrderDetails
} from "@/api/order/invoiceOrder";
import setAddress from "../child/set_address";
import skuRemarks from "../child/sku_remarks";
import { isEmptyObject, returnFloat, returnFloatFour } from "@/utils/index";
import { ftruncate } from "fs";
export default {
  inject: ["close"],
  name:"CreatInvoiceForOrder",
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入1000以内的数字"));
      }
      callback();
    };
    return {
      orderInfo: null,
      selectInit: true,
      disabledType: false,
      tableData: {
        deliveryMemo: "",
        deliveryType: 1,
        inStoreType: 0,
        expectedDeliveryDate: "",
        orderDeliveryItemParamList: [],
        orderId: "",
        orderType: 0,
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressLine: "",
        recipientAddressProvinceId: "",
        customerReceiptAddress: "",
        recipientName: "",
        recipientPhone: "",
        urgent: 0,
        warehouseId: ""
      },
      stockVal: "--", //可用库存
      receiptAddress: {}, //收货地址
      useCustomerFlag: false,
      depotList: [],
      depotListBackups:[],
      warehouseSelStatus: false,
      remoteLoading: false,
      initSkuList: null,
      skulist: [],
      duplicateSkuList:{},//重复商品集合
      multipleSelection: [],
      curSelectSkuPos: "", //当前选中商品的索引
      curSelectSku: null, //当前选中的商品
      tempskuList: [],
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() &&
            new Date(time).toDateString() != new Date().toDateString()
          );
        }
      },
      rules: {
        recipientName: [
          { validator: check, trigger: "blur", message: "收货人不能为空" }
        ],
        recipientPhone: [
          {
            validator: check,
            trigger: "blur",
            message: "收货人联系方式不能为空"
          }
        ],
        customerReceiptAddress: [
          { validator: check, trigger: "change", message: "收货地址不能为空" }
        ],
        warehouseId: [
          { validator: check, trigger: "change", message: "发货仓库不能为空" }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.tableData.orderId){
      this.init();
    }
  },
  components: {
    addhead,
    skuRemarks,
    setAddress
  },
  computed: {
    skuTotalAmount: function() {
      let obj = this.tableData.deliveryType == 2 ? this.multipleSelection : this.skulist;
      return obj.reduce((sum, item) => {
        return sum + parseFloat(item.amountVal);
      }, 0);
    }
  },
  methods: {
    init(){
      this.tableData.orderId = this.$route.query.id;
      this.getdata();
    },
    checkWMS(rule, value, callback) {
      if (!value && this.orderInfo.useLeadingWMS && this.tableData.inStoreType == 0) {
        return callback(new Error("发货仓库不能为空"));
      }
      callback();
    },
    getdata() {
      getDeliveryOrderDetails(this.tableData.orderId).then(res => {
        if (res.code == "000000") {
          this.orderInfo = res.data;

          if (res.data.recipientAddressLine) {
            let arr = [
              res.data.recipientAddressProvinceName,
              res.data.recipientAddressCityName,
              res.data.recipientAddressCountyName,
              res.data.recipientAddressLine
            ];
            this.receiptAddress = {
              province: { id: res.data.recipientAddressProvinceId },
              city: { id: res.data.recipientAddressCityId },
              county: { id: res.data.recipientAddressCountyId },
              address: res.data.recipientAddressLine,
              receiptAddress: res.data.customerReceiptAddress || arr.join("-")
            };
            res.data.customerReceiptAddress = this.receiptAddress.receiptAddress;
          }

          Object.assign(this.tableData, res.data);

          if (res.data.deliveryType) {
            this.disabledType = true;
          } else {
            this.tableData.deliveryType = 1;
          }

          let tempDuplicateSkuList = {};
          res.data.list &&
            res.data.list.forEach(item => {
              item.buyQty = item.itemQty; //购买数量
              item.deliverQty = item.availableItemQty; //可申请发货数量
              item.itemQty = item.availableItemQty;
              item.amount = returnFloatFour(item.itemQty*item.currentPrice);
              item.amountVal = returnFloat(item.itemQty*item.currentPrice);
              item.stock = "--";
              item.cost = "--";
              item.selectList = [
                {
                  skuId: item.skuId,
                  skuName: item.skuName
                }
              ];
              
              //记录重复出现的商品
              if(tempDuplicateSkuList[item.skuId]){
                this.duplicateSkuList[item.skuId] = item.skuId;
              }else{
                tempDuplicateSkuList[item.skuId] = item.skuId;
              }
            });
          this.skulist = res.data.list || [];
          this.initSkuList = JSON.parse(JSON.stringify(res.data.list));

          //没生成过发货单或者生成过且发货类型未整单
          if(!this.disabledType || (this.disabledType && this.tableData.deliveryType == 1)){
            this.toggleAllSelection();
          }
          // this.rules["warehouseId"] = [
          //   { validator: this.checkWMS, trigger: "change" }
          // ];

          this.warehouseSelStatus = false;
          this.getWarehouseList();
          // if (this.orderInfo.useLeadingWMS) {
          //   // this.rules["warehouseId"] = [
          //   //   { validator: this.checkWMS, trigger: "change" }
          //   // ];
          //   this.warehouseSelStatus = false;
          //   this.getWarehouseList();
          // } else {
          //   this.tableData.warehouseId = 0;
          //   this.warehouseSelStatus = true;
          //   this.depotListBackups = this.depotList = [
          //     {
          //       id: 0,
          //       name: "无"
          //     }
          //   ];
          // }
        }
      });
    },
    getWarehouseList() {
      getWarehouseList(this.$auth.user.userPosts[0].organizationId).then(
        res => {
          if (res.code == "000000") {
            this.depotList = res.data;
            this.depotListBackups = res.data.slice(0);
            //只有一个仓库，设为默认值
            if (res.data.length == 1) {
              this.tableData.warehouseId = res.data[0].id;
            }
          }
        }
      );
    },
    getWarehouseData() {
      if (!this.tableData.warehouseId) {
        this.$message({
          message: "请先选择仓库后，再获取商品库存信息",
          type: "error"
        });
        return false;
      }
      let skuArr = this.skulist.filter(item => {
        // return item.skuId !== "";
        return item.skuId != "";
      });
      if (!skuArr.length) {
        this.$message({
          message: "当前单据还未添加商品，请先添加商品",
          type: "error"
        });
        return false;
      }
      let ids = skuArr.map(item => {
        return item.skuId;
      });
      this.getCostPrice(ids);

      if (!this.orderInfo.useLeadingWMS) {
        this.$message({
          message: "当前账号所属组织机构未启用WMS，无法查询库存情况",
          type: "error"
        });
        return false;
      }

      getWmsSkuStock({
        skuIds: ids,
        warehouseId: this.tableData.warehouseId
      }).then(res => {
        if (res.code == "000000") {
          let warehouse = {};
          res.data.forEach(item => {
            warehouse[item.skuId] = item;
          });

          this.skulist.forEach((item,index) => {
            let stock = '--';
            if(!warehouse[item.skuId]){
              stock = '--'
            }else{
              stock = warehouse[item.skuId].availableQty < 0 ? 0 : warehouse[item.skuId].availableQty;
            }
            item.stock = stock;
            this.$set(this.skulist, index, item);
          });
        }
      });
    },
    getCostPrice(ids){
      //获取成本
      getCostPrice({
        skuIds: ids,
        warehouseId: this.tableData.warehouseId
      }).then(res => {
        if (res.code == "000000") {
          let warehouse = {};
          res.data.forEach(item => {
            warehouse[item.skuId] = item;
          });
          this.skulist.forEach(item => {
            let cost = warehouse[item.skuId] ? warehouse[item.skuId].costTax : "--"
            item.cost = cost;
          });
        }
      });
    },
    querySkuList(query) {
      if (query !== "") {
        this.remoteLoading = true;
        //按客户购买记录选商品
        if(this.useCustomerFlag){
          this.getCustomerRecordSkuList(query);
          return false;
        }
        getSkuList({
          name: query
        })
          .then(res => {
            if (res.code == "000000") {
              this.$set(this.skulist[this.curSelectSkuPos], 'selectList', res.data);
              this.remoteLoading = false;
            }
          })
          .catch(rej => {
            this.remoteLoading = false;
          });
      } else {
        this.skulist[this.curSelectSkuPos].selectList = [];
      }
    },
    getCustomerRecordSkuList(query){
      getCustomerRecordSkuList({
          customerId:this.orderInfo.customerId,
          projectId:this.orderInfo.projectId,
          //skuIdList:[],
          skuName: query,
          useCustomerFlag: true
        })
        .then(res => {
          if (res.code == "000000") {
            this.$set(
              this.skulist[this.curSelectSkuPos],
              "selectList",
              res.data
            );
            this.remoteLoading = false;
          }
        }).catch(rej => {this.remoteLoading = false;});
    },
    customerLogChange(b){
      if(!b) return false;
      if(!this.orderInfo.projectId || !this.orderInfo.customerId){
        this.useCustomerFlag=false
        this.$message({
          message:'请先选择项目和客户',
          type: 'error', 
        })
      }else{
        getCustomerRecordSkuCheck(this.orderInfo.customerId, this.orderInfo.projectId).then(res => {
          if(!res.data){
            this.$message({
              message:'当前客户无购买记录',
              type: 'error', 
            })
            this.useCustomerFlag=false;
          }
        }).catch(rej => {
          this.useCustomerFlag=false;
          this.remoteLoading = false;
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (this.duplicateSkuList[row.skuId]) {
        return "warning-row";
      }
      return "";
    },
    checkboxT(row, rowIndex) {
      if (row.deliverQty == 0) {
        return false; //禁用
      } else {
        return true; //不禁用
      }
    },
    cellClick(row, column, cell, event) {
      this.curSelectSkuPos = row.index;
    },
    goodsNamechange(skuId, row, selectList) {
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
            amount: 0,
            amountVal: 0,
            itemQty: 1,
            stock: "--",
            cost: "--"
          });
          return false;
        }
        let goods = selectList.filter((item, index) => {
          return item.skuId == skuId;
        });
        //没有当前数值使用默认数值
        let currentPrice = goods[0].currentPrice || goods[0].buyingPrice || goods[0].websitePrice;
        let tempObj = {
          currentPrice: currentPrice,
          amount: returnFloatFour(currentPrice),
          amountVal: returnFloat(currentPrice),
          itemQty: 1,
          selectList:JSON.parse(JSON.stringify(selectList)),
          stock: "--",
          cost: "--"
        };
        this.$set(this.skulist, row, Object.assign({}, goods[0], tempObj));
      } else {
        this.$set(this.skulist, row, {
          name: "",
          currentDiscount: 0,
          currentPrice: 0,
          amount:0,
          amountVal:0,
          itemQty: 1,
          stock: "--",
          cost: "--"
        });
      }
    },
    changePrice(row) {
      row.currentDiscount = returnFloatFour(
        (row.currentPrice / row.websitePrice) * 100
      );
      row.amount = returnFloatFour(row.itemQty * row.currentPrice);
      row.amountVal = returnFloat(row.itemQty*row.currentPrice);
    },
    changePriceBlur(row){
      row.currentPrice = returnFloatFour(row.currentPrice);
    },
    showDialog(type, row) {
      if(type == "skuRemarks" && !row.info.skuId){
        this.$message({
          message: "您还没有选择商品，请选择商品后再添加备注",
          type: "error"
        });
        return false;
      }
      this.$refs[type].init(row);
    },
    dialogCallback(res) {
      Object.assign(this.receiptAddress, res);
      this.tableData.customerReceiptAddress = res.receiptAddress;
    },
    addGoods() {
      let temp = {
        name: "",
        currentDiscount: 0,
        currentPrice: 0,
        itemQty: 1,
        amount:0,
        amountVal:0,
        stock: this.stockVal
      };
      this.$set(this.skulist, this.skulist.length, temp);
    },
    delGoods(row) {
      this.skulist.splice(row.index, 1);
    },
    addNum(row) {
      if (!row.itemQty) {
        row.itemQty = 0;
      }
      if (row.itemQty < row.deliverQty) {
        row.itemQty++;
        if (row.itemQty == 1) {
          row.select = true;
          this.toggleSelection(row, true);
          // this.multipleSelection.push(row);
        }
      }
    },
    reduceNum(row) {
      if (!row.itemQty) {
        row.itemQty = 0;
      }
      if (row.itemQty > 0) {
        row.itemQty--;
        if (row.itemQty == 0) {
          row.select = false;
          this.toggleSelection(row, false);
          // this.multipleSelection = this.multipleSelection.filter(item => {
          //   return item.skuId != row.skuId;
          // });
        } else {
          if (!row.select) {
            row.select = true;
            this.toggleSelection(row, true);
            // this.multipleSelection.push(row);
          }
        }
      }
    },
    qtyChange(row){
      if(row.itemQty === ""){
        row.itemQty = -1;
      }
      if(row.itemQty <= 0){
        row.itemQty = 0;
        this.toggleSelection(row, false);
      }else if (row.itemQty > 0) {
        row.itemQty > row.deliverQty && (row.itemQty = row.deliverQty);
        this.toggleSelection(row, true);
      }
    },
    toggleSelection(row, isSelect) {
      this.$refs['multipleTable'+this.tableData.deliveryType].toggleRowSelection(row, isSelect);
    },
    handleSelect(selection, row) {
      if (this.tableData.deliveryType == 1) {
        this.toggleAllSelection();
        return false;
      }
      // this.multipleSelection = selection;
    },
    handleSelectAll(selection) {
      if (this.tableData.deliveryType == 1 && selection.length == 0) {
        this.toggleAllSelection();
      }
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    changeDeliveryType(type) {
      this.skulist = JSON.parse(JSON.stringify(this.initSkuList));
      // if(type == 3){
      //   this.skulist = [];
      // }
      if (type == 1) {
        this.toggleAllSelection();
      }
    },
    changeInStoreType(type){
      // if(type == 1){
      //   this.depotList = [{
      //     id:0,
      //     name:'无'
      //   }]
      //   this.tableData.warehouseId = 0;
      // }else{
      //   this.depotList = this.depotListBackups.slice(0);
      //   this.tableData.warehouseId = this.depotListBackups[0].id == 0 ? 0 : "";
      // }
    },
    changeAmount(row) {
      row.amount = returnFloatFour(row.itemQty * row.currentPrice);
      row.amountVal = returnFloat(row.itemQty * row.currentPrice);
    },
    changeCurrentPrice(row) {
      row.currentPrice = returnFloatFour(row.amountVal / row.itemQty);
    },
    changeAmountBlur(row) {
      row.amountVal = returnFloat(row.amountVal);
      row.amount = returnFloatFour(row.amountVal);
      this.changeCurrentPrice(row);
    },
    toggleAllSelection() {
      this.$refs['multipleTable'+this.tableData.deliveryType].toggleAllSelection();
    },
    checkSelection(row, rowIndex) {
      if (this.tableData.deliveryType == 1) {
        return false; //禁用
      } else {
        return true; //不禁用
      }
    },
    saveRemark(memo) {
      this.skulist[this.curSelectSkuPos].itemMemo = memo;
    },
    checkInvoiceOrder() {
      //是否有重复商品
      if(!isEmptyObject(this.duplicateSkuList)){
        this.$message({
          message: "当前订单中，相同商品出现多行条目，请核对后进行跟踪。",
          type: "error"
        });
        return false;
      }
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

      //常规订单情况下---去掉总金额不能为0的限制
      // if (this.tableData.orderType == 0 && this.skuTotalAmount <= 0) {
      //   this.$message({
      //     message: "发货金额总计不能小于0",
      //     type: "error"
      //   });
      //   return false;
      // }

      let skuPrice = this.skulist.every(val => {
        return val.currentPrice === 0;
      });

      if (this.tableData.orderType == 0 && skuPrice) {
        this.$confirm(
          "商品信息中包含0元商品，请确定是否要创建发货单？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.creatInvoiceOrder();
          })
          .catch(() => {});
      } else {
        this.creatInvoiceOrder();
      }
    },
    creatInvoiceOrder() {
      let goods;
      if (this.tableData.deliveryType == 2) {
        goods = this.multipleSelection.filter((item, index) => {
          return item.skuId;
        });
        if (goods && goods.length == 0) {
          this.$message({
            message: "请选择发货的商品信息",
            type: "error"
          });
          return false;
        }
      } else {
        goods = this.skulist.filter((item, index) => {
          return item.skuId;
        });
      }

      goods.forEach(item => {
        item.amount = returnFloatFour(item.currentPrice*item.itemQty);
      })

      this.tableData["orderDeliveryItemParamList"] = goods;
      this.tableData[
        "recipientAddressProvinceId"
      ] = this.receiptAddress.province.id;
      this.tableData["recipientAddressCityId"] = this.receiptAddress.city.id;
      this.tableData[
        "recipientAddressCountyId"
      ] = this.receiptAddress.county.id;
      this.tableData["recipientAddressLine"] = this.receiptAddress.address;
      generateDeliveryOrder(this.tableData).then(res => {
        let msg = "生成发货单成功!";
        if (/^98/.test(res.code)) {
          msg = res.message;
        }
        this.$alert(msg, "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.close({name:'CreatInvoiceForOrder', to: {name:'OrderManage', params:{isUpdate:true}}});
          }
        });
      });
    },
    tableHeadClassName(h, { column, $index }) {
      return h("span", [
        h(
          "span",
          {
            style: "color:red;"
          },
          "*"
        ),
        h("span", column.label)
      ]);
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.checkInvoiceOrder();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloatFour(cellValue);
    },
    filterMoney(num) {
      return returnFloatFour(num);
    },
    filterMoneyTwo(num) {
      return returnFloat(num);
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
    .button-head-disabled {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #aaa;
    }
  }
  .button-head:hover {
    color: #339999;
    border-color: #c2e0e0;
    background-color: #ebf5f5;
  }
  .button-head-disabled:hover {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #aaa;
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
        width: 12.5%;
        background-color: #f9fafc;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 12.5%;
        line-height: 20px;
        span {
          width: 40px;
          text-align: center;
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
      width: 95%;
      padding: 20px 0;
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
  .quantity {
      display: inline-block;
      width: 50px;
      border: 1px solid #dcdfe6;
      height: 28px;
      line-height: 28px;
      text-align: center;
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
</style>
