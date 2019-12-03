<template>
  <div class="app_main">
    <div class="headerBox clearfix">
      <h3><img src="~@/assets/logo/logo.png" /></h3>
      <div class="nav_top">
      	<el-menu
        :default-active="$route.path.split('/')[1]"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#282b33"
        text-color="#bcbcbc"
        active-text-color="#339999"
      >
        <el-menu-item
          v-for="(headerData,index) in commonDataList"
          :key="'common'+index"
          @click="t1show(headerData)"
          :index="headerData.path.split('/')[1]"
        >{{headerData.meta.title}}</el-menu-item>
        <!-- <el-menu-item v-for="(headerData,index) in hraderDataList" :key="index" @click="t1show(headerData)"
        :index="headerData.path.split('/')[1]"  v-if='$authorities[headerData.name]' >{{headerData.meta.title}}</el-menu-item>-->
        <el-menu-item
          v-for="(headerData,index) in hraderDataList"
          :key="index"
          @click="t1show(headerData)"
          :index="headerData.path.split('/')[1]"
          v-if="!headerData.meta.auth || $authorities[headerData.meta.auth]"
        >{{headerData.meta.title}}</el-menu-item>
      </el-menu>
      </div>
      <!--</ul>-->
      <ul class="rightBox">
        <el-popover placement="top-start" trigger="hover" popper-class="el-user-popper">
          <div class="clearfix userinfo" style="width: 300px;">
            <div
              class="clearfix"
              style="padding-bottom: 10px;border-bottom: 1px solid rgba(0, 0, 0, 0.1);"
            >
              <span style="line-height: 30px;">账户信息</span>
              <el-button
                type="primary"
                size="mini"
                style="float: right;"
                @click="changePassword()"
              >修改密码</el-button>
            </div>
            <p>用户名：{{userData.realName}}</p>
            <p>所在组织：{{organizationName}}</p>
            <p>本次登陆：</p>
            <p>登陆地区：</p>
            <p>上次登陆：</p>
          </div>
          <li slot="reference">
            <div class="adminBox">
              <i class="icon iconfont iconxitongguanliyuan" style="font-size: 26px;"></i>
            </div>
          </li>
        </el-popover>
        <li style="width: auto;">{{userData.realName}}&nbsp;</li>
        <li>
          <i class="icon iconfont iconshouye" title="系统首页"></i>
        </li>
        <!--<li>
          <i class="icon iconfont icon-weibiaoti12" title="常用菜单"></i>
        </li>
        <li>
          <i class="icon iconfont icon-xiaoxi" style="font-size: 26px;" title="系统消息"></i>
        </li>-->
        <li>
          <i class="icon iconfont iconguanbi" title="退出登陆" @click="goLogin()"></i>
        </li>
      </ul>
    </div>
    <div :class="mainCls? 'breadcrumb expandNav' : 'breadcrumb'">
      <breadcrumb @callback="expandRange"></breadcrumb>
    </div>
    <div :class="mainCls? 'main expand' : 'main'">
      <div class="homePageBox">
        <leftnav></leftnav>
        <div class="slideBox" ref="contentArea">
          <div class="mainBox_tt">
            <keep-alive :include="$store.getters.includePages.toString()">
              <router-view></router-view>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="账号：" :label-width="formLabelWidth">{{userData.userName}}</el-form-item>
        <el-form-item label="原密码：" :label-width="formLabelWidth" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            autocomplete="off"
            type="password"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" :label-width="formLabelWidth" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            autocomplete="off"
            type="password"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            autocomplete="off"
            type="password"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import breadcrumb from "@/components/common/tag/index";
