<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div style="border-bottom: 1px solid #e4e4e4;height: 50px">
          <p class="title">项目:{{shoppeName}}</p>
        </div>
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="clearForm">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
        <span>商品编号：</span>
        <el-input placeholder="商品编号" v-model="query.skuNo" clearable></el-input>
        <span>商品名称：</span>
        <el-select
          v-model="query.name"
          filterable
          remote
          placeholder="商品名称"
          :remote-method="(query)=>{
            querySearch(query,'skuName','remoteSkuList')
          }"
          :loading="remoteLoading"
          clearable
        >
          <el-option
            v-for="item in remoteSkuList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>一级分类：</span>
        <el-select
          v-model="query.firstLevelCategoryId"
          clearable
          placeholder="一级分类"
          @change="firstChange"
        >
          <el-option v-for="item in firstClass" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span>二级分类：</span>
        <el-select
          v-model="query.secondLevelCategoryId"
          clearable
          placeholder="二级分类"
          @change="secondChange"
        >
          <el-option v-for="item in secondClass" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span>三级分类：</span>
        <el-select v-model="query.thirdLevelCategoryId" clearable placeholder="三级分类">
          <el-option v-for="item in thirdClass" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div style="margin-bottom: 10px">
          <span>最低价格：</span>
          <el-input placeholder="最低价格" v-model="query.projectPriceStart" clearable></el-input>
          <span>最高价格：</span>
          <el-input placeholder="最高价格" v-model="query.projectPriceEnd" clearable></el-input>
          <span>一级导航：</span>
          <el-select
            v-model="query.firstLevelNavigationId"
            filterable
            remote
            placeholder="一级导航"
            :remote-method="(query)=>{
            querySearch(query,'navigate1','remoteNavFirstList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteNavFirstList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>二级导航：</span>
          <el-select
            v-model="query.secondLevelNavigationId"
            filterable
            remote
            placeholder="二级导航"
            :remote-method="(query)=>{
            querySearch(query,'navigate2','remoteNavSecondList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteNavSecondList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>三级导航：</span>
          <el-select
            v-model="query.thirdLevelNavigationId"
            filterable
            remote
            placeholder="三级导航"
            :remote-method="(query)=>{
            querySearch(query,'navigate3','remoteNavThirdList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteNavThirdList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>品牌名称：</span>
          <el-select
            v-model="query.brandId"
            filterable
            remote
            placeholder="品牌名称"
            :remote-method="(query)=>{
            querySearch(query,'brandid','remoteBrandIdList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteBrandIdList"
              :key="item.id+item.nameCN"
              :label="item.nameCN"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          &nbsp;<span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div
            class="button-head"
            @click="showDialog('setRelease', {shoppeId:shoppeId})"
            style="width: 100px"
            v-if="$authorities.ShoppeGoodsReleaseRelevant"
          >
            <i class="iconkuaijierukou iconfont button-head-icon"></i>发布
            <span v-if="releaseCount!=0">({{releaseCount}})</span>
          </div>
          <div
            class="button-head"
            @click="oepnWin('ShoppeAddGoods',{ id: shoppeId, type: 1, shoppe: shoppeName })"
            v-if="$authorities.ShoppeGoodsAdd"
          >
            <i class="icontianjiashangpin iconfont button-head-icon" style="font-size:14px;"></i>添加商品
          </div>
          <div
            class="button-head"
            @click="opaBetchDel()"
            v-if="$authorities.ShoppeGoodsBatchDelete"
          >
            <i class="iconshanchu iconfont button-head-icon"></i>批量删除
          </div>
          <div
            class="button-head"
            @click="opaBetchSaleStatus(1)"
            v-if="$authorities.ShoppeGoodsBatchShelveUp"
          >
            <i class="iconshangjia- iconfont button-head-icon"></i>批量上架
          </div>
          <div
            class="button-head"
            @click="opaBetchSaleStatus(0)"
            v-if="$authorities.ShoppeGoodsBatchShelveDown"
          >
            <i class="iconxiajia- iconfont button-head-icon"></i>批量下架
          </div>
          <div
            class="button-head"
            @click="showDialog('setLimitPrice', {shoppeId:shoppeId})"
            v-if="$authorities.ShoppeGoodsSetLimitPrice"
          >
            <i class="iconhuikuanxinxi iconfont button-head-icon"></i>设置限价
          </div>
          <div class="button-head" @click="exportData()" v-if="$authorities.ShoppeGoodsExport">
            <i class="icondaochu iconfont button-head-icon"></i>导出
          </div>
          <div
            class="button-head"
            @click="showDialog('importFile')"
            v-if="$authorities.ShoppeGoodsImportRelevant"
          >
            <i class="icondaoru iconfont button-head-icon"></i>导入
          </div>
          <div
            class="button-head"
            @click="oepnWin('SysImportRecord',{ id: shoppeId, type: 'release-shoppe-import-list' })"
            v-if="$authorities.ShoppeGoodsImportRelevant"
          >
            <i class="icondingdanguanli iconfont button-head-icon"></i>导入记录
          </div>
          <div
            class="button-head"
            @click="oepnWin('SysReleaseRecord',{ id: shoppeId, type: 'shoppe-release-history' })"
            v-if="$authorities.ShoppeGoodsReleaseRelevant"
          >
            <i class="icondingdanguanli iconfont button-head-icon"></i>发布记录
          </div>
          <div
            class="button-head"
            @click="oepnWin('SysOperationRecord',{ id: shoppeId, shoppeName: shoppeName, type: 'shoppe-operation-record'})"
            style="width: 100px"
            v-if="$authorities.ShoppeGoodsOpaRecord"
          >
            <i class="icondingdanguanli iconfont button-head-icon"></i>操作记录
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight"
        style="width: 100%"
        size="small"
        :cell-class-name="filterCell"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="categoryName" label="所属分类" align="center"></el-table-column>
        <el-table-column prop="navigationName" label="所属导航" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showDialog('showInfo',{shoppeId: shoppeId, skuId: scope.row.id})"
            >{{scope.row.navigationName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="buyingPrice" label="采购价（含税）" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="sellingPrice" label="建议零售价" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="websitePrice" label="官网售价" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="projectPrice" label="项目售价" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="limitedPrice" label="限价" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="grossProfitRate" label="毛利率" align="center"></el-table-column>
        <el-table-column prop="tags" label="标签" align="center"></el-table-column>
        <el-table-column prop="shelveStatusName" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180px" fixed="right">
          <template slot-scope="scope">
            <el-button @click="opaSaleStatus(scope.row)" type="text" size="small" v-if="$authorities.ShoppeGoodsShelveUp && scope.row.shelveStatus">
              <template>上架</template>
            </el-button>
            <el-button @click="opaSaleStatus(scope.row)" type="text" size="small" v-if="$authorities.ShoppeGoodsShelveDown && !scope.row.shelveStatus">
              <template>上架</template>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="showDialog('setSalePrice',{shoppeId:shoppeId, row:scope.row})"
              v-if="$authorities.ShoppeGoodsSetPrice"
            >设置售价</el-button>
            <el-button
              type="text"
              size="small"
              @click="showDialog('setTag',{shoppeId:shoppeId, row:scope.row})"
              v-if="$authorities.ShoppeGoodsSetTag"
            >设置标签</el-button>
            <el-button type="text" size="small" @click="opaDel(scope.row)" v-if="$authorities.ShoppeGoodsDelete">删除</el-button>
            <el-button
              type="text"
              size="small"
              @click="oepnWin('ShoppeGoodsDetail',{ shoppeId: shoppeId, skuId: scope.row.id })"
              v-if="$authorities.ShoppeGoodsDetail"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="query.pageSize"
          layout="total,sizes,prev, pager, next, jumper"
          style="height: 32px;"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
    <setSalePrice ref="setSalePrice" @callback="dialogCallback"></setSalePrice>
    <setStock ref="setStock" @callback="dialogCallback"></setStock>
    <setTag ref="setTag" @callback="dialogCallback"></setTag>
    <setRelease ref="setRelease" @callback="dialogCallback"></setRelease>
    <setLimitPrice ref="setLimitPrice" @callback="dialogCallback"></setLimitPrice>
    <showInfo ref="showInfo"></showInfo>
    <importFile
      ref="importFile"
      :title="'商品信息批量导入'"
      :type="importType"
      @callback="dialogCallback"
      :params="{id:shoppeId}"
    ></importFile>
  </div>
</template>
<script>
import { returnFloat } from "@/utils/index";
import {
  getShoppeSkuList,
  shoppeGoodsShelve,
  shoppeGoodsShelveBetch,
  exportSkuList,
  delShoppeGoods,
  delShoppeGoodsBetch,
  getReleaseCount,
  getNavTitle
} from "@/api/release/specialProjectManage";
import { remoteBrandName } from "@/api/brandManage";
import { selectList } from "@/api/classManage";
import { nameList } from "@/api/release/navManage";
import setSalePrice from "./child/set_sale_price";
import setStock from "./child/set_stock";
import setTag from "./child/set_tag";
import setRelease from "./child/set_release";
import setLimitPrice from "./child/set_limit_price";
import showInfo from "./child/show_info";
import importFile from "@/components/common/module/ImportFile";
export default {
  inject: ["reload","isFilterShow"],
  name:"ShoppeGoodsManage",
  data() {
    return {
      shoppeId: "",
      shoppeName: "",
      remoteLoading: false, //筛选查询loading
      remoteSkuList: null,
      remoteBrandIdList: null,
      remoteNavFirstList: null,
      remoteNavSecondList: null,
      remoteNavThirdList: null,
      firstClass: [],
      secondClass: [],
      thirdClass: [],
      queryLevel:"",
      query: {
        brandId: "", //品牌id
        firstLevelCategoryId: "", //一级分类
        secondLevelCategoryId: "", //二级分类
        thirdLevelCategoryId: "", //三级分类
        firstLevelNavigationId: "", //一级导航id
        secondLevelNavigationId: "", //二级导航id
        thirdLevelNavigationId: "", //二级导航id
        name: "", //商品名称
        projectPriceEnd: "", //项目最高售价
        projectPriceStart: "", //项目最低售价
        skuNo: "", //商品编号
        pageNum: 1,
        pageSize: 10
      },
      isShow: this.isFilterShow,
      importType: "release-shoppe-goods-import",
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      releaseCount: 0, //需要发布的内容数量
      tableData: null,
      totalPage: 0,
      multipleSelection: [] //选中的商品集合
    };
  },
  components: {
    setSalePrice,
    setStock,
    setTag,
    setRelease,
    setLimitPrice,
    showInfo,
    importFile
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.params.isUpdate || this.$route.query.id != this.shoppeId || this.$route.query.level != this.queryLevel){
      this.init();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    init(){
      this.shoppeId = this.$route.query.id;
      this.shoppeName = this.$route.query.shoppe;
      this.queryLevel = this.$route.query.level;
      if (this.queryLevel == 1) {
        this.query.firstLevelNavigationId = this.$route.query.navId;
      } else if (this.queryLevel == 2) {
        this.query.secondLevelNavigationId = this.$route.query.navId;
      } else if (this.queryLevel == 3) {
        this.query.thirdLevelNavigationId = this.$route.query.navId;
      }
      //获取表格数据
      this.getTableData();
      this.getReleaseCount();
      this.getFirst();
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    clearForm() {
      this.query = {
        brandId: "", //品牌id
        firstLevelCategoryId: "", //一级分类
        secondLevelCategoryId: "", //二级分类
        thirdLevelCategoryId: "", //三级分类
        firstLevelNavigationId: "", //一级导航id
        secondLevelNavigationId: "", //二级导航id
        thirdLevelNavigationId: "", //二级导航id
        name: "", //商品名称
        projectPriceEnd: "", //项目最高售价
        projectPriceStart: "", //项目最低售价
        skuNo: "", //商品编号
        pageNum: 1,
        pageSize: 10
      };
      this.getTableData();
    },
    //获取表格数据
    getTableData() {
      getShoppeSkuList(this.shoppeId, this.query).then(res => {
        this.tableData = res.data.pageInfo.items;
        this.totalPage = res.data.pageInfo.total;
      });
    },
    getReleaseCount() {
      getReleaseCount(this.shoppeId).then(res => {
        this.releaseCount = res.data;
      });
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "skuName") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "brandid") {
          remoteBrandName({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "navigate1") {
          getNavTitle(this.shoppeId, "first", { name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "navigate2") {
          if (!this.query.firstLevelNavigationId) {
            this.$message({
              type: "warning",
              message: `请先选择一级导航`
            });
            return false;
          }
          getNavTitle(this.shoppeId, "second", {
            name: query,
            firstLevelId: this.query.firstLevelNavigationId
          }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "navigate3") {
          if (!this.query.secondLevelNavigationId) {
            this.$message({
              type: "warning",
              message: `请先选择二级导航`
            });
            return false;
          }
          getNavTitle(this.shoppeId, "third", {
            name: query,
            secondLevelId: this.query.secondLevelNavigationId
          }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else {
          this[list] = [];
          this.remoteLoading = false;
        }
      } else {
        this[list] = [];
      }
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    },
    filterCell(cell) {
      if (
        (cell.columnIndex == 9 &&
          cell.row.projectPrice > cell.row.limitedPrice) ||
        (cell.columnIndex == 11 &&
          cell.row.grossProfitRate &&
          cell.row.grossProfitRate.indexOf("-") == 0)
      ) {
        return "setred";
      }
    },
    opaSaleStatus(row) {
      let sName = row.shelveStatus ? "下架" : "上架",
        sCon = row.shelveStatus
          ? "下架之后，此商品不在专柜中显示且不可下单？"
          : "上架之后，此商品提供给商城客户展示使用";
      this.$confirm(sCon, `${sName}提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          shoppeGoodsShelve(
            this.shoppeId,
            row.id,
            row.shelveStatus ? "unshelve" : "shelve"
          ).then(res => {
            this.getTableData();
            this.$message({
              type: "success",
              message: `${sName}成功!`
            });
          });
        })
        .catch(() => {});
    },
    opaBetchSaleStatus(type) {
      let sName = type == 1 ? "上架" : "下架",
        sCon =
          type == 1
            ? "上架之后，此商品提供给商城客户展示使用"
            : "下架之后，此商品不在专柜中显示且不可下单？";
      if (!this.multipleSelection.length) {
        return this.$message({
          message: `请选择要${sName}的商品`,
          type: "warning"
        });
      }

      let arr = [];
      arr = this.multipleSelection.map(function(value, index, array) {
        return value.id;
      });

      this.$confirm(sCon, `${sName}提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          shoppeGoodsShelveBetch(
            this.shoppeId,
            type == 1 ? "shelve" : "unshelve",
            arr
          ).then(res => {
            this.getTableData();
            this.$message({
              type: "success",
              message: `批量${sName}成功!`
            });
          });
        })
        .catch(() => {});
    },
    opaDel(row) {
      this.$confirm("删除之后，此商品不在专柜中展示确定删除吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delShoppeGoods(this.shoppeId, row.id).then(res => {
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    opaBetchDel() {
      if (!this.multipleSelection.length) {
        return this.$message({
          message: "请选择要删除的商品",
          type: "warning"
        });
      }
      //过滤选择
      let arr = [];
      arr = this.multipleSelection.map(function(value, index, array) {
        return value.id;
      });
      this.$confirm("删除之后，此商品不在专柜中展示确定删除吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delShoppeGoodsBetch(this.shoppeId, arr).then(res => {
            this.getTableData();
            this.$message({
              type: "success",
              message: "批量删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getFirst() {
      selectList(1, 1).then(res => {
        if (res.code == "000000") {
          this.firstClass = res.data;
        }
      });
    },
    getSecond(val) {
      selectList(2, val).then(res => {
        if (res.code == "000000") {
          this.secondClass = res.data;
        }
      });
    },
    getThird(val) {
      selectList(3, val).then(res => {
        if (res.code == "000000") {
          this.thirdClass = res.data;
        }
      });
    },
    firstChange(val) {
      if (val) {
        this.getSecond(val);
      }
    },
    secondChange(val) {
      if (val) {
        this.getThird(val);
      }
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback(type) {
      if (type == "salePrice" || type == "setTag") {
        this.getTableData();
      } else if (type == "shoppeRelease") {
        this.$message({
          type: "success",
          message: "发布成功，前台已同步更新!"
        });
        this.getReleaseCount();
      }
    },
    oepnWin(name, query) {
      this.$router.push({name : name, query : query});
    },
    downfile(id) {
      let href =
        "/api/file-service/file/download?id=" +
        id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    },
    exportData() {
      exportSkuList(this.shoppeId, this.query).then(res => {
        if (res.code != "000000") {
          this.$message({
            message: "导出失败",
            type: "warning"
          });
        } else {
          //通过返回id调用downfile
          this.downfile(res.data);
        }
      });
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  clear: both;
  .buttonBox {
    margin-top: 10px;
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
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      /* height: 50px;
        line-height: 50px;*/
      line-height: 50px;
    }
    .title {
      margin-left: 10px;
      font-size: 14px;
      line-height: 50px;
      cursor: pointer;
      color: #339999;
      display: inline-block;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
      color: #303133;
      display: inline-block;
      width: 80px;
      text-align: right;
    }
    .rightBox {
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 5px;
    }
    .homeBoxBottom {
      //height: 56px;
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 140px;
        height: 40px;
        // line-height: 56px;
        margin-top: 10px;
        margin-left: 10px;
      }
      .el-select {
        margin-left: 10px;
      }
    }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    line-height: 50px;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      .listBoxTop-left {
        width: 110px;
        display: flex;
        .myicon {
          margin-left: 10px;
        }
        span {
          font-size: 14px;
          color: #303133;
          line-height: 50px;
          display: inline-block;
          width: 60px;
        }
      }
    }
    .listBoxRight {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;
      flex-wrap: wrap;
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
        span {
          color: red;
        }
        .button-head-icon {
          margin-right: 5px;
        }
        .icon-add {
          font-size: 12px;
        }
        .icon-plane {
          font-size: 12px;
          font-weight: 700;
        }
      }
      .button-head:hover {
        color: #339999;
        border-color: #c2e0e0;
        background-color: #ebf5f5;
      }
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
        border-color: #d1d1d1;
      }
      .btn {
        margin-top: 10px;
        margin-right: 10px;
        font-size: 14px;
        background: #fff;
        color: #606266;
        border-radius: 3px;
        display: inline-block;
        line-height: 30px;
        font-weight: 500;
        white-space: nowrap;
        text-align: center;
        border: 1px solid #c2e0e0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 80px;
        height: 30px;
        &:hover {
          text-decoration: none;
          border: 1px solid #339999;
          color: #339999;
        }
      }
    }
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
    }
  }
  .block {
    margin-top: 10px;
    text-align: right;
  }
}
.el-row {
  line-height: 30px;
  font-size: 14px;
}
</style>
<style scoped>
.listBox >>> .setred {
  color: red;
}
</style>
