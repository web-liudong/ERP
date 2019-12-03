<template>
<div class="priceSettingBox">
  <el-dialog title="提示" :visible.sync="isShow" width="50%" class="infoBox">
      <div class="headerBox">
        <p>商品：<span style="color:red">{{brandName}}</span></p>
        <p>该商品已存在于如下项目中，请先将商品从项目中下架后，才可设置下柜。</p>
      </div>
      <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small">   
          <el-table-column
            prop="projcetName"
            label="项目名称"
            align="center">
          </el-table-column>
           <el-table-column
            prop="userMsg"
            label="项目发布负责人"
            align="center">
          </el-table-column>      
        </el-table>
     <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="queryclick">确 定</el-button>
    </div>
  </el-dialog>
   <commonpriceSetting ref="commonpriceSetting"></commonpriceSetting>    
  </div>
</template>
<script>
import commonpriceSetting from './commonprice_setting'
export default {
  props: {
      
  },
  data() {
    return {
      isShow: false,
      des:"",
      tableData:[],
      brandName: null,
    };
  },
  mounted() {
  },
  components:{
    commonpriceSetting
  },
  methods: {
    init(row,data) {
      this.isShow = true;
      this.tableData=data;
      this.brandName = row.brandName;
      // console.log(row.brandName,this.tableData);
    },
    openDia(type,row,query){
        this.$refs[type].init(row,query)
    },
    queryclick(){
      this.isShow=false;
      this.$emit('Tipcallback')
    }
  }
};
</script>
<style  lang="less">
.priceSettingBox{
 

}
</style>
