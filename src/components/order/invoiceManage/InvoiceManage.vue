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
      >关联订单发货单（{{statusCount["0"]}}）</el-button>
      <el-button
        size="small"
        :class="{active:tabType==1}"
        @click="switchStatus(1)"
      >未关联订单发货单（{{statusCount["1"]}}）</el-button>
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
            <span>发货单编号：</span>
            <el-input v-model="query.orderDeliveryNo" clearable></el-input>
          </div>
          <div class="chunk">
            <span>发货单来源：</span>
            <el-select v-model="query.orderDeliverySource">
              <el-option label="不限" value></el-option>
              <el-option label="订单生成" :value="0"></el-option>
              <el-option label="后台创建" :value="1"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>关联订单编号：</span>
            <el-input v-model="query.orderNo" clearable></el-input>
          </div>
          <div class="chunk">
            <span>订单状态：</span>
            <el-select v-model="query.orderStatus">
              <el-option label="不限" value></el-option>
              <el-option label="发货中" :value="2"></el-option>
              <el-option label="已完成" :value="3"></el-option>
              <el-option label="已取消" :value="4"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>订单发货类型：</span>
            <el-select v-model="query.deliveryType">
              <el-option label="不限" value></el-option>
              <el-option label="未发货" :value="0"></el-option>
              <el-option label="整单发货" :value="1"></el-option>
              <el-option label="拆单发货" :value="2"></el-option>
              <el-option label="自定义发货" :value="3"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>发货仓库：</span>
            <el-select
              v-model="query.warehouseId"
              filterable
              remote
              placeholder="仓库"
              :remote-method="(query)=>{
            querySearch(query,'warehouse','remoteWarehouseList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteWarehouseList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>是否紧急：</span>
            <el-select v-model="query.urgent">
              <el-option label="不限" value></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>收货人：</span>
            <el-input v-model="query.recipientName"></el-input>
          </div>
          <div class="chunk">
            <span>是否使用领先WMS系统：</span>
            <el-select v-model="query.useWMS">
              <el-option label="不限" value></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
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
            <span>创建人：</span>
            <el-select
              v-model="query.creatorId"
              filterable
              remote
              placeholder="创建人"
              :remote-method="(query)=>{
            querySearch(query,'manager','remoteServerUserList')
          }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteServerUserList"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>到货类型：</span>
            <el-select v-model="query.inStoreType">
              <el-option label="全部" value></el-option>
              <el-option label="厂直" :value="1"></el-option>
              <el-option label="入仓" :value="0"></el-option>
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
          <div class="chunk" style="width: 50%;">
            <span>日期：</span>
            <el-select v-model="query.dateType" style="width:50%;">
              <el-option label="创建时间" :value="2"></el-option>
              <el-option label="下单日期" :value="0"></el-option>
              <el-option label="期望配送日期" :value="1"></el-option>
              <el-option label="订单完成日期" :value="3"></el-option>
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
          <div class="chunk">
            <span>外部订单编号：</span>
            <el-input v-model="query.customerOrderNo" clearable></el-input>
          </div>
          <div class="chunk">
            <span>旧系统订单编号：</span>
            <el-input v-model="query.oldErpOrderId" clearable></el-input>
          </div>
          <div class="chunk">
            <span>业务员：</span>
            <el-select
              v-model="query.staffId"
              filterable
              remote
              placeholder="业务员"
              :remote-method="(query)=>{
              querySearch(query,'manager','remoteStaffUserList')
            }"
              :loading="remoteLoading"
              clearable
            >
              <el-option
                v-for="item in remoteStaffUserList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
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
              querySearchName(query,'name','remoteProjectList')
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
            <span>客户部门：</span>
            <el-select
              v-model="query.customerUserGroupId"
              filterable
              remote
              placeholder="客户部门"
              :remote-method="getCustomerGroup"
              @change="(val) => { changeSelect(val, remoteCustomerUserGroupList, 'customerUserGroupName') }"
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
            <span>发货单状态：</span>
            <el-select v-model="query.deliveryStatus">
              <el-option label="全部" value></el-option>
              <el-option label="未处理" :value="0"></el-option>
              <el-option label="已接受" :value="1"></el-option>
              <el-option label="分拣中" :value="2"></el-option>
              <el-option label="分拣完成" :value="3"></el-option>
              <el-option label="已复核" :value="4"></el-option>
              <el-option label="已完成" :value="5"></el-option>
              <el-option label="已签收" :value="6"></el-option>
              <el-option label="已取消" :value="7"></el-option>
            </el-select>
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
          <div class="button-head" @click="exportData()" v-if="$authorities.OrderDeliverExport">
            <i class="icondaochu iconfont button-head-icon"></i>导出发货单
          </div>
          <div
            class="button-head"
            @click="oepnWin('CreatInvoice')"
            v-if="$authorities.OrderCreatDeliverOrder"
          >
            <i class="icontianjiashangpin iconfont button-head-icon" style="font-size: 14px;"></i>创建发货单
          </div>
        </div>
      </div>
      <div class="listBoxCon">
        <template v-for="order in tableData">
          <div class="detaillTable">
            <div class="thead">
              <span v-if="tabType == 0">
                订单号：
                <el-button
                  @click="oepnWin('OrderDetail',{ id: order.orderId })"
                  type="text"
                  size="small"
                >{{order.orderNo}}</el-button>
              </span>
              <span v-else>订单号：暂未关联订单</span>
              <span>外部订单号：{{tabType == 0 ? (order.customerOrderNo  || '无数据') : '暂未关联订单'}}</span>
              <span>旧系统订单号：{{tabType == 0 ? (order.oldErpOrderId || '无数据') : '暂未关联订单'}}</span>
              <span>下单时间：{{tabType == 0 ? (order.createTime || '无数据') : '暂未关联订单'}}</span>
              <span>完成时间：{{tabType == 0 ? (order.finishTime || '无数据') : '暂未关联订单'}}</span>
              <span>订单总金额：{{tabType == 0 ? (order.amount ? '¥'+order.amount : '无数据') : '暂未关联订单'}}</span>
              <span>项目：{{order.projectName || '无数据'}}</span>
              <span>客户：{{order.customerName || '无数据'}}</span>
              <span>客户部门：{{order.customerUserGroupName || '无数据'}}</span>
              <span>客户采购人：{{order.customerUserName || '无数据'}}</span>
              <span>业务员：{{order.staffName || '无数据'}}</span>
              <span>服务方：{{order.serverName || '无数据'}}</span>
              <span>订单状态：{{tabType == 0 ? order.statusName : '暂未关联订单'}}</span>
            </div>
            <div class="tbody">
              <el-collapse v-model="order.activeNames">
                <el-collapse-item v-for="(invoice, index) in order.orderDeliveryList" :key="index">
                  <template slot="title">
                    <div @click="getGoodsList(invoice)">
                      <span>
                        发货单号：
                        <el-button
                          @click.stop="oepnWin('InvoiceDetail',{ id: invoice.id })"
                          type="text"
                          size="small"
                        >{{invoice.orderDeliveryNo}}</el-button>
                      </span>
                      <span>创建时间：{{invoice.createTime}}</span>
                      <span>期望配送日期：{{invoice.expectedDeliveryDate}}</span>
                      <span>发货仓库：{{invoice.warehouseName}}</span>
                      <span>到货类型：{{invoice.inStoreTypeName}}</span>
                      <span>状态：{{invoice.deliveryStatusName}}</span>
                      <span>金额：￥{{invoice.amount}}</span>
                    </div>
                  </template>
                  <el-table
                    :data="invoice.goodsList"
                    :show-header="false"
                    :key="invoice.id"
                    :row-class-name="(obj) => { return filterRow(obj, invoice) }"
                    :cell-class-name="filterCellNew"
                    border
                    size="small"
                    :span-method="(obj) => { return objectSpanMethod(obj,invoice.goodsList.length) }"
                  >
                    <el-table-column prop="skuNo" label="商品编号" align="center">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">商品编号：{{scope.row.skuNo}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="skuName"
                      label="商品名称"
                      align="center"
                      min-width="150"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.skuName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="itemQty" label="数量" align="center">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">数量：{{scope.row.itemQty}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="currentPrice" label="单价" align="center">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">单价：{{scope.row.currentPrice}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="小计" align="center">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">小计：{{filterMoney(scope.row.amount)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="inventory" label="可用库存" align="center">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">可用库存：{{scope.row.inventory > -1 ? scope.row.inventory : '--'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="收货地址" align="center" width="150">
                      <template slot-scope="scope">
                        <span
                          style="margin-left: 10px"
                        >收件人姓名：{{invoice.recipientName}} <br/>收件人电话：{{invoice.recipientPhone}} <br/>地址：{{invoice.customerReceiptAddress}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="inventory" label="总计" align="center" width="100">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">{{invoice.deliveryStatusName}}<br/> ￥<i>{{filterMoney(invoice.amount)}}</i></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 1, ['ORDER_DELIVERY_STATUS_CHANGE'])"
                          v-if="$authorities.OrderDeliver && (invoice.useWMS==0 || invoice.inStoreType==1) && invoice.deliveryStatus>=0 && invoice.deliveryStatus<4"
                        >发货</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 2, ['ORDER_DELIVERY_STATUS_CHANGE'])"
                          v-if="$authorities.OrderDeliverCancel && invoice.deliveryStatus<4"
                        >取消</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 3, ['ORDER_DELIVERY_STATUS_CHANGE'])"
                          v-if="$authorities.OrderDeliverThrough && (invoice.useWMS==0 || invoice.inStoreType==1) && invoice.deliveryStatus==4"
                        >确认送达</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 4, ['ORDER_DELIVERY_STATUS_CHANGE','ORDER_DELIVERY_RELEVANCE_ORDER'])"
                          v-if="$authorities.OrderDeliverRelation && !invoice.orderNo && invoice.orderDeliverySource == 1 && invoice.deliveryStatus!=7"
                        >关联订单</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 5, ['ORDER_DELIVERY_STATUS_CHANGE','ORDER_DELIVERY_RELEVANCE_RETURNORDER','ORDER_DELIVERY_CLOSE'])"
                          v-if="$authorities.OrderDeliverRelationCancel && invoice.orderNo && invoice.orderDeliverySource == 1"
                        >取消关联</el-button>
                        <el-button
                          type="text"
                          size="small"
                          v-if="$authorities.OrderApplyReturn && invoice.deliveryStatus == 6"
                          @click="checkOrderOperate(order, invoice, 1, ['CAN_RETURN_ORDER'])"
                        >退货</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 6, ['ORDER_DELIVERY_STATUS_CHANGE','ORDER_DELIVERY_PUSH_STATUS'])"
                          v-if="$authorities.OrderDeliverPush && invoice.deliveryStatus==0"
                        >推送</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 7, ['ORDER_DELIVERY_STATUS_CHANGE'])"
                          v-if="$authorities.OrderDeliverPrint && invoice.deliveryStatus < 6"
                        >按发货单打印送货单</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 8, ['ORDER_DELIVERY_STATUS_CHANGE'])"
                          v-if="$authorities.OrderPrint && invoice.deliveryStatus < 6 && invoice.orderNo"
                        >按订单打印送货单</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="checkOperate(invoice, 9, ['ORDER_DELIVERY_STATUS_CHANGE'])"
                          v-if="$authorities.OrderPrintSelfDeliver && invoice.deliveryStatus < 6 && invoice.deliveryPictureFileIds"
                        >打印自定义送货单</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </template>
        <p class="emptyData" v-if="!tableData || !tableData.length">暂无数据</p>
      </div>
    </div>
    <!-- <el-table
      :data="tableData"
      border
      :max-height="dataListHeight"
      style="width: 100%"
      size="small"
      ref="orderList"
      :cell-class-name="filterCell"
      :key="`table${tabType}`"
    >
      <el-table-column type="selection" fixed="left"></el-table-column>
      <el-table-column prop="orderDeliveryNo" label="发货单编号" width="150" align="center" fixed="left">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('InvoiceDetail',{ id: scope.row.id })"
            type="text"
            size="small"
            v-if="$authorities.OrderDeliverDetail"
          >{{scope.row.orderDeliveryNo}}</el-button>
          <span v-else>{{scope.row.orderDeliveryNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderDeliverySourceName" label="发货单来源" align="center"></el-table-column>
      <el-table-column prop="orderNo" label="关联订单编号" align="center"></el-table-column>
      <el-table-column prop="orderCreateTime" label="订单下单时间" align="center"></el-table-column>
      <el-table-column prop="orderStatusName" label="订单状态" align="center"></el-table-column>
      <el-table-column prop="deliveryTypeName" label="发货类型" align="center"></el-table-column>
      <el-table-column prop="inStoreTypeName" label="到货类型" align="center"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" width="100" align="center" :formatter="formatPrice"></el-table-column>
      <el-table-column prop="orderDeliveryAmount" label="发货单金额" width="120" align="center" :formatter="formatPrice"></el-table-column>
      <el-table-column prop="expectedDeliveryDate" label="期望配送日期" align="center"></el-table-column>
      <el-table-column prop="warehouseName" label="发货仓库" align="center"></el-table-column>
      <el-table-column prop="urgentName" label="是否紧急" width="100" align="center"></el-table-column>
      <el-table-column prop="recipientName" label="收货人" width="120" align="center"></el-table-column>
      <el-table-column
        prop="customerReceiptAddress"
        label="收货地址"
        min-width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="useWMSName" label="是否使用领先WMS系统" align="center"></el-table-column>
      <el-table-column prop="deliveryStatusName" label="配送状态" align="center"></el-table-column>
      <el-table-column prop="serverName" label="服务方" width="120" align="center"></el-table-column>
      <el-table-column prop="orderDeliveryCreateTime" label="创建时间" align="center"></el-table-column>
      <el-table-column
        prop="creatorName"
        label="创建人"
        width="140"
        align="center"
        class-name="link"
        v-if="tabType != 0"
      >
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'创建人信息','type':'userInfo', 'id':scope.row.creatorId})"
          >{{scope.row.creatorName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 1, ['ORDER_DELIVERY_STATUS_CHANGE'])"
            v-if="$authorities.OrderDeliver && (scope.row.useWMS==0 || scope.row.inStoreType==1) && scope.row.deliveryStatus>=0 && scope.row.deliveryStatus<4"
          >发货</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 2, ['ORDER_DELIVERY_STATUS_CHANGE'])"
            v-if="$authorities.OrderDeliverCancel && scope.row.deliveryStatus<4"
          >取消</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 3, ['ORDER_DELIVERY_STATUS_CHANGE'])"
            v-if="$authorities.OrderDeliverThrough && (scope.row.useWMS==0 || scope.row.inStoreType==1) && scope.row.deliveryStatus==4"
          >确认送达</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 4, ['ORDER_DELIVERY_STATUS_CHANGE','ORDER_DELIVERY_RELEVANCE_RETURNORDER'])"
            v-if="$authorities.OrderDeliverRelation && !scope.row.orderNo && scope.row.orderDeliverySource == 1 && scope.row.deliveryStatus!=7"
          >关联订单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 5, ['ORDER_DELIVERY_RELEVANCE_RETURNORDER','ORDER_DELIVERY_CLOSE'])"
            v-if="$authorities.OrderDeliverRelationCancel && scope.row.orderNo && scope.row.orderDeliverySource == 1"
          >取消关联</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 6, ['ORDER_DELIVERY_STATUS_CHANGE','ORDER_DELIVERY_PUSH_STATUS'])"
            v-if="$authorities.OrderDeliverPush && scope.row.deliveryStatus==0"
          >推送</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 7, ['ORDER_DELIVERY_STATUS_CHANGE'])"
            v-if="$authorities.OrderDeliverPrint && scope.row.deliveryStatus < 6"
          >按发货单打印送货单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 8, ['ORDER_DELIVERY_STATUS_CHANGE'])"
            v-if="$authorities.OrderPrint && scope.row.deliveryStatus < 6 && scope.row.orderNo"
          >按订单打印送货单</el-button>
          <el-button
            type="text"
            size="small"
            @click="checkOperate(scope.row, 9, ['ORDER_DELIVERY_STATUS_CHANGE'])"
            v-if="$authorities.OrderPrintSelfDeliver && scope.row.deliveryStatus < 6 && scope.row.deliveryPictureFileIds"
          >打印自定义送货单</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNum"
        :page-sizes="[10,20,30,40,50,100]"
        :page-size="query.pageSize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </div>

    <cancelDeliveryOrder ref="cancelDeliveryOrder" @callback="dialogCallback"></cancelDeliveryOrder>
    <setDeliveryTime ref="setDeliveryTime" @callback="dialogCallback"></setDeliveryTime>
    <relationOrder ref="relationOrder" @callback="dialogCallback"></relationOrder>
    <pushWms ref="pushWms" @callback="dialogCallback"></pushWms>
    <postConfirm ref="postConfirm" @callback="dialogCallback"></postConfirm>
    <showOrderInfo ref="showOrderInfo"></showOrderInfo>
    <returnOrderApply ref="returnOrderApply"></returnOrderApply>

    <iframe id="printFrame" frameborder="0" ref="printFrame" :src="pageUrl" style="display: none;"></iframe>
    <iframe
      id="printOrderFrame"
      frameborder="0"
      ref="printOrderFrame"
      :src="pageOrderUrl"
      style="display: none;"
    ></iframe>
  </div>
