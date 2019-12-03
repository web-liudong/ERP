<template>
  <div class="detaillBox">
    <div class="box">
      <div class="chunk">
        <span>供应商批量设置：</span>
        <el-select
          v-model="betchQuery.supplierId"
          filterable
          remote
          placeholder="供应商批量设置"
          :remote-method="querySearchBetch"
          @change="id=>{
            changeSupplierBetch(id)
          }"
          :loading="remoteLoading"
          clearable
        >
          <el-option
            v-for="item in remoteSupplierList"
            :key="item.id+item.name"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="chunk">
        <span>最晚入库日期批量设置：</span>
        <el-date-picker
          v-model="betchQuery.latestReceiveTime"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <el-button type="primary" @click="toBetchSet()">确认设置</el-button>
    </div>
    <el-form inline :rules="rules" :model="tableData" ref="purchaseForm">
      <div class="detaillTable">
        <div class="add-head">
          <i class="iconfont iconjinridingdanshu"></i>
          &nbsp;
          <p class="add-class-text">采购信息</p>
          <!-- <div class="btns">
            <div class="button-head">
              <i class="icon iconfont">&#xe7bb;</i> 导出
            </div>
            <div class="button-head">
              <i class="icon iconfont">&#xe501;</i> 导入
            </div>
          </div>-->
        </div>
        <el-table
          :data="filterSkuList"
          border
          max-height="400"
          class="table"
          size="small"
          @cell-click="cellClick"
          :row-class-name="tableRowClassName"
          v-if="filterSkuList"
        >
          <el-table-column label="操作" align="center" width="100" fixed="left">
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-button
                type="text"
                size="small"
                v-if="scope.row.requirementQty > 1"
                @click="showDialog('setSplit', {row:scope.row, warehouseList: warehouseList})"
              >拆分</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.itemLevel > 2"
                @click="delRow(scope.row)"
              >撤销</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="no" label="序号" align="center"></el-table-column>
          <el-table-column
            prop="urgentLevel"
            label="紧急"
            align="center"
            width="100"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.urgentLevel"
                placeholder="请选择"
                v-if="scope.row.isUrgentEdit"
              >
                <el-option label="不紧急" :value="0"></el-option>
                <el-option label="紧急" :value="1"></el-option>
              </el-select>
              <span v-else @click="()=>{toggleEdit(scope.row,'isUrgentEdit')}">
                {{scope.row.urgentLevel == 1 ? '紧急' : '不紧急'}}
                <i class="el-icon-edit"></i>
              </span>
              <!-- <el-button
                :type="scope.row.isUrgentEdit?'success':'primary'"
                @click="()=>{toggleEdit(scope.row,'isUrgentEdit')}"
                size="small"
                icon="edit"
              >{{scope.row.isUrgentEdit?'完成':'编辑'}}</el-button>-->
            </template>
          </el-table-column>
          <el-table-column prop="requirementType" label="需求来源" align="center">
            <template
              slot-scope="scope"
              v-if="scope.row.itemLevel != 1"
            >{{scope.row.requirementTypeDesc}}</template>
          </el-table-column>
          <el-table-column prop="requirementCreateTime" label="需求创建时间" align="center">
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              {{timeFormatFun(scope.row.requirementCreateTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center" width="200"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column
            prop="purchaseType"
            label="采购类型"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.purchaseType"
                placeholder="请选择"
                @click.native="getCurPos(scope.row)"
                @change="(type) => {changePurchaseType(type, scope.row)}"
              >
                <el-option label="自主采购" :value="0"></el-option>
                <el-option label="集中采购" :value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="requirementQty" label="需求采购数" align="center"></el-table-column>
          <el-table-column prop="urgentRequirementQty" label="紧急需求数" align="center"></el-table-column>
          <el-table-column
            prop="purchaseQty"
            label="采购数量"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <div slot-scope="scope" v-if="scope.row.itemLevel == 1">{{scope.row.purchaseQty}}</div>
            <div slot-scope="scope" v-else>
              <el-input
                type="number"
                size="small"
                v-model="scope.row.purchaseQty"
                @blur="checkOty(scope.row)"
              ></el-input>
            </div>
          </el-table-column>
          <el-table-column prop="availableStock" label="可用库存" align="center"></el-table-column>
          <el-table-column
            prop="purchasePrice"
            label="采购单价"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-input
                type="number"
                size="small"
                :min="0"
                v-model="scope.row.purchasePrice"
                @blur="formatUnitPrice(scope.row)"
                placeholder="0.0000"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="amountVal"
            label="小计"
            align="center"
            width="120"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-input
                type="number"
                size="small"
                v-model="scope.row.amountVal"
                @blur="formatTotalPrice(scope.row)"
                placeholder="0.00"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="buyingPrice" label="采购参考价" align="center">
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">{{scope.row.buyingPrice}}</template>
          </el-table-column>
          <el-table-column
            prop="includeTax"
            label="是否含税"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-checkbox v-model="scope.row.includeTax" :true-label="1" :false-label="0"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="taxRate"
            label="税率"
            align="center"
            width="100"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.taxRate"
                placeholder="请选择"
                v-if="scope.row.isTaxRateEdit"
              >
                <el-option label="0" :value="0"></el-option>
                <el-option label="3%" :value="3"></el-option>
                <el-option label="5%" :value="5"></el-option>
                <el-option label="6%" :value="6"></el-option>
                <el-option label="9%" :value="9"></el-option>
                <el-option label="10%" :value="10"></el-option>
                <el-option label="13%" :value="13"></el-option>
                <el-option label="16%" :value="16"></el-option>
              </el-select>
              <span v-else @click="()=>{toggleEdit(scope.row,'isTaxRateEdit')}">
                {{scope.row.taxRate}}%
                <i class="el-icon-edit"></i>
              </span>
              <!-- <el-button
                :type="scope.row.isTaxRateEdit?'success':'primary'"
                @click="()=>{toggleEdit(scope.row,'isTaxRateEdit')}"
                size="small"
                icon="edit"
              >{{scope.row.isTaxRateEdit?'完成':'编辑'}}</el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="supplierId"
            label="供应商"
            align="center"
            width="200"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.supplierId"
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="(query)=>{
                  querySearch(query,'supplier', scope.row)
                }"
                :loading="remoteLoading"
                @click.native="getCurPos(scope.row)"
                @change="id=>{
                  changeSupplier(id, scope.row)
                }"
                clearable
                v-if="scope.row.purchaseType == 0"
              >
                <el-option
                  v-for="(item,index) in scope.row.supplierList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                v-model="scope.row.supplierId"
                placeholder="请选择供应商"
                @click.native="getCurPos(scope.row)"
                @change="id=>{
                  changeSupplier(id, scope.row)
                }"
                v-else
              >
                <el-option
                  v-for="(item,index) in scope.row.supplierList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="billOrganizationId"
            label="结算单位"
            align="center"
            width="240"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.billOrganizationId"
                placeholder="请输入关键词"
                v-if="scope.row.isBillEdit"
                @change="id=>{
                  changeBill(id, scope.row)
                }"
              >
                <el-option
                  v-for="(item,index) in scope.row.billList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span v-else @click="()=>{toggleEdit(scope.row,'isBillEdit')}">
                {{scope.row.billOrganizationName}}
                <i class="el-icon-edit"></i>
              </span>
              <!-- <el-button
                :type="scope.row.isBillEdit?'success':'primary'"
                @click="()=>{toggleEdit(scope.row,'isBillEdit')}"
                size="small"
                icon="edit"
              >{{scope.row.isBillEdit?'完成':'编辑'}}</el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="discount"
            label="折扣率"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-input
                type="number"
                size="small"
                :min="0"
                :max="1"
                v-model="scope.row.discount"
                @blur="formatPrice(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectedDeliveryDate" label="期望到货日期" align="center" width="150">
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-date-picker
                v-model="scope.row.expectedDeliveryDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="deliveryType"
            label="到货类型"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.deliveryType"
                placeholder="请选择"
                v-if="scope.row.orderType == 1 || source == 1"
                @change="type=>{
                  changeDeliveryType(type, scope.row)
                }"
              >
                <el-option label="入仓" :value="0"></el-option>
                <el-option label="厂直" :value="1"></el-option>
              </el-select>
              <span v-else>{{scope.row.deliveryTypeDesc}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseId"
            label="库房"
            align="center"
            width="100"
            :render-header="tableHeadClassName"
          >
            <template
              slot-scope="scope"
              v-if="scope.row.itemLevel != 1 && scope.row.deliveryType == 0"
            >
              <el-select
                v-model="scope.row.warehouseId"
                placeholder="库房"
                @change="id=>{
                  changeWareHouse(id, scope.row)
                }"
              >
                <el-option
                  v-for="(item,index) in warehouseList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="recipientAddress"
            label="收货地址"
            align="center"
            width="200"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <div v-if="scope.row.deliveryType != 1">{{scope.row.recipientAddress}}</div>
              <div v-else>
                <el-input
                  type="text"
                  v-model="scope.row.recipientAddress"
                  placeholder="请输入收货地址"
                  @focus="showDialog('setAddress',scope.row)"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="recipientName"
            label="收货人"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-input type="text" v-model="scope.row.recipientName" clearable v-if="scope.row.deliveryType == 1"></el-input>
              <span v-else>{{scope.row.recipientName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recipientPhone"
            label="联系方式"
            align="center"
            width="140"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-input type="text" v-model="scope.row.recipientPhone" clearable v-if="scope.row.deliveryType == 1"></el-input>
              <span v-else>{{scope.row.recipientPhone}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="appointReceive"
            label="到货预约"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-checkbox
                v-model="scope.row.appointReceive"
                :true-label="1"
                :false-label="0"
                :disabled="scope.row.deliveryType == 1"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="qualityTesting"
            label="质量检查"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-checkbox
                v-model="scope.row.qualityTesting"
                :true-label="1"
                :false-label="0"
                :disabled="scope.row.deliveryType == 1"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="latestReceiveTime"
            label="最晚入库日期"
            align="center"
            width="150"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-date-picker
                v-model="scope.row.latestReceiveTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                :disabled="scope.row.deliveryType == 1"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="expressDelivery"
            label="是否快递"
            align="center"
            width="120"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-checkbox v-model="scope.row.expressDelivery" :true-label="1" :false-label="0"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="expressDeliveryNo" label="快递单号" align="center" width="180">
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-input type="text" v-model="scope.row.expressDeliveryNo" placeholder="多个用英文分号分隔"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="purchaserId" label="采购员" align="center" width="110">
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.purchaserId"
                placeholder="请输入"
                v-if="scope.row.isPurchaserEdit"
                @click.native="getCurPos(scope.row)"
                @change="id=>{
                  changepurchaserUser(id, scope.row)
                }"
              >
                <el-option
                  v-for="(item,index) in purchaserUserList[scope.row.categoryId]"
                  :key="item.id+index"
                  :label="item.realName"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span v-else @click="()=>{toggleEdit(scope.row,'isPurchaserEdit')}">
                {{scope.row.purchaserName}}
                <i class="el-icon-edit"></i>
              </span>
              <!-- <el-button
                :type="scope.row.isPurchaserEdit?'success':'primary'"
                @click="()=>{toggleEdit(scope.row,'isPurchaserEdit')}"
                size="small"
                icon="edit"
              >{{scope.row.isPurchaserEdit?'完成':'编辑'}}</el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="payType"
            label="采购方式"
            align="center"
            width="110"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.payType"
                placeholder="请选择"
                v-if="scope.row.isPayTypeEdit"
              >
                <el-option label="签单收货" :value="0"></el-option>
                <el-option label="现金采购" :value="1"></el-option>
              </el-select>
              <span v-else @click="()=>{toggleEdit(scope.row,'isPayTypeEdit')}">
                {{scope.row.payType?'现金采购':'签单收货'}}
                <i class="el-icon-edit"></i>
              </span>
              <!-- <el-button
                :type="scope.row.isPayTypeEdit?'success':'primary'"
                @click="()=>{toggleEdit(scope.row,'isPayTypeEdit')}"
                size="small"
                icon="edit"
              >{{scope.row.isPayTypeEdit?'完成':'编辑'}}</el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceType"
            label="发票类型"
            align="center"
            width="110"
            :render-header="tableHeadClassName"
          >
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-select
                v-model="scope.row.invoiceType"
                placeholder="请选择"
                v-if="scope.row.isinvoiceTypeEdit"
              >
                <el-option label="不开票" :value="9"></el-option>
                <el-option label="增税专票" :value="0"></el-option>
                <el-option label="增税普票" :value="1"></el-option>
              </el-select>
              <span v-else @click="()=>{toggleEdit(scope.row,'isinvoiceTypeEdit')}">
                {{{0:'增税专票',1:'增税普票',9:'不开票'}[scope.row.invoiceType]}}
                <i class="el-icon-edit"></i>
              </span>
              <!-- <el-button
                :type="scope.row.isinvoiceTypeEdit?'success':'primary'"
                @click="()=>{toggleEdit(scope.row,'isinvoiceTypeEdit')}"
                size="small"
                icon="edit"
              >{{scope.row.isinvoiceTypeEdit?'完成':'编辑'}}</el-button>-->
            </template>
          </el-table-column>
          <el-table-column prop="memo" label="采购说明" align="center" width="200">
            <template slot-scope="scope" v-if="scope.row.itemLevel != 1">
              <el-input type="text" v-model="scope.row.memo"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="infoTotal">
          <el-button type="primary" @click="toPreview()">采购单预览</el-button>
          <el-button type="primary" @click="cancelCreat()">取消</el-button>
        </div>
      </div>
    </el-form>

    <setSplit ref="setSplit" @callback="dialogCallback"></setSplit>
    <setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { postSupplierOptions } from "@/api/common/commonApi";
import {
  creatPurchase,
  creatPurchaseCentralized,
  getOrganizationFindSupplier,
  getBuyerList,
  getSetupOrgList,
  findWarehouseList,
  getWmsSkuStock
} from "@/api/purchase/purchase";
import { returnFloat, returnFloatFour, parseTime } from "@/utils/index";
import setSplit from "./child/set_split";
import setAddress from "./child/set_address";
import { request } from "https";
export default {
  inject: ["close"],
  name: "CreatPurchaseOrder",
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入1000以内的数字"));
      }
      callback();
    };
    return {
      purchaseId: "",
      ids: "", //初始需求参数
      ids1:"", //初始厂直需求参数
      ids2:"", //初始厂直需求参数-集采
      idList: null,
      receiptAddress: null,
      source: 0,//需求来源0采购需求1集采订单
      tableData: {},
      remoteLoading: false,
      remoteSupplierList: null,
      remoteBillList: null,
      purchaserUserList: {},
      warehouseList: [], //当前组织机构下的仓库列表
      tableLog: null,
      skulist: null,
      curSelectSkuPos: "", //当前选中商品的索引
      curSelectSku: null, //当前选中的商品
      filterSkuList: null,
      checkSku: {}, //验证的商品集合
      gatheringList: null, //所有设置了集采属性的组织机构
      betchQuery: {
        supplierId: "",
        supplierName: "",
        latestReceiveTime: ""
      },
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() &&
            new Date(time).toDateString() != new Date().toDateString()
          );
        }
      },
      rules: {
        purchaseQty: [
          { validator: check, trigger: "blur", message: "采购数量不能为空" }
        ]
      }
    };
  },
  components: {
    addhead,
    setSplit,
    setAddress
  },
  computed: {},
  mounted() {
    this.init();
  },
  activated() {
    if (this.$route.query.ids != this.ids || this.$route.query.ids1 != this.ids1 || this.$route.query.ids2 != this.ids2) {
      this.init();
    }
  },
  methods: {
    init() {
      this.referer = this.$route.query.referer;
      this.source = this.$route.query.source || 0;
      this.ids = this.$route.query.ids;
      this.ids1 = this.$route.query.ids1;
      this.ids2 = this.$route.query.ids2;
      //拼装api参数数据
      this.formatIds();

      if (this.referer == "preview") {
        let temp = JSON.parse(
          sessionStorage.getItem("ERP_CREAT_PURCHASE_ORDER")
        );
        //this.$set(this, "filterSkuList", temp);
        this.filterSkuList = temp;
        let tempUser = JSON.parse(
          sessionStorage.getItem("ERP_CREAT_PURCHASE_USERLIST")
        );
        this.purchaserUserList = tempUser;
        this.skulist = JSON.parse(
          sessionStorage.getItem("ERP_CREAT_PURCHASE_SKULIST")
        );

        //if(this.source == 1){
        this.warehouseList = JSON.parse(
          sessionStorage.getItem("ERP_CREAT_PURCHASE_WAREHOUSELIST")
        );
        //}
      } else {
        this.getData();
      }
    },
    formatIds(){
      let idsArr = this.ids ? this.ids.split(",") : [];
      let list = idsArr.map(id => {
        return {
          id: id,
          orderType: "SALES_ORDER",
          type: 'ARRIVAL'
        }
      })
      let ids1Arr = this.ids1 ? this.ids1.split(",") : [];
      let list1 = ids1Arr.map(id => {
        return {
          id: id,
          orderType: "SALES_ORDER",
          type: 'FACTORY_STRAIGHT'
        }
      })

      let ids2Arr = this.ids2 ? this.ids2.split(",") : [];
      let list2 = ids2Arr.map(id => {
        return {
          id: id,
          orderType: "CENTRALIZED_PURCHASE_ORDER",
          type: 'FACTORY_STRAIGHT'
        }
      })
      this.idList = [...list,...list1,...list2];
    },
    getData() {
      let fn = this.source == 0 ? creatPurchase : creatPurchaseCentralized;
      fn({ idList: this.idList, source: this.source }).then(res => {
        if (res.code == "000000") {
          res.data.forEach((value, index, arr) => {
            value.requirementQty = value.purchaseQty;
            arr[index].options = [
              {
                skuIds: value.skuId,
                skuName: value.skuName
              }
            ];
            if (!this.purchaserUserList[arr[index].categoryId]) {
              this.purchaserUserList[arr[index].categoryId] = {};
              this.getBuyerList(
                arr[index].categoryId,
                value.createPurchaseOrderItemDTOList
              );
            }
            value.createPurchaseOrderItemDTOList.forEach((item, index, arr) => {
              //保存原始的收货地址
              if (item.recipientAddressCityId) {
                item["originalRecipientAddress"] = {
                  recipientAddressProvinceId: item.recipientAddressProvinceId,
                  recipientAddressCityId: item.recipientAddressCityId,
                  recipientAddressCountyId: item.recipientAddressCountyId,
                  recipientAddressLine: item.recipientAddressLine,
                  recipientAddress: item.recipientAddress,
                  recipientName: item.recipientName,
                  recipientPhone: item.recipientPhone,
                  warehouseId: item.warehouseId,
                  warehouseName: item.warehouseName
                };
              }

              //集采订单的到货类型默认显示厂直
              if (this.source == 1) {
                item.deliveryType = 1;
                item.deliveryTypeDesc = "厂直";
              }

              //到货地址是入仓清除初始的仓库值和收货地址(且来源是集采) 
              //或者需求列表中但是是集采订单生成的
              if (
                (item.deliveryType == 0 && this.source == 1)
                //|| (this.source == 0 && item.orderType == 1)
              ) {
                item.warehouseId = "";
                item.warehouseName = "";
                item.recipientAddress = "";
                item.recipientAddressProvinceId = "";
                item.recipientAddressCityId = "";
                item.recipientAddressCountyId = "";
                item.recipientName = "";
                item.recipientPhone = "";
              }

              //小计显示2位,传后台4位
              item.amountVal = item.amount;
            });
          });

          //if (this.source == 1) {
          this.getWareHouseList(res.data[0].organizationId);
          //}

          this.$set(this, "skulist", res.data);
          this.filterSkuListFun();
        }
      });
    },
    getBuyerList(category, info) {
      //获取采购员
      getBuyerList(category).then(res => {
        if (res.code == "000000") {
          if (res.data.length) {
            this.$set(this.purchaserUserList, category, res.data);
          } else {
            //没查到该分类下的采购员
            let temp = [],
              tempObj = {};
            info.forEach(item => {
              if (!tempObj[item.purchaserId]) {
                temp.push({
                  id: item.purchaserId,
                  realName: item.purchaserName
                });
                tempObj[item.purchaserId] = 1;
              }
            });
            this.$set(this.purchaserUserList, category, temp);
          }
        }
      });
    },
    getWareHouseList(id) {
      findWarehouseList({ organizationId : id }).then(res => {
        if (res.code == "000000") {
          this.warehouseList = res.data;
        }
      });
    },
    filterSkuListFun() {
      let tempArr = [];
      this.skulist.forEach((element, index, arr) => {
        let innerArr = [];
        if (element.createPurchaseOrderItemDTOList) {
          element.no = index + 1;
          element.itemLevel = 1;
          innerArr.push(element);
          element.createPurchaseOrderItemDTOList.forEach((item, subIndex) => {
            //初始化一些默认数据
            if (!item.urgentLevel) {
              item.urgentLevel = 0;
            } else if (item.urgentLevel > 1) {
              item.urgentLevel = 1;
            }
            !item.invoiceType && (item.invoiceType = 0);
            !item.payType && (item.payType = 0);
            !item.includeTax && (item.includeTax = 1);
            !item.purchaseType && (item.purchaseType = 0);
            !item.taxRate && (item.taxRate = 13);
            //默认折扣率为1
            !item.discount && (item.discount = "1.00");
            item.categoryId = element.categoryId;
            item.supplierList = [];
            if (item.supplierId) {
              item.supplierList.push({
                id: item.supplierId,
                name: item.supplierName
              });
            }
            if (!item.billOrganizationId) {
              item.billOrganizationId = element.organizationId;
              item.billOrganizationName = element.organizationName;
            }
            item.billList = [
              {
                id: element.organizationId,
                name: element.organizationName
              }
            ];
            //集中采购且已选择供应商
            if (item.purchaseType == 1 && item.supplierId) {
              item.billList.push({
                id: item.supplierId,
                name: item.supplierName
              });
              item.billOrganizationId = item.supplierId;
              item.billOrganizationName = item.supplierName;
            }
            //采购员
            // item.purchaserUserList = [];
            // if(item.purchaserId){
            //   item.purchaserUserList.push({
            //     id: item.purchaserId,
            //     name: item.purchaserName
            //   });
            // }

            item.no = index + 1 + "-" + (subIndex + 1);
            item.itemLevel = 2;
            item.splitCount = 0; //拆分的次数
            item.splitSort = 0;
            innerArr.push(item);
          });
        }

        tempArr = tempArr.concat(innerArr);
      });
      this.filterSkuList = tempArr;
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (row.itemLevel == 1) {
        return "first-row";
      }
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
    cellClick(row, column, cell, event) {
      this.curSelectSkuPos = row.index;
    },
    getCurPos(row) {
      this.curSelectSkuPos = row.index;
    },
    changeDiscount(row) {
      row.currentPrice = (row.currentDiscount / 100) * row.websitePrice;
    },
    changePrice(row) {
      row.currentDiscount = (row.currentPrice / row.websitePrice) * 100;
    },
    toggleEdit(row, key) {
      row.unit = /\s$/.test(row.unit) ? row.unit.trim() : row.unit + " ";
      row[key] = !row[key];
    },
    showDialog(type, row) {
      if (type == "setAddress") {
        this.curSelectSkuPos = row.index;
      }
      this.$refs[type].init(row);
    },
    dialogCallback(obj) {
      if (obj.type == "setSplit") {
        this.splitRow(obj);
      } else if (obj.type == "setAddress") {
        let temp = [...this.filterSkuList];
        temp[this.curSelectSkuPos].recipientAddressLine = obj.data.address;
        temp[this.curSelectSkuPos].recipientAddressCityId = obj.data.city.id;
        temp[this.curSelectSkuPos].recipientAddressProvinceId =
          obj.data.province.id;
        temp[this.curSelectSkuPos].recipientAddressCountyId =
          obj.data.county.id;
        temp[this.curSelectSkuPos].recipientAddress = obj.data.receiptAddress;

        this.filterSkuList = temp;
      }
    },
    querySearch(query, type, row) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "supplier") {
          //集采
          if (row.purchaseType == 1) {
            // let sku = this.skulist.filter(item => {
            //   return item.skuId == row.skuId;
            // });
            // getOrganizationFindSupplier(sku[0].organizationId, {
            //   name: query
            // }).then(res => {
            //   this.$set(row, "supplierList", res.data);
            //   this.remoteLoading = false;
            // });
          } else {
            postSupplierOptions(query).then(res => {
              this.$set(row, "supplierList", res.data);
              this.remoteLoading = false;
            });
          }
        } else {
          this.$set(row, "supplierList", []);
          this.remoteLoading = false;
        }
      } else {
        this.$set(row, "supplierList", []);
      }
    },
    querySearchBetch(query) {
      if (query !== "") {
        this.remoteLoading = true;
        postSupplierOptions(query).then(res => {
          this.remoteSupplierList = res.data;
          this.remoteLoading = false;
        });
      } else {
        this.remoteSupplierList = [];
      }
    },
    queryUserSearch(query, type, row) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "purchaserUser") {
          getBuyerList(query).then(res => {
            this.$set(row, "purchaserUserList", res.data);
            this.remoteLoading = false;
          });
        } else {
          this.$set(row, "purchaserUserList", []);
          this.remoteLoading = false;
        }
      } else {
        this.$set(row, "purchaserUserList", []);
      }
    },
    toBetchSet() {
      if (this.betchQuery.supplierId) {
        this.filterSkuList.forEach(sku => {
          //排除集中采购的方式
          if (sku.itemLevel != 1 && sku.purchaseType == 0) {
            sku.supplierId = this.betchQuery.supplierId;
            sku.supplierName = this.betchQuery.supplierName;
            sku.supplierList.push({
              id: this.betchQuery.supplierId,
              name: this.betchQuery.supplierName
            });
            //设置该行的结算单位下拉框
            if (sku.purchaseType == 1) {
              let arr = [
                {
                  id: this.skulist[0].organizationId,
                  name: this.skulist[0].organizationName
                }
              ];
              arr.push({
                id: this.betchQuery.supplierId,
                name: this.betchQuery.supplierName
              });
              sku.billList = arr;
            }
          }
        });
      }
      if (this.betchQuery.latestReceiveTime) {
        this.filterSkuList.forEach(sku => {
          if (sku.itemLevel != 1) {
            sku.latestReceiveTime = this.betchQuery.latestReceiveTime;
          }
        });
      }
    },
    splitRow(obj) {
      let item = obj.newRow;
      item.no = obj.row.no + "-" + (obj.row.splitSort + 1);
      item.itemLevel = obj.row.itemLevel + 1;
      item.splitSource = obj.row.no; //设置拆分的源头
      item.splitCount = 0; //拆分次数-随增删变化-涉及插入的位置
      item.splitSort = 0; //拆分次总数-只增不减

      //设置初始编辑状态
      item.isUrgentEdit = false;
      item.isTaxRateEdit = false;
      item.isBillEdit = false;
      item.isPurchaserEdit = false;
      item.isPayTypeEdit = false;
      item.isinvoiceTypeEdit = false;

      item.supplierList = [];
      if (item.supplierId) {
        if (item.purchaseType == 1) {
          this.gatheringList = obj.gatheringList;
          this.$set(item, "supplierList", this.gatheringList);
          //集中采购且已选择供应商
          item.billList.push({
            id: item.supplierId,
            name: item.supplierName
          });
          //不默认设所选供应商为结算单位了
          // item.billOrganizationId = item.supplierId;
          // item.billOrganizationName = item.supplierName;
        } else {
          item.supplierList.push({
            id: item.supplierId,
            name: item.supplierName
          });
        }
      }
      item.requirementQty = item.purchaseQty;
      //购买数量变化
      this.filterSkuList.splice(
        this.curSelectSkuPos + obj.row.splitCount + 1,
        0,
        item
      );
      obj.row.purchaseQty -= item.purchaseQty;
      obj.row.purchaseQty < 0 && (obj.row.purchaseQty = 0);
      //修改小计数值
      obj.row.amountVal = returnFloat(obj.row.purchasePrice*obj.row.purchaseQty);
      obj.row.amount = returnFloatFour(obj.row.purchasePrice*obj.row.purchaseQty);
      obj.row.requirementQty = obj.row.purchaseQty;
      obj.row.splitCount++;
      obj.row.splitSort++;
    },
    delRow(row) {
      //拆分源头的拆分次数-1
      let tempList = {},
        newarr = [],
        tempArr = [];
      let sourceArr = row.no.split("-");
      sourceArr.pop();
      sourceArr.forEach((item, index, arr) => {
        newarr.push(arr.slice(0, index + 1).join("-"));
      });
      this.filterSkuList.forEach(item => {
        tempList[item.no] = item;
      });
      newarr.reverse().forEach(item => {
        if (!tempArr.length && tempList[item]) {
          tempArr.push(tempList[item]);
          tempList[item].splitCount--;
          //购买数量还原
          tempList[item].purchaseQty =
            parseInt(tempList[item].purchaseQty) + parseInt(row.purchaseQty);
          //还原小计
          tempList[item].amount = returnFloatFour(tempList[item].purchasePrice*tempList[item].purchaseQty);
          tempList[item].amountVal = returnFloat(tempList[item].amount);
          tempList[item].requirementQty = tempList[item].purchaseQty;
        }
      });
      this.filterSkuList.splice(row.index, 1);
    },
    changePurchaseType(type, row) {
      let arr = [
        {
          id: this.skulist[0].organizationId,
          name: this.skulist[0].organizationName
        }
      ];
      //清空供应商
      this.filterSkuList[this.curSelectSkuPos].supplierId = null;
      this.filterSkuList[this.curSelectSkuPos].supplierName = null;
      this.filterSkuList[this.curSelectSkuPos].supplierList = [];
      //集采
      if (type == 1) {
        //直接获取组织机构下的供应商
        if (this.gatheringList) {
          this.$set(row, "supplierList", this.gatheringList);
        } else {
          getSetupOrgList({ name: "" }).then(res => {
            this.gatheringList = res.data;
            this.$set(row, "supplierList", res.data);
            //解决异常问题-触发视图更新
            row.unit = /\s$/.test(row.unit) ? row.unit.trim() : row.unit + " ";
            this.remoteLoading = false;
          });
        }
      } else {
        this.filterSkuList[
          this.curSelectSkuPos
        ].billOrganizationId = this.skulist[0].organizationId;
        this.filterSkuList[
          this.curSelectSkuPos
        ].billOrganizationName = this.skulist[0].organizationName;
      }
      this.filterSkuList[this.curSelectSkuPos].billList = arr;
    },
    changeSupplierBetch(id) {
      let obj = this.remoteSupplierList.filter(item => {
        return id == item.id;
      });
      this.betchQuery.supplierName = obj[0].name;
    },
    changeSupplier(id, row) {
      if (!id) return false;
      let obj = row.supplierList.filter(item => {
        return id == item.id;
      });
      row.supplierName = obj[0].name;
      let arr = [
        {
          id: this.skulist[0].organizationId,
          name: this.skulist[0].organizationName
        }
      ];
      if (row.purchaseType == 1) {
        arr.push({
          id: obj[0].id,
          name: obj[0].name
        });
        //不默认设所选供应商为结算单位了
        // row.billOrganizationId = obj[0].id;
        // row.billOrganizationName = obj[0].name;
        row.billList = arr;
      }
    },
    changeBill(id, row) {
      if (!id) return false;
      let obj = row.billList.filter(item => {
        return id == item.id;
      });
      row.billOrganizationName = obj[0].name;
    },
    changeWareHouse(warehouseId, row) {
      this.warehouseList.forEach(warehouse => {
        if (warehouse.id == warehouseId) {
          row.recipientAddress = warehouse.fullAddress;
          let tempArr = warehouse.fullAddress.split("-");
          row.recipientAddressLine = tempArr[tempArr.length - 1];
          row.recipientAddressProvinceId = warehouse.provinceId;
          row.recipientAddressCityId = warehouse.cityId;
          row.recipientAddressCountyId = warehouse.countyId;
          row.warehouseName = warehouse.name;

          //设置当前仓库的联系人和联系方式
          row.recipientName = warehouse.warehouseContactDTOList[0].name;
          row.recipientPhone = warehouse.warehouseContactDTOList[0].phone;
        }
      });
      let params = {
        skuIds: [row.skuId],
        warehouseId: warehouseId
      };
      getWmsSkuStock(params).then(res => {
        if (res.code == "000000") {
          row.availableStock = res.data.length ? res.data[0].availableQty : "";
        }
      });
    },
    changepurchaserUser(id, row) {
      if (!id) return false;
      let obj = this.purchaserUserList[row.categoryId].filter(item => {
        return id == item.id;
      });
      row.purchaserName = obj[0].realName;
    },
    changeDeliveryType(type, row) {
      //type到货类型
      if (type == 1) {
        Object.assign(row, row.originalRecipientAddress);
      } else if (type == 0) {
        row.warehouseId = "";
        row.warehouseName = "";
        row.recipientAddress = "";
        row.recipientAddressProvinceId = "";
        row.recipientAddressCityId = "";
        row.recipientAddressCountyId = "";
        row.recipientName = "";
        row.recipientPhone = "";
      }
    },
    checkOty(row) {
      var n = parseInt(row.purchaseQty);
      row.purchaseQty = n;
      if (n < 1) {
        row.purchaseQty = 1;
        this.$message({
          type: "warning",
          message: "采购数量不能小于1"
        });
      }
      row.amountVal = returnFloat(row.purchasePrice*row.purchaseQty);
      row.amount = returnFloatFour(row.purchasePrice*row.purchaseQty);
    },
    formatPrice(row) {
      if (row.discount) {
        if (row.discount > 1) {
          row.discount = null;
          this.$message({
            type: "warning",
            message: "折扣率应在0~1之间"
          });
        } else {
          let num = row.discount < 0 ? 0 : row.discount;
          row.discount = returnFloat(num);
        }
      }
    },
    formatUnitPrice(row) {
      if (row.purchasePrice) {
        row.purchasePrice = returnFloatFour(row.purchasePrice);
        row.amount = returnFloatFour(row.purchasePrice*row.purchaseQty);
        row.amountVal = returnFloat(row.purchasePrice*row.purchaseQty);
      }
    },
    formatTotalPrice(row) {
      if (row.amountVal) {
        row.amount = returnFloatFour(row.amountVal);
        row.amountVal = returnFloat(row.amountVal);
        row.purchasePrice = returnFloatFour(row.amountVal/row.purchaseQty);
      }
    },
    toPreview() {
      //验证数据合法性
      try {
        this.filterSkuList.forEach((item, index, arr) => {
          if (item.itemLevel == 1) {
            this.checkSku[item.skuId] = {
              skuId: item.skuId,
              skuName: item.skuName,
              purchaseQty: item.purchaseQty,
              curQty: 0
            };
            return;
          }
          if (item.purchaseQty < 1) {
            this.$message({
              type: "warning",
              message: "采购数量不能小于1"
            });
            throw new Error();
          }
          if (!item.purchasePrice || item.purchasePrice < 0) {
            this.$message({
              type: "warning",
              message: "采购单价不能小于0"
            });
            throw new Error();
          }
          if (!item.supplierId) {
            this.$message({
              type: "warning",
              message: "供应商不能为空"
            });
            throw new Error();
          }
          if (!item.billOrganizationId) {
            this.$message({
              type: "warning",
              message: "结算单位不能为空"
            });
            throw new Error();
          }
          if (item.discount == null || item.discount < 0) {
            this.$message({
              type: "warning",
              message: "折扣率不能小于0"
            });
            throw new Error();
          }
          if (item.deliveryType == 0 && !item.warehouseId) {
            this.$message({
              type: "warning",
              message: "仓库不能为空"
            });
            throw new Error();
          }
          if (!item.recipientName) {
            this.$message({
              type: "warning",
              message: "收货人不能为空"
            });
            throw new Error();
          }
          if (!item.recipientAddress) {
            this.$message({
              type: "warning",
              message: "收货地址不能为空"
            });
            throw new Error();
          }
          if (!item.latestReceiveTime && item.deliveryType != 1) {
            this.$message({
              type: "warning",
              message: "最晚入库时间不能为空"
            });
            throw new Error();
          }
          if (item.expressDelivery == 1 && !item.expressDeliveryNo) {
            this.$message({
              type: "warning",
              message: "快递单号不能为空"
            });
            throw new Error();
          }

          this.checkSku[item.skuId].curQty += parseInt(item.purchaseQty);
        });
      } catch (e) {
        return false;
      }

      try {
        Object.keys(this.checkSku).forEach(key => {
          if (this.checkSku[key].purchaseQty > this.checkSku[key].curQty) {
            this.$message({
              type: "warning",
              message:
                this.checkSku[key].skuName +
                "的采购数量不能小于采购总数" +
                this.checkSku[key].purchaseQty
            });
            throw new Error();
          }
        });
      } catch (e) {
        return false;
      }
      //存储临时数据
      sessionStorage.setItem(
        "ERP_CREAT_PURCHASE_ORDER",
        JSON.stringify(this.filterSkuList)
      );
      //存储采购员临时数据
      sessionStorage.setItem(
        "ERP_CREAT_PURCHASE_USERLIST",
        JSON.stringify(this.purchaserUserList)
      );

      // if(this.source == 1){
      //存储仓库列表临时数据
      sessionStorage.setItem(
        "ERP_CREAT_PURCHASE_WAREHOUSELIST",
        JSON.stringify(this.warehouseList)
      );
      // }

      //存储临时商品列表
      sessionStorage.setItem(
        "ERP_CREAT_PURCHASE_SKULIST",
        JSON.stringify(this.skulist)
      );
      this.$router.push({
        name: "CreatPurchasePreview",
        params: {
          createPurchaseOrderItemDTOList: this.filterSkuList,
          unTag: true
        },
        query: {
          source: this.source,
          ids: this.ids,
          ids1: this.ids1,
          ids2: this.ids2,
        }
      });
    },
    timeFormat(row, col, cellValue){
      return parseTime(cellValue);
    },
    timeFormatFun(t){
      return parseTime(t);
    },
    cancelCreat() {
      this.$confirm("取消后，所编辑的信息将不会保存，是否确认？", "取消确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.close();
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
  .box {
    padding: 20px;
    border: 1px solid #ececec;
    text-align: right;
    .chunk {
      display: inline-block;
      margin: 0 10px;
    }
  }
  .add-head {
    width: 100%;
    height: 40px;
    background-color: #f3f3f3;
    padding-left: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    .myicon {
      font-size: 23px;
      margin-top: 3px;
    }
    .add-class-text {
      color: #666;
      margin-right: 30px;
    }
    .btns {
      position: absolute;
      right: 0;
      display: flex;
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
    .el-input {
      font-size: 12px;
      padding: 0 5px;
    }
    .el-select {
      font-size: 12px;
    }
    .el-table {
      .el-button {
        border: none;
      }
    }

    .setAddr {
      margin-left: 10px;
    }
    .infoTotal {
      padding: 20px;
      line-height: 24px;
      text-align: center;
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
.detaillTable >>> .first-row {
  background: #f5f7fa;
  color: #aaa;
  font-weight: bold;
}
.detaillTable >>> .el-input__inner {
  padding: 0 20px 0 5px;
  line-height: 36px;
  height: 36px;
}
.detaillTable >>> .el-date-editor {
  width: 120px;
}
.detaillTable >>> .el-date-editor .el-input__inner {
  padding: 0 20px;
}
</style>
