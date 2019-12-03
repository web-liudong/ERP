<template>
  <div class="brandBox" v-if="$authorities.TemplateSubmitReviewRelevant">
    <div class="buttonBox">
      <table border="1">
        <tr>
          <th>参数模板编号：</th>
          <td>{{templateInfo.templateNo}}</td>
          <th>参数模板状态：</th>
          <td>
            {{templateInfo.templateStatus}}
          </td>
        </tr>
        <tr>
          <th><i>*</i>参数模板所属分类：</th>
          <td>
            {{templateInfo.oneLevelCategoryName}}> {{templateInfo.twoLevelCategoryName}}> {{templateInfo.threeLevelCategoryName}}
          </td>
          <th></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span>筛选查询</span>
        <div class="rightBox">
          <div class="rightBox">
            <span v-if="isShow" @click="isShow = !isShow"><i class="iconfont el-icon-arrow-up"></i>收起筛选</span>
            <span v-else="isShow" @click="isShow = !isShow"><i class="iconfont el-icon-arrow-down"></i>展开筛选</span>
            <el-button size="small" class="w80 h40" @click="postParamGroupList()">查询结果</el-button>
            <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
          </div>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span>参数组ID:</span>
          <el-input
            placeholder="参数组ID"
            v-model="query.id"
            clearable>
          </el-input>
          <span>参数组名称:</span>
          <el-input
            placeholder="参数组名称"
            v-model="query.name"
            clearable>
          </el-input>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>数据列表</span>
        <div class="listBoxRight">
          <el-button size="small" icon="el-icon-plus" @click="judgeTemplateSubmit()"
                     v-if="templateInfo.templateStatus=='草稿'">参数模板提审
          </el-button>
          <el-button size="small" icon="el-icon-search" @click="goTemplateDetaill()">参数模板详细</el-button>
          <el-button size="small" icon="el-icon-plus" @click="goTemplateAdd()">添加参数组</el-button>
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            prop="id"
            label="参数组ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="参数组名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序值"
            align="center">
          </el-table-column>
          <el-table-column
            label="相关"
            align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">参数:{{scope.row.attributeCount}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="goEdit(scope.row)" type="text" size="small"
                         v-if="$authorities.TemplateSubmitReviewRelevant">编辑
              </el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row)">详情</el-button>
              <el-button type="text" size="small" @click="deleteId=scope.row.id,dialogDelete=true"
                         v-if="$authorities.TemplateSubmitReviewRelevant">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block clearfix">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;float: right;"
          :total=returnData.total>
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="删除提示"
      :visible.sync="dialogDelete"
      width="30%">
      <span>删除数据，参数模板将变为草稿状态，再次审核通过之后，将真正删除数据，删除之后，列表将不再展示该条数据，确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDelete = false">取 消</el-button>
          <el-button type="primary" @click="dialogDelete=false, deleteParamGroupDelete()">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="提审提示"
      :visible.sync="dialogTemplateNo"
      width="30%">
      <span>参数模板至少需要有一个参数组、一个参数，当前模板不满足，无法提交审核</span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTemplateNo=false">关闭</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="提审确认"
      :visible.sync="dialogTemplateSubmit"
      width="30%">
      <span>当前填写的信息无误，确认提交审核？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTemplateSubmit = false">取 消</el-button>
          <el-button type="primary" @click="dialogTemplateSubmit=false, SubmitgetTemplateSubmit()">确 定</el-button>
        </span>
    </el-dialog>
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
  import Butt from '../../../common/Button/index'

  export default {
    inject: ['reload', 'close'],
    name: "ParamGroupList",
    data() {
      return {
        RecordId: '',
        deleteId: null,
        dialogDelete: false,
        dialogTemplateSubmit: false,
        dialogTemplateNo: false,
        templateInfo: {
          templateStatus: "",
          oneLevelCategoryName: "",
          threeLevelCategoryName: "",
          twoLevelCategoryName: "",
          updateStatus: "",
          templateId: null
        },
        query: {
          id: null,
          name: null,
          pageNum: 1,
          pageSize: 10,
          templateId: this.$route.query.id
        },
        returnData: {
          items: [],
          offset: 0,
          pageNum: 1,
          pageSize: 0,
          total: 0,
        },
        isShow: true,
        currentPage: 4,
      }
    },
    computed:{
      dataListHeight(){
        return this.$store.getters.dataListHeight;
      }
    },
    mounted() {
      this.getTemplateInfo();
      this.postParamGroupList();
      this.RecordId=this.$route.query.id;

    },
    activated(){
      if(this.RecordId!=this.$route.query.id||this.$route.params.isUpdate){
        this.getTemplateInfo();
        this.postParamGroupList();
        this.RecordId=this.$route.query.id;
        this.query.templateId=this.$route.query.id;
      }
    },

    methods: {
      reset() {
        this.query = {
          id: null,
          name: null,
          pageNum: 1,
          pageSize: 10,
          templateId: this.$route.query.id
        },
          this.getTemplateInfo();
        this.postParamGroupList();
      },
      //提审
      SubmitgetTemplateSubmit(row) {
        console.log(this.templateInfo.templateId);
        getTemplateSubmit(
          this.templateInfo.templateId
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '提审成功',
              type: "success",
            });
            this.close({
              name:'ParamGroupList',
              to:{
                name:'TemplateAdmin',
                params:{
                  isUpdate:true
                }
              }
            })
          } else {
            this.$message({
              message: '提审失败',
              type: 'warning',
            })
          }
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //删除
      deleteParamGroupDelete(row) {
        deleteParamGroupDelete(
          this.deleteId,
          this.templateInfo.templateId
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.getTemplateInfo();
            this.postParamGroupList();
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
          console.log(res);
        }).catch(err => {
          console.log(err)
        });
      },
      //判断能不能提审
      judgeTemplateSubmit() {
        console.log(this.returnData.items.length);
        if (this.returnData.items.length == 0) {
          this.dialogTemplateNo = !this.dialogTemplateNo
        } else {
          this.dialogTemplateSubmit = !this.dialogTemplateSubmit
        }
      },
      //获取参数组列表
      postParamGroupList() {
        postParamGroupList(
          this.query
        ).then((res) => {
          this.returnData = res.data
          console.log(this.returnData);
        }).catch(err => {
          console.log(err)
        });
      },
      //获取模板信息
      getTemplateInfo() {
        getTemplateInfo(
          this.$route.query.id
        ).then((res) => {
          this.templateInfo = res.data;
          console.log(this.templateInfo);
        }).catch(err => {
          console.log(err)
        });
      },
      //跳转
      handleClick(rowid) {
        this.close({
          name:'ParamGroupList',
          to:{
            name:'ParameterList',
            query: {groupId: rowid, id: this.templateInfo.templateId,}
          }
        })
//        this.$router.push({
//          path: '/goods/parameter/parameterTemplate/parameterList',
//          query: {groupId: rowid, id: this.templateInfo.templateId,}
//        });
      },
      goTemplateAdd() {
        this.$router.push({
          name:'AddParamgroup',
          query:this.templateInfo
        })
//        this.close({
//          name:'ParamGroupList',
//          to:{
//            name:'AddParamgroup',
//            query: this.templateInfo
//          }
//        })
      },
      goTemplateDetaill() {
        this.$router.push({
          path: '/goods/parameter/parameterTemplate/templateDetail',
          query: {id: this.$route.query.id}
        });

      },
      //跳转编辑
      goEdit(row) {
        this.$router.push({
          name: 'EditParamgroup',
          query: {
            name: row.name,
            sort: row.sort,
            groupId: row.id,
            templateId: this.templateInfo.templateId,
            oneLevelCategoryName: this.templateInfo.oneLevelCategoryName,
            twoLevelCategoryName: this.templateInfo.twoLevelCategoryName,
            threeLevelCategoryName: this.templateInfo.threeLevelCategoryName,
          }
        });
//        this.close({
//          name:'ParamGroupList',
//          to:{
//            name:'EditParamgroup',
//            query:{
//              name: row.name,
//              sort: row.sort,
//              groupId: row.id,
//              templateId: this.templateInfo.templateId,
//              oneLevelCategoryName: this.templateInfo.oneLevelCategoryName,
//              twoLevelCategoryName: this.templateInfo.twoLevelCategoryName,
//              threeLevelCategoryName: this.templateInfo.threeLevelCategoryName,
//
//            }
//          }
//        })
      },
      goDetail(row) {
        this.$router.push({
          name: 'DetailParamgroup',
          query: {
            groupId: row.id,
            templateId: this.templateInfo.templateId
          }
        })
      },
      //翻页
      handleSizeChange(val) {
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postParamGroupList()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        this.postParamGroupList();
      },
    }
  }
</script>
<style scoped lang="less">
  .brandBox {
    width: 100%;
    .buttonBox {
      margin-top: 10px;
      .el-button {
        width: 160px;
        height: 30px;
      }
      .active {
        background-color: #339999;
        border-color: #339999;
        color: #FFFFFF;
      }
      table {
        width: 100%;
        margin-top: 20px;
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
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-bottom: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      border-top: 0;
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
        float: right;
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        height: 56px;
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 200px;
          height: 40px;
          line-height: 56px;
          margin-left: 10px;
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

        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin-top: 10px;
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
  }
</style>
