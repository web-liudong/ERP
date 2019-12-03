<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <div style="border-bottom: 1px solid #e4e4e4;height: 50px">
          <p class="title">
            项目：{{shoppeName}}
            <span>导航：{{parentNavName}}</span>
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
        <span>导航ID：</span>
        <el-input placeholder="导航ID" v-model="query.id" clearable></el-input>
        <span>导航名称：</span>
        <el-autocomplete v-model="query.name" :fetch-suggestions="querySearch" placeholder="导航名称"></el-autocomplete>
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
          <div class="button-head" @click="oepnWin('ShoppeAddNav',{ id: shoppeId, shoppe: shoppeName, navId: navParentId, level: 3, source: source })">
            <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" size="small" :max-height="dataListHeight">
        <el-table-column prop="id" label="导航ID" align="center"></el-table-column>
        <el-table-column prop="name" label="导航名称" align="center"></el-table-column>
        <el-table-column prop="shoppeNavigationLevelName" label="级别" align="center"></el-table-column>
        <el-table-column prop="available" label="导航状态" align="center">
          <template slot-scope="scope">{{scope.row.available ? "可用" : "禁用"}}</template>
        </el-table-column>
        <el-table-column prop="releaseStatusText" label="发布状态" align="center"></el-table-column>
        <el-table-column prop="index" label="优先级" align="center"></el-table-column>
        <el-table-column label="相关" align="center">
          <template slot-scope="scope">
            <el-button
              @click="oepnWin('ShoppeGoodsManage',{ id: shoppeId, shoppe: shoppeName, navId: scope.row.id, level:3 })"
              type="text"
              size="small"
            >商品({{scope.row.skuCount}})</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220px">
          <template slot-scope="scope">
            <el-button @click="oepnWin('ShoppeRelevantGoodsManage',{ shoppeId: shoppeId, id: scope.row.id })" type="text" size="small">关联商品管理</el-button>
            <el-button
              @click="opaUseStatus(scope.row)"
              type="text"
              size="small"
            >{{scope.row.available ? "禁用" : "启用"}}</el-button>
            <el-button @click="oepnWin('ShoppeEditerNav',{ id: scope.row.id, level: 3 })" type="text" size="small">编辑</el-button>
            <el-button @click="oepnWin('ShoppeNavDetail',{ id: scope.row.id, level: 3 })" type="text" size="small">详情</el-button>
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
import {
  getNavList,
  editNavUseStatus,
  queryNavList
} from "@/api/release/specialProjectManage";
export default {
  inject: ["reload","isFilterShow"],
  name:'ShoppeNavLv3',
  data() {
    return {
      shoppeId: "",
      shoppeName: "",
      parentNavName: "",
      navParentId: "",
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      source: undefined, //判断添加3级时是否可编辑2级导航
      tableData: null,
      totalPage: 0,
      remoteLoading: false, //筛选查询loading
      query: {
        pageNum: 1,
        pageSize: 10,
        firstLevelId:null,
        secondLevelId:null,
        id: null,
        name: null
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  components: {},
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.params.isUpdate || this.$route.query.id != this.shoppeId || this.$route.query.navId != this.navParentId || this.$route.query.source != this.source){
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
      this.source = this.$route.query.source;
      this.navParentId = this.$route.query.navId;
      if(this.source == 1){
        this.query.firstLevelId = this.navParentId;
      }else if(this.source == 2){
        this.query.secondLevelId = this.navParentId;
      }
      //获取表格数据
      this.getTableData();
    },
    //获取表格数据
    getTableData() {
      getNavList(this.shoppeId, "third", this.query).then(res => {
        this.parentNavName = res.data.navigationName;
        this.tableData = res.data.pageInfo.items;
        this.totalPage = res.data.pageInfo.total;
      });
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    clearForm() {
      this.query = {
        pageNum: 1,
        pageSize: 10,
        firstLevelId:null,
        id: null,
        name: null
      };
      this.getTableData();
    },
    querySearch(query, cb) {
      if (query) {
        this.remoteLoading = true;
        queryNavList({ name: query, level: "THIRD_LEVEL" }).then(res => {
          let tempArr = res.data.map(value => {
            return {
              value: value.name,
              id: value.id
            };
          });
          cb(tempArr);
          this.remoteLoading = false;
        });
      } else {
        cb([]);
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
    opaUseStatus(row) {
      let str = row.available ? "禁用" : "启用",
        type = row.available ? "forbidden" : "available",
        sCon = row.available
          ? "禁用之后，前端页面不再显示此导航和此导航下关联的商品。确认禁用吗？"
          : "启用之后，前端页面将会显示此导航和此导航下关联的商品。确认启用吗？";
      this.$confirm(sCon, `${str}提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          editNavUseStatus(row.id, type).then(res => {
            this.getTableData();
            this.$message({
              type: "success",
              message: `${str}成功!`
            });
          });
        })
        .catch(() => {});
    },
    oepnWin(name, query) {
      this.$router.push({name : name, query : query});
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
      height: 56px;
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 200px;
        height: 40px;
        line-height: 56px;
        // margin-top: 10px;
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
        .myicon {
          margin-left: 10px;
        }
        span {
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