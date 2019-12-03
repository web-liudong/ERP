<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:index==isActive}"
        v-for="(item,index) in headers"
        @click="changeTab(index)"
        :key="index"
      >{{item.statusName}}（{{item.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">展开筛选</i>
          </span>
          <el-button size="small" @click="queryBrand1()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox clear" v-if="isShow">
          <div class="inputBox" v-if="isActive==0">
            <span>品牌编号：</span>
            <el-input placeholder="品牌编号" v-model="findBrandParam.no" @input="findBrandParam.no=findBrandParam.no.replace(/[^\d]/g,'')" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>品牌名称：</span>
            <!-- <el-select
          v-model="findBrandParam.nameCN"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="品牌名称"
          :remote-method="remoteMethod"
          :loading="loading1">
          <el-option
            v-for="item in options4"
            :key="item.nameCN"
            :label="item.label"
            :value="item.nameCN">
          </el-option>
            </el-select>-->
            <el-input placeholder="品牌名称" v-model="findBrandParam.nameCN"  clearable></el-input>
          </div>
          <div class="inputBox">
            <span>商标申请人：</span>
            <el-input placeholder="商标申请人" v-model="findBrandParam.registrant" clearable></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="listBoxRight">
          <div
            class="white-btn fun-btn"
            @click="addBrandList()"
            v-if="$authorities.BrandCreateRelevant"
          >
            <i class="iconfont icontianjiashangpin"></i>添加
          </div>
          <div
            class="white-btn fun-btn"
            @click="importBrand('importFile','brand-update-import')"
            v-if="$authorities.BrandImportRelevant"
          >
            <i class="iconfont icondaoru"></i>导入更新
          </div>
          <div
            class="white-btn fun-btn"
            @click="importBrand('importFile','product-brand-import')"
            v-if="$authorities.BrandImportRelevant"
          >
            <i class="iconfont icondaoru"></i>导入新建
          </div>
          <div
            class="white-btn fun-btn"
            @click="importRecord()"
            v-if="$authorities.BrandImportRelevant"
          >
            <i class="iconfont icondingdanguanli"></i>导入记录
          </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" size="small" :max-height="dataListHeight">
          <el-table-column prop="no" label="品牌编号" align="center">
            <template slot-scope="scope">
              <span v-if="isActive==0" style="font-size: 12px;margin-left: 0">{{scope.row.no}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nameCN" label="品牌名称" align="center">
            <template slot-scope="scope">
              <span style="font-size: 12px;margin-left: 0">{{scope.row.nameCN}}</span>
              <span
                style="font-size: 12px;margin-left: 0"
                v-if="(scope.row.nameEN)!=0"
              >({{scope.row.nameEN}})</span>
              <!--{{`${scope.row.nameCN}(${scope.row.nameEN})`}}-->
            </template>
          </el-table-column>
          <el-table-column prop="registrant" label="商标申请人" align="center"></el-table-column>
          <el-table-column prop="statusName" label="状态" align="center">
            <template slot-scope="scope">{{scope.row.statusName}}</template>
          </el-table-column>
          <!-- <el-table-column
            prop="updateStatusName"
            label="更新状态"
            align="center">
            <template slot-scope="scope">
              {{scope.row.updateStatusName}}<br>
              <el-button type="text" v-if="scope.row.updateStatusName!=='&#45;&#45;'&&scope.row.updateStatusName!='已驳回'" @click="goUpdateDetail(scope.row)">更新详情</el-button>
            </template>
          </el-table-column>-->
          <el-table-column prop="skuCount" label="相关" align="center">
            <template slot-scope="scope">
              <div v-if="isActive==0">
                <el-button
                  type="text"
                  v-if="$authorities.GoodsManage"
                  @click="openWin('GoodsManage',{'idBrand':scope.row.id,brandNameCN:scope.row.nameCN,brandNameEN:scope.row.nameEN})"
                >商品：{{scope.row.skuCount}}</el-button>
                <el-button
                  type="text"
                  v-if="$authorities.CategoryThirdList"
                  @click="openWin('Category3',{'brandId':scope.row.id})"
                >分类：{{scope.row.categoryCount}}</el-button>
                <el-button
                  type="text"
                  v-if="$authorities.SupplierInfoList"
                  @click="openWin('SupplierList',{'id':scope.row.id})"
                >供应商：{{scope.row.supplierCount}}</el-button>
              </div>
              <div v-if="isActive!=0">---</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="toBrandDetail('BrandDetail',{id:scope.row.id})"
                v-if="$authorities.BrandDetailRelevant"
              >详情</el-button>
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                v-if="(isActive==0||isActive==2||isActive==3)&&$authorities.BrandUpdateRelevant"
                :disabled="scope.row.oldId!=0&&isActive==3"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==2&&$authorities.BrandUpdateRelevant&&$authorities.BrandCreateRelevant"
                @click="toAudit(scope.row)"
              >提审</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==1&&$authorities.BrandReview"
                @click="auditBrandDetail(scope.row)"
              >审核</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(isActive==2||isActive==3)&&$authorities.BrandCreateRelevant&&$authorities.BrandUpdateRelevant"
                @click="delBrandID(scope.row)"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(scope.row.oldId!=null&&scope.row.oldId!=0)&&$authorities.BrandDetailRelevant"
                @click="toBrandDetail('BrandDetail',{id:scope.row.oldId})"
              >原数据详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>  
    </div>
    <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="findBrandParam.pageNum"
          :page-size="findBrandParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginations.total"
        ></el-pagination>
      </div>
    <el-dialog title="品牌信息批量导入" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="第一步" :label-width="formLabelWidth">
          <a class="download" :loading="downloadLoading" title="下载" @click="handleDownload()">下载</a>
          <!-- <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>-->
        </el-form-item>
        <el-form-item label="第二步" :label-width="formLabelWidth">
          <!--   <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
             multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>-->
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="dialogVisible" width="30%">
      <span>删除之后，列表将不再展示该条数据，确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isDelBrandID()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="数据锁定提示" :visible.sync="dialogVisible1" width="30%">
      <span>用户[ {{infoMessage}} - {{infoRealName}} ]正在编辑该条数据，数据已锁定。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
    <importFile ref="importFile" :title="'品牌信息导入'" :type="importType" @callback="dialogCallback"></importFile>
    <el-table
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      v-if="false"
    >
      <el-table-column align="center" label="Id" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" width="115" align="center">
        <template slot-scope="scope">{{ scope.row.pageviews }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import store from "@/store/store";
import {
  toAuditList,
  passedBrandList,
  noPassBrandList,
  draftBrandList,
  getBrandStatus,
  deleteBrandID,
  getBrandDetail,
  toAuditBrand,
  batchImport,
  remoteBrandName,
  queryBrand,
  checkName,
  toGetBrandData,
  checkAuditer
} from "@/api/brandManage";
import { fuzzySearch } from "@/api/organizationManage";
import importFile from "@/components/common/module/ImportFile";
import { parseTime } from "@/utils";
export default {
  inject: ["reload"],
  name: "Brand",
  data() {
    return {
      list: [],
      downloadLoading: false,
      dialogFormVisible: false,
      headers: null,
      isActive: 0,
      input3: "",
      isShow: true,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      loading1: false,
      tableData: null,
      allTableData: [],
      filteredData: [],
      infoRealName: "",
      options4: null,
      //错误提示消息
      infoMessage: "",
      importType: "product-brand-import",
      findBrandParam: {
        pageNum: 1,
        pageSize: 10,
        nameCN: null,
        nameEN: null,
        id: null, //品牌id
        no: null, //品牌编号
        registrant: null, //商标申请人
        name: null,
        firstLevelCategoryId: Number(this.$route.query.id1) || null,
        secondLevelCategoryId: this.$route.query.id2 || null,
        thirdLevelCategoryId: this.$route.query.id3 || null
      },
      fileList: [],
      BrandStatusCountDTO: null,
      paginations: {
        total: 100 //总数
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      delBrandID1: "",
      //删除品牌id
      dialogVisible: false,
      dialogVisible1: false
    };
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  components: {
    importFile
  },
  mounted() {
    this.findBrandParam.id = this.$route.query.id;
  },
  activated() {
      this.$route.query.status === undefined? this.isActive = 0:this.isActive = this.$route.query.status;
      this.changeTab(this.isActive);
  },
  methods: {
    reset() {
      (this.findBrandParam.pageNum = 1),
        (this.findBrandParam.pageSize = 10),
        (this.findBrandParam.nameCN = null),
        (this.findBrandParam.nameEN = null),
        (this.findBrandParam.id = null), //品牌id
        (this.findBrandParam.no = null), //品牌编号
        (this.findBrandParam.registrant = null), //商标申请人
        (this.findBrandParam.name = null),
        (this.findBrandParam.firstLevelCategoryId = null),
        (this.findBrandParam.secondLevelCategoryId = null),
        (this.findBrandParam.thirdLevelCategoryId = null);
      this.change(this.isActive);
    },
    dialogCallback() {},
    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        let aa = { name: query };
        remoteBrandName(aa).then(res => {
          if (res.code == "000000") {
            this.options4 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    //导入品牌
    importBrand(type, row) {
      this.importType = row;
      this.$refs[type].init();
    },
    //品牌导入记录
    importRecord() {
      this.$router.push({ name: "ImportRecord" });
    },
    //跳到更新详情页
    goUpdateDetail(row) {
      this.$router.push({ name: "BrandUpdate" });
    },
    //获取表格数据
    getTableData() {
      delete this.findBrandParam.name;
      passedBrandList(this.findBrandParam).then(res => {
        this.tableData = res.data.items;
        console.log(this.tableData, 88888);
        this.paginations.total = res.data.total;
        this.findBrandParam.pageNum = res.data.pageNum;
        this.findBrandParam.pageSize = res.data.pageSize;
      });
    },
    //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
    queryBrand1() {
      this.findBrandParam.pageNum = 1;
      this.change(this.isActive);
    },
    // changeName(val){
    //    var result=val.match(/\(([^)]*)\)/);
    //    var resultCN=val.match(/(?<=\().*?(?=\))/);
    //    if(val){
    //    if(result===null){
    //     this.findBrandParam.nameCN=val 
    //     }else if(result&&result[1]){
    //      this.findBrandParam.nameEN=result[1];
    //     }else{
    //      this.findBrandParam.nameEN=null;
    //     } 
    //     if(resultCN===null&&result){
    //        this.findBrandParam.nameEN=val;
    //      }else if(resultCN===null&&result===null){
    //        this.findBrandParam.nameCN=val;     
    //      }else if(resultCN&&result[1]){
    //       this.findBrandParam.nameCN=result[1]
    //     }else{
    //       this.findBrandParam.nameCN=null;
    //     }        
    //    }else{
    //     this.findBrandParam.nameCN=null;
    //     this.findBrandParam.nameEN=null;
    //    }   
    // },
    //获取按钮的状态和数量
    getBrandStaus() {
      getBrandStatus().then(res => {
        this.headers = res.data;
        console.log(this.headers, 88888);
      });
    },
    //获取已驳回的列表数据
    getTable() {
      noPassBrandList(this.findBrandParam).then(res => {
        this.tableData = res.data.items;
      });
    },
    //跳转到编辑页
    handleClick(row) {
      checkName(row.id).then(
        res => {
          console.log(res, 88888888888888888888888);
          if (res.data != "") {
            this.dialogVisible1 = true;
            this.infoMessage = res.data.userName;
            this.infoRealName = res.data.realName;
            this.change(this.isActive);
          } else {
            // const {href}=this.$router.resolve({
            //   name:'EditorBrand',
            //   query:{
            //     id:row.id,
            //     show:row.status
            //   }
            // })
            // window.open(href,'_blank');
            this.$router.push({
              name: "EditorBrand",
              query: { id: row.id, show: row.status }
            });
          }
        },err=>{
          this.change(this.isActive)
        })
      },
      //切换tab
      changeTab(index){
        // this.findBrandParam.id=null;
        // this.findBrandParam.registrant=null;
        // this.findBrandParam.nameCN=null
        this.isActive=index
        this.change(index)
        this.getBrandStaus(); 
      },
      openWin(name,query){
      //  const {href}=this.$router.resolve({
      //    name:name,
      //    query:query
      //  })
      //  window.open(href);
      this.$router.push({ name: name, query: query });
    },
    change(index) {
      // delete this.findBrandParam.name;
      //待审核列表
      if (index == 1) {
        toAuditList(this.findBrandParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.findBrandParam.pageNum = res.data.pageNum;
          this.findBrandParam.pageSize = res.data.pageSize;
          this.mapdata()
        });
      }
      //以通过列表
      if (index == 0) {
        passedBrandList(this.findBrandParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.findBrandParam.pageNum = res.data.pageNum;
          this.findBrandParam.pageSize = res.data.pageSize;
          this.mapdata()
        });
      }
      //未通过列表
      if (index == 3) {
        noPassBrandList(this.findBrandParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.findBrandParam.pageNum = res.data.pageNum;
          this.findBrandParam.pageSize = res.data.pageSize;
          this.mapdata()
        });
      }
      //草稿列表
      if (index == 2) {
        draftBrandList(this.findBrandParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.findBrandParam.pageNum = res.data.pageNum;
          this.findBrandParam.pageSize = res.data.pageSize;
          this.mapdata()
        });
      }
      
    },
    mapdata(){
     this.tableData.forEach(item=>{
         item.nameCN= item.nameCN.replace(/\s/g,"\u00a0")
         item.nameEN= item.nameEN.replace(/\s/g,"\u00a0")
      })
    },
    /*   setPaginations(){
        //总页数
        this.paginations.total=this.allTableData.length
        this.paginations.page_index=1
        this.paginations.page_size=5
        //设置默认分页数据
        this.tableData=this.allTableData.filter((item,index)=>{
          return index<this.paginations.page_size;
        })*/
    /*
      },*/
    /*  queryBrandId(input1) {
        queryBrand(input1).then(res => {
          this.tableData = [res.data];
        })
      },*/

    handleCurrentChange(val) {
      console.log(val);
      this.findBrandParam.pageNum = val;
      this.changeTab(this.isActive);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findBrandParam.pageSize = val;
      this.changeTab(this.isActive);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.list = results;
      this.tableHeader = header;
    },

    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    //跳转详情
    toBrandDetail(name, query) {
      // const {href} = this.$router.resolve({
      //   name: name,
      //   query: query
      // })
      // window.open(href,'_blank')
      this.$router.push({ name: name, query: query });
    },
    //删除按钮
    delBrandID(row) {
      this.delBrandID1 = row.id;
      this.dialogVisible = true;
    },
    //是否删除
    isDelBrandID() {
      deleteBrandID(this.delBrandID1).then(res => {
        if (res.data == "1") {
          this.$message({
            message: "删除成功",
            showClose: true,
            type: "success"
          });
          this.dialogVisible = false;
        } else if (res.data == "0") {
          this.$message({
            message: "删除失败",
            type: "warning"
          });
          this.dialogVisible = false;
        }
        this.changeTab(this.isActive);
      });
    },
    //跳转到添加品牌页
    addBrandList() {
      this.$router.push({ name: "AddBrand" });
    },
    //跳转到审核详情页
    auditBrandDetail(row) {
      checkAuditer(row.id).then(res => {
        console.log(res, 77777);
        if (res.data != row.status) {
          this.$confirm("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(res => {
              this.changeTab(this.isActive);
            })
            .catch(() => {});
        } else {
          this.$router.push({ name: "BrandAudit", query: { id: row.id } });
        }
      });
    },
    //提审按钮
    toAudit(row) {
      toAuditBrand(row.id).then(res => {
        console.log(res);
        this.$message({
          message: "提审成功",
          type: "success"
        });
        this.changeTab(this.isActive);
      });
    }
  }
};
</script>
<style scoped>
.brandBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
<style scoped lang="less">
.brandBox {
  width: 100%;
  clear: both;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
    }
  }

  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 0 0 10px;
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      overflow: hidden;
      height: 45px;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 5px 0 5px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      .inputBox {
        float: left;
        margin: 10px;
      }
      .el-input {
        width: 180px;
        margin-left: 10px;
      }
      .el-select {
        width: 180px;
      }
      .inputBox2 {
        float: left;
        margin: 10px;
        .el-input {
          width: 100px;
          margin-left: 10px;
        }
      }
    }

    // .homeBottomBox {
    //   border-top: 1px solid #e4e4e4;
    //   display: flex;
    //   flex-wrap: wrap;
    //   .inputBox {
    //     width: 25%;
    //     display: flex;
    //     align-items: center;
    //     span {
    //       text-align: right;
    //       flex: 0 0 98px;
    //     }
    //   }
    //   .el-input {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    //   .el-select {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    // }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
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
      .white-btn {
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


<!--
// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeOptions = [
{ key: 'CN', display_name: 'China' },
{ key: 'US', display_name: 'USA' },
{ key: 'JP', display_name: 'Japan' },
{ key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
acc[cur.key] = cur.display_name
return acc
}, {})
console(calendarTypeOptions)
-->










