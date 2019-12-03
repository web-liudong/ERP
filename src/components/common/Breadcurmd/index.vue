<template>
<div style="margin-right: 58px;height: 50px;line-height: 50px;">
  <div class="zoom"><i :class="zoomCls" @click="handler"></i></div>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right" style="margin-left: 50px;">
    <div id="" style="display: inline-block;width: 5px;height: 16px;background: #1abc9c;float: left;margin-top: 16px;margin-right: 5px;"></div>
    <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title" :key="item.path">
      <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
      <!-- <router-link v-else :to="item.redirect||item.path">{{ item.meta.title }}</router-link> -->
      <span v-else class="parent">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <el-button size="small" style="float: right;margin-top: 10px;" onclick="window.location.reload()" >刷新</el-button>
  <el-button size="small" style="float: right;margin-top: 10px;margin-right: 20px;" v-if="!homeIndex" @click="back">{{btnTitle}}</el-button>
</div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import {close} from '@/api/close'
//面包屑导航组建
export default {
  data() {
    return {
      levelList: null,
      iszoom:false,
      zoomCls:'iconfont iconshousuo',
      homeIndex:true,
      btnTitle:'返回',
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
      this.controlButton()
    }
  },
  created() {
    this.getBreadcrumb();
  },
  mounted(){
    this.controlButton();
  },
  methods: {
    getBreadcrumb() {
      const { params } = this.$route
      let matched = this.$route.matched.filter(item => {
        if (item.name) {
          var toPath = pathToRegexp.compile(item.path)
//        console.log(toPath)
          item.path = toPath(params)
//        console.log(item.path)
          return true
        }
      })
//    console.log(matched)
//    const first = matched[0]
//    if (first && first.name !== 'dashboard') {
//      matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
//    }
      var oo=matched.shift()
      this.levelList = matched
//    console.log(this.levelList)
    },
    handler(){
      this.iszoom = !this.iszoom;
      this.zoomCls = this.iszoom ? 'iconfont iconkuozhan' : 'iconfont iconshousuo'
      this.$emit("callback");
    },
    controlButton(){
      if(this.$route.path=='/homepage/home/homeindex'){
        this.homeIndex=true;
      }else{
        this.homeIndex=false;
      }
      if (window.history.length <= 1) {
        this.btnTitle='关闭';
      } else {
        this.btnTitle='返回';
      }
    },
    back(){
      // this.$router.go(-1);
      if (window.history.length <= 1) {
        close();
        // this.$router.push({path:'/'})
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style  lang="less" scoped>
  .zoom{
    position: absolute;
    width: 40px;
    padding-left: 5px;
    .iconfont{
      font-size: 20px;
      color: #000;
      cursor: pointer;
    }
  }
	  .app-breadcrumb.el-breadcrumb {
	  		box-sizing: border-box;
    display: inline-block;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    margin-left: 10px;
    .parent {
      color: #303133;
      font-weight: bold;
      text-decoration: none;
    }
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }


</style>
