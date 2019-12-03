<template>
  <div class="brandBox">
    <div class="buttonBox">客户：{{customername}}</div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo myicon"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="['iconfont', isShow?'icon-top':'icon-xia', 'myicon']" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" class="w80 h40" @click="query(1)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reload">重置</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-show="isShow">
        <el-select
          v-model="invoicetitlename"
          filterable
          remote
          clearable
          placeholder="发票抬头"
          :remote-method="getinvoicetitle"
        >
          <el-option
            v-for="(item,index) in invoicetitleList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-select v-model="status" placeholder="状态" clearable>
          <el-option
            v-for="item in classstatus"
            :key="item.status"
            :label="item.label"
            :value="item.status"
          ></el-option>
        </el-select>
        <el-select v-model="temp" placeholder="发票类型" clearable>
          <el-option
            v-for="(item,index) in templates"
            :key="index"
            :label="item.label"
            :value="item.type"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <el-button @click="addNew">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
            <div
              v-if="scope.row.defaulted"
              style="width: 30px;height:16px;border-radius:8px;background-color: red;line-height: 16px;color: #fff;display: inline-block;font-size: 10px;margin-left: 10px;"
            >默认</div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="发票类型" align="center"></el-table-column>
        <el-table-column prop="invoiceTitle" label="开票抬头" align="center"></el-table-column>
        <el-table-column prop="socialCreditCode" label="统一社会信用代码" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="goDetail(scope.row.id,scope.row.type)">详情</el-button>
            <el-button type="text" size="small" @click="editInfo(scope.row.id)">编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="forbidden(scope.row.id)"
              v-if="scope.row.status=='启用'"
            >禁用</el-button>
            <el-button
              type="text"
              size="small"
              @click="activate(scope.row.id)"
              v-if="scope.row.status=='禁用'"
            >启用</el-button>
            <el-button
              type="text"
              size="small"
              @click="setdefault(scope.row.id)"
              v-if="!scope.row.defaulted && scope.row.status=='启用'"
            >设为默认</el-button>
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
    <el-dialog
      :visible.sync="adddialog"
      width="965px"
      custom-class="dialog-box"
      @close="InvoiceClose"
    >
      <div slot="title" class="dialog-title">
        <span class="reject-title">{{edit?'编辑':'添加'}}开票信息</span>
      </div>
      <div class="dialog-body">
        <div class="title">
          <i style="color: red;">*</i>
          <i>客户名称：</i>
          <i style="color: red;">{{customername}}</i>
        </div>
        <div>
          <div class="dialog-body-head">
            <span>开票信息</span>
          </div>
          <div class="dialog-body-body">
            <el-form label-width="200px" :rules="rules" status-icon :model="form" ref="form">
              <el-form-item prop="name">
                <span slot="label">
                  <i style="color:red">*</i> 开票类型：
                </span>
                <el-radio-group v-model="form.type" @change="ontypechange">
                  <el-radio :label="1">普票</el-radio>
                  <el-radio :label="0">专票</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="invoiceTitle">
                <span slot="label">
                  <i style="color:red">*</i> 开票抬头：
                </span>
                <el-input v-model="form.invoiceTitle" placeholder="字数长度1~30"></el-input>
              </el-form-item>
              <el-form-item prop="socialCreditCode">
                <span slot="label">
                  <i style="color:red" v-if="customertype!=4||form.type==0">*</i> 统一社会信用代码：
                </span>
                <el-input v-model="form.socialCreditCode" placeholder="字符长度1~20"></el-input>
              </el-form-item>
              <el-form-item prop="addressOnInvoice">
                <span slot="label">
                  <i style="color:red" v-if="form.type==0">*</i> 地址：
                </span>
                <el-input
                  type="textarea"
                  placeholder="请输入200字以内"
                  v-model="form.addressOnInvoice"
                  rows="5"
                ></el-input>
              </el-form-item>
              <el-form-item prop="phoneOnInvoice">
                <span slot="label">
                  <i style="color:red" v-if="form.type==0">*</i> 电话：
                </span>
                <el-input v-model="form.phoneOnInvoice" placeholder="请输入联系方式"></el-input>
              </el-form-item>
              <el-form-item prop="bank">
                <span slot="label">
                  <i style="color:red" v-if="form.type==0">*</i> 开户行：
                </span>
                <el-input v-model="form.bank" placeholder="银行+支行信息，字数长度1~50"></el-input>
              </el-form-item>
              <el-form-item prop="accountNo">
                <span slot="label">
                  <i style="color:red" v-if="form.type==0">*</i> 账号：
                </span>
                <el-input v-model="form.accountNo" placeholder="账号"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeinvoice('form')" v-if="edit">保存</el-button>
        <el-button type="primary" @click="addinvoice('form')" v-else="edit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from "../../../directive/el-dragDialog";
