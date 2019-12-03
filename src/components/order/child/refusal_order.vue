<template>
  <el-dialog title="拒单" :visible.sync="isShow" width="800px">
    <div class="list">
      <table border="1">
        <tr>
          <th>订单号：</th>
          <td>{{orderInfo.no}}</td>
          <th>外部订单号：</th>
          <td>{{orderInfo.customerOrderNo}}</td>
          <th>下单时间：</th>
          <td>{{orderInfo.createTime}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{orderInfo.projectName}}</td>
          <th>客户：</th>
          <td>{{orderInfo.customerName}}</td>
          <th>客户采购人：</th>
          <td>{{orderInfo.customerUserName}}</td>
        </tr>
        <tr v-if="orderInfo.secondServerId">
          <th>派单员：</th>
          <td>{{orderInfo.assignUserName}}</td>
          <th>服务方：</th>
          <td>{{orderInfo.firstServerName}}</td>
          <th>第二服务方：</th>
          <td>{{orderInfo.secondServerName}}</td>
        </tr>
        <tr v-else>
          <th>派单员：</th>
          <td>{{orderInfo.assignUserName}}</td>
          <th>服务方：</th>
          <td colspan="3">{{orderInfo.firstServerName}}</td>
        </tr>
      </table>
    </div>
    <el-row>
      <el-col>
        <el-form :inline="true" :model="optionItem" ref="orderForm">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>拒接单原因：
            </el-col>
            <el-col :span="18">
              <el-form-item label prop="select">
                <el-select v-model="optionItem.select" placeholder="拒接单原因" @change="selectItem">
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
            <el-col :span="4" style="text-align:right;">
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
      <el-button type="primary" @click="submitForm('orderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { rejectOrder } from "@/api/order/orderManage";
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
          name:"客户订单下错，取消重新下单"
        },
        {
          id:2,
          name:"客户需要增加订单商品数量，取消后重新下单"
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
        orderId: "",
        serverId: ""
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.reset();
      this.orderInfo = row;
      this.form.orderId = row.id;
      this.form.serverId = row.firstServerId;
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
          message: "请选择拒接单原因!"
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
      this.form.description = this.isOther ? this.optionItem.desc : this.optionItem.select;
      rejectOrder(this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "refusalOrder");
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
    margin: 0 auto;
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