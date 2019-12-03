<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span>
          <i></i>基本信息
        </span>
      </div>
      <table border="1">
        <tr>
          <th>外部退货单编号：</th>
          <td>{{returnData.returnOrderNo}}</td>
          <th>客户名称：</th>
          <td>{{returnData.customerName}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>创建时间：
          </th>
          <td>{{returnData.createTime}}</td>
          <th>
            <i>*</i>退货单状态：
          </th>
          <td>{{returnData.statusText}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>关联订单号：
          </th>
          <td>{{returnData.orderId}}</td>
          <th>
            <i>*</i>服务方：
          </th>
          <td>{{returnData.organizationName}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>外部订单号：
          </th>
          <td colspan="3">{{returnData.customerReturnOrderNo}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>退货原因：
          </th>
          <td>{{returnData.returnReason}}</td>
          <th>
            <i></i>关闭原因：
          </th>
          <td>{{returnData.closeReason}}</td>
        </tr>
        <tr>
          <th>
            <i></i>退货收件人：
          </th>
          <td>{{returnData.returnContacts}}</td>
          <th>
            <i></i>退货收件电话：
          </th>
          <td>{{returnData.returnPhone}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>退货收件地址：
          </th>
          <td>{{returnData.returnAddress}}</td>
          <th>
            <i></i>备注：
          </th>
          <td>{{returnData.remark}}</td>
        </tr>
      </table>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="icon iconfont iconjinridingdanshu"></i>&nbsp;订单信息
        </span>
        <el-table :data="orderDetail" border stripe style="width: 100%" size="small">
          <el-table-column prop="no" label="订单号" width="150" align="center"></el-table-column>
          <el-table-column prop="customerOrderNo" width="150" label="外部订单号" align="center"></el-table-column>
          <el-table-column prop="orderSourceName" label="订单来源" align="center"></el-table-column>
          <el-table-column prop="urgentName" label="是否紧急" align="center"></el-table-column>
          <el-table-column width="150" prop="projectName" label="项目" align="center"></el-table-column>
          <el-table-column width="150" prop="customerName" label="客户" align="center"></el-table-column>
          <el-table-column width="150" prop="customerUserName" label="客户采购人" align="center"></el-table-column>
          <el-table-column prop="customerUserPhone" label="采购人联系方式" align="center"></el-table-column>
          <el-table-column width="150" prop="recipientAddressLine" label="客户收货地址" align="center"></el-table-column>
          <el-table-column width="150" prop="amount" label="订单金额" align="center"></el-table-column>
          <el-table-column width="150" prop="createTime" label="下单时间" align="center"></el-table-column>
          <el-table-column width="150" prop="expectedDeliveryDate" label="期望配送日期" align="center"></el-table-column>
          <el-table-column prop="statusName" label="订单状态" align="center"></el-table-column>
          <el-table-column prop="returnAmount" label="配送状态" align="center"></el-table-column>
          <el-table-column prop="returnAmount" label="售后状态" align="center"></el-table-column>
          <el-table-column prop="evaluated" label="评价状态" align="center">
            <template slot-scope="scope">{{scope.row.evaluated == 1 ? '已评价' : '待评价'}}</template>
          </el-table-column>
          <el-table-column width="150" prop="partyBName" label="项目乙方" align="center"></el-table-column>
          <el-table-column
            width="150"
            prop="customerUserDataAuthorityName"
            label="乙方客户负责人"
            align="center"
          ></el-table-column>
          <el-table-column width="150" prop="orderServer.firstServerName" label="服务方" align="center"></el-table-column>
          <el-table-column width="150" prop="orderServer.firstServerUserName" label="服务方客户负责人" align="center"></el-table-column>
          <el-table-column width="150" prop="orderServer.secondServerName" label="第二服务方" align="center"></el-table-column>
          <el-table-column width="150" prop="orderServer.secondServerUserName" label="第二服务方客户负责人" align="center"></el-table-column>
          <el-table-column width="150" prop="customerGroupUserDataAuthorityName" label="集团客户负责人" align="center"></el-table-column>
          <el-table-column prop="assignUserName" label="派单员" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="icon iconfont iconjinridingdanshu"></i>&nbsp;退货单商品信息
        </span>
        <el-table
          :data="returnData.customerReturnItemList"
          border
          stripe
          style="width: 100%"
          size="small"
        >
          <el-table-column prop="skuId" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="qty" label="退货数量" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="price" label="单价" align="center"></el-table-column>
          <el-table-column prop="discount" label="折扣（%）" align="center"></el-table-column>
          <el-table-column prop="amount" label="金额" align="center"></el-table-column>
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
        :data="returnData.customerReturnOrderOperationLogs"
        border
        stripe
        style="width: 90%"
        size="small"
      >
        <el-table-column prop="userInfo.userFullName" label="操作者"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间"></el-table-column>
        <el-table-column prop="operation" label="操作描述"></el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
    </div>
  </div>
</template>
<script>
import { getOutsideReturnOrderDetaills } from "@/api/order/returnOrder";
import { getOrderDetail } from "@/api/order/orderManage";

export default {
  inject: ["close"],
  name: "outsideReturnOrderDetaills",
  data() {
    return {
      returnData: {
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
      curOrderId:"",
      tableDataMis: {
        id: "1000001",
        name: "清华同方",
        address: "同方股份有限公司",
        brandstatus: "草稿 审核情况 "
      },
      orderDetail: null,
      tableData: []
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id && this.$route.query.id != this.curOrderId){
      this.init();
    }
  },
  methods: {
    init(){
      this.curOrderId = this.$route.query.id;
      getOutsideReturnOrderDetaills(this.curOrderId).then(res => {
        this.returnData = res.data;
        this.getOrderDetail(res.data.orderId);
      });
    },
    getOrderDetail(orderId) {
      getOrderDetail(orderId).then(res => {
        if (res.code == "000000") {
          res.data.orderServer = this.returnData.orderServerDTO;
          this.orderDetail = [res.data];
        }
      });
    }
  },
  filters: {
    //时间截取字符串
    formatDate: function(value) {
      return value.substring(0, 10);
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
