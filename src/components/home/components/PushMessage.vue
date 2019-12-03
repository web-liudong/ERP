<template>
  <!--分类头部-->
  <div class="push_message">
    <common-header :headname="'推送消息'" :iconClass="'icontuisongxiaoxi'">
    	<div slot="append" @click="more()">更多>></div>
    </common-header>
    <div class="push_message_content clearfix">
    	<div class="clearfix font" v-for="item in textData" @click="goDetail(item)">
    		<div class="float_l">
    			{{item.title}}
    		</div>
    		<div class="float_r">
    			【{{item.createTime}}】
    		</div>
    	</div>
    	<p v-if="textData.length==0" style="text-align: center;padding: 20px 0;">暂无数据</p>
    </div>
    
  </div>
</template>

<script>
		import {
		pushList
	} from '@/api/noticeService/noticeService'
	import CommonHeader from './CommonHeader'
  export default {
    name:'pendingdisposal',
    components:{
      CommonHeader,
    },
    data() {
      return {
				textData:[
					
					
				]
      };
    },
    created(){
    	let data={
				  "pageNum": 1,
				  "pageSize": 10,
				}
    		pushList(data).then(res=>{
    			this.textData=res.data.items
    		})
    },
    methods:{
    	more(){
    		this.$router.push('/homepage/home/moreMessage')
    	},
    	goDetail(row){
      	this.$router.push({
          name: 'messageDetail',
          query:{
          	detailId:row.id,
          	pushId:row.pushId
          }
        })
//    	const { href } = this.$router.resolve({
//        name: 'affairDetail',
//        query:{
//        	detailId:row.id
//        }
//      })
//      window.open(href, '_blank')
      },
    }
  }
</script>
<style scoped lang="less">
  .push_message{
  	height: 100%;
  	border: 1px solid rgba(0, 0, 0, 0.05);
  	box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.07);
  	.push_message_content{
  		box-sizing: border-box;
  		padding: 4px 15px;
  		height: 458px;
  		overflow: hidden;
  		.font{
  			line-height: 44px;
  			&:hover{
  				cursor: pointer;
  				color:#40c9c6 ;
  			}
  		}
  		.float_l{
  			float: left;
  			width: 55%;
  			overflow:hidden;
		    text-overflow:ellipsis;
		    white-space:nowrap
  		}
  		.float_r{
  			float: right;
  		}
  		/*.float_l{
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
  		}*/
  	}
  }
</style>
