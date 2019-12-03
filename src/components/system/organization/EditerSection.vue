<template>
  <div class="editerSectionBox">
    <div class="h50 headerBox"><img src="" alt=""><span>部门信息</span></div>
    <div class="w sectionShowBox">
      <el-form style="margin: 0 auto" :model="createDepartmentParam" :rules="rules" ref="createDepartmentParam"
               label-width="140px" class="demo-ruleForm">
        <el-form-item label="组织机构名称：">
          <span>{{createDepartmentParam.organizationName}}</span>
        </el-form-item>
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="createDepartmentParam.name" placeholder="字数长度1~20个字以内" @change="compare()"></el-input>
        </el-form-item>
        <el-form-item label="所属上级部门：" prop="organizationId" class="clear">
          <div @click="gotoShow()" ><el-input class="sectionBox" v-model="value" clearable  placeholder="请选择"></el-input></div>
          <i class="iconfont icon-xia" @click="isShow=!isShow" v-show="isShow"></i><i @click="isShow=!isShow" v-show="!isShow" class="iconfont icon-top"></i>
          
          <div style="border: 1px solid #e4e4e4;width: 400px;height: 200px;max-height: 200px;overflow: auto;margin-top: 10px" v-if="isShow">
            <el-tree
              ref="tree"
              :data="data2"
              node-key="id"
              :default-expand-all="isAll"
              :expand-on-click-node="false"
              empty-text="无上级部门"
              @node-click="aaa"
              :props="defaultProps" style="height: 200px">
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item label="部门描述：" prop="description">
          <el-input
            type="textarea"
            placeholder="1~200个字以内"
            v-model="createDepartmentParam.description" class="textBox" rows="5" style="width: 400px">
          </el-input>
        </el-form-item>
        <el-form-item label="部门负责人：" prop="description">
          <div @click="toShow()">
            <el-input
            placeholder="点击选择负责人"
            v-model="personName" class="textBox" rows="5" style="width: 400px" multiple>
          </el-input>
          </div>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-button type="primary" @click="submitForm('createDepartmentParam')" style="display: inline-block">保存
          </el-button>
          <el-button type="primary" @click="resetBrandForm('createDepartmentParam')" style="display: inline-block">取消
          </el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="选择部门负责人"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <div class="showBox">
          <div class="showheaderBox">
            <div class="changeBox">待选</div>
            <div><el-input type="text"  placeholder="输入账号/姓名进行搜索" v-model="userName" >
              <template slot="append" class="buttonBox"><span style="cursor: pointer" @click="getUsernameRealName()">查询</span></template></el-input></div>
            <el-table
              ref="multipleTable"
              :data="tableData3"
              tooltip-effect="dark"
              style="width: 100%;"
              height="200"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="realName"
                label="账号-姓名"
                width="200">
                <template slot-scope="scope">
                  {{scope.row.userName}} - {{scope.row.realName}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="noShowBox"><div class="footBox">已选</div>
            <el-table
              ref="multipleTable1"
              :data="multipleSelection"
              tooltip-effect="dark"
              style="width: 100%;"
              height="250">
              <el-table-column
                prop="realName"
                label="账号-姓名"
                width="250">
                <template slot-scope="scope">
                  {{scope.row.userName}} - {{scope.row.realName}}
                  <el-button
                  @click.native.prevent="deleteRow(scope.row, multipleSelection)"
                  type="text"
                  size="small">
                   X
                 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible=false">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {addSectionInfo,getSectionTreeNoAll,sectionCompare,updateSectionInfo,modifySectionInfo,getListById,getUsername} from '@/api/organizationManage'
  import '@/components/system/organization/AddSection.less'
  export default {
    inject:['reload','close'],
    name:'EditerSection',
    data() {
      return {
        isAll:false,
        isShow:false,
        defaultProps: {
          children: 'departmentTreeDTOList',
          label: 'name'
        },
        rowIndex:'', 
        personName:'',
        multipleSelection:null,
        userName:'',
        tableData3:null,
        //编辑部门id
        ID:null,
        //编辑组织机构id
        organizationID:null,
        //所属上级部门id
        parentId:'',
        value: '',
        //添加参数
        createDepartmentParam: {
          name: '',
          organizationId: '',
          description: '',
          organizationName:'',
          managerIdList:null
        },
        //树结构
        data2: [],
        //判重参数
        checkNameRepeatedParam: {
          name: '',//部门名称
          organizationId: null,//组织机构id
          id:'',//部门id
          parentId:0,
        },
        dialogVisible: false,
        rules: {
          name: [
            {required: true, message: '部门名称不能为空', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在1~20字之间', trigger: 'blur'}
          ],
        }
      };
    },
    created() {
      this.ID=this.$route.query.id;
      this.organizationID=this.$route.query.organizationID;
      //获取全部分类树
      getSectionTreeNoAll({excludeDepartmentId:Number(this.ID),organizationId:Number(this.organizationID)}).then(res=>{
        var result = this.deep(res.data)
        this.data2=result;
      })
      //数据回显
      updateSectionInfo(this.ID).then(res=>{
        console.log(res.data);
        this.createDepartmentParam=res.data;
        this.value=res.data.parentName;
        this.multipleSelection=res.data.managerMsgList;
        this.parentId=res.data.parentId;
        this.personName=res.data.managerMsgList.map((item)=>{
          return item.userName+'-'+item.realName
        }).join(' ')
      })
    },
    activated(){
       if(this.ID!=this.$route.query.id){
         this.ID=this.$route.query.id;
         this.organizationID=this.$route.query.organizationID;
         //获取全部分类树
      getSectionTreeNoAll({excludeDepartmentId:Number(this.ID),organizationId:Number(this.organizationID)}).then(res=>{
        var result = this.deep(res.data)
        this.data2=result;
      })
      //数据回显
      updateSectionInfo(this.ID).then(res=>{
        console.log(res.data);
        this.createDepartmentParam=res.data;
        this.value=res.data.parentName;
        this.multipleSelection=res.data.managerMsgList;
        this.parentId=res.data.parentId;
        this.personName=res.data.managerMsgList.map((item)=>{
          return item.userName+'-'+item.realName
        }).join(' ')
      })
       }
    },
    methods: {
      deep(data){
         data.forEach((item)=>{
          if(item.name==this.createDepartmentParam.name){
            item.departmentTreeDTOList=null;
            item.name=null;
            item.id=null;
          }else{
            this.deep(item.departmentTreeDTOList)
          }
        })

        for (var attr in data) {
          if(data[attr].name === null && data[attr].id === null &&data[attr].departmentTreeDTOList === null){
                delete data[attr];
                continue;
            }
        }
        return data;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.personName=this.multipleSelection.map(item=>{
            return item.userName+''+item.realName
        }).join(',')
      },
       deleteRow(index, rows) {
        let cc=index.id;
        this.tableData3.forEach((item,i)=>{
         if(item.id==cc){
           [this.tableData3[i]].forEach(row=>{
             this.$refs.multipleTable.toggleRowSelection(row);
           })
         }
        })
      },
      aaa(data,node,vuecomponent){
        this.value=data.name;
        this.parentId=data.id;
        this.isShow=false;
        this.checkNameRepeatedParam.parentId=data.id;
      },
      //单击查询
      getUsernameRealName(){
        getListById(this.organizationID,this.ID,this.userName).then(res=>{
          console.log(res.data);
          this.tableData3=res.data;
        })
      },
      //下拉面板
      gotoShow(){
        this.isShow=!this.isShow;
        this.isAll=true;
      },
      //去显示
      toShow(){
        getListById(this.organizationID,this.ID,this.userName).then(res=>{
          this.tableData3=res.data;
        })
        this.dialogVisible=true;
      },
      //判重
      compare() {
        if (this.createDepartmentParam.name !== '') {
          this.checkNameRepeatedParam.organizationId=this.organizationID;
          this.checkNameRepeatedParam.id=this.ID;
          this.checkNameRepeatedParam.name=this.createDepartmentParam.name;
          //调用部门名称是否重复
          sectionCompare(this.checkNameRepeatedParam).then(res=>{
            if(res.data==false){
              this.$message({
                message:'部门名称可用',
                type:'success'
              })
            }else {
              this.$message({
                message:'部门名称已存在，请修改',
                type:'error'
              })
            }
          })
        }
      },
      //保存至草稿
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createDepartmentParam.parentId=this.parentId;
            delete this.createDepartmentParam.organizationName
            this.createDepartmentParam.organizationId=parseFloat(this.organizationID);
            let vvv=[]
            if(this.multipleSelection!=null){
             this.multipleSelection.forEach(item=>{
                       vvv.push(item.id)
            })
            } 
            this.createDepartmentParam.managerIdList=vvv
            modifySectionInfo(this.ID,this.createDepartmentParam).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message:'保存成功',
                  type:'success'
                })
                // setTimeout(()=>{
                //   const {href}=this.$router.resolve({
                //     name:'EditerSection',
                //   })
                //   window.close(href)
                // },1000)
                this.close({name:'EditerSection',to:{name:"SectionManage",query:{sectionID:this.organizationID},params:{isUpdate:true}}})
              }
            })

          }
        });
      },
      //取消
      resetBrandForm() {
        // const {href}=this.$router.resolve({
        //   name:'EditerSection'
        // })
        // window.close(href)
        this.close({name:'EditerSection',to:{name:"SectionManage",query:{sectionID:this.organizationID},params:{isUpdate:true}}})
      },
      filterNode(value, data) {
        if (!value) return true;
        return value.includes(data.id);
      },
    }
  }
