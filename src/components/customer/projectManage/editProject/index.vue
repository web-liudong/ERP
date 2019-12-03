<template>
	<el-form :model="form" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
<div class="projectBox">
  <addhead headname="项目基本信息"></addhead>
  <el-form label-width="220px" :model="form" :rules="rules" ref="form">
  	<el-form-item label="项目类型："  prop="type" >
	    <el-radio-group v-model="form.type" :disabled="typeDis()">
	      <el-radio label="0">商城</el-radio>
	      <el-radio label="1">专柜</el-radio>
	      <el-radio label="2">其他</el-radio>
	    </el-radio-group>
	  </el-form-item>
    <el-form-item prop="name" label="项目名称：">
       <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item prop="shortName" label="项目简称：">
       <el-input v-model="form.shortName"></el-input>
    </el-form-item>
    <el-form-item label="合同有效期："  prop="announcementTime">
      <!--<el-col style="width: 360px;">
	      <el-form-item prop="contractStartTime">
	        <el-date-picker type="date" placeholder="选择日期" v-model="form.contractStartTime" style="width: 100%;"></el-date-picker>
	      </el-form-item>
	    </el-col>
			<el-col style="width: 50px;text-align: center;">至</el-col>
	    <el-col style="width: 360px;">
	      <el-form-item prop="contractEndTime">
	        <el-date-picker type="date" placeholder="选择日期" v-model="form.contractEndTime" style="width: 100%;"></el-date-picker>
	      </el-form-item>
	    </el-col>-->
	    <el-date-picker
      style="max-width: 770px;width: 100%;"
      v-model="form.announcementTime"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    	</el-date-picker>
    </el-form-item>
     <el-form-item label="项目方联系人：" prop="partyAContactName">
      <el-col style="width:30%;max-width: 275px;">
	      <el-form-item>
	        <el-input v-model="form.partyAContactName" style="max-width: 275px;width: 100%;"></el-input>
	      </el-form-item>
	    </el-col>

	    <el-col style="width:70%;">
	      <el-form-item  label="联系方式：" prop="partyAContactPhone">
	        <el-input v-model="form.partyAContactPhone"  style="max-width: 275px;width: 100%;"></el-input>
	      </el-form-item>
	    </el-col>
    </el-form-item>
    <el-form-item prop="partyBId" label="项目乙方：">
       <el-select
       	style="max-width: 770px;width: 100%;"
			    v-model="form.partyBId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入"
			    :remote-method="remoteMethod"
			    >
			    <el-option
			      v-for="item in options4"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			  </el-select>
    </el-form-item>
    <el-form-item label="乙方发票限额："  prop="partyBInvoiceLimit" >
	    <el-select v-model="form.partyBInvoiceLimit" style="max-width: 770px;width: 100%;">
	      <el-option value="0" label="一万"></el-option>	      
	      <el-option value="1" label="十万"></el-option>	      
	      <el-option value="2" label="一百万"></el-option>	      
	    </el-select>
	  </el-form-item>
    <el-form-item label="项目开票申请方："  prop="invoiceApplicant" >
	    <el-radio-group v-model="form.invoiceApplicant">
	      <el-radio label="0">服务方</el-radio>
	      <el-radio label="1">项目乙方</el-radio>
	    </el-radio-group>
	  </el-form-item>
   <el-form-item label="开票方："  prop="invoiceParty" >
	    <el-radio-group v-model="form.invoiceParty">
	      <el-radio label="0">集团</el-radio>
	      <el-radio label="1">项目乙方</el-radio>
	    </el-radio-group>
	  </el-form-item>
	  <el-form-item label="是否需要上传自定义开票明细："  prop="needOrderItemForBill" >
	    <el-radio-group v-model="form.needOrderItemForBill">
	      <el-radio label="1">是</el-radio>
	      <el-radio label="0">否</el-radio>
	    </el-radio-group>
	  </el-form-item>
    <el-form-item label="乙方项目负责人：" required>
      <el-col style="width:30%;max-width: 275px;">
	      <el-form-item prop="partyBPrincipalId">
	         <el-select
					    v-model="form.partyBPrincipalId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod1"
					    @change="userNamechange"
					    >
					    <el-option
					      v-for="item in options1"
					      :key="item.id"
					      :label="item.userName+'-'+item.realName"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
	    </el-col>

	    <el-col style="width:70%;">
	      <el-form-item label="乙方负责人姓名：" required>
	        <el-input v-model="realName" style="max-width: 275px;width: 100%;" disabled></el-input>
	      </el-form-item>
	    </el-col>
    </el-form-item>
    <el-form-item label="集团项目负责人：" required>
      <el-col style="width:30%;max-width: 275px;">
	      <el-form-item prop="userDataAuthorityId">
	         <el-select
					    v-model="form.userDataAuthorityId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod2"
					    @change="userNamechange1"
					    >
					    <el-option
					      v-for="item in options2"
					      :key="item.id"
					      :label="item.userName+'-'+item.realName"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
	    </el-col>

	    <el-col style="width:70%;">
	      <el-form-item label="集团负责人姓名：" required>
	        <el-input v-model="realName1" style="max-width: 275px;width: 100%;"  disabled></el-input>
	      </el-form-item>
	    </el-col>
    </el-form-item>
     <el-form-item label="项目发布负责人：">
      <el-col style="width:30%;max-width: 275px;">
	      <el-form-item >
	         <el-select
					    v-model="form.publisherId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod3"
					    @change="userNamechange2"
					    >
					    <el-option
					      v-for="item in options3"
					      :key="item.id"
					      :label="item.userName+'-'+item.realName"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
	    </el-col>

	    <el-col style="width:70%;">
	      <el-form-item label="发布负责人姓名：" >
	        <el-input v-model="realName2" style="max-width: 275px;width: 100%;" disabled></el-input>
	      </el-form-item>
	    </el-col>
    </el-form-item>
    <el-form-item label="项目账期：" prop="paymentDays">
      <el-col style="width:30%;max-width: 275px;">
	      <el-form-item >
	        <el-input v-model="form.paymentDays" style="max-width: 275px;width: 100%;"><template slot="append">天</template></el-input>
	      </el-form-item>
	    </el-col>

	    <el-col style="width:70%;">
	      <el-form-item label="账期备注：" prop="paymentDesc">
	        <el-input v-model="form.paymentDesc" style="max-width: 275px;width: 100%;" maxlength="30"></el-input>
	      </el-form-item>
	    </el-col>
    </el-form-item>
    <!--<el-form-item label="第三方平台是否收费："  prop="needPartyCServiceFeeRate" v-if="form.type==0">
	    <el-radio-group v-model="form.needPartyCServiceFeeRate">
	      <el-radio label="1">是</el-radio>
	      <el-radio label="0">否</el-radio>
	    </el-radio-group>
	  </el-form-item>-->
    <el-form-item   v-if="allShow()" label-width="0px">
      <el-col style="width:50%;max-width: 495px;">
	      <el-form-item prop="paymentType" label="第三方平台费结算方式：">
	      	<el-select v-model="form.paymentType" clearable size="small">
				    <el-option label="统一对账统一付款" value="0"></el-option>
				    <el-option label="开票时扣除服务费" value="1"></el-option>
				    <el-option label="免费" value="2"></el-option>
				  </el-select>
	        <!--<el-radio-group v-model="form.paymentType">
			      <el-radio label="0">独立结算</el-radio>
			      <el-radio label="1">合并结算</el-radio>
			    </el-radio-group>-->
	      </el-form-item>
	    </el-col>
			
	    <el-col style="width:50%;">
	      <el-form-item label="第三方平台费率：" prop="partyCServiceFeeRate">
	        <el-input v-model="form.partyCServiceFeeRate" :disabled="form.paymentType==2" style="max-width: 275px;width: 100%;" type="number"><template slot="append">%</template></el-input>
	      </el-form-item>
	    </el-col>
    </el-form-item>
    <el-form-item prop="partyCBank" label="第三方平台费结算账号开户行：" v-if="allShow()">
       <el-input v-model="form.partyCBank" :disabled="form.paymentType==1||form.paymentType==2"></el-input>
    </el-form-item>
    <el-form-item prop="partyCAccountName" label="第三方平台费结算账号开户名：" v-if="allShow()">
       <el-input v-model="form.partyCAccountName" :disabled="form.paymentType==1||form.paymentType==2"></el-input>
    </el-form-item>
    <el-form-item prop="partyCAccountNo" label="第三方平台费结算账号：" v-if="allShow()">
       <el-input v-model="form.partyCAccountNo" :disabled="form.paymentType==1||form.paymentType==2"></el-input>
    </el-form-item>
    <el-form-item label="领先未来平台服务费率：" required>
    	<el-tooltip content="当项目乙方为领先未来集团时，服务费率请输入0" placement="bottom" effect="light">
				<el-col style="width: 275px;">
	      <el-form-item prop="lxwlServiceFeeRate">
	        <el-input v-model="form.lxwlServiceFeeRate" style="width: 275px;"><template slot="append">%</template></el-input>
	      </el-form-item>
	    </el-col>
			</el-tooltip>
      

	    <el-col style="width: 420px;">
	      <!--<el-form-item prop="orderDiscount" label="项目订单折扣率：">
	        <el-input v-model="form.orderDiscount" style="width: 275px;"><template slot="append">%</template></el-input>
	      </el-form-item>-->
	    </el-col>
    </el-form-item>
    
  <el-form-item>
    <el-button type="primary" @click="submitForm('form')" style="margin-left: 120px;">保存至草稿</el-button>
    <el-button type="primary" @click="submitcreateSubmitReview('form')" >保存并提交审核</el-button>
  </el-form-item>
  </el-form>
