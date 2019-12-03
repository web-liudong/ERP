<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button v-for="(item,index) in headerData" :key="item.status" size="small" :class="{ active: buttonshow==index }" @click="header_button_click(index,item.status)">{{item.statusName}}（{{item.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="search">查询结果</el-button>
           <el-button size="small" class="w80 h40" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="chunk">
            <span>订单号：</span>
            <el-input v-model="query.no" placeholder="订单号"></el-input>
          </div>
          <div class="chunk">
            <span>外部订单号：</span>
            <el-input v-model="query.customerOrderNo" placeholder="外部订单号"></el-input>
          </div>
          <div class="chunk">
            <span>订单来源：</span>
            <el-select v-model="query.orderSource">
              <el-option label="不限" value></el-option>
              <el-option label="后台" value="0"></el-option>
              <el-option label="接口" value="1"></el-option>
              <el-option label="官网" value="2"></el-option>
              <el-option label="专柜" value="3"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>是否紧急：</span>
            <el-select v-model="query.urgent">
              <el-option label="不限" value></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>项目名：</span>
            <el-select
              v-model="query.projectId"
              filterable
              remote
              placeholder="项目名"
              :remote-method="(query)=>{
              querySearch(query,'name','remoteProjectList')
            }"
              clearable
            >
              <el-option
                v-for="item in remoteProjectList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>客户名：</span>
            <el-select
              v-model="query.customerId"
              filterable
              remote
              placeholder="客户名"
              :remote-method="(query)=>{
              querySearch(query,'customer','remoteCustomerList')
            }"
              clearable
            >
              <el-option
                v-for="item in remoteCustomerList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>客户采购人：</span>
            <el-select
              v-model="query.userId"
              filterable
              remote
              placeholder="客户采购人"
              :remote-method="(query)=>{
              querySearch(query,'customerUser','remoteCustomerUserList')
            }"
              clearable
            >
              <el-option
                v-for="item in remoteCustomerUserList"
                :key="item.id+item.name"
                :label="item.name"
                :value="item.userId"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>客户联系方式：</span>
            <el-input v-model="query.customerUserPhone" placeholder="客户联系方式"></el-input>
          </div>
          <div class="chunk">
            <span>项目乙方：</span>
            <el-select
              v-model="query.partyBId"
              filterable
              remote
              placeholder="项目乙方"
              :remote-method="(query)=>{
              querySearch(query,'author','remoteBList')
            }"
              clearable
            >
              <el-option
                v-for="item in remoteBList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>乙方客户负责人：</span>
            <el-select
              v-model="query.customerUserDataAuthorityId"
              filterable
              remote
              placeholder="乙方客户负责人"
              :remote-method="(query)=>{
              querySearch(query,'manager','remoteBUserList')
            }"
              clearable
            >
              <el-option
                v-for="item in remoteBUserList"
                :key="item.id+item.realName"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>派单员：</span>
            <el-select
              v-model="query.assignUserId"
              filterable
              remote
              placeholder="派单员"
              :remote-method="(query)=>{
              querySearch(query,'manager','remotePUserList')
            }"
              clearable
            >
              <el-option
                v-for="item in remotePUserList"
                :key="item.id+item.realName"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <span>订单类型：</span>
            <el-select v-model="query.orderType">
              <el-option label="不限" value></el-option>
              <el-option label="常规订单" value="0"></el-option>
              <el-option label="赠品订单" value="1"></el-option>
              <el-option label="积分订单" value="2"></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 50%;">
            <span>收货地址：</span>
            <el-select
              v-model="query.recipientAddressProvinceId"
              placeholder="选择省/直辖市"
              @change="getcity"
              clearable
            >
              <el-option
                v-for="(item,index) in provinces"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="query.recipientAddressCityId" placeholder="选择城市" @change="getcounty"  clearable>
              <el-option
                v-for="(item,index) in city"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="query.recipientAddressCountyId" placeholder="选择区/县"  clearable>
              <el-option
                v-for="(item,index) in county"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="chunk" style="width: 50%;">
            <span>日期：</span>
            <el-select v-model="query.dateType">
              <el-option label="下单日期" value="0"></el-option>
              <el-option label="完成日期" value="3"></el-option>
            </el-select>
            <el-date-picker
              v-model="query.startTime"
              type="date"
              @change="dateTypeFn"
              value-format="yyyy-MM-dd"
              placeholder="开始时间">
            </el-date-picker>
            <div class="text">至</div>
            <el-date-picker
              v-model="query.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="截止时间">
            </el-date-picker>
          </div> 
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBoxs">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconshujuliebiao"></i>
          <span>数据列表</span>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="small"
      :max-height="dataListHeight"
      ref="orderList"
      :key="`table${tabType}+${identiType}`">
      <el-table-column 
        type="selection" 
        fixed="left">
      </el-table-column>
      <el-table-column 
        prop="no" 
        label="订单号" 
        width="150" 
        align="center" 
        fixed="left">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('OrderDetail',{ id: scope.row.orderId })"
            type="text"
            size="small"
          >{{scope.row.no}}</el-button>
        </template>
      </el-table-column>
      <el-table-column 
        prop="orderDeliveryNo" 
        label="发货单号" 
        width="150" 
        align="center" 
        fixed="left">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('InvoiceDetail',{ id: scope.row.orderDeliveryId })"
            type="text"
            size="small"
          >{{scope.row.orderDeliveryNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column 
        prop="customerOrderNo" 
        label="外部订单号" 
        align="center" 
        >
      </el-table-column>
      <el-table-column 
        prop="memoOrderNo" 
        label="备注订单号" 
        align="center" 
        >
      </el-table-column>
      <el-table-column 
        prop="orderSourceName" 
        label="订单来源" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="orderTypeName" 
        label="订单类型" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="urgentName" 
        label="是否紧急" 
        align="center">
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目"
        min-width="150"
        align="center"
        class-name="link"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'项目信息','type':'projectInfo', 'id':scope.row.projectId})"
          >{{scope.row.projectName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="客户"
        min-width="150"
        align="center"
        class-name="link"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'客户信息','type':'customerInfo', 'id':scope.row.customerId})"
          >{{scope.row.customerName}}</p>
        </template>
      </el-table-column>
      <el-table-column 
        prop="customerUserName" 
        label="客户采购人" 
        width="100" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="staffName" 
        label="业务员" 
        width="100" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="customerUserPhone" 
        label="采购人联系方式" 
        width="120" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="amount"
        label="订单金额" 
        :formatter="format"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="payTypeName" 
        label="付款方式" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="statusName" 
        label="订单状态" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="deliveryTypeName" 
        label="订单发货类型" 
        align="center">
      </el-table-column>
      <el-table-column 
        prop="deliveryStatusName" 
        label="发货单配送状态" 
        align="center">
      </el-table-column>
      <el-table-column
        prop="finishTime"
        label="完成时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="firstServerName"
        label="服务方"
        align="center">
      </el-table-column>
      <el-table-column
        prop="secondServerName"
        label="第二服务方"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="assignUserName" 
        label="派单员" 
        align="center" 
        class-name="link">
        <template slot-scope="scope">
          <p
            @click="showDialog('showOrderInfo',{'title':'派单员信息','type':'userInfo', 'id':scope.row.assignUserId})"
          >{{scope.row.assignUserName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="partyBReviewStatusDescription"
        label="签收凭证确认状态"
        align="center"
        fixed="right">
      </el-table-column>
      <el-table-column
        label="客户签收凭证"
        width="120"
        class-name="link"
        align="center"
        fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.cargoReceiptPictureFileIdsList" @click="viewCredential(scope.row.cargoReceiptPictureFileIdsList)">查看签收凭证</el-button>
          <span v-else>---</span>
        </template>
      </el-table-column>
       <el-table-column
        label="操作项"
        align="center"
        min-width="150"
        fixed="right"
        show-overflow-tooltip>
        <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewConfirmationRecord(scope.row.orderDeliveryId)" v-if="$authorities.ShowConfirmReceipt">查看确认记录</el-button>
              <el-button type="text" size="small" @click="uploadCertificate(scope.row)" v-if="scope.row.partyBReviewStatus==3&&$authorities.UploadReceipt">上传凭证</el-button>
              <el-button type="text" size="small" @click="by(scope.row.orderDeliveryId)" v-if="$authorities.CustomerReceiptPass&&scope.row.partyBReviewStatus==1&&(scope.row.orderId!=0&&scope.row.orderId!=null)&&scope.row.partyBId==organizationId">通过</el-button>
              <el-button type="text" size="small" @click="disallowance(scope.row.orderDeliveryId)" v-if="$authorities.CustomerReceiptRefuse&&scope.row.partyBReviewStatus==1&&(scope.row.orderId!=0&&scope.row.orderId!=null)&&scope.row.partyBId==organizationId"> 驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNum"
        :page-size="query.pageSize"
        :page-sizes="[10,20,30,40,50,100,500]"
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </div>
    <assignOrder ref="assignOrder" @callback="dialogCallback"></assignOrder>
    <assignOrderHead ref="assignOrderHead" @callback="dialogCallback"></assignOrderHead>
    <cancelOrder ref="cancelOrder" @callback="dialogCallback"></cancelOrder>
    <refusalOrder ref="refusalOrder" @callback="dialogCallback"></refusalOrder>
    <showOrderInfo ref="showOrderInfo"></showOrderInfo>
    <addRemarks ref="addRemarks"></addRemarks>
    <deliverGoods ref="deliverGoods"></deliverGoods>
    <modifyFee ref="modifyFee"></modifyFee>
    <returnOrderApply ref="returnOrderApply"></returnOrderApply>

    <el-dialog title="查看已上传凭证" :visible.sync="dialogVisible2" class="certificateDialog">
      <ul class="clearfix">
        <li v-for="(item,index) in needReceiptDescription " :key="index" style="border: 2px solid #e4e4e4; float:left;" class="img-list">
          <img  v-if="checkType(item)" :src="imgurl+item.path" alt="凭证" @click="big(item)"  width="105" height="117" class="el-icon-plus">
          <i  v-else class="iconfont icon-pdf" @click="big(item)" style="font-size:105px"></i>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2=false">退 出</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible1">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="查看签收凭证" :visible.sync="dialogVisible3" class="certificateDialog">
      <ul class="clearfix img-wrap">
        <li v-for="(item,index) in cargoreceiptPicture " :key="index" style="border: 2px solid #e4e4e4; float:left;" class="img-list">
          <img  v-if="checkType(item)" :src="imgurl+item.path" alt="凭证" @click="big(item)"  width="105" height="135">
          <i v-else class="iconfont iconpdf" @click="big(item)" style="font-size:105px"></i>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3= false">退 出</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible4">
      <img v-if="checkType(dialogImageUrl)" width="100%" :src="imgurl+dialogImageUrl.path" alt="">
      <iframe v-else :src="imgurl+dialogImageUrl.path" width="100%" height="400px">
              不支持
      </iframe>
    </el-dialog>
    <el-dialog title="客户签收确认记录" :visible.sync="dialogVisible" class="obsolete">
            <el-table
              :data="orderOperation"
              border>
              <el-table-column
                prop="operation"
                label="确认结果" align="center" >
              </el-table-column>
              <el-table-column
                prop="userInfo.userFullName"
                label="确认人" align="center">
              </el-table-column>
              <el-table-column
                prop="operationTime"
                label="确认时间" align="center">
              </el-table-column>
            </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="centerDialogVisible"
      width="30%"
      left>
      <span>{{content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="determine()">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="驳回提示" :visible.sync="remarkDialogFormVisible" class="overruleDialog">
      <el-form ref="formName" :rules="rules" :model="remarkForm">
        <el-form-item label="驳回原因：" label-width="104.38px" prop="reason">
          <el-input type="textarea" v-model="remarkForm.reason" placeholder="字数长度1~200字以内"></el-input>
        </el-form-item>
        <el-form-item class="form-button-box">
          <el-button type="primary" @click="submitDisallowance('formName')" class="form-button">保存</el-button>
          <el-button @click="remarkDialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="上传客户签收凭证" class="rejectDialog" :visible.sync="dialogFormVisible">
      <el-form ref="formUpload" :rules="rules" :model="skuImageInfoParam" class="el-froms">
        <el-form-item label="客户签收凭证：" prop="detailPictureFileIdList">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="/api/file-service/file/upload"
            :headers="headerToken"
            :data="{type:'Sku'}"
            name="fileName"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess6"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :beforeUpload="beforeAvatarUpload"
            list-type="picture"
            accept=".pdf,.png,.jpg"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持jpg、png、pdf格式文件，大小不超过2M；按Ctrl可一次选多个文件进行上传</div>
          </el-upload>
        </el-form-item>
        <el-form-item class="form-button-box">
          <el-button type="primary" @click="uploadPicture('formUpload')" class="form-button">保存</el-button>
          <el-button type="primary" @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import {
  statusCount,
  getCustomerConfirmationList,
  orderOperation,
  getConfirmed,
  getPendingReview,
  getDismissed,
  disallowance,
  approved,
  addCustomerCredentials
} from "@/api/order";
import { provinces_based_id, subs } from "@/api/basicSupplier";

import {
  nameList,
  simpleList,
  organizationListName,
  getImgList
} from "@/api/projectController/projectController";

import { customerName } from "@/api/customerManage";

import { customerUserNameList } from "@/api/order/saleDown";

import assignOrder from "../child/assign_order";

import assignOrderHead from "../child/assign_order_head";

import cancelOrder from "../child/cancel_order";

import refusalOrder from "../child/refusal_order";

import showOrderInfo from "../child/show_order_info";

import addRemarks from "../child/add_remarks";

import deliverGoods from "../child/deliver_goods";

import modifyFee from "../child/modify_fee";

import returnOrderApply from "../child/return_order_apply";

import importFile from '@/components/common/module/ImportFile';

import pdf from '../../../../static/img/pdfico.jpg'

export default {
   inject:['reload','imgurl'],//注入依赖
   name:'customerReceiptConfirmation',
  data() {
    return {
      headerToken:{'Authorization':'Bearer '+this.$auth.token},
      imageUrl6:'',
      timeout:null,
      orderDetailDTOs:[],
      buttonshow:0,
      statusCount: null,
      tabType: 0, //当前tab
      identiType: 0, //当前身份
      isShow: false,
      status:0,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      orderStatus: 1, //选择的订单list状态
      remoteLoading: false, //筛选查询loading
      remoteNameList: null,
      remoteBList: null,
      remoteProjectList: null,
      remoteCustomerList:null,
      remoteCustomerUserList:null,
      remoteBUserList:null,
      remotePUserList:null,
      remoteAuthorList: null,
      remoteCustomList: null,
      provinces: [],
      city: [],
      county: [],
      orderDeliveryId:'',
      query: {
        assignUserId: "",
        customerGroupUserDataAuthorityId: "",
        customerId: "",
        userId:"",
        customerOrderNo: "",
        customerUserDataAuthorityId: "",
        customerUserId: "",
        customerUserPhone: "",
        dateType:'',
        endTime:"",
        no: "",
        orderSource: "",
        orderType: "",
        partyBId: "",
        projectId: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        serverChangedStatus: "",
        serverId: "",
        serverRejectStatus: "",
        serverUserId: "",
        startTime:"",
        status: "",
        urgent: "",
        userOwnType: "",
        needInvoice:'',
        needReceipt:'',
        pageNum: 1,
        pageSize: 10
      },
      importType:'',
      remarkForm:{
        reason:''
      },
      orderId:'',
      skuImageInfoParam : {
        detailPictureFileIdList: [],
      },
      rules:{
        reason:[
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
        ],
        detailPictureFileIdList:[
          { required: true, message: '请选择客户签收凭证', trigger: 'blur' },
        ]
      },
      totalPage: 0,
      headerData:[],
      content:'',
      title:'',
      dialogVisible: false,
      dialogImageUrl: '',
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      remarkDialogFormVisible:false,
      dialogFormVisible:false,
      centerDialogVisible:false,
      tableData: [],
      orderOperation:[],
      needReceiptDescription:[],
      cargoreceiptPicture:[],
      cargoReceiptPictureFileIdsList:[],
      organizationId:null
    };
  },
  created(){
    var storage=window.localStorage;
    var UserInfo=storage.getItem("UserInfo");
    var userPosts=JSON.parse(UserInfo).userPosts;
    this.organizationId=userPosts[0].organizationId;
    this.getDataList();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getDataList();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  components: {
    assignOrder,
    assignOrderHead,
    cancelOrder,
    refusalOrder,
    showOrderInfo,
    deliverGoods,
    modifyFee,
    returnOrderApply,
    addRemarks,
    importFile
  },
  mounted() {
    //获取表格数据
    this.getStatus();
    this.getProvinces();
  },
  methods: {
    showHelp() {
      this.isShow = !this.isShow;
    },
    //获取表格数据
    async getStatus() {
      await statusCount().then(res => {
        this.$set(this, "statusCount", res.data);
        this.headerData=res.data;
      });
      this.setIdentiType();
    },
    header_button_click(index,status){
        this.requestData(index)
        this.status=status;
    		this.buttonshow=index
    },
    requestData(index){
      let n=index?index:this.buttonshow;
      this.query.pageNum=1;
    		switch(n){
    			case '0':
    			  this.getDataList()
    			break;
          case '1':
            this.PendingReview()
          break;
          case '2':
    		    this.confirmed()
    			break;
          case '3':
    			this.Dismissed()
    			break;
    	}
    },
    confirmed(){
    	 getConfirmed({
          assignUserId:this.query.assignUserId,
          customerId:this.query.customerId,
          customerOrderNo: this.query.customerOrderNo,
          customerUserDataAuthorityId:'',
          customerUserId:this.query.customerUserId,
          customerUserPhone:this.query.customerUserPhone,
          dateType:this.query.dateType,
          endTime:this.query.endTime,
          needInvoice:this.query.needInvoice,
          needReceipt:this.query.needReceipt,
          no:this.query.no,
          orderSource: this.query.orderSource,
          orderType:this.query.orderType,
          pageNum: this.query.pageNum,
          pageSize: this.query.pageSize,
          partyBId: this.query.partyBId,
          partyBReviewStatus: '',
          projectId: this.query.projectId,
          recipientAddressCityId:this.query.recipientAddressCityId,
          recipientAddressCountyId:this.query.recipientAddressCountyId,
          recipientAddressProvinceId:this.query.recipientAddressProvinceId,
          startTime:this.query.startTime,
          urgent:this.query.urgent
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
        }
      })
    },
    PendingReview(){
    	  getPendingReview({
          assignUserId:this.query.assignUserId,
          customerId:this.query.customerId,
          customerOrderNo: this.query.customerOrderNo,
          customerUserDataAuthorityId:'',
          customerUserId:this.query.customerUserId,
          customerUserPhone:this.query.customerUserPhone,
          dateType:this.query.dateType,
          endTime:this.query.endTime,
          needInvoice:this.query.needInvoice,
          needReceipt:this.query.needReceipt,
          no:this.query.no,
          orderSource: this.query.orderSource,
          orderType:this.query.orderType,
          pageNum: this.query.pageNum,
          pageSize: this.query.pageSize,
          partyBId: this.query.partyBId,
          partyBReviewStatus: '',
          projectId: this.query.projectId,
          recipientAddressCityId:this.query.recipientAddressCityId,
          recipientAddressCountyId:this.query.recipientAddressCountyId,
          recipientAddressProvinceId:this.query.recipientAddressProvinceId,
          startTime:this.query.startTime,
          urgent:this.query.urgent
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
        }
      })
    },
    Reject(){
    	 getReject({
        assignUserId:this.query.assignUserId,
          customerId:this.query.customerId,
          customerOrderNo: this.query.customerOrderNo,
          customerUserDataAuthorityId:'',
          customerUserId:this.query.customerUserId,
          customerUserPhone:this.query.customerUserPhone,
          dateType:this.query.dateType,
          endTime:this.query.endTime,
          needInvoice:this.query.needInvoice,
          needReceipt:this.query.needReceipt,
          no:this.query.no,
          orderSource: this.query.orderSource,
          orderType:this.query.orderType,
          pageNum: this.query.pageNum,
          pageSize: this.query.pageSize,
          partyBId: this.query.partyBId,
          partyBReviewStatus: '',
          projectId: this.query.projectId,
          recipientAddressCityId:this.query.recipientAddressCityId,
          recipientAddressCountyId:this.query.recipientAddressCountyId,
          recipientAddressProvinceId:this.query.recipientAddressProvinceId,
          startTime:this.query.startTime,
          urgent:this.query.urgent
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
        }
      })
    },
    Dismissed(){
    	 getDismissed({
         assignUserId:this.query.assignUserId,
          customerId:this.query.customerId,
          customerOrderNo: this.query.customerOrderNo,
          customerUserDataAuthorityId:'',
          customerUserId:this.query.customerUserId,
          customerUserPhone:this.query.customerUserPhone,
          dateType:this.query.dateType,
          endTime:this.query.endTime,
          needInvoice:this.query.needInvoice,
          needReceipt:this.query.needReceipt,
          no:this.query.no,
          orderSource: this.query.orderSource,
          orderType:this.query.orderType,
          pageNum: this.query.pageNum,
          pageSize: this.query.pageSize,
          partyBId: this.query.partyBId,
          partyBReviewStatus: '',
          projectId: this.query.projectId,
          recipientAddressCityId:this.query.recipientAddressCityId,
          recipientAddressCountyId:this.query.recipientAddressCountyId,
          recipientAddressProvinceId:this.query.recipientAddressProvinceId,
          startTime:this.query.startTime,
          urgent:this.query.urgent
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
        }
      })
    },
    getDataList() {
      getCustomerConfirmationList({
          assignUserId:this.query.assignUserId,
          customerId:this.query.customerId,
          customerOrderNo: this.query.customerOrderNo,
          customerUserDataAuthorityId:'',
          customerUserId:this.query.userId,
          customerUserPhone:this.query.customerUserPhone,
          dateType:this.query.dateType,
          endTime:this.query.endTime,
          no:this.query.no,
          orderSource: this.query.orderSource,
          orderType:this.query.orderType,
          pageNum: this.query.pageNum,
          pageSize: this.query.pageSize,
          partyBId: this.query.partyBId,
          partyBReviewStatus: '',
          projectId: this.query.projectId,
          recipientAddressCityId:this.query.recipientAddressCityId,
          recipientAddressCountyId:this.query.recipientAddressCountyId,
          recipientAddressProvinceId:this.query.recipientAddressProvinceId,
          startTime:this.query.startTime,
          urgent:this.query.urgent
        }).then(res=>{
          if(res.code=='000000'){
            this.tableData = res.data.items;
            this.totalPage = res.data.total;
          }
      })
    },
    judgeInvoicing(row,column){
      let needInvoiceName='';
      switch(row.needInvoice){
        case 0:
          needInvoiceName='未开票'
        break;
        case 1:
          needInvoiceName='已开票'
        break;
      }
      return needInvoiceName;
    },
    retainDecimals(row, column){
      let amount='';
      if(row.amount!=null&&row.amount==''){
        amount=row.amount.toFixed(4);
        return amount;
      }
    },
    dateTypeFn(val){
      if(this.query.dateType==''){
         this.query.dateType="0";
      }
    },
    big(url){
      this.dialogImageUrl =url;
      this.dialogVisible4= true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      if(file.name.indexOf('.pdf') > -1){
        file.url = pdf;
      }
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    handleAvatarSuccess6(res, file) {
        if(res.code=='000000'){
          this.imageUrl6='../../../../static/img/pdfico.jpg';
          this.$message({
            message:'上传成功',
            type:'success'
          })
          this.skuImageInfoParam.detailPictureFileIdList.push(res.data.id);
        }else {
          this.$message({
            message:'上传失败',
            type:'error'
          })
        }
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = res.data;
        }
      });
    },
    getcity(id) {
      this.city = [];
      this.county = [];
      this.query.recipientAddressCityId = "";
      this.query.recipientAddressCountyId = "";
      if(id){
	      	subs(id).then(res => {
		        if (res.code == "000000") {
		          this.city = res.data;
		        }
	      	});
      }
      
    },
    getcounty(id) {
      this.county = [];
      this.query.recipientAddressCountyId = "";
      if(id){
      	subs(id).then(res => {
	        if (res.code == "000000") {
	          this.county = res.data;
	        }
	      });
      }
      
    },
    setIdentiType(){
      this.identiType = !this.statusCount[this.tabType].ownType
        ? 0
        : this.statusCount[this.tabType].ownType[0] > 0
        ? 0
        : this.statusCount[this.tabType].ownType[1] > 0
        ? 1
        : 0;
      this.query.userOwnType = this.identiType;
    },
    switchStatus(val) {
      if (val == this.tabType) return false;
      this.tabType = val;
      //设置默认身份显示
      this.setIdentiType();
      this.getDataList();
    },
    switchIdentity(val){
      this.tabType=val;
      this.identiType = val;
      this.query.userOwnType = this.identiType;
      this.getDataList();
    },
    search() {
      this.query.pageNum = 1;
      let n=this.status;
      switch(n){
        case 0:
            this.getDataList();
            break;
            case 1:
              this.PendingReview()
            break;
            case 2:
              this.confirmed()
            break;
            case 3:
              this.Dismissed()
            break;
        }
    },
    reset(){
      let query={
        assignUserId: "",
        customerGroupUserDataAuthorityId: "",
        customerId: "",
        customerOrderNo: "",
        customerUserDataAuthorityId: "",
        customerUserId: "",
        customerUserPhone: "",
        dateType:'',
        endTime:"",
        no: "",
        orderSource: "",
        orderType: "",
        partyBId: "",
        projectId: "",
        recipientAddressCityId: "",
        recipientAddressCountyId: "",
        recipientAddressProvinceId: "",
        serverChangedStatus: "",
        serverId: "",
        serverRejectStatus: "",
        serverUserId: "",
        startTime:"",
        status: "",
        urgent: "",
        userOwnType: "",
        needInvoice:'',
        needReceipt:'',
        pageNum:this.query.pageNum,
        pageSize:this.query.pageSize
      };
      this.query=query;
      this.search();
    },
    querySearch(query, type, list) {
      if (query !== "") {
        if (type == "name") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
          });
          
        }else if (type == "manager") {
          simpleList({ userName: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "author") {
          organizationListName({ name: query }).then(res => {
            this[list] = res.data;
          });
        } else if (type == "customer") {
          customerName(query).then(res => {
            this[list] = res.data;  
            this.remoteLoading = false;
          });
        } else if (type == "customerUser") {
          if (!this.query.customerId) {
            this.$message({
              type: "warning",
              message: "请先选择客户"
            });
            return false;
          }
          customerUserNameList({
            username: query,
            customerId: this.query.customerId
          }).then(res => {
            console.log(res.data)
            this[list] = res.data;

          });
        }
      } else {
        this[list] = [];
      }
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(type) {
      this.getDataList();
    },
    handleSizeChange(val) {
      this.query.pageSize=val;
      this.search();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getDataList();
    },
    oepnWin(name, query) {
      this.$router.push({
        name: name,
        query: query
      })
    },
    viewCredentials(needReceiptDescription){
      this.dialogVisible2=true;
      this.needReceiptDescription=needReceiptDescription;
    },
    viewCredential(cargoReceiptPictureFileIdsList){
      this.cargoReceiptPictureFileIdsList=cargoReceiptPictureFileIdsList;
      getImgList({ids:this.cargoReceiptPictureFileIdsList}).then((res)=>{
        if(res.code=='000000'){
          this.cargoreceiptPicture=JSON.parse(JSON.stringify(res.data.items));
          this.dialogVisible3=true;
        }
      })
    },
    uploadCertificate(row){
      this.dialogFormVisible=true;
      this.orderId=row.orderId;
      this.orderDeliveryId=row.orderDeliveryId;
    },
    uploadPicture(formUpload){
      this.$refs[formUpload].validate((valid)=>{
        if(valid){
          addCustomerCredentials({
            cargoReceiptPictureFileIds:this.skuImageInfoParam.detailPictureFileIdList,
            orderId:this.orderId,
            orderDeliveryId:this.orderDeliveryId,
            userOwnType:this.identiType
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message:'保存并提交审核成功',
                type:'success'
                })
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.getDataList();
                this.dialogFormVisible=false;
                this.$refs.upload.clearFiles();
                
              }, 3000 * Math.random());
            }else {
                this.$message({
                  message:'保存并提交审核失败',
                  type:'error'
                })
              }
            })
          }
        })   
    },
    beforeAvatarUpload(file) { 		
				var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)				
				const extension = testmsg === 'png'
        const extension2 = testmsg === 'pdf'
        const extension3 = testmsg === 'jpg'
				const isLt2M = file.size / 1024 / 1024 < 2
				if(!extension && !extension2 &&!extension3) {
					this.$message({
						message: '上传文件只能是 pdf、png、jpg格式!',
						type: 'warning'
					});
				}
				if(!isLt2M) {
					this.$message({
						message: '上传文件大小不能超过 2MB!',
						type: 'warning'
					});
				}
				return extension || extension2 || extension3 && isLt2M;
		},
    viewConfirmationRecord(orderDeliveryId){
      this.dialogVisible=true;
       orderOperation(orderDeliveryId).then(res=>{
        if(res.code=='000000'){
          this.orderOperation = res.data
        }
      })
    },
    checkType(file){
      let type=null;
      if(file){
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1);	
        const extension= testmsg === 'pdf';
        if(!extension) {
          type=true;
        }else{
          type=false;
        }
        return type
      }
    },
    notifyServiceUpload(orderId){
      this.centerDialogVisible=true;
      this.title='通知确认';
      this.content='确定后，对方将受到系统消息提示，确定要通知服务方吗？';
    },
    by(orderDeliveryId){
      this.centerDialogVisible=true;
      this.title='通过确认';
      this.content='确定上传的客户签收凭真实有效？';
      this.orderDeliveryId=orderDeliveryId;
    },
    determine(){
      this.centerDialogVisible=false;
      if(this.title=='通知确认'){
         console.log(this.content);
      }else{
        approved(this.orderDeliveryId).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message: '保存成功',
              type: 'success'
            });
             clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.search();
                this,getStatus();
              }, 3000 * Math.random());
          }
        })
      }
    },
    disallowance(orderDeliveryId){
      this.remarkDialogFormVisible=true;
      this.orderDeliveryId=orderDeliveryId;
    },
    submitDisallowance(formName){
      this.remarkDialogFormVisible=true;
      this.$refs[formName].validate((valid) => {
        if(valid) {
          disallowance({
           orderDeliveryId:this.orderDeliveryId,
            reason:this.remarkForm.reason
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message: '驳回成功！',
                type: 'success'
              });
              this.$refs[formName].clearValidate();
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.getDataList();
                 this.remarkDialogFormVisible=false;
              }, 3000 * Math.random());
            }
          })
        } else {
          return false;
        }
      });  
    },
    format(row){
      var amount=null;
      if(row.amount){
        return amount='￥'+row.amount;
      }
    }
  }
};
</script>
<style scoped lang="less">
 @color:#f3f3f3;
