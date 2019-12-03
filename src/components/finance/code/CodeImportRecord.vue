<template>
  <div class="detaillBox"  v-if="$authorities.CodeBulkImportRelevant" >
    <div class="detaillTable clear">
      <div class="detaillTopBox">
        <span><i></i>导入记录</span>
      </div>
      <el-table
        :data="returnData.items"
        border
        stripe
        style="width: 90%"
        size="small">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          label="操作者"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="importTime"
          label="操作时间"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.importTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="导入文件"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getFileDownload(scope.row.importFileDTO.id)">{{scope.row.importFileDTO.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="importErrorFileName"
          label="导入失败反馈"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getFileDownload(scope.row.importErrorFileDTO.id)">{{scope.row.importErrorFileDTO.name}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="returnData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total">
        </el-pagination>
      </div>
    </div>
  </div>

</template>
<script>
  import {
    postCodeLogList,
    getCodeInfo,
    deleteCodeDelete,
    postCodeCreate,
    postCodeImport,
    postCodeList,
    putCodeUpdate
  } from '@/api/finance/code'
  export default {
    name: "FinanceCodeImportRecord",
    data() {
      return {
        msg: '',
        returnData: {
          items: [],
          offset: 0,
          pageNum: 0,
          pageSize: 0,
          total: 0
        },
        query: {
          pageNum: 1,
          pageSize: 10,
        },
        tableDataMis: {
          id: '1000001',
          name: '清华同方',
          address: '同方股份有限公司',
          brandstatus: '草稿 审核情况 '
        },
        tableData: [{
          date: '领先未来北京总部>供应链>胡卫卫',
          name: '2017-07-19 14:48:38 ',
          address: '审核通过',
        }, {
          date: '领先未来北京总部>供应链>胡卫卫',
          name: '2017-07-19 14:48:38 ',
          address: '审核通过',
        },
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          },
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          }
          ,
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          }
          ,
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          }],
        currentPage: 1,
      }
    },
    created() {
      this.postCodeLogList();
    },
    mounted() {
      //alert(this.$route.query.Id);

    },
    methods: {

      //税收分类编码导入记录接口
      postCodeLogList() {
        postCodeLogList(
          this.query
        ).then((res) => {
          this.returnData=res.data;
          console.log(res);
        }).catch(err => {

        });
      },
      //单独文件下载
      getFileDownload(id) {
        // console.log(row.id);
        let token='&access_token='+this.$auth.token;
        let href = '/api/file-service/file/download?id='+id + token;
        window.open(href, '_blank')
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postCodeLogList();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postCodeLogList();
      },
      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.Id;
        // 将数据放在当前组件的数据内
        this.msg = routerParams;
        console.log(this.msg);
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    },
    filters: {
      //时间截取字符串
      formatDate: function (value) {
        return value.substring(0, 10);
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .detaillBox {
    width: 100%;
    padding-top: 10px;
    .detaillTable {
      border: 1px solid #d1d1d1;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-table {
        margin: 20px auto;
        width: 90%;
        .el-button {
          font-size: 12px;
        }
      }
    }
  }

  .block {
    margin-top: 10px;
    margin-right: 20px;
    text-align: right;
  }

</style>
