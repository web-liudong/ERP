<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="(item,index) in statusBag"
        :key="index"
        :class="{active:status==item.status}"
        @click="getinvoiceList(1,item.status)"
      >{{item.statusName}}（{{item.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">{{isShow?'收起':'展开'}}筛选</span>
          <el-button size="small" @click="getinvoiceList(1,status)">查询结果</el-button>
          <el-button size="small" @click="reload">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>创建时间：</span>
            <el-date-picker
              v-model="time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="search-icon">
            <span>订单号：</span>
            <el-input placeholder="订单号" v-model="orderid" clearable></el-input>
          </div>
          <div class="search-icon">
            <span>申请单编号：</span>
            <el-input placeholder="申请单编号" v-model="invoiceApplicationNo" clearable></el-input>
          </div>
          <div class="search-icon">
            <span>发票抬头：</span>
            <el-input placeholder="发票抬头" v-model="invoiceTitle" clearable></el-input>
          </div>
          <div class="search-icon">
            <span>客户名称：</span>
            <el-select
              v-model="customername"
              filterable
              remote
              clearable
              placeholder="客户名称"
              :remote-method="customerRemote"
            >
              <el-option
                v-for="item in customernames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>项目名称：</span>
            <el-select
              v-model="customerproject"
              filterable
              clearable
              remote
              placeholder="项目名称"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in customerprojects"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>提交服务方：</span>
            <el-select
              v-model="organizationId"
              filterable
              clearable
              remote
              placeholder="提交服务方"
              :remote-method="remoteorganization"
            >
              <el-option
                v-for="item in organizations"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>组织结构所在省：</span>
            <el-select v-model="provinceId" clearable multiple placeholder="请选择省">
              <el-option
                v-for="item in provinces"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>发票类型：</span>
            <el-select v-model="invoiceType" clearable placeholder="请选择类型">
              <el-option
                v-for="item in invoiceTypes"
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
        <table-head headname="数据列表">
          <div>
            <el-button
              plain
              icon="el-icon-plus"
              size="small"
              @click="xinvoice"
              v-if="(status==2||status==4)&&$authorities.InvoiceBatch"
            >批量开具销项发票</el-button>
            <el-button
              plain
              icon="el-icon-plus"
              size="small"
              @click="sync"
              v-if="status==3&&$authorities.InvoiceBatch"
            >批量上传百旺流水单</el-button>
            <el-button
              plain
              icon="el-icon-plus"
              size="small"
              @click="jinvoice"
              v-if="(status==2||status==3||status==4)&&($authorities.InvoiceBatch)"
            >批量开具进项发票</el-button>
            <el-button plain size="small" @click="goLog" v-if="$authorities.InvoiceRecord">
              <i class="iconfont iconzengjia"></i>开票记录
            </el-button>
          </div>
        </table-head>
      </div>
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column
          prop="invoiceApplicationNo"
          label="申请单编号"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="projectName" label="关联项目" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="customerName" label="关联客户名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="organizationName"
          label="组织机构名称"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="invoiceTitle" label="发票抬头" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.invoiceType==0?'专票':scope.row.invoiceType==1?'普票':'电子发票'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applicationsAmount"
          label="申请金额"
          align="center"
          :formatter="TableMoney"
        ></el-table-column>
        <el-table-column label="是否需要收据" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.needReceipt?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="开票状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">待审核</span>
            <span v-if="scope.row.status==1">已驳回</span>
            <span v-if="scope.row.status==2">待开票</span>
            <span v-if="scope.row.status==3">开票中</span>
            <span v-if="scope.row.status==4">已完成</span>
            <span v-if="scope.row.status==5">开票失败</span>
            <span v-if="scope.row.status==6">已作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="申请人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="SimpleDetail(scope.row.id)"
              v-if="scope.row.status==0&&$authorities.InvoicePass"
            >通过</el-button>
            <el-button
              type="text"
              size="small"
              @click="goreject(scope.row.id)"
              v-if="(scope.row.status==0||scope.row.status==2||scope.row.status==5)&&$authorities.InvoiceReject"
            >驳回</el-button>
            <el-button
              type="text"
              size="small"
              @click="finish(scope.row.id)"
              v-if="scope.row.status==3&&$authorities.InvoiceFinish"
            >终止开票</el-button>
            <el-button
              type="text"
              size="small"
              @click="open(scope.row.id,scope.row.useBaiWang)"
              v-if="scope.row.status===2&&$authorities.InvoiceMakeOut"
            >开票</el-button>
            <el-button
              type="text"
              size="small"
              @click="syncOnly(scope.row.id)"
              v-if="scope.row.status==3&&($authorities.InvoiceMakeOut&&scope.row.useBaiWang)"
            >同步百旺流水单</el-button>
            <el-button
              type="text"
              size="small"
              @click="goDetail(scope.row.id)"
              v-if="$authorities.InvoiceDetail"
            >详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="complete(scope.row)"
              v-if="scope.row.status==3&&$authorities.DoneManually"
            >手动完成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]"
          @size-change="handleSizeChange"
          layout="total, sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="批量开票" :visible.sync="showdetail">
      <el-row>
        <el-col :span="6">
          <div class="left-dialog">开票总金额：</div>
        </el-col>
        <el-col :span="6">
          <div class="right-dialog">{{totalbill}}</div>
        </el-col>
        <el-col :span="6">
          <div class="left-dialog">发票张数：</div>
        </el-col>
        <el-col :span="6">
          <div class="right-dialog">{{invoicecount}}</div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showdetail = false">取 消</el-button>
        <el-button type="primary" @click="batchInvoice">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量开票" :visible.sync="showdetail2">
      <el-row>
        <el-col :span="6">
          <div class="left-dialog">开票总金额：</div>
        </el-col>
        <el-col :span="6">
          <div class="right-dialog">{{totalbill}}</div>
        </el-col>
        <el-col :span="6">
          <div class="left-dialog">发票张数：</div>
        </el-col>
        <el-col :span="6">
          <div class="right-dialog">{{invoicecount}}</div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showdetail2 = false">取 消</el-button>
        <el-button type="primary" @click="batchInvoice2">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="开票" :visible.sync="makeout">
      <el-row>
        <el-col :span="4">
          <div class="left-dialog">发票抬头：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">{{invoiceApplicationDTO.invoiceTitle}}</div>
        </el-col>
        <el-col :span="4">
          <div class="left-dialog">发票类型：</div>
        </el-col>
        <el-col :span="8">
          <div
            class="right-dialog"
          >{{invoiceApplicationDTO.invoiceType==0?'专票':invoiceApplicationDTO.invoiceType==1?'普票':'电子发票'}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="left-dialog">申请金额：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">￥{{invoiceApplicationDTO.billAmount}}</div>
        </el-col>
        <el-col :span="4">
          <div class="left-dialog">开票金额：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">￥{{invoiceApplicationDTO.invoiceAmount}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="left-dialog">备注：</div>
        </el-col>
        <el-col :span="20">
          <div class="right-dialog">{{invoiceApplicationDTO.applicationMemo}}</div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="makeout = false">取 消</el-button>
        <el-button type="primary" @click="makeOutInvoice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="手动开票完成" :visible.sync="manual">
      <el-row>
        <el-col :span="4">
          <div class="left-dialog">发票抬头：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">{{manualData.invoiceTitle}}</div>
        </el-col>
        <el-col :span="4">
          <div class="left-dialog">发票类型：</div>
        </el-col>
        <el-col :span="8">
          <div
            class="right-dialog"
          >{{manualData.invoiceType==0?'专票':manualData.invoiceType==1?'普票':'电子发票'}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="left-dialog">申请金额：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">￥{{manualData.applicationsAmount}}</div>
        </el-col>
        <el-col :span="4">
          <div class="left-dialog">开票金额：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">￥{{manualData.applicationsAmount}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="left-dialog">备注：</div>
        </el-col>
        <el-col :span="20">
          <div class="right-dialog">{{manualData.memoOnInvoice}}</div>
        </el-col>
      </el-row>
      <el-form ref="form" :model="form" label-width="150px" :rules="rules" style="margin-top:20px;">
        <el-row>
          <el-col :span="11">
            <el-form-item label="发票号码：" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="开票时间：" prop="time">
              <el-date-picker
                v-model="form.time"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="发票代码：" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="manual = false">取 消</el-button>
        <el-button type="primary" @click="manualsubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="pass?'发票申请单初审':'发票申请单作废确认'" :visible.sync="firstPass">
      <div style=" overflow-y:auto; overflow-x:auto; width:100%; height:300px;">
        <table border="1">
          <tr>
            <th>发票申请单编号：</th>
            <td>{{invoiceApplicationDTO.invoiceApplicationNo}}</td>
            <th>申请时间：</th>
            <td>{{invoiceApplicationDTO.createTime}}</td>
          </tr>
          <tr>
            <th>发票类型：</th>
            <td>{{invoiceApplicationDTO.invoiceType==0?'专票':invoiceApplicationDTO.invoiceType==1?'普票':'电子发票'}}</td>
            <th>开票金额：</th>
            <td>￥{{invoiceApplicationDTO.invoiceAmount}}</td>
          </tr>
          <tr>
            <th>实际申请金额：</th>
            <td>￥{{invoiceApplicationDTO.billAmount}}</td>
            <th>平台服务费率：</th>
            <td>{{invoiceApplicationDTO.partyCServiceFeeRate}}</td>
          </tr>
          <tr>
            <th>发票申请人：</th>
            <td>{{invoiceApplicationDTO.creatorName}}</td>
            <th>发票抬头：</th>
            <td>{{invoiceApplicationDTO.invoiceTitle}}</td>
          </tr>
          <tr>
            <th>税务登记号：</th>
            <td>{{invoiceApplicationDTO.socialCreditCode}}</td>
            <th>发票地址：</th>
            <td>{{invoiceApplicationDTO.addressOnInvoice}}</td>
          </tr>
          <tr>
            <th>发票电话：</th>
            <td>{{invoiceApplicationDTO.phoneOnInvoice}}</td>
            <th>开户行：</th>
            <td>{{invoiceApplicationDTO.bank}}</td>
          </tr>
          <tr>
            <th>开户行账号：</th>
            <td>{{invoiceApplicationDTO.accountNo}}</td>
            <th>申请备注：</th>
            <td>{{invoiceApplicationDTO.applicationMemo}}</td>
          </tr>
          <tr>
            <th>简称:</th>
            <td>{{invoiceApplicationDTO.shortName}}</td>
            <th>发票备注:</th>
            <td>{{invoiceApplicationDTO.memoOnInvoice}}</td>
          </tr>
        </table>
        <div>开票明细</div>
        <el-table :data="invoiceApplicationOrderItemDTOs" border style="width: 100%" size="small">
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="skuModel" label="型号" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="invoicePrice" label="开票单价" align="center" :formatter="TableMoney"></el-table-column>
          <el-table-column prop="currentQty" label="数量" align="center"></el-table-column>
          <el-table-column prop="invoiceAmount" label="开票金额" align="center" :formatter="TableMoney"></el-table-column>
          <el-table-column prop="taxCode" label="税收分类编码" align="center"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="firstPass = false">取 消</el-button>
        <el-button type="primary" @click="ReviewPass" v-if="pass">通过</el-button>
        <el-button type="danger" @click="ReviewPass" v-else>作废</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReject" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">驳回</span>
      </div>
      <div class="message-box">
        <div class="message-box-tip">
          <i style="color:red">*</i>驳回原因
        </div>
        <el-input type="textarea" :rows="5" placeholder="1~200字以内" v-model="rejectReason"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReject = false">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFinish" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">终止开票</span>
      </div>
      <div class="message-box">
        <div class="message-box-tip">
          <i style="color:red">*</i>终止原因
        </div>
        <el-input type="textarea" :rows="5" placeholder="1~200字以内" v-model="textareaFinish"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFinish = false">取 消</el-button>
        <el-button type="primary" @click="FinishSub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { customerName, projectName } from "@/api/customerManage";
import { organizationListName } from "@/api/projectController/projectController";
import { formatString } from "@/utils";
import TableHead from "@/components/common/TableHead/tablehead";
import qs from "qs";
import {
  invoiceList,
  batchInvoicing,
  reviewPass,
  statusCount,
  simpleDetail,
  reviewReject,
  cancellation,
  cancellationcheck,
  makeinvoice,
  outputInvoice,
  batchInputInvoice,
  getprovinces,
  manuallyComplete,InvoiceFinish
} from "@/api/finance/invoice";
export default {
  name: "InvoiceApply",
  inject: ["reload", "TableMoney"],
  data() {
    return {
      invoiceType: null,
      dialogFinish:false,
      textareaFinish:null,
      finishId:null,
      invoiceTypes: [
        {
          id: 0,
          name: "专票"
        },
        {
          id: 1,
          name: "普票"
        },
        {
          id: 2,
          name: "电子发票"
        }
      ],
      form: {
        name: null,
        time: null,
        code: null
      },
      manual: false,
      manualData: {},
      provinceId: [],
      provinces: [],
      pass: true,
      time: null,
      orderid: null,
      customernames: [],
      customername: null,
      customerprojects: [],
      customerproject: null,
      organizations: [],
      organizationId: null,
      showdetail: false,
      showdetail2: false,
      status: -1,
      tableData: [],
      statusBag: [],
      page: 1,
      name: null,
      total: 0,
      dialogTableVisible: false,
      previewVisible: false,
      isShow: true,
      firstPass: false,
      invoiceApplicationOrderItemDTOs: [],
      checkId: null,
      dialogReject: false,
      rejectReason: "",
      rejectid: null,
      invoicecount: 0,
      cancelId: null,
      makeout: false,
      makeOutId: null,
      invoiceApplicationDTO: {},
      totalbill: 0,
      fileids: null,
      pageSize: 10,
      invoiceApplicationNo: null,
      invoiceTitle: null,
      makeOutType: null,
      rules: {
        name: [{ required: true, message: "请输入发票号码", trigger: "blur" }],
        code: [{ required: true, message: "请输入发票代码", trigger: "blur" }],
        time: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  created() {
    this.getinvoiceList(1, -1);
    getprovinces().then(res => {
      if (res.code == "000000") {
        this.provinces = res.data;
      }
    });
  },
  activated() {
    if (this.$route.params && this.$route.params.isUpdate) {
      this.getinvoiceList(1, -1);
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  components: {
    TableHead
  },
  methods: {
    FinishSub(){
      if(this.textareaFinish){
        InvoiceFinish({
          id:this.finishId,
          reason:this.textareaFinish
        }).then(res=>{
          if(res.code=='000000'){
            this.reload()
          }
        })
      }else{
        this.$message.error("请填写终止原因");
        return;
      }
    },
    finish(id){
      this.finishId = id;
      this.dialogFinish = true;
      this.textareaFinish = null;
    },
    manualsubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          manuallyComplete(this.manualData.id, {
            invoiceCode: this.form.code,
            invoiceNumber: this.form.name,
            invoiceTime: this.form.time
          }).then(res => {
            this.manual = false;
            this.getinvoiceList(this.page, this.status);
          });
        }
      });
    },
    complete(row) {
      this.manualData = row;
      this.manual = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getinvoiceList(1, this.status);
    },
    batchInvoice() {
      var ids = this.selectArr.map(function(res) {
        return res.id;
      });
      batchInvoicing({
        ids: ids
      }).then(res => {
        if (res.code == "000000") {
          let href = formatString(
            "/api/file-service/file/download?id={id}&access_token={token}",
            { id: res.data, token: this.$auth.token }
          );
          window.open(href, "blank");
          this.reload();
        }
      });
    },
    sync() {
      if (this.selectArr) {
        var ids = this.selectArr.map(function(res) {
          return res.id;
        });
        batchInvoicing({
          ids: ids,
          type: 1
        }).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "同步成功!"
            });
            this.reload();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        });
      } else {
        this.$message({
          message: "请选择数据",
          type: "error"
        });
      }
    },
    batchInvoice2() {
      var ids = this.selectArr.map(function(res) {
        return res.id;
      });
      batchInputInvoice({
        ids: ids,
        type: 0
      }).then(res => {
        if (res.code == "000000") {
          let href = formatString(
            "/api/file-service/file/download?id={id}&access_token={token}",
            { id: res.data, token: this.$auth.token }
          );
          window.open(href, "blank");
          this.reload();
        }
      });
    },
    makeOutInvoice() {
      if (this.makeOutId) {
        let data = qs.stringify({ type: 0 });
        outputInvoice(this.makeOutId, data).then(res => {
          if (res.code == "000000") {
            let href = formatString(
              "/api/file-service/file/download?id={id}&access_token={token}",
              { id: res.data, token: this.$auth.token }
            );
            window.open(href, "blank");
            this.reload();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        });
      }
    },
    syncOnly(id) {
      let data = qs.stringify({ type: 1 });
      outputInvoice(id, data).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "同步成功!"
          });
          this.reload();
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    open(id, type) {
      this.makeOutId = id;
      this.makeOutType = type;
      this.makeout = true;
      makeinvoice(id).then(res => {
        this.invoiceApplicationDTO = res.data.invoiceApplicationDTO;
      });
    },
    xinvoice() {
      if (this.selectArr) {
        this.totalbill = 0;
        this.invoicecount = this.selectArr.length;
        this.showdetail = true;
        this.totalbill = this.selectArr.reduce(function(total, num) {
          return total + (num.applicationsAmount - 0);
        }, 0);
      } else {
        this.$message.error("请选择数据");
        return;
      }
    },
    jinvoice() {
      if (this.selectArr) {
        this.totalbill = 0;
        this.invoicecount = this.selectArr.length;
        this.showdetail2 = true;
        this.totalbill = this.selectArr.reduce(function(total, num) {
          return total + (num.applicationsAmount - 0);
        }, 0);
      } else {
        this.$message.error("请选择数据");
        return;
      }
    },
    handleSelectionChange(val) {
      this.selectArr = val;
    },
    goreject(id) {
      this.rejectid = id;
      this.dialogReject = true;
      this.rejectReason = null;
    },
    reject() {
      if (this.rejectReason == "") {
        this.$message.error("驳回原因不能为空");
        return;
      } else {
        reviewReject({
          id: this.rejectid,
          reason: this.rejectReason
        }).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "驳回成功!"
            });
            this.reload();
          }
        });
      }
    },
    ReviewPass() {
      if (this.cancelId) {
        cancellation(this.cancelId).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "作废成功!"
            });
            this.reload();
          }
        });
      } else {
        reviewPass(this.checkId).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.reload();
          }
        });
      }
    },
    SimpleDetail(id) {
      this.checkId = id;
      simpleDetail(id).then(res => {
        if (res.code == "000000") {
          this.invoiceApplicationDTO = res.data.invoiceApplicationDTO;
          this.invoiceApplicationOrderItemDTOs =
            res.data.invoiceApplicationOrderItemDTOs;
          this.firstPass = true;
        }
      });
    },
    download() {
      let href = formatString(this.apiMapping[this.type].download, {
        id: 74,
        token: this.$auth.token
      });
      window.open(href, "blank");
    },
    goLog(id) {
      this.$router.push({
        name: "Record"
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "Invoiceapplydetail",
        query: {
          id: id
        }
      });
    },
    handleCurrentChange(val) {
      this.getinvoiceList(val, this.status);
    },
    getinvoiceList(page, status) {
      this.status = status;
      statusCount().then(res => {
        if (res.code == "000000") {
          this.statusBag = res.data;
        }
      });
      invoiceList({
        invoiceApplicationNo: this.invoiceApplicationNo
          ? this.invoiceApplicationNo
          : null,
        invoiceTitle: this.invoiceTitle ? this.invoiceTitle : null,
        invoiceType: this.invoiceType,
        customerId: this.customername == "" ? null : this.customername,
        endTime: this.time ? this.time[1] : null,
        orderId: this.orderid == "" ? null : this.orderid,
        organizationId: this.organizationId,
        pageNum: page,
        pageSize: this.pageSize,
        projectId: this.customerproject,
        startTime: this.time ? this.time[0] : null,
        status: status == 7 ? null : status,
        provinceIds: this.provinceId.length ? this.provinceId : null
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    customerRemote(query) {
      if (query) {
        customerName(query).then(res => {
          if (res.code == "000000") {
            this.customernames = res.data;
          }
        });
      }
    },
    remoteorganization(query) {
      if (query) {
        organizationListName({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.organizations = res.data;
          }
        });
      }
    },
    remoteMethod(query) {
      projectName({
        name: query
      }).then(res => {
        if (res.code == "000000") {
          this.customerprojects = res.data;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .dialog-box {
    position: relative;
    .message-box {
      display: flex;
      .message-box-tip {
        width: 100px;
        margin-top: 20px;
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
    }
  }
  table {
    width: 90%;
    margin: 20px auto;
    td,
    th {
      border: 1px solid #d1d1d1;
      font-size: 14px;
      line-height: 53px;
    }
    th {
      padding-right: 6px;
      box-sizing: border-box;
      color: #666;
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
  .left-dialog {
    border: 1px solid #e4e4e4;
    line-height: 46px;
    text-align: right;
    background-color: #f5f5f5;
    font-size: 16px;
    font-weight: bold;
  }
  .right-dialog {
    border: 1px solid #e4e4e4;
    line-height: 46px;
    font-size: 16px;
    padding-left: 10px;
    box-sizing: border-box;
    min-height: 46px;
  }
  .buttonBox {
    margin-top: 10px;
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding-left: 20px;
      box-sizing: border-box;
      .head-left {
        display: flex;
        align-items: center;
      }
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      .myicon {
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
      border-top: 1px solid #e4e4e4;
      .search-icon {
        display: inline-block;
        padding: 10px 10px;
        .el-input {
          width: 200px;
        }
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 10px 0 0 0;
  }
  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .dialog-box {
    position: relative;
    .tree {
      display: flex;
      justify-content: center;
    }
    .message-box {
      padding: 26px;
      font-size: 12px;
      color: #666;
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
          input[type="file"] {
            opacity: 0;
            position: absolute;
            left: -70px;
            top: 0;
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
    }
  }
  .my-scroll-bar {
    height: 200px;
  }
}
</style>
