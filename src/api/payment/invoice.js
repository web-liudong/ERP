import request from '@/utils/request'
let Host = '/api'

//订单结算状态列表页面
export function getBillStatusList(data) {
  return request({
    url: Host+`/bill-service/bill/bill-status-list`,
    method:'post',
    data:data
  })
}

//结算单详情
export function getBillDetail(id) {
  return request({
    url: Host+`/bill-service/bill/${id}/detail`,
    method:'get',
  })
}

//结算单详情-开票明细
export function getBillItemDetail(id,data) {
  return request({
    url: Host+`/bill-service/bill/${id}/order-item-list`,
    method:'post',
    data:data
  })
}

//结算单详情-开票明细导出
export function exportBillDetail(data) {
  return request({
    url: Host+`/bill-service/bill/order-list-export`,
    method:'post',
    params:data,
    responseType: 'blob'
  })
}

//发票记录列表
export function getInvoiceList(data) {
  return request({
    url: Host+`/bill-service/invoice/record/list`,
    method:'post',
    data:data
  })
}

//发票记录详情
export function getInvoiceDetails(id) {
  return request({
    url: Host+`/bill-service/invoice/record/${id}`,
    method:'get'
  })
}

//邮寄发票
export function setInvoicePost(id, data) {
  return request({
    url: Host+`/bill-service/invoice/record/${id}/post`,
    method:'put',
    data:data
  })
}

//完成发票
export function setInvoiceComplete(id, data) {
  return request({
    url: Host+`/bill-service/invoice/record/${id}/complete`,
    method:'put',
    data:data
  })
}

//红冲发票
export function setInvoiceRedWord(id, data) {
  return request({
    url: Host+`/bill-service/invoice/record/${id}/red-word`,
    method:'put',
    data:data
  })
}

//作废发票
export function setInvoiceInvalid(id) {
  return request({
    url: Host+`/bill-service/invoice/record/${id}/invalid`,
    method:'put'
  })
}

//发票导出
export function exportInvoiceRecord(data) {
  return request({
    url: Host+`/bill-service/invoice/record/export`,
    method:'post',
    data:data
  })
}

//发票批量邮寄
export function betchInvoicePost(id) {
  return request({
    url: Host+`/bill-service/invoice/record/post`,
    method:'put'
  })
}

//所有快递公司
export function getLocationExpress() {
  return request({
    url: Host+`/location-service/express`,
    method:'get'
  })
}

//手动切换结算状态
export function setStatusChange(orderId, operation) {
  return request({
    url: Host+`/bill-service/bill/${orderId}/${operation}/settled-status-change`,
    method:'put'
  })
}

//导出订单结算单状态列表
export function exportBillStatus(data) {
  return request({
    url: Host+`/bill-service/bill/export-bill-status-list`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}
//导出未邮寄的发票信息
export function exportUnpost() {
  return request({
    url: Host+`/bill-service/invoice/record/export-unpost`,
    method:'put'
  })
}