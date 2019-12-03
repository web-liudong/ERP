import request from '@/utils/request'
//发票列表
export function invoiceList(data) {
  return request({
    url: '/api/bill-service/invoice-application-management/list',
    method: 'post',
    data:data
  })
}

//批量开票-销项票
export function batchInvoicing(data) {
  return request({
    url: `/api/bill-service/invoice-application-management/batch-invoicing `,
    method: 'post',
    data:data,
    exception:true
  })
}
//批量进项票
export function batchInputInvoice(data) {
  return request({
    url: `/api/bill-service/invoice-application-management/batch-input-invoice`,
    method: 'post',
    data:data
  })
}

//开票详情
export function InvoicDetail(id) {
  return request({
    url: `/api/bill-service/invoice-application-management/${id}/detail`,
    method: 'get'
  })
}
//开票通过
export function reviewPass(id) {
  return request({
    url: `/api/bill-service/invoice-application-management/${id}/review-pass`,
    method: 'get'
  })
}

//发票管理统计
export function statusCount(id) {
  return request({
    url: `/api/bill-service/invoice-application-management/status-count`,
    method: 'get'
  })
}
//开票初审详情
export function simpleDetail(id) {
  return request({
    url: `/api/bill-service/invoice-application-management/${id}/simple-detail`,
    method: 'get'
  })
}
//发票申请审核驳回
export function reviewReject(data) {
  return request({
    url: `/api/bill-service/invoice-application-management/review-reject`,
    method: 'post',
    data:data
  })
}

//作废
export function cancellation(id) {
  return request({
    url: `/api/bill-service/invoice-application-management/${id}/cancellation`,
    method: 'get',
  })
}

//检查作废
export function cancellationcheck(id) {
  return request({
    url: `/api/bill-service/invoice-application-management/${id}/cancellation-check `,
    method: 'get',
  })
}
//开票详情
export function makeinvoice(id) {
  return request({
    url: `/api/bill-service/invoice-application-management/${id}/simple-detail`,
    method: 'get'
  })
}

//开票
export function outputInvoice(id,data) {
  return request({
    url: `/api/bill-service/invoice-application-management/${id}/output-invoice`,
    method: 'post',
    data:data,
    exception:true
  })
}
//开票记录
export function exportFileLog(data) {
  return request({
    url: `/api/bill-service/invoice-application/exportFileLog-list`,
    method: 'post',
    data:data
  })
}

//统计财务导出列表
export function exportRecordList(data) {
  return request({
    url: `/api/statistics-service/finance-export/list`,
    method: 'post',
    data:data
  })
}
//查询省
export function getprovinces(data) {
  return request({
    url: `/api/location-service/region/provinces-based-id`,
    method: 'get'
  })
}

//发票手动完成
export function manuallyComplete(id,data) {
  return request({
    url: `/api/bill-service/invoice-application-management/manually-complete/${id}`,
    method: 'post',
    data:data
  })
}

//发票申请终止开票
export function InvoiceFinish(data) {
  return request({
    url: `/api/bill-service/invoice-application-management/invoice-finish`,
    method: 'post',
    data:data
  })
}


