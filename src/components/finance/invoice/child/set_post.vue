<template>
  <el-dialog title="邮寄提示" :visible.sync="isShow" width="600px">
    <el-row>
      <el-col :span="18">
        <el-form :model="form" ref="invoiceForm" :rules="rules" label-width="120px">
          <el-form-item label="物流公司" prop="expressCompany" required>
            <el-select
              v-model="form.expressCompany"
              placeholder="请填写物流公司"
              clearable
            >
              <el-option
                v-for="item in remoteList"
                :key="item.code"
                :label="item.text"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号" prop="expressNumber" required>
            <el-input type="number" v-model="form.expressNumber" placeholder="请填写物流单号"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="checkForm('invoiceForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { setInvoicePost, getLocationExpress } from "@/api/payment/invoice";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      resData: {},
      remoteList: null,
      form: {
        expressNumber: "",
        expressCompany: ""
      },
      rules: {
        expressNumber: [
          { validator: check, trigger: "blur", message: "物流单号不能为空" }
        ],
        expressCompany: [
          { validator: check, trigger: "change", message: "物流公司不能为空" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.reset();
      this.resData = row;
      this.isShow = true;
      this.getLocationExpress();
    },
    getLocationExpress() {
      getLocationExpress().then(res => {
        this.remoteList = res.data;
      });
    },
    checkForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.submitForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm() {
      setInvoicePost(this.resData.id, this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "setPost");
      });
    },
    cancelDialog(){
      this.isShow = false;
    },
    reset(){
      this.form = {
        expressNumber: "",
        expressCompany: ""
      }
      this.$refs["invoiceForm"] && this.$refs["invoiceForm"].resetFields();
    }
  }
};
</script>
<style scoped lang="less">
.tips {
  font-size: 16px;
  margin-bottom: 20px;
}
.el-row {
  line-height: 40px;
  font-size: 14px;
}
.el-col {
  padding: 0 10px;
}
</style>