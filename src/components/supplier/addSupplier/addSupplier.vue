<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="addbac-ruleForm">
<div class="editerbusinessBox">
<div class="h50 headerBox1"><i class="icon iconfont iconshujuliebiao"></i><span>供应商基本信息</span></div>
  
    <el-form-item label="供应商公司名称：" prop="name">
      <el-input v-model="ruleForm.name" maxlength="30" placeholder="字数长度1~30以内"></el-input>
<!--      <div class="tipBox">如无中文名，请在中文名处输入英文名</div>-->
    </el-form-item>
    <el-form-item label="供应商类型：" prop="type">
      <el-radio-group v-model="ruleForm.type">
      <el-radio label="VENDOR">厂商</el-radio>
      <el-radio label="GENERAL_AGENT">总代</el-radio>
      <el-radio label="REGIONAL_AGENT ">区域代理</el-radio>
      <el-radio label="PROVINCE_AGENT">省代</el-radio>
      <el-radio label="CITY_AGENT">市代</el-radio>
      <el-radio label="DEALER">经销商</el-radio>
    </el-radio-group>
    </el-form-item>
    <!--<el-form-item label="供应商等级：" prop="supplierGradeLevel">
      <el-select v-model="ruleForm.supplierGradeLevel" placeholder="供应商等级" style="width: 730px;">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>-->
    <el-form-item label="公司法人：" prop="legalPersonName">
      <el-input v-model="ruleForm.legalPersonName" placeholder="输入姓名，字数1~15以内"></el-input>
    </el-form-item>
    <el-form-item label="法人身份证：">
      <el-input v-model="ruleForm.legalPersonIdCard" placeholder="18位字符"></el-input>
    </el-form-item>
    <el-form-item label="统一社会信用代码：" prop="socialCreditCode">
      <el-input v-model="ruleForm.socialCreditCode" placeholder="请输入公司纳税识别号"></el-input>      	
			<li style="line-height: 12px;font-size: 12px;">统一社会信用代码：是指工商营业执照、组织机构代码证、税务登记证的统称</li>
    </el-form-item>
    <el-form-item label="经营范围：">
      <el-input type="textarea" v-model="ruleForm.businessScope"  :rows="5" placeholder="字数长度1~1000以内"></el-input>
  	</el-form-item>
  	<!--<el-form-item label="省/市/区：">
	    <el-select v-model="ruleForm.provinceId" filterable  placeholder="省" style="width: 240px;" @change="o1change">
	      <el-option 
	      	v-for="o in o1"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>	      
	    </el-select>
	    <el-select v-model="ruleForm.cityId" filterable placeholder="市" style="width: 240px;" @change="o2change">
	      <el-option 
	      	v-for="o in o2"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>
	    </el-select>
	    <el-select v-model="ruleForm.countyId" filterable placeholder="县/区" style="width: 240px;" @change="o3change">
	      <el-option 
	      	v-for="o in o3"
	      	:key="o.id"
	      	:label="o.name" 
	      	:value="o.id">	      	
	      </el-option>
	    </el-select>
    </el-form-item>-->
    <el-form-item label="供应商注册地址：" required>
      <el-col style="width: 200px;margin-right: 10px;">
	    	<el-form-item prop="provinceId">
	         <el-select v-model="ruleForm.provinceId" filterable  placeholder="省" style="width: 100%;" @change="o1change">
			      <el-option 
			      	v-for="o in o1"
			      	:key="o.id"
			      	:label="o.name" 
			      	:value="o.id">	      	
			      </el-option>	      
			    </el-select>
	      </el-form-item>
    	</el-col>
    	<el-col style="width: 200px;margin-right: 10px;">
	    	<el-form-item prop="cityId">
	        <el-select v-model="ruleForm.cityId" filterable placeholder="市" style="width: 100%;" @change="o2change">
			      <el-option 
			      	v-for="o in o2"
			      	:key="o.id"
			      	:label="o.name" 
			      	:value="o.id">	      	
			      </el-option>
			    </el-select>
	      </el-form-item>
    	</el-col>
    	<el-col style="width: 200px;margin-right: 10px;">
	    	<el-form-item prop="countyId">
	        <el-select v-model="ruleForm.countyId" filterable placeholder="县/区" style="width: 100%;">
			      <el-option 
			      	v-for="o in o3"
			      	:key="o.id"
			      	:label="o.name" 
			      	:value="o.id">	      	
			      </el-option>
			    </el-select>
	      </el-form-item>
    	</el-col>
    </el-form-item>
    <el-form-item label="详细地址：">
      <el-input type="textarea" v-model="ruleForm.addressLine"  :rows="5" placeholder="请输入200字以内"></el-input>
  	</el-form-item>
  	<el-form-item label="资质文件：">
			<el-upload
	  class="upload-demo"
	  action="/api/file-service/file/upload"	 
	  :data="{type:'Supplier'}"
	  multiple
	  name="fileName"
	  :headers="headertoken"
	  :on-change="handleChange"  
	   :file-list="fileList3"
	   :on-remove="removefilelist"
	   :on-success="handleAvatarSuccess"
	  :before-upload="beforeAvatarUpload">
	  <el-button size="small" type="primary">点击上传</el-button>
	  <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过2M</div>
		</el-upload>
		
  	</el-form-item>
  	<el-form-item label="管理员账号：" prop="userDataAuthorityId">
      
      <el-select
			    v-model="ruleForm.userDataAuthorityId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入姓名"
			    :remote-method="remoteMethod"
			    @change="adminchange"
			    >
			    <el-option
			      v-for="item in options4"
			      :key="item.id"
			      :label="item.userName"
			      :value="item.id">
			    </el-option>
			  </el-select>
			  <span style="padding-left: 100px;">真实姓名：</span><span>{{realName}}</span>
    </el-form-item>
  	<div class="h50 headerBox1" style="border-top: 1px solid #E4E4E4;"><i class="icon iconfont iconshujuliebiao"></i><span>供应商经营范围</span></div>
    
    <el-form-item label="公司经营区域：" prop="regionIds">
      <div id="" style="width: 730px;border-radius: 5px;border: 1px solid #e5e5e5;">
      	<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			  <el-checkbox-group v-model="ruleForm.regionIds" @change="handleCheckedCitiesChange">
			    <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
			  </el-checkbox-group>
      </div>
    </el-form-item>
    <el-form-item label="选择经营分类：" prop="classify" class="listBox">
        <div class="listLeftBox left">
           <div class="headerBox"><span>分类选项列表</span></div>
           <div class="lltree">
           	<el-tree
          	ref="tree"
            :data="data2"
            show-checkbox
            node-key="id"
            render-after-expand 
            @check="getnode()"
            :props="defaultProps">
          </el-tree>
           </div>
          
        </div>
         <div class="listRightBox left">
         <div class="headerBox"><span>已选分类预览</span></div>
         <div class="lltree" style="position: relative;">
         	<el-tree
             :data="data2"
            	ref="tree2"
             node-key="id"
             render-after-expand            
             :filter-node-method="filterNode"
             :props="defaultProps">
           </el-tree>
           <el-input  v-model="ruleForm.classify" style="position:absolute;top: 0px;width: 1px;height: 1px;opacity: 0;padding: 0;z-index: -1;"></el-input >
         </div>
           
         </div>
    </el-form-item>
    <el-form-item label="公司经营品牌：" prop="isbrandids" class="listBox">
        <div class="listLeftBox left">
           <div class="headerBox" style="position: relative;"><span>品牌选项列表</span><span style=" position: absolute;top: 3px;right: 10px;color: #339999;cursor: pointer;" @click="goaddbrand()">+新增品牌</span></div>
            <el-cascader
            style="width: 290px;"
				    placeholder="从已选分类列表中选择一个分类"
				    :options="options"
				    :props="cascaderProps"
				    v-model="cascaderData"
				    @change="cascadechange"
				    filterable
				  ></el-cascader>
				  <el-input v-model="ruleForm.isbrandids" type="hidden" style="width: 0px;height: 0px;"></el-input>
				  <el-checkbox-group v-model="ruleForm.classify2" @change="PPchange" style="height: 272px; width: 300px; overflow-y: auto;overflow-x: auto;">
			    <el-checkbox v-for="city in citys" :label="city.id" :key="city.id" style="display: block;line-height: 25px;">{{city.id}}&nbsp;{{city.nameCN}}&nbsp;{{city.registeredNo}}&nbsp;{{city.registrant}}</el-checkbox>
			  	</el-checkbox-group>
        </div>
         <div class="listRightBox left">
         <div class="headerBox"><span>已选品牌预览</span></div>
         <div class="lltree" style="overflow: auto;">
         	<div v-for="(item,a) in ruleForm.categoryBrandIds">
         		<p style="color: #FF4D51;" v-if="item.brandIds.length>0">{{item.categoryName}} - -</p>
         		<li v-for="(it,b) in item.brandDTO" style="padding-left: 30px;">
         			{{it.id}}&nbsp;{{it.nameCN}}&nbsp;{{it.registeredNo}}&nbsp;{{it.registrant}} 
         			<i class="el-icon-close" style="cursor: pointer;" @click="deleteBrand(a,b,it.id)"></i>
         		</li>
         	</div>
         	 
         </div>
          
         </div>
    </el-form-item>
    <div class="h50 headerBox1" style="border-top: 1px solid #E4E4E4;"><i class="icon iconfont iconkaipiaoxinxi"></i><span>供应商财务开票信息</span></div>
    <el-form-item label="开票抬头：">
    <span >{{ruleForm.name}}</span>
  </el-form-item>
     <el-form-item label="统一社会信用代码：">
    <span style="color: red;">{{ruleForm.socialCreditCode}}</span>
  </el-form-item>
    <el-form-item label="公司纳税级别：">
    <el-radio-group v-model="ruleForm.supplierTaxLevel">
      <el-radio label="TAX_LEVEL0">一般纳税人</el-radio>
      <el-radio label="TAX_LEVEL1">小规模纳税人</el-radio>
    </el-radio-group>
  </el-form-item>
 
  <el-form-item label="开户行：">
      <el-input v-model="ruleForm.bank" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="开户名称：">
      <!--<el-input v-model="ruleForm.accountName" placeholder=""></el-input>-->
      {{ruleForm.name}}
    </el-form-item>
    <el-form-item label="开户账号：">
      <el-input v-model="ruleForm.accountNo" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="开票地址：">
      <el-input type="textarea" :rows="5" v-model="ruleForm.addressOnInvoice"></el-input>
    </el-form-item>
  	<el-form-item label="开票电话">
      <el-input v-model="ruleForm.phoneOnInvoice"></el-input>
    </el-form-item>
    
    <!--<div class="h50 headerBox1" style="border-top: 1px solid #E4E4E4;"><i class="icon iconfont icon-jinqi"></i><span>供应商收货信息</span></div>
  	<el-form-item label="收货人姓名：" prop="receiver">
      <el-input v-model="ruleForm.receiver" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="收货人电话：" prop="receiverPhone">
      <el-input v-model="ruleForm.receiverPhone" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="收货地址：" required>
      <el-col style="width: 200px;margin-right: 10px;">
	    	<el-form-item prop="receiverProvinceId">
	         <el-select v-model="ruleForm.receiverProvinceId" filterable  placeholder="省" style="width: 100%;" @change="p1change">
			      <el-option 
			      	v-for="o in p1"
			      	:key="o.id"
			      	:label="o.name" 
			      	:value="o.id">	      	
			      </el-option>	      
			    </el-select>
	      </el-form-item>
    	</el-col>
    	<el-col style="width: 200px;margin-right: 10px;">
	    	<el-form-item prop="receiverCityId">
	        <el-select v-model="ruleForm.receiverCityId" filterable placeholder="市" style="width: 100%;" @change="p2change">
			      <el-option 
			      	v-for="o in p2"
			      	:key="o.id"
			      	:label="o.name" 
			      	:value="o.id">	      	
			      </el-option>
			    </el-select>
	      </el-form-item>
    	</el-col>
    	<el-col style="width: 200px;margin-right: 10px;">
	    	<el-form-item prop="receiverCountyId">
	        <el-select v-model="ruleForm.receiverCountyId" filterable placeholder="县/区" style="width: 100%;">
			      <el-option 
			      	v-for="o in p3"
			      	:key="o.id"
			      	:label="o.name" 
			      	:value="o.id">	      	
			      </el-option>
			    </el-select>
	      </el-form-item>
    	</el-col>
    </el-form-item> 
    <el-form-item label="收货详细地址：" prop="receiverAddressLine">
      <el-input type="textarea" :rows="5" v-model="ruleForm.receiverAddressLine" placeholder="输入姓名，字数1~15以内"></el-input>
    </el-form-item>-->
  	
    <el-form-item style="margin-top: 20px">
      <el-button type="primary" @click="submitForm('ruleForm')" v-if="$authorities.SupplierBasicCreateRelevant">保存至草稿</el-button>
      <el-button type="primary" @click="resetForm('ruleForm')" v-if="$authorities.SupplierBasicCreateRelevant">保存并提交审核</el-button>
      <!--<el-button type="primary" @click="resetForm('ruleForm')">清空</el-button>-->
    </el-form-item>
  
