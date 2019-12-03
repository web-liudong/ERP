import request from '@/utils/request'




//获取全部结算列表
export function getCollectPurchaselist(data) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/list`,
    method:'post',
    data:data
  })
}
//根据状态统计退单数量
export function getCollectPurchaseStatus() {
    return request({
      url:`/api/purchase-service/centralPurchaseBill/status-count`,
      method:'get',
    })
  }

//创建集采结算

export function createCollectPurchaseList(data) {
    return request({
      url:`/api/purchase-service/centralPurchaseBill/create`,
      method:'post',
      data:data
    })
  }

// //编辑结算单

export function editerCollectPurchaseList(centralPurchaseBillId,data) {
    return request({
      url:`/api/purchase-service/centralPurchaseBill/${centralPurchaseBillId}/edit`,
      method:'post',
      data:data
    })
  }

//详情

export function getCollectPurchaseDetail(centralPurchaseBillId) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/${centralPurchaseBillId}/detail`,
    method:'get',
  })
}


//编辑初始化结算单

export function getCollectPurchaseListInit(centralPurchaseBillId) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/${centralPurchaseBillId}/init`,
    method:'get',
  })
}


//取消结算单

export function cancelCollectPurchaseList(centralPurchaseBillId) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/${centralPurchaseBillId}/review-cancel`,
    method:'put',
  })
}
//完成结算单

export function completeCollectPurchaseList(centralPurchaseBillId) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/${centralPurchaseBillId}/review-complete`,
    method:'put',
  })
}

//获取采购单明细列表

export function findPurchaseListInfo(data) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/centralPurchaseOrder-item`,
    method:'post',
    data:data
  })
}
//获取采购单列表

export function findPurchaseList(data) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/centralPurchaseOrder-list`,
    method:'post',
    data:data
  })
}

//详情页导出

export function purchaseDetailExport(centralPurchaseBillId) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/${centralPurchaseBillId}/detail-export`,
    method:'get',
  })
}

//列表页导出

export function purchaseListExport(data) {
  return request({
    url:`/api/purchase-service/centralPurchaseBill/list-export`,
    method:'post',
    data:data,
    // responseType: 'blob'
  })
}

//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配


export function findOrganization(data) {
  return request({
    url:`/api/organization-service/organization/list/name`,
    method:'post',
    data:data,
  })
}

//下载文件

export function downfilePayment(id) {
  return request({
    url:`/api/file-service/file/download`,
    method:'get',
  })
}


























