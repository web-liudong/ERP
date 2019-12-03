import request from '@/utils/request'
import api from './index'
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
//  params:{
//		    	"access_token":token
//		},
  })
}

/////////////////////供应商基本信息接口区域//////////////////////////

//查询表头信息
export function count(id) {
  return request({
    url: api+'/supplier-service/supplier/count',
    method: 'get',
  })
}
//根据条件查询供应商基础信息（列表-可用）
export function findAvailableSupplierList(obj) {
  return request({
    url: api+'/supplier-service/supplier/available-list',
    method: 'post',
    data:obj
  })
}
//根据条件查询供应商基础信息（列表-草稿）
export function findDraftSupplierList(obj) {
  return request({
    url: api+'/supplier-service/supplier/draft-list',
    method: 'post',
    data:obj
  })
}
//根据条件查询供应商基础信息（列表-待审核）
export function findPendingReviewSupplierList(obj) {
  return request({
    url: api+'/supplier-service/supplier/pending-review-list',
    method: 'post',
    data:obj
  })
}
//根据条件查询供应商基础信息（列表-已驳回）
export function findRejectedSupplierList(obj) {
  return request({
    url: api+'/supplier-service/supplier/rejected-list',
    method: 'post',
    data:obj
  })
}
//根据ID获取供应商详情
export function supplierDetail(id) {
  return request({
    url: api+'/supplier-service/supplier/'+id,
    method: 'get',
  })
}
//编辑供应商基础信息至草稿
export function editsubmit(id,obj) {
  return request({
    url: api+'/supplier-service/supplier/'+id,
    method: 'put',
    data:obj
  })
}
//根据ID判断获取供应商更新信息
export function basicUpdata(id) {////////////////////
  return request({
    url: api+'/supplier-service/supplier/'+id+'/update-detail',
    method: 'get',
  })
}

//添加供应商基础信息至草稿
export function submitDraft(obj) {/////////////////////////
  return request({
    url: api+'/supplier-service/supplier/',
    method: 'post',
    data:obj
  })
}
//根据ID删除供应商基础信息
export function deletebasic(id,oldid) {
  return request({
    url: api+'/supplier-service/supplier/'+id+'/'+oldid,
    method: 'delete',
  })
}
//根据id获取供应商基础信息（编辑使用）
export function editSupplierInfoDTOById(id) {////////////////////////
  return request({
    url: api+'/supplier-service/supplier/'+id+'/editing-detail',
    method: 'get',
  })
}

//审核操作(通过)
export function reviewPassSupplier(id) {
  return request({
    url: api+'/supplier-service/supplier/'+id+'/review-pass',
    method: 'put',
  })
}

//审核操作(驳回)
export function updateSubmitReviewSupplier(id,obj) {
  return request({
    url: api+'/supplier-service/supplier/'+id+'/review-reject',
    method: 'put',
    data:obj
  })
}
//编辑供应商基础信息并提交审核
export function reviewRejectSupplier(id,obj) {/////////////////////////////
  return request({
    url: api+'/supplier-service/supplier/'+id+'/update-submit-review',
    method: 'put',
    data:obj
  })
}
//添加供应商基础信息并提交审核
export function createSubmitReviewSupplier(obj) {/////////////////////////
  return request({
    url: api+'/supplier-service/supplier/create-submit-review',
    method: 'post',
    data:obj
  })
}
//提交审核
export function submitReviewSupplier(id,oldid) {
  return request({
    url: api+'/supplier-service/supplier/'+id+'/submit-review/'+oldid,
    method: 'put',
  })
}
//获取部分分类树
export function treepreview(obj) {
  return request({
    url: api+'/product-service/category/preview/',
    method: 'post',
    data:obj
  })
}
//获取全部分类树
export function getTreeAll(id) {
  return request({
    url: api+'/product-service/category/preview/',
    method: 'get',
  })
}
//根据分类id 获得对应品牌
export function category(id) {
  return request({
    url: api+'/product-service/brand/'+id+'/category-under-brand-list',
    method: 'get',
  })
}
//根据ID查询文件
export function fileList(id) {////////////////////////
  return request({
    url: api+'/supplier-service/supplier/'+id+'/file-list',
    method: 'get',
  })
}
//
export function nameRepeatedCheck(obj) {
  return request({
    url: api+'/supplier-service/supplier/name-repeated-check',
    method: 'post',
    data:obj
  })
}
//过去批量下载文件ids
export function downFiles(id) {
  return request({
    url: api+'/supplier-service/supplier/'+id+'/down-files',
    method: 'get',
  })
}
//批量下载文件
export function downAllBatch(data) {
  return request({
  	responseType: 'blob',
    url: api+'/file-service/file/download/batch',
    method: 'post',
    data:data
  })
}
//基础信息判断是否为待审核状态
export function pendingReview(id) {
  return request({
    url: api+'/supplier-service/supplier/'+id+'/pending-review',
    method: 'get',
  })
}

export function importList(obj) {
  return request({
    url: api+'/supplier-service/supplier/import-list',
    method: 'post',
    data:obj
  })
}