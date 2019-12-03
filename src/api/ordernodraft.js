import request from '@/utils/request'

//////订单改单审核列表api
//////订单取消审核列表api
//////服务费率审核列表api



//取消订单审核列表
export  function orderList(data) {
    return request({
      url:'/api/order-service/ordercancel/all-list',
      method:'post',
      data:data,
    })
   }
   
//取消订单审核列表-待审核
export  function getCancelAuditeList(data) {
  return request({
    url:'/api/order-service/ordercancel/pending-review-list',
    method:'post',
    data:data,
  })
 }
//取消订单审核列表-已通过
export  function getCancelPassList(data) {
  return request({
    url:'/api/order-service/ordercancel/review-pass-list',
    method:'post',
    data:data,
  })
 }
//取消订单审核列表-已驳回
export  function getCancelRejectList(data) {
  return request({
    url:'/api/order-service/ordercancel/review-rejected-list',
    method:'post',
    data:data,
  })
 }
//审核驳回订单取消申请0：正常，1：状态改变
export  function rejectCancelOrder(data) {
  return request({
    url:'/api/order-service/ordercancel/',
    method:'put',
    data:data,
    exception:true
  })
 }
//审核驳回订单取消申请0：正常，1：状态改变

export  function testRejectCancelOrder(id) {
  return request({
    url:`/api/order-service/ordercancel/${id}/reject-check`,
    method:'get',
    exception:true
  })
 }


//根据取消申请id获取订单取消申请
export  function  getCancelDetail(id) {
  return request({
    url:`/api/order-service/ordercancel/${id}`,
    method:'get',
    exception:true
  })
 }
 
//根据取消申请id获取订单取消申请(审核校验接口)

export  function  getCancelCheck(id) {
  return request({
    url:`/api/order-service/ordercancel/${id}/check`,
    method:'get',
    exception:true
  })  
 }


 ///根据取消申请id审核通过订单取消申请0：正常，1：状态改变，2：订单已复核

 export  function  passCancelOrder(id) {
  return request({
    url:`/api/order-service/ordercancel/${id}`,
    method:'put',
  })
 }
//根据取消申请id获取订单取消申请带日志详情
export  function  findCancelDetailLog(id) {
  return request({
    url:`/api/order-service/ordercancel/${id}/detail`,
    method:'get',
  })
 }


//根据用户名，查询简单用户对象（包括id、userName、realName）(erp系统之外的用户的)
export  function getUserList(data) {
  return request({
    url:'/api/user-service/external/user/simple/list',
    method:'post',
    data:data,
  })
 }
//根据用户名，查询简单用户对象（包括id、userName、realName）
export  function findUserList(data) {
  return request({
    url:'/api/user-service/user/simple/list',
    method:'post',
    data:data,
  })
 }
//获取取消订单审核列表每个状态数据行数

export  function getCancelStatus() {
  return request({
    url:'/api/order-service/ordercancel/count-list',
    method:'get',
  })
 }

 ///////////////////////订单改单
 //订单改单列表各状态数量
 export  function getStatus() {
  return request({
    url:'/api/order-service/order/change/status-count',
    method:'get',
  })
 }
//改单审核列表页面-全部
export  function getAllList(data) {
  return request({
    url:'/api/order-service/order/change/change-order-all-list',
    method:'post',
    data:data
  })
 }
//改单审核列表页面-待审核
export  function getAuditeList(data) {
  return request({
    url:'/api/order-service/order/change/change-order-pending-review-list',
    method:'post',
    data:data
  })
 }
//改单审核列表页面-已通过
export  function getPassList(data) {
  return request({
    url:'/api/order-service/order/change/change-order-review-pass-list',
    method:'post',
    data:data
  })
 }
//改单审核列表页面-已驳回
export  function getRejectList(data) {
  return request({
    url:'/api/order-service/order/change/change-order-review-reject-list',
    method:'post',
    data:data
  })
 }
