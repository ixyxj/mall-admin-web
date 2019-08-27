import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/product/selectProductTypeByPCPage',
    method:'post',
    data:data
  })
}

export function createProductAttrCate(data) {
  return request({
    url:'/product/addProductType',
    method:'post',
    data:data
  })
}

export function deleteProductAttrCate(id) {
  return request({
    url:'/product/delProductType/'+id,
    method:'get'
  })
}

export function updateProductAttrCate(data) {
  return request({
    url:'/product/updateProductType',
    method:'post',
    data:data
  })
}
export function fetchListWithAttr() {
  return request({
    url:'/product/category/list/withAttr',
    method:'get'
  })
}
