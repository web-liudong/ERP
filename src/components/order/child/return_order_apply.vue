<template>
  <el-dialog title="退货申请" :visible.sync="isShow" width="900px" class="dialogWrap">
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.orderNo}}</td>
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
          <th>客户采购人：</th>
          <td>{{orderInfo.customerUserName}}<br />{{orderInfo.customerUserPhone}}</td>
        </tr>
      </table>
    </div>
    <el-form :inline="true" :model="form" ref="orderForm" :rules="rulesForm">
    <el-row>
      <el-col :offset="1" :span="10">
        <i>*</i>填写退货信息：
      </el-col>
    </el-row>
    <el-row>
      <el-col>
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>退货原因：
            </el-col>
            <el-col :span="18">
              <el-form-item label prop="returnReason">
                <el-select v-model="form.returnReason" placeholder="选择退货原因" @change="selectItem" style="width: 100%;">
                  <el-option
                    v-for="item in reasonList"
                    :key="item.name"
                    :label="item.text"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="isOther">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>其他原因：
            </el-col>
            <el-col :span="18">
              <el-form-item prop="otherReasonDescription">
                <el-input
                  v-model="form.otherReasonDescription"
                  type="textarea"
                  rows="5"
                  :maxlength="200"
                  placeholder="字数长度1~200以内"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>退货联系人：
            </el-col>
            <el-col :span="6">
              <el-form-item prop="returnContacts">
                <el-input v-model="form.returnContacts"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="text-align:right;">
              <i>*</i>退货联系人电话：
            </el-col>
            <el-col :span="7">
              <el-form-item prop="returnPhone">
                <el-input v-model="form.returnPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>退货地址：
            </el-col>
            <el-col :span="6">
              <el-form-item prop="returnAddressProvinceId">
                <el-select
                  v-model="form.returnAddressProvinceId"
                  placeholder="选择省/直辖市"
                  @change="getcity"
                >
                  <el-option
                    v-for="(item,index) in provinces"
                    :key="item.id + index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="returnAddressCityId">
                <el-select
                  v-model="form.returnAddressCityId"
                  placeholder="选择城市"
                  @change="getcounty"
                >
                  <el-option
                    v-for="(item,index) in city"
                    :key="item.id + index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="returnAddressCountyId">
                <el-select v-model="form.returnAddressCountyId" placeholder="选择区/县">
                  <el-option
                    v-for="(item,index) in county"
                    :key="item.id + index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;line-height:20px;">&nbsp;</el-col>
            <el-col :span="18">
              <el-form-item prop="returnAddressLine">
                <el-input
                  v-model="form.returnAddressLine"
                  type="textarea"
                  rows="3"
                  placeholder="详细地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="1" :span="4">
        <i>*</i>选择退货方式：
      </el-col>
      <el-col :span="10">
        <el-form-item style="height: 30px;margin:0;">
          <el-radio-group v-model="form.returnWay" @change="changeRetrunWay">
            <el-radio label="RETURN_FACTORY">退回厂家</el-radio>
            <el-radio label="RETURN_WAREHOUSE">退回仓库</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="detaillTable">
          <!-- <h4 class="tit">发货仓库：{{warehouse.wareHouseName}}</h4> -->
          <el-row v-if="form.returnWay == 'RETURN_FACTORY'">
            <el-col>         
                <el-row :gutter="10">
                  <el-col :span="4" style="text-align:right;">寄回联系人：</el-col>
                  <el-col :span="6">
                    <el-form-item prop="receiver">
                      <el-input v-model="form.receiver"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="text-align:right;">寄回联系人电话：</el-col>
                  <el-col :span="7">
                    <el-form-item prop="receiverPhone">
                      <el-input v-model="form.receiverPhone"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="4" style="text-align:right;">货物寄回地址：</el-col>
                  <el-col :span="6">
                    <el-form-item prop="receiverAddressProvinceId">
                      <el-select
                        v-model="form.receiverAddressProvinceId"
                        placeholder="选择省/直辖市"
                        @change="(id)=>{getReceivercity(id, 1)}"
                      >
                        <el-option
                          v-for="(item,index) in provinces"
                          :key="item.name + index"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="receiverAddressCityId">
                      <el-select
                        v-model="form.receiverAddressCityId"
                        placeholder="选择城市"
                        @change="(id)=>{getReceivercounty(id, 1)}"
                      >
                        <el-option
                          v-for="(item,index) in receiverCitys"
                          :key="item.name + index"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="receiverAddressCountyId">
                      <el-select v-model="form.receiverAddressCountyId" placeholder="选择区/县">
                        <el-option
                          v-for="(item,index) in receiverCountys"
                          :key="item.name + index"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="4" style="text-align:right;line-height:20px;">&nbsp;</el-col>
                  <el-col :span="18">
                    <el-form-item prop="receiverAddressLine">
                      <el-input
                        v-model="form.receiverAddressLine"
                        type="textarea"
                        rows="3"
                        placeholder="详细地址"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col>
              <el-row :gutter="10">
                  <el-col :span="4" style="text-align:right;">选择退回仓库</el-col>
                  <el-col :span="18">
                    <el-form-item prop="warehouseId">
                      <el-select v-model="form.warehouseId" placeholder="选择仓库">
                        <el-option
                          v-for="(item,index) in warehouselist"
                          :key="item.name"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>    
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    </el-form>
    <el-row>
      <el-col :offset="1" :span="10">
        <i>*</i>选择退货商品和退货数量：
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="1" :span="8">
        <el-input v-model="querySkuName" placeholder="请输入商品名称查询" @change="initSkuList" clearable=""></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="detaillTable">
          <el-table
            :data="deliveryItemList"
            border
            size="small"
            max-height="240"
            :ref="'goodsTable'"
            @select="handleSelect"
            @select-all="handleSelectAll"
          >
            <el-table-column type="selection" align="center" :selectable="checkboxT"></el-table-column>
            <el-table-column prop="skuNo" label="商品编号" align="center" width="80"></el-table-column>
            <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center" width="60"></el-table-column>
            <el-table-column prop="canReturnNum" label="可退货数量" width="100" align="center"></el-table-column>
            <el-table-column prop="returnQty" label="退货数量" align="center" width="160">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-minus"
                  size="mini"
                  circle
                  @click.native="reduceNum(scope.row)"
                ></el-button>
                <input class="quantity" type="number" v-model="scope.row.returnQty" @blur="qtyChange(scope.row)"></input>
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  circle
                  @click.native="addNum(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import addhead from "@/components/common/head/head";
