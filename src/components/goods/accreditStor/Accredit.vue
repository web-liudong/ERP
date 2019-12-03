<template>
  <div class="accreditstorBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="font-size: 14px"><i class="el-icon-arrow-up" ></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow" style="font-size: 14px"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postAccreditList(query)">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="homeText">
            <div class="time-box">
              <span>授权编号:</span>
              <el-input
                type="number"
                placeholder="授权编号"
                v-model="query.no"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>授权单位:</span>
              <el-input
                placeholder="授权单位"
                v-model="query.organizationName"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>授权单位类型:</span>
              <el-select v-model="query.organizationType" placeholder="授权单位类型">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="time-box">
              <span>授权品牌:</span>
              <el-input
                placeholder="授权品牌"
                v-model="query.brandName"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>授权状态:</span>
              <el-select v-model="query.validityStatus" placeholder="授权状态">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <!-- <el-button size="small" style="width: 97px;height: 30px;padding-top:6px;"  @click="importfile"  v-if="$authorities.AccreditImportRelevant" ><i class="iconfont icon-Icon-daoru"></i>批量导入</el-button>
          <router-link target="_blank" :to="{name:'AccreditImportRecord'}"  v-if="$authorities.AccreditImportRelevant">
            <el-button size="small" style="width: 97px;height: 30px;" >导入记录</el-button>
          </router-link> -->
          <div class="white-btn fun-btn" @click="showDialog('importBigFile')" v-if="$authorities.AccreditImportRelevant"><i class="icon iconfont icondaoru"></i>导入</div>
          <div class="white-btn fun-btn" @click="importdetail();" v-if="$authorities.AccreditImportRelevant"><i class="icon iconfont icondingdanguanli"></i>导入记录</div>
          <!--<router-link :to="{name:'AccreditAdd'}"   v-if="$authorities.AccreditCreate" target="_blank">-->
              <el-button size="small" icon="el-icon-plus"  @click="gitAdd()"  v-if="$authorities.AccreditCreate">&nbsp;添加</el-button>
            <!--<div class="white-btn fun-btn"><i class="icon iconfont icon-add"></i>添加</div>-->
          <!--</router-link>-->
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="no"
            label="授权编号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            label="授权单位"
            align="center">
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="goDetail(scope.row)" v-if="scope.row.supplierId!= null">{{scope.row.organizationName}}</el-button>
              <el-button  type="text" size="small" style="color:#606266 "  v-else >{{scope.row.organizationName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="organizationType"
            label="授权单位类型"
            align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.organizationType == '0'">厂商</i>
              <i v-if="scope.row.organizationType == '1'">总代</i>
              <i v-if="scope.row.organizationType == '2'">经销商</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="授权品牌"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="endTime"
            label="授权有效期"
            align="center">
            <template slot-scope="scope">
              <i>{{scope.row.startTime | formatDate}}</i> &nbsp;&nbsp;&nbsp;至
              <i>{{scope.row.endTime | formatDate}}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="validityStatus"
            label="授权状态"
            align="center">
            <template slot-scope="scope">
              <i>{{scope.row.validityStatus | leftvalidityStatus}}</i><br/>
              <i style="color: red">{{scope.row.validityStatus | rightvalidityStatus}}</i>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goAccreditDetaills(scope.row)"
                         v-if="$authorities.AccreditDetail"
                         type="text" size="small">详情</el-button>
              <el-button @click="goAccreditRedact(scope.row)"
                         v-if="$authorities.AccreditUpdate"
                         type="text" size="small">编辑</el-button>
              <el-button type="text" size="small"
                         v-if="$authorities.AccreditDelete"
                         @click="dialogDelete = !dialogDelete ,deleteId = scope.row.id">删除
              </el-button>
              <el-button type="text" size="small"
                         v-if="$authorities.AccreditDownload"
                         @click="dialogDownload = !dialogDownload ,
                         dowName = scope.row.organizationName,
                         dowTableData=scope.row.fileDTOList,
                         dowId=scope.row.fileId,
                         dowFilesId=scope.row.id,
                         dowBrand = scope.row.brandName">下载授权资质
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
          :current-page="currentPage"
          :page-size="returnData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogDelete" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">删除提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">删除之后，列表将不再展示该条数据，确定要删除吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary"  v-if="$authorities.AccreditDelete" @click="dialogDelete=false,deleteAccreditDelete()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="下载文件" :visible.sync="dialogDownload"  v-if="$authorities.AccreditDownload" class="dowBox">
      <div class="dowInfo clear">
        <span><i> * </i>授权单位：{{dowName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span><i> * </i>授权品牌：{{dowBrand}}</span>
        <el-button type="primary" style="float: right;margin-right: 30px;" @click="downloadAll()">一键全部下载</el-button>
      </div>
      <el-table
        :data="dowTableData"
        max-height="250"
        border
        stripe
        style="width: 100%">
        <el-table-column
          label="授权文件"
          align="center">
          <template slot-scope="scope">
            <a href="javascript:void(0);" @click="clickFile(scope.row)" style="color: #339999">{{scope.row.fileName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getFileDownload(scope.row.id)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="文件预览" :visible.sync="dialogImg" class="dowBox">
      <img v-if="checkType(dialogImgUrl)" :src="imgurl+dialogImgUrl.filePath" alt="" id="imgbox" style="max-width: 100%;">
      <iframe v-else  :src="imgurl+dialogImgUrl.filePath" width="100%" height="400px">
        不支持
      </iframe>
    </el-dialog>
    <importBigFile
        ref="importBigFile"
        :title="'授权库批量导入'"
        :type="'Accredit-Payments-import'"
        @callback="importCallback"
      ></importBigFile>
  </div>
</template>

<script>
  import {
    postAccreditAdd,
    getAccreditDetaills,
    putAccreditRedact,
    deleteAccreditDelete,
    postAccreditList,
    postAccreditAddLog
  } from '@/api/goods/accreditStor'
  import {getFileDownloadBatch} from "@/api/common/commonApi"
  import importBigFile from "@/components/common/module/ImportBigFile";
  export default {
    inject:['reload','imgurl','close'],//注入依赖
    name: "Accredit",
    data() {
      return {
        dialogImgUrl: '',
        dialogImg: false,
        //下载授权授权库模态框的名字
        dowName: '',
        dowBrand: '',
        dowTableData: [],
        dowId:[],
        dowFilesId:0,
        returnData: {
          items: [],
          offset: '',
          pageNum: 0,
          pageSize: 0,
          total: 0,
        },
        deleteId: 0,
        typeOptions: [{
          value: 3,
          label: '不限'
        }, {
          value: 0,
          label: '厂商'
        }, {
          value: 1,
          label: '总代'
        }, {
          value: 2,
          label: '经销商'
        }],
        stateOptions: [{
          value: 3,
          label: '不限'
        }, {
          value: 0,
          label: '有效'
        }, {
          value: 1,
          label: '即将到期'
        }, {
          value: 2,
          label: '已过期'
        }],
        //查询
        query: {
          no:'',
          brandName: "",
          id: '',
          organizationName: "",
          organizationType: '',
          validityStatus: '',
          pageNum: 1,
          pageSize: 10,
        },
        //删选显示
        isShow: true,
        //表格数据
        tableData: [{
          brandName: "授权品牌名称test2",
          endTime: "2018-11-16T14:35:39.590+0000",
          fileId: "37,38,40",
          id: 5,
          organizationName: "测试test2",
          organizationType: 1,
          pageNum: 0,
          pageSize: 0,
          startTime: "2018-11-16T14:35:39.590+0000",
          validityStatus: "即将到期 倒计时：0天"
        }],
        //翻页
        currentPage: 1,
        dialogDelete: false,
        dialogDownload: false,
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    components:{
      importBigFile
    },
    created() {
      this.postAccreditList(this.query);
    },
    mounted() {

      //this.postAccreditAddLog();
    },
    activated(){
      if(this.$route.params.isUpdate){
        this.postAccreditList(this.query);
      }
    },
    methods: {
      reset() {
        this.query = {
          no:'',
          brandName: "",
          id: '',
          organizationName: "",
          organizationType: '',
          validityStatus: '',
          pageNum: 1,
          pageSize: 10,
        },
          this.postAccreditList(this.query);
      },
      gitAdd(){
        this.$router.push({path: '/goods/accreditstor/add'});
      },
      clickFile(item) {
        this.dialogImgUrl=item;
        this.dialogImg = !this.dialogImg;
//        getFileDownload(
//          id
//        ).then((res) => {
//          this.dialogImg = !this.dialogImg;
//          this.$nextTick(function () {
//            let imgBox = document.getElementById('imgbox');
//            let imgsrc = window.URL.createObjectURL(new Blob([res]))
//            console.log(imgsrc);
//            imgBox.src = imgsrc;
//          })
//        }).catch(err => {
//          console.log(err)
//        })
      },
      checkType(file){
        let type=null;
        if(file){
          var testmsg=file.fileName.substring(file.fileName.lastIndexOf('.')+1);
          const extension= testmsg === 'pdf';
          if(!extension) {
            type=true;
          }else{
            type=false;
          }
          return type
        }
      },
      importfile(){
        this.$refs["importFile"].init();
      },
      importCallback(){
        //回调处理
      },

      //跳转供应商详情
      goDetail(row){
        // const { href } = this.$router.resolve({
        //   name: 'BasicDetail',
        //   query:{
        //     detailId:row.supplierId
        //   }
        // })
        // window.open(href, '_blank')
        if(this.$authorities.SupplierBasicDetailRelevant){
          this.$router.push({path: '/supplier/basic/supplierindex/basicDetail', query: { detailId:row.supplierId}});
        }

      },
      //全部下载接口
      getFileDownloadBatch() {
        getFileDownloadBatch(
          {
            ids:this.dowId
          }

        ).then((res) => {
          console.log(res);
          this.download(res);
          this.postAccreditAddLog();
        }).catch(err => {
          console.log(err);
        });
      },
      //全部下载点击事件
      downloadAll(){
        this.getFileDownloadBatch();
      },
      //全部下载回调
      download(data){
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data],{type:"application/zip"}))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download','files.zip')
        document.body.appendChild(link)
        link.click()
        console.log(link)
      },
      //单独文件下载
      getFileDownload(id) {
        // console.log(row.id);
        this. postAccreditAddLog();
        let token='&access_token='+this.$auth.token;
        let href = '/api/file-service/file/download?id='+id + token;
        window.open(href, '_blank')
      },
      //请求授权库列表
      postAccreditList(data) {
        postAccreditList(
          data
        ).then((res) => {
          console.log(res)
          this.tableData = res.data.items;
          this.returnData = res.data;
        }).catch(err => {
          console.log(err);
        });
      },
      //删除
      deleteAccreditDelete() {
        deleteAccreditDelete(
          this.deleteId
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.postAccreditList(this.query);
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
          this.postAccreditList(this.query);
        }).catch(err => {

        });
      },
      //增加下载日志信息
      postAccreditAddLog() {
        console.log(this.dowFilesId);
        postAccreditAddLog(
          {
            "authorizationId": this.dowFilesId,
          }
        ).then((res) => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      //跳转详情
      goAccreditDetaills(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'AccreditDetaills',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/goods/accreditstor/detaills', query: {Id: row.id}});
      },
      //跳转编辑
      goAccreditRedact(row) {
        // console.log(row.id);
        // const {href} = this.$router.resolve({
        //   name: 'AccreditRedact',
        //   query: {
        //     Id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/goods/accreditstor/redact', query: {Id: row.id}});
      },
      showDialog(type, row) {
        this.$refs[type].init(row);
      },
      //导入记录
      importdetail() {
        // const {href} = this.$router.resolve({
        //   name: 'SysImportRecord',
        //   query:{type:'accredit-import-list'}
        // })
        // window.open(href, '_blank')
        this.$router.push({path: '/system/systemopa/importRecord', query: {type:'accredit-import-list'}});
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postAccreditList(this.query);
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postAccreditList(this.query);
      },

    },
    filters: {
      //时间截取字符串
      formatDate: function (value) {
        return value.substring(0, 10);
      },
      leftvalidityStatus: function (value) {
        if(value.length>3){
          return value.substring(0, 4);
        }else {
          return value
        }

      },
      rightvalidityStatus: function (value) {
        if(value.length>3){
          return value.substring(4, 1111);
        }else {
          return ""
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .accreditstorBox {
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

        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .homeText{

          span{
            width: 120px;
            text-align: right;
          }
          .el-input {
            width: 200px;
            height: 50px;
            line-height: 56px;
            margin-left: 10px;
          }
          .time-box{
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
        .el-input {
          width: 200px;
          line-height: 56px;
          margin-left: 10px;
        }
        .el-select {
          margin-left: 10px;
        }
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      line-height: 50px;
      .listBoxTop {
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
        .fun-btn {
          border-color:#dcdfe6;
          &:hover{
            border-color:#c2e0e0;
          }
          .iconfont{
            font-weight: normal;
            color: inherit;
            font-size: 16px;
          }
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
          margin-left: 0px;
        }
      }
    }
    .block {
      margin-top: 10px;
      margin-right: 20px;
      text-align: right;
    }
    .dowBox {
      .dowInfo {
        margin-bottom: 20px;
        span {
          height: 40px;
          line-height: 40px;
          i {
            color: red;
          }
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
        /*padding: 0px 20px;*/
        font-size: 14px;
        color: #666;
        .el-input {
          width: 80%;
        }
        .first-step-box {
          padding:20px 0;
          .first-step {
            color: red;
            font-size: 18px;
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .second-step-box {
          display: flex;
          /*padding:20px 0;*/
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

