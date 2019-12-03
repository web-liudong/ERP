<template>
  <el-dialog title="批量接单" :visible.sync="isShow" width="500px" class="dialogWrap">
    <div class="list">{{sNotStaffOrder}}</div>
    <el-row  v-if="isNotStaff">
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;"><i>*</i>业务员：</el-col>
            <el-col :span="8">
              <el-form-item label prop="staffId">
                <el-select
                  v-model="form.staffId"
                  filterable
                  remote
                  placeholder="业务员"
                  :remote-method="querySearch"
                  :loading="remoteLoading"
                  @clear="clearQuery"
                  clearable
                >
                  <el-option
                    v-for="item in remoteUserList"
                    :key="item.id"
                    :label="item.userName+'-'+item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
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
import {
  getOrganizeUser,
  batchTakingAcceptOrder
} from "@/api/order/orderManage";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      remoteLoading: false,
      remoteUserList: null,
      remoteUserAllList: null,
      orderInfo: {},
      sNotStaffOrder:"",
      isNotStaff:false,
      form: {
        staffId: ""
      },
      rules: {},
      staffIdValidate:[
        { validator: check, message: "请选择业务员", rigger: "change" }
      ]
    };
  },
  mounted() {},
  methods: {
    init(o) {
      this.reset();
      this.orderInfo = o;
      this.filterData();
      this.querySearch();
      this.isShow = true;
    },
    filterData(){
      let arr = [];
      this.orderInfo.ids.forEach(order => {
        if(!order.oldStaffId){
          arr.push(order.no);
        }
      });
      if(arr.length){
        this.isNotStaff = true;
        this.rules = {};
        this.sNotStaffOrder = `当前勾选的订单中，单号${arr.join(",")}缺失业务员，如想批量接单，需对缺失业务员单据统一填写一个业务员。`
      }else{
        this.isNotStaff = false;
        this.rules["staffId"] = this.staffIdValidate;
        this.sNotStaffOrder = "确定要批量接单？";
      }
    },
    querySearch(query) {
      this.remoteLoading = true;
      getOrganizeUser({
        organizationId:this.orderInfo.firstServerId,
        realName: query,
      }).then(res => {
        if (res.data == "") {
          this.remoteUserList = [];
        } else {
          !query && (this.remoteUserAllList = res.data.slice(0));
          this.remoteUserList = res.data;
        }
        this.remoteLoading = false;
      });
    },
    clearQuery(){
      this.remoteUserList = this.remoteUserAllList;
    },
    submitForm(name) {
      if(this.isNotStaff){
        this.$refs[name].validate(valid => {
          if (valid) {
            this.batchTakingAcceptOrder();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }else{
        this.batchTakingAcceptOrder();
      }
    },
    batchTakingAcceptOrder(){
      batchTakingAcceptOrder({batchAcceptOrderItemParamList : this.orderInfo.ids, newStaffId: this.form.staffId}).then(res => {
        this.isShow = false;
        this.$emit("callback", "TakingAcceptBatch");
        this.$message({
          type: "success",
          message: res.data.resultText
        });
      });
    },
    reset() {
      this.form = {
        staffId: ""
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
