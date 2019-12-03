<template>
  <div class="brandBox">
    <div class="buttonbox">客户：{{customerName}}</div>
    <div class="info-box">
      <div class="department">
        <div class="department-head">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>&nbsp;部门信息</span>
        </div>
        <div class="left-box">
          <el-tree
            :data="departmentdata"
            :props="defaultProps"
            @node-click="handleNodeClick"
            default-expand-all
            node-key="id"
            show-checkbox
            check-strictly
            @check-change="handleClick"
            ref="treeForm"
            :expand-on-click-node="false"
            :default-checked-keys="defaultcheckedkeys"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span style="padding-left:20px;">
                <el-button
                  size="mini"
                  type="text"
                  @click.stop="()=>append(data)"
                  v-if="$authorities.CustomerPersonelEdit"
                >
                  <i class="el-icon-plus"></i>
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click.stop="()=>edit(data)"
                  v-if="$authorities.CustomerPersonelEdit"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click.stop="()=>remove(data)"
                  v-if="$authorities.CustomerPersonelEdit&&data.parentId"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="personnel">
        <div class="department-head">
          <div>
            <i class="iconfont iconjinridingdanshu myicon"></i>
            <span>人员信息列表</span>
          </div>
          <div class="button-box">
            <div
              class="button-head"
              @click="roleManage"
              v-if="$authorities.CustomerRoleFunctionAdmin"
            >角色权限管理</div>
            <div class="button-head" @click="addnew" v-if="$authorities.CustomerPersonelEdit">
              <i class="icon-xinzeng iconfont button-head-icon icon-add"></i>添加
            </div>
          </div>
        </div>
        <div class="select-box">
          <el-input placeholder="人员姓名" v-model="selectName" clearable></el-input>
          <el-button plain size="mini" @click="purchaser(1)">查询结果</el-button>
        </div>
        <el-table :data="tableData" border :max-height="dataListHeight">
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="人员姓名" align="center"></el-table-column>
          <el-table-column prop="phone" label="人员联系方式" align="center"></el-table-column>
          <el-table-column prop="departmentName" label="所属部门" align="center"></el-table-column>
          <el-table-column prop="staffName" label="业务员姓名" align="center"></el-table-column>
          <el-table-column prop="staffPhone" label="业务员手机号" align="center"></el-table-column>
          <el-table-column prop="accountStatusDescription" label="账号状态" align="center"></el-table-column>
          <el-table-column label="设置" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="roleset(scope.row.userId)"
                v-if="$authorities.CustomerRoleAdmin"
              >角色设置</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="godetail(scope.row.id)"
                v-if="$authorities.CustomerPersonelDetail"
              >详情</el-button>
              <el-button
                type="text"
                @click="editcustomer(scope.row.id)"
                v-if="$authorities.CustomerPersonelEdit"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" v-show="total!=0">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10,20,30,40,50,100,500]"
            @size-change="handleSizeChange"
            layout="total,sizes,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="adddialog" custom-class="dialog-box" @close="reload" width='776px'>
      <div slot="title" class="dialog-title">
        <span class="reject-title">添加人员</span>
      </div>
      <div class="dialog-body">
        <div>
          <div class="dialog-body-head">
            <i class="iconfont icon-jinqi myicon"></i>
            <span>基本信息</span>
          </div>
          <div class="dialog-body-body">
            <el-form label-width="200px" :rules="rules" status-icon :model="addform" ref="addform">
              <el-form-item>
                <span slot="label">所属客户：</span>
                <span style="color: red;">{{addform.customerName}}</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">所属部门：</span>
                <el-input
                  v-model="addform.departmentName"
                  placeholder="字数长度1~30"
                  readonly
                  @focus="onfocus"
                ></el-input>
                <el-tree
                  :data="departmentdata"
                  :props="defaultProps"
                  @node-click="changedepartment"
                  default-expand-all
                  v-show="isexpand"
                ></el-tree>
              </el-form-item>
              <el-form-item prop="purchaserName">
                <span slot="label">姓名：</span>
                <el-input v-model="addform.purchaserName" placeholder="字数长度1~30"></el-input>
              </el-form-item>
              <el-form-item prop="purchaserPhone" required>
                <span slot="label">联系方式：</span>
                <el-input v-model="addform.purchaserPhone" placeholder="字符长度1~30"></el-input>
              </el-form-item>
              <el-form-item prop="loginName">
                <span slot="label">登录名：</span>
                <el-input v-model="addform.loginName"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label">登录密码：</span>
                <el-input v-model="addform.password" placeholder="6-16位，初始密码111111"></el-input>
              </el-form-item>
              <el-form-item required>
                <span slot="label">账号状态：</span>
                <el-radio-group v-model="addform.accountStatus">
                  <el-radio :label="0">启用</el-radio>
                  <el-radio :label="1">不启用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <span slot="label">可见商品标签：</span>
                <el-checkbox-group v-model="addform.checkList">
                  <el-checkbox :label="item" v-for="(item,index) in visibleLabels" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item prop="name">
                <span slot="label">职务：</span>
                <el-input v-model="addform.position" placeholder="字数长度1~30"></el-input>
              </el-form-item>
              <el-form-item prop="staffId">
                <span slot="label">业务员账号：</span>
                <el-select
                  v-model="addform.staffId"
                  filterable
                  remote
                  placeholder="请输入负责人账号或者姓名"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="onstaffchange"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.userName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.realName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item required>
                <span slot="label">业务员姓名：</span>
                <el-input v-model="addform.staffName" readonly></el-input>
              </el-form-item>
              <el-form-item prop="description">
                <span slot="label">备注：</span>
                <el-input
                  v-model="addform.description"
                  placeholder="请输入200字以内"
                  type="textarea"
                  :rows="5"
                ></el-input>
              </el-form-item>
              <div class="head-shouhuo">
                <i class="iconfont icon-jinqi myicon"></i>
                <span>收货地址</span>
              </div>
              <div v-for="(item,index) in addform.receivList" :key="index">
                <el-form-item
                  :prop="'receivList.' + index + '.recipientName'"
                  :rules="{required: true, message: '收货人姓名不能为空', trigger: 'blur'}"
                >
                  <span slot="label">收货人姓名：</span>
                  <el-input v-model="item.recipientName" placeholder="字数长度1~30"></el-input>
                  <el-button type="primary" plain @click="addcustomer" v-if="index==0">新增</el-button>
                  <el-button type="danger" plain @click="delcustomer(index)" v-else="index==0">删除</el-button>
                </el-form-item>
                <el-form-item
                  :prop="'receivList.' + index + '.recipientPhone'"
                  :rules="personPhone.recipientPhone"
                >
                  <span slot="label">
                    <i style="color:red;">*</i>&nbsp;收货人联系方式：
                  </span>
                  <el-input v-model="item.recipientPhone" placeholder="字数长度1~30"></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'receivList.' + index + '.countyId'"
                  :rules="{type:'number',required: true, message: '省市区不能为空', trigger: ['change','blur']}"
                >
                  <span slot="label">省市区：</span>
                  <el-select
                    v-model="item.provinceId"
                    placeholder="省/直辖市"
                    class="address-select"
                    @change="onProvincesChange(item.provinceId,index)"
                  >
                    <el-option
                      v-for="itemp in provinces"
                      :key="itemp.id"
                      :label="itemp.name"
                      :value="itemp.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="item.cityId"
                    placeholder="城市"
                    class="address-select"
                    @change="onCityChange(item.cityId,index)"
                  >
                    <el-option
                      v-for="itemc in item.city"
                      :key="itemc.id"
                      :label="itemc.name"
                      :value="itemc.id"
                    ></el-option>
                  </el-select>
                  <el-select v-model="item.countyId" placeholder="区/县" class="address-select">
                    <el-option
                      v-for="itemy in item.county"
                      :key="itemy.id"
                      :label="itemy.name"
                      :value="itemy.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'receivList.' + index + '.addressLine'"
                  :rules="{required: true, message: '详细地址不能为空', trigger: 'blur'}"
                >
                  <span slot="label">详细地址：</span>
                  <el-input
                    v-model="item.addressLine"
                    placeholder="请输入200字以内"
                    type="textarea"
                    :rows="5"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedialog" type="primary">取 消</el-button>
        <el-button type="primary" @click="save('addform')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="updatedialog" custom-class="dialog-box" width='776px'>
      <div slot="title" class="dialog-title">
        <span class="reject-title">编辑人员</span>
      </div>
      <div class="dialog-body">
        <div>
          <div class="dialog-body-head">
            <i class="iconfont icon-jinqi myicon"></i>
            <span>基本信息</span>
          </div>
          <div class="dialog-body-body">
            <el-form label-width="200px" :rules="rules" status-icon :model="addform" ref="addform">
              <el-form-item>
                <span slot="label">所属客户：</span>
                <span style="color: red;">{{addform.customerName}}</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">所属部门：</span>
                <el-input
                  v-model="addform.departmentName"
                  placeholder="字数长度1~30"
                  readonly
                  @focus="onfocus"
                ></el-input>
                <el-tree
                  :data="departmentdata"
                  :props="defaultProps"
                  @node-click="changedepartment"
                  default-expand-all
                  v-show="isexpand"
                ></el-tree>
              </el-form-item>
              <el-form-item prop="purchaserName">
                <span slot="label">姓名：</span>
                <el-input v-model="addform.purchaserName" placeholder="字数长度1~30"></el-input>
              </el-form-item>
              <el-form-item prop="purchaserPhone" required>
                <span slot="label">联系方式：</span>
                <el-input v-model="addform.purchaserPhone" placeholder="字符长度1~30"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label">登录名：</span>
                <el-input v-model="addform.loginName"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label">登录密码：</span>
                <el-input v-model="addform.showpassword" :disabled="addform.changepassword">
                  <el-button slot="append" @click="initpassword">初始化密码</el-button>
                </el-input>
              </el-form-item>
              <el-form-item required>
                <span slot="label">账号状态：</span>
                <el-radio-group v-model="addform.accountStatus">
                  <el-radio :label="0">启用</el-radio>
                  <el-radio :label="1">不启用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <span slot="label">可见商品标签：</span>
                <el-checkbox-group v-model="addform.checkList">
                  <el-checkbox :label="item" v-for="(item,index) in visibleLabels" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item prop="name">
                <span slot="label">职务：</span>
                <el-input v-model="addform.position" placeholder="字数长度1~30"></el-input>
              </el-form-item>
              <el-form-item prop="staffId">
                <span slot="label">业务员账号：</span>
                <el-select
                  v-model="addform.staffId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入负责人账号或者姓名"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="onstaffchange"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id"
                  >
                    <span style="float: left">{{item.userName}}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.realName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item required>
                <span slot="label">业务员姓名：</span>
                <el-input v-model="addform.staffName" readonly></el-input>
              </el-form-item>
              <el-form-item prop="description">
                <span slot="label">备注：</span>
                <el-input
                  v-model="addform.description"
                  placeholder="请输入200字以内"
                  type="textarea"
                  :rows="5"
                ></el-input>
              </el-form-item>
              <div v-for="(item,index) in addform.receivList" :key="index">
                <el-form-item
                  :prop="'receivList.' + index + '.recipientName'"
                  :rules="{required: true, message: '收货人姓名不能为空', trigger: 'blur'}"
                >
                  <span slot="label">收货人姓名：</span>
                  <el-input v-model="item.recipientName" placeholder="字数长度1~30"></el-input>
                  <el-button type="primary" plain @click="addcustomer" v-if="index==0">新增</el-button>
                  <el-button type="danger" plain @click="delcustomer(index)" v-else="index==0">删除</el-button>
                </el-form-item>
                <el-form-item
                  :prop="'receivList.' + index + '.recipientPhone'"
                  :rules="personPhone.recipientPhone"
                >
                  <span slot="label">
                    <i style="color:red;">*</i>&nbsp;收货人联系方式：
                  </span>
                  <el-input v-model="item.recipientPhone" placeholder="字数长度1~30"></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'receivList.' + index + '.countyId'"
                  :rules="{type:'number',required: true, message: '省市区不能为空', trigger: ['change','blur']}"
                >
                  <span slot="label">省市区：</span>
                  <el-select
                    v-model="item.provinceId"
                    placeholder="省/直辖市"
                    class="address-select"
                    @change="onProvincesChange(item.provinceId,index)"
                  >
                    <el-option
                      v-for="itemp in provinces"
                      :key="itemp.id"
                      :label="itemp.name"
                      :value="itemp.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="item.cityId"
                    placeholder="城市"
                    class="address-select"
                    @change="onCityChange(item.cityId,index)"
                  >
                    <el-option
                      v-for="itemc in item.city"
                      :key="itemc.id"
                      :label="itemc.name"
                      :value="itemc.id"
                    ></el-option>
                  </el-select>
                  <el-select v-model="item.countyId" placeholder="区/县" class="address-select">
                    <el-option
                      v-for="itemy in item.county"
                      :key="itemy.id"
                      :label="itemy.name"
                      :value="itemy.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'receivList.' + index + '.addressLine'"
                  :rules="{required: true, message: '详细地址不能为空', trigger: 'blur'}"
                >
                  <span slot="label">详细地址：</span>
                  <el-input
                    v-model="item.addressLine"
                    placeholder="请输入200字以内"
                    type="textarea"
                    :rows="5"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeupdialog" type="primary">取 消</el-button>
        <el-button type="primary" @click="updatepurchaser('addform')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="部门名称" :visible.sync="adddepartment" width="400px">
      <el-form :model="form">
        <el-form-item label="部门名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedepartment">取 消</el-button>
        <el-button type="primary" @click="editdepart" v-if="isedit">确 定</el-button>
        <el-button type="primary" @click="adddepart" v-if="!isedit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="角色设置" :visible.sync="dialogRole" @close="cancelRole">
      <div class="dialog-head">全部角色列表</div>
      <el-checkbox-group v-model="roleIds">
        <el-checkbox
          v-for="(city,index) in externalList"
          :label="city.id"
          :key="index"
        >{{city.name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">取 消</el-button>
        <el-button type="primary" @click="RoleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head.vue";
import {
  customerdepartment,
  purchaserlist,
  customercmmmon,
  adddep,
  deldep,
  editdep,
  editInfo,
  addpurchaser,
  updatepurchaser,
  listdept,
  roleSet,
  roleSave,
  getRole,
  customers,
  isAvailable,
  findshoppeTags
} from "@/api/customerManage";
import { simplelist } from "@/api/classManage";
import { provinces_based_id, subs } from "@/api/basicSupplier";
export default {
  inject: ["reload"],
  name: "peoplemanage",
  data() {
    var checkLoginName = (rule, value, callback) => {
      isAvailable({
        userName: value
      }).then(res => {
        if (res.code == "000000") {
          if (res.data) {
            callback();
          } else {
            callback(new Error("登录名不可用"));
          }
        }
      });
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系方式不能为空"));
      }
      var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      var isMob = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (isMob.test(value) || isPhone.test(value)) {
        callback();
      } else {
        callback(new Error("联系方式错误"));
      }
    };
    return {
      visibleLabels: [],
      roleIds: [],
      externalList: [],
      dialogRole: false,
      password: null,
      updatedialog: false,
      defaultcheckedkeys: [],
      nameList: [],
      selectdepartmentId: 32,
      loading: false,
      isexpand: false,
      isedit: false,
      form: {
        name: ""
      },
      tableData: [],
      parentId: null,
      editId: null,
      adddepartment: false,
      customerName: "",
      departmentId: null,
      departmentdata: [],
      defaultProps: {
        children: "subDepartmentList",
        label: "name"
      },
      addform: {
        userId: null,
        changepassword: true,
        description: "",
        accountStatus: 1,
        editid: null,
        customerName: "",
        departmentId: null,
        departmentName: "",
        purchaserName: "",
        purchaserPhone: "",
        loginName: "",
        password: null,
        showpassword: "******",
        position: "",
        staffName: "",
        staffId: null,
        staffName: "",
        staffPhone: null,
        checkList: ["复选框 A"],
        radio: "2",
        receivList: [
          {
            addressLine: "",
            cityName: "",
            countyName: "",
            cityId: null,
            countyId: null,
            provinceId: null,
            recipientName: "",
            recipientPhone: "",
            city: [],
            county: []
          }
        ]
      },
      addform1: {
        userId: null,
        changepassword: true,
        description: "",
        accountStatus: 1,
        editid: null,
        customerName: "",
        departmentId: null,
        departmentName: "",
        purchaserName: "",
        purchaserPhone: "",
        loginName: "",
        password: null,
        showpassword: "******",
        position: "",
        staffName: "",
        staffId: null,
        staffName: "",
        staffPhone: null,
        checkList: [],
        radio: "2",
        receivList: [
          {
            addressLine: "",
            cityName: "",
            countyName: "",
            cityId: null,
            countyId: null,
            provinceId: null,
            recipientName: "",
            recipientPhone: "",
            city: [],
            county: []
          }
        ]
      },
      pageSize: 10,
      options: [],
      total: 0,
      page: 1,
      id: null,
      projectid: null,
      provinces: [],
      provincesId: null,
      countyId: null,
      city: [],
      county: [],
      adddialog: false,
      classstatus: [
        {
          status: 3,
          label: "不限"
        },
        {
          status: 0,
          label: "草稿"
        },
        {
          status: 1,
          label: "待审核"
        },
        {
          status: 2,
          label: "已驳回"
        }
      ],
      rules: {
        purchaserName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 1, max: 60, message: "长度在 1 到 30 个", trigger: "blur" }
        ],
        purchaserPhone: [{ validator: checkPhone, trigger: "blur" }],
        staffId: [
          { required: true, message: "业务员不能为空", trigger: "change" }
        ],
        description: [
          { min: 1, max: 200, message: "长度在 1 到 200字", trigger: "blur" }
        ],
        loginName: [{ validator: checkLoginName, trigger: "blur" }]
      },
      personPhone: {
        recipientPhone: [{ validator: checkPhone, trigger: "blur" }]
      },
      selectName: null,
      selectUserId: null
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.projectid = this.$route.query.pid;
    if (this.projectid) {
      findshoppeTags(this.projectid).then(res => {
        if (res.code == "000000") {
          this.visibleLabels = res.data;
        }
      });
    }
    this.department(this.id);
    this.getcommon(this.id);
    this.getProvinces();
  },
  activated() {
    this.id = this.$route.query.id;
    this.projectid = this.$route.query.pid;
    if (this.projectid) {
      findshoppeTags(this.projectid).then(res => {
        if (res.code == "000000") {
          this.visibleLabels = res.data;
        }
      });
    }
    this.department(this.id);
    this.getcommon(this.id);
    this.getProvinces();
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  computed: {
    userdate() {
      var time = new Date();
      return (
        time.getFullYear() +
        ("0" + (time.getMonth() + 1)).slice(-2) +
        ("0" + time.getDate()).slice(-2)
      );
    }
  },
  components: {
    addhead
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.purchaser(1);
    },
    cancelRole() {
      this.dialogRole = false;
      this.selectUserId = null;
      this.roleIds = [];
    },
    RoleSave() {
      roleSave(this.selectUserId, {
        roleIds: this.roleIds,
        type: 1
      }).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "已成功保存",
            type: "success"
          });
          this.cancelRole();
        }
      });
    },
    roleManage() {
      this.$router.push({
        name: "CustomerRoleAdmin",
        query: { id: this.id }
      });
    },
    roleset(id) {
      this.dialogRole = true;
      this.selectUserId = id;
      getRole(id).then(res => {
        if (res.code == "000000") {
          this.roleIds = res.data.map(function(item) {
            return item.id;
          });
        }
      });
      roleSet({
        customerId: this.id - 0,
        pageSize: this.pageSize,
        pageNum: 1,
        type: 1
      }).then(res => {
        if (res.code == "000000") {
          this.externalList = res.data.items;
        }
      });
    },
    initpassword() {
      this.$confirm("确定要初始化密码吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.addform.changepassword = false;
        this.addform.showpassword = "111111";
        this.addform.password = "111111";
      });
    },
    onstaffchange(val) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].id === val) {
          this.addform.staffName = this.options[i].realName;
          break;
        }
      }
    },
    closeupdialog() {
      this.$confirm("取消后，当前填写的信息将不保存，确定取消？", "取消确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.addform = this.addform1;
        this.$refs["addform"].clearValidate();
        this.updatedialog = false;
      });
    },
    closedepartment() {
      this.adddepartment = false;
      this.form.name = "";
    },
    handleClick(data, checked) {
      if (checked == true) {
        this.purchaser(this.page);
        this.$refs.treeForm.setCheckedNodes([data]);
      }
    },
    getlistdept(id) {
      listdept(id).then(res => {
        if (res.code == "000000") {
          this.nameList = res.data;
        }
      });
    },
    updatepurchaser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updatepurchaser(this.addform.editid, {
            accountStatus: this.addform.accountStatus,
            departmentId: this.addform.departmentId,
            description: this.addform.description,
            loginName: this.addform.loginName,
            name: this.addform.purchaserName,
            password: this.addform.changepassword
              ? this.addform.password
              : this.addform.password,
            phone: this.addform.purchaserPhone,
            position: this.addform.position,
            staffId: this.addform.staffId,
            updateCustomerRecipientParamList: this.addform.receivList,
            visibleLabel: this.addform.checkList.join(","),
            userId: this.addform.userId
          }).then(res => {
            if (res.code == "000000") {
              this.$message({
                type: "success",
                message: "更新成功",
                customClass: "mzindex"
              });
              this.reload();
            } else if (/^01/.test(res.code)) {
              this.$message({
                message: res.message,
                type: "error",
                customClass: "mzindex"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    closedialog() {
      this.$confirm("取消后，当前填写的信息将不保存，确定取消？", "取消确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.addform = this.addform1;
        this.$refs["addform"].clearValidate();
        this.adddialog = false;
      });
    },
    onfocus() {
      this.isexpand = true;
    },
    changedepartment(data) {
      this.addform.departmentName = data.name;
      this.addform.departmentId = data.id;
      this.isexpand = false;
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addpurchaser({
            accountStatus: this.addform.accountStatus,
            departmentId: this.addform.departmentId
              ? this.addform.departmentId
              : this.departmentdata
              ? this.departmentdata[0].id
              : null,
            loginName: this.addform.loginName,
            password: this.addform.password ? this.addform.password : "111111",
            position: this.addform.position,
            name: this.addform.purchaserName,
            phone: this.addform.purchaserPhone,
            staffId: this.addform.staffId,
            customerRecipientParamList: this.addform.receivList,
            visibleLabel: this.addform.checkList.join(","),
            description: this.addform.description
          }).then(res => {
            if (res.code == "000000") {
              this.addform = this.addform1;
              this.adddialog = false;
              this.$message({
                type: "success",
                message: "保存成功",
                customClass: "mzindex"
              });
              this.reload();
            } else if (/^01/.test(res.code)) {
              this.$message({
                type: res.message,
                message: "error",
                customClass: "mzindex"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    addnew() {
      this.adddialog = true;
      this.addform = this.addform1;
      this.addform.customerName = this.customerName;
      this.getProvinces();
    },
    remoteMethod(query) {
      this.loading = true;
      simplelist({
        count: 6,
        userName: query
      }).then(res => {
        this.loading = false;
        if (res.code == "000000") {
          this.options = res.data;
        }
      });
    },
    handleCurrentChange(val) {
      this.purchaser(val);
    },
    editcustomer(id) {
      var that = this;
      this.updatedialog = true;
      editInfo(id).then(res => {
        if (res.code == "000000") {
          var len = res.data.customerRecipientDTO.length;
          for (var i = 0; i < len; i++) {
            res.data.customerRecipientDTO[i].city = [];
            res.data.customerRecipientDTO[i].county = [];
          }
          this.addform.checkList = res.data.visibleLabel.split(",").map(Number);
          this.addform.receivList = res.data.customerRecipientDTO;
          this.addform.accountStatus = res.data.userDTO.status;
          (this.addform.departmentId = this.addform.departmentId
            ? this.addform.departmentId
            : this.departmentdata
            ? this.departmentdata[0].id
            : null),
            (this.addform.staffId = res.data.staffId);
          this.addform.staffName = res.data.staffName;
          this.addform.staffPhone = res.data.staffPhone;
          this.addform.editid = res.data.id;
          this.addform.userId = res.data.userId;
          this.addform.departmentName = res.data.departmentName;
          this.addform.departmentId = res.data.departmentId;
          this.addform.purchaserName = res.data.userDTO.realName;
          this.addform.purchaserPhone = res.data.phone;
          this.addform.position = res.data.position;
          this.addform.description = res.data.description;
          this.addform.customerName = res.data.customerName;
          this.addform.loginName = res.data.userDTO.userName;
          this.addform.password = res.data.userDTO.password;
          for (var i = 0; i < len; i++) {
            this.getcity(res.data.customerRecipientDTO[i].provinceId, i);
            this.getcounty(res.data.customerRecipientDTO[i].cityId, i);
          }
          this.options = [
            {
              userName: res.data.staffAccount,
              id: res.data.staffId
            }
          ];
        }
      });
    },
    addcustomer() {
      this.addform.receivList.push({
        addressLine: "",
        cityId: null,
        countyId: null,
        provinceId: null,
        recipientName: "",
        recipientPhone: "",
        city: [],
        county: []
      });
    },
    delcustomer(index) {
      this.addform.receivList.splice(index, 1);
    },
    editdepart() {
      editdep(this.editId, this.form.name).then(res => {
        if (res.code == "000000") {
          this.adddepartment = false;
          this.reload();
          this.parentId = null;
          this.form.name = "";
          this.editId = null;
        }
      });
    },
    adddepart() {
      adddep({
        customerId: this.id,
        name: this.form.name,
        parentId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.adddepartment = false;
          this.reload();
          this.parentId = null;
          this.form.name = "";
        }
      });
    },
    edit(data) {
      this.form.name = data.name;
      this.isedit = true;
      this.editId = data.id;
      this.adddepartment = true;
    },
    append(data) {
      this.adddepartment = true;
      this.parentId = data.id;
    },
    remove(data) {
      this.$confirm("确定删除部门吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deldep(data.id).then(res => {
          if (res.code == "000000") {
            this.reload();
          }
        });
      });
    },
    getcommon(id) {
      customercmmmon(id).then(res => {
        if (res.code == "000000") {
          this.customerName = res.data.name;
          this.addform.customerName = res.data.name;
        }
      });
    },
    godetail(id) {
      this.$router.push({
        name: "peopledetail",
        query: { id: id }
      });
    },
    purchaser(page) {
      purchaserlist({
        departmentId: this.selectdepartmentId,
        name: this.selectName == "" ? null : this.selectName,
        pageNum: page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    department(id) {
      customerdepartment(id).then(res => {
        if (res.code == "000000") {
          this.departmentdata = res.data;
          var a = [];
          if (res.data) {
            a.push(res.data[0].id);
            this.selectdepartmentId = res.data[0].id;
          }
          this.defaultcheckedkeys = a;
          this.getlistdept(this.selectdepartmentId);
          if (res.data.length) {
            this.purchaser(this.page);
          }
        }
      });
    },
    onCityChange(val, index) {
      this.addform.receivList[index].county = [];
      this.addform.receivList[index].countyId = null;
      this.getcounty(val, index);
    },
    onProvincesChange(val, index) {
      this.addform.receivList[index].city = [];
      this.addform.receivList[index].county = [];
      this.addform.receivList[index].countyId = null;
      this.addform.receivList[index].cityId = null;
      this.getcity(val, index);
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = res.data;
        }
      });
    },
    getcity(id, index) {
      subs(id).then(res => {
        if (res.code == "000000") {
          this.addform.receivList[index].city = res.data;
        }
      });
    },
    getcounty(id, index) {
      subs(id).then(res => {
        if (res.code == "000000") {
          this.addform.receivList[index].county = res.data;
        }
      });
    },
    handleNodeClick(data, checked) {
      this.selectdepartmentId = data.id;
      this.purchaser(this.page);
      this.$refs.treeForm.setCheckedNodes([data]);
    }
  }
};
</script>
<style>
.customer-name .el-input__inner {
  color: red !important;
}
.mzindex {
  z-index: 9999 !important;
}
</style>
<style scoped lang="less">
.brandBox {
  width: 100%;
  margin-bottom: 100px;
  .buttonbox {
    margin-top: 10px;
    font-size: 14px;
    color: red;
    padding: 15px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
  }
  .info-box {
    width: 100%;
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    .department {
      width: 30%;
      border: 1px solid #e4e4e4;
      .department-head {
        box-sizing: border-box;
        padding: 0 15px;
        background-color: #f3f3f3;
        border-bottom: 1px solid #e4e4e4;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
      }
      .left-box {
        padding-top: 12px;
      }
    }
    .personnel {
      width: 65%;
      border: 1px solid #e4e4e4;
      .department-head {
        box-sizing: border-box;
        padding: 0 15px;
        background-color: #f3f3f3;
        border-bottom: 1px solid #e4e4e4;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .button-box {
          display: flex;
          align-items: center;
          .button-head {
            padding-left: 10px;
            padding-right: 10px;
            height: 30px;
            border: 1px solid #d1d1d1;
            cursor: pointer;
            background-color: #fff;
            border-radius: 3px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;
            .button-head-icon {
              margin-right: 5px;
            }
            .icon-add {
              font-size: 12px;
            }
          }
          .button-head:hover {
            background-color: #f3f3f3;
          }
        }
      }
      .select-box {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        .el-input {
          width: 200px;
        }
      }
      .block {
        margin: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .dialog-box {
    .dialog-body {
      margin: 5px auto;
      width:740px;
      height: 400px;
      overflow: auto;
      .dialog-body-head {
        width: 100%;
        height: 40px;
        border: 1px solid #e4e4e4;
        font-size: 16px;
        color: #666;
        font-weight: 700;
        display: flex;
        align-items: center;
        padding-left: 10px;
        box-sizing: border-box;
        background-color: #f3f3f3;
        .myicon {
          font-size: 23px;
        }
      }
      .dialog-body-body {
        background-color: #f3f3f3;
        padding-top: 10px 0;
        .head-shouhuo {
          width: 100%;
          height: 40px;
          background-color: #f3f3f3;
          border: 1px solid #e4e4e4;
          font-size: 16px;
          color: #666666;
          font-weight: bold;
          line-height: 40px;
          margin-bottom: 15px;
          padding-left: 10px;
          box-sizing: border-box;
          .myicon {
            font-size: 23px;
            margin-top: 3px;
          }
        }
        .el-input {
          width: 400px;
        }
        .el-tree {
          width: 400px;
        }
        .el-select {
          width: 400px;
        }
        .address-select {
          width: 130px;
        }
        .el-textarea {
          width: 400px;
        }
      }
    }
    .dialog-title {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 50px;
      background-color: #f3f3f3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      .reject-title {
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
    }
    .dialog-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #d1d1d1;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }
  }
  .dialog-head {
    margin-bottom: 30px;
  }
}
</style>

