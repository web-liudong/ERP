<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="200px"
    class="demoManage-ruleForm"
  >
    <div class="editerBrandBox clear">
      <div class="h50 headerBox">
        <span>组织机构基本信息</span>
      </div>
      <el-form-item label="组织机构公司名称：" prop="name">
          <span slot="label">组织机构公司名称：</span>
        <el-input v-model="ruleForm.name" maxlength="30" @blur="compare()" placeholder="字数长度1~30以内"></el-input>
      </el-form-item>
      <el-form-item label="组织机构公司简称：" prop="shortName">
        <el-input v-model="ruleForm.shortName" placeholder="字数长度1~15以内"></el-input>
      </el-form-item>
      <el-form-item label="组织机构公司性质：" prop="organizationType">
        <el-radio-group v-model="ruleForm.organizationType">
          <el-radio label="FULL_CAPITAL">全资</el-radio>
          <el-radio label="HOLDING">控股</el-radio>
          <el-radio label="SHARE_HOLDING">参股</el-radio>
          <el-radio label="JOIN_IN">加盟</el-radio>
          <el-radio label="SPECIAL_SUPPLIER">特约供应商</el-radio>
        </el-radio-group>
      </el-form-item>
       <el-form-item v-if="false" label="所属上级id" prop="parentId">
        <el-input v-model="ruleForm.parentId" v-if="false"></el-input>
      </el-form-item>
      <el-form-item label="所属上级：" prop="parentName">
        <el-select
          v-model="ruleForm.parentName"
          filterable
          remote
          reserve-keyword
          placeholder="请选择所属上级"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 400px;"
          clearable
          @change="getParent"
          @clear="getClear"
        >
          <el-option
            v-for="item in options1"
            :key="item.name"
            :label="item.label"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组织机构公司法人：" prop="legalPersonName">
        <el-input v-model="ruleForm.legalPersonName" placeholder="输入姓名，字数长度在1~15字以内"></el-input>
      </el-form-item>
      <el-form-item label="法人身份证号：" prop="legalPersonIdCard">
        <span slot="label">
          <i style="color: red">*</i>法人身份证号：
        </span>
        <el-input v-model="ruleForm.legalPersonIdCard" placeholder="18位身份证号"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <i style="color: red">*</i>统一社会信用代码：
        </span>
        <el-input v-model="ruleForm.socialCreditCode" placeholder="字数长度1~100以内"></el-input>
        <li style="font-size: 12px">统一社会信用代码：是指工商营业执照、组织机构代码证、税务登记证的统称</li>
      </el-form-item>
         <el-form-item label="是否使用领先WMS系统：" prop="useLeadingWMS">
        <el-radio-group v-model="ruleForm.useLeadingWMS">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
       <el-form-item label="是否签订协议：" prop="signedAgreement">
        <el-radio-group v-model="ruleForm.signedAgreement">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-show="ruleForm.signedAgreement==true">
        <el-form-item label="协议类型：" :prop="ruleForm.signedAgreement?'agreementType':''">
        <el-select v-model="ruleForm.agreementType" clearable placeholder="请选择" style="width:400px;">
            <el-option
              v-for="item in options4"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
       <el-form-item label="协议编号：" :prop="ruleForm.signedAgreement?'agreementNo':''">
       <span slot="label">
          协议编号：
        </span>
        <el-input v-model="ruleForm.agreementNo" placeholder="字数长度1~50字以内"></el-input>
      </el-form-item>
      </div>
      <el-form-item label="组织机构所在地：" prop="countyId">
        <el-select
          v-model="ruleForm.provinceId"
          filterable
          placeholder="选择省/直辖市"
          style="width: 130px;z-index:10007"
          @change="o1change"
          :popper-append-to-body="false"
        >
          <el-option v-for="o in o1" :key="o.id" :label="o.name" :value="o.id"></el-option>
        </el-select>
        <el-select
          v-model="ruleForm.cityId"
          filterable
          placeholder="选择城市"
          style="width: 130px;z-index:10007"
          @change="o2change"
          :popper-append-to-body="false"
        >
          <el-option v-for="o in o2" :key="o.id" :label="o.name" :value="o.id"></el-option>
        </el-select>
        <el-select
          v-model="ruleForm.countyId"
          filterable
          placeholder="选择区/夏"
          style="width: 130px;z-index:10007"
          @change="o3change"
          :popper-append-to-body="false"
        >
          <el-option v-for="o in o3" :key="o.id" :label="o.name" :value="o.id"></el-option>
        </el-select>
      </el-form-item>
      <!--详细地址-->
      <el-form-item prop="addressLine" style="margin-top: 10px;">
        <i style="color: red;position: absolute;top: -12px;left: 4px">*</i>
        <el-input
          type="textarea"
          :rows="5"
          style="width: 400px"
          v-model="ruleForm.addressLine"
          placeholder="请输入详细地址，字数1~200以内"
        ></el-input>
      </el-form-item>
      <div class="morerules">
        <div
          class="moreRulesIn"
          v-for="(item,index) in ruleForm.organizationContacts"
          :key="item.key"
          style=""
        >
         <div class="rowBox" style="display:flex;">
          <el-form-item
            class="rules"
            :prop="'organizationContacts.'+index+'.name'"
            :rules="personPhone.name"
            style="flex-direction: row;align-items: flex-start"
          >
            <span slot="label">组织机构负责人{{index+1}}：</span>
            <el-input v-model="item.name" placeholder="字数长度1~15字以内" style="width: 200px"></el-input>
            
          </el-form-item>
          <el-form-item
            class="rules"
            :prop="'organizationContacts.'+index+'.phone'"
            :rules="personPhone.phone"
            style="flex-direction: row;align-items: flex-start"
          >
            <span slot="label">联系方式{{index+1}}：</span>
            <el-input v-model="item.phone" placeholder="固定电话或手机号" style="width: 200px"></el-input>
            <el-button type="primary" v-if="index==0" @click="addPerson()">新增联系人</el-button>
            <el-button @click="deleteRules(item, index)" v-if="index!=0">删除</el-button>
          </el-form-item>
           </div>
           <div class="rowBox">
          <el-form-item class="rules" :prop="'organizationContacts.'+index+'.description'" :rules="personPhone.description">
               <el-input v-model="item.description" placeholder="备注：100字以内" style="width:45%"></el-input>
          </el-form-item>
        </div>
          
        </div>
      </div>
      <div style="display: flex;margin-bottom: 10px">
        <el-form-item v-if="false" label="管理员id："  style="flex: 1">
          <el-input v-model="ruleForm.userDataAuthorityId" placeholder="通过账号直接关联人名" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item
          label="管理员账号："
          prop="userDataAuthorityName"
          style="flex-direction: row;align-items: flex-start"
        >
        <span slot="label">
          管理员账号：
        </span>
          <el-select
            v-model="ruleForm.userDataAuthorityName"
            filterable
            remote
            reserve-keyword
            placeholder="请选择管理员账号"
            :remote-method="remoteMethod1"
            :loading="loading1"
            style="width: 300px;z-index:10007"
            clearable
            @change="goRealName"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in options2"
              :key="item.userName"
              :label="item.label"
              :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员姓名：" prop="adminname" style="flex: 1">
          <el-input v-model="realName" style="width: 300px;" disabled placeholder="通过账号直接关联人名"></el-input>
        </el-form-item>
      </div>

      <div class="h50 headerBox" style="border-top: 1px solid #E4E4E4;">
        <span>组织机构经营区域</span>
      </div>
      <el-form-item label="组织机构经营区域：" prop="data4" class="listBox">
        <span slot="label">
         组织机构经营区域：
        </span>
        <div class="listLeftBox left">
          <div class="headerBox">
            <span>经营区域选项列表</span>
          </div>
          <!-- <div class="headerBox">
            <el-checkbox v-model="checked" @change="getCheck()">全选</el-checkbox>
          </div> -->
          <div class="lltree">
            <el-tree
               ref="tree"
              :data="data2"
              show-checkbox
              node-key="id"
              render-after-expand
              @check="getnode(data2)"
              :default-expanded-keys="[rootNode]"
              :default-checked-keys="ruleForm.data4"
              :props="defaultProps"
            ></el-tree>
          </div>
        </div>
        <div class="listRightBox left">
          <div class="headerBox">
            <span>已选经营区域预览</span>
          </div>
          <div class="lltree" style="position: relative;">
            <el-tree
              :data="data2"
              ref="tree2"
              node-key="id"
              render-after-expand
              :filter-node-method="filterNode"
              :props="defaultProps"
            ></el-tree>
            <el-input
              v-model="ruleForm.classify"
              style="position:absolute;top: 0px;width: 1px;height: 1px;opacity: 0;padding: 0;z-index: -1;"
            ></el-input>
          </div>
        </div>
      </el-form-item>

      <div class="moreRulesIn">
        <div class="h50 headerBox" style="border-top: 1px solid #E4E4E4;">
          <span>组织机构收票信息</span>
        </div>
        <el-form-item label="收票人姓名：" class="rules" prop="receiver">
          <el-input v-model="ruleForm.receiver" placeholder="字数长度1~15字以内"></el-input>
        </el-form-item>
        <el-form-item label="收票人电话：" class="rules" prop="receiverPhone">
          <span slot="label">
          收票人电话：
        </span>
          <el-input v-model="ruleForm.receiverPhone" placeholder="手机号或固定电话"></el-input>
        </el-form-item>
        <el-form-item label="收票地址：">
          <el-select
            v-model="ruleForm.receiverProvinceId"
            filterable
            clearable
            placeholder="选择省/直辖市"
            style="width: 130px;z-index:10007"
            @change="o4change"
            :popper-append-to-body="false" 
          >
            <el-option v-for="(o,i) in o4" :key="i" :label="o.name" :value="o.id"></el-option>
          </el-select>
          <el-select
            v-model="ruleForm.receiverCityId"
            filterable
            clearable
            placeholder="选择城市"
            style="width: 130px;z-index:10007"
            @change="o5change"
            :popper-append-to-body="false"
          >
            <el-option v-for="(o,i) in o5" :key="i" :label="o.name" :value="o.id"></el-option>
          </el-select>
          <el-select
            v-model="ruleForm.receiverCountyId"
            filterable
            clearable
            placeholder="选择区/县"
            style="width: 130px;z-index:10007"
            @change="o6change"
            :popper-append-to-body="false"
          >
            <el-option v-for="(o,i) in o6" :key="i" :label="o.name" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="receiverAddressLine" style="margin-top: 10px;position: relative">
          <!-- <i style="color: red;position: absolute;top: -12px;left: 4px">*</i> -->
          <el-input
            type="textarea"
            style="width: 400px"
            :rows="5"
            v-model="ruleForm.receiverAddressLine"
            placeholder="请输入详细地址，字数1~200以内"
          ></el-input>
        </el-form-item>
      </div>

      <div v-for="(item,index) in ruleForm.organizationInvoiceInfos" :key="item.key">
        <div class="h50 headerBox" style="border-top: 1px solid #E4E4E4;">
          <span>组织机构开票信息</span>
          <!-- <span>
            <el-button
              style="margin-left: 360px"
              @click="delorganizationInvoiceInfos(item,index)"
              v-if="index!=0"
            >删除</el-button>
          </span> -->
        </div>
        <el-form-item
          label="发票类型："
          :prop="'organizationInvoiceInfos.'+index+'.organizationInvoiceInfoTypeName'"
          :rules="opbank.organizationInvoiceInfoTypeName"
          v-if="false"
        >
          <el-radio-group v-model="ruleForm.organizationInvoiceInfos[0].organizationInvoiceInfoType">
            <!-- <el-radio label="VAT_INVOICE">专票</el-radio>
            <el-radio label="GENERAL_INVOICE">普票</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="开票抬头："
          :prop="'organizationInvoiceInfos.'+index+'.invoiceTitle'"
          :rules="opbank.invoiceTitle"
        >
          <span slot="label">
           <i style="color:red">*</i>
               开票抬头:
          </span>
          <span>{{ruleForm.name}}</span>
        </el-form-item>
        <el-form-item
          label="统一社会信用代码："
          :prop="'organizationInvoiceInfos.'+index+'.socialCreditCode'"
        >
          <span slot="label">
            <i style="color:red">*</i>统一社会信用代码：
          </span>
          <span style="color: red;">{{ruleForm.socialCreditCode}}</span>
        </el-form-item>
        <div>
          <el-form-item
            label="开户行："
            :prop="'organizationInvoiceInfos.'+index+'.bank'"
            :rules="opbank.bank"
          >
            <el-input v-model="ruleForm.organizationInvoiceInfos[0].bank" placeholder="银行+支行信息，字数长度1~50字以内"></el-input>
          </el-form-item>
          <el-form-item
            label="开户名称："
          >
            <el-input v-model="ruleForm.name" disabled placeholder="字数长度1~50字以内"></el-input>
          </el-form-item>
          <el-form-item
            label="开户账号："
            :prop="'organizationInvoiceInfos.'+index+'.accountNo'"
            :rules="opbank.accountNo"
          >
            <el-input v-model="ruleForm.organizationInvoiceInfos[0].accountNo" placeholder="字数长度1~50字以内"></el-input>
          </el-form-item>
          <el-form-item
            label="开票地址："
            :prop="'organizationInvoiceInfos.'+index+'.addressOnInvoice'"
            :rules="opbank.addressOnInvoice"
          >
            <el-input
              type="textarea"
              style="width: 400px"
              :rows="5"
              v-model="ruleForm.organizationInvoiceInfos[0].addressOnInvoice"
              placeholder="输入地址，字数1~50以内"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开票电话："
            :prop="'organizationInvoiceInfos.'+index+'.phoneOnInvoice'"
            :rules="opbank.phoneOnInvoice"
          >
            <span slot="label">
              <i style="color: red">*</i>开票电话：
            </span>
            <el-input v-model="ruleForm.organizationInvoiceInfos[0].phoneOnInvoice" placeholder="输入电话，字数1~15以内"></el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item>
          <el-button type="primary" @click="addorganizationInvoiceInfos()">新增开票信息</el-button>
        </el-form-item> -->
      </div>
      <div class="h50 headerBox" style="border-top: 1px solid #E4E4E4;">
        <span>组织机构银行账号信息</span>
      </div>
        <el-form-item
            label="设置机构收款账号："
            class="rules"
            prop="organizationBankAccounts"
          >
            <span slot="label">
              设置机构收款账号：
            </span>
           <el-button type="" @click="addOrganizationBankAccounts({'title':'添加收款账号'})">添加收款账号</el-button>
       <el-table :data="ruleForm.organizationBankAccounts" border style="width: 70%;margin-top:20px" size="small">
          <el-table-column prop="bank" label="开户行" align="center">
            <template slot="header">
              <span><i style="color:red;">*</i>开户行</span>
            </template>
            <template slot-scope="scope">
              <span style="color:red" v-if="scope.row.isDefault">(默认)</span>
              <span>{{scope.row.bank}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bankNo" label="开户银行编号" align="center">
             <template slot="header">
              <span><i style="color:red;">*</i>开户银行编号</span>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row.bankNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="开户名" align="center">
             <template slot="header">
              <span><i style="color:red;">*</i>开户名</span>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row.accountName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountNo" label="开户账号" align="center">
             <template slot="header">
              <span><i style="color:red;">*</i>开户账号</span>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row.accountNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="editerAccounts({row:scope.row,index:scope.$index,'title':'编辑收款账号'})">编辑</el-button>
              <el-button type="text" @click="deleteAccounts(scope.row,scope.$index)">删除</el-button>
              <el-button type="text" v-if="!scope.row.isDefault" @click="defaultAccounts(scope.row,scope.$index)">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table> 
      </el-form-item>
    </div>
    <div style="margin:20px 50px 100px 200px">
        <el-button type="primary" @click="submitForm('ruleForm')" v-waves>保存至草稿</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">保存并提交审核</el-button>
       </div>
    <bankAccounts ref="bankAccounts" @callback="accountsCallback"></bankAccounts>   
  </el-form>
</template>

<script>
import "@/components/system/organization/AddOrganization.less";
import waves from "@/directive/waves";
import {
  provinces_based_id,
  getTreeAll,
  category,
  subs,
  submitDraft,
  createSubmitReviewSupplier
} from "@/api/basicSupplier";
import {
  gobackinforation,
  fuzzySearch,
  getusername,
  findDetailInformation,
  getName,
  organizationGotoDraft,
  updateOrganizationAuditer,
  getRegion,
  getRepeatName,
  findBankList
} from "@/api/organizationManage";
import bankAccounts from './child/bank_accounts.vue'
export default {
  inject: ["reload",'close'],
  name:"EditerOrganization",
  data() {
      var checkOrganizationName=(rule,value,callback)=>{
          if(!value){
            return callback(new Error('组织机构公司名称不能为空'))
          }
          /**
           * 只允许出现[]内字符
           */
       //   private static final String BRAND_EN_CHECK = "^[0-9a-zA-Z]+$";

          /**
           * 不包含[]内返回true，包含返回false
           */
         // private static final String BRAND_SYMBOL_CHECK = "^[^\"'”“‘’\r\n/\\\\]+$";
          var reg = /^[^"'”“‘’\r\n/\\\\]+$/;
          if(reg.test(value)===false){
           callback(new Error('组织机构公司名称格式不对'))
          }else if (1>value.length>50) {
               callback(new Error('长度在1~50个字之间'))
          }else {
            callback()
          }
        }
    var CheckSocialCreditCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("统一社会信用编码不能为空"));
      } 
      value = value.trim();
      var patrn = /^[0-9A-Z]+$/;
      //18位校验及大写校验
      if (value.length != 18 || patrn.test(value) == false) {
        return callback(new Error("不是有效的统一社会信用编码!"));
      } else {
        var Ancode; //统一社会信用代码的每一个值
        var Ancodevalue; //统一社会信用代码每一个值的权重
        var total = 0;
        var weightedfactors = [
          1,
          3,
          9,
          27,
          19,
          26,
          16,
          17,
          20,
          29,
          25,
          13,
          8,
          24,
          10,
          30,
          28
        ]; //加权因子
        var str = "0123456789ABCDEFGHJKLMNPQRTUWXY";
        //不用I、O、S、V、Z
        for (var i = 0; i < value.length - 1; i++) {
          Ancode = value.substring(i, i + 1);
          Ancodevalue = str.indexOf(Ancode);
          total = total + Ancodevalue * weightedfactors[i];
          //权重与加权因子相乘之和
        }
        var logiccheckcode = 31 - (total % 31);
        if (logiccheckcode == 31) {
          logiccheckcode = 0;
        }
        var Str =
          "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
        var Array_Str = Str.split(",");
        logiccheckcode = Array_Str[logiccheckcode];
        var checkcode = value.substring(17, 18);
        if (logiccheckcode != checkcode) {
          return callback(new Error("不是有效的统一社会信用编码!"));
        } else {
          callback();
        }
        callback();
      }
    };
    var checkLegalPersonIdCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("身份证号码不能为空"));
      } else {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(value) === false) {
          callback(new Error("身份证输入不合法"));
        }
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码或座机不能为空"));
      } else {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if (isMob.test(value) || isPhone.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号码格式"));
        }
      }
    };
      var checkReceiverPhone = (rule, value, callback) => {
       if(value){
          var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if (isMob.test(value) || isPhone.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号码格式"));
        }  
       }else{
         callback()
       }
        
    };
    return {
      checkNameRepeatedParam: {
        name: "",
        organizationId: this.$route.query.id
      },
      ID: null,
      index: "",
      //组织机构开票信息
      //开票信息2的显示
      //省市县
      o1: [],
      o2: [],
      o3: [],
      o4:[],
      o5:[],
      o6:[],
      d: "",
      e: "",
      rootNode:[],
      options: [],
      options1: [],
      options2: [],
      options3: [],
      options4: [{value:1,label:'战略协议'},{value:2,label:'交叉持股'}],
      list: [],
      states: [],
      loading: false,
      loading1: false,
      loading2: false,
      fileList3: [],
      ruleForm: {
        agreementType:'',//协议类型
        signedAgreement:'',//是否签订协议
        useLeadingWMS:null,//是否使用领先WMS系统
        agreementNo:'',//协议编号
        name: "", //组织机构公司名称
        shortName: "", //公司简称
        organizationType: "", //公司性质
        parentId: null, //所属上级id
        parentName:'',
        legalPersonName: "", //法人姓名
        legalPersonIdCard: "", //法人身份证号
        socialCreditCode: "", //统一社会信用代码
        data4: [],
        organizationBankAccounts: [
          {
            bank: "",
            accountNo: "",
            accountName: "",
            bankNo:'',
          }
        ], //组织机构银行账号集合
        organizationContacts: [
          {
            name: "",
            phone: ""
          },
          { name: "", phone: "" }
        ], //组织机构负责人集合
        organizationInvoiceInfos: [
          {
            accountName: null,
            accountNo: null,
            addressOnInvoice: null,
            bank: null,
            invoiceTitle: null,
            organizationInvoiceInfoType: 'VAT_INVOICE',
            phoneOnInvoice: null,
            socialCreditCode: null
          }
        ], //组织机构开票信息集合
        cityId: "", //市
        countyId: "", //县
        provinceId: "", //省
        regionIds: [
          //区域ID集合
        ],
        addressLine: "", //祥细地址
        userDataAuthorityId: "", //管理员id,
        userDataAuthorityName:'',
        receiver: "", //收票人姓名
        receiverAddressLine: "", //收票人地址
        receiverCityId: null, //收票人市id
        receiverProvinceId:null, //收票人省id
        receiverCountyId: null, //收票人区id
        receiverPhone: "" //收票人电话
      },
      realName: "", //管理员姓名
      checked:false,
      cities: [],
      data2: [],
      defaultProps: {
        children: "childrenDTOs",
        label: "name"
      },
      //新增联系人的验证
      personPhone: {
        name: [
          {
            required: true,
            message: "组织机构负责人不能为空",
            trigger: "blur"
          },
          { min: 1, max: 15, message: "字数长度在1~15字以内" }
        ],
        phone: [
          /*{required: true, message: '联系方式不能为空', trigger: 'blur'},*/ {
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        description: [
          {min:0,max:100, message: '备注信息在100字以内', trigger: 'change'}        
        ]
      },
      bank:{
         openingBank: [
          {
          required:true,message:'开户行不能为空',trigger:'blur'
          },
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ],
         bankNo:[
          {required:true,message:'开户银行编号不能为空',trigger:'blur',trigger:'change'}
        ],
        accountNo: [
          {
           required:true,message:'开户账号不能为空',trigger:'blur'
          },
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ]
      },
      rules: {
        useLeadingWMS:[{required:true,message:'是否使用领先WMS系统不能为空',trigger:'blur'}],
        signedAgreement:[{required:true,message:'是否签订协议不能为空',trigger:'blur'}],
        agreementNo:[{required:true,message:'协议编号不能为空',trigger:'blur'},{min:1,max:50,message:'长度在1~50字以内',trigger:'change'}],
        agreementType:[{required:true,message:'协议类型不能为空',trigger:'blur'}],
        receiver: [
          // { required: true, message: "收票人姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "字数长度在1~15字以内",
            trigger: "change"
          }
        ],
        organizationBankAccounts:[{required:true,message:'收款账号信息不能为空',trigger:'blur',trigger:'change'}],
        receiverPhone: [{ validator: checkReceiverPhone, trigger: "blur" ,trigger:'change'}],
        // receiverCountyId: [
        //   // { required: true, message: "收票人区县不能为空", trigger: "blur" }
        // ],
        // receiverProvinceId: [
        //   { required: true, message: "收票人省不能为空", trigger: "blur" }
        // ],
        receiverAddressLine: [
          // { required: true, message: "收票地址不能为空", trigger: "blur" },
          { min:1,max:200, message: "收票地址长度在1~200字之间", trigger: "change" }
        ],

        //管理员账号
        userDataAuthorityName: [
          { required: true, message: "管理员账号不能为空", trigger: "blur" }
        ],
        addressLine: [
          {
            required: true,
            message: "组织机构的详细地址不能为空",
            trigger: "blur"
          },
          { min:1,max:200, message: "详细地址长度在1~200字之间", trigger: "change" }
        ],
        countyId: [
          { required: true, message: "组织机构所在地不能为空", trigger: "blur" }
        ],
        //组织机构名称
        name: [
          {
            required: true,
            validator:checkOrganizationName,
            trigger: "change"
          },
          {
            min: 1,
            max: 30,
            message: "字数长度1~30字以内",
            trigger: "change"
          }
        ],
        data4:[{required:true,message:'组织机构经营区域不能为空',trigger:'blur'}],
        //简称
        shortName: [
          {
            min: 1,
            max: 15,
            message: "字数长度1~15字以内",
            trigger: "change"
          }
        ],
        //组织机构性质
        organizationType: [
          {
            required: true,
            message: "组织机构公司性质不能为空",
            trigger: "blur"
          }
        ],
        supplierGradeLevel: [
          {
            required: true,
            message: "请选择供应商等级",
            trigger: "change"
          }
        ],
        provinceId: [
          {
            required: true,
            message: "请选择省",
            trigger: "change"
          }
        ],
        //法人姓名
        legalPersonName: [
          {
            required: true,
            message: "法人姓名不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 15,
            message: "字数长度在1~15字以内",
            trigger: "change"
          }
        ],
        //身份证校验
        legalPersonIdCard: [
          { validator: checkLegalPersonIdCard, trigger: "blur" }
        ],
        organizationperson: [
          {
            required: true,
            message: "组织机构负责人不能为空",
            trigger: "blur"
          }
        ],
        //统一社会信用代码
        // socialCreditCode: [
        //   {
        //     validator: CheckSocialCreditCode,
        //     trigger: "blur"
        //   }
        // ],
        businessScope: [
          {
            required: true,
            message: "税号规格错误",
            trigger: "blur"
          }
        ],
        supplierTaxLevel: [
          {
            required: true,
            message: "请选择组织机构公司性质",
            trigger: "blur"
          }
        ],
        openingBank: [
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ],
        AccountName: [
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ]
      },
      opbank: {
        organizationInvoiceInfoTypeName: [
          { required: true, message: "发票类型不能为空", trigger: "blur" }
        ],
        accountNo: [
          { required: true, message: "开户账号不能为空", trigger: "blur" },{min:1,max:50,message:'开户账号不能为空',trigger:'change'}
        ],
        bank: [
          { required: true, message: "开户行不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ],
        accountName: [
          { required: true, message: "开户名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ],
        addressOnInvoice: [
          { required: true, message: "开票地址不能为空", trigger: "blur" },
          { min:1,max:50, message: "开票地址长度在1~50字之间", trigger: "change" }
        ],
        phoneOnInvoice: [{ validator: checkPhone, trigger: "blur" }]
      },
      seesId: "",
      aaaaaaa: null
    };
  },
  directives: {
    waves
  },
  watch: {
    defaultProps(a, b) {
      console.log(a);
    },
    fileList3(a) {
      console.log(a);
    },
    name: function() {
      this.ruleForm.organizationInvoiceInfos.foreach(item => {
        item.invoiceTitle = this.ruleForm.name;
        item.socialCreditCode = this.ruleForm.socialCreditCode;
      });
    }
  },
  components:{
   bankAccounts
  },
  created() {
    this.ID=this.$route.query.id;
    provinces_based_id().then(res => {
      this.o1 = res.data;
      this.o4=res.data;
      this.cities = res.data;
    });
    this.isgetTreeAll();
    this.getForm();
  },
  activated(){
   if(this.ID!=this.$route.query.id){
     this.getForm();
     this.isgetTreeAll()
   }
  },
  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
    this.getnode();
  },
  filters: {
    type(value) {
      return value ? value.name : "";
    }
  },
  methods: {
    compare() {
      if(this.ruleForm.name!=''){
      var reg = /^[^"'”“‘’\r\n/\\\\]+$/;
       if(reg.test(this.ruleForm.name)===false){
           this.$message({
             message:'组织机构公司名称格式不对',
             type:'error'
           })
      }else{
       this.checkNameRepeatedParam.name = this.ruleForm.name;
        getRepeatName(this.checkNameRepeatedParam).then(res => {
        if (res.data == true) {
          this.$message({
            message: "该名称可用",
            type: "success"
          });
        } else {
          this.$message({
            message: "该名称已占用，请重新填写",
            type: "error"
          });
        }
       });
      } 
      }
      this.item.accountName=this.ruleForm.name;
    },
     getCheck(){
     if(this.checked){
        this.$refs.tree.setCheckedNodes(this.data2);
        this.getnode()
     }else{
       this.$refs.tree.setCheckedKeys([]);
       this.getnode()
     }
    },
    getClear(){
       this.ruleForm.parentId=0
       this.ruleForm.parentName=null
    },
    //数据回显
    getForm() {
      findDetailInformation(this.ID)
        .then(res => {
          this.ruleForm = res.data;
          if(res.data.parentId==0){
            this.ruleForm.parentId=null;
          }
          if(res.data.organizationBankAccounts.length==0){
            this.ruleForm.organizationBankAccounts=[{
            bank: "",
            accountNo: "",
            accountName: "",
            bankNo:'',
          }]
          }
            if(res.data.organizationContacts.length==0){
            this.ruleForm.organizationContacts=[{
               name: "",
               phone: ""
          }] 
          }
           if(res.data.organizationInvoiceInfos.length==0){
            this.ruleForm.organizationInvoiceInfos=[{
              accountName: "",
              accountNo: "",
              addressOnInvoice: "",
              bank: "",
              invoiceTitle: "",
              organizationInvoiceInfoType: "VAT_INVOICE",
              phoneOnInvoice: "",
              socialCreditCode: ""
          }] 
          }
          this.ruleForm.userDataAuthorityName = res.data.managerNo;
          this.d = res.data.managerNo;
          this.realName = res.data.managerName;
          this.ruleForm.data4=res.data.regionIds;
          this.rootNode=res.data.regionIds;
          if(res.data.regionIds.length==2859){
            this.checked=true;
          }
          //树结构回显
          this.$refs.tree2.filter(this.ruleForm.data4)
        })
        .then(res => {
          subs(this.ruleForm.provinceId).then(res => {
           this.o2 = res.data;
          })
            .then(res => {
              subs(this.ruleForm.cityId).then(res => {
              this.o3 = res.data;
                  })
                .then(res => {
                  let eeee = { count: 1, userName: this.d };
                  getusername(eeee).then(res => {
                    this.e = res.data[0].id;
                  }).then(res=>{   
                    if(this.ruleForm.receiverProvinceId){
                      subs(this.ruleForm.receiverProvinceId).then(res => {
                        this.o5 = res.data;
                        }).then(res=>{  
                          if(this.ruleForm.receiverCityId){
                            subs(this.ruleForm.receiverCityId).then(res => {
                             this.o6 = res.data;
                            });
                          }       
                    }) 
                    }
                             
                  });
                });
            });
        }); 
    },
    deleteAccounts(row,index){
      if(row.isDefault==1){
       this.ruleForm.organizationBankAccounts.splice(index,1);
       this.setDefault(this.ruleForm.organizationBankAccounts)
      }else{
      this.ruleForm.organizationBankAccounts.splice(index,1)  
      }
    },
    setDefault(data){
      if(data.length){
       data.forEach((item,i)=>{
          if(i==0){
            item.isDefault=1;
          }
       })
      } 
    },
    editerAccounts(row){
      this.$refs.bankAccounts.init(row)
    },
    defaultAccounts(row,index){
      this.ruleForm.organizationBankAccounts.forEach((item,i)=>{
        if(i==index){
          item.isDefault=1;
        }else{
          item.isDefault=0
        }
      })
    },
    addOrganizationBankAccounts(row){
      this.$refs.bankAccounts.init(row)
    },
    accountsCallback(row,index){
        if(index!=null){
         this.ruleForm.organizationBankAccounts[index]=row;
        }else{
        this.ruleForm.organizationBankAccounts.push(row)         
        }
    },
    //新增联系人
    addPerson() {
      this.ruleForm.organizationContacts.push({
        name: "",
        phone: ""
      });
    },
    //删除联系人
    deleteRules(item, index) {
      this.index = this.ruleForm.organizationContacts.indexOf(item);
      if (index !== -1) {
        this.ruleForm.organizationContacts.splice(index, 1);
      }
    },
    remoteMethodBank(query) {
      if (query !== "") {
        this.loading2 = true;
        let bbbb = { queryCount: 5, bankNo: query };
        findBankList(bbbb).then(res => {
          this.options3 = res.data;
          this.loading2 = false;
        });
      }
    },
     clear(name){
       if(this.ruleForm.data4.length!=0){
        this.$refs.ruleForm.clearValidate(name)       
       }
      },
    o1change(data) {
      this.ruleForm.cityId = null;
      this.ruleForm.countyId = null;
      subs(data).then(res => {
        this.o2 = res.data;
      });
    },
    o2change(data) {
      this.ruleForm.countyId = null;
      subs(data).then(res => {
        this.o3 = res.data;
      });
    },
    o3change(data) {},
    o4change(data) {
      this.ruleForm.receiverCityId = null;
      this.ruleForm.receiverCountyId = null;
      if(data){
       subs(data).then(res => {
        this.o5 = res.data;
      });
      }
    },
    o5change(data) {
      this.ruleForm.receiverCountyId =null;
      if(data){
       subs(data).then(res => {
        this.o6 = res.data;
      });
      }
    },
    o6change(data) {},
    //		获取全部树结构
    isgetTreeAll() {
      getRegion().then(res => {
        this.data2 = [{name:'全选',id:0,childrenDTOs:res.data}];
        this.$nextTick().then(() => {
          this.getnode();
        });
      });
    },
    //		获取选中得node 和 key
    getnode(data) {
      let yeziId = this.$refs.tree.getCheckedKeys(true,true);
      this.ruleForm.data4 = this.$refs.tree.getCheckedKeys(true,true);
      this.ruleForm.regionIds = yeziId;
      let i = this.$refs.tree.getCheckedNodes(true, true);
      this.options = i;
      this.$refs.tree2.filter(this.ruleForm.data4);
      if(i){
        this.$refs.ruleForm.clearValidate(['data4'])
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return value.includes(data.id);
    },
    handleChange(file, fileList) {
      this.fileList3 = fileList;
    },
    submitForm(formName) {
       this.$refs[formName].validate((valid,value) => {
        if (valid) {
          this.ruleForm.organizationInvoiceInfos.forEach((item, index) => {
            item.invoiceTitle = this.ruleForm.name;
            item.socialCreditCode = this.ruleForm.socialCreditCode;
            item.accountName=this.ruleForm.name
          });
          this.ruleForm.regionTreeBasedIdDTOs = this.data2;
          organizationGotoDraft(this.ID, this.ruleForm).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "添加至草稿成功",
                type: "success"
              });
              this.close({name:'EditerOrganization',to:{name:"OrganizationManage",params:{isUpdate:true}}})
              // window.localStorage.setItem("ORGANIZATION_LIST", Date.now())
            } else if (res.code != "000000") {
              this.$message({
                message: "编辑至草稿失败",
                type: "error"
              });
            }
          });
         } else {
          if(this.ruleForm.data4.length!=0){
          if(value&&Object.keys(value).join('')=='data4'){
              this.$refs.ruleForm.clearValidate(['data4'])
          this.ruleForm.organizationInvoiceInfos.forEach((item, index) => {
            item.invoiceTitle = this.ruleForm.name;
            item.socialCreditCode = this.ruleForm.socialCreditCode;
            });
          this.ruleForm.regionTreeBasedIdDTOs = this.data2;
          organizationGotoDraft(this.ID, this.ruleForm).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "添加至草稿成功",
                type: "success"
              });
              this.close({name:'EditerOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}})
              // window.localStorage.setItem("ORGANIZATION_LIST", Date.now())
            } else if (res.code != "000000") {
              this.$message({
                message: "编辑至草稿失败",
                type: "error"
              });
            }
          });
         }
         }
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].validate((valid,value) => {
       console.log(this.ruleForm.data4.length,valid,value,Object.keys(value),Object.keys(value).join(''),44444)
        if (valid) {
          if(this.ruleForm.organizationInvoiceInfos){
           this.ruleForm.organizationInvoiceInfos[0].invoiceTitle=this.ruleForm.name
           this.ruleForm.organizationInvoiceInfos[0].socialCreditCode=this.ruleForm.socialCreditCode
           this.ruleForm.organizationInvoiceInfos[0].accountName=this.ruleForm.name
          }
          this.ruleForm.regionTreeBasedIdDTOs = this.data2;
          updateOrganizationAuditer(this.ID, this.ruleForm).then(res => {
            console.log(res.data);
            if (res.code == "000000") {
              this.$message({
                message: "提交至审核成功",
                type: "success"
              });
              this.close({name:'EditerOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}})
              // window.localStorage.setItem("ORGANIZATION_LIST", Date.now())
            } else if (res.code != "000000") {
              this.$message({
                message: "提交至审核失败",
                type: "error"
              });
            }
          });
         } else {
           console.log(222)
          if(this.ruleForm.data4.length!=0){
              console.log(333)
          if(value&&Object.keys(value).join('')=='data4'){
              this.$refs.ruleForm.clearValidate(['data4'])
              console.log(444)
          if(this.ruleForm.organizationInvoiceInfos){
           this.ruleForm.organizationInvoiceInfos[0].invoiceTitle=this.ruleForm.name
           this.ruleForm.organizationInvoiceInfos[0].socialCreditCode=this.ruleForm.socialCreditCode
          }
          this.ruleForm.regionTreeBasedIdDTOs = this.data2;
          console.log(this.ruleForm, 66666666666666666);
          updateOrganizationAuditer(this.ID, this.ruleForm).then(res => {
            console.log(res.data);
            if (res.code == "000000") {
              this.$message({
                message: "提交至审核成功",
                type: "success"
              });
             this.close({name:'EditerOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}})
              // window.localStorage.setItem("ORGANIZATION_LIST", Date.now())
            } else if (res.code != "000000") {
              this.$message({
                message: "提交至审核失败",
                type: "error"
              });
            }
          });
         }
         }
        }
      });
    },

    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let aaaa = { name: query };
        fuzzySearch(aaaa).then(res => {
          res.data=res.data.filter(item=>{
            return item.name!=this.ruleForm.name;
          })
          this.options1 = res.data;
          this.loading = false;
        });
      } else {
        this.options1 = [];
      }
    },
    getParent(value){
     let cc=JSON.parse(JSON.stringify(this.options1))
     let str=[];
      str=this.options1.filter(item=>{
        return item.name==value;
      })
     this.ruleForm.parentId=str[0]&&str[0].id
    },
    remoteMethod1(query) {
      if (query !== "") {
        this.loading1 = true;
        let bbbb = { count: 5, userName: query };
        getusername(bbbb).then(res => {
          this.options2 = res.data;
          this.loading1 = false;
        });
      }
    },
    //选中值发生变化时    
      goRealName(ee) {              
      let ff=JSON.parse(JSON.stringify(this.options2))
      ff= ff.filter(item => {
        return item.userName == this.ruleForm.userDataAuthorityName;
      });
      this.realName = ff[0]&&ff[0].realName;
      this.ruleForm.userDataAuthorityId=ff[0]&&ff[0].id
    }
  }
};
</script>

