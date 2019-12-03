<!-- 回款信息添加，编辑 -->
<template>
<div class="PaymentInformationadd">
  <div class="top">
    <i class="iconfont icon-jinqi"></i>
    <span>回款消息</span>
  </div>
<el-form :model="formInline" class="demo-form-inline" :rules="rules" label-width="150px">
  <el-form-item label="记账日期:" prop="time">
     <el-date-picker
      v-model="formInline.time"
      type="date"
      :clearable="false"
      placeholder="点击选择时间" :picker-options="pickerOptions">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="流水号:" prop="serialNumber">
     <el-input v-model="formInline.serialNumber" placeholder="字符长度1~100"></el-input>
  </el-form-item>
  <!-- <el-form-item label="记账日期:" prop="time">
     <el-date-picker
     :disabled="true"
      v-model="formInline.time"
      type="date"
      placeholder="点击选择时间" :picker-options="pickerOptions">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="流水号:" prop="serialNumber">
     <el-input :disabled="true" v-model="formInline.serialNumber" placeholder="字符长度1~100"></el-input>
  </el-form-item> -->
   <el-form-item prop="money">
     <span slot="label"><i style="color:red;">* </i>回款金额:</span>
    <el-input v-model="formInline.money" placeholder="0.00" type="number"><i slot="suffix">元</i></el-input>
  </el-form-item>
  <el-form-item label="对方户名:">
    <el-input v-model="formInline.yourname" placeholder="字数长度1~30"></el-input>
  </el-form-item>
  <el-form-item label="对方账号:">
    <el-input v-model="formInline.number" placeholder="字数长度1~30"></el-input>
  </el-form-item>
  <el-form-item label="支行名:" prop="subbranch">
     <el-input v-model="formInline.subbranch" placeholder="字符长度1~100"></el-input>
  </el-form-item>
  <el-form-item label="用途:">
    <el-input v-model="formInline.use" placeholder="字数长度1~50"></el-input>
  </el-form-item>
   <el-form-item label="服务项目:">
    <el-select
            v-model="formInline.itemitem"
            filterable
            remote
            clearable
            placeholder="服务项目"
            :loading="loading"
            :remote-method="serviceItems">
            <el-option
              v-for="item in items"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
  </el-form-item>
   <el-form-item label="所属省份:">
    <el-select v-model="formInline.Province" placeholder="请输入所属省份" clearable>
        <el-option
          v-for="item in Provinces"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
    </el-select>
  </el-form-item>
  <el-form-item style="margin-left:300px">
    <el-button type="primary" @click="save(formInline)">保存</el-button>
    <el-button @click="cancel('formInline')">取消</el-button>
  </el-form-item>
