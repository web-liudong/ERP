import request from '@/utils/request'


//楼层列表
export function floorList(data) {
  return request({
    url:'/api/mainsite-release-service/mainsiterelease/floor/list',
    method:'post',
    data:data
  })
}

//添加楼层
export function addFloor(data) {
  return request({
    url:'/api/mainsite-release-service/mainsiterelease/floor/',
    method:'post',
    data:data
  })
}

//推荐导航列表
export function navigationList(id,data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/navigation-list`,
    method:'post',
    data:data
  })
}

//添加楼层推荐导航
export function addnavigation(floorid,navid) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${floorid}/navigation/${navid}`,
    method:'post',
    data:{
      id:floorid,
      mainsiteNavigationId:navid
    }
  })
}

//楼层下推荐导航的推荐商品
export function skuList2(floorid,navid,data) {
  return request({
    url:`/api/product-service/mainsite-sku/floor/${floorid}/navigation/${navid}/sku-list`,
    method:'post',
    data:data
  })
}

//楼层推荐导航添加单个商品
export function addSkuFloor(floorid,navid,skuId) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${floorid}/navigation/${navid}/sku/${skuId}`,
    method:'post'
  })
}

//楼层推荐导航批量添加商品
export function addSkusFloor(id,mainsiteNavigationId,data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/navigation/${mainsiteNavigationId}/skus`,
    method:'post',
    data:data
  })
}

//获取楼层发布更新内容
export function floorRelease(){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/mainsitefloor-release`,
    method:'get'
  })
}

//发布楼层更新内容
export function release(){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/mainsitefloor-release`,
    method:'put'
  })
}

//获取楼层发布记录
export function releaseLog(){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/mainsitefloor-release-log`,
    method:'get'
  })
}

//获取楼层历史发布更新内容
export function releaseHistory(id){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/release-history/${id}`,
    method:'get'
  })
}

//禁用楼层
export function forbiddenfloor(id){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/forbidden`,
    method:'put'
  })
}

//楼层编辑详情
export function editingDetail(id){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/editing-detail`,
    method:'get'
  })
}

//编辑楼层
export function changeFloor(id,data){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}`,
    method:'put',
    data:data
  })
}

//楼层详情
export function floordetail(id){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}`,
    method:'get'
  })
}

//置顶楼层推荐导航
export function floorTop(id,mainsiteNavigationId){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/navigation/${mainsiteNavigationId}`,
    method:'put'
  })
}

//删除楼层推荐导航
export function navigationdel(id,mainsiteNavigationId){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/navigation/${mainsiteNavigationId}`,
    method:'DELETE'
  })
}

//删除楼层推荐导航关联商品
export function skudel(id,mainsiteNavigationId,skuId){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/navigation/${mainsiteNavigationId}/sku/${skuId}`,
    method:'DELETE'
  })
}

//置顶楼层推荐导航关联商品
export function skuTop(id,mainsiteNavigationId,skuId){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/navigation/${mainsiteNavigationId}/sku/${skuId}`,
    method:'put'
  })
}

//获取楼层发布更新内容数量
export function getCount(){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/mainsitefloor-release-count`,
    method:'get'
  })
}

//推荐品牌列表
export function brandList1(id,data){
  return request({
    url:`/api/product-service/mainsite-brand/${id}/brand-list`,
    method:'post',
    data:data
  })
}

//添加楼层推荐品牌
export function AddBrand(id,brandId){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/brand/${brandId}`,
    method:'post'
  })
}

//删除楼层推荐品牌
export function deleteBrand(id,brandId){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/brand/${brandId}`,
    method:'DELETE'
  })
}

//置顶楼层推荐品牌
export function topBrand(id,brandId){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/brand/${brandId}`,
    method:'put'
  })
}

//启用楼层
export function available(id){
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/floor/${id}/available`,
    method:'put'
  })
}







































