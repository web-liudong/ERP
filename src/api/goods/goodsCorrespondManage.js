import request from '@/utils/request'

//根据旧系统id查名称

export function getNameByOldId(oldSkuId) {
    return request({
      url:`/api/mapping-service/sku-relation-manage/${oldSkuId}/name`,
      method:'get',
    })
  }
  
//查询新系统商品名

export function findNewErpGoods(skuNo) {
    return request({
      url:`/api/mapping-service/sku-relation-manage/erp/${skuNo}/info`,
      method:'get',
    })
  }
  
//导出关联关系  

export function exportCorrespond(data) {
    return request({
      url:`/api/mapping-service/sku-relation-manage/relation/list/export`,
      method:'post',
      data:data,
    })
  }
//通过关联明细id查询关联旧商品信息详情
export function findCorrespondDetail(relationId) {
    return request({
      url:`/api/mapping-service/sku-relation-manage/relation/${relationId}`,
      method:'get',
    })
  }

//分页查询关联商品列表

export function findCorrespondList(data) {
    return request({
      url:`/api/mapping-service/sku-relation-manage/relation/list`,
      method:'post',
      data:data
    })
  }

  //新建商品关联关系

  export function createCorrespondGoods(newSkuId,data) {
    return request({
      url:`/api/mapping-service/sku-relation-manage/relation/${newSkuId}/create`,
      method:'post',
      data:data
    })
  }


//新旧商品关联状态统计


export function getStatus() {
  return request({
    url:`/api/mapping-service/sku-relation-manage/status-count`,
    method:'get',
  })
}
//通过关联明细删除关联旧商品信息
export function deleteGoodsCorrespond(relationId) {
  return request({
    url:`/api/mapping-service/sku-relation-manage/relation/${relationId}`,
    method:'delete',
  })
}