import leftnav from "@/components/common/LeftNav/LeftNav";
import { resetRouter }  from "@/router/resetRouter";
import { changePassword,logout } from "@/api/userService";
import "./HeaderTop.less"
export default {
  name: "HeaderTop",
  components: {
    breadcrumb,
    leftnav
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value.length >= 6 && value.length <= 16) {
        callback();
      } else {
        callback(new Error("密码仅支持6-16位"));
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      commonDataList: [
        {
          name: "homepage",
          path: "/homepage/home",
          meta: {
            title: "首页"
          }
        }
      ],
      hraderDataList: [
        {
          path: "/goods",
          name: "Goods",
          redirect: "/goods/goodsmanage/goodsManage",
          meta: {
            title: "商品",
            auth: "Goods"
          }
        },
        {
          name: "Order",
          path: "/order/orderManage",
          meta: {
            title: "订单",
            auth: "Order"
          }
        },
        {
          path: "/biddingPrice",
          name: "Bidding",
          redirect: "/biddingPrice/biddingPriceMessage",
          meta: {
            title: "竞价",
            auth: "Bidding"
          }
        },
        {
          path: "/purchase",
          name: "Purchase",
          redirect: "/purchase/purchaseOrder",
          meta: {
            title: "采购",
            auth: "Purchase"
          }
        },
        {
          path: "/payment",
          name: "Payment",
          redirect: "/payment/customerStatementList",
          meta: {
            title: "结算",
            auth: "Payment"
          }
        },
        {
          path: "/finance",
          name: "Finance",
          meta: {
            title: "财务",
            auth: "Finance"
          },
          redirect: "/finance/code/code"
        },
        {
          path: "/marketing",
          name: "Marketing",
          redirect: "/marketing/targetCustomer/index",
          meta: {
            title: "市场",
            auth: "Market"
          }
        },
        {
          path: "/supplier",
          name: "Supplier",
          redirect: "/supplier/basic/supplierindex/supplierList",
          meta: {
            title: "供应商",
            auth: "Supplier"
          }
        },
        {
          path: "/customer",
          name: "Customer",
          redirect: "/customer/information/customermanage",
          meta: {
            title: "客户",
            auth: "Customer"
          }
        },
        {
          path: "/warehouse",
          name: "Warehouse",
          redirect: "/warehouse/admin/admin",
          meta: {
            title: "仓库",
            auth: "Warehouse"
          }
        },
        {
          path: "/release",
          name: "Release",
          redirect: "/release/releaseindex/releaselist",
          meta: {
            title: "发布",
            auth: "Release"
          }
        },
        {
          path: "/Statistics",
          name: "statistics",
          redirect: "/statistics/taskTable",
          meta: {
            title: "统计",
            //auth: ""
          }
        },
        {
          path: "/system",
          name: "System",
          redirect: "/system/systemindex/systemList",
          meta: {
            title: "系统",
            auth: "System"
          }
        },
      ],
      leftData: [],
      headerDatas: [],
      imgurl: "",
      mainCls:"",
      show: null,
      userData: null,
      dialogFormVisible: false,
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        type: 0,
        userId: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },
      formLabelWidth: "120px"
    };
  },

  created() {
    this.userData = this.$auth.user;
    this.form.userId = this.$auth.user.id;
    this.$nextTick(() => {
      console.log('height',this.$refs.contentArea.clientHeight-270)
      this.$store.commit("SET_DATALISTHEIGHT", this.$refs.contentArea.clientHeight-270);
    })
  },
  computed: {
    organizationName: function() {
    		if(this.userData.userPosts.length){
    			let a=this.userData.userPosts[0].organizationName?this.userData.userPosts[0].organizationName:''
    			let b=this.userData.userPosts[0].departmentName?'-'+this.userData.userPosts[0].departmentName:''
    			return a+b
    		}else{
    			return ''
    		}
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          changePassword(this.form)
            .then(res => {
              this.$message({
                message: "密码修改成功即将返回登陆页",
                type: "success"
              });
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changePassword() {
      this.dialogFormVisible = true;
    },
    expandRange(){
      this.mainCls = this.mainCls ? "" : "expand";
    },
    test: function(headerData) {
      console.log(this.$authorities[headerData]);
      return this.$authorities[headerData];
    },
    t1show(headerData) {
      let name;
      if(headerData.name == "homepage"){
        name = "home";
      }else{
        name = resetRouter(headerData.name);
      }      
      this.$router.push({name:name});
      // this.$router.push({name:name, params:{isUpdate:true}});
    },
    goLogin() {
    	logout().then(res=>{
    		this.$router.push("/login");
    	})
    }
  },
  watch: {
    $route() {
      let route = this.$route.path.split("/")[1];
      this.show = route;
    }
  }
};
</script>
<style scoped lang="less">
.app_main {
  width: 100%;
  height: 100%;
  .main {
    height: 100%;
    position: relative;
    padding-top: 60px;
    box-sizing: border-box;
    /*z-index: 10006;*/
  }
  .breadcrumb {
    position: fixed;
    top: 60px;
    z-index: 10009;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    left: 200px;
    right:0;
    background: #f5f5f5;
    transition: all .2s ease-out;
  }
  .expandNav {
    left: 0px;
  }
  .headerBox {
    width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    background-color: #282b33;
    z-index: 10009;
    color: #f5f5f5;
    display: flex;
    h3 {
      width: 200px;
      padding-left: 1em;
      box-sizing: border-box;
      line-height: 60px;
      img{
        display:inline-block;
        margin: 9px 0 0 6px;
      }
    }
    .nav_top{
    	flex: 1;
      height: 60px;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
    	&::-webkit-scrollbar-track
				{
				    background-color: #393d49;
				}
    }
    .Space {
      height: 100%;
      flex: 1;
    }

    .homeBox {
      /*flex: 0 0 70%;*/
      /*display: flex;
			justify-content: flex-start;
			align-items: center;*/
      li {
        cursor: pointer;
        flex: 6% 0 0;
        width: 60px;
        height: 60px;
        line-height: 60px;
        box-sizing: border-box;
        text-align: center;
        a {
          color: #bcbcbc;
          font-size: 14px;
        }
        a:hover {
          color: #f5f5f5;
        }
      }
      .active {
        border-bottom: 6px solid #339999;
      }
    }
    .rightBox {
      display: flex;
      justify-content: space-around;
      height: 60px;
      line-height: 60px;
      /deep/ .userinfo {
        p {
          line-height: 40px;
          padding-top: 20px;
        }
      }
      li {
        width: 26px;
        padding: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        i:hover {
          cursor: pointer;
        }
        i {
          font-size: 22px;
        }
        .adminBox {
          img {
            width: 26px;
            height: 26px;
          }
        }
        img {
          width: 21px;
          height: 21px;
          color: #e4e4e4;
        }
      }
    }
    .el-menu-item {
      padding: 0 1vmax;
      float: none;
      display: inline-block;
    }
    .el-menu--horizontal{
      border-bottom: none;
    }
  }
}
</style>
