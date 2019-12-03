<template>
  <div class="adminBox">
    <div class="buttonBox">

    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="font-size: 14px;"><i class="el-icon-arrow-up"></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow" style="font-size: 14px;"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="queryResult()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">虚拟仓编号：</span>
          <el-input
            type="number"
            placeholder="虚拟仓编号"
            v-model="query.no"
            clearable>
          </el-input>
          <span style="margin-left:20px;">虚拟仓名称：</span>
          <el-autocomplete
            style="width: 200px"
            class="inline-input"
            v-model="query.name"
            :fetch-suggestions="postVirtualWarehouseOptionss"
            placeholder="虚拟仓名称"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <el-button size="small" icon="el-icon-plus" @click="goCreateVirtualWarehouse()" v-show="$authorities.CreateVirtualWarehouse"  >添加</el-button>
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            prop="no"
            label="虚拟仓编号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="虚拟仓名称"
            align="center">
          </el-table-column>
          <el-table-column
            label="关联仓库数量" align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="goRelevanceWarehouseData(scope.row)">{{scope.row.relatedQty}}
              </el-button>
            </template>
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
            label="SKU数" align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="goSKUVirtualWarehouseData(scope.row)">{{scope.row.skuQty}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="availableQty"
            label="可用库存总数"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="220"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goVirtualWarehouseDetaills(scope.row)"
                         v-if="$authorities.VirtualWarehouseDetaills"
                         type="text" size="small">详情
              </el-button>
              <el-button @click="goUpdatedVirtualWarehouse(scope.row)"
                         v-if="$authorities.UpdatedVirtualWarehouse"
                         type="text" size="small">编辑
              </el-button>
              <el-button type="text" size="small"
                         v-if="$authorities.VirtualWarehouseDelete"
                         @click="dialogDelete = !dialogDelete ,deleteId = scope.row.id">删除
              </el-button>
              <el-button type="text"
                         v-if="$authorities.VirtualWarehousePermissionData"
                         @click="clickPermissionData(scope.row)">设置查看权限
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
          style="height: 38px;padding: 0 5px;"
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
        <el-button type="primary" @click="dialogDelete=false,deleteVirtualWarehouseDelete()">确 定</el-button>
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
    <el-dialog :visible.sync="dialogPermission" width="800px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">设置查看权限</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>虚拟仓库编号：</th>
            <td>{{setPermissionWarehouseData.no}}</td>
            <th><i></i>虚拟仓库名称：</th>
            <td>{{setPermissionWarehouseData.name}}</td>
          </tr>

        </table>
        <div class="listBox" style="background: #fff;">
          <div class="listBoxTop" style="background: #f3f3f3;">
            <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;选择可查看当前仓库的组织机构</span>
            <span style="color: red;font-size: 12px;">Tip：已选组织机构有查看当前仓库基本信息、商品库存的权利</span>
          </div>
          <el-form :model="setPermissionData" :rules="rules" ref="ruleForm" style="margin: 20px">
            <el-form-item prop="organizationIds">
              <el-transfer
                :props="{
              key: 'id',
              label: 'name'
            }"
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入组织机构"
                :titles="['组织机构选项列表','已选组织机构']"
                v-model="setPermissionData.organizationIds"
                :data="organizationList">
              </el-transfer>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogPermission = false" style="float: right;margin-left: 10px">取 消</el-button>
              <el-button type="primary" style="float: right" @click="submitFormAdd('ruleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getvirtualWarehouseinfopurview,
    putvirtualWarehouseinfopurview,
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
  import {
    getAvailableList,
    fuzzySearch
  }
    from '@/api/organizationManage'
  export default {
    inject:['reload','close'],
    name: "VirtualWarehouseAdmin",
    data() {
      return {
        setPermissionWarehouseData: {
          "availableQty": 0,
          "brandQty": 0,
          "categoryQty": 0,
          "createTime": "2019-04-24T08:33:14.202Z",
          "deleted": true,
          "description": "string",
          "id": 0,
          "name": "string",
          "relatedQty": 0,
          "skuQty": 0,
          "updateTime": "2019-04-24T08:33:14.202Z"
        },
        organizationList: [],
        setPermissionData: {
          organizationIds: [],
          warehouseId: null
        },
        rules:
          {
            organizationIds: [
              {required: true, message: '请选择组织机构', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '请输入仓库名称', trigger: 'blur'},
              {min: 1, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ],
          },
        dialogPermission: false,
        //查询
        query: {
          no:"",
          id: '',
          name: "",
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
        deleteId: 0,


        dialogDelete: false,
        dialogBring: false,
        postType: '可用',
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
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    activated(){
      if(this.$route.params.isUpdate){
        this.postVirtualWarehouseList();
        this.getTableData();
      }
    },
    mounted() {
      //this.postList();
      this.postVirtualWarehouseList();
      this.getTableData();

    },
    methods: {
      //获取已启用的组织机构 用于查看权限设置              /////////还差一个获取  跟保存的接口   还没有归属组织机构得在获取可用仓库中加上
      getTableData() {
        //已启用
        fuzzySearch(
          {
            pageNum: 1,
            pageSize: 1000,
            name: "",
          },
        ).then(res => {
          this.organizationList = res.data;
        })
      },
      //查看权限设置提交保存
      submitFormAdd(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(this.addData);
          if (valid) {
            this.putvirtualWarehouseinfopurview();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //查看权限设置穿梭框搜索
      filterMethod(query, item) {
        console.log(item);
        return item.name.indexOf(query) > -1;
      },
      //点击设置查看权限
      clickPermissionData(row) {
        this.setPermissionWarehouseData = row;
        this.setPermissionData.warehouseId = row.id;

//获取当前仓库的查看权限
        getvirtualWarehouseinfopurview(
          row.id
        ).then((res) => {
          if (res.code == '000000') {
            this.dialogPermission = !this.dialogPermission;
            console.log(res.data);
            let idArr=[];
            for (var i=0; i<res.data.length;i++){
              idArr.push(res.data[i].organizationId)
            }
            this.setPermissionData.organizationIds=idArr;
          } else if (res.data == '0') {
            this.$message({
              message: '获取数据失败',
              type: 'warning',
            })
          }
        }).catch(err => {

        });
      },
      //重置
      reset(){
        this.query={
          no:"",
          id: '',
          name: "",
          pageNum: 1,
          pageSize: 10,
        },
          this.postVirtualWarehouseList();
        this.getTableData();
      },
      //设置查看权限接口
      putvirtualWarehouseinfopurview() {
        putvirtualWarehouseinfopurview(
          this.setPermissionData.warehouseId,this.setPermissionData
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '设置成功',
                type: "success",
              });
//              this.postList();
//              this.getWarehouseStatusCount();
              this.dialogPermission = !this.dialogPermission;
            } else {
              this.$message({
                message: '设置失败',
                type: 'warning',
              })
            }
            console.log(res)
          }).catch(err => {
          console.log(err)
        });
      },
      //
      goCreateVirtualWarehouse(row){
        this.$router.push({
          name: 'CreateVirtualWarehouse',
          query: {
          }
        });
      },
      //跳转关联仓库
      goRelevanceWarehouseData(row) {
        this.$router.push({
          name: 'RelevanceWarehouseData',
          query: {
            no: row.no,
            id: row.id,
            name: row.name
          }
        });
      },
      //虚拟仓sku
      goSKUVirtualWarehouseData(row) {
        this.$router.push({
          name: 'SKUVirtualWarehouseData',
          query: {
            no: row.no,
            id: row.id,
            name: row.name
          }
        });
      },
      //详情
      goVirtualWarehouseDetaills(row) {
        // let {href} = this.$router.resolve({
        //   name: 'VirtualWarehouseDetaills',
        //   query: {
        //     no: row.no,
        //     id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/warehouse/virtualwarehouse/virtualwarehousedetaills', query: { no: row.no,id: row.id}});
      },
      //编辑
      goUpdatedVirtualWarehouse(row) {
        // let {href} = this.$router.resolve({
        //   name: 'UpdatedVirtualWarehouse',
        //   query: {
        //     no: row.no,
        //     id: row.id
        //   }
        // });
        // window.open(href, '_blank')
        this.$router.push({path: '/warehouse/virtualwarehouse/updatedvirtualwarehouse', query: { no: row.no,id: row.id}});
      },
      //删除
      deleteVirtualWarehouseDelete() {
        deleteVirtualWarehouseDelete(
          this.deleteId
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.postVirtualWarehouseList();
          } else if (res.data == '0') {
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
        }).catch(err => {

        });
      },
      //虚拟仓名称模糊搜索
      postVirtualWarehouseOptionss(queryString, cb){
        postVirtualWarehouseList(
          {
            id: '',
            name:queryString,
            pageNum: 1,
            pageSize: 100000,
          }
        ).then((res) => {
          let arr=[];
          for (var i=0; i<res.data.items.length;i++){
            arr.push({"value":res.data.items[i].name})
          }
          cb(arr)
        }).catch(err => {
          console.log(err)
        });
      },
      //获取列表
      postVirtualWarehouseList(data) {
        //请求列表
        postVirtualWarehouseList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err)
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
        this.postVirtualWarehouseList()
      },
      //翻页
      handleSizeChange(val) {
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postVirtualWarehouseList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        this.postVirtualWarehouseList();
      },
      //筛选show
      showHelp() {
        this.isShow = !this.isShow;
      }
    }
  }
</script>
<style >
  .adminBox .el-transfer .el-transfer-panel{
    width:291px
  }
</style>
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
          color: #333;
          cursor: pointer;

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
      .message-box {
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
            width: 15%;
            i {
              color: red;
            }
          }
          td {
            color: #666666;
            text-align: left;
            padding-left: 10px;
            width: 15%;
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
