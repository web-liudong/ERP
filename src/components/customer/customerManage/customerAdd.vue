<template>
  <div class="form-wrapper">
    <addhead headname="客户基本信息"></addhead>
    <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="所属项目：" required>
        <el-select
          @remove-tag="removeTag"
          multiple
          v-model="projectId"
          filterable
          remote
          placeholder="所属项目"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="type">
        <span slot="label">客户性质：</span>
        <el-radio-group v-model="form.type" @change="changeHander('socialCreditCode')">
          <el-radio :label="0">央企</el-radio>
          <el-radio :label="1">国企</el-radio>
          <el-radio :label="2">外企</el-radio>
          <el-radio :label="3">民企</el-radio>
          <el-radio :label="4">政府</el-radio>
          <el-radio :label="5">军队</el-radio>
          <el-radio :label="6">事业单位</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户名称：" prop="name">
        <el-input v-model="form.name" placeholder="字数长度1~30以内"></el-input>
      </el-form-item>
      <el-form-item label="客户简称：">
        <el-input v-model="form.shortName" placeholder="字数长度1~15以内"></el-input>
      </el-form-item>
      <div class="customer-box">
        <el-form-item label="客户账期：" prop="paymentDays">
          <el-input
            v-model="form.paymentDays"
            class="el-input-half"
            placeholder="0~999整数"
            type="number"
          >
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="授信额度：">
          <template slot-scope="scope">
            <el-input
              v-model="form.creditLine"
              class="el-input-half"
              placeholder="0.00"
              type="number"
              @blur="oninput(form.creditLine)"
            >
              <template slot="append">万元</template>
            </el-input>
          </template>
        </el-form-item>
      </div>
      <el-form-item label="客户行业：" prop="industryId">
        <el-cascader
          :options="industry"
          placeholder="请选择行业"
          v-model="form.industryId"
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="socialCreditCode" v-show="form.type!=5">
        <span slot="label">
          <i style="color:red;" v-if="form.type<4">*</i> 统一社会信用代码：
        </span>
        <el-input v-model="form.socialCreditCode" placeholder="输入统一社会信用代码"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type!=5">
        <div class="sub-title">统一社会信用代码：是指工商营业执照、组织机构代码证、税务登记证的统称</div>
      </el-form-item>
      <el-form-item label="所属上级客户：">
        <el-select
          v-model="form.parentId"
          filterable
          remote
          placeholder="请输入"
          :remote-method="customerRemote"
          :loading="loading"
          class="el-input-half"
        >
          <el-option v-for="item in customers" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户办公地址：" v-if="form.type!=5">
        <el-select
          v-model="form.provinceId"
          placeholder="选择省/直辖市"
          @change="onProvincesChange"
          class="area-elect"
        >
          <el-option
            v-for="(item,index) in provinces"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="form.cityId"
          placeholder="选择城市"
          @change="onCityChange"
          class="area-elect"
        >
          <el-option v-for="(item,index) in city" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="form.countyId" placeholder="选择区/县" class="area-elect">
          <el-option
            v-for="(item,index) in county"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input type="textarea" placeholder="详细地址，请输入200字以内" v-model="form.addressLine" rows="5"></el-input>
      </el-form-item>
      <el-form-item prop="manageUserId">
        <span slot="label">客户乙方负责人：</span>
        <el-select
          class="el-input-half"
          v-model="form.manageUserId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入负责人账号"
          :remote-method="manageUserremote"
          :loading="loading"
          @change="onuserchange"
          clearable
          @clear="ongUserclear"
        >
          <el-option
            v-for="item in manageUsers"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          >
            <span>{{ item.userName}}-{{ item.realName}}</span>
          </el-option>
        </el-select>
        <span>
          <i style="color: red;">*</i> 乙方负责人姓名：
        </span>
        <el-input v-model="manageUserName" readonly class="el-input-half"></el-input>
      </el-form-item>
      <el-form-item prop="groupUserId">
        <span slot="label">集团客户负责人：</span>
        <el-select
          v-model="form.groupUserId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入负责人账号"
          :remote-method="groupUserremote"
          :loading="loading"
          class="el-input-half"
          clearable
          @change="ongroupUserchange"
          @clear="ongroupUserclear"
        >
          <el-option
            v-for="item in groupUsers"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          >
            <span>{{ item.userName}}-{{item.realName}}</span>
          </el-option>
        </el-select>
        <span>
          <i style="color: red;">*</i> 集团负责人姓名：
        </span>
        <el-input v-model="groupUserName" class="el-input-half" readonly></el-input>
      </el-form-item>
      <div v-for="(item,index) in form.customerContactList" :key="index+'customer'">
        <div class="customer-box">
          <el-form-item
            label="客户联系人："
            :rules="customerpeople.contactName"
            :prop="'customerContactList.'+index+'.contactName'"
          >
            <el-input v-model="item.contactName" placeholder="字数长度1~15以内"></el-input>
          </el-form-item>
          <el-form-item
            label="职务："
            :rules="customerpeople.contactJob"
            :prop="'customerContactList.'+index+'.contactJob'"
          >
            <el-input v-model="item.contactJob" placeholder="字数长度1~50以内"></el-input>
          </el-form-item>
          <el-form-item
            label="联系方式："
            :rules="customerpeople.contactPhone"
            :prop="'customerContactList.'+index+'.contactPhone'"
          >
            <el-input v-model="item.contactPhone" placeholder="字数长度1~50以内"></el-input>
          </el-form-item>
          <div class="button-box">
            <el-button
              type="primary"
              plain
              @click="addCustomerContact"
              v-if="index==0"
              :disabled="buttonCustomer"
            >新增</el-button>
            <el-button type="danger" plain @click="delCustomerContact(index)" v-if="index!=0">删除</el-button>
          </div>
        </div>
        <el-form-item :rules="customerpeople.remark" :prop="'customerContactList.'+index+'.remark'">
          <el-input placeholder="备注（字数长度1~100以内）" v-model="item.remark"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <addhead headname="客户银行账号"></addhead>
    <el-form :model="form" label-width="150px">
      <div v-for="(item,index) in form.bankAccountList" :key="index">
        <div class="customer-box">
          <el-form-item
            label="开户行名称："
            :rules="customerbank.bank"
            :prop="'bankAccountList.'+index+'.bank'"
          >
            <el-input v-model="item.bank" placeholder="字数长度1~50以内"></el-input>
          </el-form-item>
          <el-form-item
            label="账号："
            :rules="customerbank.accountNo"
            :prop="'customerContactList.'+index+'.accountNo'"
          >
            <el-input v-model="item.accountNo" placeholder="字数长度1~50以内"></el-input>
          </el-form-item>
          <el-form-item
            label="开户名："
            :rules="customerbank.accountName"
            :prop="'customerContactList.'+index+'.accountName'"
          >
            <el-input v-model="item.accountName" placeholder="字数长度1~50以内"></el-input>
          </el-form-item>
          <div class="button-box">
            <el-button
              type="primary"
              plain
              @click="addAccount"
              v-show="index==0"
              :disabled="buttonBank"
            >新增</el-button>
            <el-button type="danger" plain @click="delAccount(index)" v-show="index!=0">删除</el-button>
          </div>
        </div>
        <el-form-item :rules="customerbank.remark" :prop="'customerContactList.'+index+'.remark'">
          <el-input v-model="item.remark" placeholder="备注（字数长度1~100以内）"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="form-button-box">
        <el-button type="primary" @click="addcustomer('form',0)" class="form-button">保存至草稿</el-button>
        <el-button type="primary" @click="addcustomer('form',1)">保存并提交审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import {
  projectName,
  addcustomer,
  customers,
  industrytree,
  getcustomerinfo,
  editcustomer,
  checkName
} from "@/api/customerManage";
import { simplelist, grouplist, userList } from "@/api/classManage";
import { provinces_based_id, subs } from "@/api/basicSupplier";
import { returnFloat } from "@/utils/index";
export default {
  inject: ["reload", "close"],
  name: "customeradd",
  data() {
    var checksocialCredit = (rule, value, callback) => {
      if (this.form.type >= 4) {
        return callback();
      }
      if (!value) {
        return callback(new Error("统一社会信用编码不能为空"));
      } else {
        return callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback();
      } else {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if (isMob.test(value) || isPhone.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号码格式"));
        }
      }
    };
    var nameCheck = (rule, value, callback) => {
      if (value) {
        if (value.length > 0 && value.length < 31) {
          checkName({
            id: this.$route.query ? this.$route.query.id : null,
            name: value
          })
            .then(res => {
              if (res.code == "000000") {
                callback();
              }
            })
            .catch(res => {
              return callback(new Error("客户已经存在"));
            });
        } else {
          return callback(new Error("长度在 1 到 30 个字"));
        }
      } else {
        return callback(new Error("客户名称不能为空"));
      }
    };
    var checksocialDays = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (
        Number.isInteger(Number(value)) &&
        Number(value) > 0 &&
        Number(value) < 999
      ) {
        callback();
      } else {
        callback(new Error("请输入1-999的正整数"));
      }
    };
    return {
      isReviewPass: false,
      projectId: [],
      oldProjectId: [],
      loading: false,
      customerId: null,
      manageUserName: "",
      groupUserName: "",
      industry: [],
      customers: [],
      projects: [],
      manageUsers: [],
      groupUsers: [],
      provinces: [],
      city: [],
      county: [],
      selectedOptions: "",
      type1: 1,
      options: [],
      form: {
        bank: null,
        manageUserId: null,
        groupUserId: null,
        packageType: null,
        orderSignType: null,
        orderRemark: null,
        packageRemark: null,
        deliveryRemark: null,
        addressLine: null,
        countyId: null,
        cityId: null,
        provinceId: null,
        parentId: null,
        socialCreditCode: null,
        industryId: null,
        type: null,
        shortName: null,
        paymentDays: null,
        creditLine: null,
        bankAccountList: [
          {
            bank: null,
            accountNo: null,
            accountName: null,
            remark: null
          }
        ],
        customerContactList: [
          {
            contactName: null,
            contactPhone: null,
            remark: null,
            contactJob: null
          }
        ]
      },
      form1: {
        groupUserId: null,
        packageType: null,
        orderSignType: null,
        orderRemark: null,
        packageRemark: null,
        deliveryRemark: null,
        addressLine: null,
        countyId: null,
        cityId: null,
        provinceId: null,
        parentId: null,
        socialCreditCode: null,
        industryId: null,
        type: null,
        shortName: null,
        paymentDays: null,
        creditLine: null,
        bankAccountList: [
          {
            bank: null,
            accountNo: null,
            accountName: null,
            remark: null
          }
        ],
        customerContactList: [
          {
            contactName: null,
            contactPhone: null,
            remark: null,
            contactJob: null
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: "客户名称不能为空", trigger: "change" },
          { validator: nameCheck, trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择客户性质", trigger: "change" }
        ],
        industryId: [
          { required: true, message: "请选择客户行业", trigger: "change" }
        ],
        socialCreditCode: [{ validator: checksocialCredit, trigger: "blur" }],
        manageUserId: [
          { required: true, message: "客户乙方负责人不能为空", trigger: "blur" }
        ],
        groupUserId: [
          { required: true, message: "集团客户负责人不能为空", trigger: "blur" }
        ],
        paymentDays: [{ validator: checksocialDays, trigger: "change" }]
      },
      customerpeople: {
        contactName: [
          { min: 1, max: 15, message: "字数长度在1~15字以内", trigger: "blur" }
        ],
        contactJob: [
          { min: 1, max: 50, message: "字数长度在1~50字以内", trigger: "blur" }
        ],
        contactPhone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        remark: [
          {
            min: 1,
            max: 100,
            message: "字数长度在1~100字以内",
            trigger: "blur"
          }
        ]
      },
      customerbank: {
        bank: [
          { min: 1, max: 50, message: "字数长度在1~50字以内", trigger: "blur" }
        ],
        accountNo: [
          { min: 1, max: 50, message: "字数长度在1~50字以内", trigger: "blur" }
        ],
        accountName: [
          { min: 1, max: 50, message: "字数长度在1~50字以内", trigger: "blur" }
        ],
        remark: [
          {
            min: 1,
            max: 100,
            message: "字数长度在1~100字以内",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    addhead
  },
  created() {
    this.getProvinces();
    this.getindustry();
    if (this.$route.query.id) {
      this.customerId = this.$route.query.id;
      this.getInfo(this.customerId);
    }
  },
  activated() {
    if (this.$route.query.id && this.customerId != this.$route.query.id) {
      this.customerId = this.$route.query.id;
      this.getInfo(this.customerId);
    }
  },
  computed: {
    buttonCustomer: function() {
      var arr = this.form.customerContactList;
      if (arr) {
        var len = arr.length;
        return !(arr[len - 1].contactName && arr[len - 1].contactPhone);
      } else {
        return false;
      }
    },
    buttonBank: function() {
      var arr = this.form.bankAccountList;
      if (arr) {
        var len = arr.length;
        return !(
          arr[len - 1].bank &&
          arr[len - 1].accountNo &&
          arr[len - 1].accountName
        );
      } else {
        return false;
      }
    }
  },
  methods: {
    oninput(row) {
      row = returnFloat(row);
      this.form.creditLine = row;
    },
    changeHander(val) {
      this.$refs.form.clearValidate("socialCreditCode");
    },
    removeTag(val) {
      if (this.isReviewPass) {
        if (this.oldProjectId.indexOf(val) > -1) {
          this.$message.error("客户已经通过审核，不能删除");
          this.projectId.push(val);
        }
      }
    },
    delCustomerContact(index) {
      this.form.customerContactList.splice(index, 1);
    },
    addCustomerContact() {
      this.form.customerContactList.push({
        contactName: null,
        contactPhone: null,
        remark: null,
        contactJob: null
      });
    },
    onuserchange(val) {
      for (var i = 0; i < this.manageUsers.length; i++) {
        if (this.manageUsers[i].id === val) {
          this.manageUserName = this.manageUsers[i].realName;
          break;
        }
      }
      this.$refs.form.validateField("manageUserId");
    },
    ongUserclear() {
      this.manageUserName = "";
    },
    ongroupUserchange(val) {
      for (var i = 0; i < this.groupUsers.length; i++) {
        if (this.groupUsers[i].id === val) {
          this.groupUserName = this.groupUsers[i].realName;
          break;
        }
      }
      this.$refs.form.validateField("groupUserId");
    },
    ongroupUserclear() {
      this.groupUserName = "";
    },
    manageUserremote(query) {
      if (!this.projectId.length) {
        this.$message.error("请先选择项目");
        return false;
      }
      if (query) {
        userList({
          realName: query,
          status: 0,
          projectIdList: this.projectId
        }).then(res => {
          if (res.code == "000000") {
            this.manageUsers = res.data;
          }
        });
      }
    },
    groupUserremote(query) {
      this.loading = true;
      if (query) {
        grouplist({
          count: 10,
          realName: query,
          status: 0,
          organizationId: 1
        }).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.groupUsers = res.data;
          }
        });
      }
    },
    customerRemote(query) {
      this.loading = true;
      if (query) {
        customers(query, this.customerId ? this.customerId : null).then(res => {
          this.loading = false;
          if (res.code == "000000") {
            this.customers = res.data;
          }
        });
      }
    },
    remoteMethod(query) {
      if (query) {
        projectName({
          name: query
        }).then(res => {
          if (res.code == "000000") {
            this.projects = res.data.concat(this.projects);
          }
        });
      }
    },
    getInfo(id) {
      getcustomerinfo(id).then(res => {
        if (res.code == "000000") {
          this.form = res.data;
          if (this.form.parentId) {
            this.customers = [
              {
                name: res.data.parentName,
                id: res.data.parentId
              }
            ];
          }
          this.isReviewPass = res.data.isReviewPass;
          let contactList = res.data.contactList.length
            ? res.data.contactList
            : [
                {
                  contactName: null,
                  contactPhone: null,
                  remark: null,
                  contactJob: null
                }
              ];
          this.$set(this.form, "customerContactList", contactList);
          let bankAccountList = res.data.bankAccountList.length
            ? res.data.bankAccountList
            : [
                {
                  bank: null,
                  accountNo: null,
                  accountName: null,
                  remark: null
                }
              ];
          this.$set(this.form, "bankAccountList", bankAccountList);
          this.manageUserName = res.data.manageUser
            ? res.data.manageUser.realName
            : "";
          this.form.manageUserId = res.data.manageUser
            ? res.data.manageUser.userId
            : null;
          this.manageUsers = [
            {
              id: res.data.manageUser.userId,
              userName: res.data.manageUser.userName,
              realName:res.data.manageUser.realName
            }
          ];
          this.groupUserName = res.data.groupUser
            ? res.data.groupUser.realName
            : "";
          this.form.groupUserId = res.data.groupUser
            ? res.data.groupUser.userId
            : null;
          this.groupUsers = [
            {
              id: res.data.groupUser.userId,
              userName: res.data.groupUser.userName,
              realName:res.data.groupUser.realName
            }
          ];

          this.projects = res.data.projects;
          if (res.data.projects) {
            this.projectId = res.data.projects.map(function(val) {
              return val.id;
            });
          }
          this.oldProjectId = this.projectId;
          this.form.industryId = [];
          this.form.industryId.push(res.data.firstLevelIndustryId + "");
          this.form.industryId.push(res.data.secondLevelIndustryId + "");
          this.form.industryId.push(res.data.thirdLevelIndustryId + "");
          if (res.data.provinceId) {
            this.getcity(res.data.provinceId);
          }
          if (res.data.cityId) {
            this.getcounty(res.data.cityId);
          }
        }
      });
    },
    getindustry() {
      industrytree().then(res => {
        if (res.code == "000000") {
          this.industry = res.data;
        }
      });
    },
    onCityChange(val) {
      this.getcounty(val);
      this.form.countyId = null;
    },
    onProvincesChange(val) {
      this.getcity(val);
      this.county = [];
      this.form.cityId = null;
      this.form.countyId = null;
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = res.data;
        }
      });
    },
    getcity(id) {
      subs(id).then(res => {
        if (res.code == "000000") {
          this.city = res.data;
        }
      });
    },
    getcounty(id) {
      subs(id).then(res => {
        if (res.code == "000000") {
          this.county = res.data;
        }
      });
    },
    addcustomer(formName, status) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.$route.query.id) {
            addcustomer({
              groupUserId: this.form.groupUserId,
              projectIds: this.projectId,
              type: this.form.type,
              name: this.form.name,
              shortName: this.form.shortName ? this.form.shortName : null,
              paymentDays: this.form.paymentDays,
              creditLine: this.form.creditLine,
              industryId: this.form.industryId
                ? this.form.industryId[this.form.industryId.length - 1] - 0
                : null,
              socialCreditCode:
                this.form.type == 5 ? null : this.form.socialCreditCode,
              parentId: this.form.parentId,
              provinceId: this.form.type == 5 ? null : this.form.provinceId,
              cityId: this.form.type == 5 ? null : this.form.cityId,
              countyId: this.form.type == 5 ? null : this.form.countyId,
              addressLine: this.form.type == 5 ? null : this.form.addressLine,
              orderRemark:
                this.form.orderRemark == "" ? null : this.form.orderRemark,
              packageType: this.form.packageType,
              packageRemark:
                this.form.packageRemark == "" ? null : this.form.packageRemark,
              orderSignType: this.form.orderSignType,
              deliveryRemark:
                this.form.deliveryRemark == ""
                  ? null
                  : this.form.deliveryRemark,
              manageUserId: this.form.manageUserId,
              customerContactList: this.form.customerContactList,
              bankAccountList: this.form.bankAccountList,
              status: status
            }).then(res => {
              if (res.code == "000000") {
                if (status == 0) {
                  this.$message({
                    message: "当前页面信息已经成功保存",
                    type: "success"
                  });
                  this.close({
                    name: "customeradd",
                    to: { name: "customermanage", params: { isUpdate: true } }
                  });
                } else {
                  this.$message({
                    message: "当前页面信息保存并提交审核成功",
                    type: "success"
                  });
                }
                // this.$router.replace({ name: "customermanage" });
                this.close({
                  name: "customeradd",
                  to: { name: "customermanage", params: { isUpdate: true } }
                });
                this.close({
                  name: "customeradd",
                  to: { name: "customermanage", params: { isUpdate: true } }
                });
              } else if (/^01/.test(res.code)) {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          } else {
            editcustomer(this.$route.query.id, {
              groupUserId: this.form.groupUserId,
              projectIds: this.projectId,
              type: this.form.type,
              name: this.form.name,
              shortName: this.form.shortName ? this.form.shortName : null,
              paymentDays: this.form.paymentDays,
              creditLine: this.form.creditLine,
              industryId: this.form.industryId
                ? this.form.industryId[this.form.industryId.length - 1] - 0
                : null,
              socialCreditCode:
                this.form.type == 5 ? null : this.form.socialCreditCode,
              parentId: this.form.parentId,
              provinceId: this.form.type == 5 ? null : this.form.provinceId,
              cityId: this.form.type == 5 ? null : this.form.cityId,
              countyId: this.form.type == 5 ? null : this.form.countyId,
              addressLine: this.form.type == 5 ? null : this.form.addressLine,
              orderRemark:
                this.form.orderRemark == "" ? null : this.form.orderRemark,
              packageType: this.form.packageType,
              packageRemark:
                this.form.packageRemark == "" ? null : this.form.packageRemark,
              orderSignType: this.form.orderSignType,
              deliveryRemark:
                this.form.deliveryRemark == ""
                  ? null
                  : this.form.deliveryRemark,
              manageUserId: this.form.manageUserId,
              customerContactList: this.form.customerContactList,
              bankAccountList: this.form.bankAccountList,
              status: status
            }).then(res => {
              if (res.code == "000000") {
                if (status == 0) {
                  this.$message({
                    message: "当前页面信息已经成功保存",
                    type: "success"
                  });
                  this.close({
                    name: "customeradd",
                    to: { name: "customermanage", params: { isUpdate: true } }
                  });
                } else {
                  this.$message({
                    message: "当前页面信息保存并提交审核成功",
                    type: "success"
                  });
                }
                this.close({
                  name: "customeradd",
                  to: { name: "customermanage", params: { isUpdate: true } }
                });
              } else if (/^01/.test(res.code)) {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          }
        }
      });
    },
    addAccount() {
      this.form.bankAccountList.push({
        bank: "",
        accountNo: "",
        accountName: "",
        remark: ""
      });
    },
    delAccount(index) {
      this.form.bankAccountList.splice(index, 1);
    }
  }
};
</script>
<style scoped lang="less">
.form-wrapper {
  margin-top: 20px;
  border: 1px solid #e4e4e4;
  .el-form {
    padding: 20px;
    .customer-box {
      display: flex;
      flex-wrap: wrap;
      .el-input {
        width: 200px;
      }
      .button-box {
        padding-left: 20px;
      }
    }
    .el-input {
      width: 800px;
    }
    .el-select {
      width: 800px;
    }
    .area-elect {
      width: 200px;
    }
    .el-textarea {
      width: 800px;
      margin-top: 10px;
      display: block;
    }
    .el-input-half {
      width: 20%;
      margin-right: 80px;
    }
    .el-cascader {
      width: 800px;
    }
    .sub-title {
      font-size: 12px;
      color: #999;
      margin-top: -5px;
      margin-bottom: -10px;
    }
    .form-button-box {
      width: 1000px;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
