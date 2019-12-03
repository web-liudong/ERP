<template>
  <div class="basicSupplerBox">
  	<el-form :model="form" :rules="rules" ref="ruleForm"  class="addbac-ruleForm" >
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;基本信息：</span>
      </div>
      <div class="ListBox_content" style="border-top: 1px solid #e4e4e4;background-color: #FFFFFF;padding-top: 20px;">
      	<el-form-item prop="name"  label="结算单名称：" label-width="120px">
	         <el-input v-model="form.name"  style="max-width: 500px;"></el-input>
	      </el-form-item>
      <el-form-item required>
      <el-col style="width: 25%;">
	      <el-form-item prop="projectId"  label="项目：" label-width="70px" >
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
	    </el-col>
	    <el-col style="width: 25%;">
	      <el-form-item label="客户：" prop="customerId"  label-width="70px" >
	        <el-select
	        		style="max-width: 200px;"
					    v-model="form.customerId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
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
	    </el-col>
	    <el-col style="width: 25%;">
	      <el-form-item label="采购人：" label-width="85px">
	        <el-select
	        		style="max-width: 200px;"
					    v-model="form.customerUserId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
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
	    </el-col>
	    <el-col style="width: 25%;">
	      <el-form-item label="服务方："label-width="85px">
	        <el-select
	        		style="max-width: 200px;"
					    v-model="form.serverId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteService"
					    @change="serviceChange"
					    >
					    <el-option
					      v-for="item in serviceOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
	    </el-col>
    </el-form-item>
    <el-form-item   label="结算单备注：" label-width="120px">
	         <el-input v-model="form.memo"  style="max-width: 500px;"></el-input>
	  </el-form-item>
    <div style="height: 1px;"></div> 	
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;关联订单信息：</span>
        <el-table
          :data="tableOrderData"
          border
          stripe
          :row-key="(row)=>{row.no}"
          style="width: 100%"
          size="small">
          <el-table-column
            prop="no"
            label="订单编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="finishTime"
            label="完成时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="订单状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="订单金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="settlementAmount"
            label="已发起结算金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="currentAmount"
            label="本次结算金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="creatorName"
            label="下单人"
            align="center">
          </el-table-column>
        </el-table>
        <div class="table_foot" style="background-color: #FFFFFF;">
        	明细总金额￥{{this.detailedTotal}}
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;开票明细：</span>
        <div class="listBoxRight">
          <el-button size="small"@click="showTable()">选择开票明细</el-button>
					<el-button size="small" @click="clearAfter()">清空</el-button>
        </div>
        <el-table
          :data="currentGoodsData"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="no"
            label="订单编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuName"
            min-width="200"
            label="商品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="nameOnInvoice"
            label="开票名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="currentQty"
            label="数量"
            align="center">
          </el-table-column>
          <!--<el-table-column
            prop="price"
            label="开票单价"
            align="center">
          </el-table-column>-->
          <el-table-column
            prop="amount"
            label="明细价税合计（￥）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuModel"
            label="型号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="taxCode"
            label="税收分类编码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="taxCodeShortName"
            label="简称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="taxRate"
            label="税率"
            align="center">
            <template slot-scope="scope">
            		<el-select v-model="scope.row.taxRate" size="small" @change="(value)=>{taxRateChange(value,scope.$index)}">
							    <el-option label="0"value="0"></el-option>
							    <el-option label="2"value="2"></el-option>
							    <el-option label="3"value="3"></el-option>
							    <el-option label="6"value="6"></el-option>
							    <el-option label="9"value="9"></el-option>
							    <el-option label="10"value="10"></el-option>
							    <el-option label="13"value="13"></el-option>
							    <el-option label="16"value="16"></el-option>
							    <el-option label="17"value="17"></el-option>
							  </el-select>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="130px"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" @click="editItem(scope.row,scope.$index)">修改</el-button>
                <el-button  @click="deleteItem(scope.row,scope.$index)" type="text" size="small" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table_foot" style="background-color: #FFFFFF;">
        	明细总金额￥{{this.detailedTotal}}
        	<el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query.pageNum"
          :page-size="query.pageSize"
          :page-sizes="[10, 20, 30, 40,50,100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="totalPage"
        	></el-pagination>
        </div>
      </div>
    </div>
    <!--<div class="block clearfix">
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
      </div>-->
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
		<!--<el-dialog
		  title="选择开票明细"
		  :visible.sync="dialogVisible1"
		  width="70%"
		  >-->
		  <chooseOrder 
		  	@callback="getInvoiceData" 
		  	ref="chooseOrder" 
		  	
		  	 ></chooseOrder>
		  <!--<span slot="footer" class="dialog-footer">
		   
		  </span>
		</el-dialog>-->
		<el-dialog title="编辑明细" :visible.sync="editDialog">
			<div >
				<div class="clearfix">
				<el-col style="width: 50%;">
	      <el-form-item label="商品名称：" label-width="120px">
	        {{dialogGoodsName}}
	      </el-form-item>
	    </el-col>
	    <el-col style="width: 50%;">
	      <!--<el-form-item label="单价：" label-width="155px">
	        ￥{{dialogPrice}}
	      </el-form-item>-->
	    </el-col>
			</div>
			<div class="clearfix">
				<el-col style="width: 50%;">
	      <el-form-item label="总开票数量：" label-width="120px">
	        <span style="padding-right: 30px;">{{dialogInvoiceTotal}}</span><span>当前可开票数量：{{dialogInvoiceCount}}件</span>
	      </el-form-item>
	    </el-col>
	    <el-col style="width: 50%;">
	      <el-form-item label="总计：" label-width="155px">
	        ￥{{dialogTotal}}
	      </el-form-item>
	    </el-col>
			</div>
			<div class="clearfix">
				<el-col style="width: 50%;">
	      <el-form-item label="本次开票数量：" label-width="120px">
	        <el-input v-model="thisIscount" style="max-width: 200px;"></el-input>
	      </el-form-item>
	    </el-col>
			</div>
			</div>
			<span slot="footer" class="dialog-footer">
		    <el-button plain @click="preservation()">保 存</el-button>
		    <el-button type="primary" @click="editDialog=false">关 闭</el-button>
		  </span>
		</el-dialog>
	<div class="" style="text-align: center;height: 200px;padding-top: 20px;">
		 <el-button type="primary" @click="submitForm('ruleForm')">保存结算单</el-button>
		 <el-button type="primary" @click="close()">取消</el-button>
	</div>
