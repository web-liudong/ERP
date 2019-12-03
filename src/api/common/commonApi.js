import request from '@/utils/request'
import api from '../index'

//获取下级
export function region_subs(id) {
  return request({
    url: api+'/location-service/region-amap/'+ id +'/subs',
    method: 'get',
  })
}
//获取街道信息
export function postRegionStreetList(data) {
  return request({
    url: api+'/location-service/region-amap/street-list',
    method: 'post',
    data:data
  })
}
//获取省级名称
export function region_provinces_based_id() {
  return request({
    url: api+'/location-service/region-amap/provinces-based-id',
    method: 'get',
  })
}
//获取以省为第一级的4级树结构
export function postStartwithProvince(data) {
  return request({
    url: api+'/location-service/region-amap/fourleveltree-startwith-province',
    method: 'post',
    data:data
  })
}
//开票记录
export function postBillExportFileLogList(data) {
  return request({
    url: api+'/bill-service/invoice-application/exportFileLog-list',
    method: 'post',
    data:data
  })
}
//获取快递公司信息
export function getLocationExpress(token) {
  return request({
    url: api+'/location-service/express',
    method: 'get',
  })
}
//获取省级名称
export function provinces_based_id(token) {
  return request({
    url: api+'/location-service/region/provinces-based-id',
    method: 'get',
//  params:{
//		    	"access_token":token
//		},
  })
}
//获取id下级区域
export function subs(id) {
  return request({
    url: api+'/location-service/region/'+id+'/subs',
    method: 'get',
  })
}
//项目名称模糊
export function projectName(data) {
  return request({
    url: '/api/customer-service/project/name-list',
    method: 'post',
    data:data
  })
}
//客户名称模糊
export function postCustomerNameOptions(name) {
  console.log(name);
  return request({
    url: api + '/customer-service/customer/'+ name +'/customer-name',
    method: 'get',
  })
}
//获取供应商 模糊搜索
export function postSupplierOptions(name) {
  return request({
    url: api+'/supplier-service/supplier/find-info',
    method: 'post',
    data:{
      name:name
    },
  })
}
//获取品牌 模糊搜索
export function postBrandOptions(name) {
  return request({
    url: api+'/product-service/brand/brand-authorization-list',
    method: 'post',
    data:{
      name:name,
    },
  })
}
//获取合作伙伴 组织机构 模糊搜索
export function postOrganizationOptions(name) {
  return request({
    url: api+'/organization-service/organization/list/name',
    method: 'post',
    data:{
      name:name,
      pageNum: 1,
      pageSize: 10000
    },
  })
}
//文件下载/file/download/batch

export function getFileDownload(id) {
  return request({
    url: api+'/file-service/file/download?id='+id,
    method: 'get',
    responseType: 'blob'
  })
}
//批量下载
export function getFileDownloadBatch(data) {
  return request({
    url: api+'/file-service/file/download/batch',
    method: 'post',
    data:data,
    responseType: 'blob'
  })
}
//文件删除
export function deleteFileDelete(id) {
  return request({
    url: api+'/file-service/file/'+id,
    method: 'delete',
  })
}
//获取以省为第一级的3级树结构
export function threeleveltreeStartwithProvince() {
  return request({
    url: api+'/location-service/region/threeleveltree-startwith-province',
    method: 'get',
  })
}
//获取行业树
export function industryTree() {
  return request({
    url: api+'/location-service/industry/industry-tree',
    method: 'get',
  })
}
//根据行业id获取子级行业
export function subIndustry(id) {
  return request({
    url: api+'/location-service/industry/'+id+'/sub-industry',
    method: 'get',
  })
}

//导入sku zip包
export function importBigSkuFile(id) {
  return request({
    url: api+`/product-service/sku/${id}/import`,
    method: 'post'
  })
}

//导入授权库 zip包
export function importBigAccreditFile(id) {
  return request({
    url: api+`/authorization-service/authorization/${id}/import`,
    method: 'post'
  })
}
