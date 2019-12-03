<template>
  <div class="adminBox">
    <div class="buttonBox">

    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span>虚拟仓编号：&nbsp;{{$route.query.no }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    虚拟仓名称：&nbsp;{{$route.query.name }}</span>

      </div>
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
          size="small">
          <el-table-column
            prop="id"
            label="仓库ID"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="仓库名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="organizationName"
            label="仓库归属组织机构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="categoryQty"
            label="分类数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="brandQty"
            label="品牌数量"
            align="center">
          </el-table-column>
          <el-table-column
            label="SKU数量" align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="goSKUWarehouseData(scope.row)">{{scope.row.skuQty}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="availableInventoryQty"
            label="可用库存总数"
            align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total=returnData.total>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    postVirtualWarehouseCreate,
    putVirtualWarehouseUpdated,
    deleteVirtualWarehouseDelete,
    getVirtualWarehouseDetaills,
    getVirtualWarehouseUpdateDetaills,
    postVirtualWarehouseList,
    postVirtualWarehouseRelatedList,
    postVirtualWarehouseSKUList,
    postWarehouseList
  } from '@/api/warehouse/virtualWarehouse'
  import Butt from '../../common/Button/index'
  export default {
    inject:['reload','close'],
    name: "RelevanceWarehouseData",
    data() {
      return {
        oldId:'',
        //查询
        query: {
          name: "",
          virtualWarehouseId:this.$route.query.id,
          warehouseId: 0,
          pageNum: 1,
          pageSize: 10,
        },
        returnData: {
          items: [],
          offset: 0,
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    activated() {
      if (this.oldId!=this.$route.query.id){
        this.oldId=this.$route.query.id;
        this.query.virtualWarehouseId=this.$route.query.id;
        this.postVirtualWarehouseRelatedList();
      }
    },
    mounted() {
      //this.postList();
      this.oldId=this.$route.query.id;
      this.postVirtualWarehouseRelatedList();

    },
    methods: {
      //跳转SKU
      goSKUWarehouseData(row) {
       this.$router.push({
          name: 'SKUWarehouseData',
          query: {
            id: row.id,
            no: row.no,
            name: row.name,
            organizationName:row.organizationName
          }
        });
      },

      //获取可用仓库列
      postVirtualWarehouseRelatedList(data) {
        //请求列表
        postVirtualWarehouseRelatedList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postList();
      },
    }
  }
</script>
<style scoped lang="less">
  .adminBox {
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
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        height: 48px;
        float: right;
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #BCBCBC;
          cursor: pointer;
          font-size: 12px;
        }
        span:hover {
          color: #303133;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 200px;
          height: 56px;
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
        span {
          font-size: 12px;
        }
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin-top: 10px;
      margin-right: 20px;
      text-align: right;
    }
    .dialog-box {
      position: relative;
      .tree {
        display: flex;
        justify-content: center;
      }
      .message-box {
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
