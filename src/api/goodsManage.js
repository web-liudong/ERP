import request from '@/utils/request'


//根据名称模糊查询sku列表 商品名称模糊查询
export function selectProduct(data) {
  return request({
    url: `api/product-service/sku/avaliable-name-like-list`,
    method: 'post',
    data: data,
  })
}
//根据categoryId获取税收信息 /////10 22 新增接口
export function selectTaxInfo(categoryId) {
  return request({
    url: `api/product-service/category/${categoryId}/taxCode/info`,
    method: 'get',
  })
}
//商品提交撤回审核

export function cancelGoodsAudit(skuId,status) {
  return request({
    url: `api/product-service/sku/revoke/${skuId}/${status}/review`,
    method: 'post',
    exception:true
  })
}
//获取商品第一步
export function getSkuBasicInfo(id) {
  return request({
    url:`api/product-service/sku/${id}/basicInfo`,
    method:'get'
  })
}
//更新商品第一步

export function updateSkuBasicInfo(id,data) {
  return request({
    url:`api/product-service/sku/${id}/basicInfo`,
    method:'put',
    data:data,
  })
}
//获取商品第2步
export function getGoodsSecond(id) {
  return request({
    url:`api/product-service/skuAttribute/${id}/parameterInfo`,
    method:'get',
  })
}

//更新商品第二步

export function editerGoodsSecond(data) {
  return request({
    url:`/api/product-service/skuAttribute/parameterInfo`,
    method:'put',
    data:data
  })
}


//获取商品第三步

export function getPictureBanner(id) {
  return request({
    url:`/api/product-service/sku/${id}/imageInfo`,
    method:'get',
  })
}

// 获取最后常用的商品分类

export function getLastGoodsClassify(skuId) {
  return request({
    url:`/api/product-service/sku/${skuId}/recentlyUsedSku`,
    method:'get',
  })
}

//创建商品基础信息第一步
export function createSkuBasicInfo(data) {
  return request({
    url:'/api/product-service/sku/basicInfo',
    method:'post',
    data:data,
  })
}

//商品判重
export function recordGoods(categoryId,brandId) {
  return request({
    url:`/api/product-service/sku/checkSkuRepeated/${categoryId}/${brandId}`,
    method:'get',
  })
}
//判重提示

export function recordGoodsAdd(data) {
  return request({
    url:`/api/product-service/sku/checkSkuRepeated`,
    method:'post',
    data:data
  })
}



//创建商品第三步到草稿
export function createSkuImageInfo(data) {
  return request({
    url:'/api/product-service/sku/imageInfo',
    method:'post',
    data:data,
  })
}
//创建商品第2步

export function addGoodsSecond(data) {
  return request({
    url:'api/product-service/skuAttribute/parameterInfo',
    method:'post',
    data:data
  })
}
/*//检查商品是否重复
export function checkSkuRepeated(categoryId,brandId) {
  return request({
    url:`api/product-service/sku/checkSkuRepeated/${categoryId}/${brandId}`,
    method:'get',
  })
}*/

//复制商品


export function copyGoodsData(id,data) {
  return request({
    url:`/api/product-service/sku/${id}/copy-sku`,
    method:'post',
    data:data,
  })
}


////复制前获取商品
export function copyGoodsGetGoodsData(id) {
  return request({
    url:`/api/product-service/sku/${id}/copySkuInfo`,
    method:'get',
  })
}



//更新商品第三步 到待审核

export function updateSkuImageInfo(data) {
  return request({
    url:'/api/product-service/sku/imageInfo',
    method:'put',
    data:data,
  })
}

//查找最近使用的商品列表

export function findRecentlyUsedSkuList(skuId) {
  return request({
    url:`api/product-service/sku/recentlyUsedSku/${skuId}`,
    method:'get',
  })
}

//查找移动商品类型

export function findMoveSkuCategory(skuIds) {
  return request({
    url:`api/product-service/sku/recentlyUsedSku/${skuIds}`,
    method:'get',
  })
}

//更新商品第三步 到草稿

export function editerGoodsToDraft(data) {
  return request({
    url:'/api/product-service/sku/imageInfo/update-submit-review',
    method:'put',
    data:data,
  })
}
//创建商品第三步 到待审核
export function editerGoodsToExamine(data) {
  return request({
    url:'/api/product-service/sku/imageInfo/create-submit-review',
    method:'post',
    data:data,
  })
}
//  统计不同状态下的总数集合(商品)
export function getState() {
  return request({
    url:'/api/product-service/sku/count-list',
    method:'get',
  })
}


