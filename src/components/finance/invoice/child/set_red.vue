<template>
  <el-dialog title="红冲提示" :visible.sync="isShow" width="600px">
    <el-row>
      <el-col>
        <p class="tips">红冲后此记录失效，关联的相关订单可重新申请发票</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form :model="form" ref="invoiceForm" :rules="rules" label-width="120px">
          <el-form-item label="红冲发票号码" prop="redWordInvoiceNumber" required>
            <el-input type="number" v-model="form.redWordInvoiceNumber" placeholder="请填写发票号码"></el-input>
          </el-form-item>
          <el-form-item label="红冲发票代码" prop="redWordInvoiceCode" required>
            <el-input type="number" v-model="form.redWordInvoiceCode" placeholder="请填写发票代码"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="checkForm('invoiceForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { setInvoiceRedWord } from "@/api/payment/invoice";
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
      form: {
        redWordInvoiceCode: "",
        redWordInvoiceNumber: ""
      },
      rules: {
        redWordInvoiceNumber: [
          { validator: check, trigger: "blur", message: "发票号码不能为空" }
        ],
        redWordInvoiceCode: [
          { validator: check, trigger: "blur", message: "发票代码不能为空" }
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
      setInvoiceRedWord(this.resData.id, this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "setRed");
      });
    },
    reset(){
      this.form = {
        redWordInvoiceCode: "",
        redWordInvoiceNumber: ""
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