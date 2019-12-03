<template>
  <div class="demandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">展开筛选</i>
          </span>
          <el-button size="small" @click="search()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>商品名称：</span>
            <el-select
              v-model="findSkuPoolParam.name"
              filterable
              remote
              clearable
              placeholder="商品名称"
              :remote-method="skuNameMethod"
            >
              <el-option
                v-for="item in searchskuNames"
                :key="item.value"
                :lable="item.skuName"
                :value="item.skuName"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>商品编号：</span>
            <el-input
              placeholder="商品编号"
              v-model="findSkuPoolParam.skuNo"
              @input="findSkuPoolParam.skuNo=findSkuPoolParam.skuNo.replace(/[^\d]/g,'')"
              clearable
            ></el-input>
          </div>
          <div class="inputBox">
            <span>旧系统编号：</span>
            <el-input
              placeholder="旧系统ID"
              v-model="findSkuPoolParam.oldErpSkuId"
              clearable
              @input="findSkuPoolParam.oldErpSkuId=findSkuPoolParam.oldErpSkuId.replace(/[^\d]/g,'')"
            ></el-input>
          </div>
          <div class="inputBox">
            <span>所属集采公司：</span>
            <el-select v-model="findSkuPoolParam.organizationId" placeholder="所属集采公司" clearable>
              <el-option
                v-for="item in searchOrganizations"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>一级分类：</span>
            <el-select
              v-model="findSkuPoolParam.firstLevelCategoryId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="一级分类"
              @change="onchange1"
              :remote-method="remoteMethodClassify1"
              :loading="loadingClassify"
            >
              <el-option
                v-for="item in optionsClassify1"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>二级分类：</span>
            <el-select
              v-model="findSkuPoolParam.secondLevelCategoryId"
              placeholder="二级分类"
              @change="onchange2"
              filterable
              clearable
            >
              <el-option
                v-for="item in optionsClassify2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>三级分类：</span>
            <el-select v-model="findSkuPoolParam.thirdLevelCategoryId" placeholder="三级分类" filterable clearable>
              <el-option
                v-for="item in optionsClassify3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>品牌：</span>
            <el-select
              v-model="findSkuPoolParam.brandId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="品牌名称"
              :remote-method="remoteMethodBrand"
              :loading="loadingClassify"
            >
              <el-option
                v-for="item in optionsBrand"
                :key="item.id"
                :label="item.brandName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>规格型号：</span>
            <el-input
              placeholder="请输入规格型号"
              v-model="findSkuPoolParam.primaryAttributeValue"
              clearable
            ></el-input>
          </div>
          <div class="inputBox">
            <span>上下柜状态：</span>
            <el-select v-model="findSkuPoolParam.websiteAvailable" clearable placeholder="上下柜状态">
              <el-option
                v-for="item in options7"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表
        </div>
        <div class="listRight">
          <el-button
            size="small"
            @click="showDialog('addGoods')"
            v-if="$authorities.PurchaseGoodsAdd"
          >
            <i class="iconfont iconzengjia"></i>
            <span>添加</span>
          </el-button>
          <el-button
            size="small"
            @click="showDialog('importFile')"
            v-if="$authorities.PurchaseGoodsImport"
          >
            <i class="iconfont icondaoru"></i>
            <span>导入</span>
          </el-button>
          <el-button size="small" @click="skuPoolExport()" v-if="$authorities.PurchaseGoodsExport">
            <i class="iconfont icondaochu"></i>
            <span>导出</span>
          </el-button>
          <el-button size="small" @click="importRecord()" v-if="$authorities.PurchaseGoodsImport">
            <i class="iconfont icondingdanguanli"></i>
            <span>导入记录</span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData"
          border
          :max-height="dataListHeight"
          style="width: 100%"
          :header-cell-style="tableStyle"
        >
          <el-table-column prop="skuNo" label="商品编号" align="center" width="120"></el-table-column>
          <el-table-column prop="oldErpSkuId" label="旧系统商品编号" align="center" width="120"></el-table-column>
          <el-table-column prop="skuName" label="名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryName" label="所属分类" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="buyingPrice" label="进价" align="center"></el-table-column>
          <el-table-column prop="competingSkuPrice" label="友商售价" align="center"></el-table-column>
          <el-table-column prop="sellingPrice" label="建议零售价" align="center"></el-table-column>
          <el-table-column prop="websitePrice" label="官网售价（含税）" align="center" width="140"></el-table-column>
          <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
          <el-table-column prop="websiteAvailableName" label="上下柜状态" align="center"></el-table-column>
          <el-table-column
            prop="organizationName"
            label="所属集采公司"
            align="center"
            show-overflow-tooltip
            width="120"
          ></el-table-column>
          <el-table-column prop="centralizedPrice" label="集采价格" align="center"></el-table-column>
          <el-table-column prop="minQty" label="起订量" align="center"></el-table-column>
          <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="showDialog('editorGoods',scope.row)"
                v-if="scope.row.organizationId == localId && $authorities.PurchaseGoodsEdit"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="openWin('GoodsDetail',{id: scope.row.skuId})"
                v-if="$authorities.PurchaseGoodsDetails"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteSkuPool(scope.row.id)"
                v-if="scope.row.organizationId == localId && $authorities.PurchaseGoodsDelete"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="findSkuPoolParam.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="findSkuPoolParam.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
    <importFile ref="importFile" :title="'商品信息批量导入'" :type="importType" @callback="dialogCallback"></importFile>
    <goods ref="addGoods" @callback="dialogCallback"></goods>
    <editorGood ref="editorGoods" @callback="dialogCallback"></editorGood>
  </div>
