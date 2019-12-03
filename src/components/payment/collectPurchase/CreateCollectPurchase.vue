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
              <el-form-item label="伙伴：" prop="partnerId">
                <span slot="label">伙伴：</span>
                <el-select
                  v-model="findPurchaseListParam.partnerId"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder
                  :remote-method="getListName"
                  @change="getSupplierDetail"
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
               <el-form-item>
                <span slot="label">备注：</span>
                <el-input placeholder="请输入备注信息" v-model="findPurchaseListParam.memo" clearable></el-input>
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
            max-height="500"
            :ref="`multipleTable${i}`"
            @select-all="(selection)=>{
              handleSelectionChange(selection,i)   
            }"
            @select="(sel,row)=>{
            handleChange(sel,row,i)}"
            style="width: 100%"
            size="small"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="skuNo" label="商品编号" align="center" width="100"></el-table-column>
            <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center"></el-table-column>
            <el-table-column prop="purchaseQty" label="采购数量" align="center"></el-table-column>
            <el-table-column prop="settlementQty" label="可结算数量" align="center"></el-table-column>
            <el-table-column prop="receivedQty" label="已入库数量" align="center"></el-table-column>
            <!-- <el-table-column prop="invoiceQty" label="发票关联数量" align="center"></el-table-column> -->
            <el-table-column prop="currentQty" label="本次结算数量" align="center">
              <template slot-scope="scope">
                <el-input type="number" placeholder v-model="scope.row.currentQty" @input="(value)=>{
                  inputQty(value,scope.row.settlementQty,scope.row.invoiceQty,i,scope.$index)}"></el-input>                         
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
                <el-select v-model="scope.row.currentTaxRateText" placeholder="请选择">
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
    <!-- <orderTips ref="orderTips"></orderTips> -->
    <cancelData ref="cancelData" @close="closed"></cancelData>
    <purchaseListCreate ref="purchaseListCreate" @dialogcallback="dialogcallback"></purchaseListCreate>
  </div>
