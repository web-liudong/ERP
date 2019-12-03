<template>
  <el-dialog title="批量生成发货单" :visible.sync="isShow" width="500px" class="dialogWrap">
    <el-row>
      <el-col>
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;"><i>*</i>发货类型：</el-col>
            <el-col :span="8">整单发货</el-col>
          </el-row>
      </el-col>
      <el-col>
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;"><i>*</i>到货类型：</el-col>
            <el-col :span="12">
              <el-radio-group
                  v-model="form.inStoreType"
                  @change="changeInStoreType"
                >
                  <el-radio :label="0">入仓</el-radio>
                  <el-radio :label="1">厂直</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
      </el-col>
      <el-col>
        <el-form :inline="true" :model="form" ref="orderForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="8" style="text-align:right;"><i>*</i>发货仓库：</el-col>
            <el-col :span="8">
              <el-form-item label prop="warehouseId">
                <el-select
                  v-model="form.warehouseId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in depotList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
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
  getWarehouseList,
  generateDeliveryOrderBtach
} from "@/api/order/invoiceOrder";
import {getOrganization} from '@/api/purchase/purchase.js'
import { customerNameList, customerUserNameList } from "@/api/order/saleDown";
import { organizationListName } from "@/api/projectController/projectController";
import { Debounce } from "@/utils";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      remoteLoading: false,
      orderInfo:{},
      depotList: [],
      depotListBackups: [],
      warehouseSelStatus: false,
      form: {
        warehouseId: "",
        inStoreType: 0,
        orderIds:[]
      },
      rules: {} 
    };
  },
  mounted() {},
  methods: {
    init(ids) {
      this.reset();
      this.form.orderIds = ids;
      this.getUseLeadingWMS();

      this.rules['warehouseId']=[
          { validator: this.checkWMS, trigger: "change" }
      ];

      this.isShow = true;
    },
    checkWMS(rule, value, callback) {
      if (!value && this.useLeadingWMS && this.form.inStoreType == 0) {
        return callback(new Error("发货仓库不能为空"));
      }
      callback();
    },
    getUseLeadingWMS(){
      if(this.$auth.user.userPosts.length == 0){
        //用户没有组织机构
        return false;
      }
      getOrganization(this.$auth.user.userPosts[0].organizationId).then(res=>{
        this.useLeadingWMS=res.data.useLeadingWMS;
        //不管是否使用wms都需要选择仓库
        this.getWarehouseList();
        // if(res.data.useLeadingWMS){
        //   this.warehouseSelStatus = false;
        //   this.getWarehouseList();
        // }else{
        //   this.form.warehouseId = 0;
        //   this.warehouseSelStatus = true;
        //   this.depotListBackups = this.depotList = [{
        //     id:0,
        //     name:'无'
        //   }];
        // }
      })
    },
    getWarehouseList() {
      getWarehouseList(this.$auth.user.userPosts[0].organizationId).then(
        res => {
          if (res.code == "000000") {
            this.depotList = res.data;
            this.depotListBackups = res.data.slice(0);
            //只有一个仓库，设为默认值
            if (res.data.length == 1) {
              this.form.warehouseId = res.data[0].id;
            }
          }
        }
      );
    },
    changeInStoreType(type){
      // if(type == 1){
      //   this.depotList = [{
      //     id:0,
      //     name:'无'
      //   }]
      //   this.form.warehouseId = 0;
      // }else{
      //   this.depotList = this.depotListBackups.slice(0);
      //   this.form.warehouseId = this.depotListBackups[0].id == 0 ? 0 : "";
      // }
    },
    submitForm: Debounce(function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.fCreatInvoice();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }),
    fCreatInvoice(){
      generateDeliveryOrderBtach(this.form).then(res => {
        this.isShow = false;
        this.$emit("callback", "creatInvoiceOrderBatch");
        // this.$message({
        //   type: "success",
        //   message: "批量生成发货单操作成功"
        // });
        let resTxt = `本次批量派接<strong style="color: red;">${res.data.total}</strong>条，成功<strong style="color: red;">${res.data.success}</strong>条，失败<strong style="color: red;">${res.data.fail}</strong>条`
        this.$alert(resTxt, '批量结果', {
          dangerouslyUseHTMLString: true,
          callback: action => {}
        });
      });
    },
    reset() {
      this.form = {
        warehouseId: "",
        inStoreType: 0,
        orderIds:[]
      };
    }
  }
};
</script>
<style scoped lang="less">
.tips {
  color: red;
  padding-left: 20px;
}
.list {
  table {
    width: 95%;
    margin: 0px auto 20px;
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
      word-break: break-all;
      &:last-child {
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
.el-form-item {
  width: 100%;
  margin-bottom: 10px;
}
.el-select,
.el-autocomplete {
  width: 100%;
}

.el-radio {
  margin-right: 5px;
}
</style>
<style scoped>
.dialogWrap >>> .el-form-item__content {
  width: 100%;
}
</style>
