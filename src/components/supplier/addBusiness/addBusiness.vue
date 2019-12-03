<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="addbus-ruleForm">
<div class="editerbusinessBox">
<div class="h50 headerBox"><i class="icon iconfont iconshujuliebiao"></i><span>供应商业务基本信息</span></div>
  
    <el-form-item label="供应商公司名称：" v-if="$route.query.addId">
    	<p>{{ruleForm.name}}</p>
    </el-form-item>
    <el-form-item label="供应商公司名称：" prop="supplierId" v-if="!($route.query.addId)">
    	<el-select
	    v-model="ruleForm.supplierId"
	    filterable
		  remote
		  clearable
		  reserve-keyword
	    placeholder="请输入关键词"
	    :remote-method="remoteMethod"
	    @change="seechange"
	    >
	    <el-option
	      v-for="item in options4"
	      :key="item.id+'111111111'"
	      :label="item.name"
	      :value="item.id">
    </el-option>
  </el-select>
    </el-form-item>
    <el-form-item label="统一社会信用代码：" prop="region">
    	<p style="color: red;"> {{gsnssbh}}</p>
      <!--<el-input v-model="ruleForm.region" placeholder="字数长度1~15以内"></el-input>-->
    </el-form-item>
     <el-form-item label="供应商等级：" prop="level">
      <el-select v-model="ruleForm.level" placeholder="供应商等级" style="width: 430px;">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>
    <!--<el-form-item label="供应商类型：" prop="supplierBizType">
      <el-radio-group v-model="ruleForm.supplierBizType">
      <el-radio label="VENDOR">厂商</el-radio>
      <el-radio label="GENERAL_AGENT">总代</el-radio>
      <el-radio label="DEALER">经销商</el-radio>
    </el-radio-group>
    </el-form-item>-->
    <el-form-item label="供应商服务对象：">
      <p>{{fuobj}}</p>
    </el-form-item>
    <el-form-item label="合同有效期：" prop="aaaa">
      <el-date-picker
      v-model="ruleForm.aaaa"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>	 
    
    </el-form-item>
    <el-form-item label="业务联系人：" v-for="(item,index) in ruleForm.bizContactDTOs" :key="'b'+index" required>
    		<el-col style="width: 150px;">
    	<el-form-item :prop="'bizContactDTOs.'+index+'.name'"
      	:rules="{
            required: true, message: '姓名不能为空', trigger: 'blur'
            }">
        <el-input v-model="item.name" placeholder="输入姓名" style="width: 150px;"></el-input>
      </el-form-item>
    </el-col>
    <el-col style="width: 340px;">
    	<el-form-item :prop="'bizContactDTOs.'+index+'.phone'"
    		label="电话："
      	:rules="{
            required: true, message: '电话不能为空', trigger: 'blur'
            }">
        <el-input v-model="item.phone" placeholder="输入电话" style="width: 200px;"></el-input>
      </el-form-item>
   </el-col>
   <el-col style="width: 200px;">
    	 <el-button type="primary" v-if="index==0" @click="poplepush()" size="small">新增联系人</el-button>      
      <el-button type="primary" v-if="index==ruleForm.bizContactDTOs.length-1&&index!=0" @click="depople()" size="small">删除</el-button>      
   </el-col>
      
     
  	</el-form-item>
  	<el-form-item label="管理员账号：" prop="userDataAuthorityId">
      
      <el-select
			    v-model="ruleForm.userDataAuthorityId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入姓名"
			    :remote-method="remoteMethod1"
			    @change="adminchange"
			    >
			    <el-option
			      v-for="item in options3"
			      :key="item.id"
			      :label="item.userName"
			      :value="item.id">
			    </el-option>
			  </el-select>
			  <span style="padding-left: 100px;">真实姓名：</span><span>{{realName}}</span>
    </el-form-item>
  	
 
   


    <div class="h50 headerBox" style="border-top: 1px solid #E4E4E4;"><i class="icon iconfont iconshujuliebiao"></i><span>供应商业务结算信息</span></div>
    <el-form-item label="结算方式：" prop="supplierBizPayType">
      <el-radio-group v-model="ruleForm.supplierBizPayType">
      <el-radio label="TELEGRAPHIC_TRANSFER">电汇</el-radio>
      <el-radio label="CHEQUE">支票</el-radio>
      <el-radio label="CASH">现金</el-radio>
      <el-radio label="PROMISE_DRAFT ">承兑汇票</el-radio>
    </el-radio-group>
    </el-form-item>
    <el-form-item label="公司开户行" prop="bank" v-if="ruleForm.supplierBizPayType!='CASH'">
      <el-input v-model="ruleForm.bank" placeholder="输入姓名，字数1~15以内"></el-input>
    </el-form-item>
    <el-form-item label="公司开户名称" prop="accountName" v-if="ruleForm.supplierBizPayType!='CASH'">
      <el-input v-model="ruleForm.accountName" placeholder="输入姓名，字数1~15以内"></el-input>
    </el-form-item>
    <el-form-item label="公司开户账号" prop="accountNo" v-if="ruleForm.supplierBizPayType!='CASH'">
      <el-input v-model="ruleForm.accountNo" placeholder="输入姓名，字数1~15以内"></el-input>
    </el-form-item>
    <el-form-item label="结算账期"  prop="supplierBizPaymentDaysType">
    <el-radio-group v-model="ruleForm.supplierBizPaymentDaysType">
      <el-radio label="PAYMENT_IN_ADVANCE">预付</el-radio>
      <el-radio label="PRESENT_SETTLEMENT">现结</el-radio>
      <el-radio label="CREDIT_PERIOD">授信账期</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="授信账期天数" prop="paymentDays" v-if="ruleForm.supplierBizPaymentDaysType=='CREDIT_PERIOD'">
      <el-input style="width: 100px;" v-model="ruleForm.paymentDays" placeholder=""></el-input>&nbsp;天
    </el-form-item>
    <el-form-item label="授信额度是否限制" prop="limited" v-if="ruleForm.supplierBizPaymentDaysType=='CREDIT_PERIOD'">
    <el-radio-group v-model="ruleForm.limited">
      <el-radio :label="istrue">有限制</el-radio>
      <el-radio :label="isfalse">无限制</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="授信额度" prop="creditLine" v-if="ruleForm.supplierBizPaymentDaysType=='CREDIT_PERIOD'">
      <el-input style="width: 100px;" v-model="ruleForm.creditLine" placeholder=""></el-input>&nbsp;元
   </el-form-item>
   <el-form-item label="财务联系人：" v-for="(item,index) in ruleForm.financialContactDTOs" :key="'a'+index" required>
   	<el-col style="width: 150px;">
    	<el-form-item :prop="'financialContactDTOs.'+index+'.name'"
      	:rules="{
            required: true, message: '姓名不能为空', trigger: 'blur'
            }">
        <el-input v-model="item.name" placeholder="输入姓名" style="width: 150px;"></el-input>
      </el-form-item>
    </el-col>
    <el-col style="width: 340px;">
    	<el-form-item :prop="'financialContactDTOs.'+index+'.phone'"
    		label="电话："
      	:rules="{
            required: true, message: '电话不能为空', trigger: 'blur'
            }">
        <el-input v-model="item.phone" placeholder="输入电话" style="width: 200px;"></el-input>
      </el-form-item>
   </el-col>
   <el-col style="width: 200px;">
   		<el-button type="primary" v-if="index==0" @click="poplepush1()" size="small">新增联系人</el-button>      
      <el-button type="primary" v-if="index==ruleForm.financialContactDTOs.length-1&&index!=0" @click="depople1()" size="small">删除</el-button>  
   	</el-col>
          
  	</el-form-item>
    <el-form-item style="margin-top: 20px">
      <el-button type="primary" @click="submitForm('ruleForm')" v-if="$authorities.SupplierBusinessRelevant">保存至草稿</el-button>
      <el-button type="primary" @click="submitFormReview('ruleForm')" v-if="$authorities.SupplierBusinessRelevant">保存并提交审核</el-button>
    </el-form-item>
  
