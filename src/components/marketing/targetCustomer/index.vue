<template>
	<div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="search">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-if="isShow">
          <el-row style="width:100%">
            <el-col :span="8" class="el-col">
              <span class="span-style">客户编号：</span>
              <el-input
                placeholder="请输入客户编号"
                v-model="no"
                type="number"
                clearable>
              </el-input>
            </el-col>
            <el-col :span="8" class="el-col">
              <span class="span-style">客户名称：</span>
              <el-autocomplete
                v-model="targetCustomerName"
                :fetch-suggestions="querySearchAsync"
                value-key="name"
                clearable
                placeholder="请输入客户名称"
              ></el-autocomplete>
            </el-col>
            <el-col :span="8" class="el-col">
              <span class="span-style">客户性质：</span>
              <el-select v-model="customerType" clearable placeholder="请选择客户性质">
                <el-option
                  v-for="(item,index) in customerTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.type">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="width:100%">
            <el-col :span="12" class="el-col">
              <div class="time-box">
                <span class="span-style" style="flex-grow: 0;flex-shrink: 0;">创建时间范围：</span>
                <el-date-picker
                  v-model="startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始时间">
                </el-date-picker>
                <div class="text">至</div>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="截止时间">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconshujuliebiao"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <el-button size="small" @click="addNew" v-if="$authorities.TargetCustomerCreate"><i class="iconfont icontianjiashangpin"></i><span>添加</span></el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight"
        style="width: 100%"
        size="small">
        <el-table-column
          prop="no"
          label="客户编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="客户名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          label="客户性质"
          :formatter="switchTypes"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="业务员"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="createTimes"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center" min-width="200px">
          <template slot-scope="scope">
              <el-button type="text" size="small" @click="goDetail(scope.row.id)" v-if="$authorities.TargetCustomerDetail">详情</el-button>
              <el-button type="text" size="small" @click="goEdit(scope.row.id)" v-if="$authorities.TargetCustomerUpdate">编辑</el-button>
              <el-button type="text" size="small" @click="getKeyInfo(scope.row.id,scope.row.name)" v-if="$authorities.TargetCustomerCrux">关键信息</el-button>
              <el-button type="text" size="small" @click="goVisitingRecord(scope.row.id,scope.row.name)" v-if="$authorities.TargetCustomerVisitRecord">拜访记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="关键信息" :visible.sync="dialogFormVisible" :modal-append-to-body="true">
        <p>
          <span>*</span>客户名称：<span>{{customerName}}</span>
        </p>
        <el-form ref="formName" :model="form"  class="el-froms" prop="targetCustomerKeyInfoDTOList">
          <div class="perInfo">人员信息</div>
          <el-row :gutter="100" class="row-box" style="margin-left:160px; margin-right:0">
            <el-col :span="5">
              <span>姓名</span> 
            </el-col>
            <el-col :span="5">
              <span>角色</span>
            </el-col>
            <el-col :span="5">
              <span>电话</span> 
            </el-col>
          </el-row>
           <el-form-item label="决策人：" v-for="(item,index) in form.targetCustomerKeyInfoDTOList" :key="'decision'+index" >
            <el-col :span="4"> 
              <el-form-item :prop="'targetCustomerKeyInfoDTOList.'+index+'.name'"
                :rules="rules.name">
                <el-input  v-model="item.name" placeholder="字数长度1~15"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :prop="'targetCustomerKeyInfoDTOList.'+index+'.role'"
                :rules="rules.role">
                <el-input  v-model="item.role" placeholder="字数长度1~15"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="4">
              <el-form-item :prop="'targetCustomerKeyInfoDTOList.'+index+'.phone'"
                :rules="rules.keyPhone">
                <el-input  v-model="item.phone" placeholder="字数长度1~15"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button stylr="" type="primary" v-if="index==0" @click="addDecisionMaker()">添加决策人</el-button>
              <el-button style="" @click="deleteDecisionMaker(index)" v-if="index!=0">删除</el-button>
            </el-col>
          </el-form-item>
          <el-row :gutter="100" class="row-box" style="margin-left:160px; margin-right:0">
              <el-col :span="5">
                <span>姓名</span> 
              </el-col>
               <el-col :span="5">
                <span>角色</span>
              </el-col>
               <el-col :span="5">
                <span>电话</span> 
              </el-col>
            </el-row>
          <el-form-item label="关键人：" v-for="(item,index) in form.targetCustomerKeyInfoParamList" :key="'key'+index">
             <el-col :span="4">  
               <el-form-item :prop="'targetCustomerKeyInfoParamList.'+index+'.name'"
                :rules="rules.name"
              >
                <el-input  v-model="item.name" placeholder="字数长度1~15"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
               <el-form-item :prop="'targetCustomerKeyInfoParamList.'+index+'.role'"
                :rules="rules.role"
              >
               <el-input  v-model="item.role" placeholder="字数长度1~15"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
               <el-form-item :prop="'targetCustomerKeyInfoParamList.'+index+'.phone'"
                :rules="rules.decisionPhone"
               >
                <!-- <span v-if="index==0">电话</span>  -->
                <el-input  v-model="item.phone" placeholder="字数长度1~15"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="addKeyPerson()" v-if="index==0">添加关键人</el-button>
              <el-button @click="deleteKeyPerson(index)" v-if="index!=0">删除</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="关键信息可见人：" required v-for="(item,index)  in form.userDTOList" :key="'visible'+index" class="keyPers">
            <el-col :span="6">
              <el-form-item :prop="'userDTOList.'+index+'.id'"
                :rules="{
                  required: true, message: '负责人账号', trigger: 'blur'
                }"
              >
                <el-select 
                v-model="item.id" 
                placeholder="请输入负责人账号"
                filterable
                remote
                clearable
                reserve-keyword
                value-key="name"
                :remote-method="(query)=>{
                	remoteMethod(query,index)
                }"
                @change="(value)=>{
                	userNamechange(value,index)
                }">
                  <el-option
                    v-for="it in item.option"
                    :key="it.userName+'-'+it.realName"
                    :label="it.userName"
                    :value="it.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="item.realName" style="width: 100%;" disabled placeholder="通过账号直接关联人名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="addCharge()" v-if="index==0">添加可见人</el-button>
              <el-button @click="deleteCharge(index)" v-if="index!=0">删除</el-button>
            </el-col>
            <el-col v-if="index==0" style="margin-top: 10px;">
               <div class="sub-title">关键信息可见人包括：1，目标客户负责人。2，拥有集团市场开发总监角色的用户，3，此处添加的可见人</div>
            </el-col>
          </el-form-item>
          <el-form-item label="备注信息：" class="formRemark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入200字以内"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer form-button-box">
          <el-button type="primary" @click="addTargetKeyInfo('formName')" class="form-button">保存</el-button>
          <el-button type="primary" @click="oncancel('formName')">取消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="block" v-show="total!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
  </div>
