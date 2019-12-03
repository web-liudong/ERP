<template>
  <div class="dialog-box">
    <el-dialog
      width="500px"
      title="导入类型选择"
      :visible.sync="dialogReturn"
      append-to-body>
      <div style="display: flex">

        <p style="width: 130px;text-align: right;"><i style="color: #f00;right: 10px;">*</i>本次导入类型： </p>
        <el-radio v-model="radio" label="5" >更新部分数据</el-radio>
        <el-radio v-model="radio" label="6">清除当前，更新全部</el-radio>
      </div>
      <div class="tips">
        <p>小提示：</p>
        <p>1.更新部分数据：会按照当前列表中ID进行更新或新增；
          <br>2.整体更新，会清空当前列表数据，生效导入成功的数据。
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReturn = false">取 消</el-button>
        <el-button type="primary" @click="getText">确定</el-button>
      </div>
      <el-dialog :visible.sync="innerVisible" width="600px" custom-class="dialog-box" title="信息批量导入">
        <div class="message-box">
          <!--<div class="first-step-box">-->
          <!--<i>第一步:&nbsp;&nbsp;&nbsp;&nbsp;</i>-->
          <!--<i class="first-step" @click="innerVisible = true">下载街道批量导入模板</i>-->
          <!--</div>-->
          <div class="second-step-box">
            <!--<div class="second-step-text">请选择要导入的文件:</div>-->
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
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>

      </el-dialog>
    </el-dialog>

  </div>

</template>

<script>
  import request from "@/utils/request";
  import { formatString } from "@/utils";
  export default {
    props: ["title", "type", "params"],
    data() {
      return {
        isif:'1',
        disabled:true,
        isIf: true,
        disabled:true,
        radio: '',
        innerVisible: false,
        dialogVisible: false,
        dialogData:false,
        loading: false,
        dialogReturn: false,
        returnData:'',
        fileList: [],
        accountList:[],
        headertoken: { Authorization: "Bearer " + this.$auth.token },
        // download: `/api/warehouse-service/delivery-route/import-template?id={id}&access_token={token}`,
        upload: ``,
        FileExport:{
          provinceId:null,
        },
      }
    },
    methods: {
      getText(){
        if(this.radio == ''){
          this.$message({
            message: "请选择导入类型",
            type: "error"
          });

          // upload : this.radio == 5 ? `api/warehouse-service/new-delivery-route/{id}/updateImport`: `api/warehouse-service/new-delivery-route/{id}/clearImport`
          return
        }
        if(this.radio == '5'){
          this.upload = `api/warehouse-service/delivery-route/{id}/updateImport`
        }
        if(this.radio == '6'){
          this.upload = `api/warehouse-service/delivery-route/{id}/clearImport`
        }
        this.innerVisible = true

      },

      // 批量导入
      init() {
        this.fileList = [];
        this.dialogReturn = true;
      },
      handleChange(file, fileList) {
        this.fileList = fileList;
        console.log(fileList);
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

      download(data){
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data],{type:"application/vnd.ms-excel"}))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download','仓库配送线路导入模板.xls')
        document.body.appendChild(link)
        link.click()
        console.log(link)
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
          this.innerVisible = false;
          this.dialogReturn = false;
          this.fileList = [];
          this.$emit("func", "tag");
          return {isUpdate:true};
        } else {
          this.$message.error(res.message || "文件上传失败");
        }
      },
      beforeUpload(file) {
        this.loading = true;
        const extension = file.name.split(".")[1] === "xls";
        const extension1 = file.name.split(".")[1] === "zip";
        const extension2 = file.name.split(".")[1] === "xlsx";
        const isJPG = file.name.split(".")[1] === "jpg";
        const isPNG = file.name.split(".")[1] === "png";
        const isPDF = file.name.split(".")[1] === "pdf";
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
          url = formatString(this.upload, this.params);
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
        this.innerVisible = false;
        this.fileList = [];
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.switchType(this.customerstatus)
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.switchType(this.customerstatus);
      },
    },
  }
</script>

<style scoped lang="less">

  .tips {
    margin-top: 20px;
    display: flex;
    color: red;
    font-size: 12px;
    line-height: 20px;
    margin-left: 40px;
  }
  .dialog-box {
    position: relative;
    .tree {
      display: flex;
      justify-content: center;
    }
    i{
      margin-left: 50px;
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
        margin-left: 65px;
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
