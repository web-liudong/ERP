<template>
  <div class="redactBox">
    <div class="redactTable clear">
      <div class="redactTopBox">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>&nbsp;&nbsp;角色权限管理
        </span>
        <span style="float: right;margin-right: 50px; color: red">
          角色名称 ：{{this.$route.query.name}} (&nbsp;&nbsp;{{ this.$route.query.Id
          }}&nbsp;&nbsp;)
        </span>
      </div>
      <div class="terrBox clear" style="margin-bottom: 20px;">
        <el-tree
          :data="treeData"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          @check="checkNode"
          :expand-on-click-node="false"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div class="checkAll">
        <el-checkbox v-model="checked" @change="setCheckedNodes">全选</el-checkbox>
      </div>
      <div class="clear" style="height: 100px">
        <el-button type="primary" v-backTop plain>返回顶部</el-button>
        <el-button type="primary" @click="cancel()">取消</el-button>
        <el-button
          type="primary"
          v-if="$authorities.RolePermissionAdmin"
          @click="postRoleAuthorities()"
        >保存设置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  postCreateRole,
  putUpdateRole,
  getRoleDetail,
  deleteRoleDelete,
  getRoleAuthorities,
  postRoleAuthorities,
  postCreateRoleGroup,
  putUpdateRoleGroup,
  getRoleGroupDetail,
  postRoleGroupList,
  getRoleGroupRoles,
  postRoleList,
  getAuthorityAll
} from "@/api/system/rolePermissionAdmin";

