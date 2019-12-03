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
        <span>客户品目名称：</span>
        <el-input
          placeholder="客户品目名称"
          v-model="findMallCategoryListParam.categoryName"
          clearable>
        </el-input>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>数据列表</span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="toClearData()"><i class="iconfont icon-dianzhongdefenlei"></i>清空数据</div>
          <div class="white-btn fun-btn" @click="importParamsCorrespond('importFile1')"><i class="iconfont icondaoru"></i>参数导入</div>
          <div class="white-btn fun-btn" style="width: 140px" @click="toItemCorrespondRecord('SysImportRecord',{id:mallID,type:'mall-params-import-list'})"><i class="iconfont icon-dianzhongdefenlei"></i>参数导入记录</div>
          <div class="white-btn fun-btn" @click="toCreateItem()"><i class="iconfont icon-icon-test"></i>添加</div>
          <div class="white-btn fun-btn" @click="toImport('importFile')"><i class="iconfont icondaoru"></i>导入</div>
          <div class="white-btn fun-btn" @click="toItemCorrespondRecord('SysImportRecord',{id:mallID,type:'mall-item-import-list'})"><i class="iconfont icon-dianzhongdefenlei"></i>导入记录</div>
          <div class="white-btn fun-btn" @click="toItemOperationRecord('SysOperationRecord',{id:mallID,type:'mall-item-operation-record',mallName:projectName})"><i class="iconfont icon-dianzhongdefenlei"></i>操作记录</div>
        </div>
        <el-table
          :data="tableData"
          :max-height="dataListHeight"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            prop="partyCMatchedLevelCode"
            label="客户品目编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyCFirstLevelName"
            label="客户一级品目名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyCSecondLevelName"
            label="客户二级品目名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="partyCThirdLevelName"
            label="客户三级品目名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="对应领先分类"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.firstLevelName}}>{{scope.row.secondLevelName}}>{{scope.row.thirdLevelName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="partyCMatchedLevelMaterialNo"
            label="物料编码"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">绑定商品</el-button>
              <el-button type="text" size="small" :disabled="!needAttributeMatch"  @click="toParamsCorrespond(scope.row)">参数对应</el-button>
              <el-button type="text" size="small"  @click="toDeleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="findMallCategoryListParam.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="findMallCategoryListParam.pageSize"
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
      title="删除提示"
      :visible.sync="dialogVisible2"
      width="30%"
      class="itemCorrespondBox"
    >
      <span>确定删除此条对应关系？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="isDeleteItem()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="清空数据提示"
      :visible.sync="dialogVisible3"
      width="30%"
      class="itemCorrespondBox"
    >
      <span>确定清空部对应关系，清空后此项目不再有品目对应和参数对应？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible3 = false">取 消</el-button>
    <el-button type="primary" @click="isClearData()">确 定</el-button>
  </span>
    </el-dialog>
    <importFile
        ref="importFile"
        :title="'品目信息导入'"
        :type="importType"
        @callback="dialogCallback"
         :params="{mallId:mallID}"
      ></importFile>
      <importFile
        ref="importFile1"
        :title="'参数信息导入'"
        :type="importType1"
        @callback="dialogCallback"
         :params="{mallId:mallID}"
      ></importFile>
  </div>
