<template>
	<el-form :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
<div class="aBox">
  <addhead headname="用户基本信息"></addhead>
  <el-form label-width="150px" :model="form" :rules="rules" ref="form">
    <el-form-item prop="userName" label="登录名：">
       <el-input v-model="form.userName"></el-input>
    </el-form-item>
    <el-form-item prop="password" label="登录密码：">
       <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item prop="realName" label="真实姓名：">
       <el-input v-model="form.realName"></el-input>
    </el-form-item>
    <el-form-item prop="mobile" label="手机号：">
       <el-input v-model="form.mobile"></el-input>
    </el-form-item>
    <el-form-item label="电话号码：">
       <el-input v-model="form.telephone"></el-input>
    </el-form-item>
    <el-form-item prop="email" label="邮箱：">
       <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item prop="wechat" label="微信号：">
       <el-input v-model="form.wechat"></el-input>
    </el-form-item>
    <el-form-item prop="qq" label="QQ号：">
       <el-input v-model="form.qq"></el-input>
    </el-form-item>
    <el-form-item label="职务信息" required v-for="(item,index) in form.userPosts" :key="index">
    <el-col style="width: 200px;margin-right: 10px;">
    	<el-form-item :prop="'userPosts.'+index+'.organizationId'"
      	:rules="{
            required: true, message: '所属机构组织不能为空', trigger: 'blur'
            }">
         <el-select
			    v-model="item.organizationId"
			    filterable
			    remote
			    clearable
			    reserve-keyword
			    placeholder="选择所属组织机构"
			    :remote-method="remoteMethod"
			    @change="(value)=>{
			    	organChange(value,index)
			    }"
			    @visible-change="sectishow(index)">
			    <el-option
			      v-for="it in options4"
			      :key="it.id"
			      :label="it.name"
			      :value="it.id">
			    </el-option>
			  </el-select>
      </el-form-item>
    </el-col>
    <el-col style="width: 200px;margin-right: 10px;">
      <el-form-item :prop="'userPosts.'+index+'.departmentId'"
      	:rules="{
            required: false, message: '部门不能为空', trigger: 'blur'
            }">
            <el-popover
				    placement="bottom"
				    width="180"
				    trigger="manual"
				    v-model="item.visible">
				    <div class="hidetree" style="height: 200px;overflow: auto;">
				    	<el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
				    		 default-expand-all
				    		 node-key="id"
				    		 
				    		></el-tree>
				    </div>
					   <el-input v-model="item.departmentvalue" style="width: 200px;" readonly placeholder="请选择部门" slot="reference" @blur="item.visible = !item.visible" @focus="inputFocus(index)"></el-input>
					  </el-popover>
          
      </el-form-item>
    </el-col>
    <el-col style="width: 200px;">
      <el-form-item :prop="'userPosts.'+index+'.post'"
      	:rules="{
            required: false, message: '请输入职务', trigger: 'blur'
            }">
        <el-input v-model="item.post" style="width: 200px;" placeholder="输入职务"></el-input>
      </el-form-item>
    </el-col>
    <el-col style="width: 50px;">
      <!--<el-button type="primary" @click="addrow()" v-if="index==0">新增</el-button>-->
      <el-button type="primary" v-if="index==form.userPosts.length-1&&index!=0" @click="deleterow()">删除</el-button>
    </el-col>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('form')" style="margin-left: 120px;" v-if="$authorities.UserCreate||$authorities.UserUpdate">立即创建</el-button>
    <el-button @click="dialogVisibleclose=true">取消</el-button>
  </el-form-item>
  </el-form>
</div>
<el-dialog
		  title="取消确认"
		  :visible.sync="dialogVisibleclose"
		  width="30%"
		  >
		  <span>取消后，当前填写的信息将不保存，确定取消</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisibleclose = false">取 消</el-button>
		    <el-button type="primary" @click="isclose()">确 定</el-button>
		  </span>
</el-dialog>
</el-form>
</template>

