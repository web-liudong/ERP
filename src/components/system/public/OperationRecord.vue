<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div style="border-bottom: 1px solid #e4e4e4;height: 50px">
          <p class="title" style="color:red">项目:{{shoppeName}}</p>
        </div>
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer;margin-right:10px">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow" v-show="show">
        <span>操作时间范围：</span>
        <el-date-picker
          v-model="query.operationTimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期">
        </el-date-picker>
        <span style="margin-right:20px;">至</span>
        <el-date-picker
          v-model="query.operationTimeEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期">
        </el-date-picker>
      </div>
      </el-collapse-transition>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow" v-show="!show">
        <span>操作时间范围：</span>
        <el-date-picker
          v-model="query.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期">
        </el-date-picker>
        <span style="margin-right:20px;">至</span>
        <el-date-picker
          v-model="query.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期">
        </el-date-picker>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>操作记录</span>
        <el-table :data="tableResetData" border style="width: 100%" size="small" :max-height="dataListHeight">
          <el-table-column prop="userName" label="操作者" align="center"></el-table-column>
          <el-table-column prop="operationTime" label="操作时间" align="center" v-if="type!='mall-item-operation-record'" :formatter="filterTime"></el-table-column>
          <el-table-column prop="operationTime" label="操作时间" align="center" v-if="type=='mall-item-operation-record'" :formatter="filterTime"></el-table-column>
          <el-table-column prop="operationName" label="操作描述" align="center" v-if="type=='mall-brand-operation-record'||'mall-item-operation-record'"></el-table-column>
           <el-table-column prop="description" label="操作描述" align="center" v-if="type!='mall-brand-operation-record'&&type!='mall-item-operation-record'"></el-table-column>
          <el-table-column prop="skuName" label="对象" align="center" v-if="type!='mall-brand-operation-record'"></el-table-column>
          <el-table-column prop="description" label="对象" align="center" v-if="type=='mall-brand-operation-record'"></el-table-column>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Butt from "../../common/Button/index";
import request from '@/utils/request'
import { parseTime, formatString } from '@/utils';
export default {
  inject: ["reload",'close','isFilterShow'],
  name:'SysOperationRecord',
  data() {
    return {
      isShow:this.isFilterShow,
      shoppeName:"",
      query: {
        operationTimeStart: '',
        operationTimeEnd: '',
        pageNum: 1,
        pageSize: 10,
        startTime:'',
        endTime:'',
      },
      totalPage: 0,
      tableData: [],
      apiMapping: {
        "shoppe-operation-record":"/api/shoppe-release-service/shopperelease/shoppe/{0}/shoppesku/operation-log",
        "mall-brand-operation-record":"/api/mall-release-service/mall/brand/operation-log",
        "mall-sku-operation-record":"/api/mall-release-service/mall/sku/operation-list",
        "mall-params-operation-record":"/api/mall-release-service/mall/category/attribute/operation-log",
        "mall-item-operation-record":"/api/mall-release-service/mall/category/operation-log-list",
        
      },
      reqId: '',//请求id
      type: '',
      // isShowQuery: true,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
    };
  },
  computed: {
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    },
    requestUrl: function () {
      let url = "";
      switch (this.type) {
        case "shoppe-operation-record":
          url = formatString(this.apiMapping[this.type], this.reqId);
          break;
        case 'mall-brand-operation-record':
          url=this.apiMapping[this.type];
          break;
        case 'mall-sku-operation-record':
          url=this.apiMapping[this.type];
          break;  
        case 'mall-params-operation-record':
          url=this.apiMapping[this.type];
          break;
        case 'mall-item-operation-record':
          url=this.apiMapping[this.type];
          break;     
      }
      return url;
    },
    tableResetData: function() {
      //数据格式不一样需要组装
      console.log(this.tableData,'99999')
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          operationTime: value.operationTime,
          description: value.description||value.operation,
          operationName: value.operationName||value.operationDesc||value.operation,
          skuName: value.skuName||value.mallSkuName||value.description,
          userName: (value.userInfo&&value.userInfo.userFullName)||(value.userInfo&&value.userInfo.organizationName+'>'+value.userInfo.departmentName+'>'+value.userInfo.realName)
        };
      });
      
      console.log(tempArr,'909090');
      return tempArr;
    },
    
    show:function(){
      if(this.type=='mall-sku-operation-record'){
        return false
      }
      return true;
    }
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
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    init(){
      this.reqId = this.$route.query.id;
      this.shoppeName = this.$route.query.shoppeName||this.$route.query.mallName;
      this.type = this.$route.query.type;
      if(this.type=='mall-brand-operation-record'||this.type=='mall-sku-operation-record'||this.type=='mall-params-operation-record'||this.type=='mall-item-operation-record'){
        this.$set(this.query,'mallId',this.reqId)
      }
      this.getTableData();
    },
    getTableData(){
      request({
        url: this.requestUrl,
        method:'post',
        data:this.query
      }).then(res => {
        this.tableData = res.data.items;
        console.log(this.tableData,'whp000');
        
        this.totalPage = res.data.total;
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    filterTime(row){
      return parseTime(row.operationTime);
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
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      /* height: 50px;
        line-height: 50px;*/
      line-height: 50px;
    }
    .title {
      margin-left: 10px;
      font-size: 14px;
      line-height: 50px;
      cursor: pointer;
      color: #339999;
      display: inline-block;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
      color: #303133;
      display: inline-block;
      text-align: right;
    }
    .rightBox {
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      //height: 56px;
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 200px;
        height: 40px;
        margin: 10px 10px 10px 0;
      }
      .el-select {
        margin-left: 10px;
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    .listBoxTop {
      line-height: 50px;
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
    margin-top: 5px;
    float: right;
  }
}
</style>
