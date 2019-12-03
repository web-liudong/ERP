<template>
  <el-dialog title="取消订单驳回" :visible.sync="isShow">
    <el-form :model="reviewRejectOrderCancelReviewParam" :rules="rules" ref="reviewRejectOrderCancelReviewParam">
      <el-form-item label="取消订单驳回原因：" label-width="160px" prop="des">
        <el-select
          v-model="reviewRejectOrderCancelReviewParam.des"
          placeholder="请输入驳回原因"
          style="width:400px"
          @change="getData"
        >
          <el-option label="不符合项目规则" value="不符合项目规则"></el-option>
          <el-option label="对方操作失误" value="对方操作失误"></el-option>
          <el-option label="客户已收货" value="客户已收货"></el-option>
          <el-option label="非客户自愿取消订单" value="非客户自愿取消订单"></el-option>
          <el-option label="其他原因" value="其他原因"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="驳回原因：" label-width="160px" prop="partyBNoPassReason" v-if="isActive">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="1~200字以内"
          v-model="reviewRejectOrderCancelReviewParam.partyBNoPassReason"
          style="width:400px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelData()">取 消</el-button>
      <el-button type="primary" @click="submitForm('reviewRejectOrderCancelReviewParam')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {rejectCancelOrder,testRejectCancelOrder} from '@/api/ordernodraft';
export default {
  props: {},
  data() {
    return {
      isShow: false,
      reviewRejectOrderCancelReviewParam: {
        id: '',
        partyBNoPassReason: "",
        des: ""
      },
      isActive: false,
      rules: {
        partyBNoPassReason: [
          {
            required: true,
            message: "请选择驳回原因",
            trigger: "blur"
          }
        ],
        des:[{required:true,message:'220',trigger:'blur'}]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.isShow = true;
      this.reviewRejectOrderCancelReviewParam.id = row.id;
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
     this.reviewRejectOrderCancelReviewParam.des=null;
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if(this.reviewRejectOrderCancelReviewParam.des!='其他原因'){
           this.reviewRejectOrderCancelReviewParam.partyBNoPassReason=this.reviewRejectOrderCancelReviewParam.des;
          } 
         testRejectCancelOrder(this.reviewRejectOrderCancelReviewParam.id).then(res=>{
           if(res.success==true){
              rejectCancelOrder(this.reviewRejectOrderCancelReviewParam).then(res=>{
           if(res.code=='000000'){
               this.$message({
                   message:'驳回成功',
                   type:'success'
               })
               this.isShow=false;
           }           
           })
           this.$emit("callback");
           }else if(res.success==false){
             this.isShow=false;
             this.$emit('callback')
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
