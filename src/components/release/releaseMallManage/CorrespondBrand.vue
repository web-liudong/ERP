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
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
        <span>对方品牌名称：</span>
        <el-input
          placeholder="对方品牌名称"
          v-model="FindMallBrandMatchListParam.partyCBrandName"
          clearable>
        </el-input>
        <span>领先品牌名称：</span>
        <el-select
          v-model="FindMallBrandMatchListParam.nameCN"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="领先品牌名称"
          :remote-method="remoteMethodBrandName"
          @change="getBrandID"
          @clear="clearBrandID"
          :loading="loading2">
          <el-option
            v-for="item in options5"
            :key="item.nameCN"
            :label="item.label"
            :value="`${item.nameCN}${item.nameEN}`">
          </el-option>
        </el-select>
        <!-- <el-input
          placeholder="领先品牌名称"
          v-model="FindMallBrandMatchListParam.brandName"
          clearable>
        </el-input> -->
        <span>
         领先品牌编号：
       </span>
        <el-input
          placeholder="领先品牌编号"
          v-model="FindMallBrandMatchListParam.brandId"
          clearable>
        </el-input>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>数据列表</span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="toClearData()"><i class="iconfont icon-icon-test"></i>清空数据</div>
          <div class="white-btn fun-btn" @click="toCreateBrand()"><i class="iconfont icon-icon-test"></i>添加</div>
          <div class="white-btn fun-btn" @click="toItemCorrespond('importFile')"><i class="iconfont icon-icon-test"></i>导入</div>
          <div class="white-btn fun-btn" @click="toBrandImportRecord('SysImportRecord',{id:mallId,type:'mall-brand-import-list'})"><i class="iconfont icon-icon-test"></i>导入记录</div>
          <div class="white-btn fun-btn" @click="toBrandImportRecord('SysOperationRecord',{id:mallId,type:'mall-brand-operation-record',mallName:''})"><i class="iconfont icon-icon-test"></i>操作记录</div>
        </div>
        <el-table
          :data="tableData"
          :max-height="dataListHeight"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            prop="partyCBrandCode"
            label="对方品牌编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyCBrandName"
            label="对方品牌名称"
            align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0"> {{scope.row.partyCBrandName}}</span>
              <!--<span style="font-size: 12px;margin-left: 0" v-if="(scope.row.nameEN)!=0">({{scope.row.nameEN}})</span>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="领先品牌名称"
            align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0"> {{scope.row.brandName}}</span>
              <!--<span style="font-size: 12px;margin-left: 0" v-if="(scope.row.nameEN)!=0">({{scope.row.nameEN}})</span>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="brandId"
            label="领先品牌编号"
            align="center">
            <template slot-scope="scope">
              {{scope.row.brandId}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small"  @click="toDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
    </div>
    <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="FindMallBrandMatchListParam.pageNum"
          :page-size="FindMallBrandMatchListParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="paginations.total"
          background>
        </el-pagination>
      </div>
    <el-dialog
      title="数据锁定提示"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <span>用户[ {{infoMessage}} - {{infoRealName}} ]正在编辑该条数据，数据已锁定。</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="isDelBrandID()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="清空数据提示"
      :visible.sync="dialogVisible2"
      width="30%"
    >
      <span>确定清空部对应关系，清空后此项目不再有品牌对应？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="isClearData()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="dialogVisible"
      width="30%"
      class="brandCorrespondBox"
    >
      <span>删除之后，此品牌对应关系解除确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="isDelete()">确 定</el-button>
  </span>
    </el-dialog>
     <div class="brandCorrespondBox">
       <el-dialog title="添加品牌对应关系" :visible.sync="dialogFormVisible2" v-el-drag-dialog width="40%">
         <el-form :model="CreateMallBrandParam" :rules="rules" ref="CreateMallBrandParam" class="demo-ruleForm" label-width="200px">
           <el-form-item label="客户品牌名称：" :label-width="formLabelWidth" prop="partyCBrandName">
             <el-input v-model="CreateMallBrandParam.partyCBrandName" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="客户品牌编号：" :label-width="formLabelWidth">
             <el-input v-model="CreateMallBrandParam.partyCBrandCode" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="领先品牌编号：" v-if="false" :label-width="formLabelWidth">
             <el-input v-model="CreateMallBrandParam.brandId" autocomplete="off"></el-input>
           </el-form-item>
           <el-form-item label="领先品牌名称：" :label-width="formLabelWidth" prop="brandId">
             <el-select
               v-model="CreateMallBrandParam.brandId"
               filterable
               remote
               reserve-keyword
               placeholder="输入领先品牌名称"
               :remote-method="remoteMethod"
               :loading="loading1"
               style="width: 400px"
               clearable
               @clear="clearName"
               @change="getUSERNAME">
               <el-option
                 v-for="item in options4"
                 :key="item.nameCN"
                 :value ="item.id"
                 :label="`${item.nameCN}${item.nameEN}`">
               </el-option>
             </el-select>
           </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button @click="dialogFormVisible2 = false">取 消</el-button>
           <el-button type="primary" @click="submitForm('CreateMallBrandParam')">保存</el-button>
         </div>
       </el-dialog>
        <importFile
        ref="importFile"
        :title="'品牌信息导入'"
        :type="importType"
         @callback="dialogCallback"
         :params="{mallId:mallId}"
      ></importFile>
     </div>

  </div>
</template>
<script>
  import store from '@/store/store';
  import {toAuditList,passedBrandList,noPassBrandList,draftBrandList,getBrandStatus,deleteBrandID,getBrandDetail,
    toAuditBrand,batchImport,remoteBrandName,queryBrand,checkName} from '@/api/brandManage'
  import {addMallBrand,brandCorrespondList,delMallBrand,clearMallBrand} from '@/api/release/mallProjectManage'
  import { parseTime } from '@/utils';
  import elDragDialog from '@/directive/el-dragDialog'
  import importFile from "@/components/common/module/ImportFile";
  export default {
    inject: ['reload','close'],
    name:'CorrespondBrand',
    data() {
      return {
        mallId:null,
        restaurants: [],
        state4: '',
        timeout:  null,
        isShow: true,
        screenGoods: '收起筛选',
        screenBrand: '展开筛选',
        loading1:false,
        loading2:false,
        tableData: null,
        infoRealName:'',
        importType: "brand-correspond-import",
        options4:null,
        options5:null,
        //错误提示消息
        infoMessage:'',
        FindMallBrandMatchListParam: {
          pageNum: 1,
          pageSize: 10,
          brandId:null,
          brandName:null,
          mallId:null,
          partyCBrandName:null,//对方品牌名称
        },
        paginations: {
          total: 100,//总数
        },
        //删除的对方id
        DeleteID:'',
        //清空id
        clearID:'',
        dialogVisible:false,
        dialogVisible1:false,
        dialogVisible2:false,
        //添加品牌对话框
        dialogFormVisible2:false,
        CreateMallBrandParam:{
          brandId:'',
          mallId:null,
          partyCBrandCode:'',
          partyCBrandName:'',
       },
        rules:{
          partyCBrandName:[{required:true,message:'客户品牌名称不能为空',trigger:'blur'}],
          brandId:[{required:true,message:'领先品牌名称不能为空',trigger:'blur'}],
            
        },
        formLabelWidth: '160px',
      }
    },
    computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
    components:{
     importFile
    },
    directives:{
      elDragDialog
    },
    created() {
      this.mallId=this.$route.query.BrandId;
      this.FindMallBrandMatchListParam.mallId=this.$route.query.BrandId;
      this.CreateMallBrandParam.mallId=this.$route.query.BrandId;
      //获取表格数据
      this.getTableData();
    },
    activated(){
     if(this.$route.query.BrandId&&this.mallId!=this.$route.query.BrandId){
       this.mallId=this.$route.query.BrandId;
       this.FindMallBrandMatchListParam.mallId=this.$route.query.BrandId;
       this.CreateMallBrandParam.mallId=this.$route.query.BrandId;
      //获取表格数据
       this.getTableData();
     }
    },
    mounted() {
      //this.restaurants = this.loadAll();
    },
    methods: {
      reset(){
       this.FindMallBrandMatchListParam= {
          pageNum: 1,
          pageSize: 10,
          brandId:null,
          brandName:null,
          mallId:null,
          partyCBrandName:null,//对方品牌名称
        };
        this.getTableData()
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading1 = true;
          let aa={name:query};
          remoteBrandName(aa).then(res=>{
            if(res.code=='000000'){
              this.options4=res.data;
              this.loading1=false;
            }
          })
        } else {
          this.options4 = [];
        }
      },
      dialogCallback(){

      },
      //点击选中的选项
      getUSERNAME(val){
        // let aaa=JSON.parse(JSON.stringify(this.options4))
        // aaa = aaa.filter(item=>{
        //   return (item.nameCN+item.nameEN+'')==val
        // })
        // console.log(aaa,888)
        this.CreateMallBrandParam.name=val;
        // this.CreateMallBrandParam.brandId=aaa[0].id
      },
      
      clearName(){
      //  this.CreateMallBrandParam.name='';
       this.CreateMallBrandParam.brandId='';
      },
      //去清空数据
      toClearData(row){
        //this.clearID=row.id;
        this.dialogVisible2=true;
      },
      //是否清空
      isClearData(){
        clearMallBrand(this.mallId).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:'清空数据成功',
              type:'success'
            })
            this.dialogVisible2=false
          }
        }).then(res=>{
          this.getTableData()
        })
      },
      //远程搜索
      remoteMethodBrandName(query) {
        if (query !== '') {
          this.loading2 = true;
          let aa={name:query};
          remoteBrandName(aa).then(res=>{
            if(res.code=='000000'){
              this.options5=res.data;
              this.loading2=false;
            }
          })
        } else {
          this.options5 = [];
        }
      },
      getBrandID(val){
        let bbb=JSON.parse(JSON.stringify(this.options5))
         bbb= bbb.filter(item=>{
          return (item.nameCN+item.nameEN+'')==val
        })
        this.FindMallBrandMatchListParam.brandId=bbb[0].id
      },
      clearBrandID(){
       this.FindMallBrandMatchListParam.brandId=''
      },
      //获取表格数据
      getTableData(){
        brandCorrespondList(this.FindMallBrandMatchListParam).then(res=>{
          this.tableData=res.data.items;
          this.paginations.total=res.data.total;
          this.FindMallBrandMatchListParam.pageNum=res.data.pageNum;
          this.FindMallBrandMatchListParam.pageSize=res.data.pageSize;
        })
      },
      //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
      queryBrand1(){
        this.FindMallBrandMatchListParam.pageNum=1;
        this.getTableData();
      },
      handleCurrentChange(val) {
        this.FindMallBrandMatchListParam.pageNum=val;
        this.getTableData()
      },
      handleSizeChange(val) {
        this.FindMallBrandMatchListParam.pageSize=val;
        this.getTableData()
      },
      toDelete(row){
        this.DeleteID=row.id
        this.dialogVisible=true;
      },
      isDelete(){
        delMallBrand(this.DeleteID).then(res=>{
         if(res.code=='000000'){
           this.$message({
             message:'删除成功',
             type:'success'
           })
            this.dialogVisible=false
         }
        }).then(res=>{
          this.getTableData();
        })
      },
     toItemCorrespond(type,row){
      this.$refs[type].init(row)
     },
      //筛选按钮
      showHelp() {
        this.isShow = !this.isShow;
      },
      //跳转到品牌导入记录
      toBrandImportRecord(name,query){
        // const {href}=this.$router.resolve({
        //   name:name,
        //   query:query
        // })
        // window.open(href,'_blank')
        this.$router.push({name:name,query:query})
      },
      //打开添加品牌得对话框
      toCreateBrand(){
         this.dialogFormVisible2=true;
      },
      //保存
      submitForm(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            addMallBrand(this.CreateMallBrandParam).then(res=>{
             if(res.code=='000000'){
               this.$message({
                 message:'新增品牌对应成功',
                 type:'success'
               })
             this.dialogFormVisible2=false
             }
            }).then(res=>{
              this.getTableData();
            })
          }
        })
      }
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
        .el-autocomplete{
         margin-left: 10px;

          position: relative;
          i{
            color: #c0c4cc;
            font-size: 14px;
            cursor: pointer;
            position: absolute;
            top: 13px;
            right: 4px;
          }
        }
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      .listBoxTop {
        line-height: 50px;
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
      margin-top: 5px;
      text-align: right;
    }
  }
</style>


<style lang="less" scoped>
  .brandCorrespondBox{
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
          // width: 140px !important;
        }
        .textBox{
          width: 400px;
        }
      }
    }
  }
</style>












