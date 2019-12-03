<template>
  <div class="brandBox">
    <!--   <div class="buttonBox">
      <el-button size="small" :class="{active:index==isActive}" v-for="(item,index) in headers" @click="changeTab(index)" :key="index">{{item.statusName}}({{item.statusCount}})</el-button>
    </div>-->
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
          <el-button size="small" @click="queryBrand1()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox clear" v-if="isShow">
         <div class="inputBox">
          <span>项目名称：</span>
          <el-input placeholder="项目名称" v-model="findMallInfoListParam.projectName" clearable></el-input>
        </div>
        <div class="inputBox">
          <span>乙方项目负责人：</span>
          <el-input
            placeholder="乙方项目负责人"
            v-model="findMallInfoListParam.partyBPrincipalName"
            clearable
          ></el-input>
        </div>
        <!-- <el-select
          v-model="findMallInfoListParam.nameCN"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="乙方项目负责人"
          :remote-method="remoteMethod"
          :loading="loading1">
          <el-option
            v-for="item in options4"
            :key="item.nameCN"
            :label="item.label"
            :value="item.nameCN">
          </el-option>
        </el-select>-->
        <div class="inputBox">
          <span>服务客户名称：</span>
          <el-input placeholder="服务客户名称" v-model="findMallInfoListParam.customerName" clearable></el-input>
        </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="toChangeOption()" v-if="$authorities.ShoppingMallOption">
            <i class="iconfont icondingdanguanli"></i>选项配置
          </div>
          <div class="white-btn fun-btn" @click="toItemCorrespond()" v-if="$authorities.ShoppingMallCreate">
            <i class="iconfont icontianjiashangpin"></i>添加
          </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" size="small" :max-height="dataListHeight">
          <el-table-column prop="id" label="ID" align="center"></el-table-column>
          <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="partyBPrincipalName" label="项目乙方负责人" align="center"></el-table-column>
          <el-table-column prop="partyCName" label="开发商" align="center"></el-table-column>
          <el-table-column prop="customerCount" label="服务客户" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="toCustom(scope.row)">客户：{{scope.row.customerCount}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="460px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toEditer(scope.row)" v-if="$authorities.ShoppingMallEditer">编辑</el-button>
              <el-button type="text" size="small" @click="toProductPondManage(scope.row)">商品池管理</el-button>
              <el-button
                @click="handleClick(scope.row)"
                :disabled="!scope.row.needCategoryMatch"
                type="text"
                size="small"
                v-if="$authorities.ShoppingMallItemCorrespond"
              >品目对应</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="!scope.row.needBrandMatch"
                 v-if="$authorities.ShoppingMallBrandCorrespond"
                @click="toBrandCorrespond(scope.row)"
              >品牌对应</el-button>
              <el-button type="text" size="small" @click="toProjectDetail(scope.row)" v-if="$authorities.ShoppingMallDetail">详情</el-button>
              <!-- <el-button type="text" size="small" @click="showDialog(scope.row)">协同运营者</el-button> -->
              <el-button type="text" size="small" @click="showDialog('addManage',scope.row.id)" v-if="$authorities.ShoppingMallCooperator">协同运营者</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="findMallInfoListParam.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="findMallInfoListParam.pageSize"
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
    <addManage ref="addManage"></addManage>
  </div>
</template>
<script>
import store from "@/store/store";
import {
  passedBrandList,
  noPassBrandList,
  draftBrandList,
  getBrandStatus,
  deleteBrandID,
  getBrandDetail,
  toAuditBrand,
  batchImport,
  remoteBrandName,
  queryBrand,
  checkName,
} from "@/api/brandManage";
import { fuzzySearch } from "@/api/organizationManage";
import { getDataList } from "@/api/release/mallProjectManage";
import { parseTime } from "@/utils";
import addManage from "./child/addManage";
export default {
  inject: ["reload",'close'],
  name: "ReleaseMallManage",
  components: {
    addManage,
  },
  data() {
    return {
      isShow: true,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      loading1: false,
      tableData: null,
      infoRealName: "",
      options4: null,
      //错误提示消息
      infoMessage: "",
      findMallInfoListParam: {
        pageNum: 1,
        pageSize: 10,
        customerName: null, //客户名称
        projectName: null, //项目名称
        partyBPrincipalName: null //项目乙方负责人
      },
      paginations: {
        total: 0 //总数
      },
      dialogVisible1: false
    };
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  created() {
    //获取表格数据
    this.getTableData();
  },
  activated(){
   if(this.$route.params.isUpdate){
     this.getTableData();
   }
  },
  methods: {
    reset(){
      this.findMallInfoListParam= {
        pageNum: 1,
        pageSize: 10,
        customerName: null, //客户名称
        projectName: null, //项目名称
        partyBPrincipalName: null //项目乙方负责人
      };
      this.getTableData()
    },
    showDialog(type,id) {
      this.$refs[type].init(id)
    },
    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        let aa = { name: query };
        remoteBrandName(aa).then(res => {
          if (res.code == "000000") {
            this.options4 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    toCustom(row){
      this.$router.push({name:'customermanage',query:{pid:row.projectId,pname:row.projectName}})
    },
    //获取表格数据
    getTableData() {
      getDataList(this.findMallInfoListParam).then(res => {
        this.tableData = res.data.items;
        console.log(res.data, 5555);
        this.paginations.total = res.data.total;
        this.findMallInfoListParam.pageNum = res.data.pageNum;
        this.findMallInfoListParam.pageSize = res.data.pageSize;
      });
    },
    //跳转到选项配置
    toChangeOption() {
      this.$router.push({name:"OptionConfig"})
    },
    //去编辑
    toEditer(row) {
      this.$router.push({name:'EditerMallItem',query:{EditerID:row.id}})
    },
    //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
    queryBrand1() {
      this.findMallInfoListParam.pageNum = 1;
      this.getTableData();
    },
    //跳转到品目对应页
    handleClick(row) {
      this.$router.push({name:'ItemCorrespond',query:{ItemID:row.id,mallCCategoryLevel:row.partyCCategoryLevel,projectName:row.projectName}})
    },

    handleCurrentChange(val) {
      console.log(val);
      this.findMallInfoListParam.pageNum = val;
      this.getTableData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findMallInfoListParam.pageSize=val;
      this.getTableData()
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    //跳转商品池管理
    toProductPondManage(row) {
      this.$router.push({name:'ProductPondManage',query:{ProductId:row.id,projectName:row.projectName}})
    },

    //跳转到新建商城项目
    toItemCorrespond() {
      this.$router.push({name:'CreateMallItem'})
    },
    //跳转到详情页
    toProjectDetail(row) {
      this.$router.push({name:'ItemDetail',query:{mallId:row.id}})
    },
    //跳转到品牌对应
    toBrandCorrespond(row) {
      this.$router.push({name:'CorrespondBrand',query:{BrandId:row.id}})
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
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 0 0 10px;
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
      margin: 10px 5px 0 5px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      .inputBox {
        float: left;
        margin: 10px;
      }
      .el-input {
        width: 180px;
        margin-left: 10px;
      }
      .el-select {
        width: 180px;
      }
      .inputBox2 {
        float: left;
        margin: 10px;
        .el-input {
          width: 100px;
          margin-left: 10px;
        }
      }
    }

    // .homeBottomBox {
    //   border-top: 1px solid #e4e4e4;
    //   display: flex;
    //   flex-wrap: wrap;
    //   .inputBox {
    //     width: 25%;
    //     display: flex;
    //     align-items: center;
    //     span {
    //       text-align: right;
    //       flex: 0 0 98px;
    //     }
    //   }
    //   .el-input {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    //   .el-select {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    // }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    .listBoxTop {
      line-height: 50px;
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
  .dialogs {
    .addman {
      display: flex;
      flex-direction: row-reverse;
      margin: 10px;
      border-bottom: 1px solid #ccc;
    }
    .validateForm {
      height: 250px;
      width: 90%;
      margin: 20px auto;
      overflow: auto;
      // overflow: hidden;
      .inputBox {
        display: flex;
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
        span {
          display: flex;
          width: 100px;
          justify-content: center;
          align-items: center;
        }
        .el-input {
          width: 200px;
          margin-right: 20px;
        }
        .el-select {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>

<style lang="less" scoped>
.brandBox {
  .el-dialog__header {
    background: #ccc;
    height: 30px;
    font-weight: 800;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    .el-button {
      width: 120px;
    }
  }
}
</style>











