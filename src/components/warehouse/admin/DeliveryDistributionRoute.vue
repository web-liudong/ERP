<template>
  <div class="brandBox">
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
    <div class="elbuttonBox">
      <span>当前仓库启用的分配模式：</span>
      <el-radio-group v-model="radio">
        <el-radio :label="1" :disabled = 'disabled'>按地图街道信息配置</el-radio>
        <el-radio :label="2" :disabled = 'disabled'>按客户地址人工配置</el-radio>
      </el-radio-group>
      <!--<el-radio v-model="radio" :label="1" :disabled = 'disabled'>按地图街道信息配置</el-radio>-->
      <!--<el-radio v-model="radio" :label="2" :disabled = 'disabled'>按客户地址人工配置</el-radio>-->
      <el-button v-if="isIf" @click="isIf = !isIf ,disabled = false">编辑</el-button>
      <el-button v-else="isIf" @click="dialogVisible = true">保存</el-button>
    </div>
    <div v-if="isif==1">
      <div class="filterBox">
        <div class="homeBoxTop">
          <div class="head-left">
            <i class="iconfont iconsousuo myicon"></i>
            <span>筛选查询</span>
          </div>
          <div class="rightBox">
            <i :class="['iconfont', isShow?'el-icon-arrow-up':'el-icon-arrow-down ', 'myicon']" @click="isShow=!isShow" style="font-size: 14px"></i>
            <span @click="isShow=!isShow" v-if="isShow">收起筛选</span>
            <span @click="isShow=!isShow" v-if="!isShow">展开筛选</span>

            <el-button size="small" class="w80 h40" @click="postMapStreetList()">查询结果</el-button>
            <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
          </div>
        </div>
        <el-collapse-transition>
          <div class="homeBoxBottom" v-show="isShow">
            <div style="">
              <ul>
                <li>
                  <div>
                    <span>线路名称:</span>
                    <el-select v-model="query.deliveryRouteId" filterable
                               placeholder="线路名称"

                               clearable>
                      <el-option
                        v-for="ox in deliveryroutes"
                        :key="ox.id"
                        :label="ox.name"
                        :value="ox.id">
                      </el-option>
                    </el-select>
                  </div>
                  <div>
                    <span>线路状态:</span>
                    <el-select v-model="query.status" placeholder="线路状态" clearable>
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div>
                    <span>选择省/直辖市:</span>
                    <el-select v-model="query.provinceId" filterable placeholder="选择省/直辖市"
                               @change="o1change"
                               clearable>
                      <el-option
                        v-for="o in o1"
                        :key="o.id"
                        :label="o.name"
                        :value="o.id">
                      </el-option>
                    </el-select>
                  </div>
                  <div>
                    <span>选择城市:</span>
                    <el-select v-model="query.cityId" filterable placeholder="选择城市" @change="o2change"
                               prop="cityId"
                               clearable>
                      <el-option
                        v-for="o in o2"
                        :key="o.id"
                        :label="o.name"
                        :value="o.id">
                      </el-option>
                    </el-select>
                  </div>

                </li>
                <li>
                  <div>
                    <span>选择县/区:</span>
                    <el-select v-model="query.districtId" filterable placeholder="选择县/区"  @change="o3change"
                               prop="countyId"
                               clearable>
                      <el-option
                        v-for="o in o3"
                        :key="o.id"
                        :label="o.name"
                        :value="o.id">
                      </el-option>
                    </el-select>
                  </div>

                </li>
              </ul>



            </div>
          </div>
        </el-collapse-transition>
      </div>
      <div class="listBox">
        <div class="listBoxTop">
          <div class="listBoxTop-left">
            <i class="iconfont iconjinridingdanshu myicon"></i>
            <span>数据列表</span>
            <span class="listTxt">(当前列表中地址与实际地图已大量不符，请重新下载地址模板，重新分配线路来更新数据)</span>
          </div>
          <div class="listBoxRight">
            <div class="white-btn fun-btn" @click="dialogData = !dialogData"><i class="iconfont icondaochu"></i>&nbsp;下载最新地址模板</div>
            <div class="white-btn fun-btn" @click="ddeliceryDialong"><i class="iconfont icondaoru"></i>&nbsp;导入分配线路数据</div>
            <!--<el-button @click="dialogReturn = !dialogReturn"><i class="iconfont icon-export"></i>导入</el-button>-->
            <div class="white-btn fun-btn" @click="goRouteRecord()"><i class="iconfont iconjinridingdanshu"></i>&nbsp;导入记录</div>
            <!--<button @click="dialogAdd=!dialogAdd"><i class="iconfont icon-xinzeng"></i>&nbsp;添加</button>-->
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
            label="ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="province"
            label="省/直辖市"
            align="center">
          </el-table-column>
          <el-table-column
            prop="city"
            label="市"
            align="center">
          </el-table-column>
          <el-table-column
            prop="district"
            label="区"
            align="center">
          </el-table-column>
          <el-table-column
            prop="street"
            label="乡/镇/街道"
            align="center">
          </el-table-column>
          <el-table-column
            prop="deliveryRouteName"
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
            label="操作时间"
            align="center">
            <template slot-scope="scope">
              <span  v-if="scope.row.updateTime">{{ scope.row.updateTime| formatDate }}</span>
            </template>
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
            <template slot-scope="scope"  v-if="scope.row.updateTime">
              <!--<button @click="dialogVisibles = true">重新分配线路</button>-->
              <el-button type="text" size="small"
                         @click="dialogVisibles = true,
                         id = scope.row.id,provincess = scope.row.province ,
                         idCity=scope.row.city,idDistrict=scope.row.district,
                         idStreet=scope.row.street">重新分配线路</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration"></span>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10,20,30,40,50,100,500]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            style="height: 38px;"
            :total=tableData.total>
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-if="isif==2 ">
      <ddeliveryChild ref="Delivery_child"></ddeliveryChild>
    </div>
    <ddeliceryDialong ref="ddeliceryDialong" :params="{id:returnData.id}" @func="getMsgFormSon"></ddeliceryDialong>
    <el-dialog
      title="保存提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>切换成功后，以后的订单将按照新的分配模式匹配仓库线路，确定要切换吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeStatus(),isIf = !isIf ">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      width="450px"
      title="选择省份"
      :visible.sync="dialogData"
      append-to-body>
      <div style="display: flex">

        <p style="width: 130px;text-align: right;"><i style="color: #f00;">*</i>选择需要导出地址的省/直辖市 :  </p>

        <el-select v-model="FileExport1.provinceId" filterable style="width: 150px;margin-left: 20px" prop="provinceId"
                   @change="provincechange">
          <el-option
            v-for="o in province"
            :key="o.id"
            :label="o.name"
            :value="o.id">
          </el-option>
        </el-select>
      </div>
      <div style="font-size: 12px;line-height: 20px;margin-top: 20px;">
        <p>提示：</p>
        <p> 1、请根据仓库配送的省份范围导出相关的省/市/县/街道信息进行线路匹配；</p>
        <p>2、匹配完之后，请将匹配结果再次导入系统即可</p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogData = false">取 消</el-button>
        <el-button type="primary" @click="getCodeFileDownload">确定下载</el-button>
      </div>

    </el-dialog>
    <el-dialog
      title="重新分配路线"
      :visible.sync="dialogVisibles"
      width="30%"
    >
      <el-form :model="addDatas" :rules="rules" ref="addDatas"  class="demo-ruleForm">
        <div class="dialigtxt">
          <el-form-item label="地址ID : " label-width="150px" prop="thisid">
            <i style="margin-left: -70px;color: #f00;">*</i>
            <span style="margin-left: 55px"> {{ this.id}}</span>
          </el-form-item>
          <el-form-item label="地址信息 : " label-width="150px" >
            <i style="margin-left: -85px;color: #f00;">*</i>
            <span style="margin-left: 72px">{{this.provincess}}-{{this.idCity}}-{{this.idDistrict}}-{{this.idStreet}}</span>
          </el-form-item>
          <el-form-item label="选择要分配的线路 : "  prop="provinceId" label-width="150px" >
            <el-select v-model="addDatas.provinceId" filterable
            >
              <el-option
                v-for="o in deliveryroute"
                :key="o.id"
                :label="o.name"
                :value="o.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="getPushList('addDatas')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    region_subs,
    region_provinces_based_id,
    provinces_based_id,
    subs,
  } from "@/api/common/commonApi"
  import {
    getNewDeliveryRouteImport,
    getDeliverySwitchingMode,
    postMapStreetList,
    postModelLineDistribution,
    postChangeList,
    putDeliveryRoutesEdits,
    getMapDeliveryRouteStatus,
  } from '@/api/warehouse/newDeliveryRoute'
  import {
    getWarehouseDetaills,
  } from '@/api/warehouse/warehouseAdmin'

  import {
    findInfo
  } from '@/api/businessSupplier'
  import ddeliveryChild from "./child/ddeliveryChild"
  import ddeliceryDialong from "./child/ddeliceryDialong"

  export default {
    inject:['reload','close'],
    name: "DeliveryDistributionRoute",
    data() {
      return {
        id:'',
        provincess:'',
        idCity:'',
        idDistrict:'',
        idStreet:'',
        isif:'1',
        disabled:true,
        isIf: true,
        radio: null,
        addDatas: {
          'provinceId': '',
        },
        innerVisible: false,
        dialogVisibles:false,
        dialogVisible: false,
        dialogData:false,
        loading: false,
        dialogReturn: false,
        fileList: [],
        accountList:[],
        deliveryroute:[],
        deliveryroutes:[],
        FileExport:{
          provinceId:'',
          provincesId:'',
        },
        FileExport1:{
          provinceId:'',
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
          items: [{
            "city": "",
            "deliveryRouteName": "",
            "district": "",
            "id": '',
            "operatorName": '',
            "province": "",
            "status": "",
            "street": "",
            "updateTime": ""

          }],
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

          provinceId:[
            { required: true, message: '请选择要分配的线路', trigger: 'change' },
          ],
        },
        updata: {
          "id": 0,
          "name": "",
          "remarks": ""
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
        province:[],
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
      ddeliveryChild,
      ddeliceryDialong
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
      this.postModelLineDistribution();
      this.getWarehouseDetaills();
      this.gitList();
      this.gitIds();
    },
    activated(){
        if(this.OldId != this.$route.query.Id){
          this.updata.warehouseId = this.$route.query.Id;
          this.addData.warehouseId = this.$route.query.Id;
          this.query.warehouseId = this.$route.query.Id;
          this.postModelLineDistribution();
          this.getWarehouseDetaills();
          this.gitList();
          this.gitIds();
        }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    methods: {
      getMsgFormSon(data){
        this.postMapStreetList()
      },
      gitIds(){
        region_provinces_based_id().then(res => {
          this.province = res.data
          this.o1 = res.data

        });
      },
      gitList(){
        if(this.isif==1){
          postChangeList(
            this.$route.query.Id
          ).then((res)=>{
            console.log(res.data.length,1245)
            if(res.data!=0){
              this.deliveryroutes =  [{name:'不限',id: null},...res.data]
            }else{
              this.deliveryroutes =  res.data
            }

            this.deliveryroute = res.data
          });
        }
      },
      postModelLineDistribution(){
        this.OldId = this.$route.query.Id
        postModelLineDistribution(
          this.$route.query.Id
        ).then(res=>{

          this.radio = res.data.typeId?res.data.typeId:1

          this.isif = res.data.typeId?res.data.typeId:1
          console.log(this.radio,12314124)
          if(res.data.typeId == 1){
            this.postMapStreetList()
          }
        });
      },
      getWarehouseDetaills(){
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
      getPushList(formName){
        console.log(this.addData.provinceId)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.routeId = this.addDatas.provinceId
            getMapDeliveryRouteStatus(
                this.id,
                this.routeId
              ).then((res)=>{
                console.log(res.data)
                if (res.code == '000000') {
                  this.$message({
                    message: '设置成功',
                    type: "success",
                  });
                  this.dialogVisibles = false
                  this.postMapStreetList()
                  this.$refs[formName].resetFields();
                } else {
                  this.$message({
                    message: "重新分配失败",
                    type: "error"
                  });
                }
              })
            this.addData.provinceId = ''
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // debugger
      },
      //重置
      goReset(){
        this.query.deliveryRouteId = '';
        this.query.status = '';
        this.query.provinceId = '';
        this.query.cityId = '';
        this.query.districtId = '';


        this.postMapStreetList()
      },

      changeStatus(){
        getDeliverySwitchingMode(
          this.$route.query.Id,
          this.radio
        )
          .then((res) => {
            console.log(res)

          }).catch(err => {
          console.log(err)
        })
        this.dialogVisible = false
        this.disabled = true
        if(this.radio == 1){
          this.isif = 1
          this.postMapStreetList()
        }
        if(this.radio == 2){
          this.isif = 2
        }

      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },


      ddeliceryDialong(){
        this.$refs["ddeliceryDialong"].init();
      },

      provincechange(){

      },
      //省市区
      o1change(id) {
        if (id <= 0) {
          this.o2 = ''
          this.o3 = ''
          this.query.cityId = ''
          this.query.districtId = ''
          return
        }
        console.log(this.addData.provinceId)

        region_subs(id).then(res => {
          this.o2 = res.data
        })
      },
      o2change(id) {
        if(id<=0){
          this.o3 = ''
          this.query.districtId = ''
        }
        region_subs(id).then(res => {
          this.o3 = res.data
        })
      },
      o3change(data) {

      },

      //点击编辑
      clickEdit(row) {
        putDeliveryRoutesEdits(
          row.id
        ).then((res) => {
          if (res.code == '000000') {
            this.updata = res.data,
              this.dialogReject = !this.dialogReject
          } else {
            this.$message({
              type: 'error',
              message: '获取编辑信息失败'
            });
          }

        }).catch(err => {
          console.log(err)
        })
      },
      //查询
      postMapStreetList() {
        postMapStreetList(
          this.query
        ).then((res) => {
          console.log(res)
          this.tableData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },


      //更新
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            putDeliveryRoute(
              this.updata
            )
              .then((res) => {
                if (res.code == '000000') {
                  this.$message({
                    message: '更新成功',
                    type: "success",
                  });
                  this.dialogReject = false;
                  this.postDeliveryRouteList();
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

      //跳转

      //跳转goRouteRecord
      goRouteRecord() {
        // const {href} = this.$router.resolve({
        //   name: "DeliveryRouteRecord",
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/warehouse/admin/DeliveryRouteRecord'});
      },
      importCallback() {
        //回调处理
      },
      // 批量导入

      getCodeFileDownload() {
        if(!this.FileExport1.provinceId){
          this.$message({
            type: 'error',
            message: '选择需要导出地址的省/直辖市 '
          });
          return
        }

        getNewDeliveryRouteImport(
          this.FileExport1.provinceId
        ).then((res) => {
          console.log(res);
          this.download(res);
          this.dialogData = false
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







      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postMapStreetList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postMapStreetList()
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
    .elbuttonBox{
      .el-button{
        margin-left: 20px;
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

        .el-input {
          width: 200px;
          height: 40px;
          margin-left: 10px;
          margin-bottom: 10px;
        }
        ul{
          padding-top: 10px;
          li{
            display: flex;
            flex-wrap: wrap;
            div{
              width: 25%;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
margin-left: -50px;
              margin: 10px 0;
              .el-input　{
                width: 190px;
              }
              span{
                width: 170px;
                text-align: right;
              }

            }
          }
        }
        .el-select {
          width: 200px;
          height: 40px;
          margin-left: 10px;
          margin-bottom: 10px;
        }
        .username-realname {
          width: 220px;
          height: 40px;
          margin-left: 10px;
          margin-bottom: 10px;
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
          width: 60%;
          .myicon {
            margin-left: 20px;
            font-weight: bold;
            font-size: 20px;
          }
          .listTxt{
            color: #f00;


            font-size: 13px;
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
            i {
              color: red;
            }
          }
          td {
            color: #666666;
            text-align: left;
            padding-left: 10px;
            width: 35%;
          }
        }
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
          margin-left: 65px;
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
  .tips {
    margin-top: 20px;
    display: flex;
    color: red;
    font-size: 12px;
    line-height: 20px;
    margin-left: 40px;
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
    .dialigtxt{
      display: flex;
      .onei{
        color: #f00;
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

<!--DeliveryDistributionRoute-->
