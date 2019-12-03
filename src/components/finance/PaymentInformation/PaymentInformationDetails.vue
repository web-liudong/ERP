<!-- 回款信息详情 -->
<template>
<div class="PaymentInformationDetails">
  <!-- 标题+表格ServiceInformation -->
  <div class="ServiceInformation">
    <div class="top">
    <i class="iconfont icon-jinqi myicon" style="margin-left: 10px;"></i>
    <span>应付账款信息</span>
  </div>
  <table class="table1" border="1">
          <!-- 流水号，支行名添加 -->
          <!-- <th class="th">流水号:</th>
          <td class="td">{{serialNumber}}</td>
          <th class="th">支行名:</th>
          <td class="td">{{subbranch}}</td> -->
        <tr>
          <th class="th">回款信息编号:</th>
          <td class="td">{{paymentReceivedNo}}</td>
          <th class="th">所属组织机构:</th>
          <td class="td">{{organizationName}}</td>
        </tr>
        <tr>
          <th class="th">记账时间:</th>
          <td class="td">{{keepingAccountsDate}}</td>
          <th class="th">流水号:</th>
          <td class="td">{{serialNumber}}</td>
        </tr>
        <tr>
          <th class="th">对方户名:</th>
          <td class="td">{{accountName}}</td>
          <th class="th">回款金额:</th>
          <td class="td">￥{{formatMoney(receivedAmount)}}</td>
          
        </tr>
        <tr>
          <th class="th">支行名:</th>
          <td class="td">{{subbranch}}</td>
          <th class="th">对方账户:</th>
          <td class="td">{{accountNo}}</td>
        </tr>
        <tr>
          <th class="th">所属省份:</th>
          <td class="td">{{provinceName}}</td>
          <th class="th">用途:</th>
          <td class="td">{{uses}}</td>
          
        </tr>
        <tr>
          <th class="th">状态:</th>
          <td class="td">{{statusName}}</td>
          <th class="th">服务项目:</th>
          <td class="td">{{projectName}}</td>
          
        </tr>
        <tr>
          <th class="th">推送状态:</th>
          <td class="td">{{pushStatusName}}</td>
          <th class="th"></th>
          <td class="td"></td>
        </tr>
      </table>
  </div>
 <!-- 标题+表格 -->
  <div class="goodsmessage">
    <div class="top">
    <i class="iconfont icon-jinqi myicon" style="margin-left: 10px;"></i>
    <span>认款信息</span>
  </div>
  <el-table
  :span-method="arraySpanMethod"
          :data="tableData"
          border
          style="width: 100%"
          size="small"
          stripe>
          <el-table-column
            prop="orderId"
            label="订单号"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="createOrderTime"
            label="下单时间"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="客户"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="customerUserName"
            label="采购人"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="orderServerName"
            label="服务方"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="本次认款金额"
            align="center"
            :formatter="amount">
          </el-table-column>
          <el-table-column
            label="收款账号信息"
            align="center">
            <template slot-scope="scope">
            <span>
              {{ scope.row.accountName}}-{{ scope.row.accountNo}}
            </span>
          </template>
          </el-table-column>
  </el-table>
<!-- 旧ERP系统 -->
  <el-table
          :data="oldtableData"
          border
          style="width: 100%"
          size="small"
          stripe>
          <el-table-column
            prop="oldErpOrderNo"
            label="旧ERP订单号"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="本次认款金额"
            align="center"
            >
          </el-table-column>
  </el-table>

<table class="table2" border="1">
        <tr>
          <th class="th">备注:</th>
          <td class="td" v-text="claimMemo"></td>
        </tr>
      </table>


  </div>
  <!-- 标题+表格 -->
  <div class="goodsmessage2">
    <div class="top">
    <i class="iconfont icon-jinqi myicon" style="margin-left: 10px;"></i>
    <span>操作</span>
  </div>
  <el-table
          :data="tableData2"
          border
          style="width: 100%"
          size="small"
          stripe>
          <el-table-column
            label="操作者"
            align="center">
            <template slot-scope="scope">
            <span>
              {{ scope.row.userInfo.organizationName}}>{{ scope.row.userInfo.departmentName}}>{{ scope.row.userInfo.realName}}
            </span>
          </template>
          </el-table-column>
          <el-table-column
            prop="operationTime"
            label="操作时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作事项"
            align="center">
          </el-table-column>
  </el-table>
  </div>
     <!--按钮组  -->
     <div class="botton">
       <el-button v-backTop>回顶部</el-button>
       <el-button @click="closeclose" style="margin-right: 20px;">关闭</el-button>
     </div>
     <div style="clear: both;"></div>
  </div>
