<template>
  <el-form :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
    <div class="templeteBox">
      <addhead headname="第一步：添加参数组"></addhead>
      <el-form label-width="150px" :model="form" :rules="rules" ref="form">
        <el-form-item prop="thirdId">
          <span slot="label">选择模板所属分类：</span>
          <el-select
            v-model="form.firstId"
            placeholder="一级分类"
            @change="firstChange"
            :disabled="!!backId">
            <el-option
              v-for="item in firstClass"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.secondId"
            placeholder="二级分类"
            @change="secondChange"
            :disabled="!!backId">
            <el-option
              v-for="item in secondClass"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.thirdId"
            placeholder="三级分类"
            @change="thirdChange"
            :disabled="!!backId"
          >
            <el-option
              v-for="item in thirdClass"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="resource">
          <span slot="label">选择模板参数主键：</span>
          <el-radio-group v-model="form.resource">
            <el-radio label="0">型号</el-radio>
            <el-radio label="1">规格</el-radio>
            <el-radio label="2">货号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="参数组名称："
          v-for="(item,index) in form.pople"
          :key="index"
          :prop="'pople.' + index + '.name'"
          :rules="rules.name"
        >
          <el-input
            v-model="item.name"
            placeholder="字数长度1~10以内"
            style="width: 200px;margin-right:40px;"
          ></el-input>
          <el-button type="primary" v-if="index==0" @click="poplepush">添加参数组</el-button>
          <el-button type="danger" v-if="index!=0" @click="depople(index)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add('form')">保存至草稿</el-button>
          <el-button type="primary" @click="nextform('form')">保存并填写下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-form>
