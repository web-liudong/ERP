<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="用户基本信息"></addhead>
      <table border="1">
        <tr>
          <th><i>*</i> 姓名：</th>
          <td>{{userDTO.realName}}</td>
          <th><i>*</i> 联系方式：</th>
          <td>{{phone}}</td>
        </tr>
        <tr>
          <th>所属客户：</th>
          <td>{{customerName}}</td>
          <th>所属部门：</th>
          <td>{{departmentName}}</td>
        </tr>
        <tr>
          <th>登录名：</th>
          <td>{{userDTO.userName}}</td>
          <th><i>*</i> 账号状态：</th>
          <td>{{userDTO.status==0?'可用':userDTO.status==1?'禁用':'离职'}}</td>
        </tr>
        <tr>
          <th>职务：</th>
          <td>{{position}}</td>
          <th><i>*</i> 业务员：</th>
          <td>{{staffName}}</td>
        </tr>
        <tr>
          <th>备注：</th>
          <td colspan="3">{{description}}</td>
        </tr>
        <tr>
          <th>角色：</th>
          <td colspan="3">
            <div v-for="(item,index) in userRoleList" :key="index">{{item.name}}</div>
          </td>
        </tr>
        <tr>
          <th><i>*</i> 收货地址：</th>
          <td colspan="3">
            <div v-for="(item,index) in customerRecipientDTO" :key="index">{{item.recipientName+'  '+item.recipientPhone+' '+item.provinceName+item.cityName+item.countyName+item.addressLine }}</div>
          </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table
        :data="customerPurchaserOperationLogDTOList"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userInfo.realName"
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
          prop="operationDescription"
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
  import addhead from '@/components/common/head/head.vue'
  import {userDetail} from '@/api/customerManage'
  export default {
    name:'peopledetail',
    inject: ["close"],
    data(){
      return {
        id:0,
        userDTO:{},
        phone:'',
        departmentName:'',
        customerName:'',
        position:'',
        staffName:'',
        userRoleList:[],
        customerRecipientDTO:[],
        customerPurchaserOperationLogDTOList:[],
        description:''
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
        userDetail(id).then(res=>{
          if(res.code=='000000'){
            this.userDTO = res.data.userDTO;
            this.phone = res.data.phone;
            this.customerName = res.data.customerName;
            this.departmentName = res.data.departmentName;
            this.position = res.data.position;
            this.staffName = res.data.staffName;
            this.userRoleList = res.data.userRoleList;
            this.customerRecipientDTO = res.data.customerRecipientDTO;
            this.customerPurchaserOperationLogDTOList = res.data.customerPurchaserOperationLogDTOList;
            this.description = res.data.description;
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

