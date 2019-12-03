<template>
  <el-dialog title="限价设置" :visible.sync="isShow" width="600px">
    <div class="cardwrap">
      <el-card class="box-card" :body-style="{ height: '300px', overflow: 'auto' }">
        <div slot="header" class="clearfix">
          <span>分类选项列表</span>
        </div>
        <el-tree
          ref="sourceTree"
          :data="source"
          show-checkbox
          node-key="id"
          empty-text="加载中"
          :props="defaultProps"
          @check="getnode"
        ></el-tree>
      </el-card>
      <el-card class="box-card" :body-style="{ height: '300px', overflow: 'auto'  }">
        <div slot="header" class="clearfix">
          <span>已选分类预览</span>
        </div>
        <el-tree
          ref="targetTree"
          :data="source"
          node-key="id"
          empty-text="未选择分类"
          :filter-node-method="filterNode"
          :props="defaultProps"
        ></el-tree>
      </el-card>
      <el-row>
        <el-col :span="18">
          <el-form :model="form" ref="salePriceForm" :rules="rules" label-width="98px">
            <el-form-item label="设置分类限价" prop="discount">
              <el-input v-model="form.discount" placeholder="折扣率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="checkForm('salePriceForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getlimitedprice,
  setlimitedprice
} from "@/api/release/specialProjectManage";
export default {
  props: {},
  data() {
    var check = (rule, value, callback) => {
      console.log(this.row);
      if (value == "") {
        return callback(new Error("项目售价不能为空"));
      }
      let patrn = /^(((\d*).\d{1,2})|(\d+))$/;
      if (!patrn.test(value)) {
        return callback(new Error("填写的数据规格有误"));
      }
      callback();
    };
    return {
      isShow: false,
      id: "",
      skuId: "",
      skuArr:[],
      source: [],
      target: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        discount: ""
      },
      rules: {
        discount: [{ validator: check, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    init(data) {
      this.id = data.shoppeId;
      this.isShow = true;
      this.getData();
    },
    getData(){
      getlimitedprice(this.id).then(res => {
        this.source = this.formatData(res.data);
        this.$nextTick(() => {
          this.getnode();
        })
      });
    },
    formatData(arr){
      let temp = arr.map((value, index, array) => {
        if(value.discountRate){}
        let obj = {
          id: value.id,
          label: value.name + (value.discountRate ? `(${value.discountRate}%)` : ''),
        };
        if(value.subCategory.length){
          obj["children"] = this.formatData(value.subCategory)
        }
        return obj;
      })
      return temp;
    },
    getnode() {
      let idArr = this.$refs.sourceTree.getCheckedKeys();
      let i = this.$refs.sourceTree.getCheckedNodes(true, true);
      //this.options10=i
      this.$refs.targetTree.filter(idArr);
      this.skuArr = this.$refs.sourceTree.getCheckedKeys(true);
      console.log(this.skuArr);
    },
    filterNode(value, data) {
      if (!value) return false;
      return value.includes(data.id);
    },
    checkForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.submitForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm() {
      setlimitedprice(this.id, this.form.discount, this.skuArr).then(res => {
        this.isShow = false;
        this.$emit("callback", "salePrice");
        this.$message({
          type: "success",
          message: "设置售价成功!"
        });
      });
    }
  }
};
</script>
<style scoped lang="less">
.cardwrap {
  .box-card {
    display: inline-block;
    width: 250px;
    margin: 0 10px;
  }
  .el-row {
    margin-top: 20px;
  }
  .el-input {
    width: 200px;
  }
}
</style>
<style scoped>
.cardwrap >>> .el-input__inner {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.cardwrap >>> .el-input-group__append {
  background-color: #fff;
  border: 0;
}
</style>