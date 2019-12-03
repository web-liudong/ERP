<template>
  <!--分类头部-->
  <div class="pending_disposal">
    <common-header :headname="headname" :iconClass="iconClass"></common-header>
    <div class="pending_disposal_content">
    	<div class="clearfix" v-for="(item,index) in data" style="line-height: 50px;border-bottom: 1px solid rgba(0, 0, 0, 0.05);	font-weight: 700;">
    		<div class="serial_number">
    			TOP{{index+1}}
    		</div>
    		<div class="company_name">
    			{{item.organizationName?item.organizationName:item.projectName}}
    		</div>
    		<div class="money_number">
    			{{item.amount}}元
    		</div>
    	</div>
    	<p v-if="data.length==0" style="text-align: center;padding: 20px 0;">暂无数据</p>
    </div>
  </div>
</template>

<script>
	import CommonHeader from './CommonHeader'
  export default {
    name:'pendingdisposal',
    components:{
      CommonHeader,
    },
    props: {
    	headname:{
      	type: String,
      	default: ''
    	},
    	iconClass:{
      	type: String,
      	default: ''
    	},
    	data:{
      	type: Array,
      	default: ''
    	},
    },
    data() {
      return {
					
				
      };
    },
    created(){
	  },
    methods: {
	    handleSetLineChartData(type) {
	      this.$emit('handleSetLineChartData', type)
	    },
	  }
  }
</script>
<style scoped lang="less">
  .pending_disposal{
  	border: 1px solid rgba(0, 0, 0, 0.05);
  	box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.07);
  	.pending_disposal_content{
  		box-sizing: border-box;
  		height: 285px;
  		padding: 15px;
  		font-size:16px;
  		.serial_number{
  			float: left;
  			width: 100px;
  			font-style: oblique;
  			font-size: 14px;
  		}
  		
  		.company_name{
  			float: left;
  		}
  		.money_number{
  			float: right;
  		}
  		.float_l{
  			float: left;
  			border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  			.float_ll{
  				float: left;
  			}
  			.float_rr{
  				float: right;
  			}
  		}
  		.float_r{
  			float: right;
  			border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  			.float_rr{
  				float: right;
  			}
  			.float_ll{
  				float: left;
  			}
  		}
  		.font{
  			line-height: 45px;
  			
  		}
  	}
  	.pending_disposal_content .clearfix:nth-child(1) .serial_number{
  		font-size: 20px;
  		
  		color:rgb(255, 0, 0) ;
  	}
  	.pending_disposal_content .clearfix:nth-child(2) .serial_number{
  		font-size: 16px;
  		
  		color:rgb(153, 255, 0) ;
  	}
  	.pending_disposal_content .clearfix:nth-child(3) .serial_number{
  		font-size: 14px;
  		
  		color:rgb(51, 0, 255);
  	}
  }
</style>
