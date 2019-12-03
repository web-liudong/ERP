import request from '@/utils/request'
import api from '../index'



//新建采购退货单
export function postNewPurchaseReturnBill(data) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/',
    method: 'post',
    data:data,
  })
}
//取消采购退货单
export function deleteCancellationofPurchaseReturnBill(id) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/'+ id,
    method: 'delete',
  })
}

//获取采购退货单详情
export function getDetailsOfPurchaseReturnBil(id) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/'+ id +'/detail',
    method: 'get',

  })
}

//采购退货单数量
export function postNumberOfReturnBills() {
  return request({
    url: api + '/purchase-service/purchase-returnorder/count',
    method: 'post',
  })
}


//采购退货单数据导出
export function postDataExportofReturnBill(data) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/export',
    method: 'post',
    data:data,
  })
}

//采购退货单列表-全部
export function postFulllistOfReturnOrders(data) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/list-all',
    method: 'post',
    data:data,
  })
}


//采购退货单列表-已完成
export function postReturnListCompleted(data) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/list-complete',
    method: 'post',
    data:data,
  })
}


//采购退货单列表-处理中
export function postReturnBillListProcessing(data) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/list-handler',
    method: 'post',
    data:data,
  })
}


//采购退货单商品列表查询
export function postMerchandiseInquiryonReturnBill(data) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/skulist',
    method: 'post',
    data:data,
  })
}
//仓库搜索
export function postWarehouseList(data) {
  return request({
    url: api + '/warehouse-service/warehouse/search-list',
    method: 'post',
    data:data,
  })
}

//采购退货单完成（快递状态下）
export function getCompleteReturnBill(id) {
  return request({
    url: api + '/purchase-service/purchase-returnorder/'+id + '/complete ',
    method: 'get',
    data:id,
  })
}
