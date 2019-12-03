

<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="icon iconfont icon-jinqi"></i>项目基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>项目编号：</th>
          <td>{{detailData.no}}</td>
          <th>项目状态：</th>
          <td>{{detailData.status}}</td>
        </tr>
        <tr>
          <th><i>*</i>项目名称：</th>
          <td>{{detailData.name}}</td>
          <th><i>*</i>项目类型：</th>
          <td>{{detailData.type}}</td>
        </tr>
        <tr>
          <th>项目简称：</th>
          <td>{{detailData.shortName}}</td>
          <th><i>*</i>合同有效期：</th>
          <td>{{detailData.contractStartTime}}至{{detailData.contractEndTime}}</td>
        </tr>
        <tr>
          <th>项目方联系人：</th>
          <td>{{detailData.partyAContactName}}</td>
          <th>项目方联系方式：</th>
          <td>{{detailData.partyAContactPhone}}</td>
        </tr>
        <tr>
          <th><i>*</i>项目乙方：</th>
          <td>{{detailData.partyBName}}</td>
          <th><i>*</i>乙方发票限额：</th>
          <td>{{detailData.partyBInvoiceLimit}}</td>
        </tr>
        <tr>
          <th><i>*</i>项目开票申请方：</th>
          <td>{{detailData.invoiceApplicant}}</td>
          <th><i>*</i>开票方：</th>
          <td>{{detailData.invoiceParty}}</td>
        </tr>
        <tr>
          <th><i>*</i>是否需要上传自定义开票明细：</th>
          <td>{{detailData.needOrderItemForBill}}</td>
          <th>&nbsp;</th>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <th><i>*</i>乙方项目负责人：</th>
          <td>{{detailData.partyBPrincipalUserDTO.userName}}</td>
          <th><i>*</i>乙方负责人姓名：</th>
          <td>{{detailData.partyBPrincipalUserDTO.realName}}</td>
        </tr>
        <tr>
          <th><i>*</i>集团项目负责人：</th>
          <td>{{detailData.userDataAuthorityUserDTO.userName}}</td>
          <th><i>*</i>集团负责人姓名：</th>
          <td>{{detailData.userDataAuthorityUserDTO.realName}}</td>
        </tr>
        <tr>
          <th>项目发布负责人：</th>
          <td>{{detailData.publisherUserDTO.userName?detailData.publisherUserDTO.userName:''}}</td>
          <th>发布负责人姓名：</th>
          <td>{{detailData.publisherUserDTO.realName?detailData.publisherUserDTO.realName:''}}</td>
        </tr>
        <tr>
          <th>项目账期：</th>
          <td>{{detailData.paymentDays}}天</td>
          <th>账期备注：</th>
          <td>{{detailData.paymentDesc}}</td>
        </tr>
        <tr>
          <th>第三方平台费结算方式：</th>
          <td>{{detailData.paymentType}}</td><!--0：独立结算，1：合并结算-->
          <th>第三方平台费率：</th>
          <td>{{detailData.partyCServiceFeeRate}}%</td>
        </tr>
        <tr>
          <th>第三方平台费结算账号开户行：</th>
          <td>{{detailData.partyCBank}}</td>
          <th>第三方平台费结算账号开户名：</th>
          <td>{{detailData.partyCAccountName}}</td>
        </tr>
        <tr>
          <th>第三方平台费结算账号：</th>
          <td>{{detailData.partyCAccountNo}}</td>
          <th><i>*</i>领先未来平台服务费率：</th>
          <td>{{detailData.lxwlServiceFeeRate}}%</td>
        </tr>
       
        
       
        
        
      </table>
    </div>
    
      
      
    
    
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont icon-jinqi" style="font-size: 22px;line-height: 50px;"></i>操作详情</span>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userName"
          label="操作者"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作描述"
          align="center">
          <template slot-scope="scope">
          	<span>
          	{{scope.row.operation}}	
          	</span>
          	<br/>
          	<span>{{scope.row.description}}</span>
          	</template>
        </el-table-column>
        <el-table-column
          label="第三方平台费率"
          align="left">
          <template slot-scope="scope">
          	<li>原：{{scope.row.partyCServiceFeeChange.old?scope.row.partyCServiceFeeChange.old:'---'}}</li>
          	<li>现：{{scope.row.partyCServiceFeeChange.new?scope.row.partyCServiceFeeChange.new:'---'}}</li>
          	</template>
        </el-table-column>
        <el-table-column
          prop="lxwlServiceFeeChange"
          label="领先未来服务费率"
          align="left">
          <template slot-scope="scope">
          	<li>原：{{scope.row.lxwlServiceFeeChange.old?scope.row.lxwlServiceFeeChange.old:'---'}}</li>
          	<li>现：{{scope.row.lxwlServiceFeeChange.new?scope.row.lxwlServiceFeeChange.new:'---'}}</li>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary"  v-backTop>返回顶部</el-button>
    </div>
  </div>
  

</template>
<script>
	  import {
		projectDetail
	} from '@/api/projectController/projectController'
  export default {
    name: 'DetailProject',
    inject:['close'],
    data(){
      return {
      	detailData:{},
        tableData: [],
        detailId:'',
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
    filters:{
    	yesorno(value){
    		return value?value.name:''
    	},
    	yesphone(value){
    		return value?value.phone:''
    	}
    },
    methods: {
    	getData(){
    		this.detailId=this.$route.query.detailId
    		projectDetail(this.$route.query.detailId).then(res=>{
    			this.detailData=res.data
    			this.tableData=res.data.projectOperationList
    		})
    	},
    	
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
      .detaillTable{
        border: 1px solid #d1d1d1;
        .detaillTopBox{
          height:50px;
          background: #f3f3f3;
          border-bottom: 1px solid #d1d1d1;
            span{
            	font-size: 16px;
              line-height:50px;
              margin-left:10px;
                i{
                	position: relative;
          	top: 2px;
									font-size: 22px;
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
        	font-size: 16px;
          line-height:50px;
          margin-left:10px;
          i{
          	position: relative;
          	top: 2px;
						font-size: 22px;
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
