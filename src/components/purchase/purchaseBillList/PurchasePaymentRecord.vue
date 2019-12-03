<template>
  <div>
    <div class="returnOrderBox">
      <div class="filterBox">
        <div class="homeBoxTop"><span><i class="iconfont iconsousuo"></i>&nbsp;筛选查询</span>
          <div class="rightBox">
            <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up"></i>收起筛选</span>
            <span v-else @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
            <el-button size="small" class="w80 h40" @click="postPurchasePaymentrecord()">查询结果</el-button>
            <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="isShow">
            <div class="time-box" >
              <span >操作时间范围：</span>
              <el-date-picker
                v-model="startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开始时间"
                clearable>
              </el-date-picker>
              <div class="text">至</div>
              <el-date-picker
                v-model="endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="截止时间"
                clearable>
              </el-date-picker>
            </div>

          </div>
        </el-collapse-transition>
      </div>
    </div>
    <div class="detaillBox"  >
      <div class="detaillTable clear">
        <div class="detaillTopBox">
          <span><i class="iconfont el-icon-collection-tag"></i>付款操作</span>
        </div>
        <el-table
          :data="returnData.items"
          border
          stripe
          style="width: 90%"
          size="small">
          <el-table-column
            prop="importTime"
            label="操作者"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.userFullName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作时间"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.paymentTime |formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountPaid"
            label="付款金额"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.accountPaid!=0&&scope.row.accountPaid">￥</span>
              <span>{{scope.row.accountPaid}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商"
            align="center">
          </el-table-column>
          <el-table-column
            prop="accountNoPaid"
            label="付款银行账号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="bankSerialNumber"
            label="银行流水账号"
            align="center">
          </el-table-column>
        </el-table>
        <div class="block"  v-show="returnData.total!=0">
          <span class="demonstration"></span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10,20,30,40,50,100,500]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            style="height: 38px;"
            :total="returnData.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="button-box">
      <el-button type="primary"  @click="purRetun()">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>


</template>
<script>
  import {
    postPurchasePaymentrecord,

  } from '@/api/purchase/PurchasePaymentsList'
  export default {
    inject:['TableMoney' ,"close"],
    name: "PurchasePaymentRecord",
    data() {
      return {
        startDate:'',
        endDate:'',
        dateValue: '',
        //删选显示
        isShow: true,
        msg: '',
        returnData: {
          items: [],
          offset: 0,
          pageNum: 0,
          pageSize: 0,
          total: 0
        },
        query: {
          startTime:'',
          endTime:'',
          pageNum: 1,
          pageSize: 10,
        },
        currentPage: 1,
      }
    },

    created() {
      this.postPurchasePaymentrecord();
    },
    mounted() {
      //alert(this.$route.query.Id);

    },
    methods: {
      //查询

      postPurchasePaymentrecord() {
        this.query.startTime = this.startDate?this.startDate:''
        this.query.endTime = this.endDate?this.endDate:''
        if(this.query.startTime!=''&&this.query.endTime!=''){
          let start = new Date(this.startDate)
          let end = new Date(this.endDate)
          if(start>end){
            this.$message({
              type: 'error',
              message: '开始时间应小于结束时间'
            });
            return
          }
        }
        postPurchasePaymentrecord(
          this.query
        ).then((res) => {
          this.returnData = res.data;
          console.log(res);
        }).catch(err => {

        });
      },
      goReset(){
        this.startDate = '';
        this.endDate = '';
        this.query.startTime = '';
        this.query.endTime = '';
        this.postPurchasePaymentrecord();
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postPurchasePaymentrecord();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postPurchasePaymentrecord();
      },
      purRetun(){
        this.close({name:'PurchasePaymentRecord', to: {name:'PurchasePaymentsList', params:{isUpdate:true}}})
      },

    },

    filters: {
      //时间截取字符串
      formatDate: function (val) {
        var dateee = new Date(val).toJSON();
        var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
        return date
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .returnOrderBox {
    width: 100%;
    .filterBox {
      font-size: 12px;
      background-color: #fff;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop {
        height: 50px;
        line-height: 50px;
        background: #f3f3f3;
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
          color: #000;
          cursor: pointer;
          font-size: 12px;
        }
        /*span:hover {*/
        /*color: #303133;*/
        /*}*/
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
      .time-box{
        width: 550px;
        height: 50px;

        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 40px;
        span{

        }
        .el-date-editor{
          width: 200px;
          height: 40px;
          margin-left: 0;
        }
        .text{
          line-height: 40px;

        }
      }
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
      .el-table {
        margin: 20px auto;
        width: 90%;
        .el-button {
          font-size: 12px;
        }
      }
    }
  }

  .block {
    margin-top: 10px;
    margin-right: 20px;
    text-align: right;
  }
  .button-box{
    width: 90%;
    margin: 20px auto 50px;
    display: flex;
    justify-content: flex-end;
  }

</style>
