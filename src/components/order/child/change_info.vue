<template>
  <el-dialog :title="title" :visible.sync="isShow" width="30%">
     <div>{{des}}</div> 
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="queryData">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {auditerNoPass} from '@/api/ordernodraft';
export default {
  props: {
      title:{
          type:String,
          default:'变更提示'
      },
      des:{
          type:String,
          default:'当前订单状态已发生变化，请刷新数据获取最新状态。'
      }
  },
  data() {
    return {
      isShow: false,
    };
  },

  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.des=row;
    },
    queryData(){
      this.isShow=false;
      this.$emit('callback')
    }
  }
};
</script>
<style scoped lang="less">
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-autocomplete {
  width: 100%;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
.dialogWrap >>> .el-dialog__body {
  height: 50vh;
  overflow: auto;
}
</style>
