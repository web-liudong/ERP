<template>
	<el-form ref="ruleForm" label-width="160px" class="demo-ruleForm">
<div class="aBox">
  <addhead headname="编辑公告消息"></addhead>
  <div class="" style="box-sizing: border-box;padding: 30px 0 30px 50px;">
  	<p style="padding-bottom: 20px;">消息标题：<el-input type="text" v-model="messageTitle" style="width: 500px;" disabled></el-input> </p>
  	<p>选择接受人：
  		<span v-show="nodeArr.length>0">{{nodeArr[0]?nodeArr[0].label:''}}等({{nodeArr.length}}人)&nbsp;
  			<i class="el-icon-close" style="cursor: pointer;" @click="deleteBrand()"></i>
  		</span>  
  		<el-button  type="text" size="small" @click="dialogVisibleclose=true">选择接受人</el-button>
  	</p>
  </div>
</div>
<div class="a" style="box-sizing: border-box;padding: 10px;">
	<p style="line-height: 50px;">消息内容：</p>
	<div class="" style="position: relative;">
		<quill-editor 
      v-model="content" 
      ref="myQuillEditor" 
      :options="editorOption" 
      :disabled="disabled"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
   </quill-editor>
   <div id="" style="position: absolute;width: 100%;height: 100%;background: rgba(0,0,0,0.3);top: 0px;z-index: 1;display: flex;justify-content: center;align-items: center;">
   </div>
	</div>
</div>
<div class="clearfix" style="text-align: center;">
	<el-button >取 消</el-button>
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
		updateAndPush,
		noticePush
	} from '@/api/noticeService/noticeService'
  import addhead from '@/components/common/head/head'
  import { quillEditor } from 'vue-quill-editor'
  import { addQuillTitle } from './quill-title.js'
  export default {
  	name:'advertiseMessagepush',
  	inject:['close'],
    data() {
      return {
      	nodeArr:[],
      	defaulttree:[],
      		disabled:true,
      	receiveUsers:[],
      	messageTitle:'',
      	content:'',
        editorOption:{},
      	dialogVisibleclose:false,
        comindex:0,
        treeData:[],
        visible:false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        detailId:''
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
    	isclose(){
    		window.close()
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
				        		name:'advertiseMessagepush',
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
    			noticePush(a,this.$route.query.detailId).then(res=>{
						this.$message({
					        message:'操作成功',
					        type: "success",
					      })
						this.close({
				        		name:'advertiseMessagepush',
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
