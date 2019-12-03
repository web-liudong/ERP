<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button size="small" :class="{active:customerstatus==0}" @click="switchTyped(0)">全部（{{status.purchaseReturnOrderCount}}）</el-button>
      <el-button size="small" :class="{active:customerstatus==1}" @click="switchTyped(1)">处理中（{{status.purchaseReturnOrderHandlerCount}}）</el-button>
      <el-button size="small" :class="{active:customerstatus==2}" @click="switchTyped(2)">已完成（{{status.purchaseReturnOrderCompleteCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="['iconfont', isShow?'el-icon-arrow-up':'el-icon-arrow-down ', 'myicon']" @click="isShow=!isShow" style="font-size: 14px"></i>
          <span @click="isShow=!isShow" v-if="isShow">收起筛选</span>
          <span @click="isShow=!isShow" v-if="!isShow">展开筛选</span>
          <el-button size="small" class="w80 h40" @click="switchType(customerstatus)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="mangerType">
            <div class="time-box">
              <span>退货单编号：</span>
              <el-input
                placeholder="退货单编号"
                v-model="query.returnOrderNo"
                clearable>
              </el-input>
            </div>
            <div class="time-box1">
              <span >创建时间：</span>
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
            <div class="time-box">
              <span>供应商：</span>
              <el-select
                v-model="query.supplierName"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="供应商名称"
                :remote-method="customerRemote"
                :loading="loading"
              >
                <el-option
                  v-for="item in customernames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div  class="time-box">
              <span>仓库：</span>
              <el-select
                style="max-width: 200px;"
                v-model="query.warehouseName"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="仓库名称"
                :remote-method="customerRemote1"
                :loading="loading"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>

        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div v-if="$authorities.NewPurchaseReturnBill" @click="newPurchaseList()" class="white-btn fun-btn"><i class="iconfont el-icon-plus"></i>创建退货单</div>
          <div @click="getoutdata()"  v-if="$authorities.DataExportofReturnBill" class="white-btn fun-btn">
            <i class="iconfont icondaochu" ></i>&nbsp;&nbsp;导出
          </div>
        </div>
      </div>
      <el-table
        :data="tableData.items"
        :max-height="dataListHeight"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        size="small">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="returnOrderNo"
          label="退货单编号"
          align="center">
        </el-table-column>
        <el-table-column
          label="金额"
          align="center">
          <template slot-scope="scope">
            <span>￥</span>
            <span>{{scope.row.totalAmountText}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tax"
          label="是否含税"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.tax == '1'">是</span>
            <span v-if="scope.row.tax == '0'">否</span>
          </template>
        </el-table-column>
        <el-table-column
         :show-overflow-tooltip="true"
          prop="supplierName"
          label="供应商"
          align="center">
        </el-table-column>
        <el-table-column
          prop="buyerName"
          label="采购员"
          align="center">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="备注"
          align="center">
        </el-table-column>
        <el-table-column
          prop="returnType"
          label="退货方式"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.returnType == 'OFFLINE_RETURN'">线下退货</span>
            <span v-if="scope.row.returnType == 'EXPRESS_RETURN'">快递退货</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="warehouseName"
          label="仓库"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status ==  'HANDLER'">处理中</span>
            <span v-if="scope.row.status ==  'COMPLETE'">已完成</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime |formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center" >
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="dialogDelete = !dialogDelete,deleteId=scope.row.id"
                         v-if="scope.row.status ==  'HANDLER'
                         && $authorities.CancellationofPurchaseReturnBill
                         && scope.row.returnType == 'OFFLINE_RETURN'">取消</el-button>
              <el-button type="text" size="small" @click="dialogDeleta = !dialogDeleta,deleteId=scope.row.id"
                         v-if="scope.row.status ==  'HANDLER'
                         && (scope.row.returnType == 'EXPRESS_RETURN'||scope.row.useLeadingWMS == '0')
                         && $authorities.ReturnOrderComplete">完成</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row)"
                         v-if="$authorities.DetailsofReturnBill">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="tableData.total!=0">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total=tableData.total>
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogDelete" width="500px" top="20%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">取消提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">取消之后，列表将不再展示该数据，确定要取消吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="dialogDelete=false,del()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDeleta" width="500px" top="20%" custom-class="dialog-box" >
      <div slot="title" class="dialog-title">
        <span class="reject-title">完成提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">确认完成该退货单？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleta = false">取 消</el-button>
        <el-button type="primary" @click="dialogDeleta=false,succ()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    postDataExportofReturnBill,
    postFulllistOfReturnOrders,
    postReturnListCompleted,
    postReturnBillListProcessing,
    postMerchandiseInquiryonReturnBill,
    postNumberOfReturnBills,
    getDetailsOfPurchaseReturnBil,
    deleteCancellationofPurchaseReturnBill,
    postWarehouseList,
    getCompleteReturnBill
  } from '@/api/purchase/purchaseReturnOrder'
  import {
    findInfo
  } from '@/api/businessSupplier'

  export default {
    inject:['reload','close'],
    name: "PurchaseReturnOrder",
    data() {
      return {
        dateValue: '',
        returnOrderNo:[],
        customernames:[],
        options:[],
        multipleSelection: [],
        status:[],
        userDataAuthority:[],
        userDataAuthorityId:null,
        loading:false,
        customerstatus:0,
        deleteId:0,
        startDate:'',
        endDate:'',
        endDate1:'',
        endTime:'',
        dialogDelete: false,
        dialogDeleta: false,
        findParam:
          {
            endTime: null,

            returnOrderNo:null,
            startTime: null,
            supplierName: null,
            warehouseName: null,
            pageNum: 1,
            pageSize: 10,

          }
        ,
        tableData: [
          {
            items: [

            ],
            // returnOrderNo:'',//退货单编号
            // totalAmount:'',//金额
            // supplierName:'',//供应商名称
            // buyerName:'',//采购员名称
            // memo:'',//备注
            // warehouseName:'',//仓库名称
            // createTime:'',//时间

            offset: 0,
            pageNum: 1,
            pageSize: 10,
            total: 0,
          },
        ],
        query: {
          warehouseName: "",
          supplierName: "",
          returnOrderNo:'',
          endTime:'',
          startTime:'',
          pageNum: 1,
          pageSize: 10,
        },
        customerId:null,
        page:1,
        name:null,
        isShow:true
      }
    },

    created(){
      this.postNumberOfReturnBills();
      this.postFulllistOfReturnOrders();
    },
    activated(){
      if (this.$route.params.isUpdate) {
        this.postNumberOfReturnBills();
        this.switchType(this.customerstatus);
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    methods: {
      newPurchaseList(){
        this.$router.push({path: '/purchase/purchaseReturnOrder/NewPurchaseReturnBill'});
      },

      goReset(){
        this.query.returnOrderNo = '';
        this.startDate = '';
        this.endDate = '';
        this.query.startTime = '';
        this.query.endTime = '';
        this.query.supplierName = '';
        this.query.warehouseName = '';
        this.switchType(this.customerstatus);
      },
      //供应商
      customerRemote(supplierName){
        //console.log(this.query.supplierId)
        if(supplierName != ""){
          let aa={name:supplierName};
          findInfo(aa).then((res) => {
            console.log(res)
            this.customernames = res.data;
          }).catch(err => {
            console.log(err)
          })
        }

      },
      //仓库
      customerRemote1(warehouseName){
        //console.log(this.query.warehouseName)
        if(warehouseName != ""){
          let ac={name:warehouseName};
          postWarehouseList(ac).then((res) => {
            console.log(res)
            this.options = res.data;
          }).catch(err => {
            console.log(err)
          })
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getoutdata(){
        this.findParam.returnOrderNo = this.query.returnOrderNo?this.query.returnOrderNo:null
        this.findParam.endTime = this.endDate?this.endDate:null
        this.findParam.startTime = this.startDate?this.startDate:null
        this.findParam.supplierName = this.query.supplierName?this.query.supplierName:null
        this.findParam.warehouseName = this.query.warehouseName?this.query.warehouseName:null
        if(this.customerstatus == 0){this.findParam.status = null}
        if(this.customerstatus == 1){this.findParam.status = 'HANDLER'}
        if(this.customerstatus == 2){this.findParam.status =  'COMPLETE'}
        postDataExportofReturnBill(this.findParam).then(res => {
          if (res.code != "000000") {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.downfile(res.data);
          }
        });
      },
      downfile(id) {
        let href =
          "/api/file-service/file/download?id=" +
          id +
          "&access_token=" +
          this.$auth.token;
        window.open(href, "_blank");
      },
      //完成
      succ(){
        console.log(this.deleteId)
        getCompleteReturnBill(this.deleteId).then((res) => {
          if(res.code=='000000'&&res.data==1){
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.postNumberOfReturnBills();
            this.switchType(this.customerstatus);
          }else{
            this.$message({
              type: 'error',
              message: '操作失败'
            });
          }
        })
      },
      //取消
      del(){
        console.log(this.deleteId)
        deleteCancellationofPurchaseReturnBill(this.deleteId).then((res) => {
          if(res.code=='000000'&&res.data==1){
            this.$message({
              type: 'success',
              message: '取消成功'
            });
            this.postNumberOfReturnBills();
            this.switchType(this.customerstatus);
          }else{
            this.$message({
              type: 'error',
              message: '取消失败'
            });
          }
        })
      },
      postNumberOfReturnBills(){
        postNumberOfReturnBills()
          .then((res) => {
            console.log(res)
            this.status = res.data;

          }).catch(err => {
          console.log(err)
        })
      },
      // 跳转退货单详情
      goDetail(row){
        // const {href} = this.$router.resolve({
        //   name: "DetailsofReturnBill",
        //   query: {
        //     id: row.id,
        //     totalAmount:row.totalAmount,
        //   },
        // });
        // window.open(href,'_blank')
        this.$router.push({path: '/purchase/purchaseReturnOrder/DetailsofReturnBill', query: {id: row.id}});
      },
      switchTyped(val){
        this.query.pageNum = 1
        this.customerstatus = val;
        if(this.customerstatus == 0){

          this.postFulllistOfReturnOrders();
          this.postNumberOfReturnBills();

        }
        if(this.customerstatus == 1){
          this.postReturnBillListProcessing();
          this.postNumberOfReturnBills();
        }
        if(this.customerstatus == 2){
          this.postReturnListCompleted();
          this.postNumberOfReturnBills();
        }
      },
      switchType(val){
        this.customerstatus = val;
        this.query.startTime = this.startDate?this.startDate:''
          this.query.endTime =  this.endDate?this.endDate:''
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


        if(this.customerstatus == 0){

          this.postFulllistOfReturnOrders();
          this.postNumberOfReturnBills();

        }
        if(this.customerstatus == 1){
          this.postReturnBillListProcessing();
          this.postNumberOfReturnBills();
        }
        if(this.customerstatus == 2){
          this.postReturnListCompleted();
          this.postNumberOfReturnBills();
        }
      },
      //已完成
      postReturnListCompleted(data){
        this.chengeDate()
        postReturnListCompleted(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //全部
      postFulllistOfReturnOrders(data){
        this.chengeDate()
        postFulllistOfReturnOrders(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //处理中
      postReturnBillListProcessing(data){
        this.chengeDate()
        postReturnBillListProcessing(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      chengeDate(){

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.switchType(this.customerstatus)
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.switchType(this.customerstatus);
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
  .brandBox {
    width: 100%;

    .buttonBox {
      margin-top: 10px;
      .el-button {
        width: 140px;
        height: 30px;
      }
      .active{
        background: #339999;
        color: #fff;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      margin: 10px 0;
      clear: both;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        box-sizing: border-box;
        .head-left{
          display: flex;
          align-items: center;
        }
        .myicon{
          font-weight: bold;
          color:#666;
          font-size: 20px;
          line-height: 50px;
          margin-right: 5px;
        }
      }
      span {
        font-size: 14px;
        color: #303133;
      }
      .rightBox {
        float: right;
        cursor: pointer;
        .myicon{
          color: #999;
          font-size: 10px;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #e4e4e4;

        background: #fff;
        .mangerType{
          padding-top: 10px;
          display: flex;
          flex-wrap: wrap;
          margin-left:2%;
        }
        .el-input {
          width: 200px;
          height: 40px;

          margin-bottom: 10px;
        }
        .el-select{
          width: 200px;
          height: 40px;

          margin-bottom: 10px;
        }

        .time-box{
          width: 20%;
          height: 50px;
          display: flex;

          justify-content: center;
          align-items: center;

          span{
            margin-top: -15px;
            width: 150px;
            text-align: right;
          }
          .el-date-editor{
            width: 200px;
            height: 40px;
            margin-left: 0;
          }
          .text{
            line-height: 40px;
            margin-top: -10px;
          }
        }
        .time-box1{
          width: 35%;
          height: 50px;
          display: flex;

          justify-content: center;
          align-items: center;

          span{
            margin-top: -15px;
            width: 150px;
            text-align: right;
          }
          .el-date-editor{
            width: 200px;
            height: 40px;
            margin-left: 0;
          }
          .text{
            line-height: 40px;
            margin-top: -10px;
          }
        }

      }
    }
    .listBox {
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          i{
            margin-left: 20px;
            font-weight: bold;
            font-size: 16px;
          }
          span {
            margin-left: 5px;
            font-size: 14px;
            color: #303133;
            line-height: 50px;
          }
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        height: 50px;
        .white-btn {
          margin-top: 10px;
          margin-right: 10px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin: 3px 10px;
      display: flex;
      justify-content: flex-end;
      height: 30px;
    }
    .my-scroll-bar{
      height:200px;
    }
    .el-dialog{
      div{
        font-size: 16px;
      }

    }
  }
</style>


