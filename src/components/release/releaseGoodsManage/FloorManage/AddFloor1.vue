<!--编辑分类-->
<template>
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="添加楼层"></addhead>
      <el-form :model="form" ref="form" label-width="150px" class="demo-dynamic" :rules="rules">
        <el-form-item
          prop="name" required
          label="楼层名称：">
          <el-input v-model="form.name" placeholder="字数长度1~20以内"></el-input>
        </el-form-item>
        <el-form-item prop="index" required>
          <span slot="label">显示优先级：</span>
          <el-input v-model="form.index" placeholder="请输入1000以内整数，数字越小显示优先级越高" type="number"></el-input>
        </el-form-item>
        <el-form-item required prop="imageId">
          <span slot="label">楼层展示图：</span>
          <el-upload
            class="avatar-uploader"
            action="/api/file-service/file/upload"
            :show-file-list="false"
            list-type="picture-card"
            :headers="headerToken"
            :data="{type:'MainSite'}"
            name="fileName"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="save('form')" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import addhead from '@/components/common/head/head'
  import {addFloor,editingDetail,changeFloor} from '@/api/release/floorManage'
  export default {
    inject:['reload','imgurl'],
    name:'AddFloor',
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('楼层名字不能为空'));
        }
        setTimeout(() => {
          var reg = /^[^"'”“‘’\\]+$/;
          if (!reg.test(value)) {
            callback(new Error('不能包含特殊字符'));
          } else {
            if (value.length > 10) {
              callback(new Error('不能超过20个字'));
            } else {
              callback();
            }
          }
        }, 500);
      };
      var checkIndex = (rule, value, callback) => {
        value = value-0;
        if (!value) {
          return callback(new Error('优先级不能为空'));
        }
        setTimeout(() => {
          if (value<0||value>1000) {
            callback(new Error('请输入0~1000的整数'));
          } else {
            if (value%1 !== 0) {
              callback(new Error('请输入整数'));
            } else {
              callback();
            }
          }
        }, 500);
      };
      return {
        editId:null,
        headerToken:{'Authorization':'Bearer '+this.$auth.token},
        imageUrl: '',
        loading:false,
        form: {
          name:'',
          id:null,
          index:null,
          imageId:null
        },
        rules:{
          name: [
            { validator: checkName, trigger: 'blur' }
          ],
          index:[
            { validator: checkIndex, trigger: 'blur' }
          ],
          imageId:[
            { required: true, message: '请上传楼层展示图', trigger: 'blur' }
          ]
          
        }
      };
    },
    components:{
      addhead
    },
    activated(){
      this.editId = this.$route.query.id;
      if(this.editId){
        editingDetail(this.editId).then(res=>{
          if(res.code=='000000'){
            this.form.name = res.data.name;
            this.form.index = res.data.index;
            this.imageUrl = this.imgurl+res.data.fileDTOList[0].path
            this.form.imageId= res.data.imageId
          }
        })
      }
    },
    methods: {
      beforeAvatarUpload(file){
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isLt2M;
      },
      handleAvatarSuccess(res, file){
        if(res.code=='000000'){
          this.imageUrl = URL.createObjectURL(file.raw);
          this.form.imageId = res.data.id
          this.$message({
            message:'上传成功',
            type:'success'
          })
        }else {
          this.$message({
            message:'上传失败',
            type:'error'
          })
        }
      },
      save(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(!this.editId){
                addFloor({
                index:this.form.index-0,
                imageId:this.form.imageId,
                name: this.form.name
              }).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                      message: '楼层已添加',
                      type: 'success'
                  });
                  this.reload();
                }
              })
            }else{
              changeFloor(this.editId,{
                index:this.form.index-0,
                imageId:this.form.imageId,
                name: this.form.name
              }).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                      message: '楼层已更新',
                      type: 'success'
                  });
                  this.reload();
                }
              })
            }
            
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped lang="less">
  .addSecond{
    .footerBox{
      margin: 40px 0;
      position: relative;
      border-left: 1px solid #e4e4e4;
      border-right: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      .el-input{
        height: 30px;
      }
      .el-form{
        padding:30px;
        .el-form-item{
          .el-input{
            width: 500px;
          }
          .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 107px;
            height: 107px;
            line-height: 107px;
            text-align: center;
          }
          .avatar {
            width:100%;
            display: block;
          }
          .deleteBox{
            margin-left: 10px;
          }
          .hierarchy{
            color: red;
          }
        }

      }
    }
  }
</style>
