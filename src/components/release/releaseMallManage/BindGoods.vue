<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="headerBox">
        <span style="color: red">项目：{{projectName}}</span>
      </div>
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer;margin-right:10px">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryForm()">查询结果</el-button>
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
          <el-select
            v-model="findMallSkuParam.brandName"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="品牌名称"
            :remote-method="remoteMethod"
            @change="getBrandName"
            :loading="loading1">
            <el-option
              v-for="item in options"
              :key="item.nameCN"
              :label="item.label"
              :value="item.nameCN">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="toAddGoods()">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加商品
          </div>
          <div class="button-head" @click="importRecord()">
            <i class="icon-batch-import iconfont button-head-icon"></i>导出
          </div>
        </div>
      </div>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="名称" align="center"></el-table-column>
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
        <!-- <el-table-column prop="statusName" label="对方品目" align="center">
          <template slot-scope="scope">{{scope.row.partyCFirstLevelName}} <i v-if="scope.row.partyCSecondLevelName==''">></i>{{scope.row.partyCSecondLevelName}}<i v-if="scope.row.partyCThirdLevelName==''">></i>{{scope.row.partyCThirdLevelName}}</template>
        </el-table-column> -->
        <el-table-column prop="websitePrice" label="官网售价" align="center">
          <template slot-scope="scope"><span :style="{color:scope.row.limitPrice < scope.row.websitePrice? 'red' : null}">{{scope.row.websitePrice}}</span></template>
        </el-table-column>
        <!-- <el-table-column prop="discount" label="投标承诺折扣率" align="center"></el-table-column> -->
        <el-table-column prop="mallPrice" label="项目售价" align="center"></el-table-column>
        <el-table-column prop="limitPrice" label="限价" align="center"></el-table-column>
        <!-- <el-table-column prop="inventory" label="项目库存" align="center"></el-table-column> -->
        <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="260px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="opaDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="findMallSkuParam.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="findMallSkuParam.pageSize"
          layout="total,sizes,prev, pager, next, jumper"
          :total="paginations.total"
          background
        ></el-pagination>
      </div>
    </div>
    
  </div>
