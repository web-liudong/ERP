<template>
  <div class="returnOrderBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow">
            <i class="el-icon-arrow-up"></i>收起筛选
          </span>
          <span v-else @click="isShow = !isShow">
            <i class="el-icon-arrow-down"></i>展开筛选
          </span>
          <el-button size="small" class="w80 h40" @click="postInvoiceApplicationList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="chunk">
          <span >创建时间：</span>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
          </div>
          <div class="chunk">
          <span style="margin-left:5px;">订单号：</span>
          <el-input placeholder="订单号" v-model="query.orderId" clearable></el-input>
          </div>
          <div class="chunk">
          <span >项目名称：</span>
          <el-select
            v-model="query.projectId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入项目"
            :remote-method="remoteMethod1"
          >
            <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </div>
          <div class="chunk">
          <span>客户名称：</span>
          <el-select
            style="max-width: 200px;"
            v-model="query.customerId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入客户"
            :remote-method="remoteCustomer"
          >
            <el-option
              v-for="item in customerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
      </div>
         <div class="chunk">
          <span >发票号码：</span>
          <el-input placeholder="发票号码" v-model="query.invoiceName_ld" clearable></el-input>
           </div>
           <div class="chunk">
          <span >申请单编号：</span>
          <el-input placeholder="申请单编号" v-model="query.applicationNo_ld" clearable></el-input>
           </div>
           <div class="chunk">
           <span >发票类型：</span>
          <el-select
            v-model="query.invoiceType_ld"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="发票类型"
            :remote-method="remoteinvoiceType_ld"
          >
            <el-option v-for="item in invoiceType_ldOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </div>
          <div class="chunk">
          <span >结算单编号：</span>
          <el-input placeholder="结算单编号" v-model="query.statementNo_ld" clearable></el-input>
          <div class="chunk">
          <span >发票状态：</span>
          <el-select
            v-model="query.invoiceStatus_ld"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="发票状态"
            :remote-method="remoteinvoiceStatus_ld"
          >
            <el-option v-for="item in invoiceStatus_ldOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="icon iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="listBoxRight"></div>
        <el-table
          :data="returnData.items"
          @selection-change="handleSelectionChange"
          border
          stripe
          style="width: 100%"
          size="small"
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="invoiceApplicationNo"
            label="申请单编号"
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="projectName" label="关联项目" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="customerName" label="客户名称" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="invoiceTitle" label="发票抬头" align="center"></el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="invoiceTime" label="开票时间" align="center"></el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceType == '0'">专票</span>
              <span v-if="scope.row.invoiceType == '1'">普票</span>
              <span v-if="scope.row.invoiceType == '2'">电子发票</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicationsAmount" label="申请金额" align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.applicationsAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="开票状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">待审核</span>
              <span v-if="scope.row.status == '1'">已驳回</span>
              <span v-if="scope.row.status == '2'">待开票</span>
              <span v-if="scope.row.status == '3'">开票中</span>
              <span v-if="scope.row.status == '4'">已完成</span>
              <span v-if="scope.row.status == '5'">开票失败</span>
              <span v-if="scope.row.status == '6'">已作废</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiveableAmount" label="发票邮寄状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.postStatus == '1'">待邮寄</span>
              <span v-if="scope.row.postStatus == '2'">配送中</span>
              <span v-if="scope.row.postStatus == '3'">已完成</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicationsAmount" label="作废申请" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceInvalidApplicationStatusText">
                <span>{{scope.row.invoiceInvalidApplicationStatusText}}</span>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.invoiceInvalidApplicationStatusText == '已驳回'"
                  @click="dialogRejec = true,dataLIst = scope.row"
                >查看驳回原因</el-button>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="(scope.row.invoiceInvalidApplicationStatus == '3'||scope.row.invoiceInvalidApplicationStatus == null)&&scope.row.status == '4'"
                @click="dataLIst = scope.row,openDialog()"
                type="text"
                size="small"
                v-show="$authorities.invoiceApplicationDiscard"
              >作废申请</el-button>
              <el-button
                v-if="scope.row.status!=1"
                v-show="$authorities.FindInvoiceReceivable"
                @click="clickReceivable(scope.row,scope.$index)"
                type="text"
                size="small"
              >回票录入</el-button>
              <el-button
                v-show="$authorities.InvoiceApplicationDetaills"
                @click="goWInvoiceApplicationDetaillsDetaills(scope.row)"
                type="text"
                size="small"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogReceivable" width="800px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">回票录入</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          <el-button type="primary" style="margin-bottom: 10px;" @click="poplepush()">新增回票信息</el-button>
          <el-form :model="form" :rules="rules" ref="ruleForm">
            <el-form-item v-for="(item,index) in form.ReceivableData" :key="index" required>
              <el-col style="width: 650px;margin-bottom: 20px;">
                <el-col style="width: 300px;">
                  <el-form-item
                    label-width="100px"
                    required
                    label="发票号码："
                    :prop="'ReceivableData.' + index + '.invoiceNo'"
                    :rules="{
            required: true, message: '发票号码不能为空',
            }"
                  >
                    <el-input
                      v-model="item.invoiceNo"
                      style="width:150px;"
                      :disabled="item.status==1"
                    ></el-input>&nbsp;&nbsp;&nbsp;
                  </el-form-item>
                </el-col>
                <el-col style="width: 300px;">
                  <el-form-item
                    label-width="100px"
                    required
                    label="发票代码："
                    :prop="'ReceivableData.' + index + '.invoiceCode'"
                    :rules="{
             required: true, message: '发票代码不能为空',
             }"
                  >
                    <el-input
                      v-model="item.invoiceCode"
                      style="width:150px;"
                      :disabled="item.status==1"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col style="width: 650px;">
                <el-col style="width: 300px;">
                  <el-form-item
                    label-width="100px"
                    required
                    label="物流公司："
                    :prop="'ReceivableData.' + index + '.logisticsCompany'"
                    :rules="{
             required: true, message: '物流公司不能为空',
             }"
                  >
                    <el-select
                      v-model="item.logisticsCompany"
                      :disabled="item.status==1"
                      style="width:150px;"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in expressOptions"
                        :key="item.code"
                        :label="item.text"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col style="width: 300px;">
                  <el-form-item
                    label-width="100px"
                    required
                    label="物流单号："
                    :prop="'ReceivableData.' + index + '.logisticsNo'"
                    :rules="{
             required: true, message: '物流单号不能为空',
             }"
                  >
                    <el-input
                      v-model="item.logisticsNo"
                      style="width:150px"
                      :disabled="item.status==1"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-button type="primary" :disabled="item.status==1" @click="depople(index)" plain>删除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReceivable = false">取 消</el-button>
        <el-button type="primary" @click="submitFormAddDraft('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAffirm" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">确认提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">确认退货单后，退货单将发给仓库进行退货操作</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAffirm = false">取 消</el-button>
        <el-button type="primary" @click="dialogAffirm=false,putReturnOrderConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogRejec"
      width="40%" 
      custom-class="dialog-box"
      @open="lreason()"
    >
      <div slot="title" class="dialog-title">
        <span class="reject-title">驳回原因</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票号码：</th>
            <td>{{this.dataLIst.invoiceNumber}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType == '0'">专票</span>
              <span v-if="this.dataLIst.invoiceType == '1'">普票</span>
              <span v-if="this.dataLIst.invoiceType == '2'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>发票代码：</th>
            <td>{{this.dataLIst.invoiceCode}}</td>
            <th>开票日期：</th>
            <td>{{this.dataLIst.invoiceTime}}</td>
          </tr>
          <tr>
            <th>发票金额：</th>
            <td>
              <span>￥{{this.dataLIst.applicationsAmount}}</span>
            </td>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
          </tr>
        </table>
        <div class="message-foot">
          <span>驳回原因:</span>
          <span>{{this.ApprejectReaso}}</span>
        </div>
      </div>

      <div class="dialogRejec-footer">
        <el-button @click="dialogRejec = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="applications"
      width="40%" 
      custom-class="dialog-box"
      @open="open('formApplication')"
    >
      <div slot="title" class="dialog-title">
        <span class="reject-title">作废申请</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票号码：</th>
            <td>{{this.dataLIst.invoiceNumber}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType == '0'">专票</span>
              <span v-if="this.dataLIst.invoiceType == '1'">普票</span>
              <span v-if="this.dataLIst.invoiceType == '2'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>发票代码：</th>
            <td>{{this.dataLIst.invoiceCode}}</td>
            <th>开票日期：</th>
            <td>{{this.dataLIst.invoiceTime}}</td>
          </tr>
          <tr>
            <th>发票金额：</th>
            <td>
              <span>￥{{this.dataLIst.applicationsAmount}}</span>
            </td>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
          </tr>
        </table>
      </div>
      <div class="invoiceTypetwo">
        <el-form
          :model="formApplication"
          :rules="rulse"
          ref="formApplication"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="作废原因：" prop="invalidReason" label-width="150px">
            <el-input v-model="formApplication.invalidReason"></el-input>
          </el-form-item>
          <el-form-item label="备注：" label-width="150px">
            <el-input v-model="formApplication.memo" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applications = false,asdaqw('formApplication')">取 消</el-button>
        <el-button @click="possCancellation('formApplication')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="application"
      width="40%" 
      custom-class="dialog-box"
      @open="open('formApplications')"
    >
      <div slot="title" class="dialog-title">
        <span class="reject-title">作废申请</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票号码：</th>
            <td>{{this.dataLIst.invoiceNumber}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType == '0'">专票</span>
              <span v-if="this.dataLIst.invoiceType == '1'">普票</span>
              <span v-if="this.dataLIst.invoiceType == '2'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>发票代码：</th>
            <td>{{this.dataLIst.invoiceCode}}</td>
            <th>开票日期：</th>
            <td>{{this.dataLIst.invoiceTime}}</td>
          </tr>
          <tr>
            <th>发票金额：</th>
            <td>
              <span>￥{{this.dataLIst.applicationsAmount}}</span>
            </td>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
          </tr>
        </table>
      </div>
      <div class="invoiceTypetwo">
        <el-form
          :model="formApplications"
          :rules="rules"
          ref="formApplications"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="作废原因：" prop="invalidReason" label-width="150px">
            <el-input v-model="formApplications.invalidReason"></el-input>
          </el-form-item>
          <el-form-item label="承诺退回时间：" required label-width="150px">
            <el-col :span="11">
              <el-form-item prop="returnTime">
                <el-date-picker
                  v-model="formApplications.returnTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="纸质票（专票 ，普票）是否收到：" prop="receivedInvoice" label-width="150px">
            <el-select v-model="formApplications.receivedInvoice" placeholder="是否收到">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" label-width="150px">
            <el-input v-model="formApplications.memo" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="application = false,asdaqw('formApplications')">取 消</el-button>
        <el-button @click="possCancellation('formApplications')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  postBilApplication,
  getBillApprejectReaso
} from "@/api/finance/invoiceInvalids";
import { nameList } from "@/api/projectController/projectController";
import {
  customerNameList,
  customerUserNameList,
  consigneeInformation,
  likeOrderItemList,
  addOrder
} from "@/api/order/saleDown";
import {
  getInvoiceApplicationFindInvoiceReceivable,
  postInvoiceApplicationCreateInvoiceReceivable,
  getInvoiceApplicationDetail,
  postInvoiceApplicationList,
  postInvoiceApplicationExportFileLogList
} from "@/api/payment/invoiceApplication";

import {
  postCustomerNameOptions,
  postOrganizationOptions,
  getLocationExpress
} from "@/api/common/commonApi";
import Brand from "../../marketing/projectTender/index.vue";

export default {
  components: { Brand },
  inject: ["reload", "imgurl", "close"], //注入依赖
  name: "InvoiceApplication",
  data() {
    return {
      aaaaa: [],
      ApprejectReaso: "",

      form: {
        ReceivableData: []
      },
      options3: [],
      customerOptions: [],
      purchaseOptions: [],
      expressOptions: [],
      invoiceType_ldOptions:[],
      invoiceStatus_ldOptions:[],
      
      
                                //快递公司
      query: {
        customerId: null,
        endTime: "",
        orderId: this.$route.query.id,
        organizationId: null,
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        startTime: "",
        status: null,
        invoiceName_ld:this.$route.query.id,
        applicationNo_ld:null,
        invoiceType_ld:null,
        statementNo_ld:null,
        invoiceStatus_ld:null,
      },
      formApplication: {
        invoiceType: "",
        invoiceApplicationId: "",
        invalidReason: "",
        invalidReason: "",
        memo: ""
      },
      formApplications: {
        invoiceType: "",
        invoiceApplicationId: "",
        invalidReason: "",
        returnTime: "",
        receivedInvoice: "",
        memo: ""
      },

      rules: {
        invalidReason: [
          { required: true, message: "请输入作废原因", trigger: "blur" }
        ],
        returnTime: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        receivedInvoice: [
          { required: true, message: "请选择是否收到纸质票", trigger: "change" }
        ]
      },
      rulse: {
        invalidReason: [
          { required: true, message: "请输入作废原因", trigger: "blur" }
        ]
      },
      dataLIst: {},
      dateValue: "", //时间
      //查询
      dialogReceivable: false,
      application: false,
      applications: false,
      dialogAffirm: false,
      dialogRejec: false,
      returnData: {
        items: [],
        offset: 0,
        pageNum: 0,
        pageSize: 0,
        total: 0
      },
      invoiceApplicationId: null,
      //删选显示
      isShow: this.isFilterShow,
      //翻页
      dialogTableVisible: false,
      dialogFormVisible: false
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  watch: {
    //监听时间范围
    dateValue(a, b) {
      if (this.dateValue != "" && this.dateValue) {
        this.query.startTime = this.dateValue[0];
        this.query.endTime = this.dateValue[1];
      } else {
        this.query.startTime = null;
        this.query.endTime = null;
      }
    }
  },
  mounted() {
    this.postInvoiceApplicationList();
    this.getLocationExpress();
    console.log(this.$authorities.invoiceApplicationDiscard, "权限");
  },
  methods: {
    reset() {
      this.dateValue = "";
      (this.query = {
        customerId: null,
        endTime: "",
        orderId: this.$route.query.id,
        organizationId: null,
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        startTime: "",
        status: null
      }),
        this.postInvoiceApplicationList();
      this.getLocationExpress();
    },
    //快递公司
    getLocationExpress() {
      getLocationExpress()
        .then(res => {
          console.log(res);
          this.expressOptions = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    openDialog() {
      console.log(this);
      if (this.dataLIst.invoiceType == 2) {
        this.applications = true;
      } else {
        this.application = true;
      }
    },
    lreason() {
      getBillApprejectReaso(this.dataLIst.invoiceInvalidId).then(res => {
        console.log(res);
        this.ApprejectReaso = res.data;
      });
    },

    //再次打开时清空数据
    open(formName) {
      // console.log(this.dataLIst);
      console.log(formName);
      if (
        this.formApplication.invalidReason != "" ||
        this.formApplication.invalidReason != "" ||
        this.formApplications.invalidReason != "" ||
        this.formApplications.returnTime != "" ||
        this.formApplications.receivedInvoice != ""
      ) {
        this.$refs[formName].resetFields();
        this.formApplication.memo = "";
        this.formApplications.memo = "";
      }
    },
    asdaqw(formName) {
      this.$refs[formName].resetFields();
      this.formApplication.memo = "";
      this.formApplications.memo = "";
    },
    //提交作废请求
    possCancellation(formName) {
      // console.log(formName);
      console.log(this.formApplication);
      if (this.dataLIst.invoiceType == 2) {
        console.log("电子的");
        console.log(this.dataLIst.id);
        this.formApplication.invoiceType = "ELERTRONIC_INVOICE";
        this.formApplication.invoiceApplicationId = this.dataLIst.id;
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (valid) {
              postBilApplication(this.formApplication).then(res => {
                if (res.code == "000000") {
                  this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.applications = false;
                  this.$refs[formName].resetFields();
                  this.formApplication.memo = "";
                  this.postInvoiceApplicationList();
                }
              });
            } else {
              console.log("error submit!!");
              return false;
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        console.log("纸质的");
        console.log(this.dataLIst.id);
        this.formApplications.invoiceType =
          this.dataLIst.id == 0 ? "SPECIAL_INVOICE" : "GENERAL_INVOICE";

        this.formApplications.invoiceApplicationId = this.dataLIst.id;
        this.$refs[formName].validate(valid => {
          if (valid) {
            postBilApplication(this.formApplications).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.application = false;
                this.$refs[formName].resetFields();
                this.formApplications.memo = "";
                this.postInvoiceApplicationList();
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //回票录入
    postInvoiceApplicationCreateInvoiceReceivable() {
      this.form.ReceivableData = this.form.ReceivableData.filter(item => {
        return item.status != 1;
      });
      console.log(this.form.ReceivableData);
      postInvoiceApplicationCreateInvoiceReceivable(
        this.invoiceApplicationId,
        this.form.ReceivableData
      )
        .then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "回票录入成功",
              type: "success"
            });
            this.dialogReceivable = !this.dialogReceivable;
            this.postInvoiceApplicationList();
          } else if (res.data == "0") {
            this.$message({
              message: "回票录入失败",
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击回票录入  并查询
    clickReceivable(row, index) {
      ///////////////////////////这里要删掉
      //this.dialogReceivable = true;
      ///////////////////////////
      console.log(row.invoiceApplicationNo);
      this.invoiceApplicationId = row.id;
      getInvoiceApplicationFindInvoiceReceivable(row.id)
        .then(res => {
          if (res.code == "000000") {
            this.dialogReceivable = true;
            this.form.ReceivableData = res.data;
          } else if (res.data == "0") {
            this.$message({
              message: "获取回票录入失败",
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取列表
    postInvoiceApplicationList() {
      postInvoiceApplicationList(this.query)
        .then(res => {
          console.log(res);
          this.returnData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存
    submitFormAddDraft(formName) {
      console.log(this.form.ReceivableData.length);
      if (this.form.ReceivableData.length > 0) {
        this.$refs[formName].validate(valid => {
          console.log(valid);
          if (valid) {
            this.postInvoiceApplicationCreateInvoiceReceivable();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$message({
          message: "请填写回票录入信息",
          type: "warning"
        });
      }
    },
    //新增回票录入
    poplepush() {
      this.form.ReceivableData.push({
        id: null,
        invoiceCode: "",
        invoiceNo: "",
        invoiceRequireId: null,
        logisticsCompany: "",
        logisticsNo: "",
        logisticsCompanyText: "",
        status: null
      });
    },
    //删除回票录入
    depople(index) {
      this.form.ReceivableData.splice(index, 1);
    },
    //模糊搜索
    remoteMethod1(query) {
      if (query !== "") {
        nameList({ name: query }).then(res => {
          this.options3 = res.data;
        });
      } else {
        this.options3 = [];
      }
    },
    remoteCustomer(query) {
      if (query !== "") {
        if (this.query.projectId) {
          customerNameList({
            customerName: query,
            projectId: this.query.projectId
          }).then(res => {
            this.customerOptions = res.data;
          });
        } else {
          this.$message({
            message: "请选择一个项目",
            type: "warning"
          });
        }
      } else {
        this.customerOptions = [];
      }
    },
   
    remotePurchase(query) {
      if (query !== "") {
        if (this.query.customerId) {
          customerUserNameList({
            username: query,
            customerId: this.query.customerId
          }).then(res => {
            this.purchaseOptions = res.data;
          });
        } else {
          this.$message({
            message: "请选择一个客户",
            type: "warning"
          });
        }
      } else {
        this.purchaseOptions = [];
      }
    },
    //发票类型搜素
    remoteinvoiceType_ld(){

    },
    //发票状态搜素
    remoteinvoiceStatus_ld(){

    },
    userNamechange(value) {
      let a = this.options3.filter((item, index) => {
        return item.id == value;
      });
      this.realName = a[0].realName;
    },
    //多选
    handleSelectionChange(val) {
      //this.multipleSelection = val; //选择的数据
      //        let ccc = [];
      //        val.forEach(function (item) {
      //          ccc.push(item.accountReceiveableId)
      //        })
      //        this.SelectionChangeId = ccc;
      //        this.SelectionChangeVal = val;
    },

    //查询结果
    queryResult() {
      console.log(this.query);
      this.postList();
    },
    //跳转详情
    goWInvoiceApplicationDetaillsDetaills(row) {
      // console.log(row.id);
      // const {href} = this.$router.resolve({
      //   name: 'InvoiceApplicationDetaills',
      //   query: {
      //     id: row.id
      //   }
      // });
      // window.open(href, '_blank')
      this.$router.push({
        path: "/payment/invoiceapplication/invoiceapplicationdetaills",
        query: { id: row.id }
      });
    },

    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.pageSize = val;
      this.query.pageNum = 1;
      this.postInvoiceApplicationList();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      console.log(`当前页: ${val}`);
      this.postInvoiceApplicationList();
    },
    //筛选show
    showHelp() {
      this.isShow = !this.isShow;
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.addData);
          this.putReturnOrderClose();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.returnOrderBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .btnactive {
      background: #399;
      color: #fff;
      border: solid 1px #399;
    }
    .el-button {
      width: 160px;
      height: 30px;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
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
      height: 48px;
      float: right;
      span {
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }
      span:hover {
        color: #303133;
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
      span{
        margin: 0 0 0 10px;
        flex: 0 0 120px;
        text-align: right;
      }
      .chunk{
          height: 50px;
         display: flex;
       
        align-items: center;
      }
      .el-input {
        width: 200px;
        height: 56px;
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select {
        margin-left: 10px;
        line-height: 56px;
      }
    }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 20px 0 0 0;
    line-height: 50px;
    .listBoxTop {
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
        i {
          font-size: 14px;
          margin-right: 10px;
        }
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .el-button {
        width: 80px;
        height: 30px;
      }
    }
    .el-table {
      margin-top: -2px;
      span {
        font-size: 12px;
      }
      .el-button {
        font-size: 12px;
      }
    }
  }
  .block {
    margin-top: 10px;
    margin-right: 20px;
    text-align: right;
  }
  .dialog-box {
    position: relative;
    .tree {
      display: flex;
      justify-content: center;
    }
    .message-box {
      padding: 0px 20px;
      font-size: 14px;
      color: #666;
      table {
        width: 90%;
        margin: 20px auto;
        td,
        th {
          border: 1px solid #d1d1d1;
          font-size: 14px;
          line-height: 42px;
        }
        th {
          padding-right: 6px;
          box-sizing: border-box;
          background: #f5f7fa;
          font-weight: 700;
          font-size: 14px;
          text-align: right;
          width: 20%;
          i {
            color: red;
          }
        }
        td {
          color: #666666;
          text-align: left;
          padding-left: 10px;
          width: 30%;
        }
      }
      .message-foot {
        font-size: 18px;
        margin: 20px 0;
      }
      .el-input {
        width: 80%;
      }
      .first-step-box {
        padding: 20px 0;
        .first-step {
          color: red;
          font-size: 18px;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .second-step-box {
        display: flex;
        padding: 20px 0;
        align-items: center;
        .input-box-file {
          width: 120px;
          margin-left: 20px;
          position: relative;
          cursor: pointer;
          .input-button {
            width: 120px;
            height: 30px;
            border: 1px solid #d1d1d1;
            color: #999;
            border-radius: 4px;
            line-height: 30px;
            font-size: 14px;
            text-indent: 10px;
            cursor: pointer;
          }
        }
      }
      .tip {
        display: flex;
        color: red;
        line-height: 30px;
      }
    }
    .invoiceTypetwo {
      margin: 20px 0;
      display: flex;
      .el-form {
        width: 500px;
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
      margin-top: 40px;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
    .dialogRejec-footer {
      // margin-left: 200px;
      text-align: center;
      .el-button {
        background: #3aa;
        color: #fff;
      }
    }
  }
}
</style>
