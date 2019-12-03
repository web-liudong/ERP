<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1">
        <tr>
          <th>分类编号：</th>
          <td>{{code}}</td>
          <th><i>*</i>分类级别：</th>
          <td>{{classLevel}}</td>
        </tr>
        <tr>
          <th><i>*</i>所属一级分类：</th>
          <td>{{firstLevelName}}</td>
          <th><i>*</i>所属二级分类：</th>
          <td>{{secondLevelName}}</td>
        </tr>
        <tr>
          <th><i>*</i>三级分类名称：</th>
          <td>{{name}}</td>
          <th><i>*</i>关联税收分类：</th>
          <td>{{taxCodeName}}</td>
        </tr>
        <tr>
          <th><i>*</i>税收分类编码：</th>
          <td>{{taxCode}}</td>
          <th><i>*</i>税率：</th>
          <td>{{parseInt(taxRate)}}%</td>
        </tr>
        <tr>
          <th>三级分类状态：</th>
          <td>{{statusDescription}} <i v-if="statusDescription=='已驳回'">({{lastOperationDescription}})</i></td>
          <th><i>*</i>分类管理员账号：</th>
          <td>{{userDataAuthorityAccount}}</td>
        </tr>
        <tr>
          <th>分类管理员姓名：</th>
          <td>{{userDataAuthorityName}}</td>
          <th></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table
        :data="categoryOperationLogList"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userInfo.userFullName"
          label="操作者"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>

</template>
<script>
  import addhead from '@/components/common/head/head'
  import {detai3} from '@/api/classManage'
  export default {
    name:'CategoryDetail3',
    inject: ["close"],
    data(){
      return {
        id:null,
        code:'',
        classLevel:'',
        firstLevelName:'',
        secondLevelName:'',
        name:'',
        taxCode:'',
        taxRate:'',
        taxCodeName:'',
        statusDescription:'',
        updateStatusDescription:'',
        categoryOperationLogList:[],
        userDataAuthorityAccount:'',
        userDataAuthorityName:'',
        lastOperationDescription:''
      }
    },
    components:{
      addhead
    },
    activated(){
      var that = this;
      this.id = this.$route.query.id;
      this.getdata(that.id);
    },
    methods: {
      getdata(id){
        detai3(id).then(res=>{
          if(res.code=='000000'){
            this.code = res.data.code;
            this.firstLevelName = res.data.firstLevelName;
            this.secondLevelName = res.data.secondLevelName;
            this.classLevel = res.data.level;
            this.name = res.data.name;
            this.taxCode = res.data.taxCode;
            this.taxCodeName = res.data.taxCodeName;
            this.taxRate = res.data.taxRate;
            this.statusDescription = res.data.statusDescription;
            this.updateStatusDescription = res.data.updateStatusDescription;
            this.categoryOperationLogList = res.data.categoryOperationLogList;
            this.userDataAuthorityAccount = res.data.userDataAuthorityAccount;
            this.userDataAuthorityName = res.data.userDataAuthorityName;
            this.lastOperationDescription = res.data.lastOperationDescription;
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
    .detaillTable{
      border: 1px solid #d1d1d1;
      table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          padding-right:6px;
          box-sizing: border-box;
          color:#666;
          font-weight:700;
          font-size: 14px;
          text-align: right;
          width:20%;
          i{
            color:red;
          }
        }
        td{
          color: #666666;
          text-align: left;
          padding-left:10px;
          width:30%;
        }
      }
    }
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .button-box{
        display: flex;
        justify-content: flex-end;
        width: 90%;
        margin:0 auto 20px;
      }
    }
  }
</style>

