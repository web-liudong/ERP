<template>
  <div class="redactBox">
    <div class="redactTable">
      <div class="redactTopBox">
        <span><i></i>编辑客户角色</span>
      </div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="addData.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="addressLine" >
          <el-input type="textarea" v-model="addData.description" placeholder="请输入200字以内" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="submitForm('ruleForm')">提交保存</el-button>
          <el-button type="primary" @click="close()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {
    getAuthorityTreeData,
    postCustomerRoleList,
    postCustomerRoleCreate,
    putCustomerRoleUpdate,
    getCustomerRoleDetaills,
    deleteCustomerRoledelete,
    getCustomerAuthorities,
  } from '@/api/customer/customerRoleFunctionAdmin'
  export default {
    inject:['reload','imgurl','close'],//注入依赖
    name: "CustomerUpdateRole",
    data() {
      return {
        oldId:'',
        query:{
          "name": "",
          "pageNum": 1,
          "pageSize": 100000
        },
        roleGroupOptions: [],//角色分组select
        addData: {
          name:'',
          description: '',
          type:1,
          customerId:this.$route.query.id,
          roleGroupId: null,
        },

        rules: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'change'}
          ],
          roleGroupId: [
            {required: true, message: '请选择所属分组', trigger: 'change'}
          ],
        }
      }
    },
    activated() {
      if (this.oldId!=this.$route.query.id){
        this.getCustomerRoleDetaills()
        this.oldId=this.$route.query.id;
      }
    },
    created() {
      this.oldId=this.$route.query.id;
      this.getCustomerRoleDetaills()
    },
    mounted() {

    },
    methods: {
      //获取详情
      getCustomerRoleDetaills(name){
        getCustomerRoleDetaills(
          this.$route.query.id,1
        ).then((res) => {
          console.log(res)
          this.addData.description=res.data.description
          this.addData.name=res.data.name
        }).catch(err => {
          console.log(err)
        })
      },
      //获取分组列表
      postRoleGroupList(name){
        postRoleGroupList(
          this.query
        ).then((res) => {
          console.log(res)
          this.roleGroupOptions = res.data.items;
          console.log(this.roleGroupOptions);
        }).catch(err => {
          console.log(err)
        });
      },
      //提交编辑
      putCustomerRoleUpdate() {
        putCustomerRoleUpdate(
          this.$route.query.id,
          {
            description: this.addData.description,
            name: this.addData.name,
            type:1
          }
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            this.close({
              name: 'CustomerUpdateRole',
              to: {name: 'CustomerRoleAdmin', query: {id: this.$route.query.id,}, params: {isUpdate: true}}
            });
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      //添加
      postCustomerRoleCreate(data) {
        postCustomerRoleCreate(
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            //this.$router.push({name: 'Accredit'})
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning',
            })
          }
          console.log(res.data);
        }).catch(err => {
          console.log(err)
        });
      },
      //提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.addData);
            this.putCustomerRoleUpdate();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    }
  }
</script>
<style>
  .redactBox .el-form-item__error {

  }
</style>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .redactBox {
    width: 100%;
    padding-top: 10px;
    .redactTable {
      border: 1px solid #d1d1d1;
      .redactTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        margin-bottom: 20px;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-form {
        .el-form-item {
          .label {
            margin-left: 20px;
            display: inline-block;
            width: 130px !important;
            text-align: right;
          }

          .el-input {
            width: 400px;
          }
          .el-textarea {
            width: 400px;
          }
          .el-select{
            width: 400px;
          }
          .el-time-picker {
          }

        }
      }
    }
  }


</style>
