<template>
  <div class="form-wrapper">
    <addhead headname="目标客户基本信息" iconName="iconjinridingdanshu"></addhead>
    <table border="1">
      <tr>
        <th>客户编号：</th>
        <td>{{no}}</td>
        <th> <span>*</span>客户性质：</th>
        <td>{{type}}</td>
      </tr>
      <tr>
        <th><span>*</span>客户名称：</th>
        <td>{{name}}</td>
        <th>客户行业：</th>
        <td>{{industry}}</td>

      </tr>
      <tr>
        <th>统一社会信用代码：</th>
        <td>{{socialCreditCode}}</td>
        <th>所属上级客户：</th>
        <td>{{parentCustomer}}</td>
      </tr>
      <tr>
        <th>客户办公地址：</th>
        <td>{{address}}</td>
        <th><span>*</span>业务员：</th>
        <td>{{userDataAuthorityUserName}}-
        {{userDataAuthorityRealName}}</td>
      </tr>
      <tr>
        <th>客户联系人：</th>
        <td>{{contact}}{{contactPhone}}</td>
        <th></th>
        <td></td>
      </tr>
    </table>
    <addhead headname="操作详情" iconName="iconcaozuoxiangqing"></addhead>
    <el-table
      :data="targetCustomerOperationLog"
      border>
      <el-table-column
        label="操作者" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.userInfo.userFullName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operationTime"
        label="操作时间" align="center">
      </el-table-column>
      <el-table-column
        label="操作描述" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.operationName}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="button-box">
      <el-button type="primary" @click="closed">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {targetCustomerDetail} from '@/api/targetCustomerManage';
  export default {
    inject:['close'],
    name:'TargetCustomerDetail',
    data() {
      return {
        rejectreason:'',
        rejectdialog:false,
        customerId:null,
        id:'',
        no:null,
        type:'',
        name:'',
        socialCreditCode:'',
        parentCustomer:'',
        industry:'',
        userDataAuthorityName:'',
        userDataAuthorityRealName:'',
        userDataAuthorityUserName:'',
        creditLine:'',
        address:'',
        contact:'',
        contactPhone:'',
        deliveryRemark:'',
        targetCustomerOperationLog:[{description:'', userInfo:{userFullName:null}, operationTime: null}],
        bankaccount:[],
        tableLog:[],
        organization:[],
        defaultProps:{
          children: 'subCustomerOrganizationList',
          label: 'name'
        }
      }
    },
    components:{
      addhead
    },
    created(){
      
    },
    activated(){
      if(this.customerId!=this.$route.query.id){
        this.getDetail()
      }
    },
    methods: {
      handleNodeClick(data){
        purchaserdetail(data.id).then(res=>{
          if(res.code=='000000'){
            this.purchaserdetail = res.data
          }
        })
      },
      switchTypes(n){
        let type='';
        switch(n){
          case 0:
            type="国企"
            break;
          case 1:
            type="民企"
            break;
          case 2:
            type="政府"
            break;
          case 3:
            type="军队"
            break;
          case 4:
            type="央企"
            break;
          case 5:
            type="外企"
            break;
        }
        return type;
      },
      getDetail(id){
        this.customerId = this.$route.query.id;
        targetCustomerDetail(this.customerId ).then(res=>{
          if(res.code=='000000'){
            this.id = res.data.id
            this.type=this.switchTypes(res.data.type);
            this.name = res.data.name
            this.industry = res.data.thirdLevelIndustryName
            this.no=res.data.no
            this.socialCreditCode = res.data.socialCreditCode
            this.parentCustomer = res.data.parentCustomer
            this.address = res.data.addressLine
            this.userDataAuthorityRealName=res.data.userDataAuthorityRealName
            this.userDataAuthorityUserName=res.data.userDataAuthorityUserName
            this.contact = res.data.customerContactName
            this.contactPhone=res.data.customerContactPhone
            this.deliveryRemark = res.data.deliveryRemark
            this.creditLine = res.data.creditLine 
            this.targetCustomerOperationLog=res.data.targetCustomerOperationLogDTOList  
          }
        })
      },
      closed(){
        this.close();
      },
    }
  }
</script>

<style scoped lang="less">
  .form-wrapper{
    margin-top:20px;
    border-right:1px solid #e4e4e4;
    border-left:1px solid #e4e4e4;
    border-bottom:1px solid #e4e4e4;
    span{
      color: red;
    }
    table{
      width:90%;
      margin:20px auto;
      td,th{
        border: 1px solid #e4e4e4;
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
    .el-table{
      width: 90%;
      margin: 20px auto;
      border: 1px solid #e4e4e4;
     
      span{
        color:#606266;
      }
    }
    .organization{
      width: 90%;
      margin: 20px auto;
      display: flex;
      justify-content: space-between;
      .organization-left{
        width: 30%;
        /*height:250px;*/
        /*overflow: auto;*/
        .organization-left-head{
          width: 100%;
          border: 1px solid #e4e4e4;
          background-color: #f3f3f3;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-tree{
          width: 100%;
          height: 250px;
          overflow: auto;
        }
      }
      .organization-right{
        width: 60%;
        height:250px;
        .organization-left-head{
          width: 100%;
          border: 1px solid #e4e4e4;
          background-color: #f3f3f3;
          padding: 10px;
          box-sizing: border-box;
        }
        table{
          width: 100%;
          height: 250px;
          margin: 0;
        }
      }
    }
    .button-box{
      width: 90%;
      margin: 20px auto 50px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
