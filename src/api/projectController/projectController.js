import request from '@/utils/request'
import api from '../index'
//项目管理列表
export function projectList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/list',
    method: 'post',
    data:obj
  })
}
//项目管理列表-可用
export function availableList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/available-list',
    method: 'post',
    data:obj
  })
}
//项目管理列表-草稿
export function draftList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/draft-list',
    method: 'post',
    data:obj
  })
}
//项目管理列表-待审核
export function pendingReviewList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/pending-review-list',
    method: 'post',
    data:obj
  })
}
//项目管理列表-已驳回
export function rejectedList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/rejected-list',
    method: 'post',
    data:obj
  })
}
export function nameList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/name-list',
    method: 'post',
    data:obj
  })
}

export function nameStatusList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/project-list/name-list',
    method: 'post',
    data:obj
  })
}

//项目管理禁用
export function forbid(id) {
  return request({
    url: api+'/customer-service/project/'+id+'/forbid',
    method: 'put',
  })
}
//项目管理启用
export function activate(id) {
  return request({
    url: api+'/customer-service/project/'+id+'/activate',
    method: 'put',
  })
}
//项目详情
export function projectDetail(id) {////////////////////
  return request({
    url: api+'/customer-service/project/'+id+'/detail',
    method: 'get',
  })
}
//模糊搜索客户名字
export function associatedCustomers(obj) {/////////////////////
  return request({
    url: api+'/customer-service/customer/associated-customers',
    method: 'post',
    data:obj
  })
}
//关联客户
export function associateCustomer(obj) {/////////////////////
  return request({
    url: api+'/customer-service/project/associate-customer',
    method: 'post',
    data:obj
  })
}
//合作伙伴费用率信息列表
export function Organization(obj) {/////////////////////
  return request({
    url: api+'/customer-service/projectOrganizationFee/list',
    method: 'post',
    data:obj
  })
}

//获取项目名字
export function getProjectName(id) {////////////////////
  return request({
    url: api+'/customer-service/project/'+id,
    method: 'get',
  })
}
//合作伙伴模糊搜索

export function souName(obj) {/////////////////////
  return request({
    url: api+'/organization-service/organization/list/name',
    method: 'post',
    data:obj
  })
}
//编辑所有费率
export function projectOrganizationFeeAll(id,obj) {////////////////////
  return request({
    url: api+'/customer-service/projectOrganizationFee/'+ id +'/all',
    method: 'put',
    data:obj
  })
}
//编辑当前费率
export function projectOrganizationFee(id,obj) {////////////////////
  return request({
    url: api+'/customer-service/projectOrganizationFee/'+ id ,
    method: 'put',
    data:obj
  })
}
//合作伙伴操作日志
export function logList(obj) {/////////////////////
  return request({
    url: api+'/customer-service/projectOrganizationFee/log-list',
    method: 'post',
    data:obj
  })
}
//根据项目名 实时判重 true 为重复
export function nameRepeatedCheck(obj) {
  return request({
    url: api+'/customer-service/project/name-repeated-check',
    method: 'post',
    data:obj
  })
}

//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function organizationListName(obj) {
  return request({
    url: api+'/organization-service/organization/list/name',
    method: 'post',
    data:obj
  })
}
//根据用户名，查询简单用户对象（包括id、username、realName）
export function simpleList(obj) {
  return request({
    url: api+'/user-service/user/simple/list',
    method: 'post',
    data:obj
  })
}
//添加项目
export function addProjrct(obj) {
  return request({
    url: api+'/customer-service/project/',
    method: 'post',
    data:obj
  })
}

//保存并提交审核
export function createSubmitReview(obj) {
  return request({
    url: api+'/customer-service/project/create-submit-review',
    method: 'post',
    data:obj
  })
}
//编辑项目
export function editProjrct(id,obj) {
  return request({
    url: api+'/customer-service/project/'+id,
    method: 'put',
    data:obj
  })
}
//编辑提审
export function updateSubmitReview(id,obj) {
  return request({
    url: api+'/customer-service/project/'+id+'/update-submit-review',
    method: 'put',
    data:obj
  })
}
//获取所有品牌状态以及数量
export function statusCount() {
  return request({
    url: api+'/customer-service/project/status-count',
    method: 'get',
  })
}
//项目提审
export function submitReview(id) {
  return request({
    url: api+'/customer-service/project/'+id+'/submit-review',
    method: 'put',
  })
}
//删除项目
export function deleteProject(id) {
  return request({
    url: api+'/customer-service/project/'+id,
    method: 'delete',
  })
}
//指定品牌特殊服务管理--删除品牌/
export function deleteDesignatedBrand(id) {
  return request({
    url: api+'/customer-service/project/'+id+'/designated-brand',
    method: 'delete',
  })
}
//驳回
export function reviewReject(id,obj) {
  return request({
    url: api+'/customer-service/project/'+id+'/review-reject',
    method: 'put',
    data:obj
  })
}
//审核通过
export function reviewPass(id) {
  return request({
    url: api+'/customer-service/project/'+id+'/review-pass',
    method: 'put',
  })
}
//指定品牌特殊服务管理列表
export function designatedBrandList(id) {
  return request({
    url: api+'/customer-service/project/'+id+'/designated-brand-list',
    method: 'put',
  })
}

//模糊搜索品牌
export function brandAuthorizationList(obj) {
  return request({
    url: api+'/product-service/brand/brand-authorization-list',
    method: 'post',
    data:obj
  })
}
//添加品牌
export function createDesignatedBrand(obj) {
  return request({
    url: api+'/customer-service/project/create-designated-brand',
    method: 'post',
    data:obj
  })
}
//根据名称模糊查询特殊供应商
export function findSpecialSupplier(obj) {
  return request({
    url: api+'/organization-service/organization/find-special-supplier',
    method: 'post',
    data:obj
  })
}
//编辑前检测
export function editCheck(id) {////////////////////
  return request({
    url: api+'/customer-service/project/'+id+'/check',
    method: 'get',
  })
}
//项目负责人名字
export function organizationUserList(obj) {
  return request({
    url: api+'/user-service/user/organization/user-list',
    method: 'post',
    data:obj
  })
}

export function importList(obj) {
  return request({
    url: api+'/customer-service/project/import-list',
    method: 'post',
    data:obj
  })
}

// 通过id获取图片
export function getImgList(data){
  return request({
    url:api+`/file-service/file/list`,
    method:'post',
    data:data
  })
}



