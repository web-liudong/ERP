<template>
  <el-dialog title="邮寄弹窗" :visible.sync="isShow" width="30%">
    <el-row>
      <el-form :model="form" :rules="rules" ref="invoiceForm" label-width="100px">
        <el-col :span="12">
          <el-form-item label="物流公司：" prop="expressCompany">
            <el-select v-model="form.expressCompany" placeholder="请填写物流公司" clearable>
              <el-option
                v-for="item in expressOptions"
                :key="item.code"
                :label="item.text"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物流单号：" prop="expressNumber">
            <el-input type="number" v-model="form.expressNumber" placeholder="请填写物流单号"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="checkForm('invoiceForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getLocationExpress } from "@/api/common/commonApi";
import { setInvoicePost } from "@/api/finance/collectionInvoice";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      expressOptions: [],
      form: {
        expressCompany: null,
        expressNumber: null,
        id: null
      },
      rules: {
        expressNumber: [
          {
            validator: check,
            required: true,
            trigger: "blur",
            message: "物流单号不能为空"
          }
        ],
        expressCompany: [
          {
            validator: check,
            required: true,
            trigger: "change",
            message: "物流公司不能为空"
          }
        ]
      }
    };
  },
  methods: {
    init(row) {
      this.isShow = true;
      this.form.id = row.id;
      this.getLocationExpress();
      this.reset();
    },
    reset() {
      this.$refs["invoiceForm"] && this.$refs["invoiceForm"].resetFields();
    },
    //快递公司
    getLocationExpress() {
      getLocationExpress()
        .then(res => {
          this.expressOptions = res.data;
          console.log(this.expressOptions);
        })
        .catch(err => {});
    },
    checkForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.submitForm();
        } else {
          return false;
        }
      });
    },
    submitForm() {
      console.log(this.form,'999');
      setInvoicePost(this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "mailing");
      });
    }
  }
};
</script>
<style scoped lang="less">
</style>