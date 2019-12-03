<!-- 认款操作 -->
<template>
  <div class="FinancialRecognitionOperation">
    <div class="top">
      <div class="topTop">
        <i class="iconfont iconjinridingdanshu"></i>
        <span>基本信息：</span>
      </div>
      <div class="topBottom">
        <ul>
          <li>
            <div>回款金额：</div>
            <p style="color:red">
              <i>¥</i>
              {{PaymentAmount}}
            </p>
          </li>
          <li>
            <div>回款信息ID：</div>
            <p>{{PaymentInformationID}}</p>
          </li>
          <li>
            <div>对方户名：</div>
            <p>{{yourName}}</p>
          </li>
          <li>
            <div>用途：</div>
            <p>{{use}}</p>
          </li>
        </ul>
        <div style="clear: both;"></div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottomTop">
        <div class="bottomTopLeft">
          <i class="iconfont icon-jinqi"></i>
          <span>关联新ERP订单</span>
        </div>
        <div class="bottomTopRight">
          <el-button icon="iconzengjia iconfont" @click="AssociatedOrder" size="small">关联订单</el-button>
        </div>
      </div>
      <div class="bottomBottom">
        <el-table
          :span-method="arraySpanMethod"
          :header-cell-style="tableHeaderStyle"
          :data="tableData"
          stripe
          border
          style="
      width: 98%;
      margin-left: 1%;
      margin-top: 5px;
      margin-bottom: 5px;"
        >
          <el-table-column prop="orderNo" align="center" label="订单号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" align="center" label="下单时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="projectName" align="center" label="项目" show-overflow-tooltip></el-table-column>
          <el-table-column prop="customerName" align="center" label="客户" show-overflow-tooltip></el-table-column>
          <el-table-column prop="customerUser" align="center" label="采购人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="serverName" align="center" label="服务方" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderAmount" align="center" label="订单金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billAmount" align="center" label="结算金额" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="settlementAmount"
            align="center"
            label="已结算金额"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="receiveableAmount"
            align="center"
            label="应收账款"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" label="本次认款金额" width="120px">
            <template slot-scope="scope">
              <el-input type="number" @blur="aaa(scope.row)" v-model="scope.row.renkuanjine"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收款账号信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.bankAccount"
                :placeholder="scope.row.bankAccount?scope.row.bankAccount:'请选择收款账号信息'"
                @change="onkaihuhangchange($event,scope.$index)"
              >
                <el-option
                  v-for="(item,indexs) in scope.row.kaihuhang"
                  :key="item.id"
                  :label="item.accountName+'-'+item.accountNo"
                  :value="item.accountNo"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addRow(scope.row)">拆分</el-button>
              <el-button type="text" size="small" @click="goNext(scope.$index,scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="goRecognize(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--   <p>本次认款总金额：¥{{totalnum}}</p> -->
    </div>
    <div class="bottom">
      <div class="bottomTop">
        <div class="bottomTopLeft">
          <i class="iconfont icon-jinqi"></i>
          <span>关联旧ERP订单</span>
        </div>
        <div class="bottomTopRight">
          <el-button icon="iconzengjia iconfont" @click="AddAssociatedOrder" size="small">添加</el-button>
        </div>
      </div>
      <div class="bottomBottom">
        <el-table
          :header-cell-style="tableHeaderStyle"
          :data="olderp"
          stripe
          border
          style="
      width: 98%;
      margin-left: 1%;
      margin-top: 5px;
      margin-bottom: 5px;"
        >
          <el-table-column prop="olderpNono" align="center" label="旧ERP订单号" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="olderpMoneymoney"
            align="center"
            label="本次认款金额"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goOLDNext(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <p class="ppp">回款金额：¥{{PaymentAmount}}</p>
    <p class="ppp">本次认款总金额：¥{{totalnum}}</p>
    <div class="di">
      <el-button @click="queren">确定</el-button>
      <el-button style="margin-left: 100px" @click="closeclose">取消</el-button>
    </div>
    <el-dialog class="yichang" title="异常认款" :visible.sync="yichangVisible">
      <!-- <div v-if="arrarr.length">订单<i>{{arrarr}}</i>中，本次认款金额大于应收账款；</div>
      <div v-if="PaymentAmount>totalnum">回款金额大于本次认款总金额，且差值小于等于1.00元，请填写异常认款原因。</div>-->
      <div>回款金额大于本次认款总金额，且差值小于等于1.00元，请填写异常认款原因。</div>
      <div class="textarea-box">
        <span>
          <i style="color: red;">*</i>异常原因：
        </span>
        <el-input type="textarea" :rows="4" placeholder="1~200字以内" v-model="textarea"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button style="line-height: 10px;height: 40px;" @click="yichangVisible = false">取消</el-button>
        <el-button style="line-height: 10px;height: 40px;" type="primary" @click="yichangclick">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="yichang" title="错误认款" :visible.sync="cuowuVisible">
      <div v-if="arrarr.length">
        订单
        <i>{{arrarr}}</i>中，本次认款金额大于应收账款；
      </div>
      <div>存在某些订单的本次认款金额（拆分认款记总数）大于应收账款</div>
      <span slot="footer" class="dialog-footer">
        <el-button style="line-height: 10px;height: 40px;" @click="cuowuVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="shanchuVisible" width="400px">
      <span style="font-size: 20px">删除后，数据将从列表移除，确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button style="line-height: 10px;height: 40px;" @click="shanchuVisible = false">取消</el-button>
        <el-button style="line-height: 10px;height: 40px;" type="primary" @click="returnclick">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="AssociatedOrderVisible" width="1000px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <i class="iconfont iconsousuo"></i>
        <span>筛选查询</span>
        <i
          style="margin-left: 585px;"
          :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'"
          @click="isShow=!isShow"
        ></i>
        <span @click="isShow=!isShow">收起筛选</span>
        <el-button size="small" class="w80 h40" @click="reset()" style="margin-left:10px">重置</el-button>
        <el-button style="margin-left: 10px;" class="w80 h40" size="small" @click="check">查询结果</el-button>
      </div>
      <div class="FilterQuery" v-if="isShow">
        <ul>
          <li>
            <el-input placeholder="订单号" v-model="PaymentInformationNumberID" clearable></el-input>
          </li>
          <li>
            <el-select
              v-model="allitem"
              filterable
              remote
              clearable
              placeholder="项目"
              :loading="loading"
              :remote-method="remoteMethod1"
            >
              <!-- :remote-method="onAllChange" -->
              <el-option
                v-for="item in allproAll"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-select
              v-model="customers"
              filterable
              remote
              clearable
              :loading="loading"
              :remote-method="remoteCustomer"
              placeholder="客户"
            >
              <!-- :remote-method="onAllchangeChange -->
              <el-option
                v-for="item in allcustomAll"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-select
              v-model="PaymentInformationMan"
              :remote-method="remotePurchase"
              filterable
              remote
              clearable
              :loading="loading"
              placeholder="采购人"
            >
              <el-option
                v-for="item in allcaigouAll"
                :key="item.userId"
                :label="item.name"
                :value="item.userId"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-select
              v-model="fuwufang"
              filterable
              placeholder="服务方"
              remote
              clearable
              :loading="loading"
              :remote-method="onAllfuwuChange"
            >
              <el-option
                v-for="item in allfuwuAll"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
        </ul>
        <div style="clear: both;"></div>
        <div class="input">
          <span class="span1">订单金额:</span>
          <el-input placeholder="0.00" v-model="RemittanceMinimum" clearable>
            <i slot="prefix">￥</i>
          </el-input>
          <span class="sapn2">——</span>
          <el-input placeholder="0.00" v-model="RemittanceMaximum" clearable>
            <i slot="prefix">￥</i>
          </el-input>
        </div>
        <div class="picker">
          <span>下单时间范围:</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="截止日期"
          ></el-date-picker>
        </div>
        <div style="clear: both;"></div>
        <ul style="margin-top: 20px;">
          <li>
            <el-input placeholder="结算单号" v-model="billNo" clearable></el-input>
          </li>
          <li>
            <el-input placeholder="发票申请单号" v-model="invoiceApplicationNo" clearable></el-input>
          </li>
        </ul>
        <div style="clear: both;"></div>
      </div>
      <div class="data">
        <div class="top">
          <i class="iconfont iconjinridingdanshu"></i>
          <span>数据列表</span>
          <el-button @click="guanliancheck" size="small">
            <i class="iconzengjia iconfont"></i>关联
          </el-button>
        </div>
        <div style="width: 104%;margin-left: -20px;">
          <el-table
            :data="tableData2"
            border
            size="small"
            height="300px"
            @selection-change="handleSelectionChange"
            stripe
          >
            <el-table-column type="selection" fixed></el-table-column>
            <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="createTime" label="下单时间" align="center"></el-table-column>
            <el-table-column prop="projectName" label="项目" align="center"></el-table-column>
            <el-table-column prop="customerName" label="客户" align="center"></el-table-column>
            <el-table-column prop="customerUser" label="采购人" align="center"></el-table-column>
            <el-table-column prop="serverName" label="服务方" align="center"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额￥" align="center"></el-table-column>
            <el-table-column prop="billAmount" label="结算金额￥" align="center"></el-table-column>
            <el-table-column prop="settlementAmount" label="已结算金额￥" align="center"></el-table-column>
            <el-table-column prop="receiveableAmount" label="应收账款￥" align="center"></el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="goNextgoNext(scope.row)">关联</el-button>
                <el-button type="text" size="small" @click="goRecognize(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" v-show="total!=0">
            <el-pagination
              background
              :total="totally"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page="pageNum"
              :page-size="pagesize"
              :page-sizes="[10,20,30,40,50,100,500]"
              layout="total,sizes, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="height: 40px;line-height: 20px;margin-top: -10px;"
          type="primary"
          @click="AssociatedOrderVisible = false"
        >关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="dialogaaa"
      :visible.sync="AddAssociatedOrderVisible"
      width="1000px"
      custom-class="dialog-box"
    >
      <div slot="title" class="dialog-title">
        <span style>添加旧ERP订单</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          class="add"
          @click="addOrder"
          style="height: 40px;line-height: 20px;width: 100px;"
        >新增订单</el-button>
        <div
          style="height: 0px;width: 830px;border: 1px solid #cccccc;margin-left: 30px;margin-top: 20px;margin-bottom: 20px;"
        ></div>
        <ul>
          <li>
            <span>
              <i style="color: red;">*</i>旧ERP订单号
            </span>
            <span>
              <i style="color: red;">*</i>本次认款金额
            </span>
          </li>
        </ul>

        <el-form class="formmatmat" label-width="150px" :rules="rules" ref="form" :model="form">
          <div>
            <div v-for="(item,index) in form.orderdata" :key="index">
              <div class="contain">
                <el-form-item
                  class="items"
                  :prop="'orderdata.'+index+'.olderpNo'"
                  :rules="rules.olderpNo"
                >
                  <el-input
                    v-model="item.olderpNo"
                    placeholder="订单号"
                    style="width: 200px;margin-left: 30px;"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  class="items"
                  :prop="'orderdata.'+index+'.olderpMoney'"
                  :rules="rules.olderpMoney"
                >
                  <el-input
                    v-model="item.olderpMoney"
                    placeholder="0.00"
                    style="width: 200px;margin-left: -50px;"
                  >
                    <i slot="suffix" style="color: #000;">￥</i>
                  </el-input>
                </el-form-item>
                <el-button
                  v-if="index!=0"
                  @click="delle(item, index)"
                  style="
          color: red;
          border-color: red;
          height: 40px;
          line-height: 20px;
          float: right;
          position: absolute;
          right: 180px;"
                >删除</el-button>
                <div style="clear: both;"></div>
              </div>
            </div>
          </div>
          <div
            style="margin-top: 20px;margin-bottom: 20px;width: 200px;height: 40px;display: flex;margin-left: 350px;"
          >
            <el-button style="width: 100px;height: 40px;" type="primary" @click="querenle">确定</el-button>
            <el-button
              style="width: 100px;height: 40px;"
              type="primary"
              @click="AddAssociatedOrderVisible = false"
            >取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  renkuanpage,
  selectcaigouren,
  BankInformation,
  selectfuwufang,
  selectProject,
  selectCustomer,
  renkuan,
  guanliandata
} from "@/api/finance/PaymentInformation";
import { nameList } from "@/api/projectController/projectController";
import { customerNameList, customerUserNameList } from "@/api/order/saleDown";
import { setTimeout } from "timers";
export default {
  name: "FinancialRecognitionOperation",
  inject: ["reload", "close"], //注入依赖
  data() {
    var olderpNooo = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("订单号不为空,请输入订单号"));
      } else if (isNaN(value)) {
        callback(new Error("订单号必须为数字值"));
      } else if (value.length < 5) {
        callback(new Error("订单号至少为5位整数"));
      }
    };
    var olderpMoneyoo = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("本次认款金额不为空,请输入本次认款金额"));
      } else if (isNaN(value)) {
        callback(new Error("本次认款金额必须为数字值"));
      }
    };
    return {
      erp: [],
      olderp: [],
      form: {
        orderdata: [{ olderpNo: "", olderpMoney: "" }]
      },
      total: 1,
      PaymentInformationNumberID: "",
      billNo: "",
      invoiceApplicationNo: "",
      allitem: "",
      dateTime: "",
      cuowuVisible: false,
      textarea: "",
      RemittanceMinimum: "",
      RemittanceMaximum: "",
      customers: "",
      PaymentInformationMan: "",
      fuwufang: "",
      isShow: true,
      confirmClaimParam: [
        {
          accountReceiveableId: "",
          orderId: "",
          orderNo: "",
          receiveableAmount: "",
          settlementAmount: "",
          accountPriceParamList: []
        }
      ],
      claimItemOldParams: [],
      pageNum: 1,
      allproAll: [],
      allcustomAll: [],
      allfuwuAll: [],
      pagesize: 10,
      totally: 0,
      AssociatedOrderVisible: false,
      shanchuVisible: false,
      AddAssociatedOrderVisible: false,
      totalnum: 0,
      PaymentAmount: "11234",
      PaymentInformationID: "123123123",
      yourName: "安静到哈市",
      use: "日哦王瑞",
      tableHeaderStyle: { background: "#FAFAFA" },
      tableData2: [],
      tableData: [],
      arr: [],
      yichangVisible: false,
      roww: {},
      renkuanjine: "",
      kaihuhangarray: [],
      orderId: "",
      allcaigouAll: [],
      loading: false,
      accountName: "",
      gudingdata: [],
      arrarr: [],
      settlementAmount: "",
      receiveableAmount: "",
      amount: "",
      orderNo: "",
      backmoneyid: null,
      yuansu: 0,
      index: 0,
      querenletype: 0,
      tableDatabitianxiang: false,
      dicdia: {},
      pushdata: {},
      rules: {
        olderpNo: [{ validator: olderpNooo, trigger: "blur" }],
        olderpMoney: [{ validator: olderpMoneyoo, trigger: "blur" }]
      }
    };
  },
  activated() {
    // console.log(123)
    if (this.backmoneyid != this.$route.query.id) {
      console.log(this.$auth.user.userPosts[0].organizationId);
      BankInformation([this.$auth.user.userPosts[0].organizationId]).then(
        res => {
          console.log(111, res.data);
          this.kaihuhangarray = res.data;
        }
      );
      this.createdid();
    }
  },
  created() {
    // console.log(232344444)
    // BankInformation([this.$auth.user.userPosts[0].organizationId]).then(res => {
    //     this.kaihuhangarray=res.data;
    //   });
    // this.createdid();
    // let obj = {};
    // function changeValue(obj){
    //   obj.name = 'ConardLi';
    //   obj = {name:'code秘密花园'};
    // }
    // changeValue(obj);
    // this.backmoneyid = this.$route.query.id;
    // renkuanpage(this.$route.query.id).then(res => {
    //   this.PaymentAmount=res.data.receivedAmount;
    //   this.PaymentInformationID=res.data.id;
    //   this.yourName=res.data.accountName;
    //   this.use=res.data.uses;
    // });
  },

  mounted() {},
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    //模糊搜索
    remoteMethod1(query) {
      if (query !== "") {
        nameList({ name: query }).then(res => {
          this.allproAll = res.data;
        });
      } else {
        this.allproAll = [];
      }
    },
    remoteCustomer(query) {
      if (query !== "") {
        if (this.allitem) {
          customerNameList({
            customerName: query,
            projectId: this.allitem
          }).then(res => {
            this.allcustomAll = res.data;
          });
        } else {
          this.$message({
            message: "请选择一个项目",
            type: "warning"
          });
        }
      } else {
        this.allcustomAll = [];
      }
    },
    remotePurchase(query) {
      if (query !== "") {
        if (this.customers) {
          customerUserNameList({
            userName: query,
            customerId: this.customers
          }).then(res => {
            this.allcaigouAll = res.data;
          });
        } else {
          this.$message({
            message: "请选择一个客户",
            type: "warning"
          });
        }
      } else {
        this.allcaigouAll = [];
      }
    },
    closeclose() {
      this.close({
        name: "FinancialRecognitionOperation",
        to: { name: "PaymentInformation", params: { isUpdate: true } }
      });
    },
    createdid() {
      this.backmoneyid = this.$route.query.id;
      renkuanpage(this.$route.query.id).then(res => {
        this.PaymentAmount = res.data.receivedAmount;
        this.PaymentInformationID = res.data.id;
        this.yourName = res.data.accountName;
        this.use = res.data.uses;
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      let data = {};
      // console.log('datatime',this.dateTime)
      if (this.dateTime == null) {
        data = {
          customerId: this.customers,
          customerUserId: this.PaymentInformationMan,

          endOrderAmount: this.RemittanceMaximum,
          orderNo: this.PaymentInformationNumberID,
          billNo: this.billNo,
          invoiceApplicationNo: this.invoiceApplicationNo,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          projectId: this.allitem,
          serverId: this.fuwufang,
          startCreateTime: "",
          endCreateTime: "",
          startOrderAmount: this.RemittanceMinimum,
          paymentReceivedId: this.backmoneyid
        };
      } else {
        data = {
          customerId: this.customers,
          customerUserId: this.PaymentInformationMan,
          endOrderAmount: this.RemittanceMaximum,
          orderNo: this.PaymentInformationNumberID,
          billNo: this.billNo,
          invoiceApplicationNo: this.invoiceApplicationNo,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          projectId: this.allitem,
          serverId: this.fuwufang,
          startCreateTime:
            this.dateTime[0] == undefined ? "" : this.dateTime[0],
          endCreateTime: this.dateTime[1] == undefined ? "" : this.dateTime[1],
          startOrderAmount: this.RemittanceMinimum,
          paymentReceivedId: this.backmoneyid
        };
      }
      guanliandata(data).then(res => {
        this.tableData2 = res.data.items;
        this.totally = res.data.total;
      });
    },
    reset() {
      this.AssociatedOrder();
      this.allproAll = [];
      this.allcustomAll = [];
      this.allcaigouAll = [];
    },
    AddAssociatedOrder() {
      this.$refs["form"].resetFields();
      this.form = { orderdata: [{ olderpNo: "", olderpMoney: "" }] };
      this.AddAssociatedOrderVisible = true;
    },
    onkaihuhangchange(val, scope) {
      for (var i = 0; i < this.tableData[0].kaihuhang.length; i++) {
        if (val == this.tableData[0].kaihuhang[i].accountNo) {
          this.tableData[scope].accountName = this.tableData[0].kaihuhang[
            i
          ].accountName;
          this.tableData[scope].accountNo = this.tableData[0].kaihuhang[
            i
          ].accountNo;
          this.tableData[scope].bank = this.tableData[0].kaihuhang[i].bank;
          this.tableData[scope].bankNo = this.tableData[0].kaihuhang[i].bankNo;
        }
      }
    },
    addOrder() {
      this.form.orderdata.push({
        value: { olderpNo: "", olderpMoney: "" },
        key: Date.now()
      });
    },
    querenle() {
      this.querenletype = 0;
      for (var i = 0; i < this.form.orderdata.length; i++) {
        if (
          this.form.orderdata[i].olderpNo == undefined ||
          this.form.orderdata[i].olderpNo == "" ||
          this.form.orderdata[i].olderpNo.length < 5 ||
          this.form.orderdata[i].olderpMoney == undefined ||
          isNaN(this.form.orderdata[i].olderpNo) ||
          this.form.orderdata[i].olderpMoney == "" ||
          isNaN(this.form.orderdata[i].olderpMoney)
        ) {
          this.querenletype = 1;
        }
      }
      if (this.querenletype == 1) {
        this.$message({
          showClose: false,
          message: "<p>必填项为空或数据格式不正确,请检查当前数据</p> ",
          dangerouslyUseHTMLString: true,
          type: "warning",
          center: true
        });
      } else {
        for (var i = 0; i < this.form.orderdata.length; i++) {
          this.olderp.push({
            olderpNono: this.form.orderdata[i].olderpNo,
            olderpMoneymoney: this.form.orderdata[i].olderpMoney
          });
        }
        this.aaa();
        this.AddAssociatedOrderVisible = false;
      }
    },
    delle(val, index) {
      this.form.orderdata.splice(index, 1);
    },
    goOLDNext(index, val) {
      this.olderp.splice(index, 1);
      this.aaa();
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 4 ||
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex === 7 ||
        columnIndex === 8 ||
        columnIndex === 9
      ) {
        if (this.tableData.length >= 2) {
          var arr = this.tableData;
          var dic = {};
          for (var k in arr) {
            if (!dic[arr[k].orderNo]) {
              console.log([k]);
              dic[arr[k].orderNo] = [k];
            } else {
              dic[arr[k].orderNo][1] = k;
            }
          }
          for (k in dic) {
            if (dic[k].length == 1) {
              delete dic[k];
            }
          }
          for (var key in dic) {
            if (rowIndex == dic[key][0]) {
              var num = dic[key][1] - dic[key][0] + 1;
              return {
                rowspan: num, //合并的行数
                colspan: 1 //合并的列数，设为０则直接不显示
              };
            } else if (rowIndex != dic[key][0]) {
              var numnum = parseInt(dic[key][0]) + 1;
              for (var i = numnum; i <= dic[key][1]; i++) {
                if (rowIndex == i) {
                  return {
                    rowspan: 0, //合并的行数
                    colspan: 0 //合并的列数，设为０则直接不显示
                  };
                }
              }
            }
          }
        }
      }
    },
    addRow(val) {
      var list = {
        orderNo: val.orderNo,
        createTime: val.createTime,
        projectName: val.projectName,
        customerName: val.customerName,
        customerUser: val.customerUser,
        serverName: val.serverName,
        orderAmount: val.orderAmount,
        billAmount: val.billAmount,
        settlementAmount: val.settlementAmount,
        receiveableAmount: val.receiveableAmount,
        renkuanjine: "",

        accountName: "",
        accountNo: "",
        accountReceiveableId: val.accountReceiveableId,
        // amount: val.amount,//本次认款金额
        bank: "",
        bankAccount: "",
        bankNo: "",
        orderId: val.orderId,
        kaihuhang: this.kaihuhangarray
      };
      //查找要插入位置
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i] == val) {
          this.yuansu = i + 1;
        }
      }
      this.tableData.splice(this.yuansu, 0, list);
    },
    goRecognize(row) {
      this.$router.push({name : "OrderDetail", query : {id: row.orderId}});
    },
    aaa(val) {
      this.totalnum = 0;
      for (var i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i].renkuanjine == "" ||
          !this.tableData[i].renkuanjine
        ) {
          this.totalnum = Number(this.totalnum);
        } else {
          this.totalnum =
            Number(this.totalnum) + Number(this.tableData[i].renkuanjine);
        }
      }
      for (var j = 0; j < this.olderp.length; j++) {
        this.totalnum =
          Number(this.totalnum) + Number(this.olderp[j].olderpMoneymoney);
      }
    },
    queren() {
      this.tableDatabitianxiang = false;
      if (this.olderp.length != 0) {
        for (let key in this.olderp) {
          this.claimItemOldParams[key] = {
            amount: "",
            oldErpOrderNo: ""
          };
          console.log("ceshi");
          this.$set(
            this.claimItemOldParams[key],
            "amount",
            this.olderp[key].olderpMoneymoney
          );
          this.$set(
            this.claimItemOldParams[key],
            "oldErpOrderNo",
            this.olderp[key].olderpNono
          );
        }
      } else {
        this.claimItemOldParams = [];
      }
      if (this.tableData.length >= 1) {
        var arr = this.tableData;
        var dic = {};
        for (var k in arr) {
          if (!dic[arr[k].orderNo]) {
            console.log([k]);
            dic[arr[k].orderNo] = [k];
          } else {
            dic[arr[k].orderNo][1] = k;
          }
        }
        this.dicdia = dic;
      }
      this.aaa();
      var change = "";
      var values = 0;
      for (var key in this.dicdia) {
        if (change != key) {
          this.confirmClaimParam[values] = {
            accountReceiveableId: "",
            orderId: "",
            orderNo: "",
            receiveableAmount: "",
            settlementAmount: ""
          };
          (this.confirmClaimParam[values].accountReceiveableId = this.tableData[
            this.dicdia[key][0]
          ].accountReceiveableId),
            (this.confirmClaimParam[values].orderId = this.tableData[
              this.dicdia[key][0]
            ].orderId),
            (this.confirmClaimParam[values].orderNo = this.tableData[
              this.dicdia[key][0]
            ].orderNo),
            (this.confirmClaimParam[values].receiveableAmount = this.tableData[
              this.dicdia[key][0]
            ].receiveableAmount),
            (this.confirmClaimParam[values].settlementAmount = this.tableData[
              this.dicdia[key][0]
            ].settlementAmount);
          this.$set(
            this.confirmClaimParam[values],
            "accountPriceParamList",
            []
          );
          if (this.dicdia[key].length == 2) {
            console.log("拆分-次数");
            for (
              var i = parseInt(this.dicdia[key][0]);
              i <= parseInt(this.dicdia[key][1]);
              i++
            ) {
              var numberer = i - parseInt(this.dicdia[key][0]);
              this.confirmClaimParam[values].accountPriceParamList[numberer] = {
                accountName: "",
                accountNo: "",
                amount: "",
                bank: "",
                bankNo: ""
              };
              this.confirmClaimParam[values].accountPriceParamList[numberer] = {
                accountName: this.tableData[i].accountName,
                accountNo: this.tableData[i].accountNo,
                amount: this.tableData[i].renkuanjine,
                bank: this.tableData[i].bank,
                bankNo: this.tableData[i].bankNo
              };
              console.log("Cishu--次数");
            }
          } else {
            console.log("未拆分--次数");
            this.confirmClaimParam[values].accountPriceParamList[0] = {
              accountName: "",
              accountNo: "",
              amount: "",
              bank: "",
              bankNo: ""
            };
            this.confirmClaimParam[values].accountPriceParamList[0] = {
              accountName: this.tableData[parseInt(this.dicdia[key][0])]
                .accountName,
              accountNo: this.tableData[parseInt(this.dicdia[key][0])]
                .accountNo,
              amount: this.tableData[parseInt(this.dicdia[key][0])].renkuanjine,
              bank: this.tableData[parseInt(this.dicdia[key][0])].bank,
              bankNo: this.tableData[parseInt(this.dicdia[key][0])].bankNo
            };
          }
          values++;
          change = key;
        }
      }
      this.arrarr = [];
      for (var key in this.dicdia) {
        if (this.dicdia[key].length == 2) {
          let renren = 0;
          for (
            var i = this.tableData[this.dicdia[key][0]];
            i <= this.tableData[this.dicdia[key][0]];
            i++
          ) {
            renren += this.tableData[i];
          }
          if (this.tableData[this.dicdia[key][0]].receiveableAmount < renren) {
            this.arrarr.push(this.tableData[this.dicdia[key][0]].orderNo);
          }
        } else {
          if (
            this.tableData[this.dicdia[key][0]].receiveableAmount <
            this.tableData[this.dicdia[key][0]].renkuanjine
          ) {
            this.arrarr.push(this.tableData[this.dicdia[key][0]].orderNo);
          }
        }
      }
      for (var i = 0; i < this.tableData.length; i++) {
        if (
          !this.tableData[i].renkuanjine ||
          !this.tableData[i].accountNo ||
          isNaN(this.tableData[i].renkuanjine)
        ) {
          this.tableDatabitianxiang = true;
        }
      }
      if (this.tableData.length == 0) {
        this.$message({
          message: "关联的订单不能为空,请关联订单后再保存认款",
          type: "warning"
        });
      } else if (this.tableDatabitianxiang) {
        this.$message({
          message:
            "认款金额与收款账号不能为空(认款金额必须是数字类型),请全部填写正确后再保存认款",
          type: "warning"
        });
      } else if (this.arrarr.length != 0) {
        this.cuowuVisible = true;
      } else if (this.totalnum > this.PaymentAmount) {
        this.$message({
          message: "本次认款总金额不可大于回款金额,请检查修正后再保存",
          type: "warning"
        });
      } else if (this.totalnum < this.PaymentAmount - 1) {
        this.$message({
          message:
            "本次认款总金额不可小于回款金额,且差值大于1.00元,请检查修正后再保存",
          type: "warning"
        });
      } else if (this.totalnum == this.PaymentAmount) {
        this.pushdata = {
          claimItemOldParams: this.claimItemOldParams,
          confirmClaimParam: this.confirmClaimParam
        };
        renkuan(this.$route.query.id, this.pushdata).then(res => {
          this.$message({
            message: "认款成功,当前页面信息已成功保存",
            type: "success"
          });
          setTimeout(
            this.close({
              name: "FinancialRecognitionOperation",
              to: { name: "PaymentInformation", params: { isUpdate: true } }
            }),
            2000
          );
        });
      } else if (this.totalnum > this.PaymentAmount - 1) {
        console.log("异常情况");
        this.yichangVisible = true;
      }
    },
    yichangclick() {
      this.pushdata = {
        claimItemOldParams: this.claimItemOldParams,
        claimMemo: this.textarea,
        confirmClaimParam: this.confirmClaimParam
      };
      renkuan(this.$route.query.id, this.pushdata).then(res => {
        this.reload();
      });
      this.yichangVisible = false;
      this.textarea = "";
    },
    onAllChange(query) {
      if (query) {
        selectProject({
          customerName: "",
          projectId: query
        }).then(res => {
          this.allproAll = res.data;
        });
      }
    },
    onAllfuwuChange(query) {
      if (query) {
        selectfuwufang({
          name: query
        }).then(res => {
          this.allfuwuAll = res.data;
        });
      }
    },
    handleSelectionChange(val) {
      this.arr = val;
    },
    onAllchangeChange(query) {
      if (query) {
        this.loading = true;
        selectCustomer({
          name: query
        }).then(res => {
          this.loading = false;
          this.allcustomAll = res.data;
        });
      }
    },
    check() {
      let data = {};
      // console.log('datatime',this.dateTime)
      if (this.dateTime == null) {
        data = {
          customerId: this.customers,
          customerUserId: this.PaymentInformationMan,

          endOrderAmount: this.RemittanceMaximum,
          orderNo: this.PaymentInformationNumberID,
          billNo: this.billNo,
          invoiceApplicationNo: this.invoiceApplicationNo,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          projectId: this.allitem,
          serverId: this.fuwufang,
          startCreateTime: "",
          endCreateTime: "",
          startOrderAmount: this.RemittanceMinimum,
          paymentReceivedId: this.backmoneyid
        };
      } else {
        data = {
          customerId: this.customers,
          customerUserId: this.PaymentInformationMan,
          endOrderAmount: this.RemittanceMaximum,
          orderNo: this.PaymentInformationNumberID,
          billNo: this.billNo,
          invoiceApplicationNo: this.invoiceApplicationNo,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          projectId: this.allitem,
          serverId: this.fuwufang,
          startCreateTime:
            this.dateTime[0] == undefined ? "" : this.dateTime[0],
          endCreateTime: this.dateTime[1] == undefined ? "" : this.dateTime[1],
          startOrderAmount: this.RemittanceMinimum,
          paymentReceivedId: this.backmoneyid
        };
      }
      // console.log(data)
      guanliandata(data).then(res => {
        let statearr = res.data.items;
        // console.log('1',res.data.items,'2',this.tableData)
        for (var i = 0; i < this.tableData.length; i++) {
          // console.log(1111)
          for (var j = 0; j < statearr.length; j++) {
            // console.log(2222)
            if (this.tableData[i].orderNo == statearr[j].orderNo) {
              // console.log(3333)
              statearr.splice(j, 1);
            }
          }
        }
        // console.log('解惑',statearr)
        this.tableData2 = res.data.items;
        // console.log(this.tableData2)
        this.totally = res.data.total;
      });
    },
    // openMessage(){
    //   this.shanchuVisible = false
    //   for (var i = 0; i < this.tableData.length; i++) {
    //     if (this.tableData[i].orderNo==this.roww.orderNo) {
    //       this.tableData2.push(this.tableData2[i])
    //       this.tableData.splice(i,1);
    //     }
    //   }
    //   this.totalnum=0
    //   for (var i = 0; i < this.tableData.length; i++) {
    //     this.totalnum= Number(this.totalnum)+ Number(this.tableData[i].renkuanjine)
    //   }
    // },
    goNext(index, row) {
      // console.log(index)
      // console.log(row)
      this.roww = row;
      this.index = index;
      this.shanchuVisible = true;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      let data = {};
      // console.log('datatime',this.dateTime)
      if (this.dateTime == null) {
        data = {
          customerId: this.customers,
          customerUserId: this.PaymentInformationMan,

          endOrderAmount: this.RemittanceMaximum,
          orderNo: this.PaymentInformationNumberID,
          billNo: this.billNo,
          invoiceApplicationNo: this.invoiceApplicationNo,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          projectId: this.allitem,
          serverId: this.fuwufang,
          startCreateTime: "",
          endCreateTime: "",
          startOrderAmount: this.RemittanceMinimum,
          paymentReceivedId: this.backmoneyid
        };
      } else {
        data = {
          customerId: this.customers,
          customerUserId: this.PaymentInformationMan,
          endOrderAmount: this.RemittanceMaximum,
          orderNo: this.PaymentInformationNumberID,
          billNo: this.billNo,
          invoiceApplicationNo: this.invoiceApplicationNo,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          projectId: this.allitem,
          serverId: this.fuwufang,
          startCreateTime:
            this.dateTime[0] == undefined ? "" : this.dateTime[0],
          endCreateTime: this.dateTime[1] == undefined ? "" : this.dateTime[1],
          startOrderAmount: this.RemittanceMinimum,
          paymentReceivedId: this.backmoneyid
        };
      }
      guanliandata(data).then(res => {
        this.tableData2 = res.data.items;
        this.totally = res.data.total;
      });
    },
    AssociatedOrder() {
      this.customers = "";
      this.PaymentInformationMan = "";
      this.RemittanceMaximum = "";
      this.PaymentInformationNumberID = "";
      this.billNo = "";
      this.invoiceApplicationNo = "";
      this.allitem = "";
      this.fuwufang = "";
      this.dateTime = "";
      this.RemittanceMinimum = "";
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pagesize,
        paymentReceivedId: this.backmoneyid
      };
      guanliandata(data).then(res => {
        if (this.tableData.length != 0) {
          for (var i = 0; i < this.tableData.length; i++) {
            for (var j = 0; j < this.tableData2.length; j++) {
              if (this.tableData2[j].orderNo == this.tableData[i].orderNo) {
                this.tableData2.splice(j, 1);
              }
            }
          }
          this.totally = this.tableData2.length;
        } else {
          this.gudingdata = res.data.items;
          this.tableData2 = res.data.items;
          this.totally = res.data.total;
        }
      });
      //   selectcaigouren({}).then(res => {
      //   this.allcaigouAll=res.data
      // });
      this.AssociatedOrderVisible = true;
    },
    goNextgoNext(row) {
      for (var i = 0; i < this.tableData2.length; i++) {
        if (row.orderNo == this.tableData2[i].orderNo) {
          let newdata = this.tableData2[i];
          this.$set(newdata, "kaihuhang", this.kaihuhangarray);
          // newdata.renkuanjine=newdata.receiveableAmount
          this.$set(newdata, "renkuanjine", newdata.receiveableAmount);
          this.tableData.push(newdata);
          console.log(this.tableData);
          this.tableData2.splice(i, 1);
        }
      }
      this.aaa();
    },
    returnclick() {
      this.shanchuVisible = false;
      this.tableData2.push(this.tableData[this.index]);
      this.tableData.splice(this.index, 1);
      this.aaa();
    },
    guanliancheck() {
      let arr = [];
      if (this.arr.length != 0) {
        for (var i = 0; i < this.tableData2.length; i++) {
          for (var j = 0; j < this.arr.length; j++) {
            if (this.arr[j].orderNo == this.tableData2[i].orderNo) {
              let newdata = this.tableData2[i];
              console.log(newdata);
              this.$set(newdata, "kaihuhang", this.kaihuhangarray);

              this.$set(newdata, "renkuanjine", newdata.receiveableAmount);
              // newdata.renkuanjine = newdata.receiveableAmount;
              arr.push(newdata);

              this.tableData2.splice(i, 1);
            }
          }
        }
        this.tableData = arr.slice(0);

        console.log(this.tableData);
        this.AssociatedOrderVisible = false;
      } else {
        this.$message({
          message: "未选择任何数据,请勾选相关订单后再进行关联",
          type: "warning"
        });
      }
    }
  }
};
</script>
<style  scoped>
.FinancialRecognitionOperation >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
<style lang="less" scoped>
.el-dialog__header {
  padding: 0px;
  height: 60px;
  padding-bottom: 0;
  background: #e4e4e4;
  line-height: 60px;
  padding-left: 10px;
}
.dialogaaa {
  .add {
    margin-right: 90px;
    margin-top: -20px;
    text-align: center;
    color: #1abc9c;
    border: 1px solid #1abc9c;
  }
  .dialog-footer {
    ul {
      display: flex;
      // border:1px solid #000;
      width: 1000px;
      list-style-type: none;
      margin-left: 130px;
      height: 70px;
      li {
        display: flex;
        justify-content: center;
        width: 600px;
        margin-top: 2px;
        margin-left: 0px;
        span {
          justify-content: center;
          margin: 0;
          width: 300px;
          text-align: center;
          font-size: 18px;
          color: #666;
          font-weight: bold;
        }
        .add {
          width: 200px;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}
</style>
<style scoped lang="less">
.formmatmat {
  // border:1px solid red;
  .items {
    float: left;
    width: 400px;
    // border:1px solid green;
  }
}
.yichang {
  .el-textarea {
    width: 500px;
  }
  .textarea-box {
    padding-top: 15px;
    display: flex;
  }
}
.ppp {
  margin-left: 2%;
  font-size: 17px;
  margin-top: 10px;
}
.el-dialog {
  .block {
    height: 50px;
    display: flex;
    line-height: 50px;
    box-sizing: border-box;
    padding-top: 10px;
    border-top: none;
    justify-content: flex-end;
    margin-right: 20px;
  }
  .data {
    .top {
      background-color: #f5f5f5;
      height: 50px;
      width: 104%;
      margin-left: -20px;
      line-height: 50px;
      // .el-button{
      //   display: block;
      //   float: right;
      //   width: 100px;
      //   height: 40px;
      //   text-align: center;
      //   margin-top: 5px;
      //   margin-right: 10px;
      // }
    }
  }
  .el-input {
    display: block;
    float: left;
    width: 150px;
    float: left;
  }
  .el-select {
    display: block;
    float: left;
    width: 150px;
    float: left;
  }
  .input {
    margin-left: 30px;
    margin-top: 20px;
    height: 40px;
    line-height: 40px;
    float: left;
    span {
      display: block;
      float: left;
    }
  }
  .picker {
    margin-left: 30px;
    margin-top: 20px;
    height: 40px;
    line-height: 40px;
    float: left;
    span {
      display: block;
      float: left;
    }
  }

  div {
    font-size: 15px;
    span {
      font-size: 15px;
    }
    // .el-button{
    //   height: 30px;
    //   width: 80px;
    // }
  }
  ul {
    li {
      height: 50px;
      line-height: 50px;
      margin-left: 30px;
      float: left;
      margin-top: -15px;
    }
  }
}
.FinancialRecognitionOperation {
  width: 100%;
  font-size: 12px;
  // background-color: #f3f3f3;
  border: 1px solid #e4e4e4;
  margin-top: 30px;
  clear: both;
  .top {
    width: 96%;
    border: 1px solid #e4e4e4;
    margin-left: 2%;
    margin-top: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e4e4e4;
    .topTop {
      border-bottom: 1px solid #e4e4e4;
      font-size: 17px;
      height: 40px;
      line-height: 40px;
      background-color: #f3f3f3;
      padding-left: 20px;
    }
    .topBottom {
      font-size: 15px;
      padding-bottom: 20px;
      ul {
        li {
          float: left;
          padding-top: 20px;
          margin-left: 70px;
          div {
            float: left;
          }
          p {
            float: left;
            margin-left: 20px;
          }
        }
      }
    }
  }
  .bottom {
    margin-top: 30px;
    margin-bottom: 20px;
    width: 96%;
    border: 1px solid #e4e4e4;
    margin-left: 2%;
    .bottomTop {
      font-size: 17px;
      height: 40px;
      line-height: 40px;
      background-color: #f3f3f3;
      padding-left: 20px;
      display: flex;
      justify-content: space-between;
      .bottomTopRight {
        padding-right: 15px;
      }
    }
    .bottomBottom {
      font-size: 17px;
      line-height: 40px;
    }
    p {
      margin-left: 1%;
      font-size: 17px;
      margin-bottom: 10px;
    }
  }
  .di {
    margin-top: 20px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button {
      background-color: #16a085;
      color: #fff;
    }
    .el-button:hover {
      background-color: #1abc9c;
    }
  }
}
</style>
