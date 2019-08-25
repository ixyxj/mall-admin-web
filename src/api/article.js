import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url:'/member/selectArticleByPage',
    method:'post',
    data:data
  })
}

export function updateTopStatus(status, ids) {
  if (status === 1) return isTop(ids);
  else return notTop(ids);
}

export function isTop(ids) {
  return request({
    url: '/member/isTop',
    method: 'post',
    data: ids
  })
}

export function notTop(ids) {
  return request({
    url: '/member/notTop',
    method: 'post',
    data: ids
  })
}

export function updateStatus(status, ids) {
  if (status === 1) return isDisplay(ids);
  else return notDisplay(ids);
}

export function isDisplay(ids) {
  return request({
    url: '/member/isADisplay',
    method: 'post',
    data: ids
  })
}

export function notDisplay(ids) {
  return request({
    url: '/member/notADisplay',
    method: 'post',
    data: ids
  })
}

export function deleteArticle(ids) {
  return request({
    url: '/member/deleteList',
    method: 'post',
    data: ids
  })
}

export function fetchListWithCategory() {
  return request({
    url: '/member/selectArticleCategoryAll',
    method: 'post'
  })
}

export function createArticle(data) {
  return request({
    url: '/member/addArticle',
    method: 'post',
    data: data
  })
}

export function updateArticle(data) {
  return request({
    url: '/member/updateArticle',
    method: 'post',
    data: data
  })
}
