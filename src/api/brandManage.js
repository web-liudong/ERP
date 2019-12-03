import request from '@/utils/request'


//新增品牌信息到草稿
export  function addBrand(data) {
 return request({
   url:'/api/product-service/brand/',
   method:'post',
   data:data,
 })
}
//新增品牌信息到待审核
export  function addBrandToAudit(data) {
  return request({
    url:'/api/product-service/brand/create-submit-review',
    method:'post',
    data:data,
  })
}

//根据品牌id查询品牌
export function queryBrand(id) {
  return request.get(`/api/product-service/brand/${id}`)
}

// 更新品牌信息到草稿
export function updateBrandToDraft(id,data) {
  return request({
     url:`/api/product-service/brand/${id}`,
     method:'put',
     data: data
  })
}
// 更新品牌信息到待审核
export function uploadBrandToAudit(id,data) {
  return request({
    url:`/api/product-service/brand/${id}/update-submit-review`,
    method:'put',
    data: data

  })
}

//待审核品牌列表
export function toAuditList(data){
  return request({
      url:'/api/product-service/brand/pending-review-list',
      method:'post',
      data:data,
  })

}
//审核通过品牌列表
export function passedBrandList(data) {
  return request({
    url:'/api/product-service/brand/available-list',
    method:'post',
    data:data,
  })
}
//审核不通过品牌列表
export function noPassBrandList(data) {
  return request({
    url:'/api/product-service/brand/rejected-list',
    method:'post',
    data:data,
  })
}
//草稿品牌列表

export function draftBrandList(data) {
  return request({
    url:'/api/product-service/brand/draft-list',
    method:'post',
    data:data,
  })
}

//获取所有品牌状态以及数量
export function getBrandStatus() {
  return request({
    url:'/api/product-service/brand/status-count',
    method:'get',
  })
}
//品牌详情
export function getBrandDetail(id) {
  return request({
    url:`/api/product-service/brand/${id}/detail`,
    method:'get',
  })
}
//根据品牌id删除品牌
export function deleteBrandID(id) {
  return request({
    url:`/api/product-service/brand/${id}`,
    method:'delete',
  })
}

//审核成功
export function AuditSuccess(id) {
  return request({
    url:`/api/product-service/brand/${id}/review-pass`,
    method:'put',
  })
}

// 分类审核失败
export function auditError(id,data) {
  return request({
    url:`/api/product-service/brand/${id}/review-reject`,
    method:'put',
    data:data,
  })
}
//分类提审
export function toAuditBrand(id) {
  return request({
    url:`/api/product-service/brand/${id}/submit-review`,
    method:'put',
  })
}

//根据品牌id比较差异
export function compareID(id) {
  return request({
    url:`/api/product-service/brand/${id}/update-detail`,
    method:'get'
  })
}
//判断品牌名称是否重复
export function recordBrand(data) {
  return request({
    url:'/api/product-service/brand/name-repeated-check',
    method:'post',
    data:data
  })
}

//品牌批量导入
export function batchImport(data) {
  return request({
    url:'/api/product-service/brand/import',
    method:'post',
    data:data,
  })
}
//品牌导入更新
export function batchImportUpdate(data) {
  return request({
    url:'/api/product-service/brand/import/update',
    method:'post',
    data:data,
  })
}


//查找品牌导入记录列表
export function findBrandImportFileLogDTOList(data) {
  return request({
    url:'/api/product-service/brand/import-list',
    method:'post',
    data:data,
  })
}


//获取全部分类树
export function findBrandTreeData() {
  return request({
    url:'/api/product-service/category/preview/',
    method:'get',
  })
}

//
// 获取部分分类树

export function findBrandTree(data) {
  return request({
    url:'/api/product-service/category/preview/',
    method:'post',
    data:data,
  })
}
//品牌名称的模糊搜索

export function remoteBrandName(data) {
  return request({
    url:'/api/product-service/brand/brand-authorization-list',
    method:'post',
    data:data,
  })
}

//跳转品牌查询
export function toGetBrandData(data) {
  return request({
    url:'/api/product-service/brand/jump/list',
    method:'post',
    data:data,
  })
}

//获取状态(审核校验)

export function checkAuditer(id) {
  return request({
    url:`/api/product-service/brand/${id}/status`,
    method:'get',
  })
}



/////////////用户

//根据用户名，查询简单用户对象（包括id、userName、realName）

export  function getUsername(data) {
  return request({
    url:`/api/user-service/user/simple/list`,
    method:'post',
    data:data
  })
}

//编辑前检验

export  function checkName(id) {
  return request({
    url:`/api/product-service/brand/${id}/check`,
    method:'get',
  })
}



//根据商城id获取商城协作人信息
export  function getCooperators(id) {
  return request({
    url:`/api/mall-release-service/mall/${id}/cooperators`,
    method:'get',
  })
}

//添加商城协作人
export function addCooperators(data) {
  return request({
    url:'/api/mall-release-service/mall/cooperators',
    method:'post',
    data:data
  })
}

//根据用户名，查询简单用户对象（包括id、userName、realName）
export function simpleList(data) {
  return request({
    url: '/api/user-service/user/simple/list',
    method: 'post',
    data:data
  })
}