import {
  customerinvoice,
  addinvoice,
  getinvoice,
  changeinvoice,
  customercmmmon,
  customerinvoiceactivate,
  customerinvoiceforbidden,
  customerinvoicedefault,
  checkInvoice,
  invoicetitle
} from "@/api/customerManage";
export default {
  inject: ["reload"],
  name: "Classify",
  directives: { elDragDialog },
  data() {
    var checkTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("开票抬头不能为空"));
      }
      var reg = /^[^"'”“‘’v\n\\]+$/;
      if (!reg.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else if (value.length > 30) {
        callback(new Error("字数长度1~30"));
      } else {
        checkInvoice({
          customerId: this.customerId,
          id: this.edit ? this.editid : 0,
          invoiceTitle: value,
          type: this.form.type
        }).then(res => {
          if (res.code == "000000") {
            callback();
          } else if (res.code == "010020028") {
            callback(new Error("同一客户同类型的发票抬头不能相同!"));
          }
        });
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (value) {
        var isMob = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/; // 座机
        if (isMob.test(value)) {
          callback();
        } else {
          callback(new Error("联系方式错误"));
        }
      }else if(this.form.type == 0){
        return callback(new Error("联系方式不能为空"));
      }else{
        callback();
      }
    };
    return {
      page: 1,
      invoicetitlename: null,
      invoicetitleList: [],
      form: {
        type: 0,
        invoiceTitle: "",
        addressOnInvoice: "",
        socialCreditCode: "",
        phoneOnInvoice: "",
        bank: "",
        accountNo: ""
      },
      form1: {
        type: 0,
        invoiceTitle: "",
        addressOnInvoice: "",
        socialCreditCode: "",
        phoneOnInvoice: "",
        bank: "",
        accountNo: ""
      },
      rules: {
        invoiceTitle: [{ validator: checkTitle, trigger: "blur" }],
        socialCreditCode: [
          {
            validator: (rule, value, callback) => {
              if (!value && (this.customertype != 4 || this.form.type == 0)) {
                return callback(new Error("统一社会信用代码不能为空"));
              }
              if (value.length > 20) {
                callback(new Error("不能超过20个字"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        addressOnInvoice: [
          {
            validator: (rule, value, callback) => {
              if (!value && this.form.type == 0) {
                return callback(new Error("请填写地址"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          },
          { min: 1, max: 400, message: "长度在 1 到 200 个字", trigger: "blur" }
        ],
        bank: [
          {
            validator: (rule, value, callback) => {
              if (!value && this.form.type == 0) {
                return callback(new Error("请填写开户行"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          },
          { min: 1, max: 50, message: "长度在 1 到 50 个字", trigger: "blur" }
        ],
        accountNo: [
          {
            validator: (rule, value, callback) => {
              if (!value && this.form.type == 0) {
                return callback(new Error("请填写账号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        phoneOnInvoice: [{ validator: checkPhone, trigger: "blur" }]
      },
      adddialog: false,
      customerId: null,
      edit: false,
      editid: null,
      customername: "",
      customertype: 0,
      status: null,
      tableData: [],
      page: 1,
      total: 0,
      temp: null,
      isShow: true,
      classstatus: [
        {
          status: 2,
          label: "不限"
        },
        {
          status: 0,
          label: "启用"
        },
        {
          status: 1,
          label: "禁用"
        }
      ],
      templates: [
        {
          type: 2,
          label: "不限"
        },
        {
          type: 0,
          label: "专票"
        },
        {
          type: 1,
          label: "普票"
        }
      ],
      pageSize: 10
    };
  },
  created() {
    this.customerId = this.$route.query.id;
    this.getinvoice(this.page);
    this.getcustomer(this.customerId);
  },
  activated() {
    this.customerId = this.$route.query.id;
    this.getinvoice(this.page);
    this.getcustomer(this.customerId);
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getinvoice(1);
    },
    InvoiceClose() {
      this.reload();
    },
    getinvoicetitle(query) {
      if (query) {
        invoicetitle(this.customerId, query).then(res => {
          if (res.code == "000000") {
            this.invoicetitleList = res.data;
          }
        });
      }
    },
    activate(id) {
      this.$confirm(
        "启用之后，该条开票信息将恢复可用，确定要启用吗？",
        "启用提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(() => {
        customerinvoiceactivate(id).then(res => {
          if (res.code == "000000") {
            this.reload();
          } else if (/^98/.test(res.code)) {
            this.$message({
              type: "warning",
              message: res.message
            });
            this.getinvoice(this.page);
          }
        });
      });
    },
    setdefault(id) {
      customerinvoicedefault(id).then(res => {
        if (res.code == "000000") {
          this.$confirm(
            "设为默认已成功，每次下单时，会默认使用该开票信息，请在下单时，确认开票信息是否符合要求",
            "成功提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          );
          this.reload();
        } else if (res.code == "980020030") {
          this.$confirm("设为默认失败,当前数据状态发生变化", "失败提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          });
          this.reload();
        }
      });
    },
    forbidden(id) {
      this.$confirm(
        "禁用之后，该条开票信息将不可用，确定要禁用吗？",
        "禁用提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(() => {
        customerinvoiceforbidden(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "禁用成功!"
            });
            this.reload();
          } else if (/^98/.test(res.code)) {
            this.$message({
              type: "warning",
              message: res.message
            });
            this.getinvoice(this.page);
          }
        });
      });
    },
    getcustomer(id) {
      customercmmmon(id).then(res => {
        if (res.code == "000000") {
          this.customername = res.data.name;
          this.customertype = res.data.type;
        }
      });
    },
    addNew() {
      this.form = this.form1;
      this.adddialog = true;
      this.edit = false;
      this.editid = null;
    },
    ontypechange() {
      this.form = this.form1;
      this.$refs["form"].clearValidate();
    },
    changeinvoice(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          changeinvoice(this.editid, {
            accountNo: this.form.accountNo,
            addressOnInvoice: this.form.addressOnInvoice,
            bank: this.form.bank,
            customerId: this.customerId,
            invoiceTitle: this.form.invoiceTitle,
            phoneOnInvoice: this.form.phoneOnInvoice,
            socialCreditCode: this.form.socialCreditCode,
            type: this.form.type
          }).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "已成功保存",
                type: "success"
              });
              this.adddialog = false;
              this.form = this.form1;
              this.edit = false;
              this.editid = null;
              this.$refs["form"].clearValidate();
              this.reload();
            }
          });
        }
      });
    },
    addinvoice(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addinvoice({
            accountNo: this.form.accountNo ? this.form.accountNo : null,
            addressOnInvoice: this.form.addressOnInvoice
              ? this.form.addressOnInvoice
              : null,
            bank: this.form.bank ? this.form.bank : null,
            customerId: this.customerId ? this.customerId : null,
            invoiceTitle: this.form.invoiceTitle
              ? this.form.invoiceTitle
              : null,
            phoneOnInvoice: this.form.phoneOnInvoice
              ? this.form.phoneOnInvoice
              : null,
            socialCreditCode: this.form.socialCreditCode
              ? this.form.socialCreditCode
              : null,
            type: this.form.type
          }).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "已成功保存",
                type: "success"
              });
              this.adddialog = false;
              this.form = this.form1;
              this.edit = false;
              this.editid = null;
              this.$refs["form"].clearValidate();
              this.reload();
            }
          });
        }
      });
    },
    getinvoice(page) {
      customerinvoice({
        customerId: this.customerId,
        invoiceTitle: this.invoicetitlename,
        pageNum: page,
        pageSize: this.pageSize,
        status: this.status == 2 ? null : this.status,
        type: this.temp == 2 ? null : this.temp
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    goDetail(id, type) {
      this.$router.push({
        name: "invoicedetail",
        query: { id: id, type: type }
      });
    },
    editInfo(val) {
      this.adddialog = true;
      this.getinvoiceinfo(val);
    },
    getinvoiceinfo(id) {
      getinvoice(id).then(res => {
        if (res.code == "000000") {
          this.form = res.data;
          this.edit = true;
          this.editid = id;
        }
      });
    },
    initAvailable() {
      this.isActive = 0;
      this.page = 1;
      this.categoryStatus = null;
      this.temp = null;
      this.id = null;
      this.name = null;
      this.status = null;
      available3({
        pageNum: 1,
        pageSize: this.pageSize,
        parentId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initPending() {
      this.page = 1;
      this.isActive = 1;
      this.categoryStatus = null;
      this.temp = null;
      this.id = null;
      this.name = null;
      this.status = null;
      pending3({
        pageNum: 1,
        pageSize: this.pageSize,
        parentId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initDraft() {
      this.page = 1;
      this.isActive = 2;
      this.categoryStatus = null;
      this.temp = null;
      this.id = null;
      this.name = null;
      this.status = null;
      draft3({
        pageNum: 1,
        pageSize: this.pageSize,
        parentId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initRejected() {
      this.page = 1;
      this.isActive = 3;
      this.categoryStatus = null;
      this.temp = null;
      this.id = null;
      this.name = null;
      this.status = null;
      rejected3({
        pageNum: 1,
        pageSize: this.pageSize,
        parentId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    query(val) {
      this.getinvoice(1);
    },
    handleCurrentChange(val) {
      this.getinvoice(val);
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  margin-bottom: 100px;
  .buttonBox {
    margin-top: 10px;
    font-size: 14px;
    color: red;
    padding: 15px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    .el-button {
      width: 160px;
      height: 30px;
    }
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
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0;
      border-top: 1px solid #e4e4e4;
      .el-input {
        width: 200px;
        height: 40px;
        margin-left: 10px;
      }
      .el-select {
        width: 200px;
        height: 40px;
        margin-left: 10px;
      }
      .el-date-editor {
        width: 300px;
        height: 40px;
        margin-left: 10px;
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 20px 0 0 0;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      .listBoxTop-left {
        .myicon {
          margin-left: 20px;
          font-weight: bold;
          font-size: 20px;
        }
        span {
          margin-left: 5px;
          font-size: 14px;
          color: #303133;
          line-height: 50px;
        }
      }
    }
    .listBoxRight {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
    }
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
    }
  }
  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .dialog-box {
    position: relative;
    .dialog-body {
      height: 450px;
      margin: 5px auto;
      width: 776px;
      // overflow: scroll;
      .title {
        font-size: 16px;
        line-height: 40px;
      }
      .dialog-body-head {
        width: 100%;
        height: 40px;
        border: 1px solid #e4e4e4;
        font-size: 16px;
        color: #666;
        font-weight: 700;
        display: flex;
        align-items: center;
        padding-left: 10px;
        box-sizing: border-box;
        background-color: #f3f3f3;
      }
      .dialog-body-body {
        overflow: scroll;
        height: 350px;
        // background-color: red;
        padding-top: 10px;
        .el-input {
          width: 400px;
        }
        .el-select {
          width: 400px;
        }
        .address-select {
          width: 130px;
        }
        .el-textarea {
          width: 400px;
        }
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
      display: flex;
      justify-content: center;
    }
  }
}
</style>

