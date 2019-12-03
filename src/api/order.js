import request from '@/utils/request'

//获取所有信息列表
export function getCustomerConfirmationList(data) {
  return request({
    url: `/api/order-service/order/cargo-receipt/all-list`,
    method: 'post',
    data:data
  })
}

//获取所有订单状态以及数量
export function statusCount(){
    return request({
      url: `/api/order-service/order/cargo-receipt/status-count`,
      method: 'get'
    })
  }

//获取已确认信息列表
export function getConfirmed(data) {
  return request({
    url: `/api/order-service/order/cargo-receipt/pass-list`,
    method: 'post',
    data:data
  })
}

//获取待审核信息列表
export function getPendingReview(data) {
  return request({
    url: `/api/order-service/order/cargo-receipt/pending-review-list`,
    method: 'post',
    data:data
  })
}

//获取已驳回信息列表
export function getDismissed(data) {
  return request({
    url: `/api/order-service/order/cargo-receipt/reject-list`,
    method: 'post',
    data:data
  })
}

//获取订单操作记录
export function orderOperation(orderDeliveryId){
    return request({
      url: `/api/order-service/order/cargo-receipt/${orderDeliveryId}/detail-operation-log`,
      method: 'get'
    })
}

//客户签收凭证审核驳回
export function disallowance(data) {
  return request({
    url: `/api/order-service/order/cargo-receipt/reject`,
    method: 'put',
    data:data
  })
}

//客户签收凭证审核通过
export function approved(orderDeliveryId){
  return request({
    url: `/api/order-service/order/cargo-receipt/${orderDeliveryId}/pass`,
    method: 'put'
  })
}

//添加客户签收凭证信息
export function addCustomerCredentials(data) {
  return request({
    url: `/api/order-service/order/cargo-receipt/create`,
    method: 'post',
    data:data
  })
}