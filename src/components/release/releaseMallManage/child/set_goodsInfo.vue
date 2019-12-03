<template>
  <el-dialog title="设置商品信息" :visible.sync="isShow">
    <el-form :model="form" ref="goodsInfo" :rules="rules" class="">
      <el-form-item label="商品名称：" prop="skuName" class="listBox">
       <el-input style="width:400px" v-model="form.skuName" placeholder="设置针对此项目该商品的展示名称"></el-input>      
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('goodsInfo')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  editerGoodsName
} from "@/api/release/mallProjectManage.js";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      data: null,
      mallId: null,
      form: {
        skuName:null
      },
      row: null,
      rules: {
       skuName:[{required:true,message:'商品名称不能为空',trigger:'blur'}]
      }
    };
  },
  mounted() {},
  methods: {
    init(row, id) {
      this.isShow = true;
      this.mallId = id;
      this.row=row
    },
    submitForm(formName){
        this.$refs[formName].validate((valid)=>{
            if(valid){
             editerGoodsName(this.row.id,this.mallId,this.form.skuName).then(res=>{
                 if(res.code=='000000'){
                     this.$message({
                         message:"设置商品名称成功",
                         type:'success'
                     })
                     this.isShow=false;
                     this.form.skuName='';
                     this.$emit('Goodscallback')
                 }
             })
            }
        })
    }
  
  }
};
</script>
<style scoped lang="less">

</style>