
<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
<div class="editerparameterBox">
  <addhead headname="添加参数"></addhead>
  <el-form label-width="200px" :model="ruleForm" :rules="rules" ref="form">
    <el-form-item label="参数模板所属分类：">
      <div style="color: red;">{{name}}</div>
    </el-form-item>
    <el-form-item label="参数名称：" prop="name">
      <el-input v-model="ruleForm.name" placeholder="字数长度1~10以内"></el-input>
    </el-form-item>
    <el-form-item label="所属参数组：" prop="groupname">
      <el-select v-model="ruleForm.groupname" placeholder="请选择">
        <el-option
          v-for="item in ruleForm.group"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="参数是否必填：" prop="requir">
      <el-radio-group v-model="ruleForm.requir">
        <el-radio label="true">是</el-radio>
        <el-radio label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="参数值类型：" prop="type">
      <el-radio-group v-model="ruleForm.type">
        <el-radio label="1">单行文本录入</el-radio>
        <el-radio label="2">多行文本录入</el-radio>
        <el-radio label="3">下拉列表</el-radio>
        <el-radio label="4">单选按钮组</el-radio>
        <el-radio label="5">多选框</el-radio>
        <el-radio label="6">日历</el-radio>
        <el-radio label="0">数字</el-radio>
        <el-radio label="7">上传文件</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-if="ruleForm.type==1||ruleForm.type==2||ruleForm.type==0">
      <el-form-item label="参数值允许最大长度：" prop="maxLength">
        <el-input  v-model="ruleForm.maxLength" placeholder="请输入1-999内整数" type="number" max="1000">
          <template slot="append">字</template>
        </el-input>
      </el-form-item>
    </div>
    <div>
      <el-form-item label="后缀：" prop="options" v-if="ruleForm.type==0">
        <el-input  v-model="ruleForm.options"></el-input>
      </el-form-item>
    </div>

    <div v-if="ruleForm.type==3||ruleForm.type==4||ruleForm.type==5">
      <el-form-item label="添加选项值：" prop="options">
        <el-input  v-model="ruleForm.options" placeholder="可同时输入多个选项值，选项值之间用逗号分隔~" type="textarea" autosize>
        </el-input>
      </el-form-item>
    </div>
    <div v-if="ruleForm.type==6">
      <el-form-item label="日历类型：" prop="options">
        <el-radio-group v-model="ruleForm.options">
          <el-radio label="1">显示年</el-radio>
          <el-radio label="2">显示年月</el-radio>
          <el-radio label="3">显示年月日</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div v-if="ruleForm.type==7">
      <el-form-item label="上传文件格式：">
        <!--<el-checkbox-group v-model="ruleForm.checkbox">
          <el-checkbox label="全部"></el-checkbox>
          <el-checkbox label="JPG"></el-checkbox>
          <el-checkbox label="PNG"></el-checkbox>
          <el-checkbox label="JPEG"></el-checkbox>
          <el-checkbox label="PDF"></el-checkbox>
        </el-checkbox-group>-->
         <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="ruleForm.checkbox" @change="handleCheckedCitiesChange" style="display: inline-block;">
			    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
			  </el-checkbox-group>
      </el-form-item>
      <el-form-item label="上传文件大小：" prop="maxLength">
          <el-input  v-model="ruleForm.maxLength" type="number">
            <template slot="append">M</template>
          </el-input>
      </el-form-item>
    </div>
    <div >
      <!--<el-form-item label="排序值：" prop="sort">
        <el-input v-model="ruleForm.sort" placeholder="数字越小,顺序越靠前~"></el-input>
      </el-form-item>-->
    </div>
    <el-form-item style="margin-top: 20px">

      <el-button type="primary" @click="add('form')">继续添加参数</el-button>
      <el-button type="primary" @click="saveDraft('form')">保存至草稿</el-button>
      <el-button type="primary" @click="addreview('form')">保存并提交审核</el-button>
    </el-form-item>
  </el-form>


</div>
</el-form>
</template>

<script>
  import addhead from '@/components/common/head/head'
  import {getDetail,} from '@/api/parameter'
