<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" size="small">
        <el-table-column type="index" width="100" align="center"></el-table-column>
        <el-table-column prop="userName" label="操作者" align="center" width="300"></el-table-column>
        <el-table-column prop="operationTime" label="操作日期" align="center" width="300"></el-table-column>
        <el-table-column prop="description" label="操作内容" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.description.split(',')[0]}}</div>
            <div>{{scope.row.description.split(',')[1]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import elDragDialog from "../../../directive/el-dragDialog/index";
import { logList } from "@/api/customerManage";
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      total: 0,
      pageSize:10
    };
  },
  created() {
    this.getlist();
  },
  activated() {
    this.getlist();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlist(1);
    },
    handleCurrentChange(val) {
      this.getlist(val);
    },
    getlist(page) {
      logList({
        pageNum: this.page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  margin-bottom: 100px;
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 20px 0 0 0;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      .listBoxTop-left {
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
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
    }
  }
  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .my-scroll-bar {
    height: 200px;
  }
}
</style>


