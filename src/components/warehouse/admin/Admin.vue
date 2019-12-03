<template>
  <div class="adminBox">
    <div class="buttonBox">
      <el-button size="small"
                 v-for="item,index in btnData"
                 :key="index"
                 :class="{btnactive:index==active}"
                 @click="btnActive(index,item.statusName)">
        {{item.statusName}}({{item.statusCount}})
      </el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="font-size: 14px"><i
            class="el-icon-arrow-up"></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow" style="font-size: 14px"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="queryResult()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>

        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="homeText">
            <div class="time-box">
              <span>仓库ID:</span>
              <el-input
                type="number"
                placeholder="仓库ID"
                v-model="query.id"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>仓库名称:</span>
              <el-input
                placeholder="仓库名称"
                v-model="query.name"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>仓库类型:</span>
              <el-select v-model="query.type" placeholder="请选择仓库类型">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="time-box">
              <span>仓库归属组织机构:</span>
              <el-input
                placeholder="仓库归属组织机构"
                v-model="query.organizationName"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>仓库联系人:</span>
              <el-input
                placeholder="仓库联系人"
                v-model="query.warehouseContactName"
                clearable>
              </el-input>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <el-button size="small" icon="el-icon-plus" @click="goAddwarehouse()" v-show="$authorities.WarehouseAdminCreateRelevant"  >添加</el-button>
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="id"
            label="仓库ID"
            width="80"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '3'">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="仓库名称"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="organizationName"
            label="仓库归属组织机构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="type"
            label="仓库类型"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == '1'">RDC</span>
              <span v-if="scope.row.type == '2'">DC</span>
              <span v-if="scope.row.type == '3'">FDC</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="addressLine"
            :show-overflow-tooltip="true"
            label="仓库地址"
            align="center">
          </el-table-column>
          <el-table-column
            prop="warehouseCntactDTOS"
            label="仓库联系人"
            align="center">
            <template slot-scope="scope">
              <span v-for="item,index in scope.row.warehouseContactDTOS">{{item.name}}<br></span>
            </template>
          </el-table-column>
          <el-table-column
            label="仓库联系方式"
            align="center">
            <template slot-scope="scope">
              <span v-for="item,index in scope.row.warehouseContactDTOS">{{item.phone}}<br></span>
            </template>
          </el-table-column>
          <el-table-column
            label="仓库状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">草稿</span>
              <span v-if="scope.row.status == '1'">待审核</span>
              <span v-if="scope.row.status == '2'">已驳回</span>
              <span v-if="scope.row.status == '3'">可用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="设置"
            width="160"
            align="center">
            <template slot-scope="scope">
              <span   v-if="scope.row.status != '3'">---</span>
              <el-button type="text"
                         v-if="scope.row.status == '3'"
                         v-show="$authorities.WarehouseCircuit"
                         @click="goDeliveryRouteList(scope.row)">线路管理
              </el-button>
              <!--<el-button type="text"-->
              <!--v-if="scope.row.status == '3'"-->
              <!--v-show="$authorities.WarehouseLocationAdmin"-->
              <!--@click="goWarehouseLocationAdmin(scope.row)">库位管理-->
              <!--</el-button>-->
              <el-button type="text"
                         v-if="scope.row.status == '3'"
                         v-show="$authorities.WarehouseCircuitAssign"
                         @click="goDeliveryDistributionRoute(scope.row)">线路分配管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goWarehouseDetaills(scope.row)"
                         v-show="$authorities.WarehouseAdminDetailRelevant"
                         type="text" size="small">详情
              </el-button>
              <el-button v-if="scope.row.status != '1'" @click="goWarehouseRedact(scope.row)"
                         v-show="$authorities.WarehouseAdminUpdateRelevant"
                         :disabled="scope.row.status == '2'&& scope.row.hasEditing == true"
                         type="text" size="small">编辑
              </el-button>
              <el-button
                @click="goWarehouseAudit(scope.row)"
                v-show="$authorities.WarehouseAdminReview"
                v-if="scope.row.status == '1'"
                type="text" size="small">审核
              </el-button>
              <el-button type="text" size="small"
                         v-show="$authorities.WarehouseAdminCreateRelevant||$authorities.WarehouseAdminUpdateRelevant"
                         v-if="scope.row.status == '0'"
                         @click="dialogBring = !dialogBring ,deleteId = scope.row.id">提审
              </el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.status == '0'||scope.row.status == '2'"
                         v-show="$authorities.WarehouseAdminCreateRelevant||$authorities.WarehouseAdminUpdateRelevant"
                         @click="dialogDelete = !dialogDelete ,deleteId = scope.row.id">删除
              </el-button>
              <el-button @click="goUpdatedDetails(scope.row)"
                         type="text"
                         v-show="$authorities.WarehouseAdminDetailRelevant"
                         v-if="scope.row.status != '3'&& scope.row.hasEditing == true"
                         size="small">原始数据详情
              </el-button>
              <el-button type="text"
                         v-show="$authorities.WarehousePermissionData"
                         v-if="scope.row.status == '3'"
                         @click="clickPermissionData(scope.row)">设置查看权限
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;padding: 0 5px;"
          :total=returnData.total>
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogDelete" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">删除提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">删除之后，列表将不再展示该数据，确定要删除吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="dialogDelete=false,deleteWarehouseDelete()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogBring" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">提审提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">确定当前填写的信息无误，可以提交审核吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBring = false">取 消</el-button>
        <el-button type="primary" @click="dialogBring=false,putWarehouseSubmitReview()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPermission" width="800px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">设置查看权限</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>仓库ID：</th>
            <td>{{setPermissionWarehouseData.id}}</td>
            <th><i></i>仓库名称：</th>
            <td>{{setPermissionWarehouseData.name}}</td>
            <th><i></i>仓库类型：</th>
            <td>
              <span v-if="setPermissionWarehouseData.type == '1'">RDC</span>
              <span v-if="setPermissionWarehouseData.type == '2'">DC</span>
              <span v-if="setPermissionWarehouseData.type == '3'">FDC</span>
            </td>
          </tr>
          <tr>
            <th><i></i>归属组织机构：</th>
            <td>{{setPermissionWarehouseData.organizationName}}</td>
            <th><i></i>仓库联系人：</th>
            <td>{{setPermissionWarehouseData.warehouseContactDTOS[0].name}}</td>
            <th><i></i>联系方式：</th>
            <td>{{setPermissionWarehouseData.warehouseContactDTOS[0].phone}}</td>
          </tr>
        </table>
        <div class="listBox">
          <div class="listBoxTop">
            <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;选择可查看当前仓库的组织机构</span>
            <span style="color: red;font-size: 12px;">Tip：已选组织机构有查看当前仓库基本信息、商品库存的权利</span>
          </div>
          <el-form :model="setPermissionData" :rules="rules" ref="ruleForm" style="margin: 20px">
            <el-form-item prop="organizationIds">
              <el-transfer
                :props="{
              key: 'id',
              label: 'name'
            }"
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入组织机构"
                :titles="['组织机构选项列表','已选组织机构']"
                v-model="setPermissionData.organizationIds"
                :data="organizationList">
              </el-transfer>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogPermission = false" style="float: right;margin-left: 10px">取 消</el-button>
              <el-button type="primary" style="float: right" @click="submitFormAdd('ruleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Butt from '../../common/Button/index'
  import {
    putWarehouseinfopurview,
    getWarehouseinfopurview,
    postWarehouseAdd,
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
    postWarehouseAddDraft,
    postWarehouseDraftList,
    postWarehousePendingList,
    postWarehouseRejectedList,
    getWarehouseStatusCount
  } from '@/api/warehouse/warehouseAdmin'
  import {
    getAvailableList,
    fuzzySearch
  }
    from '@/api/organizationManage'

  export default {
    inject:['reload','close'],
    name: "WarehouseAdmin",
    data() {
      return {
        setPermissionWarehouseData: {
          "addressLine": "string",
          "hasEditing": true,
          "id": 0,
          "name": "string",
          "oldId": 0,
          "status": 0,
          "type": 0,
          "warehouseContactDTOS": [
            {
              "id": 0,
              "name": "string",
              "phone": "string",
              "warehouseId": 0
            }
          ]
        },
        organizationList: [],
        setPermissionData: {
          organizationIds: [],
          warehouseId: null
        },
        rules:
          {
            organizationIds: [
              {required: true, message: '请选择组织机构', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '请输入仓库名称', trigger: 'blur'},
              {min: 1, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ],
          },
        dialogPermission: false,
        dialogDelete: false,
        dialogBring: false,
        deleteId: 0,
        postType: 0,
        returnData: {
          items: [],
          offset: 0,
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        typeOptions: [{
          value: 0,
          label: '不限'
        }, {
          value: 1,
          label: 'RDC'
        }, {
          value: 2,
          label: 'DC'
        }, {
          value: 3,
          label: 'FDC'
        }],
        //查询
        query: {
          organizationName: '',
          warehouseContactName: '',
          id: '',
          name: "",
          type: null,
          pageNum: 1,
          pageSize: 10,
        },
        //btn选中
        active: 0,
        oldActive:'',
        oldStatus:'',
        oldBtn:'',
        //btn数据
        btnData: [{
          "statusCount": '',
          "statusName": "可用",
        }, {
          "statusCount": '',
          "statusName": "待审核",
        }, {
          "statusCount": '',
          "statusName": "草稿",
        }, {
          "statusCount": '',
          "statusName": "已驳回",
        }],
        //删选显示
        isShow: true,
        //翻页
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    mounted() {
      if(this.$route.query.status){
        this.active = this.$route.query.status;
        this.postType = this.$route.query.status;
        this.postList();
      }
      this.postList();
      this.getWarehouseStatusCount();
      this.getTableData()

    },
    activated(){
      if(this.$route.query.status) {
        this.active = this.$route.query.status;
        this.postType = this.$route.query.status;
        this.postList();
      }
      if(this.$route.params.isUpdate){
        this.postList();
        this.getWarehouseStatusCount();
        this.getTableData()
      }
    },
    methods: {
      //获取已启用的组织机构 用于查看权限设置
      getTableData() {
        //已启用
        fuzzySearch(
          {
            pageNum: 1,
            pageSize: 1000,
            name: "",
          },
          // {
          //   pageNum: 1,
          //   pageSize: 50,
          //   id: null,//组织机构id
          //   organizationType: null,//组织机构性质
          //   name: null,
          //   nameId: null,
          //   parentName: null,//所属上级名称
          //   parentNameId: null,//所属上级名称
          //   provinceId: null,  //所属省
          //   agreementType: null,//协议类型 //1:战略协议 2：交叉持股
          //   signedAgreement: null,//是否签订协议
          //   useLeadingWMS: null,//是否使用领先EMS系统
          // },
        ).then(res => {
          this.organizationList=res.data.filter(item=>{
            return item.id!=this.setPermissionWarehouseData.organizationId
          })
        })
      },
      //查看权限设置提交保存
      submitFormAdd(formName) {
        this.putWarehouseinfopurview();
//        this.$refs[formName].validate((valid) => {
//          console.log(this.addData);
//          if (valid) {
//            this.putWarehouseinfopurview();
//          } else {
//            console.log('error submit!!');
//            return false;
//          }
//        });
      },
      //查看权限设置穿梭框搜索
      filterMethod(query, item) {
        console.log(item);
        return item.name.indexOf(query) > -1;
      },
      //点击设置查看权限
      clickPermissionData(row) {
        this.getTableData();
        this.setPermissionWarehouseData = row;
        this.setPermissionData.warehouseId = row.id;
//获取当前仓库的查看权限
        getWarehouseinfopurview(
          row.id
        ).then((res) => {
          if (res.code == '000000') {
            this.dialogPermission = !this.dialogPermission;
            console.log(res.data);
            let idArr = [];
            for (var i = 0; i < res.data.length; i++) {
              idArr.push(res.data[i].organizationId)
            }
            this.setPermissionData.organizationIds = idArr;
          } else if (res.data == '0') {
            this.$message({
              message: '获取数据失败',
              type: 'warning',
            })
          }
        }).catch(err => {

        });
      },
      //设置查看权限接口
      putWarehouseinfopurview() {
        putWarehouseinfopurview(
          this.setPermissionData.warehouseId, this.setPermissionData
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '设置成功',
                type: "success",
              });
//              this.postList();
//              this.getWarehouseStatusCount();
              this.dialogPermission = !this.dialogPermission;
            } else if (/^98/.test(res.code)) {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }else {
              this.$message({
                message: '设置失败',
                type: 'warning',
              })
            }
            console.log(res)
          }).catch(err => {
          console.log(err)
        });
      },
      //删除
      deleteWarehouseDelete() {
        deleteWarehouseDelete(
          this.deleteId
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.postList();
            this.getWarehouseStatusCount();
          }else if (/^98/.test(res.code)) {
            this.$message({
              message: res.message,
              type: "warning"
            });
          } else if (res.data == '0') {
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
        }).catch(err => {

        });
      },
      //提审
      putWarehouseSubmitReview() {
        putWarehouseSubmitReview(
          this.deleteId
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '提审成功',
                type: "success",
              });
              this.postList();
              this.getWarehouseStatusCount();
            } else if (/^98/.test(res.code)) {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }else {
              this.$message({
                message: '提审失败',
                type: 'warning',
              })
            }
            console.log(res)
          }).catch(err => {
          console.log(err)
        });
      },
      //获取各状态的数量
      getWarehouseStatusCount() {
        getWarehouseStatusCount()
          .then((res) => {
            console.log(res)
            this.btnData = res.data;
          }).catch(err => {
          console.log(err)
        });
      },
      //判断类型请求数据
      postList() {
        console.log(this.postType);
        switch (this.postType) {
          case 0:
            this.postWarehouseDvailableList(this.query)
            break;
          case 1:
            this.postWarehousePendingList(this.query)
            break;
          case 2:
            this.postWarehouseDraftList(this.query)
            break;
          case 3:
            this.postWarehouseRejectedList(this.query)
            break;
          default:

        }
      },
      //获取可用仓库列
      postWarehouseDvailableList(data) {
        //请求列表
        postWarehouseDvailableList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //获取待审核仓库列表
      postWarehousePendingList(data) {
        //请求列表
        postWarehousePendingList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        })
      },
      //获取草稿仓库列表
      postWarehouseDraftList(data) {
        //请求列表
        postWarehouseDraftList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        })
      },
      //获取已驳回仓库列表
      postWarehouseRejectedList(data) {
        //请求列表
        postWarehouseRejectedList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        })
      },
      //类型按钮
      btnActive(index, typename) {
        this.postType = index;
        this.oldActive = index;
        if (this.active != index) {
          this.query.pageNum = 1;
          this.postList();
        }
        this.active = index;
      },
      //重置
      reset(){
        this.query={
          organizationName: '',
          warehouseContactName: '',
          id: '',
          name: "",
          type: null,
          pageNum: 1,
          pageSize: 10,
        },
          this.postList()
      },
      //查询结果
      queryResult() {
        this.postList()
      },
      //
      goAddwarehouse(row) {
        // let {href} = this.$router.resolve({
        //   name: 'DeliveryRouteList',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({name: 'WarehouseAdd'});
      },
      //跳转线路管理
      goDeliveryRouteList(row) {
        // let {href} = this.$router.resolve({
        //   name: 'DeliveryRouteList',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/warehouse/admin/DeliveryRouteList', query: {Id: row.id,name: row.name}});
      },
      //跳转更新详情
      goUpdatedDetails(row) {
        this.$router.push({
          name: 'WarehouseUpdatedDetails',
          query: {
            Id: row.oldId
          }
        });
      },
      //跳转编辑
      goWarehouseRedact(row) {
        this.$router.push({path: '/warehouse/admin/Redact', query: {Id: row.id}});
      },
      //跳转库位管理
      goWarehouseLocationAdmin(row) {

        this.$router.push({path: '/warehouse/admin/locationadmin', query: {Id: row.id, name: row.name}});
      },
      // DeliveryDistributionRoute
      goDeliveryDistributionRoute(row) {
        // let {href} = this.$router.resolve({
        //   name: 'DeliveryDistributionRoute',
        //   query: {
        //     Id: row.id,
        //     name: row.name
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/warehouse/admin/DeliveryDistributionRoute', query: {Id: row.id,name: row.name}});
      },
      //跳转详情
      goWarehouseDetaills(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'WarehouseDetaills',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/warehouse/admin/detaills', query: {Id: row.id}});
      },
      //跳转审核
      goWarehouseAudit(row) {
        // console.log(row.id);
        this.$router.push({
          name: 'WarehouseAudit',
          query: {
            Id: row.id
          }
        });

      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postList();
      },
      //筛选show
      showHelp() {
        this.isShow = !this.isShow;
      }

    }
  }
