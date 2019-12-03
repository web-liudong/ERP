<template>
  <div class="correspondBox">
    <el-dialog :title="title" :visible.sync="isShow" width="30%">
      <el-input type="textarea" :rows="5" :placeholder="`可同时输入多个${content}ID，ID之间用英文逗号分隔`" v-model="des" @input="des=des.replace(/[^\,\d]/g,'')"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    title:'',
    content:''
  },
  data() {
    return {
      isShow: false,
      des: "",
    };
  },
  methods: {
    init() {
      this.isShow = true;
    },
    submit() {
      this.isShow = false;
      this.des=this.des.split(',');
      this.des=this.des.map((item)=>{
        return Number(item)
      })
      this.$emit('oldSeaCallback',this.des)
      this.des=''
    }
  }
};
</script>
<style  lang="less" scoped>
.correspondBox {
  .el-form {
  }
}
</style>
