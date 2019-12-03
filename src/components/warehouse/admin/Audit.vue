<template>
  <div class="auditdetaillBox">
    <div class="detaillTable">
      <div class="detaillTopBox">
        <span><i></i>基本信息</span>
      </div>
      <table border="1">
        <tr>
          <th>仓库ID：</th>
          <td><span v-if="returnData.status == '3'">{{returnData.id}}</span></td>
          <th>仓库状态：</th>
          <td>
            <span v-if="returnData.status == '0'">草稿</span>
            <span v-if="returnData.status == '1'">待审核</span>
            <span v-if="returnData.status == '2'">已驳回</span>
            <span v-if="returnData.status == '3'">可用</span>
          </td>
        </tr>
        <tr>
          <th><i>*</i>仓库名称：</th>
          <td>{{returnData.name}}</td>
          <th><i>*</i>仓库类型：</th>
          <td>
            <span v-if="returnData.type == '1'">RDC</span>
            <span v-if="returnData.type == '2'">DC</span>
            <span v-if="returnData.type == '3'">FDC</span>
          </td>
        </tr>
        <tr>
          <th><i>*</i>仓库归属组织机构：</th>
          <td>{{returnData.organizationName}}</td>
          <th><i>*</i>仓库地址：</th>
          <td>{{returnData.addressLine}}</td>
        </tr>
        <tr>
          <th><i>*</i>总面积：</th>
          <td>{{returnData.grossArea}}㎡</td>
          <th><i>*</i>可使用面积：</th>
          <td>{{returnData.availableArea}}㎡</td>
        </tr>
        <tr>
          <th><i></i>可使用货架面积：</th>
          <td>{{returnData.shelfArea}}㎡</td>
          <th><i></i>可使用托盘区面积：</th>
          <td>{{returnData.palletArea}}㎡</td>

        </tr>
        <tr>
          <th><i></i>可使用工作区面积：</th>
          <td>{{returnData.workspace}}㎡</td>
          <th><i></i>货架数量：</th>
          <td>{{returnData.shelvesQty}}组</td>

        </tr>
        <tr v-for="item,index in returnData.warehouseContactDTOList">
          <th><i>*</i>业务联系人：</th>
          <td>{{item.name}}</td>
          <th><i>*</i>业务联系人电话：</th>
          <td>{{item.phone}}</td>
        </tr>
        <tr>
          <th><i>*</i>仓库管理员账号：</th>
          <td>{{returnData.userManagerName}}</td>
          <th><i></i>仓库管理员姓名：</th>
          <td>{{returnData.userManagerRealName}}</td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2 clear">
      <div class="detaillTopBox">
        <span><i></i>操作详情</span>
      </div>
      <el-table
        :data="returnData.warehouseOperationLogDTOList"
        border
        stripe
        style="width: 90%"
        size="small">
        <el-table-column
          prop="userId"
          label="操作者"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfo.userFullName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.operationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.operation==0">添加</span>
            <span v-if="scope.row.operation==1">修改</span>
            <span v-if="scope.row.operation==2">删除</span>
            <span v-if="scope.row.operation==3">提交审核</span>
            <span v-if="scope.row.operation==4">审核通过</span>
            <span v-if="scope.row.operation==5">已驳回<br/>{{scope.row.description}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="close()">关闭</el-button>
      <el-button type="primary" v-backTop>返回顶部</el-button>
      <el-button type="primary"
                 v-if="$authorities.WarehouseAdminReview"
                 @click="dialogPass = !dialogPass"
      >审核通过</el-button>
      <el-button type="primary"
                 v-if="$authorities.WarehouseAdminReview"
                 @click="dialogReject = !dialogReject" >驳回</el-button>
    </div>
    <el-dialog :visible.sync="dialogPass" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">审核通过</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">确定仓库信息无误，可以审核通过？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPass = false">取 消</el-button>
        <el-button type="primary" @click="dialogPass=false,putWarehouseReview('pass')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogReject" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">驳回</span>
      </div>
      <div class="message-box">
        <el-form :model="reviewData" :rules="rules" ref="ruleForm" >
          <el-form-item label="请输入驳回理由：" prop="description" >
            <el-input type="textarea" v-model="reviewData.description" maxlength="200" placeholder="请输入200字以内" ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickCancel()">取 消</el-button>
        <el-button type="primary"  @click="submitForm('ruleForm')" >确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import {
    postWarehouseAdd,
    getWarehouseDetaills,
    getWarehouseUpdateDetaills,
    deleteWarehouseDelete,
    putWarehouseUpdateDraft,
    postWarehouseContact,
    getWarehouseRedactDetaills,
    getWarehouseLog,
    putWarehouseReview,
    putWarehouseSubmitReview,
    putWarehouseUpdateSubmitReview,
    deleteWarehouseContactDelete,
    deleteWarehouseContactIdDelete,
    postWarehouseDvailableList,
    postWarehouseAddDraft,
    postWarehouseDraftList,
    postWarehousePendingList,
    postWarehouseRejectedList,
    getWarehouseStatusCount
  } from '@/api/warehouse/warehouseAdmin'

  export default {
    inject:['reload','close'],
    name: "WarehouseAudit",
    data() {
      return {
        oldId:'',
        rules: {
          description: [
            {required: true, message: '请输入驳回理由', trigger: 'change'}
          ],
        },
        dialogPass: false,
        dialogReject: false,
        reviewData:{
          action: "",        //驳回reject通过pass
          description: "",   //驳回理由
          warehouseId: this.$route.query.Id,          //仓库编号
        },
        returnData:{
          addressLine:null,
          availableArea:null,
          cityId:null,
          countyId:null,
          grossArea:null,
          id:null,
          name:null,
          ownerId:null,
          palletArea:null,
          provinceId:null,
          shelfArea:null,
          shelvesQty:null,
          status:null,
          type:null,
          warehouseContactDTOList:null,
          warehouseOperationLogDTOList:null,
          workspace:null,
        },
        msg: '',
        tableData: [{
          date: '领先未来北京总部>供应链>胡卫卫',
          name: '2017-07-19 14:48:38 ',
          address: '审核通过',
        }, {
          date: '领先未来北京总部>供应链>胡卫卫',
          name: '2017-07-19 14:48:38 ',
          address: '审核通过',
        },
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          },
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          }
          ,
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          }
          ,
          {
            date: '领先未来北京总部>供应链>胡卫卫',
            name: '2017-07-19 14:48:38 ',
            address: '审核通过',
          }],
      }
    },
    activated() {
      if (this.oldId!=this.$route.query.Id){
        this.oldId=this.$route.query.Id;
        //仓库更新详情
        getWarehouseUpdateDetaills(
          this.$route.query.Id
        )
          .then((res) => {
            console.log(res)
            this.returnData = res.data;
          }).catch(err => {
          console.log(err)
        })
      }
    },
    mounted() {
      this.oldId=this.$route.query.Id;
      //仓库更新详情
      getWarehouseUpdateDetaills(
        this.$route.query.Id
      )
        .then((res) => {
          console.log(res)
          this.returnData = res.data;
        }).catch(err => {
        console.log(err)
      })
    },
    methods: {
      clickCancel(){
        this.dialogReject = false;
        this.reviewData.description="";
      },
      putWarehouseReview(action){
        this.reviewData.action=action;
        console.log(this.reviewData.action);
        putWarehouseReview(
          this.$route.query.Id,
          this.reviewData
        )
          .then((res) => {

          if( this.reviewData.action=='reject'){
            if (res.code == '000000') {
              this.$message({
                message: '驳回成功',
                type: "success",
              });
              this.close({name:'WarehouseAudit', to: {name:'WarehouseAdmin', params:{isUpdate:true}}});
            } else if (/^98/.test(res.code)) {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }else {
              this.$message({
                message: '驳回失败',
                type: 'warning',
              })
              this.dialogReject=false
            }
          }else {
            if (res.code == '000000') {
              this.$message({
                message: '审核通过成功',
                type: "success",
              });
              this.close({name:'WarehouseAudit', to: {name:'WarehouseAdmin', params:{isUpdate:true}}});
            }else if (/^98/.test(res.code)) {
              this.$message({
                message: res.message,
                type: "warning"
              });
            } else {
              this.$message({
                message: res.message,
                type: 'warning',
              })
              this.dialogReject=false
            }
          }

            console.log(res)
          }).catch(err => {
          console.log(err)
        })
      },
      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.Id;
        // 将数据放在当前组件的数据内
        this.msg = routerParams;
        console.log(this.msg);
      },
      //提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.reviewData);
            this.putWarehouseReview('reject')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    },
    filters: {
      //时间截取字符串
      formatDate: function (val) {
        var dateee = new Date(val).toJSON();
        var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
        return date
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .auditdetaillBox {
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
          background: #f5f7fa;
          color: #303133;
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
          padding:20px 0;
          .first-step {
            color: red;
            font-size: 18px;
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .second-step-box {
          display: flex;
          padding:20px 0;
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