</div>
</el-form>
</template>

<script>

	import {	CreditCode,findInfo,supplierbiz,createSubmitReview,} from '@/api/businessSupplier'
import { simpleList,userList} from "@/api/userService"
  import './SupplierList.less'
  export default {
  	name:'AddBusiness',
  	 inject:['close'],
    data() {
    	var paymentDaysRule=(rule, value, callback) => {
        if(value==''){
        	callback(new Error('请输入授信账期天数'));
        }else{
        	if (/^[1-9]\d*$/.test(value)) {
	          callback()
	        }else{
	        	 callback(new Error('只能输入正整数'));
	        }
        }
      };
      return {
      	options1: [{
					value: 'LEVEL_1',
					label: '1级'
				}, {
					value: 'LEVEL_2',
					label: '2级'
				}, {
					value: 'LEVEL_3',
					label: '3级'
				}, {
					value: 'LEVEL_4',
					label: '4级'
				}, {
					value: 'LEVEL_5',
					label: '5级'
				}],
      	istrue:true,
      	isfalse:false,
      	aaaa:'',
      	gsnssbh:'',
      	fuobj:'',realName:'',
      	options4: [],
      	options3:[],
        value9: '',
        list: [],
      	options:[],
      	 loading: false,
        ruleForm: {
        	"level":'',
				"userDataAuthorityId":'',//管理员id
        	
        	'name':'',
        	"aaaa":'',
         "accountName": "",
				  "accountNo": "",
				  "bank": "",
				  "bizContactDTOs": [
				    {
				      "name": "",
				      "phone": ""
				    }
				  ],
				  "branchId": '',
				  "contractEndTime": "",
				  "contractStartTime": "",
				  "creditLine": '',
				  "financialContactDTOs": [
				    {
				      "name": "",
				      "phone": ""
				    }
				  ],
				  "limited":true ,
				  "paymentDays": '',
				  "supplierBizPayType": "",
				  "supplierBizPaymentDaysType": "",
				  "supplierBizType": "",
				  "supplierId": ''
        },
         
        
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rules: {
        	level:[
        		{ required: true, message: '请选择供应商等级', trigger: 'blur' },
        	],
          supplierId: [
            { required: true, message: '供应商公司名称不能为空', trigger: 'blur' },
          ],
//        supplierBizType:[
//        	{ required: true, message: '供应商类型不能为空', trigger: 'change' },
//        ],
          supplierBizPayType:[
          	{ required: true, message: '结算方式不能为空', trigger: 'change' },
          ],
          
          bank:[
          	{ required: true, message: '公司开户行不能为空', trigger: 'blur' },
          ],
          userDataAuthorityId:[
          	{required: true,message: '请输入管理员账号',trigger: 'blur'},
          ],
          
          accountName:[
          	{ required: true, message: '公司开户名称不能为空', trigger: 'blur' },
          ],
          
          accountNo:[
          	{ required: true, message: '公司开户账号不能为空', trigger: 'blur' },
          ],
          
          supplierBizPaymentDaysType:[
          	{ required: true, message: '结算账期不能为空', trigger: 'change' },
          ],
          
          paymentDays:[
          	{ required: true,validator: paymentDaysRule, trigger: 'blur' },
          ],
          
          limited:[
          	{ required: true, message: '授信额度是否限制', trigger: 'blur' },
          ],
          
          creditLine:[
          	{ required: true, message: '授信额度不能为空', trigger: 'blur' },
          ],
          region: [
            { required: false, message: '供应商类型不能为空', trigger: 'blur' }
          ],
          
          
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          aaaa: [
            { type: 'array', required: true, message: '合同有效期不能为空', trigger: 'change' }
          ],
          delivery: [
            {delivery: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          
          
         
        },
        routerQuery:''
      };
    },
    watch:{
    	defaultProps(a,b){
    		console.log(a)
    	},
    	"ruleForm.aaaa":{
    		handler:function(a,b){
    	
    			this.ruleForm.contractStartTime=a[0]
    			this.ruleForm.contractEndTime=a[1]
    		}
    	},
    	'ruleForm.limited':{
				handler:function(a,b){
					if(a){
						this.rules.creditLine[0].required=true
					}else{
						this.rules.creditLine[0].required=false
					}
				},
				deep:true
			},
    },
    created(){
    	this.ruleForm.branchId=this.$auth.user.userPosts[0]?this.$auth.user.userPosts[0].organizationId:1
    	this.fuobj=this.$auth.user.userPosts[0]?this.$auth.user.userPosts[0].organizationName:''
    	if(this.$route.query.addId){
    		CreditCode(this.$route.query.addId).then(res=>{
    			this.ruleForm.name=res.data.name
    			this.gsnssbh=res.data.socialCreditCode
    			this.ruleForm.supplierId=res.data.id
    		})
    	}
    },
    activated(){
					if(this.$route.query.addId){
	    		CreditCode(this.$route.query.addId).then(res=>{
	    			this.ruleForm.name=res.data.name
	    			this.gsnssbh=res.data.socialCreditCode
	    			this.ruleForm.supplierId=res.data.id
	    		})
	    	}
    },
    methods: {
    	adminchange(value){
			console.log(value)
			let a=this.options3.filter(item=>item.id==value)
			this.realName=a[0]?a[0].realName:''
		},
		//模糊搜索
		remoteMethod1(query) {
        	if (query !== '') {
	          userList({realName:query,organizationId:this.$auth.user.userPosts[0].organizationId}).then(res=>{
	          	this.options3=res.data
	          })
	        } else {
	          this.options3 = [];
	        }
      },
    	seechange(value){
    		console.log(value)
    		let a=this.options4.filter((item,index)=>{
    			return item.id==value
    		})
    		this.gsnssbh= a[0]?a[0].socialCreditCode:''
    	},
    	remoteMethod(query){
    		if (query !== '') {
    		findInfo({
    			name:query
    		}).then(res=>{
    			this.options4=res.data
    		})
        } else {
          this.options4 = [];
        }
    	},
    	poplepush(){
    		this.ruleForm.bizContactDTOs.push({name:'',phone:''})
    	},
    	depople(){
    		this.ruleForm.bizContactDTOs.pop()
    	},
    	poplepush1(){
    		this.ruleForm.financialContactDTOs.push({name:'',phone:''})
    	},
    	depople1(){
    		this.ruleForm.financialContactDTOs.pop()
    	},
    	 
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	if(this.ruleForm.supplierBizPayType=='CASH'){
    					this.ruleForm.bank=''
    					this.ruleForm.accountName=''
    					this.ruleForm.accountNo=''
          	}
            supplierbiz(this.ruleForm).then(res=>{
            	if(res.data>0){
            		this.$message({
				          message: '操作成功，前页面信息已保存至草稿',
				          type: 'success'
				        });
				        this.$refs[formName].resetFields();
				        this.close({
				        		name:'AddBusiness',
				        		to:{
				        			name:'SupplierService',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
            	}
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitFormReview(formName){
      	 this.$refs[formName].validate((valid) => {
          if (valid) {
          	if(this.ruleForm.supplierBizPayType=='CASH'){
    					this.ruleForm.bank=''
    					this.ruleForm.accountName=''
    					this.ruleForm.accountNo=''
          	}
            createSubmitReview(this.ruleForm).then(res=>{
            	if(res.data>0){
            		this.$message({
				          message: '保存并提交审核成功',
				          type: 'success'
				        });
				        //清除框内信息
				        this.$refs[formName].resetFields();
				        this.close({
				        		name:'AddBusiness',
				        		to:{
				        			name:'SupplierService',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
            	}
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      
      
   
    }
  }
</script>

<style lang="less" scoped>
.el-form{
    
     color: #606266;
.editerbusinessBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .headerBox{
  	margin-bottom: 10px;
    height: 50px;
    background: #f3f3f3;
    border-bottom: 1px solid #e4e4e4;
 		i{
 			font-size: 20px;
			padding: 0 5px 0 10px;
			font-weight: 600;
			line-height: 50px;
 		}
    span{
    	font-size: 15px;
    	font-weight: 600;
      line-height: 50px;
    }
  }
  
   .el-form-item{
     .el-input{
       width: 400px;
       height: 40px;
     }
     .el-textarea{
     	width: 400px;
     }
    .tipBox{
      height: 20px;
      font-size: 12px;
      margin-left: 20px;
    }
    .el-form-item_err{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
    .listBox{
      /*width: 600px;*/
      box-sizing: border-box;
      .listLeftBox{
      	overflow: auto;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 200px;
        height:300px;
       .headerBox{
         height: 35px;
         border: 1px solid #e4e4e4;
         span{
           color: red;
           line-height: 36px;
         }
       }
      }
      .listRightBox{
      	border: 1px solid #e5e5e5;
      	height:300px;
        width: 200px;
        overflow: auto;
        /*padding: 0 10px;*/
        .headerBox{
          height: 35px;
          border: 1px solid #e4e4e4;
          span{
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }

      }
    }
  
}
}
</style>





