<template>
  <div class="basicSupplerBox returnOrderBox">
    <div class="buttonBox" v-if="!($route.query.id||$route.query.classCode)">
      <el-button size="small" v-for="(buttondata,index) in buttondatas" :key="index" :class="{ active: buttonshow==index }" @click="header_button_click(index)">{{buttondata.name}}（{{buttondata.countNum}}）</el-button>
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
        	供应商编号:
	        <el-input
	          placeholder="供应商编号"
	          v-model="supplerID"
	          type="number"
	          clearable>
	        </el-input>
        </div>
        <div class="criteria_item">
        		公司名称：
		        <el-select
					    v-model="cupyName"
					    filterable
					    clearable
						  remote
						  reserve-keyword
					    placeholder="请输入关键词"
					    :remote-method="remoteMethod"
					    >
					    <el-option
					      v-for="item in options4"
					      :key="item.name+item.id"
					      :label="item.name"
					      :value="item.id">
				    </el-option>
		   		 </el-select>
        </div>
        <div class="criteria_item">
        	公司法人:
	        <el-input
	          placeholder="公司法人"
	          v-model="cupyMaster"
	          clearable>
	        </el-input>
        </div>
        <div class="criteria_item">
        	供应商类型:
	        <el-select v-model="value1" placeholder="供应商类型">
	          <el-option
	            v-for="item in options1"
	            :key="item.value"
	            :label="item.label"
	            :value="item.value">
	          </el-option>
	        </el-select>
        </div>
        
        
        
        <!--<el-select v-if="buttonshow==0" v-model="value2" placeholder="更新状态">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>-->
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
        	<div class="operation_btn" @click="showDialog('importFile')" v-if="$authorities.SupplierBasicImportRelevant"><i class="iconfont icondaoru"></i>导入</div>
					<!--<el-button size="small" @click="showDialog('importFile')" v-if="$authorities.SupplierBasicImportRelevant">
						<i class="icon-Icon-daoru iconfont icondaoru" style="font-size: 15px;line-height: 12px;"></i> 
						<span style="font-size: 12px;line-height: 12px;color: #606266;margin-left: -2px;">导入</span>
					</el-button>-->
					<router-link to="/supplier/basic/supplierindex/ImportRecord"  v-if="$authorities.SupplierBasicImportRelevant">
                <div class="operation_btn"><i class="iconfont iconcaidan"></i>导入记录</div>
          </router-link>
        	<router-link to="/supplier/basic/supplierindex/addSupplier" v-if="$authorities.SupplierBasicCreateRelevant">
                <div class="operation_btn"><i class="iconfont iconzengjia"></i>添加</div>
          </router-link>
					<!--@click="$router.push('/supplier/basic/supplierindex/addSupplier')"-->
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
            label="供应商编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="供应商公司名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="供应商类型"
            align="center">
          </el-table-column>
          <!--<el-table-column
            prop="gradeLevelName"
            label="供应商等级"
            align="center">
          </el-table-column>-->
          <el-table-column
            prop="legalPersonName"
            label="公司法人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="socialCreditCode"
            label="统一社会信用代码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplierStatusName"
            label="状态"
            align="center">
          </el-table-column>
          <!--<el-table-column
            prop="supplierEditingStatusName"
            label="更新状态"
            align="center">
            <template slot-scope="scope">
              {{scope.row.supplierEditingStatusName}}<br/>
              <el-button type="text" v-if="scope.row.supplierEditingStatusName!='---'" @click="goUpdataDetail(scope.row)">更新详情</el-button>
            </template>
          </el-table-column>-->
          <el-table-column
            prop="countSupplierBiz"
            label="相关"
            align="center">
            <template slot-scope="scope">
              <router-link :to="{name:'SupplierService',query:{supplierId:scope.row.id}}" v-if="$authorities.SupplierService" v-show="buttonshow==0">
                <el-button type="text">业务:{{scope.row.countSupplierBiz}}</el-button>
              </router-link>
              <span v-show="buttonshow!=0">- -</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="230px"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" @click="goDetail(scope.row)" v-if="$authorities.SupplierBasicDetailRelevant">详情</el-button>
                <el-button v-show="editButtonshow(scope.row.oldId)" @click="handleClick(scope.row)" type="text" size="small" v-if="edithide(scope.row)">编辑</el-button>
                <el-button v-show="buttonshow==1" @click="Arraignment(scope.row)" type="text" size="small" v-if="scope.row.manageId==$auth.user.id">审核</el-button>
                <el-button v-show="buttonshow==2" v-if="$authorities.SupplierBasicCreateRelevant" @click="submitClick(scope.row)" type="text" size="small">提审</el-button>
                <el-button v-show="buttonshow==2||buttonshow==3" @click="deleteClick(scope.row)" type="text" size="small" v-if="$authorities.SupplierBasicCreateRelevant">删除</el-button>
              	<el-button type="text" v-show="buttonshow==0" size="small" @click="downClick(scope.row)" v-if="$authorities.SupplierBasicDownload">下载资质</el-button>
              	<router-link v-show="buttonshow==0" :to="{name:'AddBusiness',query:{addId:scope.row.id}}" v-if="$authorities.SupplierBusinessRelevant&&$authorities.SupplierBasicCreateBusiness">
                	<el-button type="text"  size="small" >添加业务</el-button>
         				</router-link>
            		<el-button v-show="scope.row.oldId" v-if="$authorities.SupplierBasicDetailRelevant" type="text" size="small" @click="gooldDetail(scope.row)">原数据详情</el-button>
              	
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
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
    <el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisible"
		  width="30%"
		  >
		  <span>删除之后，列表将不再展示该数据，确定要删除吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="isdeleteClick()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提审确认"
		  :visible.sync="dialogVisible1"
		  width="30%"
		  >
		  <span>确定当前填写的信息无误，可以提交审核？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="issubmitReviewSupplier()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="下载资质文件" :visible.sync="dialogTableVisible2" @close="downDialogclose">
			<p style="padding: 10px;"><i style="color: red;">*</i>供应商公司：<span>{{downId}}</span> <el-button type="primary" size="small" @click="downAll()" :disabled="downAllButton">一键全部下载</el-button></p>
		  <el-table :data="gridData" border
          stripe
          height="250">
		    <el-table-column prop="name" label="授权文件" align="center"></el-table-column>
		    <el-table-column
            label="操作"
            width="150px"
            align="center">
            <template slot-scope="scope">
              	<el-button type="text" size="small" @click="getDown(scope.row)">下载</el-button>
            </template>
          </el-table-column>
		  </el-table>
		</el-dialog>
		<el-dialog
		  title="数据锁定提示"
		  :visible.sync="dialogVisiblelock"
		  width="30%"
		  >
		  <span>用户【{{lockUserName}}-{{lockRealName}}】正在编辑该条数据，数据已锁定。</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="dialogVisiblelock=false">确 定</el-button>
		  </span>
		</el-dialog>
		<importFile
      ref="importFile"
      :title="'供应商信息批量导入'"
      :type="importType"
      @callback="dialogCallback"
    ></importFile>
    <!--:params="{id:shoppeId}"-->

  </div>
