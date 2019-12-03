<template>
  <div class="accreditStorDetaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>授权编号：</th>
          <td>{{detaillsTable.no}}</td>
          <th>授权状态：</th>
          <td><i>{{detaillsTable.validityStatus | leftvalidityStatus}}</i><br/>
            <i style="color: red">{{detaillsTable.validityStatus | rightvalidityStatus}}</i></td>
        </tr>
        <tr>
          <th><i>*</i>授权单位：</th>
          <td>{{detaillsTable.organizationName}}</td>
          <th><i>*</i>授权单位类型：</th>
          <td>
            <span v-if="detaillsTable.organizationType == '0'">厂商</span>
            <span v-if="detaillsTable.organizationType == '1'">总代</span>
            <span v-if="detaillsTable.organizationType == '2'">经销商</span>
          </td>
        </tr>
        <tr>
          <th><i>*</i>授权品牌：</th>
          <td>{{detaillsTable.brandName}}</td>
          <th><i>*</i>授权有效期：</th>
          <td>{{detaillsTable.startTime | formatDate}}&nbsp;&nbsp;到&nbsp;&nbsp;{{detaillsTable.endTime | formatDate}}
          </td>
        </tr>
        <tr>
          <th>资质文件：</th>
          <td colspan="3">
            <li v-for='item in detaillsTable.fileDTOList'>
              <a href="javascript:void(0);" @click="getFileDownload(item)" style="color: #339999">{{item.fileName}}</a>
            </li>
          </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i></i>操作详情</span>
      </div>
      <el-table
        :data="detaillsTable.authorizationOperationLogs"
        border
        stripe
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userName"
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.operationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
    </div>
    <el-dialog title="文件预览" :visible.sync="dialogImg" class="dowBox">
      <img v-if="checkType(dialogImgUrl)" :src="imgurl+dialogImgUrl.filePath" alt="" id="imgbox" style="max-width: 100%;">
      <iframe v-else  :src="imgurl+dialogImgUrl.filePath" width="100%" height="400px">
        不支持
      </iframe>
    </el-dialog>
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
  import {getFileDownload} from "@/api/common/commonApi"

  export default {
    inject:['reload','imgurl','close'],//注入依赖
    name:'AccreditDetaills',
    data() {
      return {
        RecordId:'',
        msg: '',
        detaillsTable: {
          brandName: "",
          endTime: "",
          fileId: "",
          id: 0,
          organizationName: "",
          organizationType: 1,
          startTime: "",
          validityStatus: "",
          authorizationOperationLogs: []
        },
        dialogImgUrl: '',
        dialogImg: false,
      }
    },
    computed: {
      loading() {
        return this.$store.getters.loading
      },
    },

    // mounted() {
    //   //请求详情数据  this.$route.query.Id（路由传递的id）
    //   getAccreditDetaills(
    //     this.$route.query.Id
    //   ).then((res) => {
    //     console.log(res)
    //     this.detaillsTable = res.data;
    //     console.log(this.detaillsTable);
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    created(){
      this.gitDetaliis();
    },
    activated(){
      if(this.RecordId != this.$route.query.Id){
        this.RecordId = this.$route.query.Id
        this.gitDetaliis();
      }
    },
    methods: {
      gitDetaliis(){
        this.RecordId = this.$route.query.Id
        getAccreditDetaills(
          this.$route.query.Id
        ).then((res) => {
          console.log(res)
          this.detaillsTable = res.data;
          console.log(this.detaillsTable);
        }).catch(err => {
          console.log(err)
        })
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
      //单独文件下载
      getFileDownload(item) {
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
      //关闭当前页面
      // close() {
      //   window.opener = null;
      //   window.close()
      // },
    },
    watch: {},
    filters: {
      //时间截取字符串
      formatDate: function (value) {
        return value.substring(0, 10);
      },
      leftvalidityStatus: function (value) {
        if (value.length > 3) {
          return value.substring(0, 4);
        } else {
          return value
        }

      },
      rightvalidityStatus: function (value) {
        if (value.length > 3) {
          return value.substring(4, 1111);
        } else {
          return ""
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .accreditStorDetaillBox {
    width: 100%;
    padding-top: 10px;
    .detaillTable {
      border: 1px solid #d1d1d1;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
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
          width: 20%;
          i {
            color: red;
          }
        }
        td {
          color: #666666;
          text-align: left;
          padding-left: 10px;
          width: 30%;
        }
      }
    }
    .detaillTable2 {
      border: 1px solid #d1d1d1;
      border-top: none;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-table {
        margin: 20px auto;
        width: 90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: right;
        margin: 10px 20px;
      }
    }

  }


</style>
<style>
  .accreditStorDetaillBox .el-dialog__body {
    text-align: center;
  }
</style>
