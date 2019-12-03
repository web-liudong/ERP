<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="(item,index) in statusBag"
        :key="index"
        :class="{active:status==item.code}"
        @click="getList(1,item.code)"
      >{{item.text}}（{{item.count}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">{{isShow?'收起':'展开'}}筛选</span>
          <el-button size="small" @click="getList(1,status)">查询结果</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="search-icon">
            <span>采购单编号：</span>
            <el-input placeholder="请输入采购单编号" v-model="purchaseNo" clearable type="number"></el-input>
          </div>
          <div class="search-icon">
            <span>创建日期：</span>
            <el-date-picker
              v-model="time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="search-icon">
            <span>供应商：</span>
            <el-select
              v-model="supplierName"
              filterable
              remote
              clearable
              placeholder="请输入供应商名称"
              :remote-method="supplierRemote"
              @change="supplierchange"
            >
              <el-option
                v-for="item in suppliers"
                :key="item.name"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>仓库：</span>
            <el-select
              v-model="warehouseId"
              filterable
              clearable
              remote
              placeholder="请输入仓库名称"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in warehouses"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>到货类型：</span>
            <el-select v-model="deliveryType" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-icon">
            <span>采购员：</span>
            <el-select
              v-model="purchaserId"
              filterable
              remote
              clearable
              placeholder="请输入采购员姓名"
              :remote-method="buyerRemote"
            >
              <el-option
                v-for="item in buyerName"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表">
        <div>
          <el-button plain size="small" @click="creat" v-if="$authorities.PurchseManageAdd">
            <i class="iconfont iconzengjia"></i>新建采购单
          </el-button>
          <el-button plain size="small" @click="jinvoice" v-if="$authorities.PurchseManageExport">
            <i class="iconfont icondaochu"></i>导出
          </el-button>
        </div>
      </table-head>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="紧急程度" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.urgentLevelText?scope.row.urgentLevelText:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购单编号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.purchaseOrderNo?scope.row.purchaseOrderNo:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center" :formatter="amount"></el-table-column>
        <el-table-column label="供应商" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.supplierName?scope.row.supplierName:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结款方式" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.payTypeText?scope.row.payTypeText:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.invoiceTypeText?scope.row.invoiceTypeText:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购员" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.purchaserName?scope.row.purchaserName:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="到货类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.deliveryTypeText?scope.row.deliveryTypeText:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.warehouseName?scope.row.warehouseName:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="statusText"></el-table-column>
        <el-table-column prop="createTimeText" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="submit(scope.row.id)"
              v-if="status==-2&&$authorities.PurchseManageEdit"
            >提交</el-button>
            <el-button
              type="text"
              size="small"
              @click="goDetail(scope.row)"
              v-if="$authorities.PurchseManageDetail&&status!==-2"
            >详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="cancel(scope.row)"
              v-if="(scope.row.status==1||status==-2)&&$authorities.PurchseManageCancel"
            >取消</el-button>
            <el-button
              type="text"
              size="small"
              @click="income(scope.row.id)"
              v-if="scope.row.profitAndLossStatus===0&&$authorities.PurchseManagelost"
            >损益确认</el-button>
            <el-button
              type="text"
              size="small"
              @click="confirm(scope.row)"
              v-if="((scope.row.status==1||scope.row.status==2)&&$authorities.PurchseManageConfirm)&&!scope.row.deliveryConfimStatus"
            >到货确认</el-button>
            <el-button
              type="text"
              size="small"
              @click="purchaseEdit(status,scope.row.id)"
              v-if="(scope.row.status==5||status==-2)&&$authorities.PurchseManageEdit"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  managementList,
  statusCount,
  getdetail,
  cancel,
  searchlist,
  orderlistexport,
  nameList,
  orderSubmit
} from "@/api/purchase/purchase";
import { getBuyerName } from "@/api/purchaseApproval";
import { downloadFile } from "@/utils";
import TableHead from "@/components/common/TableHead/tablehead";
import qs from "qs";
export default {
  inject: ["reload"], //注入依赖
  name: "PurchaseOrder",
  data() {
    return {
      purchaseNo: null,
      time: null,
      supplierId: null,
      suppliers: [],
      warehouseId: null,
      warehouses: [],
      options: [
        {
          value: "0",
          label: "入仓"
        },
        {
          value: "1",
          label: "厂直"
        }
      ],
      supplierName: null,
      deliveryType: null,
      status: -1,
      tableData: [],
      statusBag: [],
      page: 1,
      total: 0,
      isShow: true,
      pageSize: 10,
      supplierType: null,
      buyerName: [],
      purchaserId: null
    };
  },
  components: {
    TableHead
  },
  activated() {
    if (this.$route.query.active) {
      this.getList(1, -2);
    } else {
      this.getList(1, -1);
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    submit(id) {
      orderSubmit(id).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          this.reload();
        }
      });
    },
    buyerRemote(query) {
      var storage = window.localStorage;
      var UserInfo = storage.getItem("UserInfo");
      var userPosts = JSON.parse(UserInfo).userPosts;
      var organizationId = userPosts[0].organizationId;
      if (query) {
        getBuyerName({ organizationId: organizationId, realName: query }).then(
          res => {
            if (res.code == "000000") {
              this.buyerName = res.data;
            }
          }
        );
      }
    },
    supplierchange(val) {
      this.supplierId = val.id;
      this.supplierName = val.name;
      this.supplierType = val.purchaseType;
    },
    reset() {
      this.deliveryType = null;
      this.time = null;
      this.pageNum = 1;
      this.pageSize = 10;
      this.purchaseNo = null;
      this.startDate = null;
      this.supplierId = null;
      this.supplierName = null;
      this.warehouseId = null;
      this.purchaserId = null;
      this.getList(1, this.status);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList(1, this.status);
    },
    amount(row, column, cellValue, index) {
      if (row.amount === null) {
        return "——";
      } else {
        return "￥" + row.amount.toFixed(2);
      }
    },
    jinvoice() {
      orderlistexport({
        deliveryType: this.deliveryType,
        endDate: this.time ? this.time[1] : null,
        pageNum: this.page,
        pageSize: this.pageSize,
        purchaseNo: this.purchaseNo == "" ? null : this.purchaseNo,
        startDate: this.time ? this.time[0] : null,
        status: this.status,
        purchaseType: this.supplierType,
        supplierId: this.supplierId,
        warehouseId: this.warehouseId
      }).then(res => {
        downloadFile(res);
      });
    },
    confirm(row) {
      this.$router.push({
        name: "PurchaseConfirm",
        query: {
          id: row.id,
          type: row.deliveryTypeText == "入仓" ? 1 : 2
        }
      });
    },
    goDetail(row) {
      this.$router.push({
        name: "PurchaseDetail",
        query: {
          id: row.id
        }
      });
    },
    income(id) {
      this.$router.push({
        name: "Factoryincome",
        query: {
          id: id
        }
      });
    },
    cancel(row) {
      this.$confirm(
        row.createType || row.status == -2
          ? "取消后，该采购单相关的采购需求将直接删除"
          : "取消后，该采购单相关的采购需求将释放回需求池",
        "取消提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(() => {
        let data = qs.stringify({
          status: row.status === null ? -2 : row.status
        });
        cancel(row.id, data).then(res => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "取消成功"
            });
            this.reload();
          } else if (/(^98)|(^01)/.test(res.code)) {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        });
      });
    },
    purchaseEdit(status, id) {
      if (status == -2) {
        const { href } = this.$router.push({
          name: "PurchaseDraftEditing",
          query: {
            id: id
          }
        });
      } else {
        const { href } = this.$router.push({
          name: "PurchaseOrderEdit",
          query: {
            id: id,
            list: true
          }
        });
      }
    },
    remoteMethod(query) {
      if (query) {
        searchlist({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.warehouses = res.data;
          }
        });
      }
    },
    supplierRemote(query) {
      if (query) {
        nameList(query).then(res => {
          if (res.code == "000000") {
            this.suppliers = res.data;
          }
        });
      }
    },
    creat() {
      this.$router.push({
        name: "addPurchaseOrder"
      });
    },
    getList(page, status) {
      this.status = status;
      this.getcount();
      managementList({
        deliveryType: this.deliveryType,
        endDate: this.time ? this.time[1] : null,
        pageNum: page,
        pageSize: this.pageSize,
        purchaseNo: this.purchaseNo == "" ? null : this.purchaseNo,
        startDate: this.time ? this.time[0] : null,
        status: status,
        supplierId: this.supplierId,
        warehouseId: this.warehouseId,
        purchaseType: this.supplierType,
        purchaserId: this.purchaserId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.page = res.data.pageNum;
        }
      });
    },
    getcount() {
      statusCount().then(res => {
        if (res.code == "000000") {
          this.statusBag = res.data;
        }
      });
    },
    handleCurrentChange(val) {
      this.getList(val, this.status);
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .left-dialog {
    height: 46px;
    border: 1px solid #e4e4e4;
    line-height: 46px;
    text-align: right;
    background-color: #f5f5f5;
    font-size: 16px;
    font-weight: bold;
  }
  .right-dialog {
    height: 46px;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    line-height: 46px;
    font-size: 16px;
    padding-left: 10px;
  }
  .buttonBox {
    margin-top: 5px;
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding-left: 20px;
      box-sizing: border-box;
      .head-left {
        display: flex;
        align-items: center;
      }
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      .myicon {
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
      .search-icon {
        display: inline-block;
        padding: 10px 10px;
        .el-input {
          width: 200px;
        }
      }
    }
  }
  .listBox {
    font-size: 12px;
    margin: 10px 0 0 0;
  }
  .block {
    margin-top: 2px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
