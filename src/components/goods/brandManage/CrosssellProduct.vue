<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop"><span>筛选查询</span>
        <div class="rightBox">
          <span>收起筛选</span>
          <el-button size="small" class="w80 h40">查询结果</el-button>
        </div>

      </div>
      <div class="homeBoxBottom">
        <el-input
          placeholder="品牌名称"
          v-model="input2"
          clearable>
        </el-input>
        <el-input
          placeholder="品牌名称"
          v-model="input2"
          clearable>
        </el-input>
        <el-input
          placeholder="品牌名称"
          v-model="input2"
          clearable>
        </el-input>
      </div>
    </div>
    <div class="tableHeader bg1">
      <p>【戴尔品牌>>相关商品列表】</p>
    </div>
    <div class="contentBox">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="商品ID"
          width="500" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          align="center">
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: "CrosssellProduct",
    data() {
      return {
        tableData: [{
          date: '1000001',
          name: '印爽A4复印纸 70G 500张/包 5包/箱（计价单位：箱）',
        },
          {
            date: '1000001',
            name: '印爽A4复印纸 70G 500张/包 5包/箱（计价单位：箱）',
          },
          {
            date: '1000001',
            name: '印爽A4复印纸 70G 500张/包 5包/箱（计价单位：箱）',
          },
          {
            date: '1000001',
            name: '印爽A4复印纸 70G 500张/包 5包/箱（计价单位：箱）',
          },
          {
            date: '1000001',
            name: '印爽A4复印纸 70G 500张/包 5包/箱（计价单位：箱）',
          }],
        input2:'',
        currentPage4: 4,
      }
    },
    methods:{
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    }

  }
</script>
<style scoped lang="less">
  .brandBox{
    width: 100%;
    .filterBox{
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      margin-top: 10px;
      clear: both;
      line-height: 50px;
      span{
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox{
        float: right;
      }
      .el-button{
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom{
        height: 56px;
        border: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input{
          width: 200px;
          height: 34px;
          line-height: 56px;
          margin-left: 10px;
        }
      }
    }
    .tableHeader{
      margin-top: 20px;
      border: 1px solid #e4e4e4;
      height: 50px;
      p{
        line-height: 50px;
        font-size: 14px;
        color: #303133;
      }
    }
    .contentBox{
      margin-top: -2px;
      border: 1px solid #e4e4e4;

    }
    .block{
      margin-top: 10px;
    }



  }
</style>
