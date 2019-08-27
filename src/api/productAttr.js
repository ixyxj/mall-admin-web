import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/product/selectProductPropByPCPage',
    method:'post',
    data:data
  })
}

export function deleteProductAttr(ids) {
  return request({
    url:'/product/deleteList',
    method:'post',
    data:ids
  })
}

export function createProductAttr(data) {
  return request({
    url:'/product/addProductProp',
    method:'post',
    data:data
  })
}

export function updateProductAttr(data) {
  return request({
    url:'/product/updateProductProp',
    method:'post',
    data:data
  })
}

export function getProductAttr(id) {
  return request({
    url:'/product/'+id,
    method:'get'
  })
}

export function getProductAttrInfo(productCategoryId) {
  return request({
    url:'/product/attrInfo/'+productCategoryId,
    method:'get'
  })
}
