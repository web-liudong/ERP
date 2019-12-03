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
            <span>发票抬头：</span>
            <el-input placeholder="发票抬头" v-model="query.invoiceTitle" clearable></el-input>
          </div>
          <div class="chunk">
            <span>服务方：</span>
            <el-select
              v-model="query.organizationId"
              filterable
              remote
              placeholder="服务方"
              :remote-method="(query)=>{
            querySearch(query,'server','remoteServerList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteServerList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>发票类型：</span>
            <el-select v-model="query.invoiceType">
              <el-option label="不限" value></el-option>
              <el-option label="专票" value="0"></el-option>
              <el-option label="普票" value="1"></el-option>
              <el-option label="电子发票" value="2"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>发票号码：</span>
            <el-input placeholder="发票号码" v-model="query.invoiceNumber" clearable></el-input>
          </div>
          <div class="chunk">
            <span>生成时间：</span>
            <el-date-picker
              v-model="query.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              @change="creatTimeChange"
            ></el-date-picker>
          </div>
          <div class="chunk">
            <span>开票时间：</span>
            <el-date-picker
              v-model="query.invoicingTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              @change="invoicingTimeChange"
            ></el-date-picker>
          </div>
          <div class="chunk">
            <span>发票代码：</span>
            <el-input placeholder="发票代码" v-model="query.invoiceCode" clearable></el-input>
          </div>
          <div class="chunk">
            <span>开票方：</span>
            <el-input placeholder="开票方" v-model="query.invoiceOfferId" clearable></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div
            class="button-head"
            @click="showDialog1('importFile')"
            v-if="$authorities.InvoiceRecordPostBatch"
          >
            <i class="iconzhuanguixiangmu iconfont button-head-icon"></i>批量邮寄
          </div>
          <div class="button-head" @click="exportFile()" v-if="$authorities.InvoiceRecordExport">
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
        <!-- <el-table-column prop="id" label="ID" align="center"></el-table-column> -->
        <el-table-column
          prop="invoiceTitle"
          label="发票抬头"
          align="center"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="organizationName"
          label="申请服务方"
          align="center"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="invoiceOfferName"
          label="开票方"
          align="center"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="createTime" label="生成时间" align="center" width="150"></el-table-column>
        <el-table-column prop="invoicingTime" label="开票时间" align="center" width="150"></el-table-column>
        <el-table-column prop="invoiceType" label="类型" align="center">
          <template slot-scope="scope">{{{0:'专票',1:'普票',2:'电子发票'}[scope.row.invoiceType]}}</template>
        </el-table-column>
        <el-table-column prop="invoiceAmount" label="开票金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="invoiceNumber" label="发票号码" align="center" width="140"></el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码" align="center"></el-table-column>
        <el-table-column prop="statusText" label="发票状态" align="center"></el-table-column>
        <el-table-column prop="postStatusText" label="发票邮寄状态" align="center"></el-table-column>
        <el-table-column prop="billId" label="相关" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="oepnWin('PaymentDetail', {id: scope.row.billId})"
              v-if="$authorities.InvoiceRecordPayment"
            >结算单</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" key="opa">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="$authorities.InvoiceRecordPost && scope.row.status == 'POSITIVE_INVOICE_COMPLETED' && scope.row.postStatus == 'PENDING_POST'"
              @click="showDialog('setPost',scope.row)"
            >邮寄</el-button>
            <el-button
              type="text"
              size="small"
              v-if="$authorities.InvoiceRecordCompleted && scope.row.status == 'POSITIVE_INVOICE_COMPLETED' && scope.row.postStatus == 'DISPATCHING'"
              @click="setCompleted(scope.row)"
            >完成</el-button>
            <el-button
              type="text"
              size="small"
              @click="oepnWin('InvoiceRecordDetail', {id: scope.row.id})"
              v-if="$authorities.InvoiceRecordDetail"
            >详情</el-button>
            <!-- <el-button
              type="text"
              size="small"
              v-if="$authorities.InvoiceRecordDiscard && scope.row.status == 'POSITIVE_INVOICE_COMPLETED'"
              @click="setInvalid(scope.row)"
            >作废</el-button> -->
            <!-- <el-button
              type="text"
              size="small"
              v-if="$authorities.InvoiceRecordRed && scope.row.status == 'POSITIVE_INVOICE_COMPLETED'"
              @click="showDialog('setRed',scope.row)"
            >红冲</el-button> -->
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
          style="height:32px"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>

    <setRed ref="setRed" @callback="dialogCallback"></setRed>
    <setPost ref="setPost" @callback="dialogCallback"></setPost>
    <importFile
      ref="importFile"
      :title="'批量邮寄发票'"
      :type="importType"
      :params="params"
      @callback="dialogCallback"
    ></importFile>
  </div>
</template>
<script>
import {
  getInvoiceList,
  setInvoiceInvalid,
  setInvoiceComplete,
  betchInvoicePost,
  exportInvoiceRecord,
  exportUnpost
} from "@/api/payment/invoice";
import { nameList } from "@/api/projectController/projectController";
import importFile from "@/components/common/module/ImportFile";
import { returnFloat } from "@/utils/index";
import setRed from "./child/set_red";
import setPost from "./child/set_post";
export default {
  inject: ["reload", "isFilterShow"],
  name: "InvoiceRecord",
  data() {
    return {
      params: {
        id: ""
      },
      isShow: this.isFilterShow,
      pickerTime: {},
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      tableData: null,
      totalPage: 0,
      importType: "invoice-post-import",
      remoteServerList: [],
      remoteLoading: false, //筛选查询loading
      query: {
        pageNum: 1,
        pageSize: 10,
        invoiceCode: "",
        invoiceNumber: "",
        invoiceTitle: "",
        invoiceType: "",
        createTime:"",
        createTimeEnd:"",
        createTimeStart:"",
        invoicingTime: "",
        invoicingTimeEnd: "",
        invoicingTimeStart: ""
      }
    };
  },
  components: {
    setPost,
    setRed,
    importFile
  },
  created() {
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
    getTableData() {
      getInvoiceList(this.query).then(res => {
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
        invoiceCode: "",
        invoiceNumber: "",
        invoiceTitle: "",
        invoiceType: "",
        createTime:"",
        createTimeEnd:"",
        createTimeStart:"",
        invoicingTime: "",
        invoicingTimeEnd: "",
        invoicingTimeStart: ""
      };
      this.getTableData();
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "server") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    setInvalid(row) {
      this.$confirm(
        "作废后此记录失效，关联的相关订单可重新申请发票",
        "作废提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          setInvoiceInvalid(row.id).then(res => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getTableData();
          });
        })
        .catch(() => {});
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
    downfile(id) {
      let href =
        "/api/file-service/file/download?id=" +
        id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    },
    exportFile() {
      exportInvoiceRecord(this.query).then(res => {
        if (res.code != "000000") {
          this.$message({
            message: "导出失败",
            type: "warning"
          });
        } else {
          this.downfile(res.data);
        }
      });
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    creatTimeChange(time){
      this.query.createTimeStart = time[0];
      this.query.createTimeEnd = time[1];
    },
    invoicingTimeChange(time) {
      this.query.invoicingTimeStart = time[0];
      this.query.invoicingTimeEnd = time[1];
    },
    formatPrice(row, col, cellValue) {
      if (row.statusText == '负数发票开具成功') {
        return <span style="color: red">{"-￥" + returnFloat(cellValue)}</span>
      } else {
        return "￥" + returnFloat(cellValue);
      }
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    showDialog1(type, row) {
      exportUnpost().then(res => {
        this.params.id = res.data;
        this.$refs[type].init(row);
      });
    },

    dialogCallback(type) {
      if (type == "setRed") {
        this.getTableData();
        this.$message({
          type: "success",
          message: "设置红冲成功！"
        });
      } else if (type == "setPost") {
        this.getTableData();
        this.$message({
          type: "success",
          message: "设置邮寄成功！"
        });
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
      height: 50px;
      line-height: 50px;
      overflow: hidden;
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
    }
    .rightBox {
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 5px 0;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      span {
        margin: 0 0 0 10px;
        flex: 0 0 80px;
        text-align: right;
      }
      .chunk {
        width: 25%;
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
        text-indent: 15px;
        span {
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