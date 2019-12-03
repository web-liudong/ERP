<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:status==item.statusCode}"
        @click="getlist(1,item.statusCode)"
        v-for="(item,index) in statusBag"
        :key="index"
      >{{item.statusName}}（{{item.total}}）</el-button>
    </div>
    <div class="filterBox" v-if="$authorities.InvoicePurchseSearch">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">{{isShow?'收起':'展开'}}筛选</span>
          <el-button size="small" @click="getlist(1,status)">查询结果</el-button>
          <el-button size="small" @click="reload">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>发票类型：</span>
            <el-select v-model="invoiceType" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>发票代码：</span>
            <el-input placeholder="请输入发票代码" v-model="invoiceCode" clearable type="number"></el-input>
          </div>
          <div class="search-icon">
            <span>发票号码：</span>
            <el-input placeholder="请输入发票号码" v-model="invoiceNumber" clearable type="number"></el-input>
          </div>
          <div class="search-icon">
            <span>开票日期：</span>
            <el-date-picker
              v-model="time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="search-icon">
            <span>购买方名称：</span>
            <el-input placeholder="请输入购买方名称" v-model="organizationName" clearable></el-input>
          </div>
          <div class="search-icon">
            <span>销售方名称：</span>
            <el-input placeholder="请输入销售方名称" v-model="supplierName" clearable></el-input>
          </div>
          <div class="search-icon">
            <span>受理人：</span>
            <el-input placeholder="请输入姓名" v-model="receiverName" clearable></el-input>
          </div>
          <div class="search-icon">
            <span>编制日期：</span>
            <el-date-picker
              v-model="time1"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表"></table-head>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码" align="center"></el-table-column>
        <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
        <el-table-column prop="invoiceDate" label="开票日期" align="center"></el-table-column>
        <el-table-column prop="invoiceTypeName" label="发票类型" align="center"></el-table-column>
        <el-table-column prop="organizationName" label="购买方名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="销售方名称" align="center"></el-table-column>
        <el-table-column prop="receiverName" label="受理人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="编制日期" align="center"></el-table-column>
        <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
        <el-table-column  label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goDetail(scope.row)"
              v-if="$authorities.InvoicePurchseDetail"
            >详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="check(scope.row.id)"
              v-if="$authorities.InvoicePurchseCheck&&(scope.row.status=='INVOICE_APPROVAL'||scope.row.status=='PARTIALLY_PASSED')"
            >审批</el-button>
            <el-button
              type="text"
              size="small"
              @click="complete(scope.row.id)"
              v-if="scope.row.statusName=='已通过'"
            >完成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]"
          @size-change="handleSizeChange"
          layout="total, sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  statusCount,
  alllist,
  approvallist,
  passlist,
  rejectlist,
  partiallylist,
  completedlist,
  invoicComplete
} from "@/api/purchase/invoice";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload"], //注入依赖
  name: "InvoiceList",
  data() {
    return {
      status: 1,
      statusBag: null,
      options: [
        {
          value: "TAX_INCREASE_INVOICE",
          label: "增税专票"
        },
        {
          value: "TAX_INCREASE",
          label: "增税普票"
        }
      ],
      time: null,
      time1: null,
      invoiceType: null,
      invoiceCode: null,
      invoiceNumber: null,
      organizationName: null,
      supplierName: null,
      receiverName: null,
      tableData: [],
      page: 1,
      total: 0,
      isShow: true,
      pageSize:10
    };
  },
  created() {
    this.getlist(1, null);
  },
  activated() {
    if (this.$route.params && this.$route.params.isUpdate) {
      this.getlist(1, null);
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  components: { TableHead },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlist(1, this.status);
    },
    complete(id) {
      invoicComplete(id).then(res => {
        if (res.code == "000000") {
          this.reload();
        }
      });
    },
    getlist(page, status) {
      this.getcount();
      this.status = status;
      var datasearch = {
        invoiceType: this.invoiceType,
        invoiceCode: this.invoiceCode == "" ? null : this.invoiceCode,
        invoiceNumber: this.invoiceNumber == "" ? null : this.invoiceNumber,
        invoiceStartDate: this.time ? this.time[0] : null,
        invoiceEndDate: this.time ? this.time[1] : null,
        organizationName:
          this.organizationName == "" ? null : this.organizationName,
        supplierName: this.supplierName == "" ? null : this.supplierName,
        receiverName: this.receiverName == "" ? null : this.receiverName,
        createStartTime: this.time1 ? this.time1[0] : null,
        createEndTime: this.time1 ? this.time1[1] : null,
        pageSize: this.pageSize,
        pageNum: page
      };
      if (status == null) {
        alllist(datasearch).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 1) {
        approvallist(datasearch).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 2) {
        passlist(datasearch).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 3) {
        rejectlist(datasearch).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 4) {
        partiallylist(datasearch).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 5) {
        completedlist(datasearch).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      }
    },
    getcount() {
      statusCount().then(res => {
        if (res.code == "000000") {
          this.statusBag = res.data;
        }
      });
    },
    getCodeFileDownload(id) {
      let href = formatString(
        "/api/file-service/file/download?id={id}&access_token={token}",
        { id: id, token: this.$auth.token }
      );
      window.open(href, "blank");
    },
    confirm(row) {
      this.$router.push({
        name: "PurchaseConfirm",
        query: {
          id: row.id,
          type: row.deliveryTypeText == "入仓" ? 1 : 2
        }
      });
    },
    goDetail(row) {
      this.$router.push({
        name: "InvoicePurDetail",
        query: {
          id: row.id
        }
      });
    },
    check(id) {
      this.$router.push({
        name: "InvoicePurCheck",
        query: {
          id: id
        }
      });
    },
    income(row) {
      this.$router.push({
        name:
          row.deliveryTypeText == "入仓"
            ? "Warehousingincome"
            : "Factoryincome",
        query: {
          id: row.id,
          type: row.deliveryTypeText == "入仓" ? 1 : 2
        }
      });
    },
    cancel(id) {
      this.$confirm(
        "取消后，该结算单相关的采购需求将释放回需求池",
        "取消提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(() => {
        cancel(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "取消成功"
            });
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: "取消失败"
            });
          }
        });
      });
    },
    purchaseEdit(id) {
      this.$router.push({
        name: "PurchaseOrderEdit",
        query: {
          id: id
        }
      });
    },
    remoteMethod(query) {
      if (query) {
        searchlist({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.warehouses = res.data;
          }
        });
      }
    },
    supplierRemote(query) {
      getSupplierName({
        name: query
      }).then(res => {
        if (res.code == "000000") {
          this.suppliers = res.data;
        }
      });
    },
    filterTime(row) {
      return parseTime(row.createTime);
    },
    handleCurrentChange(val) {
      this.getlist(val, this.status);
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .left-dialog {
    height: 46px;
    border: 1px solid #e4e4e4;
    line-height: 46px;
    text-align: right;
    background-color: #f5f5f5;
    font-size: 16px;
    font-weight: bold;
  }
  .right-dialog {
    height: 46px;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    line-height: 46px;
    font-size: 16px;
    padding-left: 10px;
  }
  .buttonBox {
    margin-top: 10px;
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding-left: 20px;
      box-sizing: border-box;
      .head-left {
        display: flex;
        align-items: center;
      }
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      .myicon {
        color: #999;
        font-size: 10px;
      }
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      .search-icon {
        display: inline-block;
        padding: 10px 10px;
        .el-input {
          width: 200px;
        }
      }
    }
  }
  .listBox {
    font-size: 12px;
    clear: both;
    margin: 10px 0 0 0;
  }
  .block {
    margin-top: 2px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
