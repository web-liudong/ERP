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
            <span>
              <i style="color:red">*</i>库存组织：
            </span>
            <el-select
              v-model="query.organization"
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
            <span>
              <i style="color:red">*</i>仓库：
            </span>
            <el-select
              v-model="query.warehouse"
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
                :value="item.id+'-'+item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>
              <i style="color:red">*</i>商品：
            </span>
            <el-select
              @focus="onFocus('sku')"
              clearable
              filterable
              remote
              :remote-method="remoteMethod2"
              v-model="query.sku"
              placeholder="请选择"
            >
              <el-option
                v-for="item in skuList"
                :key="item.skuId"
                :label="item.skuName"
                :value="item.skuNo+'-'+item.skuName"
              >
                <span style="float: left">{{ item.skuNo }}-{{ item.skuName }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>单据号：</span>
            <el-input type="number" style="width:100%" placeholder="请输入" v-model="query.documentNo" clearable></el-input>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>完成日期：</span>
            <el-date-picker
              v-model="query.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder
              end-placeholder
              value-format="yyyy-MM-dd"
              @change="selectPicker"
            ></el-date-picker>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>是否含税：</span>
            <el-select v-model="query.hasTax">
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
          <div v-if="$authorities.StatsSalesAnalysisExport" class="listBoxRight">
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
      <el-table :max-height="dataListHeight" :data="tableData" border style="width: 100%" size="small">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="organizationName" label="库存组织" align="center"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column width="200" prop="skuName" label="商品名称" align="center">
           <template slot-scope="scope">
            <span style="white-space:pre-wrap">{{scope.row.skuName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="packingSpecification" label="规格/型号/货号" align="center"></el-table-column>
        <el-table-column prop="documentTypeName" label="单据类型" align="center"></el-table-column>
        <el-table-column prop="storageQty" label="入库数量" align="center"></el-table-column>
        <el-table-column prop="storageCost" label="入库成本单价" align="center">
          <template slot-scope="scope">
             {{scope.row.hasTax=='1'?scope.row.storageCostTax:scope.row.storageCost}}
          </template>
        </el-table-column>
        <el-table-column prop="storageCostAmount" label="入库成本金额" align="center">
          <template slot-scope="scope">
             {{scope.row.hasTax=='1'?scope.row.storageCostAmountTax:scope.row.storageCostAmount}}
          </template>
        </el-table-column>
        <el-table-column prop="outStockQty" label="出库数量" align="center"></el-table-column>
        <el-table-column prop="outStockCost" label="出库成本单价" align="center">
          <template slot-scope="scope">
            {{scope.row.hasTax=='1'?scope.row.outStockCostTax:scope.row.outStockCost}}
          </template>
        </el-table-column>
        <el-table-column prop="outStockCostAmount" label="出库成本金额" align="center">
          <template slot-scope="scope">
             {{scope.row.hasTax=='1'?scope.row.outStockCostAmountTax:scope.row.outStockCostAmount}}
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="结存数量" align="center"></el-table-column>
        <el-table-column prop="cost" label="结存成本单价" align="center">
          <template slot-scope="scope">
             {{scope.row.hasTax=='1'?scope.row.costTax:scope.row.cost}}
          </template>
        </el-table-column>
        <el-table-column prop="costAmount" label="结存成本金额" align="center">
          <template slot-scope="scope">
             {{scope.row.hasTax=='1'?scope.row.costAmountTax:scope.row.costAmount}}
          </template>
        </el-table-column>
        <el-table-column prop="documentCreateDate" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="documentFinishDate" label="完成时间" align="center"></el-table-column>
        <el-table-column  width="200" fixed="right" prop="documentNo" label="单据号" align="center">
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
  getDataList,
  getFirstAndEnd,
  exportDelivery
} from "@/api/statistics/commodityDetails";
// 库存模糊搜索
import { postOrganizationOptions } from "@/api/common/commonApi";
// 仓库模糊搜索
import { postWarehouseDvailableList } from "@/api/statistics/inventoryFlow";
// 商品模糊搜索
import { getGoodsList } from "@/api/purchase/purchase";

export default {
  name: "statisticsCommodityDetails",
  inject: ["reload", "isFilterShow"],
  data() {
    return {
      tableData: [],
      totalPage: 0,
      isShow: this.isFilterShow,
      query: {
        hasTax: "1", //是否含税，1是含税，0是不含税
        pageSize: 30,
        pageNum: 1
      },
      organizationList: [], //库存组织下拉列表
      warehouseList: [], //仓库下拉列表
      skuList: [], //商品下拉列表
      loading: false
    };
  },
  mounted() {
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
      let param = { ...this.query };
      if(param.organization&&param.organization!=''){
        param.organizationId=param.organization.split('-')[0]
        param.organizationName=param.organization.split('-')[1]
      }
      if(param.warehouse&&param.warehouse!=''){
        param.warehouseId=param.warehouse.split('-')[0]
        param.warehouseName=param.warehouse.split('-')[1]
      }
      if(param.sku&&param.sku!=''){
        param.skuNo=param.sku.split('-')[0]
        param.skuName=param.sku.split('-')[1]
      }
      val == "Excel" ? (param.type = 1) : (param.type = 2);
      param.firstLevelModule = "统计";
      param.secondLevelModule = "库存报表";
      param.thirdLevelModule = "商品成本明细表";
      exportDelivery(param).then(res => {
        this.$message({
          message: res.data,
          type: "warning"
        });
      });
    },
    //重置
    resetForm() {
      this.query = {
        hasTax: "1", //是否含税，1是含税，0是不含税
        pageSize: 30,
        pageNum: 1
      };
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
      if (!this.query.organization||this.query.organization == "") {
        this.$message({
          message: "请选择库存组织！",
          type: "warning"
        });
        return;
      } 
      if (!this.query.warehouse||this.query.warehouse == "") {
        this.$message({
          message: "请选择仓库！",
          type: "warning"
        });
        return;
      } 
      if (!this.query.sku||this.query.sku == "") {
        this.$message({
          message: "请选择商品！",
          type: "warning"
        });
        return;
      }
      this.query.pageNum = 1;
      this.getList();
    },
    // 获取列表请求
    getList() {
      var param = { ...this.query };
      if(param.organization&&param.organization!=''){
        param.organizationId=param.organization.split('-')[0]
        param.organizationName=param.organization.split('-')[1]
      }
      if(param.warehouse&&param.warehouse!=''){
        param.warehouseId=param.warehouse.split('-')[0]
        param.warehouseName=param.warehouse.split('-')[1]
      }
      if(param.sku&&param.sku!=''){
        param.skuNo=param.sku.split('-')[0]
        param.skuName=param.sku.split('-')[1]
      }
      Promise.all([getDataList(param), getFirstAndEnd(param)]).then(
        res => {
          this.tableData=[]
          if (res[0].data.total != 0) {
            let arr=[]
            console.log(this.query.pageNum)
            console.log(Math.ceil(res[0].data.total/this.query.pageSize))
            if(this.query.pageNum==1){
              console.log('第一页')
              if(Math.ceil(res[0].data.total/this.query.pageSize)==1){
                console.log('a')
                arr = [
                  res[1].data.beginPeriodSkuCostDaily,
                  ...res[0].data.items,
                  res[1].data.finalPeriodSkuCostDaily
                ];
              }else{
                console.log('b')
                arr = [
                  res[1].data.beginPeriodSkuCostDaily,
                  ...res[0].data.items,
                ];
              }
            }else if(this.query.pageNum==Math.ceil(res[0].data.total/this.query.pageSize)){
              console.log('最后一页')
              arr = [
                ...res[0].data.items,
                res[1].data.finalPeriodSkuCostDaily
              ];
            }else{
              console.log('第N页')
              arr = [
                ...res[0].data.items,
              ];
            }
            this.tableData = arr;
          }
          this.totalPage = res[0].data.total;
        }
      );
    },
    // 选择日期
    selectPicker(time) {
      if (time) {
        this.query.beginPeriod = time[0];
        this.query.finalPeriod = time[1];
      } else {
        this.query.beginPeriod = "";
        this.query.finalPeriod = "";
      }
    },
    // 获取库存组织下拉列表
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
    },
    //商品模糊
    remoteMethod2(query) {
      if (query !== "") {
        this.getOption2({limit: 100, name: query });
      }else{
        this.getOption2({limit: 100});
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