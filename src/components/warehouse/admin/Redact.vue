<template>
  <div class="wareRedactBox">
    <div class="redactTable">
      <div class="redactTopBox">
        <span><i></i>仓库编辑</span>
      </div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="仓库名称：" prop="name">
          <el-input v-model="addData.name" placeholder="字数长度1~50以内"></el-input>
        </el-form-item>
        <el-form-item label="仓库类型：" required>
          <el-radio-group v-model="addData.type">
            <el-radio :label="1"  v-if="addData.status== '3'||addData.oldId!=0" disabled>RDC</el-radio>
            <el-radio :label="2"  v-if="addData.status == '3'||addData.oldId!=0" disabled>DC</el-radio>
            <el-radio :label="3"  v-if="addData.status == '3'||addData.oldId!=0" disabled>FDC</el-radio>
            <el-radio :label="1"  v-if="addData.status != '3'&&addData.oldId==0" >RDC</el-radio>
            <el-radio :label="2"  v-if="addData.status != '3'&&addData.oldId==0" >DC</el-radio>
            <el-radio :label="3"  v-if="addData.status != '3'&&addData.oldId==0">FDC</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="仓库归属组织机构：" prop="organizationId">
          <el-select
            v-model="addData.organizationId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入并选择组织机构"
            @change="getValue"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in partnerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库地址：" required>
          <el-form-item
            style="display: inline-block;"
            prop="provinceId">
            <el-select v-model="addData.provinceId" filterable placeholder="省" style="width: 130px;" @change="o1change">
              <el-option
                v-for="o in o1"
                :key="o.id"
                :label="o.name"
                :value="o.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            style="display: inline-block;"
            prop="cityId">
            <el-select v-model="addData.cityId" filterable placeholder="市" style="width: 130px;" @change="o2change"
                       prop="cityId">
              <el-option
                v-for="o in o2"
                :key="o.id"
                :label="o.name"
                :value="o.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            style="display: inline-block;"
            prop="countyId">
            <el-select v-model="addData.countyId" filterable placeholder="县/区" style="width: 130px;" @change="o3change"
                       prop="countyId">
              <el-option
                v-for="o in o3"
                :key="o.id"
                :label="o.name"
                :value="o.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="详细地址：" prop="addressLine">
          <el-input type="textarea" v-model="addData.addressLine" placeholder="请输入200字以内"></el-input>
        </el-form-item>
        <el-form-item label="总面积：" prop="grossArea">
          <el-input v-model="addData.grossArea"></el-input>
          ㎡
        </el-form-item>
        <el-form-item label="可使用面积：" prop="availableArea">
          <el-input v-model="addData.availableArea"></el-input>
          ㎡
        </el-form-item>
        <el-form-item label="可使用货架面积：">
          <el-input v-model="addData.shelfArea" style="width:113px"></el-input>
          ㎡
          <span class="label">可使用托盘区面积：</span>
          <el-input v-model="addData.palletArea" style="width:113px"></el-input>
          ㎡
        </el-form-item>
        <el-form-item label="可使用工作区面积：">
          <el-input v-model="addData.workspace" style="width:113px"></el-input>
          ㎡
          <span class="label">货架数量：</span>
          <el-input v-model="addData.shelvesQty" style="width:113px"></el-input>
          组
        </el-form-item>

        <el-form-item label="仓库联系人："
                      v-for="(item,index) in addData.createWarehouseContactParams"
                      :key="index"
                      required
        >
          <el-form-item
            style="display: inline-block;"
            :prop="'createWarehouseContactParams.' + index + '.name'"
            :rules="{
            required: true, message: '仓库联系人不能为空', trigger: 'blur'
            }">
            <el-input v-model="item.name" style="width:113px"></el-input>&nbsp;&nbsp;&nbsp;
          </el-form-item>
          &nbsp;<span class="label">联系方式：</span>
          <el-form-item
            style="display:inline-block;"
            :prop="'createWarehouseContactParams.' + index + '.phone'"
            :rules="{
             required: true, message: '联系方式不能为空', trigger: 'blur'
             }">
            <el-input v-model="item.phone" style="width:113px;padding: 0px;"></el-input>
          </el-form-item>
          <el-button type="primary" v-if="index==0" @click="poplepush()" plain>新增联系人</el-button>
          <el-button type="primary" v-if="index!=0"
                     @click="depople(index)" plain>删除
          </el-button>
        </el-form-item>
        <el-form-item label="仓库管理员账号：" prop="userManagerId">
          <el-form-item style="display: inline-block;">
            <el-select
              clearable
              style="width:113px"
              v-model="addData.userManagerId"
              filterable
              remote
              reserve-keyword
              placeholder="输入选择"
              @change="getUserValue"
              :remote-method="userManagerRemoteMethod"
              :loading="loading">
              <el-option
                v-for="item in userManagerOptions"
                :key="item.id"
                :label="item.userName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          &nbsp;&nbsp;&nbsp;
          <el-form-item style="display: inline-block;">
            <span class="label">仓库管理员姓名：</span>
            <el-input v-model="addData.userManagerRealName" style="width:113px" :disabled="true"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="$authorities.WarehouseAdminUpdateRelevant"
                     @click="submitFormAddDraft('ruleForm')">保存至草稿
          </el-button>
          <el-button type="primary" v-if="$authorities.WarehouseAdminUpdateRelevant" @click="submitFormAdd('ruleForm')">
            保存并提交审核
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {
    postSimpleList,
    getWarehouseDetaills,
    getWarehouseUpdateDetaills,
    deleteWarehouseDelete,
    putWarehouseUpdateDraft,
    postWarehouseContact,
    getWarehouseRedactDetaills,
    getWarehouseLog,
    putWarehouseReview,
    putWarehouseSubmitReview,
    putWarehouseUpdateSubmitReview,
    deleteWarehouseContactDelete,
    deleteWarehouseContactIdDelete,
    postWarehouseDvailableList,
    postWarehouseAddSumit,
    postWarehouseAddDraft,
    postWarehouseDraftList,
    postWarehousePendingList,
    postWarehouseRejectedList,
    getWarehouseStatusCount
  } from '@/api/warehouse/warehouseAdmin'
  import {
    provinces_based_id,
    subs,
    postSupplierOptions,
    postOrganizationOptions,
    postBrandOptions,
    deleteFileDelete
  } from "@/api/common/commonApi"
  import {simpleList} from "@/api/userService"
  import {
    getOrganizeUser,
  } from "@/api/order/orderManage";

  export default {
    inject:['reload','close'],
    name:'WarehouseRedact',
    data() {
      var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('号码不能为空!!'))
        }
        setTimeout(() => {
          if (!phoneReg.test(value)) {
            callback(new Error('格式有误'))
          } else {
            callback()
          }
        }, 1000);
      }
      return {
        oldId:'',
        partnerOptions: [],//合作伙伴
        //省市县
        o1: [],
        o2: [],
        o3: [],

        addData: {
          addressLine: "", //详细地址
          provinceId: '', //省
          cityId: '',//城市
          countyId: '',//县
          createWarehouseContactParams: [ //联系人
            {
              name: "",
              phone: '',
              warehouseId: 0
            }
          ],
          availableArea: null,//可用面积
          grossArea: null,  //总面积
          name: "",
          organizationId: null,////组织机构ID
          oldId: 0,
          palletArea: null,//to盘区面积
          shelfArea: null, //货架面积
          shelvesQty: null, //货架数量
          type: 1,//类型
          userManagerId: null,//管理员ID
          workspace: null//工作区面积
        },
        userManagerRealName: '',
        userManagerOptions: [],
        loading: false,
        rules:
          {
            userManagerId: [
              {required: true, message: '请选择管理员账户', trigger: 'change'}
            ],
            organizationId: [
              {required: true, message: '请选择合作伙伴', trigger: 'change'}
            ],
            name: [
              {required: true, message: '请输入仓库名称', trigger: 'blur'},
              {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
            ],
            partner: [
              {required: true, message: '请选择合作伙伴', trigger: 'change'}
            ],
            grossArea: [
              {required: true, message: '请输入总面积', trigger: 'change'}
            ],
            availableArea: [
              {required: true, message: '可用面积', trigger: 'change'}
            ],
            provinceId: [
              {required: true, message: '请选择省份', trigger: 'change'}
            ],
            cityId: [
              {required: true, message: '请选择城市', trigger: 'change'}
            ],
            countyId: [
              {required: true, message: '请选择地区/县', trigger: 'change'}
            ],
            addressLine: [
              {required: true, message: '请输入地址', trigger: 'change'}
            ],
          }
      }
    },
    created() {
      provinces_based_id().then(res => {
        this.o1 = res.data
      });
      this.addData.id = this.$route.query.Id;
      this.getWarehouseRedactDetaills();
      this.oldId=this.$route.query.Id;
    },
    activated() {
      if (this.oldId!=this.$route.query.Id){
        provinces_based_id().then(res => {
          this.o1 = res.data
        });
        this.addData.id = this.$route.query.Id;
        this.getWarehouseRedactDetaills();
        this.oldId=this.$route.query.Id;
      }
    },
    mounted() {

    },
    methods: {
      //修改组织机构清空管理员账号
      changeOrganization(){
//        this.addData.userManagerId=null;
//        this.addData.userManagerRealName='';
//        this.userManagerOptions=[];
      },
      //管理员模糊搜索
      userManagerRemoteMethod(query) {
        if (query !== '') {
          postSimpleList(
            {
              userName: query,
              type: 0,
            }
          ).then(res => {
            this.userManagerOptions = res.data
          })
        } else {
          this.userManagerOptions = [];
        }
      },
      //获取编辑仓库的详情
      getWarehouseRedactDetaills() {
        getWarehouseRedactDetaills(
          this.$route.query.Id,
        )
          .then((res) => {
            console.log(res)
            this.addData = res.data;
//            this.addData.addressLine = res.data.addressLine;
//            this.addData.availableArea = res.data.availableArea;
//            this.addData.cityId = res.data.cityId;
//            this.addData.countyId = res.data.countyId;
//            this.addData.grossArea = res.data.grossArea;
//            this.addData.id = res.data.id;
//            this.addData.name = res.data.name;
//            this.addData.oldId = res.data.oldId;
//            this.addData.organizationId = res.data.organizationId;
//            this.addData.palletArea = res.data.palletArea;
//            this.addData.provinceId = res.data.provinceId;
//            this.addData.shelfArea = res.data.shelfArea;
//            this.addData.shelvesQty = res.data.shelvesQty;
//            this.addData.type = res.data.type;
//            this.addData.createWarehouseContactParams = res.data.warehouseContactDTOList;
//            this.addData.workspace = res.data.workspace;
            this.$set(this.addData, 'createWarehouseContactParams', res.data.warehouseContactDTOList);
            this.$set(this.addData, 'id', res.data.id);
            // this.userManagerRealName = res.data.userManagerRealName;
            this.userManagerOptions = [
              {
                id: res.data.userManagerId,
                userName: res.data.userManagerName,
                realName: res.data.userManagerRealName,
              }
            ]
            this.partnerOptions = [
              {
                id: res.data.organizationId,
                name: res.data.organizationName
              }
            ]
            subs(this.addData.provinceId).then(res => {
              this.o2 = res.data
            })
            subs(this.addData.cityId).then(res => {
              this.o3 = res.data
            })
          }).catch(err => {
          console.log(err)
        })
      },
      //直接更新仓库
      putWarehouseUpdateDraft(id, data) {
        putWarehouseUpdateDraft(
          this.$route.query.Id,
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存草稿成功',
              type: "success",
            });
            this.close({name:'WarehouseRedact', to: {name:'WarehouseAdmin', params:{isUpdate:true}}});
          } else if (/^98/.test(res.code)) {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }else {
            this.$message({
              message: '保存草稿失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //更新仓库并提交审核
      putWarehouseUpdateSubmitReview(id, data) {
        putWarehouseUpdateSubmitReview(
          this.$route.query.Id,
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存并提交审核成功',
              type: "success",
            });
            this.close({name:'WarehouseRedact', to: {name:'WarehouseAdmin', params:{isUpdate:true}}});
          } else if (/^98/.test(res.code)) {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }else {
            this.$message({
              message: '保存并提交审核失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //供应商模糊查询
      remoteMethod(query) {
        console.log(query)
        if (query !== '') {
          this.loading = true;
          postOrganizationOptions(
            query
          ).then((res) => {
            this.partnerOptions = res.data;
            console.log(this.partnerOptions);
          }).catch(err => {
            console.log(err)
          });
          this.loading = false;
        } else {
          this.partnerOptions = [];
        }
      },
      //getUserValue 管理员账户下拉框事件
      getUserValue(value) {
        let name = this.userManagerOptions.filter(item => {
          return item.id == value;
        });
        this.addData.userManagerRealName = name[0].realName;
        this.addData.userManagerName = name[0].username;
        console.log(value);
        console.log(this.addData);
      },
      //下拉框事件
      getValue(value) {
        let name = this.partnerOptions.filter(item => {
          return item.id == value;
        });
        this.addData.organizationName = name[0].name;
        this.changeOrganization()
      },
      //省市区
      o1change(data) {
        console.log(this.addData.provinceId)
        this.addData.cityId = ''
        this.addData.countyId = ''
        subs(data).then(res => {
          this.o2 = res.data
        })
      },
      o2change(data) {
        this.addData.countyId = ''
        subs(data).then(res => {
          this.o3 = res.data
        })
      },
      o3change(data) {
      },
      //保存并提审postWarehouseAddSumit
      postWarehouseAddSumit(data) {
        postWarehouseAddSumit(
          this.addData
        ).then((res) => {
          console.log(res)
          if (res.code == '000000') {
            this.$message({
              message: '保存草稿并提审成功',
              type: "success",
            });
            this.close({name:'WarehouseRedact', to: {name:'WarehouseAdmin', params:{isUpdate:true}}});
          } else if (/^98/.test(res.code)) {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }else {
            this.$message({
              message: '保存草稿并提审失败',
              type: 'warning',
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //创建仓库并保存为草稿
      postWarehouseAddDraft(data) {
        postWarehouseAddDraft(
          this.addData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '保存草稿成功',
              type: "success",
            });
            this.close({name:'WarehouseRedact', to: {name:'WarehouseAdmin', params:{isUpdate:true}}});
          } else if (/^98/.test(res.code)) {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }else {
            this.$message({
              message: '保存草稿失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //新增联系人
      poplepush() {
        this.addData.createWarehouseContactParams.push({name: '', phone: '', warehouseId: this.$route.query.Id,})
      },
      //删除联系人
      depople(index) {
        this.addData.createWarehouseContactParams.splice(index, 1)
      },
      //保存草稿
      submitFormAddDraft(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.putWarehouseUpdateDraft();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //保存草稿并提交审核
      submitFormAdd(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.putWarehouseUpdateSubmitReview();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
  }
</script>
<style>
  .wareRedactBox .el-input__inner{
    padding: 0 10px;
  }
  .wareRedactBox .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    /*position: absolute;*/
    /*top: 12px;*/
    /*left: 450px;*/
  }
</style>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .wareRedactBox {
    width: 100%;
    padding-top: 10px;
    .redactTable {
      border: 1px solid #d1d1d1;
      .redactTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        margin-bottom: 20px;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-form {
        margin: 0 0 50px 50px;
        .el-form-item {
          .el-form-item__content {
            .label {
              margin-left: 20px;
              display: inline-block;
              width: 130px !important;
              text-align: right;
            }
            .el-input {
              width: 400px;
            }
            .el-textarea {
              width: 400px;
            }
            .el-select {
              width: 400px;
            }
          }
        }
      }
    }
  }
</style>