export default {
  name:'RoleFunctionAdmin',
  inject:['close'],
  data() {
    return {
      OldId:'',
      checked: false,
      treeData: [],
      treeObj:{},
      defaultProps: {
        children: "children",
        label: "label"
      },

      authoritiesData: {
        authorityIds: [],
        roleId: this.$route.query.Id
      },
      oldAuthoritiesData: []
    };
  },
  created() {
    this.getAuthorityAll();
  },
  activated(){
    if(this.OldId != this.$route.query.Id){
      this.getAuthorityAll();
    }
  },
  mounted() {},
  methods: {
    styleFun() {
      let tree = document.getElementsByClassName("el-tree");
      let treeChildren = tree[0].children;
      for (let i = 0; i < treeChildren.length - 1; i++) {
        let liveone = treeChildren[i].children[0];
        let oneChildren = treeChildren[i].children[1];
        for (let j = 0; j < oneChildren.children.length; j++) {
          if (oneChildren.children[j]) {
            oneChildren.children[j].children[0].className += " secondLv";
            // oneChildren.children[j].children[0].children[2].style.fontSize = '18px';
            // oneChildren.children[j].children[0].children[2].style.fontWeight = '600';
          }
          let threeChildren = oneChildren.children[j].children[1];
          for (let k = 0; k < threeChildren.children.length; k++) {
            if (threeChildren.children[k]) {
              threeChildren.children[k].children[0].children[2].style.fontSize =
                "17px";
              threeChildren.children[
                k
              ].children[0].children[2].style.fontWeight = "600";
            }
          }
        }
        liveone.children[2].style.fontSize = "22px";
        liveone.children[2].style.fontWeight = "600";
      }

      var aEle = document.getElementsByClassName("el-tree-node");
      for (let i = 0; i < aEle.length; i++) {
        aEle[i].parentNode.style.borderTop = "solid 1px #d1d1d1";
        aEle[i].parentNode.style.borderBottom = "solid 1px #d1d1d1";
        aEle[i].parentNode.style.width = "920px";
        aEle[i].parentNode.style.marginBottom = "-1px";
      }
      let childrenList = document.getElementsByClassName(
        "el-tree-node__children"
      );
      for (let i = 0; i < childrenList.length; i++) {
        let len = childrenList[i].children.length;
        if (len == 0) {
          childrenList[i].previousElementSibling.style.borderBottom =
            "solid 1px #d1d1d1";
          childrenList[i].previousElementSibling.style.borderRight =
            "solid 1px #d1d1d1";
        }
      }
      this.getRoleAuthorities();
    },
    //获取权限树
    getAuthorityAll() {
      this.OldId = this.$route.query.Id;
      getAuthorityAll()
        .then(res => {
          console.log(res);
          this.treeData = res.data;
          this.$nextTick(function() {
            this.styleFun();
          });
          //格式化树结构-将数组转为对象
          this.formatTreeData(this.treeData, this.treeObj);
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatTreeData(arr, obj){
      arr.forEach( item => {
        obj[item.bizId] = {
          bizId:item.bizId,
          label:item.label,
          id:item.id,
          children:{}
        }
        if(item.children.length){
          this.formatTreeData(item.children, obj[item.bizId].children);
        }else{

          if(item.label.substring(item.label.length-2) == "列表"){
            obj[item.bizId].isList = true;
          }
          obj[item.bizId].children = null;
        }
      })
    },
    //父级半选方法
    operationData() {
      //得到所有非末级
      var lsdata = [];

      function getAll(arr) {
        arr.filter(item => {
          console.log(item);
          if (item.children && item.children.length) {
            //console.log(item+'有')
            lsdata.push(item.id);
            getAll(item.children);
          } else {
            //console.log(item+'没有')
          }
        });
      }

      getAll(this.treeData);
      this.fdata = lsdata;
      //删除所有的非末级
      let aSet = new Set(this.fdata);
      let bSet = new Set(this.returnData);
      let intersection = Array.from(
        new Set(this.fdata.filter(v => bSet.has(v))) // 得到交集  父级id和权限di的交集
      );
      let cSet = new Set(intersection);
      //console.log(intersection+'就是那个东西');
      let differenceNew = Array.from(
        new Set(
          this.returnData
            .concat(intersection)
            .filter(v => bSet.has(v) && !cSet.has(v))
        ) // 权限di和交集的差级
      );
      //console.log(differenceNew+'aaaaaa')
      this.$refs.tree.setCheckedKeys(differenceNew);
    },
    //角色权限查询
    getRoleAuthorities() {
      getRoleAuthorities(this.$route.query.Id)
        .then(res => {
          this.returnData = res.data;
          this.$refs.tree.setCheckedKeys(this.returnData);
          //this.operationData();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //角色权限设置
    postRoleAuthorities() {
      console.log(this.$refs.tree.getCheckedKeys());
      console.log(this.$refs.tree.getHalfCheckedKeys());
      this.authoritiesData.authorityIds = this.$refs.tree.getCheckedKeys();
      this.authoritiesData.authorityIds = this.authoritiesData.authorityIds.concat(
        this.$refs.tree.getHalfCheckedKeys()
      );
      console.log(this.authoritiesData);
      postRoleAuthorities(this.$route.query.Id, this.authoritiesData)
        .then(res => {
          if (res.code == "000000") {
            this.$message({
              message: "权限设置成功",
              type: "success"
            });
            this.getRoleAuthorities();
          } else {
            this.$message({
              message: "权限设置成功失败",
              type: "warning"
            });
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //取消
    cancel() {
      this.close({name:'RoleFunctionAdmin', to: {name:'RoleAdmin', params:{isUpdate:true}}});
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      //        alert('12');
      if (this.checked == true) {
        this.$refs.tree.setCheckedNodes(this.treeData);
      } else {
        this.$refs.tree.setCheckedNodes([]);
      }
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    //关联选中节点的兄弟节点（列表）
    checkNode(node, data){
      if(!node.children.length){
        let arr = this.$refs.tree.getCheckedKeys(true), ischeck = false;
        for(let i=0,imax=arr.length; i<imax; i++){
          if(arr[i] == node.id){
            ischeck = true;
            break;
          }
        }
        //当前节点处于选中状态
        if(ischeck){
          let parentBizIdArr = node.bizId.replace(/(\d{4})(?=\d)/g, "$1,").split(",");
          let pNode = this.treeObj[parentBizIdArr[0]].children[parentBizIdArr[0]+parentBizIdArr[1]].children[parentBizIdArr[0]+parentBizIdArr[1]+parentBizIdArr[2]];
          for(let key in pNode.children){
            if(pNode.children[key].isList){
              this.$refs.tree.setChecked(pNode.children[key].id, true);
            }
          }
        }
      }
    }
  }
};
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

.terrBox
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #fff0 !important;
}

.terrBox .el-tree-node__content:hover {
  background-color: #fff0 !important;
}

.terrBox {
  margin-bottom: 50px;
  border-left: 1px solid #d1d1d1;
  border-right: 1px solid #d1d1d1;
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
  content: "";
  display: block;
  clear: both;
}

.terrBox .el-tree:after {
  content: "";
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
  content: "";
  display: block;
  clear: both;
}

.terrBox .el-tree-node {
  zoom: 1;
  margin-left: -1px;
}

.terrBox .el-tree-node__children .el-tree-node__content :after {
  content: "";
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
  height: 50px;
  width: 176px;
  line-height: 50px;
  padding: 0;
  zoom: 1;
  border-left: none;
  display: inline-block;
  text-align: left;
  margin-bottom: -1px;
  position: relative;
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
          font-size: 14px;
        }
      }
    }
    .el-button {
      float: right;
      margin: 10px 20px;
    }
    .el-tree {
      /deep/.secondLv {
        span {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
