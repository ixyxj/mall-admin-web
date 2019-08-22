import request from '@/utils/request'
export function fetchList(pid,params) {
  return request({
    url:'/sku/'+pid,
    method:'get',
    params:params
  })
}

export function update(data) {
  return request({
    url:'/product/store/updateProductStore',
    method:'post',
    data:data[0]
  })
}
