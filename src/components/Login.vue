<template>
  <div class="pageBox" :class="{mini:$_isMini()}">
    <!--<img src="../../static/img/time.jpg" alt="登陆背景">-->
    <div class="login_box">
      <div class="login_tit">
        <img src="../../static/img/logo.png" />
        <p>领先未来办公平台</p>
      </div>
      <div class="form">
        <ul>
          <li style="text-align: center;">
            <!-- <span>账号：</span> -->
            <el-input v-model="name" placeholder="请输入账号" @keyup.enter.native="userLogin"></el-input>
          </li>
          <li style="text-align: center;">
            <!-- <span>密码：</span> -->
            <el-input type="password" v-model="password" placeholder="请输入密码" @keyup.enter.native="userLogin"></el-input>
          </li>
          <li>
            <div style="text-align: right;flex:1;">
              <a href>忘记密码</a>&nbsp;
              <a href>立即注册</a>
            </div>
          </li>
          <li style="text-align: center;">
            <el-button type="primary" @click="userLogin()" :loading="loginLoading">登 录</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getInfo } from "@/api/login";
import Vue from "vue";
import Qs from "qs";
export default {
  name: "error",
  components: {},
  data() {
    return {
      name: "",
      password: "",
      path: "ws://127.0.0.1:8181",
      socket: {},
      mac: "NIBUSHIZHENZHENGDEKUAILE",
      loginLoading: false
    };
  },
  created() {
    this.$auth.token = null;
    this.$auth.user = null;
    (this.$authorities = null), console.log(this.$authorities);
  },
  mounted() {
    this.init();
  },
  methods: {
    $_isMini() {
      const rect = document.body.getBoundingClientRect()
      return rect.height - 1 < 900
    },
    userLogin() {
      if (!this.loginLoading) {
        var da1 = Qs.stringify({
          grant_type: "password",
          username: this.name,
          password: this.password
        });
        var information = {
          user: da1,
          mac: this.mac
        };
        if (this.mac) {
          this.loginLoading = true;
          this.$store
            .dispatch("Login", information)
            .then(data => {
              this.$store
                .dispatch("GetInfo", data)
                .then(() => {
                  Vue.prototype.$authorities = this.$auth.user.authorities;
                  this.loginLoading = false;
                  // if (this.$route.query && this.$route.query.redirect) {
                  //   this.$router.push({ path: this.$route.query.redirect });
                  // } else {
                  //   this.$router.push("/");
                  // }
                  this.$router.push("/");
                })
                .catch(rej => {
                  this.loginLoading = false;
                });
            })
            .catch(rej => {
              this.loginLoading = false;
            });
        } else {
          alert("请稍后正在获取mac码");
        }
      }
    },
    init() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket,请更换或者升级浏览器");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.webopen;
        // 监听socket错误信息
        this.socket.onerror = this.weberror;
        // 监听socket消息
        this.socket.onmessage = this.webgetMessage;
      }
    },
    webopen() {
      console.log("socket连接成功" + this.socket.readyState);

      this.websend();
    },
    weberror() {
      console.log("连接错误");
    },
    webgetMessage(msg) {
      console.log(msg.data);
      this.mac = msg.data;
    },
    websend() {
      this.socket.send("uniqueid");
    },
    webclose() {
      console.log("socket已经关闭");
    }
  }
};
</script>
<style lang="less" scoped>
.pageBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: url(../../static/img/bg.jpg) no-repeat 50% 50%;
  background-size: cover;
  img {
    width: 100%;
    height: 100%;
  }
  .login_box {
    width: 620px;
    height: 450px;
    text-align: center;
    border-radius: 10px;
    // background: rgba(232, 240, 245, 1);
    position: absolute;
    top: 12%;
    left: 50%;
    margin-left: -310px;
    color: #fff;
    // box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
    .login_tit{
      width: 600px;
      display: inline-block;
    }
    p {
      padding-top: 20px;
      text-align: center;
      font-size: 30px;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }
    a {
      color: #fff;
    }
    .form{
      background: rgba(33, 142, 221, 0.8);
      border-radius: 20px;
      margin: 30px;
      padding: 20px 20px 60px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      ul {
        width: 70%;
        margin: 0 auto;
        li {
          padding-top: 20px;
          display: flex;
          text-align: center;
          span {
            width: 50px;
            display: inline-block;
            line-height: 40px;
          }
        }
      }
    }
    .el-input {
      // flex: 1;
      width: 100%;
      height: 42px;
      line-height: 42px;
      margin-top: 25px;
      padding: 0;
      background: rgba(45, 45, 45, 0.15);
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1) inset;
      font-size: 14px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }
    .el-button {
      border: 0;
      height: 45px;
      width: 100%;
      background: rgba(2, 71, 179, 0.71);
      font-size: 20px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
      &:hover {
        background-color: rgba(2, 71, 179, 1);
        box-shadow: 0 15px 30px 0 rgba(255, 255, 255, 0.15) inset,
          0 2px 7px 0 rgba(0, 0, 0, 0.2);
      }
    }
    .is-loading {
      background-color: rgba(2, 71, 179, 1);
      &:before {
        background-color: rgba(255, 255, 255, 0.1);
        border: 0;
      }
    }
  }
}
.mini.pageBox{
  .login_box{
    width: 480px;
    top:6%;
    margin-left: -240px;
    
    .login_tit{
      width: 450px;
      p{
        font-size: 18px;
        padding-top:10px; 
      }
    }

    .form{
      padding: 0 0 40px 0;
      margin: 60px 30px 30px 30px;
      ul li{
        padding-top: 12px;
      }
    }
  }
}
</style>
<style scoped>
.login_box >>> .el-input__inner {
  background: none;
  border: 0;
  color: #fff;
}
</style>

