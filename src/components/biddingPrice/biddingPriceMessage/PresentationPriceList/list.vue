<template>
  <div class="PresentationPriceList returnOrderBox">
    <div class="buttonBox">
      <el-button size="small" v-for="(buttondata,index) in buttondatas" :key="index" :class="{ active: buttonshow==index }" @click="header_button_click(index)">{{buttondata.statusName}}（{{buttondata.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
		  <el-button size="small" class="w80 h40" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom clearfix" v-if="isShow">
      	<div class="row_chunk">
      		<div class="chunk">
      			<span>竞价信息ID:</span>
		        <el-input
		          placeholder="竞价信息ID"
		          v-model="queryData.biddingNo"
		          clearable>
		        </el-input>
      		</div>
      		<div class="chunk">
      			<span>外部竞价编号:</span>
		        <el-input
		          placeholder="外部竞价编号"
		          v-model="queryData.exteriorNo"
		          clearable>
		        </el-input>
      		</div>
      		<div class="chunk">
      			<span>是否已报价:</span>
		        <el-select v-model="queryData.priceQuoteStatus" placeholder="是否已报价" style="padding: 5px;">
		          <el-option label="全部" :value="null"></el-option>
		          <el-option label="是" value="2"></el-option>
		          <el-option label="否" value="1"></el-option>
		        </el-select>
      		</div>
      		<div class="chunk">
      			<span>竞价结果:</span>
		        <el-select v-model="queryData.biddingResult" placeholder="竞价结果" style="padding: 5px;">
		          <el-option label="全部" :value="null"></el-option>
		          <el-option label="竞价成功" value="1"></el-option>
		          <el-option label="竞价失败" value="2"></el-option>
		          <el-option label="流拍" value="3"></el-option>
		        </el-select>
      		</div>
      	</div>
      	<div class="row_chunk">
      		<div class="chunk">
      			<span>项目名称:</span>
		        <el-select
		        	style="padding: 5px;"
					    v-model="queryData.projectId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="项目名称"
					    :remote-method="remoteMethod">
					    <el-option
					      v-for="item in options4"
					      :key="item.value"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
      		</div>
      		<div class="chunk">
      			<span>客户:</span>
		          <el-autocomplete
					      class="inline-input"
					      style="width: 100%;max-width: 200px;padding: 5px;"
					      v-model="queryData.customerNameCustomize"
					      :fetch-suggestions="querySearch"
					      :trigger-on-focus='false'
					      value-key="name"
					      :hide-loading='true'
					      placeholder="请输入客户"
					      clearable
					    ></el-autocomplete>
					     <!--@select="handleSelect"
					      @change="handlechange()"-->
		        </el-input>
      		</div>
      		<div class="chunk">
      			<span>中标公司:</span>
		        <el-input
		          placeholder="中标公司"
		          v-model="queryData.winningBiddingCompany"
		          clearable>
		        </el-input>
      		</div>
      		<div class="chunk">
      			<span>结果跟踪:</span>
		        <el-select v-model="queryData.resultStatus" placeholder="结果跟踪" style="padding: 5px;">
		          <el-option label="全部" :value="null"></el-option>
		          <el-option label="未开始" value="1"></el-option>
		          <el-option label="发货中" value="2"></el-option>
		          <el-option label="已完成" value="3"></el-option>
		          <el-option label="交易作废" value="4"></el-option>
		        </el-select>
      		</div>
      	</div>
      	<div class="row_chunk">
      		<div class="chunk">
      			<span>报备状态:</span>
		        <el-select v-model="queryData.reportPreparedStatus" placeholder="报备状态" style="padding: 5px;">
		          <el-option label="全部" :value="null"></el-option>
		          <el-option label="无报备" value="0"></el-option>
		          <el-option label="已报备" value="1"></el-option>
		          <el-option label="报备异常" value="2"></el-option>
		          <el-option label="已取消" value="3"></el-option>
		        </el-select>
      		</div>
      		<div class="chunk">
      			<span>服务方:</span>
		        <el-select
					    v-model="queryData.serverId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod2"
					    style="padding: 5px;"
					    >
					    <el-option
					      v-for="item in options2"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
      		</div>
      	</div>
      	<div class="row_chunk">
      		<div class="chunk_five">
      			<span>收货地址:</span>
      			<div class="address">
      				<div class="address_chunk">
      					<el-select v-model="queryData.provinceId" filterable  placeholder="省" style="width: 100%;padding: 5px;" @change="o1change">
						      <el-option 
						      	v-for="o in o1"
						      	:key="o.id"
						      	:label="o.name" 
						      	:value="o.id">	      	
						      </el-option>	      
						    </el-select>
      				</div>
      				<div class="address_chunk">
      					<el-select v-model="queryData.cityId" filterable placeholder="市" style="width: 100%;padding: 5px;" @change="o2change">
						      <el-option 
						      	v-for="o in o2"
						      	:key="o.id"
						      	:label="o.name" 
						      	:value="o.id">	      	
						      </el-option>
						    </el-select>
      				</div>
      				<div class="address_chunk">
      					<el-select v-model="queryData.countyId" filterable placeholder="县/区" style="width: 100%;padding: 5px;">
						      <el-option 
						      	v-for="o in o3"
						      	:key="o.id"
						      	:label="o.name" 
						      	:value="o.id">	      	
						      </el-option>
						    </el-select>
      				</div>
      			</div>
      		</div>
      		<div class="chunk_five">
      			<span>时间:</span>
		        <div class="address">
      				<div class="address_chunk">
      					<el-select v-model="queryData.timeType" placeholder="时间" style="padding: 5px;">
				          <el-option label="报价截止时间" value="0"></el-option>
				          <el-option label="竞价截止时间" value="1"></el-option>
				          <el-option label="创建时间" value="2"></el-option>
				        </el-select>
      				</div>
      				<div class="address_chunk">
      					<el-date-picker
						      v-model="queryData.sTime"
						      type="datetime"
						      value-format="yyyy-MM-dd HH:mm:ss"
						      placeholder="选择日期时间"
						      style="width: 100%;padding: 5px 0;">
						    </el-date-picker>
      				</div>
      				<i>至</i>
      				<div class="address_chunk">
      					<el-date-picker
						      v-model="queryData.eTime"
						      type="datetime"
						      placeholder="选择日期时间"
						      value-format="yyyy-MM-dd HH:mm:ss"
						      style="width: 100%;padding: 5px 0;">
						    </el-date-picker>
      				</div>
      			</div>
      		</div>
      	</div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span class="shuju"><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					<div class="operation_btn"  @click="exports()" v-if="$authorities.presentationPriceImport"><i class="iconfont icondaochu"></i>导出</div>
					
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
			      type="selection"
			      width="55">
			    </el-table-column>
          <el-table-column
            prop="biddingNo"
            fixed="left"
            label="竞价信息ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="exteriorNo"
            label="外部竞价编号"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="customerNameCustomize"
            label="客户"
            align="center">
          </el-table-column>
          <el-table-column
            prop="detailAddressLine"
            label="收货地址"
            min-width="150"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width='88'
            align="center">
          </el-table-column>
          <el-table-column
            prop="priceQuoteEndTime"
            label="报价截止时间"
            min-width='88'
            align="center">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="竞价截止时间"
            min-width='88'
            align="center">
          </el-table-column>
          <el-table-column
            prop="startPrice"
            label="起拍价"
            align="center">
          </el-table-column>
          <el-table-column
            prop="serverName"
            label="服务方"
            align="center">
          </el-table-column>
          <el-table-column
            prop="priceQuoteStatusName"
            label="是否已报价"
            align="center">
            <template slot-scope="scope">
            	<span style="color: red;" v-if="scope.row.priceQuoteStatus==2">{{scope.row.priceQuoteStatusName}}</span>
            	<span  v-else>{{scope.row.priceQuoteStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="状态"
            align="center">
          </el-table-column> 
          <el-table-column
            prop="statusName"
            label="报备状态"
            align="center">
            <template slot-scope="scope">
            	<span v-if="scope.row.reportPreparedStatus==2" style="color: #FF0000;">{{scope.row.reportPreparedStatusName}}</span>
            	<span v-else>{{scope.row.reportPreparedStatusName}}</span>
            	<br />
              <router-link v-show="scope.row.reportPreparedStatus!=0" :to="{name:'PresentationPriceDetail',query:{id:scope.row.id}}">
                <el-button type="text">查看报备详细</el-button>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="biddingResultName"
            label="竞价结果"
            align="center">
          </el-table-column>
          <el-table-column
            prop="winningBiddingCompany"
            label="中标公司"
            align="center">
          </el-table-column>
          <el-table-column
            prop="resultStatusName"
            label="结果跟踪"
            width="90px"
            align="center">
            <template slot-scope="scope">
            	<span>{{scope.row.resultStatusName}}</span><br />
              <router-link v-if="scope.row.resultStatus==2" :to="{name:'OrderDetail',query:{id:scope.row.orderId}}" target="_blank">
                <el-button type="text">查看订单详细</el-button>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="130px"
            fixed="right"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" v-show="scope.row.status==1"  @click="goOffer(scope.row.id)" v-if="$authorities.presentationPriceIng">报价</el-button>
            		<el-button  type="text" size="small" v-show="scope.row.status==4&&scope.row.biddingResult==1&&scope.row.resultStatus==1" @click="goCreate(scope.row)" v-if="$authorities.presentationPriceCreateOrder">生成订单</el-button>
            		<el-button  type="text" size="small" @click="goDetail(scope.row.id)" v-if="$authorities.presentationPriceDetail">详情</el-button>
            		<el-button  type="text" size="small" v-show="scope.row.status==4&&scope.row.biddingResult==1&&scope.row.resultStatus==1"  @click="dialogLock=true,toVoidId=scope.row.id" v-if="$authorities.presentationPriceTovoid">交易作废</el-button>
            </template>
          </el-table-column>
        </el-table>
      
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20,30,40,50, 100,500]"
          :current-page="queryData.pageNum"
          :page-size="queryData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
		<el-dialog
		  title="删除提示"
		  :visible.sync="dialogVisible1"
		  width="30%"
		  >
		  <span>删除之后，列表将不再展示该数据，确定要删除吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="isactivate()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="作废提示"
		  :visible.sync="dialogLock"
		  width="30%"
		  >
		  <span>请确保已于客户沟通过作废该条竞价信息，确认要作废吗?</span>
		  <span slot="footer" class="dialog-footer">
		  	<el-button @click="dialogLock = false">取 消</el-button>
		    <el-button type="primary" @click="isTovoid()">确 定</el-button>
		  </span>
		</el-dialog>


  </div>
</template>

<script>
	import { provinces_based_id, subs, } from "@/api/basicSupplier"
	import {
		nameList,
	} from '@/api/projectController/projectController'
	import {
		quoteListQuote,
		quoteListBidden,
		quoteListFinished,
		quoteListUnfinished,
		biddStatusCount,
		toVoidBuss,
		quoteExport
	} from '@/api/biddingPrice/biddingPrice'
	import {
  customerName
} from "@/api/customerManage";
	import {
		organizationListName
	} from '@/api/payment/customerPayment'
  export default {
	inject:['reload'],
	name:'PresentationPriceList',
    data() {
      return {
      	toVoidId:'',
      	importType:'Project_Import_Template',
      	account:'',
      	acrealName:'',
      	dialogLock:false,
      	dialogProjectName:'',
      	dialogProjectYi:'',
      	queryData:{
      		"customerNameCustomize":'',
      		"biddingNo": null,
				  "biddingResult": null,
				  "cityId": null,
				  "countyId": null,
				  "eTime": null,
				  "exteriorNo": null,
				  "pageNum": 1,
				  "pageSize": 10,
				  "priceQuoteStatus": null,
				  "projectId": null,
				  "provinceId": null,
				  "reportPreparedStatus": null,
				  "resultStatus": null,
				  "sTime": null,
				  "serverId": null,
				  "timeType": '0',
				  "winningBiddingCompany": null
      	},
      	o1:[],
      	o2:[],
      	o3:[],
      	dialogVisible1: false,
      	buttondatas:[
      	],
      	pagetotal:null,
      	buttonshow:0,
        isShow:true,
        tableData: [],
        options4:[],
        options2:[],
      }
    },
    computed:{
	    dataListHeight(){
	      return this.$store.getters.dataListHeight;
	    }
    },
    components:{
    },
    created(){
    	provinces_based_id().then(res => {
			this.o1=res.data
		})
    	if(this.$route.query.status){
    		this.buttonshow=this.$route.query.status
    	}
    	this.getstatusCount()
    	this.requestData()
	},
	activated(){
		if(this.$route.params.isUpdate){
			this.getstatusCount()
    		this.requestData()
		}
	},
    mounted(){
    	console.log(this.$auth.user.id)
    },
    methods: {
    	goCreate(row){
    		this.$router.push({
    			path:'/biddingPrice/PresentationPriceList/create',
    			query:{
    				id:row.id,
    				serverId:row.serverId
    			}
    		})
    	},
    	exports(){
    		quoteExport(this.queryData,{status:this.buttonshow+1}).then(res=>{
    			let url = window.URL.createObjectURL(new Blob([res],{type:"application/xls"}))
				  let link = document.createElement('a')
				  link.style.display = 'none'
				  link.href = url
				  link.setAttribute('download', '报价列表信息.xls')
				  document.body.appendChild(link)
				  link.click()
    		})
    	},
    	isTovoid(id){
    		toVoidBuss(this.toVoidId).then(res=>{
    			this.$message({
	          type: "success",
	          message: "作废成功"
	        });
	        this.getstatusCount()
    			this.requestData()
    		})
    	},
    	querySearch(queryString, cb) {
        	customerName(queryString).then(res=>{
	          	var customerOptions=res.data
	          	cb(customerOptions);
	          })
      	},
    	o1change(data){
					this.queryData.cityId=''
					this.queryData.countyId=''
				subs(data).then(res=>{
					this.o2=res.data
				})
		},
		o2change(data){
				this.queryData.countyId=''
				subs(data).then(res=>{
					this.o3=res.data
				})
		},
    	query(){
    		this.queryData.pageNum=1
    		this.requestData()
		},
		reset(){
			let queryData={
      			"customerNameCustomize":'',
      			"biddingNo": null,
				"biddingResult": null,
				"cityId": null,
				"countyId": null,
				"eTime": null,
				"exteriorNo": null,
				"pageNum":this.queryData.pageNum,
				"pageSize":this.queryData.pageSize,
				"priceQuoteStatus": null,
				"projectId": null,
				"provinceId": null,
				"reportPreparedStatus": null,
				"resultStatus": null,
				"sTime": null,
				"serverId": null,
				"timeType": '0',
				"winningBiddingCompany": null
			};
			this.queryData=queryData;
			this.requestData()  
    	},
    	getstatusCount(){
    		biddStatusCount().then(res=>{
    			this.buttondatas=res.data
    		})
    	},
    	requestData(index){
    		
    		let n=index?index:this.buttonshow
    		switch(n.toString()){	
				case '0':
				this.getquoteListQuote()
				  break;
				case '1':
				this.getquoteListBidden()
				  break;
				case '2':
				this.getquoteListUnfinished()
				  break;
				case '3':
				this.getquoteListFinished()
				  break;
				}
    	
    	},
    	showDialog(type, row) {
	      this.$refs[type].init(row);
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
    	downClick(row){
    		const { href } = this.$router.resolve({
          name: 'ExamineProject',
          query:{
          	detailId:row.id
          }
        })
        window.open(href, '_blank')
    	},
    	offerDown(row){
    		this.$router.push({
        	path:'/biddingPrice/PresentationPriceList/offer',
        	query:{
          	detailId:3
          }
        })
    	},
    	header_button_click(index){
    		this.buttonshow=index
    		this.getstatusCount()
    		this.requestData(index)
    	},
    	
    	getquoteListQuote(){
    		quoteListQuote(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getquoteListBidden(){
    		quoteListBidden(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getquoteListFinished(){
    		quoteListFinished(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	getquoteListUnfinished(){
    		quoteListUnfinished(this.queryData).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	remoteMethod2(query) {
        if (query !== '') {
          organizationListName({name:query}).then(res=>{
          	this.options2=res.data
          })
        } else {
          this.options2 = [];
        }
      },
    	//项目名称模糊搜索
    	remoteMethod(query) {
        if (query !== '') {
          nameList({name:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
    	
    	

      goDetail(id){
        this.$router.push({
        	path:'/biddingPrice/PresentationPriceList/detail',
        	query:{
          	id:id
          }
        })
      },
      goOffer(id){
      	this.$router.push({
        	path:'/biddingPrice/PresentationPriceList/offer',
        	query:{
          	id:id
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.queryData.pageSize=val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.queryData.pageNum=val
        this.requestData()
      },
      showHelp(){
        this.isShow=!this.isShow;
      }

    }
  }
</script>
<style scoped lang="less">
  .PresentationPriceList {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .active{
      	background-color: #339999;
      	border-color: #339999;
      	color: #FFFFFF;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-top: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        line-height: 50px;
      }
      span {
        margin-left: 10px;
          font-size: 14px;
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
        background-color: #FFFFFF;

        /*margin-top: -2px;*/
       	.row_chunk{
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
       			span{
       				text-align: right;
       				flex: 0 0 88px;
       			}
       			
       		}
       	}
        .el-input {
        	max-width: 200px;
					padding: 5px;
        }
        .el-select{
        	max-width: 200px;
        }
      }
    }
    .listBox {
      /*height: 50px;*/
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
    .d-top{
    	.L{
    		float: left;
    		
    	}
    	.R{
    		float: right;
    	}
    }
  }
</style>

<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>