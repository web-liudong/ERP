<template>
  <el-dialog title="驳回" :visible.sync="isShow" width="750px">
    <el-form :model="query" :rules="rules" ref="query">
      <el-form-item label="驳回原因：" label-width="160px" prop="rejectReason">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="1~200字以内"
          v-model="query.rejectReason"
          style="width:400px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('query')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {rejectApprovalList} from '@/api/purchase/purchaseBillList';
export default {
  props: {},
  data() {
    return {
      isShow: false,
      query: {
        rejectReason: "",
      },
      purchaseBillId:null,
      rules: {
        rejectReason: [
          {
            required: true,
            message: "请填写驳回原因",
            trigger: "blur"
          }
        ],
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.purchaseBillId = row;
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          rejectApprovalList(this.purchaseBillId,this.query).then(res=>{
             if(res.code=='000000'){
               this.$message({
                 message:'驳回成功',
                 type:'success'
               })
               this.isShow=false;
               this.$emit('callback')
             }
          })
         
          // this.$emit("callback");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
