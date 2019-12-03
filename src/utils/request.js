import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store/store'
import auth from '@/utils/auth'
import MessageTips from '@/components/common/ForcedOffline/index.js'
import router from '../router'

// 创建axios实例
const service = axios.create({// api 的 base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // console.log(store.getters.token)
    if (auth.token) {
      config.headers['Authorization'] = "Bearer " + auth.token // 让每个请求携带自定义token 请根据实际情况自行修改
    } else {
      config.headers['Authorization'] = "Basic V0VCQVBQOldFQkFQUA=="
    }
    !config.unloading && store.dispatch('reviseLoading', true)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    store.dispatch('reviseLoading', false)

    const res = response.data
    if (res.code) {
      
      if (res.code != '000000' && res.code != '000000000' && /^98/.test(res.code) && !response.config.exception) {//自定义异常处理不走默认异常处理
        Message({
          message: res.message,
          showClose: true,
          type: 'error',
        })

        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;

        return response.data
      } else {
        return response.data
      }
    } else {
      return response.data
    }


  },
  error => {
    console.log('err' + error) // for debug
    console.log(error.response)
    store.dispatch('reviseLoading', false)
    //98开头的code吗 或者 自定义异常处理不走默认异常处理 010090066的code是参数模板状态发生变化的状态码
    if((error.response.data && /^98/.test(error.response.data.code)) || (error.response.config && error.response.config.exception)){
      return error.response.data;
    }
//  MessageTips({
//  	message:'您的账号已经被停止使用，如有疑问，请联系管理员'
//  })
    Message({
      message: (error.response && error.response.data && error.response.data.data && error.response.data.data.error_description) || (error.response && error.response.data && error.response.data.message) || (error.response && error.response.statusText) || error.message,
      showClose: true,
      type: 'error',
    })
    
    // console.log(error.response);
    const { status } = error.response
    if (status == 401) {
      router.push('/login')
    }
    console.log(Promise.reject)
    return Promise.reject(error)
  }
)

export default service
