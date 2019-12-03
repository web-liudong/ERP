<template>
  <el-dialog title="手动推送配送状态" :visible.sync="isShow" width="500px" class="dialog-box">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules" v-if="type == 1">
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;">
              <i>*</i>设置仓库响应时间：
            </el-col>
            <el-col :span="14">
              <el-form-item prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="selectPicker"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules" v-else-if="type == 2">
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;">
              <i>*</i>设置仓库响应时间：
            </el-col>
            <el-col :span="14">
              <el-input v-model="tableData.t1" disabled></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;">
              <i>*</i>设置仓库发货时间：
            </el-col>
            <el-col :span="14">
              <el-form-item prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  @change="selectPicker"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules" v-else>
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;">
              <i>*</i>设置仓库响应时间：
            </el-col>
            <el-col :span="14">
              <el-input v-model="tableData.t1" disabled></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;">
              <i>*</i>设置仓库发货时间：
            </el-col>
            <el-col :span="14">
              <el-input v-model="tableData.t2" disabled></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;">
              <i>*</i>设置确认送达时间：
            </el-col>
            <el-col :span="14">
              <el-form-item prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions1"
                  @change="selectPicker"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  setWmsResponse,
  setWmsDelivery,
  setWmsSigned,
  getWmsManual
} from "@/api/order/orderManage";
import { parseTime } from "@/utils/index"
export default {
  props: {},
  data() {
    return {
      isShow: false,
      tableData: {
        t1: "",
        t2: ""
      },
      type: 0,
      orderId: "",
      orderStatus: "",
      pickerOptions: null,
      pickerOptions1: null,
      tips:"",
      form: {
        time: ""
      },
      rules: {
        time: [
          {
            validator: this.checkTime,
            // message: "设置时间需晚于仓库响应时间且早于当前系统时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    init(o) {
      this.type = o.type;
      this.form.time == "";
      this.orderId = o.info.id;
      this.orderStatus = o.info.status;
      if (this.type > 1) {
        this.getData();
      }
      this.isShow = true;
    },
    async getData() {
      await getWmsManual(this.orderId).then(res => {
        if(res.data){
          res.data[0] && (this.tableData.t1 = parseTime(res.data[0]))
          res.data[1] && (this.tableData.t2 = parseTime(res.data[1]))
        }
      });
      if (this.type == 2) {
        this.tips = "设置时间需晚于仓库响应时间且早于当前系统时间";
        let t = new Date(this.tableData.t1);
        let curDate = new Date(t.setDate(t.getDate() - 1));
        this.pickerOptions = {
          disabledDate: time => {
            return (
              time.getTime() < curDate.getTime()
            );
          },
          onClick(){

          }
        };
      }
      if (this.type == 3) {
        this.tips = "设置时间需晚于仓库发货时间且早于当前系统时间";
        let t = new Date(this.tableData.t2);
        let curDate = new Date(t.setDate(t.getDate() - 1));
        this.pickerOptions1 = {
          disabledDate: time => {
            return (
              time.getTime() < curDate.getTime() 
              //&& new Date(time).toDateString() != new Date().toDateString()
            );
          }
        };
      }
    },
    checkTime(rule, value, callback){
      if (value == "") {
        return callback(new Error(this.tips));
      }
      callback();
    },
    selectPicker(t) {
      let pretime = this.type == 2 ? this.tableData.t1 : this.tableData.t2;
      let ischeckPrep = true;
      if(this.type > 1){
        ischeckPrep = new Date(t).getTime() > new Date(pretime).getTime();
      }
      if (!ischeckPrep || new Date(t).getTime() > Date.now()) {
        this.form.time = "";
      }
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if(this.type == 1){
            this.handlerRespone();
          }else if(this.type == 2){
            this.handlerDelivery();
          }else{
            this.handlerSigned();
          }
        } else {
          console.log("error submit!!");
        }
      });
    },
    handlerRespone() {
      setWmsResponse(this.orderId, this.orderStatus, this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "deliverGoods");
      });
    },
    handlerDelivery() {
      setWmsDelivery(this.orderId, this.orderStatus, this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "deliverGoods");
      });
    },
    handlerSigned() {
      setWmsSigned(this.orderId, this.orderStatus, this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "deliverGoods");
      });
    }
  }
};
</script>
<style scoped lang="less">
.tips {
  color: red;
  padding-left: 20px;
}
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
</style>
<style scoped>
.dialog-box >>> .el-form-item,
.dialog-box >>> .el-form-item__content {
  width: 100%;
}
.dialog-box >>> .el-date-editor.el-input {
  width: 100%;
}
</style>