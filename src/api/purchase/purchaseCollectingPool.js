import request from '@/utils/request.js'
import api from '../index.js'


//根据名称模糊查询sku列表 商品名称模糊查询
export function selectProduct(data) {
  return request({
    url: api + '/product-service/sku/avaliable-name-like-list',
    method: 'post',
    data: data,
  })
}

// 查找全部设置了集采的组织机构
export function selectOrganization() {
  return request ({
    url: api + '/purchase-service/purchase/setup/organization/gathering-list',
    method: 'get',
  })
}


//分类下拉级联搜索接口
export function findClassify(level, parentId, name) {
  return request({
    url: api + `/product-service/category/${level}/${parentId}/${name}/find-select-search-list`,
    method: 'get',
  })
}

//获取分类列表
export function selectList(level,parentId) {
  return request({
    url: `/api/product-service/category/${level}/${parentId}/find-select-list`,
    method: 'get',
    params:{
      parentId:parentId
    }
  })
}

//品牌名称的模糊搜索
export function remoteBrandName(data) {
  return request({
    url: api + '/product-service/brand/brand-authorization-list',
    method: 'post',
    data: data,
  })
}



//集采商品池列表
export function skuPoolList(data) {
  return request({
    url: api + '/search-service/centralPurchaseSkuPool/list',
    method: 'post',
    data: data,
  })
}


// 导出集采商品池列表
export function skuPoolExport(data) {
  return request({
    url: api + '/search-service/centralPurchaseSkuPool/export',
    method: 'post',
    data: data,
  })
}


// 根据Id 获取集采商品池
export function getPoolEditor(id) {
  return request({
    url: api + `/purchase-service/centralPurchaseSkuPool/${id}`,
    method: 'get'
  })
}

// 更新集采商品池
export function putSkuPool(data) {
  return request({
    url: api + '/purchase-service/centralPurchaseSkuPool/',
    method: 'put',
    data: data,
  })
}



// 删除集采商品池
export function deleteSkuPool(id) {
  return request({
    url: api + `/purchase-service/centralPurchaseSkuPool/${id}`,
    method: 'delete'
  })
}


// 新建集采商品池
export function createSkuPool(data) {
  return request({
    url: api + '/purchase-service/centralPurchaseSkuPool/',
    method: 'post',
    data: data,
  })
}



// 通过编号获取商品详情
export function getSkuNo(skuNo) {
  return request({
    url: api + `/product-service/sku/${skuNo}/no/detail`,
    method: 'get'
  })
}

export function importList(data) {
  return request({
    url: api+'/purchase-service/centralPurchaseSkuPool/import-file-log-list',
    method: 'post',
    data:data
  })
}