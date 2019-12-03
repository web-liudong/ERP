<template>
  <!--导入记录-->
  <div class="wrapper">
    <div class="form">
      <div class="table-head">
        <p class="table-head-text">数据列表</p>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          label="序号"
          align="center" width="50" type="index">
        </el-table-column>
        <el-table-column
          prop="userInfo.realName"
          label="操作者"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          align="center">
        </el-table-column>
        <el-table-column
          label="发布内容预览"
          align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            </template>
        </el-table-column>
        <el-table-column
          label="发布结果"
          align="center">
            <template slot-scope="scope">
              <span>{{scope.row.succeeded?'成功':'失败'}}</span>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10,20,30,40,50,100,500]" @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="发布预览" :visible.sync="releasedialog">
      <span>更新预览</span>
      <el-table :data="tableRelease" border class="scroll-dialog">
          <el-table-column prop="navigationName" label="名称" align="center"></el-table-column>
          <el-table-column label="动作" align="center" prop="operationLogOperationName"></el-table-column>
          <el-table-column  label="位置" align="center" prop="navigationLocation"></el-table-column>
          </el-table>
      </el-dialog>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {releaseLog,releaseHistory} from '@/api/release/navManage'
  export default {
    name:'ReleaseLog',
    data() {
      return {
        page:1,
        total:0,
        tableData: [],
        releasedialog:false,
        tableRelease:[],
        pageSize:10
      };
    },
    activated(){
      this.getdata(1)
    },
    methods: {
      getdata(page){
        releaseLog({
          pageNum:page,
          pageSize:this.pageSize
        }).then(res=>{
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        })
      },
      handleCurrentChange(val) {
        this.getdata(val);
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.getdata(1);
      },
      goDetail(id){
        releaseHistory(id).then(res=>{
          if(res.code=='000000'){
            this.releasedialog = true;
            this.tableRelease = res.data;
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .wrapper{
    .form{
      border: 1px solid #e4e4e4;
      margin-top:20px;
      .table-head{
        width: 100%;
        height: 50px;
        background-color: #f3f3f3;
        .table-head-text{
          color: #666;
          font-size: 15px;
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    .block{
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
    .scroll-dialog{
      max-height: 500px;
      overflow:auto;
    }
  }
</style>
