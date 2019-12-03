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
            <span>商品分类：</span>
            <el-cascader
              style="margin: 10px 0 10px 10px; width:100%;"
              v-model="query.salesSkuCategoryParams"
              placeholder="请选择"
              :props="SkuCategoryProps"
              clearable
              collapse-tags
              filterable
            ></el-cascader>
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
            <span>型号/规格/货号：</span>
            <el-input
              style="width:100%"
              placeholder="请输入内容"
              v-model="query.packingSpecification"
              clearable
            ></el-input>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>仓库：</span>
            <el-select
              v-model="query.warehouseId"
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
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>项目：</span>
            <el-select
              v-model="query.projectId"
              clearable
              filterable
              remote
              @focus="onFocus('project')"
              placeholder="请输入关键词"
              :remote-method="projectListMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>客户：</span>
            <el-select
              v-model="query.customerId"
              clearable
              filterable
              remote
              @focus="onFocus('customer')"
              placeholder="请输入关键词"
              :remote-method="customerMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>业务员：</span>
            <el-select
              v-model="query.staffId"
              clearable
              filterable
              remote
              @focus="onFocus('simple')"
              placeholder="请输入关键词"
              :remote-method="simpleListMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in simpleList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>区域：</span>
            <el-cascader
              style="margin: 10px 0 10px 10px; width:100%;"
              v-model="query.salesRegionParams"
              :props="regionProps"
              clearable
              collapse-tags
              filterable
            ></el-cascader>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>项目乙方：</span>
            <el-select
              v-model="query.partyBId"
              clearable
              filterable
              remote
              @focus="onFocus('server')"
              placeholder="请输入关键词"
              :remote-method="serverListMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in serverList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>服务方：</span>
            <el-select
              v-model="query.serverId"
              clearable
              filterable
              remote
              @focus="onFocus('server')"
              placeholder="请输入关键词"
              :remote-method="serverListMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in serverList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>第二服务方：</span>
            <el-select
              v-model="query.secondServerId"
              clearable
              filterable
              remote
              @focus="onFocus('server')"
              placeholder="请输入关键词"
              :remote-method="serverListMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in serverList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>业务类型：</span>
            <el-select multiple clearable collapse-tags v-model="query.deliveryTypes">
              <el-option label="全部" value="all"></el-option>
              <el-option label="整单发货" value="1"></el-option>
              <el-option label="拆单发货" value="2"></el-option>
              <el-option label="自定义发货" value="3"></el-option>
              <el-option label="后台创建" value="4"></el-option>
              <el-option label="实收差额" value="5"></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>客户性质：</span>
            <el-select multiple clearable collapse-tags v-model="query.customerTypes">
              <el-option label="全部" value="all"></el-option>
              <el-option label="央企" value="0"></el-option>
              <el-option label="国企" value="1"></el-option>
              <el-option label="外企" value="2"></el-option>
              <el-option label="民企" value="3"></el-option>
              <el-option label="政府" value="4"></el-option>
              <el-option label="军队" value="5"></el-option>
              <el-option label="事业单位" value="6"></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 33%;">
            <span>客户采购负责人：</span>
            <el-input
              style="width:100%"
              placeholder="请输入内容"
              v-model="query.customerUserName"
              clearable
            ></el-input>
            <!-- <el-select
              v-model="query.customerUserName"
              clearable
              filterable
              remote
              @focus="onFocus('customerUser')"
              placeholder="请输入关键词"
              :remote-method="customerUserListMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in customerUserList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>-->
          </div>
          <div class="chunk" style="width:50%;">
            <span>单号：</span>
            <el-select style="width:50%;" v-model="query.documentType">
              <el-option label="单据号" value="1"></el-option>
              <el-option label="订单号" value="2"></el-option>
              <el-option label="外部订单号" value="3"></el-option>
              <el-option label="备注订单号" value="4"></el-option>
              <el-option label="关联的发货单号" value="5"></el-option>
            </el-select>
            <el-input
              type="number"
              style="width:50%;"
              placeholder="请输入内容"
              v-model="query.documentData"
              clearable
            ></el-input>
          </div>
          <div class="chunk" style="width:50%;">
            <span>时间：</span>
            <el-select style="width:40%;" v-model="query.timeType" placeholder="请选择">
              <el-option label="创建日期" value="0"></el-option>
              <el-option label="完成日期" value="1"></el-option>
            </el-select>
            <el-date-picker
              style="width:60%;"
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
          <div class="chunk" style="width:33%;">
            <span>关联订单来源：</span>
            <el-select multiple clearable collapse-tags v-model="query.orderSources">
              <el-option label="全部" value="all"></el-option>
              <el-option label="后台" value="0"></el-option>
              <el-option label="接口" value="1"></el-option>
              <el-option label="官网" value="2"></el-option>
              <el-option label="专柜" value="3"></el-option>
              <el-option label="后台竞价订单" value="4"></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width:33%;">
            <span>是否含税：</span>
            <el-select v-model="query.containTax">
              <el-option label="不含税" value="0"></el-option>
              <el-option label="含税" value="1"></el-option>
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
          <div v-if="$authorities.StatsSalesGrossProfitExport" class="listBoxRight">
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
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="categoryNameFirstLevel" label="一级分类" align="center"></el-table-column>
        <el-table-column prop="categoryNameSecondLevel" label="二级分类" align="center"></el-table-column>
        <el-table-column prop="categoryNameThirdLevel" label="三级分类" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column width="200" prop="skuName" label="商品名称" align="center">
          <template slot-scope="scope">
            <span style="white-space:pre-wrap">{{scope.row.skuName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="packingSpecification" label="型号/规格/货号" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="sellingNumber" label="销售频次" align="center"></el-table-column>
        <el-table-column prop="sellingQty" label="销量" align="center"></el-table-column>
        <el-table-column prop="sellingPrice" label="销售价" align="center"></el-table-column>
        <el-table-column prop="sellingIncome" label="销售收入" align="center"></el-table-column>
        <el-table-column prop="sellingCost" label="销售成本" align="center"></el-table-column>
        <el-table-column prop="sellingGrossProfit" label="销售毛利" align="center"></el-table-column>
        <el-table-column prop="sellingGrossProfitRate" label="毛利率" align="center">
          <template
            slot-scope="scope"
          >{{scope.row.sellingGrossProfitRate==''?'-':scope.row.sellingGrossProfitRate}}</template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目" align="center"></el-table-column>
        <el-table-column prop="customerType" label="客户性质" align="center"></el-table-column>
        <el-table-column prop="customerName" label="客户" align="center"></el-table-column>
        <el-table-column prop="staffName" label="业务员" align="center"></el-table-column>
        <el-table-column prop="customerUserName" label="客户采购负责人" align="center"></el-table-column>
        <el-table-column prop="customerUserPhone" label="采购人联系方式" align="center"></el-table-column>
        <el-table-column prop="recipientAddressProvinceName" label="省份" align="center"></el-table-column>
        <el-table-column prop="recipientAddressCityName" label="地市" align="center"></el-table-column>
        <el-table-column prop="recipientAddressCountyName" label="区县" align="center"></el-table-column>
        <el-table-column prop="recipientAddressLine" label="详细地址" align="center"></el-table-column>
        <el-table-column prop="groupUserName" label="集团客户负责人" align="center"></el-table-column>
        <el-table-column prop="partyBName" label="项目乙方" align="center"></el-table-column>
        <el-table-column prop="partyBUserName" label="乙方客户负责人" align="center"></el-table-column>
        <el-table-column prop="assignUserName" label="派单员" align="center"></el-table-column>
        <el-table-column prop="serverName" label="服务方" align="center"></el-table-column>
        <el-table-column prop="secondServerName" label="第二服务方" align="center"></el-table-column>
        <el-table-column prop="deliveryType" label="业务类型" align="center"></el-table-column>
        <el-table-column prop="orderSource" label="关联订单来源" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="finishTime" label="完成时间" align="center"></el-table-column>
        <el-table-column prop="memo" label="备注" align="center"></el-table-column>
        <el-table-column fixed="right" prop="documentNo" label="单据号" align="center">
          <template slot-scope="scope">
            <span style="color: #409eff;cursor:pointer;" @click="goDetail(scope.row,'单据号')">{{scope.row.documentNo}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="orderNo" label="订单号" align="center">
          <template slot-scope="scope">
            <span style="color: #409eff;cursor:pointer;" @click="goDetail(scope.row,'订单号')">{{scope.row.orderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="customerOrderNo"
          label="外部订单号"
          align="center"
        >
          <template slot-scope="scope">
            <span style="color: #409eff;cursor:pointer;" @click="goDetail(scope.row,'外部订单号')">{{scope.row.customerOrderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="memoOrderNo" label="备注订单号" align="center">
          <template slot-scope="scope">
            <span style="color: #409eff;cursor:pointer;" @click="goDetail(scope.row,'备注订单号')">{{scope.row.memoOrderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="orderDeliveryNo" label="关联发货单号" align="center">
          <template slot-scope="scope">
            <span style="color: #409eff;cursor:pointer;" @click="goDetail(scope.row,'关联发货单号')">{{scope.row.orderDeliveryNo}}</span>
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
  getStatistics,
  exportDelivery
} from "@/api/statistics/detailed";
import {
  getBrandList,
  selectProject,
  selectCustomer,
  selectServer,
  selectGoods,
  simpleList
} from "@/api/statistics/frequency";
// 库存模糊搜索
import { postOrganizationOptions } from "@/api/common/commonApi";
// 仓库模糊搜索
import { postWarehouseDvailableList } from "@/api/statistics/inventoryFlow";
// 商品模糊搜索
import { getGoodsList } from "@/api/purchase/purchase";
// 省市区
import { provinces_based_id, subs } from "@/api/basicSupplier";
// 采购负责人模糊搜索
import { customerUserNameList } from "@/api/order/saleDown";

export default {
  name: "statisticsDetailed",
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
      SkuCategoryProps: {
        // checkStrictly: true,
        multiple: true,
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level } = node;
          const result = await selectGoods(
            level + 1,
            node.value ? node.value : 0
          );
          const arr = result.data;
          const nodes = arr.map(item => ({
            value: item.id,
            label: item.name,
            leaf: level >= 2
          }));
          resolve(nodes);
        }
      },
      regionProps: {
        // checkStrictly: true,
        multiple: true,
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level, value } = node;
          let result;
          if (level == 0) {
            result = await provinces_based_id();
          } else {
            result = await subs(value);
          }
          const arr = result.data;
          const nodes = arr.map(item => ({
            value: item.id,
            label: item.name,
            leaf: level >= 2
          }));
          resolve(nodes);
        }
      },
      tableData: [],
      totalPage: 0,
      isShow: this.isFilterShow,
      query: {
        containTax: "1", //是否含税
        deliveryTypes: ["all"], //业务类型
        orderSources: ["all"], //关联订单来源
        customerTypes: ["all"], //客户性质
        documentType: "1", //单号
        timeType: "1", //时间状态(0，创建；1，完成)
        pageSize: 30,
        pageNum: 1
      },
      projectList: [], //项目下拉列表
      warehouseList: [], //仓库下拉列表
      skuList: [], //商品下拉列表
      brandList: [], //品牌下拉列表
      customerList: [], //客户下拉列表
      customerUserList: [], //采购负责人列表
      serverList: [], //服务方下拉列表
      simpleList: [], //业务员下拉列表
      loading: false
    };
  },
  mounted() {},
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    // 跳转详情
    goDetail(row, type) {
      // 单据号,订单号,外部订单号,备注订单号,关联发货单号
      var routerName = "";
      var queryId = "";
      if (type == "单据号") {
        routerName =
          row.sellingNumber > 0 ? "InvoiceDetail" : "returnOrderDetaills";
        queryId = row.documentId;
      }
      if (type == "订单号" || type == "外部订单号" || type == "备注订单号") {
        routerName = "OrderDetail";
        queryId = row.orderId;
      }
      if (type == "关联发货单号") {
        routerName = "InvoiceDetail";
        queryId = row.orderDeliveryId;
      }
      if (routerName != "" && queryId !== "") {
        this.$router.push({
          name: routerName,
          query: {
            id: queryId
          }
        });
      }
    },
    //导出
    exportData(val) {
      if (this.totalPage == "0") {
        this.$message({
          message: "暂无数据！",
          type: "warning"
        });
        return;
      }
      var param = { ...this.query };
      if (param.deliveryTypes) {
        param.deliveryTypes.forEach(item => {
          if (item == "all") {
            delete param.deliveryTypes;
          }
        });
      }
      if (param.orderSources) {
        param.orderSources.forEach(item => {
          if (item == "all") {
            delete param.orderSources;
          }
        });
      }
      if (param.customerTypes) {
        param.customerTypes.forEach(item => {
          if (item == "all") {
            delete param.customerTypes;
          }
        });
      }
      val == "Excel" ? (param.type = 1) : (param.type = 2);
      param.firstLevelModule = "统计";
      param.secondLevelModule = "销售报表";
      param.thirdLevelModule = "销售毛利明细表";
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
        containTax: "1", //是否含税
        documentType: "1", //单号
        timeType: "1", //时间状态(0，创建；1，完成)
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
            return [0, 0];
          } else if (columnIndex === 1) {
            return {
              rowspan: 1,
              colspan: 9
            };
          } else if (columnIndex > 1 && columnIndex < 9) {
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
      if (param.deliveryTypes) {
        param.deliveryTypes.forEach(item => {
          if (item == "all") {
            delete param.deliveryTypes;
          }
        });
      }
      if (param.orderSources) {
        param.orderSources.forEach(item => {
          if (item == "all") {
            delete param.orderSources;
          }
        });
      }
      if (param.customerTypes) {
        param.customerTypes.forEach(item => {
          if (item == "all") {
            delete param.customerTypes;
          }
        });
      }
      Promise.all([getDataList(param), getStatistics(param)]).then(res => {
        let temp = {
          sellingCost: res[1].data.totalSellingCost,
          sellingGrossProfit: res[1].data.totalSellingGrossProfit,
          sellingGrossProfitRate: res[1].data.totalSellingGrossProfitRate,
          sellingIncome: res[1].data.totalSellingIncome,
          sellingNumber: res[1].data.totalSellingNumber,
          sellingQty: res[1].data.totalSellingQty
        };
        this.tableData = [];
        if (res[0].data.total != 0) {
          let arr = [...res[0].data.items, temp];
          arr[arr.length - 1].categoryNameFirstLevel = "总计：";
          this.tableData = arr;
        }
        this.totalPage = res[0].data.total;
      });
    },
    // 查询日期
    selectPicker(time) {
      if (time) {
        this.query.startTime = time[0];
        this.query.endTime = time[1];
      } else {
        this.query.startTime = "";
        this.query.endTime = "";
      }
    },
    // 获取项目下拉列表
    getProjectList(query) {
      selectProject(query).then(res => {
        this.projectList = res.data;
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
    // 客户下拉列表
    getCustomerList(query) {
      selectCustomer(query).then(res => {
        this.customerList = res.data;
      });
    },
    // 服务方下拉列表
    getServerList(query) {
      selectServer(query).then(res => {
        this.serverList = res.data;
      });
    },
    // 业务员下拉列表
    getSimpleList(query) {
      simpleList(query).then(res => {
        this.simpleList = res.data;
      });
    },
    // 业务员下拉列表
    getCustomerUserList(query) {
      customerUserNameList(query).then(res => {
        this.customerUserList = res.data;
      });
    },
    // select获取焦点
    onFocus(val) {
      //业务员
      if (val == "simple") {
        if (this.simpleList.length == 0) {
          this.getSimpleList({ userName: "" });
        }
      }
      //项目
      if (val == "project") {
        if (this.projectList.length == 0) {
          this.getProjectList({});
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
          this.getOption2({ limit: 100 });
        }
      }
      //品牌
      if (val == "brand") {
        if (this.brandList.length == 0) {
          this.getOption3({ limit: 100 });
        }
      }
      //客户
      if (val == "customer") {
        if (this.customerList.length == 0) {
          this.getCustomerList({ name: "" });
        }
      }
      //服务方
      if (val == "server") {
        if (this.customerList.length == 0) {
          this.getServerList({ name: "" });
        }
      }
      //采购负责人
      if (val == "customerUser") {
        if (this.customerList.length == 0) {
          this.getCustomerUserList({ name: "" });
        }
      }
    },
    //采购负责人模糊
    customerUserListMethod(query) {
      if (query !== "") {
        this.getCustomerUserList({ name: query });
      } else {
        this.getCustomerUserList({ name: "" });
      }
    },
    //业务员模糊
    simpleListMethod(query) {
      if (query !== "") {
        this.getSimpleList({ userName: query });
      } else {
        this.getSimpleList({ userName: "" });
      }
    },
    //服务方模糊
    serverListMethod(query) {
      if (query !== "") {
        this.getServerList({ name: query });
      } else {
        this.getServerList({ name: "" });
      }
    },
    //项目模糊
    projectListMethod(query) {
      if (query !== "") {
        this.getProjectList({ name: query });
      } else {
        this.getProjectList({});
      }
    },
    //仓库模糊
    remoteMethod1(query) {
      if (query !== "") {
        this.getOption1({ name: query });
      } else {
        this.getOption1({});
      }
    },
    //商品模糊
    remoteMethod2(query) {
      if (query !== "") {
        this.getOption2({ limit: 100, name: query });
      } else {
        this.getOption2({ limit: 100 });
      }
    },
    //品牌模糊
    remoteMethod3(query) {
      if (query !== "") {
        this.getOption3({ limit: 100, name: query });
      } else {
        this.getOption3({ limit: 100 });
      }
    },
    //客户模糊
    customerMethod(query) {
      if (query !== "") {
        this.getCustomerList({ name: query });
      } else {
        this.getCustomerList({ name: "" });
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