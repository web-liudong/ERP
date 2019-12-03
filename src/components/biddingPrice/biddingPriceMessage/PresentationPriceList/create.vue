<template>
	<el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">
<div class="saleDown">
  <addhead headname="基本信息" style="margin-bottom: 10px;"></addhead>
  	
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
  		<div class="chunk">
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
	        	<span style="text-align: left;line-height: 40px;">&nbsp;&nbsp;&nbsp;{{receiptAddressText}}</span>
	        	<el-input v-model="receiptAddressText" type="hidden"  ref="recAddress" style="width: 0px;height: 0px;"></el-input>
	        </div>
  		</div>
  	</div> 
    <div class="row_chunk">
  		<div class="chunk" >
  			<span><i class="requeryStar">*</i>业务员：</span>
        <el-form-item>
	         <el-select
				    v-model="form.staffId"
				    filterable
				    clearable
				    placeholder="请选择"
				    :disabled="staffDis"
				    >
				    <el-option
				      v-for="item in SalesmanOptions"
				      :key="item.id"
				      :label="item.realName"
				      :value="item.id">
				    </el-option>
				  </el-select>
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
    
    
    <!--<div class="row_chunk">
  		<div class="chunk" style="width: 25%;">
  			<span style="flex: 0 0 30%;">付款方式：</span>
        <el-form-item style="flex: 1;">
	        <el-select v-model="form.payType" placeholder="请选择">
				    <el-option label="账期" value="0"></el-option>
				    <el-option label="货到付款" value="1"></el-option>
				  </el-select>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span></span>
	      <el-form-item>
			    <el-checkbox v-model="form.urgents">紧急订单</el-checkbox>
	      </el-form-item>
  		</div>
  	</div>-->
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
    <addhead headname="商品信息"> 
    	<template slot="append">
    		<el-button ref="addRow"size="mini" icon="el-icon-plus" style="margin-left: 50px;" @click="addTableRow()">添加</el-button>
    	</template>
    </addhead>
    
    <el-table
      :data="form.itemList"
      border
      stripe
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
        prop="skuId"
        label="商品ID"
        min-width="38"
        align="center">
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
						      :label="item.skuId+' '+item.skuName"
						      :value="item.skuId">
						    </el-option>
						  </el-select>
        </template>
        
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
        	<el-input v-model="scope.row.currentDiscount" 
        		:disabled="form.orderType==1" 
        		placeholder="字数长度1~50" 
        		type="number" 
        		@blur="tablechange(scope.row,'currentDiscount')">
        	</el-input>
        </template>
      </el-table-column>
      <el-table-column
      	min-width="60"
        align="center">
        <template slot="header" slot-scope="scope">
    			<span><i style="color: red;">*</i>本次售价</span>
  			</template>
        <template slot-scope="scope">
        	<el-input v-model="scope.row.currentPrice" 
        		:disabled="form.orderType==1" 
        		placeholder="字数长度1~50" 
        		type="number"
        		@blur="tablechange(scope.row,'currentPrice')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
      	min-width="50"
        align="center">
        <template slot="header" slot-scope="scope">
    			<span><i style="color: red;">*</i>数量</span>
  			</template>
        <template slot-scope="scope">
        	<el-input v-model="scope.row.itemQty" 
        		 placeholder="字数长度1~50" 
        		 type="number" 
        		 @blur="tablechange(scope.row,'itemQty')">
        	</el-input>
        </template>
        
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="小计(￥)"
        min-width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="previousPrice"
        label="上次售价"
        align="center">
      </el-table-column>
      <template slot="append" style="width: 100%;">
          	<div class="clearfix">
					  	<div class="" style="width: 200px; float: right;height: 100px;color: #000000;">
					  		<p style="font-size: 12px;font-weight: 500;padding-top: 30px;">中标价格：&nbsp;￥{{winningPrice}}</p>
					  		<p style="font-size: 12px;font-weight: 500;padding-top: 20px;">商品合计：&nbsp;￥{{total}}</p>
					  	</div>
					  </div>	
           </template>
    </el-table>
  <div style="text-align: center;padding: 30px;">
  	<el-button type="primary" @click="submitForm('form')">保  存</el-button>
    <el-button type="primary" @click="closed()">取  消</el-button>
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
		<el-dialog
		  title="下单成功"
		  :visible.sync="orderDialog"
		  width="400px"
		   @close="orderClose()"
		  >
		  <span>下单成功，订单号 <span id="inviteCode">{{orderNumber}}</span> <el-button size="mini" style="margin-left: 10px;" @click="copyOrderNumber()">复制单号</el-button></span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="orderDialog=false">确 定</el-button>
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
		projectDetail
	} from '@/api/projectController/projectController'
	import {
		customerNameList,
		customerUserNameList,
		consigneeInformation,
		likeOrderItemList,
		editOrder,
		getDetailItem,
		getDetail,
		secondEditOrder,
		firstEditOrder,
		customerUserGroupList
	} from '@/api/order/saleDown'
	import {
		getOrderDetail,
		createOrder
	} from '@/api/biddingPrice/biddingPrice'
  import './index.less'
  import {
  	simpleList,
  	userList
	} from '@/api/userService'
  import setAddress from "./child/set_address";
  import {
		nameRepeatedCheck,
		addProjrct,
	} from '@/api/projectController/projectController'
	import {returnFloat,returnFloatFour} from '@/utils/index'
	import qs from 'qs';
  export default {
	inject:['close'],
	name:'PresentationPriceCreate',
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
      	orderNumber:'',
      	orderDialog:false,
      	staffDis:false,
      	SalesmanOptions:[],
      	SalesmanOption1:[],
      	pickerOptions:{
      		disabledDate(time){
      			return time.getTime() < Date.now() - 8.64e7;
      		}
      	},
      	winningPrice:'',
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
        form:{
        	itemList:[{
							skuName:'',
	        		currentDiscount:'',//本次折扣
	        		currentPrice:'',//本次售价
	        		itemMemo:'',//详情备注
	        		itemQty:'',//购买数量
	        		previousPrice:'',//前一次售价
	        		skuId:'',//商品id
	        		options:[],
	        		skuModel:'',//规格型号
	        		unit:'',//单位
	        		websitePrice :'',//官网售价
	        		negotiatedPrice:'',//项目售价
	        		negotiatedDiscount:'',//项目折扣
	        		totalPrice:'',//小计
        	}],
        	payType:'0',//付款方式
        	customerId:'',//客户id
        	customerUserGroupId:'',//客户部门id
          customerUserId:'',//客户采购人id
          expectedDeliveryDate:'',//期望配送日期
          orderMemo:'',//订单备注
          orderType:'3',//订单类型（0：常规订单，1：赠品订单，2：积分订单）
          projectId:'',//项目id
          recipientAddressProvinceId:'',//省id
          recipientAddressCityId:'',//市id
          recipientAddressCountyId:'',//县id
          recipientAddressLine:'',//收货详细地址
          recipientName:'',//收货人姓名
          recipientPhone:'',//收货人手机号
          staffId:null,//业务员id
          urgents:false,//是否紧急（0：否，1：是）
          urgent:'',//是否紧急（0：否，1：是）
          version:'',//订单版本
          memoOrderNo:'',//外部订单号
        },
        options4:[],
        options3:[],
        customerOptions:[],
        purchaseOptions:[],
        customerUserGroupOptions:[],
        rules:{
        	staffId:[
            { required: true,message: '请选择业务员', trigger: 'change'},
          ],
          orderType: [
            { required: true,message: '请选择订单类型', trigger: 'change'},
          ],
          projectId: [
            { required: true,message: '请选择项目', trigger: 'change'},
          ],
          customerId: [
            { required: true,message: '请选择客户', trigger: 'change'},	
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
    },
    computed:{
    	total(){
    		let a=0
    		this.form.itemList.map((item)=>{
    			a+=parseFloat(item.totalPrice)
    		})
    		return returnFloatFour(a)
    	}
    },
    methods: {
			accordingToIdGet(){
				getOrderDetail(this.$route.query.id).then(res=>{
					console.log(res)
					let a=res.data
//					this.form.expectedDeliveryDate=a.expectedDeliveryDate
					this.form.projectId=a.projectId
					this.form.recipientAddressProvinceId=a.provinceId
					this.form.recipientAddressCityId=a.cityId
					this.form.recipientAddressCountyId=a.countyId
					this.form.recipientAddressLine=a.addressLine
					this.winningPrice= returnFloatFour(a.winningPrice)
					this.form.memoOrderNo=a.exteriorNo
        	this.options3=[{
        		name:a.projectName,
        		id:a.projectId
        	}]
        	projectDetail(a.projectId).then(res=>{
	    				
	    			})
        	userList({organizationId:this.$route.query.serverId}).then(res=>{
	    					this.SalesmanOptions=res.data
	    					this.SalesmanOption1=JSON.parse(JSON.stringify(res.data))
	    				})
				}).catch(rej=>{
					console.log(rej)
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
	    		console.log(this.form)
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
	    			let lastrow=this.form.itemList.every(item=>item.skuId)
		    		if(lastrow){
		    			this.tablePush()
		    		}else{
		    			this.$message({
		    					dangerouslyUseHTMLString: true,
					        message:'<p>已有空白行，不可重复添加<br/>温馨提示：回车 键可快速添加空白行。</p>',
					        type: 'error', 
					      })
		    		}
	    		}else{
	    			this.tablePush()
	    		}
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
    	tablePush(){
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
	        		totalPrice:0,//小计
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
    			row.totalPrice=this.isformOrderType(returnFloatFour(row.currentPrice*row.itemQty))
    		}
    		if(b=='currentPrice'){
    			row[b]= this.isformOrderType(returnFloatFour(row[b]))
    			row.currentDiscount= this.isformOrderType(returnFloat((row.currentPrice/row.websitePrice)*100))
    			row.totalPrice= this.isformOrderType(returnFloatFour(row.currentPrice*row.itemQty))
    		}
    		if(b=='itemQty'){
    		row.itemQty=parseInt(row[b])>0?parseInt(row[b]):1
    			row.totalPrice= this.isformOrderType(returnFloatFour(row.currentPrice*row.itemQty))
    		}
    	},
    	isformOrderType(value){
    		return this.form.orderType==1?0:value
    	},
    	querySearch(queryString, cb) {
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
      purchaseChange(value){
				if(value){
					let a=this.purchaseOptions.filter((item,index)=>{
	    			return item.userId==value
	    		})
	    		this.customerUserPhone=a[0].phone
	    		this.staffName=a[0].staffName
	    		this.form.staffId=a[0].staffId
	    		this.SalesmanOptions=[{
	    			realName:a[0].staffName,
	    			id:a[0].staffId
	    			}]
	    		this.staffDis=true
	    		this.clearPurchaseContent()
	    		this.getConsigneeInformation(a[0].userId)
				}else{
					this.form.staffId=null
	    		this.SalesmanOptions = this.SalesmanOption1
	    		this.staffDis=false
					this.customerUserPhone=''
	    		this.staffName=''
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
      	this.form.customerUserId=''
    		this.purchaseOptions = [];
    		this.customerUserPhone=''
	    		this.staffName=''
	    		this.restaurants=[]
      	this.clearPurchaseContent()   
      	if(value){
      		this.remotecustomerUserGroup()
      	}
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
	      	}else{
	      		let a=this.form.itemList[this.tableIsRow].options.filter((item,index)=>{
	    			return item.skuId==value
		    		})
		      	this.form.itemList[this.tableIsRow].skuModel=a[0].skuModel
		      	this.form.itemList[this.tableIsRow].unit=a[0].unit
		      	this.form.itemList[this.tableIsRow].websitePrice=a[0].websitePrice
		      	this.form.itemList[this.tableIsRow].negotiatedPrice=a[0].negotiatedPrice
		      	this.form.itemList[this.tableIsRow].negotiatedDiscount=a[0].negotiatedDiscount
		      	this.form.itemList[this.tableIsRow].previousPrice=a[0].previousPrice
		      	this.form.itemList[this.tableIsRow].skuName=a[0].skuName
		      	
		      	this.form.itemList[this.tableIsRow].currentDiscount=  this.isformOrderType(returnFloat((a[0].projectPrice/a[0].websitePrice)*100))
		      	this.form.itemList[this.tableIsRow].currentPrice=  this.isformOrderType(returnFloatFour(a[0].projectPrice))
		      	this.form.itemList[this.tableIsRow].itemQty= 1
		      	this.form.itemList[this.tableIsRow].totalPrice= this.isformOrderType(returnFloatFour(a[0].projectPrice*1))
	      	}
      	}
      	
      },
      clearGoods(a){
          this.form.itemList[a].skuName=''
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
      		this.form.itemList[a].totalPrice=0
      },
    	userNamechange(value){
    			this.form.customerId=''
    			this.form.customerUserId=''
    			this.customerOptions=[]
    			this.purchaseOptions = [];
    			this.customerUserPhone=''
	    		this.staffName=''
	    		this.form.staffId=''
	    		this.restaurants=[]
    			this.clearPurchaseContent()
    	},
    	remoteLikeOrder(query) {
    		
    		 if (query !== '') {
          	this.loading = true
          	likeOrderItemList({skuName:query,customerId:this.form.customerId,projectId:this.form.projectId,}).then(res=>{
          	this.form.itemList[this.tableIsRow].options=res.data
          	this.loading = false
          	}).catch(rej=>{
          		this.loading = false
          	})
        }
      },
      remoteMethod1(query){
      	 if (query !== '') {
          nameList({name:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
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
      	if (query !== '') {
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
      	}else{
      		this.purchaseOptions = [];
      	}
      },
      isRepeat(arr){
      	let hash={}
      	for(let i in arr) {
	        if(hash[arr[i]]) {
	            return true;
	　　   	  }
	        hash[arr[i]] = true;
	    	}
	    	return false;
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
      	let isItemListids=this.form.itemList.map(item=>item.skuId)
        if(isItemList.length>0){
        	if(this.isRepeat(isItemListids)){
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
      	if(parseFloat(this.total)==parseFloat(this.winningPrice)){
      		this.isZeroTips=false
	      	createOrder(this.$route.query.id,this.form).then(res=>{
//	      		this.$message({
//					        message:'保存成功',
//					        type: "success", 
//					      })
	      		this.orderNumber=res.data
	         	this.orderDialog=true
//	      		this.$router.push('/biddingPrice/PresentationPriceList/list')
	      	})
      	}else{
      		this.isZeroTips=false
      		this.$message({
					        message:'中标价格必须等于商品合计',
					        type: "error", 
					      })
      	}
      	
	  },
      orderClose(){
		 this.close({name:'PresentationPriceCreate', to: {name:'PresentationPriceList', params:{isUpdate:true}}}); 
      	// this.$router.push('/biddingPrice/PresentationPriceList/list')
	  },
      closed(){
      	this.close();
      },
      copyOrderNumber(){
    		document.execCommand(this.orderNumber)
    		var Url2 = document.getElementById("inviteCode").innerText;
	      var oInput = document.createElement("input");
	      oInput.value = Url2;
	      document.body.appendChild(oInput);
	      oInput.select(); // 选择对象
	      document.execCommand("Copy"); // 执行浏览器复制命令
	      oInput.className = "oInput";
	      oInput.style.display = "none";
      	this.$message({
					        message:'复制成功',
					        type: 'success', 
					      })
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
