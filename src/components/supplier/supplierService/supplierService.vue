<template>
  <div class="supplierServiceBox returnOrderBox">
    <div class="buttonBox">
      <el-button size="small" v-for="(buttondata,index) in buttondatas" :key="index" :class="{ active: buttonshow==index }" @click="header_button_click(index)">{{buttondata.supplierBizStatusName}}（{{buttondata.count}}）</el-button>
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
      		供应商业务编号：
	        <el-input
	          placeholder="供应商业务编号"
	          v-model="input1"
	          type="number"
	          clearable>
	        </el-input>
      	</div>
      	<div class="criteria_item">
      		供应商服务对象：
	        <el-select
				    v-model="input2"
				    filterable
				    remote
				    clearable 
				    reserve-keyword
				    placeholder="供应商服务对象"
				    :remote-method="remoteMethod"
				    >
				    <el-option
				      v-for="item in options4"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
      	</div>
      	<div class="criteria_item">
      		供应商等级：
	        <el-select v-model="value1" placeholder="供应商等级">
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
        	<!--<el-button size="small" @click="showDialog('importFile')" v-if="$authorities.SupplierBusinessImportRelevant">
						<i class="icon-Icon-daoru iconfont button-head-icon" style="font-size: 15px;line-height: 12px;"></i> 
						<span style="font-size: 12px;line-height: 12px;margin-left: 5px;color: #606266;">导入</span>
					</el-button>-->
					<div class="operation_btn" @click="showDialog('importFile')" v-if="$authorities.SupplierBusinessImportRelevant">
						<i class="iconfont icondaoru"></i>导入
					</div>
					<router-link to="/supplier/business/supplierindex/ImportRecord"  v-if="$authorities.SupplierBusinessImportRelevant">
                <div class="operation_btn"><i class="iconfont iconcaidan"></i>导入记录</div>
          </router-link>
        	<router-link v-show="$route.query.supplierId" v-if="$authorities.SupplierBusinessRelevant" :to="{name:'AddBusiness',query:{addId:$route.query.supplierId}}">
                <div class="operation_btn"><i class="iconfont iconzengjia"></i>添加</div>
          </router-link>
          <router-link v-show="!$route.query.supplierId" v-if="$authorities.SupplierBusinessRelevant" to="/supplier/business/supplierindex/addBusiness">
                 <div class="operation_btn"><i class="iconfont iconzengjia"></i>添加</div>
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
            label="供应商业务编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="branchName"
            label="供应商服务对象"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商公司名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="socialCreditCode"
            label="统一社会信用代码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplierBizTypeName"
            label="供应商等级"
            align="center">
          </el-table-column>
          <el-table-column
            label="合同有效期"
            align="center">
            <template slot-scope="scope">
              {{scope.row.contractStartTime}}至{{scope.row.contractEndTime}}
            </template>
          </el-table-column>
          <el-table-column
            prop="supplierBizStatusName"
            label="业务状态"
            align="center">
          </el-table-column>
          <!--<el-table-column
            prop="updatedSupplierBizStatusName"
            label="更新状态"
            align="center">
            <template slot-scope="scope">
            	<li v-if="scope.row.updatedSupplierBizStatusName=='---'">{{scope.row.updatedSupplierBizStatusName}}</li>
              <li v-if="scope.row.updatedSupplierBizStatusName!='---'">{{scope.row.updatedSupplierBizStatusName}}</li>
              <el-button v-if="scope.row.updatedSupplierBizStatusName!='---'" type="text" style="padding:0px;" @click="goUpdata(scope.row)" >更新详情</el-button>
            </template>
          </el-table-column>-->
          
         
          <el-table-column
            label="操作"
            width="170px"
            align="center">
            <template slot-scope="scope">
            	<!--v-show="[0, 2, 3].includes(buttonshow)&&!scope.row.oldId"--> 
            	<el-button type="text" size="small" @click="goDetail(scope.row)" v-if="$authorities.SupplierBusinessDetailRelevant">详情</el-button>
              <el-button v-show="editButtonshow(scope.row.oldId)" v-if="edithide(scope.row)" @click="handleClick(scope.row)" type="text" size="small" >编辑</el-button>
              <el-button v-show="[0, 5].includes(buttonshow)" type="text" size="small" v-if="$authorities.SupplierBusinessFrozenRelevant" @click="isdialogVisible1(scope.row.id)">冻结</el-button>
              <el-button v-show="[0, 5].includes(buttonshow)" type="text" size="small" v-if="$authorities.SupplierBusinessTerminated" @click="isdialogVisible2(scope.row.id)">终止</el-button>
              <el-button v-show="buttonshow==1" type="text" size="small" v-if="scope.row.manageId==$auth.user.id&&$authorities.SupplierBusinessReview" @click="gobusinessExamine(scope.row)">审核</el-button>
              <el-button v-show="buttonshow==2" type="text" size="small" v-if="$authorities.SupplierBusinessRelevant||$authorities.SupplierBusinessRelevant" @click="isdialogVisible4(scope.row.id)">提审</el-button>
              <el-button v-show="[2, 3].includes(buttonshow)" type="text" v-if="$authorities.SupplierBusinessRelevant||$authorities.SupplierBusinessRelevant" size="small" @click="isdialogVisible3(scope.row.id)">删除</el-button>
              <el-button v-show="buttonshow==4" type="text" size="small" v-if="$authorities.SupplierBusinessFrozenRelevant"  @click="isdialogVisible5(scope.row.id)">取消冻结</el-button>
              <el-button v-show="scope.row.oldId" type="text" size="small" v-if="$authorities.SupplierBusinessDetailRelevant" @click="gooldDetail(scope.row)">原数据详情</el-button>
              
            </template>
          </el-table-column>
        </el-table>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>
      
    </div>
    <el-dialog
		  title="冻结确认"
		  :visible.sync="dialogVisible1"
		  width="30%"
		  >
		  <span>冻结之后将禁止财务针对该业务向供应商打款，确定冻结？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="isfrozen()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="终止确认"
		  :visible.sync="dialogVisible2"
		  width="30%"
		  >
		  <span>终止业务之后，将会走相应的清退流程，确定终止？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible2 = false">取 消</el-button>
		    <el-button type="primary" @click="isterminated()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisible3"
		  width="30%"
		  >
		  <span>删除之后，列表将不再展示该数据，确定要删除吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible3 = false">取 消</el-button>
		    <el-button type="primary" @click="isIDdelete()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提审确认"
		  :visible.sync="dialogVisible4"
		  width="30%"
		  >
		  <span>确定当前填写的信息无误，可以提交审核？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible4 = false">取 消</el-button>
		    <el-button type="primary" @click="issubmitReview()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="终止确认"
		  :visible.sync="dialogVisible5"
		  width="30%"
		  >
		  <span>取消冻结之后，财务针对该业务可以向供应商打款，确定取消冻结</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible5 = false">取 消</el-button>
		    <el-button type="primary" @click="isunfrozen()">确 定</el-button>
		  </span>
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

  </div>
