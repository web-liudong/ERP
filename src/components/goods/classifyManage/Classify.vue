<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:isActive==0}"
        @click="initAvailable"
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
            <span>一级分类名称:</span>
            <el-select v-model="name" placeholder="一级分类名称" v-if="isActive==0" clearable>
              <el-option
                v-for="item in classOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.name" 
              ></el-option>
            </el-select>
            <el-input placeholder="分类名称" v-model="name" clearable v-if="isActive!==0"></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <table-head headname="数据列表">
          <div class="listBoxRight">
            <el-button plain size="small" @click="golog" v-if="$authorities.CategoryImportRelevant">
              <i class="iconfont iconxiaoshouxiadan"></i>导入记录
            </el-button>
            <el-button
              plain
              size="small"
              @click="showDialog('importFile')"
              v-if="$authorities.CategoryImportRelevant"
            >
              <i class="iconfont icondaoru"></i>导入
            </el-button>
            <el-button plain size="small" @click="getpreview" v-if="$authorities.CategoryPreview">
              <i class="iconfont iconsousuo"></i>预览
            </el-button>
            <el-button
              plain
              size="small"
              v-if="$authorities.CategoryCreateRelevant"
              @click="addNew"
            >
              <i class="iconfont iconzengjia"></i>添加一级分类
            </el-button>
          </div>
        </table-head>
      </div>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="分类编号" align="center" width="146">
          <template slot-scope="scope">
            <span v-show="isActive==0">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
        <el-table-column prop="levelDescription" label="级别" align="center"></el-table-column>
        <el-table-column prop="statusDescription" label="状态" align="center"></el-table-column>
        <el-table-column prop="address" label="相关" align="center" width="450px">
          <template slot-scope="scope">
            <div v-show="isActive==0">
              <router-link
                :to="{name:'Category2',query: {id:scope.row.id,name:scope.row.name},params:{isUpdate:true}}"
              >
                <el-button type="text">二级：{{scope.row.secondLevelCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'Category3',query: {id1:scope.row.id,name1:scope.row.name}}"
              >
                <el-button type="text">三级：{{scope.row.thirdLevelCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'GoodsManage',query: {id1:scope.row.id,name1:scope.row.name},params:{isUpdate:true}}"
              >
                <el-button type="text">商品：{{scope.row.skuCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'Brand',query: {id1:scope.row.id,name:scope.row.name},params:{isUpdate:true}}"
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
        <el-table-column label="操作" align="center" fixed="right" width="200">
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
                @click="goEdite(scope.row.id)"
                :disabled="scope.row.updateStatus==1"
                v-if="$authorities.CategoryUpdateRelevant"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="goNext(scope.row.id)"
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
                v-if="$authorities.CategoryReview"
              >审核</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId!=0&& $authorities.CategoryDetailRelevant"
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
                @click="goEdite(scope.row.id)"
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
                v-if="scope.row.oldId!=0&& $authorities.CategoryDetailRelevant"
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
                @click="goEdite(scope.row.id)"
                v-if="$authorities.CategoryUpdateRelevant&& scope.row.oldId==0"
              >编辑</el-button>
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
                v-if="scope.row.oldId!=0&& $authorities.CategoryDetailRelevant"
              >原数据详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]"
          @size-change="handleSizeChange"
          layout="total, sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog :visible.sync="previewVisible" width="500px" custom-class="dialog-box">
        <div slot="title" class="dialog-title">
          <span class="reject-title">预览分类</span>
        </div>
        <div class="tree">
          <el-tree :data="treeData" :props="defaultProps"></el-tree>
        </div>
      </el-dialog>
      <importFile
        ref="importFile"
        :title="'分类信息批量导入'"
        :type="importType"
        @callback="dialogCallback"
        :params="{type:'Category_Template'}"
      ></importFile>
    </div>
  </div>
</template>
<script>
import {
  available1,
  pending1,
  draft1,
  rejected1,
  preview,
  countStatus,
  levelCount,
  submitReview,
  classDelete,
  editCheck,
  getstatus,selectList
} from "@/api/classManage";
import importFile from "@/components/common/module/ImportFile";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload"], //注入依赖
  name: "Category1",
  data() {
    return {
      importType: "goods-class-import",
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
      selectId: null,
      page: 1,
      name: null,
      total: 0,
      dialogTableVisible: false,
      previewVisible: false,
      isShow: true,
      pageSize: 10,
      classOptions1:[]
    };
  },
  components: {
    importFile,
    TableHead
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  created(){
    selectList(1,0).then(res=>{
      if(res.code=='000000'){
        this.classOptions1 = res.data
      }
    })
    this.getlevelCount();
  },
  activated() {
    var that = this;
    if (this.$route.params && this.$route.params.isUpdate) {
      this.query(1);
    }else if (this.$route.query.status) {
        this.isActive = this.$route.query.status;
        this.query(1);
    }else{
      this.getAvailable(that.page);
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.query(1);
    },
    reset() {
      this.selectId = null;
      this.name = null;
      this.query(this.page);
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(type) {
      this.$message({
        type: "success",
        message: "上传成功，前台已同步更新!"
      });
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
              message: "提交审核已成功!"
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
    getlevelCount() {
      levelCount().then(res => {
        if (res.code == "000000") {
          this.treeData[0].name = `商品分类目录【一级（${res.data.firstLevelQty}）二级（${res.data.secondLevelQty}）三级（${res.data.thirdLevelQty}）】`;
        }
      });
    },
    count() {
      countStatus(1, 1, 1).then(res => {
        this.availableNum = res.data.availableQty;
        this.pendingReviewNum = res.data.pendingReviewQty;
        this.drafNum = res.data.drafQty;
        this.rejectReviewNum = res.data.rejectReviewQty;
      });
    },
    golog() {
      this.$router.push({
        name: "CategoryImportRecords",
        query: { type: "class-import-list" }
      });
    },
    addNew() {
      this.$router.push({ name: "CategoryCreate", query: { levelflag: 1 } });
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
    initAvailable() {
      this.count();
      this.isActive = 0;
      this.page = 1;
      this.selectId = null;
      this.name = null;
      available1({
        pageNum: 1,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initPending() {
      this.isActive = 1;
      this.page = 1;
      this.selectId =  null;
      this.name = null;
      this.count();
      pending1({
        pageNum: 1,
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
      this.page = 1;
      this.selectId = null;
      this.name = null;
      this.count();
      draft1({
        pageNum: 1,
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
      var that = this;
      this.isActive = 3;
      this.page = 1;
      this.selectId = null;
      this.name = null;
      this.count();
      rejected1({
        pageNum: 1,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getAvailable(page, id, name) {
      var that = this;
      this.count();
      available1({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getPending(page, id, name) {
      var that = this;
      this.count();
      pending1({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getDraft(page, id, name) {
      var that = this;
      this.count();
      draft1({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getRejected(page, id, name) {
      var that = this;
      this.count();
      rejected1({
        code: id ? id : null,
        name: name ? name : null,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getpreview() {
      preview().then(res => {
        if (res.code == "000000") {
          this.treeData[0].subCategory = res.data;
          this.previewVisible = true;
        }
      });
    },
    goDetail(id) {
      this.$router.push({ name: "CategoryDetail1", query: { id: id } });
    },
    goNext(id) {
      this.$router.push({ name: "CategoryCreateNext", query: { id: id } });
    },
    goEdite(id) {
      editCheck(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({ name: "CategoryUpdate1", query: { id: id } });
        }
      });
    },
    goCheck(id) {
      getstatus(id).then(res => {
        if (res.data == 1) {
          this.$router.push({ name: "CategoryCheck1", query: { id: id } });
        } else {
          this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.query(this.page);
            }
          });
        }
      });
    },
    handleCurrentChange(val) {
      this.query(val);
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
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
    }
  }
  .block {
    display: flex;
    justify-content: flex-end;
  }
  .dialog-box {
    position: relative;
    .tree {
      display: flex;
      justify-content: center;
      max-height: 500px;
      overflow: auto;
    }
    .message-box {
      padding: 26px 0 26px 76px;
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