<style lang="less" scoped>
.el-form {
  color: #606266;
  .editerBrandBox {
    border: 1px solid #e4e4e4;
    margin-top: 10px;
    .headerBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #e4e4e4;
      span {
        line-height: 50px;
        margin-left: 50px;
      }
    }
    .el-form-item {
      .el-input {
        width: 400px;
        height: 40px;
      }
      .tipBox {
        height: 20px;
        font-size: 12px;
        margin-left: 20px;
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
    }
    .listBox {
      box-sizing: border-box;
      .listLeftBox {
        position: relative;
        background-color: #ffffff;
        border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 200px;
        height: 300px;
        .headerBox {
          z-index: 5;
          height: 35px;
          border-bottom: 1px solid #e4e4e4;
          span {
            color: red;
            line-height: 36px;
          }
        }
        .lltree {
          width: 100%;
          height: 263px;
          box-sizing: border-box;
          overflow: auto;
        }
      }
      .listRightBox {
        border: 1px solid #e5e5e5;
        height: 300px;
        width: 200px;
        overflow: auto;
        .headerBox {
          height: 35px;
          border-bottom: 1px solid #e4e4e4;
          span {
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }
        .lltree {
          width: 100%;
          height: 263px;
          box-sizing: border-box;
          overflow: auto;
        }
      }
    }
  }
}
</style>
<style lang="less">
.el-form {
  .editerBrandBox {
    .organizationBox {
      .el-form-item {
      }
    }
    .el-form-item {
      margin-top: 20px;
      margin-left: 50px;
    }
    .AccountBox {
    
      .el-form-item {
        // width: 300px;
        // flex: 1;
         float: left;
        .el-input {
          width: 200px;
          position: absolute;
        }
        .el-button{
         position: relative;
         left: 210px; 
        }
      }
    }
  }
}
</style>















