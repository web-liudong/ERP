
<template>
  <div class="editerBrandBox">
    <div class="h50 headerBox">
      <span>基本信息</span>
    </div>
    <div class="w">
      <el-form
        style="margin: 0 auto"
        :model="createBrandParam"
        :rules="rules"
        ref="createBrandParam"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="品牌中文名："
          :prop="createBrandParam.nameCN==''&&createBrandParam.nameEN==''?'nameCN':'nameCN1'"
        >
          <el-input
            v-model="createBrandParam.nameCN"
            placeholder="1~50个字以内"
            @blur="compare()"
          ></el-input>
        </el-form-item>
        <!--<div class="tipBox">如无中文名，请在中文名处输入英文名</div>-->
        <el-form-item label="品牌英文名：" prop="nameEN">
          <el-input
            v-model="createBrandParam.nameEN"
            placeholder
            @blur="compare()"
          ></el-input>
        </el-form-item>
        <el-form-item label="注册号/申请号：" prop="registeredNo">
          <el-input v-model="createBrandParam.registeredNo" placeholder="1~50个字以内"></el-input>
        </el-form-item>
        <!-- <div class="tipBox">用于确认品牌的真实合法性，此处请输入一个有效注册号/申请号</div>-->
        <el-form-item label="商标申请人：" prop="registrant">
          <el-input v-model="createBrandParam.registrant" @blur="compare()" placeholder="1~50个字以内"></el-input>
        </el-form-item>
        <!--<div class="tipBox" style="width: 410px;">
          商标注册申请人是指：依法向商标局提出商标注册申请的人，包括国内外的自然人、法人或者其他组织。详细
          信息可登陆 <a href="http://wsjs.saic.gov.cn" style="color: #3190e8">http://wsjs.saic.gov.cn</a> 查询
        </div>-->
        <el-form-item label="品牌管理员账号：" prop="userDataAuthorityId">
          <el-select
            v-model="createBrandParam.userDataAuthorityId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入集团业务员账号"
            :remote-method="remoteMethod"
            :loading="loading1"
            style="width: 400px"
            @change="goRealName"
          >
            <el-option
              v-for="item in options4"
              :key="item.userName"
              :label="item.label"
              :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌管理员姓名：">
          <el-input v-model="realName" placeholder="1~50个字以内" readonly></el-input>
        </el-form-item>
        <el-form-item label="品牌logo：" prop="logoFileId">
          <el-upload
            class="avatar-uploader"
            action="/api/file-service/file/upload"
            name="fileName"
            :headers="headerToken"
            :data="{type:'Brand'}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i
              v-if="imgUrl"
              class="el-icon-zoom-in"
              @click.stop="opendialog()"
              style="font-size:25px;position:absolute;top:50px;left:50px;z-index:100"
            ></i>
            <i
              v-if="imgUrl"
              class="el-icon-delete"
              @click.stop="delImg()"
              style="font-size:20px;position:absolute;top:0px;left:100px;z-index:100"
            ></i>
          </el-upload>
        </el-form-item>
        <el-dialog :visible.sync="dialogVisible1">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <el-form-item label="品牌简介：" prop="description">
          <el-input
            type="textarea"
            placeholder="1~200个字以内"
            v-model="createBrandParam.description"
            class="textBox"
            rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择关联分类：" prop="categoryIdList" class="listBox clear">
          <!--  <span slot="label"><i style="color: red">*</i>选择关联分类：</span>-->
          <div class="listLeftBox left">
            <div class="headerBox">
              <span>分类选项列表</span>
            </div>
            <div class="treeBox" style="position: relative">
              <el-tree
                ref="tree"
                :data="data2"
                show-checkbox
                :disabled="false"
                node-key="id"
                @check="getnode(data2)"
                :default-checked-keys="data3"
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
          <div class="listRightBox left">
            <div class="headerBox">
              <span>已选分类预览</span>
            </div>
            <div class="treeBox" style="position: relative">
              <el-tree
                :data="data2"
                ref="tree2"
                node-key="id"
                :filter-node-method="filterNode"
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin-top: 20px;margin-left: 70px">
          <el-button
            type="primary"
            @click="submitForm('createBrandParam')"
            style="display: inline-block"
          >保存至草稿</el-button>
          <el-button
            type="primary"
            @click="resetBrandForm('createBrandParam')"
            style="display: inline-block"
          >提交审核</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="completeBox">
      <el-dialog
        :visible.sync="dialogVisible"
        width="25%"
        center
        top="40vh"
        show-close
        @closed="aa()"
      >
        <div class="el-dialog-header">
          <i :class="tubiao" style="font-size: 60px;"></i>
        </div>
        <div
          style="text-align: center;font-size: 16px;margin-bottom: 20px;margin-top: 25px;"
        >{{content}}</div>
        <span style="text-align: center;font-size: 14px">{{desc}}</span>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
    <compare ref="compare" :title="compareTitle"></compare>
    <Toast ref="Toast" :content="'操作成功'" :desc="desc" @callback="closed()"></Toast>
  </div>
