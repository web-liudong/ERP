import request from '@/utils/request'
import api from './index'
//创建供应商业务到草稿
export function supplierbiz(obj) {/////////////////////
  return request({
    url: api+'/supplier-service/supplierbiz/',
    method: 'post',
    data:obj
  })
}
//根据主键id获取供应商业务详情
export function IDdetail(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id,
    method: 'get',
  })
}
//修改供应商业务到草稿
export function IDmodify(id,obj) {//////////////////////
  return request({
    url: api+'/supplier-service/supplierbiz/'+id,
    method: 'put',
    data:obj
  })
}
//根据id删除一个供应商业务
export function IDdelete(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id,
    method: 'delete',
  })
}

//根据主键id获取供应商业务编辑信息
export function editingDetail(id) {////////////////////
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/editing-detail',
    method: 'get',
  })
}
//根据id冻结一个供应商业务
export function frozen(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/frozen',
    method: 'put',
  })
}
//供应商业务审核通过
export function reviewPassed(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/review-passed',
    method: 'put',
  })
}
//供应商业务审核不通过
export function reviewReject(id,obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/review-reject',
    method: 'put',
    data:obj
  })
}
//供应商业务提审
export function submitReview(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/submit-review',
    method: 'put',
  })
}
//根据id终止一个供应商业务
export function terminated(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/terminated',
    method: 'put',
  })
}
//根据id解冻一个供应商业务
export function unfrozen(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/unfrozen',
    method: 'put',
  })
}
//供应商业务更新详情
export function updateDetail(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/update-detail',
    method: 'get',
  })
}
//修改供应商业务并提审
export function updateSubmitReview(id,obj) {////////////////
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/update-submit-review',
    method: 'put',
    data:obj
  })
}
//根据查询条件，返回有效列表
export function availableList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/available-list',
    method: 'post',
    data:obj
  })
}
//统计不同状态下的总数集合
export function countList(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/count-list/'+id,
    method: 'get',
  })
}
//创建供应商业务并提审
export function createSubmitReview(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/create-submit-review',
    method: 'post',
    data:obj
  })
}
//根据查询条件，返回草稿列表
export function draftList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/draft-list',
    method: 'post',
    data:obj
  })
}
//根据查询条件，返回已过期列表
export function expiredList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/expired-list',
    method: 'post',
    data:obj
  })
}
//根据查询条件，返回已冻结列表
export function frozenList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/frozen-list',
    method: 'post',
    data:obj
  })
}
//根据查询条件，返回待审核列表
export function pendingReviewList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/pending-review-list',
    method: 'post',
    data:obj
  })
}
//根据查询条件，返回已驳回列表
export function rejectedList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/rejected-list',
    method: 'post',
    data:obj
  })
}
//根据查询条件，返回已终止列表
export function terminatedList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/terminated-list',
    method: 'post',
    data:obj
  })
}
//模糊搜索供应商名字
export function findInfo(obj) {
  return request({
    url: api+'/supplier-service/supplier/find-info/',
    method: 'post',
    data:obj
  })
}

//根据Id 查询供应商基础信息
export function CreditCode(id) {
  return request({
    url: api+'/supplier-service/supplier/name-socialCreditCode/'+id,
    method: 'get',
  })
}
//业务信息判断是否为待审核状态
export function pendingReview(id) {
  return request({
    url: api+'/supplier-service/supplierbiz/'+id+'/pending-review',
    method: 'get',
  })
}

export function importList(obj) {
  return request({
    url: api+'/supplier-service/supplierbiz/import-list',
    method: 'post',
    data:obj
  })
}
