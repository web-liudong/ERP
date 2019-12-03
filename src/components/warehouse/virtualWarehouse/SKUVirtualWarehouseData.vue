<template>
  <div class="adminBox">
    <div class="buttonBox">
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span>虚拟仓编号：&nbsp;{{$route.query.no
        }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    虚拟仓名称：&nbsp;{{$route.query.name }}</span>
      </div>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up"></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postVirtualWarehouseSKUList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="goReset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">商品编号：</span>
          <el-input
            type="number"
            placeholder="商品编号"
            v-model="query.skuNo"
            clearable>
          </el-input>
          <span style="margin-left:20px;">商品名称：</span>
          <el-input
            placeholder="商品名称"
            v-model="query.skuName"
            clearable>
          </el-input>
          <span style="margin-left:20px;">品牌名称：</span>
          <el-input
            placeholder="品牌名称"
            v-model="query.brandName"
            clearable>
          </el-input>
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
          size="small">
          <el-table-column
            prop="skuNo"
            label="商品编号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="skuName"
            label="商品名称"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属分类" align="center">
            <template slot-scope="scope">
              {{scope.row.categoryCable}}
            </template>
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="品牌"
            align="center">
          </el-table-column>
          <el-table-column
            prop="primaryAttributeValue"
            label="主键"
            align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            label="可用库存总数"
            align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="clickDialogQty(scope.row)">{{scope.row.availableQty}}
              </el-button>
            </template>
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
    <el-dialog :visible.sync="dialogQty" width="800px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">商品库存信息</span>
      </div>
      <div class="message-box">
        <div class="detaillTable">
          <table border="1">
            <tr>
              <th>商品编号：</th>
              <td>{{skuDetailData.skuNo}}</td>
              <th>商品名称：</th>
              <td>{{skuDetailData.brandName}}</td>
            </tr>
            <tr>
              <th><i></i>品牌：</th>
              <td>{{skuDetailData.brandName}}</td>
              <th><i></i>主键：</th>
              <td>{{skuDetailData.primaryKey}}</td>
            </tr>
            <tr>
              <th><i></i>单位：</th>
              <td>{{skuDetailData.unit}}</td>
              <th><i></i>可用库存总数：</th>
              <td>{{skuDetailData.availableQty}}</td>
            </tr>
          </table>
        </div>
        <el-table
          :data="skuDetailData.virtualWarehouAvailableInventoryDTOS"
          max-height="350"
          border
          stripe
          style="width: 100%;margin-bottom: 20px;">
          <el-table-column
            prop="warehouseName"
            label="实体仓名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="organizationName"
            label="仓库归属组织机构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="availableQty"
            label="商品可用库存数"
            align="center">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogQty = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    postVirtualWarehouseSkuDetail,
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
    inject: ['reload'],
    name: "SKUVirtualWarehouseData",
    data() {
      return {
        oldId:'',
        dialogQty : false,
        skuDetailData:{},
        //查询
        query: {
          skuNo:'',
          brandName: "",
          skuId: '',
          skuName: "",
          virtualWarehouseId: this.$route.query.id,
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
        QtyData:{

        },
        //删选显示
        isShow: true,
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    activated() {
      if (this.oldId != this.$route.query.id){
        this.oldId=this.$route.query.id;
        this.query.virtualWarehouseId=this.$route.query.id;
        this.postVirtualWarehouseSKUList();
      }
    },
    mounted() {
      //this.postList();
      this.postVirtualWarehouseSKUList();

    },
    methods: {
      goReset(){
        this.query.skuNo = '';
        this.query.skuName = '';
        this.query.brandName = '';
        this.postVirtualWarehouseSKUList();
      },
      clickDialogQty(row){
        postVirtualWarehouseSkuDetail(
          {
            skuId: row.skuId,
            virtualWarehouseId: this.query.virtualWarehouseId
          }
        ).then((res) => {
          if (res.code == '000000') {
            this.skuDetailData = res.data;
            this.dialogQty=true
          } else {
            this.$message({
              message: '库存详情获取失败',
              type: 'warning',
            })
          }
        }).catch(err => {
          console.log(err)
        });

      },
      //获取
      postVirtualWarehouseSKUList(data) {
        //请求列表
        postVirtualWarehouseSKUList(
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
        this.postVirtualWarehouseSKUList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postVirtualWarehouseSKUList();
      },
      //筛选show
      showHelp() {
        this.isShow = !this.isShow;
      }
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
        /*width: 160px;*/
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
          color: #303030;
          cursor: pointer;

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
      margin: 10px 0 0 0;
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
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .message-box {
        padding: 0px 20px;
        font-size: 14px;
        color: #666;
        .detaillTable {
          border: 1px solid #d1d1d1;
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
