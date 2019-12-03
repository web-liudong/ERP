<template>
  <div class="leftnav">
    <!-- <el-menu
      style="text-align: left;"
      :default-active="$route.path.split('/')[2]"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#282b33"
      text-color="#bcbcbc"
      active-text-color="#ffffff"
    > -->
    <ul>
      <div
        v-for="(nav,index) in navs"
        :key="index"
        style="width: 200px;"
        v-if="!nav.meta.auth || $authorities[nav.meta.auth]"
      >
        <!-- <div class=""
             v-if="$authorities[nav.name]||nav.name=='homeindex'"
             style="color: #ffffff;height: 40px;line-height: 40px;background-color: #393D49;padding-left: 20px;font-size: 16px;">
          {{nav.meta.title}}
        </div>-->
        <!--<el-menu-item @click="clickroute(item.path)" v-for="(item,index) in nav.children"-->
        <!--v-if="(!item.hidden && $authorities[item.name])||item.name=='home'"-->
        <!--:key="index"-->
        <!--:index="item.path.split('/')[2]" style="height: 40px;line-height: 40px;">{{item.meta.title}}</el-menu-item>-->
        <div
          class
          style="color: #ffffff;height: 40px;line-height: 40px;background-color: #393D49;padding-left: 20px;font-size: 16px;"
        >{{nav.meta.title}}</div>
        <li
          @click="clickroute(item.path)"
          v-for="(item,index) in nav.children"
          :key="index"
          v-if="!item.meta.auth || $authorities[item.meta.auth]"
          :class="{'is-active':item.path.split('/')[2]==$route.path.split('/')[2]}"
        >{{item.meta.title}}</li>
        <!-- <el-menu-item
          @click="clickroute(item.path)"
          v-for="(item,index) in nav.children"
          :key="index"
          v-if="!item.meta.auth || $authorities[item.meta.auth]"
          :index="item.path.split('/')[2]"
          style="height: 40px;line-height: 40px;"
        >{{item.meta.title}}</el-menu-item> -->
      </div>
    </ul>
    <!-- </el-menu> -->
  </div>
</template>
<script>
import navData from "./navData";
export default {
  data() {
    return {
      navs: [],
      show: null,
    };
  },
  created(){
    this.navs = navData[this.$route.path.split('/')[1]];
  },
  mounted() {
    // this.navs = navData[this.$route.path.split('/')[1]];
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    clickroute(url) {
      this.$router.push(url);
    },
    changeRoute() {}
  },
  watch: {
    $route(n, o) {
      this.navs = navData[n.path.split('/')[1]];
    }
  }
};
</script>

<style lang='less' scoped>
@import url("./Heftnav.css");
.leftnav {
  position: absolute;
  left: 0;
  top: 0px;
  width: 200px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: center;
  background-color: #393d49;
  transition: all 0.2s ease-out;
  ul{
    border-right: 1px solid #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    text-align: left;
    li{
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #303133;
      padding: 0 20px;
      list-style: none;
      cursor: pointer;
      position: relative;
      transition: border-color .3s,background-color .3s,color .3s;
      box-sizing: border-box;
      white-space: nowrap;
      color: #bcbcbc;
      background-color:#282b33;
      &:hover{
        background-color:#202229;
      }
    }
  }
}
</style>
