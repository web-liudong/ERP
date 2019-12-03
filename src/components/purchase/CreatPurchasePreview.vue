<template>
  <div class="detaillBox">
    <el-form inline>
      <div class="detaillTable" v-if="tableData">
        <div class="add-head">
          <i class="iconfont iconjinridingdanshu"></i>
          <p class="add-class-text">采购信息</p>
        </div>
        <el-table :data="tableData" :show-header="false" type="expand" :row-key="getRowKeys" :expand-row-keys="expands" size="small">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="detaillTable">
                <div class="add-head">
                  <i class="iconfont iconjinridingdanshu"></i>
                  <p class="add-class-text">基本信息</p>
                </div>
                <table border="1">
                  <tr>
                    <td>紧急程度：</td>
                    <td>{{scope.row.urgentLevel > 0 ? '紧急' : '不紧急'}}</td>
                    <td>发票类型：</td>
                    <td>{{scope.row.invoiceTypeDesc}}</td>
                    <td>采购方式：</td>
                    <td>{{scope.row.payTypeDesc}}</td>
                  </tr>
                  <tr>
                    <td>采购单位：</td>
                    <td>{{scope.row.requirementOrganizationName}}</td>
                    <td>供应商名称：</td>
                    <td>{{scope.row.supplierName}}</td>
                    <td>结算单位：</td>
                    <td>{{scope.row.billOrganizationName}}</td>
                  </tr>
                  <tr>
                    <td>收货人：</td>
                    <td>{{scope.row.recipientName}}</td>
                    <td>收货人联系方式：</td>
                    <td>{{scope.row.recipientPhone}}</td>
                    <td>收货地址：</td>
                    <td>{{scope.row.recipientAddress}}</td>
                  </tr>
                  <tr>
                    <td>采购总额（元）：</td>
                    <td>{{formatPrice(scope.row.amount)}}</td>
                    <td>是否含税：</td>
                    <td>{{scope.row.includeTaxDesc}}</td>
                    <td>到货类型：</td>
                    <td>{{scope.row.deliveryTypeDesc}}</td>
                  </tr>
                  <tr v-if="scope.row.deliveryType == 0">
                    <td>库房：</td>
                    <td>{{scope.row.warehouseName}}</td>
                    <td>到货预约：</td>
                    <td>{{scope.row.appointReceiveDesc}}</td>
                    <td>质量检查：</td>
                    <td>{{scope.row.qualityTestingDesc}}</td>
                  </tr>
                  <tr v-if="scope.row.deliveryType == 0">
                    <td>最晚入库时间：</td>
                    <td>{{scope.row.latestReceiveTime}}</td>
                    <td>是否快递：</td>
                    <td>{{scope.row.expressDeliveryDesc}}</td>
                    <td>快递单号：</td>
                    <td>{{scope.row.expressDeliveryNo}}</td>
                  </tr>
                  <tr>
                    <td>采购员：</td>
                    <td>{{scope.row.purchaserName}}</td>
                    <td>采购员联系方式：</td>
                    <td>{{scope.row.purchaserPhone}}</td>
                  </tr>
                </table>
              </div>
              <div class="detaillTable">
                <div class="add-head">
                  <i class="iconfont iconjinridingdanshu"></i>
                  <p class="add-class-text">明细信息</p>
                </div>
                <el-table
                  :data="scope.row.createPurchaseOrderItemDTOList"
                  border
                  type="expand"
                  size="small"
                >
                  <el-table-column prop="no" label="序号" align="center"></el-table-column>
                  <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
                  <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
                  <el-table-column prop="unit" label="单位" align="center"></el-table-column>
                  <el-table-column prop="purchaseQty" label="采购数量" align="center"></el-table-column>
                  <el-table-column prop="purchasePrice" label="采购单价" align="center" :formatter="formatTablePriceFour"></el-table-column>
                  <el-table-column prop="buyingPrice" label="建议采购价" align="center" :formatter="formatTablePrice"></el-table-column>
                  <el-table-column prop="previousPurchasePrice" label="最新采购价" align="center" :formatter="formatTablePrice"></el-table-column>
                  <el-table-column prop="taxRate" label="税率" align="center" :formatter="formatColumn"></el-table-column>
                  <el-table-column prop="discount" label="折扣率" align="center" :formatter="formatTablePrice"></el-table-column>
                  <el-table-column prop="expectedDeliveryDate" label="期望到货日期" align="center"></el-table-column>
                  <el-table-column prop="memo" label="采购说明" align="center"></el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="no" label="采购单" align="center">
            <template slot-scope="scope">
              <i class="iconfont iconcaigoudan"></i>
              <span style="margin-left: 10px">采购单{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="urgentLevel" label="紧急程度" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">紧急程度：{{ scope.row.urgentLevel > 0 ? '紧急' : '不紧急' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplierName" label="供应商" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">供应商：{{ scope.row.supplierName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceTypeDesc" label="发票类型" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">发票类型：{{ scope.row.invoiceTypeDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payTypeDesc" label="采购方式" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">采购方式：{{ scope.row.payTypeDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryTypeDesc" label="到货类型" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">到货类型：{{ scope.row.deliveryTypeDesc }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="infoTotal">
          <el-button type="primary" @click="backEdit()">编辑单预览</el-button>
          <el-button type="primary" @click="creatPurchase()">确定</el-button>
          <el-button type="primary" @click="cancelCreat()">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  creatPurchasePreview,
  creatPurchaseSubmit,
  creatPurchaseCentralizedSubmit
} from "@/api/purchase/purchase";
import { returnFloat, returnFloatFour, Debounce } from "@/utils/index";
export default {
  inject: ["close"],
  name:'CreatPurchasePreview',
  data() {
    return {
      purchaseList: null,
      source: "",
      ids:"",
      ids1:"",
      ids2:"",
      idList: null,
      tableData: null,
      remoteLoading: false,
      tableLog: null,
      expands: [],
      curSelectSkuPos: "", //当前选中商品的索引
      curSelectSku: null, //当前选中的商品
      getRowKeys(row) {
        return row.id;
      },
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.ids != this.ids || this.$route.query.ids1 != this.ids1 || this.$route.query.ids2 != this.ids2){
      this.init();
    }
  },
  components: {
    addhead
  },
  methods: {
    init(){
      let list = this.$route.params.createPurchaseOrderItemDTOList;
      this.source = this.$route.query.source;
      this.ids = this.$route.query.ids;
      this.ids1 = this.$route.query.ids1;
      this.ids2 = this.$route.query.ids2;
      //拼装api参数数据
      this.formatIds();

      if (list) {
        this.purchaseList = list.filter(item => {
          return item.itemLevel != 1;
        });
      }else{
        //刷新的情况
        this.backEdit();
        return false;
      }
      this.creatPreview();
    },
    formatIds(){
      let idsArr = this.ids ? this.ids.split(",") : [];
      let list = idsArr.map(id => {
        return {
          id: id,
          orderType: "SALES_ORDER",
          type: 'ARRIVAL'
        }
      })
      let ids1Arr = this.ids1 ? this.ids1.split(",") : [];
      let list1 = ids1Arr.map(id => {
        return {
          id: id,
          orderType: "SALES_ORDER",
          type: 'FACTORY_STRAIGHT'
        }
      })
      let ids2Arr = this.ids2 ? this.ids2.split(",") : [];
      let list2 = ids2Arr.map(id => {
        return {
          id: id,
          orderType: "CENTRALIZED_PURCHASE_ORDER",
          type: 'FACTORY_STRAIGHT'
        }
      })
      this.idList = [...list,...list1,...list2];
    },
    creatPreview() {
      creatPurchasePreview({
        createPurchaseOrderItemDTOList: this.purchaseList
      }).then(res => {
        if (res.code == "000000") {
          res.data.forEach((item,index) => {
            item.id = ++index;
          })
          this.$set(this, "tableData", res.data);
          this.expands.push(this.tableData[0].id);
        }
      });
    },
    backEdit() {
      this.$router.push({
        name: "CreatPurchaseOrder",
        params: { unTag:true },
        query: { referer: "preview", ids:this.ids, ids1:this.ids1, ids2:this.ids2, source: this.source }
      });
    },
    formatColumn(row, col, value){
      return value + "%";
    },
    creatPurchase: Debounce(function(){
      let fn = this.source == 0 ? creatPurchaseSubmit : creatPurchaseCentralizedSubmit;

      //折扣率*100
      this.purchaseList.forEach(item => {
        if((item.discount-0)<=1){
          item.discount = returnFloat(item.discount*100)
        }
      });

      fn({
        createPurchaseOrderItemDTOList: this.purchaseList,
        idList:this.idList,
        source:this.source
      }).then(res => {
        if (res.code == "000000") {
          //let type = this.source == 0 ? "PURCHASE_CREAT_ORDER_DEMAND" : "PURCHASE_CREAT_ORDER_COLLECT";
          this.$alert("生成采购单成功！", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              let toName = this.source == 0 ? "PurchaseDemand" : "PurchaseCollectionOrder";
              this.close({name:'CreatPurchasePreview', to: {name:toName, params:{isUpdate:true}}});
            }
          });
        }
      });
    }),
    cancelCreat(){
      this.$confirm("取消后，当前操作信息将不会保存，确认取消？", "取消确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.close();
        }).catch(() => {});
    },
    formatPrice(val) {
      return returnFloat(val);
    },
    formatTablePriceFour(row, col, cellValue) {
      return returnFloatFour(cellValue);
    },
    formatTablePrice(row, col, cellValue) {
      return returnFloat(cellValue);
    },
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .add-head {
    width: 100%;
    height: 40px;
    background-color: #f3f3f3;
    padding-left: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    .myicon {
      font-size: 23px;
      margin-top: 3px;
    }
    .add-class-text {
      color: #666;
      margin-right: 30px;
    }
    .btns {
      position: absolute;
      right: 0;
      display: flex;
    }
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
    }
  }
  .button-head:hover {
    color: #339999;
    border-color: #c2e0e0;
    background-color: #ebf5f5;
  }
  .detaillTable {
    border: 1px solid #d1d1d1;
    table {
      width: 90%;
      margin: 20px auto;
      border: 1px;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 12px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
      }
      th {
        padding-right: 6px;
        color: #666;
        font-weight: 700;
        font-size: 14px;
        text-align: right;
        width: 13%;
        background-color: #f9fafc;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 20%;
        line-height: 20px;
        span {
          margin-right: 10px;
          display: inline-block;
        }
        &:nth-child(odd) {
          width: 13%;
          background-color: rgba(100, 100, 100, 0.1);
          color: #666;
        }
        &:nth-child(even) {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
      .tit {
        text-align: left;
        padding-left: 10px;
      }
    }
    dl {
      margin: 30px;
      dt {
        float: left;
        width: 100px;
      }
      dd {
        overflow: hidden;
        p {
          width: 100px;
          height: 100px;
          padding: 10px;
          margin-right: 20px;
          border: 1px solid #eee;
          float: left;
          img {
            width: 100%;
            display: block;
          }
        }
      }
    }
    .el-input,
    .el-select {
      font-size: 12px;
    }
    .el-table {
      width: 98%;
      margin: 10px auto;
    }

    .setAddr {
      margin-left: 10px;
    }
    .infoTotal {
      padding: 40px 20px 20px;
      line-height: 24px;
      text-align: center;
    }
    .button-box {
      display: flex;
      justify-content: center;
      width: 90%;
      margin: 20px auto;
      .el-button {
        margin: 0 20px;
      }
    }
  }
}
</style>