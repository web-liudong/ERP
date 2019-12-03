<template>
  <div class="brandBox">
    <div class="buttonBox">
        <div style="margin:10px 20px 10px 0;float:right;">
         <!-- <input type="file" @change="importFile(this)" id="imFile" style="display: none"
           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/> -->
         <!-- <a style="margin-right:10px;color:#169BD5" @click="download">下载导入模板</a> -->
         <!-- <el-button size="small" class="active" @click="getTableData">导入</el-button> -->
         <el-button size="small" class="active" @click="showDialog('importFile')">导入</el-button>
        </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconsousuo"></i>明细信息</span>
        <div class="listBoxCenter" v-if="!useLeadingWMS">
            <span> <i class="iconfont iconsousuo"></i>订单需求</span>
         <div class="listBoxRight">
           <div class="white-btn fun-btn" @click="addOrderDemand('addOrderDemand','订单需求')" style="width:120px"
          ><i class="iconfont icon-icon-test"></i>添加</div>
           <div class="white-btn fun-btn" @click="clearOrderList('order')">
            <i class="iconfont icon-icon-test"></i>移除</div>
        </div>
            <el-table
          :data="orderData"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%"
          size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            prop="id"
            label="序号"
            align="center"
            width="60">
           <template slot-scope="scope">
                {{scope.$index+1}}
            </template>
          </el-table-column>

          <el-table-column
            prop="urgentLevel"
            label="紧急"
            align="center">
            <template slot-scope="scope">
                {{scope.row.urgentLevel|dd}}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="发货单号"
            align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.orderNo" type="text" @click="openWin('InvoiceDetail',{'id':scope.row.orderId})">{{scope.row.orderNo}}</el-button>  
              </template>  
          </el-table-column>
          <el-table-column
            prop="skuNo"
            label="商品编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="requirementQty"
            label="需求数量"
            align="center">
            <template slot-scope="scope">
                <el-input v-model="scope.row.requirementQty" clearable type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库" align="center">
            <template slot-scope="scope">
           <el-select
              v-model="scope.row.warehouseName"
              filterable
            remote
            clearable
            reserve-keyword
            placeholder="仓库"
            :remote-method="remoteMethod"
            @change="getUsername(scope.row.warehouseName,scope.$index,'订单需求')"
            :loading="loading">
          <el-option
             v-for="item in optionsWarehouse"
            :key="item.id"
            :label="item.name"
            
            :value="item.id">
           </el-option>
          </el-select>
            </template>
          </el-table-column> 
           <el-table-column
            prop="recipientAddressLine"
            label="仓库地址"
            align="center" show-overflow-tooltip width="140">
              <template slot-scope="scope">
                <span v-if="scope.row.warehouseName!=0">{{scope.row.recipientAddressLine}}</span>
                <el-input v-if="scope.row.warehouseName==0" placeholder="请输入仓库地址" v-model="scope.row.recipientAddressLine" clearable></el-input>
            </template> 
          </el-table-column>
          <el-table-column
            prop="memo"
            label="备注说明"
            align="center">
            <template slot-scope="scope">
                <el-input v-model="scope.row.memo"></el-input>
            </template>
          </el-table-column>
        </el-table>
        </div>
        <div class="listBoxCenter" v-if="!useLeadingWMS" >
            <span> <i class="iconfont iconsousuo"></i>安全库存需求</span>
         <div class="listBoxRight">
           <div class="white-btn fun-btn" @click="addOrderDemand('addSatefystockDemand','SAFETY_STOCK_DEMAND')" style="width:120px"><i class="iconfont icon-icon-test"></i>添加</div>
           <div class="white-btn fun-btn" @click="clearOrderList('satefystock')">
            <i class="iconfont icon-icon-test"></i>移除</div>
        </div>
            <el-table
          :data="satefyStockData"
          border
          @selection-change="handlesafetyStockSelectionChange"
          style="width: 100%"
          size="small">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            label="序号"
            align="center"
            width="60">
            <template slot-scope="scope">
                {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="urgentLevel"
            label="紧急"
            align="center">
            <template slot-scope="scope">
                {{scope.row.urgentLevel|dd}}
            </template>
          </el-table-column>
          <el-table-column
            prop="skuNo"
            label="商品编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="requirementQty"
            label="需求数量"
            align="center">
            <template slot-scope="scope">
                <el-input v-model="scope.row.requirementQty" clearable type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库" align="center">
             <template slot-scope="scope">
           <el-select
              v-model="scope.row.warehouseName"
              filterable
            remote
            clearable
            reserve-keyword
            placeholder="仓库"
            :remote-method="remoteMethod"
            @change="getUsername(scope.row.warehouseName,scope.$index,'SAFETY_STOCK_DEMAND')"
            :loading="loading">
          <el-option
             v-for="item in optionsWarehouse"
            :key="item.id"
            :label="item.name"
            :value="item.id">
           </el-option>
          </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="recipientAddressLine"
            label="仓库地址" align="center" show-overflow-tooltip width="140">
             <template slot-scope="scope">
                <span v-if="scope.row.warehouseName!=0">{{scope.row.recipientAddressLine}}</span>
                <el-input v-if="scope.row.warehouseName==0" placeholder="请输入仓库地址" v-model="scope.row.recipientAddressLine" clearable></el-input>
            </template> 
          </el-table-column>  
          <el-table-column
            prop="memo"
            label="备注说明" align="center">
            <template slot-scope="scope">
                <el-input v-model="scope.row.memo"></el-input>
            </template>
          </el-table-column>  
        </el-table>
        </div>
        <div class="listBoxCenter">
            <span> <i class="iconfont iconsousuo"></i>自定义需求</span>
         <div class="listBoxRight">
           <div class="white-btn fun-btn" @click="addOrderDemand('addSatefystockDemand','CUSTOM_DEMAND')" style="width:120px"><i class="iconfont icon-icon-test"></i>添加</div>
           <div class="white-btn fun-btn" @click="clearOrderList('custom')">
            <i class="iconfont icon-icon-test"></i>移除</div>
        </div>
            <el-table
          :data="customData"
          border
          @selection-change="handleCustomSelectionChange"
          style="width: 100%"
          size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            prop="id"
            label="序号"
            align="center"
            width="60">
            <template slot-scope="scope">
                {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="urgentLevel"
            label="紧急"
            align="center">
            <template slot-scope="scope">
                {{scope.row.urgentLevel|dd}}
            </template>
          </el-table-column>
          <el-table-column
            prop="skuNo"
            label="商品编号"
            align="center">    
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="requirementQty"
            label="需求数量"
            align="center"> 
            <template slot-scope="scope">
                <el-input v-model="scope.row.requirementQty" clearable type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库" align="center">
             <template slot-scope="scope"> 
            <el-select
              v-model="scope.row.warehouseName"
              filterable
            remote
            clearable
            reserve-keyword
            placeholder="仓库"
            :remote-method="remoteMethod"
            @change="getUsername(scope.row.warehouseName,scope.$index,'CUSTOM_DEMAND')"
            :loading="loading">
          <el-option
             v-for="item in optionsWarehouse"
            :key="item.id"
            :label="item.name"
            :value="item.id">
           </el-option>
          </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="recipientAddressLine"
            label="仓库地址" align="center">
             <template slot-scope="scope">
                <span v-if="scope.row.warehouseName!=0">{{scope.row.recipientAddressLine}}</span>
                <el-input v-if="scope.row.warehouseName==0" placeholder="请输入仓库地址" v-model="scope.row.recipientAddressLine" clearable></el-input>
            </template> 
          </el-table-column>  
          <el-table-column
            prop="memo"
            label="备注说明" align="center">
           <template slot-scope="scope">
                <el-input v-model="scope.row.memo" clearable></el-input>
            </template>
          </el-table-column> 
        </el-table>
        </div>
      </div>
    </div>
    <div class="blockButtonBox">
        <el-button class="active" @click="submit()">保存</el-button>
        <el-button class="active" @click="cancelData()">取消</el-button>
    </div>
    <addOrderDemand ref="addOrderDemand" @dialogBack="dialogBack"></addOrderDemand>
    <addSatefystockDemand ref="addSatefystockDemand" @satefyDialog="satefyDialog"></addSatefystockDemand>
    <cancelData ref="cancelData"></cancelData>
    <importFile :title="'采购需求导入'" :type="importType" ref="importFile" @dialogCallBackPayment="dialogCallBackPayment"></importFile>
  </div>
</template>
<script>
  import store from '@/store/store';
  import elDragDialog from '@/directive/el-dragDialog'
  import addOrderDemand from './child/add_orderDemand'
  import cancelData from './child/cancel_data'
  import addSatefystockDemand from './child/add_satefystockDemand'
  import { formatString } from "@/utils";
  import {downloadFile,createPurchaseDemand,findWarehouse,getOrganization,byTokenGetUserList,downloadTemplatePurchaseDemand,purchaseRequirementImport,findWarehouseName,getSkuId} from '@/api/purchase/purchase.js'
   import XLSX from 'xlsx'
import { setTimeout } from 'timers';
import importFile from "@/components/common/module/ImportFile";
// import { mapState } from 'vuex'
import { stat } from 'fs';
  export default {
    inject: ['reload','close'],
    name:'CreatePurchaseDemand',
    data() {
      return {
        aa: null,
        bb: null,
        ccc: [],
        resultArray: null,
        tableData: [],
        orderData:[],//订单需求数据
        satefyStockData:[],//安全库存需求数据
        customData:[],//自定义需求数据,
        loading:false,
        optionsWarehouse:null,
        organizationId:null,//组织机构id
        useLeadingWMS:null,//是否用wms
        importType: "purchase-demand-import",
        options:[],
        multipleOrderSelection:[],
        multipleSafetyStockSelection:[],
        multipleCustomSelection:[],
        paginations: {
          total: 100,//总数
        },
        headertoken: { Authorization: "Bearer " + this.$auth.token }
      }
    },
    directives:{
      elDragDialog
    },
    computed:{
      // ...mapState({
      //   count:state => state.user
      // })
    },
    components:{
     addOrderDemand,addSatefystockDemand,cancelData,importFile
    },
    filters:{
      dd(value){
        return value==0?'不紧急':value==1?'紧急':''
      }
    },
    created() {
         let str = window.localStorage.getItem("UserInfo");
         let userPosts=JSON.parse(str).userPosts;
         this.organizationId=userPosts[0].organizationId;
        if(this.organizationId){
         this.getTableList();
        }
    },
    activated(){
         let str = window.localStorage.getItem("UserInfo");
         let userPosts=JSON.parse(str).userPosts;
         if(userPosts[0].organizationId&&this.organizationId!=userPosts[0].organizationId){
           this.organizationId=userPosts[0].organizationId;
           this.getTableList()
         }
    },
    methods: {
      satefyDialog(value){
       if(value.requirementType==1){
         this.satefyStockData.push(value)
       }
       if(value.requirementType==2){
         this.customData.push(value)
       }
      },
      dialogCallBackPayment(data){
        data.succeedDTO&&data.succeedDTO.forEach((item)=>{
            if(item.urgentLevel=='不紧急'){
              item.urgentLevel=0
            }
            if(item.requirementType=='自定义需求'||item.requirementType=='自定义'){
               item.requirementType=2
            }
            if(item.requirementType=='安全库存需求'||item.requirementType=='安全库存'){
              item.requirementType=1;
            }
            if(item.requirementType=='订单需求'||item.requirementType=='订单'){
              item.requirementType=0;
              }
            if(item.urgentLevel=='紧急'){
              item.urgentLevel=1
            }
            if(item.warehouseName){
             findWarehouse({organizationId:this.organizationId,name:item.warehouseName}).then(res=>{
                    if(res.data.length){
                      let str=res.data[0].provinceName+' '+res.data[0].cityName+' '+res.data[0].countyName+' '+res.data[0].addressLine;
                      this.$set(item,'recipientAddressLine',str)
                      this.$set(item,'warehouseId',res.data[0].id)
                      this.$set(item,'recipientAddressProvinceId',res.data[0].provinceId)
                      this.$set(item,'recipientAddressCityId',res.data[0].cityId)
                      this.$set(item,'recipientAddressCountyId',res.data[0].countyId)                
                    }   
            })
            }       
          })
          this.customData=data.succeedDTO.filter((item,index)=>{
            return item.requirementType==2
          })
          this.satefyStockData=data.succeedDTO.filter((item,index)=>{
            return item.requirementType==1
          })
          this.orderData=data.succeedDTO.filter((item,index)=>{
            return item.requirementType==0
          })
          if(data.defeatedDTO.length){
            this.$confirm('部分信息填写错误,将会过滤掉，是否查看？','提示',{
               confirmButtonText: '点击查看',
               cancelButtonText: '取消',
               type: 'warning'
              }).then(res=>{
              data.defeatedDTO=data.defeatedDTO.map((item)=>{
                return {requirementType:item.requirementType,urgentLevel:item.urgentLevel,orderNo:item.orderNo,skuNo:item.skuNo,skuName:item.skuName,requirementQty:item.requirementQty,warehouseName:item.warehouseName,memo:item.memo,errorMemo:item.errorMemo}
              })
               this.tableToExcel(data.defeatedDTO) 
              }).catch(()=>{
              }) 
          }
      },
     tableToExcel(jsonData){
      //要导出的json数据
      //列标题，逗号隔开，每一个逗号就是隔开一个单元格
      let str = `需求来源,紧急程度,发货单编号,商品编号,商品名称,需求数量,仓库,备注说明,错误原因\n`;
      //增加\t为了不让表格显示科学计数法或者其他格式
      for(let i = 0 ; i < jsonData.length ; i++ ){
        for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;     
        }
        str+='\n';
      }
      //encodeURIComponent解决中文乱码
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download =  "采购需求错误信息数据表.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      },
      showDialog(type, row) {
      this.$refs[type].init(row);
      },
      getTableList(){
       getOrganization(this.organizationId).then(res=>{
         this.useLeadingWMS=res.data.useLeadingWMS;
       })
      },
       dialogBack(value){
        value.forEach((item)=>{
          this.orderData.push(item)
        })
       },
      remoteMethod(query){
      if (query !== '') {
          this.loading = true;
          let aa={organizationId:this.organizationId,name:query}
         findWarehouse(aa).then(res=>{
           this.optionsWarehouse=res.data;
          //  this.optionsWarehouse=[{id:0,name:'无'},...this.optionsWarehouse];
           this.loading=false
         })
        } else {
          this.optionsWarehouse = [];
        }
      },
     getUsername(value,index,type){
       if(type=='订单需求'){
        if(value==0){
         this.orderData[index].recipientAddressLine='';
         this.orderData[index].warehouseId=0;
       }else{
        let aa=JSON.parse(JSON.stringify(this.optionsWarehouse));
         aa = aa&&aa.filter((item,index)=>{
          return item.id==value
        })
        this.orderData[index].recipientAddressLine=aa[0]&&aa[0].provinceName+' '+aa[0].cityName +' '+ aa[0].countyName +' '+ aa[0].addressLine;
        this.orderData[index].recipientAddressProvinceId=aa[0]&&aa[0].provinceId;
        this.orderData[index].recipientAddressCityId=aa[0]&&aa[0].cityId;
        this.orderData[index].recipientAddressCountyId=aa[0]&&aa[0].countyId;
        this.orderData[index].warehouseId=aa[0]&&aa[0].id;
       }
       }
       if(type=='SAFETY_STOCK_DEMAND'){
         if(value==0){
           this.satefyStockData[index].recipientAddressLine='';
           this.satefyStockData[index].warehouseId=0;
         }else{
           let bb=JSON.parse(JSON.stringify(this.optionsWarehouse));
           bb= bb&&bb.filter((item,i)=>{
             return item.id==value;
           })
        this.satefyStockData[index].recipientAddressLine=bb[0]&&bb[0].provinceName+' '+bb[0].cityName +' '+ bb[0].countyName +' '+ bb[0].addressLine;
        this.satefyStockData[index].recipientAddressProvinceId=bb[0]&&bb[0].provinceId;
        this.satefyStockData[index].recipientAddressCityId=bb[0]&&bb[0].cityId;
        this.satefyStockData[index].recipientAddressCountyId=bb[0]&&bb[0].countyId;  
        this.satefyStockData[index].warehouseId=bb[0]&&bb[0].id;
         }
       }
       if(type=='CUSTOM_DEMAND'){
          if(value==0){
           this.satefyStockData[index].recipientAddressLine='';
           this.satefyStockData[index].warehouseId=0;
         }else{
           let cc=JSON.parse(JSON.stringify(this.optionsWarehouse));
           cc= cc&&cc.filter((item,i)=>{
             return item.id==value;
           })
        this.customData[index].recipientAddressLine=cc[0]&&cc[0].provinceName+' '+cc[0].cityName +' '+ cc[0].countyName +' '+ cc[0].addressLine;
        this.customData[index].recipientAddressProvinceId=cc[0]&&cc[0].provinceId;
        this.customData[index].recipientAddressCityId=cc[0]&&cc[0].cityId;
        this.customData[index].recipientAddressCountyId=cc[0]&&cc[0].countyId; 
        this.customData[index].warehouseId=cc[0]&&cc[0].id;
         }
       }  
       },
        download(){
          let href=formatString('/api/file-service/file/download/latest?access_token={token}&type=Purchase_Requirement_Import_Template',{token:this.$auth.token})
          window.open(href,'_blank')
        },
       addOrderDemand(type,name){
         this.$refs[type].init(name)
       },
       openWin(name,query){
         this.$router.push({name:name,query:query})
       },
       clearOrderList(type,$index){
           if(type=='order'){
            if(!this.multipleOrderSelection.length){
              this.$confirm('请选择要移除的项','移除提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
              }).then(res=>{
              }).catch(()=>{
              })          
          }else{  
           let orderarr=[];
           orderarr=this.multipleOrderSelection.map((item,i)=>{
            return item.longId
           })
            for(let i=0; i<this.orderData.length;i++){
              let item=this.orderData[i];
              if(orderarr.includes(item.longId)){
                this.orderData.splice(i,1);
                i--;
              }
            }
            }     
           } 
           if(type=='satefystock'){
            if(!this.multipleSafetyStockSelection.length){
              this.$confirm('请选择要移除的项','移除提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
              }).then(res=>{
              }).catch(()=>{})
            }else{
              let arr=[];
            arr=this.multipleSafetyStockSelection.map((item,i)=>{
            return item.longId
           })
           for(let i=0; i<this.satefyStockData.length;i++){
              let item=this.satefyStockData[i];
              if(arr.includes(item.longId)){
                this.satefyStockData.splice(i,1);
                i--;
              }
            }
            }
           }
           if(type=='custom'){
            if(!this.multipleCustomSelection.length){
              this.$confirm('请选择要移除的项','移除提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
              }).then(res=>{
              }).catch(()=>{})
            }else{
              let customarr=[];
            customarr=this.multipleCustomSelection.map((item,i)=>{
            return item.longId
            })
            for(let i=0; i<this.customData.length;i++){
              let item=this.customData[i];
              if(customarr.includes(item.longId)){
                this.customData.splice(i,1);
                i--;
              }
            }
            }   
           }
       },
       cancelData(){
        this.$refs.cancelData.init()
       },
       getSkuId(aa) {
          var newArray = aa.map(item => {
           return item.skuNo
           })
           getSkuId(newArray).then(res => {
           for (var key in res.data) {
            for (var i = 0 ;i<aa.length;i++) {
              if(aa[i].skuNo == key) {
                aa[i].skuId = res.data[key]
              }
            }
           }
           [...this.multipleCustomSelection] = aa;
           return console.log(aa,'000000');
         }).catch(err => {
           console.log(err);
         })
       },
       getSkuId1(aa) {
          var newArray = aa.map(item => {
           return item.skuNo
           })
           getSkuId(newArray).then(res => {
             console.log(res);
           for (var key in res.data) {
            for (var i = 0 ;i<aa.length;i++) {
              if(aa[i].skuNo == key) {
                aa[i].skuId = res.data[key]
              }
            }
           }
           [...this.multipleOrderSelection] = aa;
           return console.log(aa,'000000');
         }).catch(err => {
           console.log(err);
         })
       },
       getSkuId2(aa) {
          var newArray = aa.map(item => {
           return item.skuNo
           })
           getSkuId(newArray).then(res => {
             console.log(res);
           for (var key in res.data) {
            for (var i = 0 ;i<aa.length;i++) {
              if(aa[i].skuNo == key) {
                aa[i].skuId = res.data[key]
              }
            }
           }
           [...this.multipleSafetyStockSelection] = aa;
           return console.log(aa,'000000');
         }).catch(err => {
           console.log(err);
         })
       },     
       submit(){
         this.getSkuId([...this.multipleCustomSelection])
         this.getSkuId1([...this.multipleOrderSelection])
         this.getSkuId2([...this.multipleSafetyStockSelection])
         console.log([...this.multipleOrderSelection,...this.multipleSafetyStockSelection,...this.multipleCustomSelection],'8888888');
         setTimeout(() => {
           createPurchaseDemand([...this.multipleOrderSelection,...this.multipleSafetyStockSelection,...this.multipleCustomSelection]).then(res=>{
           if(res.code=='000000'){
             this.$message({
               message:'保存成功',
               type:'success'
             })
             this.close({name:'CreatePurchaseDemand',to:{name:'PurchaseDemand',params:{isUpdate:true}}})
           }
         })
         }, 500);
       },
       handleSelectionChange(value){
          this.multipleOrderSelection=value; 
          // this.multipleOrderSelection.forEach((item,i)=>{
          //      this.$set(item,'longId',i)
          // })
       },
       handlesafetyStockSelectionChange(value){
         this.multipleSafetyStockSelection=value
        //  this.multipleSafetyStockSelection.forEach((item,i)=>{
        //        this.$set(item,'longId',i)
        //   })
       },
       handleCustomSelectionChange(value){
         console.log(value,'999');
         this.multipleCustomSelection=value
        //  var newArray = value.map(item => {
        //    return item.skuNo
        //  })
        //  getSkuId(newArray).then(res => {
        //    for (var key in res.data) {
        //     console.log(res.data[key],'3');
        //     // this.resultArray.push(res.data[key])
        //     this.resultArray = res.data[key];
        //    }
        //  }).catch(err => {
        //    console.log(err);
        //  })
        //  console.log(this.resultArray,this.multipleCustomSelection);
        //  let newObj = {};
        //     this.multipleCustomSelection.map(item => {
        //     this.ccc.push(Object.assign({},item,{skuId: this.resultArray}))
        //     })
        // console.log(newObj,'999999');
        //  this.multipleCustomSelection=value


        //  this.multipleCustomSelection.forEach((item,i)=>{
        //        this.$set(item,'longId',i)
        //   })
       }

    }
  }
