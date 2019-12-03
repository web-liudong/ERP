<template>
  <div class="brandBox">
    <div class="buttonBox">
      <div
        class="headerBox"
        style="height:50px;background-color:#f3f3f3;margin-top:20px; border: 1px solid #e4e4e4;font-size:14px;"
      >
        <i class="iconfont iconsousuo" style="margin-left:5px;"></i>
        <span style="line-height:50px;">基本信息</span>
      </div>
      <div class="borderBox" style="border:1px solid #e4e4e4">
        <el-form :model="findPurchaseListParam" ref="findPurchaseListParam" :rules="rules">
          <div class="serchBoxBottom" v-show="isShow">
            <div class="chunk">
              <el-form-item label="结算单名称：" prop="name">
                <span slot="label">结算单名称：</span>
                <el-input placeholder="请输入结算单名称" v-model="findPurchaseListParam.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="供应商：" prop="supplierId">
                <span slot="label">供应商：</span>
                <el-select
                  v-model="findPurchaseListParam.supplierId"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder
                  :remote-method="getListName"
                  @change="getSupplierDetail"
                  @clear="clearList"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in requirementOrganizations"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="chunk">
              <el-form-item label="供应商开户名：">
                <span slot="label">供应商开户名：</span>
                <!-- <el-input
              placeholder=""
              v-model="findPurchaseListParam.accountName"
              clearable
                ></el-input>-->
                <span>{{findPurchaseListParam.accountName}}</span>
              </el-form-item>
              <el-form-item label="供应商开户行：">
                <span slot="label">供应商开户行：</span>
                <span>{{findPurchaseListParam.bank}}</span>
              </el-form-item>
            </div>
            <div class="chunk">
              <el-form-item>
                <span slot="label">供应商开户账号：</span>
                <span>{{findPurchaseListParam.accountNo}}</span>
              </el-form-item>
              <el-form-item prop="paymentMode">
                <span slot="label">结款方式：</span>
                <el-radio
                  v-model="findPurchaseListParam.paymentMode"
                  label="PAY_IN_ADVANCE"
                  @change="changeRadio"
                >预付</el-radio>
                <el-radio
                  v-model="findPurchaseListParam.paymentMode"
                  label="NO_PAY_IN_ADVANCE"
                  @change="changeRadio"
                >非预付</el-radio>
              </el-form-item>
            </div>
            <div class="chunk">
              <el-form-item>
                <span slot="label">备注：</span>
                <el-input placeholder="请输入备注信息" v-model="findPurchaseListParam.memo" clearable></el-input>
              </el-form-item>
              <el-form-item
                :prop="findPurchaseListParam.paymentMode=='NO_PAY_IN_ADVANCE'?'prepaidAmount1':'prepaidAmount'"
                v-if="findPurchaseListParam.paymentMode=='PAY_IN_ADVANCE'"
              >
                <span slot="label">预付金额：</span>
                <el-input
                  placeholder
                  :disabled="findPurchaseListParam.paymentMode=='NO_PAY_IN_ADVANCE'"
                  v-model="findPurchaseListParam.prepaidAmount"
                  @input="findPurchaseListParam.prepaidAmount=findPurchaseListParam.prepaidAmount.replace(/[^\d.]/g,'')"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>数据列表
        </span>
        <div class="listBoxRight">
          <div
            class="white-btn fun-btn"
            @click="addOrderDemand('createPurchase')"
            style="width:120px"
          >
            <i class="iconfont icon-icon-test"></i>添加
          </div>
        </div>
        <div class="listBoxCenter" v-for="(item,i) in data" :key="i">
          <span>
            <i class="iconfont iconsousuo"></i>数据列表
          </span>
          <span>采购单编号：{{item.purchaseOrderNo}}</span>
          <span>采购单总金额：{{item.amount}}</span>
          <span>是否含税：{{item.includeTaxText}}</span>
          <span>配送方式：{{item.deliveryTypeText}}</span>
          <div class="listBoxRight">
            <div class="white-btn fun-btn" @click="clearOrderList(i)">
              <i class="iconfont icon-icon-test"></i>移除
            </div>
          </div>
          <el-table
            :data="item.purchaseOrderItemDTOList"
            border
            max-height="450"
            ref="multipleTable"
            @select-all="(selection)=>{
              handleSelectionChange(selection,i)   
            }"
            @select="(sel,row)=>{
            handleChange(sel,row,i)}"
            style="width: 100%"
            size="small"
          >
            <el-table-column type="selection" :selectable="disSelectable"></el-table-column>
            <el-table-column prop="skuNo" label="商品编号" align="center" width="100"></el-table-column>
            <el-table-column prop="skuName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center"></el-table-column>
            <el-table-column prop="purchaseQty" label="采购数量" align="center"></el-table-column>
            <el-table-column prop="settlementQty" label="可结算数量" align="center"></el-table-column>
            <el-table-column prop="receivedQty" label="已入库数量" align="center"></el-table-column>
            <!-- <el-table-column prop="invoiceQty" label="发票关联数量" align="center"></el-table-column> -->
            <el-table-column prop="currentQty" label="本次结算数量" align="center">
              <template slot-scope="scope">
                <el-input
                  type="number"
                  placeholder
                  v-model="scope.row.currentQty"
                  @input="(value)=>{
                  inputQty(value,scope.row.settlementQty,scope.row.invoiceQty,i,scope.$index)}"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="currentPrice" label="本次结算单价" align="center">
              <template slot-scope="scope">
                <el-input placeholder v-model="scope.row.currentPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="taxText" label="税率" align="center"></el-table-column>
            <el-table-column prop="currentTaxRateText" label="本次结算税率" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.currentTaxRateText"  placeholder="请选择">
                  <el-option
                    v-for="item in optionsRate"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="taxDifferential" label="税差" align="center">
              <template slot-scope="scope">
                <span>{{(parseInt(scope.row.currentTaxRateText)/100*scope.row.currentPrice-scope.row.currentPrice*parseInt(scope.row.taxText)/100).toFixed(4)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="小计" align="center">
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.amount"></el-input> -->
                <span>{{(scope.row.currentQty*scope.row.currentPrice).toFixed(2)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="blockButtonBox">
      <el-button class="active" @click="submit('findPurchaseListParam')">生成结算单</el-button>
      <el-button class="active" @click="cancelData('PurchaseCreateBillList')">取消</el-button>
    </div>
    <orderTips ref="orderTips"></orderTips>
    <cancelData ref="cancelData" @close="closed()"></cancelData>
    <purchaseListCreate ref="purchaseListCreate" @dialogcallback="dialogcallback"></purchaseListCreate>
  </div>
</template>
<script>
import store from "@/store/store";
import elDragDialog from "@/directive/el-dragDialog";
import cancelData from "../purchaseDemandManage/child/cancel_data";
import orderTips from "../purchaseDemandManage/child/order_tips";
import purchaseListCreate from "./child/purchase_list_create";
import {
  findPurchaseDetailList,
  createBillList,
  findSupplierPurchase,
  findSupplierName,
  findSupplierByOrganizationId,
  findSupplierDeatail
} from "@/api/purchase/purchaseBillList.js";
import { setTimeout } from "timers";
import { Debounce } from "@/utils";
export default {
  inject: ["reload", "close"],
  name: "PurchaseCreateBillList",
  data() {
    const checkUrgent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("供应商不能为空"));
      } else {
        callback();
      }
    };
    const checkDemandQuantity = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("结款方式不能为空"));
      } else {
        callback();
      }
    };
    const checkGoods = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("结算单名称不能为空"));
      } else {
        callback();
      }
    };
    const checkWarehouse = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("预付金额不能为空"));
      } 
      if(value < 0){
        callback(new Error("预付金额不能为负数"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        supplierId: [
          { validator: checkUrgent, required: true, trigger: "blur" },
          { validator: checkUrgent, trigger: "change" }
        ],
        name: [
          { validator: checkGoods, required: true, trigger: "blur" },
          { validator: checkGoods, trigger: "change" }
        ],
        paymentMode: [
          {
            validator: checkDemandQuantity,
            required: true,
            trigger: "blur",
            trigger: "change"
          }
        ],
        prepaidAmount: [
          { validator: checkWarehouse, required: true, trigger: "blur" }
        ],
        prepaidAmount1: [{ trigger: "blur" }]
      },
      formInline: {
        user: "",
        region: ""
      },
      data: [], //列表数据
      listData: [],
      findPurchaseListParam: {
        accountName: "", //开户行名称
        accountNo: "", //开户行账号
        bank: "", //开户行
        memo: "", //备注
        name: "", //结算单名称
        paymentMode: "", //结款方式
        prepaidAmount: null, //预付金额
        supplierId: null, //供应商id
        supplierName: "", //供应商名称
        purchaseBillOrderItemList: [] //结算单列表
      },
      organizationId: null, //当前用户的组织机构id
      purchaseOrderItemParam: {
        purchaseBillId: null, //结算单id
        purchaseOrderId: [] //采购单id集合
      },
      requirementOrganizations: [],
      loading: false,
      isShow: true,
      optionsWarehouse: null,
      //机构名称
      options: [],
      purchaseArr: [],
      optionsRate: [
        { value: 0, label: 0 },
        { value: "3%", label: "3%" },
        { value: "5%", label: "5%" },
        { value: "6%", label: "6%" },
        { value: "9%", label: "9%" },
        { value: "10%", label: "10%" },
        { value: "13%", label: "13%" },
        { value: "16%", label: "16%" }
      ],
      paginations: {
        total: 100 //总数
      }
    };
  },
  directives: {
    elDragDialog
  },
  components: {
    cancelData,
    orderTips,
    purchaseListCreate
  },
  filters: {},
  created() {},
  mounted() {},
  methods: {
    disSelectable(row, index) {
      if (row.settlementQty > 0) {
        return true;
      } else {
        return false;
      }
    },
    closed(){
     this.close({name:'PurchaseCreateBillList',to:{name:"PurchaseManage",params:{isUpdate:true}}})
    },
    dialogcallback(name, arr) {
      if (name == "createPurchase") {
        arr.forEach(item => {
          this.purchaseArr.push(item);
          this.purchaseOrderItemParam.purchaseOrderId = this.purchaseArr;
          console.log(this.purchaseOrderItemParam.purchaseOrderId, 66667777);
        });
        findPurchaseDetailList(this.purchaseOrderItemParam).then(res => {
          if (res.code == "000000") {
            this.data = res.data;
            console.log(this.data, 111111);
            this.$nextTick(() => {
              this.data.forEach((item, index) => {
                item.purchaseOrderItemDTOList.forEach((gg, kk) => {
                  gg.currentQty = gg.receivedQty;
                  gg.currentPrice = gg.purchasePrice;
                  // gg.taxDifferential=(gg.currentTaxRateText*gg.currentPrice-gg.taxText*gg.currentPrice).toFixed(4);
                });
              });
            });
          }
        });
      }
    },
    inputQty: Debounce(function(value, gg, kk, index, $index) {
      console.log(value, gg, 77);
      //  value= value.replace(/[^\d]/g,'')
      let reg = /^[+]{0,1}(\d+)$/g;
      if (reg.test(value)) {
        if (value > gg) {
          this.$message({
            message: "本次结算数量不能大于可结算数量",
            type: "error"
          });
        } else if (value < kk) {
          this.$message({
            message: "本次结算数量不能小于关联发票数量",
            type: "error"
          });
        }
      } else {
        this.$nextTick(() => {
          this.data[index].purchaseOrderItemDTOList[$index].currentQty = "";
        });
        this.$message({
          message: "本次结算数量只能为正整数",
          type: "error"
        });
      }
    }),
    changeRadio(value) {
      console.log(value);
      if (value == "NO_PAY_IN_ADVANCE") {
        this.$refs["findPurchaseListParam"].clearValidate("prepaidAmount1");
        this.findPurchaseListParam.prepaidAmount = "";
      }
      this.$refs["findPurchaseListParam"].clearValidate("paymentMode");
    },
    //点击行的多选按钮，改变当前行的checked的值
    handleChange(sel, row, i) {
      //  	console.log(sel)
      row.checked = !row.checked
    },
    getListName(query) {
      console.log(query);
      if (query !== "") {
        this.loading = true;
        let str = window.localStorage.getItem("UserInfo");
        let userPosts = JSON.parse(str).userPosts;
        this.organizationId = userPosts[0].organizationId;
        let aa = { name: query };
        findSupplierByOrganizationId(this.organizationId, aa).then(res => {
          this.requirementOrganizations = res.data;
          this.loading = false;
          this.data=[];
        });
      } else {
        this.requirementOrganizations = [];
      }
    },
    clearList(){
     this.data=[];     
    },
    getSupplierDetail(id) {
      if (id) {
        let aaa=JSON.parse(JSON.stringify(this.requirementOrganizations))
        let bbb=aaa.filter((item)=>{
          return item.id === id;
        })
        this.data=[]; 
        if(bbb.length>0){
        this.findPurchaseListParam.bank = bbb[0].bank;
        this.findPurchaseListParam.accountName = bbb[0].accountName;
        this.findPurchaseListParam.accountNo = bbb[0].accountNo;
        this.findPurchaseListParam.supplierName = bbb[0].name; 
        // if(this.findPurchaseListParam.accountNo == null,this.findPurchaseListParam.supplierName == null || this.findPurchaseListParam.accountName == null) {
        //   this.$message({
        //     message: '供应商开户不能为空',
        //     type: 'error'
        //   })
        // }
      }
      
      } else {
        this.findPurchaseListParam.bank = "";
        this.findPurchaseListParam.accountName = "";
        this.findPurchaseListParam.accountNo = "";
        this.findPurchaseListParam.supplierName = "";
      }
    },
    clearOrderList(value) {
      console.log(value, 6666, this.data);
      console.log(this.data[value], 7777);
      let id = this.data[value].id;
      if (this.purchaseArr.indexOf(id) >= -1) {
        this.purchaseArr.splice(id, 1);
        console.log(this.purchaseArr, 99988888);
      }
      this.data.splice(value, 1);
      //  value--;
    },
    addOrderDemand(name) {
      if (this.findPurchaseListParam.supplierId) {
        //把选中的数据的id集合传过去
        this.purchaseArr = [];
        console.log(this.data, 77778888);
        this.data.forEach((item, i) => {
          // console.log(item.purchaseOrderItemDTOList.every(ii=>ii.checked==true,'haha'))
          // if(item.purchaseOrderItemDTOList.every(ii=>ii.checked==true)){
          //         arr.push(item.id)
          //       }
          this.purchaseArr.push(item.id);
        });
        this.$refs.purchaseListCreate.init(
          name,
          this.purchaseArr,
          this.findPurchaseListParam.supplierId
        );
      } else {
        this.$message({
          message: "请先添加供应商信息",
          type: "error"
        });
      }
    },
    cancelData(type) {
      this.$refs.cancelData.init(type);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.findPurchaseListParam.paymentMode == "PAY_IN_ADVANCE") {
            let sum = 0;
            let num = 0;
            console.log(this.data,'77');
            this.data.forEach(item => {
              console.log(item,'88');
              console.log(item.purchaseOrderItemDTOList,'00');
              item.purchaseOrderItemDTOList.forEach(kk => {
                console.log(kk,'99');
                if (kk.checked) {
                  num ++;
                  sum += kk.currentQty*kk.currentPrice;
                }
              });
            });
            if (num == 0) {
              this.$message({
                message: "请勾选商品明细",
                type: "warning"
              })
            } else if (Number(sum.toFixed(2)) < Number(this.findPurchaseListParam.prepaidAmount)) {
              this.$message({
                message: "预付金额大于选中商品的小计总和，请修改预付金额",
                type: "error"
              });
            } else {
              var checkedArr = [];
              this.data.map(item => {
                item.purchaseOrderItemDTOList.map(tt => {   
                  if (tt.checked) {
                    checkedArr.push({
                      currentPrice: tt.currentPrice,
                      currentQty: tt.currentQty,
                      currentTaxRate: parseInt(tt.currentTaxRateText) / 100,
                      purchaseOrderId: item.id,
                      purchaseOrderItemId: tt.id,
                      taxRate: parseInt(tt.taxText) / 100,
                      settlementQty: Number(tt.settlementQty)
                    });
                  }
                });
              });
              this.findPurchaseListParam.purchaseBillOrderItemList = checkedArr;
              console.log(this.findPurchaseListParam, 888899999999);
              // debugger
              createBillList(this.findPurchaseListParam).then(res => {
                if (res.code == "000000") {
                  this.$message({
                    message: "生成结算单成功",
                    type: "success"
                  });
                  setTimeout(() => {
                    this.close({name:'PurchaseCreateBillList',to:{name:"PurchaseManage",params:{isUpdate:true}}})
                  }, 1000);
                }
              });
            }
          } else {
            var checkedArr = [];
            this.data.map(item => {
              item.purchaseOrderItemDTOList.map(tt => {
                if (tt.checked) {
                  checkedArr.push({
                    currentPrice: tt.currentPrice,
                    currentQty: tt.currentQty,
                    currentTaxRate: parseInt(tt.currentTaxRateText) / 100,
                    purchaseOrderId: item.id,
                    purchaseOrderItemId: tt.id,
                    taxRate: parseInt(tt.taxText) / 100,
                    settlementQty: Number(tt.settlementQty)
                  });
                }
              });
            });
            this.findPurchaseListParam.purchaseBillOrderItemList = checkedArr;
            console.log(this.findPurchaseListParam, 888899999999);
            // debugger
            createBillList(this.findPurchaseListParam).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "生成结算单成功",
                  type: "success"
                });
                setTimeout(() => {
                  this.close({name:'PurchaseCreateBillList',to:{name:"PurchaseManage",params:{isUpdate:true}}})
                }, 1000);
              }
            });
          }
        }
      });
    },
    handleSelectionChange(selection, i) {
      if (selection.length > 0) {
        let selectionIds = selection.map(item => item.id);
        console.log(this.data[i]);
        this.data[i].purchaseOrderItemDTOList.map(item => {
          if (selectionIds.includes(item.id)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      } else {
        this.data[i].purchaseOrderItemDTOList.map(item => {
          item.checked = false;
        });
      }
      //			console.log(this.data, 'asdasd');
      //    console.log(this.data, i, this.data[i].purchaseBillOrderItemList, 4444,selection);
      //  this.data[i].purchaseOrderItemDTOList.forEach((item,index)=>{
      //       selection.forEach((ii,jj)=>{
      //         if(item.id==ii.id){
      //           item.checked=true;
      //         }
      //       })
      //  })
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  clear: both;
  .borderBox {
    .serchBoxBottom {
      margin-top: 1px solid #e4e4e4;
      margin-left: 10%;
      margin-top: 10px;
      .chunk {
        display: flex;
        flex: 1;
        .el-form-item {
          //  flex: 1;
          display: flex;
          flex: 1;
          //  flex-direction: row;
          .el-input {
            width: 200px;
          }
          .el-select {
            width: 200px;
          }
        }
      }
    }
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
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      span {
        width: 100px;
        display: inline-block;
      }
      margin-top: -2px;
      .el-input {
        width: 140px;
        height: 40px;
        margin-top: 10px;
      }
      .el-select {
        margin-top: 10px;
        width: 140px;
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
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .white-btn {
          margin-top: 10px;
          margin-right: 10px;
        }
      }
      .listBoxCenter {
        border-top: 1px solid #e4e4e4;
        .listBoxRight {
          float: right;
          margin-right: 10px;
          .white-btn {
            margin-top: 10px;
            margin-right: 10px;
          }
        }
      }
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
      .activestyle {
        color: red;
      }
    }
    .el-table .activestyle {
      background-color: red;
    }
  }
  .blockButtonBox {
    .el-button {
      width: 160px;
      height: 40px;
    }
    .active {
      background: #339999;
      color: #fff;
    }
    margin: 20px auto;
    text-align: center;
  }
}
</style>

<style lang="less" scoped>
.brandBox {
  .el-dialog__header {
    padding: 10px;
    padding-bottom: 0;
    background: #e4e4e4;
    height: 40px;
    line-height: 40px;
  }
}
</style>









