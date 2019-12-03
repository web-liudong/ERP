<template>
  <el-dialog title="发布确认" :visible.sync="isShow" class="releaseTable">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="small"
      max-height="400"
    >
      <el-table-column prop="shoppeNavigationName" label="对象名称" align="center"></el-table-column>
      <el-table-column prop="operationLogOperationName" label="动作" align="center"></el-table-column>
      <el-table-column prop="navigationName" label="所在导航位置" align="center"></el-table-column>
      <!-- <el-table-column label="操作" align="center" width="180px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="opaRevoke(scope.row)">撤销</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('dialogForm')">确定并发布</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { opaShoopeNavRelease } from "@/api/release/specialProjectManage";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      shoppeId:'',
      tableData: null,
    };
  },
  mounted() {

  },
  methods: {
    init(data) {
      this.shoppeId = data.shoppeId;
      this.getDataList();
      this.isShow = true;
    },
    getDataList(){
      opaShoopeNavRelease(this.shoppeId, 'get').then(res => {
        this.tableData = res.data;
        //this.totalPage = res.data.total;
      });
    },
    opaRevoke(row) {
      this.$confirm("确定要撤销此项更新吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "撤销成功!"
          });
        })
        .catch(() => {});
    },
    submitForm(name) {
      opaShoopeNavRelease(this.shoppeId, 'put').then(res => {
        if(res.code == "000000"){
          this.isShow = false;
          this.$emit("callback", "shoppeNavRelease");
        }
      });
    }
  }
};
</script>
<style scoped>
.releaseTable >>> .el-table__row td{
    padding: 8px 0;
    height: 30px;
}
</style>