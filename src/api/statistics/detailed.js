import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'


// 销售毛利列表
export function getDataList(data) {
  return request({
    url: Host + `/statistics-service/statistics/salesGrossProfit/list`,
    method: 'post',
    data: data,
  })
}
// 销售毛利报表总计数据
export function getStatistics(data) {
  return request({
    url: Host + `/statistics-service/statistics/salesGrossProfit/get/SalesGrossProfitTotalStatistics`,
    method: 'post',
    data: data,
  })
}

//导出
export function exportDelivery(data) {
  return request({
    url: Host + `/statistics-service/statistics/salesGrossProfit/export`,
    method: 'post',
    data: data,
  })
}




