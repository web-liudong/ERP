<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:isActive==0}"
        @click="initAvailable"
      >可用（{{availableNum}}）</el-button>
      <el-button
        size="small"
        :class="{active:isActive==1}"
        @click="initPending"
        v-if="!taxId&&!brandId"
      >待审核（{{pendingReviewNum}}）</el-button>
      <el-button
        size="small"
        :class="{active:isActive==2}"
        @click="initDraft"
        v-if="!taxId&&!brandId"
      >草稿（{{drafNum}}）</el-button>
      <el-button
        size="small"
        :class="{active:isActive==3}"
        @click="initRejected"
        v-if="!taxId&&!brandId"
      >已驳回（{{rejectReviewNum}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" @click="query(1)">查询结果</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div v-show="isActive==0">
            <span>分类编号：</span>
            <el-input placeholder="分类编号" v-model="selectId" clearable></el-input>
          </div>
          <div>
            <span>所属一级分类：</span>
            <el-select
              v-model="firstlevelId"
              placeholder="所属一级分类"
              v-if="!shaiid1&&!shaiid2"
              clearable
              @change="getSecond"
            >
              <el-option
                v-for="item in classOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input v-model="className" readonly v-if="shaiid1||shaiid2"></el-input>
          </div>
          <div>
            <span>所属二级分类：</span>
            <el-select
              v-model="parentId"
              placeholder="所属二级分类"
              v-if="!shaiid2"
              clearable
              @change="getThird"
            >
              <el-option
                v-for="item in classOptions2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input v-model="className2" readonly v-if="shaiid2"></el-input>
          </div>
          <div>
            <span>三级分类名称：</span>
            <el-select v-model="name" placeholder="三级分类名称" clearable v-if="isActive==0">
              <el-option
                v-for="item in classOptions3"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-input placeholder="分类名称" v-model="name" clearable v-if="isActive!==0"></el-input>
          </div>
          <div v-show="isActive==0">
            <span>是否有参数模板：</span>
            <el-select v-model="temp" placeholder="是否有参数模板" clearable>
              <el-option
                v-for="item in templates"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div v-show="isActive==0">
            <span>财务确认状态：</span>
            <el-select v-model="categoryStatus" placeholder="财务确认状态">
              <el-option
                v-for="item in finance"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <table-head headname="数据列表">
        <div>
          <el-button plain size="small" @click="addNew" v-if="$authorities.CategoryCreateRelevant">
            <i class="iconfont iconzengjia"></i>添加三级分类
          </el-button>
        </div>
      </table-head>
      <el-table :data="tableData" border :max-height="dataListHeight">
        <el-table-column label="分类编号" align="center">
          <template slot-scope="scope">
            <span v-show="isActive==0">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
        <el-table-column prop="levelDescription" label="级别" align="center"></el-table-column>
        <el-table-column prop="firstLevelName" label="所属一级分类" align="center"></el-table-column>
        <el-table-column prop="secondLevelName" label="所属二级分类" align="center"></el-table-column>
        <el-table-column prop="statusDescription" label="分类状态" align="center"></el-table-column>
        <el-table-column label="是否有模板" align="center">
          <template slot-scope="scope">
            <div v-show="isActive==0">{{scope.row.haveAttTemp}}</div>
            <div v-show="isActive!=0">---</div>
          </template>
        </el-table-column>
        <el-table-column label="财务确认状态" align="center">
          <template slot-scope="scope">
            <div v-show="isActive==0">{{scope.row.financialConfirmStatus}}</div>
            <div v-show="isActive!=0">---</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="相关" align="center" width="350px">
          <template slot-scope="scope">
            <div v-show="isActive==0">
              <router-link
                :to="{name:'Brand',query: {id3:scope.row.id,name:scope.row.name},params:{isUpdate:true}}"
                v-if="$authorities.Brand"
              >
                <el-button type="text">品牌：{{scope.row.brandCount}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'SupplierList',query: {classCode:scope.row.code},params:{isUpdate:true}}"
                v-if="$authorities.SupplierIndex"
              >
                <el-button
                  type="text"
                >供应商：{{scope.row.supplierCount?scope.row.supplierCount:0}}&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </router-link>
              <router-link
                :to="{name:'GoodsManage',query: {id3:scope.row.id,name3:scope.row.name,name2:scope.row.secondLevelName,name1:scope.row.firstLevelName},params:{isUpdate:true}}"
              >
                <el-button type="text">商品：{{scope.row.skuCount}}</el-button>
              </router-link>
            </div>
            <div v-show="isActive!=0">---</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <div v-if="isActive==0">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id)"
                :disabled="scope.row.updateStatus==1"
                v-if="$authorities.CategoryUpdateRelevant"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="goTemplate(scope.row.categoryAttributeTemplateId)"
                v-if="scope.row.categoryAttributeTemplateId&&$authorities.TemplateAdmin"
              >预览参数模板</el-button>
            </div>
            <div v-if="isActive==1">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goCheck(scope.row.id)"
                v-if="$authorities.CategoryReview"
              >审核</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId!=0&&$authorities.CategoryDetailRelevant"
              >原数据详情</el-button>
            </div>
            <div v-if="isActive==2">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id)"
                v-if="$authorities.CategoryUpdateRelevant"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.id)"
                v-if="$authorities.CategoryCreateRelevant||$authorities.CategoryUpdateRelevant"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="check(scope.row.id)"
                v-if="$authorities.CategoryCreateRelevant||$authorities.CategoryUpdateRelevant"
              >提审</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId!=0&&$authorities.CategoryDetailRelevant"
              >原数据详情</el-button>
            </div>
            <div v-if="isActive==3">
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.id)"
                v-if="$authorities.CategoryDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="goEdit(scope.row.id)"
                v-show="scope.row.updateStatus!=1"
                v-if="$authorities.CategoryUpdateRelevant&&scope.row.oldId==0"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.updateStatus==2"
                @click="del(scope.row.id)"
                v-if="$authorities.CategoryCreateRelevant||$authorities.CategoryUpdateRelevant"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="goDetail(scope.row.oldId)"
                v-if="scope.row.oldId!=0&&$authorities.CategoryDetailRelevant"
              >原数据详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,30,40,50,100,500]"
          @size-change="handleSizeChange"
          layout="total, sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  available3,
  pending3,
  draft3,
  rejected3,
  countStatus,
  submitReview,
  classDelete,
  editCheck,
  getstatus,
  selectList
} from "@/api/classManage";
import TableHead from "@/components/common/TableHead/tablehead";
export default {
  inject: ["reload"],
  name: "Category3",
  data() {
    return {
      className: "",
      className2: "",
      classOptions1: [],
      classOptions2: [],
      classOptions3: [],
      taxId: null,
      firstlevelId: null,
      parentId: null,
      isActive: 0,
      availableNum: 0,
      pendingReviewNum: 0,
      drafNum: 0,
      rejectReviewNum: 0,
      tableData: [],
      selectId: null,
      page: 1,
      name: null,
      status: null,
      categoryStatus: null,
      total: 0,
      temp: null,
      dialogTableVisible: false,
      previewVisible: false,
      isShow: true,
      templates: [
        {
          id: 3,
          label: "不限",
          value: 123
        },
        {
          id: 1,
          label: "有",
          value: true
        },
        {
          id: 2,
          label: "无",
          value: false
        }
      ],
      finance: [
        {
          id: 0,
          value: "不限"
        },
        {
          id: 1,
          value: "待确认"
        },
        {
          id: 2,
          value: "已确认"
        }
      ],
      shaiid1: null,
      shaiid2: null,
      brandId: null,
      pageSize: 10
    };
  },
  activated() {
    if (this.$route.params && this.$route.params.isUpdate) {
      this.initAvailable(1);
      selectList(1, 0).then(res => {
        if (res.code == "000000") {
          this.classOptions1 = res.data;
        }
      });
      return false;
    } else if (Object.keys(this.$route.query).length !== 0) {
      this.parentId = this.$route.query.id2;
      this.shaiid2 = this.$route.query.id2;
      this.firstlevelId = this.$route.query.id1;
      this.shaiid1 = this.$route.query.id1;
      this.taxId = this.$route.query.taxId;
      this.brandId = this.$route.query.brandId;
      if (this.$route.query.status) {
        this.isActive = this.$route.query.status;
        this.query(1);
      } else {
        this.initAvailable(1);
        if (this.parentId) {
          this.count(1, this.parentId);
        } else if (this.firstlevelId) {
          this.count(2, this.firstlevelId);
        } else if (this.taxId || this.brandId) {
          this.availableNum = 0;
        } else {
          this.count(1, null);
        }
        if (this.shaiid1) {
          this.className = this.$route.query.name1;
          this.getSecond(this.shaiid1)
        }
        if (this.shaiid2) {
          this.className = this.$route.query.name1;
          this.className2 = this.$route.query.name2;
          this.getThird(this.shaiid2)
        }
      }
      return false;
    } else if (
      Object.keys(this.$route.params).length === 0 &&
      Object.keys(this.$route.query).length === 0
    ) {
      this.initAvailable(1);
      selectList(1, 0).then(res => {
      if (res.code == "000000") {
        this.classOptions1 = res.data;
      }
    });
    }else if(this.$route.query){
      this.parentId = this.$route.query.id2;
      this.shaiid2 = this.$route.query.id2;
      this.firstlevelId = this.$route.query.id1;
      this.shaiid1 = this.$route.query.id1;
      this.taxId = this.$route.query.taxId;
      this.brandId = this.$route.query.brandId;
      this.initAvailable(1);
        if (this.parentId) {
          this.count(1, this.parentId);
        } else if (this.firstlevelId) {
          this.count(2, this.firstlevelId);
        } else if (this.taxId || this.brandId) {
          this.availableNum = 0;
        } else {
          this.count(1, null);
        }
        if (this.shaiid1) {
          this.className = this.$route.query.name1;
          this.getSecond(this.shaiid1)
        }
        if (this.shaiid2) {
          this.className = this.$route.query.name1;
          this.className2 = this.$route.query.name2;
          this.getThird(this.shaiid2)
        }
    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  components: { TableHead },
  methods: {
    getSecond(val) {
      if (val) {
        selectList(2, val).then(res => {
          if (res.code == "000000") {
            this.classOptions2 = res.data;
          }
        });
      } else {
        this.parentId = null;
        this.classOptions2 = [];
      }
    },
    getThird(val) {
      if (val) {
        selectList(3, val).then(res => {
          if (res.code == "000000") {
            this.classOptions3 = res.data;
          }
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.query(1);
    },
    reset() {
      if (!this.shaiid2) {
        this.parentId = null;
      }
      if (!this.shaiid1) {
        this.firstlevelId = null;
      }
      this.selectId = null;
      this.name = null;
      this.temp = null;
      this.categoryStatus = null;
      this.query(this.page);
    },
    goTemplate(id) {
      this.$router.push({ name: "TemplateDetail", query: { id: id } });
    },
    goEdit(id) {
      editCheck(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({ name: "CategoryUpdate3", query: { id: id } });
        }
      });
    },
    goDetail(id) {
      this.$router.push({
        name: "CategoryDetail3",
        query: { id: id }
      });
    },
    goCheck(id) {
      getstatus(id).then(res => {
        if (res.data == 1) {
          this.$router.push({
            name: "CategoryCheck3",
            query: { id: id }
          });
        } else {
          this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.query(this.page);
            }
          });
        }
      });
    },
    del(id) {
      this.$confirm(
        "删除之后，列表将不再展示该条数据，确定要删除吗？",
        "删除提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        classDelete(id).then(res => {
          if (res.code == "000000" && res.data == 1) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.query(this.page);
          } else {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
        });
      });
    },
    check(id) {
      this.$confirm("确定当前填写的信息无误，可以提交审核？", "提审确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        submitReview(id).then(res => {
          if (res.code == "000000" && res.data == 1) {
            this.$message({
              type: "success",
              message: "提审成功!"
            });
            this.query(this.page);
          } else {
            this.$message({
              type: "info",
              message: "提审失败"
            });
          }
        });
      });
    },
    count(source, sourceId) {
      countStatus(3, source, sourceId).then(res => {
        this.availableNum = res.data.availableQty;
        this.pendingReviewNum = res.data.pendingReviewQty;
        this.drafNum = res.data.drafQty;
        this.rejectReviewNum = res.data.rejectReviewQty;
      });
    },
    addNew() {
      var id1 = this.$route.query.id1 ? this.$route.query.id1 : null;
      var id2 = this.$route.query.id2 ? this.$route.query.id2 : null;
      this.$router.push({
        name: "CategoryCreateThird",
        query: { id1: id1, id2: id2 }
      });
    },
    initAvailable() {
      this.isActive = 0;
      this.page = 1;
      this.categoryStatus = null;
      this.temp = null;
      this.id = null;
      this.name = null;
      if (!this.shaiid1 && !this.shaiid2) {
        this.firstlevelId = null;
      }
      if (!this.shaiid2) {
        this.parentId = null;
      }
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      available3({
        pageNum: 1,
        pageSize: this.pageSize,
        secondLevelId: this.parentId,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        brandId: this.brandId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
          this.availableNum = this.total;
          if (this.taxId || this.brandId) {
            this.availableNum = res.data.total;
          }
        }
      });
    },
    initPending() {
      this.page = 1;
      this.isActive = 1;
      this.name = null;
      if (!this.shaiid1 && !this.shaiid2) {
        this.firstlevelId = null;
      }
      if (!this.shaiid2) {
        this.parentId = null;
      }
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      pending3({
        pageNum: 1,
        pageSize: this.pageSize,
        secondLevelId: this.parentId,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        brandId: this.brandId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initDraft() {
      this.page = 1;
      this.isActive = 2;
      this.name = null;
      if (!this.shaiid1 && !this.shaiid2) {
        this.firstlevelId = null;
      }
      if (!this.shaiid2) {
        this.parentId = null;
      }
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      draft3({
        pageNum: 1,
        pageSize: this.pageSize,
        secondLevelId: this.parentId,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        brandId: this.brandId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    initRejected() {
      this.page = 1;
      this.isActive = 3;
      this.name = null;
      if (!this.shaiid1 && !this.shaiid2) {
        this.firstlevelId = null;
      }
      if (!this.shaiid2) {
        this.parentId = null;
      }
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      rejected3({
        pageNum: 1,
        pageSize: this.pageSize,
        secondLevelId: this.parentId,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        brandId: this.brandId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    query(val) {
      var that = this;
      var reg = /^[0-9]+.?[0-9]*$/;
      if (that.selectId && !reg.test(that.selectId)) {
        this.$message.error("id必须输入数字");
        return false;
      }
      if (this.isActive == 0) {
        this.getAvailable(
          val,
          that.selectId,
          that.name,
          that.temp,
          that.categoryStatus
        );
      }
      if (this.isActive == 1) {
        this.getPending(
          val,
          that.selectId,
          that.name,
          that.temp,
          that.categoryStatus
        );
      }
      if (this.isActive == 2) {
        this.getDraft(
          val,
          that.selectId,
          that.name,
          that.temp,
          that.categoryStatus
        );
      }
      if (this.isActive == 3) {
        this.getRejected(
          val,
          that.selectId,
          that.name,
          that.temp,
          that.categoryStatus
        );
      }
    },
    getAvailable(page, id, name, haveAttributeTemplate, categoryStatus) {
      var that = this;
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      available3({
        code: id == "" ? null : id,
        name: name == "" ? null : name,
        haveAttributeTemplate:
          haveAttributeTemplate === 123 ? null : haveAttributeTemplate,
        categoryStatus: categoryStatus,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        pageNum: page,
        pageSize: this.pageSize,
        secondLevelId: this.parentId,
        brandId: this.brandId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getPending(page, id, name, haveAttributeTemplate, categoryStatus) {
      var that = this;
      this.isActive = 1;
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      pending3({
        code: null,
        name: name == "" ? null : name,
        pageNum: page,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        haveAttributeTemplate: haveAttributeTemplate,
        categoryStatus: categoryStatus,
        pageSize: this.pageSize,
        secondLevelId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getDraft(page, id, name, haveAttributeTemplate, categoryStatus) {
      var that = this;
      this.isActive = 2;
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      draft3({
        code: null,
        name: name == "" ? null : name,
        pageNum: page,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        haveAttributeTemplate: haveAttributeTemplate,
        categoryStatus: categoryStatus,
        pageSize: this.pageSize,
        secondLevelId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getRejected(page, id, name, haveAttributeTemplate, categoryStatus) {
      var that = this;
      this.isActive = 3;
      if (this.parentId) {
        this.count(1, this.parentId);
      } else if (this.firstlevelId) {
        this.count(2, this.firstlevelId);
      } else if (this.taxId || this.brandId) {
      } else {
        this.count(1, null);
      }
      rejected3({
        code: null,
        name: name == "" ? null : name,
        pageNum: page,
        firstLevelId: this.firstlevelId,
        taxCodeId: this.taxId,
        haveAttributeTemplate: haveAttributeTemplate,
        categoryStatus: categoryStatus,
        pageSize: this.pageSize,
        secondLevelId: this.parentId
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.page = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    handleCurrentChange(val) {
      var that = this;
      this.query(val);
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding-left: 20px;
      box-sizing: border-box;
      .head-left {
        display: flex;
        align-items: center;
      }
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      .myicon {
        color: #999;
        font-size: 10px;
      }
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      div {
        display: inline-block;
        padding: 5px 10px;
        .el-input {
          width: 200px;
        }
        .el-select {
          width: 200px;
        }
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0 0 0;
  }
  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .my-scroll-bar {
    height: 200px;
  }
}
</style>

