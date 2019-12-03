<template>
  <el-dialog :title="title" :visible.sync="isShow" width="800px" class="dialogWrap">
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>外部订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
          <th>备注订单号：</th>
          <td>{{orderInfo.memoOrderNo}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>收货人：</th>
          <td>{{orderInfo.recipientName}}-{{orderInfo.recipientPhone}}</td>
          <th>收货地址：</th>
          <td>{{orderInfo.customerReceiptAddress}}</td>
        </tr>
        <tr>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
          <th>采购人：</th>
          <td>{{orderInfo.customerUserName}}</td>
          <th>采购人联系方式：</th>
          <td>{{orderInfo.customerUserPhone}}</td>
        </tr>
        <tr>
          <th>业务员：</th>
          <td>{{orderInfo.staffName}}</td>
          <th>下单时间：</th>
          <td>{{orderInfo.createTime}}</td>
          <th>订单金额：</th>
          <td>￥{{orderInfo.amount}}</td>
        </tr>
      </table>
    </div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>服务方选择范围：
            </el-col>
            <el-col :span="18">
              <el-form-item label prop="serverScope">
                <el-radio-group v-model="form.serverScope" @change="changeRemoteType">
                  <el-radio :label="0">按匹配结果中选择服务方</el-radio>
                  <el-radio :label="1">从全部中选择服务方</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>选择服务方：
            </el-col>
            <el-col :span="7">
              <el-form-item label prop="firstServerInfo">
                <el-select
                  v-model="form.firstServerInfo"
                  value-key="id"
                  filterable
                  remote
                  placeholder="服务方"
                  :remote-method="(query)=>{
                    querySearch(query, form.serverScope == 0 ? 'organize' : 'organizeAll', 'remoteOneList')
                  }"
                  @change="handleSelectServer"
                  :loading="remoteLoading"
                  clearable
                >
                  <el-option
                    v-for="item in remoteOneList"
                    :key="item.id"
                    :label="item.label"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="text-align:right;">
              服务方服务费率：
            </el-col>
            <el-col :span="6">
              <el-form-item prop="firstServerFee">
                <el-input
                  v-model="form.firstServerFee"
                  :disabled="true"
                  placeholder="服务方服务费率"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="form.firstServerType == 4">
            <el-col :span="5" style="text-align:right;">选择第二服务方：</el-col>
            <el-col :span="7">
              <el-form-item label prop="secondServerId">
                <el-select
                  v-model="form.secondServerId"
                  filterable
                  remote
                  placeholder="第二服务方"
                  :remote-method="(query)=>{
                    querySearch(query, 'organizeAll', 'remoteTwoList')
                  }"
                  @change="handleSelectTwoServer"
                  :loading="remoteLoading"
                  clearable
                >
                  <el-option
                    v-for="item in remoteTwoList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="text-align:right;">
              第二服务方服务费：
            </el-col>
            <el-col :span="6">
              <el-form-item prop="secondServerFee">
                <el-input v-model="form.secondServerFee" :disabled="true">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              派单记录：
            </el-col>
            <el-col :span="18">
              <el-table :data="assignlist" border class="table" size="small">
                <el-table-column prop="userInfo.userFullName" label="操作者" align="center"></el-table-column>
                <el-table-column prop="operationTime" label="操作时间" align="center"></el-table-column>
                <el-table-column prop="operationDesc" label="操作描述" align="center">
                  <template slot-scope="scope">
                    <p>{{scope.row.operationDesc}}{{scope.row.description && '('+scope.row.description+')'}}</p>
                  </template>
                </el-table-column>
              </el-table>
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
  getOrganize,
  getOrganizeUser,
  getServerFee,
  getAllocationOrderInfo,
  reAllocationOrder
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
      remoteLoading: false,
      remoteCustomerList: null,
      remoteOneList: null,
      remoteOneListInit: null,
      remoteTwoList: null,
      remoteTwoUserList: null,
      title: "订单重新分派",
      orderInfo: {},
      assignlist: [], //操作记录
      firstServerList: [], //第一服务方list
      firstServerHeadList: [], //第一服务方负责人list
      isShowSecond: false,
      defaultData:{
        firstServerFee:""
      },
      form: {
        serverScope: 0,
        firstServerInfo:"",
        firstServerFee: "",
        firstServerId: "",
        firstServerName: "",
        orderId: "",
        secondServerFee: "",
        secondServerId: "",
        secondServerName: "",
        status: "", //订单状态
      },
      rules: {
        firstServerInfo: [
          { validator: check, message: "请选择服务方", rigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    //this.$refs.orderForm.clearValidate();
  },
  methods: {
    init(row) {
      this.reset();
      this.orderInfo = row;
      this.form.orderId = row.id;
      this.form.status = row.status;
      this.initData(row.id);
      this.isShow = true;
    },
    initData(id) {
      getAllocationOrderInfo(id).then(res => {
        if (!res.data){
          this.querySearchServer("", "remoteOneList");
          return false;
        } 
        Object.assign(this.form, res.data);
        this.defaultData = res.data;
        this.setSelect();
        this.assignlist = res.data.orderOperationList || [];
        delete this.form.orderOperationList;
        if (res.data.secondServerId) {
          this.isShowSecond = true;
        } else {
          this.isShowSecond = false;
          this.form.secondServerId = null;
        }
        
        this.querySearchServer("", "remoteOneList");
      });
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "organize") {
          this.querySearchServer(query, list);
        } else if (type == "organizeAll") {
          organizationListName({ name: query }).then(res => {
            this[list] = res.data.map((item, index) => {
              return {
                id: item.id,
                label: item.name,
                type: item.type
              };
            });
            this.remoteLoading = false;
          });
        } else if (type == "customer") {
          customerNameList({
            customerName: query,
            projectId: this.orderInfo.projectId
          }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    querySearchServer(query, list){
      getOrganize({
        countyId: this.orderInfo.recipientAddressCountyId,
        customerId: this.orderInfo.customerId,
        name: query,
        projectId: this.orderInfo.projectId
      }).then(res => {
        this[list] = res.data.map((item, index) => {
          return {
            id: item.id,
            label: item.name,
            type: item.type
          };
        });
        if(query == ""){
          this.remoteOneListInit = [...this[list]];
        }
        this.remoteLoading = false;
      });
    },
    changeFee(v){
      this.form.firstServerFee = this.defaultData.firstServerFee;
    },
    setSelect() {
      if (this.form.firstServerId) {
        this.form.firstServerInfo = {
          id: this.form.firstServerId,
          label: this.form.firstServerName,
          type: this.form.firstServerType
        }
        this.remoteOneList = [
          {
            id: this.form.firstServerId,
            label: this.form.firstServerName,
            type: this.form.firstServerType
          }
        ];
      } else {
        this.remoteOneList = [];
      }
      if (this.form.secondServerId) {
        this.remoteTwoList = [
          {
            id: this.form.secondServerId,
            label: this.form.secondServerName
          }
        ];
      } else {
        this.remoteTwoList = [];
      }
    },
    changeRemoteType(){
      this.firstServerList = [];
      this.form.firstServerInfo = "";
      this.remoteOneList = [];
      if(this.form.serverScope == 0){
        this.remoteOneList = [...this.remoteOneListInit];
      }
      this.handleSelectServer();
    },
    handleSelectServer(obj) {
      if (!obj) {
        this.form.firstServerFee = "";
        this.form.firstServerId = "";
        this.form.firstServerName = "";
        this.form.firstServerType = "";
        this.isShowSecond = false;
        this.form.secondServerId = "";
        this.remoteTwoList = [];
        this.remoteTwoUserList = [];
        return false;
      }else{
        this.form.firstServerId = obj.id;
        this.form.firstServerName = obj.label;
        this.form.firstServerType = obj.type;
      }
      //查询该服务方的费率
      getServerFee(this.orderInfo.projectId, obj.id).then(res => {
        this.form.firstServerFee = res.data;
      });
    },
    handleSelectTwoServer(id) {
      if (!id) {
        this.isShowSecond = false;
        this.form.secondServerFee = "";
        this.remoteTwoUserList = [];
        return false;
      }
      getServerFee(this.orderInfo.projectId, id).then(res => {
        this.isShowSecond = true;
        this.form.secondServerFee = res.data;
      });
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          reAllocationOrder(this.form).then(res => {
            this.isShow = false;
            this.$emit("callback");
            this.$message({
              type: "success",
              message: "订单重新分配成功"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reset() {
      this.assignlist = [];
      this.firstServerList = [];
      this.remoteOneListInit = [];
      (this.firstServerHeadList = []), //第一服务方负责人list
        (this.isShowSecond = false),
        
        (this.form = {
          serverScope: 0,
          firstServerInfo:"",
          firstServerFee: "",
          firstServerId: "",
          firstServerName: "",
          orderId: "",
          secondServerFee: "",
          secondServerId: "",
          secondServerName: "",
          status: "",
        });
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
.dialogWrap >>> .el-dialog__body {
  height: 50vh;
  overflow: auto;
}
</style>
