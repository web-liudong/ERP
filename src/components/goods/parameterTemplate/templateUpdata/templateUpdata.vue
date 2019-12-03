<template>
  <div class="detaillBox">
    <div class="detaillTable">
      <addhead headname="参数模板基本信息"></addhead>
      <table border="1">
        <tr>
          <th>参数模板ID：</th>
          <td>{{templateId}}</td>
          <th>参数模板状态：</th>
          <td>{{templateStatus}}</td>
        </tr>
        <tr>
          <th><i>*</i>参数模板所属分类：</th>
          <td>{{oneLevelCategoryName}} > {{twoLevelCategoryName}} > {{threeLevelCategoryName}}</td>
          <th>更新状态：</th>
          <td>{{updateStatus?updateStatus:'---'}}</td>
        </tr>
        <tr>
          <th><i>*</i>模板参数主键：</th>
          <td>
            {{primaryAttribute}}
          </td>
          <th></th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="detaillTable2">
      <addhead headname="参数模板详情"></addhead>
      <div v-for="(item,index) in categoryAttributeGroupDetailDTOList" :key="index">
        <div class="group-name">{{item.name}}</div>
        <div class="form-wrapper">
          <el-form ref="form" :model="form" label-width="120px" class="form-box" v-for="(attr,i) in item.categoryAttributeEditDtoList" :key="i">
            <el-form-item required v-show="attr.valueType==0">
              <span slot="label">{{attr.name}}：</span>
              <el-input v-model="form.num" placeholder="长度1-10以内" type="number" :max="attr.maxLength">
                <template slot="append" v-if="attr.options">{{attr.options}}</template>
              </el-input>
            </el-form-item>
            <el-form-item required v-show="attr.valueType==1">
              <span slot="label">{{attr.name}}：</span>
              <el-input  placeholder="长度1-10以内" v-model="form.text" :maxlength="attr.maxLength"></el-input>
            </el-form-item>
            <el-form-item  required v-show="attr.valueType==2">
              <span slot="label">{{attr.name}}：</span>
              <el-input v-model="form.name" placeholder="长度1-10以内" type="textarea" autosize :maxlength="attr.maxLength"></el-input>
            </el-form-item>
            <el-form-item required v-show="attr.valueType==3">
              <span slot="label">{{attr.name}}：</span>
              <el-select v-model="form.region" placeholder="请选择级别">
                <el-option :label="option" :value="option" v-for="(option,ind) in attr.options.split(',')" :key="ind"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item required v-show="attr.valueType==4">
              <span slot="label">{{attr.name}}：</span>
              <el-radio-group v-model="radio">
                <el-radio :label="option" class="gap" v-for="(option,ind) in attr.options.split(',')" :key="ind"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item required v-show="attr.valueType==5">
              <span slot="label">{{attr.name}}：</span>
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label="option" v-for="(option,ind) in attr.options.split(',')" :key="ind"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item required v-show="attr.valueType==6">
              <span slot="label">{{attr.name}}：</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 40%;"></el-date-picker>
            </el-form-item>
            <el-form-item required v-show="attr.valueType==7">
              <span slot="label">{{attr.name}}：</span>
              <div class="file-box-wrapper">
                <div class="file-box">
                  <el-button type="primary" plain class="file-button">上传文件</el-button>
                  <input type="file" class="file-input" placeholder="请选择文件" />
                </div>
                <i style="color: red;">支持{{attr.options}}格式文件，大小不超过2M；</i>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <addhead headname="操作详情"></addhead>
      <el-table
        :data="tableData"
        border
        style="width: 90%"
        size="small">
        <el-table-column
          prop="operation"
          label="操作者"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="操作描述"
          style="width: 33%"
          align="center">
        </el-table-column>
      </el-table>
      <div class="button-box">
        <el-button @click="close" class="success" type="primary">关闭</el-button>
        <el-button type="primary" v-backTop>回顶部</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {templateLog,updateDetail} from '@/api/classManage'
  import {close} from '@/api/close'
  export default {
    data(){
      return {
        templateId:'',
        templateStatus:'',
        updateStatus:'',
        oneLevelCategoryName:'',
        twoLevelCategoryName:'',
        threeLevelCategoryName:'',
        primaryAttribute:'',
        categoryAttributeGroupDetailDTOList:[],
        radio:'',
        form:{
          num:'',
          text:''
        },
        checkList: ['选中且禁用','复选框 A'],
        tableData: []
      }
    },
    components:{
      addhead
    },
    created(){
      var that = this;
      this.id = this.$route.query.id;
      this.getdata(that.id);
      this.templateLog(that.id);
    },
    methods: {
      templateLog(id){
        templateLog(id).then(res=>{
          if(res.code=='000000'){
            this.tableData = res.data;
          }
        })
      },
      getdata(id){
        updateDetail(id).then(res=>{
          if(res.code=='000000'){
            this.templateId = res.data.templateId;
            this.templateStatus = res.data.templateStatus;
            this.updateStatus = res.data.updateStatus;
            this.oneLevelCategoryName = res.data.oneLevelCategoryName;
            this.twoLevelCategoryName = res.data.twoLevelCategoryName;
            this.threeLevelCategoryName = res.data.threeLevelCategoryName;
            this.primaryAttribute = res.data.primaryAttribute;
            this.categoryAttributeGroupDetailDTOList = res.data.categoryAttributeGroupEditDtoList;
          }
        })
      },
      close(){
        close();
      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
    .detaillTable{
      border: 1px solid #d1d1d1;
      table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          padding-right:6px;
          box-sizing: border-box;
          color:#666;
          font-weight:700;
          font-size: 14px;
          text-align: right;
          width:20%;
          i{
            color:red;
          }
        }
        td{
          color: #666666;
          text-align: left;
          padding-left:10px;
          width:30%;
        }
      }
    }
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;
      padding-bottom: 20px;
      .group-name{
        width: 100%;
        height: 60px;
        text-indent: 30px;
        line-height: 60px;
        font-size: 16px;
        color: #666;
      }
      .form-wrapper{
        width: 90%;
        border: 1px solid #d1d1d1;
        margin: 0 auto;
        padding-top:20px;
        box-sizing: border-box;
        .form-box{
          .el-input{
            width: 40%;
          }
          .el-textarea{
            width: 40%;
          }
          .file-box-wrapper{
            display:flex;
            align-items: center;
            .file-box{
              position: relative;
              cursor:pointer;
              width: 150px;
              height: 66px;
              margin-right: 20px;
              .file-button{
                position: absolute;
                left: 0;
                top:0;
              }
              .file-input{
                position: absolute;
                left:-44px;
                top:20px;
                cursor: pointer;
                opacity: 0;
              }
            }
          }
        }
      }

      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: right;
        margin:10px 20px;
      }
    }
  }
  .box-footer{
    border: 1px solid #e4e4e4;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .el-table{
      margin: 20px 0;
    }
    .button-box{
      display: flex;
      justify-content: flex-end;
      padding:10px 5%;
      box-sizing: border-box;
      width: 100%;
    }
  }
</style>

