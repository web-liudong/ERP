
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
         <DraggleUpload  class="draggleBox" @callback="uploadCallback" ref="DraggleUpload" image="imga" :data="{type:'Sku',width:800,height:800,size:2}"></DraggleUpload>
      </div>
      <div class="detailBox">
        <span class="detailPicture" style="margin-left: 50px;margin-top: 50px">
          <i style="color: red">*</i>商品详情图：
        </span>
         <DraggleUpload  class="draggleBox" @callback="detailuploadCallback" ref="detailDraggleUpload" :data="{type:'Sku',width:760,size:2}"></DraggleUpload>
      </div>
      <div class="footerBox">
        <el-button type="primary" @click="openWin()">返回上一页</el-button>
        <el-button type="primary" @click="toDraft()">保存至草稿</el-button>
        <el-button type="primary" @click="toAduit()">保存并提交审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  createSkuImageInfo,
  editerGoodsToExamine,
  getPictureBanner,
  updateSkuImageInfo,
  editerGoodsToDraft
} from "@/api/goodsManage";
import "@/components/goods/addGoods/GoodsPicture.less";
import { addURL } from "@/utils/index";
import DraggleUpload from "@/components/common/module/DraggleUpload.vue";
export default {
  inject: ["close"],
  data() {
    return {
      headerToken: { Authorization: "Bearer " + this.$auth.token },
      skuImageInfoParam: {
        skuId: this.$route.query.pictureID,
        //主图id
        mainPictureFileId: "",
        //详情图
        detailPictureFileIdList: [
        ],
        //次图id
        slidePictureFileIdList: [
        ]
      },
      //商品id
      goodsPictureID: this.$route.query.pictureID
    };
  },
  created() {
    getPictureBanner(this.goodsPictureID).then(res => {
      this.$refs.DraggleUpload.init([...res.data.mainPictureFile,...res.data.slidePictureFile])  
      this.$refs.detailDraggleUpload.init(res.data.detailPictureFile)
    });
  },
  components: {
    DraggleUpload
  },
  methods: {
    uploadCallback(row) {
      this.skuImageInfoParam.mainPictureFileId = row[0].id;
      this.skuImageInfoParam.slidePictureFileIdList = row
        .map(item => {
          return item.id;
        })
        .slice(1);
    },
    detailuploadCallback(row) {
      this.skuImageInfoParam.detailPictureFileIdList = row.map(item => {
        return item.id;
      });
    },
    openWin() {
      this.$router.push({
        name: "CopyFillParams",
        query: { oldID: this.goodsPictureID }
      });
    },
    //保存到草稿
    toDraft(formName) {
      editerGoodsToDraft(this.skuImageInfoParam).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "保存至草稿成功",
            type: "success"
          });
          setTimeout(() => {
            this.close();
          }, 1000);
        } else {
          this.$message({
            message: "保存至草稿失败",
            type: "error"
          });
        }
      });
    },
    toAduit(formName) {
      updateSkuImageInfo(this.skuImageInfoParam).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "保存并提交审核成功",
            type: "success"
          });
          this.$router.push({ name: "GoodsManage" });
        } else {
          this.$message({
            message: "保存并提交审核失败",
            type: "error"
          });
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
