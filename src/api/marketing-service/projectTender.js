import request from '@/utils/request'
import api from '../index'

//查询表头信息
export function statusCount(id) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/status-count',
    method: 'get',
  })
}
export function worktaskStatusCount(id) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/worktask/status-count',
    method: 'get',
  })
}
//项目名称模糊搜索
export function listTitle(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/list-title',
    method: 'post',
    data:obj
  })
}
//完成-工作任务
export function workCompletedList(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/worktask/completed-list',
    method: 'post',
    data:obj
  })
}
//进行中-工作任务
export function workProcessingList(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/worktask/processing-list',
    method: 'post',
    data:obj
  })
}
//根据条件查询进行中的投标项目
export function processingList(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/processing-list',
    method: 'post',
    data:obj
  })
}
//根据条件查询完成的投标项目
export function completedList(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/completed-list',
    method: 'post',
    data:obj
  })
}
//根据ID获取投标结果
export function tenderResult(id) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/'+id+'/tender-result',
    method: 'get',
  })
}
//投标项目完成
export function completion(id,obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/'+id+'/completion',
    method: 'put',
    data:obj
  })
}

//根据ID获取投标项目详情
export function getDetail(id) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/'+id+'/detail',
    method: 'get',
  })
}
//项目名称 验重
export function nameRepeatedCheck(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/name-repeated-check',
    method: 'post',
    data:obj
  })
}

//项目名称 验重
export function editNameRepeatedCheck(id,obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/'+id+'/name-repeated-check',
    method: 'post',
    data:obj
  })
}
//
export function listName(obj) {
  return request({
    url: api+'/organization-service/organization/list/name',
    method: 'post',
    data:obj
  })
}
//获取部门树
export function departmentTree(id) {
  return request({
    url: api+'/organization-service/organization/department/department-tree/'+id,
    method: 'get',
  })
}
//获取工作安排默认数据
export function initializationWorktask() {
  return request({
    url: api+'/marketing-service/marketing/tender-project/initialization-worktask',
    method: 'get',
  })
}
//获取招投标项目招标内容默认数据
export function initializationContent() {
  return request({
    url: api+'/marketing-service/marketing/tender-project/initialization-content',
    method: 'get',
  })
}

//添加
export function addTenderProject(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/',
    method: 'post',
    data:obj
  })
}
//编辑
export function editTenderProject(obj,id) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/'+id,
    method: 'put',
    data:obj
  })
}
//根据条件查询完成的工作任务
export function worktaskCompletedList(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/worktask/completed-list',
    method: 'post',
    data:obj
  })
}

//根据条件查询进行中的工作任务

export function worktaskProcessingList(obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/worktask/processing-list',
    method: 'post',
    data:obj
  })
}
//工作任务完成操作
export function workCompletion(id,obj) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/worktask/'+id+'/completion',
    method: 'put',
    data:obj
  })
}

//工作任务完成操作
export function editingDetail(id) {
  return request({
    url: api+'/marketing-service/marketing/tender-project/'+id+'/editing-detail',
    method: 'get',
  })
}