import request from '@/utils/request'
import api from '../index'
//设置采购属性
export function attributeSet(data,id) {
  return request({
    url: api+'/purchase-service/purchase/setup/'+id+'/attribute-set',
    method: 'post',
    data:data
  })
}

//获取组织机构所有状态list
export function organizationAllList(data) {
  return request({
    url: api+'/user-service/organization/all-list',
    method: 'post',
    data:data
  })
}

//获取采购属性
export function getAttribute(id) {
  return request({
    url: api+'/purchase-service/purchase/setup/'+id+'/attribute-init',
    method: 'post',
  })
}

export function organizationList(data) {
  return request({
    url: api+'/search-service/search/purchase/organization-list',
    method: 'post',
    data:data
  })
}