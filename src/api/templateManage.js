import request from '@/utils/request'
//新增参数模板
export function addTemplate(data) {
  return request({
    url: '/api/product-service/categoryattributetemplate',
    method: 'post',
    data:data
  })
}
//参数组列表
export function categorylist(id) {
  return request({
    url: `/api/product-service/categoryattributegroup/${id}/group-name`,
    method: 'post',
  })
}
//新增参数
export function addcategory(data) {
  return request({
    url: `/api/product-service/categoryattribute`,
    method: 'post',
    data:data
  })
}
//模板列表
export function templatelist(data) {
  return request({
    url: '/api/product-service/categoryattributetemplate/list',
    method: 'post',
    data:data
  })
}
//模板驳回
export function putcategory(id,data) {
  return request({
    url: `/api/product-service/categoryattribute/` +id,
    method: 'put',
    data:data
  })
}
//模板驳回
export function reviewReject(id,data) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/review-reject`,
    method: 'put',
    data:data
  })
}
//模板审核通过
export function reviewPass(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/review-pass`,
    method: 'get'
  })
}
//模板审核通过
export function getNum() {
  return request({
    url: `/api/product-service/categoryattributetemplate/`,
    method: 'get'
  })
}
//模板提审
export function submit(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/submit-review`,
    method: 'get'
  })
}
//模板删除
export function categorydelete(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}`,
    method: 'delete'
  })
}

//是否有权限
export function ownauthority(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/own-authority`,
    method: 'get'
  })
}
//是否有权限
export function commonInfo(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/common-info`,
    method: 'get'
  })
}

//原数据详情
export function initolddetal(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/master`,
    method: 'get'
  })
}
//数据详情
export function initdetal(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}`,
    method: 'get'
  })
}


//验证分类下是否存在参数模板
export function hastemplate(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/has-template`,
    method: 'get'
  })
}


//参数模板导入记录
export function postParameterDerivation(data) {
  return request({
    url: `/api/product-service/categoryattributetemplate/import_log`,
    method: 'post',
    data:data
  })
}

//验证分类下是否存在参数模板
export function hasTemplate(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/own-review`,
    method: 'get',
    exception:true
  })
}

//获取参数组名列表
export function groupName(id) {
  return request({
    url: `/api/product-service/categoryattributegroup/${id}/group-name`,
    method: 'post',
    data:{
      templateId:id
    }
  })
}
//批量修改参数组
export function groupUpdate(data) {
  return request({
    url: `/api/product-service/categoryattributegroup/update`,
    method: 'put',
    data:data
  })
}

//删除参数组
export function groupDelete(groupId,templateId) {
  return request({
    url: `/api/product-service/categoryattributegroup/${groupId}/${templateId}`,
    method: 'delete'
  })
}


