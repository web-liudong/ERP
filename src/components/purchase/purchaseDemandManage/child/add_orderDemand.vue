<template>
  <el-dialog
    class="addOrderDemandBox"
    title="添加需求明细"
    :visible.sync="dialogFormVisible"
    :before-close="closeDialog"
    width="70%"
  >
    <el-form :inline="true" :model="form" class="demo-form-inline" ref="form" :rules="rules">
      <div class="chunkBox">
        <el-form-item label="发货单号：">
          <span slot="label">发货单号：</span>
          <div style="display:flex;flex:1;">
            <el-input v-model="form.orderNo" placeholder="请输入发货单号" type="text"></el-input>
            <el-button style="margin-left:20px;" type="primary" @click="getGoodsDemand()">获取商品明细</el-button>
          </div>
        </el-form-item>
        <el-form-item label="需求类型：">
          <span slot="label">需求类型：</span>
          <span>订单需求</span>
        </el-form-item>
      </div>

      <div v-if="isShow">
        <div class="chunkBox">
          <el-form-item label="客户名称">
            <span slot="label">客户名称：</span>
            <span>{{form.customerName}}</span>
          </el-form-item>
          <el-form-item label="销售员">
            <span slot="label">销售员：</span>
            <span>{{form.recipientName}}</span>
          </el-form-item>
        </div>
        <div class="chunkBox">
          <el-form-item label="仓库：" prop="warehouseId">
            <el-select
              v-model="form.warehouseId"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入仓库名"
              :remote-method="remoteMethod"
              @change="getUsername"
              :loading="loading"
            >
              <el-option
                v-for="item in optionsWarehouse"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.warehouseId!=0" :prop="form.warehouseId===0?'recipientAddressLine':''">
            <span slot="label">收货地址：</span>
            <span>{{form.recipientAddressLine}}</span>
          </el-form-item>
        </div>
        <div class="chunkBox" v-if="form.warehouseId==0">
          <el-form-item :prop="form.warehouseId===0?'recipientAddressLine':''">
            <span slot="label">收货地址：</span>
            <span v-if="form.warehouseId!=0">{{form.recipientAddressLine}}</span>
            <div class="wareHouseBox" style="display:flex;flex:1">
              <el-select
                v-model="form.recipientAddressProvinceId"
                filterable
                placeholder="选择省/直辖市"
                style="width: 200px;"
                clearable
                @change="o1change"
              >
                <el-option v-for="o in o1" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
              <el-select
                v-model="form.recipientAddressCityId"
                filterable
                clearable
                placeholder="选择城市"
                style="width: 200px;"
                @change="o2change"
              >
                <el-option v-for="o in o2" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
              <el-select
                v-model="form.recipientAddressCountyId"
                filterable
                clearable
                placeholder="选择区/县"
                style="width: 200px;"
                @change="o3change"
              >
                <el-option v-for="o in o3" :key="o.id" :label="o.name" :value="o.id"></el-option>
              </el-select>
              <el-input
                v-model="form.recipientAddressLine"
                placeholder="请输入收货详细地址"
                style="width:200px"
                type="text"
              ></el-input>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table
      :data="tableData"
      border
      v-if="isShow"
      style="width: 100%"
      size="small"
      @focus="getIndex()"
      @selection-change="getIndex"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <el-table-column prop="urgentLevel" label="紧急" align="center">
        <template slot="header">
          <span>
            <i style="color:red;">*</i>紧急
          </span>
        </template>
        <template slot-scope="scope">
          <el-form :model="scope.row" :rules="rules" :ref="`form${scope.$index+1}`">
            <el-form-item prop="urgentLevel" style="margin-bottom:0px;" :required="true">
              <el-select v-model="scope.row.urgentLevel" clearable @change="getUrgentLevel(scope.row,scope.$index)">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="itemQty" align="center" label-class-name="demandBox">
        <template slot="header">
          <span>
            <i style="color:red;">*</i>需求数量
          </span>
        </template>
        <template slot-scope="scope">
          <el-form :model="scope.row" :rules="rules">
            <el-form-item prop="itemQty" style="margin-bottom:0px;" :required="true">
              <el-input v-model="scope.row.itemQty" type="number" @input="getUrgentLevel(scope.row,scope.$index)"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注说明" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.memo"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDia">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  findWarehouse,
  getOrderDataByInvoiceNo,
  byTokenGetUserList,
  byOrganizationIDFindWarehouse
} from "@/api/purchase/purchase.js";
import { provinces_based_id, subs } from "@/api/basicSupplier";
export default {
  data() {
    const check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("此项必填！"));
      } else {
        callback();
      }
    };
    const checkWarehouse = (rule, value, callback) => {
      if (!value&&value!=0) {
        return callback(new Error("仓库不能为空"));
      } else {
        callback();
      }
    };
    // const checkItemQty = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("需求数量不能为空"));
    //   } else {
    //     if((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) == false){
    //         callback(new Error("请填写大于0的数字"));
    //     }else{
    //         callback();
    //     }
    //   }
    // };
    return {
      dialogFormVisible: false,
      isShow: false,
      index: null,
      loading: false,
      multipleSelection: [],
      form: {
        name: "",
        warehouse: "",
        orderNo: "",
        recipientAddressLine: "",
        warehouseId: null,
        warehouseName: "",
        recipientAddressProvinceId: null,
        recipientAddressCityId: null,
        recipientAddressCountyId: null,
        id: null
      },
      o1: [],
      o2: [],
      o3: [],
      provinceName:'',
      cityName:'',
      countyName:'',
      tableData: [],
      options: [{ label: "不紧急", value: "0" }, { label: "紧急", value: "1" }],
      optionsWarehouse: [],
      rules: {
        //  name:[{validator:check,trigger:'blur'}]
        recipientAddressLine: [
          { required: true, message: "仓库地址不能为空", trigger: "blur" }
        ],
        warehouseId: [
          { validator: checkWarehouse, required: true, trigger: "blur" }, { validator: checkWarehouse, required: true, trigger: "change" }
        ],
        // itemQty: [
        //   { validator: checkItemQty, required: true, trigger: "blur" }, 
        //   { validator: checkItemQty, required: true, trigger: "change" }
        // ],
      }
    };
  },
  methods: {
    init() {
      this.dialogFormVisible = true;
      provinces_based_id().then(res => {
        this.o1 = res.data;
        this.o4 = res.data;
        this.cities = res.data;
      });
    },
    getUsername(value) {
      console.log(value, 444);
      let aa = JSON.parse(JSON.stringify(this.optionsWarehouse));
      aa = aa.filter((item, index) => {
        return item.id == value;
      });
      console.log(aa, 666);
      if (value == 0) {
        this.form.recipientAddressLine = '';
      } else {
        this.form.recipientAddressLine =
          "" +
          aa[0].provinceName +
          " " +
          aa[0].cityName +
          " " +
          aa[0].countyName +
          " " +
          aa[0].addressLine;
      }
      console.log(this.form.recipientAddressLine, 55);
      this.form.warehouseName = aa[0] && aa[0].name;
      this.form.recipientAddressProvinceId = aa[0].provinceId;
      this.form.recipientAddressCityId = aa[0].cityId;
      this.form.recipientAddressCountyId = aa[0].countyId;
    },
    o1change(data) {
      let arr1=[];
      arr1  =  this.o1.filter((item,index)=>{
        return data==item.id
      }) 
      this.provinceName=arr1[0]&&arr1[0].name

      this.form.recipientAddressCityId = "";
      this.form.recipientAddressCountyId = "";
      if(data){
       subs(data).then(res => {
        this.o2 = res.data;
      });
      }
      
    },
    o2change(data) {
      let arr2=[];
      arr2  =  this.o2.filter((item,index)=>{
        return data==item.id
      }) 
      this.cityName=arr2[0]&&arr2[0].name
      this.form.recipientAddressCountyId = "";
      if(data){
        subs(data).then(res => {
        this.o3 = res.data;
      });
      }
     
    },
    o3change(data) {
      let arr3=[];
      arr3  =  this.o3.filter((item,index)=>{
        return data==item.id
      }) 
      this.countyName=arr3[0]&&arr3[0].name
    },
    getGoodsDemand() {
      if (this.form.orderNo) {
        getOrderDataByInvoiceNo(this.form.orderNo).then(res => {
          this.tableData = res.data.orderDeliveryItemDTOList;
          this.form.customerName = res.data.customerName;
          this.form.customerId = res.data.customerId;
          this.form.id = res.data.id;
          this.form.recipientName = res.data.recipientName;
        });
      }
      this.isShow = true;
    },
    getIndex(value) {
      this.multipleSelection = value;
    },
    getUrgentLevel(row,index){
      console.log(row,index,8888)
     this.multipleSelection[index].urgentLevel=row.urgentLevel;
    },
    closeDialog(done) {
      this.$confirm("是否放弃本次操作，放弃后填写的数据将会丢失", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(_ => {
          done();
          this.dialogFormVisible = false;
          this.form = {
            name: "",
            warehouse: "",
            orderNo: "",
            recipientAddressLine: "",
            warehouseId: null,
            warehouseName: "",
            recipientAddressProvinceId: null,
            recipientAddressCityId: null,
            recipientAddressCountyId: null,
            id: null
          };
          this.tableData=[];
          this.$refs['form'].resetFields()
        })
        .catch(_ => {});
    },
    closeDia() {
      this.$confirm("是否放弃本次操作，放弃后填写的数据将会丢失", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          this.dialogFormVisible = false;
          this.form = {
            name: "",
            warehouse: "",
            orderNo: "",
            recipientAddressLine: "",
            warehouseId: null,
            warehouseName: "",
            recipientAddressProvinceId: null,
            recipientAddressCityId: null,
            recipientAddressCountyId: null,
            id: null
          };
          this.tableData=[];
          this.$refs['form'].resetFields()
          
        })
        .catch(() => {
        });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let str = window.localStorage.getItem("UserInfo");
        let userPosts=JSON.parse(str).userPosts;
        this.organizationId=userPosts[0].organizationId;
        console.log(this.organizationId,44556666)
        if (this.organizationId) {
              findWarehouse({organizationId:this.organizationId,name:query}).then(res => {
                this.optionsWarehouse = res.data;
                // this.optionsWarehouse = [
                //   { id: 0, name: "无" },
                //   ...this.optionsWarehouse
                // ];
                this.loading = false;
              });
            }
      } else {
        this.optionsWarehouse = [];
      }
    },
    submitForm(formName) {
      this.$refs[formName] &&
        this.$refs[formName].validate(valid => {
          if (valid) {
            // console.log(this.$refs);
            // for (var key in this.$refs) {
            //   if (this.$refs.hasOwnProperty(key)) {
            //     console.log(key, 666);
            //     this.$refs[key].validate(valid => {
            //       console.log(valid, 99999);
            //     });
            //   }
            // }
             this.multipleSelection = this.multipleSelection.map((item, i) => {
              return {
                skuNo: item.skuNo,
                skuId: item.skuId,
                skuName: item.skuName,
                customerName: this.form.customerName,
                customerId: this.form.customerId,
                memo: item.memo,
                orderId: this.form.id,
                orderNo: this.form.orderNo,
                recipientAddressLine: this.provinceName+' '+this.cityName+' '+this.countyName+' '+this.form.recipientAddressLine,
                requirementQty: item.itemQty,
                requirementType: 0,
                urgentLevel: item.urgentLevel,
                warehouseId: this.form.warehouseId,
                warehouseName: this.form.warehouseName,
                recipientAddressProvinceId: this.form.recipientAddressProvinceId,
                recipientAddressCityId: this.form.recipientAddressCityId,
                recipientAddressCountyId: this.form.recipientAddressCountyId,
                longId:Date.now().toString(36)
              };
            });
            if (!this.multipleSelection.length) {
              this.$confirm("请先选中商品", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(res => {})
                .catch(() => {});
            } else {
              let aa=JSON.parse(JSON.stringify(this.multipleSelection))
              if(aa.some((item)=>{return item.urgentLevel!=0&&item.urgentLevel!=1})){
                this.$message({
                  message:'紧急程度不能为空',
                  type:'error'
                })
                return false
              }
             let bb=JSON.parse(JSON.stringify(this.multipleSelection))
              if(bb.some(item=>{return item.requirementQty==''})){
                this.$message({
                  message:'需求数量不能为空',
                  type:'error'
                })
                return false
              }
              this.$emit("dialogBack", this.multipleSelection);
              this.dialogFormVisible = false;
              this.form = {
                name: "",
                warehouse: "",
                orderNo: "",
                recipientAddressLine: "",
                warehouseId: null,
                warehouseName: "",
                recipientAddressProvinceId: null,
                recipientAddressCityId: null,
                recipientAddressCountyId: null
              };
              this.$refs['form'].resetFields()
              this.tableData = [];
            }
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.addOrderDemandBox {
  .chunkBox {
    display: flex;

    .el-form-item {
      //   flex-direction: row;
      //   justify-content:space-around;
      display: flex;
      flex: 1;
      .el-button {
        flex: 1;
      }
      .el-input {
        flex-direction: row;
        justify-content: flex-start;
      }
    }
  }
}
</style>
<style lang="less">
.addOrderDemandBox {
  .el-form {
    .el-form-item {
      .el-form-item__label {
        width: 140px;
      }
    }
  }
}
</style>




