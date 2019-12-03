<template>
  <div class="form-wrapper">
    <addhead headname="基本信息" iconName="iconjinridingdanshu"></addhead>
    <table border="1">
      <tr>
        <th>竞价信息编号：</th>
        <td>{{biddingInfo.biddingNo}}</td>
        <th> <span>*</span>外部竞价编号：</th>
        <td>{{biddingInfo.exteriorNo}}</td>
      </tr>
      <tr>
        <th>竞价名称：</th>
        <td>{{biddingInfo.biddingName}}</td>
        <th><span>*</span>起拍价：</th>
        <td>{{biddingInfo.startPrice}}</td>
      </tr>
      <tr>
        <th><span>*</span>项目：</th>
        <td>{{biddingInfo.projectName}}</td>
        <th><span>*</span>客户：</th>
        <td>{{biddingInfo.customerNameCustomize	}}</td>
      </tr>
      <tr>
        <th>采购人：</th>
        <td>{{biddingInfo.purchaserName}}</td>
        <th>采购人联系方式：</th>
        <td>{{biddingInfo.purchaserPhone}}</td>
      </tr>
      <tr>
        <th>收货人：</th>
        <td>{{biddingInfo.recipientName}}</td>
        <th>收货人联系方式</th>
        <td>{{biddingInfo.recipientPhone}}</td>
      </tr>
      <tr>
        <th><span>*</span>收货地址：</th>
        <td>{{biddingInfo.detailAddressLine}}</td>
        <th>期望到货日期：</th>
        <td>{{biddingInfo.expectedDeliveryDate}}</td>
      </tr>
      <tr>
        <th>竞价开始时间：</th>
        <td>{{biddingInfo.startTime}}</td>
        <th><span>*</span>竞价截止时间：</th>
        <td>{{biddingInfo.endTime}}</td>
      </tr>
      <tr>
        <th><span>*</span>报价截止时间：</th>
        <td>{{biddingInfo.priceQuoteEndTime}}</td>
        <th>创建时间：</th>
        <td>{{biddingInfo.createTime}}</td>
      </tr>
      <tr>
        <th>付款日期：</th>
        <td>{{biddingInfo.payDate}}</td>
        <th>报价剩余时间：</th>
        <td>{{priceQuoteOverTime}}</td>
      </tr>
      <tr>
        <th>付款方式：</th>
        <td>{{biddingInfo.payType}}</td>
        <th>竞价剩余时间：</th>
        <td>{{ biddingOverTime}}</td>
      </tr>
      <tr>
        <th>报备状态：</th>
        <td>{{biddingInfo.reportPreparedStatusdName}}<el-button type="text" size="small" v-if="biddingInfo.reportPreparedStatus!=0" @click="goReportDetail(biddingInfo.reportPreparedId)">查看报备详情</el-button></td>
        <th></th>
        <td></td>
      </tr>
      <tr>
        <th>竞价备注：</th>
        <td colspan="3">{{biddingInfo.memo}}</td>
      </tr>
    </table>
    <addhead headname="商品信息" iconName="iconjinridingdanshu"></addhead>
    <div class="product">
      <el-table
        :data="biddingInfo.biddingSkuDTOs"
        :header-cell-class-name='must'
        border>
        <el-table-column
          type="index"
          :index="indexMethod"
          label="条目号"
          align="center" 
          min-width="150px">
        </el-table-column>
        <el-table-column
          prop="skuName"
          label="商品名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="category"
          label="分类" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="brand"
          label="品牌" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="specification"
          label="规格型号" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="qty"
          label="数量" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="备注" 
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <addhead headname="报价信息" iconName="iconjinridingdanshu"></addhead>
    <table border="1">
      <tr>
        <th><span>*</span>服务方：</th>
        <td>{{biddingInfo.serverName}}</td>
        <th>是否已报价：</th>
        <td>{{biddingInfo.priceQuoteStatusName}}</td>
      </tr>
      <tr>
        <th><span>*</span>起拍价：</th>
        <td>{{biddingInfo.startPrice}}</td>
        <th>报价：</th>
        <td>{{biddingInfo.priceQuote}}</td>
      </tr>
      <tr>
        <th>报价备注：</th>
        <td colspan="3">{{biddingInfo.priceQuoteMemo}}</td>
      </tr>
    </table>
    <addhead headname="竞价结果" iconName="iconjinridingdanshu"></addhead>
    <table border="1">
      <tr>
        <th>竞价状态：</th>
          <td>{{biddingInfo.statusName}}</td>
          <th>竞价结果：</th>
          <td>{{biddingInfo.biddingResultName}}</td>
      </tr>
      <tr>
          <th>中标公司：</th>
          <td>{{biddingInfo.winningBiddingCompany}}</td>
          <th>中标价：</th>
          <td>{{biddingInfo.winningPrice}}</td>
      </tr>
        <tr>
          <th>结果跟踪：</th>
          <td>{{biddingInfo.resultStatusName}}<el-button type="text" size="small" v-if="biddingInfo.resultStatus!=0&&biddingInfo.resultStatus!=1" @click="goOrderDetail(biddingInfo.orderId)">查看订单详情</el-button></td>
          <th></th>
          <td></td>
        </tr>
        <tr>
          <th>结果备注：</th>
          <td colspan="3">{{biddingInfo.resultMemo}}</td>
        </tr>
    </table>
    <addhead headname="操作详情" iconName="iconcaozuoxiangqing"></addhead>
    <el-table
      :data="biddingInfo.biddingOperationLogDTOs	"
      border>
      <el-table-column
        label="操作者" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.userInfo.userFullName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operationTime"
        label="操作时间" align="center">
      </el-table-column>
      <el-table-column
        label="操作描述" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.operation}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="button-box">
      <el-button type="primary" @click="closed">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'

  import {
    getDetailInfo
  } from '@/api/biddingPrice/biddingPriceMessage';

  import {countdownTime} from "@/utils";
  
  export default {
    inject:['close'],
    name:'biddingPriceMessageDetail',
    data() {
      return {
        countTime:null,
        countTime2:null,
        biddingOverTime:'',
        priceQuoteOverTime:'',
        biddingInfo:{
          addressLine: '',
          biddingName: '',
          biddingNo: '',
          biddingOperationLogDTOs: [
            {
              operation:'',
              operationTime: '',
              userId:'',
              userInfo: {
                departmentId: 0,
                departmentName:'',
                id:'',
                mobile:'',
                organizationId:'',
                organizationName:'',
                realName:'',
                userFullName: '',
                userPosts: [
                  {
                    departmentId:'',
                    departmentName:'',
                    organizationId:'',
                    organizationName:''
                  }
                ]
              }
            }
          ],
          biddingResultName:'',
          biddingSkuDTOs: [
            {
              biddingPreparedId:'',
              brand: '',
              category:'',
              memo:'',
              price:'',
              qty:'',
              skuName:'',
              specification:'',
              unit:''
            }
          ],
          createTime:'',
          customerNameCustomize:'',
          endTime: '',
          expectedDeliveryDate:'',
          exteriorNo:'',
          id:'',
          memo: '',
          orderId:'',
          payDate:'',
          payType:'',
          priceQuote:'',
          priceQuoteEndTime:'',
          priceQuoteMemo:'',
          priceQuoteStatusName:'',
          projectId:'',
          projectName:'',
          purchaserName:'',
          purchaserPhone:'',
          recipientName:'',
          recipientPhone:'',
          reportPreparedId:'',
          resultMemo:'',
          resultStatusName:'',
          resultStatus:'',
          serverId:'',
          serverName:'',
          startPrice:'',
          startTime: '',
          statusName: '',
          winningPrice:'',
          reportPreparedStatus:'',
          reportPreparedStatusdName:'',
          winningBiddingCompan:''
        },
        biddingId:'',
        timeout:null,
      }
    },
    components:{
      addhead
    },
    created(){
      this.getDetail();
    },
    activated(){
      if(this.biddingId!=this.$route.query.id){
        this.getDetail(this.biddingId);
      }
    },
    methods: {
      getDetail(){
         this.biddingId = this.$route.query.id;
         getDetailInfo(this.biddingId).then(res=>{
          if(res.code=='000000'){
            this.biddingInfo=res.data;
            this.changTime(res.data.priceQuoteEndTime,res.data.endTime,res.data.sysDateTime);
          }
        })
      },
      changTime(priceQuoteEndTime,endTime,sysDateTime){
        this.countTime=new countdownTime();
        this.countTime2=new countdownTime();
        this.countTime.startUp(priceQuoteEndTime,sysDateTime,(val)=>{
          if(val.indexOf('-')>-1){
            this.priceQuoteOverTime='00天00小时00分钟00秒';
          }else{
            this.priceQuoteOverTime=val;
          }
        });
        this.countTime2.startUp(endTime,sysDateTime,(val)=>{
          if(val.indexOf('-')>-1){
             this.biddingOverTime='00天00小时00分钟00秒';
          }else{
             this.biddingOverTime=val;
          }
         
        });
      },
      computeTime(endTime){
        // 获取现在的时间
        var date = new Date();
        var until = new Date(endTime);
        // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
        var days = (until - date)/1000/3600/24; 
        // 下面都是简单的数学计算 
        var day = Math.floor(days);
        var hours = (days - day)*24;
        var hour = Math.floor(hours);
        var minutes = (hours - hour)*60;
        var minute = Math.floor(minutes);
        var seconds = (minutes - minute)*60;
        var second = Math.floor(seconds);
        var back = day+'天'+hour+'小时'+minute+'分钟'+second+'秒';
        return back;
      },
      indexMethod(index){
        return index+1;
      },
      goReportDetail(id){
        this.$router.push({
          name:'myBackupsDetail',
          query:{
            id:id
          }
        })
      },
      goOrderDetail(id){
        this.$router.push({
          name:'OrderDetail',
          query:{
            id:id
          }
        })
      },
      must(obj){
        if (obj.columnIndex === 1 || obj.columnIndex === 6) {
          return 'must'
        }
      },
      closed(){
        this.close();
      },
    },
    destroyed(){
     this.countTime.shutDown();
     this.countTime2.shutDown();
    }
  }
