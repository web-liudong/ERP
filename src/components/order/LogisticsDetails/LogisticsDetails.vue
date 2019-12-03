<template>
<div>
 <div class="ordermanManagebox">
  <!-- v-show="isShow" -->
  <!-- 上方按钮 -->
      <ul>
        <li v-for="(item,index) in date" :key="index">
          <el-button size="small" :class="{active:isActive==index}" @click="items(index)">发货单{{index+1}}</el-button>
        </li>
        <div style="clear: both;"></div>
      </ul>
      <!-- 中间快递运送路径 -->
      <div class="centerbox">
        <div class="centop">
          {{orderDeliveryStatusDetailList[0].statusText}}
        </div>
        <div class="cenbottom" >
          <el-steps :space="100" direction="vertical" :active="1">
            <el-step :title=item.index   v-for="(item,index) in orderDeliveryStatusDetailList" :key="index">
             <template slot="description">
              <span>{{item.statusTimeName}}</span>&nbsp&nbsp
              <span>{{item.statusText}}</span>&nbsp&nbsp
              <span v-if="item.operatorName">{{item.operatorName}},</span>&nbsp&nbsp
              <span v-if="item.operatorPhone">手机号({{item.operatorPhone}})</span>&nbsp&nbsp
             </template>
            </el-step>
          </el-steps>
        </div>
      </div>
      <!-- 中间的线 -->
      <div class="fengexian"></div>
      <!-- 杂项 -->
      <div class="zaxiang">
        <ul>
          <li>
            <span>发货单号:</span>
            <p>{{orderDeliveryNo}}</p>
          </li>
          <li>
            <span>订单号:</span>
            <p>{{orderNo}}</p>
          </li>
         <!--  <li>
            <span>物流公司:</span>
            <p>空</p>
          </li>
          <li>
            <span>物流单号:</span>
            <p>空</p>
          </li> -->
          <div style="clear: both;"></div>
          <li>
            <span>发货地址:</span>
            <p>{{warehouseAddress}}</p>
          </li>
          <div style="clear: both;"></div>
          <li>
            <span>收货地址:</span>
              <p>{{recipientAddress}}</p>
              <p class="p">{{recipientName}}</p>
              <p class="p">{{recipientPhone}}</p>
          </li>
        </ul>
      </div>
      <!-- 表格 -->
       <el-table
       stripe
    :data="orderDeliveryItemList"
    border
    style="width: 94%">
    <el-table-column
    align="center"
      prop="id"
      label="商品编号"
      width="90">
    </el-table-column>
    <el-table-column
    align="center"
      prop="skuName"
      label="商品名称"
      width="320">
    </el-table-column>
    <el-table-column
    align="center"
      prop="unit"
      label="单位"
      width="50">
    </el-table-column>
    <el-table-column
    align="center"
      prop="currentPrice"
      :formatter="currentPricecurrentPrice"
      label="本次售价"
      width="110">
    </el-table-column>
    <el-table-column
    align="center"
      prop="itemQty"
      label="数量"
      width="50">
    </el-table-column>
    <el-table-column
    align="center"
      prop="amount"
      :formatter="amountamount"
      label="小计"
      width="110">
    </el-table-column>
    <el-table-column
    align="center"
      prop="itemMemo"
      label="备注信息">
    </el-table-column>
  </el-table>
    <!-- 合计栏 -->
 <div class="he">
    <div>合计:￥{{allallall}}</div>
  </div>
  <!-- 底部按钮组 -->
  <div class="button">
   
    <el-button v-backTop>回顶部</el-button>
     <el-button @click="close()">关闭</el-button>
    <div style="clear: both;"></div>
  </div>
 </div>
 <div class="footer">
   <p>Copyright ©领先未来 2008-2018, All Rights Reserved</p>
   <p>京ICP备08001160号-10</p>
 </div>
  </div>
