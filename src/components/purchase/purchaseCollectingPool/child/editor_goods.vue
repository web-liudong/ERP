<template>
  <el-dialog title="编辑集采商品" :visible.sync="isShow" width="650px">
    <div class="goodsTable">
      <div class="tables">
        <table border="1" :tableData="tableData">
          <tr>
            <th>商品名称：</th>
            <td colspan="3">{{tableData.skuName}}</td>
          </tr>
          <tr>
            <th>商品分类：</th>
            <td colspan="3">{{tableData.categoryName}}</td>
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
  getPoolEditor,
  putSkuPool
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
        minQty: null,
        memo: null
      },
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
      query: null
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
    init(row) {
      this.getPoolEditor(row.id);
      this.form.centralizedPrice = row.centralizedPrice;
      this.form = {
        centralizedPrice: row.centralizedPrice,
        minQty: row.minQty,
        memo: row.memo
      };
    },
    reset() {
      this.form = {
        centralizedPrice: null,
        minQty: null,
        memo: null
      };
      this.goodsInfo = {
        skuId: null,
        skuNo: null
      };
    },
    getPoolEditor(id) {
      getPoolEditor(id).then(res => {
        this.isShow = true;
        this.tableData = res.data;
        console.log(this.tableData, "888");
        this.goodsInfo = {
          skuId: res.data.skuId,
          skuNo: res.data.skuNo,
          id: res.data.id
        };
      });
    },
    checkForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.submitForm();
        } else {
          return false;
        }
      });
    },
    submitForm() {
      this.query = Object.assign(this.form, this.goodsInfo);
      putSkuPool(this.query).then(res => {
        if (res.code == "000000") {
          this.isShow = false;
          this.reset();
          this.$emit("callback", "editorGoods");
        } else {
          this.$message({
            message: `${res.data.message}`,
            type: "error"
          });
        }
      });
    },
    cancel(form) {
      this.isShow = false;
      this.$refs[form].resetFields();
    }
  }
};
</script>
<style scoped lang="less">
.goodsTable {
  width: 100%;
  .tables {
    margin-bottom: 10px;
    table {
      width: 100%;
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