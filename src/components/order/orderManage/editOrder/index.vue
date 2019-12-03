<template>
	<el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">
<div class="saleDown">
  <addhead headname="基本信息" style="margin-bottom: 10px;" iconName="iconbianjidingdan"></addhead>
  	
  		<div class="row_chunk">
  		<div class="chunk" >
  			<span><i class="requeryStar">*</i>项目：</span>
        <el-form-item prop="projectId">
         <el-select
				    v-model="form.projectId"
				    filterable
				    remote
				    clearable
				    reserve-keyword
				    placeholder="请输入"
				    @focus="options3.length>0?false:remoteMethod1('')"
				    :remote-method="remoteMethod1"
				    @change="userNamechange"
				    disabled
				    >
				    <el-option
				      v-for="item in options3"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
      	</el-form-item>
  		</div>
  		<div class="chunk" >
  			<span><i class="requeryStar">*</i>客户：</span>
	      <el-form-item prop="customerId" >
	        <el-select
					    v-model="form.customerId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    @focus="customerOptions.length==0?remoteCustomer(null):false"
					    :remote-method="remoteCustomer"
					    @change="customerChange"
					    disabled
					    >
					    <el-option
					      v-for="item in customerOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
  		</div>
  		<div class="chunk" style="width: 17%;">
  			<span>客户部门：</span>
        <el-form-item  >
	        <el-select
					    v-model="form.customerUserGroupId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    @focus="customerUserGroupOptions.length==0?remotecustomerUserGroup(null):false"
					    :remote-method="remotecustomerUserGroup"
					    @change="customerUserGroupChange"
					    >
					    <el-option
					      v-for="item in customerUserGroupOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
  		</div>
  		<div class="chunk" style="width: 16%;">
  			<span>采购人：</span>
        <el-form-item  >
	        <el-select
					    v-model="form.customerUserId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    @focus="purchaseOptions.length==0?remotePurchase(null):false"
					    :remote-method="remotePurchase"
					    @change="purchaseChange"
					    >
					    <el-option
					      v-for="item in purchaseOptions"
					      :key="item.userId"
					      :label="item.name"
					      :value="item.userId">
					    </el-option>
					  </el-select>
	      </el-form-item>
  		</div>
  		<div class="chunk" style="width: 16%;">
  			<span>采购人联系方式：</span>
        <el-form-item>
	        <el-input v-model="customerUserPhone" disabled></el-input>
	      </el-form-item>
  		</div>
  	</div>
     <div class="row_chunk">
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>收货人：</span>
        <el-form-item prop="recipientName">
	        <el-autocomplete
			      class="inline-input"
			      v-model="form.recipientName"
			      :fetch-suggestions="querySearch"
			      placeholder="请输入内容"
			      @select="handleSelect"
			      popper-class="down_cl"
			    ></el-autocomplete>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>收货人联系方式：</span>
	      <el-form-item  prop="recipientPhone">
	        <el-input v-model="form.recipientPhone" ></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk" style="width: 50%;">
  			<span style="flex: 0 0 15%;"><i class="requeryStar">*</i>收货地址：</span>
	        <!--<el-input v-model="receiptAddressText" type="hidden"  ref="recAddress"  @focus="showDialog('setAddress',receiptAddress)" style="width: 0px;height: 0px;"></el-input>-->
	        <div id="" @click="showDialog('setAddress',receiptAddress)" 
	        	style="cursor: pointer; width: 85%;border: 1px solid #dcdfe6;height: 40px;border-radius: 4px;box-sizing: border-box;overflow: hidden; text-overflow:ellipsis;white-space:nowrap">
	        	<span style="text-align: left;line-height: 40px;" :title="receiptAddressText">&nbsp;&nbsp;&nbsp;{{receiptAddressText}}</span>
	        	<el-input v-model="receiptAddressText" type="hidden"  ref="recAddress" style="width: 0px;height: 0px;"></el-input>
	        </div>
  		</div>
  	</div> 
    
    
    <div class="row_chunk">
  		<div class="chunk" >
  			<span>业务员：</span>
        <el-form-item>
	         <el-input v-model="staffName" disabled ></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span>期望配送日期：</span>
	      <el-form-item>
	        <el-date-picker type="date"
	        	style="width: 100%;"
	        	 placeholder="选择日期" 
	        	 v-model="form.expectedDeliveryDate"
	        	   value-format="yyyy-MM-dd" 
	        	   :picker-options="pickerOptions">
	        </el-date-picker>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>订单类型：</span>
        <el-form-item prop="orderType">
	        <el-select v-model="form.orderType" placeholder="订单类型" disabled>
	          <el-option
	            v-for="item in options1"
	            :key="item.value"
	            :label="item.label"
	            :value="item.value">
	          </el-option>
	        </el-select>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span>备注订单号：</span>
        <el-form-item>
	        <el-input v-model="form.memoOrderNo" disabled></el-input>
	      </el-form-item>
  		</div>
  	</div>
    
    
    <div class="row_chunk">
  		<div class="chunk" style="width: 50%;">
  			<span style="flex: 0 0 15%;">订单备注：</span>
        <el-form-item style="flex: 1;">
	        <el-input v-model="form.orderMemo" style="max-width: 100%;" placeholder="字数长度1~50"></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span></span>
	      <el-form-item>
			    <el-checkbox v-model="form.urgents">紧急订单</el-checkbox>
	      </el-form-item>
  		</div>
  	</div>
    <addhead headname="商品信息" iconName="iconshangpinxinxi"> 
    	<template slot="append">
    		<el-button ref="addRow"size="mini" icon="el-icon-plus" style="margin-left: 50px;" @click="addTableRow()">添加</el-button>
    		<el-checkbox v-model="useCustomerFlag" @change="customerLogChange"  style="padding: 0px 10px;">按客户购买记录选商品</el-checkbox>
    		<div class="operation_btn" @click="getExcelBefore()"><i class="iconfont icondaochu"></i>导出</div>
    		<div class="operation_btn" @click="getStock()">获取库存和成本</div>
    		<span style="font-size: 12px;color: red;" v-show="warehouseName1">（仓库：{{warehouseName1}}）</span>
    	</template>
    </addhead>
    
    <el-table
      :data="form.itemList"
      border
      stripe
      :row-style="selectedHighlight"
      style="width: 100%"
      size="small">
      <el-table-column
        label="操作"
        min-width="40"
        fixed="left"
        align="center">
        <template slot-scope="scope">
        		<el-button  type="text" size="small" @click="deleteRow(scope)">删除</el-button>
        		<el-button  type="text" size="small" @click="remarkRow(scope)" v-if="scope.row.skuId" style="margin-left: 0px;">备注</el-button>
            <span v-else style="display: inline-block;">备注</span>
        </template>
      </el-table-column>
      <el-table-column
        label="条目号"
        min-width="38"
        fixed="left"
        align="center">
         <template slot-scope="scope">
        		<span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      
      <el-table-column
        min-width="180"
        align="center">
        <template slot="header" slot-scope="scope">
        			<span><i style="color: red;">*</i>商品名称</span>
      	</template>
        <template slot-scope="scope">
				  <el-select
						    v-model="scope.row.skuId"
						    filterable
						    remote
						    clearable
						    reserve-keyword
						    placeholder="请输入"
						    :remote-method="remoteLikeOrder"
						    @change="goodsNamechange"
						    ref="selectRow"
						    @focus="tableIsRow=scope.$index"
						    :loading="loading"
						    @keyup.enter.native="addTableRow()"
						    @clear="clearGoods(scope.$index)"
						    :title="scope.row.skuName"
						    style="width: 100%;max-width: 100%;"
						    >
						    <el-option
						      v-for="item in scope.row.options"
						      :key="item.skuId"
						      :label="item.skuNo+' '+item.skuName"
						      :value="item.skuId">
						    </el-option>
						  </el-select>
        </template>
        
      </el-table-column>
      <el-table-column
        prop="skuNo"
        label="商品编号"
        min-width="38"
        align="center">
      </el-table-column>
      <el-table-column
        prop="skuModel"
        label="规格型号"
         min-width="70"
        align="center">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
         min-width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="websitePrice"
        label="官网售价"
        min-width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="negotiatedPrice"
        label="项目限价"
        min-width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="negotiatedDiscount"
        label="项目折扣率%"
        min-width="50"
        align="center">
      </el-table-column>
      <el-table-column
      	min-width="60"
        align="center">
        <template slot="header" slot-scope="scope">
    			<span><i style="color: red;">*</i>本次折扣率%</span>
  			</template>
        <template slot-scope="scope">
        	<el-input v-model="scope.row.currentDiscount" :disabled="form.orderType==1" placeholder="字数长度1~50" type="number" @blur="tablechange(scope.row,'currentDiscount')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
      	min-width="60"
        align="center">
        <template slot="header" slot-scope="scope">
    			<span><i style="color: red;">*</i>本次售价</span>
  			</template>
        <template slot-scope="scope">
        	<el-input v-model="scope.row.currentPrice" :disabled="form.orderType==1" placeholder="字数长度1~50" type="number" @blur="tablechange(scope.row,'currentPrice')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
      	min-width="50"
        align="center">
        <template slot="header" slot-scope="scope">
    			<span><i style="color: red;">*</i>数量</span>
  			</template>
        <template slot-scope="scope">
        	<el-input v-model="scope.row.itemQty"  placeholder="字数长度1~50" type="number" @blur="tablechange(scope.row,'itemQty')"></el-input>
        </template>
        
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="小计(￥)"
        min-width="50"
        align="center">
        <template slot-scope="scope">
            	<el-input v-model="scope.row.totalPrice"  placeholder="字数长度1~50" type="number" @blur="tablechange(scope.row,'totalPrice')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="availableQty"
        label="可用库存"
        min-width="50"
        align="center">
        <template slot-scope="scope">
        	{{scope.row.availableQty?scope.row.availableQty:'--'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="costTax"
        label="成本价（￥）"
        min-width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="previousPrice"
        label="上次售价"
        align="center">
      </el-table-column>
      
    </el-table>
          	<div class="clearfix">
					  	<div class="" style="width: 200px; float: right;height: 100px;color: #000000;">
					  		<p v-if="form.orderType==3" style="font-size: 12px;font-weight: 500;padding-top: 30px;">中标价格：&nbsp;￥{{winningPrice}}</p>
					  		<p style="font-size: 12px;font-weight: 500;padding-top: 30px;">商品合计：&nbsp;￥{{total}}</p>
					  		<p v-if="form.orderType!=3" style="font-size: 12px;font-weight: 500;padding-top: 20px;">&nbsp;&nbsp;&nbsp;应付款：&nbsp;￥{{form.orderType==1?0:total}}</p>
					  	</div>
					  </div>	
  <div style="text-align: center;padding: 30px;">
  	<el-button type="primary" @click="submitForm('form')">保  存</el-button>
    <el-button type="primary" @click="Editorder()">取  消</el-button>
  </div>
  
  <el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisiblelock"
		  width="30%"
		  >
		  <span>删除之后，客户的订单中将不再展示当前商品，确定要删除当前商品条目吗？</span>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="dialogVisiblelock=false">取 消</el-button>
		    <el-button type="primary" @click="isDelete()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="选择仓库" :visible.sync="dialogWarehouseList" width="474px">
	  <div class="row_chunk">
			<div class="chunk" style="width: 100%;">
  			<span style="flex: 0 0 150px;"><i class="requeryStar">*</i>选择要查询的仓库：</span>
        <el-form-item>
	         <el-select
				    v-model="warehouseId"
				    filterable
				    clearable
				    placeholder="请选择"
				    @change="warehouseChange"
				    >
				    <el-option
				      v-for="item in warehouseList"
				      :key="item.id"
              :label="item.name"
              :value="item.id">
				    </el-option>
				  </el-select>
      	</el-form-item>
  		</div>
  	</div>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogWarehouseList = false">取 消</el-button>
	    <el-button type="primary" @click="getWmsSkuStock()">确 定</el-button>
	  </div>
	</el-dialog>
	<el-dialog title="备注" :visible.sync="dialogFormVisible">
		<el-form-item label="商品：" required>
	        {{goodsText}}
	  </el-form-item>
	  <el-form-item label="备注：">
	       <el-input type="textarea" :rows="5" v-model="remarkText" placeholder="输入姓名，字数1~15以内" style="width: 80%;"></el-input>
	  </el-form-item>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取 消</el-button>
	    <el-button type="primary" @click="isRemarkRow()">确 定</el-button>
	  </div>
	</el-dialog>
		<el-dialog
		  title="提示"
		  :visible.sync="isZeroTips"
		  width="30%"
		  >
		  <span>订单中包含0元商品，请确定是否要保存订单</span>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="isZeroTips=false">取 消</el-button>
		    <el-button type="primary" @click="submitFromApi()">确 定</el-button>
		  </span>
		</el-dialog>
	<setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
</div>
</el-form>
</template>

<script>
  import addhead from '@/components/common/head/head'
  import {
		nameList,
	} from '@/api/projectController/projectController'
	import {
		customerNameList,
		customerUserNameList,
		consigneeInformation,
		likeOrderItemList,
		addOrder,
		editOrder,
		getDetailItem,
		getDetail,
		secondEditOrder,
		firstEditOrder,
		customerUserGroupList,
		getWms,
		getWarehouseList,
		getWmsSkuStock,
		findCostPrice,
		permission
	} from '@/api/order/saleDown'
  import './index.less'
  import setAddress from "../../child/set_address";
  import {
		nameRepeatedCheck,
		addProjrct,
	} from '@/api/projectController/projectController'
	import {returnFloat,returnFloatFour,returnFloatTwoFour} from '@/utils/index'
	import qs from 'qs';
  export default {
  	name:'EditOrder',
  	inject:['close'],
    data() {
    	var projectNameRule= (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入项目名称'));
        }
        nameRepeatedCheck({name:value}).then(res=>{
        	if(res.data){
        		callback(new Error('项目名称已存在'));
        	}else{
        		callback()
        	}
        })
        
      };
    	
      return {
      	useCustomerFlag:false,
      	dialogWarehouseList:false,
      	warehouseList:[],
      	warehouseId:'',
      	warehouseName:'',
      	warehouseName1:'',
      	pickerOptions:{
      		disabledDate(time){
      			return time.getTime() < Date.now() - 8.64e7;
      		}
      	},
      	isZeroTips:false,
      	zero:0,
      	one:1,
      	receiptAddressText:"",
      	receiptAddress:null,//收货地址
      	remarkRowIndex:'',
      	goodsText:'',
      	remarkText:'',
      	dialogFormVisible:false,
      	tableIsRow:0,
      	customerUserPhone:'',
      	staffName:'',
      	dialogVisiblelock:false,
      	value1:'0',
      	options1: [ {
          value: '0',
          label: '常规订单'
        }, {
          value: '1',
          label: '赠品订单'
        }, {
          value: '2',
          label: '积分订单'
        }, {
          value: '3',
          label: '竞价订单'
        }],
        winningPrice:'',
        form:{
        	itemList:[{
//      		skuName:'',
//      		currentDiscount:0,//本次折扣
//      		currentPrice:0,//本次售价
//      		itemMemo:'',//详情备注
//      		itemQty:0,//购买数量
//      		previousPrice:'',//前一次售价
//      		skuId:'',//商品id
//      		options:[],
//      		skuModel:'',//规格型号
//      		unit:'',//单位
//      		websitePrice :0,//官网售价
//      		negotiatedPrice:'',//项目售价
//      		negotiatedDiscount:'',//项目折扣
//      		amount:0,//小计
        	}],
        	customerUserGroupId:'',//客户部门id
        	customerId:'',//客户id
          customerUserId:'',//客户采购人id
          deliveryMemo:'',//配送备注
          expectedDeliveryDate:'',//期望配送日期
          orderMemo:'',//订单备注
          orderType:'',//订单类型（0：常规订单，1：赠品订单，2：积分订单）
          packageMemo:'',//打包备注
          packageType:'',//包装信息（0：单独包装，1：统一包装）
          projectId:'',//项目id
          receiveType:'',//签收信息（0：各自签收，1：统一签收）
          recipientAddressProvinceId:'',//省id
          recipientAddressCityId:'',//市id
          recipientAddressCountyId:'',//县id
          recipientAddressLine:'',//收货详细地址
          recipientName:'',//收货人姓名
          recipientPhone:'',//收货人手机号
          staffId:'',//业务员id
          urgents:false,//是否紧急（0：否，1：是）
          urgent:'',//是否紧急（0：否，1：是）
          version:'',//订单版本
          memoOrderNo:'',//外部订单号
          payType:0,
        },
        options4:[],
        options3:[],
        customerOptions:[],
        customerUserGroupOptions:[],
        purchaseOptions:[],
        rules:{
          orderType: [
            { required: true,message: '请选择订单类型', trigger: 'change'},
          ],
          projectId: [
            { required: true,message: '请选择项目', trigger: 'change'},
          ],
          customerId: [
            { required: true,message: '请选择项目', trigger: 'change'},	
          ],
          customerUserId: [
            { required: true,message: '请选择采购人', trigger: 'blur'},	
          ],
          recipientName: [
            { required: true,message: '请输入收货人姓名', trigger: 'change'},	
          ],
          recipientPhone:[
          	{ required: true,message: '请输入收货人联系方式', trigger: 'blur'},	
          ],
        },
        realName:'',
        realName1:'',
        realName2:'',
        deleteIndex:null,
        loading:false,
        restaurants:[],
        routerQuery:'',
        repeatArr:[],
      };
    },
    components:{
      addhead,
      setAddress
    },
    created(){
    	let thatt=this
      document.onkeydown=function(){
      	var key =window.event.keyCode
      	if(key ==13){
      		thatt.addTableRow()
      		return false
      	}
      }
      this.accordingToIdGet()
//    this.receiptAddress = {
//          province:{id:res.data.recipientAddressProvinceId},
//          city:{id:res.data.recipientAddressCityId},
//          county:{id:res.data.recipientAddressCountyId},
//          address:res.data.recipientAddress,
//          receiptAddress:res.data.customerReceiptAddress
//        };
    },
    activated(){
			if(this.routerQuery!=JSON.stringify(this.$route.query)){
	    	this.accordingToIdGet()
			}
    },
    filter:{
    	linlai(value){
    		if(value==''){
    			return 0
    		}
    	}
    },
     mounted() {
    },
    watch:{
    	tableIsRow(a,b){
    		console.log(a)
    	},
    	'form.urgents':{
				handler:function(a,b){
					if(a){
						this.form.urgent=1
					}else{
						this.form.urgent=0
					}
				},
				deep:true
			},
			'form.customerId':{
    		handler:function(a,b){
					if(!a){
						this.useCustomerFlag=false
					}
				},
				deep:true
    	},
    },
    computed:{
    	total(){
    		let a=0
    		this.form.itemList.map((item)=>{
    			a+=parseFloat(item.totalPrice)
    		})
    		return returnFloat(a)
    	}
    },
    methods: {
    	selectedHighlight({ row, rowIndex }) {
    		if(this.repeatArr.includes(row.skuNo)||parseFloat(row.currentDiscount)>999){
    			return {
	          "background-color": "#F56C6C"
	        };
    		}
    	},
    	customerLogChange(value){
    		
    		if(value){
    			if(this.form.projectId&&this.form.customerId){
    				permission(this.form.projectId,this.form.customerId).then(res=>{
    					if(!res.data){
    						this.$message({
					        message:'当前客户无购买记录',
					        type: 'error', 
					      })
    						this.useCustomerFlag=false
    					}
    				}).catch(rej=>{
	    					this.useCustomerFlag=false
	    				})
	    		}else{
	    			this.useCustomerFlag=false
	    			this.$message({
					        message:'请先选择项目和客户',
					        type: 'error', 
					      })
	    		}
    		}
    	},
    	getExcelBefore(){
    		if(this.form.itemList.length>=1&&this.form.itemList[0].skuId){
    			this.getExcel(this.form.itemList)
    		}else{
    			this.$message({
					        message:'请选择商品',
					        type: 'error', 
					      })
    		}
    	},
    	
    	getExcel(res) {
			    require.ensure([], () => {
			        const { export_json_to_excel } = require('../../../../../static/excel/Export2Excel.js')
			        const tHeader = ['商品编号', '商品名称','单位','数量','价格']
			        const filterVal = ['skuNo', 'skuName','unit','itemQty','currentPrice']
			        const list = res
			        const data = this.formatJson(filterVal, list)
			        export_json_to_excel(tHeader, data, '商品明细')
			    })
			},
			
			formatJson(filterVal, jsonData) {
			    return jsonData.map(v => filterVal.map(j => v[j]))
			},
			getStock(){
				let filterSkuIds=this.form.itemList.filter(item=>item.skuId)
				if(!filterSkuIds[0]){
					this.$message({
					        message:'当前单据还未添加商品，请先添加商品。',
					        type: 'error', 
					      })
					return false
				}
				getWms(this.$auth.user.userPosts[0].organizationId).then(res=>{
					if(res.data.useLeadingWMS){
						this.getWarehouseList()
					}else{
						this.$message({
					        message:'当前账号所属组织机构未启用WMS，无法查询库存情况。',
					        type: 'error', 
					      })
					}
				})
			},
			getWarehouseList(){
				getWarehouseList(this.$auth.user.userPosts[0].organizationId).then(res=>{
					if(res.data.length>1){
						this.warehouseList=res.data
						this.dialogWarehouseList=true
					}else{
						this.warehouseId=res.data[0].id
						this.warehouseName=res.data[0].name
						this.getWmsSkuStock()
					}
					
				})
			},
			getWmsSkuStock(){
				if(this.warehouseId){
					this.warehouseName1=this.warehouseName
					let ids=this.form.itemList.map(item=>{
						if(item.skuId){
							return item.skuId
						}
					})
					let a={
						skuIds: ids,
	        	warehouseId: this.warehouseId
					}
					var getWmsSkuStock1 = new Promise((resolve,reject)=>{
							getWmsSkuStock(a).then(res=>{
							this.form.itemList.map(item=>{
								item.availableQty=null
								res.data.map(it=>{
									if(item.skuId==it.skuId){
										item.availableQty=it.availableQty.toString()
									}
								})
							})
							resolve()
						})
					})
					var findCostPrice1 = new Promise((resolve,reject)=>{
						findCostPrice(a).then(res=>{
							this.form.itemList.map(item=>{
								item.costTax=null
								res.data.map(it=>{
									if(item.skuId==it.skuId){
										item.costTax=it.costTax//含税
									}
								})
							})
							resolve()
						})
					})
					Promise.all([getWmsSkuStock1,findCostPrice1]).then(res=>{
						this.dialogWarehouseList=false
					})
				}else{
					this.$message({
					        message:'请选择仓库',
					        type: 'error', 
					      })
				}
			},
			warehouseChange(value){
				let seccuseOneArr=this.warehouseList.filter(item=>item.id==value)
				console.log(seccuseOneArr)
				this.warehouseName=seccuseOneArr[0].name
			},
    	Editorder(){
    		this.close()
    	},
			accordingToIdGet(){
				this.routerQuery=JSON.stringify(this.$route.query)
				getDetailItem(this.$route.query.editId).then(res=>{
					let a=res.data.map((item,index)=>{
						let b={
							options:[{
							skuName:item.skuName,
							skuNo:item.skuNo,
							skuId:item.skuId
							}]
						}
						item.currentDiscount= this.isformOrderType(returnFloat(item.currentDiscount))
						item.negotiatedDiscount=returnFloat(item.negotiatedDiscount)
						item.currentPrice= this.isformOrderType(returnFloatFour(item.currentPrice))
						item.amount= this.isformOrderType(returnFloatFour(item.amount))
						item.totalPrice= this.isformOrderType(returnFloat(item.amount))
						
						item.availableQty= null
						item.costTax= null
						Object.assign(item,b)
						return item
					})
					
					this.form.itemList=a
					console.log(this.form.itemList)
					
				})
				getDetail(this.$route.query.editId).then(res=>{
					let a=res.data
					this.form.customerId=a.customerId
					this.form.customerUserGroupId=a.customerUserGroupId>0?a.customerUserGroupId:''
					this.form.customerUserId=a.customerUserId==0?'':a.customerUserId
					this.form.deliveryMemo=a.deliveryMemo
					this.form.expectedDeliveryDate=a.expectedDeliveryDate
					this.form.orderMemo=a.orderMemo
					this.form.orderType=a.orderType!=null?a.orderType.toString():''
					this.form.packageMemo=a.packageMemo
					this.form.packageType=a.packageType!=null?a.packageType.toString():''
					this.form.projectId=a.projectId
					this.form.receiveType=a.receiveType!=null?a.receiveType.toString():''
					this.form.recipientAddressProvinceId=a.recipientAddressProvinceId
					this.form.recipientAddressCityId=a.recipientAddressCityId
					this.form.recipientAddressCountyId=a.recipientAddressCountyId
					this.form.recipientAddressLine=a.recipientAddressLine
					this.form.recipientName=a.recipientName
					this.form.recipientPhone=a.recipientPhone
					this.winningPrice= returnFloat(a.amount)
					this.form.staffId=a.staffId
					this.form.payType=a.payType
					this.form.urgents=a.urgent==0?false:true
					this.form.urgent=a.urgent
					this.form.memoOrderNo=a.memoOrderNo
					this.customerUserPhone=a.customerUserPhone
					this.staffName=a.staffName
					this.form.version=a.version
					this.receiptAddressText=a.customerReceiptAddress
				  this.receiptAddress = {
          province:{id:a.recipientAddressProvinceId},
          city:{id:a.recipientAddressCityId},
          county:{id:a.recipientAddressCountyId},
          address:a.recipientAddressLine,
          receiptAddress:a.customerReceiptAddress
        	};
        	this.options3=[{
        		name:a.projectName,
        		id:a.projectId
        	}]
        	this.customerOptions=[{
        		name:a.customerName,
        		id:a.customerId       		
        	}]
        	if(a.customerUserId>0){
        		this.purchaseOptions=[{
	        		name:a.customerUserName,
	        		userId:a.customerUserId  
	        	}]
        	}
        	if(a.customerUserGroupId>0){
        		this.customerUserGroupOptions=[{
	        		name:a.customerUserGroupName,
	        		id:a.customerUserGroupId  
	        	}]
        	}
        	
        	if(this.form.customerUserId){
        		this.getConsigneeInformation(this.form.customerUserId)
        	}
        	
					
				})
			},
    	showDialog(type, row) {
	      this.$refs[type].init(row);
	    },
    	dialogCallback(res) {
//	      console.log(res);
//	      recipientAddressProvinceId:'',//省id
//        recipientAddressCityId:'',//市id
//        recipientAddressCountyId:'',//县id
//        recipientAddressLine:'',//收货详细地址
       this.form.recipientAddressLine=res.address
       this.form.recipientAddressProvinceId=res.province.id
       this.form.recipientAddressCityId=res.city.id
       this.form.recipientAddressCountyId=res.county.id
       this.receiptAddressText=res.receiptAddress
       this.receiptAddress = {
          province:{id:res.province.id},
          city:{id:res.city.id},
          county:{id:res.county.id},
          address:res.address,
          receiptAddress:res.receiptAddress
        	};
//	      Object.assign(this.receiptAddress, res);
//	      this.tableData.customerReceiptAddress = res.receiptAddress;
    	},
    	deleteRow(index){
    		this.deleteIndex=index.$index
    		if(this.form.itemList.length>1){
    			if(this.form.itemList[this.deleteIndex].skuId){
    				this.dialogVisiblelock=true
    			}else{
    				this.isDelete()
    			}
    		}else{
    			this.$message({
					        message:'仅剩一条，不可删除',
					        type: 'error', 
					      })
    		}
    	},
    	remarkRow(scope){
    		this.goodsText=scope.row.skuName
    		this.remarkRowIndex=scope.$index
    		this.dialogFormVisible=true
    		this.remarkText=scope.row.itemMemo
    	},
    	isRemarkRow(){
    		if(this.remarkText){
    			if(this.remarkText.length>15){
	    			this.$message({
						        message:'备注字数在15字以内',
						        type: 'error', 
						      })
	    		}else{
	    			this.dialogFormVisible=false
	    		this.form.itemList[this.remarkRowIndex].itemMemo=this.remarkText
	    		}
    		}else{
    			this.dialogFormVisible=false
    		}
    		
    	},
    	isDelete(){
    		this.form.itemList.splice(this.deleteIndex,1)
    		this.dialogVisiblelock=false
    	},
    	addTableRow(){
    		if(this.form.orderType==1){
    			this.tablePush()
    		}else{
    			if(this.form.itemList.length>0){
	    			let lastrow=this.form.itemList[this.form.itemList.length-1]
		    		if(lastrow.skuId){
		    			this.tablePush()
		    		}
	    		}else{
	    			this.tablePush()
	    		}
    		}
    	},
    	tablePush(){
    		console.log(111)
    		let a={
	    				skuName:'',
	        		currentDiscount:0,//本次折扣
	        		currentPrice:0,//本次售价
	        		itemMemo:'',//详情备注
	        		itemQty:0,//购买数量
	        		previousPrice:'',//前一次售价
	        		skuId:'',//商品id
	        		options:[],
	        		skuModel:'',//规格型号
	        		unit:'',//单位
	        		websitePrice :0,//官网售价
	        		negotiatedPrice:'',//项目售价
	        		negotiatedDiscount:'',//项目折扣
	        		amount:0,//小计
	        		totalPrice:0,
	        		availableQty:'',//可用库存
	        		costTax:'',
	        	}
	    			this.form.itemList.push(a)
	    			setTimeout(()=>{
	    				this.$refs.selectRow.focus()
	    			},500)
    	},
    	tablechange(row,b){
    		if(b=='currentDiscount'){
    			row[b]= this.isformOrderType(returnFloat(row[b]))
    			row.currentPrice=this.isformOrderType(returnFloatFour((row.currentDiscount/100)*row.websitePrice))
    			row.amount=this.isformOrderType(returnFloatFour(row.currentPrice*row.itemQty))
    			row.totalPrice=this.isformOrderType(returnFloat(row.currentPrice*row.itemQty))
    		}
    		if(b=='currentPrice'){
    			row[b]= this.isformOrderType(returnFloatFour(row[b]))
    			row.currentDiscount= this.isformOrderType(returnFloat((row.currentPrice/row.websitePrice)*100))
    			row.amount= this.isformOrderType(returnFloatFour(row.currentPrice*row.itemQty))
    			row.totalPrice= this.isformOrderType(returnFloat(row.currentPrice*row.itemQty))
    		}
    		if(b=='itemQty'){
    			row.itemQty=parseInt(row[b])>0?parseInt(row[b]):1
    			row.amount= this.isformOrderType(returnFloatFour(row.currentPrice*row.itemQty))
    			row.totalPrice= this.isformOrderType(returnFloat(row.currentPrice*row.itemQty))
    		}
    		if(b=='totalPrice'){
    			row.amount= this.isformOrderType(returnFloatFour(row[b]))
    			row[b]= this.isformOrderType(returnFloat(row[b]))
    			row.currentPrice= this.isformOrderType(returnFloatFour(row.amount/row.itemQty))
    			row.currentDiscount= this.isformOrderType(returnFloat((row.currentPrice/row.websitePrice)*100))
    		}
    	},
    	isformOrderType(value){
    		return this.form.orderType==1?0:value
    	},
    	querySearch(queryString, cb) {
    		console.log(queryString)
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      remotecustomerUserGroup(query){
      	let data=qs.stringify({departmentName:query})
      	if(this.form.customerId){
      			customerUserGroupList(this.form.customerId,data).then(res=>{
	          	this.customerUserGroupOptions=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个客户',
				        type: 'warning', 
				      })
      		}
      },
      customerUserGroupChange(value){
      	if(value){
      		this.remotePurchase()
      	}
      		this.form.customerUserId=''
      		this.purchaseOptions=[]
      		this.customerUserPhone=''
	    		this.staffName=''
	    		this.form.staffId=''
	    		this.staffDis=false
	    		this.restaurants=[]
	    		this.clearPurchaseContent()
      },
      purchaseChange(value){
      	console.log('采购人',value)
				if(value){
					let a=this.purchaseOptions.filter((item,index)=>{
	    			return item.userId==value
	    		})
					console.log(a)
	    		this.customerUserPhone=a[0].phone
	    		this.staffName=a[0].staffName
	    		this.form.staffId=a[0].staffId
	    		this.clearPurchaseContent()
	    		this.getConsigneeInformation(a[0].userId)
				}else{
					this.customerUserPhone=''
	    		this.staffName=''
	    		this.form.staffId=''
	    		this.purchaseOptions=[]
	    		this.restaurants=[]
	    		this.clearPurchaseContent()
				}    		
      },
      getConsigneeInformation(value){
      	consigneeInformation(value).then(res=>{
    			console.log(res)
    			let a=res.data.map((item)=>{
    				let b={value:item.recipientName+'  '+item.recipientPhone+'  '+item.provinceName+item.cityName+item.countyName}
    					Object.assign(item, b)
    				return item
    			})
    			this.restaurants=a
    		})
      },
      customerChange(value){
      	console.log('kehu',value)
      	this.form.customerUserId=''
    		this.purchaseOptions = [];
    		this.customerUserGroupOptions=[]
				this.form.customerUserGroupId=''
    		this.customerUserPhone=''
	    		this.staffName=''
	    		this.form.staffId=''
	    		this.restaurants=[]
      	this.clearPurchaseContent()    
      	if(value){
      		this.remotecustomerUserGroup()
      		if(this.useCustomerFlag){
	      		permission(this.form.projectId,this.form.customerId).then(res=>{
	    					if(!res.data){
	    						this.$message({
						        message:'当前客户无购买记录',
						        type: 'error', 
						      })
	    						this.useCustomerFlag=false
	    					}
	    				}).catch(rej=>{
	    					this.useCustomerFlag=false
	    				})
	      	}
      	}
      },
      clearPurchaseContent(){
      	this.form.recipientName=''
        this.form.recipientPhone=''
        this.receiptAddress = {
            province:'',
            city:'',
            county:'',
            address:'',
            receiptAddress:''
          };
	      this.form.recipientAddressLine=''
	      this.form.recipientAddressProvinceId=''
	      this.form.recipientAddressCityId=''
	      this.form.recipientAddressCountyId=''
	      this.receiptAddressText=''
      },      
      handleSelect(item) {
        this.form.recipientName=item.recipientName
        this.form.recipientPhone=item.recipientPhone
        this.receiptAddress = {
            province:{id:item.provinceId},
            city:{id:item.cityId},
            county:{id:item.countyId},
            address:item.addressLine,
            receiptAddress:item.provinceName+'-'+item.cityName+'-'+item.countyName+'-'+item.addressLine
          };
	      this.form.recipientAddressLine=item.addressLine
	      this.form.recipientAddressProvinceId=item.provinceId
	      this.form.recipientAddressCityId=item.cityId
	      this.form.recipientAddressCountyId=item.countyId
	      this.receiptAddressText=item.provinceName+'-'+item.cityName+'-'+item.countyName+'-'+item.addressLine
          
          
      },
      goodsNamechange(value){
      	if(value){
      		let trf=this.form.itemList.some((item,index)=>{
	      		return item.skuId==value&&this.tableIsRow!=index
	      	})
	      	if(trf){
	      		this.$message({
					        message:'商品重复',
					        type: 'error', 
					      })
	      		this.clearGoods(this.tableIsRow)
	      	}else{
	      		let a=this.form.itemList[this.tableIsRow].options.filter((item,index)=>{
	    			return item.skuId==value
		    		})
		      	this.form.itemList[this.tableIsRow].skuModel=a[0].skuModel
		      	this.form.itemList[this.tableIsRow].skuNo=a[0].skuNo
		      	this.form.itemList[this.tableIsRow].unit=a[0].unit
		      	this.form.itemList[this.tableIsRow].websitePrice=a[0].websitePrice
		      	this.form.itemList[this.tableIsRow].negotiatedPrice=a[0].negotiatedPrice
		      	this.form.itemList[this.tableIsRow].negotiatedDiscount=a[0].negotiatedDiscount
		      	this.form.itemList[this.tableIsRow].previousPrice=a[0].previousPrice
		      	this.form.itemList[this.tableIsRow].skuName=a[0].skuName
		      	this.form.itemList[this.tableIsRow].currentDiscount=  this.isformOrderType(returnFloat((a[0].currentPrice?a[0].currentPrice:a[0].projectPrice/a[0].websitePrice)*100))
		      	this.form.itemList[this.tableIsRow].currentPrice=  this.isformOrderType(returnFloatFour(a[0].currentPrice?a[0].currentPrice:a[0].projectPrice))
		      	this.form.itemList[this.tableIsRow].itemQty= 1
		      	this.form.itemList[this.tableIsRow].amount= this.isformOrderType(returnFloatFour(a[0].currentPrice?a[0].currentPrice:a[0].projectPrice*1))
		      	this.form.itemList[this.tableIsRow].totalPrice= this.isformOrderType(returnFloat(a[0].currentPrice?a[0].currentPrice:a[0].projectPrice*1))
	      	}
      	}
      	this.form.itemList[this.tableIsRow].availableQty=null
      	this.form.itemList[this.tableIsRow].costTax=null
      	
      },
      clearGoods(a){
          this.form.itemList[a].skuName=''
          this.form.itemList[a].skuNo=''
      		this.form.itemList[a].currentDiscount=0
      		this.form.itemList[a].currentPrice=0
      		this.form.itemList[a].itemMemo=''
      		this.form.itemList[a].itemQty=''
      		this.form.itemList[a].previousPrice=''
      		this.form.itemList[a].skuId=''
      		this.form.itemList[a].options=[]
      		this.form.itemList[a].skuModel=''
      		this.form.itemList[a].unit=''
      		this.form.itemList[a].websitePrice=0
      		this.form.itemList[a].negotiatedPrice=''
      		this.form.itemList[a].negotiatedDiscount=''
      		this.form.itemList[a].amount=0
      		this.form.itemList[a].totalPrice=0
      },
    	userNamechange(value){
    		console.log('xiangmu',value)
    			this.form.customerId=''
    			this.form.customerUserId=''
    			this.customerOptions=[]
    			this.customerUserGroupOptions=[]
				this.form.customerUserGroupId=''
    			this.purchaseOptions = [];
    			this.customerUserPhone=''
	    		this.staffName=''
	    		this.form.staffId=''
	    		this.restaurants=[]
    			this.clearPurchaseContent()
    	},
    	remoteLikeOrder(query) {
    		
        if (query !== '') {
        	
          if(this.form.customerId&&this.form.projectId){
          	this.loading = true
          	likeOrderItemList({skuName:query,customerId:this.form.customerId,projectId:this.form.projectId,useCustomerFlag:this.useCustomerFlag}).then(res=>{
          	this.form.itemList[this.tableIsRow].options=res.data
          	this.loading = false
          	}).catch(rej=>{
          		this.loading = false
          	})
          }else{
          	this.$message({
				        message:'请选择项目和客户',
				        type: 'warning', 
				      })
          }
        } else {
          this.options4 = [];
        }
      },
      remoteMethod1(query){
          nameList({name:query}).then(res=>{
          	this.options3=res.data
          })
      },
      remoteCustomer(query){
      	if (query !== '') {
      		if(this.form.projectId){
      			customerNameList({customerName:query,projectId:this.form.projectId}).then(res=>{
	          	this.customerOptions=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个项目',
				        type: 'warning', 
				      })
      		}
      	}else{
      		this.customerOptions = [];
      	}
      },
      remotePurchase(query){
      	
      		if(this.form.customerUserGroupId){
      			customerUserNameList({userName:query,customerId:this.form.customerId,departmentId: this.form.customerUserGroupId}).then(res=>{
	          	this.purchaseOptions=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个客户部门',
				        type: 'warning', 
				      })
      		}
      },
      isRepeat(arr,cb){
				var newarr=[]
				arr.map((item,index)=>{
					arr.map((it,ind)=>{
						if(ind>index){
							if(item==it){
								newarr.push(item)
							}
						}
					})
				})
			 	let repeatArr=[...new Set(newarr.map(i=>i-0))]
			 	if(repeatArr.length>0){
			 		cb(repeatArr)
			 		return true
			 	}else{
			 		return false
			 		cb()
			 	}
			},
      addrow(){
      	let a={name1:'',name2:'',name3:''}
      	this.form.people.push(a)
      },
      submitForm(formName) {
      	this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	if(this.receiptAddressText){
		          		this.subMit(formName)
		          	}else{
		          		this.$message({
						        message:'请选择收货地址',
						        type: 'warning', 
						      })
		          	}
		           
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
      },
       resetForm(formName) {
        this.$refs[formName].resetFields();
        this.realName=''
      },
      subMit(formName){
		    let isItemList=this.form.itemList.filter(item=>item.skuId)
      	let isItemListids=this.form.itemList.map(item=>item.skuNo)
        if(isItemList.length>0){
        	if(this.isRepeat(isItemListids,(arr)=>{
        		this.repeatArr=arr
        		let stringarr='重复订单号为:  [  '+arr+'  ]  '
        		this.$MessageTips({
        			message:stringarr
        		})
        	})){
        		this.$message({
			        message:'商品重复',
			        type: "error", 
			      })
        	}else{
        		if(this.form.orderType==1){
        		this.submitFromApi()
	        	}else{
	        		if(this.total>0){
	        			if(isItemList.some(item=>item.currentPrice==0)){
			        		this.isZeroTips=true
			        	}else{
			        		this.submitFromApi()
			        	}
	        		}else{
	        			this.$message({
					        message:'商品总价必须大于0',
					        type: "error", 
					      })
	        		}
	        	}
        	}
        }else{
        	this.$message({
		        message:'请至少选择一个商品',
		        type: "error", 
		      })
        }
      },
      submitFromApi(){
      	if(this.form.orderType==3){
      		if(parseFloat(this.total)==parseFloat(this.winningPrice)){
      			this.issubmitFromApi()
	      	}else{
	      		this.isZeroTips=false
	      		this.$message({
						        message:'中标价格必须等于商品合计',
						        type: "error", 
						      })
	      	}
      	}else{
      		this.issubmitFromApi()
      	}
      	
      	
        
      },
      issubmitFromApi(){
      	this.isZeroTips=false
	        if(this.$route.query.isMyOrder){ // 判断是否从我的订单跳转过来
	          editOrder(this.form,this.$route.query.editId,true).then(res=>{
	         			this.$message({
					        message:'保存成功',
					        type: "success", 
					      })
	         			this.resetForm('form')
	         			this.close({
				        		name:'EditMyOrder',
				        		to:{
				        			name:'MyOrder',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
	          })
					}else{
	          if(this.$route.query.type==0){
	            editOrder(this.form,this.$route.query.editId).then(res=>{
	            		this.$message({
	                  message:'保存成功',
	                  type: "success", 
	                })
	            		this.resetForm('form')
	            		this.close({
				        		name:'EditOrder',
				        		to:{
				        			name:'OrderManage',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
	            })
	          }
	          if(this.$route.query.type==1){
	            firstEditOrder(this.form,this.$route.query.editId).then(res=>{
	                this.$message({
	                  message:'保存成功',
	                  type: "success", 
	                })
	                this.resetForm('form')
	                this.close({
				        		name:'EditOrder',
				        		to:{
				        			name:'OrderManage',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
	                
	            })
	          }
	          if(this.$route.query.type==2){
	            secondEditOrder(this.form,this.$route.query.editId).then(res=>{
	                this.$message({
	                  message:'保存成功',
	                  type: "success", 
	                })
	                this.resetForm('form')
	                this.close({
				        		name:'EditOrder',
				        		to:{
				        			name:'OrderManage',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
	            })
	          }
	        }
      },
    }
  }
</script>

<style lang="less" scoped>

.el-form{
     color: #606266;
     
.saleDown{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .row_chunk{
	  	margin-bottom: 30px;
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
       			.el-form-item{
       				flex: 1;
       			}
       			span{
       				
       				text-align: right;
       				flex: 0 0 30%;
       				.requeryStar{
       					color: #FF0000;
       					padding-right: 2px;
       				}
       			}
       			
       		}
       	}
        .el-input {
        	max-width: 250px;
        }
        .el-autocomplete{
        	width: 100%;
        	max-width: 250px;
        }
        .el-select{
        	width: 100%;
        	max-width: 250px;
        }
 

  
   

}
}
</style>
