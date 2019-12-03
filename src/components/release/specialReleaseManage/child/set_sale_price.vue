<template>
  <el-dialog title="通用价格设置" :visible.sync="isShow" width="600px">
    <el-row>
      <el-col>商品：{{row.name}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="7">建议采购价：{{formatPrice(row.buyingPrice)}}元</el-col>
      <el-col :span="7">建议销售价：{{formatPrice(row.sellingPrice)}}元</el-col>
    </el-row>
    <el-row>
      <el-col :span="7">目前仓报价：-</el-col>
      <el-col :span="7">当前官网价：{{formatPrice(row.websitePrice)}}元</el-col>
      <el-col :span="7">当前限价：{{formatPrice(row.limitedPrice)}}元</el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form :model="form" ref="salePriceForm" :rules="rules" label-width="98px">
          <el-form-item label="设置项目售价" prop="projectPrice">
            <el-input type="number" v-model="form.projectPrice" placeholder="填写售价，最多填写2位小数">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="checkForm('salePriceForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { returnFloat } from "@/utils/index";
import { setGoodsPrice } from "@/api/release/specialProjectManage";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("项目售价不能为空"));
      }
      let patrn = /^(((\d*).\d{1,2})|(\d+))$/;
      if (!patrn.test(value)) {
        return callback(new Error("只允许输入最多2位小数"));
      }
      if (value > (this.row.limitedPrice)) {
        return callback(new Error("项目售价不能大于商品在项目中的限价"));
      }
      callback();
    };
    return {
      isShow: false,
      id:'',
      skuId:'',
      row:{
        name:'',
        buyingPrice:0,
        sellingPrice:0,
        websitePrice:0,
        projectPrice:0,
      },
      form: {
        projectPrice: ""
      },
      rules: {
        projectPrice: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    init(data) {
      this.id = data.shoppeId;
      this.row = data.row;
      this.skuId = data.row.id;
      this.form.projectPrice = data.row.projectPrice;
      this.isShow = true;
    },
    checkForm(form){
      this.$refs[form].validate(valid => {
        if (valid) {
          this.submitForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm() {
      setGoodsPrice(this.id, this.skuId, this.form.projectPrice).then(res => {
        this.isShow = false;
        this.$emit("callback",'salePrice');
        this.$message({
            type: "success",
            message: "设置售价成功!"
          });
      });
      
    },
    formatPrice(money){
      return returnFloat(money);
    }
  }
};
</script>
<style scoped lang="less">
.el-row {
  line-height: 30px;
  font-size: 14px;
}
</style>