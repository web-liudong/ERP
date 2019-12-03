import request from '@/utils/request'
let Host = '/api'

//专柜项目管理列表
export function getDataList(data) {
  return request({
    url: Host+'/shoppe-release-service/shopperelease/shoppe/list',
    method:'post',
    //unloading:true,
    data:data,
  })
}

//专柜项目详情
export function getShoppeDetail(id) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}`,
    method:'get',
  })
}

//编辑专柜项目的导航类型
export function editNavType(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/navigation-type`,
    method:'put',
    data:data,
  })
}

//专柜商品管理列表
export function getShoppeSkuList(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppe-sku-list`,
    method:'post',
    data:data,
  })
}

//专柜商品上下架
export function shoppeGoodsShelve(id, skuId, shelve, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${skuId}/${shelve}`,
    method:'post',
    data:data,
  })
}

//批量专柜商品上下架
export function shoppeGoodsShelveBetch(id, shelve, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${shelve}`,
    method:'post',
    data:data,
  })
}

//设置售价
export function setGoodsPrice(id, skuId, price) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${skuId}/projectPrice/${price}`,
    method:'put'
  })
}

//商品标签操作
export function opaGoodsTag(id, skuId, method, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${skuId}/tags`,
    method:method,
    data:data
  })
}

//删除专柜商品
export function delShoppeGoods(id, skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${skuId}`,
    method:"delete"
  })
}
//批量删除专柜商品
export function delShoppeGoodsBetch(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku`,
    method:"delete",
    data:data
  })
}

//获取专柜单个商品操作日志
export function getGoodsLog(id,skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${skuId}/operation-log`,
    method: 'get'
  })
}

//获取专柜全部商品操作日志
export function getShoppeOpaLog(id,skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/operation-log`,
    method: 'post'
  })
}

//专柜发布操作
export function opaShoopeRelease(id, method, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/release`,
    method:method,
    data:data
  })
}

//专柜发布记录
export function getShoopeReleaseLog(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/release-log`,
    method:'get',
    //params:data
  })
}

//专柜已发布历史更新内容
export function getHistoryReleaseLog(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/shoppesku/release-history/${id}`,
    method:'get',
    //params:data
  })
}

//专柜添加商品管理列表
export function getShoppePubSkuList(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/published-sku-list`,
    method:'post',
    data:data,
  })
}

//专柜导航添加商品管理列表
export function getNavAddSkuList(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/navigation/${id}/shoppe-sku-list`,
    method:'post',
    data:data,
  })
}

//添加单个商品到列表
export function addSkuToShoppe(id, skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${skuId}`,
    method:'post',
  })
}

//添加单个商品关联到导航
export function addSkuToNav(id, skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigationsku/${skuId}`,
    method:'post',
  })
}

//批量添加商品到列表
export function addSkuToShoppeBetch(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku`,
    method:'post',
    data:data
  })
}

//批量添加商品关联到导航
export function addSkuToNavBetch(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigationsku`,
    method:'post',
    data:data
  })
}

//获取各级导航列表
export function getNavList(id, level, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/${level}-level-list`,
    method: 'post',
    data:data
  })
}

//禁用或启用一级导航
export function editNavUseStatus(id, type) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/${type}`,
    method: 'put'
  })
}

//专柜导航发布操作
export function opaShoopeNavRelease(id, method, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigation-release`,
    method:method,
    data:data
  })
}

//专柜导航详情
export function getNavDetails(id) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}`,
    method:'get'
  })
}

//新建导航初始化
export function addNavInit(id, navId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigation/${navId}/initialization`,
    method:'get'
  })
}

//获取下级导航数据
export function getNextNav(id, navId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigation`,
    method:'get',
    params:{
      id:navId
    }
  })
}

//新建各级导航
export function addNewNav(id, level, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/${level}-level`,
    method:'post',
    data:data
  })
}

//获取编辑导航详情
export function getEditNavInfo(id, level) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/${level}-level/editing-detail`,
    method:'get',
  })
}

//编辑各级导航提交
export function editNavInfo(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}`,
    method:'put',
    data:data
  })
}

//获取关联导航的已上柜列表
export function getNavnSkuList(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/navigation/${id}/navigation-sku-list`,
    method:'post',
    data:data
  })
}

//删除导航关联商品
export function delNavRelationGoods(id, skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigationsku/${skuId}`,
    method:"delete"
  })
}

//置顶导航关联商品
export function setRelationGoodsTop(id, skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigationsku/${skuId}/top`,
    method:"put"
  })
}

//获取专柜分类限价
export function getlimitedprice(id) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/limited-price`,
    method:'get'
  })
}

//获取专柜分类限价
export function setlimitedprice(id,rate,data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/limited-price`,
    method:"post",
    data:data,
    params:{
      discountRate:rate
    }
  })
}

//导航名称模糊查询
export function queryNavList(data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/name-list`,
    method:"post",
    data:data
  })
}

//导出
export function exportSkuList(id,data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/export`,
    method:"post",
    data:data
  })
}

//查询商品所属导航
export function queryNavForSku(id, skuId) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/${skuId}/navigation-list`,
    method:"get"
  })
}

//获取专柜发布数量
export function getReleaseCount(id) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/shoppesku/release-count`,
    method:"get"
  })
}

//获取专柜发布数量
export function getNavReleaseCount(id) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/navigation-release-count`,
    method:"get"
  })
}

//获取一级导航信息
export function getNavTitle(id, type, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/navigation/${id}/${type}-navigation-title`,
    method:"post",
    data:data
  })
}

//获取协同运营者
export function getCollaborationors(id) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/find-collaborationors`,
    method:"get"
  })
}

//添加协同运营者
export function saveCollaborationors(id, data) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/create-collaborationor`,
    method:"post",
    data:data
  })
}

//获取协同运营者
export function getCheckData(id) {
  return request({
    url: Host+`/shoppe-release-service/shopperelease/shoppe/${id}/check-data`,
    method:"get"
  })
}