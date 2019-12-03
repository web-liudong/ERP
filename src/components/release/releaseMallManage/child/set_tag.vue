<template>
  <el-dialog title="设置标签" :visible.sync="isShow">
    <el-form :model="form" ref="salePriceForm" :rules="rules">
      <el-form-item prop="tags">
        <el-input v-model="form.tags" type="textarea" rows="5" placeholder="允许输入多个标签，不同标签之间用，分割，限1-99的整数"></el-input>
      </el-form-item>
    </el-form>
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
    let check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("标签不能为空"));
      }else{
        let arr = value.split(/[,，]/);
        let isNotNum = arr.some(function(num){
          return !Number.isFinite(+num)
        })
        if(isNotNum){
          return callback(new Error("标签限1-99的整数"));
        }
      }
      callback();
    };
    return {
      isShow: false,
      form: {
        tags:''
      },
      rules: {
        tags: [{ validator: check, trigger: "blur" }]
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
          this.$emit("callback", "tag");
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
</style>