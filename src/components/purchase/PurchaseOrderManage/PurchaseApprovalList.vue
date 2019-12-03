<template>
	<div class="brandBox">
    <div class="buttonBox">
      <el-button v-for="(item,index) in headerData" :key="index" size="small" :class="{ active: buttonshow==index }" @click="header_button_click(index,item.code)">{{item.text}}（{{item.count}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
        
          <el-button size="small" class="w80 h40" @click="search">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-if="isShow">
          <el-row style="width:100%">
            <el-col :span="6" class="el-col">
              <span class="span-style">采购单编号：</span>
              <el-input    
                v-model="purchaseNo"
                placeholder="采购单编号"
                clearable>
              </el-input>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">供应商：</span>
              <el-select
                v-model="supplierName"
                filterable
                remote
                clearable
                placeholder="请输入供应商姓名"
                :remote-method="supplierRemote"
                @change="changeSupplier"
                style="margin-left:0px;"
                :loading="loading">
                <el-option
                  v-for="item in supplierNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">仓库：</span>
              <el-select
                v-model="warehouseId"
                filterable
                remote
                clearable
                placeholder="请输入仓库名称"
                :remote-method="warehouseRemote"
                :loading="loading">
                <el-option
                  v-for="item in warehouseName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="width:100%">
            <el-col :span="6" class="el-col">
              <span class="span-style">采&nbsp;&nbsp;购&nbsp;&nbsp;员：</span>
              <el-select
                v-model="purchaserId"
                filterable
                remote
                clearable
                placeholder="请输入采购员姓名"
                :remote-method="buyerRemote"
                style="margin-left:0px;"
                :loading="loading">
                <el-option
                  v-for="item in buyerName"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">到货类型：</span>
              <el-select v-model="deliveryType">
                <el-option label="入仓" value="0"></el-option>
                <el-option label="厂直" value="1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12" class="el-col">
              <div class="time-box">
                <span class="span-style" style="flex-grow: 0;flex-shrink: 0;">创建时间：</span>
                <el-date-picker
                  v-model="startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始时间">
                </el-date-picker>
                <div class="text">至</div>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="截止时间">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconshujuliebiao"></i>
          <span>数据列表</span>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :max-height="dataListHeight"
        style="width: 100%"
        size="small">
        <el-table-column
          prop="urgentLevel"
          label="紧急程度"
          :formatter="changeUrgentLevel"
          align="center">
        </el-table-column>
        <el-table-column
          prop="purchaseOrderNo"
          label="采购单编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
          :formatter="retainDecimals"
          align="center">
        </el-table-column>
        <el-table-column
          prop="supplierName"
          label="供应商"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payTypeText"
          label="结款方式"
          align="center">
        </el-table-column>
        <el-table-column
          prop="invoiceTypeText"
          label="发票类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="purchaserName"
          label="采购员"
          align="center">
        </el-table-column>
        <el-table-column
          prop="deliveryTypeText"
          label="到货类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="warehouseName"
          label="仓库"
          align="center">
        </el-table-column> 
        <el-table-column
          prop="reviewStatusText"
          label="状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="createTimes"
          align="center">
        </el-table-column> 
        <el-table-column
          fixed="right"
          label="操作"
          align="center" min-width="150px">
          <template slot-scope="scope">
              <el-button type="text" size="small" @click="goApproval(scope.row.id)" v-show="scope.row.reviewStatus==0" v-if="$authorities.PurchaseOrderApproval">审批</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row.id)" v-if="$authorities.PurchaseApprovalDetail">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" v-show="total!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
  </div>
</template>
<script>

import {getPurchaseApprovalList,getStatusCount,getListSupplierName,getWarehouseName,getBuyerName} from '@/api/purchaseApproval';


