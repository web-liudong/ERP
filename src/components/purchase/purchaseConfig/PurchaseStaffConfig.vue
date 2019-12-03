<template>
  <div class="detaillBox">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="detaillTable">
          <div class="add-head">
            <i class="iconfont iconjinridingdanshu"></i>
            <p class="add-class-text">采购员</p>
          </div>
          <el-table
            :data="tableData"
            border
            max-height="500"
            class="table"
            size="small"
            ref="tableSource"
            v-if="tableData"
          >
            <el-table-column prop="id" label="序号" align="center">
              <template slot="header" slot-scope="scope">
                <div>
                  <p style="line-height: 20px;height: 50px;">序号</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="账号" align="center" width="150">
              <template slot="header" slot-scope="scope">
                <div style="line-height: 10px;">
                  <p style="line-height: 20px;">账号</p>
                  <el-input v-model="query.userName" clearable @change="changeQuery" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="realName" label="采购员名称" align="center" width="150">
              <template slot="header" slot-scope="scope">
                <div style="line-height: 10px;">
                  <p style="line-height: 20px;">采购员名称</p>
                  <el-input v-model="query.realName" clearable @change="changeQuery" />
                  <!-- <el-select
                    v-model="query.realName"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    @change="changeQuery"
                    :remote-method="remoteMethod"
                    >
                    <el-option
                      v-for="item in options4"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.realName">
                    </el-option>
                  </el-select>-->
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="userPosts[0].organizationName"
              label="组织机构"
              align="center"
              width="200"
            >
              <template slot="header" slot-scope="scope">
                <div style="line-height: 10px;">
                  <p style="line-height: 20px;height: 60px;">组织机构</p>
                  <!-- <el-input v-model="query.organizationId" clearable @change="changeQuery"/> -->
                  <!-- <el-select
                    v-model="query.organizationId"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    @change="changeQuery"
                    :remote-method="remoteMethod1"
                    >
                    <el-option
                      v-for="it in options3"
                      :key="it.id"
                      :label="it.name"
                      :value="it.id">
                    </el-option>
                  </el-select>-->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="120">
              <template slot="header" slot-scope="scope">
                <div style="line-height: 10px;">
                  <p style="line-height: 20px;">状态</p>
                  <el-select v-model="query.status" placeholder="请选择" @change="changeQuery">
                    <el-option label="全部" value></el-option>
                    <el-option label="启用" value="0"></el-option>
                    <el-option label="禁用" value="1"></el-option>
                  </el-select>
                </div>
              </template>
              <template slot-scope="scope">{{scope.row.status == 0 ? '启用' : '禁用'}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100" fixed="right">
              <template slot="header" slot-scope="scope">
                <div>
                  <p style="line-height: 20px;height: 50px;">操作</p>
                </div>
              </template>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="opaConfig(scope.row.id,1)"
                  v-if="$authorities.PurchaseStaffSet"
                >设置</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="opaConfig(scope.row.id,2)"
                  v-if="$authorities.PurchaseStaffShow"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="query.pageNum"
            :page-sizes="[10,20,30,40,50,100,500]"
            :page-size="query.pageSize"
            layout="total,sizes,prev, pager, next, jumper"
            :total="totalPage"
          ></el-pagination>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="detaillTable">
          <div class="add-head">
            <i class="iconfont iconjinridingdanshu"></i>
            <p class="add-class-text">采购目录</p>
          </div>
          <div class="category">
            <span>采购权限：</span>
            <el-radio-group v-model="category" @change="changeCategory">
              <el-radio :label="1">品类</el-radio>
              <el-radio :label="2">品牌</el-radio>
              <!-- <el-radio :label="3">商品</el-radio> -->
            </el-radio-group>
          </div>
          <div class="cardwrap" v-show="showId && category == 1">
            <el-card
              class="box-card"
              shadow="hover"
              :body-style="{ height: '300px', overflow: 'auto' }"
              v-if="showType == 1"
            >
              <div slot="header" class="clearfix">
                <span>品类名称</span>
                <el-input
                  size="mini"
                  v-model="categoryName"
                  placeholder="请输入品类名称"
                  @change="queryCategory"
                ></el-input>
              </div>
              <el-tree
                ref="sourceTree"
                :data="source"
                show-checkbox
                node-key="id"
                empty-text="没有该品类的商品"
                :props="defaultProps"
                :default-checked-keys="defaultSelect"
                @check="getnode"
              ></el-tree>
            </el-card>
            <el-card
              class="box-card"
              shadow="hover"
              :body-style="{ height: '300px', overflow: 'auto'  }"
            >
              <div slot="header" class="clearfix">
                <span>已选品类</span>
                <el-input
                  size="mini"
                  v-model="categorySelectName"
                  placeholder="请输入品类名称"
                  @change="queryCategorySelect"
                  v-if="showType == 2"
                ></el-input>
              </div>
              <el-tree
                ref="targetTree"
                :data="initSource"
                node-key="id"
                empty-text="未选择品类"
                :filter-node-method="filterNode"
                :default-expand-all="true"
                :props="defaultProps"
                v-if="showType == 1"
              ></el-tree>
              <el-tree
                ref="detailsTree"
                :data="detailsSource"
                empty-text="未选择品类"
                v-if="showType == 2"
              ></el-tree>
            </el-card>
          </div>
          <div
            class="detaillTable"
            style="border-left: none;border-right: none;"
            v-show="showId && category == 2"
          >
            <el-table
              :data="brandTableData"
              ref="brandTable"
              style="border:none;"
              max-height="370"
              @select="handleSelectionRow"
              @selection-change="handleSelectionChange"
              class="table"
              size="small"
            >
              <el-table-column type="selection" v-if="showType == 1"></el-table-column>
              <el-table-column prop="$index" label="序号" align="center" width="50">
                <template slot="header" slot-scope="scope">
                  <p style="line-height: 20px;height: 50px;" v-if="showType == 1">序号</p>
                  <p style="line-height: 20px;height: 26px;" v-else>序号</p>
                </template>
                <template slot-scope="scope">
                  <p style="line-height: 20px;height: 26px;">{{scope.$index+1}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="no" label="品牌ID" align="center">
                <template slot="header" slot-scope="scope">
                  <div style="line-height: 10px;">
                    <p style="line-height: 20px;">品牌编号</p>
                    <el-input
                      v-model="queryBrand.brandNo"
                      type="number"
                      clearable
                      @change="changeBrandQuery"
                      v-if="showType == 1"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="brandName" label="品牌名称" align="center">
                <template slot="header" slot-scope="scope">
                  <div style="line-height: 10px;">
                    <p style="line-height: 20px;">品牌名称</p>
                    <el-input
                      v-model="queryBrand.brandName"
                      clearable
                      @change="changeBrandQuery"
                      v-if="showType == 1"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="brandStatusText" label="状态" align="center">
                <template slot="header" slot-scope="scope">
                  <p style="line-height: 20px;height: 50px;" v-if="showType == 1">状态</p>
                  <p style="line-height: 20px;height: 26px;" v-else>状态</p>
                </template>
                <template slot-scope="scope">
                  <span>可用</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="more" @click="getStaffBrandMore" v-if="queryBrand.pageNum*queryBrand.pageSize < totalBrandPage">
              <p>加载更多...</p>
            </div>
          </div>
          <!-- <div class="detaillTable" v-else-if="showId && category == 3">
            <el-table :data="skuTableData" border max-height="500" class="table" size="small">
              <el-table-column type="selection" v-if="showType == 1"></el-table-column>
              <el-table-column prop="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="account" label="商品ID" align="center"></el-table-column>
              <el-table-column prop="username" label="商品名称" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" align="center"></el-table-column>
            </el-table>
          </div>-->
          <div class="infoTotal" v-if="showId && showType == 1">
            <el-button type="primary" @click="saveCategory">保存</el-button>
            <el-button type="primary" @click="cancelCategory">取消</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { inplaceList, simpleList, listName } from "@/api/userService";
import {
  getStaffSetupInit,
  setStaffCategory,
  getStaffCategoryDetail,
  getStaffBrandInit,
  setStaffBrand,
  getStaffBrandDetail
} from "@/api/purchase/purchaseConfig";
import { returnFloat } from "@/utils/index";
import { fail } from "assert";
export default {
  name: "PurchaseStaffConfig",
  data() {
    return {
      showType: 1, //查看还是设置
      showId: null,
      tableData: null,
      brandTableData: null,
      skuTableData: null,
      totalPage: 0,
      totalBrandPage: 0,
      category: 1, //采购权限类别
      categoryArr: [],
      source: [],
      initSource: [],
      detailsSource: [],
      brandIdSelectionAll:[],//所有已选中的品牌集合
      multipleSelection:[],//选中的品牌集合-当前页
      tempOpa: [], //临时查询品类后的操作记录
      defaultSelect: [],
      defaultSubSelect: [], //部分默认选择项
      defaultProps: {
        children: "children",
        label: "label"
      },
      options4: [],
      options3: [],
      query: {
        id: "",
        realName: "",
        organizationId: "",
        status: "0",
        userName: "",
        pageNum: 1,
        pageSize: 10
      },
      queryBrand: {
        brandNo:"",
        brandName: "",
        pageNum: 1,
        pageSize: 10
      },
      categoryName: "",
      categorySelectName: "",
      idArr: [], //全数据时候的选中id
      idArrTemp: [], //查询关键字数据选中的id
      curDataAll: true, //当前list数据是否是全部数据
    };
  },
  mounted() {
    this.$auth.user.userPosts.length &&
      (this.query.organizationId = this.$auth.user.userPosts[0].organizationId);
    this.getDataList();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getDataList();
    }
  },
  components: {
    addhead
  },
  computed: {},
  methods: {
    getDataList() {
      inplaceList(this.query).then(res => {
        if (res.code == "000000") {
          this.tableData = res.data.items;
          this.totalPage = res.data.total;
          this.$nextTick(() => {
            this.$refs.tableSource.bodyWrapper.scrollTop = 0;
          });
        }
      });
    },
    getStaffSetupInit(isInit) {
      getStaffSetupInit(this.showId, { categoryName: this.categoryName }).then(
        res => {
          this.source = this.formatData(res.data);
          //有操作修改默认项
          if (this.categoryName == "") {
            this.setDafaultSelect();
          }
          if (isInit) {
            this.curDataAll = true;
            this.initSource = this.source.slice(0);
          } else {
            this.curDataAll = false;
          }
          if (this.showType == 1) {
            this.$nextTick(() => {
              this.getnode();
            });
          }
        }
      );
    },
    getStaffCategoryDetail() {
      getStaffCategoryDetail(this.showId, {
        categoryName: this.categorySelectName
      }).then(res => {
        this.detailsSource = this.formatData(res.data);
      });
    },
    getStaffBrandInit(isQuery) {
      getStaffBrandInit(this.showId, this.queryBrand).then(res => {
        this.brandTableData = res.data.pageInfo.items;
        if (!isQuery) {
          this.brandIdSelectionAll = res.data.brandIdInitSet;
        }
        this.totalBrandPage = res.data.pageInfo.total;
        this.setDefaultSelection();
      });
    },
    getStaffBrandMore() {
      this.queryBrand.pageNum++;
      let fn = this.showType == 1 ? getStaffBrandInit : getStaffBrandDetail;
      fn(this.showId, this.queryBrand).then(res => {
        if(this.showType == 1){
          this.brandTableData = [...this.brandTableData,...res.data.pageInfo.items];
          this.setDefaultSelection();
        }else{
          this.brandTableData = [...this.brandTableData,...res.data.items];
        }
      });
    },
    getStaffBrandDetail() {
      getStaffBrandDetail(this.showId, this.queryBrand).then(res => {
        this.brandTableData = res.data.items;
        this.totalBrandPage = res.data.total;
      });
    },
    changeCategory(val){
      if(this.showId){
        this.opaConfig(this.showId, this.showType);
      }
    },
    formatData(arr) {
      let temp = arr.map((value, index, array) => {
        let obj = {
          id: value.id,
          label: value.name
        };
        if (value.subCategoryList.length) {
          obj["children"] = this.formatData(value.subCategoryList);
        } else {
          if (this.showType == 1 && value.flag == 0) {
            if (this.categoryName == "") {
              this.defaultSelect.push(value.id);
            } else {
              this.defaultSubSelect.push(value.id);
            }
          }
        }
        return obj;
      });
      return temp;
    },
    getnode(data, node) {
      if (this.curDataAll) {
        this.idArr = this.$refs.sourceTree.getCheckedKeys();
      } else {
        //计算增加还是减少了选项
        if (node) {
          let isChange = node.checkedKeys.length > this.idArrTemp.length;
          let arrChange;
          if (isChange) {
            arrChange = node.checkedKeys.filter(item => {
              return this.idArrTemp.indexOf(item) === -1;
            });
            this.idArr = this.idArr.concat(arrChange);
          } else {
            arrChange = this.idArrTemp.filter(item => {
              return node.checkedKeys.indexOf(item) === -1;
            });
            //删除idArr中减少项
            let temp = [];
            this.idArr.forEach(a => {
              let c = arrChange.findIndex(b => a === b);
              if (c > -1) delete arrChange[c];
              else temp.push(a);
            });
            this.idArr = temp;
          }
        }

        this.idArrTemp = this.$refs.sourceTree.getCheckedKeys();
      }
      //this.options10=i
      this.$refs.targetTree.filter(this.idArr);
      this.$refs.targetTree.setCheckedKeys(this.idArr);

      this.categoryArr = this.$refs.targetTree.getCheckedKeys(true);
      console.log(this.categoryArr);
    },
    filterNode(value, data) {
      if (!value) return false;
      return value.includes(data.id);
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getDataList();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getDataList();
    },
    opaConfig(id, type) {
      this.showType = type;
      this.showId = id;
      //品牌
      if (this.category == 2) {
        this.opaConfigForBrand(type);
        return false;
      }
      this.clearTempData();
      if (type == 1) {
        this.categoryName = "";
        this.getStaffSetupInit(true);
      } else {
        this.categorySelectName = "";
        this.getStaffCategoryDetail();
      }
    },
    clearTempData() {
      this.source = [];
      this.defaultSelect = [];
      this.defaultSubSelect = [];
    },
    opaConfigForBrand(type) {
      this.queryBrand.pageNum = 1;
      this.queryBrand.brandNo = "";
      this.queryBrand.brandName = "";
      if (type == 1) {
        this.getStaffBrandInit();
      } else {
        this.getStaffBrandDetail();
      }
    },
    handleSelectionRow(selection, row){
      let temp = selection.filter(item => {
        return item.brandId == row.brandId
      })
      if(temp.length){
        this.brandIdSelectionAll.push(row.brandId);
      }else{
        let index = this.brandIdSelectionAll.indexOf(row.brandId);
        this.brandIdSelectionAll.splice(index, 1);
      }

      console.log(this.brandIdSelectionAll);
    },
    handleSelectionChange(selection) {
      //全部选中
      if(selection.length){
        selection.forEach((item)=>{
          if(this.brandIdSelectionAll.indexOf(item.brandId) == -1){
            this.brandIdSelectionAll.push(item.brandId);
          }
        })
      }else{
        this.brandTableData.forEach(item => {
          let index = this.brandIdSelectionAll.indexOf(item.brandId);
          if(index > -1){
            this.brandIdSelectionAll.splice(index, 1);
          }
        })
      }
    },
    setDefaultSelection() {
      this.$nextTick(() => {
        this.brandTableData.forEach(row => {
          if(row.index == 0){
            this.$refs["brandTable"].toggleRowSelection(row, true);
          }
        });
      })
      
    },
    saveCategory() {
      //品牌
      if (this.category == 2) {
        this.saveCategoryForBrand();
        return false;
      }
      // if (!this.categoryArr.length) {
      //   this.$message({
      //     type: "warning",
      //     message: "请选择品类"
      //   });
      //   return false;
      // }
      setStaffCategory(this.showId, this.categoryArr).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "采购品类权限设置成功"
          });
        }
      });
    },
    cancelCategory() {
      //品牌
      if (this.category == 2) {
        this.$refs["brandTable"].clearSelection();
        this.setDefaultSelection();
        return false;
      }
      let arr;
      if (this.categoryName == "") {
        arr = this.defaultSelect.map(value => {
          return { id: value };
        });
      } else {
        arr = this.defaultSubSelect.map(value => {
          return { id: value };
        });
      }

      this.$refs.sourceTree.setCheckedNodes(arr);
      this.getnode();
    },
    saveCategoryForBrand() {
      // if (!this.multipleSelection.length) {
      //   this.$message({
      //     type: "warning",
      //     message: "请选择要设置的品牌"
      //   });
      //   return false;
      // }
      // let ids = [];
      // this.multipleSelection.forEach(item => {
      //   ids.push(item.brandId);
      // })
      setStaffBrand(this.showId, this.brandIdSelectionAll).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "采购品牌权限设置成功"
          });
        }
      });
    },
    queryCategory(str) {
      this.categoryName = str;
      if (this.defaultSubSelect.length) {
        this.queryCategoryOpaRecord(this.defaultSubSelect, this.categoryArr);
        this.defaultSubSelect = [];
      }
      this.getStaffSetupInit(false);
    },
    //保存操作数据记录
    queryCategoryOpaRecord(oldArr, newArr) {
      let obj = {},
        remove = oldArr.filter(item => newArr.indexOf(item) == -1),
        add = newArr.filter(item => oldArr.indexOf(item) == -1);
      if (remove.length) {
        obj["remove"] = remove;
      }
      if (add.length) {
        obj["add"] = add;
      }
      if (obj.add || obj.remove) {
        this.tempOpa.push(obj);
      }
    },
    setDafaultSelect() {
      if (this.tempOpa.length) {
        this.tempOpa.forEach((item, index, arr) => {
          if (item.add) {
            this.defaultSelect = this.defaultSelect.concat(item.add);
          }
          if (item.remove) {
            this.defaultSelect = this.defaultSelect.filter(
              item => item.remove.indexOf(item) == -1
            );
          }
        });
        this.tempOpa = [];
      }
    },
    changeQuery() {
      this.query.pageNum = 1;
      this.getDataList();
    },
    changeBrandQuery() {
      this.queryBrand.pageNum = 1;
      this.getStaffBrandInit(true);
    },
    remoteMethod(query) {
      if (query !== "") {
        simpleList({ userName: query, isQueryAllStatus: true }).then(res => {
          this.options4 = res.data;
        });
      } else {
        this.options4 = [];
      }
    },
    remoteMethod1(query) {
      if (query !== "") {
        listName({ name: query }).then(res => {
          this.options3 = res.data;
        });
      } else {
        this.options3 = [];
      }
    },
    queryCategorySelect(str) {
      this.categorySelectName = str;
      this.getStaffCategoryDetail();
    },
    formatPrice(row, col, cellValue) {
      return returnFloat(cellValue);
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .add-head {
    width: 100%;
    height: 40px;
    background-color: #f3f3f3;
    padding-left: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    .myicon {
      font-size: 23px;
      margin-top: 3px;
    }
    .add-class-text {
      color: #666;
      margin-left: 5px;
    }
    .btns {
      position: absolute;
      right: 0;
      display: flex;
    }
    .button-head {
      width: 80px;
      height: 30px;
      margin-right: 10px;
      border: 1px solid #d1d1d1;
      cursor: pointer;
      background-color: #fff;
      line-height: 30px;
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      .button-head-icon {
        margin-right: 5px;
      }
      .icon-add {
        font-size: 12px;
      }
    }
  }
  .button-head:hover {
    color: #339999;
    border-color: #c2e0e0;
    background-color: #ebf5f5;
  }
  .block {
    margin-top: 10px;
    text-align: right;
  }
  .cardwrap {
    display: flex;
    padding: 10px;
    .box-card {
      flex: 1;
      margin: 0 10px 10px;
    }
  }
  .detaillTable {
    border: 1px solid #d1d1d1;
    .category {
      line-height: 40px;
      span {
        padding: 0 10px;
      }
      .el-radio {
        margin-right: 0;
      }
    }
    table {
      width: 90%;
      margin: 20px auto;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 12px;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        padding-right: 6px;
        box-sizing: border-box;
        color: #666;
        font-weight: 700;
        font-size: 14px;
        text-align: right;
        width: 20%;
        background-color: #f9fafc;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 10px;
        width: 30%;
        line-height: 20px;
        span {
          margin-right: 10px;
          display: inline-block;
        }
      }
      .tit {
        text-align: left;
        padding-left: 10px;
      }
    }
    .el-input,
    .el-select {
      font-size: 12px;
      padding: 0 4px;
      line-height: 30px;
    }

    .setAddr {
      margin-left: 10px;
    }
    .infoTotal {
      padding: 10px 0;
      line-height: 24px;
      text-align: center;
    }
    .button-box {
      display: flex;
      justify-content: center;
      width: 90%;
      margin: 20px auto;
      .el-button {
        margin: 0 20px;
      }
    }
    .more {
      display: flex;
      align-items: center;
      height: 30px;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 30px;
        background: #e4e4e4;
        cursor: pointer;
      }
    }
  }
}
</style>
<style scoped>
.detaillTable >>> .first-row {
  background: #f5f7fa;
  color: #aaa;
  font-weight: bold;
}
.detaillTable >>> .el-card__header {
  padding: 8px 20px;
  height: 60px;
}
.detaillTable >>> .el-select > .el-input {
  padding: 0;
}
.detaillTable >>> .el-input__inner {
  padding: 0 5px;
  line-height: 30px;
  height: 30px;
}
.detaillTable >>> .el-tree__empty-text {
  position: relative;
  left: 0;
  top: 0;
}
</style>