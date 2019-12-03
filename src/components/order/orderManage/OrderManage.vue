<template>
  <div class="brandBox">
    <div class="buttonBox" v-if="statusCount">
      <!-- <el-button
        size="small"
        :class="{active:tabType==5}"
        @click="switchStatus(5)"
      >全部（{{statusCount[5].statusCount}}）</el-button>-->
      <el-button
        size="small"
        :class="{active:tabType==0}"
        @click="switchStatus(0)"
      >待分派（{{statusCount[0].statusCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:tabType==1}"
        @click="switchStatus(1)"
      >待接受（{{statusCount[1].statusCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:tabType==2}"
        @click="switchStatus(2)"
      >发货中（{{statusCount[2].statusCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:tabType==3}"
        @click="switchStatus(3)"
      >已完成（{{statusCount[3].statusCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:tabType==4}"
        @click="switchStatus(4)"
      >已取消（{{statusCount[4].statusCount}}）</el-button>
    </div>
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
              <el-option label="后台竞价订单" value="4"></el-option>
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
              @change="changeCustomer"
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
            <span>客户部门：</span>
            <el-select
              v-model="query.customerUserGroupId"
              filterable
					    remote
              placeholder="客户部门"
              :remote-method="remotecustomerUserGroup"
              @change="changeCustomerUserGroup"
              clearable
            >
              <el-option
                v-for="item in remoteCustomerUserGroupList"
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
            <el-input v-model="query.customerUserPhone" clearable placeholder="客户联系方式"></el-input>
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
              v-model="query.customerUserDataAuthorityId"
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
                :label="item.userName+'-'+item.realName"
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
          <div class="chunk">
            <span>集团客户负责人：</span>
            <el-select
              v-model="query.customerGroupUserDataAuthorityId"
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
          <div class="chunk" v-if="tabType == 0">
            <span>服务方是否拒单：</span>
            <el-select v-model="query.serverRejectStatus">
              <el-option label="不限" value></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </div>
          <div class="chunk" v-if="tabType == 2">
            <span>服务方是否改单：</span>
            <el-select v-model="query.serverChangedStatus">
              <el-option label="不限" value></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是(待审核)" value="1"></el-option>
              <el-option label="是(已驳回)" value="2"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>订单类型：</span>
            <el-select v-model="query.orderType">
              <el-option label="不限" value></el-option>
              <el-option label="常规订单" value="0"></el-option>
              <el-option label="赠品订单" value="1"></el-option>
              <el-option label="积分订单" value="2"></el-option>
              <el-option label="竞价订单" value="3"></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop" v-if="statusCount">
        <div class="listBoxTop-left" v-if="tabType == 0">
          <ul class="tabs">
            <li class="active">
              <i class="iconfont iconjinridingdanshu myicon"></i> 数据列表
            </li>
          </ul>
        </div>
        <div class="listBoxTop-left" v-else>
          <ul class="tabs">
            <li
              :class="{active:identiType==0}"
              @click="switchIdentity(0)"
              v-if="statusCount[tabType].ownType && statusCount[tabType].ownType[0] > 0"
            >
              <i class="iconfont iconjinridingdanshu myicon"></i> 项目乙方
            </li>
            <li
              :class="{active:identiType==1}"
              @click="switchIdentity(1)"
              v-if="statusCount[tabType].ownType && statusCount[tabType].ownType[1] > 0"
            >
              <i class="iconfont iconjinridingdanshu myicon"></i> 服务方
            </li>
            <li
              :class="{active:identiType==2}"
              @click="switchIdentity(2)"
              v-if="statusCount[tabType].ownType && statusCount[tabType].ownType[2] > 0"
            >
              <i class="iconfont iconjinridingdanshu myicon"></i> 第二服务方
            </li>
            <li class="active" v-if="statusCount[tabType].statusCount == 0">
              <i class="iconfont iconjinridingdanshu myicon"></i> 数据列表
            </li>
          </ul>
        </div>
        <div class="listBoxRight">
          <div
            class="button-head"
            @click="batchAssign()"
            v-if="$authorities.OrderAssignBatch && tabType == 0"
          >
            <i class="iconbianjifenlei iconfont button-head-icon"></i>批量派单
          </div>
          <div
            class="button-head"
            @click="batchTaking()"
            v-if="$authorities.OrderTakingBetch && tabType == 0"
          >
            <i class="iconbianjifenlei iconfont button-head-icon"></i>批量派接
          </div>
          <div
            class="button-head"
            @click="batchTakingAccept()"
            v-if="$authorities.OrderTakingBetch && tabType == 1 && identiType == 1"
          >
            <i class="iconbianjifenlei iconfont button-head-icon"></i>批量接单
          </div>
          <div
            class="button-head"
            @click="batchCreatInvoice()"
            style="width: 190px;"
            v-if="$authorities.OrderCreatDeliverBetch && tabType == 2 && identiType == 1"
          >
            <i class="iconbianjifenlei iconfont button-head-icon"></i>批量生成发货单（整单发货）
          </div>
          <div class="button-head" @click="oepnWin('saleDown')" v-if="$authorities.OrderCreat">
            <i class="iconzengjia iconfont button-head-icon"></i>创建订单
          </div>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      :max-height="dataListHeight"
      style="width: 100%"
      size="small"
      ref="orderList"
      :cell-class-name="filterCell"
      :row-class-name="filterRow"
      :row-style="selectedHighlight"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      :key="`table${tabType}+${identiType}`"
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
      <el-table-column prop="oldErpOrderId" label="旧系统订单号" align="center" width="100" fixed="left"></el-table-column>
      <el-table-column prop="customerOrderNo" label="外部订单号" align="center" width="100"></el-table-column>
      <el-table-column prop="memoOrderNo" label="备注订单号" align="center" width="100"></el-table-column>
      <el-table-column prop="orderSourceName" label="订单来源" align="center"></el-table-column>
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
      <el-table-column prop="customerUserGroupName" label="客户部门" width="100" align="center"></el-table-column>
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
      <el-table-column prop="recipientName" label="收货人" width="120" align="center" v-if="tabType == 1 && identiType == 1"></el-table-column>
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
      <el-table-column
        prop="finishTime"
        label="完成时间"
        align="center"
        v-if="tabType == 5 || tabType == 3"
      ></el-table-column>
      <el-table-column
        prop="serverChangedOrder"
        label="服务方是否改单"
        width="120"
        align="center"
        v-if="tabType == 2"
      >
        <template slot-scope="scope">
          <p>{{scope.row.serverChangedOrder}}{{scope.row.partyBReviewStatusName && '('+scope.row.partyBReviewStatusName+')'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="serverCancelOrder"
        label="服务方是否取消"
        width="120"
        align="center"
        v-if="tabType == 2"
      >
        <template slot-scope="scope">
          <p>{{scope.row.serverCancelOrder}}{{scope.row.partyBCancelReviewStatusName && '('+scope.row.partyBCancelReviewStatusName+')'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="deliveryTypeName"
        label="订单发货类型"
        align="center"
        v-if="tabType == 2 || tabType == 3"
      ></el-table-column>
      <el-table-column
        prop="deliveryStatusName"
        label="配送状态"
        align="center"
        width="100"
        v-if="tabType == 5 || tabType == 2 || tabType == 3"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.deliveryType == 1">{{scope.row.deliveryStatusName}}</p>
          <a
            v-if="scope.row.deliveryType > 0"
            class="link"
            @click="oepnWin('InvoiceManage', { orderNo: scope.row.no});"
          >查看发货单</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerStatusType"
        label="展示给客户状态"
        align="center"
        width="120"
        v-if="(tabType == 2 || tabType == 3) && identiType == 0"
      >
        <template slot-scope="scope">
          <p>{{{0:'--',1:'仓库已响应',2:'仓库已发货',3:'确认已送达'}[scope.row.customerStatusType]}}</p>
          <a v-if="scope.row.customerStatusType != 0" class="link" @click="showWms(scope.row);">查看详情</a>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="evaluated"
        label="评价状态"
        align="center"
        v-if="tabType == 5 || tabType == 3"
      ></el-table-column>-->
      <el-table-column
        prop="serverRejectStatus"
        label="服务方是否拒单"
        width="120"
        align="center"
        v-if="tabType == 0"
      >
        <div slot-scope="scope" class="link" v-if="scope.row.serverRejectReason">
          <el-popover
            placement="top-start"
            title="拒单原因"
            width="200"
            trigger="hover"
            :content="scope.row.serverRejectReason"
          >
            <p slot="reference">{{scope.row.serverRejectStatus}}</p>
          </el-popover>
        </div>
        <div slot-scope="scope" v-else>
          <p>{{scope.row.serverRejectStatus}}</p>
        </div>
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
        prop="firstServerName"
        label="服务方接单人"
        width="140"
        align="center"
        class-name="link"
        v-if="tabType != 0"
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
        v-if="tabType != 0"
      ></el-table-column>
      <el-table-column
        prop="secondServerUserName"
        label="第二服务方接单人"
        width="180"
        align="center"
        class-name="link"
        v-if="tabType !=0 && tabType !=1"
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
      <el-table-column prop="creatorName" label="制单人" align="center">
        <div slot-scope="scope" v-if="scope.row.creatorId">
          <p
            @click="showDialog('showOrderInfo',{'title':'人员信息','type':'userInfo', 'id':scope.row.creatorId})"
            style="color:#399;cursor: pointer;"
          >{{scope.row.creatorName}}</p>
        </div>
        <div v-else>
          <p>客户</p>
        </div>
      </el-table-column>
      <!--待分派操作-->
      <el-table-column
        label="操作"
        align="center"
        width="250"
        fixed="right"
        v-if="tabType == 0"
        key="opa1"
      >
        <div slot-scope="scope" v-if="!scope.row.assignUserId">
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
            v-if="$authorities.OrderEdit && scope.row.orderSource=='后台'"
          >改单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkCancelOperate(scope.row)"
            v-if="$authorities.OrderCancel && scope.row.orderSource=='后台'"
          >取消</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, null, ['ORDER_STATUS_CHANGE'])"
            v-if="$authorities.OrderSetAssignUser"
          >指定派单员</el-button>
        </div>
        <div slot-scope="scope" v-else>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 1, ['ORDER_STATUS_CHANGE'])"
            v-if="$authorities.OrderAssignRelevant"
          >派单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
            v-if="$authorities.OrderEdit"
          >改单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkCancelOperate(scope.row)"
            v-if="$authorities.OrderCancel"
          >取消</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 20, ['ORDER_STATUS_CHANGE'])"
            v-if="$authorities.OrderDeliveryUpload"
          >上传送货单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
            v-if="$authorities.OrderAddMemo"
          >添加备注</el-button>
        </div>
      </el-table-column>
      <!--待接受操作-->
      <el-table-column
        label="操作"
        align="center"
        width="200"
        fixed="right"
        v-else-if="tabType == 1"
        key="opa2"
      >
        <div slot-scope="scope" v-if="identiType == 0">
          <template v-if="scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0">
            <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 8, ['ORDER_STATUS_CHANGE'])"
              v-if="$authorities.OrderAuditeEditer&&$authorities.OrderChangeOrderExamine"
            >审核【改单申请】</el-button>
          </template>
          <template v-else>
            <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 1, ['ORDER_STATUS_CHANGE'])"
              v-if="$authorities.OrderAssignRelevant"
            >重新分派</el-button>
            <el-button
              type="text"
              size="small"
              @click="checkCancelOperate(scope.row)"
              v-if="$authorities.OrderCancel"
            >取消</el-button>
            <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
              v-if="$authorities.OrderAddMemo"
            >添加备注</el-button>
          </template>
        </div>
        <div
          slot-scope="scope"
          v-else-if="identiType == 1 && scope.row.firstServerStatus == 0 && (scope.row.serverChangedOrder != '是' || (scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus != 0))"
        >
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 12, ['ORDER_STATUS_CHANGE','ORDER_REASSIGN'])"
            v-if="$authorities.OrderTaking"
          >接单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 11, ['ORDER_STATUS_CHANGE','ORDER_REASSIGN'])"
            v-if="$authorities.OrderRefusal"
          >拒单</el-button>
        </div>
        <div
          slot-scope="scope"
          v-else-if="identiType == 2 && (scope.row.serverChangedOrder != '是' || (scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus != 0))"
        >
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 12, ['ORDER_STATUS_CHANGE','ORDER_REASSIGN'])"
            v-if="$authorities.OrderTaking"
          >接单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 11, ['ORDER_STATUS_CHANGE','ORDER_REASSIGN'])"
            v-if="$authorities.OrderRefusal"
          >拒单</el-button>
        </div>
        <div v-else>
          <span>--</span>
        </div>
      </el-table-column>
      <!--发货中操作-->
      <el-table-column
        label="操作"
        align="center"
        width="250"
        fixed="right"
        v-else-if="tabType == 2"
        key="opa3"
      >
        <!--乙方-->
        <div slot-scope="scope" v-if="identiType == 0">
          <!--未发货-->
          <template v-if="scope.row.deliveryType == 0">
            <template
              v-if="scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0"
            >
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 8, ['ORDER_STATUS_CHANGE'])"
                v-if="$authorities.OrderAuditeEditer&&$authorities.OrderChangeOrderExamine"
              >审核【改单申请】</el-button>
            </template>
            <template
              v-else-if="scope.row.serverCancelOrder == '是' && scope.row.partyBCancelReviewStatus == 0"
            >
              <el-button
                type="text"
                size="small"
                @click="checkCancelReviewOperate(scope.row)"
                v-if="$authorities.OrderAuditeCancel&&$authorities.OrderCancelOrderExamine"
              >审核【取消订单申请】</el-button>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 21, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_GENERATE','ORDER_BILL_EXIST','ORDER_SERVER_DATA_CHANGE'])"
                v-if="$authorities.OrderResetAssign"
              >收回重派</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
                v-if="$authorities.OrderEdit"
              >改单</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkCancelOperate(scope.row)"
                v-if="$authorities.OrderCancel"
              >取消</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualResponse && scope.row.customerStatusType == 0"
                @click="checkOperate(scope.row, 17, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动响应</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualDeliver && scope.row.customerStatusType == 1"
                @click="checkOperate(scope.row, 5, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动发货</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualPost && scope.row.customerStatusType == 2"
                @click="checkOperate(scope.row, 6, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动送达</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 7, ['ORDER_STATUS_CHANGE','ORDER_SERVICE_FEE_REVIEW'])"
                v-if="$authorities.OrderModifyFee"
              >修改服务方服务费</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
                v-if="$authorities.OrderAddMemo"
              >添加备注</el-button>
            </template>
          </template>
          <!--整单发货-->
          <template v-else-if="scope.row.deliveryType == 1">
            <template
              v-if="scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0"
            >
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 8, ['ORDER_STATUS_CHANGE'])"
                v-if="$authorities.OrderAuditeEditer&&$authorities.OrderChangeOrderExamine"
              >审核【改单申请】</el-button>
            </template>
            <template
              v-else-if="scope.row.serverCancelOrder == '是' && scope.row.partyBCancelReviewStatus == 0"
            >
              <el-button
                type="text"
                size="small"
                @click="checkCancelReviewOperate(scope.row)"
                v-if="$authorities.OrderAuditeCancel&&$authorities.OrderCancelOrderExamine"
              >审核【取消订单申请】</el-button>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderEdit && scope.row.deliveryStatus < 4"
                @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
              >改单</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderCancel && scope.row.deliveryStatus < 4"
                @click="checkCancelOperate(scope.row)"
              >取消</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualResponse && scope.row.customerStatusType == 0"
                @click="checkOperate(scope.row, 17, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动响应</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualDeliver && scope.row.customerStatusType == 1"
                @click="checkOperate(scope.row, 5, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动发货</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualPost && scope.row.customerStatusType == 2"
                @click="checkOperate(scope.row, 6, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动送达</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 7, ['ORDER_STATUS_CHANGE','ORDER_SERVICE_FEE_REVIEW'])"
                v-if="$authorities.OrderModifyFee"
              >修改服务方服务费</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
                v-if="$authorities.OrderAddMemo"
              >添加备注</el-button>
            </template>
          </template>
          <!--拆单和自定义发货-->
          <template v-else>
            <template
              v-if="scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0"
            >
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 8, ['ORDER_STATUS_CHANGE'])"
                v-if="$authorities.OrderAuditeEditer&&$authorities.OrderChangeOrderExamine"
              >审核【改单申请】</el-button>
            </template>
            <template
              v-else-if="scope.row.serverCancelOrder == '是' && scope.row.partyBCancelReviewStatus == 0"
            >
              <el-button
                type="text"
                size="small"
                @click="checkCancelReviewOperate(scope.row)"
                v-if="$authorities.OrderAuditeCancel&&$authorities.OrderCancelOrderExamine"
              >审核【取消订单申请】</el-button>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualResponse && scope.row.customerStatusType == 0"
                @click="checkOperate(scope.row, 17, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动响应</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualDeliver && scope.row.customerStatusType == 1"
                @click="checkOperate(scope.row, 5, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动发货</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderManualPost && scope.row.customerStatusType == 2"
                @click="checkOperate(scope.row, 6, ['ORDER_STATUS_CHANGE','ORDER_RETURN'])"
              >手动送达</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 7, ['ORDER_STATUS_CHANGE','ORDER_SERVICE_FEE_REVIEW'])"
                v-if="$authorities.OrderModifyFee"
              >修改服务方服务费</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
                v-if="$authorities.OrderAddMemo"
              >添加备注</el-button>
            </template>
          </template>
        </div>
        <!--服务方-->
        <div slot-scope="scope" v-else-if="identiType == 1">
          <!--未发货-->
          <div v-if="scope.row.deliveryType == 0">
            <template
              v-if="(scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0) || (scope.row.serverCancelOrder == '是' && scope.row.partyBCancelReviewStatus == 0)"
            >
              <!-- <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
                v-if="$authorities.OrderSetPayee"
              >设置委托收款方</el-button>-->
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderEdit && !scope.row.secondServerId"
                @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
              >改单</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderCancel && !scope.row.secondServerId"
                @click="checkCancelOperate(scope.row)"
              >取消</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 14, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_GENERATE_TYPE'])"
                v-if="$authorities.OrderCreatDeliver"
              >生成发货单</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 22, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_GENERATE'])"
              >修改业务员</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderAddMemo && !scope.row.secondServerId"
                @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
              >添加备注</el-button>
              <!-- <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
                v-if="$authorities.OrderSetPayee"
              >设置委托收款方</el-button>-->
            </template>
          </div>
          <!--整单发货-->
          <div v-else-if="scope.row.deliveryType == 1">
            <template
              v-if="(scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0) || (scope.row.serverCancelOrder == '是' && scope.row.partyBCancelReviewStatus == 0)"
            >
              <!-- <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
                v-if="$authorities.OrderSetPayee"
              >设置委托收款方</el-button>-->
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderEdit && !scope.row.secondServerId && scope.row.deliveryStatus < 4"
                @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
              >改单</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderCancel && !scope.row.secondServerId && scope.row.deliveryStatus < 4"
                @click="checkCancelOperate(scope.row)"
              >取消</el-button>
              <!-- <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderApplyReturn && !scope.row.secondServerId"
                @click="checkOperate(scope.row, 10, ['CAN_RETURN_ORDER'])"
              >申请退货</el-button> -->
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderAddMemo && !scope.row.secondServerId && scope.row.deliveryStatus < 4"
                @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
              >添加备注</el-button>
              <!-- <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
                v-if="$authorities.OrderSetPayee"
              >设置委托收款方</el-button>-->
            </template>
          </div>
          <!--拆单发货-->
          <div v-else-if="scope.row.deliveryType == 2">
            <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 14, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_GENERATE_TYPE'])"
              v-if="$authorities.OrderCreatDeliver  && scope.row.closeCreateOrderDelivery == 0"
            >生成发货单</el-button>
            <!-- <el-button
              type="text"
              size="small"
              v-if="$authorities.OrderApplyReturn && !scope.row.secondServerId"
              @click="checkOperate(scope.row, 10, ['CAN_RETURN_ORDER'])"
            >申请退货</el-button> -->
            <!-- <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
              v-if="$authorities.OrderSetPayee"
            >设置委托收款方</el-button>-->
          </div>
          <!--自定义发货-->
          <div v-else>
            <el-button
              type="text"
              size="small"
              v-if="$authorities.OrderCreatDeliver && scope.row.closeCreateOrderDelivery == 0"
              @click="checkOperate(scope.row, 14, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_GENERATE_TYPE'])"
            >生成发货单</el-button>
            <el-button
              type="text"
              size="small"
              v-if="$authorities.OrderCreatDeliverClose && scope.row.closeCreateOrderDelivery == 0"
              @click="checkOperate(scope.row, 15, ['ORDER_STATUS_CHANGE'])"
            >关闭生成发货单</el-button>
            <!-- <el-button
              type="text"
              size="small"
              v-if="$authorities.OrderApplyReturn && !scope.row.secondServerId"
              @click="checkOperate(scope.row, 10, ['CAN_RETURN_ORDER'])"
            >申请退货</el-button> -->
            <!-- <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
              v-if="$authorities.OrderSetPayee"
            >设置委托收款方</el-button>-->
          </div>
        </div>
        <div slot-scope="scope" v-else>
          <template v-if="scope.row.deliveryType == 0">
            <template
              v-if="(scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0) || (scope.row.serverCancelOrder == '是' && scope.row.partyBCancelReviewStatus == 0)"
            >
              <span>--</span>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
                v-if="$authorities.OrderEdit"
              >改单</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkCancelOperate(scope.row)"
                v-if="$authorities.OrderCancel"
              >取消</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
                v-if="$authorities.OrderAddMemo"
              >添加备注</el-button>
            </template>
          </template>
          <template v-else-if="scope.row.deliveryType == 1">
            <template
              v-if="(scope.row.serverChangedOrder == '是' && scope.row.partyBReviewStatus == 0) || (scope.row.serverCancelOrder == '是' && scope.row.partyBCancelReviewStatus == 0)"
            >
              <span>--</span>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderEdit && scope.row.deliveryStatus < 4"
                @click="checkOperate(scope.row, 2, ['ORDER_STATUS_CHANGE','ORDER_DELIVERY_TYPE','ORDER_BILL_EXIST','ORDER_UPDATE_PERMISSION'])"
              >改单</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderCancel && scope.row.deliveryStatus < 4"
                @click="checkCancelOperate(scope.row)"
              >取消</el-button>
              <!-- <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 10, ['CAN_RETURN_ORDER'])"
                v-if="$authorities.OrderApplyReturn"
              >申请退货</el-button> -->
              <el-button
                type="text"
                size="small"
                v-if="$authorities.OrderAddMemo && scope.row.deliveryStatus < 4"
                @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
              >添加备注</el-button>
            </template>
          </template>
          <template v-else>
            <!-- <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 10, ['CAN_RETURN_ORDER'])"
              v-if="$authorities.OrderApplyReturn"
            >申请退货</el-button> -->
          </template>
        </div>
      </el-table-column>
      <!--已完成操作-->
      <el-table-column
        label="操作"
        align="center"
        width="150"
        fixed="right"
        v-else-if="tabType == 3"
        key="opa4"
      >
        <div slot-scope="scope" v-if="identiType == 0">
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 7, ['ORDER_STATUS_CHANGE','ORDER_SERVICE_FEE_REVIEW'])"
            v-if="$authorities.OrderModifyFee"
          >修改服务方服务费</el-button>
        </div>
        <div slot-scope="scope" v-else-if="identiType == 1">
          <template v-if="scope.row.secondServerId">
            <!-- <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
              v-if="$authorities.OrderSetPayee"
            >设置委托收款方</el-button>-->
          </template>
          <template v-else>
            <!-- <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 13, ['ORDER_STATUS_CHANGE','ORDER_PAYMENT_PROCESS'])"
              v-if="$authorities.OrderSetPayee"
            >设置委托收款方</el-button>-->
            <!-- <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 10, ['CAN_RETURN_ORDER'])"
              v-if="$authorities.OrderApplyReturn"
            >申请退货</el-button> -->
            <el-button
              type="text"
              size="small"
              @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
              v-if="$authorities.OrderAddMemo"
            >添加备注</el-button>
          </template>
        </div>
        <div slot-scope="scope" v-else>
          <!-- <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 10, ['CAN_RETURN_ORDER'])"
            v-if="$authorities.OrderApplyReturn"
          >申请退货</el-button> -->
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 4, ['ORDER_STATUS_CHANGE'])"
            v-if="$authorities.OrderAddMemo"
          >添加备注</el-button>
        </div>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        fixed="right"
        v-else-if="tabType == 4"
        key="opa5"
      >
        <span>--</span>
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

    <takingOrder ref="takingOrder" @callback="dialogCallback"></takingOrder>
    <takingOrderBatch ref="takingOrderBatch" @callback="dialogCallback"></takingOrderBatch>
    <takingAcceptBatch ref="takingAcceptBatch" @callback="dialogCallback"></takingAcceptBatch>
    <assignOrder ref="assignOrder" @callback="dialogCallback"></assignOrder>
    <assignOrderBack ref="assignOrderBack" @callback="dialogCallback"></assignOrderBack>
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
    <modifyStaff  ref="modifyStaff" @callback="dialogCallback"></modifyStaff>
    <setPayee ref="setPayee" @callback="dialogCallback"></setPayee>
    <creatInvoiceBatch ref="creatInvoiceBatch" @callback="dialogCallback"></creatInvoiceBatch>
    <returnOrderApply ref="returnOrderApply"></returnOrderApply>
  </div>