</template>

<script>
	import store from '@/store/store'
	
	import {
		findAvailableSupplierList,
		findDraftSupplierList,
		findPendingReviewSupplierList,
		findRejectedSupplierList,
		count,
		fileList,//根据ID查询文件
		submitReviewSupplier,//提审
		deletebasic,
		downFiles,
		downAllBatch,
		editSupplierInfoDTOById,
		pendingReview
	} from '@/api/basicSupplier'
	import {findInfo} from '@/api/businessSupplier'
  import  Butt from '../../common/Button/index'
import {getFileDownloadBatch} from "@/api/common/commonApi"
import importFile from "@/components/common/module/ImportFile";  
  export default {
    inject:['reload'],
    name: "SupplierList",
    data() {
      return {
      	pageSize:10,
      	importType:'Supplier_BaseInfo_Template',
      	options4:[],
      	dialogVisiblelock:false,
      	lockUserName:'',
      	lockRealName:'',
      	downId:"",
      	gridData:[],
      	filesIds:[],
      	downAllButton:true,
      	dialogTableVisible2:false,
      	submitId:'',
      	submitoldId:'',
      	dialogVisible: false,
      	dialogVisible1: false,
      	buttondatas:[
//    		{name:'可用',countNum:500,id:0},
//    		{name:'待审核',countNum:500,id:1},
//    		{name:'草稿',countNum:500,id:2},
//    		{name:'已驳回',countNum:500,id:3}
      	],
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
          label: '不限'
        }, {
          value: 'VENDOR',
          label: '厂商'
        }, {
          value: 'GENERAL_AGENT',
          label: '总代'
        }, {
          value: 'REGIONAL_AGENT',
          label: '区域代理'
        }, {
          value: 'PROVINCE_AGENT',
          label: '省代'
        }, {
          value: 'CITY_AGENT',
          label: '市代'
        }, {
          value: 'DEALER',
          label: '经销商'
        }],
        value1:'',
        value2:'',
        deleteId:'',
        deleteoldId:'',
        ArraignmentId:'',
        routerQuery:'',
      }
    },
    components:{
    	importFile
    },
    computed:{
    	dataListHeight(){
      	return this.$store.getters.dataListHeight;
    	}
    },
    created(){
    	
    	if(this.$route.query.status){
    		this.buttonshow=this.$route.query.status
    	}
    	this.getheader()
    	this.requestData()
    },
    activated(){
			if(this.$route.params.isUpdate){
				this.buttonshow=0
				this.getheader()
    		this.Reset()
			}else if(this.routerQuery!=JSON.stringify(this.$route.query)){
				this.buttonshow=0
	    	this.getheader()
	    	this.Reset()
			}
    },
    methods: {
    	query(){
    		this.currentPage4=1
    		this.requestData()
    	},
    	Reset(){
				  this.value1=''
	    		this.supplerID=''
	    		this.cupyMaster=''
	    		this.cupyName=''
	    		this.query()
    	},
    	edithide(row){
    		if(this.buttonshow==0){
    			if(this.$authorities.SupplierBasicUpdateRelevant&&row.manageId==this.$auth.user.id){
    				return true
    			}else{
    				return false
    			}
    		}else{
    			if(this.$authorities.SupplierBasicUpdateRelevant){
    				return true
    			}else{
    				return false
    			}
    		}
    	},
    	downDialogclose(){
    		this.gridData=[]
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
	    showDialog(type, row) {
	      this.$refs[type].init(row);
	    },
    	editButtonshow(oldId){
    		if(this.buttonshow==1){
    			return false
    		}else{
    			if(oldId){
	    			if(this.buttonshow==3){
	    				return false
	    			}
	    			if(this.buttonshow==2){
	    				return true
	    			}
	    		}else{
	    			return true
	    		}
    		}
    	},
    	remoteMethod(value){
    		let a={
    			name:value
    		}
    		findInfo(a).then(res=>{
    			
    			this.options4=res.data
    		})
    	},
    	downClick(row){
    		console.log(row)
    		this.downId=row.name
    		this.dialogTableVisible2=true
    		this.filesIds=[]
    			this.downAllButton=true
    		fileList(row.id).then(res=>{
    			this.gridData=res.data
    		})
    		downFiles(row.id).then(res=>{
    			this.filesIds=res.data.ids
    			this.downAllButton=false
    		})
    	},
    	getDown(row){
    		
        // console.log(row.id);
        let token='&access_token='+this.$auth.token;
        let href = '/api/file-service/file/download?id='+row.id + token;
        window.open(href, '_blank')
      
    	
    	},
    	downAll(){
    		downAllBatch({ids:this.filesIds}).then(res=>{
    			let url = window.URL.createObjectURL(new Blob([res],{type:"application/xls"}))
				  let link = document.createElement('a')
				  link.style.display = 'none'
				  link.href = url
				  link.setAttribute('download', '供应商授权文件.zip')
				  document.body.appendChild(link)
				  link.click()
    		})
    	},
    	//点击删除
    	deleteClick(row){
    		
    		this.deleteId=row.id
    		this.deleteoldId=row.oldId
    		this.dialogVisible=true
    	},
    	submitClick(row){
    		console.log(row.id)
    		this.submitoldId=row.oldId
    		this.submitId=row.id
    		this.dialogVisible1=true
    	},
    	issubmitReviewSupplier(){
    		
    		submitReviewSupplier(this.submitId,this.submitoldId).then(res=>{
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
    	isdeleteClick(){
    		deletebasic(this.deleteId,this.deleteoldId).then(res=>{
    			console.log(res)
    			if(res.data=='1'){
		    			this.$message({
			        message:'删除成功',
			        type: "success",

			      })
    				this.dialogVisible = false
    				this.getheader()
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
    		pendingReview(row.id).then(res=>{
	    			if(res.data){
	    				this.$router.push({
			          name: 'BasicExamine',
			          query:{
			          	detailId:row.id
			          }
			        })
	    			}else{
	    				this.$confirm('数据状态发生变化，请重新获取数据', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			          this.query()
			        }).catch(() => {
			                    
			        })
	    			}
    		})
    	},
    	getheader(){
    		count().then(res=>{
    			this.buttondatas=res.data
    			console.log(res)
    		})
    	},
    	header_button_click(index){
    	 	this.currentPage4=1
    	 	this.buttonshow=index
    		this.requestData(index)
    		this.getheader()
    	},
    	requestData(index){
    		this.routerQuery=JSON.stringify(this.$route.query)
    		let n=index?index:this.buttonshow
    		switch(n){
    			case 0:
    				this.available()
    			break;
    			case 1:
    				this.audited()
    			break;
    			case 2:
    				this.draft()
    			break;
    				case 3:
    			this.Reject()
    			break;
    		}
    	},
    	//可用
    	available(){
    		let data={
				  "type": this.value1,
				  "no": this.supplerID,
				  "legalPersonName": this.cupyMaster,
				  "nameId": this.cupyName,
				  "pageNum":this.currentPage4,
				  "pageSize": this.pageSize,
				  "categoryCode":this.$route.query.classCode?this.$route.query.classCode:null,
				  "brandId":this.$route.query.id?this.$route.query.id:null,
				}
    		findAvailableSupplierList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
    	//待审核
    	audited(){
    		let data={
				  "type": this.value1,
				  "no": this.supplerID,
				  "legalPersonName": this.cupyMaster,
				  "nameId": this.cupyName,
				  "pageNum": this.currentPage4,
				  "pageSize":this.pageSize,
				  "categoryCode":this.$route.query.classCode?this.$route.query.classCode:null,
				  "brandId":this.$route.query.id?this.$route.query.id:null,
				}
    		findPendingReviewSupplierList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
    	//草稿
    	draft(){
    		let data={
				  "type": this.value1,
				  "no": this.supplerID,
				  "legalPersonName": this.cupyMaster,
				  "nameId": this.cupyName,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "categoryCode":this.$route.query.classCode?this.$route.query.classCode:null,
				  "brandId":this.$route.query.id?this.$route.query.id:null,
				}
    		findDraftSupplierList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
    	//已驳回
    	Reject(){
    		let data={
				  "type": this.value1,
				  "no": this.supplerID,
				  "legalPersonName": this.cupyMaster,
				  "nameId": this.cupyName,
				  "pageNum": this.currentPage4,
				  "pageSize": this.pageSize,
				  "categoryCode":this.$route.query.classCode?this.$route.query.classCode:null,
				  "brandId":this.$route.query.id?this.$route.query.id:null,
				}
    		findRejectedSupplierList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
      handleClick(row) {
      	editSupplierInfoDTOById(row.id).then(res=>{
      		if(res.code=='000000'){
					this.$router.push({
          name: 'EditSupplier',
          query:{
          	editId:row.id,
          	oldId:row.oldId,
          	state:this.buttonshow
          }
        	})
				}else{
					this.dialogVisiblelock=true
					this.lockUserName=res.data.userName
      	this.lockRealName=res.data.realName
				}
      	}).catch(rej=>{
      		
      	})
      },
      goDetail(row){
      	this.$router.push({
          name: 'BasicDetail',
          query:{
          	detailId:row.id
          }
        })
      },
      gooldDetail(row){
      	 this.$router.push({
          name: 'BasicDetail',
          query:{
          	detailId:row.oldId
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
  .basicSupplerBox {
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
