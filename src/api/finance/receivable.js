import request from '@/utils/request.js'
import api from '../index.js'

//应收账款api
//http://47.94.238.148:8017/swagger-ui.html#/

// 根据状态统计应收帐款数量
export function getCount() {
  return request({
    url: api + '/bill-service/account/receiveable/status-count',
    method: 'get',
  })
}

//获取全部列表
export function getAll(data) {
  return request({
    url: api + '/bill-service/account/receiveable/all-list',
    method: 'post',
    data: data,
  })
}

//获取待收款列表
export function getPending(data) {
  return request ({
    url: api + '/bill-service/account/receiveable/pending-list',
    method: 'post',
    data: data,
  })
}

//获取已完成列表
export function getCompleted(data) {
  return request({
    url: api + '/bill-service/account/receiveable/completed-list',
    method: 'post',
    data: data,
  })
}

//获取已作废列表
export function getInvalided(data) {
  return request ({
    url: api + '/bill-service/account/receiveable/invalided-list',
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

//获取账款详情
export function getReceiveableInfo(id) {
  return request({
    url: api + '/bill-service/account/receiveable/' + id,
    method: 'get',
  })
}

//关闭应收帐款
export function colseReceiveable(id) {
  return request({
    url: api + '/bill-service/account/receiveable/' + id ,
    method: 'put',
  })
}

//导出
export function exportReceiveable(data) {
  return request ({
    url: api + '/bill-service/account/receiveable/export',
    method: 'post',
    data: data,
  })
}

//全部导出
export function exportAll(data) {
  return request({
    url: api + '/bill-service/account/receiveable/all-export',
    method: 'post',
    data: data,
  })
}
//已完成导出
export function exportCompleted(data) {
  return request({
    url: api + '/bill-service/account/receiveable/completed-export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 已作废导出
export function exportInvalided(data) {
  return request({
    url: api + '/bill-service/account/receiveable/invalided-export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 待收款导出
export function exportPending(data) {
  return request({
    url: api + '/bill-service/account/receiveable/pending-export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//获取待收款总额
export function pendingTotal(data) {
  return request({
    url: api + '/bill-service/account/receiveable/pending-total',
    method: 'post',
    data: data,
  })
}

// 获取已作废总额
export function invalidedTotal(data) {
  return request({
    url: api + '/bill-service/account/receiveable/invalided-total',
    method: 'post',
    data: data,
  })
}

// 获取已完成总额
export function completedTotal(data) {
  return request({
    url: api + '/bill-service/account/receiveable/completed-total',
    method: 'post',
    data: data,
  })
}

// 获取全部帐款总额
export function accountTotal(data) {
  return request({
    url: api + '/bill-service/account/receiveable/account-total',
    method: 'post',
    data: data,
  })
}

