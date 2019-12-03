<!--商品图片-->
<template>
  <div class="goodsPictureBox">
    <div class="stepBox">
      <el-steps :active="2">
        <el-step title="填写基本信息"></el-step>
        <el-step title="填写参数信息"></el-step>
        <el-step title="图片"></el-step>
      </el-steps>
    </div>
    <div class="editerBrandBox">
      <div class="h50 headerBox">
        <span>商品图片</span>
      </div>
      <div class="pictureBox">
        <span style="margin-left: 50px;margin-top: 50px">
          <i style="color: red">*</i>商品轮播图：
        </span>
        <DraggleUpload
          :rule="rules"
          class="draggleBox"
          @callback="uploadCallback"
          ref="DraggleUpload"
          image="imga"
          :data="{type:'Sku',width:800,height:800}"
        ></DraggleUpload>
      </div>
      <span
        style="margin-left: 180px;font-size:12px"
      >支持格式JPG/JPEG/PNG轮播图至少3张，至多5张,第一张为商品主图，图片顺序为展示顺序。图片大小建议不超过2MB,尺寸为800*800px</span>
      <div style="margin-left: 180px;font-size:12px">支持同时上传多张图片,按alt键选择多张图片,支持拖拽调整图片顺序,点击可查看大图</div>
      <div class="detailBox">
        <span class="detailPicture" style="margin-left: 50px;margin-top: 50px">
          <i style="color: red">*</i>商品详情图：
        </span>
        <DraggleUpload
          :rule="rules"
          class="draggleBox"
          @callback="detailuploadCallback"
          ref="detailDraggleUpload"
          :data="{type:'Sku',width:760}"
        ></DraggleUpload>
      </div>
      <span
        style="margin-left: 180px;font-size:12px"
      >一张长条图，支持格式JPG/JPEG/PNG，详情图建议上传一张长条图；多图将按图片顺序展示,图片宽度760px</span>
      <div class="footerBox">
        <el-button type="primary" @click="openWin()">返回上一页</el-button>
        <el-button type="primary" @click="toDraft()">保存至草稿</el-button>
        <el-button type="primary" @click="toAduit()">保存并提交审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createSkuImageInfo, editerGoodsToExamine } from "@/api/goodsManage";
import "@/components/goods/addGoods/GoodsPicture.less";
import { addURL, removeID } from "@/utils/index.js";
import DraggleUpload from "@/components/common/module/DraggleUpload.vue";
export default {
  inject: ["close"],
  name: "GoodsPicture",
  data() {
    return {
      headerToken: { Authorization: "Bearer " + this.$auth.token },
      skuImageInfoParam: {
        skuId: this.$route.query.pictureID,
        //主图id
        mainPictureFileId: "",
        //详情图
        detailPictureFileIdList: [
          // '1','2','5'
        ],
        //次图id
        slidePictureFileIdList: [
          // '2','5','6'
        ]
      },
      //商品id
      goodsPictureID: this.$route.query.pictureID
    };
  },
  created() {
    this.skuImageInfoParam.skuId = this.$route.query.pictureID;
    this.goodsPictureID = this.$route.query.pictureID;
  },
  activated() {
    if (
      this.$route.query.pictureID &&
      this.goodsPictureID != this.$route.query.pictureID
    ) {
      this.skuImageInfoParam.skuId = this.$route.query.pictureID;
      this.goodsPictureID = this.$route.query.pictureID;
    }
  },
  components: {
    DraggleUpload
  },
  methods: {
    uploadCallback(row){
     this.skuImageInfoParam.mainPictureFileId=row[0].id;
     this.skuImageInfoParam.slidePictureFileIdList=row.map((item)=>{
       return item.id
     }).slice(1)
    },
    detailuploadCallback(row){
    this.skuImageInfoParam.detailPictureFileIdList=row.map((item)=>{
      return item.id;
    })
    },
    //保存到草稿
    toDraft(formName) {
      if(this.skuImageInfoParam.mainPictureFileId&&this.skuImageInfoParam.slidePictureFileIdList.length>1){
        createSkuImageInfo(this.skuImageInfoParam).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "保存至草稿成功",
            type: "success"
          });
          this.close({
            name: "GoodsPicture",
            to: { name: "GoodsManage", params: { isUpdate: true } }
          });
        } else {
          this.$message({
            message: "保存至草稿失败",
            type: "error"
          });
        }
      });
      }
    },
    toAduit(formName) {
       if(this.skuImageInfoParam.mainPictureFileId&&this.skuImageInfoParam.slidePictureFileIdList.length>1){
        editerGoodsToExamine(this.skuImageInfoParam).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "保存并提交审核成功",
            type: "success"
          });
          this.close({
            name: "GoodsPicture",
            to: { name: "GoodsManage", params: { isUpdate: true } }
          });
        } else {
          this.$message({
            message: "保存并提交审核失败",
            type: "error"
          });
        }
      });
       }
    },
    openWin() {
      this.close({
        name: "GoodsPicture",
        to: {
          name: "FillParams",
          query: { goodsID: this.goodsPictureID },
          params: { isUpdate: true }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.containerBox {
  .stepBox {
    margin: 20px 50px;
  }
  .editerBrandBox {
    border: 1px solid #e4e4e4;
    .headerBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #e4e4e4;
      span {
        line-height: 50px;
        margin-left: 50px;
        font-size: 16px;
        color: #303133;
      }
    }
    .pictureBox {
      display: flex;
    }
  }
}
</style>

<style lang="less">
.goodsPictureBox {
  //  .avatar-uploader .el-upload {
  //      border: 1px dashed #d9d9d9;
  //      border-radius: 6px;
  //      cursor: pointer;
  //      position: relative;
  //      overflow: hidden;
  //      .el-icon-zoom-in{
  //       display: none;
  //       color: #339999;
  //     }
  //    }
  .avatar-uploader .el-upload {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
    .el-icon-zoom-in,
    .el-icon-delete {
      display: none;
      color: #e4e4e4;
      font-family: "element-icons" !important;
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
      -webkit-font-smoothing: antialiased;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #339999;
    opacity: 1;
    color: #000;
    .el-icon-zoom-in,
    .el-icon-delete {
      display: block;
      font-family: "element-icons" !important;
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
  .el-upload-list__item {
    margin-left: 15px;
  }
  .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 20px;
  }
}
</style>
