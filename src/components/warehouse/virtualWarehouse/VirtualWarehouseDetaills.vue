<template>
  <div class="detaillBox"  v-if="$authorities.WarehouseAdminDetailRelevant">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i class="iconfont el-icon-collection-tag"></i>基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>虚拟仓库编号：</th>
          <td>{{returnData.no}}</td>
        </tr>
        <tr>
          <th>虚拟仓库名称：</th>
          <td>{{returnData.name}}</td>
        </tr>
        <tr>
          <th>虚拟仓库描述：</th>
          <td>{{returnData.description}}</td>
        </tr>
        <tr>
          <th>关联实体仓库信息：</th>
          <td>
              <i v-for="item,index in returnData.relatedWarehouseList">
                {{item}}
              </i>
          </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i class="iconfont el-icon-collection-tag"></i>操作详情</span>
      </div>
      <el-table
        :data="returnData.virtualWarehouseOperationLogDTOS"
        border
        stripe
        style="width: 90%"
        size="small">
        <el-table-column

          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfo.userPosts[0].organizationName}}</span>
            <span>></span>
            <span>{{scope.row.userInfo.userPosts[0].departmentName}}</span>
            <span>></span>
            <span>{{scope.row.userInfo.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.operationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作描述"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.operation==0">添加</span>
            <span v-if="scope.row.operation==1">修改</span>
            <span v-if="scope.row.operation==2">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close({name:'VirtualWarehouseDetaills', to: {name:'VirtualWarehouseAdmin', params:{isUpdate:true}}})">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
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

  export default {
    inject:['reload','close'],
    name: "VirtualWarehouseDetaills",
    data() {
      return {
        oldId:'',
        returnData:{
          createTime:null,
          deleted:null,
          description:null,
          id:null,
          name:null,
          relatedWarehouseList:null,
          updateTime:null,
        },
        tableData:[],
      }
    },
    activated() {
      if (this.oldId != this.$route.query.id){
        this.oldId=this.$route.query.id;
        getVirtualWarehouseDetaills(
          this.$route.query.id
        )
          .then((res) => {
            console.log(res)
            this.returnData = res.data;
          }).catch(err => {
          console.log(err)
        });
      }
    },
    mounted() {
      this.oldId=this.$route.query.id;
      //仓库详情
      getVirtualWarehouseDetaills(
        this.$route.query.id
      )
        .then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
        console.log(err)
      });

    },
    methods: {

      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.Id;
        // 将数据放在当前组件的数据内
        this.msg = routerParams;
        console.log(this.msg);
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    },
    filters: {
      //时间截取字符串
      formatDate: function (value) {
        return value.substring(0,10)+' '+value.substring(11,19);
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .detaillBox {
    width: 100%;
    padding-top: 10px;
    .detaillTable {
      border: 1px solid #d1d1d1;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          font-size: 14px;
          color: #303133;
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
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
          width: 150px;
          i {
            color: red;
          }
        }
        td {
          color: #666666;
          text-align: left;
          padding-left: 10px;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
        }
      }
    }
    .detaillTable2 {
      border: 1px solid #d1d1d1;
      border-top: none;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          font-size: 14px;
          color: #303133;
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-table {
        margin: 20px auto;
        width: 90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: right;
        margin: 10px 20px;
      }
    }
  }


</style>