</template>

<script>
  import  Butt from '../../common/Button/index'
  import store from '@/store/store'
  import {
  	editingDetail,//编辑详情
		countList,
		availableList,//有效
		draftList,//草稿
		expiredList,//已过期
		frozenList,//已冻结
		pendingReviewList,//待审核
		rejectedList,//以驳回
		terminatedList,//以终止
		
		IDdelete,//删除
		frozen,//冻结
		//reviewPassed//审核通过
		//reviewReject//审核不通过
		submitReview,//业务提审
		terminated,//终止
		unfrozen,//解冻
		pendingReview,
	} from '@/api/businessSupplier'
	import importFile from "@/components/common/module/ImportFile"; 
	import {
					listName
	} from '@/api/userService'
  export default {
    inject:['reload'],
    name: "SupplierService",
    data() {
      return {
      	pageSize:10,
      	importType:'SupplierBiz_BaseInfo_Template',
      	dialogVisiblelock:false,
      	lockUserName:'',
      	lockRealName:'',
      	options4:[],
      	handleId:null,
      	dialogVisible1:false,
      	dialogVisible2:false,
      	dialogVisible3:false,
      	dialogVisible4:false,
      	dialogVisible5:false,
      	pagetotal:null,
      	buttondatas:[
      	],
      	buttonshow:0,
        input1: '',
        input2: '',
        isShow:true,
        tableData: [],
        currentPage4: 1,
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        options1: [{
          value: null,
          label: '不限'
        }, {
          value: 'LEVEL_1',
          label: '一级'
        }, {
          value: 'LEVEL_2',
          label: '二级'
        }, {
          value: 'LEVEL_3',
          label: '三级'
        },
         {
          value: 'LEVEL_4',
          label: '四级'
        },
         {
          value: 'LEVEL_5',
          label: '五级'
        },],
        options2: [{
          value: null,
          label: '不限'
        }, {
          value: 'DRAFT',
          label: '待审核'
        }, {
          value: 'REJECTED',
          label: '已驳回'
        }, {
          value: 'AVAILABLE',
          label: '有效'
        }, {
          value: 'FROZEN',
          label: '已冻结'
        }, {
          value: 'EXPIRED',
          label: '已到期'
        }, {
          value: 'TERMINATED',
          label: '已终止'
        },],
        value1:'',
        value2:'',
        supplierId:'',
        routerQuery:''
      }
    },
    computed:{
    	 dataListHeight(){
      return this.$store.getters.dataListHeight;
   	 	}
    },
    components:{
    	importFile
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
				if(this.$route.query.status){
    		this.buttonshow=this.$route.query.status
	    	}
	    	this.getheader()
	    	this.requestData()
			}else if(this.routerQuery!=JSON.stringify(this.$route.query)){
				if(this.$route.query.status){
    		this.buttonshow=this.$route.query.status
	    	}
	    	this.getheader()
	    	this.requestData()
			}
    },
    methods: {
    	remoteMethod(query){
    		if (query !== '') {
          listName({name:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
    	},
    	query(){
    		this.currentPage4=1
    		this.requestData()
    		this.getheader()
    	},
    	Reset(){
				this.input2='' //供应商服务对象
    		this.input1=''					//供应商业务id
    		this.value1=''		//
    		this.query()
    	},
    	edithide(row){
    		if(this.buttonshow==0){
    			if(this.$authorities.SupplierBusinessUpdateRelevant&&row.manageId==this.$auth.user.id){
    				return true
    			}else{
    				return false
    			}
    		}else{
    			if(this.$authorities.SupplierBusinessUpdateRelevant){
    				return true
    			}else{
    				return false
    			}
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
	    showDialog(type, row) {
	      this.$refs[type].init(row);
	    },
    	isdialogVisible1(id){
    		this.handleId=id
    		this.dialogVisible1=true
    	},
    	isdialogVisible2(id){
    		this.handleId=id
    		this.dialogVisible2=true
    	},
    	isdialogVisible3(id){
    		this.handleId=id
    		this.dialogVisible3=true
    	},
    	isdialogVisible4(id){
    		this.handleId=id
    		this.dialogVisible4=true
    	},
    	isdialogVisible5(id){
    		this.handleId=id
    		this.dialogVisible5=true
    	},
    //	IDdelete//删除
	//	frozen//冻结
	//	reviewPassed//审核通过
//		reviewReject//审核不通过
//		submitReview//业务提审
//		terminated//终止
//		unfrozen//解冻
			isIDdelete(){
				IDdelete(this.handleId).then(res=>{
					if(res.data==1){
						this.$message({
		          message: '删除成功',
		          type: 'success'
		        });
		        this.dialogVisible3 = false
					}else{
						this.$message.error('删除失败');
		        this.dialogVisible3 = false
					}
					this.query()
				})
			},
			isfrozen(){
				frozen(this.handleId).then(res=>{
					if(res.data==1){
						this.$message({
		          message: '冻结成功',
		          type: 'success'
		        });	
		        this.dialogVisible1 = false
					}else{
						this.$message.error('冻结失败');
		        this.dialogVisible1 = false
					}
					this.query()
				})
			},
			issubmitReview(){
				submitReview(this.handleId).then(res=>{
					if(res.data==1){
						this.$message({
		          message: '业务提审成功',
		          type: 'success'
		        });
		        this.dialogVisible4 = false
					}else{
						this.$message.error('业务提审失败');
		        this.dialogVisible4 = false
					}
					this.query()
				})
			},
			isterminated(){
				terminated(this.handleId).then(res=>{
					if(res.data==1){
						this.$message({
		          message: '终止成功',
		          type: 'success'
		        });
		        this.dialogVisible2 = false
					}else{
						this.$message.error('终止失败');
		        this.dialogVisible2 = false
					}
					this.query()
				})
			},
			isunfrozen(){
				unfrozen(this.handleId).then(res=>{
					if(res.data==1){
						this.$message({
		          message: '解冻成功',
		          type: 'success'
		        });		
		        this.dialogVisible5 = false
					}else{
						this.$message.error('解冻失败');
		        this.dialogVisible5 = false
					}
					this.query()
				})
			},
    	getheader(){
    		countList(this.$route.query.supplierId?this.$route.query.supplierId:'').then(res=>{
    			let a= res.data.map((item,index)=>{
    				return Object.assign(item,{id:index})
    			})
    			this.buttondatas=a
    			
    		})
    	},
    	header_button_click(index){
    		this.currentPage4=1		//页码
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
    				this.pendingReview()
    			break;
    			case 2:
    				this.draft()
    			break;
    			case 3:
    			this.rejected()
    			break;
    			case 4:
    			this.frozen()
    			break;
    			case 5:
    			this.expired()
    			break;
    			case 6:
    			this.terminated()
    			break;
    		}
    	},
    	//有效
    	available(){
    		let a={
    			'branchNameId':this.input2, //供应商服务对象
    			'no':this.input1,						//供应商业务id
    			'pageNum':this.currentPage4,		//页码
    			'pageSize':this.pageSize,		//每页条
    			'level':this.value1,			//
    			'updatedSupplierBizStatus':this.value2,	//
    			'supplierId':this.$route.query.supplierId?this.$route.query.supplierId:'',
    		}
    		availableList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	//草稿
    	draft(){
    		let a={
    			'branchNameId':this.input2, //供应商服务对象
    			'no':this.input1,						//供应商业务id
    			'pageNum':this.currentPage4,		//页码
    			'pageSize':this.pageSize,		//每页条
    			'supplierId':this.$route.query.supplierId?this.$route.query.supplierId:'',
    			'level':this.value1,			//
    		}
    		draftList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
//  	已过期
    	expired(){
    		let a={
    			'branchNameId':this.input2, //供应商服务对象
    			'no':this.input1,						//供应商业务id
    			'pageNum':this.currentPage4,		//页码
    			'pageSize':this.pageSize,		//每页条
    			'supplierId':this.$route.query.supplierId?this.$route.query.supplierId:'',
    			'level':this.value1,			//
    		}
    		expiredList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	//已冻结
    	frozen(){
    		let a={
    			'branchNameId':this.input2, //供应商服务对象
    			'no':this.input1,						//供应商业务id
    			'pageNum':this.currentPage4,		//页码
    			'pageSize':this.pageSize,		//每页条
    			'supplierId':this.$route.query.supplierId?this.$route.query.supplierId:'',
    			'level':this.value1,			//
    		}
    		frozenList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
//  	待审核
    	pendingReview(){
    		let a={
    			'branchNameId':this.input2, //供应商服务对象
    			'no':this.input1,						//供应商业务id
    			'pageNum':this.currentPage4,		//页码
    			'pageSize':this.pageSize,		//每页条
    			'supplierId':this.$route.query.supplierId?this.$route.query.supplierId:'',
    			'level':this.value1,			//
    		}
    		pendingReviewList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
//  	已驳回
    	rejected(){
    		let a={
    			'branchNameId':this.input2, //供应商服务对象
    			'no':this.input1,						//供应商业务id
    			'pageNum':this.currentPage4,		//页码
    			'pageSize':this.pageSize,		//每页条
    			'supplierId':this.$route.query.supplierId?this.$route.query.supplierId:'',
    			'level':this.value1,			//
    		}
    		rejectedList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
//  	以终止
    	terminated(){
    		let a={
    			'branchNameId':this.input2, //供应商服务对象
    			'no':this.input1,						//供应商业务id
    			'pageNum':this.currentPage4,		//页码
    			'pageSize':this.pageSize,		//每页条
    			'supplierId':this.$route.query.supplierId?this.$route.query.supplierId:'',
    			'level':this.value1,			//
    		}
    		terminatedList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	editButtonshow(oldId){
    		if([0, 2, 3].includes(this.buttonshow)){
    			if(this.buttonshow==3&&oldId){
    				return false
    			}else{
    				return true
    			}
    		}else{
    			return false
    		}
    		
    	},
      handleClick(row) {
//    	console.log(row.date);
      	
        editingDetail(row.id).then(res=>{
      		if(res.code=='000000'){
					this.$router.push({
          name: 'EditBusiness',
          query:{
          	editId:row.id,
          	status:row.supplierBizStatus,
          	oldId:row.oldId
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
          name: 'BusinessDetail',
          query:{
          	detailId:row.id
          }
        })
      },
      gooldDetail(row){
      	 this.$router.push({
          name: 'BusinessDetail',
          query:{
          	detailId:row.oldId
          }
        })
      },
      gobusinessExamine(row){
      	pendingReview(row.id).then(res=>{
	    			if(res.data){
	    				this.$router.push({
			          name: 'BusinessExamine',
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
      goUpdata(row){
      	 this.$router.push({
          name: 'BusinessUpdata',
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
  .supplierServiceBox {
    width: 100%;
    .buttonBox {
    	/*display: flex;*/
    	/*flex-wrap: nowrap;*/
      margin-top: 10px;
      .el-button {
        /*width: 160px;*/
        /*height: 30px;*/
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