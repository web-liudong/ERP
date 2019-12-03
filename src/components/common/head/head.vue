<template>
  <!--分类头部-->
  <div class="add-head">
    <i class="iconfont icon-jinqi myicon" :class="iconName"></i>
    <p class="add-class-text">{{headname}}</p>
    <slot name="append">
    	
    </slot>
  </div>
</template>

<script>
  export default {
    name:'addhead',
    data() {
      return {

      };
    },
    props: ['headname','iconName']
  }
</script>
<style scoped>
  .myicon{
    font-size: 16px;
  }
  .add-head{
    width: 100%;
    height: 40px;
    background-color:#f3f3f3;
    padding-left: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e4e4e4;
    border-top: 1px solid #e4e4e4;
  }
  .add-class-text{
    color:#666;
    font: bold 15px/40px '微软雅黑';
  }
</style>
