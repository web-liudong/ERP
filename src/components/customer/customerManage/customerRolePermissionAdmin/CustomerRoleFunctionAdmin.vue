<template>
  <div class="redactBox">
    <div class="redactTable clear">
      <div class="redactTopBox">
        <span><i></i>客户角色权限管理</span>
        <span style="float: right;margin-right: 50px; color: red"> 角色名称 ：{{this.$route.query.groupName}}  (&nbsp;&nbsp;{{ this.$route.query.id
          }}&nbsp;&nbsp;) </span>
      </div>
      <div class="terrBox clear" style="margin-bottom: 20px;">
        <el-tree
          :data="treeData"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :expand-on-click-node="false"
          :props="defaultProps">
        </el-tree>
      </div>
      <div class="checkAll">
        <el-checkbox v-model="checked" @change="setCheckedNodes">全选</el-checkbox>
      </div>
      <div class="clear" style="height: 100px">
        <el-button type="primary" v-backTop plain>返回顶部</el-button>
        <el-button type="primary" @click="close()">取消</el-button>
        <el-button type="primary" v-if="$authorities.CustomerRoleFunctionAdmin" @click="postRoleAuthorities()">保存设置
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getAuthorityTreeData,
    postCustomerRoleList,
    postCustomerRoleCreate,
    putCustomerRoleUpdate,
    getCustomerRoleDetaills,
    deleteCustomerRoledelete,
    getCustomerAuthorities,
    postCustomerAuthorities,
    getCustomerAuthoritieIds
  } from '@/api/customer/customerRoleFunctionAdmin'

  export default {
    inject:['reload','imgurl','close'],//注入依赖
    name: "CustomerRoleFunctionAdmin",
    data() {
      return {
        oldId:'',
        checked: false,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        fdata:[],
        authoritiesData: {
          authorityIds: [],
          roleId: this.$route.query.id,
          type: 1
        },
        oldAuthoritiesData: [],
      };
    },
    created() {

    },
    activated() {
      if (this.oldId!=this.$route.query.id){
        this.getAuthorityAll();
        this.oldId=this.$route.query.id;
      }
    },
    mounted() {
      this.getAuthorityAll();
      this.oldId=this.$route.query.id;
    },
    methods: {
      styleFun() {
        var aEle = document.getElementsByClassName('el-tree-node');
        for (let i = 0; i < aEle.length; i++) {
          aEle[i].parentNode.style.borderTop = 'solid 1px #d1d1d1';
          aEle[i].parentNode.style.borderBottom = 'solid 1px #d1d1d1';
          aEle[i].parentNode.style.width = '920px';
          aEle[i].parentNode.style.marginBottom = '-1px';
        }
        let childrenList = document.getElementsByClassName('el-tree-node__children');
        for (let i = 0; i < childrenList.length; i++) {
          let len = childrenList[i].children.length;
          if (len == 0) {
            childrenList[i].previousElementSibling.style.borderBottom = 'solid 1px #d1d1d1';
            childrenList[i].previousElementSibling.style.borderRight = 'solid 1px #d1d1d1';
          }
        }
        this.getRoleAuthorities();
      },
      //获取权限树
      getAuthorityAll() {
        getAuthorityTreeData(1
        ).then((res) => {
          console.log(res)
          this.treeData = res.data;
          this.$nextTick(function () {
            this.styleFun()
          })
        }).catch(err => {
          console.log(err)
        });
      },

      //父级半选方法
      operationData() {
        //得到所有非末级
        var lsdata=[]
        function getAll(arr)
        {
          arr.filter(item => {
            console.log(item)
            if (item.children && item.children.length) {
              //console.log(item+'有')
              lsdata.push(item.id)
              getAll(item.children)
            }else{
              //console.log(item+'没有')
            }
          })
        }
        getAll(this.treeData)
        this.fdata=lsdata;
        //删除所有的非末级
        let aSet = new Set(this.fdata)
        let bSet = new Set(this.returnData)
        let intersection = Array.from(new Set(this.fdata.filter(v => bSet.has(v)))// 得到交集  父级id和权限di的交集
        )
        let cSet=new Set(intersection);
        //console.log(intersection+'就是那个东西');
        let differenceNew = Array.from(new Set(this.returnData.concat(intersection).filter(v => bSet.has(v) && !cSet.has(v)))// 权限di和交集的差级
        )
        //console.log(differenceNew+'aaaaaa')
        this.$refs.tree.setCheckedKeys(differenceNew);
      },

  //角色权限查询
  getRoleAuthorities()
  {
    getCustomerAuthoritieIds(
      this.$route.query.id, 1
    ).then((res) => {
      console.log(res)
      this.returnData = res.data;
      this.$refs.tree.setCheckedKeys( this.returnData);
      //this.operationData();
    }).catch(err => {
      console.log(err)
    });
  }
  ,
  //角色权限设置
  postRoleAuthorities()
  {
    console.log(this.$refs.tree.getCheckedKeys());
    console.log(this.$refs.tree.getHalfCheckedKeys() + '12');
    this.authoritiesData.authorityIds = this.$refs.tree.getCheckedKeys();
    this.authoritiesData.authorityIds = this.authoritiesData.authorityIds.concat(
      this.$refs.tree.getHalfCheckedKeys()
    );
    console.log(this.authoritiesData);
    postCustomerAuthorities(
      this.$route.query.id, 1,
      this.authoritiesData
    ).then((res) => {
      if (res.code == '000000') {
        this.$message({
          message: '权限设置成功',
          type: 'success',
        })
        this.getRoleAuthorities()
      } else {
        this.$message({
          message: '权限设置成功失败',
          type: 'warning',
        })
      }
      console.log(res);
    }).catch(err => {
      console.log(err)
    });
  }
  ,
  getCheckedNodes()
  {
    console.log(this.$refs.tree.getCheckedNodes());
  }
  ,
  getCheckedKeys()
  {
    console.log(this.$refs.tree.getCheckedKeys());
  }
  ,
  setCheckedNodes()
  {
    //        alert('12');
    if (this.checked == true) {
      this.$refs.tree.setCheckedNodes(this.treeData);
    } else {
      this.$refs.tree.setCheckedNodes([]);
    }
  }
  ,
  setCheckedKeys()
  {
    this.$refs.tree.setCheckedKeys([3]);
  }
  ,
  resetChecked()
  {
    this.$refs.tree.setCheckedKeys([]);
  }
  },

  }
  ;
