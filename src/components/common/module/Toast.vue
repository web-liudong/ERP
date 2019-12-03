<template>
  <el-dialog :visible.sync="isShow" :show-close="isShowClose" top="25vh" width="400px" ref="opaDone" class="dialog-box">
    <div class="con">
      <div class="res"><img :src="picSuccess" /></div>
      <h4>{{content}}</h4>
      <p class="desc">{{desc}}</p>
    </div>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";
import { formatString } from "@/utils";
import { setTimeout } from 'timers';
import picSuccess from "@/assets/font/1.png";
export default {
  props: ["duration", "desc", "content"],
  data() {
    return {
      isShow: false,
      isShowClose: false,
      picSuccess:picSuccess,
    };
  },
  props:{
    duration:{
      type:Number,
      default:3000
    },
    desc:{
      type:String,
      default:'当前操作已成功'
    },
    content:{
      type:String,
      default:'操作成功'
    },
  },
  methods: {
    init() {
      this.isShow = true;
      this.close();
    },
    close(){
      setTimeout(() => {
        this.isShow = false;
        this.$emit('callback');
      }, this.duration)
    }
  }
};
</script>
<style scoped lang="less">
.dialog-box {
  .con{
    text-align: center;
    img{
      width: 80px;
    }
    h4 {
      font-size: 20px;
      color: #333;
      margin: 10px;
    }
    .desc {
      font-size: 14px;
    }
  }
}
</style>
<style scoped>
.dialog-box >>> .el-dialog__header{
  background-color: #fff;
}
</style>
