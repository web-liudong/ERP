import request from '@/utils/request'
//客户列表
export function customerList(data) {
  return request({
    url: '/api/customer-service/customer/list',
    method: 'post',
    data:data
  })
}
//项目列表
export function projectName(data) {
  return request({
    url: '/api/customer-service/project/name-list',
    method: 'post',
    data:data
  })
}
//客户名称
export function customers(name) {
  return request({
    url: `/api/customer-service/customer/${name}/parent-name-list`,
    method: 'get'
  })
}

//关联客户 客户模糊查询
export function associatedCustomers(data) {
  return request({
    url: `/api/customer-service/customer/associated-customers`,
    method: 'post',
    data:data
  })
}

//获取客户名称列表
export function customerName(name) {
  return request({
    url: `/api/customer-service/customer/${name}/customer-name`,
    method: 'get'
  })
}

//启用
export function activate(id) {
  return request({
    url: `/api/customer-service/customer/${id}/activate`,
    method: 'put',
    exception:true
  })
}
//启用客户开票信息
export function customerinvoiceactivate(id) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}/activate`,
    method: 'put',
    exception:true
  })
}
//禁用客户开票信息
export function customerinvoiceforbidden(id) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}/forbidden`,
    method: 'put',
    exception:true
  })
}
//默认客户开票信息
export function customerinvoicedefault(id) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}/default`,
    method: 'put',
    exception:true
  })
}
//禁用
export function forbidden(id) {
  return request({
    url: `/api/customer-service/customer/${id}/forbidden`,
    method: 'put',
    exception:true
  })
}
//添加客户
export function addcustomer(data) {
  return request({
    url: `/api/customer-service/customer/`,
    method: 'post',
    data:data,
    exception:true
  })
}
//编辑客户
export function editcustomer(id,data) {
  return request({
    url: `/api/customer-service/customer/${id}`,
    method: 'put',
    data:data,
    exception:true
  })
}
//行业树
export function industrytree() {
  return request({
    url: `/api/customer-service/customer/industry-tree`,
    method: 'get',
  })
}
//行业树
export function getcustomerinfo(id) {
  return request({
    url: `/api/customer-service/customer/${id}/edit`,
    method: 'put'
  })
}
//客户详情
export function customerdetail(id) {
  return request({
    url: `/api/customer-service/customer/${id}`,
    method: 'get'
  })
}

//银行账号查询
export function bankaccount(id) {
  return request({
    url: `/api/customer-service/customer/${id}/bank-account`,
    method: 'get'
  })
}

//详情操作日志
export function detaillog(id) {
  return request({
    url: `/api/customer-service/customer/${id}/log`,
    method: 'get'
  })
}
//开票信息列表
export function customerinvoice(data) {
  return request({
    url: `/api/customer-service/customerinvoice/list`,
    method: 'post',
    data:data
  })
}
//开票信息详情
export function invoicedetail(id) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}`,
    method: 'get',
  })
}
//开票信息操作
export function invoicedetaillog(id) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}/log`,
    method: 'get',
  })
}
//部门信息
export function customerdepartment(id) {
  return request({
    url: `/api/user-service/customer-department/list/${id}`,
    method: 'post',
  })
}
//部门信息
export function purchaserlist(data) {
  return request({
    url: `/api/user-service/customer/user/list`,
    method: 'post',
    data:data
  })
}

//新增开票信息
export function addinvoice(data) {
  return request({
    url: `/api/customer-service/customerinvoice/`,
    method: 'post',
    data:data
  })
}
//获取开票信息
export function getinvoice(id) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}/edit`,
    method: 'get',
  })
}
//禁用开票信息
export function forbiddeninvoice(id) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}/forbidden`,
    method: 'put',
  })
}

//修改开票信息
export function changeinvoice(id,data) {
  return request({
    url: `/api/customer-service/customerinvoice/${id}`,
    method: 'put',
    data:data
  })
}
//获取公用信息
export function customercmmmon(id){
  return request({
    url: `/api/customer-service/customer/${id}/customer-common`,
    method: 'get',
  })
}
//客户部门列表
export function purchaserdetail(id){
  return request({
    url: `/api/user-service/customer/user/${id}/detail`,
    method: 'get'
  })
}
//客户组织架构
export function customerorganization(id){
  return request({
    url: `/api/customer-service/customer/${id}/sub-customer-organization`,
    method: 'get'
  })
}
//新增客户部门
export function adddep(data){
  return request({
    url: `/api/user-service/customer-department/`,
    method: 'post',
    data:data
  })
}

//删除客户部门
export function deldep(id){
  return request({
    url: `/api/user-service/customer-department/${id}`,
    method: 'delete',
  })
}

//编辑客户部门
export function editdep(id,name){
  return request({
    url: `/api/user-service/customer-department/${id}/${name}`,
    method: 'put',
  })
}
//编辑采购人信息
export function editInfo(id){
  return request({
    url: `/api/user-service/customer/user/${id}/edit-info`,
    method: 'get',
  })
}
//部门下拉树
export function departmenttree(id){
  return request({
    url: `/api/user-service/customer-department/select/${id}`,
    method: 'post',
  })
}
//添加采购人员
export function addpurchaser(data){
  return request({
    url: `/api/user-service/customer/user/`,
    method: 'post',
    data:data
  })
}
//更新采购人信息
export function updatepurchaser(id,data){
  return request({
    url: `/api/user-service/customer/user/${id}`,
    method: 'put',
    data:data
  })
}
//采购人列表
export function listdept(id){
  return request({
    url: `/api/user-service/customer/user/list-dept/${id}`,
    method: 'post'
  })
}
//客户开票信息抬头列表
export function invoicetitle(id,invoiceTitle){
  return request({
    url: `/api/customer-service/customerinvoice/${id}/invoice-title?invoiceTitle=${invoiceTitle}`,
    method: 'get'
  })
}

//客户服务方设置列表
export function serverSetList(data){
  return request({
    url: `/api/customer-service/customer-project-organization/list`,
    method: 'post',
    data:data
  })
}

//查询客户
export function simpleList(data){
  return request({
    url: `/api/user-service/external/user/simple/list`,
    method: 'post',
    data:data
  })
}
//客户状态数量
export function customercount(projectId){
  return request({
    url: `/api/customer-service/customer/status-count`,
    method: 'get',
    params:{
      projectId:projectId
    }
  })
}

//合作伙伴
export function organizationList(data){
  return request({
    url: `/api/user-service/organization/list/name`,
    method: 'post',
    data:data
  })
}
//客户服务方添加
export function organizationAdd(data){
  return request({
    url: `/api/customer-service/customer-project-organization/`,
    method: 'post',
    data:data
  })
}
//客户服务方修改
export function organizationFix(id,data){
  return request({
    url: `/api/customer-service/customer-project-organization/${id}`,
    method: 'put',
    data:data
  })
}

//客户提审
export function submitReview(id){
  return request({
    url: `/api/customer-service/customer/${id}/submit-review`,
    method: 'put'
  })
}

//参数模板审核驳回
export function customerReject(id,data) {
  return request({
    url: `/api/customer-service/customer/${id}/review-reject`,
    method: 'put',
    data:data
  })
}

//参数模板审核驳回
export function checkPermission(id) {
  return request({
    url: `/api/customer-service/customer/${id}/check-permission`,
    method: 'get'
  })
}

//参数模板审核通过
export function customerPass(id) {
  return request({
    url: `/api/customer-service/customer/${id}/review-pass`,
    method: 'get',
    exception:true
  })
}
//客户服务方操作日志
export function logList(data) {
  return request({
    url: `/api/customer-service/customer-project-organization/log-list`,
    method: 'post',
    data:data
  })
}
//客户服务方回显
export function listInfo(id) {
  return request({
    url: `/api/customer-service/customer-project-organization/${id}`,
    method: 'get'
  })
}

//客户服务方回显
export function listDelete(id) {
  return request({
    url: `/api/customer-service/customer-project-organization/${id}`,
    method: 'delete',
    exception:true
  })
}

//人员管理角色设置
export function roleSet(data){
  return request({
    url: `/api/user-service/external/role/list`,
    method: 'post',
    data:data
  })
}

//人员管理角色获取
export function getRole(id){
  return request({
    url: `/api/user-service/external/user/${id}/1/role`,
    method: 'get'
  })
}

//保存用户角色信息
export function roleSave(id,data){
  return request({
    url: `/api/user-service/external/user/${id}/role`,
    method: 'post',
    data:data
  })
}

//查询用户名称
export function checkName(data){
  return request({
    url: `/api/customer-service/customer/check-customer-name`,
    method: 'post',
    data:data
  })
}

//删除客户
export function delCustomer(id){
  return request({
    url: `/api/customer-service/customer/${id}`,
    method: 'delete',
    data:{
      id:id
    }
  })
}

//获取客户人员详情
export function userDetail(id){
  return request({
    url: `/api/user-service/customer/user/${id}/detail`,
    method: 'get'
  })
}

//验证用户是否有权编辑客户
export function ownAuthority(id){
  return request({
    url: `/api/customer-service/customer/${id}/own-authority`,
    method: 'get'
  })
}

//校验登录名
export function isAvailable(data){
  return request({
    url: `/api/user-service/external/username/is-available`,
    method: 'post',
    data:data
  })
}

//客户开票信息抬头判重
export function checkInvoice(data){
  return request({
    url: `/api/customer-service/customerinvoice/check-invoice-title`,
    method: 'post',
    data:data,
    exception:true
  })
}

//模糊搜索人员
export function nameList(data){
  return request({
    url: `/api/user-service/customer/user/name-list`,
    method: 'post',
    data:data
  })
}

//根据项目id和客户名模糊查询客户列表
export function pnameList(data){
  return request({
    url: `/api/customer-service/customer/name-list`,
    method: 'post',
    data:data
  })
}

//根据专柜项目id，查询专柜下商品标签
export function findshoppeTags(id){
  return request({
    url: `/api/shoppe-release-service/shopperelease/shoppe/${id}/findshoppe_tags`,
    method: 'post',
    data:{
      shoppeId:id
    }
  })
}