import { getInvoiceReturnOrderInfo, getInvoiceReturnOrderSkuList, creatReturnorder, getWarehouseList } from "@/api/order/invoiceOrder";
import { provinces_based_id, subs } from "@/api/basicSupplier";

export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      remoteLoading: false,
      orderInfo: {},
      invoiceInfo: {},
      skulist: [],
      warehouselist: [],
      warehouse: null,
      deliveryItemList:[],
      provinces: [],
      city: [],
      county: [],
      receiverCountys:[],
      receiverCitys:[],
      reasonList: [],
      isOther: false,
      initObject: {},
      multipleSelection: [],
      querySkuName:"",
      rulesForm:null,
      form: {
        returnAddressProvinceId: "",
        returnAddressCityId: "",
        returnAddressCountyId: "",
        returnAddressLine: "",
        returnReason: "", //退货原因
        returnContacts: "",
        returnPhone: "",
        status:'',//订单状态
        otherReasonDescription: "",
        returnOrderWarehouseItemParamList: null,
        returnWay:"RETURN_FACTORY",//退货方式
        receiver: "",
        receiverPhone: "",
        receiverAddressProvinceId : "",
        receiverAddressCityId : "",
        receiverAddressCountyId : "",
        receiverAddressLine: "",
        warehouseId:""
      },
      rules: {
        returnContacts: [
          {
            validator: check,
            message: "请填写退货联系人",
            trigger: "blur"
          }
        ],
        returnPhone: [
          {
            validator: check,
            message: "请正确填写退货联系人电话",
            trigger: "blur"
          }
        ],
        returnAddressProvinceId: [
          {
            validator: check,
            message: "请选择退货地址",
            trigger: "change"
          }
        ],
        returnAddressCityId: [
          {
            validator: check,
            message: "请选择退货地址",
            trigger: "change"
          }
        ],
        returnAddressCountyId: [
          {
            validator: check,
            message: "请选择退货地址",
            trigger: "change"
          }
        ],
        returnAddressLine: [
          {
            validator: check,
            message: "请输入退货详细地址",
            trigger: "blur"
          }
        ],
        returnReason: [
          {
            validator: check,
            message: "请选择退货原因",
            trigger: "change"
          }
        ],
        otherReasonDescription: [
          {
            validator: check,
            message: "请输入其他原因内容",
            trigger: "blur"
          }
        ]
      },
      rulesReceiver:{
        receiver: [
          {
            validator: check,
            message: "请填写寄回联系人",
            trigger: "blur"
          }
        ],
        receiverPhone: [
          {
            validator: check,
            message: "请正确填写寄回联系人电话",
            trigger: "blur"
          }
        ],
        receiverAddressProvinceId: [
          {
            validator: check,
            message: "请选择寄回地址",
            trigger: "change"
          }
        ],
        receiverAddressCityId: [
          {
            validator: check,
            message: "请选择寄回地址",
            trigger: "change"
          }
        ],
        receiverAddressCountyId: [
          {
            validator: check,
            message: "请选择寄回地址",
            trigger: "change"
          }
        ],
        receiverAddressLine: [
          {
            validator: check,
            message: "请输入寄回详细地址",
            trigger: "blur"
          }
        ]
      },
      rulesWarehouse:{
        warehouseId: [
          {
            validator: check,
            message: "请选择退货仓库",
            trigger: "change"
          }
        ]
      }
    };
  },
  components: {
    addhead
  },
  mounted() {},
  computed: {},
  methods: {
    init(obj) {
      this.orderInfo = obj.order;
      this.invoiceInfo = obj.invoice;
      this.reset();
      this.form.status = obj.order.status;
      this.getProvinces();
      this.initData(obj.invoice.id);
      this.initSkuList();
      this.isShow = true;
    },
    async initData(id) {
      let res = await getInvoiceReturnOrderInfo(id);
      Object.assign(this.initObject, res.data);
      this.form = {...this.form, ...res.data};
      this.reasonList = res.data.returnReasons;

      this.selectItem(res.data.returnReason);
      if (this.initObject.returnAddressProvinceId) {
        this.getcity(this.initObject.returnAddressProvinceId, true);
      }
      if (this.initObject.returnAddressCityId) {
        this.getcounty(this.initObject.returnAddressCityId, true);
      }

      this.$set(this, 'rulesForm', {...this.rules, ...this.rulesReceiver})
    },
    async initSkuList(){
      let resSku = await getInvoiceReturnOrderSkuList({orderDeliveryId: this.invoiceInfo.id, skuName: this.querySkuName});

      resSku.data.forEach((sku,index,arrs) => {
        sku.returnQty = sku.canReturnNum;
      });
      this.deliveryItemList = resSku.data;
    },
    selectItem(val) {
      if (val == "OTHER") {
        this.form.returnReason = val;
        this.isOther = true;
      } else {
        val != undefined && (this.form.returnReason = val);
        this.isOther = false;
      }
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = res.data;
        }
      });
    },
    getcity(id, isInit) {
      this.city = [];
      this.county = [];
      this.form.returnAddressCityId = "";
      this.form.returnAddressCountyId = "";
      subs(id).then(res => {
        if (res.code == "000000") {
          this.city = res.data;
          if (isInit) {
            this.form.returnAddressCityId = this.initObject.returnAddressCityId;
          }
        }
      });
    },
    getcounty(id, isInit) {
      this.county = [];
      this.form.returnAddressCountyId = "";
      subs(id).then(res => {
        if (res.code == "000000") {
          this.county = res.data;
          if (isInit) {
            this.form.returnAddressCountyId = this.initObject.returnAddressCountyId;
          }
        }
      });
    },
    getReceivercity(proviceId, reSelect) {
      if(reSelect){
        this.form.receiverAddressCityId = '';
        this.form.receiverAddressCountyId = '';
      }
      subs(proviceId).then(res => {
        if (res.code == "000000") {
          this.$set(this, 'receiverCitys', res.data)
        }
      });
    },
    getReceivercounty(cityId, reSelect) {
      if(reSelect){
        this.form.receiverAddressCountyId = '';
      }
      subs(cityId).then(res => {
        if (res.code == "000000") {
          this.$set(this, 'receiverCountys', res.data)
        }
      });
    },
    addNum(row) {
      if (!row.returnQty) {
        row.returnQty = 0;
      }
      if (row.returnQty < row.canReturnNum) {
        row.returnQty++;
        if (row.returnQty == 1) {
          this.toggleSelection(row, true);
          this.checkSkuExist(row, true);
        }
      }
    },
    reduceNum(row) {
      if (!row.returnQty) {
        row.returnQty = 0;
      }
      if (row.returnQty > 0) {
        row.returnQty--;
        if (row.returnQty == 0) {
          this.toggleSelection(row, false);
          this.checkSkuExist(row, false);
        }
      }
    },
    qtyChange(row){
      if(row.returnQty === ""){
        row.returnQty = -1;
      }
      if(row.returnQty < 0){
        row.returnQty = 0;
        this.toggleSelection(row, false);
      }else if (row.returnQty > row.canReturnNum) {
        row.returnQty = row.canReturnNum;
      }
      if(row.returnQty > 0){
        this.toggleSelection(row, true);
        this.checkSkuExist(row, true);
      }
    },
    checkSkuExist(row, type){
      let pos = -1;
      this.multipleSelection.forEach((sku, index) => {
        if(sku.skuId == row.skuId){
          pos = index;
        }
      })
      //增加且未添加过
      if(pos == -1 && type){
        this.multipleSelection.push(row);
      }else if(pos != -1 && !type){//减少且已被添加过
        this.multipleSelection.splice(pos, 1);
      }
    },
    toggleSelection(row, isSelect) {
      this.$refs['goodsTable'].toggleRowSelection(row, isSelect);
    },
    handleSelect(selection, row) {
      if(row.returnQty <= 0){
        this.toggleSelection(row, false);
        selection = selection.filter(item => {
          return item.id != row.id;
        })
        this.$message({
          type: "error",
          message: "要退货的商品数量不能为0"
        });
      }
      this.multipleSelection = selection;
    },
    handleSelectAll(selection) {
      selection = selection.filter(item => {
        if(item.returnQty <= 0){
          this.toggleSelection(item, false);
        }
        return item.returnQty > 0;
      })
      this.multipleSelection = selection;
    },
    checkboxT(row, rowIndex) {
      if (row.canReturnNum == 0) {
        return false; //禁用
      } else {
        return true; //不禁用
      }
    },
    changeRetrunWay(type){
      if(type == "RETURN_WAREHOUSE"){
        if(!this.warehouselist.length){
          this.form.warehouseId = "";
          getWarehouseList(this.$auth.user.userPosts[0].organizationId).then(
            res => {
              if (res.code == "000000") {
                this.warehouselist = res.data;
              }
            }
          );
        }
        this.$set(this, 'rulesForm', {...this.rules, ...this.rulesWarehouse})
      }else{
        this.$set(this, 'rulesForm', {...this.rules, ...this.rulesReceiver})
      }
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.multipleSelection.length == 0) {
            this.$message({
              type: "error",
              message: "请选择要退货的商品和数量"
            });
            return false;
          }
          this.multipleSelection.forEach(sku => {
            sku.orderDeliveryItemId = sku.id
          });
          this.form.returnOrderWarehouseItemParamList = this.multipleSelection;

          creatReturnorder(this.invoiceInfo.id, this.form).then(res => {
            if (res.code == "000000") {
              this.closeDialog();
              this.$emit("callback", "returnOrder");
              this.$message({
                type: "success",
                message: "申请退货成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.message || "申请退货失败"
              });
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "请填写相关信息"
          });
          console.log("error submit!!");
        }
      });
    },
    closeDialog() {
      this.isShow = false;
    },
    reset() {
      this.form = {
        returnAddressProvinceId: "",
        returnAddressCityId: "",
        returnAddressCountyId: "",
        returnAddressLine: "",
        returnReason: "", //退货原因
        returnContacts: "",
        returnPhone: "",
        status:'',//订单状态
        otherReasonDescription: "",
        returnOrderWarehouseItemParamList: null,
        returnWay:"RETURN_FACTORY",//退货方式
        receiver: "",
        receiverPhone: "",
        receiverAddressProvinceId : "",
        receiverAddressCityId : "",
        receiverAddressCountyId : "",
        receiverAddressLine: "",
        warehouseId:""
      };
      this.warehouselist = [];
      this.multipleSelection = [];
      this.$refs["orderForm"] && this.$refs["orderForm"].resetFields();
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
      width: 17%;
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
.detaillTable {
  width: 95%;
  margin: 0 auto;
  .tit {
    height: 40px;
    line-height: 40px;
    background-color: #f3f3f3;
    text-align: center;
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
.dialog-footer {
  text-align: center;
  padding: 10px 30px;
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
.el-autocomplete {
  width: 100%;
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
