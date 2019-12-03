<template>
  <div class="brandBox returnOrderBox">
    <div class="buttonBox">
			<table border="1">
				<tr>
          <th>参数模板编号：</th>
          <td>{{headerdata.templateNo}}</td>
          <th>参数模板状态：</th>
          <td>{{headerdata.templateStatus}}</td>
        </tr>
        <tr>
          <th><i>*</i>参数模板所属分类：</th>
          <td>{{headerdata.oneLevelCategoryName}}>{{headerdata.twoLevelCategoryName}}>{{headerdata.threeLevelCategoryName}}</td>
          <th></th>
          <td></td>
        </tr>
			</table>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer;"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>

          <el-button size="small" class="w80 h40" @click="getListData()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="Reset()">重置</el-button>
        </div>
      </div>
      <div class="homeBoxBottom clearfix" v-if="isShow">
      	<div style="float: left;">
      		参数ID:
	        <el-input
	          placeholder="参数ID"
	          v-model="input1"
	          clearable>
	        </el-input>
      	</div>
      	<div style="float: left;">
      		参数名称:
	        <el-input
	          placeholder="参数名称"
	          v-model="input2"
	          clearable>
	        </el-input>
      	</div>
        <div style="float: left;">
      		参数组名称:
	        <el-input
	          placeholder="参数组名称"
	          v-model="input3"
	          clearable>
	        </el-input>
      	</div>
        	
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
        	<el-button size="small" icon="el-icon-plus" @click="orsubmit()"  v-if="headerdata.templateStatus=='草稿'">参数模板提审</el-button>
        	<el-button size="small" icon="el-icon-search" @click="gotemplateDetail()">参数模板详细</el-button>
          <el-button size="small" icon="el-icon-plus" @click="addpro">添加参数</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small">
          <el-table-column
		      type="selection"
		      width="55">

		    </el-table-column>
          <el-table-column
            prop="id"
            label="参数ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="参数名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="categoryAttributeGroupName"
            label="所属参数组"
            align="center">
          </el-table-column>
          <el-table-column
            prop="required"
            label="参数是否必填"
            align="center">
          </el-table-column>
          <el-table-column
            prop="valueType"
            label="参数值类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="options"
            label="可选值列表"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序值"
            align="center">

          </el-table-column>


          <el-table-column
            label="操作"
            width="128px"
            align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row)">详情</el-button>
              <el-button type="text" size="small" @click="deleteclick(scope.row)">删除</el-button>
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
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          :current-page="currentPage4"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
      </div>
    </div>
    <el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <span>删除数据，参数模板将变为草稿状态，再次审核通过之后，将真正删除数据，删除之后，列表将不再展示该条数据，确定删除吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="isdelete()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提审确认"
		  :visible.sync="dialogVisible1"
		  width="30%">
		  <span>确定当前填写的信息无误，可以提交审核？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="issubmit()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提审提示"
		  :visible.sync="dialogVisible2"
		  width="30%">
		  <span>参数模板至少需要有一个参数组、一个参数，当前模板不满足，无法提交审核</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary"  @click="dialogVisible2 = false">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>