//分类下拉级联接口
export function selectGoods(level,parentId) {
  return request({
    url:`/api/product-service/category/${level}/${parentId}/find-select-list`,
    method:'get',
  })
}
//获取型号规格的接口
export function findPrimary(id) {
  return request({
    url:`/api/product-service/categoryattributetemplate/${id}/primary-attribute`,
    method:'get',
  })
}



//根据查询条件，返回已启用列表

export function getUsed(data) {
  return request({
    url:'/api/product-service/sku/available-list',
    method:'post',
    data:data
  })
}

//根据查询条件，返回草稿列表


export function getDraft(data) {
  return request({
    url:'/api/product-service/sku/draft-list',
    method:'post',
    data:data
  })
}


// 根据查询条件，返回禁用列表
export function getProhibit(data) {
  return request({
    url:'/api/product-service/sku/forbidden-list',
    method:'post',
    data:data
  })
}
//根据查询条件，返回待启用列表
export function getToEnable(data) {
  return request({
    url:'/api/product-service/sku/pending-available-list',
    method:'post',
    data:data
  })
}
//
// 根据查询条件，返回待审核列表
export function getToDraft(data) {
  return request({
    url:'/api/product-service/sku/pending-review-list',
    method:'post',
    data:data
  })
}
//根据查询条件，返回已驳回列表

export function getReject(data) {
  return request({
    url:'/api/product-service/sku/rejected-list',
    method:'post',
    data:data
  })
}
//
// 根据查询条件，返回已上柜列表
export function getCounted(data) {
  return request({
    url:'/api/product-service/sku/website-available-list',
    method:'post',
    data:data
  })
}

//删除
export function deleteGoods(id) {
  return request({
    url:`/api/product-service/sku/${id}`,
    method:'delete',
  })
}

//启用
export function toEnable(id) {
  return request({
    url:`/api/product-service/sku/${id}/available`,
    method:'put',
    exception:true
  })
}

//禁用

export function prohibit(id) {
  return request({
    url:`/api/product-service/sku/${id}/forbidden`,
    method:'put',
    exception:true
  })
}
//撤销启用

export function noEnable(id) {
  return request({
    url:`/api/product-service/sku/${id}/cancel-available`,
    method:'put',
    exception:true
  })
}
//撤销禁用

export function noProhibit(id) {
  return request({
    url:`/api/product-service/sku/${id}/cancel-forbidden`,
    method:'put',
    exception:true
  })
}

//下柜
export function cabinet(id) {
  return request({
    url:`/api/product-service/sku/${id}/pending-website-available`,
    method:'post',
    exception:true
  })
}

//提审

export function Arraign(id) {
  return request({
    url:`/api/product-service/sku/${id}/submit-review`,
    method:'put',
  })
}

//上柜

export function upperCabinet(id) {
  return request({
    url: `/api/product-service/sku/${id}/website-available`,
    method: 'put',
    exception:true
  })
}

//获取以省为第一级的3级树结构

export function getRegionTree(id) {
  return request({
    url: '/api/location-service/region/region-threeleveltree-startwith-province',
    method: 'get',
  })
}
//获取商品非销售区域

export function getGoodsNoArea(sku) {
  return request({
    url: `/api/product-service/sku/${sku}/non-sales-area`,
    method: 'get',
  })
}

//设置商品非销售区域

export function setGoodsNoArea(sku,data) {
  return request({
    url: `/api/product-service/sku/${sku}/non-sales-area`,
    method: 'put',
    data:data
  })
}
//获取商品详情

export function getGoodsDetail(id) {
  return request({
    url: `/api/product-service/sku/${id}/detail`,
    method: 'get',
  })
}

//获取商品开票信息


export function getGoodsInvoice(id) {
  return request({
    url: `/api/product-service/sku/${id}/invoice`,
    method: 'get',
  })
}

//设置商品开票信息

export function setGoodsInvoice(id,data) {
  return request({
    url: `/api/product-service/sku/${id}/invoice`,
    method: 'put',
    data:data
  })
}

// 获取最后常用的商品分类

export function getGoodsClassify(id,data) {
  return request({
    url: `/api/product-service/sku/${id}/invoice`,
    method: 'put',
    data:data
  })
}

//商品审核通过

export function recordGoodsPass(id) {
  return request({
    url: `/api/product-service/sku/${id}/review-pass`,
    method: 'put',
  })
}
//商品审核失败

export function recordGoodsNoPass(id,data) {
  return request({
    url: `/api/product-service/sku/${id}/review-reject`,
    method: 'put',
    data:data
  })
}

//跳转编辑前校验是否跳转

export function checkEditerGoodsId(id) {
  return request({
    url: `/api/product-service/sku/${id}/check`,
    method: 'get',
  })
}

//设置价格

