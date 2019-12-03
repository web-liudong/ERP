<template>
  <div class="brandBox">
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
          <el-button size="small" class="w80 h40" @click="postManualConfigurationList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div style="">
            <ul >
              <li style="display: flex">
                <div>
                  <span>线路名称:</span>
                  <el-select v-model="query.deliveryRouteId"
                             placeholder="线路名称" clearable>
                    <el-option
                      v-for="o in deliveryroutes"
                      :key="o.id"
                      :label="o.name"
                      :value="o.id">
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
                  <span>项目名称:</span>

                  <el-select v-model="query.projectId"
                             filterable
                             remote
                             clearable
                             reserve-keyword
                             :remote-method="customerRemotes"
                             :loading="loading"
                             placeholder="项目名称">
                    <el-option
                      v-for="item in customernamess"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <span>客户名称:</span>
                  <el-select
                    v-model="query.customerId"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="客户名称"
                    :remote-method="customerRemote"
                    :loading="loading">
                    <el-option
                      v-for="item in customernames"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>

              </li>
              <li>
                <div>
                  <span>选择省/直辖市:</span>
                  <el-select v-model="query.provinceId" filterable placeholder="选择省/直辖市"
                             @change="o1change" clearable>
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
                             prop="cityId" clearable>
                    <el-option
                      v-for="o in o2"
                      :key="o.id"
                      :label="o.name"
                      :value="o.id">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <span>选择县/区:</span>
                  <el-select v-model="query.districtId" filterable placeholder="选择县/区"
                             @change="o3change"
                             prop="countyId" clearable>
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
        </div>
        <div class="listBoxRight">
          <div @click="warehouseimportfile" class="white-btn fun-btn"><i class="iconfont icondaoru"></i>导入</div>
          <!--<button @click="goRouteRecord()"><i class="iconfont icon-fukuanjilu"></i>&nbsp;导入记录</button>-->
          <div class="white-btn fun-btn" @click="getLest()"><i class="iconfont icondaoru"></i>&nbsp;批量分配路线</div>
        </div>
      </div>
      <el-table
        :data="tableData.items"
        :max-height="dataListHeight"
        border
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="数据ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目"
          align="center">
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="adderss"
          label="地址"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="deliveryRouteName"
          label="线路名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="线路状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'">启用</span>
            <span v-if="scope.row.status == '2'">停用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="操作时间"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime |formatDate}}</span>
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
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="dialogVisible = true,
              id = scope.row.id,projectName = scope.row.projectName,
              customerName = scope.row.customerName,
              adderss = scope.row.adderss">分配线路</el-button>
              <el-button type="text" size="small"
                         @click="dialogDelete = !dialogDelete,deleteId=scope.row.id">删除
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
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total=tableData.total>
        </el-pagination>
      </div>
    </div>


    <el-dialog
      title="分配线路配置"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="addSome" :rules="rules" ref="addSome"  class="demo-ruleForm">
        <div class="dialigtxt">
          <el-form-item label="项目 : " label-width="150px" prop="thisid">
            <i style="margin-left: -70px;color: #f00;">*</i>
            <span style="margin-left: 55px">{{this.projectName}}</span>
          </el-form-item>
          <el-form-item label="客户 : " label-width="150px" prop="thisid">
            <i style="margin-left: -70px;color: #f00;">*</i>
            <span style="margin-left: 55px">{{this.customerName}}</span>
          </el-form-item>
          <el-form-item label="地址 : " label-width="150px" >
            <i style="margin-left: -85px;color: #f00;">*</i>
            <span style="margin-left: 72px">{{this.adderss}}</span>
          </el-form-item>
          <el-form-item label="选择要分配的线路 : "  prop="routeId" label-width="150px" >
            <el-select v-model="addSome.routeId" filterable
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postAddedAddasdasress('addSome')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="批量分配路线"
      :visible.sync="dialogVisibles"
      width="30%"
    >
      <el-form :model="addData" :rules="arules" ref="addData"  class="demo-ruleForm">
        <div class="dialigtxt">
          <el-form-item label="选择要分配的线路 : "  prop="routeId" label-width="150px" >
            <el-select v-model="addData.routeId" filterable
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
      <p style="margin-left: 70px;margin-top: 30px;">确定要给当前批量选择的地址分配上述线路？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="postAddedAddasdasresss('addData')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="dialogDelete"
      width="30%"
    >
      <span>删除后，线路与地址之间的匹配关系也将不存在，是否确认要删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="dialogDelete = false,goDelete()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="500px"
      title="导入类型选择"
      :visible.sync="dialogReturn"
      append-to-body>
      <div class="message-box">
        <!--<div class="first-step-box">-->
        <!--<i>第一步:&nbsp;&nbsp;&nbsp;&nbsp;</i>-->
        <!--<i class="first-step" @click="innerVisible = true">下载街道批量导入模板</i>-->
        <!--</div>-->
        <div class="second-step-box">
          <!--<div class="second-step-text">请选择要导入的文件:</div>-->
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


    </el-dialog>


  </div>