</script>
<style scoped lang="less">
  .brandBox {
    width: 100%;
    clear: both;
    .buttonBox {
    //   margin-top: 10px;
      .el-button {
        width: 160px;
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
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        float: right;
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        border-top: 1px solid #e4e4e4;
        span{
          width: 100px;
          display: inline-block;
          // margin-left: 10px;
        }
        margin-top: -2px;
        .el-input {
          width: 140px;
          height: 40px;
          // margin-left: 10px;
          margin-top: 10px;
        }
        .el-select{
          // margin-left: 10px ;
          margin-top: 10px;
          width: 140px;
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
        .listBoxCenter{
           border-top: 1px solid #e4e4e4;
           .listBoxRight {
        float: right;
        margin-right: 10px;
        .white-btn{
          margin-top: 10px;
          margin-right: 10px;
        }
      }
        }  
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .blockButtonBox{
        .el-button{
            width: 160px;
            height:40px;
        }
        .active{
        background: #339999;
        color: #fff;
        }
        margin: 20px auto;
        text-align: center;
    }
  }
</style>

<style lang="less" scoped>
  .brandBox{

    .el-dialog__header{
      padding: 10px;
      // padding-bottom: 0;
      background: #E4E4E4;
      height: 40px;
      line-height: 40px;
    }
  }


</style>









