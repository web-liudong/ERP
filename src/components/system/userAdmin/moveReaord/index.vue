<template>
	  <div class="brandBox">
    <!--<div class="buttonBox">
      <el-button size="small" v-for="(buttondata,index) in buttondatas" :key="index" :class="{ active: buttonshow==index }" @click="header_button_click(index)">{{buttondata.name}}（{{buttondata.countNum}}）</el-button>
    </div>-->
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
      	用户ID:
        <el-input
          placeholder="用户ID"
          v-model="userID"
          clearable>
        </el-input>
        真实姓名:
        
        <el-select
			    v-model="realName"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入姓名"
			    :remote-method="remoteMethod"
			    >
			    <el-option
			      v-for="item in options4"
			      :key="item.id"
			      :label="item.realName"
			      :value="item.realName">
			    </el-option>
			  </el-select>
        
        <!--<el-select v-if="buttonshow==0" v-model="value2" placeholder="更新状态">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>-->
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					

        </div>
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            type="index"
 						:index="typeIndex"
            label="序号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="operatorText"
            label="操作者"
            align="center">
          </el-table-column>
          <el-table-column
            prop="operationTime"
            label="操作时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userDataAuthorityText"
            label="移交数据"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fromUserName"
            label="移交数据人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="toUserName"
            label="移交到"
            align="center">
          </el-table-column>
          
        </el-table>
      </div>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
    


  </div>

</template>
<script>


  import store from '@/store/store'
	import {
		simpleList,
		transferList
		
		

	} from '@/api/userService'

  export default {
    inject:['reload'],
    name: 'MoveReaord',
    data() {
      return {
      	userID:'',
      	downId:"",
      	gridData:[],
      	dialogTableVisible2:false,
      	submitId:'',
      	dialogVisible: false,
      	dialogVisible1: false,
      	buttondatas:[
//    		{name:'可用',countNum:500,id:0},
//    		{name:'待审核',countNum:500,id:1},
//    		{name:'草稿',countNum:500,id:2},
//    		{name:'已驳回',countNum:500,id:3}
      	],
      	options4:[],
      	//总页数
      	pagetotal:null,
      	//供应商id
      	supplerID:'',
      	//简称
      	cupyName:'',
    	  //法人
      	cupyMaster:'',
      	//选中状态
      	buttonshow:0,
      	//当前页数
      	currentPage4: 1,
        isShow:true,
        tableData: [
//      {
//      	countSupplierBiz: null,
//					gradeLevel: null,
//					id: null,
//					legalPersonName: null,
//					name: null,
//					shortName: null,
//					socialCreditCode: null,
//					supplierEditingStatus: 1,
//					supplierStatus: null
//      }
],
        options1: [{
          value: null,
          label: '不限'
        }, {
          value: '1',
          label: '1级'
        }, {
          value: '2',
          label: '2级'
        }, {
          value: '3',
          label: '3级'
        }, {
          value: '4',
          label: '4级'
        }, {
          value: '5',
          label: '5级'
        }],
        options2: [{
          value: null,
          label: '不限'
        }, {
          value: '0',
          label: '草稿'
        }, {
          value: '1',
          label: '已通过'
        }, {
          value: '2',
          label: '未通过'
        }],
        value1:'',
        value2:'',
        deleteId:'',
        ArraignmentId:'',
        realName:'',
      }
    },
    computed:{
    	loading(){
    		return store.getters.loading
    	}
    },
    created(){
    	this.requestData()
    },
    methods: {
    	typeIndex(index) {
	 			return index + (this.currentPage4 - 1) * 10 + 1;
	 			//这个是默认一页显示十条数据
			},
    	query(){
    		this.requestData()
    	},
    	remoteMethod(query) {
        if (query !== '') {
          simpleList({userName:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
    	
    	
    	
    	
    	
    	
    	
    
    	
    	requestData(index){
    		let a={
    			"pageNum": this.currentPage4,
				  "pageSize": 10,
				  "realName": this.realName,
				  "userId": this.userID
    		}
    		transferList(a).then(res=>{
    			this.tableData=res.data.items
    			this.pagetotal=res.data.total
    		})
    	},
    	
      
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4=val
        this.requestData()
      },
      showHelp(){
        this.isShow=!this.isShow;
      }
     }
    

};
</script>
<style scoped lang='less'>
	.brandBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .el-button {
        width: 160px;
        height: 30px;
      }
      .active{
      	background-color: #339999;
      	border-color: #339999;
      	color: #FFFFFF;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        float: right;
        span{
        	cursor: pointer;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        /*height: 56px;*/
        border-top: 1px solid #e4e4e4;

        /*margin-top: -2px;*/
        .el-input {
          width: 200px;
          height: 40px;
					padding: 5px;
        }
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      line-height: 50px;
      .listBoxTop {
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .el-button {
          /*width: 80px;*/
          height: 30px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin-top: 10px;
    }
  }

</style>