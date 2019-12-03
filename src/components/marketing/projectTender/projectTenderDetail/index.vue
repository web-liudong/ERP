

<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="icon iconfont icon-jinqi"></i>项目基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>项目编码：</th>
          <td>{{detailData.no}}</td>
          <th>项目状态：</th><!---->
          <td>{{detailData.statusName}}</td>
        </tr>
        <tr>
          <th>项目类型：</th>
          <td>{{detailData.tenderProjectTypeName}}</td>
          <th><i>*</i>项目名称：</th>
          <td>{{detailData.name}}</td>
        </tr>
        <tr>
          <th>招标内容：</th><!---->
          <td><span v-for="(item,index) in detailData.tenderProjectContentDTOs">{{item.content}}，</span></td>
          <th>所属行业：</th><!---->
          <td>{{detailData.industryDetail}}</td>
        </tr>
        <tr>
          <th>客户单位：</th>
          <td>{{detailData.customerCompany}}</td>
          <th>主导部门：</th>
          <td>{{detailData.leadingDepartment}}</td>
        </tr>
        <tr>
          <th>项目投标主体：</th>
          <td>{{detailData.organizationName}}</td>
          <th>参与方式：</th>
          <td>{{detailData.participationWay}}</td>
        </tr>
        <tr>
          <th>发布网站：</th>
          <td>{{detailData.publishingWebsite}}</td>
          <th>获知时间：</th>
          <td>{{detailData.informedTime}}</td>
        </tr>
        <tr>
          <th>公告起止时间：</th>
          <td>{{detailData.announcementStartTime}}至{{detailData.announcementEndTime}}</td>
          <th>开标地点：</th>
          <td>{{detailData.tenderOpenAddressLine}}</td>
        </tr>
        <tr>
          <th>开标时间：</th>
          <td>{{detailData.tenderOpenTime}}</td>
          <th>项目起止日期：</th>
          <td>{{detailData.projectStartTime}}至{{detailData.projectEndTime}}</td>
        </tr>
        <tr>
          <th>项目期限：</th>
          <td colspan="3">{{detailData.projectDuration}}年</td>
          
        </tr>
        <tr>
          <th>执行区域：</th>
          <td colspan="3">
          	
          	<div class=""  style="max-height: 300px;overflow: auto;">
          		<el-tree :data="detailData.regionTreeBasedIdDTOS" :props="defaultProps" default-expand-all></el-tree>
          	</div>
          	
          </td><!--0：独立结算，1：合并结算-->
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont icon-jinqi" style="font-size: 22px;line-height: 50px;"></i>项目联系人信息</span>
      </div>
      <table border="1">
        <tr>
          <th>项目方联系人：</th>
          <td>{{detailData.projectContactName}}</td>
          <th>项目方联系方式：</th>
          <td>{{detailData.projectContactPhone}}</td>
        </tr>
        <tr>
          <th>客户单位地址：</th>
          <td>{{detailData.customerCompanyAddress}}</td>
          <th>客户单位联系方式：</th>
          <td>{{detailData.customerCompanyContactPhone}}</td>
        </tr>
        <tr>
          <th>代理机构名称：</th>
          <td>{{detailData.agencyName}}</td>
          <th>代理机构地址：</th>
          <td>{{detailData.agencyAddress}}</td>
        </tr>
        <tr>
          <th>代理机构联系人：</th>
          <td>{{detailData.agencyContactName}}</td>
          <th>代理机构联系方式：</th>
          <td>{{detailData.agencyContactPhone}}</td>
        </tr>
      </table>
      
    </div>
      
      
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont icon-jinqi" style="font-size: 22px;line-height: 50px;"></i>项目投标信息</span>
      </div>
      <table border="1">
        <tr>
          <th>项目投标负责人：</th>
          <td>{{detailData.managerName}}</td>
          <th>负责部门：</th>
          <td>{{detailData.departmentName}}</td>
        </tr>
        <tr>
          <th>备注：</th>
          <td colspan="3">{{detailData.remark}}</td>
        </tr>
        
      </table>
      <el-table
        :data="detailData.tenderProjectWorkTasks"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="id"
          label="工作事项ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="workItem"
          label="工作事项"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="负责人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="workStartTime"
          label="开始时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="workEndTime"
          label="结束时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="工作状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center">
          <template slot-scope="scope">
          	<span>{{scope.row.remark}}</span>
          	</template>
        </el-table-column>
      </el-table>
      <el-table
        :data="detailData.tenderProjectResultDetailDTOs"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="companyName"
          label="中标公司"
          align="center">
        </el-table-column>
        <el-table-column
          prop="tenderProjectResultTenderSituationName"
          label="中标情况"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center">
          <template slot-scope="scope">
          	<span>{{scope.row.remark}}</span>
          	</template>
        </el-table-column>
      </el-table>
    </div>
    
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont icon-jinqi" style="font-size: 22px;line-height: 50px;"></i>操作详情</span>
      </div>
      
      <el-table
        :data="detailData.tenderProjectOperationLogDTOS"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          label="操作者"
          align="center">
          <template slot-scope="scope">
          	<span>{{scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作描述"
          align="center">
          <template slot-scope="scope">
          	<span>{{scope.row.operationName}}</span>
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
		getDetail
	} from '@/api/marketing-service/projectTender'
  export default {
    name: 'ProjectTenderDetail',
    inject:['close'],
    data(){
      return {
      	detailData:{},
        tableData: [],
        defaultProps:{
          children: 'childrenDTOs',
          label: 'name'
        },
        detailId:'',
      }
    },
    created(){
    	
    	this.getData()
    },
    activated(){
    		if(this.$route.query.detailId!=this.detailId){
    			this.getData()
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
    		getDetail(this.$route.query.detailId).then(res=>{
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
