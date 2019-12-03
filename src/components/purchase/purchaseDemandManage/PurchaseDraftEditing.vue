<template>
  <div class="form-wrapper">
    <addhead headname="基本信息：" iconName="iconjinridingdanshu"></addhead>
    <div>
      <el-form ref="formName" :rules="rules" :model="form" class="form-box">
        <el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="紧急程度：" label-width="110px" class="forms" prop="urgentLevel">
                <el-select v-model="form.urgentLevel">
                  <el-option label="紧急" :value="1"></el-option>
                  <el-option label="不紧急" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票类型：" label-width="135px" class="forms" prop="invoiceType">
                <el-select v-model="form.invoiceType">
                  <el-option label="专票" :value="0"></el-option>
                  <el-option label="普票" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结款方式：" label-width="135px" class="forms" prop="payType">
                <el-select v-model="form.payType">
                  <el-option label="账期" :value="0"></el-option>
                  <el-option label="现金" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否集采：" label-width="110px" class="forms" prop="purchaseType">
                <el-radio-group v-model="form.purchaseType" @change="ChangePurchaseType">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="form.purchaseType==1?'所属组织机构：':'供应商：'"
                label-width="135px"
                class="forms"
                prop="supplierName"
              >
                <el-select
                  v-model="form.supplierName"
                  filterable
                  remote
                  clearable
                  @change="changeSupplierName"
                  placeholder="请输入供应商姓名"
                  :remote-method="supplierRemote"
                  @focus="tips"
                  style="margin-left:0px;"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in supplierName"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="结算单位："
                label-width="135px"
                class="forms"
                prop="billOrganizationName"
              >
                <el-select
                  v-model="form.billOrganizationName"
                  filterable
                  remote
                  clearable
                  placeholder="请输入结算单位名"
                  @change="changeBillOrganizationName"
                  :remote-method="SettlementUnitRemote"
                  style="margin-left:0px;"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in SettlementUnitName"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="到货类型：" label-width="110px" class="forms" prop="deliveryType">
                <el-select v-model="form.deliveryType" @change="ChangeDeliveryType" disabled>
                  <!-- <el-option
                    v-for="item in deliveryTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>-->
                  <el-option label="入仓" :value="0"></el-option>
                  <el-option label="厂直" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库房：" label-width="135px" class="forms" prop="warehouseName">
                <el-select
                  v-model="form.warehouseName"
                  filterable
                  remote
                  clearable
                  placeholder="请输入库房名称"
                  @change="changeWarehouseName"
                  :remote-method="warehouseRemote"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in warehouseName"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="最晚入库时间："
                label-width="135px"
                class="forms"
                prop="latestReceiveTime"
                :rules="form.deliveryType==0?rules.latestReceiveTime:rules.latestReceiveTime1"
              >
                <el-date-picker
                  v-model="form.latestReceiveTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  :disabled="form.deliveryType==1?true:false"
                  placeholder="选择时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="是否预约："
                label-width="110px"
                class="forms"
                :prop="form.deliveryType==0?'appointReceive':''"
              >
                <el-radio-group
                  v-model="form.appointReceive"
                  :disabled="form.deliveryType==1?true:false"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="是否质检："
                label-width="135px"
                class="forms"
                :prop="form.deliveryType==0?'qualityTesting':''"
              >
                <el-radio-group
                  v-model="form.qualityTesting"
                  :disabled="form.deliveryType==1?true:false"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否含税：" label-width="135px" class="forms" prop="includeTax">
                <el-radio-group v-model="form.includeTax">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="收货人：" label-width="110px" class="forms" prop="recipientName">
                <el-input v-model="form.recipientName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="收货人联系方式："
                label-width="135px"
                class="forms"
                prop="recipientPhone"
              >
                <el-input v-model="form.recipientPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否快递：" label-width="135px" class="forms" prop="expressDelivery">
                <el-radio-group v-model="form.expressDelivery">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item
                label="快递单号："
                label-width="110px"
                class="forms"
                :rules="form.expressDelivery==1?rules.expressDeliveryNo:rules.expressDeliveryNo1"
                prop="expressDeliveryNo"
              >
                <el-input v-model="form.expressDeliveryNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="收货地址："
                label-width="110px"
                class="addressBox"
                prop="recipientAddressProvinceId"
              >
                <el-select
                  v-model="form.recipientAddressProvinceId"
                  placeholder="选择省/直辖市"
                  @change="onProvincesChange"
                >
                  <el-option
                    v-for="(item,index) in province"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="form.recipientAddressCityId"
                  placeholder="选择城市"
                  @change="onCityChange"
                >
                  <el-option
                    v-for="(item,index) in city"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select v-model="form.recipientAddressCountyId" placeholder="选择区/县">
                  <el-option
                    v-for="(item,index) in county"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-input
                  v-model="form.recipientAddressLine"
                  class="addressLine"
                  placeholder="详细地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>商品明细：</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="splitList">
            <i class="iconfont iconzengjia"></i>拆分
          </div>
          <div class="button-head" @click="addRow" v-if="$authorities.PurchseManageAdd">
            <i class="iconfont iconzengjia"></i>添加
          </div>
          <div class="button-head" @click="delData" v-if="$authorities.PurchseManageAdd">
            <i class="iconfont iconjianshao-"></i>移除
          </div>
          <div class="button-head" @click="exportList">
            <i class="iconfont icondaochu"></i>导出
          </div>
          
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="form.purchaseOrderItemEditingDTOList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" fixed="left" width="55"></el-table-column>
        <el-table-column label="商品编号" align="center" width="150">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.skuNo"
              @blur="changeSkuId(scope.row.skuNo,scope.$index,scope.row)"
              placeholder
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.skuName"
              filterable
              remote
              placeholder="商品名称"
              @change="skuIdChange(scope.$index,scope.row)"
              :remote-method="skuNameRemote"
              :loading="loading"
              clearable
            >
              <el-option
                v-for="item in skuNames"
                :key="item.id"
                :label="item.skuName"
                :value="item"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="skuModel" label="规格" align="center" width="120"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="120"></el-table-column>
        <el-table-column prop="requirementQty" label="需求数" align="center" width="120"></el-table-column>
        <el-table-column label="采购数量" align="center" width="150">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.purchaseQty"
              :step="1"
              :min="0"
              :precision="0"
              size="mini"
              @change="(val) => {changePurchase(val,scope.row)}"
              controls-position="right"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="采购单价" align="center" width="150">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.purchasePrice"
              size="mini"
              :min="0"
              :precision="4"
              @change="(val) => {changePurchase(val,scope.row,scope.$index)}"
              controls-position="right"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center" width="150">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.showAmount"
              size="mini"
              clearable
              @change="(val) =>{changeSubtotal(val,scope.row,scope.$index)}"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="buyingPrice"
          label="采购参考价"
          :formatter="show"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column label="税率" align="center" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.taxRate">
              <el-option label="0%" value="0"></el-option>
              <el-option label="3%" value="0.03"></el-option>
              <el-option label="5%" value="0.05"></el-option>
              <el-option label="6%" value="0.06"></el-option>
              <el-option label="9%" value="0.09"></el-option>
              <el-option label="10%" value="0.10"></el-option>
              <el-option label="13%" value="0.13"></el-option>
              <el-option label="16%" value="0.16"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="totalAmount" label="总金额" align="center" width="120"></el-table-column> -->
        <el-table-column label="折扣率" width="120" align="center">
          <template slot-scope="scope">
            <el-input
              type="number"
              v-model="scope.row.discount"
              @blur="(val) => {digitCheck(val,scope.row)}"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="previousPurchasePrice"
          label="最新采购价"
          :formatter="show"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column prop="finishInventoryQty" label="库存" align="center" width="120">
          <template
            slot-scope="scope"
          >{{form.warehouseName==''?'---':scope.row.finishInventoryQty}}</template>
        </el-table-column>
        <el-table-column label="预计到货日期" align="center" width="225">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.expectedDeliveryDate"
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
              :picker-options="pickerOptions"
              placeholder="选择日期"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="采购说明" align="center" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.itemMemo"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="addPurchaseApprovalOrder('formName','submit')">提交采购单</el-button>
      <el-button type="primary" @click="addPurchaseApprovalOrder('formName','draft')">保存草稿</el-button>
      <el-button type="primary" @click="closed">返回</el-button>
    </div>
    <Toast ref="Toast" :desc="desc" @callback="toastCallback"></Toast>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";

