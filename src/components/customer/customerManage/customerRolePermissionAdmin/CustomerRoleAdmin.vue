<template>
  <div class="roleAdminBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up" ></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postCustomerRoleList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">角色名称：</span>
          <el-autocomplete
            style="width: 200px"
            class="inline-input"
            v-model="query.name"
            :fetch-suggestions="postCustomerRoleOptionss"
            placeholder="角色名称"
            :trigger-on-focus="false"
          ></el-autocomplete>

          <span style="margin-left:20px;">角色ID：</span>
          <el-input
            placeholder="角色ID"
            v-model="query.id"
            clearable>
          </el-input>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <el-button size="small" icon="el-icon-plus" @click="goCustomerCreateRole()">添加</el-button>
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
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
            show-overflow-tooltip
            prop="description"
            label="角色描述"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goCustomerRoleDetail(scope.row)"
                         type="text" size="small">详情</el-button>
              <el-button @click="goCustomerUpdateRole(scope.row)"
                         v-if="$authorities.CustomerRoleFunctionAdmin"
                         type="text" size="small">编辑</el-button>
              <el-button @click="goCustomerRoleFunctionAdmin(scope.row)"
                         v-if="$authorities.CustomerRoleFunctionAdmin"
                         type="text" size="small">设置权限</el-button>
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
    name: "CustomerRoleAdmin",
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
          customerId: this.$route.query.id,
          id: "",
          name: "",
          pageNum: 1,
          pageSize: 10,
          type:1
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
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    activated(){
      if(this.$route.params.isUpdate){
        this.postCustomerRoleList();
      }
    },
    created() {
      this.postCustomerRoleList();

    },
    mounted() {
      //this.postAccreditAddLog();
    },
    methods: {
      reset() {
        this.query = {
          customerId: this.$route.query.id,
          id: "",
          name: "",
          pageNum: 1,
          pageSize: 10,
          type:1
        },
          this.postCustomerRoleList();
      },
      //
      postCustomerRoleOptionss(queryString, cb){
        postCustomerRoleList(
          {
            customerId: this.$route.query.id,
            id: "",
            name: queryString,
            pageNum: 1,
            pageSize: 10000,
            type:1
          }
        ).then((res) => {
          let arr=[];
          for (var i=0; i<res.data.items.length;i++){
            arr.push({"value":res.data.items[i].name})
          }
          cb(arr)
        }).catch(err => {
          console.log(err)
        });
      },
      //获取客户角色列表
      postCustomerRoleList(name){
        postCustomerRoleList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //go添加
      goCustomerCreateRole(row) {
        this.$router.push({
          name: 'CustomerCreateRole',
          query: {
            id:this.$route.query.id,
          }
        });
      },

      //跳转设置权限
      goCustomerRoleFunctionAdmin(row) {
        // console.log(row.id);
         this.$router.push({
          name: 'CustomerRoleFunctionAdmin',
          query: {
            id: row.id,
            groupName:row.name
          }
        });
      },
      //跳转详情
      goCustomerRoleDetail(row) {
        // console.log(row.id);
        this.$router.push({
          name: 'CustomerRoleDetail',
          query: {
            id: row.id
          }
        });
      },
      //跳转编辑
      goCustomerUpdateRole(row) {
        // console.log(row.id);
        this.$router.push({
          name: 'CustomerUpdateRole',
          query: {
            id: row.id,
            customerId: this.$route.query.id,
          }
        });
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postCustomerRoleList(this.query);
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postCustomerRoleList(this.query);
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
        /*width: 160px;*/
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
          color: #BCBCBC;
          cursor: pointer;
          font-size: 12px;
        }
        span:hover {
          color: #303133;
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
  .roleAdminBox .el-dialog__body {
    padding-top: 0px;
  }
</style>
