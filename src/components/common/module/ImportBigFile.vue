<template>
  <el-dialog :title="title" :visible.sync="isShow" width="600px" custom-class="dialog-box">
    <div class="message-box">
      <div class="first-step-box">
        <i>第一步:&nbsp;&nbsp;&nbsp;&nbsp;</i>
        <i class="first-step" @click="getCodeFileDownload">{{apiMapping[type].name}}</i>
      </div>
      <div class="second-step-box">
        <div class="second-step-text">第二步:</div>
        <div class="upload-demo">
          <Plupload
            ref="upload"
            browse_button="selectFile"
            :url="actionUrl"
            chunk_size="2MB"
            :multi_selection="false"
            :max_retries="3"
            :headers="headertoken"
            :filters="filtersmime"
            :FilesAdded="filesAdded"
            :BeforeUpload="beforeUpload"
            :UploadComplete="uploadComplete"
            :FileUploaded="fileUploaded"
            @inputUploader="inputUploader"
          />
          <el-button size="small" type="primary" id="selectFile">请选择要导入的文件</el-button>
          <!-- <el-button size="small" type="primary" @click="uploadStart">上传文件</el-button> -->
        </div>
      </div>
      <el-table
        :data="pluploadfiles"
        style="width: 100%; margin: 10px 10px;">
        <el-table-column
          label="文件名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="大小">
          <template slot-scope="scope">
            <span>{{(scope.row.size/1024/1024).toFixed(2)}}MB</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">准备上传</span>
            <span v-if="scope.row.status === 4" style="color: brown">上传失败</span>
            <span v-if="scope.row.status === 5" style="color: #399">上传完毕</span>
            <el-progress v-if="scope.row.status === 2" :text-inside="true" :stroke-width="20" :percentage="scope.row.percent"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="uploadStart()" v-if="scope.row.status != 5">开始上传</el-button>
            <!-- <el-button type="primary" size="small" @click="deleteFile(scope.row.id)" v-else>删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="tip">
        <p>小提示：</p>
        <p>导入文件只支持zip压缩包文件。</p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitUpload">导 入</el-button>
    </div>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";
import { formatString } from "@/utils";
import FileMd5 from '@/lib/file-md5.js'
import {
    importBigSkuFile,
    importBigAccreditFile
  } from '@/api/common/commonApi'
import Plupload from "@/components/common/module/Plupload";
export default {
  props: ["title", "type", "params"],
  data() {
    return {
      isShow: false,
      loading: false,
      apiMapping: {
        "Accredit-Payments-import": {
          download: `/api/file-service/file/download/latest?type=Authorization_Import_Template&access_token={token}`,
          importFn: importBigAccreditFile,
          name: "下载授权库批量导入模板"
        },
        "goods-manage-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Sku_Template`,
          importFn: importBigSkuFile,
          name: "下载商品管理批量导入模板"
        },
      },
      plupload: {}, //plupload实例
      pluploadfiles: [],
      uploadCallBack:{},
      actionUrl:"/api/file-service/file/large-upload",
      filtersmime: {
        mime_types: [
          //只允许上传zip文件
          { title: "Zip files", extensions: "zip" }
        ],
        prevent_duplicates: false
      },
      headertoken: { Authorization: "Bearer " + this.$auth.token }
    };
  },
  components:{
    Plupload
  },
  methods: {
    init() {
      this.reset();
      this.isShow = true;
    },
    reset(){
      this.plupload.refresh && this.plupload.refresh();
      if(this.plupload.files){
        this.plupload.files.forEach((file,index,files) => {
          this.plupload.removeFile(file)
        })
        this.pluploadfiles = this.plupload.files;
      }
    },
    getCodeFileDownload() {
      let href = formatString(this.apiMapping[this.type].download, {id:this.params&&this.params.id||null, token:this.$auth.token});
      window.open(href,'blank');
    },
    inputUploader(up) {
      this.plupload = up;
      this.pluploadfiles = up.files;
    },
    filesAdded(up, files) {
      if (up.files.length > 1) {
        up.removeFile(up.files[0])
      }
      files.forEach((f) => {
        f.status = -1;
        FileMd5(f.getNative(), (e, md5) => {
          f["md5"] = md5;
          f.status = 1;
        });
      });
    },

    beforeUpload(up, file) {
      up.setOption("multipart_params", { size: file.size, md5: file.md5, type:'bigfile' });
    },
    fileUploaded(up, file, res){
      let resObj = JSON.parse(res.response);
      this.uploadCallBack = resObj.data;
    },
    uploadComplete(up, file){},
    uploadStart(){
      this.plupload.start();
    },
    deleteFile(id) {
      let file = this.plupload.getFile(id);
      this.plupload.removeFile(file);
    },
    submitUpload() {
      if (this.pluploadfiles.length) {
        if(!this.uploadCallBack.id){
          this.$message({
            message: "请先上传文件之后再导入",
            type: "error"
          });
          return false;
        }
        this.$confirm('系统将为您批量导入, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.apiMapping[this.type].importFn(this.uploadCallBack.id).then(res => {
            this.isShow = false;
            this.$message({
              message: "导入操作成功",
              type: "success"
            });
            this.$emit("callback", "importBigFile");
          })
        }).catch(() => {});
      } else {
        this.$message({
          message: "请选择文件之后再上传",
          type: "error"
        });
      }
    },
    close(){
      this.isShow = false;
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
      padding: 0;
      align-items: center;
      position: relative;
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
        margin-left: 20px;
        .el-upload__tip {
          float: right;
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
    .upload-progress{
      width: 200px;
      margin-left: 15px;
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
