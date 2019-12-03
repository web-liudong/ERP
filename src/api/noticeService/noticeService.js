import request from '@/utils/request'
import api from '../index'
//撤回
export function withdraw(id) {
  return request({
    url: api+'/notice-service/notice/'+id,
    method: 'put',
  })
}
//删除
export function deleteId(id) {
  return request({
    url: api+'/notice-service/notice/'+id,
    method: 'delete',
  })
}
//公告详细预览
export function noticeDetail(id) {
  return request({
    url: api+'/notice-service/notice/'+id+'/detail',
    method: 'get',
  })
}
//推送
export function noticePush(data,id) {
  return request({
    url: api+'/notice-service/notice/'+id+'/manual-push',
    method: 'post',
    data:data
  })
}

//编辑公告信息并保存
export function updateAndPush(data,id) {
  return request({
    url: api+'/notice-service/notice/'+id+'/push',
    method: 'put',
    data:data
  })
}
//编辑公告信息至草稿
export function updateToDraft(data,id) {
  return request({
    url: api+'/notice-service/notice/'+id+'/draft',
    method: 'put',
    data:data
  })
}
//创建公告信息并推送
export function createAndPush(data) {
  return request({
    url: api+'/notice-service/notice/push',
    method: 'post',
    data:data
  })
}

//创建公告信息至草稿
export function createToDraft(data) {
  return request({
    url: api+'/notice-service/notice/draft',
    method: 'post',
    data:data
  })
}
 
//查询公告消息列表
export function allList(data) {
  return request({
    url: api+'/notice-service/notice/all-list',
    method: 'post',
    data:data
  })
}

//首页公告消息列表
export function pushList(data) {
  return request({
    url: api+'/notice-service/notice/push-list',
    method: 'post',
    data:data
  })
}
//已读
export function readId(id) {
  return request({
    url: api+'/notice-service/notice/read/'+id,
    method: 'put',
  })
}
//获取组织机构树结构
export function allInfoTree() {
  return request({
    url: api+'/user-service/organization/all-info-tree',
    method: 'get',
  })
}
