<template>
  <div id="app" class="fillcontain" v-loading.fullscreen="loading">
  	<router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
//	import HeaderTop from '@/components/common/HeaderTop'
import { mapGetters } from "vuex";
export default {
  
  provide(){
    return{
      reload:this.reload,
      close:this.close,
      isFilterShow:true,//是否显示筛选查询
      TableMoney:this.formatMoney,
      formatRate:this.formatRate,
      // imgurl:'http://47.94.238.148/image'
      imgurl: location.origin.indexOf("localhost") > -1 ? 'https://lxerptest.66123123.com' : location.origin + '/image'
    }
  },
  name: 'App',
  components:{},
  computed: {
    ...mapGetters(["loading"])
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  created(){
    window.addEventListener("storage",function(e){
      vm.$eventHub.$emit(e.key, 1);
    },false);
  },
  methods:{
    reload(){
      this.isRouterAlive=false;
      this.$nextTick(function () {
        this.isRouterAlive=true;
      })
    },
    //params:String要关闭的route的name
    //params:Object-关闭route的name以及要前往的route对象
    close(params){
      // window.opener=null;
      // window.close();
      this.$eventHub.$emit("TAGS_DELETE_ITEM", params);
    },
    formatMoney(row, column, cellValue, index){
      if(cellValue===0||cellValue){
        return '￥'+cellValue
      }else{
        return '￥0'
      }
    },
    formatRate(row, column, cellValue, index){
      return cellValue*100+'%'
    },
  }
}
</script>

<style lang="less">
  @import './style/common.less';
  @import "./style/mixin.less";
</style>
<style>
.el-loading-mask{
  background-color: rgba(0, 0, 0, 0.1)!important;
}
</style>