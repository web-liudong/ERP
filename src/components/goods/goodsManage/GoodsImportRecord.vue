<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listBoxTop">
        <span>数据列表</span>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            prop="date"
            label="序号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作者"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="brandstatus"
            label="导入文件"
            align="center">
            <template>
              <el-button type="text">某某文件.xlsx</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="导入失败反馈"
            align="center">
            <template>
              <router-link :to="{name:'BrandUpdate'}" target="_blank">
                <el-button type="text">某某文件.xslx</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="100"
          layout="total, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import  Butt from '../../common/Button/index'
  export default {
    inject:['reload'],
    name: "brand",
    data() {
      return {
        tableData: null,
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
      }
    },
    methods: {
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      showHelp(){
        this.isShow=!this.isShow;
      }
    }
  }
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
        .white-btn{
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
