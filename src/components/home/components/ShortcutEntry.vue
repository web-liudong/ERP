<template>
  <!--分类头部-->
  <div class="pending_disposal">
    <common-header :headname="'快捷入口'" :iconClass="'iconkuaijierukou'"></common-header>
    <div class="pending_disposal_content clearfix">
    	
    	<!--<i class="icon iconfont icon-activity" style="font-size: 48px;line-height: 48px;"></i>-->
    	<div class="float_l" v-for="item in iconData" @click="routerGo(item)" v-if="$authorities[item.auth]">
    		<div class="iconBox" style="text-align: center;">
    			<div class="iconBoxContent" style="display: inline-block; padding: 5px;">
    				<i class="icon iconfont" :class="item.iconclass" style="font-size: 48px;line-height: 48px;"></i>
    			</div>
    		</div>
    		<div class="textBox" style="text-align: center;white-space: nowrap">
    			{{item.name}}
    		</div>
    	</div>
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
    data() {
      return {
				iconData:[{
					iconclass:'icontianjiashangpin',
					path:'/goods/addgoods/addGoods',
					name:'添加商品',
					auth:'AddGoods'
				},
				{
					iconclass:'icondingdanguanli',
					path:'/order/orderManage',
					name:'订单管理',
					auth:'OrderManage'
				},
				{
					iconclass:'iconfapiaoshenqing',
					path:'/finance/invoiceapply/invoiceapply',
					name:'发票申请',
					auth:'InvoiceApplyManage'
				},
				{
					iconclass:'iconzhuanguixiangmu',
					path:'/release/specialcountermanage/specialcountermanage',
					name:'专柜项目',
					auth:'ReleaseShoppeManage'
				},
				{
					iconclass:'iconshangchengxiangmu',
					path:'/release/releasemallmanage/releasemallmanage',
					name:'商城项目',
					auth:'ShoppingMallManage'
				},
				{
					iconclass:'iconshangpinxinxi',
					path:'/goods/goodsmanage/goodsManage',
					name:'商品管理',
					auth:'GoodsHome'
				},
				{
					iconclass:'iconxiaoshouxiadan',
					path:'/order/saleDown',
					name:'销售下单',
					auth:'saleDown'
				},
				{
					iconclass:'iconjiesuandan',
					path:'/payment/customerStatementList',
					name:'结算单',
					auth:'PaymentManageList'
				},
				{
					iconclass:'iconwodekaipiaoshenqing',
					path:'/payment/invoiceapplication/invoiceapplication',
					name:'我的开票申请',
					auth:'invoiceApplication'
				},
				
				],
      };
    },
    methods:{
    	routerGo(item){
    		this.$router.push(item.path)
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
  		padding: 15px;
  		height:230px;
  		.float_l{
  			padding: 10px 20px ;
  			float: left;
  			width: 80px;
  			height: 80px;
  			display: flex;
  			flex-direction: column;
  			i{
  				color: #40c9c6;
  			}
  			.textBox{
  				padding-top: 5px;
  			}
  			&:hover{
  				cursor: pointer;
  				.iconBoxContent{
  					background-color: #40c9c6;
  					i{
  						color: #FFFFFF;
  					}
  				}
  				.textBox{
  					color: #40c9c6;
  				}
  			}
  			.iconBoxContent{
  				transition: all 0.38s ease-out;
     			border-radius: 6px;
  			}	
  			
  			
  		}
  	}
  }
</style>