</template>
<script>
  // 注入接口
  import {huikuandetail} from '@/api/finance/PaymentInformation'
  import {returnFloat} from "@/utils";
  export default {
    name: "PaymentInformationDetails",
    inject:['reload','close'],
    data() {
        return{
          tableData:[],
          oldtableData:[],
          tableData2:[],
          serialNumber:"",
          subbranch:"",
          claimMemo:"",
          accountName:'',
          accountNo:'',
          organizationName:'',
          keepingAccountsDate:'',
          projectName:'',
          provinceName:'',
          pushStatusName:'',
          statusName:'',
          uses:'',
          paymentReceivedNo:'',
          receivedAmount:'',
          senders:[1,2,3],
          id:"",
        }
    },
    activated() {
    if (this.id != this.$route.query.id) {
      this.createdid();
    }
  },
    created(){
      console.log(this.$route.query)
      // this.createdid();
      // huikuandetail(this.$route.query.id).then(res => {
      //   console.log(res.data)
      //   //认款信息
      //   this.tableData=res.data.payClaims;
      //   //旧ERP订单认款信息
      //   this.oldtableData=res.data.payClaimOlds;
      //   //操作
      //   this.tableData2=res.data.operationLogs;//操作记录
      //   //备注
      //   this.claimMemo=res.data.claimMemo;//认款备注
      //   if (this.claimMemo=="") {
      //     this.claimMemo="暂无数据";
      //   }
      //   //应付账款信息
      //   this.accountName=res.data.accountName;//对方户名
      //   this.accountNo=res.data.accountNo;//对方账户
      //   this.keepingAccountsDate=res.data.keepingAccountsDate;//记账时间
      //   this.organizationName=res.data.organizationName;//组织机构
      //   this.projectName=res.data.projectName;//服务项目
      //   this.provinceName=res.data.provinceName;//所属省份
      //   this.pushStatusName=res.data.pushStatusName;//推送状态
      //   this.statusName=res.data.statusName;//状态
      //   this.uses=res.data.uses;//用途
      //   this.paymentReceivedNo=res.data.paymentReceivedNo;//回款信息编号
      //   this.receivedAmount=res.data.receivedAmount;//回款金额
      // });
    },
    watch:{
    },
    methods: {
      closeclose(){
        this.close({name:'PaymentInformationDetails', to: {name:'PaymentInformation', params:{isUpdate:true}}});
      },
      createdid(){
      this.id = this.$route.query.id
      huikuandetail(this.$route.query.id).then(res => {
        console.log(res.data)
        //认款信息
        this.tableData=res.data.payClaims;
        //旧ERP订单认款信息
        this.oldtableData=res.data.payClaimOlds;
        //操作
        this.tableData2=res.data.operationLogs;//操作记录
        //备注
        this.claimMemo=res.data.claimMemo;//认款备注
        if (this.claimMemo=="") {
          this.claimMemo="暂无数据";
        }
        //应付账款信息
        this.accountName=res.data.accountName;//对方户名
        this.accountNo=res.data.accountNo;//对方账户
        this.keepingAccountsDate=res.data.keepingAccountsDate;//记账时间
        this.organizationName=res.data.organizationName;//组织机构
        this.projectName=res.data.projectName;//服务项目
        this.provinceName=res.data.provinceName;//所属省份
        this.pushStatusName=res.data.pushStatusName;//推送状态
        this.statusName=res.data.statusName;//状态
        this.uses=res.data.uses;//用途
        this.paymentReceivedNo=res.data.paymentReceivedNo;//回款信息编号
        this.receivedAmount=res.data.receivedAmount;//回款金额
        //新增流水号，支行名
        this.serialNumber=res.data.serialNumber;//流水号
        this.subbranch=res.data.subbranch;//支行名
      });
    },
      formatMoney(val){
        return returnFloat(val)
      },
      amount(row){
        return '￥'+returnFloat(row.amount);
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0||columnIndex === 1||columnIndex === 2||columnIndex === 3||columnIndex === 4||columnIndex === 5)
        {   //用于设置要合并的列
          if (this.tableData.length>=2) {
            var arr = this.tableData
            var dic = {}
            for (var k in arr){
              console.log(1111,arr[k].orderId)
                 if (!dic[arr[k].orderId]){console.log([k]); dic[arr[k].orderId] = [k]}
                 else{dic[arr[k].orderId][1] = k}
             }
           for (k in dic){if (dic[k].length==1){delete(dic[k])}}
            console.log(dic)
             for (var key in dic){
              if (rowIndex == dic[key][0]) {
                var num=dic[key][1]-dic[key][0]+1;
                return {
              rowspan: num,　　　　　//合并的行数
              colspan: 1          //合并的列数，设为０则直接不显示
            };
          }else if(rowIndex != dic[key][0]){
            var numnum=parseInt(dic[key][0])+1
            for (var i = numnum; i <= dic[key][1]; i++) {
              if (rowIndex ==i) {
                return {
              rowspan: 0,　　　　　//合并的行数
              colspan: 0          //合并的列数，设为０则直接不显示
            };
              }
            }
          }
            }
          }
        }
      },
}
}
</script>
<style lang="less">
.PaymentInformationDetails{
  i{
    font-size: 20px;
  }
  .botton{
    margin-top: 20px;
    margin-bottom: 20px;
    .el-button{
      width: 80px;
      float: right;
      background-color:#46c8af;
      color: #fff;
    }
  }
  .el-table{
      margin-top: 20px;
    }
  .table1{
      margin-top: 20px;
      .th{
      width:250px;
      height: 40px;
      background-color:#f5f5f5;
    }
    .td{
      width:300px;
      height: 40px;
    }
    }
    .table2{
      width: 100%;
      margin-top: 20px;
      border:1px solid #ccc;
      .th{
      width:20%;
      height: 40px;
      background-color:#f5f5f5;
    }
    .td{
      width:300px;
      height: 40px;
      text-align: center;
    }
    }
  .top{
    height: 40px;
    line-height: 40px;
    width: 100%;
    background-color: #f5f5f5;
    font-size: 17px;
    margin-top: 20px;
    i{
      margin-left: 10px;
    }
    span{}
  }
  width: 100%;
  .el-steps{
    margin-top: 20px;
  }
  .goodsmessage{
    margin-top: 20px;
    
    .bottom{
      border:2px solid #f5f5f5;
      span{
        display: block;
        float: right;
        margin-right: 20px;
        margin-top: 10px;
        font-size: 15px;
      }
    }
  }
  .ServiceInformation{

    width: 100%;
    
  }
}
</style>
