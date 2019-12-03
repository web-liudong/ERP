<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="addbac-ruleForm">
<div class="addProjectTender">
<div class="h50 headerBox1"><i class="icon iconfont icon-jinqi"></i><span>项目招标信息</span></div>
  <el-form-item label="项目类型：">
    <el-radio-group v-model="ruleForm.tenderProjectType">
      <el-radio label="MALL">商城</el-radio>
      <el-radio label="SHOPPE">专柜</el-radio>
      <el-radio label="OTHER ">其他</el-radio>
    </el-radio-group>
  </el-form-item>
    <el-form-item label="项目名称：" prop="name">
      <el-input v-model="ruleForm.name" placeholder="字数长度1~30"></el-input>
    </el-form-item>
    <el-form-item label="招标内容：" style="width: 910px;">
    	<el-checkbox-group v-model="ruleForm.tenderProjectContentParam.tenderProjectContentContents">
			    <el-checkbox v-for="city in tenderContent" :label="city.tenderProjectContentContent" :key="city.tenderProjectContentContent">{{city.tenderProjectContentContentName}}</el-checkbox>
			    <el-input v-model="ruleForm.tenderProjectContentParam.content" placeholder="备注：字数长度20以内" size="mini" style="width: 170px;" :disabled="testOther"></el-input>
			</el-checkbox-group>
      
    </el-form-item>
    <el-form-item label="所属行业：">
	    <el-select v-model="ruleForm.firstLevelIndustryId" filterable  placeholder="行业一级分类" style="width: 240px;" @change="industry1change">
	      <el-option 
	      	v-for="o in industry1"
	      	:key="o.value"
	      	:label="o.label" 
	      	:value="o.value">	      	
	      </el-option>	      
	    </el-select>
	    <el-select v-model="ruleForm.secondLevelIndustryId" filterable placeholder="行业二级分类" style="width: 240px;" @change="industry2change">
	      <el-option 
	      	v-for="o in industry2"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>
	    </el-select>
	    <el-select v-model="ruleForm.thirdLevelIndustryId" filterable placeholder="行业三级分类" style="width: 240px;">
	      <el-option 
	      	v-for="o in industry3"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>
	    </el-select>
    </el-form-item>
    <!--<el-form-item label="供应商等级：" prop="supplierGradeLevel">
      <el-select v-model="ruleForm.supplierGradeLevel" placeholder="供应商等级" style="width: 400px;">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>-->
    <el-form-item label="客户单位：">
      <el-input v-model="ruleForm.customerCompany" placeholder="字数1~15"></el-input>
    </el-form-item>
    <el-form-item label="主导部门：">
      <el-input v-model="ruleForm.leadingDepartment" placeholder="字数1~15"></el-input>
    </el-form-item>
    <el-form-item label="执行区域：" prop="classify" class="listBox">
        <div class="listLeftBox left">
           <div class="headerBox"><span>所有区域</span></div>
           <div class="lltree">
           	<el-tree
          	ref="tree"
            :data="data2"
            show-checkbox
            node-key="id"
            render-after-expand 
            @check="getnode()"
            :props="defaultProps">
          </el-tree>
           </div>
          
        </div>
         <div class="listRightBox left">
         <div class="headerBox"><span>已选区域</span></div>
         <div class="lltree" style="position: relative;">
         	<el-tree
             :data="data2"
            	ref="tree2"
             node-key="id"
             render-after-expand            
             :filter-node-method="filterNode"
             :props="defaultProps">
           </el-tree>
           <el-input  v-model="ruleForm.classify" style="position:absolute;top: 0px;width: 1px;height: 1px;opacity: 0;padding: 0;z-index: -1;"></el-input >
         </div>
           
         </div>
    </el-form-item>
    <el-form-item label="项目投标主体：">
      
      <el-select
			    v-model="ruleForm.organizationId"
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
    <el-form-item label="参与方式：">
      <el-input v-model="ruleForm.participationWay" placeholder="字符长度1~50"></el-input>
    </el-form-item>
    <el-form-item label="发布网站：">
      <el-input v-model="ruleForm.publishingWebsite" placeholder="字符长度1~50"></el-input>
    </el-form-item>
    <!--<el-form-item label="统一社会信用代码：" prop="socialCreditCode">
      <el-input v-model="ruleForm.socialCreditCode" placeholder="请输入公司纳税识别号"></el-input>      	
			<li style="line-height: 12px;font-size: 12px;">统一社会信用代码：是指工商营业执照、组织机构代码证、税务登记证的统称</li>
    </el-form-item>-->
    <el-form-item label="获知时间：">
      <el-date-picker
      v-model="ruleForm.informedTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期时间">
    </el-date-picker>
  	</el-form-item>
  	<el-form-item label="公告起止时间：">
      <el-date-picker
      style="width: 730px;"
      v-model="announcementTime"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    	</el-date-picker>	 
    </el-form-item>
    <el-form-item label="开标时间：">
      <el-date-picker
      v-model="ruleForm.tenderOpenTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期时间">
    </el-date-picker>
  	</el-form-item>
  	<el-form-item label="省/市/区：">
	    <el-select v-model="ruleForm.tenderOpenProvinceId" filterable  placeholder="省" style="width: 240px;" @change="o1change">
	      <el-option 
	      	v-for="o in o1"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>	      
	    </el-select>
	    <el-select v-model="ruleForm.tenderOpenCityId" filterable placeholder="市" style="width: 240px;" @change="o2change">
	      <el-option 
	      	v-for="o in o2"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>
	    </el-select>
	    <el-select v-model="ruleForm.tenderOpenCountyId" filterable placeholder="县/区" style="width: 240px;" @change="o3change">
	      <el-option 
	      	v-for="o in o3"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>
	    </el-select>
    </el-form-item>
    <el-form-item label="详细地址：">
      <el-input type="textarea" v-model="ruleForm.tenderOpenAddressLine"  :rows="5" placeholder="请输入200字以内"></el-input>
  	</el-form-item>
  	<el-form-item label="项目期限：" >
      <el-col style="width: 130px;">
	      <el-form-item >
	        <el-input v-model="ruleForm.projectDuration" style="width: 130px;"><template slot="append">年</template></el-input>
	      </el-form-item>
	    </el-col>

	    <el-col style="width: 420px;">
	      <el-form-item label="项目起止日期：">
	        <el-date-picker
		      v-model="projectTime"
		      type="daterange"
		      value-format="yyyy-MM-dd"
		      range-separator="至"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期">
		    	</el-date-picker>
	      </el-form-item>
	    </el-col>
    </el-form-item>
  	
  	<div class="h50 headerBox1" style="border-top: 1px solid #E4E4E4;"><i class="icon iconfont icon-jinqi"></i><span>项目联系人信息</span></div>
    
    <!--<el-form-item label="公司经营区域：" prop="regionIds">
      <div id="" style="width: 422px;border-radius: 5px;border: 1px solid #e5e5e5;">
      	<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			  <el-checkbox-group v-model="ruleForm.regionIds" @change="handleCheckedCitiesChange">
			    <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
			  </el-checkbox-group>
      </div>
    </el-form-item>-->
    <el-form-item label="项目联系人：">
      <el-input v-model="ruleForm.projectContactName" placeholder="字数1~30"></el-input>
    </el-form-item>
    <el-form-item label="项目联系电话：">
      <el-input v-model="ruleForm.projectContactPhone" placeholder="字数1~50"></el-input>
    </el-form-item>
    <el-form-item label="客户单位地址：">
      <el-input v-model="ruleForm.customerCompanyAddress" placeholder="字数1~15"></el-input>
    </el-form-item>
    <el-form-item label="客户单位联系方式：">
      <el-input v-model="ruleForm.customerCompanyContactPhone" placeholder="字数1~15"></el-input>
    </el-form-item>
    <el-form-item label="代理机构名称：">
      <el-input v-model="ruleForm.agencyName" placeholder="字数1~15"></el-input>
    </el-form-item>
    <el-form-item label="代理机构地址：">
      <el-input v-model="ruleForm.agencyAddress" placeholder="字数1~15"></el-input>
    </el-form-item>
    <el-form-item label="代理机构联系人：">
      <el-input v-model="ruleForm.agencyContactName" placeholder="字数1~15"></el-input>
    </el-form-item>
    <el-form-item label="代理机构联系方式：">
      <el-input v-model="ruleForm.agencyContactPhone" placeholder="字数1~15"></el-input>
    </el-form-item>
    
    
   
    <div class="h50 headerBox1" style="border-top: 1px solid #E4E4E4;"><i class="icon iconfont icon-jinqi"></i><span>项目投标信息</span></div>
    <el-form-item label="项目投标负责人账号：" required>
      <el-col style="width: 275px;">
	      <el-form-item prop="userDataAuthorityId">
	         <el-select
					    v-model="ruleForm.userDataAuthorityId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod1"
					    @change="userNamechange1"
					    >
					    <el-option
					      v-for="item in options3"
					      :key="item.id"
					      :label="item.userName"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
	    </el-col>

	    <el-col style="width: 420px;">
	      <el-form-item label="投标负责人姓名：" required>
	        <el-input v-model="realName1" style="width: 275px;"  disabled></el-input>
	      </el-form-item>
	    </el-col>
    </el-form-item>
   	<el-form-item label="负责部门：">
            <el-popover
				    placement="bottom"
				    width="180"
				    trigger="manual"
				    v-model="visible">
				    <div class="hidetree" style="height: 200px;overflow: auto;">
				    	<el-tree :data="treeData" :props="defaultProps1" @node-click="handleNodeClick"
				    		 default-expand-all
				    		 node-key="id"
				    		></el-tree>
				    </div>
					   <el-input v-model="bumenName" style="width: 200px;" readonly placeholder="请选择部门" slot="reference" @blur="visible = !visible" @focus="bumeInputFocus()"></el-input>
					  </el-popover>
      </el-form-item>
 		
  	<el-form-item label="工作安排：">
      <table border="1" cellspacing="1" cellpadding="1" style="width: 730px;border:1px #dcdfe6;">
      	<tr>
      		<th style="width: 160px;">工作事项</th>
      		<th colspan="2">负责人</th>
      		<th style="width: 100px;">操作</th>
      	</tr>
      	<tr v-for="(item,index) in ruleForm.tenderProjectWorkTasks" :key="index+'12'">
      		<td style="text-align: center;">
      			<span v-if="item.systemDefault">{{item.workItem}}</span>
      			<el-input v-else v-model="item.workItem"  style="width: 90%;border: 0px;text-align: center;"></el-input>
      		</td>
      		<td style="text-align: center;">
      			<el-select
					    v-model="item.userId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod2"
					    @change="userNamechange2"
					    @focus="selectFocus(index)"
					    >
					    <el-option
					      v-for="it in item.option"
					      :key="it.id"
					      :label="it.userName"
					      :value="it.id">
					    </el-option>
					  </el-select>
      		</td>
      		<td style="text-align: center;">
      			<el-input v-model="item.realName" placeholder="通过账号直接关联人名" disabled style="width: 80%;"></el-input>
      		</td>
      		<td  style="text-align: center;">
      			<el-button  type="text" size="small" v-if="!item.systemDefault" @click="splicetableItem(index)">删除</el-button>
      		</td>
      	</tr>
      	
      </table>
      <div class="table_bottom" style="padding-top: 10px;">
      	<el-button @click="pushtableItem()">添加工作事项</el-button>
      </div>
    </el-form-item>
    <el-form-item label="备注：">
      <el-input type="textarea" :rows="5" v-model="ruleForm.remark" placeholder="输入姓名，字数1~15以内"></el-input>
    </el-form-item>
  	
    <el-form-item style="margin-top: 20px">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button type="primary" @click="dialogVisibleclose=true">取消</el-button>
      <!--<el-button type="primary" @click="resetForm('ruleForm')">清空</el-button>-->
    </el-form-item>
  
