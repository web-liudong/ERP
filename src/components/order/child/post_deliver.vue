<template>
  <el-dialog title="上传送货单" :visible.sync="isShow" width="800px" class="dialogWrap">
    <div class="list" v-if="orderInfo">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>外部订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
          <th>备注订单号：</th>
          <td>{{orderInfo.memoOrderNo}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
          <th>客户采购人：</th>
          <td>{{orderInfo.customerUserName}}</td>
        </tr>
      </table>
    </div>
    <el-row :gutter="10">
      <el-col :span="5" style="text-align:right;">
        <i>*</i>上传送货单：
      </el-col>
      <el-col :span="17">
        <el-upload
          class="upload-demo"
          action="/api/file-service/file/upload"
          :headers="headertoken"
          :on-change="handleChange"
          :on-error="handleError"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :data="{type:'Order_Delivery'}"
          name="fileName"
          :on-remove="handleRemove"
          multiple
          :limit="10"
          :file-list="fileList"
          list-type="picture"
          v-loading="loading"
        >
          <el-button size="small" type="primary">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">支持jpg、png、pdf格式文件，大小不超过2M；按Ctrl可一次选多个文件进行上传</div>
        </el-upload>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getDeliveryPicInfo,
  uploadDeliveryPic
} from "@/api/order/invoiceOrder";
import pdf from "../../../../static/img/pdfico.jpg";
import { parseTime, addURL } from "@/utils/index";

export default {
  props: {},
  data() {
    let check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      loading: false,
      orderInfo: null,
      uploadFile: null,
      fileList: [],
      headertoken: { Authorization: "Bearer " + this.$auth.token }
    };
  },
  components: {},
  mounted() {},
  methods: {
    init(row) {
      this.orderInfo = row;
      this.initData();
      this.isShow = true;
    },
    initData() {
      getDeliveryPicInfo(this.orderInfo.id).then(res => {
        if(res.data && res.data.length){
          let list = []
          res.data.forEach((item,index) => {
            list[index] = {
              name:item.name,
              url:item.name.indexOf('.pdf') > -1 ? pdf : addURL(item.path),
              response : {
                data:item
              }
            }
          })
          this.fileList = list;
        }
      });
    },
    submitForm() {
      debugger;
      if (this.fileList.length == 0) {
        this.$message({
          type: "error",
          message: "请上传上传送货单"
        });
        return false;
      }
      let ids = this.fileList.map(item => {
        return item.response.data.id;
      });
      uploadDeliveryPic(this.orderInfo.id, this.orderInfo.status, {fileIds:ids}).then(
        res => {
          if (res.code == "000000") {
            this.closeDialog();
            //this.$emit("callback", "returnOrder");
            this.$message({
              type: "success",
              message: "上传发货单成功"
            });
          } else {
            this.$message({
              type: "error",
              message: res.message || "上传发货单失败"
            });
          }
        }
      );
    },
    handleChange(file, fileList) {
      if(file.name.indexOf('.pdf') > -1){
        file.url = pdf;
      }
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      //删除文件
      this.fileList = fileList;
    },
    handleError(res, file) {
      this.loading = false;
      this.$message.error("文件上传失败");
    },
    handleExceed(files, fileList) {
      this.$message.error("最多上传10张图片");
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
      debugger;
      this.loading = true;
      const fileArr = file.name.split(".");
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isPDF = fileArr[fileArr.length - 1] === "pdf";
      const isPng = fileArr[fileArr.length - 1] === "png";
      const isJpg = fileArr[fileArr.length - 1] === "jpg";

      if (!isPng && !isJpg && !isPDF) {
        this.$message({
          message: "上传文件只能是 png、jpg、pdf格式!",
          type: "warning"
        });
        this.loading = false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传图片大小不得超过2M",
          type: "error"
        });
        this.loading = false;
      }
      return (isPng || isJpg || isPDF) && isLt2M;
    },
    closeDialog() {
      this.isShow = false;
      this.reset();
    },
    reset() {
      this.form = { deliveryTime: "" };
    }
  }
};
</script>
<style scoped lang="less">
.tips {
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
.quantity {
  display: inline-block;
  width: 50px;
}
.dialog-footer {
  text-align: center;
  padding: 10px 30px;
}
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-table {
  margin: 0 auto;
  width: 95%;
}
.el-form-item,
.el-date-editor {
  width: 100%;
  margin-bottom: 10px;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
.dialogWrap >>> .el-dialog__body {
  height: 40vh;
  overflow: auto;
}
.dialogWrap >>> .el-upload-list{
  overflow: hidden;
}
.dialogWrap >>> .el-upload-list__item {
  width: 150px;
  float: left;
  margin: 0 5px;
  padding: 10px;
  height: 140px;
  transition: none;
}
.dialogWrap >>> .el-upload-list__item-thumbnail {
  float: none;
  display: block;
  width: 100px;
  height: 100px;
  margin-left: 10px;
}
.dialogWrap >>> .el-upload-list__item a.el-upload-list__item-name {
  text-align: center;
  line-height: 30px;
  margin: 0;
}
</style>
