import request from '@/utils/request'
import api from '../index'
//退单管理api
//后端：潘二飞
//http://47.94.238.148:8015/swagger-ui.html#/退单管理
//状态数量
export function getReturnOrderStatusCount(id) {
  return request({
    url: api + '/order-service/returnorder/status-count',
    method: 'get',
  })
}
//退单详情
export function getReturnOrderDetaills(id) {
  return request({
    url: api + '/order-service/returnorder/'+id,
    method: 'get',
  })
}
//退单关闭
export function putReturnOrderClose(id,data) {
  return request({
    url: api + '/order-service/returnorder/'+ id +'/close',
    method: 'put',
    data: data,
  })
}

//退单完成
export function putReturnOrderComplete(id) {
  return request({
    url: api + '/order-service/returnorder/'+ id +'/complete',
    method: 'put',
    data:id,
  })
}
//退单确认
export function putReturnOrderConfirm(id,data) {
  return request({
    url: api + '/order-service/returnorder/'+ id +'/confirm',
    method: 'put',
    data: data,
  })
}

//查询关闭列表
export function postReturnOrderClosedList(data) {
  return request({
    url: api + '/order-service/returnorder/closed-list',
    method: 'post',
    data:data,
  })
}
//查询完成列表
export function postReturnOrderCompletedList(data) {
  return request({
    url: api + '/order-service/returnorder/completed-list',
    method: 'post',
    data:data,
  })
}
//查询全部列表
export function postReturnOrderList(data) {
  return request({
    url: api + '/order-service/returnorder/list',
    method: 'post',
    data:data,
  })
}

//查询待退货列表
export function postReturnOrderPendingReturnedList(data) {
  return request({
    url: api + '/order-service/returnorder/pending-returned-list',
    method: 'post',
    data:data,
  })
}
//查询待确认列表
export function postReturnOrderPendingConfirmedList(data) {
  return request({
    url: api + '/order-service/returnorder/pending-confirmed-list',
    method: 'post',
    data:data,
  })
}
//查询退货中列表
export function postReturnOrderReturningList(data) {
  return request({
    url: api + '/order-service/returnorder/returning-list',
    method: 'post',
    data:data,
  })
}

//查询外部退货单列表
export function getOutsideReturnOrder(data) {
  return request({
    url: api + '/order-service/customerorder/list',
    method: 'post',
    data:data,
  })
}

//状态数量
export function getOutsideReturnOrderStatusCount() {
  return request({
    url: api + '/order-service/customerorder/status-total',
    method: 'get',
  })
}

//同意外部退单
export function outsideReturnOrderPass(id) {
  return request({
    url: api + `/order-service/customerorder/${id}/pass`,
    method: 'get',
  })
}

//拒绝外部退单
export function outsideReturnOrderReject(id, data) {
  return request({
    url: api + `/order-service/customerorder/${id}/reject`,
    method: 'post',
    data:data
  })
}

//完成外部退单
export function outsideReturnOrderCompleted(id) {
  return request({
    url: api + `/order-service/customerorder/${id}/completed`,
    method: 'get',
  })
}

//关闭外部退单
export function outsideReturnOrderClose(id, data) {
  return request({
    url: api + `/order-service/customerorder/${id}/close`,
    method: 'post',
    data:data
  })
}

//外部退单详情
export function getOutsideReturnOrderDetaills(id) {
  return request({
    url: api + `/order-service/customerorder/${id}/detail`,
    method: 'get',
  })
}
