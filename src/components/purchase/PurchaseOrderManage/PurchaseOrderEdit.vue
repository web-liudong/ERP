<template>
  <div class="form-wrapper">
    <addhead headname="基本信息："></addhead>
    <div>
      <el-form ref="formName" :rules="rules" :model="form" class="form-box">
        <el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="采购单编号：" label-width="135px" class="forms" prop="purchaseOrderNo" style="word-wrap: break-word;">
                {{form.purchaseOrderNo}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="紧急程度：" label-width="135px" class="forms" prop="urgentLevel">
                {{form.urgentLevel|changData('urgentLevel')}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发票类型：" label-width="135px" class="forms" prop="invoiceTypeDescription">
                {{form.invoiceTypeDescription}}
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
              <el-col :span="8">
                <el-form-item label="结款方式：" label-width="135px" class="forms" prop="paytypeDescription">
                  {{form.paytypeDescription}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否集采：" label-width="135px" class="forms" prop="includeTaxDescription">
                  {{form.includeTaxDescription}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称：" label-width="135px" class="forms" prop="supplierName">
                  {{form.supplierName}}
                </el-form-item>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="收货人：" label-width="135px" class="forms" prop="recipientName">
                {{form.recipientName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货人联系方式：" label-width="135px" class="forms" prop="recipientPhone">
                {{form.recipientPhone}}
              </el-form-item>
            </el-col>
             <el-col :span="8">
              <el-form-item label="结算单位：" label-width="135px" class="forms" prop="billOrganizationName">
                {{form.billOrganizationName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否含税：" label-width="135px" class="forms" prop="includeTaxDescription">
                {{form.includeTaxDescription}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到货类型：" label-width="135px" class="forms" prop="deliveryTypeDescription">
                {{form.deliveryTypeDescription}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货地址：" label-width="135px" class="forms" prop="recipientAddressLine">
                {{form.recipientAddressLine}}
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="8">
              <el-form-item label="是否快递：" label-width="135px" class="forms" prop="expressDelivery">
                {{form.expressDelivery| changData('expressDelivery')}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="快递单号：" label-width="135px" class="forms" prop="expressDeliveryNo" style="word-wrap: break-word;">
                {{form.expressDeliveryNo}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购单位：" label-width="135px" class="forms" prop="requirementOrganizationName">
                {{form.requirementOrganizationName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="驳回原因：" label-width="135px" class="forms" prop="rejectReason" style="word-wrap: break-word;">
                {{form.rejectReason}}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.deliveryType==0">
              <el-form-item label="最晚入库时间：" label-width="135px" class="forms" prop="latestReceiveTime">
                {{form.latestReceiveTime}}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.deliveryType==0">
              <el-form-item label="库房：" label-width="135px" class="forms" prop="warehouseName">
                {{form.warehouseName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" v-if="form.deliveryType==0">
              <el-form-item label="是否预约：" label-width="135px" class="forms" prop="appointReceive">
                {{form.appointReceive|changData('appointReceive')}}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.deliveryType==0">
              <el-form-item label="是否质检：" label-width="135px" class="forms" prop="qualityTesting">
                {{form.qualityTesting |changData('qualityTesting')}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <addhead headname="商品明细："></addhead>
    <el-table
      :data="form.purchaseOrderItemDTOS"
      border>
      <el-table-column
        prop="skuNo"
        label="商品编号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="skuName"
        label="商品名称"
        width="280px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="skuModel"
        label="规格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
        align="center">
      </el-table-column>
      <el-table-column
        prop="requirementQty"
        label="需求数量"
        align="center">
      </el-table-column>
      <el-table-column
        label="采购数量"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.purchaseQty" 
            :step="1" 
            :min="0"
            :precision="0"
            size="mini" 
            @change="(val) => {changePurchase(val,scope.row)}"
            controls-position="right">
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        label="采购单价"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-input-number 
            v-model="scope.row.purchasePrice" 
            size="mini" 
            :min="0"
            :precision="4"
            @change="(val) => {changePurchase(val,scope.row)}"
            controls-position="right">
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        label="小计"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.showAmount" 
            size="mini"
            clearable
            @change="(val) => {changeSubtotal(val,scope.row,scope.$index)}"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="receivedQty"
        label="已入库"
        align="center">
      </el-table-column>
      <el-table-column
        prop="profitAndLossAmount"
        label="损溢数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="buyingPrice"
        label="采购参考价"
        min-width="150px"
        :formatter="retainDecimals"
        align="center">
      </el-table-column>
      <el-table-column
        prop="taxRate"
        label="税率"
        :formatter="changeTaxRate"
        align="center">
      </el-table-column>
      <el-table-column
        prop="discount"
        label="折扣率"
        align="center">
      </el-table-column>
      <el-table-column
        prop="discountAmount"
        label="折扣额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="showAmount"
        label="总金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="previousPurchasePrice"
        label="最新采购价"
        min-width="150px"
        :formatter="retainDecimals"
        align="center">
      </el-table-column>
      <el-table-column
        prop="finishInventoryQty"
        label="库存"
        align="center">
      </el-table-column>
      <el-table-column
        prop="expectedDeliveryDate"
        label="预计到货日期"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="采购说明"
        min-width="150px"
        align="center" >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.itemMemo"
            @blur="getChangeData(scope.row,scope.$index,'purchaseItemMemo')"
            clearable>
          </el-input>
        </template>
      </el-table-column>
    </el-table>
    <addhead headname="操作日志："></addhead>
    <el-table
      :data="form.purchaseOrderOperationLogDTOS"
      border>
      <el-table-column
        label="操作者" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.userInfo.userFullName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.purchaseStatusDescription}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operationTime"
        :formatter="createTimes"
        label="操作时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作描述" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.oprationDescription}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="button-box">
      <el-button type="primary" @click="editPurchaseApproval">提交</el-button>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {editPurchaseApproval,getPurchaseOrderDetail} from '@/api/purchaseApproval';
 
  export default {
    inject:['reload','close'],
    name:'PurchaseOrderEdit',
    data() {
      return {
        rowDatas:[],
        rowData:{},
        purchaseOrderId:'',
        form:{
          purchaseOrderNo:'',
          invoiceTypeDescription:'',
          paytypeDescription:'',
          supplierName:'',
          receiveAddress:'',
          includeTaxDescription:'',
          deliveryTypeDescription:'',
          memo:'',
          purchaserName:'',
          rejectReason:'',
          purchaseOrderItemDTOS:[],
          purchaseOrderOperationLogDTOS:[],
          warehouseName:'',
          urgentLevel:'',
          purchaseTypeDescription:'',
          recipientPhone:'',
          recipientAddressLine:'',
          billOrganizationName:'',
          appointReceive:'',
          qualityTesting:'',
          expressDelivery:'',
          latestReceiveTime:'',
          expressDeliveryNo:'',
          recipientName:'',
          requirementOrganizationName:''
        },
        rules:{
          purchaseOrderNo:[
            { required:true }
          ],
          invoiceTypeDescription:[
            { required:true }
          ],
          paytypeDescription:[
            { required:true }
          ],
          supplierName:[
            { required:true }
          ],
          receiveAddress:[
            { required:true }
          ],
          includeTaxDescription:[
            { required:true }
          ],
          deliveryTypeDescription:[
            { required:true }
          ],
          purchaserName:[
            { required:true }
          ],
          rejectReason:[
            { required:true }
          ],
          warehouseName:[
            { required:true }
          ],
          urgentLevel:[
            { required:true }
          ],
          purchaseTypeDescription:[
            { required:true }
          ],
          recipientPhone:[
            { required:true }
          ],
          recipientAddressLine:[
            { required:true }
          ],
          billOrganizationName:[
            { required:true }
          ],
          appointReceive:[
            { required:true }
          ],
          qualityTesting:[
            {required:true }
          ],
          expressDelivery:[
            { required:true }
          ],
          latestReceiveTime:[
            { required:true }
          ],
          recipientName:[
            { required:true }
          ],
          requirementOrganizationName:[
            { required:true }
          ]
        },
      }
    },
    components:{
      addhead
    },
    created(){
      
    },
    activated(){
      if(this.purchaseOrderId!=this.$route.query.id||this.$route.query.list){
        this.getDetail();
      }
    },
    methods: {
      getDetail(id){
        this.purchaseOrderId = this.$route.query.id;
        getPurchaseOrderDetail(this.purchaseOrderId).then(res=>{
          if(res.code=='000000'){
           res.data.purchaseOrderItemDTOS.forEach((item)=>{
              item.showAmount=item.amount.toFixed(2);
           })
           this.form=res.data;
          }
        })
      },
      getChangeData(row,index,type){
      	if(row.purchasePrice>=0){
      		this.purchaseQty=row.purchaseQty;
	        this.purchasePrice=row.purchasePrice;
	        this.rowData.purchaseQty=row.purchaseQty;
	        this.rowData.purchasePrice=row.purchasePrice;
	        this.rowData.itemMemo=row.itemMemo;
          this.rowData.id=row.id;
          this.rowDatas[index]=this.rowData;
          this.rowData={};
	        if(row.profitAndLossAmount){
	          row.amount=row.purchaseQty*row.purchasePrice;
	        }else{
	          row.amount=row.purchaseQty*row.purchasePrice;
          }
      	}else{
      		 this.$message({
              message:'采购单价不能小于0',
              type:'error'
            })
      	}
      },
      changePurchase(val,row,index){
        row.amount=(row.purchaseQty*row.purchasePrice).toFixed(4);
        row.showAmount=(row.purchaseQty*row.purchasePrice).toFixed(2);
      },
      changeSubtotal(val,row,index){
        row.showAmount=Number(val).toFixed(2);
        row.amount=Number(row.showAmount).toFixed(4);
        row.purchasePrice=(row.amount/row.purchaseQty).toFixed(4);
      },
      editPurchaseApproval(){
        this.rowDatas=[];
        this.form.purchaseOrderItemDTOS.forEach((item,index)=>{
          this.rowData={};
          this.rowData.purchaseQty=item.purchaseQty;
	        this.rowData.purchasePrice=item.purchasePrice;
	        this.rowData.itemMemo=item.itemMemo;
          this.rowData.id=item.id;
          this.rowData.amount=item.amount;
          this.rowDatas.push(this.rowData);
        })
        editPurchaseApproval(this.purchaseOrderId,this.rowDatas).then(res=>{
          if(res.code=="000000"){
            this.$message({
              message:'编辑成功！',
              type:'success'
            })
            this.rowDatas=[];
            this.close({name:'PurchaseOrderEdit', to: {name:'PurchaseOrder', params:{isUpdate:true}}});
          }
        })
      },
      retainDecimals(row,column){
        let amount='';
        if(column.property=="previousPurchasePrice"){
          amount=row.previousPurchasePrice.toFixed(4);
          return amount='￥'+amount;
        }
        if(column.property=="buyingPrice"){
          amount=row.buyingPrice.toFixed(4);
          return amount='￥'+amount;
        }
      },
      changeTaxRate(row,column){
        let taxRate='';
        taxRate=row.taxRate*100;
        return taxRate=taxRate+'%';
      },
      createTimes(row,column){
        var date =row.operationTime.replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        return date;
      }
    },
    filters:{
      changData(val,index){
        if(index!='urgentLevel'){
          if(val==1){
            return '是'
          }else{
            return '否'
          }
        }else{
          if(val==1){
            return '紧急'
          }else{
            return '不紧急'
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
    .form-wrapper{
      margin-top:20px;
      border-right:1px solid #e4e4e4;
      border-left:1px solid #e4e4e4;
      border-bottom:1px solid #e4e4e4;
      .form-box{
        .el-row{
          margin:10px 0 0 50px;
          /deep/.forms{
            /deep/.el-form-item__content{
              display: inline-block;
              width: 53%;
              margin-left:0 !important;
              .el-input__inner{
                border: none;
              }
            }
          }
        }
      }
      .add-head{
        margin-top: 45px;
      }
      .el-table{
        max-height: 500px;
        overflow: auto;
        /deep/.el-input-number--mini{
          width: 100%;
        }
      }
    }
    .button-box{
      width: 90%;
      margin: 20px auto 50px;
      display: flex;
      justify-content: flex-end;
    }
</style>
