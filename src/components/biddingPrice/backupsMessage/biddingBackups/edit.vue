<template>
	<el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">
<div class="saleDown">
  <addhead headname="基本信息" style="margin-bottom: 10px;"></addhead>
  	<div class="row_chunk">
  		<div class="chunk" >
  			<span><i class="requeryStar">*</i>项目：</span>
        <el-form-item prop="projectId">
         <el-select
				    v-model="form.projectId"
				    filterable
				    remote
				    clearable
				    reserve-keyword
				    disabled
				    placeholder="请输入"
				    :remote-method="remoteMethod1"
				    @change="userNamechange"
				    >
				    <el-option
				      v-for="item in options3"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
      	</el-form-item>
  		</div>
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>客户：</span>
	      <el-form-item prop="customerNameCustomize" >
					  <el-autocomplete
			      class="inline-input"
			      style="width: 100%;max-width: 250px;"
			      v-model="form.customerNameCustomize"
			      :fetch-suggestions="querySearch"
			      :trigger-on-focus='false'
			      value-key="name"
			      :hide-loading='true'
			      placeholder="请输入内容"
			      @select="handleSelect"
			    ></el-autocomplete>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>采购人：</span>
        <el-form-item  prop="purchaserName">
	        <el-input v-model="form.purchaserName" ></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>采购人联系方式：</span>
        <el-form-item prop="purchaserPhone">
	        <el-input v-model="form.purchaserPhone" ></el-input>
	      </el-form-item>
  		</div>
  	</div>
  	
  	<!--DDDDDDDDDDDDD-->
		<div class="row_chunk">
  		<div class="chunk">
  			<span>收货人：</span>
        <el-form-item >
	        
			     <el-input v-model="form.recipientName" ></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span>收货人联系方式：</span>
	      <el-form-item  >
	        <el-input v-model="form.recipientPhone" ></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk" style="width: 50%;">
  			<span style="flex: 0 0 15%;"><i class="requeryStar">*</i>收货地址：</span>
	        <!--<el-input v-model="receiptAddressText" type="hidden"  ref="recAddress"  @focus="showDialog('setAddress',receiptAddress)" style="width: 0px;height: 0px;"></el-input>-->
	        <div id="" @click="showDialog('setAddress',receiptAddress)" 
	        	style="cursor: pointer; width: 85%;border: 1px solid #dcdfe6;height: 40px;border-radius: 4px;box-sizing: border-box;overflow: hidden; text-overflow:ellipsis;white-space:nowrap">
	        	<span style="text-align: left;line-height: 40px;">&nbsp;&nbsp;&nbsp;{{receiptAddressText}}</span>
	        	<el-input v-model="receiptAddressText" type="hidden"  ref="recAddress" style="width: 0px;height: 0px;"></el-input>
	        </div>
  		</div>
  	</div>
