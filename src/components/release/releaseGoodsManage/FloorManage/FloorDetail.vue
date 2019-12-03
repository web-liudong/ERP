<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1">
        <tr>
          <th>楼层ID：</th>
          <td>{{id}}</td>
          <th>楼层名称：</th>
          <td>{{name}}</td>
        </tr>
        <tr>
          <th>显示优先级：</th>
          <td>{{index}}</td>
          <th></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table
        :data="operationLogs"
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
          prop="operationName"
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
  import {floordetail} from '@/api/release/floorManage'
  export default {
    inject:['reload','close'],
    name:'floordetail',
    data(){
      return {
        id:null,
        name:'',
        index:'',
        operationLogs:[]
      }
    },
    activated(){
      var that = this;
      this.id = this.$route.query.id;
      this.getdata(that.id);
    },
    components:{
      addhead
    },
    methods: {
      getdata(id){
        floordetail(id).then(res=>{
          if(res.code=='000000'){
            this.name = res.data.name
            this.index = res.data.index
            this.operationLogs = res.data.operationLogs
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

