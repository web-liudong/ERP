<template>
  <div class="demandBox">
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
          <el-button size="small" @click="select">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>集采单号：</span>
            <el-input
              placeholder="请输入商品名称"
              v-model="findPurchaseListParam.purchaseOrderNo"
              clearable
            ></el-input>
          </div>
          <div class="inputBox">
            <span>需求单位：</span>
            <el-select
              v-model="findPurchaseListParam.requirementOrganizationId"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="选择/输入需求单位名称"
              :remote-method="getListName"
              :loading="loading"
            >
              <el-option
                v-for="item in requirementOrganizations"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>紧急程度：</span>
            <el-select v-model="findPurchaseListParam.urgentLevel" clearable placeholder="全部">
              <el-option
                v-for="item in urgentLevels"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>到货类型：</span>
            <el-select v-model="findPurchaseListParam.deliveryType" clearable placeholder="全部">
              <el-option
                v-for="item in deliveryTypes"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>采购方式：</span>
            <el-select v-model="findPurchaseListParam.payType" clearable placeholder="全部">
              <el-option
                v-for="item in payTypes"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>下单日期：</span>
            <el-date-picker
              v-model="dataTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表
        </div>
        <div class="listRight">
          <el-button
            size="small"
            @click="openWin('CreatPurchaseOrder',{'ids':ids,source:1})"
            v-if="$authorities.PurchaseCollectionOrderCreate"
          >
            <i class="iconfont iconcaigoudan"></i>
            <span>生成采购单</span>
          </el-button>
          <el-button
            size="small"
            @click="purchaseExport"
            v-if="$authorities.PurchaseCollectionExport"
          >
            <i class="iconfont icondaochu"></i>
            <span>导出</span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData"
          border
          :max-height="dataListHeight"
          style="width: 100%"
          :header-cell-style="tableStyle"
          @selection-change="selectChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="urgentLevel" label="紧急" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.urgentLevel == 0? '不紧急' : scope.row.urgentLevel == 1 ? "紧急" : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseOrderNo" label="集采单号" align="center" width="150"></el-table-column>
          <el-table-column prop="requirementOrganizationName" label="需求单位" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="amount" label="采购总额" align="center">
            <template slot-scope="scope">
              <span>￥</span>
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryType" label="到货类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.deliveryType==0? '入仓': scope.row.deliveryType==1?'厂直':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payType" label="采购方式" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.payType == 0? '签单收货': scope.row.payType ==1?'现金采购':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recipientAddress" label="收货地址" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="下单日期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="goLibrary(scope.row)"
                v-if="$authorities.PurchaseCollectionBalancedTreasury"
              >平衡利库</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row)"
                v-if="$authorities.PurchaseCollectionDetail"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="more" @click="listMore" v-if="this.total>this.findPurchaseListParam.pageSize">
        <p>加载更多......</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  purchaseList,
  getListName,
  purchaseExport
} from "@/api/purchase/purchaseCollectionOrder";
export default {
  inject: ["reload", "isFilterShow"],
  name: "PurchaseCollectionOrder",
  data() {
    return {
      tableStyle: {
        background: "#f5f7fa"
      },
      findPurchaseListParam: {
        description: null, //集采订单获取入参
        deliveryType: null, //到货类型
        endDate: null, //下单日期-结束
        pageNum: 1,
        pageSize: 10,
        payType: null, //采购方式
        purchaseOrderNo: null, //集采订单编号
        requirementOrganizationId: null, //需求单位Id
        startDate: null, //下单日期-开始
        urgentLevel: null //紧急程度
      },
      total: "",
      //紧急程度
      urgentLevels: [
        {
          label: "不紧急",
          type: 0
        },
        {
          label: "紧急",
          type: 1
        }
      ],
      // 到货类型
      deliveryTypes: [
        {
          label: "入仓",
          type: 0
        },
        {
          label: "厂直",
          type: 1
        }
      ],
      //采购方式
      payTypes: [
        {
          label: "签单收货",
          type: 0
        },
        {
          label: "现金采购",
          type: 1
        }
      ],
      //需求单位模糊搜索
      requirementOrganizations: [],
      isShow: this.isFilterShow,
      loading: "",
      dataTime: [],
      tableData: [],
      multipleSelection: [],
      ids: null
    };
  },
  created() {
    this.purchaseList();
  },
  filters: {
    formatDate: val => {
      if (val != null) {
        let data = new Date(val);
        return (
          data.getFullYear() +
          "-" +
          (data.getMonth() + 1) +
          "-" +
          data.getDate()
        );
      }
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset() {
      this.findPurchaseListParam.description = null; //集采订单获取入参
      this.findPurchaseListParam.deliveryType = null; //到货类型
      this.findPurchaseListParam.urgentLevel = null; //紧急程度
      this.findPurchaseListParam.payType = null; //采购方式
      this.findPurchaseListParam.purchaseOrderNo = null; //集采订单编号
      this.findPurchaseListParam.requirementOrganizationId = null; //需求单位Id
      this.dataTime = null;
      this.findPurchaseListParam.pageNum = 1;
      this.findPurchaseListParam.pageSize = 10;
      this.findPurchaseListParam.startDate = null;
      this.findPurchaseListParam.endDate = null;
      console.log(this.findPurchaseListParam, "000000000000");
      this.purchaseList();
    },
    //需求单位模糊搜索
    getListName(query) {
      this.loading = true;
      getListName({ name: query }).then(res => {
        this.loading = false;
        if (res.code == "000000") {
          console.log(res.data);
          this.requirementOrganizations = res.data;
        }
      });
    },
    //查询结果
    select() {
      this.findPurchaseListParam.startDate = this.dataTime
        ? this.dataTime[0]
        : "";
      this.findPurchaseListParam.endDate = this.dataTime
        ? this.dataTime[1]
        : "";
      console.log(this.findPurchaseListParam, "000000000000");
      this.purchaseList();
    },
    //集采订单列表
    purchaseList() {
      purchaseList(this.findPurchaseListParam).then(res => {
        if (res.code == "000000") {
          console.log(res, "xxxx");
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.findPurchaseListParam.pageNum = res.data.pageNum;
          this.findPurchaseListParam.pageSize = res.data.pageSize;
        }
      });
    },
    //加載更多
    listMore() {
      this.findPurchaseListParam.pageSize += 10;
      this.findPurchaseListParam.startDate = this.dataTime
        ? this.dataTime[0]
        : "";
      this.findPurchaseListParam.endDate = this.dataTime
        ? this.dataTime[1]
        : "";
      this.purchaseList();
    },
    //导出
    purchaseExport() {
      this.ids = [];
      this.multipleSelection.forEach(item => {
        this.ids.push(item.purchaseOrderNo);
      });
      this.ids = Array.from(this.ids);
      this.findPurchaseListParam.startDate = this.dataTime
        ? this.dataTime[0]
        : "";
      this.findPurchaseListParam.endDate = this.dataTime
        ? this.dataTime[1]
        : "";
      console.log(this.findParam, this.ids, "888888888");
      purchaseExport(this.findPurchaseListParam)
        .then(res => {
          if (!res) {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.download(res);
          }
        })
        .catch(err => {
          this.$message.error("没有导出任何数据");
        });
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/xls" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "files.xls");
      document.body.appendChild(link);
      link.click();
    },
    //跳转详情页
    goDetail(row) {
      this.$router.push({
        name: "PurchaseCollectionOrderDetail",
        query: {
          id: row.id
        }
      });
    },
    goLibrary(row) {
      this.$router.push({
        name: "PurchaseBalancedLibrary",
        query: {
          id: row.id
        }
      });
    },
    selectChange(val) {
      this.multipleSelection = val;
      console.log(val, "898989898989898");
    },
    //生成采购单
    openWin(name, query) {
      let arr = [];
      arr = this.multipleSelection.map(item => {
        return item.id;
      });
      console.log(arr, "909090");
      query.ids = arr.join(",");
      console.log(query.ids);
      if (!arr.length) {
        this.$confirm("请先选择某个商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {})
          .catch(err => {});
      } else {
        this.$router.push({
          name: name,
          query: query
        });
      }
    }
  }
};
</script>

<style lang='less' scoped>
.demandBox {
  width: 100%;
  // .filterBox {
  //   border: 1px solid #e4e4e4;
  //   margin: 10px 0;
  //   .serchBoxTop {
  //     background: #f3f3f3;
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //     height: 50px;
  //     .topLeft {
  //       display: flex;
  //       span {
  //         padding: 0 5px 0 20px;
  //       }
  //     }
  //     .topRight {
  //       display: flex;
  //       align-items: center;
  //       &:last-child {
  //         margin-right: 20px;
  //       }
  //       .el-button {
  //         margin-left: 10px;
  //         i {
  //           padding-right: 5px;
  //         }
  //       }
  //     }
  //   }
  //   .serchBoxBottom {
  //     margin-top: 1px solid #e4e4e4;
  //     display: flex;
  //     flex-wrap: wrap;
  //     .inputBox {
  //       width: 40%;
  //       margin: 10px;
  //       display: flex;
  //       flex-wrap: nowrap;
  //       margin-left: 50px;
  //       .el-input {
  //         width: 200px;
  //       }
  //       .el-select {
  //         width: 200px;
  //       }
  //       span {
  //         display: flex;
  //         width: 100px;
  //         align-items: center;
  //         justify-content: center;
  //       }
  //     }
  //   }
  // }
  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
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
      margin: 10px 0 0 10px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 25%;
        display: flex;
        align-items: center;
        span {
          text-align: right;
          flex: 0 0 98px;
        }
      }
      .el-input {
        max-width: 200px;
        padding: 5px;
      }
      .el-select {
        max-width: 200px;
        padding: 5px;
      }
    }
  }
  .listBox {
    border: 1px solid #e4e4e4;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f3f3f3;
      height: 50px;
      .listLeft {
        i {
          padding: 0 5px 0 20px;
        }
      }
      .listRight {
        &:last-child {
          margin-right: 20px;
        }
      }
    }
    .more {
      display: flex;
      align-items: center;
      height: 60px;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        border-radius: 20px;
        margin: 10px 5px;
        background: #e4e4e4;
        cursor: pointer;
      }
    }
  }
}
</style>
