import request from '@/utils/request'
import api from '../index'
//仅七天订单总数
export function weekOrders() {
  return request({
    url: api+'/order-service/order/statistics/week/orders',
    method: 'get',
  })
}
//今日订单总数
export function todayOrders() {
  return request({
    url: api+'/order-service/order/statistics/today/orders',
    method: 'get',
  })
}
//本月项目下单top榜
export function projectTop() {
  return request({
    url: api+'/order-service/order/statistics/project/top',
    method: 'get',
  })
}
//本月合作伙伴业绩top榜
export function organizationTop() {
  return request({
    url: api+'/order-service/order/statistics/organization/top',
    method: 'get',
  })
}
//订单统计
export function statisticsData(data) {
  return request({
    url: api+'/order-service/order/statistics/date',
    method: 'post',
    data:data
  })
}
//待处理事务
export function pendingTask() {
  return request({
    url: api+'/statistics-service/pending-task',
    method: 'get',
  })
}
