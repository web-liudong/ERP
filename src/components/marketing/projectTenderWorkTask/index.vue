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
      		工作事项:
        <el-input
          placeholder="工作事项"
          v-model="workitem"
          clearable>
        </el-input>
      	</div>
      	<div class="criteria_item">
      		 项目名称：
        <el-select
			    v-model="name"
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
      	<div class="criteria_item">
      		  工作负责人账号或姓名：
        <el-select
			    v-model="workUserId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="工作负责人账号或姓名"
			    :remote-method="remoteMethod"
			    >
			    <el-option
			      v-for="item in options4"
			      :key="item.id"
			      :label="item.userName"
			      :value="item.id">
			    </el-option>
			  </el-select> 
      	</div>
      	
       
				
				     
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
        	<!--<router-link to="/marketing/projectTender/addProjectTender" target="_blank" v-if="$authorities.UserCreate||$authorities.UserUpdate">
                <el-button size="small" icon="el-icon-plus">添加</el-button>
          </router-link>-->

        </div>
        <el-table
          :data="tableData"
          border
          stripe
          :max-height="dataListHeight"
          style="width: 100%"
          size="small">
          <el-table-column
            prop="id"
            label="工作事项ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="workItem"
            label="工作事项"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectUserName"
            label="项目负责人"
            align="center">
           
          </el-table-column>
          <el-table-column
            prop="workUserName"
            label="工作负责人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectStartTime"
            label="开标时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="workStartTime"
            label="工作开始时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="workEndTime"
            label="工作结束时间"
            align="center">
          </el-table-column>
          
         	
         	<el-table-column
            :label="buttonshow==0?'操作':'备注'"
            align="center"
            >
            <template slot-scope="scope">
                <el-button  v-if="buttonshow==0" @click="visbiForbid(scope.row)" type="text" size="small">完成</el-button>
                <span  v-if="buttonshow==1">{{scope.row.remark}}</span>
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
    <el-dialog title="项目投标结果" :visible.sync="dialogfromTableVisible">
			<div class="d-top">
				<div class="L">
				<p style="padding: 10px;">项目名称：<span>{{formtableData.tenderProjectName}}</span> </p>
				<p style="padding: 10px;">投标情况：
					<el-radio-group v-model="formtableData.tenderProjectResultTenderSituation">
				    <el-radio label="WIN_TENDER">中标</el-radio>
				    <el-radio label="SUBSTITUTE">中标（替补）</el-radio>
				    <el-radio label="LOSE_TENDER">未中标</el-radio>
				    <el-radio label="NON_TENDER ">不投标</el-radio>
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
		  		<th style="width: 30%;">其他中标公司：</th>
		  		<th style="width: 30%;">中标情况：</th>
		  		<th style="width: 30%;">备注：</th>
		  	</tr>	
		  </table>
		  <div id="" style="height: 300px;overflow: auto;">
		  	<table border="0" cellspacing="0" cellpadding="0" style="width: 100%;" class="projectTender_table">
		  	<tr v-for="(item,index) in formtableData.tenderProjectResultDetails">
		  		<td>
		  			<el-checkbox v-model="item.checked">{{item.companyName}}</el-checkbox>
		  		</td>
		  		<td>
		  			<el-select v-model="item.tenderProjectResultTenderSituation" placeholder="请选择" size="mini" style="width: 100px;">
					    <el-option label="中标"value="WIN_TENDER"></el-option>
					    <el-option label="中标（替补）"value="SUBSTITUTE"></el-option>
					    <el-option label="未中标"value="LOSE_TENDER"></el-option>
					    <el-option label="不投标"value="NON_TENDER"></el-option>
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
		  			<span v-if="!item.systemDefault" @click="deleteItem(index)">删除</span>
		  			
		  		</td>
		  	</tr>
		  </table>
		  </div>
		  
		  <p>
		  	<a style="cursor: pointer;" @click="dialogFormVisible = true">
		  		添加自定义
		  	</a>
		  </p>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="submitcompletion()">保 存</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="添加中标公司" :visible.sync="dialogFormVisible">
		  <el-form label-width="130px"  :model="form" :rules="rules" ref="form">
		    <el-form-item label="备注"  prop="remark">
		      <el-input  type="textarea" v-model="form.remark" placeholder="字数长度1~100以内"  :autosize="{ minRows: 3}"></el-input>
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
		simpleList,
		listName,
	} from '@/api/userService'
	import {
		worktaskStatusCount,
		listTitle,//项目名称模糊搜索
		processingList,//进行中
		completedList,//已完成
		tenderResult,//获取投标结果
		completion,//结果提交
		worktaskProcessingList,
		worktaskCompletedList,
		workCompletion//工作任务完成
	} from '@/api/marketing-service/projectTender.js'
  export default {
    inject:['close'],
    name: 'ProjectTenderWorkTask',
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
      	workUserId:'',
      	workitem:'',
      	name:'',
      	projectId:'',
      	form:{remark:''},
      	rules:{
      		remark: [{ required: false,trigger: 'blur'},],
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
      	
      	
      	//总页数
      	pagetotal:null,
      	
      	
    	  
      	//选中状态
      	buttonshow:0,
      	//当前页数
      	currentPage4: 1,
        isShow:true,
        tableData: [],
       	pageSize:10,
        
      }
    },
    computed:{
    	dataListHeight(){
      return this.$store.getters.dataListHeight;
   	 }
    },
    created(){
    	this.getCount()
//  	this.getheader()
    	this.requestData()
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
    			
    		})
    	},
    	submitForm(f) {
        this.$refs[f].validate((valid) => {
          if (valid) {
          	this.dialogFormVisible=false
          	workCompletion(this.projectId,this.form).then(res=>{
          		this.$message({
			        message:'操作成功',
			        type: "success",
			      })
          		this.getCount()
    					this.requestData()
          	})
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
				  this.comstartDate=''
				  this.currentPage4=1
				  this.pageSize=10
				  this.name=''
				  this.workitem=''
				  this.workUserId=''
				  this.datesta=null
				  this.query()
    	},
    	//完成
    	visbiForbid(row){
    		this.projectId=row.id
    		this.dialogFormVisible=true
    		
    		
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
    		worktaskStatusCount().then(res=>{
    			this.headerData=res.data
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
				  "startDate": this.comstartDate,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "nameId": this.name,
				  "workItem": this.workitem,
				  "workUserId": this.workUserId
				}
    		
    		worktaskCompletedList(data).then(res=>{
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
				  "startDate": this.comstartDate,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "nameId": this.name,
				  "workItem": this.workitem,
				  "workUserId": this.workUserId
				}
    		worktaskProcessingList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
      handleClick(row) {
//    	console.log(row.date);
      	const { href } = this.$router.resolve({
          name: 'Edituser',
          query:{
          	editId:row.id
          }
        })
        window.open(href, '_blank')

      },


      goDetail(row){
      	const { href } = this.$router.resolve({
          name: 'ProjectTenderDetail',
          query:{
          	detailId:row.id
          }
        })
        window.open(href, '_blank')
      },
      goUpdataDetail(row){
      	const { href } = this.$router.resolve({
          name: 'BasicUpdata',
          query:{
          	detailId:row.id
          }
        })
        window.open(href, '_blank')
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
        width: 160px;
        height: 30px;
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