export function setGoodsPrice(id,purchasePrice,websitePrice) {
  return request({
    url: `/api/product-service/sku/${id}/${purchasePrice}/${websitePrice}/set-sku-price`,
    method: 'post',
  })
}

//改售价

export function editerGoodsPrice(id,data) {
  return request({
    url: `/api/product-service/sku/${id}/check-sku-project`,
    method: 'put',
    data:data
  })
}

//改官网价

export function editerOfficialPrice(id,websitePrice) {
  return request({
    url: `/api/product-service/sku/${id}/${websitePrice}/check-sku-websiteprice`,
    method: 'post',
  })
}

//商品批量导入记录

export function goodsImportRecode(data) {
  return request({
    url: `/api/product-service/sku/import-sku-log`,
    method: 'post',
    data:data
  })
}


/////////单位///////

//查询单位记录
export function getUnit(data) {
  return request({
    url: `/api/product-service/unit/list`,
    method: 'post',
    data:data
  })
}

//模糊搜索单位

export function getUnitRemote(data) {
  return request({
    url: `/api/product-service/unit/name-list`,
    method: 'post',
    data:data
  })
}

//////////用户////////////

//根据用户名，查询简单用户对象（包括id、userName、realName）

export  function getUsername(data) {
  return request({
    url:`/api/user-service/user/simple/list`,
    method:'post',
    data:data
  })
}
//根据组织机构id 查询当前组织机构下的对应账号的人员
export  function getUsernameByOrganization(organizationId,userName) {
  return request({
    url:`/api/user-service/user/${organizationId}/${userName}/organization/user`,
    method:'get',
  })
}

//根据机构名称,获取组织结构Id

export  function getIdByOrganizationName(name) {
  return request({
    url:`/api/user-service/organization/id`,
    method:'post',
    data:name
  })
}


/*商品迁移的接口    */
//校验商品迁移模板对应信息

export function transferGoodsInfo(data) {
  return request({
    url: `/api/product-service/sku/check-migrated-templates`,
    method: 'post',
    data:data,
  })
}
//获取要迁移的商品分类信息，如果不止一个分类则报错

export function getTransferInfo(data) {
  return request({
    url: `/api/product-service/sku/migrated-category`,
    method: 'post',
    data:data,
  })
}
//获取迁移模板数据

export function getTransferData(sourceCategoryId,destinationCategoryId) {
  return request({
    url: `/api/product-service/categoryattributetemplate/migration/${sourceCategoryId}/${destinationCategoryId}`,
    method: 'get',
  })
}

///根据迁移模板修改商品信息

export function editerTransferData(data) {
  return request({
    url: `/api/product-service/sku/update-migrated-skus`,
    method: 'put',
    data:data
  })
}



//品牌名称的模糊搜索

export function remoteBrandName(data) {
  return request({
    url:'/api/product-service/brand/brand-authorization-list',
    method:'post',
    data:data,
  })
}

//品牌名称的模糊搜索
export function remoteBrandGoodsName(data) {
  return request({
    url:'/api/product-service/brand/category-brand-name-list',
    method:'post',
    data:data,
  })
}

///////////////////////////分类关联关系下拉框////////////////
//分类关联关系下拉框

export function getClassifyRemote(data) {
  return request({
    url:`/api/product-service/category/join-select`,
    method:'post',
    data:data
  })
}



////税收分类接口
///根据Id 获取税收分类编码信息

export function getTaxCode(id) {
  return request({
    url:`/api/product-service/taxcode/${id}`,
    method:'get',
  })
}

///模糊搜索TaxCode

export function findTaxCode(condition) {
  return request({
    url:`/api/product-service/taxcode/${condition}/search`,
    method:'get',
  })
}


//分类下拉级联搜索接口
export function findClassify(level,parentId,name) {
  return request({
    url:`/api/product-service/category/${level}/${parentId}/${name}/find-select-search-list`,
    method:'get',
  })
}


//获取编辑商品状态 状态（0：草稿；1：待审核；2：已驳回；3：待启用）

export function getGoodsCheck(id) {
  return request({
    url:`/api/product-service/sku/${id}/edit-status`,
    method:'get',
  })
}

//根据id查询文件路径

export function getFileinfo(id) {
  return request({
    url:`/api/file-service/file/${id}`,
    method:'get',
  })
}
///////////新老系统数据同步


//根据旧系统id查名称

export function getNameByOldId(oldSkuId) {
  return request({
    url:`/api/mapping-service/sku-relation-manage/${oldSkuId}/name`,
    method:'get',
  })
}


//根据机构名称进行模糊检索，返回符合条件集合，用于下拉框模糊匹配
export function selectOrganization(data) {
  return request ({
    url: '/api/user-service/organization/list/name',
    method: 'post',
    data: data,
  })
}



