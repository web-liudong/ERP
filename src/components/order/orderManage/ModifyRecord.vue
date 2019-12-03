<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listBoxTop">
        <span>订单修改记录</span>
        <el-table :data="tableData" border style="width: 100%" size="small">
          <el-table-column prop="changeOrderUserInfo.userFullName" label="操作者" align="center"></el-table-column>
          <el-table-column prop="operation" label="操作项" align="center"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" align="center" :formatter="filterTime"></el-table-column>
          <el-table-column prop="id" label="改单申请单号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.id || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单版本详情" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="oepnWin('OrderChangeDetail', {id:scope.row.id})">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime, formatString } from "@/utils";
import { getEditRecordList } from "@/api/order/orderManage";
export default {
  inject: ["reload"],
  name:"OrderModifyRecord",
  data() {
    return {
      query: {
        oldId:"",//请求id
        pageNum: 1,
        pageSize: 10
      },
      type: "",
      totalPage: 0,
      tableData: null
    };
  },
  components: {},
  mounted() {
    this.query.oldId = this.$route.query.id;
    this.getTableData();
  },
  methods: {
    getTableData() {
      getEditRecordList(this.query).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
        }
      });
      
    },
    filterTime(row) {
      return parseTime(row.createTime);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      if (val != this.query.pageNum) return false;
      this.query.pageNum = val;
      this.getTableData();
    },
    oepnWin(name, query) {
      this.$router.push({name : name, query : query});
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 20px 0 0 0;
    line-height: 50px;
    .listBoxTop {
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
    margin-top: 10px;
    float: right;
  }
}
</style>
