<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="iconfont icon-jinqi"></i>基本信息</span>
      </div>
      <table border="1" v-if="tableData">
        <tr>
          <th>部门ID：</th>
          <td >{{tableData.id}}</td>
          <th>部门名称：</th>
          <td>{{tableData.name}}</td>
        </tr>
        <tr>
          <th>所属上级部门：</th>
          <td>{{tableData.parentName}}</td>
          <th>部门描述：</th>
          <td>{{tableData.description}}</td>
        </tr>
        <tr>
          <th>部门负责人：</th>
          <td colspan="3" > <span v-for="(item,i) in tableData.managerMsgList" :key="i"> {{item.username}}-{{item.realName}}</span> </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear"  >
      <div class="detaillTopBox">
        <span><i class="iconfont icon-jinqi"></i>操作详情</span>
      </div>
      <el-table
        :data="formData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userInfo"
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span v-for="item in scope.row.userInfo&&scope.row.userInfo.userPosts" :key="item.departmentId">
              {{item.organizationName}}>{{item.departmentName}}<i v-show="item.departmentName">></i></span> 
              {{scope.row.userInfo&&scope.row.userInfo.realName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationLogOperationName"
          label="操作描述"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            {{scope.row.operationLogOperationName}}
            <br/>
            {{scope.row.description}}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" v-back-top>返回顶部</el-button>
      <el-button type="primary" @click="close()">关闭</el-button>
    </div>
  </div>

</template>
<script>
  import {searchSectionInfo} from '@/api/organizationManage'
  import {timeFormat} from '@/utils/index'
  export default {
    inject:['close'],
    name:'SectionDetail',
    data(){
      return {
        tableData: null,
        formData:null,
        ID:null,
        tableData22:null
      }
    },
    methods: {},
    created(){
      this.ID=this.$route.query.delId;
      searchSectionInfo(this.ID).then(res=>{
        this.tableData=res.data;
        let form =res.data.organizationDepartmentOperationLogDTOList;
        this.formData=form;
        // for (let i = 0; i < this.formData.length; i++) {
        //   let  item = this.formData[i];
        //   item.operationTime=timeFormat(item.operationTime)
        // }
      })
    },
    activated(){
      if(this.ID!=this.$route.query.delId){
        this.ID=this.$route.query.delId;
        searchSectionInfo(this.ID).then(res=>{
        this.tableData=res.data;
        let form =res.data.organizationDepartmentOperationLogDTOList;
        this.formData=form;
        // for (let i = 0; i < this.formData.length; i++) {
        //   let  item = this.formData[i];
        //   item.operationTime=timeFormat(item.operationTime)
        // }
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
      .detaillTopBox{
        height:50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span{
          line-height:50px;
          margin-left:10px;
        }
      }
      table{
        width:90%;
        margin:20px auto;
        .classifyBox{
          max-height: 51px ;
          overflow: hidden;
          text-overflow:ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          width: 264.5%;
        }
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          color:#303133;
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
      .detaillTopBox{
        height:50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span{
          line-height:50px;
          margin-left:10px;
         
        }
      }
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: right;
        margin:10px 20px;
      }
    }
  }


</style>

