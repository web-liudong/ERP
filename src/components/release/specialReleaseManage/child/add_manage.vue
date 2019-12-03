<template>
  <el-dialog title="协同运营者" :visible.sync="isShow" width="650px">
    <div class="add-head">
      <div class="button-head" @click="addManager">
        <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>增加协同管理者
      </div>
    </div>
    <div class="box">
      <el-row :gutter="10" v-for="(item,index) in manageList" :key="index">
        <el-col :span="4" style="text-align:center;line-height:40px;">运营者：</el-col>
        <el-col :span="10">
          <el-select
            v-model="item.info"
            value-key="id"
            filterable
            remote
            placeholder="请选择账号"
            :remote-method="querySearch"
            @change="(val)=>{
              changeManage(val, index)
            }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="opt in remoteList"
              :key="opt.id+index"
              :label="opt.userName"
              :value="opt"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input v-model="item.realName" :disabled="true"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button @click="delManager(index)">删 除</el-button>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm()">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import addhead from "@/components/common/head/head";
import { simpleList } from "@/api/projectController/projectController";
import {
  getCollaborationors,
  saveCollaborationors
} from "@/api/release/specialProjectManage";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      shoppeId: "",
      remoteLoading: false,
      remoteList: [],
      manageList: [],
      userIds: []
    };
  },
  mounted() {},
  methods: {
    init(data) {
      this.clearData();
      this.shoppeId = data.projectId;
      this.getData();
      this.isShow = true;
    },
    clearData() {
      this.remoteList = [];
      this.manageList = [];
      this.userIds = [];
    },
    getData() {
      getCollaborationors(this.shoppeId).then(res => {
        if (!res.data) {
          return false;
        }
        this.manageList = res.data.map(val => {
          let obj = {
            id: val.id,
            realName: val.realName,
            username: val.username,
            info: {
              username: val.username,
              id: val.id
            }
          };
          return obj;
        });
        this.remoteList = this.manageList.slice(0);
      });
    },
    addManager() {
      this.manageList.push({
        info: null
      });
    },
    delManager(index) {
      this.manageList.splice(index, 1);
    },
    changeManage(source, index) {
      if (!source) return false;
      let obj = {
        info: {
          username: source.username,
          id: source.id
        },
        id: source.id,
        username: source.username,
        realName: source.realName
      };
      this.$set(this.manageList, index, obj);
    },
    querySearch(query) {
      if (query !== "") {
        this.remoteLoading = true;
        simpleList({ userName: query }).then(res => {
          this.remoteList = res.data
          this.remoteLoading = false;
        });
      } else {
        this.remoteList = [];
      }
    },
    submitForm() {
      this.manageList.forEach(val => {
        if (val.id) {
          this.userIds.push(val.id);
        }
      });
      // if (this.userIds.length == 0) {
      //   this.$message({
      //     message: "至少选择一位协同运营者",
      //     type: "error"
      //   });
      //   return false;
      // }
      saveCollaborationors(this.shoppeId, {
        userIds: Array.from(new Set(this.userIds))
      }).then(res => {
        this.isShow = false;
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    }
  }
};
</script>
<style scoped lang="less">
.add-head {
  width: 100%;
  height: 40px;
  background-color: #f3f3f3;
  text-align: right;
  .button-head {
    width: 150px;
    height: 30px;
    margin-right: 10px;
    margin-top: 4px;
    border: 1px solid #d1d1d1;
    cursor: pointer;
    background-color: #fff;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    display: inline-block;
    .button-head-icon {
      margin-right: 5px;
    }
    .icon-add {
      font-size: 12px;
    }
  }
}
.button-head:hover {
  color: #339999;
  border-color: #c2e0e0;
  background-color: #ebf5f5;
}
.el-row {
  margin: 20px 0;
}
.el-select {
  width: 100%;
}
.box {
  height: 260px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>