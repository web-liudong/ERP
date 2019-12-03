import request from '@/utils/request'


//获取商城列表信息
export function getDataList(data) {
  return request({
    url:'/api/mall-release-service/mall/info/list',
    method:'post',
    data:data,
  })
}

//获取商城信息
export function getDataList1(id) {
  return request({
    url:`/api/mall-release-service/mall/info/${id}`,
    method:'get',
  })
}

//获取商城选项列表
export function getOptionList(data) {
  return request({
    url:'/api/mall-release-service/mall/pushoptions/list',
    method:'post',
    data:data
  })
}

//  获取商城详情信息
export function getDetailData(id) {
  return request({
    url:`/api/mall-release-service/mall/info/detail/${id}`,
    method:'get',
  })
}

//添加商城选项
export function addMallOption(data) {
  return request({
    url:`/api/mall-release-service/mall/pushoptions`,
    method:'post',
    data:data
  })
}
//编辑商城选项
export function editerMallOption(id,data) {
  return request({
    url:`/api/mall-release-service/mall/pushoptions/${id}`,
    method:'put',
    data:data
  })
}

//根据id获取商城选项信息
export function byIDGetMallOption(id) {
  return request({
    url:`/api/mall-release-service/mall/pushoptions/${id}`,
    method:'get',
  })
}

//删除商城选项
export function byIDDelMallOption(id) {
  return request({
    url:`/api/mall-release-service/mall/pushoptions/${id}`,
    method:'delete',
  })
}

//添加商城信息

export function addMallInfo(data) {
  return request({
    url:`/api/mall-release-service/mall/info`,
    method:'post',
    data:data
  })
}

//修改商城信息
export function editerMallInfo(id,data) {
  return request({
    url:`/api/mall-release-service/mall/info/${id}`,
    method:'put',
    data:data
  })
}

//获取所有商城选项

export function getAllOptions() {
  return request({
    url:`/api/mall-release-service/mall/pushoptions`,
    method:'get',
  })
}

//商城项目模糊搜索
export function mallSelectName(data) {
  return request({
    url:`/api/customer-service/project/mall-name-list`,
    method:'post',
    data:data
  })
}


////////////////////商城商品池管理//////////


//商城商品池管理列表

export function getPondDataList(data) {
  return request({
    url:'/api/mall-release-service/mall/sku/list',
    method:'post',
    data:data,
  })
}
//删除

export function deleteSku(id) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}`,
    method:'delete',
  })
}
//编辑商品名称
export function editerGoodsName(id,mallId,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/${mallId}/update`,
    method:'put',
    params:{skuName:data}
  })
}


//下架

export function lowerShelf(id) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/pull-off-shelve`,
    method:'put',
  })
}
//推送

export function pushPondGoods(id,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/push`,
    method:'post',
    data:data
  })
}

//上架
export function upShelf(id) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/put-on-shelve`,
    method:'put',
  })
}

//设置库存

export function setStockGoods(id,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/set-up-inventory`,
    method:'put',
    data:data
  })
}
//设置售价

export function setGoodsSale(id,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/set-up-mall-price`,
    method:'put',
    data:data
  })
}

//商城商品详情

export function mallGoodsDetail(mallId,skuId) {
  return request({
    url:`/api/mall-release-service/mall/sku/${mallId}/${skuId}/detail`,
    method:'get',
  })
}

///添加商品

export function addGoodsMall(mallId,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/${mallId}/add`,
    method:'put',
    data:data
  })
}

//导入

export function importGoods(mallId,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/${mallId}/import`,
    method:'post',
    data:data
  })
}


//批量添加商品

export function addBatchGoods(mallId,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/${mallId}/add`,
    method:'put',
    data:data
  })
}

//批量删除
export function batchDelete(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/delete`,
    method:'post',
    data:data
  })
}

//批量下架
export function batchLowShelf(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/pull-off-shelves`,
    method:'post',
    data:data
  })
}

//批量推送

export function batchPush(file,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/push`,
    method:'post',
    file:file,
    data:data
  })
}

//批量上架

export function batchUpShelf(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/put-on-shelves`,
    method:'post',
    data:data
  })
}

//批量设置库存

export function batchSetStock(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/set-up-inventory`,
    method:'post',
    data:data
  })
}

//批量设置限价


export function batchSetMaxSale(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/set-up-limit-price`,
    method:'post',
    data:data
  })
}

//导出

export function exportGoods(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//绑定商品导出 

export function exportBindGoods(mallId,data) {
  return request({
    url:`/api/mall-release-service/mall/sku/${mallId}/export-mall-sku-match`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}



//导入记录

export function importRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/import-list`,
    method:'post',
    data:data
  })
}

//操作记录
export function operationRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/operation-list`,
    method:'post',
    data:data
  })
}

//推送记录

export function pushRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/push-list`,
    method:'post',
    data:data
  })
}
//商城池添加商品列表（已上柜）
export function mallPondAddGoods(data) {
  return request({
    url:`/api/mall-release-service/mall/sku/sku-list`,
    method:'post',
    data:data
  })
}

//设置对应分类

export function SetOtherClassify(id,mallCategoryMatchId,mallId) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/${mallCategoryMatchId}/${mallId}/set-up-category`,
    method:'put',
  })
}

//批量设置对应分类

export function AllSetOtherClassify(data,mallCategoryMatchId,mallId) {
  return request({
    url:`/api/mall-release-service/mall/sku/batch/${mallCategoryMatchId}/${mallId}/set-up-category`,
    method:'put',
    data:data
  })
}
//获取商城对应的品目领先分类树

