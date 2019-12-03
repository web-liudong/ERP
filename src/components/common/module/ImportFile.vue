<template>
  <el-dialog :title="title" :visible.sync="isShow" width="600px" custom-class="dialog-box">
    <div class="message-box">
      <div class="first-step-box">
        <i>第一步:&nbsp;&nbsp;&nbsp;&nbsp;</i>
        <i class="first-step" @click="getCodeFileDownload">{{apiMapping[type].name}}</i>
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
export default {
  props: ["title", "type", "params"],
  data() {
    return {
      isShow: false,
      loading: false,
      apiMapping: {
        "release-navigation-import": {
          download: `/api/file-service/file/download/latest?type=MainSite_Navigation_Template&access_token={token}`,
          upload: "/api/mainsite-release-service/mainsiterelease/navigation/importfile",
          name: "下载导航批量导入模板"
        },
        "release-shoppe-goods-import": {
          download: `/api/file-service/file/download/latest?type=Shoppe_Sku_Template&access_token={token}`,
          upload: "/api/shoppe-release-service/shopperelease/shoppe/{id}/import",
          name: "下载商品批量导入模板"
        },
        "bidding-import": {
          download: `/api/file-service/file/download/latest?type=Bidding_Template&access_token={token}`,
          upload: "/api/bidding-service/bidding/import",
          name: "下载竞价批量导入模板"
        },
        "bidding-result-import": {
          download: `/api/file-service/file/download/latest?type=Bidding_Result_Template&access_token={token}`,
          upload: "/api/bidding-service/bidding/result-import",
          name: "下载竞价批量导入模板"
        },
        "military-network-import": {
          download: ``,
          upload: "/api/bidding-service/bidding/military-network-import",
          name: "请从军网下载导入的竞价信息表"
        },
        "release-shoppe-nav-import": {
          download: `/api/file-service/file/download/latest?type=Shoppe_Navigation_Template&access_token={token}`,
          upload: "/api/shoppe-release-service/shopperelease/navigation/{id}/import",
          name: "下载导航批量导入模板"
        },
        "mall-sku-import": {
          download: `/api/file-service/file/download?id={id}&access_token={token}`,
          upload: "/api/mall-release-service/mall/sku/{id}/import",
          name: "下载分类批量导入模板"
        },
        "goods-class-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Category_Template`,
          upload: "/api/product-service/category/import",
          name: "下载分类批量导入模板"
        },
        "back-money-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Payment_Received_Template`,
          upload: "/api/bill-service/payment-received/import",
          name: "下载回款批量导入模板"
        },
        "finance-code-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=TaxCode_Template`,
          upload: "/api/product-service/taxcode/import",
          name: "下载分类批量导入模板"
        },
        "goods-manage-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Sku_Template`,
          upload: "/api/product-service/sku/import",
          name: "下载商品管理批量导入模板"
        },
         "item-correspond-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Mall_Category_Template`,
          upload: `/api/mall-release-service/mall/category/{mallId}/import`,
          name: "下载品目批量导入模板"
        },
         "params-correspond-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Mall_Attribute_Template`,
          upload: `/api/mall-release-service/mall/category/attribute/{mallId}/import`,
          name: "下载参数批量导入模板"
        },
        "brand-correspond-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Mall_Brand_Template`,
          upload: `/api/mall-release-service/mall/brand/{mallId}/import`,
          name: "下载品牌批量导入模板"
        },
        "skupond-correspond-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Mall_Sku_Template`,
          upload: `/api/mall-release-service/mall/sku/{mallId}/import`,
          name: "下载商品信息批量导入模板"
        },
        "product-brand-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Brand_Template`,
          upload: `/api/product-service/brand/import`,
          name: "下载品牌信息批量导入模板"
        },
        "invoice-post-import": {
          download: `/api/file-service/file/download?id={id}&access_token={token}`,
          upload: `/api/bill-service/invoice/record/post`,
          name: "下载发票批量邮寄模板"
        },
        "finance-accountsPayable-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Payment_Account_Import_Template`,
          upload: `/api/bill-service/account/payable/importfile`,
          name: "下载付款信息批量导入模板"
        },
        "Supplier_BaseInfo_Template": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Supplier_BaseInfo_Template`,
          upload: `/api/supplier-service/supplier/import`,
          name: "下载供应商基础信息批量导入模板"
        },

        "SupplierBiz_BaseInfo_Template": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=SupplierBiz_BaseInfo_Template`,
          upload: `/api/supplier-service/supplierbiz/import`,
          name: "下载供应商业务信息批量导入模板"
        },
        "Project_Import_Template": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Project_Import_Template`,
          upload: `/api/customer-service/project/import`,
          name: "下载项目信息批量导入模板"
        },
        "Paramenter_Template_Template": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Category_Attribute_Template`,
          upload: `/api/product-service/categoryattributetemplate/import`,
          name: "下载参数模板批量导入模板"
        },
        "Erp_Create_Item_Import_Template": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Erp_Create_Item_Import_Template`,
          upload: `/api/order-service/order/erp/import`,
          name: "下载商品导入模板"
        },
        "purchase-Payments-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Purchase_Payable`,
          upload: `/api/purchase-service/purchase/payable/import`,
          name: "下载付款信息批量导入模板"
        },
        "customer-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Customer_Template`,
          upload: `/api/customer-service/customer/import-customer`,
          name: "客户信息批量导入模板"
        },
        
        "DeliveryRoute-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=DeliveryRoute`,
          upload: `/api/warehouse-service/delivery-route/{id}/import`,
          name: "线路管理批量导入模板"
        },
        "Accredit-Payments-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Purchase_Payable`,
          upload: `/api/authorization-service/authorization/import/{fileName}`,
          name: "下载授权库批量导入模板"
        },
        "organization-manage-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Organization_Template`,
          upload: `/api/user-service/organization/import`,
          name: "下载组织机构批量导入模板"
        },
        "department-manage-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Department_Tempalte`,
          upload: `/api/user-service/organization/import`,
          name: "下载部门批量导入模板"
        },
        "purchase-demand-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Purchase_Requirement_Import_Template`,
          upload: `/api/purchase-service/purchase/requirement/transfer`,
          name: "下载采购需求导入模板"
        },
        "brand-update-import": {
          download: `/api/file-service/file/download/latest?id={id}&access_token={token}&type=Brand_Update_Template`,
          upload: `/api/product-service/brand/import/update`,
          name: "下载品牌更新导入模板"
        },
        "purchase-skuPool-import": {
          download: `/api/file-service/file/download/latest?access_token={token}&type=Central_Purchase_Sku_Pool_Import_Template`,
          upload: `/api/purchase-service/centralPurchaseSkuPool/import`,
          name: "下载商品批量导入模板"
        }
      },
      fileList: [],
      accountList:[],
      headertoken: { Authorization: "Bearer " + this.$auth.token }
    };
  },
  methods: {
    init() {
      this.fileList = [];
      this.isShow = true;
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
    getCodeFileDownload() {
      if(this.type!='military-network-import'){
        let href = formatString(this.apiMapping[this.type].download, {id:this.params&&this.params.id||null, token:this.$auth.token});
        window.open(href,'blank');
      }
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
       url = formatString(this.apiMapping[this.type].upload, this.params);
      fd.append("fileName", options.file, options.file.name);
      if(this.type=='Erp_Create_Item_Import_Template'){
      	fd.append("projectId", this.params.projectId);
      	fd.append("customerId", this.params.customerId);
      }
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