</script>

<style scoped lang="less">
  .form-wrapper{
    margin-top:20px;
    border-right:1px solid #e4e4e4;
    border-left:1px solid #e4e4e4;
    border-bottom:1px solid #e4e4e4;
    span{
      color: red;
    }
    table{
      width:90%;
      margin:20px auto;
      td,th{
        border: 1px solid #e4e4e4;
        font-size:14px;
        height:53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th{
        padding-right:6px;
        box-sizing: border-box;
        color:#666;
        font-weight:700;
        font-size: 14px;
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
    .el-table{
      width: 90%;
      margin: 20px auto;
      border: 1px solid #e4e4e4;
     
      span{
        color:#606266;
      }
    }
    /deep/table th.must div:before {
      content:'*';
      color:#ff1818;
      margin-right: 3px;
    }
    /deep/.product{
      .el-table__body-wrapper{
        overflow: auto;
        max-height: 500px;
      }
    }
    .organization{
      width: 90%;
      margin: 20px auto;
      display: flex;
      justify-content: space-between;
      .organization-left{
        width: 30%;
        /*height:250px;*/
        /*overflow: auto;*/
        .organization-left-head{
          width: 100%;
          border: 1px solid #e4e4e4;
          background-color: #f3f3f3;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-tree{
          width: 100%;
          height: 250px;
          overflow: auto;
        }
      }
      .organization-right{
        width: 60%;
        height:250px;
        .organization-left-head{
          width: 100%;
          border: 1px solid #e4e4e4;
          background-color: #f3f3f3;
          padding: 10px;
          box-sizing: border-box;
        }
        table{
          width: 100%;
          height: 250px;
          margin: 0;
        }
      }
    }
    .button-box{
      width: 90%;
      margin: 20px auto 50px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