</template>
<script>

import {targetCustomerList,targetCustomerName,targetCustomerId,
        targetCustomerKeyInfo,addKeyInfo,simpleList,getOrganizationInfo} from '@/api/targetCustomerManage';
import { type } from 'os';

export default {
  name:'TargetCustomer',
  components: {
    
  },
  data() {
    var checkContactPhone = (rule, value, callback) => {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob = /^((\+?86)|(\+86\+86))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
        if (isMob.test(value) || isPhone.test(value)||value=="") {
          callback();
        } else {
          callback(new Error("请输入正确的手机号码格式"));
        }
    };
    return {
      options3:[],
      options4:[],
      loading:false,
      targetCustomerName:'',
      isShow:false,
      customerId:'',
      customerNames:[],
      customerName:'',
      targetCustomerId:'',
      timeout:null,
      startDate:'',
      endDate:'',
      no:null,
      customerType:null,
      customerTypes:[
        {
            type:6,
            label: '全部'
        }, 
        {
            type:3,
            label: '军队'
        },
        {
            type:2,
            label: '政府'
        },
        {
            type:0,
            label: '国企'
        },
        {
            type:1,
            label: '民企'
        },
        {
          type:4,
          label:'央企'
        },
        {
          type:5,
          label:'外企'
        }
      ],
      userDataAuthorityIds:[],
      tableData:[],
      page:1,
      pageSize:10,
      total:0,
      userId:null,
      form:{
        remark:'',
        targetCustomerId:'',
        targetCustomerKeyInfoDTOList:[{name:'',phone:'',role:''}],
        targetCustomerKeyInfoParamList:[{name:'',phone:'',role:''}],
        userDTOList:[{id:'',realName:'',userName:'',option:[]}],
        userIdList:[]
      },
      rules:{
        name: [{ min:1,max:15,message:"长度在 1 到 15 个字", trigger: "blur" }],
        role: [{ min:1,max:15,message:"长度在 1 到 15 个字", trigger: "blur" }],
        keyPhone: [{min:1,max:15,message:"长度在 1 到 15 个字", validator: checkContactPhone, trigger: "blur" }],
        decisionPhone: [{min:1,max:15,message:"长度在 1 到 15 个字",validator: checkContactPhone, trigger: "blur" }]
      },
      realName:'',
      dialogFormVisible:false,
      formLabelWidth: '120px',
    }
  },
  created() {
    this.getTargetCustomer(1);
    this.getTargetCustomerName();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getTargetCustomer();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    verificationNumber(){
      let regExp=/^\d+$/g;
      if(!regExp.test(this.customerId)){
        this.$message({
          message:"请输入正确ID",
          type:"waring"
        })
        this.customerId=this.customerId.replace(regExp,'');
      }
    },
    search(){
      this.getTargetCustomer();
    },
    reset(){
      this.endDate=null;
      this.customerId=null;
      this.no=null;
      this.targetCustomerName=null;
      this.startDate=null;
      this.customerType=null;
      this.search();
    },
    getTargetCustomerName(){
        targetCustomerName({
          name:this.targetCustomerName
        }).then(res=>{
          if(res.code=='000000'){
            this.customerNames =res.data;
          }
        })
    },
    getTargetCustomer(){
      targetCustomerList({
        endTime:this.endDate,
        id:this.customerId,
        no:this.no,
        name:this.targetCustomerName,
        pageNum:this.page,
        pageSize:this.pageSize,
        startTime:this.startDate,
        type:this.customerType==6?null:this.customerType
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    handleCurrentChange(val) {
      this.page=val;
      this.getTargetCustomer();
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.search()
    },
    switchTypes(row, column){
      let type='';
      switch(row.type){
        case 0:
          type="国企"
          break;
        case 1:
          type="民企"
          break;
        case 2:
          type="政府"
          break;
        case 3:
          type="军队"
          break;
        case 4:
          type="央企"
          break;
        case 5:
          type="外企"
          break;
      }
      return type;
    },
    createTimes(row,column){
      return row.createTime.substring(0,row.createTime.indexOf('T'));
    },
    remoteMethod(query,index){
      var storage=window.localStorage;
      var UserInfo=storage.getItem("UserInfo");
      var userPosts=JSON.parse(UserInfo).userPosts;
      var organizationId=userPosts[0].organizationId;
     if (query !== '') {
        getOrganizationInfo({organizationId:organizationId,realName:query}).then(res=>{
          this.form.userDTOList[index].option=res.data
        })
      } else {
       this.form.userDTOList[index].option=[]
      }
    },
    remoteMethod1(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }
    },
    querySearchAsync(queryString, cb) {
      targetCustomerName({
          name:this.targetCustomerName
        }).then(res=>{
          if(res.code=='000000'){
            this.customerNames =res.data;
            this.customerName=queryString;
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                cb(this.customerNames);
              }, 3000 * Math.random());
          }
        })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    customerRemote(query){
        this.loading = true
        if(query){
           targetCustomerName({
            name:query
          }).then(res=>{
            this.loading = false
            if(res.code=='000000'){
               this.customerNames=res.data
            }
          })
        }
    },
    addNew(){
      this.$router.push({
        name:'AddTargetCustomer'
      })
    },
    goDetail(id){
      this.$router.push({
        name:'TargetCustomerDetail',
        query:{
          id:id
        }
      })
    },
    goEdit(id){
      this.$router.push({
        name:'EditTargetCustomer',
        query:{
          id:id
        }
      })
    },
    goVisitingRecord(id,customerName){
      this.$router.push({
        name:'CustomerVisit',
        query:{
          id:id,
          customerName:customerName
        }
      })
    },
    getKeyInfo(id,name){
      this.dialogFormVisible = true;
      this.customerName=name;
      this.targetCustomerId=id;
      targetCustomerKeyInfo(
        id
      ).then(res=>{
        if(res.code=='000000'){
          if(res.data.targetCustomerKeyInfoVisitorDTO){
            if(res.data.targetCustomerKeyInfoVisitorDTO.userDTOList){
              this.form.userDTOList=res.data.targetCustomerKeyInfoVisitorDTO.userDTOList.map((item)=>{
              	this.$set(item,'option',[{userName:item.userName,realName:item.realName,id:item.id}])
              	return item
              })
            }
            if(res.data.targetCustomerKeyInfoVisitorDTO.remark){
              this.form.remark=res.data.targetCustomerKeyInfoVisitorDTO.remark;
            }
          }else{
            this.form.userDTOList=[{id:'',realName:'',userName:'',option:[]}];
            this.form.remark='';
          }
            // 区分关键人和决策人
          this.form.targetCustomerKeyInfoDTOList=[];
          this.form.targetCustomerKeyInfoParamList=[];
          if(res.data.targetCustomerKeyInfoDTOList.length!=0){
            for(var i=0;i<res.data.targetCustomerKeyInfoDTOList.length;i++){
              if(res.data.targetCustomerKeyInfoDTOList[i].type==0){
                if(res.data.targetCustomerKeyInfoDTOList[i].name==''&& res.data.targetCustomerKeyInfoDTOList[i].phone==''&&res.data.targetCustomerKeyInfoDTOList[i].role==''){
                  continue;
                }else{
                  this.form.targetCustomerKeyInfoDTOList.push(res.data.targetCustomerKeyInfoDTOList[i]);
                }
              }else{
                if(res.data.targetCustomerKeyInfoDTOList[i].name==''&& res.data.targetCustomerKeyInfoDTOList[i].phone==''&&res.data.targetCustomerKeyInfoDTOList[i].role==''){
                  continue;
                }else{
                  this.form.targetCustomerKeyInfoParamList.push(res.data.targetCustomerKeyInfoDTOList[i]);
                }
              }
            }
            if(this.form.targetCustomerKeyInfoDTOList.length==0){
              this.form.targetCustomerKeyInfoDTOList=[{name:'',phone:'',role:''}];
            }
            if(this.form.targetCustomerKeyInfoParamList.length==0){
              this.form.targetCustomerKeyInfoParamList=[{name:'',phone:'',role:''}];
            }
          }else{
             this.form.targetCustomerKeyInfoDTOList=[{name:'',phone:'',role:''}];
             this.form.targetCustomerKeyInfoParamList=[{name:'',phone:'',role:''}];
          }
        }
      })
    },
    addTargetKeyInfo(formName){
       this.$refs[formName].validate((valid) => {
        if(valid) {
          addKeyInfo(this.targetCustomerId,{
            remark:this.form.remark,
            targetCustomerDecisionInfoParamList:this.form.targetCustomerKeyInfoDTOList,
            targetCustomerId:this.targetCustomerId,
            targetCustomerKeyInfoParamList:this.form.targetCustomerKeyInfoParamList,
            userIdList:this.form.userDTOList.map(res=>res.id)
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$refs[formName].clearValidate()
              this.dialogFormVisible=false
            }
          })
        } else {
          return false;
        }
      });
    },
    addDecisionMaker(){
      let a={name:'',phone:'',role:''};
      this.form.targetCustomerKeyInfoDTOList.splice(0,0,a);
    },
    deleteDecisionMaker(index){
      this.form.targetCustomerKeyInfoDTOList.splice(index,1);
    },
    addKeyPerson(){
      let a={name:'',phone:'',role:''};
      this.form.targetCustomerKeyInfoParamList.splice(0,0,a);
    },
    deleteKeyPerson(index){
      this.form.targetCustomerKeyInfoParamList.splice(index,1);
    },
    addCharge(){
      let a={id:'',realName:'',userName:'',option:[]};
      this.form.userDTOList.splice(0,0,a);
    },
    deleteCharge(index){
      this.form.userDTOList.splice(index,1);
    },
    userNamechange(value,index){
      if(value){
      	console.log(value,index)
      	let oneId=this.form.userDTOList[index].option.filter(item=>item.id==value)
      	this.form.userDTOList[index].realName=oneId[0].realName
      }else{
      	console.log(value,index)
      	this.form.userDTOList[index].id=''
      	this.form.userDTOList[index].realName=''
      	this.form.userDTOList[index].userName=''
      	this.form.userDTOList[index].option=[]
      }
    },
    oncancel(formName) {
      this.$confirm('取消后，当前填写的信息将不保存，确定取消？', '取消确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible=false;
        this.$refs[formName].clearValidate();
      });
    },
    showHelp(){
      this.isShow=!this.isShow;
    }

  }
};
</script>

