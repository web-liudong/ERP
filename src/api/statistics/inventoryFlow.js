import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'


// 列表查询
export function getDataList(data) {
  return request({
    url: Host + `/statistics-service/inventory/record/list`,
    method: 'post',
    data: data,
  })
}

//根据品牌名称和编号模糊查询品牌列表
export function getBrandList(data) {
  return request({
    url: Host + `/product-service/brand/brand-list-name-or-no`,
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

//查询仓库模糊搜索
export function postWarehouseDvailableList(data) {
  return request({
    url: Host + '/warehouse-service/warehouse/available/list',
    method: 'post',
    data: data,
  })
}

//订单号类型
export function getDocumentTypeList(data) {
  return request({
    url: Host + `/statistics-service/inventory/record/document-type`,
    method: 'post', 
    data: data
  })
}

//导出
export function exportDelivery(data) {
  return request({
    url: Host + `/statistics-service/inventory/record/export`,
    method: 'post',
    data: data,
  })
}




