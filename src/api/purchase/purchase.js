import request from '@/utils/request'


//新建采购需求
export function createPurchaseDemand(data) {
  return request({
    url: '/api/purchase-service/purchase/requirement/',
    method: 'post',
    data: data,
  })
}

//采购单列表
export function managementList(data) {
  return request({
    url: '/api/purchase-service/purchase/management/list',
    method: 'post',
    data: data,
  })
}
//采购单状态统计
export function statusCount() {
  return request({
    url: '/api/purchase-service/purchase/management/status-count',
    method: 'get'
  })
}
//采购单详情
export function getdetail(id) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/detail`,
    method: 'get'
  })
}

//到货凭证列表
export function getfilelist(data) {
  return request({
    url:`/api/file-service/file/list`,
    method:'post',
    data:data
  })
}
//删除到货凭证
export function deletecargo(id,fileId) {
  return request({
    url:`/api/purchase-service/purchase/management/${id}/cargo-receipt/${fileId}`,
    method:'delete',
  })
}
//采购单导出
export function orderlistexport(data) {
  return request({
    url:`/api/purchase-service/purchase/management/order-list-export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//采购单导出商品明细列表
export function itemlistexport(id) {
  return request({
    url: `/api/purchase-service/purchase/management/item-list-export?purchaseId=${id}`,
    method: 'post',
    data:{
      purchaseId:id
    },
    responseType: 'blob'
  })
}
//采购单取消
export function cancel(id,data) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/cancel `,
    method: 'post',
    data:data,
    exception:true
  })
}
//可用仓库搜索
export function searchlist(data) {
  return request({
    url: `/api/warehouse-service/warehouse/search-list`,
    method: 'post',
    data: data
  })
}
//损益确认列表
export function profitlosslist(id) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/profit-loss-list `,
    method: 'get',
  })
}
//损益确认
export function confirmincome(data) {
  return request({
    url: `/api/purchase-service/purchase/management/profit-loss-confirm`,
    method: 'put',
    data: data
  })
}

//生成采购单初始数据获取-需求
export function creatPurchase(data) {
  return request({
    url: `/api/purchase-service/purchase/management/create-purchase-data-info/requirement`,
    method: 'post',
    data: data
  })
}
//生成采购单初始数据获取-集采
export function creatPurchaseCentralized(data) {
  return request({
    url: `/api/purchase-service/purchase/management/create-purchase-data-info/centralized`,
    method: 'post',
    data: data
  })
}

//查找设置了集采的组织机构
export function getOrganizationList(data) {
  return request({
    url: `/api/purchase-service/purchase/setup/organization/list`,
    method: 'post',
    data: data
  })
}

//根据当前用户所在组织机构模糊查询供应商名称
export function getOrganizationFindSupplier(id, data) {
  return request({
    url: `/api/supplier-service/supplier/${id}/findsupplier-name`,
    method: 'post',
    data: data
  })
}

//查找当前登录用户所在组织机构下，且设置了指定品类采购权限的采购员
export function getBuyerList(categoryId) {
  return request({
    url: `/api/purchase-service/purchase/setup/${categoryId}/buyer/list`,
    method: 'get',
    unloading:true
  })
}

//预览采购单
export function creatPurchasePreview(data) {
  return request({
    url: `/api/purchase-service/purchase/management/create-purchase-preview`,
    method: 'post',
    data: data
  })
}

//提交采购单-需求
export function creatPurchaseSubmit(data) {
  return request({
    url: `/api/purchase-service/purchase/management/create-purchase-submit/requirement`,
    method: 'post',
    data: data
  })
}

//提交采购单-集采
export function creatPurchaseCentralizedSubmit(data) {
  return request({
    url: `/api/purchase-service/purchase/management/create-purchase-submit/centralized`,
    method: 'post',
    data: data
  })
}

//损益确认
export function confirmation(id,data) {
  return request({
    url:`/api/purchase-service/purchase/management/${id}/arrival-confirmation`,
    method:'post',
    data:data
  })
}

//下载文件某个类型的最新文件
export function downloadFile(type) {
  return request({
    url: `/api/file-service/file/download/${type}/latest`,
    method: 'get',
  })
}
//根据仓库名模糊查询仓库

export function findWarehouse(data) {
  return request({
    url: `/api/warehouse-service/warehouse/search-list`,
    method: 'post',
    data: data
  })
}
//查询当前登录用户所属组织机构下辖仓库

export function byOrganizationFindWarehouse() {
  return request({
    url: `/api/warehouse-service/warehouse/list-viewedby-login-user`,
    method: 'post',
  })
}
//根据组织机构编号查询仓库数据
export function byOrganizationIDFindWarehouse(organizationId) {
  return request({
    url: `/api/warehouse-service/warehouse/${organizationId}/list`,
    method: 'get',
  })
}

