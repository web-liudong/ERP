<template>
  <div class="form-wrapper">
    <addhead headname="客户基本信息"></addhead>
    <table border="1">
      <tr>
        <th>客户编号：</th>
        <td></td>
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
        <th>客户联系人：</th>
        <td>
          <div v-for="(item,index) in contactList" :key="index">
            {{item.contactName}} {{item.contactJob}} {{item.contactPhone}} {{item.remark}}
          </div>
          </td>
      </tr>
      <tr>
        <th>集团客户负责人：</th>
        <td>{{groupUserDataAuthorityId}}</td>
        <th></th>
        <td></td>
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
      <el-button type="primary" @click="rejectdialog = true">驳回</el-button>
      <el-button type="primary" @click="pass">审核通过</el-button>
      <el-button type="primary" @click="close">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
    <el-dialog title="驳回" :visible.sync="rejectdialog">
      <el-form>
        <el-form-item label-width="100px">
          <span slot="label"><i style="color:red">*</i>驳回原因:</span>
          <el-input type="textarea" v-model="rejectreason" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelreject">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {customerdetail,bankaccount,detaillog,purchaserdetail,customerReject,customerPass} from '@/api/customerManage'
  export default {
    inject:['reload','close'],
    name:'customerCheck',
    data() {
      return {
        purchaserdetail:{
          customerName:'',
          purchaserName:'',
          purchaserPhone:'',
          departmentName:'',
          position:'',
          staffName:''
        },
        no:'',
        contactList:[],
        userDataAuthorityId:'',
        groupUserDataAuthorityId:'',
        rejectreason:'',
        rejectdialog:false,
        customerId:null,
        id:'',
        status:'',
        projectName:'',
        type:'',
        name:'',
        socialCreditCode:'',
        shortName:'',
        paymentDays:'',
        parentName:'',
        industry:'',
        creditLine:'',
        address:'',
        contact:'',
        orderSignType:'',
        packageType:'',
        orderRemark:'',
        packageRemark:'',
        deliveryRemark:'',
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
    activated(){
      this.customerId = this.$route.query.id;
      this.getDetail(this.customerId)
      this.getcount(this.customerId)
      this.getLog(this.customerId)
    },
    methods: {
      pass(){
        customerPass(this.customerId).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
           this.close({name:'customerCheck', to: {name:'customermanage', params:{isUpdate:true}}});
          }else if(/^01/.test(res.code)){
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
        })
      },
      handleNodeClick(data){
        purchaserdetail(data.id).then(res=>{
          if(res.code=='000000'){
            this.purchaserdetail = res.data
          }
        })
      },
      cancelreject(){
        this.rejectdialog = false
        this.rejectreason = ''
      },
      reject(){
        if(!this.rejectreason){
          this.$message.error('驳回原因不能为空');
          return;
        }else{
          customerReject(this.customerId,{
            reason:this.rejectreason
          }).then(res=>{
            if(res.code=='000000'){
              this.$message('操作成功');
              this.close({name:'customerCheck', to: {name:'customermanage', params:{isUpdate:true}}});
            }
          })
        }
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
            this.userDataAuthorityId = res.data.userDataAuthorityId
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
            this.orderSignType = res.data.orderSignType
            this.packageType = res.data.packageType
            this.orderRemark = res.data.orderRemark
            this.packageRemark = res.data.packageRemark
            this.deliveryRemark = res.data.deliveryRemark
            this.groupUserDataAuthorityId = res.data.groupUserDataAuthorityId,
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
    .button-box{
      width: 90%;
      margin: 20px auto 50px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
