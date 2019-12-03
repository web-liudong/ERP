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
          <el-button size="small" class="w80 h40" @click="getList(1)">查询结果</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-show="isShow">
        <el-input
          placeholder="商品ID"
          v-model="id"
          clearable>
        </el-input>
        <el-select
          v-model="name"
          filterable
          remote
          placeholder="商品名称"
          :remote-method="remoteMethod4"
          :loading="loading" clearable>
          <el-option
            v-for="item in nameSkuList"
            :key="item.id"
            :label="item.skuName"
            :value="item.skuName">
          </el-option>
        </el-select>
        <el-select
          v-model="firstLevelCategoryId"
          filterable
          remote
          placeholder="一级分类"
          :remote-method="remoteMethod"
          :loading="loading" clearable>
          <el-option
            v-for="item in classOptions1"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select
          v-model="secondLevelCategoryId"
          filterable
          remote
          placeholder="二级分类"
          :remote-method="remoteMethod2"
          :loading="loading" clearable>
          <el-option
            v-for="item in classOptions2"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select
          v-model="thirdLevelCategoryId"
          filterable
          remote
          placeholder="三级分类"
          :remote-method="remoteMethod3"
          :loading="loading" clearable>
          <el-option
            v-for="item in classOptions3"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div style="width: 420px;display: inline-block;">
          <el-input
            placeholder="最低价格"
            v-model="priceStart"
            clearable>
          </el-input>
          <span>-</span>
          <el-input
            placeholder="最高价格"
            v-model="priceEnd"
            clearable>
          </el-input>
        </div>
        <el-select
          v-model="brandId"
          filterable
          remote
          placeholder="品牌名称"
          :remote-method="remoteMethod5"
          :loading="loading" clearable>
          <el-option
            v-for="item in nameBrandList"
            :key="item.id"
            :label="item.nameCN"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="addAll"><i class="icon-xinzeng iconfont button-head-icon icon-add"></i>批量添加</div>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="small" @selection-change = "selectionChange">
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          label="商品ID"
          align="center"
          prop="id">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="品牌"
          align="center">
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="所属分类"
          align="center">
        </el-table-column>
        <el-table-column
          label="采购价（含税）"
          align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.buyingPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="友商售价"
          align="center">
          <template slot-scope="scope">
            <a :href="scope.row.competingSkuUrl">￥{{scope.row.competingSkuPrice}}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="销售价（含税）"
          align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.sellingPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusDescription"
          label="官网售价（含税）"
          align="center">
          <template slot-scope="scope">
            <span>￥{{scope.row.websitePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addLink(scope.row.id)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="15"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {forAddition,navigationsku,navigationskus,nameList,brandList} from '@/api/release/navManage'
  import {selectlist} from '@/api/classManage'
  export default {
    inject:['reload'],//注入依赖
    name:'addgoods',
    data() {
      return {
        brandId:null,
        firstLevelCategoryId:null,
        id:null,
        name:null,
        priceEnd:null,
        priceStart:null,
        secondLevelCategoryId:null,
        thirdLevelCategoryId:null,
        navId:null,
        selectionku:[],
        classOptions1:[],
        classOptions2:[],
        classOptions3:[],
        nameSkuList:[],
        loading:false,
        nameBrandList:[],
        tableData: [],
        page:1,
        total:0,
        isShow:true
      }
    },
    activated(){
      this.navId = this.$route.query.id;
      this.getList(1);
    },
    methods: {
      remoteMethod5(query){
        if(query){
          this.loading = true
          brandList({
            brandName:query
          }).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.nameBrandList = res.data;
            }
          })
        }
      },
      remoteMethod2(query){
        if(query){
          this.loading = true
          selectlist(2,this.firstLevelCategoryId?this.firstLevelCategoryId:0,query).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.classOptions2 = res.data;
            }
          })
        }
      },
      remoteMethod3(query){
        if(query){
          this.loading = true
          selectlist(3,this.secondLevelCategoryId?this.secondLevelCategoryId:this.firstLevelCategoryId?this.firstLevelCategoryId:0,query).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.classOptions3 = res.data;
            }
          })
        }
      },
      remoteMethod(query){
        if(query){
          this.loading = true
          selectlist(1,0,query).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.classOptions1 = res.data;
            }
          })
        }
      },
      remoteMethod4(query){
        if(query){
          this.loading = true
          nameList({
            name:query
          }).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.nameSkuList = res.data;
            }
          })
        }
      },
      selectionChange(selection){
        this.selectionku = selection;
      },
      getList(page){
        forAddition({
          brandId:this.brandId,
          firstLevelCategoryId:this.firstLevelCategoryId,
          id:this.id==''?null:this.id,
          name:this.name==''?null:this.name,
          pageNum:page,
          pageSize:10,
          priceEnd:this.priceEnd==''?null:this.priceEnd,
          priceStart:this.priceStart==''?null:this.priceStart,
          secondLevelCategoryId: this.secondLevelCategoryId,
          thirdLevelCategoryId: this.thirdLevelCategoryId
        }).then(res=>{
          this.tableData = res.data.items
          this.total = res.data.total
        })
      },
      addLink(id){
        this.$confirm('确定将此将此商品关联导航吗？', '添加提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          navigationsku(this.navId,id,{
            id:this.navId-0,
            skuId:id
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '商品添加成功'
              });
              this.reload();
            }
          })
        });
      },
      addAll(){
        if(this.selectionku.length){
            var checkArr = this.selectionku.map(res=>{
              return res.id
            })
            this.$confirm('确定将此将此商品关联导航吗？', '添加提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              navigationskus(this.navId,checkArr
              ).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                    type: 'success',
                    message: '商品添加成功'
                  });
                  this.reload();
                }
              })
            });
        }else{
          this.$message.error('请选择商品');
        }
      },
      handleCurrentChange(val){
        this.getList(val);
      }
    }
  }
</script>
<style scoped lang="less">
  .brandBox {
    width: 100%;
    margin-bottom: 100px;
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      margin: 10px 0;
      clear: both;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        box-sizing: border-box;
        .head-left{
          display: flex;
          align-items: center;
        }
        .myicon{
          font-weight: bold;
          color:#666;
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
        .myicon{
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
        padding-bottom: 8px;
        padding-left: 10px;
        .el-input {
          width: 200px;
          height: 40px;
          margin-top:8px;
        }
        .el-select{
          width: 200px;
          height: 40px;
          margin-top:8px;
        }
      }
    }
    .listBox {
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          .myicon{
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
        .button-head{
          width: 80px;
          height: 30px;
          margin-right: 10px;
          border:1px solid #d1d1d1;
          cursor:pointer;
          background-color: #fff;
          line-height: 30px;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          .button-head-icon{
            margin-right: 5px;
          }
          .icon-add{
            font-size: 12px;
          }
          .icon-plane{
            font-size: 12px;
            font-weight: 700;
            color: #000;
          }
        }
        .button-head:hover{
          background-color: #f3f3f3;
        }
        .el-button {
          width: 80px;
          height: 30px;
          margin-top: 10px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
        a{
          color: #339999;
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
