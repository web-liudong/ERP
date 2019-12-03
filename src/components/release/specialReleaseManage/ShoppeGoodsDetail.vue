<template>
  <div class="detaillBox">
    <div class="detaillTable" v-if="tableData">
      <addhead headname="基本信息"></addhead>
      <table border="1">
        <tr>
          <th>商品名称：</th>
          <td colspan="3">{{tableData.name}}</td>
        </tr>
        <tr>
          <th>商品编号：</th>
          <td>{{tableData.skuNo}}</td>
          <th>状态：</th>
          <td>{{goodsStatus}}</td>
        </tr>
        <tr>
          <th>商品分类：</th>
          <td>{{tableData.firstLevelCategoryName}}>{{tableData.secondLevelCategoryName}}>{{tableData.thirdLevelCategoryName}}</td>
          <th>销售单位：</th>
          <td>{{tableData.unit}}</td>
        </tr>
        <tr>
          <th>品牌：</th>
          <td>{{tableData.brandNameCN}} <span v-if="tableData.brandNameEN">({{tableData.brandNameEN}})</span></td>
          <th>重量（含包装）：</th>
          <td>{{tableData.weight}}{{tableData.weightUnit}}</td>
        </tr>
        <tr>
          <th>{{tableData.primaryAttributeName}}：</th>
          <td>{{tableData.primaryAttributeValue}}</td>
          <th>产地：</th>
          <td>{{tableData.origin}}</td>
        </tr>
        <tr>
          <th>采购价（含税）：</th>
          <td>{{tableData.buyingPrice}}</td>
          <th>保质期：</th>
          <td>{{tableData.shelfLife}}  {{tableData.shelfLifeUnit}}</td>
        </tr>
        <tr>
          <th>友商售价：</th>
          <td>{{tableData.competingSkuPrice}}</td>
          <th>质保：</th>
          <td>{{tableData.warranty}}</td>
        </tr>
        <tr>
          <th>友商链接：</th>
          <td>{{tableData.competingSkuUrl1}}</td>
          <th>执行标准：</th>
          <td>{{tableData.executiveStandard}}</td>
        </tr>
        <tr>
          <th>建议零售价：</th>
          <td>{{tableData.sellingPrice}}</td>
          <th>条形码：</th>
          <td>{{tableData.barcode}}</td>
        </tr>
        <tr>
          <th>官网售价（含税）：</th>
          <td>{{tableData.websitePrice}}</td>
          <th>广告语：</th>
          <td>{{tableData.slogan}}</td>
        </tr>
        <tr>
          <th>包装清单：</th>
          <td>{{tableData.packingList}}</td>
          <th>集团专员：</th>
          <td>{{tableData.staffAccount}} {{tableData.staffName}}</td>
        </tr>
        <tr>
          <th>集团主管/经理：</th>
          <td>{{tableData.managerAccount}} {{tableData.managerName}}</td>
          <th>开票规格型号：</th>
          <td>{{tableData.modelOnInvoice}}</td>
        </tr>
        <tr>
          <th>开票名称：</th>
          <td>{{tableData.nameOnInvoice}}</td>
          <th>税率：</th>
          <td>{{tableData.taxRate}}</td>
        </tr>
        <tr>
          <th>税收分类名称：</th>
          <td>{{tableData.taxCodeName}}</td>
          <th>税收分类编码：</th>
          <td>{{tableData.taxCode}}</td>
        </tr>
        <tr>
          <th>非销售区域：</th>
          <td colspan="3">
            <!-- <span>直辖市-北京市-东城区</span>
            <span>直辖市-北京市-东城区</span>
            <span>直辖市-北京市-东城区</span>
            <span>直辖市-北京市-东城区</span> -->
          </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable" v-if="tableData">
      <addhead headname="参数信息"></addhead>
      <div class="table" v-for="(items,index) in tableData.skuAttributeGroupDTOList" :key="'skyGroup'+index">
        <h4 class="tit">{{items.attributeGroupName}}</h4>
        <dl>
          <template v-for="(item,index) in items.skuAttributeList">
            <dt :key="'dt-'+index">{{item.attributeName+'：' || ''}}</dt>
            <dd :key="'dd-'+index">{{item.attributeValue || ''}}</dd>
          </template>
          <template v-if="items.skuAttributeList && items.skuAttributeList.length%2 == 1">
            <dt></dt>
            <dd></dd>
          </template>
        </dl>
      </div>
    </div>
    <div class="detaillTable" v-if="tableData">
      <addhead headname="商品介绍"></addhead>
      <dl>
        <dt>商品轮播图：</dt>
        <dd>
          <p>
            <img :src="mainPicture" />
          </p>
          <p v-for="(item,index) in imageInfo" :key="item.id">
            <img :src="item" />
          </p>
        </dd>
      </dl>
      <dl>
        <dt>商品详情图：</dt>
        <dd>
          <p v-for="(item,index) in slidePicture" :key="item.id">
            <img :src="item" />
          </p>
        </dd>
      </dl>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table :data="tableLog" border style="width: 90%" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="description" label="操作描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {addURL} from '@/utils/index'
