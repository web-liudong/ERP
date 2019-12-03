<template>
	<div class="brandBox">
    <div class="headerBox">
      <p>
        <span>*</span>客户名称：<span>{{customerName}}</span>
      </p>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
          <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="search">查询结果</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-if="isShow">
          <el-row>
            <el-col :span="24" class="el-col">
              <span class="span-style">拜访时间：</span>
              <el-button @click="month"> 一月内</el-button>
              <el-button @click="halfYear">半年内</el-button>
              <el-button @click="year">一年内</el-button>
              <el-button @click="allData">全部</el-button>
              <el-button>自定义</el-button>
              <div class="time-box">
                <el-date-picker
                  v-model="startTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始时间">
                </el-date-picker>
                <div class="text">至</div>
                <el-date-picker
                  v-model="endTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="截止时间">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="el-col">
              <span class="span-style">拜访对象：</span>
              <el-autocomplete
                  v-model="target"
                  :fetch-suggestions="querySearchAsync"
                  value-key="target"
                  clearable
                  placeholder="拜访对象"
                ></el-autocomplete>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">拜访人：</span>
              <el-select
                v-model="customerAccount"
                filterable
                remote
                clearable
                placeholder="请输入负责人账号或姓名"
                :remote-method="customerRemote"
                @change="userNamechange1"
                :loading="loading">
                <el-option
                  v-for="item in customerAccounts"
                  :key="item.id"
                  :label="item.userNameAndRealName"
                  :value="item.userName">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <i class="iconfont iconjinridingdanshu"></i>
          <span>记录(共{{total}}条记录)</span>
        </div>
        <div class="listBoxRight">
          <el-button size="small" @click="addRecrod"><i class="iconfont icontianjiashangpin"></i><span>添加</span></el-button>
        </div>
      </div>
      <div class="visitRecord"> 
          <div class="addrecord" v-if="add">
            <el-form ref="formName" :rules="rules" :model="form">
              <el-form-item v-for="(item,index) in form.targetCustomerDecisionInfoParamList" :key="index" class="addform">
                <el-row style="margin-left:50px;">
                  <el-col :span="8">
                    <el-form-item label="拜访时间：" label-width="110px" class="forms" prop="visitTime">
                      <el-date-picker
                        v-model="form.visitTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions1"
                        placeholder="选择日期时间">
                      </el-date-picker> 
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="拜访地点：" label-width="110px" class="forms" prop="address">
                      <el-input  v-model="form.address" placeholder="字数长度1~10"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="拜访方式：" label-width="110px" class="forms" prop="visitType">
                      <el-select v-model="form.visitType" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in visitTypes"
                          :key="index"
                          :label="item.label"
                          :value="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-left:50px;">
                  <el-col :span="8">
                    <el-form-item label="拜访对象：" label-width="110px" class="forms" prop="target">
                      <el-input  v-model="form.target" placeholder="字数长度1~15"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="拜访人：" label-width="110px" class="forms" prop="userDataAuthorityId">
                      <el-select 
                          v-model="form.userDataAuthorityId" 
                          placeholder="请输入负责人账号"
                          filterable
                          remote
                          clearable
                          reserve-keyword
                          :remote-method="remoteMethod"
                          @change="userNamechange">
                          <el-option
                            v-for="item in options3"
                            :key="item.id"
                            :label="item.userName+'-'+item.realName"
                            :value="item.id">
                          </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="拜访时长：" label-width="110px" class="forms" prop="duration"
                      :rules="rules.duration"
                    >
                      <el-input  v-model="form.duration" placeholder="0.0" >
                        <template slot="append">小时</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item class="form-button-box button-save">
                <el-button type="primary" @click="addVisitRecords('formName')" class="form-button ">保存</el-button>
              </el-form-item>
              <el-form-item label="拜访内容：" label-width="110px" class="forms fcontent" prop="content">
                <el-input type="textarea" v-model="form.content" placeholder="字数长度500以内"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="record" v-for="(item,index) in visitRecord" :key="index">
            <el-row>
              <el-col :span="8"><div class="grid-content bg-purple"><i>*</i>拜访时间：<span>{{item.time}}</span></div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple"><i>*</i>拜访地点：<span>{{item.address}}</span></div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple"><i>*</i>拜访方式：<span>{{item.targetCustomerVisitingRecordWayName}}</span></div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple"><i>*</i>拜访对象：<span>{{item.target}}</span></div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple"><i>*</i>拜访人：<span>{{item.userName}}-{{item.realName}}</span></div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple"><i>*</i>拜访时长：<span>{{item.duration}}小时</span></div></el-col>
            </el-row>
            <div class="remarks">
              <el-input type="textarea" v-model="item.content" disabled placeholder="请输入200字以内"></el-input>
            </div>
            <div class="remarksBottom">
              <el-button type="text" @click="goRemark(item.id)"><i class="iconfont iconbianjidingdan"></i></el-button>
              <el-collapse v-model="activeName" accordion>
                <el-collapse-item>
                  <template slot="title">
                    <i class="iconfont iconjinridingdanshu"></i><span>({{item.targetCustomerVisitingRecordCommentDTOs?item.targetCustomerVisitingRecordCommentDTOs.length:0}}条)</span>
                  </template>
                  <el-row >
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="markHead"><div class="grid-content bg-purple">备注记录</div></el-col>
                  </el-row>
                  <el-row v-for="(items,index) in item.targetCustomerVisitingRecordCommentDTOs" :key="index">
                    <el-row>
                      <el-col :span="6"><div class="grid-content bg-purple">账号：{{items.userName}}</div></el-col>
                      <el-col :span="6"><div class="grid-content bg-purple">姓名：{{items.realName}}</div></el-col>
                    </el-row>
                    <el-row>
                      <el-col><div class="grid-content bg-purple">{{items.comment}}</div></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="9"><div class="grid-content bg-purple">{{items.createTime}}</div></el-col>
                    </el-row>
                    <hr/>
                  </el-row>
                  <el-row style="text-align:center">
                    <el-button type="primary" @click="handleChange">收起</el-button>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
      </div>
      <div class="block" v-show="total!=0">
       <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="closed">关闭</el-button>
      <el-button type="primary" v-backTop>回顶部</el-button>
    </div>
    <el-dialog title="拜访备注" :visible.sync="dialogFormVisible">
      <el-form ref="formNames" :rules="ruless" :model="forms" class="el-froms">
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="forms.remark" placeholder="字数长度1~500字以内"></el-input>
        </el-form-item>
        <el-form-item class="form-button-box">
          <el-button type="primary" @click="addVisitComment('formNames')" class="form-button">保存</el-button>
          <el-button type="primary" @click="oncancel('formNames')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import addhead from '@/components/common/head/head'
  import {targetCustomerList,targetCustomerName,targetCustomerId,
        targetCustomerKeyInfo,addKeyInfo,simpleList,findVisitRecord,addVisitRecord,addComment,findVisitObject,
        getOrganizationInfo
  } from '@/api/targetCustomerManage';