<script>
	import {addUser,
					listName,
					departmentTree,
					isAvailable
	} from '@/api/userService'
  import addhead from '@/components/common/head/head'
  export default {
  	name:'Adduser',
  	inject:['close'],
    data() {
    		var validatelogin= (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入登录名'));
        } else if(/^[0-9a-zA-Z_]{1,}$/.test(value)){
          isAvailable({userName:value}).then(res=>{
        	if(res.data){
        		callback();
        	}else{
        		callback(new Error('用户名称已存在'))
        	}
        })
        }else{
        	 callback(new Error('登录名只能包含数字，字母和"_"'));
        }
      };
       
      var validatePass = (rule, value, callback) => {      	
        if (value.length>=6&&value.length<=16) {
          callback();
        }else{
        	 callback(new Error('密码仅支持6-16位'));
        }
      };
      var validatePhone = (rule, value, callback) => {      	
        if (/^1[3|4|5|8|6|7|9][0-9]\d{4,8}$/.test(value)) {
          callback();
        }else{
        	 callback(new Error('手机号格式错误'));
        }
      };
      var validateTelephone = (rule, value, callback) => {      	
        if (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
          callback();
        }else{
        	 callback(new Error('电话号格式错误XXXX-XXXXXX'));
        }
      };
      var validateName = (rule, value, callback) => {      	
        if (value.length>=1&&value.length<=30) {
          callback();
        }else{
        	 callback(new Error('真实姓名长度1~30以内'));
        }
      };
      return {
      	dialogVisibleclose:false,
        form:{
        	imei:'',
        	mac1:'',
        	mac2:'',
          userName:'',
          password:'111111',
          realName:'',
          mobile:'',
          telephone:'',
          email:'',
          wechat:'',
          qq:'',
          userPosts:[{organizationId:'',departmentId:'',post:'',departmentvalue:'',visible:false}],
        },
        comindex:0,
        treeData:[],
        visible:false,
        options4:[],
        rules:{
          userName: [
            { required: true,validator: validatelogin, trigger: 'blur'},
          ],
          password: [
            { required: true, validator: validatePass,trigger: 'blur'},
          ],
          realName:[
            { required: true, validator: validateName,trigger: 'blur'},
          ],
          mobile: [
            { required: true, validator: validatePhone,trigger: 'blur'},
          ],
          telephone: [
            { required: true, validator: validateTelephone,trigger: 'blur'},
          ],
          email: [
            { required: false,trigger: 'blur'},
          ],
          wechat: [
            { required: false, trigger: 'blur'},
          ],
          qq: [
            { required: false,trigger: 'blur'},
          ],
          
          
        },
        defaultProps: {
          children: 'departmentTreeDTOList',
          label: 'name'
        }
      };
    },
    components:{
      addhead
    },
    created(){
      
    },
    activated(){
      if(this.$route.params.isUpdate){

      }
    },
    watch:{
    	visible(a,b){
    		console.log(a)
    	}
    },
    methods: {
    	isclose(){
    		this.dialogVisibleclose = false
    		this.close()
    	},
    	remoteMethod(query){
    		if (query !== '') {
          listName({name:query}).then(res=>{
          	this.options4=res.data
          })
        } else {
          this.options4 = [];
        }
    	},
    	sectishow(index){

    	},
    	inputFocus(index){
    		console.log(index)
    		this.comindex=index
    		this.form.userPosts[index].visible = !this.form.userPosts[index].visible
    	},
    	abc(index){
    		console.log(index)
    	},
    	//公司级下拉框点击事件
    	organChange(value,index){
    		console.log(index)
    		if(value){
    			departmentTree(value).then(res=>{
	    			this.treeData=res.data
	    		})
    		}else{
    			this.form.userPosts[index].departmentvalue=''
    			this.form.userPosts[index].departmentId=''
    			this.form.userPosts[index].post=''
    			this.treeData=[]
    		}
    	},
    	ggg(){
    		this.visible=false
    	},
    	blur(){
    		console.log(111111111)
    	},
      addrow(){
      	let a={organizationId:'',departmentId:'',post:'',departmentvalue:'',visible:false}
      	
      	this.form.userPosts.push(a)
      },
      deleterow(){
      	this.form.userPosts.pop()
      },
      handleNodeClick(a){
      	let b=this.comindex
      	this.form.userPosts[b].departmentId=a.id
      	this.form.userPosts[b].departmentvalue=a.name
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addUser(this.form).then(res=>{
            	if(res.code=='000000'){
            		this.$message({
					        message:'操作成功',
					        type: "success",
					      })
            		this.form={
            			imei:'',
				        	mac1:'',
				        	mac2:'',
				          userName:'',
				          password:'',
				          realName:'',
				          mobile:'',
				          telephone:'',
				          email:'',
				          wechat:'',
				          qq:'',
				          userPosts:[{organizationId:'',departmentId:'',post:'',departmentvalue:'',visible:false}],
            		}
            		 this.close({
				        		name:'Adduser',
				        		to:{
				        			name:'SystemList',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
            	}else{
            		this.$message({
					        message:'操作失败',
					        type: 'warning',
					      })
            	}
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

<style lang="less" scoped>
.el-tree-node__expand-icon{
		display: none;
	}
.el-form{
	
     color: #606266;
.aBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
    .el-form{
      margin-left: 50px;
      padding-top:20px;
      .el-form-item{
        
        .el-input{
          width: 400px;
          height: 40px;
        }
        .tipBox{
          height: 20px;
          font-size: 12px;
          margin-left: 20px;
        }
        /*.el-form-item_err{
          color: #f56c6c;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 0;
        }*/
    }

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
