<!-- 
左边setCheckedKeys方法（确定初始节点状态）；
右边filter方法（依据左侧筛选被选中节点并显示）；
this.$refs.tree.setCheckedKeys(arr);
this.$refs.tree2.filter(arr);
 -->
<template>
 <div class="orderManageBox">
   <div class="filterBox">
    <!-- 头部 -->
      <div class="homeBoxTop">
        <div class="head-left">
          <i class="iconfont iconsousuo"></i>
          <span>筛选查询</span>
        </div>
        <div class="rightBox">
          <i :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isShow=!isShow"></i>
          <span @click="isShow=!isShow">收起筛选</span>
          <el-button size="small" class="w80 h40" @click="reset()" style="margin-left:10px">重置</el-button>
          <el-button size="small" class="w80 h40" @click="checkCheck">查询结果</el-button>
        </div>
      </div>
      <!-- 身体 -->
      <el-collapse-transition>
      <div class="homeBoxBottom" v-show="isShow">
        <ul>
          <li>
        <!-- <span>派单员：</span>
        <el-input
          placeholder="派单员"
          v-model="selectId"
          clearable>
        </el-input> -->
        <span>派单员：</span>
          <el-select
            v-model="selectId"
            filterable
            remote
            placeholder="派单员"
            :remote-method="(query)=>{
            querySearch(query,'manager','remoteAssignUserList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteAssignUserList"
              :key="item.id"
              :label="item.userName+'-'+item.realName"
              :value="item.realName"
            ></el-option>
          </el-select>

          </li>
          <li>
        <!-- <span>所属组织结构：</span>
        <el-input
          placeholder="所属组织结构"
          v-model="organization"
          clearable>
        </el-input> -->
        <span>组织机构名称：</span>
          <el-select
            v-model="organization"
            filterable
            remote
            placeholder="组织机构名称"
            :remote-method="(query)=>{
            querySearch(query,'organization','remoteAssignOrganizationList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteAssignOrganizationList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          </li>
          <li>
        <!-- <span>操作人：</span>
        <el-input
          placeholder="操作人"
          v-model="name"
          clearable>
        </el-input> -->
        <span>操作人:</span>
          <el-select
            v-model="name"
            filterable
            remote
            placeholder="操作人"
            :remote-method="(query)=>{
            querySearch(query,'operator','remoteAssignOperatorList')
          }"
            :loading="remoteLoading"
            clearable
          >
            <el-option
              v-for="item in remoteAssignOperatorList"
              :key="item.id"
              :label="item.userName+'-'+item.realName"
              :value="item.realName"
            ></el-option>
          </el-select>
          </li>
        </ul>
        <div style="clear: both;"></div>
        <div id="select">
          <span>派单员负责区域：</span>
        <el-select
            v-model="ProvinceId"
            placeholder="选择省/直辖市"
            @change="onProvincechange">
            <el-option
              v-for="item in Provinces"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
          <div id="select2">
          <el-select
            v-model="cityID"
            placeholder="选择城市" 
            @change="oncitychange">
            <el-option
              v-for="item in citys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </div>
      </div>
      </el-collapse-transition>
    </div >
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu myicon"></i>
          <span>数据列表</span>
        </div>
        <div class="listBoxRight">
          <div class="button-head" @click="addNew"><i class="el-icon-plus iconfont"></i></i>添加派单员</div>
        </div>
      </div>
      <el-table
      :max-height="dataListHeight"
        :data="tableData"
        border
        style="width: 100%"
        size="small">
        <el-table-column
        fixed
          label="派单员编号"
          prop="assignUserId"
          align="center" 
          width="250"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        width="250"
          prop="assginUsername"
          label="派单员"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="organizationName"
          label="所属组织机构"
          width="300"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="操作人（末次）"
          width="250"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="操作时间（末次）" align="center" width="300" show-overflow-tooltip>
        </el-table-column>
        <el-table-column 
          fixed="right"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="small" @click="goEdite(scope.row)" v-if="$authorities.OrderDelivererEdit">编辑</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row)" v-if="$authorities.OrderDelivererDetail">详情</el-button>
              <el-button type="text" size="small" @click="goNext(scope.row.assignUserId)" v-if="$authorities.OrderDelivererDelete">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block"
        v-show="total!=0" >
    <el-pagination
  background
  @current-change="handleCurrentChange"
  @size-change="handleSizeChange"
  :current-page="pageNum"
  :page-size="pagesize"
  :page-sizes="[10,20,30,40,50,100,500]"
      layout="total,sizes, prev, pager, next, jumper"
      :total="totally">
