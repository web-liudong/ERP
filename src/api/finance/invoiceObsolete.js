import request from '@/utils/request'

//发票作废申请状态数量
export function getPurchseStatuecont(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/status-count',
        method: 'get',
        data: data
    })
}

//填写红字信息表
export function putRedWordinfo(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/red-word-info',
        method: 'put',
        data: data
    })
}


//发票作废申请操作记录
export function getInvalidRecord(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/record',
        method: 'post',
        data: data
    })
}

//获取作废发票申请列表
export function postPurchaseInvalidlist(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/list',
        method: 'post',
        data: data
    })
}

//详情
export function getPurchaseInvaliddetail(invalidApplicationId) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/detail/'+invalidApplicationId,
        method: 'get',
        data: invalidApplicationId
    })
}
//批量通过
export function putBathsPass(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/batch-pass',
        method: 'put',
        data: data
    })
}

//批量作废|红冲
export function putBathsRed(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/batch',
        method: 'put',
        data: data
    })
}

// 驳回
export function putPurchaseReject(invalidApplicationId,data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/'+invalidApplicationId+'/reject',
        method: 'put',
        data: data
    })
}

// 通过
export function putBathPass(invalidApplicationId) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/'+invalidApplicationId+'/pass',
        method: 'put',
        data: invalidApplicationId
    })
}

// 作废|红冲
export function putBathRed(invalidApplicationId) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/'+invalidApplicationId,
        method: 'put',
        // data: invalidApplicationId
    })
}

//申请作废
export function postPurchaseCancellation(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/',
        method: 'post',
        data: data
    })
}


//开票点编码
export function putPurchaseCode(data) {
    return request({
        url: '/api/purchase-service/centralPurchase/invoice/invalid/invoice_terminal_code',
        method: 'put',
        data: data
    })
}