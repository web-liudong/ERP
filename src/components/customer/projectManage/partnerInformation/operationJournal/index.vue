<template>
  <div class="brandBox">
    
    <div class="filterBox">
      <div class="homeBoxTop"><span style="color: red;">项目：{{$route.query.projectName}}</span>
        <div class="rightBox">
          
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					

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
            align="center">
          </el-table-column>
          <el-table-column
            prop="operatorName"
            label="操作者"
            align="center">
          </el-table-column>
          <el-table-column
            prop="operationTime"
            label="操作日期"
            align="center">
          </el-table-column>
          <el-table-column
            prop="organizationName"
            label="操作对象"
            align="center">
          </el-table-column> 
          <el-table-column
            label="服务费率"
            align="center">
            <template slot-scope="scope">
							<li>原：<span v-if="scope.row.oldServiceFeeRate==0">---</span><span v-else>{{scope.row.oldServiceFeeRate}}%</span></li>
							<li>现：<span v-if="scope.row.newServiceFeeRate==0">---</span><span v-else>{{scope.row.newServiceFeeRate}}%</span></li>
            </template>
          </el-table-column>
          <!--<el-table-column
            label="扣点"
            align="center">
            <template slot-scope="scope">
							<li>原：<span v-if="scope.row.oldDeductionPoint==0">---</span><span v-else>{{scope.row.oldDeductionPoint}}%</span></li>
							<li>现：<span v-if="scope.row.newDeductionPoint==0">---</span><span v-else>{{scope.row.newDeductionPoint}}%</span></li>
            </template>
          </el-table-column>-->
          
					
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

    </div>
    


  </div>
</template>

<script>
	import store from '@/store/store'
	import {
		logList
	} from '@/api/projectController/projectController'
//import  Butt from '../../common/Button/index'
  export default {
    inject:['close'],
    name: 'OperationJournal',
    data() {
      return {
      	pagetotal:null,
      	projectId:'',
      	currentPage4: 1,
        isShow:true,
        tableData: [],
      }
    },
    computed:{
    },
    created(){
    	this.requestData()
    },
    activated(){
    	if(this.projectId){
    		if(this.$route.query.projectId!=this.projectId){
    			this.requestData()
    		}
    	}
    },
    methods: {
    	query(){
    		this.requestData()
    	},
    	typeIndex(index) {
	 			return index + (this.currentPage4 - 1) * 10 + 1;
	 			//这个是默认一页显示十条数据
			},
    	requestData(index){
    		this.projectId=this.$route.query.projectId
    		let a={
    			"pageNum": this.currentPage4,
				  "pageSize": 10,
				  "projectId": this.$route.query.projectId
    		}
    		logList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
      handleCurrentChange(val) {
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
  .brandBox {
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