</el-pagination>
      </div>
<!-- 添加派单员弹出框 -->
        <el-dialog  
        :visible.sync="addNewVisible" 
        width="800px"
        :title="addNewname"
        custom-class="dialog-box">
        <ul>
          <li>
              <span><i style="color: red;">*</i> 所属组织机构：</span>
              <el-input
                placeholder=""
                v-model="college"
                 :disabled="true"
                clearable>
              </el-input>
          </li>
        <div style="clear: both;"></div>
          <li class="li2">
          <span><i style="color: red;">*</i> 选择派单员：</span>
        <el-select
            v-model="senderRealName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入账号或姓名"
            :remote-method="remoteMethod"
            @change="onsenderchange"
            :loading="loading">
            <el-option
              v-for="item in senders"
              :key="item.id"
              :label="item.userName+'-'+item.realName"
              :value="item.id"
              >
            </el-option>
          </el-select>
        </li>
        <div style="clear: both;"></div>
        <li  class="li3">
        <span><i style="color: red;">*</i> 选择负责分配区域：</span>
        <div>
          <span>
            可选区域
          </span>
           <el-tree
           @node-click="handleNodeClick"
          ref="tree"
          :data="data4"
          show-checkbox
          node-key="id"
          :empty-text="data4?'加载中':'暂无数据'"
          render-after-expand 
          @check="getnode()"
          :props="defaultProps">
           </el-tree>
        </div>
        <div class="yixuan">
          <span>
            已选区域
          </span>
           <el-tree
            ref="tree2"
            :render-content="renderContent"
            :data="data4"
            node-key="id"
            :empty-text="data4?'加载中':'暂无数据'"
            render-after-expand 
            :filter-node-method="filterNode"
             :props="defaultProps">
           </el-tree>
        </div>
        </li>
         <div style="clear: both;"></div>
        </ul>
 <span class="footer">
    <el-button type="primary" @click="addVisible">保存配置</el-button>
    <el-button type="primary" @click="addNewVisible = false">取消</el-button>
  </span>
      </el-dialog>
      <!-- 详情弹出框 -->
      <el-dialog 
        :visible.sync="tishiVisible"
        width="800px"
        title="派单配置详情"
        custom-class="dialog-box">
        <div class="xiangqing">
          <!-- 上部分 -->
          <ul>
          <li>
            <p class="p1" id="p1">派单元编号:</p>
            <p class="p2" style="line-height: 50px;width: 200px;">{{ide.assignUserId}}</p>
          </li>
          <li>
            <p class="p1">派单员:</p>
            <p class="p2" style="line-height: 50px;width: 200px;">{{ide.assginUsername}}</p>
          </li>
          <div style="clear: both;"></div>
          <li id="li">
            <p class="p1" style="border-left: 1px solid #000;border-top: none;">所属组织机构:</p>
            <p class="p2" id="p2"  align="center" style="border-top: none;width: 552px;overflow: hidden;">{{ide.organizationName}}</p>
          </li>
        </ul>
        <!-- 中间部分 -->
        <div class="pdy">
          <div class="left">派单员负责区域：</div>
          <div class="center">
          <span>
            可选区域
          </span>
           <el-tree
            ref="tree3"
           :props="defaultPropss"
           :empty-text="data4?'加载中':'暂无数据'"
          :data="data4"
          show-checkbox
          node-key="id"
          render-after-expand
          @check="getnode4()">
           </el-tree>
          </div>
          <div class="right">
             <span>
            已选区域
          </span>
           <el-tree
            ref="tree4"
            :data="data4"
            node-key="id"
            :render-content="renderContent"
            :empty-text="data4?'加载中':'暂无数据'"
            render-after-expand 
            :filter-node-method="filterNode"
            :props="defaultPropss">
           </el-tree>
          </div>
          <div style="clear: both;"></div>
        </div>
        <!-- 下部分 -->
        <div class="xia">
          <span>操作记录：</span>
           <el-table
        :data="xiangqingData"
        border
        style="width:600px">
        <el-table-column
          align="center"
          label="操作者"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.userInfo">{{ scope.row.userInfo.organizationName}}>{{ scope.row.userInfo.departmentName}}>{{ scope.row.userInfo.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          align="center"
          label="操作时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作描述">
        </el-table-column>
      </el-table>
        </div>
  <!-- footer -->
  <span class="footer">
    <el-button type="primary" @click="tishiVisible=false">关 闭</el-button>
  </span>
        </div>
