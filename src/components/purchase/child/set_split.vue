<template>
  <el-dialog title="拆分采购" :visible.sync="isShow" width="800px" class="dialogWrap">
    <addhead headname="基本信息"></addhead>
    <div class="list">
      <table border="1">
        <tr>
          <th>需求来源：</th>
          <td>{{orderInfo.requirementTypeDesc}}</td>
          <th>库房：</th>
          <td>{{orderInfo.warehouseName}}</td>
        </tr>
        <tr>
          <th>商品编号：</th>
          <td>{{orderInfo.skuNo}}</td>
          <th>商品名称：</th>
          <td>{{orderInfo.skuName}}</td>
        </tr>
        <tr>
          <th>计量单位：</th>
          <td>{{orderInfo.unit}}</td>
          <th>需求采购数量：</th>
          <td>{{orderInfo.requirementQty}}</td>
        </tr>
        <tr>
          <th>紧急需求数量：</th>
          <td>{{orderInfo.urgentRequirementQty}}</td>
          <th>可用库存数量：</th>
          <td>{{orderInfo.availableStock}}</td>
        </tr>
      </table>
    </div>
    <addhead headname="拆分信息"></addhead>
    <div class="list">
      <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;">拆分规则：</el-col>
          <el-col :span="7">
            <el-form-item label prop="type">
              <el-radio-group v-model="form.type" @change="changeType">
                <el-radio :label="1">自定义</el-radio>
                <el-radio :label="2">按紧急程度</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <i>*</i>紧急程度：
          </el-col>
          <el-col :span="8">
            <el-form-item label prop="urgentLevel">
              <el-select v-model="form.urgentLevel" :disabled="urgentDisable">
                <el-option label="不紧急" :value="0"></el-option>
                <el-option label="紧急" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;">
            <i>*</i>到货类型：
          </el-col>
          <el-col :span="7">
            <el-form-item label prop="deliveryType">
              <el-select v-model="form.deliveryType" @change="changeDeliveryType" v-if="form.orderType == 1">
                <el-option label="入仓" :value="0"></el-option>
                <el-option label="厂直" :value="1"></el-option>
              </el-select>
              <span v-else>{{form.deliveryTypeDesc}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:right;" v-if="form.deliveryType == 0">
            <i>*</i>库房：
          </el-col>
          <el-col :span="8" v-if="form.deliveryType == 0">
            <el-form-item prop="warehouseId">
              <el-select
                v-model="form.warehouseId"
                placeholder="库房"
                @change="changeWareHouse"
              >
                <el-option
                  v-for="(item,index) in warehouseList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;">收货地址：</el-col>
          <el-col :span="7">
            <el-form-item prop="recipientAddress" v-if="form.deliveryType == 0">
              <span style="line-height: 18px;display: inline-block;">{{form.recipientAddress}}</span>
            </el-form-item>
            <el-form-item prop="recipientAddress" v-else>
              <el-input
                type="text"
                v-model="form.recipientAddress"
                clearable
                placeholder="请输入收货地址"
                @focus="showDialog('setAddress',form)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <i>*</i>采购单价(元)：
          </el-col>
          <el-col :span="5">
            <el-form-item prop="purchasePrice">
              <el-input v-model="form.purchasePrice" placeholder="0.00" @change="changePrice" @blur="purchasePriceBlur"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">参考价：￥{{form.buyingPrice}}</el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;line-height:20px;">
            <i>*</i>单价是否含税：
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-radio-group v-model="form.includeTax">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <i>*</i>采购数量：
          </el-col>
          <el-col :span="8">
            <el-form-item prop="purchaseQty">
              <el-input
                type="number"
                v-model="form.purchaseQty"
                placeholder="采购数量"
                :min="1"
                @change="checkOty"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;">
            <i>*</i>采购类型：
          </el-col>
          <el-col :span="7">
            <el-form-item label prop="purchaseType">
              <el-select v-model="form.purchaseType" @change="changePurchaseType">
                <el-option label="自主采购" :value="0"></el-option>
                <el-option label="集中采购" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <i>*</i>供应商：
          </el-col>
          <el-col :span="8">
            <el-form-item label prop="supplierId">
              <el-select
                v-model="form.supplierId"
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="(query)=>{
                  querySearch(query,'supplier')
                }"
                :loading="remoteLoading"
                @change="changeSupplier"
                clearable
                v-if="form.purchaseType == 0"
              >
                <el-option
                  v-for="(item,index) in supplierList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                v-model="form.supplierId"
                placeholder="请选择供应商"
                @change="changeSupplier"
                v-else
              >
                <el-option
                  v-for="(item,index) in supplierList"
                  :key="item.id+index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;">
            <i>*</i>采购方式：
          </el-col>
          <el-col :span="7">
            <el-form-item label prop="payType">
              <el-select v-model="form.payType">
                <el-option label="签单收货" :value="0"></el-option>
                <el-option label="现金采购" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <i>*</i>发票类型：
          </el-col>
          <el-col :span="8">
            <el-select v-model="form.invoiceType">
              <el-option label="不开票" :value="9"></el-option>
              <el-option label="增税专票" :value="0"></el-option>
              <el-option label="增税普票" :value="1"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;">
            <i>*</i>税率：
          </el-col>
          <el-col :span="7">
            <el-form-item prop="taxRate">
              <el-select v-model="form.taxRate">
                <el-option label="0" :value="0"></el-option>
                <el-option label="3%" :value="3"></el-option>
                <el-option label="5%" :value="5"></el-option>
                <el-option label="6%" :value="6"></el-option>
                <el-option label="9%" :value="9"></el-option>
                <el-option label="10%" :value="10"></el-option>
                <el-option label="13%" :value="13"></el-option>
                <el-option label="16%" :value="16"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <i>*</i>采购人：
          </el-col>
          <el-col :span="8">
            <el-form-item prop="purchaserId">
              <el-select v-model="form.purchaserId" placeholder="请输入" @change="changepurchaserUser">
                <el-option
                  v-for="item in purchaserUserList[orderInfo.categoryId]"
                  :key="item.id"
                  :label="item.userName + '-' +item.realName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;"><i>*</i>折扣率：</el-col>
          <el-col :span="7">
            <el-form-item prop="discount">
              <el-input v-model="form.discount" placeholder="0.00" @blur="formatTablePrice"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4" style="text-align:right;">折扣额：</el-col>
          <el-col :span="8">
            <el-form-item prop="zke">
              <span>{{form.zke}}</span>
            </el-form-item>
          </el-col>-->
          <el-col :span="4" style="text-align:right;">
            期望到货日期：
          </el-col>
          <el-col :span="8">
            <el-form-item prop="expectedDeliveryDate">
              <el-date-picker
                v-model="form.expectedDeliveryDate"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right;">采购说明：</el-col>
          <el-col :span="19">
            <el-form-item prop="memo">
              <el-input type="textarea" v-model="form.memo" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>

    <setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
  </el-dialog>
