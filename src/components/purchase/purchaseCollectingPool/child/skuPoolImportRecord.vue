<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <el-table :data="tableData" border style="width: 100%" size="small">
          <el-table-column type="index" width="100" :index="typeIndex" label="序号" align="center"></el-table-column>
          <el-table-column prop="userInfo.userFullName" label="操作者" align="center"></el-table-column>
          <el-table-column prop="importTime" label="操作时间" align="center"></el-table-column>
          <el-table-column label="导入文件" align="center">
            <template slot-scope="scope">
              <el-button
                @click="downfile(scope.row)"
                type="text"
                v-if="scope.row.importFileDTO!==null"
              >{{scope.row.importFileDTO.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="导入失败反馈" align="center">
            <template slot-scope="scope">
              <el-button
                @click="downfile1(scope.row)"
                type="text"
                v-if="scope.row.importErrorFileDTO!==null"
              >{{scope.row.importErrorFileDTO.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="paginations.total"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { importList } from "@/api/purchase/purchaseCollectingPool";
export default {
  inject: ["close"],
  name: "skuPoolImportRecord",
  data() {
    return {
      //table表格的数据结构
      tableData: [],
      pageNum: 1,
      pageSize: 10,

      //分页器
      paginations: {
        total: 0
      }
    };
  },
  created() {
    //获取数据列表
    this.getDataList();
  },
  methods: {
    //获取数据列表
    getDataList() {
      let a = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      importList(a).then(res => {
        //获取导入文件
        this.tableData = res.data.items;
        console.log(this.tableData,'888');
        this.paginations.total = res.data.total;
        this.pageNum = res.data.pageNum;
        this.pageSize = res.data.pageSize;
      });
    },
    typeIndex(index) {
      return index + (this.pageNum - 1) * this.pageSize + 1;
      //这个是默认一页显示十条数据
    },
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.tableData = [];
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.tableData = [];
      this.pageNum = val;
      this.getDataList();
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    downfile(row) {
      let href =
        "/api/file-service/file/download?id=" +
        row.importFileDTO.id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    },
    downfile1(row) {
      let href =
        "/api/file-service/file/download?id=" +
        row.importErrorFileDTO.id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
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