</el-form>
  </div>
</template>

<script>
	import {returnFloat,returnFloatFour,returnFloatTwoFour} from '@/utils/index'
	import chooseOrder from '../chooseOrder/index'
	import {
		customerNameList,
		customerUserNameList,
		nameList
	} from '@/api/order/saleDown'
	import {
		editBill,
		organizationListName,
		billEditInfo,
		billEditInfoOrder,
		billEditInfoItem
	} from '@/api/payment/customerPayment'
		import {
		projectDetail
	} from '@/api/projectController/projectController'
  export default {
    inject:['close'],
    name: "editStatement",
    data() {
      return {
      	query:{
      		pageNum:1,
      		pageSize:10,
      	},
      	oldAmount:null,
      	Iscount:'',
      	orderIndex:'',
      	dialogGoodsName:'',
      	dialogPrice:'',
      	dialogInvoiceTotal:'',
      	dialogInvoiceCount:'',
      	thisIscount:'',
      	editDialog:false,
      	form:{
      		projectId:'',
      		customerId:'',
      		customerUserId:'',
      		serverId:'',
      		memo:'',
      		name:'',
      		updateBillOrderDTOList:[],
      		updateBillOrderItemDTOList:[]
//    		orderIds:[{
//    			billOrderItemDTOS:[
//    				{
//    					currentQty:0,
//    					default_RATE:0,
//    					itemId:0,
//    					taxRate:0,
//    				}
//    			],
//    			orderId:'',
//    		}]
      	},
      	tableGoodsData:[],
      	tableOrderData:[],
      	currentGoodsData:[],
      	rules: {
//    		validator: supplierNameRule,
				name: [{required: true,message: '请输入结算单名称',trigger: 'blur'}, ],
				projectId: [{required: true,message: '请选择项目',trigger: 'change'}, ],
				customerId: [{required: true,message: '请选择客户',trigger: 'change'}, ],
				},
				customerOptions:[],
				purchaseOptions:[],
				serviceOptions:[],
      	options3:[],
      	options4:[],
      	lockUserName:'',
      	lockRealName:'',
      	dialogVisible: false,
      	dialogVisible1: false,
      	//总页数
      	pagetotal:null,
      	//选中状态
      	buttonshow:0,
      	//当前页数
      	currentPage4: 1,
        isShow:true,
        editId:'',
        partyBId:'',
      }
    },
    components:{
    	chooseOrder,
    },
    computed:{
    	totalPage(){
    		return this.tableGoodsData.length
    	},
    	dialogTotal(){
    		return  Math.round(parseFloat((this.dialogPrice*this.thisIscount)/this.dialogInvoiceTotal) * 100) / 100
    	},
    	detailedTotal(){
    		let a=null
    		this.tableGoodsData.map(item=>{
    			a+=parseFloat(item.amount)
    		})
    		return returnFloat(a)
    	},
    },
    created(){
    	this.editId=this.$route.query.id
    	this.getDetail()
    },
    activated(){
    		if(this.$route.query.id!=this.editId){
    			this.getDetail()
    		}
    },
    watch:{
    	//监听明细数组变化重新计算关联订单信息
    	partyBId(a,b){
				if(a==this.$auth.user.userPosts[0].organizationId){
					this.rules.customerId=[{required: false,message: '请选择客户',trigger: 'change'}, ]
				}else{
					this.rules.customerId=[{required: true,message: '请选择客户',trigger: 'change'}, ]
				}
			},
//  	'tableGoodsData':{
//				handler:function(a,b){
//					console.log(111)
//					let noArr= Array.from(new Set(a.map(item=>item.no.toString())))
//					//拿到明细订单编号去重后的编号数组
//					let ht=this.tableOrderData.filter(res=>{
//						if(noArr.includes(res.no)){
//							res.currentAmount=0
//							return res
//						}
//					})
//					this.tableOrderData=ht
//					//过滤到多余订单 重新赋值给关联订单信息
//					a.map(item=>{
//						let hhhd=this.tableOrderData.map(res=>res.no)
//						let binahaoIndex = hhhd.indexOf(item.no)
//						this.tableOrderData[binahaoIndex].currentAmount+= parseFloat(item.amount)
//					})
//					//计算本次结算金额
//				},
//				deep:true
//			},
    },
    methods: {
    	getDetail(){
    		billEditInfo(this.$route.query.id).then(res=>{//主信息
    			console.log(res)
    			this.form.projectId=res.data.projectId
    			this.options3=[{
    				name:res.data.projectName,
    				id:res.data.projectId
    			}]
    			if(res.data.customerId!=0){
    				this.form.customerId=res.data.customerId
	    			this.customerOptions=[{
	    				name:res.data.customerName,
	    				id:res.data.customerId
	    			}]
    			}
    			if(res.data.customerUserId!=0){
    				this.form.customerUserId=res.data.customerUserId
	    			this.purchaseOptions=[{
	    				name:res.data.customerUserName,
	    				userId:res.data.customerUserId
	    			}]
    			}
    			if(res.data.serverId!=0){
    				this.form.serverId=res.data.serverId
	    			this.serviceOptions=[{
	    				name:res.data.serverId,
	    				id:res.data.serverName
	    			}]
    			}
    			this.form.name=res.data.name
    			this.form.memo=res.data.memo
    			projectDetail(this.form.projectId).then(res=>{
	    				this.partyBId=res.data.partyBId
	    			})
    		})
    		billEditInfoOrder(this.$route.query.id).then(res=>{//订单信息
    			this.tableOrderData=res.data
    		})
    		billEditInfoItem(this.$route.query.id).then(res=>{//明细信息
    			this.tableGoodsData=res.data.map(item=>{
    				item.no=parseInt(item.no)
    				return item
    			})
    			this.spliceGoodsData()
    		})
    		
    		
    	},
    	deleteItem(row,index){
    		this.oldAmount=row.amount
    		let changeindex=this.tableOrderData.map(item=>item.no).indexOf(row.no)
    		this.currentGoodsData.splice(index,1)
    		
    		this.tableGoodsData.splice(((this.query.pageNum-1)*this.query.pageSize)+index,1)
    		let inof =this.tableGoodsData.map(item=>item.no).indexOf(row.no)
    		if(inof>=0){
		  		this.tableOrderData[changeindex].currentAmount=this.tableOrderData[changeindex].currentAmount-this.oldAmount
    		}else{
    			this.tableOrderData.splice(changeindex,1)
    		}
    		
    	},
    	taxRateChange(value,index){
    		this.tableGoodsData[((this.query.pageNum-1)*this.query.pageSize)+index].taxRate=value
    	},
    	preservation(){
//  		this.tableGoodsData[this.orderIndex].currentQty=this.thisIscount
//  		this.tableGoodsData[this.orderIndex].amount=this.dialogTotal
//  		this.editDialog=false
//  		if(this.Iscount!=this.thisIscount){
//  			this.$message({
//				        message:'修改成功',
//				        type: 'success', 
//				      })
//  		}
    		if(/^\d+(\.\d{1,2})?$/.test(this.thisIscount)&&this.thisIscount<=this.dialogInvoiceCount&&0<this.thisIscount){
    			let obj=this.currentGoodsData[this.orderIndex]
					obj.currentQty=this.thisIscount
					obj.amount=this.dialogTotal
		  		this.$set(this.currentGoodsData,this.orderIndex,obj)
//		  		let oldAmount=this.tableGoodsData[((this.query.pageNum-1)*this.query.pageSize)+this.orderIndex].amount
		  		let changeNo=this.tableGoodsData[((this.query.pageNum-1)*this.query.pageSize)+this.orderIndex].no
		  		let changeindex=this.tableOrderData.map(item=>item.no).indexOf(changeNo)
		  		console.log(this.dialogTotal,this.oldAmount)
		  		//为什么拿不到修改前后得数据
		  		this.tableOrderData[changeindex].currentAmount=this.tableOrderData[changeindex].currentAmount+(this.dialogTotal-this.oldAmount)
		  		console.log(this.tableOrderData)
		  		this.tableGoodsData[((this.query.pageNum-1)*this.query.pageSize)+this.orderIndex].currentQty=this.thisIscount
//		  		this.tableGoodsData[((this.query.pageNum-1)*this.query.pageSize)+this.orderIndex].amount=this.dialogTotal
		  		console.log(this.tableGoodsData)
	    		this.editDialog=false
	    		if(this.Iscount!=this.thisIscount){
	    			this.$message({
					        message:'修改成功',
					        type: 'success', 
					      })
	    		}
    		}else{
    			this.$message({
				        message:'只能输入数字、小数最多后两位。且大于0小于等于可结算数量的数字',
				        type: 'error', 
				      })
    			
    		}
    	},
    	
    	editItem(row,index){
    		this.editDialog=true
    		this.orderIndex=index
    		this.dialogGoodsName=row.skuName
    		this.oldAmount=row.amount
    		//记录总价
//    	this.dialogPriceTotal= Math.round(parseFloat(row.itemAmount/row.itemQty) * 100) / 100
    		this.dialogPrice=  parseFloat(row.itemAmount)
      	//总开票数
      	this.dialogInvoiceTotal= parseFloat(row.itemQty)
//    	当前课开票数
      	this.dialogInvoiceCount= parseFloat(row.billableQty)
      	//总计
//    	本次开票数
      	this.thisIscount= parseFloat(row.currentQty)
      	this.Iscount= parseFloat(row.currentQty)
    	},
    	getInvoiceData(res){
    		let a=res
    		a.map((item,index)=>{
    			let b=item.no
    			let c=item.createTime
    			item.thisSettlement=null
    			item.selections.map((it,inx)=>{
    				it.no=b
    				it.createTime=c
    				it.currentQty=it.billableQty
    				it.amount= Math.round(parseFloat((it.itemAmount*it.billableQty)/it.itemQty) * 100) / 100
//  				item.thisSettlement+=it.amount
    			})
    		})
    		this.dialogVisible1=false
    		let thisOrderIds=this.tableOrderData.map(res=>res.no)
    		let newOrder=a.filter(item=>!thisOrderIds.includes(item.no))
    		this.tableOrderData=this.tableOrderData.concat(newOrder)
    		
    		let bb=[]
    		a.map((item)=>{
    			 bb.push(...item.selections) 
    		})
    		this.tableGoodsData=this.tableGoodsData.concat(bb)
    		console.log(this.tableOrderData)
    		this.spliceGoodsData()
    		this.addgoods(this.tableGoodsData)
    	},
    	spliceGoodsData(){
    		var arr=[]
    		for(let i=0;i<this.query.pageSize;i++){
    			let num=((this.query.pageNum-1)*this.query.pageSize)+i
    			console.log(num)
    			if(this.tableGoodsData[ num ]){
    				arr.push(this.tableGoodsData[ num ])
    			}
    		}
    		this.currentGoodsData=arr
    		console.log(this.currentGoodsData)
    	},
    	addgoods(a){
    		let noArr= Array.from(new Set(a.map(item=>item.no)))
					//拿到明细订单编号去重后的编号数组
					let ht=this.tableOrderData.filter(res=>{
						if(noArr.includes(res.no)){
							res.currentAmount=0
							return res
						}
					})
					console.log(ht)
					this.tableOrderData=ht
					//过滤到多余订单 重新赋值给关联订单信息
					a.map(item=>{
						let hhhd=this.tableOrderData.map(res=>res.no)
						let binahaoIndex = hhhd.indexOf(item.no)
						this.tableOrderData[binahaoIndex].currentAmount+= parseFloat(item.amount)
					})
    	},
    	serviceChange(){
    		
    	},
    	customerChange(){
      	this.form.customerUserId=''
	    	this.tableGoodsData=[]
      	this.tableOrderData=[]
      	this.currentGoodsData=[]
      },
    	purchaseChange(){
    		this.tableGoodsData=[]
      	this.tableOrderData=[]
      	this.currentGoodsData=[]
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
      		if(this.form.customerId){
      			customerUserNameList({userName:query,customerId:this.form.customerId}).then(res=>{
	          	this.purchaseOptions=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个客户',
				        type: 'warning', 
				      })
      		}
      	}else{
      		this.purchaseOptions = [];
      	}
      },
      remoteService(query){
      	if (query !== '') {
      			organizationListName({name:query}).then(res=>{
	          	this.serviceOptions=res.data
	          })
      	}else{
      		this.serviceOptions = [];
      	}
      },
      
    	userNamechange(value){
    		
    		if(value){
    			projectDetail(value).then(res=>{
	    				this.partyBId=res.data.partyBId
	    			})
    		}
    		
				this.form.customerId=''
	    	this.form.customerUserId=''
	    	this.tableGoodsData=[]
      	this.tableOrderData=[]
      	this.currentGoodsData=[]
	    	
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
    	submitForm(formName) {
//			let a=this.tableGoodsData.map(item=>item.orderId)
//			let b=Array.from(new Set(a))
//			let c=[]
//			b.map(res=>{
//				c.push({orderId:res,billOrderItemDTOS:[]})
//			})
//			this.tableGoodsData.map(item=>{
//				let itemOrderId=item.orderId
//				c.map(it=>{
//					if(itemOrderId==it.orderId){
//						it.billOrderItemDTOS.push({
//								currentQty:item.currentQty,
//    					itemId:item.itemId,
//    					taxRate:item.taxRate
//						})
//					}
//				})
//			})
			this.form.updateBillOrderDTOList=this.tableOrderData.map(item=>{
				return {currentAmount:item.currentAmount,orderId:item.orderId}
			})
			this.form.updateBillOrderItemDTOList=this.tableGoodsData.map(item=>{
				return {billOrderId:item.billOrderId?item.billOrderId:null,
								currentQty:item.currentQty,
								itemId:item.itemId,
								orderId:item.orderId,
								taxRate:item.taxRate
							}
			})
//			this.form.orderIds=c
			this.$refs[formName].validate((valid) => {
				if(valid) {
				editBill(this.form,this.$route.query.id).then(res=>{
					this.$message({
				        message:'保存成功',
				        type: 'success', 
				      })
					this.close({
				        		name:'editStatement',
				        		to:{
				        			name:'customerStatementList',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
				})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
    	showTable(){
    		this.dialogVisible1=true
    		let itemIds=this.tableGoodsData.map(item=>item.itemId)
    		 this.$refs["chooseOrder"].init(this.form.projectId,this.form.serverId,this.form.customerId,this.form.customerUserId,this.$route.query.id,this.customerOptions,this.purchaseOptions,itemIds);
    	},
    	clearAfter(){
    		for(var i = this.tableGoodsData.length-1;i >= 0 ;i--){
    			this.tableGoodsData.splice(i,1)
    		}
    	},
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize=val    
				this.spliceGoodsData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.query.pageNum=val
        this.spliceGoodsData()
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
          padding: 5px ;

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