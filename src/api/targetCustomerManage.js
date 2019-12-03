import request from '@/utils/request'

//查询目标信息
export function targetCustomerId(id) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/${id}`,
    method: 'put'
  })
}

//目标客户信息客户名称模糊查询
export function targetCustomerName(name) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/name-list`,
    method: 'post',
    data:name
  })
}

//目标客户列表
export function targetCustomerList(data) {
  return request({
    url: '/api/marketing-service/marketing/target-customer/list',
    method: 'post',
    data:data
  })
  
}

//添加-目标客户信息名称实时判重
export function addCheckRepeat(data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/name-repeated-checked`,
    method: 'post',
    data:data
  })
}

//添加目标客户
export function addTargetCustomer(data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/`,
    method: 'post',
    data:data
  })
}

//目标客户详情
export function targetCustomerDetail(id) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/${id}`,
    method: 'get'
  })
}

//编辑目标客户
export function editTargetCustomer(id,data){
  return request({
    url: `/api/marketing-service/marketing/target-customer/${id}`,
    method: 'put',
    data:data
  })
}

//编辑-目标客户信息名称判重
export function editCheckRepeat(data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/name-repeated-check`,
    method: 'post',
    data:data
  })
}

//更新目标客户信息前获取目标客户信息
export function getTargetCustomerInfo(id){
  return request({
    url: `/api/marketing-service/marketing/target-customer/${id}/editing-detail`,
    method: 'get'
  })
}

//查询关键信息
export function targetCustomerKeyInfo(targetCustomerId) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/key-info/${targetCustomerId}`,
    method: 'get'
  })
}

//添加关键信息
export function addKeyInfo(id,data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/key-info/${id}`,
    method: 'post',
    data:data
  })
}

//查询目标拜访记录
export function findVisitRecord(targetCustomerId,data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/${targetCustomerId}/visiting-record/list`,
    method: 'post',
    data:data
  })
}

//添加目标客户拜访记录
export function addVisitRecord(targetCustomerId,data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/${targetCustomerId}/visiting-record`,
    method: 'post',
    data:data
  })
}

//模糊检索拜访记录中已存在的拜访对象
export function findVisitObject(targetCustomerId,data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/${targetCustomerId}/visiting-record/target-list`,
    method: 'post',
    data:data
  })
}

//添加目标客户拜访备注
export function addComment(visitingRecordId,data) {
  return request({
    url: `/api/marketing-service/marketing/target-customer/visiting-record/${visitingRecordId}/comment`,
    method: 'post',
    data:data
  })
}

//根据用户名，查询简单用户对象
export function simpleList(obj) {
  return request({
    url: `/api/user-service/user/simple/list`,
    method: 'post',
    data:obj
  })
}

//行业树
export function industryTree() {
  return request({
    url: `/api/customer-service/customer/industry-tree`,
    method: 'get',
  })
}

//根据组织机构id 查询当前组织机构下的对应账号的人员
export function getOrganizationInfo(data) {
  return request({
    url: `/api/user-service/user/organization/user-list`,
    method: 'post',
    data:data
  })
}