</el-dialog>
    </div>
 </div>
</template>
<script>
  // 注入接口
  import {getUserRecord,shengAreaid,Areaid,AvailableArea,AvailableArea2,PieceConfiguration,SenderConfigurationDetails,EditDispatcherConfiguration,RemoveTheDispatcherConfiguration,ListOfDispatchers,getUserCollege,getUserCollegeMan} from '@/api/order/orderManManage'
   import {
  simpleList
} from "@/api/projectController/projectController";
import {
  fuzzySearch
} from "@/api/organizationManage";
  export default {
    name: "orderManManage",
    inject: ["reload","isFilterShow",'close'], //注入依赖
    data() {
      return {
        remoteLoading: false, //筛选查询loading
        senderRealName:"",
        remoteAssignUserList: null,
        remoteAssignOrganizationList:null,
        remoteAssignOperatorList:null,
        addNewname:"",
        senderId:"",
        id:0,
        pagesize:10,
        yeZi:[],
        totally:0,
        xiangqingData:[],
        shanchutishiVisible:false,
        defaultPropss: {
          children: 'childrenDTOs',
          label: 'name',
          disabled:true,
        },
        getnodeDATE:false,
        ide:{},
        ProvinceId:null,
        tishiVisible:false,
        defaultProps: {
          children: 'childrenDTOs',
          label: 'name',
        },
        zhongjian:[],
        ARR:[],
        data4:[],
        college:"",
        sender:"",
        senders:[],
        total:1,
        isShow: this.isFilterShow,
        selectId:null,
        organization:null,
        name:null,
        Provinces:[],
        citys:[],
        tableData:[],
        Province:"",
        city:"",
        addNewVisible:false,
        childrenren:[],
        cityID:null,
        loading: false,
        collegeId:"",
        treeyezi:[],
        pandun:true,
        getnodedata:false,
        pageNum:1,
      }
    },
    components: {
    },
    activated() {
    if(this.$route.params.isUpdate){
      shengAreaid().then(res => {
        this.Provinces=res.data;
      });
        ListOfDispatchers({"pageNum":this.pageNum,"pageSize":this.pagesize}).then(res => {
        this.totally=res.data.total;
        this.tableData=res.data.items;
      });
    }
  },
    created(){
        shengAreaid().then(res => {
        this.Provinces=res.data;
      });
        ListOfDispatchers({"pageNum":this.pageNum,"pageSize":this.pagesize}).then(res => {
        this.totally=res.data.total;
        this.tableData=res.data.items;
      });
    },
    watch:{
      defaultProps(a, b) {},
          'selectId': function(newVal){
              if (this.selectId=="")this.selectId=null;
          },
          'cityID': function(newVal){
              if (this.cityID=="")this.cityID=null;
          },
          'organization': function(newVal){
              if (this.organization=="")this.organization=null;
          },
          'ProvinceId': function(newVal){
              if (this.ProvinceId=="")this.ProvinceId=null;
          },
          'name': function(newVal){
              if (this.name=="")this.name=null;
          },
        // if (this.selectId=="")this.selectId=null;
        // if (this.cityID=="")this.cityID=null;
        // if (this.organization=="")this.organization=null;
        // if (this.ProvinceId=="")this.ProvinceId=null;
        // if (this.name=="")this.name=null;
    },
    computed:{
       dataListHeight(){
         return this.$store.getters.dataListHeight;
       }
     },
    methods: {
      querySearch(query, type, list) {
      if (query !== "") {
        this.remoteLoading = true;
        if (type == "operator") {
          simpleList({ userName: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else if (type == "organization") {
          fuzzySearch({ name: query }).then(res => {
            if (res.code == "000000") {
            this[list] = res.data;
            this.remoteLoading = false;
          }
          });
        } else if (type == "manager") {
          simpleList({ userName: query }).then(res => {
            this[list] = res.data;
            this.remoteLoading = false;
          });
        } else {
          this[list] = [];
          this.remoteLoading = false;
        }
      } else {
        this[list] = [];
      }
    },
      reset(){
        this.selectId=null;
        this.cityID=null;
        this.organization=null;
        this.ProvinceId=null;
        this.name=null;
        ListOfDispatchers({"pageNum":this.pageNum,"pageSize":this.pagesize}).then(res => {
        this.totally=res.data.total;
        this.tableData=res.data.items;
      });
      },
      remoteMethod(query){
        getUserCollegeMan({
          count:10,
          organizationId:this.collegeId,
          realName:query,
          status:0
        }).then(res=>{
          this.loading = false
          if(res.code=='000000'){
            this.senders = res.data
          }
        })
      },
      handleSizeChange(val) {
        this.pagesize=val;
        ListOfDispatchers({
                  "assignUserName":this.selectId,
                  "cityId":this.cityID,
                  "organizationName":this.organization,
                  "pageNum":this.pageNum,
                  "pageSize": this.pagesize,
                  "provinceId":this.ProvinceId,
                  "userName":this.name
                }).then(res => {
        this.tableData=res.data.items;
      });
      },
    addVisible(){
      if (this.getnodeDATE) {
        if(!this.yeZi.length){
          this.$message.error('分配区域必填');
          return;
        }
       EditDispatcherConfiguration(this.senderId,{regionIds:this.yeZi}).then(res => {
         this.$message({
           showClose: false,
          message: '<p>已成功操作</p> ',
          dangerouslyUseHTMLString: true,
          type: 'success',
          center: true
        });
        this.reload();
       });
      }else{
      let timetick=this.$refs.tree.getCheckedKeys(true);
      let data={
          "assignUserId":this.senderRealName,
          "regionIds":this.$refs.tree.getCheckedKeys(true),
      };
        for (var i =0; i < this.totally; i++) {
          if (this.senderRealName==this.tableData[i].assignUserId) {
            this.pandun=false;
          }
        }
        if (this.pandun==false) {
          this.$message({
           showClose: false,
          message: '<p>操作失败,当前用户已存在</p> ',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          center: true
        });
        }else if(this.$refs.tree.getCheckedKeys(true).length==0){
          this.$message({
           showClose: false,
          message: '<p>操作失败,至少选择一个负责分配区域</p> ',
          dangerouslyUseHTMLString: true,
          type: 'error',
          center: true
        });
        }else{
          PieceConfiguration(data).then(res => {
            this.$message({
           showClose: false,
          message: '<p>已成功操作</p> ',
          dangerouslyUseHTMLString: true,
          type: 'success',
          center: true
        });
      this.addNewVisible = false;
      this.reload();
          });
        }
      
}
    }, 
      checkCheck(){
        // if (this.selectId=="")this.selectId=null;
        // if (this.cityID=="")this.cityID=null;
        // if (this.organization=="")this.organization=null;
        // if (this.ProvinceId=="")this.ProvinceId=null;
        // if (this.name=="")this.name=null;
        let data={
                  "assignUserName":this.selectId,
                  "cityId":this.cityID,
                  "organizationName":this.organization,
                  "pageNum": this.pageNum,
                  "pageSize": this.pagesize,
                  "provinceId":this.ProvinceId,
                  "userName":this.name
                }
        ListOfDispatchers(data).then(res => {
        this.tableData=res.data.items;
        // this.selectId=null;
        // this.cityID=null;
        // this.organization=null;
        // this.ProvinceId=null;
        // this.name=null;
      });
      },
      goNext(id){
        this.$confirm('删除之后，当前派单员负责的区域内的订单将无法分配派单，确定需要删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          RemoveTheDispatcherConfiguration(id).then(res => {
            if(res.code=='000000'){
              this.reload();
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
         });
        });
      },
      handleNodeClick(data) {},   
      filterNode(value, data) {
      if(!value) return true;
      return value.includes(data.id);
    },
      onsenderchange(val){
      },
      getnode() {
        if (this.getnodedata) {
        this.$refs.tree.setCheckedKeys(this.treeyezi);
        this.$refs.tree2.filter(this.treeyezi);
        this.getnodedata=false;
        }
      let yeziId = this.$refs.tree.getCheckedKeys(true)
      let idArr = this.$refs.tree.getCheckedKeys()
      this.yeZi=this.$refs.tree.getCheckedKeys(true);
      this.$refs.tree2.filter(idArr);
      this.ARR=[];
      this.ARR=idArr;
    },
      renderContent(h, { node, data, store }) {
        if (this.tishiVisible!=false){
          return (
          <span class="custom-tree-node" style="
          flex: 1;
          display: flex;
          align-items:center;
          justify-content:space-between;
          font-size: 14px;
          padding-right: 8px;">
            <span>{node.label}</span>
          </span>);
        }else{
          return (
          <span class="custom-tree-node" style="
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;">
            <span>{node.label}</span>
            <span>
              <el-button  size="mini" type="text" on-click={ () => this.change(node.data)}><i class="el-icon-close"></i></el-button>
            </span>
          </span>);
        }
        
      },
      //判断是否有子节点，并去除被点击的叶子节点
      childrencheck(data){
        var index = this.ARR.indexOf(data.id); 
         if (data.childrenDTOs) {
        for (var i = 0; i < data.childrenDTOs.length; i++) {
          var index = this.ARR.indexOf(data.childrenDTOs[i].id); 
           if (!data.childrenDTOs[i].childrenDTOs) {
        if (index > -1) {
      this.ARR.splice(index, 1); 
      } 
      }
      else{
        this.childrencheck(data.childrenDTOs[i]);
        }
      }
      }
      if (!data.childrenDTOs) {
        if (index > -1) { 
      this.ARR.splice(index, 1); 
      } 
      }
      },
      // 点击右侧X，引起左右树的同时变化
      change(data){
      this.childrencheck(data);
      this.getnode2()
      },
      // 被去除点击节点下子节点的数组与初始叶子节点数组作比较，取到剩余叶子节点数组
      getnode2(){
      let idArr = this.$refs.tree.getCheckedKeys(true)
      let arr=[];
      for (var i = 0; i < idArr.length; i++) {
         for (var j = 0; j < this.ARR.length; j++) {
        if (idArr[i]==this.ARR[j]) {
           arr.push(idArr[i])
        }
      }
      }
      this.$refs.tree2.filter(arr);
      this.$refs.tree.setCheckedKeys(arr);
      this.ARR=[];
      this.ARR=idArr;
      this.yeZi=this.$refs.tree.getCheckedKeys(true);
      },
     handleCurrentChange(val) {
      this.pageNum=val;
        ListOfDispatchers({
                  "assignUserName":this.selectId,
                  "cityId":this.cityID,
                  "organizationName":this.organization,
                  "pageNum":this.pageNum,
                  "pageSize": this.pagesize,
                  "provinceId":this.ProvinceId,
                  "userName":this.name
                }).then(res => {
        this.tableData=res.data.items;
      });
      },
      onProvincechange(val){
        this.cityID=""
        //獲取初始地址數據
        Areaid(val).then(res => {
          this.citys=res.data;
      });
      },  
       oncitychange(val){},
      goEdite(val){
        this.getnodeDATE=true;
        this.college=val.organizationName;
        this.senderRealName=val.assginUsername;
        this.senderId=val.assignUserId;
        this.data4 = [];
        //查看详情
        SenderConfigurationDetails(val.assignUserId).then(res => {
         this.treeyezi=res.data.regionIds;
         // 初始化未選擇地區數據
         let data={assignUserId:res.data.assignUserId}
        AvailableArea2(data).then(res => {
        this.data4=res.data;
        this.getnodedata=true;
        this.$nextTick().then(()=>{
          this.getnode()
        })
      });
      });
        getUserCollege().then(res => {
          this.college=res.data.userPosts[0].organizationName;
          this.collegeId=res.data.userPosts[0].organizationId;
      });
        this.addNewname="编辑派单配置";
        this.addNewVisible=true;
      },
      addNew(){
        this.college="";
        this.senderRealName="";
        this.data4 = [];
        this.getnodeDATE=false;
        getUserCollege().then(res => {
          this.college=res.data.userPosts[0].organizationName;
          this.collegeId=res.data.userPosts[0].organizationId;
      });
        // 初始化未選擇地區數據
        AvailableArea().then(res => {
        this.data4=res.data
        this.$nextTick().then(()=>{
        this.getnode()
        })
      });
        this.addNewname="添加派单配置";
         this.addNewVisible=true;
      },
      goDetail(val){
        this.ide=val;
        this.data4 = [];
        getUserRecord(val.assignUserId).then(res => {
        this.xiangqingData=res.data;
      });
        // 查看詳情
        SenderConfigurationDetails(val.assignUserId).then(res => {
        this.treeyezi=res.data.regionIds;
         // 初始化未選擇地區數據
         let data={assignUserId:res.data.assignUserId}
        AvailableArea2(data).then(res => {
        this.data4=res.data;
        this.getnodedata=true;
        this.$nextTick().then(()=>{
          this.getnode4()
        })
      });
      });
        this.tishiVisible=true;
      },
    getnode4() {
      this.$refs.tree3.setCheckedKeys(this.treeyezi);
      this.$refs.tree4.filter(this.treeyezi);
    },
    }
  }
</script>
<style  scoped>
.orderManageBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
<style scoped lang="less">
  .orderManageBox {
    width: 100%;
    .filterBox {   
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      margin: 10px 0;
      clear: both;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 10px;
        box-sizing: border-box;
        .head-left{
          display: flex;
          align-items: center;
        }
      }
      span {
        font-size: 14px;
        color: #303133;
      }
      .rightBox {
        float: right;
        .myicon{
          color: #999;
          font-size: 10px;
        }
        span{
          color:#333;
          font-size: 14px;
        }
      }
    }
    // .el-button {
        
    //     height: 30px;
    //     margin: 10px 10px 0 10px;
    //   }
     .homeBoxBottom {
      padding-bottom: 20px;
       height: auto;
      background-color:#fff;
        border: 1px solid #e4e4e4;
        margin-top: -2px;
        ul{
          li{
            float: left;
            margin-left: 65px;
             .el-input {
          width: 200px;
          height: 40px;
          line-height: 56px;
        }
          }
        }
        .el-input {
          width: 200px;
          height: 40px;
          line-height: 56px;
        }
        
        #select{
          margin-left: 10px;
          float: left;
          span{
          margin-right: 0px;
        }
        .el-select{
          width: 200px;
          height: 40px;
          line-height: 76px;
        }
        }
        #select2{
          .el-select{
          width: 200px;
          height: 40px;
          line-height: 76px;
          margin-left: 65px;
        }
        }
      }
