<template>
  <div class="priceList">
    <div class="filterBox">
      <div class="leftBox">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?"收起筛选":"展开筛选"}}
          </span>
          <el-button size="small" class="w80 h40" @click="getList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="resetForm()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="bottomBox" v-show="isShow">
          <div class="module">
            <span>文件名称：</span>
            <el-input v-model="query.fileName" clearable placeholder="请输入"></el-input>
          </div>

          <div class="module">
            <span>任务状态：</span>
            <el-select style="width:50%;" v-model="query.status">
              <el-option label="全部状态" value></el-option>
              <el-option label="处理中" value="0"></el-option>
              <el-option label="完成" value="1"></el-option>
              <el-option label="失败" value="2"></el-option>
            </el-select>
          </div>

          <div class="module">
            <span class="demonstration">制表时间：</span>
            <el-date-picker v-model="query.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>

          <div class="module">
            <span class="demonstration">结束时间：</span>
            <el-date-picker v-model="query.finishTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>

          <div class="module" style="width:50%">
            <span>模块：</span>
            <el-input
              style="width:100%;"
              v-model="query.inputVal"
              clearable
              placeholder="一级模块/二级模块/三级模块"
            ></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <div class="mainBox">
      <div class="leftBox">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="rightBox"></div>
      </div>

      <el-table :data="tableData" :max-height="dataListHeight" border size="small">
        <el-table-column prop="no" label="任务编号" width="80" align="center"></el-table-column>
        <el-table-column prop="firstLevelModule" label="一级模块" width="120" align="center"></el-table-column>
        <el-table-column prop="secondLevelModule" label="二级模块" width="120" align="center"></el-table-column>
        <el-table-column prop="thirdLevelModule" label="三级模块" width="120" align="center"></el-table-column>
        <el-table-column prop="fileName" width="120" label="文件名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="制表时间" align="center"></el-table-column>
        <el-table-column prop="status" label="任务状态" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">处理中</span>
            <span v-if="scope.row.status==1">完成</span>
            <span v-if="scope.row.status==2">失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorUserName" label="制表人" align="center"></el-table-column>
        <el-table-column prop="finishTime" label="结束时间" align="center"></el-table-column>
        <el-table-column prop="description" label="失败原因" width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="$authorities.StatsDownloadOpaDown"
              type="text"
              size="small"
              @click="handleDown(scope.row.fileId)"
              v-show="scope.row.status==1"
            >下载</el-button>

            <el-button
              v-if="$authorities.StatsDownloadOpaDelete"
              type="text"
              size="small"
              @click="handleDelete(scope.row.id)"
              v-show="scope.row.status==2||scope.row.status==1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="block">
      <el-pagination
        :page-sizes="[10,20,30,40,50,100,500]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNum"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="删除提示" :visible.sync="DialogVisible" width="40%">
      <span>确定删除该记录？确定删除后将不可恢复</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getDataList, deleteData } from "@/api/statistics/taskTable";

export default {
  name: "statisticsTaskTable",
  inject: ["reload", "isFilterShow"],
  data() {
    return {
      isShow: this.isFilterShow,
      DialogVisible: false,
      removeId: "",
      total: 0,
      query: {
        pageSize: 10,
        pageNum: 1
      },
      tableData: []
    };
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  mounted() {
    this.getList();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getList();
    }
  },
  methods: {
    resetForm() {
      this.query = {
        pageSize: 10,
        pageNum: 1
      };
      this.getList();
    },
    handleDelete(id) {
      this.DialogVisible = true;
      this.removeId = id;
    },
    ensure() {
      deleteData(this.removeId)
        .then(res => {
          this.DialogVisible = false;
          if ((res.code = "000000")) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList();
          }
        })
        .catch(rej => {
          this.DialogVisible = false;
          console.log(rej);
        });
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    handleDown(id) {
      let token = "&access_token=" + this.$auth.token;
      let href = "/api/file-service/file/download?id=" + id + token;
      window.open(href, "_blank");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.pageNum = val;
      this.getList();
    },
    getList() {
      let data = Object.assign({}, this.query);
      if (data.inputVal) {
        let arr = data.inputVal.split("/");
        if (arr[0] && arr[0] != "") {
          data.firstLevelModule = arr[0];
        }
        if (arr[1] && arr[0] != "") {
          data.secondLevelModule = arr[1];
        }
        if (arr[2] && arr[0] != "") {
          data.thirdLevelModule = arr[2];
        }
      }
      delete data.inputVal;
      getDataList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.total;
      });
    }
  }
};
</script>
<style scoped lang='less'>
.selectBox {
  margin-top: 10px;
  .el-button {
    width: 160px;
    height: 30px;
  }
  .active {
    background-color: #339999;
    border-color: #339999;
    color: #ffffff;
  }
}
.filterBox {
  font-size: 12px;

  margin: 10px 0;
  clear: both;
  border: 1px solid #e4e4e4;
  .leftBox {
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
    i {
      margin-right: 5px;
    }
  }
  span {
    font-size: 14px;
    margin-left: 10px;
    color: #333;
  }
  .rightBox {
    float: right;
    overflow: hidden;
    height: 45px;
  }
  .el-button {
    float: right;
    height: 30px;
    margin: 10px 10px 0 10px;
  }
}

.el-table .cell {
  white-space: pre-line;
}
.bottomBox {
  border-top: 1px solid #e4e4e4;
  margin-top: -2px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  span {
    margin: 0 0 0 10px;
    flex: 0 0 100px;
    text-align: right;
  }
  .module {
    width: 25%;
    display: flex;
    align-items: center;
  }
  .el-input {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }
  .el-autocomplete {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }
  .el-select {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }

  .el-date-editor {
    margin: 10px 0 10px 10px;
    width: 100%;
  }
}
.mainBox {
  font-size: 12px;

  margin: 7px 0;
  clear: both;
  border: 1px solid #e4e4e4;
  .leftBox {
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
    i {
      margin-right: 5px;
    }
  }
  span {
    font-size: 14px;
    margin-left: 10px;
    color: #303133;
  }
  .rightBox {
    float: right;
    overflow: hidden;
    height: 45px;
  }
}
.abb {
  color: red;
}
.block {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
.people {
  /deep/.el-dialog__body {
    padding: 0 !important;
  }
}

table {
  width: 100%;

  td,
  th {
    border: 1px solid #d1d1d1;
    font-size: 14px;
    height: 53px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  th {
    font-weight: bold;
    text-align: right;
    width: 25%;
    background-color: #f2f2f2;
  }
  td {
    color: #666666;
    text-align: left;
    padding-left: 10px;
  }
}
</style>
 <style >
.el-tooltip__popper {
  height: 80px;
  background-color: white;
}
</style> 