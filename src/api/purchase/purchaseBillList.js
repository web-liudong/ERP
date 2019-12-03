import request from '@/utils/request'
import api from '../index.js'

// 获取各种状态的数量
export function statusCount() {
  return request({
    url: api + '/purchase-service/purchasebill/status-count',
    method: 'get'
  })
}

// 获取全部结算列表
export function listAll(data) {
  return request({
    url: api + '/purchase-service/purchasebill/all-list',
    method: 'post',
    data: data,
  })
}

// 获取待审批结算列表\
export function listCommit(data) {
  return request({
    url: api + '/purchase-service/purchasebill/approval-list',
    method: 'post',
    data: data,
  })
}

// 获取已驳回结算列表
export function listReject(data) {
  return request({
    url: api + '/purchase-service/purchasebill/reject-list',
    method: 'post',
    data: data,
  })
}

// 获取已通过结算列表
export function listPass(data) {
  return request({
    url: api + '/purchase-service/purchasebill/pass-list',
    method: 'post',
    data: data,
  })
}

// 获取已取消结算列表
export function listCancel(data) {
  return request({
    url: api + '/purchase-service/purchasebill/cancel-list',
    method: 'post',
    data: data,
  })
}

// 获取待提交结算列表
export function toSubmission(data) {
  return request({
    url:'/api/purchase-service/purchasebill/commit-list',
    method: 'post',
    data: data,
  })
}


// 导出全部结算列表
export function allExport(data) {
  return request({
    url: api + '/purchase-service/purchasebill/all-export',
    method: 'post',
    data: data,
  })
}

//导出待提交结算列表
export function submissionExport(data) {
  return request({
    url: '/api/purchase-service/purchasebill/commit-export',
    method: 'post',
    data: data,
  })
}


// 导出待审批结算列表
export function approvalExport(data) {
  return request({
    url: api + '/purchase-service/purchasebill/approval-export',
    method: 'post',
    data: data,
  })
}

// 导出已驳回结算列表
export function rejectExport(data) {
  return request({
    url: api + '/purchase-service/purchasebill/reject-export',
    method: 'post',
    data: data,
  })
}

// 导出已通过结算列表
export function passExport(data) {
  return request({
    url: api + '/purchase-service/purchasebill/pass-export',
    method: 'post',
    data: data,
  })
}

// 导出已取消结算列表
export function cancelExport(data) {
  return request({
    url: api + '/purchase-service/purchasebill/cancel-export',
    method: 'post',
    data: data,
  })
}




//获取采购单列表(新建结算单时使用)
export function findPurchaseData(data) {
  return request({
    url:  '/api/purchase-service/purchasebill/purchaseorder-list',
    method: 'post',
    data: data,
  })
}

//获取采购单明细列表
export function findPurchaseDetailList(data) {
  return request({
    url: '/api/purchase-service/purchasebill/purchaseorder-item',
    method: 'post',
    data: data,
  })
}


// 详情结算单
export function getPurchaseDetail(purchaseBillId) {
  return request({
    url: api + `/purchase-service/purchasebill/${purchaseBillId}/detail`,
    method: 'get'
  })
}

// 导出结算单详情
export function exportPurchaseDetail(purchaseBillId) {
  return request({
    url: api + `/purchase-service/purchasebill/${purchaseBillId}/export`,
    method: 'get'
  })
}


// 创建结算单

export function createBillList(data) {
  return request({
    url: '/api/purchase-service/purchasebill/bill-create',
    method: 'post',
    data: data,
  })
}

//编辑结算单

export function editerBillList(purchaseBillId,data) {
  return request({
    url: `/api/purchase-service/purchasebill/${purchaseBillId}/edit`,
    method: 'post',
    data: data,
  })
}

//编辑初始化结算单

export function editerInitBillList(purchaseBillId) {
  return request({
    url: `/api/purchase-service/purchasebill/${purchaseBillId}/init`,
    method: 'get',
  })
}

//提供其他服务调用查询(供应商名称的模糊搜索)
export function findSupplierNameList(data) {
  return request({
    url: `/api/supplier-service/supplier/find-info`,
    method: 'post',
    data:data
  })
}

