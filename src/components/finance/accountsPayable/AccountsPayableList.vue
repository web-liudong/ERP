<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:orderStatus==0}"
        @click="switchStatus(0)"
      >全部（{{activeList&&activeList.allCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:orderStatus==1}"
        @click="switchStatus(1)"
      >未回款（{{activeList&&activeList.notReceivableCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:orderStatus==2}"
        @click="switchStatus(2)"
      >已回款（{{activeList&&activeList.receivableCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:orderStatus==3}"
        @click="switchStatus(3)"
      >已完成（{{activeList&&activeList.completedCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:orderStatus==4}"
        @click="switchStatus(4)"
      >已作废（{{activeList&&activeList.invalidedCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer;margin-right:10px">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            <span style="font-size: 14px; color: #333">{{isShow?screenGoods:screenBrand}}</span>
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>订单号：</span>
            <el-input placeholder="订单号" v-model="query.orderNo" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>项目名称：</span>
            <el-select
              v-model="query.projectId"
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
              v-model="query.customerId"
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
              v-model="query.organizationId"
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
              v-model="query.serverId"
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
            <span>应收账款：</span>
            <el-input
              placeholder="￥0.00"
              v-model="query.accountPayableStart"
              clearable
              style="width:23%"
            ></el-input>
            <i>-</i>
            <el-input
              placeholder="￥0.00"
              v-model="query.accountPayableEnd"
              clearable
              style="width:23%"
            ></el-input>
          </div>
          <div class="inputBox">
            <span>创建时间范围：</span>
            <el-date-picker v-model="query.createTimeStart" type="date" placeholder="开始日期"></el-date-picker>
            <el-date-picker v-model="query.createTimeEnd" type="date" placeholder="结束日期"></el-date-picker>
          </div>
          <div class="inputBox">
            <span>认款时间范围：</span>
            <el-date-picker v-model="query.claimAccountTimeStart" type="date" placeholder="开始日期"></el-date-picker>
            <el-date-picker v-model="query.claimAccountTimeEnd" type="date" placeholder="结束日期"></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left" style="display:flex;flex:1">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
          <span style="color:red;margin-left:15px;">应付账款总额：￥{{accountPayableTotalText}}</span>
          <span style="color:red">已付账款总额：￥{{amountPayableTotalText}}</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="downLoad()" v-if="$authorities.AccountsPayableExport">
            <i class="icondaochu iconfont button-head-icon icon-plane"></i>导出
          </div>
          <div
            class="button-head"
            style="width:120px"
            @click="showDialog('importFile')"
            v-if="(orderStatus!==0&&orderStatus!==3&&orderStatus!==4)&&$authorities.AccountsPayableImport"
          >
            <i class="icondaoru iconfont button-head-icon icon-add"></i>导入付款信息
          </div>
          <div
            class="button-head"
            @click="oepnWin('SysImportRecord',{type:'finance-accountsPayable-import-list'})"
            v-if="(orderStatus!==0&&orderStatus!==3&&orderStatus!==4)&&$authorities.AccountsPayableImportRecord"
          >
            <i class="icondingdanguanli iconfont button-head-icon icon-add"></i>导入记录
          </div>
          <div
            class="button-head"
            @click="payment('checkedAccountsPayable')"
            v-if="(orderStatus!==0&&orderStatus!==3&&orderStatus!==4)&&$authorities.AccountsPayablePay"
          >
            <i class="iconhuikuanxinxi iconfont button-head-icon icon-add"></i>付款
          </div>
          <div
            class="button-head"
            @click="oepnWin('SysPaymentRecord',{type:'payment-record'})"
            v-if="(orderStatus!==0&&orderStatus!==3&&orderStatus!==4)&&$authorities.AccountsPayablePayRecord"
          >
            <i class="icondingdanguanli iconfont button-head-icon icon-add"></i>付款记录
          </div>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      :max-height="dataListHeight"
      style="width: 100%"
      size="small"
      :span-method="arraySpanMethod"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
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
      <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="organizationName" label="所属组织机构" align="center" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="serverName" label="服务方" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderAmountText" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="billAmountText" label="结算金额" align="center"></el-table-column>
      <el-table-column prop="settledAmountText" label="已结算金额" align="center" width="120"></el-table-column>
      <el-table-column prop="amountInvoicedText" label="已开票金额" align="center" width="120"></el-table-column>
      <el-table-column prop="amountReceivedText" label="已收总账款" align="center" width="120"></el-table-column>
      <el-table-column prop="dateClaimAmountText" label="指定日期内已认总账款" align="center" width="170"></el-table-column>
      <el-table-column prop="totalAccountPaidText" label="已付总账款" align="center" width="120"></el-table-column>
      <el-table-column prop="accountPayableText" label="应付总账款" align="center" width="120"></el-table-column>
      <el-table-column prop="serverAccountInfo" label="服务方收款账号信息" align="center" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column prop="claimAmountText" label="已收账款" align="center"></el-table-column>
      <el-table-column prop="serverDateClaimAmountText" label="指定日期内已认账款" align="center" width="170"></el-table-column>
      <el-table-column prop="serverPayAmountText" label="已付账款" align="center"></el-table-column>
      <el-table-column prop="serverNoPayAmountText" label="已认款未支付账款" align="center" width="170"></el-table-column>
      <el-table-column prop="statusText" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('AccountsPayableDetail',{'id':scope.row.id})"
            type="text"
            size="small"
            v-if="$authorities.AccountsPayableDetail"
          >详情</el-button>
          <el-button
            @click="closeList(scope.row)"
            type="text"
            size="small"
            v-if="$authorities.AccountsPayableClose &&scope.row.statusText !== '已完成'"
          >关闭</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="query.pageSize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalPage"
        background
      ></el-pagination>
    </div>
    <checkedAccountsPayable ref="checkedAccountsPayable" @dialogCallback="dialogCallback"></checkedAccountsPayable>
    <importFile
      :title="'付款信息导入'"
      :type="importType"
      ref="importFile"
      @dialogCallBackPayment="dialogCallBackPayment"
    ></importFile>
  </div>
</template>
<script>
import {
  getAllList,
  getCompletedList,
  getInvalidList,
  getNoRefundList,
  getPassRefundList,
  getAccountsPayableCount,
  closeAccountspayable,
  paymentPageInit,
  getTotalPayment,
  getTotalPaymentCompleted,
  getTotalPaymentInvalid,
  getTotalPaymentUnpaid,
  getTotalPaymentPaid,
  exportUnpaid,
  exportPaid,
  exportFailure,
  exportCompleted,
  exportPayment,
  downFile,
  selectProject,
  selectCustomer,
  selectOrganization,
  selectServer
} from "@/api/finance/accountsPayable.js";
import checkedAccountsPayable from "../child/checked_accountspayable";
import importFile from "@/components/common/module/ImportFile";
import { downloadFile } from "@/utils/index.js";
import { get } from "http";
export default {
  inject: ["reload", "isFilterShow"],
  name: "AccountsPayableList",
  data() {
    return {
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      orderStatus: 0, //选择的订单list状态
      activeList: null,
      remoteLoading: false, //筛选查询loading
      importType: "finance-accountsPayable-import",
      multipleSelection: [], //选中的序号,
      amountPayableTotalText: "",
      accountPayableTotalText: "",
      query: {
        accountPayableEnd: null, //应付账款结束值
        accountPayableStart: null, //应付账款起始值
        createTimeStart: "", //开始时间
        createTimeEnd: "", //结束时间
        customerId: null, //客户id
        orderNo: "", //订单号
        organizationId: null, //开票方id
        projectId: null, //项目id
        serverId: null, //服务方id
        pageNum: 1,
        pageSize: 10,
        claimAccountTimeEnd: null, //收款结束时间
        claimAccountTimeStart: null //收款开始时间
      },
      tableData: [],
      totalPage: 0,
      loading: false,

      //模糊查询
      searchProjects: [],
      searchCustomers: [],
      searchOrganizations: [],
      searchServers: [],
      dataTime: "",
      spanArr: [],
      position: 0,
      a: 1,
      b: 1,

      resultArr: [],
      hoverOrderArr: []
    };
  },
  components: {
    checkedAccountsPayable,
    importFile
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  created() {
    this.getStatus();
    this.getTotalPayment();
    // this.getTableData();
    console.log(this.$authorities.AccountsPayableClose,44)
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getStatus();
      this.getTotalPayment();
      this.getTableData();
    }
  },
  mounted() {
    //获取表格数据
    this.getTableData();
  },
  methods: {
    reset() {
      this.query = {
        accountPayableEnd: null, //应付账款结束值
        accountPayableStart: null, //应付账款起始值
        createTimeStart: "", //开始时间
        createTimeEnd: "", //结束时间
        customerId: null, //客户id
        orderNo: "", //订单号
        organizationId: null, //开票方id
        projectId: null, //项目id
        serverId: null, //服务方id
        pageNum: 1,
        pageSize: 10,
        claimAccountTimeEnd: null, //收款结束时间
        claimAccountTimeStart: null //收款开始时间
      };
      this.getStatus();
      this.getTableData();
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
        columnIndex !== 0 &&
        columnIndex !== 2 &&
        columnIndex !== 16 &&
        columnIndex !== 17 &&
        columnIndex !== 18 &&
        columnIndex !== 19 &&
        columnIndex !== 20
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
    // indexMethod(rowIndex) {
    //   if (rowIndex == 0) {
    //     return this.a + "-" + this.b;
    //   } else {
    //     if (
    //       this.tableData[rowIndex].orderNo ==
    //       this.tableData[rowIndex - 1].orderNo
    //     ) {
    //       this.b++;
    //       return this.a + "-" + this.b;
    //     } else {
    //       this.b = 1;
    //       this.a++;
    //       return this.a + "-" + this.b;
    //     }
    //   }
    // },
    // rowspan() {
    //   this.tableData.forEach((item, i) => {
    //     if (i === 0) {
    //       this.spanArr.push(1);
    //       this.position = 0;
    //     } else {
    //       if (this.tableData[i].orderNo === this.tableData[i - 1].orderNo) {
    //         this.spanArr[this.position] += 1;
    //         this.spanArr.push(0);
    //       } else {
    //         this.spanArr.push(1);
    //         this.position = i;
    //       }
    //     }
    //   });
    // },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (
    //     columnIndex !== 0 &&
    //     columnIndex !== 2 &&
    //     columnIndex !== 16 &&
    //     columnIndex !== 17 &&
    //     columnIndex !== 18 &&
    //     columnIndex !== 19 &&
    //     columnIndex !== 20
    //   ) {
    //     const _row = this.spanArr[rowIndex];
    //     const _col = _row > 0 ? 1 : 0;

    //     return {
    //       rowspan: _row,
    //       colspan: _col
    //     };
    //   }
    // },
    dialogCallback() {
      this.reload();
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
    //导入数据后的回调
    dialogCallBackPayment(row) {
      console.log(row, 9999);
      if (row.listItemDTOList.length == 0) {
        this.$message({
          message: "导入的文件为空",
          type: "error"
        });
      } else {
        this.$refs["checkedAccountsPayable"].init(row, {
          name: "导入模板数据"
        });
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
        selectOrganization({
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
    showHelp() {
      this.isShow = !this.isShow;
    },
    getStatus() {
      getAccountsPayableCount().then(res => {
        this.activeList = res.data;
      });
    },
    downLoad() {
      switch (this.orderStatus) {
        case 0:
          exportPayment(this.query).then(res => {
            // res.data= res.data.replace(/^\"|\"$/g,'')
            // let href = `/api/file-service/file/download?id=${res.data}&access_token=${this.$auth.token}`;
            // window.open(href, "blank");
            downloadFile(res);
          });
          break;
        case 1:
          exportUnpaid(this.query).then(res => {
            // res.data= res.data.replace(/^\"|\"$/g,'')
            downloadFile(res);
          });
          break;
        case 2:
          exportPaid(this.query).then(res => {
            // res.data= res.data.replace(/^\"|\"$/g,'')
            downloadFile(res);
          });
          break;
        case 3:
          exportCompleted(this.query).then(res => {
            // res.data= res.data.replace(/^\"|\"$/g,'')
            downloadFile(res);
          });
          break;
        case 4:
          exportFailure(this.query).then(res => {
            // res.data= res.data.replace(/^\"|\"$/g,'')
            downloadFile(res);
          });
          break;
      }
    },
    getTotalPayment() {
      switch (this.orderStatus) {
        case 0:
          getTotalPayment(this.query).then(res => {
            this.amountPayableTotalText = res.data.amountPayableTotalText;
            this.accountPayableTotalText = res.data.accountPayableTotalText;
          });
          break;
        case 1:
          getTotalPaymentUnpaid(this.query).then(res => {
            this.amountPayableTotalText = res.data.amountPayableTotalText;
            this.accountPayableTotalText = res.data.accountPayableTotalText;
          });
          break;
        case 2:
          getTotalPaymentPaid(this.query).then(res => {
            this.amountPayableTotalText = res.data.amountPayableTotalText;
            this.accountPayableTotalText = res.data.accountPayableTotalText;
          });
          break;
        case 3:
          getTotalPaymentCompleted(this.query).then(res => {
            this.amountPayableTotalText = res.data.amountPayableTotalText;
            this.accountPayableTotalText = res.data.accountPayableTotalText;
          });
          break;
        case 4:
          getTotalPaymentInvalid(this.query).then(res => {
            this.amountPayableTotalText = res.data.amountPayableTotalText;
            this.accountPayableTotalText = res.data.accountPayableTotalText;
          });
          break;
      }
    },
    //关闭订单
    closeList(row) {
      this.$confirm(
        "关闭后，应付账款将变为已完成状态确定要关闭吗？",
        "关闭提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(res => {
          console.log(row, 55555);
          closeAccountspayable(row.id, { version: row.version }).then(res => {
            this.$message({
              message: "关闭订单成功",
              type: "success"
            });
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    //获取表格数据
    getTableData() {
      if (this.orderStatus == 0) {
        getAllList(this.query).then(res => {
          this.tableData = res.data.items;
          console.log(this.tableData,'88');
          this.combinData();
          this.resultArr = [];
          this.getOrderNumber();
          this.totalPage = res.data.total;
        });
      }
      if (this.orderStatus == 1) {
        getNoRefundList(this.query).then(res => {
          this.tableData = res.data.items;
          this.combinData();
          this.resultArr = [];
          this.getOrderNumber();
          this.totalPage = res.data.total;
        });
      }
      if (this.orderStatus == 2) {
        getPassRefundList(this.query).then(res => {
          this.tableData = res.data.items;
          this.combinData();
          this.resultArr = [];
          this.getOrderNumber();
          this.totalPage = res.data.total;
        });
      }
      if (this.orderStatus == 3) {
        getCompletedList(this.query).then(res => {
          this.tableData = res.data.items;
          this.combinData();
          this.resultArr = [];
          this.getOrderNumber();
          this.totalPage = res.data.total;
        });
      }
      if (this.orderStatus == 4) {
        getInvalidList(this.query).then(res => {
          this.tableData = res.data.items;
          this.combinData();
          this.resultArr = [];
          this.getOrderNumber();
          this.totalPage = res.data.total;
        });
      }
    },
    payment(type) {
      console.log(this.multipleSelection, 666);
      if (!this.multipleSelection.length) {
        return this.$confirm("请选择要付款的订单号", "付款提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
      let arr = [];
      arr = this.multipleSelection.map((value, index, array) => {
        return value.paymentReceivedClaimAccountId;
      });
      this.$refs.checkedAccountsPayable.init(arr, {
        name: "",
        claimAccountTimeEnd: this.query.claimAccountTimeEnd,
        claimAccountTimeStart: this.query.claimAccountTimeStart
      });
    },
    switchStatus(val) {
      this.orderStatus = val;
      this.getTableData();
      this.getTotalPayment();
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    querySearch(query, type, list) {
      if (query != "") {
        this.remoteLoading = true;
        if (type == "name") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "author") {
          simpleList({ userName: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "custom") {
          customers({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.pageNum = val;
      this.getStatus();
      this.getTableData();
    },
    oepnWin(name, query) {
      this.$router.push({ name: name, query: query });
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  clear: both;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
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
      margin: 10px 10px 0 0;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 25%;
        display: flex;
        align-items: center;
        span {
          text-align: right;
          flex: 0 0 98px;
        }
      }
      .el-input {
        max-width: 200px;
        padding: 5px;
      }
      .el-select {
        max-width: 200px;
        padding: 5px;
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
      display: flex;
      justify-content: space-between;
      .listBoxTop-left {
        width: 110px;
        display: flex;
        .myicon {
          margin-left: 20px;
          font-weight: bold;
          font-size: 20px;
        }
        span {
          margin-left: 5px;
          font-size: 14px;
          color: #303133;
          line-height: 50px;
        }
      }
    }
    .listBoxRight {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
      flex-wrap: wrap;
      .button-head {
        width: 80px;
        height: 30px;
        margin-right: 10px;
        border: 1px solid #d1d1d1;
        cursor: pointer;
        background-color: #fff;
        line-height: 30px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        .button-head-icon {
          margin-right: 5px;
        }
        .icon-add {
          font-size: 12px;
        }
        .icon-plane {
          font-size: 12px;
          font-weight: 700;
        }
      }
      .button-head:hover {
        color: #339999;
        border-color: #c2e0e0;
        background-color: #ebf5f5;
      }
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
      }
    }
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
    }
    .btn {
      color: #399;
      margin-left: 10px;
      display: inline-block;
      &:hover {
        text-decoration: none;
        color: #5cadad;
      }
    }
  }
  .block {
    margin-top: 2px;
    text-align: right;
  }
}
</style>
