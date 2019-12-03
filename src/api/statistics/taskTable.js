import request from '@/utils/request'
// let Host = 'http://localhost:3000/api'
let Host = '/api'


// 列表查询
export function getDataList(data) {
  return request({
    url: Host + `/statistics-service/statistics/list`,
    method: 'post',
    data: data,
  })
}

//删除
export function deleteData(id) {
  return request({
    url: Host + `/statistics-service/statistics/${id}`,
    method: 'delete',
  })
}





