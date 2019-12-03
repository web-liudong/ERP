<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <div class="wrapper">
      <div class="head">
        <div class="head-title">
          <i class="iconfont iconcaidan"></i>
          <span>基本信息：</span>
        </div>
        <div style="width: 100%;">
          <el-form-item required>
            <div class="headText">
              <ul>
                <li style="display: flex;">
                  <el-col>
                    <el-form-item prop="supplierName" label="供应商：" label-width="100px">
                      <el-select
                        v-model="ruleForm.supplierId"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="供应商名称"
                        :remote-method="customerRemote"
                        @change="getData"
                        :loading="loading"
                      >
                        <el-option
                          v-for="item in customernames"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item prop="warehouseName" label="仓库：" label-width="100px">
                      <el-select
                        style="max-width: 200px;"
                        v-model="ruleForm.warehouseId"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="仓库名称"
                        :remote-method="customerRemote1"
                        @change="getDath"
                        :loading="loading"
                      >
                        <el-option
                          v-for="item in options"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="退货原因：" label-width="100px" prop="returnReason">
                      <el-input
                        v-model="ruleForm.returnReason"
                        style="max-width: 200px;border-color: #c0c4cc"
                        placeholder="退货原因"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="退货方式：" label-width="100px" prop="returnType">
                      <el-select
                        v-model="ruleForm.returnType"
                        placeholder="退货方式"
                        clearable
                        @change="chenge(ruleForm.returnType)"
                      >
                        <el-option
                          v-for="item in options2"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </li>
                <li style="display: flex;margin-top: 25px">
                  <el-col>
                    <el-form-item label="备注：" label-width="100px">
                      <el-input
                        v-model="ruleForm.memo"
                        style="max-width: 200px;border-color: #c0c4cc"
                        placeholder="备注信息"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="快递名称：" label-width="100px">
                      <el-select v-model="ruleForm.expressCompany" placeholder="快递名称" clearable>
                        <el-option
                          v-for="item in options3"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="快递单号：" label-width="100px" prop="expressNumber">
                      <el-input
                        v-model="ruleForm.expressNumber"
                        style="max-width: 200px;border-color: #c0c4cc"
                        placeholder="不能超过50个字符"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="是否含税：" label-width="100px" prop="tax">
                      <el-radio-group v-model="ruleForm.tax" style="max-width: 200px">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0" style="margin-left: -20px">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="body">
        <div class="head-title">
          <i class="iconfont iconjinridingdanshu"></i>
          <span>数据列表：</span>
          <div class="rightBox">
            <div class="white-btn fun-btn" @click="goIn()">添加商品</div>
          </div>
        </div>
        <el-table
          :data="ruleForm.purchaseReturnOrderItemList"
          :max-height="dataListHeight"
          border
          style="width: 100%"
          size="small"
        >
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="inventory" label="可用库存" align="center"></el-table-column>
          <el-table-column label="退货数量" align="center">
            <template slot-scope="scope">
              <el-input
                @input="gitChange(scope.row)"
                clearable
                v-model="scope.row.quantity"
                placeholder
                v-show="ruleForm.purchaseReturnOrderItemList.total!=0"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="退货价格" align="center">
            <template slot-scope="scope">
              <el-input
               @blur="tablechange(scope.row)"
                @input="gitChange(scope.row)"
                clearable
                v-model="scope.row.currentPrice"
                placeholder
                v-show="ruleForm.purchaseReturnOrderItemList.total!=0"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="折扣率" align="center">
            <template slot-scope="scope">
              <el-input
                clearable
                v-model="scope.row.discount"
                placeholder="0~1"
                v-show="ruleForm.purchaseReturnOrderItemList.total!=0"
                @input="getCnter(scope.row)"
                @blur="getCntes(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="buyingPrice" label="采购参考价" align="center">
            <template slot-scope="scope">
              <span v-show="ruleForm.purchaseReturnOrderItemList.total!=0">￥</span>
              <span>{{scope.row.buyingPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="previousPurchasePrice" label="上次采购价" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.previousPurchasePrice">￥</span>
              {{scope.row.previousPurchasePrice}}
            </template>
          </el-table-column>
          <el-table-column prop="taxRateText" label="税率" align="center">
            <!--<template slot-scope="scope">-->
            <!--<span>{{(scope.row.taxRate*100).toFixed(2)}}</span>-->
            <!--<span  v-show="tableData.total!=0">%</span>-->
            <!--</template>-->
          </el-table-column>

          <el-table-column label="总金额" align="center">
            <template slot-scope="scope">
              <span v-show="ruleForm.purchaseReturnOrderItemList.total!=0">￥</span>
              <span>{{isNaN(scope.row.currentPrice*scope.row.quantity)?'':(scope.row.currentPrice*scope.row.quantity).toFixed(2)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="float: right;">
      <el-button
        type="primary"
        style="width: 150px;margin-top: 10px;margin-right: 10px;"
        @click="submitForm('ruleForm')"
      >确定</el-button>
      <el-button
        type="primary"
        style="width: 150px;margin-top: 10px;margin-right: 50px;"
        @click="purRetun()"
      >返回</el-button>
    </div>
    <el-dialog man-height="500" :visible.sync="dialogVisible" width="50%">
      <div slot="title" class="dialog-title">
        <span class="reject-title">添加商品</span>
      </div>
      <div class="head-title">
        <i class="iconfont iconcaidan"></i>
        <span>筛选条件：</span>
        <div class="rightBox">
          <div class="white-btn fun-btn" @click="search()">查询结果</div>
        </div>
      </div>
      <div style="border: 1px solid #eee">
        <div class="homeBoxBottom">
          <div style="margin-left: 40px">
            <span>商品名称：</span>
            <el-input placeholder="请输入商品名称" v-model="query.skuName" clearable></el-input>
          </div>
          <div style="margin-left: 40px">
            <span>商品编号：</span>
            <el-input
              placeholder="请输入商品编号"
              v-model="query.skuNo"
              @input="gitChangs(query)"
              clearable
            ></el-input>
          </div>
        </div>
      </div>
      <div class="head-title">
        <i class="iconfont iconjinridingdanshu"></i>
        <span>数据列表：</span>
      </div>
      <el-table
        :data="tableData.items"
        size="small"
        max-height="315"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="skuModel" label="规格" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" align="center"></el-table-column>
        <el-table-column prop="inventory" label="可用库存" align="center"></el-table-column>
      </el-table>
      <div style="width: 100%;margin: 10px">
        <div class="block" v-show="tableData.total!=0">
          <span class="demonstration"></span>
          <el-pagination :page-size="10" layout=" total" :total="tableData.total"></el-pagination>
          <!--<(tableData.total/tableData.pageSize+1)-->
          <div style>
            <el-button
              type="button"
              class="btn-next"
              @click="loadMore"
              v-if="page<(tableData.total/tableData.pageSize)"
            >加载更多</el-button>
            <el-button type="button" class="btn-next" v-else disabled="disabled">加载完毕</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="goOut()">确 定</el-button>
      </span>
    </el-dialog>
  </el-form>
</template>
<script>
import {
  postMerchandiseInquiryonReturnBill,
  postNewPurchaseReturnBill,
  postWarehouseList
} from "@/api/purchase/purchaseReturnOrder";
import { findInfo } from "@/api/businessSupplier";
	import {returnFloat,returnFloatFour,returnFloatTwoFour} from '@/utils/index'

import Addhead from "../../home/components/CommonHeader";
export default {
  components: { Addhead },

  inject: ["reload", "close"],
  name: "NewPurchaseReturnBill",
  data() {
    return {
      s: "",
      dialogVisible: false,
      page: 1,
      totalAmount: "",
      customernames: [],
      options: [],
      multipleSelection: [],
      loading: false,
      ruleForm1: {
        supplierId: "",
        warehouseId: "",
        warehouseName: "",
        returnReason: "",
        returnType: "",
        memo: "",
        expressCompanyName: "",
        expressNumber: "",
        supplierName: "",
        tax: "",
        purchaseReturnOrderItemList: []
      },
      ruleForm: {
        supplierId: "",
        warehouseId: "",
        warehouseName: "",
        returnReason: "",
        returnType: "",
        memo: "",
        expressCompanyName: "",
        expressNumber: "",
        supplierName: "",
        tax: "",
        purchaseReturnOrderItemList: []
      },
      rules: {
        supplierName: [
          { required: true, message: "请输入供应商名称", trigger: "change" }
        ],
        warehouseName: [
          { required: true, message: "请填写仓库", trigger: "change" }
        ],
        returnReason: [
          { required: true, message: "请填写退货原因", trigger: "blur" }
        ],
        returnType: [
          { required: true, message: "请选择退货方式", trigger: "change" }
        ],
        expressNumber: [
          { min: 1, max: 50, message: "最长为50字符", trigger: "blur" }
        ],
        tax: [{ required: true, message: "是否含税", trigger: "change" }]
      },
      isShow: true,
      returnData: [],
      returnData1: [],
      tableData1: {},
      tableData: {
        items: [
          {
            // "buyingPrice": 66123123,
            // "currentPrice": 111,
            // "inventory": 0,
            // "previousPurchasePrice": 0,
            // "quantity": '',
            // "skuId": 0,
            // "skuModel": "string",
            // "skuName": "string",
            // "taxRate": 0,
            // "totalAmount": 0,
            // "unit": "string"
          }
        ],
        total: 0
      },

      currentPrice: "",
      quantity: "",
      discount: "",
      options3: [
        //快递名称
        {
          value: "ZI_YOU",
          label: "自有物流"
        },
        {
          value: "YUAN_TONG",
          label: "圆通速递"
        },
        {
          value: "SHEN_TONG",
          label: "申通快递"
        },
        {
          value: "ZHONG_TONG",
          label: "中通快递"
        },
        {
          value: "BAI_SHI",
          label: "百世快递"
        },
        {
          value: " YUN_DA",
          label: "韵达快递"
        },
        {
          value: "SHUN_FENG",
          label: "顺丰速运"
        },
        {
          value: "TIAN_TIAN",
          label: "天天快递"
        },
        {
          value: "YOU_ZHENG",
          label: "中国邮政"
        },
        {
          value: "ZHAI_JI_SONG",
          label: "宅急送"
        },
        {
          value: "DE_BANG",
          label: "德邦快递"
        },
        {
          value: "KUA_YUE",
          label: "跨越速运"
        },
        {
          value: "EMS",
          label: "EMS"
        }
      ],
      options2: [
        {
          value: "OFFLINE_RETURN",
          label: "线下退货"
        },
        {
          value: "EXPRESS_RETURN",
          label: "快递退货"
        }
      ],
      query: {
        skuId: "",
        skuNo: "",
        skuName: "",
        supplierId: "",
        warehouseId: "",
        pageNum: 0,
        pageSize: "5"
      }
    };
  },

  created() {},
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    // seletable(row,index){
    //   if(row.inventory == 0){
    //     return false
    //   }else{
    //     return true
    //   }
    // },
    tablechange(val){
      // console.log(returnFloatFour(val.currentPrice))
      val.currentPrice = returnFloatFour(val.currentPrice)
    },
    gitChangs(res) {
      console.log(res.skuNo)
      if (res.skuNo) {
        res.skuNo = res.skuNo.replace(/\D/g, "");
      }
    },
    gitChange(res) {
      // console.log(res)
      if (res) {
        if (res.quantity) {
          res.quantity = res.quantity.replace(/\D/g, "");
        }
        if (res.currentPrice) {
          res.currentPrice = res.currentPrice.replace(/[^\d.]/g, "");
          // res.currentPrice = String(res.currentPrice).replace(/^(.*\..{4}).*$/,"$1");
        }

        // if(res.discount ){
        //     res.discount = res.discount.replace(/\D/g,'');
        //     res.discount =res.discount.toFixed(2)
        // }

        // console.log(res);
      }
    },
    getCntes(val) {
      var a = /^(\d+|\d+\.\d{1,2})$/;
      if (val.discount) {
        if (!a.test(val.discount)) {
          this.$message({
            type: "error",
            message: "保留两位小数"
          });
          val.discount = null;
        }
      }
    },
    getCnter(val) {
      // console.log(val, 1234);
      val.discount = val.discount.replace(/[^\d.]/g, "");
      if (val.discount > 1) {
        this.$message({
          type: "error",
          message: "折扣率是0~1"
        });
        val.discount = null;
      }
    },

    chenge(val) {
      // console.log(val);
      // console.log(this.s, 1);
      // console.log(!this.s, 1.1);
      if (!this.s) {
        this.s = val;
        // console.log(this.s, 2);
        // console.log(!this.s, 2.1);
        return;
      }
      if (val != this.s && this.ruleForm.expressCompany) {
        this.ruleForm.expressCompany = "";
        this.ruleForm.expressNumber = "";
        console.log(this.ruleForm.expressCompany);
        this.s = val;
        console.log(this.s, 3);
      }
    },
    if(dialogVisible = false) {},
    // 加载更多
    loadMore(query) {
      this.query.pageNum = "";
      this.page += 1;
      // console.log(this.page);
      this.query.pageNum = this.page;
      postMerchandiseInquiryonReturnBill(this.query)
        .then(res => {
          // console.log(res);
          this.tableData1.items = res.data.items;
          // this.tableData.items.push.apply(this.tableData.items,this.tableData1.items);//将请求回来的数据和上一次进行组合
          // for (let i=0;i<this.tableData1.items.length; i++ ){
          //   this.tableData.items.push(this.tableData1.items[i])//将请求回来的数据和上一次进行组合
          // }
          this.tableData1.items.forEach(val => {
            this.tableData.items.push(val);
          });
          console.log(this.tableData, 1344444);
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: "请等候"
          });
        });
    },

    //搜索
    customerRemote(supplierId) {
      // console.log(this.ruleForm.supplierId);
      if (supplierId != "") {
        let aa = { name: supplierId };
        findInfo(aa)
          .then(res => {
            // console.log(res);
            this.customernames = res.data;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //仓库
    customerRemote1(warehouseName) {
      // console.log(this.ruleForm.warehouseName);
      // this.loading = true;
      var storage = window.localStorage;
      var UserInfo = storage.getItem("UserInfo");
      var userPosts = JSON.parse(UserInfo).userPosts;
      var organizationId = userPosts[0].organizationId;
      if (warehouseName != "") {
        let ac = { name: warehouseName, organizationId: organizationId };
        postWarehouseList(ac)
          .then(res => {
            // console.log(res);
            this.options = res.data;
            // console.log(this.options);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    getData(value) {
      if (value) {
        // console.log(value);
        let aa = JSON.parse(JSON.stringify(this.customernames));
        aa = aa.filter((item, index) => {
          return item.id == value;
        });
        // console.log(aa[0].name, 666);
        // this.ruleForm.receiveAddress =aa[0].name+' '+ aa[0].id ;
        // console.log(this.ruleForm.receiveAddress,55);
        this.ruleForm.supplierName = aa[0].name;
        this.ruleForm.supplierId;
        this.query.supplierId = aa[0].id;
        // console.log(this.ruleForm.supplierId, 55);
      } else {
        this.ruleForm.supplierId = "";
        this.ruleForm.supplierName = "";
      }
    },
    getDath(value) {
      console.log(value, 111111111);
      let cc = JSON.parse(JSON.stringify(this.options));
      cc = cc.filter((item, index) => {
        return item.id == value;
      });
      console.log(cc[0].name, 666);
      // this.ruleForm.receiveAddress =aa[0].name+' '+ aa[0].id ;
      // console.log(this.ruleForm.receiveAddress,55);
      this.ruleForm.warehouseName = cc[0].name;
      this.ruleForm.warehouseId;

      // console.log(this.ruleForm.warehouseName, 55);
    },
    //查询
    search(query) {
      this.query.pageNum = 1;
      this.page = 1;
      // console.log(this.query.supplierId);
      this.query.warehouseId = this.ruleForm.warehouseId;
      if (this.query.supplierId) {
        postMerchandiseInquiryonReturnBill(this.query)
          .then(res => {
            // console.log(res);
            this.tableData = res.data;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message({
          type: "error",
          message: "请填写查询供应商"
        });
        return false;
      }
    },
    purRetun() {
      this.close({
        name: "NewPurchaseReturnBill",
        to: { name: "PurchaseReturnOrder", params: { isUpdate: true } }
      });
    },
    goIn() {
      this.dialogVisible = true;
      this.tableData = "";
      this.query.skuName = "";
      this.query.skuNo = "";
    },
    goOut() {
      // this.returnData = !this.tableData?this.returnData:this.multipleSelection
      if (this.multipleSelection.length != 0) {
        this.multipleSelection.forEach(val => {
          this.ruleForm.purchaseReturnOrderItemList.push(val);
        });
        // console.log(this.ruleForm.purchaseReturnOrderItemList);
        let hash = {};
        this.ruleForm.purchaseReturnOrderItemList = this.ruleForm.purchaseReturnOrderItemList.reduce(
          (preVal, curVal) => {
            hash[curVal.skuId]
              ? ""
              : (hash[curVal.skuId] = true && preVal.push(curVal));
            return preVal;
          },
          []
        );
        this.dialogVisible = false;
      } else {
        this.$confirm("请选择退货商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitForm(formName) {
      // console.log(this.ruleForm.tax, 12355);
      if (this.ruleForm.tax) {
        this.ruleForm.tax = parseInt(this.ruleForm.tax);
      }
      // console.log(this.ruleForm.tax, 123556);
      if (!this.ruleForm.purchaseReturnOrderItemList.length) {
        this.$confirm("请添加退货商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
        return;
      }
      let x = 0;
      for (
        var i = 0;
        i < this.ruleForm.purchaseReturnOrderItemList.length;
        i++
      ) {
        if (
          this.ruleForm.purchaseReturnOrderItemList[i].quantity == "0" ||
          this.ruleForm.purchaseReturnOrderItemList[i].currentPrice == "0"
        ) {
          x++;
        }
      }
      let j = 0;
      for (
        var i = 0;
        i < this.ruleForm.purchaseReturnOrderItemList.length;
        i++
      ) {
        if (
          this.ruleForm.purchaseReturnOrderItemList[i].quantity &&
          this.ruleForm.purchaseReturnOrderItemList[i].currentPrice
        ) {
          this.ruleForm.purchaseReturnOrderItemList[i].totalAmount =
            this.ruleForm.purchaseReturnOrderItemList[i].quantity *
            this.ruleForm.purchaseReturnOrderItemList[i].currentPrice;
          j++;
        } else {
        }
      }
      let y = 0;
      this.ruleForm.purchaseReturnOrderItemList.forEach(function(s) {
        if (!s.discount) {
          y++;
        }
      });

      if (x != 0) {
        this.$confirm("退货数量与退货价格不能为0", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
        return;
      }
      if (j != this.ruleForm.purchaseReturnOrderItemList.length) {
        this.$confirm("所选内容中有退货商品数量或退货价格未填", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
      } else {
        if (y != 0) {
          this.$confirm("折扣率不能为空", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {})
            .catch(() => {});
          return;
        }
        // if (this.ruleForm.returnType == "OFFLINE_RETURN") {
        //   if (this.ruleForm.warehouseId == "") {
        //     this.$confirm("线下退货请填写仓库", "提示", {
        //       confirmButtonText: "确定",
        //       cancelButtonText: "取消",
        //       type: "warning"
        //     })
        //       .then(() => {})
        //       .catch(() => {});
        //     return;
        //   }
        // }
        if (this.ruleForm.returnType == "OFFLINE_RETURN") {
          let noTite = 0;
          this.ruleForm.purchaseReturnOrderItemList.forEach(res => {
            if (res.quantity > res.inventory) {
              this.$confirm(
                "所选商品中可用库存不足，创建线下退货单失败",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  this.$refs[formName].resetFields();
                  this.ruleForm = this.ruleForm1;
                })
                .catch(() => {});
              noTite++;
            }
            return;
          });
          if (noTite != 0) {
            return;
          }
        }

        // console.log(this.ruleForm.purchaseReturnOrderItemList[0].quantity);
        this.ruleForm.purchaseReturnOrderItemList.totalAmount =
          this.ruleForm.purchaseReturnOrderItemList.quantity *
          this.ruleForm.purchaseReturnOrderItemList.currentPrice;
        this.ruleForm.purchaseReturnOrderItemList = this.ruleForm.purchaseReturnOrderItemList;
        this.$refs[formName].validate(valid => {
          if (valid) {
            postNewPurchaseReturnBill(this.ruleForm).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.ruleForm = this.ruleForm1;
                this.goDetail();
              }
            });
          } else {
            console.log("error submit!!");
          }
        });
      }
    },
    goDetail() {
      this.close({
        name: "NewPurchaseReturnBill",
        to: { name: "PurchaseReturnOrder", params: { isUpdate: true } }
      });
    },
    cellStyle() {
      return "background-color:#f5f5f5";
    }
  }
};
</script>
<style scoped lang="less">
body {
  .block {
    margin-left: 44%;
    text-align: center;

    display: flex;
  }
}
</style>
<style scoped lang="less">
.wrapper {
  width: 100%;
  padding-top: 20px;
  .headText {
    display: flex;
    flex-wrap: wrap;
    ul {
      width: 100%;
      li {
        margin-top: 10px;
        .el-col {
          display: flex;
          flex-wrap: wrap;
          .el-input {
            height: 40px;
          }
          .el-select {
            height: 40px;
            margin-bottom: 10px;
          }
          .el-date-editor {
            width: 200px;
            height: 40px;
          }
          .text {
            line-height: 40px;
            margin-top: -10px;
          }
        }
      }
    }
  }
}
.head {
  border: 1px solid #e4e4e4;
  margin-bottom: 20px;
}
.body {
  border: 1px solid #e4e4e4;
}
.homeBoxBottom {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #e4e4e4;
  padding-top: 10px;
  background: #fff;
  .el-input {
    width: 200px;
    height: 40px;
    margin-bottom: 10px;
  }
  .el-select {
    width: 200px;
    min-width: 140px;
    height: 40px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .username-realname {
    width: 220px;
    height: 40px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
.head-title {
  width: 100%;
  background-color: #f3f3f3;
  height: 50px;
  padding-left: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e4e4;
  .rightBox {
    float: right;
    margin-right: 10px;
    height: 50px;
    .white-btn {
      margin-top: 10px;
      margin-right: 10px;
    }
  }
}
i {
  font-weight: bold;
  color: #666;
  font-size: 14px;
  line-height: 50px;
}
.button-box {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
</style>

