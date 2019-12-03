<template>
<div class="priceSettingBox">
  <el-dialog :title="title" :visible.sync="isShow" width="30%" class="infoBox">
      <div class="headerBox">
        <p><span v-if="title=='通用价格设置'">项目名称： {{rows.projcetName}}</span>
         <span v-if="title=='通用价格设置'"  style="margin-left:20px;">限价：￥{{rows.limitPrice}}元</span>
         <span v-if="title=='官网价格设置'" style="margin-left:20px;">当前官网价：￥{{rows.websitePrice}}</span>
        </p>
      </div>
       <div>
           <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="设置售价：" prop="websitePrice">
                <el-input placeholder="填写售价，最多填写四位小数" v-model="ruleForm.websitePrice">
                <template slot="append">元</template>
             </el-input>
            </el-form-item>
            </el-form>
      </div>
     <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isShow=false">取 消</el-button>
      <el-button type="primary" @click="submit('ruleForm')">保 存</el-button>
    </div>
  </el-dialog>
  <priceTips ref="priceTips" @DialogCallback="dialogCallback()" @dialogPrice="dialogPrice()"></priceTips>
  </div>
</template>
<script>
import {editerGoodsPrice,editerOfficialPrice} from '@/api/goodsManage'
import priceTips from './price_tips'
export default {
  props: {
  },
  data() {
      var check = (rule, value, callback) => {
      if(this.title=='通用价格设置'){
        if(value>this.rows.limitPrice){
        return callback(new Error('售价不能大于限价'))
      }
      }
      if(this.title=='官网价格设置'){
          if(value<this.buyingPrice){
        return callback(new Error('售价不能低于建议采购价'))
      }
      }
     
      let patrn = /^(((\d*).\d{1,4})|(\d+))$/;
      if (!patrn.test(value)) {
        return callback(new Error("填写的数据规格有误"));
      }
      callback()
    };
    return {
      isShow: false,
      rows:{projcetName:'',limitPrice:'',skuId:'',websitePrice:''},
      ruleForm:{
       websitePrice:''
      },
      query:{isMall:null,projectId:'',projectPrice:'',mallSkuId:null},
      rules:{
          websitePrice:[{validator:check,trigger:'blur'}]
      },
      title:'',
      buyingPrice:''
    };
  },
  mounted() {
  },
  components:{
   priceTips
  },
  methods: {
    init(row,query,buyingPrice) {
      this.isShow = true;
      this.rows=row;
      console.log(this.rows,row,1111)
      this.query.isMall=row.isMall
      this.query.projectId=row.projectId
      this.title=query.title;
      this.query.mallSkuId=row.mallSkuId;
      this.buyingPrice=buyingPrice
    },
    dialogCallback(){
      editerOfficialPrice(this.rows.skuId,this.ruleForm.websitePrice).then(res=>{
        console.log(res.data,555)
              if(res.data==null||[]){
                  this.$message({
                      message:'官网价格修改成功',
                      type:'success'
                  })
                  this.isShow=false;
                  this.$emit('dialogBack',this.ruleForm.websitePrice)
              }else{
                this.$refs.priceTips.init(res.data,this.title)
              }       
     })
    },
    dialogPrice(){  
       this.query.projectPrice=this.ruleForm.websitePrice; 
      //  if(this.query.isMall){
      //  }
          editerGoodsPrice(this.rows.skuId,this.query).then(res=>{   
              if(res.code=='000000'){
                  this.$message({
                      message:'通用价格修改成功',
                      type:'success'
                  })
                  this.isShow=false;
              }else{
              }         
     })
      
    },
    submit(formName){
      this.$refs[formName].validate((valid)=>{
          if(valid){
              if(this.title=='官网价格设置'){
                  if(this.ruleForm.websitePrice<this.rows.limitPrice){
                      this.$refs.priceTips.init(this.ruleForm.websitePrice,this.title);   
                  }else{
                      this.dialogCallback();
                  }
              }
              if(this.title=='通用价格设置'){
                   if(this.ruleForm.websitePrice<this.buyingPrice){
                       this.$refs.priceTips.init(this.ruleForm.websitePrice,this.title)
                   }else{
                      this.dialogPrice()
                   }
              }
          }
      })
    }
  }
};
</script>
<style  lang="less">
.priceSettingBox{
 .headerBox{
     
 }

}
</style>
 