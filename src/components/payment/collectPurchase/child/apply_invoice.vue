
<template>
  <el-dialog :title="InvoiceTitle" :visible.sync="isShow" width="60%" append-to-body style="margin-top:-8vh" :before-close="closeDialog">
      <div class="topHeaderBox" style="font-size:16px">
           <span>伙伴名称：</span><span style="color:red">{{form.partnerName}}</span>
           <span style="margin-left:20px;">申请开票金额：</span><span style="color:red">￥{{form.amount}}</span>
      </div>
        <div class="centerBox" style="border:1px solid #fff；margin:10px;5px;height:50px;">
          <div class="centerInvoice">
            <span>开票信息</span>
          </div>
        </div>  
      <el-form :model="form" ref="form" :rules="rules" class="formBox" label-width="180px" style="height:550px;overflow:auto">
        <el-form-item label="开票方：" prop="organizationName">
          <span slot="label">开票方：</span>
          <el-input v-model="form.organizationName" placeholder="" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="开票类型" prop="invoiceType">
          <span slot="label">开票类型：</span>
           <el-radio-group v-model="form.invoiceType">
                <el-radio label="VAT_INVOICE">专票</el-radio>
                <el-radio label="PLAIN_INVOICE">普票</el-radio>
                <el-radio label="ELECTRONIC_INVOICE">电子发票</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="开票抬头" prop="invoiceTitle">
          <span slot="label">开票抬头：</span>  
          <el-input v-model="form.invoiceTitle" placeholder="请输入开票抬头"  clearable></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="socialCreditCode">
          <span slot="label">统一社会信用代码：</span>
            <el-input v-model="form.socialCreditCode" placeholder="请输入统一社会信用代码" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注说明：">
          <span slot="label">备注说明：</span>
          <el-input v-model="form.applicationMemo" placeholder="请输入备注说明" clearable type="textarea"></el-input>
        </el-form-item> -->
        <div v-if="form.invoiceType=='VAT_INVOICE'||form.invoiceType==null">
         <el-form-item label="地址" prop="addressOnInvoice">
          <span slot="label">地址：</span>
            <el-input v-model="form.addressOnInvoice" placeholder="请输入地址" type="textarea" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneOnInvoice">
          <span slot="label">电话：</span>
            <el-input v-model="form.phoneOnInvoice" placeholder="请输入电话号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank">
          <span slot="label">开户行：</span>
            <el-input v-model="form.bank" placeholder="请输入开户行" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="accountNo">
          <span slot="label">账号：</span>
            <el-input v-model="form.accountNo" placeholder="请输入账号" clearable></el-input>
        </el-form-item>
        </div>        
        <div class="chunk">
         <el-form-item label="预计回款时间" prop="expectPaidDate">
          <span slot="label">预计回款时间：</span>
            <!-- <el-input v-model="form.expectPaidDate" placeholder="请输入账号" clearable></el-input> -->
            <el-date-picker
              v-model="form.expectPaidDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="是否需要收据" prop="needReceipt">
          <span slot="label">是否需要收据：</span>
          <el-radio-group v-model="form.needReceipt">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
           </el-radio-group>      
        </el-form-item>
        </div>
        <div v-if="form.invoiceType!='ELECTRONIC_INVOICE'">
         <div class="chunk">
         <el-form-item label="发票寄送联系人" prop="receiverName">
          <span slot="label">发票寄送联系人：</span>
            <el-input v-model="form.receiverName" placeholder="请输入发票寄送联系人" clearable></el-input>
        </el-form-item>
        <el-form-item label="发票寄送联系人电话：" prop="receiverPhone">
          <span slot="label">发票寄送联系人电话：</span>
            <el-input v-model="form.receiverPhone" placeholder="请输入发票寄送联系人电话" clearable></el-input>
        </el-form-item>
        </div>
        <div>
            <el-form-item prop="receiverAddressCountyId">
            <span slot="label">发票寄送地址：</span>
            <div class="wareHouseBox" style="display:flex;flex:1">
              <el-select
                v-model="form.receiverAddressProvinceId"
                filterable
                placeholder="选择省/直辖市"
                style="width: 200px;"
                clearable
                @change="o1change"
              >
            <el-option v-for="o in o1" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
              <el-select
                v-model="form.receiverAddressCityId"
                filterable
                clearable
                placeholder="选择城市"
                style="width: 200px;"
                @change="o2change"
              >
                <el-option v-for="o in o2" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
              <el-select
                v-model="form.receiverAddressCountyId"
                filterable
                clearable
                placeholder="选择区/县"
                style="width: 200px;"
                @change="o3change"
              >
                <el-option v-for="o in o3" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="发票寄送地址详细地址" prop="receiverAddressLine">
          <span slot="label">发票寄送地址详细地址：</span>
            <el-input
                v-model="form.receiverAddressLine"
                placeholder="请输入发票寄送地址详细地址"
                type="text"
              ></el-input>
        </el-form-item>
        </div>  
        <el-form-item label="发票邮箱" prop="receiverEmail" v-if="form.invoiceType=='ELECTRONIC_INVOICE'">
          <span slot="label">发票邮箱：</span>
            <el-input
                v-model="form.receiverEmail"
                placeholder="请输入发票邮箱"
                type="text"
              ></el-input>
        </el-form-item>
        <el-form-item label="发票备注">
          <span slot="label">发票备注：</span>
            <el-input
                v-model="form.invoiceMemo"
                placeholder="请输入发票备注"
                type="text"
              ></el-input>
        </el-form-item>
        <el-form-item label="申请备注">
          <span slot="label">申请备注：</span>
            <el-input
                v-model="form.applicationMemo"
                placeholder="请输入申请备注"
                type="text"
              ></el-input>
        </el-form-item> 
        <el-form-item label="备注1">
          <span slot="label">备注1：</span>
            <el-input
                v-model="form.memo1"
                placeholder="请输入备注1"
                type="text"
              ></el-input>
        </el-form-item> 
        <el-form-item label="备注2">
          <span slot="label">备注2：</span>
            <el-input
                v-model="form.memo2"
                placeholder="请输入备注2"
                type="text"
              ></el-input>
        </el-form-item> 
        <el-form-item label="备注3">
          <span slot="label">备注3：</span>
            <el-input
                v-model="form.memo3"
                placeholder="请输入备注3"
                type="text"
              ></el-input>
        </el-form-item> 
        <el-form-item label="备注4">
          <span slot="label">备注4：</span>
            <el-input
                v-model="form.memo4"
                placeholder="请输入备注4"
                type="text"
              ></el-input>
        </el-form-item> 
        <el-form-item label="备注5">
          <span slot="label">备注5：</span>
            <el-input
                v-model="form.memo5"
                placeholder="请输入备注5"
                type="text"
              ></el-input>
        </el-form-item>  
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('createInvoice')" v-if="type=='createInvoice'" style="margin-right:45%">申请开票</el-button>
      <el-button type="primary" @click="submitForm('editerInvoice')" v-if="type=='editerInvoice'" style="margin-right:45%">申请开票</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createInvoice ,editerInvoice ,editerInvoiceInit,findOrganization,findOrganizationInvoice} from "@/api/payment/collectionPurchaseInvoice.js";
