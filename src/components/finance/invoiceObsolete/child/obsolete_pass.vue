<template>
  <el-dialog title="发票作废初审" :visible.sync="isShow">
    <div style=" overflow-y:auto; overflow-x:auto; width:100%; height:300px;">
      <table border="1">
        <tr>
          <th>发票号码：</th>
          <td>{{table.invoiceNumber}}</td>
          <th>发票类型：</th>
          <td>
            <span v-if="table.invoiceType == 'VAT_INVOICE'">专票</span>
            <span v-if="table.invoiceType == 'PLAIN_INVOICE'">普票</span>
            <span v-if="table.invoiceType == 'ELECTRONIC_INVOICE'">电子发票</span>
          </td>
        </tr>
        <tr>
          <th>发票代码：</th>
          <td>{{table.invoiceCode}}</td>
          <th>开票日期：</th>
          <td>{{table.createTime}}</td>
        </tr>
        <tr>
          <th>发票金额：</th>
          <td>{{table.amount}}元</td>
          <th>发票抬头：</th>
          <td>{{table.invoiceTitle}}</td>
        </tr>
        <tr>
          <th>承诺退回日期：</th>
          <td>{{table.returnTime}}</td>
          <th>
            <i>*</i>纸质票（专票，普票）是否收到：
          </th>
          <td v-if="table.receivedInvoice">是</td>
          <td v-else>否</td>
        </tr>
        <tr colspan="3">
          <th>退票原因：</th>
          <td>{{table.invalidReason}}</td>
        </tr>
      </table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm(table.id)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { putBathPass } from "@/api/finance/invoiceObsolete";
export default {
  data() {
    return {
      isShow: false,
      table: {}
    };
  },
  methods: {
    init(row) {
      this.isShow = true;
      this.table = row;
      console.log(this.table);
    },
    submitForm(id) {
      // console.log(id);
      putBathPass(id).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.isShow = false;
          this.$parent.dialogCallback();
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
table {
  width: 90%;
  margin: 20px auto;
  td,
  th {
    border: 1px solid #d1d1d1;
    font-size: 14px;
    line-height: 42px;
  }
  th {
    padding-right: 6px;
    box-sizing: border-box;
    background: #f5f7fa;
    font-weight: 700;
    font-size: 14px;
    text-align: right;
    width: 20%;
    i {
      color: red;
    }
  }
  td {
    color: #666666;
    text-align: left;
    padding-left: 10px;
    width: 30%;
  }
}
</style>