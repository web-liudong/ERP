<template>
  <div class="userBox returnOrderBox">
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
      	
        <span style="padding-left: 20px;">创建时间：</span>
        <el-date-picker
          v-model="downOrderTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="margin: 5px 0px;"
        ></el-date-picker>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
        	<router-link to="/system/advertiseMessage/create"  v-if="$authorities.AdvertiseMessageCreate">
                <el-button size="small" icon="el-icon-plus">创建公告信息</el-button>
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
            prop="id"
            label="编号"
            width="100px"
            align="center">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="状态"
            align="center">
            <template slot-scope="scope">
            		<span v-if="scope.row.status==0" style="font-size: 12px;color:#606266 ;">草稿</span>
            		<span v-if="scope.row.status==1" style="font-size: 12px;color:#606266 ;">已发布</span>
            		<span v-if="scope.row.status==2" style="font-size: 12px;color:#606266 ;">已撤回</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="230px"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" @click="goEdit(scope.row)" v-show="scope.row.status!=1" v-if="$authorities.AdvertiseMessageEdit">编辑</el-button>
            		<el-button  type="text" size="small" @click="goPush(scope.row)" v-show="scope.row.status==1" v-if="$authorities.AdvertiseMessagePush">推送</el-button>
            		<el-button  type="text" size="small" v-show="scope.row.status!=1" @click="isdeletei(scope.row.id)" v-if="$authorities.AdvertiseMessageDelete">删除</el-button>
            		<el-button  type="text" size="small" v-show="scope.row.status==1" @click="iswithdrawi(scope.row.id)" v-if="$authorities.AdvertiseMessageWithdraw">撤回</el-button>
            		<el-button  type="text" size="small"  @click="goDetail(scope.row)">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
		
		<el-dialog
		  title="删除公告信息"
		  :visible.sync="dialogVisible"
		  width="30%"
		  >
		  <span>确认删除公告信息，删除后不再展示</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="isforbid()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="撤回公告信息"
		  :visible.sync="dialogVisible1"
		  width="30%"
		  >
		  <span>撤回已推送的全部公告信息</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="isenable()">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
	import store from '@/store/store'
	import {
		forbid,
		enable,
		leave,
	} from '@/api/userService'
	import {
		allList,//
		withdraw,
		deleteId
	} from '@/api/noticeService/noticeService'
  export default {
    inject:['close'],
    name: 'advertiseMessagelist',
    data() {
      return {
      	adeteleId:'',
      	awithdrawId:'',
      	endTime:'',
      	startTime:'',
      	downOrderTime:[],
      	defaulttree:[],
				status:'',
      	dialogVisible: false,
      	dialogVisible1: false,
      	pagetotal:null,
      	currentPage4: 1,
        isShow:true,
        tableData: [],
        deleteId:'',
        ArraignmentId:'',
      }
    },
    
    computed:{
    	 dataListHeight(){
      return this.$store.getters.dataListHeight;
      }
    },
    watch:{
    	downOrderTime(a,b){
	  		if(a){
		  		this.startTime=a[0]
		  		this.endTime=a[1]  			
	  		}else{
	  			this.startTime=''
	  			this.endTime=''
	  		}
	  	},
    },
    created(){
    	this.requestData()
    },
    activated(){
			if(this.$route.params.isUpdate){
				this.requestData()
			}
    },
    mounted(){
    },
    methods: {
    	query(){
    		this.requestData()
    	},
    	isdeletei(id){
    		this.adeteleId=id
    		this.dialogVisible=true
    	},
    	iswithdrawi(id){
    		this.awithdrawId=id
    		this.dialogVisible1=true
    	},
    	isforbid(){
    		deleteId(this.adeteleId).then(res=>{
    			this.dialogVisible=false
    			if(res.data>0){
    					this.$message({
			        message:'删除成功',
			        type: "success",
			       
			      })
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
    	isenable(){
    		withdraw(this.awithdrawId).then(res=>{
    			this.dialogVisible1=false
    			if(res.data>0){
    					this.$message({
			        message:'撤回成功',
			        type: "success",
			       
			      })
    					this.requestData()
    			}else{
    				this.$message({
			        message:'撤回失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	//查询在职和离职人数
    	requestData(index){
    		this.inplace()
    	},
    	inplace(){
    		let data={
    			"startTime":this.startTime,
    			"endTime":this.endTime,
				  "pageNum": this.currentPage4,
				  "pageSize": 10,
				}
    		allList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    		})
    		.catch(rej=>{

    		})
    	},
      goDetail(row){
      	this.$router.push({
          name: 'affairDetail',
          query:{
          	detailId:row.id
          }
        })
      },
      goEdit(row){
      	this.$router.push({
          name: 'advertiseMessageedit',
          query:{
          	detailId:row.id
          }
        })
      },
      goPush(row){
      	this.$router.push({
          name: 'advertiseMessagepush',
          query:{
          	detailId:row.id
          }
        })
//    	const { href } = this.$router.resolve({
//        name: 'advertiseMessageedit',
//        query:{
//        	detailId:row.id
//        }
//      })
//      window.open(href, '_blank')      	
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
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
        /*height: 56px;*/
        border-top: 1px solid #e4e4e4;

        /*margin-top: -2px;*/
        .el-input {
          width: 200px;
          height: 40px;
          padding: 5px;

        }
      }
    }
    .listBox {
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
    .listLeftBox{
      	position: relative;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 5%;
        width: 45%;
        height:300px;
       .headerBox{
       	text-align: center;
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
       	height: 263px;
       	box-sizing: border-box;
       
       	overflow: auto;
       }
      }
      .listRightBox{
      	border: 1px solid #e5e5e5;
        width: 45%;
      	height:300px;
        
        overflow: auto;
        /*padding: 0 10px;*/
        .headerBox{
        	text-align: center;
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
       	height: 263px;
       	box-sizing: border-box;
       
       	overflow: auto;
       }

      }
  }
</style>
<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
