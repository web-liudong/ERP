<template>
  <div class="form-wrapper">
    <addhead headname="基本信息：" iconName="iconjinridingdanshu"></addhead>
    <div>
      <el-form ref="formName" :rules="rules" :model="form" class="form-box">
        <el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="紧急程度：" label-width="110px" class="forms" prop="urgentLevel">
                <el-select v-model="form.urgentLevel">
                    <el-option label="紧急" value="1"></el-option>
                    <el-option label="不紧急" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="发票类型：" label-width="135px" class="forms" prop="invoiceType">
                <el-select v-model="form.invoiceType">
                    <el-option label="专票" value="0"></el-option>
                    <el-option label="普票" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结款方式：" label-width="135px" class="forms" prop="payType">
                <el-select v-model="form.payType">
                    <el-option label="账期" value="0"></el-option>
                    <el-option label="现金" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否集采：" label-width="110px" class="forms" prop="purchaseType">
                <el-radio-group 
                  v-model="form.purchaseType"
                  @change="ChangePurchaseType">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="form.purchaseType==1?'所属组织机构：':'供应商：'" label-width="135px" class="forms" prop="supplierName">
                  <el-select
                    v-model="form.supplierName"
                    filterable
                    remote
                    clearable
                    @change="changeSupplierName"
                    placeholder="请输入供应商姓名"
                    :remote-method="supplierRemote"
                    @focus="tips"
                    style="margin-left:0px;"
                    :loading="loading">
                    <el-option
                      v-for="item in supplierName"
                      :key="item.id"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算单位：" label-width="135px" class="forms" prop="billOrganizationName">
                <el-select
                    v-model="form.billOrganizationName"
                    filterable
                    remote
                    clearable
                    placeholder="请输入结算单位名"
                    @change="changeBillOrganizationName"
                    :remote-method="SettlementUnitRemote"
                    style="margin-left:0px;"
                    :loading="loading">
                    <el-option
                      v-for="item in SettlementUnitName"
                      :key="item.id"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="到货类型：" label-width="110px" class="forms" prop="deliveryType">
                <el-select v-model="form.deliveryType"
                   @change="ChangeDeliveryType">
                    <el-option
                      v-for="item in deliveryTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="库房：" label-width="135px" class="forms" prop="warehouseName">
                <el-select
                  v-model="form.warehouseName"
                  filterable
                  remote
                  clearable
                  placeholder="请输入库房名称"
                  @change="changeWarehouseName"
                  :remote-method="warehouseRemote"
                  :loading="loading">
                  <el-option
                    v-for="item in warehouseName"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>   
            <el-col :span="8">
              <el-form-item label="最晚入库时间：" label-width="135px" class="forms" prop="latestReceiveTime"
                :rules="form.deliveryType==0?rules.latestReceiveTime:rules.latestReceiveTime1">
                <el-date-picker
                  v-model="form.latestReceiveTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  :disabled="form.deliveryType==1?true:false"
                  placeholder="选择时间">
                </el-date-picker>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否预约：" label-width="110px" class="forms" prop="appointReceive"
                :rules="form.deliveryType==0?rules.appointReceive:rules.appointReceive1">
                <el-radio-group v-model="form.appointReceive" :disabled="form.deliveryType==1?true:false">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否质检：" label-width="135px" class="forms" prop="qualityTesting"
                :rules="form.deliveryType==0?rules.qualityTesting:rules.qualityTesting1">
                <el-radio-group v-model="form.qualityTesting" :disabled="form.deliveryType==1?true:false">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="是否含税：" label-width="135px" class="forms" prop="includeTax">
                <el-radio-group v-model="form.includeTax">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="收货人：" label-width="110px" class="forms" prop="recipientName">
                <el-input  v-model="form.recipientName"></el-input>   
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="收货人联系方式：" label-width="135px" class="forms" prop="recipientPhone">
                <el-input  v-model="form.recipientPhone"></el-input>   
              </el-form-item>
            </el-col>
             <el-col :span="8">
              <el-form-item label="是否快递：" label-width="135px" class="forms" prop="expressDelivery">
                <el-radio-group v-model="form.expressDelivery">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>  
            <el-col :span="16">
              <el-form-item label="快递单号：" label-width="110px" class="forms" 
                :rules="form.expressDelivery==1?rules.expressDeliveryNo:rules.expressDeliveryNo1"
                prop="expressDeliveryNo">
                <el-input  v-model="form.expressDeliveryNo"></el-input>   
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="收货地址：" label-width="110px" class="addressBox" prop="recipientAddressProvinceId">
                <el-select v-model="form.recipientAddressProvinceId" placeholder="选择省/直辖市" @change="onProvincesChange">
                  <el-option
                    v-for="(item,index) in province"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
               	</el-select>
                <el-select v-model="form.recipientAddressCityId" placeholder="选择城市" @change="onCityChange">
                  <el-option
                    v-for="(item,index) in city"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="form.recipientAddressCountyId" placeholder="选择区/县">
                  <el-option
                    v-for="(item,index) in county"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-input  v-model="form.recipientAddressLine" class="addressLine" placeholder="详细地址"></el-input> 
              </el-form-item>
            </el-col>  
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div class="listBox">
        <div class="listBoxTop">
            <div class="listBoxTop-left">
                <i class="iconfont iconjinridingdanshu myicon"></i>
                <span>商品明细：</span>
            </div>
            <div class="listBoxRight">
                <div class="button-head" @click="addRow" v-if="$authorities.PurchseManageAdd"><i class="iconfont iconzengjia"></i>添加</div>
                <div class="button-head" @click="delData" v-if="$authorities.PurchseManageAdd"><i class="iconfont iconjianshao-"></i>移除</div>
            </div>
        </div>
        <el-table
            ref="multipleTable"
            :data="form.itemList"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border>
            <el-table-column
              type="selection"
              fixed="left"
              width="55">
            </el-table-column>
            <el-table-column
                label="商品编号"
                align="center"
                width="150">
                <template slot-scope="scope">
                    <el-input 
                      v-model="scope.row.skuNo" 
                      @blur="changeSkuId(scope.row.skuNo,scope.$index,scope.row)" 
                      placeholder=""
                      clearable>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="商品名称"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.skuName"
                        filterable
                        remote
                        placeholder="商品名称"
                        @change="skuIdChange(scope.$index,scope.row)"
                        :remote-method="skuNameRemote"
                        :loading="loading"
                        clearable>
                        <el-option
                            v-for="item in skuNames"
                            :key="item.id"
                            :label="item.skuName"
                            :value="item">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                prop="skuModel"
                label="规格"
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                prop="unit"
                label="单位"
                align="center"
                width="120">
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
                    controls-position="right"
                    >
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
                    @change="(val) => {changePurchase(val,scope.row,scope.$index)}"
                    controls-position="right"
                  >
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
                    @change="(val) =>{changeSubtotal(val,scope.row,scope.$index)}"
                  >
                  </el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="buyingPrice"
                label="采购参考价"
                :formatter="show"
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                label="税率"
                align="center"
                width="120">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.taxRate">
                        <el-option label="0%" value="0"></el-option>
                        <el-option label="3%" value="0.03"></el-option>
                        <el-option label="5%" value="0.05"></el-option>
                        <el-option label="6%" value="0.06"></el-option>
                        <el-option label="9%" value="0.09"></el-option>
                        <el-option label="10%" value="0.10"></el-option>
                        <el-option label="13%" value="0.13"></el-option>
                        <el-option label="16%" value="0.16"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                prop="totalAmount"
                label="总金额"
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                label="折扣率"
                width="120"
                align="center">
                <template slot-scope="scope">
                  <el-input type="number" v-model="scope.row.discount" @blur="(val) => {digitCheck(val,scope.row)}"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="previousPurchasePrice"
                label="最新采购价"
                :formatter="show"
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                prop="finishInventoryQty"
                label="库存"
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                label="预计到货日期"
                align="center"
                width="225">
                <template slot-scope="scope">
                    <el-date-picker
                        v-model="scope.row.expectedDeliveryDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        :picker-options="pickerOptions"
                        placeholder="选择日期">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column
                label="采购说明"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <el-input  v-model="scope.row.itemMemo"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="addPurchaseApprovalOrder('formName')">提交</el-button>
      <el-button type="primary" @click="closed">返回</el-button>
    </div>
  </div>
   
