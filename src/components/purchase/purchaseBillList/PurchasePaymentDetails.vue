<template>
  <div class="wrapper">
    <div class="head">
      <div class="head-title">
        <i class="iconfont iconsousuo myicon"></i>
        <span>供应商账户信息：</span>
      </div>
      <ul>
        <li>
          <div class="slice-info"> <p class="slice-info-left">供应商</p> : <span class="slice-info-right">{{returnData.supplierBizDTO.supplierName}}</span></div>
          <div class="slice-info"> <p class="slice-info-left">供应商开户银行</p> : <span class="slice-info-right">{{returnData.supplierBizDTO.bank}}</span></div>
          <div class="slice-info"> <p class="slice-info-left">供应商开户行账号</p> : <span class="slice-info-right">{{returnData.supplierBizDTO.accountNo}}</span></div>
          <div class="slice-info"> <p class="slice-info-left">供应商开户名</p> : <span class="slice-info-right">{{returnData.supplierBizDTO.accountName}}</span></div>
        <li/>
      </ul>
    </div>
    <div class="head">




      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>付款单信息：</span>
      </div>
      <ul>
        <li>
          <div class="slice-info"> <p class="slice-info-left">付款单编号</p> : <span class="slice-info-right">{{returnData.purchaseAccountPayableDTO.accountPayableNo}}</span></div>
          <div class="slice-info"> <p class="slice-info-left">创建日期</p> : <span class="slice-info-right">{{returnData.purchaseAccountPayableDTO.createTime | formatDate}}</span></div>
          <div class="slice-info"> <p class="slice-info-left">总金额</p> : <span class="slice-info-right">
            <div>
              <p v-if="returnData.purchaseAccountPayableDTO.billAmount!=0" style="width: 20px;margin-bottom: -16px">￥</p>
              <p style="width: 100px;margin-left: 20px">{{returnData.purchaseAccountPayableDTO.billAmount}}</p>
            </div>
          </span></div>
          <div class="slice-info"> <p class="slice-info-left">已结算金额</p> : <span class="slice-info-right">
            <p v-if="returnData.purchaseAccountPayableDTO.totalAccountPaid!=0" style="width: 20px;margin-bottom: -16px">￥</p>
            <p style="width: 100px;margin-left: 20px">{{returnData.purchaseAccountPayableDTO.totalAccountPaid}}</p>
          </span></div>
        </li>
        <li>
          <div class="slice-info"> <p class="slice-info-left">已收票金额</p> : <span class="slice-info-right">
            <p v-if="returnData.purchaseAccountPayableDTO.invoiceAmountReceived!=0" style="width: 20px;margin-bottom: -16px">￥</p>
            <p style="width: 100px;margin-left: 20px">{{returnData.purchaseAccountPayableDTO.invoiceAmountReceived}}</p>
          </span></div>
          <div class="slice-info"> <p class="slice-info-left">应付金额</p> : <span class="slice-info-right">
            <p v-if="returnData.purchaseAccountPayableDTO.accountPayable!=0" style="width: 20px;margin-bottom: -16px">￥</p>
            <p style="width: 100px;margin-left: 20px">{{returnData.purchaseAccountPayableDTO.accountPayable}}</p>
          </span></div>
          <div class="slice-info"> <p class="slice-info-left">状态</p> : <span class="slice-info-right">{{returnData.purchaseAccountPayableDTO.statusText}}</span></div>
          <div class="slice-info"> <p class="slice-info-left">关闭/取消原因</p> :
            <span class="slice-info-right" v-if="returnData.purchaseAccountPayableDTO.statusText == '已取消'">{{returnData.purchaseAccountPayableDTO.cancelReason}}</span>
            <span class="slice-info-right" v-if="returnData.purchaseAccountPayableDTO.statusText == '已关闭'">{{returnData.purchaseAccountPayableDTO.closeReason}}</span>
          </div>
        </li>
      </ul>

    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>应付账款明细</span>

      </div>
      <div class="body1">
        <div class="head-title">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
          <div  class="listBoxRight" >
            <el-button size="small"  @click="getoutdata()"><i class="iconfont icondaochu"></i>导出</el-button>
          </div>
        </div>
        <div class="body1" v-for="(Data,index) in returnData.purchaseOrderInfoDTOList" :key="index">
          <div class="head-title">
            <i class="iconfont iconjinridingdanshu myicon"></i>
            <span>数据列表</span>
            <span>&nbsp;&nbsp;采购单编号：</span>
            <span>{{Data.purchaseOrderNo}}</span>
            <span>&nbsp;&nbsp;总金额：</span>
            <span>￥{{Data.amount}}</span>
            <span>&nbsp;&nbsp;是否含税：</span>
            <span>{{Data.includeTaxText}}</span>
            <span>&nbsp;&nbsp;配送方式：</span>
            <span>{{Data.deliveryTypeText}}</span>
            <span v-if="Data.deliveryTypeText=='厂直'&&Data.cargoReceiptFileIdList!=null" style="color: #399;cursor: pointer" @click="downloadFile(Data.cargoReceiptFileIdList)">&nbsp;&nbsp;下载到货凭证</span>
          </div>
          <el-table
            :data="Data.purchaseOrderItemDTOList"
            border
            style="width: 100%"
            max-height="300">
            <el-table-column
              prop="skuNo"
              label="商品编号" align="center">
            </el-table-column>
            <el-table-column
              prop="skuName"
              label="商品名称" align="center">
            </el-table-column>
            <el-table-column
              prop="skuModel"
              label="规格" align="center">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="单位" align="center">
            </el-table-column>
            <el-table-column
              prop="currentQty"
              label="结算数量" align="center">
            </el-table-column>
            <el-table-column
              prop="currentPrice"
              label="结算单价" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.currentPrice != 0 ">￥</span>
                {{ scope.row.currentPrice}}
              </template>
            </el-table-column>
            <el-table-column
              prop="taxText"
              label="税率" align="center">
            </el-table-column>
            <el-table-column
              prop="currentTaxRateText"
              label="本次结算税率" align="center">
            </el-table-column>
            <el-table-column
              prop="taxDifferential"
              label="税差" align="center">
            </el-table-column>
            <el-table-column
              prop="invoiceNo"
              label="关联发票号码" align="center">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="小计" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.amount != 0 ">￥</span>
                {{ scope.row.amount}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>应付账款记录</span>
      </div>
      <el-table
        :data="returnData1"
        border
        style="width: 100%"  >
        <el-table-column
          label="操作者" align="center">
          <template slot-scope="scope">
            {{scope.row.userInfo.userFullName}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间" align="center">
          <template slot-scope="scope">
            {{scope.row.paymentTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="付款金额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.accountPaid!=0&&scope.row.accountPaid">￥</span>
            {{scope.row.accountPaid}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="button-box">
      <el-button type="primary"  @click="close({name:'PurchasePaymentDetails', to: {name:'PurchasePaymentsList', params:{isUpdate:true}}})">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>
</template>

<script>
  import {
    getPurchasePaymentDetails,
    getPaymentExportBill
  } from '@/api/purchase/PurchasePaymentsList'
  export default {
    inject: ["reload", "close"],
    name: "PurchasePaymentDetails",
    data(){
      return{
        RecordId:'',
        returnData1:[{
          "accountPaid": 0,
          "paymentTime": "2019-05-21T05:51:56.731Z",

          "userInfo": {
            "departmentId": 0,
            "departmentName": "string",
            "id": 0,
            "mobile": "string",
            "organizationId": 0,
            "organizationName": "string",
            "realName": "string",
            "userFullName": "string",
            "userPosts": [
              {
                "departmentId": 0,
                "departmentName": "string",
                "organizationId": 0,
                "organizationName": "string"
              }
            ]
          }

        }],
        returnData:
          {
            purchaseAccountPayableDTO: {
              accountPayable: '',
              accountPayableNo: "",
              billAmount: '',
              cancelReason: "",
              createTime: "",
              invoiceAmountReceived: '',
              status: "",
              statusText: "",
              totalAccountPaid: '',
            },
            supplierBizDTO: {
              supplierName: null,
              bank: null,
              accountName: null,
              accountNo: null,
              id: null
            },
            purchaseOrderInfoDTOList:[],
            purchasePaymentRecordItemDTOList: [
              {
                "accountPaid": 0,
                "paymentTime": "2019-05-21T05:51:56.731Z",

                "userInfo": {
                  "departmentId": 0,
                  "departmentName": "string",
                  "id": 0,
                  "mobile": "string",
                  "organizationId": 0,
                  "organizationName": "string",
                  "realName": "string",
                  "userFullName": "string",
                  "userPosts": [
                    {
                      "departmentId": 0,
                      "departmentName": "string",
                      "organizationId": 0,
                      "organizationName": "string"
                    }
                  ]
                }
              }
            ],
          },
      }
    },
    created(){
      this.gitDatallis()
    },
    activated(){
      if(this.RecordId != this.$route.query.id){
        this.gitDatallis()
      }
    },
    methods:{
      gitDatallis(){
        this.RecordId = this.$route.query.id
        getPurchasePaymentDetails(
          this.$route.query.id,
        )
          .then((res) => {
            console.log(res);
            this.returnData = res.data;
            this.returnData1 = res.data.purchasePaymentRecordItemDTOList;
            console.log(this.returnData1,11111111)
            console.log(this.returnData,222222)
          }).catch(err => {
          console.log(err)
        })
      },
      getoutdata(id){
        id = this.$route.query.id
        // let href =
        //   "/api/purchase-service/purchase/payable/?id=" +
        //   id +
        //   "/export&access_token=" +
        //   this.$auth.token;
        // window.open(href, "_blank");
        getPaymentExportBill(id).then(res => {
          console.log(res);
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }

        });
      },
      downfile(id) {
        let href =
          "/api/file-service/file/download?id=" +
          id +
          "&access_token=" +
          this.$auth.token;
        window.open(href, "_blank");
      },
      // downloadFile(row){
      //   console.log(row,'row')
      //   let aa=row.split(',')
      //   console.log(aa,666)
      //   aa.forEach(Data=>{
      //     let href = `/api/file-service/file/download?id=${Data}&access_token=${this.$auth.token}`
      //     window.open(href,'blank');
      //   })
      // },
      downloadFile(row){
        console.log(row)
        // row.forEach(item=>{
        //   let href = `/api/file-service/file/download?id=${item}&access_token=${this.$auth.token}`
        //   window.open(href,'blank');
        // })
        row.forEach(item=>{
          let href = `/api/file-service/file/download?id=${item}&access_token=${this.$auth.token}`
          window.open(href);
          console.log(item,444)
        })

      },
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
  .wrapper{
    width: 100%;
    padding-top:20px;
    .head {
      border: 1px solid #e4e4e4;
      margin-bottom: 20px;
      ul{
        li{
          display: flex;
          .slice-info{
            width: 350px;
            display: flex;
            padding:20px 0;
          }
          .slice-info-left{
            width: 45%;
            color: #666;
            text-align: right;

          }
          .slice-info-right{
            width: 45%;
            color: #999;
            text-align:left;
            word-wrap: break-word;
          }
        }
      }

    }
  }

  .body{
    border: 1px solid #e4e4e4;

  }
  .body1{
    width: 98%;
    margin: 0 auto;
    /*border: 1px solid #e4e4e4;*/
    .head-title{
      border: 1px solid #e4e4e4;
    }
  }
  .head-title{
    width:100%;
    background-color:#f3f3f3;
    height: 50px;
    padding-left: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #e4e4e4;
    .listBoxRight {
      line-height: 50px;
      float: right;
      margin-right: 10px;

      .el-button {
        line-height: 10px;
        width: 80px;
        height: 30px;
      }
    }
  }
  .myicon{
    font-weight: bold;
    color:#666;
    font-size: 20px;
    line-height: 50px;
  }



  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .button-box{
    width: 90%;
    margin: 20px auto 50px;
    display: flex;
    justify-content: flex-end;
  }
</style>