export default {
  name:'PurchaseApprovalList',
  components: {
  },
  data() {
    return {
      tableData:[],
      deliveryType:'',
      endDate:'',
      pageSize:10,
      page:1,
      purchaseNo:'',
      startDate:'',
      status:-1,
      supplierId:'',
      supplierNames:[],
      supplierName:null,
      purchaseType:null,
      warehouseId:'',
      warehouseName:[],
      purchaserId:'',
      purchaserName:[],
      headerData:[],
      buyerName:[],
      total:0,
      isShow:false,
      buttonshow:0,
      loading:false,
    }
  },
  created() {
    this.getList();
    this.getStatusCount();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getList();
      this.getStatusCount();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    search(){
     this.getList()
    },
    reset(){
      this.deliveryType=null;
      this.endDate=null;
      this.purchaseNo=null;
      this.startDate=null;
      this.supplierId=null;
      this.supplierName=null;
      this.warehouseId=null;
      this.purchaserId=null;
      this.search();
    },
    getStatusCount(){
    	getStatusCount().then(res=>{
        this.headerData=res.data
    	})
    },
    header_button_click(index,status){
        this.buttonshow=index;
        if(status==-1){
          this.status=-1;
        }else{
          this.status=status;
        }
    		this.requestData(index)
    },
    requestData(index){
      let n=index?index:this.buttonshow;
      this.page=1;
    		switch(n){
          case 0:
           this.getList()
    			break;
    			case 1:
            this.getList()
          break;
          case 2:
    		    this.getList()
    			break;
    			case 3:
    				this.getList()
          break;
    	}
    },
    supplierRemote(query){
        this.loading = true
        if(query){
          getListSupplierName(query).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.supplierNames=res.data
            }
          })
        }
    },
    changeSupplier(val){
      this.supplierId=val.id;
      this.supplierName=val.name
      this.purchaseType=val.purchaseType;
    },
    warehouseRemote(query){
      this.loading = true
        if(query){
          getWarehouseName({name:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
               this.warehouseName=res.data
            }
          })
        }
    },
    buyerRemote(query){
      var storage=window.localStorage;
      var UserInfo=storage.getItem("UserInfo");
      var userPosts=JSON.parse(UserInfo).userPosts;
      var organizationId=userPosts[0].organizationId
      this.loading = true
        if(query){
          getBuyerName({organizationId:organizationId,realName:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
               this.buyerName=res.data
            }
          })
        }
    },
    querySearch(query,cb) {
      this.remoteLoading = true;
      getSupplierName({name:query}).then(res=>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect(item) {
      this.customerId=item.id;
    },
    querySearch1(query,cb) {
      this.remoteLoading = true;
      nameList({username:query}).then(res=>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect1(item) {
      this.projectId=item.id;
    },
    querySearch2(query,cb) {
      this.remoteLoading = true;
       simpleList({username:query}).then(res=>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect2(item) {
      this.no=item.id;
    },
    querySearch3(query,cb) {
      this.remoteLoading = true;
       organizationListName({username:query}).then(res=>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect3(item) {
      this.organizationId=item.id;
    },
    getList(){
      getPurchaseApprovalList({
        deliveryType:this.deliveryType,
        endDate:this.endDate,
        pageNum:this.page,
        pageSize:this.pageSize,
        purchaseNo:this.purchaseNo,
        startDate:this.startDate,
        reviewStatus:this.status,
        supplierId:this.supplierId,
        purchaseType:this.purchaseType,
        warehouseId:this.warehouseId,
        purchaserId:this.purchaserId
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    retainDecimals(row, column){
      let amount=null;
      return amount='￥'+row.amount.toFixed(2);
    },
    changeUrgentLevel(row,column){
      if(row.urgentLevel==1){
        return '紧急';
      }else{
        return '不紧急';
      }
    },
    handleCurrentChange(val) {
      this.page=val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.getList();
    },
    createTimes(row,column){
      var ChangeDate= row.createTime.replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return ChangeDate;
    },
    querySearchAsync(queryString, cb) {
      targetCustomerName({
          name:this.targetCustomerName
        }).then(res=>{
          if(res.code=='000000'){
            this.customerNames =res.data;
            this.customerName=queryString;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(this.customerNames);
            }, 3000 * Math.random());
          }
        })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    goDetail(id){
      this.$router.push({
        name: "PurchaseDetail",
        query:{id:id}
      })
    },
    goApproval(id){
      this.$router.push({
        name: "PurchaseOrderApproval",
        query:{
          id:id,
          list:true
        }
      })
    },
    oncancel(formName) {
      this.$confirm('取消后，当前填写的信息将不保存，确定取消？', '取消确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].clearValidate();
      });
      this.dialogFormVisible=false;
    },
    showHelp(){
      this.isShow=!this.isShow;
    }

  }
};
</script>

<style scoped lang='less'>
  @color:#f3f3f3;
 .brandBox {
    width: 100%;
    box-sizing: border-box;
    /deep/.el-table{
      .el-button--small{
        padding: 4px 0;
      }
    }
    .buttonBox {
      margin-top: 10px;
      .active{
      	background-color: #339999;
      	border-color: #339999;
      	color: #FFFFFF;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-top: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        background-color: #f3f3f3;
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
        span{
        	cursor: pointer;
        }
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
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #e4e4e4;
        padding-top: 10px;
        /deep/.el-row{
          /deep/.el-col{
            display: flex;
            flex-wrap: nowrap;
          }
          .span-style{
            display:inline-block;
            width:100px;
            text-align:right;
            line-height: 40px;
          }
          .el-input {
            width: 50%;
            height: 40px;
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .el-select{
            width: 50%;
            height: 40px;
            margin-bottom: 10px;
            .el-input{
              width: 100%;
            }
          }
        }
        /deep/.time-box{
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .el-date-editor{
            width: 50%;
            height: 40px;
            margin-left: 0;
            margin-bottom: 0;
          }
          .text{
            line-height: 40px;
          }
        }
      }
    }
    .listBox {
      font-size: 12px;
      background-color:@color;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          margin-left: 10px;
          .myicon{
            margin-left: 20px;
            font-weight: bold;
            font-size: 20px;
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
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;
        .button-head{
          width: 80px;
          height: 30px;
          margin-right: 10px;
          border:1px solid #d1d1d1;
          cursor:pointer;
          background-color: #fff;
          line-height: 30px;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          .button-head-icon{
            margin-right: 5px;
          }
          .icon-add{
            font-size: 12px;
          }
        }
        .button-head:hover{
          background-color: #f3f3f3;
        }
        .el-button {
          width: 80px;
          height: 30px;
          margin-top: 10px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    /deep/.obsolete{
        .el-dialog{
          width: 60%;
          margin-top:0 ;
          .el-dialog__header{
            background-color:@color; 
          }
          .el-dialog__body{
            padding-top: 0;
            .el-froms{
              border:1px solid #e4e4e4;
              box-sizing: border-box; 
              margin-top: 30px;
              .form-box{
                overflow: auto;
                max-height: 532px;
              }
              table{
                width:100%;
                margin-top:0;
                td,th{
                  border: 1px solid #e4e4e4;
                  font-size:14px;
                  height:40px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                th{
                  padding-right:6px;
                  box-sizing: border-box;
                  color:#666;
                  background: #F9FAFC;
                  font-weight:700;
                  font-size: 14px;
                  text-align: right;
                  width:20%;
                  i{
                    color:red;
                  }
                }
                td{
                  color: #666666;
                  text-align: left;
                  padding-left:10px;
                  width:30%;
                }
              }
              /deep/.el-table{
                width:100%;
                margin:0 auto;
              }
            }

          }
          .el-dialog__footer{
            text-align: center;
              .el-button{
                width: 14%;
                margin-right:40px; 
              }
          }
        }
    }
    /deep/.billing{
      .el-dialog{
          width: 45%;
          overflow: auto;
          max-height: 70%;
          margin-top:0 ;
          .el-dialog__header{
            background-color:@color; 
          }
          .el-dialog__body{
            padding-top: 0;
            .el-row{
              padding:10px;
              span{
                color: red;
              }
            }
            h3{
              padding: 10px;
              background-color:@color;
            }
            .bill-from{
              margin-top:15px;
              .el-form-item__content{
                width:70%;
                .area-elect{
                  width: 154px;
                }
                .el-paytime{
                  display:inline-block;
                  width:35%;
                  .el-form-item__content{
                    width: 100%;
                    .el-input{
                      width: 100%;
                    }
                  }
                 
                }
                .el-textarea__inner{
                  max-height: 70px;
                  overflow: auto;
                }
              }
              .form-button-box{
                  display: flex;
                  margin-top: 15px;
                  justify-content: space-around;
                  .el-form-item__content{
                    text-align: center;
                  }
              }
              .form-box{
                overflow: auto;
                max-height: 532px;
              }
            }
          }
        }
    }
    .form-button-box{
        display: flex;
        margin-top: 15px;
        justify-content: space-around;
        .el-form-item__content{
          text-align: center;
        }
    }
    .block {
      margin-top: 2px;
      display: flex;
      justify-content: flex-end;
    }
    .my-scroll-bar{
      height:200px;
    }
  }
</style>