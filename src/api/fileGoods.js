import request from '@/utils/request'

//下载文件某个类型的最新文件
export  function downloadFile(type) {
  return request({
    url:`/api/file-service/file/download/${type}/latest`,
    method:'get',
  })
}




