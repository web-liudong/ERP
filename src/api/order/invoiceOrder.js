import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'

//获取所有订单状态以及数量
export function getStatusCount() {
  return request({
    url: Host+`/order-service/order/delivery/status-count`,
    method:'get'
  })
}

//订单管理列表
export function getDataList(type, data) {
  let url = {100:"all",0:"unprocessed",1:"accepted",2:"sorting",3:"sorting-completed",4:"reviewed",5:"completed",6:"received",7:"cancelled"}[type]
  return request({
    url: Host+`/order-service/order/delivery/${url}-list`,
    method:'post',
    data:data,
  })
}

export function getDataListNew(type, data) {
  let url = {0:"associate-list",1:"not-associate-list"}[type]
  return request({
    url: Host+`/order-service/order/delivery/${url}`,
    method:'post',
    data:data,
  })
}

//订单详情
export function getOrderDetail(id) {
  return request({
    url: Host+`/order-service/order/${id}/detail`,
    method:'get',
  })
}
//订单详情实时状态
export function getOrderDetailStatus(id) {
  return request({
    url: Host+`/order-service/order/${id}/status-real-time`,
    method:'get',
  })
}

//根据发货单id获取送货单url
export function getDeliveryPictureFile(id, type) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/${type}/delivery-picture-file-url`,
    method:'get',
  })
}

//取消关联订单
export function cancelRelevanceOrder(id, status) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/${status}/cancel/relevance-order`,
    method:'put',
  })
}

//手动推送wms
export function pushWms(id, status) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/${status}/push/wms`,
    method:'put',
    unloading:true,
    exception:true
  })
}

//取消发货单
export function cancelOrder(id, status, reason) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/${status}/cancel`,
    method:'put',
    params: reason
  })
}

//手动发货单发货
export function deliveryOrderHanded(id, status, data) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/${status}/handed-delivery`,
    method:'put',
    params: data
  })
}

//确认发货送达
export function confirmDelivery(status,data) {
  return request({
    url: Host+`/order-service/order/delivery/${status}/confirmed/delivery`,
    method:'put',
    data: data
  })
}

//发货单关联订单
export function deliveryRelevanceOrder(id, status, data) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/${status}/relevance-order`,
    method:'put',
    params: data
  })
}

//送货单商品明细（确认送达）
export function getDeliveryGoodsItem(id) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/confirmed/delivery/item-list`,
    method:'get'
  })
}

//发货单关联订单(效验订单)
export function getCheckRelevanceOrder(id, data) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/check/relevance-order`,
    method:'get',
    params: data
  })
}

//发货单详情
export function getDeliveryDetail(id) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/detail`,
    method:'get'
  })
}

//创建发货单
export function creatDeliveryOrder(data) {
  return request({
    url: Host+`/order-service/order/delivery/create`,
    method:'post',
    data: data
  })
}

//生成发货单
export function generateDeliveryOrder(data) {
  return request({
    url: Host+`/order-service/order/delivery/generate`,
    method:'post',
    data: data
  })
}

//根据组织机构编号查询仓库数据
export function getWarehouseList(id) {
  return request({
    url: Host+`/warehouse-service/warehouse/${id}/list`,
    method:'get'
  })
}

//根据名称模糊查询sku列表
export function getSkuList(data) {
  return request({
    url: Host+`/product-service/sku/avaliable-name-like-list`,
    method:'post',
    data: data
  })
}

//根据用户购买记录模糊查询sku列表
export function getCustomerRecordSkuList(data) {
  return request({
    url: Host+`/order-service/order/delivery/find/order/delivery/item`,
    method:'post',
    data: data
  })
}

//根据用户购买记录模糊查询sku列表权限验证
export function getCustomerRecordSkuCheck(customerId, projectId) {
  return request({
    url: Host+`/order-service/order/delivery/${customerId}/${projectId}/customer/permission`,
    method:'get'
  })
}

//查询商品库存
export function getWmsSkuStock(data) {
  return request({
    url: Host+`/warehouse-service/wms/inventory/list`,
    method:'post',
    data: data
  })
}

//发货单回显
export function getDeliveryOrderDetails(id) {
  return request({
    url: Host+`/order-service/order/delivery/${id}`,
    method:'get'
  })
}

//获取发货单最新配送状态(已接受)
export function getDeliveryOrderAcceptedTime(id) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/handed-delivery/accepted-time`,
    method:'get'
  })
}

//回显送货单
export function getDeliveryPicInfo(id) {
  return request({
    url: Host+`/order-service/order/${id}/delivery/info`,
    method: 'get'
  })
}

//上传发货单
export function uploadDeliveryPic(id, status, data) {
  return request({
    url: Host+`/order-service/order/${id}/${status}/upload/delivery`,
    method: 'put',
    data:data,
  })
}

//导出
export function exportDelivery(data) {
  return request({
    url: Host+`/order-service/order/delivery/export`,
    method:'post',
    data: data,
    //responseType: 'blob'
  })
}

//打印订单
export function printOrderNote(id) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/print/order/note`,
    method:'get'
  })
}

//查询可用仓库
export function getWareHouseAll(data) {
  return request({
    url: Host+`/warehouse-service/warehouse/search-list`,
    method:'post',
    data: data
  })
}

//批量生成发货单
export function generateDeliveryOrderBtach(data) {
  return request({
    url: Host+`/order-service/order/delivery/batch/generate`,
    method:'post',
    data: data
  })
}

//订单按钮前检验
export function checkOrderOpa(id,data) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/check`,
    method:'post',
    data:data
  })
}

//获取根据发货单ID获取发货单部分明细
export function getInvoiceOrderItem(id) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/item`,
    method:'get'
  })
}

//发货单关联订单获取发货单详情
export function getInvoiceRelationOrder(id) {
  return request({
    url: Host+`/order-service/order/delivery/${id}/find-orderDelivery-detail`,
    method:'get'
  })
}

//查询最新成本单价
export function getCostPrice(data) {
  return request({
    url: Host+`/statistics-service/inventory/record/find-cost-price`,
    method:'post',
    data: data
  })
}

//获取退货信息
export function getInvoiceReturnOrderInfo(id) {
  return request({
    url: Host+`/order-service/returnorder/${id}/returnOrder-init-contactInfo`,
    method:'get'
  })
}

//获取退货信息
export function getInvoiceReturnOrderSkuList(data) {
  return request({
    url: Host+`/order-service/returnorder/returnOrder-init-SkuItemList`,
    method:'post',
    data: data
  })
}

//创建退单
export function creatReturnorder(deliveryId, data) {
  return request({
    url: Host+`/order-service/returnorder/${deliveryId}`,
    method:'post',
    data: data
  })
}