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
              <span>新采购人ID：</span>
              <el-input
                placeholder="新采购人ID"
                v-model="findBrandParam.newUserNos"
                @clear="clearInput()"
                @focus="openDia('NewGoodsSearch')"
                clearable
              ></el-input>
            </div>
            <div class="inputBox">
              <span>新采购人名称：</span>
               <el-input
                placeholder="新采购人名称"
                v-model="findBrandParam.newUserName"
                @clear="findBrandParam.newUserName=null"
                clearable
              ></el-input> 
            </div>
            <div class="inputBox">
              <span>旧采购人ID：&nbsp;&nbsp;</span>
              <el-input
                placeholder="旧采购人ID"
                v-model="findBrandParam.oldUserIds"
                @clear="clearOld()"
                @focus="openDia('OldSearch')"
                clearable
              ></el-input>
            </div>
            <div class="inputBox">
              <span>新客户名称：</span>
              <el-select
                v-model="findBrandParam.newCustomerId"
                filterable
                remote
                clearable
                placeholder="新客户名称"
                :remote-method="skuNameMethod"
                @change="(value)=>{getCategoryName(value,'custom',searchskuNames)}"
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
              <span>新部门名称：</span>
              <el-select
                v-model="findBrandParam.newDepartmentId"
                filterable
                remote
                clearable
                placeholder="新部门名称"
                :disabled="!findBrandParam.newCustomerId"
                :remote-method="sectionNameMethod"
                @change="(value)=>{getCategoryName(value,'section',searchsectionNames)}"
              >
                <el-option
                  v-for="item in searchsectionNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
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
          <div class="white-btn fun-btn" @click="openDia('CorrespondPurchase')" v-if="isActive==0&&$authorities.CreatePurchaserCorrespond">
            <i class="iconfont icontianjiashangpin"></i>添加
          </div>
          <div class="white-btn fun-btn" @click="exportList()" v-if="$authorities.ExportPurchaserCorrespond">
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
          <el-table-column prop="newUserId" label="新采购人ID" align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0">{{scope.row.newUserId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="newUserName" label="新采购人名称" align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0">{{scope.row.newUserName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oldUserId" label="旧采购人ID" align="center"></el-table-column>
          <el-table-column prop="oldUserName" label="旧采购人名称" align="center">
            <template slot-scope="scope">{{scope.row.oldUserName}}</template>
          </el-table-column>
          <el-table-column prop="relationStatusText" label="关系状态" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="添加时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delBrandID(scope.row)"
                v-if="isActive==0&&$authorities.DeletePurchaserCorrespond"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.PurchaserCorrespondDetail"
                @click="changePage('PurchaseCorrespondDetail',{id:scope.row.relationId})"
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
    <CorrespondPurchase ref="CorrespondPurchase" @corrCallback="corrCallback"></CorrespondPurchase>
    <OldSearch ref="OldSearch" @oldSeaCallback="oldSeaCallback" title="旧采购人ID" content="采购人"></OldSearch>
    <NewGoodsSearch ref="NewGoodsSearch" @newGoodsSearch="newGoodsSearch" title="新采购人ID" content="采购人"></NewGoodsSearch>
  </div>
</template>
<script>
import store from "@/store/store";
import {
  findProjectCorrespondList,
  exportProjectCorrespond,
  deleteProjectCorrespond,
  getStatus,
  getCustomList,
  getSectionList
} from "@/api/goods/purchaseCorrespondManage.js";
import CorrespondPurchase from "../child/CorrespondPurchase";
import OldSearch from "../child/OldSearch";
import NewGoodsSearch from "../child/NewGoodsSearch";
export default {
  inject: ["reload"],
  name: "PurchaseCorrespondManage",
  data() {
    return {
      headers: null,
      isActive: 0,
      isShow: true,
      tableData: null,
      searchskuNames: [],
      searchsectionNames: [],
      loading: false,
      //错误提示消息
      exportQuery: {
        firstLevelModule: "商品",
        newCustomerId: null,
        newCustomerName: null,
        newDepartmentId: null,
        newDepartmentName: null,
        newUserName: null,
        newUserNos: null,
        oldUserIds:null,
        pageNum: 1,
        pageSize: 10,
        secondLevelModule: "新老系统数据对应管理",
        status: 0,
        thirdLevelModule: "采购人数据对应管理"
      },
      findBrandParam: {
        pageNum: 1,
        pageSize: 10,
        newCustomerId: null,
        oldUserIds: null, 
        newUserNos: null,
        newUserName:null,
        newDepartmentId:null,
        status: 0,
      },
      resultArr: [],
      paginations: {
        total: 100 //总数
      },
    };
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  components: {OldSearch,NewGoodsSearch,CorrespondPurchase},
  mounted() {
  },
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
        (this.findBrandParam.newCustomerId = null),
        (this.findBrandParam.newUserNos = null),
        (this.findBrandParam.newUserName = null),
        (this.findBrandParam.newDepartmentId = null),
        (this.findBrandParam.newCustomerName = null),
        (this.findBrandParam.oldUserIds = null),
        (this.findBrandParam.status = null),
        this.change(this.isActive);
    },
    getCategoryName(value, type,row) {
      if(type=='custom'){
       let str = [];
        str = row.filter(item => {
          return item.id == value;
        });
        this.findBrandParam.newCustomerName = str[0] && str[0].name;
      }else if(type=='section'){
        let str = [];
        str = row.filter(item => {
          return item.id == value;
        });
        this.findBrandParam.newDepartmentName = str[0] && str[0].name;
      }
        
    },
    getOrderNumber() {
      let OrderObj = {};
      this.tableData.forEach((item, index) => {
        item.rowIndex = index;
        if (OrderObj[item.newUserId]) {
          OrderObj[item.newUserId].push(index);
        } else {
          OrderObj[item.newUserId] = [];
          OrderObj[item.newUserId].push(index);
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
      this.findBrandParam.newUserNos = null;
    },
    clearOld() {
      this.findBrandParam.oldUserIds = null;
    },
    skuNameMethod(query) {
      if (query != "") {
        getCustomList(query)
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
    sectionNameMethod(query){
     if (query != "") {
        getSectionList(this.findBrandParam.newCustomerId,query)
          .then(res => {
            if (res.code === "000000") {
              this.searchsectionNames = res.data;
            }
          })
          .catch(err => {});
      } else {
        this.searchsectionNames = [];
      }
    },
    corrCallback() {
      this.changeTab(this.isActive);
    },
    oldSeaCallback(row) {
      this.findBrandParam.oldUserIds = row;
    },
    newGoodsSearch(row) {
      this.findBrandParam.newUserNos = row;
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
        item = data[i].mappingOldUserDTOS.map(gg => {
          return {
            newUserName: data[i].newUserName,
            newUserId: data[i].newUserId,
            oldUserId: gg.oldUserId,
            oldUserName: gg.oldUserName,
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