</template>
<script>
  // 注入接口
  import {orderdetail} from '@/api/order/LogisticsDetails'
  export default {
    name: "LogisticsDetails",
    inject:['reload','close'],//注入依赖
    data() {
        return{
          orderDeliveryStatusDetailList:[],
          isActive:0,
          orderDeliveryItemList:[],
          date:[],
          orderDeliveryNo:"",
          orderNo:"",
          warehouseAddress:"无",
          recipientAddress:"",
          recipientName:"",
          recipientPhone:"",
          allall:0,
          allallall:"",
          id:"",
        }
    },
    activated() {
    if (this.id != this.$route.query.id) {
      this.createdid();
    }
  },
    created(){
      // this.createdid();
      // if (this.$route.query.id) {
      //   orderdetail(this.$route.query.id).then(res => {
      //     this.date=res.data;
      //     this.orderDeliveryStatusDetailList=res.data[0].orderDeliveryStatusDetailList;
      //     this.orderDeliveryItemList=res.data[0].orderDeliveryItemList;
      //    for (var i = 0; i <this.orderDeliveryItemList.length; i++) {
      //     console.log(this.orderDeliveryItemList[i].amount);
      //      this.allall+=this.orderDeliveryItemList[i].amount
      //       this.allallall=this.allall.toFixed(4);
      //    }
      //     this.orderDeliveryNo=res.data[0].orderDeliveryNo;
      //     this.orderNo=res.data[0].orderNo;
      //     if (res.data[0].warehouseAddress!=null) {
      //       this.warehouseAddress=res.data[0].warehouseAddress;
      //     }
      //     this.recipientAddress=res.data[0].recipientAddress;
      //     this.recipientName=res.data[0].recipientName;
      //     this.recipientPhone=res.data[0].recipientPhone;
      // });
      // }
    },
    
    watch:{
    },
    methods: {
      createdid(){
      this.id = this.$route.query.id
      if (this.id) {
        orderdetail(this.id).then(res => {
          this.date=res.data;
          this.orderDeliveryStatusDetailList=res.data[0].orderDeliveryStatusDetailList;
          this.orderDeliveryItemList=res.data[0].orderDeliveryItemList;
         for (var i = 0; i <this.orderDeliveryItemList.length; i++) {
          console.log(this.orderDeliveryItemList[i].amount);
           this.allall+=this.orderDeliveryItemList[i].amount
            this.allallall=this.allall.toFixed(4);
         }
          this.orderDeliveryNo=res.data[0].orderDeliveryNo;
          this.orderNo=res.data[0].orderNo;
          if (res.data[0].warehouseAddress!=null) {
            this.warehouseAddress=res.data[0].warehouseAddress;
          }
          this.recipientAddress=res.data[0].recipientAddress;
          this.recipientName=res.data[0].recipientName;
          this.recipientPhone=res.data[0].recipientPhone;
      });
      }
    },
    items(val) {
      this.isActive=val;
      this.allall=0;
      if (this.$route.query.id) {
        orderdetail(this.$route.query.id).then(res => {
          this.orderDeliveryStatusDetailList=res.data[val].orderDeliveryStatusDetailList;
          this.orderDeliveryItemList=res.data[val].orderDeliveryItemList;
          this.orderDeliveryNo=res.data[val].orderDeliveryNo;
          this.orderNo=res.data[val].orderNo;
          if (res.data[val].warehouseAddress!=null) {
            this.warehouseAddress=res.data[val].warehouseAddress;
          }
          this.recipientAddress=res.data[val].recipientAddress;
          this.recipientName=res.data[val].recipientName;
          this.recipientPhone=res.data[val].recipientPhone;
           for (var i = 0; i <this.orderDeliveryItemList.length; i++) {
           this.allall+=this.orderDeliveryItemList[i].amount;
           this.allallall=this.allall.toFixed(4);
         }
      });
      }
    },
    amountamount(row, column){
      let amount='';
      amount=row.amount.toFixed(4);
       return amount='￥'+amount;
    },
    currentPricecurrentPrice(row, column){
      let currentPrice='';
      currentPrice=row.currentPrice.toFixed(4);
       return currentPrice='￥'+currentPrice;
    },    
}
}
</script>
<style scoped lang="less">
 .ordermanManagebox {
    width: 100%;
    margin-top: 10px;
    border:2px solid #f5f5f5;
    ul{
      padding-bottom: 30px;
      li{
        float: left;
        .el-button{
          width: 110px;
          height: 50px;
          border-top: none;
          border-left: none;
        }
      }
    }
    .centerbox{
      width: 94%;
      margin-left: 3%;
      border:2px solid #f5f5f5;
      margin-bottom: 20px;
      .centop{
        height: 40px;
        background-color: #f5f5f5;
        font-size: 17px;
        line-height: 40px;
        padding-left: 15px;
        font-weight: bold;
      }
      .cenbottom{
        padding-bottom:20px;
        padding-left:50px;
        padding-top: 20px;
      }
    }
    .fengexian{
      width: 98%;
      margin-left: 1%;
      border:1px solid #f5f5f5;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .zaxiang{
      margin-bottom: 10px;
      ul{
        li{
          float: left;
          margin-left: 50px;
          margin-top: 15px;
          span{
            float: left;
            font-weight: bold;
          }
          p{
            float: left;
            span{
            font-weight: bold;
          }
          }
          .p{
            margin-left: 20px;
          }
        }
      }
    }
    .el-table{
      margin-left: 3%;
      .el-table-column{
        text-align: center;
        overflow:hidden;
      }
     
    }
     .he{
      overflow-x: hidden;
      width: 93.63%;
      margin-left: 3%;
      margin-bottom: 30px;
      height: 50px;
      border:2px solid #f5f5f5;
      border-top:none;
      div{
        height: 50px;
        width: 728px;
        border-right:1px solid #f5f5f5;
        text-align: right;
        line-height: 50px;
      }
    }
    .button{
      width: 94%;
       margin-left: 3%;
       margin-bottom: 30px;
      .el-button{
        float: right;
        width: 100px;
        margin-right: 20px;
        background-color:#00AA88;
        color: #fff;
      }
    }
    
        }
        .active{
        background: #00AA88;
        color: #fff;
      }
      .footer{
        width: 100%;
        margin-top:30px;
        p{
          text-align: center;
          color:#DDDDDD;
          font-size: 13px;
        }
      }
</style>
