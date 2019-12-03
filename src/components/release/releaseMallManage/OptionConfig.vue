<template>
  <div class="optionBox">
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer;margin-right:10px">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}
          </span>
          <el-button size="small" class="w80 h40" @click="queryBrand1()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
      <div class="homeBoxBottom" v-if="isShow">
        <span>选项种类：</span>
        <el-select v-model="findMallPushOptionsListParam.type" clearable placeholder="选择种类">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="toItemCorrespond()">
            <i class="iconfont icon-icon-test"></i>添加
          </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" size="small" :max-height="dataListHeight">
          <el-table-column prop="typeName" label="选项种类" align="center"></el-table-column>
          <el-table-column prop="name" label="选项名称" align="center"></el-table-column>
          <el-table-column prop="url" label="选项url" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="360px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toEditer(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="toProjectDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="findMallPushOptionsListParam.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="findMallPushOptionsListParam.pageSize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="paginations.total"
        background
      ></el-pagination>
    </div>
    <el-dialog title="数据锁定提示" :visible.sync="dialogVisible1" width="30%">
      <span>用户[ {{infoMessage}} - {{infoRealName}} ]正在编辑该条数据，数据已锁定。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="isDelBrandID()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增选项" :visible.sync="dialogFormVisible" v-el-drag-dialog>
      <el-form
        :model="mallPushOptionsParam"
        :rules="rules"
        ref="mallPushOptionsParam"
        class="demo-ruleForm"
      >
        <el-form-item label="选项种类：" :label-width="formLabelWidth" prop="type">
          <el-select v-model="mallPushOptionsParam.type" clearable placeholder="选择种类">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="mallPushOptionsParam.name" autocomplete="off" placeholder="请输入1~10的汉字"></el-input>
        </el-form-item>
        <el-form-item label="选项地址：" :label-width="formLabelWidth" prop="url">
          <el-input v-model="mallPushOptionsParam.url" autocomplete="off" placeholder="请输入url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('mallPushOptionsParam')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑选项" :visible.sync="dialogFormVisible1" v-el-drag-dialog>
      <el-form
        :model="editermallPushOptionsParam"
        :rules="rules"
        ref="editermallPushOptionsParam"
        class="demo-ruleForm"
      >
        <el-form-item label="选项种类：" :label-width="formLabelWidth" prop="type">
          <el-select v-model="editermallPushOptionsParam.type" clearable placeholder="选择种类">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项名称：" :label-width="formLabelWidth" prop="name">
          <el-input
            v-model="editermallPushOptionsParam.name"
            autocomplete="off"
            placeholder="请输入1~10的汉字"
          ></el-input>
        </el-form-item>
        <el-form-item label="选项地址：" :label-width="formLabelWidth" prop="url">
          <el-input
            v-model="editermallPushOptionsParam.url"
            autocomplete="off"
            placeholder="请输入url"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submitFormEditer('editermallPushOptionsParam')">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="dialogVisible2" width="30%">
      <span>删除之后，列表将不再展示该条数据，确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="isDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from "@/store/store";
