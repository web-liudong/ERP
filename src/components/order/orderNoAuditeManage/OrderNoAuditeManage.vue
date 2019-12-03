<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button size="small" :class="{active:orderStatus==item.reviewStatus}" v-for="(item,index) in activeList" :key="index" @click="switchStatus(item.reviewStatus)">
        {{item.reviewStatusName}}({{item.count}})
      </el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer；margin-right:10px">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-show="isShow">
        <div class="chunk">
          <span>申请单号：</span>
          <el-input placeholder="申请单号" v-model="query.changeReviewNo" clearable></el-input>
        </div>
        <div class="chunk">
          <span>申请发起方：</span>
          <el-select v-model="query.cancelOriginator" clearable placeholder="不限">
            <el-option label="不限" value></el-option>
            <el-option label="第一服务方" value="0"></el-option>
            <el-option label="第二服务方" value="1"></el-option>
          </el-select>  
        </div>
        <div class="chunk">
          <span>申请人：</span>
         <el-select
            v-model="query.cancelUserId"
            filterable
            remote
            placeholder="申请人"
            :remote-method="(query)=>{
            querySearch(query,'user','remoteApplicantList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteApplicantList"
              :key="item.id+item.realName"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>  
        </div>
        <div class="chunk">
          <span>是否紧急：</span>
          <el-select v-model="query.urgent">
            <el-option label="不限" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>订单号：</span>
          <el-input v-model="query.no" placeholder="订单号"></el-input>
        </div>
        <div class="chunk">
          <span>外部订单号：</span>
          <el-input v-model="query.customerOrderNo" placeholder="外部订单号"></el-input>
        </div>
        <div class="chunk">
          <span>订单来源：</span>
           <el-select v-model="query.orderSource">
            <el-option label="不限" value></el-option>
            <el-option label="接口" value="1"></el-option>
            <el-option label="官网" value="2"></el-option>
            <el-option label="后台系统" value="0"></el-option>
            <el-option label="专柜" value="3"></el-option>
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
          <span>客户联系方式：</span>
          <el-input v-model="query.customerUserPhone" placeholder="客户联系方式"></el-input>
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
          <span>乙方客户负责人：</span>
            <el-select
            v-model="query.partyBPrincipalId"
            filterable
            remote
            placeholder="乙方客户负责人"
            :remote-method="(query)=>{
            querySearch(query,'manager','remoteBUserList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteBUserList"
              :key="item.id"
              :label="`${item.userName}-${item.realName}`"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>服务方：</span>
          <el-select
            v-model="query.firstServerId"
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
          <span>服务方客户负责人：</span>
           <el-select
            v-model="query.firstServerUserId"
            filterable
            remote
            placeholder="服务方客户负责人"
            :remote-method="(query)=>{
            querySearch(query,'manager','remoteServerUserList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteServerUserList"
              :key="item.id"
              :label="`${item.userName}-${item.realName}`"
              :value="item.id"
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
              :label="`${item.userName}-${item.realName}`"
              :value="item.id"
            ></el-option>
          </el-select>
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
          <el-select v-model="query.recipientAddressCityId" placeholder="选择城市" @change="getcounty">
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
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>集团客户负责人：</span>
          <el-select
            v-model="query.customerGroupUserId"
            filterable
            remote
            placeholder="集团客户负责人"
            :remote-method="(query)=>{
            querySearch(query,'manager','remoteGroupUserList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteGroupUserList"
              :key="item.id"
              :label="`${item.userName}-${item.realName}`"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="chunk" style="width: 50%;">
          <span>日期：</span>
          <el-select v-model="query.dateType">
            <el-option label="申请日期" value="0"></el-option>
            <el-option label="下单日期" value="1"></el-option>
          </el-select>
          <el-date-picker
            v-model="query.startTime"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-date-picker
            v-model="query.endTime"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
        <div class="chunk">
          <span>订单类型：</span>
          <el-select v-model="query.orderType">
            <el-option label="不限" value></el-option>
            <el-option label="常规" value="0"></el-option>
            <el-option label="赠品" value="1"></el-option>
            <el-option label="积分兑换" value="2"></el-option>
          </el-select>
        </div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <!-- <div class="button-head" @click="showDialog('setRelease', {shoppeId:shoppeId})">
            <i class="icon-feiji iconfont button-head-icon icon-plane"></i>导出订单
          </div> -->
          <!-- <div class="button-head" @click="toAddGoods()">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>创建订单
          </div>-->
        </div>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%"  size="small" :max-height="dataListHeight">
      <el-table-column type="selection" fixed="left"></el-table-column>
      <el-table-column prop="changeReviewNo" label="申请单号" align="center" fixed="left" width="160">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('CancelOrderDetail',{ id: scope.row.orderCancelReviewId })"
            type="text"
            size="small"
          >{{scope.row.changeReviewNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="no" label="订单号" align="center" fixed="left" width="150">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('OrderDetail',{ id: scope.row.id })"
            type="text"
            size="small"
          >{{scope.row.no}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="customerOrderNo" label="外部订单号" align="center" fixed="left" width="150"></el-table-column>
      <el-table-column prop="orderSource" label="订单来源" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderSource|AA}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderType" label="订单类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.orderType|BB}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="urgent" label="是否紧急" align="center">
        <template slot-scope="scope">
          <span :style="{color:scope.row.urgent==1?'red':''}">{{scope.row.urgent|EE}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目" align="center" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="customerName" label="客户" align="center" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="customerUserName" label="客户采购人" align="center" width="120"></el-table-column>
      <el-table-column prop="staffName" label="业务员" align="center" width="120"></el-table-column>
      <el-table-column prop="customerUserPhone" label="采购人联系方式" align="center" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="customerReceiptAddress" label="客户收货地址" align="center" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="amount" label="订单金额" align="center">
        <template slot-scope="scope">
          <span>￥{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payTypeName" label="付款方式" align="center"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expectedDeliveryDate" label="期望配送日期" align="center" show-overflow-tooltip width="130"></el-table-column>
      <el-table-column prop="statusName" label="订单状态" align="center"></el-table-column>
      <!-- <el-table-column prop="projectName" label="服务方是否拒单" align="center"></el-table-column> -->
      <el-table-column prop="partyBName" label="项目乙方" align="center" show-overflow-tooltip></el-table-column>  
      <el-table-column prop="customerUserDataAuthorityName" label="乙方客户负责人" align="center" width="120"></el-table-column>
      <el-table-column prop="firstServerName" label="服务方" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="firstServerUserName" label="服务方接单人" align="center" width="120"></el-table-column>
      <el-table-column prop="secondServerName" label="第二服务方" align="center" width="100"></el-table-column>
      <el-table-column prop="secondServerUserName" label="第二服务方接单人" align="center" width="140"></el-table-column>
      <el-table-column prop="customerGroupUserDataAuthorityName" label="集团客户负责人" align="center" width="140"></el-table-column>
      <el-table-column prop="assignUserName" label="派单员" align="center"></el-table-column>
      <el-table-column prop="originator" label="申请发起方" align="center" fixed="right" width="120">
        <template slot-scope="scope">
          
          <span>{{scope.row.originator}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cancelUserName" label="申请人" align="center" fixed="right"></el-table-column>
      <el-table-column prop="partyBReviewStatus" label="审核状态" align="center" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.partyBReviewStatus}}</span>
          <br>
          <span v-if="orderStatus==2||orderStatus==99 ">{{scope.row.partyBNoPassReason}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button @click="showDialog('setEditNav',scope.row)" type="text" size="small">派单</el-button> -->
          <el-button
            type="text"
            size="small"
            v-if="scope.row.partyBReviewStatus=='待审核'&&$authorities.OrderCancelOrderExamine"
            @click="getLocalId(scope.row.orderCancelReviewId)"
          >审核</el-button>
           <!-- @click="oepnWin('AuditeNoManage',{ id: scope.row.orderCancelReviewId })" -->
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNum"
        :page-size="query.pageSize"
        :page-sizes="[10,20,30,40,50,100,500]"
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalPage"
        background
      ></el-pagination>
    </div>

    <!-- <cancelOrder ref="cancelOrder" @callback="dialogCallback"></cancelOrder> -->
  </div>
</template>
<script>
import { orderList ,getCancelAuditeList,getCancelPassList,getCancelRejectList,getCancelStatus,
getCustomerList,getUser,getCancelCheck } from "@/api/ordernodraft.js";

import {
  nameList,
  souName,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";
import { customerName } from "@/api/customerManage";
import { customerUserNameList } from "@/api/order/saleDown";
import { provinces_based_id, subs } from "@/api/basicSupplier";

// import cancelOrder from "../child/cancel_order";
export default {
  inject: ["reload",'close', "isFilterShow"],
  name:'OrderNoAuditeManage',
  data() {
    var check = (rule, value, callback) => {
      console.log("check");
      if (!value) {
        return callback(new Error("请选择导航设置"));
      }
      //callback();
    };
    return {
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      orderStatus: 99, //选择的订单list状态
      activeList:null,
      remoteLoading: false, //筛选查询loading
      remoteNameList: null,
      remoteAuthorList: null,
      remoteCustomList: null,
      remoteProjectList: null,
      remoteCustomerList: null,
      remoteCustomerUserList: null,
      remoteGroupUserList:null,
      remoteAssignUserList:null,
      remoteBList: null,
      remoteBUserList: null,
      remoteServerList: null,
      remoteServerUserList: null,
      remoteApplicantList:null,
      provinces: [],
      city: [],
      county: [],
      options:[{value:'第一服务方',label:0},{value:'第二服务方',label:1}],
      provinceList:null,
      cityList:null,
      countyList:null,
      query: {
        assignUserId: null, //派单员id
        cancelOriginator: null, //取消发起方
        customerGroupUserId: null, //集团客户负责人id
        customerId: null, //客户id
        customerOrderNo: null, //外部订单号
        customerUserId: null, //客户采购人id
        customerUserPhone: null, //客户联系方式
        dateType: null, //	日期类型（0：下单日期； 1：期望配送日期； 2：分派日期； 3：完成日期；）
        endTime: null, //操作结束时间
        firstServerId:null, ///服务方id
        firstServerUserId: null, //服务方负责人id
        no: null, //订单号
        changeReviewNo: null, //申请单号
        orderSource: null, //订单来源（0：后台，1：接口，2：官网，3：专柜
        orderType: null, //订单类型（0：常规订单，1：赠品订单，2：积分订单）
        partyBId: null, //项目乙方id
        partyBPrincipalId:null, //乙方客户负责人id
        partyBReviewStatus: null, //乙方审核状态 0:未审核，1：已通过，2：已驳回
        projectId: null, //项目id
        recipientAddressCityId: null, //市id
        recipientAddressCountyId: null, //县id
        recipientAddressProvinceId: null, //省id
        startTime: null, //操作开始时间
        urgent: null, //是否紧急
        pageNum: 1,
        pageSize: 10,
        staffId:null,//业务员id
      },
      dialogVisible: false,
      tableData: [],
      totalPage: 0,
      editForm: {
        nav: "1"
      },
      rules: {
        nav: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  components: {
    // cancelOrder
  },
  created(){
  this.getCancelStatus()
  this.getTableData()
  },
  activated(){
   this.$route.query.status === undefined? this.orderStatus = 99:this.orderStatus = this.$route.query.status-1;
   if(this.$route.params.isUpdate){
     this.getCancelStatus();
     this.getTableData();
   }
  },
  filters: {
    AA(val) {
      return val == 0
        ? (val = "后台")
        : val == 1
        ? (val = "接口")
        : val == 2
        ? (val = "官网")
        : val == 3
        ? (val = "专柜")
        : "";
    },
    BB(val) {
      return val == 0
        ? (val = "常规订单")
        : val == 1
        ? (val = "赠品订单")
        : val == 2
        ? (val = "积分订单")
        : "";
    },
    CC(val) {
      return val == 0
        ? (val = "第一服务方")
        : val == 1
        ? (val = "第二服务方")
        : "";
    },
    DD(val) {
      return val == 0
        ? (val = "待审核")
        : val == 1
        ? (val = "已通过")
        : val == 2
        ? (val = "已驳回")
        : "";
    },
    EE(val) {
      return val == 0 ? (val = "否") : val == 1 ? (val = "是") : "";
    }
  },
  mounted() {
    this.getProvinces();
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset(){
      this.query={
        assignUserId: null, //派单员id
        cancelOriginator: null, //取消发起方
        customerGroupUserId: null, //集团客户负责人id
        customerId: null, //客户id
        customerOrderNo: null, //外部订单号
        customerUserId: null, //客户采购人id
        customerUserPhone: null, //客户联系方式
        dateType: null, //	日期类型（0：下单日期； 1：期望配送日期； 2：分派日期； 3：完成日期；）
        endTime: null, //操作结束时间
        firstServerId:null, ///服务方id
        firstServerUserId: null, //服务方负责人id
        no: null, //订单号
        changeReviewNo: null, //申请单号
        orderSource: null, //订单来源（0：后台，1：接口，2：官网，3：专柜
        orderType: null, //订单类型（0：常规订单，1：赠品订单，2：积分订单）
        partyBId: null, //项目乙方id
        partyBPrincipalId:null, //乙方客户负责人id
        partyBReviewStatus: null, //乙方审核状态 0:未审核，1：已通过，2：已驳回
        projectId: null, //项目id
        recipientAddressCityId: null, //市id
        recipientAddressCountyId: null, //县id
        recipientAddressProvinceId: null, //省id
        startTime: null, //操作开始时间
        urgent: null, //是否紧急
        pageNum: 1,
        pageSize: 10
      };
      this.getCancelStatus()
      this.getTableData()
    },
    getLocalId(orderCancelReviewId) {
        getCancelCheck(orderCancelReviewId).then(res=>{
          if(res.success==true){
            this.oepnWin('AuditeNoManage',{ id: orderCancelReviewId ,source:'OrderNoAuditeManage'}) 
          }else{
            this.$confirm(res.message, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              })
                .then(res => {
                 this.switchStatus(this.orderStatus)              
                })
                .catch(() => {});
          }
      })
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    getCancelStatus(){
      getCancelStatus().then(res=>{
        this.activeList=res.data;
      })
    },
    //获取表格数据
    getTableData() {
      if(this.orderStatus==99){
        orderList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
      }
      if(this.orderStatus==0){
        getCancelAuditeList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
      }
      if(this.orderStatus==1){
        getCancelPassList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
      }
       if(this.orderStatus==2){
        getCancelRejectList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
      }
    },
    selectPicker(time){
      if(time){
        this.query.startTime = time[0];
        this.query.endTime = time[1];
      }else{
        this.query.startTime = "";
        this.query.endTime = "";
      }
    },
    switchStatus(val) {
      this.orderStatus = val;
      this.query.pageNum=1;
      this.getTableData();
      this.getCancelStatus();
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
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
      if (id <= 0) return false;
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
            userName: query,
            customerId: this.query.customerId
          }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        }else if(type=='user'){
             getUser({userName:query}).then(res=>{
               this[list]=res.data;
               this.remoteLoading=false;
             })
        }else {
          this[list] = [];
          this.remoteLoading = false;
        }
      } else {
        this[list] = [];
      }
    },
     querySearchName(query, callback) {
      if (query !== "") {
        this.remoteLoading = true;
        nameList({ name: query }).then(res => {
          if (res.data.length) {
            let arr = res.data.map(val => {
              return {
                value: val.name,
                id: val.id
              };
            });
            callback(arr);
          } else {
            callback([]);
          }

          this.remoteLoading = false;
        });
      } else {
        callback([]);
      }
    },
    getUserName(val,list){
     let aaaa=JSON.parse(JSON.stringify(this[list]));
      aaaa=aaaa.filter(item=>{
        return item.userName==val  
      })
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.pageSize=val;
      this.getTableData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.pageNum=val;
      this.getTableData()
    },
    oepnWin(name, query) {
      // let routeData = this.$router.resolve({
      //   name: name,
      //   query: query
      // });
      // window.open(routeData.href, "_blank");
      this.$router.push({name:name,query:query})
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
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
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
      margin: 10px 10px 0 0;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      span {
        margin: 10px 0 0 10px;
        flex: 0 0 80px;
      }
      .chunk {
        width: 23%;
        display: flex;
        margin: 10px 0 0 10px;
      }
      // .el-input {
      //   width: 185px;
      //   // line-height: 56px;
      //   // margin: 10px 0;
      // }
    }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    .listBoxTop {
    line-height: 50px;
      display: flex;
      justify-content: space-between;
      .listBoxTop-left {
        width: 110px;
        display: flex;
        .myicon {
          margin-left: 10px;
        }
        span {
          margin-left: 5px;
          font-size: 14px;
          color: #303133;
          line-height: 50px;
          display: inline-block;
          width: 60px;
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
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
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
}
</style>