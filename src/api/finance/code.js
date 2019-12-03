import request from '@/utils/request'
import api from '../index'

//税收分类编码API
//后端：杨兴国
//http://47.94.238.148:8088/swagger-ui.html#/%E7%A8%8E%E6%94%B6%E5%88%86%E7%B1%BB%E7%BC%96%E7%A0%81API
export function getCodeInfo(id) {                //根据id获取税收编码信息
  return request({
    url: api + '/product-service/taxcode/' + id,
    method: 'get',
  })
}

export function deleteCodeDelete(id) {                //删除税收编码
  return request({
    url: api + '/product-service/taxcode/'+ id+ '/',
    method: 'delete',
  })
}
export function postCodeCreate(data) {                  //创建税收编码
  return request({
    url: api + '/product-service/taxcode/',
    method: 'post',
    data: data,
    type:"json",
  })
}

export function postCodeImport(data) {                  //导入税收编码
  return request({
    url: api + '/product-service/taxcode/import/',
    method: 'post',
    data: data,
  })
}

export function postCodeList(data) {                  //导入税收编码
  return request({
    url: api + '/product-service/taxcode/list/',
    method: 'post',
    data: data,
  })
}

export function postCodeLogList(data) {                  //导入税收编码
  return request({
    url: api + '/product-service/taxcode/import-file-log-list',
    method: 'post',
    data: data,
  })
}
export function putCodeUpdate(id,data) {            //更新税收编码
  return request({
    url: api + '/product-service/taxcode/'+ id+ '/',
    method: 'put',
    data: data,
  })
}

