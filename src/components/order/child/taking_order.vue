<template>
  <el-dialog title="接单" :visible.sync="isShow" width="800px" class="dialogWrap">
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
    <el-row v-if="type == 2 || !orderInfo.secondServerId">
      <el-col v-if="orderInfo.staffId">
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;"><i>*</i>业务员：</el-col>
            <el-col :span="8">
                <el-input v-model="orderInfo.staffName" disabled></el-input>
            </el-col>
          </el-row>
      </el-col>
      <el-col v-else>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;"><i>*</i>业务员：</el-col>
            <el-col :span="8">
              <el-form-item label prop="acceptUserId">
                <!-- <el-select
                  v-model="form.acceptUserId"
                  placeholder="业务员"
                  clearable
                >
                  <el-option
                    v-for="item in remoteUserList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select> -->

                <el-select
                  v-model="form.acceptUserId"
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
      <el-button type="primary" @click="submitForm('orderForm')">接 单</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getOrganizeUser,
  setFirstAccept,
  setSecondAccept
} from "@/api/order/orderManage";
import { customerNameList, customerUserNameList } from "@/api/order/saleDown";
import { organizationListName } from "@/api/projectController/projectController";
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
      type:0,//当前身份服务方还是第二服务方
      isHaveStaff:false,
      remoteLoading: false,
      remoteUserList: null,
      remoteUserAllList: null,
      orderInfo: {},
      form: {
        acceptUserId: "",
        version:""
      },
      rules: {
        acceptUserId: [
          { validator: check, message: "请选择业务员", rigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    init(o) {
      this.reset();
      this.orderInfo = o.row;
      this.type = o.type;
      this.form.version = o.row.version;
      if((this.type == 1 && !o.row.secondServerId && !o.row.staffId) || (this.type == 2 && !o.row.staffId)){
        this.isHaveStaff = false;
        this.querySearch();
      }else{
        this.isHaveStaff = true;
        this.form.acceptUserId = o.row.staffId;
      }
      this.isShow = true;
    },
    querySearch(query) {
      this.remoteLoading = true;
      getOrganizeUser({
        organizationId:this.type == 1 ? this.orderInfo.firstServerId : this.orderInfo.secondServerId,
        realName: query,
      }).then(res => {
        if (res.data == "") {
          this.remoteUserList = [];
        } else {
          !query && (this.remoteUserAllList = res.data.slice(0));
          this.remoteUserList = res.data;
          let aa = this.remoteUserAllList
          let bb = this.remoteUserList
        }
        this.remoteLoading = false;
      });
    },
    clearQuery(){
      this.remoteUserList = this.remoteUserAllList;
    },
    submitForm(name) {
      if(this.isHaveStaff){
        this.fAccept();
        return false;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.fAccept();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fAccept(){
      let fn = this.type == 1 ? setFirstAccept : setSecondAccept;
      fn(this.orderInfo.id, this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "takingOrder");
        this.$message({
          type: "success",
          message: "接单操作成功"
        });
      });
    },
    reset() {
      this.form = {
        acceptUserId: "",
        version:""
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
