<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo myicon"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" class="w80 h40" @click="getList(1)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reload">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>导航ID：</span>
            <el-input placeholder="导航ID" v-model="selectId" clearable></el-input>
          </div>

          <div class="search-icon">
            <span>导航名称：</span>
            <el-input placeholder="导航名称" v-model="name" clearable></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表">
        <div>
          <el-button plain size="small" @click="release" v-if="$authorities.ReleaseRelate">
            <i class="iconfont iconkuaijierukou"></i>发布
            <i style="color:red;">（{{releasecount}}）</i>
          </el-button>
          <el-button
            plain
            size="small"
            @click="addNew"
            v-if="$authorities.ReleaseNavAdd"
          ><i class="iconfont iconzengjia"></i>添加</el-button>
          <el-button
            plain
            size="small"
            @click="showDialog('importFile')"
            v-if="$authorities.ReleaseImportRelate"
          >
            <i class="iconfont icondaoru"></i>导入
          </el-button>
          <el-button plain size="small" @click="goReleaseLog" v-if="$authorities.ReleaseRelate">
            <i class="iconfont icondingdanguanli"></i>发布记录
          </el-button>
          <el-button plain size="small" @click="preview" v-if="$authorities.ReleaseImportRelate">
            <i class="iconfont icondingdanguanli"></i>导入记录
          </el-button>
        </div>
      </table-head>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="导航ID" align="center" prop="id"></el-table-column>
        <el-table-column prop="name" label="导航名称" align="center"></el-table-column>
        <el-table-column prop="levelName" label="级别" align="center"></el-table-column>
        <el-table-column prop="availableName" label="导航状态" align="center"></el-table-column>
        <el-table-column prop="maintenanceWayName" label="商品维护方式" align="center"></el-table-column>
        <el-table-column prop="index" label="优先级" align="center"></el-table-column>
        <el-table-column prop="address" label="相关" align="center" width="350px">
          <template slot-scope="scope">
            <router-link :to="{name:'NavManage2',query: {id:scope.row.id}}">
              <el-button
                type="text"
              >二级：{{scope.row.secondLevelCount?scope.row.secondLevelCount:0}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </router-link>
            <router-link :to="{name:'NavManage3',query: {id1:scope.row.id}}">
              <el-button
                type="text"
              >三级：{{scope.row.thirdLevelCount?scope.row.thirdLevelCount:0}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </router-link>
            <router-link
              :to="{name:'ReleaseGoodsManage',query: {nav1:scope.row.id}}"
            >
              <el-button type="text">商品：{{scope.row.skuCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column  label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goDetail(scope.row.id)"
              v-if="$authorities.ReleaseGoodsDetail"
            >详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="goEdite(scope.row.id)"
              :disabled="scope.row.updateStatus==1"
              v-if="$authorities.ReleaseGoodsEdit"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="forbidden(scope.row.id)"
              v-if="scope.row.availableName=='可用'&&$authorities.ReleaseNavStart"
            >禁用</el-button>
            <el-button
              type="text"
              size="small"
              @click="available(scope.row.id)"
              v-if="scope.row.availableName=='禁用'&&$authorities.ReleaseNavStart"
            >启用</el-button>
            <el-button
              type="text"
              size="small"
              @click="relativegoods(scope.row.id)"
              v-if="scope.row.flag&&$authorities.ReleaseGoodsManage"
            >关联商品管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]" @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog title="发布确认" :visible.sync="dialogRelease" custom-class="dialog-box2">
        <el-table :data="tableRelease" max-height="400">
          <el-table-column property="navigationName" label="对象名称" align="center"></el-table-column>
          <el-table-column property="operationLogOperationName" label="动作" align="center"></el-table-column>
          <el-table-column property="navigationLocation" label="所在导航位置" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRelease = false">取 消</el-button>
          <el-button type="primary" @click="releaseConfirm">确定并发布</el-button>
        </div>
      </el-dialog>
      <importFile
        ref="importFile"
        :title="'导航信息批量导入'"
        :type="importType"
        @callback="dialogCallback"
        :params="{type:'Navigation_Template'}"
      ></importFile>
    </div>
  </div>
</template>
<script>
import {
  firstList,
  navigationRelease,
  getRelease,
  forbidden,
  available,
  releaseCount
} from "@/api/release/navManage";
import importFile from "@/components/common/module/ImportFile";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload"],
  name: "NavManage",
  data() {
    return {
      selectId: null,
      page: 1,
      total: 0,
      tableData: [],
      name: null,
      dialogRelease: false,
      tableRelease: [],
      importType: "release-navigation-import",
      dialogTableVisible: false,
      previewVisible: false,
      isShow: true,
      releasecount: 0,
      pageSize:10
    };
  },
  created() {
    this.getList(1);
    releaseCount().then(res => {
      if (res.code == "000000") {
        this.releasecount = res.data;
      }
    });
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getList(1);
      releaseCount().then(res => {
        if (res.code == "000000") {
          this.releasecount = res.data;
        }
      });
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  components: {
    importFile,
    TableHead
  },
  methods: {
    handleSizeChange(val){
      this.pageSize = val;
      this.getList(1);
    },
    forbidden(id) {
      this.$confirm(
        "禁用之后，前端页面不再显示此导航。确认禁用吗？",
        "禁用提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(() => {
        forbidden(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "导航已经禁用"
            });
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: "禁用失败"
            });
          }
        });
      });
    },
    available(id) {
      this.$confirm("启用之后，前端页面显示此导航。确认启用吗？", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        available(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "导航已经启用"
            });
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: "启用失败"
            });
          }
        });
      });
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
    handleCurrentChange(val) {
      this.getList(val);
    },
    getList(page) {
      firstList({
        id: this.selectId,
        name: this.name,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        this.tableData = res.data.items;
        this.page = res.data.pageNum;
        this.total = res.data.total;
      });
    },
    release() {
      getRelease().then(res => {
        if (res.code == "000000") {
          this.dialogRelease = true;
          this.tableRelease = res.data;
        }
      });
    },
    releaseConfirm() {
      navigationRelease().then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "发布成功!"
          });
          this.reload();
        } else {
          this.$message({
            type: "info",
            message: "发布失败"
          });
        }
      });
    },
    addNew() {
      this.$router.push({
        name: "AddFirstNav"
      });
    },
    goReleaseLog() {
      this.$router.push({
        name: "ReleaseLog"
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
        name: "ImportLog",
        query: {
          type: "releaselog"
        }
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "NavDetail",
        query: {
          id: id,
          level: 1
        }
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
      const { href } = this.$router.push({
        name: "CategoryCheck1",
        query: { id: id }
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
  }
  .block {
    margin: 10px;
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
  .dialog-box {
  }
}
</style>
