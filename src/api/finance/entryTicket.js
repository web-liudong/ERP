import request from '@/utils/request.js'
import api from '../index.js'

//回票api
//http://47.94.238.148:8017/swagger-ui.html#/

// 根据条件，返回回票列表
export function getList(data) {
  return request({
    url: api + '/bill-service/invoice-receivable/list',
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

//批量确认回票
export function putAllConfirm(data) {
  return request({
    url: api + '/bill-service/invoice-receivable/invoice/confirm/',
    method: 'put',
    data: data,
  })
}
//确认回票
export function putConfirm(id) {
  return request({
    url: api + '/bill-service/invoice-receivable/invoice/' + id + '/confirm',
    method: 'put',
  })
}