export function getOtherClassifyTree(mallId) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/mall-category-tree`,
    method:'get',
  })
}




////////////////商城品牌管理///////////////

///新增品牌对应关系

export function addMallBrand(data) {
  return request({
    url:`/api/mall-release-service/mall/brand/`,
    method:'post',
    data:data
  })
}


///删除品牌对应关系

export function delMallBrand(id) {
  return request({
    url:`/api/mall-release-service/mall/brand/${id}`,
    method:'delete',
  })
}

//清空品牌对应数据

export function clearMallBrand(mallId) {
  return request({
    url:`/api/mall-release-service/mall/brand/${mallId}/clear-brand`,
    method:'delete',
  })
}

//品牌对应关系批量导入

export function importMallBrand(data,mallId) {
  return request({
    url:`/api/mall-release-service/mall/brand/${mallId}/import`,
    method:'post',
    data:data
  })
}

//品牌对应关系导入记录

export function importMallBrandRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/brand/import-log`,
    method:'post',
    data:data
  })
}

//品牌对应列表

export function brandCorrespondList(data) {
  return request({
    url:`/api/mall-release-service/mall/brand/list`,
    method:'post',
    data:data
  })
}

//品牌对应关系操作记录

export function brandCorrespondOptionsRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/brand/operation-log`,
    method:'post',
    data:data
  })
}

///////////////////////商城参数管理///////////////////////

//新增参数对应关系

export function addParamsRelation(data) {
  return request({
    url:`/api/mall-release-service/mall/category/attribute/`,
    method:'post',
    data:data
  })
}

//删除参数对应关系

export function delParamsRelation(id) {
  return request({
    url:`/api/mall-release-service/mall/category/attribute/${id}`,
    method:'delete',
  })
}

//品牌对应关系批量导入

export function brandCorrespondImport(mallId,categoryMatchId,data) {
  return request({
    url:`/api/mall-release-service/mall/category/attribute/${mallId}/${categoryMatchId}/import`,
    method:'post',
    data:data
  })
}

//参数对应关系导入记录

export function paramsCorrespondImportRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/category/attribute/import-log`,
    method:'post',
    data:data
  })
}

//参数对应列表

export function paramsCorrespondList(data) {
  return request({
    url:`/api/mall-release-service/mall/category/attribute/list`,
    method:'post',
    data:data
  })
}

//参数对应关系操作记录
export function paramsCorrespondOptionRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/category/attribute/operation-log`,
    method:'post',
    data:data
  })
}


/////////////////////商城第三方品目对应服务//////////////////////////

//添加品目对应

export function addItemCorrespond(data) {
  return request({
    url:`/api/mall-release-service/mall/category/`,
    method:'post',
    data:data
  })
}

//删除品目对应

export function delItemCorrespond(id) {
  return request({
    url:`/api/mall-release-service/mall/category/${id}`,
    method:'delete',
  })
}

///清空品目对应

export function clearItemCorrespond(mallId) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/clear-mall-category`,
    method:'delete',
  })
}

//导入品目对应

export function importItemCorrespond(data,mallId) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/import`,
    method:'post',
    data:data
  })
}

//导入品目对应日志列表

export function importItemCorrespondList(data,mallId) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/logs-list`,
    method:'post',
    data:data
  })
}


//添加商品绑定关系

export function addGoodsCorrespond(msId,mallCategoryMatchId) {
  return request({
    url:`/api/mall-release-service/mall/category/${msId}/${mallCategoryMatchId}`,
    method:'put',
  })
}

//批量添加商品绑定关系
export function addBatchGoodsCorrespond(mallCategoryMatchId,data) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallCategoryMatchId}/add-mall-sku-match`,
    method:'post',
    data:data
  })
}

//商城商品池管理列表 - 绑定商品使用
export function batchGoodsList(data,mallId) {
  return request({
    url:`/api/mall-release-service/mall/sku/${mallId}/list`,
    method:'post',
    data:data
  })
}



//品目对应列表

export function itemCorrespondList(data) {
  return request({
    url:`/api/mall-release-service/mall/category/list`,
    method:'post',
    data:data
  })
}
//获取可对应的品目树
export function getItemTree(mallId) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/category-tree`,
    method:'get',
  })
}
//获取商城对应的品目领先分类树
export function getItemInfo(mallId) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/mall-category-tree`,
    method:'get',
  })
}
//品目对应关系操作记录
export function getItemOpertionRecord(data) {
  return request({
    url:`/api/mall-release-service/mall/category/operation-log-list`,
    method:'post',
    data:data
  })
}

//展示给对方分类，level==1 对应一级 以此类推

export function getOtherItem(mallId,level,name) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/${level}/level`,
    method:'get',
    params:{name:name}
  })
}

//获取第三方品目树

export function getThreeClassify(mallId) {
  return request({
    url:`/api/mall-release-service/mall/category/${mallId}/party-c-category-tree`,
    method:'get',
  })
}



/////////////参数//////////

//根据参数名模糊获取参数列表
export function findParamsName(categoryId,data) {
  return request({
    url:`/api/product-service/categoryattribute/${categoryId}/category-attribute-list`,
    method:'post',
    params:data
  })
}

//绑定商品-删除

export function delGoodsCorresponding(id) {
  return request({
    url:`/api/mall-release-service/mall/sku/${id}/delete-match`,
    method:'delete',
  })
}

//////////////区域编码//////张华


//获取所有区域编码类型

export function getRegionCode() {
  return request({
    url:`/api/location-service/region/regioncode-list`,
    method:'get',
  })
}





































