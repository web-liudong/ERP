import request from '@/utils/request'
let Host = '/api'

//查询表头状态信息
export function statusCount() {
  return request({
    url: Host+`/purchase-service/organization/status-count`,
    method:'get'
  })
}

//集采伙伴应付管理列表-全部
export function payableList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/all-payable-list`,
    method:'post',
    data:data
  })
}
//集采伙伴应付管理列表-待付款
export function unpaidList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/unpaid-payable-list`,
    method:'post',
    data:data
  })
}
//集采伙伴应付管理列表-部分付款
export function pendingList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/pending-payable-list`,
    method:'post',
    data:data
  })
}
//集采伙伴应付管理列表-已完成
export function completedList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/completed-payable-list`,
    method:'post',
    data:data
  })
}

//付款
export function paypurchase(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/pay-central-purchase`,
    method:'post',
    data:data
  })
}


//集采付款记录列表-全部
export function recordList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/all-record-list`,
    method:'post',
    data:data
  })
}

//集采付款记录列表-审核中
export function reviewList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/review-record-list`,
    method:'post',
    data:data
  })
}

//集采付款记录列表-已通过
export function passedList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/passed-record-list`,
    method:'post',
    data:data
  })
}

//集采付款记录列表-已通过
export function rejectedList(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/rejected-record-list`,
    method:'post',
    data:data
  })
}
//集采付款记录编辑
export function updatePurchase(id,data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/${id}/update-central-purchase`,
    method:'post',
    data:data
  })
}

//集采付款记录查看驳回原因
export function rejectReason(id) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/${id}/reject-reason`,
    method:'get'
  })
}

//应收-全部
export function receivableAll(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/all-receivable-list`,
    method:'post',
    data:data
  })
}
//应收-待付款
export function receivableUnpaid(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/unpaid-receivable-list`,
    method:'post',
    data:data
  })
}

//应收-部分付款
export function receivablePending(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/pending-receivable-list`,
    method:'post',
    data:data
  })
}

//应收-已完成
export function receivableCompleted(data) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/completed-receivable-list`,
    method:'post',
    data:data
  })
}

//结束付款
export function endCentral(id) {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/${id}/end-central-purchase`,
    method:'get'
  })
}
//集采应付数量
export function count() {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/purchase-payable/count`,
    method:'get'
  })
}
//集采应收数量
export function ReceivableCount() {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/purchase-receivable/count`,
    method:'get'
  })
}

//集采付款记录数量
export function recordCount() {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/record-count-approval`,
    method:'get'
  })
}

//集采付款记录数量
export function recorCount() {
  return request({
    url: Host+`/purchase-service/central/purchase/payable/record-count`,
    method:'get'
  })
}
//应收导出
export function exportPayable(data){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/export`,
    method:'post',
    data:data
  })
}
//付款审批-全部
export function approvalList(data){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/all-approval-list`,
    method:'post',
    data:data
  })
}
//付款审批-审核中
export function approvalReview(data){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/review-approval-list`,
    method:'post',
    data:data
  })
}

//付款审批-已通过
export function approvalPassed(data){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/passed-approval-list`,
    method:'post',
    data:data
  })
}
//付款审批-已驳回
export function approvalRejected(data){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/rejected-approval-list`,
    method:'post',
    data:data
  })
}

//付款审批-通过
export function passPurchase(id){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/${id}/pass-central-purchase`,
    method:'get'
  })
}

//付款审批-驳回
export function rejectPurchase(id,reason){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/${id}/${reason}/reject-central-purchase`,
    method:'get'
  })
}


//集采回款审核数据导出
export function exportPayment(data){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/export-payment-approval`,
    method:'post',
    data:data
  })
}


//集采付款批量审批通过
export function passBatch(data){
  return request({
    url: Host+`/purchase-service/central/purchase/payable/pass-batch-central-purchase`,
    method:'post',
    data:data
  })
}
