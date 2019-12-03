<template>
  <el-dialog
    title="基本信息"
    :visible.sync="isShow"
    width="70%"
    class="createInvoiceBox"
    :before-close="cancelSubmitForm"
  >
    <el-form
      :inline="true"
      :model="purchaseInvoiceParam"
      class="demo-form-inline"
      ref="purchaseInvoiceParam"
      :rules="rules"
    >
      <div class="chunkBox">
        <el-form-item label="发票类型：" prop="invoiceType">
          <el-radio v-model="purchaseInvoiceParam.invoiceType" label="TAX_INCREASE_INVOICE" @change="clear('invoiceType')">增税专票</el-radio>
          <el-radio v-model="purchaseInvoiceParam.invoiceType" label="TAX_INCREASE" @change="clear('invoiceType')">增税普票</el-radio>
        </el-form-item>
        <el-form-item label="发票号码：" prop="invoiceNumber">
          <el-input placeholder="请输入发票号码" :disabled="name=='editerInvoice'" v-model="purchaseInvoiceParam.invoiceNumber" clearable @change="inputInvoiceNo"></el-input>
        </el-form-item>
      </div>
      <div class="chunkBox">
        <el-form-item label="发票代码：" prop="invoiceCode">
          <el-input placeholder="请输入发票代码" v-model="purchaseInvoiceParam.invoiceCode" clearable ></el-input>
        </el-form-item>
        <el-form-item label="校验码（后6位）：" prop="checkCode">
          <el-input placeholder v-model="purchaseInvoiceParam.checkCode" clearable></el-input>
        </el-form-item>
      </div>
      <div class="chunkBox">
        <el-form-item label="开票日期：" prop="invoiceDate">
          <el-date-picker
            v-model="purchaseInvoiceParam.invoiceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="销售方名称：" prop="supplierId">
          <el-select
            v-model="purchaseInvoiceParam.supplierId"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder
            :remote-method="getListName"
            :loading="loading"
            @change="getsupplierName"
          >
            <el-option
              v-for="item in requirementOrganizations"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="chunkBox">
        <el-form-item label="购买方名称：">
          <span>{{purchaseInvoiceParam.organizationName}}</span>
        </el-form-item>
        <el-form-item label="发票金额：" prop="amount">
          <!-- <el-input
              placeholder="0.00"
              v-model="purchaseInvoiceParam.amount"
              clearable
          ></el-input>-->
          <el-input-number
            v-model="purchaseInvoiceParam.amount"
            controls-position="right"
            :min="0.00"
            @blur="getChangeData(purchaseInvoiceParam.amount,'a')"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="chunkBox">
        <el-form-item label="发票税额：" prop="taxAmount">
          <!-- <el-input
              placeholder="0.00"
              v-model="purchaseInvoiceParam.taxAmount"
              clearable
          ></el-input>-->
          <el-input-number
            v-model="purchaseInvoiceParam.taxAmount"
            controls-position="right"
            :min="0.00"
            @blur="getChangeData(purchaseInvoiceParam.taxAmount,'b')"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="受理人：" prop="receiverId">
          <el-select
            v-model="purchaseInvoiceParam.receiverId"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder
            :remote-method="getuserListName"
            :loading="loading"
            @change="getReceiverName"
          >
            <el-option
              v-for="item in requirementUsers"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="chunkBox">
        <!-- prop="pricePlusTaxes" -->
        <el-form-item label="价税合计：" >
          <!-- <el-input
              placeholder=""
              v-model="purchaseInvoiceParam.pricePlusTaxes"
              clearable
          ></el-input>-->
          <el-input-number
            v-model="totalAmount"
            controls-position="right"
            :min="0.00"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="发票附件：" prop="imageUrl" ref="filecheck">
         <!-- <el-upload
            action="/api/file-service/file/upload?type=Purchase_Invoice_Type"
            :headers="headertoken"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="fileName"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            style="width:400px"
            :limit="1"
            :file-list="purchaseInvoiceParam.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持jpg、png、pdf格式文件，大小不超过10M，最大张数为一张</div>
          </el-upload> -->
          <el-upload
            class="avatar-uploader"
            action="/api/file-service/file/upload?type=Purchase_Invoice_Type"
            :show-file-list="false"
            list-type="picture-card"
            :headers="headertoken"
            name="fileName"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="purchaseInvoiceParam.imageUrl" :src="purchaseInvoiceParam.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">{{purchaseInvoiceParam.attachmentName}}</div>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="purchaseInvoiceParam.purchaseInvoiceBillOrderItemDTOS"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%"
      size="small"
      ref="purchaseInvoiceBillOrderItemDTOS"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="skuNo" label="商品编号" align="center" width="100"></el-table-column>
      <el-table-column prop="purchaseOrderNo" label="采购单编号" align="center"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" align="center" width="120"></el-table-column>
      <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
      <el-table-column prop="unit" label="单位" align="center"></el-table-column>
      <el-table-column prop="currentQty" label="本次结算数量" align="center"></el-table-column>
      <el-table-column prop="skuName" label="可关联数量" align="center">
        <template slot-scope="scope">{{scope.row.currentQty-scope.row.qty}}</template>
      </el-table-column>
      <el-table-column prop="qty" label="发票关联数量" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.qty"  @input="(value)=>{
                  inputQty(value,scope.row.currentQty,scope.row.qty,scope.$index)}"></el-input>
          <!-- <el-form :model="scope.row" :rules="rules">
                 <el-form-item prop="qty" style="margin-bottom:0px;" :required="true">
                   <el-input v-model="scope.row.qty" type="number" :max="scope.row.currentQty"></el-input>
                 </el-form-item>
          </el-form>-->
        </template>
      </el-table-column>
      <el-table-column prop="currentPrice" label="本次结算单价" align="center"></el-table-column>
      <el-table-column prop="taxRateText" label="税率" align="center"></el-table-column>
      <el-table-column prop="currentTaxRateText" label="本次结算税率" align="center"></el-table-column>
      <el-table-column prop="taxDifferential" label="税差" align="center"></el-table-column>
      <el-table-column prop="amount" label="小计" align="center"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmitForm('purchaseInvoiceParam')">取 消</el-button>
      <el-button type="primary" @click="submitForm('purchaseInvoiceParam')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  findSupplierNameList,
  findUserNameList,
  getPurchaseBillList,
  createPurchaseListInvoice,
  editerPurchaseListInvoice,
  editerInvoiceData,
  findSupplierByOrganizationId,
  getInvoiceDataByNo,
  getFileList,
  byOrganizationUserList
} from "@/api/purchase/purchaseBillList";
import {Debounce} from '@/utils'
import {deleteFileDelete} from "@/api/common/commonApi"
export default {
  inject:['reload','imgurl'],
  props: {},
  data() {
    const checkInvoiceCode = (rule, value, callback) => {
        if(!value){
          return callback('发票代码不能为空')
        }
        var aa = this.purchaseInvoiceParam.invoiceCode;
        aa = aa.toString().replace(/[^\d]/g, '');
        this.purchaseInvoiceParam.invoiceCode = aa;
        if (this.purchaseInvoiceParam.invoiceType== 'TAX_INCREASE_INVOICE') {
          if (value.toString().length !== 10) {
            console.log('进入');
            return callback(new Error("发票代码位数-专票10位"));
          }
          return callback()
        } else if (this.purchaseInvoiceParam.invoiceType== 'TAX_INCREASE') {
          if (value.toString().length !== 12) {
            return callback(new Error("发票代码位数-普票和电票12位"));
          }
          return callback()
        } else {
          callback();
        }
    };
    const checkCodes = (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (value &&value.length !== 6) {
           return callback(new Error("校验码必须为6位"));
        } else {
          callback();
        }
    };
    const checkInvoiceNumber = (rule, value, callback) => {
      if(!value){
        return callback('发票号码不能为空')
      }
        var aa = this.purchaseInvoiceParam.invoiceNumber;
        aa = aa.toString().replace(/[^\d]/g, '');
        this.purchaseInvoiceParam.invoiceNumber = aa;
        if (value.toString().length == 0) {
          callback();
        } else if (value !== 0 &&value.toString().length !== 8) {
           return callback(new Error("发票号码为8位"));
        } else {
          callback();
        }
    };
    
    return {
      headertoken: {'Authorization': 'Bearer ' + this.$auth.token},
      isShow: false,
      requirementOrganizations: [], //购买方集合
      requirementUsers: [], //受理人集合
      loading: false,
      name: "", //判断添加还是编辑发票
      purchaseBillId: null, //结算单id
      invoiceId: null, //发票id
      purchaseInvoiceParam: {
        amount: null, //发票金额
        attachment: null, //文件id
        attachmentName: "", //文件名称
        billPaymentMode: "", //结款方式 PAY_IN_ADVANCE  NO_PAY_IN_ADVANCE
        checkCode: "", //校验码
        createTime: "", //制单日期
        id: null,
        invoiceCode: "", //发票代码
        invoiceDate: "", //开票时间
        invoiceNumber: "", //发票号码
        invoiceType: "", //发票类型 （TAX_INCREASE_INVOICE，TAX_INCREASE ）
        invoiceTypeName: "",
        organizationId: null, //购买方：组织机构id
        organizationName: "", //购买方名称
        pricePlusTaxes: "", //价税合计
        receiverId: null, //受理人：用户id
        receiverName: "", //受理人名称
        supplierId: null, ///销售方：供应商id
        supplierName: "", //销售方名称
        taxAmount: "", //发票税额
        purchaseInvoiceBillOrderItemDTOS: null, //结算单列表
        imageUrl: ''
      },
      localUserId:null,
      organizationId:null,
      multipleSelection: [],
      rules: {
        invoiceType: [
          { required: true, message: "发票类型不能为空", trigger: "blur" }
        ],
        invoiceNumber: [
          { required: true, message: "发票号码不能为空", trigger: "blur" },
          // { min: 8, max: 8, message: "发票号码为8位"", trigger: "change"}
          { validator: checkInvoiceNumber, trigger: "blur"}
        ],
        invoiceCode: [
          { required: true, message: "发票代码不能为空", trigger: "blur" },
          { validator: checkInvoiceCode,  trigger: "blur" },
        ],
        checkCode: [
          { validator:checkCodes, trigger: "blur" },
          { validator:checkCodes, trigger: "change" }
        ],
        supplierId: [
          { required: true, message: "销售方名称不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "发票金额不能为空", trigger: "blur" }
        ],
        taxAmount: [
          { required: true, message: "发票税额不能为空", trigger: "blur" }
        ],
        pricePlusTaxes: [
          { required: true, message: "价税合计不能为空", trigger: "blur" }
        ],
        receiverId: [
          { required: true, message: "受理人不能为空", trigger: "blur" }
        ],
        imageUrl:[{required:true,message:'发票附件不能为空'}],
        invoiceDate:[{required:true,message:'开票日期不能为空',trigger:'change',trigger:'blur'}],
        // checkCode:[{required:true,message:'校验码（后6位）不能为空',trigger:'change',trigger:'blur'},{min:6,max:6,message:'只能输入六位数',trigger:'change'}],
      }
    };
  },
  computed: {
    totalAmount: {
      get:function(){
        this.purchaseInvoiceParam.pricePlusTaxes = this.purchaseInvoiceParam.amount-1+1+this.purchaseInvoiceParam.taxAmount-1+1;
        return this.purchaseInvoiceParam.pricePlusTaxes.toFixed(4);
      },
      set:function(){
        this.purchaseInvoiceParam.pricePlusTaxes = this.purchaseInvoiceParam.amount-1+1+this.purchaseInvoiceParam.taxAmount-1+1;
        return this.purchaseInvoiceParam.pricePlusTaxes.toFixed(4);
      }
    }
  },
  methods: {
    getChangeData(row,type){
        if(type=='a'){
          this.purchaseInvoiceParam.amount=Number(this.purchaseInvoiceParam.amount).toFixed(4);
        }
        if(type=='b'){
          this.purchaseInvoiceParam.taxAmount=Number(this.purchaseInvoiceParam.taxAmount).toFixed(4);
        }
    },
    inputInvoiceNo(value){
      if(value){
       if(value.length==8){
        getInvoiceDataByNo(value).then(res=>{
              if(res.success){
                if(res.data){
                  // this.purchaseInvoiceParam=res.data;
                  this.purchaseInvoiceParam.amount=res.data.amount.toFixed(2);
                  // this.purchaseInvoiceParam.billPaymentMode=res.data.billPaymentMode;
                  if(res.data.billPaymentMode){
                    this.purchaseInvoiceParam.billPaymentMode=res.data.billPaymentMode;
                  }
                  this.purchaseInvoiceParam.checkCode=res.data.checkCode;
                  this.purchaseInvoiceParam.invoiceCode=res.data.invoiceCode;
                  this.purchaseInvoiceParam.invoiceDate=res.data.invoiceDate;
                  this.purchaseInvoiceParam.supplierName=res.data.supplierName;
                  this.purchaseInvoiceParam.supplierId=res.data.supplierId;
                  this.purchaseInvoiceParam.organizationName=res.data.organizationName;
                  this.purchaseInvoiceParam.receiverName=res.data.receiverName;
                  this.requirementOrganizations=[{name:res.data.supplierName,id:res.data.supplierId}];
                  this.requirementUsers=[{realName:res.data.receiverName,id:res.data.receiverId}];
                  this.purchaseInvoiceParam.receiverId=res.data.receiverId;
                  this.purchaseInvoiceParam.pricePlusTaxes=res.data.pricePlusTaxes.toFixed(2);
                  this.purchaseInvoiceParam.taxAmount=res.data.taxAmount.toFixed(2);
                  this.purchaseInvoiceParam.invoiceType=res.data.invoiceType;
                  // this.$set(this.purchaseInvoiceParam,'attachmentName',res.data.attachmentName);
                  this.$set(this.purchaseInvoiceParam,'attachment',res.data.attachment);
                  // this.$set(this.purchaseInvoiceParam,'imageUrl',this.imgurl+res.data.filePathUrl);
                  // this.$set(this.purchaseInvoiceParam,'fileList',[{name:res.data.attachmentName==null?'发票附件':'',id:res.data.attachment}]);  
                }
              }else{
                this.$message({
                  message:res.message,
                  type:'error'
                })
                this.purchaseInvoiceParam.invoiceNumber='';
              }
                      
       }).then(res=>{
         if(this.purchaseInvoiceParam.attachment){
           getFileList(this.purchaseInvoiceParam.attachment).then(res=>{
             this.$set(this.purchaseInvoiceParam,'attachmentName',res.data.name);
             this.$set(this.purchaseInvoiceParam,'imageUrl',this.imgurl+res.data.path);
         })
         }
         
       })
       } 
       
      }else{
        this.purchaseInvoiceParam.amount=null
        this.purchaseInvoiceParam.attachment=null
        this.purchaseInvoiceParam.attachmentName=null
        // this.purchaseInvoiceParam.billPaymentMode=null
        this.purchaseInvoiceParam.createTime=null
        this.purchaseInvoiceParam.checkCode=null
        this.purchaseInvoiceParam.id=null
        this.purchaseInvoiceParam.invoiceCode=null
        this.purchaseInvoiceParam.invoiceNumber=null
        this.purchaseInvoiceParam.invoiceType=null
        this.purchaseInvoiceParam.invoiceTypeName=null
        // this.purchaseInvoiceParam.organizationId=null
        // this.purchaseInvoiceParam.organizationName=null
        this.purchaseInvoiceParam.pricePlusTaxes=null
        this.purchaseInvoiceParam.receiverId=null
        this.purchaseInvoiceParam.receiverName=null
        this.purchaseInvoiceParam.supplierId=null
        this.purchaseInvoiceParam.supplierName=null
        this.purchaseInvoiceParam.taxAmount=null
        this.purchaseInvoiceParam.imageUrl=null
        this.purchaseInvoiceParam.invoiceDate=null
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!');
        return false;
      }
      return isLt2M;
    },
    handleAvatarSuccess(res, file) {
      if(res.code=='000000'){
          this.purchaseInvoiceParam.imageUrl = URL.createObjectURL(file.raw);
          this.purchaseInvoiceParam.attachment=res.data.id;
          this.purchaseInvoiceParam.attachmentName=res.data.name;
          this.$message({
            message:'上传成功',
            type:'success'
          })
          this.$refs.filecheck.clearValidate();
        }else {
          this.$message({
            message:'上传失败',
            type:'error'
          })
        }
    },
    inputQty:Debounce(function(value,gg,kk,$index){
     let reg=/^[+]{0,1}(\d+)$/g;
     if(reg.test(value)){
       if(value>gg){
       this.$message({
        message:'发票关联数量不能大于本次结算数量',
        type:'error'
        })
        this.$nextTick(()=>{
        this.purchaseInvoiceParam.purchaseInvoiceBillOrderItemDTOS[$index].qty=''
       })
       }
     }else{
       this.$message({
         message:'本次结算数量只能为正整数',
         type:'error'
       })
     }
    }),
    init(name, row, queryParam) {
      let str = window.localStorage.getItem("UserInfo");
      let userPosts = JSON.parse(str).userPosts;
      this.purchaseInvoiceParam.organizationId = userPosts[0].organizationId;
      this.purchaseInvoiceParam.organizationName = userPosts[0].organizationName;
      this.name = name; //判断是添加还是编辑
      this.purchaseInvoiceParam.id = row.purchaseBillId;
      this.purchaseBillId = row.purchaseBillId;
      if(queryParam){
        this.purchaseInvoiceParam.billPaymentMode=queryParam.paymentMode;
      }
      if (name == "createInvoice") {
        getPurchaseBillList(row.purchaseBillId).then(res => {
          if (res.code == "000000") {
            this.purchaseInvoiceParam.purchaseInvoiceBillOrderItemDTOS =
              res.data;
            }
        });
      }
      if (name == "editerInvoice") {
        this.invoiceId = row.invoiceId;
        editerInvoiceData(row.invoiceId,row.purchaseBillId)
          .then(res => {
            if (res.code == "000000") {
              this.purchaseInvoiceParam = res.data;
              console.log(res.data,777777)
              
              this.$set(this.purchaseInvoiceParam,'purchaseInvoiceBillOrderItemDTOS',res.data.purchaseInvoiceBillListDTOS);
              this.$set(this.purchaseInvoiceParam,'attachmentName',res.data.attachmentName);
              this.$set(this.purchaseInvoiceParam,'attachment',res.data.attachment);
              this.$set(this.purchaseInvoiceParam,'imageUrl',this.imgurl+res.data.filePathUrl);
              this.$nextTick(()=>{
                 this.purchaseInvoiceParam.purchaseInvoiceBillOrderItemDTOS.forEach((item)=>{
                  //  debugger
                 this.$refs['purchaseInvoiceBillOrderItemDTOS'].toggleRowSelection(item,true)
              })
              this.requirementOrganizations=[{name:res.data.supplierName,id:res.data.supplierId}];
              this.requirementUsers=[{realName:res.data.receiverName,id:res.data.receiverId}];
              })
            }
          })
          // .then(res => {
          //   getPurchaseBillList(row.purchaseBillId).then(res => {
          //     if (res.code == "000000") {
          //       // res.data=res.data.map(item=>{
          //       //   return {purchaseBillOrderItemId:item.id,qty:item.qty}
          //       // })
          //       this.$set(this.purchaseInvoiceParam, 'purchaseInvoiceBillOrderItemDTOS',res.data)
          //     }
          //   });
          // });
      }
      this.isShow = true;
    },
    getListName(query) {
      let str = window.localStorage.getItem("UserInfo");
        let userPosts = JSON.parse(str).userPosts;
        this.organizationId = userPosts[0].organizationId;    
       findSupplierByOrganizationId(this.organizationId,{ name: query }).then(res => {
        if (res.code == "000000") {
          this.requirementOrganizations = res.data;
        }
      });
    },
    clear(name){
      this.$refs.purchaseInvoiceParam.clearValidate(name);
      if (this.purchaseInvoiceParam.invoiceCode.length !== 0) {
          this.$refs.purchaseInvoiceParam.validateField("invoiceCode");
      }
    },
    getuserListName(query) {
      let str = window.localStorage.getItem('UserInfo');
      let userPosts=JSON.parse(str).userPosts;
      this.localUserId=userPosts[0].organizationId;
      byOrganizationUserList({ realName: query ,organizationId:this.localUserId}).then(res => {
        if (res.code == "000000") {
          this.requirementUsers = res.data;
        }
      });
    },
    getReceiverName(value){
        let aaa=JSON.parse(JSON.stringify(this.requirementUsers));
        aaa=aaa.filter((item)=>{
          return item.id==value
        })
        this.purchaseInvoiceParam.receiverName=aaa[0]&&aaa[0].realName;
       if(this.purchaseInvoiceParam.receiverName){
         this.clear('receiverId')
       }
    },
    getsupplierName(val){
       let aaa=JSON.parse(JSON.stringify(this.requirementOrganizations));
        aaa=aaa.filter((item)=>{
          return item.id==val
        })
        this.purchaseInvoiceParam.supplierName=aaa[0]&&aaa[0].name;
        if(this.purchaseInvoiceParam.supplierName){
          this.clear('supplierId')
        }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    cancelSubmitForm(formName) {
      this.$confirm("取消后填写的数据将不会保存，是否取消？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: '取消',
        type: "warning"
      })
        .then(() => {
          console.log('ddd',this.isShow,'ww');
          this.clearData('purchaseInvoiceParam');
          this.isShow = false;
        }).catch(() => {
          // this.isShow = false;
        });
    },
    //对话框关闭时清空数据和校验
    clearData(formName) {
      this.purchaseInvoiceParam = {
        amount: null, //发票金额
        attachment: null, //文件id
        attachmentName: "", //文件名称
        billPaymentMode: "", //结款方式 PAY_IN_ADVANCE  NO_PAY_IN_ADVANCE
        checkCode: "", //校验码
        createTime: "", //制单日期
        id: null,
        invoiceCode: "", //发票代码
        invoiceDate: "", //开票时间
        invoiceNumber: "", //发票号码
        invoiceType: "", //发票类型 （TAX_INCREASE_INVOICE，TAX_INCREASE ）
        invoiceTypeName: "",
        organizationId: null, //购买方：组织机构id
        organizationName: "", //购买方名称
        pricePlusTaxes: "", //价税合计
        receiverId: "", //受理人：用户id
        receiverName: "", //受理人名称
        supplierId: null, ///销售方：供应商id
        supplierName: "", //销售方名称
        taxAmount: "", //发票税额
      };
      this.purchaseInvoiceParam.attachment=null;
      this.purchaseInvoiceParam.fileList=[];
      this.$set(this.purchaseInvoiceParam,'purchaseInvoiceBillOrderItemDTOS',null)
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ccc=[];
           ccc= this.multipleSelection.map((item)=>{
            return {purchaseBillOrderItemId:item.id,qty:Number(item.qty),currentQty:item.currentQty}
          })
          if(ccc.length==0){
            this.$message({
              message:'没有选中的商品编号信息',
              type:'error'
            })
          }else{
           if (this.name == "createInvoice") {
            createPurchaseListInvoice(
              this.purchaseBillId,
              {
                  amount: this.purchaseInvoiceParam.amount, //发票金额
                  attachment: this.purchaseInvoiceParam.attachment, //文件id
                  attachmentName: this.purchaseInvoiceParam.attachmentName, //文件名称
                  billPaymentMode: this.purchaseInvoiceParam.billPaymentMode, //结款方式 PAY_IN_ADVANCE  NO_PAY_IN_ADVANCE
                  checkCode: this.purchaseInvoiceParam.checkCode, //校验码
                  createTime: this.purchaseInvoiceParam.createTime, //制单日期
                  id: Number(this.purchaseInvoiceParam.id),//结算单id
                  invoiceCode: this.purchaseInvoiceParam.invoiceCode, //发票代码
                  invoiceDate: this.purchaseInvoiceParam.invoiceDate, //开票时间
                  invoiceNumber: this.purchaseInvoiceParam.invoiceNumber, //发票号码
                  invoiceType: this.purchaseInvoiceParam.invoiceType, //发票类型 （TAX_INCREASE_INVOICE，TAX_INCREASE ）
                  invoiceTypeName: this.purchaseInvoiceParam.invoiceTypeName,
                  organizationId: this.purchaseInvoiceParam.organizationId, //购买方：组织机构id
                  organizationName: this.purchaseInvoiceParam.organizationName, //购买方名称
                  pricePlusTaxes: this.purchaseInvoiceParam.pricePlusTaxes.toFixed(2), //价税合计
                  receiverId: this.purchaseInvoiceParam.receiverId, //受理人：用户id
                  receiverName: this.purchaseInvoiceParam.receiverName, //受理人名称
                  supplierId: this.purchaseInvoiceParam.supplierId, ///销售方：供应商id
                  supplierName: this.purchaseInvoiceParam.supplierName, //销售方名称
                  taxAmount: this.purchaseInvoiceParam.taxAmount, //发票税额
                  purchaseInvoiceBillOrderItemDTOS: ccc //结算单列表
                }
            ).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "新建发票成功",
                  type: "success"
                });
                this.isShow = false;
                this.$emit("createInvoiceCallback")
                this.clearData(formName);
              }
            });
          }
          if (this.name == "editerInvoice") {
          //    let ddd=[];
          //  ddd= this.multipleSelection.map((item)=>{
          //   return {purchaseBillOrderItemId:item.id,qty:Number(item.qty),currentQty:item.currentQty}
          // })
            editerPurchaseListInvoice(
              this.invoiceId,this.purchaseBillId,
              {
                  amount: this.purchaseInvoiceParam.amount, //发票金额
                  attachment: this.purchaseInvoiceParam.attachment, //文件id
                  attachmentName: this.purchaseInvoiceParam.attachmentName, //文件名称
                  billPaymentMode: this.purchaseInvoiceParam.billPaymentMode, //结款方式 PAY_IN_ADVANCE  NO_PAY_IN_ADVANCE
                  checkCode: this.purchaseInvoiceParam.checkCode, //校验码
                  createTime: this.purchaseInvoiceParam.createTime, //制单日期
                  id: Number(this.purchaseInvoiceParam.id),//结算单id
                  invoiceCode: this.purchaseInvoiceParam.invoiceCode, //发票代码
                  invoiceDate: this.purchaseInvoiceParam.invoiceDate, //开票时间
                  invoiceNumber: this.purchaseInvoiceParam.invoiceNumber, //发票号码
                  invoiceType: this.purchaseInvoiceParam.invoiceType, //发票类型 （TAX_INCREASE_INVOICE，TAX_INCREASE ）
                  invoiceTypeName: this.purchaseInvoiceParam.invoiceTypeName,
                  organizationId: this.purchaseInvoiceParam.organizationId, //购买方：组织机构id
                  organizationName: this.purchaseInvoiceParam.organizationName, //购买方名称
                  pricePlusTaxes: this.purchaseInvoiceParam.pricePlusTaxes.toFixed(2), //价税合计
                  receiverId: this.purchaseInvoiceParam.receiverId, //受理人：用户id
                  receiverName: this.purchaseInvoiceParam.receiverName, //受理人名称
                  supplierId: this.purchaseInvoiceParam.supplierId, ///销售方：供应商id
                  supplierName: this.purchaseInvoiceParam.supplierName, //销售方名称
                  taxAmount: this.purchaseInvoiceParam.taxAmount, //发票税额
                  purchaseInvoiceBillOrderItemDTOS: ccc //结算单列表
                }
            ).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "编辑发票成功",
                  type: "success"
                });
                this.isShow = false;
                this.clearData(formName);
                this.$emit("createInvoiceCallback");
              }
            });
          }
          }
          
          
        }
      });
    }
  }
};
</script>
<style scoped lang="less">

.createInvoiceBox {
  .chunkBox {
    margin-left: 10%;
    display: flex;
    .el-form-item {
      flex: 1;
      .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 107px;
            height: 107px;
            line-height: 107px;
            text-align: center;
          }
          .avatar {
            width:100%;
            display: block;
          }
    }
  }
}
</style>
<style scoped>
.createInvoiceBox >>> .el-dialog__body {
  height: 60vh;
  overflow: auto;
}
</style>