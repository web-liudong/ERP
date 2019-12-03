import request from '@/utils/request'
//根据状态统计数量
export function statusCount() {
  return request({
    url: '/api/purchase-service/centerPurchase/invoice/status-count',
    method: 'get'
  })
}
//根据查询条件，返回全部列表
export function allList(data) {
  return request({
    url: '/api/purchase-service/centerPurchase/invoice/all-list',
    method: 'post',
    data:data
  })
}
//开票记录
export function findExportFile(data) {
  return request({
    url: '/api/purchase-service/centerPurchase/invoice/find-export-file',
    method: 'post',
    data:data
  })
}
//发票详情
export function groupDetail(id) {
  return request({
    url: `/api/purchase-service/centerPurchase/invoice/${id}/detail`,
    method: 'get'
  })
}

//开票
export function invoice(id) {
  return request({
    url: `/api/purchase-service/centerPurchase/invoice/issue/invoiceid/${id}`,
    method: 'get'
  })
}
//驳回
export function reject(data) {
  return request({
    url: `/api/purchase-service/centerPurchase/invoice/reject`,
    method: 'post',
    data:data
  })
}
//作废
export function nullify(invoiceId) {
  return request({
    url: `/api/purchase-service/centerPurchase/invoice/${invoiceId}/nullify`,
    method: 'get'
  })
}

//集采付款批量审批通过
export function passBatch(data) {
  return request({
    url: `/api/purchase-service//central/purchase/payable/pass-batch-central-purchase`,
    method: 'post',
    data:data
  })
}



