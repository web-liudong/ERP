import request from '@/utils/request'
import api from '../index'
//后端：苏哲
//http://47.94.238.148:8017/swagger-ui.html#/%E5%BC%80%E7%A5%A8%E7%94%B3%E8%AF%B7/getInvoiceApplicationExportFileLogListUsingPOST


//回票录入查询
export function getInvoiceApplicationFindInvoiceReceivable(invoiceApplicationId) {
  return request({
    url: api + '/bill-service/invoice-receivable/'+ invoiceApplicationId +'/find-invoice-receivable',
    method: 'get',
  })
}
//回票录入
export function postInvoiceApplicationCreateInvoiceReceivable(invoiceApplicationId,data) {
  return request({
    url: api + '/bill-service/invoice-receivable/'+ invoiceApplicationId +'/create-invoice-receivable',
    method: 'post',
    data:data,
  })
}
//开票详情
export function getInvoiceApplicationDetail(id) {
  return request({
    url: api + '/bill-service/invoice-application/'+ id +'/detail',
    method: 'get',
  })
}

//开票申请列表
export function postInvoiceApplicationList(data) {
  return request({
    url: api + '/bill-service/invoice-application/all-list',
    method: 'post',
    data:data,
  })
}

//开票记录
export function postInvoiceApplicationExportFileLogList(data) {
  return request({
    url: api + '/bill-service/invoice-application/exportFileLog-list',
    method: 'post',
    data:data,
  })
}
