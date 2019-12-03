<!--添加商品-->
<template>
  <div class="addGoodsBox">
    <div class="stepBox">
      <el-steps :active="0">
        <el-step title="填写基本信息"></el-step>
        <el-step title="填写参数信息"></el-step>
        <el-step title="图片"></el-step>
      </el-steps>
    </div>
    <div class="h50 headerBox">
      <img src alt />
      <span>
        <i class="iconfont icon-jinqi"></i>基本信息
      </span>
    </div>
    <div class="w mainBox">
      <el-form
        style="margin: 0 auto"
        :model="SkuBasicInfoParam"
        ref="SkuBasicInfoParam"
        label-width="100px"
        class="demo-SkuBasicInfoParam"
        :rules="rules"
      >
        <el-form-item label="选择分类：" prop="name" class="sousuoBox">
          <el-select
            v-model="options2"
            filterable
            remote
            reserve-keyword
            placeholder="分类搜索"
            :remote-method="remoteMethodClassify"
            :loading="loading4"
            v-if="!((isActive==2||isActive==4)&&SkuBasicInfoParam.oldId==0)"
            style="width: 400px"
            disabled
          >
            <el-option v-for="item in options10" :key="item.label" :value="item.value"></el-option>
          </el-select>
          <div v-if="(isActive==2||isActive==4)&&SkuBasicInfoParam.oldId==0">
           <el-select
            v-model="options2"
            filterable
            remote
            reserve-keyword
            placeholder="分类搜索"
            :remote-method="remoteMethodClassify"
            :loading="loading4"
            clearable
            style="width: 400px"
            @change="getDataClassify"
          >
            <el-option v-for="item in options10" :key="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary">搜索</el-button>
          <div
            class="el-cascader-menus el-popper"
            x-placement="bottom-start"
            style="z-index: 1000; position: absolute; top: 40px; left: 60px;"
          >
            <ul class="el-cascader-menu">
              <div style="text-align: center;color: red;">选择一级分类</div>
              <li
                v-for="(item,index) in oneData"
                :key="item.id"
                :class="{active:index==isOneActive}"
                @click="getSecond(index)"
                style="text-align: center"
              >
                {{item.name}}
                <i class="iconfont icon-qianjin"></i>
              </li>
            </ul>
            <ul class="el-cascader-menu">
              <div style="text-align: center;color: red">选择二级分类</div>
              <li
                v-for="(item,index) in secondData"
                :key="item.id"
                :class="{active:index==isSecondActive}"
                style="text-align: center"
                @click="getThree(index)"
              >
                {{item.name}}
                <i class="iconfont icon-qianjin"></i>
              </li>
            </ul>
            <ul class="el-cascader-menu">
              <div style="text-align: center;color: red">选择三级分类</div>
              <li
                v-for="(item,index) in threeData"
                :key="item.id"
                :class="{active:index==isThreeActive}"
                style="text-align: center"
                @click="getSelect(index,item.id)"
              >
                {{item.name}}
                <i class="iconfont icon-qianjin"></i>
              </li>
            </ul>
          </div>
          <div class="tipBox" style="margin-top: 220px">
            您当前选择的商品类别是：
            <span v-if="active" style="color:red">{{options12}}</span>
            <span v-if="!active" style="color:red">
              {{oneName}}
              <i v-if="twoName!=''">|</i>
              {{twoName}}
              <i v-if="threeName!=''">|</i>
              {{threeName}}
            </span>
          </div>
          <!-- <div class="tipBox">选项中无所需分类，请联系管理员，邮箱 *********@66123123.com</div> -->
          </div>
          
        </el-form-item>

        <el-form-item label="商品品牌：" prop="brandId">
          <el-select
            v-model="SkuBasicInfoParam.brandName"
            filterable
            remote
            reserve-keyword
            placeholder="输入名称/首字母"
            :remote-method="remoteMethod"
            :loading="loading1"
            style="width: 400px"
            clearable
            @change="getBrandName"
            :disabled="!((isActive==2||isActive==4)&&SkuBasicInfoParam.oldId==0)"
          >
            <el-option
              v-for="item in options4"
              :key="item.nameCN+(item.nameEN?'(':'')+item.nameEN+(item.nameEN?')':'')"
              :label="item.label"
              :value="item.nameCN+(item.nameEN?'(':'')+item.nameEN+(item.nameEN?')':'')"
            ></el-option>
          </el-select>
          <div class="tipBox">1.品牌列表无所需品牌时，请添加品牌。 2.品牌列表有所需品牌，此处搜索不到，请联系品牌管理员</div>
        </el-form-item>
        <el-form-item v-if="false" label="商品品牌id：">
          <el-input v-model="SkuBasicInfoParam.brandId" placeholder="填写品牌加型号"></el-input>
        </el-form-item>
        <!--规格调别人的接口-->
        <el-form-item prop="primaryAttributeName" style="position:relative">
          <i style="color:red;position: absolute;top: -12px;left: -61px;">*</i>
          <el-select
            v-model="SkuBasicInfoParam.primaryAttributeName"
            :placeholder="guige"
            style="width: 100px;margin-left: -54px"
            disabled
          >
            <el-option
              v-for="item in SkuBasicInfoParam.primaryAttributeName"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model="SkuBasicInfoParam.primaryAttributeValue"
            placeholder="1~20个字以内"
            style="margin-left: 10px"
            :disabled="!((isActive==2||isActive==4)&&SkuBasicInfoParam.oldId==0)"
            @blur="putOptions()"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="SkuBasicInfoParam.name" disabled placeholder="自动生成"></el-input>
          <div class="tipBox">规则：品牌中文+品牌英文+主键值（即规格型号）+商品自定义名称+计价单位+英文冒号:+单位</div>
        </el-form-item>
        <el-form-item label="商品自定义名称：" prop="shortName">
          <el-input v-model="SkuBasicInfoParam.shortName"  @change="splicingGoods()"></el-input>
        </el-form-item>
        <el-form-item label="开票名称：" prop="nameOnInvoice">
          <el-input v-model="SkuBasicInfoParam.nameOnInvoice"></el-input>
        </el-form-item>
        <el-form-item label="开票型号规格：" prop="modelOnInvoice">
          <el-input v-model="SkuBasicInfoParam.modelOnInvoice"></el-input>
        </el-form-item>
        <el-form-item label="税收分类名称：" prop="invoiceName">
          <el-select
            v-model="SkuBasicInfoParam.taxCodeId"
            filterable
            remote
            reserve-keyword
            placeholder="请选择税收分类"
            :remote-method="remoteMethodInvoice"
            :loading="loading1"
            clearable
            style="width: 400px"
            @change="getDataInvoiceName"
          >
            <el-option v-for="item in options16" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
          <el-input v-if="false" v-model="SkuBasicInfoParam.taxCodeId"></el-input>
        </el-form-item>
        <el-form-item label="税收分类简称：">
          <el-input v-model="SkuBasicInfoParam.taxCodeShortName" disabled></el-input>
        </el-form-item>
        <el-form-item label="税收分类编码：" prop="taxCode">
          <el-input v-model="SkuBasicInfoParam.taxCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="税率：" prop="taxRate">
          <el-input v-model="SkuBasicInfoParam.taxRate" autocomplete="off" disabled>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="采购价（含税）：" prop="buyingPrice">
          <el-input v-model="SkuBasicInfoParam.buyingPrice" placeholder="0.00"></el-input>
        </el-form-item>
        <el-form-item label="友商售价：" prop="competingSkuPrice">
          <el-input v-model="SkuBasicInfoParam.competingSkuPrice" placeholder="0.00"></el-input>
        </el-form-item>
        <el-form-item label="友商链接1：">
          <span slot="label">友商链接1：</span>
          <el-input v-model="SkuBasicInfoParam.competingSkuUrl1" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item label="友商链接2：" prop="competingSkuUrl2">
          <span slot="label">友商链接2：</span>
          <el-input v-model="SkuBasicInfoParam.competingSkuUrl2" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item label="友商链接3：" prop="competingSkuUrl3">
          <span slot="label">友商链接3：</span>
          <el-input v-model="SkuBasicInfoParam.competingSkuUrl3" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item label="建议零售价：" prop="sellingPrice">
          <el-input v-model="SkuBasicInfoParam.sellingPrice" placeholder="0.00"></el-input>
        </el-form-item>
        <el-form-item label="官网售价（含税）：" prop="websitePrice">
          <el-input v-model="SkuBasicInfoParam.websitePrice" placeholder="0.00"></el-input>
        </el-form-item>
        <el-form-item label="销售单位：" prop="unit">
          <el-select
            v-model="SkuBasicInfoParam.unit"
            filterable
            remote
            reserve-keyword
            placeholder="请输入单位"
            @change="splicingGoods()"
            :remote-method="remoteUnit"
            :loading="loading5"
            :disabled="!((isActive==2||isActive==4)&&SkuBasicInfoParam.oldId==0)"
            style="width: 400px"
            clearable
          >
            <el-option
              v-for="item in options8"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重量（含包装）：" prop="weight">
          <el-input v-model="SkuBasicInfoParam.weight" placeholder="1~50个字以内">
            <template slot="append">千克</template>
          </el-input>
        </el-form-item>
        <el-form-item label="长：" prop="length">
          <el-input v-model="SkuBasicInfoParam.length" placeholder>
            <template slot="append">毫米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="宽：" prop="width">
          <el-input v-model="SkuBasicInfoParam.width" placeholder>
            <template slot="append">毫米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="高：" prop="height">
          <el-input v-model="SkuBasicInfoParam.height" placeholder>
            <template slot="append">毫米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="特殊属性：">
          <el-select
            v-model="SkuBasicInfoParam.specialAttribute"
            placeholder="请选择特殊属性"
            style="width:400px"
          >
            <el-option
              v-for="item in specialAttributesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要SN码：" prop="needSN">
          <el-select
            v-model="SkuBasicInfoParam.needSN"
            placeholder="请选择是否需要SN码"
            style="width:400px"
          >
            <el-option
              v-for="item in needSNList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包装规格：">
          <el-input v-model="SkuBasicInfoParam.packingSpecification" placeholder></el-input>
        </el-form-item>
        <el-form-item label="售后保障：" prop="afterSalesGuarantee">
          <el-input v-model="SkuBasicInfoParam.afterSalesGuarantee" placeholder="1~100个字以内"></el-input>
        </el-form-item>
        <el-form-item label="产地：" prop="origin">
          <el-input v-model="SkuBasicInfoParam.origin" placeholder="1~50个字以内"></el-input>
        </el-form-item>
        <!-- <el-form-item label="保质期：" prop="shelfLife">
           <el-input v-model="SkuBasicInfoParam.shelfLife" placeholder="1-50个字以内"></el-input>
        </el-form-item>-->
        <el-form-item label="保质期：" prop="shelfLife">
          <el-radio-group v-model="radioValue" @change="get()">
            <el-radio :label="1">有</el-radio>
            <el-radio :label="2">无</el-radio>
          </el-radio-group>
          <el-input
            v-model="SkuBasicInfoParam.shelfLife"
            placeholder="1~50个字以内"
            :readonly="radioValue==2"
            style="width: 200px"
          ></el-input>
          <el-select
            v-model="SkuBasicInfoParam.shelfLifeUnit"
            placeholder="天"
            style="width: 80px"
            @click.native="getUNIT2()"
          >
            <el-option
              v-for="item in options3"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质保：" prop="warranty">
          <!-- <el-select v-model="SkuBasicInfoParam.warranty" placeholder="请选择" style="width: 400px">
            <el-option
              v-for="item in options5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
          <el-autocomplete
            class="inline-input"
            style="400px"
            v-model="SkuBasicInfoParam.warranty"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="条形码：">
          <el-input v-model="SkuBasicInfoParam.barcode" placeholder="请填写条形码"></el-input>
        </el-form-item>
        <el-form-item label="执行标准：" prop="executiveStandard">
          <el-input v-model="SkuBasicInfoParam.executiveStandard" placeholder="1~50个字以内"></el-input>
        </el-form-item>
        <el-form-item label="集团主管/经理账号：" prop="managerDataAuthorityId">
          <!--<el-input v-model="SkuBasicInfoParam.managerId" placeholder="1~50个字以内" type="number"></el-input>-->
          <el-select
            v-model="managerData.userName"
            filterable
            remote
            reserve-keyword
            placeholder="1~50个字以内"
            :remote-method="remoteMethodUsername"
            :loading="loading2"
            style="width: 400px"
            clearable
            @change="getUSERNAME"
          >
            <el-option
              v-for="item in options6"
              :key="item.userName"
              :label="item.label"
              :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="集团id：">
          <el-input v-model="managerData.id" placeholder="1~50个字以内" readonly></el-input>
        </el-form-item>
        <el-form-item label="集团主管/经理姓名：">
          <el-input v-model="managerData.realName" placeholder="1~50个字以内" readonly></el-input>
        </el-form-item>
        <el-form-item label="集团专员账号：" prop="staffDataAuthorityId">
          <el-select
            v-model="SkuBasicInfoParam.staffDataAuthorityId"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="1~50个字以内"
            :remote-method="remoteMethodUsernameCommissioner"
            :loading="loading3"
            style="width: 400px"
            @change="getUSERNAMECOMMISS"
          >
            <el-option
              v-for="item in options7"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集团专员姓名：" prop="name7">
          <el-input v-model="SkuBasicInfoParam.staffDataAuthorityName" placeholder="1~50个字以内" readonly></el-input>
        </el-form-item>
        <el-form-item label="是否危险品：" prop="hazardousArticleTypeList" style="width: 700px">
          <el-checkbox-group v-model="SkuBasicInfoParam.hazardousArticleTypeList">
            <el-checkbox label="0">爆炸品</el-checkbox>
            <el-checkbox label="1">压缩气体和液态气体</el-checkbox>
            <el-checkbox label="2">易燃液体</el-checkbox>
            <el-checkbox label="3">自然物品及易燃固体和遇湿易燃物品</el-checkbox>
            <el-checkbox label="4" style="margin-left: 60px">氧化剂和有机过氧化物</el-checkbox>
            <el-checkbox label="5">毒害品和感染性物品</el-checkbox>
            <el-checkbox label="6">放射性物品</el-checkbox>
            <el-checkbox label="7">腐蚀品</el-checkbox>
            <el-checkbox label="8">杂类</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="包装清单：" prop="packingList">
          <el-input
            type="textarea"
            placeholder="长度在1~200字以内"
            v-model="SkuBasicInfoParam.packingList"
            class="textBox"
            rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告语：" prop="slogan">
          <el-input
            type="textarea"
            placeholder="长度在1~200字以内"
            v-model="SkuBasicInfoParam.slogan"
            class="textBox"
            rows="5"
          ></el-input>
        </el-form-item>
        <div v-for="(item,index) in SkuBasicInfoParam.relateSkuInfo"
          :key="item.key" >
         <el-form-item
            class="rules"
            style="flex-direction: row;align-items: flex-start;"
          >
            <span slot="label">关联旧商品ID：&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-input v-model="item.relatedId" placeholder="输入一个旧商品ID" style="width: 400px" @input="item.relatedId=item.relatedId.replace(/[^\d]/g,'')" @blur="getNameByOldId(item.relatedId,index)" :disabled="(isActive!=2&&isActive!=4)||((isActive==2||isActive==4)&&SkuBasicInfoParam.oldId>0)"></el-input>
               <el-button @click="addCorrespond()" v-if="index==0" :disabled="(isActive!=2&&isActive!=4)||((isActive==2||isActive==4)&&SkuBasicInfoParam.oldId>0)">新增</el-button>
          </el-form-item>
          <el-form-item
            class="rules"
            style="flex-direction:row;align-items:flex-start;"
          >
            <span slot="label">旧商品名称：&nbsp;&nbsp;&nbsp;</span>
               <el-input v-model="item.relatedName" placeholder="输入旧商品ID，自动查询名称" style="width:400px" disabled></el-input>
               <el-button @click="deleteRules(index)" v-if="index!=0" :disabled="(isActive!=2&&isActive!=4)||((isActive==2||isActive==4)&&SkuBasicInfoParam.oldId>0)" type="danger">删除</el-button>
          </el-form-item>   
        </div> 
        <el-form-item style="margin-top: 20px;margin-left: 60px">
          <el-button type="primary" @click="submitForm('SkuBasicInfoParam')">保存至草稿</el-button>
          <el-button @click="resetForm('SkuBasicInfoParam')">保存并填写下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <goodsCompare ref="goodsCompare" @callback="disCallback"></goodsCompare>
  </div>
