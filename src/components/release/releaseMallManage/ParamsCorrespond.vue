<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="iconfont iconsousuo"></i>筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer;margin-right:10px">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}</span>
          <el-button size="small" class="w80 h40" @click="queryBrand1()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-if="isShow">
        <span>对方参数名称：</span>
        <el-input
          placeholder="对方参数名称"
          v-model="FindMallAttributeListParam.partyCAttributeName"
          clearable>
        </el-input>
        <span>领先参数名称：</span>
        <!-- <el-input
          placeholder="领先参数名称"
          v-model="FindMallAttributeListParam.attributeName"
          clearable>
        </el-input> -->
       <el-select
          v-model="FindMallAttributeListParam.nameCN"
          filterable
          remote
          reserve-keyword
          placeholder="领先参数名称"
          :remote-method="remoteMethod"
          :loading="loading1">
          <el-option
            v-for="item in options4"
            :key="item.name"
            :label="item.label"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>数据列表</span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="toCreateParamsCorrespond()"><i class="iconfont icon-icon-test"></i>添加</div>
          <div class="white-btn fun-btn" @click="toParamsCorrespondRecord('SysOperationRecord',{id:mallID,type:'mall-params-operation-record',mallName:mallName})"><i class="iconfont icon-icon-test"></i>操作记录</div>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            prop="partyCMatchedLevelCode"
            label="对方品目编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyCAttributeName"
            label="对方参数名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="attributeName"
            label="领先参数名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="category"
            label="参数所在领先分类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="客户参数编号"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small"  @click="toDeleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="FindMallAttributeListParam.pageNum"
          :page-size="FindMallAttributeListParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="paginations.total"
          background>
        </el-pagination>
      </div>
    </div>
    <div class="paramsCorrespondBox">
      <el-dialog title="添加参数对应关系" :visible.sync="dialogFormVisible2" v-el-drag-dialog width="40%">
        <el-form :model="CreateMallAttributeParam" :rules="rules" ref="CreateMallAttributeParam" class="demo-ruleForm">
          <el-form-item label="客户参数编号：" :label-width="formLabelWidth">
            <el-input v-model="CreateMallAttributeParam.partyCAttributeCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户参数名称：" :label-width="formLabelWidth" prop="partyCAttributeName">
            <el-input v-model="CreateMallAttributeParam.partyCAttributeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="领先参数编号：" v-if="false" :label-width="formLabelWidth" placeholder="字数长度1~20字以内">
            <el-input v-model="CreateMallAttributeParam.attributeId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="领先参数名称：" :label-width="formLabelWidth" prop="attributeName" placeholder="字数长度1~20字以内">
            <!-- <el-input v-model="CreateMallAttributeParam.mallCategoryMatchId" v-if="false" autocomplete="off"></el-input> -->
        <el-select
          v-model="CreateMallAttributeParam.attributeName"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="领先参数名称"
          :remote-method="remoteMethod"
          @change="getAttributeID"
          @clear="clearAttribute"
          :loading="loading1">
          <el-option
            v-for="item in options4"
            :key="item.name"
            :label="item.label"
            :value="item.name">
          </el-option>
        </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('CreateMallAttributeParam')">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog
      title="删除提示"
      :visible.sync="dialogVisible3"
      width="30%"
      class="paramsCorrespondBox"
      top="40vh"
    >
      <span>删除之后，此参数对应关系解除确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible3 = false">取 消</el-button>
    <el-button type="primary" @click="isDeleteParams()">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>
