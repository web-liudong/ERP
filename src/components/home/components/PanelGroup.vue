<template>
	<div class="indexTopTitle">
		
	<common-header :headname="'销售数据'" :iconClass="'iconshujuliebiao'">
		
    	<div slot="append" @click="handleTips()">
    		<el-popover
			  placement="bottom-end"
			  width="400"
			  trigger="click">
			  <p> <span style="font-weight: 600;">• 今日订单数：</span> 登录用户所属组织机构作为项目乙方接受的客户下单数量（服务方已经接受之后的订单）与作为服务方接受分派的订单数量的总和（已取消的不记）（页面刷新时，数据更新）；</p>
			  <p> <span style="font-weight: 600;">• 近七天订单总数：</span> 登录用户所属组织机构作为项目乙方接受的客户下单数量（服务方已经接受之后的订单）与作为服务方接受分派的订单数量的总和（已取消的不记）（数据更新时间当天00：00）；</p>
			  <p> <span style="font-weight: 600;">• 今日销售额数：</span> 登录用户所属组织机构作为项目乙方接受的客户下单总金额（服务方已经接受之后的订单）与作为服务方接受分派的订单总金额的总和（已取消的不记）（页面刷新时，数据更新）；</p>
			  <p> <span style="font-weight: 600;">• 近七天销售总额：</span> 登录用户所属组织机构作为项目乙方接受的客户下单总金额（服务方已经接受之后的订单）与作为服务方接受分派的订单总金额的总和（已取消的不记）（数据更新时间当天00：00）；</p>
			  <p>• 按照订单来源：官网、专柜、商城、后台分别统计以上数据。</p>
			  <p>• 当项目乙方等于服务方时，订单只记一次</p>
			  <i class="iconfont icondingdanxuqiu" slot="reference"></i>
			</el-popover>
    	</div>
  </common-header>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="clearfix">
        	<div class="card-panel-icon-wrapper icon-people">
	          <i class="icon iconfont iconjinridingdanshu" style="font-size: 40px;line-height: 40px;"></i>
	        </div>
	        <div class="card-panel-description">
	          <div class="card-panel-text">今日订单数</div>
	          <count-to :start-val="0" :end-val="todayData.orderCount" :duration="2600" class="card-panel-num"/>
	        </div>
        </div>
        <div class="class_count">
        	<div class="count_content clearfix">
        		<div class="class_count_l">
	        		<p>官网：<span :title="todayData.orderCountFromWeb">{{todayData.orderCountFromWeb}}</span></p>
	        		<p>商城：<span :title="todayData.orderCountFromMall">{{todayData.orderCountFromMall}}</span></p>
	        		<p>竞价：<span :title="todayData.orderCountFromBidding">{{todayData.orderCountFromBidding}}</span></p>
	        	</div>
	        	<div class="class_count_r">
	        		<p>专柜：<span :title="todayData.orderCountFromShoppe">{{todayData.orderCountFromShoppe}}</span></p>
	        		<p>后台：<span :title="todayData.orderCountFromERP">{{todayData.orderCountFromERP}}</span></p>
	        	</div>
        	</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="clearfix">
        	<div class="card-panel-icon-wrapper icon-people">
	          <i class="icon iconfont icondingdanzongshu" style="font-size: 40px;line-height: 40px;"></i>
	        </div>
	        <div class="card-panel-description">
	          <div class="card-panel-text">近7天订单总数</div>
	          <count-to :start-val="0" :end-val="weekData.orderCount" :duration="2600" class="card-panel-num"/>
	        </div>
        </div>
        <div class="class_count">
        	<div class="count_content clearfix">
        		<div class="class_count_l">
	        		<p>官网：<span :title="weekData.orderCountFromWeb">{{weekData.orderCountFromWeb}}</span></p>
	        		<p>商城：<span :title="weekData.orderCountFromMall">{{weekData.orderCountFromMall}}</span></p>
	        		<p>竞价：<span :title="weekData.orderCountFromBidding">{{weekData.orderCountFromBidding}}</span></p>
	        	</div>
	        	<div class="class_count_r">
	        		<p>专柜：<span :title="weekData.orderCountFromShoppe">{{weekData.orderCountFromShoppe}}</span></p>
	        		<p>后台：<span :title="weekData.orderCountFromERP">{{weekData.orderCountFromERP}}</span></p>
	        	</div>
        	</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="clearfix">
        	<div class="card-panel-icon-wrapper icon-people">
	          <i class="icon iconfont iconjinrixiaoshoue" style="font-size: 40px;line-height: 40px;"></i>
	        </div>
	        <div class="card-panel-description">
	          <div class="card-panel-text">今日销售额(元)</div>
	          <count-to :start-val="0" :end-val="todayData.orderAmount" :decimals="2" :duration="2600" class="card-panel-num"/>
	        </div>
        </div>
        <div class="class_count">
        	<div class="count_content clearfix">
        		<div class="class_count_l">
	        		<p>官网：<span :title="todayData.orderAmountFromWeb">￥ {{todayData.orderAmountFromWeb}}</span></p>
	        		<p>商城：<span :title="todayData.orderAmountFromMall">￥ {{todayData.orderAmountFromMall}}</span></p>
	        		<p>竞价：<span :title="todayData.orderAmountFromBidding">￥ {{todayData.orderAmountFromBidding}}</span></p>
	        	</div>
	        	<div class="class_count_r">
	        		<p>专柜：<span :title="todayData.orderAmountFromShoppe">￥ {{todayData.orderAmountFromShoppe}}</span></p>
	        		<p>后台：<span :title="todayData.orderAmountFromERP">￥ {{todayData.orderAmountFromERP}}</span></p>
	        	</div>
        	</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="clearfix">
        	<div class="card-panel-icon-wrapper icon-people">
	          <i class="icon iconfont iconjintianxiaoshoue" style="font-size: 40px;line-height: 40px;"></i>
	        </div>
	        <div class="card-panel-description">
	          <div class="card-panel-text">近7天销售额(元)</div>
	          <count-to :start-val="0" :end-val="weekData.orderAmount" :decimals="2" :duration="2600" class="card-panel-num"/>
	        </div>
        </div>
        <div class="class_count">
        	<div class="count_content clearfix">
        		<div class="class_count_l">
	        		<p>官网：<span :title="weekData.orderAmountFromWeb">￥ {{weekData.orderAmountFromWeb}}</span></p>
	        		<p>商城：<span :title="weekData.orderAmountFromMall">￥ {{weekData.orderAmountFromMall}}</span></p>
	        		<p>竞价：<span :title="weekData.orderAmountFromBidding">￥ {{weekData.orderAmountFromBidding}}</span></p>
	        	</div>
	        	<div class="class_count_r">
	        		<p>专柜：<span :title="weekData.orderAmountFromShoppe">￥ {{weekData.orderAmountFromShoppe}}</span></p>
	        		<p>后台：<span :title="weekData.orderAmountFromERP">￥ {{weekData.orderAmountFromERP}}</span></p>
	        	</div>
        	</div>
        </div>
      </div>
    </el-col>
  </el-row>
	</div>
