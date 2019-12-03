<template>
  <div class="redactBox">
    <div class="redactTable">
      <div class="redactTopBox">
        <span><i></i>基本信息</span>
      </div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="是否关联已有供应商">
          <el-radio-group v-model="isSupplier" @change="changeIsSupplier">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择授权单位：" prop="organizationName" v-if="this.isSupplier==1">
          <el-select
            v-model="addData.organizationName"
            filterable
            remote
            @change="getValue"
            placeholder="请输入并选择授权单位"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in organizationOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写授权单位：" prop="organizationName" v-if="this.isSupplier==0">
          <el-input v-model="addData.organizationName" placeholder="字数长度1~50"></el-input>
        </el-form-item>
        <el-form-item label="授权单位类型：" required>
          <el-radio-group v-model="addData.organizationType">
            <el-radio :label="0">厂商</el-radio>
            <el-radio :label="1">总代</el-radio>
            <el-radio :label="2">经销商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授权品牌：" prop="brandName">
          <el-autocomplete
            style="width: 400px"
            class="inline-input"
            v-model="addData.brandName"
            :fetch-suggestions="postBrandOptionss"
            placeholder="请输入内容"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="授权有效期：" required>
          <el-col :span="4" style="width: 180px;">
            <el-form-item prop="startTime">
              <el-date-picker type="date"
                              placeholder="授权开始日期"
                              v-model="addData.startTime"
                              value-format="yyyy-MM-dd"
                              style="width: 180px;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align: center; width: 40px" >-</el-col>
          <el-col :span="4" style="width: 180px;">
            <el-form-item prop="endTime">
              <el-date-picker type="date"
                              placeholder="授权结束日期"
                              v-model="addData.endTime"
                              value-format="yyyy-MM-dd"
                              style="width: 180px;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="fileId" label="授权文件：" required>
          <el-upload
            class="upload-demo"
            action="/api/file-service/file/upload?type=Authorization"
            :headers="headertoken"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="fileName"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            style="width: 400px;"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持jpg、png、pdf格式文件，大小不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary"  v-if="$authorities.AccreditUpdate" @click="submitForm('ruleForm')">提交保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>
