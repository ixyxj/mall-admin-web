import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/product/selectProductKindByPCPage',
    method: 'post',
    data: params
  })
}

export function deleteProductCate(kindCode) {
  return request({
    url: '/product/delProductKind/' + kindCode,
    method: 'get'
  })
}

export function createProductCate(data) {
  return request({
    url: '/product/addProductKind',
    method: 'post',
    data: data
  })
}

export function updateProductCate(data) {
  return request({
    url: '/product/updateProductKind/',
    method: 'post',
    data: data
  })
}

export function getProductCate(kindCode) {
  return request({
    url: '/product/selectProductKindByKindCode/' + kindCode,
    method: 'get',
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/productCategory/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateNavStatus(data) {
  return request({
    url: '/productCategory/update/navStatus',
    method: 'post',
    data: data
  })
}

export function fetchListWithChildren() {
  return request({
    url: '/productCategory/list/withChildren',
    method: 'get'
  })
}
