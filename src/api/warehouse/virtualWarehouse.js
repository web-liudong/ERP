import request from '@/utils/request'
import api from '../index'
//仓库服务api
//后端：陈明亮
//http://47.94.238.148:8089/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BB%93%E5%BA%93API



export function getvirtualWarehouseinfopurview(id) {                 //查询仓库查看权限列表
  return request({
    url: api + '/warehouse-service/virtual-warehouse/'+ id +'/infopurview',
    method: 'get',
  })
}
export function putvirtualWarehouseinfopurview(id,data) {               //更新仓库查看权限
  return request({
    url: api + '/warehouse-service/virtual-warehouse/'+ id +'/infopurview',
    method: 'put',
    data: data,
  })
}

//查找虚拟仓库的SKU详情
export function postVirtualWarehouseSkuDetail(data) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/sku-detail-list',
    method: 'post',
    data:data,
  })
}
//创建虚拟仓库
export function postVirtualWarehouseCreate(data) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/',
    method: 'post',
    data:data,
  })
}
//更新虚拟仓库
export function putVirtualWarehouseUpdated(id,data) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/'+id ,
    method: 'put',
    data:data,
  })
}
//删除虚拟仓库
export function deleteVirtualWarehouseDelete(id) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/'+id,
    method: 'delete',
  })
}
//虚拟仓库详情
export function getVirtualWarehouseDetaills(id) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/'+ id +'/detail',
    method: 'get',
  })
}
//获取编辑信息
export function getVirtualWarehouseUpdateDetaills(id) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/'+ id +'/update-detail',
    method: 'get',
  })
}

//虚拟仓库列表
export function postVirtualWarehouseList(data) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/list',
    method: 'post',
    data:data,
  })
}

//查找关联仓库-分页
export function postVirtualWarehouseRelatedList(data) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/related-list',
    method: 'post',
    data:data,
  })
}
//查找关联仓库-全部
export function postVirtualWarehouseRelatedListAll(data) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/related-list-all',
    method: 'post',
    data:data,
  })
}

//查找虚拟仓库的SKU
export function postVirtualWarehouseSKUList(data) {
  return request({
    url: api + '/warehouse-service/virtual-warehouse/sku-list',
    method: 'post',
    data:data,
  })
}

//获取可用仓库列表
export function postWarehouseList(data) {
  return request({
    url: api + '/warehouse-service/warehouse/list',
    method: 'post',
    data:{},
  })
}


export function postVirtualWarehouseViewedby(data) {
  return request({
    url: api + '/warehouse-service/warehouse/inventory',
    method: 'post',
    data:data,
  })
}
