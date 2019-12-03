////2019/11/5 jiang 用户采购人数据对应管理

import request from '@/utils/request'


//查询旧系统用户名

export function getNameByOldId(oldUserId) {
    return request({
      url:`/api/mapping-service/user-mapping/${oldUserId}/name`,
      method:'get',
    })
  }
  
//查询新系统用户信息

export function searchProjectInfo(newUserId) {
    return request({
      url:`/api/mapping-service/user-mapping/erp/${newUserId}/info`,
      method:'get',
    })
  }

//新建客户采购人对应

export function CreateProjectCorrespond(newUserId,data) {
    return request({
      url:`/api/mapping-service/user-mapping/relation/${newUserId}/create`,
      method:'post',
      data:data
    })
  } 


///通过关联明细id查询关联旧用户信息详情


export function findProjectCorrespondDetail(relationId) {
    return request({
      url:`/api/mapping-service/user-mapping/relation/${relationId}`,
      method:'get',
    })
  }

//通过关联明细删除关联旧用户信息

export function deleteProjectCorrespond(relationId) {
    return request({
      url:`/api/mapping-service/user-mapping/relation/${relationId}`,
      method:'delete',
    })
  }

//分页查询关联用户列表


export function findProjectCorrespondList(data) {
    return request({
      url:`/api/mapping-service/user-mapping/relation/list`,
      method:'post',
      data:data
    })
  }

//导出关联关系

export function exportProjectCorrespond(data) {
    return request({
      url:`/api/mapping-service/user-mapping/relation/list/export`,
      method:'post',
      data:data
    })
  }

///新旧用户关联关系状态统计

export function getStatus() {
    return request({
      url:`/api/mapping-service/user-mapping/status-count`,
      method:'get',
    })
  }

///客户部门列表

export function getSectionList(customerId,data) {
  return request({
    url:`/api/user-service/customer-department/name/list/${customerId}`,
    method:'post',
    data:data
  })
}



  ///客户名称的模糊搜索

  export function getCustomList(name) {
    return request({
      url:`/api/customer-service/customer/${name}/customer-name`,
      method:'get',
    })
  }


