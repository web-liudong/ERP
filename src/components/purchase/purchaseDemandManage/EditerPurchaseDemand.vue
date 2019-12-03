<template>
  <div class="brandBox">
    <div class="buttonBox">
      <div class="headerBox" style="height:50px;background-color:#f3f3f3;margin-top:20px; border: 1px solid #e4e4e4;font-size:14px;">
        <i class="iconfont iconsousuo" style="margin-left:5px;"></i> <span style="line-height:50px;">基本信息</span> 
      </div> 
      <div class="borderBox" style="border:1px solid #e4e4e4">
          <table border="1">
        <tr>
          <th>商品编号：</th>
          <td>{{skuNo}}</td>
          <th>商品名称：</th>
          <td>{{skuName}}</td>
        </tr>
        <tr>
          <th>需求汇总数量：</th>
          <td>{{sum}}</td>
          <th>计量单位：</th>
          <td>{{unit}}</td>
        </tr>
        </table>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconsousuo"></i>明细信息</span>
        <div class="listBoxCenter" >
            <span> <i class="iconfont iconsousuo"></i>订单需求</span>
         <div class="listBoxRight">
           <div class="white-btn fun-btn" @click="addOrderDemand('addOrderDemand')"><i class="iconfont icon-icon-test"></i>释放</div>
           <div class="white-btn fun-btn" @click="clearOrderList('addOrderDemand')">
            <i class="iconfont icon-icon-test"></i>废弃</div>
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
               <span :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}">{{scope.$index+1}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="urgentLevel"
            label="紧急"
            align="center">
            <template slot-scope="scope">
               <span :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.urgentLevel==0?'不紧急':scope.row.urgentLevel==1?'紧急':''}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="发货单号"
            align="center">
              <template slot-scope="scope">
                <el-button :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}" type="text" @click="showTips(scope.row)">{{scope.row.orderNo}}</el-button>  
              </template>  
          </el-table-column>
          <!-- <el-table-column
            prop="skuId"
            label="商品ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column> -->
          <el-table-column
            prop="requirementQty"
            label="需求数量"
            align="center">
            <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.requirementQty"></el-input> -->
                 <span :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.requirementQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库" align="center">
            <template slot-scope="scope">
           <!-- <el-select
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
          </el-select> -->
          <span :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.warehouseName}}</span>
            </template>
          </el-table-column> 
           <el-table-column
            prop="warehouseReceiptAddress"
            label="仓库地址"
            align="center">
              <template slot-scope="scope">
                <span :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.warehouseReceiptAddress}}</span>
                <!-- <el-input v-if="scope.row.warehouseName==0" placeholder="请输入仓库地址" v-model="scope.row.receiveAddress"></el-input> -->
            </template> 
          </el-table-column>
          <el-table-column
            prop="memo"
            label="备注说明"
            align="center">
            <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.memo"></el-input> -->
                <span :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.memo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="需求生成时间" align="center">
           <template slot-scope="scope">
             <span :style="{'color':orderIDs.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.createTime}}</span>
            </template>
          </el-table-column>  
        </el-table>
        </div>
        <div class="listBoxCenter">
            <span> <i class="iconfont iconsousuo"></i>安全库存需求</span>
         <div class="listBoxRight">
           <div class="white-btn fun-btn" @click="addOrderDemand('SAFETY_STOCK_DEMAND')"><i class="iconfont icon-icon-test"></i>释放</div>
           <div class="white-btn fun-btn" @click="clearOrderList('SAFETY_STOCK_DEMAND')">
            <i class="iconfont icon-icon-test"></i>废弃</div>
        </div>
            <el-table
          :data="satefyStockData"
          border
          :row-style="tableDataRow"	
          :row-class-name="tableRowClassNameSafetyStock"
          @selection-change="handlesafetyStockSelectionChange"
          style="width: 100%"
          size="small">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            label="序号"
            align="center"
            width="60"
            >
            <template slot-scope="scope">
              <span :style="{'color':satefyStockIDS.indexOf(scope.row.id)!=-1?'red':''}">
                {{scope.$index+1}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="urgentLevel"
            label="紧急"
            align="center"
            >
             <template slot-scope="scope">
              <span :style="{'color':satefyStockIDS.indexOf(scope.row.id)!=-1?'red':''}">
                {{scope.row.urgentLevel==0?'不紧急':scope.row.urgentLevel==1?'紧急':''}}
              </span>
            </template> 
          </el-table-column>
          <!-- <el-table-column
            prop="skuId"
            label="商品ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column> -->
          <el-table-column
            prop="requirementQty"
            label="需求数量"
            align="center">
            <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.requirementQty"></el-input> -->
                <span :style="{'color':satefyStockIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.requirementQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库" align="center">
             <template slot-scope="scope">
           <!-- <el-select
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
          </el-select> -->
          <span :style="{'color':satefyStockIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.warehouseName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseReceiptAddress"
            label="仓库地址" align="center">
             <template slot-scope="scope">
                <span :style="{'color':satefyStockIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.warehouseReceiptAddress}}</span>
                <!-- <el-input v-if="scope.row.warehouseName==0" placeholder="请输入仓库地址" v-model="scope.row.receiveAddress"></el-input> -->
            </template> 
          </el-table-column>  
          <el-table-column
            prop="memo"
            label="备注说明" align="center">
            <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.memo"></el-input> -->
                <span :style="{'color':satefyStockIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.memo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="需求生成时间" align="center">
           <template slot-scope="scope">
             <span :style="{'color':satefyStockIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.createTime}}</span>
            </template>
          </el-table-column>    
        </el-table>
        </div>
        <div class="listBoxCenter">
            <span> <i class="iconfont iconsousuo"></i>自定义需求</span>
         <div class="listBoxRight">
           <div class="white-btn fun-btn" @click="addOrderDemand('CUSTOM_DEMAND')"><i class="iconfont icon-icon-test"></i>释放</div>
           <div class="white-btn fun-btn" @click="clearOrderList('CUSTOM_DEMAND')">
            <i class="iconfont icon-icon-test"></i>废弃</div>
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
               <span :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.$index+1}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="urgentLevel"
            label="紧急"
            align="center">
             <template slot-scope="scope">
               <span :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.urgentLevel==0?'不紧急':scope.row.urgentLevel==1?'紧急':''}}</span> 
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="skuId"
            label="商品ID"
            align="center">    
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column> -->
          <!-- <el-table-column
            prop="orderNo"
            label="订单号"
            align="center">
             <template slot-scope="scope">
                <el-button :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}" type="text" @click="showTips(scope.row)">{{scope.row.orderNo}}</el-button>
            </template>   
          </el-table-column> -->
          <el-table-column
            prop="requirementQty"
            label="需求数量"
            align="center">
            <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.requirementQty"></el-input> -->
                <span :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.requirementQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库" align="center">
             <template slot-scope="scope"> 
            <!-- <el-select
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
          </el-select> -->
          <span :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.warehouseName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseReceiptAddress"
            label="仓库地址" align="center">
             <template slot-scope="scope">
                <span :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.warehouseReceiptAddress}}</span>
                <!-- <el-input v-if="scope.row.warehouseName==0" placeholder="请输入仓库地址" v-model="scope.row.receiveAddress"></el-input> -->
            </template> 
          </el-table-column>  
          <el-table-column
            prop="memo"
            label="备注说明" align="center">
           <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.memo" clearable></el-input> -->
                <span :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.memo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="需求生成时间" align="center">
           <template slot-scope="scope">
             <span :style="{'color':customIDS.indexOf(scope.row.id)!=-1?'red':''}">{{scope.row.createTime}}</span>
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
    <orderTips ref="orderTips"></orderTips>
    <cancelData ref="cancelData"></cancelData>
  </div>
