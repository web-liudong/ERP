<template>
<el-dialog class="orderTips" title="提示" :visible.sync="dialogFormVisible">
      <div class="borderBox">
        <table border="1" v-if="tableData">
        <tr>
          <th>订单号：</th>
          <td>{{tableData.no}}</td>
          <th>下单时间：</th>
          <td>{{tableData.createTime}}</td>
        </tr>
        <tr>
          <th>客户名称：</th>
          <td>{{tableData.customerName}}</td>
          <th>收货地址：</th>
          <td>{{tableData.customerReceiptAddress}}</td>
        </tr>
        <tr>
          <th>销售员：</th>
          <td>{{tableData.recipientName}}</td>
          <th>联系方式：</th>
          <td>{{tableData.recipientPhone}}</td>
        </tr>
        <tr>
          <th >期望送货日期：</th>
          <td colspan="3">{{tableData.expectedDeliveryDate}}</td>
        </tr>
        </table>

      </div>
     <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogFormVisible=false">关 闭</el-button>
  </div>
</el-dialog>
</template>

<script>
import {findOrderDetail} from '@/api/purchase/purchase.js'
export default {
    data(){    
        return{
            dialogFormVisible:false,
            tableData:null,
        }
    },
    methods:{
      init(name){
        this.dialogFormVisible=true;
        findOrderDetail(name.orderNo).then(res=>{
          this.tableData=res.data;
        })
      },
    }
}
</script>

<style lang="less" scoped>
.orderTips{
table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          color:#303133;
          text-align: right;
          width:20%;
          i{
            color:red;
          }
        }
        td{
          color: #666666;
          text-align: left;
          padding-left:10px;
          width:30%;
        }
      }

}


</style>




