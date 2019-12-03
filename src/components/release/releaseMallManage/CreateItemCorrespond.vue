
<template>
  <el-form :model="createMallCategoryParam" :rules="rules" ref="createMallCategoryParam" label-width="180px" class="demoManageMallBox">
    <div class="editerBrandBox clear">
      <div class="h50 headerBox" style="line-height: 50px;padding-left: 50px">项目：{{projectName}}</div>
      <div class="h50 headerBox"><span>基本信息</span></div>
      <el-form-item required>
        <span slot="label">层级：{{mallCCategoryLevel|AA}}</span>
      </el-form-item>
      <el-form-item label="客户品目编码：" prop="partyCMatchedLevelCode">
        <el-input v-model="createMallCategoryParam.partyCMatchedLevelCode" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="客户一级品目：" prop="partyCFirstLevelName" required>
        <span slot="label">客户一级品目：</span>
        <el-input v-model="createMallCategoryParam.partyCFirstLevelName" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label="客户二级品目：" :prop="mallCCategoryLevel==1?'':'partyCSecondLevelName'" :required="!(mallCCategoryLevel==1)">
        <span slot="label">客户二级品目：</span>
        <el-input v-model="createMallCategoryParam.partyCSecondLevelName" placeholder="字数长度在1~50字以内" :disabled="mallCCategoryLevel==1"></el-input>
      </el-form-item>
      <el-form-item label="客户三级品目：" :prop="mallCCategoryLevel==1||mallCCategoryLevel==2?'':'partyCThirdLevelName'" :required="!(mallCCategoryLevel==1||mallCCategoryLevel==2)">
        <span slot="label">客户三级品目：</span>
        <el-input v-model="createMallCategoryParam.partyCThirdLevelName" :disabled="mallCCategoryLevel==1||mallCCategoryLevel==2" placeholder="字数长度在1~50字以内"></el-input>
      </el-form-item>
      <el-form-item label=" 对应领先三级分类：" prop="categoryIdList" class="listBox clear">
        <div class="listLeftBox left">
          <div class="headerBox"><span>后台分类选项列表</span></div>
          <div style="position: relative" class="treeBox">
            <el-tree
              ref="tree"
              :data="data2"
              show-checkbox
              node-key="id"
              empty-text="加载中"
              @check="getnode()"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
        <div class="listRightBox left">
          <div class="headerBox"><span>已选关联分类预览</span></div>
          <div style="position: relative" class="treeBox">
            <el-tree
              :data="data2"
              ref="tree2"
              node-key="id"
              empty-text="暂无数据"
              :filter-node-method="filterNode"
              :props="defaultProps"
            >
            </el-tree>
          </div>
        </div>
      </el-form-item>
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" @click="submitForm('createMallCategoryParam')" v-waves>保存并提交</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
  import '@/components/system/organization/AddOrganization.less'
  import waves from '@/directive/waves'
  import {findBrandTreeData} from '@/api/brandManage'
  import { addMallInfo,getAllOptions,mallSelectName,addItemCorrespond,getItemTree} from "@/api/release/mallProjectManage"
  export default {
    inject:['reload','close'],
    name:'CreateItemCorrespond',
    data() {
       var check=(rule,value,callback)=>{
        if(value.length==0){
          return callback(new Error('客户二级品目不能为空'))
        }else {
          callback()
        }
      }
       var checkgoods=(rule,value,callback)=>{
          if(value.length==0){
          return callback(new Error('客户三级品目不能为空'))
        }else {
          callback()
        }
      }
      return {
        data2:[],
        defaultProps: {
          children: 'subCategory',
          label: 'name'
        },
        mallCCategoryLevel:null,
        mallID:null,
        projectName:null,
        loading1:false,
        options4:null,
        createMallCategoryParam: {
          mallId: null,//商城id
          partyCFirstLevelName: '',//第三方一级品目名称
          partyCMatchedLevelCode : '',//第三方匹配级别的品目编码
          partyCMatchedLevelNo: '',//第三方匹配级别的品目备用编号
          partyCSecondLevelName: '',//第三方二级品目名称
          partyCThirdLevelName: '',//第三方三级品目名称
          categoryIdList: [],//	领先未来三级品目Id
        },
        rules: {
          //商城项目名称
          name: [{
            required: true,
            message: '商城项目不能为空',
            trigger: 'blur'
          }],
          //开发商
          partyCName: [{
            required:true,
            message:'开发商不能为空',
            trigger:'blur'
          }],
          partyCFirstLevelName:[{required:true,message:'客户一级品目不能为空',trigger:'blur'}],
          partyCSecondLevelName:[{validator:check,trigger:'blur'},{validator:check,trigger:'change'}],
          partyCThirdLevelName:[{validator:checkgoods,trigger:'blur'},{validator:checkgoods,trigger:'change'}],
        },
      };
    },
    directives: {
      waves
    },
    created() {
      this.mallID=this.$route.query.mallID;
      this.mallCCategoryLevel=this.$route.query.mallCCategoryLevel;
      this.projectName=this.$route.query.projectName;
      this.createMallCategoryParam.mallId=this.$route.query.mallID;
      getItemTree(this.mallID).then(res=>{
        this.data2=res.data;
        this.$nextTick(() => {
          this.getnode();
        })
      })
    },
    activated(){
      if(this.$route.query.mallID&&this.mallID!=this.$route.query.mallID){
        this.mallID=this.$route.query.mallID;
      this.mallCCategoryLevel=this.$route.query.mallCCategoryLevel;
      this.projectName=this.$route.query.projectName;
      this.createMallCategoryParam.mallId=this.$route.query.mallID;
      getItemTree(this.mallID).then(res=>{
        this.data2=res.data;
        this.$nextTick(() => {
          this.getnode();
        })
      })
      }
    },
    mounted(){
      this.getnode();
    },
    filters:{
     AA(val){
       return val==1?val='一级':val==2?val='二级':val==3?val='三级':'';
     }
    },
    methods: {
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading1 = true;
          let aa={name:query};
          mallSelectName(aa).then(res=>{
            if(res.code=='000000'){
              this.options4=res.data;
              this.loading1=false;
            }
          })
        } else {
          this.options4 = [];
        }
      },
      //点击选中的选项
      getUSERNAME(){
        this.options4.filter(item=>{
          return item.name==this.ruleForm.name
        })
        this.ruleForm.projectId=this.options4[0].id
        this.ruleForm.name=this.options4[0].name
      },
      getnode() {
        let idArr = this.$refs.tree.getCheckedKeys()
        let i = this.$refs.tree.getCheckedNodes(true,true)
        this.options10=i
        this.$refs.tree2.filter(idArr);
        this.skuArr=this.$refs.tree.getCheckedKeys(true,true);
      },
      filterNode(value, data) {
        if(!value) return true;
        return value.includes(data.id);
      },
      submitForm(formName) {
        this.createMallCategoryParam.categoryIdList=this.skuArr;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addItemCorrespond(this.createMallCategoryParam).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                    message:'保存成功',
                    type:'success'
                  })
                //  setTimeout(()=>{
                //    const {href}=this.$router.resolve({
                //      name:'CreateItemCorrespond',
                //    })
                //    window.close(href)
                //  },1000)
                 this.close({name:'CreateItemCorrespond',to:{name:'ItemCorrespond',params:{isUpdate:true}}})
                }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },

  }
