import request from '@/utils/request.js'
import api from '../index.js'

//应收账款api
//http://47.94.238.148:8017/swagger-ui.html#/

// 根据状态统计应收帐款数量
export function getCount() {
  return request({
    url: api + '/bill-service/account/receiveable/server-status-count',
    method: 'get',
  })
}

//获取服务方全部列表
export function getAll(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-all-list',
    method: 'post',
    data: data,
  })
}
//获取服务方待收款列表
export function getPending(data) {
  return request ({
    url: api + '/bill-service/account/receiveable/server-receive-not-list',
    method: 'post',
    data: data,
  })
}

//获取服务方已完成列表
export function getCompleted(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-complete-list',
    method: 'post',
    data: data,
  })
}

//获取服务方已作废列表
export function getInvalided(data) {
  return request ({
    url: api + '/bill-service/account/receiveable/server-receive-invalided-list',
    method: 'post',
    data: data,
  })
}

//项目模糊查询
export function selectProject(data) {
  return request ({
    url: api + '/customer-service/project/name-list',
    method: 'post',
    data: data,
  })
}

//关联客户 客户模糊查询
export function selectCustomer(data) {
  return request ({
    url: api + '/customer-service/customer/associated-customers',
    method: 'post',
    data: data,
  })
}

//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function selectOrganization(data) {
  return request ({
    url: api + '/user-service/organization/list/name',
    method: 'post',
    data: data,
  })
}
//服务方模糊搜索
export function selectServer(data) {
  return request({
    url: api+'/organization-service/organization/list/name',
    method: 'post',
    data:data
  })
}
//获取服务方全部列表导出
export function exportAll(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-all-export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//获取服务方已完成列表导出
export function exportCompleted(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-complete-export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//获取服务方已作废列表导出
export function exportInvalided(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-invalided-Export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//获取服务方待收款列表导出
export function exportPending(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-not-export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//服务方应收账款详情
export function getReceiveableInfo(id) {
  return request({
    url: api + `/bill-service/account/receiveable/server/${id}/detail`,
    method: 'get',
  })
}

//获取服务方待收款列表金额统计
export function receiveNoCount(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-not-count',
    method: 'post',
    data: data,
  })
}

//获取服务方已作废列表金额统计
export function receiveInvalidedCount(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-invalided-count',
    method: 'post',
    data: data,
  })
}

//获取服务方已完成列表金额统计
export function receiveCompleteCount(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-complete-count',
    method: 'post',
    data: data,
  })
}

//获取服务方全部列表金额统计
export function receiveAllCount(data) {
  return request({
    url: api + '/bill-service/account/receiveable/server-receive-all-count',
    method: 'post',
    data: data,
  })
}

// //业务员模糊查询
// export function userList(data) {
//   return request({
//     url: api+'/user-service/user/inplace/list',
//     method: 'post',
//     data:data
//   })
// }

//根据用户名，查询简单用户对象（包括id、username、realName）
export function userList(data) {
  return request({
    url: api+'/user-service/user/simple/list',
    method: 'post',
    data:data
  })
}
