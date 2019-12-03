

<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1" v-if="{a:tableData==null}">
        <tr>
          <th>品牌ID：</th>
          <td>{{tableData.id}}</td>
          <th>品牌状态：</th>
          <td>{{tableData.statusName}}</td>
        </tr>
        <tr>
          <th><i>*</i>品牌中名：</th>
          <td>{{tableData.nameCN}}</td>
          <th><i>*</i>更新状态：</th>
          <td>{{tableData.updateStatusName}}</td>
        </tr>
        <tr>
          <th><i>*</i>品牌英文名：</th>
          <td>{{tableData.nameEN}}</td>
          <th><i>*</i> 注册号/申请号：</th>
          <td>{{tableData.registeredNo}}</td>
        </tr>
        <tr>
          <th><i>*</i>商标申请人：</th>
          <td colspan="3">{{tableData.registrant}}</td>
        </tr>
        <tr>
          <th><i>*</i> 经营分类：</th>
          <td colspan="3">
            {{tableData.categoryNames}}
          </td>
        </tr>
        <tr>
          <th><i>*</i>品牌logo：</th>
          <td>{{tableData.logoFileId}}</td>
          <th><i>*</i>品牌简介：</th>
          <td>{{tableData.description}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i></i>操作详情</span>
      </div>
      <el-table
        :data="formData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userName"
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
          prop="operation"
          label="操作描述"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            {{`${scope.row.operation}  ${scope.row.operationTime}`}}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-back-top>返回顶部</el-button>
    </div>
  </div>

</template>
<script>
  import {compareID} from '@/api/brandManage';
  export default {
    data() {
      return {
        tableData: null,
        formData: null,
        ID : this.$route.query.updateId
      }
    },
    methods: {
      getBrandUpdateDetail() {

        compareID(this.ID).then(res => {
          this.tableData = res.data;
          let form = res.data.brandOperationLogList;
          this.formData = form;
        })
      },
      //关闭浏览器
      close(){
        const {href}=this.$router.resolve({
          name:'BrandUpdate',
          query:{
            id:this.ID
          }
        })
        window.close(href)
      }
    },
    created() {
      this.getBrandUpdateDetail();
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
          i{

          }
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
          i{

          }
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

