<template>
  <div class="demandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up" v-if="isShow"></i>
            <i class="el-icon-arrow-down" v-if="!isShow"></i>
            {{isShow? '展开':'收起'}}筛选
          </span>
          <el-button size="small" @click="queryForm">查询结果</el-button>
          <el-button size="small" @click="clearForm">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>发票抬头：</span>
            <el-input placeholder="发票抬头" v-model="FindPurchaseInvoice.invoiceTitle" clearable></el-input>
            <!-- <el-select
              v-model="FindPurchaseInvoice.invoiceTitle"
              filterable
              remote
              clearable
              placeholder="发票抬头"
              :remote-method="(query) => {
                querySelect(query,'getinvoicetitle','invoicetitleList')
              }"
              :loading="loading"
            >
              <el-option
                v-for="(item,index) in invoicetitleList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>-->
          </div>
          <div class="inputBox">
            <span>伙伴：</span>
            <el-select
              v-model="FindPurchaseInvoice.partnerId"
              remote
              filterable
              clearable
              placeholder="请输入伙伴名称"
              :remote-method="(query) => {
                querySelect(query,'supplierMethod','partnerNames')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in partnerNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>开票时间：</span>
            <el-date-picker
              v-model="dataTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="invoiceTime"
            ></el-date-picker>
          </div>
          <div class="inputBox">
            <span>发票类型：</span>
            <el-select v-model="FindPurchaseInvoice.invoiceType" clearable>
              <el-option label="不限" value></el-option>
              <el-option label="专票" value="VAT_INVOICE"></el-option>
              <el-option label="普票" value="PLAIN_INVOICE"></el-option>
              <el-option label="电子发票" value="ELECTRONIC_INVOICE"></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>发票号码：</span>
            <el-input placeholder="发票号码" v-model="FindPurchaseInvoice.invoiceNumber" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>发票代码：</span>
            <el-input placeholder="发票代码" v-model="FindPurchaseInvoice.invoiceCode" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>开票方：</span>
            <el-select
              v-model="FindPurchaseInvoice.organizationId"
              filterable
              clearable
              remote
              placeholder="开票方"
              :remote-method="(query) => {
                querySelect(query,'supplierMethod','partnerNames')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in partnerNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表
        </div>
        <div class="listRight">
          <el-button size="small" v-if="$authorities.GroupInvoicePostBatch"  @click="showDialog('importFile',FindPurchaseInvoice)">
            <i class="iconfont iconzengjia"></i>
            <span>批量邮寄</span>
          </el-button>
          <el-button size="small" v-if="$authorities.GroupInvoiceRecordExport"  @click="exportFile()">
            <i class="iconfont icondaochu"></i>
            <span>导出</span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData"
          border
          :max-height="dataListHeight"
          style="width: 100%"
          :header-cell-style="tableStyle"
        >
          <el-table-column prop="id" label="ID" align="center"></el-table-column>
          <el-table-column prop="invoiceTitle" label="发票抬头" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="partnerName" label="伙伴" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizationName" label="开票方" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="invoicingTime"
            label="开票时间"
            align="center"
            show-overflow-tooltip
            :formatter="formatTime"
          ></el-table-column>
          <el-table-column prop="invoiceType" label="类型" align="center">
            <template
              slot-scope="scope"
            >{{{'VAT_INVOICE':'专票', 'PLAIN_INVOICE':'普票', 'ELECTRONIC_INVOICE':'电子发票'}[scope.row.invoiceType]}}</template>
          </el-table-column>
          <el-table-column
            prop="invoiceAmount"
            label="开票金额"
            align="center"
            :formatter="formatPrice"
          >
            <!-- <template slot-scope="scope">
               <span style="color: red" v-if="scope.row.status == 'NEGATIVE_INVOICE_SUCCESS'">{{scope.row.invoiceAmount}}</span>
               <span v-else>{{scope.row.invoiceAmount}}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
          <el-table-column prop="invoiceCode" label="发票代码" align="center"></el-table-column>
          <el-table-column prop="status" label="发票状态" align="center">
            <template
              slot-scope="scope"
            >{{{'POSITIVE_INVOICE_SUCCESS':'正数发票开具成功', 'NEGATIVE_INVOICE_SUCCESS':'负数发票开具成功', 'POSITIVE_INVOICE_INVALIDED':'正数发票已作废', 'POSITIVE_INVOICE_RED':'正数发票已红冲'}[scope.row.status]}}</template>
          </el-table-column>
          <el-table-column prop="postStatus" label="发票邮寄状态" align="center">
            <template
              slot-scope="scope"
            >{{{'PENDING_DELIVERY':'待邮寄' , 'DELIVERY':'配送中', 'COMPLETED':'已完成'}[scope.row.postStatus]}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="showDialog('mailing',scope.row)"
                v-if="scope.row.postStatus == 'PENDING_DELIVERY' && $authorities.GroupInvoicePost"
              >邮寄</el-button>
              <el-button
                type="text"
                size="small"
                @click="setCompleted(scope.row)"
                v-if="scope.row.postStatus == 'DELIVERY' && $authorities.GroupInvoiceRecordComplete"
              >完成</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.GroupInvoiceRecordDetails"
                @click="openWin('CollectionInvoiceDetail',{'id':scope.row.id})"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <mailing ref="mailing" @callback="dialogCallback"></mailing>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="FindPurchaseInvoice.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="FindPurchaseInvoice.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
    <importFile ref="importFile" :title="'明细信息批量导入'" @callback="dialogCallback"></importFile>
  </div>
</template>

<script>
import {
  invoicetitle,
  findOrganization,
  getInvoiceList,
  exportInvoice,
  setInvoiceComplete,
  download
} from "@/api/finance/collectionInvoice";
import mailing from "./child/set_mailing";
import { parseTime, returnFloat } from "@/utils";
import importFile from "./child/importFile";
import { downloadFile } from "@/utils/index.js";

export default {
  inject: ["reload", "isFilterShow"],
  name: "CollectionInvoice",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      isShow: this.isFilterShow,
      loading: false,
      tableData: [],
      FindPurchaseInvoice: {
        startTime: null, //开票时间-开始
        endTime: null, //开票时间-结束
        invoiceCode: null, //发票代码
        invoiceNumber: null, //发票号码
        invoiceTitle: null, //发票抬头
        invoiceType: null, //集采发票类型
        organizationId: null, //开票方，组织机构id
        pageNum: 1, //页码
        pageSize: 10, //分页大小
        partnerId: null //伙伴id
      },
      total: 0,
      invoicetitleList: [],
      partnerNames: [],
      dataTime: null
    };
  },
  created() {
    this.getTableData();
  },
  components: {
    mailing,
    importFile
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    queryForm() {
      this.FindPurchaseInvoice.pageNum = 1;
      this.getTableData();
    },
    clearForm() {
      this.FindPurchaseInvoice = {
        startTime: null, //开票时间-开始
        endTime: null, //开票时间-结束
        invoiceCode: null, //发票代码
        invoiceNumber: null, //发票号码
        invoiceTitle: null, //发票抬头
        invoiceType: null, //集采发票类型
        organizationId: null, //开票方，组织机构id
        pageNum: 1, //页码
        pageSize: 10, //分页大小
        partnerId: null //伙伴id
      };
      this.dataTime = null;
      this.getTableData();
    },
    getTableData() {
      console.log(this.FindPurchaseInvoice);
      getInvoiceList(this.FindPurchaseInvoice).then(res => {
        console.log(res, "999");
        this.tableData = res.data.items;
        this.FindPurchaseInvoice.pageNum = res.data.pageNum;
        this.FindPurchaseInvoice.pageSize = res.data.pageSize;
        this.total = res.data.total;
      });
    },
    querySelect(query, type, list) {
      if (query !== "") {
        this.loading = true;
        if (type == "supplierMethod") {
          findOrganization({ name: query }).then(res => {
            this.partnerNames = res.data;
            this.loading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    openWin(name, query) {
      this.$router.push({
        name: name,
        query: query
      });
    },
    setCompleted(row) {
      setInvoiceComplete(row.id).then(res => {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.getTableData();
      });
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(type) {
      if (type == "mailing") {
        this.$message({
          type: "success",
          message: "设置邮寄成功！"
        });
        this.getTableData();
      }
    },
    exportFile() {
      exportInvoice(this.FindPurchaseInvoice).then(res => {
        console.log(res);
        this.download(res);
      });
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data], { type:'application/vnd.ms-excel'}));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "发票记录列表.xls");
      document.body.appendChild(link);
      link.click();
    },
    invoiceTime(time) {
      if (time) {
        this.FindPurchaseInvoice.startTime = time[0];
        this.FindPurchaseInvoice.endTime = time[1];
      } else {
        this.FindPurchaseInvoice.startTime = null;
        this.FindPurchaseInvoice.endTime = null;
      }
    },
    formatTime(o) {
      return parseTime(o.invoicingTime);
    },
    formatPrice(row, col, cellValue) {
      if (row.status == 'NEGATIVE_INVOICE_SUCCESS') {
        return <span style="color: red">{"-￥" + returnFloat(cellValue)}</span>
      }
      return "￥" + returnFloat(cellValue);
    },
    //分页跳转
    handleCurrentChange(val) {
      this.FindPurchaseInvoice.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.FindPurchaseInvoice.pageSize = val;
      this.getTableData();
    }
  }
};
</script>

<style lang='less' scoped>
.demandBox {
  width: 100%;
  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
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
      margin: 10px 0 0 10px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 24%;
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
    border: 1px solid #e4e4e4;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f3f3f3;
      height: 50px;
      .listLeft {
        i {
          padding: 0 5px 0 20px;
        }
      }
      .listRight {
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  }
  .block {
    margin: 5px 10px;
    text-align: right;
  }
}
</style>
