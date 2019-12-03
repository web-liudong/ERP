<template>
  <el-dialog title="服务方服务费率修改记录" :visible.sync="isShow">
       <el-table
    :data="tableData"
    height="250"
    border
    style="width: 100%">
    <el-table-column
      prop="changeUserName"
      label="修改者">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="修改申请时间"
      :formatter="filterTime">
    </el-table-column>
    <el-table-column
      prop="changeReason"
      label="修改原因">
    </el-table-column>
     <el-table-column
      prop="oldServiceFeeRate"
      label="改前服务费率">
      <template slot-scope="scope">
              {{scope.row.oldServiceFeeRate*100}}%
            </template>
    </el-table-column>
     <el-table-column
      prop="newServiceFeeRate"
      label="改后服务费率">
      <template slot-scope="scope">
              {{scope.row.newServiceFeeRate*100}}%
            </template>
    </el-table-column>
     <el-table-column
      prop="reviewStatus"
      label="审核结果">
      <template slot-scope="scope">
              {{scope.row.reviewStatus==0?'待审核':scope.row.reviewStatus==1?'已通过':scope.row.reviewStatus==2?'已驳回':''}} <br/>   
              {{scope.row.noPassReason}}
            </template>
    </el-table-column>
     <el-table-column
      prop="reviewUserName"
      label="审核人">
    </el-table-column>
     <el-table-column
      prop="updateTime"
      label="审核时间"
      :formatter="filterTime2">
    </el-table-column>
  </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isShow=false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {getRateAuditeOldData} from '@/api/ordernodraft';
import {parseTime} from '@/utils/index'
export default {
  props: {},
  data() {
    return {
      isShow: false,
      tableData:null,
    };
  },
  mounted() {},
  methods: {
    init(id) {
      this.isShow = true;
      getRateAuditeOldData(id).then(res=>{
           this.tableData=res.data;
           console.log(this.tableData,'whp999');
           
      })
    },
    filterTime(row){
      return parseTime(row.createTime);
    },
    filterTime2(row){
      return parseTime(row.updateTime);
    },
    
  }
};
</script>
<style scoped lang="less">
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-autocomplete {
  width: 100%;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
.dialogWrap >>> .el-dialog__body {
  height: 50vh;
  overflow: auto;
}
</style>
