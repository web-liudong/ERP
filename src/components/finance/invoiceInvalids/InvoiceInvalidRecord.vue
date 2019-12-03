<template>
  <div class="operationBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo">筛选查询</i>
        </span>
        <div class="rightBox">
          <span @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up" v-if="isShow"></i>
            <i class="el-icon-arrow-down" v-if="!isShow"></i>
            {{isShow? '收起':'展开'}}筛选
          </span>
          <el-button size="small" @click="getInquire()">查询结果</el-button>
          <el-button size="small" @click="Empty()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>操作时间范围：</span>
            <el-date-picker
              v-model="dataTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectPicker"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="detaillTable clear" style="margin-bottom:35px;">
      <addhead headname="发票操作"></addhead>
      <el-table
        :data="tableData.items"
        border
        style="width:90%;"
        size="small"
        :header-cell-style="tableStyle"
      >
        <el-table-column prop="userInfo.userFullName" label="操作者" align="center"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="invoiceAmount" label="发票金额" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="applicationNo" label="关联发票作废申请单" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-for="item,index in scope.row.applicationDTO"
              :key="index"
              @click="goToDetail('InvoiceInvalidDetail',query.id = item.id)"
            >{{item.applicationNo}}&nbsp;</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableData.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="10"
          layout="total,sizes,prev, pager, next, jumper"
          :total="tableData.total"
          background
        ></el-pagination>
      </div>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button
          type="primary"
          @click="close( {name:'InvoiceInvalidRecord', to: {name:'Invalidapplication'}})"
        >关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { postBillApprecord } from "@/api/finance/invoiceInvalids";
import addhead from "@/components/common/head/head";
import { parseTime, returnFloat } from "@/utils/index";

export default {
  inject: ["reload", "isFilterShow", "close"],
  name: "InvoiceInvalidRecord",
  data() {
    return {
      query: {
        id: ""
      },
      tableStyle: {
        background: "#f5f7fa"
      },
      isShow: this.isFilterShow,
      tableData: {
        item: [
          {
            userInfo: {
              userFullName: "领先未来科技集团有限公司>技术部>王鹤鹏"
            },
            operationTime: "20190809"
          },
          {
            userInfo: {
              userFullName: "领先未来科技集团有限公司>技术部>王鹤鹏"
            },
            operationTime: "20190809"
          },
          {
            userInfo: {
              userFullName: "领先未来科技集团有限公司>技术部>王鹤鹏"
            },
            operationTime: "20190809"
          }
        ]
      },
      dataTime: null,
      fron: {
        operationTimeEnd: null,
        pageNum: 1,
        pageSize: 10,
        operationTimeStart: null
      }
    };
  },
  created() {
    this.postBillApprecord(this.fron);
  },
  components: {
    addhead
  },
  methods: {
    postBillApprecord(fron) {
      postBillApprecord(fron).then(res => {
        console.log(res);
        this.tableData = res.data;
      });
    },
    getInquire() {
      // console.log(this.dataTime)
      this.postBillApprecord(this.fron);
    },
    Empty() {
      this.fron.operationTimeEnd = null;
      this.fron.operationTimeStart = null;
      this.dataTime = null;
      this.postBillApprecord(this.fron);
    },
    selectPicker(dataTime) {
      if (dataTime) {
        this.fron.operationTimeStart = dataTime[0];
        this.fron.operationTimeEnd = dataTime[1];
        // console.log(this.fron)
      } else {
        this.fron.operationTimeStart = "";
        this.fron.operationTimeEnd = "";
      }
    },
    goToDetail(name) {
      this.$router.push({
        name: name,
        query: this.query
      });
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    //分页跳转
    handleCurrentChange(val) {
      console.log(val);
      this.fron.pageNum = val;
      this.postBillApprecord(this.fron);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.fron.pageNum = 1;
      this.fron.pageSize = val;
      this.postBillApprecord(this.fron);
    }
  }
};
</script>
<style lang='less' scoped>
.operationBox {
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
      .inputBox {
        width: 24%;
        display: flex;
        align-items: center;
        padding: 10px;
        span {
          text-align: right;
          flex: 0 0 98px;
        }
      }
    }
  }
  .detaillTable {
    border: 1px solid #d1d1d1;
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
      width: 90%;
      margin: 0 auto 20px;
    }
    .block {
      width: 90%;
      margin: 10px auto;
      text-align: right;
    }
  }
}
</style>
