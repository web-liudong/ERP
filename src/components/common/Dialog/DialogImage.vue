<template>
  <el-dialog :visible.sync="isShow"  class="dialog-image-box" top="4vh">
    <el-carousel indicator-position="outside" height="800px" :autoplay="false" :initial-index="carIndex">
          <el-carousel-item v-for="(item,index) in showImgList" :key="index">
            <img width="100%" :src="item" alt />
          </el-carousel-item>
        </el-carousel>
  </el-dialog>
</template>
<script>
import {addURL} from '@/utils/index'
export default {
  data() {
    return {
      isShow: false,
      loading: false,
      showImgList:[],
      carIndex:null
    }
  },
  methods:{
      init(row,index){
          this.carIndex=index;
          this.showImgList=row;
          this.isShow=true;
      }
  },
  
};
</script>
<style scoped lang="less">
</style>
<style lang="less">
 .dialog-image-box{
  .el-dialog{
      margin-top:0vh !important;
    //   img{
    //       width:800px;
    //       height: 600px;
    //   }
  }
 }



</style>
