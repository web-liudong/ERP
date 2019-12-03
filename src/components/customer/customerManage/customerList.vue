<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:customerstatus==4}"
        @click="switchType(4)"
      >可用（{{status[4]}}）</el-button>
      <el-button
        size="small"
        :class="{active:customerstatus==1}"
        @click="switchType(1)"
      >待审核（{{status[1]}}）</el-button>
      <el-button
        size="small"
        :class="{active:customerstatus==0}"
        @click="switchType(0)"
      >草稿（{{status[0]}}）</el-button>
      <el-button
        size="small"
        :class="{active:customerstatus==2}"
        @click="switchType(2)"
      >已驳回（{{status[2]}}）</el-button>
      <el-button
        size="small"
        :class="{active:customerstatus==5}"
        @click="switchType(5)"
      >已禁用（{{status[5]}}）</el-button>
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
          <el-button size="small" @click="search">查询结果</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="serch-icon" v-if="customerstatus==4">
            <span>客户编号：</span>
            <el-input placeholder="客户编号" v-model="customerId" clearable></el-input>
          </div>
          <div class="serch-icon">
            <span>客户名称：</span>
            <el-select
              v-model="customername"
              filterable
              remote
              clearable
              placeholder="客户名称"
              :remote-method="customerRemote"
              :loading="loading"
            >
              <el-option
                v-for="item in customernames"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="serch-icon">
            <span>客户性质：</span>
            <el-select v-model="customertype" placeholder="客户性质" clearable>
              <el-option
                v-for="(item,index) in customertypes"
                :key="index"
                :label="item.label"
                :value="item.type"
              ></el-option>
            </el-select>
          </div>
          <div class="serch-icon">
            <span>客户来源：</span>
            <el-select v-model="customerorigin" placeholder="客户来源" clearable>
              <el-option
                v-for="(item,index) in customerorigins"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="serch-icon">
            <span>所属项目：</span>
            <el-select
              v-model="customerproject"
              filterable
              clearable
              remote
              placeholder="所属项目"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in customerprojects"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="serch-icon">
            <div class="time-box">
              <span class="center-span">创建时间范围：</span>
              <el-date-picker v-model="startDate" type="date" placeholder="开始日期"></el-date-picker>
              <div class="center-span">至</div>
              <el-date-picker v-model="endDate" type="date" placeholder="截止日期"></el-date-picker>
            </div>
          </div>
          <div class="serch-icon">
            <span>客户乙方负责人：</span>
            <el-select
              v-model="userDataAuthorityId"
              filterable
              remote
              clearable
              placeholder="客户乙方负责人账号或姓名"
              :remote-method="remoteCustomery"
              :loading="loading"
              class="username-realname"
            >
              <el-option
                v-for="item in userDataAuthority"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div>
        <table-head headname="数据列表">
          <div>
            <el-button
              plain
              size="small"
              @click="importbutton('importFile')"
              v-if="$authorities.CustomerImportRelevant"
            >
              <i class="iconfont icondaoru"></i>导入
            </el-button>
            <el-button
              plain
              size="small"
              @click="gorecord"
              v-if="$authorities.CustomerImportRelevant"
            >
              <i class="iconfont iconxiaoshouxiadan"></i>导入记录
            </el-button>
            <el-button plain size="small" @click="addNew" v-if="$authorities.CustomerReleateAdd">
              <i class="iconfont iconzengjia"></i>添加
            </el-button>
          </div>
        </table-head>
      </div>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="客户编号" align="center">
          <template slot-scope="scope">
            <span v-if="customerstatus==4||customerstatus==5">{{scope.row.no}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="客户性质" align="center"></el-table-column>
        <el-table-column label="所属项目" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.projectNames}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userDataAuthorityId" label="客户乙方负责人" align="center"></el-table-column>
        <el-table-column prop="origin" label="客户来源" align="center"></el-table-column>
        <el-table-column prop="status" label="数据状态" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="address" label="设置" align="center">
          <template slot-scope="scope">
            <div v-if="customerstatus==4">
              <el-button type="text" @click="goinvoice(scope.row.id)" v-if="(scope.row.type!='军队' && $authorities.CustomerInvoiceInfo)">开票信息</el-button>
              <el-button
                type="text"
                v-if="(scope.row.type!='军队'&& scope.row.hasFlow)&&$authorities.CustomerApprove"
                @click="goProcess(scope.row.id)"
              >审批流</el-button>
            </div>
            <span v-if="scope.row.type=='军队'||customerstatus !==4">---</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <div v-if="customerstatus==0">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CustomerRelateDetail"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id)"
                v-if="$authorities.CustomerReleateEdit"
              >编辑</el-button>
              <el-button type="text" size="small" @click="gocheck(scope.row.id)">提审</el-button>
              <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId&&$authorities.CustomerRelateDetail"
              >原数据详情</el-button>
            </div>
            <div v-if="customerstatus==4">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CustomerRelateDetail"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id)"
                v-if="$authorities.CustomerReleateEdit"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="forbidden(scope.row.id)"
                v-if="$authorities.CustomerOpen"
              >禁用</el-button>
              <el-button
                type="text"
                size="small"
                @click="peopleManage(scope.row.id,scope.row.counterProjectId)"
                v-if="scope.row.type != '军队'&&$authorities.CustomerCreatePurchasing"
              >人员管理</el-button>
            </div>
            <div v-if="customerstatus==1">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CustomerRelateDetail"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="gopass(scope.row.id)"
                v-if="$authorities.CustomerInvoiceSubmit"
              >审核</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId&&$authorities.CustomerRelateDetail"
              >原数据详情</el-button>
            </div>
            <div v-if="customerstatus==2">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CustomerRelateDetail"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id)"
                v-if="!scope.row.oldId&&$authorities.CustomerReleateEdit"
              >编辑</el-button>
              <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId&&$authorities.CustomerRelateDetail"
              >原数据详情</el-button>
            </div>
            <div v-if="customerstatus==5">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CustomerRelateDetail"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="enable(scope.row.id)"
                v-if="$authorities.CustomerOpen"
              >启用</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="totally!=0">
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
    <importFile
      ref="importFile"
      :title="'客户信息批量导入'"
      :type="importType"
      @callback="dialogCallback"
      :params="{type:'customer-import'}"
    ></importFile>
  </div>