</template>
<script>
import {
  getStatusCount,
  getDataListNew,
  allocationOrder,
  checkOrderOpa,
  getDeliveryPictureFile,
  cancelRelevanceOrder,
  exportDelivery,
  printOrderNote,
  getWareHouseAll,
  getInvoiceOrderItem,
  getInvoiceReturnOrderInfo,
  getInvoiceReturnOrderSkuList
} from "@/api/order/invoiceOrder";
import { provinces_based_id, subs } from "@/api/basicSupplier";
import {
  nameList,
  souName,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";
import { customerName, listdept } from "@/api/customerManage";
import {
  customerUserNameList,
  customerUserGroupList
} from "@/api/order/saleDown";
import qs from 'qs';
import cancelDeliveryOrder from "../child/cancel_delivery_order";
import setDeliveryTime from "../child/set_delivery_time";
import relationOrder from "../child/relation_order";
import postConfirm from "../child/post_confirm";
import showOrderInfo from "../child/show_order_info";
import returnOrderApply from "../child/return_order_apply";
import pushWms from "../child/push_wms";
import { returnFloat, returnFloatFour, addURL } from "@/utils/index";
export default {
  inject: ["reload", "isFilterShow"],
  name: "InvoiceManage",
  data() {
    return {
      statusCount: null,
      tabType: 0, //当前tab
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      orderStatus: 1, //选择的订单list状态
      remoteLoading: false, //筛选查询loading
      remoteProjectList: null,
      remoteServerList: null,
      remoteServerUserList: null,
      remoteStaffUserList: null,
      remoteWarehouseList: null,
      remoteCustomerList: null,
      remoteCustomerUserGroupList: null,
      remoteCustomerUserList: null,
      provinces: [],
      city: [],
      county: [],
      initOrderNo: "",
      pageUrl: "/static/html/preview.html?t=" + Date.now(),
      pageOrderUrl: "/static/html/printOrder.html?t=" + Date.now(),
      query: {
        creatorId: "",
        customerId: "",
        customerName: "",
        customerOrderNo: "",
        customerUserId: "",
        customerUserName: "",
        customerUserGroupId: "",
        customerUserGroupName: "",
        dateType: 2,
        deliveryType: "",
        deliveryStatus:"",
        endTime: "",
        orderDeliveryNo: "",
        orderDeliverySource: "",
        orderNo: "",
        orderStatus: "",
        oldErpOrderId: "",
        pageNum: 1,
        pageSize: 10,
        projectId: "",
        projectName: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        recipientName: "",
        serverId: "",
        startTime: "",
        urgent: "",
        useWMS: "",
        warehouseId: "",
        timeRange: "",
        type:0,
        firstLevelModule: "订单",
        secondLevelModule: "发货单管理",
        thirdLevelModule: "发货单列表"
      },
      isHaveGoods: {},
      curOpenGoodsLen: 1,
      dialogVisible: false,
      tableData: [],
      totalPage: 0
    };
  },
  components: {
    cancelDeliveryOrder,
    pushWms,
    setDeliveryTime,
    relationOrder,
    postConfirm,
    showOrderInfo,
    returnOrderApply
  },
  mounted() {
    this.init();
    this.getProvinces();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.init();
    } else if (
      this.$route.query.orderNo &&
      this.$route.query.orderNo != this.query.orderNo
    ) {
      this.init();
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    init() {
      if (this.$route.query.orderNo) {
        this.query.orderNo = this.$route.query.orderNo;
      }
      //获取表格数据
      this.getTableData();
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    //获取表格数据
    async getTableData() {
      await getStatusCount().then(res => {
        this.$set(this, "statusCount", res.data);
      });
      this.getDataList();
    },
    getDataList() {
      getDataListNew(this.tabType, this.query).then(res => {
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
    switchStatus(val) {
      if (val == this.tabType) return false;
      this.tabType = val;
      this.query.type = val;
      this.query.pageNum = 1;
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
        creatorId: "",
        customerId: "",
        customerName: "",
        customerOrderNo: "",
        customerUserId: "",
        customerUserName: "",
        customerUserGroupId: "",
        customerUserGroupName: "",
        dateType: 2,
        deliveryType: "",
        deliveryStatus:"",
        endTime: "",
        orderDeliveryNo: "",
        orderDeliverySource: "",
        orderNo: "",
        orderStatus: "",
        oldErpOrderId: "",
        pageNum: 1,
        pageSize: 10,
        projectId: "",
        projectName: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        recipientName: "",
        serverId: "",
        startTime: "",
        urgent: "",
        useWMS: "",
        warehouseId: "",
        timeRange: "",
        type:0,
        firstLevelModule: "订单",
        secondLevelModule: "发货单管理",
        thirdLevelModule: "发货单列表"
      };
      this.getDataList();
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "warehouse") {
          getWareHouseAll({ name: query }).then(res => {
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
    querySearchName(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "name") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    changeSelect(val, list, name) {
      list.forEach(item => {
        if (item.id == val) {
          this.query[name] = item.name;
        }
      });
      //选择客户后获取客户部门
      if (name == "customerName") {
        this.query.customerUserGroupId = "";
        this.query.customerUserGroupName = "";
        this.remoteCustomerUserGroupList = [];
        this.query.customerUserId = "";
        this.query.customerUserName = "";
        this.remoteCustomerUserList = [];
        if(val){
          this.getCustomerGroup();
          this.changeCustomerUserGroup();
        }
      }else if(name == "customerUserGroupName"){
        this.query.customerUserId = "";
        this.query.customerUserName = "";
        this.remoteCustomerUserList = [];
        this.changeCustomerUserGroup();
      }
    },
    changeCustomerUserGroup(query){
      customerUserNameList({
        username: query || "",
        departmentId:this.query.customerUserGroupId,
        customerId: this.query.customerId
      }).then(res => {
        this.remoteCustomerUserList = res.data;
      });
    },
    getCustomerGroup(query) {
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
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if(!row) return false;
    //   if (columnIndex == 6 || columnIndex == 7 || columnIndex == 8) {
    //     if(rowIndex == 0){
    //       console.log(this.curOpenGoodsLen);
    //       return [this.curOpenGoodsLen, 1];
    //     }else{
    //       return [0, 1];
    //     }
    //   }
    // },
    objectSpanMethod(obj, len) {
      //{ row, column, rowIndex, columnIndex }
      if (
        obj.columnIndex == 6 ||
        obj.columnIndex == 7 ||
        obj.columnIndex == 8
      ) {
        if (obj.rowIndex == 0) {
          return [len, 1];
        } else {
          return [0, 1];
        }
      }
    },
    async checkOrderOperate(order, row, type, validate) {
      //validates验证项组合
      var validates = {
        orderCheckParams: validate,
        serverId: {
          0: row.partyBId,
          1: row.serverId,
          2: row.secondServerId
        }[1], //拒单服务方id
        status: row.status
      };
      let res = await checkOrderOpa(row.id, validates);
      if (res.data) {
        if (type == 1) {
          //申请退货
          this.showDialog("returnOrderApply", {order:order, invoice:row});
        }
      } else {
        let msg = res.message || "当前发货单已更新，请刷新数据";
        this.$message({
          type: "error",
          message: msg
        });
      }
    },
    async checkOperate(row, type, validate) {
      //validates验证项组合
      let res = { data: 1 };
      var validates = {
        orderCheckParams: validate,
        status: row.deliveryStatus
      };
      res = await checkOrderOpa(row.id, validates);

      if (res.data) {
        if (type == 1) {
          //发货
          this.showDialog("setDeliveryTime", row);
        } else if (type == 2) {
          //取消
          this.showDialog("cancelDeliveryOrder", row);
        } else if (type == 3) {
          //确认送达
          this.showDialog("postConfirm", row);
        } else if (type == 4) {
          //关联订单
          this.showDialog("relationOrder", row);
        } else if (type == 5) {
          //取消关联
          this.$confirm("确定要取消该发货单关联的订单吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            cancelRelevanceOrder(row.id, row.deliveryStatus).then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getTableData();
            });
          });
        } else if (type == 6) {
          //推送
          this.showDialog("pushWms", row);
        } else if (type == 7) {
          //打印送货单
          getDeliveryPictureFile(row.id, 0).then(res => {
            // let obj = {
            //     cmd: "getFormJson",
            //     info: res.data
            //   };
            //this.printDelivery(obj);
            window.open(addURL(res.data[0].path), "_blank");
          });
        } else if (type == 8) {
          //打印订单
          printOrderNote(row.id).then(res => {
            let obj = {
              cmd: "getFormJson",
              info: res.data
            };
            this.printOrder(obj);
          });
        } else if (type == 9) {
          //打印自定义送货单
          getDeliveryPictureFile(row.id, 1).then(res => {
            let obj = {
              cmd: "getFormJson",
              info: res.data
            };
            this.printDelivery(obj);
          });
        }
      } else {
        this.$alert(
          "当前发货单状态已发生变化，请刷新数据获取最新状态。",
          "变更提示"
        ).then(() => {});
      }
    },
    filterRow({ row, rowIndex }, invoice) {
      row.index = rowIndex;
      if (invoice.useWMS && ((row.inventory > -1 && row.inventory < row.itemQty) || (row.inventory == -1 && invoice.inStoreType == 0))) {
        return "warning-row";
      }
      return "";
    },
    getGoodsList(invoice) {
      if (invoice.openFlag === undefined) {
        invoice.openFlag = false;
      }
      invoice.openFlag = !invoice.openFlag;
      if(!invoice.openFlag){
        return false;
      }
      this.isHaveGoods[invoice.id] = 1;
      getInvoiceOrderItem(invoice.id).then(res => {
        if (res.code == "000000") {
          this.curOpenGoodsLen = res.data.length;
          this.$set(invoice, "goodsList", res.data);
        }
      });
    },
    printDelivery(msg) {
      let iframeWin = this.$refs.printFrame.contentWindow;
      iframeWin.postMessage(msg, "*");

      setTimeout(res => {
        iframeWin.print();
      }, 1000);
    },
    printOrder(msg) {
      let iframeWin = this.$refs.printOrderFrame.contentWindow;
      iframeWin.postMessage(msg, "*");
      setTimeout(res => {
        iframeWin.print();
      }, 1000);
    },
    filterCell(cell) {
      if (cell.columnIndex == 12 && cell.row.urgent == 1) {
        return "setred";
      }
    },
    filterCellNew(cell) {
      if (cell.columnIndex == 6 || cell.columnIndex == 7 || cell.columnIndex == 8) {
        return "setDefaultbg";
      }
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    filterMoney(value) {
      return returnFloat(value);
    },
    filterMoneyFour(value) {
      return returnFloatFour(value);
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
    //通过返回id调用downfile
    downfile(id) {
      let href =
        "/api/file-service/file/download?id=" +
        id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
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
      exportDelivery(this.query).then(res => {
        if (!res) {
          this.$message({
            message: "导出失败",
            type: "warning"
          });
        } else {
          //this.download(res);
          this.$confirm("导出任务创建成功", "提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "前往下载中心查看",
            cancelButtonText: "确定"
          })
            .then(() => {
              this.$router.push({
                name: "statisticsTaskTable",
                params: { isUpdate: true }
              });
            })
            .catch();
        }
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
    .listBoxCon {
      background: #fff;
      padding: 10px;
      .detaillTable {
        border: 1px solid #d1d1d1;
        border-bottom-style: none;
        .thead {
          background-color: #f5f7fa;
          line-height: 24px;
          padding: 10px;
          font-size: 13px;
          span {
            display: inline-block;
            margin-right: 20px;
          }
        }
        .tbody {
          padding: 0 20px 10px;
          span {
            display: inline-block;
            margin-right: 10px;
            white-space: nowrap;
          }
          .cell {
            span {
              white-space: normal;
              i{
                color: #f00;
              }
            }
          }
        }
        &:last-child {
          border-bottom-style: solid;
        }
      }
      .emptyData {
        line-height: 50px;
        text-align: center;
        font-size: 12px;
      }
    }
    .listBoxRight {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
      flex-wrap: wrap;
      .button-head {
        width: 100px;
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
  .el-table {
    /deep/.warning-row {
      background: #ffc1c1;
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
.brandBox >>> .setred {
  color: red;
}
.brandBox >>> .setDefaultbg {
  background-color: #fff;
}
.brandBox >>> .el-collapse-item__header {
  height: auto;
  line-height: 30px;
  display: inline-block;
  position: relative;
  width: 100%;
  min-height: 40px;
}
.brandBox >>> .el-collapse-item__arrow {
  position: absolute;
  right: 0;
  top: 7%;
  line-height: 30px;
  pointer-events: none;
}
.brandBox >>> .el-collapse {
  border-bottom: none;
}
</style>