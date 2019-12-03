import request from '@/utils/request'
import api from './index'
export function login(data) {
  return request({
    url: api + '/user-service/oauth/token',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'mac': data.mac
    },
    data: data.user,
    unloading:true
  })
}
export function getInfo(token) {
  return request({
    url: api + '/user-service/user/getUserInfo',
    method: 'get',
    unloading:true
  })
}

export function wang(token) {
  return request({
    url: '/api/authorization/service-api/authorization/12',
    method: 'get',

  })
}

export function logout() {

}