</template>
<script>
import {
  customerList,
  projectName,
  customers,
  activate,
  forbidden,
  customercount,
  submitReview,
  delCustomer,
  ownAuthority,
  customerName,
  checkPermission
} from "@/api/customerManage";
import { generalget } from "@/api/flowService";
import { simplelist } from "@/api/classManage";
import importFile from "@/components/common/module/ImportFile";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload"],
  name: "customermanage",
  data() {
    return {
      importType: "customer-import",
      status: {},
      userDataAuthority: [],
      userDataAuthorityId: null,
      totally: 1,
      loading: false,
      customernames: [],
      customername: null,
      customerprojects: [],
      customerproject: null,
      customerstatus: 4,
      customertypes: [
        {
          type: 7,
          label: "全部"
        },
        {
          type: 5,
          label: "军队"
        },
        {
          type: 4,
          label: "政府"
        },
        {
          type: 0,
          label: "央企"
        },
        {
          type: 1,
          label: "国企"
        },
        {
          type: 2,
          label: "外企"
        },
        {
          type: 3,
          label: "民企"
        },
        {
          type: 6,
          label: "事业单位"
        }
      ],
      customertype: null,
      customerorigins: [
        {
          value: 2,
          label: "全部"
        },
        {
          value: 0,
          label: "后台添加"
        },
        {
          value: 1,
          label: "商城API"
        }
      ],
      customerorigin: null,
      startDate: "",
      endDate: "",
      tableData: [],
      customerId: null,
      page: 1,
      name: null,
      total: 0,
      isShow: true,
      pageSize: 10
    };
  },
  created() {
    var that = this;
    if (this.$route.query.pid) {
      this.customerproject = this.$route.query.pid;
      this.getcustomercount(that.customerproject);
      this.customerprojects = [
        {
          name: this.$route.query.pname,
          id: this.customerproject
        }
      ];
    } else if (this.$route.query.status !== undefined) {
      this.customerstatus = this.$route.query.status;
    }
    this.getcustomer(1);
  },
  activated() {
    if (this.$route.query.pid) {
      this.customerproject = this.$route.query.pid;
      this.getcustomercount(this.customerproject);
      this.customerprojects = [
        {
          name: this.$route.query.pname,
          id: this.customerproject
        }
      ];
      this.getcustomer(1);
    }
    if (this.$route.params.isUpdate) {
      this.getcustomer(1);
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  components: {
    importFile,
    TableHead
  },
  methods: {
    reset() {
      this.getcustomercount(this.customerproject);
      this.endDate = null;
      this.customerId = null;
      this.customername = null;
      this.customerorigin = null;
      this.page = 1;
      this.pageSize = 10;
      this.startDate = null;
      this.customertype = null;
      this.userDataAuthorityId = null;
      if (!this.$route.query.pid) {
        this.customerproject = null;
      }
      customerList({
        pageNum: 1,
        pageSize: 10,
        status: this.customerstatus
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getcustomer(1);
    },
    gorecord() {
      this.$router.push({
        name: "customerrecord",
        query: { type: "customer-import-list" }
      });
    },
    dialogCallback(type) {
      this.$message({
        type: "success",
        message: "上传成功，前台已同步更新!"
      });
      this.reload();
    },
    importbutton(type) {
      this.$refs[type].init();
    },
    del(id) {
      this.$confirm(
        "删除之后，列表将不再展示该条数据，确定要删除吗？",
        "删除提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        delCustomer(id).then(res => {
          if (res.code == "000000" && res.data == 1) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
          this.reload();
        });
      });
    },
    goProcess(id) {
      generalget(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({
            name: "ApprovalProcess",
            query: { id: id }
          });
        }
      });
    },
    gopass(id) {
      this.$router.push({
        name: "customerCheck",
        query: { id: id }
      });
    },
    gocheck(id) {
      this.$confirm("确定当前填写的信息无误，可以提交审核？", "提审确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        submitReview(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "客户信息提交审核已成功!"
            });
            this.reload();
          }
        });
      });
    },
    customerRemote(query) {
      this.loading = true;
      if (query) {
        customerName(query).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.customernames = res.data;
          }
        });
      }
    },
    getcustomercount(customerproject) {
      customercount(customerproject).then(res => {
        this.status = res.data;
      });
    },
    remoteCustomery(query) {
      this.loading = true;
      if (query) {
        simplelist({
          count: 6,
          userName: query
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.userDataAuthority = res.data;
          }
        });
      }
    },
    switchType(val) {
      this.customerstatus = val;
      this.getcustomer(1);
    },
    remoteMethod(query) {
      this.loading = true;
      projectName({
        name: query
      }).then(res => {
        this.loading = false;
        if (res.code == "000000") {
          this.customerprojects = res.data;
        }
      });
    },
    enable(id) {
      this.$confirm(
        "启用之后，客户恢复正常，可新增订单，确定要启用吗？",
        "启用提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        activate(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "启用成功!"
            });
            this.getcustomer(this.page);
          } else if (/^98/.test(res.code) || /^01/.test(res.code)) {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
      });
    },
    forbidden(id) {
      this.$confirm("禁用之后，客户不可新增订单,确定要禁用吗？", "禁用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        forbidden(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "禁用成功!"
            });
            this.getcustomer(this.page);
          } else if (/^98/.test(res.code) || /^01/.test(res.code)) {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
      });
    },
    getcustomer(page) {
      this.getcustomercount(this.customerproject);
      customerList({
        endDate: this.endDate,
        no: this.customerId ? this.customerId : null,
        name: this.customername,
        origin: this.customerorigin == 2 ? null : this.customerorigin,
        pageNum: page,
        pageSize: this.pageSize,
        projectId: this.customerproject ? this.customerproject - 0 : null,
        startDate: this.startDate,
        status: this.customerstatus == 7 ? null : this.customerstatus,
        type: this.customertype == 7 ? null : this.customertype,
        manageUserId: this.userDataAuthorityId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },

    search() {
      var end = new Date(this.endDate);
      var start = new Date(this.startDate);
      var num = end.getTime() - start.getTime();
      num = num / 1000 / 60 / 60 / 24;
      if (num < 0) {
        this.$message({
          type: "error",
          message: "创建截止时间不能小于开始时间!"
        });
        return false;
      }

      this.getcustomer(1);
    },

    peopleManage(id, pid) {
      checkPermission(id).then(res => {
        if (res.code == "000000") {
          if (res.data==1) {
            this.$router.push({
              name: "peoplemanage",
              query: { id: id, pid: pid }
            });
          } else if(res.data==0){
            this.$message({
              type: "error",
              message: "权限不足"
            });
            return false;
          }
        }
      });
    },
    goinvoice(id){
      checkPermission(id).then(res => {
        if (res.code == "000000") {
          if (res.data==1) {
            this.$router.push({
              name: "invoicelist",
              query: { id: id}
            });
          } else if(res.data==0){
            this.$message({
              type: "error",
              message: "权限不足"
            });
            return false;
          }
        }
      });
    },
    goEdit(id) {
      ownAuthority(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({ name: "customeredit", query: { id: id } });
        }
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "customerdetail",
        query: { id: id }
      });
    },
    addNew() {
      this.$router.push({
        name: "customeradd"
      });
    },
    handleCurrentChange(val) {
      this.getcustomer(val);
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
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
      .serch-icon {
        display: inline-block;
        padding: 10px 10px;
        .el-input {
          width: 200px;
        }
        .el-select {
          width: 200px;
        }
        .username-realname {
          width: 220px;
          height: 40px;
        }
        .time-box {
          width: 550px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          .center-span {
            line-height: 40px;
            margin-bottom: 10px;
          }
          .el-date-editor {
            width: 200px;
            height: 40px;
          }
          .text {
            line-height: 40px;
          }
        }
      }
    }
  }
  .listBox {
    font-size: 12px;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 10px 0 0 0;
  }
  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .my-scroll-bar {
    height: 200px;
  }
}
</style>

