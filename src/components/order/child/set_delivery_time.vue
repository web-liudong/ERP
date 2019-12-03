<template>
  <el-dialog title="发货确认" :visible.sync="isShow" width="600px">
    <p class="tips">发货单最新配送状态：已接受（{{formatTime(deliveryTime)}}）</p>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="optionItem" ref="cancelOrderForm">
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>发货时间：
            </el-col>
            <el-col :span="16">
              <el-form-item label prop="time">
                <el-date-picker
                  v-model="optionItem.time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
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
      <el-button type="primary" @click="submitForm('cancelOrderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDeliveryOrderAcceptedTime, deliveryOrderHanded } from "@/api/order/invoiceOrder";
import { parseTime } from "@/utils/index";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      orderInfo:{},
      deliveryTime:"",
      optionItem:{
        time:""
      },
      limitDate:null,
      pickerOptions: null,
      isOther:false,
    };
  },
  mounted() {
  },
  methods: {
    init(row) {
      this.reset();
      this.orderInfo = row;
      this.initData(row.id);
      this.isShow = true;
      //缺少配送接受时间
    },
    async initData(id) {
      let res = await getDeliveryOrderAcceptedTime(id);
      this.deliveryTime =  res.data;
      let t = new Date(this.deliveryTime);
      this.limitDate = new Date(t.setDate(t.getDate() - 1));
      this.pickerOptions = {
        disabledDate:time => {
          return (
            time.getTime() < this.limitDate.getTime()
          );
        }
      }
    },
    reset(){
      this.optionItem = {
        time:""
      }
    },
    selectPicker(t){
      let curTime = new Date(t).getTime();
      if(curTime < new Date(this.deliveryTime).getTime() || curTime > Date.now()){
        this.optionItem.time = "";
        this.$message({
          type: "error",
          message: "发货时间要大于最新配送时间，并小于当前时间!"
        });
      }
    },
    formatTime(t) {
      return parseTime(t);
    },
    submitForm(name) {
      if(this.optionItem.time == ""){
        this.$message({
          type: "warning",
          message: "请选择发货时间!"
        });
        return false;
      }
      deliveryOrderHanded(this.orderInfo.id, this.orderInfo.deliveryStatus, {deliveryTime:this.optionItem.time}).then(res => {
        this.isShow = false;
        this.$emit("callback", "cancelOrder");
      });
    }
  }
};
</script>
<style scoped lang="less">
.tips{
  padding-left: 20px;
}
.list{
  table {
    width: 95%;
    margin: 20px auto;
    td,
    th {
      border: 1px solid #d1d1d1;
      font-size: 12px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    th {
      padding-right: 6px;
      box-sizing: border-box;
      color: #666;
      font-weight: 700;
      font-size: 14px;
      text-align: right;
      width: 15%;
      background-color: #f9fafc;
      i {
        color: red;
      }
    }
    td {
      color: #666666;
      text-align: left;
      padding-left: 10px;
      width: 17%;
      line-height: 20px;
      &:last-child{
        width: 21%;
      }
      span {
        margin-right: 10px;
        display: inline-block;
      }
    }
    .tit {
      text-align: left;
      padding-left: 10px;
    }
  }
}
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-select{
  width: 350px;
}
.el-textarea{
  width: 445px;
}
</style>