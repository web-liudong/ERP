<template>
  <!-- 上传多张图片 -->
  <div class="image-list">
    <draggable v-model="showImgList" :options="{group:image}" @change="dragChange" >
      <div v-for="(image, index) in showImgList" :key="index" class="image-wrap">
        <img :src="image.path" :style="imgStyle" @click.stop="openFile(index)" />
        <div class="icon-wrap" @click.stop="removeFile(index)">
          <i class="el-icon-delete"></i>
        </div>
      </div>
      <el-upload
        ref="imageListUpload"
        :headers="headerToken"
        action="/api/file-service/file/upload/check/size"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        class="image-uploader"
        name="fileName"
        :on-error="onError"
        :data="data"
        multiple
        :disabled="loading"
        :show-file-list="false"
        accept="image/*"
      >
        <i :class="loading ? 'el-icon-loading' : 'el-icon-plus'" :style="imgStyle"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" top="4vh">
        <el-carousel indicator-position="outside" height="800px" :autoplay="false" :initial-index="carIndex" ref="carousl">
          <el-carousel-item v-for="item in showImgList" :key="item.id">
            <img width="100%" :src="item.path" alt />
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </draggable>
  </div>
</template>
<script type="text/babel">
/**
 * 上传图片或文件
 */
import draggable from "vuedraggable";
import { Debounce, addURL } from "@/utils/index";
export default {
  props: {
    data: {
      type: [Array, String, Object],
      default: () => {
        return "";
      }
    },
    limit: {
      type: Number,
      default: () => {
        return 5;
      }
    },
    image:{
     type:String,
     default:'image'
    },
    // 一次上传多个
    multiple: {
      type: Boolean,
      default: false
    },
    //图片展示的宽度
    imgWidth: {
      type: Number,
      default: 146
    },
    imgHeight: {
      type: Number,
      default: 146
    },
    //期望上传图片的宽度
    rule: [Object, Function]
  },
  data() {
    return {
      carIndex:0,
      dialogVisible: null,
      dialogImageUrl: null,
      headerToken: { Authorization: "Bearer " + this.$auth.token },
      imgUrl: "",
      showImgList: [],
      fileList: [],
      clipboard: false,
      isDrag: false,
      handleSuccess: null,
      loading: false,
      showImgListCar:[]
    };
  },
  components: { draggable },
  computed: {
    imgStyle() {
      return {
        width: this.imgWidth + "px",
        height: this.imgHeight + "px",
        lineHeight: this.imgHeight + "px"
      };
    }
  },
  mounted() {
    //防抖
    this.handleSuccess = Debounce(this.uploadSuccess, 500);
  },
  methods: {
    init(row){
      this.showImgList=row;
      this.showImgList=this.showImgList.filter(item=>{
       return item
     })
     this.showImgList.forEach((item,index)=>{
        if(item){
        item.path=addURL(item.path)
        }       
     });
     this.$emit('callback',this.showImgList)

    },
    openFile(index) {
      // debugger
      this.dialogVisible = true;
      this.carIndex=index
      this.$nextTick(()=>{
      this.$refs.carousl.setActiveItem(index)
      })
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      if (!(isJPG || isPNG || isJPEG)) {
        this.$message({
          message: `上传头像图片只能是 JPG或者PNG或JPEG格式!`,
          type: "error"
        });
      }
      // if (file.type.split("/")[0] === "image") {
      //   let tempSize = file.size / 1024 / 1024 > 2;
      //   if (tempSize) {
      //     this.$message.error("图片尺寸不得大于2M！");
      //     return false;
      //   }
      // }
      this.loading = true;
    },
    uploadSuccess(response, file, fileList) {
      try {
        for (let fileInfo of fileList) {
          let imageInfo = fileInfo.response.data;
          imageInfo.path = addURL(imageInfo.path);
          if (this.showImgList.length >= this.limit) {
            // 限制图片张数
            this.showImgList.length = this.limit;
            throw new Error(`最多上传 ${this.limit} 张图片`);
          }
          this.showImgList.push(imageInfo);
        }
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
        this.$emit("callback", this.showImgList);
        this.$refs.imageListUpload && this.$refs.imageListUpload.clearFiles();
        this.$refs.imageUpload && this.$refs.imageUpload.clearFiles();
      }
    },
    removeFile(index) {
        this.showImgList.splice(index, 1);
        this.$emit("callback", this.showImgList);
    },
    onError(error) {
      this.loading = false;
      this.$message({
        message:`${JSON.parse(error.message).message}`,
        type:'error'
      });
    },
    dragChange(row) {
      console.log(this.$refs.carousl)
      this.$emit("callback", this.showImgList);
    },
    handleRemove(file, fileList) {
      let imgList = fileList.map(item => {
        return item.response.data;
      });
      this.$emit("callback", imgList);
    },
  }
};
</script>
<style lang="less" scoped>
.image-list,
.image-item {
  display: flex;
  .image-wrap {
    position: relative;
    display: inline-block;
    box-sizing: content-box;
    margin: 0 8px 8px 0;
    vertical-align: top;
    &:hover {
      .icon-wrap {
        opacity: 1;
      }
    }
    .icon-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30px;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.7);
      transition: opacity 0.3s;
      .el-icon-zoom-in {
        cursor: pointer;
        margin-right: 8px;
      }
      .el-icon-delete {
        cursor: pointer;
      }
      .el-icon-plus {
        cursor: pointer;
      }
    }
  }
}
.image-item {
  display: inline-flex;
}
/deep/.image-uploader {
  display: inline-block;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    [class^="el-icon"] {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
    &:hover {
      border-color: #339999;
    }
  }
}
</style>