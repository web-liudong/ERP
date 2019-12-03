<template>
  <el-dialog title="数据列表" :visible.sync="isShow" width="80%" append-to-body :before-close="closeDialog">
     <el-table 
          ref="multipleTable"
          :data="PurchaseOrderDTO"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%"
          size="small"
          :row-key="getRowKey">
          <el-table-column type="selection" :selectable="checkSelectable" :reserve-selection="true"></el-table-column>
          <el-table-column
            prop="purchaseOrderNo"
            label="采购单编号"
            align="center"
            width="150">
           <template slot-scope="scope">
                <el-input v-model="FindPurchaseOrderParam.purchaseOrderNo" @input="findName" debounce="300" v-if="scope.row.showList"></el-input>
                <span v-else>{{scope.row.purchaseOrderNo}}</span>
            </template> 
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建日期"
            align="center">
          </el-table-column>
          <el-table-column
            prop="includeTaxText"
            label="是否含税"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="采购单金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商"
            align="center">
          </el-table-column>
          <el-table-column
            prop="purchaserName"
            label="采购员"
            align="center">
            <template slot-scope="scope">
                <el-input v-if="scope.row.showList" v-model="FindPurchaseOrderParam.purchaserName" @input="findName"></el-input>         
                <!-- <el-select
              v-model="FindPurchaseOrderParam.purchaserName"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder=""
              :remote-method="getListName"
              :loading="loading"
              v-if="scope.row.showList"
              
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select> -->
             <span v-else>{{scope.row.purchaserName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payTypeText"
            label="结款方式" align="center">
          </el-table-column> 
           <el-table-column
            prop="invoiceTypeText"
            label="发票类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="memo"
            label="操作"
            align="center">
            <template slot-scope="scope">
                <el-button type="text" v-model="scope.row.memo" v-if="!scope.row.showList" @click="gotoDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="FindPurchaseOrderParam.pageNum"
            :page-sizes="[10,20,30,40,50,100,500]"
            :page-size="FindPurchaseOrderParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="submitForm('createPurchase')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { findPurchaseData ,byTokenGetUserList ,byOrganizationUserList } from "@/api/purchase/purchaseBillList";
export default {
  props: {},
  data() {
    return {
      isShow: false,   
      PurchaseOrderDTO:null,  
      FindPurchaseOrderParam:{
          pageNum:1,
          pageSize:10,
          purchaseOrderNo:'',
          purchaserName:null,
          purchaseOrderIdSet:[],
          supplierId:null,//供应商id
      },
      total: 0,
      multipleSelection:[],
      options:[],//采购人集合
      loading:false,
      organizationId:null,
    };
  },
  mounted() {},
  methods: {
    getRowKey (row) {
      return row.id
    },
    init(name,arr,id) {
      console.log(arr)
      this.FindPurchaseOrderParam.purchaseOrderIdSet=arr;
      this.FindPurchaseOrderParam.supplierId=id;
      this.getDetail();
      // findPurchaseData(this.FindPurchaseOrderParam).then(res=>{
      //     if(res.code=='000000'){
      //     this.PurchaseOrderDTO=[{supplierName:'',createTime:'',purchaseOrderNo:'',amount:'',showList:true},...res.data.items];
      //     }
      // })
      // this.PurchaseOrderDTO=[{supplierName:'',createTime:'',purchaseOrderNo:'',amount:'',showList:true}]
      this.isShow = true;
    },
    handleSizeChange(val) {
      this.FindPurchaseOrderParam.pageSize = val;
      this.getDetail();
    },
    handleCurrentChange(val) {
      this.FindPurchaseOrderParam.pageNum = val;
      this.getDetail();
    },
    getDetail() {
      findPurchaseData(this.FindPurchaseOrderParam).then(res => {
        this.PurchaseOrderDTO = [
          {
            supplierName: "",
            createTime: "",
            purchaseOrderNo: "",
            amount: "",
            showList: true
          },
          ...res.data.items
        ];
        this.FindPurchaseOrderParam.pageSize = res.data.pageSize;
        this.FindPurchaseOrderParam.pageNum = res.data.pageNum;
        this.total = res.data.total;
      });
    },
    handleSelectionChange(val){
      this.multipleSelection=val;
    },
    checkSelectable(row){
     return !row.showList
    },
    closeDialog(done){
       done();
       this.FindPurchaseOrderParam.purchaseOrderNo='';
       this.FindPurchaseOrderParam.purchaserName='';
       this.clearSelect()    
    },
    clearSelect() {
      this.FindPurchaseOrderParam.pageNum = 1;
      this.FindPurchaseOrderParam.pageSize = 10;
      this.$refs.multipleTable.clearSelection(); 
    },
    getListName(query){
      let str = window.localStorage.getItem("TokenKey");  
       byTokenGetUserList(str).then(res=>{
        console.log(res,55555)
       this.organizationId=res.data.userPosts[0]&&res.data.userPosts[0].organizationId; 
      }).then(res=>{
        if(this.organizationId){
           byOrganizationUserList({organizationId:this.organizationId,realName:query}).then(res=>{
             if(res.code=='000000'){
               this.options=res.data;
             }
           })
        }
      })
    },
    findName(value){
      // this.FindPurchaseOrderParam.purchaserName=value;
      this.init('createPurchase',this.FindPurchaseOrderParam.purchaseOrderIdSet,this.FindPurchaseOrderParam.supplierId)
    },
    gotoDetail(row){
     this.$router.push({
       name: "PurchaseDetail",
       query: { id:row.id }
     })
     this.cancel();
    },
    cancel(){
     this.FindPurchaseOrderParam.purchaseOrderNo='';
     this.FindPurchaseOrderParam.purchaserName='';
     this.clearSelect() 
     this.isShow=false;
      
    },
    submitForm(name) {
          let arr=[];
         arr=this.multipleSelection.map((item,index)=>{
         return item.id;
          })
         console.log(arr,'88');
         this.$emit('dialogcallback',name,arr) 
         this.isShow=false;
         this.FindPurchaseOrderParam.purchaseOrderNo='';
         this.FindPurchaseOrderParam.purchaserName='';
         this.clearSelect() 
        }
  }
};
</script>
<style scoped lang="less">
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-textarea{
  width: 445px;
}
.el-table {
  margin-bottom: 10px;
}
.block {
  float: right;
}
</style>