<template>
  <div class="brandBox">
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
          <el-button size="small" @click="queryForm">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox clear" v-if="isShow">
          <div class="inputBox">
            <span>操作时间范围：</span>
            <el-date-picker
              v-model="query.paymentTimeStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
            ></el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="query.paymentTimeEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>操作记录</span>
        <el-table :data="tableResetData" border style="width: 100%" size="small" :max-height="dataListHeight" :height="dataListHeight">
          <el-table-column prop="userInfo" label="操作者" align="center">
            <template slot-scope="scope">{{scope.row.realName}}</template>
          </el-table-column>
          <el-table-column prop="localDateTime" label="操作时间" align="center"></el-table-column>
          <el-table-column
            prop="totalAmountPaid"
            label="付款金额"
            align="center"
            :formatter="TableMoney"
          ></el-table-column>
          <el-table-column prop="exportFileId" label="导出付款信息记录" align="center" @click="toRecord">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="downfile(scope.row)"
              >付款信息记录{{scope.row.localDateTime}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
    </div>
    <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Butt from "../../common/Button/index";
import request from "@/utils/request";
import { parseTime, formatString } from "@/utils";
export default {
  inject: ["reload", "TableMoney", "isFilterShow"],
  name: "SysPaymentRecord",
  data() {
    return {
      query: {
        paymentTimeStart: "",
        paymentTimeEnd: "",
        pageNum: 1,
        pageSize: 10
      },
      isShow: this.isFilterShow,
      totalPage: 0,
      tableData: [],
      apiMapping: {
        "shoppe-operation-record":
          "/api/shoppe-release-service/shopperelease/shoppe/{0}/shoppesku/operation-log",
        "payment-record": "/api/bill-service/account/payable/record-list"
      },
      reqId: "", //请求id
      type: "",
    };
  },
  computed: {
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    },
    requestUrl: function() {
      let url = "";
      switch (this.type) {
        case "shoppe-operation-record":
          url = formatString(this.apiMapping[this.type], this.reqId);
          break;
        case "payment-record":
          url = this.apiMapping[this.type];
          break;
      }
      return url;
    },
    tableResetData: function() {
      //数据格式不一样需要组装
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          // organizationName: value.userInfo.organizationName,
          // departmentName: value.userInfo.departmentName,
          realName: value.userInfo.userFullName,
          localDateTime: value.operatorTime,
          totalAmountPaid: value.totalAmountPaid,
          exportFileId: value.exportFileId
        };
      });
      return tempArr;
    }
  },
  mounted() {
    this.reqId = this.$route.query.id;
    this.type = this.$route.query.type;
    this.getTableData();
  },
  methods: {
    reset() {
      this.query.paymentTimeStart = null;
      this.query.paymentTimeEnd = null;
      this.getTableData();
    },
    downfile(row) {
      let href =
        "/api/file-service/file/download?id=" +
        row.exportFileId +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    },
    getTableData() {
      request({
        url: this.requestUrl,
        method: "post",
        data: this.query
      }).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    filterTime(row) {
      return parseTime(row.operationTime);
    },
    toRecord() {},
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
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
    }

    // .homeBottomBox {
    //   border-top: 1px solid #e4e4e4;
    //   display: flex;
    //   flex-wrap: wrap;
    //   .inputBox {
    //     width: 25%;
    //     display: flex;
    //     align-items: center;
    //     span {
    //       text-align: right;
    //       flex: 0 0 98px;
    //     }
    //   }
    //   .el-input {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    //   .el-select {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    // }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    
    .listBoxTop {
      line-height: 50px;
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
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
    float: right;
  }
}
</style>
