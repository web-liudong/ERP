<!--填写参数信息--><template>
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
          <el-form ref="form" :model="form" label-width="260px" class="form-box" v-for="(attr,i) in item.skuAttributeList" :key="i">
            <el-form-item :required="attr.required==1" :label="attr.attributeName"  v-if="attr.valueType==0">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input v-model="attr.attributeValue"  :placeholder="`${attr.maxLength}位以内数字`" :minlength="attr.required?1:0" :maxlength="attr.maxLength">
                <template slot="append" v-if="attr.options">{{attr.options}}</template>
              </el-input>
            </el-form-item>
            <!--<el-form-item required v-show="attr.valueType==0">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input v-model="form.num" placeholder="长度1-10以内" type="number" :maxlength="attr.maxLength">
                <template slot="append" v-if="attr.options">{{attr.options}}</template>
              </el-input>
            </el-form-item>-->
            <el-form-item :required="attr.required==1" :label="attr.attributeName" v-if="attr.valueType==1&&!/(http|https):\/\/([\w.]+\/?)\S*/.test(attr.attributeValue)">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input v-model="attr.attributeValue" :placeholder="`${attr.maxLength}位以内数字`" :minlength="attr.required?1:0" :maxlength="attr.maxLength"></el-input>
              <span style="color:red;font-size:16px" v-if="attr.attributeId==0">自定义属性</span>     
            </el-form-item>
            <el-form-item :required="attr.required==1" :label="attr.attributeName" v-if="attr.valueType==1&&/(http|https):\/\/([\w.]+\/?)\S*/.test(attr.attributeValue)">
              <span slot="label">{{attr.attributeName}}：</span>
              <a :href="attr.attributeValue">{{attr.attributeValue}}</a>
              <!-- <el-input v-model="attr.attributeValue" :placeholder="`${attr.maxLength}位以内数字`" :minlength="attr.required?1:0" :maxlength="attr.maxLength"></el-input> -->
              <span style="color:red;font-size:16px" v-if="attr.attributeId==0">自定义属性</span>     
            </el-form-item>
         <!--   <el-form-item required v-show="attr.valueType==1">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input placeholder="长度1-10以内" :value="attr.attributeValue" @change="onChange" :maxlength="attr.maxLength"></el-input>
            </el-form-item>-->
            <el-form-item  :required="attr.required==1" v-show="attr.valueType==2">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-input :placeholder="`${attr.maxLength}位以内数字`" type="textarea" rows="5" v-model="attr.attributeValue" :minlength="attr.required?1:0" :maxlength="attr.maxLength"  ></el-input>
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==3">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-select v-model="attr.attributeValue" placeholder="请选择级别" style="width: 530px">
                <el-option :label="option.label" :value="option.value" v-for="(option,ind) in attr.optionsList" @change="changeValue" :key="ind"></el-option>
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
              <el-radio-group v-model="attr.attributeValue" v-for="(i,index) in attr.optionsList" :key="index" style="margin-right:20px">
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
              <el-checkbox-group  v-model="attr.attributeValueList">
                <el-checkbox :label="option" v-for="(option,ind) in attr.optionsList" :key="ind"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==6">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-date-picker type="date" placeholder="选择年月日" v-if="attr.options==3" value-format="yyyy-MM-dd" v-model="attr.attributeValue" style="width: 40%;"></el-date-picker>
              <el-date-picker type="month" placeholder="选择月" v-if="attr.options==2" value-format="yyyy-MM" v-model="attr.attributeValue" style="width: 40%;"></el-date-picker>
              <el-date-picker type="year" placeholder="选择年" v-if="attr.options==1" value-format="yyyy" v-model="attr.attributeValue" style="width: 40%;"></el-date-picker>
            </el-form-item>
            <el-form-item :required="attr.required==1" v-show="attr.valueType==7">
              <span slot="label">{{attr.attributeName}}：</span>
              <el-upload
                class="upload-demo"
                action="/api/file-service/file/upload?type=Authorization"
                :headers="headertoken"
                :on-change="(file,fileList)=>handleChange(file,fileList,index,i,'list')"
                :on-success="(res,file)=>handleAvatarSuccess(res,file,index,i,'list')"
                :before-upload="function(file){
                  if(attr.optionsList.includes(file.name.split('.')[1].toUpperCase())){
                    
                  }else{
                   this.$message({
                    message: `上传文件的格式不正确`,
                    type: 'error'
                   })  
                   return false
                  }
                  if(file.size / 1024 / 1024 > attr.maxLength){
                  let count=attr.maxLength;
                   this.$message({
                    message: `上传文件的大小不能超过${count}M`,
                    type: 'error'
                   })  
                   return false
                  }
                }"
                multiple
                :limit="1"
                name="fileName"
                :on-remove="(file,fileList)=>handleRemove(file,fileList,index,i,'list')"
                style="width: 25%;"
                :file-list="attr.fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">支持{{attr.options}}格式文件，大小不超过{{attr.maxLength}}M</div>
              </el-upload>
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
          width="200" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.attributeName" @input="(query)=>inputAttribute(query,scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="参数值"
          width="200" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.attributeValue" v-show="!scope.row.isIf"></el-input>
            <el-upload
                class="upload-demo"
                action="/api/file-service/file/upload?type=Authorization"
                :headers="headertoken"
                :on-change="(file,fileList)=>handleChange(file,fileList,scope.$index,0,0)"
                :on-success="(res,file)=>handleAvatarSuccess(res,file,scope.$index,0,0)"
                :limit="1"
                name="fileName"
                v-show="scope.row.isIf"
                :show-file-list="false"
                :on-remove="(file,fileList)=>handleRemove(file,fileList,index,i,'list')"
                style="width: 25%;"
                :file-list="fileList">
                <el-button size="small" type="primary" style="margin-left:50px" v-if="!scope.row.attributeValue">点击上传</el-button>
              </el-upload>
              <a :href="scope.row.attributeValue" target="_blank" style="color:#339999;" v-if="scope.row.isIf&&scope.row.attributeValue">{{scope.row.attributeValue}}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="success"
              @click="handleFile(scope.$index, scope.row)">文件</el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="button-box">
        <!-- <router-link :to="{name:'AddGoods'}"><el-button type="primary">返回上一页</el-button></router-link> -->
        <el-button type="primary" @click="openWin()">返回上一页</el-button>
        <el-button type="primary" @click="submitForm()">保存至草稿</el-button>
        <el-button type="primary" @click="gotoThree()">保存并填写下一步</el-button>
        <el-button @click="close()" class="success" type="primary">关闭</el-button>
        <el-button type="primary" v-backTop>回顶部</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "@/utils/request";
  import addhead from '@/components/common/head/head'
  import {template,templateLog} from '@/api/classManage'
  import {skuAttributeParameterInfoParam ,getGoodsSecond,addGoodsSecond} from '@/api/goodsManage';
  import {deleteFileDelete} from "@/api/common/commonApi"
  import {addURL} from "@/utils/index"
import { Promise } from 'q';
  export default {
    inject:['close'],
    name:'FillParams',
    data(){
      const cityOptions=null
      return {
        //属性组
        skuAttributeGroupList:null,
        headertoken:{'Authorization':'Bearer '+this.$auth.token},
        form:{},
        AddID:null,
        imageUrl:null,
        addData:{fileId:[]},
        fileList:[],
        radio:[],
        checkList:[],
        options:[],
        data:null,
        city:cityOptions,
        //自定义参数组
        skuCustomerAttributeGroupParam:[],
      }
    },
    components:{
      addhead
    },
    created(){
      this.AddID=this.$route.query.goodsID;
      this.getData();
    },
    activated(){
      if(this.$route.query.goodsID&&this.AddID!=this.$route.query.goodsID){
        this.AddID=this.$route.query.goodsID;
        this.getData()
      }
    },
    methods: {
        inputAttribute(query,row){
         this.skuAttributeGroupList.forEach((item,i)=>{
           if(item.attributeGroupName==row.attributeGroupName){
             item.skuAttributeList.forEach((gg,index)=>{
               if(gg.attributeName==query){
                  this.$message({
                    message:"当前参数组下参数名称重复",
                    type:'error'
                  })
                  row.attributeName=null
               }
             })
           }
         })
        },
       handleAvatarSuccess(res, file,index,i,type) {
        if(res.code == '000000') {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.$message({
            message: '图片上传成功',
            type: 'success'
          });
          if(type=='list'){
          this.skuAttributeGroupList[index].skuAttributeList[i].attributeValue=res.data.id;
          }else{
            this.skuCustomerAttributeGroupParam[index].attributeValue=addURL(res.data.path);
          }
        } else {
          this.$message.error('图片上传失败');
        }
      },
      beforeAvatarUpload(file,type,count) {
        let isPNG=false,isJPG=false,isPDF=false,isJPEG=false;
        for(let i=0;i<type.length;i++){
          if(type[i]=='PNG'){
             isPNG=file.name.split('.')[1]==='png'
          }else if(type[i]=='JPG'){
             isJPG=file.name.split('.')[1]==='jpg'
          }else if(type[i]=='PDF'){ 
             isPDF=file.name.split('.')[1]==='pdf'
          }else if(type[i]=='JPEG'){
             isJPEG=file.name.split('.')[1]==='jpeg'
          }
        }     
        const isLt2M = file.size / 1024 / 1024 < count;
        if(!isLt2M){
          this.$message({
            message: `上传图片大小不得超过${count}M`,
            type: 'error'
          })
          return false
        }
        let typeString=type.join(',')
        if(isPNG||isPDF||isJPG||isJPEG) {
          this.$message({
            message: `上传图片只能是${typeString}格式!且不超过${count}M`,
            type: 'error'
          })
          return false
        }
        return (isJPG ||isPNG ||isPDF||isJPEG )&&isLt2M    
      },
      handleChange(file, fileList,index,i,type) {
        if(type=='list'){
        this.skuAttributeGroupList[index].skuAttributeList[i].fileList = fileList;
        }else{
          this.$set(this.skuCustomerAttributeGroupParam[index],'fileList',fileList)
          // this.skuCustomerAttributeGroupParam[index].attributeValue=fileList
        }
      },
      handleRemove(file, fileList,index,i,type) {        //删除文件
      if(type=='list'){
      this.skuAttributeGroupList[index].skuAttributeList[i].fileList = fileList;
      }else{
        this.skuCustomerAttributeGroupParam[index].fileList=fileList;
      }
      },
      getList(id){
        templateLog(id).then(res=>{
          if(res.code=='000000'){
            this.skuCustomerAttributeGroupParam = res.data;
          }
        })
      },
      //选中值
      changeValue(){
      },
      openWin(){
        this.close({name:'FillParams',to:{name:'EditerGoods',query:{editerID:this.AddID,isActive:2},params:{isUpdate:true}}})
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
                }else if(g.valueType==3){
                  g.optionsList=g.optionsList.map((item)=>{
                     return {value:item,label:item}
                  })
                }else if(g.valueType==7){
                  this.$set(g,'fileList',[])
                }
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
      uploadFile(options) {
      let fd = new FormData(),
       url = '/api/file-service/file/upload?type=Authorization';
       fd.append("fileName", options.file, options.file.name);
       let res = request({
        url: url,
        method: "post",
        data: fd
      });
      return res;
       },
      //保存至草稿
      submitForm() {
        /////自定义参数组
        for (let i = 0; i < this.skuCustomerAttributeGroupParam.length; i++) {
          const item = this.skuCustomerAttributeGroupParam[i];
          for (let j = 0; j < item.options.length; j++) {
            const itemElement = item.options[j];
               if(item.attributeGroupName===itemElement.attributeGroupName){
                  item.attributeGroupId=itemElement.attributeGroupId
               }
          }
         if(item.valueType==5){
         item.attributeValue= item.attributeValueList.join(',')
         }     
        }
        ///////自定义参数组
        this.data.skuCustomerAttributeGroupParam=this.skuCustomerAttributeGroupParam     
        ////////////////属性组
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
        ////////////////属性组
        this.data.skuAttributeGroupList=this.skuAttributeGroupList;
        addGoodsSecond(this.data).then(res=>{
            if(res.code=='000000'){
               this.$message({
                 message:'保存至草稿成功',
                 type:'success'
               })  
              this.close({name:'FillParams',to:{name:'GoodsManage',params:{isUpdate:true}}})
            }else {
              this.$message({
                message:'保存至草稿失败,请重新保存',
                type:'error'
              })
            }
          })
      },
      gotoThree(){
        //////////////自定义参数组
        for (let i = 0; i < this.skuCustomerAttributeGroupParam.length; i++) {
          const item = this.skuCustomerAttributeGroupParam[i];
          for (let j = 0; j < item.options.length; j++) {
            const itemElement = item.options[j];
            if (item.attributeGroupName === itemElement.attributeGroupName) {
              item.attributeGroupId = itemElement.attributeGroupId
            }
          }
          if(item.valueType==5){
          item.attributeValue=item.attributeValueList.join(',')
         }
        }
        //////////////////自定义参数组
        this.data.skuCustomerAttributeGroupParam=this.skuCustomerAttributeGroupParam;
        ////////////////属性组
        console.log(this.skuAttributeGroupList,666667784312323)
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
        ////////////////属性组
        this.data.skuAttributeGroupList=this.skuAttributeGroupList
        addGoodsSecond(this.data).then(res=>{
          if(res.code=='000000'){
            this.$message({
              message:'保存至草稿成功,去填写下一步',
              type:'success'
            })
            // this.$router.push({name:'GoodsPicture',query:{pictureID:res.data}})      
            this.close({name:'FillParams',to:{name:"GoodsPicture",query:{pictureID:res.data},params:{isUpdate:true}}})
          }else {
            this.$message({
              message:'保存至草稿失敗,請重新保存',
              type:'error'
            })
          }
        })
      },
      //添加自定义参数
      addDomain() {
        this.$confirm('请选择需要添加自定义参数的类型', '提示', {
          confirmButtonText: '文件',
          cancelButtonText: '文本文字',
        }).then(()=>{
        let a = JSON.parse(JSON.stringify(this.options))
        this.skuCustomerAttributeGroupParam.push({
          options:JSON.parse(JSON.stringify(a)),
          attributeName:'',
          attributeValue:'',
          attributeId:0,
          attributeGroupId:'',
          isIf:true
        });
        }).catch(()=>{
        let a = JSON.parse(JSON.stringify(this.options))
        this.skuCustomerAttributeGroupParam.push({
          options:JSON.parse(JSON.stringify(a)),
          attributeName:'',
          attributeValue:'',
          attributeId:0,
          attributeGroupId:'',
          isIf:false
        });
        })
        
      },
      //点击删除
      handleDelete(index, row) {
        this.skuCustomerAttributeGroupParam.splice(index,1);
      },
      handleFile(index,row){
        this.skuCustomerAttributeGroupParam[index].isIf=!this.skuCustomerAttributeGroupParam[index].isIf
      }
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


