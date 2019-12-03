<template>
			<el-dialog
		  title="选择开票明细"
		  :visible.sync="dialogVisible1"
		  width="70%"
		  >
		  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="iconfont icon-top" v-show="isShow"></i>
            <i class="iconfont icon-xia" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
        </div>
      </div>
      <div class="homeBoxBottom clearfix" v-if="isShow">
        <div class="item">
        	<span>下单日期：</span>
        <el-date-picker
          v-model="downOrderTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        </div>
        <div class="item">
        	<span>完成时间：</span>
	        <el-date-picker
	          v-model="invoiceTime"
	          type="daterange"
	          range-separator="至"
	          start-placeholder="开始日期"
	          end-placeholder="结束日期"
	          value-format="yyyy-MM-dd"
	        ></el-date-picker>
        </div>
        <br>
        <div class="item">
        	<span>订单号：</span>
        	<el-input placeholder="订单号" v-model="query.no" clearable></el-input>
        </div>
        <div class="item">
        	<span>客户：</span>
        <el-select
        			:disabled="customerDisabled"
	        		style="max-width: 200px;"
					    v-model="query.customerId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    :remote-method="remoteCustomer"
					    @change="customerChange"
					    >
					    <el-option
					      v-for="item in customerOption"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
        </div>
        <div class="item">
        	<span>采购人：</span>
        <el-select
        	:disabled="purchaseDisabled"
	        		style="max-width: 200px;"
					    v-model="query.customerUserId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remotePurchase"
					    @change="purchaseChange"
					    >
					    <el-option
					      v-for="item in purchaseOption"
					      :key="item.userId"
					      :label="item.name"
					      :value="item.userId">
					    </el-option>
					  </el-select>
        </div>
        
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxTop-left">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">当前页面全选</el-checkbox>
          <!--<span @click="sicchange()" style="color: red;cursor: pointer;">当前页面全选</span>-->
        </div>
        <div class="listBoxRight">
          <el-button size="small" @click="DeliveryData()">添加到结算单</el-button>
        </div>
      </div>
      <div class="" v-for="(item,index) in tableData" :key="item.no"style="border-bottom: 3px solid #FFFFFF;">
      	<div class=""  @click="openTable(index)" style="position: relative;">
					  <div style="padding-right: 50px;padding-left: 20px;cursor: pointer; ">
					  				{{`订单号：${item.no}&nbsp;&nbsp;&nbsp;&nbsp;
					  					下单人：${item.creatorName}&nbsp;&nbsp;&nbsp;&nbsp;
					  					下单时间：${item.createTime}&nbsp;&nbsp;&nbsp;&nbsp;
					  					订单状态：${item.status}&nbsp;&nbsp;&nbsp;&nbsp;
					  					配送地址：${item.customerReceiptAddress} `}}
					  </div>
					  <div id="" style="position: absolute;top:0px;right:0px; width: 30px;">
					  	<i :class="item.open?'el-icon-arrow-down go':'el-icon-arrow-down aa '"></i>
					  </div>
      	</div>
      	<el-collapse-transition>
        <div v-show="item.open" class="hjdkfg" style="box-sizing: border-box;padding: 5px 10px;">
          <el-table
		      	:ref="'multipleTable'+index"
		        :data="item.billOrderItemList"
		        :key="index+'aaa'"
		        border
		        size="small"
		        row-class-name="shine"
		        cell-class-name="shine"
		        :span-method="objectSpanMethod"
		        @selection-change="(val)=>{tableSelectionChange(val,item)}"
		      >
		        <el-table-column type="selection" :selectable="disSelectable" ></el-table-column>
		        <!--<el-table-column v-if="false">
		        	<template slot="header" slot-scope="scope">
				        <span>{{`订单号：${item.no}&nbsp;&nbsp;&nbsp;&nbsp;下单人：${item.creatorName}&nbsp;&nbsp;&nbsp;&nbsp;下单时间：${item.createTime}&nbsp;&nbsp;&nbsp;&nbsp;订单状态：${item.status}&nbsp;&nbsp;&nbsp;&nbsp;配送地址：${item.customerReceiptAddress} `}}</span>
				      </template>-->
		        	<el-table-column prop="skuNo" label="商品编号：" align="center" >
		          <!--<template slot-scope="scope">{{scope.row.id}}</template>-->
		          </el-table-column>
		          <el-table-column prop="skuName" label="商品名称" align="center" min-width="150"></el-table-column>
		          <el-table-column prop="itemQty" label="数量" align="center">
		            <!--<template slot-scope="scope">{{scope.row.skuCount}}</template>-->
		          </el-table-column>
		          <el-table-column prop="price" label="单价(￥)" align="center">
		            <template slot-scope="scope">{{scope.row.itemAmount/scope.row.itemQty}}</template>
		          </el-table-column>
		          <el-table-column prop="itemAmount" label="总金额(￥)" align="center">
		            <!--<template slot-scope="scope">{{scope.row.price}}</template>-->
		          </el-table-column>
		          <el-table-column prop="settlementAmount" label="已发起结算金额(￥)" align="center">
		            <!--<template slot-scope="scope">{{filterData((scope.row.itemAmount*scope.row.settlementQty)/scope.row.itemQty)}}</template>-->
		          </el-table-column>
		          <el-table-column prop="billableQty" label="可结算数量" align="center">
		            <!--<template slot-scope="scope">{{scope.row.price}}</template>-->
		          </el-table-column>
		          <el-table-column label="总计" align="center">
		            <template><span v-if="item.itemType!=2">订单总额</span><span v-if="item.itemType==2">自定义订单总额</span>：¥{{item.amount}}<br/> 已开票：¥{{item.invoiceAmount}}</template>
		          </el-table-column>
		        <!--</el-table-column>-->
		      </el-table>
        </div>
      	</el-collapse-transition>
      </div>
      
      
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query.pageNum"
          :page-size="query.pageSize"
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
		  <span slot="footer" class="dialog-footer">
		   
		  </span>
		</el-dialog>
  
