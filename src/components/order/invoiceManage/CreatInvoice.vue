<template>
  <div class="detaillBox">
    <el-form inline :rules="rules" :model="tableData" ref="invoiceForm">
      <div class="detaillTable">
        <addhead headname="发货信息"></addhead>
        <div class="orderInfo">
          <div class="chunk" style="width:100%;">
            <span>
              <i>*</i>到货类型：
            </span>
            <el-form-item prop="inStoreType">
              <el-radio-group v-model="tableData.inStoreType" @change="changeInStoreType">
                <el-radio :label="0">入仓</el-radio>
                <el-radio :label="1">厂直</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="detaillTable" v-if="tableData">
        <addhead headname="基本信息"></addhead>
        <div class="orderInfo">
          <div class="chunk">
            <span>
              <i>*</i>项目名：
            </span>
            <el-form-item prop="projectId">
              <el-select
                v-model="tableData.projectId"
                filterable
                remote
                placeholder="项目名"
                :remote-method="(query)=>{
              querySearchName(query,'name','remoteProjectList')
            }"
                :loading="remoteLoading"
                @change="changeProject"
                clearable
              >
                <el-option
                  v-for="item in remoteProjectList"
                  :key="item.id+item.name"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="chunk">
            <span>
              <i>*</i>客户名：
            </span>
            <el-form-item prop="customerId">
              <el-select
                v-model="tableData.customerId"
                filterable
                remote
                placeholder="客户名"
                :remote-method="(query)=>{
            querySearch(query,'customer','remoteCustomerList')
          }"
                :loading="remoteLoading"
                @change="changeCustomer"
                clearable
              >
                <el-option
                  v-for="item in remoteCustomerList"
                  :key="item.id+item.name"
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
              placeholder="客户部门"
              :remote-method="remotecustomerUserGroup"
              @change="changeCustomerUserGroup"
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
            <span>客户采购人：</span>
            <el-select
              v-model="tableData.customerUserId"
              filterable
              remote
              placeholder="客户采购人"
              :remote-method="(query)=>{
            querySearch(query,'customerUser','remoteCustomerUserList')
          }"
              @change="changeCustomerUser"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteCustomerUserList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.userId"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>业务员：</span>
            <el-input v-model="tableData.staffName" :disabled="true"></el-input>
          </div>
          <!-- <div class="chunk">
            <span>业务员：</span>
            <el-select
              v-model="tableData.staffId"
              filterable
              remote
              placeholder="业务员"
              :remote-method="(query)=>{
            querySearch(query,'manager','remoteStaffUserList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteStaffUserList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>-->
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
              <el-autocomplete
                v-model="tableData.recipientName"
                :fetch-suggestions="querySearchRecipient"
                placeholder="请输入"
                @select="changeRecipientInfo"
                popper-class="down_cl"
              ></el-autocomplete>
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
          <div class="button-head" @click="addGoods">
            <i class="icontianjiashangpin iconfont button-head-icon"></i>添加
          </div>
          <el-checkbox v-model="useCustomerFlag" @change="customerLogChange"  style="padding: 0px 10px;">按客户购买记录选商品</el-checkbox>
          <div
            :class="['button-head', { 'button-head-disabled':tableData.inStoreType == 1 }]"
            style="width:160px;"
            @click="getWarehouseData"
          >获取库存和成本</div>
          <div class="button-head" @click="showDialog('importFile')">
            <i class="icondaoru iconfont button-head-icon"></i>导入
          </div>
          <div class="button-head" @click="getExcelBefore">
            <i class="icondaochu iconfont button-head-icon"></i>导出
          </div>
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
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delGoodsConfirm(scope.row)">删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="scope.row.skuId && showDialog('skuRemarks',{info:scope.row,type:1})"
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
            <template slot-scope="scope">
              <el-select
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
                  v-for="(item,index) in scope.row.options"
                  :key="item.skuId+index"
                  :label="item.skuName"
                  :value="item.skuId"
                ></el-option>
              </el-select>
            </template>
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
            <template slot-scope="scope">
              <el-input
                type="number"
                size="small"
                v-model="scope.row.currentPrice"
                @input="changePrice(scope.row)"
                @blur="changePriceBlur(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="itemQty"
            label="数量"
            align="center"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope">
              <el-input
                type="number"
                size="small"
                :min="1"
                v-model="scope.row.itemQty"
                @change="changeAmount(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amountVal" label="小计" align="center">
            <template slot-scope="scope">
              <el-input
                type="number"
                size="small"
                :min="1"
                v-model="scope.row.amountVal"
                @input="changeCurrentPrice(scope.row)"
                @blur="changeAmountVal(scope.row)"
                @keyup.enter.native="addGoods"
              ></el-input>
              <!-- <span>￥{{filterMoney(scope.row.currentPrice*scope.row.itemQty)}}</span> -->
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
          <el-button type="primary" @click="close">取 消</el-button>
        </div>
      </div>
    </el-form>
    <setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
    <skuRemarks ref="skuRemarks" @callback="saveRemark"></skuRemarks>
    <importFile
      ref="importFile"
      :title="'商品信息批量导入'"
      :type="'Erp_Create_Item_Import_Template'"
      :params="importParams"
      @dialogCallBackPayment="orderImportDialogCallback"
    ></importFile>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import importFile from "@/components/common/module/ImportFile";
import qs from "qs";
import {
  creatDeliveryOrder,
  getWarehouseList,
  getSkuList,
  getCustomerRecordSkuList,
  getCustomerRecordSkuCheck,
  getWmsSkuStock,
  getCostPrice
} from "@/api/order/invoiceOrder";
import {
  nameList,
  simpleList
} from "@/api/projectController/projectController";
import { getOrganization } from "@/api/purchase/purchase.js";
import { customerName, listdept } from "@/api/customerManage";
import {
  customerUserNameList,
  customerUserGroupList,
  customerNameList,
  consigneeInformation
} from "@/api/order/saleDown";
import setAddress from "../child/set_address";
import skuRemarks from "../child/sku_remarks";
import { returnFloat, returnFloatFour, returnFloatTwoFour } from "@/utils/index";
import { ftruncate } from "fs";
export default {
  inject: ["close"],
  name: "CreatInvoice",
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入1000以内的数字"));
      }
      callback();
    };
    return {
      tableData: {
        deliveryMemo: "",
        deliveryType: 3,
        inStoreType: 0,
        projectId: "",
        customerId: "",
        customerUserGroupId: "",
        customerUserId: "",
        expectedDeliveryDate: "",
        orderDeliveryItemParamList: [],
        orderId: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressLine: "",
        recipientAddressProvinceId: "",
        customerReceiptAddress: "",
        recipientName: "",
        recipientPhone: "",
        staffId: "",
        staffName: "",
        urgent: 0,
        warehouseId: ""
      },
      stockVal: "--", //可用库存
      receiptAddress: {}, //收货地址
      useCustomerFlag:false,//是否按客户购买记录选商品
      depotList: [],
      depotListBackups: [],
      duplicateSkuList:{},//保存重复商品集合
      remoteLoading: false,
      remoteProjectList: null,
      remoteCustomerList: null,
      remoteCustomerListCopy: null,
      remoteCustomerUserGroupList: null,
      remoteCustomerUserList: null,
      remoteStaffUserList: null,
      skulist: [],
      curSelectSkuPos: "", //当前选中商品的索引
      curSelectSku: null, //当前选中的商品
      tempskuList: [],
      restaurants: [],
      useLeadingWMS: null,//是否启用了wsm
      warehouseSelStatus: false,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() &&
            new Date(time).toDateString() != new Date().toDateString()
          );
        }
      },
      rules: {
        projectId: [
          { validator: check, trigger: "change", message: "项目名不能为空" }
        ],
        customerId: [
          { validator: check, trigger: "change", message: "客户名不能为空" }
        ],
        recipientName: [
          { validator: check, trigger: "change", message: "收货人不能为空" }
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
    this.orderId = this.$route.query.id;
    this.getUseLeadingWMS();
  },
  components: {
    addhead,
    skuRemarks,
    setAddress,
    importFile
  },
  computed: {
    skuTotalAmount: function() {
      return this.skulist.reduce((sum, item) => {
        return sum + parseFloat(item.amountVal);
      }, 0);
    },
    importParams() {
      return {
        projectId: this.tableData.projectId ? this.tableData.projectId : 0,
        customerId: this.tableData.customerId ? this.tableData.customerId : 0
      };
    }
  },
  methods: {
    checkWMS(rule, value, callback) {
      if (!value && this.useLeadingWMS && this.tableData.inStoreType == 0) {
        return callback(new Error("发货仓库不能为空"));
      }
      callback();
    },
    getUseLeadingWMS() {
      if (this.$auth.user.userPosts.length == 0) {
        //用户没有组织机构
        return false;
      }

      // this.rules["warehouseId"] = [
      //   { validator: this.checkWMS, trigger: "change" }
      // ];

      getOrganization(this.$auth.user.userPosts[0].organizationId).then(res => {
        this.useLeadingWMS = res.data.useLeadingWMS;
        this.warehouseSelStatus = false;
        this.getWarehouseList();

        // if (res.data.useLeadingWMS) {
        //   // this.rules['warehouseId']=[
        //   //     { validator: this.checkWMS, trigger: "change" }
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
      });
    },
    getWarehouseList() {
      getWarehouseList(this.$auth.user.userPosts[0].organizationId).then(
        res => {
          if (res.code == "000000") {
            this.depotList = res.data;
            this.depotListBackups = res.data.slice(0);
          }
        }
      );
    },
    getWarehouseData() {
      if (this.tableData.inStoreType == 1) {
        return false;
      }
      if (!this.tableData.warehouseId) {
        this.$message({
          message: "请先选择仓库后，再获取商品库存信息",
          type: "error"
        });
        return false;
      }
      let skuArr = this.skulist.filter(item => {
        return item.skuId;
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

      
      if (!this.useLeadingWMS) {
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

          this.skulist.forEach(item => {
            let stock = warehouse[item.skuId] ? warehouse[item.skuId].availableQty : '--';
            item.stock = stock;
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
            let cost = warehouse[item.skuId] ? warehouse[item.skuId].costTax : '--';
            item.cost = cost;
          });
        }
      });
    },
    changeInStoreType(type) {
      // if (type == 1) {
      //   this.depotList = [
      //     {
      //       id: 0,
      //       name: "无"
      //     }
      //   ];
      //   this.tableData.warehouseId = 0;
      //   this.$refs.invoiceForm.validateField("warehouseId", error => {});
      // } else {
      //   this.depotList = this.depotListBackups.slice(0);
      //   this.tableData.warehouseId = this.depotListBackups[0].id == 0 ? 0 : "";
      // }
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "customer") {
          if (!this.tableData.projectId) {
            this.$message({
              type: "warning",
              message: "请先选择项目"
            });
            this.remoteLoading = false;
            return false;
          }
          customerNameList({
            customerName: query,
            projectId: this.tableData.projectId
          }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "manager") {
          simpleList({ userName: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "customerUser") {
          if (!this.tableData.customerUserGroupId) {
            this.$message({
              type: "warning",
              message: "请先选择客户部门"
            });
            this.remoteLoading = false;
            return false;
          }
          this.remotecustomerUser(query);
        } else {
          this[list] = [];
          this.remoteLoading = false;
        }
      } else {
        this[list] = [];
      }
    },
    querySearchName(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "name") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    changeProject() {
      this.tableData.customerId = "";
      this.tableData.customerName = "";
      this.remoteCustomerList = [];
      if (this.tableData.projectId) {
        //删除项目不能再按客户购买记录查询商品
        this.useCustomerFlag = false;
        customerNameList({
          customerName: "",
          projectId: this.tableData.projectId
        }).then(res => {
          this.remoteCustomerList = res.data;
          this.remoteCustomerListCopy = JSON.parse(JSON.stringify(res.data));
        });
      } else {
        this.changeCustomer("fromProject");
      }
    },
    changeCustomer(from) {
      //删除客户不能再按客户购买记录查询商品
      this.useCustomerFlag = false;
      this.tableData.customerUserGroupId = "";
      this.tableData.customerUserGroupName = "";
      this.remoteCustomerUserGroupList = [];
      if (this.tableData.customerId) {
        this.remotecustomerUserGroup();
        // this.remotecustomerUser();
      } else {
        if (from != "fromProject") {
          this.remoteCustomerList = JSON.parse(
            JSON.stringify(this.remoteCustomerListCopy)
          );
        }
        this.changeCustomerUserGroup();
      }
    },
    changeCustomerUserGroup(ugid) {
      this.tableData.customerUserId = "";
      this.tableData.customerUserName = "";
      this.remoteCustomerUserList = [];
      this.changeCustomerUser();

      if (ugid) {
        this.remotecustomerUser();
      }
    },
    changeCustomerUser(uid) {
      if (uid) {
        let user = this.remoteCustomerUserList.filter(user => {
          return user.userId == uid;
        });
        if (user.length) {
          this.tableData.staffName = user[0].staffName;
          this.tableData.staffId = user[0].staffId;
          this.remoteStaffUserList = [
            {
              id: user[0].staffId,
              realName: user[0].staffName,
              userName: user[0].staffUserName
            }
          ];

          this.getConsigneeInformation(user[0].userId);
        }
      } else {
        this.tableData.staffName = "";
        this.tableData.staffId = "";
        this.remoteStaffUserList = [];
      }
    },
    getConsigneeInformation(uid) {
      consigneeInformation(uid).then(res => {
        let a = res.data.map(item => {
          let b = {
            value:
              item.recipientName +
              "  " +
              item.recipientPhone +
              "  " +
              item.provinceName +
              item.cityName +
              item.countyName
          };
          Object.assign(item, b);
          return item;
        });
        this.restaurants = a;
      });
    },
    remotecustomerUser(query) {
      customerUserNameList({
        username: query || "",
        departmentId: this.tableData.customerUserGroupId,
        customerId: this.tableData.customerId
      }).then(res => {
        this.remoteCustomerUserList = res.data;
      });
    },
    remotecustomerUserGroup(query) {
      let data = qs.stringify({ departmentName: query });
      if (this.tableData.customerId) {
        customerUserGroupList(this.tableData.customerId, data).then(res => {
          this.remoteCustomerUserGroupList = res.data;
        });
      } else {
        this.$message({
          message: "请选择一个客户",
          type: "warning"
        });
      }
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
              this.$set(
                this.skulist[this.curSelectSkuPos],
                "options",
                res.data
              );
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
    getCustomerRecordSkuList(query){
      getCustomerRecordSkuList({
          customerId:this.tableData.customerId,
          projectId:this.tableData.projectId,
          //skuIdList:[],
          skuName: query,
          useCustomerFlag: true
        })
        .then(res => {
          if (res.code == "000000") {
            this.$set(
              this.skulist[this.curSelectSkuPos],
              "options",
              res.data
            );
            this.remoteLoading = false;
          }
        }).catch(rej => {this.remoteLoading = false;});
    },
    customerLogChange(b){
      if(!b) return false;
      if(!this.tableData.projectId || !this.tableData.customerId){
        this.useCustomerFlag=false
        this.$message({
          message:'请先选择项目和客户',
          type: 'error', 
        })
      }else{
        getCustomerRecordSkuCheck(this.tableData.customerId, this.tableData.projectId).then(res => {
          if(!res.data){
            this.$message({
              message:'当前客户无购买记录',
              type: 'error', 
            })
            this.useCustomerFlag=false
          }
        }).catch(rej => {
          this.useCustomerFlag=false;
          this.remoteLoading = false;
        });
      }
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
            itemQty: 1,
            amount:0,
            amountVal:0,
            stock: "--"
          });
          return false;
        }
        let goods = options.filter((item, index) => {
          return item.skuId == skuId;
        });
        //没有当前数值使用默认数值
        let currentPrice = goods[0].currentPrice || goods[0].buyingPrice || goods[0].websitePrice;
        let tempObj = {
          currentPrice: currentPrice,
          itemQty: 1,
          amount: returnFloatFour(currentPrice),
          amountVal: returnFloat(currentPrice),
          stock: "--",
          options: JSON.parse(JSON.stringify(options))
        };

        this.$set(this.skulist, row, Object.assign({}, goods[0], tempObj));
      } else {
        this.$set(this.skulist, row, {
          name: "",
          currentDiscount: 0,
          currentPrice: 0,
          amount: 0,
          amountVal:0,
          itemQty: 1,
          stock: "--"
        });
      }
    },
    changeAmount(row) {
      row.amount = returnFloatFour(row.itemQty * row.currentPrice);
      row.amountVal = returnFloat(row.itemQty * row.currentPrice);
    },
    changeCurrentPrice(row) {
      row.currentPrice = returnFloatFour(row.amountVal / row.itemQty);
    },
    changeAmountVal(row){
      row.amountVal = returnFloat(row.amountVal);
      row.amount = returnFloatFour(row.amountVal);
      this.changeCurrentPrice(row);
    },
    changeRecipientInfo(item) {
      this.tableData.recipientName = item.recipientName;
      this.tableData.recipientPhone = item.recipientPhone;
      this.receiptAddress = {
        province: { id: item.provinceId },
        city: { id: item.cityId },
        county: { id: item.countyId },
        address: item.addressLine,
        receiptAddress:
          item.provinceName +
          "-" +
          item.cityName +
          "-" +
          item.countyName +
          "-" +
          item.addressLine
      };
      this.tableData.recipientAddressLine = item.addressLine;
      this.tableData.recipientAddressProvinceId = item.provinceId;
      this.tableData.recipientAddressCityId = item.cityId;
      this.tableData.recipientAddressCountyId = item.countyId;
      this.tableData.customerReceiptAddress = this.receiptAddress.receiptAddress;
    },
    querySearchRecipient(queryString, cb) {
      var results = queryString
        ? this.restaurants.filter(this.createFilter(queryString))
        : this.restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    changePrice(row) {
      row.currentDiscount = returnFloatFour(
        (row.currentPrice / row.websitePrice) * 100
      );
      row.amount = returnFloatFour(row.itemQty * row.currentPrice);
      row.amountVal = returnFloat(row.itemQty * row.currentPrice);
    },
    changePriceBlur(row) {
      row.currentPrice = returnFloatFour(row.currentPrice);
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
        amount: 0,
        amountVal: 0,
        itemQty: 1,
        stock: this.stockVal
      });
    },
    delGoodsConfirm(row){
      if(row.skuId){
        this.$confirm('确定要删除当前商品条目吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delGoods(row);
        }).catch(() => {});
      }else{
        this.delGoods(row);
      }
    },
    delGoods(row) {
      if(this.duplicateSkuList[row.skuId]){
        delete this.duplicateSkuList[row.skuId];
      }
      this.skulist.splice(row.index, 1);
    },
    getExcelBefore() {
      if (this.skulist.length && this.skulist[0].skuId) {
        this.getExcel(this.skulist);
      } else {
        this.$message({
          message: "请先添加商品",
          type: "error"
        });
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
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    orderImportDialogCallback(res) {
      this.successNumber = res.itemList.length;
      this.failNumber = res.skuErrorNo.length;
      this.skuErrorNo = res.skuErrorNo;
      
      let tempArr = [], checkObj = {};
      res.itemList.forEach((item, index) => {
        //验重
        if(!checkObj[item.skuId]){
          checkObj[item.skuId] = 1;
        }else{
          this.duplicateSkuList[item.skuId] = 1;
        }
        let b = {
          options: [
            {
              skuName: item.skuName,
              skuNo: item.skuNo,
              skuId: item.skuId
            }
          ]
        };
        item.negotiatedDiscount = returnFloat(item.negotiatedDiscount);
        item.currentPrice = item.currentPrice ? returnFloatFour(item.currentPrice) : 0;
        item.itemQty = item.itemQty ? item.itemQty : 0;
        item.amount = returnFloatFour(item.currentPrice*item.itemQty)
        item.amountVal = returnFloat(item.amount)
        Object.assign(item, b);
        tempArr.push(item);
      });

      let tempDom = `<p>成功导入 ${res.itemList.length} 条，失败 ${res.skuErrorNo.length} 条</p>`;
      // if (duplicateSku.length) {
      //   tempDom =  `<p>成功导入 ${res.itemList.length} 条，失败 ${res.skuErrorNo.length} 条，重复商品${duplicateSku.length}条</p>`;
      // }
      if (res.skuErrorNo.length) {
        tempDom += `<p>导入失败商品编号：${res.skuErrorNo}</p>`;
      }
      this.$alert(tempDom, "导入结果", {
        dangerouslyUseHTMLString: true
      });

      this.skulist = tempArr;
    },
    filterRow({ row, rowIndex }) {
      row.index = rowIndex;
      if (this.duplicateSkuList[row.skuId]) {
        return "warning-row";
      }
      return "";
    },
    saveRemark(memo) {
      this.skulist[this.curSelectSkuPos].itemMemo = memo;
    },
    checkInvoiceOrder() {
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
      if (this.skuTotalAmount <= 0) {
        this.$message({
          message: "发货金额总计不能小于0",
          type: "error"
        });
        return false;
      }

      let skuPrice = this.skulist.every(val => {
        return val.currentPrice === 0;
      });

      if (skuPrice) {
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
      let goods = this.skulist.filter((item, index) => {
        return item.skuId;
      });
      this.receiptAddress;
      this.tableData["orderDeliveryItemParamList"] = goods;
      this.tableData[
        "recipientAddressProvinceId"
      ] = this.receiptAddress.province.id;
      this.tableData["recipientAddressCityId"] = this.receiptAddress.city.id;
      this.tableData[
        "recipientAddressCountyId"
      ] = this.receiptAddress.county.id;
      this.tableData["recipientAddressLine"] = this.receiptAddress.address;
      creatDeliveryOrder(this.tableData).then(res => {
        this.$alert("创建发货单成功!", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.close({
              name: "CreatInvoice",
              to: { name: "InvoiceManage", params: { isUpdate: true } }
            });
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
      return "￥" + returnFloat(cellValue);
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
      .el-select,
      .el-autocomplete {
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
