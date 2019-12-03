import request from '@/utils/request'
import api from '../index'


//创建配送线路
export function postNewDeliveryRoute(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/',
    method: 'post',
    data:data,
  })
}

//删除配送线路
export function deleteNewDeliveryRoute(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id ,
    method: 'delete',
  })
}

//启用
export function putNewDeliveryRouteAvailable(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/available' ,
    method: 'put',
  })
}
//停用
export function putNewDeliveryRouteForbidden(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/forbidden' ,
    method: 'put',
  })
}

//编辑
export function putDeliveryRoutesEdits(id,data) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+ id +'/edit' ,
    method: 'put',
    data:data,
  })
}

//下载导入模板
export function getNewDeliveryRouteImport(provinceId) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+provinceId+'/import-template',
    method: 'get',
    data:provinceId,
    responseType: 'blob'
  })
}
//导入记录
export function postNewDeliveryRouteImportList(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/import-list',
    method: 'post',
    data:data,
  })
}
//导入线路数据清除新增
export function postNewDeliverycClearImport(warehouseId) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+warehouseId+'/clearImport',
    method: 'post',
    data:warehouseId,
  })
}
//导入线路数据更新
export function postNewDeliverycUpdateImport(warehouseId) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+warehouseId+'/updateImport',
    method: 'post',
    data:warehouseId,
  })
}

//map方式分配线路
export function getMapDeliveryRouteStatus(id,routeId) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+id+'/resetMap/'+routeId,
    method: 'put',
    data:id,
  })
}

//切换当前仓库路线分配模式
export function getDeliverySwitchingMode(wareId,typeId) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+wareId+'/switch-type/'+typeId,
    method: 'put',
    data:wareId,
  })
}

//分配模式-按客户地址人工配置列表
export function postManualConfigurationList(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/artificial-list',
    method: 'post',
    data:data,
  })
}

//分配模式-按地图街道信息配置列表
export function postMapStreetList(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/map-list',
    method: 'post',
    data:data,
  })
}

//检查并新增待编辑地址
export function postAddedAddress(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/createDeliveryRoute',
    method: 'post',
    data:data,
  })
}

//删除当前分配的路线信息
export function getDeleteList(id) {
  return request({
    url: api + '/warehouse-service/delivery-route/delete/'+id,
    method: 'delete',
    data:id,
  })
}

//查看配送路线列表
export function postNewDeliveryRouteList(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/list',
    method: 'post',
    data:data,
  })
}
//customer方式分配线路
export function postAddedAddasdasress(data) {
  return request({
    url: api + '/warehouse-service/delivery-route/resetCustommer',
    method: 'put',
    data:data,
  })
}


//获取当前仓库的线路分配模式
export function postModelLineDistribution (wareId) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+wareId+'/routeType',
    method: 'get',
    data:wareId,
  })
}

//查询仓库配送路线
export function postChangeList (id) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+id+'/deliveryroute',
    method: 'get',
    data:id,
  })
}


//查询仓库配送路线
export function getProjectList (id,name) {
  return request({
    url: api + '/warehouse-service/delivery-route/'+id+'/project-list/'+name,
    method: 'get',
    data:id,
  })
}

