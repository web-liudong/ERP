<template>
  <el-dialog title="送达确认" :visible.sync="isShow" width="800px" class="dialogWrap">
    <p class="tips">发货单最新配送状态：已复核（{{formatTime(initObject.deliveryTime)}}）</p>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:center;">
              <i>*</i>送达时间：
            </el-col>
            <el-col :span="16">
              <el-form-item label prop="deliveryTime">
                <el-date-picker
                  v-model="form.deliveryTime"
                  type="datetime"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="pickerOptions"
                  @change="selectPicker"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="skulist"
          border
          size="small"
          max-height="240"
          ref="multipleTable"
          @select="handleSelect"
        >
          <el-table-column prop="skuNo" label="商品编号" align="center" width="80"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="skuModel" label="规格型号" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center" width="60"></el-table-column>
          <el-table-column prop="itemQty" label="发货数量" width="100" align="center"></el-table-column>
          <el-table-column prop="receiveQty" label="实收数量" align="center" width="100"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="5" style="text-align:right;">
        <i>*</i>上传客户签收凭证：
      </el-col>
      <el-col :span="17">
        <el-upload
          class="upload-demo"
          action="/api/file-service/file/upload"
          :headers="headertoken"
          :on-change="handleChange"
          :on-error="handleError"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :data="{type:'Order_Document'}"
          name="fileName"
          :on-remove="handleRemove"
          multiple
          :file-list="fileList"
          list-type="text"
          v-loading="loading"
        >
          <el-button size="small" type="primary">上传凭证</el-button>
          <div slot="tip" class="el-upload__tip">支持jpg、png、pdf格式文件，大小不超过2M；按Ctrl可一次选多个文件进行上传</div>
        </el-upload>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getDeliveryGoodsItem,
  confirmDelivery
} from "@/api/order/invoiceOrder";
import { parseTime } from "@/utils/index";

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
      skulist: [],
      orderInfo:null,
      initObject: {},
      multipleSelection: [],
      form: {
        id: "",
        deliveryTime: "",
        receiveQtyDTOS: null,
        cargoReceiptPictureFileIds: []
      },
      rules: {
        deliveryTime: [
          {
            validator: check,
            message: "送达时间需要晚于发货单最新配送状态时间且不可超过当前时间",
            trigger: "blur"
          }
        ]
      },
      pickerOptions: null,
      uploadFile: null,
      fileList: [],
      limitDate:null,
      headertoken: { Authorization: "Bearer " + this.$auth.token }
    };
  },
  components: {},
  mounted() {
  },
  methods: {
    init(row) {
      this.orderInfo = row;
      this.reset();
      this.initData(row.id);
      this.form.id = row.id;
      this.isShow = true;
    },
    async initData(id) {
      let res = await getDeliveryGoodsItem(id);
      Object.assign(this.initObject, res.data);
      this.skulist = res.data.orderDeliveryItemDTOS;

      let t = new Date(this.initObject.deliveryTime);
      this.limitDate = new Date(t.setDate(t.getDate() - 1));
      
      this.pickerOptions = {
        disabledDate:time => {
          return (
            time.getTime() < this.limitDate.getTime()
          );
        }
      }
    },
    addNum(row) {
      if (!row.receiveQty) {
        row.receiveQty = 0;
      }
      if (row.receiveQty < row.itemQty) {
        row.receiveQty++;
        if (row.receiveQty == 1) {
          this.toggleSelection(row, true);
          this.multipleSelection.push(row);
        }
      }
    },
    reduceNum(row) {
      if (!row.receiveQty) {
        row.receiveQty = 0;
      }
      if (row.receiveQty > 0) {
        row.receiveQty--;
        if (row.receiveQty == 0) {
          this.toggleSelection(row, false);
          this.multipleSelection = this.multipleSelection.filter(item => {
            return item.skuId != row.skuId;
          });
        }
      }
    },
    toggleSelection(row, isSelect) {
      this.$refs.multipleTable.toggleRowSelection(row, isSelect);
    },
    handleSelect(selection, row) {
      if (row.returnQuantity == 0) {
        row.returnQuantity = row.itemQty;
      } else {
        row.returnQuantity = 0;
      }
      this.multipleSelection = selection;
    },
    submitForm(name) {
      // if (this.multipleSelection.length == 0) {
      //   this.$message({
      //     type: "error",
      //     message: "请设置商品实收数量"
      //   });
      //   return false;
      // }
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.fileList.length == 0) {
            this.$message({
              type: "error",
              message: "请上传客户签收凭证"
            });
            return false;
          }
          this.form.cargoReceiptPictureFileIds = this.fileList.map(item => {
            return item.response.data.id;
          });
          this.form.receiveQtyDTOS = this.skulist.map(item => {
            return {
              itemId: item.id,
              receiveQty: item.receiveQty
            };
          });
          confirmDelivery(this.orderInfo.deliveryStatus, this.form).then(res => {
            if (res.code == "000000") {
              this.closeDialog();
              this.$emit("callback", "returnOrder");
              this.$message({
                type: "success",
                message: "操作成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.message || "操作失败"
              });
            }
          });
        } else {
          console.log("error submit!!");
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(fileList);
    },
    handleRemove(file, fileList) {
      //删除文件
      this.fileList = fileList;
    },
    handleError(res, file) {
      this.loading = false;
      this.$message.error("文件上传失败");
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
    selectPicker(t){
      let curTime = new Date(t).getTime();
      if(curTime < new Date(this.initObject.deliveryTime).getTime() || curTime > Date.now()){
        this.form.deliveryTime = "";
      }
    },
    beforeUpload(file) {
      this.loading = true;
      const fileArr = file.name.split(".");
      const isPDF = fileArr[fileArr.length - 1] === "pdf";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isPng = fileArr[fileArr.length - 1] === "png";
      const isJpg = fileArr[fileArr.length - 1] === "jpg";

      if (!isPng && !isJpg && !isPDF) {
        this.$message({
          message: "上传文件只能是 pdf、png、jpg格式!",
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
    formatTime(t) {
      return parseTime(t);
    },
    closeDialog() {
      this.isShow = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: "",
        deliveryTime: "",
        receiveQtyDTOS: null,
        cargoReceiptPictureFileIds: []
      };
      this.fileList = [];
      this.$refs.orderForm && this.$refs.orderForm.resetFields();
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
.dialogWrap >>> .el-upload-list__item {
  width: 150px;
  float: left;
  margin: 0;
  padding: 10px;
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
