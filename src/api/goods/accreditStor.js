import request from '@/utils/request'
import api from '../index'
//授权库API
//后端：王若奥
//http://47.94.238.148:8085/swagger-ui.html#/%E6%8E%88%E6%9D%83%E5%BA%93API

//添加授权库信息
export function postAccreditAdd(data) {
  return request({
    url: api+'/authorization-service/authorization/',
    method: 'post',
    data:data,
    type:"json",
  })
}
//获取授权库详情
export function getAccreditDetaills(id) {
  return request({
    url: api+'/authorization-service/authorization/'+id+'/detail',
    method: 'get',
  })
}

//编辑授权库详情
export function getAccreditUptadeDetaills(id) {
  return request({
    url: api+'/authorization-service/authorization/'+ id +'/update-detail/',
    method: 'get',
  })
}
//修改授权库信息
export function putAccreditRedact(id,data) {
  return request({
    url: api+'/authorization-service/authorization/'+id,
    method: 'put',
    data:data,
    type:"json",
  })
}
//删除授权库
export function deleteAccreditDelete(id) {
  return request({
    url: api+'/authorization-service/authorization/'+id,
    method: 'delete',
  })
}
//查询授权库列表
export function postAccreditList(data) {
  return request({
    url: api+'/authorization-service/authorization/list',
    method: 'post',
    data:data,
    type:"json",
  })
}
//添加授权库日志信息
export function postAccreditAddLog(data) {
  return request({
    url: api+'/authorization-service/authorization/log/',
    method: 'post',
    data:data,
    type:"json",
  })
}

