<template>
  <div class="PresentationPriceList returnOrderBox">
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
      			<span>项目名称:</span>
		        <el-select
		        	style="padding: 5px;min-width: 200px;"
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
      	</div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					<div class="operation_btn"  @click="goLog()" v-if="$authorities.ProjectByTimeSetOperationJournal">操作日志</div> 
					<div class="operation_btn"  @click="handAddTimeSet()" v-if="$authorities.ProjectByTimeSetCreate"><i class="iconfont iconzengjia"></i>添加</div>
        </div>
      </div>
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            type="index"
            width="100"
 						:index="typeIndex"
            label="序号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="所属项目"
            align="center">
          </el-table-column>
          <el-table-column
            label="竞价结束前停止报价的时长"
            align="center">
            <template slot-scope="scope">
            		{{scope.row.time}}分钟
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" v-if="$authorities.ProjectByTimeSetEdit" @click="handEditTimeSet(scope.row)">编辑</el-button>
            		<el-button  type="text" size="small" v-if="$authorities.ProjectByTimeSetDelete" @click="handDeleteTimeSet(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20,30,40,50, 100,500]"
          :current-page="queryData.pageNum"
          :page-size="queryData.pageSize"
          layout="total,sizes,prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>
    </div>
		<el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisible1"
		  width="30%"
		  >
		  <span>删除之后，默认项目报价截止时间等于竞价截止时间确定要删除吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="isDelete()">确 定</el-button>
		  </span>
		</el-dialog>
		
		<el-dialog title="服务方报价截止时间设置" :visible.sync="dialogFormVisible" width="40%">
		  <el-form label-width="80px" :model="form" :rules="rules" ref="form">
		    <el-form-item label="项目："  prop="projectId">
		      <el-select
		        	style="width: 83%;"
					    v-model="form.projectId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="项目名称"
					    :remote-method="remoteMethod3">
					    <el-option
					      v-for="item in options3"
					      :key="item.value"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
		    </el-form-item>
		    <el-form-item label="时长："  prop="time">
		      <el-input v-model="form.time"  placeholder="请输入" type="number" style="width: 83%;">
		      	<template slot="append">分</template>
		      </el-input>
		    </el-form-item> 
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog title="服务方报价截止时间设置" :visible.sync="dialogEditFormVisible" @closed="Dclose()" width="40%">
		  <el-form label-width="80px" :model="eform" :rules="erules" ref="eform">
		    <el-form-item label="项目："  prop="projectId">
		      <el-select
		        	style="width: 83%;"
					    v-model="eform.projectId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="项目名称"
					    :remote-method="remoteMethod2">
					    <el-option
					      v-for="item in options2"
					      :key="item.value"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
		    </el-form-item>
		    <el-form-item label="时长："  prop="time">
		      <el-input v-model="eform.time" type="number" placeholder="请输入" style="width: 83%;">
		      	<template slot="append">分</template>
		      </el-input>
		    </el-form-item> 
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogEditFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submiteForm('eform')">确 定</el-button>
		  </div>
		</el-dialog>
  </div>
</template>

