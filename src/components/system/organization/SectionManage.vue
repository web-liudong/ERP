<template>
  <div class="brandBox">
    <div class="buttonBox">
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div style="border-bottom: 1px solid #e4e4e4;">
          <span style="line-height: 50px;cursor: pointer;color: #339999" @click="updateTable()">
            {{tableData1.organizationName}}</span><span style="line-height: 50px;cursor: pointer;color: #339999" v-for="(item) in tableData1.departmentTitleDTO" :key="item.key" @click="updateTable1(item.id)"><i style="color: #339999">></i>{{item.name}}</span>
        </div>
        <span><i class="iconfont iconjinridingdanshu"></i>数据列表</span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="getTreeData()" style="width: 120px"><i class="iconfont iconsousuo"></i>整体部门预览</div>
          <div class="white-btn fun-btn" @click="addSection()" style="width: 100px">
            <i class="iconfont icon-icon-test"></i>添加部门</div>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          size="small"
        class="tableBox">
          <el-table-column
            prop="id"
            label="部门ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="部门名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="description"
            label="部门描述"
            align="center">
          </el-table-column>
          <el-table-column
             prop="managerMsgList"
             label="部门负责人"
             align="center"
             width="200px">
            <template slot-scope="scope">
                       <tr style="text-align: center;display: table" v-for="item in scope.row.managerMsgList" :key="item.id">
                {{item.userName}}-{{item.realName}}</tr>
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="相关" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="gotoUserList(scope.row)">人员：{{scope.row.num}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toSectionDetail(scope.row)">详情</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" :disabled="scope.row.num!=0" @click="delBrandID(scope.row)">删除</el-button>
              <el-button type="text" size="small" v-if="!scope.row.last"  @click="getLastSection(scope.row)">下级部门</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="findDepartmentListParam.pageNum"
          :page-size="findDepartmentListParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="paginations.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="删除提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>删除之后，列表将不再展示该条数据，确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="isDelBrandID()">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="人员架构"
      :visible.sync="dialogVisible1"
      width="30%" v-el-drag-dialog>
      <div style="display: flex; flex: 1">
        <div style="width: 100px;height: 40px"><span style="line-height: 40px">机构名称：</span></div>
        <el-input type="text" v-model="tableData1.organizationName" readonly></el-input>
      </div>

      <div style="height: 50px;background: #e4e4e4;margin-top: 10px"><span style="line-height: 50px;margin-left: 20px">部门/人员信息</span></div>
      <el-tree
        ref="tree"
        :data="data2"
        node-key="id"
        render-after-expand
        @check="getnode()"
        :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{node,data}">
          <span>{{node.label}}</span>
          <span>({{data.count}})</span>
        </span>
      </el-tree>
      <div style="margin-left:10px" v-for="item in data5" :key="item.id">[{{item.realName}}] - {{item.post}}</div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import store from '@/store/store';
  import {getSectionInfoList,deleteSectionInfo,previewSectionTree} from '@/api/organizationManage'
  import elDragDialog from '@/directive/el-dragDialog'
  export default {
    inject: ['reload'],
    name:'SectionManage',
    data() {
      return {
        data2:[],
        data5:[],
        defaultProps: {
          children: 'subDepartment',
          label: 'name',
          count:'count'
        },
        //部门列表
        departmentListTitleDTO:null,
        //组织机构ID
        ID:null,
        organizationName:null,
        dialogVisible1:false,
        dialogFormVisible:false,
        dialogVisible:false,
        tableData: null,
        //表头数据
        tableData1: {
          departmentTitleDTO:null,
          organizationId:null,
          organizationName:null
        },
        //查询部门信息列表
        findDepartmentListParam:{
          organizationId:null,
          id:0,
          pageSize:10,
          pageNum:1
        },
        paginations: {
          total: 100,//总数
        },
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        delBrandID1:'',
        //删除品牌id
        managerMsgList:null
      }
    },
    computed:{
    },
    created() {
      this.ID=this.$route.query.sectionID;
      this.findDepartmentListParam.organizationId=this.$route.query.sectionID;
      this.organizationName=this.$route.query.organizationNameId;
      //获取表格数据
      this.getTableData()
    },
    activated(){
     if(this.ID!=this.$route.query.sectionID){
       this.findDepartmentListParam.organizationId=this.$route.query.sectionID;
       this.organizationName=this.$route.query.organizationNameId;
       this.ID=this.$route.query.sectionID;
       this.getTableData()
     }
     if(this.$route.params.isUpdate){
       this.getTableData()
     }
    },
    directives:{
      elDragDialog
    },
    methods: {
      //整体部门预览
      getTreeData(){
        this.dialogVisible1=true
        previewSectionTree(this.findDepartmentListParam.organizationId).then(res=>{
           this.data2=res.data.departmentStructures 
           this.recursion(this.data2)
          this.data5=res.data.organizationDirectUsers
        })
      },
      recursion(arr){
      arr.forEach(child => {
        if(child.subDepartmentUserDTOs){
          child.subDepartment=[...child.subDepartment,...child.subDepartmentUserDTOs.map(item=>{
            return {name:item.realName,count:item.post}
          })]
        }
        if(child.subDepartment){
          this.recursion(child.subDepartment);
        }
      })
    },
      //点击下级部门获取列表
      getLastSection(row){
        this.findDepartmentListParam.id=row.id;
        this.getTableData();
      },
      //去相关用户列表
      gotoUserList(row){
      // const {href}=this.$router.resolve({
      //   name:'SystemList',
      //   query:{
      //     organizationID:this.ID,
      //     organizationName:this.organizationName,
      //     sectionID:row.id,
      //     sectionName:row.name
      //   }
      // })
      //   window.open(href,'_blank')
        this.$router.push({name:'SystemList',query:{organizationID:this.ID,organizationName:this.organizationName,sectionID:row.id,sectionName:row.name}})
      },
      //更新列表
      updateTable(){
        this.findDepartmentListParam.organizationId=this.tableData1.organizationId
        this.findDepartmentListParam.id=0
        this.getTableData();
      },
      updateTable1(id){
        this.findDepartmentListParam.id=id
        this.getTableData();
      },

      getnode(data) {
        let yeziId = this.$refs.tree.getCheckedKeys(true)
        let idArr = this.$refs.tree.getCheckedKeys()
        let i = this.$refs.tree.getCheckedNodes(true,true)
        this.options=i
      },

      //获取表格数据
      getTableData(){
        getSectionInfoList(this.findDepartmentListParam).then(res=>{
          this.paginations.total=res.data.departmentListDetailDTOList.total;
          this.tableData=res.data.departmentListDetailDTOList.items;
          this.tableData1=res.data.departmentListTitleDTO;
        })
      },
      //跳转到编辑页
      handleClick(row) {
        // const {href}=this.$router.resolve({
        //   name:'EditerSection',
        //   query:{
        //      id:row.id,
        //      organizationID:this.ID
        //   }
        // })
        // window.open(href,'_blank')
        this.$router.push({name:'EditerSection',query:{id:row.id,organizationID:this.ID}})

      },
      handleCurrentChange(val) {
        console.log(val);
        this.findDepartmentListParam.pageNum=val;
        this.getTableData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.findDepartmentListParam.pageSize=val;
        this.getTableData()
      },
      //跳转详情
      toSectionDetail(row) {
        // const {href} = this.$router.resolve({
        //   name: 'SectionDetail',
        //   query: {
        //     delId: row.id,
        //   }
        // })
        // window.open(href,'_blank')
         this.$router.push({name:'SectionDetail',query:{delId:row.id}})
      },
      //删除按钮
      delBrandID(row){
        this.delBrandID1=row.id;
        this.dialogVisible=true;
      },
      //是否删除
      isDelBrandID(){
        deleteSectionInfo(this.delBrandID1).then((res)=>{
          if(res.data=='1'){
            this.$message({
              message:'删除成功',
              type:'success',
            });
            this.dialogVisible=false
          }else if(res.data=='0'){
            this.$message({
              message:'删除失败',
              type:'warning',
            });
            this.dialogVisible=false;
          }
         this.getTableData();
        })
      },
      //跳转到添加部门页
      addSection(){
        // const {href}=this.$router.resolve({
        //   name:'AddSection',
        //   query:{
        //     addID:this.tableData1.organizationId,
        //     addName:this.tableData1.organizationName
        //   }
        // })
        // window.open(href,'_blank')
        this.$router.push({name:'AddSection',query:{addID:this.tableData1.organizationId,addName:this.tableData1.organizationName}})
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


<style lang="less" scoped>
  .brandBox{
    .listBox{
      .listBoxTop{
        .tableBox{
         .cell{
           tr{
             margin: 0 auto;
           }
         }
        }
      }
    }
    .el-dialog__header{
      padding: 10px;
      padding-bottom: 0;
      background: #E4E4E4;
      height: 40px;
      line-height: 40px;
    }
  }


</style>









