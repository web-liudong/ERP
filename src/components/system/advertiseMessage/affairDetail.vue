<template>
<div class="aBox">
  <common-header :headname="'公告信息'" :iconClass="'icon-jinqi'">
</common-header>
  <h1>{{title}}</h1>
  <div class="content" v-html="content">
  	热烈欢迎2019年4月8日-4月12日新入职的5位同事和15位实习生加入领先未来科技集团有限公司，成为领先未来的一员
。希望大家在以后的工作中互相关照，互相帮助，给予支持，助其早日熟悉新的工作环境，尽快融入领先未来这个大家
庭，同时预祝他们在领先未来工作愉快!
  </div>
  <div class="time">
  	{{time}}
  </div>
</div>

</template>

<script>
		import {
		noticeDetail
	} from '@/api/noticeService/noticeService'
  import CommonHeader from '@/components/home/components/CommonHeader'
  export default {
  	name:'affairDetail',
  	inject:['close'],
    data() {
      return {
      	content:'',
      	title:'',
      	time:'',
        editorOption:{},
      	dialogVisibleclose:false,
        comindex:0,
        treeData:[],
        visible:false,
        detailId:''
      };
    },
    components:{
      CommonHeader,
    },
    created(){
    	this.detailId=this.$route.query.detailId
      noticeDetail(this.$route.query.detailId).then(res=>{
      	this.content=res.data.content
      	this.title=res.data.title
      	this.time=res.data.updateTime
      })
    },
    activated(){
    		if(this.$route.query.detailId!=this.detailId){
    			noticeDetail(this.$route.query.detailId).then(res=>{
		      	this.content=res.data.content
		      	this.title=res.data.title
		      	this.time=res.data.updateTime
		      })
    		}
    },
    watch:{
    },
    mounted(){
    	
    }
  }
</script>

<style lang="less" scoped>
.aBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  h1{
  	font-size: 30px;
  	font-weight: 900;
  	text-align: center;
  	line-height: 30px;
  	padding-top: 40px;
  	padding-bottom: 40px;
  }
 .content{
 	box-sizing: border-box;
 	padding: 0px 100px 40px 100px;
 }
	.time{
		padding: 100px 60px 100px 0;
		text-align: right;
	}
}
</style>
