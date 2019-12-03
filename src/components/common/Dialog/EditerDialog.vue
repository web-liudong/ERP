<template>
  <div class="editerDialogBox">
    <el-button type="text" @click="a()">点击打开 Dialog</el-button>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="25%" top="40vh">
      <span>{{content}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "EditerDialog",
    props:{
      title:{
        type:String,
        default:''
      },
      content:{
        type:String,
        default: '当前导入成功'
      },

      tubiao:{
        type:String,
        default:'iconfont icon-add'
      }
    },
    data() {
      return {
        dialogVisible: false,
      };
    },
    methods: {
      a(){
        this.dialogVisible = true;
      },
    }
  }
</script>

<style scoped lang="less">

</style>

