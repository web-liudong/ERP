<template>
  <div class="detaillBox" >
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>参数组ID：</th>
          <td>{{returnData.id}}</td>
          <th><i>*</i>所属分类：</th>
          <td> {{returnData.oneLevelCategoryName}}>{{returnData.twoLevelCategoryName}}>{{returnData.threeLevelCategoryName}}</td>
        </tr>
        <tr>
          <th>参数组名称：</th>
          <td>{{returnData.name}}</td>
          <th><i>*</i>排序值：</th>
          <td>{{returnData.sort}}</td>
        </tr>


      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i></i>操作详情</span>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 90%"
        size="small">
        <el-table-column
          prop="date"
          label="操作者"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
    </div>
  </div>


</template>
<script>
  import {
    postParamGroupAdd,
    putParamGroupEdit,
    getParamGroupDetaills,
    deleteParamGroupDelete,
    postParamGroupNameList,
    postParamGroupList,
    getTemplateInfo,
    getTemplateSubmit
  } from '@/api/goods/paramGroupList'
  export default {
    inject:['reload','close'],
    name: "DetailParamgroup",
    data() {
      return {
        oldId:'',
        returnData:{
          id: "",
          name: "",
          sort: "",
          oneLevelCategoryName: "",
          threeLevelCategoryName: "",
          twoLevelCategoryName: "",
          templateId: null
        },
        groupId: '',//参数组ID,
        templateId: '', //参数模板ID

        tableDataMis: {
          id: '1000001',
          name: '清华同方',
          address: '同方股份有限公司',
          brandstatus: '草稿 审核情况 '
        },
        tableData: [ ],
      }
    },
    activated() {
      if (this.oldId != this.$route.query.groupId){
        this.oldId=this.$route.query.groupId;
        this.groupId = this.$route.query.groupId;
        this.templateId = this.$route.query.templateId;
        this. getParamGroupDetaills();
      }
    },
    mounted() {
      this.oldId=this.$route.query.groupId;

      this.groupId = this.$route.query.groupId;
      this.templateId = this.$route.query.templateId;
      this. getParamGroupDetaills();
    },
    methods: {
      getParamGroupDetaills(){
        getParamGroupDetaills(
          this.groupId,
          this.templateId
        ).then((res) => {
          this.returnData=res.data
          console.log(this.returnData);
        }).catch(err => {
          console.log(err)
        });
      },
    },
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
          color: #303133;
          text-align: right;
          width: 20%;
          background: #f9fafc;
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
    .detaillTable2 {
      border: 1px solid #d1d1d1;
      border-top: none;
      .copy_region {
        position: relative;
        .title {
          position: absolute;
          left: 58px;
          top: 34px;
          width: 150px;

        }
        .main {
          box-sizing: border-box;
          padding: 20px 50px 20px 170px;
          width: 100%;

          /*height: 500px;*/
          .province {
            box-sizing: border-box;
            padding: 10px;
            border: 1px solid #d1d1d1;
            margin-bottom: 10px;
          }
          .province_to {
            position: relative;
            /*border: 1px solid #d1d1d1;*/
            .classify {
              position: absolute;
              left: 0;
              width: 300px;
              height: 500px;
              border: 1px solid #d1d1d1;
              .classify_b {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding-top: 40px;
                overflow: auto;
              }
              h4 {
                position: absolute;
                top: 0;
                width: 100%;
                height: 40px;
                line-height: 40px;
                background: #f3f3f3;
              }
            }
            .isclass {
              height: 500px;
              width: 100%;
              /*border: 1px solid #d1d1d1;*/

              box-sizing: border-box;
              padding-left: 310px;
              .class_c {
                position: relative;
                width: 100%;
                height: 100%;
                border: 1px solid #d1d1d1;
                h4 {
                  position: absolute;
                  top: 0;
                  width: 100%;
                  height: 40px;
                  line-height: 40px;
                  background: #f3f3f3;
                  z-index: 4;
                }
                .class_c_b {
                  box-sizing: border-box;
                  padding-top: 40px;
                  width: 100%;
                  height: 100%;
                  overflow: auto;
                }
              }

            }
          }
        }
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

