<template>
  <div class="form-wrapper">
    <addhead headname="基本信息" iconName="iconjinridingdanshu"></addhead>
    <table border="1" v-if="biddingInfo.quoteBasicInfoDTO!=undefined">
      <tr>
        <th>竞价信息ID：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.biddingNo}}</td>
        <th>外部竞价编号：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.exteriorNo}}</td>
      </tr>
      <tr>
        <th>竞价名称：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.biddingName}}</td>
        <th>起拍价：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.startPrice}}</td>
      </tr>
      <tr>
        <th>项目：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.projectName}}</td>
        <th>客户：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.customerNameCustomize	}}</td>
      </tr>
      <tr>
        <th>采购人：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.purchaserName}}</td>
        <th>采购人联系方式：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.purchaserPhone}}</td>
      </tr>
      <tr>
        <th>收货人：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.recipientName}}</td>
        <th>收货人联系方式</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.recipientPhone}}</td>
      </tr>
      <tr>
        <th>收货地址：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.detailAddressLine}}</td>
        <th>期望配送日期：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.expectedDeliveryDate}}</td>
      </tr>
      <tr>
        <th>竞价开始时间：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.startTime}}</td>
        <th>竞价截止时间：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.endTime}}</td>
      </tr>
      <tr>
        <th>报价截止时间：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.priceQuoteEndTime}}</td>
        <th>创建时间：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.createTime}}</td>
      </tr>
      <tr>
        <th>付款日期：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.payDate}}</td>
        <th>报价剩余时间：</th>
        <td>{{btime}}</td>
      </tr>
      <tr>
        <th>付款方式：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.payType}}</td>
        <th>竞价剩余时间：</th>
        <td>{{jtime}}</td>
      </tr>
      <tr>
        <th>报备状态：</th>
        <td>{{biddingInfo.quoteBasicInfoDTO.reportPreparedStatusName}}<el-button v-if="biddingInfo.quoteBasicInfoDTO.reportPreparedStatus!=0" type="text" size="small" @click="goReportDetail(biddingInfo.quoteBasicInfoDTO.reportPreparedId)"  style="margin-left: 12px;">查看报备详情</el-button></td>
        <th></th>
        <td></td>
      </tr>
      <tr>
        <th>竞价备注：</th>
        <td colspan="3">{{biddingInfo.quoteBasicInfoDTO.memo}}</td>
      </tr>
    </table>
    <addhead headname="商品信息" iconName="iconjinridingdanshu"></addhead>
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
    <addhead headname="报价信息"></addhead>
    <table border="1" v-if="biddingInfo.quoteServerDetailDTO!=undefined">
      <tr>
        <th>服务方：</th>
        <td>{{biddingInfo.quoteServerDetailDTO.serverName}}</td>
        <th> <span>*</span>是否已报价：</th>
        <td>{{biddingInfo.quoteServerDetailDTO.priceQuoteStatusName}}</td>
      </tr>
      <tr>
        <th><span>*</span>起拍价：</th>
        <td>{{biddingInfo.quoteServerDetailDTO.startPrice}}</td>
        <th>报价：</th>
        <td>{{biddingInfo.quoteServerDetailDTO.priceQuote}}</td>
      </tr>
      <tr>
        <th>报价备注：</th>
        <td colspan="3">{{biddingInfo.quoteServerDetailDTO.priceQuoteMemo}}</td>
      </tr>
    </table>
    <!--<addhead headname="竞价结果" iconName="iconjinridingdanshu"></addhead>
    <table border="1">
      <tr>
        <th>竞价状态：</th>
          <td>{{biddingInfo.quoteResultDetailDTO.statusName}}</td>
          <th> <span>*</span>竞价结果：</th>
          <td>{{biddingInfo.quoteResultDetailDTO.biddingResultName}}</td>
      </tr>
      <tr>
          <th><span>*</span>中标公司：</th>
          <td>{{biddingInfo.quoteResultDetailDTO.winningBiddingCompany}}</td>
          <th>中标价：</th>
          <td>{{biddingInfo.quoteResultDetailDTO.winningPrice}}</td>
        </tr>
        <tr>
          <th>结果跟踪：</th>
          <td>{{biddingInfo.quoteResultDetailDTO.resultStatusName}}<el-button type="text" size="small" @click="goOrderDetail()">查看订单详情</el-button></td>
          <th></th>
          <td></td>
        </tr>
        <tr>
          <th>结果备注：</th>
          <td colspan="3">{{biddingInfo.quoteResultDetailDTO.resultMemo}}</td>
        </tr>
    </table>-->
    <addhead headname="操作详情" iconName="iconjinridingdanshu"></addhead>
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
    	<el-button type="primary" @click="dialogFormVisible=true">报价</el-button>
      <el-button type="primary" @click="closed()">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
    <el-dialog title="报价" :visible.sync="dialogFormVisible" @close="offerClose()">
		  <el-form :model="form" :rules="rules" ref="form"  label-width="80px">
		  	<el-form-item label="起拍价"  v-if="biddingInfo.quoteBasicInfoDTO!=undefined">
		     {{biddingInfo.quoteBasicInfoDTO.startPrice}}
		    </el-form-item> 
		  	<el-form-item label="报价"  prop="priceQuote">
		      <el-input v-model="form.priceQuote" type="number"   ></el-input>
		    </el-form-item> 
		    <el-form-item label="报价备注">
		      <el-input v-model="form.priceQuoteMemo" type="textarea" :rows="3" maxlength="200" placeholder="字数长度1~200以内" ></el-input>
		    </el-form-item>  
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
		  </div>
		</el-dialog>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {
    getDetail,
    putIncalid
  } from '@/api/biddingPrice/biddingPrice';
 
  export default {
    inject:['reload','close'],
    name:'PresentationPriceOffer',
    data() {
      return {
      	form:{
      		priceQuote:'',
      		priceQuoteMemo:'',
      	},
      	dialogFormVisible:false,
      	rules:{
      		priceQuote: [{
					required: true,
					message: '请输入报价',
					trigger: 'blur'
				},],
      	},
        biddingInfo:{
        },
        biddingId:'',
         btime:'',
        jtime:'',
        timer:null,
        fromName:''
      }
    },
    components:{
      addhead
    },
    created(){
     
    },
    activated(){
      if(this.biddingId!=this.$route.query.id){
        this.getDetail1();
      }
    },
    beforeRouteEnter(to, from, next) {
		   next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
		      vm.fromName=from.name
		    })
		  },
    destroyed(){
    	clearInterval(this.timer)
    },
    methods: {
    	offerClose(){
    		this.form={
      		priceQuote:'',
      		priceQuoteMemo:'',
      	}
    	},
    	submitForm(f) {
        this.$refs[f].validate((valid) => {
          if (valid) {
          	let formData = new FormData()
          	formData.append("priceQuote", this.form.priceQuote);
          	formData.append("priceQuoteMemo",this.form.priceQuoteMemo);
            putIncalid(this.$route.query.id,formData).then(res=>{
            		this.dialogFormVisible=true
            		this.$message({
				          message: '报价成功',
				          type: 'success'
				        });
				         setTimeout(()=>{
				        	this.close({name:'PresentationPriceOffer', to: {name:'PresentationPriceList', params:{isUpdate:true}}});
				        },1000)
            	
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getDetail1(){
         this.biddingId = this.$route.query.id;
         getDetail(this.biddingId).then(res=>{
          if(res.code=='000000'){
            this.biddingInfo=res.data;
            this.setTime(res.data.quoteBasicInfoDTO.priceQuoteEndTime,res.data.quoteBasicInfoDTO.endTime)
          }
        })
      },
       setTime(bEnd,jEnd){
      	if(this.timer){
      		clearInterval(this.timer)
      	}else{
      		this.timer = setInterval(()=>{
			      this.btime=this.intime(bEnd)
			      this.jtime=this.intime(jEnd)
      		},1000)		
      	}
      },
      intime(endTime){
  			var date = new Date();
	      var until = new Date(endTime);
	      if(date>until){
	      	return '00天00小时00分钟00秒'
	      }else{
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
	      return back
	      }
      },
      indexMethod(index){
        return index+1;
      },
      goReportDetail(id){
        this.$router({
          name: 'biddingBackupsDetail',
          query:{id:id}
        })
      },
      goOrderDetail(){
        this.$router({
          name: 'OrderDetail',
        })
      },
      must(obj){
        if (obj.columnIndex === 1 || obj.columnIndex === 6) {
          return 'must'
        }
      },
      
      closed(){
        this.close()
      },
    }
  }
</script>

<style scoped lang="less">
  .form-wrapper{
    margin-top:20px;
    border-right:1px solid #e4e4e4;
    border-left:1px solid #e4e4e4;
    border-bottom:1px solid #e4e4e4;
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
        background: #f9fafc;
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
