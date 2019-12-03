import request from '@/utils/request'
let Host = '/api'

// 返回订单详情
export function orderdetail(orderId) {
  return request({
    url:  Host+'/order-service/order/delivery/'+orderId+'/logistics/info',
    method:'get'
  })
}

