<template>
  <div class="returnOrderBox">
    <div class="buttonBox">
      <el-button size="small"
                 v-for="item,index in btnData"
                 :key="index"
                 :class="{btnactive:index==active}"
                 @click="btnActive(index,item.statusName)">
        {{item.statusName}}({{item.statusCount}})
      </el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up"></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="queryResult()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">回款信息编号：</span>
          <el-input
            placeholder="回款信息编号"
            v-model="query.paymentReceivedNo"
            clearable>
          </el-input>
          <span style="margin-left:20px;">对方户名：</span>
          <el-input
            placeholder="对方户名"
            v-model="query.accountName"
            clearable>
          </el-input>
          <span style="margin-left:20px;">流水号：</span>
          <el-input
            placeholder="流水号"
            v-model="query.serialNumber"
            clearable>
          </el-input>
          <span style="margin-left:20px;">组织机构：</span>
          <el-select
            clearable
            v-model="query.organizationId"
            filterable
            remote
            placeholder="组织机构"
            :remote-method="organizationRemoteMethod"
            :loading="loading">
            <el-option
              v-for="item in organizationOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <br/>
          <span style="margin-left:20px;">回款金额：</span>
          <el-input
            style="width: 120px;"
            type="number"
            placeholder="0.00"
            v-model="query.startReceivedAmount"
            clearable>
          </el-input>
          <span>-</span>
          <el-input
            style="width: 120px;"
            type="number"
            placeholder="0.00"
            v-model="query.endReceivedAmount"
            clearable>
          </el-input>
          <span style="margin-left:20px;">记账时间范围：</span>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <span style="color: red">账款总额：¥{{amountTotal}}</span>
        <div class="listBoxRight">
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            show-overflow-tooltip
            prop="paymentReceivedNo"
            label="回款信息编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="keepingAccountsDate"
            label="记账时间"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="organizationName"
            label="组织机构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="receivedAmount"
            label="回款金额"
            align="center">
            <template slot-scope="scope">
              <span>￥{{scope.row.receivedAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="对方户名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="accountNo"
            label="对方账户"
            align="center">
          </el-table-column>
          <el-table-column
            prop="uses"
            label="用途"
            align="center">
          </el-table-column>
          <el-table-column
            prop="provinceName"
            label="所属省份"
            align="center">
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="服务项目"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">待认款</span>
              <span v-if="scope.row.status == '1'">已完成</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goClaim(scope.row)"
                         v-show="$authorities.Claim"
                         v-if="scope.row.status==0 "
                         type="text" size="small">认款
              </el-button>
              <el-button @click="goClaimDetaills(scope.row)"
                         v-show="$authorities.ClaimDetaills"
                         type="text" size="small">详情
              </el-button>
              <!--<el-button type="text" size="small"-->
              <!--v-show="$authorities.ClaimBackPaymentr"-->
              <!--v-if="scope.row.status==0 "-->
              <!--@click="backPayment(scope.row)"-->
              <!--&gt;退回至回款信息列表-->
              <!--</el-button>-->
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
          style="height: 38px;padding: 0 5px;"
          :total=returnData.total>
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogChangeHint" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          <div class="first-step-box">您要操作的数据信息已发生变化，请刷新列表后重试</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogChangeHint = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAffirm" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">退回提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">退回至回款信息列表后，服务方不可见该数据。确定要退回操作吗</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAffirm = false">取 消</el-button>
        <el-button type="primary" @click="dialogAffirm=false,putClaimBackPaymentrReceived()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Butt from '../../common/Button/index'
  import {
    putClaimBackPaymentrReceived,
    getcClaimPage,
    putClaimConfirm,
    getcClaimDetail,
    postClaimFindOrderList,
    postClaimList,
    getcClaimStatusCount,
  } from '@/api/payment/claimList'

  import {postCustomerNameOptions, postOrganizationOptions} from "@/api/common/commonApi"

  export default {
    inject: ['reload', 'imgurl', 'close'],//注入依赖
    name: "ClaimList",
    data() {
      return {
        postType: '全部',
        btnData: [{
          "statusName": "全部",
        }, {
          "statusName": "待认款",
        }, {
          "statusName": "已完成",
        }],
        //查询
        query: {
          serialNumber:'',
          accountName: "",
          endReceivedAmount: null,
          startReceivedAmount: null,
          endTime: "",
          startTime: "",
          organizationId: null,
          paymentReceivedNo: null,
          status: null,
          pageNum: 1,
          pageSize: 10,
        },
        //删选显示
        isShow: true,
        //btn选中
        active: 0,
        organizationOptions: [],
        amountTotal: null,//账款总额
        dialogChangeHint: false,//公用是否有更改
        dialogAffirm: false,
        dialogAffirmID: '',
////////////////
        formReason: {
          closeReason: "",
        },
        rules: {
          closeReason: [
            {required: true, message: '请输入关闭原因', trigger: 'change'}
          ],
        },
        dateValue: '',
        customerNameOptions: [],
        typeOptions: [{
          value: null,
          label: '全部'
        }, {
          value: 'CUSTOMER',
          label: '客户'
        }, {
          value: 'SERVER ',
          label: '服务商'
        }],
        dialogClose: false,

        deleteId: 0,
        returnData: {
          items: [],
          offset: 0,
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },

        //btn数据
        //翻页
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '120px'
      }
    },

    computed: {
      dataListHeight() {
        return this.$store.getters.dataListHeight;
      },
      loading() {
        return this.$store.getters.loading
      },
    },
    activated() {
      if (this.$route.params.isUpdate) {
        this.postClaimList();
        this.getcClaimStatusCount();
      }
    },
    watch: {
      //监听时间范围
      dateValue(a, b) {
        console.log(this.dateValue);
        if (this.dateValue != "" && this.dateValue) {
          this.query.startTime = this.dateValue[0];
          this.query.endTime = this.dateValue[1]
        } else {
          this.query.startTime = null;
          this.query.endTime = null
        }
      },
    },
    mounted() {
      this.postClaimList();
      this.getcClaimStatusCount();
    },
    methods: {
      reset() {
        this.query = {
          serialNumber:'',
          accountName: "",
          endReceivedAmount: null,
          startReceivedAmount: null,
          endTime: "",
          startTime: "",
          organizationId: null,
          paymentReceivedNo: null,
          status: null,
          pageNum: 1,
          pageSize: 10,
        },
          this.dateValue="";
          this.postClaimList();
          this.getcClaimStatusCount();
      },
      //获取各状态的数量
      getcClaimStatusCount() {
        getcClaimStatusCount()
          .then((res) => {
            console.log(res)
            this.btnData = res.data;
          }).catch(err => {
          console.log(err)
        });
      },
      //获取列表
      postClaimList(data) {
        //请求列表
        postClaimList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnData = res.data.claimDTOs;
          this.amountTotal = res.data.amountTotal
        }).catch(err => {
          console.log(err)
        });
      },
      //类型按钮事件
      btnActive(index, typename) {
        this.postType = typename;
        if (this.active != index) {
          if (typename == '全部') {
            this.query.status = null;
          } else if (typename == '待认款') {
            this.query.status = 0;
          } else if (typename == '已完成') {
            this.query.status = 1;
          }
          this.query.pageNum = 1;
          this.postClaimList();
        }
        this.active = index;
      },
      //组织机构模糊搜索
      organizationRemoteMethod(query) {
        console.log(query)
        if (query !== '') {
          postOrganizationOptions(
            query
          ).then((res) => {
            this.organizationOptions = res.data;
            console.log(this.organizationOptions);
          }).catch(err => {
            console.log(err)
          });
        } else {
          this.organizationOptions = [];
        }
      },
      //跳转详情
      goClaimDetaills(row) {
//        const {href} = this.$router.resolve({
//          name: 'ClaimDetaills',
//          query: {
//            id: row.id
//          }
//        });
//        window.open(href, '_blank')

        getcClaimDetail(
          row.id
        )
          .then((res) => {
            if (res.code == '000000') {
              // const {href} = this.$router.resolve({
              //   name: 'ClaimDetaills',
              //   query: {
              //     id: row.id
              //   }
              // });
              // window.open(href, '_blank')
              this.$router.push({path: '/payment/claimlist/claimdetaills', query: {id: row.id}});
            }
            console.log(res)
          }).catch(err => {
          if (err.code == '270055') {
            this.dialogChangeHint = true
          }
          console.log(err)
        });
      },
      //跳转认款
      goClaim(row) {
        getcClaimPage(
          row.id
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$router.push({path: '/payment/claimlist/claim', query: {id: row.id}});
            } else if (/^98/.test(res.code)) {
              this.dialogChangeHint = true
            }
            console.log(res)
          }).catch(err => {
          if (err.code == '980110115') {
            this.dialogChangeHint = true
          }
          console.log(err)
        });
      },
      //点击退回
      backPayment(row) {
        this.dialogAffirm = true;
        this.dialogAffirmID = row.id;
      },
      //退回至回款信息列表
      putClaimBackPaymentrReceived() {
        putClaimBackPaymentrReceived(
          this.dialogAffirmID
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '退回至回款信息列表成功',
                type: "success",
              });
              this.postClaimList();
              this.getcClaimStatusCount();
            } else {
              this.postClaimList();
              this.getcClaimStatusCount();
              this.dialogChangeHint = true
            }
            console.log(res)
          }).catch(err => {
          if (err.code == '270055') {
            this.dialogChangeHint = true
          }
          console.log(err)
        });
      },
      //查询结果
      queryResult() {
        console.log(this.query);
        this.postClaimList()
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.queryResult()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.queryResult();
      },
      //筛选show
      showHelp() {
        this.isShow = !this.isShow;
      },

    },

  }
</script>
<style scoped lang="less">
  .returnOrderBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .btnactive {
        background: #399;
        color: #fff;
        border: solid 1px #399;
      }
      .el-button {
        width: 160px;
        height: 30px;
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
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      line-height: 50px;
      .listBoxTop {
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
          i {
            font-size: 14px;
          }
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
    .block {
      margin-top: 5px;
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
          width: 80%;
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
  }
</style>
