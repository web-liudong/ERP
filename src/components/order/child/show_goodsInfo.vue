<template>
  <el-dialog title="备注" :visible.sync="isShow">
        <el-form :model="row"  class="demo-ruleForm">
          <el-form-item label="商品：" :label-width="formLabelWidth" prop="skuName">
            <!-- <el-input v-model="SkuInvoiceDTO.skuName" autocomplete="off" readonly></el-input> -->
            <span slot="label"><i style="color:red">*</i>商品：</span>
            <span>{{row.skuName}}({{row.unit}})</span>
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth" prop="itemMemo">
            <el-input v-model="row.itemMemo" autocomplete="off" type="textarea" rows="5"></el-input>
          </el-form-item>     
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="isShow = false">取 消</el-button> -->
          <el-button type="primary" @click="isShow=false">确 定</el-button>
        </div>
      </el-dialog>
</template>
<script>
export default {
  props: {
     
  },
  data() {
    return {
      isShow: false,
      des:'',
      row:{skuName:'',itemMemo:'',unit:''},
      formLabelWidth:'120px'
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.row=row;
    },
  }
};
</script>
<style scoped lang="less">

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