<!--33333333333333333333333-->
    <div class="row_chunk">
  		<div class="chunk" >
  			<span><i class="requeryStar">*</i>外部竞价编号：</span>
        <el-form-item prop="exteriorNo">
	        <el-input v-model="form.exteriorNo" disabled></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>报价：</span>
	      <el-form-item prop="priceQuote">
	        <el-input v-model="form.priceQuote"></el-input>
	      </el-form-item>
  		</div>
  		<div class="chunk">
  			<span><i class="requeryStar">*</i>服务方：</span>
        <el-form-item prop="serverId">
	        <el-select
					    v-model="form.serverId"
					    filterable
					    remote
					    clearable
					    reserve-keyword
					    placeholder="请输入"
					    :remote-method="remoteMethod2"
					    :disabled="partyBId!=$auth.user.userPosts[0].organizationId"
					    >
					    <el-option
					      v-for="item in options1"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
	      </el-form-item>
  		</div>
  	</div>
   <!--44444444444-->
   	<div class="row_chunk">
  		<div class="chunk" style="width: 100%;align-items: flex-start;">
  			<span style="flex: 0 0 7.5%;" >报价备注：</span>
        <el-form-item style="flex: 1;">
	        <el-input v-model="form.memo" type="textarea" :rows="5" style="max-width: 100%;" placeholder="字数长度1~50"></el-input>
	      </el-form-item>
  		</div>
  	</div>
    <addhead headname="商品信息"> <template slot="append"><el-button ref="addRow" size="mini" icon="el-icon-plus" style="margin-left: 50px;" @click="addTableRow()">添加</el-button></template> </addhead>
    <el-table
          :data="form.skuItemParams"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            label="操作"
            min-width="40"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" @click="deleteRow(scope)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="条目号"
            min-width="50"
            align="center">
             <template slot-scope="scope">
            		<span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            min-width="200"
            align="center">
            <template slot="header" slot-scope="scope">
        			<span><i style="color: red;">*</i>商品名称</span>
      			</template>
            <template slot-scope="scope">
            	<el-form-item label-width="0px" 
            		:prop="'skuItemParams.'+scope.$index+'.skuName'"
				      	:rules="{
				            required: true, message: '', trigger: 'blur'
				            }">
				       <el-input v-model="scope.row.skuName" @keyup.enter.native="addTableRow()" placeholder="字数长度1~50"></el-input>
				      </el-form-item>
				      
            </template>
          </el-table-column>
          <el-table-column
            label="分类"
            align="center">
            <template slot-scope="scope">
            	<el-input v-model="scope.row.category"  placeholder="字数长度1~50"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="品牌"
            align="center">
            <template slot-scope="scope">
            	<el-input v-model="scope.row.brand"  placeholder="字数长度1~50"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="规格型号"
            align="center">
            <template slot-scope="scope">
            	<el-input v-model="scope.row.specification"  placeholder="字数长度1~50"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="单位"
            align="center">
            <template slot-scope="scope">
            	<el-input v-model="scope.row.unit"  placeholder="字数长度1~50"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center">
            <template slot="header" slot-scope="scope">
        			<span><i style="color: red;">*</i>数量</span>
      			</template>
            <template slot-scope="scope">
            	<el-form-item label-width="0px" 
            		:prop="'skuItemParams.'+scope.$index+'.qty'"
				      	:rules="{
				            required: true, message: '', trigger: 'blur'
				            }">
				       <el-input v-model="scope.row.qty"  placeholder="字数长度1~50" type="number"></el-input>
				      </el-form-item>
            	
            </template>
            
          </el-table-column>
          <el-table-column
            label="单价"
            align="center">
            <template slot-scope="scope">
            	<el-input v-model="scope.row.price"  placeholder="字数长度1~50" type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center">
            <template slot-scope="scope">
            	<el-input v-model="scope.row.memo"  placeholder="字数长度1~50"></el-input>
            </template>
          </el-table-column>
       </el-table>
  	<div class="" style="text-align: center;padding: 20px 0px;">
  		 <el-button type="primary" @click="submitForm('form')" style="margin-left: 120px;">保 存</el-button>
    <el-button type="primary" @click="closed()" >取 消</el-button>
  	</div>
	<!--<el-dialog
		  title="提示"
		  :visible.sync="isZeroTips"
		  width="30%"
		  >
		  <span>订单中包含0元商品，请确定是否要保存订单</span>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="isZeroTips=false">取 消</el-button>
		    <el-button type="primary" @click="submitFromApi()">确 定</el-button>
		  </span>
		</el-dialog>-->
	<setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
</div>
</el-form>
</template>

