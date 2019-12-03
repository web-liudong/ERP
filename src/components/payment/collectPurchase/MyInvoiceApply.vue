<template>
  <div class="billListBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="(item,index) in buttonList"
        :key="index"
        :class="{active: isClick == item.status}"
        @click="changeTab(item.status)"
      >{{item.statusName}}（{{item.total}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">展开筛选</i>
          </span>
          <el-button size="small" @click="select">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>订单号：</span>
            <el-input placeholder="请输入订单号" v-model="findParam.applicationNo" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>创建日期：</span>
            <el-date-picker
              v-model="dataTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class="inputBox">
            <span>服务方：</span>
            <el-select
              v-model="findParam.partnerId"
              remote
              filterable
              clearable
              placeholder="请输入服务方名称"
              :remote-method="supplierMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in supplierNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          <span>数据列表</span>
        </div>
        <div class="listRight"></div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="tableStyle"
          :max-height="dataListHeight"
        >
          <el-table-column
            prop="applicationNo"
            label="申请单编号"
            align="center"
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="partnerName" label="服务方名称" align="center"></el-table-column>
          <el-table-column prop="invoiceTitle" label="发票抬头" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invoiceType" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.invoiceType|invoiceIn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="申请金额" align="center"></el-table-column>
          <el-table-column prop="needReceipt" label="是否需要收据" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.needReceipt?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="statusContext" label="开票状态" align="center"></el-table-column>
          <el-table-column prop="postStatus" label="邮寄状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.postStatus == 'PENDING_DELIVERY'">待邮寄</span>
              <span v-if="scope.row.postStatus == 'DELIVERY'">配送中</span>
              <span v-if="scope.row.postStatus == 'COMPLETED' ">已完成</span>
            </template>
          </el-table-column>
          <el-table-column prop="invalidStatus" label="作废申请" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invalidStatus">
                <span v-if="scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_APPROVAL'">待审核</span>
                <span
                  v-if="scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_WAIT_INVALID'"
                >待作废</span>
                <span v-if="scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_REJECT'">驳回</span>
                <span v-if="scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_INVALIDING'">作废中</span>
                <span v-if="scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_INVALID'">已作废</span>
                <span v-if="scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_FAIL'">作废失败</span>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_REJECT'"
                  @click="dialogRejec = true,dataLIst = scope.row"
                >查看驳回原因</el-button>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-show="$authorities.CollectionBillInvoiceInfo"
                v-if="(scope.row.invalidStatus == 'CENTRALIZED_INVOICE_NULLIFY_REJECT'||scope.row.invalidStatus == null)&&scope.row.status == '3'"
                @click="dataLIst = scope.row,openDialog()"
                type="text"
                size="small"
              >作废申请</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.statusContext=='已驳回'"
                @click="editerInvoice('editerInvoice',{'id':scope.row.id})"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="openWin('Invoiceapplydetail',{'id': scope.row.id,'group':true})"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="cancelApproval(scope.row)"
                v-if="scope.row.statusContext=='已驳回'"
              >取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="findParam.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="findParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
    <applyInvoice ref="applyInvoice" :InvoiceTitle="Title"></applyInvoice>
    <el-dialog :visible.sync="dialogRejec" width="40%" custom-class="dialog-box">
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
              <span v-if="this.dataLIst.invoiceType == 'VAT_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType == 'PLAIN_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType == 'ELECTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>发票代码：</th>
            <td>{{this.dataLIst.invoiceCode}}</td>
            <th>开票日期：</th>
            <td>{{this.dataLIst.createTime}}</td>
          </tr>
          <tr>
            <th>发票金额：</th>
            <td>
              <span>￥{{this.dataLIst.amount}}</span>
            </td>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
          </tr>
        </table>
        <div class="message-foot">
          <span>驳回原因:</span>
          <span>{{this.dataLIst.rejectReason}}</span>
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
              <span v-if="this.dataLIst.invoiceType == 'VAT_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType == 'PLAIN_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType == 'ELECTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>发票代码：</th>
            <td>{{this.dataLIst.invoiceCode}}</td>
            <th>开票日期：</th>
            <td>{{this.dataLIst.createTime}}</td>
          </tr>
          <tr>
            <th>发票金额：</th>
            <td>
              <span>￥{{this.dataLIst.amount}}</span>
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
              <span v-if="this.dataLIst.invoiceType == 'VAT_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType == 'PLAIN_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType == 'ELECTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>发票代码：</th>
            <td>{{this.dataLIst.invoiceCode}}</td>
            <th>开票日期：</th>
            <td>{{this.dataLIst.createTime}}</td>
          </tr>
          <tr>
            <th>发票金额：</th>
            <td>
              <span>￥{{this.dataLIst.amount}}</span>
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
import { postPurchaseCancellation } from "@/api/finance/invoiceObsolete";
import {
  getInvoiceList,
  getStatus,
  cancelInvoice,
  findOrganization
} from "@/api/payment/collectionPurchaseInvoice.js";
import applyInvoice from "./child/apply_invoice.vue";
export default {
  inject: ["reload", "isFilterShow"],
  name: "MyInvoiceApply",
  data() {
    return {
      Title: "编辑开票",
      buttonList: [],
      dataLIst: {},
      isClick: 0,
      isShow: this.isFilterShow,
      dataTime: null,
      total: 0,
      loading: false,
      dialogRejec: false,
      application: false,
      applications: false,
      supplierNames: [],
      creatorNames: [],
      //查询对象
      findParam: {
        applicationNo: null, //采购结算单编号
        createEndTime: null, //结束时间
        createStartTime: null, //开始时间
        creatorId: null, //申请人 用户id
        pageNum: 1, //页码
        pageSize: 10, //每页大小
        partnerId: null, //
        status: null //INVOICE_APPROVAL，INVOICE_APPROVALING，INVOICE_COMPLETED，INVOICE_REJECT，INVOICE_INVALID，INVOICE_FAILURE
      },
      //表格table
      tableData: [],
      //表头样式
      tableStyle: {
        background: "#f5f7fa"
      },
      formApplication: {
        centralizedPurchaseInvoiceType: "",
        invoiceApplicationId: "",
        invalidReason: "",
        invalidReason: "",
        memo: ""
      },
      formApplications: {
        centralizedPurchaseInvoiceType: "",
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
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        receivedInvoice: [
          { required: true, message: "请选择是否收到纸质票", trigger: "change" }
        ]
      },
      rulse: {
        invalidReason: [
          { required: true, message: "请输入作废原因", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    applyInvoice
  },
  created() {
    // let str=window.localStorage.getItem('UserInfo');
    // this.findParam.creatorId=JSON.parse(str).userPosts[0]&&JSON.parse(str).userPosts[0].id;(当前用户id，可以不用传，后台自己拿到)

    // console.log(this.findParam.creatorId,444)
    this.statusCount();
    this.changeTab();
  },
  filters: {
    invoiceIn(val) {
      return val == "VAT_INVOICE"
        ? "专票"
        : val == "PLAIN_INVOICE"
        ? "普票"
        : val == "ELECTRONIC_INVOICE"
        ? "电子发票"
        : "";
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset() {
      this.findParam.applicationNo = null; //采购结算单编号
      this.dataTime = null;
      this.findParam.createEndTime = null; //结束时间
      this.findParam.createStartTime = null; //开始时间
      this.findParam.creatorId = null; //申请人 用户id
      this.findParam.pageNum = 1; //页码
      this.findParam.pageSize = 10; //每页大小
      this.findParam.partnerId = null; //
      this.findParam.status = null;
      this.statusCount();
      this.changeTab();
    },
    //获取顶部button的数量个状态
    statusCount() {
      getStatus().then(res => {
        if (res.code === "000000") {
          this.buttonList = res.data;
        }
      });
    },
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
      }
    },
    asdaqw(formName) {
      this.$refs[formName].resetFields();
      this.formApplication.memo = "";
      this.formApplications.memo = "";
    },
    openDialog() {
      console.log(this.dataLIst.invoiceType);
      if (this.dataLIst.invoiceType == "ELECTRONIC_INVOICE") {
        this.applications = true;
      } else {
        this.application = true;
      }
    },
    possCancellation(formName) {
      // console.log(formName);
      console.log(this.formApplication);
      if (this.dataLIst.invoiceType == "ELECTRONIC_INVOICE") {
        console.log("电子的");
        this.formApplication.centralizedPurchaseInvoiceType = this.dataLIst.invoiceType;
        this.formApplication.invoiceApplicationId = this.dataLIst.id;
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (valid) {
              postPurchaseCancellation(this.formApplication).then(res => {
                if (res.code == "000000") {
                  this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.applications = false;
                  this.$refs[formName].resetFields();
                  this.formApplication.memo = "";
                  this.statusCount();
                  this.changeTab();
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
        this.formApplications.centralizedPurchaseInvoiceType = this.dataLIst.invoiceType;
        this.formApplications.invoiceApplicationId = this.dataLIst.id;
        this.$refs[formName].validate(valid => {
          if (valid) {
            postPurchaseCancellation(this.formApplications).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.application = false;
                this.$refs[formName].resetFields();
                this.formApplications.memo = "";
                this.statusCount();
                this.changeTab();
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //编辑开票信息
    editerInvoice(type, row) {
      this.$refs.applyInvoice.init(type, row);
    },
    //取消
    cancelApproval(row) {
      this.$confirm(
        "确定取消该申请单？取消申请单后结算单可重新被选择",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          cancelInvoice(row.id).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "取消申请单成功",
                type: "success"
              });
              this.changeTab(this.isClick);
              this.statusCount();
            }
          });
        })
        .catch(() => {});
    },
    //改变按钮
    changeTab(val) {
      console.log(val, "aaa");
      this.isClick = val;
      this.findParam.status = val;
      this.findParam.createStartTime = this.dataTime ? this.dataTime[0] : null;
      this.findParam.createEndTime = this.dataTime ? this.dataTime[1] : null;
      //获取全部结算列表
      getInvoiceList(this.findParam).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.findParam.pageNum = res.data.pageNum;
          this.findParam.pageSize = res.data.pageSize;
          this.total = res.data.total;
        }
      });
      this.statusCount();
    },
    //查询结果
    select() {
      this.findParam.pageNum = 1;
      this.changeTab(this.isClick);
    },
    //服务方模糊查询
    supplierMethod(query) {
      if (query !== "") {
        this.loading = true;
        findOrganization({ name: query }).then(res => {
          this.loading = false;
          this.supplierNames = res.data;
        });
      } else {
        this.supplierNames = [];
      }
    },
    //跳转到编辑页
    openWin(name, query) {
      this.$router.push({
        name: name,
        query: query
      });
    },
    //跳转页数
    handleCurrentChange(val) {
      console.log(val, "页数");
      this.findParam.pageNum = val;
      this.changeTab(this.isClick);
    },
    handleSizeChange(val) {
      this.findParam.pageSize = val;
      this.changeTab(this.isClick);
    }
  }
};
</script>

<style lang='less' scoped>
.billListBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
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
        width: 25%;
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
  .block {
    margin: 5px;
    text-align: right;
  }
}
</style>
