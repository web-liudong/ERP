import request from '@/utils/request'
import api from '../index'
//仓库服务api
//后端：陈明亮
//http://47.94.238.148:8089/swagger-ui.html#/%E8%99%9A%E6%8B%9F%E4%BB%93%E5%BA%93API

//查找虚拟仓库的SKU详情
export function postInventoryList(data) {
  return request({
    url: api + '/warehouse-service/inventory/list',
    method: 'post',
    data:data,
  })
}
