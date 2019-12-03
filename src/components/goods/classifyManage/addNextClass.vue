<template>
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="添加二级分类" class="head-top"></addhead>
      <el-form label-width="150px">
        <el-form-item required>
          <span slot="label">层级：</span>
          <span style="color:red;">二级</span>
        </el-form-item>
      </el-form>
      <el-form label-width="150px" :rules="rules2" status-icon :model="form2" ref="form2">
        <el-form-item prop="id1" class="first-level-name">
          <span slot="label">
            <i>*</i>&nbsp;所属一级分类：
          </span>
          <el-input v-model="form2.name1" readonly v-if="id?true:false"></el-input>
          <el-select
            v-if="id?false:true"
            v-model="form2.id1"
            filterable
            remote
            placeholder="请选择"
            :remote-method="remoteClass"
          >
            <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name2">
          <span slot="label">
            <i>*</i>二级分类名称：
          </span>
          <el-input v-model="form2.name2" placeholder="字数长度1~20"></el-input>
        </el-form-item>
        <el-form-item prop="managerUserId">
          <span slot="label">分类管理员账号:</span>
          <el-select
            v-model="form2.managerUserId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="onchange2"
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
          <el-input v-model="form2.realName" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDraft2('form2')" class="success" type="primary">保存至草稿</el-button>
          <el-button type="primary" @click="addReview('form2')">保存并提交审核</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  addDraft2,
  addReview2,
  selectList,
  classinfo1,
  simplelist,
  selectlist,
  checkNameLevel
} from "@/api/classManage";
export default {
  inject: ["reload"],
  name: "CategoryCreateNext",
  data() {
    var checkName = (rule, value, callback) => {
      var reg = /^[^"'”“‘’]+$/;
      if (!reg.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else{
        checkNameLevel({
          level:2,
          name:value
        }).then(res => {
          if (res.code == "000000") {
            callback();
          }
        });
      }
    };
    return {
      id: null,
      options: [],
      options1: [],
      options2: [],
      taxclass: [],
      class1options1: [],
      form2: {
        id1: null,
        name1: "",
        name2: "",
        realName: "",
        managerUserId: null
      },
      rules2: {
        name: [
          { required: true, message: "分类名字不能为空", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        managerUserId: [
          { required: true, message: "请选择管理员", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    addhead
  },
  activated() {
    this.id = this.$route.query.id ? this.$route.query.id : null;
    if (this.id) {
      this.getFirst(this.id);
    }
  },
  methods: {
    remoteClass(name) {
      if (name) {
        selectlist(1, 0, name).then(res => {
          if (res.code == "000000") {
            this.options1 = res.data;
          }
        });
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
    onchange2(val) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].id === val) {
          this.form2.realName = this.options[i].realName;
          break;
        }
      }
    },
    getFirst(id) {
      classinfo1(id).then(res => {
        this.form2.name1 = res.data.name;
        this.form2.id1 = id;
      });
    },
    draft2() {
      var that = this;
      addDraft2({
        name: that.form2.name2,
        parentId: that.form2.id1,
        managerUserId: that.form2.managerUserId
      }).then(res => {
        if (res.code == "000000") {
          if (res.data == 1) {
            this.$message({
              message: "分类添加成功，添加至草稿",
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
    },
    addDraft2(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          checkNameLevel({
            level: 2,
            name: that.form2.name2
          }).then(res => {
            if (res.code == "000000") {
              this.draft2();
            }
          });
        } else {
          return false;
        }
      });
    },
    review2() {
      var that = this;
      addReview2({
        name: that.form2.name2,
        parentId: that.form2.id1,
        managerUserId: that.form2.managerUserId
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
    },
    addReview(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          checkNameLevel({
            level: 2,
            name: that.form2.name2
          }).then(res => {
            if (res.code == "000000") {
              this.review2();
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
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
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
