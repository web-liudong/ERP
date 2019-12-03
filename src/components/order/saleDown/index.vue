<template>
	<el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">
<div class="saleDown">
  <addhead headname="基本信息" style="margin-bottom: 10px;" :iconName="'iconbianjidingdan'"></addhead>
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
  	
  	<!--DDDDDDDDDDDDD-->
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
<!--33333333333333333333333-->
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
	        <el-select v-model="form.orderType" placeholder="订单类型">
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
	        <el-input v-model="form.memoOrderNo"></el-input>
	      </el-form-item>
  		</div>
  	</div>
   <!--44444444444-->
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
    		<!--:disabled="disCustomer"-->
    		<div class="operation_btn" ref="addRow" @click="addTableRow()" style="margin-left: 50px;"><i class="iconfont iconzengjia"></i>添加</div>
    		<el-checkbox v-model="useCustomerFlag" @change="customerLogChange"  style="padding: 0px 10px;">按客户购买记录选商品</el-checkbox>
    		<div class="operation_btn" @click="showDialogImport('importFile')"><i class="iconfont icondaoru"></i>导入</div>
    		<div class="operation_btn" @click="getExcelBefore()"><i class="iconfont icondaochu"></i>导出</div>
    		<div class="operation_btn" @click="getStock()">获取库存和成本</div>
    		<span style="font-size: 12px;color: red;" v-show="warehouseName1">（仓库：{{warehouseName1}}）</span>
    	</template> 
    </addhead>
    <!--:row-style="selectedHighlight"-->
    <el-table
          :data="form.itemList"
          border
          stripe
          :row-class-name="tableRowname"
          style="width: 100%;"
          size="small">
          <el-table-column
            label="操作"
            fixed="left"
            min-width="40"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" @click="deleteRow(scope)">删除</el-button>
            		<el-button  type="text" size="small" @click="remarkRow(scope)" v-if="scope.row.skuId" style="margin-left: 0px;">备注</el-button>
            		<span v-else style="display: inline-block;">备注</span>
            </template>
          </el-table-column>
          <el-table-column
            label="条目号"
            fixed="left"
            min-width="38"
            align="center">
             <template slot-scope="scope">
            		<span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          
          
          <el-table-column
          	fixed="left"
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
						      :label="goodsShow(item)"
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
            label="小计(￥)"
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
            min-width="50"
            align="center">
          </el-table-column>
          <!--<template slot="append" style="width: 100%;">
          	<div class="clearfix">
					  	<div class="" style="width: 200px; float: right;height: 100px;color: #000000;">
					  		<p style="font-size: 12px;font-weight: 500;padding-top: 30px;">商品合计：&nbsp;￥{{total}}</p>
					  		<p style="font-size: 12px;font-weight: 500;padding-top: 20px;">&nbsp;&nbsp;&nbsp;应付款：&nbsp;￥{{form.orderType==1?0:total}}</p>
					  	</div>
					  </div>	
           </template>-->
        </el-table>
  <div class="clearfix">
					  	<div class="" style="width: 200px; float: right;height: 100px;color: #000000;">
					  		<p style="font-size: 12px;font-weight: 500;padding-top: 30px;">商品合计：&nbsp;￥{{total}}</p>
					  		<p style="font-size: 12px;font-weight: 500;padding-top: 20px;">&nbsp;&nbsp;&nbsp;应付款：&nbsp;￥{{form.orderType==1?0:total}}</p>
					  	</div>
					  </div>
  <div style="text-align: center;padding: 30px;">
  	 <!--partyBId!=$auth.user.userPosts[0].organizationId-->
  	<el-button type="primary" @click="submitForm('form',true)" :disabled="acceptButton">保存并接单</el-button>
  	<el-button type="primary" @click="submitForm('form',false)">保存订单</el-button>
    <el-button type="primary" @click="close()">取  消</el-button>
  </div>
   
  <el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisiblelock"
		  width="400px"
		  >
		  <span>删除之后，客户的订单中将不再展示当前商品，确定要删除当前商品条目吗？</span>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="dialogVisiblelock=false">取 消</el-button>
		    <el-button type="primary" @click="isDelete()">确 定</el-button>
		  </span>
		</el-dialog>
	<el-dialog title="备注" :visible.sync="dialogFormVisible" width="474px">
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
	<el-dialog title="一键接单" :visible.sync="dialogOrderForm" width="474px" @close="staffClose()">
		<div class="row_chunk">
			<div class="chunk" style="width: 100%;">
  			<span style="flex: 0 0 100px;"><i class="requeryStar">*</i>服务方：</span>
        <el-form-item >
	        	<el-input  v-model="partyBName" disabled></el-input>
	  		</el-form-item>
  		</div>
  	</div>
	  <div class="row_chunk">
			<div class="chunk" style="width: 100%;">
  			<span style="flex: 0 0 100px;"><i class="requeryStar">*</i>业务员：</span>
        <el-form-item prop="staffId">
	         <el-select
				    v-model="form.staffId"
				    filterable
				    clearable
				    placeholder="请输入"
				    :disabled="staffDis"
				    >
				    <el-option
				      v-for="item in SalesmanOptions"
				      :key="item.id"
				      :label="item.userName+'-'+item.realName"
				      :value="item.id">
				    </el-option>
				  </el-select>
      	</el-form-item>
  		</div>
  	</div>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogOrderForm = false">取 消</el-button>
	    <el-button type="primary" @click="submitForm('form',true,true)" :loading="submintClacktrue">确 定</el-button>
	  </div>
	</el-dialog>
	<el-dialog title="选择仓库" :visible.sync="dialogWarehouseList" width="474px" @close="staffClose()">
	  <div class="row_chunk">
			<div class="chunk" style="width: 100%;">
  			<span style="flex: 0 0 150px;"><i class="requeryStar">*</i>选择要查询的仓库：</span>
        <el-form-item :rule="{ required: true,message: '请选择查询的仓库', trigger: 'change'}">
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
	<el-dialog
		  title="提示"
		  :visible.sync="isZeroTips"
		  width="400px"
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
		  >
		  <span>下单成功，订单号 <span id="inviteCode">{{orderNumber}}</span> <el-button size="mini" style="margin-left: 10px;" @click="copyOrderNumber()">复制单号</el-button></span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="orderDialog=false">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="导入结果"
		  :visible.sync="ImportDialogResult"
		   width="400px"
		  >
		  <p>成功导入 {{successNumber}} 条，失败 {{failNumber}} 条</p>
		  <p v-if="skuErrorNo.length>0">导入失败商品编号：{{skuErrorNo}}</p>
		  <p v-if="repeatArr.length>0">导入重复商品编号：{{repeatArr}}</p>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="ImportDialogResult=false">确 定</el-button>
		  </span>
		</el-dialog>
	<setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
	<importFile
      ref="importFile"
      :title="'商品信息批量导入'"
      :type="'Erp_Create_Item_Import_Template'"
      :params="ImportParams"
      @dialogCallBackPayment="orderImportDialogCallback"
    ></importFile>