import { provinces_based_id, subs } from "@/api/basicSupplier";

import {
  getSupplierName,
  getWarehouseName,
  addPurchaseApproval,
  getManagementInfo,
  getManagementInfoName,
  getGoodsInventory,
  getLastPurchasePrice,
  getOrganizationSupplier,
  getSetupOrganization
} from "@/api/purchaseApproval";
import Toast from "@/components/common/module/Toast.vue";
import {
  nameList,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";
import {
  purchaseEditingInfo,
  purchaseToDraft,
  purchaseDraftSubmit,
  resetPurchaseDraft,
  exportDraftList
} from "@/api/purchase/purchase.js";

import { type } from "os";

export default {
  inject: ["close"],
  name: "PurchaseDraftEditing",
  data() {
    var checkChina = (rule, value, callback) => {
      var isChina = /^[\u4e00-\u9fa5]+$/;
      if (!isChina.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的快递单号"));
      }
    };
    return {
      province: [],
      city: [],
      county: [],
      skuNames: [],
      options: [],
      value: [],
      timeout: null,
      list: [],
      multipleSelection: [],
      num: "",
      loading: false,
      supplierId: "",
      supplierName: [],
      SettlementUnitName: [],
      warehouseId: "",
      warehouseName: [],
      skuId: "",
      rejectreason: "",
      rejectdialog: false,
      id: null,
      type: "0",
      radio: 0,
      name: "",
      desc: "",
      form: {
        appointReceive: null,
        billOrganizationId: null,
        billOrganizationName: null,
        deliveryType: 0,
        expressDelivery: null,
        expressDeliveryNo: null,
        includeTax: null,
        invoiceType: null,
        purchaseOrderItemEditingDTOList: [],
        id: null,
        latestReceiveTime: null,
        payType: null,
        purchaseType: null,
        qualityTesting: null,
        recipientAddressCityId: null,
        recipientAddressCountyId: null,
        recipientAddressLine: null,
        recipientAddressProvinceId: null,
        recipientName: null,
        recipientPhone: null,
        supplierId: null,
        supplierName: null,
        urgentLevel: null,
        warehouseId: null,
        warehouseName: null
      },
      forms: {
        appointReceive: null,
        billOrganizationId: null,
        billOrganizationName: null,
        deliveryType: 0,
        expressDelivery: null,
        expressDeliveryNo: null,
        includeTax: null,
        invoiceType: null,
        purchaseOrderItemEditingDTOList: [],
        id: null,
        latestReceiveTime: null,
        payType: null,
        purchaseType: null,
        qualityTesting: null,
        recipientAddressCityId: null,
        recipientAddressCountyId: null,
        recipientAddressLine: null,
        recipientAddressProvinceId: null,
        recipientName: null,
        recipientPhone: null,
        supplierId: null,
        supplierName: null,
        urgentLevel: null,
        warehouseId: null,
        warehouseName: null
      },
      rules: {
        urgentLevel: [
          {
            required: true,
            message: "选择紧急程度",
            trigger: "change",
            trigger: "blur"
          }
        ],
        invoiceType: [
          {
            required: true,
            message: "选择发票类型",
            trigger: "change",
            trigger: "blur"
          }
        ],
        billOrganizationName: [
          {
            required: true,
            message: "请选择结算单位名称",
            trigger: "change",
            trigger: "blur"
          }
        ],
        deliveryType: [
          { required: true, message: "请选择到货类型", trigger: "change" }
        ],
        expressDelivery: [
          {
            required: true,
            message: "请选择是否快递",
            trigger: "change",
            trigger: "blur"
          }
        ],
        expressDeliveryNo1: [
          { message: "请输入快递单号", trigger: "blur" },
          {
            validator: checkChina,
            trigger: "blur"
          }
        ],
        expressDeliveryNo: [
          { required: true, message: "请输入快递单号", trigger: "blur" },
          {
            validator: checkChina,
            trigger: "blur"
          }
        ],
        includeTax: [
          {
            required: true,
            message: "请选择是否含税",
            trigger: "change",
            trigger: "blur"
          }
        ],
        latestReceiveTime: [
          {
            required: true,
            message: "请选择最晚入库时间",
            trigger: "change",
            trigger: "blur"
          }
        ],
        latestReceiveTime1: [
          { message: "请选择最晚入库时间", trigger: "blur" }
        ],
        payType: [
          {
            required: true,
            message: "请选择采购方式",
            trigger: "change",
            trigger: "blur"
          }
        ],
        purchaseType: [
          {
            required: true,
            message: "请选择采购类型",
            trigger: "change",
            trigger: "blur"
          }
        ],
        qualityTesting: [
          {
            required: true,
            message: "请输入是否进行质量检测",
            trigger: "change"
          }
        ],
        qualityTesting1: [
          { message: "请输入是否进行质量检测", trigger: "blur" }
        ],
        recipientAddressProvinceId: [
          {
            required: true,
            message: "请输入收货地址",
            trigger: "change",
            trigger: "blur"
          }
        ],
        recipientName: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" }
        ],
        recipientPhone: [
          { required: true, message: "请输入收货人联系方式", trigger: "blur" }
        ],
        supplierName: [
          {
            required: true,
            message: "请输入供应商名称",
            trigger: "change",
            trigger: "blur"
          }
        ],
        appointReceive: [
          {
            required: true,
            message: "请选择是否到货预约",
            trigger: "change",
          }
        ],
        appointReceive1: [
          { message: "请选择是否到货预约", trigger: "change" }
        ],
        warehouseName: [
          {
            required: true,
            message: "请输入库房名称",
            trigger: "change",
            trigger: "blur"
          }
        ],
        warehouseName1: [
          { message: "请输入库房名称", trigger: "change", trigger: "blur" }
        ]
      },
      skuIds: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      deliveryTypes: [
        {
          value: 0,
          label: "入仓"
        }
      ]
    };
  },
  components: {
    addhead,
    Toast
  },
  activated() {
    this.getProvinces();
    purchaseEditingInfo(this.$route.query.id).then(res => {
      if (res.code == "000000") {
        this.form = Object.assign(this.form, res.data);
        this.getcity(this.form.recipientAddressProvinceId);
        this.getcounty(this.form.recipientAddressCityId);
        if (this.form.purchaseOrderItemEditingDTOList) {
          this.form.purchaseOrderItemEditingDTOList.forEach((item, i) => {
            // // this.$refs.multipleTable[0].toggleRowSelection(this.form.purchaseOrderItemEditingDTOList[i], true);
            // this.$refs.multipleTable.toggleRowSelection(
            //         item
            //       );
            this.$set(item, "showAmount", item.amount.toFixed(2));
          });
        }
      }
    });
  },
  methods: {
    toastCallback() {
      this.getProvinces();
      purchaseEditingInfo(this.$route.query.id).then(res => {
        if (res.code == "000000") {
          this.form = Object.assign(this.form, res.data);
          this.getcity(this.form.recipientAddressProvinceId);
          this.getcounty(this.form.recipientAddressCityId);
          if (this.form.purchaseOrderItemEditingDTOList) {
            this.form.purchaseOrderItemEditingDTOList.forEach(item => {
              this.$set(item, "showAmount", item.amount.toFixed(2));
              this.$refs.multipleTable.toggleRowSelection(item, true);
            });
          }
        }
      });
    },
    exportList() {
      let obj = {};
      // obj = Object.assign({}, this.form);
      obj=Object.assign({},this.form);
      obj.purchaseOrderItemEditingDTOList.forEach((item, index) => {
        if (item === null) {
          item = "";
        }
      });
      if(obj.purchaseOrderItemEditingDTOList&&obj.purchaseOrderItemEditingDTOList.length){
         exportDraftList(obj.purchaseOrderItemEditingDTOList).then(res => {
         let url = window.URL.createObjectURL(
          new Blob([res], { type: "application/xls" })
        );
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "采购草稿单商品明细.xls");
        document.body.appendChild(link);
        link.click();
        
        // downloadFile(res);
      });    
      }else{
       this.$alert("导出的列表数据为空，请先添加数据!", "导出提示", {
              confirmButtonText: "确定"
            });
      }
    },
    splitList() {
      this.$confirm(
        `拆分后，您选择的商品及数量将生成一张新的采购草稿单，是否确认？`,
        "拆分提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(res => {
          let obj = {};
          obj = Object.assign({}, this.form);
          if (this.multipleSelection.length) {
            obj.purchaseOrderItemEditingDTOList = this.multipleSelection.filter(
              item => {
                return item.requirementQty > 0;
              }
            );
            if (obj.purchaseOrderItemEditingDTOList.length) {
              resetPurchaseDraft(obj).then(res => {
                if (res.code == "000000") {
                  let str = res.data;
                  this.desc = `新采购单编号：${str}`;
                  this.$refs.Toast.init();
                }
              });
            } else {
              this.$alert("拆分数量不可大于需求数,请重新填写拆分数量", "提示", {
                confirmButtonText: "确定"
              });
            }
          } else {
            this.$alert("请选择商品明细", "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(() => {});
    },
    tips() {
      this.supplierName = [];
      if (this.form.purchaseType == null) {
        this.$message({
          message: "必须先选择集采方式！",
          type: "error"
        });
      }
    },
    supplierRemote(query) {
      this.loading = true;
      var storage = window.localStorage;
      var UserInfo = storage.getItem("UserInfo");
      var userPosts = JSON.parse(UserInfo).userPosts;
      var organizationId = userPosts[0].organizationId;
      if (this.form.purchaseType == 0) {
        if (query) {
          getOrganizationSupplier(organizationId, { name: query }).then(res => {
            this.loading = false;
            if (res.code == "000000") {
              this.supplierName = res.data;
            }
          });
        }
      } else {
        if (query) {
          getSetupOrganization(query).then(res => {
            this.loading = false;
            if (res.code == "000000") {
              this.supplierName = res.data;
            }
          });
        }
      }
    },
    changeSupplierName(val) {
      this.form.supplierName = val.name;
      this.form.supplierId = val.id;
    },
    SettlementUnitRemote(query) {
      this.loading = true;
      if (query) {
        organizationListName({ name: query }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.SettlementUnitName = res.data;
          }
        });
      }
    },
    changeBillOrganizationName(val) {
      this.form.billOrganizationName = val.name;
      this.form.billOrganizationId = val.id;
    },
    warehouseRemote(query) {
      this.loading = true;
      var storage = window.localStorage;
      var UserInfo = storage.getItem("UserInfo");
      var userPosts = JSON.parse(UserInfo).userPosts;
      var organizationId = userPosts[0].organizationId;
      if (query) {
        getWarehouseName({ name: query, organizationId: organizationId }).then(
          res => {
            this.loading = false;
            if (res.code == "000000") {
              this.warehouseName = res.data;
            }
          }
        );
      }
    },
    ChangeDeliveryType(val) {
      this.form.warehouseName = "";
      this.form.warehouseId = null;
      this.form.recipientName = "";
      this.form.recipientPhone = "";
      this.form.recipientAddressProvinceId = "";
      this.form.recipientAddressCityId = "";
      this.form.recipientAddressCountyId = "";
      this.form.recipientAddressLine = "";
    },
    changeWarehouseName(val) {
      if (val) {
        this.form.warehouseName = val.name;
        this.form.warehouseId = val.id;
        if (this.form.deliveryType == 0) {
          if (val.provinceId == 0) {
            this.form.recipientAddressProvinceId = "";
            this.form.recipientAddressCityId = "";
            this.form.recipientAddressCountyId = "";
            this.form.recipientAddressLine = "";
          } else {
            this.getcity(val.provinceId);
            this.getcounty(val.cityId, val);
          }
          if (val.warehouseContactDTOList.length > 0) {
            this.form.recipientName = val.warehouseContactDTOList[0].name;
            this.form.recipientPhone = val.warehouseContactDTOList[0].phone;
          }
        }
      }
    },
    ChangePurchaseType(val) {
      this.form.supplierName = "";
      this.warehouseName = [];
      this.form.purchaseType = val;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeSkuId(skuId, index, row) {
      var reg = /^[0-9]/;
      var repeat = this.isRepeat(skuId, "skuNoType");
      if (repeat) {
        if (reg.test(skuId)) {
          if (skuId != null && skuId != "") {
            getManagementInfo(skuId).then(res => {
              if (res.code == "000000") {
                if (res.data == "") {
                  this.list.skuId = skuId;
                  for (let key in this.list) {
                    this.form.purchaseOrderItemEditingDTOList[index][
                      key
                    ] = this.list[key];
                  }
                } else {
                  this.getGoodsInventory(res.data.skuId, index);
                  for (let key in res.data) {
                    if (key == "taxRate") {
                      this.form.purchaseOrderItemEditingDTOList[index][
                        key
                      ] = res.data[key].toString();
                    } else {
                      this.form.purchaseOrderItemEditingDTOList[index][key] =
                        res.data[key];
                    }
                  }
                  this.form.purchaseOrderItemEditingDTOList[index].discount = 1;
                  this.form.purchaseOrderItemEditingDTOList[
                    index
                  ].purchasePrice = null;
                  this.form.purchaseOrderItemEditingDTOList[
                    index
                  ].purchaseQty = null;
                  this.form.purchaseOrderItemEditingDTOList[
                    index
                  ].showAmount = null;
                }
              }
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请输入纯数字的商品编号！"
          });
          row.skuNo = null;
        }
      } else {
        this.$message({
          type: "error",
          message: "同一个采购单中不可以存在多个相同的商品！"
        });
        this.form.purchaseOrderItemEditingDTOList[index].skuNo = null;
      }
    },
    isRepeat(skuNo, type) {
      var repeatNum = 0;
      this.form.purchaseOrderItemEditingDTOList.forEach((item, index) => {
        if (item.skuNo == skuNo) {
          repeatNum++;
        }
      });
      if (type == "skuNoType" && repeatNum <= 1) {
        return true;
      } else if (type == "nameType" && repeatNum == 0) {
        return true;
      } else {
        return false;
      }
    },
    show(row, column) {
      let changeData = "";
      if (column.property == "previousPurchasePrice") {
        if (
          row.previousPurchasePrice != "" &&
          row.previousPurchasePrice != undefined
        ) {
          return (changeData =
            "￥" + Number(row.previousPurchasePrice).toFixed(4));
        } else {
          let previousPurchasePrice = 0;
          return (changeData = "￥" + previousPurchasePrice.toFixed(4));
        }
      }
      if (column.property == "buyingPrice") {
        if (row.buyingPrice != "" && row.buyingPrice != undefined) {
          return (changeData = "￥" + row.buyingPrice.toFixed(4));
        }
      }
    },
    changeSubtotal(val, row, index) {
      if(val<0){
        this.$message({
          message:'小计不能为负数',
          type:'error'
        })
       this.form.purchaseOrderItemEditingDTOList[index].showAmount=0.00.toFixed(2);
      }else{
      row.showAmount = Number(val).toFixed(2);
      row.amount = Number(row.showAmount).toFixed(4);
      console.log(row.amount);
      if (row.purchaseQty) {
        row.purchasePrice = (row.amount / row.purchaseQty).toFixed(4);
        row.totalAmount = (row.purchaseQty * row.purchasePrice).toFixed(2);
      } 
      }
    },
    changePurchase(val, row, index) {
      row.totalAmount = (row.purchaseQty * row.purchasePrice).toFixed(2);
      row.amount = (row.purchaseQty * row.purchasePrice).toFixed(4);
      row.showAmount = (row.purchaseQty * row.purchasePrice).toFixed(2);
    },
    digitCheck(val, row) {
      if (0 < Number(row.discount) && Number(row.discount) < 1) {
        let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (!reg.test(val)) {
          row.discount = Number(row.discount).toFixed(2);
        }
      } else {
        if (Number(row.discount) == 1) {
          row.discount = 1;
        } else {
          row.discount = 0;
        }
      }
    },
    skuNameRemote(query) {
      this.loading = true;
      if (query) {
        getManagementInfoName(query).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.skuNames = res.data;
          }
        });
      }
    },
    skuIdChange(index, row) {
      var skuNames = [];
      skuNames = this.skuNames.filter((item, index) => {
        return row.skuName.skuNo == item.skuNo;
      });
      if (skuNames.length == 0) {
        this.form.purchaseOrderItemEditingDTOList[
          index
        ] = this.form.purchaseOrderItemEditingDTOList[index];
      } else {
        var repeat = this.isRepeat(skuNames[0].skuNo, "nameType");
        if (repeat) {
          getLastPurchasePrice(skuNames[0].skuId).then(res => {
            if (res.code == "000000") {
              this.form.purchaseOrderItemEditingDTOList[index][
                "previousPurchasePrice"
              ] = res.data;
            }
          });
          this.getGoodsInventory(skuNames[0].skuId, index);
          for (let key in skuNames[0]) {
            if (key == "taxRate") {
              this.form.purchaseOrderItemEditingDTOList[index][
                key
              ] = skuNames[0][key].toString();
            } else {
              this.form.purchaseOrderItemEditingDTOList[index][key] =
                skuNames[0][key];
            }
          }
          this.form.purchaseOrderItemEditingDTOList[index].discount = 1;
          this.form.purchaseOrderItemEditingDTOList[index].purchasePrice = null;
          this.form.purchaseOrderItemEditingDTOList[index].purchaseQty = null;
          this.form.purchaseOrderItemEditingDTOList[index].showAmount = null;
        } else {
          this.$message({
            type: "error",
            message: "同一个采购单中不可以存在多个相同的商品！"
          });
          this.form.purchaseOrderItemEditingDTOList[index].skuName=''
          // debugger
          // this.form.purchaseOrderItemEditingDTOList[index] = this.list;
        }
      }
    },
    getGoodsInventory(skuId, index) {
      this.skuIds = [];
      if (skuId != "" && this.form.warehouseId != "") {
        this.skuIds.push(skuId);
        getGoodsInventory({
          skuIds: this.skuIds,
          warehouseId: this.form.warehouseId
        }).then(res => {
          if (res.code == "000000") {
            if (res.data.length == 0) {
              this.form.purchaseOrderItemEditingDTOList[index][
                "finishInventoryQty"
              ] = 0;
            } else {
              this.form.purchaseOrderItemEditingDTOList[index][
                "finishInventoryQty"
              ] = res.data[0].availableQty;
            }
            this.skuIds = [];
          }
        });
      }
    },
    addPurchaseApprovalOrder(formName, type) {
      let obj = {};
      obj = Object.assign({}, this.form);
      obj.purchaseOrderItemEditingDTOList = this.multipleSelection;
      if (type == "draft") {
        purchaseToDraft(obj)
          .then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.form = JSON.parse(JSON.stringify(this.forms));
              this.timeout = setTimeout(() => {
                this.$refs[formName].clearValidate();
                this.close({
                  name: "PurchaseDraftEditing",
                  to: { name: "PurchaseOrder", params: { isUpdate: true } }
                });
              }, 1000 * Math.random());
            }
          })
          .catch(rej => {});
      } else if (type == "submit") {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (obj.purchaseOrderItemEditingDTOList) {
              
              purchaseDraftSubmit(obj)
                .then(res => {
                  if (res.code == "000000") {
                    this.$message({
                      message: "保存成功",
                      type: "success"
                    });
                    this.form = JSON.parse(JSON.stringify(this.forms));
                    this.timeout = setTimeout(() => {
                      this.$refs[formName].clearValidate();
                      this.close({
                        name: "PurchaseDraftEditing",
                        to: {
                          name: "PurchaseOrder",
                          params: { isUpdate: true }
                        }
                      });
                    }, 1000 * Math.random());
                  }
                })
                .catch(rej => {});
            } else {
              this.$message({
                message: "商品明细不能为空,请勾选商品明细",
                type: "error"
              });
            }
          } else {
            return false;
          }
        });
      }
    },
    addRow() {
      var list = {
        buyingPrice: "",
        discount: 1,
        expectedDeliveryDate: "",
        itemMemo: "",
        previousPurchasePrice: "",
        purchasePrice: "",
        purchaseQty: "",
        skuId: "",
        skuNo: null,
        requirementQty: 0,
        skuModel: "",
        skuName: "",
        taxRate: "",
        unit: "",
        amount: 0.00,
        showAmount:'0.00',
        totalAmount: "",
        finishInventoryQty: "",
        rowNum: ""
      };
      if (!this.form.purchaseOrderItemEditingDTOList) {
        this.form.purchaseOrderItemEditingDTOList = [];
        list.rowNum = 1;
        this.form.purchaseOrderItemEditingDTOList.push(list);
      } else {
        this.form.purchaseOrderItemEditingDTOList.push(list);
        list.rowNum = this.form.purchaseOrderItemEditingDTOList.length;
      }
    },
    delData() {
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   let val = this.multipleSelection;
      //   val.forEach((val, index) => {
      //     this.form.purchaseOrderItemEditingDTOList.forEach((v, i) => {
      //       if (val.rowNum === v.rowNum) {
      //         this.form.purchaseOrderItemEditingDTOList.splice(i, 1);
      //       }
      //     });
      //   });
      // }
      let str = [];
      str = this.multipleSelection.map((item, index) => {
        return item.skuId;
      });
      if (!str.length) {
        this.$confirm("请先选择商品明细", "移除提示", {
          confirmButtonText: "确定",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
      } else {
        this.form.purchaseOrderItemEditingDTOList = this.form.purchaseOrderItemEditingDTOList.filter(
          (item, i) => {
            return !str.includes(item.skuId);
          }
        );
      }
      // this.$refs.multipleTable.clearSelection();
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.province = res.data;
        }
      });
    },
    getcity(id) {
      subs(id).then(res => {
        if (res.code == "000000") {
          this.city = res.data;
        }
      });
    },
    getcounty(id, val) {
      subs(id).then(res => {
        if (res.code == "000000") {
          this.county = res.data;
          if (val) {
            this.form.recipientAddressProvinceId = val.provinceId;
            this.form.recipientAddressCityId = val.cityId;
            this.form.recipientAddressCountyId = val.countyId;
            this.form.recipientAddressLine = val.addressLine;
          }
        }
      });
    },
    onCityChange(val) {
      this.form.recipientAddressCountyId = "";
      this.getcounty(val);
    },
    onProvincesChange(val) {
      this.form.recipientAddressCityId = "";
      this.getcity(val);
    },
    closed() {
      this.close({
        name: "PurchaseDraftEditing",
        to: {
          name: "PurchaseOrder",
          params: { isUpdate: true },
          query: { active: -2 }
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@color: #f3f3f3;
.form-wrapper {
  margin-top: 20px;
  border-right: 1px solid #e4e4e4;
  border-left: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  .form-box {
    /deep/.el-row {
      margin: 25px 0 0 50px;
      .forms {
        .el-form-item__content {
          display: inline-block;
          width: 53%;
          margin-left: 0 !important;
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
        }
      }
      .addressBox {
        flex-wrap: nowrap;
        display: flex;
        .el-form-item__content {
          width: 80%;
          display: flex;
          flex-wrap: nowrap;
          margin-left: 0 !important;
          .el-select {
            width: 20%;
            flex-grow: 0;
            flex-shrink: 0;
          }
          .addressLine {
            width: 25%;
          }
        }
      }
    }
  }
}
.listBox {
  font-size: 12px;
  background-color: @color;
  border: 1px solid #e4e4e4;
  clear: both;
  margin: 20px 0 0 0;
  .listBoxTop {
    display: flex;
    justify-content: space-between;
    .listBoxTop-left {
      .myicon {
        margin-left: 20px;
        font-weight: bold;
        font-size: 20px;
      }
      span {
        margin-left: 5px;
        font-size: 14px;
        color: #303133;
        line-height: 50px;
      }
    }
  }
  .listBoxRight {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
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
    .button-head:hover {
      background-color: #f3f3f3;
    }
    .el-button {
      width: 80px;
      height: 30px;
      margin-top: 10px;
    }
  }
  .el-table {
    margin-top: -2px;
    .el-button {
      font-size: 12px;
    }
    /deep/.el-input--small {
      .el-input__inner {
        width: 85%;
      }
    }
    /deep/.el-select {
      width: 100%;
    }
    /deep/.el-input-number--mini {
      width: 100%;
    }
  }
}
.button-box {
  width: 90%;
  margin: 20px auto 50px;
  display: flex;
  justify-content: flex-end;
}
</style>
