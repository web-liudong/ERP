<template>
  <div class="roleAdminBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up" ></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postRoleList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">角色名称：</span>
          <el-input
            placeholder="角色名称"
            v-model="query.name"
            clearable>
          </el-input>
          <span style="margin-left:20px;">角色ID：</span>
          <el-input
            placeholder="角色ID"
            v-model="query.id"
            clearable>
          </el-input>
          <span style="margin-left:20px;">角色分组：</span>
          <el-input
            placeholder="角色分组"
            v-model="query.groupName"
            clearable>
          </el-input>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <!--<router-link :to="{name:'RoleGroupAdmin'}"  v-if="$authorities.RoleGroup"  target="_blank">-->
          <el-button size="small" @click="RoleGroupAdmin()" v-if="$authorities.RoleGroup"><i class="icon iconfont iconjiaosefenzuxinxi"></i>&nbsp;角色分组</el-button>
          <!--</router-link>-->
          <!--<router-link :to="{name:'CreateRole'}"  v-if="$authorities.RoleCreate" target="_blank">-->
          <el-button size="small" icon="el-icon-plus" @click="CreateRole()" v-if="$authorities.RoleCreate">添加</el-button>
          <!--</router-link>-->
        </div>
        <el-table
          :data="returnData.items"
          :max-height="dataListHeight"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="id"
            label="角色ID"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="所属分组"
            align="center">
          </el-table-column>
          <el-table-column
            prop="description"
            label="角色描述"
            :show-overflow-tooltip="true"
            align="center">
          </el-table-column>
          <el-table-column
            label="相关"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goSystemList(scope.row)" type="text" size="small">人员{{scope.row.userCount}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goRoleDetail(scope.row)"
                         v-if="$authorities.RoleDetail"
                         type="text" size="small">详情</el-button>
              <el-button @click="goUpdateRole(scope.row)"
                         v-if="$authorities.RoleUpdate"
                         type="text" size="small">编辑</el-button>
              <el-button @click="goRoleFunctionAdmin(scope.row)"
                         v-if="$authorities.RolePermissionAdmin"
                         type="text" size="small">设置操作权限</el-button>
              <!--<el-button @click="goPermissionAdmin(scope.row)"-->
                         <!--v-if="$authorities.RolePermissionData"-->
                         <!--type="text" size="small">设置查看权限</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total">
        </el-pagination>
      </div>
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
    inject: ['reload'],
    name: "RoleAdmin",
    data() {
      return {
        returnData: {
          items: [],
          offset: '',
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        //查询
        query: {
          groupName: "",
          id: "",
          name: "",
          pageNum: 1,
          pageSize: 10,
        },
        //删选显示
        isShow: true,
        //表格数据
        tableData: [{
          "description": "string",
          "groupName": "string",
          "id": 0,
          "name": "string",
          "roleGroupId": 0,
          "userCount": 0
        }],
        //翻页
        currentPage: 1,
      }
    },

    created() {
      this.postRoleList();

    },
    activated(){
      if(this.$route.params.isUpdate){
        this.postRoleList();
      }
    },
    mounted() {
      //this.postAccreditAddLog();
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    methods: {
      CreateRole(){

        this.$router.push({path: '/system/rolepermissionadmin/createrole'});
      },
      RoleGroupAdmin(){
        this.$router.push({path: '/system/rolepermissionadmin/rolegroupadmin'});
      },
      //重置
      goReset(){
        this.query.name = '';
        this.query.id = '';
        this.query.groupName = '';
        this.postRoleList();
      },

      //获取列表
      postRoleList(name){
        postRoleList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //跳转人员/用户管理
      goSystemList(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'SystemList',
        //   query: {
        //     roleId: row.id,
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/system/systemindex/systemList', query: { roleId: row.id}});
      },
      //跳转设置查看权限
      goPermissionAdmin(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'PermissionAdmin',
        //   query: {
        //     Id: row.id,
        //     name:row.name
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/system/rolepermissionadmin/PermissionAdmin', query: { Id: row.id,name:row.name}});
      },
      //跳转设置权限
      goRoleFunctionAdmin(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'RoleFunctionAdmin',
        //   query: {
        //     Id: row.id,
        //     name:row.name
        //   }
        // });
        // window.open(href, '_blank')
        //跳转详情
        this.$router.push({path: '/system/rolepermissionadmin/rolefunctionadmin', query: { Id: row.id,name:row.name}});
      },
      goRoleDetail(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'RoleDetail',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/system/rolepermissionadmin/roledetail', query: { Id: row.id}});
      },
      //跳转编辑
      goUpdateRole(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'UpdateRole',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({name: 'UpdateRole', query: { Id: row.id}});
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postRoleList(this.query);
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postRoleList(this.query);
      },

    },
    filters: {
      //时间截取字符串
      formatDate: function (value) {
        return value.substring(0, 10);
      }
    }
  }
</script>
<style scoped lang="less">
  .roleAdminBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .btnactive {
        background: #399;
        color: #fff;
        border: solid 1px #399;
      }
      .el-button {
        width: 160px;
        height: 30px;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop {
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        height: 48px;
        float: right;
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #333;
          cursor: pointer;
          font-size: 14px;
        }
        span:hover {
          color: #333;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {

        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 200px;
          line-height: 56px;
          margin-left: 10px;
        }
        .el-select {
          margin-left: 10px;
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
          i{
            font-size: 14px;
          }
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .el-button {
          width: 100px;
          height: 30px;
          i{
            font-size: 12px;
          }
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
          margin-left: 0px;
        }
      }
    }
    .block {
      margin-top: 10px;
      margin-right: 20px;
      text-align: right;
    }
    .dowBox {
      .dowInfo {
        margin-bottom: 20px;
        span {
          height: 40px;
          line-height: 40px;
          i {
            color: red;
          }
        }
      }
    }
  }
</style>
<style>
  .roleAdminBox .el-dialog__body {
    padding-top: 0px;
  }
</style>