</template>
<script>
import store from "@/store/store";
import elDragDialog from "@/directive/el-dragDialog";
import cancelData from "./child/cancel_data";
// import orderTips from "../purchaseDemandManage/child/order_tips";
import purchaseListCreate from "./child/purchase_list_create";
import {
  findPurchaseListInfo,
  createCollectPurchaseList,
  findOrganization
} from "@/api/payment/paymentCollectPurchase";
import { setTimeout } from "timers";
import {Debounce} from '@/utils'
export default {
  inject: ["reload", "close"],
  name: "CreateCollectPurchase",
  data() {
    const checkUrgent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("伙伴名称不能为空"));
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
    return {
      rules: {
        partnerId: [
          { validator: checkUrgent, required: true, trigger: "blur" },
          { validator: checkUrgent, trigger: "change" }
        ],
        name: [
          { validator: checkGoods, required: true, trigger: "blur" },
          { validator: checkGoods, trigger: "change" }
        ], 
      },
      data: [], //列表数据
      listData: [],
      findPurchaseListParam: {
        memo: "", //备注
        name: "", //结算单名称
        partnerId: null, //伙伴id（组织机构id）
        partnerName: "", //伙伴名称（组织机构名称）
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
      purchaseArr: [],
      optionsRate: [
        { value: 0, label: 0 },
        { value: "3%", label: "3%" },
        { value: "5%", label: "5%" },
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
    // orderTips,
    purchaseListCreate
  },
  filters: {},
  created() {},
  mounted() {},
  methods: {
    closed() {
      this.close({name:"CreateCollectPurchase",to:{name:"CollectPurchaseManage",params:{isUpdate:true}}})
    },
    dialogcallback(name, arr) {
      if (name == "createPurchase") {
        arr.forEach(item => {
          this.purchaseArr.push(item);
          this.purchaseOrderItemParam.purchaseOrderId = this.purchaseArr;
        });
        findPurchaseListInfo(this.purchaseOrderItemParam).then(res => {
          if (res.code == "000000") {
            this.data = res.data;
            console.log(this.data, 111111);
            this.$nextTick(() => {
              this.data.forEach((item, index) => {
                item.purchaseOrderItemDTOList.forEach((gg, kk) => {
                  gg.currentQty = Number(gg.receivedQty);
                  gg.currentPrice = gg.purchasePrice;
                  gg.checked=true;
                  this.$refs["multipleTable" + index][0].toggleRowSelection(
                  gg,
                  gg.checked
                );
                });
              });
            });
          }
        });
      }
    },
    inputQty:Debounce(function(value,gg,kk,index,$index){
     console.log(value,gg,77)
     let reg=/^[+]{0,1}(\d+)$/g;
     if(reg.test(value)){
       if(value>gg){
      this.$message({
        message:'本次结算数量不能大于可结算数量',
        type:'error'
      })
    }
    else if(value<kk){
        this.$message({
        message:'本次结算数量不能小于关联发票数量',
        type:'error'
      })
     }
     }else{
       this.$nextTick(()=>{
        this.data[index].purchaseOrderItemDTOList[$index].currentQty=null
       })
        this.$message({
         message:'本次结算数量只能为正整数',
         type:'error'
       })
     }

    }),
    //点击行的多选按钮，改变当前行的checked的值
    handleChange(sel, row, i) {
      row.checked = !row.checked;
      debugger
    },
    getListName(query) {
      console.log(query);
      if (query !== "") {
        this.loading = true;
        let aa = { name: query };
        findOrganization(aa).then(res => {
          this.requirementOrganizations = res.data;
          this.loading = false;
          // this.findPurchaseListParam.purchaseOrderItemDTOList
          this.data=[];
        });
      } else {
        this.requirementOrganizations = [];
      }
    },
    getSupplierDetail(id) {
      if (id) {
        let aaa=JSON.parse(JSON.stringify(this.requirementOrganizations))
        aaa=aaa.filter((item)=>{
          return item.id==id;
        });
        this.data=[];
         if(aaa.length>0){
         this.findPurchaseListParam.partnerName = aaa[0].name; 
        }else{
          this.findPurchaseListParam.partnerName = '';
        }
      }
    },
    clearOrderList(value) {
      let id = this.data[value].id;
      if (this.purchaseArr.indexOf(id) >= -1) {
        this.purchaseArr.splice(id, 1);
      }
      this.data.splice(value, 1);
    },
    addOrderDemand(name) {
      if (this.findPurchaseListParam.partnerId) {
        //把选中的数据的id集合传过去
        this.purchaseArr = [];
        console.log(this.data, 77778888);
        this.data.forEach((item, i) => {
          this.purchaseArr.push(item.id);
        });
        this.$refs.purchaseListCreate.init(
          name,
          this.purchaseArr,
          this.findPurchaseListParam.partnerId
        );
      } else {
        this.$message({
          message: "请先添加伙伴信息",
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
           this.data.forEach((item, i) => {
            let ccc = [];
            ccc = item.purchaseOrderItemDTOList.filter((ii, jj) => {
              return ii.checked === true;
            });
            let aaa = [];
            aaa = ccc.map(tt => {
              return {
                currentPrice: tt.currentPrice,
                currentQty: Number(tt.currentQty),
                currentTaxRate: parseInt(tt.currentTaxRateText) / 100,
                purchaseOrderId: item.id,
                purchaseOrderItemId: tt.id,
                taxRate: parseInt(tt.taxText) / 100,
                settlementQty:Number(tt.settlementQty)
              };
            });
            console.log(aaa, 7777777);
            aaa.forEach(item => {
              this.findPurchaseListParam.purchaseBillOrderItemList.push(item);
            });
          });
          createCollectPurchaseList(this.findPurchaseListParam).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "生成结算单成功",
                type: "success"
              });
              // setTimeout(() => {
              //   this.close();
              // }, 1000);
              this.close({name:"CreateCollectPurchase",to:{name:"CollectPurchaseManage",params:{isUpdate:true}}})
            }
          }).catch(err => {
            this.findPurchaseListParam.purchaseBillOrderItemList=[];
          });
        }
      });
    },
    handleSelectionChange(selection, i) {
      console.log(this.data, i, this.data[i].purchaseBillOrderItemList, 4444,selection);
      if(selection.length>0){
				let selectionIds=selection.map(item=>item.id)
				console.log(this.data[i])
				this.data[i].purchaseOrderItemDTOList.map(item=>{
					if(selectionIds.includes(item.id)){
						item.checked=true
					}else{
						item.checked=false
					}
				})
			}else{
				this.data[i].purchaseOrderItemDTOList.map(item=>{
					item.checked=false
				})
      }
     
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
    margin: 20px 0 0 0;
    line-height: 50px;
    .listBoxTop {
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









