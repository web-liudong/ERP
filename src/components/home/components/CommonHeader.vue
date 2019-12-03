<template>
  <!--分类头部-->
  <div class="add-head">
    <i class="iconfont  myicon" :class="iconClass"></i>
    <p class="add-class-text">{{headname}}</p>
    <div class="langSolt">
    	<slot name="append">
    	
    	</slot>
    </div>
  </div>
</template>

<script>
  export default {
    name:'addhead',
    data() {
      return {

      };
//    icon-jinqi
    },
    props: ['headname','iconClass']
  }
</script>
<style scoped lang="less">
  .myicon{
    font-size: 21px;
    margin-top: 3px;
    float: left;
    margin-right: 5px;
    line-height: 35px;
  }
  .add-head{
    width: 100%;
    height: 40px;
    background-color:#f3f3f3;
    padding-left: 15px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .add-class-text{
  	float: left;
    color:#666;
    font: bold 15px/40px '微软雅黑';
  }
  .langSolt{
  	line-height: 40px;
  	float: right;
  	padding-right: 15px;
  	&:hover{
  		color: #40c9c6;
  		cursor: pointer;
  	}
  }
</style>
