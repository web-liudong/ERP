<template>
  <!--添加一级分类-->
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="添加导航"></addhead>
      <el-form label-width="150px">
        <el-form-item required>
          <span slot="label">层级：</span>
          <el-radio-group v-model="radio">
            <el-radio :label="1" class="gap">一级</el-radio>
            <el-radio :label="2" class="gap">二级</el-radio>
            <el-radio :label="3" class="gap">三级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form label-width="150px" :rules="rules1" status-icon :model="form1" ref="form1" v-show="radio==1">
        <el-form-item prop="name">
          <span slot="label">一级导航名称：</span>
          <el-input v-model="form1.name" placeholder="字数长度1~10以内"></el-input>
        </el-form-item>
        <el-form-item prop="maintenanceWay">
          <span slot="label">导航维护商品方式：</span>
          <el-select
            v-model="form1.maintenanceWay"
            placeholder="选择维护方式">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="maintenanceWay" v-show="form1.maintenanceWay=='CATEGORY'">
          <div class="tree-box">
            <div class="left-tree">
              <div class="tree-head">
                后台分类选项列表
              </div>
              <el-tree
              ref="tree1"
              :data="classTree"
              show-checkbox
              node-key="id"
              render-after-expand 
              @check="getnode()"
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
          <span slot="label"><i style="color:red;">*</i>  显示优先级：</span>
          <el-input v-model="form1.index" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addFirstLevel('form1')" class="success" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
      <!--二级-->
      <el-form label-width="150px" :rules="rules2" status-icon :model="form2" ref="form2" v-show="radio==2">
        <el-form-item required prop="firstLevelId">
          <span slot="label">所属一级导航：</span>
          <el-select v-model="form2.firstLevelId" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label">二级导航名称：</span>
          <el-input v-model="form2.name" placeholder="字数长度1~10以内"></el-input>
        </el-form-item>
        <el-form-item prop="maintenanceWay">
          <span slot="label">导航维护商品方式：</span>
          <el-select
            v-model="form2.maintenanceWay"
            placeholder="选择维护方式">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="maintenanceWay" v-show="form2.maintenanceWay=='CATEGORY'">
          <div class="tree-box">
            <div class="left-tree">
              <div class="tree-head">
                后台分类选项列表
              </div>
              <el-tree
              ref="tree3"
              :data="classTree"
              show-checkbox
              node-key="id"
              render-after-expand 
              @check="getnode()"
              :props="defaultProps">
              </el-tree>
            </div>
            <div class="right-tree">
              <div class="tree-head">
                已选关联分类预览
              </div>
              <el-tree
              :data="classTree"
            	ref="tree4"
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
          <el-input v-model="form2.index" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addSecondLevel('form2')" class="success" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
      <!-- 三级 -->
      <el-form label-width="150px" :rules="rules3" status-icon :model="form3" ref="form3" v-show="radio==3">
        <el-form-item prop="firstLevelId">
          <span slot="label">所属一级导航：</span>
          <el-select v-model="form3.firstLevelId" placeholder="请选择" @change="firstClassChange">
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="secondLevelId">
          <span slot="label">所属二级导航：</span>
          <el-select v-model="form3.secondLevelId" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label">三级导航名称：</span>
          <el-input v-model="form3.name" placeholder="字数长度1~10以内"></el-input>
        </el-form-item>
        <el-form-item prop="maintenanceWay">
          <span slot="label">导航维护商品方式：</span>
          <el-select
            v-model="form3.maintenanceWay"
            placeholder="选择维护方式">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="maintenanceWay" v-show="form3.maintenanceWay=='CATEGORY'">
          <div class="tree-box">
            <div class="left-tree">
              <div class="tree-head">
                后台分类选项列表
              </div>
              <el-tree
              ref="tree5"
              :data="classTree"
              show-checkbox
              node-key="id"
              render-after-expand 
              @check="getnode()"
              :props="defaultProps">
              </el-tree>
            </div>
            <div class="right-tree">
              <div class="tree-head">
                已选关联分类预览
              </div>
              <el-tree
              :data="classTree"
            	ref="tree6"
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
          <el-input v-model="form3.index" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addThirdLevel('form3')" class="success" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {addFirst,addSecond,initialization,firstSelect,thirdLevel,subSelect} from '@/api/release/navManage'
  import {preview} from '@/api/classManage'
  export default {
    inject:['reload'],
    name:'AddFirstNav',
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
        classTree: [],
        defaultProps: {
          children: 'subCategory',
          label: 'name'
        },
        loading: false,
        radio:1,
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
        options1:[],
        options2:[],
        taxclass:[],
        class1options1:[],
        form1:{
          name:null,
          index:null,
          maintenanceWay:null,
          categoryIds:null,
        },
        form2:{
          name:null,
          index:null,
          maintenanceWay:null,
          categoryIds:null,
          firstLevelId:null
        },
        form3:{
          name:null,
          index:null,
          maintenanceWay:null,
          categoryIds:null,
          firstLevelId:null,
          secondLevelId:null
        },
        rules1: {
          name: [
            { required: true, message: '请输入一级导航名称', trigger: 'blur' },
            { min: 1, max: 10, message: '字数长度在 1 到 10', trigger: 'blur' }
          ],
          maintenanceWay:[
            { required: true, message: '请选择导航维护商品方式', trigger: 'blur' },
          ],
          index:[
            { validator: checkIndex, trigger: 'blur' }
          ]
        },
        rules2: {
          name: [
            { required: true, message: '请输入二级导航名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          firstLevelId: [
            { required: true, message: '请选择一级导航', trigger: 'blur' },
          ],
          maintenanceWay:[
            { required: true, message: '请选择导航维护商品方式', trigger: 'blur' },
          ],
          index:[
            { validator: checkIndex, trigger: 'blur' }
          ]
        },
        rules3: {
          firstLevelId: [
            { required: true, message: '请选择一级导航', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入三级导航名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          secondLevelId: [
            { required: true, message: '请选择二级导航',trigger:'blur'},
          ],
          maintenanceWay:[
            { required: true, message: '请选择导航维护商品方式', trigger: 'blur' },
          ],
          index:[
            { validator: checkIndex, trigger: 'blur' }
          ]
        }
      };
    },
    components:{
      addhead
    },
    activated(){
      preview().then(res=>{
        if(res.code=='000000'){
          this.classTree = res.data;
          this.$nextTick().then(()=>{
					  this.getnode()
				  })
        }
      })
      firstSelect().then(res=>{
        if(res.code=='000000'){
          this.options1 = res.data;
        }
      })
    },
    methods: {
      filterNode(value, data) {
			  if(!value) return true;
			  return value.includes(data.id);
		  },
      getnode(data) {
        var yeziId = this.$refs.tree1.getCheckedKeys(true)
        var idArr = this.$refs.tree1.getCheckedKeys()
        this.form1.categoryIds=yeziId.map((item,index)=>{
          return item
        })
        this.$refs.tree2.filter(idArr);

        var yeziId = this.$refs.tree3.getCheckedKeys(true)
        var idArr = this.$refs.tree3.getCheckedKeys()
        this.form2.categoryIds=yeziId.map((item,index)=>{
          return item
        })
        this.$refs.tree4.filter(idArr);

        var yeziId = this.$refs.tree5.getCheckedKeys(true)
        var idArr = this.$refs.tree5.getCheckedKeys()
        this.form3.categoryIds=yeziId.map((item,index)=>{
          return item
        })
        this.$refs.tree6.filter(idArr);
		},
      getinitialization(){
        initialization().then(res=>{
          
        })
      },
      onchange2(val){
        this.form2.administratorname = this.form2.administratoritem.realName
        this.form2.userDataAuthorityId = this.form2.administratoritem.id
      },
      onchange3(val){
        this.form3.administratorname = this.form3.administratoritem.realName
        this.form3.userDataAuthorityId = this.form3.administratoritem.id
      },
      firstClassChange(val){
        this.form3.secondLevelId = null;
        if(val){
          this.getlist2(val)
        }
      },
      getlist(level,parentId){
        selectList(level,parentId).then(res=>{
          if(res.code == '000000'){
            this.options1 = res.data
          }
        })
      },
      getlist2(parentId){
        subSelect(parentId).then(res=>{
          if(res.code == '000000'){
            this.options2 = res.data
          }
        })
      },
      addFirstLevel(formName) {
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form1.maintenanceWay=='CATEGORY'?this.form1.categoryIds.length:true){
                addFirst({
                categoryIds:this.form1.maintenanceWay=='CATEGORY'?this.form1.categoryIds:null,
                index:this.form1.index-0,
                maintenanceWay:this.form1.maintenanceWay,
                name:this.form1.name
              }).then(res=>{
                  if(res.code=='000000'){
                    this.$message({
                        message: '导航数据已经保存成功，保存至待发布',
                        type: 'success'
                    });
                    this.reload();
                  }
                }
              )
            }else{
              this.$message.error('请选择分类信息');
            }
          } else {
            return false;
          }
        });
      },
      addSecondLevel(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form2.maintenanceWay=='CATEGORY'?this.form2.categoryIds.length:true){
              addSecond({
              categoryIds:this.form2.maintenanceWay=='CATEGORY'?this.form2.categoryIds:null,
              firstLevelId:this.form2.firstLevelId,
              index:this.form2.index-0,
              maintenanceWay:this.form2.maintenanceWay,
              name: this.form2.name
            }).then(res=>{
              if(res.code=='000000'){
                this.$message({
                    message: '导航数据已经保存成功，保存至待发布',
                    type: 'success'
                });
                this.reload();
              }
            })
            }else{
              this.$message.error('请选择分类信息');
            }
          } else {
            return false;
          }
        });
      },
      addThirdLevel(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form3.maintenanceWay=='CATEGORY'?this.form3.categoryIds.length:true){
                thirdLevel({
                  categoryIds:this.form3.maintenanceWay=='CATEGORY'?this.form2.categoryIds:null,
                  firstLevelId:this.form3.firstLevelId,
                  secondLevelId:this.form3.secondLevelId,
                  index:this.form3.index-0,
                  maintenanceWay:this.form3.maintenanceWay,
                  name: this.form3.name
              }).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                      message: '导航数据已经保存成功，保存至待发布',
                      type: 'success'
                  });
                  this.reload();
                }
              })
            }else{
              this.$message.error('请选择分类信息');
            }
          } else {
            return false;
          }
        });
      },
          }
  }
</script>
<style scoped lang="less">
  .addSecond{
    .footerBox{
      margin-top: 40px;
      position: relative;
      border-left: 1px solid #e4e4e4;
      border-right: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      .el-input{
        width:400px;
        height: 30px;
      }
      .el-form{
        margin-left: 50px;
        .el-form-item{
          i{
            color: red;
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
                overflow:scroll;
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
                overflow:scroll;
                height: 250px;
              }
            }
          }
        }
      }

    }

  }
</style>
