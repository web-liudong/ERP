import request from '@/utils/request'
import api from '../index'
//仓库服务api
//后端：陈明亮
//http://47.94.238.148:8089/swagger-ui.html#/%E4%BB%93%E5%BA%93API
export function postSimpleList(data) {                 //根据用户名，查询简单用户对象（包括id、userName、realName）
  return request({
    url: api + '/user-service/user/simple/list',
    method: 'post',
    data: data,
  })
}
export function getWarehouseViewedby() {                 //查询当前登录用户可见仓库
  return request({
    url: api + '/warehouse-service/warehouse/list-viewedby-login-user',
    method: 'post',
  })
}
export function getWarehouseinfopurview(id) {                 //查询仓库查看权限列表
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/infopurview',
    method: 'get',
  })
}
export function putWarehouseinfopurview(id,data) {               //更新仓库查看权限
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/infopurview',
    method: 'put',
    data: data,
  })
}

export function deleteWarehouseDelete(id) {          //删除
  return request({
    url: api + '/warehouse-service/warehouse/'+ id ,
    method: 'delete',
  })
}


export function getWarehouseDetaills(id) {                 //详情
  return request({
    url: api + '/warehouse-service/warehouse/' + id+ '/detail',
    method: 'get',
  })
}


export function getWarehouseRedactDetaills(id) {            //编辑（获取编辑默认值）
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/edit',
    method: 'get',
  })
}
export function putWarehouseReview(id,data) {               //审核（审核仓库）
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/review',
    method: 'put',
    data: data,
  })
}

export function putWarehouseSubmitReview(id) {             //提交审核
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/submit-review',
    method: 'put',
  })
}
export function getWarehouseUpdateDetaills(id) {           //更新详细
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/update-detail',
    method: 'get',
  })
}


export function putWarehouseUpdateSubmitReview(id,data) {             //更新并提交审核
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/update-submit-review',
    method: 'put',
    data: data,
  })
}
export function postWarehouseDvailableList(data) {//可用列表
  return request({
    url: api + '/warehouse-service/warehouse/available-list/',
    method: 'post',
    data:data,
  })
}
export function putWarehouseUpdateDraft(id,data) {                  //更新仓库  保存草稿
  return request({
    url: api + '/warehouse-service/warehouse/update-draft',
    method: 'put',
    data: data,
  })
}
export function postWarehouseContact(id,data) {                 //创建仓库联系人
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/contact',
    method: 'post',
    data: data,
  })
}

export function getWarehouseLog(id) {                     //根据仓库编号获取日志信息
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/OperationLog' ,
    method: 'get',
  })
}





export function deleteWarehouseContactIdDelete(id) {             //跟据仓库联系人删除仓库联系人
  return request({
    url: api + '/warehouse-service/warehouse/'+ id +'/contact',
    method: 'delete',
  })
}




export function postWarehouseAddSumit(data) {                  //创建仓库并提交审核
  return request({
    url: api + '/warehouse-service/warehouse/create-sumit-review',
    method: 'post',
    data:data,
  })
}
export function postWarehouseAddDraft(data) {                  //创建仓库并保存为草稿
  return request({
    url: api + '/warehouse-service/warehouse/draft',
    method: 'post',
    data:data,
  })
}

export function postWarehouseDraftList(data) {             //获取草稿仓库列表
  return request({
    url: api + '/warehouse-service/warehouse/draft-list',
    method: 'post',
    data: data,
    type: "json",
  })
}

export function postWarehousePendingList(data) {            //获取待审核仓库列表
  return request({
    url: api + '/warehouse-service/warehouse/pending-review-list',
    method: 'post',
    data: data,
    type: "json",
  })
}

export function postWarehouseRejectedList(data) {            //获取已驳回仓库列表
  return request({
    url: api + '/warehouse-service/warehouse/rejected-list',
    method: 'post',
    data: data,
    type: "json",
  })
}
export function getWarehouseStatusCount(data) {            //获取库列表数量
  return request({
    url: api + '/warehouse-service/warehouse/status-count',
    method: 'get',
  })
}
