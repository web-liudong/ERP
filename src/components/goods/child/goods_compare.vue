<template>
<div class="compareBox">
  <el-dialog title="提示" :visible.sync="isShow" width="30%" class="infoBox">
      <div class="contentBox">已存在该分类下，同品牌及型号（货号、规格）的商品</div>
      <div style="margin-top:10px;height:100%;word-wrap: break-word; word-break: normal; ">商品编号：<span style="color:#339999">{{des}}</span></div> 
     <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="disCallback">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
      
  },
  data() {
    return {  
      isShow: false,
      des:""
    };
  },
  mounted() {
  },
  methods: {
    init(row) {
      this.isShow = true;
      this.des=row.join(',');
    },
    disCallback(){
      this.isShow=false;
      this.$emit('callback')
    }
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
