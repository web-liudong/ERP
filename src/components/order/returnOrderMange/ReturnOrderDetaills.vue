<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span>
          <i></i>基本信息
        </span>
      </div>
      <table border="1" style="table-layout: fixed">
        <tr>
          <th>退货单编号：</th>
          <td>{{returnData.returnOrderDTO.returnOrderNo}}</td>
          <th>客户名称：</th>
          <td>{{returnData.returnOrderDTO.customerName}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>创建时间：
          </th>
          <td>{{returnData.returnOrderDTO.createTime}}</td>
          <th>
            <i>*</i>退货单状态：
          </th>
          <td>{{returnData.returnOrderDTO.statusText}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>关联订单号：
          </th>
          <td>{{returnData.returnOrderDTO.orderNo}}</td>
          <th>
            <i>*</i>服务方：
          </th>
          <td>{{returnData.returnOrderDTO.firstServerName}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>退货原因：
          </th>
          <td>{{returnData.returnOrderDTO.returnReason}}</td>
          <th>
            <i></i>关闭原因：
          </th>
          <td>{{returnData.returnOrderDTO.closeReason}}</td>
        </tr>
        <tr>
          <th>
            <i></i>寄回收件人：
          </th>
          <td>{{returnData.returnOrderDTO.receiver}}</td>
          <th>
            <i></i>寄回收件电话：
          </th>
          <td>{{returnData.returnOrderDTO.receiverPhone}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>寄回收件地址：
          </th>
          <td>{{returnData.returnOrderDTO.receiverAddress}}</td>
          <th>
            <i></i>退货方式：
          </th>
          <td>{{returnData.returnOrderDTO.returnWayText}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>退货联系人：
          </th>
          <td>{{returnData.returnOrderDTO.returnContacts}}</td>
          <th>
            <i>*</i>退货联系人电话：
          </th>
          <td>{{returnData.returnOrderDTO.returnPhone}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>退货联系地址：
          </th>
          <td>{{returnData.returnOrderDTO.returnAddress}}</td>
          <th>
            <i></i>备注：
          </th>
          <td>{{returnData.returnOrderDTO.remark}}</td>
        </tr>
      </table>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="icon iconfont iconjinridingdanshu"></i>&nbsp;订单信息
        </span>
        <el-table :data="returnDate" border stripe style="width: 100%" size="small">
          <el-table-column prop="no" label="订单号" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                @click="oepnWin('OrderDetail',{ id: scope.row.id })"
                type="text"
                size="small"
              >{{scope.row.no}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="customerOrderNo" width="150" label="外部订单号" align="center"></el-table-column>
          <el-table-column width="150" prop="orderSourceName" label="订单来源" align="center">
            <!--<template slot-scope="scope">-->
            <!--<span v-if="scope.row.orderSource==0">后台</span>-->
            <!--<span v-if="scope.row.orderSource==1">接口</span>-->
            <!--<span v-if="scope.row.orderSource==2">官网</span>-->
            <!--<span v-if="scope.row.orderSource==3">专柜</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column width="150" prop="urgent" label="是否紧急" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.urgent==0">否</span>
              <span v-if="scope.row.urgent==1">是</span>
            </template>
          </el-table-column>
          <el-table-column width="150" prop="projectName" label="项目" align="center"></el-table-column>
          <el-table-column width="150" prop="customerName" label="客户" align="center"></el-table-column>
          <el-table-column width="150" prop="customerUserName" label="客户采购人" align="center"></el-table-column>
          <el-table-column width="150" prop="customerUserPhone" label="采购人联系方式" align="center"></el-table-column>
          <el-table-column width="150" prop="customerAddressLine" label="客户收货地址" align="center"></el-table-column>
          <el-table-column width="150" prop="amount" label="订单金额" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.amount != 0">￥</span>
              {{ scope.row.amount }}
            </template>
          </el-table-column>
          <el-table-column width="150" prop="createTime" label="下单时间" align="center"></el-table-column>
          <el-table-column width="150" prop="expectedDeliveryDate" label="期望配送日期" align="center"></el-table-column>
          <el-table-column width="150" prop="statusName" label="订单状态" align="center"></el-table-column>
          <el-table-column width="150" prop="deliveryStatusName" label="配送状态" align="center"></el-table-column>
          <!--<el-table-column-->
          <!--width="150"-->
          <!--prop="returnAmount"-->
          <!--label="售后状态"-->
          <!--align="center">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--width="150"-->
          <!--prop="returnAmount"-->
          <!--label="评价状态"-->
          <!--align="center">-->
          <!--</el-table-column>-->
          <el-table-column width="150" prop="partyBName" label="项目乙方" align="center"></el-table-column>
          <el-table-column
            width="150"
            prop="customerUserDataAuthorityName"
            label="乙方客户负责人"
            align="center"
          ></el-table-column>
          <el-table-column width="150" prop="firstServerName" label="服务方" align="center"></el-table-column>
          <el-table-column width="150" prop="firstServerUserName" label="服务方客户负责人" align="center"></el-table-column>
          <el-table-column width="150" prop="secondServerName" label="第二服务方" align="center"></el-table-column>
          <el-table-column
            width="150"
            prop="secondServerUserName"
            label="第二服务方客户负责人"
            align="center"
          ></el-table-column>
          <el-table-column
            width="150"
            prop="customerGroupUserDataAuthorityName"
            label="集团客户负责人"
            align="center"
          ></el-table-column>
          <el-table-column width="150" prop="assignUserName" label="派单员" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="icon iconfont iconjinridingdanshu"></i>&nbsp;退货单商品信息
        </span>
        <!--<div class="listBoxRight">-->
        <!--<router-link :to="{name:'WarehouseAdd'}" target="_blank">-->
        <!--<el-button size="small" icon="el-icon-plus">添加</el-button>-->
        <!--</router-link>-->
        <!--</div>-->
        <el-table
          :data="returnData.returnOrderItemDetailDTOList"
          border
          stripe
          style="width: 100%"
          size="small"
        >
          <el-table-column  label="商品编号" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="goToDetail(scope.row)"
              >{{scope.row.skuNo}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="orderDeliveryNo" label="发货单编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="returnQty" label="退货数量" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column label="单价" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.currentPrice != 0">￥</span>
              {{scope.row.currentPrice}}
            </template>
          </el-table-column>
          <el-table-column prop="returnAmount" label="金额" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.returnAmount != 0">￥</span>
              {{scope.row.returnAmount}}
            </template>
          </el-table-column>
          <el-table-column prop="wareHouseName" label="仓库" align="center"></el-table-column>
          <el-table-column prop="wearHouseName" label="当前退货状态" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span>
          <i></i>退货单流程
        </span>
      </div>
      <el-table
        :data="returnData.returnOrderOperationLogDTOList"
        border
        stripe
        style="width: 90%"
        size="small"
      >
        <el-table-column label="操作者" style="width: 33%" align="center">
          <template slot-scope="scope" v-if="scope.row.userInfo.userPosts">
            {{scope.row.userInfo.userPosts[0].organizationName}}>
            {{scope.row.userInfo.userPosts[0].departmentName}}>
            {{scope.row.userInfo.userName}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" style="width: 33%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.operationTime |formatDate}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--label="操作"-->
        <!--style="width: 33%"-->
        <!--align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-if="scope.row.operation==0">添加</span>-->
        <!--<span v-if="scope.row.operation==1">修改</span>-->
        <!--<span v-if="scope.row.operation==2">删除</span>-->
        <!--<span v-if="scope.row.operation==3">提交审核</span>-->
        <!--<span v-if="scope.row.operation==4">审核通过</span>-->
        <!--<span v-if="scope.row.operation==5">已驳回</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="operationText" label="描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="close({name:'returnOrderDetaills', to: {name:'returnOrderMange', params:{isUpdate:true}}})"
      >关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
    </div>
  </div>
</template>
<script>
import {
  getReturnOrderStatusCount,
  getReturnOrderDetaills,
  putReturnOrderClose,
  putReturnOrderComplete,
  putReturnOrderConfirm,
  postReturnOrderClosedList,
  postReturnOrderCompletedList,
  postReturnOrderList,
  postReturnOrderPendingReturnedList,
  postReturnOrderPendingConfirmedList,
  postReturnOrderReturningList
} from "@/api/order/returnOrder";
import { getAllDataList } from "@/api/order/orderManage";

export default {
  name: "returnOrderDetaills",
  inject: ["reload", "close"],
  data() {
    return {
      godata: {
        no: this.$route.query.orderNo
      },
      OldId: "",
      returnData: {
        returnOrderDTO: "",
        addressLine: null,
        availableArea: null,
        cityId: null,
        countyId: null,
        grossArea: null,
        id: null,
        name: null,
        ownerId: null,
        palletArea: null,
        provinceId: null,
        shelfArea: null,
        shelvesQty: null,
        status: null,
        type: null,
        warehouseContactDTOList: null,
        warehouseOperationLogDTOList: null,
        workspace: null
      },
      msg: "",
      tableDataMis: {
        id: "1000001",
        name: "清华同方",
        address: "同方股份有限公司",
        brandstatus: "草稿 审核情况 "
      },
      tableData: [],
      returnDate: [{}],
      returnDa: []
    };
  },
  mounted() {
    //仓库详情
  },
  created() {
    this.gitList();
    this.getAllDataList();
  },
  activated() {
    if (this.OldId != this.$route.query.id) {
      this.gitList();
      this.getAllDataList();
    }
  },
  methods: {
    //关闭当前页面
    gitList() {
      this.OldId = this.$route.query.id;
      getReturnOrderDetaills(this.$route.query.id)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    goToDetail(row) {
      // console.log(id)
      if(this.$authorities.GoodsManageDetailRelevant){
        this.$router.push({name: 'GoodsDetail',query: {id:row.skuId}});
      }
      
    },
    getParams() {
      // 取到路由带过来的参数
      let routerParams = this.$route.query.id;
      // 将数据放在当前组件的数据内
      this.msg = routerParams;
      console.log(this.msg);
    },
    getAllDataList() {
      getAllDataList(this.godata)
        .then(res => {
          console.log(res);
          // this.returnDa[0] = res.data.items[0];
          this.returnDate = res.data.items;
          let hash = {};
          this.returnDate = this.returnDate.reduce((preVal, curVal) => {
            hash[curVal.no]
              ? ""
              : (hash[curVal.no] = true && preVal.push(curVal));
            return preVal;
          }, []);
          // console.log(this.returnDa,2143445)
          // console.log(this.returnDate,1234214)
        })
        .catch(err => {
          console.log(err);
        });
    },
    oepnWin(name, query) {
      // let routeData = this.$router.resolve({
      //   name: name,
      //   query: query
      // });
      // window.open(routeData.href, "_blank");
      if (this.$authorities.OrderDetails) {
        this.$router.push({
          path: "/order/orderDetail",
          name: name,
          query: query
        });
      }
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  },
  filters: {
    //时间截取字符串
    formatDate: function(val) {
      var dateee = new Date(val).toJSON();
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .detaillTable {
    border: 1px solid #d1d1d1;
    .detaillTopBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #d1d1d1;
      span {
        line-height: 50px;
        margin-left: 10px;
      }
    }
    table {
      width: 90%;
      margin: 20px auto;
      word-break: break-all;
      word-wrap: break-all;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 12px;
        height: 53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        background: #f5f7fa;
        color: #303133;
        text-align: right;
        width: 20%;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 30%;
      }
    }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 20px 0 0 0;
    line-height: 50px;
    .listBoxTop {
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .el-button {
        width: 80px;
        height: 30px;
      }
    }
    .el-table {
      margin-top: -2px;
      span {
        font-size: 12px;
      }
      .el-button {
        font-size: 12px;
      }
    }
  }
  .detaillTable2 {
    border: 1px solid #d1d1d1;
    border-top: none;
    .detaillTopBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #d1d1d1;
      span {
        line-height: 50px;
        margin-left: 10px;
      }
    }
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
    }
    .el-button {
      float: right;
      margin: 10px 20px;
    }
  }
}
</style>
