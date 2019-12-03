////2019/10/23 jiang 项目数据对应管理

import request from '@/utils/request'


//查询旧系统项目名

export function getNameByOldId(oldProjectType,oldProjectId) {
    return request({
      url:`/api/mapping-service/project-mapping/${oldProjectType}/${oldProjectId}/name`,
      method:'get',
    })
  }
  
//查询新系统项目信息

export function searchProjectInfo(newProjectNo) {
    return request({
      url:`/api/mapping-service/project-mapping/erp/${newProjectNo}/info`,
      method:'get',
    })
  }

//新建项目对应

export function CreateProjectCorrespond(newProjectId,data) {
    return request({
      url:`/api/mapping-service/project-mapping/relation/${newProjectId}/create`,
      method:'post',
      data:data
    })
  } 


///通过关联明细id查询关联旧项目信息详情


export function findProjectCorrespondDetail(relationId) {
    return request({
      url:`/api/mapping-service/project-mapping/relation/${relationId}`,
      method:'get',
    })
  }

//通过关联明细删除关联旧项目信息

export function deleteProjectCorrespond(relationId) {
    return request({
      url:`/api/mapping-service/project-mapping/relation/${relationId}`,
      method:'delete',
    })
  }

//分页查询关联项目列表


export function findProjectCorrespondList(data) {
    return request({
      url:`/api/mapping-service/project-mapping/relation/list`,
      method:'post',
      data:data
    })
  }

//导出关联关系

export function exportProjectCorrespond(data) {
    return request({
      url:`/api/mapping-service/project-mapping/relation/list/export`,
      method:'post',
      data:data
    })
  }

///新旧项目关联关系状态统计

export function getStatus() {
    return request({
      url:`/api/mapping-service/project-mapping/status-count`,
      method:'get',
    })
  }

//项目名称的模糊搜索
  export function nameList(data) {
    return request({
      url: '/api/customer-service/project/name-list',
      method: 'post',
      data:data
    })
  }
  