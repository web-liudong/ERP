import router from './router'
import store from './store/store'
import Vue from 'vue'
import {Message} from 'element-ui'
import auth from '@/utils/auth'
import { format } from 'upath'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    if (auth.token) {
      if (!auth.user) {// 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          console.log(res)
          next()
        }).catch((err) => {
          Message.error('获取信息失败，以返回登陆页')
          auth.token = null;
          next({path: '/login'})
        })
      } else {
        if (!Vue.prototype.$authorities) { //判断有没有权限信息并存储
          Vue.prototype.$authorities = auth.user.authorities;
        }

        // 通过to.meta.auth判断当前页面是否授权
        if (to.name == "home" || !to.meta.auth) {
          next(); 
        } else if (to.meta.auth) {
          if(window.vm && from.name != 'home'){
            if (vm.$router.app.$el.querySelector('.el-table__body-wrapper')){
              let tabScrollTop=vm.$router.app.$el.querySelector('.el-table__body-wrapper').scrollTop
              from.meta.tabScrollTop = tabScrollTop
              if (to.meta.tabScrollTop) {
                setTimeout(() => {
                  vm.$router.app.$el.querySelector('.el-table__body-wrapper').scrollTop = to.meta.tabScrollTop
                }, 10)
              }
            }
          }
          
          if (Object.prototype.toString.call(to.meta.auth) == "[object String]") {
            if (auth.user.authorities[to.meta.auth]) {
              next()
            } else {
              next('/homepage/home/homeindex');
              vm.$message({ type: "error", showClose: true, message: "当前用户未授权不能访问" })
            }
          } else {
            let isAuth = to.meta.auth.some(item => {
              return auth.user.authorities[item]
            })
            if (isAuth) {
              next()
            } else {
              next('/homepage/home/homeindex');
              vm.$message({ type: "error", showClose: true, message: "当前用户未授权不能访问" })
            }
          }
        } else {
          next('/homepage/home/homeindex');
          vm.$message({ type: "error", showClose: true, message: "当前用户未授权不能访问" })
        }
        
      }
    } else {
      next({ path: 'login', query: { redirect: to.path }})// 否则全部重定向到登录页
    }
  }
})