<template>
  <!--添加一级分类-->
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="添加分类" class="head-top"></addhead>
      <el-form label-width="150px">
        <el-form-item required>
          <span slot="label">层级：</span>
          <span style="color:red;">三级</span>
        </el-form-item>
      </el-form>
      <el-form label-width="150px" :rules="rules3" status-icon :model="form3" ref="form3">
        <el-form-item class="first-level-name">
          <span slot="label">
            <i>*</i>&nbsp;所属一级分类：
          </span>
          <el-input v-model="form3.name1" readonly v-if="id1||id2"></el-input>
          <el-select
            v-if="!id1&&!id2"
            v-model="form3.id1"
            filterable
            remote
            placeholder="请选择"
            :remote-method="remoteClass1"
          >
            <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="id2" class="first-level-name" v-if="id2">
          <span slot="label">
            <i>*</i> 所属二级分类：
          </span>
          <el-input v-model="form3.name2" readonly></el-input>
        </el-form-item>
        <el-form-item v-if="!id2">
          <span slot="label">
            <i>*</i>&nbsp;所属二级分类：
          </span>
          <el-select
            v-model="form3.id2"
            filterable
            remote
            placeholder="请选择"
            :remote-method="remoteClass2"
          >
            <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name3" label="三级分类名称：">
          <el-input v-model="form3.name3" placeholder="字数长度1~20"></el-input>
        </el-form-item>

        <el-form-item prop="taxCodeId">
          <span slot="label">选择税收分类：</span>
          <el-select
            filterable
            remote
            reserve-keyword
            placeholder="请选择"
            :remote-method="remoteTax"
            v-model="form3.taxCodeId"
            @change="onTaxChange"
          >
            <el-option v-for="item in taxclass" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required>
          <span slot="label">税收编码：</span>
          <el-input v-model="form3.classtaxcode" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <i>*</i>税率：
          </span>
          <el-input v-model="form3.classtaxRate" readonly>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="managerUserId">
          <span slot="label">分类管理员账号：</span>
          <el-select
            v-model="form3.managerUserId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="onchange3"
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
          <el-input v-model="form3.administrator" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDraft3('form3')" class="success" type="primary">保存至草稿</el-button>
          <el-button type="primary" @click="addReview('form3')">保存并提交审核</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  addDraft3,
  addReview3,
  selectList,
  classinfo1,
  classinfo2,
  simplelist,
  searchTax,
  selectlist,
  checkNameLevel
} from "@/api/classManage";
export default {
  inject: ["reload"],
  name: "CategoryCreateThird",
  data() {
    var checkName = (rule, value, callback) => {
      var reg = /^[^"'”“‘’]+$/;
      if (!reg.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else{
        checkNameLevel({
          level:3,
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
      id1: null,
      id2: null,
      radio: 3,
      taxclass: [],
      class1options1: [],
      options: [],
      options1: [],
      options2: [],
      form3: {
        name1: "",
        id1: null,
        id2: null,
        name2: "",
        name3: "",
        managerUserId: null,
        taxCodeId: null,
        classtaxcode: null,
        classtaxRate: null,
        administrator: null
      },
      rules3: {
        name3: [
          { required: true, message: "分类名字不能为空", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        taxCodeId: [{ required: true, message: "请选择税收分类" }],
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
    this.id1 = this.$route.query.id1;
    this.id2 = this.$route.query.id2;
    if (this.id2) {
      this.getSecond(this.id2);
    } else if (this.id1) {
      this.getFirst(this.id1);
    }
  },
  methods: {
    remoteClass2(name) {
      if (this.form3.id1) {
        if (name) {
          selectlist(2, this.form3.id1, name).then(res => {
            if (res.code == "000000") {
              this.options2 = res.data;
            }
          });
        }
      } else {
        this.$message({
          message: "请先选择一级分类",
          type: "error"
        });
      }
    },
    remoteClass1(name) {
      if (name) {
        selectlist(1, 0, name).then(res => {
          if (res.code == "000000") {
            this.options1 = res.data;
          }
        });
      }
    },
    onTaxChange(val) {
      for (var i = 0; i < this.taxclass.length; i++) {
        if (this.taxclass[i].id === val) {
          this.form3.classtaxcode = this.taxclass[i].code;
          this.form3.classtaxRate = this.taxclass[i].taxRate;
          break;
        }
      }
    },
    remoteTax(query) {
      if (query) {
        searchTax(query).then(res => {
          if (res.code == "000000") {
            this.taxclass = res.data;
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
    onchange3(val) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].id === val) {
          this.form3.administrator = this.options[i].realName;
          break;
        }
      }
    },
    onChange1(val) {
      this.form3.name2 = "";
      this.getlist2(2, val);
    },
    onChange2(val) {
      this.id = val;
    },
    getFirst(id) {
      classinfo1(id).then(res => {
        this.form3.name1 = res.data.name;
        this.form3.id1 = id;
      });
    },
    getSecond(id) {
      classinfo2(id).then(res => {
        this.form3.name2 = res.data.name;
        this.form3.name1 = res.data.parentName;
        this.form3.id2 = id;
      });
    },
    getlist(level, parentId) {
      selectList(level, parentId).then(res => {
        if (res.code == "000000") {
          this.options1 = res.data;
        }
      });
    },
    getlist2(level, parentId) {
      selectList(level, parentId).then(res => {
        if (res.code == "000000") {
          this.options2 = res.data;
        }
      });
    },
    draft3() {
      var that = this;
      addDraft3({
        name: that.form3.name3,
        parentId: that.form3.id2,
        taxCodeId: that.form3.taxCodeId,
        managerUserId: that.form3.managerUserId
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
    addDraft3(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          checkNameLevel({
            level: 3,
            name: that.form3.name3
          }).then(res => {
            if (res.code == "000000") {
              this.draft3();
            }
          });
        } else {
          return false;
        }
      });
    },
    review3() {
      var that = this;
      addReview3({
        name: that.form3.name3,
        parentId: that.form3.id2,
        taxCodeId: that.form3.taxCodeId,
        managerUserId: that.form3.managerUserId
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
            level: 3,
            name: that.form3.name3
          }).then(res => {
            if (res.code == "000000") {
              this.review3();
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
