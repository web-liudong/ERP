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
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
        <span>商品编号：</span>
        <el-input placeholder="商品ID或名称" v-model="findMallSkuParam.skuNo" clearable></el-input>
        <span>商品名称：</span>
        <el-input placeholder="商品名称" v-model="findMallSkuParam.skuName" clearable></el-input>
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
        
        <div style="margin-bottom: 10px">
          <span style="min-width:100px;margin-left:30px">领先未来分类：</span>
          <!-- <span>一级分类：</span>     -->
        <el-select
            v-model="findMallSkuParam.firstLevelCategoryId"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="一级分类"
            :remote-method="remoteMethodClassify1"
            :loading="loadingClassify">
            <el-option
              v-for="item in optionsClassify1"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        <!-- <span>二级分类：</span> -->
         <el-select
            v-model="findMallSkuParam.secondLevelCategoryId"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="二级分类"
            :remote-method="remoteMethodClassify2"
            :loading="loadingClassify">
            <el-option
              v-for="item in optionsClassify2"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        <!-- <span>三级分类：</span> -->
        <el-select
            v-model="findMallSkuParam.thirdLevelCategoryId"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="三级分类"
            :remote-method="remoteMethodClassify3"
            :loading="loadingClassify">
            <el-option
              v-for="item in optionsClassify3"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span style="min-width:140px;margin-left:30px">展示给对方分类：</span>
          <!-- <span>一级分类：</span>     -->
        <el-select
            v-model="findMallSkuParam.partyCFirstLevelName"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="一级分类"
            :remote-method="(query)=>{
              remoteMethodOtherClassify(query,'1','otherOneClassify')
            }"
            :loading="loadingClassify">
            <el-option
              v-for="item in otherOneClassify"
              :key="item.id"
              :label="item.firstLevelName"
              :value="item.firstLevelName">
            </el-option>
          </el-select>
        <!-- <span>二级分类：</span> -->
         <el-select
            v-model="findMallSkuParam.partyCSecondLevelName"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="二级分类"
            :remote-method="(query)=>{
              remoteMethodOtherClassify(query,'2','otherTwoClassify')
            }"
            :loading="loadingClassify">
            <el-option
              v-for="item in otherTwoClassify"
              :key="item.id"
              :label="item.secondLevelName"
              :value="item.secondLevelName">
            </el-option>
          </el-select>
        <!-- <span>三级分类：</span> -->
        <el-select
            v-model="findMallSkuParam.partyCThirdLevelName"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="三级分类"
            :remote-method="(query)=>{
              remoteMethodOtherClassify(query,'3','otherThreeClassify')
            }"
            :loading="loadingClassify">
            <el-option
              v-for="item in otherThreeClassify"
              :key="item.id"
              :label="item.thirdLevelName"
              :value="item.thirdLevelName">
            </el-option>
          </el-select>
           <el-checkbox style="margin-left:20px" v-model="findMallSkuParam.matchedFlag">显示未对应第三方分类的商品</el-checkbox>
          <!-- <el-radio  v-model="findMallSkuParam.matchedFlag" label="true">显示未对应第三方分类的商品</el-radio> -->
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
          <div class="button-head" @click="toAddGoods()" v-if="$authorities.ShoppingGoodsCreateGoods">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加商品
          </div>
          <div class="button-head" @click="opaBetch('setStock')" v-if="$authorities.ShoppingGoodsSetStockAll">
            <i class="icon-feiji iconfont button-head-icon icon-plane"></i>批量设库存
          </div>
          <div class="button-head" @click="opaBetch1('setMaxPrice')" v-if="$authorities.ShoppingGoodsSetLimitPrice">
            <i class="iconjinridingdanshu iconfont button-head-icon"></i>设置限价
          </div>
          <div class="button-head" @click="importRecord()" v-if="$authorities.ShoppingGoodsExport">
            <i class="icon-batch-import iconfont button-head-icon"></i>导出
          </div>
          <div class="button-head" @click="importfile('importFile')" v-if="$authorities.ShoppingGoodsImportRelevant">
            <i class="icondaoru iconfont button-head-icon"></i>导入
          </div>
          <div class="button-head" @click="exportfile()" v-if="$authorities.ShoppingGoodsImportRelevant">
            <i class="el-icon-tickets button-head-icon"></i>导入记录
          </div>
          <div class="button-head" @click="opaBetchDel()" v-if="$authorities.ShoppingGoodsDeleteAll">
            <i class="icon-guanji1 iconfont button-head-icon"></i>批量删除
          </div>
          <div class="button-head" @click="opaBetch('setOther')" v-if="$authorities.ShoppingGoodsDeleteAll">
            <i class="icon-guanji1 iconfont button-head-icon"></i>批量设置对应分类
          </div>
          <div class="button-head" @click="opaBetchSaleStatus(1)" v-if="$authorities.ShoppingGoodsUpShelfAll">
            <i class="icon-top iconfont button-head-icon"></i>批量上架
          </div>
          <div class="button-head" @click="opaBetchSaleStatus(0)" v-if="$authorities.ShoppingGoodsDownShelfAll">
            <i class="icon-xia iconfont button-head-icon"></i>批量下架
          </div>
          <div class="button-head" @click="toOpaRecord('SysOperationRecord',{id:mallId,type:'mall-sku-operation-record'})" style="width: 100px"
          v-if="$authorities.ShoppingGoodsOperationRecord">
            <i class="el-icon-tickets button-head-icon"></i>操作记录
          </div>
          <div class="button-head" @click="opaBetch('setPush')" v-if="$authorities.ShoppingGoodsPushRelevant"> 
            <i class="el-icon-tickets button-head-icon"></i>推送
          </div>
          <div class="button-head" @click="importfile()" v-if="$authorities.ShoppingGoodsPushAll">
            <i class="el-icon-tickets button-head-icon"></i>批量推送
          </div>
          <div class="button-head" @click="toPushRecord()" v-if="$authorities.ShoppingGoodsPushRelevant">
            <i class="el-icon-tickets button-head-icon"></i>推送记录
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        :max-height="dataListHeight"
        border
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mallSkuName" label="针对项目的商品名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandNameCN" label="品牌" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="font-size: 12px;margin-left: 0">{{scope.row.brandNameCN}}</span>
            <span
              style="font-size: 12px;margin-left: 0"
              v-if="(scope.row.brandNameEN)!=0"
            >({{scope.row.brandNameEN}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="领先未来分类" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.firstLevelCategoryName}}>{{scope.row.secondLevelCategoryName}}>{{scope.row.thirdLevelCategoryName}}</template>
        </el-table-column>
        <el-table-column prop="statusName" label="对应第三方分类" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.partyCFirstLevelName}} <i v-if="scope.row.partyCSecondLevelName==''">></i>{{scope.row.partyCSecondLevelName}}<i v-if="scope.row.partyCThirdLevelName==''">></i>{{scope.row.partyCThirdLevelName}}</template>
        </el-table-column>
        <el-table-column prop="websitePrice" label="官网售价" align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.websitePrice}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="discount" label="投标承诺折扣率" align="center">
          <template slot-scope="scope">
                {{scope.row.discount}}%  
          </template>

        </el-table-column>
        <el-table-column prop="mallPrice" label="项目售价" align="center">
          <template slot-scope="scope">
            <span :style="{color:scope.row.limitPrice < scope.row.mallPrice? 'red' : null}">￥{{scope.row.mallPrice||fixed}}</span>
             </template>
        </el-table-column>
        <el-table-column prop="limitPrice" label="限价" align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.limitPrice||fixed}}</span>
             </template>
        </el-table-column>
        <el-table-column prop="inventory" label="项目库存" align="center"></el-table-column>
        <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="260px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="opaSaleStatus(scope.row,0)" v-if="scope.row.statusName=='上架'&&$authorities.ShoppingGoodsShelfRelevant">下架</el-button>
            <el-button type="text" size="small" v-if="scope.row.statusName=='下架'&&$authorities.ShoppingGoodsShelfRelevant" @click="opaSaleStatus(scope.row,1)">上架</el-button>
            <el-button type="text" size="small" @click="showDialog('setSalePrice',scope.row)" v-if="$authorities.ShoppingGoodsSetSellingPrice">设置售价</el-button>
            <el-button @click="showDialog('setStock',scope.row)" type="text" size="small" v-if="$authorities.ShoppingGoodsSetStock">设置库存</el-button>
            <el-button @click="showDialog('setOther',scope.row,mallId,'otherClassify')" type="text" size="small">设置对应分类</el-button>
            <el-button @click="showDialog('setGoodsInfo',scope.row,mallId)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="opaDel(scope.row)" v-if="$authorities.ShoppingGoodsDelete">删除</el-button>
            <el-button type="text" size="small" @click="toProjectDetail(scope.row)" v-if="$authorities.ShoppingGoodsPondDetail">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <el-dialog title="数据锁定提示" :visible.sync="dialogVisible1" width="30%">
      <span>用户[ {{infoMessage}} - {{infoRealName}} ]正在编辑该条数据，数据已锁定。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="isDelBrandID()">确 定</el-button>
      </span>
    </el-dialog>
    <setSalePrice ref="setSalePrice" @callback="dialogCallback"></setSalePrice>
    <setStock ref="setStock" @callback="dialogCallback"></setStock>
    <setPush ref="setPush" @callback="dialogCallback"></setPush>
    <setMaxPrice ref="setMaxPrice" @callback="dialogCallback"></setMaxPrice>
    <setOther ref="setOther"></setOther>
    <setGoodsInfo ref="setGoodsInfo" @Goodscallback="Goodscallback"></setGoodsInfo>
    <importFile
        ref="importFile"
        :title="'商品信息导入'"
        :type="importType"
         :params="{mallId:mallId}"
      ></importFile>
  </div>