</template>
<script>
import addhead from "@/components/common/head/head";
import { postSupplierOptions } from "@/api/common/commonApi";
import {
  creatPurchase,
  getOrganizationList,
  getBuyerList,
  getSetupOrgList,
  getWmsSkuStock
} from "@/api/purchase/purchase";
import setAddress from "./set_address";
import { returnFloat, returnFloatFour } from "@/utils/index";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "" || value == null) {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      remoteLoading: false,
      supplierList: null,
      purchaserUserList: {},
      orderInfo: {},
      urgentDisable:false,
      gatheringList:null,//所有设置了集采属性的组织机构
      warehouseList: [], //当前组织机构下的仓库列表
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() &&
            new Date(time).toDateString() != new Date().toDateString()
          );
        }
      },
      deliveryInitData:null,//保存入仓的初始数据
      initForm: {
        type: 1,
        urgentLevel: 0,
        deliveryType: 0,
        deliveryType: 0,
        purchaseQty: 1,
        warehouseId: "",
        purchasePrice: "",
        includeTax: 1,
        taxRate: 1,
        purchaseType: 0,
        supplierId: "",
        payType: 0,
        amount:0,
        amountVal:0,
        invoiceType: 1,
        latestReceiveTime: "",
        purchaserId: "",
      },
      form: {},
      rules: {
        purchaseQty: [
          { validator: check, message: "采购数量不能空", rigger: "blur" }
        ],
        purchasePrice: [
          { validator: check, message: "采购单价不能空", rigger: "blur" }
        ],
        supplierId: [
          { validator: check, message: "请选择供应商", trigger: "change" }
        ],
        purchaserId: [
          {
            validator: check,
            message: "请选择采购人",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    //this.$refs.orderForm.clearValidate();
  },
  components: {
    addhead,
    setAddress
  },
  methods: {
    init(oRow) {
      this.orderInfo = oRow.row;
      this.warehouseList = oRow.warehouseList;
      console.log(this.orderInfo.warehouseId);
      console.log(this.warehouseList);
      let obj = Object.assign({}, this.orderInfo, { type: 1 });
      if (!obj.invoiceType && obj.invoiceType != 0) {
        obj.invoiceType = 1;
      }
      if (!obj.taxRate && obj.taxRate != 0) {
        obj.taxRate = 1;
      }
      if (obj.supplierId) {
        this.supplierList = [
          {
            name: obj.supplierName,
            id: obj.supplierId
          }
        ];
      }
      if(obj.purchaseType == 1){
        getSetupOrgList({ name: "" }).then(
          res => {
            this.gatheringList = res.data;
            this.$set(this, "supplierList", res.data);
          }
        );
      }

      this.deliveryInitData = {
        recipientAddress:obj.recipientAddress,
        recipientAddressLine:obj.recipientAddressLine,
        recipientAddressProvinceId:obj.recipientAddressProvinceId,
        recipientAddressCityId:obj.recipientAddressCityId,
        recipientAddressCountyId:obj.recipientAddressCountyId
      }

      this.$set(this, "form", obj);
      this.getBuyerList();
      this.isShow = true;
    },
    getBuyerList() {
      //获取采购员
      getBuyerList(this.form.categoryId).then(res => {
        if (res.code == "000000") {
          if (res.data.length) {
            this.$set(this.purchaserUserList, this.form.categoryId, res.data);
          } else {
            this.$set(this.purchaserUserList, this.form.categoryId, {
              id: this.orderInfo.purchaserId,
              realName: this.orderInfo.purchaserName
            });
          }
        }
      });
    },
    querySearch(query, type) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "supplier") {
          if (this.form.purchaseType == 1) {
            getOrganizationList({ name: query }).then(res => {
              this.$set(this, "supplierList", res.data);
              this.remoteLoading = false;
            });
          } else {
            postSupplierOptions(query).then(res => {
              this.$set(this, "supplierList", res.data);
              this.remoteLoading = false;
            });
          }
        } else {
          this.$set(this, "supplierList", []);
          this.remoteLoading = false;
        }
      } else {
        this.supplierList = [];
      }
    },
    changeWareHouse(warehouseId) {
      console.log(warehouseId)
      this.warehouseList.forEach(warehouse => {
        if (warehouse.id == warehouseId) {
          this.form.recipientAddress = warehouse.fullAddress;
          let tempArr = warehouse.fullAddress.split("-");
          this.form.recipientAddressLine = tempArr[tempArr.length - 1];
          this.form.recipientAddressProvinceId = warehouse.provinceId;
          this.form.recipientAddressCityId = warehouse.cityId;
          this.form.recipientAddressCountyId = warehouse.countyId;
          this.form.warehouseName = warehouse.name;

          //设置当前仓库的联系人和联系方式
          this.form.recipientName = warehouse.warehouseContactDTOList[0].name;
          this.form.recipientPhone = warehouse.warehouseContactDTOList[0].phone;
        }
      });
      let params = {
        skuIds: [this.form.skuId],
        warehouseId: warehouseId
      };
      getWmsSkuStock(params).then(res => {
        if (res.code == "000000") {
          this.form.availableStock = res.data.length ? res.data[0].availableQty : "";
        }
      });
    },
    changeSupplier(id) {
      if (!id) return false;
      let obj = this.supplierList.filter(item => {
        return id == item.id;
      });
      this.form.supplierName = obj[0].name;
    },
    changepurchaserUser(id) {
      if (!id) return false;
      let obj = this.purchaserUserList[this.form.categoryId].filter(item => {
        return id == item.id;
      });
      this.form.purchaserName = obj[0].realName;
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(obj) {
      this.form.recipientAddressLine = obj.data.address;
      this.form.recipientAddressCityId = obj.data.city.id;
      this.form.recipientAddressProvinceId = obj.data.province.id;
      this.form.recipientAddressCountyId = obj.data.county.id;
      this.form.recipientAddress = obj.data.receiptAddress;
    },
    changePurchaseType(type) {
      //清空供应商
      this.form.supplierId = null;
      this.form.supplierName = null;
      this.supplierList = [];
      //集采
      if (type == 1) {
        //直接获取组织机构下的供应商
        if(this.gatheringList){
          this.$set(this, "supplierList", this.gatheringList);
        }else{
          getSetupOrgList({ name: "" }).then(
            res => {
              this.gatheringList = res.data;
              this.$set(this, "supplierList", res.data);
              this.remoteLoading = false;
            }
          );
        }
      }
    },
    changeType(type){
      this.urgentDisable = type == 2 ? true : false;
    },
    changeDeliveryType(type){
      if(type == 1){
        this.form.recipientAddress = this.form.originalRecipientAddress.recipientAddress;
        this.form.recipientAddressLine = this.form.originalRecipientAddress.recipientAddressLine;
        this.form.recipientAddressCityId = this.form.originalRecipientAddress.recipientAddressCityId;
        this.form.recipientAddressProvinceId = this.form.originalRecipientAddress.recipientAddressProvinceId;
        this.form.recipientAddressCountyId = this.form.originalRecipientAddress.recipientAddressCountyId;
      }else{
        //清空库房和收货地址信息
        this.form.warehouseId = "";
        this.form.warehouseName = "";
        this.form.recipientAddress = "";
        this.form.recipientAddressProvinceId = "";
        this.form.recipientAddressCityId = "";
        this.form.recipientAddressCountyId = "";
        this.form.recipientName = "";
        this.form.recipientPhone = "";
        //Object.assign(this.form, this.deliveryInitData);
      }
    },
    checkOty(num) {
      if(!num) return false;
      var n = parseInt(num);
      //采购数不能小于0且不能超过初始采购数量
      this.form.purchaseQty = n < 0 ? 1 : (n > this.orderInfo.purchaseQty ? this.orderInfo.purchaseQty : n);
      this.form.amount = returnFloatFour(this.form.purchaseQty*this.form.purchasePrice);
      this.form.amountVal = returnFloat(this.form.purchaseQty*this.form.purchasePrice);
    },
    changePrice(){
      this.form.amount = returnFloatFour(this.form.purchaseQty*this.form.purchasePrice);
      this.form.amountVal = returnFloat(this.form.purchaseQty*this.form.purchasePrice);
    },
    purchasePriceBlur(){
      this.form.purchasePrice = returnFloatFour(this.form.purchasePrice);
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isShow = false;
          this.$emit("callback", {
            type: "setSplit",
            row: this.orderInfo,
            newRow: this.form,
            gatheringList: this.gatheringList
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    formatTablePrice() {
      if (this.form.discount) {
        if (this.form.discount > 1) {
          this.form.discount = null;
          this.$message({
            type: "warning",
            message: "折扣率应在0~1之间"
          });
        } else {
          let num = this.form.discount < 0 ? 0 : this.form.discount;
          this.form.discount = returnFloat(num);
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.tips {
  color: red;
  padding-left: 20px;
}
.list {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
  table {
    width: 95%;
    margin: 0px auto 20px;
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
      width: 15%;
      background-color: #f9fafc;
      i {
        color: red;
      }
    }
    td {
      color: #666666;
      text-align: left;
      padding-left: 10px;
      width: 25%;
      line-height: 20px;
      &:last-child {
        width: 21%;
      }
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
}
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-select,
.el-autocomplete {
  width: 100%;
}
.el-radio {
  margin-left: 0;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
.dialogWrap >>> .el-dialog__body {
  height: 50vh;
  overflow: auto;
}
</style>
