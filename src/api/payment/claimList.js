import request from '@/utils/request'
import api from '../index'
//
//后端： 苏哲
//http://47.94.238.148:8017/swagger-ui.html#/认款/backPaymentReceivedUsingPUT


//退回至回款信息列表
export function putClaimBackPaymentrReceived(id) {
  return request({
    url: api + '/bill-service/payment-received/claim/'+ id +'/back-payment-received' ,
    method: 'put',
  })
}
//认款操作页面
export function getcClaimPage(id) {
  return request({
    url: api + '/bill-service/payment-received/claim/'+ id +'/claim-page',
    method: 'get',
  })
}

//认款确认
export function putClaimConfirm(id,data) {
  return request({
    url: api + '/bill-service/payment-received/claim/'+ id +'/confirm' ,
    method: 'put',
    data:data,
  })
}

//认款详情
export function getcClaimDetail(id) {
  return request({
    url: api + '/bill-service/payment-received/claim/'+ id +'/detail',
    method: 'get',
  })
}


//关联订单查询
export function postClaimFindOrderList(data) {
  return request({
    url: api + '/bill-service/payment-received/claim/find-order-list',
    method: 'post',
    data:data,
  })
}

//认款列表
export function postClaimList(data) {
  return request({
    url: api + '/bill-service/payment-received/claim/list',
    method: 'post',
    data:data,
  })
}


//认款状态统计
export function getcClaimStatusCount() {
  return request({
    url: api + '/bill-service/payment-received/claim/status-count',
    method: 'get',
  })
}
