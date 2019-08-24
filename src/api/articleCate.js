import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url:'/member/selectArticleCategoryPage',
    method:'post',
    data:data
  })
}

export function updateStatus(status, ids) {
  if (status === 1) return isDisplay(ids);
  else return notDisplay(ids);
}

export function isDisplay(ids) {
  return request({
    url: '/member/isDisplay',
    method: 'post',
    data: ids
  })
}

export function notDisplay(ids) {
  return request({
    url: '/member/notDisplay',
    method: 'post',
    data: ids
  })
}

export function deleteArticleCate(ids) {
  return request({
    url: '/member/deleteList',
    method: 'post',
    data: ids
  })
}

export function addArticleCate(data) {
  return request({
    url: '/member/addArticleCategory',
    method: 'post',
    data: data
  })
}
