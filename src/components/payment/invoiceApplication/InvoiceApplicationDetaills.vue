<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconjinridingdanshu"></i>发票信息</span>
      </div>
      <table border="1">
        <tr>
          <th>发票申请单编号：</th>
          <td>{{returnData.invoiceApplicationDTO.invoiceApplicationNo}}</td>
          <th>申请时间：</th>
          <td>{{returnData.invoiceApplicationDTO.createTime}}</td>
        </tr>
        <tr>
          <th><i></i>发票类型：</th>
          <td>
            <span v-if="returnData.invoiceApplicationDTO.invoiceType == 0">专票</span>
            <span v-if="returnData.invoiceApplicationDTO.invoiceType == 1">普票</span>
            <span v-if="returnData.invoiceApplicationDTO.invoiceType == 2">电子发票</span>
          </td>
          <th>发票抬头：</th>
          <td>{{returnData.invoiceApplicationDTO.invoiceTitle}}</td>
        </tr>
        <tr>
          <th><i></i>实际申请金额：</th>
          <td>￥{{returnData.invoiceApplicationDTO.invoiceAmount}}</td>
          <th><i></i>发票地址：</th>
          <td>{{returnData.invoiceApplicationDTO.addressOnInvoice}}</td>
        </tr>
        <tr>
          <th><i></i>发票申请人：</th>
          <td>{{returnData.invoiceApplicationDTO.creatorName}}</td>
          <th><i></i>发票电话：</th>
          <td>{{returnData.invoiceApplicationDTO.phoneOnInvoice}}</td>
        </tr>
        <tr>
          <th><i></i>税务登记号：</th>
          <td>{{returnData.invoiceApplicationDTO.socialCreditCode}}</td>
          <th><i></i>申请备注：</th>
          <td>{{returnData.invoiceApplicationDTO.applicationMemo}}</td>
        </tr>
        <tr>
          <th><i></i>申请状态：</th>
          <td>
            <span v-if="returnData.invoiceApplicationDTO.status == 0">待审核</span>
            <span v-if="returnData.invoiceApplicationDTO.status == 1">已驳回</span>
            <span v-if="returnData.invoiceApplicationDTO.status == 2">待开票</span>
            <span v-if="returnData.invoiceApplicationDTO.status == 3">开票中</span>
            <span v-if="returnData.invoiceApplicationDTO.status == 4">已完成</span>
            <span v-if="returnData.invoiceApplicationDTO.status == 5">开票失败</span>
            <span v-if="returnData.invoiceApplicationDTO.status == 6">驳回原因</span>
          </td>
          <th><i></i>发票备注：</th>
          <td>{{returnData.invoiceApplicationDTO.memoOnInvoice}}</td>
        </tr>
        <tr>
          <th><i></i>账号：</th>
          <td>{{returnData.invoiceApplicationDTO.accountNo}}</td>
          <th><i></i>开户行：</th>
          <td>{{returnData.invoiceApplicationDTO.bank}}</td>
        </tr>
        <tr>
          <th><i></i>发票号码：</th>
          <td>{{returnData.invoiceApplicationDTO.invoiceNumber}}</td>
          <th><i></i>发票代码：</th>
          <td>{{returnData.invoiceApplicationDTO.invoiceCode}}</td>
        </tr>
        <tr>
          <th><i></i>物流信息：</th>
          <td></td>
          <th></th>
          <td></td>
        </tr>
        <tr>
          <th><i></i>驳回原因：</th>
          <td>{{returnData.invoiceApplicationDTO.rejectReason}}</td>
           <th><i></i>发票连接：</th>
          <td>{{returnData.invoiceApplicationDTO.invoiceUrl}}</td>
        </tr>
        <tr>
          <th><i></i>发票寄送地址：</th>
          <td colspan="3">{{returnData.invoiceApplicationDTO.recipientAddressLineAndNameAndPhone}}</td>
        </tr>
        <tr>
          <th><i></i>备注1：</th>
          <td colspan="3">{{returnData.invoiceApplicationDTO.memo1}}</td>
        </tr>
        <tr>
          <th><i></i>备注2：</th>
          <td colspan="3">{{returnData.invoiceApplicationDTO.memo2}}</td>
        </tr>
        <tr>
          <th><i></i>备注3：</th>
          <td colspan="3">{{returnData.invoiceApplicationDTO.memo3}}</td>
        </tr>
        <tr>
          <th><i></i>备注4：</th>
          <td colspan="3">{{returnData.invoiceApplicationDTO.memo4}}</td>
        </tr>
        <tr>
          <th><i></i>备注5：</th>
          <td colspan="3">{{returnData.invoiceApplicationDTO.memo5}}</td>
        </tr>
      </table>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont icondingdanguanli"></i>&nbsp;订单详情</span>
        <el-table
          :data="returnData.invoiceApplicationOrderDTOS"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="no"
            label="订单编号"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orderStatusText"
            label="订单状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="订单金额"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="alreadyTotal"
            label="已结算金额"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.alreadyTotal}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceAmount"
            label="本次开票金额"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.invoiceAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="creatorName"
            label="下单人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="下单部门"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;发票明细</span>
        <el-table
          :data="returnData.invoiceApplicationOrderItemDTOs"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="skuNo"
            label="商品编号"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuModel"
            label="型号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="invoicePrice"
            label="单价"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.invoicePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="currentQty"
            label="数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="invoiceAmount"
            label="申请总金额"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.invoiceAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="taxCode"
            label="税收分类编码"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconjinridingdanshu"></i>操作纪录</span>
      </div>
      <el-table
        :data="returnData.invoiceApplicationOperationLogs"
        border
        stripe
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userId"
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.operationTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.operation==0">新建</span>
            <span v-if="scope.row.operation==1">驳回</span>
            <span v-if="scope.row.operation==1">
            (  {{scope.row.description}})
            </span>
            <span v-if="scope.row.operation==2">通过</span>
            <span v-if="scope.row.operation==3">开票</span>
            <span v-if="scope.row.operation==4">完成</span>
            <span v-if="scope.row.operation==5">作废</span>
            <span v-if="scope.row.operation==6">回票录入修改</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="purRetun()">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
    </div>
  </div>
