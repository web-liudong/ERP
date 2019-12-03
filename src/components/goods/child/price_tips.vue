<template>
<div class="priceSettingBox">
  <el-dialog title="价格提示" :visible.sync="isShow" width="40%" class="infoBox">
      <div>
          <p v-if="title=='官网价格设置'">价格更改为{{rows}}元后下列项目中项目售价会高于项目限价，还要继续更改官网价格吗?</p>
          <p v-if="title=='通用价格设置'">价格更改为{{rows}}元后,售价会低于建议采购价，还要继续更改官网价格吗?</p>
      </div>
      <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small"
          v-if="title=='官网价格设置'">   
          <el-table-column
            prop="projcetName"
            label="项目"
            align="center">

          </el-table-column>
           <el-table-column
            prop="projectPrice"
            label="售价"
            align="center">
            <template slot-scope="scope">
                <span v-if="scope.$index==0">￥{{scope.row.websitePrice}}</span>
                <span v-if="scope.$index!=0">￥{{scope.row.projectPrice}}</span>
             </template>  
          </el-table-column>
           <el-table-column
            prop="limitPrice"
            label="限价"
            align="center">
            <template slot-scope="scope">
                <span> <i v-if="scope.row.limitPrice==''">￥</i> {{scope.row.limitPrice}}</span>
             </template>  
          </el-table-column>
        </el-table>
     <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="toCommopriceSetting()">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import {setGoodsPrice} from '@/api/goodsManage'
export default {
  props: {
      
  },
  data() {
    return {
      isShow: false,
      des:"",
      tableData:null,
      rows:null,
      title:''
    };
  },
  mounted() {
  },
  components:{
  },
  methods: {
    init(row,title) {
         this.isShow = true;
         this.rows=row;
         this.title=title
         console.log(this.title,999)
         this.tableData=row;
    },
    openDia(type,row,query){
        this.$refs[type].init(row,query)
    },
    toCommopriceSetting(){

        this.isShow=false;
        if(this.title=='官网价格设置'){
          this.$emit('DialogCallback')
        }
        if(this.title=='通用价格设置'){
            this.$emit('dialogPrice')
        }
        
    }
  }
};
</script>
<style  lang="less">
.priceSettingBox{
 

}
</style>
