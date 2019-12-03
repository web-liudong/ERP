<template>
	<el-form :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
<div class="aBox">
  <addhead headname="用户基本信息"></addhead>
  <el-form label-width="150px" :model="form" :rules="rules" ref="form">
    <el-form-item prop="userName" label="登录名：">
       <el-input v-model="form.userName" disabled></el-input>
    </el-form-item>
    <el-form-item prop="falsepassword" label="登录密码：">
       <el-input v-model="form.falsepassword"  :type="passwordType" :disabled="passwordDis"></el-input> <el-button type="primary" size="small" @click="initializationPassword()">初始化密码</el-button>
    </el-form-item>
    
    <el-form-item prop="mac" label="电脑序列号1：" >
    	<el-tooltip content="账号首次登录，自动绑定设备，电脑最多绑定两台，清空序列号后，可取消绑定" placement="bottom" effect="light">
        <el-input v-model="form.mac1"></el-input>
      </el-tooltip>
      <el-button type="primary" size="small" @click="clearMac1()">清空</el-button>
    </el-form-item>
    <el-form-item prop="mac" label="电脑序列号2：" >
       <el-input v-model="form.mac2"></el-input> <el-button type="primary" size="small" @click="clearMac2()">清空</el-button>
    </el-form-item>
    <el-form-item prop="imei" label="手机序列号：" >
       <el-input v-model="form.imei"></el-input> <el-button type="primary" size="small" @click="clearimei()">清空</el-button>
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
         	disabled
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
					   <el-input v-model="item.departmentName" style="width: 200px;" readonly placeholder="请选择部门" slot="reference" @blur="item.visible = !item.visible" @focus="inputFocus(index)"></el-input>
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
    <el-button type="primary" @click="submitForm('form')" style="margin-left: 120px;" v-if="$authorities.UserCreate||$authorities.UserUpdate">保存</el-button>
    <el-button @click="dialogVisibleclose=true">取消</el-button>
  </el-form-item>
  <el-dialog
		  title="取消确认"
		  :visible.sync="dialogVisibleclose"
		  width="30%"
		  >
		  <span>取消后，当前填写的信息将不保存，确定取消</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisibleclose = false">取 消</el-button>
		    <el-button type="primary" @click="cancelOpa()">确 定</el-button>
		  </span>
</el-dialog>
  </el-form>
</div>
</el-form>
</template>

<script>
	import {putUser,
					listName,
					departmentTree,
					detailData
	} from '@/api/userService'
  import addhead from '@/components/common/head/head'
  export default {
    inject:['close'],
    name: 'Edituser',
    data() {
    		var validatelogin= (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入登录名'));
        } else if(/^[0-9a-zA-Z_]{1,}$/.test(value)){
          
          callback();
        }else{
        	 callback(new Error('登录名只能包含数字，字母和"_"'));
        }
      };
       
      var validatePass = (rule, value, callback) => {      	
        if(/^[\w]{6,16}$/.test(value)){
      		callback();
      	}else{
      		callback(new Error('密码仅支持数字字母下划线6-16位'));
      	}
      };
      var validatePhone = (rule, value, callback) => {      	
        if (/^1[3|4|5|8|7|6|9][0-9]\d{4,8}$/.test(value)) {
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
      	passwordDis:true,
      	passwordType:'password',
        form:{
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
          userPosts:[{organizationId:'',departmentId:'',post:'',departmentName:'',visible:false}],
        },
        comindex:0,
        treeData:[],
        visible:false,
        options4:[],
        rules:{
          userName: [
            { required: true,validator: validatelogin, trigger: 'blur'},
          ],
          falsepassword: [
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
          mac: [
            { required: false,trigger: 'blur'},
          ],
          
          
        },
        defaultProps: {
          children: 'departmentTreeDTOList',
          label: 'name'
        },
        editId:''
      };
    },
    components:{
      addhead
    },
    created(){
      this.getUserData()
    },
    activated(){
    	if(this.editId){
    		if(this.$route.query.editId!=this.editId){
    			this.getUserData()
    		}
    	}
    },
    watch:{
    	visible(a,b){
    		console.log(a)
    	},
    	'form.falsepassword':{
    		handler:function(a,b){
    			if(b){
    				this.form.password=a
    				console.log(this.form.password)
    			}
    		}
    	}
    	
    },
    methods: {
    	initializationPassword(){
    		this.$confirm('确定要初始化密码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
        	this.passwordDis=false
      		this.passwordType='text'
          this.form.password='111111'
          this.form.falsepassword='111111'
        })
      },
      cancelOpa(){
        this.dialogVisibleclose = false;
        this.close();
      },
    	clearMac1(){
    		this.$confirm('清空序列号后，账号将取消与该设备的绑定，确定要清空序列号吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',

        }).then(() => {
          this.form.mac1=''
        })
    	},
    	clearMac2(){
    		this.$confirm('清空序列号后，账号将取消与该设备的绑定，确定要清空序列号吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',

        }).then(() => {
          this.form.mac2=''
        })
    	},
    	clearimei(){
    		this.$confirm('清空序列号后，账号将取消与该设备的绑定，确定要清空序列号吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',

        }).then(() => {
          this.form.imei=''
        })
    	},
    	getUserData(){
        this.editId = this.$route.query.editId;
    		detailData(this.$route.query.editId).then(res=>{
    			this.form=res.data
    			this.$set(this.form,'falsepassword','111111')
    			this.options4=[{
    				name:res.data.userPosts[0].organizationName,
    				id:res.data.userPosts[0].organizationId
    			}]
    		})
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
    		departmentTree(this.form.userPosts[index].organizationId).then(res=>{
    			this.treeData=res.data
    		})
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
    			this.form.userPosts[index].departmentName=''
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
      	let a={organizationId:'',departmentId:'',post:'',departmentName:'',visible:false}
      	
      	this.form.userPosts.push(a)
      },
      deleterow(){
      	this.form.userPosts.pop()
      },
      handleNodeClick(a){
      	let b=this.comindex
      	this.form.userPosts[b].departmentId=a.id
      	this.form.userPosts[b].departmentName=a.name
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            putUser(this.form).then(res=>{
            	if(res.code=='000000'){
            		this.$message({
					        message:'操作成功',
					        type: "success",
					      })
                this.close({name:'Edituser', to: {name:'SystemList', params:{isUpdate:true}}});
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
