<template>
  <div class="form-wrapper">
    <div class="form-head">
      <span>客户：</span>
      <span class="form-head-name">{{customerName}}</span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所属专柜项目：</span>
      <span class="form-head-name">{{projectName}}</span>
    </div>
    <addhead headname="审批流设置" class="head-border"></addhead>
    <div class="approval-body">
      <el-form class="block-box" v-for="(item,index) in flowlists" :key="index">
        <div class="title">
          <div class="title-name">{{(page-1)*5+index+1}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.name?item.name:'审批流程'}} &nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-edit edit-icon" @click="editGroup(item.id)"></i> &nbsp;&nbsp;&nbsp;&nbsp;<i>当前状态：</i><i class="red-font">{{item.status}}</i></div>
          <div>
            <el-button type="success" plain size="mini" @click="deploygroup(item.id)">发布</el-button>
            <el-button type="danger" plain size="mini" @click="deleteFlow(item.id)">删除</el-button>
          </div>
        </div>
        <div class="initiator" >
            <span class="span-label">发起人：</span>
            <div class="group-originators" v-if="item.groupOriginators" @click="updateoriginatorIds(item.id,item.groupOriginators)">
              <span v-for="item in item.groupOriginators">{{item.userName}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div class="select-box" v-else="item.groupOriginators" @click="addoriginatorIds(item.id)">
              <i class="el-icon-circle-plus add-icon"></i>
              <div class="sign-type">请选择</div>
            </div>
        </div>
        <div class="approval-person">
            <span class="span-label">默认审批流：</span>
            <div class="approval-list" v-for="(it,index) in item.defaultFlow.customerFlowTasks" :key="index">
              <div class="approval-block">
                <div class="people-mount" @click="showDetailTask(it.id,item.defaultFlow.id)">已选{{it.approversCount}}{{it.approverType==0?'人':'角色'}}</div>
                <div class="sign-type">{{it.approvalMode==0?'会签':'或签'}}</div>
                <i class="el-icon-close close-icon" @click="deletedefaultflow(it.id)"></i>
              </div>
              <i class="iconfont icon-to-right right-icon"></i>
            </div>
            <div class="select-box" @click="openRight(item.defaultFlow.id)">
              <i class="el-icon-circle-plus add-icon"></i>
              <div class="sign-type">请选择</div>
            </div>
        </div>
        <div class="approval-condition">
          <span class="span-label">条件审批：</span>
          <div class="condition-box" v-for="(m,index) in item.conditonsFlows" :key="index">
            <div class="title">
              <div class="title-name">({{index+1}})&nbsp;&nbsp;&nbsp;&nbsp;{{m.name}} &nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-edit edit-icon" @click="editconditionname(m.id)"></i></div>
              <div>
                <el-button type="primary" plain size="mini" @click="flowup(m.id)">上移</el-button>
                <el-button type="primary" plain size="mini" @click="flowdown(m.id)">下移</el-button>
                <el-button type="danger" plain size="mini" @click="Flowdelete(m.id)">删除</el-button>
              </div>
            </div>
            <div class="condition-body">
              <div>条件：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;条件关系：{{m.conditionReference=='and'?'并且':'或者'}}</div>
              <div class="table-wrapper">
                <el-table
                  :data="m.conditionItems"
                  style="width: 100%"
                  border>
                  <el-table-column
                    label="类型"
                    width="325" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.key=='price'?'订单金额':'订单商品ID'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="expression"
                    label="条件"
                    width="325" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="value"
                    label="值" align="center">
                  </el-table-column>
                </el-table>
                <div class="edit-condition-box">
                  <el-button type="primary" plain size="mini" class="button-show" @click="editcondition(m)">编辑条件</el-button>
                </div>
              </div>
              <div class="select-wrapper">
                <span>审批人：</span>
                <div class="approval-list" v-if="m.customerFlowTasks" v-for="(ite,index) in m.customerFlowTasks" :key="index" >
                  <div class="approval-block">
                    <div class="people-mount" @click="showDetailTask(ite.id)">已选{{ite.approversCount}}{{ite.approverType==0?'人':'角色'}}</div>
                    <div class="sign-type">{{ite.approvalMode==0?'会签':'或签'}}</div>
                    <i class="el-icon-close close-icon" @click="deletedefaultflow(ite.id)"></i>
                  </div>
                  <i class="iconfont icon-to-right right-icon"></i>
                </div>
                <div class="select-box" @click="openRight(m.id)">
                  <i class="el-icon-circle-plus add-icon"></i>
                  <div class="sign-type">请选择</div>
                </div>
              </div>
            </div>
          </div>
          <el-button type="primary" plain size="mini" @click="addFlow(item.id)">添加条件</el-button>
        </div>
      </el-form>
      <div class="addapproval-box">
        <el-button type="primary" plain size="mini" class="addapproval" @click="addNew">添加流程</el-button>
      </div>
      <div class="block" v-show="total!=0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="5"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="选择角色" :visible.sync="dialogRole" @close="cancelRole">
      <div class="customer-name">
        <span class="redcolor">*</span>
        <span>客户名称：</span>
        <span class="redcolor">{{customerName}}</span>
      </div>
      <div class="dialog-body">
        <div class="left-box">
          <p class="left-head">角色信息</p>
          <el-tree
            :data="customerOrganization"
            show-checkbox
            node-key="id"  :props="props2" default-expand-all :expand-on-click-node="false"  ref="tree" @check="checkGroupNode"
            highlight-current check-on-click-node :default-checked-keys="defaulttree">
          </el-tree>
        </div>
        <div class="right-box">
          <p class="left-head" @click="addpeople">已选角色({{customerIds.length}}人)</p>
          <div class="select-person">
            <div v-for="(item,index) in approvers" :key="index" class="role-list">
              <div>{{item.approverName}}</div>
              <div><i class="el-icon-close" @click="deleterole(item.approverId)"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">取 消</el-button>
        <el-button type="primary" @click="sureRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择人员" :visible.sync="dialogPerson">
      <div class="customer-name">
        <span class="redcolor">*</span>
        <span>客户名称：</span>
        <span class="redcolor">{{customerName}}</span>
      </div>
      <div class="dialog-body">
        <div class="left-box">
          <p class="left-head">组织架构信息</p>
          <div class="tree-box">
            <el-tree
              :data="customerOrganization"
              show-checkbox
              node-key="id"  :props="props1" default-expand-all :expand-on-click-node="false"   ref="tree1" @check="checkGroupNode"
              check-on-click-node :default-checked-keys="defaulttree">
            </el-tree>
          </div>
        </div>
        <div class="right-box">
          <p class="left-head" @click="addpeople">已选人员({{approvers.length}}人)</p>
          <div class="select-person">
            <div v-for="(item,index) in approvers" :key="index" class="li-style">
              <div>{{item.approverName}}</div>
              <div class="el-icon-close" @click="deleteuser(item.approverId)"></div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPerson = false">取 消</el-button>
        <el-button type="primary" @click="saveoriginator">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择人员" :visible.sync="rightPerson">
      <div class="customer-name">
        <span class="redcolor">*</span>
        <span>客户名称：</span>
        <span class="redcolor">{{customerName}}</span>
      </div>
      <div class="dialog-body">
        <div class="left-box">
          <p class="left-head">组织架构信息</p>
          <div class="tree-box">
            <el-tree
              :data="customerOrganization"
              show-checkbox
              node-key="id"  :props="props1" default-expand-all :expand-on-click-node="false"   ref="tree1" @check="checkGroupNode"
              check-on-click-node :default-checked-keys="defaulttree">
            </el-tree>
          </div>
        </div>
        <div class="right-box">
          <p class="left-head" @click="addpeople">已选人员({{approvers.length}}人)</p>
          <div class="select-person">
            <div v-for="(item,index) in approvers" :key="index" class="li-style">
              <div>{{item.approverName}}</div>
              <div class="el-icon-close" @click="deleteuser(item.approverId)"></div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightPerson = false">取 消</el-button>
        <el-button type="primary" @click="sureperson">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="条件设立" :visible.sync="conditionDialog" @close = "onconditionDialogclose">
      <div class="condition-head">
        <div>
          <el-button type="primary" plain size="small" @click="addnewcondition">新增条件</el-button>
          <el-button type="primary" plain size="small" @click="clearcondition">清空条件</el-button>
        </div>
        <div>
          <span>条件关系：</span>
          <el-radio-group v-model="conditionReference">
            <el-radio label="and">并且</el-radio>
            <el-radio label="or">或者</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-form class="list-body" :model="form" :rules="rules" ref="form">
        <el-form-item v-for="(item,index) in form.conditionItems" class="add-condition-li" :key="index" :prop="'conditionItems.' + index + '.value'"
                      :rules="rules.value">
          <el-select v-model="item.key" @change="onchange(item.key,index)">
            <el-option
              v-for="(item,index) in firstcondition"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="item.expression" v-if="item.key=='price'">
            <el-option
              v-for="(item,index) in secondcondition"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input readonly v-if="item.key=='productId'" v-model="item.expression" class="add-condition-third"></el-input>

          <el-input placeholder="0.00" v-model="item.value" class="add-condition-third" v-if="item.key=='price'">
            <template slot="append">元</template>
          </el-input>
          <el-input placeholder="请输入商品ID" v-model="item.value" class="add-condition-third" v-if="item.key=='productId'"></el-input>

          <el-button type="danger" plain class="four-delete-button" @click="deletecondition(index)">删除</el-button>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="savecondition('form')" type="primary">确定</el-button>
        <el-button type="primary" @click="cacelcondition">取消</el-button>
      </div>
    </el-dialog>
    <transition name="lt">
      <div class="right-float" v-if="rightBoxShow">
        <div class="select-head">
          <i>选择人员</i>
          <i class="el-icon-close" @click="cancelflowtask"></i>
        </div>
        <el-form label-width="100px">
          <el-form-item label="审批人类别：">
            <el-radio-group v-model="approverType">
              <el-radio :label="0">指定人员</el-radio>
              <el-radio :label="1">角色</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div v-for="(item,index) in approvers" :key="index" class="people-button">
              <el-button  type="info" class="people-button">{{item.approverName}}</el-button>
              <i class="el-icon-close right-close" @click="deleteuser(item.approverId)"></i>
            </div>
            <el-button type="primary" @click="changeuser" v-if="approverType==0&&approvers.length">修改人员</el-button>
            <el-button type="primary" @click="piontuser" v-if="approverType==0&&!approvers.length">添加人员</el-button>
            <el-button type="primary" @click="changeRole" v-if="approverType==1&&approvers.length">修改角色</el-button>
            <el-button type="primary" @click="addRole" v-if="approverType==1&&approvers.length==0">添加角色</el-button>
          </el-form-item>
          <el-form-item label="审批方式：">
            <el-radio-group v-model="approvalMode">
              <el-radio :label="0">会签（须所有审批人同意）</el-radio>
              <el-radio :label="1">或签（一名审批人同意或拒绝即可）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveflowtask">确定</el-button>
            <el-button type="primary" @click="cancelflowtask">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <el-dialog title="更改名称" :visible.sync="dialogName" @close="onDialogNameClose">
      <el-form :model="formName" :rules="rulesname" ref="formName">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="formName.name" placeholder="字数长度1~50"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelname">取 消</el-button>
        <el-button type="primary" @click="editname('formName')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {generalget,addgroup,customerOrganization,customerOrganization2,saveoriginator,saveflowtask,groupList,addcondition,groupdelete,conditionFix,flowdelete,flowdown,flowup,changeName,taskDelete,changeNameGroup,getdetail,roleOrganization,changeTask,deploy} from '@/api/flowService'
  export default {
    inject:['reload'],
    name:'ApprovalProcess',
    data() {
      return {
        defaulttree:[],
        taskId:null,
        editflag:false,
        customerId:null,
        customerName:'',
        projectName:'',
        flowId:null,
        flowlists:[],
        secondcondition:[{
          value:'>=',
          label: '≥'
        },{
          value:'<=',
          label: '≤'
        }],
        secondcondition2:[{
          value:'contains',
          label: '包含'
        }],
        secondType:1,
        approvalList:[],
        thirdID:null,
        approvalMode:0,
        approverType:0,
        examineId:null,
        conditionReference:'and',
        form:{
          conditionItems:[

          ]
        },
        formName:{
          name:''
        },
        firstcondition:[{
          value:'price',
          label: '订单金额'
        },{
          value:'productId',
          label: '订单商品ID'
        }],
        total:0,
        page:1,
        addId:null,
        conditionFix:null,
        customerOrganization:[],
        rules:{
          value:[
            { required: true, message: '订单金额或商品ID不能为空'},
          ]
        },
//        修改条件审批名字
        editconditionId:null,
        dialogName:false,
        rulesname:{
          name:[
            { required: true, message: '名称不能为空'},
            { min:1, max:50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ]
        },
//       修改组名字
        editGroupId:null,
        groupId:null,
        props1: {
          label: 'name',
          children: 'subCustomerOrganizationList',
        },
        props2: {
          label: 'name',
          children: 'subList',
        },
        customerIds:[],
        conditionDialog:false,
        rightBoxShow:false,
        dialogPerson:false,
        rightPerson:false,
        dialogRole:false,
        approvers:[],
      }
    },
    components:{
      addhead
    },
    activated(){
      this.customerId = this.$route.query.id;
      this.getgeneral(this.customerId);
    },
    methods: {
      deploygroup(id){
        this.$confirm('成功保存后，新的审批流程即时生效，并作用于新增订单确定保存吗？', '保存提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deploy(id).then(res=>{
          if(res.code=='000000'){
            this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.reload();
          }
        })
        });
      },
      getroleOrganization(){
        roleOrganization(this.customerId).then(res=>{
          if(res.code=='000000'){
            this.customerOrganization = res.data;
            if(this.editflag){
              this.$refs.tree.setCheckedKeys(this.approvers.map(function (val) {
                return val.approverId;
              }));
            }
          }
        })
      },
      showDetailTask(taskid){
        getdetail(taskid).then(res=>{
          if(res.code=='000000'){
            this.editflag = true;
            this.approvalMode = res.data.approvalMode;
            this.approverType = res.data.approverType;
            this.approvers = res.data.approvers;
            this.rightBoxShow = true;
            this.taskId = taskid;
          }
        })
      },
      cancelRole(){
        this.dialogRole = false;
      },
      addRole(){
        this.dialogRole = true;
        this.getroleOrganization();
      },
      cancelflowtask(){
        this.rightBoxShow = false;
        this.groupId = null;
        this.approverId = [];
      },
      deleteuser(id){
        this.approvers = this.approvers.filter(function (item) {
          return item.approverId!=id;
        })
        this.$refs.tree1.setCheckedKeys(this.approvers.map(res=>{
          return res.approverId;
        }));
      },
      deleterole(id){
        this.approvers = this.approvers.filter(function (item) {
          return item.approverId!=id;
        })
        this.$refs.tree.setCheckedKeys(this.approvers.map(res=>{
          return res.approverId;
        }));
      },
      checkGroupNode(data1,data2){
        if(data2.checkedNodes.length!=0){
          this.approvers = data2.checkedNodes.filter(function (item) {
            if(item.type==2){
              item.approverName = item.name
              item.approverId = item.id
            }
            return item.approverId>0
          })
        }
      },
      onDialogNameClose(){
        this.editGroupId = null;
        this.editconditionId = null;
      },
      editGroup(id){
        this.dialogName = true;
        this.editGroupId = id;
      },
      deletedefaultflow(id){
        this.$confirm('确定删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          taskDelete(id).then(res=>{
            if(res.code=='000000'){
              this.reload();
            }
          })
        });
      },
      cancelname(){
        this.formName.name = ''
        this.dialogName = false;
      },
      editname(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.editconditionId){
              changeName(this.editconditionId,{
                name:this.formName.name
              }).then(res=>{
                if(res.code=='000000'){
                  this.cancelname();
                  this.reload();
                  this.editconditionId = null;
                }
              })
            }else if(this.editGroupId){
              changeNameGroup(this.editGroupId,{
                groupName:this.formName.name
              }).then(res=>{
                if(res.code=='000000'){
                  this.cancelname();
                  this.reload();
                  this.editconditionId = null;
                }
              })
            }

          }
        });
      },
      editconditionname(id){
         this.dialogName = true;
         this.editconditionId = id;
      },
      flowup(id){
        this.$confirm('移动条件审批的位置，将影响该审批流程的优先级，位置越靠前，优先级越高，确定移动吗？', '条件审批移动提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          flowup(id,{
            flowId:id
          }).then(res=>{
            if(res.code=='000000'){
              this.reload();
            }
          })
        });
      },
      flowdown(id){
        this.$confirm('移动条件审批的位置，将影响该审批流程的优先级，位置越靠前，优先级越高，确定移动吗？', '条件审批移动提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          flowdown(id,{
            flowId:id
          }).then(res=>{
            if(res.code=='000000'){
              this.reload();
            }
          })
        });
      },
      editcondition(data){
        this.conditionDialog = true;
        this.conditionReference = data.conditionReference;
        this.form.conditionItems = data.conditionItems;
        this.conditionFix = data.id;
      },
      onconditionDialogclose(){
        this.addId = null;
      },
      handleCurrentChange(page){
        this.page = page;
        this.getinitdata();
      },
      onchange(val,index){
        if(val=='price'){
          this.form.conditionItems[index].expression = '>=';
        }else if(val=='productId'){
          this.form.conditionItems[index].expression = '包含';
        }
      },
      cacelcondition(){
        this.conditionDialog = false;
        this.clearcondition();
      },
      savecondition(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.conditionFix){
              conditionFix({
                condition:{
                  conditionReference:this.conditionReference,
                  conditionItems:this.form.conditionItems
                },
                customerFlowId:this.conditionFix
              }).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                    message: '信息已经成功保存',
                    type: 'success'
                  });
                  this.conditionDialog = false;
                  this.reload();
                }
              })
            }else{
              addcondition({
                condition:{
                  conditionReference:this.conditionReference,
                  conditionItems:this.form.conditionItems
                },
                groupId:this.addId
              }).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                    message: '信息已经成功保存',
                    type: 'success'
                  });
                  this.conditionDialog = false;
                  this.reload();
                }
              })
            }
          }
        });
      },
      clearcondition(){
        this.form.conditionItems = [];
      },
      deletecondition(index){
        this.form.conditionItems.splice(index,1)
      },
      addnewcondition(){
        this.form.conditionItems.push({
          key:'price',
          expression:'>=',
          value:'',
        })
      },
      getinitdata(){
        groupList({
          customerFlowGeneralId:this.flowId,
          pageNum:this.page,
          pageSize:5
        }).then(res=>{
          if(res.code=='000000'){
            this.flowlists = res.data.items;
            this.total = res.data.total;
          }
        })
      },
      saveflowtask(){
        if(this.approvers.length){
          var arr = this.approvers.map(function (val) {
            return val.approverId;
          })
          if(!this.editflag){
            saveflowtask({
              approvalMode:this.approvalMode,
              approverIds:arr,
              approverType:this.approverType,
              customerFlowId:this.groupId
            }).then(res=>{
              if(res.code=='000000'){
                this.$message({
                  message: '信息已经成功保存',
                  type: 'success'
                });
                this.cancelflowtask();
                this.reload();
              }
            })
          }else{
            changeTask(this.taskId,{
              approvalMode:this.approvalMode,
              approverIds:arr,
              approverType:this.approverType,
            }).then(res=>{
              if(res.code=='000000'){
                this.editflag = false;
                this.rightBoxShow = false;
                this.taskId = null;
                this.reload();
              }
            })
          }
        }else{
          this.$message.error('人员必填');
        }
      },
      saveoriginator(){
        var arr = this.approvers.map(function (val) {
          return val.approverId;
        })
        saveoriginator(this.groupId,arr).then(res=>{
          if(res.code=='000000'){
            this.groupId = null;
            this.$message({
              message: '信息已经成功保存',
              type: 'success'
            });
            this.dialogPerson = false;
            this.reload();
          }
        })
      },
      addoriginatorIds(id){
        this.dialogPerson = true;
        this.groupId = id;
        customerOrganization(this.customerId).then(res=>{
          if(res.code=='000000'){
            this.customerOrganization = res.data;
          }
        })
      },
      updateoriginatorIds(id,people){
        var that = this;
        this.approvers = [];
        that.defaulttree = [];
        people.forEach(function (item,index) {
          that.approvers.push({
            approverName:item.userName,
            approverId:item.userId
          })
          that.defaulttree.push(item.userId)
        })
        customerOrganization(this.customerId).then(res=>{
          if(res.code=='000000'){
            this.customerOrganization = res.data;
          }
        })
        this.dialogPerson = true;
        this.groupId = id;
      },
      piontuser(){
        this.rightPerson = true;
        this.defaulttree = [];
        this.approvers = [];
        customerOrganization2(this.customerId).then(res=>{
          if(res.code=='000000'){
            this.customerOrganization = res.data;
          }
        })
      },
      changeuser(){
        var that = this;
        this.rightPerson = true;
        that.defaulttree = [];
        this.approvers.forEach(function (item,index) {
          that.defaulttree.push(item.approverId)
        })
        customerOrganization2(this.customerId).then(res=>{
          if(res.code=='000000'){
            this.customerOrganization = res.data;
          }
        })
      },
      changeRole(){
        var that = this;
        this.dialogRole = true;
        that.defaulttree = [];
        this.approvers.forEach(function (item,index) {
          that.defaulttree.push(item.approverId)
        })
        this.getroleOrganization();
      },
      sureperson(){
        this.rightPerson = false;
        this.addPeople = false;
      },
      sureRole(){
        this.dialogRole = false;
      },
      Flowdelete(id){
        this.$confirm('删除该条件审批后，订单将不触发相应的审批流程，确定要删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          flowdelete(id).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.reload();
            }
          })
        });

      },
      deleteFlow(id){
        this.$confirm('删除审批流程后，关联的发起人新增订单时，将不使用该流程，确定要删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          groupdelete(id).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.reload();
            }
          })
        });
      },
      getgeneral(id){
        generalget(id).then(res=>{
          if(res.code=='000000'){
            this.customerName = res.data.customerName;
            this.projectName = res.data.projectName;
            this.flowId = res.data.id;
            this.getinitdata();
          }
        })
      },
      addpeople(){
        this.dialogPerson = true
      },
      addNew(){
        addgroup({
          customerFlowGeneralId:this.flowId
        }).then(res=>{
          if(res.code=='000000'){
            this.reload();
          }
        })
      },
      openRight(id){
        this.rightBoxShow = true;
        this.approvers =  [];
        this.groupId = id;
      },
      addFlow(id){
        this.conditionDialog = true;
        this.addId = id;

      }
    }
  }
