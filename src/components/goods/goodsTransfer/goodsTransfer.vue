<template>
  <div class="goodsTransferBox">
    <div class="h50 headerBox"><img src="" alt=""><span>基本信息</span></div>
    <div>
      <table border="1px" style="width: 100%;height: 50px" class="cententBox">
        <tr>
          <th>源分类参数模板（{{formData2.firstLevelCategoryName}}>{{formData2.secondLevelCategoryName}}>{{formData2.thirdLevelCategoryName}}）</th>
          <td>目标分类对应参数模板（{{formData1.firstLevelCategoryName}}>{{formData1.secondLevelCategoryName}}>{{formData1.thirdLevelCategoryName}}）</td>
        </tr>

      </table>
    </div>
    <div style="display: flex" class="tableBox">
      <el-table
        :data="tableData"
        style="width: 100%;"
        border>
        <el-table-column
          label="参数组"
          width="160"
          align="center">
          <template slot-scope="scope">
            <span >{{ scope.row.groupName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="参数名  "
          align="center">
          <template slot-scope="scope">
            <tr style="display:table;border: 1px solid #e4e4e4;width:100%;height: 50px;line-height: 50px;text-align: center" v-for="item in scope.row.categoryAttributeBriefDTOS" :key="item.categoryAttributeId">
              {{item.categoryAttributeName}}</tr>
          </template>
        </el-table-column>
        <el-table-column label="对应目标参数序号" align="center">
          <template slot-scope="scope">
            <tr style="display:table;border: 1px solid #e4e4e4;width:100%;height: 50px;line-height:50px;text-align: center"
                v-for="item1 in scope.row.categoryAttributeBriefDTOS" :key="item1.categoryAttributeId">
              <input type="text" v-model="item1.categoryAttributeNo" style="text-align: center;width: 100%;cursor: pointer;height: 100%" placeholder="请输入目标序号">
            </tr>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 50px"><i class="iconfont icon-qianjin" style="font-size: 50px;line-height: 10"></i></div>
      <el-table
        :data="tableData1"
        style="width: 100%" border>
        <el-table-column
          label="参数组"
          width="160" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.groupName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="参数名"
          align="center">
          <template slot-scope="scope">
            <tr style="display:table;border: 1px solid #e4e4e4;width:100%;height: 50px;line-height: 50px;text-align: center" v-for="item in scope.row.categoryAttributeBriefDTOS" :key="item.categoryAttributeId">
              {{item.categoryAttributeName}}</tr>
          </template>
        </el-table-column>
        <el-table-column label="参数序号" align="center">
          <template slot-scope="scope">
            <tr style="display:table;border: 1px solid #e4e4e4;width:100%;height: 50px;line-height:50px;text-align: center;font-weight: bold"
                v-for="item1 in scope.row.categoryAttributeBriefDTOS" :key="item1.categoryAttributeId">
              {{item1.categoryAttributeNo}}
            </tr>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footerBox">
      <el-button type="primary" @click="closed()">取消迁移</el-button>
      <el-button type="primary" style="margin-left: 20px" @click="gotoAuditer()">确认迁移</el-button>
    </div>

  </div>
</template>
<script>
  import '@/components/goods/brandManage/EditorBrand.less'
  import {getTransferData,transferGoodsInfo,editerTransferData} from '@/api/goodsManage'

  export default {
    inject:['close'],
    name:'goodsTransfer',
    data() {
      return{
        oldCategoryID:null,
        destinationID:null,
        skuIDs:null,
        tableData: null,
        tableData1: null,
        //校验参数
        data: [],
        dtoData:[],
        formData1:{
          firstLevelCategoryName:null,
          secondLevelCategoryName:null,
          thirdLevelCategoryName:null,
        },
        formData2:{
          firstLevelCategoryName:null,
          secondLevelCategoryName:null,
          thirdLevelCategoryName:null
        },
      }
    },
    created(){
      this.oldCategoryID=this.$route.query.thirdLevelCategoryId
      this.destinationID=this.$route.query.destinationCategoryId
      this.skuIDs=this.$route.query.skuIDs;
      getTransferData(this.oldCategoryID,this.destinationID).then(res=>{
        this.dtoData=res.data;
        this.tableData=res.data.sourceCategoryAttributeTemplateDTO.categoryAttributeGroupBriefDTOS;
        this.tableData1=res.data.destinationCategoryAttributeTemplateDTO.categoryAttributeGroupBriefDTOS;
        this.formData1=res.data.destinationCategoryAttributeTemplateDTO;
        this.formData2=res.data.sourceCategoryAttributeTemplateDTO;
        for (let i = 0; i < this.tableData.length; i++) {
          const item = this.tableData[i];
          for (let j = 0; j <item.categoryAttributeBriefDTOS
            .length; j++) {
            const attr = item.categoryAttributeBriefDTOS[j];
            this.data.push({oldAttributeId:attr.categoryAttributeId})
          }
        }
      })
    },
    activated(){
     if(this.$route.query.skuIDs&&!this.skuIDs!=this.$route.query.skuIDs){
       this.oldCategoryID=this.$route.query.thirdLevelCategoryId
       this.destinationID=this.$route.query.destinationCategoryId
       this.skuIDs=this.$route.query.skuIDs;
       getTransferData(this.oldCategoryID,this.destinationID).then(res=>{
        this.dtoData=res.data;
        this.tableData=res.data.sourceCategoryAttributeTemplateDTO.categoryAttributeGroupBriefDTOS;
        this.tableData1=res.data.destinationCategoryAttributeTemplateDTO.categoryAttributeGroupBriefDTOS;
        this.formData1=res.data.destinationCategoryAttributeTemplateDTO;
        this.formData2=res.data.sourceCategoryAttributeTemplateDTO;
        for (let i = 0; i < this.tableData.length; i++) {
          const item = this.tableData[i];
          for (let j = 0; j <item.categoryAttributeBriefDTOS
            .length; j++) {
            const attr = item.categoryAttributeBriefDTOS[j];
            this.data.push({oldAttributeId:attr.categoryAttributeId})
          }
        }
      })
     }
    },
    methods:{
      closed(){
       this.close({name:"goodsTransfer",to:{name:'GoodsManage',params:{isUpdate:true}}})
      },
      //确认迁移(校验商品信息)
      gotoAuditer(){
           if(typeof this.skuIDs=='string'){
           this.skuIDs=this.skuIDs.split(',')            
           }
           this.skuIDs=this.skuIDs.map((item,index)=>{
             return Number(item)
           })
            
       editerTransferData({
         categoryAttributeTemplateMigrationDTO:this.dtoData,
         skuIds:this.skuIDs
       }).then(res=>{
        if(res.code=='000000'){
          this.$message({
            message:'迁移商品成功',
            type:'success'
          })
        }
       })
      }
    }
  }
</script>

<style lang="less" scoped>
  .goodsTransferBox{
    border: 1px solid #e4e4e4;
    margin-top: 10px;
    .headerBox{
      height: 50px;
      background: #f3f3f3;
      border-bottom: 1px solid #e4e4e4;
      span{
        line-height: 50px;
        margin-left: 50px;
      }
    }
    .cententBox{
      width: 100%;
      height: 50px;
      td,th{
        border: 1px solid #d1d1d1;
        font-size:14px;
        height:53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      td{
        text-align: center;
      }
    }
    .el-table{
      justify-content: space-between;
      flex-flow:nowrap ;
    }
    .footerBox{
      text-align: center;
      margin-top: 20px;
      margin-bottom: 200px;
    }
  }
</style>

<style lang="less">
  .goodsTransferBox{
    .tableBox{
      .el-table{
        .cell{
          padding: 0 !important;
        }
        td{
          padding: 0 !important;
        }
        .el-table-column{
          padding: 0 !important;
          tr{
            line-height: 30px;
          }
        }
      }
    }
  }


</style>