</template>
<script>

  import {
    getInvoiceApplicationFindInvoiceReceivable,
    postInvoiceApplicationCreateInvoiceReceivable,
    getInvoiceApplicationDetail,
    postInvoiceApplicationList,
    postInvoiceApplicationExportFileLogList,
  } from '@/api/payment/invoiceApplication'
  export default {
    name: "InvoiceApplicationDetaills",
    inject:['reload','imgurl','close'],//注入依赖
    data() {
      return {
        oldId:"",
        returnData: {
          invoiceApplicationDTO:''
        },
        msg: '',
        tableDataMis: {
          id: '1000001',
          name: '清华同方',
          address: '同方股份有限公司',
          brandstatus: '草稿 审核情况 '
        },
        tableData: [],
      }
    },
    activated() {
      if (this.oldId!=this.$route.query.id){
        this.oldId=this.$route.query.id;
        getInvoiceApplicationDetail(
          this.$route.query.id
        )
          .then((res) => {
            console.log(res)
            this.returnData = res.data;
          }).catch(err => {
          console.log(err)
        })
      }
    },
    mounted() {
      this.oldId=this.$route.query.id;
      //仓库详情
      getInvoiceApplicationDetail(
        this.$route.query.id
      )
        .then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
        console.log(err)
      })
    },
    methods: {
      purRetun(){
        this.close();
      },

      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.id;
        // 将数据放在当前组件的数据内
        this.msg = routerParams;
        console.log(this.msg);
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    },
    filters: {
      //时间截取字符串
      formatDate: function (val) {
        var dateee = new Date(val).toJSON();
        var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
        return date
      }
    }
  }
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
        td, th {
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
