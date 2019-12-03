import request from '@/utils/request'


//查询旧系统客户名

export function getNameByOldId(oldCustomerType,oldCustomerId) {
    return request({
      url:`/api/mapping-service/customer-mapping/${oldCustomerType}/${oldCustomerId}/name`,
      method:'get',
    })
  }
//查询新系统客户信息

export function searchCustomInfo(newCustomerNo) {
    return request({
      url:`/api/mapping-service/customer-mapping/erp/${newCustomerNo}/info`,
      method:'get',
    })
  }

//新建客户对应

export function CreateProjectCorrespond(newCustomerId,data) {
    return request({
      url:`/api/mapping-service/customer-mapping/relation/${newCustomerId}/create`,
      method:'post',
      data:data
    })
  } 


///通过关联明细id查询关联旧客户信息详情


export function findProjectCorrespondDetail(relationId) {
    return request({
      url:`/api/mapping-service/customer-mapping/relation/${relationId}`,
      method:'get',
    })
  }
  //通过关联明细删除关联旧客户信息

export function deleteProjectCorrespond(relationId) {
    return request({
      url:`/api/mapping-service/customer-mapping/relation/${relationId}`,
      method:'delete',
    })
  }

//分页查询关联客户列表


export function findProjectCorrespondList(data) {
    return request({
      url:`/api/mapping-service/customer-mapping/relation/list`,
      method:'post',
      data:data
    })
  }

//导出关联关系

export function exportProjectCorrespond(data) {
    return request({
      url:`/api/mapping-service/customer-mapping/relation/list/export`,
      method:'post',
      data:data
    })
  }
  ///新旧客户关联关系状态统计

export function getStatus() {
    return request({
      url:`/api/mapping-service/customer-mapping/status-count`,
      method:'get',
    })
  }

  ///客户名称的模糊搜索

  export function findCustomList(name) {
    return request({
      url:`/api/customer-service/customer/${name}/customer-name`,
      method:'get',
    })
  }
