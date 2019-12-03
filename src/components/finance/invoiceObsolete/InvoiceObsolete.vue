<template>
  <div class="demandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:status==item.statusCode}"
        @click="changeTab(item.statusCode,item.status)"
        v-for="(item,index) in tabList"
        :key="index"
      >{{item.statusName}}（{{item.total}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up" v-if="isShow"></i>
            <i class="el-icon-arrow-down" v-if="!isShow"></i>
            {{isShow? '收起':'展开'}}筛选
          </span>
          <el-button size="small" @click="getInquire()">查询结果</el-button>
          <el-button size="small" @click="Empty()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>提交时间：</span>
            <el-date-picker
              v-model="dataTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectPicker"
            ></el-date-picker>
          </div>
          <div class="inputBox">
            <span>伙伴名称：</span>
            <el-select
              v-model="tetrunData.partnerId"
              filterable
              clearable
              remote
              placeholder="伙伴名称"
              :remote-method="remoteorganizations"
            >
              <el-option
                v-for="item in remoteors"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>发票类型：</span>
            <el-select v-model="tetrunData.invoiceType" clearable placeholder="发票类型">
              <el-option label="专票" value="VAT_INVOICE"></el-option>
              <el-option label="普票" value="PLAIN_INVOICE"></el-option>
              <el-option label="电子发票" value="ELECTRONIC_INVOICE"></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>开票方：</span>
            <el-select
              v-model="tetrunData.organizationId"
              filterable
              clearable
              remote
              placeholder="开票方"
              :remote-method="remoteorganization"
              :loading="loading"
            >
              <el-option
                v-for="item in organizations"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>发票号码：</span>
            <el-input placeholder="发票号码" v-model="tetrunData.invoiceNumber" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>发票代码：</span>
            <el-input placeholder="发票代码" v-model="tetrunData.invoiceCode" clearable></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表
        </div>
        <div class="listRight">
          <el-button size="small" @click="openWin('OperationRecord')">
            <span>操作记录</span>
          </el-button>
          <el-button
            size="small"
            v-if="this.isActive==1||this.isActive==2||this.isActive==6"
            @click="batchOperation()"
          >
            <span v-if="this.isActive==1">
              <i class="iconfont iconzengjia"></i>批量通过
            </span>
            <span v-else>
              <i class="iconfont iconzengjia"></i>批量作废
            </span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData.items"
          border
          :max-height="dataListHeight"
          style="width: 100%"
          :header-cell-style="tableStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column
            prop="applicationNo"
            label="编号"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="invoiceTitle"
            label="发票抬头"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="partnerName"
            label="伙伴名称"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="creatorName" label="申请人" align="center"></el-table-column>
          <el-table-column
            prop="organizationName"
            label="开票方"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="createTime" label="开票时间" align="center" width="90"></el-table-column>
          <el-table-column prop="invalidTime" label="申请作废时间" align="center" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.invalidTime | formatDateT}}</span>
              <br />
              <span>{{scope.row.invalidTime | formatDateD}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceType" label="类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceType ==  'VAT_INVOICE'">专票</span>
              <span v-if="scope.row.invoiceType ==  'PLAIN_INVOICE'">普票</span>
              <span v-if="scope.row.invoiceType ==  'ELECTRONIC_INVOICE'">电子发票</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="开票金额" align="center"></el-table-column>
          <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
          <el-table-column prop="returnTime" label="承诺退回日期" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{scope.row.returnTime | formatDateT}}</span>
              <br />
              <span>{{scope.row.returnTime | formatDateD}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status ==  '1'">待审核</span>
              <span v-if="scope.row.status ==  '2'">待作废</span>
              <span v-if="scope.row.status ==  '3'">已驳回</span>
              <span v-if="scope.row.status ==  '4'">作废中</span>
              <span v-if="scope.row.status ==  '5'">已作废</span>
              <span v-if="scope.row.status ==  '6'">作废失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="invalidType" label="作废类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.invalidType ==  'RED_WORD'">红冲</span>
              <span v-if="scope.row.invalidType ==  'NULLIFY'">作废</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invalidReason"
            label="作废原因"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="红字信息表"
            align="center"
            width="120"
            v-if="this.isActive==6||this.isActive==2||this.isActive==null"
          >
            <template slot-scope="scope">
              <div
                v-if="(scope.row.status ==  '2'||scope.row.status =='6')&&scope.row.invalidType ==  'RED_WORD'&&scope.row.invoiceType ==  'VAT_INVOICE'"
              >
                {{scope.row.redWordInfo}}
                <br />
                <el-button
                  type="text"
                  size="small"
                  v-if="$authorities.GroupInvoiceDiscardRedInfo"
                  @click="dialogRedWordInfo = true ,
                  formRedWord.invalidApplicationId= scope.row.id,
                  formRedWord.redWordInfo = scope.row.redWordInfo"
                >填写红字信息表</el-button>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="showDialog('pass',scope.row)"
                v-if="scope.row.status ==  '1'&&$authorities.GroupInvoiceDiscardPass"
              >通过</el-button>
              <el-button
                type="text"
                size="small"
                @click="showDialog('reject',scope.row)"
                v-if="(scope.row.status ==  '6'||scope.row.status ==  '2'||scope.row.status ==  '1')&&$authorities.GroupInvoiceDiscardReject"
              >驳回</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(scope.row.status ==  '2'||scope.row.status ==  '6')&&scope.row.invalidType ==  'NULLIFY'&&$authorities.GroupInvoiceDiscardRedRush"
                @click="lication = true,dataLIst = scope.row"
              >作废</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(scope.row.status ==  '2'||scope.row.status ==  '6')&&scope.row.invalidType ==  'RED_WORD'&&$authorities.GroupInvoiceDiscardRedRush"
                @click="redWordInfos(),dataLIst = scope.row"
              >红冲</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(scope.row.status ==  '2'||scope.row.status ==  '6')&&scope.row.invalidType ==  'RED_WORD'&&$authorities.GroupInvoiceDiscardInvoiceTerminalCode"
                @click="dialogRedWordCode = true,formRedWordCode.invoiceTerminalCode = scope.row.invoiceTerminalCode,formRedWordCode.invalidApplicationId= scope.row.id"
              >开票点编码</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.GroupInvoiceDiscardDetails"
                @click="openWin('InvoiceObsoleteDetail', query.id=scope.row.id)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <reject ref="reject"></reject>
    <pass ref="pass"></pass>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="tableData.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="10"
        layout="total,sizes, prev, pager, next, jumper"
        :total="tableData.total"
        background
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="dialogBatch" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">批量通过</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票总金额：</th>
            <td>{{this.formData.sum}}元</td>
            <th>发票张数：</th>
            <td>{{this.formData.sheets}}张</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBatch = false">取 消</el-button>
        <el-button type="primary" @click="primaryBatch">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogLica" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">批量作废</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票总金额：</th>
            <td>{{this.formData.sum}}元</td>
            <th>发票张数：</th>
            <td>{{this.formData.sheets}}张</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLica = false">取 消</el-button>
        <el-button type="primary" @click="primaryLica">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="application" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">红冲</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType == 'VAT_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType == 'PLAIN_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType == 'ELECTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>申请金额：</th>
            <td>￥{{this.dataLIst.amount}}</td>
            <th>备注：</th>
            <td>{{this.dataLIst.memo}}</td>
          </tr>
          <tr>
            <th>退票原因：</th>
            <td colspan="3">{{this.dataLIst.invalidReason}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="application = false">取 消</el-button>
        <el-button type="primary" @click="primaryRed(dataLIst.id)">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="lication" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">作废</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType == 'VAT_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType == 'PLAIN_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType == 'ELECTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>申请金额：</th>
            <td>￥{{this.dataLIst.amount}}</td>
            <th>备注：</th>
            <td>{{this.dataLIst.memo}}</td>
          </tr>
          <tr>
            <th>退票原因：</th>
            <td colspan="3">{{this.dataLIst.invalidReason}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lication = false">取 消</el-button>
        <el-button type="primary" @click="primaryRed(dataLIst.id)">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogRedWordInfo" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">填写红字信息表</span>
      </div>

      <el-form :model="formRedWord" :rules="rules" ref="formRedWord">
        <span style="margin-left:20px;font-size:16px;">专票作废需要填写红字信息表</span>
        <el-form-item label="红字信息：" prop="redWordInfo" label-width="150px" style="margin-top: 20px">
          <el-input v-model="formRedWord.redWordInfo" placeholder="红字信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRedWordInfo = false ,resetForm('formRedWord')">取 消</el-button>
        <el-button type="primary" @click="wRedWordInfo('formRedWord')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 开票点编码 -->
    <el-dialog :visible.sync="dialogRedWordCode" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">填写开票点编码</span>
      </div>
      <el-form :model="formRedWordCode" :rules="rulesCode" ref="formRedWordCode">
        <span style="margin:20px;font-size:16px;">红冲时填写开票点编码</span>
        <el-form-item
          label="填写发票点编码："
          prop="invoiceTerminalCode"
          label-width="150px"
          style="margin-top: 20px"
        >
          <el-select v-model="formRedWordCode.invoiceTerminalCode" placeholder="发票点编码" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRedWordCode = false ,resetForm('formRedWordCode')">取 消</el-button>
        <el-button type="primary" @click="wRedWordCode('formRedWordCode')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  postPurchaseCancellation,
  putBathRed,
  putBathPass,
  putPurchaseReject,
  putBathsRed,
  putBathsPass,
  postPurchaseInvalidlist,
  putRedWordinfo,
  getPurchseStatuecont,
  putPurchaseCode
} from "@/api/finance/invoiceObsolete";
import { organizationListName } from "@/api/projectController/projectController";
import { findOrganization } from "@/api/finance/collectionInvoice";
import reject from "./child/obsolete_reject";
import pass from "./child/obsolete_pass";
export default {
  inject: ["reload", "isFilterShow"],
  name: "InvoiceObsolete",
  data() {
    return {
      status: null,
      query: {
        id: ""
      },
      organizations: [],
      remoteors: [],
      tableStyle: {
        background: "#f5f7fa"
      },
      isShow: this.isFilterShow,
      isActive: null,
      dataLIst: {},
      tabList: [],
      tetrunData: {
        endTime: null,
        invoiceCode: null,
        invoiceNumber: null,
        organizationId: null,
        invoiceType: null,
        pageNum: 1,
        pageSize: 10,
        partnerId: null,
        startTime: null,
        status: null
      },
      loading: false,
      dialogBatch: false,
      dialogRedWordInfo: false,
      dialogRedWordCode: false,
      application: false,
      lication: false,
      dialogLica: false,
      multipleSelection: [], //选中的序号,
      tableData: [],
      partnerName: null,
      partnerNames: [],
      organizationId: null,
      dataTime: null,
      invoiceType: null,
      formRedWord: {
        redWordInfo: "",
        invalidApplicationId: ""
      },
      formRedWordCode: {
        invalidApplicationId: "",
        invoiceTerminalCode: ""
      },
      options: [
        //开票点编码
        {
          value: "kaipiaodian01",
          label: "开票点01"
        },
        {
          value: "kaipiaodian02",
          label: "开票点02"
        },
        {
          value: "tongyongkaipiao",
          label: "通用开票"
        },
        {
          value: "jinjizhipiao",
          label: "紧急纸票"
        }
        // {
        //   value: "kpyuan001",
        //   label: "开票点01"
        // },
        // {
        //   value: "kpyuan002",
        //   label: "开票点02"
        // }
      ],
      formData: {
        sum: 0,
        sheets: 0,
        id: []
      },
      rules: {
        redWordInfo: [
          { required: true, message: "请输入红字信息", trigger: "blur" }
        ]
      },
      rulesCode: {
        invoiceTerminalCode: [
          { required: true, message: "请选择开票点编码", trigger: "blur" }
        ]
      },

      ccc: null
    };
  },
  created() {
    this.getPurchseStatuecont();
    this.postPurchaseInvalidlist(1, "null");
    console.log(this.$authorities.GroupInvoiceDiscardInvoiceTerminalCode);
  },
  components: {
    reject,
    pass
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    //发票作废申请状态数量
    getPurchseStatuecont() {
      getPurchseStatuecont().then(res => {
        console.log(res);
        this.tabList = res.data;
      });
    },
    //列表
    postPurchaseInvalidlist(page, status) {
      this.tetrunData.status = status;
      this.tetrunData.pageNum = page;
      postPurchaseInvalidlist(this.tetrunData).then(res => {
        console.log(res);
        this.tableData = res.data;
      });
    },
    //判断红字信息表是否为空
    redWordInfos() {
      if (this.dataLIst.invoiceType != "VAT_INVOICE") {
        if (!this.dataLIst.redWordInfo) {
          this.application = true;
        } else {
          this.$confirm("缺少红字信息，请完善", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {})
            .catch(() => {});
        }
      } else {
        this.application = true;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    wRedWordInfo(formName) {
      console.log(this.formRedWord);
      this.$refs[formName].validate(valid => {
        if (valid) {
          putRedWordinfo(this.formRedWord).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "操作成功",
                type: "success"
              });

              this.dialogRedWordInfo = false;
              this.$refs[formName].resetFields();
              this.getPurchseStatuecont();
              this.postPurchaseInvalidlist(1, this.tetrunData.status);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    wRedWordCode(formName) {
      // console.log(this.formRedWord);
      this.$refs[formName].validate(valid => {
        if (valid) {
          putPurchaseCode(this.formRedWordCode).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$refs[formName].resetFields();
              this.dialogRedWordCode = false;
              this.getPurchseStatuecont();
              this.postPurchaseInvalidlist(1, this.tetrunData.status);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查询
    getInquire() {
      console.log(this.status);
      switch (this.status) {
        case "1":
          this.tetrunData.status = "CENTRALIZED_INVOICE_NULLIFY_APPROVAL";
          break;
        case "2":
          this.tetrunData.status = "CENTRALIZED_INVOICE_NULLIFY_WAIT_INVALID";
          break;
        case "3":
          this.tetrunData.status = "CENTRALIZED_INVOICE_NULLIFY_REJECT";
          break;
        case "4":
          this.tetrunData.status = "CENTRALIZED_INVOICE_NULLIFY_INVALIDING";
          break;
        case "5":
          this.tetrunData.status = "CENTRALIZED_INVOICE_NULLIFY_INVALID";
          break;
        case "6":
          this.tetrunData.status = "CENTRALIZED_INVOICE_NULLIFY_FAIL";
          break;
        case null:
          this.tetrunData.status = "null";
          break;
      }
      console.log(this.tetrunData.status);
      // postPurchaseInvalidlist(this.tetrunData).then(res => {
      //   console.log(res);
      //   this.tableData = res.data;
      // });
      this.postPurchaseInvalidlist(1, this.tetrunData.status);
    },
    //清空查询条件
    Empty() {
      this.tetrunData.pageNum = 1;
      this.tetrunData.endTime = null;
      this.tetrunData.invoiceCode = null;
      this.tetrunData.invoiceNumber = null;
      this.tetrunData.organizationId = null;
      this.tetrunData.startTime = null;
      this.tetrunData.partnerId = null;
      this.tetrunData.invoiceType = null;
      this.dataTime = null;
      this.postPurchaseInvalidlist(1, this.tetrunData.status);
    },
    changeTab(val, status) {
      if (this.isActive == val) return false;
      console.log(val);
      console.log(status);
      this.isActive = val;
      this.status = val;
      this.postPurchaseInvalidlist(1, status);
    },
    querySelect(query, type, list) {
      if (query !== "") {
        this.loading = true;
        if (type == "supplierMethod") {
          purchase({ name: query }).then(res => {
            this.partnerNames = res.data;
            this.loading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    //红冲
    passCancellation() {
      this.application = true;
    },
    primaryRed(id) {
      putBathRed(id).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.application = false;
          this.lication = false;
          this.getPurchseStatuecont();
          this.postPurchaseInvalidlist(1, this.tetrunData.status);
        }
      });
    },
    //批量通过&&作废
    batchOperation() {
      console.log(this.multipleSelection);
      if (this.multipleSelection.length) {
        if (this.isActive == 1) {
          this.dialogBatch = true;
        }
        if (this.isActive == 2 || this.isActive == 6) {
          this.dialogLica = true;
        }
      } else {
        this.$message({
          message: "请先选择需要操作的数据",
          type: "error"
        });
      }
    },
    primaryBatch() {
      console.log(this.formData);
      putBathsPass(this.formData.id).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.dialogBatch = false;
          this.getPurchseStatuecont();
          this.postPurchaseInvalidlist(1, this.tetrunData.status);
        }
      });
    },
    primaryLica() {
      console.log(this.formData);
      putBathsRed(this.formData.id).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.dialogLica = false;
          this.getPurchseStatuecont();
          this.postPurchaseInvalidlist(1, this.tetrunData.status);
        }
      });
    },
    //伙伴名称
    remoteorganization(query) {
      if (query) {
        organizationListName({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.organizations = res.data;
          }
        });
      } else {
        this.partnerNames = [];
      }
    },
    remoteorganizations(query) {
      if (query) {
        findOrganization({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.remoteors = res.data;
          }
        });
      } else {
        this.partnerNames = [];
      }
    },
    openWin(name, query) {
      this.$router.push({
        name: name,
        query: this.query
      });
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
      console.log(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.formData.sum = 0;
      this.formData.id = [];
      // console.log(this.multipleSelection);
      this.formData.sheets = this.multipleSelection.length;
      val.forEach(e => {
        this.formData.sum += e.amount;
      });
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.formData.id[i] = val[i].id;
      }
      // console.log(this.formData.id, 212);
    },
    dialogCallback(type) {
      console.log(type, "whp");
      this.getPurchseStatuecont();
      this.postPurchaseInvalidlist(1, this.tetrunData.status);
    },
    selectPicker(dataTime) {
      if (dataTime) {
        this.tetrunData.startTime = dataTime[0];
        this.tetrunData.endTime = dataTime[1];
        // console.log(this.fron)
      } else {
        this.tetrunData.startTime = "";
        this.tetrunData.endTime = "";
      }
    },
    //分页跳转
    handleCurrentChange(val) {
      console.log(val);
      this.tetrunData.pageNum = val;
      this.postPurchaseInvalidlist(val, this.tetrunData.status);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.tetrunData.pageSize = val;
      this.tetrunData.pageNum = 1;
      this.postPurchaseInvalidlist(1, this.tetrunData.status);
    }
  },
  filters: {
    //时间截取字符串
    formatDateT: function(value) {
      if (!value) return "";
      return value.substring(0, 10);
    },
    formatDateD: function(value) {
      if (!value) return "";
      return value.substring(11, 19);
    }
  }
};
</script>

<style lang='less' scoped>
.demandBox {
  width: 100%;
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
        height: 42px;
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
        text-align: center;
        width: 30%;
      }
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
  .buttonBox {
    margin-top: 10px;
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      overflow: hidden;
      height: 45px;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 0 0 10px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 24%;
        display: flex;
        align-items: center;
        span {
          text-align: right;
          flex: 0 0 98px;
        }
      }
      .el-input {
        max-width: 200px;
        padding: 5px;
      }
      .el-select {
        max-width: 200px;
        padding: 5px;
      }
    }
  }
  .listBox {
    border: 1px solid #e4e4e4;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f3f3f3;
      height: 50px;
      .listLeft {
        i {
          padding: 0 5px 0 20px;
        }
      }
      .listRight {
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  }
  .block {
    margin: 5px 10px;
    text-align: right;
  }
}
</style>
