<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="clearForm">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-if="isShow">
          <div class="chunk">
            <span>订单号：</span>
            <el-input placeholder="请输入订单号" v-model="query.no" clearable></el-input>
          </div>
          <div class="chunk">
            <span>外部订单号：</span>
            <el-input placeholder="请输入外部订单号" v-model="query.customerOrderNo" clearable></el-input>
          </div>
          <div class="chunk">
            <span>开票明细是否关闭：</span>
            <el-select v-model="query.locked">
              <el-option label="全部" value></el-option>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>认款是否关闭：</span>
            <el-select v-model="query.lockedPayment">
              <el-option label="全部" value></el-option>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>客户名：</span>
            <el-select
              v-model="query.customerId"
              filterable
              remote
              placeholder="请输入客户名称"
              :remote-method="(query)=>{
            querySearch(query,'custom','remoteCustomList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteCustomList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>项目名：</span>
            <el-select
              v-model="query.projectId"
              filterable
              remote
              placeholder="项目名称"
              :remote-method="(query)=>{
            querySearch(query,'name','remoteNameList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteNameList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>是否全部结算：</span>
            <el-select v-model="query.settledStatus">
              <el-option label="全部" value></el-option>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>付款是否关闭：</span>
            <el-select v-model="query.lockedReceipts">
              <el-option label="全部" value></el-option>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="exportData()" v-if="$authorities.PaymentStatusExport">
            <i class="icondaochu iconfont button-head-icon"></i>导出
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="small"
        :max-height="dataListHeight"
      >
        <el-table-column prop="no" label="订单编号" align="center">
          <template slot-scope="scope">
            <el-button
              @click="oepnWin('OrderDetail',{ id: scope.row.orderId })"
              type="text"
              size="small"
            >{{scope.row.no}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatusDesc" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="orderAmount" label="线上下单金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column
          prop="invoiceAmount"
          label="开票明细金额"
          align="center"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column prop="locked" label="开票明细是否关闭" align="center">
          <template slot-scope="scope">{{scope.row.locked}}</template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="已结算金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="settledStatus" label="是否全部结算" align="center">
          <template slot-scope="scope">{{scope.row.settledStatus}}</template>
        </el-table-column>
        <el-table-column prop="receivable" label="应收金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="netReceipts" label="实收金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="lockedPayment" label="认款是否关闭" align="center">
          <template slot-scope="scope">{{scope.row.lockedPayment}}</template>
        </el-table-column>
        <el-table-column prop="payable" label="应付金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="realPayment" label="已付金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="lockedReceipts" label="付款是否关闭" align="center">
          <template slot-scope="scope">{{scope.row.lockedReceipts}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="scope" v-if="scope.row.settledStatus == '是'">
            <span>--</span>
          </div>
          <div slot-scope="scope" v-else>
            <el-button
              @click="setAllPayment(scope.row)"
              type="text"
              size="small"
              v-if="$authorities.PaymentStatusSetAll"
            >设为全部结算</el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 32px;"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { returnFloat } from "@/utils/index";
import {
  getBillStatusList,
  setStatusChange,
  exportBillStatus
} from "@/api/payment/invoice";
import { nameList } from "@/api/projectController/projectController";
import { customerName } from "@/api/customerManage";
export default {
  inject: ["reload", "isFilterShow"],
  name: "PaymentStatus",
  data() {
    return {
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      tableData: null,
      totalPage: 0,
      remoteCustomList: null,
      remoteNameList: null,
      importType: "release-shoppe-nav-import",
      remoteLoading: false, //筛选查询loading
      query: {
        pageNum: 1,
        pageSize: 10,
        customerId: "",
        customerOrderNo: "",
        locked: "",
        lockedPayment: "",
        lockedReceipts: "",
        no: "",
        projectId: "",
        settledStatus: ""
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  components: {},
  mounted() {
    //获取表格数据
    this.getTableData();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getTableData();
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    //获取表格数据
    getTableData() {
      getBillStatusList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    clearForm() {
      this.query = {
        pageNum: 1,
        pageSize: 10,
        customerId: "",
        customerOrderNo: "",
        locked: "",
        lockedPayment: "",
        lockedReceipts: "",
        no: "",
        projectId: "",
        settledStatus: ""
      };
      this.getTableData();
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "name") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "custom") {
          customerName(query).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    setAllPayment(row) {
      this.$confirm(
        "全部结算后，此订单不可再创建结算单申请发票",
        "确认全部结算",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          setStatusChange(row.orderId, 0).then(res => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getTableData();
          });
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/xls" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "files.xls");
      document.body.appendChild(link);
      link.click();
    },
    exportData() {
      exportBillStatus(this.query).then(res => {
        if (!res) {
          this.$message({
            message: "导出失败",
            type: "warning"
          });
        } else {
          this.download(res);
        }
      });
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    formatPrice(row, col, cellValue) {
      if (cellValue == null) {
        return "--";
      } else {
        return "￥" + returnFloat(cellValue);
      }
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
    .el-button {
      width: 160px;
      height: 30px;
    }
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      /* height: 50px;
         line-height: 50px;*/
      line-height: 50px;
    }
    .title {
      margin-left: 10px;
      font-size: 14px;
      line-height: 50px;
      cursor: pointer;
      color: #339999;
      display: inline-block;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
      color: #303133;
      display: inline-block;
    }
    .rightBox {
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 5px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      span {
        margin: 0 0 0 10px;
        flex: 0 0 120px;
        text-align: right;
      }
      .chunk {
        width: 33.333%;
        height: 50px;
        display: flex;
        align-items: center;
      }
      .el-input {
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select,
      .el-autocomplete,
      .el-date-editor {
        margin: 10px 0 10px 10px;
        width: 100%;
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
        .myicon {
          margin-left: 10px;
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
  }
  .block {
    margin-top: 10px;
    text-align: right;
  }
}
</style>