<script>
  import addhead from '@/components/common/head/head'
  import {
		nameList,
		projectDetail
	} from '@/api/projectController/projectController'
	import {
		customerNameList,
	} from '@/api/order/saleDown'
	import {
		organizationListName
	} from '@/api/payment/customerPayment'
		import {
			createBidding,
			getidInfo,
			editHold
	} from '@/api/biddingPrice/biddingPrice'
	import './index.less'
  import setAddress from "@/components/order/child/set_address";
  import {
		nameRepeatedCheck,
		addProjrct,
	} from '@/api/projectController/projectController'
	import {returnFloat,returnFloatFour} from '@/utils/index'
  export default {
	  inject:['close'],
	  name:'biddingBackupsEdit',
    data() {
    	var projectNameRule= (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入项目名称'));
        }
        nameRepeatedCheck({name:value}).then(res=>{
        	if(res.data){
        		callback(new Error('项目名称已存在'));
        	}else{
        		callback()
        	}
        })
        
      };
    	
      return {
      	pickerOptions:{
      		disabledDate(time){
      			return time.getTime() < Date.now() - 8.64e7;
      		}
      	},
      	isZeroTips:false,
      	receiptAddressText:"",
      	receiptAddress:null,//收货地址
      	remarkRowIndex:'',
      	goodsText:'',
      	remarkText:'',
      	dialogFormVisible:false,
      	tableIsRow:0,
      	customerUserPhone:'',
      	staffName:'',
      	dialogVisiblelock:false,
      	value1:'0',
      	options1: [],
      	partyBId:'',
        form:{
        	skuItemParams:[{
        		biddingPreparedId:'',//隐藏id
        		brand:'',//
        		category:'',//
        		memo:'',//
        		price:'',//
        		qty:'',//
        		skuName:'',//
        		specification:'',
        		unit:'',//单位
        	}],
        	customerNameCustomize:'',
        	customerId:'',//客户id
          serverId:'',//服务放id
          projectId:'',//项目id
          provinceId:'',//省id
          cityId:'',//市id
          countyId:'',//县id
          addressLine:'',//收货详细地址
          recipientName:'',//收货人姓名
          recipientPhone:'',//收货人手机号
          exteriorNo:'',//外部订单号
          priceQuote:'',
          memo:'',
          purchaserName:'',
          purchaserPhone:'',
        },
        options4:[],
        options3:[],
        customerOptions:[],
        purchaseOptions:[],
        rules:{
          serverId: [
            { required: true,message: '请选择服务方', trigger: 'change'},
          ],
          projectId: [
            { required: true,message: '请选择项目', trigger: 'change'},
          ],
          customerNameCustomize: [
            { required: true,message: '请填写客户', trigger: 'blur'},	
            { required: true,message: '请填写客户', trigger: 'change'},	
          ],
          purchaserName: [
            { required: true,message: '采购人不能为空', trigger: 'blur'},	
          ],
          exteriorNo: [
            { required: true,message: '外部竞价编号为空', trigger: 'blur'},	
          ],
          priceQuote: [
            { required: true,message: '报价不能为空', trigger: 'blur'},	
          ],
          purchaserPhone: [
            { required: true,message: '采购人联系方式不能为空', trigger: 'blur'},	
          ],
          recipientName: [
            { required: true,message: '请输入收货人姓名', trigger: 'blur'},	
          ],
          recipientPhone:[
          	{ required: true,message: '请输入收货人联系方式', trigger: 'blur'},	
          ],
         
          
        },
        deleteIndex:null,
        loading:false,
		restaurants:[],
		editId:null
      };
    },
    components:{
      addhead,
      setAddress
    },
    created(){
//  	this.options1=[{name:this.$auth.user.userPosts[0].organizationName,id:this.$auth.user.userPosts[0].organizationId}]
//  	this.form.serverId=this.$auth.user.userPosts[0].organizationId
    	// this.getEditDetail()
    },
    filter:{
    	linlai(value){
    		if(value==''){
    			return 0
    		}
    	}
    },
     mounted() {
	},
	activated(){
		if(this.editId!=this.$route.query.editId){
			this.getEditDetail()
		}
	},
    watch:{
    	
    },
    computed:{
    },
    methods: {
    	closed(){
    		this.close();
    	},
      getEditDetail(){
		this.editId=this.$route.query.editId;
      	let a=JSON.parse(JSON.stringify(this.form))
      	getidInfo(this.editId).then(res=>{
    		console.log(res)
    			Object.keys(a).forEach(key=>{
    				this.form[key]=res.data[key]
    			})
    			console.log(this.form)
    			this.options3=[{
    				name:res.data.projectName,
    				id:res.data.projectId
    			}]
    			this.options1=[{
    				name:res.data.serverName,
    				id:res.data.serverId,
    			}]
    			this.receiptAddressText=res.data.detailAddressLine
    			this.receiptAddress = {
	          province:{id:res.data.provinceId},
	          city:{id:res.data.cityId},
	          county:{id:res.data.countyId},
	          address:res.data.addressLine,
	          receiptAddress:res.data.customerReceiptAddress
        	};
    		})
      },
    	showDialog(type, row) {
    		this.$refs.recAddress.blur()
	      this.$refs[type].init(row);
	    },
	    remoteMethod2(query) {
        if (query !== '') {
          organizationListName({name:query}).then(res=>{
          	this.options1=res.data
          })
        } else {
          this.options1 = [];
        }
      },
    	dialogCallback(res) {
    		console.log(res)
       this.form.addressLine=res.address
       this.form.provinceId=res.province.id
       this.form.cityId=res.city.id
       this.form.countyId=res.county.id
       this.receiptAddressText=res.receiptAddress
       this.receiptAddress = {
	          province:{id:this.form.provinceId},
	          city:{id:this.form.cityId},
	          county:{id:this.form.countyId},
	          address:this.form.addressLine,
	          receiptAddress:this.receiptAddressText
        	};
    	},
    	deleteRow(index){
    		this.deleteIndex=index.$index
    		this.isDelete()
    	},
    	isDelete(){
    		if(this.form.skuItemParams.length>1){
    			this.form.skuItemParams.splice(this.deleteIndex,1)
    		}else{
    			this.$message({
		        message:'仅剩一条，不可删除',
		        type: 'error', 
		      })
    		}
    	},
    	addTableRow(){
    		let a=this.form.skuItemParams.every(item=>item.skuName&&item.qty)
    		if(a){
    			this.tablePush()
    		}else{
    			this.$message({
		        message:'商品清单中有空条目，不可添加新条目',
		        type: 'error', 
		      })
    		}
    	},
    	tablePush(){
    		let a={
	    			biddingPreparedId:'',//隐藏id
        		brand:'',//
        		category:'',//
        		memo:'',//
        		price:'',//
        		qty:'',//
        		skuName:'',//
        		specification:'',
        		unit:'',//单位
	        	}
	    			this.form.skuItemParams.push(a)
    	},
    	querySearch(queryString, cb) {
    		if(this.form.projectId){
    			this.form.customerId=''
        	customerNameList({customerName:queryString,projectId:this.form.projectId}).then(res=>{
        			this.customerOptions=res.data
	          	var customerOptions=res.data
	          	cb(customerOptions);
	          })
    		}
      },
      clearPurchaseContent(){
      	this.form.recipientName=''
        this.form.recipientPhone=''
        this.receiptAddress = {
            province:'',
            city:'',
            county:'',
            address:'',
            receiptAddress:''
          };
	      this.form.addressLine=''
	      this.form.provinceId=''
	      this.form.cityId=''
	      this.form.countyId=''
	      this.receiptAddressText=''
      },
      handleSelect(item) {
      	this.form.customerId=item.id
      },
    	userNamechange(value){
    			projectDetail(value).then(res=>{
    				this.partyBId=res.data.partyBId
    			})
    			this.form.customerId=''
    			this.customerOptions=[]
    	},
      remoteMethod1(query){
      	 if (query !== '') {
          nameList({name:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
      },
      submitForm(formName) {
      	this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	if(this.receiptAddressText){
		          		this.form.skuItemParams=this.form.skuItemParams.map(item=>{
		          			item.price=parseFloat(item.price)
		          			item.qty=parseFloat(item.qty)
		          			return item
		          		})
		          		editHold(this.$route.query.editId,this.form).then(res=>{
		          			this.$message({
						        message:'保存成功',
						        type: 'success', 
						      })
		          			this.close({name:'biddingBackupsEdit', to: {name:'biddingBackupsList', params:{isUpdate:true}}});
		          		})
		          	}else{
		          		this.$message({
						        message:'请选择收货地址',
						        type: 'warning', 
						      })
		          	}
		           
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
      },
       resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      
    }
  }
</script>

<style lang="less" scoped>

.el-form{
     color: #606266;
     
.saleDown{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .row_chunk{
	  	margin-bottom: 30px;
       		display: flex;
       		.chunk_five{
       			width: 50%;
       			display: flex;
       			align-items: center;
       			.address{
       				box-sizing: border-box;
       				flex:1;
       				display:flex;
       				align-items: center;
       				.address_chunk{
       					
       				}
       			}
       			span{
       				text-align: right;
       				flex: 0 0 88px;
       			}
       		}
       		.chunk{
       			width: 25%;
       			display: flex;
       			align-items: center;
       			.el-form-item{
       				flex: 1;
       			}
       			span{
       				text-align: right;
       				flex: 0 0 30%;
       				.requeryStar{
       					color: #FF0000;
       					padding-right: 2px;
       				}
       			}
       			
       		}
       	}
        .el-input {
        	max-width: 250px;
        }
        
        .el-select{
        	width: 100%;
        	max-width: 250px;
        }

  
    .listBox{
      /*width: 600px;*/
      box-sizing: border-box;
      .listLeftBox{
      	overflow: auto;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 200px;
        height:300px;
       .headerBox{
         height: 35px;
         border: 1px solid #e4e4e4;
         span{
           color: red;
           line-height: 36px;
         }
       }
      }
      .listRightBox{
      	border: 1px solid #e5e5e5;
      	height:300px;
        width: 200px;
        overflow: auto;
        /*padding: 0 10px;*/
        .headerBox{
          height: 35px;
          border: 1px solid #e4e4e4;
          span{
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }

      }
    }

}
}
</style>
