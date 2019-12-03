import request from '@/utils/request'
import api from '../index'

//我的开票：编辑修改
export function editerInvoice(invoiceId,data) {
    return request({
      url: `/api/purchase-service/centerPurchase/invoice/${invoiceId}/edit`,
      method: 'post',
      data: data
    })
  }

//我的开票：申请开票

export function createInvoice(data) {
    return request({
      url: `/api/purchase-service/centerPurchase/invoice/apply`,
      method: 'post',
      data: data
    })
  }
//我的开票：取消

export function cancelInvoice(invoiceId) {
    return request({
      url: `/api/purchase-service/centerPurchase/invoice/personal/${invoiceId}/cancel`,
      method: 'get',
    })
  }
// /centerPurchase/invoice/personal/{invoiceId}/cancel
//我的开票：编辑回显

export function editerInvoiceInit(invoiceId) {
    return request({
      url: `/api/purchase-service/centerPurchase/invoice/personal/${invoiceId}/editing`,
      method: 'get',
    })
  }

//我的开票：根据查询条件，返回全部列表

export function getInvoiceList(data) {
    return request({
      url: `/api/purchase-service/centerPurchase/invoice/personal/all-list`,
      method: 'post',
      data:data
    })
  }

//我的开票：申请根据状态统计数量  

export function getStatus() {
    return request({
      url: `/api/purchase-service/centerPurchase/invoice/personal/status-count`,
      method: 'get',
    })
  }


//集采我的开票：开票校验
export function applyInvoiceCheck(data) {
  return request({
    url: `/api/purchase-service/centerPurchase/invoice/checkApply`,
    method: 'post',
    data:data
  })
}


//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配


export function findOrganization(data) {
  return request({
    url:`/api/organization-service/organization/list/name`,
    method:'post',
    data:data,
  })
}

//根据组织机构id列表，查询其开票信息

export function findOrganizationInvoice(data) {
  return request({
    url:`/api/organization-service/organization/find-invoice-info`,
    method:'post',
    data:data,
  })
}