</template>
<script>
	import {
		pickList,
	} from '@/api/payment/customerPayment'
	import {
		customerNameList,
		customerUserNameList,
	} from '@/api/order/saleDown'
		import {returnFloat,returnFloatFour} from '@/utils/index'
export default {
  inject: ["reload"],
//props: {
//  projectId: {
//    default: ""
//  },
//  customerId: {
//    default: ""
//  },
//  customerUserId: {
//    default: ""
//  },
//  billId: {
//    default: ""
//  },
//  customerOptions: {
//    default: []
//  },
//  purchaseOptions: {
//    default: []
//  },
//  serverId: {
//    default: ""
//  },
//  itemIds: {
//    default: []
//  },
//},
  data() {
    return {
    	checkAll:false,
    	isIndeterminate:false,
    	dialogVisible1:false,
    	customerDisabled:false,
    	purchaseDisabled:false,
    	customerOption:[],
			purchaseOption:[],
    	downOrderTime:'',
    	invoiceTime:'',
      isShow: true,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      tableData: null,
      totalPage: 0,
      remoteLoading: false, //筛选查询loading
      query: {
      	itemIds:[],
        pageNum: 1,
        pageSize: 10,
        customerId: "",
        customerUserId: "",
        no: "",
        organizationId: "",
        projectId: "",
        createFinishTime: "",
        createStartTime: "",
        finishEndTime: "",
        finishStartTime: "",
        billId:'',
      },
      allITemLength:0,
      selectionData:[],
    };
  },
  watch:{
  	downOrderTime(a,b){
  		if(a){
	  		this.query.createStartTime=a[0]
	  		this.query.createFinishTime=a[1]  			
  		}else{
  			this.query.createStartTime=''
  			this.query.createFinishTime=''
  		}
  	},
  	invoiceTime(a,b){
  		if(a){
  			this.query.finishStartTime=a[0]
  			this.query.finishEndTime=a[1]
  		}else{
  			this.query.finishStartTime=''
  			this.query.finishEndTime=''
  		}

  	}
  },
  components: {
    
  },
  filter:{
  	
  },
  created(){
//	this.query.itemIds=this.itemIds
//	this.query.projectId=this.projectId
//	this.query.organizationId=this.serverId
//	this.query.customerId=this.customerId
//	this.query.customerUserId=this.customerUserId
//	this.query.billId=this.billId
//	if(this.customerId){
//		this.customerDisabled=true
//	}
//	if(this.customerUserId){
//  this.purchaseDisabled=true
//	}
//	this.customerOption=this.customerOptions
//	this.purchaseOption=this.purchaseOptions
//	this.getTableData();
  },
  mounted() {
    //获取表格数据
//  this.getTableData();
  },
  methods: {
  	openTable(index){
		this.tableData[index].open= !this.tableData[index].open
  		
  		this.$set(this.tableData,index,this.tableData[index])
  		console.log(this.tableData)
  	},
  	init(projectId,serverId,customerId,customerUserId,billId,customerOptions,purchaseOptions,itemIds){
  	this.selectionData=[]
  	this.query.itemIds=itemIds
  	this.query.projectId=projectId
  	this.query.organizationId=serverId
  	this.query.customerId=customerId
  	this.query.customerUserId=customerUserId
  	this.query.billId=billId?billId:''
  	this.customerOption=customerOptions
  	this.purchaseOption=purchaseOptions
		this.getTableData()
		if(customerId){
		this.customerDisabled=true
		}else{
			this.customerDisabled=false
		}
		if(customerUserId){
	    this.purchaseDisabled=true
		}
		this.dialogVisible1=true
  	},
  	handleCheckAllChange(val){
  		console.log(val)
  		if(val){
  			this.tableData.map((item,index)=>{
	  			item.billOrderItemList.map((row)=>{
	  				if(row.billableQty>0){
	  					this.$refs['multipleTable'+index][0].toggleRowSelection(row,true);
	  				}
	  			})
	  		})
  			this.isIndeterminate=false
  		}else{
  			this.tableData.map((item,index)=>{
  				this.$refs['multipleTable'+index][0].clearSelection()
	  		})
  			this.isIndeterminate=false
  		}
  	},
//	sicchange(){
//		this.tableData.map((item,index)=>{
//			item.billOrderItemList.map((row)=>{
//				this.$refs['multipleTable'+index][0].toggleRowSelection(row,true);
//			})
//		})
//	},
//  当选择项发生变化时会触发该事件
    tableSelectionChange(val,item){
    	console.log(val,item)
    	if(this.selectionData.length>0){
    		let idd=this.selectionData.map(res=>res.orderId)
	    	let ni=idd.indexOf(item.orderId)
	    	let a=item
    		a.selections=val
//  	等于-1代表所选订单不存在已选订单内
	    	if(ni!=-1){
	    		this.selectionData[ni]=a
	    	}else{
	    		this.selectionData.push(a)
	    	}
    	}else{
    		let a=item
    		a.selections=val
    		this.selectionData.push(a)
    	}
    	let ggg=0
    	
    	this.selectionData.map(item=>{
    		item.selections.map(it=>{
    			if(it.billableQty>0){
    				ggg+=1
    			}
    		})
    	})
    	
    	if(this.allITemLength===ggg){
    		this.isIndeterminate=false
    	}else{
    		this.isIndeterminate=true
    	}
    	if(ggg==0){
    		this.isIndeterminate=false
    	}
    	
    },
    disSelectable(row,index){
    	if(row.billableQty>0){
    		return true
    	}else{
    		return false
    	}
    },
    filterData(value){
  		return Math.round(value*100)/100 
  	},
    DeliveryData(){
    	let a=this.selectionData.filter(res=>res.selections.length>0)
    	console.log(a)
    	this.$emit("callback", a);
    	this.dialogVisible1=false
    },
    getTableData() {
    	this.tableData=[]
    	this.checkAll=false
  		this.isIndeterminate=false
			pickList(this.query).then(res=>{
				this.tableData=res.data.items
//				this.allITemLength
				let dd=0
				this.tableData.map(item=>{
					item.open=false
					item.billOrderItemList.map(it=>{
						if(it.billableQty>0){
							dd+=1
						}
					})
				})
				console.log(this.tableData)
				this.allITemLength=dd
				this.$nextTick(()=>{
					this.pageDisplay(this.tableData)
				})
				this.totalPage=res.data.total
			})
    },
    pageDisplay(arr){
    	let selectionIDs=this.selectionData.map(item=>{
    		return item.selections.map(it=>{
    			return it.itemId
    		})
    	}).flat()
    	arr.map((item,index)=>{
	  			item.billOrderItemList.map((row)=>{
	  				if(selectionIDs.includes(row.itemId)){
	  					this.$refs['multipleTable'+index][0].toggleRowSelection(row,true);
	  				}
	  			})
	  		})
    	console.log(selectionIDs)
    },
    remoteCustomer(query){
      	if (query !== '') {
      		if(this.query.projectId){
      			customerNameList({customerName:query,projectId:this.query.projectId}).then(res=>{
	          	this.customerOption=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个项目',
				        type: 'warning', 
				      })
      		}
      	}else{
      		this.customerOption = [];
      	}
      },
      customerChange(){
      	this.query.customerUserId=''
	    	
      },
    remotePurchase(query){
      	if (query !== '') {
      		if(this.query.customerId){
      			customerUserNameList({userName:query,customerId:this.query.customerId}).then(res=>{
	          	this.purchaseOption=res.data
	          })
      		}else{
      			this.$message({
				        message:'请选择一个客户',
				        type: 'warning', 
				      })
      		}
      	}else{
      		this.purchaseOption = [];
      	}
      },
    purchaseChange(value){
//  	this.tableData=[]
//	    this.selectionData=[]
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 8) {
        	if(rowIndex===0){
        		return {
              rowspan: 10033,
              colspan: 1,
            };
        	}else{
        		return {
              rowspan: 0,
              colspan: 1,
            };
        	}
            
        }
      },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
    	console.log(val)
      this.query.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.pageSize=val
      this.getTableData();
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  clear: both;
  .buttonBox {
    margin-top: 10px;
    .el-button {
      width: 160px;
      height: 30px;
    }
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      /* height: 50px;
         line-height: 50px;*/
      line-height: 50px;
    }
    .title {
      margin-left: 10px;
      font-size: 14px;
      line-height: 50px;
      cursor: pointer;
      color: #339999;
      display: inline-block;
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
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      padding-bottom: 10px;
      .item{
      	display: inline-block;
      }
      .el-input {
        width: 200px;
        margin-top: 10px;
        margin-left: 10px;
      }
      .el-select {
        margin-left: 10px;
        margin-top: 10px;
      }
      .el-date-editor {
        margin-left: 10px;
        margin-top: 10px;
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
      display: flex;
      justify-content: space-between;
      .listBoxTop-left {
        .myicon {
          margin-left: 20px;
          font-weight: bold;
          font-size: 20px;
        }
        span {
          margin-left: 5px;
          font-size: 14px;
          color: #303133;
          line-height: 50px;
        }
      }
    }
    .aa{
  		transition: all 0.3s;
    }
    .go{
    		
        transform:rotate(-180deg);
        transition: all 0.3s;
    }
    .listBoxRight {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
      .button-head {
        width: 120px;
        height: 30px;
        margin-right: 10px;
        border: 1px solid #d1d1d1;
        cursor: pointer;
        background-color: #fff;
        line-height: 30px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        .button-head-icon {
          margin-right: 5px;
        }
        .icon-add {
          font-size: 12px;
        }
        .icon-plane {
          font-size: 12px;
          font-weight: 700;
        }
      }
      .button-head:hover {
        color: #339999;
        border-color: #c2e0e0;
        background-color: #ebf5f5;
      }
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
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
    text-align: right;
  }
}
</style>
<style scoped>
.listBox >>> .el-table__expanded-cell {
  padding: 0;
}
.listBox >>> .shine {
  font-size: 14px;
}
</style>