export default {
  inject:['close'],
  name:'CustomerVisit',
  components: {
  	addhead
  },
  data() {
    var checkTime= (rule, value, callback) => {
        var isTime = /^[0-9]+(.[0-9]{1,3})?$/;
        if (isTime.test(value)||value=="") {
          callback();
        } else {
          callback(new Error("请输入正确的时长格式"));
        }
    };
    return {
      pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
      },
      add:false,
      visitRecord:[
        {time:'',address:'',targetCustomerVisitingRecordWayName:'',target:'',userName:'',duration:'',content:''}
      ],
      visitObjects:[],
      customerAccount:'',
      customerAccounts:[],
      customerName:'',
      endTime:'',
      namees:'',
      startTime:'',
      TimeLabel:'ALL',
      userId:null,
      visitingRecordId:null,
      page:1,
      pageSize:10,
      total:0,
      customerId:'',
      visitTypes:[
        {
            type:'PHONE',
            label: '电话'
        }, 
        {
            type:'INTERVIEW',
            label: '面谈'
        },
        {
            type:'OTHER',
            label: '其他'
        }
      ],
      time:'',
      target:'',
      way:'',
      remarks:[],
      options3:[],
      options4:[],
      loading:false,
      names:'',
      isShow:false,
      customerNames:[],
      targetCustomerId:'',
      timeout:null,
      startDate:'',
      endDate:'',
      userDataAuthorityIds:[],
      tableData:[],
      visitNum:0,
      timeout:null,
      forms:{
        remark:'',
      },
      formss:{
        remark:null,
      },
      form:{
        content:'',
        duration:null,
        address:'',
        visitTime:'',
        visitType:null,
        target:'',
        targetCustomerId:'',
        targetCustomerDecisionInfoParamList:[{name:'',phone:'',role:'',visible:false}],
        targetCustomerKeyInfoParamList:[{name:'',phone:'',role:'',visible:false}],
        visiblePersons:[{targetCustomerId:''}],
        userIdStr:'',
      },
      rules:{
        visitTime:[
          { required: true, message: '请输入拜访时间', trigger: 'blur' }
        ],
        address:[
          { required: true, message: '请输入拜访地址', trigger: 'blur' }
        ],
       visitType:[
          { required: true, message: '请输入拜访方式', trigger: 'blur' }
        ],
        target:[
          { required: true, message: '请输入拜访对象', trigger: 'blur' }
        ],
        userDataAuthorityId:[
          { required: true, message: '请输入拜访人', trigger: 'blur' }
        ],
        content:[
          { required: true, message: '请输入拜访内容', trigger: 'blur' }
        ],
        duration:[
          { required: true, message: '请输入拜访时长', trigger: 'blur' },
          // { type: 'number', message: '时长必须为数字值'}
          {validator: checkTime, trigger: "blur"}
        ]
      },
      ruless:{
        remark:[
          { required: true, message: '请输入备注内容', trigger: 'blur' }
        ]
      },
      realName:'',
      activeName:1,
      dialogTableVisible:false,
      dialogFormVisible:false,
      formLabelWidth: '120px'
    }
  },
  created() {
    this.customerName=this.$route.query.customerName;
  },
  activated(){
    if(this.customerId!=this.$route.query.id){
      this.getVisitRecord();
    }
  },
  methods: {
    search(){
        this.getVisitRecord(1);
    },
    showHelp(){
      this.isShow=!this.isShow;
    },
    month(){
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.endTime=end;
      this.startTime=start;
      this.TimeLabel="ONE_MONTH"
    },
    halfYear(){
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
      this.endTime=end;
      this.startTime=start;
      this.TimeLabel="SIX_MONTH"
    },
    year(){
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
      this.endTime=end;
      this.startTime=start;
      this.TimeLabel="ONE_YEAR"
    },
    allData(){
      this.endTime='';
      this.startTime='';
      this.TimeLabel="ALL";
    },
    getVisitRecord(){ 
      this.customerId=this.$route.query.id;
        findVisitRecord(this.customerId,{
          endTime:this.endTime,
          page:this.page,
          pageSize:this.pageSize,
          startTime:this.startTime,
          target:this.target,
          targetCustomerVisitingTimeLabel:this.TimeLabel,
          userId:this.userId
        }).then(res=>{
          if(res.code=='000000'){
            this.visitRecord=res.data.items;
            this.total=res.data.total;
          }
        })
    },
    addVisitRecords(formName){
      // var times=new Date(this.form.visitTime);
      // var time=times.getFullYear() + '-' + (times.getMonth() + 1) + '-' + times.getDate() + ' ' + times.getHours() + ':' + times.getMinutes() + ':' + times.getSeconds()+'.'+times.getMilliseconds();
      this.$refs[formName].validate((valid) => {
        if(valid) {
          addVisitRecord(this.customerId,{
            address:this.form.address,
            content:this.form.content,
            duration:this.form.duration,
            target:this.form.target,
            time:this.form.visitTime,
            targetCustomerVisitingRecordWay:this.form.visitType,
            userId:this.form.userDataAuthorityId
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$refs[formName].clearValidate();
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.$router.go(0)
              }, 3000 * Math.random());
            }
          })  
        } else {
          return false;
        }
      });      
    },
    goRemark(id){
      this.dialogFormVisible=true;
      this.visitingRecordId=id;
    },
    handleChange(val){
      this.activeName=null;
    },
    addVisitComment(formNames){
      this.$refs[formNames].validate((valid) => {
        if(valid) {
          addComment(this.visitingRecordId,{
                comment:this.forms.remark,
          }).then(res=>{
            if(res.code=='000000'){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$refs[formNames].clearValidate()
              this.dialogFormVisible=false;
              this.forms=JSON.parse(JSON.stringify(this.formss));
              this.customerName=this.$route.query.customerName;
						  this.customerId=this.$route.query.id;
						  this.getVisitRecord();
						  this.getVisitObject();
            }
          })
        } else {
            return false;
        }
      });   
    },
    getTargetCustomer(page){
      targetCustomerList({
        endTime:this.endDate,
        id:this.customerId,
        name:this.names,
        pageNum:page,
        pageSize:10,
        startTime:this.startDate,
        type:this.customerType==4?null:this.customerType
      }).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total= res.data.total;
        }
      })
    },
    getVisitObject(){
      findVisitObject(this.customerId,{
        name:this.target
      }).then(res=>{
        if(res.code=='000000'){
          this.visitObjects=res.data;
        }
      })
    },
    switchTypes(row, column){
      let type='';
      switch(row.type){
        case 0:
          type="国企"
          break;
        case 1:
          type="民企"
          break;
        case 2:
          type="政府"
          break;
        case 3:
          type="军队"
          break;
        case 4:
          type="央企"
          break;
        case 5:
          type="外企"
          break;
      }
      return type;
    },
    customerRemote(query){
      this.loading = true
      if(query){
        simpleList({
          userName:query
        }).then(res=>{
          this.loading = false
          if(res.code=='000000'){
            this.customerAccounts=res.data
        }
      })
      }
    },
    userNamechange1(value){
    	let a=this.customerAccounts.filter((item,index)=>{
    		return item.userName==value
      })
      if(a.length!=0){
        this.userId=a[0].id;
      }else{
        this.userId=null;
      }
    },
    remoteMethod(query){
      var storage=window.localStorage;
      var UserInfo=storage.getItem("UserInfo");
      var userPosts=JSON.parse(UserInfo).userPosts;
      var organizationId=userPosts[0].organizationId;
     if (query !== '') {
        getOrganizationInfo({organizationId:organizationId,realName:query}).then(res=>{
          this.options3=res.data;
        })
      } else {
        this.options3 = [];
      }
    },
    userNamechange(value){
    	if(value){
    		let a=this.options3.filter((item,index)=>{
	    		return item.id==value
	      })
	      this.realName=a[0].realName
    	}else{
    		this.realName=''
    	}
    	
    },
    querySearchAsync(queryString, cb) {
      findVisitObject(this.customerId,{
        target:this.target
      }).then(res=>{
        if(res.code=='000000'){
         console.log(res.data)
          var results = queryString ? res.data.filter(this.createStateFilter(queryString)):res.data;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
        }
      })
      
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.target.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    addNew(){
      const {href} = this.$router.resolve({
        name: "AddTargetCustomer"
      });
      window.open(href, '_blank');
    },
    addRecrod(){
      this.add=true;
    },
    saveRecrod(){
      let a={visitTime:'',visitAddress:'',visitWay:'',visitObject:'',visitPerson:'',visitDuration:'',visitRemarks:''};
      this.visitRecord.unshift(a);
      this.add=false;
    },
    handleCurrentChange(val) {
      this.page=val;
      this.getVisitRecord();
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.getVisitRecord();
    },
    oncancel(formName) {
      this.$confirm('取消后，当前填写的信息将不保存，确定取消？', '取消确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible = false;
        this.forms=JSON.parse(JSON.stringify(this.formss));
        this.$refs[formName].clearValidate();
      });
    },
    closed(){
      this.close();
    },

  }
};
</script>