</div>
<el-dialog
		  title="取消确认"
		  :visible.sync="dialogVisibleclose"
		  width="30%"
		  >
		  <span>取消后，当前填写的信息将不保存，确定取消</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisibleclose = false">取 消</el-button>
		    <el-button type="primary" @click="close()">确 定</el-button>
		  </span>
</el-dialog>
</el-form>
</template>

<script>import './SupplierList.less'
import { provinces_based_id,subs} from "@/api/basicSupplier"
import { simpleList,userList } from "@/api/userService"
import { industryTree,subIndustry} from "@/api/common/commonApi"
import { nameRepeatedCheck,listName,departmentTree,initializationWorktask,addTenderProject,initializationContent} from "@/api/marketing-service/projectTender"

import { threeleveltreeStartwithProvince} from "@/api/common/commonApi"
export default {
	name:'AddProjectTender',
	inject:['close'],
	data() {
		var supplierNameRule= (rule, value, callback) => {
			
        if (value == '') {
          callback(new Error('项目名称不能为空'));
        }else if(/\\+|\~+|\!+|\@+|\#+|¥+|\￥+|\%+|\^+|\&+|\*+|\(+|\)+|\'+|(\")+|\$+|`+|\“+|\”+|\‘+|\’+|\s+|\.+|\,+|\。+|\'+|\"+|\、+|\|+|\……+|\\+|\/+/g.test(value)){
        	callback(new Error('项目名称不能含有特殊字符'));
        }else if(value.length>30){
        	callback(new Error('限制字数1~30'));
        }else{
        		nameRepeatedCheck({name:value}).then(res=>{
		        	if(res.data){
		        		callback();
		        	}else{
		        		callback(new Error('项目名称已存在'))
		        	}
		        }).catch(rej=>{
		        	callback(new Error('项目名称已存在'))
		        })
        }
      };
		return {
			testOther:true,
			tenderContent:[],
			dialogVisibleclose:false,
			bumenName:'',
			tableindex:'',
			options3:[],
			treeData:[],
			visible:false,
			realName1:'',
			//省市县
			o1:[],
			o2:[],
			o3:[],
			industry1:[],
			industry2:[],
			industry3:[],
			announcementTime:'',
			projectTime:'',
			ruleForm: {
					"agencyAddress": "",
					"agencyContactName": "",
					"agencyContactPhone": "",
					"agencyName": "",
					"announcementEndTime": "",
					"announcementStartTime": "",
					"customerCompany": "",
					"customerCompanyAddress": "",
					"customerCompanyContactPhone": "",
					"departmentId": '',
					"firstLevelIndustryId": '',
					"informedTime": "",
					"leadingDepartment": "",
					"managerName": "",
					"managerNo": "",
					"name": "",
					"organizationId": '',
					"participationWay": "",
					"projectContactName": "",
					"projectContactPhone": "",
					"projectDuration": '',
					
					"projectEndTime": "",
					"projectStartTime": "",
					"publishingWebsite": "",
					"regionIds": [
					  
					],
					"remark": "",
					"secondLevelIndustryId": '',
					"tenderOpenAddressLine": "",
					"tenderOpenCityId": '',
					"tenderOpenCountyId": '',
					"tenderOpenProvinceId":'',
					"tenderOpenTime": "",
					"tenderProjectContentParam": {
						
					"content": "",
					"tenderProjectContentContents": [
					  
					  ]
					},
					"tenderProjectType": "",
					"tenderProjectWorkTasks": [
					{
					  "userId": '',
					  "workItem": ""
					  }
					],
					"thirdLevelIndustryId": '',
					"userDataAuthorityId": ''
			},
			realName:'',
			options4:[],
			data2: [],
			defaultProps: {
				children: 'childrenDTOs',
				label: 'name'
			},
			defaultProps1: {
				children: 'departmentTreeDTOList',
				label: 'name'
			},
			rules: {
				name: [{
					required: true,
					validator: supplierNameRule,
					trigger: 'blur'
				},],
				userDataAuthorityId:[{
					required: true,
					message: '请选择项目投标负责人账号',
					trigger: 'blur'
				},],
			},
		};
	},
	watch: {
		defaultProps(a, b) {
			console.log(a)
		},
		'ruleForm.tenderProjectContentParam.tenderProjectContentContents':{
			handler:function(a,b){
				console.log(a)
				if(a.includes("OTHER")){
					this.testOther=false
				}else{
					this.testOther=true
					this.ruleForm.tenderProjectContentParam.content=''
				}
			},
			deep:true
		},
		announcementTime(a,b){
			if(a){
				this.ruleForm.announcementStartTime=a[0]
				this.ruleForm.announcementEndTime=a[1]
			}else{
				this.ruleForm.announcementStartTime=''
				this.ruleForm.announcementEndTime=''
			}
		},
		'ruleForm.organizationId':{
			handler:function(a,b){
				this.treeData=[]
				this.bumenName=''
				this.ruleForm.departmentId=''
			},
			deep:true
		},
		projectTime(a,b){
				if(a){
				this.ruleForm.projectStartTime=a[0]
				this.ruleForm.projectEndTime=a[1]
				}else{
				this.ruleForm.projectStartTime=''
				this.ruleForm.projectEndTime=''
				}
		},
	},
	computed:{
		
	},
	created() {
		industryTree().then(res=>{
			this.industry1=res.data
		})
		provinces_based_id().then(res => {
			this.o1=res.data
		})
		this.getinitializationContent()
		this.getinitializationWorktask()
		this.isgetTreeAll()
	},
	mounted() {
//		console.log(this.ruleForm.categoryBrandIds[0].categoryId)
		
	},
	methods: {
		getinitializationContent(){
			initializationContent().then(res=>{
				this.tenderContent=res.data
			})
		},
		isclose(){
			window.close()
		},
		selectFocus(index){
			console.log(index)
			this.tableindex=index
		},
		getinitializationWorktask(){
			initializationWorktask().then(res=>{
				let a=res.data.map(item=>{
					let b={option:[],realName:''}
					return Object.assign(item,b)
				})
				this.ruleForm.tenderProjectWorkTasks=a
				console.log(this.ruleForm.tenderProjectWorkTasks)
			})
		},
		bumeInputFocus(){
			this.visible=true
			if(this.ruleForm.organizationId){
				departmentTree(this.ruleForm.organizationId).then(res=>{
				this.treeData=res.data
			})
			}else{
				this.$message({
			        message:'请选择项目投标主题',
			        type: "error",
			      })
			}
		},
		remoteMethod1(query){
			if (query !== '') {
          userList({organizationId:this.$auth.user.userPosts[0].organizationId,realName:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
		},
		remoteMethod2(query){
			if (query !== '') {
          userList({organizationId:this.$auth.user.userPosts[0].organizationId,realName:query}).then(res=>{
          	this.ruleForm.tenderProjectWorkTasks[this.tableindex].option=res.data
          })
        }
		},
		userNamechange2(value){//表格下拉点击
			let a=this.ruleForm.tenderProjectWorkTasks[this.tableindex].option.filter((item,index)=>{
    			return item.id==value
    		})
    	this.ruleForm.tenderProjectWorkTasks[this.tableindex].realName=a[0].realName
		},
		pushtableItem(){//添加工作事项
			let a={
				option:[],
				realName:'',
				systemDefault:false,
				userId:null,
				userName:null,
				workItem:'',
			}
			this.ruleForm.tenderProjectWorkTasks.push(a)
		},
		splicetableItem(index){
			this.ruleForm.tenderProjectWorkTasks.splice(index,1)
		},
		userNamechange1(value){
			let a=this.options3.filter((item,index)=>{
    			return item.id==value
    		})
    		this.realName1=a[0].realName
		},
		handleNodeClick(a){
			console.log(a)
			this.bumenName=a.name
			this.ruleForm.departmentId=a.id
		},

		//模糊搜索
		remoteMethod(query) {
        if (query !== '') {
          listName({name:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
		o1change(data){
			console.log(data)
//			"cityId": "", //市
//				"countyId": "", //县
				this.ruleForm.tenderOpenCityId=''
				this.ruleForm.tenderOpenCountyId=''
			subs(data).then(res=>{
				
				this.o2=res.data
			})
		},
		o2change(data){
			this.ruleForm.tenderOpenCountyId=''
			subs(data).then(res=>{

				this.o3=res.data
			})
		},
		industry1change(data){
			console.log(data)
//			"cityId": "", //市
//				"countyId": "", //县secondLevelIndustryIdthirdLevelIndustryId
				this.ruleForm.secondLevelIndustryId=''
				this.ruleForm.thirdLevelIndustryId=''
			subIndustry(data).then(res=>{
				this.industry2=res.data
			})
		},
		industry2change(data){
			this.ruleForm.thirdLevelIndustryId=''
			subIndustry(data).then(res=>{
				this.industry3=res.data
			})
		},
		o3change(data){
			
		},
//		获取全部树结构
		isgetTreeAll(){
			threeleveltreeStartwithProvince().then(res=>{
				this.data2=res.data
				this.$nextTick().then(()=>{
					this.getnode()
				})
			})
		},

//		handleCheckedCitiesChange(value) {
//			let checkedCount = value.length;
//			this.checkAll = checkedCount === this.cities.length;
//			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
//		},
//		获取选中得node 和 key
		getnode(data) {
			let yeziId = this.$refs.tree.getCheckedKeys(true)
			let idArr = this.$refs.tree.getCheckedKeys()
		this.ruleForm.regionIds=idArr
			
			this.$refs.tree2.filter(idArr);
		},
		filterNode(value, data) {
			if(!value) return true;
			return value.includes(data.id);

		},


		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
					addTenderProject(this.ruleForm).then(res=>{
            	if(res.data>0){
            		this.$message({
				          message: '操作成功',
				          type: 'success'
				        });
				        this.close({
				        		name:'AddProjectTender',
				        		to:{
				        			name:'ProjectTender',
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
}</script>

<style lang="less" scoped>
.el-form{
    
     color: #606266;
.addProjectTender{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .headerBox1{
  	margin-bottom: 10px;
    height: 50px;
    background: #f3f3f3;
    border-bottom: 1px solid #e4e4e4;
 		i{
 			padding-left: 10px;
 			position: relative;
 			top: 3px;
 			font-size: 26px;
 		}
    span{
    	font-size: 18px;
      line-height: 50px;
    }
  }
  
   .el-form-item{
     .el-input{
       width: 730px;
       height: 40px;
     }
     .el-textarea{
     	width: 730px;
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
      	position: relative;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 300px;
        height:350px;
       .headerBox{
       	background: #F5F5F5;
       	z-index: 5;
         height: 35px;
         border-bottom: 1px solid #e4e4e4;
         span{
           color: red;
           line-height: 36px;
         }
       }
       .lltree{
       	width: 100%;
       	height: 314px;
       	box-sizing: border-box;
       	overflow: auto;
       }
      }
      .listRightBox{
      	border: 1px solid #e5e5e5;
      	height:350px;
        width: 300px;
        overflow: auto;
        /*padding: 0 10px;*/
        .headerBox{
        		background: #F5F5F5;
          height: 35px;
          border-bottom: 1px solid #e4e4e4;
          span{
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }
        .lltree{
       	width: 100%;
       	height: 314px;
       	box-sizing: border-box;
       	overflow: auto;
       }

      }
    }
  
}
}
</style>
