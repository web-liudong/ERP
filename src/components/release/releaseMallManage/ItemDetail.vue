
<!--商城项目详情-->
<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1" v-if="tableDataMis">
        <tr>
          <th>ID：</th>
          <td>{{tableDataMis.id}}</td>
          <th>项目名称：</th>
          <td>{{tableDataMis.projectName}}</td>
        </tr>
        <tr>
          <th>项目发布负责人：</th>
          <td>{{tableDataMis.publisherName}}</td>
          <th>项目乙方负责人：</th>
          <td>{{tableDataMis.partyBPrincipalName}}</td>
        </tr>
        <tr>
          <th>商品数据推送选项：</th>
          <td>{{tableDataMis.skuPushOptions}}</td>
          <th>开发商：</th>
          <td>{{tableDataMis.partyCName}}</td>
        </tr>
        <tr>
          <th>发票数据推选项：</th>
          <td>{{tableDataMis.invoicePushOptions}}</td>
          <th>订单数据推送选项：</th>
          <td>{{tableDataMis.orderPushOptions}}</td>
        </tr>
        <tr>
          <th>是否需要品目对应：</th>
          <td>
            {{tableDataMis.needCategoryMatch|bbb}}
          </td>
          <th>退换货数据推送选项：</th>
          <td>{{tableDataMis.refundPushOptions}}</td>
        </tr>
        <tr>
          <th>是否需要品牌对应：</th>
          <td>
            {{tableDataMis.needBrandMatch|bbb}}
          </td>
          <th>是否需要参数对应：</th>
          <td>{{tableDataMis.needAttributeMatch|bbb}}</td>
        </tr>
        <tr>
          <th>地址编码类型：</th>
          <td>
            {{tableDataMis.addressCodeTypeName}}
          </td>
          <th>商城描述信息：</th>
          <td>{{tableDataMis.description}}</td>
        </tr>

        <tr>
          <th>第三方接口文档版本号：</th>
          <td>
            {{tableDataMis.partyCApiVersion}}
          </td>
          <th>第三方发票相关接口url：</th>
          <td>{{tableDataMis.partyCInvoiceUrl}}</td>
        </tr>
           <tr>
          <th>第三方商城url：</th>
          <td>
            {{tableDataMis.partyCMallUrl}}
          </td>
          <th>第三方订单相关接口url：</th>
          <td>{{tableDataMis.partyCOrderUrl}}</td>
        </tr>
        <tr>
          <th>第三方接口url：</th>
          <td>{{tableDataMis.partyCUrl}}</td> 
          <th>第三方商品相关接口url：</th>
          <td>{{tableDataMis.partyCSkuUrl}}</td>
        </tr>
        <tr>
          <th>第三方获取token接口url：</th>
          <td>
            {{tableDataMis.partyCTokenUrl}}
          </td>
          <th>第三方退换货相关接口url：</th>
          <td>
            {{tableDataMis.partyCReturnOrderUrl}}
          </td>
        </tr>
        <tr>
          <th>第三方提供账号：</th>
          <td>
            {{tableDataMis.partyCOfferedLoginName}}
          </td>
          <th>第三方提供私钥：</th>
          <td>{{tableDataMis.partyCOfferedClientSecret}}</td>
        </tr>
        <tr>
          <th>领先提供账号：</th>
          <td>
            {{tableDataMis.lxwlOfferedLoginName}}
          </td>
          <th> 第三方提供密码：</th>
          <td>{{tableDataMis.partyCOfferedPassword}}</td>
        <tr>
          <th>领先提供密钥：</th>
          <td colspan="3">
            {{tableDataMis.lxwlOfferedPassword}}
          </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i></i>操作详情</span>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userName"
          label="操作者"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作描述"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            {{scope.row.operation}}
            <br/>
            {{scope.row.operationDescription}}
          </template>
        </el-table-column>
      </el-table>
      <div class="goTopBox">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import {getGoodsDetail} from '@/api/goodsManage'
  import {mallGoodsDetail,getDetailData} from '@/api/release/mallProjectManage'
  import '@/components/goods/addGoods/FillParams.less'
  import {timeFormat} from '@/utils/index'

  export default {
    inject:['close'],
    name:'ItemDetail',
    data(){
      return {
        deatailID:null,
        //商城id
        // mallID:this.$route.query.mallID,
        tableDataMis: null,
        tableData: null,
        brandName:'',
        data:null,
      }
    },
    created(){
      this.deatailID=this.$route.query.mallId;
      this.getDetailData();
      // this.getBrandName()
    },
    activated(){
     if(this.deatailID!=this.$route.query.mallId){
       this.deatailID=this.$route.query.mallId;
       this.getDetailData()
     }
    },
    filters:{
      aaa(val){
        return val==0?val='已启用':val==1?val='待启用':val==2?val='草稿':val==3?val='待审核':val==4?val='已驳回':val==5?val='禁用':val==6?val='已上柜':'';
      },
      bbb(val){
        return val===false?val='不需要':val='需要';
      }

    },
    methods: {
      getDetailData(){
        getDetailData(this.deatailID).then(res=>{
          console.log(res.data);
          this.tableDataMis=res.data;
          this.tableData=res.data.mallInfoOperationLogDTOList;
          for (let i = 0; i < this.tableData.length; i++) {
            let  item = this.tableData[i];
            item.operationTime=timeFormat(item.operationTime)
          }
        })
      },
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
    .detaillTable{
      border: 1px solid #d1d1d1;
      .detaillTopBox{
        height:50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span{
          line-height:50px;
          margin-left:10px;
          i{
          }
        }
      }
      table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          color:#303133;
          text-align: right;
          width:20%;
          i{
            color:red;
          }
        }
        td{
          color: #666666;
          text-align: left;
          padding-left:10px;
          width:30%;
        }
      }
    }
    .bannerBox{
      border: 1px solid #d1d1d1;
      .headerBannerBox{
        height:50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span{
          line-height:50px;
          margin-left:10px;
          i{
          }
        }
      }
      .mainBannerBox{
        margin-top: 20px;
        span{
          margin-left: 80px;
          i{
            color: red;
          }
        }
        ul{
          li{
            float: left;
            margin-left: 20px;
            img{
              display: block;
              width: 100px;
              height: 100px;
            }
          }
          li:nth-child(1){
            margin-left: 200px;
          }
        }
      }
      .detailBannerBox{
        margin-bottom: 20px;
        span{
          margin-left: 80px;
          i{
            color: red;
          }
        }
        ul{
          li{
            float: left;
            margin-left: 20px;
            img{
              display: block;
              width: 100px;
              height: 100px;
            }
          }
          li:nth-child(1){
            margin-left: 200px;
          }
        }
      }
    }
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;
      .detaillTopBox{
        height:50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span{
          line-height:50px;
          margin-left:10px;
        }
      }
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .goTopBox{
        margin-right: 56px;
        .el-button {
          float: right;
          margin:10px 20px;
        }
      }
    }
  }


</style>












