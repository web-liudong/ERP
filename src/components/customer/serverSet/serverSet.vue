<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">{{isShow?'收起':'展开'}}筛选</span>
          <el-button size="small" class="w80 h40" @click="getorganizationlist(1)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reload">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>客户名称：</span>
            <el-autocomplete
              v-model="selectName"
              :fetch-suggestions="querySearchAsync"
              value-key="name"
              @select="handleSelect"
              clearable :trigger-on-focus="false"
              placeholder="客户名称"
            ></el-autocomplete>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表">
        <div>
          <el-button plain size="small" @click="golog" v-if="$authorities.CustomerServiceLog">操作日志</el-button>
          <el-button plain size="small" @click="addNew" v-if="$authorities.CustomerServiceAdd">添加</el-button>
        </div>
      </table-head>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column type="index" width="100" align="center"></el-table-column>
        <el-table-column prop="projectName" label="所属项目" align="center"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
        <el-table-column prop="organizationName" label="服务伙伴" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goEdit(scope.row)"
              v-if="$authorities.CustomerServiceEdit"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="Del(scope.row.id)"
              v-if="$authorities.CustomerServiceDel"
            >删除</el-button>
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
      <el-dialog
        title="客户服务方设置"
        :visible.sync="serverdialog"
        custom-class="dialog-box"
        @close="initData"
      >
        <el-form :rules="rules" ref="form" :model="form" label-width="150px">
          <el-form-item label="所属项目：" prop="projectId">
            <el-select
              v-model="form.projectId"
              filterable
              remote
              placeholder="请输入"
              :remote-method="projectremoteMethod"
              clearable
            >
              <el-option
                v-for="item in projects"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称：" prop="customerId">
            <el-select
              v-model="form.customerId"
              filterable
              remote
              placeholder="请输入"
              :remote-method="getcustomers"
              clearable
            >
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务伙伴：" prop="organizationId">
            <el-select
              v-model="form.organizationId"
              filterable
              remote
              placeholder="请输入"
              :remote-method="remoteOrganization"
              clearable
            >
              <el-option
                v-for="item in organization"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addOrganization(editId,'form')" type="primary">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  serverSetList,
  projectName,
  customers,
  organizationAdd,
  organizationList,
  listInfo,
  organizationFix,
  listDelete,
  customerName,
  pnameList
} from "@/api/customerManage";
import { setTimeout } from "timers";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload"], //注入依赖
  name: "ServerSet",
  data() {
    return {
      rules: {
        projectId: [
          { required: true, message: "所属项目必填", trigger: "change" }
        ],
        customerId: [
          { required: true, message: "客户名称必填", trigger: "change" }
        ],
        organizationId: [
          { required: true, message: "服务伙伴必填", trigger: "change" }
        ]
      },
      isEdit: false,
      editId: null,
      customernames: [],
      projects: [],
      customers: [],
      organization: [],
      form: {
        organizationId: null,
        customerId: null,
        projectId: null
      },
      treeData: [
        {
          name: "",
          subCategory: []
        }
      ],
      isActive: 0,
      availableNum: 0,
      pendingReviewNum: 0,
      drafNum: 0,
      rejectReviewNum: 0,
      previewData: [],
      defaultProps: {
        children: "subCategory",
        label: "name"
      },
      tableData: [],
      selectName: null,
      page: 1,
      name: null,
      total: 0,
      dialogTableVisible: false,
      serverdialog: false,
      isShow: true,
      pageSize: 10,
      customerNames: []
    };
  },
  activated() {
    this.getorganizationlist(1);
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.getorganizationlist(1);
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        customers(queryString).then(res => {
          if (res.code == "000000") {
            this.customerNames = res.data;
            this.selectName = queryString;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(this.customerNames);
            }, 3000 * Math.random());
          }
        });
      }
    },
    handleSelect(item) {
      this.selectName = item.name;
    },
    addNew() {
      this.serverdialog = true;
    },
    customerRemote(query) {
      if (query !== "") {
        customers(query).then(res => {
          if (res.code == "000000") {
            this.customernames = res.data;
          }
        });
      }
    },
    handleCurrentChange(val) {
      this.getorganizationlist(val);
    },
    addOrganization(id, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            organizationAdd({
              customerId: this.form.customerId - 0,
              organizationId: this.form.organizationId - 0,
              projectId: this.form.projectId - 0
            }).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "已成功保存",
                  type: "success"
                });
                this.serverdialog = false;
                this.initData();
                this.reload();
              } else if (/^98/.test(res.code)) {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          } else {
            organizationFix(id, {
              customerId: this.form.customerId - 0,
              organizationId: this.form.organizationId - 0,
              projectId: this.form.projectId - 0
            }).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "已成功保存",
                  type: "success"
                });
                this.isEdit = false;
                this.serverdialog = false;
                this.initData();
                this.reload();
              }
            });
          }
        }
      });
    },
    initData() {
      this.customerId = null;
      this.organizationId = null;
      this.projectId = null;
      this.isEdit = false;
      this.editId = null;
      this.projects = [];
      this.customers = [];
      this.organization = [];
    },
    projectremoteMethod(query) {
      if (query !== "") {
        projectName({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.projects = res.data;
          }
        });
      }
    },
    getcustomers(query) {
      if (this.form.projectId) {
        if (query !== "") {
          pnameList({
            customerName: query,
            projectId: this.form.projectId
          }).then(res => {
            if (res.code == "000000") {
              this.customers = res.data;
            }
          });
        }
      } else {
        this.$message.error("请先选择项目");
      }
    },
    remoteOrganization(query) {
      if (query !== "") {
        organizationList({
          name: query,
          pageNum: 1,
          pageSize: this.pageSize,
          status: "AVAILABLE"
        }).then(res => {
          if (res.code == "000000") {
            this.organization = res.data;
          }
        });
      }
    },
    getorganizationlist(page) {
      serverSetList({
        customerName: this.selectName ? this.selectName : null,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    golog() {
      this.$router.push({
        name: "ServerLog"
      });
    },
    goEdit(data) {
      var that = this;
      this.isEdit = true;
      this.serverdialog = true;
      listInfo(data.id).then(res => {
        if (res.code == "000000") {
          this.$set(this.projects, 0, {
            name: res.data.projectName,
            id: res.data.projectId
          });
          this.$set(this.customers, 0, {
            name: res.data.customerName,
            id: res.data.customerId
          });
          this.$set(this.organization, 0, {
            name: res.data.organizationName,
            id: res.data.organizationId
          });
          this.editId = res.data.id;
          this.form.projectId = res.data.projectId;
          this.form.customerId = res.data.customerId;
          this.form.organizationId = res.data.organizationId;
        }
      });
    },
    Del(id) {
      this.$confirm(
        "删除之后，客户的服务方将依据下单地址进行匹配，确定要删除吗？",
        "删除提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        listDelete(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getorganizationlist(1);
          } else if (/^98/.test(res.code)) {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.getorganizationlist(1);
          }
        });
      });
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
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
        .el-select {
          width: 200px;
        }
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
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


