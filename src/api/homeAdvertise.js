import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/order/selectAdvertByPage',
    method:'post',
    data:data
  })
}

export function updateStatus(status, ids) {
  if (status === 0) return notOnline(ids);
  else return isOnline(ids)
}

function notOnline(ids) {
  return request({
    url:'/order/notOnline',
    method:'post',
    data:ids
  })
}

function isOnline(ids) {
  return request({
    url:'/order/isOnline',
    method:'post',
    data:ids
  })
}

export function deleteHomeAdvertise(code) {
  return request({
    url:'/order/delAdvert/' + code,
    method:'get'
  })
}
export function createHomeAdvertise(data) {
  return request({
    url:'/order/addAdvert',
    method:'post',
    data:data
  })
}
export function getHomeAdvertise(id) {
  return request({
    url:'/home/advertise/'+id,
    method:'get',
  })
}

export function updateHomeAdvertise(id,data) {
  return request({
    url:'/home/advertise/update/'+id,
    method:'post',
    data:data
  })
}
