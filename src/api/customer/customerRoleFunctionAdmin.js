import request from '@/utils/request'
import api from '../index'

//除了erp后台管理用户的外部系统用户服务API
//后端：黄晓辉
//http://47.94.238.148:8082/swagger-ui.html#/%E9%99%A4%E4%BA%86erp%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%94%A8%E6%88%B7%E7%9A%84%E5%A4%96%E9%83%A8%E7%B3%BB%E7%BB%9F%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1API


//获取详情的log信息
export function getRoleLogs(id) {
  return request({
    url: api + '/user-service/role/'+ id +'/logs',
    method: 'get',
  })
}


//获取所有权限条目信息（树结构）
export function getAuthorityTreeData(type) {
  return request({
    url: api + '/user-service/external/authority/' + type + '/all',
    method: 'get',
  })
}

//获取客户角色列表
export function postCustomerRoleList(data) {
  return request({
    url: api + '/user-service/external/role/list',
    method: 'post',
    data: data,
  })
}

//添加客户角色
export function postCustomerRoleCreate(data) {
  return request({
    url: api + '/user-service/external/role',
    method: 'post',
    data: data,
  })
}

//修改客户角色
export function putCustomerRoleUpdate(id, data) {
  return request({
    url: api + '/user-service/external/role/' + id,
    method: 'put',
    data: data,
  })
}

//根据ID查询客户角色详情
export function getCustomerRoleDetaills(id, type) {
  return request({
    url: api + '/user-service/external/role/' + id + '/' + type,
    method: 'get',
  })
}

//删除客户角色
export function deleteCustomerRoledelete(id, type) {
  return request({
    url: api + '/user-service/external/role/' + id + '/' + type,
    method: 'delete',
  })
}

//客户角色权限查询
export function getCustomerAuthorities(id, type) {
  return request({
    url: api + '/user-service/external/role/' + id + '/' + type + '/Authorities',
    method: 'get',
  })
}
//客户角色权限查询
export function postCustomerAuthorities(id, type,data) {
  return request({
    url: api + '/user-service/external/role/' + id + '/' + type + '/Authorities',
    method: 'post',
    data: data,
  })
}
//客户角色权限ID查询
export function getCustomerAuthoritieIds(id, type) {
  return request({
    url: api + '/user-service/external/role/' + id + '/' + type + '/AuthorityIds',
    method: 'get',
  })
}

