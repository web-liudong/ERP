<template>
  <el-dialog title="发布内容" :visible.sync="isShow" class="releaseTable">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="small"
      max-height="400"
      v-loading="isLoading"
    >
      <el-table-column prop="name" label="对象名称" align="center"></el-table-column>
      <el-table-column prop="operation" label="动作" align="center"></el-table-column>
      <el-table-column prop="description" label="详情" align="center"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
import { formatString } from '@/utils';
export default {
  props: [],
  data() {
    return {
      logId:'',
      type:'',
      isLoading: false,
      isShow: false,
      tableData: null,
      apiMapping: {
        "shoppe-release-history":"/api/shoppe-release-service/shopperelease/shoppe/shoppesku/release-history/{0}",
        "navigation-release-history":"/api/shoppe-release-service/shopperelease/navigation/release-history/{0}"
      },
    };
  },
  mounted() {
  },
  computed: {
    requestUrl: function () {
      let url = "";
      switch (this.type) {
        default:
          url = formatString(this.apiMapping[this.type], this.logId);
          break;
      }
      return url;
    },
    resultTableData: function(){
      
    }
  },
  methods: {
    init(type, row) {
      this.logId = row.id;
      this.type = type;
      this.tableData = null;
      this.getDataList();
      this.isShow = true;
    },
    filterData(table){
      if(!table){
        return [];
      }
      this.tableData = table.map((value, index, array)=>{
        let obj = {};
        if(this.type == "shoppe-release-history"){
          obj = {
            "name":value.skuName,
            "operation":value.operationLogOperationName,
            "description":value.description
          }
        }else
        if(this.type == "navigation-release-history"){
          obj = {
            "name":value.shoppeNavigationName,
            "operation":value.operationLogOperationName,
            "description":value.navigationName
          }
        }
        return obj;
      })
    },
    getDataList(){
      this.isLoading = true;
      request({
        url: this.requestUrl,
        method:'get',
        unloading:true
      }).then(res => {
        this.isLoading = false;
        if(this.type == "shoppe-release-history"){
          this.filterData(res.data);
        }else{
          this.filterData(res.data);
        }
      });
    },
  }
};
</script>
<style scoped>
.releaseTable >>> .el-table__row td{
    padding: 8px 0;
    height: 30px;
}
</style>