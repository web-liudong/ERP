<!--编辑分类-->
<template>
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="编辑分类"></addhead>
      <el-form :model="form" ref="form" label-width="150px" class="demo-dynamic" :rules="rules">
        <el-form-item label="层级：" required>
          <p class="hierarchy">一级</p>
        </el-form-item>
        <el-form-item prop="name" label="一级分类名称：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="administratoritem">
          <span slot="label">分类管理员账号：</span>
          <el-select
            :value="form.administratoritem.userName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="onchange"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.userName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span slot="label">分类管理员姓名：</span>
          <el-input v-model="form.administratoritem.realName" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDraft('form')" type="primary">保存至草稿</el-button>
          <el-button type="primary" @click="addReview('form')">保存并提交审核</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import addhead from "@/components/common/head/head";
import {
  update1,
  updateSubmit1,
  classinfo1,
  simplelist,
  checkNameLevel
} from "@/api/classManage";
import { setTimeout } from "timers";
export default {
  inject: ["close"],
  name: "CategoryUpdate1",
  data() {
    var checkName = (rule, value, callback) => {
      var reg = /^[^"'”“‘’]+$/;
      if (!reg.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else if (value !== this.flagname) {
        checkNameLevel({
          level:1,
          name:value
        }).then(res => {
          if (res.code == "000000") {
            callback();
          }
        });
      } else if (value == this.flagname) {
        callback();
      }
    };
    return {
      flagname:'',
      id: 0,
      options: [],
      form: {
        name: "",
        id: null,
        administratoritem: {}
      },
      rules: {
        name: [
          { required: true, message: '分类名字不能为空', trigger: 'blur' },
          { min:1, max:20, message: '长度在 1 到 20 个字', trigger: 'blur' },
          { validator: checkName, trigger: "blur" }
        ],
        administratoritem: [
          { required: true, message: "请选择管理员", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    addhead
  },
  activated() {
    this.id = this.$route.query.id;
    this.getDetail(this.id);
  },
  methods: {
    remoteMethod(query) {
      simplelist({
        count: 6,
        userName: query
      }).then(res => {
        if (res.code == "000000") {
          this.options = res.data;
        }
      });
    },
    onchange(val) {
      this.form.administratoritem = val;
    },
    getDetail(id) {
      classinfo1(id).then(res => {
        if (res.code == "000000") {
          this.form.name = res.data.name;
          this.flagname = JSON.stringify(res.data.name);
          this.form.id = res.data.id;
          this.form.administratoritem.userName =
            res.data.userDataAuthorityAccount;
          this.form.administratoritem.realName = res.data.userDataAuthorityName;
          this.form.administratoritem.id = res.data.managerUserId;
        }
      });
    },
    addDraft(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          update1(that.id, {
            name: that.form.name,
            managerUserId: that.form.administratoritem.id
          }).then(res => {
            if (res.code == "000000") {
              if (res.data == 1) {
                this.$message({
                  message: "分类编辑成功，添加至草稿",
                  type: "success"
                });
                this.close({
                  name: "CategoryUpdate1",
                  to: { name: "Category1", params: { isUpdate: true } }
                });
              } else {
                this.$message({
                  message: "操作失败",
                  type: "error"
                });
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    addReview(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateSubmit1(that.id, {
            name: that.form.name,
            managerUserId: that.form.administratoritem.id
          }).then(res => {
            if (res.code == "000000") {
              if (res.data == 1) {
                this.$message({
                  message: "分类编辑成功，并提交审核",
                  type: "success"
                });
                this.close({
                  name: "CategoryUpdate1",
                  to: { name: "Category1", params: { isUpdate: true } }
                });
              } else {
                this.$message({
                  message: "操作失败",
                  type: "error"
                });
              }
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.addSecond {
  .footerBox {
    margin: 40px 0 0 0;
    position: relative;
    border: 1px solid #e4e4e4;
    .el-input {
      height: 30px;
      width: 400px;
    }
    .el-form {
      padding: 20px 50px;
      .el-form-item {
        .deleteBox {
          margin-left: 10px;
        }
        .hierarchy {
          color: red;
        }
      }
    }
  }
}
</style>
