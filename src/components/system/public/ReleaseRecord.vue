<template>
  <div class="brandBox">
    <div class="listBox">
      <div class="listBoxTop">
        <span>发布记录</span>
        <el-table :data="tableResetData" border style="width: 100%" size="small">
          <el-table-column prop="userName" label="操作者" align="center"></el-table-column>
          <el-table-column prop="operationTime" label="操作时间" align="center" :formatter="filterTime"></el-table-column>
          <el-table-column label="发布内容" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="showDialog(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="succeeded" label="发布结果" align="center" :formatter="filterResult"></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>

    <showRelease ref="showRelease"></showRelease>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Butt from "../../common/Button/index";
import request from "@/utils/request";
import { parseTime, formatString } from "@/utils";
import showRelease from "./child/show_release";
export default {
  name:'SysReleaseRecord',
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10
      },
      apiMapping: {
        "shoppe-release-history":
          "/api/shoppe-release-service/shopperelease/shoppe/{0}/shoppesku/release-log",
        "navigation-release-history":
          "/api/shoppe-release-service/shopperelease/navigation/{0}/navigation-release-log"
      },
      reqId: "", //请求id
      type: "",
      totalPage: 0,
      tableData: []
    };
  },
  computed: {
    requestUrl: function() {
      let url = "";
      switch (this.type) {
        default:
          url = formatString(this.apiMapping[this.type], this.reqId);
          break;
      }
      return url;
    },
    tableResetData: function() {
      //数据格式不一样需要组装
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          operationTime: value.operationTime,
          id: value.id,
          succeeded: value.succeeded,
          userId: value.userId || (value.userInfo && value.userInfo.id),
          userName: value.userName || value.userInfo.userFullName
        };
      });
      return tempArr;
    }
  },
  components: {
    showRelease
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.reqId != this.$route.query.type != this.type){
      this.init();
    }
  },
  methods: {
    init(){
      this.reqId = this.$route.query.id;
      this.type = this.$route.query.type;
      this.getTableData();
    },
    getTableData() {
      request({
        url: this.requestUrl,
        method: "get",
        params: this.query
      }).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    filterResult(row) {
      return row.succeeded ? "成功" : "失败";
    },
    filterTime(row) {
      return parseTime(row.operationTime);
    },
    showDialog(row) {
      this.$refs["showRelease"].init(this.type, row);
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
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
