<template>
  <div class="userBox returnOrderBox">
    <div class="buttonBox">
      <el-button v-for="(item,index) in headerData" :key="item.tenderProjectStatus" size="small":class="{ active: buttonshow==index }" @click="header_button_click(index)">{{item.tenderProjectStatusName}}（{{item.countNum}}）</el-button>
      
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
      	<div class="criteria_item">
      		项目编号:
	        <el-input
	          placeholder="项目编号"
	          v-model="userID"
	          type="number"
	          clearable>
	        </el-input>
      	</div>
      	<div class="criteria_item">
      		项目名称：
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
      		开标时间范围:
						<el-date-picker
							style="margin: 5px;"
				      v-model="datesta"
				      type="daterange"
				      value-format="yyyy-MM-dd"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
		    		</el-date-picker>
      	</div>
      	<div class="criteria_item" v-if="buttonshow==1">
      		投标结果:
	        <el-select v-model="status" placeholder="投标结果">
	          <el-option label="全部"value="null"></el-option>
	          <el-option label="中标"value="WIN_TENDER"></el-option>
				    <el-option label="中标（替补）"value="SUBSTITUTE"></el-option>
				    <el-option label="未中标"value="LOSE_TENDER"></el-option>
				    <el-option label="不投标"value="NON_TENDER"></el-option>
	        </el-select>
      	</div>
        	
				
    		
        
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
        	<router-link to="/marketing/projectTender/addProjectTender"  v-if="$authorities.ProjectTenderCreate">
                <div class="operation_btn" ><i class="iconfont iconzengjia"></i>添加</div>
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
            prop="customerCompany"
            label="客户单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectStartTime"
            label="开标时间"
            align="center">
           
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="负责部门"
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectUserName"
            label="项目负责人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="tenderProjectStatusName"
            label="项目状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="tenderSituation"
            label="投标情况"
            align="center">
            
          </el-table-column>
          
          <el-table-column
            label="操作"
            width="230px"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small"  @click="goDetail(scope.row)" v-if="$authorities.ProjectTenderDetail">详情</el-button>
                <el-button   @click="handleClick(scope.row)" type="text" size="small" v-if="$authorities.ProjectTenderUpdate">编辑</el-button>
                <el-button v-show="buttonshow==0"  @click="visbiForbid(scope.row)" type="text" size="small" v-if="$authorities.ProjectTenderOverRelevant">完成</el-button>
                <el-button v-show="buttonshow==1"  @click="visbiForbid(scope.row)" type="text" size="small" v-if="$authorities.ProjectTenderOverRelevant">投标结果</el-button>
            </template>
          </el-table-column>
        </el-table>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          :current-page="currentPage4"
          :page-size="pageSize"
          layout="total, sizes,prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
    <el-dialog title="项目投标结果" :visible.sync="dialogfromTableVisible" width="720px">
			<div class="d-top">
				<div class="L">
				<p style="padding: 10px;">项目名称：<span>{{formtableData.tenderProjectName}}</span> </p>
				<p style="padding: 10px;">投标情况：
					<el-radio-group v-model="formtableData.tenderProjectResultTenderSituation">
				    <el-radio label="WIN_TENDER">中标</el-radio>
				    <el-radio label="SUBSTITUTE">中标（替补）</el-radio>
				    <el-radio label="LOSE_TENDER">未中标</el-radio>
				    <el-radio label="NON_TENDER">不投标</el-radio>
				  </el-radio-group>
				</p>
				<p style="padding: 10px;">备注：
					<el-input
          placeholder="字数长度1~500"
          v-model="formtableData.remark"
          clearable
          style="width: 300px;"
          >
        </el-input>
				</p>
				</div>
			</div>	
		  
		  <table border="0" cellspacing="0" cellpadding="0" style="width: 100%;" class="projectTender_table">
		  	<tr style="text-align: left;">
		  		<th style="width: 22%;">其他中标公司：</th>
		  		<th style="width: 18%;">中标情况：</th>
		  		<th style="width: 30%;">备注：</th>
		  	</tr>	
		  </table>
		  <div id="" style="height: 300px;overflow: auto;">
		  	<table border="0" cellspacing="0" cellpadding="0" style="width: 100%;" class="projectTender_table">
		  	<tr v-for="(item,index) in formtableData.tenderProjectResultDetails">
		  		<td>
		  			<el-checkbox v-model="item.checked" style="padding-left: 30px;">{{item.companyName}}</el-checkbox>
		  		</td>
		  		<td>
		  			<el-select v-model="item.tenderProjectResultTenderSituation" placeholder="请选择" size="mini" style="width: 100px;">
					    <el-option label="中标"value="WIN_TENDER"></el-option>
					    <el-option label="中标（替补）"value="SUBSTITUTE"></el-option>
  					</el-select>
		  		</td>
		  		<td>
		  			<el-input
		          placeholder="字数长度1~500"
		          v-model="item.remark"
		          size="mini"
		          >
		        </el-input>
		  		</td>
		  		<td>
		  			<span >&nbsp;</span>
		  			<el-button type="text" v-if="!item.systemDefault" @click="deleteItem(index)" >删除</el-button>
		  			
		  		</td>
		  	</tr>
		  </table>
		  </div>
		  
		  <p>
		  	<el-button type="text" @click="dialogFormVisible = true" ><i class="el-icon-plus"></i>  添加自定义</el-button>
		  </p>
		  <span slot="footer" class="dialog-footer" >
		  	<div id="" style="text-align: center;">
		  		<el-button type="primary" @click="submitcompletion()">保 存</el-button>
		  	</div>
		    
		  </span>
		</el-dialog>
		<el-dialog title="添加中标公司" :visible.sync="dialogFormVisible">
		  <el-form label-width="130px"  :model="form" :rules="rules" ref="form">
		    <el-form-item label="公司名称"  prop="name">
		      <el-input v-model="form.name" placeholder="字数长度1~10以内" style="width: 300px;"></el-input>
		    </el-form-item>  
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
		  </div>
		</el-dialog>
		
		


  </div>