</template>
<script>
  import store from '@/store/store';
  import elDragDialog from '@/directive/el-dragDialog'
  import cancelData from './child/cancel_data'
  import orderTips from './child/order_tips'
  import {findWarehouse,getOrganization,byTokenGetUserList,findPurchaseDemand,editerPurchaseDemand} from '@/api/purchase/purchase.js'
  import { setTimeout } from 'timers';
  export default {
    inject: ['reload','close'],
    data() {
      return {
        tableData: [],
        orderData:[],//订单需求数据
        satefyStockData:[],//安全库存需求数据
        customData:[],//自定义需求数据,
        loading:false,
        optionsWarehouse:null,
        organizationId:null,//组织机构id
        useLeadingWMS:null,//是否用wms
        orderIDs:[],//临时存储订单需求的id集合
        satefyStockIDS:[],//临时存储安全需求的id集合
        customIDS:[],//临时存储自定义需求的id集合
        //机构名称
        options:[],
        tableDataRow:null,
        skuId:null,
        skuNo: null,
        skuName:null,
        sum:null,
        unit:null,
        inStoreType:null,
        orderType:null,
        multipleOrderSelection:[],
        multipleSafetyStockSelection:[],
        multipleCustomSelection:[],
        paginations: {
          total: 100,//总数
        },
      }
    },
    directives:{
      elDragDialog
    },
    components:{
     cancelData,orderTips
    },
    filters:{
    },
    created() {
         this.skuId=this.$route.query.skuId;
         this.skuNo=this.$route.query.skuNo;
         this.skuName=this.$route.query.skuName;
         this.sum=this.$route.query.sum;
         this.unit=this.$route.query.unit;
         this.inStoreType=this.$route.query.inStoreType;
         this.orderType=this.$route.query.orderType;
         let str = window.localStorage.getItem("UserInfo");
         let userPosts=JSON.parse(str).userPosts;
         this.organizationId=userPosts[0].organizationId;
         if(this.organizationId){
         this.getTableList();       
         }      
       findPurchaseDemand({skuId:this.skuId,inStoreType:this.inStoreType,orderType:this.orderType}).then(res=>{
        if(res.code=='000000'){
          this.tableData=res.data;
          this.orderData=res.data.filter((item,i)=>{
           return item.requirementType==0
         })
         this.satefyStockData=res.data.filter((item,i)=>{
           return item.requirementType==1
         })
         this.customData=res.data.filter((item,i)=>{
           return item.requirementType==2
         })
        }
    })
    },
    activated(){
         let str = window.localStorage.getItem("UserInfo");
         let userPosts=JSON.parse(str).userPosts;
         if(this.$route.query.skuId&&this.skuId!=this.$route.query.skuId&&userPosts[0].organizationId&&this.organizationId!=userPosts[0].organizationId){
           this.skuId=this.$route.query.skuId;
           this.skuNo=this.$route.query.skuNo;
           this.skuName=this.$route.query.skuName;
           this.sum=this.$route.query.sum;
           this.unit=this.$route.query.unit;
           this.inStoreType=this.$route.query.inStoreType;
           this.orderType=this.$route.query.orderType;
           this.organizationId=userPosts[0].organizationId;
           this.getTableList()
           findPurchaseDemand({skuId:this.skuId,inStoreType:this.inStoreType,orderType:this.orderType}).then(res=>{
        if(res.code=='000000'){
          this.tableData=res.data;
          this.orderData=res.data.filter((item,i)=>{
           return item.requirementType==0
         })
         this.satefyStockData=res.data.filter((item,i)=>{
           return item.requirementType==1
         })
         this.customData=res.data.filter((item,i)=>{
           return item.requirementType==2
         })
        }
    })
         }

    },
    mounted(){
    },
    watch:{
      tableDataRow:function({row,rowIndex}){
      return this.multipleSafetyStockSelection.forEach((item,index)=>{
          if(item.index===rowIndex){
            return {
              "background-color": "#CAE1FF"
            }
          }
        })
      },
      immediate: true,
      deep:true
      
    },
    methods: {
      tableRowClassNameSafetyStock({row,rowIndex}){
        row.index=rowIndex;
      },
     
      getTableList(){
       getOrganization(this.organizationId).then(res=>{
         this.useLeadingWMS=res.data.useLeadingWMS;
       })
      },
      showTips(row){
       if(row.orderType!=1){
        this.$refs.orderTips.init(row);
       }   
      },
    // remoteMethod(query){
      // if (query !== '') {
      //     this.loading = true;
      //     let aa={name:query}
      //    findWarehouse(aa).then(res=>{
      //      this.optionsWarehouse=res.data;
      //      this.optionsWarehouse=[{id:0,name:'无'},...this.optionsWarehouse];
      //      this.loading=false
      //    })
      //   } else {
      //     this.optionsWarehouse = [];
      //   }
      // },
      // getUsername(value,index,type){
      //  if(type=='订单需求'){
      //   if(value==0){
      //    this.orderData[index].receiveAddress='';
      //    this.orderData[index].warehouseId=0;
      //  }else{
      //   let aa=JSON.parse(JSON.stringify(this.optionsWarehouse));
      //    aa = aa&&aa.filter((item,index)=>{
      //     return item.id==value
      //   })
      //   this.orderData[index].receiveAddress=aa[0]&&aa[0].provinceName+' '+aa[0].cityName +' '+ aa[0].countyName +' '+ aa[0].addressLine;
      //   this.orderData[index].recipientAddressProvinceId=aa[0]&&aa[0].provinceId;
      //   this.orderData[index].recipientAddressCityId=aa[0]&&aa[0].cityId;
      //   this.orderData[index].recipientAddressCountyId=aa[0]&&aa[0].countyId;
      //   this.orderData[index].warehouseId=aa[0]&&aa[0].id;
      //    console.log(this.orderData,77777)
      //  }
      //  }
      //  if(type=='SAFETY_STOCK_DEMAND'){
      //    if(value==0){
      //      this.satefyStockData[index].receiveAddress='';
      //      this.satefyStockData[index].warehouseId=0;
      //    }else{
      //      let bb=JSON.parse(JSON.stringify(this.optionsWarehouse));
      //      bb= bb&&bb.filter((item,i)=>{
      //        return item.id==value;
      //      })
      //   this.satefyStockData[index].receiveAddress=bb[0]&&bb[0].provinceName+' '+bb[0].cityName +' '+ bb[0].countyName +' '+ bb[0].addressLine;
      //   this.satefyStockData[index].recipientAddressProvinceId=bb[0]&&bb[0].provinceId;
      //   this.satefyStockData[index].recipientAddressCityId=bb[0]&&bb[0].cityId;
      //   this.satefyStockData[index].recipientAddressCountyId=bb[0]&&bb[0].countyId;  
      //   this.satefyStockData[index].warehouseId=bb[0]&&bb[0].id;
      //    }
      //  }
      //  if(type=='CUSTOM_DEMAND'){
      //     if(value==0){
      //      this.satefyStockData[index].receiveAddress='';
      //      this.satefyStockData[index].warehouseId=0;
      //    }else{
      //      let cc=JSON.parse(JSON.stringify(this.optionsWarehouse));
      //      cc= cc&&cc.filter((item,i)=>{
      //        return item.id==value;
      //      })
      //   this.customData[index].receiveAddress=cc[0]&&cc[0].provinceName+' '+cc[0].cityName +' '+ cc[0].countyName +' '+ cc[0].addressLine;
      //   this.customData[index].recipientAddressProvinceId=cc[0]&&cc[0].provinceId;
      //   this.customData[index].recipientAddressCityId=cc[0]&&cc[0].cityId;
      //   this.customData[index].recipientAddressCountyId=cc[0]&&cc[0].countyId; 
      //   this.customData[index].warehouseId=cc[0]&&cc[0].id;
      //    }
      //  }  
    // },
       addOrderDemand(type,name){
        if(type=='addOrderDemand'){
          let arr=[];
           arr=this.multipleOrderSelection.map((item,i)=>{
            return item.id;
          })
          arr.forEach((ite,k)=>{
            this.orderData=this.orderData.filter((item,j)=>{
            return item.id!=ite;
         })
        })
        }
        if(type=='SAFETY_STOCK_DEMAND'){
          let arrr=[];
           arrr=this.multipleSafetyStockSelection.map((item,i)=>{
            return item.id;
          })
         arrr.forEach((ite,k)=>{
            this.satefyStockData=this.satefyStockData.filter((item,j)=>{
            return item.id!=ite;
         })
        })
        }
        if(type=='CUSTOM_DEMAND'){
          let array=[];
          array=this.multipleCustomSelection.map((item,i)=>{
            return item.id;
          })
          array.forEach((ite,k)=>{
            this.customData=this.customData.filter((item,j)=>{
            return item.id!=ite;
         })
        })
        }
       },
       clearOrderList(type){
         if(type=='addOrderDemand'){
          this.orderIDs=[];
          this.orderIDs=this.multipleOrderSelection.map((item,index)=>{
            return item.id;
          })
         }
         if(type=='SAFETY_STOCK_DEMAND'){
           this.satefyStockIDS=[];
           this.satefyStockIDS=this.multipleSafetyStockSelection.map((item,index)=>{
             return item.id;
           })
         }
         if(type=='CUSTOM_DEMAND'){
           this.customIDS=[];
           this.customIDS=this.multipleCustomSelection.map((item,index)=>{
             return item.id;
           })
         }
       },
       cancelData(){
        this.$refs.cancelData.init()
       },
       submit(){
         editerPurchaseDemand([...this.orderIDs,...this.satefyStockIDS,...this.customIDS]).then(res=>{
           if(res.code=='000000'){
             this.$message({
               message:'保存成功',
               type:'success'
             })
             this.close({name:'EditerPurchaseDemand',to:{name:'PurchaseDemand',params:{isUpdate:true}}})        
           }
         })
       },
       handleSelectionChange(value){
          this.multipleOrderSelection=value; 
       },
       handlesafetyStockSelectionChange(value){
         this.multipleSafetyStockSelection=value
       },
       handleCustomSelectionChange(value){
         this.multipleCustomSelection=value
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
     table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          color:#303133;
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
        .activestyle{
          color:red;
        }
      }
      .el-table .activestyle{
        background-color: red;
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
      padding-bottom: 0;
      background: #E4E4E4;
      height: 40px;
      line-height: 40px;
    }
  
  }


</style>









