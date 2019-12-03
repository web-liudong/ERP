import request from '@/utils/request'
import api from '../index'

//竞价状态统计
export function getStatusCount() {
  return request({
    url: api+`/bidding-service/bidding/status-count`,
    method: 'get',
  })
}

//获取待处理竞价信息列表
export function getPendingList(data) {
  return request({
    url: api+`/bidding-service/bidding/wait-deal-list`,
    method: 'post',
    data:data
  })
}

//获取待处理竞价信息列表
export function getBiddingPriceList(data) {
  return request({
    url: api+`/bidding-service/bidding/bidding-list`,
    method: 'post',
    data:data
  })
}

//获取报价中竞价信息列表
export function getQuoteList(data) {
  return request({
    url: api+`/bidding-service/bidding/price-quote-list`,
    method: 'post',
    data:data
  })
}

//获取报价中待完成信息列表
export function getPendingFinishList(data) {
  return request({
    url: api+`/bidding-service/bidding/wait-accomplish-list`,
    method: 'post',
    data:data
  })
}

//获取报价中已完成信息列表
export function getFinishedList(data) {
  return request({
    url: api+`/bidding-service/bidding/accomplish-list`,
    method: 'post',
    data:data
  })
}

//获取报价中已删除信息列表
export function getDeletedList(data) {
  return request({
    url: api+`/bidding-service/bidding/delete-list`,
    method: 'post',
    data:data
  })
}

//获取报价中地址异常信息列表
export function getAbnormalAddressList(data) {
  return request({
    url: api+`/bidding-service/bidding/address-exception-list`,
    method: 'post',
    data:data
  })
}

//批量推送
export function batchPush(data){
  return request({
    url:api+`/bidding-service/bidding/batch-push`,
    method:'put',
    data:data
  })
}

//批量推送服务方
export function pushServiceParty(serverId,data){
  return request({
    url:api+`/bidding-service/bidding/server/${serverId}`,
    method:'put',
    data:data
  })
}



//推送服务方
export function sendServiceparty(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}/push`,
    method: 'put',
  })
}

//更改服务方
export function changeServiceParty(id,serverId) {
  return request({
    url:api+`/bidding-service/bidding/${id}/server/${serverId}`,
    method: 'put',
  })
}

//获取服务方信息
export function getServiceInfo(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}/pre-server`,
    method: 'get',
  })
}

//删除竞价信息
export function deleteBiddingPrice(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}`,
    method: 'delete',
  })
}

//撤回
export function retract(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}/revoke-server`,
    method: 'put',
  })
}

//交易作废
export function transactionVoid(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}/invalid`,
    method: 'put',
  })
}

//录入结果
export function entryResult(id,data) {
  return request({
    url:api+`/bidding-service/bidding/${id}/result`,
    method: 'put',
    data:data
  })
}

//获取录入信息
export function getEntryInfo(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}/pre-result`,
    method: 'get',
  })
}


//创建竞价信息
export function createBiddingPrice(data) {
  return request({
    url:api+`/bidding-service/bidding/`,
    method: 'post',
    data:data
  })
}

//警告竞价信息
export function addBiddingPrice(data) {
  return request({
    url:api+`/bidding-service//bidding/confirm`,
    method: 'post',
    data:data
  })
}

//	竞价结束前停止报价的时长
export function getBiddingEndTime(projectId) {
  return request({
    url:api+`/bidding-service/bidding-end-time-setup/${projectId}`,
    method: 'get',
  })
}

//获取服务方
export function getServiceParty(data) {
  return request({
    url:api+`/organization-service/organization/list/name`,
    method: 'post',
    data:data
  })
}

//获取服务方
export function getWinningBid(data) {
  return request({
    url:api+`/bidding-service/bidding/exterior-customer-name/list`,
    method: 'post',
    data:data
  })
}

//获取详情
export function getDetailInfo(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}/detail`,
    method: 'get',
  })
}

//编辑回显
export function editEchoBiddingPriceInfo(id) {
  return request({
    url:api+`/bidding-service/bidding/${id}/pre-update`,
    method: 'get'
  })
}

//编辑
export function editBiddingPriceInfo(id,data) {
  return request({
    url:api+`/bidding-service/bidding/${id}`,
    method: 'put',
    data:data
  })
}

//警告编辑
export function warningEditBiddingPriceInfo(id,data) {
  return request({
    url:api+`/bidding-service/bidding/${id}/push-second`,
    method: 'put',
    data:data
  })
}

//导出
export function exportBiddingPriceInfo(data,status) {
  return request({
    url:api+`/bidding-service/bidding/export?status=${status}`,
    method: 'post',
    data:data,
    responseType: 'blob',
    exception:true
  })
}

//竞价信息导入
export function importPriceInfo(data) {
  return request({
    url:api+`/bidding-service/bidding/import`,
    method: 'post',
    data:data
  })
}

//导入记录
export function importPriceInfoRecord(data) {
  return request({
    url:api+`/bidding-service/bidding/import-list`,
    method: 'post',
    data:data
  })
}

//结果导入记录
export function importResultPriceInfoRecord(data) {
  return request({
    url:api+`/bidding-service/bidding/result-import-list`,
    method: 'post',
    data:data
  })
}

//军网竞价信息导入
export function importMilitaryPriceInfo(data) {
  return request({
    url:api+`/bidding-service/bidding/military-network-import`,
    method: 'post',
    data:data
  })
}

//根据县id查询匹配的服务方
export function regionServiceParty(regionId,data) {
  return request({
    url:api+`/organization-service/organization/business-region/${regionId}/list/name`,
    method: 'post',
    data:data
  })
}