</div>
</el-form>
</template>

<script>
	import importFile from "@/components/common/module/ImportFile"; 
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
		addOrder,
		erpAccept,
		buttonShow,
		customerUserGroupList,
		getWms,
		getWarehouseList,
		getWmsSkuStock,
		findCostPrice,
		permission
	} from '@/api/order/saleDown'
//	customerEditDetail,
  import './index.less'
  import {
  	simpleList,
  	userList
	} from '@/api/userService'
  import setAddress from "../child/set_address";
	import {returnFloat,returnFloatFour,returnFloatTwoFour} from '@/utils/index'
	import qs from 'qs';
  export default {
  	name:'saleDown',
  	inject:['close'],
    data() {
//  	var projectNameRule= (rule, value, callback) => {
//      if (value == '') {
//        callback(new Error('请输入项目名称'));
//      }
//      nameRepeatedCheck({name:value}).then(res=>{
//      	if(res.data){
//      		callback(new Error('项目名称已存在'));
//      	}else{
//      		callback()
//      	}
//      })
//    };
    	
      return {
      	useCustomerFlag:false,
      	dialogWarehouseList:false,
      	warehouseList:[],
      	warehouseId:'',
      	warehouseName:'',
      	warehouseName1:'',
      	successNumber:'',
		  	failNumber:'',
		  	skuErrorNo:[],
      	ImportDialogResult:false,
      	SalesmanOptions:[],
      	dialogOrderForm:false,
      	orderNumber:'',
      	orderDialog:false,
      	pickerOptions:{
      		disabledDate(time){
      			return time.getTime() < Date.now() - 8.64e7;
      		}
      	},
      	isZeroTips:false,
      	receiptAddressText:"",
      	receiptAddress:null,//收货地址
      	remarkRowIndex:'',
      	goodsText:'',
      	remarkText:'',
      	dialogFormVisible:false,
      	tableIsRow:0,
      	customerUserPhone:'',
      	staffName:'',
      	staffUserName:'',
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
        		skuNo:'',
        		options:[],
        		skuModel:'',//规格型号
        		unit:'',//单位
        		websitePrice :'',//官网售价
        		negotiatedPrice:'',//项目售价
        		negotiatedDiscount:'',//项目折扣
        		amount:'',//小计
        		availableQty:'',//可用库存
        		costTax:'',
        		totalPrice:''
        	}],
        	customerId:'',//客户id
        	customerUserGroupId:'',//客户部门id
          customerUserId:'',//客户采购人id
          deliveryMemo:'',//配送备注
          expectedDeliveryDate:'',//期望配送日期
          orderMemo:'',//订单备注
          orderType:'0',//订单类型（0：常规订单，1：赠品订单，2：积分订单）
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
          urgent:0,//是否紧急（0：否，1：是）
          memoOrderNo:'',//外部订单号
        },
        staffDis:false,
        options4:[],
        options3:[],
        customerOptions:[],
        customerUserGroupOptions:[],
        purchaseOptions:[],
        submintClacktrue:false,
        rules:{
        	staffId: [
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
        acceptButton:true,
        realName:'',
        deleteIndex:null,
        loading:false,
        restaurants:[],
        cool:null,
        partyBId:null,
        partyBName:null,
        repeatArr:[],
      };
    },
    components:{
      addhead,
      setAddress,
      importFile
    },
    created(){
    	
    	
//    document.onkeydown=function(){
//    	var key =window.event.keyCode
//    	if(key ==13){
//    		thatt.addTableRow()
//    		return false
//    	}
//    }
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
    	SalesmanOptions(a,b){
    		console.log(a)
    	},
    	'form.customerId':{
    		handler:function(a,b){
					if(!a){
						this.useCustomerFlag=false
					}
				},
				deep:true
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
    	'form.orderType':{
				handler:function(a,b){
					if(a==1){
						let newArr=this.form.itemList.map(item=>{
							item.currentDiscount=0
							item.currentPrice=0
							item.amount=0
							item.totalPrice=0
							return item
						})
						this.form.itemList=newArr
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
    	},
    	ImportParams(){
    		return {
    			projectId : this.form.projectId?this.form.projectId:0,
    			customerId :this.form.customerId?this.form.customerId:0,
    		}
    	},
    	disCustomer(){
    		if(this.form.projectId&&this.form.customerId){
    			return false
    		}else{
    			this.useCustomerFlag=false
    			return true
    		}
    		 
    	}
    },
    methods: {
    	selectedHighlight({ row, rowIndex }) {
    		if(this.repeatArr.includes(row.skuNo)||parseFloat(row.currentDiscount)>999){
    			console.log(row.currentDiscount)
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
			        const { export_json_to_excel } = require('../../../../static/excel/Export2Excel.js')
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
				this.warehouseName=seccuseOneArr[0].name
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
    	tableRowname({row, rowIndex}){
    		if(this.repeatArr.includes(row.skuNo)||parseFloat(row.currentDiscount)>999){
    			console.log(row.currentDiscount)
    			return "saleDownRedTable"
    		}
    	},
    	goodsShow(item){
    		if(item.skuNo){
    			return item.skuNo + ' ' + item.skuName
    		}else{
    			return item.skuName
    		}
    	},
    	staffClose(){
//  		this.form.staffId=''
    	},
    	tableRowFocus(index){
    		this.tableIsRow=index
    	},
    	showDialog(type, row) {
    		this.$refs.recAddress.blur()
	      this.$refs[type].init(row);
	    },
	    showDialogImport(type,row){
	    	this.$refs[type].init(row);
	    },
    	dialogCallback(res) {
	      console.log(res);
//	      recipientAddressProvinceId:'',//省id
//        recipientAddressCityId:'',//市id
//        recipientAddressCountyId:'',//县id
//        recipientAddressLine:'',//收货详细地址
       this.form.recipientAddressLine=res.address
       this.form.recipientAddressProvinceId=res.province.id
       this.form.recipientAddressCityId=res.city.id
       this.form.recipientAddressCountyId=res.county.id
       this.receiptAddressText=res.receiptAddress
       this.isButtonShow()
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
    	orderImportDialogCallback(res){
    		this.successNumber=res.itemList.length
    		this.failNumber=res.skuErrorNo.length
    		this.skuErrorNo=res.skuErrorNo
    		let a=res.itemList.map((item,index)=>{
						let b={
							options:[{
							skuName:item.skuName,
							skuNo:item.skuNo,
							skuId:item.skuId
							}]
						}
						item.currentDiscount= this.isformOrderType(returnFloat((item.currentPrice/item.websitePrice)*100))
						item.negotiatedDiscount=returnFloat(item.negotiatedDiscount)
						item.currentPrice= this.isformOrderType(returnFloatFour(item.currentPrice))
						item.amount= this.isformOrderType(returnFloatFour(item.currentPrice*item.itemQty))
						item.totalPrice= this.isformOrderType(returnFloat(item.currentPrice*item.itemQty))
						item.availableQty= null
						item.costTax= null
						Object.assign(item,b)
						return item
					})
    			let isItemListNOs=a.map(it=>it.skuNo)
    			this.isRepeat(isItemListNOs,(arr)=>{
        		this.repeatArr=arr
        	})
    			this.ImportDialogResult=true
					this.form.itemList=a
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
    	isDelete(){
    		this.form.itemList.splice(this.deleteIndex,1)
    		this.dialogVisiblelock=false
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
    	tablePush(){
    		let a={
	    				skuName:'',
	        		currentDiscount:0,//本次折扣
	        		currentPrice:0,//本次售价
	        		itemMemo:'',//详情备注
	        		itemQty:0,//购买数量
	        		previousPrice:'',//前一次售价
	        		skuId:'',//商品id
	        		skuNo:'',
	        		options:[],
	        		skuModel:'',//规格型号
	        		unit:'',//单位
	        		websitePrice :0,//官网售价
	        		negotiatedPrice:'',//项目售价
	        		negotiatedDiscount:'',//项目折扣
	        		amount:0,//小计
	        		totalPrice:0,//小计
	        		availableQty:'',//可用库存
	        		costTax:'',
	        	}
    					
	    			this.form.itemList.push(a)
//	    			this.$nextTick(()=>{
//	    					this.$refs.selectRow.focus()
//	    				})
	    			setTimeout(()=>{
	    				
	    				this.$refs.selectRow.focus()
	    			},500)
    	},
    	tablechange(row,b){
//  		currentDiscount  折扣率
//  		currentPrice		  售价
//  		itemQty					  数量
//  		amount       小计
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
      clearCustomerUserGroup(){
      	
      },
      purchaseChange(value){
					console.log(value)
				if(value){
					let a=this.purchaseOptions.filter((item,index)=>{
	    			return item.userId==value
	    		})
					console.log(a)
	    		this.customerUserPhone=a[0].phone
	    		if(a[0].staffId){
	    			this.staffName=a[0].staffName
	    			this.staffUserName=a[0].staffUserName
	    			this.form.staffId=a[0].staffId
//	    			this.SalesmanOptions=[{
//	    			realName:a[0].staffName,
//	    			id:a[0].staffId
//	    			}]
	    			this.staffDis=true
	    		}
	    		this.clearPurchaseContent()
	    		consigneeInformation(a[0].userId).then(res=>{
	    			console.log(res)
	    			let a=res.data.map((item)=>{
	    				let b={value:item.recipientName+'  '+item.recipientPhone+'  '+item.provinceName+item.cityName+item.countyName}
	    					Object.assign(item, b)
	    				return item
	    			})
	    			this.restaurants=a
	    		})
				}else{
					this.customerUserPhone=''
	    		this.staffName=''
	    		this.form.staffId=''
	    		this.staffDis=false
	    		this.restaurants=[]
	    		this.clearPurchaseContent()
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
      customerChange(value){
      	this.form.customerUserId=''
    		this.purchaseOptions = [];
    		this.customerUserGroupOptions=[]
				this.form.customerUserGroupId=''
    		this.customerUserPhone=''
    		this.staffName=''
    		this.staffUserName=''
    		this.form.staffId=''
    		this.staffDis=false
    		this.restaurants=[]
      	this.clearPurchaseContent()
      	this.changeAssignment()
      	console.log(value)
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
//    getCustomerEditDetail(id){
//    	customerEditDetail(id).then(res=>{
//        this.form.deliveryMemo=res.data.deliveryRemark
//        this.form.orderMemo=res.data.orderRemark
//        this.form.packageMemo=res.data.packageRemark
//        this.form.packageType=res.data.packageType!=null?res.data.packageType.toString():''
//        this.form.receiveType=res.data.orderSignType!=null?res.data.orderSignType.toString():''
//    	})
//    },
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
        this.isButtonShow()  
          
      },
      goodsNamechange(value){
      	console.log(value)
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
//	      		this.$refs.selectRow.blur()
	      		let a=this.form.itemList[this.tableIsRow].options.filter((item,index)=>{
	    			return item.skuId==value
		    		})
		      	this.form.itemList[this.tableIsRow].skuId=a[0].skuId
		      	this.form.itemList[this.tableIsRow].skuNo=a[0].skuNo
		      	this.form.itemList[this.tableIsRow].skuModel=a[0].skuModel
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
//    isRepeat(arr){
//    	let hash={}
//    	for(let i in arr) {
//	        if(hash[arr[i]]) {
//	            return true;
//	　　   	  }
//	        hash[arr[i]] = true;
//	    	}
//	    	return false;
//    },
//    isRepeat(arr,cb){
//    	let hash={}
//    	for(let i in arr) {
//	        if(hash[arr[i]]) {
//	        	cb(i,hash[arr[i]])
//	            return true;
//	　　   	  }
//	        hash[arr[i]] = i;
//	    	}
//	    	return false;
//    },
			isRepeat(arr,cb){
				this.repeatArr=[]
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
      isButtonShow(){
      	buttonShow({
    					projectId:this.form.projectId,
    					recipientAddressCountyId:this.form.recipientAddressCountyId,
    				}).then(res=>{
	    				this.acceptButton=!res.data
	    				if(res.data){
	    					this.partyBId=this.$auth.user.userPosts[0].organizationId
	    					this.partyBName=this.$auth.user.userPosts[0].organizationName
	    				}
	    			})
      },
    	userNamechange(value){
    			this.form.customerId=''
    			this.form.customerUserId=''
    			this.customerOptions=[]
    			this.purchaseOptions = [];
    			this.customerUserPhone=''
    			this.customerUserGroupOptions=[]
					this.form.customerUserGroupId=''
	    		this.staffName=''
	    		this.staffUserName=''
	    		this.form.staffId=''
	    		this.staffDis=false
	    		this.restaurants=[]
    			this.clearPurchaseContent()
    			this.changeAssignment()
    			if(value){
//  				projectDetail(value).then(res=>{
//	    				this.partyBId=res.data.partyBId
//	    				this.partyBName=res.data.partyBName
//	    			})
    				this.isButtonShow()
    			}else{
    				this.partyBId=''
    				this.partyBName=''
    				this.acceptButton=true
    			}
    	},
    	changeAssignment(){
    		let skuIdlist=this.form.itemList.filter(item=>item.skuId)
    		if(skuIdlist.length>0){
    				likeOrderItemList({
    						customerId:this.form.customerId,
    						projectId:this.form.projectId,
    						skuIdList:this.form.itemList.map(item=>item.skuId)
    					}).then(res=>{
    						res.data.map((item,index)=>{
    							for(let i=0; i<this.form.itemList.length;i++){
    								if(this.form.itemList[i].skuId==item.skuId){
    									this.form.itemList[i].skuModel=item.skuModel
							      	this.form.itemList[i].unit=item.unit
							      	this.form.itemList[i].websitePrice=item.websitePrice
							      	this.form.itemList[i].negotiatedPrice=item.negotiatedPrice
							      	this.form.itemList[i].negotiatedDiscount=item.negotiatedDiscount
							      	this.form.itemList[i].previousPrice=item.previousPrice
							      	this.form.itemList[i].skuName=item.skuName
							      	if(!this.form.itemList[i].currentPrice){
							      		this.form.itemList[i].currentPrice=  this.isformOrderType(returnFloatFour(item.projectPrice))
							      	}
							      	this.form.itemList[i].currentDiscount=  this.isformOrderType(returnFloat((parseFloat(this.form.itemList[i].currentPrice)/item.websitePrice)*100))
							      	this.form.itemList[i].amount= this.isformOrderType(returnFloatFour(parseFloat(this.form.itemList[i].currentPrice)*this.form.itemList[i].itemQty))
							      	this.form.itemList[i].totalPrice= this.isformOrderType(returnFloat(parseFloat(this.form.itemList[i].currentPrice)*this.form.itemList[i].itemQty))
    								}
    							}
    						})
    					})
    			}
    	},
    	remoteLikeOrder(query) {
        if (query !== '') {
          	this.loading = true
          	likeOrderItemList({skuName:query,customerId:this.form.customerId,projectId:this.form.projectId,useCustomerFlag:this.useCustomerFlag}).then(res=>{
          	this.form.itemList[this.tableIsRow].options=res.data
          	this.loading = false
          	}).catch(rej=>{
          		this.loading = false
          	})
        }
      },
      
      remoteMethod1(query){
          nameList({name:query}).then(res=>{
          	this.options3=res.data
          })
      },
      remoteCustomer(query){
//    	if (query !== '') {
      		if(this.form.projectId){
      			customerNameList({customerName:query?query:'',projectId:this.form.projectId}).then(res=>{
	          	this.customerOptions=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个项目',
				        type: 'warning', 
				      })
      		}
//    	}else{
//    		this.customerOptions = [];
//    	}
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
      remotePurchase(query){
      		if(this.form.customerUserGroupId){
      			customerUserNameList({userName:query?query:'',customerId:this.form.customerId,departmentId: this.form.customerUserGroupId}).then(res=>{
	          	this.purchaseOptions=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个客户部门',
				        type: 'warning', 
				      })
      		}
      },
      addrow(){
      	let a={name1:'',name2:'',name3:''}
      	this.form.people.push(a)
      },
      submitForm(formName,cool,is) {
        if(is){
        	this.rules.staffId= [{ required: true,message: '请选择业务员', trigger: 'change'},]
        }else{
        	this.rules.staffId=[{ required: false,message: '请选择业务员', trigger: 'change'},]
        }
      	this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	if(this.receiptAddressText){
		          		this.cool=cool
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
      	let isItemListNOs=this.form.itemList.map(item=>item.skuNo)
        if(isItemList.length>0){
        	if(this.isRepeat(isItemListNOs,(arr)=>{
        		this.repeatArr=arr
        		let stringarr='重复商品编号为:  [  '+arr+'  ]  '
        		this.$MessageTips({
        			message:stringarr
        		})
        	})){
        		
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
      	this.isZeroTips=false
      	if(this.cool){
      		if(this.dialogOrderForm){
      			this.holdPush()
      		}else{
      			this.dialogOrderForm=true
      			if(this.staffName){
      				this.SalesmanOptions=[{
			    			realName:this.staffName,
			    			id:this.form.staffId,
			    			userName:this.staffUserName
			    			}]
      			}else{
      				userList({organizationId:this.partyBId}).then(res=>{
	    					this.SalesmanOptions=res.data
	    				})
      			}
      		}
      		
      	}else{
      		addOrder(this.form).then(res=>{
		           			this.orderNumber=res.data
	         					this.orderDialog=true
		           			this.clearInput()
		           })
      	}
      	
      },
      holdPush(){
      	this.submintClacktrue=true
      	erpAccept(this.form).then(res=>{
      					this.dialogOrderForm=false
      					this.orderNumber=res.data
	         			this.orderDialog=true
	         			this.clearInput()
	         			this.submintClacktrue=false
	         }).catch(rej=>{
	         	this.submintClacktrue=false
	         })
      },
      clearInput(){
      	this.form.customerUserId=''
    		this.purchaseOptions = [];
    		this.customerUserPhone=''
    		this.customerUserGroupOptions=[]
				this.form.customerUserGroupId=''
    		this.staffName=''
    		this.staffUserName=''
    		this.form.staffId=''
    		this.staffDis=false
    		this.restaurants=[]
      	this.clearPurchaseContent()
   			this.resetForm('form')
   			this.form.expectedDeliveryDate=''
   			this.form.deliveryMemo=''
   			this.form.orderMemo=''
   			this.form.orderType='0'
   			this.form.packageMemo=''
   			this.form.packageType=''
   			this.form.receiveType=''
   			this.form.urgents=false
   			this.form.memoOrderNo=''
   			this.form.itemList=[{
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
      		availableQty:'',//项目折扣
      		costTax:'',//项目折扣
      		amount:0,//小计
      		totalPrice:0,
      	}]
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
	  /*/deep/.el-table .tableRow{
	  	height: 85px;
	  }*/
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

	  /*.el-table {
	  	.el-input__inner{
	  		padding: 0px 0px;
	  	}
	  }
	      .el-form-item{
	        .el-form-item__label{
	     	padding-right: 0px;
	     }
	        .el-input{
	          height: 40px;
	        }
	        .tipBox{
	          height: 20px;
	          font-size: 12px;
	          margin-left: 20px;
	        }
	        .el-form-item_err{
	          color: #f56c6c;
	          font-size: 12px;
	          line-height: 1;
	          padding-top: 4px;
	          position: absolute;
	          top: 100%;
	          left: 0;
	        }
	    }*/
	}
}
</style>
