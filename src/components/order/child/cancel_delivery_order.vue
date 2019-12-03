<template>
  <el-dialog title="取消发货单提示" :visible.sync="isShow" width="800px">
    <div class="list">
      <table border="1">
        <tr>
          <th>发货单ID：</th>
          <td>{{orderInfo.orderDeliveryNo}}</td>
          <th>发货仓库：</th>
          <td>{{orderInfo.warehouseName}}</td>
          <th>发货单创建时间：</th>
          <td>{{orderInfo.orderDeliveryCreateTime}}</td>
        </tr>
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.orderNo}}</td>
          <th>外部订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
          <th>备注订单号：</th>
          <td>{{orderInfo.memoOrderNo}}</td>
        </tr>
      </table>
    </div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="optionItem" ref="cancelOrderForm">
          <el-row :gutter="10">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>取消发货单原因：
            </el-col>
            <el-col :span="18">
              <el-form-item label prop="select">
                <el-select v-model="optionItem.select" placeholder="取消发货单原因" @change="selectItem">
                  <el-option
                    v-for="item in reasonList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="isOther">
            <el-col :span="5" style="text-align:right;">
              <i>*</i>其他原因：
            </el-col>
            <el-col :span="18">
              <el-form-item prop="desc">
                <el-input
                  v-model="optionItem.desc"
                  type="textarea"
                  rows="5"
                  placeholder="字数长度1~200以内"
                ></el-input>
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
import { cancelOrder } from "@/api/order/invoiceOrder";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      tableData: {},
      orderInfo:{},
      reasonList: [
        {
          id:1,
          name:"重新生成发货单"
        },
        {
          id:2,
          name:"商品多选/错选/少选"
        },
        {
          id:3,
          name:"其他原因"
        }
      ],
      cityList: [],
      countyList: [],
      optionItem:{
        select:"",
        desc:""
      },
      isOther:false,
      form: {
        description: "",
        operationUserId: this.$auth.user.id,
        orderId: "",
        orderStatus: ""
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.reset();
      this.orderInfo = row;
      this.isShow = true;
    },
    reset(){
      this.optionItem = {
        select:"",
        desc:""
      }
      this.isOther = false;
    },
    selectItem(val){
      if(val == "其他原因"){
        this.optionItem.select = val;
        this.isOther = true;
      }else{
        this.optionItem.select = val;
        this.isOther = false;
      }
    },
    submitForm(name) {
      if(this.optionItem.select == ""){
        this.$message({
          type: "warning",
          message: "请选择取消订单原因!"
        });
        return false;
      }
      if(this.isOther && this.optionItem.desc == ""){
        this.$message({
          type: "warning",
          message: "请填写其他原因!"
        });
        return false;
      }
      if(this.optionItem.desc.length > 200){
        this.$message({
          type: "warning",
          message: "字数长度1~200以内"
        });
        return false;
      }
      let description = this.isOther ? this.optionItem.desc : this.optionItem.select;
      cancelOrder(this.orderInfo.id, this.orderInfo.deliveryStatus, {reason:description}).then(res => {
        this.isShow = false;
        this.$emit("callback", "cancelOrder");
      });
    }
  }
};
</script>
<style scoped lang="less">
.tips{
  color: red;
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