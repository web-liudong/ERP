<template>
	<div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconjiaosejibenxinxi"></i>用户基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>用户ID：</th>
          <td>{{detailData.id}}</td>
          <th>用户状态：</th>
          <td>{{detailData.status | yes}}</td>
        </tr>
        <tr>
          <th><i>*</i>登录名：</th>
          <td>{{detailData.userName}}</td>
          <th><i>*</i>手机号：</th>
          <td>{{detailData.mobile}}</td>
        </tr>
        <tr>
          <th><i>*</i>真实姓名：</th>
          <td>{{detailData.realName}}</td>
          <th>电话号：</th>
          <td>{{detailData.telephone}}</td>
        </tr>
        <tr>
          <th>电脑序列号1：</th>
          <td>{{detailData.mac1}}</td>
          <th>微信号：</th>
          <td>{{detailData.wechat}}</td>
        </tr>
        <!--<tr>
          <th><i>*</i>业务联系人1：</th>
          <td>{{detailData.bizContactDTOs[0] | yesorno}}，{{detailData.bizContactDTOs[0] | yesphone}}</td>
          <th><i>*</i>业务联系人2：</th>
          <td>{{detailData.bizContactDTOs[1] | yesorno}}，{{detailData.bizContactDTOs[1] | yesphone}}</td>
        </tr>-->
        <tr>
          <th>电脑序列号2：</th>
          <td>{{detailData.mac2}}</td>
          <th>QQ号：</th>
          <td>{{detailData.qq}}</td>
        </tr>
        <tr>
          <th>手机IMEI码：</th>
          <td>{{detailData.imei}}</td>
          <th>邮箱：</th>
          <td>{{detailData.email}}</td>
        </tr>
        <tr>
          <th><i>*</i>所属机构：</th>
          
          <td colspan="3">
          	<li v-for="(item,index) in detailData.userPosts">
          		{{item.organizationName}}-{{item.departmentName}}-{{item.post}}
          	</li>
          	
          </td>
        </tr>
        <tr>
          <th>角色信息：</th>
          <td colspan="3">
          	<span v-for="(item,index) in detailData.roles">
          		{{item.name}},
          	</span>
          </td>
          
          
        </tr>
        
      </table>
    </div>
    
      
      
    
    
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconcaozuoxiangqing" style=""></i>操作详情</span>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="operatorName"
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            	<!--{{scope.row.userInfo.organizationName}} <span v-if="scope.row.userInfo.departmentName">></span> 
            	{{scope.row.userInfo.departmentName}} <span v-if="scope.row.realName">></span> 
            	{{scope.row.userInfo.realName}}-->
            	{{scope.row.userInfo?scope.row.userInfo.userFullName:''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作描述"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            	{{scope.row.description}}
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
		detailData,
		detailLogs
	} from '@/api/userService'
  export default {
    name: 'UserDetail',
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
    	logs(value){
    		switch (value){
    			case 0:
    			return '新建'
    				break;
    				
    			case 1:
    			return '编辑'
  				break;
  				
  				case 2:
	  			return '禁用'
	  				break;
	  				
	  				case 3:
	  			return '离职'
	  				break;
    				
    		}
    	},
    	yes(value){
    		switch (value){
    			case 0:
    			return '可用'
    				break;
    				
    			case 1:
    			return '禁用'
  				break;
  				case 2:
    			return '离职'
  				break;
    				
    		}
    	}
    },
    methods: {
    	getData(){
    		this.detailId=this.$route.query.detailId
    		detailData(this.$route.query.detailId).then(res=>{
    			this.detailData=res.data
//  			this.tableData=res.data.userPosts
    		})
    		detailLogs(this.$route.query.detailId).then(res=>{
    			this.tableData=res.data
    		})
    	},

    
  }
};
</script>
<style scoped lang='less'>
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