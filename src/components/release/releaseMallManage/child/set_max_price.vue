<template>
  <el-dialog title="限价设置" :visible.sync="isShow" class="maxPriceBox">
    <el-row>
      <el-col style="font-size: 16px;font-weight: bold">设置当前项目中分类限价</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :model="mallSkuLimitPriceBatchParam" ref="mallSkuLimitPriceBatchParam">
          <el-form-item label="设置当前项目中分类限价:" prop="classify" class="listDialogBox clear">
            <div class="listLeftBox left">
              <div class="headerDialogBox">分类选项列表</div>
              <div>
                <el-tree
                  ref="tree"
                  :data="data2"
                  show-checkbox
                  node-key="id"
                  @check="getnode()"
                  :props="defaultProps">
                   <span class="custom-tree-node"  slot-scope="{node,data}">
                   <span>{{node.label}}</span> 
                   <span v-show="data.level=='3'">({{data.discount|aaaa}})</span>
                   </span>
                </el-tree>
              </div>
            </div>
            <div class="listRightBox left">
              <div class="headerDialogBox">已选分类预览</div>
              <div>
                <el-tree
                  :data="data2"
                  ref="tree2"
                  node-key="id"
                  :filter-node-method="filterNode"
                  :props="defaultProps"
                >
                </el-tree>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="设置品类限价:" class="listDialogBox">
            <el-input v-model="mallSkuLimitPriceBatchParam.discount" style="width: 200px"><template slot="append">%</template></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('mallSkuLimitPriceBatchParam')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { getItemInfo,batchSetMaxSale} from "@/api/release/mallProjectManage";
  export default {
    props: {},
    data() {
      var check = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("项目限价不能为空"));
      }
      let patrn = /^(((\d*).\d{1,2})|(\d+))$/;
      if (!patrn.test(value)) {
        return callback(new Error("填写的数据规格有误"));
      }
      callback();
    };
      return {
        isShow: false,
        data: null,
        form: {
          val: ""
        },
        mallSkuLimitPriceBatchParam:{
          discount:null,
          mallId:null,
          categoryIds:null
        },
        data2: [],
        defaultProps: {
          children: 'subCategory',
          label: 'name'
        },
        row:null,
        rules: {
          val: [{ validator: check, trigger: "blur" }]
        }
      };
    },
    mounted() {
      
    },
    filters:{
      aaaa(val){
       return val * 100 +'%'
      }
      
    },
    methods: {
      init(row,aaa) {
        getItemInfo(aaa).then(res=>{
          this.data2=res.data;
          this.$nextTick(()=>{
            this.getnode();
          })
        })
        this.isShow = true;
        this.row=aaa;
      },
      filterNode(value, data) {
        if(!value) return true;
        return value.includes(data.id);
      },
      getnode() {
        this.skuArr=this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        this.$refs.tree2.filter(this.skuArr);
      },
      submitForm(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
           this.mallSkuLimitPriceBatchParam.categoryIds=this.skuArr; 
           this.mallSkuLimitPriceBatchParam.mallId=this.row;
           batchSetMaxSale(this.mallSkuLimitPriceBatchParam).then(res=>{
             if(res.code=='000000'){
               this.$message({
                 message:'批量设置限价成功',
                 type:'success'
               })
             }
           })
            this.isShow = false;
            this.$emit("callback",'salePrice');
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  };
</script>
<style scoped lang="less">
  .el-row {
    line-height: 30px;
    font-size: 14px;
    .el-col{
      .listLeftBox{
        position: relative;
        overflow: auto;
        background-color: #FFFFFF;
        border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 300px;
        height:300px;
        .headerDialogBox{
          width: 300px;
          height: 35px;
          position: absolute;
          z-index: 1111;
          top:0;
          left:0;
          border: 1px solid #e4e4e4;
          text-align: center;
          color: red;
          line-height: 36px;
        }
      }
      .listRightBox{
        border: 1px solid #e5e5e5;
        height:300px;
        width: 300px;
        overflow: auto;
        position: relative;
        /*padding: 0 10px;*/
        .headerDialogBox{
          height: 35px;
          position: absolute;
          top: 0;
          width: 300px;
          left: 0;
          text-align: center;
          border: 1px solid #e4e4e4;
          z-index: 1111;
          color: red;
          line-height: 36px;
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  .maxPriceBox{
    .el-dialog__header{
      padding: 10px;
      padding-bottom: 0;
      background: #E4E4E4;
      height: 50px;
      line-height: 50px;
    }
    .el-dialog__body{
      font-size: 16px;
    }
    .el-tree{
      margin-top: 50px;
      .el-tree__empty-text{
        position: absolute;
        left: 50%;
        top: 100%;
        color: #696f4d;
      }
    }
    .el-form{
      .el-form-item{
        .el-input{
          width: 400px;
          margin-top: 10px;
        }
       // margin-bottom: 10px;
      }
    }

  }


</style>