</div>
</el-form>
</template>

<script>import './SupplierList.less'
import { provinces_based_id,getTreeAll,category,subs,submitDraft,createSubmitReviewSupplier,nameRepeatedCheck} from "@/api/basicSupplier"
import { simpleList} from "@/api/userService"

export default {
			name:'AddSupplier',
			 inject:['close'],
	data() {
		var supplierNameRule= (rule, value, callback) => {
			
        if (value == '') {
          callback(new Error('公司名称不能为空'));
        }else if(/\\+|\~+|\!+|\@+|\#+|¥+|\￥+|\%+|\^+|\&+|\*+|\(+|\)+|\'+|(\")+|\$+|`+|\“+|\”+|\‘+|\’+|\s+|\.+|\,+|\。+|\'+|\"+|\、+|\|+|\……+/g.test(value)){
        	callback(new Error('公司名称不能含有特殊字符'));
        }else{
        		nameRepeatedCheck({name:value,id:0}).then(res=>{
		        	if(res.data){
		        		callback();
		        	}else{
		        		
		        	}
		        }).catch(rej=>{
		        	callback(new Error('供应商公司名称已存在'))
		        })
        }
        
        
      };
//  var socialCreditCodeRule=(rule, value, callback) => {
//      if (value == '') {
//        callback(new Error('请输入统一信用代码'));
//      }else{
//      	 this.$refs.ruleForm.validateField('name');
//      	 callback()
//      }
//      
//      
//    };  
    var socialCreditCodeRule=(rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入统一信用代码'));
        }else{
        	 callback()
        }
      };
      
      var idcarRule=(rule, value, callback) => {
        if (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
          callback()
        }else{
        	 
        	 
        	 callback(new Error('身份证格式不正确'));
        }
        
        
      };
		return {
			citys:[],
			//省市县
			o1:[],
			o2:[],
			o3:[],
			p1:[],
			p2:[],
			p3:[],
			headertoken:{'Authorization':'Bearer '+this.$auth.token},
			options: [],
			cascaderData:[],
			cascaderProps:{
				value:'id',
				label:'name',
				
			},
			options1: [{
				value: 'GRADE1',
				label: '1级'
			}, {
				value: 'GRADE2',
				label: '2级'
			}, {
				value: 'GRADE3',
				label: '3级'
			}, {
				value: 'GRADE4',
				label: '4级'
			}, {
				value: 'GRADE5',
				label: '5级'
			}],
			value1: '',
			fileList3: [],
			ruleForm: {
				"type":'',
				"userDataAuthorityId":'',//管理员id
				"accountName": "", //开户名
				"accountNo": "", //开户账号
				"addressLine": "", //细地址
				"addressOnInvoice": "", //开票地址
				"bank": "", //开户行
				"businessScope": "", //经营范围
				"categoryBrandIds": [ //分类品牌ID集合
//					{
//						"brandIds": [ //品牌ID集合
//							0
//						],
//						"categoryId": '' //分类ID
//					},
				
				],
				"classify":'',
				"classify2":[],
				"certificateFileId": [], //资质文件id（多个用英文逗号分隔）
				"cityId": "", //市
				"countyId": "", //县
				"invoiceTitle": "", //发票抬头
				"legalPersonIdCard": "", //法人身份证号
				"legalPersonName": "", //法人姓名
				"name": "", //公司名称
				"phoneOnInvoice": "", //开票电话
				"provinceId": "", //省
				"regionIds": [ //区域ID集合

				],
				"shortName": "", //公司简称
				"socialCreditCode": "", //统一社会信用代码
				"supplierGradeLevel": "", //供应商等级
				"supplierTaxLevel": "TAX_LEVEL0",
				"isbrandids":"",
				"receiver":"",
				"receiverAddressLine":"",
				"receiverProvinceId":"",
				"receiverCityId":"",
				"receiverCountyId":"",
				"receiverPhone":"",
			},
			realName:'',
			options4:[],
			checkAll: false,
			isIndeterminate: false,
			cities: [],
			imageUrl: '',
			textarea: '',
			textarea2: '',
			data2: [],
			defaultProps: {
				children: 'subCategory',
				label: 'name'
			},
			rules: {
				type:[
          	{ required: true, message: '供应商类型不能为空', trigger: 'change' },
          ],
				name: [{
					required: true,
					validator: supplierNameRule,
					trigger: 'blur'
				}, ],
				supplierGradeLevel: [{
					required: true,
					message: '请选择供应商等级',
					trigger: 'change'
				}, ],

				legalPersonName: [{
					required: true,
					message: '法人姓名不能为空',
					trigger: 'blur'
				}, ],

				legalPersonIdCard: [{
					required: true,
					validator: idcarRule,
					trigger: 'blur'
				}, ],
				userDataAuthorityId:[
					{
					required: true,
					message: '请输入管理员账号',
					trigger: 'blur'
				},
				],
				socialCreditCode: [{
					required: true,
					validator: socialCreditCodeRule,
					trigger: 'blur'
				}, ],
				businessScope: [{
					required: true,
					message: '经营范围不能为空',
					trigger: 'blur'
				}, ],
				regionIds: [{
					type: 'array',
					required: true,
					message: '经营区域不能为空',
					trigger: 'change'
				}, ],
				supplierTaxLevel: [{
					required: true,
					message: '请选择纳税级别',
					trigger: 'blur'
				}, ],
				bank: [{
					required: true,
					message: '开户行不能为空',
					trigger: 'blur'
				}, ],
				accountName: [{
					required: true,
					message: '开户名称不能为空',
					trigger: 'blur'
				}, ],
				accountNo: [{
					required: true,
					message: '开户账号格式错误',
					trigger: 'blur'
				}, ],
				addressOnInvoice: [{
					required: true,
					message: '开票地址不能为空',
					trigger: 'blur'
				}, ],
				phoneOnInvoice: [{
					required: true,
					message: '开票电话信息不能为空',
					trigger: 'blur'
				}, ],
				region: [{
					required: false,
					message: '',
					trigger: 'blur'
				}],
				date1: [{
						required: true,
						message: '注册号/申请号不能为空',
						trigger: 'blur'
					},

				],
				date2: [{
					required: true,
					message: '商标申请人不能为空',
					trigger: 'blur'
				}],
				delivery: [{
					delivery: 'array',
					required: true,
					message: '请至少选择一个活动性质',
					trigger: 'change'
				}],
				resource: [{
					required: true,
					message: '请选择活动资源',
					trigger: 'change'
				}],
				desc: [{
					required: true,
					message: '请输入内容',
					trigger: 'blur'
				}],
				classify: [{
					required: true,
					message: '经营分类不能空',
					trigger: 'blur'
				}],
				classify2: [{
					required: true,
					message: '经营品牌不能空',
					trigger: 'blur'
				}],
				isbrandids:[{
					required: true,
					message: '经营品牌不能空',
					trigger: 'blur'
				}],
				receiver:[{
					required: true,
					message: '请输入收货人姓名',
					trigger: 'blur'
				}],
				receiverAddressLine:[{
					required: true,
					message: '请输入收货人地址',
					trigger: 'blur'
				}],
				provinceId:[{
					required: true,
					message: '请选择省',
					trigger: 'change'
				}],
				cityId:[{
					required: true,
					message: '请选择市',
					trigger: 'change'
				}],
				countyId:[{
					required: true,
					message: '请选择区/县',
					trigger: 'change'
				}],
				receiverPhone:[{
					required: true,
					message: '请输入收货人电话',
					trigger: 'blur'
				}],
			},
			seesId:'',
			provinceIdName:'',	
			cityIdName:'',
			countyIdName:''
		};
	},
	watch: {
		defaultProps(a, b) {
			console.log(a)
		},
		fileList3(a){
			this.ruleForm.certificateFileId=a.map(item=>item.response?item.response.data.id:'')
		},
//		'ruleForm.classify2':{
//			handler:function(a,b){
//				console.log(a)
//			},
//			deep:true
//		},
		'ruleForm.regionIds':{
			handler:function(a,b){
				console.log(a)
			},
			deep:true
		},
		
		'ruleForm.provinceId':{
			handler:function(a,b){
				let nameArr=this.o1.filter(item=>item.id==a)
				this.provinceIdName=nameArr[0]?nameArr[0].name:''
				this.concatString()
			},
			deep:true
		},
		'ruleForm.cityId':{
			handler:function(a,b){
				let nameArr=this.o2.filter(item=>item.id==a)
				this.cityIdName=nameArr[0]?nameArr[0].name:''
				this.concatString()
			},
			deep:true
		},
		'ruleForm.countyId':{
			handler:function(a,b){
				let nameArr=this.o3.filter(item=>item.id==a)
				this.countyIdName=nameArr[0]?nameArr[0].name:''
				this.concatString()
			},
			deep:true
		},
		'ruleForm.addressLine':{
			handler:function(a,b){
				this.concatString()
			},
			deep:true
		},
		'ruleForm.categoryBrandIds':{
			handler:function(a,b){
				let ass=[]
				this.ruleForm.categoryBrandIds.map((item,index)=>{
					ass.push(...item.brandIds) 
				})
				this.ruleForm.isbrandids=ass.join('')
			},
			deep:true
		}
	},
	computed:{
		delist(){
			let a=[]
			this.ruleForm.categoryBrandIds.map((item,index)=>{
				a.push(...item.brandIds) 
			})
			return a
		},
		positions(){
    		let a=''
    		console.log(11111)
    		this.ruleForm.addressOnInvoice=this.ruleForm.addressLine
    		return a
    }
	},
	created() {
		provinces_based_id().then(res => {
			this.o1=res.data
			this.p1=res.data
			this.cities = res.data
		})
		this.isgetTreeAll()
	},
	mounted() {
//		console.log(this.ruleForm.categoryBrandIds[0].categoryId)
//			window.onbeforeunload=function(e){     
//　　var e = window.event||e;  
//　　e.returnValue=("确定离开当前页面吗？");
//		}
	},
	methods: {
		concatString(){
				let name1=this.provinceIdName?this.provinceIdName+'-':''
				let name2=this.cityIdName?this.cityIdName+'-':''
				let name3=this.countyIdName?this.countyIdName+'-':''
				this.ruleForm.addressOnInvoice=name1+name2+name3+this.ruleForm.addressLine
		},
		deleteBrand(a,b,c){
//			this.ruleForm.categoryBrandIds[a].brandDTO.splice(b,1)
//			this.ruleForm.categoryBrandIds[a].brandIds.splice(b,1)
//			let index=this.ruleForm.classify2.indexOf(c)
//			if(index>-1){
//				this.ruleForm.classify2.splice(index,1)
//			}
			var brandDTOIndex=null
			var brandIdsIndex=null
			let newarr=JSON.parse(JSON.stringify(this.ruleForm.categoryBrandIds[a]))
			newarr.brandDTO.map((item,index)=>{
				if(item.id==c){
					 brandDTOIndex=index
				}
			})
			newarr.brandIds.map((item,index)=>{
				if(item==c){
					 brandIdsIndex=index
				}
			})
			let classify2= JSON.parse(JSON.stringify(this.ruleForm.classify2))
			let index=classify2.indexOf(c)
			if(index>-1){
				classify2.splice(index,1)
			}
			this.ruleForm.classify2=classify2
			newarr.brandDTO.splice(brandDTOIndex,1)
			newarr.brandIds.splice(brandIdsIndex,1)
			this.ruleForm.categoryBrandIds[a]=newarr
		},
		goaddbrand(){
			 this.$router.push({
          name: 'AddBrand',
        })
		},
		adminchange(value){
			console.log(value)
			let a=this.options4.filter(item=>item.id==value)
			this.realName=a[0].realName
		},
		//模糊搜索
		remoteMethod(query) {
        if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
		o1change(data){
				this.ruleForm.cityId=''
				this.ruleForm.countyId=''
			subs(data).then(res=>{
				this.o2=res.data
			})
		},
		o2change(data){
			this.ruleForm.countyId=''
			subs(data).then(res=>{
				this.o3=res.data
			})
		},
		o3change(data){
			
		},
		p1change(data){
				this.ruleForm.receiverCityId=''
				this.ruleForm.receiverCountyId=''
			subs(data).then(res=>{
				this.p2=res.data
			})
		},
		p2change(data){
			this.ruleForm.receiverCountyId=''
			subs(data).then(res=>{
				this.p3=res.data
			})
		},
		PPchange(val){
			console.log(val)
			let value=this.citys.filter(res=>val.includes(res.id))
			let categoryIdarrs=this.ruleForm.categoryBrandIds.map(res=>res.categoryId)
			if(categoryIdarrs.includes(this.seesId)){
				this.valuebchange(value)
			}		
//			if(value===true){
////				brandIds
//			this.ruleForm.categoryBrandIds=this.ruleForm.categoryBrandIds.map((item,index)=>{
//				if(item.categoryId==this.seesId){
//					item.brandIds.push(this.ctiys[0].id)
//					item.brandDTO.push(this.ctiys[0])
//					return item
//				}else{
//					return item
//				}
//			})
//				console.log(this.ruleForm.categoryBrandIds)
//			}else{
//				let b=value.map(item=>item.id)
//				this.ruleForm.categoryBrandIds=this.ruleForm.categoryBrandIds.map((item,index)=>{
//				if(item.categoryId==this.seesId){
//					item.brandIds=b
//					item.brandDTO=value
//					return item
//				}else{
//					return item
//				}
//			})
//			}
			console.log(this.ruleForm.categoryBrandIds,'11')
			
			
		},
		valuebchange(value){
				if(value===true){
//				brandIds
			this.ruleForm.categoryBrandIds=this.ruleForm.categoryBrandIds.map((item,index)=>{
				if(item.categoryId==this.seesId){
					item.brandIds.push(this.ctiys[0].id)
					item.brandDTO.push(this.ctiys[0])
					return item
				}else{
					return item
				}
			})
				console.log(this.ruleForm.categoryBrandIds)
			}else{
				let b=value.map(item=>item.id)
				this.ruleForm.categoryBrandIds=this.ruleForm.categoryBrandIds.map((item,index)=>{
				if(item.categoryId==this.seesId){
					item.brandIds=b
					item.brandDTO=value
					return item
				}else{
					return item
				}
			})
			}
		},
		cascadechange(data){
			console.log(data)
			this.citys=[],
			this.ruleForm.classify2=[]
			this.seesId=data[data.length-1]
			//获取对应品牌多选框
			category(data[data.length-1]).then(res=>{
				this.citys=res.data
				let IDarr=this.ruleForm.categoryBrandIds.filter(res=>res.categoryId==data[data.length-1])
				if(IDarr[0]){
					this.ruleForm.classify2=IDarr[0].brandIds
				}
			})
		},
//		获取全部树结构
		isgetTreeAll(){
			getTreeAll().then(res=>{
				console.log(res.data);
				this.data2=res.data
				this.$nextTick().then(()=>{
					this.getnode()
				})
			})
		},
		handleCheckAllChange(val) {
			this.ruleForm.regionIds = val ? this.cities.map(item => item.id) : [];
			this.isIndeterminate = false;
		},
		handleCheckedCitiesChange(value) {
			console.log(value)
			let checkedCount = value.length;
			this.checkAll = checkedCount === this.cities.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
		},
//		获取选中得node 和 key
		getnode(data) {
			let yeziId = this.$refs.tree.getCheckedKeys(true)
			let yezuItem= this.$refs.tree.getCheckedNodes(true)
			let idArr = this.$refs.tree.getCheckedKeys()
//			this.ruleForm.categoryBrandIds=yeziId.map((item,index)=>{
//				return {"categoryId":item,"brandIds":[],'brandDTO':[]}
//			})
			var categoryBrandIds=this.ruleForm.categoryBrandIds.filter(item=>{
				if(yeziId.includes(item.categoryId)){
					return item
				}
			})
			let categoryIds=categoryBrandIds.map(item=>item.categoryId)
			yezuItem.map(item=>{
				if(!categoryIds.includes(item.id)){
					categoryBrandIds.push(
						{"categoryId":item.id,"categoryName":item.name,"brandIds":[],'brandDTO':[]}
					)
				}
			})
			this.ruleForm.categoryBrandIds=categoryBrandIds
			this.ruleForm.classify=JSON.stringify(yeziId).replace('[',"").replace(']',"");
			
			let i = this.$refs.tree.getCheckedNodes(false,true)
			
			
			this.combinationTree(i)
			this.$refs.tree2.filter(idArr);
		},
		combinationTree(arr){
			let newarr=arr.map(item=>{
				return {id:item.id,parentId:item.parentId,name:item.name,}
			})
			this.options=this.translateDataToTree(newarr)
			console.log(this.options)
		},
		translateDataToTree(data) {
		  let parents = data.filter(value => value.parentId == 'undefined' || value.parentId == 0)
		  let children = data.filter(value => value.parentId !== 'undefined' && value.parentId != 0)
		  let translator = (parents, children) => {
		    parents.forEach((parent) => {
		      children.forEach((current, index) => {
		        if (current.parentId === parent.id) {
		          let temp = JSON.parse(JSON.stringify(children))
		          temp.splice(index, 1)
		          translator([current], temp)
		          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
		        }
		      }
		      )
		    }
		    )
		  }
		 
		  translator(parents, children)
		 
		  return parents
		},
		filterNode(value, data) {
			if(!value) return true;
			return value.includes(data.id);
		},
		removefilelist(file, fileList){
			this.fileList3 = fileList
		},
		handleChange(file, fileList) {
			
		},
		submitForm(formName) {
			console.log(this.ruleForm)
				       
			this.$refs[formName].validate((valid,obj) => {
				if(valid) {
					submitDraft(this.ruleForm).then(res=>{
            	if(res.data>0){
            		this.$message({
				          message: '操作成功，前页面信息已保存至草稿',
				          type: 'success'
				        });
							 
				        this.$refs[formName].resetFields();
				        this.close({
				        		name:'AddSupplier',
				        		to:{
				        			name:'SupplierList',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
            	}
            })
				} else {
					console.log(obj);
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
			createSubmitReviewSupplier(this.ruleForm).then(res=>{
            	if(res.data>0){
            		this.$message({
				          message: '保存并提交审核成功',
				          type: 'success'
				        });
				        this.$refs[formName].resetFields();
				        this.close({
				        		name:'AddSupplier',
				        		to:{
				        			name:'SupplierList',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
				        
            	}
            })
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},

		handleAvatarSuccess(res, file,fileList) {
			
			if(res.code == '000000') {
					this.imageUrl = URL.createObjectURL(file.raw);
//					console.log(this.imageUrl)
//					this.fileList3.push(res.data)
//					console.log(this.fileList3)

					this.$message({
						message: '图片上传成功',
						type: 'success'
					});
				this.fileList3 = fileList
				} else {
					this.$message.error('图片上传失败');
				}
		},		
		beforeAvatarUpload(file) {
				const aJPG = file.name.split(".")
				const aPNG = file.name.split(".")
				const aPDF = file.name.split(".")
				const isJPG = aJPG[aJPG.length-1] === "jpg";
				const isPNG = aPNG[aPNG.length-1] === "png";
				const isPDF = aPDF[aPDF.length-1] === "pdf";
				const isLt2M = file.size / 1024 / 1024 < 2;
				if(!isLt2M){
					this.$message({
						message: '上传图片大小不得超过2M',
						type: 'error'
					})
					return false
				}
				if(!(isJPG || isPNG || isPDF )) {
					this.$message({
						message: '上传图片只能是 JPG PNG PDF格式!且不超过2M',
						type: 'error'
					})
					return false;
				}
				return (isJPG ||isPNG ||isPDF )&&isLt2M
			},
	}
}</script>

<style lang="less" scoped>
.el-form{
    
     color: #606266;
.editerbusinessBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .headerBox1{
  	margin-bottom: 10px;
    height: 50px;
    background: #f3f3f3;
    border-bottom: 1px solid #e4e4e4;
 		i{
 			font-size: 20px;
			padding: 0 5px 0 10px;
			font-weight: 600;
			line-height: 50px;
 		}
    span{
    	font-size: 15px;
    	font-weight: 600;
      line-height: 50px;
    }
 
  }
  
   .el-form-item{
     .el-input{
       max-width: 730px;
       height: 40px;
     }
     .el-textarea{
     	width: 730px;
     }
    .tipBox{
      height: 20px;
      font-size: 12px;
      margin-left: 20px;
    }
    .el-form-item_err{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
    .listBox{
      /*width: 600px;*/
      box-sizing: border-box;
      .listLeftBox{
      	position: relative;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 300px;
        height:350px;
       .headerBox{
       	background-color: #F5F5F5;
       	position: absolute;
       	width: 100%;
       	z-index: 5;
         height: 35px;
         border-bottom: 1px solid #e4e4e4;
         span{
          color: red;
            height: 36px;
            line-height: 36px;
         }
       }
       .lltree{
       	box-sizing: border-box;
       	padding-top: 35px;
       	width: 100%;
				height: 100%;
       	overflow: auto;
       }
      }
      .listRightBox{
      	position: relative;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 300px;
        height:350px;
        .headerBox{
         background: #F5F5F5;
       	position: absolute;
       	width: 100%;
       	z-index: 5;
         height: 35px;
         border-bottom: 1px solid #e4e4e4;
         span{
          color: red;
            height: 36px;
            line-height: 36px;
         }
        }
        .lltree{
       	box-sizing: border-box;
       	padding-top: 35px;
       	width: 100%;
				height: 100%;
       	overflow: auto;
       }

      }
    }
  
}
}
</style>
