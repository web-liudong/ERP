<template>
  <div class="detaillBox" v-if="!loading">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1">
        <tr>
          <th>项目编号：</th>
          <td>{{tableData.projectNo}}</td>
          <th>项目名称：</th>
          <td>{{tableData.projectName}}</td>
        </tr>
        <tr>
          <th>项目类型：</th>
          <td>{{tableData.typeName}}</td>
          <th>项目集团负责人：</th>
          <td>{{tableData.userName+'-'+tableData.userRealName}}</td>
        </tr>
        <tr>
          <th>项目发布负责人：</th>
          <td>{{tableData.publisherName+'-'+tableData.publisherRealName}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table :data="tableData.shoppeOperationLogDTOs" border style="width: 90%" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center" :formatter="parseTime">
        </el-table-column>
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
import { getShoppeDetail } from "@/api/release/specialProjectManage";
import { parseTime } from '@/utils';
export default {
  inject: ["close"],
  name:'ShoppeProjectDetail',
  data() {
    return {
      id: 0,
      loading:true,
      tableData:null,
      tempData:{
        items:[
          {
            id:1,
            userName:'领先未来北京总部>供应链>胡卫卫',
            operationTime:'2017-07-19 14:48:38',
            operationDescription:'编辑导航',
          }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.id){
      this.init();
    }
  },
  components: {
    addhead
  },
  methods: {
    init(){
      this.id = this.$route.query.id;
      this.getdata();
    },
    getdata() {
      //this.tableData = this.tempData.items;
      getShoppeDetail(this.id).then(res => {
        this.loading = false;
        if (res.code == "000000") {
            this.tableData = res.data;
        }
      });
    },
    parseTime(row, column){
      return parseTime(row.operationTime);
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
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