</template>

<script>

  import { provinces_based_id, subs } from "@/api/basicSupplier";
  import {
    postManualConfigurationList,
    getDeliverySwitchingMode,
    postChangeList,
    postAddedAddasdasress,
    getDeleteList,
    getProjectList,
  } from '@/api/warehouse/newDeliveryRoute'


  import {
    getWarehouseDetaills,
  } from '@/api/warehouse/warehouseAdmin'
  import {customerName,associatedCustomers} from '@/api/customerManage'
  import importFile from "@/components/common/module/ImportFile";
  import {
    findInfo
  } from '@/api/businessSupplier'


  import ddeliveryChild from "./ddeliveryChild"
  import { formatString } from "@/utils";
  import request from "@/utils/request";

  export default{
    inject:['reload'],

    data() {
      return {
        customernamess:'',
        OldId:this.$route.query.Id,
        deleteId:'',
        adderss: "",
        customerName: "",
        projectName: "",
        id:'',
        dizhi:'12',
        customernames:'',
        isShow: true,
        dialogVisibles: false,
        dialogVisible:false,
        dialogDelete:false,
        isif:'0',
        disabled:true,
        isIf: true,

        radio: '0',
        innerVisible: false,
        dialogReturn: false,
        loading: false,
        addSome:{
          'routeId':''
        },
        addData:{
          'routeId':''
        },
        rules: {
          routeId:[
            { required: true, message: '请选择要分配的线路', trigger: 'change' },
          ],

        },
        arules: {
          routeId:[
            { required: true, message: '请选择要分配的线路', trigger: 'change' },
          ],
        },
        FileExport:{
          provinceId:null,
        },
        ruleForm:{
          expressCompany:''
        },
        typeOption:[],
        deliveryroute:[],
        deliveryroutes:[],
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
          ids:[],
          id: 0,
          name: "",
          pageNum: 0,
          pageSize: 0,
          status: null,
          deliveryRouteId:'',
          routeId:'',
          customerId:'',
          projectId:'',
          cityId:'',
          warehouseId: this.$route.query.Id
        },
        tableData: {
          items: [
            {}
          ],
          offset: 0,
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        queryStreetData: {
          provinceId: null, //省
          cityId: null,//城市
          districtId: null,//县
          streetName: '',
        },
        fileList: [],
        accountList:[],
        headertoken: { Authorization: "Bearer " + this.$auth.token },
        //省市县
        o1: [],
        o2: [],
        o3: [],
        multipleSelection:[],
        name:'',
      }
    },
    components: {
      importFile,
      ddeliveryChild
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
      // console.log(this.id,12344);
      console.log(this.query.warehouseId,556788)
      this.postManualConfigurationList()
      provinces_based_id().then(res => {
        this.o1 = res.data
      });

      postChangeList(
        this.$route.query.Id
      ).then((res)=>{
        this.deliveryroutes =  [{name:'不限',id:null} ,...res.data]
        this.deliveryroute = res.data
      });

    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    activated(){

      if(this.OldId != this.$route.query.Id){
        this.query.warehouseId = this.$route.query.Id;
        this.postManualConfigurationList();
        // console.log(this.query.warehouseId,100056788)
      }
    },
    methods: {
      warehouseimportfile(){
        this.fileList = [];
        this.dialogReturn = true;
        this.upload = `/api/warehouse-service/delivery-route/`+this.query.warehouseId+`/updateImportCustomer`
      },
      goDelete(){
        getDeleteList(
          this.deleteId
        ).then((res)=>{
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.dialogDelete = false
            this.postManualConfigurationList()
          } else {
            this.$message({
              message: "删除失败",
              type: "warning"
            });
          }
        }).catch(() => {

        });
      },
      goReset(){
        this.query.deliveryRouteId = '';
        this.query.status = '';
        this.query.provinceId = '';
        this.query.cityId = '';
        this.query.customerId = '';
        this.query.projectId = '';
        this.query.cityId = '';
        this.query.districtId = '';
        this.postManualConfigurationList()
      },

      getLest(){
        if(this.multipleSelection.length == 0){
          this.$confirm('请选择批量批量分配路线的数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
          return
        }
        this.dialogVisibles = true
      },
      postAddedAddasdasress(formName){

        console.log(this.addSome.routeId,2222222222222)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.query.ids = [];
            this.query.ids[0] = this.id;
            this.query. routeId = this.addSome.routeId;
            postAddedAddasdasress(
              this.query
            ).then((res) => {
              if (res.code == '000000') {
                this.$message({
                  message: '设置成功',
                  type: "success",
                });
                this.dialogVisible = false;
                this.postManualConfigurationList();
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  message: "重新分配失败",
                  type: "error"
                });
              }
            }).catch(err => {

            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      postAddedAddasdasresss(formName){

        for(let i=0;i<this.multipleSelection.length;i++){
          this.query.ids[i] = this.multipleSelection[i].id

        }
        console.log(this.addSome.routeId)
        console.log(this.query.ids,999999)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.query.ids,999999)
            this.query. routeId = this.addData.routeId
            postAddedAddasdasress(
              this.query
            ).then((res) => {
              if (res.code == '000000') {
                this.$message({
                  message: '设置成功',
                  type: "success",
                });
                this.dialogVisibles = false;
                this.postManualConfigurationList();
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  message: "重新分配失败",
                  type: "error"
                });
              }
            }).catch(err => {

            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      postManualConfigurationList(){
        postManualConfigurationList(
          this.query
        ).then((res) => {
          this.tableData=res.data;
          console.log(res);
        }).catch(err => {

        });
      },
      customerRemotes(name){
        console.log(this.query)
        if(name){
          getProjectList(
            this.$route.query.Id,name
          ).then(res=>{
            if(res.code=='000000'){
              this.customernamess = res.data
            }
          })
        }

      },
      customerRemote(customerId){
        this.loading = true
        if(customerId){

          customerName(customerId).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.customernames = res.data
            }
          })
        }
      },

      o1change(id) {
        if (id <= 0) {
          this.o2 = ''
          this.o3 = ''
          this.query.cityId = ''
          this.query.districtId = ''
          return
        }
        subs(id).then(res => {
          this.o2 = res.data
        })
      },
      o2change(id) {
        if (id <= 0) {
          this.o3 = ''
          this.query.districtId = ''
          return
        }
        this.queryStreetData.districtId = ''
        subs(id).then(res => {
          this.o3 = res.data
        })
      },
      o3change(data) {

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },





      init() {
        this.fileList = [];
        this.dialogReturn = true;
      },
      handleChange(file, fileList) {
        this.fileList = fileList;
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
          this.postManualConfigurationList();
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

        let fd = new FormData(),
          url = formatString(this.upload, this.params);
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
        this.postManualConfigurationList();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postManualConfigurationList();
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

<style scoped lang="less" >
  .brandBox{
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
              display: flex;
              justify-content: center;
              align-items: center;
              height: 40px;
              margin: 10px 0;
              .el-input　{
                width: 190px;
              }
              span{
                width: 100px;
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
      margin-left: 65px;
    }
  }
</style>