</template>
<script>
  import store from "@/store/store";
  import {remoteBrandName} from "@/api/brandManage";
  import {batchGoodsList,delGoodsCorresponding,upShelf,lowerShelf,setStockGoods,batchDelete,batchLowShelf,batchUpShelf,batchSetStock,exportBindGoods} from '@/api/release/mallProjectManage'
  export default {
    inject: ["reload",'close'],
    name:'BindGoods',
    data() {
      return {
        isShow: true,
        screenGoods: "收起筛选",
        screenBrand: "展开筛选",
        loading1: false,
        tableData: null,
        //项目名称
        projectName:null,
        //商城id
        mallId:null,
        infoRealName: "",
        options: null,
        //错误提示消息
        infoMessage: "",
        dialogVisible:false,
        dialogVisible2:false,
        multipleSelection: [], //选中的商品集合
        findMallSkuParam: {
          pageNum: 1,
          pageSize: 10,
          brandId: null,//品牌id
          mallCategoryMatchId: null,//对方品目对应id
          firstLevelCategoryId: null, //一级品类id
          mallId: null, //商城项目id
          maxPrice: null,//最高价格
          minPrice: null,//最低价格
          secondLevelCategoryId: null,//二级品类id
          skuId: null,//商品id
          skuNo: null,//skuNo
          skuName: null,//商品名称
          thirdLevelCategoryId: null,//三级品类id
          brandName:null,
        },
        paginations: {
          total: 1 //总数
        },
        dialogVisible1: false
      };
    },
    computed: {
    },
    components: {
      
    },
    created() {
      this.mallId=this.$route.query.ProductId;
      this.projectName=this.$route.query.projectName;
      this.findMallSkuParam.mallCategoryMatchId=this.$route.query.ItemID;
      this.findMallSkuParam.mallId=this.$route.query.ProductId;
      //获取表格数据
      this.getTableData();
    },
    activated(){
    //  if(this.$route.query.ProductId&&this.mallId!=this.$route.query.ProductId){
    //    this.mallId=this.$route.query.ProductId;
    //   this.projectName=this.$route.query.projectName;
    //   this.findMallSkuParam.mallCategoryMatchId=this.$route.query.ItemID;
    //   this.findMallSkuParam.mallId=this.$route.query.ProductId;
    //   //获取表格数据
    //   this.getTableData();
    //  }
    //  if(this.$route.params.isUpdate){
    //    this.getTableData()
    //  }
    this.getTableData()
    },
    methods: {
      reset(){
       this.findMallSkuParam={
          pageNum: 1,
          pageSize: 10,
          brandId: null,//品牌id
          mallCategoryMatchId: null,//对方品目对应id
          firstLevelCategoryId: null, //一级品类id
          mallId: null, //商城项目id
          maxPrice: null,//最高价格
          minPrice: null,//最低价格
          secondLevelCategoryId: null,//二级品类id
          skuId: null,//商品id
          skuNo: null,//skuNo
          skuName: null,//商品名称
          thirdLevelCategoryId: null,//三级品类id
          brandName:null,
        };
        this.getTableData()
      },
      importRecord(){
        exportBindGoods(this.mallId,this.findMallSkuParam).then(res=>{
            this.download(res)
        })
      },
      download(data){
         if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data],{type:"application/xls"}))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download','files.xls')
        document.body.appendChild(link)
        link.click()
        console.log(link)
       },
      //远程搜索
      remoteMethod(query) {
        if (query !== "") {
          this.loading1 = true;
          let aa = { name: query };
          remoteBrandName(aa).then(res => {
            if (res.code == "000000") {
              console.log(res.data,888888888888);
              this.options = res.data;
              this.loading1 = false;
            }
          });
        } else {
          this.options = [];
        }
      },
      //选中值发生变化时
      getBrandName(){
        let obj = JSON.parse(JSON.stringify(this.options));
        console.log(obj,999999);
        obj = obj.filter(item=>{
          return item.nameCN==this.findMallSkuParam.brandName
        })
        if(obj.length>0){
          this.findMallSkuParam.brandId=obj[0].id;
          console.log(this.findMallSkuParam.brandId,888888);
        }else {
          this.findMallSkuParam.brandId=''
        }
      },
      //获取表格数据
      getTableData() {
        batchGoodsList(this.findMallSkuParam,this.mallId).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
        });
      },
      //筛选按钮
      showHelp() {
        this.isShow = !this.isShow;
      },
      //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
      queryForm() {
        this.findMallSkuParam.pageNum=1;
        this.getTableData();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      showDialog(type, row) {
        this.$refs[type].init(row);
      },
      dialogCallback(type) {
        console.log(type);
        this.getTableData();

      },
      //删除
      opaDel(row) {
        this.$confirm("删除之后，此商品不在专柜中展示确定删除吗?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delGoodsCorresponding(row.id).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getTableData();
            }
          })
        }).catch(() => {});
      },
      handleCurrentChange(val) {
        this.findMallSkuParam.pageNum = val;
        this.getTableData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.findMallSkuParam.pageSize=val;
        this.getTableData()
      },
      toAddGoods(row) {
        // let route = this.$router.resolve({
        //   name: "AddBindGoods",
        //   query: { mallId: this.mallId ,projectName:this.projectName,mallCategoryMatchId:this.findMallSkuParam.mallCategoryMatchId}
        // });
        // window.open(route.href, "_blank");
        this.$router.push({name:'AddBindGoods',query:{mallId: this.mallId ,projectName:this.projectName,mallCategoryMatchId:this.findMallSkuParam.mallCategoryMatchId}})
        // this.close({name:'BindGoods',to:{}})
      },
      //跳转到详情页
      toProjectDetail(row) {
        // const { href } = this.$router.resolve({
        //   name: "MallProjectDetail",
        //   query: {
        //     id: row.skuId,
        //     mallID:this.mallId
        //   }
        // });
        // window.open(href, "_blank");
        this.$router.push({name:'MallProjectDetail',query:{id: row.skuId,mallID:this.mallId}})
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
      .headerBox {
        border-bottom: 1px solid #e4e4e4;
        height: 50px;
        line-height: 50px;
        span {
          margin-left: 10px;
          width: auto;
        }
      }
      .homeBoxTop {
        height: 50px;
        line-height: 50px;
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
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 140px;
          height: 40px;
          margin-top: 10px;
          margin-left: 10px;
        }
        .el-select{
          width: 140px;
          height: 40px;
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
        .listBoxRight {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-right: 10px;
          flex-wrap: wrap;
          .white-btn {
            margin-top: 10px;
            margin-right: 10px;
          }
          .button-head {
            min-width: 60px;
            padding: 0 6px;
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




