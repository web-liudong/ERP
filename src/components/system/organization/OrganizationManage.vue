<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:item.organizationStatus==isActive}"
        v-for="(item,index) in headers"
        @click="changeTab(item.organizationStatus)"
        :key="index"
      >{{item.organizationStatusName}}({{item.count}})</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span v-if="isShow" @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up">收起筛选</i>
          </span>
          <span v-else @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-down">展开筛选</i>
          </span>
          <el-button size="small" @click="queryBrand()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox clear" v-if="isShow">
          <div class="inputBox">
          <span>组织机构编号：</span>
          <el-input
            placeholder="组织机构编号"
            v-model="FindOrganizationListParam.no"
            @input="FindOrganizationListParam.no=FindOrganizationListParam.no.replace(/[^\d]/g,'')"
            clearable
          ></el-input>
        </div>
        <div class="inputBox">
          <span>组织机构名称：</span>
          <el-select
            v-model="FindOrganizationListParam.name"
            filterable
            remote
            reserve-keyword
            placeholder="组织机构名称"
            :remote-method="remoteMethod"
            :loading="loading1"
            @change="getID"
            clearable
          >
            <el-option
              v-for="item in options4"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <span>组织机构性质：</span>
          <el-select
            v-model="FindOrganizationListParam.organizationType"
            clearable
            placeholder="组织机构性质"
          >
            <el-option
              v-for="item in options6"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <span v-if="isActive=='AVAILABLE'">是否使用领先wms系统：</span>
          <el-select
            v-model="FindOrganizationListParam.useLeadingWMS"
            clearable
            placeholder="是否使用领先WMS系统"
            v-if="isActive=='AVAILABLE'"
          >
            <el-option
              v-for="item in options11"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <span>所属上级：</span>
          <el-input
            placeholder="组织机构ID"
            v-if="false"
            v-model="FindOrganizationListParam.parentNameId"
            clearable
          ></el-input>
          <el-select
            v-model="FindOrganizationListParam.parentName"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="所属上级"
            :remote-method="remoteMethod1"
            @change="gerParentName"
            :loading="loading2"
          >
            <el-option
              v-for="item in options5"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <span style="width: 100px;">所属省/直辖市：</span>
          <el-select v-model="FindOrganizationListParam.provinceId" clearable placeholder="所属省/直辖市">
            <el-option
              v-for="item in options7"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <span v-if="isActive=='AVAILABLE'">  是否签订协议：</span>
          <el-select
            v-model="FindOrganizationListParam.signedAgreement"
            clearable
            placeholder="是否签订协议"
            v-if="isActive=='AVAILABLE'"
          >
            <el-option
              v-for="item in options10"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <span v-if="isActive=='AVAILABLE'">协议类型：</span>
          <el-select
            v-model="FindOrganizationListParam.agreementType"
            clearable
            placeholder="协议类型"
            v-if="isActive=='AVAILABLE'"
            :disabled="FindOrganizationListParam.signedAgreement===false"
          >
            <el-option
              v-for="item in options9"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="listBoxRight">
          <div class="white-btn fun-btn" @click="showDialog('importFile')">
            <i class="iconfont icondaoru"></i>导入
          </div>
          <div
            class="white-btn fun-btn"
            @click="importdetail('SysImportRecord',{type:'organization-import-list'})"
          >
            <i class="iconfont icondingdanguanli"></i>导入记录
          </div>
          <div class="white-btn fun-btn" @click="previewTree()" style="width:120px">
            <i class="iconfont iconsousuo" v-if="$authorities.OrganizationPreviewAll"></i>整体架构预览
          </div>
          <div
            class="white-btn fun-btn"
            @click="addBrandList()"
            v-if="$authorities.OrganizationCreateRelevant"
          >
            <i class="iconfont icontianjiashangpin"></i>添加
          </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" size="small" :max-height="dataListHeight">
          <el-table-column prop="no" label="组织机构编号" align="center">
            <template slot-scope="scope">
              <span v-if="isActive=='AVAILABLE'||isActive=='FORBIDDEN'">{{scope.row.no}}</span>
              <span v-if="isActive=='PENDING_REVIEW'||isActive=='DRAFT'||isActive=='REJECTED'">--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="组织机构名称"
            align="center"
            show-overflow-tooltip
            width="140"
          ></el-table-column>
          <el-table-column prop="organizationTypeName" label="组织机构性质" align="center"></el-table-column>
          <el-table-column prop="signedAgreement" label="是否签订协议" align="center">
            <template
              slot-scope="scope"
            >{{scope.row.signedAgreement==null?'--':scope.row.signedAgreement===true?'是':'否'}}</template>
          </el-table-column>
          <el-table-column prop="agreementType" label="协议类型" align="center">
            <template
              slot-scope="scope"
            >{{scope.row.signedAgreement?scope.row.agreementType==1?'战略协议':scope.row.agreementType==2?'交叉持股':'---':'---'}}</template>
          </el-table-column>
          <el-table-column prop="parentName" label="所属上级" align="center"></el-table-column>
          <el-table-column prop="provinceAndCity" label="所属省/市" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizationStatus" label="状态" align="center">
            <template slot-scope="scope">
              {{scope.row.organizationStatus|fil}}
              <br />
            </template>
          </el-table-column>
          <el-table-column prop="users" label="相关" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="isActive=='AVAILABLE'||isActive=='FORBIDDEN'"
                type="text"
                @click="toUserList(scope.row)"
              >人员：{{scope.row.users}}</el-button>
              <span v-if="isActive=='PENDING_REVIEW'||isActive=='DRAFT'||isActive=='REJECTED'">--</span>
            </template>
          </el-table-column>
          <el-table-column prop="users" label="设置" align="center">
            <template slot-scope="scope">
              <span v-if="isActive=='PENDING_REVIEW'||isActive=='DRAFT'||isActive=='REJECTED'">--</span>
              <el-button
                type="text"
                @click="gotoSectionManage(scope.row)"
                v-if="(isActive=='AVAILABLE'||isActive=='FORBIDDEN')&&$authorities.OrganizationManageDepar"
              >管理部门</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toOrganizationDetail(scope.row)" v-if="$authorities.OrganizationDetailRelevant">详情</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small" :disabled="scope.row.oldId!=0&&isActive=='REJECTED'" v-if="isActive!='PENDING_REVIEW'&&$authorities.OrganizationUpdateRelevant">编辑
              </el-button>
              <el-button type="text" size="small" v-if="isActive=='DRAFT'&&$authorities.OrganizationUpdateRelevant" @click="toAudit(scope.row)">提审</el-button>
              <el-button type="text" size="small" v-if="isActive=='PENDING_REVIEW'&&$authorities.OrganizationReview" @click="auditOrganizationDetail(scope.row)">审核</el-button>
              <el-button type="text" size="small" v-if="(isActive=='DRAFT'||isActive=='REJECTED')&&$authorities.OrganizationCreateRelevant&&$authorities.OrganizationUpdateRelevant" @click="delBrandID(scope.row)">删除</el-button>
              <el-button type="text" size="small" v-if="isActive=='AVAILABLE'&&$authorities.OrganizationAvailableRelevant" @click="toProhibit(scope.row)">禁用</el-button>
              <el-button type="text" size="small" v-if="isActive=='FORBIDDEN'&&$authorities.OrganizationAvailableRelevant" @click="toUse(scope.row)">启用</el-button>
              <el-button type="text" size="small" v-if="(isActive=='AVAILABLE'||isActive=='FORBIDDEN')&&$authorities.OrganizationStructure" @click="personFramework(scope.row)">人员架构</el-button>
              <el-button type="text" size="small" v-if="scope.row.oldId!=0&&$authorities.OrganizationDetailRelevant" @click="toOldOrganizationDetail(scope.row)">原数据详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="FindOrganizationListParam.pageNum"
          :page-size="FindOrganizationListParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="paginations.total"
        ></el-pagination>
      </div>
    <importFile ref="importFile" :title="'组织机构信息导入'" :type="importType"></importFile>
    <el-dialog title="删除提示" :visible.sync="dialogVisible" width="30%" v-el-drag-dialog>
      <span>删除之后，列表将不再展示该条数据，确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isDelBrandID()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="禁用提示" :visible.sync="dialogVisible2" width="30%" v-el-drag-dialog>
      <span>禁用之后，该机构下所有人用户账号无法使用，确定禁用？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2= false">取 消</el-button>
        <el-button type="primary" @click="isToProhibit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="启用提示" :visible.sync="dialogVisible3" width="30%" v-el-drag-dialog>
      <span>启用之后，该机构下所有用户账号可使用，确定启用？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3= false">取 消</el-button>
        <el-button type="primary" @click="isToUse()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="组织架构" :visible.sync="dialogVisible1" width="30%" v-el-drag-dialog>
      <el-tree
        ref="tree"
        :data="data2"
        node-key="id"
        style="max-height:400px;overflow:auto"
        render-after-expand
        @check="getnode()"
        :props="defaultProps"
      >
        <span class="custom-tree-node" slot-scope="{node,data}">
          <span>{{node.label}}</span>
          <span>({{data.count}})</span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="数据锁定提示" :visible.sync="dialogVisible5" width="30%">
      <div>{{infoMessage}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible5 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible5 = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="人员架构" :visible.sync="dialogVisible4" width="30%" v-el-drag-dialog>
      <div style="display: flex; flex: 1">
        <div style="width: 100px;height: 40px">
          <span style="line-height: 40px">机构名称：</span>
        </div>
        <el-input type="text" v-model="organizationNAME" readonly></el-input>
      </div>
      <div style="height: 40px;background: #e4e4e4;margin-top: 10px">
        <span style="line-height: 40px;margin-left: 20px">部门/人员信息</span>
      </div>
      <div style="max-height:400px;overflow:auto">
        <el-tree
          ref="tree"
          :data="data4"
          node-key="id"
          render-after-expand
          :empty-text="data5?'':'暂无数据'"
          @check="getnode()"
          :props="defaultProps4"
        >
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span>{{node.label}}</span>
            <span>({{data.count}})</span>
          </span>
        </el-tree>
        <div
          style="margin-left:10px"
          v-for="item in data5"
          :key="item.id"
        >[{{item.realName}}] <i v-if="item.post">-</i>{{item.post}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible4 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from "@/store/store";
import elDragDialog from "@/directive/el-dragDialog";
import {
  getStatus,
  getArchitect,
  getRejectList,
  getAuditeList,
  getForbiddenList,
  getDraftList,
  getAvailableList,
  fuzzySearch,
  gotoAuditer,
  gotoProhibit,
  organizationToUser,
  deleteOrganization,
  previewSectionTree,
  getProvince,
  findDetailInformation,
  getStatusCheck
} from "@/api/organizationManage";
import importFile from "@/components/common/module/ImportFile";
export default {
  inject: ["reload"],
  name:"OrganizationManage",
  data() {
    return {
      data2: [],
      data4: [],
      data5: [],
      defaultProps: {
        children: "childrenDTOs",
        label: "name",
        count: "count"
      },
      importType: "organization-manage-import",
      infoMessage: "",
      infoRealName: "",
      defaultProps4: {
        children: "subDepartment",
        label: "name",
        value: "count"
      },
      dialogVisible1: false,
      //禁用对话框
      dialogVisible2: false,
      //启用对话框
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      //禁用id
      toProhibitId: "",
      //禁用老id
      toProhibitOldId: "",
      //启用id
      toUseId: "",
      //启用老id
      toUseOldId: "",
      //删除品牌id
      delBrandID1: "",
      //删除品牌老id
      delBrandOldID1: "",
      headers: null,
      //判断当前点击的是那个选项卡
      isActive: "AVAILABLE",
      isShow: true,
      screenGoods: "收起筛选",
      screenBrand: "展开筛选",
      options6: [
        { label: "不限", value: "不限" },
        { label: "控股", value: "HOLDING" },
        { label: "参股", value: "SHARE_HOLDING" },
        { label: "加盟", value: "JOIN_IN" },
        { label: "全资", value: "FULL_CAPITAL" },
        { label: "特约供应商", value: "SPECIAL_SUPPLIER" }
      ],
      loading1: false,
      loading2: false,
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "草稿"
        },
        {
          value: 3,
          label: "可用"
        }
      ],
      //远程搜索用
      options4: [],
      options5: [],
      //组织机构名称
      organizationNAME: "",
      options7: null,
      options9: [
        { value: "", label: "不限" },
        { value: 1, label: "战略协议" },
        { value: 2, label: "交叉持股" }
      ],
      options10: [
        { value: null, label: "不限" },
        { value: true, label: "是" },
        { value: false, label: "否" }
      ],
      options11: [
        { value: null, label: "不限" },
        { value: true, label: "是" },
        { value: false, label: "否" }
      ],
      tableData: null,
      //机构名称
      organizationNameParam: { name: "", pageNum: 1, pageSize: 15 },
      FindOrganizationListParam: {
        pageNum: 1,
        pageSize: 10,
        id: null, //组织机构id
        no: null, //组织机构编号
        organizationType: null, //组织机构性质
        name: null,
        nameId: null,
        parentName: null, //所属上级名称
        parentNameId: null, //所属上级名称
        provinceId: null, //所属省woshiidmeuaynan
        agreementType: null, //协议类型 //1:战略协议 2：交叉持股
        signedAgreement: null, //是否签订协议
        useLeadingWMS: null //是否使用领先EMS系统
      },
      paginations: {
        total: 0 //总数
      },
      dialogVisible: false
    };
  },
  directives: {
    elDragDialog
  },
  components: {
    importFile
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  filters: {
    fil(value) {
      switch (value) {
        case "AVAILABLE":
          return "已启用";
          break;
        case "PENDING_REVIEW":
          return "待审核";
          break;
        case "DRAFT":
          return "草稿";
          break;
        case "REJECTED":
          return "已驳回";
          break;
        case "FORBIDDEN":
          return "已禁用";
          break;
      }
    }
  },
  created() {
    //获取表格数据
    this.getTableData();
     //获取按钮的状态和数量
    this.getOrganizationStatus();
    getProvince().then(res => {
      this.options7 = res.data;
    });
  },
  mounted(){
    // this.$eventHub.$on("ORGANIZATION_LIST", (ret)=>{
    //    this.changeTab(this.isActive)
    // })
  },
  activated(){
     if(this.$route.params.isUpdate){
       this.changeTab(this.isActive)
     }
  },
  methods: {
    reset() {
        this.FindOrganizationListParam.pageNum =  1;
        this.FindOrganizationListParam.pageSize =  15;
        this.FindOrganizationListParam.id =  null; //组织机构id
        this.FindOrganizationListParam.no =  null; //组织机构编号
        this.FindOrganizationListParam.organizationType =  null; //组织机构性质
        this.FindOrganizationListParam.name =  null;
        this.FindOrganizationListParam.nameId =  null;
        this.FindOrganizationListParam.parentName =  null; //所属上级名称
        this.FindOrganizationListParam.parentNameId =  null; //所属上级名称
        this.FindOrganizationListParam.provinceId =  null; //所属省woshiidmeuaynan
        this.FindOrganizationListParam.agreementType =  null; //协议类型 //1 = 战略协议 2：交叉持股
        this.FindOrganizationListParam.signedAgreement =  null; //是否签订协议
        this.FindOrganizationListParam.useLeadingWMS =  null; //是否使用领先EMS系统
        this.queryBrand();
    },
    //远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        let aa = { name: query, status: this.isActive };
        fuzzySearch(aa).then(res => {
          if (res.code == "000000") {
            this.options4 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    //选中值发生改变后触发
    getID(val) {
      this.options4 = this.options4.filter((item, index) => {
        return item.name == val;
      });
      // this.FindOrganizationListParam.id=this.options4[0].id;
    },
    //远程搜索
    remoteMethod1(query) {
      if (query !== "") {
        this.loading2 = true;
        let bb = { name: query, status: this.isActive };
        fuzzySearch(bb).then(res => {
          if (res.code == "000000") {
            this.options5 = res.data;
            this.loading2 = false;
          }
        });
      } else {
        this.options5 = [];
      }
    },
    gerParentName(val) {
      let ccc = JSON.parse(JSON.stringify(this.options5));
      ccc = ccc.filter(item => {
        return item.parentName = val;
      });
      console.log(ccc)
      this.FindOrganizationListParam.parentNameId = ccc[0]&&ccc[0].id;
    },
    //人员架构
    personFramework(row) {
      this.dialogVisible4 = true;
      this.organizationNAME = row.name;
      previewSectionTree(row.id).then(res => {
        console.log(res.data);
        this.data4 = res.data.departmentStructures;
        this.getData(this.data4);
        this.data5 = res.data.organizationDirectUsers;
      });
    },
    getData(data) {
      data.forEach(item => {
        if (item.subDepartmentUserDTOs) {
          item.subDepartment = [
            ...item.subDepartment,
            ...item.subDepartmentUserDTOs.map(gg => {
              return { name: gg.realName, count: gg.post };
            })
          ];
        }
        if (item.subDepartment) {
          this.getData(item.subDepartment);
        }
      });
    },
    //跳转相关用户列表
    toUserList(row) {
      // const { href } = this.$router.resolve({
      //   path: "/system/systemindex/systemList",
      //   query: {
      //     organizationID: row.id,
      //     organizationName: row.name
      //   }
      // });
      // window.open(href, "_blank");
      this.$router.push({name:'SystemList',query:{organizationID: row.id,organizationName: row.name}})
    },
    //整体部门预览
    previewTree() {
      this.dialogVisible1 = true;
      getArchitect().then(res => {
        console.log(res.data);
        if (res.code == "000000") {
          this.data2 = res.data;
        }
      });
    },

    getnode(data) {
      let yeziId = this.$refs.tree.getCheckedKeys(true);
      let idArr = this.$refs.tree.getCheckedKeys();
      let i = this.$refs.tree.getCheckedNodes(true, true);
      this.options = i;
    },

    //跳转到管理部门
    gotoSectionManage(row) {
      let sectionId = row.id,
        organizationName = row.name;
      this.$router.push({
        name: "SectionManage",
        query: {
          sectionID: sectionId,
          organizationNameId: organizationName
        }
      });
    },
    //获取按钮的状态和数量
    getOrganizationStatus() {
      getStatus().then(res => {
        console.log(res.data);
        this.headers = res.data;
      });
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    importdetail(name, query) {
      // const { href } = this.$router.resolve({
      //   name: name,
      //   query: query
      // });
      // window.open(href, "_blank");
      this.$router.push({name:name,query:query})
    },
    //获取表格数据
    getTableData() {
      //已启用
      getAvailableList(this.FindOrganizationListParam).then(res => {
        this.tableData = res.data.items;
        console.log(res.data, 221564156456456);
        this.paginations.total = res.data.total;
        this.FindOrganizationListParam.pageNum = res.data.pageNum;
        this.FindOrganizationListParam.pageSize = res.data.pageSize;
      });
    },
    //点击查询结果传入当前的isactive的值，判断是草稿还是待审核之后
    queryBrand() {
      this.FindOrganizationListParam.pageNum = 1;
      this.change(this.isActive);
    },
    //获取已驳回的列表数据
    getTable() {
      getRejectList(this.FindOrganizationListParam).then(res => {
        this.tableData = res.data.items;
      });
    },
    //跳转到编辑页
    handleClick(row) {
      getStatusCheck(row.id).then(res=>{
           findDetailInformation(row.id).then(res => {
        if (res.success == false) {
          this.dialogVisible5 = true;
          this.infoMessage = res.message;
        }else {
          this.$router.push({name:'EditerOrganization',query:{id:row.id}})
        }
      });       
      })    
    },
    //切换tab
    changeTab(index) {
      // this.FindOrganizationListParam.id = null;
      // this.FindOrganizationListParam.organizationType = null;
      // this.FindOrganizationListParam.name = null;
      // this.FindOrganizationListParam.parentName = null;
      // this.FindOrganizationListParam.provinceId = null;
      this.isActive = index;
      this.change(index);
      this.getOrganizationStatus();
    },
    change(index) {
      //待审核列表
      if (index == "PENDING_REVIEW") {
        getAuditeList(this.FindOrganizationListParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.FindOrganizationListParam.pageNum = res.data.pageNum;
          this.FindOrganizationListParam.pageSize = res.data.pageSize;
        });
      }
      //以驳回列表
      if (index == "REJECTED") {
        getRejectList(this.FindOrganizationListParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.FindOrganizationListParam.pageNum = res.data.pageNum;
          this.FindOrganizationListParam.pageSize = res.data.pageSize;
        });
      }
      //已禁用列表
      if (index == "FORBIDDEN") {
        getForbiddenList(this.FindOrganizationListParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.FindOrganizationListParam.pageNum = res.data.pageNum;
          this.FindOrganizationListParam.pageSize = res.data.pageSize;
        });
      }
      //已启用
      if (index == "AVAILABLE") {
        getAvailableList(this.FindOrganizationListParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.FindOrganizationListParam.pageNum = res.data.pageNum;
          this.FindOrganizationListParam.pageSize = res.data.pageSize;
        });
      }
      //草稿列表
      if (index == "DRAFT") {
        getDraftList(this.FindOrganizationListParam).then(res => {
          this.tableData = res.data.items;
          this.paginations.total = res.data.total;
          this.FindOrganizationListParam.pageNum = res.data.pageNum;
          this.FindOrganizationListParam.pageSize = res.data.pageSize;
        });
      }
    },
    //禁用
    toProhibit(row) {
      this.toProhibitId = row.id;
      this.toProhibitOldId = row.oldId;
      this.dialogVisible2 = true;
    },
    //是否禁用
    isToProhibit() {
      gotoProhibit(this.toProhibitId, this.toProhibitOldId).then(res => {
        if (res.data == "1") {
          this.$message({
            message: "禁用成功",
            showClose: true,
            type: "success"
          });
          this.dialogVisible2 = false;
        } else if (res.data == "0") {
          this.$message({
            message: "禁用失败",
            type: "warning"
          });
          this.dialogVisible2 = false;
        }
        this.changeTab(this.isActive)
      });
    },
    //启用
    toUse(row) {
      this.toUseId = row.id;
      this.toUseOldId = row.oldId;
      this.dialogVisible3 = true;
    },
    //是否启用
    isToUse() {
      organizationToUser(this.toUseId, this.toUseOldId).then(res => {
        if (res.data == "1") {
          this.$message({
            message: "启用成功",
            showClose: true,
            type: "success"
          });
          this.dialogVisible3 = false;
        } else if (res.data == "0") {
          this.$message({
            message: "启用失败",
            type: "warning"
          });
          this.dialogVisible3 = false;
        }
        this.changeTab(this.isActive)
      });
    },

    handleCurrentChange(val) {
      console.log(val);
      this.FindOrganizationListParam.pageNum = val;
      this.changeTab(this.isActive);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.FindOrganizationListParam.pageSize = val;
      this.changeTab(this.isActive);
    },
    //筛选按钮
    showHelp() {
      this.isShow = !this.isShow;
    },
    //跳转详情
    toOrganizationDetail(row) {
      this.$router.push({name:"OrganizationDetail",query:{dedetailId:row.id,no:row.no}})
    },
    toOldOrganizationDetail(row) {
      this.$router.push({name:'OrganizationDetail',query:{dedetailId:row.oldId}})
    },
    //删除按钮
    delBrandID(row) {
      this.delBrandID1 = row.id;
      this.delBrandOldID1 = row.id;
      this.dialogVisible = true;
    },
    //是否删除
    isDelBrandID() {
      deleteOrganization(this.delBrandID1, this.delBrandOldID1).then(res => {
        if (res.data == "1") {
          this.$message({
            message: "删除成功",
            showClose: true,
            type: "success"
          });
          this.dialogVisible = false;
        } else if (res.data == "0") {
          this.$message({
            message: "删除失败",
            type: "warning"
          });
          this.dialogVisible = false;
        }
        this.changeTab(this.isActive)
      });
    },
    //跳转到添加组织机构页
    addBrandList() {
      this.$router.push({name:'AddOrganization'})
    },
    //跳转到审核详情页
    auditOrganizationDetail(row) {
      getStatusCheck(row.id).then(res=>{
       let strr= res.data==0?'DRAFT':res.data==1?'PENDING_REVIEW':res.data==2?'REJECTED':'';
        if(strr==this.isActive){
      this.$router.push({name:'AduiterOrganization',query:{id:row.id,status:this.isActive,no:row.no}})
        }else{
          this.$message({
             message:'当前数据状态已改变，请刷新后重试',
             type:'error'
           })
        }
      })
      
    },
    //提审按钮
    toAudit(row) {
      gotoAuditer(row.id, row.oldId).then(res => {
        this.$message({
          message: "提审成功",
          type: "success"
        });
        this.changeTab(this.isActive);
      });
    }
  }
};
</script>
<style scoped>
.brandBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
<style scoped lang="less">
.brandBox {
  width: 100%;
  clear: both;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
    }
  }
  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 0 0 10px;
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      overflow: hidden;
      height: 45px;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 5px 0 5px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      .inputBox {
        float: left;
        margin: 10px;
      }
      .el-input {
        width: 180px;
        margin-left: 10px;
      }
      .el-select {
        width: 180px;
      }
      .inputBox2 {
        float: left;
        margin: 10px;
        .el-input {
          width: 100px;
          margin-left: 10px;
        }
      }
    }

    // .homeBottomBox {
    //   border-top: 1px solid #e4e4e4;
    //   display: flex;
    //   flex-wrap: wrap;
    //   .inputBox {
    //     width: 25%;
    //     display: flex;
    //     align-items: center;
    //     span {
    //       text-align: right;
    //       flex: 0 0 98px;
    //     }
    //   }
    //   .el-input {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    //   .el-select {
    //     max-width: 200px;
    //     padding: 5px;
    //   }
    // }
  }
  .listBox {
    /*height: 50px;*/
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    .listBoxTop {
      line-height: 50px;
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .white-btn {
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
.brandBox {
  .el-dialog__header {
    padding: 10px;
    padding-bottom: 0;
    background: #e4e4e4;
    height: 40px;
    line-height: 40px;
  }
}
</style>