//改单审核详情数据
export  function getEditerOrderDetail(id) {
  return request({
    url:`/api/order-service/order/change/${id}/change-info`,
    method:'get',
    exception:true
  })
 }
//改单审核通过
export  function auditerPass(id) {
  return request({
    url:`/api/order-service/order/change/${id}/review-pass-change-order`,
    method:'get',
  })
 }
//改单审核驳回
export  function auditerNoPass(data) {
  return request({
    url:'/api/order-service/order/change/review-reject-change-order',
    method:'post',
    data:data
  })
 }

///////////////////////////////服务费率审核

//订单服务费率-全部列表
export  function getRateList(data) {
  return request({
    url:'/api/order-service/order/service-fee-rate/available-list',
    method:'post',
    data:data
  })
 }
//订单服务费率-已审核列表
export  function getRateAuditeList(data) {
  return request({
    url:'/api/order-service/order/service-fee-rate/pass-list',
    method:'post',
    data:data
  })
 }
//订单服务费率-待审核列表
export  function getRateToAuditeList(data) {
  return request({
    url:'/api/order-service/order/service-fee-rate/pending-review-list',
    method:'post',
    data:data
  })
 }
//订单服务费率-已驳回列表
export  function getRateRejectList(data) {
  return request({
    url:'/api/order-service/order/service-fee-rate/rejected-list',
    method:'post',
    data:data
  })
 }

//订单服务费率审核历史信息
export  function getRateAuditeOldData(id) {
  return request({
    url:`/api/order-service/order/service-fee-rate/${id}/review-history-list`,
    method:'get',
  })
 }
//订单服务费率审核通过
export  function RateAuditePass(id) {
  return request({
    url:`/api/order-service/order/service-fee-rate/${id}/review-pass`,
    method:'get',
    exception:true
  })  
 }
 //订单服务费率审核驳回
export  function RateAuditeNoPass(data) {
  return request({
    url:`/api/order-service/order/service-fee-rate/review-reject`,
    method:'post',
    data:data,
    exception:true
  })  
 }
//获取所有订单状态以及数量



 export  function getRateStatus() {
  return request({
    url:`/api/order-service/order/service-fee-rate/status-count`,
    method:'get',
  })  
 }


 //////////////
 //////////改单-取消订单-服务费率的查询条件的模糊搜索接口


 //获取客户名称列表
 export  function getCustomerList(name) {
  return request({
    url:`/api/customer-service/customer/${name}/customer-name`,
    method:'get'
  })  
 }
// 

//根据userName查询用户信息

export  function getUser(data) {
  return request({
    url:`/api/user-service/user/simple/list`,
    method:'post',
    data:data
  })  
 }


//订单服务费率审核驳回检查 0：不可驳回；1：可驳回
  export  function checkReview(id) {
    return request({
      url:`/api/order-service/order/service-fee-rate/${id}/review-reject/check`,
      method:'get',
      exception:true
    })  
   }


///改单审核前校验,返回0时校验正确,返回2状态变化


export  function editerOrderCheck(id,status) {
  return request({
    url:`/api/order-service/order/change/check/${id}/${status}/change-order-review`,
    method:'get',
    exception:true
  })  
 }



//改单审核通过前校验,返回0时校验正确,返回2状态变化，返回13 当前订单仓库已复核出库，订单不可再更改，只能在订单已完成后进行退货申请，当前只能驳回申请。

export  function editerCheck(id,status) {
  return request({
    url:`/api/order-service/order/change/check/${id}/${status}/change-order-review-pass`,
    method:'get',
    exception:true
  })  
 }

 //改单审核驳回前校验,返回0时校验正确,返回2状态变化



export  function editerRejectCheck(id,status) {
  return request({
    url:`/api/order-service/order/change/check/${id}/${status}/change-order-review-reject`,
    method:'get',
    exception:true
  })  
 }

//根据用户名，查询简单用户对象（包括id、username、realName）
export function userList(data) {
  return request({
    url: '/api/user-service/user/simple/list',
    method: 'post',
    data:data
  })
}

