import request from '@/utils/request'
import api from '../index'
//仓库服务api
//后端：陈明亮
//http://47.94.238.148:8089/swagger-ui.html#/%E4%BB%93%E5%BA%93API

//创建配送线路
export function postDeliveryRoute(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/',
    method: 'post',
    data:data,
  })
}
//更新配送线路
export function putDeliveryRoute(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/',
    method: 'put',
    data: data,
  })
}
//删除配送线路
export function deleteDeliveryRoute(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id ,
    method: 'delete',
  })
}

//启用
export function putDeliveryRouteAvailable(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/available' ,
    method: 'put',
  })
}
//停用
export function putDeliveryRouteForbidden(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/forbidden' ,
    method: 'put',
  })
}
//详情
export function getDeliveryRouteDetail(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/detail' ,
    method: 'get',
  })
}
//编辑
export function getDeliveryRouteEdit(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/edit' ,
    method: 'get',
  })
}
//街道列表
export function getDeliveryRouteStreet(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/street' ,
    method: 'get',
  })
}
//导入
export function postDeliveryRouteImport(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/import',
    method: 'post',
    data:data,
  })
}
//导入记录
export function postDeliveryRouteImportList(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/import-list',
    method: 'post',
    data:data,
  })
}
//列表
export function postDeliveryRouteList(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/list',
    method: 'post',
    data:data,
  })
}


//状态
export function getDeliveryRouteStatus() {
  return request({
    url: api + '/warehouse-service/delivery-route/status' ,
    method: 'get',
  })
}

//更新街道
export function putDeliveryRouteStreet(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/street' ,
    method: 'put',
    data:data,
  })
}

//街道模板导出
export function postdownlogware(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/import-template' ,
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}