</template>
<script>
import {
  addBrand,
  addBrandToAudit,
  recordBrand,
  findBrandTreeData,
  getUsername,
  queryBrand,
  updateBrandToDraft,
  uploadBrandToAudit,
  checkAuditer
} from "@/api/brandManage";
import { addURL } from "@/utils/index.js";
import compare from "./child/compare";
import Toast from "@/components/common/module/Toast.vue";
export default {
  inject: ["reload", "close"],
  name: "EditorBrand",
  data() {
    var checkBrandName = (rule, value, callback) => {
      if (!value) {
        // return callback(new Error("品牌中文名不能为空"));
        callback();
      }
      // var reg = /^[^"'”“‘’\r\n/\\\\]+$/;
      // if (reg.test(value) === false) {
      //   callback(new Error("品牌中文名格式不对"));
      // } else {
      //   callback();
      // }
    };
    var checkBrandNameEN = (rule, value, callback) => {
      if (!value) {
        callback();
      }
       if (1 > value.length > 50) {
        callback(new Error("长度在1~50个字之间"));
      } else {
        callback();
      }
    };
    return {
      //对话框的内容
      tubiao: "",
      content: "",
      desc: "",
      options10: [],
      skuArr: [],
      defaultProps: {
        children: "subCategory",
        label: "name"
      },
      ID: null,
      dialogImageUrl: "",
      dialogVisible1: false,
      isShow: this.$route.query.show,
      options4: null,
      loading1: false,
      headerToken: { Authorization: "Bearer " + this.$auth.token },
      imgUrl: "",
      //添加参数
      createBrandParam: {
        nameCN: "",
        nameEN: "",
        registeredNo: "",
        registrant: "",
        categoryIdList: null,
        description: "",
        logoFileId: "",
        userDataAuthorityId: ""
      },
      manageID: "",
      realName: "",
      userID: "",
      //树结构
      data2: [],
      data3: [],
      checkNameRepeatedParam: {
        nameCN: "",
        nameEN: "",
        registrant: ""
      },
      compareTitle: "",
      dialogVisible: false,
      filterText: null,
      rules: {
        nameCN: [
          {
            required: true,
            message: "品牌中文名和品牌英文名不能同时为空",
            trigger: "blur"
          },
          {
            validator: checkBrandName,
            min: 1,
            max: 50,
            message: "品牌中文名格式不对",
            trigger: "blur"
          }
        ],
        nameCN1: [
          {
            validator: checkBrandName,
            min: 1,
            max: 50,
            message: "品牌中文名格式不对",
            trigger: "blur"
          }
        ],
        nameEN: [
          {
            validator: checkBrandNameEN,
            message: "品牌英文格式不对",
            trigger: "change"
          },
          {
            min: 1,
            max: 50,
            message: "品牌英文名长度在1~50字之间",
            trigger: "change"
          }
        ],
        registeredNo: [
          { required: true, message: "注册号/申请号不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "长度在1~50字之间", trigger: "blur" }
        ],
        registrant: [
          { required: true, message: "商标申请人不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "长度在1~50字之间", trigger: "blur" }
        ],
        description: [
          { min: 1, max: 200, message: "长度在1~200字之间", trigger: "blur" }
        ],
        userDataAuthorityId: [
          {
            required: true,
            message: "品牌管理员账号不能为空",
            trigger: "blur",
            trigger: "change"
          }
        ],
        categoryIdList: [
          { required: true, message: "经营分类不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.ID = this.$route.query.id;
    //获取点击的数据详情
    this.getformData();
    //获取全部分类树
    var _this = this;
    findBrandTreeData().then(res => {
      _this.data2 = res.data;
      _this.$nextTick(() => {
        _this.getnode();
      });
    });
  },
  components: {
    compare,
    Toast
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    this.getnode();
  },
  activated() {
    if (this.ID != this.$route.query.id) {
      this.getformData();
      findBrandTreeData().then(res => {
        this.data2 = res.data;
        this.$nextTick(() => {
          this.getnode();
        });
      });
    }
  },
  methods: {
    closed(){
     this.close({name:'EditorBrand',to:{name:'Brand',params:{isUpdate:true}}})
    },
    //提交审核
  resetBrandForm(formName) {
    let BrandID = this.$route.query.id;
    var _this = this;
    _this.createBrandParam.nameEN=_this.createBrandParam.nameEN.trim()
    _this.createBrandParam.nameCN=_this.createBrandParam.nameCN.trim()
    _this.createBrandParam.userDataAuthorityId = _this.manageID;
    _this.$refs[formName].validate(valid => {
      if (valid) {
        uploadBrandToAudit(BrandID, _this.createBrandParam).then(res => {
          if (res.data.id != "") {
            this.desc = "当前页面信息已保存至待审核";
            this.$refs.Toast.init();
          }
        });
      }
    });
  },
    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        let aa = { userName: query, count: 5 };
        getUsername(aa).then(res => {
          if (res.code == "000000") {
            this.options4 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    opendialog() {
      this.dialogVisible1 = true;
      this.dialogImageUrl = this.imgUrl;
    },
    delImg() {
      this.createBrandParam.logoFileId = null;
      this.imgUrl = "";
    },
    //选中值发生变化时
    goRealName(ee) {
      let str = [];
      str = this.options4.filter(item => {
        return item.userName == ee;
      });
      this.realName = str[0] && str[0].realName;
      this.manageID = str[0] && str[0].id;
    },
    //获取点击的数据详情
    getformData() {
      let ID = this.$route.query.id;
      queryBrand(ID).then(res => {
        this.createBrandParam = res.data;
        if (res.data.filePathDTO == null) {
          this.imgUrl = null;
        } else {
          this.imgUrl = addURL(res.data.filePathDTO.path);
        }
        this.data3 = res.data.categoryIdList;
        let obj1 = res.data.categoryIdList;
        if (res.data.userDTO == null) {
          this.realName = null;
          this.createBrandParam.userDataAuthorityId = null;
          this.manageID = null;
        } else {
          this.realName = res.data.userDTO.realName;
          this.createBrandParam.userDataAuthorityId = res.data.userDTO.userName;
          this.manageID = res.data.userDTO.id;
        }
        this.$refs.tree2.filter(this.data3);
      });
    },
    //判重
    compare() {
      let ID1 = this.$route.query.id;
      if (
        this.createBrandParam.nameCN !== "" &&
        this.createBrandParam.registrant !== ""
      ) {
        this.checkNameRepeatedParam.nameCN = this.createBrandParam.nameCN;
        this.checkNameRepeatedParam.nameEN = this.createBrandParam.nameEN;
        this.checkNameRepeatedParam.registrant = this.createBrandParam.registrant;
        this.checkNameRepeatedParam.id = ID1;
        //调用品牌名称是否重复
          recordBrand(this.checkNameRepeatedParam).then(res => {
            if (res.data != "") {
              this.$refs.compare.init(res.data);
            } else if (res.data == false) {
              this.$message({
                message: "品牌名称可用",
                type: "success"
              });
            }
          });
      }
    },
   handleAvatarSuccess(res, file) {
        if(res.code=='000000'){
          this.imgUrl = URL.createObjectURL(file.raw);
          console.log(res.data);
          this.$message({
            message:'上传成功',
            type:'success',
          })
          this.createBrandParam.logoFileId=res.data.id;
        }else {
          this.$message({
            message:'上传文件失败',
            type:'error'
          })
        }
    },
  //保存至草稿
  submitForm(formName) {
    let BrandID = this.$route.query.id;
    var _this = this;
    _this.createBrandParam.nameEN=_this.createBrandParam.nameEN.trim()
    _this.createBrandParam.nameCN=_this.createBrandParam.nameCN.trim()
    _this.createBrandParam.userDataAuthorityId = _this.manageID;
    this.$refs[formName].validate(valid => {
      if (valid) {
        updateBrandToDraft(BrandID, _this.createBrandParam).then(res => {
          if (res.data.id != "") {
            this.desc = "当前页面信息已保存至草稿";
            this.$refs.Toast.init();
          }
        });
      }
    });
  },
  //上传文件之前的钩子函数用于验证
  beforeAvatarUpload(file) {
    const isJPG = file.type === "image/jpeg";
    const isPNG = file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG && !isPNG) {
      this.$message.error("上传头像图片只能是JPG或者PNG格式!");
    }
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 2MB!");
    }
    return (isJPG && isLt2M) || isPNG;
  },
  getnode() {
    this.skuArr = this.$refs.tree
      .getCheckedKeys(true, true)
      .concat(this.$refs.tree.getHalfCheckedKeys());
    this.$refs.tree2.filter(this.skuArr);
    this.createBrandParam.categoryIdList = this.skuArr;
    if (this.skuArr) {
      this.$refs.createBrandParam.clearValidate(["categoryIdList"]);
    }
  },
  filterNode(value, data) {
    if (!value) return true;
    return value.includes(data.id);
  }
}
}
</script>

<style lang="less" scoped>
.editerBrandBox {
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .headerBox {
    height: 50px;
    background: #f3f3f3;
    border-bottom: 1px solid #e4e4e4;
    span {
      line-height: 50px;
      margin-left: 50px;
    }
  }
  .el-form {
    padding: 20px 100px 0 100px;
    color: #606266;
    .el-form-item {
      .el-input {
        width: 400px;
        height: 40px;
      }
    }
    .tipBox {
      //height: 20px;
      //line-height: 20px;
      font-size: 12px;
      margin-left: 56px;
    }
    .listBox {
      width: 600px;
      box-sizing: border-box;
      .listLeftBox {
        padding: 0 10px;
        width: 200px;
        height: 300px;
        overflow: auto;
        .treeBox {
          width: 100%;
          height: 263px;
          box-sizing: border-box;
          overflow: auto;
        }
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
        overflow: auto;
        width: 200px;
        height: 300px;
        padding: 0 10px;
        .treeBox {
          width: 100%;
          height: 263px;
          box-sizing: border-box;
          overflow: auto;
        }
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
<style lang="less" scoped>
.editerBrandBox {
  .el-tree {
    max-height: 300px;
  }
  .completeBox {
    .el-dialog {
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__body {
        text-align: center;
      }
      .el-icon-close {
        color: #f3f3f3;
      }
    }
  }
  .el-form {
    .el-form-item {
      .el-upload-list__item {
        width: 400px;
        margin-left: 64px;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .el-icon-zoom-in {
          display: none;
          color: #339999;
        }
      }
      .avatar-uploader .el-upload:hover {
        border-color: #339999;
        .el-icon-zoom-in {
          display: block;
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }
      .avatar {
        width: 120px;
        height: 120px;
        display: block;
      }
      .el-form-item__error {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 12px;
        left: 490px;
      }
      .el-form-item__label {
        width: 160px !important;
      }
      .textBox {
        width: 400px;
      }
    }
  }
}
</style>
