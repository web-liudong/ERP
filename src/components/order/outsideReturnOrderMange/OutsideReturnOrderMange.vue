<template>
  <div class="returnOrderBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="item,index in btnData"
        :key="index"
        :class="{btnactive:item.status==query.status}"
        @click="btnActive(item)"
      >{{item.statusName}}({{item.statusCount}})</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow">
            <i class="el-icon-arrow-down"></i>收起筛选
          </span>
          <span v-else="isShow" @click="isShow = !isShow">
            <i class="el-icon-arrow-up"></i>展开筛选
          </span>
          <el-button size="small" class="w80 h40" @click="queryResult()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="clearResult()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">创建时间：</span>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
          <span style="margin-left:20px;">订单号：</span>
          <el-input type="number" placeholder="订单号" v-model="query.orderNo" clearable></el-input>
          <span style="margin-left:20px;">客户名称：</span>
          <el-select
            v-model="query.customerId"
            filterable
            remote
            placeholder="请输入并客户名称"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in customerNameOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <br>
          <span style="margin-left:20px;">退货来源：</span>
          <el-select v-model="query.source">
            <el-option label="全部" value=""></el-option>
            <el-option label="API接口" value="API_INTERFACE"></el-option>
            <el-option label="专柜" value="COUNTER"></el-option>
          </el-select>
          <span style="margin-left:20px;">外部退货单号：</span>
          <el-input placeholder="发货单号" v-model="query.returnOrderNo" clearable></el-input>
          <span style="margin-left:20px;">外部订单号：</span>
          <el-input placeholder="退货单号" v-model="query.customerReturnOrderNo" clearable></el-input>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表
        </span>
        <el-table :data="returnData" border stripe style="width: 100%" size="small" :max-height="dataListHeight">
          <el-table-column prop="returnOrderNo" label="外部退货单编号" align="center"></el-table-column>
          <el-table-column prop="orderNo" label="关联发货单" align="center"></el-table-column>
          <el-table-column prop="customerReturnOrderNo" label="外部订单号" align="center"></el-table-column>
          <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
          <el-table-column prop="projectName" label="关联项目" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="statusText" label="退货单状态" align="center"></el-table-column>
          <el-table-column prop="amount" label="退货金额" align="center"></el-table-column>
          <el-table-column prop="sourceText" label="来源" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <div slot-scope="scope" v-if="scope.row.status == 'PROCESSED'">
              <el-button type="text" size="small" @click="returnOrderPass(scope.row)" v-if="$authorities.outSideReturnOrderAgree">同意</el-button>
              <el-button
                type="text"
                size="small"
                @click="dialogReject = !dialogReject,rejectId = scope.row.id"
                v-if="$authorities.outSideReturnOrderRefuse"
              >拒绝</el-button>
              <el-button @click="goWarehouseDetaills(scope.row)" type="text" size="small" v-if="$authorities.outSideReturnOrderDetails">详情</el-button>
            </div>
            <div slot-scope="scope" v-else-if="scope.row.status == 'RETURNING'">
              <el-button type="text" size="small" @click="returnOrderCompleted(scope.row)" v-if="$authorities.outSideReturnOrderComplete">完成</el-button>
              <el-button
                type="text"
                size="small"
                @click="dialogClose = !dialogClose ,deleteId = scope.row.id"
                v-if="$authorities.outSideReturnOrderClose"
              >关闭</el-button>
              <el-button @click="goWarehouseDetaills(scope.row)" type="text" size="small" v-if="$authorities.outSideReturnOrderDetails">详情</el-button>
            </div>
            <div slot-scope="scope" v-else>
              <el-button @click="goWarehouseDetaills(scope.row)" type="text" size="small" v-if="$authorities.outSideReturnOrderDetails">详情</el-button>
            </div>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 32px;"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogReject" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">拒绝提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          <p>是否拒绝外部退货单？</p>
          <el-form
            :model="formReason"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            :label-position="'left'"
          >
            <el-form-item label="拒绝原因：" prop="rejectReason">
              <el-input
                type="textarea"
                :rows="5"
                v-model="formReason.rejectReason"
                placeholder="1-200字以内"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReject = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogClose" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">关闭提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          <el-form
            :model="formReason"
            :rules="rules"
            ref="closeForm"
            label-width="100px"
            :label-position="'left'"
          >
            <el-form-item label="关闭原因：" prop="closeReason">
              <el-input
                type="textarea"
                :rows="5"
                v-model="formReason.closeReason"
                placeholder="1-200字以内"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose = false">取 消</el-button>
        <el-button type="primary" @click="submitCloseForm('closeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Butt from "../../common/Button/index";
import {
  getOutsideReturnOrder,
  getOutsideReturnOrderStatusCount,
  outsideReturnOrderPass,
  outsideReturnOrderReject,
  outsideReturnOrderCompleted,
  outsideReturnOrderClose
} from "@/api/order/returnOrder";

import {
  postCustomerNameOptions,
  postOrganizationOptions
} from "@/api/common/commonApi";

