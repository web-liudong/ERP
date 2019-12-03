import request from '@/utils/request'
export function reporeDetail(id) {
    return request({
      url: `/api/bidding-service/repore-prepared/${id}/detail`,
      method: 'get',
      
    })
  }
  export function reporeEditEcho(id) {
    return request({
      url: `/api/bidding-service/repore-prepared/${id}/info`,
      method: 'get',
      
    })
  }

 export function reporeAdd(data) {
    return request({
      url: `/api/bidding-service/repore-prepared/`,
      method: 'post',
      data:data
    })
  }
  export function statusCount() {
    return request({
      url: `/api/bidding-service/repore-prepared/status-statistic`,
      method: 'get',
    })
  }
  export function statusNoMatch(data) {
    return request({
      url: `/api/bidding-service/repore-prepared/mine-list-no-match`,
      method: 'post',
      data:data
    })
  }
  export function statusMatchError(data) {
    return request({
      url: `/api/bidding-service/repore-prepared/mine-list-match-err`,
      method: 'post',
      data:data
    })
  }
  export function statusAlMatch(data) {
    return request({
      url: `/api/bidding-service/repore-prepared/mine-list-already-match`,
      method: 'post',
      data:data
    })
  }
  export function statusDelete(data) {
    return request({
      url: `/api/bidding-service/repore-prepared/mine-list-delete`,
      method: 'post',
      data:data
    })
  }
  export function reporeEdit(id,data) {
    return request({
      url: `/api/bidding-service/repore-prepared/${id}`,
      method: 'put',
      data:data
    })
  }
  
export function reporeDelete(id) {
    return request({
      url: `/api/bidding-service/repore-prepared/${id}`,
      method: 'delete',
    })
  }