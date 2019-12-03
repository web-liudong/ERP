
<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demoManageMallBox">
    <div class="editerBrandBox clear">
      <div class="h50 headerBox"><span>基本信息</span></div>
      <el-form-item label="选择商城项目：" prop="projectName">
        <el-input v-model="ruleForm.projectId" v-if="false" placeholder="输入商城项目名称"></el-input>
        <el-select
          v-model="ruleForm.projectName"
          filterable
          remote
          reserve-keyword
          placeholder="输入商城项目名称"
          :remote-method="remoteMethod"
          :loading="loading1"
          style="width: 400px"
          clearable
          @change="getUSERNAME(['projectName'])">
          <el-option
            v-for="item in options4"
            :key="item.name"
            :label="item.label"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="开发商：" prop="partyCName">
        <el-input v-model="ruleForm.partyCName" placeholder="字数长度1~50以内"></el-input>
      </el-form-item>
      <el-form-item label="开发商英文：" prop="partyCNameEn">
        <el-input v-model="ruleForm.partyCNameEn" placeholder="字数长度1~50以内"></el-input>
      </el-form-item>
      <el-form-item v-if="checkOptions.checkedOption.length!=0" label="商品数据推送选项：" prop="skuPushOptions">
        <div class="chunkBox">
           <el-input placeholder="请输入对方接口url" v-model="ruleForm.partyCSkuUrl"></el-input>
           <el-checkbox-group v-model="ruleForm.skuPushOptions">
          <el-checkbox :checked="item.checked" :label="item.mallPushOptionsId" v-for="(item,index) in checkOptions.checkedOption" :key="index">{{item.mallPushOptionsName}}</el-checkbox>
        </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="订单数据推送选项：" prop="orderPushOptions" v-if="checkOptions.checkedOrderOption.length!=0">
        <div class="chunkBox">
          <el-input placeholder="请输入对方接口url" v-model="ruleForm.partyCOrderUrl"></el-input>
         <el-checkbox-group v-model="ruleForm.orderPushOptions">
          <el-checkbox :checked="item.checked" :label="item.mallPushOptionsId" v-for="(item,index) in checkOptions.checkedOrderOption" :key="index">{{item.mallPushOptionsName}}</el-checkbox>
        </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="发票数据推送选项：" prop="invoicePushOptions" v-if="checkOptions.checkedInvoiceOption.length!=0">
        <div class="chunkBox">
          <el-input placeholder="请输入对方接口url" v-model="ruleForm.partyCInvoiceUrl"></el-input>
          <el-checkbox-group v-model="ruleForm.invoicePushOptions">
          <el-checkbox :checked="item.checked" :label="item.mallPushOptionsId" v-for="(item,index) in checkOptions.checkedInvoiceOption" :key="index">{{item.mallPushOptionsName}}</el-checkbox>
        </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="退换货数据推送选项：" prop="refundPushOptions" v-if="checkOptions.returnedGoodsoptions.length!=0">
        <div class="chunkBox">
          <el-input placeholder="请输入对方接口url" v-model="ruleForm.partyCReturnOrderUrl"></el-input>
       <el-checkbox-group v-model="ruleForm.refundPushOptions">
          <el-checkbox :checked="item.checked" :label="item.mallPushOptionsId" v-for="(item,i) in checkOptions.returnedGoodsoptions" 
          :key="i">{{item.mallPushOptionsName}}</el-checkbox>
        </el-checkbox-group>
        </div>
        
      </el-form-item>
      <el-form-item label="是否需要定制商品信息：" prop="needCustomMadeSkuInfo">
        <el-radio-group v-model="ruleForm.needCustomMadeSkuInfo">
          <el-radio :label="false">不需要</el-radio>
          <el-radio :label="true">需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <div style="display: flex;flex: 1">
        <el-form-item label="是否需要品目对应：" prop="needCategoryMatch">
          <el-radio-group v-model="ruleForm.needCategoryMatch">
            <el-radio :label="false">不需要</el-radio>
            <el-radio :label="true">需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对方品目级别：" prop="partyCCategoryLevel" v-if="ruleForm.needCategoryMatch==true">
          <el-radio-group v-model="ruleForm.partyCCategoryLevel">
            <el-radio :label="1">一级品目</el-radio>
            <el-radio :label="2">二级品目</el-radio>
            <el-radio :label="3">三级品目</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="是否需要参数对应：" prop="needAttributeMatch">
        <el-radio-group v-model="ruleForm.needAttributeMatch">
          <el-radio :label="false">不需要</el-radio>
          <el-radio :label="true">需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否需要品牌对应：" prop="needBrandMatch">
        <el-radio-group v-model="ruleForm.needBrandMatch">
          <el-radio :label="false">不需要</el-radio>
          <el-radio :label="true">需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="是否需要订单拉取：" prop="needOrderPull">
        <el-radio-group v-model="ruleForm.needOrderPull">
          <el-radio :label="false">不需要</el-radio>
          <el-radio :label="true">需要</el-radio>
        </el-radio-group>
      </el-form-item> -->
     <el-form-item label="地址编码类型：" prop="addressCodeTypeName">
               <el-input v-model="ruleForm.addressCodeType" v-if="false" placeholder="字数长度在1~50字以内"></el-input>
               <el-select v-model="ruleForm.addressCodeTypeName" @change="getaddressCodeType" clearable placeholder="请选择地址编码类型">
       <el-option
        v-for="item in options"
        :key="item.code"
        :label="item.text"
        :value="item.code">
        </el-option>
       </el-select>
      </el-form-item>
      <el-form-item label="接口文档版本号：" prop="partyCApiVersion">
        <el-input v-model="ruleForm.partyCApiVersion" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="对方商城URL：" prop="partyCMallUrl">
        <el-input v-model="ruleForm.partyCMallUrl" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="对方获取token接口URL" prop="partyCTokenUrl">
        <el-input v-model="ruleForm.partyCTokenUrl" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="对方接口URL：" prop="partyCUrl">
        <el-input v-model="ruleForm.partyCUrl" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="备注信息：" prop="description">
        <el-input v-model="ruleForm.description" type="textarea" :rows="5" style="width:400px" 
        placeholder="请输入商城的的备注信息1~200个字数"></el-input>
      </el-form-item>
      <el-form-item label="第三方提供账号：" prop="partyCOfferedLoginName">
        <el-input v-model="ruleForm.partyCOfferedLoginName" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="第三方提供密码：" prop="partyCOfferedPassword">
        <span slot="label">第三方提供密码：</span>
        <el-input v-model="ruleForm.partyCOfferedPassword" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="第三方提供私钥：" prop="partyCOfferedClientSecret">
        <span slot="label">第三方提供私钥：</span>
        <el-input v-model="ruleForm.partyCOfferedClientSecret" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="领先提供账号：" prop="lxwlOfferedLoginName">
        <span slot="label">领先提供账号：</span>
        <el-input v-model="ruleForm.lxwlOfferedLoginName" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="领先提供密钥：" prop="lxwlOfferedPassword">
        <span slot="label">领先提供密钥：</span>
        <el-input v-model="ruleForm.lxwlOfferedPassword" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" @click="submitForm('ruleForm')" v-waves>保存并提交</el-button>
      </el-form-item>
    </div>

  </el-form>
