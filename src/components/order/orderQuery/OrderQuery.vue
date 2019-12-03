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
          <el-input v-model="query.no" placeholder="订单号"></el-input>
        </div>
        <div class="chunk">
          <span>外部订单号：</span>
          <el-input v-model="query.customerOrderNo" placeholder="外部订单号"></el-input>
        </div>
        <div class="chunk">
            <span>旧系统订单号：</span>
            <el-input v-model="query.oldErpOrderId" type="number" clearable placeholder="旧系统订单号"></el-input>
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
          <span>是否紧急：</span>
          <el-select v-model="query.urgent">
            <el-option label="不限" value></el-option>
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>订单状态：</span>
          <el-select v-model="query.orderStatus">
            <el-option label="不限" value></el-option>
            <el-option label="待分派" value="0"></el-option>
            <el-option label="待接受" value="1"></el-option>
            <el-option label="发货中" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
            <el-option label="已取消" value="4"></el-option>
          </el-select>
        </div>
        <!-- <div class="chunk">
          <span>配送状态：</span>
          <el-select v-model="query.deliveryStatus">
            <el-option label="不限" value></el-option>
            <el-option label="未配齐" value="0"></el-option>
            <el-option label="初始化" value="1"></el-option>
            <el-option label="已定位" value="2"></el-option>
            <el-option label="已拣货" value="3"></el-option>
            <el-option label="已复核" value="4"></el-option>
            <el-option label="已打包" value="5"></el-option>
            <el-option label="已发货" value="6"></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>售后状态：</span>
          <el-select v-model="query.returnStatus">
            <el-option label="不限" value></el-option>
            <el-option label="待部分退货" value="1"></el-option>
            <el-option label="部分退货已完成" value="2"></el-option>
            <el-option label="待全部退货" value="3"></el-option>
            <el-option label="全部退货已完成" value="4"></el-option>
          </el-select>
        </div> -->
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
            @change="(val) => { changeSelect(val, remoteProjectList, 'projectName') }"
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
            @change="(val) => { changeSelect(val, remoteCustomerList, 'customerName') }"
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
          <span>付款方式：</span>
          <el-select v-model="query.payType">
            <el-option label="不限" value></el-option>
            <el-option label="线上支付" value="1"></el-option>
            <el-option label="货到付款" value="2"></el-option>
            <el-option label="账期" value="0"></el-option>
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
            @change="(val) => { changeSelect(val, remoteCustomerUserList, 'customerUserName') }"
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
          <span>采购人联系方式：</span>
          <el-input v-model="query.customerUserPhone" placeholder="客户联系方式"></el-input>
        </div>
        <div class="chunk">
          <span>展示给客户状态：</span>
          <el-select v-model="query.orderCustomerStatus">
            <el-option label="不限" value></el-option>
            <el-option label="订单创建" value="0"></el-option>
            <el-option label="仓库响应" value="1"></el-option>
            <el-option label="仓库出库" value="2"></el-option>
            <el-option label="确认签收" value="3"></el-option>
          </el-select>
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
          <span>业务员：</span>
          <el-select
            v-model="query.staffId"
            filterable
            remote
            placeholder="业务员"
            :remote-method="(query)=>{
            querySearch(query,'manager','remoteStaffList')
          }"
            :loading="remoteLoading"
            @change="(val) => { changeSelect(val, remoteStaffList, 'staffName') }"
            clearable
          >
            <el-option
              v-for="item in remoteStaffList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>财务开票状态：</span>
          <el-select v-model="query.invoiceStatus">
            <el-option label="全部状态" value></el-option>
            <el-option label="未开票" value="0"></el-option>
            <el-option label="部分开票" value="1"></el-option>
            <el-option label="全部开票" value="2"></el-option>
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
            @change="(val) => { changeSelect(val, remoteBList, 'partyBName') }"
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
            @change="(val) => { changeSelect(val, remoteBUserList, 'customerUserDataAuthorityName') }"
            clearable
          >
            <el-option
              v-for="item in remoteBUserList"
              :key="item.id"
              :label="item.realName"
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
            @change="(val) => { changeSelect(val, remoteServerList, 'serverName') }"
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
        <!-- <div class="chunk">
          <span>服务方客户负责人：</span>
          <el-select
            v-model="query.serverUserId"
            filterable
            remote
            placeholder="服务方客户负责人"
            :remote-method="(query)=>{
            querySearch(query,'manager','remoteServerUserList')
          }"
            :loading="remoteLoading"
            @change="(val) => { changeSelect(val, remoteServerUserList, 'serverUserName') }"
            clearable
          >
            <el-option
              v-for="item in remoteServerUserList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div> -->
        <div class="chunk">
          <span>第二服务方：</span>
          <el-select
            v-model="query.secondServerId"
            filterable
            remote
            placeholder="第二服务方"
            :remote-method="(query)=>{
            querySearch(query,'organization','remoteServer2List')
          }"
            :loading="remoteLoading"
            @change="(val) => { changeSelect(val, remoteServer2List, 'secondServerName') }"
            clearable
          >
            <el-option
              v-for="item in remoteServer2List"
              :key="item.id+item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <!-- <div class="chunk">
          <span>第二服务方客户负责人：</span>
          <el-select
            v-model="query.secondServerUserId"
            filterable
            remote
            placeholder="第二服务方客户负责人"
            :remote-method="(query)=>{
            querySearch(query,'manager','remoteServer2UserList')
          }"
            :loading="remoteLoading"
            @change="(val) => { changeSelect(val, remoteServer2UserList, 'secondServerUserName') }"
            clearable
          >
            <el-option
              v-for="item in remoteServer2UserList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div> -->
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
            @change="(val) => { changeSelect(val, remoteGroupUserList, 'customerGroupUserDataAuthorityName') }"
            clearable
          >
            <el-option
              v-for="item in remoteGroupUserList"
              :key="item.id"
              :label="item.realName"
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
            @change="(val) => { changeSelect(val, remoteAssignUserList, 'assignUserName') }"
            clearable
          >
            <el-option
              v-for="item in remoteAssignUserList"
              :key="item.id"
              :label="item.realName"
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
        <div class="chunk" style="width: 50%;">
          <span>日期：</span>
          <el-select v-model="query.dateType" style="width:60%;">
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
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <span><i class="iconfont iconjinridingdanshu"></i> 数据列表</span>
        </div>
        <div class="listBoxRight">
          <!-- 自定义表头 -->
          <dynamicTable :labelArr="tableLabel" tableName='orderQuery' @tableChange="tableChange" />
          
          <div class="button-head" @click="exportData()">
            <i class="icon-feiji iconfont button-head-icon icon-plane"></i>导出订单
          </div>        
        </div>
      </div>
      <el-table :data="tableData" border size="small" ref="orderList" show-summary :summary-method="getSummaries" :max-height="dataListHeight">
        <el-table-column type="selection" fixed="left" width="60px"></el-table-column>
        <el-table-column prop="no" v-if="hideList.no" label="订单号" width="150" align="center" fixed="left">
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
        <el-table-column prop="oldErpOrderId" v-if="hideList.oldErpOrderId" label="旧系统订单号" align="center" width="100" fixed="left">
          <template slot-scope="scope">{{scope.row.oldErpOrderId || '--'}}</template>
        </el-table-column>
        <el-table-column prop="customerOrderNo" v-if="hideList.customerOrderNo" label="外部订单号" align="center">
          <template slot-scope="scope">{{scope.row.customerOrderNo || '--'}}</template>
        </el-table-column>
        <el-table-column prop="memoOrderNo" v-if="hideList.memoOrderNo" label="备注订单号" align="center">
          <template slot-scope="scope">{{scope.row.memoOrderNo || '--'}}</template>
        </el-table-column>
        <el-table-column prop="orderSourceName" v-if="hideList.orderSourceName" label="订单来源" align="center">
          <template slot-scope="scope">{{scope.row.orderSourceName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="orderTypeName" v-if="hideList.orderTypeName" label="订单类型" align="center">
          <template slot-scope="scope">{{scope.row.orderTypeName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="urgentName" v-if="hideList.urgentName" label="是否紧急" align="center">
          <template slot-scope="scope">{{scope.row.urgentName || '--'}}</template>
        </el-table-column>
        <el-table-column
          prop="projectName"
          v-if="hideList.projectName"
          label="项目"
          min-width="150"
          align="center"
          class-name="link"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'项目信息','type':'projectInfo', 'id':scope.row.projectId})"
            >{{scope.row.projectName || '--'}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          v-if="hideList.customerName"
          label="客户"
          min-width="150"
          align="center"
          class-name="link"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'客户信息','type':'customerInfo', 'id':scope.row.customerId})"
            >{{scope.row.customerName || '--'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="customerUserName" v-if="hideList.customerUserName" label="客户采购人" width="100" align="center">
          <template slot-scope="scope">{{scope.row.customerUserName || '--'}}</template>
        </el-table-column>
        <el-table-column
          prop="staffName"
          v-if="hideList.staffName"
          label="业务员"
          min-width="150"
          align="center"
          class-name="link"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'业务员','type':'userInfo', 'id':scope.row.staffId})"
            >{{scope.row.staffName || '--'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="customerUserPhone" v-if="hideList.customerUserPhone" label="采购人联系方式" width="120" align="center">
          <template slot-scope="scope">{{scope.row.customerUserPhone || '--'}}</template>
        </el-table-column>
        <el-table-column
          prop="customerAddressLine"
          v-if="hideList.customerAddressLine"
          label="客户收货地址"
          min-width="150"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.customerAddressLine || '--'}}</template>
        </el-table-column>
        <el-table-column prop="amount" v-if="hideList.amount" label="订单金额" align="center">
          <template slot-scope="scope">{{formatPrice(scope.row.amount) || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="itemCount" v-if="hideList.itemCount" label="商品种类" align="center">
          <template slot-scope="scope">{{scope.row.itemCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="skuCount" v-if="hideList.skuCount" label="商品数量" align="center">
          <template slot-scope="scope">{{scope.row.skuCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="notOutStockCount" v-if="hideList.notOutStockCount" label="未出库数量" align="center">
          <template slot-scope="scope">{{scope.row.notOutStockCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="outStockCount" v-if="hideList.outStockCount" label="实际出库数量" align="center">
          <template slot-scope="scope">{{scope.row.outStockCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="returnSkuCount" v-if="hideList.returnSkuCount" label="累计退货数量" align="center">
          <template slot-scope="scope">{{scope.row.returnSkuCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="accountReceiveable" v-if="hideList.accountReceiveable" label="应收金额" align="center" min-width="100">
          <template slot="header">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="已开票金额">
                <span slot="reference">应收金额 <i class="iconfont el-icon-question"></i></span>
              </el-popover>
          </template>
          <template slot-scope="scope">{{formatPrice(scope.row.accountReceiveable) || '--'}}</template>
        </el-table-column>
        <el-table-column prop="actualReceipts" v-if="hideList.actualReceipts" label="实收金额" align="center" min-width="100">
          <template slot="header">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="已回款金额">
                <span slot="reference">实收金额 <i class="iconfont el-icon-question"></i></span>
              </el-popover>
          </template>
          <template slot-scope="scope">{{formatPrice(scope.row.actualReceipts) || '--'}}</template>
        </el-table-column>
        <el-table-column prop="accountPayable" v-if="hideList.accountPayable" label="应付合计" align="center" min-width="100">
          <template slot="header">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="订单的应付金额">
                <span slot="reference">应付合计 <i class="iconfont el-icon-question"></i></span>
              </el-popover>
          </template>
          <template slot-scope="scope">{{formatPrice(scope.row.accountPayable) || '--'}}</template>
        </el-table-column>
        <el-table-column prop="actualPayment" v-if="hideList.actualPayment" label="实付合计" align="center" min-width="100">
          <template slot="header">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="订单的实付金额">
                <span slot="reference">实付合计 <i class="iconfont el-icon-question"></i></span>
              </el-popover>
          </template>
          <template slot-scope="scope">{{formatPrice(scope.row.actualPayment) || '--'}}</template>
        </el-table-column>
        <el-table-column prop="invoiceReceiveableTime" v-if="hideList.invoiceReceiveableTime" label="进项开票时间" align="center">
          <template slot-scope="scope">{{scope.row.invoiceReceiveableTime || '--'}}</template>
        </el-table-column>
        <el-table-column prop="invoiceRecordTime" v-if="hideList.invoiceRecordTime" label="销项开票时间" align="center">
          <template slot-scope="scope">{{scope.row.invoiceRecordTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column prop="payTypeName" v-if="hideList.payTypeName" label="付款方式" align="center">
          <template slot-scope="scope">{{scope.row.payTypeName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="createTime" v-if="hideList.createTime" label="下单时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime || '--'}}</template>
        </el-table-column>
        <el-table-column prop="expectedDeliveryDate" v-if="hideList.expectedDeliveryDate" label="期望配送日期" width="120" align="center">
          <template slot-scope="scope">{{scope.row.expectedDeliveryDate || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="deliveryTime" v-if="hideList.deliveryTime" label="实际配送日期" align="center">
          <template slot-scope="scope">{{scope.row.deliveryTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column prop="statusName" v-if="hideList.statusName" label="订单状态" align="center">
          <template slot-scope="scope">{{scope.row.statusName || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="outStockTime" v-if="hideList.outStockTime" label="出库时间" align="center">
          <template slot-scope="scope">{{scope.row.outStockTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column prop="finishTime" v-if="hideList.finishTime" label="完成时间" align="center">
          <template slot-scope="scope">{{scope.row.finishTime || '--'}}</template>
        </el-table-column>
        <el-table-column prop="deliveryTypeName" v-if="hideList.deliveryTypeName" label="订单发货类型" align="center">
          <template slot="header">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="自定义订单出库退货数据仅供参考！">
                <span slot="reference">订单发货类型 <i class="iconfont el-icon-question"></i></span>
              </el-popover>
          </template>
          <template slot-scope="scope">{{scope.row.deliveryTypeName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="deliveryStatusName" v-if="hideList.deliveryStatusName" label="配送状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.deliveryType == 1">{{scope.row.deliveryStatusName || '--'}}</p>
            <a v-if="scope.row.deliveryType > 0" class="link" @click="oepnWin('InvoiceManage', { orderNo: scope.row.no});">查看发货单</a>
          </template>
        </el-table-column>
        <el-table-column prop="customerStatusTypeName" v-if="hideList.customerStatusTypeName" label="展示给客户状态" align="center">
          <template slot-scope="scope">{{scope.row.customerStatusTypeName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="invoiceApplicationStatusName" v-if="hideList.invoiceApplicationStatusName" label="财务开票状态" align="center">
          <template slot-scope="scope">{{scope.row.invoiceApplicationStatusName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="partyBName" v-if="hideList.partyBName" label="项目乙方" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.partyBName || '--'}}</template>
        </el-table-column>
        <el-table-column
          prop="customerUserDataAuthorityName"
          v-if="hideList.customerUserDataAuthorityName"
          label="乙方客户负责人"
          width="120"
          class-name="link"
          align="center"
        >
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'乙方客户负责人','type':'authUserInfo', 'id':scope.row.customerUserDataAuthorityId})"
            >{{scope.row.customerUserDataAuthorityName || '--'}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="firstServerName"
          v-if="hideList.firstServerName"
          label="服务方"
          align="center"
          min-width="150"
          show-overflow-tooltip
        ><template slot-scope="scope">{{scope.row.firstServerName || '--'}}</template></el-table-column>
        <el-table-column
          prop="firstServerUserName"
          v-if="hideList.firstServerUserName"
          label="服务方接单人"
          width="140"
          align="center"
          class-name="link"
        >
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'服务方接单人','type':'userInfo', 'id':scope.row.firstServerUserId})"
            >{{scope.row.firstServerUserName || '--'}}</p>
          </template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="firstServerAcceptOrderTime" v-if="hideList.firstServerAcceptOrderTime" label="服务方接单时间" align="center">
          <template slot-scope="scope">{{scope.row.firstServerAcceptOrderTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column
          prop="secondServerName"
          v-if="hideList.secondServerName"
          label="第二服务方"
          align="center"
          min-width="150"
          show-overflow-tooltip
        ><template slot-scope="scope">{{scope.row.secondServerName || '--'}}</template></el-table-column>
        <el-table-column
          prop="secondServerUserName"
          v-if="hideList.secondServerUserName"
          label="第二服务方接单人"
          width="180"
          align="center"
          class-name="link"
        >
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'第二服务方接单人','type':'userInfo', 'id':scope.row.secondServerUserId})"
            >{{scope.row.secondServerUserName || '--'}}</p>
          </template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="secondServerAcceptOrderTime" v-if="hideList.secondServerAcceptOrderTime" label="第二服务方接单时间" align="center">
          <template slot-scope="scope">{{scope.row.secondServerAcceptOrderTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column
          prop="customerGroupUserDataAuthorityName"
          v-if="hideList.customerGroupUserDataAuthorityName"
          label="集团客户负责人"
          width="120"
          class-name="link"
          align="center"
        >
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'集团客户负责人','type':'authUserInfo', 'id':scope.row.customerGroupUserDataAuthorityId})"
            >{{scope.row.customerGroupUserDataAuthorityName || '--'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="assignUserName" v-if="hideList.assignUserName" label="派单员" align="center" class-name="link">
          <template slot-scope="scope">
            <p
              @click="showDialog('showOrderInfo',{'title':'派单员信息','type':'userInfo', 'id':scope.row.assignUserId})"
            >{{scope.row.assignUserName || '--'}}</p>
          </template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="assignTime" v-if="hideList.assignTime" label="派单时间" align="center">
          <template slot-scope="scope">{{scope.row.assignTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 32px;"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
    <assignOrder ref="assignOrder" @callback="dialogCallback"></assignOrder>
    <assignOrderHead ref="assignOrderHead" @callback="dialogCallback"></assignOrderHead>
    <cancelOrder ref="cancelOrder" @callback="dialogCallback"></cancelOrder>
    <refusalOrder ref="refusalOrder" @callback="dialogCallback"></refusalOrder>
    <showOrderInfo ref="showOrderInfo"></showOrderInfo>
    <addRemarks ref="addRemarks"></addRemarks>
    <deliverGoods ref="deliverGoods"></deliverGoods>
    <modifyFee ref="modifyFee"></modifyFee>
    <returnOrderApply ref="returnOrderApply"></returnOrderApply>
  </div>
</template>
<script>
import { getAllDataList, exportAllDataList, getOrderQueryTotal } from "@/api/order/orderManage";
import { provinces_based_id, subs } from "@/api/basicSupplier";
import {
  nameList,
  souName,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";
import { customerName } from "@/api/customerManage";
import { customerUserNameList } from "@/api/order/saleDown";
import { returnFloat, parseTime } from "@/utils/index";
import assignOrder from "../child/assign_order";
import assignOrderHead from "../child/assign_order_head";
import cancelOrder from "../child/cancel_order";
import refusalOrder from "../child/refusal_order";
import showOrderInfo from "../child/show_order_info";
import addRemarks from "../child/add_remarks";
import deliverGoods from "../child/deliver_goods";
import modifyFee from "../child/modify_fee";
import returnOrderApply from "../child/return_order_apply";
import  dynamicTable  from "@/components/common/dynamicTable/index.vue";
export default {
  inject: ["reload","isFilterShow"],
  name:'OrderQuery',
  data() {
    return {
      hideList:{},
      tableLabel:[
        {
          label: "订单号",
          value:"no"
        },
        {
          label: "外部订单号",
          value:"customerOrderNo"
        },
        {
          label: "旧系统订单号",
          value:"oldErpOrderId"
        },
        {
          label: "备注订单号",
          value:"memoOrderNo"
        },
        {
          label: "订单来源",
          value:"orderSourceName"
        },
        {
          label: "订单类型",
          value:"orderTypeName"
        },
        {
          label: "是否紧急",
          value:"urgentName"
        },
        {
          label: "项目",
          value:"projectName"
        },
        {
          label: "客户",
          value:"customerName"
        },
        {
          label: "客户采购人",
          value:"customerUserName"
        },
        {
          label: "业务员",
          value:"staffName"
        },
        {
          label: "采购人联系方式",
          value:"customerUserPhone"
        },
        {
          label: "客户收货地址",
          value:"customerAddressLine"
        },
        {
          label: "订单金额",
          value:"amount"
        },
        {
          label: "商品种类",
          value:"itemCount"
        },
        {
          label: "商品数量",
          value:"skuCount"
        },
        {
          label: "未出库数量",
          value:"notOutStockCount"
        },
        {
          label: "实际出库数量",
          value:"outStockCount"
        },
        {
          label: "累计退货数量",
          value:"returnSkuCount"
        },
        {
          label: "应收金额",
          value:"accountReceiveable"
        },
        {
          label: "实收金额",
          value:"actualReceipts"
        },
        {
          label: "应付合计",
          value:"accountPayable"
        },
        {
          label: "实付合计",
          value:"actualPayment"
        },
        {
          label: "进项开票时间",
          value:"invoiceReceiveableTime"
        },
        {
          label: "销项开票时间",
          value:"invoiceRecordTime"
        },
        {
          label: "付款方式",
          value:"payTypeName"
        },
        {
          label: "下单时间",
          value:"createTime"
        },
        {
          label: "期望配送日期",
          value:"expectedDeliveryDate"
        },
        {
          label: "实际配送日期",
          value:"deliveryTime"
        },
        {
          label: "订单状态",
          value:"statusName"
        },
        {
          label: "出库时间",
          value:"outStockTime"
        },
        {
          label: "完成时间",
          value:"finishTime"
        },
        {
          label: "订单发货类型",
          value:"deliveryTypeName"
        },
        {
          label: "配送状态",
          value:"deliveryStatusName"
        },
        {
          label: "展示给客户状态",
          value:"customerStatusTypeName"
        },
        {
          label: "财务是否开票",
          value:"invoiceApplicationStatusName"
        },
        {
          label: "项目乙方",
          value:"partyBName"
        },
        {
          label: "乙方客户负责人",
          value:"customerUserDataAuthorityName"
        },
        {
          label: "服务方",
          value:"firstServerName"
        },
        {
          label: "服务方接单人",
          value:"firstServerName"
        },
        {
          label: "服务方接单时间",
          value:"firstServerAcceptOrderTime"
        },
        {
          label: "第二服务方",
          value:"secondServerName"
        },
        {
          label: "第二服务方接单人",
          value:"secondServerUserName"
        },
        {
          label: "第二服务方接单时间",
          value:"secondServerAcceptOrderTime"
        },
        {
          label: "集团客户负责人",
          value:"customerGroupUserDataAuthorityName"
        },
        {
          label: "派单员",
          value:"assignUserName"
        },
        {
          label: "派单时间",
          value:"assignTime"
        },
      ],
      tabType: 5, //当前tab
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      orderStatus: 1, //选择的订单list状态
      remoteLoading: false, //筛选查询loading
      remoteCustomList: null,
      remoteProjectList: null,
      remoteCustomerList: null,
      remoteCustomerUserList: null,
      remoteStaffList:null,
      remoteBList: null,
      remoteBUserList: null,
      remoteServerList: null,
      remoteServerUserList: null,
      remoteServer2UserList: null,
      remoteGroupUserList: null,
      remoteAssignUserList: null,
      remoteServer2List: null,
      provinces: [],
      city: [],
      county: [],
      query: {
        assignUserId: "",
        customerGroupUserDataAuthorityId: "",
        customerId: "",
        customerOrderNo: "",
        oldErpOrderId: "",
        customerUserDataAuthorityId: "",
        customerUserId: "",
        customerUserPhone: "",
        dateType: "0",
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
        secondServerId: "",
        secondServerUserId: "",
        startTime: "",
        orderStatus: "",
        urgent: "",
        userOwnType: "",
        pageNum: 1,
        pageSize: 10,
        timeRange: null,
        inclusions:[],
        firstLevelModule:'订单',
        secondLevelModule:'订单查询中心',
        thirdLevelModule:'订单查询',
      },
      dialogVisible: false,
      tableData: [],
      tableTotalData:{},
      totalPage: 0,
      filterColumn:{
        amount:2,
        skuCount:1,
        notOutStockCount:1,
        outStockCount:1,
        returnSkuCount:1,
        accountReceiveable:2,
        actualReceipts:2,
        accountPayable:2,
        actualPayment:2
      }
    };
  },
  components: {
    assignOrder,
    assignOrderHead,
    cancelOrder,
    refusalOrder,
    showOrderInfo,
    deliverGoods,
    modifyFee,
    returnOrderApply,
    addRemarks,
    dynamicTable
  },
  mounted() {
    //初始查询日期
    this.initQueryDate();
    this.tableChange(); // 自定义表头
    this.initQueryDate();
    //获取表格数据
    this.init();
    this.getProvinces();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.init();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    init(){
      this.getDataList();
      this.getTotalList();
    },
    initQueryDate(){
      this.query.endTime = parseTime(new Date(), '{y}-{m}-{d}');
      this.query.startTime = parseTime(new Date().setDate((new Date().getDate()-7)), '{y}-{m}-{d}');
      this.query.timeRange = [this.query.startTime,this.query.endTime];
    },
    tableChange(){
      this.hideList=this.$store.getters.hideList.orderQuery
      this.$forceUpdate();
    },
    initQueryDate(){
      let curDate = new Date();
      this.query.startTime = parseTime(curDate.setDate(curDate.getDate() -7), '{y}-{m}-{d}');
      this.query.endTime = parseTime(new Date(), '{y}-{m}-{d}');

      this.query.timeRange = [this.query.startTime, this.query.endTime]
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    //获取表格数据
    getDataList() {
      getAllDataList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    getTotalList(){
      getOrderQueryTotal(this.query).then(res => {
        this.tableTotalData = res.data;
      });
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          res.data.unshift( {name: "不限", id: ""} );
          this.provinces = res.data;
        }
      });
    },
    getcity(id) {
      this.city = [];
      this.county = [];
      this.query.recipientAddressCityId = "";
      this.query.recipientAddressCountyId = "";
      if(!id) return false;
      subs(id).then(res => {
        if (res.code == "000000") {
          this.city = res.data;
        }
      });
    },
    getcounty(id) {
      this.county = [];
      this.query.recipientAddressCountyId = "";
      subs(id).then(res => {
        if (res.code == "000000") {
          this.county = res.data;
        }
      });
    },
    changeSelect(val, list, name){
      list.forEach(item => {
        if(item.id == val){
          this.query[name] = item.name;
        }
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      this.init();
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
        dateType: "0",
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
        secondServerId: "",
        secondServerUserId: "",
        startTime: "",
        orderStatus: "",
        urgent: "",
        userOwnType: "",
        pageNum: 1,
        pageSize: 10,
        timeRange: null,
        inclusions:[],//需要导出的table项
        firstLevelModule:'订单',
        secondLevelModule:'订单查询中心',
        thirdLevelModule:'订单查询',
      };
      this.initQueryDate();
      this.init();
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
    selectPicker(time) {
      if (time) {
        this.query.startTime = time[0];
        this.query.endTime = time[1];
      } else {
        this.query.startTime = "";
        this.query.endTime = "";
      }
    },
    getSummaries(param){
      const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if(this.filterColumn[column.property]){
            sums[index] = this.tableTotalData[column.property+"Total"] || 0;
            if(this.filterColumn[column.property] == 2){
              sums[index] = '￥'+ returnFloat(sums[index]);
            }
          }else{
            sums[index] = '';
          }
        });
        return sums;
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data], { type: "application/xls" }));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "订单导出数据.xls");
      document.body.appendChild(link);
      link.click();
    },
    exportData() {
      this.query.inclusions = Object.keys(this.hideList).filter(x => { return this.hideList[x] });
      exportAllDataList(this.query).then(res => {
        this.$message({
          message: "导出中，请稍后去任务列表查看",
          type: "success"
        });
        // if (!res) {
        //   this.$message({
        //     message: "导出失败",
        //     type: "warning"
        //   });
        // } else {
        //   this.download(res);
        // }
      });
    },
    formatPriceOld(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    formatPrice(val) {
      return "￥" + returnFloat(val);
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
    oepnWin(name, query) {
      this.$router.push({name : name, query : query});
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
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    line-height: 50px;
    position: relative;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      height: 50px;
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
      .listBoxTop-left {
        display: flex;
        .myicon {
          margin-left: 20px;
          font-weight: bold;
          font-size: 20px;
          vertical-align: middle;
        }
        span {
          font-size: 14px;
          color: #303133;
          line-height: 50px;
          display: inline-block;
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
</style>