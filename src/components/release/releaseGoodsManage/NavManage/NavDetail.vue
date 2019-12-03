<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1">
        <tr>
          <th>导航ID：</th>
          <td>{{id}}</td>
          <th><i>*</i>导航级别：</th>
          <td>{{mainsiteNavigationLevelName}}</td>
        </tr>
        <tr>
          <th><i>*</i>{{levelName==1?'一':levelName==2?'二':'三'}}级导航名称：</th>
          <td>{{name}}</td>
          <th>{{levelName==1?'一':levelName==2?'二':'三'}}级导航状态：</th>
          <td>{{available?'可用':'禁用'}}</td>
        </tr>
        <tr>
          <th>显示优先级：</th>
          <td colspan="3">
            {{index}}
          </td>
        </tr>
        <tr>
          <th>关联分类：</th>
          <td colspan="3">
            <el-tree
              :data="data2"
              :props="defaultProps"
              :filter-node-method="filterNode"
              ref="tree2" v-show="showtree">
            </el-tree>
          </td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table
        :data="navigationOperationLogDTOs"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userInfo.realName"
          label="操作者"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationName"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" v-backTop>返回顶部</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {navigationDetail} from '@/api/release/navManage'
  import {preview} from '@/api/classManage'
  export default {
    inject:['reload','close'],
    name:'NavDetail',
    data(){
      return {
        mainsiteNavigationLevelName:'',
        levelName:'',
        id:0,
        level:'',
        name:'',
        available:'',
        index:'',
        categoryIds:'',
        navigationOperationLogDTOs:[],
        data2:[],
        defaultProps: {
          children: 'subCategory',
          label: 'name'
        },
        showtree:false
      }
    },
    activated(){
      if(this.$route.query.id!==this.id){
        var that = this;
        this.id = this.$route.query.id;
        this.levelName = this.$route.query.level;
        this.getdata(that.id);
        this.getTree();
      }
    },
    components:{
      addhead
    },
    methods: {
      filterNode(value, data) {
			  if(!value) return true;
			  return value.includes(data.id);
		  },
      getTree(){
        preview().then(res=>{
          if(res.code=='000000'){
            this.data2 = res.data;
          }
        })
      },
      getdata(id){
        navigationDetail(id).then(res=>{
          if(res.code=='000000'){
            this.level = res.data.level;
            this.name = res.data.name;
            this.available = res.data.available;
            this.index = res.data.index;
            this.categoryIds = res.data.categoryIds;
            this.navigationOperationLogDTOs = res.data.navigationOperationLogDTOs;
            this.mainsiteNavigationLevelName = res.data.mainsiteNavigationLevelName;
            if(this.categoryIds){
              this.$refs.tree2.filter(this.categoryIds);
              this.showtree = true;
            }else{
              this.data2 = [];
            }
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
    .detaillTable{
      border: 1px solid #d1d1d1;
      table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          padding-right:6px;
          box-sizing: border-box;
          color:#666;
          font-weight:700;
          font-size: 14px;
          text-align: right;
          width:20%;
          i{
            color:red;
          }
        }
        td{
          color: #666666;
          text-align: left;
          padding-left:10px;
          width:30%;
        }
      }
    }
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .button-box{
        display: flex;
        justify-content: flex-end;
        width: 90%;
        margin:0 auto 20px;
      }
    }
  }


</style>

