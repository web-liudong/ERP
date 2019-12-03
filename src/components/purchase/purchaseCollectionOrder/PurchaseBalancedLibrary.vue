<template>
  <div class="demandDetail">
    <div class="topDetail">
      <div class="top">
        <div class="topLeft">
          <i class="iconfont iconsousuo"></i>
          <span>基本信息</span>
        </div>
      </div>
      <div class="bottom">
        <table>
          <tr>
            <th>紧急程度：</th>
            <td>{{detailTable.urgentLevel ==0? '不紧急':  detailTable.urgentLevel == 1? '紧急': ''}}</td>
            <th>发票类型：</th>
            <td>{{detailTable.invoiceType == 0? '专票': detailTable.invoiceType == 1? '普票': '无票'}}</td>
            <th>采购方式：</th>
            <td>{{detailTable.payType == 0 ? '签单收货' : detailTable.payType ==1 ? '现金采购': ''}}</td>
          </tr>
          <tr>
            <th>采购单位：</th>
            <td>{{detailTable.requirementOrganizationName}}</td>
            <th>供应商名称：</th>
            <td>{{detailTable.supplierName}}</td>
            <th>结算单位：</th>
            <td>{{detailTable.billOrganizationName}}</td>
          </tr>
          <tr>
            <th>收货人：</th>
            <td>{{detailTable.recipientName}}</td>
            <th>收货人联系方式：</th>
            <td>{{detailTable.recipientPhone}}</td>
            <th>收货地址：</th>
            <td>{{detailTable.recipientAddress}}</td>
          </tr>
          <tr>
            <th>采购总额（元）：</th>
            <td>{{detailTable.amount}}</td>
            <th>是否含税：</th>
            <td>{{detailTable.includeTax==0?"否": detailTable.includeTax==1?"是": ''}}</td>
            <th>到货类型：</th>
            <td>{{detailTable.deliveryType == 0?"入仓":detailTable.deliveryType == 1? "厂直": ''}}</td>
          </tr>
          <tr>
            <th>库房：</th>
            <td>{{detailTable.warehouseName}}</td>
            <th>到货预约：</th>
            <td>{{detailTable.appointReceive == 0? "否" : detailTable.appointReceive == 1? "是" : ''}}</td>
            <th>质量检查：</th>
            <td>{{detailTable.qualityTesting == 0? "否" : detailTable.qualityTesting == 1? "是" : ''}}</td>
          </tr>
          <tr>
            <th>最晚入库时间：</th>
            <td>{{detailTable.latestReceiveTime | formatDate }} </td>
            <th>是否快递：</th>
            <td>{{detailTable.expressDelivery == 0? "否" : detailTable.expressDelivery = 1? "是" : ''}}</td>
            <th>快递单号：</th>
            <td>{{detailTable.expressDeliveryNo}}</td>
          </tr>
          <tr>
            <th>采购员：</th>
            <td>{{detailTable.purchaserName}}</td>
            <th>采购员联系方式：</th>
            <td>{{detailTable.purchaserPhone}}</td>
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
        <el-table
          :data="tableData"
          height="250"
          border
          style="width: 100%"
          :header-cell-style="tableStyle"
        >
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="requirementQty" label="销售数量" align="center"></el-table-column>
          <el-table-column prop="purchaseQty" label="待采数量" align="center">
            <div slot-scope="scope">
              <el-input type="number" size="small" v-model="scope.row.purchaseQty"></el-input>
            </div>
          </el-table-column>
          <el-table-column prop="purchasePrice" label="销售单价" align="center">
            <template slot-scope="scope">
              <span>￥</span>
              <span>{{scope.row.purchasePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="taxRate" label="税率" align="center"></el-table-column>
          <el-table-column prop="expectedDeliveryDate" label="期望到货日期" align="center">
            <template slot-scope="scope">
              {{scope.row.expectedDeliveryDate | formatDate}}
            </template>
          </el-table-column>
          <el-table-column prop="itemMemo" label="采购说明" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="findPurchaseParam.pageNum"
            :page-size="findPurchaseParam.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            background
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="confime">确定</el-button>
      <el-button type="primary" @click="closed">关闭</el-button>
    </div>
  </div>
</template>

<script>
import {
  getDetail,
  getDetailList,
  updateRequirementQty,
} from "@/api/purchase/purchaseCollectionOrder";
export default {
  inject: ["close"],
  name: "PurchaseBalancedLibrary",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      detailTable: {},
      tableData: [],
      findPurchaseParam: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    
      ccc: []
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getDetail(this.id);
    this.getDetailList(this.id);
  },
  activated() {
    if (this.id !== this.$route.query.id) {
      console.log('kk');
      this.getDetail(this.$route.query.id);
      this.getDetailList(this.$route.query.id);
      this.id = this.$route.query.id;
    }
  },
  filters: {
    formatDate: function (val){
      if (val != null) {
        let data = new Date(val)
        return (data.getFullYear() + '-' + (data.getMonth()+1) + '-' + data.getDate())
      }
    }
  },
  methods: {
    getDetail(id) {
      getDetail(id).then(res => {
        this.detailTable = res.data;
        console.log(this.detailTable);
      });
    },
    getDetailList(id) {
      getDetailList({
        pageNum: this.findPurchaseParam.pageNum,
        pageSize: this.findPurchaseParam.pageSize,
        purchaseOrderId: id,
      }).then(res => {
        if (res.code == "000000") {
          console.log(res, "0000000");
          this.total = res.data.total;
          this.findPurchaseParam.pageNum = res.data.pageNum;
          this.findPurchaseParam.pageSize = res.data.pageSize;
          this.tableData = res.data.items;
        }
      });
    },
    closed() {
      this.close({name:'PurchaseBalancedLibrary',to:{name:"PurchaseCollectionOrder",params:{isUpdate:true}}});
    },
    //分页跳转
    handleCurrentChange(val) {
      this.findPurchaseParam.pageNum = val;
      this.getDetailList();
    },
    confime() {
      this.ccc = this.tableData.map(item => {
        console.log(item.skuId,'99999',item.purchaseQty,item);
        return {
          skuId: Number(item.skuId),
          purchaseQty: Number(item.purchaseQty)
        };
      });
      // this.id = Number(this.id);
      console.log(this.id, "9888", this.ccc);
      updateRequirementQty({purchaseOrderId:this.id, balancedTreasuryDetailParams:this.ccc}).then(res => {
        console.log(res, "rrrr");
        this.$router.push('/purchase/purchaseCollectionOrder')
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
      table {
        width: 95%;
        margin: 10px auto;
        th,
        td {
          height: 40px;
        }
        th {
          font-weight: 700;
          width: 12%;
          text-align: right;
        }
        td {
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
      .block {
        display: flex;
        flex-direction: row-reverse;
        height: 80px;
        align-items: center;
        padding-right: 30px;
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
