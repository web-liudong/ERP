<template>
  <div class="adminBox">
    <div class="buttonBox">
      <el-button size="small"
                 v-for="item,index in btnData"
                 :key="index"
                 :class="{btnactive:index==active}"
                 @click="btnActive(index,item.statusName)">
        {{item.statusName}}({{item.statusCount}})
      </el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"> <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up" ></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="queryResult()">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">仓库ID：</span>
          <el-input
            placeholder="仓库ID"
            v-model="query.id"
            clearable>
          </el-input>
          <span style="margin-left:20px;">仓库名称：</span>
          <el-input
            placeholder="仓库名称"
            v-model="query.name"
            clearable>
          </el-input>
          <span style="margin-left:20px;">请选择仓库类型：</span>
          <el-select v-model="query.type" placeholder="请选择仓库类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <router-link :to="{name:'WarehouseAdd'}" v-show="$authorities.WarehouseAdminCreateRelevant" target="_blank">
            <el-button size="small" icon="el-icon-plus">添加</el-button>
            <!--<div class="white-btn fun-btn"><i class="icon iconfont icon-add"></i>添加</div>-->
          </router-link>
        </div>
        <el-table
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
            <template slot-scope="scope">
              <span v-if="scope.row.status == '3'">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="仓库名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="type"
            label="仓库类型"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == '1'">RDC</span>
              <span v-if="scope.row.type == '2'">DC</span>
              <span v-if="scope.row.type == '3'">FDC</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="addressLine"
            label="仓库地址"
            align="center">
          </el-table-column>
          <el-table-column
            prop="warehouseCntactDTOS"
            label="仓库联系人"
            align="center">
            <template slot-scope="scope">
              <span v-for="item,index in scope.row.warehouseContactDTOS">{{item.name}}<br></span>
            </template>
          </el-table-column>
          <el-table-column
            label="仓库联系方式"
            align="center">
            <template slot-scope="scope">
              <span v-for="item,index in scope.row.warehouseContactDTOS">{{item.phone}}<br></span>
            </template>
          </el-table-column>
          <el-table-column
            label="仓库状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">草稿</span>
              <span v-if="scope.row.status == '1'">待审核</span>
              <span v-if="scope.row.status == '2'">已驳回</span>
              <span v-if="scope.row.status == '3'">可用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="设置" align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         v-if="scope.row.status == '3'"
                         v-show="$authorities.WarehouseLocationAdmin"
                         @click="goWarehouseLocationAdmin(scope.row)">库位管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goWarehouseDetaills(scope.row)"
                         v-show="$authorities.WarehouseAdminDetailRelevant"
                         type="text" size="small">详情
              </el-button>
              <el-button v-if="scope.row.status != '1'" @click="goWarehouseRedact(scope.row)"
                         v-show="$authorities.WarehouseAdminUpdateRelevant"
                         :disabled="scope.row.status == '2'&& scope.row.hasEditing == true"
                         type="text" size="small">编辑
              </el-button>
              <el-button
                @click="goWarehouseAudit(scope.row)"
                v-show="$authorities.WarehouseAdminReview"
                v-if="scope.row.status == '1'"
                type="text" size="small">审核
              </el-button>
              <el-button type="text" size="small"
                         v-show="$authorities.WarehouseAdminCreateRelevant||$authorities.WarehouseAdminUpdateRelevant"
                         v-if="scope.row.status == '0'"
                         @click="dialogBring = !dialogBring ,deleteId = scope.row.id">提审
              </el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.status == '0'||scope.row.status == '2'"
                         v-show="$authorities.WarehouseAdminCreateRelevant||$authorities.WarehouseAdminUpdateRelevant"
                         @click="dialogDelete = !dialogDelete ,deleteId = scope.row.id">删除
              </el-button>
              <el-button @click="goUpdatedDetails(scope.row)"
                         type="text"
                         v-show="$authorities.WarehouseAdminDetailRelevant"
                         v-if="scope.row.status != '3'&& scope.row.hasEditing == true"
                         size="small">原始数据详情
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
    <el-dialog :visible.sync="dialogDelete" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">删除提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">删除之后，列表将不再展示该数据，确定要删除吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="dialogDelete=false,deleteWarehouseDelete()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogBring" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">提审提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">确定当前填写的信息无误，可以提交审核吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBring = false">取 消</el-button>
        <el-button type="primary" @click="dialogBring=false,putWarehouseSubmitReview()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Butt from '../../common/Button/index'
  import {
    postWarehouseAdd,
    getWarehouseDetaills,
    getWarehouseUpdateDetaills,
    deleteWarehouseDelete,
    putWarehouseUpdateDraft,
    postWarehouseContact,
    getWarehouseRedactDetaills,
    getWarehouseLog,
    putWarehouseReview,
    putWarehouseSubmitReview,
    putWarehouseUpdateSubmitReview,
    deleteWarehouseContactDelete,
    deleteWarehouseContactIdDelete,
    postWarehouseDvailableList,
    postWarehouseAddDraft,
    postWarehouseDraftList,
    postWarehousePendingList,
    postWarehouseRejectedList,
    getWarehouseStatusCount
  } from '@/api/warehouse/warehouseAdmin'

  export default {
    inject: ['reload'],
    name: "CategoryWarehouseData",
    data() {
      return {
        dialogDelete: false,
        dialogBring: false,
        deleteId: 0,
        postType: '可用',
        returnData: {
          items: [],
          offset: 0,
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        typeOptions: [{
          value: 0,
          label: '不限'
        }, {
          value: 1,
          label: 'RDC'
        }, {
          value: 2,
          label: 'DC'
        }, {
          value: 3,
          label: 'FDC'
        }],
        //查询
        query: {
          id: '',
          name: "",
          type: 0,
          pageNum: 1,
          pageSize: 10,
        },
        //btn选中
        active: 0,
        //btn数据
        btnData: [{
          "sum": 100,
          "TypeName": "可用",
        }, {
          "sum": 200,
          "TypeName": "待审核",
        }, {
          "sum": 300,
          "TypeName": "草稿",
        }, {
          "sum": 400,
          "TypeName": "已驳回",
        }],
        //删选显示
        isShow: true,
        //表格数据
        tableData: [{
          id: '0303',
          name: '山西长治昌盛仓',
          type: '地方仓库',
          address: '同方股份有限公司同方股份有限公司',
          linkman: '崔浩亮',
          contact: '188888888',
          state: '启用',
          adminstatus: '草稿 审核情况 ',
        }, {
          id: '0303',
          name: '山西长治昌盛仓',
          type: '地方仓库',
          address: '同方股份有限公司同方股份有限公司',
          linkman: '崔浩亮',
          contact: '188888888',
          state: '草稿',
          adminstatus: '草稿 审核情况 ',
        },
          {
            id: '0303',
            name: '山西长治昌盛仓',
            type: '地方仓库',
            address: '同方股份有限公司同方股份有限公司',
            linkman: '崔浩亮',
            contact: '188888888',
            state: '待审核',
            adminstatus: '草稿 审核情况 ',
          },
          {
            id: '0303',
            name: '山西长治昌盛仓',
            type: '地方仓库',
            address: '同方股份有限公司同方股份有限公司',
            linkman: '崔浩亮',
            contact: '188888888',
            state: '已驳回',
            adminstatus: '草稿 审核情况 ',
          }],
        //翻页
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    computed: {
    },
    mounted() {
      this.postList();
      this.getWarehouseStatusCount();
//      getWarehouseLog(13
//
//      ).then((res) => {
//        console.log(res)
//        //this.detaillsTable = JSON.parse(res.data);
//      }).catch(err => {
//        console.log(err)
//      });
    },
    methods: {
      //删除
      deleteWarehouseDelete() {
        deleteWarehouseDelete(
          this.deleteId
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.postList();
            this.getWarehouseStatusCount();
          } else if (res.data == '0') {
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
        }).catch(err => {

        });
      },
      //提审
      putWarehouseSubmitReview() {
        putWarehouseSubmitReview(
          this.deleteId
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '提审成功',
                type: "success",
              });
              this.postList();
              this.getWarehouseStatusCount();
            } else {
              this.$message({
                message: '提审失败',
                type: 'warning',
              })
            }
            console.log(res)
          }).catch(err => {
          console.log(err)
        });
      },
      //获取各状态的数量
      getWarehouseStatusCount() {
        getWarehouseStatusCount()
          .then((res) => {
            console.log(res)
            this.btnData = res.data;
          }).catch(err => {
          console.log(err)
        });
      },
      //判断类型请求数据
      postList() {
        console.log(this.postType)
        switch (this.postType) {
          case '可用':
            this.postWarehouseDvailableList(this.query)
            break;
          case '待审核':
            this.postWarehousePendingList(this.query)
            break;
          case '草稿':
            this.postWarehouseDraftList(this.query)
            break;
          case '已驳回':
            this.postWarehouseRejectedList(this.query)
            break;
          default:

        }
      },
      //获取可用仓库列
      postWarehouseDvailableList(data) {
        //请求列表
        postWarehouseDvailableList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        });
      },
      //获取待审核仓库列表
      postWarehousePendingList(data) {
        //请求列表
        postWarehousePendingList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        })
      },
      //获取草稿仓库列表
      postWarehouseDraftList(data) {
        //请求列表
        postWarehouseDraftList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        })
      },
      //获取已驳回仓库列表
      postWarehouseRejectedList(data) {
        //请求列表
        postWarehouseRejectedList(
          data
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
        })
      },
      //类型按钮
      btnActive(index, typename) {
        this.postType = typename;
        if (this.active != index) {
          this.query.pageNum = 1;
          this.postList();
        }
        this.active = index;
      },
      //查询结果
      queryResult() {
        console.log(this.query);
        this.postList()
        this.tableData = [{
          id: '0303',
          name: '山西长治昌盛仓',
          type: '地方仓库',
          address: '同方股份有限公司同方股份有限公司',
          linkman: '崔浩亮',
          contact: '188888888',
          state: '启用',
          adminstatus: '草稿 审核情况 ',
        }, {
          id: '0303',
          name: '山西长治昌盛仓',
          type: '地方仓库',
          address: '同方股份有限公司同方股份有限公司',
          linkman: '崔浩亮',
          contact: '188888888',
          state: '启用',
          adminstatus: '草稿 审核情况 ',
        }];
      },
      //跳转更新详情
      goUpdatedDetails(row) {
        let {href} = this.$router.resolve({
          name: 'WarehouseUpdatedDetails',
          query: {
            Id: row.id
          }
        });
        window.open(href, '_blank')
      },
      //跳转编辑
      goWarehouseRedact(row) {
        let {href} = this.$router.resolve({
          name: 'WarehouseRedact',
          query: {
            Id: row.id
          }
        });
        window.open(href, '_blank')
      },
      //跳转库位管理
      goWarehouseLocationAdmin(row) {
        let {href} = this.$router.resolve({
          name: 'WarehouseLocationAdmin',
          query: {
            Id: row.id,
            name: row.name
          }
        });
        window.open(href, '_blank')
      },
      //跳转详情
      goWarehouseDetaills(row) {
        // console.log(row.id);
        const {href} = this.$router.resolve({
          name: 'WarehouseDetaills',
          query: {
            Id: row.id
          }
        });
        window.open(href, '_blank')
      },
      //跳转审核
      goWarehouseAudit(row) {
        // console.log(row.id);
        const {href} = this.$router.resolve({
          name: 'WarehouseAudit',
          query: {
            Id: row.id
          }
        });
        window.open(href, '_blank')
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
          height: 40px;
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
