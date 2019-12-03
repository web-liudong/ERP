

<!--填写参数信息-->

<template>
  <div class="detaillBox">
    <div class="stepBox">
      <el-steps :active="1" align-center>
        <el-step title="填写基本信息"></el-step>
        <el-step title="填写参数信息"></el-step>
        <el-step title="商品图片"></el-step>
      </el-steps>
    </div>
    <div class="detaillTable2">
      <addhead headname="参数信息"></addhead>
      <div v-for="(item,index) in skuAttributeGroupList" :key="index">
        <div class="group-name">{{item.attributeGroupName}}</div>
        <div class="form-wrapper">
          <el-form ref="form" :model="form" label-width="190px" class="form-box" v-for="(attr,i) in item.skuAttributeList" :key="i">
            <el-form-item :required="attr.required==1" :label="attr.attributeName"  v-if="attr.valueType==0">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input v-model="attr.attributeValue"  @input = "attr.attributeValue=attr.attributeValue.replace(/[^\d]/g,'')" placeholder="5位以内数字" :maxlength="attr.maxLength">
                <template slot="append" v-if="attr.options">{{attr.options}}</template>
              </el-input>
            </el-form-item>
            <!--<el-form-item required v-show="attr.valueType==0">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input v-model="form.num" placeholder="长度1-10以内" type="number" :maxlength="attr.maxLength">
                <template slot="append" v-if="attr.options">{{attr.options}}</template>
              </el-input>
            </el-form-item>-->
            <el-form-item :required="attr.required==1" :label="attr.attributeName" v-if="attr.valueType==1">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input v-model="attr.attributeValue" placeholder="长度1~10字以内" @change="onChange"></el-input>
            </el-form-item>
            <!--   <el-form-item required v-show="attr.valueType==1">
                 <span slot="label">{{attr.attributeName}}：</span>
                 <el-input placeholder="长度1-10以内" :value="attr.attributeValue" @change="onChange" :maxlength="attr.maxLength"></el-input>
               </el-form-item>-->
            <el-form-item  :required="attr.required==1" v-show="attr.valueType==2">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input placeholder="长度1-10以内" type="textarea" rows="5" :value="attr.attributeValue"></el-input>
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==3">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-select v-model="attr.attributeValue" placeholder="请选择级别" style="width: 530px">
                <el-option :label="option" :value="attr.attributeValue" v-for="(option,ind) in attr.optionsList" :key="ind"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item required v-show="attr.valueType==4">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-radio-group :value="option" v-for="(option,ind) in attr.optionsList" :key="ind">
                <el-radio :label="option" class="gap"></el-radio>
              </el-radio-group>
            </el-form-item>-->
            <el-form-item :required="attr.required==1" :label="attr.attributeName" v-if="attr.valueType==4">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-radio-group v-model="attr.attributetype" v-for="(i,index) in attr.optionsList" :key="index" style="margin-right:20px">
                <el-radio :label="i"></el-radio>
              </el-radio-group>
              <!--  <input type="radio" :name="index" :value="item" v-for="(item,index) in attr.optionsList" :key="i">-->
            </el-form-item>
            <!-- <el-form-item required :label="attr.attributeName"  v-if="attr.valueType==4">
               <span slot="label">{{attr.attributeName}}：</span>
                <el-radio v-model="attr.options"></el-radio>
             </el-form-item>-->
            <el-form-item :required="attr.required==1" v-show="attr.valueType==5">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-checkbox-group v-model="attr.attributeValueList">
                <el-checkbox :label="ind" v-for="(option,ind) in attr.optionsList" :key="ind">{{option}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==6">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-date-picker type="date" placeholder="选择日期" v-model="attr.attributeValue" style="width: 40%;"></el-date-picker>
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==7">
              <span slot="label">{{attr.attributeName}}：</span>
              <upload ref="uploadData" @callback="diaCallback" class="updateBox"></upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <addhead headname="自定义参数"></addhead>
      <div style="margin:10px 0 0 120px"><el-button type="primary" @click="addDomain">添加自定义参数</el-button></div>
      <el-table
        :data="skuCustomerAttributeGroupParam"
        style="width: 800px;margin: 10px 0 0 120px" border>
        <el-table-column
          label="参数组"
          width="180" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.attributeGroupName" placeholder="选择已有参数组" @change="changeName(scope.row)">
              <el-option
                v-for="item in scope.row.options"
                :key="item.attributeGroupId"
                :label="item.attributeGroupName"
                :value="item.attributeGroupName">
              </el-option>
            </el-select>
            <!--  <el-input v-model="item.attributeGroupId" v-if="false"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column
          label="参数名"
          width="180" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.attributeName"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="参数值"
          width="180" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.attributeValue"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="button-box">
        <!-- <router-link :to="{name:'AddGoods'}"><el-button type="primary">返回上一页</el-button></router-link>
         -->
         <el-button type="primary" @click="openWin()">返回上一页</el-button>
        <el-button type="primary" @click="submitForm()">保存至草稿</el-button>
        <el-button type="primary" @click="gotoThree()">保存并填写下一步</el-button>
        <el-button @click="close" class="success" type="primary">关闭</el-button>
        <el-button type="primary" v-backTop>回顶部</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import upload from '@/components/common/upload/upload'
  import {template,templateLog} from '@/api/classManage'
  import {skuAttributeParameterInfoParam ,getGoodsSecond,addGoodsSecond,editerGoodsSecond} from '@/api/goodsManage';
  export default {
    inject:['close'],
    data(){
      return {
        skuAttributeGroupList:[],
        form:{},
        AddID:this.$route.query.oldID,
        //编辑的什么状态的数据
        isActive:this.$route.query.isActive,
        imageUrl:'',
        addData:{fileId:''},
        radio:[],
        checkList:[],
        options:[],
        data:null,
        //自定义参数组
        skuCustomerAttributeGroupParam:[],
        pictureID:this.$route.query.goodsID,
        //完成度
        completionRate:this.$route.query.completionRate
      }
    },
    components:{
      addhead,upload
    },
    created(){
      this.getData();
    },
    methods: {
      getList(id){
        templateLog(id).then(res=>{
          if(res.code=='000000'){
            this.skuCustomerAttributeGroupParam = res.data;
          }
        })
      },
      openWin(){
      //  const {href}=this.$router.resolve({
      //    name:'copyGoods',
      //    query:{copyID:this.AddID}
      //  })
      //   window.open(href)
        this.$router.push({name:'copyGoods',query:{copyID:this.AddID,isActive:this.isActive}})
      },
      getData(){
        var that=this;
        getGoodsSecond(this.AddID).then(res=>{
          this.data=res.data;
          this.skuAttributeGroupList =res.data.skuAttributeGroupList;
          let a=[];
          let c=this.skuAttributeGroupList;
          for (let i = 0; i < c.length; i++) {
            const item = c[i];
            a.push({attributeGroupName:item.attributeGroupName,attributeGroupId:item.attributeGroupId})
            for (let j = 0; j < item.skuAttributeList.length; j++) {
              const g = item.skuAttributeList[j];
              that.h= g.optionsList;
              if(g.valueType==5){
                 if(g.attributeValueList==null){
                  g.attributeValueList=[];
                 }
                }
            }
            if(item.valueType==5){
              item.attributeValue=item.attributeValue.split(',');
            }
            let aaa=a.map((item,index)=>{
              return {attributeGroupName:item.attributeGroupName,attributeGroupId:item.attributeGroupId,attributeId:0}
            })
            this.options=aaa;
          }
        })
      },
      //选中值发生变化时触发
      changeName(val){
        console.log(val,5556556);
      },
      diaCallback(value){
        console.log(value,5555);

      },
      //保存至草稿
      submitForm() {
        ////////////////////////自定义参数组
        for (let i = 0; i < this.skuCustomerAttributeGroupParam.length; i++) {
          const item = this.skuCustomerAttributeGroupParam[i];
          for (let j = 0; j < item.options.length; j++) {
            const itemElement = item.options[j];
            if(item.attributeGroupName===itemElement.attributeGroupName){
              item.attributeGroupId=itemElement.attributeGroupId
            }
          }
          if(item.valueType==5){
          item.attributeValue=item.attributeValue.join(',')
         }
        }
        console.log(this.skuCustomerAttributeGroupParam,99999);
        this.data.skuCustomerAttributeGroupParam=this.skuCustomerAttributeGroupParam
       //////////////////自定义参数组
       //////////////////属性组
        for (let i = 0; i < this.skuAttributeGroupList.length; i++) {
          const item = this.skuAttributeGroupList[i];
           for(let j=0;j<item.skuAttributeList.length;j++){
             const kk=item.skuAttributeList
             for(let gg=0;gg<kk.length;gg++){
               const itemgg=kk[gg]
               if(itemgg.valueType==5){
                 itemgg.attributeValue=itemgg.attributeValueList.join(',');
               }
             }
           }
        }
        this.data.skuAttributeGroupList=this.skuAttributeGroupList
        ///////////////属性组
        editerGoodsSecond(this.data).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:'保存至草稿成功',
              type:'success'
            })
            this.pictureID=res.data.id
            this.data.skuId=res.data.id
            setTimeout(()=>{
            //  this.$router.push({name:'GoodsManage'})
            this.close()
             window.localStorage.setItem('GOODS_LIST',Date.now())
            },1000)

          }else {
            this.$message({
              message:'保存至草稿失败,请重新保存',
              type:'error'
            })
          }
        })
      },
      gotoThree(){
        /////////////////////自定义参数组
        for (let i = 0; i < this.skuCustomerAttributeGroupParam.length; i++) {
          const item = this.skuCustomerAttributeGroupParam[i];
          for (let j = 0; j < item.options.length; j++) {
            const itemElement = item.options[j];
            if (item.attributeGroupName === itemElement.attributeGroupName) {
              item.attributeGroupId = itemElement.attributeGroupId
            }
          }
          if(item.valueType==5){
          item.attributeValue=item.attributeValue.join(',')
         }
        }
        this.data.skuCustomerAttributeGroupParam=this.skuCustomerAttributeGroupParam;
        //////////////////////////自定义参数组
        //////////////////属性组
        for (let i = 0; i < this.skuAttributeGroupList.length; i++) {
          const item = this.skuAttributeGroupList[i];
           for(let j=0;j<item.skuAttributeList.length;j++){
             const kk=item.skuAttributeList
             for(let gg=0;gg<kk.length;gg++){
               const itemgg=kk[gg]
               if(itemgg.valueType==5){
                 itemgg.attributeValue=itemgg.attributeValueList.join(',');
               }
             }
           }
        }
        this.data.skuAttributeGroupList=this.skuAttributeGroupList
        ///////////////属性组
        this.data.skuId=this.pictureID;
        editerGoodsSecond(this.data).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:'保存至草稿成功,去填写下一步',
              type:'success'
            })
            this.pictureID=res.data
            this.data.skuId=res.data.id
            setTimeout(()=>{
              // const {href}=this.$router.resolve({
              //   name:'EditerGoodsPicture',
              //   query:{
              //     pictureID:this.pictureID
              //   }
              // })
              // window.open(href)
              this.$router.push({name:'EditerGoodsPicture',query:{ pictureID:this.pictureID}})
              window.localStorage.setItem('GOODS_LIST',Date.now())
            },1000)
          }else {
            this.$message({
              message:'保存至草稿失敗,請重新保存',
              type:'error'
            })
          }
        })
      },
      onChange(val){
      },
      handleAvatarSuccess(res, file) {
        if(res.code == '000000') {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.$message({
            message: '图片上传成功',
            type: 'success'
          });
          this.addData.fileId.push(res.data.id)
          console.log(this.addData.fileId)
        } else {
          this.$message.error('图片上传失败');
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.name.split(".")[1] === "jpg";
        const isPNG = file.name.split(".")[1] === "png";
        const isPDF = file.name.split(".")[1] === "pdf";
        const isLt2M = file.size / 1024 / 1024 < 0.5;
        if(!isLt2M){
          this.$message({
            message: '上传图片大小不得超过500kb',
            type: 'error'
          })
          return false
        }
        if(!(isJPG || isPNG || isPDF )) {
          this.$message({
            message: '上传图片只能是 JPG PNG PDF格式!且不超过500kb',
            type: 'error'
          })
          return false;
        }
        return (isJPG ||isPNG ||isPDF )&&isLt2M
      },
      handleChange(file, fileList) {
        this.fileList = fileList;
      },
      handleRemove(file, fileList) {        //删除文件
        deleteFileDelete(
          file.id
        ).then((res) => {
          if (res.data == '1') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.addData.fileId = this.addData.fileId.filter(item => {
              return item!=file.id;
            });
            console.log(file, fileList);
            console.log(this.addData.fileId );
          } else{
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
        })
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //添加自定义参数
      addDomain() {
        let a = JSON.parse(JSON.stringify(this.options))
        this.skuCustomerAttributeGroupParam.push({
          options:JSON.parse(JSON.stringify(a)),
          attributeName:'',
          attributeValue:'',
          attributeId:0,
          attributeGroupId:''
        });
        console.log(this.skuCustomerAttributeGroupParam,666666)
      },
      //点击删除
      handleDelete(index, row) {
        console.log(row,88888888888888);
        this.skuCustomerAttributeGroupParam.splice(index,1);
      },
    }

  }