<script>
  import store from '@/store/store';
  import {toAuditList,passedBrandList,noPassBrandList,draftBrandList,getBrandStatus,deleteBrandID,getBrandDetail,
    toAuditBrand,batchImport,remoteBrandName,queryBrand,checkName} from '@/api/brandManage'
  import {paramsCorrespondList,delParamsRelation,findParamsName,addParamsRelation} from '@/api/release/mallProjectManage'
  import { parseTime } from '@/utils';
  import elDragDialog from '@/directive/el-dragDialog'
  export default {
    inject: ['reload','close'],
    name: "ParamsCorrespond",
    data() {
      return {
        isShow: true,
        screenGoods: '收起筛选',
        screenBrand: '展开筛选',
        loading1:false,
        tableData: null,
        options4:null,
        //商城id
        mallID:null,
        //商城名字
        mallName:null,
        //删除id
        delID:'',
        //客户三级分类品目id
        itemID:null,
        //领先三级分类id
        categoryId:null,
        FindMallAttributeListParam: {
          pageNum: 1,
          pageSize: 10,
          attributeName:null,//领先参数名称
          mallCategoryMatchId:null,//品目对应id
          partyCAttributeName:null,//对方参数名称
        },
        paginations: {
          total: 0,//总数
        },
        dialogFormVisible2:false,
        dialogVisible3:false,
        CreateMallAttributeParam:{
          attributeId:'',//领先参数id
          mallCategoryMatchId:null,//品目对应id
          partyCAttributeCode:'',//客户参数编号
          partyCAttributeName:'',//客户参数名称
          sort:'',//客户参数排序
          attributeName:''
        },
        formLabelWidth:'160px',
        rules:{
          partyCAttributeName:[{required:true,message:'客户参数名称不能为空',trigger:'blur'}],
          attributeName:[{required:true,message:'领先参数名称不能为空',trigger:'blur'}]
        },
      }
    },
    computed:{
    },
    directives:{
      elDragDialog
    },
    created() {
      this.mallID=this.$route.query.mallID
      this.mallName=this.$route.query.mallName
      this.categoryId=this.$route.query.categoryId
      this.FindMallAttributeListParam.mallCategoryMatchId=this.$route.query.itemID
      //获取表格数据
      this.getTableData();
    },
    activated(){
      if(this.$route.query.mallID&&this.mallID!=this.$route.query.mallID){
        this.mallID=this.$route.query.mallID
        this.mallName=this.$route.query.mallName
        this.categoryId=this.$route.query.categoryId
        this.FindMallAttributeListParam.mallCategoryMatchId=this.$route.query.itemID
        this.getTableData()
      }
      if(this.$route.params.isUpdate){
        this.getTableData()
      }
    },
    mounted(){
     this.itemID=this.$route.query.itemID
    },
    methods: {
      reset(){
        this.FindMallAttributeListParam={
          pageNum: 1,
          pageSize: 10,
          attributeName:null,//领先参数名称
          mallCategoryMatchId:null,//品目对应id
          partyCAttributeName:null,//对方参数名称
        };
        this.getTableData();
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading1 = true;
          findParamsName(this.categoryId,{attributeName:query}).then(res=>{
            if(res.code=='000000'){
              this.options4=res.data;
              this.loading1=false;
            }
          })
        } else {
          this.options4 = [];
        }
      },
      getAttributeID(val){
      let aaa=JSON.parse(JSON.stringify(this.options4));
      aaa=aaa.filter(item=>{
        return item.name==val
      })
      this.CreateMallAttributeParam.attributeId=aaa[0].id;
      this.CreateMallAttributeParam.attributeName=aaa[0].name;
      },
      clearAttribute(){
       this.CreateMallAttributeParam.attributeName=''
      },
      //获取表格数据
      getTableData(){
        paramsCorrespondList(this.FindMallAttributeListParam).then(res=>{
          this.tableData=res.data.items;
          this.paginations.total=res.data.total;
          this.FindMallAttributeListParam.pageNum=res.data.pageNum;
          this.FindMallAttributeListParam.pageSize=res.data.pageSize;
        })
      },
      //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
      queryBrand1(){
        this.getTableData();
      },
      handleCurrentChange(val) {
        this.FindMallAttributeListParam.pageNum=val;
        this.getTableData()
      },
      handleSizeChange(val) {
        this.FindMallAttributeListParam.pageSize=val;
        this.getTableData()
      },
      //筛选按钮
      showHelp() {
        this.isShow = !this.isShow;
      },
      //打开添加弹框
      toCreateParamsCorrespond(){
        this.dialogFormVisible2=true;
      },
      //跳转到参数对应操作记录
      toParamsCorrespondRecord(name,query){
        //  const {href}=this.$router.resolve({
        //    name:'SysOperationRecord',
        //    query:query
        //  })
        // window.open(href,'_blank')
        this.$router.push({name:'SysOperationRecord',query:query})
      },
      //删除提示
      toDeleteItem(row){
         this.dialogVisible3=true;
         this.delID=row.id;
      },
      //是否删除
      isDeleteParams(){
        delParamsRelation(this.delID).then(res=>{
          if(res.code='000000'){
            this.$message({
              message:'删除成功',
              type:'success'
            })
            this.dialogVisible3=false;
          }
        }).then(res=>{
          this.getTableData();
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.CreateMallAttributeParam.mallCategoryMatchId= Number(this.itemID);
            addParamsRelation(this.CreateMallAttributeParam).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message:'添加参数对应关系成功',
                  type:'success'
                })
                this.dialogFormVisible2=false;
              }
            }).then(res=>{
              this.getTableData();
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped lang="less">
  .brandBox {
    width: 100%;
    clear: both;
    .buttonBox {
      margin-top: 10px;
      .el-button {
        width: 160px;
        height: 30px;
      }
      .active{
        background: #339999;
        color: #fff;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        float: right;
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 0;
      }
      .homeBoxBottom {
        height: 56px;
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 200px;
          height: 40px;
          line-height: 56px;
          margin-left: 10px;
        }
        .el-select{
          margin-left: 10px ;
        }
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      line-height: 50px;
      .listBoxTop {
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .white-btn{
          margin-top: 10px;
          margin-right: 10px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>


<style lang="less" scoped>
  .paramsCorrespondBox{
    .el-dialog__header{
      padding: 10px;
      padding-bottom: 0;
      background: #E4E4E4;
      height: 50px;
      line-height: 50px;
    }
    .el-dialog__body{
      font-size: 16px;
    }
    .el-form{
      .el-form-item{
        .el-input{
          width: 400px;
          margin-top: 10px;
        }
        margin-bottom: 10px;
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #339999;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
        }
        .avatar {
          width: 120px;
          height: 120px;
          display: block;
        }
        .el-textarea {
          width: 400px;
        }
        .el-form-item__error{
          color: #f56c6c;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 20px;
        }
        .el-form-item__label{
          width: 140px !important;
        }
        .textBox{
          width: 400px;
        }
      }
    }
  }
</style>









