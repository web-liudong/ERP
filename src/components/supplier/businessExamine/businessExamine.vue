<template>
  <div class="businessSupplerDetaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconshujuliebiao"></i>基本信息</span>
      </div>
      <table border="1">
         <tr>
          <th>供应商业务编码：</th>
          <td>{{detailData.no}}</td>
          <th>状态：</th>
          <td>{{detailData.statusName}}</td>
        </tr>
        <tr>
          <th><i>*</i>供应商公司名称：</th>
          <td>{{detailData.supplierName}}</td>
          <th><i>*</i>供应商等级：</th>
          <td>{{detailData.levelName}}</td>
        </tr>
        <tr>
          <th><i>*</i>统一社会信用代码：</th>
          <td>{{detailData.socialCreditCode}}</td>
          <th><i>*</i>供应商服务对象：</th>
          <td>{{detailData.branchName}}</td>
        </tr>
        <tr>
          
          <th><i>*</i>合同有效期：</th>
          <td>{{detailData.contractStartTime}}至{{detailData.contractEndTime}}</td>
          <th><i>*</i>业务联系人：</th>
          <td>
          	<li v-for="(item,index) in detailData.bizContactDTOs" :key="item.phone" style="font-size: 12px;line-height: 12px;"> {{item | yesorno}}，{{item | yesphone}}</li>
          </td>
        </tr>
       
        <tr>
          <th><i>*</i>结算方式：</th>
          <td>{{detailData.supplierBizPayTypeName}}</td>
          <th><i>*</i>开户行：</th>
          <td>{{detailData.bank}}</td>
        </tr>
        <tr>
          <th><i>*</i>开户名称：</th>
          <td>{{detailData.accountName}}</td>
          <th><i>*</i>开户账号：</th>
          <td>{{detailData.accountNo}}</td>
        </tr>
        <tr>
          <th>结算账期：</th>
          <td>{{detailData.supplierBizPaymentDaysTypeName}}</td>
          <th><i>*</i>授信账期天数：</th>
          <td>{{detailData.paymentDays}} <span>天</span> </td>
        </tr>
        <tr>
          <th> 授信额度是否限制：</th>
          <td>{{detailData.limited?'是':'否'}},{{detailData.creditLine}}<span v-if="detailData.creditLine">元</span></td>
          <th><i>*</i>财务联系人：</th>
          <td>
          	<li v-for="(item,index) in detailData.financialContactDTOs" :key="item.phone" style="font-size: 12px;line-height: 12px;">{{item | yesorno}}，{{item | yesphone}}</li>
          </td>
        </tr>
        <tr>
          <th><i>*</i>管理员账号：</th>
          <td>{{detailData.manageNo}}</td>
          <th><i>*</i>管理员姓名：</th>
          <td>{{detailData.manageName}}</td>
        </tr>
      </table>
    </div>
    
      
      
    
    
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconcaozuoxiangqing"></i>操作详情</span>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
						<span>{{scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="操作描述"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
              {{scope.row.operationName}}<br v-if="scope.row.description" />{{scope.row.description}}
          </template>
        </el-table-column>
      </el-table>
      
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary"  v-backTop>返回顶部</el-button>
      <el-button type="primary" @click="dialogVisible = true" v-if="$authorities.SupplierBusinessReview">审核通过</el-button>
      <el-button type="primary" @click="Examback()" v-if="$authorities.SupplierBusinessReview">驳回</el-button>
    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible" @close="returnClose()"  width="400px">
		  <el-form :model="form" :rules="rules" ref="form">
		    <el-form-item label="驳回原因"  prop="name">
		      <el-input v-model="form.name" type="textarea" :rows="3" placeholder="字数长度1~200以内" ></el-input>
		    </el-form-item>  
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog
		  title="审核通过确认"
		  :visible.sync="dialogVisible"
		   width="400px"
		  >
		  <span>确定供应商信息无误，可以审核通过？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="Examgo()">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
  

</template>
<script>
	  import {
	  	pendingReview,
		IDdetail,
		reviewPassed,//审核通过
		reviewReject//审核不通过
	} from '@/api/businessSupplier'
  export default {
    name: "BusinessExamine",
    inject:['close'],
    data(){
      return {
      	form:{
      		name:''
      	},
      	dialogVisible:false,
      	dialogFormVisible:false,
      	rules:{
      		name: [{
					required: true,
					message: '请输入驳回原因',
					trigger: 'blur'
				}, ],
      	},
      	detailData:{},
        tableData: [],
        detailId:'',
      }
    },
    filters:{
    	yesorno(value){
    		return value?value.name:''
    	},
    	yesphone(value){
    		return value?value.phone:''
    	}
    },
    created(){
    	this.getData()
    },
    activated(){
    	if(this.detailId){
    		if(this.$route.query.detailId!=this.detailId){
    			this.getData()
    		}
    	}
    },
    methods: {
    	returnClose(){
    		this.form.name=''
    	},
    	getData(){
    		IDdetail(this.$route.query.detailId).then(res=>{
    			this.detailData=res.data
    			this.tableData=res.data.supplierBizOperationLogDTOs
    		})
    	},
    	Examback(){
      	this.dialogFormVisible=true
//    	reviewPassSupplier
      },
      Examgo(){
      	pendingReview(this.$route.query.detailId).then(res=>{
	    			if(res.data){
	    				this.Examgo1()
	    			}else{
	    				this.$confirm('数据状态发生变化，请重新获取数据', '提示', {
			          confirmButtonText: '确定',
			          type: 'warning'
			        }).then(() => {
			          this.close({
				        		name:'BusinessExamine',
				        		to:{
				        			name:'SupplierList',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
			        }).catch(() => {
			                    
			        })
	    			}
    		})
      },
      Examgo1(){
      	reviewPassed(this.$route.query.detailId).then(res=>{
      		if(res.data==1){
            		this.dialogVisible = false
            		this.$message({
				          message: '成功',
				          type: 'success'
				        });
				        this.close({
				        		name:'BusinessExamine',
				        		to:{
				        			name:'SupplierService',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
            	}
      	})
      },
      submitForm(f){
    		pendingReview(this.$route.query.detailId).then(res=>{
	    			if(res.data){
	    				this.submitForm1(f)
	    			}else{
	    				this.$confirm('数据状态发生变化，请重新获取数据', '提示', {
			          confirmButtonText: '确定',
			          type: 'warning'
			        }).then(() => {
			          this.close({
				        		name:'BusinessExamine',
				        		to:{
				        			name:'SupplierList',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
			        }).catch(() => {
			                    
			        })
	    			}
    		})
    	},
      submitForm1(f) {
        this.$refs[f].validate((valid) => {
          if (valid) {
          	let a={"description":this.form.name}
            reviewReject(this.$route.query.detailId,a).then(res=>{
            	if(res.data==1){
            		this.dialogFormVisible=false
            		this.$message({
				          message: '驳回成功',
				          type: 'success'
				        });
				        
				        this.close({
				        		name:'BusinessExamine',
				        		to:{
				        			name:'SupplierService',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
            	}
            	
            }).catch(rej=>{
            	this.dialogFormVisible=false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    	
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .businessSupplerDetaillBox{
    width: 100%;
    padding-top: 10px;
      .detaillTable{
        border: 1px solid #d1d1d1;
        .detaillTopBox{
          height:50px;
          background: #f3f3f3;
          border-bottom: 1px solid #d1d1d1;
            span{
              font-size:15px;
              font-weight: 900;
              line-height: 50px;
                i{
									font-size: 20px;
									padding: 0 5px 0 10px;
                }
            }
        }
        table{
          width:90%;
          margin:20px auto;
          td,th{
            border: 1px solid #d1d1d1;
            font-size:12px;
            height:53px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          th{
            color:#303133;
            text-align: right;
            width:20%;
            background: #f9fafc;
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
      }
      .detaillTable2{
        border: 1px solid #d1d1d1;
        border-top:none;
        .copy_region{
        	position:relative;
        	.title{
        		position: absolute;
        		left: 58px;
        		top: 34px;
        		width: 150px;
        		
        		
        	}
        	.main{
        		box-sizing: border-box;
        		padding: 20px 50px 20px 170px;
        		width: 100%;
        		
        		/*height: 500px;*/
        		.province{
        			box-sizing: border-box;
        			padding: 10px;
        			border: 1px solid #d1d1d1;
        			margin-bottom: 10px;
        		}
        		.province_to{
        			position: relative;
        			/*border: 1px solid #d1d1d1;*/
        			.classify{
        				position: absolute;
        				left: 0;
        				width: 300px;
        				height: 500px;
        				border: 1px solid #d1d1d1;
        				.classify_b{
        					width: 100%;
        					height: 100%;
        					box-sizing: border-box;
        					padding-top: 40px;
        					overflow: auto;
        				}
        				h4{
        					position: absolute;
        					top: 0;
        					width: 100%;
        					height: 40px;
        					line-height: 40px;
        					background: #f3f3f3;
        				}
        			}
        			.isclass{
        				height: 500px;
        				width: 100%;
        				/*border: 1px solid #d1d1d1;*/
        				
        				box-sizing: border-box;
        				padding-left: 310px;
        				.class_c{
        					position: relative;
        					width: 100%;
        					height: 100%;
        					border: 1px solid #d1d1d1;
        					h4{
        						position: absolute;
        						top: 0;
	        					width: 100%;
	        					height: 40px;
	        					line-height: 40px;
	        					background: #f3f3f3;
	        					z-index: 4;
        					}
        					.class_c_b{
        						box-sizing: border-box;
        						padding-top: 40px;
        						width: 100%;
        						height: 100%;
        						overflow: auto;
        					}
        				}
        				
        			}
        		}
        	}
        }
      .detaillTopBox{
        height:50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span{
             font-size:15px;
              font-weight: 900;
              line-height: 50px;
                i{
									font-size: 20px;
									padding: 0 5px 0 10px;
                }
            }
      }
      .el-table {
        margin:20px auto;
        width:90%;
          .el-button {
            font-size: 12px;
          }
        }
      .el-button {
        float: right;
        margin:10px 20px;
      }
    }
  }


</style>
