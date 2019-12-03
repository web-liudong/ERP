<template>
  <el-dialog title="订单开票明细" :visible.sync="isShow" width="700px">
    <div class="dialog-top" v-if="!isClose">
      <a class="download" @click="exportFileDownload">下载明细批量导入模板</a>
      <el-upload
        class="upload-demo"
        :action="actionUrl"
        :show-file-list="false"
        :headers="headertoken"
        :on-error="handleError"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :data="{type:'Order_Delivery'}"
        name="fileName"
      >
        <el-button type="primary" :loading="loading">上传开票信息</el-button>
      </el-upload>
      <!-- <el-button type="primary"  @click="uploadBillCustomize();">上传开票信息</el-button> -->
      <!-- <el-button type="primary" @click="setCloseUpload();">关闭明细上传</el-button> -->
    </div>
    <el-table :data="tableData" max-height="500" border>
      <el-table-column prop="skuName" label="商品名称"></el-table-column>
      <el-table-column prop="itemQty" label="开票数量"></el-table-column>
      <el-table-column prop="billAmount" label="结算总价"></el-table-column>
      <el-table-column prop="skuModel" label="型号"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="taxCode" label="税收分类编码"></el-table-column>
      <el-table-column prop="isSettle" label="是否结算"></el-table-column>
      <el-table-column prop="reviewUserName" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="delItem(scope.row)"
            v-if="scope.row.isSettle == '否'"
          >删除</el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <div
      slot="footer"
      class="dialog-footer"
      style="text-align:left;font-size:16px;"
    >明细总金额：￥{{totalAmount}}</div>
  </el-dialog>
</template>
<script>
import {
  getBillItemForOrder,
  orderIsCloseUpload,
  setCloseUpload,
  uploadBillCustomize,
  delBillCustomize,
  exportOrderDelivery
} from "@/api/order/orderManage";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      loading: false,
      orderInfo: null,
      tableData: [],
      isClose: false,
      uploadFile: null,
      headertoken: { Authorization: "Bearer " + this.$auth.token }
    };
  },
  mounted() {},
  computed: {
    actionUrl: function() {
      return `/api/bill-service/bill/${
        this.orderInfo ? this.orderInfo.id : ""
      }/import-customize-bill-order-item`;
    },
    totalAmount: function() {
      return this.tableData.reduce((sum, item) => {
        return sum + item.billAmount;
      }, 0);
    }
  },
  methods: {
    init(row) {
      this.isShow = true;
      this.orderInfo = row;
      this.getData();
      this.getCloseStatus();
    },
    getData() {
      getBillItemForOrder(this.orderInfo.id).then(res => {
        this.tableData = res.data;
      });
    },
    getCloseStatus() {
      orderIsCloseUpload(this.orderInfo.id).then(res => {
        this.isClose = res.data;
      });
    },
    uploadBillCustomize() {
      uploadBillCustomize(this.orderInfo.id);
    },
    setCloseUpload() {
      setCloseUpload(this.orderInfo.id).then(res => {
        this.isClose = true;
        this.$message({
          message: "订单已关闭上传自定义开票明细",
          type: "success"
        });
      });
    },
    beforeUpload(file) {
      this.loading = true;
      const fileArr = file.name.split(".");
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isXls = fileArr[fileArr.length - 1].indexOf("xls") > -1;

      if (!isXls) {
        this.$message({
          message: "上传文件只能是xlsx、xls格式!",
          type: "warning"
        });
        this.loading = false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不得超过2M",
          type: "error"
        });
        this.loading = false;
      }
      return isXls && isLt2M;
    },
    exportFileDownload() {
      exportOrderDelivery({orderId : this.orderInfo.id}).then(res => {
        if (!res) {
          this.$message({
            message: "导出失败",
            type: "warning"
          });
        } else {
          this.download(res);
        }
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
      link.setAttribute("download", "自定义明细模板.xls");
      document.body.appendChild(link);
      link.click();
    },
    getCodeFileDownload() {
      let href = `/api/file-service/file/download/latest?access_token=${
        this.$auth.token
      }&type=Order_Item_Customize_Template`;
      window.open(href, "blank");
    },
    delItem(row) {
      delBillCustomize(row.id).then(res => {
        this.tableData.forEach((item, index, arr) => {
          if (item.id == row.id) {
            arr.splice(index, 1);
          }
        });
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    handleError(res, file) {
      this.loading = false;
      let cb = JSON.parse(res.message) || {};
      let msg =
        (res.response && res.response.data && res.response.data.message) ||
        cb.message ||
        "文件上传失败";
      this.$message.error(msg);
    },
    handleSuccess(res, file) {
      this.loading = false;
      if (res.code == "000000") {
        this.$message({
          message: "文件上传成功",
          type: "success"
        });
        // this.getData();
        this.isShow = false;
      } else {
        this.$message.error(res.message || "文件上传失败");
      }
    }
  }
};
</script>
<style scoped lang="less">
.dialog-top {
  text-align: right;
  margin-bottom: 20px;
}
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-autocomplete {
  width: 100%;
}
.upload-demo {
  display: inline-block;
}
.download {
  color: #339999;
  margin-right: 10px;
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
</style>
