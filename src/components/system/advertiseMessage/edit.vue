<template>
	<el-form ref="ruleForm" label-width="160px" class="demo-ruleForm">
<div class="aBox">
  <addhead headname="编辑公告消息"></addhead>
  <div class="" style="box-sizing: border-box;padding: 30px 0 30px 50px;">
  	<p style="padding-bottom: 20px;">消息标题：<el-input type="text" v-model="messageTitle" style="width: 500px;" ref="input" autofocus="autofocus" ></el-input> </p>
  	<p>选择接受人：
  		<span v-show="nodeArr.length>0">{{nodeArr[0]?nodeArr[0].label:''}}等({{nodeArr.length}}人)&nbsp;
  			<i class="el-icon-close" style="cursor: pointer;" @click="deleteBrand()"></i>
  		</span>  
  		<el-button  type="text" size="small" @click="dialogVisibleclose=true">选择接受人</el-button>
  	</p>
  </div>
</div>
<div class="a" style="box-sizing: border-box;padding: 10px;margin-bottom: 60px;">
	<p style="line-height: 50px;">消息内容：</p>
	<div class="" style="position: relative;">
		<quill-editor 
			style="height: 400px;"
      v-model="content" 
      ref="myQuillEditor" 
      :options="editorOption" 
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
   </quill-editor>
   <el-upload class="upload-demo" 
   	name="fileName"
   	action="/api/file-service/file/upload"
   	:before-upload='beforeUpload' 
   	 :data="{type:'Notice_img'}"
   	 :headers="headertoken"
   	:on-success='upScuccess'
      ref="upload" 
      style="display:none">
      <el-button size="small" type="primary" id="imgInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
    </el-upload>
	</div>
   
</div>
<div class="clearfix" style="text-align: center;">
	<el-button @click="close()">取 消</el-button>
	<el-button type="primary" @click="preserveDraft()" >保存至草稿</el-button>
	<el-button type="primary" @click="preservePush()" >保存并推送</el-button>

</div>
<el-dialog
		  title="组织架构信息"
		  :visible.sync="dialogVisibleclose"
		  width="30%"
		  >
		  <div class="" style="height: 500px;overflow: auto;">
		  	<el-tree
          	ref="tree"
            :data="treeData"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaulttree"
            @check="getnode()"
            :props="defaultProps">
          </el-tree>		  	
		  </div>
		  <!--<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisibleclose = false">取 消</el-button>
		    <el-button type="primary" @click="isclose()">确 定</el-button>
		  </span>-->
</el-dialog>
</el-form>
</template>

