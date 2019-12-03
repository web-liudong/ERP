<template>
  <div class="entryTicketBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:query.type==0}"
        @click="switchStatus(0)"
      >档案数据</el-button>
      <el-button
        size="small"
        :class="{active:query.type==1}"
        @click="switchStatus(1)"
      >业务数据</el-button>
    </div>
    <div class="filterBox">
      <div class="filterTop">
        <div class="topLeft">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询 </span>
        </div>
        <div class="topRight">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up">展开筛选</i>
          </span>
          <el-button size="small" @click="clearForm()">重置</el-button>
          <el-button size="small" @click="queryForm()">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="filterBottom clear" v-show="isShow">
        <div class="inputBox">
          <span>创建时间：</span>
          <el-date-picker
            v-model="dataTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox clear">
      <div class="listTop">
        <div class="topleft">
          <i class="iconfont icon-liebiao"></i>
          <span>数据列表</span>
        </div>
      </div>
      <div class="list">
        <el-table
          :data="tableData"
          :max-height="dataListHeight"
          stripe
          styel="width: 100%"
          border
        >
          <el-table-column prop="fileId" label="表格名称" align="center">
            <template slot-scope="scope">
              {{scope.row.endDate}}{{scope.row.type == 0 ? "档案数据" : "业务数据"}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatTime"></el-table-column>
          <el-table-column label="数据范围" align="center">
            <template slot-scope="scope">
              {{scope.row.startDate+"~"+scope.row.endDate}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row.fileId)" v-if="$authorities.TplusDownload">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index";
import { exportRecordList } from "@/api/finance/invoice";
export default {
  inject: ["reload","isFilterShow"],
  name:"ExportTPlusRecord",
  data() {
    return {
      query: {
        endDateTime: null,
        pageNum: 1,
        pageSize: 10,
        type:0,
        startDateTime: null
      },
      total: 0,
      dataTime: "",
      isShow: this.isFilterShow,
      tableData: [],
    };
  },
  created() {
    this.getTable();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getTable();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    //查询结果
    queryForm() {
      this.query.pageNum = 1;
      this.getTable();
    },
    clearForm(){
      this.query = {
        endDateTime: null,
        pageNum: 1,
        pageSize: 10,
        type:0,
        startDateTime: null
      }
      this.getTable();
    },
    //获取回票列表
    getTable() {
      this.query.startDateTime = this.dataTime ? this.dataTime[0] : "";
      this.query.endDateTime = this.dataTime ? this.dataTime[1] : "";
      exportRecordList(this.query).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTable();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTable();
    },
    formatTime(o){
      return parseTime(o.createTime);
    },
    downloadFile(id){
      let href = `/api/file-service/file/download?id=${id}&access_token=${this.$auth.token}`
      window.open(href,'blank');
    },
    switchStatus(val){
      if (val == this.query.type) return false;
      this.query.type = val;
      this.queryForm();
    }
  }
};
</script>

<style lang='less' scoped>
.entryTicketBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .el-button {
      width: 160px;
      height: 30px;
    }
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    margin: 10px auto;
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    .filterTop {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      .topLeft {
        float: left;
        padding-left: 20px;
      }
      .topRight {
        float: right;
        padding-right: 10px;
        .el-button {
          margin-left: 15px;
        }
      }
    }
    .filterBottom {
      border-top: 1px solid #e4e4e4;
      .inputBox {
        float: left;
        margin: 10px;
        .el-autocomplete {
          width: 200px;
          margin-left: 10px;
        }
      }
    }
  }
  .listBox {
    border: 1px solid #e4e4e4;
    background: #f5f5f5;
    .listTop {
      height: 50px;
      line-height: 50px;
      .topleft {
        float: left;
        padding-left: 20px;
      }
      .topright {
        float: right;
        padding-right: 20px;
      }
    }
  }
  .page {
    float: right;
    margin: 10px 0 0;
  }
}
</style>

