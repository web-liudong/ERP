import request from '@/utils/request'
import api from '../index'

export function addUser(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/',
    method: 'post',
    data:obj
  })
}
export function putUser(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/',
    method: 'put',
    data:obj
  })
}
//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function listName(obj) {/////////////////////
  return request({
    url: api+'/organization-service/organization/list/name',
    method: 'post',
    data:obj
  })
}

//根据公司级id获取下级部门树结构
export function departmentTree(id) {/////////////////////
  return request({
    url: api+'/organization-service/organization/department/department-tree/'+id,
    method: 'get',
  })
}

//查询在职用户个数
export function inplaceCount(id) {/////////////////////
  return request({
    url: api+'/user-service/user/inplace/count/'+id,
    method: 'get',
  })
}
//查询离职用户个数
export function quitCount(id) {/////////////////////
  return request({
    url: api+'/user-service/user/quit/count/'+id,
    method: 'get',
  })
}

//查询在职list
export function inplaceList(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/inplace/list',
    method: 'post',
    data:obj
  })
}
//查询离职list
export function quitList(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/quit/list',
    method: 'post',
    data:obj
  })
}
//禁用
export function forbid(id) {/////////////////////
  return request({
    url: api+'/user-service/user/'+id+'/forbid',
    method: 'put',
  })
}
//启用
export function enable(id) {/////////////////////
  return request({
    url: api+'/user-service/user/'+id+'/enable',
    method: 'put',
  })
}
//离职
export function leave(id) {/////////////////////
  return request({
    url: api+'/user-service/user/'+id+'/quit',
    method: 'put',
  })
}
//模糊搜索用户名字
export function simpleList(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/simple/list',
    method: 'post',
    data:obj
  })
}
//数据移交
export function transfer(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/data/authority/transfer',
    method: 'put',
    data:obj
  })
}
//用户密码修改
export function changePassword(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/changePassword',
    method: 'put',
    data:obj
  })
}
//根据用户id获取用户的所有数据权限
export function auditor(id) {/////////////////////
  return request({
    url: api+'/user-service/user/data/authority/type/'+id,
    method: 'get',
  })
}
//根据ID查询用户详情
export function detailData(id) {/////////////////////
  return request({
    url: api+'/user-service/user/'+id,
    method: 'get',
  })
}

//根据ID查询用户操作详情
export function detailLogs(id) {/////////////////////
  return request({
    url: api+'/user-service/user/'+id+'/logs',
    method: 'get',
  })
}
//用户审核数据移交记录查询
export function transferList(obj) {/////////////////////
  return request({
    url: api+'/user-service/user/data/authority/transfer/list',
    method: 'post',
    data:obj
  })
}
//查询所有角色组及组下的角色信息
export function groupRoles(id) {/////////////////////
  return request({
    url: api+'/user-service/role/group/roles',
    method: 'get',
  })
}

export function userRole(id) {/////////////////////
  return request({
    url: api+'/user-service/user/'+id+'/role',
    method: 'get',
  })
}
export function submituserRole(id,obj) {/////////////////////
  return request({
    url: api+'/user-service/user/'+id+'/role',
    method: 'post',
    data:obj
  })
}

//获取角色列表
export function externallist(data) {
  return request({
    url: `/api/user-service/external/list`,
    method: 'post',
    data:data
  })
}
//检查名字是否可用
export function isAvailable(data) {
  return request({
    url: api+'/user-service/user/username/is-available',
    method: 'post',
    data:data
  })
}
//查询部门信息列表
export function departmentList(data) {
  return request({
    url: api+'/user-service/organization/department/list',
    method: 'post',
    data:data
  })
}

export function userList(data) {
  return request({
    url: api+'/user-service/user/organization/user-list',
    method: 'post',
    data:data
  })
}

export function logout() {/////////////////////
  return request({
    url: api+'/user-service/user/logout',
    method: 'get',
  })
}
