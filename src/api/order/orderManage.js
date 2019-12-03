import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'

//获取所有订单状态以及数量
export function getStatusCount() {
  return request({
    url: Host+`/order-service/order/status-count`,
    method:'get',
    solve:1
  })
}

//订单管理列表
export function getDataList(type, data) {
  let url = {5:"all",0:"pending-allocation",1:"pending-acceptance",2:"pending-receipt",3:"completed",4:"cancelled"}[type]
  return request({
    url: Host+`/order-service/order/${url}-list`,
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
//订单详情-商品信息
export function getOrderDetailItem(id) {
  return request({
    url: Host+`/order-service/order/${id}/detail-item`,
    method:'get',
  })
}

//异常订单详情-商品信息
export function getOrderAbnormalDetailItem(id) {
  return request({
    url: Host+`/order-service/order/abnormal/${id}/detail-item`,
    method:'get',
  })
}

//订单详情-操作记录
export function getOrderOperationLog(id) {
  return request({
    url: Host+`/order-service/order/${id}/detail-operation-log`,
    method:'get',
  })
}
//订单详情-服务方信息
export function getOrderServer(id) {
  return request({
    url: Host+`/order-service/order/${id}/detail-server`,
    method:'get',
  })
}

//订单按钮前检验
export function checkOrderOpa(id,data) {
  return request({
    url: Host+`/order-service/order/${id}/check`,
    method:'post',
    data:data
  })
}

//取消订单前检验
export function checkCancelOrderOpa(data) {
  return request({
    url: Host+`/order-service/order/cancel-order-check`,
    method:'post',
    data:data
  })
}

//分配/重新分配订单前验证
export function checkAllocationOrder(id,status) {
  return request({
    url: Host+`/order-service/order/check/${id}/${status}/allocation-order`,
    method:'get',
  })
}

//订单派单
export function allocationOrder(data) {
  return request({
    url: Host+`/order-service/order/allocation-order`,
    method:'post',
    data:data
  })
}

//指定派单员
export function setAssignationHead(data) {
  return request({
    url: Host+`/order-service/order/assignationAssign`,
    method:'post',
    data:data,
  })
}

//查询派单员
export function getAssignationHead(data) {
  return request({
    url: Host+`/order-service/order/assign/assignation-assign`,
    method:'post',
    data:data,
    unloading:true
  })
}

//添加备注
export function createRemarks(data) {
  return request({
    url: Host+`/order-service/order/create-remarks`,
    method:'post',
    data:data,
  })
}

//取消订单
export function cancelOrder(data) {
  return request({
    url: Host+`/order-service/order/cancel-order`,
    method:'post',
    data:data,
  })
}

//拒绝接单
export function rejectOrder(data) {
  return request({
    url: Host+`/order-service/order/reject-order`,
    method:'post',
    data:data,
  })
}

//订单分派前查询服务方机构
export function getOrganize(data) {
  return request({
    url: Host+`/customer-service/project/allocation-order`,
    method:'post',
    data:data,
    unloading:true
  })
}

//订单分派前查询服务方负责人
export function getOrganizeUser(data) {
  return request({
    url: Host+`/user-service/user/organization/user-list`,
    method:'post',
    data:data,
    unloading:true
  })
}

//获取服务方费率
export function getServerFee(pid, oid) {
  return request({
    url: Host+`/customer-service/projectOrganizationFee/${pid}/${oid}/serviceFee`,
    method:'get'
  })
}

//根据组织id获取银行信息
export function getbankaccountList(data) {
  return request({
    url: Host+`/user-service/organization/bankaccount/list`,
    method:'post',
    data:data
  })
}

//重新分配订单前获取数据
export function getAllocationOrderInfo(id) {
  return request({
    url: Host+`/order-service/order/${id}/allocation-order`,
    method:'get'
  })
}

//列表项目详情
export function getProjectOrderInfo(id) {
  return request({
    url: Host+`/customer-service/project/${id}/order-detail`,
    method:'get'
  })
}

//列表获取用户信息
export function getUserInfo(id) {
  return request({
    url: Host+`/user-service/user/${id}`,
    method:'get'
  })
}
export function getAuthorityUserInfo(id) {
  return request({
    url: Host+`/user-service/user/data/authority/${id}`,
    method:'get'
  })
}
export function getCustomerInfo(id) {
  return request({
    url: Host+`/customer-service/customer/${id}/order-detail`,
    method:'get'
  })
}

//申请退单初始化
export function getReturnOrderInfo(id) {
  return request({
    url: Host+`/order-service/returnorder/order/${id}/returnorder-initialization`,
    method:'get'
  })
}

//创建退单
export function saveReturnorder(data) {
  return request({
    url: Host+`/order-service/returnorder/returnorder-create`,
    method:'post',
    data:data,
  })
}

//服务方接单
export function acceptOrder(id, data) {
  return request({
    url: Host+`/order-service/order/${id}/first-server-accept`,
    method:'put',
    data:data,
  })
}

//第二服务方接单
export function acceptOrderSecond(id, data) {
  return request({
    url: Host+`/order-service/order/${id}/second-server-accept`,
    method:'put',
    data:data,
  })
}

//服务方保存并接单
export function saveAndAcceptOrder(id, data) {
  return request({
    url: Host+`/order-service/order/${id}/first-server`,
    method:'put',
    data:data,
  })
}

//第二服务方保存并接单
export function saveAndAcceptOrderSecond(id, data) {
  return request({
    url: Host+`/order-service/order/${id}/second-server`,
    method:'put',
    data:data,
  })
}

//订单修改记录列表
export function getEditRecordList(data) {
  return request({
    url: Host+`/order-service/order/order-edit-log-list`,
    method:'post',
    data:data,
  })
}

//订单修改记录详情
export function getEditRecordInfo(id) {
  return request({
    url: Host+`/order-service/order/${id}/edit-history-info`,
    method:'get'
  })
}

//获取商品下拉列表
export function likeOrderItemList(data) {
  return request({
    url: Host+'/order-service/order/like-order-item-list',
    method: 'post',
    data:data,
    unloading:true
  })
}

//获取商品下拉列表
export function setOrderPayeeInfo(data) {
  return request({
    url: Host+'/order-service/order/payee/info',
    method: 'post',
    data:data,
  })
}

//异常订单列表
export function getAbnormalOrderList(data) {
  return request({
    url: Host+'/order-service/order/abnormal/list',
    method: 'post',
    data:data,
  })
}

//异常订单处理
export function abnormalOrderProcess(data) {
  return request({
    url: Host+'/order-service/order/abnormal/process',
    method: 'post',
    data:data,
  })
}

//修改服务方服务费
export function modifyServiceFee(data) {
  return request({
    url: Host+'/order-service/order/modify/service/fee',
    method: 'post',
    data:data,
  })
}

//手动响应
export function setWmsResponse(id, status, data) {
  return request({
    url: Host+`/order-service/order/${id}/${status}/manual/response`,
    method: 'post',
    params:data,
  })
}

//手动发货
export function setWmsDelivery(id, status, data) {
  return request({
    url: Host+`/order-service/order/${id}/${status}/manual/delivery`,
    method: 'post',
    params:data,
  })
}

//手动送达
export function setWmsSigned(id, status, data) {
  return request({
    url: Host+`/order-service/order/${id}/${status}/manual/signed`,
    method: 'post',
    params:data,
  })
}

//手动推送配置状态回显
export function getWmsManual(id) {
  return request({
    url: Host+`/order-service/order/${id}/manual`,
    method: 'get'
  })
}

//第一服务费接单
export function setFirstAccept(id, data) {
  return request({
    url: Host+`/order-service/order/${id}/first-server-accept`,
    method: 'put',
    data:data,
  })
}

//第二服务费接单
export function setSecondAccept(id, data) {
  return request({
    url: Host+`/order-service/order/${id}/second-server-accept`,
    method: 'put',
    data:data,
  })
}

//导出订单列表
export function exportOrderStatus(status, data) {
  return request({
    url: Host+`/order-service/order/${status}/export`,
    method:'post',
    data: data,
    responseType: 'blob'
  })
}

//异常订单处理-基本信息
export function saveAbnormalOrderBase(data) {
  return request({
    url: Host+`/order-service/order/abnormal/process-base-info`,
    method:'post',
    data: data,
  })
}

//异常订单处理-基本信息
export function saveAbnormalOrderSku(data) {
  return request({
    url: Host+`/order-service/order/abnormal/process-sku-info`,
    method:'post',
    data: data,
  })
}

//订单查询中心列表
export function getAllDataList(data) {
  return request({
    url: Host+`/search-service/order/all-list`,
    method:'post',
    data:data,
  })
}

//订单查询商品列表
export function getSkuList(data) {
  return request({
    url: Host+`/search-service/order/item`,
    method:'post',
    data:data,
  })
}

//导出订单列表
export function exportAllDataList(data) {
  return request({
    url: Host+`/search-service/order/export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//导出订单商品列表
export function exportAllSkuList(data) {
  return request({
    url: Host+`/search-service/order/item/export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//手动操作详情
export function getWmsManualOpa(id) {
  return request({
    url: Host+`/order-service/order/${id}/manual/operation`,
    method: 'get'
  })
}

//查询自定义明细上传状态是否关闭
export function orderIsCloseUpload(id) {
  return request({
    url: Host+`/bill-service//bill/${id}/is-close`,
    method: 'get'
  })
}

//关闭自定义明细上传
export function setCloseUpload(id) {
  return request({
    url: Host+`/bill-service//bill/${id}/close-import`,
    method: 'put'
  })
}

//自定义明细上传
export function uploadBillCustomize(id, data) {
  return request({
    url: Host+`/bill-service//bill/${id}/import-customize-bill-order-item`,
    method: 'post',
    data: data
  })
}

//根据订单查询开票明细
export function getBillItemForOrder(id) {
  return request({
    url: Host+`/bill-service//bill/${id}/customize-bill-order-item-list`,
    method: 'post',
    data: {
      "pageNum": 1,
      "pageSize": 100
    }
  })
}

//删除开票明细
export function delBillCustomize(id, data) {
  return request({
    url: Host+`/bill-service//bill/${id}/delete-customize-bill-order-item`,
    method: 'post',
    data: data
  })
}

//委托收款方回显
export function getOrderPayeeInfo(id) {
  return request({
    url: Host+`/order-service/order/${id}/payee/info`,
    method: 'get'
  })
}

//关闭自定义发货单
export function putOrderCloseDelivery(id) {
  return request({
    url: Host+`/order-service/order/${id}/close/customer/delivery`,
    method: 'put'
  })
}

//批量分配订单
export function batchAllocationOrder(data) {
  return request({
    url: Host+`/order-service/order/batch-allocation-order`,
    method: 'post',
    data: data
  })
}

//批量派接订单
export function batchAcceptOrder(data) {
  return request({
    url: Host+`/order-service/order/batch-allocation-accept-order`,
    method: 'post',
    data: data
  })
}
//批量接单
export function batchTakingAcceptOrder(data) {
  return request({
    url: Host+`/order-service/order/batch-accept-order`,
    method: 'post',
    data: data
  })
}

//获取旧系统订单信息
export function getOldOrderInfo(id) {
  return request({
    url: Host+`/order-service/order/abnormal/${id}/order-old-erp-info`,
    method: 'get'
  })
}

//异常订单按钮前检验
export function checkAbnormalOrderOpa(id, type) {
  return request({
    url: Host+`/order-service/order/abnormal/${id}/${type}/check`,
    method:'get'
  })
}

//收回重派
export function reAllocationOrder(data) {
  return request({
    url: Host+`/order-service/order/re/allocation-order`,
    method: 'post',
    data: data
  })
}

//批量生成发货单前验证
export function checkbatchCreatInvoice(data) {
  return request({
    url: Host+`/order-service/order/delivery/batch/generate/check`,
    method:'post',
    data: data,
    exception:true
  })
}

//合计订单查询
export function getOrderQueryTotal(data) {
  return request({
    url: Host+`/search-service/order/total/list`,
    method:'post',
    data: data,
  })
}

//合计订单查询
export function getOrderGoodsQueryTotal(data) {
  return request({
    url: Host+`/search-service/order/total/item`,
    method:'post',
    data: data,
  })
}

//去除异常订单处理锁定
export function removeOrderSolveLock(id) {
  return request({
    url: Host+`/order-service/order/abnormal/${id}/free-lock`,
    method:'get'
  })
}

//获取有待处理异常订单的旧系统项目列表
export function getOldGoodsNameList(data) {
  return request({
    url: Host+`/order-service/order/abnormal/old-project-name`,
    method:'post',
    data: data,
    unloading:true
  })
}

//获取有待处理异常订单的旧系统客户列表
export function getOldCustomerNameList(data) {
  return request({
    url: Host+`/order-service/order/abnormal/old-customer-name`,
    method:'post',
    data: data,
    unloading:true
  })
}

//导出缺失匹配关系商品
export function exportAnomalyOrder(data) {
  return request({
    url: Host+`/order-service/order/abnormal/export/abnormal-sku-info`,
    method:'post',
    data: data,
  })
}

//刷新新旧系统数据匹配关系
export function updateRelationTask() {
  return request({
    url: Host+`/order-service/order/abnormal/process-sku-task`,
    method:'post'
  })
}

//修改业务员
export function modifyStaffUser(orderId, staffId, version) {
  return request({
    url: Host+`/order-service//order/modify/${orderId}/${staffId}/${version}`,
    method:'get'
  })
}

//导出-根据订单ID
export function exportOrderDelivery(data) {
  return request({
    url: Host+`/order-service/order/delivery/export/order/delivery`,
    params:data,
    method:'post',
    responseType: 'blob'
  })
}