<template>
  <div class="detaillBox">
    <el-form inline :model="tableData" :rules="rules" ref="orderForm">
      <div class="detaillTable" v-if="tableOldData">
        <addhead headname="旧系统订单基本信息"></addhead>
        <div class="orderInfo">
          <div class="chunk">
            <span>
              <i>*</i>订单ID：
            </span>
            <el-form-item>
              <el-input v-model="tableOldData.oldErpOrderId" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>项目：
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
              <i>*</i>采购人：
            </span>
            <el-form-item>
              <el-input v-model="tableOldData.customerUserName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:50%">
            <span>
              <i>*</i>收货地址：
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
            <span>
              <i>*</i>项目：
            </span>
            <el-form-item prop="projectId">
              <el-select
                v-model="tableData.projectId"
                filterable
                remote
                clearable
                placeholder="请输入"
                :remote-method="remoteMethod1"
                @change="projectChange"
                :disabled="invalidType == 1 || tableData.isProjectDisable"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>客户：
            </span>
            <el-form-item prop="customerId">
              <el-select
                v-model="tableData.customerId"
                filterable
                remote
                clearable
                placeholder="请输入"
                :remote-method="remoteCustomer"
                @change="customerChange"
                :disabled="invalidType == 1 || (tableData.isProjectDisable && tableData.isCustomerDisable)"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>客户部门：</span>
            <el-select
              v-model="tableData.customerUserGroupId"
              filterable
					    remote
              :remote-method="remotecustomerUserGroup"
              @change="customerUserGroupChange"
              :disabled="invalidType == 1 || (tableData.isProjectDisable && tableData.isCustomerDisable)"
              clearable
            >
              <el-option
                v-for="item in remoteCustomerUserGroupList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span><i v-if="tableData.projectType == 1 || tableData.projectType == 2">*</i>采购人：</span>
            <el-form-item prop="customerUserId">
              <el-select
                v-model="tableData.customerUserId"
                filterable
                remote
                clearable
                placeholder="请输入"
                :remote-method="remotePurchase"
                @change="customerUserChange"
                :disabled="invalidType == 1 || (tableData.isProjectDisable && tableData.isCustomerDisable && tableData.isCustomerUserDisable)"
              >
                <el-option
                  v-for="item in purchaseOptions"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
              </el-select>
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
              <el-input v-model="tableData.recipientName" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>收货人联系方式：
            </span>
            <el-form-item prop="recipientPhone">
              <el-input v-model="tableData.recipientPhone" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="chunk" style="width:50%">
            <span>
              <i>*</i>收货地址：
            </span>
            <el-form-item prop="customerReceiptAddress">
              <el-input
                v-model="tableData.customerReceiptAddress"
                @focus="showDialog('setAddress',receiptAddress)"
                readonly
                :disabled="invalidType == 1 || tableData.isAddressDisable"
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
            <span>
              <i>*</i>订单类型：
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
          @cell-click="cellClick"
        >
          <el-table-column prop="id" label="条目号" align="center"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuId" label="旧系统商品ID" align="center"></el-table-column>
          <el-table-column prop="oldErpSkuName" label="旧系统商品名称" align="center"></el-table-column>
          <el-table-column prop="oldErpCategoryName" label="归属旧系统一级分类" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center" width="200">
            <div slot-scope="scope" v-if="invalidType == 1">
              <el-select
                v-model="scope.row.skuId"
                filterable
                remote
                clearable
                placeholder="请输入"
                :remote-method="querySkuList"
                @change="goodsNamechange($event,scope.row.index,scope.row.options)"
                @focus="curSelectSkuPos=scope.$index"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="(item,index) in scope.row.options"
                  :key="item.skuId+index"
                  :label="item.skuName"
                  :value="item.skuId"
                ></el-option>
              </el-select>
            </div>
            <div slot-scope="scope" v-else>
              <span>{{scope.row.skuName}}</span>
            </div>
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
          <el-table-column prop="amountVal" label="小计" align="center"></el-table-column>
          <el-table-column prop="previousPrice" label="上次售价" align="center" :formatter="formatPrice"></el-table-column>
        </el-table>
        <div class="infoTotal">
          <p>商品合计：¥{{filterMoney(skuTotalAmount)}}</p>
          <p>应付款：¥{{tableData.orderType == 0 ? filterMoney(skuTotalAmount) : 0}}</p>
        </div>
        <div class="button-box">
          <el-button type="primary" @click="submitForm('orderForm')">保 存</el-button>
          <el-button type="primary" @click="clearTimeLimit">取 消</el-button>
        </div>
      </div>
    </el-form>
    <setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
    <toast ref="toast" desc="异常订单已处理成功" @callback="toastCallback"></toast>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  getOrderDetail,
  getOrderAbnormalDetailItem,
  likeOrderItemList,
  saveAbnormalOrderBase,
  saveAbnormalOrderSku,
  getOldOrderInfo,
  removeOrderSolveLock
} from "@/api/order/orderManage";
import { nameList } from "@/api/projectController/projectController";
import { listdept } from "@/api/customerManage";
import { customerNameList, customerUserNameList, customerUserGroupList } from "@/api/order/saleDown";
import qs from 'qs';
import setAddress from "../child/set_address";
import toast from "@/components/common/module/Toast";
import { isEmptyObject, returnFloat, returnFloatFour } from "@/utils/index";
export default {
  inject: ["close"],
  name:'OrderSolve',
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入相关内容"));
      }
      callback();
    };
    return {
      orderId: "",
      invalidType: "", //无效类型1商品信息缺少2基本信息缺少
      tableOldData: null,
      startTime:null,
      tableData: {
        customerId: "",
        customerUserId: "",
        id: "",
        projectId: "",
        projectType: "",
        customerUserGroupId:"",
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
      tempskuList: [],
      duplicateSkuList:{},//重复商品集合
      options3: [],
      customerOptions: [],
      purchaseOptions: [],
      remoteCustomerUserGroupList:[],
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
    addhead,
    setAddress,
    toast
  },
  computed: {
    skuTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return sum + item.currentPrice * item.itemQty;
      }, 0);
    },
    rules: function() {
      return this.invalidType == 1 ? this.rulesGood : this.rulesBase;
    }
  },
  methods: {
    init(){
      this.startTime = Date.now();
      this.orderId = this.$route.query.id;
      this.invalidType = this.$route.query.type;
      this.getOlddata();
      this.getdata();
      this.getOrderDetailItem();
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

            //初始获取该客户下的采购人
            this.invalidType == 2 && this.initPurchaseList();
          } else {
            res.data.customerId === 0 && (res.data.customerId = "");
          }

          if (res.data.customerUserGroupId) {
            this.remoteCustomerUserGroupList = [
              {
                id: res.data.customerUserGroupId,
                name: res.data.customerUserGroupName
              }
            ];
            res.data.isCustomerUserGroupDisable = true;
          } else {
            res.data.customerUserGroupId === 0 && (res.data.customerUserGroupId = "");
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
            //省市县只要有一个为null即可编辑收货地址
            if(res.data.recipientAddressProvinceId && res.data.recipientAddressCityId && res.data.recipientAddressCountyId){
              res.data.isAddressDisable = true;
            }else{
              res.data.isAddressDisable = false;
            }
          } else {
            res.data.customerReceiptAddress = "";
          }

          this.tableData = res.data;

          this.ruleReset();
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
    checkCustomerUserId (rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入相关内容"));
      }
      callback();
    },
    getOrderDetailItem() {
      getOrderAbnormalDetailItem(this.orderId).then(res => {
        if (res.code == "000000") {
          res.data.forEach((value, index, arr) => {
            if (value.skuId) {
              arr[index].options = [
                {
                  skuId: value.skuId,
                  skuName: value.skuName || 'name is empty'
                }
              ];
            } else {
              value.skuId = "";
            }
            value.amount = returnFloatFour(value.currentPrice*value.itemQty);
            value.amountVal = this.formatPriceDom(value.amount)
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
    querySkuList(query) {
      // if (!this.tableData.projectId || !this.tableData.customerId) {
      //   this.$message({
      //     message: "请先选择的项目和客户",
      //     type: "error"
      //   });
      //   return false;
      // }
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
    ruleReset(){
      //区分项目类型设置采购人为必填项
      if(this.tableData.projectType == 1 || this.tableData.projectType == 2){
        let tempArr = [
          { validator: this.checkCustomerUserId, trigger: "change", message: "请选择采购人" }
        ];
        this.$set(this.rulesBase, 'customerUserId', tempArr);
      }else{
        this.$delete(this.rulesBase,"customerUserId");
        this.$refs.orderForm.clearValidate('customerUserId'); 
      }
    },
    initCustomer(){
      customerNameList({
        customerName: "",
        projectId: this.tableData.projectId
      }).then(res => {
        this.customerOptions = res.data;
      });
    },
    initPurchaseList(){
      if(this.tableData.customerId || this.tableData.customerUserGroupId){
        customerUserNameList({
          userName: "",
          departmentId:this.tableData.customerUserGroupId,
          customerId: this.tableData.customerId
        }).then(res => {
          this.purchaseOptions = res.data;
        });
      }
    },
    filterRow({ row, rowIndex }) {
      row.index = rowIndex;
      if (this.duplicateSkuList[row.skuId]) {
        return "warning-row";
      }
      return "";
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
          // this.$set(this.skulist, row, {
          //   name: "",
          //   currentDiscount: 0,
          //   currentPrice: 0,
          //   itemQty: 1
          // });
          return false;
        }
        let goods = options.filter((item, index) => {
          return item.skuId == skuId;
        });
        let tempObj = {
          currentDiscount:returnFloat(this.skulist[row].currentPrice/goods[0].websitePrice*100),
          id:this.skulist[row].id,
          oldErpSkuId: this.skulist[row].oldErpSkuId,
          oldErpSkuName: this.skulist[row].oldErpSkuName,
          oldErpCategoryId: this.skulist[row].oldErpCategoryId,
          oldErpCategoryName: this.skulist[row].oldErpCategoryName,
          currentPrice: this.skulist[row].currentPrice,
          previousPrice: this.skulist[row].previousPrice,
          itemQty:this.skulist[row].itemQty,
          amount:this.skulist[row].amount,
          amountVal:this.skulist[row].amountVal,
          options: JSON.parse(JSON.stringify(options))//防止递归引用
        };

        Object.assign(goods[0], tempObj);
        this.$set(this.skulist, row, goods[0]);

        this.setDuplicateSkuList();
      } else {
        this.$set(this.skulist, row, {
          id:this.skulist[row].id,
          oldErpSkuId: this.skulist[row].oldErpSkuId,
          oldErpSkuName: this.skulist[row].oldErpSkuName,
          oldErpCategoryId: this.skulist[row].oldErpCategoryId,
          oldErpCategoryName: this.skulist[row].oldErpCategoryName,
          currentPrice: this.skulist[row].currentPrice,
          previousPrice: this.skulist[row].previousPrice,
          itemQty:this.skulist[row].itemQty,
          amount:this.skulist[row].amount,
          amountVal:this.skulist[row].amountVal,
        });
      }
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(res) {
      Object.assign(this.receiptAddress, res);
      this.tableData.customerReceiptAddress = res.receiptAddress;
    },
    toastCallback(){
      this.close({name:'OrderSolve', to: {name:'OrderAnomalyManage', params:{isUpdate:true}}});
    },
    changeDiscount(row) {
      row.currentPrice = (row.currentDiscount / 100) * row.websitePrice;
    },
    changePrice(row) {
      row.currentDiscount = (row.currentPrice / row.websitePrice) * 100;
    },
    remoteMethod1(query) {
      if (query !== "") {
        nameList({ name: query }).then(res => {
          this.options3 = res.data;
        });
      } else {
        this.options3 = [];
      }
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
          this.initPurchaseList();
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
    projectChange(value) {
      this.tableData.customerId = "";
      this.tableData.customerName = "";
      this.tableData.customerUserId = "";
      this.tableData.customerUserName = "";
      this.tableData.customerUserGroupId = "";
      this.tableData.customerUserGroupName = "";
      this.customerOptions = [];
      this.purchaseOptions = [];
      this.remoteCustomerUserGroupList = [];
      if(value){
        let temp = this.options3.filter(item => {
          return item.id == value;
        });
        this.tableData.projectType = temp[0].type;
        this.ruleReset();
        this.initCustomer();
      }else{
        this.customerUserChange();
      }
    },
    customerChange(value) {
      this.tableData.customerUserId = "";
      this.tableData.customerUserName = "";
      this.purchaseOptions = [];
      this.tableData.customerUserGroupId = "";
      this.tableData.customerUserGroupName = "";
      this.remoteCustomerUserGroupList = [];
      if(value){
        //客户部门list
        this.remotecustomerUserGroup();
        //采购人list
        this.initPurchaseList();
      }else{
        this.customerUserChange();
      }
    },
    customerUserGroupChange(value){
      this.tableData.customerUserId = "";
      this.tableData.customerUserName = "";
      this.purchaseOptions = [];
      if(value){
        this.initPurchaseList();
      }else{
        this.customerUserChange();
      }
    },
    remotecustomerUserGroup(query){
      let data=qs.stringify({departmentName:query});
      if(this.tableData.customerId){
        customerUserGroupList(this.tableData.customerId,data).then(res=>{
          this.remoteCustomerUserGroupList=res.data
        })
      }else{
        this.$message({
            message:'请选择一个客户',
            type: 'warning', 
          })
      }
    },
    customerUserChange(uid) {
      if (uid) {
        let user = this.purchaseOptions.filter(user => {
          return user.userId == uid;
        });
        this.tableData.customerUserPhone = user[0].phone;
        //如已经从旧系统带过来了业务员则不替换
        if(!this.tableData.staffId){
          this.tableData.staffName = user[0].staffName;
          this.tableData.staffId = user[0].staffId;
        }
      } else {
        this.tableData.customerUserPhone = "";
        this.tableData.staffName = "";
        this.tableData.staffId = "";
      }
      if(this.tableData.projectType == 1 || this.tableData.projectType == 2){
        this.$refs.orderForm.validateField('customerUserId', (error) => {
        })
      }
    },
    abnormalOrderProcess() {
      let params, fn;
      if (this.invalidType == 2) {
        fn = saveAbnormalOrderBase;
        if(this.receiptAddress.city || this.receiptAddress.address){
          this.tableData.recipientAddressCityId = this.receiptAddress.city.id;
          this.tableData.recipientAddressCityName = this.receiptAddress.city.name;
          this.tableData.recipientAddressProvinceId = this.receiptAddress.province.id;
          this.tableData.recipientAddressProvinceName = this.receiptAddress.province.name;
          this.tableData.recipientAddressCountyId = this.receiptAddress.county.id;
          this.tableData.recipientAddressCountyName = this.receiptAddress.county.name;
          this.tableData.recipientAddressLine = this.receiptAddress.address;
        }

        params = this.tableData;
      } else {
        let isError = this.skulist.some(sku => {
          return sku.skuId;
        });
        if (!isError) {
          this.$message({
            message: "商品信息不正确，请重新选择",
            type: "error"
          });
          return false;
        }
        fn = saveAbnormalOrderSku;
        params = {
          projectId: this.tableData.projectId,
          id: this.orderId, 
          itemList: this.skulist
        };
      }
      fn(params)
        .then(res => {
          if (res.code == "000000") {
            // this.$message({
            //   message: "异常订单处理成功",
            //   type: "success"
            // });
            //this.$refs.opaDone
            this.$refs.toast.init();
          } else {
            this.$message({
              message: err.message || "异常订单处理失败，请刷新后重试",
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    submitForm(name) {
      let endTime = Date.now();
      if((endTime - this.startTime) > 3600000){
        this.$alert("当前页面停留时间过长，请重新打开。", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.clearTimeLimit();
          }
        });
        return false;
      }
      //是否有重复商品
      if(this.invalidType == 1 && !isEmptyObject(this.duplicateSkuList)){
        this.$message({
          message: "当前订单中，相同商品出现多行条目，请核对后进行跟踪。",
          type: "error"
        });
        return false;
      }

      this.$refs[name].validate(valid => {
        if (valid) {
          this.abnormalOrderProcess();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearTimeLimit(){
      removeOrderSolveLock(this.orderId).then(res => {
        this.close();
      });
    },
    filterMoney(num) {
      return returnFloatFour(num);
    },
    formatPrice(row, col, cellValue) {
      return cellValue === 0 ? cellValue : '￥'+returnFloat(cellValue);
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
</style>
