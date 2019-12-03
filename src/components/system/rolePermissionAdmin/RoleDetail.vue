<template>
  <div class="detaillBox" v-if="$authorities.RoleDetail">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="iconfont iconcaidan"></i>&nbsp;&nbsp;基本信息</span>
      </div>
      <table border="1" >
        <tr>
          <th>角色ID：</th>
          <td>{{detaillsTable.id}}</td>
          <th>角色名称：</th>
          <td>{{detaillsTable.name}}</td>
        </tr>
        <tr>
          <th><i>*</i>所属分组：</th>
          <td>{{detaillsTable.groupName}}</td>
          <th>角色描述：</th>
          <td>{{detaillsTable.description}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="iconfont iconcaozuoxiangqing"></i>&nbsp;&nbsp;操作详情</span>
      </div>
      <el-table
        :data="logData"
        border
        stripe
        style="width: 90%"
        size="small">
        <el-table-column
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          style="width: 33%"
          align="center">.
          <template slot-scope="scope">
            <span>{{scope.row.operationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>
      <el-button type="primary" @click=" close({name:'RoleDetail', to: {name:'RoleAdmin', params:{isUpdate:true}}});">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
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
    postRoleList,
    getRoleLogs
  } from '@/api/system/rolePermissionAdmin'

  export default {
    name: "RoleDetail",
    inject:['close'],
    data() {
      return {
        OldId:'',
        msg: '',
        detaillsTable: {
          "description": "string",
          "groupName": "string",
          "id": 0,
          "name": "string",
          "roleGroupId": 0,
          "userCount": 0
        },
        tableDataMis: {
          code: '',
          data: '',
          message: '',
          success: '',
          id: '1000001',
          name: '清华同方',
          address: '同方股份有限公司',
          brandstatus: '草稿 审核情况 '
        },
        logData:null,
      }
    },
    computed: {
      loading() {
        return this.$store.getters.loading
      },
    },
    created(){
      this.getRoleLogs();
      this.getRoleDetail();
    },
    activated(){
      if(this.OldId != this.$route.query.Id){
        this.getRoleLogs();
        this.getRoleDetail();
      }
    },
    mounted() {
      //请求详情数据  this.$route.query.Id（路由传递的id）


    },
    methods: {
      getRoleLogs(){
        this.OldId = this.$route.query.Id;
        getRoleLogs(this.$route.query.Id)
          .then((res) => {
            console.log(res)
            this.logData = res.data;
            console.log(this.logData);
          }).catch(err => {
          console.log(err)
        })
      },
      getRoleDetail(){
        getRoleDetail(this.$route.query.Id)
          .then((res) => {
            console.log(res)
            this.detaillsTable = res.data;
            console.log(this.detaillsTable);
          }).catch(err => {
          console.log(err)
        })
      },
      //关闭当前页面
      // close(){
      //   window.opener=null;
      //   window.close()
      // },
    },
    watch: {},
    filters: {
      //时间截取字符串
      formatDate: function (value) {
        return value.substring(0, 10);
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .detaillBox {
    width: 100%;
    padding-top: 10px;
    .detaillTable {
      border: 1px solid #d1d1d1;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {
            font-size: 14px;
          }
        }
      }
      table {
        width: 90%;
        margin: 20px auto;
        td, th {
          border: 1px solid #d1d1d1;
          font-size: 12px;
          height: 53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th {
          background: #f5f7fa;
          color: #303133;
          text-align: right;
          width: 20%;
          i {
            color: red;
          }
        }
        td {
          color: #666666;
          text-align: left;
          padding-left: 10px;
          width: 30%;
        }
      }
    }
    .detaillTable2 {
      border: 1px solid #d1d1d1;
      border-top: none;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-table {
        margin: 20px auto;
        width: 90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: right;
        margin: 10px 20px;
      }
    }
  }


</style>
