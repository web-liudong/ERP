<template>
  <el-dialog
    class="addSatefyStockDemandBox"
    title="添加需求明细"
    :visible.sync="dialogFormVisible"
    :before-close="closeDialog"
  >
    <el-form :inline="true" :model="form" class="demo-form-inline" ref="form" :rules="rules">
      <div class="chunk">
        <el-form-item label="紧急程度" prop="urgentLevel">
          <span slot="label">紧急程度：</span>
          <el-select v-model="form.urgentLevel" clearable placeholder="请选择紧急程度">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求类型">
          <span slot="label">需求类型：</span>
          <span>{{form.requirementType=='ORDER_DEMAND'?'订单需求':form.requirementType=='SAFETY_STOCK_DEMAND'?'安全库存需求':form.requirementType=='CUSTOM_DEMAND'?'自定义需求':''}}</span>
        </el-form-item>
      </div>

      <div class="chunk">
        <el-form-item label="商品编号：" prop="skuNo">
          <span slot="label">商品编号：</span>
          <div style="width:200px;">{{form.skuNo}}</div>
          <div style="width:200px;" v-if="!form.skuNo">请选择商品</div>
        </el-form-item>
        <el-form-item prop="skuName">
          <span slot="label">商品名称：</span>
          <el-select
            v-model="form.skuName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="getUnit"
            clearable
          >
            <el-option
              v-for="item in goodsOptions"
              :key="item.skuId"
              :label="item.skuName"
              :value="item.skuNo"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="chunk">
        <el-form-item label="需求数量：" prop="requirementQty">
          <el-input v-model="form.requirementQty" @input="form.requirementQty=form.requirementQty.replace(/[^\d]/g,'')" placeholder="请输入需求数量" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label">计量单位：</span>
          <!-- <el-input v-model="name" placeholder="请输入收货地址" v-if="form.warehouse==0" clearable></el-input> -->
          <span>{{unit}}</span>
          <span v-if="!unit">请选择商品</span>
        </el-form-item>
      </div>
      <div class="chunk">
        <el-form-item label="仓库：" :prop="form.warehouseId===0?'':'warehouseId'">
          <el-select
            v-model="form.warehouseId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入仓库名"
            :remote-method="remoteMethodWarehouse"
            @change="getrecipientAddressLine"
            @clear="clear"
            :loading="loading"
          >
            <el-option
              v-for="item in Warehouseoptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.warehouseId!=0">
          <span slot="label">仓库地址：</span>
          <span style="width:200px;">{{form.recipientAddressLine}}</span>
          <span style="width:200px;" v-if="!form.recipientAddressLine">请选择仓库</span>
        </el-form-item>
        <el-form-item prop="recipientAddressLine" v-else>
          <span slot="label">仓库地址：</span>
          <el-input v-model="form.recipientAddressLine" :maxlength="200" placeholder="请输入仓库地址" clearable></el-input>
        </el-form-item>
      </div>
      <div class="chunk">
        <el-form-item label="备注说明：">
          <span slot="label">备注说明：</span>
          <el-input v-model="form.memo" placeholder="请输入备注说明" clearable style="width:255%;"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDia()">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createPurchaseDemand,
  getGoodsList,
  findWarehouse,
  byTokenGetUserList
} from "@/api/purchase/purchase.js";
import { debug } from "util";
export default {
  data() {
    const checkUrgent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("紧急程度不能为空"));
      } else {
        callback();
      }
    };
    const checkDemandQuantity = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("需求数量不能为空"));
      }else if((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) == false){
            callback(new Error("需求数量须大于或等于0且必须为数字"));
      } else {
        callback();
      }
    };
    const checkGoods = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("商品名称不能为空"));
      } else {
        callback();
      }
    };
    const checkWarehouse = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("仓库不能为空"));
      } else {
        callback();
      }
    };
    const checkAddress = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("仓库地址不能为空"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      isShow: false,
      name: "",
      index: null,
      loading: false,
      multipleSelection: [],
      unit: "",
      skuName: "", //商品名称的临时存储
      goodsOptions: [], //商品名称
      Warehouseoptions: [],
      form: {
        name: "",
        warehouse: "",
        skuId: "",
        skuNo: "",
        warehouseId: null,
        recipientAddressLine: "",
        memo: "",
        warehouseName: "",
        requirementQty: 1,
        requirementType: "",
        recipientAddressProvinceId: null,
        recipientAddressCountyId: null,
        recipientAddressCountyId: null
      },
      tableData: [
        { index: 0, name: "", user: "33" },
        { index: 1, name: "", user: "44" }
      ],
      options: [{ label: "不紧急", value: "0" }, { label: "紧急", value: "1" }],
      //  options:[{value:'不紧急',label:0},{value:'紧急',label:1}],
      rules: {
        urgentLevel: [
          { validator: checkUrgent, required: true, trigger: "blur" },
          { validator: checkUrgent, trigger: "change" }
        ],
        skuName: [
          { validator: checkGoods, required: true, trigger: "blur" },
          { validator: checkGoods, trigger: "change" }
        ],
        requirementQty: [
          { validator: checkDemandQuantity, required: true, trigger: "blur" },
          { validator: checkDemandQuantity, required: true, trigger: "change" }
        ],
        warehouseId: [
          { validator: checkWarehouse, required: true, trigger: "blur" },
          { validator: checkWarehouse, required: true, trigger: "change" }
        ],
        recipientAddressLine: [
          { validator: checkAddress, required: true, trigger: "blur" },
          { validator: checkAddress, required: true, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    init(name) {
      this.form.requirementType = name;
      this.dialogFormVisible = true;
    },
    getGoodsDemand() {
      if (this.form.name) {
        this.isShow = true;
      }
    },
    closeDialog(done) {
      done();
      this.form = {
        name: "",
        warehouse: "",
        skuId: "",
        skuNo: "",
        warehouseId: null,
        recipientAddressLine: "",
        memo: "",
        warehouseName: "",
        requirementQty: 1,
        requirementType: "",
        recipientAddressProvinceId: null,
        recipientAddressCountyId: null,
        recipientAddressCountyId: null
      };
      this.$refs["form"].resetFields();
    },
    getUnit(value) {
      let str = JSON.parse(JSON.stringify(this.goodsOptions));
      str = str.filter((item, index) => {
        return item.skuNo == value;
      });
      this.unit = str[0] && str[0].unit;
      this.form.skuNo = str[0] && str[0].skuNo;
      this.form.skuId = str[0] && str[0].skuId;
      this.skuName = str[0] && str[0].skuName;
    },
    clear(value) {
      console.log(111, value);
    },
    getrecipientAddressLine(value) {
      if (value == "") {
        this.form.recipientAddressLine = "";
        this.$refs.form.clearValidate(["warehouseId"]);
      } else if (value === 0) {
        this.form.recipientAddressLine = "";
        this.form.warehouseId = 0;
      } else {
        let aa = JSON.parse(JSON.stringify(this.Warehouseoptions));
        aa = aa.filter((item, i) => {
          return item.id == value;
        });
        console.log(aa, 88888);
        this.form.recipientAddressProvinceId = aa[0] && aa[0].provinceId;
        this.form.recipientAddressCityId = aa[0] && aa[0].cityId;
        this.form.recipientAddressCountyId = aa[0] && aa[0].countyId;
        this.form.warehouseName = aa[0] && aa[0].name;
        this.form.recipientAddressLine =
          "" +
          aa[0].provinceName +
          " " +
          aa[0].cityName +
          " " +
          aa[0].countyName +
          " " +
          aa[0].addressLine;
        this.form.warehouseId = aa[0] && aa[0].id;
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let aa = { name: query };
        getGoodsList(aa).then(res => {
          console.log(res.data,'whp');
          this.goodsOptions = res.data;
          this.loading = false;
        });
      } else {
        this.goodsOptions = [];
      }
    },
    remoteMethodWarehouse(query) {
      if (query !== "") {
        this.loading = true;
        let str = window.localStorage.getItem("UserInfo");
        let userPosts=JSON.parse(str).userPosts;
        this.organizationId=userPosts[0].organizationId;
            if (this.organizationId) {
              findWarehouse({
                organizationId: this.organizationId,
                name: query
              }).then(res => {
                this.$nextTick(() => {
                  this.Warehouseoptions = res.data;
                });
                this.loading = false;
              });
            }
      } else {
        this.Warehouseoptions = [];
      }
    },
    getIndex(value) {
      console.log(value, 555);
      this.multipleSelection = value;
    },
    closeDia() {
      this.$confirm("是否放弃本次操作，放弃后填写的数据将会丢失", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          this.dialogFormVisible = false;
          this.form = {
            name: "",
            warehouse: "",
            skuId: "",
            skuNo: "",
            warehouseId: null,
            recipientAddressLine: "",
            memo: "",
            warehouseName: "",
            requirementQty: "",
            requirementType: "",
            recipientAddressProvinceId: null,
            recipientAddressCountyId: null,
            recipientAddressCountyId: null
          };
          this.$refs["form"].resetFields();
        })
        .catch(() => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("satefyDialog", {
            skuId: this.form.skuId,
            skuNo: this.form.skuNo,
            skuName: this.skuName,
            customerName: "",
            customerId: null,
            memo: this.form.memo,
            orderId: null,
            orderNo: null,
            recipientAddressLine: this.form.recipientAddressLine,
            requirementQty: this.form.requirementQty,
            requirementType:
              this.form.requirementType == "SAFETY_STOCK_DEMAND"
                ? 1
                : this.form.requirementType == "CUSTOM_DEMAND"
                ? 2
                : null,
            urgentLevel: this.form.urgentLevel,
            warehouseId: this.form.warehouseId,
            warehouseName: this.form.warehouseName,
            recipientAddressProvinceId: this.form.recipientAddressProvinceId,
            recipientAddressCityId: this.form.recipientAddressCityId,
            recipientAddressCountyId: this.form.recipientAddressCountyId,
            longId:Date.now().toString(36)
          });
          this.dialogFormVisible = false;
          this.form = {
            name: "",
            warehouse: "",
            skuId: "",
            skuNo: "",
            warehouseId: null,
            recipientAddressLine: "",
            memo: "",
            warehouseName: "",
            requirementQty: "",
            requirementType: "",
            recipientAddressProvinceId: null,
            recipientAddressCountyId: null,
            recipientAddressCountyId: null
          };
          this.$refs[formName].resetFields();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.addOrderDemandBox {
  .chunk {
    display: flex;
    .el-form-item {
      flex-direction: row;
      justify-content: space-between;
      //  display: flex;
      // flex: 1;
      //    .el-button{
      //     flex:1;
      //    }
      .el-input {
        flex-direction: row;
        justify-content: flex-start;
      }
    }
  }
}
</style>
<style lang="less">
.addSatefyStockDemandBox {
  .el-dialog {
    .el-form {
      .el-form-item {
        .el-form-item__label {
          width: 100px;
        }
      }
    }
  }
}
</style>





