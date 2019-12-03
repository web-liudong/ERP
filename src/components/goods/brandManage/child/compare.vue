<template>
<div class="compareBox">
  <el-dialog :title="title" :visible.sync="isShow" width="30%" class="infoBox">
      <div class="contentBox">相同的品牌已存在，品牌编号：<span style="color:#339999;">{{des}}</span></div>
      <div style="margin-top:10px;">禁止重复添加</div> 
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isShow=false">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
      title:{
          type:String,
          default:'提示'
      },
  },
  data() {
    return {
      isShow: false,
      des:""
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.des=row
    },
  }
};
</script>
<style  lang="less" scoped>
.compareBox{
.el-dialog{
      .el-dialog__header{
        background-color: #e4e4e4;
        // height: 20px;
        // line-height: 20px;
       .el-dialog__title{
           margin-left:10px;
       }   
      }
      .el-dialog__body{
          text-align: left;
      }
  .contentBox{
      font-size: 16px;
  }
}

}
</style>
