<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="iconfont icon-top" v-show="isShow"></i>
            <i class="iconfont icon-xia" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-if="isShow">
        <span>操作时间范围：</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <br />
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont icon-jinqi myicon"></i>
          <span>付款操作</span>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" size="small">
        <el-table-column prop="userInfo.realName" label="操作者" align="center">
          <template slot-scope="scope">
            <span>{{group?scope.row.userName:scope.row.userInfo.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="exportTime" label="操作时间" align="center"></el-table-column>
        <el-table-column label="开票类别" align="center" v-if="!group">
          <template slot-scope="scope">
            <span>{{scope.row.exportFileType==0?'销项票':'进项票'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="开票金额" align="center"></el-table-column>
        <el-table-column :label="group?'发票关联结算单':'关联发票申请单'" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small" v-if="!group" v-for="(item,index) in scope.row.invoiceListDTOs" :key="index" @click="godetail('Invoiceapplydetail',item.id)"
            >{{item.invoiceApplicationNo}}</el-button>
            <el-button type="text" size="small" v-if="group" v-for="(item,index) in scope.row.centralPurchaseBillSimple" :key="index" @click="godetail('CollectPurchaseDetail',item.purchaseBillId)">{{item.centralPurchaseBillNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="开票表格" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="downfile(scope.row.exportFileId)"
            >{{scope.row.name||scope.row.fileName}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
    <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
    </div>
  </div>
</template>
<script>
import { exportFileLog } from "@/api/finance/invoice";
import { findExportFile } from "@/api/finance/invoiceGroup";
export default {
  inject: ["reload",'close'],
  name:'Record',
  data() {
    return {
      isShow: true,
      pickerTime: {},
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      tableData: null,
      totalPage: 0,
      time: null,
      page: 1,
      group: false,
      pageSize:10
    };
  },
  activated() {
    if (this.$route.query.group) {
      this.group = this.$route.query.group;
      this.getGroupData();
    } else {
      this.getTableData();
    }
  },
  methods: {
    godetail(name,id){
      this.$router.push({
        name: name,
        query:{
          id:id
        }
     });
    },
    getTableData() {
      exportFileLog({
        endDate: this.time ? this.time[1] : null,
        pageNum: this.page,
        pageSize: this.pageSize,
        startDate: this.time ? this.time[0] : null
      }).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    getGroupData() {
      findExportFile({
        endDate: this.time ? this.time[1] : null,
        pageNum: this.page,
        pageSize: this.pageSize,
        startDate: this.time ? this.time[0] : null
      }).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    queryForm() {
      this.page = 1;
      if (this.group) {
        this.getGroupData();
      } else {
        this.getTableData();
      }
    },
    downfile(id) {
      let href =
        "/api/file-service/file/download?id=" +
        id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.group) {
        this.getGroupData();
      } else {
        this.getTableData();
      }
    },
    handleSizeChange(val){
      this.pageSize = val;
       if (this.group) {
        this.getGroupData();
      } else {
        this.getTableData();
      }
    },
    showHelp() {
      this.isShow = !this.isShow;
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
    }
    .rightBox {
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      padding: 10px 0;
      .el-input {
        width: 200px;
        margin-top: 10px;
        margin-left: 10px;
      }
      .el-select {
        margin-left: 10px;
        margin-top: 10px;
      }
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
      display: flex;
      justify-content: space-between;
      .listBoxTop-left {
        .myicon {
          margin-left: 20px;
          font-weight: bold;
          font-size: 24px;
          margin-top: 2px;
        }
        span {
          font-size: 16px;
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
  .button-box{
    display:flex;
    justify-content: flex-end;
    padding-right:20px;
    box-sizing: border-box;
    margin:20px 0;
  }
}
</style>