</template>

<script>
  import '@/components/system/organization/AddOrganization.less'
  import waves from '@/directive/waves'
  import { addMallInfo,getAllOptions,getDataList1,mallSelectName,editerMallInfo,getRegionCode} from "@/api/release/mallProjectManage"
  export default {
    inject:['reload','close'],
    name:"EditerMallItem",
    data() {
      var checkGoods=(rule,value,callback)=>{
        console.log(value);
        if(value.length==0){
          return callback(new Error('商品数据推送不能为空'))
        }else {
          callback()
        }
      }
      return {

        aa:[],
        bb:[],
        cc:[],
        dd:[],
        //新增选项对话框
        formTree:{
          skuName:null,
          addressName:null,
        },
        id:null,
        index: '',
        checkOptions:{
          checkedOption:[],
          checkedOrderOption:[],
          checkedInvoiceOption:[],
          returnedGoodsoptions:[],
        },
        loading1:false,
        options:null,
        options4:[],
        ID:null,
        ruleForm: {
          //对方品目级别
          partyCCategoryLevel:'',
          //是否需要发票
          invoicePushOptions:[],
          //是否需要订单
          orderPushOptions:[],
          //商品数据推送选项
          skuPushOptions: [],
          //退换货数据推送选项
          refundPushOptions:[],
          projectId:'',//项目id
          "projectName": "", //商城项目名称
          "partyCName": "", //开发商
          partyCNameEn:"",//开发商英文
          partyCOfferedLoginName: '',//第三方账号
          partyCOfferedPassword: '',//第三方提供密码
          partyCOfferedClientSecret : '',//第三方提供私钥
          userName : '',//第三方提供账号
          secretKey: '',//第三方提供密钥
          needCustomMadeSkuInfo:null,
          needCategoryMatch: '',//是否需要品目对应
          needAttributeMatch: '',//是否需要参数对应
          needBrandMatch: '',//是否需要品牌对应
          supplierGradeLevel:'',
          lxwlOfferedLoginName:'',//领先未来提供账号
          lxwlOfferedPassword:'',//领先未来提供密码
          partyCApiVersion:'',//第三方接口文档版本号
          addressCodeType:'',//地址编码类型
          addressCodeTypeName:'',
          // needOrderPull:'',//是否需要订单拉取
          partyCInvoiceUrl:'',//第三方发票相关接口url
          partyCOrderUrl:'',//第三方订单相关接口url
          partyCReturnOrderUrl:'',//第三方退换货相关接口url
          partyCSkuUrl:'',//第三方商品相关接口url
          partyCTokenUrl:'',//第三方获取token接口url
          partyCUrl:'',//第三方接口url
          description:'',//备注信息
          partyCMallUrl:'',//第三方商城url
        },
        rules: {
          //商城项目名称
          projectName: [{
            required: true,
            message: '商城项目不能为空',
            trigger: 'blur'
          }],
          //开发商
          partyCName: [{
            required:true,
            message:'开发商不能为空',
            trigger:'blur'
          }],
          partyCNameEn: [{
            required:true,
            message:'开发商英文不能为空',
            trigger:'blur'
          }],
          //品目对应
          needCategoryMatch:[{required:true,message:'品目对应不能为空',trigger:'blur'}],
          needCustomMadeSkuInfo:[{required:true,message:'是否需要定制商品信息不能为空',trigger:'change'}],
          //参数对应
          needAttributeMatch:[{required:true,message:'参数对应不能为空',trigger:'blur'}],
          // needOrderPull:[{required:true,message:'订单拉取不能为空',trigger:'blur'}],
          //品牌对应
          needBrandMatch:[{required:true,message:'品牌对应不能为空',trigger:'blur'}],
          //对方品目等级
          partyCCategoryLevel: [{
            required: true,
            message: '品目级别不能为空',
            trigger: 'blur'
          },],
          //第三方账号
          partyCOfferedLoginName: [{
            min:1,
            max:50,
            message:'字数长度在1~50字以内',
            trigger:'change'
          }],
          //第三方提供密码
          partyCOfferedPassword: [
            {
              min:1,
              max:50,
              message:'字数长度在1~50字以内',
              trigger:'change'
            }],
          //第三方提供账号
          partyCOfferedLoginName: [{
            min:1,
            max:50,
            message:'字数长度在1~50字以内',
            trigger:'change'
          }],
          //第三方提供私钥
          partyCOfferedClientSecret: [{
            min:1,
            max:50,
            message:'字数长度在1~50字以内',
            trigger:'change'
          }],
          //第三方提供密钥
          partyCOfferedPassword: [{
            min:1,
            max:50,
            message:'字数长度在1~50字以内',
            trigger:'change'
          }],
          lxwlOfferedLoginName:[{min:1,max:50,message:'字数长度在1~50字以内',trigger:'blur'}],
          lxwlOfferedPassword:[{min:1,max:50,message:'字数长度在1~50字以内',trigger:'blur'}],
           //接口文档版本号
          partyCApiVersion:[{required:true,message:'接口文档版本号不能为空',trigger:'blur'},{min:1,max:50,message:'字数长度在1~50字之间',trigger:'change'}],
          //对方商城url
          partyCMallUrl:[{required:true,message:'对方商城url不能为空',trigger:'blur'},{min:1,max:50,message:'字数长度在1~50字之间',trigger:'change'}],
          //备注信息
          description:[{required:true,message:'备注信息不能为空',trigger:'blur'},{min:1,max:200,message:'字数长度在1~200字之间',trigger:'change'}], 
          //地址编码类型
          addressCodeTypeName:[{required:true,message:'地址编码类型不能为空',trigger:'blur'}],
          //第三方获取token接口url
          partyCTokenUrl:[{required:true,message:'对方获取token接口URL不能为空',trigger:'blur'},{mn:1,max:50,message:'字数长度在1~50字之间',trigger:'change'}],
          //对方接口url
          partyCUrl:[{required:true,message:'对方接口URL不能为空',trigger:'blur'},{mn:1,max:50,message:'字数长度在1~50字之间',trigger:'change'}],
        },
        dialogVisible:false,
        formTreeRules:{
          skuName:[{required:true,message:'选项名称不能为空',trigger:'blur'}],
          addressName:[{required:true,message:'地址名称不能为空',trigger:'blur'}],
        }
      };
    },
    directives: {
      waves
    },
    created() {
      this.ID=this.$route.query.EditerID;
      getRegionCode().then(res=>{
        this.options=res.data;
      }).then(res=>{
        this.getForm();
      })
    },
    activated(){
      if(this.ID!=this.$route.query.EditerID){
        getRegionCode().then(res=>{
        this.options=res.data;
      }).then(res=>{
        this.getForm();
      })
      }
    },
    methods: {
      getaddressCodeType(val){
        let aaa=JSON.parse(JSON.stringify(this.options))
        aaa=aaa.filter(item=>{
          return item.text==val;
        })
        this.ruleForm.addressCodeType=aaa[0]&&aaa[0].addressCodeType;
        if(this.ruleForm.addressCodeTypeName){
         this.clear(['addressCodeTypeName'])
        }
      },
      clear(name){
        console.log(name,555)
        this.$refs.ruleForm.clearValidate(name)
      },
        //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading1 = true;
          let aa={name:query};
          mallSelectName(aa).then(res=>{
            if(res.code=='000000'){
              this.options4=res.data;
              this.loading1=false;
            }
          })
        } else {
          this.options4 = [];
        }
      },
     //点击选中的选项
      getUSERNAME(name){
        let aaaaa=JSON.parse(JSON.stringify(this.options4));
       aaaaa = aaaaa.filter(item=>{
          return item.name==this.ruleForm.projectName
        })
        this.ruleForm.projectId=aaaaa[0].id
        this.ruleForm.projectName=aaaaa[0].name
        this.clear(name)
      },
      getForm(){
        getDataList1(this.ID).then(res=>{
          this.ruleForm.projectName=res.data.projectName
          this.ruleForm.partyCName=res.data.partyCName
          this.ruleForm.partyCNameEn=res.data.partyCNameEn
          this.ruleForm.partyCOfferedLoginName=res.data.partyCOfferedLoginName
          this.ruleForm.partyCOfferedPassword=res.data.partyCOfferedPassword
          this.ruleForm.partyCOfferedClientSecret=res.data.partyCOfferedClientSecret
          this.ruleForm.lxwlOfferedLoginName=res.data.lxwlOfferedLoginName
          this.ruleForm.lxwlOfferedPassword=res.data.lxwlOfferedPassword
          this.ruleForm.projectId=res.data.projectId
           this.ruleForm.description=res.data.description
           this.ruleForm.partyCApiVersion=res.data.partyCApiVersion
           this.ruleForm.partyCInvoiceUrl=res.data.partyCInvoiceUrl
           this.ruleForm.partyCMallUrl=res.data.partyCMallUrl
           this.ruleForm.partyCOrderUrl=res.data.partyCOrderUrl
           this.ruleForm.partyCReturnOrderUrl=res.data.partyCReturnOrderUrl
           this.ruleForm.partyCSkuUrl=res.data.partyCSkuUrl
           this.ruleForm.partyCTokenUrl=res.data.partyCTokenUrl
           this.ruleForm.partyCUrl=res.data.partyCUrl
           this.ruleForm.addressCodeType=res.data.addressCodeType
           this.ruleForm.addressCodeTypeName=res.data.addressCodeTypeName
           let aa = this.options.filter(item=>{
           return item.code==res.data.addressCodeType;
          }) 
          this.ruleForm.addressCodeType=aa[0]&&aa[0].text;
          this.$nextTick(()=>{
          this.checkOptions.returnedGoodsoptions = res.data.refundPushOptions
          this.checkOptions.checkedOption=res.data.skuPushOptions
          this.checkOptions.checkedOrderOption=res.data.orderPushOptions
          this.checkOptions.checkedInvoiceOption=res.data.invoicePushOptions
          })
          
          this.ruleForm.needCategoryMatch=res.data.needCategoryMatch;
          this.ruleForm.needCustomMadeSkuInfo=res.data.needCustomMadeSkuInfo;
          this.ruleForm.needAttributeMatch=res.data.needAttributeMatch;
          this.ruleForm.needBrandMatch=res.data.needBrandMatch;
          this.ruleForm.partyCCategoryLevel=res.data.partyCCategoryLevel;
          // this.ruleForm.needOrderPull=res.data.needOrderPull;
        })
      },
      submitForm(formName) {  
      this.$refs[formName].validate((valid) => {
          this.ruleForm.partyCCategoryLevel=this.ruleForm.partyCCategoryLevel;
          if(typeof this.ruleForm.addressCodeType!='number'){
            let ff=this.options.filter(item=>{
              return item.text==this.ruleForm.addressCodeType;
            })
            this.ruleForm.addressCodeType=ff[0]&&ff[0].code;
          }
          if (valid) {
            editerMallInfo(this.id,this.ruleForm).then(res => {
              console.log(res.data);
              if(res.code=='000000'){
                this.$message({
                  message:'编辑商城项目已成功',
                  type:'success'
                })
                //刷新页面
                this.reload();
               setTimeout(() => {
                 this.close();
               }, 1000);

              }else if(res.code!='000000'){
                this.$message({
                  message:'编辑商城项目失败',
                  type:'error'
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    

  }
</script>

<style lang="less" scoped>
  .demoManageMallBox{
    color: #606266;
    .editerBrandBox{
      border: 1px solid #e4e4e4;
      margin-top: 10px;
      .headerBox{
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #e4e4e4;
        span{
          line-height: 50px;
          margin-left: 50px;
        }
      }
      .el-form-item{
        .el-input{
          width: 400px;
          height: 40px;
        }
        .tipBox{
          height: 20px;
          font-size: 12px;
          margin-left: 20px;
        }
        .chunkBox{
          display: flex;
          flex: 1;
          .el-input{
            width: 200px;
          }
          .el-checkbox-group{
            margin-left: 20px;
          }
        }
      }
      .listBox{
        box-sizing: border-box;
        .listLeftBox{
          position: relative;
          background-color: #FFFFFF;
          border: 1px solid #e5e5e5;
          margin-right: 20px;
          width: 200px;
          height:300px;
          .headerBox{
            z-index: 5;
            height: 35px;
            border-bottom: 1px solid #e4e4e4;
            span{
              color: red;
              line-height: 36px;
            }
          }
          .lltree{
            width: 100%;
            height: 263px;
            box-sizing: border-box;
            overflow: auto;
          }
        }
        .listRightBox{
          border: 1px solid #e5e5e5;
          height:300px;
          width: 200px;
          overflow: auto;
          .headerBox{
            height: 35px;
            border-bottom: 1px solid #e4e4e4;
            span{
              color: red;
              height: 36px;
              line-height: 36px;
            }
          }
          .lltree{
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
  .el-form{
    .editerBrandBox{
      .organizationBox{
        .el-form-item{

        }
      }
      .el-form-item{
        margin-top: 20px;
        margin-left: 40px;
      }
      .AccountBox{
        display: flex;
        .el-form-item{
          .el-form-item__label{
            //width: 100px !important;
          }
          // width: 300px !important;
          flex: 1;
          .el-input{
            width: 200px;
          }
        }



      }
    }
  }
</style>















