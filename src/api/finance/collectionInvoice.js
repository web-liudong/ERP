import request from '@/utils/request.js'
import api from '../index.js'

//集采发票记录-列表查询
export function getInvoiceList(data) {
  return request({
    url: api + `/purchase-service/centralPurchase/invoice/record/list`,
    method: 'post',
    data: data,
  })
}

//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function findOrganization(data) {
  return request({
    url: api + '/organization-service/organization/list/name',
    method: 'post',
    data: data,
  })
}

// 导出发票记录
export function exportInvoice(data) {
  return request({
    url: api+`/purchase-service/centralPurchase/invoice/record/export`,
    method:'post',
    data: data,
    responseType: 'blob'
  })
}

//邮寄发票
export function setInvoicePost(data) {
  return request({
    url: api + `/purchase-service/centralPurchase/invoice/record/post`,
    method: 'put',
    data: data
  })
}

// 完成发票邮寄
export function setInvoiceComplete(recordId, data) {
  return request({
    url: api + `/purchase-service/centralPurchase/invoice/record/${recordId}/post-complete`,
    method: 'put',
    data: data
  })
}


//集采发票记录详情
export function getRecordDetail(recordId) {
  return request({
    url: api+`/purchase-service/centralPurchase/invoice/record/${recordId}/detail`,
    method:'get'
  })
}


// 下载邮寄发票模版
export function importTemplate(data) {
  return request({
    url: api + '/purchase-service/centralPurchase/invoice/record/import-template',
    method: 'post',
    data:data,
    responseType: 'blob',
  })
}

//以下待启用
//发票抬头列表
export function invoicetitle(id, invoiceTitle) {
  return request({
    url: api + `/customer-service/customerinvoice/${id}/invoice-title?invoiceTitle=${invoiceTitle}`,
    method: 'get'
  })
}
