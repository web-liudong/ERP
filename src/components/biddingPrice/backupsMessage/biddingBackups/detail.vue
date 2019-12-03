<template>
  <div class="detailBox">
    <addhead headname="基本信息" style="margin-bottom: 10px;"></addhead>
    <table border="1" class="taa" :data="tableData">
      <tr>
        <th>报备信息ID：</th>
        <td>{{tableData.reportPreparedNo}}</td>
        <th>
          外部竞价编号：
        </th>
        <td>{{tableData.exteriorNo}}</td>
      </tr>
      <tr>
        <th>创建人：</th>
        <td>{{tableData.createUserName}}</td>
        <th>创建时间：</th>
        <td>{{tableData.createTime}}</td>
      </tr>
      <tr>
        <th>项目：</th>
        <td>{{tableData.projectName}}</td>
        <th>客户：</th>
        <td>{{tableData.customerNameCustomize}}</td>
      </tr>
      <tr>
        <th>采购人：</th>
        <td>{{tableData.purchaserName}}</td>
        <th>采购人联系方式：</th>
        <td>{{tableData.purchaserPhone}}</td>
      </tr>
      <tr>
        <th>收货人：</th>
        <td>{{tableData.recipientName}}</td>
        <th>收货人联系方式：</th>
        <td>{{tableData.recipientPhone}}</td>
      </tr>
      <tr>
        <th>收货地址：</th>
        <td>{{tableData.detailAddressLine}}</td>
        <th>报价：</th>
        <td>{{tableData.priceQuote}}</td>
      </tr>
      <tr>
        <th>状态：</th>
        <td colspan="3">{{tableData.statusName}}
        	<router-link v-if="tableData.status==2||tableData.status==1" :to="{path:'/biddingPrice/PresentationPriceList/detail',query:{id:tableData.biddingId}}">
        		<el-button type="text" 
        		 size="small" 
        		style="margin-left: 12px;">
        		查看报价详情
        	</el-button>
        	</router-link>
        	
        </td>
      </tr>
      <tr>
        <th>报价备注：</th>
        <td colspan="3">{{tableData.memo}}</td>
      </tr>
    </table>
    <addhead headname="商品信息" style="margin-bottom: 10px;"></addhead>
    <el-table :data="tableData.skuItemParams" border class="o" max-height="500">
      <el-table-column label="条目号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="skuName" label="商品名称">
         
      </el-table-column>
      <el-table-column align="center" prop="category" label="分类"></el-table-column>
      <el-table-column align="center" prop="brand" label="品牌"></el-table-column>
      <el-table-column align="center" prop="specification" label="规格型号"></el-table-column>
      <el-table-column align="center" prop="unit" label="单位"></el-table-column>
      <el-table-column align="center" prop="qty" label="数量"></el-table-column>
      <el-table-column align="center" prop="price" label="单价"></el-table-column>
      <el-table-column align="center" prop="memo" label="备注"></el-table-column>
    </el-table>
    <addhead headname="操作详情" style="margin-bottom: 10px;"></addhead>
    <el-table class="o" max-height="500" border :data="tableData.operationLogs">
      <el-table-column align="center" prop="userInfo.userFullName" label="操作者"></el-table-column>
      <el-table-column align="center" prop="operationTime" label="操作时间"></el-table-column>
      <el-table-column align="center" prop="operation" label="操作描述"></el-table-column>
    </el-table>
    <div class="bottom" style="text-align: right;box-sizing: border-box;padding: 20px 100px;">
      <el-button type="primary" @click="returns()" style="margin-left: 120px;">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {getreporeDetail} from '@/api/biddingPrice/biddingPrice'
export default {
  name: "biddingBackupsDetail",
  inject: ["reload", "close"], //注入依赖
  components: {
    addhead
  },
  data() {
    return {
      tableData: {},
       fromName:'',
       detailId:null
    };
  },
  created() {
    
  },
  beforeRouteEnter(to, from, next) {
	   next(vm=>{
	   			//  这里的vm指的就是vue实例，可以用来当做this使用
	   			console.log(from.name)
	      vm.fromName=from.name
	    })
	  },
  mounted() {},
  activated(){
    if(this.detailId!=this.$route.query.detailId){
        this.getDetail();
    }
  },
  methods: {
    getDetail(){
      this.detailId=this.$route.query.detailId
      getreporeDetail(this.detailId).then(res=>{
          if(res.code='000000'){
            this.tableData=res.data
          }
            console.log(res.data)
      })
    },
    
    returns(){
      this.close();
    },
  }
};
</script>
<style scoped lang='less'>
.detailBox {
  border: 1px solid #e4e4e4;
  margin-top: 10px;
}
table {
  width: 90%;
  margin: 20px auto;
  td,
  th {
    border: 1px solid #d1d1d1;
    font-size: 14px;
    height: 53px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  th {
    font-weight: bold;
    text-align: right;
    width: 20%;
		 background: #f9fafc;
    span {
      color: red;
    }
  }
  td {
    color: #666666;
    text-align: left;
    padding-left: 10px;
    width: 30%;
    max-width: 300px;
  }
}
.o {
  width: 90%;
  margin: 20px auto;
}
.bottom {
  margin-top: 20px;
}
</style>