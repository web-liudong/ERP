import request from '@/utils/request'
import api from '../index'

//竞价状态统计
export function getStatusCount() {
  return request({
    url: api+`/bidding-service/repore-prepared/bidding-status-statistic`,
    method: 'get',
  })
}
//查询竞价信息状态
export function changeServiceParty(organizationId) {
  return request({
    url:`/api/supplier-service/supplier/${organizationId}/findsupplier-name`,
    method: 'post',
  })
}
//竞价报备列表-未匹配
export function biddingListNoMatch(data) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding-list-no-match`,
    method: 'post',
    data:data
  })
}
//竞价报备列表-匹配异常
export function biddingListMatchErr(data) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding-list-match-err`,
    method: 'post',
    data:data
  })
}
//竞价报备列表-已匹配
export function biddingListAlreadyMatch(data) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding-list-already-match`,
    method: 'post',
    data:data
  })
}
//竞价报备列表-已删除
export function biddingListDelete(data) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding-list-delete`,
    method: 'post',
    data:data
  })
}
export function biddingDelete(id) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding/${id}`,
    method: 'delete',
  })
}
export function createBidding(data) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding/`,
    method: 'post',
    data:data
  })
}


//报价列表-报价中
export function quoteListQuote(data) {
  return request({
    url:`/api/bidding-service/bidding/quote-list-quote`,
    method: 'post',
    data:data
  })
}
//报价列表-竞价中
export function quoteListBidden(data) {
  return request({
    url:`/api/bidding-service/bidding/quote-list-bidden`,
    method: 'post',
    data:data
  })
}

//报价列表-已完成
export function quoteListFinished(data) {
  return request({
    url:`/api/bidding-service/bidding/quote-list-finished`,
    method: 'post',
    data:data
  })
}
//报价列表-待完成
export function quoteListUnfinished(data) {
  return request({
    url:`/api/bidding-service/bidding/quote-list-unfinished`,
    method: 'post',
    data:data
  })
}

//报价列表-统计
export function biddStatusCount(data) {
  return request({
    url:`/api/bidding-service/bidding/quote/status-count`,
    method: 'get',
  })
}
//报价列表-详细
export function getDetail(id) {
  return request({
    url:`/api/bidding-service/bidding/quote/${id}/detail`,
    method: 'get',
  })
}

//报价列表-报价
export function putIncalid(id,data) {
  return request({
    url:`/api/bidding-service/bidding/quote/${id}/invalid`,
    method: 'put',
    data:data
  })
}
//报价列表-交易作废
export function toVoidBuss(id) {
  return request({
    url:`/api/bidding-service/bidding/quote/invalid/${id}`,
    method: 'put',
  })
}
//报价列表- 导出
export function quoteExport(data,params) {
  return request({
    url:`/api/bidding-service/bidding/quote/export`,
    method: 'post',
    data:data,
    params:params,
    responseType: 'blob',
  })
}
//竞价报备-编辑-回显
export function getidInfo(id) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding/${id}/info`,
    method: 'get',
  })
}

//竞价报备-编辑
export function editHold(id,data) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding/${id}`,
    method: 'put',
    data:data
  })
}

//竞价报备-详细
export function getreporeDetail(id) {
  return request({
    url:`/api/bidding-service/repore-prepared/bidding/${id}/detail`,
    method: 'get',
  })
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////报价截至时间设置/////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


//添加
export function addSetUp(data) {
  return request({
    url:`/api/bidding-service/bidding-end-time-setup/`,
    method: 'post',
    data:data
  })
}
//编辑
export function editSetUp(id,data) {
  return request({
    url:`/api/bidding-service/bidding-end-time-setup/${id}`,
    method: 'put',
    data:data
  })
}
//删除
export function deleteSetUp(id) {
  return request({
    url:`/api/bidding-service/bidding-end-time-setup/${id}`,
    method: 'delete',
  })
}
//list
export function listSetUp(data) {
  return request({
    url:`/api/bidding-service/bidding-end-time-setup/list`,
    method: 'post',
    data:data
  })
}
//操作日志
export function listLogSetUp(data) {
  return request({
    url:`/api/bidding-service/bidding-end-time-setup/log-list`,
    method: 'post',
    data:data
  })
}
//报价列表-生成订单
export function createOrder(id,data) {
  return request({
    url:`/api/bidding-service/bidding/order/${id}/`,
    method: 'post',
    data:data
  })
}
//报价列表-生成订单-展示
export function getOrderDetail(id) {
  return request({
    url:`/api/bidding-service/bidding/order/${id}/simple`,
    method: 'get',
  })
}

