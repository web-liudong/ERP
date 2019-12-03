<template>
  <el-upload
    class="upload-demo"
    action="/api/file-service/file/upload?type=Authorization"
    :headers="headertoken"
    :on-change="handleChange"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    name="fileName"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="3"
    :on-exceed="handleExceed"
    style="margin:0 0px 20px 150px;width: 25%;"
    :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">支持jpg、png、pdf格式文件，大小不超过2M</div>
  </el-upload>
</template>

<script>
  import {deleteFileDelete} from "@/api/common/commonApi"
  export default {
    name:'upload',
    data() {
      return {
        headertoken:{'Authorization':'Bearer '+this.$auth.token},
        fileList:[],
        imageUrl:[],
        addData: {
          fileId: [],
        },
      };
    },
    props: ['headname'],
    methods:{
      handleAvatarSuccess(res, file) {
        if(res.code == '000000') {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.$message({
            message: '图片上传成功',
            type: 'success'
          });
          this.addData.fileId.push(res.data.id)
          console.log(this.addData.fileId)
          this.$emit('callback',res.data.id)
        } else {
          this.$message.error('图片上传失败');
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.name.split(".")[1] === "jpg";
        const isPNG = file.name.split(".")[1] === "png";
        const isPDF = file.name.split(".")[1] === "pdf";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if(!isLt2M){
          this.$message({
            message: '上传图片大小不得超过2M',
            type: 'error'
          })
          return false
        }
        if(!(isJPG || isPNG || isPDF )) {
          this.$message({
            message: '上传图片只能是 JPG PNG PDF格式!且不超过2M',
            type: 'error'
          })
          return false;
        }
        return (isJPG ||isPNG ||isPDF )&&isLt2M
      },
      handleChange(file, fileList) {
        this.fileList = fileList;
      },
      handleRemove(file, fileList) {        //删除文件
      console.log(file,7777)
        deleteFileDelete(
          file.response.data.id
        ).then((res) => {
          if (res.data == '1') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.addData.fileId = this.addData.fileId.filter(item => {
              return item!=file.id;
            });
            console.log(file, fileList);
            console.log(this.addData.fileId );
          } else{
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
        }).catch(err => {

        });
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }
  }
</script>
<style scoped>
  .myicon{
    font-size: 23px;
    margin-top: 3px;
  }
  .add-head{
    width: 100%;
    height: 40px;
    background-color:#f3f3f3;
    padding-left: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e4e4e4;
  }
  .add-class-text{
    font-color:#666;
    font: bold 16px/40px '微软雅黑';
  }
</style>
