

<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconshujuliebiao"></i>供应商基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>供应商公司编号：</th>
          <td>{{SupplierInfoDTO.no}}</td>
          <th><i>*</i>供应商类型：</th>
          <td>{{SupplierInfoDTO.typeName}}</td>
        </tr>
        <tr>
          <th><i>*</i>供应商公司名称：</th>
          <td>{{SupplierInfoDTO.name}}</td>
          <th>供应商状态：</th>
          <td>{{SupplierInfoDTO.supplierStatus}}</td>
        </tr>
        <tr>
          <th><i>*</i>统一社会信用代码：</th>
          <td>{{SupplierInfoDTO.socialCreditCode}}</td>
          <th><i>*</i>公司法人：</th>
          <td>{{SupplierInfoDTO.legalPersonName}}</td>
        </tr>
        <tr>
          <th>法人身份证：</th>
          <td>{{SupplierInfoDTO.legalPersonIdCard}}</td>
          <th>经营范围：</th>
          <td>{{SupplierInfoDTO.businessScope}}</td>
        </tr>
        <tr>
          <th><i>*</i>管理员账号：</th>
          <td>{{SupplierInfoDTO.managerNO}}-{{SupplierInfoDTO.managerName}}</td>
          <th>&nbsp;</th>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <th><i>*</i>供应商所在地：</th>
          <td colspan="3">
          	{{SupplierInfoDTO.addressLine}}
          </td>
          
        </tr>
        <tr>
          <th>资质文件：</th>
          <td colspan="3"><li  v-for="(item,index) in SupplierInfoDTO.fileDTOS" :key="index"><a :href="'/image'+item.url" target="_blank">{{item.name}}</a></li>
          	
          </td>

        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconzuzhijigoujingyingquyu"></i>供应商经营范围</span>
      </div>
      <div class="copy_region clearfix">
      	<div class="title">
      		<i style="color: #F04844;">*</i><span>公司经营区域：</span>
      	</div>
      	<div class="main">
      		<div class="province">
      		<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" disabled>全选</el-checkbox>
			  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
			    <el-checkbox v-for="city in cities" :label="city.id" :key="city.id" disabled>{{city.name}}</el-checkbox>
			  </el-checkbox-group>
      		</div>
      		<div class="province_to clearfix">
      			<div class="classify">
      				<h4>公司经营分类</h4>
      				<div class="classify_b">
      					<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
      				</div>
      			</div>
      			<div class="isclass">
      				<div class="class_c">
      					<h4 class="clearfix">
      					<li style="float: left;width: 50%;text-align: center;">公司经营品牌</li>
      					<li style="float: left;width: 50%;text-align: center;">所属分类</li>
      					</h4>
      					<div class="class_c_b">
      						<el-table
      							:show-header="false"
						        :data="SupplierInfoDTO.brandLKCategoryDTOS"
						        border

						        size="small">
						        <el-table-column
						          prop="brandDetail"
						          align="center">
						        </el-table-column>
						        <el-table-column
						          prop="categoryDetail"
						          align="center">
						        </el-table-column>
						      </el-table>
      					</div>
      				</div>

      			</div>
      		</div>
      	</div>
      </div>
      <!--<el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="date"
          label="操作者"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>-->

    </div>
    <div class="detaillTable" style="border-top: 0px;">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconkaipiaoxinxi"></i>供应商财务开票信息</span>
      </div> 
      <table border="1">
      	<tr>
          <th>开票抬头：</th>
          <td>{{SupplierInfoDTO.invoiceTitle}}</td>
          <th>统一社会信用代码：</th>
          <td>{{SupplierInfoDTO.socialCreditCode}}</td>
        </tr>
        <tr>
        	<th>纳税级别：</th>
          <td>{{SupplierInfoDTO.supplierTaxLevel | taxRank}}</td>
          <th>开户行：</th>
          <td>{{SupplierInfoDTO.bank}}</td>
        </tr>
        <tr>
        	<th>开户名称：</th>
          <td>{{SupplierInfoDTO.invoiceTitle}}</td>
          <th>开户账号：</th>
          <td>{{SupplierInfoDTO.accountNo}}</td>
        </tr>
        <tr>
          <th>开票地址：</th>
          <td>{{SupplierInfoDTO.addressOnInvoice}}</td>
          <th>开票电话：</th>
          <td>{{SupplierInfoDTO.phoneOnInvoice}}</td>
        </tr>
      </table>
    </div>
    <!--<div class="detaillTable" style="border-top: 0px;">
      <div class="detaillTopBox">
        <span><i class="icon iconfont icon-jinqi"></i>供应商收货信息</span>
      </div> 
      <table border="1">
      	<tr>
          <th><i>*</i>收货人姓名：</th>
          <td style="width: 80%;">{{SupplierInfoDTO.receiver}}</td>
        </tr>
        <tr>
        	<th><i>*</i>收货人电话：</th>
          <td style="width: 80%;">{{SupplierInfoDTO.receiverPhone}}</td>
        </tr>
        <tr>
        	<th><i>*</i>收货地址：</th>
          <td style="width: 80%;">{{SupplierInfoDTO.receiverAddressLine}}</td>
        </tr>
      </table>
    </div>-->
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="icon iconfont iconcaozuoxiangqing"></i>操作详情</span>
      </div>
      <el-table
        :data="SupplierInfoDTO.supplierLogDTOS"
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
						<span>{{scope.row.operationName}}</span><br/>
						<span v-if="scope.row.operationName=='驳回'">{{scope.row.description}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary"  v-backTop>返回顶部</el-button>
    </div>
  </div>


</template>
<script>
	import {supplierDetail,treepreview,provinces_based_id} from "@/api/basicSupplier"
  export default {
    name: "BasicDetail",
    inject:['close'],
    data(){
      return {
      	SupplierInfoDTO:{},
      	data: [],
        defaultProps: {
          children: 'subCategory',
          label: 'name'
        },
      	 checkAll: false,
      	 isIndeterminate: true,
      	 checkedCities: [],
      	 cities:[],
      	detailId:'',
        
      }
    },
    created(){
    	this.getdetailData()
    },
    activated(){
    	if(this.detailId){
    		if(this.$route.query.detailId!=this.detailId){
    			this.getdetailData()
    		}
    	}
    },
    mounted(){
    	
    },
    filters:{
    	filRank(value){
    		switch(value){
    			case "GRADE1":
    				return '1级'
    			break;
    			case "GRADE2":
    				return '2级'
    			break;
    			case "GRADE3":
    				return '3级'
    			break;
    			case "GRADE4":
    				return '4级'
    			break;
    			case "GRADE5":
    				return '5级'
    			break;
    		}
    	},
    	taxRank(value){
    		switch(value){
    			case "TAX_LEVEL0":
    				return '一般纳税人'
    			break;
    			case "TAX_LEVEL1":
    				return '小规模纳税人'
    			break;
    			
    		}
    	},
    	updatetype(value){
    		switch(value){
    			case "0":
    				return '草稿'
    			break;
    			case "1":
    				return '待审核'
    			break;
    			case "2":
    				return '驳回'
    			break;
    			case "3":
    				return '可用'
    			break;
    			case "4":
    				return '禁用'
    			break;
    		}
    	},
    },
    methods: {
    	getdetailData(){
//  		this.$route.query.detailId
			this.detailId=this.$route.query.detailId
				provinces_based_id().then(res => {
				this.cities = res.data
				})
    		supplierDetail(this.$route.query.detailId).then(res=>{
    			this.SupplierInfoDTO=res.data
//  			categoryIds
//  			regionIds
					this.checkedCities=res.data.regionIds
					//获取分类树
					let a={
						 "categoryIds": res.data.categoryIds
					}
					treepreview(a).then(res=>{
						this.data=res.data
					})
					
    		})
    	},
    	//多选框全选
    	handleCheckAllChange(val) {
			this.checkedCities = val ? this.cities.map(item => item.id) : [];
			this.isIndeterminate = false;
		},
		handleCheckedCitiesChange(value) {
			let checkedCount = value.length;
			this.checkAll = checkedCount === this.cities.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
		},
      handleNodeClick(data) {
        console.log(data);
      }
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
            background: #f9fafc;
            width:20%;
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
