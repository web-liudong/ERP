<template>
  <el-dialog title="业务员修改" :visible.sync="isShow" width="800px" class="dialogWrap">
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>原订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
          <th>备注订单号：</th>
          <td>{{orderInfo.memoOrderNo}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
          <th>下单时间：</th>
          <td>{{orderInfo.createTime}}</td>
        </tr>
        <tr>
          <th>收货人：</th>
          <td>{{orderInfo.recipientName}}</td>
          <th>收货人联系方式：</th>
          <td>{{orderInfo.recipientPhone}}</td>
          <th>收货地址：</th>
          <td>{{orderInfo.customerReceiptAddress}}</td>
        </tr>
        <tr v-if="orderInfo.secondServerId">
          <th>分派服务方：</th>
          <td>{{orderInfo.firstServerName}}</td>
          <th>分派第二服务方：</th>
          <td colspan="3">{{orderInfo.secondServerName}}</td>
        </tr>
        <tr v-else>
          <th>分派服务方：</th>
          <td colspan="5">{{orderInfo.firstServerName}}</td>
        </tr>
      </table>
    </div>
    <el-row>
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
  modifyStaffUser
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
    var check2 = (rule, value, callback) => {
      if (this.isShowSecond && value == "") {
        return callback(new Error("请选择相关信息"));
      }
      callback();
    };
    return {
      isShow: false,
      remoteLoading: false,
      remoteUserList: null,
      // remoteUserAllList: null,
      orderInfo: {},
      form: {
        staffId: ""
      },
      rules: {
        staffId: [
          { validator: check, message: "请选择业务员", rigger: "change" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    init(o) {
      this.reset();
      this.orderInfo = o;
      // this.querySearch();
      this.initData();
      this.isShow = true;
    },
    initData(){
      if(this.orderInfo.staffId){
        this.form.staffId = this.orderInfo.staffId;
        this.remoteUserList = [{
          id:this.orderInfo.staffId,
          userName: this.orderInfo.staffName,
          realName: this.orderInfo.staffName
        }]
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
          // !query && (this.remoteUserAllList = res.data.slice(0));
          this.remoteUserList = res.data;
          // this.form.staffId = this.orderInfo.staffId;
        }
        this.remoteLoading = false;
      });
    },
    clearQuery(){
      //this.remoteUserList = this.remoteUserAllList;
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          modifyStaffUser(this.orderInfo.id,this.form.staffId,this.orderInfo.version).then(res => {
            if(res.code == "000000"){
              this.$message({
                type: "success",
                message: "修改业务员操作成功"
              });
            }else{
              this.$message({
                type: "error",
                message: res.message
              });
            }
            this.isShow = false;
            this.$emit("callback", "modifystaff");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
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
