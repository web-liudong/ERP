import request from '@/utils/request'

//采购单审核状态统计
export function getStatusCount() {
  return request({
    url: `/api/purchase-service/purchase/management/review-status-count`,
    method: 'get',
  })
}

//获取模糊仓库名
export function getWarehouseName(data) {
  return request({
    url: `/api/warehouse-service/warehouse/search-list`,
    method: 'post',
    data:data
  })
}

//获取模糊采购员
export function getBuyerName(data) {
  return request({
    url: `/api/user-service/user/organization/user-list`,
    method: 'post',
    data:data
  })
}

//获取模糊供应商
export function getSupplierName(obj) {
  return request({
    url:`api/supplier-service/supplier/find-info/`,
    method: 'post',
    data:obj
  })
}

//获取当前组织机构的供应商模糊
export function getOrganizationSupplier(organizationId,obj) {
  return request({
    url:`/api/supplier-service/supplier/${organizationId}/findsupplier-name`,
    method: 'post',
    data:obj
  })
}

//获取审批模糊供应商
export function getListSupplierName(name) {
  return request({
    url:`/api/purchase-service/purchase/management/purchase-suplier/${name}/list`,
    method: 'get'
  })
}

//获取设置了集采的组织机构
export function getSetupOrganization(name) {
  return request({
    url:`/api/purchase-service/purchase/setup/organization/${name}/list`,
    method: 'get'
  })
}

//获取采购单列表
export function getPurchaseApprovalList(data) {
  return request({
    url: `/api/purchase-service/purchase/management/review-list`,
    method: 'post',
    data:data
  })
}

//采购单驳回编辑
export function editPurchaseApproval(id,data) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/reject-edit`,
    method: 'post',
    data:data
  })
}

//采购单详情
export function getPurchaseOrderDetail(id) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/detail`,
    method: 'get'
  })
}

//采购单审核通过
export function passPurchaseApproval(id) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/pass`,
    method: 'get'  
  })
}

//采购单审核驳回
export function rejectPurchaseApproval(data) {
  return request({
    url: `/api/purchase-service/purchase/management/reject-purchase-order`,
    method: 'post'  ,
    data:data
  })
}

//审核采购单取消
export function cancelPurchaseApproval(id) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/reviewCance`,
    method: 'delete'  
  })
}

//新建采购单
export function addPurchaseApproval(data) {
  return request({
    url: `/api/purchase-service/purchase/management/`,
    method: 'post',
    data:data
  })
}

//根据商品id获取商品明细
export function getManagementInfo(skuId) {
  return request({
    url: `/api/purchase-service/purchase/management/${skuId}/id/info`,
    method: 'get'
  })
}

//根据商品名称获取商品明细
export function getManagementInfoName(name) {
  return request({
    url: `/api/product-service/sku/name/info?name=${name}`,
    method: 'get'
  })
}

//根据skuId获取上一次采购价
export function getLastPurchasePrice(skuId) {
  return request({
    url: `/api/purchase-service/purchase/management/${skuId}/previous/price`,
    method: 'get'
  })
}

//查询商品库存
export function getGoodsInventory(data) {
  return request({
    url: `/api/warehouse-service/wms/inventory/list`,
    method: 'post',
    data:data
  })
}
