import request from '@/utils/request'
import api from '../index'
//仓库服务api
//后端：陈明亮
//http://47.94.238.148:8089/swagger-ui.html#/%E4%BB%93%E5%BA%93API

//新建并查找库区
export function postWarehouseLocationCreate(data) {
  return request({
    url: api + '/warehouse-service/warehouse/location/',
    method: 'post',
    data:data,
  })
}
//编辑区位
export function putWarehouseLocationUpdate(id,data) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id,
    method: 'put',
    data: data,
  })
}
//删除区位
export function deleteWarehouseLocationDelete(id) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id,
    method: 'delete',
  })
}
//获取编辑时的库位信息

export function getWarehouseLocationUpdateDetaills(id) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id,
    method: 'get',
  })
}

//启用区位
export function putWarehouseLocationActivate(id) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id + '/activate',
    method: 'put',
  })
}
//禁用区位
export function putWarehouseLocationForbid(id) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id + '/forbid',
    method: 'put',
  })
}
//打印
export function getWarehouseLocationPrint(id) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id + '/print',
    method: 'get',
  })
}
//查询区位列表
export function getWarehouseLocationAreaLlist(id) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id + '/area-list',
    method: 'get',
  })
}

//查询区位编码列表
export function getWarehouseLocationAreanoList(id) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+id + '/areano-list',
    method: 'get',
  })
}

//批量打印
export function postWarehouseLocationBatchPrint(data) {
  return request({
    url: api + '/warehouse-service/warehouse/location/batch-print',
    method: 'post',
    data:data,
  })
}
//查询库位列表

export function postWarehouseLocationList(data) {
  return request({
    url: api + '/warehouse-service/warehouse/location/list',
    method: 'post',
    data:data,
  })
}
//打印-位列表
export function getWarehouseCellNoList(id,areaNo,routeWayNo,shelfNo,levelNo) {
  return request({
    url: api + '/warehouse-service/warehouse/location/' + id + '/'+ areaNo +'/'+ routeWayNo +'/'+ shelfNo +'/'+ levelNo +'/routeway-no-list',
    method: 'get',
  })
}

//打印-货架层数列表
export function getWarehouseLevelNoList(id,areaNo,routeWayNo,shelfNo) {
  return request({
    url: api + '/warehouse-service/warehouse/location/' + id + '/'+ areaNo +'/'+ routeWayNo +'/'+ shelfNo +'/routeway-no-list',
    method: 'get',
  })
}

//打印-货架列表
export function getWarehouseShelfNoList(id,areaNo,routeWayNo) {
  return request({
    url: api + '/warehouse-service/warehouse/location/' + id + '/'+ areaNo +'/'+ routeWayNo +'/routeway-no-list',
    method: 'get',
  })
}

//打印-通道列表
export function getWarehouseRoutewayNoList(id,areaNo) {
  return request({
    url: api + '/warehouse-service/warehouse/location/'+ id +'/' + areaNo + '/routeway-no-list',
    method: 'get',
  })
}
