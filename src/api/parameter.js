import request from '@/utils/request'
import api from './index'


//新增参数
export function categoryattribute(obj) {
  return request({
    url: api+'/product-service/categoryattribute',
    method: 'post',
    data:obj
  })
}
//修改参数
export function editcategoryattribute(id,obj) {
  return request({
    url: api+'/product-service/categoryattribute/'+id,
    method: 'put',
    data:obj
  })
}
//删除参数
export function IDdelete(id,obj) {
  return request({
    url: api+'/product-service/categoryattribute/'+id,
    method: 'delete',
    data:obj
  })
}
//参数详细
export function getDetail(id,templateId) {
  return request({
    url: api+'/product-service/categoryattribute/'+id+'/'+templateId,
    method: 'get',
  })
}
//参数模板公共信息

export function commonInfo(templateId) {
  return request({
    url: api+'/product-service/categoryattributetemplate/'+templateId+'/common-info',
    method: 'get',
  })
}
//列表
export function getList(obj) {
  return request({
    url: api+'/product-service/categoryattribute/list',
    method: 'post',
    data:obj
  })
}
//参数模板提审
export function submitReview(templateId) {
  return request({
    url: api+'/product-service/categoryattributetemplate/'+templateId+'/submit-review',
    method: 'get',
  })
}