//可用仓库搜索
export function findWarehouseList(data) {
  return request({
    url: `/api/warehouse-service//warehouse/search-list`,
    method: 'post',
    data: data,
    unloading:true
  })
}

//////////////9月20号需求更改

// //根据订单编号查询订单明细

// export function getOrderData(no) {
//   return request({
//     url: `/api/order-service/order/${no}/no/item/detail`,
//     method: 'get',
//   })
// }

//根据发货单编号查询明细
export function getOrderDataByInvoiceNo(no) {
  return request({
    url: `/api/order-service/order/delivery/${no}/no/item/detail`,
    method: 'get',
  })
}


//根据名称模糊查询sku列表
export function getGoodsList(data) {
  return request({
    url: `/api/product-service/sku/avaliable-name-like-list`,
    method: 'post',
    data: data
  })
}

//根据组织机构id，查询组织机构id和名称（后台服务使用）

export  function getOrganization(id) {
  return request({
    url:`/api/user-service/organization/${id}/organizationtitle`,
    method:'get',
  })
  }

//通过token获取用户信息
export  function byTokenGetUserList() {
  return request({
    url:`/api/user-service/user/getUserInfo`,
    method:'get',
  })
  }
//获取采购需求/详情

export  function findPurchaseDemand(data) {
  return request({
    url:`/api/purchase-service/purchase/requirement/detail`,
    method:'post',
    data:data
  })
  }

//更新采购需求

export  function editerPurchaseDemand(data) {
  return request({
    url:`/api/purchase-service/purchase/requirement/`,
    method:'put',
    data:data
  })
  }

//根据订单编号查询订单详情
export  function findOrderDetail(no) {
  return request({
    url:`/api/order-service/order/${no}/no/detail`,
    method:'get',
  })
  }


//下载文件某个类型的最新文件(下载模板)

export  function downloadTemplatePurchaseDemand(type) {
  return request({
    url:`/api/file-service/file/download/latest`,
    method:'get',
    params:type
  })
  }

//查找全部设置了集采的组织机构
export  function getSetupOrgList(data) {
  return request({
    url:`/api/purchase-service/purchase/setup/organization/gathering-list`,
    method:'get',
    params:data
  })
}
//导入采购需求
export function purchaseRequirementImport(data) {
  return request({
    url: api + '/purchase-service/purchase/requirement/transfer',
    method: 'post',
    data: data,
  })
}

//供应商查询
export function nameList(name) {
  return request({
    url: `/api/purchase-service/purchase/management/purchase-suplier/${name}/list`,
    method: 'get'
  })
}

//查询可用仓库数据 - 根据组织机构编号和仓库名称

export function findWarehouseName(organizationId,name) {
  return request({
    url: `/api/warehouse-service/warehouse/${organizationId}/list/${name}`,
    method: 'get',
  })
}

//wms查询商品库存
export function getWmsSkuStock(data) {
  return request({
    url: '/api/warehouse-service/wms/inventory/list',
    method: 'post',
    data: data,
    unloading:true
  })
}


//no 转 id , key 是no，value 是 id
export function getSkuId(data) {
  return request({
    url: '/api/product-service/sku/no/convert/id',
    method: 'post',
    data: data,
  })
}


//根据purchaseId回显采购草稿单

export function purchaseEditingInfo(id) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/purchase/order/editing`,
    method: 'get',
  })
}
//保存草稿（采购草稿单编辑）

export function purchaseToDraft(data) {
  return request({
    url: `/api/purchase-service/purchase/management/save/purchase/order/editing`,
    method: 'post',
    data:data
  })
}
//提交草稿单（采购草稿单编辑）

export function purchaseDraftSubmit(data) {
  return request({
    url: `/api/purchase-service/purchase/management/submit/purchase/order/editing`,
    method: 'post',
    data:data
  })
}

//生成采购草稿单

export function createPurchaseDraft(data) {
  return request({
    url: `/api/purchase-service/purchase/management/create-purchase-order-editing`,
    method: 'post',
    data:data
  })
}


///拆分采购草稿单

export function resetPurchaseDraft(data) {
  return request({
    url: `/api/purchase-service/purchase/management/split-purchase-order-editing`,
    method: 'post',
    data:data
  })
}

///采购单管理提交
export function orderSubmit(id) {
  return request({
    url: `/api/purchase-service/purchase/management/${id}/submit/purchase/order/editing`,
    method: 'get'
  })
}

//采购草稿单导出


export function exportDraftList(data) {
  return request({
    url: `/api/purchase-service/purchase/management/export/purchase/editing`,
    method: 'post',
    data:data,
    responseType:'blob'
  })
}