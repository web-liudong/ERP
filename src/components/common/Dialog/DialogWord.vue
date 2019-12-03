<template>
  <div class="dialogBox">
    <span @click="a()">{{buttonTitle}}</span>
    <el-dialog
      :visible.sync="dialogVisible"
      width="25%" center top="40vh" @closed="aa()" show-close>
      <div class="el-dialog-header"><i :class="tubiao" style="font-size: 60px;"></i></div>
      <div style="text-align: center;font-size: 16px;margin-bottom: 20px;margin-top: 25px;">{{content}}</div>
      <span style="text-align: center;font-size: 14px">{{desc}}</span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "DialogWord",
    props:{
      title:{
        type:String,
        default:''
      },
      content:{
        type:String,
        default: '当前导入'
      },
      desc:{
        type:String,
        default: '当前导入成功'
      },
      tubiao:{
        type:String,
        default:'iconfont icon-add'
      },
      buttonTitle:{
        type:String,
        default:'保存到草稿'
      }
    },
    data() {
      return {
        dialogVisible: false,
      };
    },
    methods: {
      a(){
        this.dialogVisible = true;
        let timer=setTimeout(()=>{
          this.dialogVisible=false
        },3000);

      },
      aa(){
        clearTimeout(this.timer);

      }
    }
  }
</script>

<style scoped lang="less">
  .dialogBox{
    .el-dialog{

      .el-dialog__body{
      }
    }


  }

</style>
<style lang="less" scoped>
  .dialogBox{

    .el-dialog{
      .el-dialog__header{
        padding: 0;
      }
      .el-dialog__body{
        text-align: center;
      }
      .el-icon-close{
        color: #f3f3f3;
      }
    }

  }



</style>
