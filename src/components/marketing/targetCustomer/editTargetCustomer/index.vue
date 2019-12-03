<template>
	<div class="form-wrapper">
    <addhead headname="目标客户基本信息" iconName="iconjinridingdanshu"></addhead>
    <el-form ref="formName" :model="form" label-width="150px" :rules="rules">
      <el-form-item prop="type">
        <span slot="label">客户性质：</span>
        <el-radio-group v-model="form.type">
          <el-radio :label="0">国企</el-radio>
          <el-radio :label="1">民企</el-radio>
          <el-radio :label="2">政府</el-radio>
          <el-radio :label="3">军队</el-radio>
          <el-radio :label="4">央企</el-radio>
          <el-radio :label="5">外企</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户名称：" prop="name">
        <el-input v-model="form.name" @blur="checkName(form.name)" validate-event placeholder="字数长度1~30以内"></el-input>
      </el-form-item>
      <el-form-item label="客户行业：" prop="industryId">
        <el-cascader
          :options="industry"
          placeholder="请选择行业"
          v-model="form.industryId"
          :show-all-levels="false"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="统一社会信用代码：" prop="socialCreditCode">
        <el-input v-model="form.socialCreditCode" placeholder="字数长度1~20以内"></el-input>
        <div class="sub-title">统一社会信用代码：是指工商营业执照、组织机构代码证、税务登记证的统称</div>
      </el-form-item>
      <el-form-item label="所属上级客户：" prop="parentCustomer">
        <el-input v-model="form.parentCustomer" placeholder="字数长度1~20以内"></el-input>
      </el-form-item>
      <el-form-item label="客户办公地址：" v-if="form.type!=3">
        <div class="address-box">
          <el-select v-model="form.provinceId" placeholder="选择省/直辖市" @change="onProvincesChange" class="area-elect">
            <el-option
              v-for="(item,index) in provinces"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="form.cityId" placeholder="选择城市" @change="onCityChange" class="area-elect">
            <el-option
              v-for="(item,index) in city"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="form.countyId" placeholder="选择区/县" class="area-elect">
            <el-option
              v-for="(item,index) in county"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
         </div>  
        <el-input
          type="textarea"
          placeholder="详细地址，请输入200字以内"
          v-model="form.addressLine"
          rows="5">
        </el-input>
      </el-form-item>
      <el-form-item label="客户联系人：" >
        <el-form-item  class="el-input-three" prop="customerContactName">
          <el-input v-model="form.customerContactName" class="contact" placeholder="字数长度1~15以内">
          </el-input>
        </el-form-item>
        <el-form-item  prop="customerContactPhone" label="联系方式：" style="width:46%" class="el-input-three">
          <el-input v-model="form.customerContactPhone" class="contact"  placeholder="字数长度1~15以内">
         </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="业务员账号：" required>
          <el-form-item class="el-input-three" prop="userDataAuthorityId">
            <el-select 
                v-model="form.userDataAuthorityUserName" 
                placeholder="请输入负责人账号"
                filterable
                remote
                clearable
                reserve-keyword
                :remote-method="remoteMethod"
                @change="userNamechange">
                  <el-option
                    v-for="item in options3"
                    :key="item.id"
                    :label="item.userName"
                    :value="item">
                  </el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="业务员姓名：" class="el-input-three" style="width:46%" prop="userDataAuthorityName" >
            <el-input v-model="realName" style="width: 100%;" disabled placeholder="通过账号直接关联人名"></el-input>
          </el-form-item>
      </el-form-item>
      <el-form-item class="form-button-box">
        <el-button type="primary" @click="getEditTargetCustomer('formName')" class="form-button">保存</el-button>
        <el-button type="primary" @click="oncancel('formName')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import addhead from '@/components/common/head/head';

import {editTargetCustomer,industryTree,simpleList,editCheckRepeat,getTargetCustomerInfo,getOrganizationInfo} from '@/api/targetCustomerManage';

import {provinces_based_id,subs} from '@/api/basicSupplier';