</template>

<script>
import {
  selectProduct,
  selectOrganization,
  findClassify,
  remoteBrandName,
  skuPoolList,
  skuPoolExport,
  deleteSkuPool,
  selectList
} from "@/api/purchase/purchaseCollectingPool";
import importFile from "@/components/common/module/ImportFile";
import goods from "./child/add_goods";
import editorGood from "./child/editor_goods";

export default {
  inject: ["reload", "isFilterShow"],
  name: "purchaseCollectingPool",
  data() {
    return {
      tableData: [],
      tableStyle: {
        background: "#f5f7fa"
      },
      isShow: this.isFilterShow,
      //模糊查詢
      searchskuNames: [],
      searchOrganizations: [],
      optionsClassify1: [],
      optionsClassify2: [],
      optionsClassify3: [],
      loadingClassify: false, //分类loading
      optionsBrand: [],
      options7: [
        { value: null, label: "全部" },
        { value: true, label: "已上柜" },
        { value: false, label: "待上柜" }
      ],
      findSkuPoolParam: {
        name: null, //商品名称
        oldErpSkuId: null, //旧系统商品编号
        organizationId: null, //集采公司组织机构id
        pageNum: 1, //页码 //
        pageSize: 10, //每页条数
        firstLevelCategoryId: null, //一级品类id
        secondLevelCategoryId: null, //二级品类id
        thirdLevelCategoryId: null, //三级品类id
        skuId: null, //商品id
        skuNo: null, //商品编号
        brandId: null, //品牌id
        primaryAttributeValue: null, //规格
        websiteAvailable: null //上下柜状态
      },
      total: null,

      importType: "purchase-skuPool-import",
      localId: null
    };
  },
  created() {
    this.skuPoolList();
    this.selectOrganization();
    let userPosts = JSON.parse(window.localStorage.getItem("UserInfo"))
      .userPosts;
    this.localId = userPosts[0].organizationId;
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  components: {
    importFile,
    goods,
    editorGood
  },
  methods: {
    search() {
      this.findSkuPoolParam.pageNum = 1;
      this.skuPoolList();
    },
    skuPoolList() {
      skuPoolList(this.findSkuPoolParam).then(res => {
        this.tableData = res.data.items;
        this.findSkuPoolParam.pageSize = res.data.pageSize;
        this.findSkuPoolParam.pageNum = res.data.pageNum;
        this.total = res.data.total;
      });
    },
    reset() {
      this.findSkuPoolParam = {
        name: null, //商品名称
        oldErpSkuId: null, //旧系统商品编号
        organizationId: null, //集采公司组织机构id
        pageNum: 1, //页码 //
        pageSize: 10, //每页条数
        firstLevelCategoryId: null, //一级品类id
        secondLevelCategoryId: null, //二级品类id
        thirdLevelCategoryId: null, //三级品类id
        skuId: null, //商品id
        skuNo: null, //商品编号
        brandId: null, //品牌id
        primaryAttributeValue: null, //规格
        websiteAvailable: null //上下柜状态
      };
      this.skuPoolList();
    },
    skuPoolExport() {
      skuPoolExport(this.findSkuPoolParam).then(res => {
        if (res.code == "000000") {
          this.$confirm("导出任务创建成功前往任务列表查看", "提示信息", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$router.push({
                name: "statisticsTaskTable",
                params: { isUpdate: true }
              });
            })
            .catch(() => {});
        }
      });
    },
    deleteSkuPool(id) {
      this.$confirm("该商品将从集采商品池中删除，是否确认？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSkuPool(id).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.skuPoolList();
          });
        })
        .catch(() => {});
    },
    //商品名称模糊查询
    skuNameMethod(query) {
      if (query != "") {
        selectProduct({ name: query })
          .then(res => {
            if (res.code === "000000") {
              this.searchskuNames = [
                { skuName: query, value: query },
                ...res.data
              ];
            }
          })
          .catch(err => {});
      } else {
        this.searchskuNames = [];
      }
    },
    //所属组织机构模糊查询
    selectOrganization() {
      selectOrganization().then(res => {
        this.searchOrganizations = res.data;
      });
    },
    remoteMethodClassify1(query) {
      if (query !== "") {
        this.loadingClassify = true;
        findClassify(1, 0, query).then(res => {
          if (res.code == "000000") {
            this.optionsClassify1 = res.data;
            this.loadingClassify = false;
          }
        });
      } else {
        this.optionsClassify1 = [];
      }
    },
    onchange1(val) {
      this.findSkuPoolParam.firstLevelCategoryId = val;
      this.findSkuPoolParam.secondLevelCategoryId = null;
      this.findSkuPoolParam.thirdLevelCategoryId = null;
      if (val) {
        this.getFirst(2, val);
      }
    },
    onchange2(val) {
      this.findSkuPoolParam.secondLevelCategoryId = val;
      this.findSkuPoolParam.thirdLevelCategoryId = null;
      if (val) {
        this.getFirst(3, val);
      }
    },
    getFirst(level, pid) {
      selectList(level, pid).then(res => {
        if (res.code == "000000") {
          if (level == 1) {
            this.ptionsClassify1 = res.data;
          } else if (level == 2) {
            this.optionsClassify2 = res.data;
          } else if (level == 3) {
            this.optionsClassify3 = res.data;
          }
        }
      });
    },
    remoteMethodClassify2(query) {
      if (query !== "") {
        this.loadingClassify = true;
        if (this.findSkuPoolParam.firstLevelCategoryId) {
          findClassify(2, this.findSkuPoolParam.firstLevelCategoryId, query).then(
            res => {
              if (res.code == "000000") {
                this.optionsClassify2 = res.data;
                this.loadingClassify = false;
              }
            }
          );
        } else {
          findClassify(2, 0, query).then(res => {
            if (res.code == "000000") {
              this.optionsClassify2 = res.data;
              this.loadingClassify = false;
            }
          });
        }
      } else {
        this.optionsClassify2 = [];
      }
    },
    remoteMethodClassify3(query) {
      if (query !== "") {
        this.loadingClassify = true;
        if (this.findSkuPoolParam.secondLevelCategoryId) {
          findClassify(
            3,
            this.findSkuPoolParam.secondLevelCategoryId,
            query
          ).then(res => {
            if (res.code == "000000") {
              this.optionsClassify3 = res.data;
              this.loadingClassify = false;
            }
          });
        } else {
          findClassify(3, 0, query).then(res => {
            if (res.code == "000000") {
              this.optionsClassify3 = res.data;
              this.loadingClassify = false;
            }
          });
        }
      } else {
        this.optionsClassify3 = [];
      }
    },
    //品牌模糊查
    remoteMethodBrand(query) {
      if (query !== "") {
        this.loadingBrand = true;
        let aa = { name: query };
        remoteBrandName(aa).then(res => {
          if (res.code == "000000") {
            this.optionsBrand = res.data.map(item => {
              if (item.nameEN) {
                return {
                  id: item.id,
                  brandName: item.nameCN + "-" + item.nameEN
                };
              } else {
                return { id: item.id, brandName: item.nameCN };
              }
            });
            this.loadingBrand = false;
          }
        });
      } else {
        this.optionsBrand = [];
      }
    },
    dialogCallback(type) {
      if (type == "editorGoods") {
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.skuPoolList();
      }
      if (type == "addGoods") {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.skuPoolList();
      }
      if (type == "tag") {
        this.skuPoolList()
      }
    },
    importRecord() {
      this.$router.push({ name: "skuPoolImportRecord" });
    },
    //导入
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    openWin(name, query) {
      this.$router.push({ name: name, query: query });
    },
    handleSizeChange(val) {
      this.findSkuPoolParam.pageSize = val;
      this.skuPoolList();
    },
    handleCurrentChange(val) {
      this.findSkuPoolParam.pageNum = val;
      this.skuPoolList();
    }
  }
};
</script>

<style lang='less' scoped>
.demandBox {
  width: 100%;
  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      overflow: hidden;
      height: 45px;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 0 0 10px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 25%;
        display: flex;
        align-items: center;
        span {
          text-align: right;
          flex: 0 0 120px;
        }
      }
      .inputBox2 {
        display: flex;
        align-items: center;
        span {
          text-align: right;
          flex: 0 0 98px;
        }
      }
      .el-input {
        max-width: 200px;
        padding: 5px;
      }
      .el-select {
        max-width: 200px;
        padding: 5px;
      }
    }
  }
  .listBox {
    border: 1px solid #e4e4e4;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f3f3f3;
      height: 50px;
      .listLeft {
        i {
          padding: 0 5px 0 20px;
        }
      }
      .listRight {
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  }
  .block {
    margin: 5px 10px;
    text-align: right;
  }
}
</style>
