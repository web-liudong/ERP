import request from '@/utils/request'
import api from '../index.js'

////////////////////9月20需求变更
//读取数据
export function readData(inStoreType) {
  return request({
    url: api + `/purchase-service/purchase/requirement/${inStoreType}/read/data`,
    method: 'get',
  })
}
//加载更多
export function listMore(data) {
  return request({
    url: api + '/purchase-service/purchase/requirement/list',
    method: 'post',
    data: data
  })
}

//根据名称模糊查询sku列表 商品名称模糊查询
export function selectProduct(data) {
  return request({
    url: api + '/product-service/sku/avaliable-name-like-list',
    method: 'post',
    data: data,
  })
}
// 关联客户 客户模糊查询
export function selectCustomer(data) {
  return request({
    url: api + '/customer-service/customer/associated-customers',
    method: 'post',
    data: data
  })
}
//可用仓库搜索
export function selectWarehose(data) {
  return request({
    url: api + '/warehouse-service/warehouse/search-list',
    method: 'post',
    data: data,
  })
}
//获取采购需求/详情
export function getPurchaseInfo(data) {
  return request({
    url: api + `/purchase-service/purchase/requirement/detail`,
    method: 'post',
    data:data
  })
}
//释放
export function putSkuId(skuId,inStoreType) {
  return request({
    url: api + `/purchase-service/purchase/requirement/${skuId}/${inStoreType}/release`,
    method: 'put',
  })
}
// 导出
export function purchaseRequirementExport(data) {
  return request({  
    url: api + '/purchase-service/purchase/requirement/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 详情导出
export function purchaseDetailExport(data) {
  return request({
    url: api + '/purchase-service/purchase/requirement/detail/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}


//采购需求详情发货单数量
export function invoiceNum(inStoreType,skuId,orderType) {
  return request({
    url: api + `/purchase-service/purchase/requirement/${inStoreType}/${skuId}/${orderType}/quantity`,
    method: 'get',
  })
}