<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="iconfont iconcaidan"></i>基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>回款金额：</th>
          <td style="color:red;">{{returnData.receivedAmount}}</td>
          <th>回款信息ID：</th>
          <td>{{returnData.paymentReceivedNo}}</td>
        </tr>
        <tr>
          <th><i></i>对方户名：</th>
          <td>{{returnData.accountName}}</td>
          <th><i></i>用途：</th>
          <td>{{returnData.uses}}</td>
        </tr>
      </table>
    </div>
    <div class="listBox">
      <div class="listBoxTop">

        <span><i class="icon iconfont iconguanliandingdanxinxi"></i>&nbsp;关联新ERP订单</span>
        <div class="listBoxRight">
          <el-button size="small"
                     @click="dialogAffirm=!dialogAffirm,postClaimFindOrderList()"
          >关联订单
          </el-button>
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="claimOrderData.confirmClaimParam"
          :span-method="arraySpanMethod"
          :summary-method='getSum'
          show-summary
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="orderNo"
            label="订单号"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="createTime"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="projectName"
            label="项目"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="customerName"
            label="客户"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="customerUser"
            label="采购人"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="serverName"
            label="服务方"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orderAmount"
            label="订单金额￥"
            align="center">
          </el-table-column>
          <el-table-column
            prop="billAmount"
            label="结算金额￥"
            align="center">
          </el-table-column>
          <el-table-column
            prop="settlementAmount"
            label="已结算金额￥"
            align="center">
          </el-table-column>
          <el-table-column
            prop="receiveableAmount"
            label="应收账款￥(可认款金额)"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="本次认款金额￥"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount" placeholder="字数长度1~50" type="number"
                        @blur="tablechange(scope.row,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="收款账号信息"
            align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.accountName"
                :placeholder="scope.row.accountName?scope.row.accountName+'-'+scope.row.accountNo:'请选择收款账号信息'"
                @change="onkaihuhangchange($event,scope.$index)">
                <el-option
                  v-for="(item,indexs) in bankInformData"
                  :key="item.id"
                  :label="item.accountName+'-'+item.accountNo"
                  :value="item.accountNo">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-button
                @click="clickResolution(scope.row,scope.$index)"
                type="text" size="small">拆分
              </el-button>
              <el-button
                @click="clickisClaim(scope.row,scope.$index)"
                type="text" size="small">删除
              </el-button>
              <el-button
                @click="goOrderDetaills(scope.row)"
                type="text" size="small">详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <span><i class="icon iconfont iconguanliandingdanxinxi"></i>&nbsp;关联旧ERP订单</span>
        <div class="listBoxRight">
          <el-button size="small"
                     @click="dialogOld=!dialogOld"
          >添加
          </el-button>
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="claimOrderData.claimItemOldParams"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="oldErpOrderNo"
            label="订单号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="本次认款金额￥"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount" placeholder="字数长度1~50" type="number"
                        @blur="oldtablechange(scope.row,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button
                @click="depople(scope.$index)"
                type="text" size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="ppp">回款金额：￥{{returnData.receivedAmount}}</p>
        <p class="ppp">本次认款总金额：￥{{claimAmountTotal}}</p>
        <el-button type="primary" @click="putClaimConfirm()" style="float: right;margin: 10px 10px;">确定</el-button>
        <el-button type="primary" @click="dialogclose=true" style="float: right;margin: 10px 10px;">取消</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogAffirm" width="80%" custom-class="dialog-box">
      <div class="message-box">
        <div class="filterBox">
          <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
            <div class="rightBox">
              <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up"></i>收起筛选</span>
              <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
              <el-button size="small" class="w80 h40" @click="postClaimFindOrderList()">查询结果</el-button>
              <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
            </div>
          </div>
          <el-collapse-transition>
            <div class="homeBoxBottom" v-show="isShow">
              <el-input
                placeholder="订单号"
                v-model="query.orderNo"
                clearable>
              </el-input>
              <el-select
                v-model="query.projectId"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入项目"
                :remote-method="remoteMethod1"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select
                style="max-width: 200px;"
                v-model="query.customerId"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入客户"
                :remote-method="remoteCustomer"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select
                style="max-width: 200px;"
                v-model="query.customerUserId"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入采购人"
                :remote-method="remotePurchase"
              >
                <el-option
                  v-for="item in purchaseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <br/>
              <span style="margin-left:20px;">订单金额：</span>
              <el-input
                style="width: 120px;"
                type="number"
                placeholder="0.00"
                v-model="query.startOrderAmount"
                clearable>
              </el-input>
              <span>-</span>
              <el-input
                style="width: 120px;"
                type="number"
                placeholder="0.00"
                v-model="query.endOrderAmount"
                clearable>
              </el-input>
              <span style="margin-left:20px;">下单时间范围：</span>
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-input
                placeholder="结算单号"
                v-model="query.billNo"
                clearable>
              </el-input>
              <el-input
                placeholder="发票号码"
                v-model="query.invoiceApplicationNo"
                clearable>
              </el-input>
            </div>
          </el-collapse-transition>
        </div>
        <div class="listBox">
          <div class="listBoxTop">
            <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;关联订单</span>
            <div class="listBoxRight">
              <el-button size="small"
                         @click="clickSelectionClaim()"
              >批量关联
              </el-button>
            </div>
            <el-table
              :max-height="dataListHeight"
              :data="returnOrderData.items"
              @selection-change="handleSelectionChange"
              border
              stripe
              style="width: 100%"
              size="small">
              <el-table-column
                type="selection"
                align="center"
                width="55">
              </el-table-column>
              <el-table-column
                prop="orderNo"
                label="订单号"
                align="center">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="createTime"
                label="下单时间"
                align="center">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="projectName"
                label="项目"
                align="center">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="customerName"
                label="客户"
                align="center">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="customerUser"
                label="采购人"
                align="center">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="serverName"
                label="服务方"
                align="center">
              </el-table-column>
              <el-table-column
                prop="orderAmount"
                label="订单金额￥"
                align="center">
              </el-table-column>
              <el-table-column
                prop="billAmount"
                label="结算金额￥"
                align="center">
              </el-table-column>
              <el-table-column
                prop="settlementAmount"
                label="已结算金额￥"
                align="center">
              </el-table-column>
              <el-table-column
                prop="receiveableAmount"
                label="应收账款￥"
                align="center">
              </el-table-column>
              <el-table-column
                label="操作"
                width="180"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="clickClaim(scope.row,scope.$index)"
                    type="text" size="small">关联
                  </el-button>
                  <el-button
                    @click="goOrderDetaills(scope.row)"
                    type="text" size="small">详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <span class="demonstration"></span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              style="height: 38px;"
              :total=returnOrderData.total>
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogAffirm=false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPass" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">错误提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box" v-if="dialogPassData==1">存在某些订单的本次认款金额（拆分认款记总数）大于应收账款</div>
        <div class="first-step-box" v-if="dialogPassData==2">回款金额小于本次认款总金额</div>
        <div class="first-step-box" v-if="dialogPassData==3">回款金额大于本次认款总金额，且差值大于1.00元。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPass = false">取 消</el-button>
        <el-button type="primary" @click="dialogPass=false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogclose" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">取消确认</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">取消后，当前填写的信息将不保存，确定取消？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogclose = false">取 消</el-button>
        <el-button type="primary" @click="close()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReject" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">异常认款</span>
      </div>
      <div class="message-box">
        <div class="first-step-box"> 回款金额大于本次认款总金额，且差值小于等于1.00元。</div>
        <el-form :model="claimOrderData" :rules="rules" ref="ruleForm">
          <el-form-item label="请输入异常原因：" prop="claimMemo">
            <el-input type="textarea" v-model="claimOrderData.claimMemo" placeholder="请输入200字以内"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReject = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogOld" width="800px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">添加旧ERP订单</span>
      </div>
      <div class="message-box">
        <el-button type="primary" @click="poplepush()" plain>新增</el-button>
        <el-form :model="addOld" ref="ruleFormoodl" label-width="160px"
                 class="demo-ruleForm">
          <div class="addParamgroupBox">
            <el-form-item style="margin-top: 20px">
              <span style="width: 186px;ont-size: 16px;font-weight: 600;text-align: center;display: inline-block;"><i
                style="color: red;">*</i>旧ERP订单号</span>
              <span style="width: 186px;font-size: 16px;font-weight: 600;text-align: center;display: inline-block;"><i
                style="color: red;">*</i>本次认款金额</span>
            </el-form-item>
            <el-form-item
              v-for="(item,index) in addOld.addOldOrder"
              :key="index">
              <el-form-item
                style="display: inline-block;"
                :prop="'addOldOrder.' + index + '.oldErpOrderNo'"
                :rules="oldOrderRules.checkorder
              ">
                <el-input v-model="item.oldErpOrderNo"
                          style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item
                style="display: inline-block;"
                :prop="'addOldOrder.' + index + '.amount'"
                :rules="oldOrderRules.checkmoney">
                <el-input v-model="item.amount" style="width: 100%"></el-input>
              </el-form-item>
              <el-button type="primary" v-if="index!=0"
                         @click="addDepople(index)" plain>删除
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReject = false">取 消</el-button>
        <el-button type="primary" @click="submitFormAddOld('ruleFormoodl')">确 定</el-button>
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
    renkuan
  } from '@/api/finance/PaymentInformation'
  import {
    nameList,
  } from '@/api/projectController/projectController'
  import {
    customerNameList,
    customerUserNameList,
    consigneeInformation,
    likeOrderItemList,
    addOrder,
  } from '@/api/order/saleDown'
  import {
    putClaimBackPaymentrReceived,
    getcClaimPage,
    putClaimConfirm,
    getcClaimDetail,
    postClaimFindOrderList,
    postClaimList,
    getcClaimStatusCount,
  } from '@/api/payment/claimList'
  import {projectName, postCustomerNameOptions} from "@/api/common/commonApi"
  import {returnFloat} from "@/utils";

  export default {
    name: "Claim",
    inject: ['reload', 'imgurl', 'close'],//注入依赖
    data() {
      return {
        bankInformData: [{
          "accountName": "string",
          "accountNo": "string",
          "bank": "string",
          "bankNo": "string",
          "id": 0,
          "isDefault": 0,
          "organizationId": 0,
          "organizationName": "string"
        }],
        abnormalOrder: [],
        oldOrderRules: {
          checkmoney: [
            //{ required: true, message: '请填写认款金额', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('认款金额不能为空'));
                }
                setTimeout(() => {
                  if (value.toString().split(".")[1]) {
                    if (value.toString().split(".")[1].length > 2) {
                      callback(new Error('最多只能两位小数'));
                    } else {
                      callback();
                    }
                  }else {
                    callback();
                  }
                }, 500);
              }
            }
          ],
          checkorder: [
            //{ required: true, message: '请填写认款金额', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('订单号不能为空'));
                }
                setTimeout(() => {
                  if (value.length < 5) {
                    callback(new Error('订单号最少为5位'));
                  } else {
                    callback();
                  }
                }, 500);
              }
            }
          ]

        },
        rules: {
          claimMemo: [
            {required: true, message: '请输入异常原因', trigger: 'change'}
          ],
        },
        orderAmountTotal: '',
        options3: [],
        customerOptions: [],
        purchaseOptions: [],
        getValue: '',
        postType: '全部',
        btnData: [{
          "statusName": "全部",
        }, {
          "statusName": "待认款",
        }, {
          "statusName": "已完成",
        }],
        //查询 "customerId": 0,
        query: {
          customerId: null,
          customerUserId: null, //采购人id
          endCreateTime: "",
          startCreateTime: "",
          startOrderAmount: null,
          endOrderAmount: null,
          paymentReceivedId: this.$route.query.id,
          orderNo: null,
          pageNum: 1,
          pageSize: 10,
          projectId: null,
          serverId: null,
          billNo: null,
          invoiceApplicationNo: null,

        },
        //btn选中
        active: 0,
        dateValue: '',
        claimAmountTotal: 0,//认款总金额
        multipleSelection: [],
        //删选显示
        isShow: true,
        dialogOld: false,
        dialogAffirm: false,
        dialogPass: false,
        dialogPassData: null,
        dialogReject: false,
        dialogclose: false,
        SelectionChangeId: [],
        SelectionChangeVal: [],
        returnData: {
          "accountName": "string",
          "id": 10,
          "paymentReceivedNo": "string",
          "receivedAmount": 1110,
          "uses": "string"
        },
        returnOrderData: {
          "items": [],
          "offset": 0,
          "pageNum": 0,
          "pageSize": 0,
          "total": 0
        },
        returnOrderData1: {
          "items": [
            {
              "accountReceiveableId": 2233,
              "billAmount": 0,
              "amount": 0,
              "createTime": "2019-04-01T09:28:13.522Z",
              "customerName": "string",
              "customerUser": "string",
              "orderAmount": 0,
              "orderId": 40,
              "orderNo": 0,
              "projectName": "string",
              "receiveableAmount": 0,
              "serverName": "string",
              "settlementAmount": 0
            }
          ],
          "offset": 0,
          "pageNum": 0,
          "pageSize": 0,
          "total": 0
        },
        addOld: {
          "addOldOrder": [
            {
              "amount": null,
              "oldErpOrderNo": ""
            }
          ],
        }
        ,
        claimOrderData: {
          "claimItemOldParams": [],
          "claimMemo": null,
          "confirmClaimParam": [
//            {
//              "accountName": "string",
//              "accountNo": "string",
//              "accountReceiveableId": 0,
//              "amount": 0,
//              "bank": "string",
//              "bankAccount": "string",
//              "bankNo": "string",
//              "billAmount": 0,
//              "createTime": "2019-09-08T04:07:39.096Z",
//              "customerName": "string",
//              "customerUser": "string",
//              "orderAmount": 0,
//              "orderId": 0,
//              "orderNo": 110,
//              "projectName": "string",
//              "receiveableAmount": 10,
//              "serverName": "string",
//              "settlementAmount": 0
//            }, {
//              "accountName": "string",
//              "accountNo": "string",
//              "accountReceiveableId": 0,
//              "amount": 0,
//              "bank": "string",
//              "bankAccount": "string",
//              "bankNo": "string",
//              "billAmount": 0,
//              "createTime": "2019-09-08T04:07:39.096Z",
//              "customerName": "string",
//              "customerUser": "string",
//              "orderAmount": 0,
//              "orderId": 0,
//              "orderNo": 220,
//              "projectName": "string",
//              "receiveableAmount": 5,
//              "serverName": "string",
//              "settlementAmount": 0
//            }

          ]
        },
        backmoneyid: '',

      }
    },
    computed: {
      dataListHeight() {
        return this.$store.getters.dataListHeight;
      }
    },
    activated() {
      if (this.backmoneyid != this.$route.query.id) {
        this.getcClaimPage();
        this.postClaimFindOrderList();
        this.claimAmountTotalFun()
        //BankInformation([2]).then(res => {
        BankInformation([this.$auth.user.userPosts[0].organizationId]).then(res => {
          this.bankInformData = res.data;
          this.backmoneyid = this.$route.query.id;
        });
      }
    },
    mounted() {
      this.backmoneyid = this.$route.query.id;
      this.getcClaimPage();
      this.postClaimFindOrderList();
      this.claimAmountTotalFun()
      BankInformation([this.$auth.user.userPosts[0].organizationId]).then(res => {
        //BankInformation([2]).then(res => {
        console.log(res.data);
        this.bankInformData = res.data;
      });
    },
    methods: {
      //新增联系人
      poplepush() {
        this.addOld.addOldOrder.push({oldErpOrderNo: '', amount: null,})
      },
      addDepople(index) {
        this.addOld.addOldOrder.splice(index, 1)
      },
      depople(index) {
        this.claimOrderData.claimItemOldParams.splice(index, 1)
      },
      //重置
      reset() {
        this.query = {
          customerId: null,
          customerUserId: null, //采购人id
          endCreateTime: "",
          startCreateTime: "",
          startOrderAmount: null,
          endOrderAmount: null,
          paymentReceivedId: this.$route.query.id,
          orderNo: null,
          pageNum: 1,
          pageSize: 10,
          projectId: null,
          serverId: null,
          billNo: null,
          invoiceApplicationNo: null,
        },
          this.dateValue="",
          this.postClaimFindOrderList()
      },
      onkaihuhangchange(val, scope) {
        for (var i = 0; i < this.bankInformData.length; i++) {
          if (val == this.bankInformData[i].accountNo) {
            this.claimOrderData.confirmClaimParam[scope].accountName = this.bankInformData[i].accountName;
            this.claimOrderData.confirmClaimParam[scope].accountNo = this.bankInformData[i].accountNo;
            this.claimOrderData.confirmClaimParam[scope].bank = this.bankInformData[i].bank;
            this.claimOrderData.confirmClaimParam[scope].bankNo = this.bankInformData[i].bankNo;
          }
        }
        console.log(this.claimOrderData.confirmClaimParam);
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9) {
          if (this.claimOrderData.confirmClaimParam.length >= 2) {
            var arr = this.claimOrderData.confirmClaimParam
            var dic = {}
            for (var k in arr) {
              if (!dic[arr[k].orderNo]) {
                ;dic[arr[k].orderNo] = [k]
              }
              else {
                dic[arr[k].orderNo][1] = k
              }
            }
            for (k in dic) {
              if (dic[k].length == 1) {
                delete(dic[k])
              }
            }
            for (var key in dic) {
              if (rowIndex == dic[key][0]) {
                var num = dic[key][1] - dic[key][0] + 1;
                return {
                  rowspan: num,　　　　　//合并的行数
                  colspan: 1 //合并的列数，设为０则直接不显示
                };
              } else if (rowIndex != dic[key][0]) {
                var numnum = parseInt(dic[key][0]) + 1
                for (var i = numnum; i <= dic[key][1]; i++) {
                  if (rowIndex == i) {
                    return {
                      rowspan: 0,　　　　　//合并的行数
                      colspan: 0 //合并的列数，设为０则直接不显示
                    };
                  }
                }
              }
            }
          }
        }
      },
      //点击拆分
      clickResolution(val, index) {
        var puthData = {
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
          amount: val.amount,//本次认款金额
          bank: "",
          bankAccount: val.bankAccount,
          bankNo: "",
          orderId: val.orderId,
        }
        //查找要插入位置
        let yuansu = '';
        for (var i = 0; i < this.claimOrderData.confirmClaimParam.length; i++) {
          if (this.claimOrderData.confirmClaimParam[i] == val) {
            yuansu = i + 1;
          }
        }
        this.claimOrderData.confirmClaimParam.splice(yuansu, 0, puthData)
        this.claimAmountTotalFun()
      },
      //确认认款
      putClaimConfirm() {


        var arr1 = this.claimOrderData.confirmClaimParam.filter(function (element, index, self) {
          return self.findIndex(el => el.orderNo == element.orderNo) === index
        })
        for (let j = 0; j < arr1.length; j++) {
          arr1[j].accountPriceParamList = [];
        }
        for (let i = 0; i < this.claimOrderData.confirmClaimParam.length; i++) {
          for (let j = 0; j < arr1.length; j++) {
            if (this.claimOrderData.confirmClaimParam[i].orderNo == arr1[j].orderNo) {
              arr1[j].accountPriceParamList.push({
                "accountName": this.claimOrderData.confirmClaimParam[i].accountName,//开户名
                "accountNo": this.claimOrderData.confirmClaimParam[i].accountNo,//开户账号
                "amount": this.claimOrderData.confirmClaimParam[i].amount,//本次认款金额
                "bank": this.claimOrderData.confirmClaimParam[i].bank,//开户行
                "bankNo": this.claimOrderData.confirmClaimParam[i].bankNo//银行编号
              })
            }
          }
        }

        let postData = {
          claimItemOldParams: this.claimOrderData.claimItemOldParams,
          "claimMemo": this.claimOrderData.claimMemo,//认款备注
          "confirmClaimParam": arr1
        }

        //条件判断
        let _this = this;

        function claimCondition(val) {
          _this.dialogPassData = null;
          for (var i = 0; i < postData.confirmClaimParam.length; i++) {
            let amountSum = 0;//每个订单的认款金额
            let receiveableAmountSum = 0;//每个订单的应收账款
            for (var j = 0; j < postData.confirmClaimParam[i].accountPriceParamList.length; j++) {
              amountSum += postData.confirmClaimParam[i].accountPriceParamList[j].amount;
            }
            receiveableAmountSum = postData.confirmClaimParam[i].receiveableAmount;
            switch (val) {
              case 0://正常认款-某订单本次认款金额小于等于应收账款
                if (amountSum <= receiveableAmountSum) {
                  return true
                } else {
                  return false
                }
                break;
              case 1://正常认款-回款金额等于本次认款总金额
                if (_this.claimAmountTotal == _this.returnData.receivedAmount) {
                  return true
                } else {
                  return false
                }
                break;
              case 2://异常认款（错误认款）-回款金额大于本次认款总金额
                if (_this.returnData.receivedAmount > _this.claimAmountTotal) {
                  return true
                } else {
                  return false
                }
                break;
              case 3://异常认款-回款金额 与本次认款总金额差值小于等于1.00元。
                if ((_this.returnData.receivedAmount - _this.claimAmountTotal) <= 1) {
                  return true
                } else {
                  return false
                }
                break;
              case 4://错误认款 存在某些订单的本次认款金额（拆分认款记总数）大于应收账款
                if (amountSum > receiveableAmountSum) {
//                  alert(amountSum);
//                  alert(receiveableAmountSum)
                  return true
                } else {
                  return false
                }
                break;
              case 5://错误认款-回款金额小于本次认款总金额
                if (_this.returnData.receivedAmount < _this.claimAmountTotal) {
//                  alert(this.returnData.receivedAmount);
//                  alert(_this.claimAmountTotal)
                  return true
                } else {
                  return false
                }
                break;
              case 6://错误认款-回款金额 与本次认款总金额差值大于1.00元。
                if ((_this.returnData.receivedAmount - _this.claimAmountTotal) > 1) {
                  return true
                } else {
                  return false
                }
                break;
            }
          }
        }


        if (this.claimOrderData.confirmClaimParam == [] || this.claimOrderData.confirmClaimParam.length == 0 || !this.claimOrderData.confirmClaimParam) {
          this.$message({
            message: '认款列表不可为空',
            type: 'warning',
          })
        } else if (claimCondition(4) || claimCondition(5) || (claimCondition(2) && claimCondition(6))) {
          //错误认款
          if (claimCondition(4)) {
            this.dialogPassData = 1;
          } else if (claimCondition(5)) {
            this.dialogPassData = 2;
          } else if (claimCondition(2) && claimCondition(6)) {
            this.dialogPassData = 3;
          }
          this.dialogPass = true;
        } else if (claimCondition(0) && (claimCondition(2) && claimCondition(3))) {
          //异常认款
          this.dialogReject = true;
        } else if (claimCondition(0) && claimCondition(1)) {
          putClaimConfirm(
            this.$route.query.id,
            postData
          )
            .then((res) => {
              if (res.code == '000000') {
                this.$message({
                  message: '认款成功',
                  type: "success",
                });
                this.claimOrderData.confirmClaimParam = [];
              } else if (res.data == '0') {
                this.$message({
                  message: '认款失败',
                  type: 'warning',
                })
              }
            }).catch(err => {
            console.log(err)
          })
        }


      },
      //
      submitFormAddOld(formName) {
        console.log(formName);

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.claimOrderData.claimItemOldParams = this.claimOrderData.claimItemOldParams.concat(this.addOld.addOldOrder);
            this.addOld.addOldOrder = [{
              "amount": null,
              "oldErpOrderNo": ""
            }];
            this.dialogOld = false;
          }
        })
      },
      //确认认款提交
      submitForm(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            var arr1 = this.claimOrderData.confirmClaimParam.filter(function (element, index, self) {
              return self.findIndex(el => el.orderNo == element.orderNo) === index
            })
            for (let j = 0; j < arr1.length; j++) {
              arr1[j].accountPriceParamList = [];
            }
            for (let i = 0; i < this.claimOrderData.confirmClaimParam.length; i++) {
              for (let j = 0; j < arr1.length; j++) {
                if (this.claimOrderData.confirmClaimParam[i].orderNo == arr1[j].orderNo) {
                  arr1[j].accountPriceParamList.push({
                    "accountName": this.claimOrderData.confirmClaimParam[i].accountName,//开户名
                    "accountNo": this.claimOrderData.confirmClaimParam[i].accountNo,//开户账号
                    "amount": this.claimOrderData.confirmClaimParam[i].amount,//本次认款金额
                    "bank": this.claimOrderData.confirmClaimParam[i].bank,//开户行
                    "bankNo": this.claimOrderData.confirmClaimParam[i].bankNo//银行编号
                  })
                }
              }
            }

            let postData = {
              "claimMemo": this.claimOrderData.claimMemo,//认款备注
              "confirmClaimParam": arr1
            }
            putClaimConfirm(
              this.$route.query.id,
              postData
            )
              .then((res) => {
                if (res.code == '000000') {
                  this.$message({
                    message: '异常认款成功',
                    type: "success",
                  });
                  this.claimOrderData.confirmClaimParam = [];
                  this.dialogReject = false;
                } else if (res.data == '0') {
                  this.$message({
                    message: '异常认款失败',
                    type: 'warning',
                  })
                }
              }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //合计
      claimAmountTotalFun() {
        let arr = null;
        for (var i = 0; i < this.claimOrderData.confirmClaimParam.length; i++) {
          console.log(this.claimOrderData.confirmClaimParam[i].amount);
          if (this.claimOrderData.confirmClaimParam[i].amount >= 0) {
            arr += parseFloat(this.claimOrderData.confirmClaimParam[i].amount)
          }
        }
        if (arr || arr == 0) {
          this.claimAmountTotal = arr;
        }
      },
      getSum(param) {
        console.log(param);
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => { //这步是为了让最后一行出现 合计 这一行，并且最后一行第一列出现 合计 二字。合计的字可以在这里更改
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          switch (column.property) {
            case 'amount':    //这里是需要计算的列所绑定的prop的值
              console.log(column.property);
              sums[index] = (this.claimAmountTotal) + '元' //这是计算公式，因为我是直接拿值，所以可以直接填
              break
            default: //这个默认不要忘记写
              break
          }
        })
        return sums
      },
      oldtablechange(row, index){
        if (row.amount.toString().split(".")[1] ){
          if ( row.amount.toString().split(".")[1].length > 2){
            let aa = Number(row.amount).toFixed(2);
            this.claimOrderData.claimItemOldParams[index].amount=aa;
          }
        }
        if (!row.amount || row.amount <= 0) {
          row.amount = 0
        }

      },
      tablechange(row, index) {
        this.claimOrderData.confirmClaimParam[index].amount = row.amount
        console.log(this.claimOrderData.confirmClaimParam[index]);
        if (!row.amount || row.amount <= 0) {
          row.amount = 0
        }
      },
      //已关联的删除事件
      clickisClaim(row, index) {
        this.claimOrderData.confirmClaimParam.splice(index, 1);
      },

      //跳转详情
      goOrderDetaills(row) {
        this.$router.push({
          name: 'OrderDetail',
          query: {
            id: row.orderId
          }
        });
      },
      //获取认款信息
      getcClaimPage() {
        getcClaimPage(
          this.$route.query.id
        )
          .then((res) => {
            console.log(res)
            this.returnData = res.data;
          }).catch(err => {
          console.log(err)
        })
      },
      //获取关联订单列表r
      postClaimFindOrderList() {
        console.log(this.query);
        //请求列表
        postClaimFindOrderList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnOrderData = res.data
        }).catch(err => {
          console.log(err)
        });
      },
      //模糊搜索
      remoteMethod1(query) {
        if (query !== '') {
          nameList({name: query}).then(res => {
            this.options3 = res.data
          })
        } else {
          this.options3 = [];
        }
      },
      remoteCustomer(query) {
        if (query !== '') {
          if (this.query.projectId) {
            customerNameList({customerName: query, projectId: this.query.projectId}).then(res => {
              this.customerOptions = res.data
            })
          } else {
            this.$message({
              message: '请选择一个项目',
              type: 'warning',
            })
          }
        } else {
          this.customerOptions = [];
        }
      },
      remotePurchase(query) {
        if (query !== '') {
          if (this.query.customerId) {
            customerUserNameList({username: query, customerId: this.query.customerId}).then(res => {
              this.purchaseOptions = res.data
            })
          } else {
            this.$message({
              message: '请选择一个客户',
              type: 'warning',
            })
          }
        } else {
          this.purchaseOptions = [];
        }
      },
      userNamechange(value) {
        let a = this.options3.filter((item, index) => {
          return item.id == value
        })
        this.realName = a[0].realName
      },

      //多选
      toggleSelection(rows) {
        console.log(rows);
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      //点击关联
      clickClaim(row, index) {
        let _this = this;
        this.returnOrderData.items.splice(index, 1);
        if (crazy(row.accountReceiveableId)) {
          _this.claimOrderData.confirmClaimParam.push(row)
          this.$message({
            message: '关联成功',
            type: "success",
          });
        } else {
          alert('已经有此数据')
        }

        ///判断有没有
        function crazy(chl) {
          for (var i = 0; i < _this.claimOrderData.confirmClaimParam.length; i++) {
            if (chl == _this.claimOrderData.confirmClaimParam[i].accountReceiveableId) {
              return false;
            }
          }
          return true;
        }
      },
      //批量关联
      clickSelectionClaim() {

        let _this = this;
        let SelectionChange = this.SelectionChangeId;//选择的accountReceiveableId
        let SelectionChangeVal = this.SelectionChangeVal;//选择的accountReceiveableId

        if (SelectionChange && SelectionChange.length > 0) {
          function crazy(chl) {
            for (var i = 0; i < _this.claimOrderData.confirmClaimParam.length; i++) {
              if (chl == _this.claimOrderData.confirmClaimParam[i].accountReceiveableId) {
                return false;
              }
            }
            return true;
          }

          for (var i = 0; i < SelectionChangeVal.length; i++) {
            if (crazy(SelectionChangeVal[i].accountReceiveableId)) {
              _this.claimOrderData.confirmClaimParam.push(SelectionChangeVal[i])
            } else {
              alert('已经有此数据')
            }
          }
          for (var i = 0; i < SelectionChange.length; i++) {
            this.returnOrderData.items.forEach(function (item, index) {
              if (item.accountReceiveableId == SelectionChange[i]) {
                console.log(index);
                console.log(SelectionChange[i])
                _this.returnOrderData.items.splice(index, 1)
              }
              ;
            })
          }
          console.log(this.returnOrderData.items);
          this.$message({
            message: '批量关联成功',
            type: "success",
          });
        } else {
          this.$message({
            message: '请选择订单',
            type: 'warning',
          })
        }

      },
      handleSelectionChange(val) {
        //选择的数据
        let ccc = [];
        val.forEach(function (item) {
          ccc.push(item.accountReceiveableId)
        })
        this.SelectionChangeId = ccc;
        this.SelectionChangeVal = val;

      },
      //筛选show
      showHelp() {
        this.isShow = !this.isShow;
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postClaimFindOrderList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postClaimFindOrderList();
      },
      //关闭当前页面

      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.id;
        // 将数据放在当前组件的数据内
        this.msg = routerParams;
        console.log(this.msg);
      }
    },
    watch: {
      //监听时间范围
      dateValue(a, b) {
        if (this.dateValue != "" && this.dateValue) {
          this.query.startCreateTime = this.dateValue[0];
          this.query.endCreateTime = this.dateValue[1]
        } else {
          this.query.startCreateTime = null;
          this.query.endCreateTime = null
        }
      },
      'claimOrderData.confirmClaimParam': {
        handler(newVal, oldVal) {
          this.claimAmountTotalFun()
        },
        deep: true
      },
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route':
        'getParams'
    }
    ,
    filters: {
      //时间截取字符串
      formatDate: function (value) {
        return value.substring(0, 10);
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
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
      height: 48px;
      float: right;
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #BCBCBC;
        cursor: pointer;
        font-size: 12px;
      }
      span:hover {
        color: #303133;
      }
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 200px;
        height: 56px;
        line-height: 56px;
        margin-left: 10px;
      }
      .el-select {
        margin-left: 10px;
        line-height: 56px;
      }
    }
  }

  .ppp {
    margin-left: 2%;
    font-size: 17px;
    margin-top: 10px;
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
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .el-button {
        width: 80px;
        height: 30px;
      }
    }
    .el-table {
      margin-top: -2px;
      span {
        font-size: 12px;
      }
      .el-button {
        font-size: 12px;
      }
    }
    .el-button {

    }
  }

  .detaillBox {
    width: 100%;
    padding-top: 10px;
    .detaillTable {
      border: 1px solid #d1d1d1;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      table {
        width: 90%;
        margin: 20px auto;
        td, th {
          border: 1px solid #d1d1d1;
          font-size: 12px;
          height: 53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th {
          background: #f5f7fa;
          color: #303133;
          text-align: right;
          width: 20%;
          i {
            color: red;
          }
        }
        td {
          color: #666666;
          text-align: left;
          padding-left: 10px;
          width: 30%;
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
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .el-button {
          width: 80px;
          height: 30px;
        }
      }
      .el-table {
        margin-top: -2px;
        span {
          font-size: 12px;
        }
        .el-button {
          font-size: 12px;
        }
      }
    }
    .detaillTable2 {
      border: 1px solid #d1d1d1;
      border-top: none;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-table {
        margin: 20px auto;
        width: 90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: right;
        margin: 10px 20px;
      }
    }
  }

  .block {
    margin-top: 10px;
    margin-right: 20px;
    text-align: right;
  }

  .dialog-box {
    position: relative;
    .tree {
      display: flex;
      justify-content: center;
    }
    .message-box {
      padding: 0px 20px;
      font-size: 14px;
      color: #666;
      .el-input {
      }
      .first-step-box {
        padding: 20px 0;
        .first-step {
          color: red;
          font-size: 18px;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .second-step-box {
        display: flex;
        padding: 20px 0;
        align-items: center;
        .input-box-file {
          width: 120px;
          margin-left: 20px;
          position: relative;
          cursor: pointer;
          .input-button {
            width: 120px;
            height: 30px;
            border: 1px solid #d1d1d1;
            color: #999;
            border-radius: 4px;
            line-height: 30px;
            font-size: 14px;
            text-indent: 10px;
            cursor: pointer;
          }
        }
      }
      .tip {
        display: flex;
        color: red;
        line-height: 30px;
      }

    }
    .dialog-title {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 50px;
      background-color: #f3f3f3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      .reject-title {
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
    }
    .dialog-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #d1d1d1;
      padding: 10px;
      box-sizing: border-box;
    }
  }
</style>
