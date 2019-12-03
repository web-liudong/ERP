<template>
  <!--添加一级分类-->
  <div class="addSecond">
    <div class="detaillTitle">
      <p class="title">项目：{{shoppeName}}</p>
    </div>
    <div class="footerBox">
      <addhead headname="添加导航"></addhead>
      <el-form label-width="150px">
        <el-form-item required>
          <span slot="label">层级：</span>
          <el-radio-group v-model="level">
            <el-radio :label="1" class="gap" v-if="initLevel == 1">一级</el-radio>
            <el-radio :label="2" class="gap" v-if="initLevel != 3">二级</el-radio>
            <el-radio :label="3" class="gap">三级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form
        label-width="150px"
        :rules="rules1"
        :model="form1"
        ref="form1"
        v-show="level==1"
      >
        <el-form-item prop="name">
          <span slot="label">一级导航名称：</span>
          <el-input v-model="form1.name" placeholder="字字长度1~20以内"></el-input>
        </el-form-item>
        <el-form-item prop="index">
          <span slot="label">显示优先级：</span>
          <el-input v-model="form1.index" type="number" placeholder="请输入1000以内的数字，数字越小显示优先级越高"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="submitForm('form1','first',form1)"
            class="success"
            type="primary"
          >保存至待发布</el-button>
        </el-form-item>
      </el-form>
      <!--二级-->
      <el-form label-width="150px" :rules="rules2" :model="form2" ref="form2" v-show="level==2">
        <el-form-item required prop="firstLevelId">
          <span slot="label">所属一级导航：</span>
          <el-select v-model="form2.firstLevelId" placeholder="请选择" :disabled="isLv1Disabled">
            <el-option
              v-for="item in options1"
              :key="item.id+item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
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
          <el-button
            @click="submitForm('form2','second',form2)"
            class="success"
            type="primary"
          >保存至待发布</el-button>
        </el-form-item>
      </el-form>
      <!--三级-->
      <el-form label-width="150px" :rules="rules3" :model="form3" ref="form3" v-show="level==3">
        <el-form-item prop="firstLevelId">
          <span slot="label">所属一级导航：</span>
          <el-select
            v-model="form3.firstLevelId"
            placeholder="请选择"
            @change="firstClassChange"
            :disabled="isLv1Disabled"
          >
            <el-option
              v-for="item in options1"
              :key="item.id+item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="secondLevelId">
          <span slot="label">所属二级导航：</span>
          <el-select v-model="form3.secondLevelId" placeholder="请选择" :disabled="isLv2Disabled">
            <el-option
              v-for="item in options2"
              :key="item.id+item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
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
          <el-button
            @click="submitForm('form3','third',form3)"
            class="success"
            type="primary"
          >保存至待发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  addNavInit,
  getNextNav,
  addNewNav
} from "@/api/release/specialProjectManage";

import { Debounce } from "@/utils";
export default {
  inject: ["close"],
  name:'ShoppeAddNav',
  data() {
    var check = (rule, value, callback) => {
      if (value && +value > 1000) {
        return callback(new Error("请输入1000以内的数字"));
      }
      callback();
    };
    return {
      loading: true,
      shoppeId: "",
      shoppeName: "",
      navParentId: 0,
      initLevel: 1, //初始级别
      level: 1, //选择的层级
      source: undefined, //判断添加3级时是否可编辑2级导航
      options1: [],
      options2: [],
      isLv1Disabled: false,
      isLv2Disabled: false,
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
        firstLevelId: [
          { required: true, message: "请选择一级分类", trigger: "blur" }
        ],
        index: [{ validator: check, trigger: "blur" }]
      },
      rules3: {
        firstLevelId: [
          { required: true, message: "请选择一级分类", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入三级分类名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "字数长度在 1 到 20以内",
            trigger: "blur"
          }
        ],
        secondLevelId: [
          { required: true, message: "请选择二级分类", trigger: "blur" }
        ],
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
    if(this.$route.query.id != this.shoppeId || this.$route.query.navId != this.navParentId || this.$route.query.level != this.initLevel){
      this.init();
    }
  },
  methods: {
    init(){
      this.shoppeId = this.$route.query.id;
      this.shoppeName = this.$route.query.shoppe;
      this.navParentId = this.$route.query.navId;
      this.initLevel = this.$route.query.level ? +this.$route.query.level : 1;
      this.level = this.initLevel;

      this.getNavInit();
      if (this.level == 3) {
        this.source = this.$route.query.source;
      }
    },
    firstClassChange(val) {
      this.form3.lv2Id = null;
      if (val) {
        this.getSecondNav(val);
      }
    },
    getNavInit() {
      addNavInit(this.shoppeId, this.navParentId).then(res => {
        if (res.code == "000000") {
          if (this.initLevel == 1) {
            this.getFirstNav(0);
          } else if (this.initLevel == 2) {
            this.form2.firstLevelId = res.data.firstLevelId;
            this.form2.lv1name = res.data.firstLevelName;
            this.form3.firstLevelId = res.data.firstLevelId;
            this.form3.lv1name = res.data.firstLevelName;
            this.isLv1Disabled = true;
            this.options1.push({
              name: res.data.firstLevelName,
              id: res.data.firstLevelId
            });

            this.getSecondNav(res.data.firstLevelId);
          } else if (this.initLevel == 3) {
            this.isLv1Disabled = true;
            this.form3.firstLevelId = res.data.firstLevelId;
            this.form3.lv1name = res.data.firstLevelName;
            this.options1.push({
              name: res.data.firstLevelName,
              id: res.data.firstLevelId
            });

            //从二级导航过来的不允许修改二级导航
            if (this.source == 2) {
              this.isLv2Disabled = true;
              this.form3.secondLevelId = res.data.secondLevelId;
              this.form3.lv2name = res.data.secondLevelName;
              this.options2.push({
                name: res.data.secondLevelName,
                id: res.data.secondLevelId
              });
            } else {
              this.getSecondNav(res.data.firstLevelId);
            }
          }
        }
      });
    },
    getFirstNav(navid) {
      getNextNav(this.shoppeId, navid).then(res => {
        this.options1 = res.data;
      });
    },
    getSecondNav(navid) {
      getNextNav(this.shoppeId, navid).then(res => {
        this.options2 = res.data;
      });
    },
    submitForm(formname, type, form) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.saveNav(type, form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    saveNav: Debounce(function(type, form) {
      addNewNav(this.shoppeId, type, form).then(res => {
        this.resetForm();
        this.$message({
          type: "success",
          message: "导航数据已保存成功，保存至待发布"
        });
      });
    }),
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
      }
    }
  }
}
</style>