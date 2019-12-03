<template>
  <div class="inventoryBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="font-size: 14px"><i
            class="el-icon-arrow-up"></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow" style="font-size: 14px"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postInventoryList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="homeText">
            <div class="time-box">
              <span>仓库名称：</span>
              <el-select v-model="query.warehouseId" placeholder="仓库名称">
                <el-option
                  v-for="item in warehouseOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="time-box">
              <span>商品编号：</span>
              <el-input
                type="number"
                placeholder="商品编号"
                v-model="query.skuNo"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>商品关键词：</span>
              <el-input
                placeholder="商品关键词"
                v-model="query.keywords"
                clearable>
              </el-input>
            </div>
            <div class="time-box">
              <span>库存是否为零：</span>
              <el-select v-model="query.onlyShowZeroInventory" placeholder="库存是否为零">
                <el-option
                  v-for="item in inventoryOptionIs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>


            <div class="time-box">
              <span>一级分类：</span>
              <el-select v-model="query.firstCategory" clearable placeholder="一级分类" @change="firstChange">
                <el-option
                  v-for="item in firstClass"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="time-box">
              <span>二级分类：</span>
              <el-select v-model="query.secondCategory" clearable placeholder="二级分类" @change="secondChange">
                <el-option
                  v-for="item in secondClass"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="time-box">
              <span>三级分类：</span>
              <el-select v-model="query.thirdCategory" clearable placeholder="三级分类" @change="thirdChange">
                <el-option
                  v-for="item in thirdClass"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>

        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          stripe
          style="width: 100%"
          tooltip-effect="dark"
          size="small">
          <el-table-column
            prop="skuNo"
            label="商品编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="所属仓库"
            align="center">
            <template slot-scope="scope">
              <el-button @click="openWarehouseDetaills(scope.row)"
                         type="text" size="small">{{scope.row.warehouseName}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="thirdLevelCategoryName"
            label="所属分类"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="brandName"
            label="商品品牌"
            align="center">
          </el-table-column>
          <el-table-column
            prop="primaryAttributeValue"
            label="商品主键"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="websitePrice"
            label="官网售价"
            align="center">
          </el-table-column>
          <el-table-column
            prop="availableQty"
            label="可用库存"
            align="center">
          </el-table-column>
          <el-table-column
            prop="qty"
            label="在库库存"
            align="center">
          </el-table-column>
          <el-table-column
            prop="costTax"
            label="成本价（含税）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="costTaxAmount"
            label="成本小计（含税）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="cost"
            label="成本价（不含税）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="costAmount"
            label="成本小计（不含税）"
            align="center">
          </el-table-column>

        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="returnData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogDetaills" width="800px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">仓库信息</span>
      </div>
      <div class="message-box">
        <div class="detaillTable">
          <table border="1">
            <tr>
              <th><i>*</i>仓库ID：</th>
              <td>{{tableData.id}}</td>
              <th><i>*</i>仓库名称：</th>
              <td>{{tableData.name}}</td>
            </tr>
            <tr>
              <th><i>*</i>仓库类型：</th>
              <td>
                <span v-if="tableData.type == '1'">RDC</span>
                <span v-if="tableData.type == '2'">DC</span>
                <span v-if="tableData.type == '3'">FDC</span>
              </td>
              <th><i></i>归属组织机构：</th>
              <td>{{tableData.organizationName}}</td>
            </tr>
            <tr v-for="item,index in tableData.warehouseContactDTOList">
              <th><i>*</i>仓库联系人：</th>
              <td>{{item.name}}</td>
              <th><i>*</i>仓库联系人电话：</th>
              <td>{{item.phone}}</td>
            </tr>
            <tr>
              <th><i>*</i>仓库地址：</th>
              <td colspan="3">{{tableData.addressLine}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetaills = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {postInventoryList} from "@/api/warehouse/inventory"
  import {
    getTaxcodeSearch,
    postConfirmCode,
    postConfirmSelectCode,
    postCategoryCodeList,
  } from '@/api/finance/classCode'
  import {provinces_based_id, postSupplierOptions, postBrandOptions, deleteFileDelete} from "@/api/common/commonApi"
  import {
    postWarehouseDvailableList,
    getWarehouseViewedby,
    getWarehouseDetaills
  } from '@/api/warehouse/warehouseAdmin'
  import {selectList} from '@/api/classManage'
  import {addTemplate} from '@/api/templateManage'

  export default {
    inject: ['reload'],
    name: "InventoryAdmin",
    data() {
      return {
        //查询
        query: {
          skuNo: '',
          firstCategory: null,
          keywords: "",
          onlyShowZeroInventory: false,
          //"organizationId: this.$auth.user.userPosts[0].organizationId,
          organizationId: 0,
          pageNum: 1,
          pageSize: 10,
          secondCategory: null,
          skuId: null,
          thirdCategory: null,
          warehouseId: null
        },
        firstClass: [],
        secondClass: [],
        thirdClass: [],
        warehouseOption: '',
        inventoryOptionIs: [
          {
            name: '是',
            id: true
          },
          {
            name: '否',
            id: false
          }
        ],
        dialogDetaills: false,
        returnData: {
          items: [
//            {
//              "availableQty": 0,
//              "brandName": "string",
//              "categoryName": "string",
//              "mainSitePrice": 0,
//              "primaryAttributeValue": "string",
//              "skuId": 0,
//              "unit": "string",
//              "warehouseId": 1,
//              "warehouseName": "string"
//            }
          ],
          offset: '',
          pageNum: 0,
          pageSize: 0,
          total: 0,
        },
        //删选显示
        isShow: true,
        //表格数据
        tableData: {},
        //翻页
        currentPage: 1,
      }
    },
    computed: {
      loading() {
        return this.$store.getters.loading
      },
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    created() {
      this.getFirst();
      this.postInventoryList();
      this.getWarehouseViewedby();
    },
    mounted() {

    },
    methods: {
      reset(){
        this.query={
          skuNo: '',
          firstCategory: null,
          keywords: "",
          onlyShowZeroInventory: false,
          //"organizationId: this.$auth.user.userPosts[0].organizationId,
          organizationId: 0,
          pageNum: 1,
          pageSize: 10,
          secondCategory: null,
          skuId: null,
          thirdCategory: null,
          warehouseId: null
        },
          this.postInventoryList();
      },
      //获取可用仓库列
      getWarehouseViewedby() {
        //请求列表
        getWarehouseViewedby(
        ).then((res) => {
          console.log(res)
          this.warehouseOption = res.data;
          this.warehouseOption.unshift({id: 0, name: '全部'})
        }).catch(err => {
          console.log(err)
        });
      },
      //获取列表
      postInventoryList() {
        postInventoryList(
          this.query
        ).then((res) => {
          this.returnData = res.data;
          console.log(res);
        }).catch(err => {
          console.log(err);
        });
      },
      //三级分类联动
      getFirst() {
        selectList(1, 1).then(res => {
          if (res.code == '000000') {
            this.firstClass = res.data;
          }
        })
      },
      getSecond(val) {
        selectList(2, val).then(res => {
          if (res.code == '000000') {
            this.secondClass = res.data;
          }
        })
      },
      getThird(val) {
        selectList(3, val).then(res => {
          if (res.code == '000000') {
            this.thirdClass = res.data;
          }
        })
      },
      firstChange(val) {
        this.query.secondCategory = null;
        this.query.thirdCategory = null;
        if (val) {
          this.getSecond(val);
        }
      },
      secondChange(val) {
        this.query.thirdCategory = null;
        if (val) {
          this.getThird(val);
        }
      },
      thirdChange(val) {
        this.thirdCategoryId = val;
      },
      //打开详情
      openWarehouseDetaills(row) {
        getWarehouseDetaills(
          row.warehouseId
        ).then((res) => {
          this.tableData = res.data;
          this.dialogDetaills = !this.dialogDetaills;
        }).catch(err => {
          console.log(err);
        });
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postInventoryList();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postInventoryList();
      },
    }
  }
</script>
<style scoped lang="less">
  .inventoryBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .btnactive {
        background: #399;
        color: #fff;
        border: solid 1px #399;
      }
      .el-button {
        width: 160px;
        height: 30px;
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
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #333;
        }
      }
      .rightBox {
        height: 48px;
        float: right;
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #333;
          cursor: pointer;
          font-size: 12px;
        }
        span:hover {
          color: #333;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        .homeText {

          span {
            width: 100px;
            text-align: right;
          }
          .el-input {
            width: 200px;
            height: 50px;font-size: 14px;
            line-height: 56px;
          }
          .time-box {
            display: inline-block;
            padding: 5px 10px;
            font-size: 14px;
          }
          .el-select {
            width: 200px;
            line-height: 56px;
          }
        }
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;

        .el-input {
          width: 200px;
          line-height: 56px;
          margin-left: 10px;
        }
        .el-select {
          margin-left: 10px;
          line-height: 56px;
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
        .el-button {
          width: 80px;
          height: 30px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
          margin-left: 0px;
        }
      }
    }
    .block {
      margin-top: 10px;
      margin-right: 20px;
      text-align: right;
    }
    .dowBox {
      .dowInfo {
        margin-bottom: 20px;
        span {
          height: 40px;
          line-height: 40px;
          i {
            color: red;
          }
        }
      }
    }

    .dialog-box {
      position: relative;
      .tree {
        display: flex;
        justify-content: center;
      }
      .message-box {
        .detaillTable {
          table {
            width: 90%;
            margin: 20px auto;
            td, th {
              border: 1px solid #d1d1d1;
              font-size: 12px;
              height: 53px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            th {
              background: #f5f7fa;
              color: #303133;
              text-align: right;
              width: 20%;
              i {
                color: red;
              }
            }
            td {
              color: #666666;
              text-align: left;
              padding-left: 10px;
              width: 30%;
            }
          }
        }
        padding: 0px 20px;
        font-size: 14px;
        color: #666;
        .el-input {
          width: 80%;
        }
        .first-step-box {
          padding: 20px 0;
          .first-step {
            color: red;
            font-size: 18px;
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .second-step-box {
          display: flex;
          padding: 20px 0;
          align-items: center;
          .input-box-file {
            width: 120px;
            margin-left: 20px;
            position: relative;
            cursor: pointer;
            .input-button {
              width: 120px;
              height: 30px;
              border: 1px solid #d1d1d1;
              color: #999;
              border-radius: 4px;
              line-height: 30px;
              font-size: 14px;
              text-indent: 10px;
              cursor: pointer;
            }
          }
        }
        .tip {
          display: flex;
          color: red;
          line-height: 30px;
        }

      }
      .dialog-title {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 50px;
        background-color: #f3f3f3;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        .reject-title {
          font-size: 16px;
          font-weight: bold;
          color: #666;
        }
      }
      .dialog-footer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #d1d1d1;
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }
</style>
