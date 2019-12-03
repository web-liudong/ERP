import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'


//我的订单列表查询
export function getDataList(data) {
  return request({
    url: Host + `/order-service/order/own/list`,
    method: 'post',
    data: data,
  })
}

//改单按钮前检验
export function checkOrderOpa(id, data) {
  return request({
    url: Host + `/order-service/order/own/check/${id}`,
    method: 'post',
    data: data
  })
}

//取消订单
export function deleteOrder(data) {
  
  return request({
    url: Host + `/order-service/order/own/cancel-order`,
    method: 'put',
    data: data,
  })
}




