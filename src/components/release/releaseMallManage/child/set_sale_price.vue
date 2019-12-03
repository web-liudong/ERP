<template>
  <el-dialog title="通用价格设置" :visible.sync="isShow">
    <el-row>
      <el-col>商品：{{row.skuName}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="7">采购价(含税)：{{row.buyingPrice}}</el-col>
      <el-col :span="7">建议销售价：{{row.sellingPrice}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="7">目前仓报价：--</el-col>
      <el-col :span="7">当前官网价：{{row.websitePrice}}元</el-col>
      <el-col :span="7">当前限价：{{row.limitPrice}}元</el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form :model="mallSkuLimitPriceParam" ref="salePriceForm" :rules="rules" label-width="98px">
          <el-form-item label="设置项目售价" prop="mallPrice">
            <el-input v-model="mallSkuLimitPriceParam.mallPrice" placeholder="填写售价，最多填写2位小数">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('salePriceForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { setGoodsSale} from "@/api/release/mallProjectManage";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("项目售价不能为空"));
      }
      if(value==0){
        return callback(new Error("项目售价不能为0"))
      }
      let patrn = /^(((\d*).\d{1,2})|(\d+))$/;
      if (!patrn.test(value)) {
        return callback(new Error("填写的数据规格有误"));
      }
      if (value > (this.row.limitPrice)) {
        return callback(new Error("项目售价不能大于商品在项目中的限价"));
      }
      callback();
    };
    return {
      isShow: false,
      data: null,
      mallSkuLimitPriceParam: {
        mallPrice: ""
      },
      row:{
        skuName:'',
        websitePrice:'',
        limitPrice:'',
        id:'',
        sellingPrice:'',
        buyingPrice:'',
      },
      rules: {
        mallPrice: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.row=row;
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          setGoodsSale(this.row.id,this.mallSkuLimitPriceParam).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message:"设置售价成功",
                type:'success'
              })
              this.isShow=false;
              this.$emit('callback','salePrice')
              this.mallSkuLimitPriceParam.mallPrice='';
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