</script>
<style scoped>
  .tree-box{
    width: 100%;
    height: 200px;
    overflow:auto;
  }
  .red-font{
    color: red;
  }
  .role-list{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px 20px;
  }
  .li-style{
    padding:10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .people-button{
    width: 86px;
    height: 38px;
    position: relative;
    display: inline-block;
    margin-right: 10px;
  }
  .right-close{
    position: absolute;
    right: 0;
    top: 0;
  }
  .edit-condition-box{
    width: 50px;
  }
  .table-wrapper:hover .button-show{
    display: inline-block;
  }
  .button-show{
    display: none;
  }
  .table-wrapper{
    display: flex;
    padding-top: 20px;
  }
  .select-wrapper{
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }
  .el-table{
    margin: 0 10px 20px 50px;
    width:600px;
  }
  .condition-body{
    width: 85%;
    margin:0 auto;
    padding-top: 20px;
  }
  .button-size{
    width: 50px;
  }
  .condition-box{
    width: 95%;
    margin:10px auto;
    border-bottom: 1px solid #e4e4e4;
  }
  .group-originators{
    width: 90%;
    background-color: #f3f3f3;
    border:1px solid #e4e4e4;
    border-radius: 5px;
    min-height: 60px;
    padding:10px;
  }
  .block {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .add-condition-li{
    margin-bottom: 15px;
  }
  .span-label{
    width: 100px;
    text-align: right;
  }
  .four-delete-button{
    height: 40px;
  }
  .add-condition-third{
    width: 200px;
  }
  .form-wrapper{
    position: relative;
    margin-top:20px;
    height: 100%;
  }
  .select-head{
    width: 100%;
    height: 60px;
    background-color: #f3f3f3;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }
  .select-head i{
    line-height: 60px;
    font-weight: bold;
    font-size: 16px;
    color: #666;
  }
  .el-form{
    padding: 30px;
  }
  .lt-enter-active{
    animation: show-in 1s;
    transition: all 1s;
  }
  .lt-leave-active{
    animation: show-out 1s;
    transition: all 1s;
  }
  @keyframes show-in {
    0%{
      transform: translate(660px,0);
    }
    100%{
      transform: translate(0,0);
    }
  }
  @keyframes show-out {
    0%{
      transform: translate(0,0);
    }
    100%{
      transform: translate(660px,0);
    }
  }
  .condition-head{
    width: 80%;
    height: 60px;
    margin: 0 auto;
    border-bottom: 1px solid #999;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .list-body{
    width: 80%;
    margin: 0 auto;
    padding: 20px 0;
  }
  .right-float{
    width: 660px;
    box-shadow: -5px 0 5px #339999;
    background-color: #fff;
    position:fixed;
    right: 0;
    top:0;
    bottom: 0;
    z-index: 999;
  }
  .customer-name{
    height:40px;
  }
  .redcolor{
    color: red;
  }
  .dialog-body{
    display: flex;
  }
  .left-box{
    width: 416px;
    height: 200px;
    margin-right: 20px;
  }
  .left-head{
    width: 100%;
    line-height: 40px;
    border:1px solid #e4e4e4;
    background-color: #f3f3f3;
    text-indent: 20px;
    box-sizing: border-box;
  }
  .right-box{
    width: 416px;
    height: 200px;
  }
  .left-head{
    width: 100%;
    line-height: 40px;
    border:1px solid #e4e4e4;
    background-color: #f3f3f3;
    text-indent: 20px;
    box-sizing: border-box;
  }
  .select-person{
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    height: 180px;
    overflow:auto;
  }
  li{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }
  li:hover{
    background-color:#339999;
  }
  .form-head{
    width: 100%;
    height: 40px;
    background-color:#f3f3f3;
    padding-left: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border: 1px solid #e4e4e4;
    margin-bottom: 5px;
    font-size: 15px;
    font-weight: 700;
  }
  .form-head-name{
    color: red;
  }
  .head-border{
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
  }
  .approval-body{
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
  }
  .block-box{
    padding-top: 20px;
    width: 90%;
    margin: 0 auto;
    border-bottom: 2px solid #999;
  }
  .title{
    font-size: 14px;
    line-height: 40px;
    color: #666;
    padding-left: 25px;
    padding-right:100px;
    box-sizing: border-box;
    width: 95%;
    margin: 0 auto;
    background-color:#f3f3f3;
    display: flex;
    justify-content: space-between;
  }
  .edit-icon{
    opacity: 0;
  }
  .title-name:hover .edit-icon{
    opacity: 1;
  }
  .initiator{
    width: 95%;
    margin:10px auto;
    display: flex;
  }
  .el-textarea{
    width:80%;
    background-color: #f3f3f3;
  }
  .el-textarea__inner{
    background-color:yellowgreen !important;
  }
  .approval-person{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 95%;
    margin:10px auto;
    border-bottom: #e4e4e4 solid 1px;
    padding-bottom: 20px;
  }
  .approval-condition{
    width: 95%;
    margin:10px auto;
  }
  .add-icon{
    font-size: 30px;
    color: #339999;
  }
  .approval-list{
    display:flex;
    width: 150px;
    align-items: center;
  }
  .select-box{
    width: 78px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .addapproval-box{
    width: 90%;
    margin: 10px auto;
  }
  .right-icon{
    font-size: 28px;
  }
  .approval-block{
    margin-left: 10px;
    position: relative;
  }
  .people-mount{
    width: 78px;
    height: 38px;
    background-color: #F2F2F2;
    color: #666;
    font-size: 14px;
    text-align: center;
    line-height: 38px;
  }
  .close-icon{
    position: absolute;
    right: 0;
    top:0;
    display: none;
  }
  .approval-block:hover .close-icon{
    display: inline-block;
  }
  .sign-type{
    width: 78px;
    height: 22px;
    background-color: #F2F2F2;
    color: #666;
    font-size: 14px;
    text-align: center;
    line-height:22px;
  }

</style>