<style scoped lang='less'>
  @color:#f3f3f3;
 .brandBox {
    width: 100%;
    box-sizing: border-box;
    /deep/.el-table{
      .el-button--small{
        padding: 4px 0;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-top: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        background-color: #f3f3f3;
        .head-left{
          display: flex;
          align-items: center;
        }
        .myicon{
          font-weight: bold;
          color:#666;
          font-size: 20px;
          line-height: 50px;
          margin-right: 5px;
        }
      }
      span {
        font-size: 14px;
        color: #303133;
      }
      .rightBox {
        float: right;
        span{
        	cursor: pointer;
        }
        .myicon{
          color: #999;
          font-size: 10px;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #e4e4e4;
        padding-top: 10px;
        /deep/.el-col{
          display: flex;
          flex-wrap: nowrap;
        }
        .span-style{
          display:inline-block;
          width:135px;
          text-align:right;
          line-height: 40px;
        }
        .el-input {
          width: 50%;
          height: 40px;
          margin-left: 10px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
        /deep/.el-autocomplete{
          width: 50%;
          .el-input{
            width: 100%;
          }
        }
        .el-select{
          width: 50%;
          height: 40px;
          margin-left: 10px;
          margin-bottom: 10px;
        }
        /deep/.time-box{
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 10px;
          /deep/.el-date-editor{
            width: 35%;
            height: 40px;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 0;
          }
          .text{
            line-height: 40px;
          }
        }
      }
    }
    .listBox {
      font-size: 12px;
      background-color:@color;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          margin-left: 10px;
          .myicon{
            margin-left: 20px;
            font-weight: bold;
            font-size: 20px;
          }
          span {
            margin-left: 5px;
            font-size: 14px;
            color: #303133;
            line-height: 50px;
          }
        }
      }
      .listBoxRight {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;
        .el-button {
          padding: 9px 15px;
          border-radius: 3px;
          font-size: 12px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    /deep/.el-dialog__wrapper{
        .el-dialog{
          width: 65%;
          margin-top:0 ;
          .el-dialog__header{
            background-color:@color; 
          }
          .el-dialog__body{
            padding-top: 0;
            p{
              padding:20px;
              font-size: 16px;
              span{
                color:red;
              }
            }
            .el-froms{
              border:1px solid #e4e4e4;
              box-sizing: border-box; 
              .perInfo{
                padding: 15px;
                background:@color;
              }
              /deep/ .row-box{
                margin-left: 160px;
                margin-top: 40px;
                .el-col-5{
                  text-align: center;
                }
              }
              .el-form-item{
                text-align: center;
                .el-col{
                  margin-right:20px; 
                }
                .el-col-6{
                  margin-right:30px; 
                }
                .el-form-item__label{
                  margin-left: 90px;
                }
                .el-select{
                  width: 100%;
                }
                .el-textarea{
                  .el-textarea__inner{
                    height: 150px;
                  }
                }
                .sub-title{
                  font-size: 12px;
                  color: #999;
                  text-align: start;
                  margin-left: 160px;
                }
              }
              .formRemark{
                .el-form-item__content{
                  margin-left: 158px;
                  width: 57%;
                }
                .el-form-item__label{
                  margin-left: 76px;
                }
              }
              .keyPers{
                   .el-form-item__label{
                      margin-left: 24px;
                      margin-top:0;
                    }
                }
            }   
          }
          .el-dialog__footer{
            text-align: center;
              .el-button{
                width: 14%;
                margin-right:40px; 
              }
          }
        }
    }
    .block {
      margin-top: 2px;
      display: flex;
      justify-content: flex-end;
    }
    .my-scroll-bar{
      height:200px;
    }
    .form-button-box{
        width: 100%;
        display: flex;
        justify-content: center;
    }
  }
</style>