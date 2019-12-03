import request from '@/utils/request'
import api from '../index'

//集采订单列表接口
export function purchaseList(data) {
  return request({
    url: api + '/purchase-service/centralized/purchase/list',
    method: 'post',
    data: data
  })
}
//集采单详情基本信息
export function getDetail(id) {
  return request({
    url: api+ `/purchase-service/centralized/purchase/${id}/detail`,
    method: 'get'
  })
}
//集采单详情明细信息
export function getDetailList(data) {
  return request({
    url: api + '/purchase-service/centralized/purchase/detail-list',
    method: 'post',
    data: data
  })
}

//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function getListName(data) {
  return request({
    url: api + '/user-service/organization/list/name',
    method: 'post',
    data:data
  })
}

//集采购订单导出
export function purchaseExport(data) {
  return request({
    url: api + '/purchase-service/centralized/purchase/export',
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}

//根据采购单明细Id保存待采数量
export function updateRequirementQty(data) {
  return request({
    url: api+'/purchase-service/centralized/purchase/update-requirementQty',
    method: 'put',
    data:data
  })
}

//新增了接口导出集中采购单详情
export function orderListExport(id) {
  return request({
    url: api + `/purchase-service/centralized/purchase/item-export?id=${id}`,
    method: 'post',
    responseType: 'blob'
  })
}