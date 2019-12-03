<style>

</style>
<style scoped lang="less">
  .databox {
    .clearfix {
      zoom: 1
    }
    .clearfix:after {
      content: ""; //设置内容为空
      height: 0; //高度为0
      line-height: 0; //行高为0
      display: block; //将文本转为块级元素
      visibility: hidden; //将元素隐藏
      clear: both //清除浮动
    }
    width: 800px;
    margin: 20px auto;
    h2 {
      font-size: 18px;
      color: #999999;
      text-align: center;
      height: 53px;
      line-height: 53px;
    }
    table {

      width: 800px;
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
        padding-left: 20px;
        text-align: left;
        i {
          color: red;
        }
      }
      td {
        color: #666666;
        text-align: left;
        padding-left: 20px;
      }
    }
    .optionbox {
      border: 1px solid #d1d1d1;
      float: left;
      margin-left: -1px;
      margin-top: -1px;
      h3 {
        display: inline-block;
        border-bottom: 1px solid #d1d1d1;
        font-size: 16px;
        height: 53px;
        line-height: 53px;
        overflow: hidden;
        text-overflow: ellipsis;
        background: #f5f7fa;
        color: #303133;
        padding-left: 20px;
        text-align: left;
        width: 370px;
      }
      .el-checkbox-group {
        height: 53px;
        line-height: 53px;
        padding: 0px 10px;
      }
    }
  }

</style>
<template>
  <div class="redactBox">
    <div class="redactTable clear">
      <div class="redactTopBox">
        <span><i></i>查看权限管理</span>
        <span
          style="float: right;margin-right: 50px; color: red"> 角色名称 ：{{this.$route.query.name}}  (&nbsp;&nbsp;{{ this.$route.query.Id
          }}&nbsp;&nbsp;) </span>
      </div>
      <div class="databox">
        <div class="clearfix" v-for="moduleData in treeData">
          <h2>{{moduleData.label}}</h2>
          <div class="optionbox" v-for="optionbox,index in moduleData.children">
            <h3>{{optionbox.label}}</h3>
            <div>
              <el-checkbox-group
                v-model="optionbox.selOption"
                :min="0"
                :max="1">
                <el-checkbox v-for="option in optionbox.children" :label="option.select" :key="option.id"
                             @change="checkFun(option.isSel=!option.isSel)">{{option.label}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>

      <div class="clear" style="height: 100px">
        <el-button type="primary" v-backTop plain>返回顶部</el-button>
        <el-button type="primary" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="postDataAuthority()">保存设置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    postDataAuthority,
    getDataAuthority,
    getDataAuthorityAll,
    postDataAuthorityRight,
    postCreateRole,
    putUpdateRole,
    getRoleDetail,
    deleteRoleDelete,
    postCreateRoleGroup,
    putUpdateRoleGroup,
    getRoleGroupDetail,
    postRoleGroupList,
    getRoleGroupRoles,
    postRoleList,
    getAuthorityAll
  } from '@/api/system/rolePermissionAdmin'

  export default {
    name:'PermissionAdmin',
    inject:['close'],
    data() {
      return {
        OldId:'',
        checkData: {
          "dataAuthorities": [
//            {
//              "dataModuleId": 0,
//              "types": [
//                0
//              ]
//            }
          ],
          "roleId": this.$route.query.Id
        },
        checkedCities: ['全部数据可见'],
        cities: ['全部数据可见', '部分數據可見',],
        checked: false,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },

        authoritiesData: {
          authorityIds: [],
          roleId: this.$route.query.Id,
        },
        oldAuthoritiesData: [],
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
    mounted() {

    },
    methods: {
      jointData() {
        function forEachFun() {

        };
        this.treeData.forEach((item, index) => {
            item.children.forEach((item1, index) => {
              this.$set(item1, 'selOption', []); //是否選中
              item1.children.forEach((item2, index) => {
                this.$set(item2, 'select', item2.id + '&' + item2.type); //單獨編碼
                this.$set(item2, 'isSel', false); //是否選中
              })
            })
          }
        )
        console.log(this.treeData);
        this.returnData.forEach((item, index) => {
            this.$set(item, 'select', item.dataModuleId + '&' + item.type); //
            // this.$set(item, 'isSel', false); //是否選中
          }
        )
        console.log(this.returnData);
        var _this = this;
        //设置默认选中
        this.treeData.forEach((item, index) => {
            item.children.forEach((item1, index) => {
              item1.children.forEach((item2, index) => {
                _this.returnData.forEach((returnDataitem, index) => {
                    // this.$set(item, 'isSel', false); //是否選中
                    if (item2.select == returnDataitem.select) {
                      this.$set(item1, 'selOption', [returnDataitem.select]); //是否選中
                      this.$set(item2, 'isSel', true); //是否選中
                    }
                  }
                )
              })
            })
          }
        )


      },


      checkFun(data) {
        console.log(data);
        console.log(this.treeData);
      },
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
        this.getDataAuthority();
      },
      //获取权限树
      async getAuthorityAll() {
        this.OldId = this.$route.query.Id
        await getDataAuthorityAll(
        ).then((res) => {
          console.log(res)
          this.treeData = res.data;
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
        this.getDataAuthority();
      },

      //角色权限查询
      getDataAuthority() {
        getDataAuthority(
          this.$route.query.Id,
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
          this.jointData()
          //this.operationData();
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //角色权限设置
      postDataAuthority() {
        var _this = this;
        let arr = [];
        this.treeData.forEach((item, index) => {
          item.children.forEach((item1, index) => {
            //   改成多选之后的方法
//            arr = [];
//            item1.selOption.forEach((selOptionitem, index) => {
//              let crazy= selOptionitem.split('&');
//              alert(crazy)
//              arr.push(crazy[1])
//            });
            item1.children.forEach((item2, index) => {
              console.log(item2);
              if (item2.isSel == true) {
                _this.checkData.dataAuthorities.push(
                  {
                    "dataModuleId": item2.id,
                    "types": [
                      item2.type
                    ]
                    // "types": arr  如果改成多选的话 用这个
                  }
                )

              }
            })
          })
        });

        console.log(this.checkData);
        postDataAuthority(
          this.checkData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '权限设置成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: '权限设置失败',
              type: 'warning',
            })
          }
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //取消
      cancel() {
        this.close({name:'PermissionAdmin', to: {name:'RoleAdmin', params:{isUpdate:true}}});
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
      }
    },

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

  .terrBox .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
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
