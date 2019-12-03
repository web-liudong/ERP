<template>
  <div class="commodityDetails-wrapper">
    <!-- 筛选查询 -->
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            {{isShow?"收起筛选":"展开筛选"}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="resetForm()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="chunk" style="width: 33%;">
            <span>库存组织：</span>
            <el-select
              v-model="query.organization"
              multiple
              collapse-tags
              clearable
              filterable
              remote
              @focus="onFocus('organization')"
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in organizationList"
                :key="item.id"
                :label="item.name"
                :value="item.id+'-'+item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>仓库：</span>
            <el-select
              v-model="query.warehouseName"
              clearable
              filterable
              remote
              @focus="onFocus('warehouse')"
              placeholder="请输入关键词"
              :remote-method="remoteMethod1"
              :loading="loading"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>商品：</span>
            <el-select
              @focus="onFocus('sku')"
              clearable
              filterable
              remote
              :remote-method="remoteMethod2"
              v-model="query.skuId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in skuList"
                :key="item.skuId"
                :label="item.skuName"
                :value="item.skuId"
              >
                <span style="float: left">{{ item.skuNo }}-{{ item.skuName }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>品牌：</span>
            <el-select
              @focus="onFocus('brand')"
              filterable
              remote
              clearable
              v-model="query.brandId"
              :remote-method="remoteMethod3"
              placeholder="请选择"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.nameCN!=''?item.nameCN:item.nameEN"
                :value="item.id"
              >
                <span style="float: left">{{ item.no }}-{{item.nameCN!=""?item.nameCN:item.nameEN }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>单据号：</span>
            <el-input type="number" style="width:100%" placeholder="请输入" v-model="query.documentNo" clearable></el-input>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>单据类型：</span>
            <el-select multiple clearable collapse-tags v-model="query.documentTypes">
              <el-option
                v-for="item in documentTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 50%;">
            <span>时间：</span>
            <el-select style="width:40%;" v-model="query.timeType" placeholder="请选择">
              <el-option label="创建日期" value="0"></el-option>
              <el-option label="完成日期" value="1"></el-option>
            </el-select>
            <el-date-picker
              v-model="query.timeRange"
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder
              end-placeholder
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="selectPicker"
            ></el-date-picker>
          </div>
          <div class="chunk">
            <span>来往单位：</span>
            <el-select
              v-model="query.intercourseCompanyId"
              clearable
              filterable
              remote
              @focus="onFocus('intercourseCompany')"
              placeholder="请输入关键词"
              :remote-method="remoteMethod4"
              :loading="loading"
            >
              <el-option
                v-for="item in intercourseCompanyList"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>是否含税：</span>
            <el-select v-model="query.includeTax">
              <el-option label="含税" value="1"></el-option>
              <el-option label="不含税" value="0"></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <!-- 数据列表 table -->
    <div class="tableBox">
      <div class="listBox">
        <div class="listBoxTop">
          <div class="listBoxTop-left">
            <ul class="tabs">
              <li class="active">
                <i class="iconfont iconjinridingdanshu myicon"></i> 数据列表
              </li>
            </ul>
          </div>
          <div v-if="$authorities.StatsStockContinualExport" class="listBoxRight">
            <el-popover placement="bottom" trigger="click">
              <div>
                <el-button @click="exportData('Excel')">Excel格式</el-button>
              </div>
              <div>
                <el-button @click="exportData('CSV')">CSV逗号分隔</el-button>
              </div>
              <el-button slot="reference">导出</el-button>
            </el-popover>
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        border
        :max-height="dataListHeight"
        style="width: 100%"
        size="small"
      >
        <el-table-column prop="number" label="序号" align="center"></el-table-column>
        <el-table-column prop="documentTypeName" label="单据类型" align="center"></el-table-column>
        <el-table-column prop="organizationName" label="库存组织" align="center"></el-table-column>
        <el-table-column prop="intercourseCompany" label="往来单位" align="center"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column width="200" prop="skuName" label="商品名称" align="center">
          <template slot-scope="scope">
            <span style="white-space:pre-wrap">{{scope.row.skuName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storageQty" label="入库数量" align="center"></el-table-column>
        <el-table-column prop="storageCost" label="入库成本单价" align="center"></el-table-column>
        <el-table-column prop="storageCostAmount" label="入库成本金额" align="center"></el-table-column>
        <el-table-column prop="storagePrice" label="入库单价" align="center"></el-table-column>
        <el-table-column prop="storagePriceAmount" label="入库金额" align="center"></el-table-column>
        <el-table-column prop="outStockQty" label="出库数量" align="center"></el-table-column>
        <el-table-column prop="outStockCost" label="出库成本单价" align="center"></el-table-column>
        <el-table-column prop="outStockCostAmount" label="出库成本金额" align="center"></el-table-column>
        <el-table-column prop="outStockPrice" label="出库单价" align="center"></el-table-column>
        <el-table-column prop="outStockPriceAmount" label="出库金额" align="center"></el-table-column>
        <el-table-column prop="qty" label="结存数量" align="center"></el-table-column>
        <el-table-column prop="cost" label="结存成本单价" align="center"></el-table-column>
        <el-table-column prop="costAmount" label="结存成本金额" align="center"></el-table-column>
        <el-table-column prop="costAmountNumber" label="结存金额" align="center"></el-table-column>
        <el-table-column prop="documentCreateDate" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="documentFinishDate" label="完成时间" align="center"></el-table-column>
        <el-table-column width="200" fixed="right" prop="documentNo" label="单据号" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goDetail(scope.row)"
            >{{scope.row.documentNo}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :page-sizes="[10,20,30,40,50,100,500]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query.pageNum"
          :page-size="query.pageSize"
          layout="total,sizes,prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  postWarehouseDvailableList,
  getDataList,
  getBrandList,
  getDocumentTypeList,
  getIntercourseCompanyList,
  exportDelivery
} from "@/api/statistics/inventoryFlow";
// 库存模糊搜索
import { postOrganizationOptions } from "@/api/common/commonApi";
// 商品模糊搜索
import { getGoodsList } from "@/api/purchase/purchase";

export default {
  name: "statisticsInventoryFlow",
  inject: ["reload", "isFilterShow"],
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: "近1天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近3天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData: [],
      totalPage: 0,
      isShow: this.isFilterShow,
      query: {
        timeType: "1", //时间类型，0是创建时间，1是完成时间
        includeTax: "1", //是否含税，1是含税，0是不含税
        pageSize: 30,
        pageNum: 1
      },
      organizationList: [], //库存组织下拉列表
      warehouseList: [], //仓库下拉列表
      skuList: [], //商品下拉列表
      brandList: [], //品牌下拉列表
      intercourseCompanyList: [], //往来单位下拉列表
      documentTypeList: [], //单据类型下拉列表
      loading: false
    };
  },
  mounted() {
    this.getDocumentType()
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    // 跳转详情
    goDetail(row) {
      if(row.documentType<5){
        //单据类型,（1：采购入库，2：采购退货，3：发货单，4：退货单）
        var arr = [
          "PurchaseDetail",
          "DetailsofReturnBill",
          "InvoiceDetail",
          "returnOrderDetaills"
        ];
        this.$router.push({
          name: arr[row.documentType - 1],
          query: {
            id: row.documentId
          }
        });
      }
    },
    //导出
    exportData(val) {
      if (this.totalPage=="0") {
        this.$message({
          message: "暂无数据！",
          type: "warning"
        });
        return;
      }
      let data = { ...this.query };
      if(data.organization && data.organization.length>0){
        data.organizationIds=data.organization.map(item=>item.split('-')[0])
        data.organizationNames=data.organization.map(item=>item.split('-')[1])
      }
      val == "Excel" ? (data.type = 1) : (data.type = 2);
      data.firstLevelModule = "统计";
      data.secondLevelModule = "库存报表";
      data.thirdLevelModule = "库存出入库流水表";
      exportDelivery(data).then(res => {
        this.$message({
          message: res.data,
          type: "warning"
        });
      });
    },
    //重置
    resetForm() {
      this.query = {
        timeType: "1", //时间类型，0是创建时间，1是完成时间
        includeTax: "1", //是否含税，1是含税，0是不含税
        pageSize: 30,
        pageNum: 1
      };
      this.getList();
    },
    // 合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.totalPage != 0) {
        if (rowIndex === this.tableData.length - 1) {
          if (columnIndex === 0) {
            return {
              rowspan: 1,
              colspan: 8
            };
          } else if (columnIndex > 0 && columnIndex < 8) {
            return [0, 0];
          }
        }
      }
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getList();
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getList();
    },
    // 获取列表请求
    getList() {
      var param = { ...this.query };
      if(param.organization && param.organization.length>0){
        param.organizationIds=param.organization.map(item=>item.split('-')[0])
      }
      getDataList(param).then(res => {
        this.tableData=[]
        if (res.data.pageInfo.total != 0) {
          let arr = [...res.data.pageInfo.items, res.data.inventoryRecordTotal];
          arr[arr.length - 1].number = "总计：";
          this.tableData = arr;
        }
        this.totalPage = res.data.pageInfo.total;
      });
    },
    // 选择日期
    selectPicker(time) {
      if (time) {
        this.query.startTime = time[0];
        this.query.endTime = time[1];
      } else {
        this.query.startTime = "";
        this.query.endTime = "";
      }
    },
    // 单据类型下拉列表
    getDocumentType() {
      getDocumentTypeList().then(res => {
        this.documentTypeList = res.data;
      });
    },
    // 获取组织下拉列表
    getOption(query) {
      postOrganizationOptions(query).then(res => {
        this.organizationList = res.data;
      });
    },
    // 获取仓库下拉列表
    getOption1(query) {
      postWarehouseDvailableList(query).then(res => {
        this.warehouseList = res.data;
      });
    },
    // 获取商品下拉列表
    getOption2(query) {
      getGoodsList(query).then(res => {
        this.skuList = res.data;
      });
    },
    // 获取品牌下拉列表
    getOption3(query) {
      getBrandList(query).then(res => {
        this.brandList = res.data;
      });
    },
    // 往来单位下拉列表
    getOption4(query) {
      getIntercourseCompanyList(query).then(res => {
        this.intercourseCompanyList = res.data;
      });
    },
    // select获取焦点
    onFocus(val) {
      //库存组织
      if (val == "organization") {
        if (this.organizationList.length == 0) {
          this.getOption();
        }
      }
      //仓库
      if (val == "warehouse") {
        if (this.warehouseList.length == 0) {
          this.getOption1({});
        }
      }
      //商品
      if (val == "sku") {
        if (this.skuList.length == 0) {
          this.getOption2({limit: 100});
        }
      }
      //品牌
      if (val == "brand") {
        if (this.brandList.length == 0) {
          this.getOption3({limit: 100});
        }
      }
      //往来单位
      if (val == "intercourseCompany") {
        if (this.intercourseCompanyList.length == 0) {
          this.getOption4({ name: "" });
        }
      }
    },
    //库存组织模糊
    remoteMethod(query) {
      if (query !== "") {
        this.getOption(query);
      }else{
        this.getOption();
      }
    },
    //仓库模糊
    remoteMethod1(query) {
      if (query !== "") {
        this.getOption1({ name: query });
      }else{
        this.getOption1({});
      }
    },
    //商品模糊
    remoteMethod2(query) {
      if (query !== "") {
        this.getOption2({limit: 100, name: query });
      }else{
        this.getOption2({limit: 100});
      }
    },
    //品牌模糊
    remoteMethod3(query) {
      if (query !== "") {
        this.getOption3({limit: 100, name: query });
      }else{
        this.getOption3({limit: 100});
      }
    },
    //往来单位模糊
    remoteMethod4(query) {
      if (query !== "") {
        this.getOption4({ name: query });
      }else{
        this.getOption4({ name: "" });
      }
    }
  }
};
</script>

<style scoped lang="less">
.optionTitle {
  color: #303133;
  display: flex;
  border-bottom: 1px solid black;
  li {
    width: 50%;
  }
}
.commodityDetails-wrapper {
  width: 100%;
  clear: both;

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
    font-size: 12px;
    background-color: #f3f3f3;
    margin-top: 10px;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
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
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      span {
        margin: 0 0 0 10px;
        flex: 0 0 80px;
        text-align: right;
      }
      .chunk {
        width: 25%;
        display: flex;
        align-items: center;
      }
      .el-input {
        width: 200px;
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select,
      .el-autocomplete,
      .el-date-editor {
        margin: 10px 0 10px 10px;
        width: 100%;
      }
    }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    // background-color: #f3f3f3;
    // border: 1px solid #e4e4e4;
    clear: both;
    line-height: 50px;
    position: relative;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      height: 50px;
      .listBoxTop-left {
        display: flex;
        .myicon {
          margin-left: 20px;
        }
        span {
          margin-left: 5px;
          font-size: 14px;
          color: #303133;
          line-height: 50px;
          display: inline-block;
          width: 60px;
        }
        .tabs {
          position: absolute;
          left: 1px;
          z-index: 10;
          li {
            float: left;
            border: 1px solid #dcdfe6;
            background-color: #efefef;
            color: #333;
            height: 40px;
            font-size: 14px;
            padding-right: 20px;
            margin-top: 9px;
            margin-right: 3px;
            margin-left: -1px;
            line-height: 40px;
            text-align: center;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            cursor: pointer;
          }
          .active {
            background-image: linear-gradient(to bottom, #efefef, #fff);
            border-bottom-color: #fff;
          }
        }
      }
    }
    .listBoxRight {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
      flex-wrap: wrap;
      .button-head {
        width: 80px;
        height: 30px;
        margin-right: 10px;
        border: 1px solid #d1d1d1;
        cursor: pointer;
        background-color: #fff;
        line-height: 30px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        .button-head-icon {
          margin-right: 5px;
        }
        .icon-add {
          font-size: 12px;
        }
        .icon-plane {
          font-size: 12px;
          font-weight: 700;
        }
      }
      .button-head:hover {
        color: #339999;
        border-color: #c2e0e0;
        background-color: #ebf5f5;
      }
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
      }
    }
    .btn {
      color: #399;
      margin-left: 10px;
      display: inline-block;
      &:hover {
        text-decoration: none;
        color: #5cadad;
      }
    }
  }

  .block {
    margin-top: 10px;
    text-align: right;
  }
  .omit {
    overflow: hidden;
  }
}
</style>
<style scoped>
.commodityDetails-wrapper >>> .el-table .el-tooltip1 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.commodityDetails-wrapper >>> div.link p,
.commodityDetails-wrapper >>> td.link .cell {
  color: #399;
  cursor: pointer;
}
.commodityDetails-wrapper >>> td.link .cell p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.commodityDetails-wrapper >>> .cell a.link {
  color: #399;
  cursor: pointer;
}
.commodityDetails-wrapper >>> .setred {
  color: red;
}
</style>