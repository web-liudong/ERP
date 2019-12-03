<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:isActive==0}"
        @click="initAvalable"
      >可用（{{availableNum}}）</el-button>
      <el-button
        size="small"
        :class="{active:isActive==1}"
        @click="initPending"
      >待审核（{{pendingReviewNum}}）</el-button>
      <el-button size="small" :class="{active:isActive==2}" @click="initDraft">草稿（{{drafNum}}）</el-button>
      <el-button
        size="small"
        :class="{active:isActive==3}"
        @click="initRejected"
      >已驳回（{{rejectReviewNum}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" @click="query(1)">查询结果</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div v-show="isActive==0">
            <span>分类编号:</span>
            <el-input placeholder="分类编号" v-model="selectId" clearable></el-input>
          </div>
          <div>
            <span>所属一级分类:</span>
            <el-select
              v-model="parentId"
              placeholder="所属一级分类"
              v-if="!shaiid"
              clearable
              @change="getSecond"
            >
              <el-option
                v-for="item in classOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input v-model="className" readonly v-if="shaiid"></el-input>
          </div>
          <div>
            <span>二级分类名称:</span>
            <el-select v-model="name" placeholder="二级分类名称" clearable v-if="isActive==0">
              <el-option
                v-for="item in classOptions2"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-input placeholder="二级分类名称" v-model="name" clearable v-if="isActive!==0"></el-input>
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
              size="small"
              @click="addNew"
              v-if="$authorities.CategoryCreateRelevant"
            >
              <i class="iconfont iconzengjia"></i>添加二级分类
            </el-button>
          </div>
        </table-head>
      </div>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="分类编号" align="center">
          <template slot-scope="scope">
            <span v-show="isActive==0">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
        <el-table-column prop="levelDescription" label="级别" align="center"></el-table-column>
        <el-table-column prop="parentName" label="所属一级分类" align="center"></el-table-column>
        <el-table-column prop="statusDescription" label="分类状态" align="center"></el-table-column>
        <el-table-column prop="address" label="相关" align="center" width="450px">
          <template slot-scope="scope">
            <div v-show="isActive==0">
              <router-link
                :to="{name:'Category3',query:{id2:scope.row.id,name1:scope.row.parentName,name2:scope.row.name}}"
              >
                <el-button type="text">三级：{{scope.row.thirdLevelCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'GoodsManage',query: {id2:scope.row.id,name2:scope.row.name,name1:scope.row.parentName},params:{isUpdate:true}}"
              >
                <el-button type="text">商品：{{scope.row.skuCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'Brand',query: {id2:scope.row.id,name:scope.row.name},params:{isUpdate:true}}"
                v-if="$authorities.Brand"
              >
                <el-button type="text">品牌：{{scope.row.brandCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'SupplierList',query: {classCode:scope.row.code},params:{isUpdate:true}}"
                v-if="$authorities.SupplierIndex"
              >
                <el-button type="text">供应商：{{scope.row.supplierCount?scope.row.supplierCount:0}}</el-button>
              </router-link>
            </div>
            <div v-show="isActive!=0">---</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <div v-if="isActive==0">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id,scope.row.name,scope.row.parentName)"
                :disabled="scope.row.updateStatus==1"
                v-if="$authorities.CategoryUpdateRelevant"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="goThird(scope.row.id)"
                v-if="$authorities.CategoryCreateRelevant"
              >添加下级分类</el-button>
            </div>
            <div v-if="isActive==1">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goCheck(scope.row.id)"
                v-show="scope.row.statusDescription=='待审核'"
                v-if="$authorities.CategoryReview"
              >审核</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId!=0&&$authorities.CategoryDetailRelevant"
              >原数据详情</el-button>
            </div>
            <div v-if="isActive==2">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id,scope.row.name,scope.row.parentName)"
                v-if="$authorities.CategoryUpdateRelevant"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="check(scope.row.id)"
                v-if="$authorities.CategoryCreateRelevant||$authorities.CategoryUpdateRelevant"
              >提审</el-button>
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.id)"
                v-if="$authorities.CategoryCreateRelevant||$authorities.CategoryUpdateRelevant"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId!=0&&$authorities.CategoryDetailRelevant"
              >原数据详情</el-button>
            </div>
            <div v-if="isActive==3">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id)"
                v-if="$authorities.CategoryUpdateRelevant&& scope.row.oldId == 0"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.id)"
                :disabled="scope.row.updateStatus==2"
                v-if="$authorities.CategoryCreateRelevant||$authorities.CategoryUpdateRelevant"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId!=0&&$authorities.CategoryDetailRelevant"
              >原数据详情</el-button>
            </div>
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
  </div>