</script>

<style lang="less" scoped>
  .demoManageMallBox{
    color: #606266;
    .editerBrandBox{
      border: 1px solid #e4e4e4;
      margin-top: 10px;
      .headerBox{
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #e4e4e4;
        span{
          line-height: 50px;
          margin: 0 34px;
        }
      }
      .el-form-item{
        .el-input{
          width: 400px;
          height: 40px;
        }
        .tipBox{
          height: 20px;
          font-size: 12px;
          margin-left: 20px;
        }
      }
      .listBox{
       // width: 800px;
        box-sizing: border-box;
        .listLeftBox{
          padding: 0 10px;
          // width: 200px;
          height: 300px;
          overflow: auto;
          .treeBox {
            width: 100%;
            height: 263px;
            box-sizing: border-box;
            overflow: auto;
          }
          .headerBox{
            height: 35px;
            border: 1px solid #e4e4e4;
            span{
              color: red;
              line-height: 36px;
            }
          }
        }
        .listRightBox{
          overflow: auto;
          width: 200px;
          height: 300px;
          padding: 0 10px;
          .treeBox {
            width: 100%;
            height: 263px;
            box-sizing: border-box;
            overflow: auto;
          }
          .headerBox{
            height: 35px;
            border: 1px solid #e4e4e4;
            span{
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
<style lang="less">
  .el-form{
    .editerBrandBox{
      .organizationBox{
        .el-form-item{

        }
      }
      .el-form-item{
        margin-top: 20px;
        margin-left: 40px;
      }
      .AccountBox{
        display: flex;
        .el-form-item{
          .el-form-item__label{
            //width: 100px !important;
          }
          // width: 300px !important;
          flex: 1;
          .el-input{
            width: 200px;
          }
        }



      }
    }
  }
</style>