</template>

<script>
import CountTo from 'vue-count-to'
import CommonHeader from './CommonHeader'
		import {
		todayOrders,
		weekOrders
	} from '@/api/order/orderStatistics'
export default {
  components: {
    CountTo,
    CommonHeader
  },
  created(){
  	this.gettodayData()
  	this.getweekData()
  },
  data(){
    return {
    	todayData:{
    		"orderAmount": 0,///订单总额
			  "orderAmountFromERP": 0,//后台订单总额
			  "orderAmountFromMall": 0,//商城订单总额
			  "orderAmountFromShoppe": 0,//专柜订单总额
			  "orderAmountFromWeb": 0,//网站订单总额
			  "orderCount": 0,//订单数
			  "orderCountFromERP": 0,//商城订单数
			  "orderCountFromMall": 0,//商城订单数
			  "orderCountFromShoppe": 0,//专柜订单数
			  "orderCountFromWeb": 0//网站订单数
    	},
    	weekData:{
    		
    	},
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    gettodayData(){
    	todayOrders().then(res=>{
    		this.todayData=res.data
    	})
    },
    getweekData(){
    	weekOrders().then(res=>{
    		this.weekData=res.data
    	})
    },
    handleTips(){
    	
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.indexTopTitle{
	background-color: #FFFFFF;
	height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.07);
  margin-bottom: 20px;
  margin-top: 10px;
.panel-group {
  margin-top: 18px;
  margin-right:0px!important;
  margin-left:0px!important;
  .card-panel-col{
    margin-bottom: 18px;
  }
  .card-panel {
  	border: 1px solid;
    /*height: 108px;*/
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .07);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 10px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 15px;
      margin-left: 0px;
      text-align: right;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
    .class_count{
    	box-sizing: border-box;
    	padding: 0px 16px 16px 16px;
    	.count_content{
    		border-top: 1px solid rgba(0, 0, 0, .05);
    		padding-top: 16px;
    		.class_count_l{
    			float: left;
    			max-width: 50%;
    			p{
    				font-size: 15px;
    				line-height: 24px;
    				white-space: nowrap;
    				overflow: hidden;
    				text-overflow: ellipsis;
    				span{
    					color: #F04844;
    				}
    			}
    		}
    		.class_count_r{
    			float: right;
    			max-width: 50%;
    			p{
    				font-size: 15px;
    				line-height: 24px;
    				white-space: nowrap;
    				overflow: hidden;
    				text-overflow: ellipsis;
    				span{
    					color: #F04844;
    					
    				}
    			}
    		}
    	}
    }
  }
}
}
</style>
