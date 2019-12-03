<template>
  <div class="redactBox">
    <div class="redactTable">
      <div class="redactTopBox">
        <span><i class="iconfont iconjiaosejibenxinxi"></i>&nbsp;&nbsp;角色基本信息</span>
      </div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="addData.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="所属分组：" prop="roleGroupId">
          <el-select v-model="addData.roleGroupId" placeholder="请选择分组">
            <el-option
              v-for="item in roleGroupOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!--<router-link :to="{name:'CreateRoleGroup'}" target="_blank">-->
            <el-button type="primary" plain @click="addList()">添加角色分组</el-button>
          <!--</router-link>-->
        </el-form-item>
        <el-form-item label="角色描述：" prop="addressLine">
          <el-input type="textarea" v-model="addData.description"  maxlength="100" placeholder="请输入100字以内"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  v-if="$authorities.RoleUpdate" @click="submitForm('ruleForm')">提交保存</el-button>
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
    name:'UpdateRole',
    inject:["close"],
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入角色名称'));
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
        query:{
          "name": "",
          "pageNum": 1,
          "pageSize": 100000
        },
        roleGroupOptions: [],//角色分组select
        addData: {
          name:'',
          description: '',
          roleGroupId: null,
        },
        rules: {
          name: [
            {validator: checkName, trigger: 'change'}
          ],
          roleGroupId: [
            {required: true, message: '请选择所属分组', trigger: 'change'}
          ],
        }
      }
    },
    created() {
      this.postRoleGroupList();
      this.getRoleDetail();
    },
    mounted() {

    },
    methods: {
      addList(){
        this.$router.push({path: '/system/rolepermissionadmin/createrolegroup'});
      },
      //获取详情
      getRoleDetail(name){
        getRoleDetail(
          this.$route.query.Id,
        ).then((res) => {
          if (res.code == '000000') {
            this.addData.roleGroupId = res.data.roleGroupId;
            this.addData.name = res.data.name;
            this.addData.description = res.data.description;
          } else {
            this.$message({
              message: '获取信息失败',
              type: 'warning',
            })
          }
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //获取分组列表
      postRoleGroupList(name){
        postRoleGroupList(
          this.query
        ).then((res) => {
          if (res.code == '000000') {
            this.roleGroupOptions = res.data.items;
          } else {
            this.$message({
              message: '获取角色组信息失败',
              type: 'warning',
            })
          }
          console.log(res)

          console.log(this.roleGroupOptions);
        }).catch(err => {
          console.log(err)
        });
      },
      //提交编辑
      putUpdateRole() {
        console.log(this.$route.query.Id)
        putUpdateRole(
          this.$route.query.Id,
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            this.close({name:'UpdateRole', to: {name:'RoleAdmin', params:{isUpdate:true}}});
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
      postCreateRole(data) {
        postCreateRole(
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning',
            })
          }
          console.log(res)
          //this.detaillsTable = JSON.parse(res.data);
          console.log(res.data);
        }).catch(err => {
          console.log(err)
        });
      },
      //提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.putUpdateRole();
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
            font-size: 14px;
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
