<template>
  <div class="redactBox"  v-if="$authorities.RoleGroup"  >
    <div class="redactTable">
      <div class="redactTopBox">
        <span><i></i>角色基本信息</span>
      </div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="角色组名称：" prop="name">
          <el-input v-model="addData.name" placeholder="请输入角色组名称"></el-input>
        </el-form-item>
        <el-form-item label="角色组描述：" prop="description">
          <el-input type="textarea" v-model="addData.description" maxlength="100" placeholder="请输入100字以内"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>
<script>
  import {
    postCreateRole,
    putUpdateRole,
    getRoleDetail,
    deleteRoleDelete,
    getRoleAuthorities,
    postRoleAuthorities,
    postCreateRoleGroup,
    putUpdateRoleGroup,
    getRoleGroupDetail,
    postRoleGroupList,
    getRoleGroupRoles,
    postRoleList
  } from '@/api/system/rolePermissionAdmin'
  export default {
    name:'CreateRoleGroup',
    inject:["close"],
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入角色组名称'));
        }
        var reg =/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('不能包含特殊字符'));
        } else {
          if (value.length > 10) {
            callback(new Error('不能超过10个字'));
          } else {
            callback();
          }
        }
      };
      return {
        addData: {
          name:'',
          description: '',
          sort: 2
        },
        rules: {
          name: [
            {validator: checkName, trigger: 'change'}
          ],
        }
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      //获取
      postSupplierOptionss(name){
        postSupplierOptions(
          name
        ).then((res) => {
          console.log(res)
          //this.detaillsTable = JSON.parse(res.data);
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //提交编辑
      putAccreditRedact() {
        console.log(this.$route.query.Id)
        putAccreditRedact(
          this.$route.query.Id,
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            this.close({name:'CreateRoleGroup', to: {name:'RoleGroupAdmin', params:{isUpdate:true}}});
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning',
            })
          }
          console.log(res)
          //this.detaillsTable = JSON.parse(res.data);
          console.log(res);
        }).catch(err => {
          console.log(err)
        })
      },
      //添加
      postCreateRoleGroup(data) {
        postCreateRoleGroup(
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            this.close({name:'CreateRoleGroup', to: {name:'RoleGroupAdmin', params:{isUpdate:true}}})
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning',
            })
          }
          console.log(res)
          //this.detaillsTable = JSON.parse(res.data);
          //console.log(res.data);
        }).catch(err => {
          console.log(err)
        });
      },
      //提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.addData);
            this.postCreateRoleGroup();
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
