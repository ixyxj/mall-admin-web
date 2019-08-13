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
  return {
    data: {
      username: 'admin',
      icon: 'http://192.168.2.105/zly.gif',
      roles: [
        'super_admin'
      ]
    }
  }
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
