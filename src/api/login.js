import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/sys/login',
    method: 'post',
    data: {
      'username': username,
      'password': password,
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
