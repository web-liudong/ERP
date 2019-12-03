<template>
  <el-dialog title="备注" :visible.sync="isShow" width="600px">
    <el-row :gutter="10">
      <el-col :span="4" style="text-align:right;">
        <i>*</i>商品：
      </el-col>
      <el-col :span="18">{{orderInfo.skuName}}</el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>备注：
            </el-col>
            <el-col :span="18">
              <el-form-item prop="description">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  rows="5"
                  :disabled="!type"
                  placeholder="字数长度100以内"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="type" @click="isShow = false">取 消</el-button>
      <el-button v-if="type" type="primary" @click="submitForm('orderForm')">确 定</el-button>
      <el-button v-else type="primary" @click="isShow = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createRemarks } from "@/api/order/orderManage";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      orderInfo: {},
      type:1,
      form:{
        description:""
      }
    };
  },
  mounted() {},
  methods: {
    init(obj) {
      this.form.description = obj.info.itemMemo;
      this.orderInfo = obj.info;
      this.type = obj.type;
      this.isShow = true;
    },
    submitForm(name) {
      if (this.form.description == "") {
        this.$message({
          type: "warning",
          message: "请填写备注详情!"
        });
        return false;
      }
      if (this.form.description.length > 100) {
        this.$message({
          type: "warning",
          message: "字数长度100以内"
        });
        return false;
      }
      this.isShow = false;
      this.$emit("callback", this.form.description);
    }
  }
};
</script>
<style scoped lang="less">
.tips {
  color: red;
  padding-left: 20px;
}
.list {
  table {
    width: 95%;
    margin: 20px auto;
    td,
    th {
      border: 1px solid #d1d1d1;
      font-size: 12px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    th {
      padding-right: 6px;
      box-sizing: border-box;
      color: #666;
      font-weight: 700;
      font-size: 14px;
      text-align: right;
      width: 15%;
      background-color: #f9fafc;
      i {
        color: red;
      }
    }
    td {
      color: #666666;
      text-align: left;
      padding-left: 10px;
      width: 17%;
      line-height: 20px;
      &:last-child {
        width: 21%;
      }
      span {
        margin-right: 10px;
        display: inline-block;
      }
    }
    .tit {
      text-align: left;
      padding-left: 10px;
    }
  }
}
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-textarea {
  width: 445px;
}
</style>