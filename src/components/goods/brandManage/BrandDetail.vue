<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1" v-if="tableData!=null">
        <tr>
          <th>品牌编号：</th>
          <td>{{tableData.no}}</td>
          <th>品牌状态：</th>
          <td>{{tableData.statusName}} <br/> {{tableData.reviewLogOpinion}}</td>
        </tr>
        <tr>
          <th>品牌中文名：</th>
           <td>{{tableData.nameCN}}</td>    
          <th><i>*</i> 注册号/申请号：</th>
          <td style="max-width:500px">{{tableData.registeredNo}}</td>
        </tr>
        <tr>
          <th>品牌英文名：</th>
           <td>{{tableData.nameEN}}</td>
          <th>品牌管理员：</th>
          <td v-if="managerName!=null">{{managerName.userName}} - {{managerName.realName}}</td>
        </tr>
        <tr>
          <th><i>*</i>商标申请人：</th>
          <td colspan="3">{{tableData.registrant}}</td>
        </tr>
        <tr>
          <th><i>*</i> 经营分类：</th>
          <td colspan="3"  >
           <!-- <el-tooltip :content="tableData.categoryNames" effect="dark" placement="top-start">{{tableData.categoryNames}}</el-tooltip>-->
           {{tableData.categoryNames}}
          </td>
        </tr>
        <tr>
          <th>品牌logo：</th>
          <td><img :src="tableData.filePathDTO.path" v-if="tableData.filePathDTO!=null" alt="" style="width:80px;height:80px;" @click="dialogVisible=true"></td>
          <th>品牌简介：</th>
           <td>{{tableData.description}}</td>
        </tr>
      </table>
      <el-dialog :visible.sync="dialogVisible" v-if="tableData.filePathDTO!=null">
               <img width="100%" :src="tableData.filePathDTO.path" alt="">
      </el-dialog>
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
            {{scope.row.operation}}
            <br/>
            {{scope.row.description}}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" v-back-top>返回顶部</el-button>
      <el-button type="primary" @click="closed()">关闭</el-button>
    </div>
  </div>

</template>
<script>
  import {getBrandDetail} from '@/api/brandManage'
  import addhead from '@/components/common/head/head'
  import {addURL} from '@/utils/index'
  export default {
    inject:['close'],
    name:"BrandDetail",
    data(){
      return {
        tableData: null,
        formData:null,
        ID:null,
        tableData22:null,
        managerName: {
          userName:'',
          realName:''
        },
        dialogVisible:false
      }
    },
    methods: {
    closed(){
      this.close({name:'BrandDetail',to:{name:'Brand',params:{isUpdate:true}}})
    },
    mapdata(){
         this.tableData.nameCN= this.tableData.nameCN.replace(/\s/g,"\u00a0")
         this.tableData.nameEN= this.tableData.nameEN.replace(/\s/g,"\u00a0")
    },
    },
    components:{
     addhead
    },
    created(){
      this.ID=this.$route.query.id;
      getBrandDetail(this.ID).then(res=>{
       this.tableData=res.data;
        if(this.tableData.filePathDTO!=null){
         this.tableData.filePathDTO.path=addURL(this.tableData.filePathDTO.path)
           }
        this.mapdata()   
        let form =res.data.brandOperationLogList;
         this.formData=form;
         this.managerName=res.data.userDTO;
      })
    },

    activated(){
      if(this.ID!=this.$route.query.id){
        getBrandDetail(this.ID).then(res=>{
       this.tableData=res.data;
        if(this.tableData.filePathDTO!=null){
         this.tableData.filePathDTO.path=addURL(this.tableData.filePathDTO.path)
           }
        this.mapdata()   
        let form =res.data.brandOperationLogList;
         this.formData=form;
         this.managerName=res.data.userDTO;
      })
      }
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
          word-break: break-all
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



<style lang="less">
.detaillBox{
 .detaillTable{
   .el-dialog{
     margin-top:0vh !important;
     .el-dialog_header{
       padding:0px;
     }
     .el-dialog_body{
       padding:0px;
     }
   }
 }

}

</style>