<script>
	import {
		allInfoTree,
		noticeDetail,
		updateToDraft,
		updateAndPush
	} from '@/api/noticeService/noticeService'
  import addhead from '@/components/common/head/head'
  import { quillEditor } from 'vue-quill-editor'
  import { addQuillTitle } from './quill-title.js'
  export default {
  	name:'advertiseMessageedit',
  	inject:['close'],
    data() {
      return {
      	nodeArr:[],
      	defaulttree:[],
      	receiveUsers:[],
      	messageTitle:'',
      	content:'',
        editorOption:{
        	modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],     //引用，代码块
  
  
              [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
              [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
              [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
              [{ 'direction': 'rtl' }],             // 文本方向
  
  
              [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
  
  
              [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
              [{ 'font': [] }],     //字体
              [{ 'align': [] }],    //对齐方式
  
  
              ['clean'],    //清除字体样式
              ['image']    //上传图片、上传视频
  
            ]
          },
          theme:'snow'
        },
      	dialogVisibleclose:false,
        comindex:0,
        treeData:[],
        visible:false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        detailId:'',
        headertoken:{'Authorization':'Bearer '+this.$auth.token},
        uploadType:'',
        addRange: [],
        fullscreenLoading : false,
      };
    },
    components:{
      addhead,
      quillEditor
    },
    created(){
    	this.detailId=this.$route.query.detailId
    	this.gettree()
      noticeDetail(this.$route.query.detailId).then(res=>{
      	this.content=res.data.content
      	this.messageTitle=res.data.title
      })
    },
    activated(){
    		if(this.$route.query.detailId!=this.detailId){
    			this.gettree()
		      noticeDetail(this.$route.query.detailId).then(res=>{
		      	this.content=res.data.content
		      	this.messageTitle=res.data.title
		      })
    		}
    },
    watch:{
    	visible(a,b){
    		console.log(a)
    	}
    },
    mounted(){
    	addQuillTitle()
    	 this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
    },
    methods: {
    	onEditorBlur(a){//失去焦点事件
//  		console.log(a.container.innerHTML)
//				console.log(this.content)
      },
      onEditorFocus(){//获得焦点事件
      },
      onEditorChange(){//内容改变事件
      },
    	isclose(){
    		this.close()
    	},
    	beforeUpload(file) {
				const aPNG = file.name.split(".")
				const isJPG = file.type === "image/jpeg";
				const isPNG = aPNG[aPNG.length-1] === "png";
				const isLt2M = file.size / 1024 / 1024 < 5;
				if(!isLt2M){
					this.$message({
						message: '上传图片大小不得超过5M',
						type: 'error'
					})
					return false
				}
				if(!(isJPG || isPNG || isPDF )) {
					this.$message({
						message: '上传图片只能是 JPG PNG 格式!且不超过5M',
						type: 'error'
					})
					return false;
				}
				return (isJPG ||isPNG  )&&isLt2M
			},
			upScuccess(e, file, fileList) {
		    this.fullscreenLoading = false
		    let vm = this
		    console.log(window.location.protocol)
		    let url =  window.location.protocol+'/image'+e.data.path
//		    if (this.uploadType === 'image') {    // 获得文件上传后的URL地址
//		      url = STATICDOMAIN + e.key
//		    } else if (this.uploadType === 'video') {
//		      url = STATVIDEO + e.key
//		    }
		    if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
		      let value = url
		      vm.addRange = vm.$refs.myQuillEditor.quill.getSelection()
		      vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType,value )   // 调用编辑器的 insertEmbed 方法，插入URL
		    } else {
		      this.$message.error(插入失败)
		    }
		    this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
		  },
		  // 点击图片ICON触发事件
		  imgHandler(state) {
		    this.addRange = this.$refs.myQuillEditor.quill.getSelection()
		    if(state) {
		      let fileInput = document.getElementById('imgInput')
		      fileInput.click() // 加一个触发事件
		    }
		    this.uploadType = 'image'
		  },
      deleteBrand(){
      	this.nodeArr=[]
      	this.receiveUsers=[]
      	this.$refs.tree.setCheckedKeys([]);
      },
      gettree(){
      	allInfoTree().then(res=>{
      		this.treeData=res.data
      	})
      },
      getnode(data) {
//				let idArr = this.$refs.tree.getCheckedKeys()
				let idArrLeaf = this.$refs.tree.getCheckedKeys(true)
				let nodeArrLeaf = this.$refs.tree.getCheckedNodes(true)
				console.log(nodeArrLeaf)
				this.nodeArr=nodeArrLeaf
				this.receiveUsers=idArrLeaf
			},    	
    	preserveDraft(){
    		let a={
    			content:this.content,
    			receiveUsers:this.receiveUsers,
    			title:this.messageTitle,
    		}
    		if(!a.title){
    			this.$message({
					        message:'请输入标题',
					        type: "error",
					      })
    		}else if(!a.content){
    			this.$message({
					        message:'请输入公告消息内容',
					        type: "error",
					      })
    		}else{
    			updateToDraft(a,this.$route.query.detailId).then(res=>{
						this.$message({
					        message:'操作成功',
					        type: "success",
					      })
						this.close({
				        		name:'advertiseMessageedit',
				        		to:{
				        			name:'advertiseMessagelist',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
					})
    		}
    	},
    	preservePush(){
    		let a={
    			content:this.content,
    			receiveUsers:this.receiveUsers,
    			title:this.messageTitle,
    		}
    		if(!a.title){
    			this.$message({
					        message:'请输入标题',
					        type: "error",
					      })
    		}else if(a.receiveUsers.length==0){
    			this.$message({
					        message:'请选择接受人',
					        type: "error",
					      })
    		}else if(!a.content){
    			this.$message({
					        message:'请输入公告消息内容',
					        type: "error",
					      })
    		}else{
    			updateAndPush(a,this.$route.query.detailId).then(res=>{
						this.$message({
					        message:'操作成功',
					        type: "success",
					      })
						this.close({
				        		name:'advertiseMessageedit',
				        		to:{
				        			name:'advertiseMessagelist',
				        			params:{
				        				isUpdate:true
				        			}
				        		}
				        	})
					})
    		}
    	},
    }
  }
</script>

<style lang="less" scoped>
.el-tree-node__expand-icon{
		display: none;
	}
.el-form{
	
     color: #606266;
.aBox{
  border: 1px solid #e4e4e4;
  margin-top: 10px;
    .el-form{
      margin-left: 50px;
      padding-top:20px;
      .el-form-item{
        
        .el-input{
          width: 400px;
          height: 40px;
        }
        .tipBox{
          height: 20px;
          font-size: 12px;
          margin-left: 20px;
        }
    }

  }
    .listBox{
      /*width: 600px;*/
      box-sizing: border-box;
      .listLeftBox{
      	overflow: auto;
      	background-color: #FFFFFF;
      	border: 1px solid #e5e5e5;
        margin-right: 20px;
        width: 200px;
        height:300px;
       .headerBox{
         height: 35px;
         border: 1px solid #e4e4e4;
         span{
           color: red;
           line-height: 36px;
         }
       }
      }
      .listRightBox{
      	border: 1px solid #e5e5e5;
      	height:300px;
        width: 200px;
        overflow: auto;
        /*padding: 0 10px;*/
        .headerBox{
          height: 35px;
          border: 1px solid #e4e4e4;
          span{
            color: red;
            height: 36px;
            line-height: 36px;
          }
        }

      }
    }

}
}
</style>
