

<!--商品详情-->
<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1" v-if="tableDataMis">
        <tr>
          <th>商品名称：</th>
          <td colspan="3">{{tableDataMis.name}}</td>
        </tr>
        <tr>
          <th>商品编号：</th>
          <td>{{tableDataMis.no}}</td>
          <th>状态：</th>
          <td>{{tableDataMis.status|aaa}}</td>
        </tr>
        <tr>
          <th><i>*</i>商品分类：</th>
          <td>{{tableDataMis.firstLevelCategoryName}}>{{tableDataMis.secondLevelCategoryName}}>{{tableDataMis.thirdLevelCategoryName}}</td>
          <th><i>*</i>销售单位：</th>
          <td>{{tableDataMis.unit}}</td>
        </tr>
        <tr>
          <th><i>*</i>品牌：</th>
          <td>{{tableDataMis.brandNameCN}} <span v-if="tableDataMis.brandNameEN==null">({{tableDataMis.brandNameEN}})</span> </td>
          <th><i>*</i>重量（含包装）：</th>
          <td>{{tableDataMis.weight}}{{tableDataMis.weightUnit}}</td>
        </tr>
        <tr>
          <th><i>*</i>{{tableDataMis.primaryAttributeName}}：</th>
          <td>{{tableDataMis.primaryAttributeValue}}</td>
          <th><i>*</i>产地：</th>
          <td>{{tableDataMis.origin}}</td>
        </tr>
        <tr>
          <th><i>*</i>采购价（含税）：</th>
          <td>
            ￥{{tableDataMis.buyingPrice}}
          </td>
          <th><i>*</i> 保质期：</th>
          <td>{{tableDataMis.shelfLife}}  {{tableDataMis.shelfLifeUnit}}</td>
        </tr>
        <tr>
          <th><i>*</i>友商售价：</th>
          <td>
            ￥{{tableDataMis.competingSkuPrice}}
          </td>
          <th><i>*</i> 质保：</th>
          <td>{{tableDataMis.warranty}}</td>
        </tr>
        <tr>
          <th><i>*</i>友商链接：</th>
          <td>
            {{tableDataMis.weight}}
          </td>
          <th><i>*</i> 执行标准：</th>
          <td>{{tableDataMis.executiveStandard}}</td>
        </tr>
        <tr>
          <th><i>*</i>友商链接：</th>
          <td>
            {{tableDataMis.weight}}
          </td>
          <th><i>*</i> 条形码：</th>
          <td>{{tableDataMis.barcode}}</td>
        <tr>
          <th><i>*</i>友商链接：</th>
          <td>
            {{tableDataMis.competingSkuUrl1}}
          </td>
          <th><i>*</i> 广告语：</th>
          <td>{{tableDataMis.slogan}}</td>
        </tr>
        <tr>
          <th><i>*</i>建议零售价：</th>
          <td>
            ￥{{tableDataMis.sellingPrice}}
          </td>
          <th><i>*</i> 包装清单：</th>
          <td>{{tableDataMis.packingList}}</td>
        </tr>
        <tr>
          <th><i>*</i>官网售价（含税）：</th>
          <td>
            ￥{{tableDataMis.websitePrice}}
          </td>
          <th><i>*</i> 集团专员：</th>
          <td>{{tableDataMis.staffAccount}} {{tableDataMis.staffName}}</td>
        </tr>
        <tr>
          <th><i>*</i>集团主管/经理：</th>
          <td>
            {{tableDataMis.managerAccount}} {{tableDataMis.managerName}}
          </td>
          <th><i>*</i> 开票规格型号：</th>
          <td>{{tableDataMis.modelOnInvoice}}</td>
        </tr>
        <tr>
          <th><i>*</i>开票名称：</th>
          <td>
            {{tableDataMis.nameOnInvoice}}
          </td>
          <th><i>*</i> 税率：</th>
          <td>{{tableDataMis.taxRate}}%</td>
        </tr>
        <tr>
          <th><i>*</i>税收分类名称：</th>
          <td>
            {{tableDataMis.taxCodeName}}
          </td>
          <th><i>*</i>税收分类编码：</th>
          <td>
            {{tableDataMis.taxCode}}
          </td>
        </tr>
        <tr>
          <th><i>*</i>非销售区域：</th>
          <td colspan="3">
            {{tableDataMis.weight}}
          </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>参数信息</span>
      </div>
      <!--<table border="1">
        <tr>
          <th style="text-align: center">属性组一</th>
          <td colspan="3"></td>
        </tr>
        <tr>
          <th>规格：</th>
          <td>{{tableDataMis.id}}</td>
          <th>级别：</th>
          <td>待审核</td>
        </tr>
        <tr>
          <th><i>*</i>操作系统：</th>
          <td>北京和硕立业科技有限公司</td>
          <th><i>*</i>CPU类型：</th>
          <td>和硕立业</td>
        </tr>
        <tr>
          <th><i>*</i>CPU型号：</th>
          <td>厂商</td>
          <th><i>*</i>CPU速度：</th>
          <td>李某某</td>
        </tr>
        <tr>
          <th><i>*</i>三级缓存：</th>
          <td>88975787879</td>
          <th><i>*</i> 核心：</th>
          <td>河南省 - 南阳市 - 南召县</td>
        </tr>
        <tr>
          <th><i>*</i>内存容量：</th>
          <td>
            黄杨路与东大街交叉口1102街交叉口1102街交叉口1102黄杨路与东大街交叉口1102街交叉口1102街交叉口1102
          </td>
          <th><i>*</i>插槽数量：</th>
          <td>10000㎡</td>
        </tr>
        <tr>
          <th><i>*</i>硬盘容量：</th>
          <td>
            黄杨路与东大街交叉口1102街交叉口1102街交叉口1102黄杨路与东大街交叉口1102街交叉口1102街交叉口1102
          </td>
          <th><i>*</i>固态硬盘（自定义：</th>
          <td>10000㎡</td>
        </tr>
      </table>
      <table border="1">
        <tr>
          <th style="text-align: center">属性组二</th>
          <td colspan="3"></td>
        </tr>
        <tr>
          <th>规格：</th>
          <td>{{tableDataMis.id}}</td>
          <th>级别：</th>
          <td>待审核</td>
        </tr>
        <tr>
          <th><i>*</i>操作系统：</th>
          <td>北京和硕立业科技有限公司</td>
          <th><i>*</i>CPU类型：</th>
          <td>和硕立业</td>
        </tr>
        <tr>
          <th><i>*</i>CPU型号：</th>
          <td>厂商</td>
          <th><i>*</i>CPU速度：</th>
          <td>李某某</td>
        </tr>
        <tr>
          <th><i>*</i>三级缓存：</th>
          <td>88975787879</td>
          
          <th><i>*</i> 核心：</th>
          <td>河南省 - 南阳市 - 南召县</td>
        </tr>
        <tr>
          <th><i>*</i>内存容量：</th>
          <td>
            黄杨路与东大街交叉口1102街交叉口1102街交叉口1102黄杨路与东大街交叉口1102街交叉口1102街交叉口1102
          </td>
          <th><i>*</i>插槽数量：</th>
          <td>10000㎡</td>
        </tr>
        <tr>
          <th><i>*</i>硬盘容量：</th>
          <td>
            黄杨路与东大街交叉口1102街交叉口1102街交叉口1102黄杨路与东大街交叉口1102街交叉口1102街交叉口1102
          </td>
          <th><i>*</i>固态硬盘（自定义）：</th>
          <td>10000㎡</td>
        </tr>
      </table>
      <table border="1">
        <tr>
          <th style="text-align: center">属性组三</th>
          <td colspan="3"></td>
        </tr>
        <tr>
          <th>规格：</th>
          <td>{{tableDataMis.id}}</td>
          <th>级别：</th>
          <td>待审核</td>
        </tr>
        <tr>
          <th><i>*</i>操作系统：</th>
          <td>北京和硕立业科技有限公司</td>
          <th><i>*</i>CPU类型：</th>
          <td>和硕立业</td>
        </tr>
        <tr>
          <th><i>*</i>CPU型号：</th>
          <td>厂商</td>
          <th><i>*</i>CPU速度：</th>
          <td>李某某</td>
        </tr>
        <tr>
          <th><i>*</i>三级缓存：</th>
          <td>88975787879</td>
          <th><i>*</i> 核心：</th>
          <td>河南省 - 南阳市 - 南召县</td>
        </tr>
        <tr>
          <th><i>*</i>内存容量：</th>
          <td>
            黄杨路与东大街交叉口1102街交叉口1102街交叉口1102黄杨路与东大街交叉口1102街交叉口1102街交叉口1102
          </td>
          <th><i>*</i>插槽数量：</th>
          <td>10000㎡</td>
        </tr>
        <tr>
          <th><i>*</i>硬盘容量：</th>
          <td>
            黄杨路与东大街交叉口1102街交叉口1102街交叉口1102黄杨路与东大街交叉口1102街交叉口1102街交叉口1102
          </td>
          <th><i>*</i>固态硬盘（自定义：</th>
          <td>10000㎡</td>
        </tr>
      </table>-->
      <div class="editerBrandBox" v-for="(item,index) in data" :key="index">
        <div class="h50 headerBox"><img src="" alt=""><span>参数信息</span></div>
        <div class="h50 paramsBox">
          <span>{{item.attributeGroupName}}</span>
        </div>
        <div class="tableBox" v-for="(items,index) in item.skuAttributeList" :key="index">
          <!--属性值类型（0：数字；1：单行文本；2：多行文本；3：下拉单选；4：单选按钮组；5：多选按钮组；6：日历，7：文件）-->
          <el-form :model="items"  ref="items" label-width="100px" class="demo-ruleForm" style="padding-left: 100px">
            <el-form-item :label="items.attributeName" prop="attributeName" v-if="items.valueType==4">:
              <el-radio-group v-model="radio" v-for="(i,index) in items.optionsList" :key="index">
                <el-radio :label="i"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="items.attributeName" prop="attributeName" v-if="items.valueType==5">:
              <el-checkbox-group v-model="items.optionsList">
                <el-checkbox :label="i" v-for="(i,index) in items.optionsList" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="items.attributeName" prop="attributeName" v-if="items.valueType==3">:
              <el-select v-model="items.attributeValue" placeholder="请选择活动区域">
                <el-option
                  v-for="item in options10"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="items.attributeName" prop="attributeName" v-if="items.valueType==1">:
              <el-input v-model="items.attributeValue" placeholder="长度1~10字以内"></el-input>
            </el-form-item>
            <el-form-item :label="items.attributeName" prop="attributeName" v-if="items.valueType==0">:
              <el-input v-model="items.attributeValue" placeholder="5位以内数字" :maxlength="items.maxLength"></el-input>
            </el-form-item>
            <el-form-item :label="items.attributeName" prop="attributeName" style="width: 500px" v-if="items.valueType==2">:
              <el-input type="textarea" v-model="items.attributeValue" rows="5" placeholder="长度10 - 200字以内"></el-input>
            </el-form-item>
            <el-form-item :label="items.attributeName" prop="attributeName" v-if="items.valueType==6">:
              <el-date-picker type="date" placeholder="选择日期" v-model="items.attributeValue" style="width: 400px;"></el-date-picker>
            </el-form-item>
            <el-form-item :label="items.attributeName" prop="attributeName" v-if="items.valueType==7">:
              <el-upload
                class="upload-demo"
                action="/api/file-service/file/uploadFile"
                :data="{type:'Template'}"
                :on-success="updateSuccess"
                :before-remove="beforeRemove"
                headers="headerToken"
                :on-change="handleChange"
                multiple
                name="fileName"
                :before-upload="beforeUpdate"
                :file-list="fileList3">
                <el-button  type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="bannerBox">
      <div class="headerBannerBox">
        <span><i></i>商品介绍</span>
      </div>
      <div class="mainBannerBox">
        <span><i>*</i>商品轮播图：</span>
        <ul class="banner clear">
          <li><img src="https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D500/sign=e52171c617178a82ca3c7fa0c603737f/622762d0f703918fc7ebb6c0583d269759eec486.jpg" alt=""></li>
          <li><img src="https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D500/sign=e52171c617178a82ca3c7fa0c603737f/622762d0f703918fc7ebb6c0583d269759eec486.jpg" alt=""></li>
          <li><img src="https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D500/sign=e52171c617178a82ca3c7fa0c603737f/622762d0f703918fc7ebb6c0583d269759eec486.jpg" alt=""></li>
          <li><img src="https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D500/sign=e52171c617178a82ca3c7fa0c603737f/622762d0f703918fc7ebb6c0583d269759eec486.jpg" alt=""></li>
          <li><img src="https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D500/sign=e52171c617178a82ca3c7fa0c603737f/622762d0f703918fc7ebb6c0583d269759eec486.jpg" alt=""></li>
        </ul>
      </div>
      <div class="detailBannerBox"><span><i>*</i>商品详情：</span>
        <ul class="banner clear">
          <li><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542269831438&di=fb7d629690cf4b357706cfc42142bd83&imgtype=0&src=http%3A%2F%2F03imgmini.eastday.com%2Fmobile%2F20181019%2F20181019031822_623c60707bb3970b222eb38ab49567a7_1.jpeg" alt=""></li>
          <li><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542269831438&di=fb7d629690cf4b357706cfc42142bd83&imgtype=0&src=http%3A%2F%2F03imgmini.eastday.com%2Fmobile%2F20181019%2F20181019031822_623c60707bb3970b222eb38ab49567a7_1.jpeg" alt=""></li>
        </ul></div>
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
        <el-button type="primary" @click="closeDetail()">关闭</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import {getGoodsDetail} from '@/api/goodsManage'
  import {mallGoodsDetail} from '@/api/release/mallProjectManage'
  import '@/components/goods/addGoods/FillParams.less'
  import {timeFormat} from '@/utils/index'

  export default {
    inject:['reload','close'],
    name:'MallProjectDetail',
    data(){
      return {
        deatailID:null,
        //商城id
        mallID:null,
        tableDataMis: null,
        tableData: null,
        brandName:'',
        data:null,
      }
    },
    created(){
      this.deatailID=this.$route.query.id||this.$route.query.oldDetailID
      this.mallID=this.$route.query.mallID;
      this.getDetailData();
      // this.getBrandName()
    },
    activated(){
     if((this.$route.query.id||this.$route.query.oldDetailID)&&this.deatailID!=(this.$route.query.id||this.$route.query.oldDetailID)){
      this.deatailID=this.$route.query.id||this.$route.query.oldDetailID
      this.mallID=this.$route.query.mallID;
      this.getDetailData()
     }
    },
    filters:{
      aaa(val){
        return val==0?val='已启用':val==1?val='待启用':val==2?val='草稿':val==3?val='待审核':val==4?val='已驳回':val==5?val='禁用':val==6?val='已上柜':'';
      }
    },
    methods: {
      getDetailData(){
        console.log(this.deatailID);
        getGoodsDetail(this.deatailID).then(res=>{
          console.log(res.data);
          this.tableDataMis=res.data;
          this.data=res.data.skuAttributeGroupDTOList;
          for (let i = 0; i < this.tableData.length; i++) {
            let  item = this.tableData[i];
            item.operationTime=timeFormat(item.operationTime)
          }
        }).then(res=>{
        })
        console.log(this.mallID,666);
        mallGoodsDetail(this.mallID,this.deatailID).then(res=>{
          if(res.code=='000000'){
            this.tableData=res.data;
          }
        })
      },
      closeDetail(){
        this.close();
      }
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
          word-break: break-all;
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












