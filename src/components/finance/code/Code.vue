<template>
  <div class="accreditstorBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow"><i class="el-icon-arrow-up"></i>收起筛选</span>
          <span v-else @click="isShow = !isShow"><i class="el-icon-arrow-down"></i>展开筛选</span>
          <el-button size="small" class="w80 h40" @click="postCodeList()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-show="isShow">
          <div class="time-box">
          <span >税收分类编码：</span>
          <el-input
            @keyup.native="proving3"
            placeholder="税收分类编码"
            v-model="query.code"
            clearable>
          </el-input>
          </div>
          <div class="time-box">
          <span >名称/说明/关键词：</span>
          <el-input
            placeholder="名称/说明/关键词"
            v-model="query.name"
            clearable>
          </el-input>
          </div>
          <div class="time-box">
          <span >是否可归并上一级：</span>
          <el-select v-model="query.isMergedToParentLevel" placeholder="是否可归并上一级">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </div>
          <div class="time-box">
          <span >可用状态：</span>
          <el-select v-model="query.isAvailable" placeholder="可用状态">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </div>
          <div class="time-box">
            <span>简称:</span>
            <el-input
              placeholder="简称"
              v-model="query.shortName"
              clearable>
            </el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="icon iconfont iconjinridingdanshu"></i>&nbsp;数据列表</span>
        <div class="listBoxRight">
          <!--<router-link :to="{name:'FinanceCodeImportRecord'}"   v-if="$authorities.CodeBulkImportRelevant"  target="_blank" style="margin-right: 10px">-->
          <el-button size="small" @click="FinanceCodeImportRecord()" v-if="$authorities.CodeBulkImportRelevant">导入记录
          </el-button>
          <!--</router-link>-->
          <el-button size="small" class="w80 h40" v-if="$authorities.CodeBulkImportRelevant" @click="importfile">批量导入
          </el-button>
          <el-button size="small" class="w80 h40" v-if="$authorities.CodeCreate"
                     @click=" dialogCreate = !dialogCreate;">添加
          </el-button>
        </div>
        <el-table
          :max-height="dataListHeight"
          :data="returnData.items"
          border
          stripe
          style="width: 100%"
          size="small">
          <el-table-column
            show-overflow-tooltip
            prop="code"
            label="税收编码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="商品和服务名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="shortName"
            label="商品和服务分类简称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="taxRate"
            label="增值税税率"
            width="120"
            align="center">
            <template slot-scope="scope">
              {{scope.row.taxRate}}%
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="description"
            label="说明"
            align="center">
          </el-table-column>
          <el-table-column
            label="是否可归并上一级"
            width="140"
            align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.isMergedToParentLevel == true">是</i>
              <i v-if="scope.row.isMergedToParentLevel == false">否</i>
            </template>
          </el-table-column>
          yin
          <el-table-column
            label="可用状态"
            width="80"
            align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.isAvailable == true">是</i>
              <i v-if="scope.row.isAvailable == false">否</i>
            </template>
          </el-table-column>
          <el-table-column
            label="相关"
            width="140"
            align="center">
            <template slot-scope="scope">

              <el-button @click="goCategory(scope.row)" v-if="scope.row.categoryCount>0&&$authorities.Category" type="text" size="small">
                分类:{{scope.row.categoryCount}}
              </el-button>
              <el-button v-else type="text" size="small">分类:{{scope.row.categoryCount}}
              </el-button>

              <el-button @click="goGoodsManage(scope.row)" v-if="scope.row.skuCount>0&&$authorities.GoodsManage" type="text" size="small">
                商品:{{scope.row.skuCount}}
              </el-button>
              <el-button v-else type="text" size="small">商品:{{scope.row.skuCount}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small"
                         v-if="$authorities.CodeUpdate"
                         @click="deleteId = scope.row.id,openRedactCode()">编辑
              </el-button>
              <el-button type="text" size="small"
                         v-if="$authorities.CodeDelete"
                         v-show="!scope.row.skuCount && !scope.row.categoryCount"
                         @click="dialogDelete = !dialogDelete ,deleteId = scope.row.id">删除
              </el-button>
              <el-button type="text" size="small"
                         v-if="$authorities.CodeDelete"
                         v-show="scope.row.skuCount || scope.row.categoryCount"
                         :disabled=true
                         @click="dialogDelete = !dialogDelete ,deleteId = scope.row.id">删除
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
          :current-page="currentPage"
          :page-size="returnData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="height: 38px;"
          :total="returnData.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogDelete" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">删除提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">删除之后，列表将不再展示该条数据，确定要删除吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary"
                   v-if="$authorities.CodeDelete"
                   @click="dialogDelete=false,deleteCodeDelete()">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReadct" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">编辑分类</span>
      </div>
      <div class="message-box">
        <el-form :model="redactData" :rules="rules" ref="redactData" label-width="160px" class="demo-ruleForm"
                 style="margin-top: 20px;">
          <el-form-item label="税收编码：" prop="code">
            <el-input v-model="redactData.code" @keyup.native="proving1"></el-input>
          </el-form-item>
          <el-form-item label="商品和服务名称：" prop="name">
            <el-input v-model="redactData.name"></el-input>
          </el-form-item>
          <el-form-item label="简称：">
            <el-input v-model="redactData.shortName"></el-input>
          </el-form-item>
          <el-form-item label="增值税税率：" prop="taxRate">
            <el-input v-model="redactData.taxRate"></el-input>
            %
          </el-form-item>
          <el-form-item label="说明：">
            <el-input type="textarea" v-model="redactData.description" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="是否可归并上一级：" required>
            <el-radio-group v-model="redactData.isMergedToParentLevel">
              <el-radio :label=true>是</el-radio>
              <el-radio :label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="可用状态：" required>
            <el-radio-group v-model="redactData.isAvailable">
              <el-radio :label=true>是</el-radio>
              <el-radio :label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="$authorities.CodeUpdate" @click="submitForm('redactData')">修改</el-button>
        <el-button @click=" dialogReadct = !dialogReadct;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogCreate" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">添加分类</span>
      </div>
      <div class="message-box">
        <el-form :model="createData" :rules="rules" ref="createData" label-width="160px" class="demo-ruleForm"
                 style="margin-top: 20px;">
          <el-form-item label="税收编码：" prop="code">
            <el-input @keyup.native="proving2" v-model="createData.code"></el-input>
          </el-form-item>
          <el-form-item label="商品和服务名称：" prop="name">
            <el-input v-model="createData.name"></el-input>
          </el-form-item>
          <el-form-item label="简称：">
            <el-input v-model="createData.shortName"></el-input>
          </el-form-item>
          <el-form-item label="增值税税率：" prop="taxRate">
            <el-input v-model="createData.taxRate"></el-input>
            %
          </el-form-item>
          <el-form-item label="说明：">
            <el-input type="textarea" v-model="createData.description" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="是否可归并上一级：" required>
            <el-radio-group v-model="createData.isMergedToParentLevel">
              <el-radio :label=true>是</el-radio>
              <el-radio :label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="可用状态：" required>
            <el-radio-group v-model="createData.isAvailable">
              <el-radio :label=true>是</el-radio>
              <el-radio :label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="$authorities.CodeCreate" @click="createSubmitForm('createData')">添加</el-button>
        <el-button @click=" dialogCreate = !dialogCreate;">取消</el-button>
      </div>
    </el-dialog>

    <importFile ref="importFile" :title="'税收编码批量导入'" :type="'finance-code-import'" :params="{id:'01wEfagGlm5nA%3D'}"
                @callback="importCallback"></importFile>
  </div>
</template>

<script>
  import {
    postAccreditAdd,
    getAccreditDetaills,
    putAccreditRedact,
    deleteAccreditDelete,
    postAccreditList,
    postAccreditAddLog
  } from '@/api/goods/accreditStor'
  import {
    getCodeInfo,
    deleteCodeDelete,
    postCodeCreate,
    postCodeImport,
    postCodeList,
    putCodeUpdate
  } from '@/api/finance/code'
  import importFile from "@/components/common/module/ImportFile";

  export default {
    inject: ['reload'],
    name: "FinanceCode",
    data() {
      const validateTaxRate = (rule, value, callback) => {
        if (!value) {
          callback(new Error('必须输入增值税税率'))
        }
        value = Number(value)
        if (typeof value === 'number' && !isNaN(value)) {
          if (value < 0 || value > 100) {
            callback(new Error('增值税税率在 0 至 100 %之间'))
          } else {
            callback()
          }
        } else {
          callback(new Error('增值税税率必须为数字'))
        }
      }
      return {
        list: [],
        certificateFileId: [], //资质文件id（多个用英文逗号分隔）
        imageUrl: [],
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
            {required: true, message: '请输入税收编码', trigger: 'change'},
            {min: 19, max: 19, message: '税收编码长度在19个字符', trigger: 'change'}
          ],
          taxRate: [
            {required: true, validator: validateTaxRate, trigger: 'change'}
          ],
          description: [
            {required: false, message: '请输入说明', trigger: 'change'}
          ],
        },
        redactData: {
          id: null,
          code: null,
          description: null,
          isAvailable: true,
          isMergedToParentLevel: true,
          name: null,
          taxRate: null,
        },
        createData: {
          code: null,
          description: null,
          isAvailable: true,
          isMergedToParentLevel: true,
          name: null,
          taxRate: null,
        },
        dowName: '',
        dowBrand: '',
        returnData: {
          items: [],
          offset: '',
          pageNum: 0,
          pageSize: 0,
          total: 0,
        },
        deleteId: 0,
        typeOptions: [{
          value: null,
          label: '不限'
        }, {
          value: true,
          label: '是'
        }, {
          value: false,
          label: '否'
        }],
        stateOptions: [{
          value: '',
          label: '不限'
        }, {
          value: 'true',
          label: '是'
        }, {
          value: 'false',
          label: '否'
        }],
        //税收编码查询
        query: {
          code: null,
          description: null,
          isAvailable: null,
          isMergedToParentLevel: null,
          name: null,
          shortName:null,
          pageNum: 1,
          pageSize: 10,
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
        dialogDelete: false,
        dialogReadct: false,
        dialogImport: false,
        dialogCreate: false,
      }
    },
    components: {
      importFile
    },
    computed: {
      dataListHeight() {
        return this.$store.getters.dataListHeight;
      }
    },
    mounted() {
      this.postCodeList();
      //this.postAccreditAddLog();
    },
    methods: {
      reset() {
        this.query = {
          code: null,
          description: null,
          isAvailable: null,
          isMergedToParentLevel: null,
          name: null,
          pageNum: 1,
          pageSize: 10,
        },
          this.postCodeList();
      },
      proving1() {
        this.redactData.code = this.redactData.code.replace(/[^\.\d]/g, '');
        this.redactData.code = this.redactData.code.replace('.', '');
      },
      proving2() {
        this.createData.code = this.createData.code.replace(/[^\.\d]/g, '');
        this.createData.code = this.createData.code.replace('.', '');
      },
      proving3() {
        this.query.code = this.query.code.replace(/[^\.\d]/g, '');
        this.query.code = this.query.code.replace('.', '');
      },

      FinanceCodeImportRecord() {
        this.$router.push({path: '/finance/code/codeimportrecord'});
      },
      //请求列表接口
      postCodeList() {
        postCodeList(
          this.query
        ).then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
          console.log(err);
        });
      },
      //删除方法接口
      deleteCodeDelete() {
        deleteCodeDelete(
          this.deleteId
        ).then((res) => {
          if (res.data == '1') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.postCodeList();
          } else if (res.data == '0') {
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
          this.postList();
        }).catch(err => {

        });
      },
      //新增税收编码接口
      postCodeCreate() {
        postCodeCreate(
          this.createData
        ).then((res) => {
          console.log(res)
          if (res.code == '000000') {
            this.$message({
              message: '添加成功',
              type: "success",
            });
            this.postCodeList();
          } else {
            this.$message({
              message: '添加失败',
              type: 'warning',
            })
          }
          this.dialogCreate = !this.dialogCreate;
        }).catch(err => {
          console.log(err);
        });
      },
      //编辑税收编码接口
      putCodeUpdate() {
        console.log(this.createData);
        putCodeUpdate(
          this.deleteId,
          this.redactData
        ).then((res) => {
          if (res.data == '1') {
            this.$message({
              message: '修改成功',
              type: "success",
            });
            this.postCodeList();
          } else if (res.data == '0') {
            this.$message({
              message: '修改失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        });
        this.dialogReadct = !this.dialogReadct;
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
      //跳转商品
      goGoodsManage(row) {
        this.$router.push({
          name: 'GoodsManage',
          query: {
            taxId: row.id
          }
        });
      },
      //跳转分类
      goCategory(row) {
        this.$router.push({
          name: 'Category3',
          query: {
            taxId: row.id
          }
        });
      },
      //翻页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.query.pageSize = val;
        this.query.pageNum = 1;
        this.postCodeList();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        console.log(`当前页: ${val}`);
        this.postCodeList();
      },
      importfile() {
        this.$refs["importFile"].init();
      },
      importCallback() {
        //回调处理
      },
      ///////////上传 ///////////
      //单独文件下载
      getCodeFileDownload() {
        let token = '&access_token=' + this.$auth.token;
        let href = '/api/file-service/file/download?id=74' + token;
        window.open(href, '_blank')
      },
      ///////////上传end ///////////
      //编辑提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.putCodeUpdate();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //新增提交
      createSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postCodeCreate();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped lang="less">
  .accreditstorBox {
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
      .time-box {
        display: inline-block;
        padding: 5px 10px;
        font-size: 14px;
      }
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
          line-height: 56px;
          margin-left: 10px;
        }
        .el-select {
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
    .dialogReadct {
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
<style>

</style>
