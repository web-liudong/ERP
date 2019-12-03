<template>
  <div class="detaillBox" v-if="tableData">
    <div class="detaillTitle">
      <p class="title">{{tableData.projectName}}</p>
    </div>
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1">
        <tr>
          <th>导航ID：</th>
          <td>{{tableData.id}}</td>
          <th>导航级别：</th>
          <td>{{levelVal}}</td>
        </tr>
        <tr>
          <th>{{levelVal}}导航名称：</th>
          <td>{{tableData.name}}</td>
          <th>{{levelVal}}导航状态：</th>
          <td>{{tableData.available ? "可用" : "禁用"}}</td>
        </tr>
        <tr>
          <th>显示优先级：</th>
          <td>{{tableData.index}}</td>
          <th>关联分类：</th>
          <td>无</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table :data="tableData.navigationOperationLogDTOs" border style="width: 90%" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center" :formatter="parseTime"></el-table-column>
        <el-table-column prop="operationName" label="操作描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { getNavDetails } from "@/api/release/specialProjectManage";
import { parseTime } from "@/utils";
export default {
  inject: ["close"],
  name:"ShoppeNavDetail",
  data() {
    return {
      id: '',
      level: '',
      levelVal: "一级",
      tableData: null,
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.id || this.$route.query.level != this.level){
      this.init();
    }
  },
  components: {
    addhead
  },
  methods: {
    init(){
      this.id = this.$route.query.id;
      this.level = this.$route.query.level;
      this.getdata();
    },
    getdata() {
      getNavDetails(this.id).then(res => {
        if (res.code == "000000") {
            this.tableData = res.data;
        }
      });
    },
    parseTime(row, column){
      return parseTime(row.operationTime);
    }
  },
  watch: {
    level(val) {
      this.levelVal = {1:'一级',2:'二级',3:'三级'}[val];
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .detaillTitle {
    background-color: #f3f3f3;
    margin: 10px 0;
    border: 1px solid #e4e4e4;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgb(228, 228, 228);
    .title {
      margin-left: 10px;
      font-size: 14px;
      line-height: 50px;
      display: inline-block;
    }
  }
  .detaillTable {
    border: 1px solid #d1d1d1;
    table {
      width: 90%;
      margin: 20px auto;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 14px;
        height: 53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        padding-right: 6px;
        box-sizing: border-box;
        color: #666;
        font-weight: 700;
        font-size: 14px;
        text-align: right;
        width: 20%;
        background-color: #f9fafc;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 30%;
      }
    }
  }
  .detaillTable2 {
    border: 1px solid #d1d1d1;
    border-top: none;
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
      width: 90%;
      margin: 0 auto 20px;
    }
  }
}
</style>