import { login, logout, getInfo } from '@/api/login'
import auth from '@/utils/auth'

const user = {
  state: {
    token: auth.toekn,
    name: '',
    avatar: '',
    //用户信息
    roles: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      //    const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response.access_token
          auth.token = data;
          //setToken(data)
          commit('SET_TOKEN', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          Cookies.set('Token', response.data.token) //登录成功后将token存储在cookie之中
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }, data) {
      if (data) {
        return new Promise((resolve, reject) => {
          getInfo(data).then(response => {
            const dataa = response.data
            auth.user = dataa;
            //setUserInfo(JSON.stringify(dataa))
            //        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', dataa)
            //        } else {
            //          reject('getInfo: roles must be a non-null array !')
            //        }
            //        commit('SET_NAME', data.name)
            //        commit('SET_AVATAR', data.avatar)
            resolve(response)
          }).catch(error => {
            // 清除token
            auth.token = null;
            //removeToken()

            // 页面跳转
            vm.$router.push('/login')

            reject(error)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          getInfo().then(response => {
            const dataa = response.data
            auth.user = dataa;
            //setUserInfo(JSON.stringify(dataa))
            //        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            //          commit('SET_ROLES', data)
            //        } else {
            //          reject('getInfo: roles must be a non-null array !')
            //        }
            //        commit('SET_NAME', data.name)
            //        commit('SET_AVATAR', data.avatar)
            resolve(response)
          }).catch(error => {
            auth.user = null;
            auth.token = null;
            vm.$router.push('/login')
            reject(error)
          })
        })
      }

    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          auth.token = null;
          //removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        auth.token = null;
        //removeToken()
        resolve()
      })
    }
  },




}

export default user

