<template>
  <div class="demandDetail">
    <div class="topDetail">
      <div class="top">
        <div class="topLeft">
          <i class="iconfont iconsousuo"></i>
          <span>基本信息</span>
        </div>
        <div class="topRight">
          <el-button
            size="small"
            v-if="$authorities.PurchaseDemandExport"
            @click="purchaseDetailExport()"
          >
            <i class="iconfont icondaochu"></i>
            <span>导出</span>
          </el-button>
        </div>
      </div>
      <div class="bottom">
        <table border="1">
          <tr>
            <th>商品编号：</th>
            <td>{{this.$route.query.skuNo}}</td>
            <th>商品名称：</th>
            <td>{{this.$route.query.skuName}}</td>
          </tr>
          <tr>
            <th>需求汇总数量：</th>
            <td>{{this.$route.query.sum}}</td>
            <th>计量单位：</th>
            <td>{{this.$route.query.unit}}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="middleDetail">
      <div class="top">
        <i class="iconfont iconsousuo"></i>
        <span>明细信息</span>
      </div>
      <div class="bottom">
        <div class="orderSearch">
          <i class="iconfont iconsousuo">订单采购</i>
          <el-table
            :data="orderPurchase"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="tableStyle"
          >
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="urgentLevel" label="紧急" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.urgentLevel == 0? '不紧急': scope.row.urgentLevel == 1? '紧急': ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" v-if="orderType==1" label="采购单号" align="center">
              <template slot-scope="scope">
                <el-button
                v-if="scope.row.orderType!=1"
                @click="openWin('InvoiceDetail',{id: scope.row.orderDeliveryId})"
                type="text"
                size="small"
                >{{scope.row.orderNo}}</el-button>
                <el-button
                v-if="scope.row.orderType==1"
                @click="openWin('PurchaseCollectionOrderDetail',{id: scope.row.centralPurchaseOrderId})"
                type="text"
                size="small"
                >{{scope.row.orderNo}}</el-button>
              </template>
            </el-table-column>
             <el-table-column prop="orderNo" v-if="orderType==0" label="发货单号" align="center">
              <template slot-scope="scope">
                <el-button
                v-if="scope.row.orderType!=1"
                @click="openWin('InvoiceDetail',{id: scope.row.orderDeliveryId})"
                type="text"
                size="small"
                >{{scope.row.orderNo}}</el-button>
                <el-button
                v-if="scope.row.orderType==1"
                @click="openWin('PurchaseCollectionOrderDetail',{id: scope.row.centralPurchaseOrderId})"
                type="text"
                size="small"
                >{{scope.row.orderNo}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
            <!-- <el-table-column prop="requirementType" label="采购类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.requirementType == 0?'入仓': scope.row.requirementType == 1? '厂直': ''}}</span>
              </template>
            </el-table-column>-->
            <el-table-column prop="warehouseName" label="仓库" align="center"></el-table-column>
            <el-table-column prop="warehouseReceiptAddress" label="收货地址" align="center"></el-table-column>
            <el-table-column prop="memo" label="备注说明" align="center"></el-table-column>
            <el-table-column prop="createTime" label="需求生成时间" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="orderSearch" v-if="inStoreType!=1">
          <i class="iconfont iconsousuo">安全库存采购</i>
          <el-table
            :data="safeProcurement"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="tableStyle"
          >
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="urgentLevel" label="紧急" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.urgentLevel == 0? '不紧急': scope.row.urgentLevel == 1? '紧急': ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
            <!-- <el-table-column prop="requirementType" label="采购类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.requirementType == 0?'入仓': scope.row.requirementType == 1? '厂直': ''}}</span>
              </template>
            </el-table-column>-->
            <el-table-column prop="warehouseName" label="仓库" align="center"></el-table-column>
            <el-table-column prop="warehouseReceiptAddress" label="收货地址" align="center"></el-table-column>
            <el-table-column prop="memo" label="备注说明" align="center"></el-table-column>
            <el-table-column prop="createTime" label="需求生成时间" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="orderSearch">
          <i class="iconfont iconsousuo">自定义采购</i>
          <el-table
            :data="customPurchase"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="tableStyle"
          >
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="urgentLevel" label="紧急" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.urgentLevel == 0? '不紧急': scope.row.urgentLevel == 1? '紧急': ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
            <!-- <el-table-column prop="requirementType" label="采购类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.requirementType == 0?'入仓': scope.row.requirementType == 1? '厂直': ''}}</span>
              </template>
            </el-table-column>-->
            <el-table-column prop="warehouseName" label="仓库" align="center"></el-table-column>
            <el-table-column prop="warehouseReceiptAddress" label="收货地址" align="center"></el-table-column>
            <el-table-column prop="memo" label="备注说明" align="center"></el-table-column>
            <el-table-column prop="createTime" label="需求生成时间" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="close()">关闭</el-button>
    </div>
  </div>
</template>

<script>
import {
  getPurchaseInfo,
  purchaseDetailExport
} from "@/api/purchase/purchaseDemand";
export default {
  inject: ["close"],
  name: "PurchaseDemandDetail",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      id:null,
      inStoreType:null,
      orderType:null,
      orderPurchase: [],
      safeProcurement: [],
      customPurchase: [],
    };
  },
  created() {
    this.id = this.$route.query.skuId;
    this.inStoreType = this.$route.query.inStoreType;
    this.orderType = this.$route.query.orderType;
    this.getPurchaseInfo({inStoreType:this.inStoreType,orderType:this.orderType,skuId:this.id});
  },
  activated() {
      this.id = this.$route.query.skuId;
      this.inStoreType = this.$route.query.inStoreType;
      this.orderType = this.$route.query.orderType;
      this.getPurchaseInfo({inStoreType:this.inStoreType,orderType:this.orderType,skuId:this.id});
  },
  methods: {
    openWin(name, query) {
      console.log(name,query);
      this.$router.push({ name: name, query: query });
    },
    purchaseDetailExport() {
      purchaseDetailExport({
        num: this.$route.query.num,
        skuId: this.$route.query.skuId,
        skuName: this.$route.query.skuName,
        skuNo: this.$route.query.skuNo,
        sum: this.$route.query.sum,
        unit: this.$route.query.unit,
        inStoreType:this.$route.query.inStoreType,
        inStoreTypeName:this.$route.query.inStoreTypeName,
        orderNo:this.$route.query.orderNo,
        orderType:this.$route.query.orderType,
        orderTypeName:this.$route.query.orderTypeName,
      }).then(res => {
        console.log(res);
        this.downfile(res);
      });
    },
    downfile(data) {
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/xls" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "采购需求明细.xls");
      document.body.appendChild(link);
      link.click();
    },
    getPurchaseInfo(row) {
      getPurchaseInfo(row).then(res => {
        if (res.code === "000000") {
          console.log(res.data,'77');
          this.orderPurchase = res.data.filter((item, index) => {
            return item.requirementType == 0;
          });
          this.safeProcurement = res.data.filter((item, index) => {
            return item.requirementType == 1;
          });
          this.customPurchase = res.data.filter((item, index) => {
            return item.requirementType == 2;
          });
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.demandDetail {
  width: 100%;
  .topDetail {
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    .top {
      display: flex;
      background: #f3f3f3;
      height: 50px;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
    }
    .bottom {
      border-top: 1px solid #e4e4e4;
      table {
        width: 90%;
        margin: 20px auto;
        th,
        td {
          border: 1px solid #e4e4e4;
          height: 50px;
        }
        th {
          font-weight: 700;
          width: 20%;
          text-align: right;
          background: #f5f7fa;
        }
        td {
          width: 30%;
          padding-left: 10px;
        }
      }
    }
  }
  .middleDetail {
    border: 1px solid #e4e4e4;
    .top {
      display: flex;
      align-items: center;
      padding-left: 20px;
      height: 50px;
      background: #f3f3f3;
    }
    .bottom {
      border-top: 1px solid #e4e4e4;
      .orderSearch {
        padding: 10px;
        i {
          display: block;
          height: 50px;
          line-height: 50px;
          background-color: #f3f3f3;
          border: 1px solid #e4e4e4;
          border-bottom: none;
          padding-left: 20px;
        }
      }
    }
  }
  .btn {
    height: 80px;
    border: 1px solid #e4e4e4;
    border-top: none;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-button {
      width: 120px;
    }
  }
}
</style>
