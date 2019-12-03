<template>
  <el-dialog title="驳回" :visible.sync="isShow">
    <el-form
      :model="reviewRejectOrderServiceFeeParam"
      :rules="rules"
      ref="reviewRejectOrderServiceFeeParam"
    >
      <el-form-item label="驳回原因：" label-width="160px" prop="reason">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="1~200字以内"
          v-model="reviewRejectOrderServiceFeeParam.reason"
          style="width:400px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('reviewRejectOrderServiceFeeParam')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { RateAuditeNoPass } from "@/api/ordernodraft";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      reviewRejectOrderServiceFeeParam: {
        orderServiceFeeChangeId: "",
        reason: ""
      },
      rules: {
        reason: [
          {
            required: true,
            message: "请选择驳回原因",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.reviewRejectOrderServiceFeeParam.orderServiceFeeChangeId =
        row.orderServiceFeeRateChangeId;
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          RateAuditeNoPass(this.reviewRejectOrderServiceFeeParam).then(res => {
            if (res.success == false) {
              this.$confirm(res.message, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              })
                .then(res => {
                this.$emit("callback");                  
                })
                .catch(() => {});
              this.isShow = false;
            } else {
              this.$message({
                message: "驳回成功",
                type: "success"
              });
              this.isShow = false;
              this.$emit("callback");
            }
          });
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
