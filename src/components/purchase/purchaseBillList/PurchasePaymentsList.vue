<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button size="small" :class="{active:customerstatus==0}" @click="switchTyped(0)">全部（{{status.count}}）</el-button>
      <el-button size="small" :class="{active:customerstatus==1}" @click="switchTyped(1)">待付款（{{status.pendingCount}}）</el-button>
      <el-button size="small" :class="{active:customerstatus==2}" @click="switchTyped(2)">部分完成（{{status.partlyCompletedCount}}）</el-button>
      <el-button size="small" :class="{active:customerstatus==3}" @click="switchTyped(3)">已完成（{{status.completedCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="['iconfont', isShow?'el-icon-arrow-up':'el-icon-arrow-down ', 'myicon']" @click="isShow=!isShow"  ></i>
          <span @click="isShow=!isShow" v-if="isShow" style="font-size: 14px">收起筛选</span>
          <span @click="isShow=!isShow" v-if="!isShow" style="font-size: 14px">展开筛选</span>
          <el-button size="small" class="w80 h40" @click="switchType(customerstatus)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="mangerType">
            <div class="time-box">
              <span>付款单编号：</span>
              <el-input
                placeholder="请输入订单号"
                v-model="query.accountPayableNo"
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
                @change="getData"
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
            <div class="time-box">
              <span>结算单编号：</span>
              <el-input
                placeholder="请输入结算单号"
                v-model="query.billNo"
                clearable>
              </el-input>
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
          <div @click="outExport"  v-if="$authorities.PurchasePaymentsExport" class="white-btn fun-btn">
            <i class="iconfont icondaochu"></i>&nbsp;&nbsp;导出
          </div>
          <div class="white-btn fun-btn"   @click="importfile"  v-if="$authorities.PurchasePaymentsImport"><i class="iconfont icondaoru"></i>&nbsp;批量导入</div>
          <div class="white-btn fun-btn"  v-if="$authorities.PurchasePaymentsImport" @click="importDelit()"><i class="iconfont iconjinridingdanshu" ></i>&nbsp;导入记录</div>
          <div @click="goPaymentts()"  v-if="$authorities.PurchasePaymentsPayment" class="white-btn fun-btn">
            <i class="iconfont iconjiesuandan"></i>&nbsp;&nbsp;付款
          </div>
          <div class="white-btn fun-btn" v-if="$authorities.PurchasePaymentRecord" @click="payList()"><i class="iconfont iconjinridingdanshu"></i>&nbsp;付款记录</div>
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
          align="center"
          :selectable="seletable"
          width="55">
        </el-table-column>
        <el-table-column
          prop="accountPayableNo"
          label="付款单编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="billNo"
          label="结算单编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate}}</span>
          </template>

        </el-table-column>
        <el-table-column
          prop="supplierName"
          label="供应商"
          align="center">
        </el-table-column>
        <el-table-column
          prop="billAmount"
          label="付款单金额"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.billAmount != 0">￥</span>
            {{scope.row.billAmount}}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAccountPaid"
          label="已付款金额"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.totalAccountPaid != 0">￥</span>
            {{scope.row.totalAccountPaid}}
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceAmountReceived"
          label=" 已收票金额"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceAmountReceived != 0">￥</span>
            {{scope.row.invoiceAmountReceived}}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountPayable"
          label="应付金额"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.accountPayable != 0">￥</span>
            {{scope.row.accountPayable}}
          </template>
        </el-table-column>
        <el-table-column

          label="状态"
          align="center">
          <!--PENDING_PAYMENT 1 待付款-->
          <!--PARTLY_COMPLETED 0 部分-->
          <!--CANCEL 2 已取消-->
          <!--COMPLETED 3 已完成-->
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'PENDING_PAYMENT'">待付款</span>
            <span v-if="scope.row.status == 'PARTLY_COMPLETED'">部分完成</span>
            <span v-if="scope.row.status == 'CANCEL'">已取消</span>
            <span v-if="scope.row.status == 'COMPLETED'||scope.row.status == 'CLOSED'">已完成</span>
          </template>
        </el-table-column>
        <el-table-column

          fixed="right"
          label="操作"
          align="center" >
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small"
                         @click="goDetail(scope.row)"
                         v-if="$authorities.PurchasePaymentDetails">详情</el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.status == 'PENDING_PAYMENT'
                         &&$authorities.PurchasePaymentCancel "
                         @click="dialogData = !dialogData,deleteId=scope.row.id,purchaseBillId = scope.row.purchaseBillId">取消</el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.status == 'PARTLY_COMPLETED'
                         &&$authorities.PurchasePaymentClose"
                         @click="dialogDelete = !dialogDelete,deleteId=scope.row.id">关闭</el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.status == 'CLOSED'
                          &&$authorities.PurchasePaymentUndo"
                         @click="dialogUndoclosed = !dialogUndoclosed,deleteId=scope.row.id">撤销关闭</el-button>
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
    <importFile ref="importFile" :title="'付款信息批量导入'"   :type="'purchase-Payments-import'" @callback="importCallback"></importFile>
    <el-dialog title="已选应付账款" :visible.sync="dialogTableVisible" width="60%">
      <!--<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">-->
      <!---->
      <!--</el-form>-->
      <el-table
        :data="tableData1"
        border
        style="width: 100%"
        max-height="500"
        size="small">
        <el-table-column
          label="序号"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountPayableNo"
          label="付款单号"
          style="color: #399;"
          align="center">
        </el-table-column>
        <el-table-column
          prop="supplierName"
          label="供应商名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="billAmount"
          label="付款单总金额"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.billAmount != 0">￥</span>
            {{scope.row.billAmount}}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAccountPaid"
          label="已结算金额"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.totalAccountPaid != 0">￥</span>
            {{scope.row.totalAccountPaid}}
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceAmountReceived"
          label="已收票金额"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceAmountReceived != 0">￥</span>
            {{scope.row.invoiceAmountReceived}}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountPayable"
          label="应付账款"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.accountPayable != 0">￥</span>
            {{scope.row.accountPayable}}
          </template>
        </el-table-column>
        <el-table-column
          label="本次付款金额￥"
          width="150"
          align="center">
          <template slot-scope="scope">
            <el-input @input ="gitChange(scope.row)" v-model="scope.row.accountPaid" placeholder="" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="付款银行账号"
          width="250"
          align="center">
          <template slot-scope="scope">
            <el-input  @input ="gitChange(scope.row)"  v-model="scope.row.accountNoPaid" placeholder="" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="银行流水号"
          width="250"
          align="center">
          <template slot-scope="scope">
            <el-input @input ="gitChange(scope.row)"  v-model="scope.row.bankSerialNumber" placeholder="" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center" >
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible ,getPayments()">付 款</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDelete" width="500px" custom-class="dialog-box" >
      <div slot="title" class="dialog-title">
        <span class="reject-title">关闭提示</span>
      </div>

      <div class="message-box">
        <div class="first-step-box">
          <el-form :model="formReason" :rules="rules" ref="ruleForm" label-width="102px">
            <el-form-item label="关闭原因：" prop="closeReason" >
              <el-input type="textarea" v-model="formReason.closeReason" placeholder="请输入200字以内" ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>

    </el-dialog>
    <el-dialog :visible.sync="dialogUndoclosed" width="500px" custom-class="dialog-box" >
      <div slot="title" class="dialog-title">
        <span class="reject-title">撤销关闭</span>
      </div>

      <div class="message-box">
        <div class="first-step-box">
          <p>是否撤销该付款单的关闭状态？撤销后该付款单可继续进行付款操作</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUndoclosed = false">取 消</el-button>
        <el-button type="primary" @click="Undoclosed()">确 定</el-button>
      </div>

    </el-dialog>
    <el-dialog :visible.sync="dialogData" width="500px" custom-class="dialog-box" >
      <div slot="title" class="dialog-title">
        <span class="reject-title">取消提示</span>
      </div>

      <div class="message-box">
        <div class="first-step-box">
          <el-form :model="formReason" :rules="rules" ref="ruleForm" label-width="102px">
            <el-form-item label="取消原因：" prop="cancelReason" >
              <el-input type="textarea" v-model="formReason.cancelReason" placeholder="请输入200字以内" ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogData = false">取 消</el-button>
        <el-button type="primary" @click="submitForms('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {
    postPurchasePaymentsListAll,
    postPurchasePaymentsListCompleted,
    postPurchasePaymentsListPartiallycompleted,
    postPurchasePaymentsListPending,
    postClosepaymentBill,
    postPaymentFormCancellation,
    postPurchasePaymentsPayment,
    postCountData,
    postPaymentExportBill,
    postUndoClosed
  } from '@/api/purchase/PurchasePaymentsList'

  import importFile from "@/components/common/module/ImportFile";
  import {
    findInfo
  } from '@/api/businessSupplier'


  export default {
    name: "PurchasePaymentsList",
    data(){
      return{
        form:{
        },
        formReason:{
          closeReason:"",
          cancelReason:"",
        },
        rules: {
          closeReason: [
            {required: true, message: '请输入关闭原因', trigger: 'change'}
          ],
          cancelReason: [
            {required: true, message: '请输入取消原因', trigger: 'change'}
          ],
        },
        customernames:[],
        loading:false,
        accountNoPaid:'',
        sum:'',
        dateValue: '',
        deleteId:0,
        purchaseBillId:0,
        dialogDelete: false,
        dialogData: false,
        dialogUndoclosed:false,
        startDate:'',
        endDate:'',
        tableData:{
          items:[],
          offset: 0,
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        tableData1:[
          {
            accountNoPaid: '',
            accountPaid: '',
            bankSerialNumber: "",
          }
        ],
        mode:'',
        customerstatus:0,
        status:[1],
        isShow:true,
        dialogTableVisible: false,
        query: {
          id:'',
          startTime:'',
          endTime:'',
          pageNum: 1,
          pageSize: 10,
        },
        returnData:[
          {
            accountNoPaid: '',
            accountPaid: '',
            bankSerialNumber: "",
            id:'',
          }
        ],

        findParam:{
          accountPayableNo: null,
          endTime: null,
          pageNum: 1,
          pageSize: 10,
          startTime: null,
          status: null,
          supplierName: null
        },

      }
    },
    components:{
      importFile
    },

    created(){
      this.postPurchasePaymentsListAll();
      this.postCountData();

    },
    activated(){
      if (this.$route.params.isUpdate){
        this.switchType(this.customerstatus);
        this.postCountData()
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    methods:{
      seletable(row,index){
        if((row.status == 'CANCEL')||(row.status == 'COMPLETED'||row.status == 'CLOSED')){
          return false
        }else{
          return true
        }
      },
        gitChange(res){
            if(res){
                if(res.accountPaid ){
                    res.accountPaid = res.accountPaid.replace(/[^\d.]/g,'');
                }
                if(res.accountNoPaid ){
                    res.accountNoPaid = res.accountNoPaid.replace(/\D/g,'');
                }
                if(res.bankSerialNumber ){
                    res.bankSerialNumber = res.bankSerialNumber.replace(/\D/g,'');
                }

                console.log(res)
            }

        },
      handleDelete(index, row) {
        console.log(index, row);
        this.tableData1.splice(index, 1)
      },
      //搜索
      customerRemote(supplierName){
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
      importDelit(){
        this.$router.push({path: '/finance/PurchasePaymentImport'});
      },
      payList(){
        this.$router.push({path: '/finance/PurchasePaymentRecord'});
      },
      goReset(){
        this.query.accountPayableNo = '';
        this.startDate = '';
        this.endDate = '';
        this.query.startTime = '';
        this.query.endTime = '';
        this.query.supplierName = '';
        this.query.billNo  = '';
        this.switchType(this.customerstatus);
      },
      getData(value){},
      //撤销关闭
      Undoclosed(){
        postUndoClosed(
          this.deleteId
        ).then((res) => {
          if(res.code=='000000'&&res.data==1){
            this.$message({
              type: 'success',
              message: '撤销关闭成功'
            });
            this.dialogUndoclosed = false
            this.switchType(this.customerstatus)
            this.postCountData();
          }else{
            this.$message({
              type: 'error',
              message: '撤销关闭失败'
            });
            this.dialogUndoclosed = false
          }
        })
          .catch(err => {
            console.log(err)
          });
      },

      //付款
      goPaymentts(){

        let a = []
        let j = 0
        console.log(this.multipleSelection)
        if(!this.multipleSelection||this.multipleSelection ==''){
          this.$confirm('请选择付款单', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
          return
        }
        this.multipleSelection.forEach(function (s) {
          if(s.status == 'CANCEL'||s.status == 'COMPLETED'){
            j++;
          }
          a += s.status
          console.log(s.status, "909090")
        })
        console.log(j,11111111)
        if(j != 0){
          this.$confirm('所选订单中有已完成或已取消的订单', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });

        }else{

          this.PaymentsList()
        }
      },
      PaymentsList(){
        this.tableData1 = this.multipleSelection;
        this.dialogTableVisible = true;
        this.switchType(this.customerstatus);
      },
      getPayments(){
        // this.tableData1.forEach(function (x) {
        //
        //   this.query.push(x.accountNoPaid)
        // })
        // console.log(this.tableData1.length,147258)
        if(this.tableData1.length ==0){
          this.$confirm('所选订单已经被全部删除请从新选择', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogTableVisible = false;
          }).catch(() => {

          });
          return
        }
        let x = 0
        let j = 0
        // for(var i=0;i<this.tableData1.length;i++){
        //
        //   this.returnData[i].accountNoPaid = this.tableData1[i].accountNoPaid
        //   this.returnData[i].accountPaid = this.tableData1[i].accountPaid
        //   this.returnData[i].bankSerialNumber = this.tableData1[i].bankSerialNumber
        //   this.returnData[i].accountPayable = this.tableData1[i].accountPayable
        //   this.returnData[i].id = this.tableData1[i].id
        //
        //   console.log(this.tableData1,12345)
        // }
        this.tableData1.forEach(function (s) {
          console.log(s.accountPayable ,12314214)
          if(s.accountPaid >s.accountPayable){
            x++;
          }
        })
        this.tableData1.forEach(function (s) {
          if(!s.accountNoPaid ||!s.accountPaid ||!s.bankSerialNumber){
            j++;
          }
        })
        console.log(j,2222222222);
        if(j!=0){
          this.$confirm('请完善付款单', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
          return
        }
        else {
          if(x!=0){
            this.$confirm('本次付款金额不可高于应付账款', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

            }).catch(() => {

            });
            return
          }
          else {
            this.dialogTableVisible = false
            this.postPurchasePaymentsPayment();
          }
        }
        // console.log(this.tableData1,1234)

      },
      //付款
      postPurchasePaymentsPayment(tableData1){
        postPurchasePaymentsPayment(
          this.tableData1
        ).then((res) => {
          console.log(res,1111111123)
          if(res.code=='000000'){
            this.$message({
              type: 'success',
              message: res.data
            });
            this.switchType(this.customerstatus)
            this.postCountData();
          }else{
            this.$message({
              type: 'error',
              message: res.data
            });
          }

        }).catch(err => {
          console.log(err)
        })
      },
      //全部
      postPurchasePaymentsListAll(){
        postPurchasePaymentsListAll(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //待付款
      postPurchasePaymentsListPending(){
        postPurchasePaymentsListPending(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //部分完成
      postPurchasePaymentsListPartiallycompleted(){
        postPurchasePaymentsListPartiallycompleted(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //已完成
      postPurchasePaymentsListCompleted(){
        postPurchasePaymentsListCompleted(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      postCountData(){
        postCountData().then((res) => {
          console.log(res)
          this.status = res.data;

        }).catch(err => {
          console.log(err)
        })
      },
      //跳转
      goDetail(row){
        this.$router.push({path: '/finance/PurchasePaymentDetails', query: {id: row.id}});
      },
      submitForm(formName) {
        console.log(this.formReason.closeReason,1111111111)

        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(valid,2222222222222);
            this.form.closeReason = this.formReason.closeReason
            postClosepaymentBill(
              this.deleteId,this.form
            ).then((res) => {
              if(res.code=='000000'&&res.data==1){
                this.$message({
                  type: 'success',
                  message: '关闭成功'
                });
                this.dialogDelete = false;
                this.switchType(this.customerstatus)
                this.postCountData();
                this.$refs[formName].resetFields();
              }else{
                this.$message({
                  type: 'error',
                  message: '关闭失败'
                });
                this.dialogDelete = false
              }
            })
              .catch(err => {
                console.log(err)
                this.dialogDelete = false
              });

          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      submitForms(formName) {
        console.log(this.formReason.closeReason,1111111111)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(valid,2222222222222);
            this.form.cancelReason = this.formReason.cancelReason
            this.form.purchaseBillId =  this.purchaseBillId
            postPaymentFormCancellation(
              this.deleteId,this.form
            ).then((res) => {
              if(res.code=='000000'&&res.data==1){
                this.$message({
                  type: 'success',
                  message: '取消成功',
                });
                this.dialogData = false
                this.switchType(this.customerstatus)
                this.postCountData();
                this.$refs[formName].resetFields();
              }else{
                this.$message({
                  type: 'error',
                  message: '取消失败'
                });
                this.dialogData = false
              }
            })
              .catch(err => {
                console.log(err)
                this.dialogData = false
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //关闭付款单
      // goClose(){
      //   console.log(this.deleteId)
      //   this.form.closeReason = this.formReason.closeReason
      //   postClosepaymentBill(
      //     this.deleteId,this.form
      //   ).then((res) => {
      //     if(res.code=='000000'&&res.data==1){
      //       this.$message({
      //         type: 'success',
      //         message: '关闭成功'
      //       });
      //       this.dialogDelete = false
      //       this.postPurchasePaymentsListAll();
      //       this.postCountData();
      //     }else{
      //       this.$message({
      //         type: 'error',
      //         message: '关闭失败'
      //       });
      //       this.dialogDelete = false
      //     }
      //   })
      //     .catch(err => {
      //       console.log(err)
      //       this.dialogDelete = false
      //     });
      // },
      //取消付款单
      // goCancel(){
      //   console.log(this.deleteId)
      //   this.form.cancelReason = this.formReason.cancelReason
      //   this.form.purchaseBillId =  this.purchaseBillId
      //   postPaymentFormCancellation(
      //     this.deleteId,this.form
      //   ).then((res) => {
      //     if(res.code=='000000'&&res.data==1){
      //       this.$message({
      //         type: 'success',
      //         message: '取消成功',
      //       });
      //       this.dialogData = false
      //       this.postPurchasePaymentsListAll();
      //       this.postCountData();
      //     }else{
      //       this.$message({
      //         type: 'error',
      //         message: '取消失败'
      //       });
      //       this.dialogData = false
      //     }
      //   })
      //     .catch(err => {
      //       console.log(err)
      //       this.dialogData = false
      //     });
      // },
      importfile(){
        this.$refs["importFile"].init();
      },
      importCallback(){
        //回调处理
      },



      //导出
      outExport(){
        this.findParam.accountPayableNo = this.query.accountPayableNo?this.query.accountPayableNo:null
        this.findParam.endTime = this.endDate?this.endDate:null
        this.findParam.startTime = this.startDate?this.startDate:null
        this.findParam.supplierName = this.query.supplierName?this.query.supplierName:null
        if(this.customerstatus == 0){this.findParam.status = null}
        if(this.customerstatus == 1){this.findParam.status = 'PENDING_PAYMENT'}
        if(this.customerstatus == 2){this.findParam.status =  'PARTLY_COMPLETED'}
        if(this.customerstatus == 3){this.findParam.status = 'COMPLETED'}
        postPaymentExportBill(this.findParam).then(res => {
          console.log(res);
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
      handleSelectionChange(val) {

        this.multipleSelection = val;

        this.sum = val.length;
      },
      switchTyped(val){
        this.query.pageNum = 1
        this.customerstatus = val;
        if(this.customerstatus==0){
          this.postPurchasePaymentsListAll();
        }
        if(this.customerstatus==1){
          this.postPurchasePaymentsListPending();
        }
        if(this.customerstatus==2){
          this.postPurchasePaymentsListPartiallycompleted();
        }
        if(this.customerstatus==3){
          this.postPurchasePaymentsListCompleted();
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
        if(this.customerstatus==0){
          this.postPurchasePaymentsListAll();
        }
        if(this.customerstatus==1){
          this.postPurchasePaymentsListPending();
        }
        if(this.customerstatus==2){
          this.postPurchasePaymentsListPartiallycompleted();
        }
        if(this.customerstatus==3){
          this.postPurchasePaymentsListCompleted();
        }
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
          width: 30%;
          height: 50px;
          display: flex;

          justify-content: center;
          align-items: center;

          span{
            margin-top: -15px;
            width: 100px;
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
      height: 30px;
      display: flex;
      justify-content: flex-end;
    }
    .my-scroll-bar{
      height:200px;
    }
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

</style>
