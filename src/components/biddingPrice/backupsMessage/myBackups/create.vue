<template>
  <el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">
    <div class="createBox">
      <div class="leftBox">
        <span>
          <i class="iconfont iconcaidan"></i>基本信息：
        </span>
      </div>
      <div class="infoBox">
        <div class="flex">
          <span>
            <i style="color:red">*</i> 项目：
          </span>

          <el-form-item prop="projectId">
            <el-select
              v-model="form.projectId"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod1"
            >
              <el-option
                v-for="item in options3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="flex">
          <span>
            <i style="color:red">*</i> 客户：
          </span>
          <el-form-item prop="customerNameCustomize">
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="form.customerNameCustomize"
              :fetch-suggestions="querySearch"
              value-key="name"
              placeholder="请输入"
              :trigger-on-focus="false"
              @select="handleSelect"
              clearable
            >
              <!-- <template slot-scope="props">
    <div class="name">{{ props.item.name}}</div>
    <span>{{props.item.id}}</span>
              </template>-->
            </el-autocomplete>
          </el-form-item>
        </div>
        <div class="flex">
          <span>
            <i style="color:red">*</i> 采购人：
          </span>
          <el-form-item prop="purchaserName">
            <el-input v-model="form.purchaserName" clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <span>
            <i style="color:red">*</i> 采购人联系方式：
          </span>
          <el-form-item prop="purchaserPhone">
            <el-input v-model="form.purchaserPhone" style="width: 200px;" clearable></el-input>
          </el-form-item>
        </div>

        <div class="flex">
          <span>收货人：</span>
          <el-form-item prop="recipientName">
            <el-input v-model="form.recipientName" clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex">
          <span>收货人联系方式：</span>
          <el-form-item prop="recipientPhone">
            <el-input v-model="form.recipientPhone" type="number" clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex" style="width:50%">
          <span>
            <i style="color:red">*</i> 收货地址：
          </span>
          <el-form-item prop="addressLine">
            <el-input
              v-model="form.addressLine"
              type="hidden"
              ref="recAddress"
              clearable
              @focus="showDialog('setAddress',receiptAddress)"
              style="width: 0px;height: 0px;"
            ></el-input>
            <div
              id
              @click="showDialog('setAddress',receiptAddress)"
              style="cursor: pointer; width: 600px;vertical-align:middle;display: inline-block;border: 1px solid #dcdfe6;height: 40px;border-radius: 4px;box-sizing: border-box;padding: 0 15px;overflow: hidden; text-overflow:ellipsis;white-space:nowrap"
            >
              <span>{{addressLine}}</span>
            </div>
          </el-form-item>
        </div>
        <div class="module">
          <div class="flex">
            <span>
              <i style="color:red">*</i> 外部竞价编号：
            </span>
            <el-form-item prop="exteriorNo">
              <el-input v-model="form.exteriorNo" style="max-width: 200px;" clearable></el-input>
            </el-form-item>
          </div>
          <div class="flex">
            <span>
              <i style="color:red">*</i> 报价：
            </span>
            <el-form-item prop="priceQuote">
              <el-input v-model="form.priceQuote" style="max-width: 200px;" clearable></el-input>
            </el-form-item>
          </div>

          <div class="flex">
            <span>
              <i style="color:red">*</i> 服务方：
            </span>
            <el-form-item required>
              <el-input v-model="serverName" disabled></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="flex" style="width:100%">
          <span>报价备注：</span>
          <el-form-item>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.memo"
              clearable
              style="margin-left:10px"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="leftBox">
        <span>
          <i class="iconfont iconcaidan"></i>商品信息：
        </span>

        <el-button
          size="mini"
          icon="el-icon-plus"
          style="margin-left: 50px;"
          @click="addTableRow()"
        >添加</el-button>
      </div>

      <el-table
        :data="form.skuItemParams"
        border
        stripe
        style="width: 98%;margin:10px auto"
        size="small"
        rules="rules"
      >
        <el-table-column label="操作" width="90px" align="center" fixed>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteRow(scope)">删除</el-button>
          </template>
        </el-table-column>

        <el-table-column label="条目号" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" required>
          <template slot="header" slot-scope="scope">
            <span>
              <i style="color:red">*</i>商品名称
            </span>
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuName" clearable align="center"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分类">
          <template slot-scope="scope">
            <el-input v-model="scope.row.category" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="品牌">
          <template slot-scope="scope">
            <el-input v-model="scope.row.brand" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="规格型号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.specification" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unit" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" required type="number">
          <template slot="header" slot-scope="scope">
            <span>
              <i style="color:red">*</i>数量
            </span>
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.qty" clearable type="number" @blur="two(scope.row,'qty')"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单价">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.price"
              type="number"
              @blur="double(scope.row,'price')"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.memo" clearable></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <div class="bottom" style="margin-top:20px">
          <el-button type="primary" @click="submitForm('form')" style="margin-left: 120px;">保 存</el-button>
          <el-button type="primary" @click="DialogVisible = true">取 消</el-button>
        </div>
      </el-form-item>
      <setAddress ref="setAddress" @callback="dialogCallback"></setAddress>
      <el-dialog title="删除提示" :visible.sync="dialogVisiblelock" width="30%">
        <span>删除之后，客户的订单中将不再展示当前商品，确定要删除当前商品条目吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblelock = false">取 消</el-button>
          <el-button type="primary" @click="isDelete()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="取消确认" :visible.sync="DialogVisible" width="30%">
        <span>取消后，当前填写的信息将不保存，确定取消？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="DialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="clearInput()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="错误提示" :visible.sync="dia" width="30%">
        <span>该竞价消息已存在，不可报备。</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dia=false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="错误提示" :visible.sync="diallodAlreport" width="30%">
        <span>该竞价信息已报备，不可重复报备。</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="diallodAlreport=false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-form>
