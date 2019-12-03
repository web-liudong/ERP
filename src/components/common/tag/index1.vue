<template>
  <div class="tagWrap">
    <div class="zoom">
      <i :class="zoomCls" @click="handler"></i>
    </div>
    <div class="tags-view">
      <div id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
          <el-tag @click="redirectIndex" :type="$route.path=='/homepage/home/homeindex'?'':'info'">系统首页</el-tag>
          <el-tag closable disable-transitions v-for="(tag,index) in visitedViews" :key="tag.path" @click="redirectRoute(tag,$event)" @close="closeSelectedTag(tag,index)" :type="isActive(tag)?'':'info'" ref="tag" :to="tag" @contextmenu.prevent.native="openMenu(tag,$event)">{{ tag.title }}</el-tag>
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
      storageKey: this.$auth.user.id + "_OPEN_TAGS",
      visible: false, //控制右键弹框显示
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      visitedViews: []
    };
  },
  computed: {},
  created() {
    	this.visitedViews=JSON.parse(window.localStorage.getItem("tags")?window.localStorage.getItem("tags"):'[]')
  },
  watch: {
    $route(n, o) {
      //不添加标签页,走默认单页面跳转
      if (n.params.unTag) {
        this.replaceTag(n, o);
      } else {
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
      if (isCur) {
        this.selectedTag = route;
      }
      return isCur;
    },
    resetHeight() {
      //兼容FF、IE下button的样式
      if (getBrowserType() != "Chrome") {
        this.$refs.scrollPane.$children[0].$el.children[0].style.height =
          "67px";
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
      if(name=='home'){
        return false;
      }
      let tempArr = [],changeIndex;
      this.visitedViews.map((item, index) => {
        if (item.name == name) {
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
          title: this.$route.meta.title,
        };
        this.visitedViews.push(route);
      } else {
        //更新tab缓存中的query
        if (tempArr[0].fullPath != this.$route.fullPath) {
          const route = {
            name: this.$route.name,
            path: this.$route.path,
            fullPath: this.$route.fullPath,
            query: this.$route.query,
            title: this.$route.meta.title,
          };
          this.$set(this.visitedViews, changeIndex, route);
        }
      }
      this.updateIncludePage(this.$route.name);
    },
    updateIncludePage(name) {
      if (this.$store.state.app.includePages.indexOf(name) == -1) {
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
      let delIndex,
        delArr,
        curPathName = "",
        _to = null;

      if (!params) {
        curPathName = this.$route.name;
        this.visitedViews.forEach((item, index) => {
          if (item.name == curPathName) {
            delIndex = index;
          }
        });
        this.comstore(curPathName);
      } else {
        if (Object.prototype.toString.call(params) == "[object String]") {
          curPathName = params;
          this.comstore(curPathName);
        } else {
          if (Array.isArray(params.name)) {
            params.name.map((it, inx) => {
              this.comstore(it);
            });
          } else {
            curPathName = params.name;
            this.comstore(curPathName);
          }
          _to = params.to;
        }
      }

      if (_to) {
        this.$router.push(_to);
      } else {
        let route = this.visitedViews[delIndex - 1];
        this.$router.push({ name: route.name, query: route.query });
      }
    },
    comstore(curPathName) {
      let del;
      this.visitedViews.forEach((item, index) => {
        if (item.name == curPathName) {
          del = index;
        }
      });
      this.visitedViews.splice(del, 1);
      this.$store.commit("DEL_INCLUDE_PAGE", curPathName);
    },
    closeSelectedTag(view, index) {
      this.visitedViews.splice(index, 1);
      this.$store.commit("DEL_INCLUDE_PAGE", view.name);
      // this.$destroy(view.name)
      if (view.name == this.selectedTag.name) {
        let route = this.visitedViews[index - 1];
        this.$router.push({ name: route.name, query: route.query });
      }
    },
    replaceTag(newTag, oldTag) {
      if(oldTag.name=='home'){
        return fasle;
      }
      let replaceIndex;
      this.visitedViews.forEach((item, index) => {
        if (item.name == oldTag.name) {
          replaceIndex = index;
        }
      });
      const route = {
        name: newTag.name,
        path: newTag.path,
        fullPath: newTag.fullPath,
        query: newTag.query,
        title: newTag.meta.title,
        affix: true
      };
      this.$set(this.visitedViews, replaceIndex, route);
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
    redirectRoute(tag, event) {
      this.$router.push({ name: tag.name, query: tag.query });
    },
    redirectIndex() {
      this.$router.push({ name: 'home'});
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
  .tags-view {
    flex: 1;
    overflow: hidden;
    .tags-view-container {
      flex: 1;
      height: 50px;
      .tags-view-wrapper{
        .el-tag{
          margin-right:5px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
