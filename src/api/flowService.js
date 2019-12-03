import request from '@/utils/request'


//查询审批流概要信息（如果没有，则初始化一个概要信息）
export function generalget(id) {
  return request({
    url: `/api/customer-service/customer-flow/general/${id}`,
    method: 'get',
  })
}

//添加流程（初始化工作流组信息和一个空的默认审批流）
export function addgroup(data) {
  return request({
    url: `/api/customer-service/customer-flow/group`,
    method: 'post',
    data:data
  })
}
//客户组织架构
export function customerOrganization(id) {
  return request({
    url: `/api/customer-service/customer/${id}/own-customer-organization`,
    method: 'get',
  })
}

//客户组织架构
export function customerOrganization2(id) {
  return request({
    url: `/api/customer-service/customer/${id}/sup-customer-organization`,
    method: 'get',
  })
}

//角色组织架构
export function roleOrganization(id) {
  return request({
    url: `/api/customer-service/customer/${id}/sup-customer-role-organization`,
    method: 'get',
  })
}

//保存流程组发起人
export function saveoriginator(id,data) {
  return request({
    url: `/api/customer-service/customer-flow/group/originator/${id}`,
    method: 'post',
    data:data
  })
}

//添加流程任务节点
export function saveflowtask(data) {
  return request({
    url: `/api/customer-service/customer-flow/flow/task`,
    method: 'post',
    data:data
  })
}
//查询审批流程组详情列表
export function groupList(data) {
  return request({
    url: `/api/customer-service/customer-flow/group/list`,
    method: 'post',
    data:data
  })
}
//添加条件审批流
export function addcondition(data){
  return request({
    url: `/api/customer-service/customer-flow/flow`,
    method: 'post',
    data:data
  })
}

//删除审批流组信息(同时删除其下边的各详细信息)
export function groupdelete(id){
  return request({
    url: `/api/customer-service/customer-flow/group/${id}`,
    method: 'DELETE',
  })
}

//删除审批流组信息(同时删除其下边的各详细信息)
export function conditionFix(data){
  return request({
    url: `/api/customer-service/customer-flow/flow/condition`,
    method: 'put',
    data:data
  })
}

//删除条件审批流
export function flowdelete(id){
  return request({
    url: `/api/customer-service/customer-flow/flow/${id}`,
    method: 'delete',
  })
}

//下移
export function flowdown(id,data){
  return request({
    url: `/api/customer-service/customer-flow/flow/down/${id}`,
    method: 'put',
    data:data
  })
}

//上移
export function flowup(id,data){
  return request({
    url: `/api/customer-service/customer-flow/flow/up/${id}`,
    method: 'put',
    data:data
  })
}

//上移
export function changeName(id,data){
  return request({
    url: `/api/customer-service/customer-flow/flow/${id}/change-name`,
    method: 'put',
    data:data
  })
}

//删除流程任务节点
export function taskDelete(id){
  return request({
    url: `/api/customer-service/customer-flow/flow/task/${id}`,
    method: 'delete',
  })
}

//修改审批流组名称
export function changeNameGroup(id,data){
  return request({
    url: `/api/customer-service/customer-flow/group/${id}/change-name`,
    method: 'put',
    data:data
  })
}

//获取流程任务节点详情
export function getdetail(id){
  return request({
    url: `/api/customer-service/customer-flow/flow/task/${id}`,
    method: 'get'
  })
}

//修改流程任务节点
export function changeTask(id,data){
  return request({
    url: `/api/customer-service/customer-flow/flow/task/${id}`,
    method: 'put',
    data:data
  })
}
//发布
export function deploy(groupId){
  return request({
    url: `/api/customer-service/customer-flow/group/${groupId}/deploy`,
    method: 'put',
    data:{
      groupId:groupId
    }
  })
}
