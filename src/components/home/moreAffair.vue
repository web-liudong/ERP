<template>
<div class="aBox">
  <common-header :headname="'待处理事务'" :iconClass="'icon-jinqi'">
</common-header>
   <div class="pending_disposal_content">
    	<div class="clearfix">
    		<div v-for="(item,index) in data" :class="index%2==0?'float_l':'float_r'"  style="width: 45%;">
    			<div class="clearfix">
    				<div class="float_ll font" @click="go(item)">
    					{{item.name}}
    				</div>
    				<div class="float_rr font">
    					({{item.count}})
    				</div>
    			</div>
    		</div>
    	</div>
    </div>
</div>

</template>

<script>
	import {
		pendingTask
	} from '@/api/order/orderStatistics'
  import CommonHeader from './components/CommonHeader'
  export default {
	name:"moreAffair",
    data() {
      return {
        data:[
        ]
      };
    },
    components:{
      CommonHeader,
    },
    created(){
    	pendingTask().then(res=>{
    		this.data=res.data
    	})
    },
    methods:{
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

<style lang="less" scoped>
.aBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .pending_disposal_content{
  		box-sizing: border-box;
  		padding: 15px;
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