</template>
<script>
import {
  available2,
  pending2,
  draft2,
  rejected2,
  countStatus,
  submitReview,
  classDelete,
  editCheck,
  getstatus,
  selectList
} from "@/api/classManage";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload"], //注入依赖
  name: "Category2",
  data() {
    return {
      isActive: 0,
      availableNum: 0,
      pendingReviewNum: 0,
      drafNum: 0,
      rejectReviewNum: 0,
      tableData: [],
      selectId: null,
      parentId: null,
      page: 1,
      name: null,
      total: 0,
      isShow: true,
      classOptions1: [],
      classOptions2: [],
      shaiid: null,
      className: "",
      pageSize: 10
    };
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.shaiid = this.$route.query.id ? this.$route.query.id : null;
      this.parentId = this.shaiid;
      this.getAvailable(1);
      if (this.shaiid) {
        this.className = this.$route.query.name;
        this.getSecond(this.shaiid)
      }
    } else if (this.$route.query.status) {
      this.isActive = this.$route.query.status;
      this.query(1);
    } else if (
      Object.keys(this.$route.params).length === 0 &&
      Object.keys(this.$route.query).length === 0
    ) {
      var that = this;
      this.shaiid = this.$route.query.id ? this.$route.query.id : null;
      this.parentId = this.shaiid;
      this.getAvailable(that.page);
      if (this.shaiid) {
        this.className = this.$route.query.name;
        this.getSecond(this.shaiid)
      }
      selectList(1, 0).then(res => {
        if (res.code == "000000") {
          this.classOptions1 = res.data;
        }
      });
    }else if(this.$route.query.id){
      this.shaiid = this.$route.query.id ? this.$route.query.id : null;
      this.parentId = this.shaiid;
      this.getAvailable(1);
      if (this.shaiid) {
        this.className = this.$route.query.name;
        this.getSecond(this.shaiid)
      }
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  components: { TableHead },
  methods: {
    getSecond(val) {
      if (val) {
        selectList(2, val).then(res => {
          if (res.code == "000000") {
            this.classOptions2 = res.data;
          }
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.query(1);
    },
    reset() {
      if (!this.shaiid) {
        this.parentId = null;
      }
      this.name = null;
      this.selectId = null;
      this.query(this.page);
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
        classDelete(id).then(res => {
          if (res.code == "000000" && res.data == 1) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.query(this.page);
          } else {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
        });
      });
    },
    check(id) {
      this.$confirm("确定当前填写的信息无误，可以提交审核？", "提审确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        submitReview(id).then(res => {
          if (res.code == "000000" && res.data == 1) {
            this.$message({
              type: "success",
              message: "提审成功!"
            });
            this.query(this.page);
          } else {
            this.$message({
              type: "info",
              message: "提审失败"
            });
          }
        });
      });
    },
    count(id) {
      countStatus(2, 1, id).then(res => {
        this.availableNum = res.data.availableQty;
        this.pendingReviewNum = res.data.pendingReviewQty;
        this.drafNum = res.data.drafQty;
        this.rejectReviewNum = res.data.rejectReviewQty;
      });
    },
    addNew() {
      this.$router.push({
        name: "CategoryCreateNext",
        query: { id: this.parentId }
      });
    },
    query(val) {
      var that = this;
      var reg = /^[0-9]+.?[0-9]*$/;
      if (that.selectId && !reg.test(that.selectId)) {
        this.$message.error("id必须输入数字");
        return false;
      }
      if (this.isActive == 0) {
        this.getAvailable(val, that.selectId, that.name);
      }
      if (this.isActive == 1) {
        this.getPending(val, that.selectId, that.name);
      }
      if (this.isActive == 2) {
        this.getDraft(val, that.selectId, that.name);
      }
      if (this.isActive == 3) {
        this.getRejected(val, that.selectId, that.name);
      }
    },
    initAvalable() {
      this.isActive = 0;
      this.id = null;
      this.name = null;
      if (!this.shaiid) {
        this.parentId = null;
      }
      this.getAvailable(1);
    },
    getAvailable(page, id, name) {
      var that = this;
      this.count(this.parentId);
      available2({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        parentId: this.parentId,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
          this.isActive = 0
        }
      });
    },
    initPending() {
      this.isActive = 1;
      this.id = null;
      this.name = null;
      if (!this.shaiid) {
        this.parentId = null;
      }
      this.getPending(1);
    },
    getPending(page, id, name) {
      var that = this;
      this.count(this.parentId);
      pending2({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        parentId: this.parentId,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initDraft() {
      this.isActive = 2;
      this.id = null;
      this.name = null;
      if (!this.shaiid) {
        this.parentId = null;
      }
      this.getDraft(1);
    },
    getDraft(page, id, name) {
      var that = this;
      this.count(this.parentId);
      draft2({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        parentId: this.parentId,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initRejected() {
      this.isActive = 3;
      this.id = null;
      this.name = null;
      if (!this.shaiid) {
        this.parentId = null;
      }
      this.getRejected(1);
    },
    getRejected(page, id, name) {
      var that = this;
      this.count(this.parentId);
      rejected2({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        parentId: this.parentId,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    change(index) {
      this.isActive = index;
    },
    handleCurrentChange(val) {
      var that = this;
      this.query(val);
    },
    goDetail(id) {
      this.$router.push({ name: "CategoryDetail2", query: { id: id } });
    },
    goThird(id) {
      this.$router.push({ name: "CategoryCreateThird", query: { id2: id } });
    },
    goEdit(id) {
      editCheck(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({ name: "CategoryUpdate2", query: { id: id } });
        }
      });
    },
    goCheck(id) {
      getstatus(id).then(res => {
        if (res.data == 1) {
          this.$router.push({ name: "CategoryCheck2", query: { id: id } });
        } else {
          this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.query(this.page);
            }
          });
        }
      });
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
      div {
        display: inline-block;
        padding: 5px 10px;
        .el-input {
          width: 200px;
        }
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
    clear: both;
    margin: 10px 0 0 0;
    .el-table {
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
  .my-scroll-bar {
    height: 200px;
  }
}
</style>

