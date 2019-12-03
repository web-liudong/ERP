import request from '@/utils/request'

//获取结算单订单列表
export function getBillList(data) {
  return request({
    url: `/api/bill-service/bill/all-list`,
    method: 'post',
    data:data
  })
}

//获取结算单已确认订单列表
export function getConfirmed(data) {
  return request({
    url: `/api/bill-service/bill/already-confirm-list`,
    method: 'post',
    data:data
  })
}

//获取结算单待确认订单列表
export function getBeConfirmed(data) {
  return request({
    url: `/api/bill-service/bill/wait-confirm-list`,
    method: 'post',
    data:data
  })
}

//获取结算单已提交订单列表
export function getSubmitted(data) {
  return request({
    url: `/api/bill-service/bill/already-submitted-list`,
    method: 'post',
    data:data
  })
}

//获取结算单已完成订单列表
export function getCompleted(data) {
  return request({
    url: `/api/bill-service/bill/already-account-list`,
    method: 'post',
    data:data
  })
}

//获取结算单已驳回订单列表
export function getDismissed(data) {
  return request({
    url: `/api/bill-service/bill/already-reject-list`,
    method: 'post',
    data:data
  })
}

//获取结算单已作废订单列表
export function getOutDate(data) {
  return request({
    url: `/api/bill-service/bill/already-cancel-list`,
    method: 'post',
    data:data
  })
}

//获取结算单订单状态
export function statusCount(){
  return request({
    url: `/api/bill-service/bill/status-count`,
    method: 'post'
  })
}

//结算单作废
export function obsolete(id){
  return request({
    url: `/api/bill-service/bill/${id}/cancel-bill`,
    method: 'get'
  })
}

//结算单作废验证
export function checkObsolete(id){
  return request({
    url: `/api/bill-service/bill/${id}/check-cancel-bill`,
    method: 'get'
  })
}

//获取结算单作废
export function getObsolete(id){
  return request({
    url: `/api/bill-service/bill/${id}/detail`,
    method: 'get'
  })
}

//客户结算单开票申请初始化信息查询
export function getApplication(billId){
  return request({
    url: `/api/bill-service/invoice-application/${billId}/init-query`,
    method: 'get'
  })
}

//客户结算单开票申请
export function applicationBill(data){
  return request({
    url: `/api/bill-service/invoice-application/create`,
    method: 'post',
    data:data
  })
}

//获取开票抬头
export function geBillingUp(customerId){
  return request({
    url: `/api/customer-service/customerinvoice/${customerId}/invoice-list`,
    method: 'get'
  })
}

export function geBillingUps(customerId){
  return request({
    url: `/api/customer-service/customerinvoice/${customerId}/invoice-title`,
    method: 'get'
  })
}

//获取项目名
export function getProjectName(id) {
  return request({
    url:`api/customer-service/project/${id}`,
    method: 'get',
  })
}

//获取项目名称
export function nameList(obj) {
  return request({
    url:`api/customer-service/project/name-list`,
    method: 'post',
    data:obj
  })
}

//确认
export function confirm(id) {
  return request({
    url:`/api/bill-service/bill/${id}/confirm`,
    method: 'put'
  })
}

//获取客户名称
export function getCustomerName(obj) {
  return request({
    url:`/api/customer-service/customer/associated-customers`,
    method: 'post',
    data:obj
  })
}

//获取客户名称列表
export function customerName(name) {
  return request({
    url: `/api/customer-service/customer/${name}/customer-name`,
    method: 'get'
  })
}

//根据用户名，查询简单用户对象
export function simpleList(obj) {
  return request({
    url: `/api/user-service/user/simple/list`,
    method: 'post',
    data:obj
  })
}


//编辑结算单校验
export function checkEdit(billId) {
  console.log(billId);
  return request({
    url: `/api/bill-service/bill/${billId}/check-update-bill`,
    method: 'get'
  })
}