import {
  passedBrandList,
  noPassBrandList,
  draftBrandList,
  getBrandStatus,
  deleteBrandID,
  getBrandDetail,
  toAuditBrand,
  batchImport,
  remoteBrandName,
  queryBrand,
  checkName
} from "@/api/brandManage";
import {
  getDataList,
  getOptionList,
  addMallOption,
  editerMallOption,
  byIDGetMallOption,
  byIDDelMallOption
} from "@/api/release/mallProjectManage";
import elDragDialog from "@/directive/el-dragDialog";
export default {
  inject: ["reload", "close" , "isFilterShow"],
  name: "OptionConfig",
  data() {
    return {
      isShow: this.isFilterShow,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      loading1: false,
      tableData: null,
      infoRealName: "",
      options4: null,
      //添加商城选项的对话框
      dialogFormVisible: false,
      dialogFormVisible1: false,
      //新增商城选项
      mallPushOptionsParam: {
        name: "",
        type: null,
        url: ""
      },
      editermallPushOptionsParam: {
        name: "",
        type: null,
        url: ""
      },
      //编辑id
      editerID: "",
      //删除id
      deleteID: "",
      options: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "商品数据推送"
        },
        {
          value: 1,
          label: "订单数据推送"
        },
        {
          value: 2,
          label: "发票数据推送"
        },
        {
          value: 3,
          label: "退换货数据推送"
        }
      ],
      options1: [
        {
          value: 0,
          label: "商品数据推送"
        },
        {
          value: 1,
          label: "订单数据推送"
        },
        {
          value: 2,
          label: "发票数据推送"
        },
        {
          value: 3,
          label: "退换货数据推送"
        }
      ],
      //错误提示消息
      infoMessage: "",
      findMallPushOptionsListParam: {
        pageNum: 1,
        pageSize: 10,
        type: ""
      },
      paginations: {
        total: 100 //总数
      },
      dialogVisible1: false,
      dialogVisible2: false,
      formLabelWidth: "120px",
      rules: {
        type: [
          { required: true, message: "请选择数据推送种类", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入选项名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在1~10个字之间", trigger: "change" }
        ],
        url: [{ required: true, message: "请输入选项地址", trigger: "blur" }]
      }
    };
  },
  created() {
    //获取表格数据
    this.getTableData();
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.getTableData();
    }
  },
  directives: {
    elDragDialog
  },
  methods: {
    reset() {
      this.findMallPushOptionsListParam = {
        pageNum: 1,
        pageSize: 10,
        type: ""
      };
      this.getTableData();
    },
    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        let aa = { name: query };
        remoteBrandName(aa).then(res => {
          if (res.code == "000000") {
            this.options4 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    //获取表格数据
    getTableData() {
      getOptionList(this.findMallPushOptionsListParam).then(res => {
        this.tableData = res.data.items;
        console.log(res.data, 5555);
        this.paginations.total = res.data.total;
        this.findMallPushOptionsListParam.pageNum = res.data.pageNum;
        this.findMallPushOptionsListParam.pageSize = res.data.pageSize;
      });
    },
    //去编辑
    toEditer(row) {
      this.editerID = row.id;
      byIDGetMallOption(row.id).then(res => {
        this.editermallPushOptionsParam = res.data;
      });
      this.dialogFormVisible1 = true;
    },
    //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
    queryBrand1() {
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.findMallPushOptionsListParam.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.findMallPushOptionsListParam.pageSize = val;
      this.getTableData();
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    ///新增选项
    toItemCorrespond() {
      this.dialogFormVisible = true;
    },
    //新增商城选项
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addMallOption(this.mallPushOptionsParam).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "添加选项成功",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.mallPushOptionsParam.name = "";
              this.mallPushOptionsParam.type = null;
              this.mallPushOptionsParam.url = "";
            }
          });
        }
      });
    },
    //编辑商城选项
    submitFormEditer(formName) {
      console.log(this.editermallPushOptionsParam, 888);
      this.$refs[formName].validate(valid => {
        if (valid) {
          editerMallOption(this.editerID, this.editermallPushOptionsParam).then(
            res => {
              if (res.code == "000000") {
                this.$message({
                  message: "编辑选项成功",
                  type: "success"
                });

                this.dialogFormVisible1 = false;
                this.editermallPushOptionsParam.name = "";
                this.editermallPushOptionsParam.type = null;
                this.editermallPushOptionsParam.url = "";
              }
            }
          );
        }
      });
    },
    //删除
    toProjectDelete(row) {
      this.dialogVisible2 = true;
      this.deleteID = row.id;
    },
    //是否删除
    isDelete() {
      byIDDelMallOption(this.deleteID).then(res => {
        if (res.code == "000000") {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.dialogVisible2 = false;
          this.getTableData();
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.optionBox {
  width: 100%;
  clear: both;
  .buttonBox {
    margin-top: 10px;
    .el-button {
      width: 160px;
      height: 30px;
    }
    .active {
      background: #339999;
      color: #fff;
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
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 0;
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
      .el-select {
        margin-left: 10px;
        width: 200px;
        height: 40px;
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
    line-height: 50px;
    .listBoxTop {
      line-height: 50px;
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
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
    text-align: right;
  }
}
</style>

<style lang="less" scoped>
.optionBox {
  .el-dialog__header {
    padding: 10px;
    padding-bottom: 0;
    background: #e4e4e4;
    height: 50px;
    line-height: 50px;
  }
  .el-dialog {
    .el-form {
      .el-form-item {
        .el-input {
          width: 400px;
          margin-top: 10px;
        }
        margin-bottom: 10px;
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #339999;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
        }
        .avatar {
          width: 120px;
          height: 120px;
          display: block;
        }
        .el-textarea {
          width: 400px;
        }
        .textBox {
          width: 400px;
        }
      }
    }
  }
}
</style>










