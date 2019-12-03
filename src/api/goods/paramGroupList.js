import request from '@/utils/request'
import api from '../index'
//参数组API
//后端：赵申桥
//http://47.94.238.148:8088/swagger-ui.html#/%E5%8F%82%E6%95%B0%E7%BB%84API/findCategoryAttributeGroupListUsingPOST

//新增参数组
export function postParamGroupAdd(data) {
  return request({
    url: api+'/product-service/categoryattributegroup/',
    method: 'post',
    data:data,
  })
}

//修改参数组
export function putParamGroupEdit(groupId,data) {
  return request({
    url: api+'/product-service/categoryattributegroup/'+ groupId ,
    method: 'put',
    data:data,
  })
}

//参数组详情
export function getParamGroupDetaills(groupId,templateId) {
  return request({
    url: api+'/product-service/categoryattributegroup/'+ groupId +'/'+ templateId,
    method: 'get',
  })
}

//删除参数组
export function deleteParamGroupDelete(groupId,templateId) {
  return request({
    url: api+'/product-service/categoryattributegroup/'+ groupId +'/'+ templateId,
    method: 'delete',
  })
}


//获取参数组名列表
export function postParamGroupNameList(templateId) {
  return request({
    url: api+'/product-service/categoryattributegroup/'+ templateId +'/group-name',
    method: 'post',
  })
}

//参数组列表
export function postParamGroupList(data) {
  return request({
    url: api+'/product-service/categoryattributegroup/list',
    method: 'post',
    data:data,
  })
}


//参数组列表/api/product-service/categoryattributetemplate/{templateId}/submit-review


export function getTemplateInfo(templateId) {
  return request({
    url: api+'/product-service/categoryattributetemplate/'+ templateId +'/common-info',
    method: 'get',
  })
}

//参数模板提审
export function getTemplateSubmit(templateId) {
  return request({
    url: api + '/product-service/categoryattributetemplate/'+ templateId +'/submit-review',
    method: 'get',
  })
}






