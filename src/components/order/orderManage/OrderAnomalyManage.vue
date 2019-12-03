<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="clearForm">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="chunk">
            <span>订单号：</span>
            <el-input v-model="query.no" type="number" clearable placeholder="订单号"></el-input>
          </div>
          <div class="chunk">
            <span>外部订单号：</span>
            <el-input v-model="query.customerOrderNo" clearable placeholder="外部订单号"></el-input>
          </div>
          <div class="chunk">
            <span>旧系统订单号：</span>
            <el-input v-model="query.oldErpOrderId" type="number" clearable placeholder="旧系统订单号"></el-input>
          </div>
          <div class="chunk">
            <span>订单来源：</span>
            <el-select v-model="query.orderSource">
              <el-option label="不限" value></el-option>
              <el-option label="后台" value="0"></el-option>
              <el-option label="接口" value="1"></el-option>
              <el-option label="官网" value="2"></el-option>
              <el-option label="专柜" value="3"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>订单状态：</span>
            <el-select v-model="query.status">
              <el-option label="不限" value></el-option>
              <el-option label="异常待处理" value="5"></el-option>
              <el-option label="已取消" value="6"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>异常类型：</span>
            <el-select v-model="query.invalidType">
              <el-option label="不限" value="0"></el-option>
              <el-option label="商品信息缺失" value="1"></el-option>
              <el-option label="基本信息缺失" value="2"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span style="width:180px;">缺失商品归属一级分类：</span>
            <el-select v-model="query.oldErpCategoryId">
              <el-option label="不限" value></el-option>
              <el-option label="办公用纸" :value="1"></el-option>
              <el-option label="办公耗材" :value="2"></el-option>
              <el-option label="办公文具" :value="3"></el-option>
              <el-option label="办公设备" :value="4"></el-option>
              <el-option label="电脑及周边" :value="5"></el-option>
              <el-option label="数码产品" :value="6"></el-option>
              <el-option label="手机通讯" :value="7"></el-option>
              <el-option label="办公电器" :value="8"></el-option>
              <el-option label="生活用品" :value="9"></el-option>
              <el-option label="食品饮料" :value="11"></el-option>
              <el-option label="办公家具" :value="12"></el-option>
              <el-option label="卡券礼品" :value="13"></el-option>
              <el-option label="运动户外" :value="626"></el-option>
              <el-option label="工具五金/搬运存储" :value="4851"></el-option>
              <el-option label="老保/安防/工业清洁" :value="4849"></el-option>
              <el-option label="电控照明" :value="4852"></el-option>
              <el-option label="流体传动" :value="4848"></el-option>
              <el-option label="机加工/车化/基建" :value="4850"></el-option>
              <el-option label="实验室/工业仪表" :value="4847"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>旧系统项目名称：</span>
            <el-select
              v-model="query.oldProjectName"
              filterable
              remote
              placeholder="旧系统项目名称"
              :remote-method="(query)=>{
            querySearch(query,'name','remoteOldGoodsList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteOldGoodsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>旧系统客户名称：</span>
            <el-select
              v-model="query.oldCustomerName"
              filterable
              remote
              placeholder="旧系统客户名称"
              :remote-method="(query)=>{
            querySearch(query,'customer','remoteOldCustomerName')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteOldCustomerName"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span style="width:180px;">订单收货省份：</span>
            <el-select v-model="query.recipientAddressProvinceId" placeholder="选择省/直辖市">
              <el-option
                v-for="(item,index) in provinces"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 50%;">
            <span>日期：</span>
            <el-select v-model="query.dateType">
              <el-option label="不限" value></el-option>
              <el-option label="下单日期" value="0"></el-option>
              <el-option label="期望配送日期" value="1"></el-option>
            </el-select>
            <el-date-picker
              v-model="query.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="selectPicker"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <ul class="tabs">
            <li class="active">
              <i class="iconfont iconjinridingdanshu myicon"></i> 数据列表
            </li>
          </ul>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="exportData()" v-if="$authorities.AnomalyExportMatchingGoods">
            导出缺失匹配关系商品
          </div>
          <div class="button-head" @click="updateRelation()" v-if="$authorities.AnomalyRefreshMatchingRelation">
            刷新新旧系统数据匹配关系
          </div>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      size="small"
      ref="orderList"
      :max-height="dataListHeight"
      :row-class-name="filterRow"
      :row-style="selectedHighlight"
      @row-click="rowClick"
    >
      <el-table-column type="selection" fixed="left"></el-table-column>
      <el-table-column prop="no" label="订单号" width="150" align="center" fixed="left">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('OrderAnomalyDetail',{ id: scope.row.id })"
            type="text"
            size="small"
            v-if="$authorities.OrderDetails"
          >{{scope.row.no}}</el-button>
          <span v-else>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="oldErpOrderId"
        label="旧系统订单号"
        width="150"
        align="center"
        fixed="left"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="customerOrderNo"
        label="外部订单号"
        width="150"
        align="center"
        fixed="left"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="memoOrderNo"
        label="备注订单号"
        width="120"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="invalidTypeDesc" label="异常类型" width="100" align="center"></el-table-column>
      <el-table-column prop="oldErpCategoryName" label="缺失商品归属一级分类" align="center"></el-table-column>
      <el-table-column prop="orderSourceDescription" label="订单来源" align="center"></el-table-column>
      <el-table-column prop="orderTypeDescription" label="订单类型" align="center"></el-table-column>
      <el-table-column prop="urgentDescription" label="是否紧急" align="center"></el-table-column>
      <el-table-column
        prop="oldProjectName"
        label="旧系统项目"
        width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectName"
        label="项目"
        min-width="150"
        align="center"
        class-name="link"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'项目信息','type':'projectInfo', 'id':scope.row.projectId})"
          >{{scope.row.projectName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="oldCustomerName"
        label="旧系统客户"
        width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="customerName"
        label="客户"
        min-width="150"
        align="center"
        class-name="link"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'客户信息','type':'customerInfo', 'id':scope.row.customerId})"
          >{{scope.row.customerName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="customerUserName" label="客户采购人" width="100" align="center"></el-table-column>
      <el-table-column prop="customerUserPhone" label="采购人联系方式" width="120" align="center"></el-table-column>
      <el-table-column
        prop="recipientAddressLine"
        label="客户收货地址"
        min-width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="amount" label="订单金额" align="center" :formatter="formatPrice"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="140" align="center"></el-table-column>
      <el-table-column prop="expectedDeliveryDate" label="期望配送日期" width="120" align="center"></el-table-column>
      <el-table-column prop="statusDescription" label="订单状态" width="100" align="center"></el-table-column>
      <!-- <el-table-column prop="partyBName" label="项目乙方" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="customerUserDataAuthorityName"
            label="乙方客户负责人"
            width="120"
            class-name="link"
            align="center"
          >
            <template slot-scope="scope">
              <p
                @click="showDialog('showOrderInfo',{'title':'乙方客户负责人','type':'authUserInfo', 'id':scope.row.customerUserDataAuthorityId})"
              >{{scope.row.customerUserDataAuthorityName}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerGroupUserDataAuthorityName"
            label="集团客户负责人"
            width="120"
            class-name="link"
            align="center"
          >
            <template slot-scope="scope">
              <p
                @click="showDialog('showOrderInfo',{'title':'集团客户负责人','type':'authUserInfo', 'id':scope.row.customerGroupUserDataAuthorityId})"
              >{{scope.row.customerGroupUserDataAuthorityName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="assignUserName" label="派单员" align="center" class-name="link">
            <template slot-scope="scope">
              <p
                @click="showDialog('showOrderInfo',{'title':'派单员信息','type':'userInfo', 'id':scope.row.assignUserId})"
              >{{scope.row.assignUserName}}</p>
            </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope" v-if="scope.row.status == 5">
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 1, ['ORDER_STATUS_CHANGE'])"
            v-if="$authorities.AnomalySolveForGoods && scope.row.invalidType != 2"
          >商品信息缺少处理</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE'])"
            v-if="$authorities.AnomalySolveForBase && scope.row.invalidType != 1"
          >基本信息缺少处理</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOpaCancel(scope.row)"
            v-if="$authorities.OrderAnomalyCancel"
          >取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="query.pageSize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </div>

    <cancelOrder ref="cancelOrder" @callback="dialogCallback"></cancelOrder>
    <showOrderInfo ref="showOrderInfo"></showOrderInfo>
  </div>
</template>
<script>
import {
  getAbnormalOrderList,
  checkCancelOrderOpa,
  checkAbnormalOrderOpa,
  getOldGoodsNameList,
  getOldCustomerNameList,
  exportAnomalyOrder,
  updateRelationTask
} from "@/api/order/orderManage";
import { provinces_based_id } from "@/api/basicSupplier";
import { returnFloat } from "@/utils/index";
import cancelOrder from "../child/cancel_order";
import showOrderInfo from "../child/show_order_info";
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants";
export default {
  inject: ["reload", "isFilterShow"],
  name: "OrderAnomalyManage",
  data() {
    return {
      tabType: 5, //当前tab
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      orderStatus: 1, //选择的订单list状态
      remoteLoading: false, //筛选查询loading
      remoteInitOldGoodsList: null,
      remoteOldGoodsList: null,
      remoteOldCustomerName: null,
      query: {
        assignUserId: "",
        customerGroupUserDataAuthorityId: "",
        customerId: "",
        customerOrderNo: "",
        oldErpOrderId: "",
        customerUserDataAuthorityId: "",
        customerUserId: "",
        customerUserPhone: "",
        oldCustomerName: "",
        dateType: "",
        endTime: "",
        no: "",
        orderSource: "",
        orderType: "",
        partyBId: "",
        projectId: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        serverChangedStatus: "",
        serverId: "",
        serverRejectStatus: "",
        serverUserId: "",
        startTime: "",
        status: "",
        urgent: "",
        userOwnType: "",
        oldProjectName: "",
        pageNum: 1,
        pageSize: 10,
        timeRange: null
      },
      dialogVisible: false,
      clickRowIndex: null,
      provinces: [],
      tableData: [],
      totalPage: 0
    };
  },
  components: {
    cancelOrder,
    showOrderInfo
  },
  mounted() {
    //获取表格数据
    this.getDataList();
    this.getProvinces();
    this.initOldGoodsList();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getDataList();
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    showHelp() {
      this.isShow = !this.isShow;
    },
    //获取表格数据
    getDataList() {
      getAbnormalOrderList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    initOldGoodsList() {
      getOldGoodsNameList({ name: "" }).then(res => {
        let arr = res.data.map(item => {
          return { id: item, name: item };
        });
        this.remoteInitOldGoodsList = arr.slice(0);
        this.remoteOldGoodsList = arr;
      });
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = [{ name: "不限", id: "" }, ...res.data];
        }
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getDataList();
    },
    clearForm() {
      this.query = {
        assignUserId: "",
        customerGroupUserDataAuthorityId: "",
        customerId: "",
        customerOrderNo: "",
        oldErpOrderId: "",
        customerUserDataAuthorityId: "",
        customerUserId: "",
        customerUserPhone: "",
        oldCustomerName: "",
        dateType: "",
        endTime: "",
        no: "",
        orderSource: "",
        orderType: "",
        partyBId: "",
        projectId: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        serverChangedStatus: "",
        serverId: "",
        serverRejectStatus: "",
        serverUserId: "",
        startTime: "",
        status: "",
        urgent: "",
        userOwnType: "",
        oldProjectName: "",
        pageNum: 1,
        pageSize: 10,
        timeRange: null
      };
      this.remoteOldGoodsList = Object.assign({}, this.remoteInitOldGoodsList);
      this.getDataList();
    },
    async checkOperate(row, type) {
      //判断是否被占用
      let res = {};
      res = await checkAbnormalOrderOpa(row.id, type);
      if (res.data) {
        this.oepnWin("OrderSolve", { id: row.id, type: type });
      } else {
        this.$alert(res.message, "提示");
      }
    },
    async checkOpaCancel(row) {
      //取消
      let validates = {
        description: "",
        orderId: row.id,
        orderStatus: row.status
      };
      let res = await checkCancelOrderOpa(validates);
      if (res.data && res.data == 0) {
        //取消
        this.showDialog("cancelOrder", row);
      } else {
        let msg = {
          1: "当前订单状态发生变化，请刷新数据",
          2: "当前订单已发起结算，不可取消",
          3: "已存在取消申请",
          4: "没有权限",
          5: "拆单、自定义发货单不可取消",
          6: `当前账号暂无取消订单权限，请联系乙方【${row.partyBName}】的负责人进行相关操作`,
          7: "当前订单配送状态在已复核之后，无法进行取消"
        }[res.data];
        this.$alert(msg || "当前订单已更新，请刷新数据。", "订单取消提示");
      }
    },
    selectPicker(time) {
      if (time) {
        this.query.startTime = time[0];
        this.query.endTime = time[1];
      } else {
        this.query.startTime = "";
        this.query.endTime = "";
      }
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "name") {
          getOldGoodsNameList({ name: query }).then(res => {
            let arr = res.data.map(item => {
              return { id: item, name: item };
            });
            this[list] = arr;
            this.remoteLoading = false;
          });
        } else if (type == "customer") {
          getOldCustomerNameList({ name: query }).then(res => {
            let arr = res.data.map(item => {
              return { id: item, name: item };
            });
            this[list] = arr;
            this.remoteLoading = false;
          });
        }
      } else {
        this[list] = Object.assign({}, this.remoteInitOldGoodsList);
      }
    },
    filterRow({ row, rowIndex }) {
      row.index = rowIndex;
    },
    rowClick(row, column, event) {
      this.clickRowIndex = row.index;
    },
    selectedHighlight({ row, rowIndex }) {
      if (this.clickRowIndex === rowIndex) {
        return {
          "background-color": "#f0f9eb"
        };
      }
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(type) {
      //if (type == "setAssignationHead" && type == "assignOrder") {}
      this.getDataList();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getDataList();
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/xls" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "发货单.xls");
      document.body.appendChild(link);
      link.click();
    },
    exportData() {
      exportAnomalyOrder(this.query).then(res => {
        if (res && res.data) {
          this.$confirm(
            "导出任务创建成功",
            "提示",
            {
              distinguishCancelAndClose: true,
              confirmButtonText: "前往任务列表查看",
              cancelButtonText: "确定"
            }
          )
            .then(() => {
              this.$router.push({ name: "statisticsTaskTable", params: { isUpdate: true } });
            })
            .catch();
        } else {
          this.$message({
            message: "导出缺失匹配关系商品失败",
            type: "error"
          });
        }
      });
    },
    updateRelation() {
      updateRelationTask().then(res => {
        this.$message({
          message: "定时任务已执行，请稍后查看新旧系统数据匹配关系",
          type: "success"
        });
      });
    },
    oepnWin(name, query) {
      this.$router.push({ name: name, query: query });
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  clear: both;
  .buttonBox {
    margin-top: 10px;
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
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
      margin: 10px 5px;
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
        width: 33%;
        height: 50px;
        display: flex;
        align-items: center;
      }
      .el-input {
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
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
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
          margin-left: 10px;
        }
        span {
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
            color: #333;
            height: 40px;
            font-size: 14px;
            padding-right: 20px;
            margin-top: 5px;
            margin-right: 3px;
            margin-left: -1px;
            line-height: 40px;
            text-align: center;
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
        width: 160px;
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
.brandBox >>> .el-table .el-tooltip1 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.brandBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
.brandBox >>> td.link .cell {
  color: #399;
  cursor: pointer;
}
.brandBox >>> td.link .cell p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>