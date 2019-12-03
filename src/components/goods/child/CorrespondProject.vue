<template>
<div class="correspondBox">
  <el-dialog title="新增关联关系" :visible.sync="isShow" width="40%" >
      <el-form ref="correspondRef" :rules="personPhone" :model="query">
      <div class="contentBox" style="font-weight:bold;font-size:16px">新项目</div>
      <el-form-item prop="" class="rules" style="flex-direction: row;align-items: flex-start;">
       <span slot="label">新项目编号：</span>
       <el-input type="text" style="width: 60%" v-model="query.des" placeholder="输入一个新项目编号" @input="query.des=query.des.replace(/[^\d]/g,'')" @blur="getNewGoods" clearable></el-input>
      </el-form-item>
      <div style="margin-top:10px;height:100%;word-wrap: break-word; word-break: normal; ">新项目名称：<span style="color:#339999">{{query.newProjectName}}</span></div> 
      <div style="margin-top:15px;" >
        <div class="contentBox" style="font-weight:bold;font-size:16px;">关联旧项目  <el-button size="small" type="text" @click="addCorrespond">
            添加关联项目
            </el-button>
        </div> 
        <div style="height:280px;overflow:auto">
        <div v-for="(item,index) in query.organizationContacts"
          :key="item.key" >
          <div class="formBox">
           <span>项目类型：</span>
           <el-form-item
            class="rules"
            :rules="personPhone.projectType"
            :prop="'organizationContacts.'+index+'.projectType'"
            style="flex-direction:row;align-items:flex-start;"
          >
          <el-select v-model="item.projectType" clearable placeholder="全部">
                <el-option
                  v-for="item in optionsOldProject"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
          </el-form-item>
          <span>项目ID：</span>
          <el-form-item
            class="rules"
            :rules="personPhone.name"
            :prop="'organizationContacts.'+index+'.name'"
            style="flex-direction:row;align-items:flex-start;"
          >
            <el-input v-model="item.name"  placeholder="输入一个旧项目ID"  @input="item.name=item.name.replace(/[^\d]/g,'')" @blur="getOldName(item,index)"></el-input>
          </el-form-item>
          </div>
          <div class="formBoxBottom">
            <span>项目名称：</span>
           <el-form-item
            style="flex-direction:row;align-items:flex-start;width:70%"
          >
            <!-- <span slot="label">项目名称：&nbsp;&nbsp;&nbsp;</span> -->
               <el-input v-model="item.phone" placeholder="输入旧项目ID，自动查询名称" style="" disabled></el-input>
          </el-form-item> 
           <el-button @click="deleteRules(index)" type="danger" v-if="index!=0" size="small" style="height:40px;margin-left:5px;">删除</el-button>
          </div>  
           
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
 searchProjectInfo,
 CreateProjectCorrespond
} from "@/api/goods/projectCorrespondManage.js";
export default {
  props: {
      
  },
  data() {
    return {  
      isShow: false,
      optionsOldProject:[{label:'商城',value:2},{label:'专柜',value:3}],
      query:{
       des:"",
       newProjectId:null,
       newProjectName:'',
       organizationContacts:[{projectType:null,name:'',phone:''}],
      },
       personPhone: {
        projectType:[{required:true,message:'项目类型不能为空',trigger:'blur'}],  
        name: [
          {
            required: true,
            message: "项目ID不能为空",
            trigger: "blur"
          },
          { min: 1, max: 15, message: "字数长度在1~15字以内" }
        ],
        phone: [
          {required: true, message: '项目名称不能为空', trigger: 'blur'}
           
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
               this.$refs.correspondRef.resetFields();
               this.query.des=null;
               this.query.newProjectId=null;
               this.query.newProjectName=null;    
               this.query.organizationContacts=[{projectType:null,name:'',phone:''}] 
    },
    getNewGoods(){
      if(this.query.des){
       searchProjectInfo(this.query.des).then(res=>{
         this.query.newProjectName=res.data.projectName;   
         this.query.newProjectId=res.data.projectId;   
      })
      }
    },
    getOldName(value,index){
      if(value.projectType){
       if(value.name){
      getNameByOldId(value.projectType,value.name).then(res=>{
         if(res.code=='000000'){
           if(res.data.length){
           this.query.organizationContacts[index].phone=res.data  
           }else{
             this.query.organizationContacts[index].phone=''
             this.$confirm(`不存在旧项目ID:${value.name},请核查`,'错误提示',{
               confirmButtonText:'确定',
             }).then(res=>{
              
             }).catch(()=>{})
           }
         }
     }).catch(()=>{
       this.query.organizationContacts[index].phone=null; 
     })
     }
      }else{
        this.$message({
          message:'项目类型不能为空',
          type:'error'
        })
      }
      
    },
    addCorrespond(){
    this.query.organizationContacts.push({projectType:null,name:'',phone:''})
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
            return {oldProjectId:item.name,oldProjectType:item.projectType}
          })
        if(this.query.newProjectId){
         CreateProjectCorrespond(this.query.newProjectId,str).then(res=>{
            if(res.code=='000000'){
               this.$message({
                 message:'添加项目对应关系成功',
                 type:'success'
               })
               this.isShow=false  
               this.$emit('corrCallback');
               this.query.des=null;
               this.query.newProjectId=null;
               this.query.newProjectName=null;    
               this.query.organizationContacts=[{projectType:null,name:'',phone:''}]        
            }
         })
        }else{
          this.$message({
            message:'新项目编号不存在',
            type:'error'
          })
               this.query.des=null;
               this.query.newProjectId=null;
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
        .formBox{
          display: flex;
          span{
               text-align: right;
               line-height: 40px;
               width: 15%;
             }
        }
        .formBoxBottom{
          display: flex;
          span{
               text-align: right;
               line-height: 40px;
               width: 15%;
             }
        }
      }
       
}
</style>