.brandBox {
  width: 100%;
  clear: both;
  /deep/.el-table .cell.el-tooltip{
      white-space:normal
  }
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
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
      color: #303133;
    }
    .rightBox {
      float: right;
      overflow: hidden;
      height: 45px;
      span{
        cursor: pointer;
      }
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      span {
        margin: 0 0 0 10px;
        flex: 0 0 80px;
        text-align: right;
      }
      .chunk {
        width: 25%;
        display: flex;
        align-items: center;
      }
      .el-input {
        width: 100%;
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select,
      .el-autocomplete,
      .el-date-editor {
        margin: 10px 0 10px 10px;
        width: 100%;
      }
    }
  }
  .listBoxs{
      font-size: 12px;
      background-color:@color;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          margin-left:10px; 
          .myicon{
            margin-left: 10px;
          }
          span {
            margin-left: 5px;
            font-size: 14px;
            color: #303133;
            line-height: 50px;
          }
        }
      }
    }
  .block {
    margin-top: 2px;
    text-align: right;
  }
  /deep/.el-dialog__wrapper{
    .el-dialog__header{
      background-color: #F2F2F2;
    }
  }
  /deep/.rejectDialog{
     /deep/.el-dialog {
      width: 35%;
     overflow: auto;
      max-height: 70%; 
      .upload-demo{
        .el-upload-list--picture{
          .el-upload-list__item{
            display:inline-block;
            width: 15%;
          }
        }
      }
    }
  }
  /deep/.overruleDialog{
    /deep/.el-dialog {
      width: 35%;
      .el-textarea{
        width: 75%;
        .el-textarea__inner{
          height: 125px;
        }
      }
    }
  }
  /deep/.certificateDialog{
    /deep/.el-dialog {
      width: 45%;
      overflow: auto;
      max-height: 70%;
      margin-top:0 ;
      .el-dialog__body{
        min-height:115px;
        ul{
          li{
            display: inline-block;
            margin: 5px;
          }
        }
      }
    }
  }
  .omit {
    overflow: hidden;
  }
  .form-button-box{
    display: flex;
    margin-top: 15px;
    justify-content: space-around;
    .el-form-item__content{
      text-align: center;
    }
  }
  .img-wrap{
    margin-top: -10px;
  }
  .clearfix:after {
    content:"."; //这里利用到了 content 属性
    display:block;
    height:0;
    visibility:hidden;
    clear:both; 
  }
  .clearfix {
      *zoom:1;
  }
}
</style>
<style scoped>
.brandBox >>> .el-table .el-tooltip1 {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.brandBox >>> td.link .cell {
  color: #399;
  cursor: pointer;
}
.brandBox >>> td.link .cell p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>