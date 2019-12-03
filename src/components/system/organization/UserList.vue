<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button size="small" class="active">在职（{{headers}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="iconfont iconsousuo"></i>筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="iconfont icon-top" v-show="isShow"></i>
            <i class="iconfont icon-xia" v-show="!isShow"></i>
            {{isShow?screenGoods:screenBrand}}</span>
          <el-button size="small" class="w80 h40" @click="queryBrand()">查询结果</el-button>
        </div>
      </div>
      <div class="homeBoxBottom" v-if="isShow">
        <span>用户ID：</span>
        <el-input
          placeholder="用户ID"
          v-model="findInplaceUserListParam.id"
          clearable>
        </el-input>
        <span>真实姓名：</span>
        <!--<el-select v-model="findInplaceUserListParam.realName" placeholder="真实姓名">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>-->
        <el-input
          placeholder="真实姓名"
          v-model="findInplaceUserListParam.realName"
          clearable>
        </el-input>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span><i class="iconfont iconjinridingdanshu"></i>数据列表</span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="addBrandList()">
            <i class="iconfont icon-icon-test"></i>添加</div>
        </div>

        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small">
          <el-table-column
            prop="id"
            label="用户ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="username"
            label="登录名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="realName"
            label="真实姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="所属组织机构"
            align="center">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="telephone"
            label="电话号码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="lastLoginTime"
            label="上次登录时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="上次登录IP"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="启用状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="skuCount"
            label="角色设置" align="center">
            <template slot-scope="scope">
              <el-button type="text">角色设置</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑
              </el-button>
              <el-button type="text" size="small"  @click="toBrandDetail(scope.row)">详情</el-button>
              <el-button type="text" size="small" @click="isToForbid(scope.row)" v-if="scope.row.status==0">禁用</el-button>
              <el-button type="text" size="small" @click="isToForbid(scope.row)" v-if="scope.row.status==1">启用</el-button>
              <el-button type="text" size="small"  @click="isQuit(scope.row)">离职</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="findInplaceUserListParam.pageNum"
          :page-size="findInplaceUserListParam.pageSize"
          layout="total,prev, pager, next, jumper"
          :total="paginations.total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="禁用提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>禁用之后，用户将无法登录后台，确定要禁用吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="toForbid()">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="离职提示"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <span>设置离职之后，用户将永久禁用，确定要设置离职吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="quit()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>


<script>
  import store from '@/store/store';
  import {getUserList,getUserCount,toNoUser,toQuit} from '@/api/organizationManage'
  import {timeFormat} from '@/utils/index'

  export default {
    inject: ['reload'],
    data() {
      return {
        dialogVisible:false,
        dialogVisible1:false,
        headers: null,
        //禁用id
        forbidID:'',
        //离职id
        quitID:'',
        isActive: 0,
        isShow: true,
        screenGoods: '收起筛选',
        screenBrand: '展开筛选',
        //options: [],
        tableData: null,
        paginations: {
          total: 100,//总数
        },
        //查询在职列表信息的参数
        findInplaceUserListParam:{
          departmentId:'',
          id:'',
          pageNum:1,
          pageSize:10,
          realName:'',
          status:''
        },
      }
    },
    computed:{
    },
    created() {
      //获取按钮的状态和数量
      this.getUserStaus();
      //获取表格数据
      this.getTableData();
    },
    methods: {
      //获取表格数据
      getTableData(){
        getUserList(this.findInplaceUserListParam).then(res=>{
              this.tableData=res.data.items;
              this.tableData.forEach(item=>{
                item.lastLoginTime=timeFormat(item.lastLoginTime)
              })
              this.paginations.total=res.data.total;
        })
      },
      //禁用
      toForbid(row){
        this.forbidID=row.id
        this.dialogVisible=true;
      },
      //是否禁用
      isToForbid(){
        toNoUser(this.forbidID).then(res=>{
         if(res.data==0){
           this.$message({
             message:'禁用成功',
             type:'success'
           })
           this.dialogVisible=false
         }
        })
      },
      //是否离职
      isQuit(row){
         this.dialogVisible1=true;
         this.quitID=row.id;
      },
      //离职
      quit(){
        toQuit(this.quitID).then(res=>{
          if(res.data==0){
            this.$message({
              message:'离职成功',
              type:'success'
            })
            this.dialogVisible1=false
          }
        })
      },
      //点击查询结果
      queryBrand(){
        this.findInplaceUserListParam.pageNum=1;
        this.getTableData();
      },
      //获取按钮的状态和数量
      getUserStaus(){
        getUserCount().then(res=> {
          this.headers = res.data;
        });
      },
      //跳转到编辑页
      handleClick(row) {
        const {href}=this.$router.resolve({
          name:'EditorBrand',
          query:{
            id:row.id,
          }
        })
        window.open(href,'_blank')
      },
      handleCurrentChange(val) {
        console.log(val);
        this.findInplaceUserListParam.pageNum=val;
        this.getTableData();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      //筛选按钮
      showHelp() {
        this.isShow = !this.isShow;
      },
      //跳转详情
      toBrandDetail(row) {
        const {href} = this.$router.resolve({
          name: 'BrandDetail',
          query: {
            dedetailId: row.id,
          }
        })

        window.open(href,'_blank')
      },
      //跳转到添加品牌页
      addBrandList(){
       /* const {href}=this.$router.resolve({
          name:'addUser',
        })
        window.open(href,'_blank')*/
      },
      //跳转到审核详情页
      auditBrandDetail(row){
        const {href}=this.$router.resolve({
          name:'BrandAudit',
          query:{
            id:row.id
          }
        })
        window.open(href,'_blank');
      },
    }
  }
</script>


<style scoped lang="less">
  .brandBox {
    width: 100%;
    clear: both;
    .buttonBox {
      margin-top: 10px;
      .el-button {
        width: 160px;
        height: 30px;
      }
      .active{
        background: #339999;
        color: #fff;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin: 10px 0;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        color: #303133;
      }
      .rightBox {
        float: right;
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        height: 56px;
        border-top: 1px solid #e4e4e4;
        margin-top: -2px;
        .el-input {
          width: 200px;
          height: 40px;
          line-height: 56px;
          margin-left: 10px;
        }
        .el-select{
          margin-left: 10px ;
        }
      }
    }
    .listBox {
      /*height: 50px;*/
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      line-height: 50px;
      .listBoxTop {
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #303133;
        }
      }
      .listBoxRight {
        float: right;
        margin-right: 10px;
        .white-btn{
          margin-top: 10px;
          margin-right: 10px;
        }
      }
      .el-table {
        margin-top: -2px;
        .el-button {
          font-size: 12px;
        }
      }
    }
    .block {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>