</template>
<script>
  import addhead from '@/components/common/head/head'

  import {
    provinces_based_id,
    subs
  } from '@/api/basicSupplier';

  import {
    getOrganization
  } from "@/api/purchase/purchase";

  import {
      getSupplierName,
      getWarehouseName,
      addPurchaseApproval,
      getManagementInfo,
      getManagementInfoName,
      getGoodsInventory,
      getLastPurchasePrice,
      getOrganizationSupplier,
      getSetupOrganization
  } from '@/api/purchaseApproval';

  import {
    nameList,
    simpleList,
    organizationListName
  } from "@/api/projectController/projectController";

  import { type } from 'os';
  
  export default {
    inject:['close'],
    name:'addPurchaseOrder',
    data() {
      var checkChina = (rule, value, callback) => {
          var isChina=  /^[\u4e00-\u9fa5]+$/;
          if (!isChina.test(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的快递单号"));
          }
      };
      return {
        province:[],
        city:[],
        county:[],
        skuNames:[],
        options:[],
        value: [],
        timeout:null,
        list: [],
        multipleSelection:[],
        num:'',
        loading: false,
        supplierId:'',
        supplierName:[],
        SettlementUnitName:[],
        warehouseId:'',
        warehouseName:[],
        skuId:'',
        rejectreason:'',
        rejectdialog:false,
        id:'',
        type:'0',
        radio:0,
        name:'',
        form:{
          appointReceive:null,
          billOrganizationId:'',
          billOrganizationName:'',
          deliveryType:'0',
          expressDelivery:'',
          expressDeliveryNo:'',
          includeTax:'',
          invoiceType:'',
          itemList:[],
          latestReceiveTime:'',
          payType:'',
          purchaseType:null,
          qualityTesting:null,
          recipientAddressCityId:'',
          recipientAddressCountyId:'',
          recipientAddressLine:'',
          recipientAddressProvinceId:'',
          recipientName:'',
          recipientPhone:'',
          supplierId:'',
          supplierName:'',
          urgentLevel:'',
          warehouseId:'',
          warehouseName:'',
        },
        forms:{
          appointReceive:null,
          billOrganizationId:'',
          billOrganizationName:'',
          deliveryType:0,
          expressDelivery:'',
          expressDeliveryNo:'',
          includeTax:'',
          invoiceType:'',
          itemList:[],
          latestReceiveTime:'',
          payType:'',
          purchaseType:null,
          qualityTesting:null,
          recipientAddressCityId:'',
          recipientAddressCountyId:'',
          recipientAddressLine:'',
          recipientAddressProvinceId:'',
          recipientName:'',
          recipientPhone:'',
          supplierId:'',
          supplierName:'',
          urgentLevel:'',
          warehouseId:'',
          warehouseName:'',
        },
        rules:{
          urgentLevel:[
            { required:true, message: '选择紧急程度', trigger:'change'}
          ],
          invoiceType:[
            { required:true, message: '选择发票类型', trigger:'change'}
          ],
          billOrganizationName:[
             { required:true, message: '请选择结算单位名称', trigger:'change'}
          ],
          deliveryType:[
             { required:true, message: '请选择到货类型', trigger:'change'}
          ],
          expressDelivery:[
             { required:true, message: '请选择是否快递', trigger:'change'}
          ],
          expressDeliveryNo1:[
            { message: '请输入快递单号', trigger:'blur'},
            {
              validator: checkChina,
              trigger: 'blur'
            }
          ],
          expressDeliveryNo:[
            { required:true, message: '请输入快递单号', trigger:'blur'},
            {
              validator: checkChina,
              trigger: 'blur'
            }
          ],
          includeTax:[
             { required:true, message: '请选择是否含税', trigger:'change'}
          ],
          latestReceiveTime:[
             { required:true, message: '请选择最晚入库时间', trigger:'change'}
          ],
          latestReceiveTime1:[
             { message: '请选择最晚入库时间', trigger:'blur'}
          ],
          payType:[
             { required:true, message: '请选择采购方式', trigger:'change'}
          ],
          purchaseType:[
             { required:true, message: '请选择采购类型', trigger:'change'}
          ],
          qualityTesting:[
             { required:true, message: '请输入是否进行质量检测', trigger:'change'}
          ],
          qualityTesting1:[
             { message: '请输入是否进行质量检测', trigger:'blur'}
          ],
          recipientAddressProvinceId:[
             { required:true, message: '请输入收货地址', trigger:'change'}
          ],
          recipientName:[
             { required:true, message: '请输入收货人姓名', trigger:'blur'}
          ],
          recipientPhone:[
            { required:true, message: '请输入收货人联系方式', trigger:'blur'},
          ],
          supplierName:[
             { required:true, message: '请输入供应商名称', trigger:'change'}
          ],
          appointReceive:[
            { required: true, message: '请选择是否到货预约',trigger: 'change'}
          ],
          appointReceive1:[
            { message: '请选择是否到货预约',trigger: 'change'}
          ],
          warehouseName:[
             { required:true, message: '请输入库房名称', trigger:'change'}
          ],
          warehouseName1:[
              { message: '请输入库房名称', trigger:'change'}
          ]
        },
        list: {
          buyingPrice:'',
          discount:1,
          expectedDeliveryDate:'',
          itemMemo:'',
          previousPurchasePrice:'',
          purchasePrice:'',
          purchaseQty:'',
          skuId:'',
          skuNo:null,
          skuModel:'',
          skuName:'',
          taxRate:'',
          unit:'',
          amount:'',
          showAmount:null,
          totalAmount:null,
          finishInventoryQty:'',
          rowNum:'',
        },
        skuIds:[],
        useLeadingWMS:null,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        },
        deliveryTypes:[
          {
            value:'0',
            label:'入仓'
          }
        ]

      }
    },
    components:{
      addhead
    },
    created(){
      this.getProvinces();
    },
    methods: {
      tips(){
        this.supplierName=[];
        if(this.form.purchaseType==null){
          this.$message({
            message:'必须先选择集采方式！',
            type:'error'
          })
        }
      },
      supplierRemote(query){
        this.loading = true;
        var storage=window.localStorage;
        var UserInfo=storage.getItem("UserInfo");
        var userPosts=JSON.parse(UserInfo).userPosts;
        var organizationId=userPosts[0].organizationId;
        if(this.form.purchaseType==0){
          if(query){
            getOrganizationSupplier(organizationId,{name:query}).then(res=>{
              this.loading = false
              if(res.code=='000000'){
                this.supplierName=res.data
              }
            })
          }
        }else{
          if(query){
            getSetupOrganization(query).then(res=>{
              this.loading = false;
              if(res.code=='000000'){
                this.supplierName=res.data
              }
            })
          }
        }
      },
      changeSupplierName(val){
        this.form.supplierName=val.name;
        this.form.supplierId=val.id;
      },
      SettlementUnitRemote(query){
        this.loading = true
        if(query){
          organizationListName({name:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.SettlementUnitName=res.data
            }
          })
        }
      },
      changeBillOrganizationName(val){
        this.form.billOrganizationName=val.name;
        this.form.billOrganizationId=val.id;
      },
      warehouseRemote(query){
        this.loading = true;
        var storage=window.localStorage;
        var UserInfo=storage.getItem("UserInfo");
        var userPosts=JSON.parse(UserInfo).userPosts;
        var organizationId=userPosts[0].organizationId
        if(query){
            getWarehouseName({name:query,organizationId:organizationId}).then(res=>{
              this.loading = false
              if(res.code=='000000'){
                this.warehouseName=res.data;
              }
            })
        }
      },
      ChangeDeliveryType(val){
        this.form.warehouseName='';
        if(val==1){
        	this.form.recipientName='';
        	this.form.recipientPhone='';
        	this.form.recipientAddressProvinceId='';
        	this.form.recipientAddressCityId='';
        	this.form.recipientAddressCountyId='';
        	this.form.recipientAddressLine='';
        }
      },
      changeWarehouseName(val){
        if(val){
          this.form.warehouseName=val.name;
          this.form.warehouseId=val.id;
          if(this.form.deliveryType==0){
            if(val.provinceId==0){
              this.form.recipientAddressProvinceId='';
              this.form.recipientAddressCityId='';
              this.form.recipientAddressCountyId='';
              this.form.recipientAddressLine='';
            }else{
              this.getcity(val.provinceId);
              this.getcounty(val.cityId,val);
            }
            if(val.warehouseContactDTOList.length>0){
              this.form.recipientName=val.warehouseContactDTOList[0].name;
              this.form.recipientPhone=val.warehouseContactDTOList[0].phone;
            }
          }
        }
      },
      ChangePurchaseType(val){
        this.form.supplierName='';
        this.warehouseName=[];
        this.form.purchaseType=val;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      changeSkuId(skuId,index,row){
        var reg=/^[0-9]/;
        var repeat=this.isRepeat(skuId,'skuNoType');
        if(repeat){
          if(reg.test(skuId)){
            if(skuId!=null&&skuId!=''){
              getManagementInfo(skuId).then(res=>{
                if(res.code=='000000'){
                  if(res.data==''){
                    this.list.skuId=skuId;
                    for(let key in this.list){                  
                      this.form.itemList[index][key]=this.list[key];
                    }
                  }else{
                  this.getGoodsInventory(res.data.skuId,index);
                    for(let key in res.data){                    
                      if(key=='taxRate'){
                        this.form.itemList[index][key]=res.data[key].toString()
                      }else{
                        this.form.itemList[index][key]=res.data[key];
                      }
                    }
                    this.form.itemList[index].discount=1;
                    this.form.itemList[index].purchasePrice=null;
                    this.form.itemList[index].purchaseQty=null;
                    this.form.itemList[index].showAmount=null;
                  }
                }
              })
            }
          }else{
            this.$message({
              type:'error',
              message:'请输入纯数字的商品编号！'
            })
            row.skuNo=null;
          }
        }else{
          var list={
            buyingPrice:'',
            discount:1,
            expectedDeliveryDate:'',
            itemMemo:'',
            previousPurchasePrice:'',
            purchasePrice:'',
            purchaseQty:'',
            skuId:'',
            skuNo:null,
            skuModel:'',
            skuName:'',
            taxRate:'',
            unit:'',
            amount:'',
            showAmount:null,
            totalAmount:'',
            finishInventoryQty:'',
            rowNum:''
          };
          this.$message({
            type:'error',
            message:'同一个采购单中不可以存在多个相同的商品！'
          });
          list.rowNum=this.form.itemList.length;
          this.list=list;
          this.form.itemList[index]=this.list;
        }
      },
      isRepeat(skuNo,type){
        var repeatNum=0;
        this.form.itemList.forEach((item,index)=>{
          if(item.skuNo==skuNo){
            repeatNum++;
          }
        })
        if(type=='skuNoType'&&repeatNum<=1){
          return true;
        }else if(type=='nameType'&&repeatNum==0){
          return true;
        }else{
          return false;
        }
      },
      show(row,column){
        let changeData='';
        if(column.property=='previousPurchasePrice'){
          if(row.previousPurchasePrice!=''&&row.previousPurchasePrice!=undefined){
            return changeData='￥'+Number(row.previousPurchasePrice).toFixed(4);
          }else{
            let previousPurchasePrice=0;
            return changeData='￥'+previousPurchasePrice.toFixed(4);
          }
        }
        if(column.property=='buyingPrice'){
          if(row.buyingPrice!=''&&row.buyingPrice!=undefined){
            return changeData='￥'+row.buyingPrice.toFixed(4);
          }
        }
      },
      changeSubtotal(val,row,index){
        row.showAmount=Number(val).toFixed(2);
        row.amount=Number(row.showAmount).toFixed(4);
        console.log(row.amount);
        if(row.purchaseQty){
          row.purchasePrice=(row.amount/row.purchaseQty).toFixed(4);
          row.totalAmount=(row.purchaseQty*row.purchasePrice).toFixed(2);
        }
      },
      changePurchase(val,row,index){
        row.totalAmount=(row.purchaseQty*row.purchasePrice).toFixed(2);
        row.amount=(row.purchaseQty*row.purchasePrice).toFixed(4);
        row.showAmount=(row.purchaseQty*row.purchasePrice).toFixed(2);
      },
      digitCheck(val,row){
        if(0<Number(row.discount)&&Number(row.discount)<1){
          let reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
          if(!reg.test(val)){
            row.discount=Number(row.discount).toFixed(2);
          }
        }else{
          if(Number(row.discount)==1){
            row.discount=1;
          }else{
            row.discount=0;
          }
        }
      },
      skuNameRemote(query){
        this.loading = true
          if(query){
            getManagementInfoName(query).then(res=>{
              this.loading = false
              if(res.code=='000000'){
                this.skuNames=res.data;
              }
            })
          }
      },
      skuIdChange(index,row){
        var skuNames=[];
        skuNames=this.skuNames.filter((item,index)=>{
          return row.skuName.skuNo==item.skuNo;
        });
        if(skuNames.length==0){
          this.form.itemList[index]= this.form.itemList[index];
        }else{
          var repeat=this.isRepeat(skuNames[0].skuNo,'nameType');
          if(repeat){
            getLastPurchasePrice(skuNames[0].skuId).then(res=>{
              if(res.code=='000000'){
                this.form.itemList[index]['previousPurchasePrice']=res.data;
              }
            });
            this.getGoodsInventory(skuNames[0].skuId,index);
            for(let key in skuNames[0]){
              if(key=='taxRate'){
                this.form.itemList[index][key]=skuNames[0][key].toString()
              }else{
                this.form.itemList[index][key]=skuNames[0][key];
              }
            }
            this.form.itemList[index].discount=1;
            this.form.itemList[index].purchasePrice=null;
            this.form.itemList[index].purchaseQty=null;
            this.form.itemList[index].showAmount=null;
          }else{
            var list={
              buyingPrice:'',
              discount:1,
              expectedDeliveryDate:'',
              itemMemo:'',
              previousPurchasePrice:'',
              purchasePrice:'',
              purchaseQty:'',
              skuId:'',
              skuNo:null,
              skuModel:'',
              skuName:'',
              taxRate:'',
              unit:'',
              amount:'',
              showAmount:null,
              totalAmount:'',
              finishInventoryQty:'',
              rowNum:''
            };
            this.$message({
              type:'error',
              message:'同一个采购单中不可以存在多个相同的商品！'
            })
            list.rowNum=this.form.itemList.length;
            this.list=list;
            this.form.itemList[index]=this.list;
          }
          
        }
      },
      getGoodsInventory(skuId,index){
        // var storage=window.localStorage;
        // var UserInfo=storage.getItem("UserInfo");
        // var userPosts=JSON.parse(UserInfo).userPosts;
        // var organizationId=userPosts[0].organizationId;
        // await getOrganization(organizationId).then((res)=>{
        //   if(res.code=='000000'){
        //     this.useLeadingWMS=res.data.useLeadingWMS;
        //   }
        // })
        // if(this.useLeadingWMS){
          this.skuIds=[];
          if(skuId!=''&&this.form.warehouseId!=''){
              this.skuIds.push(skuId);
              getGoodsInventory({
                skuIds:this.skuIds,
                warehouseId:this.form.warehouseId
              }).then(res=>{
                if(res.code=='000000'){
                  if(res.data.length==0){
                    this.form.itemList[index]['finishInventoryQty']='---';
                  }else{
                    this.form.itemList[index]['finishInventoryQty']=res.data[0].availableQty;
                  }
                  this.skuIds=[];
                }
              })
          }
        // }else{
        //   this.form.itemList[index]['finishInventoryQty']='---';
        // }
      },
      addPurchaseApprovalOrder(formName){
        this.$refs[formName].validate((valid) => {
          if(valid) {
            for(let i=0;i<this.form.itemList.length;i++){
              this.form.itemList[i].discount=Math.ceil(Number(this.form.itemList[i].discount)*100);
              if(this.form.itemList[i].finishInventoryQty==='---'){
                this.form.itemList[i].finishInventoryQty=0;
              }
            }
            addPurchaseApproval(this.form).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.form=JSON.parse(JSON.stringify(this.forms));
                this.timeout = setTimeout(() => {
                  this.$refs[formName].clearValidate();
                  this.close({name:'addPurchaseOrder', to: {name:'PurchaseOrder', params:{isUpdate:true}}});
                }, 1000 * Math.random());
              }
            }).catch((rej)=>{
              for(let i=0;i<this.form.itemList.length;i++){
                this.form.itemList[i].discount=Math.ceil(Number(this.form.itemList[i].discount)/100);
              }
            })
          } else {
            return false;
          }
        });      
      },
      addRow () {
        var list={
          buyingPrice:'',
          discount:1,
          expectedDeliveryDate:'',
          itemMemo:'',
          previousPurchasePrice:'',
          purchasePrice:'',
          purchaseQty:'',
          skuId:'',
          skuNo:null,
          skuModel:'',
          skuName:'',
          taxRate:'',
          unit:'',
          amount:'',
          showAmount:null,
          totalAmount:'',
          finishInventoryQty:'',
          rowNum:''
        };
        list.rowNum=this.form.itemList.length;
        this.form.itemList.push(list);
      },
      delData() {
        if(this.multipleSelection.length>0){
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let val = this.multipleSelection;
            val.forEach((val, index) => {
              this.form.itemList.forEach((v, i) => {
                if (val.rowNum === v.rowNum) {
                  this.form.itemList.splice(i, 1)
                }
              })
            })
          }
          this.$refs.multipleTable.clearSelection()
        }else{
          this.$confirm('请先选择商品明细','移除提示',{
            confirmButtonText:'确定',
            type:'warning'
          })  
        }
      },
      getProvinces(){
        provinces_based_id().then(res=>{
          if(res.code=='000000'){
            this.province = res.data;
          }
        })
      },
      getcity(id){
        subs(id).then(res=>{
          if(res.code=='000000'){
            this.city = res.data;
          }
        })
      },
      getcounty(id,val){
        subs(id).then(res=>{
          if(res.code=='000000'){
            this.county = res.data;
            if(val){
              this.form.recipientAddressProvinceId=val.provinceId;
              this.form.recipientAddressCityId=val.cityId;
              this.form.recipientAddressCountyId=val.countyId;
              this.form.recipientAddressLine=val.addressLine;
            }
          }
        })
      },
      onCityChange(val){
        this.form.recipientAddressCountyId='';
        this.getcounty(val);
      },
      onProvincesChange(val){
        this.form.recipientAddressCityId='';
        this.getcity(val);
      },
      closed(){
        this.close();
      },
    }
  }
</script>

<style scoped lang="less">
    @color:#f3f3f3;
    .form-wrapper{
        margin-top:20px;
        border-right:1px solid #e4e4e4;
        border-left:1px solid #e4e4e4;
        border-bottom:1px solid #e4e4e4;
        .form-box{
        /deep/.el-row{
            margin:25px 0 0 50px; 
            .forms{
              .el-form-item__content{
                display: inline-block;
                width: 53%;
                margin-left:0 !important;
                .el-select{
                  width: 100%;
                }
                .el-date-editor{
                  width: 100%
                }
              }
            }
            .addressBox{
              flex-wrap: nowrap;
              display: flex;
              .el-form-item__content{
                width: 80%;
                display: flex;
                flex-wrap: nowrap;
                margin-left:0 !important;
                .el-select {
                   width: 20%;
                  flex-grow: 0;
                  flex-shrink: 0;
                }
                .addressLine{
                  width: 25%;
                }
              }
            }
        }
      }
    }
    .listBox {
      font-size: 12px;
      background-color:@color;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
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
        /deep/.el-input--small {
          .el-input__inner{
            width: 85%;
          }
        }
        /deep/.el-select{
          width: 100%;
        }
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
