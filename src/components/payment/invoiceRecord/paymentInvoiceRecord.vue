<template>
  <div>
    <div class="returnOrderBox">
      <div class="filterBox">
        <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
          <div class="rightBox">
            <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up"></i>收起筛选</span>
            <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
            <el-button size="small" class="w80 h40" @click="postBillExportFileLogList()">查询结果</el-button>
          </div>
        </div>
        <el-collapse-transition>
          <div class="homeBoxBottom" v-show="isShow">
            <span style="margin-left:20px;">创建时间：</span>
            <el-date-picker
              style=" margin: 10px 10px 10px 10px;"
              v-model="dateValue"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <div class="detaillBox"  >
      <div class="detaillTable clear">
        <div class="detaillTopBox">
          <span><i></i>开票记录</span>
        </div>
        <el-table
          :data="returnData.items"
          border
          stripe
          style="width: 90%"
          size="small">
          <el-table-column
            prop="importTime"
            label="操作者"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.userFullName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作时间"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.exportTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开票类别"
            align="center">
            <template slot-scope="scope">
              <span style="" v-if="scope.row.exportFileType==0">进项票</span>
              <span style="" v-if="scope.row.exportFileType==1">销项票</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="开票金额"
            align="center">
          </el-table-column>
          <el-table-column
            label="关联发票申请单"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.invoiceApplicationNos}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开票表格"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="getFileDownload(scope.row.exportFileId)">{{scope.row.name}}</el-button>
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
  </div>


</template>
<script>
  import {postBillExportFileLogList,} from "@/api/common/commonApi"
  export default {
    name: "paymentInvoiceRecord",
    data() {
      return {
        dateValue: '',
        //删选显示
        isShow: true,
        msg: '',
        returnData: {
          items: [],
          offset: 0,
          pageNum: 0,
          pageSize: 0,
          total: 0
        },
        query: {
          startDate:'',
          endDate:'',
          pageNum: 1,
          pageSize: 10,
        },
        currentPage: 1,
      }
    },
    watch: {
      //监听时间范围
      dateValue(a,b) {
        if (this.dateValue!=""&&this.dateValue){
          this.query.startDate=this.dateValue[0];
          this.query.endDate=this.dateValue[1]
        }
      },
    },
    created() {
     this.postBillExportFileLogList();
    },
    mounted() {
      //alert(this.$route.query.Id);

    },
    methods: {
      //跳转
      goInvoiceApply(row) {
        // console.log(row.id);
        const {href} = this.$router.resolve({
          name: 'InvoiceApply',
          query: {
            id: row.id
          }
        });
        window.open(href, '_blank')
      },
//查询结果
      //税收分类编码导入记录接口
      postBillExportFileLogList() {
        postBillExportFileLogList(
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
        this.postBillExportFileLogList();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postBillExportFileLogList();
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
      formatDate: function (val) {
        var dateee = new Date(val).toJSON();
        var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
        return date
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .returnOrderBox {
    width: 100%;
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop {
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        height: 48px;
        float: right;
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #BCBCBC;
          cursor: pointer;
          font-size: 12px;
        }
        span:hover {
          color: #303133;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 200px;
          height: 56px;
          line-height: 56px;
          margin-left: 10px;
        }
        .el-select {
          margin-left: 10px;
          line-height: 56px;
        }
      }
    }
  }
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
