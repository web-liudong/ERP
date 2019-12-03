import request from '@/utils/request'

//获取文件
export  function getFile(id) {
  return request({
    url:`/api/file-service/file/${id}`,
    method:'get',
  })
}
//上传文件

export  function updateFile(id,data) {
  return request({
    url:`/api/file-service/file/${id}`,
    method:'put',
    data:data
  })
}

//下载文件

export  function downloadFile(id) {
  return request({
    url:`/api/file-service/file/downloadFile`,
    method:'get',
    params:{
      id
    }
  })
}
//获取文件列表

export  function findFileList(id) {
  return request({
    url:`/api/file-service/file/downloadFile`,
    method:'get',
    params:{
      id
    }
  })
}


