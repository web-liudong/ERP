import request from '@/utils/request'


//官网一级导航列表
export function firstList(data) {
  return request({
    url:'/api/mainsite-release-service/mainsiterelease/navigation/first-level-list',
    method:'post',
    data:data
  })
}

//新建一级导航
export function addFirst(data) {
  return request({
    url:'/api/mainsite-release-service/mainsiterelease/navigation/first-level',
    method:'post',
    data:data
  })
}

//新建二级导航
export function addSecond(data) {
  return request({
    url:'/api/mainsite-release-service/mainsiterelease/navigation/second-level',
    method:'post',
    data:data
  })
}
//新建三级导航
export function thirdLevel(data) {
  return request({
    url:'/api/mainsite-release-service/mainsiterelease/navigation/third-level',
    method:'post',
    data:data
  })
}

//发布导航更新内容
export function navigationRelease() {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/navigation-release`,
    method:'put'
  })
}

//获取导航发布更新内容
export function getRelease() {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/navigation-release`,
    method:'get'
  })
}

//获取导航发布记录
export function releaseLog(data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/mainsitenavigation-release-log`,
    method:'get',
    params:data
  })
}
//获取一级导航信息
export function firstSelect() {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/first-navigation-list`,
    method:'get'
  })
}

//获取导航下级导航
export function subSelect(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/sub-navigation-list`,
    method:'get',
    params:{
      id:id
    }
  })
}

//获取导航导入记录
export function importfileLog(data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/importfile-log`,
    method:'post',
    data:data
  })
}

//获取导航详情
export function navigationDetail(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}`,
    method:'get',
    params:{
      id:id
    }
  })
}

//获取一级导航编辑详情
export function editingDetail(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/first-level/editing-detail`,
    method:'get'
  })
}


//禁用
export function forbidden(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/forbidden`,
    method:'put',
    data:{
      id:id
    }
  })
}

//启用
export function available(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/available`,
    method:'put',
    data:{
      id:id
    }
  })
}

//二级导航列表
export function secondList(data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/second-level-list`,
    method:'post',
    data:data
  })
}
//三级导航列表
export function thirdList(data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/third-level-list`,
    method:'post',
    data:data
  })
}

//编辑导航
export function editNavigation(id,data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}`,
    method:'put',
    data:data
  })
}

//添加初始信息
export function initialization(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/initialization`,
    method:'get'
  })
}
//二级编辑信息
export function editingDetail2(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/second-level/editing-detail`,
    method:'get'
  })
}

//三级编辑信息
export function editingDetail3(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/third-level/editing-detail`,
    method:'get'
  })
}

//官网商品管理
export function websiteList(data) {
  return request({
    url:`/api/product-service/mainsite-sku/website-available-list`,
    method:'post',
    data:data
  })
}
//根据名称模糊查询sku列表
export function nameList(data) {
  return request({
    url:`/api/product-service/sku/avaliable-name-like-list`,
    method:'post',
    data:data
  })
}

//根据品牌名称模糊查询品牌列表
export function brandList(data) {
  return request({
    url:`/api/product-service/brand/brand-authorization-list`,
    method:'post',
    data:data
  })
}

//导航下关联商品管理
export function skuList(navigationId,data) {
  return request({
    url:`/api/product-service/mainsite-sku/navigation/${navigationId}/sku-list`,
    method:'post',
    data:data
  })
}

//添加商品到导航的商品列表
export function forAddition(data) {
  return request({
    url:`/api/product-service/mainsite-sku/website-available-list/for-addition`,
    method:'post',
    data:data
  })
}

//添加商品到楼层推荐导航的商品列表
export function forAdditionFloor(navigationId,data) {
  return request({
    url:`/api/product-service/mainsite-sku/navigation/${navigationId}/sku-list/for-addition`,
    method:'post',
    data:data
  })
}

//官网商品导出
export function websiteExport(data) {
  return request({
    url:`/api/product-service/mainsite-sku/website-list-export`,
    method:'post',
    data:data
  })
}

//关联单个商品到导航
export function navigationsku(id,skuId,data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/navigationsku/${skuId}`,
    method:'post',
    data:data
  })
}

//关联批量商品到导航
export function navigationskus(id,data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/navigationsku`,
    method:'post',
    data:data
  })
}

//删除导航关联商品
export function deletesku(id,skuId) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/navigationsku/${skuId}`,
    method:'delete'
  })
}

//置顶商品到导航
export function topsku(id,skuId) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/navigationsku/${skuId}/top`,
    method:'put'
  })
}

//获取三级导航名称模糊信息
export function list3(data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/third-navigationinfo-list`,
    method:'post',
    data:data
  })
}

//获取二级导航名称模糊信息
export function list2(data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/second-navigationinfo-list`,
    method:'post',
    data:data
  })
}

//获取一级导航名称模糊信息
export function list1(data) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/first-navigationinfo-list`,
    method:'post',
    data:data
  })
}

//获取导航发布数量
export function releaseCount() {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/mainsitenavigation-release-count`,
    method:'get',
  })
}

//获取导航历史发布更新内容
export function releaseHistory(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/release-history/${id}`,
    method:'get'
  })
}

//导航下关联商品管理
export function skuListExport(id,data) {
  return request({
    url:`/api/product-service/mainsite-sku/navigation/${id}/skuList-export`,
    method:'post',
    data:data,
    responseType: 'blob'
  })
}

//根据id查导航名称
export function getParentName(id) {
  return request({
    url:`/api/mainsite-release-service/mainsiterelease/navigation/${id}/getParentNameById`,
    method:'get',
  })
}






































