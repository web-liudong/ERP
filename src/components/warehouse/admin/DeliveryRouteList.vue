<template>
  <div class="brandBox"  v-show="$authorities.WarehouseCircuit">
    <div class="buttonBox">
      <table border="1">
        <tr>
          <th>仓库ID：</th>
          <td>{{returnData.id}}</td>
          <th>仓库状态：</th>
          <td>
            <span v-if="returnData.status == '0'">草稿</span>
            <span v-if="returnData.status == '1'">待审核</span>
            <span v-if="returnData.status == '2'">已驳回</span>
            <span v-if="returnData.status == '3'">可用</span>
          </td>
          <th><i>*</i>仓库类型：</th>
          <td>
            <span v-if="returnData.type == '1'">RDC</span>
            <span v-if="returnData.type == '2'">DC</span>
            <span v-if="returnData.type == '3'">FDC</span>
          </td>
        </tr>
        <tr>
          <th><i>*</i>仓库名称：</th>
          <td>{{returnData.name}}</td>
          <th><i>*</i>仓库归属组织机构：</th>
          <td>{{returnData.organizationName}}</td>
          <th><i>*</i>仓库地址：</th>
          <td>{{returnData.addressLine}}</td>
        </tr>
      </table>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo myicon"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="['iconfont', isShow?'el-icon-arrow-up':'el-icon-arrow-down', 'myicon']" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow" v-if="isShow">收起筛选</span>
          <span @click="isShow=!isShow" v-if="!isShow">展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postNewDeliveryRouteList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <ul>
            <li>
              <span>线路名称:</span>
              <el-input
                placeholder="线路名称"
                v-model="query.name"
                clearable>
              </el-input>
            </li>
            <li>
              <span>线路状态:</span>
              <el-select v-model="query.status" placeholder="线路状态">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
          </ul>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <!--<button @click="dialogReturn = !dialogReturn"><i class="iconfont icon-export"></i>导入</button>-->
          <!--<button @click="goRouteRecord()"><i class="iconfont icon-fukuanjilu"></i>&nbsp;导入记录</button>-->
          <div class="white-btn fun-btn" @click="dialogAdd=!dialogAdd"><i class="iconfont el-icon-plus"></i>&nbsp;添加</div>
        </div>
      </div>
      <el-table
        :data="tableData.items"
        :max-height="dataListHeight"
        border
        style="width: 100%"
        size="small">
        <el-table-column
          prop="id"
          label="线路ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="线路名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="线路状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'AVAILABLE'">启用</span>
            <span v-if="scope.row.status == 'FORBIDDEN'">停用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="memo"
          label="备注"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="操作时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operatorName"
          label="操作人"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="clickEdit(id = scope.row.id,updata.name = scope.row.name,updata.memo = scope.row.memo)">编辑</el-button>
              <!--<el-button type="text" size="small" @click="clickStreet(scope.row)">线路管理</el-button>-->
              <!--<el-button type="text" size="small" @click="goDetail(scope.row)">详情</el-button>-->
              <el-button type="text" size="small" v-if="scope.row.status == 'FORBIDDEN'"
                         @click="dialogDelete = !dialogDelete,deleteId=scope.row.id">删除
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.status == 'AVAILABLE'"
                         @click="dialogForbidden = !dialogForbidden,deleteId=scope.row.id">停用
              </el-button>
              <el-button type="text" size="small" v-if="scope.row.status == 'FORBIDDEN'"
                         @click="dialogAvailable = !dialogAvailable,deleteId=scope.row.id">启用
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration"></span>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total=tableData.total>
        </el-pagination>
      </div>
    </div>
    <importFile
      ref="importFile"
      :title="'线路管理批量导入'"
      :type="'DeliveryRoute-import'"
      :params="{id:returnData.id}"
      @callback="importCallback">
    </importFile>
    <el-dialog :visible.sync="dialogTableVisible" width="830px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">线路地址管理</span>
      </div>
      <div class="message-box" style="height: 560px;">
        <table border="1">
          <tr>
            <th>线路名称：</th>
            <td>{{streeInfo.name}}</td>
            <th>备注：</th>
            <td>{{streeInfo.remarks}}</td>
          </tr>
        </table>
        <span class="reject-title" style="    height: 50px;
            width: 780px;
            text-align: left;
            padding-left: 20px;
            background-color: rgb(243, 243, 243);
            display: flex;
            line-height: 50px;
            margin-left: -40px;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
            color: #666;"
        >选择街道</span>
        <div style="  margin-bottom: 10px;">
          <el-select v-model="queryStreetData.provinceId" filterable placeholder="省" style="width: 85px;"
                     @change="o1change">
            <el-option
              v-for="o in o1"
              :key="o.id"
              :label="o.name"
              :value="o.id">
            </el-option>
          </el-select>
          <el-select v-model="queryStreetData.cityId" filterable placeholder="市" style="width: 85px;" @change="o2change"
                     prop="cityId">
            <el-option
              v-for="o in o2"
              :key="o.id"
              :label="o.name"
              :value="o.id">
            </el-option>
          </el-select>
          <el-select v-model="queryStreetData.districtId" filterable placeholder="县/区" style="width: 85px;"
                     @change="o3change"
                     prop="countyId">
            <el-option
              v-for="o in o3"
              :key="o.id"
              :label="o.name"
              :value="o.id">
            </el-option>
          </el-select>
          <el-input
            style="width: 85px;"
            placeholder="街道"
            v-model="queryStreetData.streetName"
            clearable>
          </el-input>
        </div>
        <div class="listLeftBox left">
          <div class="headerBox">
            <span style="margin-left: 20px;">街道列表</span>
            <el-button size="small" style="float: right;margin-right: 20px" @click="queryStreet">查询结果</el-button>
          </div>

          <div class="lltree">
            <el-tree
              ref="tree"
              :data="returnStreetData"
              show-checkbox
              node-key="id"
              render-after-expand
              :default-checked-keys="checkedids"
              default-expand-all
              @check="getnode()"
              :props="defaultProps">
            </el-tree>
          </div>

        </div>
        <div class="listRightBox left">
          <div class="headerBox">
            <span style="margin-left: 20px;">已关联街道预览</span>
          </div>
          <div class="lltree" style="position: relative;">
            <el-tree
              :data="relevanceTree"
              ref="tree2"
              node-key="id"
              default-expand-all
              render-after-expand
              :props="checkDefaultProps">
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <i class="el-dialog__close el-icon el-icon-close" @click="remove(node, data)"></i>
                  </span>
                </span>
            </el-tree>
          </div>

        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="putDeliveryRouteStreet()">添加</el-button>
        <el-button @click=" dialogTableVisible = !dialogTableVisible;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDelete" width="500px" custom-class="dialog-box" center>
      <div slot="title" class="dialog-title">
        <span class="reject-title">删除提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          线路信息删除后其与街道的关联关系将一并删除，是否确认？
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteDeliveryRoute()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogForbidden" width="500px" custom-class="dialog-box" center>
      <div slot="title" class="dialog-title">
        <span class="reject-title">停用提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">
          确认停用该条线路信息？
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForbidden = false">取 消</el-button>
        <el-button type="primary" @click="putDeliveryRouteForbidden()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAvailable" width="500px" custom-class="dialog-box" center>
      <div slot="title" class="dialog-title">
        <span class="reject-title">启用提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">确认启用该条线路信息？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAvailable = false">取 消</el-button>
        <el-button type="primary" @click="putDeliveryRouteAvailable()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReject" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">编辑线路信息</span>
      </div>
      <div class="message-box">
        <el-form :model="updata" :rules="rules" ref="ruleForm">
          <el-form-item label="线路名称：" prop="name">
            <el-input v-model="updata.name"  ></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="updata.memo" placeholder="请输入200字以内"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReject = false,btncanael('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAdd" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">添加线路信息</span>
      </div>
      <div class="message-box">
        <el-form :model="addData" :rules="rules" ref="ruleForm">
          <el-form-item label="线路名称：" prop="name" >
            <el-input v-model="addData.name" ></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="addData.memo" placeholder="请输入200字以内"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false,btncanael('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitFormAdd('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReturn" width="500px" custom-class="dialog-box" title="信息批量导入">
      <div class="message-box">
        <div class="first-step-box">
          <i>第一步:&nbsp;&nbsp;&nbsp;&nbsp;</i>
          <i class="first-step" @click="innerVisible = true">下载街道批量导入模板</i>
        </div>
        <div class="second-step-box">
          <div class="second-step-text">第二步:</div>
          <el-upload
            ref="upload"
            :action="'test'"
            class="upload-demo"
            :headers="headertoken"
            :on-change="handleChange"
            :on-error="handleError"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            name="file"
            :on-remove="handleRemove"
            multiple
            :limit="1"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <div slot="tip" class="el-upload__tip">请选择要导入的文件</div>
            <el-button size="small" type="primary" slot="trigger" :loading="loading">文件上传</el-button>
          </el-upload>
        </div>
        <div class="tip">
          <p>小提示：</p>
          <p>导入文件大小不能超过6M；
            <br>导入文件信息最多允许有2W条分类数据。
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReturn = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
      <el-dialog
        width="400px"
        title="选择省份"
        :visible.sync="innerVisible"
        append-to-body>
        <div style="display: flex">
          <i style="color: #f00;">*</i>
          <p style="width: 130px;text-align: right;">选择需要导出地址的省/直辖市 :  </p>
          <el-select v-model="FileExport.provinceId" filterable style="width: 150px;margin-left: 20px"
                     @change="o1change">
            <el-option
              v-for="o in o1"
              :key="o.id"
              :label="o.name"
              :value="o.id">
            </el-option>
          </el-select>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="getCodeFileDownload">确定下载</el-button>
        </div>

      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
  import {
    region_subs,
    postRegionStreetList,
    region_provinces_based_id,
    postStartwithProvince,
    provinces_based_id,
    subs,
    postSupplierOptions,
    postOrganizationOptions,
    postBrandOptions,
    deleteFileDelete,
  } from "@/api/common/commonApi"

  import {
    postNewDeliveryRoute,
    postNewDeliveryRouteList,
    putNewDeliveryRouteForbidden,
    putNewDeliveryRouteAvailable ,
    putDeliveryRoutesEdits,
    deleteNewDeliveryRoute
  } from '@/api/warehouse/newDeliveryRoute'
  import {
    getWarehouseDetaills,
  } from '@/api/warehouse/warehouseAdmin'

  import importFile from "@/components/common/module/ImportFile";
  import {
    findInfo
  } from '@/api/businessSupplier'
  import { formatString } from "@/utils";
  import request from "@/utils/request";

  export default {
    name: "DeliveryRouteList",
    data() {
      return {
        id:'',
        name:'',
        innerVisible: false,
        dialogReturn: false,
        loading: false,
        fileList: [],
        accountList:[],
        headertoken: { Authorization: "Bearer " + this.$auth.token },
        // download: `/api/warehouse-service/delivery-route/import-template?id={id}&access_token={token}`,
        upload: `/api/warehouse-service/delivery-route/{id}/import`,
        FileExport:{
          provinceId:null,
        },



        checkedids: [],//选择的id
        returnStreetData: [],//返回的树
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        checkDefaultProps: {
          children: 'children',
          label: 'fullName'
        },
        relevanceTree: [],
        data2: [{
          lesttext: '北京',
          label: '北京',
          id: 1,
          children: [{
            lesttext: '北京-北京市',
            label: '北京市',
            id: 11,
            children: [{
              lesttext: '北京-北京市-朝阳区',
              label: '朝阳区',
              id: 111,
              children: [{
                lesttext: '北京-北京市-朝阳区-劲松街道',
                label: '劲松街道',
                id: 1111,
              }, {
                lesttext: '北京-北京市-朝阳区-双井街道',
                label: '双井街道',
                id: 1112,
              }]

            },]
          }]
        }],
        data3: [{
          lesttext: '天津',
          label: '天津',
          id: 2,
          children: [{
            lesttext: '天津-天津市',
            label: '天津市',
            id: 22,
            children: [{
              lesttext: '天津-天津市-静海区',
              label: '静海区',
              id: 222,
              children: [{
                lesttext: '天津-天津市-静海区-街道',
                label: '街道',
                id: 2222,
              }, {
                lesttext: '天津-天津市-静海区-123街道',
                label: '123街道',
                id: 2223
              }]

            },]
          }]
        }],
        typeOptions: [{
          value: -1,
          label: '不限'
        }, {
          value: 'AVAILABLE',
          label: '启用'
        }, {
          value: 'FORBIDDEN' ,
          label: '停用'
        }],
        returnData: {},
        query: {
          id: 0,
          name: "",
          pageNum: 0,
          pageSize: 10,
          status: null,
          warehouseId: this.$route.query.Id
        },
        tableData: {
          items: [],
          offset: 0,
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        dialogForbidden: false,
        dialogAvailable: false,
        dialogDelete: false,
        dialogReject: false,
        dialogAdd: false,
        deleteId: null,
        dialogTableVisible: false,

        rules: {
          name: [
            {required: true, message: '请输入线路名称', trigger: 'blur'}
          ],
        },
        updata: {
          "id": "",
          "name": "",
          "remarks": "",
          "memo": "",
          "warehouseId": this.$route.query.Id
        },
        addData: {
          "name": "",
          "remarks": "",
          "warehouseId": this.$route.query.Id
        },
        createData: {
          code: null,
          description: null,
          isAvailable: true,
          isMergedToParentLevel: true,
          name: null,
          taxRate: null,
        },
        queryStreetData: {
          provinceId: null, //省
          cityId: null,//城市
          districtId: null,//县
          streetName: '',
        },
        //省市县
        o1: [],
        o2: [],
        o3: [],
        //线路信息row
        streeInfo: {},
        isShow: true,

        query1: [
          {
            accountNoPaid: '',
            accountPaid: '',
            bankSerialNumber: "",
            id: '',
          }
        ],
        OldId:'',
      }
    },
    components: {
      importFile
    },
    watch: {
      //监听时间范围
      dateValue(a, b) {
        if (this.dateValue != "" && this.dateValue) {
          this.query.startDate = this.dateValue[0];
          this.query.endDate = this.dateValue[1]
        }
      },
    },
    created() {
      this.postNewDeliveryRouteList();
      this.getWarehouseDetaills()
      region_provinces_based_id().then(res => {
        this.o1 = res.data
      });

    },
    activated(){
      if( this.OldId != this.$route.query.Id){
        this.updata.warehouseId = this.$route.query.Id;
        this.addData.warehouseId = this.$route.query.Id;
        this.query.warehouseId = this.$route.query.Id;
        this.postNewDeliveryRouteList();
        this.getWarehouseDetaills()
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    methods: {
      getWarehouseDetaills(){
        this.OldId = this.$route.query.Id
        getWarehouseDetaills(
          this.$route.query.Id
        )
          .then((res) => {
            console.log(res)
            this.returnData = res.data;
          }).catch(err => {
          console.log(err)
        })
      },
      //重置
      goReset(){
        this.query.name = '';
        this.query.status = '';
        this.postNewDeliveryRouteList();
      },
      //更新街道

      putDeliveryRouteStreet() {
        if (this.checkedids.length > 0) {
          putDeliveryRouteStreet(
            {
              deliveryRouteId: this.streeInfo.id,
              streetId: this.checkedids
            }
          ).then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '设置成功',
                type: "success",
              });
              this.dialogTableVisible = !this.dialogTableVisible;
            } else {
              this.$message({
                type: 'error',
                message: '设置失败'
              });
            }

          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message({
            type: 'error',
            message: '街道列表不可为空'
          });
        }

      },
      //点击查询街道
      queryStreet() {
        postStartwithProvince(
          this.queryStreetData
        ).then((res) => {
          console.log(res)
          if (res.code == '000000') {
            this.returnStreetData = JSON.parse(JSON.stringify(res.data));
            this.setDisabled()
          } else {
            this.$message({
              type: 'error',
              message: '获取信息失败'
            });
          }

        }).catch(err => {
          console.log(err)
        })
      },
      //点击删除街道
      remove(node, data) {
        this.relevanceTree = this.relevanceTree.filter(item => {
          return item.id != data.id
        })
        this.checkedids = [];
        for (let i = 0; i < this.relevanceTree.length; i++) {
          this.checkedids.push(this.relevanceTree[i].id)
          getAll(this.returnStreetData, data.id)
        }

        function getAll(arr, id) {
          arr.filter(item => {
            if (item.id == id) {
              console.log(item + '有')
              item.disabled = false;
            } else {
              console.log(item + '没有')
              if (item.children) {
                getAll(item.children, data.id)
              }

            }
          })
        }

        this.returnStreetData = JSON.parse(JSON.stringify(this.returnStreetData))

      },
      //树点击复选
      getnode(data) {
        let idArr = this.$refs.tree.getCheckedKeys()
        let idArrLeaf = this.$refs.tree.getCheckedKeys(true)
        let CheckedNodes = this.$refs.tree.getCheckedNodes(true);
        console.log(CheckedNodes);
        //获得选中的node，puth到右侧列表
        let CheckedData = [];
        for (let j = 0; j < CheckedNodes.length; j++) {
          this.relevanceTree.push(CheckedNodes[j]);
        }
        //push数组中 然后去重
        let result = [];
        let obj = {};
        for (let i = 0; i < this.relevanceTree.length; i++) {
          if (!obj[this.relevanceTree[i].id]) {
            result.push(this.relevanceTree[i]);
            obj[this.relevanceTree[i].id] = true;
          }
        }
        this.relevanceTree = result;
        this.relevanceTree = JSON.parse(JSON.stringify(this.relevanceTree))
        this.setDisabled();
        console.log(this.checkedids + '选择的id');
      },
      //根据右侧选择的设置是否能选中
      setDisabled() {
        this.checkedids = [];
        for (let i = 0; i < this.relevanceTree.length; i++) {
          this.checkedids.push(this.relevanceTree[i].id)
          console.log(this.returnStreetData);
          console.log(this.relevanceTree[i].id);
          getAll(this.returnStreetData, this.relevanceTree[i].id)
        }

        function getAll(arr, id) {
          arr.filter(item => {
//            console.log(item.id)
//            console.log(id)
            if (item.id == id) {
              //console.log(item+'有')
              item.disabled = true;
            } else {
              //console.log(item+'没有')
              if (item.children) {
                getAll(item.children, id)
              }

            }
          })
        }

        this.returnStreetData = JSON.parse(JSON.stringify(this.returnStreetData))
      },
      //点击线路管理
      clickStreet(row) {
        this.relevanceTree=[];
        this.streeInfo = row;
        this.dialogTableVisible = true;
        getDeliveryRouteStreet(
          row.id
        ).then((res) => {
          if (res.code == '000000') {
            if (res.data.length) {
              let arr = [];
              let carr = [];
              for (let i = 0; i < res.data.length; i++) {
                arr.push({
                  fullName: res.data[i].address,
                  id: res.data[i].streetId,
                  name: res.data[i].streetName,
                })
                carr.push(res.data[i].streetId)
              }
              this.checkedids = carr;
              this.relevanceTree = arr;
            }
          } else {
            this.$message({
              type: 'error',
              message: '获取街道信息失败'
            });
          }

        }).catch(err => {
          console.log(err)
        })
        setTimeout(() => {
          this.getnode()
        }, 30)
      },
      //根据id查询查询街道信息
      postRegionStreetList(data) {
        postRegionStreetList(
          data
        ).then((res) => {
          if (res.code == '000000') {
            this.relevanceTree = JSON.parse(JSON.stringify(res.data))
          } else {
            this.$message({
              type: 'error',
              message: '查询街道信息失败'
            });
          }

        }).catch(err => {
          console.log(err)
        })
      },
      //省市区
      o1change(data) {
        console.log(this.addData.provinceId)
        this.queryStreetData.cityId = ''
        this.queryStreetData.districtId = ''
        region_subs(data).then(res => {
          this.o2 = res.data
        })
      },
      o2change(data) {
        this.queryStreetData.districtId = ''
        region_subs(data).then(res => {
          this.o3 = res.data
        })
      },
      o3change(data) {

      },
      //点击编辑
      clickEdit() {
        this.updata.memo == ''?this.updata.memo = '':this.updata.memo
        this.dialogReject = !this.dialogReject

        // putDeliveryRoutesEdits(
        //   this.id,
        //   this.updata
        // ).then((res) => {
        //   if (res.code == '000000') {
        //
        //
        //   } else {
        //     this.$message({
        //       type: 'error',
        //       message: '获取编辑信息失败'
        //     });
        //   }
        //
        // }).catch(err => {
        //   console.log(err)
        // })
      },
      //查询
      postNewDeliveryRouteList() {
        postNewDeliveryRouteList(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //删除
      deleteDeliveryRoute() {
        deleteNewDeliveryRoute(
          this.deleteId
        ).then((res) => {
          console.log(res)
          if (res.code == '000000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.dialogDelete = !this.dialogDelete
            this.postNewDeliveryRouteList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          }

        }).catch(err => {
          console.log(err)
        })
      },
      //停用deleteDeliveryRoute
      putDeliveryRouteForbidden(row) {
        putNewDeliveryRouteForbidden(
          this.deleteId
        ).then((res) => {
          console.log(res)
          if (res.code == '000000') {
            this.$message({
              type: 'success',
              message: '停用成功'
            });
            this.dialogForbidden = !this.dialogForbidden
            this.postNewDeliveryRouteList();
          } else {
            this.$message({
              type: 'error',
              message: '停用失败'
            });
          }

        }).catch(err => {
          console.log(err)
        })
      },
      //启用
      putDeliveryRouteAvailable(row) {
        putNewDeliveryRouteAvailable(
          this.deleteId
        ).then((res) => {
          console.log(res)
          if (res.code == '000000') {
            this.$message({
              type: 'success',
              message: '启用成功'
            });
            this.dialogAvailable = !this.dialogAvailable
            this.postNewDeliveryRouteList();
          } else {
            this.$message({
              type: 'error',
              message: '启用失败'
            });
          }

        }).catch(err => {
          console.log(err)
        })
      },
      btncanael(formName){
        this.$refs[formName].resetFields();
      },
      //新增
      submitFormAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postNewDeliveryRoute(
              this.addData
            )
              .then((res) => {
                if (res.code == '000000') {
                  this.$message({
                    message: '添加成功',
                    type: "success",
                  });
                  this.dialogAdd = false;
                  this.$refs[formName].resetFields();

                  this.postNewDeliveryRouteList();
                  this.backfand()
                } else if (res.data == '0') {
                  this.$message({
                    message: '添加失败',
                    type: 'warning',
                  })
                }
              }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //更新
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            putDeliveryRoutesEdits(
              this.id,
              this.updata
            )
              .then((res) => {
                if (res.code == '000000') {
                  this.$message({
                    message: '更新成功',
                    type: "success",
                  });
                  this.dialogReject = false;
                  this.$refs[formName].resetFields();
                  this.postNewDeliveryRouteList();
                } else if (res.data == '0') {
                  this.$message({
                    message: '更新失败',
                    type: 'warning',
                  })
                }
              }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      backfand(){

        this.addData.memo = '';
        this.addData.memo = ''
      },
      importfile() {
        console.log('123');
        this.$refs["importFile"].init();
      },
      //跳转
      goRouteRecord() {
        const {href} = this.$router.resolve({
          name: "DeliveryRouteRecord",
        });
        window.open(href, '_blank')
      },
      //跳转goRouteRecord
      goDetail(row) {
        const {href} = this.$router.resolve({
          name: "DeliveryRouteDetails",
          query: {
            id: row.id,
          },
        });
        window.open(href, '_blank')
      },
      importCallback() {
        //回调处理
      },
      // 批量导入
      init() {
        this.fileList = [];
        this.dialogReturn = true;
      },
      handleChange(file, fileList) {
        this.fileList = fileList;
        console.log(fileList);
        // this.accountList=fileList[0].response.data;
      },
      handleRemove(file, fileList) {
        //删除文件
        this.fileList = fileList;
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 1 个文件，本次选择了 ${
            files.length
            } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      getCodeFileDownload() {
        if(!this.FileExport.provinceId){
          this.$message({
            type: 'error',
            message: '选择需要导出地址的省/直辖市 '
          });
          return
        }
        // this.FileExport = this.FileExport.provinceId

        postdownlogware(
          this.FileExport
        ).then((res) => {
          console.log(res);
          this.download(res);
          this.innerVisible = false
        }).catch(err => {
          console.log(err);
        });
      },
      download(data){
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data],{type:"application/vnd.ms-excel"}))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download','仓库配送线路导入模板.xls')
        document.body.appendChild(link)
        link.click()
        console.log(link)
      },
      handleError(res, file) {
        this.loading = false;
        let msg = (res.response && res.response.data && res.response.data.message) || '文件上传失败';
        this.$message.error(msg);
      },
      handleSuccess(res, file) {
        this.loading = false;
        if (res.code == "000000") {
          this.$message({
            message: "文件上传成功",
            type: "success"
          });
          console.log(res.data,7766555)
          // this.accountList=res.data;
          this.$emit('dialogCallBackPayment',res.data)
          this.dialogReturn = false;
          this.fileList = [];
          this.$emit("callback", "tag");
        } else {
          this.$message.error(res.message || "文件上传失败");
        }
      },
      beforeUpload(file) {
        this.loading = true;
        const extension = file.name.split(".")[1] === "xls";
        const extension1 = file.name.split(".")[1] === "zip";
        const extension2 = file.name.split(".")[1] === "xlsx";
        const isJPG = file.name.split(".")[1] === "jpg";
        const isPNG = file.name.split(".")[1] === "png";
        const isPDF = file.name.split(".")[1] === "pdf";
        const isLt2M = file.size / 1024 / 1024 < 6;
        if (!isLt2M) {
          this.$message({
            message: "上传图片大小不得超过6M",
            type: "error"
          });
          this.loading = false;
          return false;
        }
        if (!(extension||extension1 || extension2)) {
          this.$message({
            message: "上传文件只能是 xls xlsx zip 格式!",
            type: "error"
          });
          this.loading = false;
          return false;
        }
        return (extension ||extension1|| extension2) && isLt2M;
      },
      uploadFile(options) {
        console.log(this.returnData.id ,2134123123)
        let fd = new FormData(),
          url = formatString(this.upload, {id:this.returnData.id});
        fd.append("fileName", options.file, options.file.name);
        let res = request({
          url: url,
          method: "post",
          data: fd
        });
        return res;
      },
      submitUpload() {
        if (this.fileList.length === 1) {
          this.$confirm('系统将为您批量导入, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.$refs.upload.submit();
            console.log(this.accountList,88888)
          })
        } else {
          this.$message({
            message: "请选择文件之后再上传",
            type: "error"
          });
        }
      },
      close(){
        this.dialogReturn = false;
        this.fileList = [];
      },


      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postNewDeliveryRouteList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postNewDeliveryRouteList();
      },
    },
    filters: {
      //时间截取字符串
      formatDate: function (val) {
        var dateee = new Date(val).toJSON();
        var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        return date
      }
    }
  }
</script>

<style scoped lang="less">
  .brandBox {
    width: 100%;
    .buttonBox {
      table {
        width: 100%;
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
          i {
            color: red;
          }
        }
        td {
          color: #666666;
          text-align: left;
          padding-left: 10px;
          width: 20%;
        }
      }
      margin-top: 10px;
      .el-button {
        width: 160px;
        height: 30px;
      }
      .active {
        background: #339999;
        color: #fff;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      margin: 10px 0;
      clear: both;
      .homeBoxTop {
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        box-sizing: border-box;
        .head-left {
          display: flex;
          align-items: center;
        }
        .myicon {
          font-weight: bold;
          color: #666;
          font-size: 20px;
          line-height: 50px;
          margin-right: 5px;
        }
      }
      span {
        font-size: 14px;
        color: #303133;
      }
      .rightBox {
        float: right;
        cursor: pointer;
        .myicon {
          color: #999;
          font-size: 10px;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #e4e4e4;

        background: #fff;

        ul {
          padding: 10px 0;
          display: flex;
          flex-wrap: wrap;
          li {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: -50px;

            .el-input　{
              width: 190px;
            }
            span {
              width: 180px;
              text-align: right;

            }
          }
        }
        .el-input {
          width: 200px;
          height: 40px;
          margin-left: 10px;
        }
        .el-select {
          width: 200px;
          height: 40px;
          margin-left: 10px;
        }
        .username-realname {
          width: 220px;
          height: 40px;
          margin-left: 10px;
          /*margin-bottom: 10px;*/
        }
        .time-box {
          width: 550px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 40px;
          span {
            margin-top: -15px;
          }
          .el-date-editor {
            width: 200px;
            height: 40px;
            margin-left: 0;
          }
          .text {
            line-height: 40px;
            margin-top: -10px;
          }
        }

      }
    }
    .listBox {

      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left {
          .myicon {
            margin-left: 20px;
            font-weight: bold;
            font-size: 20px;
          }
          span {
            margin-left: 5px;
            font-size: 14px;
            color: #303133;
            line-height: 50px;
          }
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        height: 50px;
        .white-btn {
          margin-top: 10px;
          margin-right: 10px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin: 3px 10px;
      display: flex;
      justify-content: flex-end;
      height: 30px;
    }
    .my-scroll-bar {
      height: 200px;
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
        .el-input {
          width: 80%;
        }
        .listLeftBox {
          position: relative;
          background-color: #FFFFFF;
          border: 1px solid #e5e5e5;
          margin-right: 40px;
          width: 350px;
          height: 350px;
          .headerBox {
            background-color: #F5F5F5;
            position: absolute;
            width: 100%;
            z-index: 5;
            height: 35px;
            border-bottom: 1px solid #e4e4e4;
            span {
              color: red;
              height: 36px;
              line-height: 36px;
            }
          }
          .lltree {
            box-sizing: border-box;
            padding-top: 35px;
            width: 100%;
            height: 100%;
            overflow: auto;
          }
        }
        .listRightBox {
          position: relative;
          background-color: #FFFFFF;
          border: 1px solid #e5e5e5;
          width: 350px;
          height: 350px;
          .headerBox {
            background: #F5F5F5;
            position: absolute;
            width: 100%;
            z-index: 5;
            height: 35px;
            border-bottom: 1px solid #e4e4e4;
            span {
              color: red;
              height: 36px;
              line-height: 36px;
            }
          }
          .lltree {
            box-sizing: border-box;
            padding-top: 35px;
            width: 100%;
            height: 100%;
            overflow: auto;
          }

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
        text-align: right
      }
    }
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
        position: relative;
        .second-step-text {
          position: absolute;
          top: 26px;
        }
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
        .upload-demo {
          margin-left: 65px;
          .el-upload__tip {
            float: right;
            margin-left: 10px;
            font-size: 14px;
          }
        }
      }
      .tip {
        display: flex;
        color: red;
        line-height: 30px;
        font-size: 12px;
        margin-bottom: 30px;
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
      border-top: 1px solid #eee;
      padding: 10px;
      box-sizing: border-box;
    }
  }
</style>
