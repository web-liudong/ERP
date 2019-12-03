<template>
  <el-dialog title="编辑" :visible.sync="isShow">
    <el-form
      :model="form"
      ref="dialogform"
      :rules="rules"
      label-position="left"
      label-width="140px"
    >
      <el-form-item label="导航设置">
        <el-radio-group v-model="form.shoppeNavigationType">
          <el-radio label="CATEGORY">使用商品本身分类</el-radio>
          <el-radio label="NAVIGATION">使用自建导航</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('dialogform')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { editNavType } from "@/api/release/specialProjectManage";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请填写库存限制"));
      }
      callback();
    };
    return {
      id:'',
      isShow: false,
      form: {
        shoppeNavigationType: ""
      },
      rules: {
        downlimit: [{ validator: check, trigger: "blur" }],
        uplimit: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.id = row.projectId;
      this.form.shoppeNavigationType = row.navigationType == 0 ? "CATEGORY" : "NAVIGATION"

      this.isShow = true;
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          editNavType(this.id, this.form).then(res => {
            this.isShow = false;
            this.$emit("callback");
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
.el-row {
  line-height: 30px;
  font-size: 14px;
}
</style>