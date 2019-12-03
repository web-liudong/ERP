<template>
  <div class="PresentationPriceList returnOrderBox">
    <div class="buttonBox">
      <el-button size="small" v-for="(buttondata,index) in buttondatas" :key="index" :class="{ active: buttonshow==index }" @click="header_button_click(index)">{{buttondata.statusName}}（{{buttondata.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
		  <el-button size="small" class="w80 h40" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom clearfix" v-if="isShow">
      	<div class="row_chunk">
      		<div class="chunk">
      			<span>报备信息ID:</span>
		        <el-input
		          placeholder="报备信息ID:"
		          v-model="queryData.reportPreparedNo"
		          clearable>
		        </el-input>
      		</div>
      		<div class="chunk">
      			<span>外部竞价编号:</span>
		        <el-input
		          placeholder="外部竞价编号"
		          v-model="queryData.exteriorNo"
		          clearable>
		        </el-input>
      		</div>
      		<div class="chunk">
      			<span>服务方:</span>
		        <el-select
					    v-model="queryData.serverId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod2"
					    style="padding: 5px;"
					    >
					    <el-option
					      v-for="item in options2"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
      		</div>
      		<div class="chunk">
      			<span>创建人:</span>
		        <!--<el-input
		          placeholder="创建人"
		          v-model="queryData.createUserId"
		          clearable>
		        </el-input>-->
		        <el-select
		        	style="padding: 5px;"
					    v-model="queryData.createUserId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="创建人"
					    :remote-method="createUserRemoteMethod">
					    <el-option
					      v-for="item in createUserOptions"
					      :key="item.value"
					      :label="item.userName+'-'+item.realName"
					      :value="item.id">
					    </el-option>
					  </el-select>
      		</div>
      	</div>
      	<div class="row_chunk">
      		<div class="chunk">
      			<span>项目名称:</span>
		        <el-select
		        	style="padding: 5px;"
					    v-model="queryData.projectId"
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
					      :value="item.id">
					    </el-option>
					  </el-select>
      		</div>
      		<div class="chunk">
      			<span>客户:</span>
		        <el-input
		          placeholder="客户"
		          v-model="queryData.customerNameCustomize"
		          clearable>
		        </el-input>
      		</div>
      		<div class="chunk">
      			<span>采购人:</span>
		        <el-input
		          placeholder="采购人"
		          v-model="queryData.purchaserName"
		          clearable>
		        </el-input>
      		</div>
      		<div class="chunk">
      			<!--<span>报备状态:</span>
		        <el-select v-model="queryData.reportPreparedNo" placeholder="报备状态" style="padding: 5px;">
		          <el-option label="全部" value=""></el-option>
		          <el-option label="未匹配" value="1"></el-option>
		          <el-option label="匹配异常" value="2"></el-option>
		        </el-select>-->
      		</div>
      	</div>
      	<div class="row_chunk">
      		<div class="chunk_five">
      			<span>收货地址:</span>
      			<div class="address">
      				<div class="address_chunk">
      					<el-select v-model="queryData.provinceId" filterable  placeholder="省" style="width: 100%;padding: 5px;" @change="o1change">
						      <el-option 
						      	v-for="o in o1"
						      	:key="o.id"
						      	:label="o.name" 
						      	:value="o.id">	      	
						      </el-option>	      
						    </el-select>
      				</div>
      				<div class="address_chunk">
      					<el-select v-model="queryData.cityId" filterable placeholder="市" style="width: 100%;padding: 5px;" @change="o2change">
						      <el-option 
						      	v-for="o in o2"
						      	:key="o.id"
						      	:label="o.name" 
						      	:value="o.id">	      	
						      </el-option>
						    </el-select>
      				</div>
      				<div class="address_chunk">
      					<el-select v-model="queryData.countyId" filterable placeholder="县/区" style="width: 100%;padding: 5px;">
						      <el-option 
						      	v-for="o in o3"
						      	:key="o.id"
						      	:label="o.name" 
						      	:value="o.id">	      	
						      </el-option>
						    </el-select>
      				</div>
      			</div>
      		</div>
      		<div class="chunk_five">
      			<span>时间:</span>
		        <div class="address">
      				<div class="address_chunk">
      					<el-select v-model="value1" placeholder="时间" style="padding: 5px;">
				          <el-option label="创建时间" value=""></el-option>
				        </el-select>
      				</div>
      				<div class="address_chunk">
      					<el-date-picker
						      v-model="queryData.startCreateTime"
						      value-format="yyyy-MM-dd HH:mm:ss"
						      type="datetime"
						      placeholder="选择日期时间"
						      style="width: 100%;padding: 5px 0;">
						    </el-date-picker>
      				</div>
      				<i>至</i>
      				<div class="address_chunk">
      					<el-date-picker
						      v-model="queryData.endCreateTime"
						      value-format="yyyy-MM-dd HH:mm:ss"
						      type="datetime"
						      placeholder="选择日期时间"
						      style="width: 100%;padding: 5px 0;">
						    </el-date-picker>
      				</div>
      			</div>
      		</div>
      	</div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					<!--<el-button size="small" @click="showDialog('importFile')">
						<i class="icon-Icon-daoru iconfont button-head-icon" style="font-size: 15px;line-height: 12px;"></i> 
						<span style="font-size: 12px;line-height: 12px;margin-left: 5px;color: #606266;">导入</span>
					</el-button>-->
					<!--<div class="white-btn fun-btn" @click="showDialog('importFile')" v-if="$authorities.ProjectImportRelevant"><i class="iconfont icon-Icon-daoru"></i>导入</div>
					<router-link to="/customer/projectManage/importrecord" target="_blank" v-if="$authorities.ProjectImportRelevant">
                <div class="white-btn fun-btn"><i class="iconfont icon-chakandaorujilu"></i>导入记录</div>
          </router-link>-->
          
        	<router-link to="/biddingPrice/biddingBackups/create">
                <!--<div class="white-btn fun-btn" v-if="$authorities.biddingBackupsCreate"><i class="iconfont iconzengjia"></i>添加</div>-->
                <div class="operation_btn" v-if="$authorities.biddingBackupsCreate"><i class="iconfont iconzengjia"></i>添加</div>
          </router-link>
					
        </div>
        
      </div>
      <el-table
          :data="tableData"
          border
          stripe
          :max-height="dataListHeight"
          style="width: 100%"
          size="small">
          <el-table-column
            prop="reportPreparedNo"
            fixed="left"
            label="报备信息ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="exteriorNo"
            label="外部竞价编号"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width='88'
            align="center">
          </el-table-column>
          <el-table-column
            prop="serverName"
            label="服务方"
            align="center">
          </el-table-column>
          
          <el-table-column
            prop="createUserName"
            label="创建人"
            align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="showDialog('showOrderInfo',{'title':'人员信息','type':'userInfo', 'id':scope.row.createUserId})">
                	{{scope.row.createUserName}}
                </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="customerNameCustomize"
            label="客户"
            align="center">
          </el-table-column>
          <el-table-column
            prop="purchaserName"
            label="采购人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="purchaserPhone"
            label="采购人联系方式"
            align="center">
          </el-table-column>
          <el-table-column
            prop="detailAddressLine"
            label="收货地址"
            min-width="150"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="priceQuote"
            label="报价"
            align="center">
          </el-table-column>
          <el-table-column
            label="报备状态"
            align="center">
            <template slot-scope="scope">
            	<span style="color: red;font-size: 12px;" v-if="scope.row.status==1">{{scope.row.statusName}}</span>
            	<span style="font-size: 12px;" v-else>{{scope.row.statusName}}</span><br/>
              <router-link v-show="scope.row.status==1||scope.row.status==2" :to="{name:'biddingPriceMessageDetail',query:{id:scope.row.biddingId}}">
                <el-button type="text">查看竞价详情</el-button>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="130px"
            fixed="right"
            align="center">
            <template slot-scope="scope">
                <el-button  v-show="buttonshow==0" @click="handleClick(scope.row)" v-if="$authorities.biddingBackupsEdit" type="text" size="small">编辑</el-button>
              	<el-button v-show="buttonshow==0||buttonshow==1" type="text" size="small" @click="deleteClick(scope.row)"  v-if="$authorities.biddingBackupsCancel" >取消</el-button>
              	<el-button  type="text" size="small" v-if="$authorities.biddingBackupsDetail" @click="goDetail(scope.row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.pageNum"
          :page-size="queryData.pageSize"
		   :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes,prev, pager, next, jumper"
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
		  title="取消提示"
		  :visible.sync="dialogVisibleDelete"
		  width="30%"
		  >
		  <span>确定要取消该条竞价信息吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisibleDelete = false">取 消</el-button>
		    <el-button type="primary" @click="isdeleteClick()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="变更提示"
		  :visible.sync="dialogVisibleChangeTips"
		  width="30%"
		  >
		  <span>当前报备信息状态已发生变化，请刷新数据获取最新状态。</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="query(),dialogVisibleChangeTips=false">确 定</el-button>
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
		    <el-table-column property="brandNameCN" label="品牌名称" align="center"></el-table-column>
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
		<el-dialog title="选择需服务的品牌" :visible.sync="dialogFormVisible">
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
		<showOrderInfo ref="showOrderInfo"></showOrderInfo>

  </div>
</template>

<script>
	import showOrderInfo from "./child/show_order_info";
	import store from '@/store/store'
	import { provinces_based_id, subs, } from "@/api/basicSupplier"
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
		associatedCustomers,
		associateCustomer,
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
	import {
		organizationListName
	} from '@/api/payment/customerPayment'
	import {
		getStatusCount,
		biddingListNoMatch,
		biddingListMatchErr,
		biddingListAlreadyMatch,
		biddingListDelete,
		biddingDelete
	} from '@/api/biddingPrice/biddingPrice'
	
  import importFile from "@/components/common/module/ImportFile";  
  export default {
	inject:['reload'],
	name:'biddingBackupsList',
    data() {
      return {
      	queryData:{
      		"provinceId": '',//省id
    		 	"cityId": '',//市id
				  "countyId": '',//区县id
				  "createUserName": "",//创建人
				  "createUserId":null,
				  "customerNameCustomize": "",//客户名称
				  "endCreateTime": "",//时间-结束
				  "exteriorNo": "",//外部竞价编号
				  "pageNum": 1,
				  "pageSize": 10,
				  "projectId": '',//项目id
				  "serverId": '',//服务方id
				  "purchaserName": "",//采购人
				  "reportPreparedNo": '',//报备信息ID
				  "startCreateTime": ""//时间-开始
      	},
      	importType:'Project_Import_Template',
      	account:'',
      	acrealName:'',
      	dialogLock:false,
      	dialogProjectName:'',
      	dialogProjectYi:'',
      	o1:[],
      	o2:[],
      	o3:[],
      	form:{
      		brandId:'',
      		organizationId:'',
      		projectId:'',
      	},
      	rules:{
      		brandId: [{
					required: true,
					message: '请选择品牌',
					trigger: 'blur'
				},],
				organizationId: [{
					required: true,
					message: '请选择特约供应商',
					trigger: 'blur'
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
      	dialogVisibleChangeTips:false,
      	dialogVisible: false,
      	dialogVisibleDelete:false,
      	dialogVisible1: false,
      	buttondatas:[
      	],
      	//总页数
      	pagetotal:null,
      	//供应商id
      	projectID:'',
      	//简称
      	projectName:'',
    	  //法人
      	cupyMaster:'',
      	//选中状态
      	buttonshow:0,
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
        options2:[],
        options5:[],
        createUserOptions:[],
        value1:'',
        value2:'',
        deleteId:'',
        ArraignmentId:'',
      }
    },
    computed:{
    	dataListHeight(){
      return this.$store.getters.dataListHeight;
   		}
    },
    components:{
    	importFile,showOrderInfo
    },
    created(){
    	provinces_based_id().then(res => {
			this.o1=res.data
		})
    	if(this.$route.query.status){
    		this.buttonshow=this.$route.query.status
    	}
    	this.getstatusCount()
    	this.requestData()
	},
	
    mounted(){
    	console.log(this.$auth.user.id)
	},
	 activated(){
		if(this.$route.params.isUpdate){
			this.getstatusCount()
    		this.requestData()
		}
	},
    methods: {
    	showDialog(type, row) {
      this.$refs[type].init(row, true);
    	},
    	o1change(data){
					this.queryData.cityId=''
					this.queryData.countyId=''
				subs(data).then(res=>{
					this.o2=res.data
				})
			},
			o2change(data){
				this.queryData.countyId=''
				subs(data).then(res=>{
					this.o3=res.data
				})
			},
    	query(){
    		this.queryData.pageNum=1
    		this.requestData()
		},
		reset(){
			let queryData={
      			"provinceId": '',//省id
    		 	"cityId": '',//市id
				"countyId": '',//区县id
				"createUserName": "",//创建人
				"createUserId":null,
				"customerNameCustomize": "",//客户名称
				"endCreateTime": "",//时间-结束
				"exteriorNo": "",//外部竞价编号
				"pageNum": this.queryData.pageNum,
				"pageSize": this.queryData.pageSize,
				"projectId": '',//项目id
				"serverId": '',//服务方id
				"purchaserName": "",//采购人
				"reportPreparedNo": '',//报备信息ID
				"startCreateTime": ""//时间-开始
			  };
			this.queryData=queryData;
			this.requestData();
    	},
    	getstatusCount(){
    		getStatusCount().then(res=>{
    			this.buttondatas=res.data
    		})
    	},
    	
    	requestData(index){
    		let n=index?index:this.buttonshow
    		switch(n.toString()){	
				case '0':
				this.getbiddingListNoMatch()
				  break;
				case '1':
				this.getbiddingListMatchErr()
				  break;
				case '2':
				this.getbiddingListAlreadyMatch()
				  break;
				case '3':
				this.getbiddingListDelete()
				  break;
				}
    	
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
    		const { href } = this.$router.resolve({
          name: 'ExamineProject',
          query:{
          	detailId:row.id
          }
        })
        window.open(href, '_blank')
    	},
    	offerDown(row){
    		this.$router.push({
        	path:'/biddingPrice/PresentationPriceList/offer',
        	query:{
          	detailId:3
          }
        })
    	},
    	header_button_click(index){
    		this.buttonshow=index
    		this.getstatusCount()
    		this.requestData(index)
    	},
    	getbiddingListNoMatch(){
    		biddingListNoMatch(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getbiddingListMatchErr(){
    		biddingListMatchErr(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getbiddingListAlreadyMatch(){
    		biddingListAlreadyMatch(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getbiddingListDelete(){
    		biddingListDelete(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	isService(row){
    		this.dialogTableVisible2=true
    		this.dialogProjectName=row.name
      	this.dialogProjectYi=row.partyBName
      	this.ListId=row.id
      	this.getdesignatedBrandList(row.id)
    	},
    	getdesignatedBrandList(id){
    		designatedBrandList(id).then(res=>{
    			
    			this.gridData=res.data
    			console.log(this.gridData)
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
    	deleteClick(row){
    		this.deleteId=row.id
    		this.dialogVisibleDelete=true
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
          nameList({name:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
      //创建人模糊搜索
      createUserRemoteMethod(query) {
        if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.createUserOptions=res.data
          })
        } else {
          this.createUserOptions = [];
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
    		biddingDelete(this.deleteId).then(res=>{
    			if(res.data=='1'){
		    			this.$message({
			        message:'删除成功',
			        type: "success",
			      })
    				this.dialogVisibleDelete = false
    				this.query()
    			}else if(res.data=='0'){
    				this.$message({
			        message:'删除失败',
			        type: 'warning',
			      })
    				this.dialogVisibleDelete = false
    			}
    		}).catch(rej=>{
    			
    		})
    	},
    	Arraignment(row){
    		const { href } = this.$router.resolve({
          name: 'BasicExamine',
          query:{
          	detailId:row.id
          }
        })
        window.open(href, '_blank')
    	},	
    	
    	
      handleClick(row) {
      		this.$router.push({path:'/biddingPrice/biddingBackups/edit',query:{editId:row.id}})
      },

			gomo(){
				
				const { href } = this.$router.resolve({
          name: 'MoveReaord',
        })
        window.open(href, '_blank')
			},
      goDetail(id){
        this.$router.push({
        	path:'/biddingPrice/biddingBackups/detail',
        	query:{
          	detailId:id
          }
        })
      },
      handleSizeChange(val) {
		console.log(`每页 ${val} 条`);
		this.queryData.pageSize=val;
		this.requestData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.queryData.pageNum=val
        this.requestData()
      },
      showHelp(){
        this.isShow=!this.isShow;
      }

    }
  }
</script>
<style scoped lang="less">
  .PresentationPriceList {
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
      margin-top: 10px;
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
        /*height: 56px;*/
       background-color: #FFFFFF;
        border-top: 1px solid #e4e4e4;

        /*margin-top: -2px;*/
       	.row_chunk{
       		display: flex;
       		.chunk_five{
       			width: 50%;
       			display: flex;
       			align-items: center;
       			.address{
       				box-sizing: border-box;
       				flex:1;
       				display:flex;
       				align-items: center;
       				.address_chunk{
       					
       				}
       			}
       			span{
       				text-align: right;
       				flex: 0 0 88px;
       			}
       		}
       		.chunk{
       			width: 25%;
       			display: flex;
       			align-items: center;
       			span{
       				text-align: right;
       				flex: 0 0 88px;
       			}
       			
       		}
       	}
        .el-input {
        	max-width: 200px;
					padding: 5px;
        }
        .el-select{
        	max-width: 200px;
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