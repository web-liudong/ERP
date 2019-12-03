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
          <el-button size="small"  @click="getList(1)">查询结果</el-button>
          <el-button size="small"  @click="reload">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>楼层ID：</span>
            <el-input placeholder="楼层ID" v-model="selectId" clearable></el-input>
          </div>
          <div class="search-icon">
            <span>楼层名称：</span>
            <el-input placeholder="楼层名称" v-model="name" clearable></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表">
        <div>
          <el-button plain size="small" @click="release" v-if="$authorities.ReleaseFloorRelease">
            <i class="iconfont iconkuaijierukou"></i>发布
            <i style="color:red;">（{{releaseCount}}）</i>
          </el-button>
          <el-button
            plain
            size="small"
            @click="addNew"
            v-if="$authorities.ReleaseFloorAdd"
          ><i class="iconfont iconzengjia"></i>添加</el-button>
          <el-button plain size="small" @click="releaselog" v-if="$authorities.ReleaseFloorRecord">
            <i class="iconfont icondingdanguanli"></i>发布记录
          </el-button>
        </div>
      </table-head>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="楼层ID" align="center" prop="id"></el-table-column>
        <el-table-column prop="name" label="楼层名称" align="center"></el-table-column>
        <el-table-column label="楼层展示图" align="center">
          <template slot-scope="scope">
            <img :src="imgurl+scope.row.fileDTOList[0].path" class="avatar" />
          </template>
        </el-table-column>
        <el-table-column label="导航状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.available?'可用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="index" label="优先级" align="center"></el-table-column>
        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goRecommend(scope.row.id)"
              v-if="$authorities.ReleaseFloorRecommand"
            >推荐导航</el-button>
            <el-button
              type="text"
              size="small"
              @click="goBrand(scope.row.id)"
              v-if="$authorities.ReleaseFloorBrand"
            >推荐位品牌</el-button>
            <el-button
              type="text"
              size="small"
              @click="forbidden(scope.row.id)"
              v-if="scope.row.available&&$authorities.ReleaseFloorStart"
            >禁用</el-button>
            <el-button
              type="text"
              size="small"
              @click="start(scope.row.id)"
              v-if="!scope.row.available&&$authorities.ReleaseFloorForbid"
            >启用</el-button>
            <el-button
              type="text"
              size="small"
              @click="goEdit(scope.row.id)"
              v-if="$authorities.ReleaseFloorEdit"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="godetail(scope.row.id)"
              v-if="$authorities.ReleaseFloorDetail"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]" @size-change="handleSizeChange"
          layout="total, sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog title="发布确认" :visible.sync="dialogRelease" custom-class="dialog-box2">
        <span>更新预览</span>
        <el-table :data="tableRelease" border>
          <el-table-column prop="mainsiteFloorName" label="对象名称" align="center"></el-table-column>
          <el-table-column label="动作" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.operation" :key="index">
                <i v-if="item=='CREATE'">新建&nbsp;&nbsp;&nbsp;</i>
                <i v-if="item=='UPDATE'">编辑&nbsp;&nbsp;&nbsp;</i>
                <i v-if="item=='FORBID'">禁用&nbsp;&nbsp;&nbsp;</i>
                <i v-if="item=='ACTIVATE'">启用&nbsp;&nbsp;&nbsp;</i>
                <i v-if="item=='NAVIGATION_MANAGEMENT'">维护推荐导航&nbsp;&nbsp;&nbsp;</i>
                <i v-if="item=='BRAND_MANAGEMENT'">维护推荐位品牌&nbsp;&nbsp;&nbsp;</i>
                <i v-if="item=='SKU_MANAGEMENT'">维护推荐位商品&nbsp;&nbsp;&nbsp;</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="详情" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRelease = false">取 消</el-button>
          <el-button type="primary" @click="ReleaseAll">确定并发布</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  floorList,
  floorRelease,
  release,
  forbiddenfloor,
  getCount,
  available
} from "@/api/release/floorManage";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload", "imgurl"], //注入依赖
  name: "FloorManage",
  data() {
    return {
      dialogRelease: false,
      tableData: [],
      tableRelease: [],
      selectId: null,
      page: 1,
      name: null,
      total: 0,
      previewVisible: false,
      isShow: true,
      releaseCount: null,
      pageSize:10
    };
  },
  created() {
    this.getList(1);
    this.getCount();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getList(1);
      this.getCount();
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
      this.query(1);
    },
    start(id) {
      available(id).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "楼层已启用"
          });
          this.reload();
        }
      });
    },
    getCount() {
      getCount().then(res => {
        if (res.code == "000000") {
          this.releaseCount = res.data;
        }
      });
    },
    goEdit(id) {
     this.$router.push({
        name: "EditFloor",
        query: { id: id }
      });
    },
    forbidden(id) {
      this.$confirm(
        "禁用之后，前端页面不再显示此导航和此导航下关联的商品。确认禁用吗？",
        "禁用提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        forbiddenfloor(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "楼层已禁用"
            });
            this.reload();
          }
        });
      });
    },
    ReleaseAll() {
      if (this.tableRelease.length) {
        release().then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "前台更新已同步"
            });
            this.reload();
          }
        });
      } else {
        this.$message({
          type: "info",
          message: "暂无更新信息"
        });
        this.dialogRelease = false;
      }
    },
    getList(page) {
      floorList({
        id: this.selectId == "" ? null : this.selectId,
        name: this.name == "" ? null : this.name,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    godetail(id) {
      this.$router.push({
        name: "floordetail",
        query: { id: id }
      });
    },
    releaselog() {
      this.$router.push({
        name: "releaselog"
      });
    },
    goBrand(id) {
      this.$router.push({
        name: "RecommendBrand",
        query: { id: id }
      });
    },
    release() {
      this.dialogRelease = true;
      floorRelease().then(res => {
        if (res.code == "000000") {
          this.tableRelease = res.data;
        }
      });
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
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.reload();
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
            this.reload();
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
      countStatus(1).then(res => {
        this.availableNum = res.data.availableQty;
        this.pendingReviewNum = res.data.pendingReviewQty;
        this.drafNum = res.data.drafQty;
        this.rejectReviewNum = res.data.rejectReviewQty;
      });
    },
    addNew() {
      this.$router.push({
        name: "AddFloor"
      });
    },
    query(val) {},
    initAvailable() {
      var that = this;
      this.isActive = 0;
      this.page = 1;
      this.selectId = null;
      this.name = null;
      that.status = null;
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
      var that = this;
      this.isActive = 1;
      this.page = 1;
      this.selectId = null;
      this.name = null;
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
      var that = this;
      this.isActive = 2;
      this.page = 1;
      this.selectId = null;
      this.name = null;
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
    goRecommend(id) {
      this.$router.push({
        name: "RecommendFloor",
        query: { id: id }
      });
    },
    initRejected() {
      var that = this;
      this.isActive = 3;
      this.page = 1;
      this.selectId = null;
      this.name = null;
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
      available1({
        id: id == "" ? null : id,
        name: name == "" ? null : name,
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
      pending1({
        id: id == "" ? null : id,
        name: name == "" ? null : name,
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
      draft1({
        id: id == "" ? null : id,
        name: name == "" ? null : name,
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
      rejected1({
        id: id == "" ? null : id,
        name: name == "" ? null : name,
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
        }
      });
    },
    relativegoods(id) {
      this.$router.push({
        name: "relativegoodsmanage",
        query: { id: id }
      });
    },
    preview() {
      this.$router.push({
        name: "ImportLog"
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "NavDetail1",
        query: { id: id }
      });
    },
    goNext(id) {
      this.$router.push({
        name: "CategoryCreateNext",
        query: { id: id }
      });
    },
    goEdite(id) {
      this.$router.push({
        name: "Edite1",
        query: { id: id }
      });
    },
    goCheck(id) {
      this.$router.push({
        name: "CategoryCheck1",
        query: { id: id }
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
        .el-select {
          width: 200px;
        }
      }
    }
  }
  .listBox {
    font-size: 12px;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 10px 0 0 0;
    .el-table {
      .avatar {
        width: 100px;
        height: 100%;
      }
    }
  }
  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