<script>
  import {
    postAccreditAdd,
    getAccreditDetaills,
    putAccreditRedact,
    deleteAccreditDelete,
    postAccreditList,
    postAccreditAddLog,
    getAccreditUptadeDetaills
  } from '@/api/goods/accreditStor'
  import { provinces_based_id,postSupplierOptions,postBrandOptions,deleteFileDelete} from "@/api/common/commonApi"
  export default {
    name:'AccreditRedact',
    inject:['reload','imgurl','close'],//注入依赖
    data() {
      return {
        RecordId:'',
        organizationOptions:[],//授权单位select
        brandNameOptions:[],//授权品牌select
        list:[],
        certificateFileId: [], //资质文件id（多个用英文逗号分隔）
        imageUrl:[],
        fileList:[],
        headertoken:{'Authorization':'Bearer '+this.$auth.token},
        isSupplier: 1,
        loading: false,
        addData: {
          organizationName: '',
          organizationType: 1,
          startTime: '',
          endTime: '',
          brandName: '',
          fileId: [],
          supplierId:'', //授权单位（供应商）的id
          id:'',
        },
        rules: {
          fileId: [
            {required: true, message: '请选择文件', trigger: 'change'}
          ],
          organizationName: [
            {required: true, message: '请选择授权单位', trigger: 'change'}
          ],
          organizationType: [
            {required: true, message: '授权单位类型', trigger: 'change'}
          ],
          brandName: [
            {required: true, message: '请输入授权品牌', trigger: 'change'}
          ],
          startTime: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          endTime: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
        }
      }
    },
    created() {

    },
    activated(){
      if(this.RecordId != this.$route.query.Id){
        this.RecordId = this.$route.query.Id
        this.getAccreditUptadeDetaills();
      }
    },
    mounted() {
      this.getAccreditUptadeDetaills();
      this.RecordId = this.$route.query.Id
    },
    methods: {
      handleSelect(){

      },
      //获取编辑的默认值
      getAccreditUptadeDetaills(){
        getAccreditUptadeDetaills(
          this.$route.query.Id
        ).then((res) => {
          console.log(res)
          //this.detaillsTable = JSON.parse(res.data);
            let data=res.data;
//          let newStartTime=data.startTime.replace(/-/g,",").substring(0, 10);
//          let newEndTime=data.startTime.replace(/-/g,",").substring(0, 10);
          this.addData.startTime=data.startTime;
          this.addData.endTime=data.endTime;
          this.addData.organizationName=data.organizationName;
          this.addData.organizationType=data.organizationType;
          this.addData.supplierId=data.supplierId;
          this.addData.id=data.id;
          this.addData.brandName=data.brandName;
          let list= JSON.parse(JSON.stringify(data.fileDTOList).replace(/fileName/g,"name").replace(/filePath/g,"url"));//更改属性名， 用于展示文件
          console.log(list);
          this.fileList=list;
          this.addData.fileId=data.fileId;
          if(!data.supplierId||data.supplierId==''){
              this.isSupplier=0;
          };

        }).catch(err => {
          console.log(err)
        });
      },
      //供应商模糊搜索
      postSupplierOptionss(name){
        postSupplierOptions(
          name
        ).then((res) => {
          console.log(res)
          //this.detaillsTable = JSON.parse(res.data);
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //品牌模糊搜索
      postBrandOptionss(queryString, cb){
        postBrandOptions(
          queryString
        ).then((res) => {
          let arr=[];
          for (var i=0; i<res.data.length;i++){
            arr.push({"value":res.data[i].nameCN})
          }
          cb(arr)
        }).catch(err => {
          console.log(err)
        });
      },
      //点击是否关联
      changeIsSupplier(value){
        this.addData.organizationName='';
        if(value == 0){
          this.addData.supplierId=0;
        };
      },
      //下拉框事件
      getValue(value){
        this.addData.supplierId = value;
        let name = this.organizationOptions.filter(item => {
          return item.id == value;
        });
        this.addData.organizationName=name[0].name;
        console.log(value);
        console.log(this.addData.supplierId);
        console.log(this.addData.organizationName);
      },
      //提交编辑
      putAccreditRedact(){
        console.log(  this.$route.query.Id)
        putAccreditRedact(
          this.$route.query.Id,
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            this.close({name:'AccreditRedact', to: {name:'Accredit', params:{isUpdate:true}}});
          } else{
            this.$message({
              message: '保存失败',
              type: 'warning',
            })
          }
          console.log(res)
          //this.detaillsTable = JSON.parse(res.data);
          console.log(res);
        }).catch(err => {
          console.log(err)
        })
      },
      //添加
      postAccreditAdd(data) {
        postAccreditAdd(
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存成功',
              type: "success",
            });
            this.close({name:'AccreditRedact', to: {name:'Accredit', params:{isUpdate:true}}});
          } else{
            this.$message({
              message: res.message,
              type: 'warning',
            })
          }
        }).catch(err => {
          console.log(err)
        });
      },
      //远程搜索
      remoteMethod(query) {
        console.log(query)
        if (query !== '') {
          this.loading = true;
          postSupplierOptions(
            query
          ).then((res) => {
            this.organizationOptions = res.data;
            console.log(this.organizationOptions);
          }).catch(err => {
            console.log(err)
          });
          this.loading = false;
        } else {
          this.organizationOptions = [];
        }
      },
      remoteBrandMethod(query) {
        console.log(query)
        if (query !== '') {
          this.loading = true;
          postBrandOptions(
            query
          ).then((res) => {
            console.log(res)
            this.brandNameOptions = res.data;
            console.log(this.brandNameOptions);
          }).catch(err => {
            console.log(err)
          });
          this.loading = false;
        } else {
          this.brandNameOptions = [];
        }
      },
      //提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.putAccreditRedact();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //重置
      resetForm(formName) {
        this.$confirm('取消后，当前填写的信息将不保存，确定取消？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.close({name:'AccreditRedact', to: {name:'Accredit', params:{isUpdate:true}}});


        }).catch(() => {
        });
      },
      ///////////上传 ///////////
      handleAvatarSuccess(res, file) {
        if(res.code == '000000') {
          this.imageUrl = URL.createObjectURL(file.raw);
//					console.log(this.imageUrl)
//					this.fileList.push(res.data)
//					console.log(this.fileList)

          this.$message({
            message: '图片上传成功',
            type: 'success'
          });
          this.addData.fileId.push(res.data.id)
          console.log(this.addData.fileId)
        } else {
          this.$message.error('图片上传失败');
        }
      },
      beforeAvatarUpload(file) {
        const aJPG = file.name.split(".")
        const aPNG = file.name.split(".")
        const aPDF = file.name.split(".")
        const isJPG = aJPG[aJPG.length-1] === "jpg";
        const isPNG = aPNG[aPNG.length-1] === "png";
        const isPDF = aPDF[aPDF.length-1] === "pdf";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if(!isLt2M){
          this.$message({
            message: '上传图片大小不得超过2M',
            type: 'error'
          })
          return false
        }
        if(!(isJPG || isPNG || isPDF )) {
          this.$message({
            message: '上传图片只能是 JPG PNG PDF格式!且不超过2M',
            type: 'error'
          })
          return false;
        }
        return (isJPG ||isPNG ||isPDF )&&isLt2M
      },
      handleChange(file, fileList) {
        this.fileList = fileList;
      },
      handleRemove(file, fileList) {        //删除文件
        console.log(file, fileList);
        console.log(this.addData.fileId );
          deleteFileDelete(
            file.id
          ).then((res) => {
            if (res.data == '1') {
              this.$message({
                message: '删除成功',
                type: "success",
              });
              this.addData.fileId = this.addData.fileId.filter(item => {
                return item!= file.id
              });
              console.log(file, fileList);
              console.log(this.addData.fileId );
            } else{
              this.$message({
                message: '删除失败',
                type: 'warning',
              })
            }
          }).catch(err => {

          });
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        //return this.$confirm(`确定移除 ${ file.name }？`);
      }
      ///////////上传end ///////////
    }
  }
</script>
<style>
  .redactBox .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    /*position: absolute;*/
    /*top: 12px;*/
    /*left: 450px;*/
  }
</style>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .redactBox {
    width: 100%;
    padding-top: 10px;
    .redactTable {
      border: 1px solid #d1d1d1;
      .redactTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        margin-bottom: 20px;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }

      .el-form {
        .el-form-item {
          .label {
            margin-left: 20px;
            display: inline-block;
            width: 130px !important;
            text-align: right;
          }
          .el-input {
            width: 400px;
          }
          .el-textarea {
            width: 400px;
          }
          .el-select {
            width: 400px;
          }
        }
      }
    }
  }


</style>
