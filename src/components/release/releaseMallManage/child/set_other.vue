<template>
  <el-dialog title="设置对应分类" :visible.sync="isShow">
    <el-form :model="form" ref="otherClassify" :rules="rules" class="otherBox">
      <el-form-item label="设置对应分类：" prop="categoryIdList" class="listBox clear">
        <div class="listLeftBox left">
          <div class="headerBox">
            <span>分类选项列表</span>
          </div>
          <div style="position: relative" class="treeBox">
            <el-tree
              ref="tree"
              :data="data"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              @check-change="orgCheckChange"
              @check="getnode()"
              empty-text="暂无数据"
              :check-strictly="true"
              :props="defaultProps"
            ></el-tree>
          </div>
        </div>
        <div class="listRightBox left">
          <div class="headerBox">
            <span>已选分类预览</span>
          </div>
          <div style="position: relative" class="treeBox">
            <el-tree
              :data="data"
              ref="tree2"
              node-key="id"
              empty-text="请选择分类"
              :filter-node-method="filterNode"
              :props="defaultProps"
            ></el-tree>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('otherClassify')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  SetOtherClassify,
  AllSetOtherClassify,
  getThreeClassify
} from "@/api/release/mallProjectManage.js";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      data: null,
      mallId: null,
      otherClassify: null,
      skuArr: null, //选中分类的集合
      defaultProps: { children: "subCategoryTree", label: "name" ,disabled:this.disabledchange},
      form: {},
      row: null,
      rules: {}
    };
  },
  mounted() {},
  methods: {
    init(row, id, otherClassify) {
      this.isShow = true;
      this.mallId = id;
      this.row = row;
      this.otherClassify = otherClassify;
      getThreeClassify(this.mallId).then(res => {
        this.data = res.data;
        this.$nextTick(() => {
          this.getnode();
        });
      });
    },
    disabledchange(data,node){
     if(data.subCategoryTree){
       return true
     }else{
       return false
     } 
    //  if(data.level<3){
    //   return true
    //  }else{
    //    return false
    //  }
    },
    orgCheckChange(data, checked, indeterminate) {
      const indexs = this.skuArr.indexOf(data.id);
      if (indexs < 0 && this.skuArr.length === 1 && checked) {
        this.$message({
          message: "只能选择一个三级分类！",
          type: "error",
          showClose: true
        });
        this.$refs.tree.setChecked(data, false);
      }else if(this.skuArr.length===0&&checked){
        this.skuArr=[];
        this.skuArr.push(data.id)
      }else if(indexs>=0&&this.skuArr.length===1&&!checked){
         this.skuArr=[]
      }
    },
    getnode() {
      let idArr = this.$refs.tree.getCheckedKeys();
      this.$refs.tree2.filter(idArr);
      this.skuArr = this.$refs.tree.getCheckedKeys(true);
    },
    filterNode(value, data) {
      if (!value) return true;
      return value.includes(data.id);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.otherClassify == "otherClassify") {
            SetOtherClassify(this.row.id,this.skuArr[0],this.mallId).then(res => {
                   if(res.code=='000000'){
                     this.$message({
                       message:'设置对应分类成功',
                       type:'success'
                     })
                     this.isShow=false
                   }
            });
          }else{
            AllSetOtherClassify(this.row,this.skuArr[0],this.mallId).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message:'批量设置对应分类成功',
                  type:'success'
                })
                this.isShow=false
              }
            })
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.otherBox {
  .listBox {
    width: 600px;
    box-sizing: border-box;
    .listLeftBox {
      padding: 0 10px;
      width: 200px;
      height: 300px;
      overflow: auto;
      .treeBox {
        width: 100%;
        height: 263px;
        box-sizing: border-box;
        overflow: auto;
        border: 1px solid #e4e4e4;
      }
      .headerBox {
        height: 35px;
        border: 1px solid #e4e4e4;
        text-align: center;
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
      .treeBox {
        width: 100%;
        height: 263px;
        box-sizing: border-box;
        border: 1px solid #e4e4e4;
        overflow: auto;
      }
      .headerBox {
        height: 35px;
        border: 1px solid #e4e4e4;
        text-align: center;
        span {
          color: red;
          height: 36px;
          line-height: 36px;
        }
      }
    }
  }
}
</style>