</template>
<script>
import {
  getStatusCount,
  getDataList,
  checkOrderOpa,
  checkCancelOrderOpa,
  checkbatchCreatInvoice,
  allocationOrder,
  exportOrderStatus,
  putOrderCloseDelivery
} from "@/api/order/orderManage";
import { provinces_based_id, subs } from "@/api/basicSupplier";
import { getCancelCheck } from "@/api/ordernodraft.js";
import qs from 'qs';
import {
  nameList,
  souName,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";
import { customerName, listdept } from "@/api/customerManage";
import { customerUserNameList, customerUserGroupList } from "@/api/order/saleDown";
import { returnFloat } from "@/utils/index";
import assignOrder from "../child/assign_order";
import assignOrderBack from "../child/assign_order_back";
import assignOrderBatch from "../child/assign_order_batch";
import assignOrderHead from "../child/assign_order_head";
import takingOrder from "../child/taking_order";
import takingOrderBatch from "../child/taking_order_batch";
import takingAcceptBatch from "../child/taking_accept_batch";
import cancelOrder from "../child/cancel_order";
import refusalOrder from "../child/refusal_order";
import showOrderInfo from "../child/show_order_info";
import addRemarks from "../child/add_remarks";
import deliverGoods from "../child/deliver_goods";
import postDeliver from "../child/post_deliver";
import modifyFee from "../child/modify_fee";
import modifyStaff from "../child/modify_staff";
import setPayee from "../child/set_payee";
import showWmsInfo from "../child/show_wms_info";
import creatInvoiceBatch from "../child/creat_invoice_batch";
import returnOrderApply from "../child/return_order_apply";
export default {
  inject: ["reload", "isFilterShow"],
  name: "OrderManage",
  data() {
    return {
      statusCount: null,
      tabType: 0, //当前tab
      identiType: 0, //当前身份0乙方1服务方2第二服务方
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
      remoteCustomerUserGroupList: null,
      multipleSelection: [],
      provinces: [],
      city: [],
      county: [],
      clickRowIndex: null,
      query: {
        assignUserId: "",
        customerGroupUserDataAuthorityId: "",
        customerId: "",
        customerOrderNo: "",
        oldErpOrderId: "",
        customerUserDataAuthorityId: "",
        customerUserId: "",
        customerUserPhone: "",
        customerUserGroupId:"",
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
    assignOrderBack,
    assignOrderBatch,
    assignOrderHead,
    takingOrder,
    takingOrderBatch,
    takingAcceptBatch,
    cancelOrder,
    refusalOrder,
    showOrderInfo,
    showWmsInfo,
    deliverGoods,
    postDeliver,
    modifyFee,
    modifyStaff,
    setPayee,
    returnOrderApply,
    creatInvoiceBatch,
    addRemarks
  },
  mounted() {
    //获取表格数据
    this.getTableData(true);
    this.getProvinces();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getTableData();
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
    async getTableData(isInit) {
      await getStatusCount().then(res => {
        this.$set(this, "statusCount", res.data);
      });
      //是否需要初始化身份
      if (isInit) {
        this.setIdentiType();
      }
      this.getDataList();
    },
    getDataList() {
      getDataList(this.tabType, this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
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
    switchStatus(val) {
      if (val == this.tabType) return false;
      this.tabType = val;
      this.query.pageNum = 1;
      this.clickRowIndex = null;
      this.getTableData(true);
    },
    switchIdentity(val) {
      this.identiType = val;
      this.query.pageNum = 1;
      this.query.userOwnType = this.identiType;
      this.clickRowIndex = null;
      this.getDataList();
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
        customerUserGroupId:"",
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
      };
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
          this.changeCustomerUserGroup(query);
        } else {
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
    async checkOperate(row, type, validate) {
      //validates验证项组合
      let res = {};
      var validates = {
        orderCheckParams: validate,
        serverId: {
          0: row.partyBId,
          1: row.firstServerId,
          2: row.secondServerId
        }[this.identiType], //拒单服务方id
        status: row.status
      };
      res = await checkOrderOpa(row.id, validates);

      if (res.data) {
        if (type == 1) {
          //派单
          this.showDialog("assignOrder", row);
        } else if (type == 2) {
          //改单
          this.oepnWin("EditOrder", { editId: row.id, type: this.identiType });
        } else if (type == 3) {
          //取消
          this.showDialog("cancelOrder", row);
        } else if (type == 4) {
          //添加备注
          this.showDialog("addRemarks", row);
        } else if (type == 5) {
          //手动发货
          this.showDialog("deliverGoods", { info: row, type: 2 });
        } else if (type == 6) {
          //手动送达
          this.showDialog("deliverGoods", { info: row, type: 3 });
        } else if (type == 7) {
          this.showDialog("modifyFee", row);
        } else if (type == 8) {
          //审核【改单申请】
          this.oepnWin("AuditeEditerOrder", {
            id: row.serverOrderEditingReviewId,
            status: row.status,
            source: "OrderManage"
          });
        } else if (type == 9) {
          //审核【取消订单申请】
          // this.oepnWin("AuditeNoManage", { id: row.serverOrderCancelReviewId });
        } else if (type == 10) {
          //申请退货
          this.showDialog("returnOrderApply", row);
        } else if (type == 11) {
          //拒单
          this.showDialog("refusalOrder", row);
        } else if (type == 12) {
          //接单
          this.showDialog("takingOrder", { row: row, type: this.identiType });
          //this.oepnWin("orderTaking", { id: row.id });
        } else if (type == 13) {
          //设置委托收款方
          this.showDialog("setPayee", row);
        } else if (type == 14) {
          //生成发货单
          this.oepnWin("CreatInvoiceForOrder", { id: row.id });
        } else if (type == 15) {
          //关闭生成发货单
          this.$confirm("请确定是否要关闭生成发货单？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            putOrderCloseDelivery(row.id).then(res => {
              this.$message({
                type: "success",
                message: "操作成功！"
              });
              this.getDataList();
            });
          });
        } else if (type == 17) {
          //手动响应
          this.showDialog("deliverGoods", { info: row, type: 1 });
        } else if (type == 18) {
          //打印订单-移到发货单列表了
        } else if (type == 19) {
          //打印自定义送货单
        } else if (type == 20) {
          //上传送货单
          this.showDialog("postDeliver", row);
        } else if (type == 21) {
          //收回重派
          this.showDialog("assignOrderBack", row);
        } else if (type == 22) {
          //修改业务员
          this.showDialog("modifyStaff", row);
        } else {
          //指定派单员
          this.showDialog("assignOrderHead", row);
        }
      } else {
        let msg = res.message || "当前订单已取消，请刷新数据";
        this.$message({
          type: "error",
          message: msg
        });
      }
    },
    async checkCancelOperate(row, validate) {
      //validates验证项组合
      let res = {};
      let validates = {
        description: "",
        orderId: row.id,
        orderStatus: row.status
      };
      res = await checkCancelOrderOpa(validates);
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
        this.$message({
          type: "error",
          message: msg || "当前订单已更新，请刷新数据。"
        });
      }
    },
    //取消订单审核验证
    checkCancelReviewOperate(row) {
      getCancelCheck(row.serverOrderCancelReviewId).then(res => {
        if (res.code == "000000") {
          this.oepnWin("AuditeNoManage", {
            id: row.serverOrderCancelReviewId,
            source: "OrderManage"
          });
        } else if (/^98/.test(res.code)) {
          this.getTableData();
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    //改单审核验证
    // checkCancelReviewOperate(row) {
    //   editerOrderCheck(row.serverOrderEditingReviewId,row.status).then(res=>{
    //        if(res.data==0){
    //           this.oepnWin("AuditeEditerOrder", {
    //             id: row.serverOrderEditingReviewId,
    //             status: row.status
    //           });
    //        }else {
    //           this.getTableData();
    //           this.$message({
    //             type: "error",
    //             message: res.message
    //           });
    //        }
    //   })
    // },
    changeCustomer(){
      this.query.customerUserGroupId = "";
      this.query.customerUserGroupName = "";
      this.remoteCustomerUserGroupList = [];

      if(this.query.customerId){
        this.remotecustomerUserGroup();
      }
      this.changeCustomerUserGroup();
    },
    changeCustomerUserGroup(query){
      this.query.customerUserId = "";
      this.query.customerUserName = "";
      this.query.remoteCustomerUserList = [];

      if(this.query.customerId || this.query.customerUserGroupId){
        customerUserNameList({
          username: query || "",
          departmentId:this.query.customerUserGroupId,
          customerId: this.query.customerId
        }).then(res => {
          this.remoteCustomerUserList = res.data;
        });
      }
    },
    remotecustomerUserGroup(query){
      let data=qs.stringify({departmentName:query});
      if(this.query.customerId){
        customerUserGroupList(this.query.customerId,data).then(res=>{
          this.remoteCustomerUserGroupList=res.data
        })
      }else{
        this.$message({
            message:'请选择一个客户',
            type: 'warning', 
          })
      }
    },
    filterCell(cell) {
      if (cell.columnIndex == 7 && cell.row.urgent == 1) {
        return "setred";
      }
    },
    filterRow({ row, rowIndex }) {
      row.index = rowIndex;
      if (
        (this.tabType == 0 && row.serverRejectStatus == "是") ||
        (this.tabType == 2 &&
          ((row.serverChangedOrder == "是" && row.partyBReviewStatus != 1) ||
            (row.serverCancelOrder == "是" && row.partyBCancelReviewStatus != 1)))
      ) {
        return "warning-row";
      }
      return "";
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
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    batchAssign() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择要批量派单的订单"
        });
        return false;
      }
      let assignNum = 0,
        ids = [];
      this.multipleSelection.forEach(item => {
        if (!item.assignUserId) {
          assignNum++;
        }
        ids.push(item.id);
      });
      // if (assignNum > 0) {
      //   this.$message({
      //     type: "error",
      //     message: `有${assignNum}笔订单还没有指定派单员，不能批量派单`
      //   });
      //   return false;
      // }
      this.showDialog("assignOrderBatch", ids);
    },
    batchTaking() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择要接单的订单"
        });
        return false;
      }
      let assignNum = 0,
        ids = [];
      this.multipleSelection.forEach(item => {
        ids.push({ orderIds: item.id, version: item.version });
        // if (item.partyBId == item.firstServerId && item.partyBId == this.$auth.user.userPosts[0].organizationId) {
        //   ids.push({orderIds:item.id, version:item.version});
        // } else {
        //   assignNum++;
        // }
      });
      // if (assignNum > 0) {
      //   this.$message({
      //     type: "error",
      //     message: `有${assignNum}笔订单不符合批量接单要求，不能批量接单`
      //   });
      //   return false;
      // }
      this.showDialog("takingOrderBatch", ids);
    },
    batchTakingAccept(){
      //$authorities.OrderTakingBetchForAccept
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择要接单的订单"
        });
        return false;
      }
      let obj = {firstServerId:"", ids:[]};
      this.multipleSelection.forEach((item,index) => {
        if(index == 0){
          obj.firstServerId = item.firstServerId;
        }
        obj.ids.push({ orderId: item.id, no: item.no, oldStaffId: item.staffId, version: item.version });
      });
      this.showDialog("takingAcceptBatch", obj);
    },
    async batchCreatInvoice() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择要生成发货单的订单"
        });
        return false;
      }
      let assignNum = 0,
        ids = [];
      this.multipleSelection.forEach(item => {
        ids.push(item.id);
        // if (item.deliveryType == 0) {
        //   ids.push(item.id);
        // } else {
        //   assignNum++;
        // }
      });
      // if (assignNum > 0) {
      //   this.$message({
      //     type: "error",
      //     message: `有${assignNum}笔订单不符合要求，不能批量生成发货单`
      //   });
      //   return false;
      // }

      let res = {};
      res = await checkbatchCreatInvoice({ orderIds: ids });
      if (res.data || res.data == 0) {
        this.showDialog("creatInvoiceBatch", ids);
      } else {
        this.$alert(res.message, "提示", {
          callback: action => {}
        });
      }
    },
    showWms(row) {
      this.showDialog("showWmsInfo", row);
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(type) {
      this.getTableData();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getDataList();
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
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
      exportOrderStatus(this.query).then(res => {
        if (!res) {
          this.$message({
            message: "导出失败",
            type: "warning"
          });
        } else {
          this.download(res);
        }
      });
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
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0 0;
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
      margin: 10px 5px 0;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
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
  .el-dialog__header {
    background-color: #f2f2f2;
  }
  .el-table {
    /deep/.warning-row {
      background: #ffc1c1;
    }
    /deep/.click-row {
      background: #f0f9eb;
    }
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