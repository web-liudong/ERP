<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconjinridingdanshu"></i>回款信息</span>
      </div>
      <table border="1">
        <tr>
          <th>回款信息编号：</th>
          <td>{{returnData.paymentReceivedNo}}</td>
          <th>所属组织机构：</th>
          <td>{{returnData.organizationName}}</td>
        </tr>
        <tr>
          <th>记账时间：</th>
          <td>{{returnData.keepingAccountsDate}}</td>
          <th>流水号：</th>
          <td>{{returnData.serialNumber}}</td>
        </tr>
        <tr>
          <th><i></i>对方户名：</th>
          <td>{{returnData.accountName}}</td>
          <th><i></i>回款金额：</th>
          <td>￥{{returnData.receivedAmount}}</td>
        </tr>
        <tr>
          <th>支行名：</th>
          <td>{{returnData.subbranch}}</td>
          <th><i></i>对方账户：</th>
          <td>{{returnData.accountNo}}</td>
        </tr>
        <tr>
          <th><i></i>所属省份：</th>
          <td>{{returnData.provinceName}}</td>
          <th><i></i>用途：</th>
          <td>{{returnData.uses}}</td>
        </tr>
        <tr>
          <th><i></i>状态：</th>
          <td>{{returnData.statusName}}</td>
          <th><i></i>服务项目：</th>
          <td>{{returnData.projectName}}</td>
        </tr>
        <tr>
          <th><i></i>推送状态：</th>
          <td>{{returnData.pushStatusName}}</td>
          <th><i></i></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;认款记录</span>
        <el-table
          :data="returnData.payClaims"
          :span-method="arraySpanMethod"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="orderId"
            label="订单号"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createOrderTime"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目"
            align="center">
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="客户"
            align="center">
          </el-table-column>
          <el-table-column
            prop="customerUserName"
            label="采购人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orderServerName"
            label="服务方"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="本次认款金额"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderServerName"
            label="收款账号信息"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.amount}}</span>
            </template>
          </el-table-column>
        </el-table>
        <table border="1" style="background: #fff;">
          <tr>
            <th>旧ERP订单号</th>
            <th>本次认款金额￥</th>
          </tr>
          <tr v-for="item in returnData.payClaimOlds">
            <td>{{item.amount}}</td>
            <td>{{item.oldErpOrderNo}}</td>
          </tr>
        </table>
        <table border="1" style="background: #fff;">
          <tr>
            <td style="width: 8%">备注</td>
            <td>{{returnData.claimMemo}}</td>
          </tr>
        </table>
      </div>

    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconjinridingdanshu"></i>操作纪录</span>
      </div>
      <el-table
        :data="returnData.operationLogs"
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
            <span>{{scope.row.userInfo.userPosts[0].organizationName}}>{{scope.row.userInfo.userPosts[0].departmentName}}>{{scope.row.userInfo.realName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作时间"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.operationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span >{{scope.row.operation}}</span>
            <!--<span v-if="scope.row.operation==0">新建</span>-->
            <!--<span v-if="scope.row.operation==1">编辑</span>-->
            <!--<span v-if="scope.row.operation==2">删除</span>-->
            <!--<span v-if="scope.row.operation==3">财务认款</span>-->
            <!--<span v-if="scope.row.operation==4">推送</span>-->
            <!--<span v-if="scope.row.operation==5">认款</span>-->
            <!--<span v-if="scope.row.operation==6">撤销认款</span>-->
            <!--<span v-if="scope.row.operation==7">退回至回款列表</span>-->
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
    </div>
  </div>
</template>
<script>
  import {
    putClaimBackPaymentrReceived,
    getcClaimPage,
    putClaimConfirm,
    getcClaimDetail,
    postClaimFindOrderList,
    postClaimList,
    getcClaimStatusCount,
  } from '@/api/payment/claimList'

  export default {
    inject:['reload','imgurl','close'],//注入依赖
    name:'ClaimDetaills',
    data() {
      return {
        RecordId:'',
        returnData: {},
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
    activated(){
      if(this.RecordId != this.$route.query.id){
        this.RecordId = this.$route.query.id
        getcClaimDetail(
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
      this.RecordId = this.$route.query.id
      getcClaimDetail(
        this.$route.query.id
      )
        .then((res) => {
          this.returnData = res.data;
        }).catch(err => {
        console.log(err)
      })
    },

    methods: {
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6  ) {
          if (this.returnData.payClaims.length >= 2) {
            var arr = this.returnData.payClaims
            var dic = {}
            for (var k in arr) {
              if (!dic[arr[k].orderId]) {
                ;dic[arr[k].orderId] = [k]
              }
              else {
                dic[arr[k].orderId][1] = k
              }
            }
            for (k in dic) {
              if (dic[k].length == 1) {
                delete(dic[k])
              }
            }
            for (var key in dic) {
              if (rowIndex == dic[key][0]) {
                var num = dic[key][1] - dic[key][0] + 1;
                return {
                  rowspan: num,　　　　　//合并的行数
                  colspan: 1 //合并的列数，设为０则直接不显示
                };
              } else if (rowIndex != dic[key][0]) {
                var numnum = parseInt(dic[key][0]) + 1
                for (var i = numnum; i <= dic[key][1]; i++) {
                  if (rowIndex == i) {
                    return {
                      rowspan: 0,　　　　　//合并的行数
                      colspan: 0 //合并的列数，设为０则直接不显示
                    };
                  }
                }
              }
            }
          }
        }
      },
      //关闭当前页面
      // close() {
      //   window.opener = null;
      //   window.close()
      // },
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
      formatDate: function (value) {
        return value.substring(0, 10);
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
          i {

          }
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
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      line-height: 50px;
      .listBoxTop {
        table {
          width: 90%;
          margin: 20px auto;
          td, th {
            border: 1px solid #d1d1d1;
            font-size: 12px;
            height: 53px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          }
          th {
            background: #f5f7fa;
            color: #303133;
            width: 20%;
            i {
              color: red;
            }
          }
          td {
            color: #666666;
            width: 30%;
          }
        }
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
          i {

          }
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
