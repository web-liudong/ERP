<template>
  <div class="detailBox">
    <div class="leftBox">
      <span>
        <i class="iconfont iconcaidan"></i>基本信息：
      </span>
    </div>
    <table border="1" class="taa" :data="tableData">
      <tr>
        <th>报备信息ID：</th>
        <td>{{tableData.reportPreparedNo}}</td>
        <th>外部竞价编号：</th>
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
        <td colspan="3">
          <template>
            {{tableData.statusName}}
            <el-button
              type="text"
              size="small"
              @click="goReDetail(tableData.biddingId)"
              v-if="$authorities.presentationPriceDetail"
              v-show="tableData.status==2"
              style="margin-left:10px"
            >查看报价详情</el-button>
          </template>
        </td>
      </tr>
      <tr>
        <th>报价备注：</th>
        <td colspan="3">{{tableData.memo}}</td>
      </tr>
    </table>
    <div class="leftBox">
      <span>
        <i class="iconfont iconcaidan"></i>商品信息：
      </span>
    </div>
    <el-table :data="tableData.skuItemParams" border class="o" max-height="500">
      <el-table-column label="条目号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="skuName" label="商品名称"></el-table-column>
      <el-table-column align="center" prop="category" label="分类"></el-table-column>
      <el-table-column align="center" prop="brand" label="品牌"></el-table-column>
      <el-table-column align="center" prop="specification" label="规格型号"></el-table-column>
      <el-table-column align="center" prop="unit" label="单位"></el-table-column>
      <el-table-column align="center" prop="qty" label="数量"></el-table-column>
      <el-table-column align="center" prop="price" label="单价"></el-table-column>
      <el-table-column align="center" prop="memo" label="备注"></el-table-column>
    </el-table>
    <div class="leftBox">
      <span>
        <i class="iconfont iconcaidan"></i>操作详情：
      </span>
    </div>
    <el-table class="o" max-height="500" border :data="tableData.operationLogs">
      <el-table-column align="center" prop="userInfo.userFullName" label="操作者"></el-table-column>
      <el-table-column align="center" prop="operationTime" label="操作时间"></el-table-column>
      <el-table-column align="center" prop="operation" label="操作描述"></el-table-column>
    </el-table>
    <div class="bottom">
      <el-button
        type="primary"
        @click="close();"
        style="margin-left: 120px;"
      >关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { reporeDetail } from "@/api/biddingMyReportPrepared";
export default {
  name: "myBackupsDetail",
  inject: ["reload", "close"], //注入依赖
  components: {
    addhead
  },
  data() {
    return {
      tableData: {}
    };
  },
  activated() {
    if (this.id != this.$route.query.id) {
      this.getDetail();
    }
  },
  created() {},
  mounted() {},
  methods: {
    goReDetail(id) {
      this.$router.push({
        name: "PresentationPriceDetail",
        query: { id: id }
      });
    },
    getDetail() {
      reporeDetail(this.$route.query.id).then(res => {
        if ((res.code = "000000")) {
          this.tableData = res.data;
        }
        console.log(res.data);
      });
    }
  }
};
</script>
<style scoped lang='less'>
.detailBox {
  border: 1px solid #e4e4e4;
  margin-top: 10px;

  .bottom {
    width: 90%;
    margin: 20px auto 20px;
    display: flex;
    justify-content: flex-end;
  }
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

.leftBox {
  height: 50px;
  line-height: 50px;
  background-color: #f3f3f3;
  i {
    margin-right: 5px;
  }
  span {
    font-size: 16px;
    margin-left: 10px;
    color: #303133;
  }
}
</style>