export default {
  inject: ["reload","isFilterShow"],
  name: "outsideReturnOrderMange",
  data() {
    return {
      formReason: {
        closeReason: "",
        rejectReason: ""
      },
      rules: {
        closeReason: [
          { required: true, message: "请输入关闭原因", trigger: "change" }
        ],
        rejectReason: [
          { required: true, message: "请输入拒绝原因", trigger: "change" }
        ]
      },
      dateValue: "",
      customerNameOptions: [],
      organizationOptions: [],
      postType: "全部",
      btnData: [],
      //查询
      query: {
        createEndTime: null,
        createStartTime: null,
        customerId: "",
        customerReturnOrderNo: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 10,
        returnOrderNo: "",
        source: "",
        status: -1
      },
      dialogClose: false,
      dialogAffirm: false,
      rejectId: "",
      deleteId: 0,
      totalPage: 0,
      returnData: null,
      dialogReject: false,
      //删选显示
      isShow: this.isFilterShow
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },

  watch: {
    //监听时间范围
    dateValue(a, b) {
      if (this.dateValue != "" && this.dateValue) {
        this.query.createStartTime = this.dateValue[0];
        this.query.createEndTime = this.dateValue[1];
      } else {
        this.query.createStartTime = null;
        this.query.createEndTime = null;
      }
    }
  },
  mounted() {
    this.getStatusCount();
    this.getOutsideReturnOrder();
  },
  activated() {
    if(this.$route.params.isUpdate){
      this.getStatusCount();
      this.getOutsideReturnOrder();
    }
  },
  methods: {
    //模糊搜索
    organizationRemoteMethod(query) {
      console.log(query);
      if (query !== "") {
        postOrganizationOptions(query)
          .then(res => {
            this.organizationOptions = res.data;
            console.log(this.organizationOptions);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.organizationOptions = [];
      }
    },
    remoteMethod(query) {
      console.log(query);
      if (query !== "") {
        postCustomerNameOptions(query)
          .then(res => {
            this.customerNameOptions = res.data;
            console.log(this.customerNameOptions);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.customerNameOptions = [];
      }
    },
    //获取各状态的数量
    getStatusCount() {
      getOutsideReturnOrderStatusCount().then(res => {
        this.btnData = res.data;
      });
    },
    //获取全部列表
    getOutsideReturnOrder() {
      //请求列表
      getOutsideReturnOrder(this.query).then(res => {
        this.returnData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    //类型按钮
    btnActive(o) {
      if (this.query.status != o.status) {
        this.query.status = o.status;
        this.query.pageNum = 1;
        this.getOutsideReturnOrder();
      }
    },
    returnOrderPass(row) {
      this.$confirm("是否确认同意退货？", "同意提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          outsideReturnOrderPass(row.id).then(res => {
            this.$message({
              message: "操作成功，通过外部退货申请",
              type: "success"
            });
            this.getStatusCount();
            this.getOutsideReturnOrder();
          });
        })
        .catch(() => {});
    },
    returnOrderCompleted(row) {
      this.$confirm("是否手动完成退货单？", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          outsideReturnOrderCompleted(row.id).then(res => {
            this.$message({
              message: "操作成功，外部退货单已完成",
              type: "success"
            });
            this.getStatusCount();
            this.getOutsideReturnOrder();
          });
        })
        .catch(() => {});
    },
    //查询结果
    queryResult() {
      this.getOutsideReturnOrder();
    },
    clearResult(){
      this.query = {
        createEndTime: null,
        createStartTime: null,
        customerId: "",
        customerReturnOrderNo: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 10,
        returnOrderNo: "",
        source: "",
        status: -1
      }
      this.getOutsideReturnOrder();
    },
    //跳转详情
    goWarehouseDetaills(row) {
      const { href } = this.$router.resolve({
        name: "outsideReturnOrderDetaills",
        query: {
          id: row.id
        }
      });
      window.open(href, "_blank");
    },

    //翻页
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getOutsideReturnOrder();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getOutsideReturnOrder();
    },
    //筛选show
    showHelp() {
      this.isShow = !this.isShow;
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          outsideReturnOrderReject(this.rejectId, {
            message: this.formReason.rejectReason
          }).then(res => {
            if (res.code == "000000") {
              this.getStatusCount();
              this.getOutsideReturnOrder();
              this.$message({
                message: "拒绝外部退货单成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "拒绝外部退货单失败",
                type: "error"
              });
            }
            this.dialogReject = false;
          });
        }
      });
    },
    submitCloseForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          outsideReturnOrderClose(this.deleteId, {
            message: this.formReason.closeReason
          }).then(res => {
            if (res.code == "000000") {
              this.getStatusCount();
              this.getOutsideReturnOrder();
              this.$message({
                message: "外部退货单已关闭",
                type: "success"
              });
            } else {
              this.$message({
                message: "外部退货单关闭失败",
                type: "error"
              });
            }
            this.dialogClose = false;
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.returnOrderBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .btnactive {
      background: #399;
      color: #fff;
      border: solid 1px #399;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
      color: #303133;
    }
    .rightBox {
      height: 48px;
      float: right;
      span {
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }
      span:hover {
        color: #303133;
      }
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 200px;
        height: 56px;
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select {
        margin-left: 10px;
        line-height: 56px;
      }
    }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    line-height: 50px;
    .listBoxTop {
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .el-button {
        width: 80px;
        height: 30px;
      }
    }
    .el-table {
      margin-top: -2px;
      span {
        font-size: 12px;
      }
      .el-button {
        font-size: 12px;
      }
    }
  }
  .block {
    margin-top: 5px;
    margin-right: 20px;
    text-align: right;
  }
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
        p {
          line-height: 40px;
          font-size: 16px;
        }
      }
      .second-step-box {
        display: flex;
        padding: 20px 0;
        align-items: center;
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
      }
      .tip {
        display: flex;
        color: red;
        line-height: 30px;
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
      border-top: 1px solid #d1d1d1;
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>