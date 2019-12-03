<template>
  <!--添加一级分类-->
  <div class="addSecond">
    <div class="detaillTitle">
      <p class="title">{{shoppeName}}</p>
    </div>
    <div class="footerBox">
      <addhead headname="编辑导航"></addhead>
      <!--一级-->
      <el-form label-width="150px" :rules="rules1" :model="form1" ref="form1" v-if="level==1">
        <el-form-item label="层级：" required style="margin-top: 20px;">
          <p class="hierarchy">一级</p>
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label">一级导航名称：</span>
          <el-input v-model="form1.name" placeholder="字字长度1~20以内"></el-input>
        </el-form-item>
        <el-form-item prop="index">
          <span slot="label">显示优先级：</span>
          <el-input v-model="form1.index" type="number" placeholder="请输入1000以内的数字，数字越小显示优先级越高"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('form1',form1)" class="success" type="primary">保存至待发布</el-button>
        </el-form-item>
      </el-form>
      <!--二级-->
      <el-form label-width="150px" :rules="rules2" :model="form2" ref="form2" v-else-if="level==2">
        <el-form-item label="层级：" required style="margin-top: 20px;">
          <p class="hierarchy">二级</p>
        </el-form-item>
        <el-form-item required prop="firstLevelId">
          <span slot="label">所属一级导航：</span>
          <el-select v-model="form2.firstLevelId" placeholder="请选择" :disabled="true">
            <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label">二级导航名称：</span>
          <el-input v-model="form2.name" placeholder="字数长度1~10以内"></el-input>
        </el-form-item>
        <el-form-item prop="index">
          <span slot="label">显示优先级：</span>
          <el-input v-model="form2.index"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('form2',form2)" class="success" type="primary">保存至待发布</el-button>
        </el-form-item>
      </el-form>
      <!--三级-->
      <el-form label-width="150px" :rules="rules3" :model="form3" ref="form3" v-else-if="level==3">
        <el-form-item label="层级：" required style="margin-top: 20px;">
          <p class="hierarchy">三级</p>
        </el-form-item>
        <el-form-item required prop="firstLevelId">
          <span slot="label">所属一级导航：</span>
          <el-select v-model="form3.firstLevelId" placeholder="请选择" :disabled="true">
            <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required prop="secondLevelId">
          <span slot="label">所属二级导航：</span>
          <el-select v-model="form3.secondLevelId" placeholder="请选择" :disabled="true">
            <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label">三级导航名称：</span>
          <el-input v-model="form3.name" placeholder="字数长度1~10以内"></el-input>
        </el-form-item>
        <el-form-item prop="index">
          <span slot="label">显示优先级：</span>
          <el-input v-model="form3.index"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('form3',form3)" class="success" type="primary">保存至待发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  getEditNavInfo,
  editNavInfo
} from "@/api/release/specialProjectManage";
export default {
  inject: ["close"],
  name:'InvoiceRecordDetail',
  data() {
    var check = (rule, value, callback) => {
      if (value && +value > 1000) {
        return callback(new Error("请输入1000以内的数字"));
      }
      callback();
    };
    return {
      navId: "",
      shoppeName: "",
      level: 1,
      options1: [],
      options2: [],
      form1: {
        name: "",
        index: "" //优先级
      },
      form2: {
        firstLevelId: null,
        name: "",
        index: ""
      },
      form3: {
        firstLevelId: null,
        secondLevelId: null,
        name: "",
        index: ""
      },
      rules1: {
        name: [
          { required: true, message: "请输入一级分类名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "字数长度在 1 到 20以内",
            trigger: "blur"
          }
        ],
        index: [{ validator: check, trigger: "blur" }]
      },
      rules2: {
        name: [
          { required: true, message: "请输入二级分类名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "字数长度在 1 到 20以内",
            trigger: "blur"
          }
        ],
        firstLevelId: [{ required: true, message: "请选择一级分类", trigger: "blur" }],
        index: [{ validator: check, trigger: "blur" }]
      },
      rules3: {
        firstLevelId: [{ required: true, message: "请选择一级分类", trigger: "blur" }],
        name: [
          { required: true, message: "请输入三级分类名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "字数长度在 1 到 20以内",
            trigger: "blur"
          }
        ],
        secondLevelId: [{ required: true, message: "请选择二级分类", trigger: "blur" }],
        index: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  components: {
    addhead
  },
  mounted() {
    this.init();
  },
  activated(){
    if(this.$route.query.id != this.navId || this.$route.query.level != this.level){
      this.init();
    }
  },
  methods: {
    init(){
      this.navId = this.$route.query.id;
      this.level = this.$route.query.level ? +this.$route.query.level : 1;
      this.getNavInfo();
    },
    getNavInfo() {
      getEditNavInfo(
        this.navId,
        { 1: "first", 2: "second", 3: "third" }[this.level]
      ).then(res => {
        if (res.code == "000000") {
          this.shoppeName = res.data.projectName;
          if (this.level == 1) {
            this.form1 = res.data;
          } else if (this.level == 2) {
            this.form2 = res.data;
            this.options1.push({
              id:res.data.firstLevelId,
              name:res.data.firstLevelName
            });
          } else {
            this.form3 = res.data;
            this.options1.push({
              id:res.data.firstLevelId,
              name:res.data.firstLevelName
            });
            this.options2.push({
              id:res.data.secondLevelId,
              name:res.data.secondLevelName
            });
          }
        }
      });
    },
    submitForm(formname, form) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.saveEditNav(form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    saveEditNav(form) {
      editNavInfo(form.id, form).then(res => {
        //this.resetForm();
        this.$message({
          type: "success",
          message: "导航数据已保存成功，保存至待发布"
        });
      });
    },
    resetForm() {
      this.$refs.form1.resetFields();
      this.$refs.form2.resetFields();
      this.$refs.form3.resetFields();
    }
  }
};
</script>
<style scoped lang="less">
.addSecond {
  .detaillTitle {
    background-color: #f3f3f3;
    margin: 10px 0;
    border: 1px solid #e4e4e4;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgb(228, 228, 228);
    .title {
      margin-left: 10px;
      font-size: 14px;
      line-height: 50px;
      display: inline-block;
    }
  }
  .footerBox {
    margin-top: 10px;
    position: relative;
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    .el-input {
      width: 400px;
      height: 30px;
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
        .hierarchy {
          color: red;
        }
      }
    }
  }
}
</style>