</template>

<script>
import {
  createSkuBasicInfo,
  recordGoods,
  selectGoods,
  findPrimary,
  remoteBrandName,
  getUnit,
  getUnitRemote,
  getUsername,
  getClassifyRemote,
  getSkuBasicInfo,
  updateSkuBasicInfo,
  remoteBrandGoodsName,
  recordGoodsAdd,
  selectTaxInfo,
  getNameByOldId,
  getTaxCode,
  findTaxCode
} from "@/api/goodsManage.js";
import "@/components/goods/addGoods/AddGoods.less";
import goodsCompare from "../child/goods_compare";
import {debounce} from "@/utils/index"
export default {
  inject:['close'],
  name:'EditerGoods',
  data() {
    var checkURl = (rule, value, callback) => {
      var url = value;
      var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
      if (!reg.test(url)) {
        callback(new Error("这网址不是以http://https://开头，或者不是网址！"));
      } else {
        callback();
      }
    };
    var checkURl2 = (rule, value, callback) => {
      0;
      if (value == "") {
        callback();
      }
      var url = value;
      var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
      if (!reg.test(url)) {
        callback(new Error("这网址不是以http://https://开头，或者不是网址！"));
      } else {
        callback();
      }
    };
    var checkBrandName = (rule, value, callback) => {
      console.log(value, 8888);
      if (!value) {
        callback(new Error("商品品牌不能为空"));
      } else {
        callback();
      }
    };
    var checkWeight = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      let patrn = /^(((\d*).\d{1,3})|(\d+))$/;
      if (!patrn.test(value)) {
        return callback(new Error("填写的数据最多保留小数点后三位"));
      }
      if (value < 0) {
        callback(new Error("重量不能为负数"));
      } else {
        callback();
      }
    };
    var checkLength = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      var re = /^[0-9]+$/;
      if (!re.test(value)) {
        return callback(new Error("填写的数据必须为正整数"));
      }
      callback();
    };
    var checkWidth = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      var re = /^[0-9]+$/;
      if (!re.test(value)) {
        return callback(new Error("填写的数据必须为正整数"));
      }
      callback();
    };
    var checkHeight = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      var re = /^[0-9]+$/;
      if (!re.test(value)) {
        return callback(new Error("填写的数据必须为正整数"));
      }
      callback();
    };
    var checkBuyingPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error("采购价(含税)不能为空"));
      }
      if (value < 0) {
        callback(new Error("采购价(含税)不能为负数"));
      } else {
        callback();
      }
    };
    var checkCompetingSkuPrice = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("友商售价不能为负数"));
      } else {
        callback();
      }
    };
    var checkSellingPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error("建议零售价不能为空"));
      }
      if (value < 0) {
        callback(new Error("建议零售价不能为负数"));
      } else {
        callback();
      }
    };
    var checkWebsitePrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error("官网售价不能为空"));
      }
      if (value < 0) {
        callback(new Error("官网售价不能为负数"));
      } else {
        callback();
      }
    };
    var checkInvoice = (rule, value, callback) => {
      if (!this.SkuBasicInfoParam.taxCodeId) {
        callback(new Error("税收分类名称不能为空"));
      }else{
        callback()
      }
    };
    var checkStaff = (rule, value, callback) => {
      if (!this.SkuBasicInfoParam.staffDataAuthorityId) {
        callback(new Error("集团专员账号不能为空"));
      }else{
        callback()
      }
    };
    var checknameOnInvoice = (rule, value, callback) => {
      if (!value) {
        callback(new Error("开票名称不能为空"));
      }else if(/&/.test(value)){
        callback(new Error("开票名称不能存在'&'"))  
      }else{
        callback()
      }
    };
    return {
      draftOrAuditer:null,
      //当前编辑的是哪条状态
      isActive: null,
      oneName: "",
      twoName: "",
      threeName: "",
      // 单位下拉框的值
      type: "",
      oldId:null,
      //编辑商品id
      EditerGoodsId: null,
      //完成度
      completionRate: null,
      radioValue: "",
      specialAttributesList: [
        { value: 0, label: "普通商品" },
        { value: 1, label: "易碎商品" },
        { value: 2, label: "液体商品" },
        { value: 3, label: "裸装商品" }
      ],
      //远程搜索
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      //远程搜索的集合
      options4: [],
      //管理员账号的远程搜索
      options6: [],
      //集团专员账号的远程搜索
      options7: [],
      options10: [],
      options16: [], //税收分类
      //集团专员的真实姓名
      commissionerRealName: "",
      isOneActive:null,
      isSecondActive: null,
      isThreeActive: null,
      //三级联动数据
      oneData: null,
      secondData: null,
      threeData: null,
      guige: "主键值",
      restaurant: [],
      //集团管理人员对象
      managerData: {
        userName: "",
        id: "",
        realName: ""
      },
      SkuBasicInfoParam: {
        buyingPrice: "", //采购价
        brandId: "", //品牌id
        brandName: "", //品牌名字
        categoryId: "", //三级分类id
        competingSkuPrice: "", //友商价格
        competingSkuUrl1: "", //友商链接1
        competingSkuUrl2: "", //友商链接2
        competingSkuUrl3: "", //友商链接3
        completionRate: "",
        executiveStandard: "", //执行标准
        hazardousArticleTypeList: [], //单选按钮组
        managerDataAuthorityId: "", //集团主管/经理id
        name: "", //商品名称
        origin: "", //产地
        packingList: "", //包装清单
        primaryAttributeValue: "", //模板主属性值
        primaryAttributeName: "", //模板主属性名
        sellingPrice: null, //销售价
        shelfLife: "", //保质期
        shelfLifeUnit: "", //保质期单位
        slogan: "", //广告语
        staffId: null, //集团专员id
        status: null, //
        unit: "", //单位
        warranty: null, //质保（0：无质保，1：半年质保，2：一年质保，3：两年质保，4：三年质保，5：五年质保，6：十年质保，7：终身质保）
        websitePrice: null, //官网售价（含税）
        weight: null, //重量（含包装）
        weightUnit: "千克", //重量的单位（克，千克）
        //条形码
        barcode: "",
        length: "",
        height: "",
        width: "",
        // nameEN:'',
        // brandName:'',
        afterSalesGuarantee: null, //售后保障
        packingSpecification: null, //包装规格
        specialAttribute: null, //特殊属性
        shortName: null,
        brandNameEN: null, //品牌英文名
        needSN: null, //是否需要SN码
        nameOnInvoice: null, //开票名称
        modelOnInvoice: null, //开票型号
        taxCodeId: null, //税收分类id
        taxRate: null, //税率
        taxCode:null,//税收分类编码
        taxCodeShortName:null,//税收分类简称
        relatedSkuIdList:[],//关联旧系统id集合
        relateSkuInfo:[{relatedId:'',relatedName:''}],
        staffDataAuthorityName:null,
      },
      changeName:'',
      defaultProps: {
        children: "children",
        label: "label"
      },
      needSNList: [{ value: 0, label: "否" }, { value: 1, label: "是" }],
      //管理员id
      managerId: "",
      //专员id
      staffId: "",
      //步奏条
      active: 0,
      options5: [
        { value: 0, label: "无质保" },
        { value: 1, label: "半年质保" },
        { value: 2, label: "一年质保" },
        { value: 3, label: "两年质保" },
        {
          value: 4,
          label: "三年质保"
        },
        { value: 5, label: "五年质保" },
        { value: 6, label: "十年质保" },
        { value: 7, label: "终身质保" }
      ],
      //重量的下拉选项
      options: [],
      options2: null,
      //保质期的下拉选项
      options3: [],
      options8: [],
      checkSkuNameRepeatedParam: {
        brandId: "",
        categoryId: "",
        id: "",
        primaryAttributeValue: ""
      },
      //添加商品id
      ID: "",
      value: "",
      oldID: "",
      personPhone: {
        name: [
          {
            required: true,
            message: "商品ID不能为空",
            trigger: "blur"
          },
          { min: 1, max: 15, message: "字数长度在1~15字以内" }
        ],
        phone: [
          /*{required: true, message: '联系方式不能为空', trigger: 'blur'},*/ {
            trigger: "blur"
          }
        ],
      },
      rules: {
        brandId: [
          {
            validator: checkBrandName,
            message: "商品品牌不能为空",
            trigger: "blur"
          }
        ],
        afterSalesGuarantee: [
          { required: false, message: "", trigger: "blur" },
          {
            min: 0,
            max: 100,
            message: "字数长度不能超过一百字",
            trigger: "change"
          }
        ],
        //规格型号验证
        primaryAttributeName: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { min: 1, max: 20, trigger: "change", message: "20个字以内" }
        ],
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        shortName: [
          {
            required: true,
            message: "商品自定义名称不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 100,
            trigger: "change",
            message: "商品自定义名称长度不能超过100字"
          }
        ],
        nameOnInvoice: [
          { validator:checknameOnInvoice, message: "", trigger: "change" },
          {
            min: 1,
            max: 60,
            trigger: "change",
            message: "开票名称长度不能超过60字"
          }
        ],
        modelOnInvoice: [
          { required: true, message: "开票规格型号不能为空", trigger: "blur" },
          {
            min: 1,
            max: 24,
            trigger: "change",
            message: "开票名称长度不能超过24字"
          }
        ],
        invoiceName: [
          { validator:checkInvoice,required:true, message: "税收分类名称不能为空", trigger: "blur" },
        ],
        taxCode: [
          { required: true, message: "税收分类编码不能为空", trigger: "blur" },
        ],
        taxCodeShortName:[{required:true,message:'税收分类简称不能为空',trigger:'blur'}],
        taxRate: [
          { required: true, message: "税率不能为空", trigger: "blur" },
        ],
        buyingPrice: [
          { validator: checkBuyingPrice, required: true, trigger: "blur" }
        ],
        competingSkuPrice: [
          { validator: checkCompetingSkuPrice, trigger: "blur" }
        ],
        competingSkuUrl1: [{ validator: checkURl, trigger: "blur" }],
        competingSkuUrl2: [{ validator: checkURl2, trigger: "blur" }],
        competingSkuUrl3: [{ validator: checkURl2, trigger: "blur" }],
        sellingPrice: [
          { validator: checkSellingPrice, required: true, trigger: "blur" }
        ],
        websitePrice: [
          { validator: checkWebsitePrice, required: true, trigger: "blur" }
        ],
        unit: [
          { required: true, message: "销售单位不能为空", trigger: "blur" }
        ],
        weight: [{ validator: checkWeight, trigger: "blur" }],
        length: [{ validator: checkLength, trigger: "blur" }],
        width: [{ validator: checkWidth, trigger: "blur" }],
        height: [{ validator: checkHeight, trigger: "blur" }],
        origin: [{ required: true, message: "产地不能为空", trigger: "blur" }],
        shelfLife: [
          { required: true, message: "保质期不能为空", trigger: "blur" }
        ],
        warranty: [
          {
            required: true,
            message: "质保不能为空",
            trigger: "blur",
            trigger: "change"
          }
        ],
        packingList: [
          { required: true, message: "包装清单不能为空", trigger: "blur" },
          { min: 1, max: 200, message: "长度在1~200字之间", trigger: "blur" }
        ],
        managerDataAuthorityId: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        staffDataAuthorityId: [
          { validator:checkStaff, required:true,message: "必填项不能为空", trigger: "blur" }
        ],
        needSN: [
          {
            required: true,
            message: "是否需要SN码不能为空",
            trigger: "blur",
            trigger: "change"
          }
        ],
        slogan: [
          { required: false, message: "", trigger: "blur" },
          { min: 1, max: 200, message: "长度在1~200字之间", trigger: "change" }
        ]
      },
      selectedOptions: []
    };
  },
  created() {
    this.isActive=this.$route.query.isActive;
    this.oldId=this.$route.query.oldId;
    this.ID=this.$route.query.editerID
    this.EditerGoodsId=this.$route.query.editerID;
    this.completionRate=this.$route.query.completionRate;
    this.getForm();
    this.getOneSelect()
  },
  activated(){
     if(this.$route.query.editerID&&this.EditerGoodsId!=this.$route.query.editerID){
        this.isActive=this.$route.query.isActive;
        this.oldId=this.$route.query.oldId;
        this.EditerGoodsId=this.$route.query.editerID;
        this.ID=this.$route.query.editerID
        this.completionRate=this.$route.query.completionRate;
        this.getForm();
     }
  },
  components: {
    goodsCompare
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    getForm() {
      getSkuBasicInfo(this.EditerGoodsId).then(res => {
         this.SkuBasicInfoParam = Object.assign(this.SkuBasicInfoParam,res.data);
         if(!this.SkuBasicInfoParam.relateSkuInfo){
         this.SkuBasicInfoParam.relateSkuInfo=[{relatedId:'',relatedName:''}]  
         }
         if(this.SkuBasicInfoParam.competingSkuPrice==0){
           this.SkuBasicInfoParam.competingSkuPrice=''
         }
         if(this.SkuBasicInfoParam.weight==0){
           this.SkuBasicInfoParam.weight=''
         }
         if(this.SkuBasicInfoParam.brandNameEN){
           this.SkuBasicInfoParam.brandName=this.SkuBasicInfoParam.brandName+' '+this.SkuBasicInfoParam.brandNameEN
         }
         this.checkSkuNameRepeatedParam.brandId = this.SkuBasicInfoParam.brandId;
         this.checkSkuNameRepeatedParam.categoryId = this.SkuBasicInfoParam.categoryId;
         this.checkSkuNameRepeatedParam.id = this.ID;
         this.checkSkuNameRepeatedParam.primaryAttributeValue = this.SkuBasicInfoParam.primaryAttributeValue;
        this.options2 = `${res.data.categoryName1}>${res.data.categoryName2}>${res.data.categoryName3}`;
        if (res.data.shelfLife !== "" && res.data.shelfLife !== 0) {
          this.radioValue = 1;
        } else {
          this.radioValue = 2;
        }
        if (res.data.hazardousArticleTypeList === null) {
          this.SkuBasicInfoParam.hazardousArticleTypeList = [];
        }
        if (res.data.managerData != null) {
          this.managerData.realName = res.data.managerData.realName;
          this.managerData.userName = res.data.managerData.userName;
          this.managerData.id = res.data.managerData.id;
        } else {
          this.managerData.userName = "";
          this.managerData.realName = "";
          this.managerData.id = "";
        }
        this.options7=[{id:res.data.staffData.id,userName:res.data.staffData.userName}];
        this.SkuBasicInfoParam.staffDataAuthorityId=res.data.staffData.id;
        this.SkuBasicInfoParam.staffDataAuthorityName=res.data.staffData.realName;
      }).then(res=>{
          getTaxCode(this.SkuBasicInfoParam.taxCodeId).then(res=>{
               this.options16=[{id:res.data.id,name:res.data.name}];
               this.SkuBasicInfoParam.taxCodeShortName=res.data.shortName  
               this.SkuBasicInfoParam.taxRate=res.data.taxRate  
               this.SkuBasicInfoParam.taxCode=res.data.code   
          })
      });
    },
    getOneSelect() {
      selectGoods(1, 0).then(res => {
        this.oneData = res.data;
        this.secondData = null;
        this.threeData = null;
      });
    },
    //获取二级分类
    getSecond(index) {
      this.isOneActive = index;
      this.oneName = this.oneData[index].name;
      selectGoods(2, this.oneData[index].id).then(res => {
        this.secondData = res.data;
        this.twoName = "";
        this.threeData = null;
      });
    },
    //点击三级分类的id
    getSelect(index, threeID) {
      this.isThreeActive = index;
      this.threeId = threeID;
      this.SkuBasicInfoParam.categoryId = this.threeData[index].id;
      this.threeName = this.threeData[index].name;
      findPrimary(threeID).then(res => {
        this.guige = res.data;
        this.SkuBasicInfoParam.primaryAttributeName = res.data;
        this.active = false;
        this.SkuBasicInfoParam.brandName='';
        this.SkuBasicInfoParam.brandNameEN='';
        this.options4=[]
        this.SkuBasicInfoParam.brandId=null;
        this.splicingGoods()
      }).then(res=>{
        selectTaxInfo(threeID).then(res=>{
          if(res.code=='000000'){
            this.SkuBasicInfoParam.taxCodeId=res.data.taxCodeId
            this.SkuBasicInfoParam.taxCode=res.data.taxCode
            // this.SkuBasicInfoParam.taxCodeName=res.data.taxCodeName
            this.options16=[{id:res.data.taxCodeId,name:res.data.taxCodeName}]
            this.SkuBasicInfoParam.taxCodeShortName=res.data.taxCodeShortName
            this.SkuBasicInfoParam.taxRate=res.data.taxRate
          }                          
        })
      });
    },
    //获取三级分类
    getThree(index) {
      this.isSecondActive = index;
      this.twoName = this.secondData[index].name;
      selectGoods(3, this.secondData[index].id).then(res => {
        this.threeData = res.data;
        this.threeName = "";
      });
    },
    getDataClassify(value) {
      let str = [];
      str = this.options10.filter(item => {
        return item.value == value;
      });
      this.threeId = str[0] && str[0].categoryId;
      this.SkuBasicInfoParam.categoryId = str[0] && str[0].categoryId;
      if (this.threeId) {
        findPrimary(this.threeId).then(res => {
          if (res.code == "000000") {
            if (res.data == "") {
              this.SkuBasicInfoParam.primaryAttributeName = "主键值";
            } else {
              this.SkuBasicInfoParam.primaryAttributeName = res.data;
            }
            this.guige = res.data;
            this.SkuBasicInfoParam.brandName='';
            this.SkuBasicInfoParam.brandId=null;
          }
        }).then(res=>{
          selectTaxInfo(this.threeId).then(res=>{
            if(res.code=='000000'){
            this.SkuBasicInfoParam.taxCodeId=res.data.taxCodeId
            this.SkuBasicInfoParam.taxCode=res.data.taxCode
            // this.SkuBasicInfoParam.taxCodeName=res.data.taxCodeName
            this.options16=[{id:res.data.taxCodeId,name:res.data.taxCodeName}]
            this.SkuBasicInfoParam.taxCodeShortName=res.data.taxCodeShortName
            this.SkuBasicInfoParam.taxRate=res.data.taxRate
          }                          
          })
        });
      }
      this.options12 = this.options2;
      this.active = true;
    },
    addCorrespond(){
    this.SkuBasicInfoParam.relateSkuInfo.push({relatedId:'',relatedName:''})
    },
    getNameByOldId(value,index){
      if(value){
       getNameByOldId(value).then(res=>{
       if(res.code=='000000'){
         if(res.data.length){
         this.SkuBasicInfoParam.relateSkuInfo[index].relatedName=res.data;
         }else{
           this.SkuBasicInfoParam.relateSkuInfo[index].relatedName=null;
         }
       }
      })
      }else{
        this.SkuBasicInfoParam.relateSkuInfo[index].relatedName=null;
      }
    },
    deleteRules(index){
     this.SkuBasicInfoParam.relateSkuInfo.splice(index,1) 
    },
    //拼接商品名称
    splicingGoods(){
     this.SkuBasicInfoParam.name =
        this.SkuBasicInfoParam.brandName +
        " " +
        this.SkuBasicInfoParam.primaryAttributeValue +
        " " +
        this.SkuBasicInfoParam.shortName +
        " " +
        "计价单位:" +
        this.SkuBasicInfoParam.unit;
        //字符串截取赋值给开票名称和开票规格型号
        var reg=new RegExp("null","g"); 
        var reg1=new RegExp("undefined","g"); 
        this.SkuBasicInfoParam.name=this.SkuBasicInfoParam.name.replace(reg,"")
        this.SkuBasicInfoParam.name=this.SkuBasicInfoParam.name.replace(reg1,"")
        this.changeName=this.SkuBasicInfoParam.brandName+' '+this.SkuBasicInfoParam.shortName
        this.changeName=this.changeName.replace(reg,"")
        this.changeName=this.changeName.replace(reg1,"")
        if(this.changeName.length>60){
          this.SkuBasicInfoParam.nameOnInvoice=this.changeName.substring(0,59)
        }else{
          this.SkuBasicInfoParam.nameOnInvoice=this.changeName;
        }
        if(this.SkuBasicInfoParam.primaryAttributeValue.length>24){
          this.SkuBasicInfoParam.modelOnInvoice=this.SkuBasicInfoParam.primaryAttributeValue.substring(0,23)
        }else{
          this.SkuBasicInfoParam.modelOnInvoice=this.SkuBasicInfoParam.primaryAttributeValue
        }
    },
    remoteMethodInvoice(query) {
      if (query !== "") {
        this.loading1 = true;
        findTaxCode(query).then(res => {
          if (res.code == "000000") {
            this.options16 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options16 = [];
      }
    },
    getDataInvoiceName(ee) {
      let str=[];
      str=this.options16.filter(item=>{
        return item.id==ee;
      })
      if(str.length){
      this.SkuBasicInfoParam.taxRate=str[0].taxRate
      this.SkuBasicInfoParam.taxCode=str[0].code
      this.SkuBasicInfoParam.taxCodeShortName=str[0].shortName;
      }else{
        this.SkuBasicInfoParam.taxCode=null
        this.SkuBasicInfoParam.taxRate=null
        this.SkuBasicInfoParam.taxCodeShortName=null
      }
    },
    //商品判重提示
    putOptions:debounce(function(){
     this.checkSkuNameRepeatedParam.brandId = this.SkuBasicInfoParam.brandId;
      this.checkSkuNameRepeatedParam.categoryId = this.SkuBasicInfoParam.categoryId;
      this.checkSkuNameRepeatedParam.id = this.ID;
      this.checkSkuNameRepeatedParam.primaryAttributeValue = this.SkuBasicInfoParam.primaryAttributeValue;
      recordGoodsAdd(this.checkSkuNameRepeatedParam).then(res => {
        if (res.data.length != 0) {
          this.$refs.goodsCompare.init(res.data);
        } 
          this.splicingGoods();
      });
    }),
    get() {
      if (this.radioValue == 2) {
        this.SkuBasicInfoParam.shelfLife = 0;
      }
      if (this.radioValue == 1) {
        this.SkuBasicInfoParam.shelfLife = "";
      }
    },
    //三级的分类搜索
    remoteMethodClassify(query) {
      console.log(query, 77777);
      if (query !== "") {
        this.loading4 = true;
        getClassifyRemote({ condition: query }).then(res => {
          console.log(res.data, 88888888888888);
          if (res.code == "000000") {
            var aaaaaa = res.data.map((item, index) => {
              return {
                value: `${item.firstLevelName}>${item.secondLevelName}>${item.thirdLevelName}`,
                label: index
              };
            });
            this.options10 = aaaaaa;
            this.loading4 = false;
          }
        });
      } else {
        this.options10 = [];
      }
    },
    //获取下拉框的单位
    getUNIT() {
      getUnit({ type: 1 }).then(res => {
        if (res.code == "000000") {
          this.options = res.data;
        }
      });
    },
    getUNIT2() {
      getUnit({ type: 0 }).then(res => {
        if (res.code == "000000") {
          this.options3 = res.data;
        }
      });
    },
    remoteUnit(query) {
      if (query !== "") {
        this.loading5 = true;
        let gg = { type: 0, name: query };
        getUnitRemote(gg).then(res => {
          if (res.code == "000000") {
            this.options8 = res.data;
            this.loading5 = false;
          }
        });
      } else {
        this.options8 = [];
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [
        { value: "无质保" },
        { value: "半年质保" },
        { value: "一年质保" },
        { value: "两年质保" },
        {
          value: "三年质保"
        },
        { value: "五年质保" },
        { value: "十年质保" },
        { value: "终身质保" }
      ];
    },
    //品牌名称远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        let aa = { name: query, categoryId: this.SkuBasicInfoParam.categoryId };
        remoteBrandGoodsName(aa).then(res => {
          if (res.code == "000000") {
            this.options4 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    // //选中值发生变化时触发事件
    getBrandName(value) {
      let str = [];
      str = this.options4.filter(item => {
        return (
          item.nameCN +
            (item.nameEN ? "(" : "") +
            item.nameEN +
            (item.nameEN ? ")" : "") ==
          value
        );
        ;
      });
      this.SkuBasicInfoParam.brandId = str[0] && str[0].id;
      if(str[0]&&str[0].nameEN){
      this.SkuBasicInfoParam.brandName =  str[0].nameCN+'('+str[0].nameEN+')';
      }else{
       this.SkuBasicInfoParam.brandName=str[0].nameCN
      }
      this.SkuBasicInfoParam.brandNameEN = str[0] && str[0].nameEN;
      this.splicingGoods()
    },
    //管理员账号的远程搜索
    remoteMethodUsername(query) {
      if (query !== "") {
        this.loading2 = true;
        let aa = { count: 5, userName: query };
        getUsername(aa).then(res => {
          if (res.code == "000000") {
            this.options6 = res.data;
            this.loading2 = false;
          }
        });
      } else {
        this.options6 = [];
      }
    },
    //选中值发生变化时触发事件
    getUSERNAME(ee) {
      if (!ee) {
        this.managerData.id = 0;
        this.managerData.realName = null;
      } else {
        let hhh = JSON.parse(JSON.stringify(this.options6));
        hhh = hhh.filter(item => {
          return item.userName == ee;
        });
        this.managerData.id = hhh[0].id;
        this.managerData.realName = hhh[0].realName;
      }
    },
    remoteMethodUsernameCommissioner(query) {
      if (query !== "") {
        this.loading3 = true;
        let dd = { count: 5, userName: query };
        getUsername(dd).then(res => {
          if (res.code == "000000") {
            this.options7 = res.data;
            this.loading3 = false;
          }
        });
      } else {
        this.options7 = [];
      }
    },
    //选中值发生变化时触发事件
    getUSERNAMECOMMISS(ee) {
        let jjj = [];
        jjj = this.options7.filter(item => {
          return item.id == ee;
        });
        this.SkuBasicInfoParam.staffDataAuthorityId = jjj[0]&&jjj[0].id;
        this.SkuBasicInfoParam.staffDataAuthorityName = jjj[0]&&jjj[0].realName;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleChange(value) {
      console.log(value);
    },
    //提交验证
    submitForm(formName) {
      this.SkuBasicInfoParam.relatedSkuIdList=this.SkuBasicInfoParam.relateSkuInfo.filter((item)=>{
        return item.relatedId
      }).map(item=>{
        return item.relatedId
      })
      // this.SkuBasicInfoParam.relatedSkuIdList=this.SkuBasicInfoParam.relateSkuInfo.map(item=>{
      //   return item.relatedId
      // })
      if (this.radioValue == 2) {
        this.SkuBasicInfoParam.shelfLife = 0;
      }
      this.SkuBasicInfoParam.managerDataAuthorityId = this.managerData.id;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.$route.query.oldId==0&&this.$route.query.isActive==2||this.$route.query.isActive==0){
            updateSkuBasicInfo(
                this.EditerGoodsId,
                this.SkuBasicInfoParam
              ).then(res => {
                if (res.code === "000000") {
                  this.$message({
                    message: "保存至草稿成功",
                    type: "success"
                  });
                  this.ID = res.data.id;
                  this.close({name:'EditerGoods',to:{name:'GoodsManage',params:{isUpdate:true}}})
                }
              });
          }else{
           recordGoodsAdd(this.checkSkuNameRepeatedParam).then(res => {
            if (res.data.length != 0) {
              this.draftOrAuditer='保存到草稿'
              this.$refs.goodsCompare.init(res.data);
            }else{
              updateSkuBasicInfo(
                this.EditerGoodsId,
                this.SkuBasicInfoParam
              ).then(res => {
                console.log(res);
                if (res.code === "000000") {
                  this.$message({
                    message: "保存至草稿成功",
                    type: "success"
                  });
                  this.ID = res.data.id;
                  this.close({name:'EditerGoods',to:{name:'GoodsManage',params:{isUpdate:true}}})
                }
              });
            } 
          });
          }
          
        } else {
          return false;
        }
      });
    },
    disCallback(){
      if(this.draftOrAuditer=='保存到草稿'){
        //验证通过，保存至草稿
              updateSkuBasicInfo(
                this.EditerGoodsId,
                this.SkuBasicInfoParam
              ).then(res => {
                if (res.code === "000000") {
                  this.$message({
                    message: "保存至草稿成功",
                    type: "success"
                  });
                  this.ID = res.data.id;
                  this.close({name:'EditerGoods',to:{name:'GoodsManage',params:{isUpdate:true}}})
                }
              });
      }else if(this.draftOrAuditer=='保存到下一步'){
          //保存至草稿
          updateSkuBasicInfo(this.EditerGoodsId, this.SkuBasicInfoParam).then(
            res => {
              if (res.code === "000000") {
                this.$message({
                  message: "保存至下一步成功",
                  type: "success"
                });
                this.ID = res.data.id;
                this.oldID = res.data.id;
          this.close({name:'EditerGoods',to:{name:'EditerParams',query:{goodsID: this.ID,oldID: this.oldID,completionRate: this.completionRate,isActive: this.isActive},params:{isUpdate:true}}})
              }
            }
          );
      }
    },
    resetForm(formName) {
      this.SkuBasicInfoParam.relatedSkuIdList=this.SkuBasicInfoParam.relateSkuInfo.filter((item)=>{
        return item.relatedId
      }).map(item=>{
        return item.relatedId
      })
      // this.SkuBasicInfoParam.relatedSkuIdList=this.SkuBasicInfoParam.relateSkuInfo.map(item=>{
      //   return item.relatedId
      // })
      //保质期如果为无，传0
      if (this.radioValue == 2) {
        this.SkuBasicInfoParam.shelfLife = 0;
      }
      this.SkuBasicInfoParam.managerDataAuthorityId = this.managerData.id;
      if(this.$route.query.oldId==0&&this.isActive==2||this.isActive==0){
         updateSkuBasicInfo(this.EditerGoodsId, this.SkuBasicInfoParam).then(
            res => {
              if (res.code === "000000") {
                this.$message({
                  message: "保存至下一步成功",
                  type: "success"
                });
                this.ID = res.data.id;
                this.oldID = res.data.id;
                this.close({name:'EditerGoods',to:{name:'EditerParams',query:{goodsID: this.ID,oldID: this.oldID,completionRate: this.completionRate,isActive: this.isActive},params:{isUpdate:true}}})
              }
            }
          );
      }else{
        recordGoodsAdd(this.checkSkuNameRepeatedParam).then(res => {
        if (res.data.length != 0) {
          this.draftOrAuditer='保存到下一步'
          this.$refs.goodsCompare.init(res.data);
        }else{
           updateSkuBasicInfo(this.EditerGoodsId, this.SkuBasicInfoParam).then(
            res => {
              if (res.code === "000000") {
                this.$message({
                  message: "保存至下一步成功",
                  type: "success"
                });
                this.ID = res.data.id;
                this.oldID = res.data.id;
                  this.close({name:'EditerGoods',to:{name:'EditerParams',query:{goodsID: this.ID,oldID: this.oldID,completionRate: this.completionRate,isActive: this.isActive},params:{isUpdate:true}}})
              }
            }
          );
        } 
      });
      }
     
    }
  }
};
</script>

<style lang="less" scoped>
.addGoodsBox {
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .stepBox {
    margin: 20px 50px;
  }
  .headerBox {
    height: 50px;
    background: #f3f3f3;
    border-bottom: 1px solid #e4e4e4;
    span {
      line-height: 50px;
      margin-left: 50px;
    }
  }
  .el-form {
    padding: 20px 100px 0 100px;
    color: #606266;
    .el-form-item {
      .el-input {
        width: 400px;
        height: 40px;
      }
      .tipBox {
        height: 20px;
        font-size: 12px;
        margin-left: 60px;
      }
      .el-form-item_err {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
      }
      .el-form-item__err.sousuoBox {
        left: 535px !important;
      }
    }
    .listBox {
      width: 600px;
      box-sizing: border-box;
      .listLeftBox {
        padding: 0 10px;
        width: 200px;
        .headerBox {
          height: 35px;
          border: 1px solid #e4e4e4;
          span {
            color: red;
            line-height: 36px;
          }
        }
      }
      .listRightBox {
        width: 200px;
        padding: 0 10px;
        .headerBox {
          height: 35px;
          border: 1px solid #e4e4e4;
          span {
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }
      }
    }
  }
}
</style>


<style lang="less" scoped>
.addGoodsBox {
  .dialogBox {
    .el-dialog {
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__body {
        text-align: center;
      }
      .el-icon-close {
        color: #f3f3f3;
      }
    }
  }
  .mainBox {
    .el-form {
      .el-form-item {
        .el-select-dropdown .el-popper {
          z-index: 2500 !important;
        }
      }
    }
  }
}
</style>




