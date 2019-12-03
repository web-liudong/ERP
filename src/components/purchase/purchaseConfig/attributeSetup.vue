<template>
  <div class="CreatPurchaseOrder returnOrderBox">
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="Reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
 
        <div class="clearfix">
        	<div id="" class="clearfix" style="float: left;width: 50%;">
        		<div id="" style="float: left;width: 30%; text-align: right;line-height: 50px;">
        		组织机构编号：
        		</div>
        		<div id="" style="float: left;width: 50%;">
        			<el-input placeholder="组织机构编号" v-model="querys.no" clearable type="number"></el-input>
        		</div>
        	</div>
        	<div id="" class="clearfix" style="float: left;width: 50%;">
        		<div id="" style="float: left;width: 30%;text-align: right;line-height: 50px;">
        			组织机构名称：
        		</div>
        		<div id="" style="float: left;width: 70%;">
        			<el-select
        				style="padding: 5px;"
			          v-model="querys.name"
			          filterable
			          remote
			          reserve-keyword
			          placeholder="组织机构名称"
			          :remote-method="remoteMethod"
			          clearable>
			          <el-option
			            v-for="item in options4"
			            :key="item.id"
			            :label="item.name"
			            :value="item.name">
			          </el-option>
			        </el-select>
        		</div>       		
        	</div>
        </div>
        <div class="clearfix">
        	<div id="" class="clearfix" style="float: left;width: 50%;">
        		<div id="" style="float: left;width: 30%; text-align: right;line-height: 50px;">
        		组织机构性质：
        		</div>
        		<div id="" style="float: left;width: 50%;">
        			<el-select v-model="querys.organizationType" placeholder="请选择" style="padding: 5px;">
						    <el-option label="全部" value=""></el-option>
						    <el-option label="全资" value="FULL_CAPITAL"></el-option>
						    <el-option label="控股" value="HOLDING"></el-option>
						    <el-option label="参股" value="SHARE_HOLDING"></el-option>
						    <el-option label="加盟" value="JOIN_IN"></el-option>
						    <el-option label="特约供应商" value="SPECIAL_SUPPLIER"></el-option>
						  </el-select>
        		</div>
        	</div>
        	<div id="" class="clearfix" style="float: left;width: 50%;">
        		<div id="" style="float: left;width: 30%;text-align: right;line-height: 50px;">
        			状态：
        		</div>
        		<div id="" style="float: left;width: 70%;">
        			<el-select v-model="querys.organizationStatus" placeholder="请选择" style="padding: 5px;">
						    <el-option label="全部" value=""></el-option>
						    <el-option label="已启用" value="AVAILABLE"></el-option>
						    <el-option label="已禁用" value="FORBIDDEN"></el-option>
						  </el-select>
        		</div>       		
        	</div>
        </div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        
      </div>
      <el-table
          :data="tableData"
          border
          stripe
          :max-height="dataListHeight"
          style="width: 100%"
          size="small">
          <el-table-column
          	type="index"
            label="序号"
            :index="typeIndex"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="no"
            label="组织机构编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="组织机构名称"
            align="center">
          </el-table-column>
          <!--<el-table-column
            prop="gradeLevelName"
            label="供应商等级"
            align="center">
          </el-table-column>-->
          <el-table-column
            prop="organizationTypeText"
            label="组织机构性质"
            align="center">
          </el-table-column>
          <el-table-column
            prop="organizationStatusText"
            label="状态"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="230px"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small"  @click="downClick(scope.row.id)" v-if="$authorities.PurchaseAttributeSet">设置采购属性</el-button>
            		<!--<el-button  type="text" size="small" @click="downClick()">设置采购规则</el-button>-->
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
          :current-page="querys.pageNum"
          :page-size="querys.pageSize"
          layout="total, sizes,prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
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
		<el-dialog title="设置采购属性" :visible.sync="dialogTableVisible2" width="720px">
			<p class="rules_p">组织机构采购职能属性</p>
			<table class="rules_table" border="1" cellspacing="1" cellpadding="1" style="width: 100%;border:1px #e4e4e4;">
				<tr>
					<th>采购职能属性：</th>
					<td>
						<el-checkbox-group v-model="attributeData" style="padding-left: 20px;">
					    <el-checkbox label="ENTERPRISE_SELF">企业自采</el-checkbox>
					    <el-checkbox label="ENTERPRISE_GATHERING">企业集采</el-checkbox>
					  </el-checkbox-group>
					</td>
				</tr>
			</table>
			<div class="" style="box-sizing: border-box;padding: 50px;color: red;">
				说明：该设置用于标志当前组织机构承担的企业采购职能，直接影响采购单中的供应单位/供应商选取范围。请认真核对并设置！
			</div>
			<div class="" style="text-align: center;">
				<span slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click="isAttributeSet()">保 存</el-button>
		    <el-button @click="dialogTableVisible2 = false">取 消</el-button>
		  </span>
			</div>
			
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


  </div>
