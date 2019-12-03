<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1" v-if="tableData!=null">
        <tr>
          <th>品牌编号：</th>
          <td>{{tableData.no}}</td>
          <th>品牌状态：</th>
           <td>{{tableData.statusName}}  <br/> {{tableData.reviewLogOpinion}}</td>
        </tr>
        <tr>
          <th><i>*</i>品牌中名：</th>
          <td>{{tableData.nameCN}}</td>
          <th><i>*</i> 注册号/申请号：</th>
           <td>{{tableData.registeredNo}}</td>
        </tr>
        <tr>
          <th><i>*</i>品牌英文名：</th>
           <td>{{tableData.nameEN}}</td>
          <th><i>*</i>品牌管理员：</th>
          <td>{{userName}} - {{realName}}</td>
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
          <th>品牌logo：</th>
          <td><img :src="tableData.filePathDTO.path" v-if="tableData.filePathDTO!=null" alt="" style="width:80px;height:80px;"></td>
          <th>品牌简介：</th>
           <td>{{tableData.description}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
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
            <!-- {{`${scope.row.operation}  ${scope.row.description}`}} -->
            {{scope.row.operation}}
            <br/>
            {{scope.row.description}}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" v-back-top>回顶部</el-button>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" @click="auditNopassed()">驳回</el-button>
      <el-button type="primary" @click="audited()">审核通过</el-button>
      

    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible" class="rejectBox">
      <el-form :model="ReviewRejectBrandParam" :rules="rules" ref="ReviewRejectBrandParam">
        <el-form-item label="驳回原因" label-width="120px" prop="description">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="1~200字以内"
            v-model="ReviewRejectBrandParam.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAudite()">取 消</el-button>
        <el-button type="primary" @click="toSuccess('ReviewRejectBrandParam')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getBrandDetail,AuditSuccess,auditError,checkAuditer} from '@/api/brandManage'
  import addhead from '@/components/common/head/head'
  export default {
    inject:['close'],
    name: "BrandAudit",
    data(){
      return {
        tableData: null,
        formData:null,
        ID:null,
        dialogFormVisible: false,
        ReviewRejectBrandParam: {
          description: '',
        },
        userName:'',
        realName:'',
        rules:{
          description:[{required:true,message:'驳回原因不能为空',trigger:'blur'},{min:1,max:200,message:'驳回原因字数长度不能超过200字',trigger:'change'}]
        }
      }
    },
    components:{
     addhead
    },
    activated(){
      if(this.ID!=this.$route.query.id){
        this.ID=this.$route.query.id;
        this.getBrandList()
      }
    },
    created(){
      this.ID=this.$route.query.id;
      this.getBrandList();
    },
    methods: {
      cancelAudite(){
       this.dialogFormVisible=false;
       this.ReviewRejectBrandParam.description='';
      },
      mapdata(){
         this.tableData.nameCN= this.tableData.nameCN.replace(/\s/g,"\u00a0")
         this.tableData.nameEN= this.tableData.nameEN.replace(/\s/g,"\u00a0")
      },
      //获取审核详情的信息
       getBrandList(){
         getBrandDetail(this.ID).then(res=>{
           this.tableData=res.data;
          if(this.tableData.filePathDTO!=null){
           this.tableData.filePathDTO.path='https://lxerptest.66123123.com/image'+this.tableData.filePathDTO.path
           }
           if(res.data.userDTO!=null){
             this.realName=res.data.userDTO.realName
             this.userName=res.data.userDTO.userName
           }
            this.mapdata()  
           let form =res.data.brandOperationLogList;
           console.log(form);
           this.formData=form;
         })
       },
      //审核通过
      audited(){
        checkAuditer(this.ID).then(res=>{
          if(res.data!=this.tableData.status){
            this.$confirm('当前数据状态已发生变化，请刷新获取最新数据', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
         }).then(res=>{
            this.close({name:'BrandAudit',to:{name:'Brand',params:{isUpdate:true}}})
         }).catch(()=>{
          
         })
          }else{
            AuditSuccess(this.ID).then(res=>{
          if(res.data==1){
            this.$message({
              message:'审核通过',
              type:'success',
            })
            // let timer=setTimeout(()=>{
            //    this.closeBrandAudit();
            // },1000)
            // this.$router.push({name:'BrandAudit',query:{id:this.ID}})
            this.close({name:'BrandAudit',to:{name:'Brand',params:{isUpdate:true},query:{id:this.ID}}})
          }
        })
          }
        })   
      },
      //审核不通过 ，驳回
      auditNopassed(){
        checkAuditer(this.ID).then(res=>{
           if(res.data!=this.tableData.status){
             this.$confirm('当前数据状态已发生变化，请刷新获取最新数据', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
           }).then(res=>{
            this.close({name:'BrandAudit',to:{name:'Brand',params:{isUpdate:true}}})
          }).catch(()=>{
          
         })
           }else{
            this.dialogFormVisible = true;
           }
        })
        
      },
      //点击确定
      toSuccess(formName){
        checkAuditer(this.ID).then(res=>{
          if(res.data!=this.tableData.status){
             this.dialogFormVisible=false;
             this.$confirm('当前数据状态已发生变化，请刷新获取最新数据', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
           }).then(res=>{
            this.close({name:'BrandAudit',to:{name:'Brand',params:{isUpdate:true}}})
          }).catch(()=>{
          
         })
          }else{
           this.$refs[formName].validate((valid)=>{
         if(valid){
           this.dialogFormVisible=false;
           auditError(this.ID,this.ReviewRejectBrandParam).then(res=>{
          console.log(res);
          if(res.data==1){
            this.$message({
              message:'驳回成功',
              type:'success',
            })
            this.close({name:'BrandAudit',to:{name:'Brand',params:{isUpdate:true}}})
          }
          })
         }
        })
          }
        })
        
        
      },
    },
    
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
          word-break: break-all;
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

<style  lang="less" scoped>
.detaillBox{
  .rejectBox{
    .el-dialog__header{
      padding: 10px;
      // padding-bottom: 0;
      background: #E4E4E4;
      height: 40px;
      line-height: 40px;
    }
  }
}

</style>