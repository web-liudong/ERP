<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div style="border-bottom: 1px solid #e4e4e4;height: 50px">
          <p class="title">
            项目：{{shoppeName}}
            <span>导航：{{navName}}</span>
          </p>
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
        <span>商品ID：</span>
        <el-input placeholder="商品ID或名称" v-model="query.skuId" clearable></el-input>
        <span>商品名称：</span>
        <el-input placeholder="商品名称" v-model="query.name" clearable></el-input>
        <span>一级分类：</span>
        <el-input placeholder="一级分类" v-model="query.firstLevelCategoryId" clearable></el-input>
        <span>二级分类：</span>
        <el-input placeholder="二级分类" v-model="query.secondLevelCategoryId" clearable></el-input>
        <span>三级分类：</span>
        <el-input placeholder="三级分类" v-model="query.thirdLevelCategoryId" clearable></el-input>
        <div style="margin-bottom: 10px">
          <span>最低价格：</span>
          <el-input placeholder="最低价格" v-model="query.priceStart" clearable></el-input>
          <span>最高价格：</span>
          <el-input placeholder="最高价格" v-model="query.priceEnd" clearable></el-input>
          <span>品牌名称：</span>
          <el-input placeholder="品牌名称" v-model="query.brandId" clearable></el-input>
        </div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="toAddGoods()">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加
          </div>
          <div class="button-head" @click="importRecord()">
            <i class="icon-batch-import iconfont button-head-icon"></i>导出
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight"
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="categoryName" label="所属分类" align="center"></el-table-column>
        <el-table-column prop="navigationName" label="所属导航" align="center"></el-table-column>
        <el-table-column prop="buyingPrice" label="采购价（含税）" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="competingSkuPrice" label="友商售价" align="center">
          <div slot-scope="scope" v-if="scope.row.competingSkuUrl == ''">{{`￥${returnFloat(scope.row.competingSkuPrice)}`}}</div>
          <div slot-scope="scope" v-else>
            <el-button type="text" size="small" @click="oepnWin(scope.row.competingSkuUrl)">{{`￥${returnFloat(scope.row.competingSkuPrice)}`}}</el-button>
          </div>
        </el-table-column>
        <el-table-column prop="websitePrice" label="官网售价（含税）" align="center" :formatter="formatPrice"></el-table-column>
        <el-table-column prop="shelveStatus" label="状态" align="center">
          <template slot-scope="scope">{{scope.row.shelveStatus ? "上架" : "下架"}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="opaDel(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="opaSetTop(scope.row)">置顶</el-button>
            <el-button type="text" size="small" @click="toDetail(scope.row)">详情</el-button>
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
  </div>
</template>
<script>
import { returnFloat } from "@/utils/index";
import {
  getNavnSkuList,
  delNavRelationGoods,
  setRelationGoodsTop
} from "@/api/release/specialProjectManage";
export default {
  inject: ["reload","isFilterShow"],
  name:"ShoppeRelevantGoodsManage",
  data() {
    return {
      shoppeId:'',
      shoppeName: "",
      navName: "",
      navId: "", //导航id
      query: {
        brandId: "", //品牌id
        firstLevelCategoryId: "",
        secondLevelCategoryId: "",
        thirdLevelCategoryId: "",
        name: "",
        skuId: "",
        priceEnd: "",
        priceStart: "",
        pageNum: 1,
        pageSize: 10
      },
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      tableData: null,
      totalPage: 0,
      multipleSelection: [] //选中的商品集合
    };
  },
  components: {},
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.params.isUpdate || this.$route.query.shoppeId != this.shoppeId || this.$route.query.id != this.navId){
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
      this.shoppeId = this.$route.query.shoppeId;
      this.shoppeName = this.$route.query.shoppe;
      this.navId = this.$route.query.id;
      //获取表格数据
      this.getTableData();
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
        firstLevelCategoryId: "",
        secondLevelCategoryId: "",
        thirdLevelCategoryId: "",
        name: "",
        skuId: "",
        priceEnd: "",
        priceStart: "",
        pageNum: 1,
        pageSize: 10
      };
      this.getTableData();
    },
    //获取表格数据
    getTableData() {
      getNavnSkuList(this.navId, this.query).then(res => {
        this.navName = res.data.navigationName;
        this.tableData = res.data.pageInfo.items;
        this.totalPage = res.data.pageInfo.total;
      });
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    },
    opaBetchSaleStatus(type) {
      let str = type == 1 ? "上架" : "下架";
      if (!this.multipleSelection.length) {
        return this.$message({
          message: `请选择要${str}的商品`,
          type: "warning"
        });
      }
      let arr = [];
      arr = this.multipleSelection.map(function(value, index, array) {
        return value.id;
      });
      this.opaSaleStatus();
    },
    opaDel(row) {
      this.$confirm("删除之后，此商品从该导航下删除?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delNavRelationGoods(this.navId, row.id).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toDetail(row) {
      this.$router.push({name : "ShoppeGoodsDetail", query : { shoppeId: this.shoppeId, skuId: row.id }});
    },
    toAddGoods() {
      this.$router.push({name : "ShoppeAddGoods", query : { id: this.navId, type:2 }});
    },
    oepnWin(name) {
      let url = name.indexOf("http") == -1 ? "//"+name : name;
      window.open(url, "_blank");
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    returnFloat(num) {
      return returnFloat(num);
    },
    opaSetTop(row) {
      setRelationGoodsTop(this.navId, row.id).then(res => {
        this.queryForm();
        this.$alert("商品已置顶", "操作成功", {
          confirmButtonText: "确定",
          type: "success",
          center: true
        });
      });
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
      span {
        width: auto;
      }
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
          margin-left: 20px;
          font-weight: bold;
          font-size: 20px;
        }
        span {
          margin-left: 5px;
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