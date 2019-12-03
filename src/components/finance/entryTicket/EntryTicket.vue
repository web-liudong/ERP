<template>
  <div class="entryTicketBox">
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
          <el-button size="small" @click="query()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>回票号码：</span>
            <el-input placeholder="回票号码" v-model="findInvoiceListParam.invoiceNo" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>物流单号：</span>
            <el-input placeholder="物流单号" v-model="findInvoiceListParam.logisticsNo" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>进项票录入方：</span>
            <el-select
              v-model="findInvoiceListParam.invoiceEntryId"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="进项票录入方"
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
            <span>创建时间：</span>
            <el-date-picker
              v-model="dataTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox clear">
      <div class="listTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表
        </span>
        <div class="topright" v-if="$authorities.EntryTicketConfirmAll">
          <div class="white-btn fun-btn" @click="allConfirm()">
            <i class="iconfont iconqueren"></i>
            <span>批量确认</span>
          </div>
        </div>
      </div>
      <div class="list">
        <el-table
          :data="tableData"
          :max-height="dataListHeight"
          stripe
          styel="width: 100%"
          border
          @selection-change="handleSelectionChange"
          :header-cell-style="tableStyle"
        >
          <el-table-column type="selection" :selectable="checkSelectable"></el-table-column>
          <el-table-column prop="invoiceNo" label="回票号码" align="center"></el-table-column>
          <el-table-column prop="invoiceCode" label="回票代码" align="center"></el-table-column>
          <el-table-column prop="invoiceEntry" label="进项票录入方" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invoiceTitle" label="发票抬头" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="logisticsDescription" label="物流信息" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="confirm(scope.row.id)"
                v-show="!scope.row.status && $authorities.EntryTicketConfirm"
              >确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="this.findInvoiceListParam.pageNum"
        :page-size="this.findInvoiceListParam.pageSize"
        :page-sizes="[10,20,30,40,50,100,500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getList,
  putConfirm,
  putAllConfirm,
  selectOrganization
} from "@/api/finance/entryTicket";
export default {
  inject: ["reload", "isFilterShow"],
  name: "EntryTicket",
  data() {
    return {
      //表头样式
      tableStyle: {
        background: "#f5f7fa",
        "font-weight": "800"
      },
      findInvoiceListParam: {
        invoiceNo: null,
        logisticsNo: null,
        invoiceEntryId: "",
        overTime: null,
        pageNum: 1,
        pageSize: 10,
        startTime: null
      },

      tableval: [],
      //批量id数组
      invoiceReceivableIds: [],

      total: 0,
      dataTime: "",
      isShow: this.isFilterShow,
      tableData: [],
      loading: false,
      //组织机构模糊查询
      searchOrganizations: []
    };
  },
  created() {
    this.getTable();
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset() {
      this.dataTime = null;
      this.findInvoiceListParam.startTime = null;
      this.findInvoiceListParam.overTime = null;
      this.findInvoiceListParam.invoiceEntryId = null;
      this.findInvoiceListParam.pageNum = 1;
      this.findInvoiceListParam.pageSize = 10;
      this.getTable();
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
            console.log(res, "00000");
            this.searchOrganizations = res.data;
          }
        });
      } else {
        this.searchOrganizations = [];
      }
    },
    //查询结果
    query() {
      this.getTable();
    },
    //获取回票列表
    getTable() {
      this.findInvoiceListParam.startTime = this.dataTime
        ? this.dataTime[0]
        : "";
      this.findInvoiceListParam.overTime = this.dataTime
        ? this.dataTime[1]
        : "";
        console.log(this.findInvoiceListParam,'999');
      getList(this.findInvoiceListParam).then(res => {
        if (res.code == "000000") {
          console.log(res);
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    //确认回票
    confirm(id) {
      putConfirm(id).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
        }
        this.getTable();
      });
    },
    //批量确认
    allConfirm() {
      this.invoiceReceivableIds = [];
      for (var i in this.tableval) {
        if (this.invoiceReceivableIds.indexOf(this.tableval[i].id) === -1) {
          this.invoiceReceivableIds.push(this.tableval[i].id);
        }
      }
      console.log(this.invoiceReceivableIds.length);
      if (this.invoiceReceivableIds.length == 0) {
        this.$message({
          message: "请先进行勾选",
          type: "error"
        });
      } else {
        putAllConfirm(this.invoiceReceivableIds).then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getTable();
          }
        });
      }
    },
    handleCurrentChange(val) {
      this.findInvoiceListParam.pageNum = val;
      this.getTable();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findInvoiceListParam.pageSize = val;
      this.getTable();
    },
    handleSelectionChange(val) {
      this.tableval = val;
    },
    checkSelectable(row) {
      if (row.status) {
        return false;
      } else {
        return !row.checked;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.entryTicketBox {
  width: 100%;
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
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 23%;
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
    background: #f3f3f3;
    .listTop {
      height: 50px;
      line-height: 50px;
      border: 1px solid #e4e4e4;
      padding-left: 10px;
      .topright {
        float: right;
        margin-right: 20px;
      }
    }
  }
  .page {
    float: right;
    margin: 10px;
  }
}
</style>

