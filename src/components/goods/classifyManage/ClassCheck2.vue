<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="基本信息"></addhead>
      <table border="1">
        <tr>
          <th>分类编号：</th>
          <td>{{code}}</td>
          <th>
            <i>*</i>分类级别：
          </th>
          <td>{{classLevel}}</td>
        </tr>
        <tr>
          <th>
            <i>*</i>二级分类名称：
          </th>
          <td>{{className}}</td>
          <th>
            <i>*</i>所属一级分类：
          </th>
          <td>{{parentName}}</td>
        </tr>
        <tr>
          <th>二级分类状态：</th>
          <td>{{statusDescription}}</td>
          <th>
            <i>*</i>分类管理员账号：
          </th>
          <td>{{userDataAuthorityAccount}}</td>
        </tr>
        <tr>
          <th>分类管理员姓名：</th>
          <td>{{userDataAuthorityName}}</td>
          <th></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <addhead headname="操作详情"></addhead>
      <el-table :data="categoryOperationLogList" border style="width: 90%" size="small">
        <el-table-column prop="userInfo.userFullName" label="操作者" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" style="width: 33%" align="center"></el-table-column>
        <el-table-column prop="description" label="操作描述" style="width: 33%" align="center"></el-table-column>
      </el-table>
      <div class="button-box">
        <el-button type="primary" @click="dialogTableVisible = true">驳回</el-button>
        <el-button type="primary" @click="checkOk">审核通过</el-button>
        <el-button type="primary" @click="close()">关闭</el-button>
        <el-button type="primary" v-backTop>回顶部</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">驳回</span>
      </div>
      <div class="message-box">
        <el-form :model="rejectForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="驳回原因" prop="description">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="1~200字以内"
              v-model="rejectForm.description"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import addhead from "@/components/common/head/head";
import { detai2, reviewPass, reviewReject, getstatus } from "@/api/classManage";
export default {
  inject: ["reload", "close"],
  name:'CategoryCheck2',
  data() {
    return {
      id: 0,
      code:'',
      classLevel: 0,
      className: "",
      statusDescription: "",
      updateStatusDescription: "",
      categoryOperationLogList: [],
      dialogTableVisible: false,
      description: "",
      userDataAuthorityAccount: "",
      userDataAuthorityName: "",
      parentName: "",
      rejectForm: {
        description: ""
      },
      rules: {
        description: [
          { required: true, message: "请输入驳回原因", trigger: "blur" },
          { min: 1, max: 200, message: "长度在 1 到 200 个字", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    addhead
  },
  activated(){
    var that = this;
    this.id = this.$route.query.id;
    this.getdata(that.id);
  },
  methods: {
    reject() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.dialogTableVisible = false;
          getstatus(this.id).then(res => {
            if (res.data == 1) {
              reviewReject(this.id, {
                description: this.rejectForm.description
              }).then(res => {
                if (res.code == "000000" && res.data == 1) {
                  this.$message({
                    message: "驳回成功",
                    type: "success"
                  });
                  this.close({name:'CategoryCheck2', to: {name:'Category2', params:{isUpdate:true}}});
                }
              });
            } else {
              this.$alert(
                "当前数据状态已发生变化，请刷新获取最新数据",
                "提示",
                {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.close({name:'CategoryCheck2', to: {name:'Category2', params:{isUpdate:true}}});
                  }
                }
              );
            }
          });
        }
      });
    },
    getdata(id) {
      detai2(id).then(res => {
        if (res.code == "000000") {
          this.code = res.data.code;
          this.classLevel = res.data.level;
          this.className = res.data.name;
          this.statusDescription = res.data.statusDescription;
          this.updateStatusDescription = res.data.updateStatusDescription;
          this.categoryOperationLogList = res.data.categoryOperationLogList;
          this.userDataAuthorityAccount = res.data.userDataAuthorityAccount;
          this.userDataAuthorityName = res.data.userDataAuthorityName;
          this.parentName = res.data.parentName;
        }
      });
    },
    checkOk() {
      getstatus(this.id).then(res => {
        if (res.data == 1) {
          reviewPass(this.id).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "审核可用",
                type: "success"
              });
              this.close({name:'CategoryCheck2', to: {name:'Category2', params:{isUpdate:true}}});
            }
          });
        } else {
          this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.close({name:'CategoryCheck2', to: {name:'Category2', params:{isUpdate:true}}});
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@tableBorderColor: #e4e4e4;
.detaillBox {
  width: 100%;
  padding-top: 10px;
  .detaillTable {
    border: 1px solid #d1d1d1;
    table {
      width: 90%;
      margin: 20px auto;
      td,
      th {
        border: 1px solid #d1d1d1;
        font-size: 14px;
        height: 53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        padding-right: 6px;
        box-sizing: border-box;
        color: #666;
        font-weight: 700;
        font-size: 14px;
        text-align: right;
        width: 20%;
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
    .el-table {
      margin: 20px auto;
      width: 90%;
      .el-button {
        font-size: 12px;
      }
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
      width: 90%;
      margin: 0 auto 20px;
    }
  }
  .dialog-box {
    position: relative;
    .message-box {
      display: flex;
      margin: 20px 0 50px;
      .el-textarea {
        width: 300px;
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

