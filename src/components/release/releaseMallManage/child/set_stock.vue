<template>
  <el-dialog title="库存设置" :visible.sync="isShow" width="400px">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="mallSkuInventoryParam" ref="salePriceForm" :rules="rules">
            <el-form-item label="设置库存" prop="inventory">
              <el-input type="number" v-model="mallSkuInventoryParam.inventory" placeholder="请输入1-10000的数字"></el-input>
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
import { setStockGoods,batchSetStock } from "@/api/release/mallProjectManage";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请填写库存限制"));
      }
      if(1>value||value>10000){
        return callback(new Error('请填写1~10000之间的整数'))
      }
      callback();
    };
    return {
      isShow: false,
      mallSkuInventoryParam: {
        inventory: "",
        ids:null
      },
      row:null,
      rules: {
        inventory: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      console.log(row,888888);
      this.row=row
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if(this.row instanceof Array){
            this.mallSkuInventoryParam.ids=this.row;
            batchSetStock(this.mallSkuInventoryParam).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message:'批量设置库存成功',
                  type:'success'
                })
                this.isShow=false
                this.$emit('callback','stock')
                this.mallSkuInventoryParam.inventory='';
              }
            })
          }else {
            setStockGoods(this.row.id,this.mallSkuInventoryParam).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message:'设置库存成功',
                  type:'success'
                })
                this.isShow=false;
                this.$emit('callback','stock')
                this.mallSkuInventoryParam.inventory='';
              }
            })
          }
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
