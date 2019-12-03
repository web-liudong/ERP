<template>
  <div class="brandBox">
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
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="chunk">
            <span>订单号：</span>
            <el-input clearable v-model="query.no" placeholder="订单号"></el-input>
          </div>
          <div class="chunk">
            <span>备注订单号：</span>
            <el-input clearable v-model="query.memoOrderNo" placeholder="备注订单号"></el-input>
          </div>
          <div class="chunk">
            <span>订单类型：</span>
            <el-select v-model="query.orderType">
              <el-option label="不限" value></el-option>
              <el-option label="常规订单" value="0"></el-option>
              <el-option label="赠品订单" value="1"></el-option>
              <el-option label="积分订单" value="2"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>是否紧急：</span>
            <el-select v-model="query.urgent">
              <el-option label="不限" value></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>项目名：</span>
            <el-select
              v-model="query.projectId"
              filterable
              remote
              placeholder="项目名"
              :remote-method="(query)=>{
            querySearch(query,'name','remoteProjectList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteProjectList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>客户名：</span>
            <el-select
              v-model="query.customerId"
              filterable
              remote
              placeholder="客户名"
              :remote-method="(query)=>{
            querySearch(query,'customer','remoteCustomerList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteCustomerList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>客户采购人：</span>
            <el-select
              v-model="query.customerUserId"
              filterable
              remote
              placeholder="客户采购人"
              :remote-method="(query)=>{
            querySearch(query,'customerUser','remoteCustomerUserList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteCustomerUserList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.userId"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>业务员：</span>
            <el-select
              v-model="query.staffId"
              filterable
              remote
              placeholder="业务员"
              :remote-method="(query)=>{
            querySearch(query,'manager','remoteServerUserList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteServerUserList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>采购人联系方式：</span>
            <el-input clearable v-model="query.customerUserPhone" placeholder="采购人联系方式"></el-input>
          </div>
          <div class="chunk">
            <span>订单发货类型：</span>
            <el-select v-model="query.deliveryType">
              <el-option label="不限" value></el-option>
              <el-option label="未发货" value="0"></el-option>
              <el-option label="整单发货" value="1"></el-option>
              <el-option label="拆单发货" value="2"></el-option>
              <el-option label="自定义发货" value="3"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>订单状态：</span>
            <el-select v-model="query.status">
              <el-option label="不限" value></el-option>
              <el-option label="待分派" value="0"></el-option>
              <el-option label="待接受" value="1"></el-option>
              <el-option label="发货中" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
              <el-option label="已取消" value="4"></el-option>
              <!-- <el-option label="待确认" value="5"></el-option> -->
            </el-select>
          </div>
          <div class="chunk">
            <span>展示给客户状态：</span>
            <el-select v-model="query.customerOrderStatus">
              <el-option label="不限" value></el-option>
              <el-option label="仓库响应" value="1"></el-option>
              <el-option label="仓库出库" value="2"></el-option>
              <el-option label="确认签收" value="3"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>项目乙方：</span>
            <el-select
              v-model="query.partyBId"
              filterable
              remote
              placeholder="项目乙方"
              :remote-method="(query)=>{
            querySearch(query,'organization','remoteBList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteBList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>服务方：</span>
            <el-select
              v-model="query.serverId"
              filterable
              remote
              placeholder="服务方"
              :remote-method="(query)=>{
            querySearch(query,'organization','remoteServerList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteServerList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>第二服务方：</span>
            <el-select
              v-model="query.secondServerUserId"
              filterable
              remote
              placeholder="第二服务方"
              :remote-method="(query)=>{
            querySearch(query,'manager','remoteBUserList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteBUserList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>派单员：</span>
            <el-select
              v-model="query.assignUserId"
              filterable
              remote
              placeholder="派单员"
              :remote-method="(query)=>{
            querySearch(query,'manager','remoteAssignUserList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteAssignUserList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 50%;">
            <span>日期：</span>
            <el-select v-model="query.dateType" style="width:50%;">
              <el-option label="下单日期" value="0"></el-option>
              <el-option label="期望配送日期" value="1"></el-option>
              <el-option label="分派日期" value="2"></el-option>
              <el-option label="完成日期" value="3"></el-option>
              <el-option label="取消日期" value="4"></el-option>
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
          <div class="chunk" style="width: 50%;">
            <span>收货地址：</span>
            <el-select
              v-model="query.recipientAddressProvinceId"
              placeholder="选择省/直辖市"
              @change="getcity"
            >
              <el-option
                v-for="(item,index) in provinces"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="query.recipientAddressCityId"
              placeholder="选择城市"
              @change="getcounty"
            >
              <el-option
                v-for="(item,index) in city"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="query.recipientAddressCountyId" placeholder="选择区/县">
              <el-option
                v-for="(item,index) in county"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 数据列表 table -->
    <div class="listBox">
      <div class="listBoxTop" v-if="statusCount">
        <div class="listBoxTop-left">
          <ul class="tabs">
            <li class="active">
              <i class="iconfont iconjinridingdanshu myicon"></i> 数据列表
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="small"
      ref="orderList"
      :cell-class-name="filterCell"
      @selection-change="handleSelectionChange"
      :key="`table${tabType}+${identiType}`"
      :max-height="dataListHeight"
    >
      <el-table-column type="selection" fixed="left"></el-table-column>
      <el-table-column prop="no" label="订单号" width="150" align="center" fixed="left">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('OrderDetail',{ id: scope.row.id })"
            type="text"
            size="small"
            v-if="$authorities.OrderDetails"
          >{{scope.row.no}}</el-button>
          <span v-else>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memoOrderNo" label="备注订单号" align="center" fixed="left"></el-table-column>
      <el-table-column prop="orderTypeName" label="订单类型" align="center"></el-table-column>
      <el-table-column prop="urgentName" label="是否紧急" align="center"></el-table-column>
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
      <el-table-column
        prop="staffName"
        label="业务员"
        min-width="150"
        align="center"
        class-name="link"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'业务员','type':'userInfo', 'id':scope.row.staffId})"
          >{{scope.row.staffName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="customerUserPhone" label="采购人联系方式" width="120" align="center"></el-table-column>
      <el-table-column
        prop="customerReceiptAddress"
        label="客户收货地址"
        min-width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="amount" label="订单金额" align="center" :formatter="formatPrice"></el-table-column>
      <el-table-column prop="payTypeName" label="付款方式" align="center"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" align="center"></el-table-column>
      <el-table-column prop="expectedDeliveryDate" label="期望配送日期" width="120" align="center"></el-table-column>
      <el-table-column prop="statusName" label="订单状态" align="center"></el-table-column>
      <el-table-column prop="finishTime" label="完成时间" align="center"></el-table-column>
      <el-table-column prop="deliveryTypeName" label="订单发货类型" align="center"></el-table-column>
      <el-table-column prop="deliveryStatusName" label="配送状态" align="center" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.deliveryType == 1">{{scope.row.deliveryStatusName}}</p>
          <a
            v-if="scope.row.deliveryType > 0"
            class="link"
            @click="oepnWin('InvoiceManage', { orderNo: scope.row.no});"
          >查看发货单</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerStatusType" label="展示给客户状态" align="center" width="120">
        <template slot-scope="scope">
          <p>{{scope.row.customerStatusTypeName?scope.row.customerStatusTypeName:'---'}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="partyBName" label="项目乙方" align="center" show-overflow-tooltip></el-table-column>
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
        prop="firstServerName"
        label="服务方"
        align="center"
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="firstServerUserName"
        label="服务方接单人"
        width="140"
        align="center"
        class-name="link"
      >
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'服务方接单人','type':'userInfo', 'id':scope.row.firstServerUserId})"
          >{{scope.row.firstServerUserName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="secondServerName"
        label="第二服务方"
        align="center"
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="secondServerUserName"
        label="第二服务方接单人"
        width="180"
        align="center"
        class-name="link"
      >
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'第二服务方接单人','type':'userInfo', 'id':scope.row.secondServerUserId})"
          >{{scope.row.secondServerUserName}}</p>
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
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150" fixed="right" key="opa1">
        <div slot-scope="scope" v-if="scope.row.status==0">
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, ['ORDER_STATUS_CHANGE','ORDER_VERISON'])"
          >改单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkCancelOperate(scope.row, ['ORDER_STATUS_CHANGE'])"
          >取消</el-button>
        </div>
        <div v-else>---</div>
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

    <takingOrder ref="takingOrder" @callback="dialogCallback"></takingOrder>
    <assignOrder ref="assignOrder" @callback="dialogCallback"></assignOrder>
    <assignOrderBatch ref="assignOrderBatch" @callback="dialogCallback"></assignOrderBatch>
    <assignOrderHead ref="assignOrderHead" @callback="dialogCallback"></assignOrderHead>
    <cancelOrder ref="cancelOrder" @callback="dialogCallback"></cancelOrder>
    <refusalOrder ref="refusalOrder" @callback="dialogCallback"></refusalOrder>
    <showOrderInfo ref="showOrderInfo"></showOrderInfo>
    <showWmsInfo ref="showWmsInfo"></showWmsInfo>
    <addRemarks ref="addRemarks"></addRemarks>
    <deliverGoods ref="deliverGoods" @callback="dialogCallback"></deliverGoods>
    <postDeliver ref="postDeliver"></postDeliver>
    <modifyFee ref="modifyFee"></modifyFee>
    <setPayee ref="setPayee" @callback="dialogCallback"></setPayee>
    <returnOrderApply ref="returnOrderApply"></returnOrderApply>
  </div>
</template>
<script>
import { getDataList, checkOrderOpa } from "@/api/order/myOrder";

import {
  getStatusCount,
  checkCancelOrderOpa,
  allocationOrder,
  exportOrderStatus,
  putOrderCloseDelivery
} from "@/api/order/orderManage";

import { provinces_based_id, subs } from "@/api/basicSupplier";

import {
  nameList,
  souName,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";

import { customerName } from "@/api/customerManage";

import { customerUserNameList } from "@/api/order/saleDown";

import { returnFloat } from "@/utils/index";

import { log } from "util";

import assignOrder from "../child/assign_order";
import assignOrderBatch from "../child/assign_order_batch";
import assignOrderHead from "../child/assign_order_head";
import takingOrder from "../child/taking_order";
import cancelOrder from "../child/cancel_order";
import refusalOrder from "../child/refusal_order";
import showOrderInfo from "../child/show_order_info";
import addRemarks from "../child/add_remarks";
import deliverGoods from "../child/deliver_goods";
import postDeliver from "../child/post_deliver";
import modifyFee from "../child/modify_fee";
import setPayee from "../child/set_payee";
import showWmsInfo from "../child/show_wms_info";
import returnOrderApply from "../child/return_order_apply";

export default {
  name: "MyOrder",
  inject: ["reload", "isFilterShow"],
  data() {
    return {
      statusCount: null,
      tabType: 0, //当前tab
      identiType: 0, //当前身份
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      orderStatus: 1, //选择的订单list状态
      remoteLoading: false, //筛选查询loading
      remoteCustomList: null,
      remoteProjectList: null,
      remoteCustomerList: null,
      remoteCustomerUserList: null,
      remoteGroupUserList: null,
      remoteAssignUserList: null,
      remoteBList: null,
      remoteBUserList: null,
      remoteServerList: null,
      remoteServerUserList: null,
      multipleSelection: [],
      provinces: [],
      city: [],
      county: [],
      query: {
        assignUserId: "",
        customerGroupUserDataAuthorityId: "",
        customerId: "",
        customerOrderNo: "",
        customerUserDataAuthorityId: "",
        customerUserId: "",
        customerUserPhone: "",
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
        staffId: "",
        startTime: "",
        status: "",
        urgent: "",
        userOwnType: "",
        pageNum: 1,
        pageSize: 10,
        timeRange: null
      },
      dialogVisible: false,
      tableData: [],
      totalPage: 0
    };
  },
  components: {
    assignOrder,
    assignOrderBatch,
    assignOrderHead,
    takingOrder,
    cancelOrder,
    refusalOrder,
    showOrderInfo,
    showWmsInfo,
    deliverGoods,
    postDeliver,
    modifyFee,
    setPayee,
    returnOrderApply,
    addRemarks
  },
  mounted() {
    this.getTableData(); // 获取表格数据
    this.getProvinces(); // 获取省市数据
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getTableData();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    resetForm() {
      this.query = {
        pageSize: 10,
        pageNum: 1
      };
      this.getTableData();
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    // 获取表格数据
    async getTableData() {
      await getStatusCount().then(res => {
        this.$set(this, "statusCount", res.data);
      });
      this.setIdentiType();
      this.getDataList();
    },
    getDataList() {
      getDataList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    setIdentiType() {
      this.identiType = !this.statusCount[this.tabType].ownType
        ? 0
        : this.statusCount[this.tabType].ownType[0] > 0
        ? 0
        : this.statusCount[this.tabType].ownType[1] > 0
        ? 1
        : 2;
      this.query.userOwnType = this.identiType;
    },
    // 获取省市数据
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = [{ name: "不限", id: -1 }, ...res.data];
        }
      });
    },
    getcity(id) {
      this.city = [];
      this.county = [];
      this.query.recipientAddressCityId = "";
      this.query.recipientAddressCountyId = "";
      if (id <= 0) {
        return false;
      }
      subs(id).then(res => {
        if (res.code == "000000") {
          this.city = [{ name: "不限", id: -1 }, ...res.data];
        }
      });
    },
    getcounty(id) {
      this.county = [];
      this.query.recipientAddressCountyId = "";
      if (id <= 0) return false;
      subs(id).then(res => {
        if (res.code == "000000") {
          this.county = [{ name: "不限", id: -1 }, ...res.data];
        }
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
    // 点击查询结果按钮
    queryForm() {
      this.query.pageNum = 1;
      this.getDataList();
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "name") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "organization") {
          organizationListName({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "manager") {
          simpleList({ userName: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "customer") {
          customerName(query).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "customerUser") {
          if (!this.query.customerId) {
            this.$message({
              type: "warning",
              message: "请先选择客户"
            });
            this.remoteLoading = false;
            return false;
          }
          customerUserNameList({
            username: query,
            customerId: this.query.customerId
          }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else {
          this[list] = [];
          this.remoteLoading = false;
        }
      } else {
        this[list] = [];
      }
    },
    // 点击改单按钮
    async checkOperate(row, validate) {
      let res = {};
      var validates = {
        orderCheckParams: validate,
        status: row.status,
        verison: row.version
      };
      res = await checkOrderOpa(row.id, validates);

      if (res.data) {
        this.oepnWin("EditMyOrder", {
          editId: row.id,
          type: this.identiType,
          isMyOrder: true
        });
      } else {
        let msg = res.message || "当前订单已取消，请刷新数据";
        this.$message({
          type: "error",
          message: msg
        });
      }
    },
    // 点击取消按钮
    async checkCancelOperate(row, validate) {
      let res = {};
      var validates = {
        orderCheckParams: validate,
        status: row.status,
        verison: row.version
      };
      res = await checkOrderOpa(row.id, validates);
      if (res.data) {
        this.showDialog("cancelOrder", row);
      } else {
        let msg = {
          1: "状态变更",
          2: "当前订单已发起结算，不可取消",
          3: "已存在取消申请",
          4: "没有权限",
          5: "拆单、自定义发货单不可取消",
          6: "当前状态该用户没有取消权限",
          7: "当前订单配送状态在已复核之后，无法进行取消"
        }[res.data];
        this.$message({
          type: "error",
          message: msg || "当前订单已更新，请刷新数据。"
        });
      }
    },
    // 展示给客户状态弹窗
    showWms(row) {
      this.showDialog("showWmsInfo", row);
    },
    showDialog(type, row) {
      this.$refs[type].init(row, true);
    },
    dialogCallback(type) {
      this.getTableData();
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    filterCell(cell) {
      if (cell.columnIndex == 6 && cell.row.urgent == 1) {
        return "setred";
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.pageNum = val;
      this.getDataList();
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    oepnWin(name, query) {
      // let routeData = this.$router.resolve({
      //   name: name,
      //   query: query
      // });
      // window.open(routeData.href, "_blank");
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
.brandBox >>> .el-table .el-tooltip1 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.brandBox >>> div.link p,
.brandBox >>> td.link .cell {
  color: #399;
  cursor: pointer;
}
.brandBox >>> td.link .cell p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.brandBox >>> .cell a.link {
  color: #399;
  cursor: pointer;
}
.brandBox >>> .setred {
  color: red;
}
</style>