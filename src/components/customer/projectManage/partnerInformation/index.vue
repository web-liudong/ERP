<template>
  <div class="projectManageBox">
    <!--<div class="buttonBox">
      <el-button size="small" v-for="(buttondata,index) in buttondatas" :key="index" :class="{ active: buttonshow==index }" @click="header_button_click(index)">{{buttondata.name}}（{{buttondata.countNum}}）</el-button>
    </div>-->
    <div class="filterBox">
      <div class="homeBoxTop"><span style="">项目：{{projectName}}</span><span style="padding-left:30px ;">项目乙方：{{partyBName}}</span>
        <div class="rightBox">
          
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" style="background-color: #FFFFFF;">
      	<el-form :inline="true"  class="demo-form-inline" :model="ruleForm" :rules="rules" ref="ruleForm" style="padding-top: 20px;" v-if="$authorities.ProjectServiceRate">
				  <!--<el-form-item label="费用类型：" style="margin-right: 50px;" prop="type">
				    <el-radio-group v-model="ruleForm.type" >
				      <el-radio label="0">服务费率</el-radio>
				      <el-radio label="1">扣点</el-radio>
				    </el-radio-group>
				  </el-form-item>-->
				  <el-form-item label="项目服务费率批量设置" prop="serviceFeeRate">
				    <el-input v-model="ruleForm.serviceFeeRate"><template slot="append">%</template></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" size="small" @click="submitForm('ruleForm')">确认设置</el-button>
				  </el-form-item>
				  <el-form-item>
				    <p style="font-size: 12px;color: red;padding-top: 5px;">修改此处数据将影响下表中所有组织机构的项目服务费率。</p>
				  </el-form-item>
				  
				</el-form>
				
      </div>
      </el-collapse-transition>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
      	服务方名称:
        <el-select
        	style="padding: 5px 0;"
			    v-model="organizationNameL"
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
			      :value="item.name">
			    </el-option>
			  </el-select>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					
                <el-button size="small" icon="el-icon-plus" @click="gooper()">操作日志</el-button>

        </div>
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            type="index"
 						:index="typeIndex"
            label="序号"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="organizationName"
            label="服务方名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="serviceFeeRate"
            label="项目服务费率"
            align="center">
            <template slot-scope="scope">
            	<span v-if="scope.row.serviceFeeRate!=0">{{scope.row.serviceFeeRate}}%</span>
            	<span v-else>--</span>
            </template>
          </el-table-column>
          
          
          
          <el-table-column
            prop="countSupplierBiz"
            label="相关数据"
            align="center">
            <template slot-scope="scope">

                <el-button type="text" @click="editItem(scope.row)" v-if="$authorities.ProjectServiceRate">编辑</el-button>
            </template>
          </el-table-column>
					
        </el-table>
      </div>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>
      <el-dialog title="编辑费率信息" :visible.sync="dialogFormVisible"  @close="fromclosse">
			  <el-form  label-width="180px" :model="proForm" :rules="prorules" ref="proForm" >
			  	<el-form-item label="项目名称：" required>
				    {{projectName}}
				  </el-form-item>
				  <el-form-item label="项目乙方：" required>
				    {{partyBName}}
				  </el-form-item>
				  <el-form-item label="服务方名称：" required>
				    {{organizationName}}
				  </el-form-item>
				  <!--<el-form-item label="费用类型：" prop="type">
				    <el-radio-group v-model="proForm.type" >
				      <el-radio label="0">服务费率</el-radio>
				      <el-radio label="1">扣点</el-radio>
				    </el-radio-group>
				  </el-form-item>-->
				  <el-form-item label="费率值：" prop="serviceFeeRate">
				    <el-input v-model="proForm.serviceFeeRate" style="width: 200px;"><template slot="append">%</template></el-input>
				  </el-form-item>
				</el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="submitproForm('proForm')">保存</el-button>
			  </div>
			</el-dialog>

    </div>
    


  </div>
</template>

