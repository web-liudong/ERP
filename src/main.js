import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import axios from 'axios'
import {Loading} from 'element-ui'
import auth from '@/utils/auth'
import 'element-ui/lib/theme-chalk/index.css'
import './style/global.less'
import '../theme/index.css'
import './style/btn.less'
import './directive/backTop.js'
import './directive/loadMore.js'
import './permission.js'
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import MessageTips from '@/components/common/ForcedOffline/index.js'

Vue.use(VueQuillEditor)
//'dev'开发
//'test'测试
Vue.prototype.$MessageTips=MessageTips
let loading;
function startLoading(){
//loading=Loading.service({
//  lock:true,
//  text:'拼命加载中...',
//  background:'rgba(0,0,0,0.7)'
//})

}
function endLoading(){
  loading.close()
}
Vue.prototype.$api = '/api'//打包之前需要修改成跟路径


Vue.prototype.$auth = auth;

var _hmt = _hmt || [];
window._hmt = _hmt;
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?74cf406706ad31b405593f76e1bc090a";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();

//网页title设置
router.beforeEach((to, from, next) => {
  if (to.meta.title) {//判断是否有标题
    document.title = to.meta.title
  }
  if (window._hmt) {
    if (to.path) {
      window._hmt.push(['_trackPageview', '/#' + to.path])
    }
  }
  next()//执行进入路由，如果不写就不会进入目标页
});

//全局事件对象
Vue.prototype.$eventHub= Vue.prototype.$eventHub || new Vue()

Vue.config.productionTip = false
Vue.config.devtools=true
Vue.use(ElementUI);

window.vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
