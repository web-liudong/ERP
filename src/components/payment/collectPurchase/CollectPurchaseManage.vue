<template>
  <div class="billListBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="(item,index) in buttonList"
        :key="index"
        :class="{active: isClick == item.status}"
        @click="changeTab(item.status)"
      > {{item.statusName}} （{{item.count}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="serchBoxTop">
        <div class="topLeft">
          <span class="iconfont iconsousuo"></span>
          <p>筛选查询</p>
        </div>
        <div class="topRight">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
                <i class="el-icon-arrow-up">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">展开筛选</i>
          </span>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" @click="select">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="serchBoxBottom" v-show="isShow">
          <div class="inputBox">
            <span>结算单编号：</span>
            <el-input placeholder="请输入结算单编号" v-model="findParam.billNo" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>创建日期：</span>
            <el-date-picker
              v-model="dataTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class="inputBox">
            <span>伙伴：</span>
            <el-select
              v-model="findParam.partnerName"
              remote
              filterable
              clearable
              placeholder="请输入伙伴名称"
              :remote-method="supplierMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in partnerNames"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>应收账款：</span>
             <el-input placeholder="￥0.00" v-model="findParam.lowerMoney" style="width:100px" clearable></el-input>
            <i style="margin-top:10px;margin-left:6px">-</i>
            <el-input placeholder="￥0.00" style="width:100px;margin-left:10px" v-model="findParam.higherMoney" clearable></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          <span>数据列表</span>
        </div>
        <div class="listRight">
          <el-button size="small" @click="createInvoice('createInvoice')" v-if="$authorities.CollectionBillApplyInvoice">
            <i class="iconfont iconwodekaipiaoshenqing"></i>
            <span>申请开票</span>
          </el-button>
          <el-button size="small" @click="openWin('CreateCollectPurchase')" v-if="$authorities.CollectionBillCreate">
            <i class="iconfont iconjiesuandan"></i>
            <span>创建结算单</span>
          </el-button>
          <el-button size="small" @click="openWin('MyInvoiceApply')" v-if="$authorities.CollectionBillInvoiceInfo">
            <i class="iconfont iconkaipiaoxinxi"></i>
            <span>开票申请</span>
          </el-button>
          <el-button size="small" @click="exportBillList" v-if="$authorities.CollectionBillExport">
            <i class="iconfont icondaochu"></i>
            <span>导出</span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table :data="tableData" border style="width: 100%" :max-height="dataListHeight" :header-cell-style="tableStyle" @selection-change="(selection)=>{
              handleSelectionChange(selection)   
            }">
          <el-table-column type="selection" :selectable="checkSelectable"></el-table-column>  
          <el-table-column prop="billNo" label="结算单编号" align="center" width="150"></el-table-column>
          <el-table-column prop="createTime" label="创建日期" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="结算单名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="amountText" label="结算单金额" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.amountText!=''&&scope.row.amountText!=null"></span>
              <span>{{scope.row.amountText}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="伙伴" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="creatorName" label="制单员" align="center"></el-table-column>
          <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="statusText" label="状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="scope.row.canEdit==true&&$authorities.CollectionBillEditer"
                @click="openWin('EditerCollectPurchase',{'id':scope.row.id})"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.CollectionBillDetail"
                @click="openWin('CollectPurchaseDetail',{'id': scope.row.id})"
              >详情</el-button>
              <el-button type="text" size="small" @click="cancelApproval(scope.row)"
               v-if="scope.row.statusText=='待付款'&&$authorities.CollectionBillCancel">
                取消</el-button>
              <!-- <el-button type="text" size="small" @click="completeApproval(scope.row)"
               v-if="scope.row.statusText=='待付款'">
                完成</el-button>   -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="findParam.pageNum"
          :page-size="findParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    <applyInvoice ref="applyInvoice" :InvoiceTitle="Title" @invoiceCallback="invoiceCallback"></applyInvoice>
  </div>
</template>

<script>
import {
 getCollectPurchaselist,
 getCollectPurchaseStatus,
 cancelCollectPurchaseList,
 completeCollectPurchaseList,
 purchaseListExport,
 findOrganization,
} from "@/api/payment/paymentCollectPurchase";
import {applyInvoiceCheck} from '@/api/payment/collectionPurchaseInvoice'
import applyInvoice from './child/apply_invoice.vue'
export default {
  inject:["reload","isFilterShow"],
  name: "CollectPurchaseManage",
  data() {
    return {
      Title:'申请开票',
      buttonList: [],
      isClick: null,
      isShow: this.isFilterShow,
      dataTime: null,
      total: 0,
      loading: false,
      partnerNames: [],
      //查询对象
      findParam: {
        billNo: null, //采购结算单编号
        createTimeEnd: null, //结束时间
        createTimeStart: null, //开始时间
        higherMoney:null,//应付账款结束值
        lowerMoney:null,//应付账款起始值
        pageNum: 1, //页码
        pageSize: 10, //每页大小
        partnerName: null, //伙伴名称
        status: null //状态名称 {UN_PAYMENT，PART_PAYMENT，COMPLETE，CANCEL }
      },
      //表格table
      tableData: [],
      multipleSelection:[],
      //表头样式
      tableStyle: {
        background: "#f5f7fa"
      }
    };
  },
  created() {
    // this.statusCount();
    this.changeTab(this.isClick);
  },
  components:{
   applyInvoice
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset() {
      this.findParam.billNo = null; //采购结算单编号
      this.findParam.createTimeEnd = null; //结束时间
      this.findParam.createTimeStart = null; //开始时间
      this.dataTime = null;
      this.findParam.higherMoney = null;//应付账款结束值
      this.findParam.lowerMoney = null;//应付账款起始值
      this.findParam.pageNum = 1; //页码
      this.findParam.pageSize = 10; //每页大小
      this.findParam.partnerName =  null; //伙伴名称
      this.findParam.status =  null //状态名称 {UN_PAYMENT，PART_PAYMENT，COMPLETE，CANCEL }
      this.changeTab(this.isClick);
    },
    invoiceCallback(){
     this.changeTab(this.isClick)
    },
    //获取顶部button的数量个状态
    statusCount() {
      getCollectPurchaseStatus().then(res => {
        if (res.code === "000000") {
          this.buttonList = res.data;
        }
      });
    },
    checkSelectable(row){
     if(row.statusText=='已取消'){
       return false
     }else{
      return !row.checked
     } 
     
    },
    //取消
    cancelApproval(row){
     this.$confirm('确定取消该结算单？取消后结算单涉及商品将重新可选','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
     }).then(()=>{
      cancelCollectPurchaseList(row.id).then(res=>{
      if(res.code=='000000'){
        this.$message({
          message:'取消结算单成功',
          type:'success'
        })
        this.changeTab(this.isClick);
        this.statusCount();
      }
      })
     }).catch(()=>{
     }) 
    },
    createInvoice(type){
    let arr=[];
    arr=this.multipleSelection.map((item,i)=>{
      return item.partnerId
    }) 
    if(!arr.length){
     this.$confirm('请先勾选结算单数据','提示',{
       confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'warning'
        }).then(res=>{}).catch(()=>{}) 
    }else{
     applyInvoiceCheck({partnerIds:arr}).then(res=>{
       if(res.code=='000000'){
        
       let totalPlice =  this.multipleSelection.map((item)=>{
        return item.amountText=='--'?0:Number(item.amountText.replace('￥',''))
      }).reduce((prev,cur)=>{
        return prev+cur
      },0)
      let ids=this.multipleSelection.map((item)=>{
        return item.id
      })
      let partnerId=this.multipleSelection.map((item)=>{
        return item.partnerId
      }) 
        this.$refs.applyInvoice.init(type,{totalPlice:totalPlice,partnerName:this.multipleSelection[0].partnerName,ids:ids,partnerId:partnerId})   
        // 把伙伴名称即服务方名称，已选结算单总金额传过去  （无数据时暂时处理）  
       }else{
         this.$confirm('只能针对同一服务方的结算单发起开票申请','操作失败',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'warning'
         }).then(res=>{

         }).catch(()=>{})
       }
    }) 
    }             
    },
    handleSelectionChange(selection){
     this.multipleSelection=selection;
    },
    //完成
    completeApproval(row){
      completeCollectPurchaseList(row.id).then(res=>{
        if(res.code=='000000'){
          this.$message({
            message:'该结算单完成成功',
            type:'success'
          })
          this.changeTab(this.isClick)
          this.statusCount();
        }          
      })
    },
    //导出
    exportBillList(){
      purchaseListExport(this.findParam).then(res => {
          if (!res) {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else {
            this.download(res.data);
          }
        })
        .catch(err => {
          this.$message.error("没有导出任何数据");
        });
    },
    download(data) {  
      let href = `/api/file-service/file/download?id=${data}&access_token=${this.$auth.token}`
         window.open(href,'blank');
    },
    //改变按钮
    
    changeTab(val) {
      this.isClick = val;
      this.findParam.status=val;
      this.findParam.createTimeStart = this.dataTime ? this.dataTime[0] : null;
      this.findParam.createTimeEnd = this.dataTime ? this.dataTime[1] : null;
      console.log(val, "oooopp");
      //获取全部结算列表
        getCollectPurchaselist(this.findParam).then(res => {
          if (res.code == "000000") {
            this.tableData = res.data.items;
            this.findParam.pageNum = res.data.pageNum;
            this.findParam.pageSize = res.data.pageSize;
            this.total = res.data.total;
            console.log(this.tableData,'whp9999');
            
          }
        });
        this.statusCount();
    },
    //查询结果
    select() {
      this.changeTab(this.isClick);
    },
    //服务方模糊查询
    supplierMethod(query) {
      if (query !== "") {
        this.loading = true;
        findOrganization({ name: query }).then(res => {
          this.loading = false;
          this.partnerNames = res.data;
        });
      } else {
        this.partnerNames = [];
      }
    },
    // //新建集采结算单
    // createBillList() {
    //   this.$router.push({name: "CreateCollectPurchase"})
    // },
    //跳转到编辑页
    openWin(name, query) {
    this.$router.push({
      name: name,
      query: query
    })
    },
    //跳转页数
    handleCurrentChange(val) {
      console.log(val, "页数");
      this.findParam.pageNum=val;
      this.changeTab(this.isClick)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findParam.pageSize = val;
      this.changeTab(this.isClick);
    },
  }
};
</script>
<style scoped>
.billListBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
<style lang='less' scoped>
.billListBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
    }
  }
  .filterBox {
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    .serchBoxTop {
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      .topLeft {
        display: flex;
        span {
          padding: 0 5px 0 20px;
        }
      }
      .topRight {
        display: flex;
        align-items: center;
        &:last-child {
          margin-right: 20px;
        }
        .el-button {
          margin-left: 10px;
          i {
            padding-right: 5px;
          }
        }
      }
    }
    .serchBoxBottom {
      margin-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 40%;
        margin: 10px;
        display: flex;
        flex-wrap: nowrap;
        margin-left: 50px;
        .el-input {
          width: 200px;
        }
        .el-select {
          width: 200px;
        }
        span {
          display: flex;
          width: 100px;
          align-items: center;
          justify-content: flex-end;
          padding-right: 10px;
        }
      }
    }
  }
  .listBox {
    border: 1px solid #e4e4e4;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f3f3f3;
      height: 50px;
      .listLeft {
        i {
          padding: 0 5px 0 20px;
        }
      }
      .listRight {
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  }
  .block {
    margin: 5px;
    text-align: right;
  }
}
</style>
