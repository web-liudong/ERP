<!--编辑分类-->
<template>
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="编辑导航"></addhead>
      <el-form :model="form" ref="form" label-width="150px" class="demo-dynamic" :rules="rules">
        <el-form-item label="层级：" required>
          <p class="hierarchy">一级</p>
        </el-form-item>
        <el-form-item required
          prop="name"
          label="一级导航名称："
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item prop="maintenanceWay">
          <span slot="label">导航维护商品方式：</span>
          <el-select
            v-model="form.maintenanceWay"
            placeholder="选择维护方式"
            @change="onchange">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="maintenanceWay" v-show="form.maintenanceWay=='CATEGORY'">
          <div class="tree-box">
            <div class="left-tree">
              <div class="tree-head">
                后台分类选项列表
              </div>
              <el-tree
              ref="tree"
              :data="classTree"
              show-checkbox
              node-key="id"
              render-after-expand 
              @check="getnode()"
              :default-checked-keys="defaulttree"
              :props="defaultProps">
              </el-tree>
            </div>
            <div class="right-tree">
              <div class="tree-head">
                已选关联分类预览
              </div>
              <el-tree
              :data="classTree"
            	ref="tree2"
              node-key="id"
              render-after-expand            
              :filter-node-method="filterNode"
              :props="defaultProps">
           </el-tree>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="index">
          <span slot="label"><i style="color:red;">*</i> 显示优先级：</span>
          <el-input v-model="form.index"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editNav('form')" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import addhead from '@/components/common/head/head'
  import {editingDetail,editNavigation} from '@/api/release/navManage'
  import {preview} from '@/api/classManage'
  export default {
    inject:['reload'],
    name:'Edite1',
    data() {
      var checkIndex = (rule, value, callback) => {
        if(value===''||value===null){
          callback(new Error('请填写优先级'));
        }
        value = value-0;
        if (value<0||value>1000) {
          callback(new Error('请输入0~1000的整数'));
        } else {
          if (value%1 !== 0) {
            callback(new Error('请输入整数'));
          } else {
            callback();
          }
        }
      };
      return {
        defaulttree:[],
        classTree: [],
        defaultProps: {
          children: 'subCategory',
          label: 'name'
        },
        id:0,
        options:[
        {
          value: 'CATEGORY',
          label: '通过后台分类关联商品'
        },
        {
          value: 'SKU',
          label: '直接添加商品'
        }
        ],
        form: {
          name:'',
          id:null,
          maintenanceWay:null,
          categoryIds:[],
          index:null
        },
        rules:{
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          administratoritem:[
            { required: true, message: '请选择管理员', trigger: 'blur' },
          ],
          index:[ { validator: checkIndex, trigger: 'blur' }]
        }
      };
    },
    components:{
      addhead
    },
    activated(){
      this.id = this.$route.query.id;
      this.getDetail(this.id);
    },
    methods: {
      filterNode(value, data) {
			  if(!value) return true;
			  return value.includes(data.id);
		  },
      getnode(data) {
        let yeziId = this.$refs.tree.getCheckedKeys(true)
        let idArr = this.$refs.tree.getCheckedKeys()
        this.form.categoryIds=yeziId.map((item,index)=>{
          return item
        })
        this.$refs.tree2.filter(idArr);
		  },
      getDetail(id){
        editingDetail(id).then(res=>{
          if(res.code=='000000'){
            this.form.name = res.data.name
            this.form.id = res.data.id
            this.form.maintenanceWay = res.data.maintenanceWay
            this.form.categoryIds = res.data.categoryIds
            this.form.index = res.data.index
            this.form.level = res.data.level
            this.defaulttree = res.data.categoryIds
            preview().then(res=>{
              if(res.code=='000000'){
                this.classTree = res.data;
                this.$nextTick().then(()=>{
                  this.getnode()
                })
              }
            })
          }
        })
      },
      editNav(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editNavigation(that.id,{
                categoryIds:this.form.maintenanceWay=='CATEGORY'?this.form.categoryIds:null,
                index:this.form.index,
                maintenanceWay:this.form.maintenanceWay,
                name:this.form.name          
            }).then(res=>{
              if(res.code=='000000'){
                if(res.data==1){
                  this.$message({
                    message: '导航数据已保存成功，保存至待发布',
                    type: 'success'
                  });
                }else{
                  this.$message({
                    message: '操作失败',
                    type: 'error'
                  });
                }
              }
            })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .addSecond{
    .footerBox{
      margin: 40px 0 0 0;
      position: relative;
      border-left: 1px solid #e4e4e4;
      border-right: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      .el-input{
        height: 30px;
      }
      .el-form{
        margin-left: 50px;
        .el-form-item{
          .tree-box{
            display: flex;
            .tree-left{
              width: 355px;
              height: 300px;
              border:1px solid #e4e4e4;
              margin-right: 5px;
              .tree-left-head{
                width: 100%;
                line-height: 35px;
                font-size: 14px;
                color: #666;
                border-bottom: 1px solid #e4e4e4;
                text-indent:25px;
              }
              .el-tree{
                margin-left: 25px;
              }
            }
          }
          .deleteBox{
            margin-left: 10px;
          }
          .tree-box{
            width: 610px;
            display: flex;
            justify-content: space-between;
            .left-tree{
              width: 355px;
              height: 300px;
              border:1px solid #e4e4e4;
              .tree-head{
                width: 100%;
                height: 35px;
                border-bottom:1px solid #e4e4e4;
                padding-left: 10px;
                box-sizing: border-box;
                line-height: 35px;
                font-weight: bold;
              }
              .el-tree{
                overflow:auto;
                height: 250px;
              }
            }
            .right-tree{
              width: 240px;
              height:300px;
              border:1px solid #e4e4e4;
              .tree-head{
                width: 100%;
                height: 35px;
                border-bottom:1px solid #e4e4e4;
                padding-left: 10px;
                box-sizing: border-box;
                line-height: 35px;
                font-weight: bold;
              }
              .el-tree{
                overflow:auto;
                height: 250px;
              }

            }
          }
          .el-input{
            width: 400px;
          }
          .hierarchy{
            color: red;
          }
        }

      }
    }
  }
</style>
