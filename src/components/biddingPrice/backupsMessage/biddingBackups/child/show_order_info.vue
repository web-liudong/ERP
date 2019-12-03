<template>
  <el-dialog :title="resData.title" :visible.sync="isShow" width="650px" v-if="tableData">
    <div v-if="resData.type == 'projectInfo'">
      <el-row>
        <el-col :span="6">项目名称：</el-col>
        <el-col :span="18"><p class="grid-con-top">{{tableData.name}}</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">乙方项目负责人：</el-col>
        <el-col :span="18"><p class="grid-con">{{tableData.partyBPrincipal}}</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">集团项目负责人：</el-col>
        <el-col :span="18"><p class="grid-con">{{tableData.userDataAuthority}}</p></el-col>
      </el-row>
    </div>
    <div v-else-if="resData.type == 'userInfo' || resData.type == 'authUserInfo'">
      <el-row>
        <el-col :span="6">姓名：</el-col>
        <el-col :span="18"><p class="grid-con-top">{{tableData.realName}}</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">手机号：</el-col>
        <el-col :span="18"><p class="grid-con">{{tableData.mobile}}</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">电话号码：</el-col>
        <el-col :span="18"><p class="grid-con">{{tableData.telephone}}</p></el-col>
      </el-row>
      <el-row v-if="tableData.userPosts && tableData.userPosts.length">
        <el-col :span="6">职务信息：</el-col>
        <el-col
          :span="18"
        ><p class="grid-con">{{postInfo}}</p></el-col>
      </el-row>
    </div>
    <div v-else-if="resData.type == 'customerInfo'">
      <el-row>
        <el-col :span="6">客户名称：</el-col>
        <el-col :span="18"><p class="grid-con-top">{{tableData.name}}</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">乙方客户负责人：</el-col>
        <el-col :span="18"><p class="grid-con">{{tableData.userDataAuthorityName}}</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">集团客户负责人：</el-col>
        <el-col :span="18"><p class="grid-con">{{tableData.groupUserDataAuthorityName}}</p></el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import {
  getProjectOrderInfo,
  getUserInfo,
  getAuthorityUserInfo,
  getCustomerInfo
} from "@/api/order/orderManage";
import { setTimeout } from "timers";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      resData: {
        title: "",
        type: ""
      },
      tableData: null
    };
  },
  mounted() {},
  computed: {
    postInfo: function() {
      let arr = [];
      if(this.tableData.userPosts.length){
        if(this.tableData.userPosts[0].organizationName){
          arr.push(this.tableData.userPosts[0].organizationName)
        }
        if(this.tableData.userPosts[0].departmentName){
          arr.push(this.tableData.userPosts[0].departmentName)
        }
        if(this.tableData.userPosts[0].post){
          arr.push(this.tableData.userPosts[0].post)
        }
      }
      return arr.join("-");
    }
  },
  methods: {
    init(row) {
      this.reset();
      this.resData = row;
      this.isShow = true;
      this.getData();
    },
    getData() {
      if (this.resData.type == "projectInfo") {
        getProjectOrderInfo(this.resData.id).then(res => {
          this.$set(this, "tableData", res.data);
        });
      } else if (this.resData.type == "userInfo") {
        getUserInfo(this.resData.id).then(res => {
          this.$set(this, "tableData", res.data);
        });
      } else if (this.resData.type == "authUserInfo") {
        getAuthorityUserInfo(this.resData.id).then(res => {
          this.$set(this, "tableData", res.data);
        });
      } else if (this.resData.type == "customerInfo") {
        getCustomerInfo(this.resData.id).then(res => {
          this.$set(this, "tableData", res.data);
        });
      }
    },
    reset() {
      this.resData = {
        title: "",
        type: ""
      };
      this.tableData = null;
    }
  }
};
</script>
<style scoped lang="less">
.el-row {
  line-height: 40px;
  height: 41px;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #d1d1d1;
  border-top: 0;
  background-color: #f9fafc;
  &:first-child {
    border-top: 1px solid #d1d1d1;
  }
}
.el-col {
  padding: 0 10px;
  &:last-child {
    background-color: #fff;
    border-left: 1px solid #d1d1d1;
  }
  .grid-con-top{
    height: 39px;
  }
  .grid-con{
    height: 40px;
  }
}
</style>