export default {
  inject:['close'],
  name:'EditTargetCustomer',
  components: {
  	addhead
  },
  data() {
    var checkName = (rule, value, callback) => {
      var reg=/^[\u4e00-\u9fa5a-z]+$/gi;
      if(!reg.test(value)){
        return callback(new Error("有违规符号(引号、空格)，请重新填写!"));
      }else{
        editCheckRepeat({
          id:this.customerId,
          name:value
        }).then(res=>{
            if(res.data){
              return callback(new Error("客户名称已存在，不可重复添加!"));
            }else{
              callback();
            }
          })
      }
    };
    var CheckSocialCreditCode = (rule, value, callback) => {
      var patrn = /^[0-9A-Z]+$/;
      //18位校验及大写校验
      if(value==""){
            callback();
      }else if (value.length != 18 || patrn.test(value) == false) {
        return callback(new Error("不是有效的统一社会信用编码!"));
      } else {
        var Ancode; //统一社会信用代码的每一个值
        var Ancodevalue; //统一社会信用代码每一个值的权重
        var total = 0;
        var weightedfactors = [
          1,
          3,
          9,
          27,
          19,
          26,
          16,
          17,
          20,
          29,
          25,
          13,
          8,
          24,
          10,
          30,
          28
        ]; //加权因子
        var str = "0123456789ABCDEFGHJKLMNPQRTUWXY";
        //不用I、O、S、V、Z
        for (var i = 0; i < value.length - 1; i++) {
          Ancode = value.substring(i, i + 1);
          Ancodevalue = str.indexOf(Ancode);
          total = total + Ancodevalue * weightedfactors[i];
          //权重与加权因子相乘之和
        }
        var logiccheckcode = 31 - (total % 31);
        if (logiccheckcode == 31) {
          logiccheckcode = 0;
        }
        var Str =
          "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
        var Array_Str = Str.split(",");
        logiccheckcode = Array_Str[logiccheckcode];
        var checkcode = value.substring(17, 18);
        if (logiccheckcode != checkcode) {
          return callback(new Error("不是有效的统一社会信用编码!"));
        } else{
          callback();
        }
        callback();
      }
    };
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
      dialogVisible:false,
      dialogVisible1:false,
      loading:false,
      customerId:null,
      industry:[],
      customers:[],
      projects:[],
      provinces:[],
      timeout:null,
      city:[],
      county:[],
      selectedOptions:'',
      type1:1,
      options:[],
      form: {
        addressLine:'',
        countyId:'',
        cityId:'',
        customerContactName:'',
        customerContactPhone:'',
        name:'',
        parentCustomer:'',
        provinceId:'',
        socialCreditCode:'',
        industryId:[],
        thirdLevelIndustryName:'',
        firstLevelIndustryId:'',
        secondLevelIndustryId:'',
        thirdLevelIndustryId:'',
        type:null,
        userDataAuthorityId:'',
        userId:null,
        userDataAuthorityName:'',
        userDataAuthorityUserName:null
      },
      rules:{
        name:[
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
          // {
          //   validator: checkName,
          //   trigger: "blur"
          // }
        ],
        type:[
          { required: true, message: '请选择客户性质', trigger: 'blur' }
        ],
        userDataAuthorityId:[
          { required: true, message: '业务员账号', trigger: 'blur' }
        ], 
        socialCreditCode: [
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          {
            validator: CheckSocialCreditCode,
            trigger: "blur"
          }
        ],
        parentCustomer:[{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        contactPhone: [{ validator: checkContactPhone, trigger: "blur" },
                      { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }],
        customerContactName:[{ min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }]
      },
      realName:''
    }
  },
  created() {
    this.getIndustry();
    this.getProvinces();
  },
  activated(){
    if(this.customerId!=this.$route.query.id){
      this.getInfo();
    }
  },
  mounted() { },
  methods: {
    getInfo(){
      this.customerId = this.$route.query.id;
      getTargetCustomerInfo(this.customerId).then(res=>{
          if(res.code=='000000'){
            this.form=res.data;
            this.form.userId=null;
             if(res.data.provinceId==0){
              this.form.provinceId='';
              this.form.cityId='';
              this.form.countyId='';
             }else{
              this.getcity(res.data.provinceId);
              this.getcounty(res.data.cityId,res.data);
             }
            this.form.industryId=[];
            this.form.industryId.push(res.data.firstLevelIndustryId+'');
            this.form.industryId.push(res.data.secondLevelIndustryId+'');
            this.form.industryId.push(res.data.thirdLevelIndustryId+'');
            this.realName=res.data.userDataAuthorityRealName;
          }
      })
    },
    handleChange(value) {
      this.form.industryId=value;
    },
    checkName(val){
      this.timeout=setTimeout(()=>{
      var reg=/^[\u4e00-\u9fa5a-z]+$/gi;
      if(!reg.test(val)){
        this.$message({
          type:'error',
          message:'有违规符号(引号、空格)，请重新填写!'
        })
        this.form.name='';
        clearTimeout(this.timeout);
      }else{
        editCheckRepeat({
          id:this.customerId,
          name:val
        }).then(res=>{
            if(res.data){
              this.$message({
                type:'error',
                message:'客户名称已存在，不可重复添加!'
              })
              this.form.name='';
              clearTimeout(this.timeout);
            }else{
              return ;
            }
          })
      }
      },1000);
    },
    getEditTargetCustomer(formName,id= this.customerId){
      var reg=/^[\u4e00-\u9fa5a-z]+$/gi;
      if(!reg.test(this.form.name)){
        this.$message({
          type:'error',
          message:'有违规符号(引号、空格)，请重新填写!'
        })
        this.form.name='';
        clearTimeout(this.timeout);
      }else{
        editCheckRepeat({
          id:this.customerId,
          name:this.form.name
        }).then(res=>{
            if(res.data){
              this.$message({
                type:'error',
                message:'客户名称已存在，不可重复添加!'
              })
              this.form.name='';
              clearTimeout(this.timeout);
            }else{
             
      var reg=/^[\u4e00-\u9fa5a-z]+$/gi;
      if(this.form.industryId){
        this.form.firstLevelIndustryId=this.form.industryId[0];
        this.form.secondLevelIndustryId=this.form.industryId[1];
        this.form.thirdLevelIndustryId=this.form.industryId[2];
      }
      this.$refs[formName].validate((valid) => {
        if(valid) {
          if(this.form.type==3){
            this.form.addressLine='';
            this.form.provinceId=0;
            this.form.cityId=0;
            this.form.countyId=0;
          }
          editTargetCustomer(id,{
            type:this.form.type,
            name:this.form.name,
            firstLevelIndustryId:this.form.firstLevelIndustryId,
            secondLevelIndustryId:this.form.secondLevelIndustryId,
            thirdLevelIndustryId:this.form.thirdLevelIndustryId,
            socialCreditCode:this.form.socialCreditCode,
            parentCustomer:this.form.parentCustomer,
            provinceId:this.form.provinceId,
            cityId:this.form.cityId,
            countyId:this.form.countyId,
            addressLine:this.form.addressLine,
            customerContactName:this.form.customerContactName,
            customerContactPhone:this.form.customerContactPhone,
            userDataAuthorityId:this.form.userDataAuthorityId,
            userId:this.form.userId
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$refs[formName].clearValidate()
              clearTimeout(this.timeout);
              this.close({name:'EditTargetCustomer', to: {name:'TargetCustomer', params:{isUpdate:true}}}); 
            }         
          })
        } else {
          return false;
        }
      }); 

            }
          })
      }
     
    },
    getProvinces(){
      provinces_based_id().then(res=>{
        if(res.code=='000000'){
          this.provinces = res.data;
        }
      })
    },
    getcity(id){
      subs(id).then(res=>{
        if(res.code=='000000'){
          this.city = res.data;
        }
      })
    },
    getcounty(id,val){
      subs(id).then(res=>{
        if(res.code=='000000'){
          this.county = res.data;
          if(val){
            this.form=val;
          }
        }
      })
    },
    getIndustry(){
      industryTree().then(res=>{
        if(res.code=='000000'){
          this.industry = res.data;
        }
      })
    },
    onCityChange(val){
      this.form.countyId=null;
      this.getcounty(val);
    },
    onProvincesChange(val){
      this.form.cityId=null;
      this.form.countyId=null;
      this.getcity(val);
    },
    remoteMethod(query){
      var storage=window.localStorage;
      var UserInfo=storage.getItem("UserInfo");
      var userPosts=JSON.parse(UserInfo).userPosts;
      var organizationId=userPosts[0].organizationId;
     if (query !== '') {
        getOrganizationInfo({organizationId:organizationId,realName:query}).then(res=>{
          this.options3=res.data
        })
      } else {
        this.options3 = [];
      }
    },
    userNamechange(value){
      this.form.userDataAuthorityUserName=value.userName
      this.form.userDataAuthorityId=value.id;
      this.form.userId=value.id;
      this.realName=value.realName
    },
    oncancel(formName) {
      this.$confirm('取消后，当前填写的信息将不保存，确定取消？', '取消确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].clearValidate();
        this.close();
      });
    },
  }
};
</script>

<style scoped lang='less'>
  .form-wrapper{
    margin-top:20px;
    border:1px solid #e4e4e4;
    .el-form{
      padding:20px;
      margin-left: 60px;
      .el-input{
        width: 35%;
      }
      .el-select{
        width: 100%;
      }
      .area-elect{
        width: 200px;
      }
      .el-textarea{
        width: 35%;
        margin-top: 10px;
        display: block;
      }
      .el-input-half{
        width: 300px;
        margin-right:120px;
      }
      .el-input-three{
        display: inline-block;
        width: 35%;
       .contact{
         width: 100%
       }
      }
      .el-cascader{
        width: 35%;
      }
      .sub-title{
        font-size: 12px;
        color: #999;
      }
      .BusInfo{
        /deep/.el-form-item__content{
          margin-left:0 !important;
          .el-col-24{
            width: 49.2%;
            margin-right: -25px;
            .el-input-three{
              width: 112%;
            }
            .el-form-item__label {
              width: 0;
            }
          }
          &:nth-child(2){
            width: 67%;
            display: inline-block;
          }
        }
      }
      .form-button-box{
        width: 1000px;
        display: flex;
        justify-content: space-around;
      }
      .address-box{
        display: flex;
        width: 35%;
      }
    }
  }
</style>