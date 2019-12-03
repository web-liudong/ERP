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
            <th>结算单名称：</th>
            <td>{{billDTO.name}}</td>
            <th>服务方：</th>
            <td>{{billDTO.partnerName}}</td>
          </tr>
          <tr>
            <th>备注：</th>
            <td>{{billDTO.memo}}</td>
          </tr> 
        </table>
      </div>
    </div>
    <div class="middleDetail">
      <div class="top">
        <i class="iconfont icon-liebiao">数据列表</i>
        <!-- <el-button size="small" @click="exportList()">
          <i class="iconfont icon-export"></i>
          <span>导出</span>
        </el-button> -->
      </div>
      <div class="bottom">
        <div class="dataList" v-for="(item,index) in orderInfoDTOList" :key="index">
          <div class="ListTop">
            <i class="iconfont icon-liebiao"></i>
            <span>数据列表</span>
            <span>采购单编号：{{item.purchaseOrderNo}}</span>
            <span>总金额：￥{{item.amount}}</span>
            <span>是否含税：{{item.includeTaxText}}</span>
            <span>配送方式：{{item.deliveryTypeText}}</span>
            <el-button v-if="item.deliveryTypeText=='厂直'&&item.cargoReceiptFileIdList!=null" size="small" @click="downloadFile(item.cargoReceiptFileIdList)">下载到货凭证</el-button>
          </div>
          <el-table
            :data="item.purchaseOrderItemDTOList"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="tableStyle"
          >
            <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
            <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center"></el-table-column>
            <el-table-column prop="currentQty" label="结算数量" align="center"></el-table-column>
            <el-table-column prop="purchasePrice" label="采购单价" align="center">
              <template slot-scope="scope">
                <span>￥</span>
                {{scope.row.purchasePrice}}
              </template>
            </el-table-column>
            <el-table-column prop="currentPrice" label="结算单价" align="center">
              <template slot-scope="scope">
                <span>￥</span>
                {{scope.row.currentPrice}}
              </template>
            </el-table-column>
            <el-table-column prop="taxText" label="税率" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.taxText}}</span>
                <!-- <span>%</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="currentTaxRateText" label="本次结算税率" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.currentTaxRateText}}</span>
                <!-- <span>%</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="taxDifferential" label="税差" align="center"></el-table-column>
            <!-- <el-table-column prop="invoiceNo" label="结算发票号码" align="center"></el-table-column> -->
            <el-table-column prop="amount" label="小计" align="center">
              <template slot-scope="scope">
                <span>￥</span>
                {{scope.row.amount}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomPay">
        <addhead headname="付款记录"></addhead>
        <el-table
          :data="centralPurchasePaymentRecordInfoDTOList"
          border
          stripe
          size="small"
          style="width: 90%"
          :header-cell-style="tableStyle"
        >
          <el-table-column prop="userFullName" label="操作者" align="center" width="300">
            <!-- <template slot-scope="scope">
              <span>{{scope.row.erpUserInfoDTO.userPosts[0].organizationName}}</span>
              <span>></span>
              <span>{{scope.row.erpUserInfoDTO.userPosts[0].departmentName}}</span>
              <span>></span>
              <span>{{scope.row.erpUserInfoDTO.realName}}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="操作时间"
            align="center"
            :formatter="filterTimePayment"
          ></el-table-column>
          <el-table-column
            prop="amount"
            label="付款金额"
            align="center"
          >
            <template slot-scope="scope">
              <span>￥</span>
              {{scope.row.amount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="付款账户名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="bankNo"
            label="付款银行账号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="memo"
            label="备注"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <div class="bottomPay">
        <addhead headname="操作日志"></addhead>
        <el-table
          :data="billOperationLogDTOList"
          border
          stripe
          size="small"
          style="width: 90%"
          :header-cell-style="tableStyle"
        >
          <el-table-column prop="userInfo" label="操作者" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.userPosts[0].organizationName}}</span>
              <span>></span>
              <span>{{scope.row.userInfo.userPosts[0].departmentName}}</span>
              <span>></span>
              <span>{{scope.row.userInfo.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operationTime" label="操作时间" :formatter="filterTime" align="center">
            <!-- <template slot-scope="scope">
              <span>{{scope.row.operationTime}}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="operationText" label="操作描述" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
    </div>
  </div>
</template>

<script>
import {
  getCollectPurchaseDetail,
  purchaseListExport
} from "@/api/payment/paymentCollectPurchase";
import addhead from "@/components/common/head/head";
import { parseTime ,downloadFile} from "@/utils/index";
export default {
  inject:['close'],
  name: "CollectPurchaseDetail",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      billDTO: {
        createTime:"",
        id:null, 
        memo: "", //备注
        name: "", //结算单名称
        partnerId:null,//伙伴id
        partnerName:'',//伙伴名称
      },
      centralPurchasePaymentRecordInfoDTOList: null, //结算单付款信息
      billOperationLogDTOList: null, //日志集合
      orderInfoDTOList: null //结算单商品信息
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getCollectPurchaseDetail(this.id);
  },
  components: {
    addhead
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
  },
  activated(){
    if (this.id !== this.$route.query.id) {
      this.getCollectPurchaseDetail(this.$route.query.id);
      this.id = this.$route.query.id;
    }
  },
  methods: {
    getCollectPurchaseDetail(id) {
      getCollectPurchaseDetail(id).then(res => {
        if (res.code == "000000") {
          console.log(res, "998");
          this.billDTO = res.data.centralPurchaseBillEditDTO;
          this.centralPurchasePaymentRecordInfoDTOList =res.data.centralPurchasePaymentRecordInfoDTOList;
            // res.data.purchaseBillDetailPaymentRecordDTOList;
          this.billOperationLogDTOList =
            res.data.centralPurchaseBillOperationLogList;
          this.orderInfoDTOList = res.data.purchaseOrderInfoDTOList;
        }
      });
    },
    exportList(){
     purchaseListExport(this.id).then(res=>{
         downloadFile(res)
     })
    },
    downloadFile(row){
      row.forEach(item=>{
        let href = `/api/file-service/file/download?id=${item}&access_token=${this.$auth.token}`
         window.open(href,'blank');
      })
      
    },
    filterTime(row){
      return parseTime(row.operationTime);
    },
    filterTimePayment(row){
      return parseTime(row.createTime);
    },
    downLoad() {},
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
        .td1 {
          width: 5%;
        }
        .th1 {
          width: 7%;
        }
      }
    }
  }
  .middleDetail {
    border: 1px solid #e4e4e4;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 50px;
      background: #f3f3f3;
    }
    .bottom {
      border-top: 1px solid #e4e4e4;
      .dataList {
        padding: 10px;
        .ListTop {
          height: 50px;
          line-height: 50px;
          background-color: #f3f3f3;
          border: 1px solid #e4e4e4;
          border-bottom: none;
          padding-left: 20px;
          i {
            padding-right: 5px;
          }
          span {
            padding-left: 5px;
          }
        }
      }
    }
    .bottomDetail {
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
            width: 25%;
            text-align: right;
          }
          td {
            padding-left: 10px;
          }
        }
      }
    }
    .bottomPay {
      border: 1px solid #d1d1d1;
      margin-top: 10px;
      .el-table {
        margin: 20px auto;
      }
      .button-box {
        display: flex;
        justify-content: flex-end;
        width: 90%;
        margin: 0 auto 20px;
      }
    }
  }
  .button-box {
    display: flex;
    justify-content: flex-end;
    width: 90%;
    margin: 20px auto;
  }
}
</style>
