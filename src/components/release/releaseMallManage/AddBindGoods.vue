<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div style="border-bottom: 1px solid #e4e4e4;height: 50px">
          <p class="title" style="color:red">项目：{{projectName}}</p>
        </div>
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer;margin-right:10px">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="findMallSkuParamForm()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-if="isShow">
        <span>商品编号：</span>
        <el-input placeholder="商品编号" v-model="findMallSkuParam.skuNo" clearable></el-input>
        <span>商品名称：</span>
        <el-input placeholder="商品名称" v-model="findMallSkuParam.skuName" clearable></el-input>
        <span>一级分类：</span>
        <el-input placeholder="一级分类" v-model="findMallSkuParam.firstLevelCategoryId" clearable></el-input>
        <span>二级分类：</span>
        <el-input placeholder="二级分类" v-model="findMallSkuParam.secondLevelCategoryId" clearable></el-input>
        <span>三级分类：</span>
        <el-input placeholder="三级分类" v-model="findMallSkuParam.thirdLevelCategoryId" clearable></el-input>
        <div style="margin-bottom: 10px">
          <span>最低价格：</span>
          <el-input placeholder="最低价格" v-model="findMallSkuParam.minPrice" clearable></el-input>
          <span>最高价格：</span>
          <el-input placeholder="最高价格" v-model="findMallSkuParam.maxPrice" clearable></el-input>
          <span>品牌名称：</span>
          <el-input placeholder="品牌id" v-if="false" v-model="findMallSkuParam.brandId" clearable></el-input>
          <el-input placeholder="品牌名称" v-model="findMallSkuParam.brandName" clearable></el-input>
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont icon-findMallSkuParamlist"></i>数据列表
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
          <el-table-column prop="skuName" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="brandNameCN" label="品牌" align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0">{{scope.row.brandNameCN}}</span>
              <span
                style="font-size: 12px;margin-left: 0"
                v-if="(scope.row.brandNameEN)!=0"
              >({{scope.row.brandNameEN}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="statusName" label="所属分类" align="center">
            <template slot-scope="scope">{{scope.row.firstLevelCategoryName}}>{{scope.row.secondLevelCategoryName}}>{{scope.row.thirdLevelCategoryName}}</template>
          </el-table-column>
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
          :current-page.sync="findMallSkuParam.pageNum"
          :page-size="findMallSkuParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="totalPage"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { addGoodsMall,addBatchGoods,addGoodsCorrespond,addBatchGoodsCorrespond,batchGoodsList} from "@/api/release/mallProjectManage";
export default {
  inject: ["reload",'close'],
  name:'AddBindGoods',
  data() {
    return {
      list: [],
      isShow: true,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      loading1: false,
      tableData: null,
      totalPage: 0,
      multipleSelection: [], //选中的商品集合
      mallId:null,
      //项目名称
      projectName:null,
      mallCategoryMatchId:null,
      findMallSkuParam: {
        pageNum: 1,
        pageSize: 10,
        brandId: null ,//品牌id
        firstLevelCategoryId: null,
        mallCategoryMatchId: null,
        mallId: null,
        maxPrice: null,
        minPrice: null,
        secondLevelCategoryId: null,
        skuId: null,
        skuNo: null,
        skuName: null,
        thirdLevelCategoryId: null,
      },  
    };
  },
  components: {},
  created() {
    this.mallId=this.$route.query.mallId;
    this.projectName=this.$route.query.projectName;
    this.mallCategoryMatchId=this.$route.query.mallCategoryMatchId;
    this.findMallSkuParam.mallId=this.$route.query.mallId;
    //获取表格数据
    this.getTableData();
  },
  activated(){
   if(this.$route.query.mallId&&this.mallId!=this.$route.query.mallId){
     this.mallId=this.$route.query.mallId;
    this.projectName=this.$route.query.projectName;
    this.mallCategoryMatchId=this.$route.query.mallCategoryMatchId;
    this.findMallSkuParam.mallId=this.$route.query.mallId;
    //获取表格数据
    this.getTableData();
   }
   if(this.$route.params.isUpdate){
     this.getTableData()
   }
  },
  mounted(){
  },
  methods: {
    reset(){
     this.findMallSkuParam={
        pageNum: 1,
        pageSize: 10,
        brandId: null ,//品牌id
        firstLevelCategoryId: null,
        mallCategoryMatchId: null,
        mallId: null,
        maxPrice: null,
        minPrice: null,
        secondLevelCategoryId: null,
        skuId: null,
        skuNo: null,
        skuName: null,
        thirdLevelCategoryId: null,
      };
      this.getTableData()
    },
    //获取表格数据
    getTableData() {
      batchGoodsList(this.findMallSkuParam,this.mallId).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
    findMallSkuParamForm() {
      this.findMallSkuParam.pageNum=1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.findMallSkuParam.pageNum = val;
      this.getTableData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findMallSkuParam.pageSize=val;
      this.getTableData()
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    batchAdd(row) {
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
     addBatchGoodsCorrespond(this.mallCategoryMatchId,arr).then(res=>{
        if(res.code=='000000'){
          this.$message({
            message:'批量添加绑定关系成功',
            type:'success'
          })
        }
     })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addGoods(row) {
      this.$confirm("确定将此商品添加到项目中吗？", "添加提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          // this.createMallSkuBatchParam.skuId=row.skuId;
          // this.createMallSkuBatchParam.
          addGoodsCorrespond(row.id,this.mallCategoryMatchId).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message:'商品添加成功',
                type:'success'
              })
            }
            this.getTableData();
            
          })
        }).catch(() => {});
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
      margin: 10px 10px 0 0;
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
      .select {
        float: left;
        margin-right: 20px;
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
