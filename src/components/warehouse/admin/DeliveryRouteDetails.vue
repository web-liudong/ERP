<template>
  <div class="wrapper">
    <div class="head">
      <div class="head-title">
        <i class="iconfont iconsousuo myicon"></i>
        <span>基本信息：</span>
      </div>
      <div>
        <div>
          <span class="slice-info"> <i class="slice-info-left">线路ID</i> : <i class="slice-info-right">{{tableData.id}}</i></span>
          <span class="slice-info"> <i class="slice-info-left">线路名称</i> : <i class="slice-info-right">{{tableData.name}}</i></span>
          <span class="slice-info"> <i class="slice-info-left">备注</i> : <i class="slice-info-right">{{tableData.remarks}}</i></span>
          <span class="slice-info"> <i class="slice-info-left">线路状态</i> : <i class="slice-info-right">{{tableData.statusName}}</i></span>
        </div>
      </div>
    </div>

    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>街道信息</span>
      </div>
      <div style="width: 80%;margin:10px auto;">
        <div >
          <el-table
            :data="tableData1"
            border
            style="width: 100%"
            max-height="350"
            size="small">
            <el-table-column
              label="序号"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span v-if="">{{ 2*(scope.$index+1)-1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关联街道信息"
              align="center">
              <template slot-scope="scope">
                {{scope.row.accountPayableNo0.provinceName}}>
                {{scope.row.accountPayableNo0.cityName}}>
                {{scope.row.accountPayableNo0.countyName}}>
                {{scope.row.accountPayableNo0.streetName}}
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.accountPayableNo1.provinceName">{{ 2*(scope.$index+1)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关联街道信息"
              align="center">
              <template slot-scope="scope"  v-if="scope.row.accountPayableNo1.provinceName">
                {{scope.row.accountPayableNo1.provinceName}}>
                {{scope.row.accountPayableNo1.cityName}}>
                {{scope.row.accountPayableNo1.countyName}}>
                {{scope.row.accountPayableNo1.streetName}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu myicon"></i>
        <span>操作日志</span>
      </div>
      <el-table
        :data="tableData.operationLogs"
        border
        style="width: 100%"  >
        <el-table-column
          label="操作者" align="center">
          <template slot-scope="scope">
            <!--{{scope.row.userInfo.organizationName}}>-->
            <!--{{scope.row.userInfo.departmentName}}>-->
            <!--{{scope.row.userInfo.realName}}-->
            {{scope.row.userInfo.userFullName}}
          </template>
        </el-table-column>
        <el-table-column

          label="操作项" align="center">
          <template slot-scope="scope">
            {{scope.row.operation }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间" align="center">
          <template slot-scope="scope">
            {{scope.row.operationTime | formatDate}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="button-box">
      <el-button type="primary"  v-close>关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>
</template>

<script>
  import {
    postDeliveryRoute,
    putDeliveryRoute,
    deleteDeliveryRoute,
    putDeliveryRouteAvailable,
    putDeliveryRouteForbidden,
    getDeliveryRouteDetail,
    getDeliveryRouteEdit,
    getDeliveryRouteStreet,
    postDeliveryRouteImport,
    postDeliveryRouteImportList,
    postDeliveryRouteList,
    getDeliveryRouteStatus,
    putDeliveryRouteStreet
  } from '@/api/warehouse/deliveryRoute'
  import {
    getPurchasePaymentDetails,
  } from '@/api/purchase/PurchasePaymentsList'
    export default {
        name: "DeliveryRouteDetails",
      data(){
          return{
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
            tableData:[],
            tableData1:[
              // {
              //
              //   accountPayableNo0:{
              //     cityId: 0,
              //     cityName: "1市",
              //     countyId: 0,
              //     countyName: "1县",
              //     id: 0,
              //     provinceId: 0,
              //     provinceName: "1省",
              //     streetId: 0,
              //     streetName: "1街"
              //
              //   },
              //   accountPayableNo1:
              //     {
              //       cityId: 0,
              //       cityName: "2市",
              //       countyId: 0,
              //       countyName: "2县",
              //       id: 0,
              //       provinceId: 0,
              //       provinceName: "2省",
              //       streetId: 0,
              //       streetName: "2街"
              //     }
              //   ,
              // },
              // {
              //
              //   accountPayableNo0:{
              //     cityId: 0,
              //     cityName: "1市",
              //     countyId: 0,
              //     countyName: "1县",
              //     id: 0,
              //     provinceId: 0,
              //     provinceName: "1省",
              //     streetId: 0,
              //     streetName: "1街"
              //
              //   },
              //   accountPayableNo1:
              //     {
              //       cityId: 0,
              //       cityName: "2市",
              //       countyId: 0,
              //       countyName: "2县",
              //       id: 0,
              //       provinceId: 0,
              //       provinceName: "",
              //       streetId: 0,
              //       streetName: "2街"
              //     },
              // },
            ]


          }
      },
      created(){
        getDeliveryRouteDetail(
          this.$route.query.id,
          )
          .then((res) => {
            console.log(res);
            this.tableData = res.data;
            this.branch();
          }).catch(err => {
            console.log(err)
          })

      },
      methods:{
        branch(){
          let j=0;
          for(var  i=0;i<this.tableData.streets.length;i++){
            if(i%2 ==0){
              this.tableData1[j].accountPayableNo0 = this.tableData[i].streets
            }
            if(i%2 ==1){
              this.tableData1[j].accountPayableNo1 = this.tableData[i].streets
            }
            j++
          }
          if(this.tableData.streets.length%2==1){
            this.tableData1[(this.tableData.streets.length-1)/2].accountPayableNo1.provinceName = ''

          }
          console.log(this.tableData.streets.length,1231234)
        },
        getoutdata(){

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
  }


  .head {
    border: 1px solid #e4e4e4;
    margin-bottom: 20px;

    table {
      width: 90%;
      margin: 20px auto;

      td, th {
        font-size: 14px;
        height: 53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      th {
        width: 15%;
        color: #303133;
        text-align: right;


      }

      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;

      }
    }
  }
  .body{
    border: 1px solid #e4e4e4;
  }
  .body1{
    width: 98%;
    margin: 0 auto;
    border: 1px solid #e4e4e4;
  }
  .head-title{
    width:100%;
    background-color:#f3f3f3;
    height: 50px;
    padding-left: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #e4e4e4;
  }
  .myicon{
    font-weight: bold;
    color:#666;
    font-size: 20px;
    line-height: 50px;
  }
  .slice-info{
    width: 350px;
    display: inline-block;
    padding:20px 0;
  }
  .slice-info-left{
    width: 45%;
    color: #666;
    text-align: right;
    display: inline-block;
  }
  .slice-info-right{
    width: 45%;
    color: #999;
    text-align:left;
    display: inline-block;
    word-wrap: break-word;
    word-break: break-all;
    vertical-align:top;
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
