<template>
  <el-dialog title="设置委托收款方" :visible.sync="isShow" width="900px" class="dialogWrap">
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>外部订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
          <th>下单时间：</th>
          <td>{{orderInfo.createTime}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
          <th>客户采购人：</th>
          <td>{{orderInfo.customerUserName}}</td>
        </tr>
        <tr>
          <th>服务方：</th>
          <td>{{orderInfo.firstServerName}}</td>
          <th>服务方开户行：</th>
          <td>{{orderInfo.bank}}</td>
          <th>服务方开户银行编号：</th>
          <td>{{orderInfo.bankNo}}</td>
        </tr>
        <tr>
          <th>服务方开户名：</th>
          <td>{{orderInfo.accountName}}</td>
          <th>服务方开户账号：</th>
          <td colspan="3">{{orderInfo.accountNo}}</td>
        </tr>
      </table>
    </div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>委托收款方：
            </el-col>
            <el-col :span="17">
              <el-form-item prop="payeeName">
                <el-input v-model="form.payeeName" placeholder="委托收款方"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>委托收款方开户行：
            </el-col>
            <el-col :span="17">
              <el-form-item prop="payeeBank">
                <el-input v-model="form.payeeBank" placeholder="委托收款方开户行"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>委托收款方开户行编号：
            </el-col>
            <el-col :span="17">
              <el-form-item prop="payeeBankNo">
                <el-input v-model="form.payeeBankNo" placeholder="委托收款方开户行编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>委托收款方开户名：
            </el-col>
            <el-col :span="17">
              <el-form-item prop="payeeAccountName">
                <el-input v-model="form.payeeAccountName" placeholder="委托收款方开户名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>委托收款方开户账号
            </el-col>
            <el-col :span="17">
              <el-form-item prop="payeeAccountNo">
                <el-input v-model="form.payeeAccountNo" placeholder="委托收款方开户账号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>上传委托协议凭证：
            </el-col>
            <el-col :span="17">
              <el-form-item>
                <el-upload
                  class="upload-demo"
                  action="/api/file-service/file/upload"
                  :headers="headertoken"
                  :on-change="handleChange"
                  :on-error="handleError"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  :data="{type:'Order_Payee'}"
                  name="fileName"
                  :on-remove="handleRemove"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  v-loading="loading"
                >
                  <el-button size="small" type="primary">上传凭证</el-button>
                  <div slot="tip" class="el-upload__tip">支持pdf格式文件，大小不超过2M</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getOrderPayeeInfo,
  setOrderPayeeInfo,
  getbankaccountList
} from "@/api/order/orderManage";
import { debug } from "util";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      loading: false,
      orderInfo: {},
      uploadFile: null,
      form: {
        payeeAccountName: "",
        payeeAccountNo: "",
        payeeAuthorizationFileIds: [],
        payeeBank: "",
        payeeBankNo: "",
        payeeName: "",
        orderId: "",
        status: "" //订单状态
      },
      rules: {
        payeeName: [
          {
            validator: check,
            message: "请填写委托收款方",
            trigger: "blur"
          }
        ],
        payeeBank: [
          {
            validator: check,
            message: "请填写委托收款方开户行",
            trigger: "blur"
          }
        ],
        payeeBankNo: [
          {
            validator: check,
            message: "请填写委托收款方开户行编号",
            trigger: "blur"
          }
        ],
        payeeAccountName: [
          {
            validator: check,
            message: "请填写委托收款方开户名",
            trigger: "blur"
          }
        ],
        payeeAccountNo: [
          {
            validator: check,
            message: "请填写委托收款方开户账号",
            trigger: "blur"
          }
        ]
      },
      fileList: [],
      headertoken: { Authorization: "Bearer " + this.$auth.token }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.reset();
      this.orderInfo = row;
      this.form.orderId = row.id;
      this.form.status = row.status;
      this.initData(row.id);
      this.getbankaccountList();
      this.isShow = true;
    },
    initData(id) {
      getOrderPayeeInfo(id).then(res => {
        if (!res.data) return false;
        Object.assign(this.form, res.data);
        this.form.payeeAuthorizationFileIds = [];
        if(res.data.payeeAuthorizationFileIdsList){
          this.fileList = res.data.payeeAuthorizationFileIdsList;
          this.uploadFile = res.data.payeeAuthorizationFileIdsList[0];
        }
      });
    },
    getbankaccountList() {
      getbankaccountList([this.orderInfo.firstServerId]).then(res => {
        if (res.data && res.data.length){
          let obj = Object.assign({}, this.orderInfo, res.data[0]);
          this.$set(this, 'orderInfo', obj);
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(fileList);
    },
    handleRemove(file, fileList) {
      //删除文件
      this.fileList = fileList;
    },
    handleError(res, file) {
      this.loading = false;
      this.$message.error("文件上传失败");
    },
    handleSuccess(res, file) {
      this.loading = false;
      if (res.code == "000000") {
        this.$message({
          message: "文件上传成功",
          type: "success"
        });
        this.fileList = [];
        this.uploadFile = res.data;
      } else {
        this.$message.error("文件上传失败");
      }
    },
    beforeUpload(file) {
      this.loading = true;
      const fileArr = file.name.split(".");
      const isPDF = fileArr[fileArr.length-1] === "pdf";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message({
          message: "上传图片大小不得超过2M",
          type: "error"
        });
        this.loading = false;
        return false;
      }
      if (!isPDF) {
        this.$message({
          message: "上传文件只能是pdf格式!",
          type: "error"
        });
        this.loading = false;
        return false;
      }
      return isPDF && isLt2M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.uploadFile) {
            return this.$message.warning(`请上传委托协议凭证`);
          }
          this.form.payeeAuthorizationFileIds.push(this.uploadFile.id);
          setOrderPayeeInfo(this.form).then(res => {
            this.isShow = false;
            this.$emit("callback", "setpayee");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reset() {
      this.form = {
        payeeAccountName: "",
        payeeAccountNo: "",
        payeeAuthorizationFileIds: [],
        payeeBank: "",
        payeeBankNo: "",
        payeeName: "",
        orderId: "",
        status: "" //订单状态
      };
      this.$nextTick(() => {
        this.$refs["orderForm"].resetFields();
      });
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
    margin: 0px auto 20px;
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
.dialogWrap >>> .el-upload {
  float: left;
  margin-right: 20px;
}
.dialogWrap >>> .el-upload-list__item {
  transition: none;
}
</style>
