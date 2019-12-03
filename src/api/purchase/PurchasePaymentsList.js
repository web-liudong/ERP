import request from '@/utils/request'
import api from '../index.js'

// 获取采购付款单详情
export function getPurchasePaymentDetails(id) {
  return request({
    url: api + '/purchase-service/purchase/payable/'+ id,
    method: 'get',
    data: id,
  })
}

// 取消采购付款单
export function  postPaymentFormCancellation(id,data) {
  return request({
    url: api + '/purchase-service/purchase/payable/'+ id +'/cancel',
    method: 'post',
    data: data,
  })
}


// 关闭采购付款单
export function postClosepaymentBill(id,data) {
  return request({
    url: api + '/purchase-service/purchase/payable/'+ id +'/close',
    method: 'post',
    data: data,
  })
}


// 采购付款单详情数据导出
export function getPaymentExportBill(id) {
  return request({
    url: api + '/purchase-service/purchase/payable/'+ id +'/export',
    method: 'get',
    data: id,
  })
}

// 获取采购付款单列表-全部
export function postPurchasePaymentsListAll(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/all-list',
    method: 'post',
    data: data,
  })
}

// 获取采购付款单列表-已完成
export function postPurchasePaymentsListCompleted(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/completed-list',
    method: 'post',
    data: data,
  })
}


// 采购付款单数据导出
export function postPaymentExportBill(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/export',
    method: 'post',
    data: data,
  })
}


// 导入采购付款单信息
export function postImportPaymentInformation(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/import',
    method: 'post',
    data: data,
  })
}


// 采购付款单列表-部分完成
export function postPurchasePaymentsListPartiallycompleted(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/partly-completed-list',
    method: 'post',
    data: data,
  })
}


// 采购付款单付款
export function postPurchasePaymentsPayment(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/payment',
    method: 'post',
    data: data,
  })
}



// 采购付款单付款记录
export function postPurchasePaymentrecord(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/payment/list',
    method: 'post',
    data: data,
  })
}




// 采购付款单列表-待付款
export function postPurchasePaymentsListPending(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/pending-payment-list',
    method: 'post',
    data: data,
  })
}

// 采购付款单数量
export function postCountData(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/count',
    method: 'get',
    data: data,
  })
}


// 采购导入记录
export function postPaymentRecord(data) {
  return request({
    url: api + '/purchase-service/purchase/payable/import-file-log/list ',
    method: 'post',
    data: data,
  })
}



// 采购导入记录
export function postUndoClosed(id) {
  return request({
    url: api + '/purchase-service/purchase/payable/'+id+'/cancel-already-closed ',
    method: 'put',
    data: id,
  })
}
