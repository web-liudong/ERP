<template>
  <el-dialog title="设置标签" :visible.sync="isShow">
    <el-form :model="form" ref="salePriceForm" :rules="rules">
      <el-form-item prop="tags">
        <el-input
          v-model="form.tags"
          type="textarea"
          rows="5"
          placeholder="允许输入多个标签，不同标签之间用，分割，限1-99的整数"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="checkForm('salePriceForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { opaGoodsTag } from "@/api/release/specialProjectManage";
export default {
  props: {},
  data() {
    let check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("标签不能为空"));
      } else {
        let arr = value.split(/[,，]/);
        let isNotNum = arr.some(function(num) {
          return !Number.isFinite(+num);
        });
        if (isNotNum) {
          return callback(new Error("标签限1-99的整数"));
        }
        if((new Set(arr)).size != arr.length){
          return callback(new Error("有重复标签"));
        }
        let isExceedLimit = arr.some(function(num) {
          let isInt = !Number.isInteger(+num),
            limit = num < 1 || num > 99;
          return isInt || limit;
        });
        if (isExceedLimit) {
          return callback(new Error("标签限1-99的整数"));
        }
      }
      callback();
    };
    return {
      isShow: false,
      id: "",
      form: {
        tags: ""
      },
      rules: {
        tags: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    init(data) {
      this.id = data.shoppeId;
      this.skuId = data.row.id;
      this.getData();
      this.isShow = true;
    },
    getData() {
      opaGoodsTag(this.id, this.skuId, "get").then(res => {
        this.form.tags = res.data.tags || '';
      });
    },
    checkForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submitForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm(name) {
      this.sortTags();
      opaGoodsTag(this.id, this.skuId, "put", this.form).then(
        res => {
          this.isShow = false;
          this.$emit("callback", "setTag");
        }
      );
    },
    sortTags(){
      var arr = this.form.tags.split(/[,，]/);
      this.form.tags = arr.sort((a,b)=>{return a-b}).join(",");
    }
  }
};
</script>
<style scoped lang="less">
</style>