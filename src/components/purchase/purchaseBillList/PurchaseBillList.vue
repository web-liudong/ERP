<template>
  <div class="billListBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active: isClick == 0}"
        @click="changeTab(0)"
      >全部 （{{buttonList.totalCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isClick == 5}"
        @click="changeTab(5)"
      >待提交（{{buttonList.submitCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isClick == 1}"
        @click="changeTab(1)"
      >待审批（{{buttonList.approvalCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isClick == 2}"
        @click="changeTab(2)"
      >已驳回（{{buttonList.rejectCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isClick == 3}"
        @click="changeTab(3)"
      >已通过（{{buttonList.passCount}}）</el-button>
      <el-button
        size="small"
        :class="{active: isClick == 4}"
        @click="changeTab(4)"
      >已取消（{{buttonList.cancelCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="serchBoxTop">
        <div class="topLeft">
          <span class="iconfont iconsousuo"></span>
          <p>筛选查询</p>
        </div>
        <div class="topRight">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">展开筛选</i>
          </span>
          <el-button size="small" @click="reset()">重置</el-button>
          <el-button size="small" @click="select">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-show="isShow">
          <div class="inputBox">
            <span>结算单编号：</span>
            <el-input placeholder="请输入结算单编号" v-model="findParam.billNo" clearable></el-input>
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
            <span>供应商：</span>
            <el-select
              v-model="findParam.supplierName"
              remote
              filterable
              clearable
              placeholder="请输入供应商名称"
              :remote-method="supplierMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in supplierNames"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>制单员：</span>
            <el-input placeholder="请输入制单员姓名" v-model="findParam.creatorName" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>付款类型：</span>
            <el-select v-model="findParam.paymentMode" clearable placeholder="全部">
              <el-option
                v-for="item in paymentModes"
                :key="item.type"
                :label="item.label"
                :value="item.type"
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
        <div class="listRight">
          <el-button size="small" @click="BillExport" v-if="$authorities.PurchaseBillExport">
            <i class="iconfont icondaochu"></i>
            <span>导出</span>
          </el-button>
          <el-button size="small" @click="createBillList" v-if="$authorities.PurchaseBillCreate">
            <i class="iconfont iconzengjia"></i>
            <span>新建</span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table :data="tableData" border style="width: 100%" :header-cell-style="tableStyle" :max-height="dataListHeight"> 
          <el-table-column prop="billNo" label="结算单编号" align="center" width="150"></el-table-column>
          <el-table-column prop="createTime" label="创建日期" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="结算单名称" align="center"></el-table-column>
          <el-table-column prop="amount" label="结算单金额" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.amount!=''&&scope.row.amount!=null">￥</span>
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
          <el-table-column prop="creatorName" label="制单员" align="center"></el-table-column>
          <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="paymentModeText" label="付款类型" align="center"></el-table-column>
          <el-table-column prop="purchaseBillStatusText" label="状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="toSubmitApprovalList(scope.row)"
                v-if="scope.row.purchaseBillStatusText=='待审批'&&$authorities.PurchaseBillApproval"
              >审批</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(scope.row.purchaseBillStatusText=='待提交'||scope.row.purchaseBillStatusText=='已驳回')&&$authorities.PurchaseBillEditer"
                @click="openWin('editerPurchaseBillList',{'id':scope.row.id})"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="submitApproval(scope.row)"
                v-if="scope.row.purchaseBillStatusText=='待提交'&&$authorities.PurchaseBillToApproval"
              >提交审批</el-button>
              <el-button
                type="text"
                size="small"
                @click="openWin('PurchaseBillListDetail',{'id': scope.row.id})"
                v-if="$authorities.PurchaseBillDetail"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="cancelApproval(scope.row)"
                v-if="scope.row.purchaseBillStatusText!='已通过'&&scope.row.purchaseBillStatusText!='已取消'&&$authorities.PurchaseBillCancel"
              >取消</el-button>
              <!-- <el-button type="text" size="small" @click="inputInvoice">录入发票</el-button> -->
              <!-- <el-button type="text" size="small">提交发票审核</el-button> -->
              <el-button
                type="text"
                size="small"
                v-if="scope.row.purchaseBillStatusText=='已通过'&&scope.row.paymentModeText=='预付'&&$authorities.PurchaseBillEditerInvoice"
                @click="EditInvoice(scope.row.id)"
              >编辑发票信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="findParam.pageNum"
          :page-size="findParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
  </div>
</template>

<script>
import {
  statusCount,
  listAll,
  listCommit,
  listReject,
  listPass,
  listCancel,
  findSupplierNameList,
  findUserNameList,
  allExport,
  approvalExport,
  rejectExport,
  passExport,
  cancelExport,
  toSubmission,
  toSubmitApproval,
  cancelApprovalList,
  submissionExport
} from "@/api/purchase/purchaseBillList";
export default {
  inject: ["reload", "isFilterShow"],
  name: "PurchaseManage",
  data() {
    return {
      buttonList: [],
      isClick: 0,
      isShow: this.isFilterShow,
      dataTime: null,
      total: 0,
      loading: false,
      supplierNames: [],
      creatorNames: [],
      //查询对象
      findParam: {
        billNo: null, //采购结算单编号
        createTimeEnd: null, //结束时间
        createTimeStart: null, //开始时间
        creatorName: null, //制单员
        // invoiceStatus: null, //发票状态：{1:待提交, 2:审核中,3已通过,4,未通过}
        pageNum: 1, //页码
        pageSize: 10, //每页大小
        paymentMode: null, //结款方式：{1:预付, 2:非预付}
        supplierName: null //供应商名称
      },
      //选择结款方式
      paymentModes: [
        {
          type: "PAY_IN_ADVANCE",
          label: "预付"
        },
        {
          type: "NO_PAY_IN_ADVANCE",
          label: "非预付"
        }
      ],

      //表格table
      tableData: [],
      //表头样式
      tableStyle: {
        background: "#f5f7fa"
      }
    };
  },
  created() {
    console.log(this.$authorities.PurchaseBillExport, 5555);
    this.statusCount();
    this.changeTab(0);
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.statusCount();
      this.changeTab(0);
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset() {
      this.findParam.billNo = null; //采购结算单编号
      this.dataTime = null;
      this.findParam.createTimeStart = null;
      this.findParam.createTimeEnd = null;
      this.findParam.creatorName = null; //制单员
      this.findParam.pageNum = 1; //页码
      this.findParam.pageSize = 10; //每页大小
      this.findParam.paymentMode = null; //结款方式：{1 = 预付; 2 = 非预付}
      this.findParam.supplierName = null; //供应商名称
      this.changeTab(this.isClick);
    },
    //获取顶部button的数量个状态
    statusCount() {
      statusCount().then(res => {
        if (res.code === "000000") {
          this.buttonList = res.data;
        }
      });
    },
    //提交审批
    submitApproval(row) {
      this.$confirm("确认提交结算单审核？", "提交审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          toSubmitApproval(row.id).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "提交审批成功",
                type: "success"
              });
              this.changeTab(this.isClick);
              this.statusCount();
            }
          });
        })
        .catch(() => {});
    },
    //审核
    toSubmitApprovalList(row) {
      this.$router.push({
        name: "AuditePurchaseBillList",
        query: { id: row.id }
      });
    },
    //取消
    cancelApproval(row) {
      this.$confirm("确认取消该结算单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancelApprovalList(row.id).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "取消结算单成功",
                type: "success"
              });
              this.changeTab(this.isClick);
              this.statusCount();
            }
          });
        })
        .catch(() => {});
    },
    change(val){
      this.findParam.createTimeStart = this.dataTime ? this.dataTime[0] : null;
      this.findParam.createTimeEnd = this.dataTime ? this.dataTime[1] : null;
      console.log(val, "oooopp");
      //获取全部结算列表
     if (val == 0) {
        console.log(this.findParam, "909090");
        listAll(this.findParam).then(res => {
          if (res.code == "000000") {
            console.log(this.tableData, "whp");
            this.tableData = res.data.items;
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
      }
      if (val == 1) {
        console.log(this.findParam, "909090");
        listCommit(this.findParam).then(res => {
          console.log(res, "2222");
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
      }
      if (val == 2) {
        console.log(this.findParam, "909090");
        listReject(this.findParam).then(res => {
          console.log(res, "3333");
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
      }
      if (val == 3) {
        console.log(this.findParam, "909090");
        listPass(this.findParam).then(res => {
          console.log(res, "4444");
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
      }
      if (val == 4) {
        listCancel(this.findParam).then(res => {
          console.log(res, "5555");
          if (res.code == "000000") {
            this.tableData = res.data.items;
            // this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
      }
      if (val == 5) {
        console.log(this.findParam, "909090");
        toSubmission(this.findParam).then(res => {
          console.log(res, "3333");
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
          }
        });
      }
    },
    //改变按钮
    changeTab(val) {
      this.isClick = val;
      this.findParam.pageNum=1;
     
      
      this.statusCount();
      this.change(val)
    },
    //查询结果
    select() {
      this.changeTab(this.isClick);
    },
    //供应商模糊查询
    supplierMethod(query) {
      if (query !== "") {
        this.loading = true;
        findSupplierNameList({ name: query }).then(res => {
          this.loading = false;
          console.log(res, "998");
          this.supplierNames = res.data;
        });
      } else {
        this.supplierNames = [];
      }
    },
    //制单员模糊查询
    creatorNameMethod(query) {
      findUserNameList({ userName: query }).then(res => {
        if (query !== "") {
          this.creatorNames = res.data;
        } else {
        }
      });
    },
    BillExport() {
      this.findParam.createTimeStart = this.dataTime ? this.dataTime[0] : null;
      this.findParam.createTimeEnd = this.dataTime ? this.dataTime[1] : null;
      // allExport, , , , ;
      if (this.isClick == 0) {
        allExport(this.findParam).then(res => {
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }
        });
      }
      if (this.isClick == 1) {
        approvalExport(this.findParam).then(res => {
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }
        });
      }
      if (this.isClick == 2) {
        rejectExport(this.findParam).then(res => {
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }
        });
      }
      if (this.isClick == 3) {
        passExport(this.findParam).then(res => {
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }
        });
      }
      if (this.isClick == 4) {
        cancelExport(this.findParam).then(res => {
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }
        });
      }
      if (this.isClick == 5) {
        submissionExport(this.findParam).then(res => {
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }
        });
      }
    },
    downfile(id) {
      let href =
        "/api/file-service/file/download?id=" +
        id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    },
    //新建采购结算单
    createBillList() {
      this.$router.push({ name: "PurchaseCreateBillList" });
    },
    EditInvoice(id) {
      this.$router.push({ name: "EditInvoicePur", query: { id: id } });
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
      this.change(this.isClick);
      this.statusCount()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findParam.pageSize = val;
      this.change(this.isClick);
      this.statusCount()
    },
  }
};
</script>
<style scoped>
.billListBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
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
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    .serchBoxTop {
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      .topLeft {
        display: flex;
        span {
          padding: 0 5px 0 20px;
        }
      }
      .topRight {
        display: flex;
        align-items: center;
        &:last-child {
          margin-right: 20px;
        }
        .el-button {
          margin-left: 10px;
          i {
            padding-right: 5px;
          }
        }
      }
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
  .block {
    margin: 5px;
    text-align: right;
   }
}
</style>
