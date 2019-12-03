import request from '@/utils/request'

//根据状态统计数量
export function statusCount() {
  return request({
    url: '/api/purchase-service/purchase/invoice/status-count',
    method: 'get'
  })
}

//根据查询条件，返回全部列表
export function alllist(data) {
  return request({
    url: '/api/purchase-service/purchase/invoice/all-list',
    method: 'post',
    data:data
  })
}
//根据查询条件，返回待审批列表
export function approvallist(data) {
  return request({
    url: '/api/purchase-service/purchase/invoice/approval-list',
    method: 'post',
    data:data
  })
}
//根据查询条件，返回已通过列表
export function passlist(data) {
  return request({
    url: '/api/purchase-service/purchase/invoice/pass-list',
    method: 'post',
    data:data
  })
}
//根据查询条件，返回已完成列表
export function completedlist(data) {
  return request({
    url: '/api/purchase-service/purchase/invoice/completed-list',
    method: 'post',
    data:data
  })
}

//根据查询条件，返回部分通过列表
export function partiallylist(data) {
  return request({
    url: '/api/purchase-service/purchase/invoice/partially-list',
    method: 'post',
    data:data
  })
}

//根据查询条件，返回已驳回列表
export function rejectlist(data) {
  return request({
    url: '/api/purchase-service/purchase/invoice/reject-list',
    method: 'post',
    data:data
  })
}
//发票详情
export function detail(id) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${id}/detail`,
    method: 'get'
  })
}
//根据结算单编号查询采购信息
export function purasebillList(billNo) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${billNo}/purasebill-list`,
    method: 'get'
  })
}
//发票导出
export function exportinvoice(invoiceId) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${invoiceId}/export`,
    method: 'get'
  })
}
//编辑回显
export function invoiceedit(invoiceId) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${invoiceId}/invoice-editing`,
    method: 'get'
  })
}

//详情结算单
export function purchasebill(id) {
  return request({
    url: `/api/purchase-service/purchasebill/${id}/detail`,
    method: 'get'
  })
}

//审核通过
export function invoicepass(id,data) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${id}/pass`,
    method: 'post',
    data:data
  })
}
//审核驳回
export function invoicereject(data) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${data.invoiceId}/reject`,
    method: 'post',
    data:data
  })
}
//结算发票详情
export function invoicedet(id) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${id}`,
    method: 'get'
  })
}

//完成
export function invoicComplete(id) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${id}/complete`,
    method: 'get'
  })
}