//根据用户名，查询简单用户对象（包括id、userName、realName）  制单员模糊查询
export function findUserNameList(data) {
  return request({
    url: `/api/user-service/user/simple/list`,
    method: 'post',
    data:data
  })
}

//获取关联结算列表

export function getPurchaseBillList(purchaseBillId) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${purchaseBillId}/bill-list`,
    method: 'get',
  })
}

//新建采购单发票

export function createPurchaseListInvoice(purchaseBillId,data) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${purchaseBillId}`,
    method: 'post',
    data:data
  })
}

//编辑修改（发票编辑）

export function editerPurchaseListInvoice(invoiceId,billId,data) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${invoiceId}/${billId}`,
    method: 'put',
    data:data
  })
}

//编辑回显(发票编辑)

export function editerInvoiceData(invoiceId,purchaseBillId) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${invoiceId}/${purchaseBillId}/invoice-editing` ,
    method: 'get',
  })
}

//根据发票代码查询发票信息

export function getInvoiceDataByNo(invoiceCode) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${invoiceCode}/bill-invoice`,
    method: 'get',
    exception:true
  })
}



//删除发票
export function deleteInvoiceList(invoiceId,purchaseBillId) {
  return request({
    url: `/api/purchase-service/purchase/invoice/${invoiceId}/${purchaseBillId}`,
    method: 'delete',
  })
}

////通过token获取用户信息
export  function byTokenGetUserList() {
  return request({
    url:`/api/user-service/user/getUserInfo`,
    method:'get',
  })
  }
//根据组织机构id查询 当前组织机构下的所有用户 并支持name模糊查询

export  function byOrganizationUserList(data) {
  return request({
    url:`/api/user-service/user/organization/user-list`,
    method:'post',
    data:data
  })
  }


//提供其他服务调用查询(供应商)
export  function findSupplierPurchase(data) {
  return request({
    url:`/api/supplier-service/supplier/find-info`,
    method:'post',
    data:data
  })
  }
//根据ID获取供应商详情(基础信息)

export  function findSupplierDeatail(id) {
  return request({
    url:`/api/supplier-service/supplier/${id}`,
    method:'get',
  })
  }
//根据主键id获取供应商业务详情（业务信息）

export  function findSupplierName(id) {
  return request({
    url:`/api/supplier-service/supplierbiz/${id}`,
    method:'get',
  })
  }




//根据当前用户所在组织机构模糊查询供应商名称

export  function findSupplierByOrganizationId(organizationId,data) {
  return request({
    url:`/api/supplier-service/supplier/${organizationId}/purchase-findsupplier`,
    method:'post',
    data:data
  })
  }

//提交审核结算单

export  function toSubmitApproval(purchaseBillId) {
  return request({
    url:`/api/purchase-service/purchasebill/${purchaseBillId}/submit-review`,
    method:'put',
  })
  }

//审核结算单(审核页的数据回显)

export  function submitApprovalList(purchaseBillId) {
  return request({
    url:`/api/purchase-service/purchasebill/${purchaseBillId}/approval`,
    method:'get',
  })
  }
//审核通过审核结算单
export  function submitApprovalPass(purchaseBillId) {
  return request({
    url:`/api/purchase-service/purchasebill/${purchaseBillId}/review-pass`,
    method:'put',
  })
  }

//取消结算单

export  function cancelApprovalList(purchaseBillId) {
  return request({
    url:`/api/purchase-service/purchasebill/${purchaseBillId}/review-cancel`,
    method:'put',
  })
  }

//驳回审核结算单

export  function rejectApprovalList(purchaseBillId,data) {
  return request({
    url:`/api/purchase-service/purchasebill/${purchaseBillId}/review-reject`,
    method:'put',
    data:data
  })
  }


//根据id查询文件信息

export  function getFileList(id) {
  return request({
    url:`/api/file-service/file/${id}`,
    method:'get',
  })
  }

  //批量下载文件

  export  function downLoadFileList(data) {
    return request({
      url:`/api/file-service/file/download/batch`,
      method:'post',
      data:data
    })
    }
  //查询文件列表
  export  function findFile(data) {
    return request({
      url:`/api/file-service/file/list`,
      method:'post',
      data:data
    })
    }

