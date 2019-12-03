<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1" v-if="tableData!=null">
        <tr>
          <th>新客户编号：</th>
          <td>{{tableData.newCustomerNo}}</td>
          <th>新客户名称：</th>
          <td>{{tableData.newCustomerName}}</td>
        </tr>
        <tr>
          <th>关联旧客户ID：</th>
          <td>{{tableData.oldCustomerId}}</td>
          <th>
            <i>*</i> 旧客户名称：
          </th>
          <td style="max-width:500px">{{tableData.oldCustomerName}}</td>
        </tr>
        <tr>
          <th>旧客户类型：</th>
          <td colspan="3">{{tableData.oldCustomerTypeText}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table :data="formData" border style="width: 90%" size="small">
        <el-table-column prop="userInfo" label="操作者" style="width: 33%" align="center">
          <template slot-scope="scope">
            {{scope.row.userInfo.userFullName}}
          </template>
        </el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationText" label="操作描述" style="width: 33%" align="center">
          <template slot-scope="scope">
            {{scope.row.operationText}}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="closed()">关闭</el-button>
    </div>
  </div>
</template>
<script>
import { findProjectCorrespondDetail } from "@/api/goods/customCorrespondManage";
import addhead from "@/components/common/head/head";
export default {
  inject: ["close"],
  name: "CustomCorrespondDetail",
  data() {
    return {
      tableData: null,
      formData: null,
      ID: null,
    };
  },
  methods: {
    closed() {
      this.close({
        name: "CustomCorrespondDetail",
        to: { name: "CustomCorrespondManage", params: { isUpdate: true } }
      });
    },
    getDetail() {
    findProjectCorrespondDetail(this.ID).then(res => {
      this.tableData = res.data;
      this.formData = res.data.mappingOperationLogDTOList;
    });
  },
  },
  components: {
    addhead
  },
  
  activated() {
    this.ID = this.$route.query.id;
    this.getDetail();
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
    .detaillTopBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #d1d1d1;
      span {
        line-height: 50px;
        margin-left: 10px;
      }
    }
    table {
      width: 90%;
      margin: 20px auto;
      .classifyBox {
        max-height: 51px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        width: 264.5%;
      }
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 14px;
        height: 53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        color: #303133;
        text-align: right;
        width: 20%;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 30%;
        word-break: break-all;
      }
    }
  }
  .detaillTable2 {
    border: 1px solid #d1d1d1;
    border-top: none;
    .detaillTopBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #d1d1d1;
      span {
        line-height: 50px;
        margin-left: 10px;
      }
    }
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
    }
    .el-button {
      float: right;
      margin: 10px 20px;
    }
  }
}
</style>



<style lang="less">
.detaillBox {
  .detaillTable {
    .el-dialog {
      margin-top: 0vh !important;
      .el-dialog_header {
        padding: 0px;
      }
      .el-dialog_body {
        padding: 0px;
      }
    }
  }
}
</style>


