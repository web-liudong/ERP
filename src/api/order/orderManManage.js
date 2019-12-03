import request from '@/utils/request'

// 返回可用区域
export function AvailableArea() {
  return request({
    url: '/api/order-service/order/assign/other-region',
    method:'get'
  })
}


// 返回所有省级id
export function shengAreaid() {
  return request({
    url: '/api/location-service/region/provinces-based-id',
    method:'get'
  })
}

// 返回省的下一集id
export function Areaid(id) {
  return request({
    url: '/api/location-service/region/'+id+'/subs',
    method:'get'
  })
}





// 返回可用区域2
export function AvailableArea2(data) {
  return request({
    url: '/api/order-service/order/assign/other-region',
    method:'get',
    params:data
  })
}
// 派单员配置
export function PieceConfiguration(data) {
  return request({
    url: '/api/order-service/order/assign',
    method:'post',
    data:data
  })
}
// 查看派单员配置详情
export function SenderConfigurationDetails(id) {
  return request({
    url: '/api/order-service/order/assign/'+id,
    method:'get'
  })
}
// 编辑派单员配置
export function EditDispatcherConfiguration(id,data) {
  return request({
    url: '/api/order-service/order/assign/'+id,
    method:'put',
    data:data
  })
}
// 删除派单员配置
export function RemoveTheDispatcherConfiguration(id) {
  return request({
    url: '/api/order-service/order/assign/'+id,
    method:'delete'
  })
}
// 派单员配置列表
export function ListOfDispatchers(data) {
  return request({
    url: '/api/order-service/order/assign/list',
    method:'post',
    data:data
  })
}


// 获取所属组织结构
export function getUserCollege() {
  return request({
    url: '/api/user-service/user/getUserInfo',
    method:'get'
  })
}

// 获取所属组织结构下的人员
export function getUserCollegeMan(data) {
  return request({
    url: '/api/user-service/user/organization/user-list',
    method:'post',
    data:data
  })
}


// 获取派单员操作记录
export function getUserRecord(id) {
  return request({
    url: '/api/order-service/order/assign/'+id+'/log',
    method:'post'
  })
}