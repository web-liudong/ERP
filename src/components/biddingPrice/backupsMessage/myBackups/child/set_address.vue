<template>
  <el-dialog title="收货地址" :visible.sync="isShow" width="650px">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="form" ref="salePriceForm" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>省市区：
            </el-col>
            <el-col :span="6">
              <el-form-item label prop="province">
                <el-select v-model="form.province" value-key="id" placeholder="省/直辖市" @change="getcity">
                  <el-option
                    v-for="item in provinces"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label prop="city">
                <el-select v-model="form.city" value-key="id" placeholder="城市" @change="getcounty">
                  <el-option
                    v-for="item in city"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label prop="county">
                <el-select v-model="form.county" value-key="id" placeholder="区/县">
                  <el-option
                    v-for="item in county"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="4" style="text-align:right;">
              <i>*</i>详细地址：
            </el-col>
            <el-col :span="18">
              <el-form-item prop="address">
                <el-input
                  v-model="form.address"
                  type="textarea"
                  rows="5"
                  placeholder="请输入200字以内"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('salePriceForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { provinces_based_id, subs } from "@/api/basicSupplier";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请选择城市"));
      }
      callback();
    };
    return {
      isShow: false,
      provinces: [],
      city: [],
      county: [],
      initObject: {},
      form: {
        province: "",
        city: "",
        county: "",
        address: "",
        receiptAddress: ""
      },
      rules: {
        province:[
          {
            validator: check,
            message: "请选择省份",
            trigger: "change"
          }
        ],
        city: [
          {
            validator: check,
            message: "请选择城市",
            trigger: "change"
          }
        ],
        county: [
          {
            validator: check,
            message: "请选择区/县",
            trigger: "change"
          }
        ],
        address: [
          {
            validator: check,
            message: "请填写详细地址",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    init(row) {
      Object.assign(this.initObject, row);
      Object.assign(this.form, row);
      this.getProvinces();
      // if (this.initObject.province) {
      //   this.getcity(this.initObject.province, true);
      // }
      // if (this.initObject.city) {
      //   this.getcounty(this.initObject.city, true);
      // }
      this.isShow = true;
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = res.data;
        }
      });
    },
    getcity(provinces, isInit) {
      this.city = [];
      this.county = [];
      this.form.city = "";
      this.form.county = "";
      if(!isInit){
        this.form.province = provinces;
      }
      subs(provinces.id).then(res => {
        if (res.code == "000000") {
          this.city = res.data;
          if (isInit) {
            this.form.city = this.initObject.city;
          }
        }
      });
    },
    getcounty(city, isInit) {
      this.county = [];
      this.form.county = "";
      if(!isInit){
        this.form.city = city;
      }
      subs(city.id).then(res => {
        if (res.code == "000000") {
          this.county = res.data;
          if (isInit) {
            this.form.county = this.initObject.county;
          }
        }
      });
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isShow = false;
          if(this.form.province.name){
            this.form.receiptAddress = this.form.province.name+"-"+this.form.city.name+"-"+this.form.county.name+"-"+this.form.address;
          }else if(this.form.city.name){
            let arr = this.initObject.receiptAddress.split("-");
            this.form.receiptAddress = arr[0]+"-"+this.form.city.name+"-"+this.form.county.name+"-"+this.form.address;
          }else if(this.form.county.name){
            let arr = this.initObject.receiptAddress.split("-");
            this.form.receiptAddress = arr[0]+"-"+arr[1]+"-"+this.form.county.name+"-"+this.form.address;
          }else{
            console.log(this.form)
            this.form.receiptAddress = this.initObject.receiptAddress ? this.initObject.receiptAddress.replace(this.initObject.address, this.form.address) : ''
          }
          this.$emit("callback", this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.el-row {
  margin-top: 10px;
  line-height: 30px;
  font-size: 14px;
  i {
    color: red;
  }
}
.el-textarea{
  width: 445px;
}
</style>