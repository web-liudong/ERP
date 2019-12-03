<template>
  <el-dialog title="添加集采商品" :visible.sync="isShow" width="600px">
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="inputBox">
          <span>商品名称：</span>
          <el-select
            v-model="skuName"
            filterable
            remote
            clearable
            placeholder="商品名称"
            :remote-method="skuNameMethod"
            @change="skuNameChange"
          >
            <el-option
              v-for="item in searchskuNames"
              :key="item.skuNo"
              :label="item.skuName"
              :value="item.skuNo"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="inputBox">
          <span>商品编号：</span>
          <el-input
            placeholder="商品编号"
            v-model="skuNo"
            @input="skuNo=skuNo.replace(/[^\d]/g,'')"
            clearable
            :disabled="disabled"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="search">查询</el-button>
      </el-col>
    </el-row>
    <div class="goodsTable" v-show="this.tableData.length !== 0">
      <div class="tables">
        <table border="1" :tableData="tableData">
          <tr>
            <th>商品名称：</th>
            <td colspan="3">{{tableData.name}}</td>
          </tr>
          <tr>
            <th>商品分类：</th>
            <td
              colspan="3"
            >{{tableData.firstLevelCategoryName}}>{{tableData.secondLevelCategoryName}}>{{tableData.thirdLevelCategoryName}}</td>
          </tr>
          <tr>
            <th>品牌：</th>
            <td>
              {{tableData.brandNameCN}}
              <span
                v-if="tableData.brandNameEN"
              >({{tableData.brandNameEN}})</span>
            </td>
            <th>销售单位：</th>
            <td>{{tableData.unit}}</td>
          </tr>
        </table>
      </div>
      <el-row>
        <el-form :model="form" ref="goodsFrom2" :rules="rules" label-width="130px">
          <el-col :span="12">
            <el-form-item label="集采价格：" prop="centralizedPrice">
              <el-input
                v-model="form.centralizedPrice"
                @input="(value) => changePrice(value)"
                @blur="blurPrice"
                placeholder="请输入集采价格"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起订量：">
              <el-input
                v-model="form.minQty"
                @input="form.minQty=form.minQty.replace(/[^\d]/g,'')"
                placeholder="请输入起订量"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input v-model="form.memo" placeholder="请输入备注" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('goodsFrom2')">取 消</el-button>
      <el-button type="primary" @click="checkForm('goodsFrom2')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  selectProduct,
  createSkuPool,
  getSkuNo
} from "@/api/purchase/purchaseCollectingPool";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      form: {
        centralizedPrice: null,
        minQty: 0,
        memo: null
      },
      skuName: null,
      skuNo: null,
      searchskuNames: [],
      rules: {
        centralizedPrice: [
          {
            validator: check,
            required: true,
            trigger: "blur",
            message: "集采价格不能为空"
          }
        ]
      },
      tableData: [],
      goodsInfo: {
        skuId: null,
        skuNo: null
      },
      disabled: false
    };
  },
  methods: {
    changePrice(value) {
      this.form.centralizedPrice = value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^\./g, '')
      if (this.form.centralizedPrice.indexOf(".") < 0 && this.form.centralizedPrice != "") {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        this.form.centralizedPrice = parseFloat(this.form.centralizedPrice);
      }
      return this.form.centralizedPrice;
    },
    blurPrice() {
      this.form.centralizedPrice = Number(this.form.centralizedPrice).toFixed(4);
      return this.form.centralizedPrice;
    },
    init() {
      this.isShow = true;
      this.reset();
    },
    reset() {
      this.goodsInfo = {
        skuId: null,
        skuNo: null
      };
      this.skuName = null;
      this.skuNo = null;
      this.disabled = false;
      this.tableData = [];
      this.form = {
        centralizedPrice: null,
        minQty: 0,
        memo: null
      };
    },
    search() {
      if (this.skuNo == null || this.skuNo == "") {
        this.$message({
          message: "请先输入查询条件",
          type: "error"
        });
      } else {
        getSkuNo(this.skuNo).then(res => {
          this.tableData = res.data;
          this.goodsInfo = { skuId: res.data.id, skuNo: res.data.no };
        });
        this.form = {
          centralizedPrice: null,
          minQty: 0,
          memo: null
        };
      }
    },
    checkForm(form) {
      if (this.skuNo == null) {
        this.$message({
          message: "请先输入查询条件",
          type: "error"
        });
      } else {
        this.$refs[form].validate(valid => {
          if (valid) {
            this.submitForm();
          } else {
            return false;
          }
        });
      }
    },
    submitForm() {
      this.query = Object.assign(this.form, this.goodsInfo);
      createSkuPool(this.query)
        .then(res => {
          if (res.code == "000000") {
            this.isShow = false;

            this.$emit("callback", "addGoods");
          } else {
            this.$message({
              message: `${res.data.message}`,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    skuNameChange(value) {
      if (value == "" || value == null) {
        this.disabled = false;
        this.skuNo = null;
      } else {
        this.skuNo = value;
        this.disabled = true;
      }
    },
    //商品名称模糊查询
    skuNameMethod(query) {
      if (query != "") {
        selectProduct({ name: query }).then(res => {
          this.searchskuNames = res.data;
        });
      } else {
        this.searchskuNames = [];
      }
    },
    cancel(form) {
      this.isShow = false;
      this.$refs[form].resetFields();
    }
  }
};
</script>
<style scoped lang="less">
.inputBox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .el-input {
    flex: 1;
  }
  .el-select {
    flex: 1;
  }
}
.goodsTable {
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;

  .tables {
    table {
      width: 90%;
      margin: 20px auto;
      th,
      td {
        border: 1px solid #d1d1d1;
        height: 50px;
      }
      th {
        font-weight: bold;
        background: #f5f7fa;
        text-align: right;
        width: 20%;
      }
      td {
        text-align: left;
        width: 30%;
        padding-left: 10px;
      }
    }
  }
}
</style>