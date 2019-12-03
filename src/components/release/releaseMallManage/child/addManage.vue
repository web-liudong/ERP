<template>
  <el-dialog :visible.sync="visible" title="协同运营者" class="dialogs" width= "650px">
    <div class="addman">
      <el-button type="primary" class="addman" @click="addMan">增加协同管理者</el-button>
    </div>
    <div class="box">
      <el-row :gutter="10" class="rows" v-for="(item,index) in nameList" :key="index">
        <el-col :span="4" style="text-align: center;line-height: 40px">运营者：</el-col>
        <el-col :span="8">
          <el-select
          v-model="item.userName"
          remote
          filterable
          clearable
          placeholder="请选择账号"
          :remote-method="querySearch"
          :loading="loading"
          @change="(val) => {changeList(val,index)}"
          >
          <el-option
          v-for="(opt,index) in remoteNameList"
          :key="index+opt.userName"
          :label="opt.userName"
          :value="opt">
          </el-option>
          </el-select>
        </el-col>
        <el-col :span = "8">
          <el-input v-model="item.realName" disabled></el-input>
        </el-col>
        <el-col :span = "4">
          <el-button type="danger" @click="delMan(index)">删除</el-button>
        </el-col>
      </el-row>
    </div>

    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveForm()">保 存</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
  </el-dialog>
</template>

<script>
import {
  getCooperators,
  addCooperators,
  simpleList
} from "@/api/brandManage";
export default {
  name: "",
  data() {
    return {
      visible: false,
      loading: false,
      nameList: [],
      userIds: [],
      remoteNameList: [],
      MallCooperatorParam: {
        mallId: "", //商城id
        userIds: [] //协作人id
      }
    };
  },
  methods: {
    init(id) {
      this.MallCooperatorParam.mallId = id;
      this.userIds = [];
      this.visible = true;
      this.getCooperators();
    },
    getCooperators() {
      getCooperators(this.MallCooperatorParam.mallId).then(res => {
        console.log(res,'9009');
        if (!res.data) return false;
        this.nameList = res.data.map(val => {
          let obj = {
            id: val.id,
            userName: val.userName,
            realName: val.realName,
          }
          return obj;
        })
        console.log(this.nameList,'8080');
      })
    },
    querySearch(query) {
      if (query !== '') {
        this.loading = true;
        simpleList({userName: query}).then(res => {
          console.log(res,'0000');
          this.remoteNameList = res.data;
          this.loading = false;
        })
      } else {
        this.remoteNameList = [];
      }
    },
    changeList(val,index) {
      if (!val) return false;
      let obj = {
        id: val.id,
        userName: val.userName,
        realName: val.realName,
      }
      this.$set(this.nameList,index,obj)
    },
    addMan() {
      this.nameList.push({
        id: null,
        userName: null,
        realName: null,
      })
    },
    delMan(index) {
      this.nameList.splice(index,1);
    },
    saveForm() {
      this.nameList.forEach(val => {
        if (val.id) {
          this.userIds.push(val.id);
        }
      })
      if (this.userIds.length == 0) {
        this.$message({
          message: "至少选择一位协同运营者",
          type: "error"
        });
        return false;
      }
      console.log(this.userIds,'7777');
      addCooperators({
        mallId: this.MallCooperatorParam.mallId,
        userIds: Array.from(new Set(this.userIds))
      }).then(res => {
        this.visible = false,
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
    }
  }
};
</script>

<style lang='less' scoped>
.dialogs {
  .addman {
    display: flex;
    flex-direction: row-reverse;
    margin: 10px;
    border-bottom: 1px solid #ccc;
  }
  .box {
    height: 210px;
    width: 90%;
    margin: 20px auto;
    overflow: auto;
    .rows {
      display: flex;
      border: 1px solid #ccc;
      margin-left: 0 !important;
      margin-right: 0 !important;
      padding: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>


<style lang="less" scoped>
.el-dialog__header {
  background: #ccc;
  height: 30px;
  font-weight: 800;
}
.el-dialog__body {
  padding: 0;
}
.el-dialog__footer {
  display: flex;
  justify-content: center;
  .el-button {
    width: 120px;
  }
}
</style>
