<template>
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="添加分类" class="head-top"></addhead>
      <el-form label-width="150px">
        <el-form-item required>
          <span slot="label">层级：</span>
          <span style="color:red;">一级</span>
        </el-form-item>
      </el-form>
      <el-form label-width="150px" :rules="rules1" status-icon :model="form1" ref="form1">
        <el-form-item prop="name" label="一级分类名称：">
          <el-input v-model="form1.name" placeholder="字数长度1~20"></el-input>
        </el-form-item>
        <el-form-item prop="administratoritem">
          <span slot="label">分类管理员账号：</span>
          <el-select
            v-model="form1.managerUserId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="onchange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span slot="label">分类管理员姓名：</span>
          <el-input v-model="form1.administratorName" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDraft1('form1')" class="success" type="primary">保存至草稿</el-button>
          <el-button type="primary" @click="addReview('form1')">保存并提交审核</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  addDraft1,
  addReview1,
  selectList,
  simplelist,
  selectlist,
  checkNameLevel
} from "@/api/classManage";
export default {
  inject: ["reload"],
  name: "CategoryCreate",
  data() {
    var checkName = (rule, value, callback) => {
      var reg = /^[^"'”“‘’]+$/;
      if (!reg.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else {
        checkNameLevel({
          level: 1,
          name: value
        }).then(res => {
          if (res.code == "000000") {
            callback();
          }
        });
      }
    };
    return {
      radio: 1,
      options: [],
      options1: [],
      form1: {
        name: "",
        administratorName: null,
        managerUserId: null,
        administratoritem: {}
      },
      rules1: {
        name: [
          { required: true, message: "分类名字不能为空", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字", trigger: "blur" },
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
  methods: {
    onchange(val) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].id === val) {
          this.form1.administratorName = this.options[i].realName;
          break;
        }
      }
    },
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
    addDraft1(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addDraft1({
            name: that.form1.name,
            managerUserId: that.form1.managerUserId
          }).then(res => {
            if (res.code == "000000") {
              if (res.data == 1) {
                this.$message({
                  message: "分类已添加成功，添加至草稿",
                  type: "success"
                });
                this.reload();
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
          addReview1({
            name: that.form1.name,
            managerUserId: that.form1.managerUserId
          }).then(res => {
            if (res.code == "000000") {
              if (res.data == 1) {
                this.$message({
                  message: "分类已添加成功，并提交审核",
                  type: "success"
                });
                this.reload();
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
    margin-top: 40px;
    position: relative;
    border: 1px solid #e4e4e4;
    .el-input {
      width: 400px;
      height: 30px;
    }
    .head-top {
      margin-bottom: 20px;
    }
    .el-form {
      margin-left: 50px;
      .el-form-item {
        i {
          color: red;
        }
        .deleteBox {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
