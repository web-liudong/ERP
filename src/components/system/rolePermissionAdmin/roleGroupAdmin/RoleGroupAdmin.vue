<template>
  <div class="roleGroupAdminBox"  v-if="$authorities.RoleGroup"  >
    <div class="filterBox">
      <div class="homeBoxTop">
        <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up" ></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postRoleGroupList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">分组名称：</span>
          <el-input
            placeholder="角色名称"
            v-model="query.name"
            clearable>
          </el-input>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <!--<router-link :to="{name:'CreateRoleGroup'}" target="_blank">-->
          <el-button size="small" icon="el-icon-plus" @click="addList()">添加</el-button>
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
            label="分组ID"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色分组名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="description"
            label="角色分组描述"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goUpdateRoleGroup(scope.row)" type="text" size="small">编辑</el-button>
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
          :page-size="returnData.pageSize"
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
    name: "RoleGroupAdmin",
    data() {
      return {
        returnData: {
          items: [],
          offset: '',
          pageNum: 0,
          pageSize: 0,
          total: 0,
        },
        //查询
        query: {
          name: "",
          pageNum: 1,
          pageSize: 10
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
    computed: {

      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }

    },
    created() {
      this.postRoleGroupList();

    },
    mounted() {
      //this.postAccreditAddLog();
    },
    activated(){
      if(this.$route.params.isUpdate){
        this.postRoleGroupList();
      }
    },
    methods: {
      //重置
      goReset(){
        this.query.name = '';
        this.postRoleGroupList();
      },
      //添加
      addList(){
        this.$router.push({path: '/system/rolepermissionadmin/createrolegroup'});
      },
      //获取列表
      postRoleGroupList(name){
        postRoleGroupList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //跳转编辑
      goUpdateRoleGroup(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'UpdateRoleGroup',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/system/rolepermissionadmin/updaterolegroup',query: { Id: row.id}});
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postRoleGroupList(this.query);
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postRoleGroupList(this.query);
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
  .roleGroupAdminBox {
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
          width: 80px;
          height: 30px;
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
  .roleGroupAdminBox .el-dialog__body {
    padding-top: 0px;
  }
</style>
