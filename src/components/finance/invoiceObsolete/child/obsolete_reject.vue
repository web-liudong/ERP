<template>
  <el-dialog title="驳回作废申请" :visible.sync="isShow" width="40%">
    <span class="title">驳回后，申请方可修改内容再次提交作废申请</span>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="驳回原因" prop="rejectReason" label-width="100px" style="margin-top: 20px">
        <el-input
          v-model="form.rejectReason"
          placeholder="字数长度1~200以内"
          type="textarea"
          maxlength="200"
          :rows="3"
          width="20px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { putPurchaseReject } from "@/api/finance/invoiceObsolete";
export default {
  name: "obsolete_reject",
  data() {
    return {
      isShow: false,
      rules: {
        rejectReason: { required: true, message: "请输入驳回原因", trigger: "blur" }
      },
      form: { rejectReason: '' }
    };
  },
  methods: {
    init(row) {
      this.isShow = true;
      this.form.id = row.id;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          putPurchaseReject(this.form.id, this.form).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$refs[formName].resetFields();
              this.isShow = false;
               this.$parent.dialogCallback();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // this.isShow = false;
      this.$emit("callback", "reject");
    }
  }
};
</script>
<style lang='less' scoped>
.title {
  width: 100%;
  font-size: 18px;
  margin-left: 30px;
}
</style>