<script>
	import store from '@/store/store'
	import {
	Organization,
	getProjectName,
	souName,
	projectOrganizationFeeAll,
	projectOrganizationFee
	} from '@/api/projectController/projectController'
  export default {
    inject:['close'],
    name: 'PartnerInformation',
    data() {
    	var socialCreditCodeRule=(rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入费率值'));
        }else{
        	 callback()
        }
      };
      return {
      	ruleForm:{
      		serviceFeeRate:''
      	},
      	rules:{
      		type:[
      			{ required: true, message: '请选择费用类型', trigger: 'change' }
      		],
      		serviceFeeRate:[
      			{  validator: socialCreditCodeRule, trigger: 'blur' }
      		]
      	},
      	proForm:{
      		serviceFeeRate:''
      	},
      	prorules:{
      		type:[
      			{ required: true, message: '请选择费用类型', trigger: 'change' }
      		],
      		serviceFeeRate:[
      			{ required: true, message: '请输入费率值', trigger: 'blur' }
      		]
      	},
      	itemProjectName:'',
      	dialogFormVisible:false,
      	//总页数
      	pagetotal:null,
      	//供应商id
      	supplerID:'',
      	//当前页数
      	currentPage4: 1,
        isShow:true,
        tableData: [],
        options3:[],
        organizationNameL:'',
        projectName:'',
        partyBName:'',
        organizationName:'',
        itemorganizationId:'',
        detailId:'',
      }
    },
    computed:{
    },
    created(){
    	this.query()
//  	this.getName()
    	this.partyBName=this.$route.query.partyBName
			this.projectName=this.$route.query.name
    },
    activated(){
    	if(this.detailId){
    		if(this.$route.query.detailId!=this.detailId){
    			this.query()
    			this.getName()
    		}
    	}
    },
    methods: {
    	query(){
    		this.detailId=this.$route.query.detailId
    		this.requestData()
    	},
    	fromclosse(){
    		this.itemorganizationId=''
    		this.proForm.serviceFeeRate=''
    	},
    	editItem(row){
    		this.organizationName=row.organizationName
    		this.itemorganizationId=row.organizationId
    		console.log(row)
    		this.proForm.serviceFeeRate=row.serviceFeeRate
    		this.dialogFormVisible=true
    	},
    	submitproForm(formName){
    		this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.proopen()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    	},
    	proopen(){
    		let a={
    			"organizationId": this.itemorganizationId,
				  "serviceFeeRate":this.proForm.serviceFeeRate,
    		}
    		projectOrganizationFee(this.$route.query.detailId,a).then(res=>{
    			if(res.data>0){
    				this.dialogFormVisible=false
            		this.requestData()
            		this.$message({
			            type: 'success',
			            message: '操作成功!'
			          });
			          
            	}
    		})
    	},
    	submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.open()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      open(){
      	 this.$confirm('保存后，下表中所有合作伙伴数据将刷新，确定要保存吗?', '保存确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	projectOrganizationFeeAll(this.$route.query.detailId,this.ruleForm).then(res=>{
            	if(res.data>0){
            		this.requestData()
            		this.$message({
			            type: 'success',
			            message: '操作成功!'
			          });
            	}
            })
          
        }).catch(() => {
                   
        });
      },
      showHelp(){
        this.isShow=!this.isShow;
      },
    	typeIndex(index) {
	 			return index + (this.currentPage4 - 1) * 10 + 1;
	 			//这个是默认一页显示十条数据
			},
			remoteUser(query){
				
          souName({name:query}).then(res=>{
          	this.options3=res.data
          })
        
			},
			getName(){
				getProjectName(this.$route.query.detailId).then(res=>{
					this.partyBName=res.data.partyBName
					this.projectName=res.data.name
				})
			},
			gooper(){
				this.$router.push({
          name: 'OperationJournal',
          query:{
          	projectId:this.$route.query.detailId,
          	projectName:this.projectName
          }
        })
			},
    	requestData(index){
    		let a={
    			"organizationName": this.organizationNameL,
				  "pageNum": this.currentPage4,
				  "pageSize":10,
				  "projectId": this.$route.query.detailId
    		}
    		Organization(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	 handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4=val
        this.requestData()
      },
    	

    }
  }
</script>
<style scoped lang="less">
  .projectManageBox {
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
        /*height: 56px;*/
        border-top: 1px solid #e4e4e4;
				box-sizing: border-box;
				padding-left: 10px;
        /*margin-top: -2px;*/
        .el-input {
          width: 200px;
          height: 40px;
					padding: 5px;

        }
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      line-height: 50px;
      .listBoxTop {
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
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
      margin-top: 10px;
    }
  }
</style>