//  import './SupplierList.less'
  import {categorylist,addcategory} from '@/api/templateManage'
  import {template} from '@/api/classManage'
  export default {
  	inject:['close'],
  	name:'AddParameter',
    data() {
    	var validatelogin= (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入参数名'));
        } else if(/\\+|\“+|\”+|\‘+|\’+|\'+|\"+/g.test(value)){
          callback(new Error('有违规符号（引号、斜线），请重新填写'));
        }else if(value.length>20){
          callback(new Error('最大长度20字符'));
        }else{
        	 callback();
        }
      };
      return {
      	checkedCities:[],
      	isIndeterminate: true,
      	checkAll: false,
      	cities:['JPG','PNG','JPEG','PDF'],
        id:10,
        name:'',
        ruleForm: {
          group:[],
          groupname:'',
          requir:null,
          type:null,
          name: '',
          maxLength:null,
          options:null,
          checkbox:[],
        },
        rules: {
          name: [
            { required: true, validator: validatelogin, trigger: 'blur' },
          ],
          groupname: [
            {  required: true, message: '请选择参数组', trigger: 'blur' },
          ],
          requir: [
            {  required: true, message: '请选择是否必填', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请选择一种类型'}
          ],
          maxLength: [
            { required: true, message: '请设置最大值'}
          ],
        }
      };
    },
    components:{
      addhead
    },
    created(){
      var that = this;
      this.id = this.$route.query.id;
      this.name = this.$route.query.threeName;
      this.getlist(that.id);
    },
    methods: {
    	handleCheckAllChange(val) {
    		console.log(val)
        this.ruleForm.checkbox = val ? this.cities : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      getlist(id){
        categorylist(id).then(res=>{
          if(res.code=='000000'){
            this.ruleForm.group = res.data;
          }
        })
      },
      add(formName) {
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addcategory({
              categoryAttributeTemplateId:that.id-0,
              groupId:that.ruleForm.groupname,
              maxLength:that.ruleForm.maxLength?that.ruleForm.maxLength-0:999,
              name:that.ruleForm.name,
              required:that.ruleForm.requir=='true'?true:false,
              valueType:that.ruleForm.type-0,
              status:0,
              options:that.ruleForm.type!=7?that.ruleForm.options:that.ruleForm.checkbox.join(',')
            }).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.$refs[formName].resetFields();
                this.id=parseFloat(res.data)
              }
            })
          } else {
            return false;
          }
        });
      },
      saveDraft(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addcategory({
              categoryAttributeTemplateId:that.id,
              groupId:that.ruleForm.groupname,
              maxLength:that.ruleForm.maxLength?that.ruleForm.maxLength-0:999,
              name:that.ruleForm.name,
              required:that.ruleForm.requir=='true'?true:false,
              valueType:that.ruleForm.type-0,
              status:0,
              options:that.ruleForm.type!=7?that.ruleForm.options:that.ruleForm.checkbox.join(',')
            }).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.close({
				        		name:'AddParameter',
				        		to:{
				        			name:'ParameterList',
				        			params:{
				        				isUpdate:true
				        			},
				        			query:{
				        				id:parseFloat(res.data)
				        			}
				        		}
				        	})
              }
            })
          } else {
            return false;
          }
        });
      },
      addreview(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addcategory({
              categoryAttributeTemplateId:that.id,
              groupId:that.ruleForm.groupname,
              maxLength:that.ruleForm.maxLength?that.ruleForm.maxLength-0:999,
              name:that.ruleForm.name,
              required:that.ruleForm.requir=='true'?true:false,
              valueType:that.ruleForm.type-0,
              status:1,
              options:that.ruleForm.type!=7?that.ruleForm.options:that.ruleForm.checkbox.join(',')
            }).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.close({
				        		name:['AddParameter','ParameterList'],
				        		to:{
				        			name:'TemplateAdmin',
				        			params:{
				        				isUpdate:true
				        			},
				        		}
				        	})
              }
            })
          } else {
            return false;
          }
        });
      },
      back(){
        this.$router.back(-1);
      },
    }
  }
</script>

<style lang="less" scoped>
.el-form{
    margin: 20px;
    color: #606266;
.editerparameterBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
   .el-form-item{
     .el-textarea{
       width: 400px;
     }
     .el-input{
       width: 400px;
       height: 40px;
     }
    .el-form-item_err{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
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
