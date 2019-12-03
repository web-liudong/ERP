

<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>供应商业务ID：</th>
          <td>{{detailData.id}}</td>
          <th>供应商业务状态：</th>
          <td>{{detailData.statusName}}</td>
        </tr>
        <tr>
          <th><i>*</i>供应商公司名称：</th>
          <td>{{detailData.supplierName}}</td>
          <th>供应商业务更新状态：</th>
          <td>{{detailData.updatedStatusName}}</td>
        </tr>
        <tr>
          <th><i>*</i>统一社会信用代码：</th>
          <td>{{detailData.socialCreditCode}}</td>
          <th><i>*</i>供应商类型：</th>
          <td>{{detailData.supplierBizTypeName}}</td>
        </tr>
        <tr>
          <th><i>*</i>供应商服务对象：</th>
          <td>{{detailData.branchName}}</td>
          <th><i>*</i>合同有效期：</th>
          <td>{{detailData.contractStartTime}}至{{detailData.contractEndTime}}</td>
        </tr>
        <tr>
          <th><i>*</i>业务联系人1：</th>
          <td>{{detailData.bizContactDTOs[0] | yesorno}}，{{detailData.bizContactDTOs[0] | yesphone}}</td>
          <th><i>*</i>业务联系人2：</th>
          <td>{{detailData.bizContactDTOs[1] | yesorno}}，{{detailData.bizContactDTOs[1] | yesphone}}</td>
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
          <td>{{detailData.paymentDays}}</td>
        </tr>
        <tr>
          <th> 授信额度是否限制：</th>
          <td>{{detailData.limited?'是':'否'}}</td>
          <th><i>*</i>财务联系人1：</th>
          <td>{{detailData.financialContactDTOs[0] | yesorno}}，{{detailData.financialContactDTOs[0] | yesphone}}</td>
        </tr>
        
      </table>
    </div>
    
      
      
    
    
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i></i>操作详情</span>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userName"
          label="操作者"
          style="width: 33%"
          align="center">
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
        </el-table-column>
      </el-table>
      <el-button type="primary" v-close>关闭</el-button>
      <el-button type="primary"  v-backTop>返回顶部</el-button>
    </div>
  </div>
  

</template>
<script>
	  import {
		
	updateDetail
	} from '@/api/businessSupplier'
  export default {
    name: "brand",
    data(){
      return {
      	detailData:{},
        tableData: [],
        
      }
    },
    created(){
    	this.getData()
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
    		updateDetail(this.$route.query.detailId).then(res=>{
    			this.detailData=res.data
    			this.tableData=res.data.supplierBizOperationLogDTOs
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
              line-height:50px;
              margin-left:10px;
                i{

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
          line-height:50px;
          margin-left:10px;
          i{

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
