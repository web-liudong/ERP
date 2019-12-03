<template>
  <el-dialog title="已选应付账款" :visible.sync="isShow" width="70%" class="clearfix">
    <el-table :data="tableData" border style="width: 100%" size="small">
      <el-table-column prop="customerName" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单号" align="center" width="150">
        <template slot-scope="scope">
          <el-button
            @click="oepnWin('OrderDetail',{ id: scope.row.orderId })"
            type="text"
            size="small"
          >{{scope.row.orderNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="serverName" label="服务方" align="center"></el-table-column>
      <el-table-column prop="serverAccountInfo" label="收款账号信息" align="center"></el-table-column>
      <!-- <el-table-column prop="orderAmountText" label="订单金额" align="center"></el-table-column> -->
      <!-- <el-table-column prop="settledAmountText" label="已结算金额" align="center"></el-table-column> -->
      <!-- <el-table-column prop="amountInvoicedText" label="已开票金额" align="center"></el-table-column> -->
      <el-table-column prop="claimAmountText" label="已收账款" align="center"></el-table-column>
      <el-table-column prop="serverDateClaimAmountText" label="指定日期内已收账款" align="center"></el-table-column>
      <el-table-column prop="serverPayAmountText" label="已付账款" align="center"></el-table-column>
      <el-table-column prop="serverNoPayAmountText" label="已认款未支付账款" align="center"></el-table-column>
      <!-- <el-table-column prop="accountPayableText" label="应付账款" align="center"></el-table-column> -->
      <el-table-column prop="accountPaid" label="本次付款金额" align="center" width="200">
        <template slot-scope="scope" class="clear">
          <!-- <i style="position:absolute;top:50%;bottom:0;margin-top:-12px;right:189px">￥</i> -->
          <el-input
            placeholder="0.0000"
            v-model="scope.row.accountPaid"
            :max="parseInt(scope.row.serverNoPayAmountText)"
            :min="0"
            style="position:relative;"
            controls-position="right"
            @input="(query)=>{
              scope.row.accountPaid=query
            }"
          >
            <template slot="prepend">￥</template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button @click="closeList(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="color:red;font-size:14px;float:right;margin-bottom:20px;">
      <!-- <div>
        <span>应付总金额：￥{{accountsPayable}}</span>
      </div>
      <div>
        <span>已付总金额：￥{{paidAccount}}</span>
      </div>-->
      <div>
        <span>本次付款总金额：￥{{totalAccount}}</span>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" style="margin-top:30px;">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="payment()" v-if="$authorities.AccountsPayablePay">付款</el-button>
    </div>
    <el-dialog title="删除提示" :visible.sync="dialogVisible" width="25%">
      <span>确定要删除这条信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="make()">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import {
  closeAccountspayable,
  payment,
  paymentPageInit,
  importPayment
} from "@/api/finance/accountsPayable.js";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      row: null,
      isShow: false,
      tableData: null,
      name: "",
      fileId: null, //导入付款文件的id
      // accountsPayable: "", //应付总金额
      paidAccount: "",
      // totalAccount: "" //本次付款总金额
      claimAccountTimeEnd: null,
      claimAccountTimeStart: null,
      delete: null,
    };
  },
  mounted() {},
  computed: {
    // accountsPayable: function() {
    //   return this.tableData&&this.tableData.map((item)=>{
    //     console.log(item,'whp9988');
    //     return item.accountPayableText
    //     // =='--'?0:Number(item.accountPayableText.replace('￥',''))
    //   }).reduce((prev,cur)=>{
    //     return prev+cur
    //   },0)
    // },
    totalAccount: function() {
      return (
        this.tableData &&
        this.tableData
          .map((item, i) => {
            return Number(item.accountPaid);
          })
          .reduce((prev, cur) => {
            return prev + cur;
          }, 0)
      );
    }
  },
  methods: {
    init(row, name) {
      this.name = name.name;
      this.claimAccountTimeEnd = name.claimAccountTimeEnd;
      this.claimAccountTimeStart = name.claimAccountTimeStart;
      this.fileId = row && row.fileId;
      if (this.name == "导入模板数据") {
        this.$nextTick(() => {
          this.tableData = row.listItemDTOList;
          this.paidAccount = row.totalAccountPaid;
        });
      } else {
        this.row = row;
        this.getList();
      }
      this.isShow = true;
      console.log(this.accountsPayable, 555555);
    },
    oepnWin(name, query) {
      this.$router.push({
        name: name,
        query: query
      });
      this.isShow = false;
    },
    getList() {
      paymentPageInit({
        ids: this.row,
        claimAccountTimeStart: this.claimAccountTimeStart,
        claimAccountTimeEnd: this.claimAccountTimeEnd
      }).then(res => {
        this.tableData = res.data.listItemDTOList;
        console.log(res.data, "99999999999999999999999999999999999");
        // this.accountsPayable=res.data.sumAccountPayable;
        this.paidAccount = res.data.totalAccountPaid;
        // this.totalAccount=res.data.sumAccountPayment;
      });
    },
    payment() {
      this.$confirm(
        "付款操作后，系统将自动核销应付账款。确定付款吗？",
        "付款提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(res => {
        console.log(this.tableData, 66666);
        let array = [];
        array = this.tableData.map((item, i) => {
          return {
            id: item.id,
            accountPaid: item.accountPaid,
            version: item.version,
            paymentReceivedClaimAccountId: item.paymentReceivedClaimAccountId
          };
        });
        if (this.name == "导入模板数据") {
          importPayment(this.fileId, array).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "付款成功",
                type: "success"
              });
              this.isShow = false;
            }
          });
        } else {
          payment(array).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "付款成功",
                type: "success"
              });
              this.isShow = false;
              this.$emit("dialogCallback");
            }
          });
        }
      });
    },
    closeList(row) {
      // closeAccountspayable(row.id,row.version).then(res => {
      //   if (res.code == "000000") {
      //     this.$message({
      //       message: "关闭订单成功",
      //       type: "success"
      //     });
      //     this.getList();
      //   }
      // });
      console.log(row, "iiiiii");
      this.dialogVisible = true;
      this.delete = row.serverAccountInfo
      // this.tableData=this.tableData.filter((item,index)=>{
      //   return item.id==row.id
      // })
    },
    make() {
      this.tableData=this.tableData.filter((item,index)=>{
        console.log(item.serverAccountInfo,this.delete,'999');
        return item.serverAccountInfo !== this.delete
      })
      this.dialogVisible = false;
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