</el-form>
<!-- 删除弹出框 -->
  <el-dialog
  title="取消确认"
  :visible.sync="tuichuVisible"
  width="400px">
  <span style="font-size: 20px">取消后，数当前填写的数据不保存，确认取消？</span>
  <span slot="footer" class="dialog-footer">
    <el-button style="line-height: 10px;height: 40px;" @click="tuichuVisible = false">取消</el-button>
    <el-button style="line-height: 10px;height: 40px;" type="primary" @click="closeclose">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
  // 注入接口
  import {shengAreaid,stedata,searchProject,getdata,changedata} from '@/api/finance/PaymentInformation'
  import {returnFloat} from "@/utils";
  export default {
    name: "PaymentInformationAdd",
    inject:['reload','close'],//注入依赖
    data() {
        var checkmoney = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('回款金额不能为空'));
          }
          setTimeout(() => {
            if (value.toString().split(".")[1].length>2) {
              callback(new Error('最多只能两位小数'));
            } else {
              callback();
            }
          }, 500);
        };
        return{
          pickerOptions: {
            disabledDate: (date) => {
              return date.getTime() > Date.now()
            }
          },
          tuichuVisible:false,
          updateTime:"",
          formInline:{
            time:"",
            serialNumber:"",
            money:"",
            yourname:"",
            number:"",
            subbranch:"",
            formatdatetime:"",
            use:"",
            itemitem:"",
            Province:""
          },
          newitemitem:"",
          loading:false,
          items:[],
          Provinces:[],
          id:"",
          rules: {
            money: [
              { validator: checkmoney, trigger: 'blur'}
            ],
            time:[
              {required: true, message: '记账日期不得为空', trigger: 'blur'}
            ],
            serialNumber:[
              {required: true, message: '流水号不得为空', trigger: 'blur'}
            ]
          }
        }
    },
    activated() {
    if (this.id != this.$route.query.id) {
      this.createdid();
    }
  },
    created(){
      if (this.$route.query.id) {
        this.createdid();
      }
      // if (this.$route.query.id) {
      //   getdata(this.$route.query.id).then(res => {
      //     this.updateTime=res.data.updateTime
      //     this.formInline.itemitem = res.data.projectId;
      //     this.items = [{
      //       name:res.data.projectName,
      //       id:res.data.projectId
      //     }]
      //     this.formInline.yourname=res.data.accountName;
      //     this.formInline.number=res.data.accountNo;
      //     this.formInline.time=res.data.keepingAccountsDate;
      //     this.formInline.Province=res.data.provinceId;
      //     this.formInline.money= returnFloat(res.data.receivedAmount);
      //     this.formInline.use=res.data.uses;
      // });
      // }
      // this.createdid();
      shengAreaid().then(res => {
        this.Provinces=res.data;
      });
    },
    
    methods: {
       closeclose(){
        this.close({name:'PaymentInformationAdd', to: {name:'PaymentInformation', params:{isUpdate:true}}});
      },
      createdid(){
      this.id = this.$route.query.id
      if (this.id) {
        getdata(this.id).then(res => {console.log(res.data)
          this.updateTime=res.data.updateTime
          this.formInline.itemitem = res.data.projectId;
          this.items = [{
            name:res.data.projectName,
            id:res.data.projectId
          }]
          this.formInline.yourname=res.data.accountName;
          this.formInline.number=res.data.accountNo;
          this.formInline.time=res.data.keepingAccountsDate;
          this.formInline.Province=res.data.provinceId;
          this.formInline.money= returnFloat(res.data.receivedAmount);
          this.formInline.use=res.data.uses;
          //新增流水号，支行名
          this.formInline.serialNumber=res.data.serialNumber;
          this.formInline.subbranch=res.data.subbranch;
      });
      }
    },
    addDateZero(num) {
        return (num < 10 ? "0" + num : num);
    },
    datatimechange(val){
      let d = new Date(val);
      this.formatdatetime= d.getFullYear() + '-' + this.addDateZero(d.getMonth() + 1) + '-' + this.addDateZero(d.getDate());
    },

      save(val){
        let data={};
        if (this.$route.query.id){
          if (this.formInline.time==""||this.formInline.serialNumber==""||isNaN(this.formInline.money)) {
            this.$message({
           showClose: false,
          message: '<p>必填数据为空或数据格式不正确,请检查修正后再保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        });
          }else{
            this.datatimechange(this.formInline.time);
          if (this.newitemitem==this.formInline.itemitem) {
            searchProject({"name":this.newitemitem,"id": ""}).then(res => {

        data={
                  "accountName":this.formInline.yourname,
                  "accountNo":this.formInline.number,
                  "keepingAccountsDate":this.formatdatetime,
                  "projectId":res.data[0].id,
                  "provinceId":this.formInline.Province,
                  "receivedAmount":this.formInline.money,
                  "uses":this.formInline.use,
                   "updateTime":this.updateTime,
                    //新增流水号，支行名
                   "serialNumber":this.formInline.serialNumber,
                   "subbranch":this.formInline.subbranch,
                  }

                  changedata(this.$route.query.id,data).then(res => {
                    this.$message({
           showClose: false,
          message: '<p>操作成功,已成功保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'success',
          center: true
        });
                    this.close({name:'PaymentInformationAdd', to: {name:'PaymentInformation', params:{isUpdate:true}}});

      });
      });
          }else{
           data={
                  "accountName":this.formInline.yourname,
                  "accountNo":this.formInline.number,
                  "keepingAccountsDate":this.formatdatetime,
                  "projectId":this.formInline.itemitem,
                  "provinceId":this.formInline.Province,
                  "receivedAmount":this.formInline.money,
                  "uses":this.formInline.use,
                   "updateTime":this.updateTime,
                   //新增流水号，支行名
                   "serialNumber":this.formInline.serialNumber,
                   "subbranch":this.formInline.subbranch,
                  }

                  changedata(this.$route.query.id,data).then(res => {
                    this.$message({
           showClose: false,
          message: '<p>操作成功,已成功保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'success',
          center: true
        });
                    this.close({name:'PaymentInformationAdd', to: {name:'PaymentInformation', params:{isUpdate:true}}});

      });
          }
          }
        }else{
          if (this.formInline.time=="") {
            this.$message({
           showClose: false,
          message: '<p>必填数据项(记账日期)为空,请检查修正后再保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        });
          }else if (this.formInline.serialNumber=="") {
            this.$message({
           showClose: false,
          message: '<p>必填数据项(流水号)为空,请检查修正后再保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        });
          }else if (this.formInline.money=="") {
            this.$message({
           showClose: false,
          message: '<p>必填数据项(回款金额)为空,请检查修正后再保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        });
          }else if (isNaN(this.formInline.money)) {
            this.$message({
           showClose: false,
          message: '<p>必填数据项(回款金额)数据格式错误,请检查修正后再保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        });
          }else{
            this.datatimechange(this.formInline.time);
            console.log(111111)
            data={
                  "accountName":this.formInline.yourname,
                  "accountNo":this.formInline.number,
                  "keepingAccountsDate":this.formatdatetime,
                  "projectId":this.formInline.itemitem,
                  "provinceId":this.formInline.Province,
                  "receivedAmount":this.formInline.money,
                  "uses":this.formInline.use,
                   //新增流水号，支行名
                   "serialNumber":this.formInline.serialNumber,
                   "subbranch":this.formInline.subbranch,

                  }
          stedata(data).then(res => {
            this.$message({
           showClose: false,
          message: '<p>操作成功,已成功保存</p> ',
          dangerouslyUseHTMLString: true,
          type: 'success',
          center: true
        });
            this.close({name:'PaymentInformationAdd', to: {name:'PaymentInformation', params:{isUpdate:true}}});
      });
          }
          
        }
      },
      // 关闭页面
      cancel(){
        this.close({name:'PaymentInformationAdd', to: {name:'PaymentInformation', params:{isUpdate:true}}});
      },
      serviceItems(query){
      if(query){
        this.loading = true
        searchProject({"name":query,"id": ""}).then(res => {
        this.loading = false
        this.items=res.data
      });
        }
      
    },
}
}
</script>
<style scoped lang="less">
.PaymentInformationadd{
      width: 100%;
      font-size: 12px;
      // background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      margin-top:30px;
      clear: both;
      .top{
        border-bottom: 1px solid #e4e4e4;
        font-size: 17px;
        height: 40px;
        line-height: 40px;
        background-color: #f3f3f3;
        padding-left: 20px;
      }
      .el-form{
        margin-top: 50px;
        margin-left: 120px;
        .el-form-item{
          width: 1000px;
          .el-input{
            width: 700px;
          }
          .el-date-picker{
            width: 700px;
          }
          .el-select{
            width: 700px;
          }
        }
      }
}
</style>
