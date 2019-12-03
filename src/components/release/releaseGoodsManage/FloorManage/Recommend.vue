<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo myicon"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="['iconfont', isShow?'icon-top':'icon-xia', 'myicon']" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" class="w80 h40" @click="getnavigationList(1)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reload">重置</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-show="isShow">
        <el-input placeholder="推荐导航名称" v-model="navigationName" clearable></el-input>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="navDialog = true">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加
          </div>
        </div>
      </div>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column prop="navigationName" label="推荐导航名称" align="center"></el-table-column>
        <el-table-column label="上柜商品数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.skuCount?scope.row.skuCount:0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.navigationAvailable?'可用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goRecommend(scope.row.mainsiteNavigationId,scope.row.mainsiteFloorId)"
            >推荐商品管理</el-button>
            <el-button
              type="text"
              size="small"
              @click="toTop(scope.row.mainsiteFloorId,scope.row.mainsiteNavigationId)"
            >置顶</el-button>
            <el-button
              type="text"
              size="small"
              @click="del(scope.row.mainsiteFloorId,scope.row.mainsiteNavigationId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]" @size-change="handleSizeChange"
          layout="total, sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <el-dialog title="添加推荐导航" :visible.sync="navDialog" width="500px">
        <el-form>
          <el-form-item label="输入导航">
            <el-input v-model="navId" placeholder="请输入导航ID" style="width:300px;" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="navDialog = false">取 消</el-button>
          <el-button type="primary" @click="AddNavigation">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  navigationList,
  addnavigation,
  floorTop,
  navigationdel
} from "@/api/release/floorManage";
export default {
  inject: ["reload"], //注入依赖
  name: "RecommendFloor",
  data() {
    return {
      navigationName: null,
      navId: null,
      navDialog: false,
      floorId: null,
      tableData: [],
      page: 1,
      name: null,
      total: 0,
      isShow: true,
      pageSize:10
    };
  },
  created() {
    this.floorId = this.$route.query.id;
    this.getnavigationList(1);
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.floorId = this.$route.query.id;
      this.getnavigationList(1);
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
      this.getnavigationList(1);
    },
    toTop(id1, id2) {
      floorTop(id1, id2).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "导航置顶成功"
          });
          this.reload();
        }
      });
    },
    handleCurrentChange(val) {
      this.getnavigationList(val);
    },
    AddNavigation() {
      addnavigation(this.floorId, this.navId).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "导航添加成功"
          });
          this.reload();
        }
      });
    },
    getnavigationList(page) {
      navigationList(this.floorId, {
        navigationName: this.navigationName == "" ? null : this.navigationName,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    del(id1, id2) {
      this.$confirm("是否删除推荐位导航，删除后此楼层下不显示", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        navigationdel(id1, id2).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "删除导航成功"
            });
            this.reload();
          }
        });
      });
    },
    goRecommend(navid, floorid) {
      this.$router.push({
        name: "RecommendGoods",
        query: {
          navid: navid,
          floorid: floorid
        }
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
      height: 56px;
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 200px;
        height: 40px;
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select {
        width: 200px;
        height: 40px;
        line-height: 56px;
        margin-left: 10px;
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 10px 0 0 0;
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
      .button-head {
        width: 80px;
        height: 30px;
        margin-right: 10px;
        border: 1px solid #d1d1d1;
        cursor: pointer;
        background-color: #fff;
        line-height: 30px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        .button-head-icon {
          margin-right: 5px;
        }
        .icon-add {
          font-size: 12px;
        }
        .icon-plane {
          font-size: 12px;
          font-weight: 700;
          color: #000;
        }
      }
      .button-head:hover {
        background-color: #f3f3f3;
      }
      .el-button {
        width: 80px;
        height: 30px;
        margin-top: 10px;
      }
    }
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
}
</style>