</template>

<script>
	import store from '@/store/store'
	import {
    fuzzySearch,
   }
  from '@/api/organizationManage'
	import {
		findAvailableSupplierList,
		findDraftSupplierList,
		findPendingReviewSupplierList,
		findRejectedSupplierList,
		count,
		fileList,//根据ID查询文件
		submitReviewSupplier,//提审
		deletebasic,
		editSupplierInfoDTOById
	} from '@/api/basicSupplier'
	import {
		attributeSet,
		organizationAllList,
		getAttribute
	} from '@/api/purchase/setUpPurchases'
import {getFileDownloadBatch} from "@/api/common/commonApi"
  
  export default {
    inject:['reload'],
    name: "AttributeSetup",
    data() {
      return {
      	tableIdIndex:'',
      	form:{
      		"firstIndex": "",
				  "purchaseRuleEnumList": [],
				  "secondIndex": "",
				  "thirdIndex": ""
      	},
      	attributeData:[],
      	querys:{
      		"no": '',
				  "name": "",
				  "organizationStatus": "",
				  "organizationType": "",
				  "pageNum": 1,
				  "pageSize": 10
      	},
      	priorityOptions:[],
      	options4:[],
      	dialogVisiblelock:false,
      	lockUserName:'',
      	lockRealName:'',
      	downId:"",
      	gridData:[],
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
        tableData: [],
        options1: [{
          value: 'CATEGORY',
          label: '品类授权'
        }, {
          value: 'BRAND',
          label: '品牌授权'
        }, {
          value: 'SKU',
          label: '商品授权'
        }],
        value1:'',
        value2:'',
        deleteId:'',
        deleteoldId:'',
        ArraignmentId:'',
      }
    },
    computed:{
    	priority(){
    		let a=this.form.purchaseRuleEnumList.map((item,index)=>{
    			return this.isLabel(item)
    		})
    		return a
    	},
    	options(){
    		let a=this.priority.map((item,index)=>{
    			return {value:'',option:this.priority}
    		})
    		return a
    	},
    	dataListHeight(){
      	return this.$store.getters.dataListHeight;
    	}
    },
    watch:{
    	priority(a,b){
    		let arr=a.map((item,index)=>{
    			return {value:'',option:this.priority}
    		})
    		this.priorityOptions=arr
    	}
    },
    created(){
    	this.requestData()
    },
    activated(){
			if(this.$route.params.isUpdate){
				this.requestData()
			}
    },
    methods: {
    	typeIndex(index) {
	 			return index + (this.querys.pageNum - 1) * 10 + 1;
	 			//这个是默认一页显示十条数据
			},
			isAttributeSet(){
				attributeSet(this.attributeData,this.tableIdIndex).then(res=>{
					if(res.data){
						this.$message({
			        message:'设置成功',
			        type: "success",
			      })
						this.dialogTableVisible2 = false
					}
				})
			},
    	remoteMethod(query) {
        if (query !== '') {
          let aa={name:query};
          fuzzySearch(aa).then(res=>{
            if(res.code=='000000'){
              this.options4=res.data;
            }
          })
        } else {
          this.options4 = [];
        }
      },
    	isLabel(item){
    		switch (item){
    			case 'CATEGORY':
    			return {value: 'CATEGORY',label: '品类授权'}
    				break;
    			case 'BRAND':
    			return {value: 'BRAND',label: '品牌授权'}
    				break;
    			case 'SKU':
    			return {value: 'SKU',label: '商品授权'}
    				break;
    		}
    	},
    	ruleChange(value){
    		console.log(value)
    	},
    	query(){
    		this.querys.pageNum=1
    		this.requestData()
    	},
    	Reset(){
    		this.querys={
      		"no": '',
				  "name": "",
				  "organizationStatus": "",
				  "organizationType": "",
				  "pageNum": 1,
				  "pageSize": 10
      	}
    		this.query()
    	},
    	downClick(id){
    		this.attributeData=[],
    		this.dialogTableVisible2=true
    		this.tableIdIndex=id
    		getAttribute(id).then(res=>{
    			this.attributeData=res.data
    		})
    	},
    	requestData(){
    		organizationAllList(this.querys).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	//可用
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.querys.pageSize=val
        this.requestData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.querys.pageNum=val
        this.requestData()
      },
      showHelp(){
        this.isShow=!this.isShow;
      }

    }
  }
</script>
<style scoped lang="less">
  .CreatPurchaseOrder {
  	.rules_p{
  		font-weight: 900;
  		font-size: 16px;
  		padding-bottom: 10px;
  		padding-left: 20px;
  	}
  	.rules_table{
  		th{
  			width: 150px;
  			height: 50px;
  			text-align:right;
  			font-weight: 900;
  		}
  	}
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
        .el-input {
          width: 200px;
          height: 40px;
          padding: 5px ;

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
      padding: 10px 0px;
    }
  }
</style>
<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
