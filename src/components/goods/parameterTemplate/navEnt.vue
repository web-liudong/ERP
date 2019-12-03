<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button size="small" :class="{active:status==3}" @click="initList(3)">可用（{{availableNum}}）</el-button>
      <el-button
        size="small"
        :class="{active:status==1}"
        @click="initList(1)"
      >待审核（{{pendingReviewNum}}）</el-button>
      <el-button size="small" :class="{active:status==0}" @click="initList(0)">草稿（{{drafNum}}）</el-button>
      <el-button
        size="small"
        :class="{active:status==2}"
        @click="initList(2)"
      >已驳回（{{rejectReviewNum}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <div>
          <i class="iconfont iconsousuo myicon"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">{{isShow?'收起':'展开'}}筛选</span>
          <el-button size="small" @click="getData">查询结果</el-button>
          <el-button size="small" @click="initList(status)">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-if="isShow">
          <div v-show="status==3">
            <span>参数模板编号：</span>
            <el-input placeholder="参数模板编号" v-model="selectId" clearable type="number"></el-input>
          </div>
          <div>
            <span>一级分类：</span>
            <el-select
              v-model="classFirstid"
              placeholder="一级分类"
              @change="onchange1"
              filterable
              clearable
            >
              <el-option
                v-for="item in classFirst"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>二级分类：</span>
            <el-select
              v-model="classSecondid"
              placeholder="二级分类"
              @change="onchange2"
              filterable
              clearable
            >
              <el-option
                v-for="item in classSecond"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>三级分类：</span>
            <el-select v-model="classThirdid" placeholder="三级分类" filterable clearable>
              <el-option
                v-for="item in classThird"
                :key="item.id"
                :label="item.name"
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
           <el-button
            size="small"
            @click="importfile"
            v-if="$authorities.TemplateImportRelevant"
          >
            <i class="iconfont icondaoru"></i>批量导入
          </el-button>
          <router-link
            :to="{name:'parameterTemplateRecording'}"
            v-if="$authorities.TemplateImportRelevant"
          >
            <el-button size="small"><i class="iconfont iconxiaoshouxiadan"></i>导入记录</el-button>
          </router-link>
          <router-link
            :to="{name:'AddTemplate'}"
            v-if="$authorities.TemplateCreateRelevant"
          >
            <el-button size="small"><i class="iconfont iconzengjia"></i>添加模板</el-button></router-link>
        </div>
      </table-head>
        <el-table :data="tableData" border stripe :max-height="dataListHeight">
          <el-table-column label="参数模板编号" align="center">
            <template slot-scope="scope">
              <span v-show="status==3">{{scope.row.no}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oneLevelCategoryName" label="一级分类" align="center"></el-table-column>
          <el-table-column prop="twoLevelCategoryName" label="二级分类" align="center"></el-table-column>
          <el-table-column prop="threeLevelCategoryName" label="三级分类" align="center"></el-table-column>
          <el-table-column prop="primaryAttribute" label="参数模板主键" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300" fixed="right">
            <template slot-scope="scope">
              <div v-if="status==3">
                <el-button
                  type="text"
                  size="small"
                  @click="goDetail(scope.row.id,false)"
                  v-if="$authorities.TemplateDetail"
                >模板详情</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goGroup(scope.row.id)"
                  v-if="$authorities.TemplateSubmitReviewRelevant"
                >编辑参数组</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goParame(scope.row.id)"
                  v-if="$authorities.TemplateSubmitReviewRelevant"
                >编辑参数</el-button>
              </div>
              <div v-if="status==1">
                <el-button
                  type="text"
                  size="small"
                  @click="goDetail(scope.row.id,false)"
                  v-if="$authorities.TemplateDetail"
                >模板详情</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goExamine(scope.row.id)"
                  v-if="$authorities.TemplateReview"
                >模板审核</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.oldId&&$authorities.TemplateSubmitReviewRelevant"
                  @click="goDetail(scope.row.oldId,true)"
                >原数据详情</el-button>
              </div>
              <div v-if="status==0">
                <el-button
                  type="text"
                  size="small"
                  @click="goDetail(scope.row.id,false)"
                  v-if="$authorities.TemplateDetail"
                >模板详情</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goGroup(scope.row.id)"
                  v-if="$authorities.TemplateSubmitReviewRelevant"
                >编辑参数组</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goParame(scope.row.id)"
                  v-if="$authorities.TemplateSubmitReviewRelevant"
                >编辑参数</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="submitReview(scope.row.id)"
                  v-if="$authorities.TemplateSubmitReviewRelevant"
                >模板提审</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="deleteTem(scope.row.id)"
                  v-if="$authorities.TemplateCreateRelevant||$authorities.TemplateSubmitReviewRelevant"
                >删除模板</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goDetail(scope.row.oldId,true)"
                  v-if="scope.row.oldId&&$authorities.TemplateSubmitReviewRelevant"
                >原数据详情</el-button>
              </div>
              <div v-if="status==2">
                <el-button
                  type="text"
                  size="small"
                  @click="goDetail(scope.row.id,false)"
                  v-if="$authorities.TemplateDetail"
                >模板详情</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goGroup(scope.row.id)"
                  v-if="$authorities.TemplateSubmitReviewRelevant && !scope.row.oldId"
                >编辑参数组</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="goParame(scope.row.id)"
                  v-if="$authorities.TemplateSubmitReviewRelevant && !scope.row.oldId"
                >编辑参数</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="deleteTem(scope.row.id)"
                  :disabled="scope.row.updateStatus=='已驳回'"
                  v-if="$authorities.TemplateCreateRelevant||$authorities.TemplateSubmitReviewRelevant"
                >删除模板</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.oldId&&$authorities.TemplateSubmitReviewRelevant"
                  @click="goDetail(scope.row.oldId,true)"
                >原数据详情</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block clearfix" v-if="total">
        <el-pagination
          style="float: right;margin-right: 20px;"
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10,20,30,40,50,100,500]" @size-change="handleSizeChange"
        ></el-pagination>
      </div>
      <importFile
      ref="importFile"
      :title="'参数模板批量导入'"
      :type="'Paramenter_Template_Template'"
      @callback="importCallback"
    ></importFile>
    </div>
  </div>
</template>
<script>
import Butt from "../../common/Button/index";
import TableHead from "@/components/common/TableHead/tablehead";
import { selectList, reviewReject } from "@/api/classManage";
import {
  templatelist,
  getNum,
  submit,
  categorydelete,
  ownauthority,
  hasTemplate
} from "@/api/templateManage";
import importFile from "@/components/common/module/ImportFile";
export default {
  inject: ["reload"],
  name: "TemplateAdmin",
  data() {
    return {
      availableNum: 0,
      pendingReviewNum: 0,
      drafNum: 0,
      rejectReviewNum: 0,
      page: 1,
      total: 0,
      isShow: true,
      selectId: null,
      classFirst: [],
      classSecond: [],
      classThird: [],
      classFirstid: null,
      classSecondid: null,
      classThirdid: null,
      status: 3,
      tableData: [],
      pageSize:10,
    };
  },
  components: { TableHead,importFile },
  activated() {
    if(Object.keys(this.$route.params).length===0&&Object.keys(this.$route.query).length===0){
      this.getFirst(1, 1);
      this.getData();
    }
    if (this.$route.params && this.$route.params.isUpdate) {
      this.getFirst(1, 1);
      this.getData();
    }else if(this.$route.query&&this.$route.query.status){
      switch(this.$route.query.status-0){
        case 0:
          this.status = 3
          break;
        case 1:
          this.status = 1
          break;
        case 2:{
          this.status = 0
          break;
        }
        case 3:
          this.status = 2
          break;
      }
      this.getFirst(1, 1);
      this.getData();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    handleSizeChange(val){
      this.pageSize = val;
      this.getData();
    },
    importfile() {
      this.$refs["importFile"].init();
    },
    importCallback() {
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    initdetail(id) {
      this.$router.push({
        name: "TemplateInitDetail",
        query: { id: id }
      });
    },
    goGroup(id) {
      ownauthority(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({ name: "ParamGroupList", query: { id: id } });
        }
      });
    },
    goParame(id) {
      ownauthority(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({ name: "ParameterList", query: { id: id } });
        }
      });
    },
    submitReview(id) {
      this.$confirm(
        "确定当前填写的信息无误，可以提交审核？",
        "提审确认",
        {}
      ).then(val => {
        submit(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "提交审核已成功",
              type: "success"
            });
            this.getData();
          }
        });
      });
    },
    goExamine(id) {
      hasTemplate(id).then(res => {
        if (res.code == "000000") {
          this.$router.push({
            name: "TemplateExamine",
            query: { id: id }
          });
        } else if (/^98/.test(res.code)) {
          this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.reload();
            }
          });
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    goDetail(id, idold) {
      this.$router.push({
        name: "TemplateDetail",
        query: { id: id, old: idold }
      });
    },
    getNumb() {
      getNum().then(res => {
        this.availableNum = res.data[3];
        this.pendingReviewNum = res.data[1];
        this.drafNum = res.data[0];
        this.rejectReviewNum = res.data[2];
      });
    },
    initList(status) {
      this.status = status;
      this.classThirdid = null;
      this.selectId = null;
      this.classFirstid = null;
      this.classSecondid = null;
      this.page = 1;
      this.getData();
      this.getNumb();
    },
    getData() {
      this.getNumb();
      var that = this;
      templatelist({
        categoryId: that.classThirdid,
        no: that.selectId,
        oneLevelCategoryId: that.classFirstid,
        twoLevelCategoryId: that.classSecondid,
        pageNum: that.page,
        pageSize:this.pageSize,
        status: that.status
      }).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    getFirst(level, pid) {
      selectList(level, pid).then(res => {
        if (res.code == "000000") {
          if (level == 1) {
            this.classFirst = res.data;
          } else if (level == 2) {
            this.classSecond = res.data;
          } else if (level == 3) {
            this.classThird = res.data;
          }
        }
      });
    },
    onchange1(val) {
      this.classFirstid = val;
      this.classSecondid = null;
      this.classThirdid = null;
      if (val) {
        this.getFirst(2, val);
      }
    },
    onchange2(val) {
      this.classSecondid = val;
      this.classThirdid = null;
      if (val) {
        this.getFirst(3, val);
      }
    },
    deleteTem(id) {
      this.$confirm(
        "删除之后，列表将不再展示该条数据，确定要删除吗？",
        "删除提示",
        {}
      ).then(val => {
        categorydelete(id).then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "删除分类已成功",
              type: "success"
            });
            this.getData();
          }
        });
      });
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .buttonBox {
    margin-top: 8px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      .myicon {
        font-weight: bold;
        color: #666;
        font-size: 20px;
        line-height: 50px;
        margin-right: 5px;
        margin-left: 20px;
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
    line-height: 50px;
  }
  .block {
    margin-top: 8px;
  }
}
</style>