<script>
	import{getList,commonInfo,IDdelete,submitReview} from '@/api/parameter'
  import  Butt from '../../../common/Button/index'
  export default {
    inject:['close'],
    name: "ParameterList",
    data() {
      return {
      	dialogVisible1:false,
      	dialogVisible2:false,
      	dialogVisible:false,
      	groupId:null,
      	parId:null,
      	headerdata:{},
      	buttonshow:0,
        input1:null,
        input2:null,
        input3:null,
        pageNum:1,
        isShow:true,
        total:null,
        tableData: [],
        currentPage4: 1,
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        options2: [{
          value2: '选项1',
          label: '不限'
        }, {
          value2: '选项2',
          label: '草稿'
        }, {
          value2: '选项3',
          label: '已通过'
        }, {
          value2: '选项4',
          label: '未通过'
        }, {
          value2: '选项5',
          label: '待审核'
        }],
        value2:'',
        routerQuery:'',
        pageSize:10,
      }
    },
    created(){
    	this.getListData()
    	this.getcommonHeader()
    },
    activated(){
			if(this.$route.params.isUpdate){
				this.getListData()
	    	this.getcommonHeader()
			}else if(this.routerQuery!=JSON.stringify(this.$route.query)){
				this.getListData()
    		this.getcommonHeader()
			}
    },
    methods: {
    	Reset(){
				  this.pageSize=10
				  this.currentPage4=1
				  this.input1=''
				  this.input2=''
				  this.input3=''
				  this.getListData()
    	},
    	orsubmit(){
    		if(this.tableData.length>=1){
    			this.dialogVisible1=true
    		}else{
    			this.dialogVisible2=true
    		}
    	},
    	issubmit(){
    		submitReview(this.$route.query.id).then(res=>{
    			if(res.code=='000000'){
	    				this.$message({
	            type: 'success',
	            message: '提审成功!'
	          })
	    			this.close({
				        		name:'ParameterList',
				        		to:{
				        			name:'TemplateAdmin',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
    			}else{
    				this.$message({
            type: 'error',
            message: '提审失败'
          });
          this.dialogVisible1=false
	    			this.getListData()
    			}
    			this.dialogVisible1=false
    		})
    	},
    	deleteclick(row){
    		this.dialogVisible=true
    		this.groupId=row.groupId
    		this.parId=row.id
    	},
    	isdelete(){
    		let a={
    			 "groupId": this.groupId,
  					"templateId": this.$route.query.id
    		}
    		IDdelete(this.parId,a).then(res=>{
    			if(res.code=='000000'){
	    				this.$message({
	            type: 'success',
	            message: '删除成功!'
	          })
	    					this.dialogVisible=false
	    					this.getListData()
    			}else{
    				this.$message({
            type: 'info',
            message: '删除失败'
          });
    			}
    		})
    	},
    	getListData(){
    		this.routerQuery=JSON.stringify(this.$route.query)
    		let a={
    			"categoryAttributeGroupName": this.input3,
				  "id": this.input1?this.input1:null,
				  "name": this.input2?this.input2:null,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "templateId": this.$route.query.id?this.$route.query.id:'',
          groupId: this.$route.query.groupId?this.$route.query.groupId:''
    		}
    		getList(a).then(res=>{
    			this.total=res.data.total
    			this.tableData=res.data.items
    		})
    	},
    	getcommonHeader(){
    		commonInfo(this.$route.query.id).then(res=>{
    			this.headerdata=res.data
    		})
    	},
    	header_button_click(index){
    		this.buttonshow=index
    	},
      handleClick(row) {
//    	this.close({
//				        		name:'ParameterList',
//				        		to:{
//				        			name:'EditParameter',
//				        			query:{
//				        				id:row.id,
//						          	templateId:this.$route.query.id,
//						          	groupId:row.groupId,
//				        			}
//				        		}
//				        	})
      	
      	 this.$router.push({
          name: 'EditParameter',
          query:{
          	id:row.id,
          	templateId:this.$route.query.id,
          	groupId:row.groupId,
          }
        })
      	

      },
      addpro(){
//    	this.close({
//				        		name:'ParameterList',
//				        		to:{
//				        			name:'AddParameter',
//				        			query:{
//				        				id:this.$route.query.id,
//          						threeName:this.headerdata.oneLevelCategoryName + '<'+this.headerdata.twoLevelCategoryName  + '<'+ this.headerdata.threeLevelCategoryName
//				        			}
//				        		}
//				        	})
      	this.$router.push({
      		name:'AddParameter',
      		query:{
				        				id:this.$route.query.id,
            						threeName:this.headerdata.oneLevelCategoryName + '<'+this.headerdata.twoLevelCategoryName  + '<'+ this.headerdata.threeLevelCategoryName
				        			}
      	})
      },
      goDetail(row){
      	this.$router.push({
          name: 'DetailParameter',
          query:{
          	parId:row.id,
          	groupId:row.groupId,
          	templateId:this.$route.query.id
          }
        })
      },
      gotemplateDetail(id){
        this.$router.push({
          name: "TemplateDetail",
          query:{id:this.$route.query.id}
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val
         this.getListData()
      },
      handleCurrentChange(val) {
        this.currentPage4=val
        this.getListData()
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
      table{
          width:100%;
          margin-top: 20px;
          td,th{
            border: 1px solid #d1d1d1;
            font-size:12px;
            height:53px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          th{
            color:#303133;
            text-align: right;
            width:20%;
            background: #f9fafc;
              i{
                color:red;
              }
          }
          td{
            color: #666666;
            text-align: left;
            padding-left:10px;
            width:30%;
          }
        }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-bottom: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      border-top: 0;
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
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        height: 56px;
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 200px;
          height: 40px;
          line-height: 56px;
          margin-left: 10px;
        }
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
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
  }
</style>
<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
