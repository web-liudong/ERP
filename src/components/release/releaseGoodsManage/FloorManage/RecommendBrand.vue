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
          <el-button size="small" class="w80 h40" @click="getData(1)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reload">重置</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-show="isShow">
        <el-input placeholder="品牌名称" v-model="brandName" clearable></el-input>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="addNew">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加
          </div>
        </div>
      </div>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="品牌ID" align="center" prop="brandId"></el-table-column>
        <el-table-column label="品牌图片" align="center">
          <template slot-scope="scope">
            <img
              :src="imgurl+scope.row.filePathDTO.path"
              class="avatar"
              v-if="scope.row.filePathDTO"
            />
            <el-button v-else="scope.row.filePathDTO">{{scope.row.brandName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center" prop="brandName"></el-table-column>
        <el-table-column label="状态" align="center">
          <span>可用</span>
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="del(scope.row.brandId)">删除</el-button>
            <el-button type="text" size="small" @click="TopBrand(scope.row.brandId)">置顶</el-button>
            <el-button type="text" size="small" @click="godetail(scope.row.brandId)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]" @size-change="handleSizeChange"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog title="添加品牌" :visible.sync="navDialog" width="500px">
        <el-form>
          <el-form-item label="选择品牌">
            <el-select
              v-model="brandId"
              filterable
              remote
              placeholder="输入名称/首字母"
              :remote-method="remoteMethod5"
              :loading="loading"
              clearable
            >
              <el-option
                v-for="item in nameBrandList"
                :key="item.id"
                :label="item.nameCN"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="navDialog = false">取 消</el-button>
          <el-button type="primary" @click="addBrand">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  brandList1,
  AddBrand,
  deleteBrand,
  topBrand
} from "@/api/release/floorManage";
import { brandList } from "@/api/release/navManage";
export default {
  inject: ["reload", "imgurl"], //注入依赖
  name: "RecommendBrand",
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
      floorId: null,
      brandName: null,
      navDialog: false,
      brandId: null,
      loading: false,
      nameBrandList: [],
      pageSize:10
    };
  },
  created() {
    this.floorId = this.$route.query.id;
    this.getData(1);
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.floorId = this.$route.query.id;
      this.getData(1);
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    handleSizeChange(val){
      this.pageSize = val
      this.getData(1);
    },
    addNew() {
      this.brandId = null;
      this.navDialog = true;
    },
    remoteMethod5(query) {
      if (query) {
        this.loading = true;
        brandList({
          name: query
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.nameBrandList = res.data;
          }
        });
      }
    },
    getData(page) {
      brandList1(this.floorId, {
        brandName: this.brandName == "" ? null : this.brandName,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    addBrand() {
      if (this.brandId) {
        AddBrand(this.floorId, this.brandId).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "品牌已添加"
            });
            this.reload();
          }
        });
      } else {
        this.$message.error("请先选择品牌");
        return false;
      }
    },
    del(id) {
      this.$confirm("是否删除推荐位品牌，删除后此楼层下不显示", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        deleteBrand(this.floorId, id).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "删除品牌成功"
            });
            this.reload();
          }
        });
      });
    },
    TopBrand(id) {
      topBrand(this.floorId, id).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "品牌置顶成功"
          });
          this.reload();
        }
      });
    },
    godetail(id) {
      this.$router.push({
        name: "BrandDetail",
        query: {
          id: id
        }
      });
    },
    handleCurrentChange(val) {
      this.getData(val);
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
