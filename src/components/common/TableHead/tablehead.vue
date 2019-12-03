<template>
  <!--表格头部-->
  <div class="add-head">
    <div>
      <i class="iconfont iconjinridingdanshu"></i>
      <i class="add-class-text">{{headname}}</i>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    props: ['headname']
  }
</script>
<style scoped>
  .add-head{
    width: 100%;
    background-color:#f3f3f3;
    padding:0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }
  .add-class-text{
    font-size: 14px;
    color: #303133;
    line-height: 50px;
  }
</style>