</template>
<script>
import addhead from "@/components/common/head/head";
import { selectList } from "@/api/classManage";
import {
  addTemplate,
  hastemplate,
  groupName,
  commonInfo,
  groupUpdate,groupDelete
} from "@/api/templateManage";
export default {
  name: "AddTemplate",
  inject:['close'],
  data() {
    return {
      backId:null,
      firsrName: "",
      secondName: "",
      thirdName: "",
      firstClass: [],
      secondClass: [],
      thirdClass: [],
      form: {
        firstId: null,
        secondId: null,
        thirdId: null,
        resource: null,
        pople: [{ name: "" }]
      },
      rules: {
        thirdId: [{ required: true, message: "请选择分类" }],
        resource: [{ required: true, message: "请选择模板参数主键" }],
        name: [{ required: true, message: "请填写参数组名称" },{ min: 1, max: 10, message: '长度在 1 到 10 个字', trigger: 'blur' }]
      }
    };
  },
  components: {
    addhead
  },
  activated() {
    if (this.$route.query && this.$route.query.back) {
      this.backId = this.$route.query.back;
      groupName(this.backId).then(res => {
        if (res.code == "000000") {
          this.form.pople = res.data;
        }
      });
      commonInfo(this.backId).then(res => {
        if (res.code == "000000") {
          this.form.resource =
            res.data.primaryAttribute == "型号"
              ? "0"
              : res.data.primaryAttribute == "规格"
              ? "1"
              : "2";
          this.form.firstId = res.data.oneLevelCategoryId;
          this.firstClass = [
            {
              id: res.data.oneLevelCategoryId,
              name: res.data.oneLevelCategoryName
            }
          ];
          this.firsrName = res.data.oneLevelCategoryName
          this.form.secondId = res.data.twoLevelCategoryId;
          this.secondClass = [
            {
              id: res.data.twoLevelCategoryId,
              name: res.data.twoLevelCategoryName
            }
          ];
          this.secondName = res.data.twoLevelCategoryName
          this.form.thirdId = res.data.threeLevelCategoryId;
          this.thirdClass = [
            {
              id: res.data.threeLevelCategoryId,
              name: res.data.threeLevelCategoryName
            }
          ];
          this.thirdName = res.data.threeLevelCategoryName
        }
      });
    } else {
      this.getFirst();
    }
  },
  methods: {
    hasTemplate(id) {
      hastemplate(id).then(res => {
        if (res.code == "000000") {
          if (!res.data) {
            this.$message.error("该分类下已有参数模板存在，请重新选择分类");
            this.form.firstId = null;
            this.form.secondId = null;
            this.form.thirdId = null;
          }
        }
      });
    },
    getFirst() {
      selectList(1, 1).then(res => {
        if (res.code == "000000") {
          this.firstClass = res.data;
        }
      });
    },
    getSecond(val) {
      selectList(2, val).then(res => {
        if (res.code == "000000") {
          this.secondClass = res.data;
        }
      });
    },
    getThird(val) {
      selectList(3, val).then(res => {
        if (res.code == "000000") {
          this.thirdClass = res.data;
        }
      });
    },
    firstChange(val) {
      this.firstId = val;
      if (val) {
        this.getSecond(val);
      }
      for (var i = 0; i < this.firstClass.length; i++) {
        if (this.firstClass[i].id == val - 0) {
          this.firsrName = this.firstClass[i].name;
          return;
        }
      }
    },
    secondChange(val) {
      this.secondId = val;
      if (val) {
        this.getThird(val);
      }
      for (var i = 0; i < this.secondClass.length; i++) {
        if (this.secondClass[i].id == val - 0) {
          this.secondName = this.secondClass[i].name;
          return;
        }
      }
    },
    thirdChange(val) {
      this.thirdId = val;
      this.hasTemplate(val);
      for (var i = 0; i < this.thirdClass.length; i++) {
        if (this.thirdClass[i].id == val - 0) {
          this.thirdName = this.thirdClass[i].name;
          return;
        }
      }
    },
    poplepush() {
      var obj = {
        name: "",
        id:0
      };
      this.form.pople.push(obj);
    },
    depople(index) {
      if(this.form.pople[index].id){
        groupDelete(this.form.pople[index].id,this.backId).then(res=>{
          if(res.code=='000000'){
            this.form.pople.splice(index, 1);
          }
        })
      }else{
        this.form.pople.splice(index, 1);
      }
    },
    add(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.backId) {
            groupUpdate({
              groupParams: that.form.pople,
              primaryAttribute: that.form.resource,
              templateId: that.backId
            }).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.close({
                  name: "AddTemplate",
                  to: { name: "TemplateAdmin", params: { isUpdate: true } }
                });
              }
            });
          } else {
            addTemplate({
              categoryId: that.form.thirdId,
              groupParams: that.form.pople,
              primaryAttribute: that.form.resource - 0
            }).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.close({
                  name: "AddTemplate",
                  to: { name: "TemplateAdmin", params: { isUpdate: true } }
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    nextform(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (that.backId) {
            groupUpdate({
              groupParams: that.form.pople,
              primaryAttribute: that.form.resource,
              templateId: that.backId
            }).then(res => {
              if (res.code == "000000") {
                this.close({name:'AddTemplate', to: {name:'SecondStep', query: {
                    id: that.backId,
                    threeName:
                      that.firsrName +
                      ">" +
                      that.secondName +
                      ">" +
                      that.thirdName
                }}});
              }
            });
          } else {
            addTemplate({
              categoryId: that.form.thirdId,
              groupParams: that.form.pople,
              primaryAttribute: that.form.resource - 0
            }).then(res => {
              if (res.code == "000000") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.close({name:'AddTemplate', to: {name:'SecondStep', query: {
                    id:res.data,
                    threeName:
                      that.firsrName +
                      ">" +
                      that.secondName +
                      ">" +
                      that.thirdName
                }}});
              }
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-form {
  color: #606266;
  .templeteBox {
    border: 1px solid #e4e4e4;
    margin-top: 10px;
    .el-form {
      margin-left: 50px;
      padding-top: 20px;
      .el-form-item {
        padding: 10px 0;
        .el-input {
          width: 400px;
          height: 40px;
        }
        .tipBox {
          height: 20px;
          font-size: 12px;
          margin-left: 20px;
        }
        .el-form-item_err {
          color: #f56c6c;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 0;
        }
      }
    }
    .listBox {
      /*width: 600px;*/
      box-sizing: border-box;
      .listLeftBox {
        overflow: auto;
        background-color: #ffffff;
        border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 200px;
        height: 300px;
        .headerBox {
          height: 35px;
          border: 1px solid #e4e4e4;
          span {
            color: red;
            line-height: 36px;
          }
        }
      }
      .listRightBox {
        border: 1px solid #e5e5e5;
        height: 300px;
        width: 200px;
        overflow: auto;
        /*padding: 0 10px;*/
        .headerBox {
          height: 35px;
          border: 1px solid #e4e4e4;
          span {
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }
      }
    }
  }
}
</style>