</script>
<style scoped lang="less">
  @tableBorderColor:#e4e4e4;
  .detaillBox{
    width: 100%;
    padding-top: 10px;
    .detaillTable{
      border: 1px solid #d1d1d1;
      table{
        width:90%;
        margin:20px auto;
        td,th{
          border: 1px solid #d1d1d1;
          font-size:14px;
          height:53px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        th{
          padding-right:6px;
          box-sizing: border-box;
          color:#666;
          font-weight:700;
          font-size: 14px;
          text-align: right;
          width:20%;
          i{
            color:red;
          }
        }
        td{
          color: #666666;
          text-align: left;
          padding-left:10px;
          width:30%;
        }
      }
    }
    .detaillTable2{
      border: 1px solid #d1d1d1;
      border-top:none;
      padding-bottom: 20px;
      .group-name{
        width: 100%;
        height: 60px;
        text-indent: 30px;
        line-height: 60px;
        font-size: 16px;
        color: #666;
      }
      .form-wrapper{
        width: 90%;
        border: 1px solid #d1d1d1;
        margin: 0 auto;
        padding-top:20px;
        box-sizing: border-box;
        .form-box{
          .el-input{
            width: 40%;
          }
          .el-textarea{
            width: 40%;
          }
        }
      }
      .updateBox{
        margin-left: 0px !important;
      }
      .el-table {
        margin:20px auto;
        width:90%;
        .el-button {
          font-size: 12px;
        }
      }
      .el-button {
        float: left;
        margin:10px 20px;
      }
    }
  }
  .box-footer{
    border: 1px solid #e4e4e4;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    //align-items: center;
    .el-table{
      margin: 20px 0;
    }
    .button-box{
      display: flex;
      justify-content: center;
      padding:10px 5%;
      box-sizing: border-box;
      width: 100%;
      .el-button{
        margin-left: 10px;
      }
    }
  }
</style>





