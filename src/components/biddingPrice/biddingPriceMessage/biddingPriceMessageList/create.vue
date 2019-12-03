<template>
  <div class="form-wrapper">
    <addhead headname="基本信息：" iconName="iconjinridingdanshu"></addhead>
    <div>
      <el-form ref="formName" :rules="rules" :model="form" class="form-box">
        <el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目：" label-width="135px" class="forms" prop="projectName">
                <el-select
                  v-model="form.projectName"
                  filterable
                  remote
                  clearable
                  placeholder="项目名称"
                  :remote-method="projectNameRemote"
                  @change="changeBiddingEndTime"
                  style="margin-left:0px;"
                  :loading="loading">
                  <el-option
                    v-for="item in projectNames"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="客户：" label-width="135px" class="forms" prop="customerNameCustomize">
                <el-autocomplete
                  v-model="form.customerNameCustomize"
                  :fetch-suggestions="querySearchAsync"
                  value-key="name"
                  @select="handleSelect"
                  clearable
                  placeholder="客户姓名"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购人：" label-width="135px" class="forms" prop="purchaserName">
                <el-input  v-model="form.purchaserName" style="width: 200px"></el-input>   
              </el-form-item>
            </el-col>  
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="采购人联系方式：" label-width="135px" class="forms" prop="purchaserPhone">
                <el-input  v-model="form.purchaserPhone" style="width: 200px"></el-input>   
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货人：" label-width="135px" class="forms" prop="recipientName">
                <el-input  v-model="form.recipientName" style="width: 200px"></el-input>   
              </el-form-item>
            </el-col> 
            <el-col :span="8">
              <el-form-item label="收货人联系方式：" label-width="135px" class="forms" prop="recipientPhone">
                <el-input  v-model="form.recipientPhone" style="width: 200px"></el-input>   
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="收货地址：" label-width="135px" class="forms address-input" prop="address">
                <el-input  v-model="form.address" @focus="addressDialog=true"></el-input>   
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="外部竞价编号：" label-width="135px" class="forms" prop="exteriorNo">
                <el-input  v-model="form.exteriorNo" style="width: 200px"></el-input>   
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="竞价名称：" label-width="135px" class="forms" prop="biddingName">
                <el-input  v-model="form.biddingName" style="width: 200px"></el-input>   
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="竞价开始时间：" label-width="135px" class="forms" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  type="datetime"
                  style="width: 200px"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="changeBiddingStartTime"
                  placeholder="竞价开始时间">
                </el-date-picker>  
              </el-form-item>
            </el-col> 
            <el-col :span="8">
              <el-form-item label="竞价截止时间：" label-width="135px" class="forms" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 200px"
                  @change="changeBiddingEndTime"
                  placeholder="竞价截止时间">
                </el-date-picker>    
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label=" 报价截止时间：" label-width="135px" class="forms" prop="priceQuoteEndTime">
                <el-input  v-model="form.priceQuoteEndTime" placeholder="报价截止时间" style="width: 200px" disabled></el-input>   
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期望到货日期：" label-width="135px" class="forms" prop="expectedDeliveryDate">
                <el-date-picker
                  v-model="form.expectedDeliveryDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 200px"
                  placeholder="选择期望到货日期">
                </el-date-picker>  
              </el-form-item>
            </el-col> 
            <el-col :span="8">
              <el-form-item label="付款日期：" label-width="135px" class="forms" prop="payDate">
                <el-date-picker
                  v-model="form.payDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 200px"
                  placeholder="选择付款日期">
                </el-date-picker>    
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="付款方式：" label-width="135px" class="forms" prop="payType">
                <el-input  v-model="form.payType" style="width: 200px"></el-input>     
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="服务方：" label-width="135px" class="forms" prop="serverName">
                <el-select
                  v-model="form.serverName"
                  filterable
                  remote
                  clearable
                  placeholder="请输入服务方"
                  @change="changeServer"
                  :remote-method="servicePartyNameRemote"
                  :loading="loading">
                  <el-option
                    v-for="item in servicePartyName"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> 
            <el-col :span="8">
              <el-form-item label="起拍价：" label-width="135px" class="forms" prop="startPrice">
                <el-input type="number"  v-model.number="form.startPrice" style="width: 200px"></el-input>   
              </el-form-item>
            </el-col>  
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="竞价备注：" label-width="135px" class="forms forms-textarea" prop="memo">
                <el-input type="textarea"  v-model="form.memo"></el-input>   
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
                <span>商品信息：</span>
            </div>
            <div class="listBoxRight">
              <el-button size="small" @click="addRow"><i class="iconfont icontianjiashangpin"></i><span>添加</span></el-button>
            </div>
        </div>
        <el-table
            ref="multipleTable"
            :data="form.createBiddingSkuParamList"
            style="width: 100%"
            :header-cell-class-name='must'
            @selection-change="handleSelectionChange"
            border>
            <el-table-column
              label="操作"
              align="center" min-width="150px">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="delData(scope.$index)" >删除</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              :index="indexMethod"
              label="条目号"
              align="center" 
              width="150px">
            </el-table-column>
            <el-table-column
                label="商品名称"
                align="center"
                width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.skuName"></el-input>  
                </template>
            </el-table-column>
            <el-table-column
                label="分类"
                align="center"
                width="120">
                <template slot-scope="scope">
                   <el-input v-model="scope.row.category"></el-input>  
                </template>
            </el-table-column>
            <el-table-column
                label="品牌"
                align="center"
                width="120">
                <template slot-scope="scope">
                   <el-input v-model="scope.row.brand"></el-input>  
                </template>
            </el-table-column>
            <el-table-column
                label="规格型号"
                align="center"
                width="120">
                <template slot-scope="scope">
                   <el-input v-model="scope.row.specification"></el-input>  
                </template>
            </el-table-column>
            <el-table-column
                label="单位"
                align="center"
                width="120">
                <template slot-scope="scope">
                   <el-input v-model="scope.row.unit"></el-input>  
                </template>
            </el-table-column>
            <el-table-column
                label="数量"
                align="center"
                width="120">
                <template slot-scope="scope">
                  <el-input type="number" v-model.number="scope.row.qty" @blur="(val) => {digitCheck(val,scope.row,'qty')}"></el-input> 
                </template>
            </el-table-column>
            <el-table-column
                label="单价"
                align="center"
                width="120">
                <template slot-scope="scope">
                   <el-input type="number" v-model="scope.row.price" @blur="(val) => {digitCheck(val,scope.row,'price')}"></el-input>  
                </template>
            </el-table-column>
            <el-table-column
                label="备注"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <el-input  v-model="scope.row.memo"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="createBiddingPrice('formName','addressName')">保存并推送</el-button>
      <el-button type="primary" @click="cancel()">取消</el-button>
    </div>
    <el-dialog title="收货地址" :visible.sync="addressDialog">
      <el-form ref="addressName" :rules="formRules" :model="formAddress">
        <div class="address-box">
          <el-form-item label="收货地址：" label-width="110px" class="forms addressBox" prop="provinceName">
            <el-select v-model="formAddress.provinceName" placeholder="选择省/直辖市" @change="onProvincesChange">
              <el-option
                v-for="(item,index) in province"
                :key="index"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="cityName">
            <el-select v-model="formAddress.cityName" placeholder="选择城市" @change="onCityChange">
              <el-option
                v-for="(item,index) in city"
                :key="index"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="countyName">
            <el-select v-model="formAddress.countyName" placeholder="选择区/县" @change="onCountyChange">
              <el-option
                v-for="(item,index) in county"
                :key="index"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="详情地址：" label-width="110px" class="forms addressBox" prop="addressLine">
          <el-input type="textarea"  v-model="formAddress.addressLine"></el-input>   
        </el-form-item>
        <el-form-item class="forms addressBox" style="text-align: center;">
          <el-button type="primary" @click="submitAddressDialog('addressName')">确定</el-button>
          <el-button type="primary" @click="oncancel('addressDialog','addressName')">取消</el-button>  
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="saveDialogTile"
      :visible.sync="saveDialog"
      width="30%">
      <span>{{saveDialogTips}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDialog = false" v-if="saveDialogTile=='错误提示'">确 定</el-button>
        <el-button type="primary" @click="saveDialog = false" v-if="saveDialogTile=='警告'">取消</el-button>
        <el-button type="primary" @click="addBiddingPrice('formName')" v-if="saveDialogTile=='警告'">确定</el-button>
        <el-button type="primary" @click="saveDialog = false" v-if="saveDialogTile=='取消确认'">取消</el-button>
        <el-button type="primary" @click="closed" v-if="saveDialogTile=='取消确认'">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'

  import {
    provinces_based_id,
    subs
  } from '@/api/basicSupplier';

  import {
    createBiddingPrice,
    getServiceParty,
    getBiddingEndTime,
    addBiddingPrice
  } from '@/api/biddingPrice/biddingPriceMessage';

  import {
    nameList,
    simpleList,
    organizationListName
  } from "@/api/projectController/projectController";
  import {
    pnameList
  } from "@/api/customerManage";

  import { constants } from 'zlib';
  import { connect } from 'net';
  import { unwatchFile } from 'fs';
  import { parseTime } from "@/utils/index";

  export default {
    inject:['close'],
    name:'biddingPriceMessageCreate',
    data() {
      var changePrice=(rule,value,callback)=>{
        let reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if(reg.test(value)){
          callback();
        }else{
          callback(new Error('请输入包含两位小数的正数！'))
          this.form.startPrice=null;
        }
      }
      return {
        saveDialogTile:'',
        saveDialog:false,
        saveDialogTips:'',
        customerName:'',
        customerNames:[],
        projectNames:[],
        servicePartyName:[],
        addressDialog:false,
        province:[],
        city:[],
        county:[],
        skuNames:[],
        options:[],
        value: [],
        timeout:null,
        list: [],
        multipleSelection:[],
        loading: false,
        supplierId:'',
        supplierName:[],
        SettlementUnitName:[],
        rejectreason:'',
        rejectdialog:false,
        form:{
          address:'',
          addressLine: '',
          biddingName: '',
          biddingNo: '',
          cityId: '',
          countyId: '',
          createBiddingSkuParamList: [],
          customerId: '',
          customerNameCustomize: '',
          endTime: '',
          expectedDeliveryDate: '',
          exteriorNo: '',
          memo: '',
          payDate: '',
          payType:'',
          priceQuoteEndTime: '',
          projectId:'',
          projectName:'',
          provinceId: '',
          purchaserName: '',
          purchaserPhone: '',
          recipientName: '',
          recipientPhone: '',
          serverId:'',
          serverName:'',
          startPrice:'',
          startTime: ''
        },
        forms:{
          address:'',
          addressLine: '',
          biddingName: '',
          biddingNo: '',
          cityId: '',
          countyId: '',
          createBiddingSkuParamList: [],
          customerId: '',
          customerNameCustomize: '',
          endTime: '',
          expectedDeliveryDate: '',
          exteriorNo: '',
          memo: '',
          payDate: '',
          payType:'',
          priceQuoteEndTime: '',
          projectId:'',
          projectName:'',
          provinceId: '',
          purchaserName: '',
          purchaserPhone: '',
          recipientName: '',
          recipientPhone: '',
          serverId:'',
          serverName:'',
          startPrice:'',
          startTime: ''
        },
        rules:{
          projectName:[
            { required:true, message: '请选择项目名称', trigger:'change'}
          ],
          customerNameCustomize:[
            { required:true, message: '请选择客户', trigger:'change'}
          ],
          exteriorNo:[
             { required:true, message: '请输入外部竞价编号', trigger:'change'}
          ],
          endTime:[
             { required:true, message: '请选择竞价截止时间', trigger:'change'}
          ],
          priceQuoteEndTime:[
             { required:true, message: '* 请选择报价截止时间', trigger:'change'}
          ],
          serverName:[
             {required:true, message: '请选择服务方', trigger:'change'}
          ],
          address:[
             { required:true, message: '请输地址', trigger:'change'}
          ],
          startPrice:[
             { required:true, message: '请输入起拍价', trigger:'change'},
             {
              type:'number',
              validator:changePrice,
              trigger:'change'
             }
          ]
        },
        list:{
          brand: '',
          category: '',
          memo: '',
          price: 0,
          qty: 0,
          skuName: '',
          specification:'',
          unit: ''
        },
        isEmpty:true,
        formAddress:{
          addressLine:null,
          provinceName:null,
          cityName:null,
          countyName:null,
        },
        formAddresses:{
          addressLine:null,
          provinceName:null,
          cityName:null,
          countyName:null,
        },
        address:{
          addressLine:null,
          provinceName:null,
          projectId:null,
          cityName:null,
          cityId:null,
          countyName:null,
          countyId:null
        },
        formRules:{
          addressLine:[
            { required:true, message: '请添写详细地址', trigger:'blur'}
          ],
          provinceName:[
            { required:true, message: '请选择省', trigger:'blur'}
          ],
          cityName:[
            { required:true, message: '请选择市', trigger:'blur'}
          ],
          countyName:[
            { required:true, message: '请选择县区', trigger:'blur'}
          ],
        }
      }
    },
    components:{
      addhead,
    },
    created(){
      this.getProvinces();
    },
    methods: {
      projectNameRemote(query){
        this.loading = true
        if(query){
          nameList({name:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.projectNames=res.data;
            }
          })
        }
      },
      getBiddingEndTime(){
          getBiddingEndTime(this.form.projectId).then(res=>{
            if(res.code=='000000'){
              if(res.data){
                const date = new Date(+new Date(this.form.endTime.replace(/-/g, "/")) - res.data*60* 1000);
                this.form.priceQuoteEndTime=parseTime(date);
              }else{
                this.form.priceQuoteEndTime=this.form.endTime;
              }  
            }
          })
      },
      changeBiddingEndTime(val){
        if(typeof val=='string'){
          if(this.form.projectId!=''&&this.form.endTime!=''){
            this.getBiddingEndTime();
          }
          if(this.form.startTime!=''&&this.form.endTime!=''){
            var begin = new Date(this.form.startTime).getTime()
            var end = new Date(this.form.endTime).getTime();
            if(begin>end){
              this.$message({
                message: '竞价结束时间不能拿小于竞价开始时间！',
                type: 'error'
              });
              this.form.endTime=null;
            }
          }
        }else{
          this.form.projectId=val.id;
          this.form.projectName=val.name;
          if(this.form.projectId!=''&&this.form.endTime!=''){
            this.getBiddingEndTime();
          }
        }
      },
      changeBiddingStartTime(){
        if(this.form.startTime!=''&&this.form.endTime!=''){
          var begin = new Date(this.form.startTime).getTime()
          var end = new Date(this.form.endTime).getTime();
          if(begin>end){
            this.$message({
              message: '竞价结束时间不能拿小于竞价开始时间！',
              type: 'error'
            });
            this.form.startTime=null;
          }
        }
      },
      querySearchAsync(queryString, cb) {
        pnameList({
          projectId:this.form.projectId,
          customerName:this.form.customerNameCustomize
        }).then(res=>{
            this.customerNames=[];
            if(res.code=='000000'){
              this.customerNames =res.data;
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                cb(this.customerNames);
              }, 3000 * Math.random());
            }
          })
      },
      handleSelect(item) {
        this.form.customerId=item.id;
      },
      servicePartyNameRemote(query){
        this.loading = true
        if(query){
          getServiceParty({name:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.servicePartyName=res.data;
            }
          })
        }
      },
      changeServer(val){
        this.form.serverId=val.id;
        this.form.serverName=val.name;
      },
      submitAddressDialog(addressName){
        this.$refs[addressName].validate((valid) => {
          if(valid) {
            this.address.countyId=this.form.countyId;
            this.address.countyName= this.formAddress.countyName;
            this.address.cityId=this.form.cityId;
            this.address.cityName= this.formAddress.cityName;
            this.address.projectId=this.form.projectId;
            this.address.provinceName= this.formAddress.provinceName;
            this.address.addressLine=this.formAddress.addressLine;
            this.form.address=this.formAddress.provinceName+this.formAddress.cityName+this.formAddress.countyName+this.formAddress.addressLine;
            this.form.addressLine=this.formAddress.addressLine;
            this.addressDialog=false;
          } else {
            return false;
          }
        });      
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
        if(column.property=='amount'){
          if(row.purchaseQty!=undefined&&row.purchasePrice!=undefined){
            return changeData='￥'+(row.purchaseQty*row.purchasePrice).toFixed(4);
          }else{
            let amount=0;
            return changeData='￥'+amount.toFixed(4);
          }
        }
      },
      createBiddingPrice(formName,addressName){
        this.$refs[formName].validate((valid) => {
          if(valid) {
             createBiddingPrice(this.form).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.form=JSON.parse(JSON.stringify(this.forms));
                this.formAddress=JSON.parse(JSON.stringify(this.formAddresses));
                this.timeout = setTimeout(() => {
                  this.$refs[formName].clearValidate();
                  this.$refs[addressName].clearValidate();
                  this.close({name:'biddingPriceMessageCreate', to: {name:'biddingPriceMessageList', params:{isUpdate:true}}});
                }, 1000 * Math.random());
              }
            }).catch(rej=>{
              if(rej.response.data.code=='010210004'){
                this.saveDialogTile='错误提示';
                this.saveDialogTips=`该竞价信息（${this.form.projectName} ${this.form.exteriorNo}）已存在，不可重复添加`;
                this.saveDialog=true;
              }
              if(rej.response.data.code=='010210011'){
                this.saveDialogTile='警告';
                this.saveDialogTips=`${this.form.serverName}服务方已报备该竞价信息，与当前服务方不一致确定要保存吗？`;
                this.saveDialog=true;
              }
            })
          } else {
            return false;
          }
        });      
      },
      addBiddingPrice(formName){
        this.saveDialog=false;
        this.$refs[formName].validate((valid) => {
          if(valid) {
            addBiddingPrice(this.form).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$refs[formName].clearValidate();
                 this.timeout = setTimeout(() => {
                    this.form=JSON.parse(JSON.stringify(this.forms));
                  }, 3000 * Math.random());
              }
            })
          } else {
            return false;
          }
        });      
      },
      addRow () {
        var list={
          brand: '',
          category: '',
          memo: '',
          price:'',
          qty:'',
          skuName: '',
          specification:'',
          unit: '',
        }
        if(this.form.createBiddingSkuParamList.length!=0){
          let i=this.form.createBiddingSkuParamList.length-1;
          let val=this.form.createBiddingSkuParamList[i];
          this.isEmpty=true;
          for(let value in val){
            if(value=='skuName'||value=='qty'){
              if(val[value]==''){
                this.isEmpty=false;
                this.$message({
                  message:'请输入完整信息',
                  type:'error'
                })
                break;
              }
            }
            
          }
          if(this.isEmpty){
            this.form.createBiddingSkuParamList.push(list);
          }
        }else{
          this.form.createBiddingSkuParamList.push(list);
        }
        
      },
      delData(index) {
        this.form.createBiddingSkuParamList.splice(index, 1);
      },
      indexMethod(index){
        return index+1;
      },
      digitCheck(val,row,type){
        if(type=='qty'){
          row.qty=Number(row.qty).toFixed(0);
        }
        if(type=='price'){
          let reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
          if(!reg.test(val)){
            row.price=Number(row.price).toFixed(2);
          }
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
              this.form.provinceId=val.provinceId;
              this.form.cityId=val.cityId;
              this.form.countyId=val.countyId;
              this.form.addressLine=val.addressLine;
            }
          }
        })
      },
      onCountyChange(val){
        this.form.countyId=val.id;
        this.formAddress.countyName=val.name;
      },
      onCityChange(val){
        this.form.cityId=val.id;
        this.formAddress.cityName=val.name;
        this.form.countyId=null;
        this.formAddress.countyName=null;
        this.getcounty(val.id);
      },
      onProvincesChange(val){
        this.form.provinceId=val.id;
        this.formAddress.provinceName=val.name;
        this.form.cityId=null;
        this.formAddress.cityName=null;
        this.form.countyId=null;
        this.formAddress.countyName=null;
        this.getcity(val.id);
      },
      must(obj){
        if (obj.columnIndex === 2 || obj.columnIndex === 7) {
          return 'must'
        }
      },
      cancel(){
        this.saveDialogTile='取消确认';
        this.saveDialogTips='取消后，当前填写的信息将不保存，确定取消？';
        this.saveDialog=true;
      },
      closed(){
        this.saveDialog = false
        this.close();
      },
      oncancel(type,formName) {
        switch(type){
          case 'addressDialog':
            this.addressDialog=false;
            this.$refs.formName.clearValidate();
            this.formAddress=JSON.parse(JSON.stringify(this.address));
            this.form.projectId=this.address.projectId;
            this.form.cityId=this.address.cityId;
            this.form.countyId=this.address.countyId;
          break;
          case 'entryResultDialog':
            this.entryResultDialog=false;
            this.entryResultForm=this.entryResultForms;
          break;
        }
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
        .el-row{
            margin:25px 0 0 50px; 
            /deep/.forms{
              /deep/.el-form-item__content{
                  display: inline-block;
                  width: 53%;
                  margin-left:0 !important;
              }
            }
            /deep/.address-input{
              .el-form-item__content{
                width: 76%;
              }
            }
            /deep/.forms-textarea{
              /deep/.el-form-item__content{
                width: 84%;
                .el-textarea{
                  max-height: 400px;
                  overflow:auto;
                  height: 80px;
                  .el-textarea__inner{
                    height: 100%;
                  }
                }
               
              }
            }
            /deep/.addressBox{
              /deep/.el-form-item__content{
                  width: 90%;
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
        .el-button {
          padding: 9px 15px;
          border-radius: 3px;
          font-size: 12px;
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
      }
    }
    /deep/table th.must div:before {
      content:'*';
      color:#ff1818;
      margin-right: 3px;
    }
    .button-box{
      width: 90%;
      margin: 20px auto 50px;
      display: flex;
      justify-content: center;
    }
    /deep/.el-dialog__wrapper{
      .el-dialog{
        width: 40%;
        .el-dialog__header{
          background-color: #F2F2F2;
        }
        .el-dialog__body{
          .el-form-item__content{
         
          }
        }
      }
     
    }
    .address-box{
      display: flex;
    }
</style>