</div>
</el-form>
</template>

<script>
  import addhead from '@/components/common/head/head'
  
  import {
		nameRepeatedCheck,
		organizationListName,
		simpleList,
		editProjrct,
		getProjectName,
		updateSubmitReview,
		organizationUserList
	} from '@/api/projectController/projectController'
  export default {
  	name:'EditProject',
  	inject:['close'],
    data() {
    	var paymentDaysRule=(rule, value, callback) => {
        if (value == '') {
          callback();
        }else{
        	if( 0<=parseFloat(value)&&parseFloat(value)<=999 ){
        		if(/^\d+$/.test(parseFloat(value))){
        			callback()
        		}else{
        			callback(new Error('请输入一个整数'));
        		}
        	}else{
        		callback(new Error('请输入0~999整数'));
        	}
        }
      };
    	var projectNameRule= (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入项目名称'));
        }else{
        	if(value.length>30){
        		callback(new Error('项目名称为1~30字'));
        	}else{
        		nameRepeatedCheck({name:value,id:this.$route.query.editId}).then(res=>{
		        	if(res.data){
		        		callback(new Error('项目名称已存在'));
		        	}else{
		        		callback()
		        	}	
	        	})
        	}
        }
      };
      var typeJudge=(rule, value, callback) => {
      	if(this.form.paymentType==2){
      		callback()
      	}else{
      		if(value == ''){
      		callback()
	      	}else{
	      		if(parseFloat(value)>=0&&parseFloat(value)<=100){
	      			if(/^(((\d*).\d{1,2})|(\d+))$/.test(value)){
	      				callback()
	      			}else{
	      				callback(new Error('小数点后只能输入两位'))
	      			}
	      		}else{
	      			callback(new Error('请输入0~100的数值'))
	      		}
	      	}
      	}
      };
    	var typeJudgelingxian=(rule, value, callback) => {
    		console.log(value)
      	if(value ===''){
      		callback(new Error('请输入领先未来服务费率'))
      	}else{
      		if(parseFloat(value)>=0&&parseFloat(value)<=100){
      			if(/^(((\d*).\d{1,2})|(\d+))$/.test(value)){
      				callback()
      			}else{
      				callback(new Error('小数点后只能输入两位'))
      			}
      		}else{
      			callback(new Error('请输入0~100的数值'))
      		}
      	}
      };
    	
      return {
      
        form:{
        	partyBInvoiceLimit:'',
        	invoiceParty:'',
        	announcementTime:[],
        	contractEndTime:'',
          contractStartTime:'',
          invoiceApplicant:'',//项目开票申请方（0：服务方；1：项目乙方）
          lxwlServiceFeeRate:'',//领先未来服务费率
          creditLine:'',
          name:'',//目名称
          partyAContactName:'',//项目方联系人姓名
          partyAContactPhone:'',//项目方联系人联系方
          partyBId:'',//项目乙方id
          partyBPrincipalId:'',//乙方负责人id
          partyCAccountName:'',//第三方平台费结算开户名
          partyCAccountNo:'',//第三方平台费结算账号
          partyCBank:'',//第三方平台费结算银行
          partyCServiceFeeRate:'',//第三方平台服务费率
          paymentDays:'',//账期天数
          paymentDesc:'',//账期备注
          paymentType:'',//结算方式（0：独立结算，1：合并结算
          publisherId:'',//发布负责人id
          shortName:'',//简称
          type:'',//项目类型
          userDataAuthorityId:'',//集团负责人id
        },
        options4:[],
        options3:[],
        options2:[],
        options1:[],
        rules:{
        	paymentDays:[
        		{validator: paymentDaysRule, trigger: 'blur'}
        	],
        	paymentType: [
            { required: true,message: '请选择第三方平台费结算方式', trigger: 'change'},
          ],
        	partyCAccountName: [
            { required: true,message: '请输入第三方平台费结算开户名', trigger: 'blur'},
          ],
          partyCAccountNo: [
            { required: true,message: '请输入第三方平台费结算账号', trigger: 'blur'},
          ],
          partyCBank: [
            { required: true,message: '请输入第三方平台费结算银行', trigger: 'blur'},
          ],
          type: [
            { required: true,message: '请选择项目类型', trigger: 'change'},
          ],
          invoiceApplicant: [
            { required: true,message: '请选择项目开票申请方', trigger: 'change'},
          ],
          name:[
            { required: true, validator: projectNameRule,trigger: 'blur'},
          ],
          partyBId: [
            { required: true,message: '请输入项目乙方', trigger: 'change'},	
          ],
          contractEndTime: [
            { required: true,message: '请输入项目结束时间', trigger: 'blur'},	
          ],
          contractStartTime: [
            { required: true,message: '请输入项目开始时间', trigger: 'blur'},	
          ],
          partyBPrincipalId:[
          	{ required: true,message: '请输入项目乙方负责人', trigger: 'change'},	
          ],
          userDataAuthorityId:[
          	{ required: true,message: '请输入集团项目负责人', trigger: 'change'},	
          ],
          publisherId:[
          	{ required: true,message: '请输入项目发布负责人', trigger: 'blur'},	
          ],
          announcementTime:[
          	{ required: true,message: '请输入合同有效期', trigger: 'blur'},	
          ],
          lxwlServiceFeeRate:[
          	{ required: true,validator: typeJudgelingxian, trigger: 'blur'},	
          ],
           partyBInvoiceLimit:[
          	{ required: true,message: '请选择乙方发票限额', trigger: 'blur'},	
          ],
          invoiceParty:[
          	{ required: true,message: '请选择是否需要集团开票', trigger: 'change'},	
          ],
          needPartyCServiceFeeRate:[
          	{ required: true,message: '请选择第三方平台是否收费', trigger: 'change'},	
          ],
          needOrderItemForBill:[
          	{ required: true,message: '请选择是否需要上传自定义开票明细', trigger: 'change'},	
          ],
          partyCServiceFeeRate:[
          	{ required: false,validator: typeJudge,  trigger: 'blur'},
          ]
          
        },
        realName:'',
        realName1:'',
        realName2:'',
        editId:''
      };
    },
    components:{
      addhead
    },
    watch:{
    	"form.announcementTime" : {
    		handler:function(a,b){
    			console.log(a)
				if(a){
					this.form.contractStartTime=a[0]
					this.form.contractEndTime=a[1]
				}else{
					this.form.contractStartTime=''
					this.form.contractEndTime=''
				}
				},
				deep:true
    	},
    	"form.paymentType" : {
    		handler:function(a,b){
					if(a=='1'){
	    			this.form.partyCAccountName=''
	    			this.form.partyCAccountNo=''
	    			this.form.partyCBank=''
	    			this.rules.partyCServiceFeeRate[0].required=true
	    			this.rules.paymentType[0].required=true
	    			this.rules.partyCAccountName[0].required=false
	    			this.rules.partyCAccountNo[0].required=false
	    			this.rules.partyCBank[0].required=false
	    			this.changefform('partyCBank')
		    		this.changefform('partyCAccountNo')
		    		this.changefform('partyCAccountName')
	    		
					}else if(a=='2'){
	    			this.form.partyCAccountName=''
	    			this.form.partyCAccountNo=''
	    			this.form.partyCBank=''
	    			this.form.partyCServiceFeeRate=''
	    			this.rules.partyCServiceFeeRate[0].required=false
	    			this.rules.paymentType[0].required=true
	    			this.rules.partyCAccountName[0].required=false
	    			this.rules.partyCAccountNo[0].required=false
	    			this.rules.partyCBank[0].required=false
	    			this.changefform('partyCServiceFeeRate')
	    			this.changefform('partyCBank')
		    		this.changefform('partyCAccountNo')
		    		this.changefform('partyCAccountName')
					}else if(a=='0'){
	    			this.rules.partyCServiceFeeRate[0].required=true
	    			this.rules.paymentType[0].required=true
	    			this.rules.partyCAccountName[0].required=true
	    			this.rules.partyCAccountNo[0].required=true
	    			this.rules.partyCBank[0].required=true
	    		}else{
	    			this.rules.partyCServiceFeeRate[0].required=true
	    			this.rules.paymentType[0].required=true
	    			this.rules.partyCAccountName[0].required=false
	    			this.rules.partyCAccountNo[0].required=false
	    			this.rules.partyCBank[0].required=false
	    		}
	    		
				},
				deep:true
    	},
    	"form.type" : {
    		handler:function(a,b){
					if(a==0){
						
	    		}else{
	    			this.form.paymentType='' 
	    			this.form.partyCServiceFeeRate=''  
	    			this.form.partyCBank=''  
	    			this.form.partyCAccountName=''  
	    			this.form.partyCAccountNo=''  
	    		}
				},
				deep:true
    	},
    },
    created(){
       this.getProjectData()
    },
    activated(){
    	if(this.editId){
    		if(this.$route.query.editId!=this.editId){
    			this.getProjectData()
    		}
    	}
    },
    methods: {
    	allShow(){
    		if(this.form.type!=0){
    			return false
    		}else{
    			return true
    		}
    	},
    	typeDis(){
	      if(this.$route.query.status==0){
	      	return true
	      }else{
	      	if(this.$route.query.oldId>0){
	      		return true
	      	}else{
	      		return false
	      	}
	      }
    	},
    	changefform(name){
    		this.$refs['form'].validateField(name,message=>{
    			console.log(message)
    		})
    	},
    	getProjectData(){
    		this.editId=this.$route.query.editId
    		getProjectName(this.$route.query.editId).then(res=>{
    			this.form=res.data
    			this.form.userDataAuthorityId=res.data.userDataAuthorityUserDTO.id
    			this.form.partyBPrincipalId=res.data.partyBPrincipalUserDTO.id
    			this.form.publisherId=res.data.publisherId==0?'':res.data.publisherId
    			this.$set(this.form,"announcementTime",[]) 
    			this.form.announcementTime.push(res.data.contractStartTime)
    			this.form.announcementTime.push(res.data.contractEndTime)
    			this.options4=[{
    				name:res.data.partyBName,
    				id:res.data.partyBId
    			}]
    			
    			if(res.data.publisherId){
    				this.options3=[{
	    				userName:res.data.publisherUserDTO.userName,
	    				realName:res.data.publisherUserDTO.realName,
	    				id:res.data.publisherId
	    			}]
    			}
    			this.options2=[{
    				userName:res.data.userDataAuthorityUserDTO.userName,
    				id:res.data.userDataAuthorityUserDTO.id,
    				realName:res.data.userDataAuthorityUserDTO.realName
    			}]
    			this.options1=[{
    				userName:res.data.partyBPrincipalUserDTO.userName,
    				id:res.data.partyBPrincipalUserDTO.id,
    				realName:res.data.partyBPrincipalUserDTO.realName
    			}]
    			this.realName=res.data.partyBPrincipalUserDTO.realName
    			this.realName1=res.data.userDataAuthorityUserDTO.realName
    			this.realName2=res.data.publisherUserDTO.realName
    		})
    	},
    	userNamechange(value){
    		let a=this.options1.filter((item,index)=>{
    			return item.id==value
    		})
    		this.realName=a[0].realName
    	},
    	userNamechange1(value){
    		let a=this.options2.filter((item,index)=>{
    			return item.id==value
    		})
    		this.realName1=a[0].realName
    	},
    	userNamechange2(value){
    		let a=this.options3.filter((item,index)=>{
    			return item.id==value
    		})
    		this.realName2=a[0].realName
    	},
    	remoteMethod(query) {
        if (query !== '') {
          organizationListName({name:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
      remoteMethod1(query){
				if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options1=res.data
          })
	        } else {
	          this.options1 = [];
	        }
      },
      remoteMethod2(query){
	        if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options2=res.data
          })
	        } else {
	          this.options2 = [];
	        }
      },
      remoteMethod3(query){
      	 if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
//      if(this.form.partyBId){
//					if (query !== '') {
//        organizationUserList({realName:query,count: 10,status: 0,organizationId: this.form.partyBId}).then(res=>{
//        	this.options3=res.data
//        })
//	        } else {
//	          this.options3 = [];
//	        }
//				}else{
//					this.$message({
//		        message:'请选择项目乙方',
//		        type: 'error', 
//		      })
//				}
      },
      addrow(){
      	let a={name1:'',name2:'',name3:''}
      	
      	this.form.people.push(a)
      },
      deleterow(){
      	this.form.people.pop()
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           editProjrct(this.$route.query.editId,this.form).then(res=>{
           	if(res.data){
           			this.$message({
					        message:'保存成功',
					        type: "success", 
					      })
           			this.resetForm('form')
           			this.close('DetailProject')
           			this.close({
				        		name:'EditProject',
				        		to:{
				        			name:'ProjectManage',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
           	}else{
           		this.$message({
				        message:res.message,
				        type: 'warning', 
				      })
           	}
           })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitcreateSubmitReview(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           updateSubmitReview(this.$route.query.editId,this.form).then(res=>{
           	if(res.data){
           			this.$message({
					        message:'保存成功',
					        type: "success", 
					      })
           			this.resetForm('form')
           			this.close('DetailProject')
           			this.close({
				        		name:'EditProject',
				        		to:{
				        			name:'ProjectManage',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
           	}else{
           		this.$message({
				        message:res.message,
				        type: 'warning', 
				      })
           	}
           })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
       resetForm(formName) {
        this.$refs[formName].resetFields();
        this.realName=''
        this.realName1=''
        this.realName2=''
      }
      
    }
  }
</script>

<style lang="less" scoped>
.el-form{
     color: #606266;
.projectBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
    .el-form{
      margin-left: 50px;
      padding-top:20px;
      .el-form-item{
        
        .el-input{
          max-width: 770px;
          height: 40px;
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
