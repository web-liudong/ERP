<template>
  <div class="paymentBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active: isActive == 0}"
        @click="changeTab(0)"
      >全部 （{{countTable.allCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isActive == 1}"
        @click="changeTab(1)"
      >待收款（{{countTable.notReceivableCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isActive == 2}"
        @click="changeTab(2)"
      >已完成（{{countTable.completedCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isActive == 3}"
        @click="changeTab(3)"
      >已作废（{{countTable.invalidedCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">展开筛选</i>
          </span>
          <el-button size="small" @click="search()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox clear" v-if="isShow">
          <div class="inputBox">
            <span>订单号：</span>
            <el-input placeholder="订单号" v-model="findParam.orderNo" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>项目名称：</span>
            <el-select
              v-model="findParam.projectId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="项目名称"
              :remote-method="projectMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in searchProjects"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>客户名称：</span>
            <el-select
              v-model="findParam.customerId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="客户名称"
              :remote-method="customerMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in searchCustomers"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>所属组织机构：</span>
            <el-select
              v-model="findParam.organizationId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="所属组织机构"
              :remote-method="organizationMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in searchOrganizations"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>服务方：</span>
            <el-select
              v-model="findParam.serverId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="服务方"
              :remote-method="serverMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in searchServers"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>业务员：</span>
            <el-select
              v-model="findParam.staffId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="业务员"
              :remote-method="userListMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in searchUserList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox2">
            <span>应收账款：</span>
            <el-input placeholder="￥0.00" v-model="findParam.accountReceiveableStart" clearable></el-input>
            <i>-</i>
            <el-input placeholder="￥0.00" v-model="findParam.accountReceiveableEnd" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>创建时间范围：</span>
            <el-date-picker
              v-model="dataTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class="inputBox">
            <span>认款时间范围：</span>
            <el-date-picker
              v-model="claimAccountTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表
          <span
            style="color:red"
          >应收账款总额：￥{{accountReceiveableTotalText?accountReceiveableTotalText:0}}</span>
          <span style="color:red">已收账款总额：￥{{amountReceivedTotalText?amountReceivedTotalText:0}}</span>
        </span>
        <div class="rightBox">
          <div
            class="white-btn fun-btn"
            @click="exportReceivable()"
            v-if="$authorities.ServerReceivableExpot"
          >
            <i class="iconfont icondaochu"></i>导出
          </div>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData"
          :max-height="dataListHeight"
          stripe
          style="width: 100%"
          border
          :span-method="arraySpanMethod"
        >
          <el-table-column prop="orderNo" label="订单号" align="center" width="150" fixed>
            <template slot-scope="scope">
              <el-button
                @click="oepnWin('OrderDetail',{ id: scope.row.orderId })"
                type="text"
                size="small"
              >{{scope.row.orderNo}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="序号" align="center" prop="tagindex" fixed></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizationName" label="付款方" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="customerName" label="客户名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderAmountText" label="订单金额" align="center"></el-table-column>
          <el-table-column prop="billAmountText" label="结算金额" align="center"></el-table-column>
          <el-table-column prop="settledAmountText" label="已结算金额" align="center" width="100"></el-table-column>
          <el-table-column
            prop="totalAccountReceiveableText"
            label="已认总账款"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column prop="dateClaimAmountText" label="指定日期内已认总账款" align="center" width="180"></el-table-column>
          <el-table-column prop="amountReceivedText" label="已收总账款" align="center" width="100"></el-table-column>
          <el-table-column prop="accountReceiveableText" label="应收总账款" align="center" width="100"></el-table-column>
          <el-table-column
            prop="serverAccountInfo"
            label="收款账号信息"
            align="center"
            width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="claimAmountText" label="已认账款" align="center"></el-table-column>
          <el-table-column
            prop="serverDateClaimAmountText"
            label="指定日期内已认账款"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column prop="serverAccountReceiveableText" label="已收账款" align="center"></el-table-column>
          <el-table-column prop="serverAccountNoReceiveableText" label="待收账款" align="center"></el-table-column>
          <el-table-column prop="statusText" label="状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="oepnWin('ServerReceivableDetail',{ id: scope.row.id })"
                v-if="$authorities.ServerReceivableDetails"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="findParam.pageNum"
        :page-size="findParam.pageSize"
        :page-sizes="[10,20,30,40,50,100,500]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getCount,
  getAll,
  getPending,
  getCompleted,
  getInvalided,
  selectProject,
  selectCustomer,
  selectOrganization,
  selectServer,
  exportAll,
  exportCompleted,
  exportInvalided,
  exportPending,
  receiveNoCount,
  receiveInvalidedCount,
  receiveCompleteCount,
  receiveAllCount,
  userList
} from "@/api/finance/serverReceivable";
import { downloadFile } from "@/utils/index.js";
export default {
  inject: ["reload", "isFilterShow"],
  name: "ServerReceivable",
  data() {
    return {
      dialogVisible: false,
      isActive: 0,
      countTable: [],
      tableData: [],
      isShow: this.isFilterShow,
      loading: false,
      total: 0,

      findParam: {
        staffId: null,
        accountReceiveableEnd: null,
        accountReceiveableStart: null,
        claimAccountTimeStart: null,
        claimAccountTimeEnd: null,
        createTimeEnd: null,
        createTimeStart: null,
        customerId: null,
        orderNo: null,
        organizationId: null,
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        serverId: null
      },

      //模糊查询
      searchProjects: [],
      searchCustomers: [],
      searchOrganizations: [],
      searchServers: [],
      searchUserList: [],
      dataTime: "",
      claimAccountTime: "",

      //账款金额
      accountReceiveableTotalText: "",
      amountReceivedTotalText: "",

      resultArr: [],
      hoverOrderArr: [],

      spanArr: [],
      position: 0,
      realName: "",
      manageID: ""
    };
  },
  created() {
    this.count();
    this.changeTab(this.isActive);
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    userListMethod(query) {
      if (query !== "") {
        this.loading = true;
        userList({ userName: query }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.searchUserList = res.data;
            console.log(this.searchUserList);
          }
        });
      } else {
        this.searchUserList = [];
      }
    },
    reset() {
      this.findParam.staffId = null;
      this.findParam.accountReceiveableEnd = null;
      this.findParam.accountReceiveableStart = null;
      this.dataTime = null;
      this.findParam.createTimeEnd = null;
      this.findParam.createTimeStart = null;
      this.claimAccountTime = null;
      this.findParam.claimAccountTimeStart = null;
      this.findParam.claimAccountTimeEnd = null;
      this.findParam.customerId = null;
      this.findParam.orderNo = null;
      this.findParam.organizationId = null;
      this.findParam.pageNum = 1;
      this.findParam.pageSize = 10;
      this.findParam.projectId = null;
      this.findParam.serverId = null;
      this.changeBtn(this.isActive);
    },
    getOrderNumber() {
      let OrderObj = {};
      console.log(this.tableData, "opop");
      this.tableData.forEach((item, index) => {
        item.rowIndex = index;
        if (OrderObj[item.orderNo]) {
          OrderObj[item.orderNo].push(index);
        } else {
          OrderObj[item.orderNo] = [];
          OrderObj[item.orderNo].push(index);
        }
      });
      console.log(OrderObj, "0000");
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.resultArr.push(OrderObj[k]);
        }
      }
      console.log(this.resultArr, "888");
    },
    // 合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex !== 1 &&
        columnIndex !== 14 &&
        columnIndex !== 15 &&
        columnIndex !== 16
      ) {
        for (let i = 0; i < this.resultArr.length; i++) {
          let element = this.resultArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    combinData() {
      let temp = {},
        row = 0,
        col = 0;
      this.tableData.forEach(item => {
        if (!temp[item.orderNo]) {
          row++;
          temp[item.orderNo] = 1;
          col = 0;
        }
        col++;
        item.tagindex = row + "-" + col;
      });
    },
    //根据状态获取账款数量
    count() {
      getCount().then(res => {
        if (res.code == "000000") {
          this.countTable = res.data;
        }
      });
    },
    changeTab(index) {
      this.isActive = index;
      this.changeBtn(index);
      this.count();
    },
    changeBtn(index) {
      this.findParam.createTimeStart = this.dataTime ? this.dataTime[0] : null;
      this.findParam.createTimeEnd = this.dataTime ? this.dataTime[1] : null;
      this.findParam.claimAccountTimeStart = this.claimAccountTime
        ? this.claimAccountTime[0]
        : null;
      this.findParam.claimAccountTimeEnd = this.claimAccountTime
        ? this.claimAccountTime[1]
        : null;
      this.findParam.orderNo =
        this.findParam.orderNo == "" ? null : this.findParam.orderNo;
      console.log(this.findParam, "00000");
      //获取全部列表
      if (index == 0) {
        getAll(this.findParam).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.combinData();
            this.resultArr = [];
            this.getOrderNumber();
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
        console.log(this.findParam, "9090");
        receiveAllCount(this.findParam).then(res => {
          if (res.code == "000000") {
            this.accountReceiveableTotalText =
              res.data.accountReceiveableTotalText;
            this.amountReceivedTotalText = res.data.amountReceivedTotalText;
          }
        });
      }
      //获取待收款列表
      if (index == 1) {
        getPending(this.findParam).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.combinData();
            this.resultArr = [];
            this.getOrderNumber();
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
        receiveNoCount(this.findParam).then(res => {
          if (res.code == "000000") {
            this.accountReceiveableTotalText =
              res.data.accountReceiveableTotalText;
            this.amountReceivedTotalText = res.data.amountReceivedTotalText;
          }
        });
      }
      //获取已完成列表
      if (index == 2) {
        getCompleted(this.findParam).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.combinData();
            this.resultArr = [];
            this.getOrderNumber();
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
        receiveCompleteCount(this.findParam).then(res => {
          if (res.code == "000000") {
            this.accountReceiveableTotalText =
              res.data.accountReceiveableTotalText;
            this.amountReceivedTotalText = res.data.amountReceivedTotalText;
          }
        });
      }
      //获取已作废列表
      if (index == 3) {
        getInvalided(this.findParam).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.combinData();
            this.resultArr = [];
            this.getOrderNumber();
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
        receiveInvalidedCount(this.findParam).then(res => {
          if (res.code == "000000") {
            this.accountReceiveableTotalText =
              res.data.accountReceiveableTotalText;
            this.amountReceivedTotalText = res.data.amountReceivedTotalText;
          }
        });
      }
    },
    //查询按钮
    search() {
      this.findParam.pageNum = 1;
      this.changeTab(this.isActive);
    },
    //项目模糊查询
    projectMethod(query) {
      if (query !== "") {
        this.loading = true;
        selectProject({
          name: query
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.searchProjects = res.data;
          }
        });
      } else {
        this.searchProjects = [];
      }
    },
    //客户名称模糊查询
    customerMethod(query) {
      if (query !== "") {
        this.loading = true;
        selectCustomer({
          name: query
        }).then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.code == "000000") {
            this.searchCustomers = res.data;
          }
        });
      } else {
        this.searchCustomers = [];
      }
    },
    //所属组织机构模糊查询
    organizationMethod(query) {
      if (query !== "") {
        this.loading = true;
        selectOrganization({
          name: query
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.searchOrganizations = res.data;
          }
        });
      } else {
        this.searchOrganizations = [];
      }
    },
    //服务方模糊查询
    serverMethod(query) {
      if (query !== "") {
        this.loading = true;
        selectServer({
          name: query
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            console.log("0000", res);
            this.searchServers = res.data;
          }
        });
      } else {
        this.searchServers = [];
      }
    },
    //分页跳转
    handleCurrentChange(val) {
      this.findParam.pageNum = val;
      this.changeBtn(this.isActive);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findParam.pageSize = val;
      this.changeBtn(this.isActive);
    },
    oepnWin(name, query) {
      this.$router.push({
        name: name,
        query: query
      });
    },
    //导出
    exportReceivable() {
      this.findParam.createTimeStart = this.dataTime ? this.dataTime[0] : null;
      this.findParam.createTimeEnd = this.dataTime ? this.dataTime[1] : null;
      this.findParam.claimAccountTimeStart = this.claimAccountTime
        ? this.claimAccountTime[0]
        : null;
      this.findParam.claimAccountTimeEnd = this.claimAccountTime
        ? this.claimAccountTime[1]
        : null;
      console.log(this.findParam);
      if (this.isActive == 0) {
        exportAll(this.findParam).then(res => {
          console.log(res);
          // if (res.code != "000000") {
          //   this.$message({
          //     message: "导出失败",
          //     type: "warning"
          //   });
          // } else {
          //   this.downfile(res);
          // }
          this.downfile(res);
        });
      }
      if (this.isActive == 1) {
        exportPending(this.findParam).then(res => {
          console.log(res);
          // if (res.code != "000000") {
          //   this.$message({
          //     message: "导出失败",
          //     type: "warning"
          //   });
          // } else {
          //   console.log(res.data);
          //   this.downfile(res);
          // }
          this.downfile(res);
        });
      }
      if (this.isActive == 2) {
        exportCompleted(this.findParam).then(res => {
          console.log(res);
          // if (res.code != "000000") {
          //   this.$message({
          //     message: "导出失败",
          //     type: "warning"
          //   });
          // } else {
          //   this.downfile(res);
          // }
          this.downfile(res);
        });
      }
      if (this.isActive == 3) {
        exportInvalided(this.findParam).then(res => {
          console.log(res);
          // if (res.code != "000000") {
          //   this.$message({
          //     message: "导出失败",
          //     type: "warning"
          //   });
          // } else {
          //   this.downfile(res);
          // }
          this.downfile(res);
        });
      }
    },
    downfile(res) {
      // let href =
      //   "/api/file-service/file/download?id=" +
      //   id +
      //   "&access_token=" +
      //   this.$auth.token;
      // window.open(href, "_blank");
      downloadFile(res);
    }
  }
};
</script>

<style lang='less' scoped>
.paymentBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
    }
  }
  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 0 0 10px;
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      overflow: hidden;
      height: 45px;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 5px 0 5px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      .inputBox {
        float: left;
        margin: 10px;
      }
      .el-input {
        width: 180px;
        margin-left: 10px;
      }
      .el-select {
        width: 180px;
      }
      .inputBox2 {
        float: left;
        margin: 10px;
        .el-input {
          width: 100px;
          margin-left: 10px;
        }
      }
    }
  }
  .listBox {
    background: #f3f3f3;
    .listBoxTop {
      height: 50px;
      line-height: 50px;
      border: 1px solid #e4e4e4;
      .rightBox {
        float: right;
        margin-right: 20px;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  .block {
    margin-top: 2px;
    float: right;
  }
}
</style>
<style lang='less' scoped>
.paymentBox {
  .listBox {
    .el-dialog__header {
      font-weight: 800;
      background: #e4e4e4;
    }
    .el-dialog__body {
      border-bottom: 1px solid #e4e4e4;
      font-size: 18px;
      line-height: 40px;
      height: 40px;
      padding: 20px 50px 50px;
    }
  }
}
</style>
