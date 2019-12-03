import request from '@/utils/request'
import api from '../index'
//角色服务API
//后端：黄晓辉
//http://47.94.238.148:8082/swagger-ui.html#/%E8%A7%92%E8%89%B2%E6%9C%8D%E5%8A%A1API/createRoleGroupUsingPOST

//保存角色数据权限
export function postDataAuthority(data) {
  return request({
    url: api+'/user-service/role/data/authority/',
    method: 'post',
    data:data,
  })
}

//查询已有角色数据权限
export function getDataAuthority(roleId) {
  return request({
    url: api + '/user-service/role/data/authority/'+ roleId,
    method: 'get',
  })
}

//查询所有权限模块
export function getDataAuthorityAll(roleId) {
  return request({
    url: api + '/user-service/role/data/authority/all',
    method: 'get',
  })
}
//查询用户是否有当前模块数据权限
export function postDataAuthorityRight(data) {
  return request({
    url: api+'/user-service/role/data/authority/has-module-right',
    method: 'post',
    data:data,
  })
}


//获取详情的log信息
export function getRoleLogs(id) {
  return request({
    url: api + '/user-service/role/'+ id +'/logs',
    method: 'get',
  })
}

//添加角色
export function postCreateRole(data) {
  return request({
    url: api+'/user-service/role/',
    method: 'post',
    data:data,
  })
}

//修改角色
export function putUpdateRole(id,data) {
  return request({
    url: api+'/user-service/role/'+id,
    method: 'put',
    data:data,
  })
}

//根据id查询角色详情
export function getRoleDetail(id) {
  return request({
    url: api+'/user-service/role/'+id,
    method: 'get',
  })
}


//删除角色
export function deleteRoleDelete(id) {
  return request({
    url: api+'/user-service/role/'+id,
    method: 'delete',
  })
}

//角色权限查询
export function getRoleAuthorities(id) {
  return request({
    url: api+'/user-service/role/'+ id +'/AuthorityIds',
    method: 'get',
  })
}

//角色权限设置
export function postRoleAuthorities(id,data) {
  return request({
    url: api+'/user-service/role/'+ id +'/Authorities',
    method: 'post',
    data:data,
  })
}

//添加角色分组
export function postCreateRoleGroup(data) {
  return request({
    url: api+'/user-service/role/group/',
    method: 'post',
    data:data,
  })
}

//修改角色分组
export function putUpdateRoleGroup(id,data) {
  return request({
    url: api+'/user-service/role/group/'+id,
    method: 'put',
    data:data,
  })
}
//根据id查询角色组详情？？？？
export function getRoleGroupDetail(id) {
  return request({
    url: api+'/user-service/role/group/'+ id,
    method: 'get',
  })
}

//获取角色分组列表
export function postRoleGroupList(data) {
  return request({
    url: api+'/user-service/role/group/list',
    method: 'post',
    data:data,
  })
}
//查询所有角色组及组下的角色信息
export function getRoleGroupRoles( ) {
  return request({
    url: api + '/user-service/role/group/roles',
    method: 'get',
  })
}
//获取角色列表
  export function postRoleList(data) {
    return request({
      url: api+'/user-service/role/list',
      method: 'post',
      data:data,
    })
  }


//获取权限树
export function getAuthorityAll(data) {
  return request({
    url: api+'/user-service/authority/all',
    method: 'get',
  })
}


