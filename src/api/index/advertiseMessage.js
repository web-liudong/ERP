import request from '@/utils/request'
import api from '../index'
//根绝项目id 和 输入内容 查询客户列表 用作下拉框
export function customerNameList(data) {
  return request({
    url: api+'/customer-service/customer/name-list',
    method: 'post',
    data:data
  })
}
