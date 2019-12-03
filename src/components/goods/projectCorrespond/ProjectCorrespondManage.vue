<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:item.status==isActive}"
        v-for="(item,index) in headers"
        @click="changeTab(item.status)"
        :key="index"
      >{{item.statusName}}（{{item.statusCount}}）</el-button>
    </div>
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
          <div class="filterSearchBox">
            <div class="inputBox">
              <span>新项目编号：</span>
              <el-input
                placeholder="新项目编号"
                v-model="findBrandParam.newProjectNos"
                @clear="clearInput()"
                @focus="openDia('NewGoodsSearch')"
                clearable
              ></el-input>
            </div>
            <div class="inputBox">
              <span>新项目名称：</span>
              <el-select
                v-model="findBrandParam.newProjectId"
                filterable
                remote
                clearable
                placeholder="新项目名称"
                :remote-method="skuNameMethod"
                @change="(value)=>{getCategoryName(value,searchskuNames)}"
              >
                <el-option
                  v-for="item in searchskuNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="inputBox">
              <span>旧项目类型：</span>
              <el-select v-model="findBrandParam.oldProjectType"  placeholder="全部">
                <el-option
                  v-for="item in optionsOldProject"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="inputBox">
              <span>旧项目ID：&nbsp;&nbsp;</span>
              <el-input
                placeholder="旧项目ID"
                v-model="findBrandParam.oldProjectIds"
                @clear="clearOld()"
                @focus="openDia('OldSearch')"
                clearable
              ></el-input>
            </div>
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
          <div class="white-btn fun-btn" @click="openDia('CorrespondProject')" v-if="isActive==0&&$authorities.CreateProjectCorrespond">
            <i class="iconfont icontianjiashangpin"></i>添加
          </div>
          <div class="white-btn fun-btn" @click="exportList()" v-if="$authorities.ExportProjectCorrespond">
            <i class="iconfont icondingdanguanli"></i>导出
          </div>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small"
          :max-height="dataListHeight"
          :span-method="arraySpanMethod"
        >
          <el-table-column prop="newProjectNo" label="新项目编号" align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0">{{scope.row.newProjectNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="newProjectName" label="新项目名称" align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0">{{scope.row.newProjectName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oldProjectTypeText" label="旧项目类型" align="center"></el-table-column>
          <el-table-column prop="oldProjectId" label="旧项目ID" align="center"></el-table-column>
          <el-table-column prop="oldProjectName" label="旧项目名称" align="center">
            <template slot-scope="scope">{{scope.row.oldProjectName}}</template>
          </el-table-column>
          <el-table-column prop="relationStatusText" label="关系状态" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="添加时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delBrandID(scope.row)"
                v-if="isActive==0&&$authorities.DeleteProjectCorrespond"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.ProjectCorrespondDetail"
                @click="changePage('ProjectCorrespondDetail',{id:scope.row.relationId})"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="findBrandParam.pageNum"
        :page-size="findBrandParam.pageSize"
        :page-sizes="[10,20,30,40,50,100,500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginations.total"
      ></el-pagination>
    </div>
    <CorrespondProject ref="CorrespondProject" @corrCallback="corrCallback"></CorrespondProject>
    <OldSearch ref="OldSearch" @oldSeaCallback="oldSeaCallback" title="旧项目ID" content="项目"></OldSearch>
    <NewGoodsSearch
      ref="NewGoodsSearch"
      @newGoodsSearch="newGoodsSearch"
      title="新项目编号"
      content="项目"
    ></NewGoodsSearch>
  </div>
</template>
<script>
import store from "@/store/store";
import {
  findProjectCorrespondList,
  exportProjectCorrespond,
  deleteProjectCorrespond,
  getStatus,
  nameList
} from "@/api/goods/projectCorrespondManage.js";
import { selectProduct, findClassify } from "@/api/goodsManage.js";
import { timeFormat, downloadFile } from "@/utils/index";
import CorrespondProject from "../child/CorrespondProject";
import OldSearch from "../child/OldSearch";
import NewGoodsSearch from "../child/NewGoodsSearch";
export default {
  inject: ["reload"],
  name: "ProjectCorrespondManage",
  data() {
    return {
      headers: null,
      isActive: 0,
      isShow: true,
      tableData: null,
      options4: null,
      optionsOldProject: [
        { label: "全部", value: -1 },
        { label: "商城", value: 2 },
        { label: "专柜", value: 3 },
      ],
      searchskuNames: [],
      loading: false,
      //错误提示消息
      exportQuery: {
        firstLevelModule: "商品",
        newProjectId: null,
        newProjectName: null,
        newProjectNos: [],
        oldProjectType: -1,
        oldProjectIds: [],
        pageNum: 1,
        pageSize: 10,
        secondLevelModule: "新老系统数据对应管理",
        status: 0,
        thirdLevelModule: "项目数据对应管理"
      },
      findBrandParam: {
        newProjectId: null,
        newProjectNos: null,
        oldProjectIds: null,
        oldProjectType: -1,
        pageNum: 1,
        pageSize: 10,
        status: 0
      },
      resultArr: [],
      paginations: {
        total: 100 //总数
      }
    };
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  components: { OldSearch, NewGoodsSearch, CorrespondProject },
  mounted() {},
  activated() {
    this.getStatus();
    //获取表格数据
    this.getTableData();
    if (this.$route.params.isUpdate) {
      this.changeTab(this.isActive);
    }
  },
  methods: {
    reset() {
      (this.findBrandParam.pageNum = 1),
        (this.findBrandParam.pageSize = 10),
        (this.findBrandParam.newProjectId = null),
        (this.findBrandParam.newProjectNos = null),
        (this.findBrandParam.oldProjectType = -1),
        (this.findBrandParam.oldProjectIds = null),
        (this.findBrandParam.status = null),
        this.change(this.isActive);
    },
    getCategoryName(value, row) {
      let str = [];
      str = row.filter(item => {
        return item.id == value;
      });
      this.findBrandParam.newProjectName = str[0] && str[0].name;
    },
    getOrderNumber() {
      let OrderObj = {};
      this.tableData.forEach((item, index) => {
        item.rowIndex = index;
        if (OrderObj[item.newProjectNo]) {
          OrderObj[item.newProjectNo].push(index);
        } else {
          OrderObj[item.newProjectNo] = [];
          OrderObj[item.newProjectNo].push(index);
        }
      });
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.resultArr.push(OrderObj[k]);
        }
      }
    },
    // 合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex !== 2 &&
        columnIndex !== 3 &&
        columnIndex !== 4 &&
        columnIndex !== 5 &&
        columnIndex !== 6 &&
        columnIndex !== 7
      ) {
        for (let i = 0; i < this.resultArr.length; i++) {
          let element = this.resultArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    clearInput() {
      this.findBrandParam.newProjectNos = null;
    },
    clearOld() {
      this.findBrandParam.oldProjectIds = null;
    },
    skuNameMethod(query) {
      if (query != "") {
        nameList({ name: query })
          .then(res => {
            if (res.code === "000000") {
              this.searchskuNames = res.data;
            }
          })
          .catch(err => {});
      } else {
        this.searchskuNames = [];
      }
    },
    corrCallback() {
      this.changeTab(this.isActive);
    },
    oldSeaCallback(row) {
      this.findBrandParam.oldProjectIds = row;
    },
    newGoodsSearch(row) {
      this.findBrandParam.newProjectNos = row;
    },
    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let aa = { name: query };
        remoteBrandName(aa).then(res => {
          if (res.code == "000000") {
            this.options4 = res.data;
            this.loading = false;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    //获取表格数据
    getTableData() {
      findProjectCorrespondList(this.findBrandParam).then(res => {
        this.tableData = this.changeData(res.data.items);
        this.resultArr = [];
        this.getOrderNumber();
        this.paginations.total = res.data.total;
        this.findBrandParam.pageNum = res.data.pageNum;
        this.findBrandParam.pageSize = res.data.pageSize;
      });
    },
    changeData(data) {
      let str = [];
      for (let i = 0; i < data.length; i++) {
        let item;
        item = data[i].mappingOldProjectDTOList.map(gg => {
          return {
            newProjectId: data[i].newProjectId,
            newProjectName: data[i].newProjectName,
            newProjectNo: data[i].newProjectNo,
            oldProjectId: gg.oldProjectId,
            oldProjectTypeText: gg.oldProjectTypeText,
            oldProjectName: gg.oldProjectName,
            relationId: gg.relationId,
            relationStatus: gg.relationStatus,
            relationStatusText: gg.relationStatusText,
            updateTime: gg.updateTime
          };
        });
        str = str.concat(item);
      }
      return str;
    },
    //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
    queryBrand1() {
      this.findBrandParam.pageNum = 1;
      this.change(this.isActive);
    },
    //获取按钮的状态和数量
    getStatus() {
      getStatus().then(res => {
        this.headers = res.data;
      });
    },
    //切换tab
    changeTab(index) {
      this.isActive = index;
      this.change(index);
    },
    change(index) {
      this.findBrandParam.status = index;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.findBrandParam.pageNum = val;
      this.changeTab(this.isActive);
    },
    handleSizeChange(val) {
      this.findBrandParam.pageSize = val;
      this.changeTab(this.isActive);
    },
    changePage(name, query) {
      this.$router.push({
        name: name,
        query: query
      });
    },
    exportList() {
      this.exportQuery = Object.assign(this.exportQuery, this.findBrandParam);
      exportProjectCorrespond(this.exportQuery).then(res => {
        if (res.code == "000000") {
          this.$confirm(`导出任务创建成功前往任务列表查看？`, "提示信息", {
            confirmButtonText: "前往任务列表",
            cancelButtonText: "取消"
          })
            .then(res => {
              this.$router.push({
                name: "statisticsTaskTable",
                params: { isUpdate: true }
              });
            })
            .catch(() => {});
        }
      });
    },
    openDia(name) {
      this.$refs[name].init();
    },
    //删除按钮
    delBrandID(row) {
      this.$confirm('确定要删除这条新旧系统关联数据吗？','删除提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消'
      }).then(()=>{
       deleteProjectCorrespond(row.relationId).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "删除对应关系成功",
            type: "success"
          });
          this.$nextTick(() => {
            this.getStatus();
            this.getTableData();
          });
        }
      });
      }).catch(()=>{

      })
      
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
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
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
      .filterSearchBox {
        display: flex;
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
    }
  }
  .listBox {
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
  }
  .block {
    margin-top: 10px;
    text-align: right;
  }
}
</style>









