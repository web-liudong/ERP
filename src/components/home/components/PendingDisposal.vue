<template>
  <!--分类头部-->
  <div class="pending_disposal">
    <common-header :headname="'待处理事务'" :iconClass="'icondaichulishiwu'">
    	<div slot="append" @click="more()">更多>></div>
    </common-header>
    <div class="pending_disposal_content">
    	<div class="clearfix">
    		<div v-for="(item,index) in data" :class="index%2==0?'float_l':'float_r'" v-if="index<6" style="width: 45%;">
    			<div class="clearfix">
    				<div class="float_ll font" @click="go(item)">
    					{{item.name}}
    				</div>
    				<div class="float_rr font">
    					({{item.count}})
    				</div>
    			</div>
    		</div>
    		<p v-if="data.length==0" style="text-align: center;padding: 20px 0;">暂无</p>
    	</div>
    </div>
  </div>
</template>

<script>
	import CommonHeader from './CommonHeader'
	import {
		pendingTask
	} from '@/api/order/orderStatistics'
  export default {
    name:'pendingdisposal',
    components:{
      CommonHeader,
    },
    data() {
      return {
				data:[
//					{
//          "count": 1,
//          "name": "待提审品牌",
//          "url": "/goods/brandmanage/brand",
//          "status": 2
//	        },
//	        {
//	            "count": 1,
//	            "name": "待审核一级分类",
//	            "url": "/goods/classmanage/classify",
//	            "status": 1
//	        }
	        
				],
      };
    },
    created(){
    	pendingTask().then(res=>{
    		this.data=res.data
    	})
    },
    methods:{
    	more(){
    		this.$router.push('/homepage/home/moreAffair')
    	},
    	go(item){
    		this.$router.push({
    			path:item.url,
    			query:{
    				status:item.status
    			}
    		})
    	}
    }
  }
</script>
<style scoped lang="less">
  .pending_disposal{
  	border: 1px solid rgba(0, 0, 0, 0.05);
  	box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.07);
  	.pending_disposal_content{
  		box-sizing: border-box;
  		padding: 15px;
  		height: 168px;
  		.float_l{
  			float: left;
  			border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  			.float_ll{
  				float: left;
  				&:hover{
  					cursor: pointer;
  					color:#339999 ;
  				}
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
  				&:hover{
  					cursor: pointer;
  					color:#339999 ;
  				}
  			}
  		}
  		.font{
  			line-height: 45px;
  			
  		}
  	}
  }
</style>
