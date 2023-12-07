import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-admin-template/user/login',
    url: '/login',
    method: 'post',
    data
  })
}
// 企业微信登录
export function wxLogin(code) {
  return request({
    url: '/Wxlogin/' + code,
    method: 'post'
    // data
  })
}
export function getInfo(token) {
  return request({
    url: '/api/Personal/Detail',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  // debugger
  return request({
    url: '/logout',
    method: 'post'
  }).then((res) => {
    console.log(res, 'tttt')
  })
}
