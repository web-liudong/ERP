<template>
  <el-dialog title="一键接单" :visible.sync="isShow" width="500px" class="dialogWrap">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm">
          <el-row :gutter="10">
            <el-col :span="7" style="text-align:right;">
              <i>*</i>服务方：
            </el-col>
            <el-col :span="14">
              <el-form-item label>
                <el-input v-model="form.partyBName" placeholder="服务方" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { batchAcceptOrder } from "@/api/order/orderManage";
import { organizationListName } from "@/api/projectController/projectController";
import { Debounce } from "@/utils";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      form: {
        batchAllocationAcceptOrderItemParamList: null,
        partyBName: "",
        partyBId: "",
      }
    };
  },
  mounted() {
    //this.$refs.orderForm.clearValidate();
  },
  methods: {
    init(ids) {
      this.reset();
      this.form = {
        batchAllocationAcceptOrderItemParamList: ids,
        partyBName: this.$auth.user.userPosts[0].organizationName,
        partyBId: this.$auth.user.userPosts[0].organizationId,
      };
      this.isShow = true;
    },
    submitForm: Debounce(function(name) {
      batchAcceptOrder(this.form).then(res => {
        this.isShow = false;
        this.$emit("callback");
        let sucLen = res.data.success.length;
        let errLen = res.data.error.length;
        let resTxt = `本次批量派接<strong style="color: red;">${sucLen +
          errLen}</strong>条，成功<strong style="color: red;">${sucLen}</strong>条，失败<strong style="color: red;">${errLen}</strong>条`;
        this.$alert(resTxt, "批量结果", {
          dangerouslyUseHTMLString: true,
          callback: action => {}
        });
      });
    }),
    reset() {
      this.form = {
        batchAllocationAcceptOrderItemParamList: null,
        partyBName: "",
        partyBId: "",
      };
    }
  }
};
</script>
<style scoped lang="less">
.tips {
  color: red;
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
      word-break: break-all;
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
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-select,
.el-autocomplete {
  width: 100%;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
</style>
