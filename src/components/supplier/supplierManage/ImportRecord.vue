<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>数据列表</span>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            type="index"
            width="100"
 						:index="typeIndex"
            label="序号"
            align="center">
            
          </el-table-column>
          <el-table-column
            label="操作者"
            align="center">
            <template slot-scope="scope">
            	{{scope.row.userInfo.userFullName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="importTime"
            label="操作时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="导入文件"
            align="center">
            <template slot-scope="scope">
              <el-button @click="downfile(scope.row.fileDTO.id)" type="text" v-if="scope.row.fileDTO">{{scope.row.fileDTO.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="导入失败反馈"
            align="center">
            <template slot-scope="scope">
                <el-button @click="downfile(scope.row.errorFileDTO.id)" type="text" v-if="scope.row.errorFileDTO">{{scope.row.errorFileDTO.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          layout="total, sizes,prev, pager, next, jumper"
          :total="paginations.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
  	importList
	} from '@/api/basicSupplier'
  import  Butt from '../../common/Button/index'
  export default {
    inject:['close'],
    name:'SupplierListImportRecord',
    data() {
      return {
        //table表格的数据结构
        tableData: [],
          pageNum: 1,
          pageSize: 10,
        
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
      	let a={
      		pageNum: this.pageNum,
          pageSize: this.pageSize
      	}
        importList(a).then(res=>{
          //获取导入文件
          this.tableData=res.data.items;
          this.paginations.total=res.data.total;
        })
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
        this.pageSize=val
        this.getDataList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.tableData=[]
        this.pageNum=val
        this.getDataList();
      },
      showHelp(){
        this.isShow=!this.isShow;
      },
      downfile(id){
      let href = '/api/file-service/file/download?id='+id + '&access_token='+this.$auth.token;
      window.open(href, '_blank')
    	},
     
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
