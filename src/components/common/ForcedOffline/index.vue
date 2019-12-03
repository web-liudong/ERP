<template>
  <div class="ForcedOffline">
    <el-dialog
		  :title="titleName?titleName:'提示'"
		  :visible.sync="dialogVisible"
		  width="30%"
		  @close="goLogin()"
			>
		  <span>{{message}}</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="goLogin()">确 定</el-button>
		  </span>
		</el-dialog>
		<!--<el-dialog
		  title="变更提示"
		  :visible.sync="dialogVisibleUpdata"
		  width="30%"
		  @close="goList()"
			>
		  <span>{{message}}</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="goList()">确 定</el-button>
		  </span>
		</el-dialog>-->
  </div>
</template>

<script>
		import router from '../../../router'
    export default {
      name: "DialogMessageTips",
      props:{
      	
      },
      data() {
        return {
          dialogVisible: false,
          path:'',
          message:'',
          titleName:''
        };
      },
      methods: {
      	goLogin(){
      		this.dialogVisible=false
      		if(this.path){
      			router.push(this.path)
      		}
      	},
      	goList(){
      		this.dialogVisibleUpdata=false
      		router.push(this.path)
      	}
      }
    }
</script>

<style scoped lang="less">
.dialogBox{
  .el-dialog{

   .el-dialog__body{
   }
  }


}

</style>
