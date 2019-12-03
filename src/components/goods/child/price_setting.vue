<template>
<div class="priceSettingBox">
  <el-dialog title="价格设置" :visible.sync="isShow" width="50%" class="infoBox">
      <div class="headerBox">
        <p>商品：<span style="color:red">{{rows.name}}</span></p>
        <p><span>采购价（含税）:￥{{rows.buyingPrice}}</span><span style="margin-left:20px;">建议零售价：￥{{rows.sellingPrice}}</span><span style="margin-left:20px;">目前仓报价：--</span></p>
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
                <span> <i v-if="scope.row.limitPrice==''">￥</i>{{scope.row.limitPrice}}</span>
             </template> 
          </el-table-column>
           <el-table-column
            prop="interestRate"
            label="毛利率"
            align="center">
            <template slot-scope="scope">
                <span>{{scope.row.interestRate}} <i v-if="scope.row.interestRate!=''&&scope.row.interestRate!=null">%</i> </span>
             </template>  
          </el-table-column>
           <el-table-column
            prop="isMall"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.$index==0" @click="openDia('commonpriceSetting',scope.row,{title:'官网价格设置'})">改官网价</el-button>    
              <el-button type="text" size="small" v-if="scope.$index!=0" @click="openDia('commonpriceSetting',scope.row,{title:'通用价格设置'})">改售价</el-button>    
             </template>    
            </el-table-column>
        </el-table>
     <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isShow=false">确 定</el-button>
    </div>
  </el-dialog>
   <commonpriceSetting ref="commonpriceSetting" @dialogBack="dialogBack"></commonpriceSetting>    
  </div>
</template>
<script>
import commonpriceSetting from './commonprice_setting'
import {setGoodsPrice} from '@/api/goodsManage'
export default {
  props: {
      
  },
  data() {
    return {
      isShow: false,
      des:"",
      tableData:null,
      rows:{buyingPrice:'',sellingPrice:'',name:'',id:'',websitePrice:''}
    };
  },
  mounted() {
  },
  components:{
    commonpriceSetting
  },
  methods: {
    init(row) {
        console.log(row,66)

      this.isShow = true;
      setGoodsPrice(row.id,row.buyingPrice,row.websitePrice).then(res=>{
         this.tableData=res.data;
         let aa={websitePrice:row.websitePrice,projcetName:'官网',isMall:true,limitPrice:'--',isA:false,skuId:row.id};
         this.tableData.unshift(aa)
         console.log(this.tableData,444)
      })
      this.rows=row;
    },
    openDia(type,row,query){
        this.$refs[type].init(row,query,this.rows.buyingPrice)
    },
    dialogBack(value){
      // this.$emit('aa');
        let bb={websitePrice:value,projcetName:'官网',isMall:true,limitPrice:'--',isA:false,skuId:this.rows.id}
          this.tableData.shift();
          this.tableData.unshift(bb)
    }
  }
};
</script>
<style  lang="less">
.priceSettingBox{
 

}
</style>
