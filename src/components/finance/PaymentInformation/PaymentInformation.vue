<template>
  <div class="PaymentInformation">
    <div class="buttonBox">
      <el-button
        size="small"
        @click="getList(1,item.status)"
        v-for="(item,index) in statusbag"
        :key="index"
        :class="{active:isActive == item.status}"
      >{{item.statusName}}({{item.statusCount}})</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo "></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
         <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" class="w80 h40" @click="reset()" style="margin-left:10px">重置</el-button>
          <el-button size="small" class="w80 h40" @click="getList(1,isActive)">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-show="isShow">
        <ul>
          <li>
            <span class="span1">回款信息编号:</span>
            <el-input placeholder="回款信息编号" v-model="PaymentInformationNumberID" clearable></el-input>
          </li>
          <li>
            <span class="span1">对方户名:</span>
            <el-input placeholder="对方户名" v-model="otherNameOtherName" clearable></el-input>
          </li>
          <li>
            <span class="span1">推送状态:</span>
            <el-select v-model="pushStatus" placeholder="推送状态">
              <el-option v-for="item in pushStatuss" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </li>
          <li>
            <span class="span1">组织机构:</span>
            <el-select
              v-model="organizationitem"
              filterable
              remote
              clearable
              placeholder="组织机构"
              :loading="loading"
              :remote-method="onOrganizationChange"
            >
              <el-option
                v-for="item in organizationOrganization"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <li>
            <span class="span1">流水号:</span>
            <el-input placeholder="流水号" v-model="serialNumber" clearable></el-input>
          </li>
        </ul>
        <div style="clear: both;"></div>
        <div class="input">
          <span class="span1">回款金额:</span>
          <el-input placeholder="0.00" v-model="RemittanceMinimum" clearable>
            <i slot="prefix">￥</i>
          </el-input>
          <span class="sapn2">——</span>
          <el-input placeholder="0.00" v-model="RemittanceMaximum" clearable>
            <i slot="prefix">￥</i>
          </el-input>
        </div>
        <div class="picker">
          <span>记账时间范围:</span>
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="截止日期"
          ></el-date-picker>
        </div>
        <div style="clear: both;"></div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxLeft">
          <i class="iconfont iconjinridingdanshu "></i>
          <span>数据列表</span>
          <span style="color: red">回款总额:￥{{fortotalnum(totalnum)}}</span>
        </div>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" style="width: 80px" @click="payexport" v-if="$authorities.ReturnMoneyExport">
            <i class="iconfont icondaochu"></i>导出
          </div>
          <div class="white-btn fun-btn" style="width: 120px" @click="transfer" v-if="$authorities.ReturnMoneyPush">
            <i class="iconfont icondaochu"></i>推送至认款列表
          </div>

          <div class="white-btn fun-btn" style="width: 80px" @click="showDialog('importFile')" v-if="$authorities.ReturnMoneyImport">
            <i class="icondaoru iconfont button-head-icon icon-add"></i>导入
          </div>
          <router-link
            :to="{name:'CommodityImportRecord',query:{type:'returned-money-import-list'}}"
            
          >
            <div class="white-btn fun-btn" style="width: 80px" v-if="$authorities.ReturnMoneyImportRecord">
              <i class="iconfont iconjinridingdanshu "></i>导入记录
            </div>
          </router-link>
          <router-link 
          :to="{name:'PaymentInformationAdd'}">
            <div class="white-btn fun-btn" style="width: 80px" v-if="$authorities.ReturnMoneyAdd">
              <i class="iconzengjia iconfont"></i>添加
            </div>
          </router-link>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
        :max-height="dataListHeight"
      >
        <el-table-column type="selection" fixed></el-table-column>
        <el-table-column prop="paymentReceivedNo" label="回款信息编号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="organizationName" label="组织机构" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="记账时间" prop="keepingAccountsDate" align="center" :formatter="format" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="回款金额"
          prop="receivedAmount"
          align="center"
          :formatter="receivedAmount"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="对方户名" prop="accountName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="对方账户" prop="accountNo" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="用途" prop="uses" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属省份" prop="provinceName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="服务项目" prop="projectName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="statusName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="推送状态" prop="pushStatusName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" min-width="120px" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                v-if="(scope.row.pushStatusName=='未推送'&&scope.row.statusName=='待认款')&&$authorities.ReturnMoneyList"
                type="text"
                size="small"
                @click="goNext(scope.row)"
              >推送至认款列表</el-button>
              <el-button
                v-if="scope.row.pushStatusName=='已推送'&&$authorities.ClaimBackPaymentr"
                type="text"
                size="small"
                @click="backPayment(scope.row)"
              >撤销推送</el-button>
              <el-button
                v-if="(scope.row.pushStatusName=='未推送'&&scope.row.statusName=='待认款')&&$authorities.ReturnMoneyConfirm"
                type="text"
                size="small"
                @click="goRecognize(scope.row)"
              >认款</el-button>
              <el-button
                v-if="(scope.row.pushStatusName=='未推送'&&scope.row.statusName=='待认款')&&$authorities.ReturnMoneyEdit"
                type="text"
                size="small"
                @click="goEdit(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="(scope.row.statusName!='已完成'&&scope.row.pushStatusName!='已推送'&&scope.row.statusName!='已删除')&&$authorities.ReturnMoneyDelete"
                type="text"
                size="small"
                @click="goDelete(scope.row)"
              >删除</el-button>
              <el-button type="text" size="small" @click="goDetails(scope.row)" v-if="$authorities.ReturnMoneyDetail">详情</el-button>
              <el-button
                v-if="scope.row.statusName=='已完成'&&$authorities.ReturnMoneyBack"
                type="text"
                size="small"
                @click="change(scope.row.id)"
              >撤销认款</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog title="推送提示" :visible.sync="goNextVisible" width="500px">
        <div slot="title" class="dialog-title">
        <span class="reject-title">推送提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">推送后，数据将进入服务方认款列表。确定推送吗</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goNextVisible = false">取 消</el-button>
        <el-button type="primary" @click="opengoNext()">确 定</el-button>
      </div>
      </el-dialog>
      <el-dialog title="删除提示" :visible.sync="goDeleteVisible" width="400px">
        <div slot="title" class="dialog-title">
        <span class="reject-title">删除提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">是否删除该回款信息？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="opengoDelete()">确 定</el-button>
      </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogAffirm" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">退回提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">撤销推送后，服务方不可见该数据。确定要撤销吗</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAffirm = false">取 消</el-button>
        <el-button type="primary" @click="dialogAffirm=false,putClaimBackPaymentrReceived()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogChangeHint" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          <div class="first-step-box">您要操作的数据信息已发生变化，请刷新列表后重试</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogChangeHint = false">确 定</el-button>
      </div>
    </el-dialog>
      <importFile
        ref="importFile"
        :title="'回款信息批量导入'"
        type="back-money-import"
        @callback="dialogCallback"
        :params="{type:'Category_Template'}"
      ></importFile>
    </div>
  </div>
