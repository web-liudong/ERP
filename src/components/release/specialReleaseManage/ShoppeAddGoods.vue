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
            <i class="iconfont icon-top" v-show="isShow"></i>
            <i class="iconfont icon-xia" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="clearForm">重置</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-if="isShow">
        <span>商品编号：</span>
        <el-input placeholder="商品编号" v-model="query.skuNo" clearable></el-input>
        <span>商品名称：</span>
        <el-input placeholder="商品名称" v-model="query.name" clearable></el-input>
        <span>一级分类：</span>
        <el-input placeholder="一级分类" v-model="query.firstLevelCategoryId" clearable></el-input>
        <span>二级分类：</span>
        <el-input placeholder="二级分类" v-model="query.secondLevelCategoryId" clearable></el-input>
        <span>三级分类：</span>
        <el-input placeholder="三级分类" v-model="query.thirdLevelCategoryId" clearable></el-input>
        <div style="margin-bottom: 10px">
          <span>最高价格：</span>
          <el-input placeholder="最高价格" v-model="query.priceEnd" clearable></el-input>
          <span>最低价格：</span>
          <el-input placeholder="最低价格" v-model="query.priceStart" clearable></el-input>
          <span>品牌名称：</span>
          <el-input placeholder="品牌名称" v-model="query.brandId" clearable></el-input>
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="batchAdd">
            <i class="iconfont icon-chakandaorujilu"></i>批量添加
          </div>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small"
          ref="addGoodsTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
          <el-table-column prop="categoryName" label="所属分类" align="center"></el-table-column>
          <el-table-column prop="buyingPrice" label="采购价(含税)" align="center"></el-table-column>
          <el-table-column prop="competingSkuPrice" label="友商售价" align="center"></el-table-column>
          <el-table-column prop="sellingPrice" label="建议零售价" align="center"></el-table-column>
          <el-table-column prop="websitePrice" label="官网售价(含税)" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="180px">
            <template slot-scope="scope">
              <el-button @click="addGoods(scope.row)" type="text" size="small">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="query.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="query.pageSize"
          layout="total,sizes,prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getShoppePubSkuList,
  getNavAddSkuList,
  addSkuToShoppe,
  addSkuToNav,
  addSkuToShoppeBetch,
  addSkuToNavBetch
} from "@/api/release/specialProjectManage";
export default {
  inject: ["reload","isFilterShow"],
  name:"ShoppeAddGoods",
  data() {
    return {
      shoppeName: "",
      reqId: "",
      type: 0, //区分专柜添加(1)和导航关联(2)
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      tableData: null,
      totalPage: 0,
      multipleSelection: [], //选中的商品集合
      query: {
        brandId: "", //品牌id
        firstLevelCategoryId: "", //一级分类
        secondLevelCategoryId: "", //二级分类
        thirdLevelCategoryId: "", //三级分类
        name: "", //商品名称
        priceEnd: "", //项目最高售价
        priceStart: "", //项目最低售价
        skuId: "", //商品ID
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  components: {},
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.reqId || this.$route.query.type != this.type){
      this.init();
    }
  },
  methods: {
    init(){
      this.reqId = this.$route.query.id;
      this.type = this.$route.query.type;
      this.shoppeName = this.$route.query.shoppe;
      //专柜添加
      if (this.type == 1) {
        this.getTableData();
      } else {
        //导航关联
        this.getNavTableData();
      }
    },
    //获取表格数据
    getTableData() {
      getShoppePubSkuList(this.reqId, this.query).then(res => {
        this.tableData = res.data.pageInfo.items;
        this.totalPage = res.data.pageInfo.total;
      });
    },
    getNavTableData() {
      getNavAddSkuList(this.reqId, this.query).then(res => {
        this.tableData = res.data.pageInfo.items;
        this.totalPage = res.data.pageInfo.total;
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      if (this.type == 1) {
        this.getTableData();
      } else {
        this.getNavTableData();
      }
    },
    clearForm() {
      this.query = {
        brandId: "", //品牌id
        firstLevelCategoryId: "", //一级分类
        secondLevelCategoryId: "", //二级分类
        thirdLevelCategoryId: "", //三级分类
        name: "", //商品名称
        priceEnd: "", //项目最高售价
        priceStart: "", //项目最低售价
        skuId: "", //商品ID
        pageNum: 1,
        pageSize: 10
      };
      if (this.type == 1) {
        this.getTableData();
      } else {
        this.getNavTableData();
      }
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    batchAdd() {
      if (!this.multipleSelection.length) {
        return this.$message({
          message: "请选择要添加的商品",
          type: "warning"
        });
      }
      //过滤选择
      let arr = [];
      arr = this.multipleSelection.map(function(value, index, array) {
        return value.id;
      });
      this.$confirm("确定将此商品添加到项目中吗？", "添加提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let fun = this.type == 1 ? addSkuToShoppeBetch : addSkuToNavBetch;
          fun(this.reqId, arr).then(res => {
            if (res.data.successNum == 0) {
              this.$message({
                type: "warning",
                message: "所选商品已存在，不能重复添加"
              });
            } else {
              this.queryForm();
              const h = this.$createElement;
              let tempArr = [h('span', { style: 'color: #67c23a' }, `成功添加${res.data.successNum}件商品`)]
              if(res.data.failNum > 0){
                tempArr.push(h('span', { style: 'color: red' }, `，${res.data.failNum}件添加失败`))
              }
              this.$message({
                type: "success",
                message: h('p', null, tempArr)
              });
            }
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addGoods(row) {
      this.$confirm("确定将此商品添加到项目中吗？", "添加提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let fun = this.type == 1 ? addSkuToShoppe : addSkuToNav;
          fun(this.reqId, row.id).then(res => {
            if (res.data.successNum == 0) {
              this.$message({
                type: "warning",
                message: "该商品已存在，不能重复添加"
              });
            } else {
              this.queryForm();
              this.$message({
                type: "success",
                message: "商品添加成功!"
              });
            }
          });
        })
        .catch(() => {});
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
      // height: 56px;
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
    margin: 20px 0 0 0;
    line-height: 50px;
    .listBoxTop {
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
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
</style>