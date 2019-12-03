import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'


// 销售频次分析列表
export function getDataList(data) {
  return request({
    url: Host + `/statistics-service/sale/frequency/list`,
    method: 'post',
    data: data,
  })
}
// 销售频次分析统计
export function getStatistics(data) {
  return request({
    url: Host + `/statistics-service/sale/frequency/statistics`,
    method: 'post',
    data: data,
  })
}

//项目模糊查询
export function selectProject(data) {
  return request({
    url: Host + '/customer-service/project/name-list',
    method: 'post',
    data: data,
  })
}

//客户模糊查询
export function selectCustomer(data) {
  return request({
    url: Host + '/customer-service/customer/associated-customers',
    method: 'post',
    data: data,
  })
}

// 项目乙方/服务方/第二服务方模糊搜索
export function selectServer(data) {
  return request({
    url: Host + '/organization-service/organization/list/name',
    method: 'post',
    data: data
  })
}

//业务员模糊搜索
export function simpleList(obj) {
  return request({
    url: Host + '/user-service/user/simple/list',
    method: 'post',
    data: obj
  })
}

//分类下拉级联接口
export function selectGoods(level, parentId) {
  return request({
    url: `/api/product-service/category/${level}/${parentId}/find-select-list`,
    method: 'get',
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

//导出
export function exportDelivery(data) {
  return request({
    url: Host + `/statistics-service/sale/frequency/export`,
    method: 'post',
    data: data,
  })
}




