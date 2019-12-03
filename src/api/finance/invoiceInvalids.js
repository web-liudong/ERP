import request from '@/utils/request'

// 发票作废申请新增
export function postBilApplication(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/',
        method: 'post',
        data: data
    })
}

//发票作废申请详情
export function getBillAppdetail(id) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/detail',
        method: 'get',
        data: id
    })
}


//发票作废申请-待作废状态作废
export function postBillAppinvalid(id) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/invalid',
        method: 'post',
        data: id
    })
}

//发票作废申请-待审核状态审核通过
export function putBillApppass(id) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/pass',
        method: 'put',
        data: id
    })
}

//红冲
export function putBillAppred(id,data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/red-word',
        method: 'put',
        data: data
    })
}
//填写红字信息表
export function putBillAppredinfo(id,data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/red-word-info?redWordInfo='+data,
        method: 'put',
    })
}


//填写红字信息表
export function putBillAppredCode(id,data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/invoice-terminal-code?invoiceTerminalCode='+data,
        method: 'put',
    })
}



//发票作废申请-审核驳回
export function postBillAppreject(id,data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/reject?rejectReason='+data,
        method: 'post',
        data: id
    })
}

//根据查询条件，返回发票作废申请列表-全部
export function postBillAppalllist(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/all-list',
        method: 'post',
        data: data
    })
}

// 发票作废申请-待作废状态批量作废
export function postBillAppbatchs(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/invalid-batch',
        method: 'post',
        data: data
    })
}

//根据查询条件，返回发票作废申请列表-作废失败
export function postBillAppfaliedlist(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/invalid-failed-list',
        method: 'post',
        data: data
    })
}

//根据查询条件，返回发票作废申请列表-作废中
export function postBillApplidinglist(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/invaliding-list',
        method: 'post',
        data: data
    })
}

//根据查询条件，返回发票作废申请列表-已作废
export function postBillApplidlist(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/invalid-list',
        method: 'post',
        data: data
    })
}

//发票作废申请操作记录列表查询
export function postBillApprecord(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/invoice-invalid-record',
        method: 'post',
        data: data
    })
}


//发票作废申请-待审核状态批量审核通过
export function postBillApppassbatchs(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/pass-batch',
        method: 'post',
        data: data
    })
}


//根据查询条件，返回发票作废申请列表-待作废
export function postBillApppendinglist(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/pending-invalid-list',
        method: 'post',
        data: data
    })
}

//根据查询条件，返回发票作废申请列表-待审核
export function postBillApplidingreviewlist(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/pending-review--list',
        method: 'post',
        data: data
    })
}

//根据查询条件，返回发票作废申请列表-已驳回
export function postBillApprejectedlist(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/rejected-list',
        method: 'post',
        data: data
    })
}


//发票作废申请列表各状态数量
export function getBillAppcount(data) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/count',
        method: 'get',
        data: data
    })
}

//获取驳回原因
export function getBillApprejectReaso(id) {
    return request({
        url: '/api/bill-service/invoice-invalid-application/'+id+'/rejectReason',
        method: 'get',
        data: id
    })
}