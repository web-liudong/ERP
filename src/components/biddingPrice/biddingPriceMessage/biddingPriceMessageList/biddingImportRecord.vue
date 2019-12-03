<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button  size="small" :class="{ active: buttonshow==0 }" @click="header_button_bidding()">竞价信息</el-button>
      <el-button  size="small" :class="{ active: buttonshow==1 }" @click="header_button_result()">竞价结果</el-button>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconshujuliebiao"></i>数据列表</span>
        <el-table
          :data="tableData"
          border
          :max-height="dataListHeight"
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
            prop="userName"
            label="操作者"
            align="center">
          </el-table-column>
          <el-table-column
            prop="importTime"
            label="操作时间"
            :formatter="createTimes"
            align="center">
          </el-table-column>
          <el-table-column
            label="导入文件"
            align="center">
            <template slot-scope="scope">
              <el-button @click="downfile(scope.row)" type="text" v-if="scope.row.importFilePathDTO">{{scope.row.importFilePathDTO.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="导入失败反馈"
            align="center">
            <template slot-scope="scope">
                <el-button @click="downfile1(scope.row)" type="text" v-if="scope.row.importErrorFilePathDTO">{{scope.row.importErrorFilePathDTO.name}}</el-button>
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
          :page-size="pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="paginations.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    importPriceInfoRecord,
    importResultPriceInfoRecord
  } from '@/api/biddingPrice/biddingPriceMessage'
  
  import {parseTime} from "@/utils";
  
  export default {
    name:'BiddingPriceImportRecord',
    inject:['close'],
    data() {
      return {
        //table表格的数据结构
        tableData:[],
        pageNum: 1,
        pageSize: 10,
        buttonshow:0,
        headerData:[],        
        //分页器
        paginations:{
          total:0,
        }
      }
    },
    created(){
      this.header_button_bidding();
    },
    activated(){
      if(this.$route.params.isUpdate){
        this.header_button_bidding()
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    methods: {
      //获取数据列表
      header_button_bidding(){
        this.buttonshow=0;
        let a={
      		pageNum: this.pageNum,
          pageSize: this.pageSize
      	}
        importPriceInfoRecord(a).then(res=>{
          //获取导入文件
          this.tableData=res.data.items;
          this.paginations.total=res.data.total;
          this.pageNum=res.data.pageNum;
          this.pageSize=res.data.pageSize;
        })
      },
      header_button_result(){
        this.buttonshow=1;
        let a={
      		pageNum: this.pageNum,
          pageSize: this.pageSize
      	}
        importResultPriceInfoRecord(a).then(res=>{
          //获取导入文件
          this.tableData=res.data.items;
          this.paginations.total=res.data.total;
          this.pageNum=res.data.pageNum;
          this.pageSize=res.data.pageSize;
        })
      },
      getDataList(){
      	if(this.buttonshow==1){
          this.header_button_result();
        }else{
          this.header_button_bidding()
        }
      },
      typeIndex(index) {
	 			return index + (this.pageNum - 1) * this.pageSize + 1;
	 			//这个是默认一页显示十条数据
			},
      handleSizeChange(val) {
        this.pageSize=val;
        this.getDataList();
      },
      handleCurrentChange(val) {
        this.tableData=[]
        this.pageNum=val
        this.getDataList();
      },
      createTimes(row){
        var date =row.importTime.replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        return date;
      },
      showHelp(){
        this.isShow=!this.isShow;
      },
      downfile(row){
        let href = '/api/file-service/file/download?id='+row.importFilePathDTO.id + '&access_token='+this.$auth.token;
        window.open(href, '_blank')
      },
      downfile1(row){
        let href = '/api/file-service/file/download?id='+row.importErrorFilePathDTO.id + '&access_token='+this.$auth.token;
        window.open(href, '_blank')
      },
    }
  }
</script>
<style scoped lang="less">
  .brandBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .el-button {
        width: 160px;
        height: 30px;
      }
      .active{
      	background-color: #339999;
      	border-color: #339999;
      	color: #FFFFFF;
      }
    }
    .listBox {
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
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
      margin-top: 2px;
      float: right;
    }
  }
</style>
