<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
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
      <div class="homeBoxBottom" v-show="isShow">
        <span>项目名称：</span>
        <el-select
          v-model="query.projectId"
          filterable
          remote
          placeholder="项目名称"
          :remote-method="(query)=>{
            querySearch(query,'name','remoteNameList')
          }"
          :loading="remoteLoading"
          clearable
        >
          <el-option
            v-for="item in remoteNameList"
            :key="item.id+item.name"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>项目集团负责人：</span>
        <el-select
          v-model="query.userDataAuthorityId"
          filterable
          remote
          placeholder="请输入负责人"
          :remote-method="(query)=>{
            querySearch(query,'author','remoteAuthorList')
          }"
          :loading="remoteLoading"
          clearable
        >
          <el-option
            v-for="item in remoteAuthorList"
            :key="item.id+item.userName"
            :label="item.realName"
            :value="item.id"
          ></el-option>
        </el-select>
        <span>客户名称：</span>
        <el-select
          v-model="query.customerId"
          filterable
          remote
          placeholder="请输入客户名称"
          :remote-method="(query)=>{
            querySearch(query,'custom','remoteCustomList')
          }"
          :loading="remoteLoading"
          clearable
        >
          <el-option
            v-for="item in remoteCustomList"
            :key="item.id+item.name"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i> 数据列表
        </span>
        <el-table :data="tableData" border style="width: 100%" size="small" :max-height="dataListHeight">
          <el-table-column prop="projectNo" label="编号" align="center"></el-table-column>
          <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
          <el-table-column prop="type" label="项目类型" align="center"></el-table-column>
          <el-table-column prop="userDataAuthorityName" label="项目集团负责人" align="center"></el-table-column>
          <el-table-column prop="publisherName" label="项目发布负责人" align="center"></el-table-column>
          <el-table-column prop="shoppeNavigationTypeName" label="导航类型" align="center"></el-table-column>
          <el-table-column prop="skuCount" label="相关" align="center">
            <template slot-scope="scope">
              <router-link
                :to="{name:'customermanage',query:{pid:scope.row.projectId}}"
                class="btn"
              >客户：{{scope.row.customersCount}}</router-link>
              <router-link
                :to="{name:'ShoppeGoodsManage',query:{id:scope.row.projectId}}"
                class="btn"
              >商品：{{scope.row.skuCount}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="320">
            <template slot-scope="scope">
              <el-button @click="showDialog('setEditNav',scope.row)" type="text" size="small" v-if="$authorities.ShoppeProjectEdit">编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 1)"
                v-if="$authorities.ShoppeNavManage"
              >导航管理</el-button>
              <el-button
                type="text"
                size="small"
                @click="checkOperate(scope.row, 2)"
                v-if="$authorities.ShoppeGoodsManage"
              >商品池管理</el-button>
              <el-button
                type="text"
                size="small"
                @click="oepnWin('ShoppeProjectDetail',{ id: scope.row.projectId })"
                v-if="$authorities.ShoppeProjectDetail"
              >详情</el-button>
              <el-button type="text" size="small" @click="checkOperate(scope.row, 3)" v-if="$authorities.ShoppeProjectSetAdmin">协同运营者</el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 32px;"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
    <setEditNav ref="setEditNav" @callback="dialogCallback"></setEditNav>
    <addManage ref="addManage"></addManage>
  </div>
</template>
<script>
import { getDataList, getCheckData } from "@/api/release/specialProjectManage";
import {
  nameList,
  simpleList
} from "@/api/projectController/projectController";
import { customerName } from "@/api/customerManage";
import setEditNav from "./child/set_edit_nav";
import addManage from "./child/add_manage";
export default {
  inject: ["reload","isFilterShow"],
  name:'ShoppeProjectManage',
  data() {
    var check = (rule, value, callback) => {
      console.log("check");
      if (!value) {
        return callback(new Error("请选择导航设置"));
      }
      //callback();
    };
    return {
      isShow:this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      remoteLoading: false, //筛选查询loading
      remoteNameList: null,
      remoteAuthorList: null,
      remoteCustomList: null,
      query: {
        customerId: "",
        projectId: "",
        userDataAuthorityId: "",
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false,
      tableData: [],
      totalPage: 0,
      editForm: {
        nav: "1"
      },
      rules: {
        nav: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  components: {
    setEditNav,
    addManage
  },
  computed: {
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  mounted() {
    //获取表格数据
    this.getTableData();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getTableData();
    }
  },
  methods: {
    //获取表格数据
    getTableData() {
      getDataList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
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
        customerId: "",
        projectId: "",
        userDataAuthorityId: "",
        pageNum: 1,
        pageSize: 10
      };
      this.getTableData();
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "name") {
          nameList({ name: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "author") {
          simpleList({ userName: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "custom") {
          customerName(query).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
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
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    dialogCallback() {
      this.getTableData();
    },
    checkOperate(row, type, validate){
      getCheckData(row.projectId).then(res => {
        if(res.data){
          if (type == 1) {
            //导航管理
            this.oepnWin('ShoppeNav',{ id: row.projectId, shoppe: row.projectName})
          } else if (type == 2) {
            //商品池管理
            this.oepnWin('ShoppeGoodsManage',{ id: row.projectId, shoppe: row.projectName })
          }else{
            //协同运营者
            this.showDialog('addManage', row)
          }
        }else{
          this.$message({
            type: "error",
            message: "您没有该条数据的操作权限"
          });
        }
      });
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
      height: 50px;
      line-height: 50px;
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
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 200px;
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select {
        margin: 10px 0;
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
    .btn {
      color: #399;
      margin-left: 10px;
      display: inline-block;
      &:hover {
        text-decoration: none;
        color: #5cadad;
      }
    }
  }
  .block {
    margin-top: 10px;
    text-align: right;
  }
}
</style>