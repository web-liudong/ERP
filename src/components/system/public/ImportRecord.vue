<template>
  <div class="brandBox">
    <div class="listBox">
      <!-- <div class="listHeaderBox"><span>项目：</span></div> -->
      <div class="listBoxTop">
        <span>{{type && apiMapping[type].title}}导入记录</span>
        <el-table :data="tableResetData" border style="width: 100%" size="small">
          <el-table-column width="60" label="序号" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(query.pageNum-1)*10}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="操作者" align="center"></el-table-column>
          <el-table-column prop="importTime" label="操作时间" align="center" :formatter="filterTime"></el-table-column>
          <el-table-column prop="importFilePathDTO" label="导入文件" align="center">
            <!-- <template slot-scope="scope">
              <a class="download" :href="scope.row.importFilePathDTO.path" :download="scope.row.importFilePathDTO.path">{{scope.row.importFilePathDTO.name}}</a>
            </template> -->
            <template slot-scope="scope">
              <el-button v-if="scope.row.importFilePathDTO!=null" type="text" @click="downfile(scope.row)">{{scope.row.importFilePathDTO.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="importErrorFilePathDTO" label="导入失败反馈" align="center">
            <!-- <template slot-scope="scope" >
              <a class="download" :href="scope.row.importErrorFilePathDTO.path" :download="scope.row.importErrorFilePathDTO.path">{{scope.row.importErrorFilePathDTO && scope.row.importErrorFilePathDTO.name}}</a>
            </template> -->
            <template slot-scope="scope">
              <el-button type="text" @click="downfile1(scope.row)">{{scope.row.importErrorFilePathDTO.name}}</el-button>
            </template>
          </el-table-column>
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
import request from "@/utils/request";
import { parseTime, formatString } from "@/utils";
export default {
  name:"SysImportRecord",
  data() {
    return {
      query: {
        shoppeId:"",
        pageNum: 1,
        pageSize: 10
      },
      apiMapping: {
        "class-import-list": {
          api: "/api/product-service/category/importFileLog",
          title: "商品分类"
        },
        "mall-sku-import-list": {
          api: "/api/mall-release-service/mall/sku/import-list",
          title: "商城商品"
        },
        "finance-code-import-list": {
          api: "/api/product-service/taxcode/import-file-log-list",
          title: "税收编码"
        },
        "release-nav-import-list": {
          api: `/api/shoppe-release-service/shopperelease/navigation/{0}/import-log`,
          title: "导航"
        },
        "release-shoppe-import-list": {
          api: `/api/shoppe-release-service/shopperelease/shoppe/{0}/filelist`,
          title: "商品"
        },
        "mall-item-import-list": {
          api: `/api/mall-release-service/mall/category/{0}/logs-list`,
          title: "品目"
        },
        "mall-params-import-list": {
          api: `/api/mall-release-service/mall/category/attribute/import-log`,
          title: "参数"
        },
        "mall-brand-import-list": {
          api: `/api/mall-release-service/mall/brand/import-log`,
          title: "品牌"
        },
        "mall-productpond-import-list": {
          api: `/api/mall-release-service/mall/sku/import-list`,
          title: "商城池商品"
        },
        "product-brand-import-list": {
          api: `/api/product-service/brand/import-list`,
          title: "品牌"
        },
        "returned-money-import-list": {
          api: `/api/bill-service/payment-received/import-list`,
          title: "回款"
        },
        "releaselog": {
          api: `/api/mainsite-release-service/mainsiterelease/navigation/importfile-log`,
          title: "官网导航"
        },
        "customer-import-list": {
          api: `/api/customer-service/customer/import-customer-list`,
          title: "导入客户"
        },
        "organization-import-list": {
          api: `/api/user-service/user/importFileLog`,
          title: "组织机构"
        },
        "goods-import-list": {
          api: `/api/product-service/sku/import-sku-log`,
          title: "商品批量"
        },
        "accredit-import-list": {
          api: `/api/authorization-service/authorization/import-file-log/list`,
          title: "授权库批量"
        },
        "finance-accountsPayable-import-list": {
          api: `/api/bill-service/account/payable/import-log`,
          title: "付款信息"
        },
        "purchase-skuPool-import-list": {
          api: `/api/purchase-service/centralPurchaseSkuPool/import-file-log-list`,
          title: "集采商品池"
        },
      },
      isCombine: false, //是否需要重组数据
      reqId: "", //请求id
      type: "",
      totalPage: 0,
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["loading"]),
    requestUrl: function() {
      let url = "";
      switch (this.type) {
        default:
          url = formatString(this.apiMapping[this.type].api, this.reqId);
          break;
      }
      return url;
    },
    tableResetData: function() {
      //数据格式和下面不一样需要组装
      // let item = {
      //   importErrorFilePathDTO: {
      //     id: 0,
      //     name: "string",
      //     path: "string",
      //     type: "string"
      //   },
      //   importFilePathDTO: {
      //     id: 0,
      //     name: "string",
      //     path: "string",
      //     type: "string"
      //   },
      //   importTime: "string",
      //   userId: 0,
      //   userName: "string"
      // };
      let arr = [];
      switch (this.type) {
        case "customer-import-list":
        case "returned-money-import-list":
        case "purchase-skuPool-import-list": 
        case "organization-import-list":
          arr = this.combineReturnData();
          break;
        case "class-import-list":
          arr = this.combineReturnDataClass();
          break;
        case "releaselog":
          arr = this.combineReleaseData();
          break;
        case "finance-accountsPayable-import-list":
          arr = this.combineDataFinance();
          break;
        case "finance-code-import-list":
          arr = this.combineData();
          break;
        case "goods-import-list":
          arr = this.combineDataGoods();
          break;
        case "mall-item-import-list":
          arr = this.combineData();
          break;
        case "mall-params-import-list":
          arr = this.combineData();
          break;
        case "mall-brand-import-list":
          arr = this.combineData();
          break;
         case "mall-productpond-import-list":
          arr = this.combineDataName();
          break;
         case "product-brand-import-list":
         arr=this.combineDataForShoppe();
         break;
         case "release-shoppe-import-list":
         case "release-nav-import-list":
          arr = this.combineDataForShoppe();
          break;
         case "accredit-import-list":
          arr = this.combineDataAccredit();
          break;
        default:
          arr = this.resetUserName();
          break;
      }

      return arr;
    }
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.reqId || this.$route.query.type != this.type){
      this.init();
    }
  },
  methods: {
    init(){
      this.reqId = this.$route.query.id;
      this.query.shoppeId = this.reqId;
      this.type = this.$route.query.type;

      if (
        this.type == "mall-sku-import-list" ||
        this.type == "mall-item-import-list" ||
        this.type == "mall-params-import-list" ||
        this.type == "mall-brand-import-list" ||
        this.type == "mall-productpond-import-list"

      ) {
        this.$set(this.query, "mallId", this.reqId);
      }
      if(this.type=='organization-import-list'){
        this.$set(this.query,'type',0)
      }
      this.getTableData();
    },
    getTableData() {
      request({
        url: this.requestUrl,
        method: "post",
        data: this.query
      }).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
        this.query.pageNum = res.data.pageNum;
      });
    },
    combineDataGoods(){
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: {name:value.importErrorFileName,id:value.importErrorFileId,path:value.importErrorFilePath},
          importFilePathDTO: {id:value.importFileId,name:value.importFileName,path:value.importFilePath},
          id: value.id,
          importTime: value.importTime,
          userId: value.userId,
          userName:value.userName
        };
      });
      return tempArr;
    },
    combineDataFinance(){
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: value.importErrorFileDTO?value.importErrorFileDTO:{},
          importFilePathDTO: value.importFileDTO?value.importFileDTO:{},
          id: value.id,
          importTime: value.importTime,
          // userId: value.userId,
          userName: value.userInfo.userPosts[0].organizationName+'>'+value.userInfo.userPosts[0].departmentName+'>'+value.userInfo.realName
        };
      });
      return tempArr;
    },
    combineReleaseData(){
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: value.errorFileDTO?value.errorFileDTO:{},
          importFilePathDTO: value.fileDTO?value.fileDTO:{},
          // id: index,
          importTime: value.importTime,
          // userId: value.userId,
          userName: value.userName || value.userInfo.userFullName
        };
      });
      return tempArr;
    },
    combineReturnData(){
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: value.importErrorFilePathDTO?value.importErrorFilePathDTO:value.importErrorFileDTO?value.importErrorFileDTO:{},
          importFilePathDTO: value.importFilePathDTO?value.importFilePathDTO:{},
          // id:value.importFilePathDTO.id,
          importTime: value.importTime,
          userName: value.userName || value.userInfo.userFullName
        };
      });
      return tempArr;
    },
    combineReturnDataClass(){
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: value.importErrorFileDTO?value.importErrorFileDTO:{},
          importFilePathDTO: value.importFilePathDTO?value.importFilePathDTO:{},
          // id:value.importFilePathDTO.id,
          importTime: value.importTime,
          userName: value.userName || value.userInfo.userFullName
        };
      });
      return tempArr;
    },
    //重组数据统一格式
    combineData() {
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: {
            id: value.importErrorFileId,
            name: value.importErrorFileName,
            path: value.importErrorFilePath
            //type: "string"
          },
          importFilePathDTO: {
            id: value.importFileId,
            name: value.importFileName,
            path: value.importFilePath
            //type: "string"
          },
          id: value.id?value.id:(index+1),
          importTime: value.importTime,
          userId: value.userId,
          userName: value.userName || value.userInfo.userFullName
        };
      });
      return tempArr;
    },
    //importFileName中的值为name的时候
    combineDataName() {
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: {
            id: value.importErrorFilePathDTO==null?'':value.importErrorFilePathDTO.id,
            name: value.importErrorFilePathDTO==null?'':value.importErrorFilePathDTO.name,
            path: value.importErrorFilePathDTO==null?'':value.importErrorFilePathDTO.path,
            //type: "string"
          },
          importFilePathDTO: {
            id: value.importFilePathDTO==null?'':value.importFilePathDTO.id,
            name: value.importFilePathDTO==null?'':value.importFilePathDTO.name,
            path: value.importFilePathDTO==null?'':value.importFilePathDTO.path,
            //type: "string"
          },
          id:index+1,
          importTime: value.importTime,
          userId: index+1,
          userName: value.userName || value.userInfo.userFullName
        };
      });
      return tempArr;

    },
    combineDataForShoppe() {
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: {
            id: value.errorFileDTO && value.errorFileDTO.id,
            name: value.errorFileDTO && value.errorFileDTO.name,
            path: value.errorFileDTO && value.errorFileDTO.path
            //type: "string"
          },
          importFilePathDTO: {
            id: value.fileDTO && value.fileDTO.id,
            name: value.fileDTO && value.fileDTO.name,
            path: value.fileDTO && value.fileDTO.path
            //type: "string"
          },
          id: value.fileDTO.id,
          importTime: value.importTime,
          userId: value.userId,
          userName: value.userName || value.userInfo.userFullName
        };
      });
      return tempArr;
    },
    combineDataAccredit(){
      let tempArr = this.tableData.map((value, index, array) => {
        return {
          importErrorFilePathDTO: value.filePathDTOImportError?value.filePathDTOImportError:{},
          importFilePathDTO: value.filePathDTOImport?value.filePathDTOImport:{},
          id: value.id,
          importTime: value.importTime,
          userId: value.userInfo.id,
          userName:value.userInfo.userFullName
        };
      });
      return tempArr;
    },
    resetUserName: function() {
      let tempArr = this.tableData.map((value, index, array) => {
        value.userName = value.userName || value.userInfo.userFullName
        return value
      });
      return tempArr;
    },
    downfile(row){
      let href = '/api/file-service/file/download?id='+row.importFilePathDTO.id + '&access_token='+this.$auth.token;
      window.open(href, '_blank')
    },
    downfile1(row){
      let href = '/api/file-service/file/download?id='+row.importErrorFilePathDTO.id + '&access_token='+this.$auth.token;
      window.open(href, '_blank')
    },
    filterTime(row) {
      return parseTime(row.importTime);
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
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
     .listHeaderBox{
       border-bottom: 1px solid #e4e4e4;
        height: 50px;
        line-height: 50px;
        span{
          margin-left: 10px;
          font-size: 14px;
          color: red;
        }
      }
    .listBoxTop {
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
      a.download{
        color: #399;
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
