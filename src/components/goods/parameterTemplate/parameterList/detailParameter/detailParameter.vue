

<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>参数ID：</th>
          <td>{{data.id}}</td>
          <th><i>*</i>所属分类：</th>
          <td>{{data.oneLevelCategoryName}}>{{data.twoLevelCategoryName}}>{{data.threeLevelCategoryName}}</td>
        </tr>
        <tr>
          <th>参数名称：</th>
          <td>{{data.name}}</td>
          <th><i>*</i>所属分类：</th>
          <td>{{data.primaryAttribute}}</td>
        </tr>
        <tr>
          <th>参数是否必填：</th>
          <td>{{data.required}}</td>
          <th><i>*</i>参数值类型：</th>
          <td>{{data.valueType | fiii}}</td>
        </tr>
        <tr>
          <th>参数值长度要求：</th>
          <td>{{data.maxLength}}</td>
          <th><i>*</i>排序值：</th>
          <td>{{data.sort}}</td>
        </tr>

        <tr>
          <th>参数选项值：</th>
          <td colspan="3">
          	{{data.options}}
          </td>

        </tr>

      </table>
    </div>





    <div class="detaillTable2 clear">
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary"  v-backTop>返回顶部</el-button>
    </div>
  </div>


</template>
<script>
	import {getDetail,} from '@/api/parameter'
  export default {
  	inject:['close'],
    name: "DetailParameter",
    data(){
      return {
      	data:{},
				routerQuery:'',

      }
    },
    created(){
    	this.getData()
    },
    activated(){
			if(this.routerQuery!=JSON.stringify(this.$route.query)){
				this.getListData()
    		this.getcommonHeader()
			}
    },
    filters:{
    	fiii(val){
    		switch(val){
    			case 0:
    			return "数字"
    			break;
    			case 1:
    			return "单行文本录入"
    			break;
    			case 2:
    			return "多行文本录入"
    			break;
    			case 3:
    			return "下拉列表"
    			break;
    			case 4:
    			return "单选按钮组"
    			break;
    			case 5:
    			return "多选框"
    			break;
    			case 6:
    			return "日历"
    			break;
    			case 7:
    			return "上传文件"
    			break;

    		}
    	}
    },
    methods: {
    	getData(){
    		this.routerQuery=JSON.stringify(this.$route.query)
    		getDetail(this.$route.query.parId,this.$route.query.templateId).then(res=>{
    			this.data=res.data
    		})
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
