<template>
  <div class="addSecond">
    <div class="footerBox">
      <addhead headname="添加分类"></addhead>
      <el-form label-width="150px">
        <el-form-item required>
          <span slot="label">层级：</span>
          <el-radio-group v-model="radio">
            <el-radio :label="3" class="gap">三级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form label-width="150px" :rules="rules3" status-icon :model="form3" ref="form3">
        <el-form-item class="first-level-name" v-if="id1||id2">
          <span slot="label"><i>*</i>&nbsp;所属一级导航：</span>
          <el-input v-model="form3.name1" readonly></el-input>
        </el-form-item>
        <el-form-item v-if="!id1&&!id2">
          <span slot="label"><i>*</i>&nbsp;所属一级导航：</span>
          <el-select v-model="form3.firstLevelId" placeholder="请选择" @change="onChange1">
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="id2" class="first-level-name" v-if="id2">
          <span slot="label"><i>*</i> 所属二级导航：</span>
          <el-input v-model="form3.name2" readonly></el-input>
        </el-form-item>
        <el-form-item v-if="!id2">
          <span slot="label"><i>*</i>&nbsp;所属二级导航：</span>
          <el-select v-model="form3.secondLevelId" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name3">
          <span slot="label">三级导航名称：</span>
          <el-input v-model="form3.name3" placeholder="字数长度1~10以内"></el-input>
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
              ref="tree"
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
  import {initialization,thirdLevel,subSelect,firstSelect} from '@/api/release/navManage'
  import {preview} from '@/api/classManage'
  export default {
    inject:['reload'],
    name:'AddThird',
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
        defaultProps: {
          children: 'subCategory',
          label: 'name'
        },
        classTree:[],
        loading:false,
        id:null,
        id1:null,
        id2:null,
        radio:3,
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
        form3:{
          name1:'',
          name2:'',
          name3:'',
          firstLevelId:null,
          secondLevelId:null,
          maintenanceWay:null,
          index:null,
          categoryIds:null
        },
        rules3: {
          firstLevelId: [
            { required: true, message: '请选择一级导航', trigger: 'blur' },
          ],
          name3: [
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
      this.id1 = this.$route.query.id1;
      this.id2 = this.$route.query.id2;
      if(this.id2){
        this.getSecond(this.id2)
      }else if(this.id1){
        this.getFirst(this.id1);
        this.getlist2(this.id1)
      }else{
        this.getlist(1,1)
      }
      preview().then(res=>{
        if(res.code=='000000'){
          this.classTree = res.data;
          this.$nextTick().then(()=>{
					  this.getnode()
				  })
        }
      })
    },
    methods: {
        filterNode(value, data) {
          if(!value) return true;
          return value.includes(data.id);
        },
        addThirdLevel(formName){
          var that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              thirdLevel({
                categoryIds:this.form3.maintenanceWay=='CATEGORY'?this.form3.categoryIds:null,
                firstLevelId:this.form3.firstLevelId,
                secondLevelId:this.form3.secondLevelId,
                index:this.form3.index-0,
                maintenanceWay:this.form3.maintenanceWay,
                name: this.form3.name3
              }).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                      message: '导航数据已经保存成功，保存至待发布',
                      type: 'success'
                  });
                  this.reload();
                }
              })
            } else {
              return false;
            }
          });
        },
        getnode(data) {
          let yeziId = this.$refs.tree.getCheckedKeys(true)
          let idArr = this.$refs.tree.getCheckedKeys()
          this.form3.categoryIds=yeziId.map((item,index)=>{
            return item
          })
          this.$refs.tree2.filter(idArr);
        },
      onChange1(val){
        this.form3.secondLevelId = null
        this.getlist2(val)
      },
      getFirst(id){
        initialization(id).then(res=>{
          if(res.code=='000000'){
            this.form3.name1 = res.data.firstLevelName
            this.form3.firstLevelId = res.data.firstLevelId
          }
        })
      },
      getSecond(id){
        initialization(id).then(res=>{
          if(res.code=='000000'){
            this.form3.name2 = res.data.secondLevelName
            this.form3.name1 = res.data.firstLevelName
            this.form3.firstLevelId = res.data.firstLevelId
            this.form3.secondLevelId = res.data.secondLevelId
          }
        })
      },
      getlist2(id){
        subSelect(id).then(res=>{
          if(res.code=='000000'){
            this.options2 = res.data
          }
        })
      },
      getlist(){
        firstSelect().then(res=>{
          if(res.code=='000000'){
            this.options1 = res.data
          }
        })
      }
    }
  }
</script>
<style>
  .first-level-name .el-input__inner{
    color: red;
  }
</style>
<style scoped lang="less">
  .addSecond{
    .footerBox{
      margin-top: 40px;
      position: relative;
      border: 1px solid #e4e4e4;
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
            }
          }
        }
      }

    }

  }
</style>
