<template>
	<div class="brandBox">
    <div class="buttonBox">
      <el-button v-for="(item,index) in headerData" :key="item.status" size="small" :class="{active: buttonshow==index}" @click="header_button_click(index,item.status)">{{item.statusName}}（{{item.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="search">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-if="isShow">
          <el-row style="width:100%">
             <el-col :span="6" class="el-col">
              <span class="span-style">项目名称：</span>
              <el-select
                v-model="projectId"
                filterable
                remote
                clearable
                placeholder="项目名称"
                :remote-method="projectRemote"
                :loading="loading">
                <el-option
                  v-for="item in projectName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">制单员：</span>
              <el-select
                v-model="creatorId"
                filterable
                remote
                clearable
                placeholder="制单员"
                :remote-method="listerRemote"
                :loading="loading">
                <el-option
                  v-for="item in listerName"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">订单号：</span>
              <el-input
                placeholder="订单号"
                v-model="no"
                clearable>
              </el-input>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">客户名称：</span>
              <el-select
                v-model="customerId"
                filterable
                remote
                clearable
                placeholder="客户名称"
                :remote-method="customerRemote"
                :loading="loading">
                <el-option
                  v-for="item in customerName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="width:100%">
            <el-col :span="6" class="el-col">
              <span class="span-style">创建组织机构：</span>
              <el-select
                v-model="organizationId"
                filterable
                remote
                clearable
                placeholder="组织机构"
                :remote-method="organizationRemote"
                :loading="loading">
                <el-option
                  v-for="item in organizationName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12" class="el-col">
              <div class="time-box">
                <span class="span-style" style="flex-grow: 0;flex-shrink: 0;">创建时间：</span>
                <el-date-picker
                  v-model="startTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始时间">
                </el-date-picker>
                <div class="text">至</div>
                <el-date-picker
                  v-model="endTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="截止时间">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconshujuliebiao"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="addNew" v-if="$authorities.PaymentCustomerCreate"><i class="iconfont icontianjiashangpin"></i>新建结算单</div>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight"
        style="width: 100%"
        size="small">
        <el-table-column
          prop="billNo"
          label="结算单编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="结算单名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="结算单金额"
          :formatter="retainDecimals"
          align="center">
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="结算单状态"
          align="center">
        </el-table-column>
         <el-table-column
          prop="projectName"
          label="项目名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="关联客户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="organizationName"
          label="创建组织机构"
          align="center">
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="制单员"
          align="center">
        </el-table-column>
        <el-table-column
          prop="invoiceApplicationNo"
          label="申请单编号"
          align="center">
          <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.invoiceApplicationId==null">---</el-button>
              <span v-else>{{scope.row.invoiceApplicationNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="相关"
          align="center">
          <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.invoiceApplicationId==null">---</el-button>
              <el-button type="text" size="small" v-else @click="applyInvoice(scope.row.invoiceApplicationId)" v-show="$authorities.PaymentCustomerInvoiceApply">发票申请</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center" min-width="150px">
          <template slot-scope="scope">
              <el-button type="text" size="small" @click="determine(scope.row.id,scope.row.name)" v-show="scope.row.status==0||scope.row.status==4" v-if="$authorities.PaymentCustomerConfirm">确定</el-button>
              <el-button type="text" size="small" @click="billing(scope.row.id,scope.row.customerId)" v-show="scope.row.status==1" v-if="$authorities.PaymentCustomerInvoice">开票</el-button>
              <el-button type="text" size="small" @click="goEdit(scope.row.id)" v-show="scope.row.status==0||scope.row.status==4" v-if="$authorities.PaymentCustomerUpdate">编辑</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row.id)" v-if="$authorities.PaymentCustomerDetail">详情</el-button>
              <el-button type="text" size="small" @click="obsoleteOrder(scope.row.id)" v-show="scope.row.status!=2&&scope.row.status!=5" v-if="$authorities.PaymentCustomerCancel">作废</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="结算单作废确认弹窗" :visible.sync="dialogFormVisible" class="obsolete">
        <el-form ref="formName" :model="form"  class="el-froms" prop="targetCustomerKeyInfoDTOList">
          <el-form-item class="form-box">
            <table border="1">
              <tr>
                <th>结算单编号：</th>
                <td>{{forms.billNo}}</td>
                <th>结算单名称：</th>
                <td>{{forms.name}}</td>
              </tr>
              <tr>
                <th>创建时间：</th>
                <td>{{forms.createTime}}</td>
                <th>结算单状态：</th>
                <td>{{forms.statusName}}</td>
              </tr>
              <tr>
                <th>关联项目：</th>
                <td>{{forms.projectName}}</td>
                <th>关联客户：</th>
                <td>{{forms.customerName}}</td>
              </tr>
              <tr>
                <th>结算金额：</th>
                <td>￥{{forms.amount.toFixed(4)}}</td>
                <th>制单员：</th>
                <td>{{forms.makerUserName}}</td>
              </tr>
              <tr>
                <th>关联服务方：</th>
                <td>{{forms.serverName}}</td>
                <th>结算单备注</th>
                <td>{{forms.memo}}</td>
              </tr>
              <tr>
                <th>驳回原因：</th>
                <td>{{forms.rejectReason}}</td>
                <th></th>
                <td></td>
              </tr>
            </table>
            <h2>订单信息</h2>
            <el-table
              :data="forms.orderDetailDTOs"
              border>
              <el-table-column
                prop="no"
                label="订单编号" align="center" >
              </el-table-column>
              <el-table-column
                prop="assignTime"
                label="下单时间" align="center">
              </el-table-column>
              <el-table-column
                prop="finishTime"
                label="完成时间" align="center">
              </el-table-column>
              <el-table-column
                prop="deliveryStatusName"
                label="订单状态" align="center">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="订单金额" align="center">
              </el-table-column>
              <el-table-column
                prop="alreadyTotal"
                label="已结算金额" align="center">
              </el-table-column>
              <el-table-column
                prop="currentAmount"
                label="本次结算金额" align="center">
              </el-table-column>
              <el-table-column
                prop="customerUserName"
                label="下单人" align="center">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item class="form-button-box">
            <el-button type="danger" @click="innerObsoleteOrder()" class="form-button">作废</el-button>
            <el-button type="primary" @click="oncancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="添加开票信息" :visible.sync="dialogFormVisible1" @close="close" class="billing">
        <el-row :gutter="10">
          <el-col :span="9"><div class="grid-content bg-purple">项目名称：<span>{{projectName}}</span></div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">客户名称：<span>{{customerName}}</span></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple">申请开票金额：<span>{{invoicedAmount | toFixedFn}}</span></div></el-col>
        </el-row>
        <h3>开票信息</h3>
        <el-form ref="formName" :model="form" class="bill-from" label-width="150px" :rules="rules">
          <el-form-item label="开票方：" prop="drawerName">
            <el-input 
            v-model="form.drawerName"
            :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label="开票类型：" prop="invoiceType">
            <el-radio-group v-model="form.invoiceType" @change="typeChange">
              <el-radio :label="0">专票</el-radio>
              <el-radio :label="1">普票</el-radio>
              <el-radio :label="2">电子发票</el-radio>
            </el-radio-group>
            <el-button type="primary" v-if="customerName&&(customerType!=5||!customerRowId)" size="small" style="float: right;" @click="addC()">新增开票信息</el-button>
          </el-form-item>
          
          <el-form-item label="开票抬头：" prop="invoiceTitle"  >
            <el-select v-model="form.invoiceTitle" 
              filterable 
              placeholder="请选择发票抬头" 
              @change="changeInvoiceTitle"
              style="width:100%"
              v-if="customerType!='5'&&customerName!=''"
               >
              <el-option
                v-for="(item,index) in invoiceTitles"
                :key="index"
                :label="item.invoiceTitle"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-model="form.invoiceTitle" placeholder="字数长度1~30以内" v-else></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码：" prop="socialCreditCode" :rules="form.invoiceType!='0'?rules.socialCreditCode1:rules.socialCreditCode">
            <el-input 
            v-model="form.socialCreditCode" 
            :disabled="customerType!='5'&&customerName!=''?true:false"
            placeholder="字数长度1~20以内">
            </el-input>
          </el-form-item>
          <el-form-item label="地址：" prop="addressOnInvoice" :rules="form.invoiceType!='0'?rules.addressOnInvoice1:rules.addressOnInvoice">
            <el-input
              type="textarea"
              v-model="form.addressOnInvoice"
              :disabled="customerType!='5'&&customerName!=''?true:false"
              rows="5">
            </el-input>
          </el-form-item>
          <el-form-item  prop="phoneOnInvoice" label="电话：" :rules="form.invoiceType!='0'?rules.phoneOnInvoice1:rules.phoneOnInvoice">
            <el-input 
              v-model="form.phoneOnInvoice"
              :disabled="customerType!='5'&&customerName!=''?true:false">
            </el-input>
          </el-form-item>
          <el-form-item  prop="bank" label="开户行：" :rules="form.invoiceType!='0'?rules.bank1:rules.bank" >
            <el-input 
              v-model="form.bank"
              :disabled="customerType!='5'&&customerName!=''?true:false">
            </el-input>
          </el-form-item>
          <el-form-item  prop="accountNo" label="账号：" :rules="form.invoiceType!='0'?rules.accountNo1:rules.accountNo">
            <el-input 
              v-model="form.accountNo"
              :disabled="customerType!='5'&&customerName!=''?true:false">
            </el-input>
          </el-form-item>
          <el-form-item  prop="email" label="邮箱：" v-if="form.invoiceType==2">
            <el-input v-model="form.email">
            </el-input>
          </el-form-item>
          <div  class="el-paytime">
            <el-form-item label="预计回款时间：" prop="expectPaidDate">
              <el-date-picker
                v-model="form.expectPaidDate"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                placeholder="选择时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item  label="是否需要收据：" prop="needReceipt">
              <el-radio-group v-model="form.needReceipt">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="el-paytime" v-if="form.invoiceType!=2">
            <el-form-item label="发票寄送联系人：" prop="receiverName" >
              <el-input v-model="form.receiverName" placeholder="请输入发票寄送联系人">
              </el-input>
            </el-form-item>
            <el-form-item  prop="receiverPhone" label="联系方式：">
              <el-input v-model="form.receiverPhone"  placeholder="字数长度1~15以内">
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="发票寄送地址：" prop="receiverAddressProvinceId" v-if="form.invoiceType!=2" >
            <el-select v-model="form.receiverAddressProvinceId" placeholder="选择省/直辖市" @change="onProvincesChange" class="area-elect">
              <el-option
                v-for="(item,index) in provinces"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="form.receiverAddressCityId" placeholder="选择城市" @change="onCityChange" class="area-elect">
              <el-option
                v-for="(item,index) in city"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="form.receiverAddressCountyId" placeholder="选择区/县" class="area-elect">
              <el-option
                v-for="(item,index) in county"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票寄送详细地址：" prop="recipientAddressLine" v-if="form.invoiceType!=2">
            <el-input
              type="textarea"
              placeholder="详细地址，请输入200字以内"
              v-model="form.recipientAddressLine"
              rows="5">
            </el-input>
          </el-form-item>
          <el-form-item label="发票备注：" prop="memoOnInvoice">
            <el-input v-model="form.memoOnInvoice"></el-input>
          </el-form-item>
          <el-form-item label="申请备注：" prop="applicationMemo">
            <el-input v-model="form.applicationMemo"></el-input>
          </el-form-item>
          <el-form-item label="备注1：" prop="memo1">
            <el-input v-model="form.memo1"></el-input>
          </el-form-item>
          <el-form-item label="备注2：" prop="memo2">
            <el-input v-model="form.memo2"></el-input>
          </el-form-item>
          <el-form-item label="备注3：" prop="memo3">
            <el-input v-model="form.memo3"></el-input>
          </el-form-item>
          <el-form-item label="备注4：" prop="memo4">
            <el-input v-model="form.memo4"></el-input>
          </el-form-item>
          <el-form-item label="备注5：" prop="memo5">
            <el-input v-model="form.memo5"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer form-button-box">
          <el-button type="primary" @click="applicationBilling('formName')">申请开票</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :visible.sync="adddialog"
        width="965px"
        custom-class="dialog-box"
        @close="reload()">
        <div slot="title" class="dialog-title">
          <span class="reject-title">添加开票信息</span>
        </div>
        <div class="dialog-body">
          <div class="title">
            <i style="color: red;">*</i>
            <i>客户名称：</i>
            <i style="color: red;">{{customerName}}</i>
          </div>
          <div>
            <div class="dialog-body-head">
              <span>开票信息</span>
            </div>
            <div class="dialog-body-body">
              <el-form label-width="200px" :rules="customerRules"  :model="customerForm" ref="customerForm">
                <el-form-item prop="name">
                  <span slot="label">
                    <i style="color:red">*</i> 开票类型：
                  </span>
                  <el-radio-group v-model="customerForm.type" @change="ontypechange">
                    <el-radio :label="1">普票</el-radio>
                    <el-radio :label="0">专票</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item prop="invoiceTitle">
                  <span slot="label">
                    <i style="color:red">*</i> 开票抬头：
                  </span>
                  <el-input v-model="customerForm.invoiceTitle" placeholder="字数长度1~30"></el-input>
                </el-form-item>
                <el-form-item prop="socialCreditCode">
                  <span slot="label">
                    <i style="color:red" v-if="customerType!=4||customerForm.type==0">*</i> 统一社会信用代码：
                  </span>
                  <el-input v-model="customerForm.socialCreditCode" placeholder="字符长度1~20"></el-input>
                </el-form-item>
                <el-form-item prop="addressOnInvoice" :rules="customerForm.type!='1'?customerRules.addressOnInvoice:customerRules.addressOnInvoice1">
                  <span slot="label">地址：</span>
                  <el-input
                    type="textarea"
                    placeholder="请输入200字以内"
                    v-model="customerForm.addressOnInvoice"
                    rows="5"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="phoneOnInvoice" :rules="customerForm.type!='1'?customerRules.phoneOnInvoice:customerRules.phoneOnInvoice1">
                  <span slot="label">电话：</span>
                  <el-input v-model="customerForm.phoneOnInvoice" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="bank" :rules="customerForm.type!='1'?customerRules.bank:customerRules.bank1">
                  <span slot="label">开户行：</span>
                  <el-input v-model="customerForm.bank" placeholder="银行+支行信息，字数长度1~50"></el-input>
                </el-form-item>
                <el-form-item prop="accountNo" :rules="customerForm.type!='1'?customerRules.accountNo:customerRules.accountNo1">
                  <span slot="label">账号：</span>
                  <el-input v-model="customerForm.accountNo" placeholder="数字长度16~19"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addinvoice('customerForm')">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="block" v-show="total!=0">
        <el-pagination
         @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
  </div>
</template>
<script>

import {getBillList,statusCount,obsolete,getObsolete,
        checkObsolete,customerName,getApplication,
        geBillingUp,geBillingUps,getConfirmed,getBeConfirmed,getSubmitted,
        getCompleted,getDismissed,getOutDate,applicationBill,confirm,checkEdit} from '@/api/payment';
import {provinces_based_id,subs} from '@/api/basicSupplier';
import {
  nameList,
  simpleList,
  organizationListName
} from "@/api/projectController/projectController";
import {
  addinvoice,
  checkInvoice,
} from "@/api/customerManage";
import { constants } from 'zlib';
import { connect } from 'net';

import { Debounce } from "@/utils";

export default {
  name:'customerStatementList',
  inject:['reload'],
  components: {
  },
  data() {
  	var checkTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("开票抬头不能为空"));
      }
      var reg = /^[^"'”“‘’v\n\\]+$/;
      if (!reg.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else if (value.length > 30) {
        callback(new Error("字数长度1~30"));
      } else {
        checkInvoice({
          customerId: this.customerRowId,
          id:0,
          invoiceTitle: value,
          type: this.customerForm.type
        }).then(res => {
          if (res.code == "000000") {
            callback();
          } else if (res.code == "010020028") {
            callback(new Error("同一客户同类型的发票抬头不能相同!"));
          }
        });
      }
    };
    var checkEmail=(rule,value,callback)=>{
      var isEmail = /^[_a-z0-9]+@([_a-z0-9]+.)+[a-z0-9]{2,3}$/;
      if (isEmail.test(value)||value=="") {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱码格式"));
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系方式不能为空"));
      }
      var isMob = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/; // 座机
      if (isMob.test(value)) {
        callback();
      } else {
        callback(new Error("联系方式错误"));
      }
    };
    return {
    	adddialog:false,
      targetCustomerOperationLog:[],
      creatorId: '',
      creatorName:'',
      customerId:'',
      customerRowId:'',
      customerName:[],
      listerName:[],
      organizationName:[],
      remoteNameList:[],
      projectName:'',
      endTime: "",
      no:'',
      id:null,
      organizationId: '',
      page:1,
      status:6,
      pageSize:10,
      projectId: '',
      startTime: '',
      billNo:'',
      amount:0,
      createTime:'',
      ServerName:'',
      statusName:'',
      lister:'',
      total:0,
      isShow:false,
      tableData:[],
      headerData:[],
      buttonshow:0,
      outerVisible:false,
      innerVisible: false,
      remoteLoading: false,
      invoicedAmount:'',
      provinces:[],
      city:[],
      county:[],
      invoiceTitles:[],
      invoiceTitle0:[],
      invoiceTitle1:[],
      invoiceTitle2:[],
      invoiceApplicationStatus:false,
      customerType:null,
      form:{
        drawerName:'',
        invoiceOfferId:'',
        invoiceType:null,
        invoiceTitle:'',
        addressOnInvoice:'',
        socialCreditCode:'',
        accountNo:'',
        bank:'',
        email:'',
        expectPaidDate:'',
        needReceipt:0,
        phoneOnInvoice:'',
        receiverName:'',
        receiverPhone:'',
        receiverAddressCityId:'',
        receiverAddressCountyId:'',
        receiverAddressProvinceId:'',
        recipientAddressLine:'',
        applicationMemo:'',
        memoOnInvoice:'',
        memo1:'',
        memo2:'',
        memo3:'',
        memo4:'',
        memo5:'',
      },
      customerForm: {
        type: 0,
        invoiceTitle: null,
        addressOnInvoice: null,
        socialCreditCode: '',
        phoneOnInvoice: null,
        bank: null,
        accountNo: null
      },
      customerRules:{
        invoiceTitle: [{ validator: checkTitle, trigger: "blur" }],
        socialCreditCode: [
          {
            validator: (rule, value, callback) => {
              if (!value && (this.customerType != 4 || this.customerForm.type == 0)) {
                return callback(new Error("统一社会信用代码不能为空"));
              }
              if (value.length > 20) {
                callback(new Error("不能超过20个字"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        addressOnInvoice: [
          { required: true, message: "请输入地址", trigger: "blur" },
          { min: 1, max: 400, message: "长度在 1 到 200 个字", trigger: "blur" }
        ],
        addressOnInvoice1: [
          { message: "请输入地址", trigger: "blur" },
          { min: 1, max: 400, message: "长度在 1 到 200 个字", trigger: "blur" }
        ],
        bank:[
          { required: true, message: "请输入开户行", trigger: "blur" },
          { min: 1, max: 100, message: "长度在 1 到 50 个字", trigger: "blur" }
        ],
        bank1:[
          { message: "请输入开户行", trigger: "blur" },
          { min: 1, max: 100, message: "长度在 1 到 50 个字", trigger: "blur" }
        ],
        accountNo:[
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        accountNo1:[
          { message: "请输入账号", trigger: "blur" }
        ],
        phoneOnInvoice:[
          { required: true, message: "请输入电话", trigger: "blur" }
        ],
        phoneOnInvoice1:[
          { message: "请输入电话", trigger: "blur" }
        ]
      },
      rules:{
        drawerName:[
          { required: true, message: '开票方',trigger: 'blur'}
        ],
        invoiceType:[
          { required: true, message: '请选择开票类型', trigger: 'change' }
        ],
        invoiceTitle:[
          { required: true, message: '开票抬头', trigger: 'blur' }
        ], 
        socialCreditCode: [
          {required:true,min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
        ],
        socialCreditCode1: [
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
        ],
        addressOnInvoice:[
          {required: true, message: '请输入地址', trigger: 'blur' }
        ],
        addressOnInvoice1:[
          { message: '请输入地址', trigger: 'blur' }
        ],
        receiverPhone: [
          { required: true, min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        bank:[
          { required: true, message: '请输入开户行', trigger: 'blur' }
        ],
        bank1:[
          { message: '请输入开户行', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { 
            validator: checkEmail, 
            trigger: "blur" 
          },
        ],
        accountNo:[
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        accountNo1:[
          { message: '请输入账号', trigger: 'blur' }
        ],
        phoneOnInvoice:[
          {required: true, message: '请输入电话', trigger: 'blur' }
        ],
        phoneOnInvoice1:[
          {message: '请输入电话', trigger: 'blur' }
        ],
        expectPaidDate:[
          { required: true, message: '请输入预计回款时间', trigger: 'change' }
        ],
        needReceipt:[
          { required: true, message: '请选择是否需要收据', trigger: 'blur' }
        ],
        receiverAddressProvinceId:[
          { required: true, message: '请选择发票寄送地址', trigger: 'change' }
        ],
        recipientAddressLine:[
          { required: true, message: '请输入发票寄送详细地址', trigger: 'blur' }
        ],
        receiverPhone: [
          { required:true, min: 1, max: 15, message: '请输入发票寄送联系电话', trigger: 'change' },
        ],
        receiverName:[{required:true, min: 1, max: 15, message: '请输入发票寄送联系人', trigger: 'blur' }]
      },
      forms:{
        billNo:'',
        amount:0,
        createTime:'',
        creatorId:0,
        customerId:0,
        customerName:'',
        customerUserId:0,
        deleted:0,
        id:0,
        makerUserName:'',
        memo:'',
        name:'',
        orderDetailDTOs:[],
        organizationId: 0,
        organizationName:'',
        projectId:0,
        projectName:'',
        rejectReason:'',
        serverName:'',
        status:0,
        statusName:'',
        updateTime:''
      },
      orderDetailDTOs:[],
      loading:false,
      dialogVisible:false,
      dialogFormVisible1:false,
      dialogFormVisible:false,
      formLabelWidth: '120px',
      pickerOptions: {
        disabledDate(time) {
          return (time.getTime()+24*60*60*1000) < Date.now();
        },
      }
    }
  },
  created() {
    this.no = this.$route.query.orderNo;
    this.getBillLists();
    this.getStatusCount();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getBillLists();
      this.getStatusCount();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  watch:{
  	'form.invoiceType':{
			handler:function(a,b){
				if(a==2){
					this.form.recipientAddressLine=''
					this.form.receiverAddressProvinceId=''
					this.form.receiverAddressCityId=''
					this.form.receiverAddressCountyId=''
					this.form.receiverName=''
					this.form.receiverPhone=''
					this.form.needReceipt=''
					this.form.expectPaidDate=''
				}
			},
			deep:true
		},
		'customerForm.type':{
			handler:function(a,b){
				if(a==1){
		    	this.customerForm.addressOnInvoice=null
		    	this.customerForm.phoneOnInvoice=null
		    	this.customerForm.bank=null
		    	this.customerForm.accountNo=null
				}
			},
			deep:true
		},
		invoiceTitles(a,b){
			console.log(a)
		}
  },
  methods: {
    search(){
     let n=this.status;
      switch(n){
    			case 6:
    			  this.getBillLists()
    			break;
    			case 0:
    				this.BeConfirmed()
          break;
          case 1:
    		    this.confirmed()
    			break;
    			case 2:
    				this.Submitted()
          break;
          case 3:
    			this.Completed()
    			break;
    			case 4:
    				this.OutDate()
          break;
          case 5:
            this.Dismissed()
    			break;
    	}
    },
    ontypechange() {
    	
    },
    addC(){
    	this.adddialog = true;
    	this.dialogFormVisible1 = false;
    },
    addinvoice:Debounce(function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let a=this.customerForm;
          for(var item in a){
            if(a[item]===''){
              a[item]=null;
            }
          }
          a.customerId=this.customerRowId;
          addinvoice(a).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "已成功保存",
                type: "success"
              });
              this.adddialog = false;
              this.$refs["customerForm"].clearValidate();
              this.reload();
            }
          });
        }
      });
    }),
    reset(){
      this.creatorId=null;
      this.customerId=null;
      this.endTime=null;
      this.no=null;
      this.organizationId=null;
      this.projectId=null;
      this.startTime=null;
      this.search();
    },
    getStatusCount(){
    	statusCount().then(res=>{
        this.headerData=res.data
    	})
    },
    header_button_click(index,status){
      this.buttonshow=index;
      this.status=status;
    	this.requestData(index)
    },
    requestData(index){
      let n=index?index:this.buttonshow;
      this.page=1;
    		switch(n){
    			case '0':
    			  this.getBillLists()
    			break;
    			case '1':
    				this.BeConfirmed()
          break;
          case '2':
    		    this.confirmed()
    			break;
    			case '3':
    				this.Submitted()
          break;
          case '4':
    			this.Completed()
    			break;
    			case '5':
    				this.OutDate()
          break;
          case '6':
            this.Dismissed()
    			break;
    	}
    },
    confirmed(){
    	 getConfirmed({
        creatorId:this.creatorId,
        customerId:this.customerId,
        endTime: this.endTime,
        no:this.no,
        organizationId:this.organizationId,
        pageNum:this.page,
        pageSize: this.pageSize,
        projectId:this.projectId,
        startTime: this.startTime
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    BeConfirmed(){
    	 getBeConfirmed({
        creatorId:this.creatorId,
        customerId: this.customerId,
        endTime: this.endTime,
        no:this.no,
        organizationId:this.organizationId,
        pageNum:this.page,
        pageSize: this.pageSize,
        projectId:this.projectId,
        startTime: this.startTime
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    Submitted(){
    	 getSubmitted({
        creatorId:this.creatorId,
        customerId: this.customerId,
        endTime: this.endTime,
        no:this.no,
        organizationId:this.organizationId,
        pageNum:this.page,
        pageSize:this.pageSize,
        projectId:this.projectId,
        startTime: this.startTime
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    Completed(){
    	 getCompleted({
        creatorId:this.creatorId,
        customerId: this.customerId,
        endTime: this.endTime,
        no:this.no,
        organizationId:this.organizationId,
        pageNum:this.page,
        pageSize: this.pageSize,
        projectId:this.projectId,
        startTime: this.startTime
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    Dismissed(){
    	 getDismissed({
        creatorId:this.creatorId,
        customerId: this.customerId,
        endTime: this.endTime,
        no:this.no,
        organizationId:this.organizationId,
        pageNum:this.page,
        pageSize: this.pageSize,
        projectId:this.projectId,
        startTime: this.startTime
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    OutDate(){
    	getOutDate({
        creatorId:this.creatorId,
        customerId: this.customerId,
        endTime: this.endTime,
        no:this.no,
        organizationId:this.organizationId,
        pageNum:this.page,
        pageSize: this.pageSize,
        projectId:this.projectId,
        startTime: this.startTime
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    customerRemote(query){
        this.loading = true
        if(query){
          customerName(query).then(res=>{
            this.loading = false
            if(res.code=='000000'){
               this.customerName=res.data;
            }
          })
        }
    },
    projectRemote(query){
        this.loading = true
        if(query){
          nameList({name:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
               this.projectName=res.data;
            }
          })
        }
    },
    listerRemote(query){
        this.loading = true
        if(query){
          simpleList({userName:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
               this.listerName=res.data
            }
          })
        }
    },
    organizationRemote(query){
      this.loading = true
        if(query){
          organizationListName({name:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
               this.organizationName=res.data
            }
          })
        }
    },
    getBillLists(){
      getBillList({
        creatorId:this.creatorId,
        customerId:this.customerId,
        endTime: this.endTime,
        no:this.no,
        organizationId:this.organizationId,
        pageNum:this.page,
        pageSize: this.pageSize,
        projectId:this.projectId,
        startTime: this.startTime
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    retainDecimals(row, column){
      let amount='';
      amount=row.amount.toFixed(4);
      return amount='￥'+amount;
    },
    handleCurrentChange(val) {
      this.page=val;
      this.search();
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.search();
    },
    createTimes(row,column){
      return row.createTime.substring(0,row.createTime.indexOf('T'));
    },
    querySearchAsync(queryString, cb) {
      targetCustomerName({
          name:this.targetCustomerName
        }).then(res=>{
          if(res.code=='000000'){
            this.customerNames =res.data;
            this.customerName=queryString;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(this.customerNames);
            }, 3000 * Math.random());
          }
        })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    addNew(){
      this.$router.push({
        name: "addStatement"
      })
    },
    goDetail(id){
      this.$router.push({
        name: "PaymentDetail",
        query:{id:id}
      })
    },
    goEdit(id){
      checkEdit(id).then(res=>{
          if(res.code=='000000'){
            if(res.data){
              this.$router.push({
                name: "editStatement",
                query:{id:id}
              })
            }
          }
      })
    },
    applyInvoice(id){
      if(id==0){
        return ;
      }else{
        this.$router.push({
          name: "InvoiceApplicationDetaills",
          query:{id:id}
        })
      }
    },
    determine(id) {
      this.$confirm('结算单确认后可申请发票，非驳回状态不可修改内容', '结算单确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        confirm(id).then(res=>{
          if(res.code=='000000'){
            if(res.data=="1"){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                this.search();
                this.getStatusCount();
              }, 3000 * Math.random());
            }
          }
        })   
      }).catch(() => {
                       
      });
    },
    obsoleteOrder(id){
      checkObsolete(id).then(res=>{
        if(res.code=='000000'){
          if(true){
            this.dialogFormVisible = true;
             getObsolete(id).then(res=>{
              if(res.code=='000000'){
                this.forms=res.data;
              }
            })
          }else{
           this.$message({
              message:'当前工作状态不可作废，请等待关联发票作废！',
              type:'warning'
            });
          }
        }else{
          this.$message({
            message:res.message,
            type:'error'
          });
        }
      })
    },
    changeStatus(rows){
      let status='';
      switch(rows){
        case 0:
          status="待确认"
          break;
        case 1:
          status="已确认"
          break;
        case 2:
          status="已提交"
          break;
        case 3:
          status="已完成"
          break;
        case 4:
          status="已驳回"
          break;
        case 5:
          status="已作废"
          break;
      }
      return status;
    },
    innerObsoleteOrder(){
       obsolete(this.forms.id).then(res=>{
        if(res.code=='000000'){
          if(res.data){
            this.$message({
              message:'结算单作废成功！',
              type:'success'
            });
            clearTimeout(this.timeout);
            this.dialogFormVisible=false;
            this.timeout = setTimeout(() => {
              this.search()
              this.getStatusCount();
            }, 3000 * Math.random());
          }
        }
      })
    },
    billing(id,customerId){
      this.getProvinces();
      this.getInvoiceTitle(customerId)
      this.customerRowId=customerId
      this.form.billId=id;
      getApplication(id).then(res=>{
        if(res.code=='000000'){
          this.customerType=res.data.customerType;
          this.projectName=res.data.projectName;
          this.customerName=res.data.customerName;
          this.invoicedAmount=res.data.billAmount;
          this.form.drawerName=res.data.drawerName;
          this.form.invoiceOfferId=res.data.drawerId;
          this.invoiceApplicationStatus=res.data.invoiceApplicationStatus;
          this.dialogFormVisible1 = true;
        }
      })
    },
    changeInvoiceTitle(val){
          this.form.invoiceTitle=val.invoiceTitle
          this.form.socialCreditCode=val.socialCreditCode;
          this.form.addressOnInvoice=val.addressOnInvoice;
          this.form.phoneOnInvoice=val.phoneOnInvoice;
          this.form.bank=val.bank;
          this.form.accountNo=val.accountNo;
    },
    getInvoiceTitle(customerId){
    	this.invoiceTitle0=[]
    	this.invoiceTitle1=[]
    	this.invoiceTitle2=[]
        geBillingUp(customerId).then(res=>{
          if(res.code=='000000'){
            let a=res.data;
            var types='';
            if(a.length>0){
            	a.map((item,index)=>{
	            	if(item.defaulted){
	            		this.form.invoiceType=item.type;
	                this.form.invoiceTitle=item.invoiceTitle;
	                this.form.socialCreditCode=item.socialCreditCode;
	                this.form.addressOnInvoice=item.addressOnInvoice;
	                this.form.phoneOnInvoice=item.phoneOnInvoice;
	                this.form.bank=item.bank;
	                this.form.accountNo=item.accountNo;
	            	}
	            	if(item.type==0){
	            		this.invoiceTitle0.push(item)
	            	}
	            	if(item.type==1){
	            		this.invoiceTitle1.push(item)
	            		this.invoiceTitle2.push(item)
	            	}
	            })
	            if(this.form.invoiceType==0){
	            	this.invoiceTitles=this.invoiceTitle0;
	            }
	            if(this.form.invoiceType==1){
	            	this.invoiceTitles=this.invoiceTitle1;
	            }
	            if(this.form.invoiceType==2){
	            	this.invoiceTitles=this.invoiceTitle2;
	            }
            }else{
            	this.form.invoiceType=null
            }
          }
        })
    },
    getProvinces(){
      provinces_based_id().then(res=>{
        if(res.code=='000000'){
          this.provinces = res.data;
        }
      })
    },
    getcity(id){
      subs(id).then(res=>{
        if(res.code=='000000'){
          this.city = res.data;
        }
      })
    },
    getcounty(id){
      subs(id).then(res=>{
        if(res.code=='000000'){
          this.county = res.data;
        }
      })
    },
    onCityChange(val){
      this.form.receiverAddressCountyId=null;
      this.getcounty(val);
    },
    onProvincesChange(val){
      this.form.receiverAddressCityId=null;
      this.form.receiverAddressCountyId=null;
      this.getcity(val);
    },
    applicationBilling(formName){
      this.$refs[formName].validate((valid) => {
        if(valid) {
          applicationBill({
            accountNo:this.form.accountNo,
            addressOnInvoice:this.form.addressOnInvoice,
            applicationMemo:this.form.applicationMemo,
            bank:this.form.bank,
            billId:this.form.billId,
            invoiceEmail:this.form.email,
            expectPaidDate:this.form.expectPaidDate,
            invoiceOfferId:this.form.invoiceOfferId,
            invoiceTitle:this.form.invoiceTitle,
            invoiceType:this.form.invoiceType,
            memo1:this.form.memo1,
            memo2:this.form.memo2,
            memo3:this.form.memo3,
            memo4:this.form.memo4,
            memo5:this.form.memo5,
            memoOnInvoice:this.form.memoOnInvoice,
            needReceipt:this.form.needReceipt,
            phoneOnInvoice:this.form.phoneOnInvoice,
            receiverAddressCityId:this.form.receiverAddressCityId,
            receiverAddressCountyId:this.form.receiverAddressCountyId,
            receiverAddressProvinceId:this.form.receiverAddressProvinceId,
            receiverName:this.form.receiverName,
            receiverPhone:this.form.receiverPhone,
            recipientAddressLine:this.form.recipientAddressLine,
            socialCreditCode:this.form.socialCreditCode
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$refs[formName].clearValidate()
              this.dialogFormVisible1=false;
              this.getBillLists();
            }
          })
        } else {
          return false;
        }
      });      
    },
    typeChange(val){
    	this.form.addressOnInvoice='';
      this.form.phoneOnInvoice='';
      this.form.bank='';
      this.form.accountNo='';
    	this.form.invoiceTitle='';
    	this.form.socialCreditCode='';
      switch(val){
        case 0:
        this.invoiceTitles=this.invoiceTitle0;
        break;
        case 1:
        this.invoiceTitles=this.invoiceTitle1;
        break;
        case 2:
        this.invoiceTitles=this.invoiceTitle2;
        break;
      }
      
    },
    close(){
      let formList={
        drawerName:'',
        invoiceOfferId:'',
        invoiceType:0,
        invoiceTitle:'',
        addressOnInvoice:'',
        socialCreditCode:'',
        accountNo:'',
        bank:'',
        email:'',
        expectPaidDate:'',
        needReceipt:0,
        phoneOnInvoice:'',
        receiverName:'',
        receiverPhone:'',
        receiverAddressCityId:'',
        receiverAddressCountyId:'',
        receiverAddressProvinceId:'',
        recipientAddressLine:'',
        applicationMemo:'',
        memoOnInvoice:'',
        memo1:'',
        memo2:'',
        memo3:'',
        memo4:'',
        memo5:'',
      };
      this.projectName='';
      this.invoicedAmount='';
      this.form=formList;
      this.$refs.formName.clearValidate();
    },
    oncancel() {
      this.dialogFormVisible=false;
    },
    querySearch(query,cb) {
      this.remoteLoading = true;
      customerName(name).then(res=>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect(item) {
      this.customerId=item.id;
    },
    querySearch1(query,cb) {
      this.remoteLoading = true;
      nameList({name:query}).then(res=>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect1(item) {
      this.projectId=item.id;
    },
    querySearch2(query,cb) {
      this.remoteLoading = true;
       simpleList({name:query}).then(res=>{
         console.log(res);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect2(item) {
      this.no=item.id;
    },
    querySearch3(query,cb) {
      this.remoteLoading = true;
       organizationListName({name:query}).then(res=>{
         console.log(res);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect3(item) {
      this.organizationId=item.id;
    },
    showHelp(){
      this.isShow=!this.isShow;
    }
  },
  filters:{
    toFixedFn(val){
      val=Number(val);
      return '￥'+val.toFixed(4);
    }
  }
};
</script>

<style scoped lang='less'>
  @color:#f3f3f3;
 .brandBox {
    width: 100%;
    box-sizing: border-box;
    /deep/.el-table{
      .el-button--small{
        padding: 4px 0;
      }
    }
    .buttonBox {
      margin-top: 10px;
      .active{
      	background-color: #339999;
      	border-color: #339999;
      	color: #FFFFFF;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-top: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        background-color: #f3f3f3;
        .head-left{
          display: flex;
          align-items: center;
        }
        .myicon{
          font-weight: bold;
          color:#666;
          font-size: 20px;
          line-height: 50px;
          margin-right: 5px;
        }
      }
      span {
        font-size: 14px;
        color: #303133;
      }
      .rightBox {
        float: right;
        span{
        	cursor: pointer;
        }
        .myicon{
          color: #999;
          font-size: 10px;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #e4e4e4;
        padding-top: 10px;
        .el-row{
          /deep/.el-col{
            display: flex;
            flex-wrap: nowrap;
          }
          .span-style{
            display:inline-block;
            width:100px;
            text-align:right;
            line-height: 40px;
          }
          .el-input {
            width: 50%;
            height: 40px;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .el-select{
            width: 50%;
            height: 40px;
            margin-left: 10px;
            margin-bottom: 10px;
          }
        }
        .time-box{
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .el-date-editor{
            width: 45%;
            height: 40px;
            margin-left: 10px;
            margin-bottom: 0;
          }
          .text{
            line-height: 40px;
          }
        }
      }
    }
    .listBox {
      font-size: 12px;
      background-color:@color;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          margin-left: 10px;
          .myicon{
            margin-left: 20px;
            font-weight: bold;
            font-size: 20px;
          }
          span {
            margin-left: 5px;
            font-size: 14px;
            color: #303133;
            line-height: 50px;
          }
        }
      }
      .listBoxRight {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;
        .button-head{
          width: 108px;
          height: 30px;
          margin-right: 10px;
          border:1px solid #d1d1d1;
          cursor:pointer;
          background-color: #fff;
          line-height: 30px;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          .button-head-icon{
            margin-right: 5px;
          }
          .icon-add{
            font-size: 12px;
          }
        }
        .button-head:hover{
          background-color: #f3f3f3;
        }
        .el-button {
          width: 80px;
          height: 30px;
          margin-top: 10px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    /deep/.obsolete{
        .el-dialog{
          width: 60%;
          margin-top:0 ;
          .el-dialog__header{
            background-color:@color; 
          }
          .el-dialog__body{
            padding-top: 0;
            .el-froms{
              border:1px solid #e4e4e4;
              box-sizing: border-box; 
              margin-top: 30px;
              .form-box{
                overflow: auto;
                max-height: 532px;
              }
              table{
                width:100%;
                margin-top:0;
                td,th{
                  border: 1px solid #e4e4e4;
                  font-size:14px;
                  height:40px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                th{
                  padding-right:6px;
                  box-sizing: border-box;
                  color:#666;
                  background: #F9FAFC;
                  font-weight:700;
                  font-size: 14px;
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
                }
              }
              /deep/.el-table{
                width:100%;
                margin:0 auto;
              }
            }

          }
          .el-dialog__footer{
            text-align: center;
              .el-button{
                width: 14%;
                margin-right:40px; 
              }
          }
        }
    }
    /deep/.billing{
      .el-dialog{
          width: 55%;
          height: 85%;
          @media screen and (min-width:1920px) {
            height: 65%;
          }
          margin-top:0 ;
          .el-dialog__header{
            background-color:@color; 
          }
          .el-dialog__body{
            padding-top: 0;
            overflow: auto;
            max-height: 70%;
            .el-row{
              padding:10px;
              span{
                color: red;
              }
            }
            h3{
              padding: 10px;
              background-color:@color;
            }
            .bill-from{
              margin-top:15px;
              .el-form-item__content{
                width:70%;
                .el-textarea__inner{
                  max-height: 70px;
                  overflow: auto;
                }
                .area-elect{
                  width:32%;
                }
                
              }
              .el-paytime{
                display: flex;
                flex-grow: 0;
                flex-shrink: 0;
                .el-form-item{
                  width: 45%;
                  .el-form-item__content{
                    width: 55%;
                    .el-date-editor{
                      width: 100%;
                    }
                  }
                }
                
              }
              .form-button-box{
                  display: flex;
                  margin-top: 15px;
                  justify-content: space-around;
                  .el-form-item__content{
                    text-align: center;
                  }
              }
              .form-box{
                overflow: auto;
                max-height: 532px;
              }
            }
          }
      }
    }
    .form-button-box{
        display: flex;
        margin-top: 15px;
        justify-content: space-around;
        .el-form-item__content{
          text-align: center;
        }
    }
    .block {
      margin-top: 2px;
      display: flex;
      justify-content: flex-end;
    }
    .dialog-box {
    position: relative;
    .dialog-body {
      height: 450px;
      margin: 5px auto;
      width: 776px;
      .title {
        font-size: 16px;
        line-height: 40px;
      }
      .dialog-body-head {
        width: 100%;
        height: 40px;
        border: 1px solid #e4e4e4;
        font-size: 16px;
        color: #666;
        font-weight: 700;
        display: flex;
        align-items: center;
        padding-left: 10px;
        box-sizing: border-box;
        background-color: #f3f3f3;
      }
      .dialog-body-body {
        overflow: scroll;
        height: 350px;
        padding-top: 10px;
        .el-input {
          width: 400px;
        }
        .el-select {
          width: 400px;
        }
        .address-select {
          width: 130px;
        }
        .el-textarea {
          width: 400px;
        }
      }
    }
    .dialog-title {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 50px;
      background-color: #f3f3f3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      .reject-title {
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
    }
    .dialog-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #d1d1d1;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }
  }
    .my-scroll-bar{
      height:200px;
    }
  }
</style>