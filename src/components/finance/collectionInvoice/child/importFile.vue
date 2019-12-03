<template>
  <el-dialog :title="title" :visible.sync="isShow" width="600px" custom-class="dialog-box">
    <div class="message-box">
      <div class="first-step-box">
        <i>第一步:&nbsp;&nbsp;&nbsp;&nbsp;</i>
        <i class="first-step" @click="getCodeFileDownload">下载发票批量邮寄模板</i>
      </div>
      <div class="second-step-box">
        <div class="second-step-text">第二步:</div>
        <el-upload
          ref="upload"
          :action="'test'"
          class="upload-demo"
          :headers="headertoken"
          :on-change="handleChange"
          :on-error="handleError"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :http-request="uploadFile"
           name="file"
          :on-remove="handleRemove"
          multiple
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <div slot="tip" class="el-upload__tip">请选择要导入的文件</div>
          <el-button size="small" type="primary" slot="trigger" :loading="loading">文件上传</el-button>
        </el-upload>
      </div>
      <div class="tip">
        <p>小提示：</p>
        <p>导入文件大小不能超过6M；
          <br>导入文件信息最多允许有2W条分类数据。
        </p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitUpload">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import request from '@/utils/request.js'
import { formatString } from "@/utils";
import { importTemplate } from "@/api/finance/collectionInvoice";
export default {
  props: ["title"],
  data() {
    return {
      isShow: false,
      loading: false,
      query: null,
      fileList: [],
      accountList:[],
      headertoken: { Authorization: "Bearer " + this.$auth.token }
    };
  },
  methods: {
    init(row) {
      this.fileList = [];
      this.query = row;
      this.isShow = true;
    },
    getCodeFileDownload() {
      console.log(this.query);
      importTemplate(this.query).then(res => {
        console.log(res,'999');
        this.download(res);
      });
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/xls" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "发票批量邮寄模板.xls");
      document.body.appendChild(link);
      link.click();
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      // this.accountList=fileList[0].response.data;
    },
    handleRemove(file, fileList) {
      //删除文件
      this.fileList = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleError(res, file) {
      this.loading = false;
      let msg = (res.response && res.response.data && res.response.data.message) || '文件上传失败';
      this.$message.error(msg);
    },
    handleSuccess(res, file) {
      this.loading = false;
      if (res.code == "000000") {
        this.$message({
          message: "文件上传成功",
          type: "success"
        });
        console.log(res.data,7766555)
        // this.accountList=res.data;
        this.$emit('dialogCallBackPayment',res.data)
        this.isShow = false;
        this.fileList = [];
        this.$emit("callback", "tag");
      } else {
        this.$message.error(res.message || "文件上传失败");
      }
    },
    beforeUpload(file) {
      this.loading = true;
      var len=file.name.split(".").length-1;
      const extension = file.name.split(".")[len] === "xls";
      const extension1 = file.name.split(".")[len] === "zip";
      const extension2 = file.name.split(".")[len] === "xlsx";
      const isJPG = file.name.split(".")[len] === "jpg";
      const isPNG = file.name.split(".")[len] === "png";
      const isPDF = file.name.split(".")[len] === "pdf";
      const isLt2M = file.size / 1024 / 1024 < 6;
      if (!isLt2M) {
        this.$message({
          message: "上传图片大小不得超过6M",
          type: "error"
        });
        this.loading = false;
        return false;
      }
      if (!(extension||extension1 || extension2)) {
        this.$message({
          message: "上传文件只能是 xls xlsx zip 格式!",
          type: "error"
        });
        this.loading = false;
        return false;
      }
      return (extension ||extension1|| extension2) && isLt2M;
    },
    uploadFile(options) {
      let fd = new FormData(),
      url = formatString('/api/purchase-service/centralPurchase/invoice/record/post-batch');
      fd.append("fileName", options.file, options.file.name);
      let res = request({
        url: url,
        method: "post",
        data: fd
      });
      return res;
    },
    submitUpload() {
      if (this.fileList.length === 1) {
        this.$confirm('系统将为您批量导入, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$refs.upload.submit();
          console.log(this.accountList,88888)
        })
      } else {
        this.$message({
          message: "请选择文件之后再上传",
          type: "error"
        });
      }
    },
    close(){
      this.isShow = false;
      this.fileList = [];
    }
  }
};
</script>
<style scoped lang="less">
.dialog-box {
  position: relative;
  .tree {
    display: flex;
    justify-content: center;
  }
  .message-box {
    padding: 0px 20px;
    font-size: 14px;
    color: #666;
    .el-input {
      width: 80%;
    }
    .first-step-box {
      padding: 20px 0;
      .first-step {
        color: red;
        font-size: 18px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .second-step-box {
      display: flex;
      padding: 20px 0;
      align-items: center;
      position: relative;
      .second-step-text {
        position: absolute;
        top: 26px;
      }
      .input-box-file {
        width: 120px;
        margin-left: 20px;
        position: relative;
        cursor: pointer;
        .input-button {
          width: 120px;
          height: 30px;
          border: 1px solid #d1d1d1;
          color: #999;
          border-radius: 4px;
          line-height: 30px;
          font-size: 14px;
          text-indent: 10px;
          cursor: pointer;
        }
      }
      .upload-demo {
        margin-left: 65px;
        .el-upload__tip {
          float: right;
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
    .tip {
      display: flex;
      color: red;
      line-height: 30px;
      font-size: 12px;
      margin-bottom: 30px;
    }
  }
  .dialog-title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 50px;
    background-color: #f3f3f3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    .reject-title {
      font-size: 16px;
      font-weight: bold;
      color: #666;
    }
  }
  .dialog-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #eee;
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
<style scoped>
.dialog-box >>> .el-dialog__header {
    padding: 40px;
    background-color: #f3f3f3;
}
</style>
