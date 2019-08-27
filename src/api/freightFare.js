import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/product/selectFeightByPCPage',
    method: 'post',
    data: data
  })
}

export function createFreightFare(data) {
  return request({
    url: '/product/addFeight',
    method: 'post',
    data: data
  })
}

export function updateFreightFare(data) {
  return request({
    url: '/product/updateFeight',
    method: 'post',
    data: data
  })
}

export function updateStatus(status, ids) {
  if (status === 1) return isEnable(ids);
  else return isNotEnable(ids);
}

export function isEnable(ids) {
  return request({
    url: '/product/isEnable',
    method: 'post',
    data: ids
  })
}

export function isNotEnable(ids) {
  return request({
    url: '/product/isNotEnable',
    method: 'post',
    data: ids
  })
}

export function deleteFreightFare(id) {
  return request({
    url: '/product/delFeight/' + id,
    method: 'get'
  })
}
export function deleteFreightFares(data) {
  return request({
    url: '/product/delList',
    method: 'post',
    data: data
  })
}
