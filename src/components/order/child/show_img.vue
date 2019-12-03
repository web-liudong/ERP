<template>
  <el-dialog :title="resData.name" :visible.sync="isShow" width="650px">
    <el-card :body-style="{ padding: '0px' }">
      <img :src="resData.url" class="image">
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      isShow: false,
      resData: {}
    };
  },
  mounted() {},
  methods: {
    init(row) {
      this.resData = row;
      this.isShow = true;
    }
  }
};
</script>
<style scoped lang="less">
.image{
  width: 100%;
  display: inline-block;
}
</style>