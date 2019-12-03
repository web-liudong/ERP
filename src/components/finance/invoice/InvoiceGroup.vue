<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="(item,index) in statusBag"
        :key="index"
        :class="{active:status==item.statusCode}"
        @click="getinvoiceList(1,item.statusCode)"
      >{{item.statusName}}（{{item.total}}）</el-button>
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
            <span>申请单编号：</span>
            <el-input placeholder="申请单编号" v-model="applicationNo" clearable type="number"></el-input>
          </div>
          <div class="search-icon">
            <span>伙伴：</span>
            <el-select
              v-model="partnerID"
              filterable
              clearable
              remote
              placeholder="伙伴"
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
            <span>开票方：</span>
            <el-select
              v-model="organizationId"
              filterable
              clearable
              remote
              placeholder="开票方"
              :remote-method="remotePartner"
            >
              <el-option
                v-for="item in partners"
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
      <table-head headname="数据列表">
        <div>
          <el-button plain size="small" @click="goLog" v-if="$authorities.GroupInvoiceRecord">开票记录</el-button>
        </div>
      </table-head>
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="applicationNo" label="申请单编号" align="center"></el-table-column>
        <el-table-column prop="organizationName" label="开票方" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="partnerName" label="伙伴" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="invoiceTitle" label="发票抬头" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.invoiceType=='VAT_INVOICE'?'专票':scope.row.invoiceType=='PLAIN_INVOICE'?'普票':'电子发票'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="申请金额" align="center" :formatter="TableMoney"></el-table-column>
        <el-table-column label="是否需要收据" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.needReceipt?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusContext" label="开票状态" align="center"></el-table-column>
        <el-table-column prop="creatorName" label="申请人" align="center"></el-table-column>
        <el-table-column  label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goreject(scope.row.id)"
              v-if="(scope.row.status==6||scope.row.status==1)&&$authorities.GroupInvoiceReject"
            >驳回</el-button>
            <el-button
              type="text"
              size="small"
              @click="open(scope.row.id)"
              v-if="(scope.row.status==1||scope.row.status==6)&&$authorities.GroupInvoiceOut"
            >开票</el-button>
            <el-button
              type="text"
              size="small"
              @click="goDetail(scope.row.id)"
              v-if="$authorities.GroupInvoiceDetail"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]" @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
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
          >{{invoiceApplicationDTO.invoiceType=='VAT_INVOICE'?'专票':invoiceApplicationDTO.invoiceType=='PLAIN_INVOICE'?'普票':'电子发票'}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="left-dialog">开票金额：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">￥{{invoiceApplicationDTO.amount}}</div>
        </el-col>
        <el-col :span="4">
          <div class="left-dialog">备注：</div>
        </el-col>
        <el-col :span="8">
          <div class="right-dialog">{{invoiceApplicationDTO.applicationMemo}}</div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="makeout = false">取 消</el-button>
        <el-button type="primary" @click="makeOutInvoice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReject" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">驳回开票申请</span>
      </div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;驳回后，申请方可修改内容再次提交开票申请</div>
      <div class="message-box">
        <div class="message-box-tip">
          <i style="color:red">*</i>驳回原因
        </div>
        <el-input type="textarea" :rows="5" placeholder="1~200字以内" v-model="rejectReason"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReject = false">取 消</el-button>
        <el-button type="primary" @click="rejectbutton">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="发票申请单作废确认" :visible.sync="cancellation">
      <div style=" overflow-y:auto; overflow-x:auto; width:100%; height:300px;">
        <table border="1">
          <tr>
            <th>发票申请单编号：</th>
            <td>{{invoiceApplicationDTO.applicationNo}}</td>
            <th>申请时间：</th>
            <td>{{invoiceApplicationDTO.createTime}}</td>
          </tr>
          <tr>
            <th>发票类型：</th>
            <td>{{invoiceApplicationDTO.invoiceType==1?'专票':invoiceApplicationDTO.invoiceType==2?'普票':'电子发票'}}</td>
            <th>开票金额：</th>
            <td>￥{{invoiceApplicationDTO.amount}}</td>
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
            <th></th>
            <td></td>
          </tr>
        </table>
        <div>开票明细</div>
        <el-table
          :data="invoiceApplicationDTO.itemDetailLIst"
          border
          style="width: 100%"
          size="small"
        >
          <el-table-column prop="skuId" label="商品编号" align="center"></el-table-column>
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
        <el-button @click="cancellation = false">取 消</el-button>
        <el-button type="danger" @click="nullify">作废</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { organizationListName } from "@/api/projectController/projectController";
import { formatString } from "@/utils";
import TableHead from "@/components/common/TableHead/tablehead";
import {
  statusCount,
  allList,
  groupDetail,
  invoice,
  reject,
  nullify
} from "@/api/finance/invoiceGroup";
export default {
  inject: ["reload", "TableMoney"],
  name:'InvoiceGroup',
  data() {
    return {
      cancellation: false,
      applicationNo: null,
      time: null,
      organizations: [],
      partners:[],
      organizationId: null,
      partnerID:null,
      status: null,
      tableData: [],
      statusBag: [],
      page: 1,
      total: 0,
      isShow: true,
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
      cancelId: null,
      pageSize:10
    };
  },
  created() {
    this.getinvoiceList(-1, null);
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getinvoiceList(-1, null);
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  components: {
    TableHead
  },
  methods: {
    handleSizeChange(val){
      this.pageSize = val;
      this.getinvoiceList(1, status);
    },
    makeOutInvoice() {
      if (this.makeOutId) {
        invoice(this.makeOutId).then(res => {
          if (res.code == "000000") {
            let href = formatString(
              "/api/file-service/file/download?id={id}&access_token={token}",
              { id: res.data, token: this.$auth.token }
            );
            window.open(href, "blank");
            this.reload();
          }
        });
      }
    },
    open(id) {
      this.makeOutId = id;
      this.makeout = true;
      groupDetail(id).then(res => {
        if (res.code == "000000") {
          this.invoiceApplicationDTO = res.data;
        }
      });
    },
    nullify() {
      nullify(this.cancelId).then(re => {
        if (re.code == "000000") {
          this.$message({
            type: "success",
            message: "作废成功!"
          });
          this.reload();
        }
      });
    },
    handleSelectionChange(val) {
      this.selectArr = val;
    },
    goreject(id) {
      this.rejectid = id;
      this.dialogReject = true;
    },
    rejectbutton() {
      if (this.rejectReason == "") {
        this.$message.error("驳回原因不能为空");
        return;
      } else {
        reject({
          invoiceId: this.rejectid,
          rejectDes: this.rejectReason
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
    goLog(id) {
      this.$router.push({
        name: "Record",
        query: {
          group: true
        }
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "Invoiceapplydetail",
        query: {
          id: id,
          group: true
        }
      });
    },
    handleCurrentChange(val) {
      this.getinvoiceList(val, status);
    },
    getinvoiceList(page, status) {
      this.status = status;
      statusCount().then(res => {
        if (res.code == "000000") {
          this.statusBag = res.data;
        }
      });
      var statustext;
      switch (status) {
        case null:
          statustext = null;
          break;
        case 1:
          statustext = "INVOICE_APPROVAL";
          break;
        case 2:
          statustext = "INVOICE_APPROVALING";
          break;
        case 3:
          statustext = "INVOICE_COMPLETED";
          break;
        case 4:
          statustext = "INVOICE_REJECT";
          break;
        case 5:
          statustext = "INVOICE_INVALID";
          break;
        case 6:
          statustext = "INVOICE_FAILURE";
          break;
      }
      allList({
        createEndTime: this.time ? this.time[1] : null,
        applicationNo: this.applicationNo == "" ? null : this.applicationNo,
        organizationId: this.organizationId,
        partnerId:this.partnerID,
        pageNum: page,
        pageSize: this.pageSize,
        createStartTime: this.time ? this.time[0] : null,
        status: statustext
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
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
    remotePartner(query) {
      if (query) {
        organizationListName({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.partners = res.data;
          }
        });
      }
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
    clear: both;
    margin: 10px 0 0 0;
  }
  .block {
    margin-top: 2px;
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
