import request from '@/utils/request'
import api from '../index.js'

//获取应付账款全部列表
export function getAllList(data) {
    return request({
      url:`/api/bill-service/account/payable/all-list`,
      method:'post',
      data:data
    })
  }
//获取应付账款已完成列表
export function getCompletedList(data) {
    return request({
      url:`/api/bill-service/account/payable/completed-list`,
      method:'post',
      data:data
    })
  }
//获取应付账款已作废列表

export function getInvalidList(data) {
    return request({
      url:`/api/bill-service/account/payable/invalided-list`,
      method:'post',
      data:data
    })
  }
//获取应付账款未回款列表

export function getNoRefundList(data) {
    return request({
      url:`/api/bill-service/account/payable/not-receivable-list`,
      method:'post',
      data:data
    })
  }
//获取应付账款已回款列表

export function getPassRefundList(data) {
    return request({
      url:`/api/bill-service/account/payable/receivable-list`,
      method:'post',
      data:data
    })
  }

//关闭应付账款

export function closeAccountspayable(id,data) {
    return request({
      url:`/api/bill-service/account/payable/${id}/completed`,
      method:'put',
      data:data
    })
  }

//应付账款详情

export function getDetail(id) {
    return request({
      url:`/api/bill-service/account/payable/${id}/detail`,
      method:'get',
    })
  }

//获取开票方所有项目信息

export function getInvoiceInfo(data) {
    return request({
      url:`/api/bill-service/account/payable/customer-list`,
      method:'post',
      data:data
    })
  }

//付款
export function payment(data) {
    return request({
      url:`/api/bill-service/account/payable/payment`,
      method:'post',
      data:data
    })
  }

//付款页面初始化

export function paymentPageInit(data) {
    return request({
      url:`/api/bill-service/account/payable/payment/initialization`,
      method:'post',
      data:data
    })
  }
//获取付款记录
export function getPaymentRecord(data) {
    return request({
      url:`/api/bill-service/account/payable/record-list`,
      method:'get',
      data:data
    })
  }

//获取所有服务方信息
export function getProviderInfo(data) {
    return request({
      url:`/api/bill-service/account/payable/server-list`,
      
      method:'post',
      data:data
    })
  }

//统计应付账款数量

export function getAccountsPayableCount() {
    return request({
      url:`/api/bill-service/account/payable/status-count`,
      method:'get',
    })
  }


//获取全部汇总金额

export function getTotalPayment(data) {
  return request({
    url:`/api/bill-service/account/payable/all-count`,
    method:'post',
    data:data
  })
}

//获取应付账款已完成汇总金额

export function getTotalPaymentCompleted(data) {
  return request({
    url:`/api/bill-service/account/payable/completed-count`,
    method:'post',
    data:data
  })
}

//获取应付账款已作废汇总金额

export function getTotalPaymentInvalid(data) {
  return request({
    url:`/api/bill-service/account/payable/invalided-count`,
    method:'post',
    data:data
  })
}

//获取应付账款未回款汇总金额

export function getTotalPaymentUnpaid(data) {
  return request({
    url:`/api/bill-service/account/payable/not-receivable-count`,
    method:'post',
    data:data
  })
}


//获取应付账款已回款汇总金额

export function getTotalPaymentPaid(data) {
  return request({
    url:`/api/bill-service/account/payable/receivable-count`,
    method:'post',
    data:data
  })
}

//全部已付导出

export function exportPayment(data) {
  return request({
    url:`/api/bill-service/account/payable/all-export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//已完成已付导出
export function exportCompleted(data) {
  return request({
    url:`/api/bill-service/account/payable/completed-export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//已失效已付导出

export function exportFailure(data) {
  return request({
    url:`/api/bill-service/account/payable/invalided-export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//未收款已付导出

export function exportUnpaid(data) {
  return request({
    url:`/api/bill-service/account/payable/not-receivable-export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//已收款已付导出

export function exportPaid(data) {
  return request({
    url:`/api/bill-service/account/payable/receivable-export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//下载文件

export function downFile(id) {
  return request({
    url:`/api/file-service/file/download`,
    method:'get',
    params:id
  })
}

//项目模糊查询
export function selectProject(data) {
  return request ({
    url: api + '/customer-service/project/name-list',
    method: 'post',
    data: data,
  })
}

//关联客户 客户模糊查询
export function selectCustomer(data) {
  return request ({
    url: api + '/customer-service/customer/associated-customers',
    method: 'post',
    data: data,
  })
}

//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function selectOrganization(data) {
  return request ({
    url: api + '/user-service/organization/list/name',
    method: 'post',
    data: data,
  })
}

// 服务方列表
export function selectServer(data) {
  return request ({
    url:'/api/customer-service/customer/name-list',
    method: 'post',
    data: data,
  })
}

//导入后点击付款按钮

export function importPayment(fileId,data) {
  return request ({
    url:`/api/bill-service/account/payable/${fileId}/payment`,
    method: 'post',
    data: data,
  })
}
  



