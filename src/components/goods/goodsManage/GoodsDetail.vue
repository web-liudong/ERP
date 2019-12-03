
<!--商品详情-->
<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1" v-if="tableDataMis">
        <tr>
          <th><i>*</i>商品名称：</th>
          <td colspan="3">{{tableDataMis.name}}</td>
        </tr>
        <tr>
          <th>商品编号：</th>
          <td>{{tableDataMis.no}}</td>
          <th>状态：</th>
          <td>{{tableDataMis.statusDescription}}</td>
        </tr>
        <tr>
          <th><i>*</i>商品分类：</th>
          <td>{{tableDataMis.firstLevelCategoryName}}>{{tableDataMis.secondLevelCategoryName}}>{{tableDataMis.thirdLevelCategoryName}}</td>
          <th><i>*</i>销售单位：</th>
          <td>{{tableDataMis.unit}}</td>
        </tr>
        <tr>
          <th><i>*</i>品牌：</th>
          <td>{{tableDataMis.brandNameCN}} <span v-if="tableDataMis.brandNameEN">({{tableDataMis.brandNameEN}})</span> </td>
          <th>重量（含包装）：</th>
          <td><span v-if="tableDataMis.weight">{{tableDataMis.weight}}千克</span></td>
        </tr>
        <tr>
          <th><i>*</i>{{tableDataMis.primaryAttributeName}}：</th>
          <td>{{tableDataMis.primaryAttributeValue}}</td>
          <th>长：</th>
          <td><span v-if="tableDataMis.length">{{tableDataMis.length}}毫米</span></td>
        </tr>
        <tr>
          <th><i>*</i>采购价（含税）：</th>
          <td>
            ￥{{tableDataMis.buyingPrice}}
          </td>
          <th>宽：</th>
          <td><span v-if="tableDataMis.width">{{tableDataMis.width}}毫米</span></td>
          
        </tr>
        <tr>
          <th>友商售价：</th>
          <td>
            <span v-if="!tableDataMis.competingSkuPrice"></span>
            <span v-else>￥{{tableDataMis.competingSkuPrice}}</span>  
          </td>
          <th>高：</th>
          <td><span v-if="tableDataMis.height">{{tableDataMis.height}}毫米</span></td>
        
        </tr>
        <tr>
          <th>友商链接：</th>
          <td>
            <a :href="tableDataMis.competingSkuUrl1" target="_blank" style="color:#339999">{{tableDataMis.competingSkuUrl1}}</a>
          </td>
          <th><i>*</i>产地：</th>
          <td>{{tableDataMis.origin}}</td>
        </tr>
        <tr>
          <th>友商链接：</th>
          <td>
            <a :href="tableDataMis.competingSkuUrl2" target="_blank" style="color:#339999">{{tableDataMis.competingSkuUrl2}}</a>
          </td>
          <th><i>*</i> 保质期：</th>
          <td><span v-if="tableDataMis.shelfLife==0">无</span> <span v-else>{{tableDataMis.shelfLife}}  {{tableDataMis.shelfLifeUnit}}</span></td>
        
        <tr>
          <th>友商链接：</th>
          <td>
            <a :href="tableDataMis.competingSkuUrl3" target="_blank" style="color:#339999">{{tableDataMis.competingSkuUrl3}}</a>
          </td>
            <th><i>*</i> 质保：</th>
          <td>{{tableDataMis.warranty}}</td>
        
        </tr>
        <tr>
          <th><i>*</i>建议零售价：</th>
          <td>
            ￥{{tableDataMis.sellingPrice}}
          </td>
            <th> 执行标准：</th>
          <td>{{tableDataMis.executiveStandard}}</td>
        </tr>
        <tr>
          <th><i>*</i>官网售价（含税）：</th>
          <td>
            ￥{{tableDataMis.websitePrice}}
          </td>
            <th> 条形码：</th>
          <td>{{tableDataMis.barcode}}</td>
         
        </tr>
        <tr>
          <th><i>*</i>开票名称：</th>
          <td>
            {{tableDataMis.nameOnInvoice}}
          </td>
           <th>广告语：</th>
            <td>{{tableDataMis.slogan}}</td>         
        </tr>
        <tr>
          <th><i>*</i>开票规格型号：</th>
          <td>{{tableDataMis.modelOnInvoice}}</td>
          <th><i>*</i> 包装清单：</th>
            <td>{{tableDataMis.packingList}}</td>
        </tr>
        <tr>
          <th><i>*</i>税收分类名称：</th>
          <td>
            {{tableDataMis.taxCodeName}}
          </td>
           <th><i>*</i>集团主管/经理：</th>
          <td>
            {{tableDataMis.managerAccount}} {{tableDataMis.managerName}}
          </td>
          
        </tr>
         <tr>
         <th><i>*</i> 税率：</th>
          <td>{{tableDataMis.taxRate}}%</td>
           <th><i>*</i> 集团专员：</th>
          <td>{{tableDataMis.staffAccount}} {{tableDataMis.staffName}}</td>
        </tr>
        <tr>
          <th>特殊属性：</th>
          <td>
            {{tableDataMis.specialAttribute==0?'普通商品':tableDataMis.specialAttribute==1?'易碎商品':tableDataMis.specialAttribute==2?'液体商品':tableDataMis.specialAttribute==3?'裸装商品':''}}
          </td>
          <th>售后保障：</th>
          <td>
            {{tableDataMis.afterSalesGuarantee}}
          </td>
        </tr>
        <tr>
          <th>包装规格：</th>
          <td>
            {{tableDataMis.packingSpecification}}
          </td>
          <th>是否需要SN码：</th>
          <td>
            {{tableDataMis.needSN?'是':'否'}}
          </td>
        </tr>
        <tr>
          <th><i>*</i>税收分类编码：</th>
          <td>
            {{tableDataMis.taxCode}}
          </td>
          <th>是否危险品：</th>
          <td>
            <span v-for="(item,index) in tableDataMis.hazardousArticleTypeMap" :key="index" style="margin-left:5px">
             {{item}}  
            </span>
          </td>
        </tr>
        <tr v-for="(item,index) in tableDataMis.oldErpSkuInfoList" :key="index">
          <th>旧系统商品编号：</th>
          <td colspan="3">
            ID:{{item.oldSkuId}}  名称：{{item.oldSkuName}} 
          </td>
        </tr>
              </table>
    </div>
  <div class="detaillTable2">
      <addhead headname="参数信息"></addhead>
      <div v-for="(item,index) in data" :key="index">
        <div class="group-name">{{item.attributeGroupName}}</div>
        <!-- <table border="1" v-if="item.attributeGroupName">
          <tr>
            <th>属性组：</th>
            <td colspan="3">{{item.attributeGroupName}}</td>
          </tr>
          <tr v-for="(attr,i) in item.skuAttributeList" :key="i">
            <th><i v-if="attr.required">*</i>{{attr.attributeName}}</th>
            <td>{{attr.attributeValue}}</td>
          </tr>
        </table> -->
        <div class="form-wrapper">
          <el-form ref="form" :model="form" label-width="260px" class="form-box" v-for="(attr,i) in item.skuAttributeList" :key="i">
            <el-form-item :required="attr.required==1" :label="attr.attributeName"  v-if="attr.valueType==0&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <span>{{attr.attributeValue}}{{attr.options}}</span>
              <!-- <el-input v-model="attr.attributeValue" placeholder="5位以内数字" :maxlength="attr.maxLength" disabled>
                <template slot="append" v-if="attr.options">{{attr.options}}</template>
              </el-input> -->
            </el-form-item>
            <el-form-item :required="attr.required==1" :label="attr.attributeName" v-if="attr.valueType==1&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <span v-if="!/(http|https):\/\/([\w.]+\/?)\S*/.test(attr.attributeValue)">{{attr.attributeValue}}</span>
              <a :href="attr.attributeValue" target="_blank" v-if="/(http|https):\/\/([\w.]+\/?)\S*/.test(attr.attributeValue)">{{attr.attributeValue}}</a>
              <!-- <el-input v-model="attr.attributeValue" placeholder="长度1~10字以内"  disabled></el-input> -->
            </el-form-item>
            <el-form-item  :required="attr.required==1" v-show="attr.valueType==2&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <span>{{attr.attributeValue}}</span>
              <!-- <el-input placeholder="长度1-10以内" type="textarea" rows="5" :value="attr.attributeValue" disabled></el-input> -->
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==3&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <span>{{attr.attributeValue}}</span>
              <!-- <el-select v-model="attr.attributeValue" placeholder="请选择级别" style="width: 530px" disabled>
                <el-option :label="option" :value="attr.attributeValue" v-for="(option,ind) in attr.optionsList" :key="ind"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item :required="attr.required==1" :label="attr.attributeName" v-if="attr.valueType==4&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <span>{{attr.attributeValue}}</span>
              <!-- <el-radio-group v-model="attr.attributetype" v-for="(i,index) in attr.optionsList" :key="index" disabled>
                <el-radio :label="i"></el-radio>
              </el-radio-group> -->
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==5&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <span>{{attr.attributeValue}}</span>
              <!-- <el-checkbox-group v-model="attr.attributeValue" disabled>
                <el-checkbox :label="ind" v-for="(option,ind) in attr.optionsList" :key="ind">{{option}}</el-checkbox>
              </el-checkbox-group> -->
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==6&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <span>{{attr.attributeValue}}</span>
              <!-- <el-date-picker type="date" placeholder="选择日期" v-model="attr.attributeValue" style="width: 40%;" disabled></el-date-picker> -->
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==7&&attr.attributeValue">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-button type="text" size="small" @click="update(attr.attributeValue)">{{attr.attributeValue}}</el-button>
              <!-- <upload ref="uploadData"  class="updateBox" disabled></upload> -->
            </el-form-item>
          </el-form>
        </div>
      </div>

    </div>

    <div class="bannerBox">
      <addhead headname="商品介绍"></addhead>
      <div class="mainBannerBox">
        <span><i>*</i>商品轮播图：</span>
          <ul class="banner clear">
            <li><img :src="mainPicture" alt="" @click="openDialog(goodsPicture,0)"></li>
            <li><img :src="item" alt="" v-for="(item,index) in slidePicture" :key="item.id" @click="openDialog(goodsPicture,index+1)"></li>
          </ul>
      </div>
      <div class="detailBannerBox"><span><i>*</i>商品详情：</span>
      <ul class="banner" style="display:flex;">     
        <li style="flex:1"><img :src="item" alt="" v-for="(item,index) in imageInfo" :key="item.id" @click="openDialogDetail(imageInfo,index)"></li>    
      </ul></div>
    </div>
    <div class="detaillTable3 clear">
     <addhead headname="操作详情"></addhead>
      <el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="user"
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            {{scope.row.userInfo&&scope.row.userInfo.userFullName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          :formatter="formatter"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作描述"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            {{scope.row.operationDescription}}
            <br/>
            {{scope.row.description}}
          </template>
        </el-table-column>
      </el-table>
      <div class="goTopBox">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="closed()">关闭</el-button>
      </div>
      <DialogImage ref="DialogImage"></DialogImage>
      <el-dialog :visible.sync="isShow"  class="dialog-image-box" top="4vh">
    <el-carousel indicator-position="outside" height="950px" :autoplay="false" :initial-index="carIndex" ref="carousl" >
          <el-carousel-item v-for="(item,index) in showImgList" :key="index" style="overflow:auto;heigit:800px">
            <img width="100%" :src="item" alt />
          </el-carousel-item>
      </el-carousel>
  </el-dialog>
    <el-dialog :visible.sync="dialogVisible" top="0vh">
     <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>

</template>
<script>
  import {getGoodsDetail,getGoodsNoArea} from '@/api/goodsManage'
  import '@/components/goods/addGoods/FillParams.less'
  import {timeFormat,addURL,timeFormatGoods} from '@/utils/index'
  import addhead from '@/components/common/head/head'
  import upload from '@/components/common/upload/upload'
  import DialogImage from '@/components/common/Dialog/DialogImage'
  export default {
    inject:['close'],
    name:'GoodsDetail',
    data(){
      return {
        deatailID:null,
        tableDataMis: null,
        tableData: null,
        brandName:'',
        data:null,
        form:null,
        weight:'',
        imageInfo:[],
        mainPicture:'',
        slidePicture:null,
        goodsPicture:[],
        showImgList:[],
        carIndex:0,
        isShow:false,
        dialogVisible:false,
        dialogImageUrl:''
      }
    },
     components:{
      addhead,upload,DialogImage
    },
    // created(){
    //   this.deatailID=this.$route.query.id||this.$route.query.oldDetailID;
    //   this.getDetailData();
    // },
    activated(){
       this.deatailID=this.$route.query.id||this.$route.query.oldDetailID;
       this.getDetailData()
    },
    filters:{
      aaa(val){
        return val==0?val='已启用':val==1?val='待启用':val==2?val='草稿':val==3?val='待审核':val==4?val='已驳回':val==5?val='禁用':val==6?val='已上柜':'';
      },
      bbb(val){
        return {0:'无质保',1:'半年质保',2:'一年质保',3:'两年质保',4:'三年质保',5:'五年质保',6:'十年质保',7:'终身质保'}[val]
      },
      type(val){
        return {0:'爆炸品',1:'压缩气体和液态气体',2:'易燃液体',3:'自然物品及易燃固体和遇湿易燃物品',4:'氧化剂和有机过氧化物',5:'毒害品和感染性物品',6:'放射性物品',7:'腐蚀品',8:'杂类'}[val]
      },
    },
    methods: {
    closed(){
     this.close({name:'GoodsDetail',to:{name:'GoodsManage',params:{isUpdate:true}}})
    },  
    openDialogDetail(row,index){
        this.dialogVisible=true;
        this.dialogImageUrl=row[index];    
    },
    openDialog(row,index){
      this.carIndex=index;
      this.isShow=true;
      this.showImgList=row;
      this.$nextTick(()=>{
      this.$refs.carousl.setActiveItem(index)
      })
    },
    formatter(row){
      return timeFormat(row.operationTime)
    },
    update(id){
      let href = `/api/file-service/file/download?id=${id}&access_token=${this.$auth.token}`;
      window.open(href);
    },
    getDetailData(){
      getGoodsDetail(this.deatailID).then(res=>{
        this.tableDataMis=res.data;
        this.tableData=res.data.skuOperationLogDTOList;
        this.data=res.data.skuAttributeGroupDTOList;    
        this.mainPicture=addURL(res.data.skuImageInfoDTO.mainPictureFile[0]&&res.data.skuImageInfoDTO.mainPictureFile[0].path);
        this.slidePicture=res.data.skuImageInfoDTO.slidePictureFile&&res.data.skuImageInfoDTO.slidePictureFile.map(item=>{
          return addURL(item.path)
        })
        this.imageInfo= res.data.skuImageInfoDTO.detailPictureFile&&res.data.skuImageInfoDTO.detailPictureFile.map((item,index) => {
                return addURL(item.path)   
        });
        this.goodsPicture=[this.mainPicture,...this.slidePicture]
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
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;
      padding-bottom: 20px;
      .group-name{
        width: 100%;
        height: 60px;
        text-indent: 30px;
        line-height: 60px;
        font-size: 16px;
        color: #666;
      }
      .form-wrapper{
        width: 90%;
        border: 1px solid #d1d1d1;
        min-height:50px ;
        margin: 0 auto;
        padding-top:20px;
        box-sizing: border-box;
        .form-box{
          .el-input{
            width: 40%;
          }
          .el-textarea{
            width: 40%;
          }
        }
      }
      .updateBox{
        margin-left: 0px !important;
      }
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: left;
        margin:10px 20px;
      }
    }
    .detaillTable{
      border: 1px solid #d1d1d1;
      .detaillTopBox{
        height:50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span{
          line-height:50px;
          margin-left:10px;
          
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
          max-width: 300px;
          word-break: break-all
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
              width: 100px;
              height: 100px;
              margin-left: 10px;  
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
            margin-left: 20px;
            img{
              width: 100px;
              height: 100px;
              margin-left: 10px;
            }
          }
          li:nth-child(1){
            margin-left: 200px;
          }
        }
      }
    }
    .detaillTable3{
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






