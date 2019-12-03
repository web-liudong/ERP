import request from '@/utils/request'

// 回款信息列表
export function PaymentInformation(data) {
  return request({
    url: '/api/bill-service/payment-received/list',
    method:'post',
    data:data
  })
}

//根据组织id获取银行信息
export function BankInformation(data) {
  return request({
    url: '/api/user-service/organization/bankaccount/list',
    method:'post',
    data:data
  })
}

// 回款信息统计
export function StatusCount() {
  return request({
    url: '/api/bill-service/payment-received/status-count',
    method:'get'
  })
}

// 根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function organizationSelect(data) {
  return request({
    url: '/api/user-service/organization/list/name',
    method:'post',
    data:data
  })
}


// 返回所有省级id
export function shengAreaid() {
  return request({
    url: '/api/location-service/region/provinces-based-id',
    method:'get'
  })
}



// 插入数据
export function stedata(data) {
  return request({
    url: '/api/bill-service/payment-received/create',
    method:'post',
    data:data
  })
}



//项目模糊查询
export function searchProject(data) {
  return request({
    url: '/api/customer-service/project/name-list',
     method:'post',
    data:data
  })
}

//获取待编辑的回款信息数据
export function getdata(id) {
  return request({
    url: '/api/bill-service/payment-received/'+id+'/before-update',
     method:'put'
  })
}


// 编辑回款信息
export function changedata(id,data) {
  return request({
    url: '/api/bill-service/payment-received/'+id,
     method:'put',
     data:data
  })
}



// 删除回款信息
export function deletedata(id) {
  return request({
    url: '/api/bill-service/payment-received/'+id,
     method:'delete'
  })
}


//推送至认款列表
export function pushdata(data) {
  return request({
    url: '/api/bill-service/payment-received/push',
     method:'put',
     data:data
  })
}



// 财务认款操作页面
export function renkuanpage(id) {
  return request({
    url: '/api/bill-service/payment-received/'+id+'/claim-page',
    method:'get'
  })
}

// 回款详情
export function huikuandetail(id) {
  return request({
    url: '/api/bill-service/payment-received/'+id+'/detail',
    method:'get'
  })
}


//关联订单查询
export function guanliandata(data) {
  return request({
    url: '/api/bill-service/payment-received/find-order-list',
     method:'post',
     data:data
  })
}

//项目模糊查询
export function selectProject(data) {
  return request ({
    url: '/api/customer-service/project/name-list',
    method: 'post',
    data: data,
  })
}


// {
//   "name": "string"
// }
//关联客户 客户模糊查询
export function selectCustomer(data) {
  return request ({
    url:'/api/customer-service/customer/associated-customers',
    method: 'post',
    data: data,
  })
}

// 订单客户采购人列表
export function selectcaigouren(data) {
  return request ({
    url:'/api/user-service/customer/user/name-list',
    method: 'post',
    data: data,
  })
}



// 服务方列表
export function selectfuwufang(data) {
  return request ({
    url:'/api/organization-service/organization/list/name',
    method: 'post',
    data: data,
  })
}



//认款
export function renkuan(id,data) {
  return request ({
    url:'/api/bill-service/payment-received/'+id+'/claim',
    method: 'put',
    data: data,
  })
}

//导出
export function paymentexport(data) {
  return request ({
    url:'/api/bill-service/payment-received/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//撤销认款
export function revokeclaim(id) {
  return request ({
    url:`/api/bill-service/payment-received/${id}/revoke-claim`,
    method: 'put'
  })
}