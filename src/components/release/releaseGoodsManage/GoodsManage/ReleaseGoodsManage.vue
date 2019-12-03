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
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" @click="query">查询结果</el-button>
          <el-button size="small" @click="reload">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>商品编号：</span>
            <el-input placeholder="商品编号" v-model="id" clearable type="number"></el-input>
          </div>
          <div class="search-icon">
            <span>商品名称：</span>
            <el-select
              v-model="name"
              filterable
              remote
              placeholder="商品名称"
              :remote-method="remoteMethod4"
              :loading="loading"
              clearable
            >
              <el-option
                v-for="item in nameSkuList"
                :key="item.id"
                :label="item.skuName"
                :value="item.skuName"
              ></el-option>
            </el-select>
          </div>

          <div class="search-icon">
            <span>一级分类：</span>
            <el-select
              v-model="firstLevelCategoryId"
              filterable
              remote
              placeholder="一级分类"
              :remote-method="remoteMethod"
              :loading="loading"
              clearable
            >
              <el-option
                v-for="item in classOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <div class="search-icon">
            <span>二级分类：</span>
            <el-select
              v-model="secondLevelCategoryId"
              filterable
              remote
              placeholder="二级分类"
              :remote-method="remoteMethod2"
              :loading="loading"
              clearable
            >
              <el-option
                v-for="item in classOptions2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <div class="search-icon">
            <span>三级分类：</span>
            <el-select
              v-model="thirdLevelCategoryId"
              filterable
              remote
              placeholder="三级分类"
              :remote-method="remoteMethod3"
              :loading="loading"
              clearable
            >
              <el-option
                v-for="item in classOptions3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>价格：</span>
            <div style="width: 420px;display: inline-block;">
              <el-input placeholder="最低价格" v-model="priceStart" clearable></el-input>
              <span>-</span>
              <el-input placeholder="最高价格" v-model="priceEnd" clearable></el-input>
            </div>
          </div>

          <div class="search-icon">
            <span>一级导航：</span>
            <el-select
              v-model="firstLevelNavigationId"
              filterable
              remote
              placeholder="一级导航"
              :remote-method="remoteMethod6"
              :loading="loading"
              clearable
              v-if="!$route.query.nav1"
            >
              <el-option
                v-for="item in navOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model="navname1"
              v-if="($route.query.nav1||$route.query.nav2)||$route.query.nav3"
              readonly
            ></el-input>
          </div>

          <div class="search-icon">
            <span>二级导航：</span>
            <el-select
              v-model="secondLevelNavigationId"
              filterable
              remote
              placeholder="二级导航"
              :remote-method="remoteMethod7"
              :loading="loading"
              clearable
              v-if="!$route.query.nav2"
            >
              <el-option
                v-for="item in navOptions2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input v-model="navname2" v-if="$route.query.nav2||$route.query.nav3" readonly></el-input>
          </div>

          <div class="search-icon">
            <span>三级导航：</span>
            <el-select
              v-model="thirdLevelNavigationId"
              filterable
              remote
              placeholder="三级导航"
              :remote-method="remoteMethod8"
              :loading="loading"
              clearable
              v-if="!$route.query.nav3"
            >
              <el-option
                v-for="item in navOptions3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input v-model="navname3" v-if="$route.query.nav3" readonly></el-input>
          </div>

          <div class="search-icon">
            <span>品牌名称：</span>
            <el-select
              v-model="brandId"
              filterable
              remote
              placeholder="品牌名称"
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
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表">
        <div>
          <el-button plain size="small" @click="exportgoods">
            <i class="iconfont icondaochu"></i>导出
          </el-button>
        </div>
      </table-head>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="商品编号" align="center" prop="skuNo"></el-table-column>
        <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="categoryName" label="所属分类" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属导航" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover placement="right" trigger="click">
              <div>
                <div v-for="(item,index) in scope.row.navigationNames" :key="index">
                  <span>{{item}}</span>
                  <el-divider></el-divider>
                </div>
              </div>
              <el-button slot="reference" type="text">{{scope.row.navigationName}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="采购价（含税）" align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.buyingPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="友商售价" align="center">
          <template slot-scope="scope">
              <p v-if="!scope.row.competingSkuUrl&&scope.row.competingSkuPrice!=0">￥{{scope.row.competingSkuPrice}}</p>
              <el-button type="text" v-if="scope.row.competingSkuUrl&&scope.row.competingSkuPrice!=0">
                <a
                  :href="scope.row.competingSkuUrl"
                  target="_blank"
                  style="color: #339999"
                >￥{{scope.row.competingSkuPrice}}</a>
              </el-button>
            </template>
        </el-table-column>
        <el-table-column label="官网售价（含税）" align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.websitePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="可售库存" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="websiteAvailableName" label="状态" align="center"></el-table-column>
        <el-table-column  label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="goGoodsDetail(scope.row.id)">详情</el-button>
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
      <el-dialog :visible.sync="dialogTableVisible" width="500px" custom-class="dialog-box">
        <div slot="title" class="dialog-title">
          <span class="reject-title">分类信息批量导入</span>
        </div>
        <div class="message-box">
          <div class="first-step-box">
            <i>第一步:&nbsp;&nbsp;&nbsp;&nbsp;</i>
            <i class="first-step">下载分类批量导入模板</i>
          </div>
          <div class="second-step-box">
            <div class="second-step-text">第二步:&nbsp;&nbsp;&nbsp;&nbsp;请选择要导入的文件</div>
            <div class="input-box-file">
              <div class="input-button">选择文件</div>
              <input type="file" placeholder="请选择文件" />
            </div>
          </div>
          <div class="tip">
            <p>小提示：</p>
            <p>
              分类信息导入文件大小不能超过4M；
              <br />导入文件信息最多允许有2W条分类数据。
            </p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="发布确认" :visible.sync="dialogRelease" custom-class="dialog-box2">
        <el-table :data="tableRelease">
          <el-table-column property="a" label="对象名称" align="center"></el-table-column>
          <el-table-column property="b" label="动作" align="center"></el-table-column>
          <el-table-column property="c" label="所在导航位置" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goDetail(scope.row.id)">撤销</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRelease = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确定并发布</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  websiteList,
  nameList,
  brandList,
  list1,
  list2,
  list3,
  websiteExport,
  getParentName
} from "@/api/release/navManage";
import { selectlist } from "@/api/classManage";
import TableHead from "@/components/common/TableHead/tablehead";
import { formatString } from "@/utils";
export default {
  inject: ["reload"], //注入依赖
  name: "ReleaseGoodsManage",
  data() {
    return {
      id: null,
      name: null,
      firstLevelCategoryId: null,
      secondLevelCategoryId: null,
      thirdLevelCategoryId: null,
      firstLevelNavigationId: null,
      secondLevelNavigationId: null,
      thirdLevelNavigationId: null,
      loading: false,
      classOptions1: [],
      classOptions2: [],
      classOptions3: [],
      navOptions1: [],
      navOptions2: [],
      navOptions3: [],
      nameSkuList: [],
      priceStart: null,
      priceEnd: null,
      brandId: null,
      nameBrandList: null,
      page: 1,
      total: 0,
      dialogRelease: false,
      tableData: [],
      tableRelease: [{ a: "A4纸", b: "新建", c: "办公用品-打印纸" }],
      selectId: null,
      dialogTableVisible: false,
      previewVisible: false,
      isShow: true,
      navname1: "",
      navname2: "",
      pageSize:10
    };
  },
  created() {
    this.firstLevelNavigationId = this.$route.query.nav1;
    if (this.firstLevelNavigationId) {
      getParentName(this.firstLevelNavigationId).then(res => {
        if (res.code == "000000") {
          this.navname1 = res.data.firstLevelName;
        }
      });
    }
    this.secondLevelNavigationId = this.$route.query.nav2;
    if (this.secondLevelNavigationId) {
      getParentName(this.secondLevelNavigationId).then(res => {
        if (res.code == "000000") {
          this.navname1 = res.data.firstLevelName;
          this.navname2 = res.data.secondLevelName;
        }
      });
    }
    this.thirdLevelNavigationId = this.$route.query.nav3;
    if (this.thirdLevelNavigationId) {
      getParentName(this.secondLevelNavigationId).then(res => {
        if (res.code == "000000") {
          this.navname1 = res.data.firstLevelName;
          this.navname2 = res.data.secondLevelName;
          this.navname3 = res.data.thirdLevelName;
        }
      });
    }
    this.getlist(1);
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.firstLevelNavigationId = this.$route.query.nav1;
      if (this.firstLevelNavigationId) {
        getParentName(this.firstLevelNavigationId).then(res => {
          if (res.code == "000000") {
            this.navname1 = res.data.firstLevelName;
          }
        });
      }
      this.secondLevelNavigationId = this.$route.query.nav2;
      if (this.secondLevelNavigationId) {
        getParentName(this.secondLevelNavigationId).then(res => {
          if (res.code == "000000") {
            this.navname1 = res.data.firstLevelName;
            this.navname2 = res.data.secondLevelName;
          }
        });
      }
      this.thirdLevelNavigationId = this.$route.query.nav3;
      if (this.thirdLevelNavigationId) {
        getParentName(this.secondLevelNavigationId).then(res => {
          if (res.code == "000000") {
            this.navname1 = res.data.firstLevelName;
            this.navname2 = res.data.secondLevelName;
            this.navname3 = res.data.thirdLevelName;
          }
        });
      }
      this.getlist(1);
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
      this.getlist(1);
    },
    exportgoods() {
      websiteExport({
        skuId: this.id == "" ? null : this.id,
        firstLevelCategoryId: this.firstLevelCategoryId
          ? this.firstLevelCategoryId
          : null,
        secondLevelCategoryId: this.secondLevelCategoryId
          ? this.secondLevelCategoryId
          : null,
        thirdLevelCategoryId: this.thirdLevelCategoryId
          ? this.thirdLevelCategoryId
          : null,
        firstLevelNavigationId: this.firstLevelNavigationId
          ? this.firstLevelNavigationId
          : null,
        secondLevelNavigationId: this.secondLevelNavigationId
          ? this.secondLevelNavigationId
          : null,
        thirdLevelNavigationId: this.thirdLevelNavigationId
          ? this.thirdLevelNavigationId
          : null,
        brandId: this.brandId ? this.brandId : null,
        name: this.name == "" ? null : this.name,
        pageNum: this.page,
        pageSize: this.pageSize,
        priceEnd: this.priceEnd ? this.priceEnd : null,
        priceStart: this.priceStart ? this.priceStart : null
      }).then(res => {
        if (res.code == "000000") {
          let href = formatString(
            "/api/file-service/file/download?id={id}&access_token={token}",
            { id: res.data, token: this.$auth.token }
          );
          window.open(href, "blank");
          this.reload();
        }
      });
    },
    remoteMethod(query) {
      if (query) {
        this.loading = true;
        selectlist(1, 0, query).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.classOptions1 = res.data;
          }
        });
      }
    },
    remoteMethod2(query) {
      if (query) {
        this.loading = true;
        selectlist(
          2,
          this.firstLevelCategoryId ? this.firstLevelCategoryId : 0,
          query
        ).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.classOptions2 = res.data;
          }
        });
      }
    },
    remoteMethod3(query) {
      if (query) {
        this.loading = true;
        selectlist(
          3,
          this.secondLevelCategoryId
            ? this.secondLevelCategoryId
            : this.firstLevelCategoryId
            ? this.firstLevelCategoryId
            : 0,
          query
        ).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.classOptions3 = res.data;
          }
        });
      }
    },
    remoteMethod4(query) {
      if (query) {
        this.loading = true;
        nameList({
          name: query
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.nameSkuList = res.data;
          }
        });
      }
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
    remoteMethod6(query) {
      if (query) {
        this.loading = true;
        list1({
          name: query
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.navOptions1 = res.data;
          }
        });
      }
    },
    remoteMethod7(query) {
      if (query) {
        this.loading = true;
        list2({
          name: query,
          firstLevelId: this.firstLevelNavigationId
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.navOptions2 = res.data;
          }
        });
      }
    },
    remoteMethod8(query) {
      if (query) {
        this.loading = true;
        list3({
          name: query,
          firstLevelId: this.firstLevelNavigationId,
          secondLevelId: this.secondLevelNavigationId
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.navOptions3 = res.data;
          }
        });
      }
    },
    query() {
      this.getlist(1);
    },
    getlist(page) {
      websiteList({
        skuNo: this.id == "" ? null : this.id,
        firstLevelCategoryId: this.firstLevelCategoryId
          ? this.firstLevelCategoryId
          : null,
        secondLevelCategoryId: this.secondLevelCategoryId
          ? this.secondLevelCategoryId
          : null,
        thirdLevelCategoryId: this.thirdLevelCategoryId
          ? this.thirdLevelCategoryId
          : null,
        firstLevelNavigationId: this.firstLevelNavigationId
          ? this.firstLevelNavigationId
          : null,
        secondLevelNavigationId: this.secondLevelNavigationId
          ? this.secondLevelNavigationId
          : null,
        thirdLevelNavigationId: this.thirdLevelNavigationId
          ? this.thirdLevelNavigationId
          : null,
        brandId: this.brandId ? this.brandId : null,
        name: this.name == "" ? null : this.name,
        pageNum: page,
        pageSize: this.pageSize,
        priceEnd: this.priceEnd ? this.priceEnd : null,
        priceStart: this.priceStart ? this.priceStart : null
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.page = res.data.pageNum;
        }
      });
    },
    handleCurrentChange(val) {
      this.getlist(val);
    },
    goGoodsDetail(id) {
      this.$router.push({
        name: "GoodsDetail",
        query: { id: id }
      });
    },
    addNew() {
      this.$router.push({
        name: "AddFirstNav"
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
    .el-table {
      a {
        color: #339999;
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
