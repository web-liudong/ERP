import request from '@/utils/request'
//一级可用
export function available1(data) {
  return request({
    url: '/api/product-service/category/first-level/available-list',
    method: 'post',
    data:data
  })
}
//二级可用
export function available2(data) {
  return request({
    url: '/api/product-service/category/second-level/available-list',
    method: 'post',
    data:data
  })
}
//三级可用
export function available3(data) {
  return request({
    url: '/api/product-service/category/third-level/available-list',
    method: 'post',
    data:data
  })
}
//一级待审核
export function pending1(data) {
  return request({
    url: '/api/product-service/category/first-level/pending-review-list',
    method: 'post',
    data:data
  })
}
//二级待审核
export function pending2(data) {
  return request({
    url: '/api/product-service/category/second-level/pending-review-list',
    method: 'post',
    data:data
  })
}
//三级待审核
export function pending3(data) {
  return request({
    url: '/api/product-service/category/third-level/pending-review-list',
    method: 'post',
    data:data
  })
}
//一级草稿
export function draft1(data) {
  return request({
    url: '/api/product-service/category/first-level/draft-list',
    method: 'post',
    data:data
  })
}
//二级草稿
export function draft2(data) {
  return request({
    url: '/api/product-service/category/second-level/draft-list',
    method: 'post',
    data:data
  })
}
//三级草稿
export function draft3(data) {
  return request({
    url: '/api/product-service/category/third-level/draft-list',
    method: 'post',
    data:data
  })
}
//一级已驳回
export function rejected1(data) {
  return request({
    url: '/api/product-service/category/first-level/rejected-list',
    method: 'post',
    data:data
  })
}
//二级已驳回
export function rejected2(data) {
  return request({
    url: '/api/product-service/category/second-level/rejected-list',
    method: 'post',
    data:data
  })
}
//三级已驳回
export function rejected3(data) {
  return request({
    url: '/api/product-service/category/third-level/rejected-list',
    method: 'post',
    data:data
  })
}

//新增一级分类到草稿
export function addDraft1(data) {
  return request({
    url: '/api/product-service/category/first-level/create-draft',
    method: 'post',
    data:data
  })
}

//编辑一级分类到草稿
export function update1(id,data) {
  return request({
    url: `/api/product-service/category/first-level/${id}/update-draft`,
    method: 'put',
      data:data
    })
}

//编辑一级分类到审核
export function updateSubmit1(id,data) {
  return request({
    url: `/api/product-service/category/first-level/${id}/update-submit-review`,
    method: 'put',
    data:data
  })
}

//新增一级分类到审核
export function addReview1(data) {
  return request({
    url: '/api/product-service/category/first-level/create-submit-review',
    method: 'post',
    data:data
  })
}

//新增二级分类到草稿
export function addDraft2(data) {
  return request({
    url: '/api/product-service/category/second-level/create-draft',
    method: 'post',
    data:data
  })
}

//编辑二级分类到草稿
export function update2(id,data) {
  return request({
    url: `/api/product-service/category/second-level/${id}/update-draft`,
    method: 'put',
    data:data
  })
}
//编辑三级分类到草稿
export function update3(id,data) {
  return request({
    url: `/api/product-service/category/third-level/${id}/update-draft`,
    method: 'put',
    data:data
  })
}

//编辑二级分类到审核
export function updateSubmit2(id,data) {
  return request({
    url: `/api/product-service/category/second-level/${id}/update-submit-review`,
    method: 'put',
    data:data
  })
}

//编辑三级分类到审核
export function updateSubmit3(id,data) {
  return request({
    url: `/api/product-service/category/third-level/${id}/update-submit-review`,
    method: 'put',
    data:data
  })
}

//新增三级分类到草稿
export function addDraft3(data) {
  return request({
    url: '/api/product-service/category/third-level/create-draft',
    method: 'post',
    data:data
  })
}
//新增三级分类到审核
export function addReview3(data) {
  return request({
    url: '/api/product-service/category/third-level/create-submit-review',
    method: 'post',
    data:data
  })
}

