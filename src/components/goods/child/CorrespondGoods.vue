<template>
<div class="correspondBox">
  <el-dialog title="新增关联关系" :visible.sync="isShow" width="30%" >
      <el-form ref="correspondRef" :rules="personPhone" :model="query">
      <div class="contentBox" style="font-weight:bold;font-size:16px">新商品</div>
      <el-form-item prop="" class="rules" style="flex-direction: row;align-items: flex-start;">
       <span slot="label">新商品编号：</span>
       <el-input type="text" style="width: 60%" v-model="query.des" placeholder="输入一个新商品编号" @input="query.des=query.des.replace(/[^\d]/g,'')" @blur="getNewGoods" clearable></el-input>
      </el-form-item>
      <div style="margin-top:10px;height:100%;word-wrap: break-word; word-break: normal; ">新商品名称：<span style="color:#339999">{{query.newGoodsName}}</span></div> 
      <div style="margin-top:15px;" >
        <div class="contentBox" style="font-weight:bold;font-size:16px;">关联旧商品  <el-button size="small" type="text" @click="addCorrespond">
            添加关联商品
            </el-button>
        </div> 
        <div style="height:280px;overflow:auto">
        <div v-for="(item,index) in query.organizationContacts"
          :key="item.key" >
         <el-form-item
            class="rules"
            :rules="personPhone.name"
            style="flex-direction: row;align-items: flex-start;"
          >
            <span slot="label">商品ID：&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-input v-model="item.name" placeholder="输入一个旧商品ID" style="width: 60%" @input="item.name=item.name.replace(/[^\d]/g,'')" @blur="getOldName(item.name,index)"></el-input>
          </el-form-item>
          <el-form-item
            class="rules"
            style="flex-direction:row;align-items:flex-start;"
          >
            <span slot="label">商品名称：&nbsp;&nbsp;&nbsp;</span>
               <el-input v-model="item.phone" placeholder="输入旧商品ID，自动查询名称" style="width: 60%" disabled></el-input>
               <el-button @click="deleteRules(index)" v-if="index!=0">删除</el-button>
          </el-form-item>   
        </div>  
        </div>
      </div>
     
    </el-form> 
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowCallback()">关 闭</el-button>
      <el-button type="primary" @click="disCallback('correspondRef')">保 存</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import {
 getNameByOldId,
 findNewErpGoods,
 createCorrespondGoods
} from "@/api/goods/goodsCorrespondManage.js";
export default {
  props: {
      
  },
  data() {
    return {  
      isShow: false,
      query:{
       des:"",
       newGoodsId:null,
      newGoodsName:'',
      organizationContacts:[{name:'',phone:''}],
      },
      
      
       personPhone: {
        name: [
          {
            required: true,
            message: "商品ID不能为空",
            trigger: "blur"
          },
          { min: 1, max: 15, message: "字数长度在1~15字以内" }
        ],
        phone: [
          /*{required: true, message: '联系方式不能为空', trigger: 'blur'},*/ {
            trigger: "blur"
          }
        ],
      },
      
    };
  },
  mounted() {
  },
  methods: {
    init(row) {
      this.isShow = true;
    },
    isShowCallback(){
     this.isShow=false  
               this.$emit('corrCallback');
               this.query.des=null;
               this.query.newGoodsId=null;
               this.query.newGoodsName=null;    
               this.query.organizationContacts=[{name:'',phone:''}] 
    },
    getNewGoods(){
      if(this.query.des){
       findNewErpGoods(this.query.des).then(res=>{
         this.query.newGoodsName=res.data.skuName;   
         this.query.newGoodsId=res.data.skuId;   
      })
      }
    },
    getOldName(value,index){
     if(value){
      getNameByOldId(value).then(res=>{
         if(res.code=='000000'){
         this.query.organizationContacts[index].phone=res.data  
         }
     }).catch(()=>{
       this.query.organizationContacts[index].phone=null; 
     })
     } 
    },
    addCorrespond(){
    this.query.organizationContacts.push({name:'',phone:''})
    },
    deleteRules(index){
     this.query.organizationContacts.splice(index,1) 
    },
    disCallback(formname){
      this.$refs[formname].validate((valid)=>{
        if(valid){
          let str=[];
          str=this.query.organizationContacts.filter((item)=>{
            return item.name&&item.phone
          }).map(item=>{
            return item.name
          })
        if(this.query.newGoodsId){
         createCorrespondGoods(this.query.newGoodsId,str).then(res=>{
            if(res.code=='000000'){
               this.$message({
                 message:'添加商品对应关系成功',
                 type:'success'
               })
               this.isShow=false  
               this.$emit('corrCallback');
               this.query.des=null;
               this.query.newGoodsId=null;
               this.query.newGoodsName=null;    
               this.query.organizationContacts=[{name:'',phone:''}]        
            }
         })
        }else{
          this.$message({
            message:'新商品编号不存在',
            type:'error'
          })
          // this.$emit('corrCallback');
               this.query.des=null;
               this.query.newGoodsId=null;
        }
        }
      })
    }
  }
};
</script>
<style  lang="less" scoped>
.correspondBox{
      .el-form{
      }
       
}
</style>