.listBox {
      font-size: 12px;
      background-color: #f3f3f3;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          .myicon{
            margin-left: 10px;
          }
          span {
            margin-left: 5px;
            font-size: 14px;
            color: #303133;
            line-height: 50px;
          }
        }
      }
      .listBoxRight {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;
        .button-head{
          height: 30px;
          margin-right: 10px;
          border:1px solid #d1d1d1;
          cursor:pointer;
          background-color: #fff;
          line-height: 30px;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          .button-head-icon{
            margin-right: 5px;
          }
          .icon-add{
            font-size: 12px;
          }
        }
        .button-head:hover{
          background-color: #f3f3f3;
        }
        // .el-button {
        //   width: 80px;
        //   height: 30px;
        //   margin-top: 10px;
        // }
      }
      .el-table {
        margin-top: -2px;
        // .el-button {
        //   font-size: 12px;
        // }
      }
    }
  }
  .el-pagination{
          float: left;
          margin-right: 10px;
          // color: red;
        }
   .block{
    height: 32px;
        display: flex;
        // line-height: 50px;
        box-sizing: border-box;
        // margin-top: 3px;
        border: 1px solid #e4e4e4;
        // border-top: none;
        justify-content:flex-end;
      }
      .el-dialog{
        ul{
          li{
            height: 50px;
            line-height: 50px;
            margin-left: 20px;
            span{
              display: block;
              float: left;
            }
            .el-input{
              display: block;
              float: left;
              width: 550px;
            }
            .el-select{
              display: block;
              float: left;
              width: 550px;
            }
          }
          .li2{
            span{
              margin-left: 14px;
            }
          }
          .li3{
            height:300px;
            span{
              margin-left: -30px;
            }
            .yixuan{
              margin-left: 10px;
            }
            div{
              float: left;
              width: 270px;
              height: 230px;
              border:2px solid #f5f5f5;
              
              
              font-size: 15px;
              span{
                width:250px;
                margin-left: 0px;
                display: block;
                // color: red;
                height: 40px;
                line-height: 40px;
                font-size: 17px;
                padding-left:20px;
                background-color:#f5f5f5;
              }
              .el-tree{
                overflow-y:scroll;
                overflow-x: hidden;
              }
            }
          }
        }
      }
      .footer{
        margin-left:-20px;
        width: 800px;
        display: flex;
        justify-content:center;
        // .el-button{
        //   height: 40px;
        //   width: 150px;
        // }
      }
      .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .homeBoxBottom{
   
    ul{
      li{
        margin-top: 10px;
      }
    }
  }
  #select{
    margin-top: 10px;
  }
  #select2{
    margin-top: 10px;
  }
  .el-dialog{
   
    .xiangqing{
      width: 750px;
      margin-left: 5px;
     height: 600px;
    overflow-y: scroll;
   
    ul{
      height: 100px;
      li{
        float: left;
        margin:0;
        height: 50px;
        p{
          text-align: center;
          float: left;
          border:1px solid #666666;
          height: 50px;
          // line-height: 50px;
          border-left:none;
        }
        .p1{
          width: 150px;
          color: #666;
          font-weight: 700;
          line-height: 50px;
        }
        // .p2{
        //   width: 125px;
        //   // line-height: 100px;
        //   // white-space:nowrap;
        //   // overflow: hidden;
        //   // overflow-x: scroll;
        // }
        #p1{
          border-left:1px solid #666666;
        }
        #p2{
          // width: 150px;
          // line-height: 50px;
        }
    //        p:nth-child(1){
    //   border-left:1px solid #666666;
    // }
      }
      #li{

      }
      
    //   li:nth-child(1){
    //   border-left:1px solid #666666;
    // }
    }
    .pdy{
      margin-top: 30px;
      height: 250px;
      // border:1px solid green;
      .left{
        margin-top: 10px;
      }
      .center{
        float: left;
              width: 270px;
              height: 230px;
              border:2px solid #f5f5f5;
              font-size: 15px;
              span{
                width:250px;
                margin-left: 0px;
                display: block;
                height: 40px;
                line-height: 40px;
                font-size: 17px;
                padding-left:20px;
                background-color:#f5f5f5;
              }
        .el-tree{
          // border:1px solid red;
                overflow-y:scroll;
                overflow-x: hidden;
                height: 190px;
        }
      }
      .right{
              float: left;
              width: 270px;
              height: 230px;
              border:2px solid #f5f5f5;
              font-size: 15px;
              margin-left: 15px;
              span{
                width:250px;
                margin-left: 0px;
                display: block;
                height: 40px;
                line-height: 40px;
                font-size: 17px;
                padding-left:20px;
                background-color:#f5f5f5;
              }
        .el-tree{
                overflow-y:scroll;
                overflow-x: hidden;
        }
      }
    }
    .xia{
      // margin-top: 10px;
      span{
        display: block;
        float: left;
      }
      .el-table{
        float: left;
        margin-left: 40px;
      }
    }
    .footer{
      width: 750px;
      height: 40px;
      padding-top: 20px;
      // .el-button{
      //   margin-top: 10px;
      //   display: block;
      //   float: right;
      //   height: 40px;
      //   line-height: 17px;
      //   width: 80px;
      //   margin-left:638px;
      // }
    }
  }
  }
   .el-tree{
          // border:1px solid red;
                overflow-y:scroll;
                overflow-x: hidden;
                height: 190px;
        }
</style>
