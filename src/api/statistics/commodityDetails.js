import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'


// 列表查询
export function getDataList(data) {
  return request({
    url: Host + `/statistics-service/statistics/skuCostDetail/findSkuCostDetailList`,
    method: 'post',
    data: data,
  })
}

// 查找期初&&期末商品成本明细
export function getFirstAndEnd(data) {
  return request({
    url: Host + `/statistics-service/statistics/skuCostDetail/getBeginAndFinalperiodSkuDetail`,
    method: 'post',
    data: data,
  })
}

//根据品牌名称和编号模糊查询品牌列表
export function getBrandList(data) {
  return request({
    url: Host + `/product-service/brand/brand-authorization-list`,
    method: 'post', 
    data: data
  })
}
//查询往来单位列表
export function getIntercourseCompanyList(data) {
  return request({
    url: Host + `/statistics-service/inventory/record/find-company`,
    method: 'post', 
    data: data
  })
}

//导出
export function exportDelivery(data) {
  return request({
    url: Host + `/statistics-service/statistics/skuCostDetail/exportSkuCostDetailExcel`,
    method: 'post',
    data: data,
  })
}