<script>
	import store from '@/store/store'
	import { provinces_based_id, subs, } from "@/api/basicSupplier"
	import {
		nameList,
	} from '@/api/projectController/projectController'
	import {
		addSetUp,
		editSetUp,
		deleteSetUp,
		listSetUp
	} from '@/api/biddingPrice/biddingPrice'
	import {
		organizationListName
	} from '@/api/payment/customerPayment'
  export default {
	inject:['reload'],
	name:'ProjectByTimeSetList',
    data() {
      return {
      	toVoidId:'',
      	importType:'Project_Import_Template',
      	account:'',
      	acrealName:'',
      	dialogLock:false,
      	dialogProjectName:'',
      	dialogProjectYi:'',
      	queryData:{
				  "pageNum": 1,
				  "pageSize": 10,
				  "projectId": null,
      	},
      	o1:[],
      	o2:[],
      	o3:[],
      	form:{
      		time:'',
      		projectId:'',
      	},
      	rules:{
      		projectId: [{
					required: true,
					message: '请选择项目',
					trigger: 'change'
				},],
				time: [{
					required: true,
					message: '请输入时长',
					trigger: 'blur'
				},],
      	},
      	eform:{
      		time:'',
      		projectId:'',
      	},
      	erules:{
      		projectId: [{
					required: true,
					message: '请选择项目',
					trigger: 'change'
				},],
				time: [{
					required: true,
					message: '请输入时长',
					trigger: 'blur'
				},],
      	},
      	ListId:null,
      	rowId:'',
      	dialogFormVisible:false,
      	dialogEditFormVisible:false,
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
      	projectID:'',
      	//简称
      	projectName:'',
    	  //法人
      	cupyMaster:'',
      	//选中状态
      	buttonshow:0,
      	//当前页数
        isShow:true,
        tableData: [],
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
        editId:'',
        DeleteID:'',
      }
    },
    computed:{
    },
    components:{
    },
    created(){
    	this.requestData()
    },
    mounted(){
	},
	activated(){
		if(this.$route.params.isUpdate){
			this.requestData()
		}
	},
    methods: {
    	goLog(){
    		this.$router.push('/biddingPrice/projectByTimeSet/log')
    	},
    	handAddTimeSet(){
    		this.dialogFormVisible=true
    		
    		this.form.time=''
    		this.form.projectId=''
    		this.$refs['form'].resetFields();
    		this.form.options3=[]
    	},
    	handEditTimeSet(row){
    		this.editId=row.id
    		this.eform.projectId=row.projectId
    		this.eform.time=row.time
    		this.options2=[{
    			id:row.projectId,
    			name:row.projectName,
    		}]
    		this.dialogEditFormVisible=true	
    	},
    	handDeleteTimeSet(row){
    		this.DeleteID=row.id
    		this.dialogVisible1=true
    	},
    	isDelete(){
    		deleteSetUp(this.DeleteID).then(res=>{
    			this.$message({
				          message: '删除成功',
				          type: 'success'
				        });
				        this.dialogVisible1=false
				        this.query()
    		})
    	},
    	Dclose(){
    		this.options2=[]
    		this.eform.projectId=''
    		this.eform.time=''
    	},
    	typeIndex(index) {
	 			return index + (this.queryData.pageNum - 1) * this.queryData.pageSize + 1;
			},
    	query(){
    		this.queryData.pageNum=1
    		this.requestData()
		},
		reset(){
			this.queryData.projectId=null;
			this.requestData()
   		 },
    	requestData(index){
    		listSetUp(this.queryData).then(res=>{
    			console.log(res)
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	offerDown(row){
    		this.$router.push({
        	path:'/biddingPrice/PresentationPriceList/offer',
        	query:{
          	detailId:3
          }
        })
    	},
      submitForm(f) {
        this.$refs[f].validate((valid) => {
          if (valid) {
          	this.form.time=parseFloat(this.form.time)
            addSetUp(this.form).then(res=>{
            		this.$message({
				          message: '操作成功',
				          type: 'success'
				        });
				        this.dialogFormVisible = false
				        this.query()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submiteForm(f) {
        this.$refs[f].validate((valid) => {
          if (valid) {
          	this.eform.time=parseFloat(this.eform.time)
            editSetUp(this.editId,this.eform).then(res=>{
            		this.$message({
				          message: '操作成功',
				          type: 'success'
				        });
				        this.dialogEditFormVisible = false
				        this.query()
            })
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
      remoteMethod3(query) {
        if (query !== '') {
          nameList({name:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
      },
      remoteMethod2(query) {
        if (query !== '') {
          nameList({name:query}).then(res=>{
          	this.options2=res.data
          })
        } else {
          this.options2 = [];
        }
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
        border-top: 1px solid #e4e4e4;
				background-color: #FFFFFF;
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
