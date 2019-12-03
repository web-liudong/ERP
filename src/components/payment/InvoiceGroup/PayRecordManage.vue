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
      >审核中（{{statusBag.underReviewCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:status===2}"
        @click="getList(1,2)"
      >已通过（{{statusBag.passedCount}}）</el-button>
      <el-button
        size="small"
        :class="{active:status===3}"
        @click="getList(1,3)"
      >已驳回（{{statusBag.rejectedCount}}）</el-button>
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
      <table-head headname="数据列表"></table-head> 
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight">
        <el-table-column prop="createTime" label="付款日期" align="center"></el-table-column>
        <el-table-column prop="amount" label="付款金额" align="center" :formatter="TableMoney"></el-table-column>
        <el-table-column prop="creatorName" label="操作员" align="center"></el-table-column>
        <el-table-column prop="billNo" label="对应结算单编号" align="center"></el-table-column>
        <el-table-column prop="accountName" label="付款账户名" align="center"></el-table-column>
        <el-table-column prop="bankNo" label="付款银行号" align="center"></el-table-column>
        <el-table-column prop="memo" label="备注" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status=='UNDER_REVIEW'?'审核中':scope.row.status=='PASSED'?'已通过':'已驳回'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="gopay(scope.row)" v-if="scope.row.status=='UNDER_REVIEW'||scope.row.status=='REJECTED'">编辑</el-button>
            <el-button type="text" size="small" @click="reject(scope.row.id)" v-if="scope.row.status=='REJECTED'">查看驳回原因</el-button>
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
    <el-dialog :visible.sync="dialogReject" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">驳回</span>
      </div>
      <div class="reject-reason">驳回原因：{{rejectReason}}</div>
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
import {recordList,recorCount,reviewList,passedList,rejectedList,paypurchase,updatePurchase,rejectReason} from "@/api/payment/invoiceGroup";
import TableHead from "@/components/common/TableHead/tablehead"
export default {
  inject: ["reload", "TableMoney"],
  name:'PayRecord',
  data() {
    return {
      paydialog: false,
      payform: {
        amount: null,
        accountName:null,
        bankNo:null,
        memo:null
      },
      updateId:null,
      PurchaseBillId:null,
      ReceivablePayableId:null,
      amountStart: null,
      amountEnd: null,
      billNo: null,
      time: null,
      organizations: [],
      organizationId: null,
      status: 0,
      tableData: [],
      statusBag:{},
      page: 1,
      total: 0,
      isShow: true,
      dialogReject: false,
      rejectReason: "",
      invoicecount: 0,
      cancelId: null,
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
      this.pageSize = val;
      this.getList(1, this.status);
    },
    reject(id){
      this.dialogReject = true;
      rejectReason(id).then(res=>{
        if(res.code=='000000'){
          this.rejectReason = res.data
        }
      })
    },
    pay() {
      this.$refs.form.validate((valid)=>{
        if(valid){
          updatePurchase(this.updateId,{
            accountName:this.payform.accountName,
            amount: this.payform.amount,
            bankNo:this.payform.bankNo,
            memo: this.payform.memo
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: "success",
                message: "编辑成功!"
              });
              this.reload();
            }
          });
        }
      })
    },
    gopay(row) {
      this.updateId = row.id;
      this.paydialog = true
      this.payform.bankNo = row.bankNo
      this.payform.accountName = row.accountName
      this.payform.memo = row.memo
      this.payform.amount = row.amount
    },
    handleCurrentChange(val) {
      this.getList(val, this.status);
    },
    getList(page, status) {
      this.status = status;
      recorCount().then(res=>{
      if(res.code=='000000'){
        this.statusBag = res.data;
      }
    })
      var data = {
        endTime: this.time ? this.time[1] : null,
        pageNum: page,
        pageSize: this.pageSize,
        startTime: this.time ? this.time[0] : null,
        amountStart: this.amountStart,
        amountEnd: this.amountEnd,
        billNo: this.billNo == "" ? null : this.billNo
      };
      if(status==0){
          recordList(data).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.page = res.data.pageNum
        }
      });
      }else if(status==1){
         reviewList(data).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.page = res.data.pageNum
        }
      });
      }else if(status==2){
        passedList(data).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.page = res.data.pageNum
        }
      });
      }else if(status==3){
          rejectedList(data).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.page = res.data.pageNum
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
    .reject-reason{
      min-height: 150px;
    }
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
    margin-top:2px;
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