</template>
<script>
import setAddress from "./child/set_address";
import addhead from "@/components/common/head/head";
import { nameList } from "@/api/projectController/projectController";
import { customerNameList, customerUserNameList } from "@/api/order/saleDown";
import { returnFloat } from "@/utils/index";
import { reporeAdd } from "@/api/biddingMyReportPrepared";
import { provinces_based_id, subs } from "@/api/basicSupplier";
import { fuzzySearch } from "@/api/organizationManage";
export default {
  name: "myBackupsCreate",
  inject: ["reload", "close"], //注入依赖
  components: {
    addhead,
    setAddress
  },
  data() {
    var quoteRule = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入报价"));
      } else {
        var reg = /^\d{0,8}\.{0,1}(\d{1,2})?$/;
        if (!reg.test(value)) {
          callback(new Error("请输入不超过两位小数的报价"));
        } else {
          callback();
        }
      }
    };
    return {
      serverName: "",
      customerId: "",
      addressLine: "",
      receiptAddress: null,
      dia: false,
      DialogVisible: false,
      dialogVisiblelock: false,
      diallodAlreport: false,
      form: {
        skuItemParams: [
          {
            brand: "",
            category: "",
            memo: "",
            price: '',
            qty: '',
            skuName: "",
            specification: "",
            unit: ""
          }
        ]
      },
      restaurants: [],
      options2: [],
      options3: [],
      options4: [],
      customerOptions: [],
      purchaseOptions: [],
      rules: {
        projectId: [{ required: true, message: "请选择项目", trigger: "blur" }],
        customerNameCustomize: [
          { required: true, message: "请选择客户", trigger: "blur" }
        ],
        purchaserName: [
          { required: true, message: "请选择采购人", trigger: "blur" }
        ],
        purchaserPhone: [
          {
            required: true,
            message: "请输入采购人联系方式",
            trigger: "blur"
          }
        ],
        exteriorNo: [
          { required: true, message: "请输入外部竞价编号", trigger: "blur" }
        ],

        priceQuote: [
          {
            required: true,
            validator: quoteRule,
            trigger: "blur"
          }
          // {
          //   validator(rule, value, callback) {
          //     var reg =/^\d{0,8}\.{0,1}(\d{1,2})?$/;
          //     if (reg.test(value)) {
          //       callback();
          //     } else {
          //       callback(new Error("请输入不超过两位小数的数字"));
          //     }
          //   }
          // }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  activated() {
    if (this.id != this.$route.query.id) {
    }
  },
  mounted() {},
  methods: {
    init() {
      var storage = window.localStorage;
      var UserInfo = storage.getItem("UserInfo");
      var userPosts = JSON.parse(UserInfo).userPosts;
      this.serverName = userPosts[0].organizationName;
      this.form.serverId = userPosts[0].organizationId;
    },
    focusIpt() {
      console.log(111);
      this.addTableRow();
    },
    querySearch(queryString, cb) {
      customerNameList({
        name: queryString,
        projectId: this.form.projectId
      }).then(res => {
        if ((res.code = "000000")) {
          var restaurants = res.data;
          console.log(restaurants);
          // 调用 callback 返回建议列表的数据
          // console.log(restaurants);
          console.log(res.data);
          var results = queryString
            ? restaurants.filter(this.createFilter(queryString))
            : restaurants;
          if (queryString != results.name) {
            this.form.customerId = null;
          }

          this.form.customerNameCustomize = queryString;
          cb(results);
          console.log(cb(results));
          // console.log(this.form.customerId);
          // console.log(this.form.customerNameCustomize);
        }
      });
    },

    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    handleSelect(item) {
      this.form.customerId = item.id;
      this.form.customerNameCustomize = item.name;
    },
    remoteMethod1(query) {
      if (query !== "") {
        nameList({ name: query }).then(res => {
          this.options3 = res.data;
          console.log(res.data);
          console.log(res.data.id);
        });
      } else {
        this.options3 = [];
      }
    },
    showDialog(type, row) {
      this.$refs.recAddress.blur();
      this.$refs[type].init(row);
    },
    dialogCallback(res) {
      this.form.addressLine = res.address;
      console.log(this.form.addressLine);
      console.log(res.address);
      this.form.provinceId = res.province.id;
      this.form.cityId = res.city.id;
      this.form.countyId = res.county.id;
      this.addressLine = res.receiptAddress;
      this.receiptAddress = {
        province: { id: this.form.provinceId },
        city: { id: this.form.cityId },
        county: { id: this.form.countyId },
        address: this.form.addressLine,
        receiptAddress: this.addressLine
      };
    },

    addTableRow() {
      if (this.form.skuItemParams.length != 0) {
        if (this.form.skuItemParams.length > 0) {
          let row = this.form.skuItemParams[this.form.skuItemParams.length - 1];
          if (row.skuName && row.qty) {
            this.tablePush();
          } else {
            this.$message({
              message: "请完善相关商品信息",
              type: "error"
            });
          }
        } else {
          this.tablePush();
        }
      }
    },

    isDelete() {
      if (this.form.skuItemParams.length > 1) {
        this.form.skuItemParams.splice(this.deleteIndex, 1);
        this.dialogVisiblelock = false;
      } else {
        this.$message({
          message: "仅剩一条，不可删除",
          type: "error"
        });
        this.dialogVisiblelock = false;
      }
    },
    tablePush() {
      let a = {
         brand: "",
            category: "",
            memo: "",
            price: '',
            qty: '',
            skuName: "",
            specification: "",
            unit: ""
      };
      this.form.skuItemParams.push(a);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.addressLine) {
            this.subMit(formName);
          } else {
            this.$message({
              message: "请选择收货地址",
              type: "warning"
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearInput() {
      this.DialogVisible = false;
      this.close();
    },
    clearPurchaseContent() {
      this.receiptAddress = {
        province: "",
        city: "",
        county: "",
        address: "",
        receiptAddress: ""
      };
    },
    subMit(formName) {
      let ro = this.form.skuItemParams[this.form.skuItemParams.length - 1];
      if (ro.skuName && ro.qty) {
        reporeAdd(this.form)
          .then(res => {
            if ((res.code = "000000")) {
              console.log(res.data);

              this.$message({
                message: "保存成功",
                type: "success"
              });
              // setTimeout(this.$router.push("myBackupsList"), 1000);
              this.close({
                name: "myBackupsCreate",
                to: { name: "myBackupsList", params: { isUpdate: true } }
              });
            }
          })
          .catch(rej => {
            switch (rej.response.data.code) {
              case "010210024":
                this.diallodAlreport = true;
                break;
              case "010210028":
                this.dia = true;
                break;
            }
          });
      } else {
        this.$message({
          message: "请完善相关商品信息",
          type: "error"
        });
      }
    },

    deleteRow(index) {
      this.deleteIndex = index.$index;
      this.dialogVisiblelock = true;
    },
    double(row, price) {
      row.price = returnFloat(row[price]);
      return row.price;
    },
    two(row, qty) {
      row.qty = Math.round(row[qty]);
      return row.qty;
    }
  }
};
</script>
<style scoped lang='less'>
.createBox {
  border: 1px solid #e4e4e4;
  margin-top: 10px;
  .el-form-item {
    margin-bottom: 0px;
  }
}
.el-textarea {
  width: 800px;
}
.infoBox {
  margin-top: -2px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  span {
    flex: 0 0 100px;
    text-align: right;
  }
  .module {
    width: 100%;
    display: flex;
  }
  .flex {
    width: 25%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .el-input {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }
  .el-autocomplete {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }
  .el-select {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }

  .el-date-editor {
    margin: 10px 0 10px 10px;
    width: 100%;
  }
}
// .el-table{
// margin:0 10px;
// }
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
.leftBox {
  height: 50px;
  line-height: 50px;
  background-color: #f3f3f3;
  i {
    margin-right: 5px;
  }
  span {
    font-size: 16px;
    margin-left: 10px;
    color: #303133;
  }
}
.bottom {
  width: 90%;
  margin: 20px auto 20px;
  display: flex;
  justify-content: center;
}
</style>