</template>

<script>
	import store from '@/store/store'
	import {
		inplaceCount,
		quitCount,
		inplaceList,
		quitList,
		forbid,
		enable,
		simpleList,
		transfer,
		auditor,
		leave,
		listName,
		groupRoles,
		userRole,
		submituserRole
	} from '@/api/userService'
	import {
		statusCount,
		listTitle,//项目名称模糊搜索
		processingList,//进行中
		completedList,//已完成
		tenderResult,//获取投标结果
		completion,//结果提交
	} from '@/api/marketing-service/projectTender.js'
  export default {
    inject:['close'],
    name: 'ProjectTender',
    data() {
    	var projectNameRule= (rule, value, callback) => {
        if (value == '') {
          callback(new Error('公司名称不能为空'));
        }else{
        	let abc=this.formtableData.tenderProjectResultDetails.filter(res=>res.companyName==value)
        	if(abc[0]){
        		callback(new Error('公司名称重复'));
        	}else{
        		callback()
        	}
        }
      };
      return {
      	pageSize:10,
      	projectId:'',
      	form:{name:''},
      	rules:{
      		name: [{ required: true, validator: projectNameRule,trigger: 'blur'},],
      	},
      	dialogFormVisible:false,
      	formtableData:{},
      	dialogProjectName:'',
      	dialogfromTableVisible:false,
      	comstartDate:'',
      	comendDate:'',
      	datesta:[],
      	partyBId:'',
      	headerData:[],
      	defaulttree:[],
      	setupId:'',
				data2: [],      	
      	move:{
      		"userDataAuthorityTypes": [],
				  "userIdFrom": 0,
				  "userIdTo": ''
      	},
      	isLeafarr:[],
      	cities:[],
      	checkAll: false,
				isIndeterminate: true,
      	input1:'',
      	options4:[],
      	options3:[],
      	options2:[],
      	userIdTo:'',
      	enableId:'',
				forbidId:'',
				leaveId:'',
				realName:'',
				status:'',
				userID:'',
				departmentId:'',
      	inplaceNum:'',
      	quitNum:'',
      	downId:"",
      	gridData:[],
      	dialogTableVisible2:false,
      	submitId:'',
      	visibleTree:false,
      	visibleTree1:false,
      	dialogVisible: false,
      	dialogVisible1: false,
      	dialogVisible2: false,
      	buttondatas:[
//    		{name:'可用',countNum:500,id:0},
//    		{name:'待审核',countNum:500,id:1},
//    		{name:'草稿',countNum:500,id:2},
//    		{name:'已驳回',countNum:500,id:3}
      	],
      	defaultProps: {
				children: 'roles',
				label: 'name'
			},
      	//总页数
      	pagetotal:null,
      	//供应商id
      	supplerID:'',
      	//简称
      	cupyName:'',
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
          value: 'PROCESSING',
          label: '可用'
        },  {
          value: 'PROCESSING',
          label: '可用'
        }, {
          value: 'PROCESSING',
          label: '可用'
        },{
          value: 'COMPLETION',
          label: '禁用'
        }],
        
        value1:'',
        value2:'',
        deleteId:'',
      }
    },
    computed:{
    	dataListHeight(){
      	return this.$store.getters.dataListHeight;
      }
    },
    created(){
    	this.getCount()
    	this.requestData()
    },
    activated(){
			if(this.$route.params.isUpdate){
				this.getCount()
    		this.requestData()
			}
    },
    watch:{
    	datesta(a,b){
    		if(a){
    		this.comstartDate=a[0]
    		this.comendDate=a[1]
    		}else{
    			this.comstartDate=''
    			this.comendDate=''
    		}
    		
    	}
    },
    methods: {
    	deleteItem(index){
    		this.formtableData.tenderProjectResultDetails.splice(index,1)
    	},
    	submitcompletion(){
    		this.dialogfromTableVisible=false
    		completion(this.projectId,this.formtableData).then(res=>{
    				this.$message({
			        message:'操作成功',
			        type: "success",
			       
			      })
    					this.getCount()
    	this.requestData()
    		})
    	},
    	submitForm(f) {
        this.$refs[f].validate((valid) => {
          if (valid) {
          	this.dialogFormVisible=false
          	this.pushData()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    	pushData(){
    		let a={
    			checked:false,
    			companyName:this.form.name,
    			remark:'',
    			systemDefault:false,
    			tenderProjectResultTenderSituation:'WIN_TENDER',
    		}
    		this.formtableData.tenderProjectResultDetails.push(a)
    	},
    	query(){
    		this.requestData()
    	},
    	Reset(){
    		 	this.comendDate=''
				 	this.userID=''
				  this.partyBId=''
				  this.comstartDate=''
				  this.status=''
				  this.currentPage4=1
				  this.pageSize=10
				  this.datesta=null
				  this.query()
    	},
    	treedialog(){
    		this.visibleTree1=false
    		
    	},
    	gettreeId(id){
    		userRole(id).then(res=>{
    			if(res.data[0]){
    				this.defaulttree=res.data.map(item=>item.id)
    				this.visibleTree1=true
	    			setTimeout(()=>{
	    				
	    				this.getnode()
	    			},30)
    			}else{
    				this.defaulttree=[]
    				console.log(this.defaulttree)
    				this.visibleTree1=true
    				setTimeout(()=>{
    					
	    				this.getnode()
	    			},30)
    			}
    			
    			
    		})
    	},
    	clickSetup(row){
    		this.visibleTree=true
    		
    		this.setupId=row.id
    		this.gettreeId(row.id)
    	},
    	submitisId(){
    		let a={
    			"roleIds": this.isLeafarr,
  				"userId": this.setupId
    		}
    		submituserRole(this.setupId,a).then(res=>{
    			this.visibleTree=false
    			if(res.data>0){
    					this.$message({
			        message:'操作成功',
			        type: "success",
			       
			      })
    					this.getCount()
    					this.requestData()
    			}else{
    				this.$message({
			        message:'操作失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	isgetTreeAll(){
				groupRoles().then(res=>{
					let a=res.data
					a.map((item,index)=>{
						item.id='nnnnnmmmmm'+item.id
					})
					this.data2=a
					this.$nextTick().then(()=>{
						this.getnode()	
					})
				})
			},
    	getnode(data) {
				let idArr = this.$refs.tree.getCheckedKeys()
				let idArrLeaf = this.$refs.tree.getCheckedKeys(true)
				this.isLeafarr=idArrLeaf.filter(item=>!item.toString().includes('nnnnnmmmmm'))			
				this.$refs.tree2.filter(idArr);
			},
    	filterNode(value, data) {
			if(!value) return true;
			return value.includes(data.id);

			},
    	//完成
    	visbiForbid(row){
    		this.projectId=row.id
    		this.dialogfromTableVisible=true
    		tenderResult(row.id).then(res=>{
    			this.formtableData=res.data
    		})
    		
    	},
    	visbienable(row){
    		this.dialogVisible1=true
    		this.enableId=row.id
    	},
    	visbileave(row){
    		this.dialogVisible2=true
    		this.leaveId=row.id
    	},
    	isforbid(){
    		forbid(this.forbidId).then(res=>{
    			this.dialogVisible=false
    			if(res.data>0){
    					this.$message({
			        message:'禁用成功',
			        type: "success",
			       
			      })
    					this.requestData()
    			}else{
    				this.$message({
			        message:'禁用失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	isleave(){
    		leave(this.leaveId).then(res=>{
    			this.dialogVisible2=false
    			if(res.data>0){
    					this.$message({
			        message:'操作成功',
			        type: "success",
			       
			      })
    					this.getCount()
    					this.requestData()
    			}else{
    				this.$message({
			        message:'操作失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	isenable(){
    		enable(this.enableId).then(res=>{
    			this.dialogVisible1=false
    			if(res.data>0){
    					this.$message({
			        message:'启用成功',
			        type: "success",
			       
			      })
    					this.requestData()
    			}else{
    				this.$message({
			        message:'启用失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	getauditor(id){
    		auditor(id).then(res=>{
    			this.cities=res.data
    		})
    	},
    	isauditor(){
    		transfer(this.move).then(res=>{
    			this.dialogTableVisible2=false
    			if(res.data>0){
    					this.$message({
			        message:'移交成功',
			        type: "success",
			       
			      })
    					this.requestData()
    			}else{
    				this.$message({
			        message:'移交失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	//模糊搜索
    	remoteMethod(query) {
        if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
      remoteMethod1(query){
    		if (query !== '') {
          listName({name:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
    	},
    	remoteMethod2(query) {
        if (query !== '') {
          listTitle({name:query}).then(res=>{
          	this.options2=res.data
          })
        } else {
          this.options2 = [];
        }
      },
    	//查询在职和离职人数
    	getCount(){
    		statusCount().then(res=>{
    			this.headerData=res.data
    		})
    	},
    	dataClick(row){
    		this.input1=row.userName+'-'+row.realName
    		this.move.userIdFrom=row.id
    		this.dialogTableVisible2=true
    		this.getauditor(row.id)
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
    				this.getheader()
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
    	handleCheckAllChange(val) {
			this.move.userDataAuthorityTypes = val ? this.cities.map(item => item.dataAuthorityType) : [];
			this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			},
    	getheader(){
    		count().then(res=>{
    			this.buttondatas=res.data
    		})
    	},
    	header_button_click(index){
    	 	this.currentPage4=1
    	 	this.buttonshow=index
    		this.requestData(index)
    	},
    	requestData(index){
    		let n=index?index:this.buttonshow
    		switch(n){
    			case 0:
    			this.quit()
    			break;
    			case 1:
    				this.inplace()
    			break;
    			
    		}
    	},
    	
    	
    	//已完成
    	inplace(){
    		let data={
				 "endDate": this.comendDate,
				  "no": this.userID,
				  "nameId": this.partyBId,
				  "startDate": this.comstartDate,
				  "tenderSituation": this.status,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				}
    		completedList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
//  			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
    	//进行中
    	quit(){
    		let data={
				  "endDate": this.comendDate,
				  "no": this.userID,
				  "nameId": this.partyBId,
				  "startDate": this.comstartDate,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				}
    		processingList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
      handleClick(row) {
      	this.$router.push({
          name: 'EditProjectTender',
          query:{
          	editId:row.id
          }
        })
      },


      goDetail(row){
      	this.$router.push({
          name: 'ProjectTenderDetail',
          query:{
          	detailId:row.id
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
.projectTender_table{
	td{
		padding: 5px 0px;
	}
}
  .userBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .el-button {
      }
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
    }
    .block {
      padding: 8px 0px;
    }
  }
</style>
<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
