<template>
  <el-dialog title="库存设置" :visible.sync="isShow">
    <el-row>
      <el-col>商品：戴尔DELL游匣G3烈焰版 15.6英寸游戏笔记本电脑</el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="salePriceForm" :rules="rules">
            <el-form-item label="设置自动库存" prop="downlimit">
              <el-input v-model="form.downlimit" placeholder="库存下限"></el-input>
            </el-form-item>
            <el-form-item label="-" prop="uplimit">
              <el-input v-model="form.uplimit" placeholder="库存上限"></el-input>
            </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('salePriceForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { passedBrandList } from "@/api/brandManage";
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
      isShow: false,
      form: {
        downlimit: "",
        uplimit: ""
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
      this.isShow = true;
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isShow = false;
          this.$emit("callback",'stock');
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