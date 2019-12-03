import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'

//分类采购规则初始化
export function getStaffSetupInit(id, data) {
  return request({
    url: Host+`/purchase-service/purchase/setup/${id}/category-init`,
    method:'post',
    data: data
  })
}

//保存分类采购规则
export function setStaffCategory(id, data) {
  return request({
    url: Host+`/purchase-service/purchase/setup/${id}/category`,
    method:'post',
    data: data
  })
}

//分类采购规则详情
export function getStaffCategoryDetail(id, data) {
  return request({
    url: Host+`/purchase-service/purchase/setup/${id}/category-detail`,
    method:'post',
    data: data
  })
}

//品牌采购规则初始化
export function getStaffBrandInit(id, data) {
  return request({
    url: Host+`/purchase-service/purchase/setup/${id}/brand-init`,
    method:'post',
    data: data
  })
}

//保存品牌采购规则
export function setStaffBrand(id, data) {
  return request({
    url: Host+`/purchase-service/purchase/setup/${id}/brand`,
    method:'post',
    data: data
  })
}

//品牌采购规则详情
export function getStaffBrandDetail(id, data) {
  return request({
    url: Host+`/purchase-service/purchase/setup/${id}/brand-detail`,
    method:'post',
    data: data
  })
}