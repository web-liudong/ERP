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
          <span>商品编号：</span>
          <el-input v-model="query.skuNo" placeholder="商品编号"></el-input>
        </div>
        <div class="chunk">
          <span>商品名称：</span>
          <el-input v-model="query.skuName" placeholder="商品名称"></el-input>
        </div>
        <div class="chunk">
          <span>品牌：</span>
          <el-input v-model="query.brandName" placeholder="品牌"></el-input>
        </div>
        <div class="chunk">
          <span>型号/规格/货号：</span>
          <el-input v-model="query.skuModel" placeholder="型号/规格/货号"></el-input>
        </div>
        <div class="chunk">
          <span>一级分类：</span>
          <el-select
            v-model="query.firstCategoryId"
            filterable
            remote
            placeholder="一级分类"
            :remote-method="(query)=>{
            remoteMethodClassify(query,1,'remoteFirstCategoryList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteFirstCategoryList"
              :key="item.id+item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>二级分类：</span>
          <el-select
            v-model="query.secondCategoryId"
            filterable
            remote
            placeholder="二级分类"
            :remote-method="(query)=>{
            remoteMethodClassify(query,2,'remoteSecondCategoryList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteSecondCategoryList"
              :key="item.id+item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>三级分类：</span>
          <el-select
            v-model="query.thirdCategoryId"
            filterable
            remote
            placeholder="三级分类"
            :remote-method="(query)=>{
            remoteMethodClassify(query,3,'remoteThirdCategoryList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteThirdCategoryList"
              :key="item.id+item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="chunk">
          <span>旧系统商品ID：</span>
          <el-input v-model="query.oldErpSkuId" placeholder="旧系统商品ID"></el-input>
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
            querySearch(query,'custom','remoteCustomerList')
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
          <span>采购人联系方式：</span>
          <el-input v-model="query.customerUserPhone" placeholder="采购人联系方式"></el-input>
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
            v-model="query.firstServerId"
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
            <el-option label="后台" value="0"></el-option>
            <el-option label="接口" value="1"></el-option>
            <el-option label="官网" value="2"></el-option>
            <el-option label="专柜" value="3"></el-option>
          </el-select>
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
          <el-select v-model="query.dateType" style="width: 40%;">
            <el-option label="下单日期" value="0"></el-option>
            <el-option label="期望配送日期" value="1"></el-option>
            <el-option label="分派日期" value="2"></el-option>
            <el-option label="完成日期" value="3"></el-option>
            <el-option label="取消日期" value="4"></el-option>
            <el-option label="出库日期" value="5"></el-option>
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
          <dynamicTable :labelArr="tableLabel" tableName='goodsQuery' @tableChange="tableChange" />

          <div class="button-head" @click="exportData()">
            <i class="icon-feiji iconfont button-head-icon icon-plane"></i>导出商品
          </div>
        </div>
      </div>
      <el-table :data="tableData" border size="small" ref="orderList" show-summary :summary-method="getSummaries" :max-height="dataListHeight">
        <el-table-column type="selection" fixed="left" width="60px"></el-table-column>
        <el-table-column prop="oldErpSkuId" v-if="hideList.oldErpSkuId" label="旧系统商品ID" align="center" fixed="left"></el-table-column>
        <el-table-column prop="skuNo" v-if="hideList.skuNo" label="商品编号" width="150" align="center" fixed="left">
          <template slot-scope="scope">
            <el-button
              @click="oepnWin('GoodsDetail',{ id: scope.row.skuId })"
              type="text"
              size="small"
              v-if="$authorities.GoodsManageDetailRelevant"
            >{{scope.row.skuNo}}</el-button>
            <span v-else>{{scope.row.skuNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstCategoryName" v-if="hideList.firstCategoryName" label="一级分类" align="center">
          <template slot-scope="scope">{{scope.row.firstCategoryName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="secondCategoryName" v-if="hideList.secondCategoryName" label="二级分类" align="center">
          <template slot-scope="scope">{{scope.row.secondCategoryName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="thirdCategoryName" v-if="hideList.thirdCategoryName" label="三级分类" align="center">
          <template slot-scope="scope">{{scope.row.thirdCategoryName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="nameCN" v-if="hideList.nameCN" label="品牌" align="center">
          <template slot-scope="scope">{{scope.row.nameCN || '--'}}</template>
        </el-table-column>
        <el-table-column prop="skuName" v-if="hideList.skuName" label="商品名称" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.skuName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="skuModel" v-if="hideList.skuModel" label="型号/规格/货号" align="center">
          <template slot-scope="scope">{{scope.row.skuModel || '--'}}</template></el-table-column>
        <el-table-column prop="unit" v-if="hideList.unit" label="单位" align="center">
          <template slot-scope="scope">{{scope.row.unit || '--'}}</template>
        </el-table-column>
        <el-table-column prop="skuCount" v-if="hideList.skuCount" label="商品数量" align="center">
          <template slot-scope="scope">{{scope.row.skuCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="currentPrice" v-if="hideList.currentPrice" label="本次售价(单价)" align="center">
          <template slot-scope="scope">{{formatPrice(scope.row.currentPrice) || '--'}}</template>
        </el-table-column>
        <el-table-column prop="amount" v-if="hideList.amount" label="本次金额" align="center">
          <template slot-scope="scope">{{formatPrice(scope.row.amount) || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="notOutStockCount" v-if="hideList.notOutStockCount" label="未出库数量" align="center">
          <template slot-scope="scope">{{scope.row.notOutStockCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="outStockCount" v-if="hideList.outStockCount" label="实际出库数量" align="center">
          <template slot-scope="scope">{{scope.row.outStockCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="returnSkuCount" v-if="hideList.returnSkuCount" label="累计退货数量" align="center">
          <template slot-scope="scope">{{scope.row.returnSkuCount || '--'}}</template>
        </el-table-column>
        <el-table-column prop="accountReceiveable" v-if="hideList.accountReceiveable" label="应收金额" align="center">
          <template slot-scope="scope">{{scope.row.accountReceiveable || '--'}}</template>
        </el-table-column>
        <el-table-column prop="accountPayable" v-if="hideList.accountPayable" label="应付合计" align="center">
          <template slot-scope="scope">{{scope.row.accountPayable || '--'}}</template>
        </el-table-column>
        <el-table-column prop="taxRate" v-if="hideList.taxRate" label="商品税率" align="center">
          <template slot-scope="scope">{{scope.row.taxRate ? formatRatio(scope.row.taxRate) : '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column prop="orderSourceName" v-if="hideList.orderSourceName" label="订单来源" align="center">
          <template slot-scope="scope">{{scope.row.orderSourceName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="orderTypeName" v-if="hideList.orderTypeName" label="订单类型" align="center">
          <template slot-scope="scope">{{scope.row.orderTypeName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="createTime" v-if="hideList.createTime" label="下单时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="outStockTime" v-if="hideList.outStockTime" label="出库时间" align="center">
          <template slot-scope="scope">{{scope.row.outStockTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column prop="expectedDeliveryDate" v-if="hideList.expectedDeliveryDate" label="期望配送日期" width="120" align="center">
          <template slot-scope="scope">{{scope.row.expectedDeliveryDate || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="deliveryTime" v-if="hideList.deliveryTime" label="实际配送时间" align="center">
          <template slot-scope="scope">{{scope.row.deliveryTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
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
        <el-table-column prop="customerUserPhone" v-if="hideList.customerUserPhone" label="采购人联系方式" width="120" align="center">
          <template slot-scope="scope">{{scope.row.customerUserPhone || '--'}}</template>
        </el-table-column>
        <el-table-column prop="recipientName" v-if="hideList.recipientName" label="客户收件人" align="center">
          <template slot-scope="scope">{{scope.row.recipientName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="recipientPhone" v-if="hideList.recipientPhone" label="客户收件电话" align="center">
          <template slot-scope="scope">{{scope.row.recipientPhone || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="regionalAddress" v-if="hideList.regionalAddress" label="区域" align="center">
          <template slot-scope="scope">{{scope.row.regionalAddress || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column prop="customerAddressLine" v-if="hideList.customerAddressLine" label="客户收货地址" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.customerAddressLine || '--'}}</template>
        </el-table-column>
        <!-- new col -->
        <el-table-column prop="customerGroupUserDataAuthorityName" v-if="hideList.customerGroupUserDataAuthorityName" label="集团客户负责人" align="center">
          <template slot-scope="scope">{{scope.row.customerGroupUserDataAuthorityName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="partyBName" v-if="hideList.partyBName" label="项目乙方" align="center">
          <template slot-scope="scope">{{scope.row.partyBName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="customerUserDataAuthorityName" v-if="hideList.customerUserDataAuthorityName" label="乙方客户负责人" align="center">
          <template slot-scope="scope">{{scope.row.customerUserDataAuthorityName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="assignUserName" v-if="hideList.assignUserName" label="派单员" align="center">
          <template slot-scope="scope">{{scope.row.assignUserName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="assignTime" v-if="hideList.assignTime" label="派单时间" align="center">
          <template slot-scope="scope">{{scope.row.assignTime || '--'}}</template>
        </el-table-column>
        <el-table-column prop="firstServerName" v-if="hideList.firstServerName" label="服务方" align="center">
          <template slot-scope="scope">{{scope.row.firstServerName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="firstServerUserName" v-if="hideList.firstServerUserName" label="服务方客户接单人" align="center">
          <template slot-scope="scope">{{scope.row.firstServerUserName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="firstServerAcceptOrderTime" v-if="hideList.firstServerAcceptOrderTime" label="服务方接单时间" align="center">
          <template slot-scope="scope">{{scope.row.firstServerAcceptOrderTime || '--'}}</template>
        </el-table-column>
        <el-table-column prop="secondServerName" v-if="hideList.secondServerName" label="第二服务方" align="center">
          <template slot-scope="scope">{{scope.row.secondServerName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="secondServerUserName" v-if="hideList.secondServerUserName" label="第二服务方接单人" align="center">
          <template slot-scope="scope">{{scope.row.secondServerUserName || '--'}}</template>
        </el-table-column>
        <el-table-column prop="secondServerAcceptOrderTime" v-if="hideList.secondServerAcceptOrderTime" label="第二服务方接单时间" align="center">
          <template slot-scope="scope">{{scope.row.secondServerAcceptOrderTime || '--'}}</template>
        </el-table-column>
        <!-- end new col -->
        <el-table-column prop="no" v-if="hideList.no" label="订单号" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              @click="oepnWin('OrderDetail',{ id: scope.row.orderId })"
              type="text"
              size="small"
            >{{scope.row.no || '--'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="customerOrderNo" v-if="hideList.customerOrderNo" label="外部订单号" align="center">
          <template slot-scope="scope">{{scope.row.customerOrderNo || '--'}}</template>
        </el-table-column>
        <el-table-column prop="memoOrderNo" v-if="hideList.memoOrderNo" label="备注订单号" align="center">
          <template slot-scope="scope">{{scope.row.memoOrderNo || '--'}}</template>
        </el-table-column>
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
import { getSkuList, exportAllSkuList, getOrderGoodsQueryTotal } from "@/api/order/orderManage";
import { provinces_based_id, subs } from "@/api/basicSupplier";
import { findClassify } from "@/api/goodsManage";
import { customerName } from "@/api/customerManage";
import { customerUserNameList } from "@/api/order/saleDown";
import {
  nameList,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";
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
  name:"OrderQueryGoods",
  data() {
    return {
      hideList:{},
      tableLabel:[
        {
          label: "旧系统商品ID",
          value:"oldErpSkuId"
        },
        {
          label: "商品编号",
          value:"skuNo"
        },
        {
          label: "商品名称",
          value:"skuName"
        },
        {
          label: "一级分类",
          value:"firstCategoryName"
        },
        {
          label: "二级分类",
          value:"secondCategoryName"
        },
        {
          label: "三级分类",
          value:"thirdCategoryName"
        },
        {
          label: "品牌",
          value:"nameCN"
        },
        {
          label: "型号/规格/货号",
          value:"skuModel"
        },
        {
          label: "商品数量",
          value:"skuCount"
        },
        {
          label: "单位",
          value:"unit"
        },
        {
          label: "本次售价(单价)",
          value:"currentPrice"
        },
        {
          label: "本次金额",
          value:"amount"
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
          label: "应付合计",
          value:"accountPayable"
        },
        {
          label: "商品税率",
          value:"taxRate"
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
          label: "下单时间",
          value:"createTime"
        },
        {
          label: "出库时间",
          value:"outStockTime"
        },
        {
          label: "期望配送日期",
          value:"expectedDeliveryDate"
        },
        {
          label: "实际配送时间",
          value:"deliveryTime"
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
          label: "采购人联系方式",
          value:"customerUserPhone"
        },
        {
          label: "客户收件人",
          value:"recipientName"
        },
        {
          label: "客户收件电话",
          value:"recipientPhone"
        },
        {
          label: "区域",
          value:"regionalAddress"
        },
        {
          label: "客户收货地址",
          value:"customerAddressLine"
        },
        {
          label: "集团客户负责人",
          value:"customerGroupUserDataAuthorityName"
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
          label: "派单员",
          value:"assignUserName"
        },
        {
          label: "派单时间",
          value:"assignTime"
        },
        {
          label: "服务方",
          value:"firstServerName"
        },
        {
          label: "服务方客户接单人",
          value:"firstServerUserName"
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
          label: "订单号",
          value:"no"
        },
        {
          label: "外部订单号",
          value:"customerOrderNo"
        },
        {
          label: "备注订单号",
          value:"memoOrderNo"
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
      remoteFirstCategoryList:null,
      remoteSecondCategoryList:null,
      remoteThirdCategoryList:null,
      remoteBList: null,
      remoteBUserList: null,
      remoteServerList: null,
      remoteServer2List: null,
      remoteServerUserList: null,
      remoteAssignUserList: null,
      remoteGroupUserList:null,
      provinces: [],
      city: [],
      county: [],
      query: {
        brandName: "",
        customerId: "",
        customerOrderNo: "",
        customerUserId: "",
        customerUserPhone: "",
        partyBId:"",
        partyBName:"",
        customerUserDataAuthorityId:"",
        customerUserDataAuthorityName:"",
        firstServerId:"",
        firstServerIdName:"",
        secondServerId:"",
        secondServerName:"",
        customerGroupUserDataAuthorityId:"",
        customerGroupUserDataAuthorityName:"",
        assignUserId:"",
        assignUserName:"",
        dateType: "0",
        endTime: "",
        firstCategoryId: "",
        no: "",
        oldErpSkuId: "",
        orderSource: "",
        orderType: "",
        organizationIds: "",
        projectId: "",
        projectIds: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        secondCategoryId: "",
        skuNo: "",
        skuModel: "",
        skuName: "",
        startTime:"",
        thirdCategoryId: "",
        pageNum: 1,
        pageSize: 10,
        timeRange: null,
        inclusions:[],
        firstLevelModule:'订单',
        secondLevelModule:'订单查询中心',
        thirdLevelModule:'订单明细表查询',
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
        accountPayable:2,
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
    tableChange(){  // 自定义表头
      this.hideList=this.$store.getters.hideList.goodsQuery
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
      getSkuList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    getTotalList(){
      getOrderGoodsQueryTotal(this.query).then(res => {
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
          this.query[name] = item.name || item.realName;
        }
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      this.init();
    },
    clearForm() {
      this.query = {
        brandName: "",
        customerId: "",
        customerOrderNo: "",
        customerUserId: "",
        customerUserPhone: "",
        partyBId:"",
        partyBName:"",
        customerUserDataAuthorityId:"",
        customerUserDataAuthorityName:"",
        firstServerId:"",
        firstServerIdName:"",
        secondServerId:"",
        secondServerName:"",
        customerGroupUserDataAuthorityId:"",
        customerGroupUserDataAuthorityName:"",
        assignUserId:"",
        assignUserName:"",
        dateType: "0",
        endTime: "",
        firstCategoryId: "",
        no: "",
        oldErpSkuId: "",
        orderSource: "",
        orderType: "0",
        organizationIds: "",
        projectId: "",
        projectIds: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        secondCategoryId: "",
        skuNo: "",
        skuModel: "",
        skuName: "",
        startTime:"",
        thirdCategoryId: "",
        pageNum: 1,
        pageSize: 10,
        timeRange: null,
        inclusions:[],
        firstLevelModule:'订单',
        secondLevelModule:'订单查询中心',
        thirdLevelModule:'订单明细表查询',
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
        } else if (type == "custom") {
          customerName(query).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if(type == "customerUser"){
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
    remoteMethodClassify(query, level, list) {
      if (query !== "") {
        this.remoteLoading = true;
        let parentId = 0;
        if(level == 2){
          parentId = this.query.firstLevelCategoryId || 0;
        }else if(level == 2){
          parentId = this.query.secondLevelCategoryId || 0;
        }
        findClassify(level, parentId, query).then(res => {
          this[list] = res.data;
          this.remoteLoading = false;
        });
      } else {
        this[list] = [];
      }
    },
    async checkOperate(row, validate) {
      //validates验证项组合
      let res = {};
      var validates = {
        orderCheckParams: validate,
        status: row.status
      };
      res = await checkOrderOpa(row.id, validates);

      if (res.data) {
        //取消
        this.showDialog("cancelOrder", row);
      } else {
        this.$alert("当前订单已取消，请刷新数据。", "订单取消提示");
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
      link.setAttribute("download", "订单商品明细.xls");
      document.body.appendChild(link);
      link.click();
    },
    exportData() {
      this.query.inclusions = Object.keys(this.hideList).filter(x => { return this.hideList[x] });
      exportAllSkuList(this.query).then(res => {
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
    formatPrice(cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    formatRatio(cellValue) {
      return cellValue +"%";
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
</style>