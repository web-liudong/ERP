<template>
  <div class="demandBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            {{isShow?'收起筛选':'展开筛选'}}
            
          </span>
          <div class="white-btn fun-btn" @click="readData">
            <i class="iconfont iconduqushuju"></i>读取数据
          </div>
          <div class="white-btn fun-btn" @click="select">查询结果</div>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="centerBox">
            <div class="inputBox">
              <span>商品名称：</span>
              <el-select
                v-model="findParam.skuName"
                filterable
                remote
                clearable
                placeholder="请输入商品名称"
                :remote-method="(query) => {
                  querySearch(query,'goodsName','searchskuNames')
                }"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="item in searchskuNames"
                  :key="item.value"
                  :lable="item.skuName"
                  :value="item.skuName"
                ></el-option>
              </el-select>
            </div>
            <div class="inputBox">
              <span>发货单号：</span>
              <el-input placeholder="请输入发货单号" v-model="findParam.orderNo" clearable></el-input>
            </div>
            <div class="inputBox">
              <span>需求日期：</span>
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
          <div class="centerBox">
            <div class="inputBox">
              <span>客户名称：</span>
              <el-select
                v-model="findParam.customerId"
                filterable
                remote
                clearable
                placeholder="请选择/输入客户名称"
                :remote-method="(query) => {
                  querySearch(query,'customerName','searchCustomers')
                }"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="item in searchCustomers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="inputBox">
              <span>仓库名称：</span>
              <el-select
                v-model="findParam.warehouseId"
                filterable
                remote
                clearable
                placeholder="请选择/输入仓库名称"
                :remote-method="(query) => {
                  querySearch(query,'warehousesName','searchWarehouses')
                }"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="item in searchWarehouses"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="inputBox">
              <span>紧急程度：</span>
              <el-select v-model="findParam.urgentLevel" clearable>
                <el-option label="全部" value></el-option>
                <el-option label="不紧急" value="0"></el-option>
                <el-option label="紧急" value="1"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft"></div>
        <div class="listRight">
          <el-button size="small" @click="createPurchase()">
            <i class="iconfont iconcaigoudan"></i>
            <span>生成采购草稿单</span>
          </el-button>
          <el-button
            size="small"
            @click="openWin('CreatPurchaseOrder',{'ids':ids,ids1:ids1,ids2:ids2})"
            v-if="$authorities.PurchaseOrderCreate"
          >
            <i class="iconfont iconcaigoudan"></i>
            <span>生成采购单</span>
          </el-button>
          <el-button
            size="small"
            @click="purchaseExport()"
            v-if="$authorities.PurchaseDemandExport"
          >
            <i class="iconfont icondaochu"></i>
            <span>导出</span>
          </el-button>
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表-入仓需求
        </div>
        <div class="listRight">
          <el-button
            size="small"
            @click="openWin('CreatePurchaseDemand')"
            v-if="$authorities.PurchaseDemandCreate"
          >
            <i class="iconfont icontianjiashangpin"></i>
            <span>添加</span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="tableStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sum" label="需求数量" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="openBox(scope.row)"
                v-if="scope.row.orderType !== null"
              >{{scope.row.sum}}</el-button>
              <span v-if="scope.row.orderType == null">{{scope.row.sum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="计量单位" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="oepnWin('EditerPurchaseDemand',scope.row)"
              >编辑</el-button>
              <el-button type="text" size="small" @click="closeState(scope.row,0)">释放</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row,0)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisible" width="30%">
        <span>释放后，商品的需求明细将暂时移除，确定操作？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="isClose(0)">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="商品关联发货单号" :visible.sync="openBoxs" width="30%">
        <el-table
          :data="goodsNumber"
          border
          style="width: 100%"
          :header-cell-style="tableStyle"
          height="200"
        >
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="orderNo" label="发货单号" align="center">
            <template slot-scope="scope">
              <el-button
                @click="oepnWin('InvoiceDetail',{ id: scope.row.orderDeliveryId })"
                v-if="scope.row.orderType == 0"
                type="text"
                size="small"
              >{{scope.row.orderNo}}</el-button>
              <el-button
                @click="oepnWin('PurchaseCollectionOrderDetail',{id: scope.row.centralPurchaseOrderId})"
                v-if="scope.row.orderType == 1"
                type="text"
                size="small"
              >{{scope.row.orderNo}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="requirementQty" label="需求数量" align="center"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openBoxs = false">取 消</el-button>
        </span>
      </el-dialog>
      <div class="more" @click="listMore(0)" v-if="this.total>this.findParam.pageSize">
        <p>加载更多......</p>
      </div>
    </div>
    <!-- <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表-厂直需求
        </div>
        <div class="listRight"></div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="FactoryDirectData"
          border
          style="width: 100%"
          :header-cell-style="tableStyle"
          @selection-change="FactoryDirecthandleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column type="orderType" label="是否集采" width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.orderType===1?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sum" label="需求数量" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="openBox(scope.row)"
                v-if="scope.row.orderType !== null"
              >{{scope.row.sum}}</el-button>
              <span v-if="scope.row.orderType == null">{{scope.row.sum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="计量单位" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="closeState(scope.row,1)">释放</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row,1)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogVisibleFactoryDirect" width="30%">
        <span>释放后，商品的需求明细将暂时移除，确定操作？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleFactoryDirect = false">取 消</el-button>
          <el-button type="primary" @click="isClose(1)">确 定</el-button>
        </span>
      </el-dialog>
      <div
        class="more"
        @click="listMore(1)"
        v-if="this.FactoryDirectTotal>this.findParamFac.pageSize"
      >
        <p>加载更多......</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import {
  readData,
  listMore,
  selectProduct,
  selectCustomer,
  selectWarehose,
  putSkuId,
  purchaseRequirementExport,
  invoiceNum
} from "@/api/purchase/purchaseDemand";
import { createPurchaseDraft } from "@/api/purchase/purchase.js";
import EditerPurchaseDemandVue from "../purchaseDemandManage/EditerPurchaseDemand.vue";

export default {
  inject: ["reload", "isFilterShow",'close'],
  name: "PurchaseDemand",
  data() {
    return {
      //表头样式
      tableStyle: {
        background: "#f5f7fa"
      },
      remoteLoading: false,
      multipleSelection: [], //选中商品的集合
      FactoryDirectmultipleSelection: [], //选中商品的集合
      dialogVisible: false,
      openBoxs: false,
      dialogVisibleFactoryDirect: false, //厂直释放弹框
      isShow: this.isFilterShow,
      ids: [],
      ids1: [],
      FactoryDirectData: null, //厂直列表数据
      FactoryDirectTotal: null, //厂直列表总数
      findParam: {
        customerId: null, //客户id
        customerName: "", //客户名称
        endTime: "", //需求日期结束时间
        orderNo: "", //订单号
        pageNum: 1,
        pageSize: 10, //每页条数
        skuName: "", //商品名称
        startTime: "", //需求日期开始时间
        urgentLevel: "", //紧急程度（0,1,2,3）
        warehouseId: null, //仓库id
        warehouseName: "", //仓库名称,
        inStoreType: null //入仓类型
      },
      findParamFac: {
        customerId: null, //客户id
        customerName: "", //客户名称
        endTime: "", //需求日期结束时间
        orderNo: "", //订单号
        pageNum: 1,
        pageSize: 10, //每页条数
        skuName: "", //商品名称
        startTime: "", //需求日期开始时间
        urgentLevel: "", //紧急程度（0,1,2,3）
        warehouseId: null, //仓库id
        warehouseName: "", //仓库名称,
        inStoreType: null //入仓类型
      },
      pageSize: null, //厂直的每页条数
      pageNum: 1, //厂直
      total: "",
      //模糊查詢
      searchskuNames: [],
      dataTime: "",
      searchWarehouses: [],
      searchCustomers: [],
      tableData: [],
      goodsNumber: []
    };
  },
  created() {
  //  this.select()
  },
  computed: {
    // dataListHeight(){
    //   return this.$store.getters.dataListHeight;
    // }
  },
  methods: {
    purchaseExport() {
      let Warehousing = [],
        Factory = [];
      Warehousing = this.multipleSelection.map(item => {
        return item.skuId;
      });
      Factory = this.FactoryDirectmultipleSelection.map(item => {
        return item.skuId;
      });
      this.ids = [...Warehousing, ...Factory];
      this.findParam.startTime = this.dataTime ? this.dataTime[0] : "";
      this.findParam.endTime = this.dataTime ? this.dataTime[1] : "";
      purchaseRequirementExport({
        customerId: this.findParam.customerId,
        customerName: this.findParam.customerName,
        endTime: this.findParam.endTime,
        orderNo: this.findParam.orderNo,
        pageNum: this.findParam.pageNum,
        pageSize: this.findParam.pageSize,
        skuIds: this.ids,
        skuName: this.findParam.skuName,
        startTime: this.findParam.startTime,
        urgentLevel: this.findParam.urgentLevel,
        warehouseId: this.findParam.warehouseId,
        warehouseName: this.findParam.warehouseName
      })
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
    //查询结果
    select() {
      this.findParam.startTime = this.dataTime ? this.dataTime[0] : "";
      this.findParam.endTime = this.dataTime ? this.dataTime[1] : "";
      this.findParam.inStoreType = 0;
      listMore(this.findParam)
        .then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
          }
        })
        .then(res => {
          this.findParam.inStoreType = 1;
          listMore(this.findParam).then(res => {
            if (res.code == "000000") {
              this.FactoryDirectData = res.data.items;
            }
          });
        });
    },
    //读取数据
    readData() {
      this.dataTime = "";
      this.findParam.orderNo = "";
      this.findParam.skuName = "";
      readData(0)
        .then(res => {
          if (res.code === "000000") {
            this.tableData = res.data.items;
            console.log(this.tableData,888);
            this.total = res.data.total;
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
          }
        })
        .then(res => {
          readData(1).then(res => {
            if (res.code == "000000") {
              this.FactoryDirectData = res.data.items;
              console.log(this.FactoryDirectData,888);
              this.FactoryDirectTotal = res.data.total;
              this.findParamFac.pageNum = res.data.pageNum;
              this.findParamFac.pageSize = res.data.pageSize;
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //加载更多
    listMore(value) {
      if (value == 0) {
        this.findParam.pageSize += 10;
      } else if (value == 1) {
        this.findParamFac.pageSize += 10;
      }
      this.findParam.startTime = this.dataTime ? this.dataTime[0] : "";
      this.findParam.endTime = this.dataTime ? this.dataTime[1] : "";
      console.log(this.findParam, "0000");
      this.findParam.inStoreType = value;
      this.findParamFac.inStoreType = value;
      if (value) {
        listMore(this.findParamFac)
          .then(res => {
            if (res.code == "000000") {
              this.FactoryDirectData = res.data.items;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        listMore(this.findParam)
          .then(res => {
            if (res.code == "000000") {
              this.tableData = res.data.items;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "goodsName") {
          selectProduct({ name: query }).then(res => {
            this.searchskuNames = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "customerName") {
          selectCustomer({ name: query }).then(res => {
            this.searchCustomers = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "warehousesName") {
          selectWarehose({ name: query }).then(res => {
            this.searchWarehouses = res.data;
            this.remoteLoading = false;
          });
        } else {
          this[list] = [];
          this.remoteLoading = false;
        }
      } else {
        this[list] = [];
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    FactoryDirecthandleSelectionChange(val) {
      this.FactoryDirectmultipleSelection = val;
    },
    //跳转详情页
    goDetail(row, value) {
      this.$router.push({
        name: "PurchaseDemandDetail",
        query: {
          num: row.num,
          skuId: row.skuId,
          skuName: row.skuName,
          skuNo: row.skuNo,
          sum: row.sum,
          unit: row.unit,
          inStoreType: value,
          inStoreTypeName: row.inStoreTypeName,
          orderType: row.orderType,
          orderTypeName: row.orderTypeName,
          orderNo: row.orderNo
        }
      });
    },
    createPurchase() {
      let str = [];
      str = [
        ...this.multipleSelection,
        ...this.FactoryDirectmultipleSelection
      ].map(item => {
        return {
          id: item.skuId,
          type: (
            item.inStoreType == 0
              ? "ARRIVAL"
              : item.inStoreType == 1
              ? "FACTORY_STRAIGHT"
              : ""),
          orderType:(item.inStoreType==1&&item.orderType===1)?'CENTRALIZED_PURCHASE_ORDER':item.inStoreType==0?'':'SALES_ORDER'    
        };
      });
      if(!str.length){
        this.$confirm("请先选择某个商品", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(res => {})
            .catch(() => {});
      }else{
       createPurchaseDraft({ idList: str }).then(res => {
        if (res.code == "000000") {
          let ids=res.data.purchaseOrderIds.join(',');
          this.$confirm(
            `新草稿单编号:${ids},是否去列表页查看`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).then(res=>{
           this.close({name:"PurchaseDemand",to:{name:'PurchaseOrder',query:{active:-2},params:{isUpdate:true}}})
          }).catch(()=>{
            this.select();
          });
        }
      });
      }
    },
    //生成采购单
    openWin(name, query) {
      // if(name=='PurchaseDraftEditing'){
      //   this.$router.push({
      //     name:'PurchaseDraftEditing',
      //     query:query
      //   })
      // }
      if (name == "CreatePurchaseDemand") {
        this.$router.push({
          name: "CreatePurchaseDemand"
        });
      }
      if (name == "CreatPurchaseOrder") {
        let arr = [];
        arr = this.multipleSelection.map(item => {
          return item.skuId;
        });
        let arrFactory = [];
        arrFactory = this.FactoryDirectmultipleSelection.filter(item => {
          return !item.orderType;
        }).map((item)=>{
          return item.skuId;
        });
        let jcType=[];
        jcType=this.FactoryDirectmultipleSelection.filter(item=>{
          return item.orderType===1 
        }).map((item)=>{
          return item.skuId
        });
        query.ids = arr.join(",");
        query.ids1 = arrFactory.join(",");
        query.ids2 = jcType.join(",");
        if (!arr.length && !this.FactoryDirectmultipleSelection.length) {
          this.$confirm("请先选择某个商品", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(res => {})
            .catch(() => {});
        } else {
          this.$router.push({ name: name, query: query });
        }
      }
    },
    openBox(query) {
      this.openBoxs = true;
      invoiceNum(query.inStoreType, query.skuId, query.orderType).then(res => {
        this.goodsNumber = res.data;
      });
    },
    oepnWin(name, query) {
      if (name == "PurchaseCollectionOrderDetail" || name == "InvoiceDetail") {
        this.openBoxs = false;
      }
      this.$router.push({
        name: name,
        query: query
      });
    },
    //释放调用弹框
    closeState(row, val) {
      if (val == 0) {
        this.dialogVisible = true;
      } else if (val == 1) {
        this.dialogVisibleFactoryDirect = true;
      }
      this.skuId = row.skuId;
    },
    isClose(value) {
      this.findParam.inStoreType = value;
      this.$nextTick(() => {
        if (value) {
          this.FactoryDirectData = this.FactoryDirectData.filter(item => {
            return item.skuId != this.skuId;
          });
        } else {
          this.tableData = this.tableData.filter(item => {
            return item.skuId != this.skuId;
          });
        }
        this.dialogVisible = false;
        this.dialogVisibleFactoryDirect = false;
      });
    }
  }
};
</script>

<style lang='less' scoped>
.demandBox {
  padding-bottom: 20px;
  width: 100%;
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
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      // display: flex;
      // flex-wrap: wrap;
      .centerBox {
        display: flex;
        justify-content: space-around;
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
