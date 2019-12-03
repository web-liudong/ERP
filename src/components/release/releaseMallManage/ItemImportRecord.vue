<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listHeaderBox"><span>项目：</span></div>
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>数据列表</span>
        <el-table
          :data="BrandImportFileLogDTO"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            prop="id"
            label="序号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userId"
            label="操作者"
            align="center">
          </el-table-column>
          <el-table-column
            prop="importTime"
            label="操作时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="导入文件"
            align="center">
            <template slot-scope="scope">
              <el-button type="text">{{scope.row.importFileName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="userId"
            label="导入失败反馈"
            align="center">
            <template slot-scope="scope">
              <router-link :to="{userId:'BrandUpid'}" target="_blank">
                <el-button type="text">{{scope.row.importFilePath}}</el-button>
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
          :current-page.sync="findMallCategoryMatchImportFileLogParam.pageNum"
          :page-size="findMallCategoryMatchImportFileLogParam.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paginations.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {findBrandImportFileLogDTOList} from '@/api/brandManage'
  import {importItemCorrespondList} from '@/api/release/mallProjectManage'
  export default {
    inject:['reload'],
    data() {
      return {
        //table表格的数据结构
        BrandImportFileLogDTO: [{
          id:0,
          importErrorFileId:0,
          useId:0,
          importErrorFileName:'',
          importErrorFilePath:'',
          importTime:'',
          importFileId:0,
          importFileName:'',
          importFilePath:'',
        }],
        //品牌导入的参数
        findMallCategoryMatchImportFileLogParam:{
          pageNum: 1,
          pageSize: 10
        },
        //分页器
        paginations:{
          total:0,
        }
      }
    },
    created(){
      //获取数据列表
      this.getDataList();

    },
    methods: {
      //获取数据列表
      getDataList(){
        importItemCorrespondList(this.findMallCategoryMatchImportFileLogParam).then(res=>{
          console.log(res);
          //获取导入文件
          this.BrandImportFileLogDTO=res.data.items;
          console.log(this.BrandImportFileLogDTO);
          this.paginations.total=res.data.total;
          this.BrandImportFileLogDTO.pageNum=res.data.pageNum;
          this.BrandImportFileLogDTO.pageSize=res.data.pageSize;
        })
      },
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
      .listHeaderBox{
        border-bottom: 1px solid #e4e4e4;
        height: 50px;
        line-height: 50px;
        span{
          margin-left: 10px;
          font-size: 14px;
          color: red;
        }
      }
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
