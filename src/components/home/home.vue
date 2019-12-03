<template>
  <div class="containerBox">
    <div class="buttonBox">
      <panel-group @handleSetLineChartData="handleSetLineChartData"/>
    </div>
    <el-row :gutter="32" style="margin-bottom: 30px;">
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
        	<pending-disposal></pending-disposal>
        	<shortcut-entry style="margin-top: 20px;"></shortcut-entry>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
         <push-message></push-message>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-bottom: 30px;">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
        	<top-list :headname="'本月项目下单TOP榜'" :iconClass="'iconTOPbang'" :data="projectData"></top-list>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
        	<top-list :headname="'本月伙伴业绩TOP榜'" :iconClass="'iconTOPbang'" :data="organizationData"></top-list>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;margin-bottom:32px;box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.07);">
    	<div class="">
    		<common-header :headname="'订单统计'" :iconClass="'icon-jinqi'">
    		</common-header>
	    		<el-row>
	    			<!--<el-col :xs="24" :sm="8" :lg="4">
			        <p style="margin-top: 40px;">本月订单总数</p>
			        <h4 style="font-size: 30px;line-height: 40px;">10000</h4>
			        <p>  <span>↑ &nbsp;10%</span> 同比上周</p>
			        <p>本周订单数量</p>
			        <h4 style="font-size: 30px;line-height: 40px;">10000</h4>
			        <p><span>↓ &nbsp;10%</span> 同比上周</p>
			      </el-col>-->
			      <el-col :xs="24" :sm="24" :lg="24">
			      	<div class="" style="text-align: right;">
			      		<!--<span style="float: left;line-height: 50px;">近一周订单统计</span>-->
			      		<!--<el-button  type="text" size="small" style="line-height: 50px;padding: 0;">本周</el-button>
			      		<el-button  type="text" size="small"  style="line-height: 50px;padding: 0;">本月</el-button>-->
			      		<span class="istie" :class="isdays==7?'grcolor':''" @click="handlerTypeTime(7)">本周</span>
			      		<span class="istie" :class="isdays==30?'grcolor':''" @click="handlerTypeTime(30)">本月</span>
			      		<el-date-picker
			      			 style="line-height: 50px;"
			      			size="small"
				          v-model="downOrderTime"
				          type="daterange"
				          range-separator="-"
				          start-placeholder="开始日期"
				          end-placeholder="结束日期"
				          value-format="yyyy-MM-dd"
				        ></el-date-picker>
				        <el-select v-model="value1" size="small"  style="line-height: 50px;">
				          <el-option label="数量" value="1"></el-option>
				          <el-option label="金额" value="2"></el-option>
				        </el-select>
			      	</div>
			        <echarts :chart-data="lineChartData" :type="value1"/>
			      </el-col>
	    		</el-row>
    		</div>
    </el-row>
  </div>
</template>
<script>
		import CommonHeader from './components/CommonHeader'
  import HeaderTop from '../common/HeaderTop'
  import Qs from 'qs'
  import { login, getInfo,wang } from '@/api/login'
  import PanelGroup from './components/PanelGroup'
  import PendingDisposal from './components/PendingDisposal'
  import ShortcutEntry from './components/ShortcutEntry'
  import PushMessage from './components/PushMessage'
  import TopList from './components/TopList'
  import Echarts from './components/Echarts'
			import {
		organizationTop,
		projectTop,
		statisticsData
	} from '@/api/order/orderStatistics'
  export default {
    name: "home",
    components:{
      HeaderTop,
      PanelGroup,
      PendingDisposal,
      ShortcutEntry,
      PushMessage,
      TopList,
      Echarts,
      CommonHeader
    },
    data(){
      return {
      	organizationData:[],
      	projectData:[],
      	value1:'1',
      	downOrderTime:null,
      	isdays:7,
      	startTime:'',
      	endTime:'',
      	linedata:[
      		
      	],
      	lineChartData: [],
        labelPosition: 'right',
        formLabelAlign: {
          username: 'huangxiaohui2',
          grant_type: 'password',
          password: '1'
        },
        input1:'',
        input2:'',
        input3:'',
        tableData: [],
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4
      }
    },
    created(){
	  	this.getTopData()
	  	this.getstatisticsData()
	  },
	  watch:{
	  	downOrderTime(a,b){
	  		if(a){
	  			this.startTime=a[0]
	  			this.endTime=a[1]
	  			this.isdays=0
	  			this.getstatisticsData()
	  		}else{
	  			this.startTime=''
	  			this.endTime=''
	  		}
	  	}
	  },
    methods: {
	    getTopData(){
	    	organizationTop().then(res=>{
	    		this.organizationData=res.data
	    	})
	    	projectTop().then(res=>{
	    		this.projectData=res.data
	    	})
	    },
	    getstatisticsData(){
	    	let a={
	    		  "days": this.isdays,
					  "endTime": this.endTime,
					  "startTime": this.startTime
	    	}
	    	statisticsData(a).then(res=>{
	    		this.lineChartData=res.data
	    	})
	    },
	    handlerTypeTime(num){
	    	if(this.isdays!=num){
	    		this.isdays=num
	    		this.getstatisticsData()
	    	}
	    },
    	handleSetLineChartData(type) {
//	      this.lineChartData = lineChartData[type]
    	},
    	go(){

    	},
    	wang(){
    		
    	},
    	gone(token){
				
    	},
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    }
  }
</script>
<style scoped lang="less">
  .containerBox{
    width: 100%;
    .istie{
    	cursor: pointer;
    }
    .grcolor{
    	color:#5cadad ;
    }
  }
</style>
