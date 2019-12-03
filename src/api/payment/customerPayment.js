import request from '@/utils/request'
import api from '../index'
//新建结算单
export function addBill(data) {
  return request({
    url: api+'/bill-service/bill/',
    method: 'post',
    data:data
  })
}
//编辑结算单
export function editBill(data,id) {
  return request({
    url: api+'/bill-service/bill/'+id,
    method: 'put',
    data:data
  })
}
//选择开票明细列表
export function pickList(data) {
  return request({
    url: api+'/bill-service/bill/pick-list',
    method: 'post',
    data:data
  })
}
//服务方模糊搜索
export function organizationListName(obj) {
  return request({
    url: api+'/organization-service/organization/list/name',
    method: 'post',
    data:obj
  })
}
//获取编辑主信息回显
export function billEditInfo(id) {
  return request({
    url: api+'/bill-service/bill/'+id+'/bill-edit-info',
    method: 'post',
  })
}
//获取结算单订单信息回显
export function billEditInfoOrder(id) {
  return request({
    url: api+'/bill-service/bill/'+id+'/bill-edit-info-order',
    method: 'post',
  })
}

//获取结算单开票明细回显
export function billEditInfoItem(id) {
  return request({
    url: api+'/bill-service/bill/'+id+'/bill-edit-info-item',
    method: 'post',
  })
}
