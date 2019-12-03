<template>
  <div class="tagWrap">
    <div class="zoom">
      <i :class="zoomCls" @click="handler"></i>
    </div>
    <div class="tags-view">
      <div id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
          <!-- <router-link
            v-for="(tag,index) in visitedViews"
            ref="tag"
            :key="tag.path"
            :class="isActive(tag)?'active':''"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            tag="span"
            class="tags-view-item"
            @contextmenu.prevent.native="openMenu(tag,$event)"
          > -->
          <el-button
            v-for="(tag,index) in visitedViews"
            ref="tag"
            :key="tag.path"
            :to="tag"
            :class="isActive(tag)?'active':''"
            class="tags-view-item"
            @click="redirectRoute(tag,$event)"
            @contextmenu.prevent.native="openMenu(tag,$event)"
          >
            {{ tag.title }}
            <span
              v-if="tag.name != 'home'"
              class="el-icon-close"
              @click.prevent.stop="closeSelectedTag(tag,index)"
            />
          </el-button>
          <!-- </router-link> -->
        </scroll-pane>
      </div>
    </div>
    <div class="zoom"></div>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import { getBrowserType } from "@/utils/index";

export default {
  components: { ScrollPane },
  data() {
    return {
      iszoom: false,
      zoomCls: "iconfont iconshousuo",
      storageKey:this.$auth.user.id+'_OPEN_TAGS',
      visible: false,//控制右键弹框显示
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      visitedViews: []
    };
  },
  computed: {
  },
  created() {
    //	this.visitedViews=JSON.parse(window.localStorage.getItem("tags")?window.localStorage.getItem("tags"):'[]')
    let getTags = JSON.parse(window.sessionStorage.getItem(this.storageKey));
    if (getTags) {
      this.visitedViews = getTags;
    } else {
      this.visitedViews = [
        {
          name: "home",
          path: "/homepage/home/homeindex",
          fullPath: "/homepage/home/homeindex",
          query: {},
          title: "系统首页"
        }
      ];
    }
  },
  watch: {
    $route(n, o) {
      //不添加标签页,走默认单页面跳转
      if(n.params.unTag){
        this.replaceTag(n, o);
      }else{
        this.addTags();
        this.moveToCurrentTag();
      }
    },
    // visible(value) {
    //   if (value) {
    //     document.body.addEventListener("click", this.closeMenu);
    //   } else {
    //     document.body.removeEventListener("click", this.closeMenu);
    //   }
    // },
    visitedViews(a, b) {
      window.sessionStorage.setItem(this.storageKey, JSON.stringify(a));
    }
  },
  mounted() {
    this.$eventHub.$off("TAGS_DELETE_ITEM");
    this.$eventHub.$on("TAGS_DELETE_ITEM", this.closeEmitTag);
    this.includePages;
    //  this.initTags()
    this.addTags();
    this.resetHeight();
  },
  methods: {
    isActive(route) {
      let isCur = route.path === this.$route.path;
      if(isCur){
        this.selectedTag = route;
      }
      return isCur;
    },
    resetHeight(){
      //兼容FF、IE下button的样式
      if(getBrowserType() != "Chrome"){
        this.$refs.scrollPane.$children[0].$el.children[0].style.height = '67px';
      }
    },
    handler() {
      this.iszoom = !this.iszoom;
      this.zoomCls = this.iszoom
        ? "iconfont iconkuozhan"
        : "iconfont iconshousuo";
      this.$emit("callback");
    },
    initTags() {
      // const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      // for (const tag of affixTags) {
      //   // Must have tag name
      //   if (tag.name) {
      //     this.$store.dispatch("tagsView/addVisitedView", tag);
      //   }
      // }
    },
    addTags() {
      const { name } = this.$route;
      let tempArr = [] , changeIndex;
      this.visitedViews.map((item,index) => {
        if(item.name == name){
          changeIndex = index;
          tempArr.push(item);
        }
      });
      if (!tempArr.length) {
        const route = {
          name: this.$route.name,
          path: this.$route.path,
          fullPath: this.$route.fullPath,
          query: this.$route.query,
          title: this.$route.meta.title
        };
        this.visitedViews.push(route);
      }else{
        //更新tab缓存中的query
        if(tempArr[0].fullPath != this.$route.fullPath){
          const route = {
            name: this.$route.name,
            path: this.$route.path,
            fullPath: this.$route.fullPath,
            query: this.$route.query,
            title: this.$route.meta.title
          };
          this.$set(this.visitedViews, changeIndex , route);
        }
      }
      this.updateIncludePage(this.$route.name);
    },
    updateIncludePage(name){
      if(this.$store.state.app.includePages.indexOf(name) == -1){
        this.$store.commit("ADD_INCLUDE_PAGE", this.$route.name);
      }
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          //if (tag.to.path === this.$route.path) {
          if (tag.$attrs.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            // if (tag.to.fullPath !== this.$route.fullPath) {
            //   this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            // }
            break;
          }
        }
      });
    },
    closeEmitTag(params) {
      let delIndex, delArr,curPathName = '', _to = null;
      
      if(!params){
        curPathName = this.$route.name;
        this.visitedViews.forEach( (item, index) => {
        if(item.name == curPathName){
          delIndex = index;
        }
      	})
        this.comstore(curPathName)
      }else{
        if(Object.prototype.toString.call(params) == '[object String]'){
          curPathName = params;
          this.comstore(curPathName)
        }else{
          if(Array.isArray(params.name)){
          	params.name.map((it,inx)=>{
          		this.comstore(it)
          	})
          }else{
          	curPathName = params.name;
          	this.comstore(curPathName)
          }
          _to = params.to;
        }
      }
      
      if(_to){
        this.$router.push(_to);
      }else{
        let route = this.visitedViews[delIndex - 1];
        this.$router.push({ name: route.name, query: route.query });
      }
    },
    comstore(curPathName){
    	let del
    	this.visitedViews.forEach( (item, index) => {
        if(item.name == curPathName){
          del = index;
        }
      })
      this.visitedViews.splice(del, 1);
      this.$store.commit("DEL_INCLUDE_PAGE", curPathName);
    },
    closeSelectedTag(view, index) {
      this.visitedViews.splice(index, 1);
      this.$store.commit("DEL_INCLUDE_PAGE", view.name);
      // this.$destroy(view.name)
      if(view.name == this.selectedTag.name){
        let route = this.visitedViews[index - 1];
        this.$router.push({ name: route.name, query: route.query });
      }
    },
    replaceTag(newTag, oldTag){
      let replaceIndex;
      this.visitedViews.forEach( (item, index) => {
        if(item.name == oldTag.name){
          replaceIndex = index;
        }
      })
      const route = {
        name: newTag.name,
        path: newTag.path,
        fullPath: newTag.fullPath,
        query: newTag.query,
        title: newTag.meta.title
      };
      this.$set(this.visitedViews, replaceIndex , route);
      this.$store.commit("ADD_INCLUDE_PAGE", newTag.name);
      this.$store.commit("DEL_INCLUDE_PAGE", oldTag.name);
    },
    refreshSelectedTag(view) {
      // this.$store.dispatch("tagsView/delCachedView", view).then(() => {
      //   const { fullPath } = view;
      //   this.$nextTick(() => {
      //     this.$router.replace({
      //       path: "/redirect" + fullPath
      //     });
      //   });
      // });
    },
    closeOthersTags() {
      // this.$router.push(this.selectedTag);
      // this.$store
      //   .dispatch("tagsView/delOthersViews", this.selectedTag)
      //   .then(() => {
      //     this.moveToCurrentTag();
      //   });
    },
    closeAllTags(view) {
      // this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
      //   if (this.affixTags.some(tag => tag.path === view.path)) {
      //     return;
      //   }
      //   this.toLastView(visitedViews, view);
      // });
    },
    toLastView(visitedViews, view) {
      // const latestView = visitedViews.slice(-1)[0];
      // if (latestView) {
      //   this.$router.push(latestView);
      // } else {
      //   // now the default is to redirect to the home page if there is no tags-view,
      //   // you can adjust it according to your needs.
      //   if (view.name === "Dashboard") {
      //     // to reload home page
      //     this.$router.replace({ path: "/redirect" + view.fullPath });
      //   } else {
      //     this.$router.push("/");
      //   }
      // }
    },
    redirectRoute(tag, event){
      this.$router.push({ name: tag.name, query: tag.query });
    },
    //右键弹框
    openMenu(tag, e) {
      // const menuMinWidth = 105;
      // const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      // const offsetWidth = this.$el.offsetWidth; // container width
      // const maxLeft = offsetWidth - menuMinWidth; // left boundary
      // const left = e.clientX - offsetLeft + 15; // 15: margin right

      // if (left > maxLeft) {
      //   this.left = maxLeft;
      // } else {
      //   this.left = left;
      // }

      // this.top = e.clientY;
      // this.visible = true;
      // this.selectedTag = tag;
    },
    closeMenu() {
      // this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.tagWrap {
  height: 50px;
  line-height: 50px;
  display: flex;
  border-bottom: 3px solid #fff;
  .zoom {
    width: 45px;
    flex: 0 0 45px;
    padding-left: 5px;
    .iconfont {
      font-size: 20px;
      color: #000;
      cursor: pointer;
    }
  }
  .tags-view{
    flex:1;
    overflow: hidden;
    .tags-view-container {
      flex: 1;
      height: 50px;
      .tags-view-wrapper {
        .tags-view-item {
          display: inline-block;
          position: relative;
          cursor: pointer;
          height: 32px;
          line-height: 32px;
          color: #666;
          background: #fafafa;
          padding: 0 10px;
          font-size: 13px;
          margin-left: 5px;
          border: 1px solid #e8e8e8;
          border-radius: 4px 4px 0 0;
          top:6px;
          /*margin-top: 4px;*/
          &:first-of-type {
            margin-left: 5px;
          }
          &:last-of-type {
            margin-right: 15px;
          }
          &:hover{
            color: #339999;
            border-color: #c2e0e0;
            background-color: #ebf5f5;
          }
          &.active {
            background-image: linear-gradient(to bottom, #ebf5f5, #fff);
            border-color: #c2e0e0;
            color: #399;
            height: 36px;
            line-height: 34px;
            padding-bottom: 1px;
            border-bottom:0;
            top: 7px;
          }
        }
      }
      .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
          margin: 0;
          padding: 7px 16px;
          cursor: pointer;
          &:hover {
            background: #eee;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
