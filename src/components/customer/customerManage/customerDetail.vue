<template>
  <div class="form-wrapper">
    <addhead headname="客户基本信息"></addhead>
    <table border="1">
      <tr>
        <th>客户编号：</th>
        <td>{{no}}</td>
        <th>客户状态：</th>
        <td>{{status}}</td>
      </tr>
      <tr>
        <th><i>*</i> 所属项目：</th>
        <td>{{projectName}}</td>
        <th><i>*</i> 客户性质：</th>
        <td>{{type}}</td>
      </tr>
      <tr>
        <th><i>*</i> 客户名称：</th>
        <td>{{name}}</td>
        <th>统一社会信用代码：</th>
        <td>{{socialCreditCode}}</td>
      </tr>
      <tr>
        <th>客户简称：</th>
        <td>{{shortName}}</td>
        <th>客户账期：</th>
        <td>{{paymentDays}}天</td>
      </tr>
      <tr>
        <th>所属上级客户：</th>
        <td>{{parentName}}</td>
        <th>授信额度：</th>
        <td>{{creditLine}}万元</td>
      </tr>
      <tr>
        <th>客户办公地址：</th>
        <td>{{address}}</td>
        <th><i>*</i> 客户行业：</th>
        <td>{{industry}}</td>
      </tr>
      <tr>
        <th>客户乙方负责人：</th>
        <td>{{userDataAuthorityId}}</td>
        <th>集团客户负责人：</th>
        <td>{{groupUserDataAuthorityId}}</td>
      </tr>
      <tr>
        <th>客户联系人：</th>
        <td colspan="3">
          <div v-for="(item,index) in contactList" :key="index">
            {{item.contactName}} {{item.contactJob}} {{item.contactPhone}} {{item.remark}}
          </div>
        </td>
      </tr>
    </table>
    <addhead headname="客户银行账号"></addhead>
    <el-table
      :data="bankaccount"
      border>
      <el-table-column
        prop="accountName"
        label="开户名称" align="center" >
      </el-table-column>
      <el-table-column
        prop="bank"
        label="开户行" align="center">
      </el-table-column>
      <el-table-column
        prop="accountNo"
        label="开户账号" align="center">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注" align="center">
      </el-table-column>
    </el-table>
    <addhead headname="客户组织架构"></addhead>
    <div class="organization">
      <div class="organization-left">
        <div class="organization-left-head">组织架构信息</div>
        <el-tree :data="organization" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
      </div>
      <div class="organization-right">
        <div class="organization-left-head">人员信息</div>
        <table border="1">
          <tr>
            <th><i>*</i> 姓名：</th>
            <td>{{purchaserdetail.userDTO?purchaserdetail.userDTO.realName:''}}</td>
            <th>所属客户：</th>
            <td>{{purchaserdetail.customerName}}</td>
          </tr>
          <tr>
            <th><i>*</i> 联系方式：</th>
            <td>{{purchaserdetail.phone}}</td>
            <th>所属部门：</th>
            <td>{{purchaserdetail.departmentName}}</td>
          </tr>
          <tr>
            <th>职务：</th>
            <td>{{purchaserdetail.position}}</td>
            <th><i>*</i> 业务员：</th>
            <td>{{purchaserdetail.staffName}}</td>
          </tr>
          <tr>
            <th>账号：</th>
            <td>{{purchaserdetail.userDTO?purchaserdetail.userDTO.userName:''}}</td>
            <th>账号状态：</th>
            <td>{{customerStatus}}</td>
          </tr>
          <tr>
            <th>备注：</th>
            <td>{{purchaserdetail.description}}</td>
            <th></th>
            <td></td>
          </tr>
        </table>

      </div>
    </div>
    <addhead headname="操作详情"></addhead>
    <el-table
      :data="tableLog"
      border>
      <el-table-column
        prop="userInfo.realName"
        label="操作者" align="center" >
      </el-table-column>
      <el-table-column
        prop="operationTime"
        label="操作时间" align="center">
      </el-table-column>
      <el-table-column
        prop="operationDescription"
        label="操作描述" align="center">
      </el-table-column>
    </el-table>
    <div class="button-box">
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {customerdetail,bankaccount,detaillog,customerorganization,purchaserdetail} from '@/api/customerManage'
  export default {
    inject:['reload','close'],
    name:'customerdetail',
    data() {
      return {
        no:'',
        contactList:[],
        customerStatus:'',
        purchaserdetail:{
          customerName:'',
          purchaserName:'',
          purchaserPhone:'',
          departmentName:'',
          position:'',
          staffName:''
        },
        rejectreason:'',
        rejectdialog:false,
        customerId:null,
        id:'',
        status:'',
        projectName:'',
        type:'',
        name:'',
        userDataAuthorityId:'',
        groupUserDataAuthorityId:'',
        socialCreditCode:'',
        shortName:'',
        paymentDays:'',
        parentName:'',
        industry:'',
        creditLine:'',
        address:'',
        contact:'',
        packageRemark:'',
        bankaccount:[],
        tableLog:[],
        organization:[],
        defaultProps:{
          label: 'name',
          children: 'subCustomerOrganizationList',
        }
      }
    },
    components:{
      addhead
    },
    activated(){
      this.customerId = this.$route.query.id;
      this.getDetail(this.customerId)
      this.getcount(this.customerId)
      this.getLog(this.customerId)
      this.getTree(this.customerId)
    },
    methods: {
      handleNodeClick(data){
        if(data.type==2){
          purchaserdetail(data.id).then(res=>{
            if(res.code=='000000'){
              this.purchaserdetail = res.data
              if(res.data){
                  this.customerStatus = res.data.userDTO.status==0?'可用':res.data.userDTO.status==1?'禁用':'离职'
              }
            }
          })
        }
      },
      getTree(id){
        customerorganization(id).then(res=>{
          if(res.code=='000000'){
            this.organization = res.data
          }
        })
      },
      getLog(id){
        detaillog(id).then(
          res=>{
            if(res.code=='000000'){
              this.tableLog = res.data;
            }
          }
        )
      },
      getDetail(id){
        customerdetail(id).then(res=>{
          if(res.code=='000000'){
            this.no = res.data.no;
            this.id = res.data.id
            this.status = res.data.status
            this.projectName = res.data.projectName
            this.type = res.data.type
            this.name = res.data.name
            this.socialCreditCode = res.data.socialCreditCode
            this.shortName = res.data.shortName
            this.paymentDays = res.data.paymentDays
            this.parentName = res.data.parentName
            this.industry = res.data.industry
            this.creditLine = res.data.creditLine
            this.address = res.data.address
            this.contact = res.data.contact
            this.packageRemark = res.data.packageRemark
            this.userDataAuthorityId = res.data.userDataAuthorityId
            this.groupUserDataAuthorityId = res.data.groupUserDataAuthorityId
            this.contactList = res.data.contactList
          }
        })
      },
      getcount(id){
        bankaccount(id).then(res=>{
          if(res.code=='000000'){
            this.bankaccount = res.data
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .form-wrapper{
    margin-top:20px;
    border-right:1px solid #e4e4e4;
    border-left:1px solid #e4e4e4;
    border-bottom:1px solid #e4e4e4;
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
