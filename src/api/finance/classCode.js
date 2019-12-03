import request from '@/utils/request'
import api from '../index'

//分类API
//后端：杨兴国
//http://47.94.238.148:8088/swagger-ui.html#/%E5%88%86%E7%B1%BBAPI






export function postConfirmCode(id,codeid) {                  //单个确认税收编码
  return request({
    url: api + '/product-service/category/'+ id +'/'+ codeid +'/confirm-tax-code',
    method: 'post',
    data: '',
  })
}


export function postConfirmSelectCode(data) {                  //批量确认税收编码
  return request({
    url: api + '/product-service/category/confirm-select-tax-code',
    method: 'post',
    data: data,
  })
}

export function postCategoryCodeList(data) {                  //税收编码list
  return request({
    url: api + '/product-service/category/category-tax-code-list',
    method: 'post',
    data: data,
  })
}


export function getTaxcodeSearch(name) {                  //税收分类模糊搜索
  return request({
    url: api + '/product-service/taxcode/'+ name +'/search',
    method: 'get',
  })
}






export function getCodeInfo(id) {                //根据id获取税收编码信息
  return request({
    url: api + '/product-service/taxcode/' + id,
    method: 'get',
  })
}

export function deleteCodeDelete(id) {                //删除税收编码
  return request({
    url: api + '/product-service/taxcode/'+ id +'/delete/',
    method: 'delete',
  })
}
export function postCodeCreate(data) {                  //创建税收编码
  return request({
    url: api + '/product-service/taxcode/create/',
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

export function putCodeUpdate(id,data) {            //更新税收编码
  return request({
    url: api + '/product-service/taxcode/'+ id +'/update/',
    method: 'put',
    data: data,
  })
}

