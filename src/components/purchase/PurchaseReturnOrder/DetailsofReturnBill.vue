<template>
  <div class="wrapper">
    <div class="head">
      <div class="head-title">
        <i class="iconfont iconcaidan"></i>
        <span>基本信息：</span>
      </div>
      <ul>
        <li>
          <div class="slice-info">
            <p class="slice-info-left">供应商 :</p>
            <span class="slice-info-right">{{returnData.supplierName}}</span>
          </div>
          <div class="slice-info">
            <p class="slice-info-left">仓库 :</p>
            <span class="slice-info-right">{{returnData.warehouseName}}</span>
          </div>
          <div class="slice-info">
            <p class="slice-info-left">退货原因 :</p>
            <span class="slice-info-right">{{returnData.returnReason}}</span>
          </div>

          <div class="slice-info">
            <p class="slice-info-left">退货方式 :</p>
            <span class="slice-info-right">{{returnData.returnTypeName}}</span>
          </div>
        </li>
        <li>
          <div class="slice-info">
            <p class="slice-info-left">备注 :</p>
            <span class="slice-info-right">{{returnData.memo}}</span>
          </div>
          <div class="slice-info">
            <p class="slice-info-left">快递名称 :</p>
            <span class="slice-info-right">{{returnData.expressCompanyName}}</span>
          </div>

          <div class="slice-info">
            <p class="slice-info-left">创建时间 :</p>
            <span class="slice-info-right">{{returnData.createTime |formatDate}}</span>
          </div>
          <div class="slice-info">
            <p class="slice-info-left">快递单号 :</p>
            <span class="slice-info-right">{{returnData.expressNumber}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconcaidan"></i>
        <span>商品明细：</span>
        <span style="color: #f00">退货单总金额：￥</span>
        <span style="color: #f00">{{this.returnData.totalAmountText}}</span>
      </div>
      <el-table :data="returnData.purchaseReturnOrderItemList" border style="width: 100%">
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="inventory" label="可用库存" align="center"></el-table-column>
        <el-table-column prop="quantity" label="退货数量" align="center"></el-table-column>
        <el-table-column label="退货价格" align="center">
          <template slot-scope="scope">
            <span>￥</span>
            <span>{{scope.row.currentPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣率" align="center"></el-table-column>
        <el-table-column prop="buyingPrice" label="采购参考价" align="center">
          <template slot-scope="scope">
            <span>￥</span>
            <span>{{scope.row.buyingPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="previousPurchasePrice" label="上次采购价" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.previousPurchasePrice">￥</span>
            {{scope.row.previousPurchasePrice}}
          </template>
        </el-table-column>
        <el-table-column prop="taxRateText" label="税率" align="center">
          <!--<template slot-scope="scope">-->
          <!--<span>{{(scope.row.taxRate*100).toFixed(2)}}</span>-->
          <!--&lt;!&ndash;<span>{{scope.row.taxRate}}</span>&ndash;&gt;-->
          <!--<span v-if="scope.row.taxRate">%</span>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" align="center">
          <template slot-scope="scope">
            <span>￥</span>
            <span>{{scope.row.totalAmountText}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button
      type="primary"
      style="width: 150px;float: right;margin-top: 10px;margin-right: 50px;"
      @click="purRetun()"
    >返回</el-button>
  </div>
</template>
<script>
import {
  getDetailsOfPurchaseReturnBil,
  postFulllistOfReturnOrders
} from "@/api/purchase/purchaseReturnOrder";
export default {
  inject: ["reload", "close"],
  name: "DetailsofReturnBill",
  data() {
    return {
      totalAmount: "",
      RecordId: "",
      returnData: [
        {
          items: [
            {
              supplierName: ""
            }
          ]
        }
      ],
      msg: ""
    };
  },
  created() {
    // totalAmount = this.$route.query.totalAmount,
    this.getList();
  },
  activated() {
    if (this.RecordId != this.$route.query.id) {
      this.getList();
      console.log(this.RecordId, 1231233);
    }
  },
  methods: {
    purRetun() {
      this.close({
        name: "DetailsofReturnBill",
        to: { name: "PurchaseReturnOrder", params: { isUpdate: true } }
      });
    },
    getList() {
      this.RecordId = this.$route.query.id;
      getDetailsOfPurchaseReturnBil(this.$route.query.id)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    cellStyle() {
      return "background-color:#f5f5f5";
    }
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
.wrapper {
  width: 100%;
  padding-top: 20px;
}
.head {
  border: 1px solid #e4e4e4;
  margin-bottom: 20px;
  ul {
    li {
      display: flex;
      .slice-info {
        width: 350px;
        display: flex;
        padding: 20px 0;
      }
      .slice-info-left {
        width: 45%;
        color: #666;
        text-align: right;
      }
      .slice-info-right {
        width: 45%;
        color: #999;
        text-align: left;
      }
    }
  }
}
.body {
  border: 1px solid #e4e4e4;
}
.head-title {
  i {
    margin-left: 20px;
    font-weight: bold;
    font-size: 14px;
    line-height: 50px;
  }
  width: 100%;
  background-color: #f3f3f3;
  height: 50px;
  padding-left: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e4e4;
}
.myicon {
  font-weight: bold;
  color: #666;
  font-size: 20px;
  line-height: 50px;
}

.button-box {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
</style>
