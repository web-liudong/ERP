<template>
<div class="cancelDataBox">
  <el-dialog title="取消提示" :visible.sync="isShow" width="30%" class="infoBox">
      <div class="contentBox">取消后，内容将不会保存，确认操作？</div>
      <!-- <div style="margin-top:10px;">商品ID：<span style="color:#339999">{{des}}</span></div>  -->
     <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isShow=false">取 消</el-button>
      <el-button type="primary" @click="toCreatePurchaseDemand(type)">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  inject:['close'],
  props: {
      
  },
  data() {
    return {
      isShow: false,
      des:"",
      type:''
    };
  },
  mounted() {
  },

  methods: {
    init(row) {
      console.log(row,55555)
      this.isShow = true;
      this.type=row;
    },
    toCreatePurchaseDemand(type){
      console.log('iiiiii',type);
      if(type=='PurchaseCreateBillList'){
        this.isShow = false;
        this.$emit('close')
      }else if(type=='PurchaseManage'){
        this.isShow = false;
        this.$emit('close')
      }else{
        console.log('99');
        this.isShow=false;
        this.close({name:'CreatePurchaseDemand',to:{name:"PurchaseDemand",params:{isUpdate:true}}});
      }
    }
  }
};
</script>
<style  lang="less" scoped>

.cancelDataBox{
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
