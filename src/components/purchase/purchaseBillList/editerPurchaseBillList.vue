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
          <div class="serchBoxBottom">
            <div class="chunk">
              <el-form-item label="结算单编号：">
                <!-- <span slot="label">结算单编号：</span> -->
                <span>{{findPurchaseListParam.billNo}}</span>
              </el-form-item>
              <el-form-item label="创建日期：">
                <!-- <span slot="label">创建日期：</span> -->
                <span>{{findPurchaseListParam.createTime}}</span>
              </el-form-item>
              <el-form-item label="结算单名称：">
                <!-- <span slot="label">结算单名称：</span> -->
                <span>{{findPurchaseListParam.name}}</span>
              </el-form-item>
            </div>
            <div class="chunk">
              <el-form-item label="总金额：">
                <span slot="label">总金额：</span>
                <span>￥{{findPurchaseListParam.amount}}</span>
              </el-form-item>
              <el-form-item label="供应商：">
                <span slot="label">供应商：</span>
                <span>{{findPurchaseListParam.supplierName}}</span>
              </el-form-item>
              <el-form-item prop="paymentMode">
                <span slot="label">付款类型：</span>
                <el-radio
                  v-model="findPurchaseListParam.paymentMode"
                  label="PAY_IN_ADVANCE"
                  disabled
                >预付</el-radio>
                <el-radio
                  v-model="findPurchaseListParam.paymentMode"
                  label="NO_PAY_IN_ADVANCE"
                  disabled
                >非预付</el-radio>
              </el-form-item>
            </div>
            <div class="chunk">
              <el-form-item>
                <span slot="label">结算单状态：</span>
                <span>{{findPurchaseListParam.statusText}}</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">供应商开户行：</span>
                <span>{{findPurchaseListParam.bank}}</span>
              </el-form-item>
              <el-form-item
                :prop="findPurchaseListParam.paymentMode=='NO_PAY_IN_ADVANCE'?'':'prepaidAmount'"
              >
                <span slot="label" v-if="findPurchaseListParam.paymentMode=='PAY_IN_ADVANCE'">预付金额：</span>
                <el-input
                  placeholder
                  :disabled="findPurchaseListParam.paymentMode=='NO_PAY_IN_ADVANCE'"
                  v-model="findPurchaseListParam.prepaidAmount"
                  @input="inputPrepaidAmount"
                  clearable
                  v-if="findPurchaseListParam.paymentMode=='PAY_IN_ADVANCE'"
                ></el-input>
              </el-form-item>
            </div>
            <div class="chunk">
              <el-form-item label="供应商开户名：" prop="supplierId">
                <span slot="label">供应商开户名：</span>
                <el-select
                  v-model="findPurchaseListParam.accountName"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder
                  :remote-method="getListName"
                  :loading="loading"
                  disabled
                >
                  <el-option
                    v-for="item in requirementOrganizations"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <span slot="label">开户行账号：</span>
                <span>{{findPurchaseListParam.accountNo}}</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">预付比例：</span>
                <span>{{findPurchaseListParam.scale}}</span>
              </el-form-item>
            </div>
            <div class="chunk">
              <el-form-item label="驳回原因：">
                <span>{{findPurchaseListParam.rejectedReason}}</span>
                <!-- <el-input
              placeholder=""
              v-model="findPurchaseListParam.rejectedReason"
              clearable
              disabled
                ></el-input>-->
              </el-form-item>
              <el-form-item label="备注：">
                <!-- <span slot="label">创建日期：</span> -->
                <el-input placeholder="备注信息" v-model="findPurchaseListParam.memo" clearable></el-input>
              </el-form-item>
              <el-form-item label="制单员：">
                <!-- <span slot="label">结算单名称：</span> -->
                <span>{{findPurchaseListParam.creatorName}}</span>
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
          <!-- <span>{{item.includeTaxText}}</span>      -->
          <div class="listBoxRight">
            <div class="white-btn fun-btn" @click="clearOrderList(i)">
              <i class="iconfont icon-icon-test"></i>移除
            </div>
          </div>
          <el-table
            :data="item.purchaseOrderItemDTOList"
            border
            max-height="500"
            :ref="`tableData${i}`"
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
            <el-table-column prop="invoiceQty" label="已关联发票数量" align="center"></el-table-column>
            <el-table-column prop="currentQty" label="本次结算数量" align="center">
              <template slot-scope="scope">
                <el-input
                  placeholder
                  v-model="scope.row.currentQty"
                  @input="(value)=>{
                  inputQty(value,scope.row.settlementQty,scope.row.invoiceQty,i,scope.$index)}"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="currentPrice" label="本次结算单价" align="center">
              <template slot-scope="scope">
                <el-input
                  placeholder
                  v-model="scope.row.currentPrice"
                  @input="(val)=>{
                  inputPrice(val,scope.row.currentPrice)}"
                ></el-input>
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
                <span
                  v-if="scope.row.currentTaxRateText!=null"
                >{{(parseInt(scope.row.currentTaxRateText)/100*scope.row.currentPrice-scope.row.currentPrice*parseInt(scope.row.taxText)/100).toFixed(4)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceNo" label="发票关联号码" align="center"></el-table-column>
            <el-table-column prop="amount" label="小计" align="center">
              <!-- <template slot-scope="scope">
                <el-input v-model="scope.row.amount"></el-input>
              </template>-->
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.amount"></el-input> -->
                <span>{{(scope.row.currentQty*scope.row.currentPrice).toFixed(2)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop" v-if=" this.findPurchaseListParam.paymentMode !== 'PAY_IN_ADVANCE' ">
        <span>
          <i class="iconfont iconsousuo"></i>发票明细
        </span>
        <div class="listBoxRight">
          <div
            class="white-btn fun-btn"
            @click="createInvoice('createInvoice',{'purchaseBillId':purchaseOrderItemParam.purchaseBillId})"
            style="width:120px"
          >
            <i class="iconfont icon-icon-test"></i>添加
          </div>
        </div>
      </div>
      <div class="listBoxTop1" v-for="(item,i) in invoiceData" :key="i">
        <span>
          <i class="iconfont iconsousuo"></i>
          发票{{i+1}}
        </span>
        <!-- <span><el-button type="text" @click="delInvoice(i)">删除</el-button></span> -->
        <div class="listBoxRight">
          <div
            class="white-btn fun-btn"
            @click="delInvoice(item.id)"
            style="width:120px"
            v-if="item.status!='INVOICE_PASS'&&item.status!='COMPLETED'&&item.status!='PARTIALLY_PASSED'"
          >删除</div>
          <div
            class="white-btn fun-btn"
            @click="
           createInvoice('editerInvoice',{'invoiceId':item.id,'purchaseBillId':purchaseOrderItemParam.purchaseBillId})"
            style="width:120px"
            v-if="item.status!='INVOICE_PASS'&&item.status!='COMPLETED'&&item.status!='PARTIALLY_PASSED'"
          >发票编辑</div>
        </div>
        <div class="formBox">
          <div class="formBox">
            <div class="chunkBox">
              <div class="chunk">
                <span>业务类型：</span>
                <span>采购</span>
              </div>

              <div class="chunk">
                <span>发票类型：</span>
                <span>{{item.invoiceTypeText}}</span>
              </div>
            </div>

            <div class="chunkBox">
              <div class="chunk">
                <span>发票代码：</span>
                <span>{{item.invoiceCode}}</span>
              </div>

              <div class="chunk">
                <span>发票号码：</span>
                <span>{{item.invoiceNumber}}</span>
              </div>
            </div>

            <div class="chunkBox">
              <div class="chunk">
                <span>开票日期：</span>
                <span>{{item.invoiceDate}}</span>
              </div>
              <div class="chunk">
                <span>校验码（后6位）：</span>
                <span>{{item.checkCode}}</span>
              </div>
            </div>
            <div class="chunkBox">
              <div class="chunk">
                <span>购买方名称：</span>
                <span>{{item.organizationName}}</span>
              </div>
              <div class="chunk">
                <span>销售方名称：</span>

                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.supplierName"
                  placement="top-end"
                >
                  <span>{{item.supplierName}}</span>
                </el-tooltip>
              </div>
            </div>
            <div class="chunkBox">
              <div class="chunk">
                <span>发票税额：</span>
                <span>{{item.taxAmount}}</span>
              </div>
              <div class="chunk">
                <span>发票金额：</span>
                <span>{{item.amount}}</span>
              </div>
            </div>
            <div class="chunkBox">
              <div class="chunk">
                <span>价税合计：</span>
                <span>{{item.pricePlusTaxes}}</span>
              </div>
              <div class="chunk">
                <span>制单日期：</span>
                <span>{{item.createTime}}</span>
              </div>
            </div>
            <div class="chunkBox">
              <div class="chunk">
                <span>制单人：</span>
                <span>{{item.creatorName}}</span>
              </div>
              <div class="chunk">
                <span>受理人：</span>
                <span>{{item.receiverName}}</span>
              </div>
            </div>
            <div class="chunkBox">
              <div class="chunk">
                <span>发票附件：</span>
                <el-button
                  size="small"
                  @click="downloadFile(item.attachment)"
                  v-if="item.attachment"
                >下载发票附件</el-button>
                <span @click="downloadFile(item.attachment)">{{item.attachmentName}}</span>
              </div>
              <div class="chunk">
                <span>驳回原因：</span>0
                <span>{{item.rejectedReason}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="blockButtonBox">
      <el-button class="active" @click="submit('findPurchaseListParam')">确认</el-button>
      <el-button class="active" @click="cancelData('PurchaseManage')">取消</el-button>
    </div>
    <orderTips ref="orderTips"></orderTips>
    <cancelData ref="cancelData" @close="closed()"></cancelData>
    <purchaseListCreate ref="purchaseListCreate" @dialogcallback="dialogcallback"></purchaseListCreate>
    <createInvoice ref="createInvoice" @createInvoiceCallback="createInvoiceCallback"></createInvoice>
  </div>
</template>
<script>
import store from "@/store/store";
import elDragDialog from "@/directive/el-dragDialog";
import cancelData from "../purchaseDemandManage/child/cancel_data";
import orderTips from "../purchaseDemandManage/child/order_tips";
import purchaseListCreate from "./child/purchase_list_create";
import createInvoice from "./child/create_invoice";
import {
  findPurchaseDetailList,
  editerBillList,
  editerInitBillList,
  deleteInvoiceList
} from "@/api/purchase/purchaseBillList.js";
import { setTimeout } from "timers";
import { Debounce } from "@/utils";
export default {
  inject: ["reload", "close"],
  name: "editerPurchaseBillList",
  data() {
    const checkDemandQuantity = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("付款类型不能为空"));
      } else {
        callback();
      }
    };
    const checkWarehouse = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("预付金额不能为空"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        paymentMode: [
          {
            validator: checkDemandQuantity,
            required: true,
            trigger: "blur",
            trigger: "change"
          }
        ],
        prepaidAmount: [
          { validator: checkWarehouse, required: true, trigger: "blur" },
          { validator: checkWarehouse, trigger: "change" }
        ]
      },
      data: [], //列表数据
      invoiceData: [], //发票数据
      findPurchaseListParam: {
        accountName: "", //开户行名称
        accountNo: "", //开户行账号
        amount: null, //结算单金额
        billNo: "", //采购结算单编号
        bank: "", //开户行
        createTime: "", //创建时间
        creatorName: "", //制单员名称
        id: null, //	结算单id，主键自增
        memo: "", //备注
        name: "", //结算单名称
        paymentMode: "", //结款方式
        prepaidAmount: null, //预付金额
        rejectedReason: "", //驳回原因
        scale: "", //预付比例
        status: "", //采购结算单状态 {1:待审批, 2:已通过, 3:已驳回 4:已取消}
        supplierId: null, //供应商id
        supplierName: "", //供应商名称
        purchaseBillOrderItemList: [] //结算单列表               （暂定）
        // purchaseBillOrderItemList:[],
      },
      purchaseOrderItemParam: {
        purchaseBillId: this.$route.query.id, //结算单id
        purchaseOrderId: [] //采购单id集合
      },
      requirementOrganizations: [],
      loading: false,
      optionsWarehouse: null,
      purchaseArr: [],
      //机构名称
      options: [],
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
      multipleOrderSelection: [],
      multipleSafetyStockSelection: [],
      multipleCustomSelection: [],
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
    purchaseListCreate,
    createInvoice
  },
  created() {
    this.editerInitBillList(this.purchaseOrderItemParam.purchaseBillId)
  },
  activated() {
    this.editerInitBillList(this.$route.query.id);
  },
  mounted() {},
  methods: {
    closed() {
      this.close({name:"editerPurchaseBillList",to: {name:'PurchaseManage',params:{isUpdate:true}}})
    },
    editerInitBillList(id) {
      editerInitBillList(id).then(
        res => {
          if (res.code == "000000") {
            this.data = res.data.purchaseOrderInfoDTOList;
            this.findPurchaseListParam = res.data.purchaseBillDTO;
            this.findPurchaseListParam.supplierId =
              res.data.purchaseBillDTO.supplierId;
            this.invoiceData = res.data.purchaseInvoiceDTOList;
            this.$nextTick(() => {
              this.data.forEach((item, i) => {
                item.purchaseOrderItemDTOList.forEach((gg, jj) => {
                  // gg.currentQty = gg.settlementQty;
                  //当前接口无返回值时用默认可结算数量
                  if (gg.currentQty == null) {
                    gg.currentQty = gg.settlementQty;
                  } else {
                    gg.settlementQty =
                      gg.currentQty - 1 + 1 + gg.settlementQty - 1 + 1;
                  }
                  if (gg.currentPrice == null) {
                    gg.currentPrice = gg.purchasePrice;
                  }
                  this.$refs["tableData" + i][0].toggleRowSelection(
                    gg,
                    gg.checked
                  );
                });
              });
            });
          }
        }
      );
    },
    dialogcallback(name, arr) {
      console.log(name, 444);
      arr.forEach(item => {
        console.log(this.purchaseArr, 66666);
        // debugger
        this.purchaseArr.push(item);
      });
      this.purchaseOrderItemParam.purchaseOrderId = this.purchaseArr;
      // this.purchaseOrderItemParam.purchaseOrderId = arr;
      findPurchaseDetailList(this.purchaseOrderItemParam).then(res => {
        if (res.code == "000000") {
          // debugger;
          this.data = res.data;
          console.log(this.data);
          this.$nextTick(() => {
            console.log(this.data, 88888);
            this.data.forEach((item, i) => {
              item.purchaseOrderItemDTOList.forEach((gg, jj) => {
                if (gg.currentQty == null) {
                  gg.currentQty = gg.settlementQty;
                } else {
                  gg.settlementQty =
                    gg.currentQty - 1 + 1 + gg.settlementQty - 1 + 1;
                }
                if (gg.currentPrice == null) {
                  gg.currentPrice = gg.purchasePrice;
                }
                this.$refs["tableData" + i][0].toggleRowSelection(
                  gg,
                  gg.checked
                );
              });
            });
          });
        }
      });
    },
    // disSelectable(row,index){
    // 	if(row.settlementQty>0){
    // 		return true
    // 	}else{
    // 		return false
    // 	}
    // },
    inputPrepaidAmount(value) {
      this.findPurchaseListParam.scale = (
        this.findPurchaseListParam.prepaidAmount /
        this.findPurchaseListParam.amount
      ).toFixed(4);
      this.findPurchaseListParam.scale =
        this.findPurchaseListParam.scale * 100 + "%";
    },
    inputQty: Debounce(function(value, gg, kk, index, $index) {
      console.log(value, gg, 77);
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
    inputPrice: Debounce(function(val, kk) {
      //  if(val>kk){
      //    this.$message({
      //      message:'本次结算单价小于采购价'
      //    })
      //  }
    }),
    createInvoiceCallback() {
      editerInitBillList(this.purchaseOrderItemParam.purchaseBillId).then(
        res => {
          if (res.code == "000000") {
            // this.data=res.data.purchaseOrderInfoDTOList;
            // this.findPurchaseListParam=res.data.purchaseBillDTO;
            this.invoiceData = res.data.purchaseInvoiceDTOList;
          }
        }
      );
    },
    getListName() {},
    //下载发票附件
    downloadFile(id) {
      let href = `/api/file-service/file/download?id=${id}&access_token=${this.$auth.token}`;
      window.open(href, "blank");
    },
    //删除发票
    delInvoice(value) {
      deleteInvoiceList(value, this.purchaseOrderItemParam.purchaseBillId).then(
        res => {
          if (res.code == "000000") {
            this.$message({
              message: "删除发票成功",
              type: "success"
            });
            editerInitBillList(this.purchaseOrderItemParam.purchaseBillId).then(
              res => {
                if (res.code == "000000") {
                  // this.data=res.data.purchaseOrderInfoDTOList;
                  // this.findPurchaseListParam=res.data.purchaseBillDTO;
                  console.log(res.data, 4444444444444444);
                  this.invoiceData = res.data.purchaseInvoiceDTOList;
                }
              }
            );
          }
        }
      );
    },
    clearOrderList(value) {
      let id = this.data[value].id;
      if (this.purchaseArr.indexOf(id) >= -1) {
        this.purchaseArr.splice(id, 1);
        console.log(this.purchaseArr, 99988888);
      }
      this.data.splice(value, 1);
      this.$nextTick(() => {
        this.data.forEach((item, i) => {
          item.purchaseOrderItemDTOList.forEach((gg, jj) => {
            // gg.currentQty = gg.settlementQty;
            // gg.currentPrice = gg.purchasePrice;
            this.$refs["tableData" + i][0].toggleRowSelection(gg, gg.checked);
          });
        });
      });
    },
    addOrderDemand(name) {
      this.purchaseArr = [];
      this.data.forEach((item, i) => {
        this.purchaseArr.push(item.id);
      });

      this.$refs.purchaseListCreate.init(
        name,
        this.purchaseArr,
        this.findPurchaseListParam.supplierId
      );
    },
    createInvoice(name, value) {
      this.$refs["createInvoice"].init(name, value, this.findPurchaseListParam);
    },
    openWin(name, query) {
      const { href } = this.$router.resolve({
        name: name,
        query: query
      });
      window.open(href, "_blank");
    },
    cancelData(type) {
      this.$refs.cancelData.init(type);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.findPurchaseListParam.purchaseBillOrderItemList = [];
          if (this.findPurchaseListParam.paymentMode == "PAY_IN_ADVANCE") {
            let sum = 0;
            this.data.forEach(item => {
              item.purchaseOrderItemDTOList.forEach(kk => {
                if (kk.checked) {
                  sum += kk.currentQty * kk.currentPrice;
                }
              });
            });
            console.log(Number(sum.toFixed(2)),Number(this.findPurchaseListParam.prepaidAmount),'111');
            if (Number(sum.toFixed(2)) < Number(this.findPurchaseListParam.prepaidAmount)) {
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
              editerBillList(this.purchaseOrderItemParam.purchaseBillId, {
                billOrderItemParamList: this.findPurchaseListParam
                  .purchaseBillOrderItemList,
                memo: this.findPurchaseListParam.memo,
                prepaidAmount: this.findPurchaseListParam.prepaidAmount
              }).then(res => {
                if (res.code == "000000") {
                  this.$message({
                    message: "编辑结算单成功",
                    type: "success"
                  });
                  this.close({name:"editerPurchaseBillList",to: {name:'PurchaseManage',params:{isUpdate:true}}})
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
            editerBillList(this.purchaseOrderItemParam.purchaseBillId, {
              billOrderItemParamList: this.findPurchaseListParam
                .purchaseBillOrderItemList,
              memo: this.findPurchaseListParam.memo,
              prepaidAmount: this.findPurchaseListParam.prepaidAmount
            }).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "编辑结算单成功",
                  type: "success"
                });
                this.close({name:"editerPurchaseBillList",to: {name:'PurchaseManage',params:{isUpdate:true}}})
              }
            });
          }

          //  var checkedArr=[]
          // this.data.map(item=>{
          // 	item.purchaseOrderItemDTOList.map(tt=>{
          // 		if(tt.checked){
          // 			checkedArr.push({
          //             currentPrice: tt.currentPrice,
          //             currentQty: tt.currentQty,
          //             currentTaxRate: parseInt(tt.currentTaxRateText) / 100,
          //             purchaseOrderId: item.id,
          //             purchaseOrderItemId: tt.id,
          //             taxRate: parseInt(tt.taxText) / 100,
          //             settlementQty:Number(tt.settlementQty)
          // 			})
          // 		}
          // 	})
          // })
          // this.findPurchaseListParam.purchaseBillOrderItemList=checkedArr
        }
      });
    },
    //点击行的多选按钮，改变当前行的checked的值
    handleChange(sel, row, i) {
      row.checked = !row.checked;
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
      this.data[i].purchaseOrderItemDTOList.forEach((item, index) => {
        this.selection &&
          this.selection.forEach((ii, jj) => {
            if (item.id == ii.id) {
              item.checked = true;
            }
          });
      });
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
        // justify-content: space-between;
        flex: 1;
        .el-form-item {
          flex: 1;
          display: flex;
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
    // background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 20px 0 0 0;
    line-height: 50px;
    .listBoxTop {
      background-color: #f3f3f3;
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
          //  float: right;
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
    .listBoxTop1 {
      background-color: #f3f3f3;
      border-top: 1px solid #e4e4e4;
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .white-btn {
          margin-top: 10px;
          margin-right: 10px;
        }
      }

      .listBoxCenter {
        border: 1px solid #e4e4e4;
        .listBoxRight {
          //  float: right;
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
      .formBox {
        //  width: 80%;
        background-color: white;
        padding: 0 10%;

        .chunkBox {
          display: flex;
          justify-content: space-between;
          .chunk {
            width: 30%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
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









