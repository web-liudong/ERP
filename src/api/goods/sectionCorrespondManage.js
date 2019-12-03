////2019/11/1 jiang 部门数据对应管理

import request from '@/utils/request'


//查询旧系统部门名

export function getNameByOldId(oldDepartmentId) {
    return request({
      url:`/api/mapping-service/department-mapping/${oldDepartmentId}/name`,
      method:'get',
    })
  }
  
//查询新系统部门信息

export function searchProjectInfo(newDepartmentId) {
    return request({
      url:`/api/mapping-service/department-mapping/erp/${newDepartmentId}/info`,
      method:'get',
    })
  }

//新建部门对应

export function CreateProjectCorrespond(newDepartmentId,data) {
    return request({
      url:`/api/mapping-service/department-mapping/relation/${newDepartmentId}/create`,
      method:'post',
      data:data
    })
  } 


///通过关联明细id查询关联旧部门信息详情


export function findProjectCorrespondDetail(relationId) {
    return request({
      url:`/api/mapping-service/department-mapping/relation/${relationId}`,
      method:'get',
    })
  }

//通过关联明细删除关联旧部门信息

export function deleteProjectCorrespond(relationId) {
    return request({
      url:`/api/mapping-service/department-mapping/relation/${relationId}`,
      method:'delete',
    })
  }

//分页查询关联部门列表


export function findProjectCorrespondList(data) {
    return request({
      url:`/api/mapping-service/department-mapping/relation/list`,
      method:'post',
      data:data
    })
  }

//导出关联关系

export function exportProjectCorrespond(data) {
    return request({
      url:`/api/mapping-service/department-mapping/relation/list/export`,
      method:'post',
      data:data
    })
  }

///新旧部门关联关系状态统计

export function getStatus() {
    return request({
      url:`/api/mapping-service/department-mapping/status-count`,
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