</template>
<script>
  import store from '@/store/store';
  import {itemCorrespondList,clearItemCorrespond,delItemCorrespond,getDataList1} from '@/api/release/mallProjectManage'
  import importFile from "@/components/common/module/ImportFile";
  import { parseTime } from '@/utils';
  import {downloadFile} from '@/api/fileGoods'
  export default {
    inject: ['reload','close'],
    name: "ItemCorrespond",
    data() {
      return {
        isShow: true,
        screenGoods: '收起筛选',
        screenBrand: '展开筛选',
        loading1:false,
        tableData: null,
        infoRealName:'',
        options4:null,
        importType: "item-correspond-import",
        importType1:'params-correspond-import',
        //商城id
        mallID:null,
        //该商城下项目得关联三级品目得值
        mallCCategoryLevel:null,
        projectName:null,
        //删除id
        delID:'',
        //是否需要参数对应
        needAttributeMatch:null,
        //错误提示消息
        infoMessage:'',
        findMallCategoryListParam: {
          pageNum: 1,
          pageSize: 10,
          mallId:null,
          categoryName:null,
        },
        paginations: {
          total: 0,//总数
        },
        dialogVisible1:false,
        dialogVisible2:false,
        dialogVisible3:false
      }
    },
    computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
    mounted(){
      this.findMallCategoryListParam.mallId=Number(this.$route.query.ItemID)
    },
    created() {
      this.mallID=this.$route.query.ItemID;
      this.mallCCategoryLevel=this.$route.query.mallCCategoryLevel;
      this.projectName=this.$route.query.projectName;
      //获取表格数据
      this.getTableData();
    },
    activated(){
     if(this.$route.query.ItemID&&this.mallID!=this.$route.query.ItemID){
        this.mallID=this.$route.query.ItemID;
        this.mallCCategoryLevel=this.$route.query.mallCCategoryLevel;
        this.projectName=this.$route.query.projectName;
        this.getTableData()
     }
     if(this.$route.params.isUpdate){
       this.getTableData()
     }
    },
    components:{
     importFile
    },
    methods: {
      reset(){
      this.findMallCategoryListParam={
          pageNum: 1,
          pageSize: 10,
          mallId:null,
          categoryName:null,
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
      //参数导入
     importParamsCorrespond(type,row){
     this.$refs[type].init(row)
     },
      //获取表格数据
      getTableData(){
        itemCorrespondList(this.findMallCategoryListParam).then(res=>{
          this.tableData=res.data.items;
          this.paginations.total=res.data.total;
          this.findMallCategoryListParam.pageNum=res.data.pageNum;
          this.findMallCategoryListParam.pageSize=res.data.pageSize;
        })
        getDataList1(this.mallID).then(res=>{
         if(res.code=='000000'){
            this.needAttributeMatch=res.data.needAttributeMatch;
         }
        })
      },
      //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
      queryBrand1(){
        this.findMallCategoryListParam.pageNum=1;
        this.getTableData();
      },
      //清空数据
      toClearData(){
        this.dialogVisible3=true;
      },
      //导入
      toImport(type,row){
        this.$refs[type].init(row)
      },
      dialogCallback(){
       
      },
      //是否清空
      isClearData(){
        clearItemCorrespond(this.mallID).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:'清空数据成功',
              type:'success'
            })
            this.dialogVisible3=false
          }
        }).then(res=>{
          this.getTableData();
        })
      },
      //跳转到绑定商品页
      handleClick(row) {
        // const {href}=this.$router.resolve({
        //   name:'BindGoods',
        //   query:{
        //     ItemID:row.id,
        //     projectName:this.projectName,
        //     ProductId:this.mallID,
        //     mallName:this.projectName
        //   }
        // })
        // window.open(href)
        this.$router.push({name:'BindGoods',query:{ItemID:row.id,projectName:this.projectName,ProductId:this.mallID,mallName:this.projectName}})
      },
      handleCurrentChange(val) {
        this.findMallCategoryListParam.pageNum=val;
        this.getTableData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.findMallCategoryListParam.pageSize=val;
        this.getTableData()
      },
      //筛选按钮
      showHelp() {
        this.isShow = !this.isShow;
      },
      //跳转商品池管理
      toProductPondManage(row) {
        // const {href} = this.$router.resolve({
        //   name: 'ProductPondManage',
        //   query: {
        //     ProductId: row.id,
        //   }
        // })
        // window.open(href,'_blank')
        this.$router.push({name:'ProductPondManage',query:{ProductId:row.id}})
      },
      //跳转添加品目对应
      toCreateItem(){
      // const {href}=this.$router.resolve({
      //   name:'CreateItemCorrespond',
      //   query:{
      //     mallCCategoryLevel:this.mallCCategoryLevel,
      //     mallID:this.mallID,
      //     projectName:this.projectName
      //   }
      // })
      //   window.open(href,'_blank')
        this.$router.push({name:'CreateItemCorrespond',query:{mallCCategoryLevel:this.mallCCategoryLevel,mallID:this.mallID,projectName:this.projectName}})
      },
      toItemCorrespondRecord(name,query){
        // const {href}=this.$router.resolve({
        //   name:name,
        //   query:query
        // })
        // window.open(href,'_blank')
        this.$router.push({name:name,query:query})
      },
      //删除提示
      toDeleteItem(row){
        this.dialogVisible2=true;
        this.delID=row.id
      },
      //是否删除
      isDeleteItem(){
        delItemCorrespond(this.delID).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:'删除成功',
              type:'success'
            })
          }
          this.dialogVisible2=false;
        }).then(res=>{
          this.getTableData();
        })
      },
      //跳转到参数对应
      toParamsCorrespond(row){
        // const {href}=this.$router.resolve({
        //   name:'ParamsCorrespond',
        //   query:{
        //     //领先三级分类id
        //     categoryId:row.categoryId,
        //     //客户三级分类id
        //     itemID:row.id,
        //     //商城id
        //     mallID:this.mallID
        //   }
        // })
        // window.open(href)
        this.$router.push({name:'ParamsCorrespond',query:{categoryId:row.categoryId,itemID:row.id,mallID:this.mallID}})
      },
      //操作记录
      toItemOperationRecord(name,query){
        // const {href}=this.$router.resolve({
        //   name:name,
        //   query:query
        // })
        // window.open(href)
        this.$router.push({name:name,query:query})
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
          line-height: 56px;
          //width: 200px;
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
  .brandBox{
    .itemCorrespondBox{
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


    }

  }



</style>