import {getGoodsDetail} from '@/api/goodsManage'
import { getGoodsLog } from "@/api/release/specialProjectManage";
export default {
  inject: ["close"],
  name:'ShoppeGoodsDetail',
  data() {
    return {
      shoppeId: '',
      skuId:'',
      tableData: null,
      tableLog:null,
      mainPicture:'',
      imageInfo:[],
      slidePicture:[],
    };
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.shoppeId != this.shoppeId || this.$route.query.skuId != this.skuId){
      this.init();
    }
  },
  components: {
    addhead
  },
  computed:{
    goodsStatus: function(){
      return {0:'已启用',1:'待启用',2:'草稿',3:'待审核',4:'已驳回',5:'禁用',6:'已上柜'}[this.tableData.status]
    }
  },
  methods: {
    init(){
      this.shoppeId = this.$route.query.shoppeId;
      this.skuId = this.$route.query.skuId;
      this.getdata();
      this.getLog();
    },
    getdata() {
      getGoodsDetail(this.skuId).then(res => {
        if (res.code == "000000") {
            this.tableData = res.data;
            this.mainPicture=addURL(res.data.skuImageInfoDTO.mainPictureFile[0].path);
            this.imageInfo = res.data.skuImageInfoDTO.detailPictureFile&&res.data.skuImageInfoDTO.detailPictureFile.map((item,index) => {
                    return addURL(item.path)   
            });
            this.slidePicture =res.data.skuImageInfoDTO.slidePictureFile&&res.data.skuImageInfoDTO.slidePictureFile.map(item=>{
              return addURL(item.path)
            });
        }
      });
    },
    getLog() {
      getGoodsLog(this.shoppeId, this.skuId).then(res => {
        if (res.code == "000000") {
            this.tableLog = res.data;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .detaillTable {
    border: 1px solid #d1d1d1;
    table {
      width: 90%;
      margin: 20px auto;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 12px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        padding-right: 6px;
        box-sizing: border-box;
        color: #666;
        font-weight: 700;
        font-size: 14px;
        text-align: right;
        width: 20%;
        background-color: #f9fafc;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 30%;
        line-height: 20px;
        word-break: break-all;
        span {
          margin-right: 10px;
          display: inline-block;
        }
      }
      .tit {
        text-align: left;
        padding-left: 10px;
      }
    }
    dl {
      margin: 30px;
      dt {
        float: left;
        width: 100px;
      }
      dd {
        overflow: hidden;
        p {
          width: 100px;
          height: 100px;
          padding: 10px;
          margin-right:20px; 
          border: 1px solid #eee;
          float: left;
          img {
            width: 100%;
            display: block;
          }
        }
      }
    }
    .table{
      width: 90%;
      margin: 20px auto;
      border:1px solid #ccc;
      border-right:none;
      h4{
        padding-left:10px;
        background-color: #f9fafc;
        line-height: 40px;
        border-right:1px solid #ccc;
      }
      dl{
        background-color: #f9fafc;
        display:flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0;
        dt{
          box-sizing: border-box;
          flex:0 1 25%;
          border-top:1px solid #ccc;
          border-right:1px solid #ccc;
          line-height: 40px;
          padding-left:10px;
        }
        dd{
          box-sizing: border-box;
          flex:0 1 25%;
          background-color:#fff;
          line-height: 40px;
          padding-left:10px;
          border-top:1px solid #ccc;
          border-right:1px solid #ccc;
        }
      }
    }
  }
  .detaillTable2 {
    border: 1px solid #d1d1d1;
    border-top: none;
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
      width: 90%;
      margin: 0 auto 20px;
    }
  }
}
</style>