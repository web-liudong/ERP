<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listHeaderBox"><span>项目：</span></div>
      <div class="centerBox">
        <span>操作时间范围：</span>
        <el-date-picker
          v-model="value6"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
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
          :current-page.sync="brandImportFileLogParam.pageNum"
          :page-size="brandImportFileLogParam.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paginations.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {findBrandImportFileLogDTOList} from '@/api/brandManage'
  export default {
    inject:['reload'],
    userId: "brand",
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
        brandImportFileLogParam:{
          pageNum: 1,
          pageSize: 10
        },
        //分页器
        paginations:{
          total:0,
        },
        value6: '',
      }
    },
    created(){
      //获取数据列表
      this.getDataList();
    },
    methods: {
      //获取数据列表
      getDataList(){
        findBrandImportFileLogDTOList(this.brandImportFileLogParam).then(res=>{
          console.log(res);
          //获取导入文件
          this.BrandImportFileLogDTO=res.data.items;
          console.log(this.BrandImportFileLogDTO);
          this.paginations.total=res.data.total;
          this.BrandImportFileLogDTO.pageNum=res.data.pageNum;
          this.BrandImportFileLogDTO.pageSize=res.data.pageSize;
          /*  getFile(36).then(response=>{
              console.log(response);
              //this.BrandImportFileLogDTO.fileList=[response.data];
              //console.log(this.BrandImportFileLogDTO.fileList);
           /!*   this.BrandImportFileLogDTO.name=response.data.name;
              this.BrandImportFileLogDTO.path=response.data.path;*!/
               this.BrandImportFileLogDTO=this.BrandImportFileLogDTO.forEach(item=>{
                 Vue.set(item,importFileName,response.data.importFileName)
                 Vue.set(item,importFilePath,response.data.importFilePath)
                 //item.name=response.data.name;
                 //item.path=response.data.path;
              })
              console.log(this.BrandImportFileLogDTO);
              //console.log(this.BrandImportFileLogDTO.name);
            })*/
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
      .centerBox{
        background: white;
        height: 80px;
        line-height: 80px;
        border-bottom: 1px solid #e4e4e4;
        padding-left: 20px;
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
