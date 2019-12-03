<template>
  <div class="projectManageBox returnOrderBox">
    <div class="buttonBox">
      <el-button size="small" v-for="(buttondata,index) in buttondatas" :key="index" :class="{ active: buttonshow==index }" @click="header_button_click(index)">{{buttondata.statusName}}（{{buttondata.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="Reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom clearfix" v-if="isShow">
      	
		      <div class="criteria_item" v-if="buttonshow==0">
			       	项目编号:
		        <el-input
		          placeholder="项目编号"
		          v-model="projectNO"
		          clearable>
		        </el-input>
		      </div>
		      <div class="criteria_item">
		        项目名称:
        <el-select
			    v-model="projectName"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="项目名称"
			    :remote-method="remoteMethod">
			    <el-option
			      v-for="item in options4"
			      :key="item.value"
			      :label="item.name"
			      :value="item.name">
			    </el-option>
			  </el-select>
		      </div>
		      <div class="criteria_item">
		        项目类型:
	        <el-select v-model="value1" placeholder="项目类型" style="padding: 5px;">
	          <el-option
	            v-for="item in options1"
	            :key="item.value"
	            :label="item.label"
	            :value="item.value">
	          </el-option>
	        </el-select>
		      </div>
		      <div class="criteria_item">
		        项目乙方:
        <el-select
			    v-model="partyBId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入"
			    :remote-method="remoteMethod2"
			    >
			    <el-option
			      v-for="item in options2"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			  </el-select>
		      </div>
		       <div class="criteria_item">
		         项目乙方负责人:
        <el-select
					    v-model="partyBPrincipalId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethodyi"
					    >
					    <el-option
					      v-for="item in options100"
					      :key="item.id"
					      :label="item.userName+' - '+item.realName"
					      :value="item.id">
					    </el-option>
					  </el-select>
		      </div>
		      <div class="criteria_item">
		         项目集团负责人:
        		<el-select
					    v-model="userDataAuthorityId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod1"
					    >
					    <el-option
					      v-for="item in options3"
					      :key="item.id"
					      :label="item.userName+' - '+item.realName"
					      :value="item.id">
					    </el-option>
					  </el-select>
		      </div>
		      <div class="criteria_item">
		         创建时间:
        		<el-date-picker
        			style="margin: 5px;"
				      v-model="announcementTime"
				      type="daterange"
				      value-format="yyyy-MM-dd"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				      </el-date-picker>
		      </div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop clearfix">
        <span><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					<!--<el-button size="small" @click="showDialog('importFile')">
						<i class="icon-Icon-daoru iconfont button-head-icon" style="font-size: 15px;line-height: 12px;"></i> 
						<span style="font-size: 12px;line-height: 12px;margin-left: 5px;color: #606266;">导入</span>
					</el-button>-->
					<div class="operation_btn" @click="showDialog('importFile')" v-if="$authorities.ProjectImportRelevant"><i class="iconfont icondaoru"></i>导入</div>
					<router-link to="/customer/projectManage/importrecord"  v-if="$authorities.ProjectImportRelevant">
                <div class="operation_btn"><i class="iconfont iconcaidan"></i>导入记录</div>
          </router-link>
          
        	<router-link to="/customer/projectManage/addProject"  v-if="$authorities.ProjectCreateRelevant">
                <div class="operation_btn" ><i class="iconfont iconzengjia"></i>添加</div>
          </router-link>
					
        </div>
      </div>
      <div class="listBoxTable">
      	<el-table
          :data="tableData"
          border
          stripe
          :max-height="dataListHeight"
          style="width: 100%"
          size="small">
          <el-table-column
          	v-if="buttonshow==0"
            prop="no"
            label="项目编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="88px"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="type"
            label="项目类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyAContactName"
            label="项目方联系人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyBName"
            label="项目乙方"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyBPrincipalName"
            label="项目乙方负责人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userDataAuthorityName"
            label="项目集团负责人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="数据状态"
            align="center">
          </el-table-column>
          
          <el-table-column
            prop="customersCount"
            label="相关数据"
            align="center">
            <template slot-scope="scope">

              <router-link v-if="$authorities.CustomerManageList" v-show="buttonshow==0" :to="{name:'customermanage',query:{pid:scope.row.id,pname:scope.row.name}}">
                <el-button type="text">客户:{{scope.row.customersCount}}</el-button>
              </router-link>
              <span v-else>客户:{{scope.row.customersCount}}</span>
              <span v-show="buttonshow!=0">--</span>
              
              
            </template>
          </el-table-column>
					<el-table-column
            label="设置"
            width="150"
            align="center">
            <template slot-scope="scope">
            		<el-button  v-show="buttonshow==0" type="text" size="small" @click="goPartner(scope.row)"  v-if="$authorities.ProjectServiceRate">项目服务费用率设置</el-button>
                <span v-show="buttonshow!=0">--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="230px"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" v-if="$authorities.ProjectDetailRelevant" @click="goDetail(scope.row.id)">详情</el-button>
                <el-button  v-show="buttonshow!=1&&!(buttonshow==3&&scope.row.oldId)" @click="handleClick(scope.row)" v-if="$authorities.ProjectUpdateRelevant" type="text" size="small">编辑</el-button>
                <el-button  v-show="buttonshow==0" @click="isService(scope.row)" v-if="$authorities.SpecifiedBrandSpecialServiceManagement" type="text" size="small">指定品牌特殊服务管理</el-button>
              	<el-button v-show="buttonshow==1" type="text" size="small" @click="downClick(scope.row)" v-if="$auth.user.id==scope.row.partyBPrincipalUserId&&$authorities.ProjectExamine" >审核</el-button>
              	<el-button v-show="buttonshow==2" type="text" size="small" @click="visbiForbid(scope.row)" v-if="$authorities.ProjectArraignment">提审</el-button>
              	<el-button v-show="buttonshow==2||buttonshow==3" type="text" size="small" @click="visbiForbid1(scope.row)"  v-if="$authorities.ProjectDelete" >删除</el-button>
                
                <!--<el-button v-show="scope.row.status=='启用'" v-if="$authorities.ProjectForbidden" @click="visbiForbid(scope.row)" type="text" size="small">禁用</el-button>
                <el-button v-show="scope.row.status!='启用'" v-if="$authorities.ProjectAvailable" @click="visbiForbid1(scope.row)" type="text" size="small">启用</el-button>-->
                <!--<el-button  @click="Relation(scope.row)" v-if="$authorities.ProjectRelevanceCustomer"  type="text" size="small">关联客户</el-button>-->
                <!--<el-button v-if="buttonshow==2||buttonshow==3" @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
              	<el-button type="text" size="small" @click="downClick(scope.row)">下载资质</el-button>-->
              	<el-button v-show="scope.row.oldId" type="text" size="small" @click="goDetail(scope.row.oldId)" v-if="$authorities.ProjectDetailRelevant">原数据详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          :page-size="pageSize"
          layout="total, sizes,prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
    <el-dialog
		  title="提审确认"
		  :visible.sync="dialogVisible"
		  width="30%"
		  >
		  <span>确定当前填写的信息无误，可以提交审核？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="isforbid()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisible1"
		  width="30%"
		  >
		  <span>删除之后，列表将不再展示该数据，确定要删除吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="isactivate()">确 定</el-button>
		  </span>
		</el-dialog>
		<importFile
      ref="importFile"
      :title="'项目信息批量导入'"
      :type="importType"
      @callback="dialogCallback"
    ></importFile>
		<!--<el-dialog title="关联客户" :visible.sync="dialogFormVisible" @close="fromclosse">
		  <el-form :model="form"  ref="ruleForm">
		    <el-form-item label="项目"  required>
		      {{rowName}}
		    </el-form-item>
		    <el-form-item label="客户"  required
		    	 :prop="form.user"
      	:rules="{
            required: true, message: '所属机构组织不能为空', trigger: 'blur'
            }"
		    	>
		      <el-select
			    v-model="form.user"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入"
			    :remote-method="remoteUser">
			    <el-option
			      v-for="item in options3"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			  </el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitLittleForm('ruleForm')">确 定</el-button>
		  </div>
		</el-dialog>-->
		<el-dialog title="指定品牌特殊服务管理" :visible.sync="dialogTableVisible2">
			<div class="d-top">
				<div class="L">
				<p style="padding: 10px;">项目名称：<span>{{dialogProjectName}}</span> <span style="padding-left: 30px;">项目乙方：</span><span>{{dialogProjectYi}}</span></p>
				<p style="color: red;font-size: 12px;">Tip：该项目客户下单时，如订单中包含下列品牌，系统将不再自动分配服务方，需相关工作人员手动进行派单；</p>
				</div>
				<div class="R">
				 <el-button type="primary" @click="addBround()">添加品牌</el-button>
				</div>
			</div>	
		  <el-table :data="gridData" border
          stripe
          height="250">
		    <el-table-column property="brandId" label="品牌ID" align="center"></el-table-column>
		    <el-table-column property="brandNameCN" label="品牌名称" align="center">
		    	<template slot-scope="scope">
              	{{scope.row.brandNameCN}} <span v-if="scope.row.brandNameEN">({{scope.row.brandNameEN}})</span>
          </template>
		    </el-table-column>
		    <el-table-column property="organizationName" label="指定特约供应商" align="center"></el-table-column>
		    <el-table-column
            label="操作"
            width="150px"
            align="center">
            <template slot-scope="scope">
              	<el-button type="text" size="small" @click="getDown(scope.row)">删除</el-button>
            </template>
          </el-table-column>
		  </el-table>
		</el-dialog>
		<el-dialog title="选择需服务的品牌" :visible.sync="dialogFormVisible" @close="serverClose()">
		  <el-form label-width="140px" :model="form" :rules="rules" ref="form">
		  	<el-form-item label="项目名称：">
		      {{dialogProjectName}}
		    </el-form-item>
		    <el-form-item label="项目乙方名称：">
		      {{dialogProjectYi}}
		    </el-form-item>
		    <el-form-item label="选择品牌："  prop="brandId">
		      <el-select
			    v-model="form.brandId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入"
			    :remote-method="remoteUser"
			    >
			    <el-option
			      v-for="item in options3"
			      :key="item.id"
			      :label="item.nameCN"
			      :value="item.id">
			    </el-option>
			  </el-select>
		    </el-form-item>
		    <el-form-item label="选择特约供应商："  prop="organizationId">
		      <el-select
			    v-model="form.organizationId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入"
			    :remote-method="remoteUserSupplier"
			    >
			    <el-option
			      v-for="item in options5"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			  </el-select>
		    </el-form-item> 
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog
		  title="数据锁定提示"
		  :visible.sync="dialogLock"
		  width="30%"
		  >
		  <span>用户【{{account}}-{{acrealName}}】正在编辑该条数据，数据已锁定。</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="dialogLock = false">确 定</el-button>
		   
		  </span>
		</el-dialog>


  </div>
</template>

<script>
	import store from '@/store/store'
	import {
		simpleList,
		projectList,
		availableList,
		draftList,
		pendingReviewList,
		rejectedList,
		forbid,
		activate,
		nameList,
		nameStatusList,
		associatedCustomers,
		associateCustomer,
		organizationListName,
		statusCount,
		submitReview,
		deleteProject,
		designatedBrandList,
		deleteDesignatedBrand,
		brandAuthorizationList,
		createDesignatedBrand,
		findSpecialSupplier,
		editCheck,
	} from '@/api/projectController/projectController'
  import  Butt from '../../common/Button/index'
  import importFile from "@/components/common/module/ImportFile";  
  export default {
    inject:['close'],
    name:'ProjectManage',
    data() {
      return {
      	pageSize:10,
      	announcementTime:[],
      	partyBPrincipalId:'',
      	importType:'Project_Import_Template',
      	account:'',
      	acrealName:'',
      	dialogLock:false,
      	dialogProjectName:'',
      	dialogProjectYi:'',
      	form:{
      		brandId:'',
      		organizationId:'',
      		projectId:'',
      	},
      	rules:{
      		brandId: [{
					required: true,
					message: '请选择品牌',
					trigger: 'change'
				},],
				organizationId: [{
					required: true,
					message: '请选择特约供应商',
					trigger: 'change'
				},],
      	},
      	ListId:null,
      	partyBId:'',//项目乙方id
      	userDataAuthorityId:'',//集团负责人ID
      	rowName:'',
      	rowId:'',
      	dialogFormVisible:false,
      	forbidId:'',
      	activateId:'',
      	downId:"",
      	gridData:[],
      	dialogTableVisible2:false,
      	submitId:'',
      	dialogVisible: false,
      	dialogVisible1: false,
      	buttondatas:[
      	],
      	//总页数
      	pagetotal:null,
      	//供应商id
      	projectNO:'',
      	//简称
      	projectName:'',
    	  //法人
      	cupyMaster:'',
      	//选中状态
      	buttonshow:0,
      	//当前页数
      	currentPage4: 1,
        isShow:true,
        tableData: [
//      {
//      	countSupplierBiz: null,
//					gradeLevel: null,
//					id: null,
//					legalPersonName: null,
//					name: null,
//					shortName: null,
//					socialCreditCode: null,
//					supplierEditingStatus: 1,
//					supplierStatus: null
//      }
],
        options1: [{
          value: null,
          label: '全部'
        }, {
          value: '0',
          label: '商城'
        }, {
          value: '1',
          label: '专柜'
        }, {
          value: '2',
          label: '其他'
        }],
        options4:[],
        options3:[],
        options100:[],
        options2:[],
        options5:[],
        value1:'',
        value2:'',
        deleteId:'',
        ArraignmentId:'',
        StartTime:'',
        EndTime:'',
      }
    },
    computed:{
    	dataListHeight(){
      return this.$store.getters.dataListHeight;
      }
    },
    watch:{
    	buttonshow(a,b){
    		if(a!=0){
    			this.projectNO=''
    		}
    	},
    	announcementTime(a,b){
    		console.log(a)
    		if(a){
					this.StartTime=a[0]
					this.EndTime=a[1]
				}else{
					this.StartTime=''
					this.EndTime=''
				}
    	},
    },
    components:{
    	importFile
    },
    created(){
    	if(this.$route.query.status){
    		this.buttonshow=this.$route.query.status
    	}
    	this.getstatusCount()
    	this.requestData()
    },
     activated(){
			if(this.$route.params.isUpdate){
				this.getstatusCount()
    		this.requestData()
			}
    },
    mounted(){
    	console.log(this.$auth.user.id)
    },
    methods: {
    	query(){
    		this.currentPage4=1
    		this.requestData()
    	},
    	Reset(){
    		this.currentPage4=1
    		this.pageSize=10
    		this.partyBId=''
    		this.partyBPrincipalId=''
    		this.projectNO=''
    		this.projectName=''
    		this.value1=''
    		this.userDataAuthorityId=''
    		this.announcementTime=null
    		this.query()
    	},
		  serverClose(){
		  	this.form.brandId=''
      	this.form.organizationId=''
      	this.options3=[]
      	this.options5=[]
		  },
    	getstatusCount(){
    		statusCount().then(res=>{
    			this.buttondatas=res.data
    		})
    	},
    	requestData(index){
    		let n=index?index:this.buttonshow
    		switch(n.toString()){	
				case '0':
				this.getavailableList()
				  break;
				case '1':
				this.getpendingReviewList()
				  break;
				case '2':
				this.getdraftList()
				  break;
				case '3':
				this.getrejectedList()
				  break;
				}
    	
    	},
    	showDialog(type, row) {
	      this.$refs[type].init(row);
	    },
    	dialogCallback(type) {
	      if (type == "salePrice" || type == "setTag") {
	      } else if (type == "shoppeRelease") {
	        this.$message({
	          type: "success",
	          message: "发布成功，前台已同步更新!"
	        });
	      }
	    },	  
    	downClick(row){
    		this.$router.push({
          name: 'ExamineProject',
          query:{
          	detailId:row.id
          }
        })
    	},
    	header_button_click(index){
    		this.tableData=[]
    		this.buttonshow=index
    		this.getstatusCount()
    		this.requestData(index)
    	},
    	getavailableList(){
    		let a={
    			"startTime":this.StartTime,
    			"endTime":this.EndTime,
    			"partyBPrincipalId":this.partyBPrincipalId,
    			"no": this.projectNO,
				  "name": this.projectName,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "partyBId": this.partyBId,//项目乙方id
				  "type": this.value1,//项目类型
				  "userDataAuthorityId": this.userDataAuthorityId//集团负责人id
    		}
    		availableList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getdraftList(){
    		let a={
    			"startTime":this.StartTime,
    			"endTime":this.EndTime,
    			"partyBPrincipalId":this.partyBPrincipalId,
    			"no": this.projectNO,
				  "name": this.projectName,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "partyBId": this.partyBId,//项目乙方id
				  "type": this.value1,//项目类型
				  "userDataAuthorityId": this.userDataAuthorityId//集团负责人id
    		}
    		draftList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getpendingReviewList(){
    		let a={
    			"startTime":this.StartTime,
    			"endTime":this.EndTime,
    			"partyBPrincipalId":this.partyBPrincipalId,
    			"no": this.projectNO,
				  "name": this.projectName,
				  "pageNum": this.currentPage4,
				  "pageSize":this.pageSize,
				  "partyBId": this.partyBId,//项目乙方id
				  "type": this.value1,//项目类型
				  "userDataAuthorityId": this.userDataAuthorityId//集团负责人id
    		}
    		pendingReviewList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getrejectedList(){
    		let a={
    			"startTime":this.StartTime,
    			"endTime":this.EndTime,
    			"partyBPrincipalId":this.partyBPrincipalId,
    			"no": this.projectNO,
				  "name": this.projectName,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "partyBId": this.partyBId,//项目乙方id
				  "type": this.value1,//项目类型
				  "userDataAuthorityId": this.userDataAuthorityId//集团负责人id
    		}
    		rejectedList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	isService(row){
    		
    		this.dialogProjectName=row.name
      	this.dialogProjectYi=row.partyBName
      	this.ListId=row.id
      	this.getdesignatedBrandList(row.id)
    	},
    	getdesignatedBrandList(id){
    		designatedBrandList(id).then(res=>{
    			this.dialogTableVisible2=true
    			this.gridData=res.data
//  			console.log(this.gridData)
    		}).catch(rej=>{
    			this.gridData=[]
    		})
    	},
    	remoteMethod2(query) {
        if (query !== '') {
          organizationListName({name:query}).then(res=>{
          	this.options2=res.data
          })
        } else {
          this.options2 = [];
        }
      },
    	remoteMethod1(query){
      	 if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
      },
      remoteMethodyi(query){
      	 if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options100=res.data
          })
        } else {
          this.options100 = [];
        }
      },
      
      addBround(){
      	this.dialogFormVisible=true
      	this.form.projectId=this.ListId
      },
      submitForm(f) {
        this.$refs[f].validate((valid) => {
          if (valid) {
            createDesignatedBrand(this.form).then(res=>{
            	if(res.data>0){
            		this.dialogFormVisible=true
            		this.$message({
				          message: '操作成功',
				          type: 'success'
				        });
				        this.dialogFormVisible = false
      	this.getdesignatedBrandList(this.ListId)
            	}
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    	submitLittleForm(formName){
    		this.$refs[formName].validate((valid) => {
          if (valid) {
          	let a={
          		"customerId": this.form.user,
  						"projectId": this.rowId
          	}
          	associateCustomer(a).then(res=>{
          		if(res.data>0){
    					this.$message({
			        message:'关联成功',
			        type: "success",
			       
			      })
    		this.dialogFormVisible=false
    					
    					this.requestData()
    			}else{
    				this.$message({
			        message:'关联失败',
			        type: 'warning',
			        
			      })
    		this.dialogFormVisible=false
    				
    				this.requestData()
    			}
          	})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    	},
    	Relation(row){//关联弹框
    		this.rowName=row.name
    		this.rowId=row.id
    		this.dialogFormVisible=true
    	},
    	fromclosse(){
    		this.rowName=''
    		this.rowId=''
    	},
    	visbiForbid(row){
    		this.dialogVisible=true
    		this.forbidId=row.id
    	},
    	visbiForbid1(row){
    		this.dialogVisible1=true
    		this.activateId=row.id
    	},
    	//项目名称模糊搜索
    	remoteMethod(query) {
        if (query !== '') {
        	if(this.buttonshow==0){
        		nameList({name:query}).then(res=>{
	          	this.options4=res.data
	          })
        	}else{
        		nameStatusList({name:query,status:this.buttonshow}).then(res=>{
	          	this.options4=res.data
	          })
        	}
        } else {
          this.options4 = [];
        }
      },
      //模糊搜索品牌名字
      remoteUser(query){
      	if (query !== '') {
          brandAuthorizationList({name:query}).then(res=>{
          	this.options3=res.data
          })
        }
      },
      remoteUserSupplier(query){
      	if (query !== '') {
          findSpecialSupplier({name:query}).then(res=>{
          	this.options5=res.data
          })
        }
      },
    	//提审
    	isforbid(){
    		submitReview(this.forbidId).then(res=>{
    			this.dialogVisible=false
    			if(res.data>0){
    					this.$message({
			        message:'提审成功',
			        type: "success",
			       
			      })
    					this.getstatusCount()
    					this.requestData()
    			}else{
    				this.$message({
			        message:'提审失败',
			        type: 'warning',
			        
			      })
    				this.getstatusCount()
    				this.requestData()
    			}
    		})
    	},
    	isactivate(){
    		deleteProject(this.activateId).then(res=>{
    			this.dialogVisible1=false
    			if(res.data>0){
    					this.$message({
			        message:'删除成功',
			        type: "success",
			       
			      })
    					this.getstatusCount()
    					this.requestData()
    			}else{
    				this.$message({
			        message:'删除失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    				this.getstatusCount()
    			}
    		})
    	},
    	getDown(row){
    		this.$confirm('删除之后，列表将不再展示该数据，确定要删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
        	deleteDesignatedBrand(row.id).then(res=>{
        		if(res.data>0){
        			this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
		          this.getdesignatedBrandList(this.ListId)
        		}else{
        			this.$message({
		            type: 'info',
		            message: '删除失败'
		          });
        		}
        	})
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
    	},
    	downAll(){
    		this.gridData.map((item,index)=>{
    			window.open(item.filePath)
    		})
    	},
    	//点击删除
    	deleteClick(row){
    		
    		this.deleteId=row.id
    		this.dialogVisible=true
    	},
    	submitClick(row){
    		console.log(row.id)
    		this.submitId=row.id
    		this.dialogVisible1=true
    	},
    	issubmitReviewSupplier(){
    		
    		submitReviewSupplier(this.submitId).then(res=>{
    			console.log(res)
    			if(res.data=='1'){
		    			this.$message({
			        message:'操作成功',
			        type: "success",
			       
			      })
    				this.dialogVisible1 = false
    				this.query()
    			}else if(res.data=='0'){
    				this.$message({
			        message:'操作失败',
			        type: 'warning',
			        
			      })
    				this.dialogVisible1 = false
    			}
    			
    		})
    	},
    	isdeleteClick(){
    		deletebasic(this.deleteId).then(res=>{
    			console.log(res)
    			if(res.data=='1'){
		    			this.$message({
			        message:'删除成功',
			        type: "success",

			      })
    				this.dialogVisible = false
    				this.query()
    			}else if(res.data=='0'){
    				this.$message({
			        message:'删除失败',
			        type: 'warning',
			      })
    				this.dialogVisible = false
    			}

    		})

    	},
    	Arraignment(row){
    		this.$router.push({
          name: 'BasicExamine',
          query:{
          	detailId:row.id
          }
        })
    	},	
    	
    	
      handleClick(row) {
//    	console.log(row.date);
				editCheck(row.id).then(res=>{
					if(res.data){
						this.account=res.data.userName
      	this.acrealName=res.data.realName
      	this.dialogLock=true
					}else{
						this.$router.push({
	          name: 'EditProject',
	          query:{
	          	editId:row.id,
	          	oldId:row.oldId,
	          	status:this.buttonshow
	          }
	        })
					}
				})
      },
      goDetail(id){
      	this.$router.push({
          name: 'DetailProject',
          query:{
          	detailId:id
          }
        })
      },
			goPartner(row){
				this.$router.push({
          name: 'PartnerInformation',
          query:{
          	detailId:row.id,
          	name:row.name,
          	partyBName:row.partyBName
          }
        })
			},
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val
        this.requestData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4=val
        this.requestData()
      },
      showHelp(){
        this.isShow=!this.isShow;
      }

    }
  }
</script>
<style scoped lang="less">
  .projectManageBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .active{
      	background-color: #339999;
      	border-color: #339999;
      	color: #FFFFFF;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        float: right;
        span{
        	cursor: pointer;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
      	background-color: #FFFFFF;
        /*height: 56px;*/
        border-top: 1px solid #e4e4e4;
        /*margin-top: -2px;*/
       .criteria_item{
       	float: left;
       	box-sizing: border-box;
      	padding-left: 20px;
       	.el-input {
          width: 200px;
          height: 40px;
          padding: 5px ;
        }
        .el-select{
        	width: 200px;
          height: 40px;
          padding: 5px ;
        }
       }
        
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      border: 1px solid #e4e4e4;
      clear: both;
      .listBoxTop {
      	background-color: #f3f3f3;
        span {
        	line-height: 50px;
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        display: flex;
		    align-items: center;
		    height: 50px;
        .el-button {
          /*width: 80px;*/
          height: 30px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      padding: 8px 0px;
    }
    .d-top{
    	.L{
    		float: left;
    		
    	}
    	.R{
    		float: right;
    	}
    }
  }
</style>
<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