//新增二级分类到审核
export function addReview2(data) {
  return request({
    url: '/api/product-service/category/second-level/create-submit-review',
    method: 'post',
    data:data
  })
}
//导入记录
export function importLog(data) {
  return request({
    url: '/api/product-service/category/importFileLog',
    method: 'post',
    data:data
  })
}
//一级详情
export function detail(id) {
  return request({
    url: `/api/product-service/category/first-level/${id}/detail`,
    method: 'get'
  })
}
//分类数量
export function levelCount() {
  return request({
    url: `/api/product-service/category/level-count`,
    method: 'get'
  })
}
//二级详情
export function detai2(id) {
  return request({
    url: `/api/product-service/category/second-level/${id}/detail`,
    method: 'get'
  })
}

//三级详情
export function detai3(id) {
  return request({
    url: `/api/product-service/category/third-level/${id}/detail`,
    method: 'get'
  })
}

//分类删除
export function classDelete(id) {
  return request({
    url: `/api/product-service/category/${id}/delete`,
    method: 'delete'
  })
}

//分类审核通过
export function reviewPass(id) {
  return request({
    url: `/api/product-service/category/${id}/review-pass`,
    method: 'put'
  })
}

//驳回
export function reviewReject(id,data) {
  return request({
    url: `/api/product-service/category/${id}/review-reject`,
    method: 'put',
    data:data
  })
}

//提审
export function submitReview(id) {
  return request({
    url: `/api/product-service/category/${id}/submit-review`,
    method: 'put'
  })
}

//获取分类列表
export function selectList(level,parentId) {
  return request({
    url: `/api/product-service/category/${level}/${parentId}/find-select-list`,
    method: 'get',
    params:{
      parentId:parentId
    }
  })
}

//获取分类列表
export function countStatus(level,source,sourceId) {
  return request({
    url: `/api/product-service/category/count-status`,
    method: 'post',
    data:{
      level:level,
      source:source,
      sourceId:sourceId
    }
  })
}

//预览
export function preview() {
  return request({
    url: `/api/product-service/category/preview/`,
    method: 'get'
  })
}
//预览模板模板
export function template(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}`,
    method: 'get'
  })
}
//模板更新详情
export function updateDetail(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/update-detail`,
    method: 'get'
  })
}
//模板操作详情
export function templateLog(id) {
  return request({
    url: `/api/product-service/categoryattributetemplate/${id}/log`,
    method: 'get'
  })
}

//获取税收编码列表
export function textList(data) {
  return request({
    url: `/api/product-service/taxcode/list`,
    method: 'post',
    data:data
  })
}
//税收编码搜索
export function searchTax(condition){
  return request({
    url: `/api/product-service/taxcode/${condition}/search`,
    method: 'get'
  })
}
//一级分类信息
export function classinfo1(id) {
  return request({
    url: `/api/product-service/category/first-level/${id}/edit-info`,
    method: 'get'
  })
}
//二级分类信息
export function classinfo2(id) {
  return request({
    url: `/api/product-service/category/second-level/${id}/edit-info`,
    method: 'get'
  })
}
//三级分类信息
export function classinfo3(id) {
  return request({
    url: `/api/product-service/category/third-level/${id}/edit-info`,
    method: 'get'
  })
}
//分类管理员账号
export function simplelist(data) {
  return request({
    url: `/api/user-service/user/simple/list`,
    method: 'post',
    data:data
  })
}

//分类管理员账号
export function grouplist(data) {
  return request({
    url: `/api/user-service/user/organization/user-list`,
    method: 'post',
    data:data
  })
}

//分类下拉级联搜索接口
export function selectlist(level,parentId,name){
  return request({
    url: `/api/product-service/category/${level}/${parentId}/${name}/find-select-search-list`,
    method: 'get',
  })
}

//编辑权限
export function editCheck(id){
  return request({
    url: `/api/product-service/category/${id}/category-pre-edit-check`,
    method: 'get'
  })
}

//二级三级验重
export function checkNameLevel(data){
  return request({
    url: `/api/product-service/category/check-name-level`,
    method: 'post',
    data:data
  })
}
//审核查看状态
export function getstatus(id){
  return request({
    url: `/api/product-service/category/${id}/status`,
    method: 'get'
  })
}

//根据项目id集合和用户名查询用户列表
export function userList(data){
  return request({
    url: `/api/customer-service/project/project-list/user-list`,
    method: 'post',
    data:data
  })
}