</script>

<style lang="less" scoped>
  .editerSectionBox {
    border: 1px solid #e4e4e4;
    margin-top: 10px;
    .sectionShowBox{
      .showBox{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 20px;
        .showheaderBox{
          border: 1px solid #e4e4e4;
          width: 45%;
          max-height: 300px;
          .changeBox{
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: #e4e4e4;
            font-size: 14px;
            font-weight: bold;
          }
          ul{

            li{
              height: 40px;
              line-height: 40px;
              padding-left: 10px;
            }
            li:hover{
              background: #339999;
            }
          }
        }
        .noShowBox{
          border: 1px solid #e4e4e4;
          width: 45%;
          max-height: 300px;
          .footBox{
            height: 50px;
            line-height: 50px;
            background: #e4e4e4;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
          }
          ul{
            li{
              height: 40px;
              padding-left: 10px;
              line-height: 40px;
            }
            li:hover{
              background: #339999;
            }
          }
        }
      }
    }
    .headerBox {
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #e4e4e4;
      span {
        line-height: 50px;
        margin-left: 50px;
      }
    }
    .el-form {
      padding: 20px 100px 0 100px;
      color: #606266;
      .el-form-item {
        .el-input {
          width: 400px;
          height: 40px;
        }
        .tipBox {
          height: 20px;
          font-size: 12px;
          margin-left: 20px;
        }
        .el-form-item_err {
          color: #f56c6c;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 0;
        }
      }
      .listBox {
        width: 600px;
        box-sizing: border-box;
        .listLeftBox {
          padding: 0 10px;
          width: 200px;
          height: 300px;
          overflow: auto;
          .headerBox {
            height: 35px;
            border: 1px solid #e4e4e4;
            span {
              color: red;
              line-height: 36px;
            }
          }
        }
        .listRightBox {
          overflow: auto;
          width: 200px;
          height: 300px;
          padding: 0 10px;
          .headerBox {
            height: 35px;
            border: 1px solid #e4e4e4;
            span {
              color: red;
              height: 36px;
              line-height: 36px;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>

  .editerSectionBox{
    .el-dialog{
      .el-dialog__header{
        background: #e4e4e4;
        height: 40px;
        line-height: 40px;
      }
      .el-input-group__append{
        background: #339999;
        color: #f3f3f3;
      }
    }
    .el-tree {
      max-height: 200px;
      .el-tree-node__content{
        z-index:-1
      }
      .el-icon-caret-right:before{
        display: none;
      }
    }
    .el-form-item {
      position: relative;
      .el-select {
        width: 400px;
      }
      i{
        font-size: 16px;
        position: absolute;
        top: 1px;
        left: 380px;
        color: #e4e7ed;
      }
    }
  }
</style>