import { provinces_based_id, subs } from "@/api/basicSupplier";
export default {
  props: {
    InvoiceTitle:'',
  },
  data() {
    var CheckSocialCreditCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("统一社会信用编码不能为空"));
      }
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
    var checkReceiverPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码或座机不能为空"));
      } else {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob = /^1[3|4|5|6|7|8][0-9]{9}$/;
        if (isMob.test(value) || isPhone.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号码格式"));
        }
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码或座机不能为空"));
      } else {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob = /^1[3|4|5|6|7|8][0-9]{9}$/;
        if (isMob.test(value) || isPhone.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号码格式"));
        }
      }
    };  
    return {
      isShow: false,   
      loading:false,
      o1: [],
      o2: [],
      o3: [],
      type:'',
      form:{
      accountNo:'',//开户账号
      addressOnInvoice:'',//开票地址
      amount:null,//申请开票金额
      applicationMemo:null,//申请备注
      bank:null,//开户行
      centralizedPurchaseBillIds:null,//集采结算单ids
      creatorId:null,//申请人：用户id
      creatorName:null,//申请人，用户名称
      expectPaidDate:null,//预计回款时间
      invoiceMemo:null,//发票备注
      invoiceTitle:null,//发票抬头
      invoiceType:null,//发票类型：{1:专票, 2:普票, 3:电子发票} VAT_INVOICE, PLAIN_INVOICE, ELECTRONIC_INVOICE
      memo1:null,//备注1
      memo2:null,//备注2
      memo3:null,//备注3
      memo4:null,//备注4
      memo5:null,//备注5
      needReceipt:null,//是否需要收据
      organizationId:null,//开票方，组织机构id
      organizationName:null,//开票方，组织机构名称
      partnerId:null,//合作伙伴，组织机构id
      partnerIds:null,
      partnerName:null,//合作伙伴，组织机构名称
      phoneOnInvoice:null,//开票电话
      receiverAddressCityId:null,//发票寄送地址市id
      receiverAddressCountyId:null,//发票寄送地址区县id
      receiverAddressLine:null,//发票寄送地址详细地址
      receiverAddressProvinceId:null,//发票寄送地址省id
      receiverName:null,//发票寄送联系人
      receiverEmail:'',//发票寄送联系人邮箱
      receiverPhone:null,//发票寄送联系人电话
      socialCreditCode:null,//统一社会信用代码
      },
      invoiceId:null,
      rules:{
       organizationName:[{required:true,message:'开票方不能为空',trigger:'blur',trigger:'change'}],
       invoiceType:[{required:true,message:'开票类型不能为空',trigger:'change'}],
       invoiceTitle:[{required:true,message:'开票抬头不能为空',trigger:'change'}],
       socialCreditCode:[{validator:CheckSocialCreditCode,required:true,message:'',trigger:'blur'}],
       addressOnInvoice:[{required:true,message:'地址不能为空',trigger:'blur'}],
       phoneOnInvoice:[{validator:checkReceiverPhone,required:true,message:'',trigger:'blur'}],
       bank:[{required:true,message:'开户行不能为空',trigger:'blur'}],
       accountNo:[{required:true,message:'账号不能为空',trigger:'blur'}],
       expectPaidDate:[{required:true,message:'预计回款时间不能为空',trigger:'blur'}],
       needReceipt:[{required:true,message:'是否需要收据不能为空',trigger:'blur',trigger:'change'}],
       receiverName:[{required:true,message:'发票寄送联系人不能为空',trigger:'blur'}],
       receiverPhone:[{required:true,validator:checkPhone,message:'',trigger:'blur'}],
       receiverAddressCountyId:[{required:true,message:'发票寄送地址不能为空',trigger:'blur',trigger:'change'}],
       receiverAddressLine:[{required:true,message:'发票寄送详细地址不能为空',trigger:'blur'}],
       receiverEmail:[{required:true,message:'发票邮箱不能为空',trigger:'blur'}],
      }
    };
  },
  mounted() {},
  methods: {
    init(type,row) {
      this.type=type;
      console.log(type,'999999999999999999999999999999999');
      if(type=='createInvoice'){
        this.form.amount=row.totalPlice.toFixed(4);  
        this.form.partnerName=row.partnerName;  
        this.form.centralizedPurchaseBillIds=row.ids;  
        this.form.partnerId=row.partnerId[0]&&row.partnerId[0];
        this.getProvinces();
      }
      if(type=='editerInvoice'){
      this.invoiceId=row.id;
       editerInvoiceInit(row.id).then(res=>{
        if(res.code=='000000'){ 
         this.form=res.data; 
        }
       }).then(res=>{
        provinces_based_id().then(res => {
        this.o1 = res.data;
        console.log(this.o1,'88888888888888888888888888888888888888888888');
        this.cities = res.data;
      }).then(res=>{
        // debugger
        if(this.form.receiverAddressProvinceId){
         subs(this.form.receiverAddressProvinceId).then(res => {
           this.o2 = res.data;
          }).then(res=>{
            subs(this.form.receiverAddressCityId).then(res => {
             this.o3 = res.data;
          })
          })
        }    
      });
       })  
      }
      let str = window.localStorage.getItem("UserInfo");
      let userPosts=JSON.parse(str).userPosts;
      this.form.organizationId=userPosts[0].organizationId;
      this.form.organizationName=userPosts[0].organizationName;
      findOrganizationInvoice([this.form.partnerId]).then(res=>{
           if(res.code=='000000'){
             if(res.data){
               this.form.accountName=res.data[0].accountName;
               this.form.accountNo=res.data[0].accountNo;
               this.form.addressOnInvoice=res.data[0].addressOnInvoice;
               this.form.bank=res.data[0].bank;
               this.form.invoiceTitle=res.data[0].invoiceTitle;
               this.form.phoneOnInvoice=res.data[0].phoneOnInvoice;
               this.form.socialCreditCode=res.data[0].socialCreditCode;
             }
           }
      }) 
      
      this.isShow = true;
    },
    getProvinces(){
        provinces_based_id().then(res=>{
          if(res.code=='000000'){
            this.o1 = res.data;
          }
      })
    },
    o1change(data) {
      this.form.receiverAddressCityId = "";
      this.form.receiverAddressCountyId = "";
      subs(data).then(res => {
        this.o2 = res.data;
      });
    },
    o2change(data) {
      this.form.receiverAddressCountyId = "";
      subs(data).then(res => {
        this.o3 = res.data;
      });
    },
    o3change(data) {},
    getOrganization(value){
     if(value!=''){
       this.loading=true;
       findOrganization({name:value}).then(res=>{
       if(res.code=='000000'){
         this.loading = false;
         this.options=res.data
       }  
     })
     }else{
       this.options=[];
     } 
    },
    closeDialog(done){
       done();
       this.$refs['form'].resetFields()     
    },
    submitForm(name) { 
     this.$refs['form'].validate((valid) => {
          if (valid) {
              if(name=='createInvoice'){
              createInvoice(this.form).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                    message:"发票申请成功",
                    type:'success'
                  })
                  this.isShow=false;
                  this.form= {
                      accountNo:'',//开户账号
                      addressOnInvoice:'',//开票地址
                      amount:null,//申请开票金额
                      applicationMemo:null,//申请备注
                      bank:null,//开户行
                      centralizedPurchaseBillIds:null,//集采结算单ids
                      creatorId:null,//申请人：用户id
                      creatorName:null,//申请人，用户名称
                      expectPaidDate:null,//预计回款时间
                      invoiceMemo:null,//发票备注
                      invoiceTitle:null,//发票抬头
                      invoiceType:null,//发票类型：{1:专票, 2:普票, 3:电子发票} VAT_INVOICE, PLAIN_INVOICE, ELECTRONIC_INVOICE
                      memo1:null,//备注1
                      memo2:null,//备注2
                      memo3:null,//备注3
                      memo4:null,//备注4
                      memo5:null,//备注5
                      needReceipt:null,//是否需要收据
                      organizationId:null,//开票方，组织机构id
                      organizationName:null,//开票方，组织机构名称
                      partnerId:null,//合作伙伴，组织机构id
                      partnerIds:null,
                      partnerName:null,//合作伙伴，组织机构名称
                      phoneOnInvoice:null,//开票电话
                      receiverAddressCityId:null,//发票寄送地址市id
                      receiverAddressCountyId:null,//发票寄送地址区县id
                      receiverAddressLine:null,//发票寄送地址详细地址
                      receiverAddressProvinceId:null,//发票寄送地址省id
                      receiverName:null,//发票寄送联系人
                      receiverEmail:'',//发票寄送联系人邮箱
                      receiverPhone:null,//发票寄送联系人电话
                      socialCreditCode:null,//统一社会信用代码
                      }
                this.$emit('invoiceCallback')      
                }
              })
            }
            if(name=='editerInvoice'){
              editerInvoice(this.invoiceId,this.form).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                    message:"发票申请成功",
                    type:'success'
                  })
                  this.isShow=false;
                  this.form= {
                      accountNo:'',//开户账号
                      addressOnInvoice:'',//开票地址
                      amount:null,//申请开票金额
                      applicationMemo:null,//申请备注
                      bank:null,//开户行
                      centralizedPurchaseBillIds:null,//集采结算单ids
                      creatorId:null,//申请人：用户id
                      creatorName:null,//申请人，用户名称
                      expectPaidDate:null,//预计回款时间
                      invoiceMemo:null,//发票备注
                      invoiceTitle:null,//发票抬头
                      invoiceType:null,//发票类型：{1:专票, 2:普票, 3:电子发票} VAT_INVOICE, PLAIN_INVOICE, ELECTRONIC_INVOICE
                      memo1:null,//备注1
                      memo2:null,//备注2
                      memo3:null,//备注3
                      memo4:null,//备注4
                      memo5:null,//备注5
                      needReceipt:null,//是否需要收据
                      organizationId:null,//开票方，组织机构id
                      organizationName:null,//开票方，组织机构名称
                      partnerId:null,//合作伙伴，组织机构id
                      partnerIds:null,
                      partnerName:null,//合作伙伴，组织机构名称
                      phoneOnInvoice:null,//开票电话
                      receiverAddressCityId:null,//发票寄送地址市id
                      receiverAddressCountyId:null,//发票寄送地址区县id
                      receiverAddressLine:null,//发票寄送地址详细地址
                      receiverAddressProvinceId:null,//发票寄送地址省id
                      receiverName:null,//发票寄送联系人
                      receiverEmail:'',//发票寄送联系人邮箱
                      receiverPhone:null,//发票寄送联系人电话
                      socialCreditCode:null,//统一社会信用代码
                      }
                    this.$emit('invoiceCallback')  
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
    }
  }
};
</script>
<style scoped lang="less">
.topHeaderBox{
  margin: 10px 0 10px 10%;
}
.centerBox{
  // margin-left: 10%;
  .centerInvoice{
    line-height: 50px;
    margin-left: 5%
  }
  background-color: #e4e4e4;
  margin-bottom:10px; 
}
.formBox{
 .el-form-item{
   margin-left:10px;   
   .el-textarea,.el-input,.el-select{
     width: 60%;
   }
 }

}
</style>