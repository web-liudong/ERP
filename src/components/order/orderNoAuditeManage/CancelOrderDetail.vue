<template>
  <div class="detaillBox" ref="detaillBox">
    <div class="detaillTable" v-if="tableData">
      <addhead headname="改单审核"></addhead>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <span>申请单号：{{tableData.changeReviewNo}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <span>申请发起方：{{tableData.originator}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <span>审核状态：{{tableData.partyBReviewStatus}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <span>申请人：{{tableData.cancelUserName}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="detaillTable" v-if="tableData">
      <addhead headname="基本信息"></addhead>
      <el-form :inline="true" :model="tableData" class="demo-form-inline">
        <el-form-item label="项目：">
          <span slot="label">
            <i style="color:red">*</i>项目：
          </span>
          <el-input v-model="tableData.projectName" disabled placeholder="项目"></el-input>
        </el-form-item>
        <el-form-item label="客户：">
          <span slot="label">
            <i style="color:red">*</i>客户：
          </span>
          <el-input v-model="tableData.customerName" disabled placeholder="客户"></el-input>
        </el-form-item>
        <el-form-item label="采购人：">
          <span slot="label">
            <i style="color:red">*</i>采购人：
          </span>
          <el-input v-model="tableData.customerUserName" disabled placeholder="采购人"></el-input>
        </el-form-item>
        <el-form-item label="采购人联系方式：">
          <span slot="label">
            <i style="color:red">*</i>采购人联系方式：
          </span>
          <el-input v-model="tableData.customerUserPhone" disabled placeholder="采购人联系方式"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="tableData" class="demo-form-inline">
        <el-form-item label="收货人：">
          <span slot="label">
            <i style="color:red">*</i>收货人：
          </span>
          <el-select v-model="tableData.recipientName" placeholder="收货人" disabled></el-select>
        </el-form-item>
        <el-form-item label="收货人联系方式：">
          <span slot="label">
            <i style="color:red">*</i>收货人联系方式：
          </span>
          <el-select v-model="tableData.recipientPhone" placeholder="收货人联系方式" disabled></el-select>
        </el-form-item>
        <el-form-item label="配送地址：">
          <span slot="label">
            <i style="color:red">*</i>配送地址：
          </span>
          <el-tooltip class="item" effect="dark" :content="tableData.customerReceiptAddress" placement="top">
          <div><el-select v-model="tableData.customerReceiptAddress" placeholder="配送地址" disabled></el-select></div>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="tableData" class="demo-form-inline">
        <el-form-item label="业务员：">
          <span slot="label">
            <i style="color:red">*</i>业务员：
          </span>
          <el-input v-model="tableData.staffName" disabled placeholder="业务员"></el-input>
        </el-form-item>
        <el-form-item label="期望配送日期：">
          <!-- <span slot="label"><i style="color:red">*</i>期望配送日期：</span> -->
          <el-input v-model="tableData.expectedDeliveryDate" disabled placeholder="期望配送日期"></el-input>
        </el-form-item>
        <el-form-item label="订单类型：">
           <span slot="label"><i style="color:red">*</i>订单类型：</span>
          <el-input v-model="tableData.orderTypeName" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注订单号：">
          <el-input v-model="tableData.memoOrderNo" disabled placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="tableData" class="demo-form-inline">
        <el-form-item label="是否紧急：">
          <el-radio-group v-model="tableData.urgent" disabled>
            <el-radio label="否">不紧急</el-radio>
            <el-radio label="是">紧急</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-left:100px;" label="订单备注：">
          <el-input v-model="tableData.orderMemo" disabled placeholder="订单备注" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="tableData" class="demo-form-inline">
        <el-form-item label="包装信息：">
          <el-radio-group v-model="tableData.packageType" disabled>
            <el-radio label="单独包装" value="单独包装"></el-radio>
            <el-radio label="统一包装" value="统一包装"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-left:60px;" label="打包备注：">
          <el-input v-model="tableData.packageMemo" disabled placeholder="打包备注" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="tableData" class="demo-form-inline">
        <el-form-item label="签收信息：">
          <el-radio-group v-model="tableData.receiveType" disabled>
            <el-radio label="各自签收"></el-radio>
            <el-radio label="统一签收"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-left:60px;" label="配送备注：">
          <el-input v-model="tableData.user" disabled placeholder="配送备注" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="商品信息"></addhead>
      <el-table :data="goodsList" border style="width:90%;" size="small">
        <el-table-column prop="userName" label="操作" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="id" label="条目号" style="width: 33%" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>  
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编号" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" style="width: 33%" align="center">
          <template slot="header"><i style="color:red">*</i>商品名称</template>
        </el-table-column>
        <el-table-column prop="skuModel" label="规格型号" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="websitePrice" label="官网售价" style="width: 33%" align="center">
          <template slot-scope="scope">￥{{scope.row.websitePrice}}</template>  
        </el-table-column>
        <el-table-column prop="negotiatedPrice" label="项目限价" style="width: 33%" align="center">
          <template slot-scope="scope">￥{{scope.row.negotiatedPrice}}</template>  
        </el-table-column>
        <el-table-column prop="negotiatedDiscount" label="折扣率%" style="width: 33%" align="center">
           <template slot-scope="scope">{{scope.row.negotiatedDiscount}}%</template>  
        </el-table-column>
        <el-table-column prop="currentDiscount" label="本次折扣率%" style="width: 33%" align="center">
          <template slot="header"><i style="color:red">*</i>本次折扣率%</template>
          <template slot-scope="scope">{{scope.row.currentDiscount}}%</template>  
        </el-table-column>
        <el-table-column prop="currentPrice" label="本次售价" style="width: 33%" align="center">
          <template slot="header"><i style="color:red">*</i>本次售价</template>
          <template slot-scope="scope">￥{{scope.row.currentPrice}}</template>  
        </el-table-column>
        <el-table-column prop="itemQty" label="数量" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="description" label="小计" style="width: 33%" align="center">
          <template slot-scope="scope">￥{{scope.row.currentPrice*scope.row.itemQty}}</template>  
        </el-table-column>
        <el-table-column prop="itemMemo" label="备注信息" style="width: 33%" align="center">
          <template slot-scope="scope"><el-button type="text" @click="open('showGoodsInfo',scope.row)">查看</el-button></template> 
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;margin-bottom:20px;float:right;">
          <span style="margin-right:100px">合计：￥{{total.toFixed(2)}}</span><span></span>
        </div>
    </div>
    <div class="detaillTable2 clear" style="margin-bottom:35px;">
      <addhead headname="操作记录"></addhead>
      <el-table :data="tableLog" border style="width:90%;" size="small">
        <el-table-column prop="userInfo" label="操作者" style="width: 33%" align="center">
          <template slot-scope="scope">{{scope.row.userInfo.userFullName}}</template>  
        </el-table-column>
        <!-- <el-table-column prop="operationTime" label="订单状态" style="width: 33%" align="center"></el-table-column> -->
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationDesc" label="备注" style="width: 33%" align="center">
          <template slot-scope="scope">
            {{scope.row.operationDesc}}
            <br/>
            {{scope.row.description}}
          </template>
        </el-table-column>
      </el-table>
      <div class="button-box">
          <!-- <el-button type="primary" @click="toAudite()">审核通过</el-button>
          <el-button type="primary" @click="toReject({'id':tableData.orderId})">审核驳回</el-button> -->
          <el-button type="primary" @click="close()">取消</el-button>
          <el-button type="primary" v-backTop>返回顶部</el-button>
      </div>
    </div>
    <!-- <rejectnoauditeorder ref="rejectnoauditeorder" @callback="discallback()"></rejectnoauditeorder>
        <changeinfo :title="title" :des="des" ref="changeinfo"></changeinfo> -->
         <showGoodsInfo ref="showGoodsInfo"></showGoodsInfo>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { findCancelDetailLog } from "@/api/ordernodraft.js";
import rejectnoauditeorder from "../child/reject_noauditeorder";
import changeinfo from "../child/change_info";
import showGoodsInfo from "../child/show_goodsInfo";
import { reject } from 'q';
export default {
  inject:['close'],
  name:'CancelOrderDetail',
  data() {
    return {
      orderId: null,
      tableData: null,
      tableLog: null,
      goodsList: [],
      footerWidth: 850,
      title:'',
      des:'',
    };
  },
  created(){
    this.orderId = this.$route.query.id;
    this.getdata();
  },
  mounted() {
    // this.footerWidth = this.$refs.detaillBox.clientWidth;
  },
  activated(){
  if(this.orderId!=this.$route.query.id){
    this.orderId=this.$route.query.id;
    this.getdata()
  }
  },
  components: {
    addhead,
    rejectnoauditeorder,
    changeinfo,
    showGoodsInfo
  },
  computed:{
    total:function(){
      return this.goodsList.reduce((prev,item)=>{
        return prev+item.currentPrice*item.itemQty
      },0)
    }
  },
  methods: {
    open(type,row){
      this.$refs[type].init(row);
    },
    getdata() {
      findCancelDetailLog(this.orderId).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.orderCancelReviewDTO;
          this.tableLog=res.data.orderOperationLogDTOList;
          this.goodsList=res.data.orderCancelReviewDTO.orderItemDTOList;
        }
      });
    },
    discallback(){

    },
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
    .el-row {
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
      span {
        margin-left: 100px;
      }
    }
    .bg-purple-dark {
      // background: #99a9bf;
    }
    .bg-purple {
      // background: #d3dce6;
    }
    .bg-purple-light {
      // background: #e5e9f2;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
    .demo-form-inline {
      margin-left: 100px;
      margin-top: 20px;
    }
    table {
      width: 90%;
      margin: 20px auto;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 12px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        padding-right: 6px;
        box-sizing: border-box;
        color: #666;
        font-weight: 700;
        font-size: 14px;
        text-align: right;
        width: 20%;
        background-color: #f9fafc;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 30%;
        line-height: 20px;
        span {
          margin-right: 10px;
          display: inline-block;
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
    .table {
      width: 90%;
      margin: 20px auto;
      border: 1px solid #ccc;
      border-right: none;
      h4 {
        padding-left: 10px;
        background-color: #f9fafc;
        line-height: 40px;
        border-right: 1px solid #ccc;
      }
      dl {
        background-color: #f9fafc;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0;
        dt {
          box-sizing: border-box;
          flex: 0 1 25%;
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
          line-height: 40px;
          padding-left: 10px;
        }
        dd {
          box-sizing: border-box;
          flex: 0 1 25%;
          background-color: #fff;
          line-height: 40px;
          padding-left: 10px;
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
      }
    }
    .infoTotal {
      height: 60px;
      width: 95%;
      line-height: 24px;
      text-align: right;
    }
  }
  .detaillTable2 {
    border: 1px solid #d1d1d1;
    border-top: none;
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
    }
    .button-box {
      display: flex;
      justify-content: center;
      width: 90%;
      margin: 0 auto 20px;
    }
  }
  .fotter {
    position: fixed;
    bottom: 10px;
    height: 70px;
    padding: 10px 0;
    line-height: 50px;
    box-sizing: border-box;
    background: #f3f3f3;
    border: 1px solid #ccc;
    white-space: nowrap;
    z-index: 1;
    span {
      font-size: 14px;
      display: inline-block;
      margin: 0 20px;
    }
    ul {
      display: inline-block;
      li {
        display: inline-block;
        margin: 0 10px;
      }
    }
  }
}
</style>
<style scoped>
.detaillBox >>> .is-icon .el-step__icon-inner {
  font-size: 48px;
}
.detaillBox >>> .is-finish {
  color: #1abc9c;
}
.detaillBox >>> .is-process {
  color: #c0c4cc;
}
.detaillBox >>> .is-finish .el-step__line {
  background-color: #1abc9c;
}
</style>