</template>
<script>
import store from "@/store/store";
import {remoteBrandName} from "@/api/brandManage";
import {getPondDataList,deleteSku,upShelf,lowerShelf,setStockGoods,batchDelete,batchLowShelf,batchUpShelf,batchSetStock,exportGoods,getOtherItem} from '@/api/release/mallProjectManage'
import setSalePrice from "./child/set_sale_price";
import setStock from "./child/set_stock";
import setPush from "./child/set_push";
import setOther from "./child/set_other";
import setGoodsInfo from "./child/set_goodsInfo";
import setMaxPrice from "./child/set_max_price";
import importFile from "@/components/common/module/ImportFile";
import {findClassify} from '@/api/goodsManage'
import { formatString } from "@/utils";
export default {
  inject: ["reload",'close','isFilterShow'],
  name:'ProductPondManage',
  data() {
    return {
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      loading1: false,
      loadingClassify:false,
      optionsClassify1:[],
      optionsClassify2:[],
      optionsClassify3:[],
      otherOneClassify:[],
      otherTwoClassify:[],
      otherThreeClassify:[],
      tableData: null,
      //项目名称
      projectName:null,
      //商城id
      mallId:null,
      importType: "skupond-correspond-import",
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
        skuName: null,//商品名称
        thirdLevelCategoryId: null,//三级品类id
        brandName:null,
        matchedFlag:false,//显示未对应第三方分类的商品，显示true 不显示false
        partyCFirstLevelName:null,//展示给对方一级分类
        partyCSecondLevelName:null,//展示给对方二级分类
        partyCThirdLevelName:null,//展示给对方三级分类
        skuNo:null,//商品编号
      },
      headertoken: { Authorization: "Bearer " + this.$auth.token },
      paginations: {
        total: 1 //总数
      },
      dialogVisible1: false
    };
  },
  components: {
    setSalePrice,
    setStock,
    setPush,
    setMaxPrice,
    importFile,
    setOther,
    setGoodsInfo
  },
  filters:{
    fixed(val){
      return val.toFixed(2)
    }
  },
  created() {
    this.mallId=this.$route.query.ProductId;
    this.projectName=this.$route.query.projectName;
    this.findMallSkuParam.mallId=this.$route.query.ProductId;
    //获取表格数据
    this.getTableData();
  },
  activated(){
   if(this.$route.query.ProductId!=null){
    if(this.mallId!=this.$route.query.ProductId){
      this.mallId=this.$route.query.ProductId;
      this.projectName=this.$route.query.projectName;
      this.findMallSkuParam.mallId=this.$route.query.ProductId;
      this.getTableData()
   } 
   } 
   if(this.$route.params.isUpdate){
     this.getTableData()
   }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset(){
     this.findMallSkuParam={
        pageNum: 1,
        pageSize: 10,
        brandId: null,//品牌id
        mallCategoryMatchId: null,//对方品目对应id
        firstLevelCategoryId: null, //一级品类id
        mallId: this.$route.query.ProductId, //商城项目id
        maxPrice: null,//最高价格
        minPrice: null,//最低价格
        secondLevelCategoryId: null,//二级品类id
        skuId: null,//商品id
        skuName: null,//商品名称
        thirdLevelCategoryId: null,//三级品类id
        brandName:null,
        matchedFlag:false,//显示未对应第三方分类的商品，显示true 不显示false
        partyCFirstLevelName:null,//展示给对方一级分类
        partyCSecondLevelName:null,//展示给对方二级分类
        partyCThirdLevelName:null,//展示给对方三级分类
        skuNo:null,//商品编号
      };
      this.getTableData()
    },
    remoteMethodOtherClassify(query,type,list){
     if(query!==''){
       this.loadingClassify=true;
       getOtherItem(this.mallId,type,query).then(res=>{
         if(res.code=='000000'){
           this[list]=res.data;
         }
       })
     }else{
       this[list]=[];
       this.loadingClassify=false
     }
    },
    Goodscallback(){
     this.getTableData()
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
        remoteMethodClassify1(query){
        if(query!==''){
          this.loadingClassify=true;
          // let aa={name:query}
          findClassify(1,0,query).then(res=>{
            if(res.code=='000000'){
              this.optionsClassify1=res.data;
              this.loadingClassify=false
            }
          })
        }else {
          this.optionsClassify1=[]
        }
      },
       remoteMethodClassify2(query){
        if(query!==''){
          this.loadingClassify=true;
          if(this.findMallSkuParam.firstLevelCategoryId){
            findClassify(2,this.findMallSkuParam.firstLevelCategoryId,query).then(res=>{
            if(res.code=='000000'){
              this.optionsClassify2=res.data;
              this.loadingClassify=false
            }
          })
          }else{
            findClassify(2,0,query).then(res=>{
            if(res.code=='000000'){
              this.optionsClassify2=res.data;
              this.loadingClassify=false
            }
          })
          }  
        }else {
          this.optionsClassify2=[]
        }
      },
       remoteMethodClassify3(query){
        if(query!==''){
          this.loadingClassify=true;
         if(this.findMallSkuParam.secondLevelCategoryId){
            findClassify(3,this.findMallSkuParam.secondLevelCategoryId,query).then(res=>{
            if(res.code=='000000'){
              this.optionsClassify3=res.data;
              this.loadingClassify=false
            }
          })
         }else{
           findClassify(3,0,query).then(res=>{
            if(res.code=='000000'){
              this.optionsClassify3=res.data;
              this.loadingClassify=false
            }
          })
         }
         
        }else {
          this.optionsClassify3=[]
        }
      },
    importfile(type,row){
    this.$refs[type].init(row)
    },
    //调转到导入记录
    exportfile(){
    this.$router.push({name:'SysImportRecord',query:{id:this.mallId,type:'mall-productpond-import-list'}})
    },
    //选中值发生变化时
    getBrandName(){
      let obj = JSON.parse(JSON.stringify(this.options));
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
      getPondDataList(this.findMallSkuParam).then(res => {
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
    showDialog(type, row,aaa,otherClassify) {
      this.$refs[type].init(row,aaa,otherClassify);
    },
    dialogCallback(type) {
      this.getTableData();
    },
    //上架或者下架
    opaSaleStatus(row,num) {
      let str = num == 1 ? "上架" : "下架";
      if(num==0){
       this.$confirm(`下架之后，此商品不再提供给商城客户展示使用?`, `下架提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res=>{
        lowerShelf(row.id).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  type: "success",
                  message: "下架成功!"
                });
              }
            }).then(res=>{
              this.getTableData();
            })
      }).catch(()=>{}) 
      }else if(num==1){
        this.$confirm(`上架之后，此商品提供给商城客户展示使用?`, `上架提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res=>{
        upShelf(row.id).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message:'上架成功',
                  type:'success'
                })
              }
            }).then(res=>{
              this.getTableData();
            })
      }).catch(()=>{})
      }

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
      if(str=='上架'){
        if(this.multipleSelection.some(item=>item.statusName=='上架')){
          return this.$message({
            message:'商品已上架，不允许再次操作',
            type:'error'
          })  
        }
        batchUpShelf(arr).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:"批量上架成功",
              type:'success'
            })
            this.getTableData();
          }
        }) 
      }
       if(str=='下架'){
         if(this.multipleSelection.some(item=>item.statusName=='下架')){
           return this.$message({
             message:"商品已下架，不允许再次操作",
             type:'error'
           })
         }
          batchLowShelf(arr).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:'批量下架成功',
              type:'success'
            })
            this.getTableData();
          }
        })
      
      }
    },
    importRecord(){
       exportGoods(this.findMallSkuParam).then(res=>{
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
       },
    opaBetch(type) {
      if (!this.multipleSelection.length) {
        let msg = "";
        if(type == "setPush"){
          msg = "请勾选需要推送更新的商品"
        }else
        if(type == "setStock"){
          msg = "请勾选需要设置库存的商品"
        }else if(type=='setOther'){
          msg="请勾选需要设置对应分类的商品"
        }
        return this.$message({
          message: msg,
          type: "warning"
        });
      }
      //过滤选择
      let arr = [];
      arr = this.multipleSelection.map(function(value, index, array) {
        return value.id;
      });
      this.showDialog(type, arr,this.mallId);
    },
    opaBetch1(type) {
      let arr = [];
      arr = this.multipleSelection.map(function(value, index, array) {
        return value.id;
      });
      this.showDialog(type, arr,this.mallId);
    },
    //删除
    opaDel(row) {
      this.$confirm("删除之后，此商品不在专柜中展示确定删除吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          deleteSku(row.id).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getTableData();
              }
          })
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
      batchDelete(arr).then(res=>{
        if(res.code=='000000'){
          this.$message({
            message:'批量删除成功',
            type:'success'
          })
          this.getTableData();
        }
      })

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
      //   name: "ProductPondCreate",
      //   query: { mallId: this.mallId ,projectName:this.projectName}
      // });
      // window.open(route.href, "_blank");
      this.$router.push({name:'ProductPondCreate',query:{mallId:this.mallId,projectName:this.projectName}})
    },
    toImportRecord(name,query) {
      // let route = this.$router.resolve({
      //   name: name,
      //   query: query
      // });
      // window.open(route.href, "_blank");
      this.$router.push({name:name,query:query})
    },
    toOpaRecord(name,query) {
      // let route = this.$router.resolve({
      //   name:name,
      //   query: query
      // });
      // window.open(route.href, "_blank");
      this.$router.push({name:name,query:query})
    },
    toPushRecord(row) {
      // let route = this.$router.resolve({
      //   name: "SysPushRecord",
      //   query: { id: "123" }
      // });
      // window.open(route.href, "_blank");
      this.$router.push({name:'SysPushRecord',query:{id:'123'}})
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
      this.$router.push({name:'MallProjectDetail',query:{id:row.skuId,mallID:this.mallId}})
    }
  }
};
</script>
<style scoped>
.brandBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
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
    .listBoxTop {
      line-height: 50px;
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
    margin-top: 5px;
    text-align: right;
  }
}
</style>
