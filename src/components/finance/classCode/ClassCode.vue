<template>
  <div class="classcodeBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="iconfont el-icon-arrow-up"></i>收起筛选</span>
          <span v-else="isShow" @click="isShow = !isShow"><i class="iconfont el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postCategoryCodeList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <span style="margin-left:20px;">一级分类：</span>
          <el-select v-model="query.firstCategoryId" clearable filterable placeholder="一级分类" @change="firstChange">
            <el-option
              v-for="item in firstClass"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span style="margin-left:20px;">二级分类：</span>
          <el-select v-model="query.secondCategoryId" clearable filterable placeholder="二级分类" @change="secondChange">
            <el-option
              v-for="item in secondClass"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span style="margin-left:20px;">三级分类：</span>
          <el-select v-model="query.thirdCategoryId" clearable filterable placeholder="三级分类" @change="thirdChange">
            <el-option
              v-for="item in thirdClass"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
        </div>
        <el-table
          ref="tableData"
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          size="small">
          <template slot="empty">
            <span style="color: #909399">该模块暂无数据，请点击添加【添加分类】按钮进行分类的添加</span>
          </template>
          <el-table-column
            label="全选"
            type="selection"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="firstLevelName"
            label="一级分类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="secondLevelName"
            label="二级分类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="thirdLevelName"
            label="三级分类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="税收分类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="taxCode"
            label="税收编码"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="$authorities.ClassCodeAffirm" @click="clickAffirm(scope.row)">
                确认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <!--<el-checkbox style="float: left;margin-left: 20px; height: 38px;bottom: 5px;"  @change="toggleSelection(returnData.items)">全选-->
        <!--</el-checkbox>-->
        <el-button size="small" style="float: left;margin-left: 20px;" v-if="$authorities.ClassCodeAffirmAll"
                   @click="clickAllAffirm()">批量确认
        </el-button>
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="returnData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogAffirm" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">税收编码确认</span>
      </div>
      <div class="message-box">
        <el-form :model="affirmData" :rules="rules" ref="redactData" label-width="160px" class="demo-ruleForm"
                 style="margin-top: 20px;">
          <el-form-item label="分类层级：">
          <span style="color: red;">
            {{affirmData.firstLevelName}}/{{affirmData.secondLevelName}}/{{affirmData.thirdLevelName}}
          </span>
          </el-form-item>
          <el-form-item label="税收分类：" prop="organizationName">
            <el-select
              style="width:70%"
              v-model="affirmData.name"
              filterable
              remote
              @change="getValue"
              placeholder="请输入并选择授权单位"
              :remote-method="remoteBrandMethod"
            >
              <el-option
                v-for="item in organizationOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="税收分类编码：" prop="taxCode">
            <el-input v-model="affirmData.taxCode" style="width:70%" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerVisible = true">确认</el-button>
        <el-button @click=" dialogAffirm = !dialogAffirm;">取消</el-button>
      </div>
      <el-dialog
        width="350px"
        title="确认通过提示"
        :visible.sync="innerVisible"
        append-to-body>
        <div><p>税收分类编码关联无误，确认通过？</p></div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('redactData')">确认</el-button>
          <el-button @click=" innerVisible = false;">取消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog :visible.sync="dialogAllAffirm" width="800px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">税收编码批量确认</span>
      </div>
      <div class="message-box">
        <el-table
          :data="multipleSelection"
          max-height="350"
          border
          stripe
          style="width: 100%;margin-bottom: 20px;">
          <el-table-column
            prop="taxCodeId"
            label="分类"
            align="center">
            <template slot-scope="scope">
          <span style="color: red;">
            {{scope.row.firstLevelName}}/{{scope.row.thirdLevelName}}/{{scope.row.secondLevelName}}
          </span>
            </template>
          </el-table-column>
          <el-table-column
            label="税收分类"
            align="center">
            <template slot-scope="scope">
              <el-select
                style="width:70%"
                v-model="scope.row.name"
                filterable
                remote
                @change="getTableValue($event,scope.row.thirdCategoryId)"
                placeholder="请输入并选择税收分类"
                :remote-method="remoteBrandTableMethod">
                <el-option
                  v-for="item in organizationTableOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="税收编码"
            align="center">
            <template slot-scope="scope">
          <span>
           {{scope.row.taxCode}}
          </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogAllAffirm=false,postConfirmSelectCode()">确认通过</el-button>
        <el-button @click="dialogAllAffirm = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {provinces_based_id, postSupplierOptions, postBrandOptions, deleteFileDelete} from "@/api/common/commonApi"
  import {
    getTaxcodeSearch,
    postConfirmCode,
    postConfirmSelectCode,
    postCategoryCodeList,
  } from '@/api/finance/classCode'
  import {selectList} from '@/api/classManage'
  import {addTemplate} from '@/api/templateManage'

  export default {
    inject: ['reload'],
    name: "FinanceClassCode",
    data() {
      return {
        multipleSelection: [],//多选的数据
        allAffirmData: {
          thirdCategoryId: [
            0
          ],
        },//批量确认发送的数据
        organizationOptions: [],//单独确认的税收编码下拉框
        organizationTableOptions: [],//table确认的下拉框
        firstClass: [],
        secondClass: [],
        thirdClass: [],
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入商品和服务名称', trigger: 'blur'},
          ],
          code: [
            {required: true, message: '请输入税收编码', trigger: 'change'}
          ],
          taxRate: [
            {required: true, message: '请输入增值税税率', trigger: 'change'}
          ],
          description: [
            {required: true, message: '请输入说明', trigger: 'change'}
          ],
        },
        affirmData: {
          firstLevelName: null,
          name: null,
          secondLevelName: null,
          taxCode: null,
          taxCodeId: null,
          thirdCategoryId: null,
          thirdLevelName: null
        },
        redactData: {
          id: null,
          code: null,
          description: null,
          isavailable: null,
          ismergedtoparentlevel: null,
          name: null,
          taxRate: null,
        },
        returnData: {
          items: [],
          offset: '',
          pageNum: 0,
          pageSize: 0,
          total: 0,
        },
        deleteId: 0,
        typeOptions: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '是'
        }, {
          value: '1',
          label: '否'
        }],
        stateOptions: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '是'
        }, {
          value: '1',
          label: '否'
        }],
        //查询
        query: {
          name: null,
          pageNum: 1,
          pageSize: 10,
          firstCategoryId: null,
          secondCategoryId: null,
          thirdCategoryId: null,
          taxCode: null,
        },
        //删选显示
        isShow: true,
        //表格数据
        tableData: [{
          brandName: "授权品牌名称test2",
          endTime: "2018-11-16T14:35:39.590+0000",
          fileId: "37,38,40",
          id: 5,
          organizationName: "测试test2",
          organizationType: 1,
          pageNum: 0,
          pageSize: 0,
          startTime: "2018-11-16T14:35:39.590+0000",
          validityStatus: "即将到期 倒计时：0天"
        }],
        //翻页
        currentPage: 1,
        dowTableData: [],
        dialogAffirm: false,
        dialogAllAffirm: false,
        innerVisible: false,
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        checked: false,
      }
    },
    computed: {
      loading() {
        return this.$store.getters.loading
      },
      dataListHeight() {
        return this.$store.getters.dataListHeight;
      }
    },
    created() {
      this.getFirst();
      this.postCategoryCodeList();
    },
    mounted() {

    },
    activated() {
      if (this.$route.params.isUpdate) {
        this.getFirst();
        this.postCategoryCodeList();
      }
    },
    methods: {
      reset() {
        this.query = {
          name: null,
          pageNum: 1,
          pageSize: 10,
          firstCategoryId: null,
          secondCategoryId: null,
          thirdCategoryId: null,
          taxCode: null,
        },
          this.getFirst();
        this.postCategoryCodeList();
      },
      //Table下拉框事件
      getTableValue($event, thirdCategoryId) { //前面是选择的税收分类，后面是三级分类id
        console.log(this.multipleSelection);
        console.log($event);
        console.log(thirdCategoryId);
        let codeData = this.organizationTableOptions.filter(item => {  //查找是哪一条税收分类
          return item.id == $event;
        });
        //在列表中匹配对应的三级分类，并更改相应的值
        this.multipleSelection.forEach(item => {
          if (item.thirdCategoryId == thirdCategoryId) {
            item.name = codeData[0].name;
            item.taxCode = codeData[0].code
            item.taxCodeId = codeData[0].id
          }
          ;
        })
        console.log(this.multipleSelection);
        let crazy = [];
        let chl = this.multipleSelection.filter(item => {
          //return crazy.push([item.thirdCategoryId,item.taxCodeId]) ;
          return crazy.push(item.thirdCategoryId);
        });
        this.allAffirmData.thirdCategoryId = crazy;//拼接的数组
        console.log(this.allAffirmData);

      },
      //下拉框事件
      getValue(value) {
        console.log(value);
        this.affirmData.taxCodeId = value;
        let name = this.organizationOptions.filter(item => {
          return item.id == value;
        });
        this.affirmData.taxCode = name[0].code;
        this.affirmData.name = name[0].name;
        console.log(this.affirmData);
//        console.log(this.addData.supplierId);
//        console.log(this.addData.organizationName);
      },
      //模糊搜索
      remoteBrandMethod(query) {
        console.log(query)
        if (query !== '') {
          getTaxcodeSearch(
            query
          ).then((res) => {
            console.log(res)
            this.organizationOptions = res.data;
            console.log(this.organizationOptions);
          }).catch(err => {
            console.log(err)
          });
        } else {
          this.brandNameOptions = [];
        }
      },
      //模糊搜索
      remoteBrandTableMethod(query) {
        console.log(query)
        if (query !== '') {
          getTaxcodeSearch(
            query
          ).then((res) => {
            console.log(res)
            this.organizationTableOptions = res.data;
//            console.log(this.organizationOptions);
          }).catch(err => {
            console.log(err)
          });
        } else {
          this.brandNameOptions = [];
        }
      },
      //点击确认
      clickAffirm(row) {
        this.dialogAffirm = !this.dialogAffirm;
        this.affirmData = row;
        console.log(this.affirmData);
      },
      //单个确认接口
      postConfirmCode() {
        postConfirmCode(
          this.affirmData.thirdCategoryId,
          this.affirmData.taxCodeId
        ).then((res) => {
          if (res.data == '1') {
            this.$message({
              message: '确认成功',
              type: "success",
            });
            this.dialogAffirm = false;
            this.innerVisible = false;
            this.postCategoryCodeList();
          } else if (res.data == '0') {
            this.$message({
              message: '确认失败',
              type: 'warning',
            })
          }
          console.log(res);
        }).catch(err => {
          console.log(err);
        });
      },
      //点击批量确认
      clickAllAffirm() {
        this.dialogAllAffirm = !this.dialogAllAffirm;
      },
      //批量确认接口
      postConfirmSelectCode(id) {
        postConfirmSelectCode(
          this.allAffirmData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '确认成功',
              type: "success",
            });
            this.dialogAffirm = false
            this.postCategoryCodeList();
          } else {
            this.$message({
              message: '确认失败',
              type: 'warning',
            })
          }
        }).catch(err => {
          console.log(err);
        });
      },
      //获取列表
      postCategoryCodeList() {
        postCategoryCodeList(
          this.query
        ).then((res) => {
          this.returnData = res.data;
          console.log(this.returnData);
        }).catch(err => {
          console.log(err);
        });
      },
      //三级分类联动
      getFirst() {
        selectList(1, 1).then(res => {
          if (res.code == '000000') {
            this.firstClass = res.data;
          }
        })
      },
      getSecond(val) {
        selectList(2, val).then(res => {
          if (res.code == '000000') {
            this.secondClass = res.data;
          }
        })
      },
      getThird(val) {
        selectList(3, val).then(res => {
          if (res.code == '000000') {
            this.thirdClass = res.data;
          }
        })
      },
      firstChange(val) {
        this.firstCategoryId = val;
        if (val) {
          this.getSecond(val);
        }
      },
      secondChange(val) {
        this.secondCategoryId = val;
        if (val) {
          this.getThird(val);
        }
      },
      thirdChange(val) {
        this.thirdCategoryId = val;
      },
      //获取详情
      getCodeInfo() {
        getCodeInfo(
          this.deleteId
        ).then((res) => {
          this.redactData = res.data;
          console.log(this.redactData);
        }).catch(err => {
          console.log(err);
        });
      },
      //打开编辑
      openRedactCode(id) {
        this.dialogReadct = !this.dialogReadct;
        this.getCodeInfo();
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postCategoryCodeList();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postCategoryCodeList();
      },
      //单个确认
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postConfirmCode();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //表格多选
      toggleSelection(rows) {
        console.log(rows);
        if (rows) {
          rows.forEach(row => {
            this.$refs.tableData.toggleRowSelection(row);
          });
        } else {
          this.$refs.tableData.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val; //选择的数据
        console.log(this.multipleSelection);
        console.log(this.multipleSelection);
        let crazy = [];
        let chl = this.multipleSelection.filter(item => {
          // return crazy.push([item.thirdCategoryId,item.taxCodeId]) ;
          return crazy.push(item.thirdCategoryId);
        });
        this.allAffirmData.thirdCategoryId = crazy;//拼接的数组
        console.log(this.allAffirmData);
      }
    }
  }
</script>
<style >
  .classcodeBox  .el-table__header .el-table-column--selection .cell .el-checkbox:after {
    content: "   全选";
  }
</style>
<style scoped lang="less">
  .classcodeBox {
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
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #303133;
        }
      }
      .rightBox {
        height: 48px;
        float: right;
        span {
          font-size: 14px;
          margin-left: 10px;
          color: #333;
          cursor: pointer;
          font-size: 14px;
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
        .el-button {
          font-size: 12px;
          margin-left: 0px;
        }
      }
    }
    .block {
      margin-top: 10px;
      margin-right: 20px;
      text-align: right;
    }
    .dowBox {
      .dowInfo {
        margin-bottom: 20px;
        span {
          height: 40px;
          line-height: 40px;
          i {
            color: red;
          }
        }
      }
    }
    .dialogImport {
      p {
        line-height: 42px;
        margin-left: 30px;
        a {
          color: red;
        }
      }
      .upload-demo {
        margin-left: 30px;
        .tow {
          float: left;
          line-height: 32px;
          margin-right: 30px;
        }
      }
    }
    .dialogAllAffirm {
      .el-input {
        width: 75%;
      }
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
