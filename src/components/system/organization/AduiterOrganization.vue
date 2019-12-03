<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="组织机构基本信息"></addhead>
      <table border="1" v-if="tableData">
        <tr>
          <th>组织机构ID：</th>
          <td >{{no}}</td>
          <th>状态：</th>
          <td>{{tableData.statusName}}</td>
        </tr>
        <tr>
          <th><i>*</i>组织机构公司名称：</th>
          <td>{{tableData.name}}</td>
          <th>组织机构简称：</th>
          <td>{{tableData.shortName}}</td>
        </tr>
        <tr>
          <th>所属上级：</th>
          <td>{{tableData.parentName}}</td>
          <th><i>*</i> 组织机构性质：</th>
          <td>{{tableData.organizationTypeName}}</td>
        </tr>
        <tr>
          <th><i>*</i>组织机构公司法人：</th>
          <td>{{tableData.legalPersonName}}</td>
          <th><i>*</i>统一社会信用代码：</th>
          <td colspan="3">{{tableData.socialCreditCode}}</td>
        </tr>
        <tr>
          <th><i>*</i> 法人身份证：</th>
          <td>
            {{tableData.legalPersonIdCard}}
          </td>
          <th><i>*</i>组织机构负责人：</th>
          <td><li v-for="(item,i) in tableData.organizationContacts" :key=i style="font-size: 12px;line-height: 12px;">
          {{item|aa}}-{{item|bb}} {{item.description}}</li></td>
        </tr>
        <tr>
          <th>
           <i>*</i>是否使用领先WMS系统：
          </th>
          <td>{{tableData.useLeadingWMS?'是':'否'}}</td>
          <th>
            <i>*</i> 是否签订协议：
          </th>
          <td>{{tableData.signedAgreement?'是':'否'}}</td>
        </tr>
        <tr>
           <tr v-if="tableData.signedAgreement">
          <th>
            协议类型：
          </th>
          <td>{{tableData.agreementType==1?'战略协议':tableData.agreementType==2?'交叉持股':'--'}}</td>
          <th>
           协议编号：
          </th>
          <td>{{tableData.agreementNo}}</td>
        </tr>
        <tr>
          <th><i>*</i>组织机构所在地：</th>
          <td>{{tableData.addressLine}}</td>
          <th><i>*</i>管理员账号：</th>
          <td>{{tableData.managerNo}} {{tableData.managerName}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="组织机构关联信息"></addhead>
      <div class="listLeftBox left">
        <div class="headerBox"><span>已选经营区域预览</span></div>
        <div class="lltree">
          <el-tree
            ref="tree"
            :data="data2"
            node-key="id"
            render-after-expand
            @check="getnode()"
            :props="defaultProps">
          </el-tree>
        </div>
      </div>
      <div class="listRightBox right">
        <div class="headerBox"><span>部门/人员信息</span></div>
        <div class="lltree" style="position: relative;">
          <el-tree
            :data="data3"
            ref="tree2"
            node-key="id"
            render-after-expand
            :filter-node-method="filterNode"
            :props="defaultProps1">
          </el-tree>
        </div>
      </div>
    </div>
<div class="detaillTable3">
      <addhead headname="组织机构收票信息"></addhead>
      <table border="1" v-if="tableData">
        <tr>
          <th>
            收票人姓名：
          </th>
          <td colspan="3">{{tableData.receiver}}</td>
        </tr>
        <tr>
          <th>
            收票人电话：
          </th>
          <td colspan="3">{{tableData.receiverPhone}}</td>
        </tr>
        <tr>
          <th>
            收票地址：
          </th>
          <td colspan="3">
            <!-- {{receiverProvinceName}}
            <span v-if="receiverCityName">-</span>
            {{receiverCityName}}
            <span v-if="receiverCountyName">-</span>
            {{receiverCountyName}}
            <span v-if="tableData.receiverAddressLine">-</span> -->
            {{tableData.receiverAddressLine}}
          </td>
        </tr>
      </table>
    </div>


    <div class="detaillTable2 clear">
      <addhead headname="组织机构开票信息"></addhead>
      <el-table
        :data="formData2"
        border
        style="width: 90%"
        size="small">
        <!-- <el-table-column
          prop="organizationInvoiceInfoTypeName"
          label="发票类型"
          align="center">
        </el-table-column> -->
        <el-table-column
          prop="invoiceTitle"
          label="开票抬头"
          align="center">
        </el-table-column>
        <el-table-column
          prop="socialCreditCode"
          label="统一社会信用代码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bank"
          label="开户行"
          align="center">
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="开户名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="accountNo"
          label="开户账号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="addressOnInvoice"
          label="开票地址"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phoneOnInvoice"
          label="开票电话"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="组织机构银行账号信息"></addhead>
      <el-table
        :data="formData1"
        border
        style="width: 90%"
        size="small">
        <el-table-column prop="bank" label="开户行" style="width: 25%" align="center">
          <template slot="header">
            <i style="color:red">*</i>开户行
          </template>
          <template slot-scope="scope">
            <span style="color:red" v-if="scope.row.isDefault">(默认)</span>
            <span>{{scope.row.bank}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankNo" label="开户银行编号" style="width: 25%" align="center">
          <template slot="header">
            <i style="color:red">*</i>开户银行编号
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="开户名称" style="width: 25%" align="center">
          <template slot="header">
            <i style="color:red">*</i>开户名称
          </template>
        </el-table-column>
        <el-table-column prop="accountNo" label="开户账号" style="width: 25%" align="center">
          <template slot="header">
            <i style="color:red">*</i>开户账号
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
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
          prop="operation"
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
      <el-button type="primary" @click="toAduiter()">审核通过</el-button>
      <el-button type="primary" @click="aduiterNoPass()">驳回</el-button>
    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible" v-el-drag-dialog>
      <el-form :model="reviewRejectParam" :rules="rules" ref="reviewRejectParam">
        <el-form-item label="驳回原因：" label-width="100px" prop="description">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="1~200字以内"
            v-model="reviewRejectParam.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSuccess()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import elDragDialog from '@/directive/el-dragDialog'
  import {findOrganizationDetail,gotoPass,gotoReject,getStatusCheck} from '@/api/organizationManage'
  import {timeFormat} from '@/utils/index'
  import addhead from '@/components/common/head/head'
  export default {
    name:'AduiterOrganization',
    inject:['close'],
    data(){
      return {
        tableData: null,
        formData:null,
        formData1:null,
        formData2:null,
        ID:null,
        no:null,
        status:this.$route.query.status,
        tableData22:null,
        data2:null,
        data3:null,
        defaultProps: {
          children: 'childrenDTOs',
          label: 'name'
        },
        defaultProps1:{
          children:'subDepartment',
          label:'name'
        },
        options: [],
        timer:null,
        timer1:null,
        timer2:null,
        timer3:null,
        dialogFormVisible:false,
        //驳回原因
        reviewRejectParam:{
          description:''
        },
        rules:{
          description:[{required:true,message:'驳回原因不能为空',trigger:'blur'},{min:1,max:200,message:'驳回原因长度在1~200字以内',trigger:'change'}]
        }
      }
    },
    filters:{
      aa(value){
        return value?value.name:''
      },
      bb(value){
        return value?value.phone:''
      }
    },
    components:{addhead},
    directives:{
      elDragDialog
    },
    created(){
      this.ID=this.$route.query.id;
      this.no=this.$route.query.no;
      findOrganizationDetail(this.$route.query.id).then(res=>{
        this.tableData=res.data;
        this.data2=res.data.regionTreeBasedIdDTOs;
        this.data3=res.data.departmentStructureDTOS;
        this.formData1=res.data.organizationBankAccounts;
        this.formData2=res.data.organizationInvoiceInfos  
        let form =res.data.organizationLogDTOS;
        this.formData=form;
      })
    },
    activated(){
       if(this.ID!=this.$route.query.id){
        findOrganizationDetail(this.$route.query.id).then(res=>{
        this.tableData=res.data;
        this.data2=res.data.regionTreeBasedIdDTOs;
        this.data3=res.data.departmentStructureDTOS;
        this.formData1=res.data.organizationBankAccounts;
        this.formData2=res.data.organizationInvoiceInfos  
        let form =res.data.organizationLogDTOS;
        this.formData=form;
      })
       }
    },
    methods: {
      //		获取选中得node 和 key
      getnode(data) {
        let yeziId = this.$refs.tree.getCheckedKeys(true)
        let idArr = this.$refs.tree.getCheckedKeys()
        let i = this.$refs.tree.getCheckedNodes(true,true)
        this.options=i
        this.$refs.tree2.filter(idArr);
      },
      filterNode(value, data) {
        if(!value) return true;
        return value.includes(data.id);
      },
      //审核通过
      toAduiter(row){
        getStatusCheck(this.$route.query.id).then(res=>{
          if(res.data==1){
           gotoPass(this.$route.query.id).then(res=>{
          if(res.success==true){
            this.$message({
              message:'审核通过',
              type:'success'
            })
            timer= setTimeout(()=>{
              this.close({name:'AduiterOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}});
              window.localStorage.setItem("ORGANIZATION_LIST", Date.now());
            },1000)
            timer();
          }else if(res.success==false){
            this.$message({
              message:res.message,
              type:'error'
            })
          timer1=setTimeout(()=>{
              this.close({name:'AduiterOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}});
            },1000)
            timer1();
          }
        })
          }else{
            this.$confirm('当前数据状态已发生变化，请刷新获取最新数据', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
           }).then(res=>{
            this.close({name:'AduiterOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}});
          }).catch(()=>{      
         })
          }
        })
      },
      //驳回成功
      toSuccess(){
      //  let strr= this.status=='DRAFT'?0:this.status=='PENDING_REVIEW'?1:this.status=='REJECTED'?2:''; 
       getStatusCheck(this.$route.query.id).then(res=>{
        if(res.data==1){
         this.dialogFormVisible=false;
        gotoReject(this.$route.query.id,this.reviewRejectParam).then(res=>{
          if(res.success==true) {
            this.$message({
              message: '驳回成功',
              type: 'success'
            })
            timer2 = setTimeout(() => {
              this.close({name:'AduiterOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}});
            }, 1000)
            timer2();
          }else if(res.data==false){
            this.$message({
              message:res.message,
              type:'error'
            })
            timer3 = setTimeout(() => {
              this.close({name:'AduiterOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}});
            }, 1000)
            timer3();
          }
        })
        }else{
          this.dialogFormVisible=false;
           this.$confirm('当前数据状态已发生变化，请刷新获取最新数据', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
           }).then(res=>{
            this.close({name:'AduiterOrganization',to:{name:'OrganizationManage',params:{isUpdate:true}}});
          }).catch(()=>{      
         })
        }
       })    
      },
      //驳回
      aduiterNoPass(){
        // let strr= this.status=='DRAFT'?0:this.status=='PENDING_REVIEW'?1:this.status=='REJECTED'?2:'';
        getStatusCheck(this.$route.query.id).then(res=>{
          if(res.data==1){
          this.dialogFormVisible=true;
          }else{
            this.$confirm('当前数据状态已发生变化，请刷新获取最新数据', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
           }).then(res=>{
            this.close()
          }).catch(()=>{      
         })
          }
        })
      }
    },
    
    destroyed(){
      clearTimeout(this.timer)
      clearTimeout(this.timer1)
      clearTimeout(this.timer2)
      clearTimeout(this.timer3)
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
    .detaillTable3 {
    border: 1px solid #d1d1d1;
    .detaillTopBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #d1d1d1;
      span {
        line-height: 50px;
        margin-left: 10px;
      }
    }
    table {
      width: 90%;
      margin: 20px auto;
      .classifyBox {
        max-height: 51px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        width: 264.5%;
      }
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 14px;
        height: 53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        color: #303133;
        text-align: right;
        width: 10%;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 40%;
      }
    }
  }
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;

      box-sizing: border-box;
      .listLeftBox{
        position: relative;
        background-color: #FFFFFF;
        border: 1px solid #e5e5e5;
        margin-right: 20px;
        height:300px;
        width: 40%;
        margin-left: 50px;
        margin-top: 20px;
        .headerBox{
          z-index: 5;
          height: 35px;
          border-bottom: 1px solid #e4e4e4;
          text-align: center;
          span{
            color: red;
            line-height: 36px;
          }
        }
        .lltree{
          width: 100%;
          height: 263px;
          box-sizing: border-box;

          overflow: auto;
        }
      }
      .listRightBox{
        border: 1px solid #e5e5e5;
        height:300px;
        width: 40%;
        overflow: auto;
        margin-right: 50px;
        margin-top: 20px;
        /*padding: 0 10px;*/
        .headerBox{
          height: 35px;
          border-bottom: 1px solid #e4e4e4;
          text-align: center;
          span{
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }
        .lltree{
          width: 100%;
          height: 263px;
          box-sizing: border-box;

          overflow: auto;
        }

      }

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


<style lang="less" scoped>
  .detaillBox{
    .el-dialog__header{
      padding: 10px;
      padding-bottom: 0;
      background: #E4E4E4;
      height: 40px;
      line-height: 40px;
    }
  }
</style>

