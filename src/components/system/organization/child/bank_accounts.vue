<template>
  <el-dialog :title="title" :visible.sync="isShow" class="accountsBox" width="700px">
    <el-form :model="reviewRejectSkuParam" :rules="rules" ref="reviewRejectSkuParam">
        <el-form-item label="开户行：" label-width="160px" prop="bank">
        <el-input
          placeholder="银行+支行信息,字数长度1~50字以内"
          v-model="reviewRejectSkuParam.bank"
          style="width:400px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="开户银行编号：" label-width="160px" prop="bankNo">
        <el-select
            v-model="reviewRejectSkuParam.bankNo"
            filterable
            remote
            reserve-keyword
            placeholder="请选择开户银行编号"
            :remote-method="remoteMethodBank"
            :loading="loading"
            style="width: 400px;"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.bankNo"
              :value="item.bankNo"
            ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="开户名：" label-width="160px" prop="accountName">
        <el-input
          placeholder="1~50汉字"
          clearable
          v-model="reviewRejectSkuParam.accountName"
          style="width:400px"
        ></el-input>
      </el-form-item>
       <el-form-item label="开户账号：" label-width="160px" prop="accountNo">
        <el-input
          placeholder=""
          clearable
          v-model="reviewRejectSkuParam.accountNo"
          style="width:400px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelForm()">取 消</el-button>
      <el-button type="primary" @click="submitForm('reviewRejectSkuParam')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  findBankList
} from "@/api/organizationManage";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      loading:false,
      options:[],
      reviewRejectSkuParam: {
        bank:null,
        bankNo:null,
        accountName:null,
        accountNo:null,
        isDefault:0,
      },
      title:null,
      index:null,
      rules: {
       bank: [
          {
          required:true,message:'开户行不能为空',trigger:'blur'
          },
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ],
         bankNo:[
          {required:true,message:'开户银行编号不能为空',trigger:'blur'}
        ],
        accountNo: [
          {
           required:true,message:'开户账号不能为空',trigger:'blur'
          },
          {
            min: 1,
            max: 50,
            message: "字数长度在1~50字以内",
            trigger: "change"
          }
        ],
        accountName:[
          {required:true,message:'开户名不能为空',trigger:'blur'},
          {min:1,max:50,trigger:'change',message:'字数长度在1~50字以内'}
        ],
      }
    };
  },
  mounted() {},
  methods: {
    init(data) {
        if(data){
            this.reviewRejectSkuParam=Object.assign({},data.row);
        }
        this.index=data.index;
        this.title=data.title;
        this.isShow = true;
    },  
    remoteMethodBank(query) {
      if (query !== "") {
        this.loading = true;
        let bbbb = { queryCount: 5, bankNo: query };
        findBankList(bbbb).then(res => {
          this.options = res.data;
          this.loading = false;
        });
      }
    },
    cancelForm(){
       this.isShow=false;
       this.reviewRejectSkuParam= {
        bank:null,
        bankNo:null,
        accountName:null,
        accountNo:null,
        isDefault:0,
      }
    },
    submitForm(name) {
       this.$refs[name].validate(valid => {
        if (valid) {
          this.$emit('callback',this.reviewRejectSkuParam,this.index);
          this.isShow=false;
          this.reviewRejectSkuParam={
                bank:null,
                bankNo:null,
                accountName:null,
                accountNo:null,
                isDefault:0
            }
          this.index=null;    
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
  margin-top: 20px;
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
