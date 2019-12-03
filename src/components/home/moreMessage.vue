<template>
<div class="aBox">
  <common-header :headname="'公告信息'" :iconClass="'icon-jinqi'">
</common-header>
  <div class="content">
  	<div class="content_item clearfix" v-for="item in textData">
  		<div class="item_title" :class="item.read==0?'true':'false'">
  			
  		</div>
  		<div class="item_text">
  			<span  @click="goDetail(item)">{{item.title}}</span>
  		</div>
  		<div class="item_time">
  			{{item.createTime}}
  		</div>
  	</div>
  	  <el-pagination
        	style="text-align: right;padding: 20px 10px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="11"
          layout="total, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
  </div>
        
</div>

</template>

<script>
  import CommonHeader from './components/CommonHeader'
  		import {
		pushList
	} from '@/api/noticeService/noticeService'
  export default {
	name:"moreMessage",
    data() {
      return {
        editorOption:{},
      	dialogVisibleclose:false,
        comindex:0,
        treeData:[],
        visible:false,
        currentPage:1,
        textData:[],
        pagetotal:'',
      };
    },
    components:{
      CommonHeader,
    },
    created(){
      this.getData()
    },
    watch:{
    },
    mounted(){
    	
    },
    methods:{

    	getData(){
    		let data={
				  "pageNum": this.currentPage,
				  "pageSize": 10,
				}
    		pushList(data).then(res=>{
    			this.textData=res.data.items
    			this.pagetotal=res.data.total
    		})    		
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
    	handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage=val
        this.getData()
      },
    }
  }
</script>

<style lang="less" scoped>
.aBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
    .content{
    	padding-top: 20px;
    	.content_item{
    		position: relative;
    		box-sizing: border-box;
    		padding: 0px 30px 0 20px ;
    		margin: 0 15px 0 80px;
    		border-bottom: 1px solid #e4e4e4;
    		.item_title{
    			position: absolute;
    			top: 50%;
    			left: -25px;
    			width: 8px;
    			height: 8px;
    			margin-top: -4px;
    			border-radius: 50%;
    		}
    		.true{
    			background: #40c9c6;
    		}
    		.false{
    			background: rgba(0,0,0,0.3);
    		}
    		.item_text{
    			line-height: 40px;
    			float: left;
    			width: 70%;
	  			overflow:hidden;
			    text-overflow:ellipsis;
			    white-space:nowrap;
			    span{
			    	&:hover{
			    	cursor: pointer;
			    	color: #40c9c6;
			    	}
			    }
    		}
    		.item_time{
    			line-height: 40px;
    			float: right;
    		}
    	}
    }

}
</style>