</script>

<style>
  .checkAll {
    border: 1px solid #d1d1d1;
    margin: 0 auto;
    width: 916px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .terrBox .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #fff0 !important;
  }

  .terrBox .el-tree-node__content:hover {
    background-color: #fff0 !important;
  }

  .terrBox {
    margin-bottom: 50px;
    border-left: 1px solid #d1d1d1;
    border-right: 1 px solid #d1d1d1;
    margin: 0 auto;
    width: 916px;

  }

  .terrBox .el-tree-node__content > .el-checkbox {
    margin-right: 8px;
    margin-left: 18px;
  }

  .terrBox .el-tree-node__expand-icon {
    display: none;
  }

  .redactTable:after {
    content: '';
    display: block;
    clear: both;
  }

  .terrBox .el-tree:after {
    content: '';
    display: block;
    clear: both;
  }

  .terrBox .el-tree {
    border-right: 1px solid #d1d1d1;
    overflow: hidden;
    zoom: 1;
    background-color: #f3f3f3;
    width: 916px !important;
  }

  .terrBox .el-tree-node__children .el-tree-node {
    float: left;
    zoom: 1;
  }

  .terrBox .el-tree-node:after {
    content: '';
    display: block;
    clear: both;
  }

  .terrBox .el-tree-node {

    zoom: 1;
    margin-left: -1px;
  }

  .terrBox .el-tree-node__children .el-tree-node__content :after {
    content: '';
    display: block;
    clear: both;
  }

  .terrBox .el-tree-node__children {
    float: left;
    width: 100%;
    background-color: #fff !important;
    margin-bottom: -1px;
  }

  .terrBox .el-tree-node__content {

    padding: 0 !important;
    height: 50px;
    min-width: 184px;
    line-height: 50px;
    padding: 0;
    zoom: 1;
    border-left: none;
    display: inline-block;
    text-align: left;
    margin-bottom: -1px;
  }

  .terrBox .redactBox .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }
</style>

<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .redactBox {
    width: 100%;
    padding-top: 10px;
    .redactTable {
      margin-bottom: 50px;
      border: 1px solid #d1d1d1;
      .redactTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        margin-bottom: 20px;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-button {
        float: right;
        margin: 10px 20px;
      }
    }
  }
</style>