<style scoped lang='less'>
  @color:#f3f3f3;
 .brandBox {
    width: 100%;
    margin-bottom: 100px;
    box-sizing: border-box;
    .headerBox{
      p{
        padding:20px;
        font-size: 16px;
        span{
          color:red;
        }
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-top: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        background-color: #f3f3f3;
        .head-left{
          display: flex;
          align-items: center;
        }
        .myicon{
          font-weight: bold;
          color:#666;
          font-size: 20px;
          line-height: 50px;
          margin-right: 5px;
        }
      }
      span {
        font-size: 16px;
        color: #303133;
      }
      .rightBox {
        float: right;
        span{
        	cursor: pointer;
        }
        .myicon{
          color: #999;
          font-size: 10px;
        }
      }
      .homeBoxBottom {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #e4e4e4;
        padding-top: 10px;
        padding-bottom:10px; 
        .el-row{
            width: 100%;
            margin-top:10px;
            /deep/.el-col{
              display: flex;
              flex-wrap: nowrap;
            }
            .span-style{
              display:inline-block;
              width:100px;
              text-align:right;
              line-height: 40px;
            }
            span{
              margin-left:25px;
            }
            div{
              display: inline-block;
            }
           .time-box{
            width: 50%;
            height: 40px;
            display: inline-block;
            justify-content: center;
            align-items: center;
            .el-date-editor{
              width: 25%;
              height: 40px;
              margin-left: 0;
              margin-bottom: 0;
            }
            .text{
              line-height: 40px;
            }
          }
        }
        /deep/.el-autocomplete{
          width: 50%;
        }
        /deep/.el-select{
          width: 50%;
        }
      }
    }
    .listBox {
      font-size: 12px;
      background-color:@color;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 20px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        .listBoxTop-left{
          .myicon{
            margin-left: 20px;
            font-weight: bold;
            font-size: 20px;
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
        .el-button {
          padding: 9px 15px;
          border-radius: 3px;
          font-size: 12px;
        }
      }
      .visitRecord{
        background: #fff;
        padding-bottom: 20px;
        .addrecord{
          border-bottom: 3px solid #e4e4e4;
          i{
            color: red;
          }
          /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner{
              width:100%;
          }
          /deep/.forms{
            .el-form-item__content{
              display: inline-block;
              width: 53%;
              margin-left: 0 !important;
              .el-select{
                width: 100%;
              }
              .el-textarea{
                height: 100px;
                .el-textarea__inner{
                  height: 100%;
                }
              }
              
            }
          }
          /deep/.fcontent{
            margin-top: -65px;
            .el-form-item__label{
              margin-left:50px; 
            }
            .el-form-item__content{
              width: 77%;
            }
          }
          
        }
        .el-row{
          margin-left:115px;
          .el-col-8{
            padding:15px 0;
            width: 31.33333%;
            i{
              color:red;
              padding: 5px;
            }
          }
        }
        .remarks{
          .el-textarea{
            width:73%;
            height: 100px;
            margin-left:136px;
            /deep/.el-textarea__inner{
              height: 100px;
            }
          }
        }
        .remarksBottom{
          i{
            color: #339999;
            font-size: 25px;
          }
          border-bottom: 3px solid #e4e4e4;
          box-sizing: border-box;
          /deep/.el-button--text{
            margin-left:136px;
            vertical-align: top;
            height: 50px;
          }
           /deep/.el-collapse{
            display: inline-block;
            width: 68%;
            .el-collapse-item__wrap{
              margin-left: -50px;
              .el-row{
                margin-left:0px;
                padding: 5px;
                text-align: left;
                .markHead{
                  padding: 10px;
                  background: #F2F2F2;
                }
              }
            }
          }
        }
       
      }
      .block {
        margin: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
    .my-scroll-bar{
      height:200px;
    }
    .form-button-box{
        display:inline-block;
        margin-left: 190px;
        justify-content: space-around;
    }
    .button-save{
      margin-left: 93%;
      .el-form-item__content{
        z-index: 10;
      }
    }
    .button-box{
      width: 90%;
      margin: 20px auto 50px;
      display: flex;
      justify-content: flex-end;
    }
     /deep/.el-dialog__wrapper{
          .el-dialog{
            margin-top:0 ;
            width: 42.5%;
            .el-dialog__header{
              background-color:@color; 
            }
            .el-dialog__body{
              .el-froms{
                .el-form-item__content{
                      width: 92%;
                      margin-left: 64.38px;
                }
              }
              .el-textarea{
                width:84%;
                height: 230px;
                .el-textarea__inner{
                  height: 230px;
                }
              }
              
            }
        }
    }
  }
</style>