</script>
<style>
  .adminBox .el-transfer .el-transfer-panel {
    width: 291px
  }
</style>
<style scoped lang="less">
  .adminBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .btnactive {
        background: #399;
        color: #fff;
        border: solid 1px #399;
      }
      .el-button {
        width: 160px;
        height: 30px;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop {
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        height: 48px;
        float: right;
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #333;
          cursor: pointer;
          font-size: 12px;
        }
        span:hover {
          color: #333;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        width: 100%;
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;

        .homeText {

          span {

            text-align: right;
          }
          .el-input {
            width: 200px;
            height: 50px;
            line-height: 56px;
            margin-left: 10px;
          }
          .time-box {
            display: inline-block;
            padding: 5px 10px;
            font-size: 14px;
          }
          .el-select {
            width: 200px;
            line-height: 56px;
            margin-left: 10px;
          }
        }

      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      line-height: 50px;
      .listBoxTop {
        background-color: #f3f3f3;
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .el-button {
          width: 80px;
          height: 30px;
        }
      }
      .el-table {
        margin-top: -2px;
        span {
          font-size: 12px;
        }
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin-top: 5px;
      margin-right: 20px;
      text-align: right;
    }
    .dialog-box {
      position: relative;
      .tree {
        display: flex;
        justify-content: center;
      }
      .message-box {
        padding: 0px 20px;
        font-size: 14px;
        color: #666;
        table {
          width: 90%;
          margin: 20px auto;
          td, th {
            border: 1px solid #d1d1d1;
            font-size: 12px;
            height: 53px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          th {
            background: #f5f7fa;
            color: #303133;
            text-align: right;
            width: 15%;
            i {
              color: red;
            }
          }
          td {
            color: #666666;
            text-align: left;
            padding-left: 10px;
            width: 15%;
          }
        }
        .el-input {
          width: 80%;
        }
        .first-step-box {
          padding: 20px 0;
          .first-step {
            color: red;
            font-size: 18px;
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .second-step-box {
          display: flex;
          padding: 20px 0;
          align-items: center;
          .input-box-file {
            width: 120px;
            margin-left: 20px;
            position: relative;
            cursor: pointer;
            .input-button {
              width: 120px;
              height: 30px;
              border: 1px solid #d1d1d1;
              color: #999;
              border-radius: 4px;
              line-height: 30px;
              font-size: 14px;
              text-indent: 10px;
              cursor: pointer;
            }
          }
        }
        .tip {
          display: flex;
          color: red;
          line-height: 30px;
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
      }
    }
  }
</style>