</template>
<script>
// 注入接口
import {
  PaymentInformation,
  pushdata,
  organizationSelect,
  deletedata,
  paymentexport,
  revokeclaim,
  StatusCount
} from "@/api/finance/PaymentInformation";
import importFile from "@/components/common/module/ImportFile";
import { downloadFile, returnFloat } from "@/utils";
import {
    putClaimBackPaymentrReceived
  } from '@/api/payment/claimList'
export default {
  name: "PaymentInformation",
  inject: ["reload","isFilterShow",'close'], //注入依赖
  data() {
    return {
      dialogChangeHint:false,
      statusbag: [],
      formatdatetime:"",
      formatdatetime1:"",
      formatdatetime0:"",
      total: 1,
      serialNumber:"",
      loading: false,
      goNextVisible: false,
      goDeleteVisible: false,
      PaymentInformationNumberID: "",
      otherNameOtherName: "",
      pushStatus:null,
      accountName: "",
      organizationitem: "",
      pushStatuss: [
        {
          name:'全部',
          id:2
        },
        {
          name:'未推送',
          id:0
        },
        {
          name:'已推送',
          id:1
        }
      ],
      organizationOrganization: [],
      RemittanceMinimum: "",
      RemittanceMaximum: "",
      isActive: -1,
      isShow: this.isFilterShow,
      totalnum: "",
      total: 0,
      pageSize: 10,
      dateTime: "",
      tableData: [],
      delete: "",
      id: "",
      arr: [],
      page:1,
      dialogAffirm: false,
      dialogAffirmID: '',
    };
  },
  components: {
    importFile
  },
  activated() {
    if(this.$route.params.isUpdate){
      this.getList(1,-1);
    StatusCount().then(res => {
      if (res.code == "000000") {
        this.statusbag = res.data;
      }
    });
    }
  },
  created() {
    this.getList(1,-1);
    StatusCount().then(res => {
      if (res.code == "000000") {
        this.statusbag = res.data;
      }
    });
  },
  computed:{
       dataListHeight(){
         return this.$store.getters.dataListHeight;
       }
     },
  methods: {
    reset(){
        this.otherNameOtherName="",
        this.serialNumber="",
        this.RemittanceMaximum="",
        this.RemittanceMinimum="",
        this.dateTime="",
        this.organizationitem="",
        this.PaymentInformationNumberID="",
        this.pushStatus==2?null:this.pushStatus="",
        this.getList(1,-1)
    },
    //点击退回
      backPayment(row) {
        this.dialogAffirm = true;
        this.dialogAffirmID = row.id;
      },
      //退回至回款信息列表
      putClaimBackPaymentrReceived() {
        putClaimBackPaymentrReceived(
          this.dialogAffirmID
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '退回至回款信息列表成功',
                type: "success",
              });
              this.reload();
            } else {
              this.dialogChangeHint = true
            }
          }).catch(err => {
          if (err.code == '270055') {
            this.dialogChangeHint = true
          }
        });
      },
      addDateZero(num) {
        return (num < 10 ? "0" + num : num);
    },
    datatimechange(val){
      let d = new Date(val);
      this.formatdatetime= d.getFullYear() + '-' + this.addDateZero(d.getMonth() + 1) + '-' + this.addDateZero(d.getDate());
    },
    getList(page,status) {
      this.isActive = status
      console.log(1231213,this.dateTime)
      if (this.dateTime!=""&&this.dateTime!=null) {
        this.datatimechange(this.dateTime[1])
      this.formatdatetime1=this.formatdatetime
      this.datatimechange(this.dateTime[0])
      this.formatdatetime0=this.formatdatetime
    }else{
      this.formatdatetime1=""
      this.formatdatetime0=""
    }
      
      PaymentInformation({
        accountName: this.otherNameOtherName,
        afterReceivedAmount: this.RemittanceMaximum,
        beforeReceivedAmount: this.RemittanceMinimum,
        endKeepingAccountsDate:  this.formatdatetime1,
        organizationId: this.organizationitem,
        pageNum: page,
        pageSize: this.pageSize,
        paymentReceivedNo: this.PaymentInformationNumberID,
        pushStatus: this.pushStatus==2?null:this.pushStatus,
        startKeepingAccountsDate:  this.formatdatetime0,
        tab: this.isActive==-1?null:this.isActive,
        serialNumber: this.serialNumber
      }).then(res=>{
        if(res.code=='000000'){
          console.log(res)
          this.totalnum = res.data.totalAmount;
          this.tableData = res.data.pageInfo.items;
          console.log(111111,res.data.pageInfo.total)
          this.total = res.data.pageInfo.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList(val,this.isActive)
    },
    handleSizeChange(val) {
        this.pageSize=val;
        this.getList()
      },
    payexport() {
      if(this.tableData.length){
        paymentexport({
        accountName: this.otherNameOtherName,
        afterReceivedAmount: this.RemittanceMaximum, 
        beforeReceivedAmount: this.RemittanceMinimum,
        endKeepingAccountsDate: this.dateTime[1],
        organizationId: this.organizationitem,
        pageNum: this.page,
        pageSize:this.pageSize,
        paymentReceivedNo: this.PaymentInformationNumberID,
        pushStatus: this.pushStatus==2?null:this.pushStatus,
        startKeepingAccountsDate: this.dateTime[0],
        tab: this.isActive==-1?null:this.isActive
      }).then(res => {
        downloadFile(res);
      });
      }else{
         this.$message.error('无导出数据');
         return false;
      }
    },
    change(id) {
      this.$confirm(
        "撤销认款后，相关订单已核销的应收账款将退回确定要取消认款吗?",
        "撤销认款提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        revokeclaim(id).then(res => {
          if (res.code == "000000") {
            this.reload();
          }
        });
      });
    },
    fortotalnum(val) {
      return returnFloat(val);
    },
    receivedAmount(row) {
      return "￥" + returnFloat(row.receivedAmount);
    },
    format(row) {
      return row.keepingAccountsDate.substring(0, 10);
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(type) {
      this.$message({
        type: "success",
        message: "上传成功，前台已同步更新!"
      });
      this.reload();
    },
    
    goEdit(row) {
      // const { href } = this.$router.resolve({
      //   name: "PaymentInformationEdit",
      //   query: {
      //     id: row.id
      //   }
      // });
      // window.open(href, "_blank");
      this.$router.push({
        name: "PaymentInformationEdit",
        query: { id: row.id}
      });
    },
    onOrganizationChange(query) {
      if (query) {
        this.loading = true;
        organizationSelect({
          name: query,
          pageNum: 1,
          pageSize: this.pageSize,
          status: "AVAILABLE"
        }).then(res => {
          this.loading = false;
          this.organizationOrganization = res.data;
        });
      }
    },
    
    handleSelectionChange(val) {
      this.arr = [];
      for (var i = 0; i < val.length; i++) {
        this.arr.push(val[i].id);
      }
    },
    goNext(val) {
      this.arr = [];
      this.arr.push(val.id);
      this.goNextVisible = true;
    },
    transfer() {
      if (this.arr.length != 0) {
        this.goNextVisible = true;
      } else {
        this.$message({
          showClose: false,
          message: "<p>未选择任何数据,请勾选相关回款信息后进行推送</p>",
          dangerouslyUseHTMLString: true,
          type: "warning",
          center: true
        });
      }
    },
    opengoNext() {
      pushdata(this.arr).then(res => {
        this.goNextVisible = false;
        this.$message({
          showClose: false,
          message: "<p>推送成功,数据已成功推送至认款列表</p>",
          dangerouslyUseHTMLString: true,
          type: "success",
          center: true
        });
        this.reload();
      });
    },
    goRecognize(row) {
      // const { href } = this.$router.resolve({
      //   name: "FinancialRecognitionOperation",
      //   query: {
      //     id: row.id
      //   }
      // });
      // window.open(href, "_blank");
      this.$router.push({
        name: "FinancialRecognitionOperation",
        query: { id: row.id}
      });

    },
    goDelete(val) {
      this.delete = val.id;
      this.goDeleteVisible = true;
    },
    // 删除弹出框的确认按钮
    opengoDelete() {
      deletedata(this.delete).then(res => {
        if(res.code=='000000'){
          this.reload();
        }
      });
    },
    goDetails(row) {
      // const { href } = this.$router.resolve({
      //   name: "PaymentInformationDetails",
      //   query: {
      //     id: row.id
      //   }
      // });
      // window.open(href, "_blank");
      this.$router.push({
        name: "PaymentInformationDetails",
        query: { id: row.id}
      });
    }
  }
};
</script>
<style scoped>
.PaymentInformation >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
<style lang="less" scoped>
.el-dialog__header {
  padding: 0px;
  height: 60px;
  padding-bottom: 0;
  background: #e4e4e4;
  line-height: 60px;
  padding-left: 10px;
}
</style>
<style scoped lang="less">
.block {
  height: 30px;
  display: flex;
  line-height: 20px;
  // font-size: 13px;
  box-sizing: border-box;
  margin-top: 3px;
  border: 1px solid #e4e4e4;
  border-top: none;
  justify-content: flex-end;
}
.PaymentInformation {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .el-button {
    }
    .active {
        background-color: #339999;
        border-color: #339999;
        color: #FFFFFF;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0 10px 0;
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
      .myicon {
        font-weight: bold;
        color: #666;
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
      .myicon {
        color: #999;
        font-size: 10px;
      }
      span{
          color:#333;
          font-size: 14px;
        }
    }
  }
  // .el-button {
  //   height: 30px;
  //   margin: 10px 10px 0 10px;
  // }
  .homeBoxBottom {
    padding-bottom: 40px;
    height: auto;
    background-color: #fff;
    border-top: 1px solid #e4e4e4;
    margin-top: -2px;
    ul {
      li {
        float: left;
        margin-left: 15px;
        padding-top: 10px;
        .el-select {
          width: 200px;
          height: 40px;
          line-height: 56px;
        }
        .el-input {
          width: 200px;
          height: 40px;
          line-height: 56px;
        }
      }
    }
    .input {
      float: left;
      margin-top: 20px;
      .span1 {
        margin-left: 15px;
      }
      .span2 {
        margin: 0;
        padding: 0;
      }
      .el-input {
        width: 100px;
        height: 40px;
        line-height: 56px;
        i {
          // font-weight: bold;
          font-size: 17px;
          // color: #000;
        }
      }
    }
    .picker {
      // margin-left: 30px;
      padding-top: 28px;
      float: left;
      span {
        margin-left: 10px;
      }
      .el-date-picker {
        width: 200px;
        height: 40px;
        line-height: 56px;
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin-top: 10px;
    clear: both;
    // margin: 20px 0 0 0;
    // .el-button{
    //   padding:4px 0;
    //   margin: 0;
    // }
    .listBoxTop {
      height: 50px;
      display: flex;
      justify-content: space-between;
      .listBoxLeft {
        margin-left: 15px;
        .myicon {
          font-weight: bold;
          color: #666;
          font-size: 20px;
          line-height: 50px;
          margin-left: 20px;
        }
        span {
          margin-left: 5px;
          font-size: 14px;
          color: #303133;
          line-height: 50px;
        }
      }
      .listBoxRight {
        div {
          height: 30px;
          margin-top: 10px;
          line-height: 30px;
          margin-right: 5px;
          width: 110px;
          .iconfont {
            color: #666;
            font-size: 14px;
            line-height: 30px;
            margin-right: 3px;
          }
        }
      }
    }
  }
}
</style>
