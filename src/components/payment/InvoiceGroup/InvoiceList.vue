<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:status===0}"
        @click="getList(1,0)"
      >全部（{{statusBag.count}}）</el-button>
      <el-button
        size="small"
        :class="{active:status===1}"
        @click="getList(1,1)"
      >待付款（{{statusBag.pendingCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:status===2}"
        @click="getList(1,2)"
      >部分付款（{{statusBag.partlyCompletedCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:status===3}"
        @click="getList(1,3)"
      >已完成（{{statusBag.completedCount}}）</el-button>
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
          <el-button size="small" @click="getList(1,status)">查询结果</el-button>
          <el-button size="small" @click="reload">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>结算单编号：</span>
            <el-input placeholder="结算单编号" v-model="billNo" clearable type="number"></el-input>
          </div>
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
            <span>应付账款：</span>
            <el-input placeholder="0.00" v-model="amountStart" type="number" clearable>
              <template slot="prepend">￥</template>
            </el-input>
            <span>-</span>
            <el-input placeholder="0.00" v-model="amountEnd" type="number" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表">
      </table-head> 
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column prop="billNo" label="结算单编号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" align="center"></el-table-column>
        <el-table-column prop="name" label="结算单名称" align="center"></el-table-column>
        <el-table-column prop="amount" label="结算单金额" align="center" :formatter="TableMoney"></el-table-column>
        <el-table-column prop="paidAmount" label="已付款金额" align="center" :formatter="TableMoney"></el-table-column>
        <el-table-column prop="creatorName" label="制单员" align="center"></el-table-column>
        <el-table-column prop="memo" label="备注" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status=='PENDING_PAYMENT'?'待付款':scope.row.status=='PARTLY_COMPLETED'?'部分付款':'已完成'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="gopay(scope.row)"
              v-if="(scope.row.status!=='COMPLETED')&&$authorities.GroupPayManagePay"
            >付款</el-button>
            <el-button
              type="text"
              size="small"
              @click="goDetail(scope.row.centralPurchaseBillId)"
              v-if="$authorities.GroupPayDetail"
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
          >{{invoiceApplicationDTO.invoiceType==0?'专票':invoiceApplicationDTO.invoiceType==1?'普票':'电子发票'}}</div>
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
      <div>&nbsp;&nbsp;&nbsp;&nbsp;驳回后，申请方可修改内容再次提交开票申请</div>
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
            <td>{{invoiceApplicationDTO.invoiceType==0?'专票':invoiceApplicationDTO.invoiceType==1?'普票':'电子发票'}}</td>
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
    <el-dialog title="付款" :visible.sync="paydialog" class="pay-dialog">
      <el-form :model="payform" label-width="150px" :rules="rules" ref="form">
        <el-form-item label="付款金额：" prop="amount">
          <el-input v-model="payform.amount" style="width:400px;" placeholder="0.00"></el-input>
        </el-form-item>
        <el-form-item label="付款账户名：">
          <el-input v-model="payform.accountName" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="付款银行号：">
          <el-input v-model="payform.bankNo" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="payform.memo" style="width:400px;" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paydialog = false">取 消</el-button>
        <el-button type="primary" @click="pay">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatString } from "@/utils";
import {
  count,
  payableList,
  unpaidList,
  pendingList,
  completedList,
  paypurchase
} from "@/api/payment/invoiceGroup";
import TableHead from "@/components/common/TableHead/tablehead"
export default {
  inject: ["reload", "TableMoney"],
  name:'GroupBuy',
  data() {
    return {
      paydialog: false,
      payform: {
        name: "",
        amount: null,
        accountName: null,
        bankNo: null,
        memo: null
      },
      PurchaseBillId: null,
      ReceivablePayableId: null,
      amountStart: null,
      amountEnd: null,
      cancellation: false,
      billNo: null,
      time: null,
      organizations: [],
      organizationId: null,
      status: 0,
      tableData: [],
      statusBag: {},
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
      pageSize:10,
      rules: {
        amount: [{ required: true, message: "请填写付款金额", trigger: "blur" }]
      }
    };
  },
  components:{
    TableHead
  },
  created() {
    this.getList(1, 0);
    
  },
  activated() {
    if(this.$route.params.isUpdate){
      this.getList(1, 0);
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    handleSizeChange(val){
      this.pageSize = val
       this.getList(1, this.status);
    },
    pay() {
      this.$refs.form.validate(valid => {
        if (valid) {
          paypurchase({
            accountName: this.payform.accountName,
            amount: this.payform.amount,
            bankNo: this.payform.bankNo,
            centralPurchaseBillId: this.PurchaseBillId,
            centralPurchaseReceivablePayableId: this.ReceivablePayableId,
            memo: this.payform.memo
          }).then(res => {
            if (res.code == "000000") {
              this.$message({
                type: "success",
                message: "付款成功!"
              });
              this.reload();
            }
          });
        }
      });
    },
    cancelOpen(id) {
      this.cancellation = true;
      this.cancelId = id;
      groupDetail(id).then(res => {
        this.invoiceApplicationDTO = res.data;
      });
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
    gopay(row) {
      this.PurchaseBillId = row.centralPurchaseBillId;
      this.ReceivablePayableId = row.centralPurchaseReceivablePayableId;
      this.paydialog = true;
      this.payform = {
        name: "",
        amount: null,
        accountName: null,
        bankNo: null,
        memo: null
      }
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
    goDetail(id) {
      this.$router.push({
        name: "CollectPurchaseDetail",
        query: {
          id: id
        }
      });
    },
    handleCurrentChange(val) {
      this.getList(val, this.status);
    },
    getList(page, status) {
      this.status = status;
      count().then(res => {
      if (res.code == "000000") {
        this.statusBag = res.data;
      }
    });
      var data = {
        endTime: this.time ? this.time[1] : null,
        pageNum: page,
        pageSize: this.pageSize,
        startTime: this.time ? this.time[0] : null,
        amountStart: this.amountStart,
        amountEnd: this.amountEnd,
        billNo: this.billNo == "" ? null : this.billNo
      };
      if (status == 0) {
        payableList(data).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 1) {
        unpaidList(data).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 2) {
        pendingList(data).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
          }
        });
      } else if (status == 3) {
        completedList(data).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.total = res.data.total;
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
    margin: 10px 0 0 0;
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
    }
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
