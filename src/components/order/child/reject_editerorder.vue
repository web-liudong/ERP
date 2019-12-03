<template>
  <el-dialog title="改单驳回" :visible.sync="isShow">
    <el-form :model="reviewRejectSkuParam" :rules="rules" ref="reviewRejectSkuParam">
      <el-form-item label="改单驳回原因：" label-width="160px" prop="des">
        <el-select
          v-model="reviewRejectSkuParam.des"
          placeholder="改单驳回原因"
          style="width:400px"
          @change="getData"
        >
          <el-option label="不符合项目规则" value="不符合项目规则"></el-option>
          <el-option label="对方操作失误" value="对方操作失误"></el-option>
          <el-option label="其他原因" value="其他原因"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="驳回原因：" label-width="160px" prop="reason" v-if="isActive">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="1~200字以内"
          v-model="reviewRejectSkuParam.reason"
          style="width:400px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelData()">取 消</el-button>
      <el-button type="primary" @click="submitForm('reviewRejectSkuParam')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {auditerNoPass,editerRejectCheck} from '@/api/ordernodraft';
export default {
  props: {},
  data() {
    return {
      isShow: false,
      reviewRejectSkuParam: {
        id: '',
        reason: "",
        des: ""
      },
      status:this.$route.query.status,
      // status:null,//订单状态
      isActive: false,
      rules: {
        reason: [
          {
            required: true,
            message: "请选择驳回原因",
            trigger: "blur"
          }
        ],
        des:[{required:true,message:'请选择改单驳回原因',trigger:'blur'}]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.reviewRejectSkuParam.id = row.id;
      this.status=row.status;
    },
    getData(val) {
     console.log(val)
      if (val == '其他原因') {
        this.isActive = true;
      }else{
          this.isActive=false
      }
    },
    cancelData(){
     this.isShow=false;
     this.reviewRejectSkuParam.des=null;
    },
    submitForm(name) {
       this.$refs[name].validate(valid => {
        if (valid) {
          if(this.reviewRejectSkuParam.des!='其他原因'){
           this.reviewRejectSkuParam.reason=this.reviewRejectSkuParam.des;
          } 
         editerRejectCheck(this.reviewRejectSkuParam.id,this.status).then(res=>{
          if(res.data==0){
           auditerNoPass(this.reviewRejectSkuParam).then(res=>{
           if(res.code=='000000'){
               this.$message({
                   message:'驳回成功',
                   type:'success'
               })
               this.isShow=false;
               this.$emit('callback')
           }           
         })
          this.$emit("callback");
          }else if(res.data==2){
            this.$confirm(res.message, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              })
                .then(res => {
                 this.isShow=false;
                 this.$emit('callback')
                 window.localStorage.setItem("EDITERORDERMANAGE_LIST", Date.now())                
                })
                .catch(() => {}); 
          }
         })
         
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-autocomplete {
  width: 100%;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
.dialogWrap >>> .el-dialog__body {
  height: 50vh;
  overflow: auto;
}
</style>
