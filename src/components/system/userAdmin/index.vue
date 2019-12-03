<template>
  <div class="userBox returnOrderBox">
    <div class="buttonBox">
      <el-button size="small":class="{ active: buttonshow==0 }" @click="header_button_click(0)">在职（{{inplaceNum}}）</el-button>
      <el-button size="small":class="{ active: buttonshow==1 }" @click="header_button_click(1)">离职（{{quitNum}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="query()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="Reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom clearfix" v-if="isShow">
      	<div id="" style="float: left;">
      		用户ID:
        <el-input
          placeholder="用户ID"
          v-model="userID"
          type="number"
          clearable>
        </el-input>
      	</div>
      	<div id="" style="float: left;">
      		真实姓名:
         <el-select
			    v-model="realName"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入姓名"
			    :remote-method="remoteMethod"
			     style="padding: 5px;"
			    >
			    <el-option
			      v-for="item in options4"
			      :key="item.id"
			      :label="item.realName"
			      :value="item.realName">
			    </el-option>
			  </el-select>
      	</div>
      	<div id="" style="float: left;">
      		所属组织机构:
	       <el-select
				    v-model="organizationId"
				    filterable
				    remote
				    clearable
				    reserve-keyword
				    placeholder="所属组织机构"
				    :remote-method="remoteMethod1"
				     style="padding: 5px;"
				     @change="organizationIdChange"
				    >
				    <el-option
				      v-for="item in options3"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
				 
	      	</div>
      	<div id="" style="float: left;display: flex;align-items: center;">
      		部门：
			  <!--<el-select v-model="departmentId"  style="padding: 5px;" >
          <el-option
            v-for="item in optionsdep"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>-->
        <el-popover
				  placement="bottom"
				  width="160"
				  style="margin-left: 0px;"
				  v-model="visible">
				    <div class="hidetree" style="max-height: 200px;overflow: auto;">
				    	<el-tree :data="treeData" :props="defaultProps1" @node-click="handleNodeClick"
				    		 default-expand-all
				    		 node-key="id"
				    		></el-tree>
				    </div>
				  <div slot="reference" class="popverBumen" :class="visible?'bb':''" @mouseout="departmentMouseout" @mouseover="departmentMouseover">
				  	<span style="line-height: 38px;color: #555555;">{{departmentName}}</span>
				  	<i class="el-icon-error" v-if="departmentError" @click.stop="departmentErrorClick()"></i>
				  	<i :class="visible?'el-icon-arrow-down go':'el-icon-arrow-down aa '" v-else></i>
				  </div>
				</el-popover>
      	</div>
      	<div id="" style="float: left;">
      		<span v-if="buttonshow==0" style="font-size: 12px;">用户状态:</span>
        <el-select v-model="status" placeholder="用户状态" v-if="buttonshow==0" style="padding: 5px;">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      	</div>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconshujuliebiao"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
					<router-link to="/system/systemindex/movereaord" >
                <!--<el-button size="small"><i class="icon iconfont iconcaidan" style="font-size: 12px;"></i>&nbsp;移交记录</el-button>-->
                <div class="operation_btn"><i class="iconfont iconcaidan"></i>移交记录</div>
          </router-link>
        	<router-link :to="{name:'Adduser', params:{isUpdate:true}}" v-if="$authorities.UserCreate">
                <div class="operation_btn"><i class="iconfont iconzengjia"></i>添加</div>
          </router-link>

        </div>
        </div>
        <el-table
          :data="tableData"
          border
          stripe
          :max-height="dataListHeight"
          style="width: 100%"
          size="small">
          <el-table-column
            prop="id"
            label="用户ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="登录名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="realName"
            label="真实姓名"
            align="center">
          </el-table-column>
          <el-table-column
            
            label="所属组织机构"
            align="center">
            <template slot-scope="scope">
							
              <span v-for="(it,index) in scope.row.userPosts"> {{it?it.organizationName:'--'}} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="lastLoginTime"
            label="上次登录时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="上次登录IP"
            align="center">
            
          </el-table-column>
          <el-table-column

            label="状态"
            align="center">
            <template slot-scope="scope">
            		<span v-if="scope.row.status==0">可用</span>
            		<span v-if="scope.row.status==1">禁用</span>
            		<span v-if="scope.row.status==2">离职</span>
            </template>
          </el-table-column>
					<el-table-column
            label="设置"
            width="150"
            align="center">
            <template slot-scope="scope">
            		<el-button v-show="buttonshow==0" v-if="$authorities.UserPermissionAdmin" type="text" size="small" @click="clickSetup(scope.row)">角色设置</el-button>
                <el-button  @click="dataClick(scope.row)" type="text" size="small" v-if="$authorities.UserDataTransfer">数据移交</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="170px"
            align="center">
            <template slot-scope="scope">
            		<el-button  type="text" size="small" v-if="$authorities.UserDetail" @click="goDetail(scope.row)">详情</el-button>
                <el-button v-show="buttonshow==0" v-if="$authorities.UserUpdate" @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button v-show="buttonshow==0&&scope.row.status==0" v-if="$authorities.UserForbidden" @click="visbiForbid(scope.row)" type="text" size="small">禁用</el-button>
                <el-button v-show="buttonshow==0&&scope.row.status==1" v-if="$authorities.UserForbidden" @click="visbienable(scope.row)" type="text" size="small">启用</el-button>
                <el-button v-show="buttonshow==0" v-if="$authorities.UserDimission" @click="visbileave(scope.row)" type="text" size="small">离职</el-button>
            </template>
          </el-table-column>
        </el-table>
      
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
        	style="float: right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40,50,100,500]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pagetotal">
        </el-pagination>
      </div>

    </div>
		
		<el-dialog title="管理数据移交" :visible.sync="dialogTableVisible2">
			<div class="dialog_data_top">
				<el-input
				  placeholder="请输入内容"
				  v-model="input1"
				  :disabled="true"
				  style="width: 250px;">
				</el-input>
				<span style="padding: 20px 30px;position: relative;">移交到</span>
				<el-select
					style="width: 250px;"
			    v-model="move.userIdTo"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="请输入负责人账号或者姓名"
			    :remote-method="remoteMethod5"
			    >
			    <el-option
			      v-for="item in options5"
			      :key="item.id"
			      :label="item.realName"
			      :value="item.id">
			    </el-option>
			  </el-select>
			</div>
			<div class="" style="padding: 20px 10px">
				<span style="font-size: 16px;font-weight: 500;padding-right: 50px;">移交数据类别</span><span style="color: red;font-size: 12px;">提示：请选择需要把那些数据类型的管理权限移交给其他用户</span>
			</div>
			<div class="dialog_data_foot">
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			  <el-checkbox-group v-model="move.userDataAuthorityTypes" @change="handleCheckedCitiesChange">
			    <el-checkbox v-for="city in cities" :label="city.dataAuthorityType" :key="city.dataAuthorityType" style="padding: 10px;">{{city.dataAuthorityName}}</el-checkbox>
			  </el-checkbox-group>
			</div>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="clearAuditor()">取 消</el-button>
		    <el-button type="primary" @click="isauditor()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="禁用提示"
		  :visible.sync="dialogVisible"
		  width="30%"
		  >
		  <span>禁用之后，用户将无法登录后台，确定要禁用吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="isforbid()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="启用提示"
		  :visible.sync="dialogVisible1"
		  width="30%"
		  >
		  <span>启用之后，用户恢复登陆后台功能，确定要启用吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible1 = false">取 消</el-button>
		    <el-button type="primary" @click="isenable()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="离职提示"
		  :visible.sync="dialogVisible2"
		  width="30%"
		  >
		  <span>设置离职之后，用户将永久禁用，确定要设置离职吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible2 = false">取 消</el-button>
		    <el-button type="primary" @click="isleave()">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="角色设置"
		  :visible.sync="visibleTree"
		  @close="treedialog()"
		  >
		  <div style="width: 100%;height: 300px;">
		  	<div class="listLeftBox left">
           <div class="headerBox"><span>全部角色列表</span></div>
           <div class="lltree">
           	<el-tree
           		v-if="visibleTree1"
          	ref="tree"
            :data="data2"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaulttree"
            @check="getnode()"
            :props="defaultProps">
          </el-tree>
           </div>
          
        </div>
        <div class="listRightBox left">
        	<div class="headerBox"><span>已选角色预览</span></div>
         	<div class="lltree" style="position: relative;">
         		<el-tree
         			v-if="visibleTree1"
             :data="data2"
            	ref="tree2"
             node-key="id"
             :filter-node-method="filterNode"
             :props="defaultProps">
           	</el-tree>
        	</div>
           
        </div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="visibleTree = false">取 消</el-button>
		    <el-button type="primary" @click="submitisId()">确 定</el-button>
		  </span>
		</el-dialog>


  </div>
</template>

<script>
	import store from '@/store/store'
	import {
		inplaceCount,
		quitCount,
		inplaceList,
		quitList,
		forbid,
		enable,
		simpleList,
		transfer,
		auditor,
		leave,
		listName,
		groupRoles,
		userRole,
		submituserRole,
		departmentList,
		departmentTree
	} from '@/api/userService'
  export default {
    inject:['reload'],
    name: "SystemList",
    data() {
      return {
      	departmentError:false,
      	treeData:[],
      	visible:false,
      	pageSize:10,
      	defaulttree:[],
      	setupId:'',
				data2: [],      	
      	move:{
      		"userDataAuthorityTypes": [],
				  "userIdFrom": 0,
				  "userIdTo": ''
      	},
      	isLeafarr:[],
      	cities:[],
      	checkAll: false,
				isIndeterminate: true,
      	input1:'',
      	options4:[],
      	options3:[],
      	options5:[],
      	optionsdep:[],
      	userIdTo:'',
      	enableId:'',
				forbidId:'',
				leaveId:'',
				realName:'',
				status:'',
				userID:'',
				organizationId:'',
				departmentId:'',
				departmentName:'',
      	inplaceNum:'',
      	quitNum:'',
      	downId:"",
      	gridData:[],
      	dialogTableVisible2:false,
      	submitId:'',
      	visibleTree:false,
      	visibleTree1:false,
      	dialogVisible: false,
      	dialogVisible1: false,
      	dialogVisible2: false,
      	buttondatas:[],
      	defaultProps: {
				children: 'roles',
				label: 'name'
				},
				defaultProps1: {
          children: 'departmentTreeDTOList',
          label: 'name'
       	},
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
        tableData: [],
        options1: [{
          value: null,
          label: '全部'
        }, {
          value: '0',
          label: '可用'
        }, {
          value: '1',
          label: '禁用'
        }],
        
        value1:'',
        value2:'',
        routerQuery:'',
      }
    },
    computed:{
    	optionsbumen(){
    		return this.optionsdep
    	},
    	dataListHeight(){
      return this.$store.getters.dataListHeight;
      }
    },
    created(){
    	this.organizationId=this.$route.query.organizationID?this.$route.query.organizationID:''
    	this.departmentId=this.$route.query.sectionID?this.$route.query.sectionID.toString():''
    	this.departmentName=this.$route.query.sectionName?this.$route.query.sectionName.toString():''
    	if(this.organizationId){
    		this.getdepartmentTree(this.organizationId)
    	}
    	if(this.$route.query.organizationID){
    		this.options3=[{
	    		id:this.$route.query.organizationID,
	    		name:this.$route.query.organizationName
	    	}]
    	}
    	this.getCount()
//  	this.getheader()
    	this.requestData()
    	this.isgetTreeAll()
		},
     activated(){
			if(this.$route.params.isUpdate){
				this.getCount()
				this.requestData()
			}else if(this.routerQuery!=JSON.stringify(this.$route.query)){
				this.organizationId=this.$route.query.organizationID?this.$route.query.organizationID:''
	    	this.departmentId=this.$route.query.sectionID?this.$route.query.sectionID.toString():''
	    	if(this.organizationId){
	    		this.getdepartmentTree(this.organizationId)
	    	}
	    	if(this.$route.query.organizationID){
	    		this.options3=[{
		    		id:this.$route.query.organizationID,
		    		name:this.$route.query.organizationName
		    	}]
	    	}
				this.getCount()
				this.requestData()
			}
    },
    methods: {
    	query(){
    		this.getCount()
    		this.requestData()
    	},
    	Reset(){
				  this.pageSize=10
				  this.currentPage4=1
				  this.userID=''
				  this.organizationId=''
				  this.departmentId=''
				  this.departmentName=''
				  this.status=''
				  this.realName=''
				  this.query()
    	},
    	treedialog(){
    		this.visibleTree1=false
    	},
    	departmentMouseout(){
    		this.departmentError=false
    	},
    	departmentErrorClick(){
    		this.departmentName=''
    		this.departmentId=''
    	},
    	departmentMouseover(){
    		if(this.departmentName){
    			this.departmentError=true
    		}else{
    			this.departmentError=false
    		}
    	},
    	handleNodeClick(node){
    		console.log(node)
    		this.departmentId=node.id
    		this.departmentName=node.name
    		this.visible=false
    	},
    	organizationIdChange(value){
    		if(value){
    			this.departmentId=''
    			this.departmentName=''
    			this.getdepartmentTree(value)
    		}else{
    			this.treeData=[]
    			this.departmentId=''
    			this.departmentName=''
    		}
    	},
    	getdepartmentTree(value){
    		departmentTree(value).then(res=>{
	    			this.treeData=res.data
	    		})
//  		let a={
//  			  "id": 0,
//					  "organizationId": id,
//  		}
//  		departmentList(a).then(res=>{
//  				this.optionsdep=res.data.departmentListDetailDTOList.items.map(item=>{
//  				return {name:item.name,id:item.id.toString()}
//  				})
//  		})
    	},
    	gettreeId(id){
    		userRole(id).then(res=>{
    			if(res.data[0]){
    				this.defaulttree=res.data.map(item=>item.id)
    				this.visibleTree1=true
	    			setTimeout(()=>{
	    				
	    				this.getnode()
	    			},30)
    			}else{
    				this.defaulttree=[]
    				console.log(this.defaulttree)
    				this.visibleTree1=true
    				setTimeout(()=>{
    					
	    				this.getnode()
	    			},30)
    			}
    			
    			
    		})
    	},
    	clickSetup(row){
    		this.visibleTree=true
    		this.setupId=row.id
    		this.gettreeId(row.id)
    	},
    	submitisId(){
    		let a={
    			"roleIds": this.isLeafarr,
  				"userId": this.setupId
    		}
    		submituserRole(this.setupId,a).then(res=>{
    			this.visibleTree=false
    			if(res.data>0){
    					this.$message({
			        message:'操作成功',
			        type: "success",
			       
			      })
    					this.getCount()
    					this.requestData()
    			}else{
    				this.$message({
			        message:'操作失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	isgetTreeAll(){
				groupRoles().then(res=>{
					let a=res.data
					a.map((item,index)=>{
						item.id='nnnnnmmmmm'+item.id
					})
					this.data2=a
					
				})
			},
    	getnode(data) {
				let idArr = this.$refs.tree.getCheckedKeys()
				let idArrLeaf = this.$refs.tree.getCheckedKeys(true)
				this.isLeafarr=idArrLeaf.filter(item=>!item.toString().includes('nnnnnmmmmm'))			
				this.$refs.tree2.filter(idArr);
			},
    	filterNode(value, data) {
			if(!value) return true;
			return value.includes(data.id);

			},
    	//禁用
    	visbiForbid(row){
    		this.dialogVisible=true
    		this.forbidId=row.id
    	},
    	visbienable(row){
    		this.dialogVisible1=true
    		this.enableId=row.id
    	},
    	visbileave(row){
    		this.dialogVisible2=true
    		this.leaveId=row.id
    	},
    	isforbid(){
    		forbid(this.forbidId).then(res=>{
    			this.dialogVisible=false
    			if(res.data>0){
    					this.$message({
			        message:'禁用成功',
			        type: "success",
			       
			      })
    					this.requestData()
    			}else{
    				this.$message({
			        message:'禁用失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	isleave(){
    		leave(this.leaveId).then(res=>{
    			this.dialogVisible2=false
    			if(res.data>0){
    					this.$message({
			        message:'操作成功',
			        type: "success",
			       
			      })
    					this.getCount()
    					this.requestData()
    			}else{
    				this.$message({
			        message:'操作失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	isenable(){
    		enable(this.enableId).then(res=>{
    			this.dialogVisible1=false
    			if(res.data>0){
    					this.$message({
			        message:'启用成功',
			        type: "success",
			       
			      })
    					this.requestData()
    			}else{
    				this.$message({
			        message:'启用失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	getauditor(id){
    		auditor(id).then(res=>{
    			this.cities=res.data
    		})
    	},
    	
    	clearAuditor(){
    		this.dialogTableVisible2 = false
    		this.options5=[]
    		this.move.userIdTo=''
    	},
    	isauditor(){
    		transfer(this.move).then(res=>{
    			this.dialogTableVisible2=false
    			if(res.data>0){
    					this.$message({
			        message:'移交成功',
			        type: "success",
			       
			      })
    					this.requestData()
    			}else{
    				this.$message({
			        message:'移交失败',
			        type: 'warning',
			        
			      })
    				this.requestData()
    			}
    		})
    	},
    	//模糊搜索
    	remoteMethod(query) {
        if (query !== '') {
          simpleList({userName:query,isQueryAllStatus:true}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
      },
      remoteMethod5(query) {
        if (query !== '') {
          simpleList({userName:query,isQueryAllStatus:true}).then(res=>{
          	this.options5=res.data
          })
        } else {
          this.options5 = [];
        }
      },
      remoteMethod1(query){
    		if (query !== '') {
          listName({name:query}).then(res=>{
          	this.options3=res.data
          })
        } else {
          this.options3 = [];
        }
    	},
    	//查询在职和离职人数
    	getCount(){
    		inplaceCount(this.organizationId?this.organizationId:0).then(res=>{
    			this.inplaceNum=res.data
    		})
    		quitCount(this.organizationId?this.organizationId:0).then(res=>{
    			this.quitNum=res.data
    		})
    	},
    	dataClick(row){
    		this.input1=row.userName+'-'+row.realName
    		this.move.userIdFrom=row.id
    		this.dialogTableVisible2=true
    		this.getauditor(row.id)
    	},
    	submitClick(row){
    		console.log(row.id)
    		this.submitId=row.id
    		this.dialogVisible1=true
    	},
    	issubmitReviewSupplier(){
    		
    		submitReviewSupplier(this.submitId).then(res=>{
    			console.log(res)
    			if(res.data=='1'){
		    			this.$message({
			        message:'操作成功',
			        type: "success",
			       
			      })
    				this.dialogVisible1 = false
    				this.getheader()
    				this.query()
    			}else if(res.data=='0'){
    				this.$message({
			        message:'操作失败',
			        type: 'warning',
			        
			      })
    				this.dialogVisible1 = false
    			}
    			
    		})
    	},
    	handleCheckAllChange(val) {
			this.move.userDataAuthorityTypes = val ? this.cities.map(item => item.dataAuthorityType) : [];
			this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			},
    	getheader(){
    		count().then(res=>{
    			this.buttondatas=res.data
    		})
    	},
    	header_button_click(index){

    	 	this.currentPage4=1
    	 	this.buttonshow=index
    		this.requestData(index)
    	},
    	requestData(index){
    		this.routerQuery=JSON.stringify(this.$route.query)
    		let n=index?index:this.buttonshow
    		switch(n){
    			case 0:
    				this.inplace()
    			break;
    			case 1:
    				this.quit()
    			break;
    			
    		}
    	},
    	
    	
    	//在职
    	inplace(){
    		let data={
    			"organizationId":this.organizationId,
				  "departmentId": this.departmentId,
				  "id": this.userID,
				  "status": this.status,
				  "realName":this.realName,
				  "pageNum": this.currentPage4,
				  "roleId":this.$route.query.roleId?this.$route.query.roleId:'',
				  "pageSize": this.pageSize,
				}
    		inplaceList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
//  			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
    	//离职
    	quit(){
    		let data={
    			"organizationId":this.organizationId,
				  "departmentId": this.departmentId,
				  "id": this.userID,
				  "realName":this.realName,
				  "pageNum": this.currentPage4,
				  "roleId":this.$route.query.roleId?this.$route.query.roleId:'',
				  "pageSize": this.pageSize,
				}
    		
    		quitList(data).then(res=>{
    			this.pagetotal=res.data.total
    			this.tableData=res.data.items
    			console.log(res.data.items)
    		})
    		.catch(rej=>{

    		})
    	},
      handleClick(row) {
			this.$router.push({name : "Edituser", query : {editId:row.id}});
      },


      goDetail(row){
      	 this.$router.push({
          name: 'UserDetail',
          query:{
          	detailId:row.id
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val
        this.query()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4=val
        this.query()
      },
      showHelp(){
        this.isShow=!this.isShow;
      }

    }
  }
</script>
<style scoped lang="less">
  .userBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .el-button {
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
        .popverBumen{
        	display: inline-block; 
        	width: 200px;
        	height: 38px;
        	border: 1px solid #dcdfe6;
        	border-radius: 5px;
        	background-color: #FFFFFF;
        	margin: 5px;
        	position: relative;
        	&:hover{
        		cursor: pointer;
        		border-color:#c0c4cc ;
        	}
        	
        	i{
        		position: absolute;
        		right: 10px;
        		top: 12px;
        		color: #c0c4cc;
        	}
        	.aa{
        		transition: all 0.3s;
			    }
			    .go{
			    		
			        transform:rotate(-180deg);
			        transition: all 0.3s;
			    }
        }
        .bb{
        		border-color:#339999!important ;
        	}
      }
    }
    .listBox {
      font-size: 12px;
      border: 1px solid #e4e4e4;
      clear: both;
      .listBoxTop {
      	background-color: #f3f3f3;
        span {
        	line-height: 50px;
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        display: flex;
		    align-items: center;
		    height: 50px;
        .el-button {
          /*width: 80px;*/
          height: 30px;
        }
      }
    }
    .block {
      padding: 8px 0px;
    }
    .listLeftBox{
      	position: relative;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 5%;
        width: 45%;
        height:300px;
       .headerBox{
       	text-align: center;
       	z-index: 5;
         height: 35px;
         border-bottom: 1px solid #e4e4e4;
         span{
           color: red;
           line-height: 36px;
         }
       }
       .lltree{
       	width: 100%;
       	height: 263px;
       	box-sizing: border-box;
       
       	overflow: auto;
       }
      }
      .listRightBox{
      	border: 1px solid #e5e5e5;
        width: 45%;
      	height:300px;
        
        overflow: auto;
        /*padding: 0 10px;*/
        .headerBox{
        	text-align: center;
          height: 35px;
          border-bottom: 1px solid #e4e4e4;
          span{
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }
        .lltree{
       	width: 100%;
       	height: 263px;
       	box-sizing: border-box;
       
       	overflow: auto;
       }

      }
  }
</style>
<style scoped>
.returnOrderBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
