<template>
  <div class="returnOrderBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="item,index in btnData"
        :key="index"
        :class="{btnactive:index==active}"
        @click="btnActive(index,item.statusName)"
      >{{item.statusName}}({{item.count}})</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="font-size: 14px">
            <i class="el-icon-arrow-up"></i>收起筛选
          </span>
          <span v-else @click="isShow = !isShow" style="font-size: 14px;">
            <i class="el-icon-arrow-down"></i>展开筛选
          </span>
          <el-button size="small" class="w80 h40" @click="queryResult()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <ul class="homeText">
            <li style="display:flex;">
              <div class="time-box1">
                <span style="margin-left:20px;">创建时间：</span>
                <el-date-picker
                  v-model="dateValue"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </div>
              <div class="time-box">
                <span style="margin-left:20px;">订单号：</span>
                <el-input type="number" placeholder="订单号" v-model="query.orderNo" clearable></el-input>
              </div>
              <div class="time-box">
                <span style="margin-left:20px;">客户名称：</span>
                <el-select
                  v-model="query.customerName"
                  clearable
                  filterable
                  remote
                  placeholder="请输入客户名称"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in customerNameOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </div>
            </li>
            <li style="display:flex;">
              <div class="time-box">
                <span>发货单号：</span>
                <el-input placeholder="发货单号" v-model="query.orderDeliveryNo" clearable></el-input>
              </div>
              <div class="time-box" style="margin-left: 9%">
                <span style="margin-left:20px;">退货单号：</span>
                <el-input placeholder="退货单号" v-model="query.returnOrderNo" clearable></el-input>
              </div>
              <div class="time-box">
                <span style="margin-left:20px;">服务方：</span>
                <el-select
                  v-model="query.serviceId"
                  clearable
                  filterable
                  remote
                  placeholder="服务方"
                  :remote-method="organizationRemoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in organizationOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </li>
          </ul>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>&nbsp;数据列表
        </span>
        <div class="listBoxRight"></div>
        <el-table
          :data="returnData.items"
          :max-height="dataListHeight"
          border
          stripe
          style="width: 100%"
          size="small"
        >
          <el-table-column prop="returnOrderNo" label="退货单编号" align="center"></el-table-column>
          <el-table-column prop="orderDeliveryNo" label="关联发货单" align="center"></el-table-column>
          <el-table-column width="150" label="关联订单号" align="center">
            <template slot-scope="scope">
              <el-button
                @click="oepnWin('OrderDetail',{ id: scope.row.orderId})"
                type="text"
                size="small"
                v-if="scope.row.orderId != null"
              >{{scope.row.orderNo}}</el-button>
              <el-button type="text" size="small" v-else>{{scope.row.orderNo}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="客户名称"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template slot-scope="scope">{{scope.row.createTime | formatDate}}</template>
          </el-table-column>
          <el-table-column prop="statusText" label="退货单状态" align="center"></el-table-column>
          <el-table-column prop="returnAmount" label="退货金额" align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.returnAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="returnOrderTypeText" label="退货单类型" align="center"></el-table-column>
          <el-table-column prop="returnWayText" label="退货方式" align="center"></el-table-column>
          <el-table-column
            prop="firstServerName"
            label="服务方"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="secondServerName"
            label="第二服务方"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-show="$authorities.ReturnOrderConfirm"
                v-if="scope.row.statusText == '待确认'"
                @click="dialogAffirm = !dialogAffirm ,deleteId = scope.row.id ,returnWay = scope.row.returnWay "
              >确认</el-button>
              <el-button
                type="text"
                size="small"
                v-show="$authorities.ReturnOrderComplete"
                v-if="scope.row.statusText == '退货中'&&scope.row.returnWay == 'RETURN_FACTORY'"
                @click="dialogSucce = !dialogSucce ,deleteId = scope.row.id"
              >完成</el-button>
              <el-button
                type="text"
                size="small"
                v-show="$authorities.ReturnOrderClose"
                v-if="scope.row.statusText!='已关闭'
                         &&scope.row.statusText!='已完成'
                         &&scope.row.returnOrderTypeText!='实收差额' 
                         &&(scope.row.returnWay == 'RETURN_FACTORY'||scope.row.statusText=='待确认')"
                @click=" deleteId = scope.row.id ,dialogClose = true"
              >关闭</el-button>
              <el-button
                @click="goWarehouseDetaills(scope.row)"
                v-show="$authorities.ReturnOrderDetaills"
                type="text"
                size="small"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogClose" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">关闭提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          <el-form :model="formReason" :rules="rules" ref="ruleForm" label-width="102px">
            <el-form-item label="关闭原因：" prop="closeReason">
              <el-input type="textarea" v-model="formReason.closeReason" placeholder="请输入200字符以内"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAffirm" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">确认提示</span>
      </div>
      <div class="message-box" v-if="returnWay == 'RETURN_WAREHOUSE'">
        <div class="first-step-box">确认退货单后，退货单将发给仓库进行退货操作。</div>
      </div>
      <div class="message-box" v-if="returnWay == 'RETURN_FACTORY' ">
        <div class="first-step-box">确认退货单后，退货单将进入退货中状态，请确认已于厂家协调完毕。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAffirm = false">取 消</el-button>
        <el-button type="primary" @click="dialogAffirm=false,putReturnOrderConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogSucce" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">完成提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">是否手动完成退货单？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSucce = false">取 消</el-button>
        <el-button type="primary" @click="dialogSucce=false,putReturnOrderComplete()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Butt from "../../common/Button/index";
import {
  getReturnOrderStatusCount,
  getReturnOrderDetaills,
  putReturnOrderClose,
  putReturnOrderComplete,
  putReturnOrderConfirm,
  postReturnOrderClosedList,
  postReturnOrderCompletedList,
  postReturnOrderList,
  postReturnOrderPendingReturnedList,
  postReturnOrderPendingConfirmedList,
  postReturnOrderReturningList
} from "@/api/order/returnOrder";

import {
  postCustomerNameOptions,
  postOrganizationOptions
} from "@/api/common/commonApi";

export default {
  inject: ["reload"],
  name: "returnOrderMange",
  data() {
    return {
      returnWay:'',
      form: {},

      formReason: {
        closeReason: ""
      },
      rules: {
        closeReason: [
          { required: true, message: "请输入关闭原因", trigger: "change" },
          { min: 1, max: 200, message: "请输入200字符以内", trigger: "blur" }
        ]
      },
      dateValue: "",
      customerNameOptions: [],
      organizationOptions: [],
      postType: "全部",
      btnData: [
        {
          sum: 100,
          statusName: "全部"
        },
        {
          sum: 200,
          statusName: "待确认"
        },
        {
          sum: 300,
          statusName: "待退货"
        },
        {
          sum: 400,
          statusName: "退货中"
        },
        {
          sum: 400,
          statusName: "已完成"
        },
        {
          sum: 400,
          statusName: "已关闭"
        }
      ],
      typeOptions: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "CUSTOMER",
          label: "客户"
        },
        {
          value: "SERVER ",
          label: "服务商"
        }
      ],
      //查询
      query: {
        customerId: null,
        returnOrderNo: null,
        id: null,
        orderId: null,
        orderNo: null,
        serviceId: null,
        source: null,
        endDate: null,
        startDate: null,
        orderDeliveryNo: null,
        pageNum: 1,
        pageSize: 10
      },
      dialogClose: false,
      dialogAffirm: false,
      dialogSucce: false,
      deleteId: 0,

      returnData: {
        items: [],
        offset: 0,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      //btn选中
      active: 0,
      //btn数据
      //删选显示
      isShow: true,
      //翻页
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px"
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },

  watch: {
    //监听时间范围
    dateValue(a, b) {
      if (this.dateValue != "" && this.dateValue) {
        this.query.startDate = this.dateValue[0];
        this.query.endDate = this.dateValue[1];
      } else {
        this.query.startDate = null;
        this.query.endDate = null;
      }
    }
  },
  mounted() {
    this.query.orderNo = this.$route.query.orderNo;
    this.postList();
    this.getReturnOrderStatusCount();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.postList();
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
    //判断是否对接wms
    judgeWMS(val) {
      if (!val) {
        this.dialogClose = true;
      } else {
        this.$confirm("当前退货单不可关闭请关闭相关对账单再重新关闭", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
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
    getReturnOrderStatusCount() {
      getReturnOrderStatusCount()
        .then(res => {
          console.log(res);
          this.btnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //判断类型请求数据
    postList() {
      switch (this.postType) {
        case "全部":
          this.postReturnOrderList(this.query);
          break;
        case "待确认":
          this.postReturnOrderPendingConfirmedList(this.query);
          break;
        case "待退货":
          this.postReturnOrderPendingReturnedList(this.query);
          break;
        case "退货中":
          this.postReturnOrderReturningList(this.query);
          break;
        case "已完成":
          this.postReturnOrderCompletedList(this.query);
          break;
        case "已关闭":
          this.postReturnOrderClosedList(this.query);
          break;
        default:
      }
    },
    //获取全部列表
    postReturnOrderList(data) {
      //请求列表
      postReturnOrderList(data)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取已关闭列表
    postReturnOrderClosedList(data) {
      //请求列表
      postReturnOrderClosedList(data)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取已完成列表
    postReturnOrderCompletedList(data) {
      //请求列表
      postReturnOrderCompletedList(data)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取待退货列表
    postReturnOrderPendingReturnedList(data) {
      //请求列表
      postReturnOrderPendingReturnedList(data)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取待确认列表
    postReturnOrderPendingConfirmedList(data) {
      //请求列表
      postReturnOrderPendingConfirmedList(data)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取已退货中列表
    postReturnOrderReturningList(data) {
      //请求列表
      postReturnOrderReturningList(data)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //类型按钮
    btnActive(index, typename) {
      this.postType = typename;
      if (this.active != index) {
        this.query.pageNum = 1;
        this.postList();
      }
      this.active = index;
    },
    //确认
    putReturnOrderConfirm() {
      putReturnOrderConfirm(this.deleteId)
        .then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "确认成功",
              type: "success"
            });
            this.dialogClose = false;
            this.postList();
            this.getReturnOrderStatusCount();
          } else if (res.data == "0") {
            this.$message({
              message: "确认失败",
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //关闭
    putReturnOrderClose() {
      this.form.closeReason = this.formReason.closeReason;
      putReturnOrderClose(this.deleteId, this.form)
        .then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "关闭成功",
              type: "success"
            });
            this.dialogClose = false;
            this.postList();
            this.getReturnOrderStatusCount();
          } else {
            this.$message({
              message: "关闭失败",
              type: "warning"
            });
            this.dialogClose = false;
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //完成
    putReturnOrderComplete() {
      putReturnOrderComplete(this.deleteId)
        .then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "执行成功",
              type: "success"
            });
            this.dialogSucce = false;
            this.postList();
            this.getReturnOrderStatusCount();
          } else {
            this.$message({
              message: "执行失败",
              type: "warning"
            });
            this.dialogSucce = false;
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查询结果
    queryResult() {
      console.log(this.query);
      this.postList();
    },
    //重置
    goReset() {
      this.dateValue = "";
      this.query.orderNo = "";
      this.query.customerName = "";
      this.query.orderDeliveryNo = "";
      this.query.returnOrderNo = "";
      this.query.serviceId = "";
      this.postList();
    },
    //跳转详情
    goWarehouseDetaills(row) {
      // console.log(row.id);
      // const {href} = this.$router.resolve({
      //   name: 'returnOrderDetaills',
      //   query: {
      //     id: row.id,
      //     orderNo:row.orderNo
      //   }
      // });
      // window.open(href, '_blank')
      this.$router.push({
        path: "/order/returnordermange/returnorderdetaills",
        query: { id: row.id, orderNo: row.orderNo }
      });
    },

    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.pageSize = val;
      this.query.pageNum = 1;
      this.postList();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      console.log(`当前页: ${val}`);
      this.postList();
    },
    //筛选show
    showHelp() {
      this.isShow = !this.isShow;
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.addData);
          this.putReturnOrderClose();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    oepnWin(name, query) {
      if (this.$authorities.OrderDetails) {
        // let routeData = this.$router.resolve({
        //   name: name,
        //   query: query
        // });
        // window.open(routeData.href, "_blank");
        this.$router.push({ path: "/order/orderDetail", query });
      }
    }
  },
  filters: {
    //时间截取字符串
    formatDate: function(val) {
      var dateee = new Date(val).toJSON();
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
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
    .el-button {
      width: 160px;
      height: 30px;
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
        color: #333;
        cursor: pointer;
        font-size: 12px;
      }
      span:hover {
        color: #333;
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
      .homeText {
        margin-left: 20px;
        span {
          width: 120px;
          text-align: right;
        }
        .el-input {
          width: 200px;
          height: 50px;
          line-height: 56px;
        }
        .time-box {
          width: 25%;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            width: 120px;
            text-align: right;
          }
          .el-input {
            width: 200px;
            height: 50px;
            line-height: 56px;
          }
        }
        .time-box1 {
          width: 34%;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .el-select {
          width: 200px;
          line-height: 56px;
        }
      }
      /*.el-input {*/
      /*width: 200px;*/
      /*height: 56px;*/
      /*line-height: 56px;*/
      /*margin-left: 10px;*/
      /*}*/
      /*.el-select {*/
      /*margin-left: 10px;*/
      /*line-height: 56px;*/
      /*}*/
    }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 10px 0 0 0;
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
    margin: 3px 10px;
    display: flex;
    justify-content: flex-end;
    height: 30px;
  }
}
</style>
