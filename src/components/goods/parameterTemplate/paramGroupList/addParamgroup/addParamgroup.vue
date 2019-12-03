<template>
  <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm"  v-if="$authorities.TemplateSubmitReviewRelevant">
    <div class="addParamgroupBox">
      <div class="h50 headerBox"><img src="" alt=""><span>添加参数组</span></div>
      <el-form-item label="选择模板所属分类：">
        {{templateInfo.oneLevelCategoryName}}> {{templateInfo.twoLevelCategoryName}}> {{templateInfo.threeLevelCategoryName}}
      </el-form-item>
      <el-form-item label="参数组名称："
                    v-for="(item,index) in addData.groupParamList"
                    :key="index">
        <el-form-item
          style="display: inline-block;"
          :prop="'groupParamList.' + index + '.name'"
          :rules="{
              required: true, message: '参数组名称', trigger: 'blur'
              }">
          <el-input v-model="item.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-button type="primary" v-if="index==0" @click="poplepush()" plain>新增参数组</el-button>
        <el-button type="primary" v-if="index!=0"
                   @click="depople(index)" plain>删除
        </el-button>
      </el-form-item>
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" @click="submitFormAddDraft('ruleForm')" v-if="$authorities.TemplateSubmitReviewRelevant">保存至草稿</el-button>
        <el-button type="primary" @click="submitFormAdd('ruleForm')" v-if="$authorities.TemplateSubmitReviewRelevant">保存并提交审核</el-button>
        <el-button type="primary" @click="close()" >关闭</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
  import './SupplierList.less'
  import {
    postParamGroupAdd,
    putParamGroupEdit,
    getParamGroupDetaills,
    deleteParamGroupDelete,
    postParamGroupNameList,
    postParamGroupList,
    getTemplateInfo,
    getTemplateSubmit
  } from '@/api/goods/paramGroupList'
  export default {
    name:'AddParamgroup',
    inject:['reload','close'],
    data() {
      return {
        templateInfo: {
          templateStatus: "",
          oneLevelCategoryName: "",
          threeLevelCategoryName: "",
          twoLevelCategoryName: "",
          updateStatus: "",
          templateId: null
        },
        rules:
          {
            ownerId: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            name: [
              {required: true, message: '请输入活动名称', trigger: 'blur'},
              {min: 1, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ],
            partner: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            partnerLinkman: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            partnerPhone: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            supplier: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            supplierLinkman: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            supplierPhone: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            provinceId: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            cityId: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            countyId: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
            addressLine: [
              {required: true, message: '请选择活动区域', trigger: 'change'}
            ],
          },
        addData: {
          groupParamList: [
            {
              name: "",
            }
          ],
          templateId: 0,
          templateStatus: 0
        },
        ruleForm: {

          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          pople: [{name: '', num: ''}],
          resource: '',
          desc: '',
          classify: ''
        },
      };
    },
    watch: {

    },
    mounted() {
      this.templateInfo = this.$route.query
      this.addData.templateId=this.templateInfo.templateId;

    },
    methods: {
      //保存参数组
      postParamGroupAdd(){
        postParamGroupAdd(
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            if( this.addData.templateStatus==0){
              this.close({
                name:'AddParamgroup',
                to:{
                  name:'ParamGroupList',
                  query:{
                    id:res.data
                  },
                  params:{
                    isUpdate:true
                  }
                }
              })
            }else {
              this.close({
                name:['AddParamgroup','ParamGroupList'],
                to:{
                  name:'TemplateAdmin',
                  query:{
                    id:res.data
                  },
                  params:{
                    isUpdate:true
                  }
                }
              })
            }
//            this.close({
//              name:'AddParamgroup',
//              to:{
//                name:'TemplateAdmin',
//                params:{
//                  isUpdate:true
//                }
//              }
//            })
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning',
            })
          }
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //智能排序值
      upSort(){
        for (let i = 0; i < this.addData.groupParamList.length; i++) {
          this.addData.groupParamList[i].sort=i+1
        }
      },

      //新增联系人
      poplepush() {
        this.addData.groupParamList.push({name: ''})
      },
      //删除联系人
      depople(index) {
        this.addData.groupParamList.splice(index,1)
      },
      //保存草稿
      submitFormAddDraft(formName) {
        this.addData.templateStatus=0
        console.log(this.addData);
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.postParamGroupAdd();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //保存草稿并提交审核
      submitFormAdd(formName) {
        this.addData.templateStatus=1
        console.log(this.addData);
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.postParamGroupAdd();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-form {

    color: #606266;
    .addParamgroupBox {
      border: 1px solid #e4e4e4;
      margin-top: 10px;
      .headerBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #e4e4e4;
        margin-bottom: 20px;
        span {
          line-height: 50px;
          margin-left: 50px;
        }
      }

      .el-form-item {
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
      .listBox {
        /*width: 600px;*/
        box-sizing: border-box;
        .listLeftBox {
          overflow: auto;
          background-color: #FFFFFF;
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
