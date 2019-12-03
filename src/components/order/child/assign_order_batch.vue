<template>
  <el-dialog title="批量派单提示" :visible.sync="isShow" width="500px" class="dialogWrap">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="7" style="text-align:right;">
              <i>*</i>选择服务方：
            </el-col>
            <el-col :span="14">
              <el-form-item label prop="firstServerInfo">
                <el-select
                  v-model="form.firstServerInfo"
                  value-key="id"
                  filterable
                  remote
                  placeholder="服务方"
                  :remote-method="(query)=>{
                    querySearch(query, 'organizeAll', 'remoteOneList')
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
          </el-row>
          <el-row :gutter="10" v-if="form.firstServerType == 4">
            <el-col :span="7" style="text-align:right;">选择第二服务方：</el-col>
            <el-col :span="14">
              <el-form-item label prop="secondServerId">
                <el-select
                  v-model="form.secondServerId"
                  filterable
                  remote
                  placeholder="第二服务方"
                  :remote-method="(query)=>{
                    querySearch(query, 'organizeAll', 'remoteTwoList')
                  }"
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
  getAllocationOrderInfo,
  batchAllocationOrder
} from "@/api/order/orderManage";
import { organizationListName } from "@/api/projectController/projectController";
import { Debounce } from "@/utils";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "" || value == undefined) {
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
      remoteOneList: null,
      remoteTwoList: null,
      isShowSecond: false,
      form: {
        serverScope: 1,
        firstServerInfo:null,
        firstServerId: "",
        orderIds: "",
        secondServerId: "",
        status: 0, //订单状态
      },
      rules: {
        firstServerInfo: [
          { validator: check, message: "请选择服务方", rigger: "change" }
        ]
      }
    };
  },
  mounted() {
    //this.$refs.orderForm.clearValidate();
  },
  methods: {
    init(ids) {
      this.reset();
      this.form.orderIds = ids;
      this.isShow = true;
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "organizeAll") {
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
        }
      } else {
        this[list] = [];
      }
    },
    handleSelectServer(obj) {
      if(obj){
        this.form.firstServerId = obj.id;
        this.form.firstServerType = obj.type;
      }else{
        this.form.firstServerId = "";
        this.form.firstServerType = "";
        this.form.firstServerInfo = null;
      }
    },
    submitForm: Debounce(function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          batchAllocationOrder(this.form).then(res => {
            this.isShow = false;
            this.$emit("callback");
            let sucLen = res.data.success.length;
            let errLen = res.data.error.length;
            let resTxt = `本次批量派单<strong style="color: red;">${sucLen+errLen}</strong>条，成功<strong style="color: red;">${sucLen}</strong>条，失败<strong style="color: red;">${errLen}</strong>条`
            this.$alert(resTxt, '批量结果', {
              dangerouslyUseHTMLString: true,
              callback: action => {}
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }),
    reset() {
        this.isShowSecond = false;
        this.form = {
          serverScope: 1,
          firstServerInfo:null,
          firstServerId: "",
          orderIds: "",
          secondServerId: "",
          status:0
        };
        this.$refs.orderForm && this.$refs.orderForm.resetFields();
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
