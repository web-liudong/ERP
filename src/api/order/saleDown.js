import request from '@/utils/request'
import api from '../index'
//根绝项目id 和 输入内容 查询客户列表 用作下拉框
export function customerNameList(data) {
  return request({
    url: api+'/customer-service/customer/name-list',
    method: 'post',
    data:data
  })
}
//根绝客户id 和输入内容 查询采购人 用作下拉框
export function customerUserNameList(data) {
  return request({
    url: api+'/user-service/customer/user/name-list',
    method: 'post',
    data:data
  })
}
//根绝客户ID获取 客户部门列表
export function customerUserGroupList(id,data) {
  return request({
    url: api+'/user-service/customer-department/name/list/'+id,
    method: 'post',
    data:data
  })
}
//根据采购人id获取对应所有收货人信息
export function consigneeInformation(id) {
  return request({
    url: api+'/user-service/customer/user/'+id+'/recipient-list',
    method: 'get',
  })
}
//获取商品下拉列表
export function likeOrderItemList(data) {
  return request({
    url: api+'/order-service/order/like-order-item-list',
    method: 'post',
    data:data
  })
}
//销售下单rep使用
export function addOrder(data) {
  return request({
    url: api+'/order-service/order/erp',
    method: 'post',
    data:data
  })
}

//销售下单保存并接单
export function erpAccept(data) {
  return request({
    url: api+'/order-service/order/erp-accept',
    method: 'post',
    data:data
  })
}
//编辑订单
export function editOrder(data, id, isMyOrder) {
  var url = isMyOrder ? api + '/order-service/order/own/' + id + '/chang' : api + '/order-service/order/' + id
  return request({
    url: url,
    method: 'put',
    data:data
  })
}

//第一服务方
export function firstEditOrder(data,id) {
  return request({
    url: api+'/order-service/order/'+id+'/first-server',
    method: 'put',
    data:data
  })
}
//第二服务方
export function secondEditOrder(data,id) {
  return request({
    url: api+'/order-service/order/'+id+'/second-server',
    method: 'put',
    data:data
  })
}

//订单详情-主信息
export function getDetail(id) {
  return request({
    url: api+'/order-service/order/'+id+'/detail',
    method: 'get',
  })
}
//订单详情-订单明细
export function getDetailItem(id) {
  return request({
    url: api+'/order-service/order/'+id+'/detail-item',
    method: 'get',
  })
}

export function customerEditDetail(id) {
  return request({
    url: api+'/customer-service/customer/'+id+'/edit',
    method: 'put',
  })
}

export function nameList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/bill/name-list',
    method: 'post',
    data:obj
  })
}

export function buttonShow(data) {
  return request({
    url: api+'/order-service/order/erp-accept/button',
    method: 'post',
    data:data
  })
}

//根据组织机构id，查询组织机构id和名称（后台服务使用）
export function getWms(id) {
  return request({
    url: api+'/user-service/organization/'+id+'/organizationtitle',
    method: 'get',
  })
}
//查询可用仓库数据 - 根据组织机构编号
export function getWarehouseList(id) {
  return request({
    url: api+'/warehouse-service/warehouse/'+id+'/list',
    method: 'get',
  })
}
//查询商品库存
export function getWmsSkuStock(data) {
  return request({
    url: api+`/warehouse-service/wms/inventory/list`,
    method:'post',
    data: data
  })
}

export function findCostPrice(data) {
  return request({
    url: api+`/statistics-service/inventory/record/find-cost-price`,
    method:'post',
    data: data
  })
}

export function permission(projectId,customerId) {
  return request({
    url: api+`/order-service/order/delivery/${customerId}/${projectId}/customer/permission`,
    method: 'get',
  })
}